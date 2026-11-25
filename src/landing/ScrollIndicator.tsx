import { useEffect, useRef, useState } from 'react';
import { m as motion, useTransform, type MotionValue } from 'motion/react';
import { useLocale } from '../site';

export function ScrollIndicator({ reveal, scroll, ready }: { reveal: MotionValue<number>; scroll: MotionValue<number>; ready: boolean }) {
  const pt = useLocale() === 'pt-br';
  const link = useRef<HTMLAnchorElement>(null);
  const [pulse, setPulse] = useState(false);
  const opacity = useTransform(() => reveal.get() * (1 - Math.min(1, scroll.get() * 2.5)));
  useEffect(() => {
    let inView = false;
    const update = () => setPulse(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    observer.observe(link.current!);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <motion.a className="index-indicator" ref={link} style={{ opacity }} inert={!ready} aria-hidden={!ready}
    data-pulse={ready && pulse} href="#archive-index">
    {pt ? 'ÍNDICE' : 'INDEX'}<span className="indicator-line" aria-hidden="true" /><i aria-hidden="true" />
  </motion.a>;
}

