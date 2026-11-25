import { useEffect, useState } from 'react';
import { useLocale } from '../site';

export function Fullscreen() {
  const pt = useLocale() === 'pt-br';
  const [active, setActive] = useState(Boolean(document.fullscreenElement));
  const [available, setAvailable] = useState(document.fullscreenEnabled);
  useEffect(() => {
    const update = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  if (!available) return null;
  const label = pt ? 'Tela cheia' : 'Fullscreen';
  return <button type="button" className="fullscreen-control" aria-label={label} title={label} aria-pressed={active}
    onClick={async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch { setAvailable(false); }
    }}>
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" aria-hidden="true">
      <path d={active ? 'M2 6h4V2m8 0v4h4M2 14h4v4m8 0v-4h4' : 'M2 7V2h5m6 0h5v5M2 13v5h5m6 0h5v-5'} />
    </svg>
  </button>;
}

