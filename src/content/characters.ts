import manifest from '../images/manifest.json';
import { loadCharacterPublication } from './character-publication';

const records = import.meta.glob<string>([
  './characters/*/record.json',
  './characters/*/{biography,abilities,relations}.{en,pt-BR}.md',
  './institutions.json',
  './classifications.json',
], { query: '?raw', import: 'default', eager: true });
const dossiers = import.meta.glob<string>('./characters/*/dossier.{en,pt-BR}.md', { query: '?raw', import: 'default' });

export const { characters, featuredCharacter, institutions, insignia } = loadCharacterPublication(records, dossiers, manifest);
export type { Character } from './character-publication';
