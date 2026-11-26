import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { AnimatePresence, m, useIsPresent } from 'motion/react';
import type { Locale } from '../content';
import { PublicationImage } from '../images/publication';
import { motionTokens, useMotionPreference } from '../motion/system';
import { characterHref, characters, sections, sectionNames, type CharacterRoute } from './characters';
import { AffiliationInsignia, ArchivalInsignia } from './ExaminationInsignia';

type Props = CharacterRoute & { locale: Locale };

const compact = window.matchMedia('(max-width: 700px)');
function onCompactChange(callback: () => void) {
  compact.addEventListener('change', callback);
  return () => compact.removeEventListener('change', callback);
}

export function ExaminationNavigation({ character, section, locale, dossier }: Props) {
  const horizontal = useSyncExternalStore(onCompactChange, () => compact.matches);
  const primary = character.affiliations?.find(entry => entry.primary);
  return <div className="examination-nav" inert={dossier} aria-hidden={dossier}>
    {primary && <AffiliationInsignia affiliation={primary} locale={locale}/>}
    <div role="tablist" aria-label={locale === 'en' ? 'Record sections' : 'Seções do registro'}
      aria-orientation={horizontal ? 'horizontal' : 'vertical'}>
      {sections.map((item, index) => <a key={item} href={characterHref(character.id, item)} role="tab"
        id={'tab-' + item} aria-selected={item === section} tabIndex={item === section ? 0 : -1}
        aria-controls="character-reading" onKeyDown={event => {
          if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
          if (event.key === ' ') { event.preventDefault(); event.currentTarget.click(); return; }
          const next = (index + 1) % sections.length;
          const prev = (index + sections.length - 1) % sections.length;
          const target = { ArrowDown: next, ArrowRight: next, ArrowUp: prev, ArrowLeft: prev,
            Home: 0, End: sections.length - 1 }[event.key];
          if (target === undefined) return;
          event.preventDefault();
          const tab = document.getElementById('tab-' + sections[target]);
          tab?.focus({ preventScroll: true });
          tab?.click();
        }}>{sectionNames[item][locale]}</a>)}
    </div>
    {character.dossier?.[locale] && <a className="dossier-entry" href={characterHref(character.id, 'dossier')}
      onClick={event => {
        if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
        event.preventDefault();
        history.pushState({ dossierSection: section }, '', event.currentTarget.href);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }}>{locale === 'en' ? 'Complete Dossier' : 'Dossiê completo'} <span aria-hidden="true">→</span></a>}
  </div>;
}

function ReadingContent({ character, section, locale }: Props) {
  const present = useIsPresent();
  const reduced = useMotionPreference();
  return <m.div className="examination-content" inert={!present} aria-hidden={!present}
    initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, transition: { duration: reduced ? 0 : motionTokens.control } }}
    transition={{ duration: reduced ? 0 : motionTokens.selection, ease: motionTokens.ease }}>
    {section === 'overview' && <>
      {character.affiliations?.map(entry => <div key={entry.institution + entry.kind} className={entry.primary ? 'compact-affiliation' : undefined}>
        <AffiliationInsignia affiliation={entry} locale={locale}/></div>)}
      <dl className="personal-particulars">{character.overview.map(([label, value]) =>
        <div key={label.en}><dt className="exam-label">{label[locale]}</dt><dd>{value[locale]}</dd></div>)}</dl>
    </>}
    {(section === 'overview' || section === 'abilities') && <ArchivalInsignia character={character} locale={locale}/>}
    {section !== 'overview' && character[section][locale].map((passage, index) =>
      <div className="examination-passage" key={index}>
        {passage.title && <h4>{passage.title}</h4>}<p>{passage.text}</p>
        {passage.link && <a className="system-reference" href={passage.link.href}>{passage.link.label} ↗</a>}
      </div>)}
    {section === 'relations' && character.relationships?.map(relation => {
      const person = characters.find(entry => entry.id === relation.character);
      return person && <a className="related-individual" key={person.id + relation.kind} href={characterHref(person.id)}>
        <PublicationImage asset={person.portrait} sizes="40px" fit="cover" focalPoint={person.portraitFocal} alt=""/>
        {person.name} ↗</a>;
    })}
  </m.div>;
}

export function ExaminationReading(props: Props) {
  const panel = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const reader = panel.current;
    if (reader?.contains(document.activeElement) && document.activeElement?.closest('[inert]')) {
      reader.focus({ preventScroll: true });
    }
    reader?.scrollTo({ top: 0, behavior: 'instant' });
  }, [props.character, props.section, props.locale]);
  return <div ref={panel} className="examination-reading" id="character-reading" role="tabpanel"
    aria-labelledby={'tab-' + props.section} tabIndex={0}>
    <AnimatePresence initial={false}><ReadingContent key={[props.character.id, props.section, props.locale].join('/')} {...props}/></AnimatePresence>
  </div>;
}
