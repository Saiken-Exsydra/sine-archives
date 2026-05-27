import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import NodeID3 from "node-id3";

const projectRoot = process.cwd();
const allowedRoot = path.join(projectRoot, "public", "music");

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) continue;

    const normalizedKey = key.slice(2);
    const nextValue = argv[index + 1];

    if (nextValue && !nextValue.startsWith("--")) {
      args[normalizedKey] = nextValue;
      index += 1;
      continue;
    }

    args[normalizedKey] = true;
  }

  return args;
}

function getMimeType(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}

function usage() {
  console.log("Usage:");
  console.log("  npm run songs:update -- --file public/music/tracks/example.mp3 --title \"Song\" --artist \"Artist\"");
  console.log("Optional:");
  console.log("  --album \"Album\" --year 2026 --track 1 --cover public/music/covers/example.jpg");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const fileArg = args.file;

  if (!fileArg) {
    usage();
    process.exitCode = 1;
    return;
  }

  const targetPath = path.resolve(projectRoot, fileArg);
  const normalizedAllowedRoot = path.resolve(allowedRoot);

  if (!targetPath.startsWith(normalizedAllowedRoot)) {
    throw new Error("Target file must live under public/music.");
  }

  const targetStats = await stat(targetPath);
  if (!targetStats.isFile()) {
    throw new Error("Target file is not a regular file.");
  }

  const tags = {};

  if (args.title) tags.title = args.title;
  if (args.artist) tags.artist = args.artist;
  if (args.album) tags.album = args.album;
  if (args.year) tags.year = String(args.year);
  if (args.track) tags.trackNumber = String(args.track);

  if (args.cover) {
    const coverPath = path.resolve(projectRoot, args.cover);
    const coverBuffer = await readFile(coverPath);
    tags.image = {
      mime: getMimeType(coverPath),
      type: {
        id: 3,
        name: "front cover",
      },
      description: path.basename(coverPath),
      imageBuffer: coverBuffer,
    };
  }

  const success = NodeID3.update(tags, targetPath);

  if (!success) {
    throw new Error("Unable to update ID3 tags.");
  }

  console.log(`Updated metadata for ${path.relative(projectRoot, targetPath)}`);
  console.log("Run `npm run songs:generate` to refresh src/data/songs.json.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
