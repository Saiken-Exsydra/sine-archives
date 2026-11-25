export const ripple = {
  origin: [0.5, 0.5] as const, // Fraction of the surface, measured from its bottom left.
  amplitude: 0.46,
  damping: 0.32,
  reflection: 0.76,
  width: 0.045,
  duration: 3.5,
  pixelRatio: 1.25,
  pixelBudget: 786_432,
};
export type Ripple = Omit<typeof ripple, 'origin'> & { origin: readonly [number, number] };

