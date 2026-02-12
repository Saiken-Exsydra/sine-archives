import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Load sections from JSON (Node-safe)
const sectionsPath = path.join(__dirname, "..", "src", "sections.json");
const SECTIONS = JSON.parse(fs.readFileSync(sectionsPath, "utf8"));

if (!Array.isArray(SECTIONS)) {
  console.error("❌ sections.json did not contain an array");
  process.exit(1);
}




// Static header for Decap
const header = `backend:
  name: git-gateway
  branch: main

media_folder: "public/uploads"
public_folder: "/uploads"

publish_mode: simple

slug:
  encoding: "ascii"
  clean_accents: true
  sanitize_replacement: "-"
`;

function collectionBlock({ key, label, typeDefault }) {
  return `  - name: "${key}"
    label: "${label}"
    folder: "src/content/${key}"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Status", name: "status", widget: "select", options: ["public", "private"], default: "private" }
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Type", name: "type", widget: "hidden", default: "${typeDefault}" }
      - { label: "Summary", name: "summary", widget: "text", required: false, default: "" }

      - { label: "Created", name: "created", widget: "datetime", format: "YYYY-MM-DD", time_format: false }
      - { label: "Updated", name: "updated", widget: "datetime", format: "YYYY-MM-DD", time_format: false }

      - label: "Tags"
        name: "tags"
        widget: "list"
        required: true
        min: 1
        field:
          label: "Tag"
          name: "tag"
          widget: "string"
          required: true
          pattern: ["\\\\S+", "Tag cannot be blank"]

      - { label: "Image", name: "image", widget: "image", required: false }
      - { label: "Body", name: "body", widget: "markdown" }
`;
}

const yaml =
  header +
  "\ncollections:\n" +
  SECTIONS.map(collectionBlock).join("\n");

const outPath = path.join(__dirname, "..", "public", "admin", "config.yml");
fs.writeFileSync(outPath, yaml, "utf8");

console.log("✅ Decap config generated successfully.");
