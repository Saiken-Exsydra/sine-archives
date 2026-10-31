/** Small page-owned services; Astro navigation remains owned by transition-lifecycle. */
export function createPageTasks(signal: AbortSignal) {
  const timers = new Set<number>();
  const frames = new Set<number>();
  const tasks = {
    delay(callback: () => void, milliseconds: number) {
      if (signal.aborted) return 0;
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (!signal.aborted) callback();
      }, milliseconds);
      timers.add(id);
      return id;
    },
    frame(callback: FrameRequestCallback) {
      if (signal.aborted) return 0;
      const id = requestAnimationFrame(time => {
        frames.delete(id);
        if (!signal.aborted) callback(time);
      });
      frames.add(id);
      return id;
    },
    cancelTimer(id: number) { clearTimeout(id); timers.delete(id); },
    cancelFrame(id: number) { cancelAnimationFrame(id); frames.delete(id); },
  };
  signal.addEventListener('abort', () => {
    timers.forEach(clearTimeout);
    frames.forEach(cancelAnimationFrame);
    timers.clear(); frames.clear();
  }, { once: true });
  return tasks;
}

export function watchPreference(signal: AbortSignal, change?: (reduced: boolean) => void) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  preference.addEventListener('change', () => change?.(preference.matches), { signal });
  return preference;
}

export function watchActivity(element: Element, signal: AbortSignal, change: (active: boolean) => void) {
  const preference = watchPreference(signal, sync);
  let intersecting = false;
  let active = false;
  function sync() {
    const next = intersecting && !document.hidden && !preference.matches && !signal.aborted;
    if (next === active) return;
    active = next;
    change(active);
  }
  const observer = new IntersectionObserver(entries => {
    intersecting = entries.some(entry => entry.isIntersecting);
    sync();
  });
  observer.observe(element);
  document.addEventListener('visibilitychange', sync, { signal });
  signal.addEventListener('abort', () => { observer.disconnect(); sync(); }, { once: true });
}

declare global {
  interface Window {
    sineMotion: {
      createTasks: typeof createPageTasks;
      watchPreference: typeof watchPreference;
      watchActivity: typeof watchActivity;
    };
  }
}

window.sineMotion = { createTasks: createPageTasks, watchPreference, watchActivity };

window.registerPageInit?.('ambient-motion', () => {
  const controller = new AbortController();
  const { signal } = controller;
  const tasks = createPageTasks(signal);
  const actors = new Map<Element, boolean>();
  const pendingActors = new Set<Element>();
  let collectFrame = 0;
  const preference = watchPreference(signal, () => { collect(); sync(); });
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) actors.set(entry.target, entry.isIntersecting);
    sync();
  });
  function sync() {
    actors.forEach((visible, element) => {
      element.toggleAttribute('data-motion-paused', !visible || document.hidden || preference.matches || !!element.closest('[inert]'));
    });
  }
  function collect(animations = document.getAnimations()) {
    for (const animation of animations) {
      const effect = animation.effect;
      const element = effect instanceof KeyframeEffect ? effect.target : null;
      if (!(element instanceof Element) || actors.has(element)) continue;
      const isAmbient = effect?.getTiming().iterations === Infinity
        || (animation instanceof CSSAnimation && animation.animationName === 'kenburns');
      if (!isAmbient) continue;
      actors.set(element, false);
      observer.observe(element);
    }
  }
  // Let page controllers finish their synchronous DOM updates before discovery
  // flushes styles. Otherwise initialization pays for two document layouts.
  tasks.frame(() => { collect(); sync(); });
  const inertness = new MutationObserver(sync);
  inertness.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['inert'] });
  // Playback indicators and other conditional CSS loops can start after page init.
  document.addEventListener('animationstart', event => {
    if (!(event.target instanceof Element) || actors.has(event.target)) return;
    pendingActors.add(event.target);
    if (collectFrame) return;
    collectFrame = tasks.frame(() => {
      collectFrame = 0;
      pendingActors.forEach(element => {
        if (element.isConnected && !actors.has(element)) collect(element.getAnimations());
      });
      pendingActors.clear();
      sync();
    });
  }, { signal, capture: true });
  document.addEventListener('visibilitychange', sync, { signal });
  return () => {
    controller.abort(); observer.disconnect(); inertness.disconnect();
    pendingActors.clear();
    actors.forEach((_, element) => element.removeAttribute('data-motion-paused'));
  };
}, { persistent: true });
