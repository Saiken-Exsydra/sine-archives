---
name: redactory-visual-polish-pass
description: Use after Codex or Open Design has created or edited a SiNE Archives page and it looks weak, generic, washed out, too bright, too SaaS-like, too flat, inconsistent, or visually unfinished. This is an art-direction and QA pass for surgical improvements, not a default full rewrite.
triggers:
  - visual polish
  - polish pass
  - looks generic
  - washed out
  - too bright
  - too SaaS
  - visual QA
  - art direction
od:
  design_system: redactory
  design_system_path: design-systems/redactory/DESIGN.md
  preferred_agent: codex
---

# Redactory Visual Polish Pass

Use this skill to improve an existing page that looks weak or off-brand. Do not create a new page by default.

## Required Context

Read first:

1. `AGENTS.md`
2. The active Open Design design system selected for the task.
3. If the active design system is `redactory`, read `design-systems/redactory/DESIGN.md`.
4. Read root `DESIGN_SYSTEM.md` if present. This repository uses `DESIGN_SYSTEM.md`; do not assume a root `DESIGN.md` exists.
5. The implemented page/component/CSS
6. `references/visual-review-checklist.md`
7. `references/responsive-checklist.md`

The `od:` frontmatter is documentation for Open Design. Essential behavior is written in this markdown body so the skill works even if a tool ignores extra metadata fields.

## Workflow

1. Inspect the current implementation and nearest mature page.
2. Inspect browser output when possible with Playwright, screenshots, or in-app browser tooling before deciding what to change.
3. Compare the result against `design-systems/redactory/DESIGN.md` when using the `redactory` design system.
4. Check specifically for washed-out color, generic SaaS UI, weak contrast, bad spacing, weak hierarchy, broken responsive behavior, and missing hover/focus states.
5. Identify the smallest set of fixes that improves atmosphere, contrast, spacing, hierarchy, motion, hover/focus states, and responsiveness.
6. Patch surgically. Do not redesign from scratch. Do not rewrite from scratch unless the structure is fundamentally broken and the user approved that scope.
7. Re-check desktop and mobile.

## Implementation Rules

- Do not change lore/content unless required for layout/readability and approved by the task.
- Do not replace assets with generic images/icons.
- Do not introduce packages.
- Do not rewrite routes or shared layout for local polish.
- Do not redesign from scratch; this skill is a polish and QA pass for existing work.
- Prefer CSS/token/component adjustments in the target file.
- If motion changes affect route transitions, check `src/styles/transition-system.css`.

## Visual Quality Rules

- Sharpen contrast without making the page harsh.
- Darken washed-out panels and restore near-black depth.
- Strengthen hierarchy through type scale, rules, metadata, spacing, and asset placement.
- Make interactive states discoverable.
- Keep animation restrained and serious.
- Preserve readability on lore-heavy pages.

## Final Self-Review

- Before/after issue identified.
- Changes are surgical.
- Page no longer reads as generic SaaS/dashboard/AI output.
- Contrast, spacing, hierarchy, and interaction states improved.
- Mobile and desktop checked.
- Build or relevant visual test run when source changed.
