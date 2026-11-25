import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useMotionValue } from 'motion/react';
import { ripple } from '../motion/obsidian/material';
import { useMotionPreference } from '../motion/system';

const key = 'sine.awakening.v1';
let completed = false;
export const score = {
  emblem: [0.4, 1.6], word: [0.8, 2.1], motto: [1.65, 2.55], header: [1.7, 2.9],
  controls: [2, 3.2], index: [2.7, ripple.duration],
} as const;

export function rememberVisit() {
  completed = true;
  try { sessionStorage.setItem(key, '1'); } catch { /* Memory covers this document. */ }
}
function hasVisited() {
  try { return completed || sessionStorage.getItem(key) === '1'; } catch { return completed; }
}
if (import.meta.env.DEV) {
  const url = new URL(window.location.href);
  if (url.searchParams.has('replay')) {
    completed = false;
    try { sessionStorage.removeItem(key); } catch { /* Storage is optional. */ }
    url.searchParams.delete('replay');
    history.replaceState(history.state, '', url);
  }
}

export type Phase = 'dormant' | 'awakening' | 'manifested' | 'exploration';
export function useAwakening(atIndex: boolean) {
  const reduced = useMotionPreference();
  const [phase, setPhase] = useState<Phase>(() => atIndex ? 'exploration' : reduced || hasVisited() ? 'manifested' : 'dormant');
  const [start, setStart] = useState<number | null>(null);
  const time = useMotionValue(phase === 'dormant' ? 0 : ripple.duration);
  const running = useRef(false);
  const finish = useCallback((explore = false) => {
    time.set(ripple.duration); rememberVisit();
    setStart(null); setPhase(explore ? 'exploration' : 'manifested');
  }, [time]);
  const wake = useCallback(() => {
    if (running.current) return;
    running.current = true;
    setStart(performance.now()); setPhase('awakening');
  }, []);
  useLayoutEffect(() => {
    if (atIndex || reduced) finish(atIndex);
  }, [reduced, atIndex, finish]);
  useEffect(() => {
    if (phase !== 'dormant' && phase !== 'awakening') return;
    const listeners = new AbortController();
    const options = { signal: listeners.signal, passive: true };
    let last: [number, number] | undefined;
    const move = (event: PointerEvent) => {
      if (!event.isTrusted || event.pointerType === 'touch') return;
      const distance = last ? Math.hypot(event.clientX-last[0], event.clientY-last[1]) : Math.hypot(event.movementX,event.movementY);
      if (!last) last = [event.clientX,event.clientY];
      if (distance >= 3) wake();
    };
    if (phase === 'dormant') {
      window.addEventListener('pointermove', move, options);
      window.addEventListener('pointerdown', e => { if (e.isTrusted) wake(); }, options);
      window.addEventListener('wheel', e => { if (e.isTrusted && (e.deltaY || e.deltaX)) wake(); }, options);
      window.addEventListener('scroll', () => { if (window.scrollY > 0) wake(); }, options);
    }
    window.addEventListener('keydown', event => {
      if (event.isTrusted && !event.metaKey && !event.ctrlKey && !event.altKey && !['Shift','Control','Alt','Meta'].includes(event.key)) {
        // Release inert controls before the browser performs the original Tab/scroll action.
        flushSync(() => finish());
      }
    }, options);
    return () => listeners.abort();
  }, [phase, wake, finish]);
  useEffect(() => {
    if (start === null) return;
    let frame = 0;
    const tick = () => {
      const elapsed = (performance.now()-start)/1000;
      if (elapsed >= ripple.duration) { finish(); return; }
      time.set(elapsed);
      frame = requestAnimationFrame(tick);
    };
    const resume = () => { cancelAnimationFrame(frame); if (!document.hidden) tick(); };
    document.addEventListener('visibilitychange', resume); resume();
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', resume); };
  }, [start, finish, time]);
  return { phase, start, time, finish, setPhase };
}

