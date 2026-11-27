import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type MouseEvent, type Ref } from 'react';
import { m, useIsPresent } from 'motion/react';
import type { Locale } from '../content';
import { motionTokens, useMotionPreference } from '../motion/system';
import { characterHref, type CharacterRoute } from './characters';
import type { parseDossier } from './dossierDocument';

type Edition = ReturnType<typeof parseDossier>;
type ReaderProps = { load: () => Promise<string>; locale: Locale };

export function DossierControl({ children, className, ...props }: ComponentProps<'a'>) {
  return <a {...props} className={'dossier-control pearl-interaction ' + className}>
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M4.5 1.5h7l4 4v13h-11z M11.5 1.5v4h4 M7 9h6 M7 12h6 M7 15h4"/>
    </svg>
    <span>{children}</span>
    <i aria-hidden="true"/>
  </a>;
}

function DossierReader({ load, locale }: ReaderProps) {
  const pt = locale === 'pt-br';
  const reduced = useMotionPreference();
  const reader = useRef<HTMLElement>(null);
  const contents = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [edition, setEdition] = useState<Edition>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [active, setActive] = useState('');
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    let current = true;
    Promise.all([load(), import('./dossierDocument')]).then(([source, { parseDossier }]) => {
      if (current) setEdition(parseDossier(source));
    }).catch(() => { if (current) setFailed(true); });
    return () => { current = false; };
  }, [load, attempt]);

  useLayoutEffect(() => {
    const root = reader.current;
    if (!root || !edition?.headings.length) return;
    const elements = [...root.querySelectorAll<HTMLElement>('article [id]')];
    let offsets: number[] = [];
    function track() {
      const { scrollTop, clientHeight, scrollHeight } = root!;
      let index = 0;
      if (scrollTop > 0 && scrollTop + clientHeight >= scrollHeight - 1) index = offsets.length - 1;
      else while (index + 1 < offsets.length && offsets[index + 1] <= scrollTop + 20) index++;
      setActive(edition!.headings[index].id);
    }
    function measure() {
      const origin = root!.getBoundingClientRect().top - root!.scrollTop;
      offsets = elements.map(el => el.getBoundingClientRect().top - origin);
      track();
    }
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    resize.observe(root.querySelector('article')!);
    measure();
    root.addEventListener('scroll', track, { passive: true });
    return () => { resize.disconnect(); root.removeEventListener('scroll', track); };
  }, [edition]);

  useLayoutEffect(() => {
    const nav = contents.current;
    const link = nav?.querySelector<HTMLElement>('[aria-current]');
    if (!nav || !link || !nav.clientHeight) return;
    const box = link.getBoundingClientRect(), rail = nav.getBoundingClientRect();
    if (box.bottom > rail.bottom) nav.scrollTop += box.bottom - rail.bottom;
    if (box.top < rail.top) nav.scrollTop += box.top - rail.top;
  }, [active, expanded]);

  function go(event: MouseEvent, id: string) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = reader.current?.querySelector<HTMLElement>('#dossier-' + CSS.escape(id));
    if (!target) return;
    history.replaceState(history.state, '', location.hash.split('?')[0] + '?heading=' + encodeURIComponent(id));
    setExpanded(false);
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
  }
  useLayoutEffect(() => {
    if (!edition) return;
    function followHeading() {
      const id = new URLSearchParams(location.hash.split('?')[1]).get('heading');
      if (!id) return;
      const heading = reader.current?.querySelector<HTMLElement>('#dossier-' + CSS.escape(id));
      if (heading) {
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }
    followHeading();
    window.addEventListener('hashchange', followHeading);
    return () => window.removeEventListener('hashchange', followHeading);
  }, [edition]);
  const dossierPath = location.hash.split('?')[0];
  const label = pt ? 'Sumário' : 'Contents';
  return <div className="dossier-columns" data-contents={Boolean(edition?.headings.length)}>
    <section className="dossier-scroll" ref={reader} tabIndex={0} aria-label={pt ? 'Documento' : 'Document'}>
      {edition ? <article lang="en" onClick={event => {
        const link = (event.target as Element).closest('a[data-document-link]');
        if (link) go(event, link.getAttribute('data-document-link')!);
      }}>{edition.body}</article> : <p role="status">{failed
        ? <button onClick={() => { setFailed(false); setAttempt(attempt + 1); }}>{pt ? 'Tentar carregar novamente' : 'Retry loading dossier'}</button>
        : pt ? 'Carregando dossiê…' : 'Loading dossier…'}</p>}
    </section>
    {Boolean(edition?.headings.length) && <aside className="dossier-contents" data-open={expanded}
      onKeyDown={event => {
        if (expanded && event.key === 'Escape') { setExpanded(false); toggle.current?.focus(); }
      }}>
      <button className="contents-toggle pearl-interaction" ref={toggle} aria-expanded={expanded} aria-controls="dossier-contents"
        onClick={() => setExpanded(!expanded)}><span className="pearl-text">{label}</span> <span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
      <span className="contents-title exam-label">{label}</span>
      <nav id="dossier-contents" aria-label={label} ref={contents}>
        {edition!.headings.map(({ id, depth, label }) => <a key={id} className="pearl-interaction" lang="en" href={dossierPath + '?heading=' + encodeURIComponent(id)}
          style={{ paddingInlineStart: Math.min(depth - 1, 4) * .55 + .6 + 'em' }}
          aria-current={active === id ? 'location' : undefined} onClick={event => go(event, id)}><span className="pearl-text">{label}</span></a>)}
      </nav>
    </aside>}
  </div>;
}

export function DossierSurface({ character, section, locale, load, closeRef }: CharacterRoute & ReaderProps & {
  closeRef: Ref<HTMLAnchorElement>;
}) {
  const pt = locale === 'pt-br';
  const present = useIsPresent();
  const reduced = useMotionPreference();
  const retracted = { '--dossier-cut': '100%' };
  return <>
    <m.div className="dossier-close-station" inert={!present}
      initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : motionTokens.control, ease: motionTokens.ease }}>
      <DossierControl className="dossier-close" ref={closeRef} href={characterHref(character.id, section)}>
        {pt ? 'Fechar Dossiê' : 'Close Dossier'}
      </DossierControl>
    </m.div>
    <m.section className="dossier-surface" aria-labelledby="dossier-name" inert={!present}
      initial={reduced ? false : retracted} animate={{ '--dossier-cut': '0%' }} exit={retracted}
      transition={{ duration: reduced ? 0 : motionTokens.settle, ease: motionTokens.ease }}>
      <div className="dossier-layout">
        <header className="dossier-mast">
          <span className="exam-label">{pt ? 'Dossiê completo · Texto em inglês' : 'Complete Dossier'}</span>
          <h1 id="dossier-name">{character.name}</h1>
        </header>
        <DossierReader locale={locale} load={load}/>
      </div>
    </m.section>
  </>;
}
