import { characters, featuredCharacter, type Character } from '../content/characters';
import { proseSections } from '../content/character-publication';

export { characters, featuredCharacter, type Character };
export const sections = ['overview', ...proseSections] as const;
export type Section = typeof sections[number];
export const sectionNames = {
  overview: { en: 'Overview', 'pt-br': 'Visão geral' },
  biography: { en: 'Biography', 'pt-br': 'Biografia' },
  abilities: { en: 'Abilities', 'pt-br': 'Habilidades' },
  relations: { en: 'Relations', 'pt-br': 'Relações' },
};

export interface CharacterRoute { character: Character; section: Section; dossier?: boolean }
export function characterRoute(id?: string, section?: string): CharacterRoute {
  return {
    character: characters.find(record => record.id === id) ?? featuredCharacter,
    dossier: section === 'dossier' && characters.some(record => record.id === id),
    section: sections.find(item => item === (section === 'dossier' ? history.state?.dossierSection : section)) ?? 'overview',
  };
}
export function characterHref(id: string, section: Section | 'dossier' = 'overview') {
  return '#/characters/' + id + (section === 'overview' ? '' : '/' + section);
}
