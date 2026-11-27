import { useLayoutEffect, useRef, useState, type RefObject, type CSSProperties } from 'react';
import { AnimatePresence, m, useIsPresent } from 'motion/react';
import { LanguageSelector, useLocale } from '../site';
import { Fullscreen } from '../landing/Fullscreen';
import { motionTokens, useMotionPreference } from '../motion/system';
import { featuredCharacter, type Character, type CharacterRoute } from './characters';
import { domains } from './domains';
import './grand-index.css';

function ExaminationTools() {
  const pt = useLocale() === 'pt-br';
  const present = useIsPresent();
  const reduced = useMotionPreference();
  return <m.div className="masthead examination-tools" inert={!present} aria-hidden={!present}
    initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: reduced ? 0 : motionTokens.control } }}
    transition={{ duration: reduced ? 0 : motionTokens.selection, delay: reduced ? 0 : .07, ease: motionTokens.ease }}>
    <a className="character-return catalog-label" href="#archive-index">← {pt ? 'Grande índice' : 'Grand Index'}</a>
    <nav className="masthead-controls" aria-label={pt ? 'Navegação' : 'Navigation'}><LanguageSelector/><Fullscreen/></nav>
  </m.div>;
}

export function GrandIndex({ section, ready, returnDomain, character, featured = featuredCharacter }: {
  character?: CharacterRoute; featured?: Character; section: RefObject<HTMLElement | null>; ready: boolean; returnDomain: string;
}) {
  const locale = useLocale();
  const pt = locale === 'pt-br';
  const reduced = useMotionPreference();
  const [selected, setActive] = useState(() => {
    const id = character ? 'characters' : history.state?.grandDomain ?? returnDomain;
    const index = domains.findIndex(domain => domain.id === id);
    return index < 0 ? domains.findIndex(domain => domain.id === 'characters') : index;
  });
  const active = character ? domains.findIndex(d => d.id === 'characters') : selected;
  const [preview, setPreview] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const examining = Boolean(character);
  useLayoutEffect(() => {
    if (!examining) return;
    setPreview(0);
    touch.current = null;
  }, [examining]);
  const select = (index: number) => {
    if (!domains[index]) return;
    section.current?.focus({ preventScroll: true });
    setPreview(0);
    setActive(index);
    history.replaceState({ ...history.state, grandDomain: domains[index].id }, '');
  };
  const offset = -100 * active - (reduced || character ? 0 : preview * 8);
  const style = {
    '--settle': motionTokens.settle + 's',
    '--selection': motionTokens.selection + 's',
    '--control': motionTokens.control + 's',
    '--ease': 'cubic-bezier(' + motionTokens.ease.join(',') + ')',
  } as CSSProperties;
  return <section id="archive-index" className="grand-index" ref={section} tabIndex={-1} style={style} data-examining={examining}
    aria-label={pt ? 'Grande índice' : 'Grand Index'} inert={!ready} data-domain={domains[active].id}
    onKeyDown={event => {
      if (character || event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const step = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
      if (step) { event.preventDefault(); select(active + step); }
    }}
    onTouchStart={event => {
      if (character) return;
      const finger = event.touches[0];
      touch.current = event.touches.length === 1 ? { x: finger.clientX, y: finger.clientY } : null;
    }}
    onTouchCancel={() => { touch.current = null; }}
    onTouchEnd={event => {
      if (character) return;
      const start = touch.current;
      touch.current = null;
      if (!start || event.touches.length) return;
      const dx = event.changedTouches[0].clientX - start.x;
      const dy = event.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.5) select(active - Math.sign(dx));
    }}>
    <p className="index-folio catalog-label index-chrome" aria-hidden={examining}>{pt ? 'Arquivos' : 'Archives'} <span>/</span> {pt ? 'Índice de domínios' : 'Domain index'}</p>
    <AnimatePresence initial={false}>{examining && <ExaminationTools/>}</AnimatePresence>
    <div className="domain-track" style={{ transform: 'translate3d(' + offset + '%,0,0)' }}>{domains.map(({id, Showcase, href}, i) =>
      <div className="domain-room" key={id} inert={i !== active} aria-hidden={i !== active}><Showcase href={href} route={character} featured={featured}/></div>
    )}</div>
    {[-1, 1].map(step => {
      const neighbor = domains[active + step];
      return neighbor && <button type="button" key={step} inert={examining} aria-hidden={examining}
        className={'domain-edge index-chrome ' + (step < 0 ? 'west' : 'east')}
        aria-label={(pt ? 'Mostrar ' : 'Show ') + neighbor.label[locale]}
        onPointerMove={event => { if (event.pointerType === 'mouse') setPreview(step); }}
        onPointerLeave={() => setPreview(0)} onClick={() => select(active + step)}>
        <span aria-hidden="true">{step < 0 ? '←' : '→'}</span><b>{neighbor.label[locale]}</b>
      </button>;
    })}
    <span className="domain-status" role="status">{domains[active].label[locale]}</span>
  </section>;
}
