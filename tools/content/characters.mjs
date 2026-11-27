import { readdir, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { loadCharacterPublication, publicationId } from '../../src/content/character-publication.ts';

const content = new URL('../../src/content/', import.meta.url);
const proseName = /^(biography|abilities|relations)\.(en|pt-BR)\.md$/;

async function readText(file) {
  const bytes = await readFile(new URL(file, content));
  try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
  catch { throw new Error(`${file}: Save as UTF-8`); }
}

export async function readCharacterPublication() {
  const files = {};
  const dossiers = {};
  for (const file of ['./institutions.json', './classifications.json']) files[file] = await readText(file);
  const directories = await readdir(new URL('characters/', content), { withFileTypes: true });
  for (const directory of directories) {
    if (!directory.isDirectory() || !publicationId.test(directory.name)) {
      throw new Error(`characters/${directory.name}: Expected a lowercase hyphenated character directory`);
    }
    const folder = './characters/' + directory.name;
    const entries = await readdir(new URL(folder + '/', content), { withFileTypes: true });
    if (!entries.some(file => file.isFile() && file.name === 'record.json')) {
      throw new Error(`${folder}/record.json: Missing required file`);
    }
    for (const entry of entries) {
      const file = folder + '/' + entry.name;
      if (!entry.isFile()) throw new Error(`${file}: Expected a regular publication file`);
      if (entry.name === 'record.json' || proseName.test(entry.name)) {
        files[file] = await readText(file);
      } else if (entry.name === 'dossier.en.md') {
        const value = await readText(file);
        if (!value.trim()) throw new Error(`${file}: Dossier is empty`);
        dossiers[file] = async () => value;
      } else {
        throw new Error(`${file}: Unexpected publication filename. See CHARACTER_PUBLICATION.md.`);
      }
    }
  }
  const manifest = JSON.parse(await readFile(new URL('../../src/images/manifest.json', import.meta.url), 'utf8'));
  return loadCharacterPublication(files, dossiers, manifest);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    const { characters, featuredCharacter } = await readCharacterPublication();
    console.log(`${characters.length} character records validated. Featured: ${featuredCharacter.id}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
