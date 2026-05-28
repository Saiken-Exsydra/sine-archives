import {
  getArchiveRegistry,
  resolveArchiveRef,
  scanMarkdownForArchiveRefs,
} from "../src/utils/archive-ref-core.mjs";

const registry = getArchiveRegistry();
const problems = [...registry.problems];

for (const entry of registry.actualEntries) {
  const scan = scanMarkdownForArchiveRefs(entry.body);

  for (const error of scan.errors) {
    problems.push({
      type: "malformed-wiki-ref",
      filePath: entry.filePath,
      message: `${entry.filePath}:${error.position.line}:${error.position.column} ${error.message}`,
    });
  }

  for (const ref of scan.refs) {
    const resolved = resolveArchiveRef({
      ref: ref,
      currentSection: entry.section,
      currentSlug: entry.slug,
      locale: entry.locale,
    });

    if (!resolved.exists) {
      problems.push({
        type: resolved.reason,
        filePath: entry.filePath,
        message: `${entry.filePath}:${ref.position.line}:${ref.position.column} ${resolved.message}`,
      });
    }
  }
}

if (problems.length > 0) {
  console.error("[archive-refs] Validation failed.\n");
  for (const problem of problems) {
    console.error(`- ${problem.message}`);
  }
  process.exit(1);
}

console.log("[archive-refs] Validation passed.");
