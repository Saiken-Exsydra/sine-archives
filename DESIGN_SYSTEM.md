# SiNE Archives Design System

This file is the design source of truth for future SiNE Archives UI edits. Before changing visual structure, tokens, layout chrome, page motion, or reusable cards, check this file first, then verify against the referenced source files.

Last audited from `src/` on 2026-06-17.

## Stack And Scope

- Framework: Astro 5 site with component-scoped CSS and a few imported global CSS files.
- Styling model: plain CSS. There is no Tailwind configuration, no PostCSS config, and no Tailwind dependency in `package.json`.
- Global shell: `src/layouts/SiteShell.astro` imports `src/styles/global.css` and `src/styles/transition-system.css`.
- Default page chrome: `src/layouts/MainLayout.astro` wraps normal pages with fixed navigation, music player, locale switch, search, fullscreen control, `<main id="page-content">`, and footer.
- Special full-screen experiences may use `SiteShell.astro` directly, most notably `src/pages/characters/index.astro` and `src/layouts/CharacterEntryLayout.astro`.

## Tailwind Configuration

Tailwind is not currently part of this project.

- No `tailwind.config.*` file exists.
- No `postcss.config.*` file exists.
- `package.json` has no `tailwindcss`, `@tailwindcss/*`, or Tailwind integration dependency.
- No `@tailwind` directives are present in `src/`.

Do not introduce Tailwind utilities or config unless that is an explicit project decision. Future design edits should preserve the existing CSS/token approach.

## Global CSS Variables

Canonical variables live in `src/styles/global.css`.

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

Use these names before adding page-local colors. `--crimson` is the primary active/accent color; `--gold` is a secondary metadata/seal accent; `--bg` must cover `html`, `body`, and transition backgrounds to prevent white flashes.

## Transition Variables

Canonical transition variables live in `src/styles/transition-system.css`.

```css
:root {
  --page-transition-duration: 460ms;
  --page-transition-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --search-vt-duration: 1500ms;
  --search-vt-ease: cubic-bezier(.16, 1, .3, 1);
  --transition-bg: #050407;
}
```

`transition-system.css` owns route-level View Transition styling, reduced-motion fallbacks, search reveal behavior, observatory/search edge-handle transitions, and redactory route profiles. Do not scatter new `::view-transition` rules across page files.

## Layout Variables

`src/layouts/MainLayout.astro` defines the shared navigation height:

```css
:global(:root) {
  --nav-height: 56px;
}
```

Use `var(--nav-height)` for top padding, sticky offsets, fullscreen panels, and scroll margins. Avoid hard-coding `56px` in new shared work unless it is inside a page-local full-screen exception.

## Typography

Fonts are loaded in `SiteShell.astro` from Google Fonts.

- Display: `"Cormorant Garamond", serif`
- Body and UI: `"DM Sans", sans-serif`
- Code/mono where needed: `ui-monospace, SFMono-Regular, Consolas, monospace`

Common pattern:

- Large section and entry names use Cormorant Garamond, usually bold, tight line-height, and sometimes italic for designations.
- Metadata, buttons, filters, tags, stamps, and labels use DM Sans, uppercase, small font sizes, and wide positive letter spacing.
- Body prose uses DM Sans for general entries and a more stylized Cormorant/DM mix for character dossiers.

## Global Utilities And Effects

Defined in `global.css`:

- `.sine-grain`: absolute grain overlay using inline SVG noise, low opacity, `mix-blend-mode: overlay`, animated by `grainShift`.
- `.sine-scanline`: absolute repeating scanline overlay.
- Keyframes: `kenburns`, `fadeSlideUp`, `scrollBounce`, `pulseRule`, `grainShift`.

These effects are part of the site's visual identity. Reuse them when adding cinematic archive surfaces instead of creating unrelated decorative effects.

## Shared Shell Structure

### `SiteShell.astro`

Owns the document:

- Imports `global.css` and `transition-system.css`.
- Adds `<ClientRouter />`.
- Loads font preconnects and the favicon.
- Exposes route metadata on `<html>`, `<body>`, and `#site-shell`.
- Provides `.site-shell__bg` as a persisted fixed background.
- Defines `window.registerPageInit` bootstrap before loading `src/scripts/transition-lifecycle.ts`.

Normal pages should not create their own document shell.

### `MainLayout.astro`

Owns the standard site frame:

- Fixed `.nav` with logo, optional breadcrumbs, persisted `MusicPlayer`, locale switch, fullscreen button, and search trigger.
- `<main class="main" id="page-content" transition:name="page-content">`.
- Optional footer with logo and restricted-distribution text.
- Nav variants: default, `nav--entry`, and `nav--section`.

Use `MainLayout` for ordinary page additions. Use `SiteShell` directly only when the page needs full-screen custom navigation or a nonstandard application layout.

## Core Page Patterns

### Home

Source: `src/pages/index.astro`

- Full-viewport cinematic `.hero` with background image, logo, grain, scanlines, scroll cue, and fade/kenburns animation.
- Edge gates: `.observatory-gate` on the left and `.search-gate` on the right. They trigger the observatory/search handle transitions.
- Index body: `.index-wrap` split layout with typographic `.list-panel` and sticky visual `.preview-panel`.
- Hovering/focusing a section row swaps the sticky preview image and metadata.

### Standard Section Lists

Sources: `src/components/SectionList.astro`, `src/components/EntryCard.astro`

- `.sec-header`: image-backed or fallback section hero.
- `.sec-body`: centered content column with search/count bar.
- `.sec-list`: vertical list of `.ecard` rows.
- `.ecard`: two-column card with thumbnail, serif title, summary, tags, updated stamp, and crimson accent line. On mobile it becomes a single-column card with a 16:9 thumbnail.

This is the reusable baseline for simpler content collection indexes.

### Entry Detail Pages

Source: `src/layouts/EntryLayout.astro`

- Uses `MainLayout` with `navVariant="entry"` and breadcrumb trail.
- `.ent-hero`: image or fallback hero, title/type/tags.
- `.ent-body`: two-column grid, `260px` sticky sidebar plus main prose.
- `.ent-sidebar`: file data, updated stamp, optional table of contents.
- `.ent-main`: lead, divider, optional media, and `.ent-prose`.
- `.ent-related`: related entry grid.

The prose style uses DM Sans body text, Cormorant headings, crimson blockquote borders, gold emphasis, and `scroll-margin-top` based on `--nav-height`.

### Character Index

Source: `src/pages/characters/index.astro`

- Uses `SiteShell` directly, not `MainLayout`.
- Re-declares the global tokens with `--bg: #06060b`.
- Fixed custom nav, left `.sidebar`, and full-screen `.stage`.
- The stage owns hero art, watermark, tags, dossier CTA, overlay hide/show, filmstrip/dots, gallery switching, and search.
- Body is intentionally `overflow: hidden` on desktop.

Treat this as a special application-like view rather than a normal section list.

### Character Entry Dossier

Sources: `src/layouts/CharacterEntryLayout.astro`, `src/components/CharacterDossierMarkdown.astro`

Local character tokens:

```css
:root {
  --char-bg: #06060b;
  --char-surface: rgba(10, 10, 18, 0.76);
  --char-surface-strong: rgba(9, 9, 16, 0.92);
  --char-border: rgba(255, 255, 255, 0.07);
  --char-border-strong: rgba(255, 255, 255, 0.12);
  --char-crimson: #b13a34;
  --char-gold: #b08d3c;
  --char-text: #e8e4dc;
  --char-text-muted: rgba(232, 228, 220, 0.64);
  --char-text-dim: rgba(232, 228, 220, 0.36);
  --char-shadow: 0 24px 80px rgba(0, 0, 0, 0.36);
  --char-nav-height: 56px;
}
```

Structural variables:

- `--char-rail-col`
- `--char-tools-col`

Layout:

- Custom `.char-nav`.
- `.char-page` grid with sticky `.char-rail`, optional `.char-tools`, and scrollable `.char-main`.
- `.char-rail` contains portrait/gallery hero, quote card, and related links.
- `.char-main` contains dossier header, codex link, file fields, rendered markdown, ability cards, archive note, and gallery.
- `.dossier-prose` provides numbered H2 headings, ruled section headers, styled archive reference pills, blockquotes, lists, tables, code, and pre blocks.

### Character Codex

Source: `src/layouts/CharacterCodexLayout.astro`

- Uses `MainLayout`.
- `.codex-hero`: image-backed archive hero with breadcrumbs.
- `.codex-shell`: `220px` sticky metadata sidebar plus `.codex-main` reading pane.
- `.codex-prose`: full archive markdown treatment with tables, code, blockquotes, and serif headings.

### Search

Source: `src/pages/search/index.astro`

- Uses `MainLayout` with `routeKind="search"` and `transitionProfile="search-reveal"`.
- `.search-shell` wraps the entire page.
- `.search-hero` contains decorative glow/grain/scanlines, title, search console, autocomplete overlay, clear button, status line, and section chips.
- `.search-results-shell` contains result state, active filter status, primary featured card, secondary grid, remaining rows, empty state, and noscript fallback.
- Layout uses stable image dimensions, loading overlays, card/row variants, and state restoration through client script.

Preserve Search return-state continuity and the shared transition architecture when editing this page.

### Apparatus Registry

Source: `src/pages/apparatus/index.astro`

- Uses `MainLayout`.
- `.reg-root` wraps an archive registry view.
- `.reg-header`: cinematic hero with image/fallback, scanlines, grain, beam, count, and access metadata.
- `.reg-controls`: sticky filter/search controls.
- `.reg-grid`: `repeat(auto-fill, minmax(290px, 1fr))` card grid.
- `.reg-entry`: image/placeholder, bracket frame, seal, metadata, tags, and hover state.

### Sine Index

Source: `src/pages/sine/index.astro`

- Uses `MainLayout`.
- `.sine-root`: full-screen panel experience.
- `.sine-identity`: symmetrical header/rules.
- `.sine-panels`: branch panels with background images, accent colors, numerals, labels, and CTA.
- `.sine-overlay`/`.sine-modal`: fixed modal with hero area, side metadata card, divider, and prose body.

### Places Index And Map

Sources: `src/pages/places/index.astro`, `src/pages/places/map/index.astro`

Places index:

- `.places-root`: region browser.
- `.places-header`: centered title with rules.
- `.places-search`: search affordance and panel.
- `.places-row`: horizontally arranged region panels.
- `.region-*`: expanding region cards with background, vertical label, accent color, internal place cards, and footer.

Map:

- `.atlas`: full map application.
- `.atlas-stage`, `.map-frame`, `.map-transform`, `.map-canvas`: pan/zoom map surface.
- `.carto-chrome`: compass/reference/classification decorations.
- `.atlas-controls`: map controls.
- `.dossier`: side dossier panel with facts, routes, quote, and footer.
- Local map variables include `--atlas-accent`, `--hx`, and `--hy`.

### Organizations Index

Source: `src/pages/organizations/index.astro`

- Uses `MainLayout`.
- `.orgs-root`: editorial registry.
- `.orgs-hdr`: typographic header.
- `.orgs-index`: anchor index using per-entry `--accent`.
- `.orgs-registry`: stacked `.org-spread` editorial spreads with image pane and content pane.
- `.org-overlay`/`.org-modal`: fixed modal with hero aside, tags, fields card, divider, and body.

### Cosmology Index

Source: `src/pages/cosmology/index.astro`

- Uses `MainLayout`.
- `.cosmo-root`: vertical cosmology experience.
- `.cosmo-identity`: centered identity strip.
- `.cosmo-panels`: primary image panels with accent variables, grain, scanlines, numerals, chapter markers, stamps, and scroll hint.
- `.cosmo-others`: additional entries list.
- `.cosmo-overlay`/`.cosmo-modal`: fixed modal matching the organizations modal structure.

### Systems Index And Observatory

Sources: `src/pages/systems/index.astro`, `src/components/systems/SystemsObservatoryPage.astro`

Systems index:

- `.sys-root`: interactive split system browser.
- `.sys-split`: multi-panel system chooser with idle, collapsed, and expanded states.
- `.sys-expanded`: hero + body layout for the active system.
- `.sys-overlay`: fixed addendum overlay with three columns of entry chips.
- Per-panel variables: `--accent` and `--darkBg`.

Observatory:

- Uses `MainLayout` via `SystemsObservatoryPage.astro`.
- `.observatory-root`: immersive system map.
- `.observatory-stage`: aperture/sphere/nodes plus active panel.
- `.observatory-destinations`: grid of destination panels.
- Related components: `ArchiveSphere.astro`, `ArchiveField.astro`, `SystemNode.astro`, `DestinationPanel.astro`.

### Redactory Pages

Sources under `src/components/redactory/` plus pages under `src/pages/systems/redactory/`.

- Gateway: `.redactory-gateway`, local `--gateway-blue`, `--gateway-red`.
- Desk: `.redactory-desk`, local `--desk-image`, `--desk-blue`, `--desk-red`, hotspot-based object navigation.
- Dive: `.redactory-dive`, local ink/depth variables such as `--ink-black`, `--ink-blue`, `--ink-red`, `--ink-silver`, `--ink-depth`, `--depth-background`, and seal variables.
- Redactor profile: `.redactor-profile`, local `--profile-blue`, `--profile-red`.
- Index theorem: `.index-theorem`, local `--theorem-paper`, `--theorem-ink`, `--theorem-blue`, `--theorem-red`, `--theorem-route-gap`.

These pages are more bespoke and may use route-specific transition profiles: `redactory-desk`, `redactory-dive`, `redactory-profile`, and `redactory-theorem`.

### Soundtracks

Source: `src/pages/soundtracks/index.astro`

- Uses `MainLayout`.
- `.sound-archive`: page backdrop with veil/glow/grain.
- `.sound-shell`: two-column layout, sticky `.sound-feature` deck plus `.sound-catalog`.
- `.sound-feature`: playable featured track panel with art, progress, controls, volume, and status.
- `.sound-table` / `.sound-row`: catalog list with cover, metadata, actions, pagination, and search/filter behavior.
- Local item variable: `--sound-delay`.

## Reusable Interaction Rules

- Page scripts that must survive Astro navigation should register with `window.registerPageInit?.("stable-key", initFn)` and return cleanup functions.
- Do not add scattered `DOMContentLoaded`, `astro:page-load`, or `astro:before-swap` listeners for normal page setup.
- Use `data-transition-trigger` and route/profile metadata for navigation motion.
- Use `data-astro-prefetch="load"` only where the route is meant to be warmed aggressively, such as Search and Observatory handles.
- For reduced motion, add fallbacks in the owning CSS block. Route-level motion belongs in `transition-system.css`.

## Visual Rules To Preserve

- The site identity is dark archival/cinematic, not generic dashboard or marketing.
- Use real entry images or established fallback diagrams/placeholders when possible.
- Keep chrome thin: translucent borders, low-opacity panels, small radii, and restrained shadows.
- Prefer rules, stamps, labels, sidebars, panes, and editorial spreads over soft card-heavy layouts.
- Preserve positive letter spacing on uppercase metadata, but do not use negative letter spacing globally.
- Keep accent usage controlled: crimson for active/alert/section lines, gold for secondary metadata and seals.
- Keep body copy readable: long prose usually sits in constrained columns or scrollable panes with `line-height` around 1.75-1.9.
- Mobile views should collapse grids into one column, preserve sticky/search controls where already established, and respect `env(safe-area-inset-*)`.

## File Ownership Checklist

When changing design, start here:

- Global tokens/effects: `src/styles/global.css`
- View transitions: `src/styles/transition-system.css`
- Document shell and router: `src/layouts/SiteShell.astro`
- Shared nav/footer/page content shell: `src/layouts/MainLayout.astro`
- General entry detail: `src/layouts/EntryLayout.astro`
- Character dossier detail: `src/layouts/CharacterEntryLayout.astro`
- Character prose: `src/components/CharacterDossierMarkdown.astro`
- Basic list cards: `src/components/EntryCard.astro`
- Basic section index lists: `src/components/SectionList.astro`
- Music UI: `src/components/MusicPlayer.astro`

`src/styles/cards.css` is only a legacy compatibility import; the real card styles live in `EntryCard.astro`.
