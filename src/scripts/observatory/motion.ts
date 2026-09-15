import { gsap } from 'gsap';
let entered = false;

export function createObservatoryMotion(root: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ctx = gsap.context(() => {}, root);
  let entrance: gsap.core.Timeline | undefined;
  let focus: gsap.core.Timeline | undefined;
  let departing: HTMLElement | undefined;
  const overlay = root.querySelector<HTMLElement>('[data-entrance]')!;
  const nodes = root.querySelectorAll('[data-system-node]');
  const hero = root.querySelector('.observatory-hero');
  const aperture = root.querySelector('.observatory-aperture');
  const depth = root.querySelector<HTMLElement>('[data-depth-layer]')!;
  const pulses = root.querySelector<SVGGElement>('[data-relation-pulses]')!;
  const abort = new AbortController();
  const fine = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1001px)');
  let reaction: gsap.core.Timeline | undefined;
  let travel: gsap.core.Timeline | undefined;
  let pulseContext: gsap.Context | undefined, reactionContext: gsap.Context | undefined, focusContext: gsap.Context | undefined;
  let previousAperture: DOMRect | undefined;
  let bounds = depth.getBoundingClientRect();
  let pointerFrame = 0, px = 0, py = 0;
  let moveX: ReturnType<typeof gsap.quickTo>, moveY: ReturnType<typeof gsap.quickTo>;
  ctx.add(() => {
    moveX = gsap.quickTo(depth, 'x', { duration: .9, ease: 'power3.out' });
    moveY = gsap.quickTo(depth, 'y', { duration: .9, ease: 'power3.out' });
  });
  const geometry = new ResizeObserver(() => { bounds = depth.getBoundingClientRect(); });
  geometry.observe(depth);
  root.addEventListener('pointermove', event => {
    if (reduced.matches || !fine.matches || event.pointerType === 'touch') return;
    px = (event.clientX - bounds.left) / bounds.width - .5;
    py = (event.clientY - bounds.top) / bounds.height - .5;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      moveX(Math.max(-5, Math.min(5, px * 10)));
      moveY(Math.max(-4, Math.min(4, py * 8)));
    });
  }, { signal: abort.signal, passive: true });
  root.addEventListener('pointerleave', () => { if (!reduced.matches) { moveX(0); moveY(0); } }, { signal: abort.signal });
  window.addEventListener('scroll', () => { bounds = depth.getBoundingClientRect(); }, { signal: abort.signal, passive: true });
  const clearPulse = () => { travel?.kill(); pulseContext?.revert(); pulseContext = undefined; pulses.replaceChildren(); };
  // Relational: one finite, interruptible family of path highlights per intent.
  const pulse = (paths: SVGPathElement[], outward = true) => {
    clearPulse();
    if (reduced.matches || innerWidth <= 720) return;
    pulseContext = gsap.context(() => {
      travel = gsap.timeline({ onComplete: () => pulses.replaceChildren() });
      paths.slice(0, 6).forEach((path, index) => {
        const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        highlight.setAttribute('d', path.getAttribute('d')!);
        highlight.setAttribute('pathLength', '1');
        highlight.setAttribute('class', 'observatory-pulse');
        pulses.append(highlight);
        travel!.fromTo(highlight, { strokeDashoffset: outward ? .12 : -.98, opacity: 0 },
          { strokeDashoffset: outward ? -1 : .12, opacity: .85, duration: 1.25, ease: 'sine.inOut' }, index * .08)
          .to(highlight, { opacity: 0, duration: .2 }, 1.05 + index * .08);
      });
    });
  };
  // Reactive: the source symbols stay intact; their fine registration lines answer.
  const react = (id = '') => {
    reaction?.progress(1); reaction?.kill(); reactionContext?.revert();
    if (reduced.matches || !id) return;
    if (id === 'archive') {
      reactionContext = gsap.context(() => {
        reaction = gsap.timeline().fromTo(root.querySelectorAll('[data-motion-ring]'),
          { scale: .95, opacity: 0, svgOrigin: '50 50' }, { scale: 1.18, opacity: .28, stagger: .06, duration: .7 }, .45)
          .to(root.querySelectorAll('[data-motion-ring]'), { opacity: 0, duration: .7 });
      }, root);
      return;
    }
    const node = root.querySelector<HTMLElement>(`[data-system-node="${id}"]`);
    if (!node) return;
    const mark = node.querySelector('img'), ring = node.querySelector('[data-motion-ring]'), thread = node.querySelector('[data-motion-thread]');
    const profile = node.dataset.motionProfile;
    reactionContext = gsap.context(() => {
      reaction = gsap.timeline();
      reaction.fromTo(ring, { scale: profile === 'unfold' ? .65 : .9, opacity: 0, svgOrigin: '50 50' },
        { scale: profile === 'echo' ? 1.3 : 1.08, opacity: .5, duration: .7, ease: 'sine.out' }, 0)
        .to(ring, { scale: profile === 'echo' ? 1.5 : 1.12, opacity: 0, duration: .85 }, .7)
        .fromTo(thread, { opacity: 0, strokeDasharray: 18, strokeDashoffset: 18 },
          { opacity: .5, strokeDashoffset: 0, duration: profile === 'thread' ? 1.2 : .55 }, .1)
        .to(thread, { opacity: 0, duration: .65 }, 1)
        .fromTo(mark, { rotation: profile === 'branch' ? -.8 : 0, y: profile === 'thread' ? 2 : 0, scale: 1 },
          { rotation: profile === 'branch' ? .8 : 0, y: profile === 'horizon' ? -2 : 0, scale: profile === 'unfold' ? 1.07 : profile === 'horizon' ? .98 : 1.025, duration: profile === 'interval' ? .35 : .7, ease: 'sine.inOut' }, 0)
        .to(mark, { rotation: 0, y: 0, scale: 1, duration: .8, clearProps: 'transform' });
    });
  };
  const page = root.querySelector<HTMLElement>('[data-floating-page]')!;
  const finishEntrance = () => {
    entrance?.progress(1); entrance?.kill();
    overlay.hidden = true; root.dataset.entrance = 'complete';
  };
  ctx.add(() => {
    const returning = entered || !!location.hash || window.__sineTransitionState?.lastNavigation?.navigationType === 'traverse';
    entered = true;
    if (returning || reduced.matches) { finishEntrance(); return; }
    overlay.hidden = false; root.dataset.entrance = 'playing';
    gsap.set([hero, ...nodes], { opacity: 0 });
    const connectors = root.querySelectorAll('[data-svg-connector]');
    gsap.set(connectors, { strokeDasharray: 1, strokeDashoffset: 1 });
    entrance = gsap.timeline({ onComplete: finishEntrance });
    entrance.fromTo('.observatory-entrance__line', { scaleX: .2 }, { scaleX: 1, duration: 1, ease: 'power2.out' })
      .fromTo('.observatory-entrance__point', { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .45 }, 1)
      .to(overlay, { '--opening': '55%', duration: 1.15, ease: 'power3.inOut' }, 1.4)
      .to('.observatory-entrance__line', { opacity: 0, duration: .5 }, 1.65)
      .to('.observatory-entrance__point', { opacity: 0, duration: .4 }, 2.1)
      .to(connectors, { strokeDashoffset: 0, duration: .5, stagger: .1 }, 2.15)
      .to(nodes, { opacity: 1, duration: .35, stagger: .1 }, 2.4)
      .to(hero, { opacity: 1, duration: .4 }, 3)
      .set(connectors, { clearProps: 'strokeDasharray,strokeDashoffset' }).set(nodes, { clearProps: 'opacity' });
  });
  return {
    finishEntrance, pulse, react,
    captureGeometry() { previousAperture = aperture!.getBoundingClientRect(); },
    clearPulse,
    capturePage() {
      previousAperture = aperture!.getBoundingClientRect();
      focus?.kill(); focusContext?.revert(); focusContext = undefined; departing?.remove(); departing = undefined;
      if (page.hidden || reduced.matches) return;
      const box = page.getBoundingClientRect(), base = page.parentElement!.getBoundingClientRect();
      departing = page.cloneNode(true) as HTMLElement;
      departing.removeAttribute('data-floating-page'); departing.removeAttribute('aria-labelledby');
      departing.setAttribute('aria-hidden', 'true'); departing.inert = true;
      departing.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      departing.querySelectorAll('*').forEach(el => {
        for (const attribute of [...el.attributes]) if (attribute.name.startsWith('data-')) el.removeAttribute(attribute.name);
      });
      Object.assign(departing.style, { position: 'absolute', pointerEvents: 'none', left: `${box.x - base.x}px`, top: `${box.y - base.y}px`, width: `${box.width}px`, margin: '0', zIndex: '2' });
      page.parentElement!.append(departing);
    },
    transition(origin?: DOMRect, path?: SVGPathElement, backwards = false, onSettled?: () => void) {
      finishEntrance(); focus?.kill();
      focusContext?.revert();
      focusContext = gsap.context(() => {
        gsap.set([page, aperture], { clearProps: 'opacity,transform' });
        // An interrupted journey may never reach its timeline's cleanup steps.
        gsap.set(root.querySelectorAll('[data-relationship-path]'), { clearProps: 'strokeDasharray,strokeDashoffset,opacity' });
        gsap.set(root.querySelector('[data-travel-point]'), { opacity: 0 });
        if (reduced.matches) { onSettled?.(); return; }
        const rect = page.getBoundingClientRect();
        const ox = origin ? origin.x + origin.width / 2 - rect.x : 0;
        const oy = origin ? origin.y + origin.height / 2 - rect.y : 40;
        gsap.set(page, { transformOrigin: `${ox}px ${oy}px` });
        focus = gsap.timeline({ onComplete: onSettled });
        if (departing) {
          const old = departing;
          focus.to(old, { opacity: 0, scaleY: .03, transformOrigin: '50% 0', duration: .28, ease: 'power2.in', onComplete: () => old.remove() }, 0);
        }
        if (path) {
          const point = root.querySelector('[data-travel-point]');
          const progress = { value: backwards ? 1 : 0 };
          gsap.set(point, { opacity: 1 });
          focus.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: .35 })
            .to(progress, { value: backwards ? 0 : 1, duration: .45, ease: 'power2.inOut', onUpdate() {
              const p = path.getPointAtLength(path.getTotalLength() * progress.value);
              gsap.set(point, { attr: { cx: p.x, cy: p.y } });
            } }, .1).set(point, { opacity: 0 }).set(path, { clearProps: 'strokeDasharray,strokeDashoffset,opacity' });
        }
        const nextBox = aperture!.getBoundingClientRect();
        const oldBox = previousAperture || nextBox;
        // Counter-scale symbols while the chart changes shape; their circles and type stay intact.
        const fixedSymbols = [...nodes, root.querySelector('[data-archive-node]')!, root.querySelector('.archive-sphere')!];
        const keepSilhouettes = () => {
          gsap.set(fixedSymbols, { scaleX: 1 / Number(gsap.getProperty(aperture!, 'scaleX')), scaleY: 1 / Number(gsap.getProperty(aperture!, 'scaleY')) });
          onSettled?.();
        };
        focus.fromTo(aperture, { x: oldBox.x - nextBox.x, y: oldBox.y - nextBox.y, scaleX: oldBox.width / nextBox.width, scaleY: oldBox.height / nextBox.height, transformOrigin: '0 0' },
          { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: .7, ease: 'power3.inOut', clearProps: 'transform', onUpdate: keepSilhouettes,
            onComplete: () => gsap.set(fixedSymbols, { clearProps: 'transform' }) }, 0);
        keepSilhouettes();
        previousAperture = undefined;
        const concepts = page.querySelectorAll('.observatory-concept');
        if (concepts.length) focus.fromTo(concepts, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .45, stagger: .07, clearProps: 'transform,opacity' }, .4);
        if (!page.hidden) focus.fromTo(page, { scale: .94, opacity: 0, y: backwards ? -8 : 12 }, { scale: 1, opacity: 1, y: 0, duration: .5, ease: 'power3.out', clearProps: 'transform,opacity' }, path ? .4 : .2);
      });
    },
    stopMotion() {
      finishEntrance(); focus?.progress(1); reaction?.progress(1); clearPulse();
      cancelAnimationFrame(pointerFrame); pointerFrame = 0;
      moveX.tween.pause(); moveY.tween.pause(); gsap.set(depth, { x: 0, y: 0 });
    },
    destroy() { abort.abort(); geometry.disconnect(); cancelAnimationFrame(pointerFrame); clearPulse(); reaction?.kill(); reactionContext?.revert(); entrance?.kill(); focus?.kill(); focusContext?.revert(); departing?.remove(); ctx.revert(); },
  };
}
