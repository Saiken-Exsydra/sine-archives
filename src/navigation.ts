import { useCallback, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import type { SystemId } from './content';

export type Location = { characterId?: string; section?: string; domain?: 'characters' | 'history'; home: boolean; system: SystemId | null; anchor: boolean; valid: boolean };
export function parseLocation(hash: string): Location {
  // A dossier can carry one document-local heading inside its hash route.
  const routeHash = hash.replace(/(\/dossier)\?heading=[^#]*$/, '$1');
  const path = routeHash.replace(/^#/, '').replace(/\/$/, '') || '/';
  if (path === '/' || path === 'archive-index') return { home: true, system: null, anchor: false, valid: true };
  const character = path.match(/^\/characters(?:\/([a-z0-9-]+)(?:\/([a-z]+))?)?$/);
  if (character) return { domain: 'characters', characterId: character[1], section: character[2], home: false, system: null, anchor: false, valid: true };
  if (path === '/history') return { domain: 'history', home: false, system: null, anchor: false, valid: true };
  if (path === '/systems') return { home: false, system: null, anchor: false, valid: true };
  const match = path.match(/^\/systems\/(redactory|divination|bloom)(\/anchor)?$/);
  if (!match || (match[2] && match[1] !== 'redactory')) return { home: false, system: null, anchor: false, valid: false };
  return { home: false, system: match[1] as SystemId, anchor: Boolean(match[2]), valid: true };
}
export function useLocation(beforeChange: () => void) {
  const prepare = useRef(beforeChange);
  useLayoutEffect(() => { prepare.current = beforeChange; });
  const subscribe = useCallback((callback: () => void) => {
    const changed = () => { prepare.current(); callback(); };
    window.addEventListener('hashchange', changed);
    return () => window.removeEventListener('hashchange', changed);
  }, []);
  return parseLocation(useSyncExternalStore(subscribe, () => window.location.hash, () => '#/'));
}
