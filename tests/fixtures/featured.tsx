import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GrandIndex } from '../../src/grand-index/GrandIndex';
import { characterRoute, characters, featuredCharacter } from '../../src/grand-index/characters';
import { useLocation } from '../../src/navigation';
import { MotionProvider } from '../../src/motion/system';
import '../../src/landing/landing.css';
import '../../src/styles.css';

function FeaturedFixture() {
  const section = useRef<HTMLElement>(null);
  const { domain, characterId, section: sectionName } = useLocation(() => {});
  const route = domain === 'characters' ? characterRoute(characterId, sectionName) : undefined;
  const [featured, setFeatured] = useState(featuredCharacter);
  useEffect(() => {
    const select = (event: Event) => {
      const record = characters.find(character => character.id === (event as CustomEvent<string>).detail);
      if (record) setFeatured(record);
    };
    window.addEventListener('fixture:feature', select);
    return () => window.removeEventListener('fixture:feature', select);
  }, []);
  return <main className="archive-home" data-character-domain={Boolean(route)}>
    <GrandIndex section={section} ready returnDomain="characters" character={route} featured={featured}/>
  </main>;
}

createRoot(document.body.appendChild(document.createElement('div'))).render(<MotionProvider><FeaturedFixture/></MotionProvider>);
