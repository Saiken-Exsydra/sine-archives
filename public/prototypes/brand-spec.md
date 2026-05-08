# SiNE Archives brand spec

Extracted from the live `/places/` experience and shared shell.

## Core tokens

```css
:root {
  --bg:      oklch(12.5% 0.013 284.4);
  --surface: oklch(15.0% 0.021 283.5);
  --fg:      oklch(92.0% 0.012 84.6);
  --muted:   oklch(60.1% 0.004 67.1);
  --border:  oklch(20.9% 0.009 285.6);
  --accent:  oklch(52.0% 0.156 26.8);
}
```

Region accents observed in the existing Places system:

- North accent: `oklch(66.2% 0.065 233.7)`
- Central accent: `oklch(52.0% 0.156 26.8)`
- South accent: `oklch(66.0% 0.107 85.5)`

## Typography

- Display: `'Cormorant Garamond', Georgia, serif`
- Body: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Meta labels: same DM Sans stack, uppercase, high letter-spacing

## Layout posture

- Dark archival shell with frosted black navigation and a restrained footer.
- Thin rules and hairline borders do most of the framing; no heavy card shadows.
- Accent is sparse and meaningful: region markers, one active state, one focal line.
- Display serif is reserved for titles, regions, and lore framing; body copy stays quiet and compact.
- Imagery sits under dark tints and grid overlays rather than bright decorative treatment.
