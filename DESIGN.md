# SiNE Archives — Visual Design Lab

This is the experimental design brief for `experiment/visual-design-lab`. It describes a reading interface that combines an in-universe institutional archive with an out-of-universe encyclopedia. Help readers find, understand and compare records while preserving the archive's restrained, cinematic identity.

## Authority and scope

[docs/design-system.md](docs/design-system.md) remains the single visual authority; [AGENTS.md](AGENTS.md), [architecture](docs/architecture.md) and [content workflow](docs/content-workflow.md) retain their existing roles. This brief applies to the lab and does not replace or rewrite those documents. Inspect the actual target source before editing. Explain any proposed conflict with established guidance.

Default edit surface: `src/components/experiments/visual-design/fixtures/ArchiveRecord.tsx` and its adjacent CSS. The Astro wrapper is `src/pages/[...lab]/visual-design.astro`; normal work should not require touching it. Use `/_lab/visual-design/` and `/pt-br/_lab/visual-design/`. Keep the noindex metadata and avoid public navigation/search links. All sample record data is explicitly non-canonical.

Keep changes on the experimental branch. Production components, layouts, global styles, content, images, translations, routing conventions, music, deployment and main are outside this experiment. Do not copy a lab variant into production without a separate request. Astro remains responsible for routes, content and layouts; React owns only the interactive test fixture.

## Typography and reading hierarchy

- Display headings: Cormorant Garamond, serif, usually 600/700; tight heading line-height and restrained italic designations where appropriate.
- Body/UI: DM Sans, sans-serif. Metadata uses small uppercase labels and positive letter spacing; code uses the existing system monospace stack.
- Existing fonts are loaded by `SiteShell.astro`. Reuse them; do not add a font service or import a generator's font package.
- Keep prose measure constrained and body line-height around 1.75–1.9. Headings, metadata, controls and reading text must have distinct roles without overwhelming the record.

## Palette and surfaces

Use the actual variables from `src/styles/global.css`; do not redefine the shared palette:

| Token | Established value / role |
| --- | --- |
| `--bg` | `#050407`, document canvas |
| `--surface` | `#0a0a14`, record panels |
| `--border` | `rgba(255,255,255,.07)`, fine separation |
| `--text` | `#e8e4dc`, main text |
| `--text-muted` | `rgba(232,228,220,.55)`, subordinate text; check readability |
| `--text-dim` | `rgba(232,228,220,.3)`, decoration, never essential instructions |
| `--crimson` | `#b13a34`, selected states, section rules and primary accents |
| `--gold` | `#b08d3c`, metadata, seals and visible keyboard focus |
| `--shadow` | existing subdued panel shadow |

Prefer thin rules, stamps, labels, metadata rails and reading panes. Use modest radii and restrained shadows. Preserve the dark canvas through navigation. Avoid generic marketing dashboards, neon, excessive blur, new icon libraries and nested walls of rounded cards.

## Spacing and component structure

Follow the established 4/8px rhythm. Use fluid spacing and bounded type sizes instead of a new spacing framework. The fixture currently uses a 68rem maximum width, `clamp(1.25rem,4vw,3rem)` panel spacing, a 14rem metadata rail and a 640px local collapse point. These are fixture starting values, not global tokens.

`MainLayout.astro` supplies the shared chrome, locale switching and music. The record fixture contains a header, semantic metadata list, reading controls, reading panel, disclosure checklist and return link. Preserve those useful states while evaluating new layouts. Label any intentional experiment in the accompanying change description; do not invent lore to fill space.

## CSS and motion ownership

Use plain CSS. Astro's normal scoped styles and existing global token files remain in place. React fixture CSS uses the `.visual-lab-record` namespace; keep every rule inside it so experiments cannot restyle production pages. No Tailwind, Next.js or utility framework is needed.

Use existing grain/scanline treatments sparingly when they serve the archive. Ordinary object feedback generally takes 140–360ms; the shared modal token is 380ms. Prefer transform/opacity. Route transitions belong in `src/styles/transition-system.css` and are outside normal lab edits. Respect reduced motion, including static grain and immediate semantic state changes. The fixture starts without animation.

React handlers/hooks own island interactions and effect cleanup. If a future Astro controller is genuinely needed, follow `window.registerPageInit` and return cleanup for listeners, timers, observers, requests and frames. Do not add parallel global navigation listeners.

## Assets, responsive behavior and access

- Authored processed artwork belongs in `src/assets/uploads/`; stable public URLs live in `public/uploads/`. Preserve both. This fixture currently needs no new images.
- Do not edit generated `dist/`, `.astro/`, `node_modules/`, soundtrack metadata/covers or test artifacts. Use their owning tools.
- Check 320, 390, 768, 1440 and 1920px. Collapse rails to a sensible reading order; prevent page overflow, preserve touch access, and respect `--nav-height` and existing safe-area behavior.
- Navigation uses links; in-place actions use named buttons. Preserve native checkbox semantics, `aria-pressed`, `aria-expanded` and correctly associated labels/regions. Keep gold focus rings visible and provide a focus equivalent for hover feedback.
- Keep essential text readable against the real surface. Preserve contrast, heading order, keyboard operation, localized labels and reduced-motion behavior. New dialogs need focus containment, Escape handling, inert background and focus return.

## Review loop

Read this brief and the visual authority, capture a baseline, make one bounded fixture change, inspect the running page, capture a candidate and compare desktop/mobile images plus unchanged production references. Use `node scripts/visual-design-lab.mjs` as documented in [the lab guide](docs/experiments/visual-design-lab.md). A screenshot difference is evidence to review, not an automatic improvement or failure. Run the source check, build and relevant browser tests before retaining the change. Record existing failures separately from new regressions.
