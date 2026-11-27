import { z } from 'zod/mini';
import type { Locale } from '../content';
import type { AssetId } from '../images/publication';

const text = z.string().check(z.trim(), z.minLength(1));
export const publicationId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slug = z.string().check(z.regex(publicationId, 'Use a lowercase hyphenated identifier'));
const count = z.int().check(z.nonnegative());
const parseOptions = { error: z.locales.en().localeError };
const localized = z.union([text, z.strictObject({ en: text, 'pt-BR': text })]);
const localizedList = z.array(localized).check(z.minLength(1));
const positive = z.number().check(z.positive());
const datedAge = z.strictObject({
  lunarYears: z.number().check(z.nonnegative()),
  asOfImperialYear: z.int(),
  approximate: z.optional(z.boolean()),
});
const publishedAge = z.union([datedAge, z.strictObject({ status: z.literal('undefined') }),
  z.strictObject({ wording: localized, asOfImperialYear: z.optional(z.int()) })]);
const height = z.strictObject({
  cm: z.union([positive, z.tuple([positive, positive])]),
  approximate: z.optional(z.boolean()),
  context: z.optional(localized),
});
const mark = z.union([count, z.literal('open')]);
const anchor = z.strictObject({
  type: slug,
  depth: z.optional(slug),
  reading: z.optional(localized),
  rank: z.optional(slug),
});
const capabilityProfiles = z.array(z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('redactory'),
    anchors: z.optional(z.array(anchor).check(z.minLength(1))),
    tradition: z.optional(localized),
    rank: z.optional(slug),
    training: z.optional(localized),
    mark: z.optional(mark),
    reach: z.optional(localized),
    status: z.optional(localized),
    restrictions: z.optional(localized),
  }),
  z.strictObject({
    kind: z.literal('divination'),
    classification: localized,
    alignment: z.optional(localized),
    domain: z.optional(localized),
    manifestation: z.optional(localized),
    seraphicLine: z.optional(localized),
    constellation: z.optional(localized),
    fragmentClassification: z.optional(localized),
    fusionStatus: z.optional(localized),
  }),
  z.strictObject({
    kind: z.literal('bloom'),
    classification: z.optional(localized),
    inheritance: z.optional(localized),
    expression: z.optional(localized),
    succession: z.optional(localized),
    lineage: z.optional(localized),
  }),
  z.strictObject({
    kind: z.literal('elemental'),
    classification: localized,
    domain: z.optional(localized),
    authority: z.optional(localized),
    expression: z.optional(localized),
    state: z.optional(localized),
  }),
  z.strictObject({
    kind: z.literal('continuity'),
    classification: localized,
    principle: z.optional(localized),
    abilities: z.optional(localizedList),
  }),
  z.strictObject({
    kind: z.literal('exceptional'),
    classification: localized,
    assessment: z.optional(localized),
    expression: z.optional(localized),
    state: z.optional(localized),
  }),
]));
const languages = ['en', 'pt-BR'] as const;
type Language = typeof languages[number];
export type Localized = z.infer<typeof localized>;
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
    referenceImperialYear: z.optional(z.int()),
    age: z.optional(publishedAge),
    livedAge: z.optional(datedAge),
    apparentAge: z.optional(localized),
    birth: z.optional(z.strictObject({
      imperialYear: z.int(),
      date: z.optional(localized),
      approximate: z.optional(z.boolean()),
      kind: z.optional(z.literal('creation')),
    })),
    ageContext: z.optional(localized),
    livedAgeContext: z.optional(localized),
    birthplace: z.optional(localized),
    origin: z.optional(localized),
    creator: z.optional(localized),
    heightCm: z.optional(positive),
    height: z.optional(height),
    residence: z.optional(z.union([localized, localizedList])),
    location: z.optional(localized),
    nationality: z.optional(localizedList),
    occupation: z.optional(localized),
    birthName: z.optional(localized),
    formerName: z.optional(localized),
    formalName: z.optional(localized),
    aliases: z.optional(localizedList),
    state: z.optional(localized),
  }),
  affiliations: z.optional(z.array(z.strictObject({
    institution: slug,
    kind: z.enum(['membership', 'blood-lineage', 'family', 'office', 'service', 'employment', 'association', 'former-service']),
    branch: z.optional(localized),
    role: z.optional(localized),
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
    profiles: z.optional(capabilityProfiles),
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
export function localize(value: Localized): Copy {
  return typeof value === 'string' ? copy(value, value) : copy(value.en, value['pt-BR']);
}
export function localizeList(values: Localized[]): Copy {
  const entries = values.map(localize);
  return copy(
    new Intl.ListFormat('en').format(entries.map(value => value.en)),
    new Intl.ListFormat('pt-BR').format(entries.map(value => value['pt-br'])),
  );
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

function overviewFacts(overview: RecordData['overview']): Character['overview'] {
  const { age, livedAge, birth, referenceImperialYear, height, heightCm, residence, nationality, aliases } = overview;
  const facts: Character['overview'] = [];
  const add = (label: Copy, value: Localized | undefined) => {
    if (value !== undefined) facts.push([label, localize(value)]);
  };
  const enNumber = new Intl.NumberFormat('en');
  const ptNumber = new Intl.NumberFormat('pt-BR');
  const asOf = (label: Copy, year?: number) => year === undefined ? label
    : copy(`${label.en} in IY ${year}`, `${label['pt-br']} no AI ${year}`);
  const years = ({ lunarYears, approximate }: z.infer<typeof datedAge>, qualification?: Localized) => {
    const prefix = approximate ? 'c. ' : '';
    const context = qualification === undefined ? undefined : localize(qualification);
    return copy(`${prefix}${enNumber.format(lunarYears)} lunar years` + (context ? ` (${context.en})` : ''),
      `${prefix}${ptNumber.format(lunarYears)} anos lunares` + (context ? ` (${context['pt-br']})` : ''));
  };
  if (referenceImperialYear !== undefined) facts.push([
    copy('Record date', 'Data do registro'), copy(`IY ${referenceImperialYear}`, `AI ${referenceImperialYear}`),
  ]);
  if (age) {
    const label = livedAge ? copy('Chronological age', 'Idade cronológica') : copy('Age', 'Idade');
    if ('status' in age) facts.push([label, copy('Undefined', 'Indefinida')]);
    else facts.push([asOf(label, age.asOfImperialYear), 'wording' in age ? localize(age.wording) : years(age, overview.ageContext)]);
  }
  if (livedAge) facts.push([asOf(copy('Lived age', 'Idade vivida'), livedAge.asOfImperialYear), years(livedAge, overview.livedAgeContext)]);
  add(copy('Apparent age', 'Idade aparente'), overview.apparentAge);
  if (birth) {
    const prefix = birth.approximate ? 'c. ' : '';
    facts.push([birth.kind === 'creation' ? copy('Created', 'Criação') : copy('Born', 'Nascimento'),
      birth.date ? localize(birth.date) : copy(`${prefix}IY ${birth.imperialYear}`, `${prefix}AI ${birth.imperialYear}`)]);
  }
  add(copy('Birthplace', 'Naturalidade'), overview.birthplace);
  add(copy('Origin', 'Origem'), overview.origin);
  add(copy('Creator', 'Criação por'), overview.creator);
  const cm = height?.cm ?? heightCm;
  if (cm !== undefined) {
    const prefix = height?.approximate ? 'c. ' : '';
    const measure = (format: Intl.NumberFormat) =>
      `${prefix}${(Array.isArray(cm) ? cm : [cm]).map(value => format.format(value)).join('–')} cm`;
    const context = height?.context && localize(height.context);
    facts.push([copy('Height', 'Altura'), copy(
      measure(enNumber) + (context ? ` (${context.en})` : ''),
      measure(ptNumber) + (context ? ` (${context['pt-br']})` : ''),
    )]);
  }
  if (residence) facts.push([copy('Residence', 'Residência'), Array.isArray(residence) ? localizeList(residence) : localize(residence)]);
  add(copy('Location', 'Localização'), overview.location);
  if (nationality) facts.push([copy('Nationality', 'Nacionalidade'), localizeList(nationality)]);
  add(copy('Occupation', 'Ocupação'), overview.occupation);
  add(copy('Birth name', 'Nome de nascimento'), overview.birthName);
  add(copy('Former name', 'Nome anterior'), overview.formerName);
  add(copy('Formal name', 'Nome formal'), overview.formalName);
  if (aliases) facts.push([copy('Aliases', 'Nomes alternativos'), localizeList(aliases)]);
  add(copy('State', 'Estado'), overview.state);
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
    if (overview.height && overview.heightCm !== undefined) fail(file, 'Use one height field');
    if (Array.isArray(overview.height?.cm) && overview.height.cm[0] > overview.height.cm[1]) {
      fail(file, 'Height range must run from lowest to highest');
    }
    const { systems, redactory, other, profiles } = record.classifications ?? {};
    if (profiles && (systems || redactory || other)) fail(file, 'Use either capability profiles or legacy classifications');
    const redactors = profiles?.filter(profile => profile.kind === 'redactory') ?? [];
    const anchors = redactors.flatMap(profile => profile.anchors ?? []);
    for (const profile of redactors) {
      const types = profile.anchors?.map(entry => entry.type) ?? [];
      if (new Set(types).size !== types.length) fail(file, 'Redactory profile repeats an Anchor');
      if (types.length > 1 && profile.rank) fail(file, 'Put rank on each Anchor in a multi-Anchor profile');
    }
    const references = {
      systems: systems?.map(entry => entry.system) ?? [],
      anchorTypes: [redactory?.anchor?.type, ...anchors.map(entry => entry.type)],
      anchorDepths: [redactory?.anchor?.depth, ...anchors.map(entry => entry.depth)],
      redactorRanks: [redactory?.rank, ...redactors.map(profile => profile.rank), ...anchors.map(entry => entry.rank)],
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
      overview: overviewFacts(overview),
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
