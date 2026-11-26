import type { AssetId } from '../images/publication';
import type { Locale } from '../content';

type Copy = Record<Locale, string>;
const t = (en: string, pt: string): Copy => ({ en, 'pt-br': pt });
export const sections = ['overview', 'biography', 'abilities', 'relations'] as const;
export type Section = typeof sections[number];
export const sectionNames = {
  overview: t('Overview', 'Visão geral'), biography: t('Biography', 'Biografia'),
  abilities: t('Abilities', 'Habilidades'), relations: t('Relations', 'Relações'),
};
interface Passage { title?: Copy; text: Copy; link?: { href: string; label: string } }
export interface Character {
  id: string; name: string; shortName: string; designation: string; summary: Copy;
  art: AssetId; portrait: AssetId; portraitFocal?: string; focal: string; mobileFocal: string;
  overview: [Copy, Copy][]; biography: Passage[]; abilities: Passage[]; relations: Passage[];
  dossierHref?: string;
}
const age = t('Age in IY 1568', 'Idade no AI 1568');
const birth = t('Born', 'Nascimento');
const origin = t('Birthplace', 'Naturalidade');
const residence = t('Residence', 'Residência');
const house = t('Affiliation', 'Afiliação');
const same = (value: string) => t(value, value);

// Public localized character records, with chronology checked against the current dossiers.
export const characters: Character[] = [
  {
    id: 'lenore-engelmeyer', name: "Le’nore Voren Engelmeyer", shortName: "Le’nore", designation: 'Quill · Mark 2',
    summary: t('Her kindness is real. So is what she keeps hungry.', 'Sua gentileza é real. Assim como aquilo que ela mantém faminto.'),
    art: 'lenore-engelmeyer-hero', portrait: 'lenore-engelmeyer-portrait', focal: '42% 28%', mobileFocal: '39% 20%',
    overview: [[age,t('23 lunar years','23 anos lunares')],[birth,t('c. IY 1558','c. AI 1558')],
      [origin,same('Drevholt')],[t('Height','Altura'),same('169 cm')],
      [residence,same("Vel’hara")],[house,t('House Engelmeyer','Casa Engelmeyer')]],
    biography: [
      {text:t("Le’nore grew up in Drevholt, a small township in the western band interior. Her mother's family belonged to the Voren branch of House Engelmeyer.",
        "Le’nore cresceu em Drevholt, um povoado no interior da faixa ocidental. A família de sua mãe pertencia ao ramo Voren da Casa Engelmeyer.")},
      {text:t("In Imperial Year 1567, the House formally recognized her branch name. She moved to Vel’hara, where she works as an independent civic practitioner. The Academy in Hora'veil maintains her imperial practice file.",
        "No ano imperial de 1567, a Casa reconheceu formalmente seu nome de ramo. Ela se mudou para Vel’hara, onde exerce a prática cívica independente. A Academia de Hora'veil mantém seu registro imperial.")}
    ],
    abilities: [{title:same('Deception'),text:t("The Academy confirmed a deep Deception Anchor. Le’nore can influence perception during the Dive. Her registry requires disclosure when she uses this capacity without consent.",
      "A Academia confirmou uma Âncora profunda de Deception. Le’nore pode influenciar a percepção durante o Dive. Seu registro exige que ela declare o uso dessa capacidade quando não houver consentimento."),link:{href:'#/systems/redactory',label:'Redactory'}}],
    relations: [{title:t('The Voren lineage','A linhagem Voren'),text:t("Voren comes from her mother’s line. Her father, Al’tair, adopted the name upon marriage.",
      "Voren vem da linhagem materna. Seu pai, Al’tair, adotou o nome ao se casar.")},
      {title:t('House Engelmeyer','Casa Engelmeyer'),text:t("Le’nore holds the House’s blood Seat. The Furnace Council administers the House.",
      "Le’nore ocupa o assento de sangue da Casa. A administração cabe ao Conselho da Fornalha.")}],
  },
  {
    id:'hisui-kirasagi', name:'Hisui Kirasagi', shortName:'Hisui', designation:'Far Bloom',
    summary:same('Far from home, duty bloomed teeth.'), art:'hisui-kirasagi-hero', portrait:'hisui-kirasagi-portrait', focal:'45% 35%', mobileFocal:'46% 20%',
    overview:[[age,t('24 lunar years','24 anos lunares')],[birth,t('c. IY 1557','c. AI 1557')],
      [origin,same('Tsukimiya, Hikari')],[residence,same("Kalt'sen")],[house,t('Wonderwall household','Casa Wonderwall')]],
    biography:[{text:t("Hisui grew up in the harbor city of Tsukimiya. In her family, setting a table and keeping watch at it belong to the same education. A retainer is responsible for the safety of the people in her care.",
      "Hisui cresceu na cidade portuária de Tsukimiya. Em sua família, pôr a mesa e vigiar quem se senta a ela fazem parte da mesma formação. Cabe a quem serve proteger as pessoas sob seus cuidados.")},
      {text:t("As the family's Far Bloom, she carried the Abyssal Flower beyond Hikari. She now serves a Wonderwall cadet household in Kalt'sen, attending to Ec'lesia.",
      "Como Far Bloom da família, levou a Abyssal Flower para além de Hikari. Hoje trabalha para um ramo cadete da Casa Wonderwall em Kalt'sen, onde cuida de Ec'lesia.")}],
    abilities:[{title:same('Abyssal Flower'),text:t("Hisui carries a living symbiote inherited through the Kirasagi line. Its responses to resonance can bring petal-like structures to the surface of her forearms.",
      "Hisui carrega um simbionte vivo herdado da linhagem Kirasagi. Ao reagir à ressonância, ele pode fazer emergir estruturas semelhantes a pétalas em seus antebraços."),link:{href:'#/systems/bloom',label:'Bloom'}},
      {title:t('Service and protection','Serviço e proteção'),text:t("Her training joins household management, observation and close protection. She has no Anchor and cannot enter the Dive.",
      "Sua formação reúne administração doméstica, observação e proteção pessoal. Ela não possui Âncora e não pode entrar no Dive.")}],
    relations:[{title:t('House of Shinzui','Casa Shinzui'),text:t("Generations of Kirasagi retainers have served the Shinzui household in Tsukimiya. Hisui's older brother Renya remains there.",
      "Gerações da família Kirasagi serviram à Casa Shinzui em Tsukimiya. Renya, irmão mais velho de Hisui, permanece lá.")},
      {title:same("Ec'lesia Wonderwall"),text:t("Hisui is Ec'lesia's personal attendant in Kalt'sen.", "Hisui é a atendente pessoal de Ec'lesia em Kalt'sen.")}],
  },
];

// Editorial selection is independent of display order. A publication policy can supply this ID later.
export const featuredCharacter = characters.find(record => record.id === 'lenore-engelmeyer')!;
export interface CharacterRoute { character: Character; section: Section }
export function characterRoute(id?: string, section?: string): CharacterRoute {
  return { character: characters.find(record => record.id === id) ?? featuredCharacter,
    section: sections.find(item => item === section) ?? 'overview' };
}
export function characterHref(id: string, section: Section = 'overview') {
  return '#/characters/' + id + (section === 'overview' ? '' : '/' + section);
}
