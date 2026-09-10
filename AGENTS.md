# Contributor instructions

SiNE Archives is a deployed Astro site. Make reviewable changes on a dedicated branch; preserve uncommitted work. Explain target files and purpose before editing. Use npm and the lockfile; adding packages requires approval of exact names.

## Authorities

- [docs/architecture.md](docs/architecture.md): ownership, routes, lifecycle, and content pipeline.
- [docs/design-system.md](docs/design-system.md): the single visual authority. Read it and target source before visual/motion edits; explain conflicts before changing the design.
- [docs/content-workflow.md](docs/content-workflow.md): content, images, translations, and maintenance.
- [docs/character-entry-model.md](docs/character-entry-model.md): public character authoring contract.
- [docs/archive-cross-references.md](docs/archive-cross-references.md): reference syntax and integrity.

## Invariants

- `The Archive/` is canon. Do not invent lore, restyle its prose, rename fictional terms, or alter disclosure boundaries. Preserve slugs, anchors, frontmatter, collection names, and locales unless requested.
- Keep Astro routes in `src/pages/`, layouts in `src/layouts/`, and reusable UI in `src/components/`. Preserve bespoke page families; refactor where ownership or actual duplication warrants it.
- Use plain CSS and existing tokens. Route transition CSS belongs in `src/styles/transition-system.css`; page setup/teardown uses `window.registerPageInit`. Return cleanup for listeners, timers, observers, requests, and animation frames.
- Public hierarchy diagrams use `mermaid`; raw alignment-sensitive maps use `diagram`. Ordinary code blocks remain ordinary code. See the design system for the black-stage treatment.
- Do not hand-edit generated files (`dist/`, `.astro/`, `node_modules/`, `test-results/`, soundtrack metadata or extracted covers). Use their owning generators when needed.

## Validation

Run `npm run check` and `npm run build` after source changes. Run `npm run test:transitions` for navigation/lifecycle changes and `npm run test:characters` for character behavior. `npm test` runs every browser regression. Rebuild before testing the preview server. Inspect representative desktop/mobile routes, keyboard behavior, and reduced motion after frontend changes. Explain failed checks and fix patch-caused failures.

## Deployment safety

Never deploy automatically. Changes to deployment, Cloudflare, DNS, secrets, credentials, or environment settings require separate explicit authorization. Treat `astro.config.mjs`, `public/_headers`, `public/robots.txt`, and package manifests carefully and explain why an edit is needed. Do not remove local authoring data or media merely because it is untracked.
