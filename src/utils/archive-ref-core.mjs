import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { ARCHIVE_REF_OVERRIDES } from "../data/archiveRefs.mjs";

const PROJECT_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const VALID_LOCALES = ["en", "pt-br"];
const DEFAULT_LOCALE = "en";
const CONTENT_SECTIONS = [
  "characters",
  "organizations",
  "sine",
  "places",
  "apparatus",
  "systems",
  "cosmology",
];
const CHARACTER_CODEX_GLOB = "The Archive/Characters/*.md";
const CODEX_TARGET_PREFIX = "codex";

let previewIdCounter = 0;
let registryCache = null;

function stripBom(value) {
  return value.replace(/^\uFEFF/, "");
}

function normalizeLineEndings(value) {
  return value.replace(/\r\n?/g, "\n");
}

function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function normalizeLookupKey(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeScopedKey(section, id) {
  return `${section}:${normalizeLookupKey(id)}`;
}

function normalizeArchiveKey(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function normalizeLocale(locale) {
  return VALID_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

function splitFrontmatter(source) {
  const normalized = normalizeLineEndings(stripBom(source));
  if (!normalized.startsWith("---\n")) {
    return { frontmatter: "", body: normalized };
  }

  const endIndex = normalized.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { frontmatter: "", body: normalized };
  }

  return {
    frontmatter: normalized.slice(4, endIndex),
    body: normalized.slice(endIndex + 5),
  };
}

function parseSimpleFrontmatter(frontmatter) {
  const data = {};
  let currentArrayKey = null;

  for (const rawLine of frontmatter.split("\n")) {
    const line = rawLine.replace(/\t/g, "  ");
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const arrayMatch = line.match(/^\s*-\s+(.*)$/);
    if (arrayMatch && currentArrayKey) {
      data[currentArrayKey].push(stripQuotes(arrayMatch[1]));
      continue;
    }

    currentArrayKey = null;
    const pairMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!pairMatch) continue;

    const [, key, rawValue] = pairMatch;
    if (!rawValue.trim()) {
      data[key] = [];
      currentArrayKey = key;
      continue;
    }

    data[key] = stripQuotes(rawValue);
  }

  return data;
}

function getContentContextFromPath(filePath) {
  const normalized = filePath.split(path.sep).join("/");
  const match = normalized.match(/src\/content\/([^/]+)\/([^/]+)\.md$/);
  if (!match) return null;

  const [, folder, slug] = match;
  const folderMatch = folder.match(/^(.+?)_(en|pt_br)$/);
  if (!folderMatch) return null;

  const [, section, rawLocale] = folderMatch;
  if (!CONTENT_SECTIONS.includes(section)) return null;

  return {
    filePath,
    section,
    slug: slug.toLowerCase(),
    locale: rawLocale === "pt_br" ? "pt-br" : "en",
  };
}

function extractExplicitAnchors(body) {
  const anchors = new Set();
  const headingPattern = /^(#{2,6})\s+.*\s\{#([A-Za-z0-9][\w-]*)\}\s*$/gm;

  for (const match of body.matchAll(headingPattern)) {
    anchors.add(match[2]);
  }

  return anchors;
}

function buildContentEntries() {
  const files = fg.sync("src/content/**/*.md", {
    cwd: PROJECT_ROOT,
    absolute: true,
    onlyFiles: true,
  });

  const actualEntries = [];

  for (const filePath of files) {
    const context = getContentContextFromPath(filePath);
    if (!context) continue;

    const source = readFileSync(filePath, "utf8");
    const { frontmatter, body } = splitFrontmatter(source);
    const data = parseSimpleFrontmatter(frontmatter);

    actualEntries.push({
      ...context,
      body,
      status: String(data.status ?? "").trim(),
      title: String(data.title ?? "").trim(),
      summary: String(data.summary ?? "").trim(),
      preview: String(data.preview ?? "").trim(),
      refId: String(data.ref_id ?? "").trim(),
      codexFile: String(data.codex_file ?? "").trim(),
      aliases: Array.isArray(data.aliases) ? data.aliases.map((item) => String(item).trim()).filter(Boolean) : [],
      explicitAnchors: extractExplicitAnchors(body),
      source,
    });
  }

  return actualEntries;
}

function createCanonicalEntries(actualEntries) {
  const canonicalEntries = new Map();

  for (const entry of actualEntries) {
    const key = `${entry.section}:${entry.slug}`;
    const existing = canonicalEntries.get(key) ?? {
      section: entry.section,
      slug: entry.slug,
      byLocale: {},
    };

    existing.byLocale[entry.locale] = entry;
    canonicalEntries.set(key, existing);
  }

  return canonicalEntries;
}

function buildCodexEntries(canonicalEntries) {
  const codexFiles = fg.sync(CHARACTER_CODEX_GLOB, {
    cwd: PROJECT_ROOT,
    absolute: true,
    onlyFiles: true,
  });
  const codexFileMap = new Map();

  for (const filePath of codexFiles) {
    const fileName = path.basename(filePath);
    if (fileName.toLowerCase() === "readme.md") continue;
    codexFileMap.set(normalizeArchiveKey(fileName.replace(/\.md$/i, "")), {
      fileName,
      filePath,
    });
  }

  const codexEntries = new Map();

  for (const canonicalEntry of canonicalEntries.values()) {
    if (canonicalEntry.section !== "characters") continue;

    const localeEntries = Object.values(canonicalEntry.byLocale);
    const sourceEntry = localeEntries.find((entry) => entry.codexFile) ?? localeEntries[0];
    if (!sourceEntry?.codexFile) continue;

    const codexKey = normalizeArchiveKey(sourceEntry.codexFile.replace(/\.md$/i, ""));
    const codexFile = codexFileMap.get(codexKey);
    if (!codexFile) continue;

    const source = readFileSync(codexFile.filePath, "utf8");
    const { body } = splitFrontmatter(source);
    codexEntries.set(canonicalEntry.slug, {
      section: canonicalEntry.section,
      slug: canonicalEntry.slug,
      fileName: codexFile.fileName,
      filePath: codexFile.filePath,
      explicitAnchors: extractExplicitAnchors(body),
      byLocale: Object.fromEntries(
        VALID_LOCALES.map((locale) => {
          const effectiveEntry = getEffectiveEntry(canonicalEntry, locale);
          return [
            locale,
            effectiveEntry
              ? {
                  title: effectiveEntry.title,
                  preview: effectiveEntry.preview || effectiveEntry.summary || "",
                }
              : null,
          ];
        }),
      ),
    });
  }

  return codexEntries;
}

function getEffectiveEntry(canonicalEntry, locale) {
  return canonicalEntry.byLocale[locale] ?? canonicalEntry.byLocale[DEFAULT_LOCALE] ?? null;
}

function getEffectiveOverrides(locale) {
  const normalizedLocale = normalizeLocale(locale);
  const base = Array.isArray(ARCHIVE_REF_OVERRIDES[DEFAULT_LOCALE]) ? ARCHIVE_REF_OVERRIDES[DEFAULT_LOCALE] : [];
  if (normalizedLocale === DEFAULT_LOCALE) return base;

  const localized = Array.isArray(ARCHIVE_REF_OVERRIDES[normalizedLocale]) ? ARCHIVE_REF_OVERRIDES[normalizedLocale] : [];
  const merged = new Map();

  for (const item of base) {
    merged.set(normalizeLookupKey(item.id), item);
  }
  for (const item of localized) {
    merged.set(normalizeLookupKey(item.id), item);
  }

  return [...merged.values()];
}

function parseRefTarget(target) {
  const trimmed = String(target ?? "").trim();
  if (!trimmed) {
    return { valid: false, reason: "empty-target" };
  }

  const hashIndex = trimmed.indexOf("#");
  const targetPart = hashIndex === -1 ? trimmed : trimmed.slice(0, hashIndex);
  const anchor = hashIndex === -1 ? "" : trimmed.slice(hashIndex + 1).trim();

  if (!targetPart) {
    return { valid: false, reason: "missing-target" };
  }

  let section = null;
  let id = targetPart.trim();
  if (targetPart.includes(":")) {
    const [rawSection, ...rest] = targetPart.split(":");
    section = rawSection.trim();
    id = rest.join(":").trim();
    if (section === CODEX_TARGET_PREFIX) {
      if (!id) {
        return { valid: false, reason: "missing-codex-id", section };
      }

      return {
        valid: true,
        targetType: "codex",
        section: "characters",
        id,
        anchor,
        rawTarget: trimmed,
      };
    }
    if (!CONTENT_SECTIONS.includes(section)) {
      return { valid: false, reason: "unknown-section", section };
    }
    if (!id) {
      return { valid: false, reason: "missing-scoped-id", section };
    }
  }

  return {
    valid: true,
    targetType: "archive",
    section,
    id,
    anchor,
    rawTarget: trimmed,
  };
}

export function parseArchiveRefMarkup(rawMarkup) {
  const inner = String(rawMarkup ?? "").trim();
  if (!inner) {
    return { valid: false, reason: "empty-wiki-ref" };
  }

  const pipeIndex = inner.indexOf("|");
  const rawTarget = pipeIndex === -1 ? inner : inner.slice(0, pipeIndex).trim();
  const rawLabel = pipeIndex === -1 ? "" : inner.slice(pipeIndex + 1).trim();

  if (!rawTarget) {
    return { valid: false, reason: "empty-target" };
  }
  if (pipeIndex !== -1 && !rawLabel) {
    return { valid: false, reason: "empty-label" };
  }

  const parsedTarget = parseRefTarget(rawTarget);
  if (!parsedTarget.valid) {
    return { valid: false, reason: parsedTarget.reason, rawTarget };
  }

  return {
    valid: true,
    raw: inner,
    rawTarget,
    label: rawLabel || null,
    target: parsedTarget,
  };
}

export function tokenizeArchiveRefText(text) {
  const source = String(text ?? "");
  const segments = [];
  const errors = [];
  let cursor = 0;

  while (cursor < source.length) {
    const openIndex = source.indexOf("[[", cursor);
    const strayCloseIndex = source.indexOf("]]", cursor);

    if (strayCloseIndex !== -1 && (openIndex === -1 || strayCloseIndex < openIndex)) {
      errors.push({
        message: "Malformed wiki reference: found closing `]]` without matching `[[`.",
        index: strayCloseIndex,
      });
      if (strayCloseIndex > cursor) {
        segments.push({ type: "text", value: source.slice(cursor, strayCloseIndex) });
      }
      segments.push({ type: "text", value: "]]" });
      cursor = strayCloseIndex + 2;
      continue;
    }

    if (openIndex === -1) {
      segments.push({ type: "text", value: source.slice(cursor) });
      break;
    }

    if (openIndex > cursor) {
      segments.push({ type: "text", value: source.slice(cursor, openIndex) });
    }

    const closeIndex = source.indexOf("]]", openIndex + 2);
    if (closeIndex === -1) {
      errors.push({
        message: "Malformed wiki reference: missing closing `]]`.",
        index: openIndex,
      });
      segments.push({ type: "text", value: source.slice(openIndex) });
      break;
    }

    const inner = source.slice(openIndex + 2, closeIndex);
    if (inner.includes("[[")) {
      errors.push({
        message: "Malformed wiki reference: nested `[[` is not supported.",
        index: openIndex,
      });
      segments.push({ type: "text", value: source.slice(openIndex, closeIndex + 2) });
      cursor = closeIndex + 2;
      continue;
    }

    const parsed = parseArchiveRefMarkup(inner);
    if (!parsed.valid) {
      errors.push({
        message: `Malformed wiki reference: ${parsed.reason}.`,
        index: openIndex,
      });
      segments.push({ type: "text", value: source.slice(openIndex, closeIndex + 2) });
      cursor = closeIndex + 2;
      continue;
    }

    segments.push({
      type: "ref",
      value: source.slice(openIndex, closeIndex + 2),
      inner,
      parsed,
    });
    cursor = closeIndex + 2;
  }

  return {
    segments: segments.filter((segment) => segment.type !== "text" || segment.value.length > 0),
    errors,
  };
}

function walkMarkdownTree(node, visitor, parent = null) {
  if (!node || typeof node !== "object") return;
  visitor(node, parent);
  if (!Array.isArray(node.children)) return;
  for (const child of node.children) {
    walkMarkdownTree(child, visitor, node);
  }
}

export function scanMarkdownForArchiveRefs(markdown) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const refs = [];
  const errors = [];

  walkMarkdownTree(tree, (node, parent) => {
    if (!node || node.type !== "text") return;
    if (!node.value || !node.position) return;
    if (parent && (parent.type === "code" || parent.type === "inlineCode")) return;

    const { segments, errors: tokenErrors } = tokenizeArchiveRefText(node.value);
    const startLine = node.position.start.line;
    const startColumn = node.position.start.column;

    let consumed = 0;
    for (const segment of segments) {
      if (segment.type === "ref") {
        refs.push({
          ...segment.parsed,
          rawText: segment.value,
          position: {
            line: startLine,
            column: startColumn + consumed,
          },
        });
      }
      consumed += segment.value.length;
    }

    for (const error of tokenErrors) {
      errors.push({
        message: error.message,
        position: {
          line: startLine,
          column: startColumn + error.index,
        },
      });
    }
  });

  return { refs, errors };
}

function addNamespaceKey(map, key, value) {
  const normalizedKey = normalizeLookupKey(key);
  if (!normalizedKey) return;
  const list = map.get(normalizedKey) ?? [];
  list.push(value);
  map.set(normalizedKey, list);
}

function buildRegistry() {
  const actualEntries = buildContentEntries();
  const canonicalEntries = createCanonicalEntries(actualEntries);
  const codexEntries = buildCodexEntries(canonicalEntries);
  const entryNamespaces = {
    en: new Map(),
    "pt-br": new Map(),
  };
  const bareEntryKeySources = {
    en: new Map(),
    "pt-br": new Map(),
  };
  const overridesByLocale = {
    en: new Map(),
    "pt-br": new Map(),
  };
  const problems = [];

  for (const locale of VALID_LOCALES) {
    for (const canonicalEntry of canonicalEntries.values()) {
      const effectiveEntry = getEffectiveEntry(canonicalEntry, locale);
      if (!effectiveEntry || effectiveEntry.status !== "public") continue;

      const directId = normalizeLookupKey(effectiveEntry.refId || canonicalEntry.slug);
      const keys = new Set([
        directId,
        normalizeScopedKey(canonicalEntry.section, canonicalEntry.slug),
      ]);
      const bareKeys = new Map([
        [
          directId,
          {
            sourceType: effectiveEntry.refId ? "ref-id" : "slug",
            filePath: effectiveEntry.filePath,
            section: canonicalEntry.section,
            slug: canonicalEntry.slug,
          },
        ],
      ]);

      if (effectiveEntry.refId) {
        keys.add(normalizeScopedKey(canonicalEntry.section, effectiveEntry.refId));
      }

      for (const alias of effectiveEntry.aliases) {
        const normalizedAlias = normalizeLookupKey(alias);
        keys.add(normalizedAlias);
        bareKeys.set(normalizedAlias, {
          sourceType: "alias",
          filePath: effectiveEntry.filePath,
          section: canonicalEntry.section,
          slug: canonicalEntry.slug,
        });
      }

      for (const key of keys) {
        addNamespaceKey(entryNamespaces[locale], key, {
          kind: "entry",
          section: canonicalEntry.section,
          slug: canonicalEntry.slug,
        });
      }

      for (const [key, value] of bareKeys.entries()) {
        const existing = bareEntryKeySources[locale].get(key) ?? [];
        existing.push(value);
        bareEntryKeySources[locale].set(key, existing);
      }
    }

    for (const override of getEffectiveOverrides(locale)) {
      const normalizedId = normalizeLookupKey(override.id);
      if (!normalizedId) {
        problems.push({
          type: "invalid-override",
          locale,
          message: "Override is missing `id`.",
        });
        continue;
      }

      if (overridesByLocale[locale].has(normalizedId)) {
        problems.push({
          type: "duplicate-override-id",
          locale,
          id: override.id,
          message: `Duplicate override id \`${override.id}\` in locale \`${locale}\`.`,
        });
        continue;
      }

      const target = parseRefTarget(override.target);
      if (!target.valid) {
        problems.push({
          type: "invalid-override-target",
          locale,
          id: override.id,
          message: `Override \`${override.id}\` has an invalid target \`${override.target}\`.`,
        });
        continue;
      }

      if (target.targetType === "codex") {
        const codexEntry = codexEntries.get(target.id.toLowerCase());
        if (!codexEntry) {
          problems.push({
            type: "missing-override-target",
            locale,
            id: override.id,
            message: `Override \`${override.id}\` points to missing codex target \`${override.target}\`.`,
          });
        } else if (target.anchor && !codexEntry.explicitAnchors.has(target.anchor)) {
          problems.push({
            type: "missing-override-anchor",
            locale,
            id: override.id,
            message: `Override \`${override.id}\` points to missing explicit codex heading id \`{#${target.anchor}}\` on \`${override.target}\`.`,
          });
        }
      } else {
        if (!target.section) {
          problems.push({
            type: "invalid-override-target",
            locale,
            id: override.id,
            message: `Override \`${override.id}\` must target a scoped entry like \`section:slug\` or \`codex:character-slug\`.`,
          });
          continue;
        }

        const canonicalKey = `${target.section}:${target.id}`;
        if (!canonicalEntries.has(canonicalKey)) {
          problems.push({
            type: "missing-override-target",
            locale,
            id: override.id,
            message: `Override \`${override.id}\` points to missing target \`${override.target}\`.`,
          });
        } else {
          const effectiveEntry = getEffectiveEntry(canonicalEntries.get(canonicalKey), locale);
          if (target.anchor && (!effectiveEntry || !effectiveEntry.explicitAnchors.has(target.anchor))) {
            problems.push({
              type: "missing-override-anchor",
              locale,
              id: override.id,
              message: `Override \`${override.id}\` points to missing explicit heading id \`{#${target.anchor}}\` on \`${override.target}\`.`,
            });
          }
        }
      }

      overridesByLocale[locale].set(normalizedId, {
        ...override,
        parsedTarget: target,
      });

      const keys = [override.id, ...(Array.isArray(override.aliases) ? override.aliases : [])];
      for (const key of keys) {
        const normalizedKey = normalizeLookupKey(key);
        if (!normalizedKey) continue;

        if (entryNamespaces[locale].has(normalizedKey)) {
          problems.push({
            type: "override-entry-collision",
            locale,
            id: key,
            message: `Override key \`${key}\` collides with an entry id or alias in locale \`${locale}\`.`,
          });
        }
      }
    }

    const seenOverrideAliases = new Set();
    for (const override of overridesByLocale[locale].values()) {
      const keys = [override.id, ...(Array.isArray(override.aliases) ? override.aliases : [])];
      for (const key of keys) {
        const normalizedKey = normalizeLookupKey(key);
        if (!normalizedKey) continue;
        if (seenOverrideAliases.has(normalizedKey)) {
          problems.push({
            type: "duplicate-override-alias",
            locale,
            id: key,
            message: `Duplicate override id/alias \`${key}\` in locale \`${locale}\`.`,
          });
        }
        seenOverrideAliases.add(normalizedKey);
      }
    }

    for (const [key, sources] of bareEntryKeySources[locale].entries()) {
      const distinctTargets = new Set(sources.map((source) => `${source.section}:${source.slug}`));
      if (distinctTargets.size <= 1) continue;

      const hasCustomKey = sources.some((source) => source.sourceType !== "slug");
      if (!hasCustomKey) continue;

      problems.push({
        type: "duplicate-entry-key",
        locale,
        id: key,
        message: `Duplicate entry ref key \`${key}\` in locale \`${locale}\`. Custom ids and aliases must be unique.`,
      });
    }
  }

  for (const locale of VALID_LOCALES) {
    const routeKeys = new Map();
    for (const canonicalEntry of canonicalEntries.values()) {
      const effectiveEntry = getEffectiveEntry(canonicalEntry, locale);
      if (!effectiveEntry || effectiveEntry.status !== "public") continue;
      const routeKey = `${locale}:${canonicalEntry.section}:${canonicalEntry.slug.toLowerCase()}`;
      const existing = routeKeys.get(routeKey) ?? [];
      existing.push(effectiveEntry.filePath);
      routeKeys.set(routeKey, existing);
    }

    for (const [routeKey, files] of routeKeys.entries()) {
      if (files.length > 1) {
        const [, section, slug] = routeKey.split(":");
        problems.push({
          type: "duplicate-public-slug",
          locale,
          section,
          slug,
          message: `Duplicate public slug \`${slug}\` detected in section \`${section}\` for locale \`${locale}\`.`,
        });
      }
    }
  }

  return {
    actualEntries,
    canonicalEntries,
    codexEntries,
    entryNamespaces,
    overridesByLocale,
    problems,
  };
}

export function getArchiveRegistry() {
  registryCache ??= buildRegistry();
  return registryCache;
}

export function getArchiveContextFromFile(filePath) {
  return getContentContextFromPath(filePath);
}

export function buildRelativeArchiveHref({
  currentSection,
  currentSlug,
  targetSection,
  targetSlug,
  anchor = "",
}) {
  const cleanAnchor = String(anchor ?? "").trim();
  const anchorSuffix = cleanAnchor ? `#${cleanAnchor}` : "";

  if (currentSection === targetSection) {
    if (currentSlug === targetSlug) {
      return cleanAnchor ? `#${cleanAnchor}` : "./";
    }
    return `../${targetSlug}/${anchorSuffix}`;
  }

  return `../../${targetSection}/${targetSlug}/${anchorSuffix}`;
}

export function buildRelativeCodexHref({
  currentSection,
  currentSlug,
  targetSlug,
  anchor = "",
}) {
  const cleanAnchor = String(anchor ?? "").trim();
  const anchorSuffix = cleanAnchor ? `#${cleanAnchor}` : "";

  if (currentSection === "characters") {
    if (currentSlug === targetSlug) {
      return `codex/${anchorSuffix}`;
    }

    return `../${targetSlug}/codex/${anchorSuffix}`;
  }

  return `../../characters/${targetSlug}/codex/${anchorSuffix}`;
}

function resolveCanonicalTarget(registry, locale, target) {
  if (target.targetType === "codex") {
    const codexEntry = registry.codexEntries.get(target.id.toLowerCase());
    if (!codexEntry) {
      return {
        ok: false,
        reason: "unknown-target",
        message: `Unknown codex target \`${target.rawTarget}\`.`,
      };
    }

    const effectiveCodex = codexEntry.byLocale[normalizeLocale(locale)] ?? codexEntry.byLocale[DEFAULT_LOCALE] ?? null;
    return { ok: true, codexEntry, effectiveCodex };
  }

  const normalizedLocale = normalizeLocale(locale);
  if (target.section) {
    const scopedMatches =
      registry.entryNamespaces[normalizedLocale].get(normalizeScopedKey(target.section, target.id)) ?? [];

    if (scopedMatches.length === 0) {
      return {
        ok: false,
        reason: "unknown-target",
        message: `Unknown archive target \`${target.rawTarget}\`.`,
      };
    }

    if (scopedMatches.length > 1) {
      return {
        ok: false,
        reason: "ambiguous-target",
        message: `Archive target \`${target.rawTarget}\` resolves to multiple entries.`,
      };
    }

    const match = scopedMatches[0];
    const canonicalEntry = registry.canonicalEntries.get(`${match.section}:${match.slug}`);
    const effectiveEntry = canonicalEntry ? getEffectiveEntry(canonicalEntry, normalizedLocale) : null;
    if (!canonicalEntry || !effectiveEntry || effectiveEntry.status !== "public") {
      return {
        ok: false,
        reason: "unknown-target",
        message: `Target \`${target.rawTarget}\` is not public in locale \`${normalizedLocale}\`.`,
      };
    }
    return { ok: true, canonicalEntry, effectiveEntry };
  }

  const override = registry.overridesByLocale[normalizedLocale].get(normalizeLookupKey(target.id));
  if (override) {
    return resolveCanonicalTarget(registry, normalizedLocale, override.parsedTarget);
  }

  const matches = registry.entryNamespaces[normalizedLocale].get(normalizeLookupKey(target.id)) ?? [];
  if (matches.length === 0) {
    return {
      ok: false,
      reason: "unknown-target",
      message: `Unknown archive target \`${target.rawTarget}\`.`,
    };
  }
  if (matches.length > 1) {
    return {
      ok: false,
      reason: "ambiguous-target",
      message: `Archive target \`${target.rawTarget}\` is ambiguous. Use a scoped id like \`section:${target.id}\`.`,
    };
  }

  const match = matches[0];
  const canonicalEntry = registry.canonicalEntries.get(`${match.section}:${match.slug}`);
  const effectiveEntry = canonicalEntry ? getEffectiveEntry(canonicalEntry, normalizedLocale) : null;
  if (!canonicalEntry || !effectiveEntry || effectiveEntry.status !== "public") {
    return {
      ok: false,
      reason: "unknown-target",
      message: `Unknown archive target \`${target.rawTarget}\`.`,
    };
  }

  return { ok: true, canonicalEntry, effectiveEntry };
}

export function resolveArchiveRef({ ref, currentSection, currentSlug, locale }) {
  const registry = getArchiveRegistry();
  const normalizedLocale = normalizeLocale(locale);
  const parsed = typeof ref === "string" ? parseArchiveRefMarkup(ref) : ref;

  if (!parsed || !parsed.valid) {
    return {
      exists: false,
      reason: parsed?.reason ?? "invalid-ref",
      message: `Malformed archive reference.`,
    };
  }

  const override = parsed.target.targetType === "codex" || parsed.target.section
    ? null
    : registry.overridesByLocale[normalizedLocale].get(normalizeLookupKey(parsed.target.id));
  const targetToResolve = override ? override.parsedTarget : parsed.target;
  const canonicalResult = resolveCanonicalTarget(registry, normalizedLocale, targetToResolve);

  if (!canonicalResult.ok) {
    return {
      exists: false,
      reason: canonicalResult.reason,
      message: canonicalResult.message,
    };
  }

  const anchor = override?.parsedTarget.anchor || parsed.target.anchor || "";
  const label = parsed.label || override?.label;
  const preview = override?.preview || "";
  const targetTitle = override?.previewTitle || override?.label || "";

  if (targetToResolve.targetType === "codex") {
    const { codexEntry, effectiveCodex } = canonicalResult;
    if (anchor && !codexEntry.explicitAnchors.has(anchor)) {
      return {
        exists: false,
        reason: "missing-anchor",
        message: `Target \`codex:${codexEntry.slug}#${anchor}\` is missing explicit heading id \`{#${anchor}}\`.`,
        target: {
          section: codexEntry.section,
          slug: codexEntry.slug,
        },
      };
    }

    return {
      exists: true,
      href: buildRelativeCodexHref({
        currentSection,
        currentSlug,
        targetSlug: codexEntry.slug,
        anchor,
      }),
      label: label || targetTitle || effectiveCodex?.title || codexEntry.slug,
      preview: preview || effectiveCodex?.preview || "",
      targetTitle: targetTitle || effectiveCodex?.title || "Character Codex",
      targetSection: codexEntry.section,
      targetSlug: codexEntry.slug,
      targetKind: "codex",
      targetKey: `codex:${codexEntry.slug}`,
      anchor,
      locale: normalizedLocale,
    };
  }

  const { canonicalEntry, effectiveEntry } = canonicalResult;
  if (anchor && !effectiveEntry.explicitAnchors.has(anchor)) {
    return {
      exists: false,
      reason: "missing-anchor",
      message: `Target \`${canonicalEntry.section}:${canonicalEntry.slug}#${anchor}\` is missing explicit heading id \`{#${anchor}}\`.`,
      target: {
        section: canonicalEntry.section,
        slug: canonicalEntry.slug,
      },
    };
  }

  return {
    exists: true,
    href: buildRelativeArchiveHref({
      currentSection,
      currentSlug,
      targetSection: canonicalEntry.section,
      targetSlug: canonicalEntry.slug,
      anchor,
    }),
    label: label || effectiveEntry.title,
    preview: preview || effectiveEntry.preview || effectiveEntry.summary || "",
    targetTitle: targetTitle || effectiveEntry.title,
    targetSection: canonicalEntry.section,
    targetSlug: canonicalEntry.slug,
    targetKind: "archive",
    targetKey: `${canonicalEntry.section}:${canonicalEntry.slug}`,
    anchor,
    locale: normalizedLocale,
  };
}

export function nextArchiveRefPreviewId() {
  previewIdCounter += 1;
  return `archive-ref-preview-${previewIdCounter}`;
}

export function renderArchiveRefHtml(resolved, { previewId } = {}) {
  const href = escapeAttribute(resolved.href);
  const label = escapeHtml(resolved.label);
  const targetTitle = escapeHtml(resolved.targetTitle || resolved.label);
  const preview = String(resolved.preview ?? "").trim();
  const describedBy = preview && previewId ? ` aria-describedby="${escapeAttribute(previewId)}"` : "";

  if (!preview) {
    return `<span class="archive-ref"><a class="archive-ref__link" href="${href}" data-archive-ref-target="${escapeAttribute(
      resolved.targetKey || `${resolved.targetSection}:${resolved.targetSlug}`
    )}">${label}</a></span>`;
  }

  return `<span class="archive-ref archive-ref--with-preview"><a class="archive-ref__link" href="${href}" data-archive-ref-target="${escapeAttribute(
    resolved.targetKey || `${resolved.targetSection}:${resolved.targetSlug}`
  )}"${describedBy}>${label}</a><span class="archive-ref__preview" id="${escapeAttribute(
    previewId
  )}" role="tooltip"><span class="archive-ref__preview-title">${targetTitle}</span><span class="archive-ref__preview-text">${escapeHtml(
    preview
  )}</span></span></span>`;
}
