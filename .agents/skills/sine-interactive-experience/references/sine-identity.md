# SiNE identity

## Design premise

SiNE Archives is an impossible archive rendered through restrained modern editorial design. It may be cosmic, strange, technological, archival, or metaphysical, but it remains controlled.

The desired qualities are precise, restrained, elegant, slightly uncanny, responsive, layered, and deliberate. Reject default trend language that makes the project resemble a generic sci-fi dashboard, SaaS product, or game HUD.

Avoid defaulting to:

- cyan sci-fi HUDs;
- neon gradients;
- pervasive glassmorphism;
- enormous rounded SaaS cards;
- generic dashboards;
- oversaturated galaxy imagery;
- excessive bloom or blur;
- gratuitous holographic effects;
- unrelated icon systems;
- decorative particles or parallax without semantic purpose.

Prefer the established vocabulary: thin archive chrome, rules, stamps, labels, panes, dossiers, registers, editorial spreads, real project imagery, restrained shadows, subtle grain/scanlines, controlled crimson, and subordinate gold metadata.

## Repository authorities

Treat these as authoritative and re-read them before relevant changes:

- `docs/design-system.md`: visual system, page families, tokens, motion ownership, accessibility, and responsive conventions.
- `docs/architecture.md`: route/component ownership, Astro lifecycle, content pipeline, and validation boundaries.
- `docs/content-workflow.md`: content, image, locale, and maintenance rules when the work touches authored material.
- `docs/character-entry-model.md`: public character authoring contract when relevant.
- `docs/archive-cross-references.md`: reference syntax and integrity when relevant.

`The Archive/` is canon. Do not invent lore, rewrite its voice, rename fictional terms, alter disclosure boundaries, or change slugs, anchors, collection names, or locales unless explicitly requested.

## Existing visual and interaction language

- Use the canonical tokens in `src/styles/global.css` before adding page-local colors.
- Crimson is the main active accent; gold is secondary metadata/seal emphasis.
- Use Cormorant Garamond for display/editorial hierarchy and DM Sans for body/UI according to existing page patterns.
- Reuse `.sine-grain`, `.sine-scanline`, and existing cinematic effects where appropriate instead of inventing an unrelated atmosphere.
- Keep chrome thin, radii modest, shadows restrained, and body copy readable.
- Use the 4/8px spacing rhythm, established page-family breakpoints, safe-area padding, and constrained prose measure.
- Object feedback generally belongs in the established 140–360ms range; longer cinematic travel belongs to owned route profiles. Motion duration follows meaning, not spectacle.

## Ownership and lifecycle

- Keep routes in `src/pages/`, layouts in `src/layouts/`, and reusable UI in `src/components/`.
- Keep Observatory-related components inside the existing `src/components/systems/` feature boundary unless a responsibility is genuinely shared.
- Route transition styling belongs in `src/styles/transition-system.css`.
- Initialize and tear down page behavior through `window.registerPageInit`. Cleanup includes listeners, timers, observers, network requests, animation frames, GSAP contexts, timelines, and tweens.
- Use `data-transition-trigger` and route/profile metadata for navigation motion rather than parallel navigation systems.
- Preserve bespoke page families; refactor only when ownership or real duplication justifies it.

## Information and imagery

Use real entry images or established fallback diagrams/placeholders where possible. Design around source art rather than forcing it into generic card crops. Images must add orientation, mechanism, evidence, atmosphere, or conceptual understanding; empty space is not a defect that automatically needs an image.

Use Mermaid for public hierarchy or relationship diagrams and `diagram` only for alignment-sensitive textual maps, following the black-stage treatment in the design system.

## Validation contract

After source changes, run `npm run check` and `npm run build`. Run `npm run test:transitions` for navigation/lifecycle work, `npm run test:characters` for character behavior, and broader Playwright coverage when the interaction surface warrants it. Inspect representative desktop/mobile routes, keyboard behavior, reduced motion, and intermediate states in a browser.
