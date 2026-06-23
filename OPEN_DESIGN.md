# Open Design Setup

This repository is prepared for Open Design with project-local skills and a Redactory-specific design system.

## What Was Added

- `skills/redactory-page/`
- `skills/redactory-interactive-object/`
- `skills/redactory-dossier-entry/`
- `skills/redactory-visual-polish-pass/`
- `design-systems/redactory/DESIGN.md`
- this guide, `OPEN_DESIGN.md`
- a short Open Design section in `AGENTS.md`

No page UI, routes, assets, or source behavior were intentionally changed.

## Known Project Naming

- Root source design file: `DESIGN_SYSTEM.md`
- Open Design selectable design system: `design-systems/redactory/DESIGN.md`
- Open Design skill folder: `skills/`
- There is no root `DESIGN.md`; do not assume one exists.

## Skill Locations

Open Design skills live in:

```text
skills/
```

Each skill folder contains a `SKILL.md` and targeted reference files under `references/`.

## Design System Location

Use design system slug:

```text
redactory
```

Design system file:

```text
design-systems/redactory/DESIGN.md
```

This file adapts the existing root source design file, `DESIGN_SYSTEM.md`, into an Open Design-friendly structure.

## Which Skill To Use

Use `redactory-page` for full-page creation or major page revision:

- Systems Observatory page.
- Dark Ends page.
- archive landing page.
- Redactory desk page.
- Index Theorem page.
- major lore/navigation page.

Use `redactory-interactive-object` for clickable or hoverable diegetic objects:

- clickable quill.
- stack of papers.
- glowing edge handle.
- animated desk object.
- hover preview.
- page reveal animation.
- object-triggered route transition.

Use `redactory-dossier-entry` for lore-heavy pages:

- character dossiers.
- classified document pages.
- Dark Ends entries.
- Index Theorem explanation.
- Redactory theory pages.
- archive/codex entries.

Use `redactory-visual-polish-pass` after a page exists but looks weak:

- too generic.
- washed out.
- too bright.
- too SaaS-like.
- too flat.
- inconsistent with the archive identity.

## Recommended Workflow

1. Pick the relevant skill.
2. Use design system `redactory`.
3. Tell Codex/Open Design to read `AGENTS.md`, root `DESIGN_SYSTEM.md` if present, and `design-systems/redactory/DESIGN.md` when using design system `redactory`.
4. Ask it to inspect the existing route/component structure before editing.
5. Keep visual changes scoped.
6. Run project checks after source changes.
7. Use Playwright or browser screenshots when visual behavior matters.

## Example Prompts

```text
Skill: redactory-page
Design system: redactory
Prompt: Create the Systems Observatory page using the existing route/component structure. Follow DESIGN_SYSTEM.md and AGENTS.md. Do not make it look like a SaaS dashboard.
```

```text
Skill: redactory-interactive-object
Design system: redactory
Prompt: Add a clickable quill object to the Redactory desk. Use existing project assets, preserve keyboard access, and make the interaction subtle rather than button-like.
```

```text
Skill: redactory-dossier-entry
Design system: redactory
Prompt: Rework this Dark Ends entry into a readable classified archive page. Preserve canon, slugs, anchors, and existing content. Avoid a blog layout.
```

```text
Skill: redactory-visual-polish-pass
Design system: redactory
Prompt: Review this page visually and patch it. It currently looks too generic and washed out. Make it sharper, darker, and more aligned with the Redactory design system. Do not redesign from scratch.
```

## Project Checks

Use npm because this repo has `package-lock.json`.

```text
npm run build
npm run check
npm run test:transitions
```

Use `npm run build` for broad site validation. Use `npm run check` for Astro checks. Use `npm run test:transitions` when navigation or transition behavior changes.

## Visual Testing

Playwright is configured in `playwright.config.mjs`.

Recommended visual workflow:

1. Run or let Playwright start the preview server.
2. Inspect desktop and mobile viewport behavior.
3. Check hover, focus, active, modal, and reduced-motion states.
4. Confirm no horizontal overflow, overlapping text, or blank media.

Existing transition smoke tests:

```text
npm run test:transitions
```

For visual polish, browser screenshots are useful even when no snapshot tests exist.

## Notes

The repository does not currently have a root `DESIGN.md`; it has `DESIGN_SYSTEM.md`. Open Design should use `design-systems/redactory/DESIGN.md` as the Open Design design-system entry and `DESIGN_SYSTEM.md` as the project source of truth.
