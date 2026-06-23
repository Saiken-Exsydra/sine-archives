# Motion Rules

## Easing

Use project-like cinematic easing:

```css
cubic-bezier(0.2, 0.82, 0.22, 1)
```

Keep object feedback usually between `140ms` and `360ms`. Page reveals and route transitions can be longer if they match `src/styles/transition-system.css`.

## Allowed Motion

- subtle lift.
- shadow shift.
- opacity reveal.
- thin line pulse.
- aperture or wipe.
- ink spread.
- gentle parallax.
- controlled glow.

## Avoid

- bounce.
- elastic overshoot.
- rapid flicker.
- playful wiggle.
- endless attention-seeking animation.
- motion that hides text or controls.

## Reduced Motion

For every new non-trivial animation:

```css
@media (prefers-reduced-motion: reduce) {
  .selector {
    animation: none;
    transition-duration: 1ms;
  }
}
```

Use an instant state change or simple opacity change when motion is reduced.
