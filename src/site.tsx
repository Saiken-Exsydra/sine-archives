import { useLayoutEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from 'react';
import { m } from 'motion/react';
import logo from './art/SiNE-Principal-Logo.svg';
import type { Locale } from './content';
import { motionTokens, useMotionPreference } from './motion/system';

const localeKey = 'sine.locale';
const localeChange = 'sine:localechange';
const languages = [
  { locale: 'en', lang: 'en', label: 'English' },
  { locale: 'pt-br', lang: 'pt-BR', label: 'Português (BR)' },
] as const;

function readPreference(): Locale {
  try { return localStorage.getItem(localeKey) === 'pt-br' ? 'pt-br' : 'en'; }
  catch { return 'en'; }
}

// Keep unqualified history entries in the language they opened with.
const initialPreference = readPreference();

function getLocale(): Locale {
  const lang = new URLSearchParams(location.search).get('lang');
  return lang === 'en' || lang === 'pt-br' ? lang : initialPreference;
}

function subscribeLocale(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener(localeChange, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(localeChange, callback);
  };
}

export function useLocale() {
  return useSyncExternalStore(subscribeLocale, getLocale);
}

function localeUrl(locale: Locale) {
  const url = new URL(location.href);
  url.searchParams.set('lang', locale);
  if (!url.hash) url.hash = '/';
  return url;
}

function selectLocale(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  try { localStorage.setItem(localeKey, locale); } catch { /* The URL still carries the selection. */ }
  if (locale === getLocale()) return;
  history.pushState(history.state?.dossierSection ? { dossierSection: history.state.dossierSection } : null, '', localeUrl(locale));
  window.dispatchEvent(new Event(localeChange));
}

export function SkipLink({ inert = false }: { inert?: boolean }) {
  const pt = useLocale() === 'pt-br';
  return <a inert={inert} aria-hidden={inert} className="skip-link" href="#reading" onClick={e => {
    e.preventDefault(); document.getElementById('reading')?.focus();
  }}>{pt ? 'Ir para o conteúdo' : 'Skip to content'}</a>;
}
function LanguageSelector() {
  const locale = useLocale();
  const reduced = useMotionPreference();
  const selector = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<{ x: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const frame = selector.current!;
    const options = frame.querySelectorAll('a');
    const current = frame.querySelector('[aria-current]')!;

    const measure = () => {
      const { left, width } = current.getBoundingClientRect();
      const x = left - options[0].getBoundingClientRect().left;
      setSelection(previous => previous?.x === x && previous.width === width ? previous : { x, width });
    };

    measure();
    const observer = new ResizeObserver(measure);
    options.forEach(option => observer.observe(option, { box: 'border-box' }));
    return () => observer.disconnect();
  }, [locale]);

  return <div ref={selector} className="locale-selector" role="group" aria-label={locale === 'pt-br' ? 'Idioma' : 'Language'}>
    {selection && (reduced
      ? <span className="locale-selection" aria-hidden="true" style={{ left: selection.x, width: selection.width }} />
      : <m.span className="locale-selection" aria-hidden="true" initial={false} animate={selection}
          transition={{ duration: motionTokens.selection, ease: motionTokens.ease }} />)}
    {languages.map(language => <a key={language.locale} className="locale-option" href={localeUrl(language.locale).href}
      lang={language.lang} hrefLang={language.lang} aria-current={locale === language.locale ? 'true' : undefined}
      onClick={event => selectLocale(event, language.locale)}>{language.label}</a>)}
  </div>;
}

export function HeaderContents({ controls }: { controls?: (languageSelector: ReactNode) => ReactNode }) {
  const languageSelector = <LanguageSelector />;
  return <>
    <a className="wordmark" href="#/" aria-label="SiNE Archives">
      <img src={logo} width="772" height="346" alt="" />
    </a>
    {controls ? controls(languageSelector) : languageSelector}
  </>;
}
export function Footer() {
  return <footer className="footnote"><span>SiNE Archives</span><span>Dy'Aspora</span></footer>;
}

