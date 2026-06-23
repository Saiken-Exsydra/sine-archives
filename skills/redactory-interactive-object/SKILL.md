---
name: redactory-interactive-object
description: Use for clickable, hoverable, focusable, or animated diegetic objects in SiNE Archives, such as a quill, stack of papers, desk object, left-side handle, glowing edge entry, hover preview, page reveal, hotspot, or object-triggered route transition that must feel like an archive artifact rather than a normal generic button.
triggers:
  - clickable object
  - hover object
  - hotspot
  - quill
  - stack of papers
  - glowing edge
  - object transition
od:
  design_system: redactory
  design_system_path: design-systems/redactory/DESIGN.md
  preferred_agent: codex
---

# Redactory Interactive Object

Use this skill for diegetic object interactions, hotspots, handles, and subtle object-triggered motion.

## Required Context

Read first:

1. `AGENTS.md`
2. The active Open Design design system selected for the task.
3. If the active design system is `redactory`, read `design-systems/redactory/DESIGN.md`.
4. Read root `DESIGN_SYSTEM.md` if present. This repository uses `DESIGN_SYSTEM.md`; do not assume a root `DESIGN.md` exists.
5. The target component/page
6. `references/object-interactions.md`
7. `references/motion-rules.md`

The `od:` frontmatter is documentation for Open Design. Essential behavior is written in this markdown body so the skill works even if a tool ignores extra metadata fields.

## Workflow

1. Identify the object role: navigation, reveal, preview, toggle, modal trigger, route transition, or ambient feedback.
2. Reuse existing PNG/SVG/image assets from `public/uploads` or `src/assets/uploads`.
3. Inspect existing Redactory/Systems interaction code before adding new behavior.
4. Make the object visibly interactive through material changes, focus edge, glow, line pulse, shadow shift, aperture, or slight lift.
5. Preserve keyboard access with semantic links/buttons or ARIA only when semantics require it.
6. Add hover, focus-visible, active, disabled/loading, and reduced-motion states as applicable.
7. Keep motion quiet and serious.

## Implementation Rules

- Do not replace project assets with generic icons.
- Do not hide required navigation behind mouse-only hover.
- Use actual `<a>` for route navigation when possible.
- Use actual `<button>` for in-page actions when possible.
- If the visual object cannot look like a normal button, keep semantics while styling it as an artifact.
- Use `data-transition-trigger` and route metadata when working with route transitions.
- Use `window.registerPageInit?.("stable-key", initFn)` for client behavior that must survive Astro navigation.

## Visual Quality Rules

- Make interaction discoverable but not loud.
- Prefer subtle glow, edge light, line pulse, ink reveal, paper shift, shadow depth, or aperture response.
- Avoid bounce, elastic easing, spinning, bobbing, sticker-like effects, or cartoon feedback.
- Keep focus states visible and atmospheric.
- Preserve readable labels or accessible names.

## Final Self-Review

- Existing assets reused.
- Pointer and keyboard users can trigger the interaction.
- Hover, focus, active, and reduced-motion states exist.
- Motion feels restrained and archive-specific.
- No generic icon/button substitution.
- Relevant route or transition test run if navigation behavior changed.
