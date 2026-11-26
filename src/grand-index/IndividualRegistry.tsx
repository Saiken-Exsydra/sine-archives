import { useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { m, useIsPresent } from 'motion/react';
import { PublicationImage } from '../images/publication';
import { motionTokens, useMotionPreference } from '../motion/system';
import { useLocale } from '../site';
import { characterHref, characters, type Character } from './characters';
import './registry.css';

const changed = 'sine:registry';
function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('hashchange', callback);
  window.addEventListener(changed, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('hashchange', callback);
    window.removeEventListener(changed, callback);
  };
}
export function registryOpen() { return history.state?.individualRegistry === location.href; }
export function useRegistryOpen() { return useSyncExternalStore(subscribe, registryOpen); }
export function openRegistry() {
  if (registryOpen()) return;
  history.pushState({ ...history.state, individualRegistry: location.href }, '');
  window.dispatchEvent(new Event(changed));
}
export function dismissRegistry() { if (registryOpen()) history.back(); }

function aperture(left: number, top: number, right: number, bottom: number) {
  // Opposite winding punches a rectangular opening through the gallery surface.
  return `polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 0%,${left}% ${top}%,${left}% ${bottom}%,${right}% ${bottom}%,${right}% ${top}%,${left}% ${top}%)`;
}
export function revealFrom(frame: DOMRect) {
  const x = (frame.left + frame.width / 2) * 100 / innerWidth;
  const y = (frame.top + frame.height / 2) * 100 / innerHeight;
  return [aperture(x,y,x,y), aperture(frame.left*100/innerWidth, frame.top*100/innerHeight,
    frame.right*100/innerWidth, frame.bottom*100/innerHeight), aperture(0,0,100,100)];
}
export function IndividualRegistry({ current, pending, onSelect, collection = characters }: {
  current: Character; pending?: Character; collection?: readonly Character[];
  onSelect: (character: Character, frame: HTMLElement) => void;
}) {
  const pt = useLocale() === 'pt-br';
  const reduced = useMotionPreference();
  const present = useIsPresent();
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [attention, setAttention] = useState<HTMLAnchorElement | null>(null);
  const pointer = useRef<{x:number; y:number} | null>(null);
  const light = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const surface = light.current!;
    const rail = track.current!;
    if (!attention || !present || pending) {
      surface.dataset.lit = 'false';
      return;
    }
    function place(event?: Event) {
      const rect = attention!.getBoundingClientRect();
      surface.style.setProperty('--light-x', rect.left + rect.width / 2 + 'px');
      surface.dataset.tracking = String(event?.type === 'scroll');
      surface.dataset.lit = String(rect.right > 0 && rect.left < rail.clientWidth);
    }
    place();
    const observer = new ResizeObserver(() => place());
    observer.observe(rail);
    rail.addEventListener('scroll', place, {passive:true});
    return () => { observer.disconnect(); rail.removeEventListener('scroll', place); };
  }, [attention, present, pending]);
  const [edges, setEdges] = useState({ left: false, right: false });
  useLayoutEffect(() => {
    const modal = dialog.current!;
    const rail = track.current!;
    modal.showModal();
    const active = rail.querySelector<HTMLElement>('[aria-current="true"]');
    active?.focus({ preventScroll: true });
    active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' });
    const update = () => {
      const left = rail.scrollLeft > 1;
      const right = rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 1;
      setEdges(previous => previous.left === left && previous.right === right ? previous : { left, right });
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || rail.scrollWidth <= rail.clientWidth) return;
      event.preventDefault();
      const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rail.clientWidth : 1;
      rail.scrollLeft += event.deltaY * scale;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    rail.addEventListener('scroll', update);
    rail.addEventListener('wheel', wheel, { passive: false });
    return () => {
      observer.disconnect();
      rail.removeEventListener('scroll', update);
      rail.removeEventListener('wheel', wheel);
      modal.close();
    };
  }, []);
  function browse(direction: number) {
    const rail = track.current!;
    rail.scrollBy({ left: direction * rail.clientWidth * .75, behavior: reduced ? 'instant' : 'smooth' });
  }

  return <m.dialog ref={dialog} className="individual-registry" aria-labelledby="registry-title"
    onCancel={event => { event.preventDefault(); dismissRegistry(); }}
    initial={{ y: reduced ? '0%' : '100%' }} animate={{ y: '0%' }}
    transition={{ duration: reduced ? 0 : motionTokens.settle, ease: motionTokens.ease }}
    exit="depart" variants={{ depart: (opening?: string[]) => opening && !reduced
      ? { clipPath: opening, transition: { duration: motionTokens.settle, times: [0,.23,1], ease: motionTokens.ease } }
      : { y: reduced ? '0%' : '100%', transition: { duration: reduced ? 0 : motionTokens.settle, ease: motionTokens.ease } } }}>
    <div className="registry-room" inert={!present}
      onPointerMove={e => {
        // Scroll can move another frame under a stationary mouse during keyboard navigation.
        if (e.pointerType === 'touch' || (pointer.current?.x === e.clientX && pointer.current.y === e.clientY)) return;
        pointer.current = {x:e.clientX, y:e.clientY};
        setAttention((e.target as Element).closest<HTMLAnchorElement>('.registry-portrait'));
      }}
      onPointerLeave={() => {
        pointer.current = null;
        setAttention(track.current?.querySelector<HTMLAnchorElement>('a:focus-visible') ?? null);
      }}
      style={{
      '--response': motionTokens.control + 's', '--shift': motionTokens.selection + 's',
      '--response-ease': 'cubic-bezier(' + motionTokens.ease.join(',') + ')'
    } as CSSProperties}>
      <div className="registry-wall-light" ref={light} aria-hidden="true"/>
      <header className="registry-heading">
        <h2 id="registry-title">{pt ? 'Registro de indivíduos' : 'Registry of Individuals'}</h2>
      </header>
      <div className="registry-track" ref={track} onKeyDown={event => {
        const links = Array.from(event.currentTarget.querySelectorAll('a'));
        const i = links.indexOf(event.target as HTMLAnchorElement);
        const next = { ArrowLeft: i-1, ArrowRight: i+1, Home: 0, End: links.length-1 }[event.key];
        if (next === undefined || i < 0) return;
        event.preventDefault();
        links[next]?.focus({preventScroll:true});
        links[next]?.scrollIntoView({inline:'center',block:'nearest',behavior:reduced ? 'instant' : 'smooth'});
      }}>
        {collection.map(person => <a key={person.id} href={characterHref(person.id)}
          className="registry-portrait" aria-label={person.name} aria-current={current.id === person.id ? 'true' : undefined}
          data-attended={present && !pending && attention?.dataset.person === person.id}
          data-person={person.id}
          onFocus={e => { if (e.currentTarget.matches(':focus-visible')) setAttention(e.currentTarget); }}
          onBlur={e => { const link = e.currentTarget; setAttention(value => value === link ? null : value); }}
          data-pending={pending?.id === person.id} onClick={event => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            const frame = event.currentTarget.querySelector<HTMLElement>('.registry-frame')!;
            event.currentTarget.style.setProperty('--activated-transform', getComputedStyle(frame).transform);
            onSelect(person, frame);
          }}>
          <span className="registry-frame"><PublicationImage asset={person.portrait} alt="" sizes="auto, (max-height: 440px) min(72vw, 29dvh, 420px), min(72vw, 38dvh, 420px)"
            fit="cover" focalPoint={person.portraitFocal ?? 'center'}/></span>
          <span className="registry-name">{person.name}<span className="registry-designation">{person.designation}</span></span>
        </a>)}
      </div>
      <footer className="registry-footer">
        <button type="button" className="registry-threshold" onClick={dismissRegistry}>
          <span>{pt ? 'Voltar ao registro' : 'Return to record'}</span><i aria-hidden="true"/>
        </button>
        <span role="status">{pending && (pt ? 'Abrindo ' : 'Opening ') + pending.name + '…'}</span>
        {(edges.left || edges.right) && <div className="registry-directions">
          <button disabled={!edges.left} onClick={() => browse(-1)} aria-label={pt ? 'Rolar para a esquerda' : 'Scroll left'}>←</button>
          <button disabled={!edges.right} onClick={() => browse(1)} aria-label={pt ? 'Rolar para a direita' : 'Scroll right'}>→</button>
        </div>}
      </footer>
    </div>
  </m.dialog>;
}
