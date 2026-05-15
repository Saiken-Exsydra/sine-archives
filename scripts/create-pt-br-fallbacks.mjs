import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "src", "content");

const args = new Set(process.argv.slice(2));
const overwrite = args.has("--overwrite");
const check = args.has("--check");

function log(msg) {
  console.log(msg);
}

function getLocalePairs() {
  if (!fs.existsSync(CONTENT_ROOT)) {
    throw new Error(`Missing content root: ${CONTENT_ROOT}`);
  }

  const dirs = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return dirs
    .filter((name) => name.endsWith("_en"))
    .map((enDir) => {
      const base = enDir.slice(0, -3);
      return {
        base,
        enDir,
        ptDir: `${base}_pt_br`,
      };
    })
    .filter(({ ptDir }) => fs.existsSync(path.join(CONTENT_ROOT, ptDir)));
}

function copyMissingFiles({ enDir, ptDir }) {
  const sourceDir = path.join(CONTENT_ROOT, enDir);
  const targetDir = path.join(CONTENT_ROOT, ptDir);
  const created = [];
  const skipped = [];
  const missing = [];

  const files = fs
    .readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".md"));

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (!fs.existsSync(targetPath)) {
      missing.push(file);
    }

    if (fs.existsSync(targetPath) && !overwrite) {
      skipped.push(file);
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
    created.push(file);
  }

  return { created, skipped, missing };
}

function main() {
  const pairs = getLocalePairs();

  if (pairs.length === 0) {
    log("No *_en -> *_pt_br content pairs found.");
    return;
  }

  let totalCreated = 0;
  let totalSkipped = 0;
  let totalMissing = 0;
  let hasMissing = false;

  for (const pair of pairs) {
    const { created, skipped, missing } = copyMissingFiles(pair);
    totalCreated += created.length;
    totalSkipped += skipped.length;
    totalMissing += missing.length;

    if (check && missing.length) {
      hasMissing = true;
      log(`${pair.enDir} -> ${pair.ptDir}: missing ${missing.length}`);
      for (const file of missing) log(`  - ${file}`);
      continue;
    }

    if (check) {
      log(`${pair.enDir} -> ${pair.ptDir}: present ${skipped.length}`);
      continue;
    }

    if (created.length || skipped.length) {
      log(`${pair.enDir} -> ${pair.ptDir}: created ${created.length}, skipped ${skipped.length}`);
    }
  }

  if (check) {
    if (hasMissing) {
      console.error(`Missing ${totalMissing} pt-BR fallback file(s). Run: npm run seed:pt-br-fallbacks`);
      process.exitCode = 1;
      return;
    }

    log("All pt-BR fallback files present.");
    return;
  }

  log(`Done. Created ${totalCreated} pt-BR fallback file(s). Skipped ${totalSkipped} existing file(s).`);
}

main();
