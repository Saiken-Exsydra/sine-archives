# Redactory Open Design System

Source of truth adapted from the project root source design file, `DESIGN_SYSTEM.md`. Use this file when Open Design asks for design system `redactory`. Do not assume a root `DESIGN.md` exists in this repository.

## 1. Visual Theme And Atmosphere

SiNE Archives is a dark fictional archive, anomalous research, and interactive lore interface. It is not a SaaS dashboard, startup landing page, crypto UI, cyberpunk neon product shell, or generic AI design.

The default atmosphere is near-black, archival, cinematic, precise, and slightly dangerous. Pages should feel like restricted records, observation instruments, dossier panes, sealed documents, or diegetic interfaces. Favor thin linework, stamps, panels, rails, metadata strips, rules, apertures, object hotspots, and controlled light.

Hard rules:

- Preserve the dark archive identity on every visual pass.
- Keep backgrounds near black, usually around `#050407` or `#06060b`.
- Use real project images/assets when available.
- Make lore readable before adding atmosphere.
- Use mystery through structure, pacing, negative space, and controlled detail, not illegible text.

## 2. Color

Canonical tokens from `src/styles/global.css`:

```css
:root {
  --bg: #050407;
  --surface: #0a0a14;
  --border: rgba(255, 255, 255, 0.07);
  --crimson: #b13a34;
  --gold: #b08d3c;
  --text: #e8e4dc;
  --text-muted: rgba(232, 228, 220, 0.55);
  --text-dim: rgba(232, 228, 220, 0.3);
  --shadow: 0 14px 40px rgba(0, 0, 0, 0.35);
}
```

Use `--crimson` for active states, warnings, section rules, route intensity, and selected controls. Use `--gold` for seals, metadata, registry markers, and secondary emphasis. White should be warm and controlled through `--text`.

Avoid:

- gray-washed overlays that make the page flat.
- bright blue/purple gradients unless explicitly requested by the page concept.
- large neon glows, candy colors, or cyberpunk palettes.
- single-hue monotone pages with no crimson/gold/ink balance.

## 3. Typography

Fonts are loaded in `src/layouts/SiteShell.astro`:

- Display: `"Cormorant Garamond", serif`
- Body and UI: `"DM Sans", sans-serif`
- Code/mono: `ui-monospace, SFMono-Regular, Consolas, monospace`

Use Cormorant for entry names, major section titles, chapter labels, dossier headings, and dramatic typography. Use DM Sans for body text, metadata, navigation, buttons, labels, controls, and long-form readable content.

Metadata labels may use uppercase and positive letter spacing. Do not use negative letter spacing globally. Do not make decorative typography so small or faint that it becomes noise.

## 4. Spacing And Grid

Use stable, readable structures:

- constrained prose columns for lore-heavy pages.
- two-column entry layouts with metadata sidebars when useful.
- full-screen application layouts only for bespoke experiences such as character index, observatory, map, and Redactory desk.
- grids that collapse cleanly to one column on mobile.
- `var(--nav-height)` for offsets where the standard shell is active.

Prefer rails, panes, ruled sections, index lists, registers, spreads, and instrument panels over generic card walls.

## 5. Layout And Composition

Existing page families:

- Home: cinematic hero, edge gates, sticky preview section list.
- Standard sections: section hero plus `SectionList` and `EntryCard`.
- Entry detail: hero, sticky metadata sidebar, prose pane, related entries.
- Character dossier: custom rail, scrollable main, dossier fields, archive note, related links.
- Systems Observatory: immersive system map, nodes, active panel, destination panels.
- Redactory pages: gateway, desk, dive, Redactor profile, Index Theorem.
- Soundtracks: sticky player deck plus catalog.

Before creating or revising a page, inspect the nearest existing route and component family. Reuse established layouts and assets before inventing a new system.

## 6. Components

Core reusable files:

- `src/layouts/SiteShell.astro`: document, router, fonts, global background, transition bootstrap.
- `src/layouts/MainLayout.astro`: standard nav/footer/content shell.
- `src/layouts/EntryLayout.astro`: normal entry details.
- `src/layouts/CharacterEntryLayout.astro`: character dossiers.
- `src/components/EntryCard.astro`: standard archive cards.
- `src/components/SectionList.astro`: standard collection lists.
- `src/components/MusicPlayer.astro`: persistent audio UI.
- `src/components/systems/*`: observatory and system interface pieces.
- `src/components/redactory/*`: desk, gateway, dive, lore, and Redactory-specific components.

Use existing SVG/PNG assets from `public/uploads`, `public/music`, and `src/assets/uploads`. Do not replace diegetic assets with generic icon sets.

## 7. Motion And Interaction

Canonical transition rules live in `src/styles/transition-system.css`. Route-level View Transition work belongs there, not scattered across pages.

Interaction rules:

- Use subtle glow, slight lift, shadow shift, line pulse, reveal, aperture, wipe, ink motion, or focus edge.
- Avoid bouncy, cartoon, rubbery, or toy-like motion.
- Keep clickable objects discoverable without turning every object into a normal rectangular button.
- Support keyboard focus and visible focus states.
- Include `prefers-reduced-motion` fallbacks for any new motion.
- Use `window.registerPageInit?.("stable-key", initFn)` for page scripts that must survive Astro client navigation.

## 8. Voice And Naming

Write UI copy like an archive system, not a startup product:

- Good: `Registry`, `Dossier`, `Restricted`, `File`, `Index`, `Addendum`, `Seal`, `Observation`, `Transmission`, `Entry`.
- Avoid: `Solutions`, `Features`, `Pricing`, `Get started`, `Unlock growth`, `AI-powered dashboard`.

Do not invent lore. For content and canon, use `The Archive/` as source material and preserve slugs, routes, anchors, collection names, locale structure, and existing frontmatter.

## 9. Anti-Patterns

Never default to:

- SaaS hero/features/pricing/FAQ page structure.
- dashboard cards, pastel charts, startup gradients, or glassmorphism panels that ignore the archive identity.
- crypto, hacker, neon cyberpunk, or generic sci-fi UI.
- huge soft cards with rounded corners everywhere.
- unreadable low-contrast text.
- generic icon replacement for meaningful project objects.
- decorative animation without reduced-motion fallback.
- rewriting shared layouts/routes when a scoped component change works.

## Implementation Checklist

Before editing:

- Read `AGENTS.md`.
- Read this design system and root `DESIGN_SYSTEM.md` if present. Do not assume root `DESIGN.md` exists.
- Inspect the target route, nearest sibling route, layout, component, assets, and scripts.
- Identify whether the page uses `MainLayout` or `SiteShell` directly.

Before finishing:

- Confirm desktop and mobile layouts stay readable.
- Confirm hover, focus, active, and reduced-motion states where relevant.
- Confirm visual result still feels like SiNE Archives/Redactory.
- Run `npm run build` for broad validation when source code changed.
- Run `npm run test:transitions` when navigation or transition behavior changed.
