import { useCallback, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import type { SystemId } from './content';

export type Location = { system: SystemId | null; anchor: boolean; valid: boolean };
export function parseLocation(hash: string): Location {
  const path = hash.replace(/^#/, '').replace(/\/$/, '') || '/systems';
  if (path === '/systems') return { system: null, anchor: false, valid: true };
  const match = path.match(/^\/systems\/(redactory|divination|bloom)(\/anchor)?$/);
  if (!match || (match[2] && match[1] !== 'redactory')) return { system: null, anchor: false, valid: false };
  return { system: match[1] as SystemId, anchor: Boolean(match[2]), valid: true };
}
export function useLocation(beforeChange: () => void) {
  const prepare = useRef(beforeChange);
  useLayoutEffect(() => { prepare.current = beforeChange; });
  const subscribe = useCallback((callback: () => void) => {
    const changed = () => { prepare.current(); callback(); };
    window.addEventListener('hashchange', changed);
    return () => window.removeEventListener('hashchange', changed);
  }, []);
  return parseLocation(useSyncExternalStore(subscribe, () => window.location.hash, () => '#/systems'));
}
