import { SystemsShowcase } from './SystemsShowcase';
import { CharactersShowcase } from './CharactersShowcase';
import { HistoryShowcase } from './HistoryShowcase';

export const domains = [
  { id: 'systems', label: { en: 'Systems', 'pt-br': 'Sistemas' }, href: '#/systems', Showcase: SystemsShowcase },
  { id: 'characters', label: { en: 'Characters', 'pt-br': 'Personagens' }, href: '#/characters', Showcase: CharactersShowcase },
  { id: 'history', label: { en: 'History', 'pt-br': 'História' }, href: '#/history', Showcase: HistoryShowcase },
] as const;
