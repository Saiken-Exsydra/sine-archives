import { directory } from '../directory';
import scene from '../art/redactory-study.webp';
import { useLocale } from '../site';

export function SystemsShowcase({ href }: { href: string }) {
  const pt = useLocale() === 'pt-br';
  return <div className="exhibition systems-exhibit">
    <img className="scene-art" src={scene} alt="" width="1400" height="764" decoding="async" />
    <div className="systems-catalog">
      <h2>{pt ? 'Sistemas' : 'Systems'}</h2>
      <div className="system-register">{directory.map(system =>
        <a key={system.id} href={href + '/' + system.id}><img src={system.art} width="56" height="56" alt=""/>{system.name}<span aria-hidden="true">↗</span></a>
      )}</div>
      <a className="domain-entry" href={href}>{pt ? 'Explorar os sistemas' : 'Explore the systems'} <span aria-hidden="true">↗</span></a>
    </div>
  </div>;
}
