import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkArchiveHeadingIds from "./remark-archive-heading-ids.mjs";

const ARCHIVE_CHARACTERS_DIR = fileURLToPath(
  new URL("../../The Archive/Characters/", import.meta.url),
);

type CharacterLike = {
  slug: string;
  data?: {
    title?: unknown;
    codex_file?: unknown;
  };
};

type ArchiveRecord = {
  fileName: string;
  filePath: string;
  key: string;
};

export type CharacterCodexRecord = {
  exists: boolean;
  fileName: string | null;
  archivePath: string | null;
  html: string | null;
};

let archiveRecordsPromise: Promise<ArchiveRecord[]> | null = null;
const markdownCache = new Map<string, Promise<string>>();

function normalizeArchiveKey(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

async function getArchiveRecords(): Promise<ArchiveRecord[]> {
  archiveRecordsPromise ??= readdir(ARCHIVE_CHARACTERS_DIR, { withFileTypes: true }).then((entries) =>
    entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
      .filter((entry) => entry.name.toLowerCase() !== "readme.md")
      .map((entry) => ({
        fileName: entry.name,
        filePath: path.join(ARCHIVE_CHARACTERS_DIR, entry.name),
        key: normalizeArchiveKey(entry.name.replace(/\.md$/i, "")),
      })),
  );

  return archiveRecordsPromise;
}

function getCandidateKeys(entry: CharacterLike): string[] {
  const rawCodexFile = String(entry.data?.codex_file ?? "").trim();
  const rawTitle = String(entry.data?.title ?? "").trim();
  const slugWords = entry.slug.replace(/-/g, " ");
  const slugCompact = entry.slug.replace(/-/g, "");
  const codexBaseName = rawCodexFile.replace(/\.md$/i, "");
  const candidates = [rawCodexFile, codexBaseName, rawTitle, slugWords, slugCompact];

  return candidates
    .map(normalizeArchiveKey)
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);
}

async function findArchiveRecord(entry: CharacterLike): Promise<ArchiveRecord | null> {
  const archiveRecords = await getArchiveRecords();
  const candidateKeys = getCandidateKeys(entry);
  const explicitCodexFile = String(entry.data?.codex_file ?? "").trim();

  if (explicitCodexFile) {
    const explicitKey = normalizeArchiveKey(explicitCodexFile.replace(/\.md$/i, ""));
    const explicitMatch = archiveRecords.find((record) => record.key === explicitKey);
    if (explicitMatch) return explicitMatch;
  }

  for (const candidateKey of candidateKeys) {
    const exact = archiveRecords.find((record) => record.key === candidateKey);
    if (exact) return exact;
  }

  const partialMatches = archiveRecords
    .map((record) => {
      const score = candidateKeys.reduce((best, candidateKey) => {
        if (record.key.includes(candidateKey) || candidateKey.includes(record.key)) {
          return Math.max(best, Math.min(record.key.length, candidateKey.length));
        }
        return best;
      }, 0);

      return { record, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.record.fileName.length - b.record.fileName.length);

  return partialMatches[0]?.record ?? null;
}

async function renderArchiveMarkdown(filePath: string): Promise<string> {
  let cached = markdownCache.get(filePath);
  if (!cached) {
    cached = readFile(filePath, "utf8").then(async (source) => {
      const rendered = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkArchiveHeadingIds)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(source);

      return String(rendered);
    });
    markdownCache.set(filePath, cached);
  }

  return cached;
}

export async function getCharacterCodexRecord(entry: CharacterLike): Promise<CharacterCodexRecord> {
  const archiveRecord = await findArchiveRecord(entry);

  if (!archiveRecord) {
    return {
      exists: false,
      fileName: null,
      archivePath: null,
      html: null,
    };
  }

  return {
    exists: true,
    fileName: archiveRecord.fileName,
    archivePath: archiveRecord.filePath,
    html: await renderArchiveMarkdown(archiveRecord.filePath),
  };
}
