import { lazy, StrictMode, Suspense, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { ArchiveHome } from './landing/ArchiveHome';
import { rememberVisit } from './landing/sequence';
import { MotionProvider } from './motion/system';
import { characterRoute } from './grand-index/characters';
import { DomainPage } from './grand-index/DomainPage';
import { parseLocation } from './navigation';
import { useLocale } from './site';
import './styles.css';

const Systems = lazy(() => import('./Systems'));
function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
function App() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  const locale = useLocale();
  const { home, domain, characterId, section } = parseLocation(hash);
  const returnDomain = useRef('characters');
  const firstHome = useRef(home);
  const hasLeft = useRef(!home);
  useLayoutEffect(() => {
    if (home) document.title = 'SiNE Archives';
    else { returnDomain.current = domain ?? 'systems'; hasLeft.current = true; rememberVisit(); }
  }, [home, domain]);
  useLayoutEffect(() => { document.documentElement.lang = locale; }, [locale]);
  const character = domain === 'characters' ? characterRoute(characterId, section) : undefined;
  return home || domain === 'characters' ? <ArchiveHome character={character} atIndex={hash === '#archive-index' || Boolean(character)} returning={hasLeft.current} returnDomain={returnDomain.current} />
    : domain ? <DomainPage domain={domain} />
    : <Suspense fallback={<main aria-busy="true" />}><Systems fromHome={firstHome.current} /></Suspense>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><MotionProvider><App /></MotionProvider></StrictMode>);
