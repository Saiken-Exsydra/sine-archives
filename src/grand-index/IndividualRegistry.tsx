import { useId, useLayoutEffect, useRef, useSyncExternalStore, type KeyboardEvent, type RefObject } from 'react';
import { m, useIsPresent } from 'motion/react';
import { PublicationImage } from '../images/publication';
import { motionTokens, useMotionPreference } from '../motion/system';
import { useLocale } from '../site';
import { characterHref, characters, type Character } from './characters';
import './registry.css';

const changed = 'sine:registry';
let dismissing = false;

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
function registryOpen() { return history.state?.individualRegistry === location.href; }
export function useRegistryOpen() { return useSyncExternalStore(subscribe, registryOpen); }
export function openRegistry() {
  if (registryOpen()) return;
  history.pushState({ ...history.state, individualRegistry: location.href }, '');
  window.dispatchEvent(new Event(changed));
}
export function dismissRegistry() {
  if (!registryOpen() || dismissing) return;
  dismissing = true;
  window.addEventListener('popstate', () => { dismissing = false; }, { once: true });
  history.back();
}
export function selectRegistryCharacter(href: string) {
  if (!registryOpen() || dismissing) return false;
  const { individualRegistry, ...state } = history.state;
  history.replaceState(state, '', href);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  return true;
}

export type RegistryPosition = { characterId: string; top: number };

function aperture(left: number, top: number, right: number, bottom: number) {
  // Opposite winding cuts a rectangular opening through the glass.
  return `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${left}% ${top}%, ${left}% ${bottom}%, ${right}% ${bottom}%, ${right}% ${top}%, ${left}% ${top}%)`;
}

function portraitReveal(card: HTMLAnchorElement, scroller: HTMLDivElement, dialog: HTMLDialogElement) {
  const viewport = dialog.getBoundingClientRect();
  const track = scroller.getBoundingClientRect();
  const portrait = card.querySelector('.registry-frame')!;
  // A partially visible row can still be activated through its caption.
  for (const element of [portrait, portrait.parentElement!]) {
    const rect = element.getBoundingClientRect();
    const left = Math.max(rect.left, track.left, viewport.left);
    const top = Math.max(rect.top, track.top, viewport.top);
    const right = Math.min(rect.right, track.right, viewport.right);
    const bottom = Math.min(rect.bottom, track.bottom, viewport.bottom);
    if (left >= right || top >= bottom) continue;
    const x1 = (left - viewport.left) * 100 / viewport.width;
    const y1 = (top - viewport.top) * 100 / viewport.height;
    const x2 = (right - viewport.left) * 100 / viewport.width;
    const y2 = (bottom - viewport.top) * 100 / viewport.height;
    const x = (x1 + x2) / 2;
    const y = (y1 + y2) / 2;
    return [aperture(x, y, x, y), aperture(x1, y1, x2, y2), aperture(0, 0, 100, 100)];
  }
}

function showCard(scroller: HTMLDivElement, card: HTMLAnchorElement) {
  const rect = card.getBoundingClientRect();
  const viewport = scroller.getBoundingClientRect();
  const clearance = 6;
  const above = rect.top < viewport.top + clearance;
  const below = rect.bottom > viewport.bottom - clearance;
  if (above || below) {
    const alignTop = above || rect.height + 2 * clearance > viewport.height;
    scroller.scrollTop += alignTop
      ? rect.top - viewport.top - clearance
      : rect.bottom - viewport.bottom + clearance;
  }
}

function browseCards(event: KeyboardEvent<HTMLUListElement>, scroller: HTMLDivElement) {
  const { key, altKey, ctrlKey, metaKey, shiftKey } = event;
  if (altKey || ctrlKey || metaKey || shiftKey || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return;
  const cards = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>('a'));
  const index = cards.indexOf(event.target as HTMLAnchorElement);
  if (index < 0) return;
  event.preventDefault();
  const current = cards[index].parentElement!;
  let next: HTMLAnchorElement | undefined;
  if (key === 'Home' || key === 'End') {
    next = key === 'Home' ? cards[0] : cards.at(-1);
  } else if (key === 'ArrowLeft' || key === 'ArrowRight') {
    const adjacent = cards[index + (key === 'ArrowLeft' ? -1 : 1)];
    if (adjacent?.parentElement?.offsetTop === current.offsetTop) next = adjacent;
  } else {
    const down = key === 'ArrowDown';
    const rows = down ? cards.slice(index + 1) : cards.slice(0, index).reverse();
    const row = rows.find(card => card.parentElement!.offsetTop !== current.offsetTop)?.parentElement!.offsetTop;
    const center = current.offsetLeft + current.offsetWidth / 2;
    const distance = (card: HTMLAnchorElement) => {
      const cell = card.parentElement!;
      return Math.abs(cell.offsetLeft + cell.offsetWidth / 2 - center);
    };
    for (const card of rows.filter(card => card.parentElement!.offsetTop === row)) {
      if (!next || distance(card) < distance(next)) next = card;
    }
  }
  if (next) {
    next.focus({ preventScroll: true });
    showCard(scroller, next);
  }
}

export function IndividualRegistry({ current, pending, position, onSelect, collection = characters }: {
  current: Character; pending?: Character; collection?: readonly Character[];
  position: RefObject<RegistryPosition | null>;
  onSelect: (character: Character, reveal: () => string[] | undefined) => void;
}) {
  const locale = useLocale();
  const pt = locale === 'pt-br';
  const reduced = useMotionPreference();
  const present = useIsPresent();
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    const modal = dialog.current!;
    modal.showModal();
    return () => modal.close();
  }, []);
  useLayoutEffect(() => {
    if (!present) return;
    const scroller = track.current!;
    const active = scroller.querySelector<HTMLAnchorElement>('[aria-current="true"]');
    const saved = position.current;
    if (saved?.characterId === current.id) {
      scroller.scrollTop = saved.top;
    } else {
      scroller.scrollTop = 0;
      if (active) showCard(scroller, active);
      position.current = { characterId: current.id, top: scroller.scrollTop };
    }
    const activeTop = active?.getBoundingClientRect().top ?? -Infinity;
    const viewport = scroller.getBoundingClientRect();
    const focus = active && activeTop >= viewport.top - 1 && activeTop <= viewport.bottom - 24 ? active : close.current;
    focus?.focus({ preventScroll: true });
  }, [current.id, position, present]);

  const { control, selection, settle, ease } = motionTokens;
  const revealGlass = (frames?: string[]) => frames && !reduced ? {
    clipPath: frames,
    transition: { duration: settle, times: [0, .23, 1], ease },
  } : undefined;
  return <m.dialog ref={dialog} className="individual-registry" aria-label={pt ? 'Registro de indivíduos' : 'Registry of Individuals'}
    onCancel={event => { event.preventDefault(); dismissRegistry(); }}
    initial="closed" animate="open" exit="closed">
    <m.div className="registry-smoke" aria-hidden="true"
      variants={{
        open: { opacity: 1, clipPath: 'none' },
        closed: (frames?: string[]) => revealGlass(frames) ?? { opacity: 0 },
      }}
      transition={{ opacity: { duration: reduced ? 0 : selection, ease }, clipPath: { duration: 0 } }}/>
    <m.div className="registry-glass" variants={{
      open: { clipPath: 'none', transition: { duration: 0 } },
      closed: (frames?: string[]) => revealGlass(frames) ?? {},
    }}>
      <m.div className="registry-panel" inert={!present}
        variants={{
          open: { y: '0%', transition: { duration: reduced ? 0 : selection + control, ease } },
          closed: (frames?: string[]) => frames && !reduced ? {}
            : { y: reduced ? '0%' : '100%', transition: { duration: reduced ? 0 : selection + control / 2, ease } },
        }}>
        <div className="registry-track" ref={track} onScroll={event => {
          if (present) position.current = { characterId: current.id, top: event.currentTarget.scrollTop };
        }}>
          <ul className="registry-grid" role="list" onKeyDown={event => browseCards(event, track.current!)}>
            {collection.map(person => {
              const designation = person.designation[locale];
              const description = id + '-' + person.id;
              return <li key={person.id}>
                <a href={characterHref(person.id)} className="registry-portrait pearl-interaction" aria-label={person.name}
                  aria-current={current.id === person.id ? 'true' : undefined}
                  aria-describedby={designation ? description : undefined}
                  data-pending={pending?.id === person.id} onClick={event => {
                    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    const card = event.currentTarget;
                    const measure = () => portraitReveal(card, track.current!, dialog.current!);
                    const origin = measure();
                    onSelect(person, () => measure() ?? origin);
                  }}>
                  <span className="registry-card">
                    <span className="registry-frame">
                      <PublicationImage asset={person.portrait} alt=""
                        sizes="auto, (max-width: 569px) min(45vw, 198px), clamp(138px, 20dvh, 198px)"
                        fit="cover" focalPoint={person.portraitFocal ?? 'center'}/>
                    </span>
                    <span className="registry-caption"><span className="registry-name pearl-text">{person.name}</span></span>
                  </span>
                  {designation && <span id={description} hidden>{designation}</span>}
                </a>
              </li>;
            })}
          </ul>
        </div>
        <footer className="registry-footer">
          <span className="registry-status" role="status">{pending && (pt ? 'Abrindo ' : 'Opening ') + pending.name + '.'}</span>
          <button ref={close} type="button" className="registry-threshold pearl-interaction" onClick={dismissRegistry}>
            <span className="pearl-text">{pt ? 'Voltar ao registro' : 'Return to record'}</span><i aria-hidden="true"/>
          </button>
        </footer>
      </m.div>
    </m.div>
  </m.dialog>;
}
