import { z } from 'zod/mini';
import type { Locale } from '../content';
import type { AssetId } from '../images/publication';

const text = z.string().check(z.trim(), z.minLength(1));
export const publicationId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slug = z.string().check(z.regex(publicationId, 'Use a lowercase hyphenated identifier'));
const count = z.int().check(z.nonnegative());
const parseOptions = { error: z.locales.en().localeError };
const localized = z.union([text, z.strictObject({ en: text, 'pt-BR': text })]);
const languages = ['en', 'pt-BR'] as const;
type Language = typeof languages[number];
type Localized = z.infer<typeof localized>;
type Copy = Record<Locale, string>;

export const proseSections = ['biography', 'abilities', 'relations'] as const;
type ProseSection = typeof proseSections[number];
const systemRoutes = ['redactory', 'divination', 'bloom'] as const;

const institution = z.strictObject({
  name: localized,
  category: z.enum(['house', 'company', 'religious', 'household', 'other']),
  parent: z.optional(slug),
  emblem: z.optional(slug),
  record: z.optional(slug),
});
const symbolGroup = z.record(slug, z.strictObject({ name: localized, insignia: z.optional(slug) }));
const classificationRegistry = z.strictObject({
  systems: symbolGroup,
  anchorTypes: symbolGroup,
  anchorDepths: symbolGroup,
  redactorRanks: symbolGroup,
  other: symbolGroup,
});
const characterRecord = z.strictObject({
  name: text,
  shortName: text,
  designation: localized,
  summary: localized,
  hero: slug,
  portrait: slug,
  focal: z.optional(text),
  mobileFocal: z.optional(text),
  portraitFocal: z.optional(text),
  order: z.optional(count),
  featured: z.optional(z.boolean()),
  overview: z.strictObject({
    age: z.optional(z.strictObject({ lunarYears: count, asOfImperialYear: z.int() })),
    birth: z.optional(z.strictObject({ imperialYear: z.int(), approximate: z.optional(z.boolean()) })),
    birthplace: z.optional(localized),
    heightCm: z.optional(z.number().check(z.positive())),
    residence: z.optional(localized),
  }),
  affiliations: z.optional(z.array(z.strictObject({
    institution: slug,
    kind: z.enum(['membership', 'blood-lineage', 'service', 'employment', 'association']),
    primary: z.optional(z.boolean()),
  }))),
  relationships: z.optional(z.array(z.strictObject({ character: slug, kind: slug }))),
  classifications: z.optional(z.strictObject({
    systems: z.optional(z.array(z.strictObject({ system: slug, kind: z.enum(['capability', 'affiliation']) }))),
    redactory: z.optional(z.strictObject({
      anchor: z.optional(z.strictObject({ type: z.optional(slug), depth: z.optional(slug) })),
      rank: z.optional(slug),
      mark: z.optional(count),
    })),
    other: z.optional(z.array(slug)),
  })),
  dossier: z.optional(z.array(z.enum(languages)).check(z.minLength(1))),
});

type RecordData = z.infer<typeof characterRecord>;
type Institution = Omit<z.infer<typeof institution>, 'emblem'> & { emblem?: AssetId };
type SymbolRecord = { name: Localized; insignia?: AssetId };
interface Passage { title?: string; text: string; link?: { href: string; label: string } }
type DossierLoader = () => Promise<string>;
export type Character = Omit<RecordData, 'hero' | 'portrait' | 'overview' | 'designation' | 'summary' | 'dossier'> & {
  id: string;
  art: AssetId;
  portrait: AssetId;
  designation: Copy;
  summary: Copy;
  facts: RecordData['overview'];
  overview: [Copy, Copy][];
  dossier?: Partial<Record<Locale, DossierLoader>>;
} & Record<ProseSection, Record<Locale, Passage[]>>;

const copy = (en: string, pt: string): Copy => ({ en, 'pt-br': pt });
function localize(value: Localized): Copy {
  return typeof value === 'string' ? copy(value, value) : copy(value.en, value['pt-BR']);
}

function fail(file: string, message: string): never {
  throw new Error(`${file}: ${message}`);
}

function parse<T>(schema: z.ZodMiniType<T>, raw: string | undefined, file: string): T {
  if (raw === undefined) fail(file, 'Missing required file');
  let data: unknown;
  try { data = JSON.parse(raw.replace(/^\uFEFF/, '')); }
  catch { fail(file, 'Invalid JSON'); }
  const result = schema.safeParse(data, parseOptions);
  if (!result.success) {
    fail(file, result.error.issues.map(issue =>
      [issue.path.join('.'), issue.message].filter(Boolean).join(': ')).join('\n  '));
  }
  return result.data;
}

function readPassages(raw: string | undefined, file: string): Passage[] {
  if (!raw?.trim()) fail(file, 'Missing or empty prose');
  const passages: Passage[] = [];
  let title: string | undefined;
  for (const block of raw.trim().split(/\r?\n[\t ]*\r?\n(?:[\t ]*\r?\n)*/)) {
    const link = /^\[([^\]\n]+)\]\(#\/systems\/([a-z-]+)\)$/.exec(block.trim());
    if (link) {
      const previous = passages.at(-1);
      if (title || !previous || previous.link || !systemRoutes.some(id => id === link[2])) {
        fail(file, 'Place one link to a published system after its paragraph');
      }
      previous.link = { label: link[1], href: '#/systems/' + link[2] };
      continue;
    }
    const heading = /^##[\t ]+(\S[^\r\n]*)(?:\r?\n|$)/.exec(block);
    if (heading) {
      if (title) fail(file, 'Give each heading a paragraph');
      title = heading[1].trim();
    }
    const paragraph = block.slice(heading?.[0].length ?? 0).trim();
    if (!paragraph && heading) continue;
    const invalidBlock = /^\s*(?:#{1,6}\s|[-*+]\s|\d+[.)]\s|\x60{3}|~~~|>|<|!?(?:\[.*\]\())/m;
    if (!paragraph || invalidBlock.test(paragraph)) {
      fail(file, 'Use paragraphs, optional ## headings, and standalone system links');
    }
    passages.push({ title, text: paragraph.replace(/\s*\r?\n\s*/g, ' ') });
    title = undefined;
  }
  if (title) fail(file, 'Give each heading a paragraph');
  return passages;
}

function overviewFacts(overview: RecordData['overview'], primary: Institution | undefined): Character['overview'] {
  const { age, birth, birthplace, heightCm, residence } = overview;
  const facts: Character['overview'] = [];
  if (age) facts.push([
    copy(`Age in IY ${age.asOfImperialYear}`, `Idade no AI ${age.asOfImperialYear}`),
    copy(`${age.lunarYears} lunar years`, `${age.lunarYears} anos lunares`),
  ]);
  if (birth) {
    const prefix = birth.approximate ? 'c. ' : '';
    facts.push([copy('Born', 'Nascimento'), copy(`${prefix}IY ${birth.imperialYear}`, `${prefix}AI ${birth.imperialYear}`)]);
  }
  if (birthplace) facts.push([copy('Birthplace', 'Naturalidade'), localize(birthplace)]);
  if (heightCm !== undefined) facts.push([
    copy('Height', 'Altura'),
    copy(`${heightCm} cm`, `${heightCm.toString().replace('.', ',')} cm`),
  ]);
  if (residence) facts.push([copy('Residence', 'Residência'), localize(residence)]);
  if (primary) facts.push([copy('Affiliation', 'Afiliação'), localize(primary.name)]);
  return facts;
}

export function loadCharacterPublication(
  files: Record<string, string>,
  dossiers: Partial<Record<string, DossierLoader>>,
  assets: Record<AssetId, { profile: string }>,
) {
  function checkedAsset(id: string, profile: 'hero' | 'portrait' | 'symbol', file: string, field: string): AssetId {
    const entry = Object.hasOwn(assets, id) && assets[id as AssetId];
    if (!entry || entry.profile !== profile) fail(file, `${field} must reference a published ${profile} asset (${id})`);
    return id as AssetId;
  }

  const institutionFile = './institutions.json';
  const institutions = new Map<string, Institution>();
  for (const [id, { emblem, ...record }] of Object.entries(parse(z.record(slug, institution), files[institutionFile], institutionFile))) {
    institutions.set(id, {
      ...record,
      emblem: emblem ? checkedAsset(emblem, 'symbol', institutionFile, id + '.emblem') : undefined,
    });
  }
  for (const [id, entry] of institutions) {
    if (entry.parent && (!institutions.has(entry.parent) || entry.parent === id)) {
      fail(institutionFile, `${id}.parent must reference another registered institution (${entry.parent})`);
    }
  }
  const classificationFile = './classifications.json';
  const classifications = parse(classificationRegistry, files[classificationFile], classificationFile);
  const insignia = new Map<keyof typeof classifications, ReadonlyMap<string, SymbolRecord>>();
  for (const group of Object.keys(classifications) as (keyof typeof classifications)[]) {
    const entries = new Map<string, SymbolRecord>();
    for (const [id, { name, insignia }] of Object.entries(classifications[group])) {
      entries.set(id, {
        name,
        insignia: insignia ? checkedAsset(insignia, 'symbol', classificationFile, `${group}.${id}.insignia`) : undefined,
      });
    }
    insignia.set(group, entries);
  }

  const directory = /^\.\/characters\/([^/]+)\/([^/]+)$/;
  const ids = new Set<string>();
  for (const file of [...Object.keys(files), ...Object.keys(dossiers)]) {
    const match = directory.exec(file);
    if (!match) continue;
    if (!publicationId.test(match[1])) fail(file, 'Use a lowercase hyphenated character directory name');
    ids.add(match[1]);
  }
  const characters: Character[] = [];
  for (const id of ids) {
    const folder = './characters/' + id;
    const file = folder + '/record.json';
    const { hero, portrait, designation, summary, dossier, overview, ...record } = parse(characterRecord, files[file], file);
    const primary = record.affiliations?.filter(entry => entry.primary) ?? [];
    if (primary.length > 1) fail(file, 'Select at most one primary affiliation');
    for (const { institution } of record.affiliations ?? []) {
      if (!institutions.has(institution)) fail(file, `Unknown affiliation institution "${institution}"`);
    }
    for (const { character } of record.relationships ?? []) {
      if (character === id || !ids.has(character)) fail(file, `Relationship must reference another published character ("${character}")`);
    }
    const { systems, redactory, other } = record.classifications ?? {};
    const references = {
      systems: systems?.map(entry => entry.system) ?? [],
      anchorTypes: [redactory?.anchor?.type],
      anchorDepths: [redactory?.anchor?.depth],
      redactorRanks: [redactory?.rank],
      other: other ?? [],
    };
    for (const group of Object.keys(references) as (keyof typeof references)[]) {
      for (const value of references[group]) {
        if (value && !insignia.get(group)?.has(value)) fail(file, `Unknown ${group} classification "${value}"`);
      }
    }
    const documents: NonNullable<Character['dossier']> = {};
    for (const language of languages) {
      const document = `${folder}/dossier.${language}.md`;
      const load = dossiers[document];
      if (Boolean(load) !== Boolean(dossier?.includes(language))) {
        fail(document, load ? 'List the approved dossier language in record.json before publishing' : 'Missing declared dossier');
      }
      if (load) documents[localeKey(language)] = load;
    }
    if (dossier && new Set(dossier).size !== dossier.length) fail(file, 'List each dossier language only once');
    const read = (section: ProseSection, language: Language) => {
      const article = `${folder}/${section}.${language}.md`;
      return readPassages(files[article], article);
    };
    const prose = (section: ProseSection) => ({ en: read(section, 'en'), 'pt-br': read(section, 'pt-BR') });
    characters.push({
      ...record,
      id,
      art: checkedAsset(hero, 'hero', file, 'hero'),
      portrait: checkedAsset(portrait, 'portrait', file, 'portrait'),
      designation: localize(designation),
      summary: localize(summary),
      facts: overview,
      overview: overviewFacts(overview, primary[0] && institutions.get(primary[0].institution)),
      biography: prose('biography'),
      abilities: prose('abilities'),
      relations: prose('relations'),
      dossier: dossier && documents,
    });
  }
  characters.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.id.localeCompare(b.id, 'en'));
  const featured = characters.filter(character => character.featured);
  if (featured.length !== 1) fail('./characters', 'Set "featured": true on exactly one character record');
  return { characters, featuredCharacter: featured[0], institutions, insignia };
}

function localeKey(language: Language): Locale {
  return language === 'en' ? 'en' : 'pt-br';
}
