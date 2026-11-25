import { useEffect, useRef } from 'react';
import { ripple, type Ripple } from './material';
import './surface.css';

export function ObsidianSurface({ start, config = ripple }: { start: number | null; config?: Ripple }) {
  const field = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (start === null) return;
    const element = canvas.current!;
    const surface = field.current!;
    const epoch = start;
    let disposed = false;
    let visible = true;
    let frame = 0;
    let renderer: ReturnType<typeof import('./renderer').createRenderer> = null;
    let create: typeof import('./renderer').createRenderer | undefined;
    const reflection = surface.querySelector<HTMLElement>('.obsidian-reflection')!;
    const fallback = reflection.animate([
      { transform: 'translate(-50%, -50%) scale(.04)', opacity: 0 },
      { opacity: .75, offset: .12 }, { opacity: .65, offset: .87 },
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 },
    ], { duration: config.duration * 1000, easing: 'linear', fill: 'both' });
    fallback.pause();
    const draw = () => {
      const elapsed = Math.min(config.duration, (performance.now() - epoch) / 1000);
      if (renderer) renderer.draw(elapsed);
      else fallback.currentTime = elapsed * 1000;
      if (elapsed < config.duration) frame = requestAnimationFrame(draw);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && visible) draw();
    };
    const resize = () => {
      const { clientWidth, clientHeight } = surface;
      const [x, y] = config.origin;
      const reach = Math.hypot(Math.max(x, 1 - x) * clientWidth, Math.max(y, 1 - y) * clientHeight);
      reflection.style.width = (reach * 2 / 0.69) + 'px';
      renderer?.resize(clientWidth, clientHeight);
      resume();
    };
    const init = () => {
      renderer?.dispose();
      renderer = create?.(element, config) ?? null;
      surface.dataset.renderer = renderer ? 'webgl' : 'fallback';
      resize();
    };
    const lost = (event: Event) => {
      event.preventDefault(); renderer?.dispose(); renderer = null;
      surface.dataset.renderer = 'fallback'; resume();
    };
    element.addEventListener('webglcontextlost', lost);
    element.addEventListener('webglcontextrestored', init);
    const size = new ResizeObserver(resize);
    size.observe(surface);
    const view = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
    view.observe(surface);
    document.addEventListener('visibilitychange', resume);
    surface.dataset.renderer = 'fallback';
    void import('./renderer').then(module => { if (!disposed) { create = module.createRenderer; init(); } }).catch(() => {});
    resume();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame); fallback.cancel(); size.disconnect(); view.disconnect();
      element.removeEventListener('webglcontextlost', lost);
      element.removeEventListener('webglcontextrestored', init);
      document.removeEventListener('visibilitychange', resume);
      renderer?.dispose();
      delete surface.dataset.renderer;
    };
  }, [start, config]);
  return <div className="obsidian" ref={field} aria-hidden="true">
    {start !== null && <><canvas ref={canvas} /><i className="obsidian-reflection" style={{ left: config.origin[0]*100+'%', top: (1-config.origin[1])*100+'%' }} /></>}
  </div>;
}

