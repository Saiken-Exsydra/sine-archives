# SiNE Archives

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Actual visitors read, discover and look up the fictional setting through an accessible encyclopedia and creative portfolio. English and Portuguese content is supported. Audience priority (first-time explorers versus returning reference readers) remains an open decision; no demographic or commercial audience is assumed.

## Product Purpose

A personal worldbuilding archive containing character dossiers, institutions and organizations, places and geography, historical events and timelines, cosmology and metaphysical structures, and complex magical systems. Interactive interfaces help readers explore systems and relationships. Success combines atmosphere with readable, understandable records and clear navigation.

## Positioning

Two perspectives coexist: an in-universe institutional archive presenting classifications, technical records and historical documents as if the institution existed, and an out-of-universe encyclopedia/portfolio helping real visitors understand the setting. Neither perspective should erase the other.

## Operating Context

Astro owns routes, content and layouts. The existing visual-design laboratory uses one React/TypeScript island at `/_lab/visual-design/` and `/pt-br/_lab/visual-design/`. Work happens locally on `experiment/visual-design-lab`, using Codex, npm, a browser and existing Playwright captures. Main pushes automatically deploy through Cloudflare; this branch must remain unmerged and must not be deployed during setup.

## Capabilities and Constraints

Preserve existing English/Portuguese navigation, archive references and disclosure boundaries, interactive Systems Observatory and magical-system interfaces, audio features, assets and translations. `The Archive/` is canon; do not invent facts, terminology, claims or sample lore. The laboratory fixture is explicitly non-canonical interface text. Preserve Astro + React integration; no React/Next.js/Tailwind migration, runtime design service, paid subscription or API key is required. Packages require the exact-name approval in AGENTS.md. Never change production pages or deployment while practicing in the lab.

## Brand Commitments

The established institutional archive and encyclopedia identity is deliberate, sophisticated, atmospheric and editorial. Preserve the existing identity documented by `docs/design-system.md`; do not substitute a generic SaaS dashboard, arbitrary science-fiction styling, excessive futuristic ornament, meaningless animation or fashionable effects that weaken comprehension.

## Evidence on Hand

`docs/architecture.md`, `docs/design-system.md`, `docs/content-workflow.md`, the existing layouts/components/styles/assets and bilingual content are factual sources. `DESIGN.md` records their visual conventions; `.impeccable/design.json` is supporting metadata. The lab's record panel is a reusable testing fixture, not evidence of fictional canon. No testimonials, business metrics or commercial claims are supplied.

## Product Principles

- Preserve fictional truth and established disclosure boundaries.
- Support both immersion and actual reader comprehension.
- Keep bilingual behavior and established interaction ownership intact.
- Try bounded, reversible fixture changes and inspect the rendered results before retaining them.

## Accessibility & Inclusion

Preserve keyboard access, visible focus, named controls, heading order, readable contrast, touch access, responsive reading order and reduced-motion alternatives. Keep locale labels and Portuguese diacritics accurate. No new formal conformance claim is made by this setup.
