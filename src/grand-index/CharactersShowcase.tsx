import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { useLocale } from '../site';
import { motionTokens, useMotionPreference } from '../motion/system';
import { characters, characterHref, featuredCharacter, sectionNames, sections, type CharacterRoute } from './characters';
import './characters.css';

function CharacterRail({ character, section }: CharacterRoute) {
  const pt = useLocale() === 'pt-br';
  const overview = section === 'overview';
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [inside, setInside] = useState(false);
  const handle = useRef<HTMLButtonElement>(null);
  const expanded = overview || hover || pinned || inside;
  function close() {
    setHover(false); setPinned(false); setInside(false);
  }
  useLayoutEffect(close, [section]);
  const label = pt ? 'Explorar personagens' : 'Browse individuals';
  return <nav className="individual-rail" data-open={expanded} aria-label={label}
    onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(true); }}
    onPointerLeave={() => setHover(false)}
    onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) { setPinned(false); setInside(false); } }}
    onKeyDown={e => { if (e.key === 'Escape' && !overview) { handle.current?.focus(); close(); } }}>
    {overview ? <div className="rail-label">{label}</div>
      : <button type="button" ref={handle} className="rail-label" aria-expanded={expanded} aria-controls="individuals"
          onFocus={e => { if (e.currentTarget.matches(':focus-visible')) setInside(true); }}
          onClick={() => { if (pinned) close(); else setPinned(true); }}>
          {label}<span aria-hidden="true">{expanded ? '⌄' : '⌃'}</span></button>}
    <div id="individuals" className="individuals" inert={!expanded} onFocus={() => setInside(true)}>
      {characters.map(person => <a key={person.id} href={characterHref(person.id, section)}
        aria-current={person.id === character.id ? 'true' : undefined} aria-label={person.name}>
        <img src={person.portrait} alt="" width="60" height="72"/><span>{person.shortName}</span>
      </a>)}
    </div>
  </nav>;
}

export function CharactersShowcase({ route }: { href: string; route?: CharacterRoute }) {
  const locale = useLocale();
  const pt = locale === 'pt-br';
  const character = route?.character ?? featuredCharacter;
  const section = route?.section ?? 'overview';
  const reduced = useMotionPreference();
  const title = useRef<HTMLHeadingElement>(null);
  const expanded = Boolean(route);
  useLayoutEffect(() => {
    if (expanded) title.current?.focus({ preventScroll: true });
  }, [expanded]);
  const domain = pt ? 'Personagens' : 'Characters';
  return <div className="exhibition character-exhibit" data-expanded={expanded} data-section={section}>
    <AnimatePresence initial={false}><m.img key={character.id} className="scene-art" src={character.art} alt=""
      style={{ '--focal': character.focal, '--mobile-focal': character.mobileFocal } as CSSProperties}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : motionTokens.selection, ease: motionTokens.ease }}/>
    </AnimatePresence>
    {expanded && <a className="character-return catalog-label" href="#archive-index">← {pt ? 'Grande índice' : 'Grand Index'}</a>}
    <div className="character-caption">
      {expanded ? <h1 className="catalog-label" tabIndex={-1} ref={title}>{domain}</h1>
        : <p className="catalog-label">{pt ? 'Pessoa em destaque' : 'Featured individual'}</p>}
      <h3 aria-level={expanded ? 2 : 3}>{character.name}</h3>
      <p className="character-rank">{character.designation}</p>
      {!expanded && <p className="character-summary">{character.summary[locale]}</p>}
      {route && <>
        <div className="character-tabs" role="tablist" aria-label={pt ? 'Seções do registro' : 'Record sections'}>
          {sections.map((item,i) => <a href={characterHref(character.id,item)} key={item} role="tab"
            id={'tab-'+item} aria-selected={item === section} tabIndex={item === section ? 0 : -1} aria-controls="character-reading"
            onKeyDown={e => {
              if (e.key === ' ') { e.preventDefault(); e.currentTarget.click(); return; }
              const next = {ArrowRight:(i+1)%4,ArrowLeft:(i+3)%4,Home:0,End:3}[e.key];
              if (next === undefined) return;
              e.preventDefault();
              const tab = document.getElementById('tab-'+sections[next]);
              tab?.focus(); tab?.click();
            }}>{sectionNames[item][locale]}</a>)}
        </div>
        <div key={character.id+section} className="character-reading" id="character-reading" role="tabpanel" aria-labelledby={'tab-'+section} tabIndex={0}>
          {section === 'overview' ? <dl>{character.overview.map(([label,value]) =>
            <div key={label.en}><dt>{label[locale]}</dt><dd>{value[locale]}</dd></div>)}</dl>
          : character[section].map((passage,i) => <div key={i}>
              {passage.title && <h4>{passage.title[locale]}</h4>}<p>{passage.text[locale]}</p>
              {passage.link && <a className="system-reference" href={passage.link.href}>{passage.link.label} ↗</a>}
            </div>)}
        </div>
      </>}
    </div>
    <div className="character-domain" inert={expanded} aria-hidden={expanded}>
      <h2>{domain}</h2>
      <a className="domain-entry" href={characterHref(character.id)}>{pt ? 'Explorar personagens' : 'Open Characters'} <span aria-hidden="true">↗</span></a>
    </div>
    {route && <CharacterRail {...route}/>}
  </div>;
}
