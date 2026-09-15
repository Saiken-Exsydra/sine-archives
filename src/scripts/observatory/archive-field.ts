import type { ObservatorySystem } from '../../data/observatory';

/** One bounded canvas loop. Geometry remains decorative; HTML owns every action. */
export function createArchiveField(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-archive-field]')!;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { focus() {}, emphasize() {}, destroy() {} };
  const context = ctx;
  const abort = new AbortController();
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 1, height = 1, frame = 0, last = 0, time = 0, visible = true;
  let behavior: ObservatorySystem['behavior'] | '' = '';
  let target = { x: .5, y: .5 }, pointer = { x: -9999, y: -9999 }, emphasis = '';
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let waves: { x: number; y: number; born: number }[] = [];
  let lastWave = -2000, waveX = -9999, waveY = -9999;
  let focusStrength = 0, wantedStrength = 0;
  let points: { x: number; y: number; px: number; py: number; phase: number; group: number; light: number }[] = [];
  let links: [number, number][] = [];
  const ink = getComputedStyle(root).getPropertyValue('--text').trim() || '#e8e4dc';
  const mobile = () => innerWidth <= 720;
  function request() { if (!frame && !document.hidden && visible) frame = requestAnimationFrame(draw); }
  function resize() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, mobile() ? 1.25 : 1.5, 2200 / width);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    let seed = 41;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    points = Array.from({ length: mobile() ? 90 : innerWidth <= 1000 ? 140 : 210 }, (_, i) => {
      const x = random() * width;
      const y = random() * height;
      return { x, y, px: x, py: y, phase: i * 2.399, group: i % 7, light: 0 };
    });
    links = [];
    for (let i = 0; i < points.length; i++) {
      const near = points.map((p, j) => ({ j, d: Math.hypot(p.x - points[i].x, p.y - points[i].y) }))
        .filter(p => p.j > i && p.d < (mobile() ? 105 : 160)).sort((a, b) => a.d - b.d).slice(0, 2);
      near.forEach(p => links.push([i, p.j]));
    }
    request();
  }
  function draw(now: number) {
    frame = 0;
    if (document.hidden || !visible) return;
    if (!motion.matches && now - last < 32) { request(); return; }
    const dt = Math.min(now - last, 50); last = now;
    if (!motion.matches) time += dt;
    const t = motion.matches ? 0 : time;
    focusStrength += (wantedStrength - focusStrength) * (motion.matches ? 1 : .045);
    waves = waves.filter(w => time - w.born < 1500);
    if (!motion.matches && fine.matches && time - lastWave > 500 && Math.hypot(pointer.x - waveX, pointer.y - waveY) > 65 && pointer.x > 0) {
      waves.push({ ...pointer, born: time }); waves = waves.slice(-3);
      lastWave = time; waveX = pointer.x; waveY = pointer.y;
    }
    context.clearRect(0, 0, width, height);
    context.fillStyle = ink; context.strokeStyle = ink;
    points.forEach(p => {
      const near = motion.matches || !fine.matches || mobile() ? 0 : Math.max(0, 1 - Math.hypot(p.x - pointer.x, p.y - pointer.y) / 190);
      let wave = 0;
      if (!motion.matches) for (const w of waves) {
        const age = (time - w.born) / 1500;
        wave += Math.max(0, 1 - Math.abs(Math.hypot(p.x - w.x, p.y - w.y) - age * 260) / 42) * (1 - age);
      }
      const tx = target.x * width, ty = target.y * height;
      const affinity = Math.max(0, 1 - Math.hypot(p.x - tx, p.y - ty) / (behavior ? 280 : 460)) * focusStrength;
      p.light += ((near * .75 + wave * .3 + affinity * .32) - p.light) * (motion.matches ? 1 : .16);
      const coherent = behavior === 'coherence' || behavior === 'fusion';
      const phase = coherent ? p.group : p.phase;
      const travel = behavior === 'routes' ? 3 : behavior === 'roots' ? 8 : 5;
      const lateral = emphasis === 'reach' || emphasis === 'overreach' ? 10 : 0;
      p.px = p.x + (motion.matches ? 0 : Math.cos(t * .00013 + phase) * (travel + wave * 1.5) + (pointer.x - p.x) * near * .025 + (tx - p.x) * affinity * .025 + lateral * affinity);
      p.py = p.y + (motion.matches ? 0 : Math.sin(t * .0001 + phase) * 4 + (pointer.y - p.y) * near * .025 + (ty - p.y) * affinity * .025);
    });
    links.forEach(([ai, bi], index) => {
      const a = points[ai], b = points[bi];
      const recurrence = behavior === 'recurrence' ? .5 + .5 * Math.sin(t * .0008 + a.group) : .6 + .4 * Math.sin(t * .00016 + index);
      const threshold = behavior === 'threshold' ? .65 : 1;
      context.globalAlpha = Math.min(.29, (.025 + recurrence * .07 + (a.light + b.light) * .15) * threshold);
      context.lineWidth = .65;
      context.beginPath(); context.moveTo(a.px, a.py);
      if (behavior === 'roots') context.quadraticCurveTo(a.px, b.py, b.px, b.py);
      else context.lineTo(b.px, b.py);
      context.stroke();
    });
    points.forEach(p => {
      context.globalAlpha = Math.min(.86, .18 + (p.group / 7) * .36 + p.light * .5);
      context.beginPath(); context.arc(p.px, p.py, p.group === 0 ? 1.5 : .8, 0, Math.PI * 2); context.fill();
    });
    context.globalAlpha = 1;
    if (!motion.matches) request();
  }
  root.addEventListener('pointermove', e => { if (!motion.matches && e.pointerType !== 'touch' && fine.matches && !mobile()) pointer = { x: e.clientX, y: e.clientY }; }, { signal: abort.signal, passive: true });
  root.addEventListener('pointerleave', () => { pointer = { x: -9999, y: -9999 }; }, { signal: abort.signal });
  const stop = () => { cancelAnimationFrame(frame); frame = 0; };
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : request(), { signal: abort.signal });
  motion.addEventListener('change', () => { stop(); waves = []; pointer = { x: -9999, y: -9999 }; request(); }, { signal: abort.signal });
  window.addEventListener('resize', resize, { signal: abort.signal });
  const observer = new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); if (visible) request(); else stop(); });
  observer.observe(root);
  resize();
  root.dataset.canvasLoops = '1';
  return {
    focus(system?: ObservatorySystem, rect?: DOMRect) {
      behavior = system?.behavior || ''; wantedStrength = rect ? 1 : 0;
      target = rect ? { x: (rect.x + rect.width / 2) / width, y: (rect.y + rect.height / 2) / height } : { x: .5, y: .5 };
      request();
    },
    emphasize(id: string) { emphasis = id; request(); },
    destroy() { abort.abort(); observer.disconnect(); stop(); root.dataset.canvasLoops = '0'; },
  };
}
