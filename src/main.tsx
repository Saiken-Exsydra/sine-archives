import { StrictMode, useLayoutEffect, useRef, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { getSystems, getAnchor, type Locale } from './content';
import { useLocation } from './navigation';
import './styles.css';

gsap.registerPlugin(Flip);

const locale: Locale = new URLSearchParams(window.location.search).get('lang') === 'pt-br' ? 'pt-br' : 'en';
const pt = locale === 'pt-br';
const systems = getSystems(locale);
const anchor = getAnchor(locale);
const copy = {
  systems: pt ? 'Sistemas' : 'Systems',
  eyebrow: pt ? 'O Archive · Sistemas fundamentais' : 'The Archive · Fundamental systems',
  title: pt ? 'Três formas de tocar a realidade.' : 'Three ways to touch reality.',
  instruction: pt ? 'Escolha um sistema. Siga as conexões.' : 'Choose a system. Follow the connections.',
  open: pt ? 'Explorar' : 'Explore', back: pt ? 'Todos os sistemas' : 'All systems',
  exploreAnchor: pt ? 'Examinar a Anchor' : 'Examine the Anchor',
  anchorHint: pt ? 'A rota conceitual mais estável de um Redactor.' : 'A Redactor’s most stable conceptual route.',
  anchorTitle: pt ? 'Um ponto de referência.' : 'A point of reference.',
  introduction: pt ? 'Visão geral' : 'Overview',
  skip: pt ? 'Ir para o conteúdo' : 'Skip to content',
  unknown: pt ? 'Este caminho ainda não faz parte do arquivo.' : 'This path is not part of the archive yet.',
};

function App() {
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const pendingFlip = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const location = useLocation(() => {
    if (!root.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    pendingFlip.current = Flip.getState(root.current.querySelectorAll('[data-flip-id]'));
  });
  const active = systems.find(system => system.id === location.system);
  const depth = !location.valid ? 'unknown' : location.anchor ? 'anchor' : active ? 'system' : 'index';
  const path = `${location.system ?? ''}/${depth}`;

  // The same persistent portals move between the index and reading layouts.
  useLayoutEffect(() => {
    const element = root.current!;
    element.dataset.motion = 'settled';
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      element.dataset.motion = 'entering';
      gsap.fromTo(element.querySelector('.reading-pane'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .36, clearProps: 'opacity,transform',
        onComplete: () => { if (element.dataset.motion === 'entering') element.dataset.motion = 'settled'; } });
      return () => { if (element.dataset.motion === 'entering') element.dataset.motion = 'settled'; };
    });
    if (!first.current) heading.current?.focus({ preventScroll: true });
    first.current = false;
    document.documentElement.lang = locale;
    document.title = `${location.anchor ? 'Anchor · ' : ''}${active?.name ?? copy.systems} · SiNE Archives`;
    return () => media.revert();
  }, [path]);

  useLayoutEffect(() => {
    const state = pendingFlip.current;
    pendingFlip.current = null;
    if (!state || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.current!.dataset.motion = 'moving';
    const animation = Flip.from(state, { duration: .65, ease: 'power3.inOut', absolute: true, scale: true, nested: true,
      onComplete: () => { if (root.current) root.current.dataset.motion = 'settled'; } });
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const settle = () => { if (preference.matches) animation.progress(1); };
    preference.addEventListener('change', settle);
    return () => { preference.removeEventListener('change', settle); animation.progress(1).kill(); };
  }, [path]);

  return <div ref={root} className="archive-app" data-depth={depth} style={{ '--accent': active?.color ?? '#d9ba70' } as CSSProperties}>
    <a className="skip-link" href="#reading" onClick={event => { event.preventDefault(); document.getElementById('reading')?.focus(); }}>{copy.skip}</a>
    <header className="masthead">
      <a className="wordmark" href="#/systems" aria-label="SiNE Archives — Systems">SiNE<span>ARCHIVES</span></a>
      <span className="masthead-rule" />
      <span className="edition">{pt ? 'Estudo dos sistemas' : 'A study of systems'}</span>
      <a className="locale" href={`?lang=${pt ? 'en' : 'pt-br'}${window.location.hash || '#/systems'}`} lang={pt ? 'en' : 'pt-BR'}>{pt ? 'EN' : 'PT-BR'}</a>
    </header>

    <nav className="breadcrumbs" aria-label={pt ? 'Localização' : 'Breadcrumb'}>
      <a href="#/systems" aria-current={!active && location.valid ? 'page' : undefined}>{copy.systems}</a>
      {active && <><span aria-hidden="true">/</span><a href={`#/systems/${active.id}`} aria-current={!location.anchor ? 'page' : undefined}>{active.name}</a></>}
      {location.anchor && <><span aria-hidden="true">/</span><span aria-current="page">Anchor</span></>}
    </nav>

    <main id="reading" className="experience" tabIndex={-1}>
      <section className="reading-pane" aria-labelledby="page-heading">
        <p className="eyebrow">{active ? `${copy.systems} / ${active.number}` : copy.eyebrow}</p>
        <h1 ref={heading} id="page-heading" tabIndex={-1}>{!location.valid ? copy.systems : location.anchor ? copy.anchorTitle : active?.name ?? copy.title}</h1>
        <span className="heading-rule" />
        {!location.valid ? <p className="lead">{copy.unknown}</p> : location.anchor ? <>
          <p className="concept-label">Anchor</p>
          <p className="lead">{anchor.definition}</p>
          <dl className="measures">{anchor.measures.map((measure, index) => {
            const [term, ...description] = measure.split(pt ? ' é ' : ' is ');
            return <div key={term}><dt><span>0{index + 1}</span>{term}</dt><dd>{description.join(pt ? ' é ' : ' is ') || measure}</dd></div>;
          })}</dl>
          <p className="body-copy">{anchor.training}</p>
        </> : active ? <>
          <p className="lead">{active.summary}</p>
          <p className="body-copy">{active.introduction}</p>
          {active.id === 'redactory' && <a className="anchor-door" href="#/systems/redactory/anchor">
            <span className="anchor-symbol" aria-hidden="true">⌖</span><span><strong>{copy.exploreAnchor}</strong><small>{copy.anchorHint}</small></span><span aria-hidden="true">↗</span>
          </a>}
        </> : <p className="lead">{copy.instruction}</p>}
        {(active || !location.valid) && <a className="return-link" href={location.anchor ? '#/systems/redactory' : '#/systems'}>← {location.anchor ? 'Redactory' : copy.back}</a>}
      </section>

      <section className="system-field" aria-label={copy.systems}>
        {systems.map(system => <a key={system.id} href={`#/systems/${system.id}`}
          className={`system-portal ${active?.id === system.id ? 'is-selected' : ''}`} data-flip-id={system.id}
          style={{ '--system-accent': system.color, '--system-image': `url("${system.art}")` } as CSSProperties}
          aria-current={active?.id === system.id ? 'location' : undefined}>
          <div className="portal-art" aria-hidden="true" />
          <div className="portal-top"><span>{system.number}</span><span className="portal-mark" aria-hidden="true">{system.id === 'redactory' ? '⌖' : system.id === 'divination' ? '✧' : '❋'}</span></div>
          <div className="portal-bottom"><span className="portal-action">{system.action}</span><h2>{system.name}</h2><span className="portal-enter">{copy.open}<span aria-hidden="true">↗</span></span></div>
        </a>)}
      </section>
    </main>
    <footer className="footnote"><span>SiNE / {copy.systems}</span><span>{active ? `0${location.anchor ? 3 : 2}` : '01'} <span aria-hidden="true">—</span> 03</span><span>Dy’Aspora</span></footer>
  </div>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
