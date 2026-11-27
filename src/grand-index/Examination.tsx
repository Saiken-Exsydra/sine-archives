import { useLayoutEffect, useRef, useSyncExternalStore, type Ref } from 'react';
import { AnimatePresence, m, useIsPresent } from 'motion/react';
import type { Locale } from '../content';
import { PublicationImage } from '../images/publication';
import { motionTokens, useMotionPreference } from '../motion/system';
import { characterHref, characters, sections, sectionNames, type CharacterRoute } from './characters';
import { AffiliationInsignia, ArchivalInsignia } from './ExaminationInsignia';
import { DossierControl } from './DossierSurface';

type Props = CharacterRoute & { locale: Locale };

const compact = window.matchMedia('(max-width: 700px)');
function onCompactChange(callback: () => void) {
  compact.addEventListener('change', callback);
  return () => compact.removeEventListener('change', callback);
}

export function ExaminationNavigation({ character, section, locale, inert, entryRef }: Props & {
  inert: boolean; entryRef: Ref<HTMLAnchorElement>;
}) {
  const horizontal = useSyncExternalStore(onCompactChange, () => compact.matches);
  const primary = character.affiliations?.find(entry => entry.primary);
  return <div className="examination-nav examination-chrome" inert={inert} aria-hidden={inert}>
    {primary && <AffiliationInsignia affiliation={primary} locale={locale}/>}
    <div role="tablist" aria-label={locale === 'en' ? 'Record sections' : 'Seções do registro'}
      aria-orientation={horizontal ? 'horizontal' : 'vertical'}>
      {sections.map((item, index) => <a key={item} href={characterHref(character.id, item)} role="tab" className="pearl-interaction"
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
    {character.dossier && <div className="dossier-threshold">
      <DossierControl className="dossier-entry" ref={entryRef} href={characterHref(character.id, 'dossier')}
        onClick={event => {
          if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
          event.preventDefault();
          history.pushState({ dossierSection: section }, '', event.currentTarget.href);
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        }}>{locale === 'en' ? 'Complete Dossier' : 'Dossiê completo'}</DossierControl>
    </div>}
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
        {passage.link && <a className="system-reference pearl-interaction pearl-text" href={passage.link.href}>{passage.link.label} ↗</a>}
      </div>)}
    {section === 'relations' && character.relationships?.map(relation => {
      const person = characters.find(entry => entry.id === relation.character);
      return person && <a className="related-individual pearl-interaction" key={person.id + relation.kind} href={characterHref(person.id)}>
        <PublicationImage asset={person.portrait} sizes="40px" fit="cover" focalPoint={person.portraitFocal} alt=""/>
        <span>{person.name} <span aria-hidden="true" className="pearl-text">↗</span></span></a>;
    })}
  </m.div>;
}

export function ExaminationReading({ active, ...props }: Props & { active: boolean }) {
  const panel = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!active) return;
    const reader = panel.current;
    if (reader?.contains(document.activeElement) && document.activeElement?.closest('[inert]')) {
      reader.focus({ preventScroll: true });
    }
    reader?.scrollTo({ top: 0, behavior: 'instant' });
    const territory = reader?.closest('.character-caption[data-scroll-all]');
    if (!territory) return;
    const reset = () => territory.scrollTo({ top: 0, behavior: 'instant' });
    reset();
    // A native scroll already in flight can settle after the fragment change.
    const frame = requestAnimationFrame(reset);
    return () => cancelAnimationFrame(frame);
  }, [active, props.character, props.section, props.locale]);
  return <div ref={panel} className="examination-reading examination-chrome" id="character-reading" role="tabpanel"
    aria-labelledby={'tab-' + props.section} tabIndex={0}
    onKeyDown={event => {
      if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      // A keyboard jump should finish before a reader moves to another section.
      const reader = event.currentTarget;
      const surface = reader.closest<HTMLElement>('.character-caption[data-scroll-all]') ?? reader;
      surface.scrollTo({ top: event.key === 'Home' ? 0 : surface.scrollHeight, behavior: 'instant' });
    }}>
    <AnimatePresence initial={false}><ReadingContent key={[props.character.id, props.section, props.locale].join('/')} {...props}/></AnimatePresence>
  </div>;
}
