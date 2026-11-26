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

export interface CharacterRoute { character: Character; section: Section }
export function characterRoute(id?: string, section?: string): CharacterRoute {
  return {
    character: characters.find(record => record.id === id) ?? featuredCharacter,
    section: sections.find(item => item === section) ?? 'overview',
  };
}
export function characterHref(id: string, section: Section = 'overview') {
  return '#/characters/' + id + (section === 'overview' ? '' : '/' + section);
}
