import { getAnchor, getSystems, type Locale } from '../content';
import { insignia, institutions, type Character } from '../content/characters';
import { localize } from '../content/character-publication';
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
    service: entry.category === 'household'
      ? (pt ? 'Serviço doméstico' : 'Household service') : (pt ? 'Serviço' : 'Service'),
    employment: pt ? 'Vínculo empregatício' : 'Employment',
    association: pt ? 'Associação' : 'Association',
  }[affiliation.kind];
  return <div className="affiliation-insignia">
    {entry.emblem && <SymbolImage asset={entry.emblem} size={56}/>}
    <div><span className="exam-label">{kind}</span><strong>{localize(entry.name)[locale]}</strong></div>
  </div>;
}

export function ArchivalInsignia({ character, locale }: { character: Character; locale: Locale }) {
  const data = character.classifications;
  if (!data) return null;
  const pt = locale === 'pt-br';
  const systems = getSystems(locale);
  const rows: { key: string; label: string; value: string; asset?: AssetId; detail?: string; href?: string }[] = [];
  function add(group: 'systems' | 'anchorTypes' | 'anchorDepths' | 'redactorRanks' | 'other',
    id: string | undefined, label: string, detail?: string, href?: string) {
    const entry = id && insignia.get(group)?.get(id);
    if (entry) rows.push({ key: [group, id, label].join('-'), label, value: localize(entry.name)[locale],
      asset: entry.insignia, detail, href });
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
  if (!rows.length) return null;
  return <ul className="archival-insignia" aria-label={pt ? 'Classificações' : 'Classifications'}>
    {rows.map(({ key, label, value, asset, detail, href }) => {
      const identity = <>{asset && <SymbolImage asset={asset} size={28}/>}
        <span><small className="exam-label">{label}</small><strong>{value}</strong></span></>;
      return <li key={key}>{detail ? <details><summary className="pearl-interaction">{identity}</summary><p>{detail}</p>
        {href && <a className="system-reference pearl-interaction pearl-text" href={href}>{pt ? 'Consultar registro' : 'Read record'} ↗</a>}
      </details> : <div>{identity}</div>}</li>;
    })}
  </ul>;
}
