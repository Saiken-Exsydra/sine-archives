import { useRef, useState, type RefObject, type CSSProperties } from 'react';
import { useLocale } from '../site';
import { motionTokens, useMotionPreference } from '../motion/system';
import type { CharacterRoute } from './characters';
import { domains } from './domains';
import './grand-index.css';

export function GrandIndex({ section, ready, returnDomain, character }: {
  character?: CharacterRoute; section: RefObject<HTMLElement | null>; ready: boolean; returnDomain: string;
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
  const select = (index: number) => {
    if (!domains[index]) return;
    section.current?.focus({ preventScroll: true });
    setPreview(0);
    setActive(index);
    history.replaceState({ ...history.state, grandDomain: domains[index].id }, '');
  };
  const offset = -100 * active - (reduced || character ? 0 : preview * 8);
  const style = {
    transform: 'translate3d(' + offset + '%,0,0)',
    '--travel': motionTokens.settle + 's',
    '--ease': 'cubic-bezier(' + motionTokens.ease.join(',') + ')',
  } as CSSProperties;
  return <section id="archive-index" className="grand-index" ref={section} tabIndex={-1}
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
    <p className="index-folio catalog-label">{pt ? 'Arquivos' : 'Archives'} <span>/</span> {pt ? 'Índice de domínios' : 'Domain index'}</p>
    <div className="domain-track" style={style}>{domains.map(({id, Showcase, href}, i) =>
      <div className="domain-room" key={id} inert={i !== active} aria-hidden={i !== active}><Showcase href={href} route={character}/></div>
    )}</div>
    {!character && [-1, 1].map(step => {
      const neighbor = domains[active + step];
      return neighbor && <button type="button" key={step} className={'domain-edge ' + (step < 0 ? 'west' : 'east')}
        aria-label={(pt ? 'Mostrar ' : 'Show ') + neighbor.label[locale]}
        onPointerEnter={event => { if (event.pointerType === 'mouse') setPreview(step); }}
        onPointerLeave={() => setPreview(0)} onClick={() => select(active + step)}>
        <span aria-hidden="true">{step < 0 ? '←' : '→'}</span><b>{neighbor.label[locale]}</b>
      </button>;
    })}
    <span className="domain-status" role="status">{domains[active].label[locale]}</span>
  </section>;
}
