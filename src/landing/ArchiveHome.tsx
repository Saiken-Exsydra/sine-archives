import { useEffect, useLayoutEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { motionTokens } from '../motion/system';
import { cubicBezier, m as motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { Fullscreen } from './Fullscreen';
import type { CharacterRoute } from '../grand-index/characters';
import { GrandIndex } from '../grand-index/GrandIndex';
import { HeaderContents, SkipLink, useLocale } from '../site';
import emblem from '../art/SiNE-Circular-Emblem.svg';
import { ObsidianSurface } from '../motion/obsidian/ObsidianSurface';
import { score, useAwakening } from './sequence';
import { ScrollIndicator } from './ScrollIndicator';
import './landing.css';

const settle = cubicBezier(...motionTokens.ease);
function useTrack(time: MotionValue<number>, interval: readonly [number, number]) {
  return useTransform(time, [...interval], [0, 1], { ease: settle });
}

export function ArchiveHome({ atIndex, returning, returnDomain, character }: { character?: CharacterRoute; atIndex: boolean; returning: boolean; returnDomain: string }) {
  const pt = useLocale() === 'pt-br';
  const { phase, start, time, finish, setPhase } = useAwakening(atIndex);
  const ready = phase === 'manifested' || phase === 'exploration';
  const hero = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const shelf = useRef<HTMLElement>(null);
  const scroll = useMotionValue(0);
  const lift = useTrack(time, score.emblem);
  const y = useTransform(lift, [0,1], ['0%', '-32%']);
  const word = useTrack(time, score.word);
  const wordY = useTransform(word, [0,1], [12,0]);
  const motto = useTrack(time, score.motto);
  const mottoY = useTransform(motto, [0, 1], [5, 0]);
  const header = useTrack(time, score.header);
  const controls = useTrack(time, score.controls);
  const headerVisibility = useTransform(header, value => value > 0 ? 'visible' : 'hidden');
  const controlsVisibility = useTransform(controls, value => value > 0 ? 'visible' : 'hidden');
  const index = useTrack(time, score.index);

  const viewingCharacter = Boolean(character);
  const wasExpanded = useRef(viewingCharacter);
  useLayoutEffect(() => {
    const restore = wasExpanded.current;
    wasExpanded.current = viewingCharacter;
    if (viewingCharacter) { window.scrollTo({top:0,behavior:'instant'}); return; }
    if (atIndex || restore) {
      shelf.current?.focus({ preventScroll: true });
      shelf.current?.scrollIntoView({ block: 'start', behavior: restore ? 'instant' : 'auto' });
    } else if (returning) { window.scrollTo({ top: 0, behavior: 'instant' }); title.current?.focus({ preventScroll: true }); }
  }, [atIndex, returning, viewingCharacter]);
  useEffect(() => {
    if (viewingCharacter) return;
    const entrance = hero.current!;
    let height = 0;
    let indexWasAligned = false;
    const update = () => {
      const previousHeight = height;
      height = Math.max(1, entrance.offsetHeight);
      // WebKit can lose the current snap target when the viewport shrinks.
      if (height !== previousHeight && indexWasAligned && Math.abs(window.scrollY - height) > 1
        && (window.visualViewport?.scale ?? 1) === 1) {
        window.scrollTo({ top: height, behavior: 'instant' });
      }
      indexWasAligned = Math.abs(window.scrollY - height) <= 1;
      const fraction = Math.max(0, window.scrollY / height);
      scroll.set(fraction);
      if (fraction >= .22 && phase !== 'exploration') finish(true);
      else if (fraction < .22 && phase === 'exploration') setPhase('manifested');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [scroll, phase, finish, setPhase, viewingCharacter]);

  return <div className="archive-app archive-home" data-character-domain={viewingCharacter} data-depth="home" data-phase={phase} data-motion={ready ? 'settled' : phase}>
    <SkipLink inert={!ready} />
    <motion.header className="masthead home-masthead" inert={phase === 'dormant'} style={{ opacity: header, visibility: headerVisibility }}>
      <HeaderContents controls={languageSelector => <motion.nav className="masthead-controls" aria-label={pt ? 'Navegação' : 'Navigation'} style={{ opacity: controls, visibility: controlsVisibility }}>{languageSelector}<Fullscreen /></motion.nav>} />
    </motion.header>
    <main id="reading" tabIndex={-1}>
      <section ref={hero} className="awakening-hero" aria-label="SiNE Archives">
        <ObsidianSurface start={start} />
        <div className="hero-origin">
          <motion.img className="hero-emblem" src={emblem} alt="SiNE" width="716" height="1004" fetchPriority="high" style={{ y }} />
          {phase === 'dormant' && <button className="awaken-access" aria-label={pt ? 'Abrir o arquivo' : 'Open the archive'} onClick={() => { flushSync(() => finish()); title.current?.focus({ preventScroll: true }); }} />}
        </div>
        <div className="archive-inscription" aria-hidden={!ready}>
          <motion.h1 className="archive-title" ref={title} aria-label="SiNE Archives" lang="en" tabIndex={-1} style={{ opacity: word, y: wordY }}>ARCHIVES</motion.h1>
          <motion.p className="archive-motto" style={{ opacity: motto, y: mottoY }}>
            {pt ? 'A Arquitetura do Conhecimento' : 'The Architecture of Knowledge'}
          </motion.p>
        </div>
        <ScrollIndicator reveal={index} scroll={scroll} ready={ready} />
      </section>
      <GrandIndex character={character} section={shelf} ready={ready} returnDomain={returnDomain} />
    </main>
  </div>;
}

