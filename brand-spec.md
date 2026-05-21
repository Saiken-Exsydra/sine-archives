# SiNE Archives Brand Spec

Derived from `src/styles/global.css`, `src/layouts/MainLayout.astro`, and `src/pages/index.astro`.

## Core tokens

Approximate OKLCH conversions of the live site's source colors:

```css
:root {
  --bg:      oklch(14% 0.015 285);
  --surface: oklch(18% 0.018 285);
  --fg:      oklch(92% 0.012 85);
  --muted:   oklch(64% 0.012 85);
  --border:  oklch(28% 0.010 285);
  --accent:  oklch(57% 0.18 28);
}
```

Observed secondary highlight:

```css
--metal: oklch(68% 0.11 82);
```

## Type system

- Display: `'Cormorant Garamond', Georgia, serif`
- Body: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
- Mono: `ui-monospace, 'SFMono-Regular', 'Cascadia Code', 'JetBrains Mono', Menlo, monospace`

## Layout posture

- Dark archival canvas with warm text, thin translucent borders, and restrained contrast jumps.
- Accent budget is tight: crimson for active states and separators, gold only as an occasional seal or metadata highlight.
- Frosted navigation and pane chrome sit above cinematic background imagery, grain, and scanline overlays.
- Typography mixes elegant serif headlines with compact uppercase metadata and calm sans-serif reading text.
- Surfaces feel classified and information-dense rather than card-heavy; use panels, dividers, stamps, and index labeling more than soft rounded UI.
