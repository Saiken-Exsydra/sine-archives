---
name: SiNE Archives
description: Institutional archive atmosphere with an accessible editorial reading interface.
colors:
  crimson: "#b13a34"
  gold: "#b08d3c"
  bg: "#050407"
  surface: "#0a0a14"
  border: "rgba(255, 255, 255, 0.07)"
  text: "#e8e4dc"
  text-muted: "rgba(232, 228, 220, 0.72)"
  text-dim: "rgba(232, 228, 220, 0.6)"
  crimson-text: "#e58c84"
  gold-text: "#d9ba70"
typography:
  display:
    fontFamily: '"Cormorant Garamond", serif'
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.1
  headline:
    fontFamily: '"Cormorant Garamond", serif'
    fontSize: "clamp(1.8rem, 4vw, 2.5rem)"
    lineHeight: 1.1
  card-title:
    fontFamily: '"Cormorant Garamond", serif'
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.01em"
  body:
    fontFamily: '"DM Sans", sans-serif'
    fontSize: "0.95rem"
    lineHeight: 1.8
  label:
    fontFamily: '"DM Sans", sans-serif'
    fontSize: "0.7rem"
    fontWeight: 500
    letterSpacing: "0.1em"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
  notice:
    fontFamily: '"DM Sans", sans-serif'
    fontSize: "0.85rem"
    lineHeight: 1.7
  metadata-value:
    fontFamily: '"DM Sans", sans-serif'
    fontSize: "0.9rem"
    lineHeight: 1.6
  density-label:
    fontFamily: '"DM Sans", sans-serif'
    fontSize: "0.75rem"
rounded:
  search: "4px"
  entry-card: "6px"
spacing:
  small: "8px"
  medium: "16px"
  record-inset: "clamp(1.25rem, 4vw, 3rem)"
components:
  record-control:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    padding: "0.7rem 0.85rem"
  record-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    width: "min(100% - 2rem, 68rem)"
  section-search:
    backgroundColor: "rgba(255, 255, 255, 0.04)"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.search}"
    padding: "8px 14px"
---

# SiNE Archives â€” Design System and Visual Design Lab

## Overview

An institutional archive with an accessible encyclopedia reading layer: restrained, cinematic and editorial. This document merges the previous laboratory brief with tokens and patterns extracted from current source. It applies to native Astro UI and React islands. It records the incumbent system; it does not redesign it.

[docs/design-system.md](docs/design-system.md) remains the single visual authority. [AGENTS.md](AGENTS.md), [architecture](docs/architecture.md) and [content workflow](docs/content-workflow.md) retain their roles. The frontmatter is an extracted snapshot, not a competing source of CSS variables. If code or this snapshot conflicts with the visual authority, explain the discrepancy before changing it. There is no uniform global type ramp: page families deliberately use their own scales, and the display/headline/body tokens above describe the lab, while card-title describes EntryCard.

The default edit surface is `src/components/experiments/visual-design/fixtures/ArchiveRecord.tsx` and its adjacent CSS. `src/pages/[...lab]/visual-design.astro` supplies the wrapper and both locale routes. Preserve noindex metadata and keep the lab out of public navigation/search. Its sample data is non-canonical. Production components, content, translations, assets, music, routing, deployment and main remain outside normal lab changes.

Key characteristics: dark canvas, thin rules, serif record titles, spaced uppercase metadata, reading panes and restrained crimson/gold accents. No new visual metaphor or brand language was invented for this extraction.

## Colors

Crimson is the primary active/section accent; gold is the secondary metadata, seal and focus accent. Neutral canvas and surface layers use the frontmatter's actual values from `src/styles/global.css`. Primary text is warm and pale; muted text supports secondary information; dim text is decorative and must not carry essential instructions. Check actual contrast rather than assuming an existing alpha value is accessible at every size.

**Canvas continuity.** Preserve the dark document and transition backgrounds, including navigation, to prevent white flashes. Reuse `var(--bg)`, `var(--surface)`, `var(--border)`, `var(--text)`, `var(--text-muted)`, `var(--text-dim)`, `var(--crimson)` and `var(--gold)` rather than defining another palette.

Character pages intentionally have local `--char-*` surfaces and opacity variants; Systems, map and Redactory interfaces have their own bounded accent tokens. Do not flatten those bespoke families into the fixture's palette or promote their local tokens globally.

## Typography

Cormorant Garamond supplies record titles and section headings, usually weights 600/700 with tight heading leading; italic designations occur where already established. DM Sans supplies body text and UI. Mono uses `ui-monospace, SFMono-Regular, Consolas, monospace`. `SiteShell.astro` loads the existing Google Fonts: reuse them without another font service or package.

The frontmatter captures the lab's fluid heading roles and one canonical entry-card title. General section titles are 52px, becoming 38px at the local 640px breakpoint; entry hero titles use `clamp(36px, 6vw, 62px)`. Existing metadata ranges by page family (often 9â€“13px), with positive letter spacing and uppercase labels. These are observed conventions, not permission to make essential text tiny. No artificial universal scale is imposed.

Constrain reading measure; normal long prose uses line-height around 1.75â€“1.9. The fixture's reading text is limited to 55ch. Distinguish headings, metadata, controls and reading text without allowing decoration to dominate the record. Do not apply negative letter spacing globally.

## Layout

Follow the existing 4/8px spacing rhythm, bounded fluid sizes and page-family breakpoints, using plain CSS. `--nav-height` owns the shared 56px chrome offset. `MainLayout.astro` supplies ordinary navigation, locale switching, music, search and footer; `SiteShell.astro` owns the document, fonts, global styles and router. Bespoke full-screen character and system experiences retain their own composition.

EntryLayout uses a 260px sticky metadata sidebar and a reading column, collapsing at 860px. Character codex uses a 220px rail. Entry cards use a 130px thumbnail plus text and collapse to a single-column mobile view with 16:9 artwork. These are existing component patterns, not new layout requirements.

The reusable lab fixture starts with a 68rem maximum width, a 14rem metadata rail, fluid record inset, and a 640px collapse point. Below that point the rail becomes a two-column metadata list above the reading pane. Compact spacing is an explicit state. Preserve source order, touch access, safe-area padding and internal diagram scroll where appropriate. Inspect at 320, 390, 768, 1440 and 1920px; no page overflow is expected.

## Elevation & Depth

Tonal layering, fine translucent borders, low-opacity imagery and restrained shadows separate panes. The existing `--shadow` is `0 14px 40px rgba(0, 0, 0, 0.35)`; character surfaces have a deeper local shadow documented by their owner. Do not introduce neon glows, excessive blur or nested walls of soft cards.

Grain, scanlines and image-backed cinematic stages are incumbent patterns. `global.css` owns grainShift, kenburns, fadeSlideUp, scrollBounce and pulseRule; reduced motion makes grain static. These effects are atmosphere, not a requirement on every surface. The fixture currently has no animation.

## Shapes

Use rules, stamps, metadata rails, panes and editorial spreads. Entry cards use modest 6px corners; search controls and navigation icon buttons use 4px corners. The lab record itself has square corners. Thin border treatments should remain subordinate to content; do not turn every group into another rounded card. Icons are existing inline SVG, diagrams and authored imagery; no new icon library is required.

## Components

- **Record fixture:** header, semantic metadata list, reading controls, reading panel, checklist disclosure and return link. Preserve the overview/notes, compact and expanded states and bilingual labels. Generated React IDs associate heading and disclosure correctly when instances are reused.
- **Record controls:** transparent named buttons, 44px minimum height, thin border, gold hover and visible focus, crimson selected border/inset rule. The density control is a native checkbox with crimson accent. Navigation uses links; in-place actions use buttons. Preserve `aria-pressed`, `aria-expanded`, associated labels/regions and live reading updates.
- **EntryCard and SectionList:** the existing reusable content-index baseline with thumbnail, serif title, summary, tags, updated metadata and crimson accent. Inputs, cards and navigation snippets in `.impeccable/design.json` are previews of actual patterns, not replacement production components.
- **Shell and page families:** MainLayout owns normal chrome; EntryLayout owns general article reading; CharacterEntryLayout/CharacterCodexLayout own dossiers/codices; SystemsObservatoryPage with ArchiveSphere/ArchiveField/SystemNode/DestinationPanel owns system exploration. Preserve these boundaries instead of rebuilding them as generic dashboards.
- **CSS ownership:** Astro scoped styles and imported global tokens remain the architecture. React CSS stays under `.visual-lab-record`; every experimental selector must stay within its root. No Tailwind, utility framework or new global stylesheet is needed.
- **Motion/lifecycle:** local feedback uses 140ms, state changes 220ms, pane continuity 320ms, and artwork 450ms. The shared modal token is 320ms. `src/styles/transition-system.css` exclusively owns route motion (280ms standard/search; authored passages retain their own profiles). Reduced motion preserves the selected state without spatial choreography. Galleries start manually and offer explicit playback. React effects own island cleanup. Astro controllers use `window.registerPageInit`, page-owned `window.sineMotion` helpers, and cleanup for listeners, timers, observers, requests and frames; no parallel global navigation listeners. Decorative loops pause while hidden, offscreen, or reduced.
- **Assets:** authored processed artwork belongs in `src/assets/uploads/`; stable public URLs live in `public/uploads/`. The shared logo uses `/uploads/ui-sine-logo.png`. Preserve authored media and translations; generated soundtrack metadata/covers use their generators. This fixture needs no new images during setup.
- **Accessibility:** keep gold focus rings and focus equivalents for hover. Preserve heading order, readable contrast, keyboard operation, localized labels and reduced motion. New dialogs require a name, focus containment, Escape handling, inert hidden/background states and focus return. Existing dim metadata is a review concern, not evidence of guaranteed conformance.

## Do's and Don'ts

- Do read the visual authority and target source before visual/motion edits; explain conflicts.
- Do keep experiments on this branch and inside the fixture unless the user expands scope.
- Do preserve English/Portuguese text, diacritics, functionality and institutional identity.
- Do capture a baseline, inspect the running page, capture a candidate, compare desktop/mobile and unchanged production references, and run source/build/relevant browser checks. Use `scripts/visual-design-lab.mjs` as documented in [the lab guide](docs/experiments/visual-design-lab.md).
- Don't invent lore, replace archive prose, alter disclosure boundaries or duplicate production content to fill an interface.
- Don't impose a generic SaaS dashboard, arbitrary sci-fi styling, excessive futuristic ornament or meaningless motion.
- Don't hand-edit `dist/`, `.astro/`, `node_modules/`, soundtrack metadata/covers or test artifacts.
- Don't copy a lab variant into production, merge main, publish the route, or change deployment without a separate request.
