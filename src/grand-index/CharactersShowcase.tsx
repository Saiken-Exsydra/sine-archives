import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { useLocale } from '../site';
import { imageProps, imageReady } from '../images/publication';
import { motionTokens, useMotionPreference } from '../motion/system';
import { characterHref, featuredCharacter, type Character, type CharacterRoute } from './characters';
import { IndividualRegistry, dismissRegistry, openRegistry, registryOpen, revealFrom, useRegistryOpen } from './IndividualRegistry';
import { ExaminationNavigation, ExaminationReading } from './Examination';
import './characters.css';
import './examination.css';

export function CharactersShowcase({ route }: { href: string; route?: CharacterRoute }) {
  const locale = useLocale();
  const pt = locale === 'pt-br';
  const open = useRegistryOpen();
  const trigger = useRef<HTMLButtonElement>(null);
  const frame = useRef<HTMLElement | null>(null);
  const [selection, setSelection] = useState<Character>();
  const aperture = useRef<string[] | undefined>(undefined);
  const intended = open ? selection : undefined;
  const requested = intended ?? route?.character ?? featuredCharacter;
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
  const incoming = useRef<HTMLImageElement>(null);
  const lastSection = useRef(requestedSection);
  const section = pending ? lastSection.current : requestedSection;
  useLayoutEffect(() => { lastSection.current = section; }, [section]);
  useLayoutEffect(() => {
    if (!pending || !incoming.current) return;
    const controller = new AbortController();
    function settle(unavailable: boolean) {
      if (controller.signal.aborted) return;
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
  }, [requested, character, failed, pending, intended]);
  const reduced = useMotionPreference();
  const title = useRef<HTMLHeadingElement>(null);
  const expanded = Boolean(route);
  useLayoutEffect(() => {
    if (expanded) document.title = character.name + ' · SiNE Archives';
  }, [character, expanded]);
  useLayoutEffect(() => {
    if (expanded) title.current?.focus({ preventScroll: true });
  }, [expanded]);
  const domain = pt ? 'Personagens' : 'Characters';
  const layers = [];
  if (previous && previous !== requested) layers.push(previous);
  if (!failed) layers.push(character);
  if (pending) layers.push(requested);
  return <div className="exhibition character-exhibit" data-expanded={expanded} data-section={section}
    style={{ '--selection': motionTokens.selection + 's', '--control': motionTokens.control + 's' } as CSSProperties}>
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
    {expanded && <a className="character-return catalog-label" href="#archive-index">← {pt ? 'Grande índice' : 'Grand Index'}</a>}
    {route && <ExaminationNavigation character={character} section={section} locale={locale}/>}
    <div className="character-caption">
      {expanded ? <h1 className="catalog-label" tabIndex={-1} ref={title}>{domain}</h1>
        : <p className="catalog-label">{pt ? 'Pessoa em destaque' : 'Featured individual'}</p>}
      <h3 aria-level={expanded ? 2 : 3}>{character.name}</h3>
      <p className="character-rank">{character.designation[locale]}</p>
      {failed && <p role="status">{pt ? 'Ilustração indisponível.' : 'Artwork unavailable.'}</p>}
      {!expanded && <p className="character-summary">{character.summary[locale]}</p>}
      {route && <ExaminationReading character={character} section={section} locale={locale}/>}
    </div>
    <div className="character-domain" inert={expanded} aria-hidden={expanded}>
      <h2>{domain}</h2>
      <a className="domain-entry" href={characterHref(character.id)}>{pt ? 'Explorar personagens' : 'Open Characters'} <span aria-hidden="true">↗</span></a>
    </div>
    {route && <button ref={trigger} className="registry-trigger" aria-haspopup="dialog" aria-expanded={open}
      onClick={openRegistry}><i aria-hidden="true"/><span>{pt ? 'Registro de indivíduos' : 'Registry of Individuals'}</span></button>}
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
  </div>;
}
