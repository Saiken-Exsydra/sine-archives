import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import {
  getArchiveRegistry,
  resolveArchiveRef,
  tokenizeArchiveRefText,
} from "../src/utils/archive-ref-core.mjs";
import { ARCHIVE_REF_AUDIT_TERMS } from "../src/data/archiveRefAuditTerms.mjs";

const MAX_SAMPLES_PER_TERM = 5;
const parser = unified().use(remarkParse).use(remarkGfm);

function walkMarkdownTree(node, visitor, parent = null) {
  if (!node || typeof node !== "object") return;
  visitor(node, parent);
  if (!Array.isArray(node.children)) return;
  for (const child of node.children) {
    walkMarkdownTree(child, visitor, node);
  }
}

function compileCandidates() {
  return ARCHIVE_REF_AUDIT_TERMS.map((term) => ({
    ...term,
    regexes: term.patterns.map((pattern) => new RegExp(pattern, "g")),
  }));
}

function collectEntryHits(entry, candidates) {
  const tree = parser.parse(entry.body);
  const hits = [];
  const seen = new Set();

  walkMarkdownTree(tree, (node, parent) => {
    if (node?.type !== "text" || !node.value || !node.position) return;
    if (
      parent &&
      [
        "code",
        "inlineCode",
        "link",
        "image",
        "definition",
        "linkReference",
      ].includes(parent.type)
    ) {
      return;
    }

    const { segments } = tokenizeArchiveRefText(node.value);
    let lineNumber = node.position.start.line;

    for (const segment of segments) {
      if (segment.type !== "text") {
        const segmentLines = segment.value.split("\n");
        lineNumber += segmentLines.length - 1;
        continue;
      }

      const lines = segment.value.split("\n");
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const currentLine = lineNumber + index;
        if (!line.trim()) continue;

        for (const candidate of candidates) {
          for (const regex of candidate.regexes) {
            regex.lastIndex = 0;
            for (let match = regex.exec(line); match; match = regex.exec(line)) {
              const key = `${candidate.ref}:${entry.filePath}:${currentLine}:${match.index}`;
              if (seen.has(key)) continue;
              seen.add(key);

              hits.push({
                ref: candidate.ref,
                label: candidate.label,
                filePath: entry.filePath,
                line: currentLine,
                column: match.index + 1,
                snippet: line.trim(),
              });
            }
          }
        }
      }

      lineNumber += lines.length - 1;
    }
  });

  return hits;
}

function summarizeHits(entries, candidates) {
  const summary = new Map();

  for (const entry of entries) {
    for (const candidate of candidates) {
      const resolved = resolveArchiveRef({
        ref: candidate.ref,
        currentSection: entry.section,
        currentSlug: entry.slug,
        locale: entry.locale,
      });

      if (!resolved.exists) {
        throw new Error(
          `Audit term \`${candidate.ref}\` does not resolve from ${entry.filePath}: ${resolved.message}`,
        );
      }
    }

    const hits = collectEntryHits(entry, candidates);
    for (const hit of hits) {
      const existing = summary.get(hit.ref) ?? {
        ref: hit.ref,
        label: hit.label,
        count: 0,
        files: new Set(),
        samples: [],
      };

      existing.count += 1;
      existing.files.add(hit.filePath);
      if (existing.samples.length < MAX_SAMPLES_PER_TERM) {
        existing.samples.push(hit);
      }

      summary.set(hit.ref, existing);
    }
  }

  return [...summary.values()].sort((left, right) => {
    if (right.count !== left.count) return right.count - left.count;
    return left.label.localeCompare(right.label);
  });
}

function toRepoPath(filePath) {
  return filePath.replace(/\\/g, "/").replace(/^.*?sine-archives\//, "");
}

function renderMarkdown(results) {
  const lines = [
    "# Archive Reference Audit",
    "",
    "Generated from current `src/content/**/*.md` bodies.",
    "",
    "Notes:",
    "- Existing wiki refs are excluded.",
    "- Code blocks, inline code, and ordinary Markdown links are skipped.",
    "- Counts are editorial opportunities, not mandatory replacements.",
    "",
  ];

  if (results.length === 0) {
    lines.push("No candidate terms found.");
    return `${lines.join("\n")}\n`;
  }

  lines.push("## Summary", "");
  lines.push("| Term | Ref id | Hits | Files |");
  lines.push("| --- | --- | ---: | ---: |");
  for (const result of results) {
    lines.push(
      `| ${result.label} | \`${result.ref}\` | ${result.count} | ${result.files.size} |`,
    );
  }

  lines.push("", "## Sample Hits", "");

  for (const result of results) {
    lines.push(`### ${result.label} (\`${result.ref}\`)`, "");
    for (const sample of result.samples) {
      lines.push(
        `- \`${toRepoPath(sample.filePath)}:${sample.line}\` ${sample.snippet}`,
      );
    }
    if (result.count > result.samples.length) {
      lines.push(`- ...and ${result.count - result.samples.length} more hit(s).`);
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

const registry = getArchiveRegistry();
const candidates = compileCandidates();
const publicEntries = registry.actualEntries.filter((entry) => entry.status === "public");
const results = summarizeHits(publicEntries, candidates).filter((result) => result.count > 0);

process.stdout.write(renderMarkdown(results));
