import { getAnchor, getSystems, type Locale } from '../content';
import { insignia, institutions, type Character } from '../content/characters';
import { localize, localizeList, type Localized } from '../content/character-publication';
import { PublicationImage, type AssetId } from '../images/publication';

type Affiliation = NonNullable<Character['affiliations']>[number];

function SymbolImage({ asset, size }: { asset: AssetId; size: number }) {
  return <PublicationImage key={asset} asset={asset} alt="" sizes={size + 'px'} fit="contain"
    style={{ width: size, height: size }} onError={event => { event.currentTarget.hidden = true; }}/>;
}

export function AffiliationInsignia({ affiliation, locale }: { affiliation: Affiliation; locale: Locale }) {
  const entry = institutions.get(affiliation.institution);
  if (!entry) return null;
  const pt = locale === 'pt-br';
  const kind = {
    'blood-lineage': pt ? 'Linhagem de sangue' : 'Blood lineage',
    membership: pt ? 'Membro' : 'Member',
    family: pt ? 'Família' : 'Family',
    office: pt ? 'Cargo' : 'Office',
    service: entry.category === 'household'
      ? (pt ? 'Serviço doméstico' : 'Household service') : (pt ? 'Serviço' : 'Service'),
    employment: pt ? 'Vínculo empregatício' : 'Employment',
    association: pt ? 'Associação' : 'Association',
    'former-service': pt ? 'Serviço anterior' : 'Former service',
  }[affiliation.kind];
  const name = localize(entry.name)[locale];
  const { role, branch } = affiliation;
  return <div className="affiliation-insignia">
    {entry.emblem && <SymbolImage asset={entry.emblem} size={56}/>}
    <div>
      <span className="exam-label">{kind}</span><strong>{role ? localize(role)[locale] : name}</strong>
      {role && affiliation.kind !== 'office' && <small>{name}</small>}
      {branch && <small>{localize(branch)[locale]}</small>}
    </div>
  </div>;
}

type Inscription = { key: string; label: string; value: string; asset?: AssetId; detail?: string; href?: string };
type SymbolGroup = 'systems' | 'anchorTypes' | 'anchorDepths' | 'redactorRanks' | 'other';
type Profile = NonNullable<NonNullable<Character['classifications']>['profiles']>[number];
type RedactoryProfile = Extract<Profile, { kind: 'redactory' }>;

function symbol(group: SymbolGroup, id: string | undefined, label: string, locale: Locale,
  detail?: string, href?: string): Inscription | undefined {
  const entry = id && insignia.get(group)?.get(id);
  if (entry) return { key: [group, id, label].join('-'), label, value: localize(entry.name)[locale],
    asset: entry.insignia, detail, href };
}

const profileNames = {
  redactory: 'Redactory',
  divination: { en: 'Divination', 'pt-BR': 'Divinação' },
  bloom: 'Bloom',
  elemental: 'Elemental',
  continuity: { en: 'Continuity', 'pt-BR': 'Continuidade' },
  exceptional: { en: 'Exceptional capability', 'pt-BR': 'Capacidade excepcional' },
} satisfies Record<Profile['kind'], Localized>;

const profileFields = {
  classification: { en: 'Classification', 'pt-BR': 'Classificação' },
  alignment: { en: 'Alignment', 'pt-BR': 'Alinhamento' },
  domain: { en: 'Domain', 'pt-BR': 'Domínio' },
  manifestation: { en: 'Manifestation', 'pt-BR': 'Manifestação' },
  seraphicLine: { en: 'Seraphic line', 'pt-BR': 'Linhagem seráfica' },
  constellation: { en: 'Constellation', 'pt-BR': 'Constelação' },
  fragmentClassification: { en: 'Fragment classification', 'pt-BR': 'Classificação do fragmento' },
  fusionStatus: { en: 'Fusion status', 'pt-BR': 'Estado da fusão' },
  inheritance: { en: 'Inheritance', 'pt-BR': 'Herança' },
  expression: { en: 'Expression', 'pt-BR': 'Expressão' },
  succession: { en: 'Succession', 'pt-BR': 'Sucessão' },
  lineage: { en: 'Lineage', 'pt-BR': 'Linhagem' },
  authority: { en: 'Authority', 'pt-BR': 'Autoridade' },
  state: { en: 'State', 'pt-BR': 'Estado' },
  principle: { en: 'Principle', 'pt-BR': 'Princípio' },
  abilities: { en: 'Core abilities', 'pt-BR': 'Habilidades centrais' },
  assessment: { en: 'Assessment', 'pt-BR': 'Avaliação' },
} satisfies Record<string, Localized>;

function capabilitySystem(kind: Profile['kind'], locale: Locale): Inscription {
  const name = localize(profileNames[kind])[locale];
  const label = locale === 'pt-br' ? 'Capacidade' : 'Capability';
  const system = getSystems(locale).find(entry => entry.id === kind);
  return symbol('systems', kind, label, locale, system?.summary, system && '#/systems/' + system.id)
    ?? { key: kind, label, value: name };
}

function RedactoryInscription({ profile, locale }: { profile: RedactoryProfile; locale: Locale }) {
  const pt = locale === 'pt-br';
  const definition = getAnchor(locale);
  const href = '#/systems/redactory/anchor';
  const rank = (id?: string) => symbol('redactorRanks', id, pt ? 'Posto de Redactor' : 'Redactor rank', locale);
  const add = (key: string, en: string, br: string, value?: Localized): Inscription | undefined =>
    value === undefined ? undefined : { key, label: pt ? br : en, value: localize(value)[locale] };
  const anchorRows = (profile.anchors ?? []).map(anchor => [
    symbol('anchorTypes', anchor.type, pt ? 'Tipo de Anchor' : 'Anchor type', locale, definition.definition, href),
    symbol('anchorDepths', anchor.depth, pt ? 'Profundidade da Anchor' : 'Anchor depth', locale, definition.measures[0], href),
    rank(anchor.rank),
    add('reading', 'Anchor reading', 'Leitura da Anchor', anchor.reading),
  ].filter(item => item !== undefined));
  const multiAnchor = anchorRows.length > 1;
  const rows = [
    capabilitySystem('redactory', locale),
    ...(multiAnchor ? [] : anchorRows.flat()),
    add('tradition', 'Tradition', 'Tradição', profile.tradition),
    rank(profile.rank),
    add('training', 'Training', 'Formação', profile.training),
    add('mark', 'Mark', 'Mark', profile.mark === 'open' ? 'Open Mark' : profile.mark?.toString()),
    add('reach', 'Reach', 'Alcance', profile.reach),
    add('status', 'Registry status', 'Situação no registro', profile.status),
    add('restrictions', 'Restrictions', 'Restrições', profile.restrictions),
  ].filter(item => item !== undefined);
  return <><Inscriptions rows={rows} label="Redactory" locale={locale}/>
    {multiAnchor && <div className="anchor-inscriptions">{anchorRows.map(group =>
      <Inscriptions key={group[0].key} rows={group} label={group[0].value} locale={locale}/>)}</div>}</>;
}

function CapabilityInscription({ profile, locale }: { profile: Profile; locale: Locale }) {
  if (profile.kind === 'redactory') return <RedactoryInscription profile={profile} locale={locale}/>;
  const rows = [capabilitySystem(profile.kind, locale)];
  for (const key of Object.keys(profileFields) as (keyof typeof profileFields)[]) {
    const value = (profile as Partial<Record<typeof key, Localized | Localized[]>>)[key];
    if (value === undefined) continue;
    rows.push({
      key,
      label: localize(profileFields[key])[locale],
      value: (Array.isArray(value) ? localizeList(value) : localize(value))[locale],
    });
  }
  return <Inscriptions rows={rows} label={rows[0].value} locale={locale}/>;
}

export function ArchivalInsignia({ character, locale }: { character: Character; locale: Locale }) {
  const data = character.classifications;
  if (!data) return null;
  if (data.profiles) return data.profiles.length ? <div className="capability-profiles">
    {data.profiles.map((profile, index) => <CapabilityInscription key={index} profile={profile} locale={locale}/>)}
  </div> : null;
  const pt = locale === 'pt-br';
  const systems = getSystems(locale);
  const rows: Inscription[] = [];
  function add(group: SymbolGroup,
    id: string | undefined, label: string, detail?: string, href?: string) {
    const row = symbol(group, id, label, locale, detail, href);
    if (row) rows.push(row);
  }
  for (const { system, kind } of data.systems ?? []) {
    const record = systems.find(entry => entry.id === system);
    add('systems', system, kind === 'capability' ? (pt ? 'Capacidade' : 'Capability') : (pt ? 'Afiliação' : 'Affiliation'),
      record?.summary, record && '#/systems/' + record.id);
  }
  const red = data.redactory;
  if (red?.anchor) {
    const anchor = getAnchor(locale);
    add('anchorTypes', red.anchor.type, pt ? 'Tipo de Anchor' : 'Anchor type', anchor.definition, '#/systems/redactory/anchor');
    add('anchorDepths', red.anchor.depth, pt ? 'Profundidade da Anchor' : 'Anchor depth', anchor.measures[0], '#/systems/redactory/anchor');
  }
  add('redactorRanks', red?.rank, pt ? 'Posto de Redactor' : 'Redactor rank');
  if (red?.mark !== undefined) rows.push({ key: 'mark', label: 'Mark', value: String(red.mark) });
  for (const id of data.other ?? []) add('other', id, pt ? 'Classificação' : 'Classification');
  return <Inscriptions rows={rows} label={pt ? 'Classificações' : 'Classifications'} locale={locale}/>;
}

function Inscriptions({ rows, label, locale }: { rows: Inscription[]; label: string; locale: Locale }) {
  if (!rows.length) return null;
  return <ul className="archival-insignia" aria-label={label}>
    {rows.map(({ key, label, value, asset, detail, href }) => {
      const identity = <>{asset && <SymbolImage asset={asset} size={28}/>}
        <span><small className="exam-label">{label}</small><strong>{value}</strong></span></>;
      return <li key={key}>{detail ? <details><summary className="pearl-interaction">{identity}</summary><p>{detail}</p>
        {href && <a className="system-reference pearl-interaction pearl-text" href={href}>{locale === 'pt-br' ? 'Consultar registro' : 'Read record'} ↗</a>}
      </details> : <div>{identity}</div>}</li>;
    })}
  </ul>;
}
