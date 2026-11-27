import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { useLocale } from '../site';
import { imageProps, imageReady } from '../images/publication';
import { motionTokens, useMotionPreference } from '../motion/system';
import { parseLocation } from '../navigation';
import { characterHref, type Character, type CharacterRoute } from './characters';
import { IndividualRegistry, dismissRegistry, openRegistry, registryOpen, revealFrom, useRegistryOpen } from './IndividualRegistry';
import { ExaminationNavigation, ExaminationReading } from './Examination';
import { DossierSurface } from './DossierSurface';
import { CharacterName, CharacterThreshold } from './CharacterThreshold';
import './characters.css';
import './examination.css';
import './dossier.css';

export function CharactersShowcase({ route, featured }: { href: string; route?: CharacterRoute; featured: Character }) {
  const locale = useLocale();
  const pt = locale === 'pt-br';
  const expanded = Boolean(route);
  const open = useRegistryOpen();
  const trigger = useRef<HTMLButtonElement>(null);
  const frame = useRef<HTMLElement | null>(null);
  const [selection, setSelection] = useState<Character>();
  const aperture = useRef<string[] | undefined>(undefined);
  const intended = open ? selection : undefined;
  const requested = intended ?? route?.character ?? featured;
  useLayoutEffect(() => {
    if (!open) { setSelection(undefined); frame.current = null; }
    else aperture.current = undefined;
  }, [open]);
  const requestedSection = intended ? 'overview' : route?.section ?? 'overview';
  const [presentation, setPresentation] = useState<{
    character: CharacterRoute['character']; previous?: CharacterRoute['character']; failed?: boolean;
  }>(() => ({ character: requested }));
  const { character, previous, failed } = presentation;
  // Back during a fade can restore the still-mounted, already decoded environment.
  if (!intended && previous === requested) setPresentation({ character: requested });
  const pending = character !== requested;
  const [view, setView] = useState({ expanded, returning: false });
  const featuredHandoff = !expanded && view.returning && (pending || Boolean(previous));
  if (view.expanded !== expanded || (view.returning && !featuredHandoff)) {
    setView({ expanded, returning: !expanded && view.expanded && pending });
  }
  const featuredPending = featuredHandoff && pending;
  const incoming = useRef<HTMLImageElement>(null);
  const lastSection = useRef(requestedSection);
  const section = pending || !expanded ? lastSection.current : requestedSection;
  useLayoutEffect(() => { lastSection.current = section; }, [section]);
  useLayoutEffect(() => {
    if (!pending || !incoming.current) return;
    const controller = new AbortController();
    function settle(unavailable: boolean) {
      if (controller.signal.aborted || (!expanded && parseLocation(location.hash).domain === 'characters')) return;
      if (intended) {
        if (!registryOpen() || !frame.current) return;
        aperture.current = unavailable ? undefined : revealFrom(frame.current.getBoundingClientRect());
        const { individualRegistry, ...state } = history.state;
        history.replaceState(state, '', characterHref(intended.id));
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
      setPresentation({ character: requested, failed: unavailable,
        previous: intended || failed || unavailable ? undefined : character });
    }
    imageReady(incoming.current, controller.signal).then(() => settle(false), () => settle(true));
    return () => controller.abort();
  }, [requested, character, failed, pending, intended, expanded]);
  const reduced = useMotionPreference();
  const title = useRef<HTMLHeadingElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const identity = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const territory = caption.current;
    const heading = identity.current;
    if (!territory || !heading) return;
    // Keep a usable reading area when the identity takes up most of the viewport.
    const update = () => territory.toggleAttribute('data-scroll-all', territory.clientHeight - heading.offsetHeight < 112);
    const resize = new ResizeObserver(update);
    resize.observe(territory);
    resize.observe(heading);
    update();
    return () => {
      resize.disconnect();
      territory.removeAttribute('data-scroll-all');
    };
  }, []);
  useLayoutEffect(() => {
    if (expanded) document.title = character.name + ' · SiNE Archives';
  }, [character, expanded]);
  useLayoutEffect(() => {
    if (expanded) title.current?.focus({ preventScroll: true });
  }, [expanded]);
  const documentLocale = character.dossier?.[locale] ? locale : locale === 'en' ? 'pt-br' : 'en';
  const edition = character.dossier?.[documentLocale];
  const dossier = Boolean(route?.dossier && edition && !pending);
  const dossierEntry = useRef<HTMLAnchorElement>(null);
  const dossierClose = useRef<HTMLAnchorElement>(null);
  const wasReading = useRef(false);
  useLayoutEffect(() => {
    if (route?.dossier && !pending && !edition) {
      history.replaceState(null, '', characterHref(character.id, section));
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
    if (dossier) dossierClose.current?.focus({ preventScroll: true });
    else if (wasReading.current && route) {
      const target = dossierEntry.current ?? title.current;
      target?.focus({ preventScroll: true });
    }
    wasReading.current = dossier;
  }, [dossier, route?.dossier, pending, edition, character.id, section]);
  const domain = pt ? 'Personagens' : 'Characters';
  const examined = featuredHandoff && previous ? previous : character;
  const unavailable = pt ? 'Ilustração indisponível.' : 'Artwork unavailable.';
  const layers = [];
  if (previous && previous !== requested) layers.push(previous);
  if (!failed) layers.push(character);
  if (pending) layers.push(requested);
  return <CharacterThreshold className="exhibition character-exhibit" expanded={expanded} reduced={reduced}
    subject={dossier || featuredHandoff || (expanded && pending) ? undefined : character.id}
    data-dossier={dossier} data-section={section}
    data-featured-pending={featuredPending} data-featured-handoff={featuredHandoff}>
    {layers.map(person => <m.img key={person.id} className="scene-art" {...imageProps(person.art, '100vw', '')}
        ref={pending && person === requested ? incoming : undefined}
        loading={expanded || pending ? 'eager' : 'lazy'} fetchPriority={expanded ? 'high' : 'auto'}
        style={{ '--focal': person.focal ?? 'center', '--mobile-focal': person.mobileFocal ?? person.focal ?? 'center' } as CSSProperties}
        initial={false} animate={{ opacity: pending && person === requested ? 0 : 1 }}
        transition={{ duration: reduced || aperture.current || (pending && person === requested) ? 0 : motionTokens.selection, ease: motionTokens.ease }}
        onError={() => { if (person === character) setPresentation({ character, failed: true }); }}
        onAnimationComplete={() => {
          if (person === character && previous) setPresentation(current =>
            current === presentation ? { character } : current);
        }}/>)}
    <div className="character-lighting" aria-hidden="true"/>
    <ExaminationNavigation inert={!expanded || dossier} entryRef={dossierEntry} character={examined} section={section} locale={locale}/>
    <div className="character-caption" ref={caption} inert={!expanded || dossier} aria-hidden={!expanded || dossier}>
      <div className="character-identity" ref={identity}>
        <h1 className="catalog-label examination-chrome" tabIndex={-1} ref={title}>{domain}</h1>
        <CharacterName name={examined.name} expanded/>
        <p className="character-rank" data-identity-travel>{examined.designation[locale]}</p>
        {expanded && failed && <p role="status">{unavailable}</p>}
      </div>
      <ExaminationReading active={expanded} character={examined} section={section} locale={locale}/>
    </div>
    <div className="featured-caption" inert={expanded || featuredPending} aria-hidden={expanded || featuredPending}
      tabIndex={0} role="region" aria-labelledby="featured-individual">
      <p className="catalog-label index-chrome" id="featured-individual">{pt ? 'Pessoa em destaque' : 'Featured individual'}</p>
      <div className="featured-identity">
        <CharacterName name={character.name}/>
        <p className="featured-rank" data-identity-travel>{character.designation[locale]}</p>
        {!expanded && !featuredPending && failed && <p role="status">{unavailable}</p>}
      </div>
      <p className="character-summary index-chrome">{character.summary[locale]}</p>
    </div>
    <div className="character-domain index-chrome" inert={expanded} aria-hidden={expanded}>
      <h2>{domain}</h2>
      <a className="domain-entry" href={characterHref(character.id)}>{pt ? 'Explorar personagens' : 'Open Characters'} <span aria-hidden="true">↗</span></a>
    </div>
    <AnimatePresence initial={false}>
      {dossier && edition && <DossierSurface key={character.id} character={character} section={section} locale={locale}
        load={edition} documentLocale={documentLocale} closeRef={dossierClose}/>}
    </AnimatePresence>
    <button inert={!expanded || dossier} aria-hidden={!expanded || dossier} ref={trigger} className="registry-trigger examination-chrome" aria-haspopup="dialog" aria-expanded={open && expanded}
      onClick={openRegistry}>
      <span className="registry-threshold-mark">
        <i aria-hidden="true"/><span>{pt ? 'Registro de indivíduos' : 'Registry of Individuals'}</span>
      </span>
    </button>
    <AnimatePresence custom={aperture.current} onExitComplete={() => {
      aperture.current = undefined;
      trigger.current?.focus({ preventScroll: true });
    }}>
      {route && open && <IndividualRegistry key="registry" current={character} pending={intended}
        onSelect={(person, origin) => {
          if (person === character) { setSelection(undefined); dismissRegistry(); return; }
          frame.current = origin;
          setSelection(person);
        }}/>}
    </AnimatePresence>
  </CharacterThreshold>;
}
