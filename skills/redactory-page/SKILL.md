---
name: redactory-page
description: Use for full-page creation or full-page revision in the SiNE Archives Astro site, including Systems Observatory, Dark Ends, Archive landing, Redactory desk, Index Theorem, major lore navigation pages, and immersive dark archive pages that must follow the Redactory Open Design system instead of generic SaaS, dashboard, landing-page, or neon cyberpunk patterns.
triggers:
  - full page
  - page redesign
  - Systems Observatory
  - Redactory desk
  - Dark Ends
  - archive landing
  - Index Theorem
od:
  design_system: redactory
  design_system_path: design-systems/redactory/DESIGN.md
  preferred_agent: codex
---

# Redactory Page

Use this skill for full-page creation or full-page revision in SiNE Archives.

## Required Context

Read first:

1. `AGENTS.md`
2. The active Open Design design system selected for the task.
3. If the active design system is `redactory`, read `design-systems/redactory/DESIGN.md`.
4. Read root `DESIGN_SYSTEM.md` if present. This repository uses `DESIGN_SYSTEM.md`; do not assume a root `DESIGN.md` exists.
5. The target route in `src/pages/`
6. The nearest sibling route, layout, and component family

For detailed page patterns, read `references/layout-patterns.md`. For banned patterns, read `references/anti-patterns.md`.

The `od:` frontmatter is documentation for Open Design. Essential behavior is written in this markdown body so the skill works even if a tool ignores extra metadata fields.

## Workflow

1. Identify route ownership: `MainLayout`, `SiteShell`, specialized layout, or component-driven page.
2. Inspect current assets in `public/uploads`, `src/assets/uploads`, `src/components/redactory`, and `src/components/systems`.
3. Reuse existing components and CSS tokens before adding new structures.
4. Preserve routes, slugs, anchors, locale structure, content collections, and transition architecture.
5. Design the page as an archive/lore interface: registry, dossier, observatory, desk, map, gateway, addendum, or document system.
6. Add responsive behavior for mobile and wide desktop.
7. Add hover, focus, active, and reduced-motion behavior for interactive elements.
8. Verify with browser tooling or Playwright when available.

## Implementation Rules

- Use Astro and plain CSS patterns already present in the repo.
- Use existing project assets; do not invent external assets.
- Do not install packages.
- Do not rewrite shared layouts or routing unless the user explicitly asks.
- Do not create generic hero/features/pricing/FAQ pages.
- Do not make source content or lore changes unless the request includes that scope.
- If adding route-level motion, prefer `src/styles/transition-system.css`.
- If adding page scripts that must survive navigation, use `window.registerPageInit?.("stable-key", initFn)`.

## Visual Quality Rules

- Keep the page dark, crisp, archival, and readable.
- Prefer near-black backgrounds, thin linework, restrained crimson/gold accents, and warm text.
- Use atmosphere through depth, material, real assets, labels, ruled sections, and motion restraint.
- Make the first viewport signal the actual place/object/system, not a generic marketing claim.
- Keep long text in readable columns or panes.
- Avoid gray wash, soft bland cards, oversized rounded rectangles, neon gradients, and startup copy.

## Final Self-Review

- Existing route/component structure inspected.
- `AGENTS.md` and design system read.
- Page uses existing tokens/assets/components where possible.
- No generic SaaS/dashboard/landing-page pattern introduced.
- Responsive states checked.
- Hover/focus/active/reduced-motion states handled where relevant.
- Build or relevant check run if source code changed.
