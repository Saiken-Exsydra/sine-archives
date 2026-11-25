import { LazyMotion, domAnimation, MotionConfig, type Variants } from 'motion/react';
import { useSyncExternalStore, type ReactNode } from 'react';

export const motionTokens = {
  control: 0.18,
  selection: 0.3,
  settle: 0.65,
  ease: [0.22, 0.68, 0.22, 1] as const,
};
export const reveal: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: motionTokens.settle, ease: motionTokens.ease } },
};

const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
function subscribe(callback: () => void) {
  preference.addEventListener('change', callback);
  return () => preference.removeEventListener('change', callback);
}
export function useMotionPreference() {
  return useSyncExternalStore(subscribe, () => preference.matches);
}
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ duration: motionTokens.control, ease: motionTokens.ease }}><LazyMotion features={domAnimation}>{children}</LazyMotion></MotionConfig>;
}

