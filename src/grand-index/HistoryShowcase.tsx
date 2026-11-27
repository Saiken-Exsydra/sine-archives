import scene from '../art/ardeatus.webp';
import { useLocale } from '../site';
import { chronology } from './records';

export function HistoryShowcase({ href }: { href: string }) {
  const locale = useLocale();
  const pt = locale === 'pt-br';
  return <div className="exhibition history-exhibit">
    <img className="scene-art" src={scene} width="1600" height="873" alt="" decoding="async"/>
    <div className="history-caption">
      <p className="catalog-label">{pt ? 'Cronologia imperial' : 'Imperial chronology'}</p>
      <h2><span className="pearl-text">{pt ? 'História' : 'History'}</span></h2>
      <ol className="timeline-strip">{chronology.map(event => <li key={event.year}><strong>{event.year}</strong><span>{event.title[locale]}</span></li>)}</ol>
      <a className="domain-entry pearl-interaction" href={href}><span className="pearl-text">{pt ? 'Explorar história' : 'Open History'}</span> <span aria-hidden="true">↗</span></a>
    </div>
  </div>;
}
