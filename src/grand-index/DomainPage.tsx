import { useLayoutEffect, useRef } from 'react';
import { Footer, HeaderContents, SkipLink, useLocale } from '../site';
import { domains } from './domains';
import { chronology } from './records';

export function DomainPage({ domain }: { domain: 'history' }) {
  const locale = useLocale();
  const pt = locale === 'pt-br';
  const heading = useRef<HTMLHeadingElement>(null);
  const title = domains.find(item => item.id === domain)!.label[locale];
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    heading.current?.focus({ preventScroll: true });
  }, [domain]);
  useLayoutEffect(() => { document.title = title + ' · SiNE Archives'; }, [title]);
  return <div className="archive-app">
    <SkipLink/><header className="masthead"><HeaderContents/></header>
    <main id="reading" tabIndex={-1} className="record-page">
      <a className="domain-entry" href="#archive-index">← {pt ? 'Índice de domínios' : 'Domain index'}</a>
      <h1 ref={heading} tabIndex={-1}>{title}</h1>
      {chronology.map(event => <article key={event.year}>
        <p className="catalog-label">{pt ? 'Ano imperial' : 'Imperial Year'} {event.year}</p>
        <h2>{event.title[locale]}</h2><p>{event.detail[locale]}</p>
      </article>)}
    </main><Footer/>
  </div>;
}
