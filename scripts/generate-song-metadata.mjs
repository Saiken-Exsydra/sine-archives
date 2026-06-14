import { mkdir, readdir, rm, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { parseFile } from "music-metadata";

const projectRoot = process.cwd();
const musicRoot = path.join(projectRoot, "public", "music");
const coversRoot = path.join(musicRoot, "covers");
const outputFile = path.join(projectRoot, "src", "data", "songs.json");

const COVER_EXTENSION_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const TRACK_OVERRIDES = {
  "/music/tracks/Moonsick.mp3": {
    album: "Moonsick",
    cover: "/music/source-covers/gravitas-cover.png",
  },
  "/music/tracks/Sistera%20N%C2%B0%201.mp3": {
    cover: "/music/source-covers/sistera-no-1-cover.png",
  },
  "/music/tracks/Tacet%20Lapis.mp3": {
    cover: "/music/source-covers/tacet-lapis-cover.png",
  },
};

function toPublicUrl(absolutePath) {
  const relativePath = path.relative(path.join(projectRoot, "public"), absolutePath);
  return encodeURI(`/${relativePath.split(path.sep).join("/")}`);
}

function getCoverBasename(filePath) {
  const relative = path.relative(musicRoot, filePath);
  return relative.replace(path.extname(relative), "").split(path.sep).join("--");
}

function inferCoverExtension(picture) {
  if (!picture?.format) return ".jpg";
  return COVER_EXTENSION_BY_MIME[picture.format.toLowerCase()] || ".jpg";
}

function getFallbackTitle(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

async function emptyDirectory(directoryPath) {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    await Promise.all(entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        await rm(entryPath, { recursive: true, force: true });
        return;
      }
      await unlink(entryPath);
    }));
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}

async function ensureDirectories() {
  await mkdir(coversRoot, { recursive: true });
  await mkdir(path.dirname(outputFile), { recursive: true });
}

async function readMetadata(filePath) {
  const metadata = await parseFile(filePath, { duration: true });
  const common = metadata.common ?? {};
  const format = metadata.format ?? {};
  const picture = Array.isArray(common.picture) ? common.picture[0] : null;
  const src = toPublicUrl(filePath);
  const override = TRACK_OVERRIDES[src];

  let coverUrl = null;

  if (!override?.cover && picture?.data?.length) {
    const coverExtension = inferCoverExtension(picture);
    const coverName = `${getCoverBasename(filePath)}${coverExtension}`;
    const coverPath = path.join(coversRoot, coverName);
    await writeFile(coverPath, picture.data);
    coverUrl = toPublicUrl(coverPath);
  }

  return {
    title: common.title || getFallbackTitle(filePath),
    artist: common.artist || null,
    album: override?.album ?? (common.album || null),
    year: Number.isFinite(common.year) ? common.year : null,
    track: Number.isFinite(common.track?.no) ? common.track.no : null,
    duration: Number.isFinite(format.duration) ? Number(format.duration.toFixed(2)) : null,
    src,
    cover: override?.cover ?? coverUrl,
  };
}

async function main() {
  await ensureDirectories();
  await emptyDirectory(coversRoot);

  const patterns = ["public/music/**/*.mp3", "!public/music/covers/**"];
  const files = await fg(patterns, {
    cwd: projectRoot,
    onlyFiles: true,
    absolute: true,
  });

  const songs = [];

  for (const filePath of files.sort()) {
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) continue;
    songs.push(await readMetadata(filePath));
  }

  await writeFile(outputFile, `${JSON.stringify(songs, null, 2)}\n`, "utf8");
  console.log(`Generated ${songs.length} song entries in ${path.relative(projectRoot, outputFile)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
