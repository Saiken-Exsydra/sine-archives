import fs from "node:fs";
import path from "node:path";
import { TextDecoder } from "node:util";

const ROOT = process.cwd();
const decoder = new TextDecoder("utf-8", { fatal: true });

const CP1252_REVERSE = new Map([
  [0x20AC, 0x80],
  [0x201A, 0x82],
  [0x0192, 0x83],
  [0x201E, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02C6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8A],
  [0x2039, 0x8B],
  [0x0152, 0x8C],
  [0x017D, 0x8E],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201C, 0x93],
  [0x201D, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02DC, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9A],
  [0x203A, 0x9B],
  [0x0153, 0x9C],
  [0x017E, 0x9E],
  [0x0178, 0x9F],
]);

const TEXT_EXTENSIONS = new Set([
  ".astro",
  ".css",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
]);

const TARGETS = [
  path.join("src", "content"),
  path.join("src", "i18n"),
  path.join("src", "layouts"),
  path.join("src", "pages"),
  "translation-glossary-pt-BR.md",
];

const CONTENT_ALLOWED_LOCALES = ["_pt_br", "pt-br-translation-guide"];

const SUSPICIOUS_RE = /Ã[\u0080-\u00bf]|Â(?=[^A-Za-zÀ-ÿ]|$).|â[\u0080-\u00bf\u2018-\u201f\u20ac]|ï»¿|�/u;

function isTargetFile(relPath) {
  const ext = path.extname(relPath).toLowerCase();
  if (!TEXT_EXTENSIONS.has(ext)) return false;

  if (relPath.startsWith(path.join("src", "content"))) {
    return CONTENT_ALLOWED_LOCALES.some((segment) => relPath.includes(segment));
  }

  return true;
}

function walk(dirPath, relBase = "") {
  const fullPath = path.join(ROOT, dirPath);
  if (!fs.existsSync(fullPath)) return [];

  if (fs.statSync(fullPath).isFile()) {
    return isTargetFile(dirPath) ? [dirPath] : [];
  }

  const out = [];
  for (const entry of fs.readdirSync(fullPath, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist" || entry.name === ".astro") {
      continue;
    }
    const nextRel = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(nextRel, relBase));
      continue;
    }
    if (isTargetFile(nextRel)) out.push(nextRel);
  }
  return out;
}

function countMatches(str) {
  const matches = str.match(new RegExp(SUSPICIOUS_RE.source, "gu"));
  return matches ? matches.length : 0;
}

function replacementCount(str) {
  return (str.match(/�/g) ?? []).length;
}

function score(str) {
  return countMatches(str) * 10 + replacementCount(str) * 50;
}

function toCp1252Buffer(str) {
  const bytes = [];
  for (const char of str) {
    const cp = char.codePointAt(0);
    if (cp <= 0xff) {
      bytes.push(cp);
      continue;
    }
    const mapped = CP1252_REVERSE.get(cp);
    if (mapped === undefined) return null;
    bytes.push(mapped);
  }
  return Buffer.from(bytes);
}

function repairLine(line) {
  if (!SUSPICIOUS_RE.test(line)) return line;

  const raw = toCp1252Buffer(line);
  if (!raw) return line;

  let repaired;
  try {
    repaired = decoder.decode(raw);
  } catch {
    return line;
  }

  return score(repaired) < score(line) ? repaired : line;
}

function processFile(relPath, mode) {
  const absPath = path.join(ROOT, relPath);
  const original = fs.readFileSync(absPath, "utf8");
  const normalized = original.replace(/^\uFEFF/, "");
  const lines = normalized.split(/\r?\n/);
  const repairedLines = lines.map(repairLine);

  const findings = [];
  repairedLines.forEach((line, index) => {
    if (SUSPICIOUS_RE.test(line)) {
      findings.push({ line: index + 1, preview: line.trim().slice(0, 140) });
    }
  });

  const repaired = repairedLines.join("\n");
  const changed = repaired !== original;

  if (mode === "fix" && changed) {
    fs.writeFileSync(absPath, repaired, "utf8");
  }

  return { changed, findings };
}

const mode = process.argv.includes("--fix") ? "fix" : "check";
const files = TARGETS.flatMap((target) => walk(target));

const changedFiles = [];
const remainingIssues = [];

for (const relPath of files) {
  const result = processFile(relPath, mode);
  if (result.changed) changedFiles.push(relPath);
  if (result.findings.length) {
    remainingIssues.push({ file: relPath, findings: result.findings });
  }
}

if (mode === "fix") {
  if (changedFiles.length) {
    console.log(`Fixed mojibake in ${changedFiles.length} file(s):`);
    for (const file of changedFiles) console.log(`- ${file}`);
  } else {
    console.log("No mojibake fixes needed.");
  }
}

if (remainingIssues.length) {
  console.error("Suspicious text remains:");
  for (const issue of remainingIssues) {
    for (const finding of issue.findings.slice(0, 8)) {
      console.error(`- ${issue.file}:${finding.line} ${finding.preview}`);
    }
    if (issue.findings.length > 8) {
      console.error(`- ${issue.file}: ...and ${issue.findings.length - 8} more line(s)`);
    }
  }
  process.exit(1);
}

console.log("Encoding check passed.");
