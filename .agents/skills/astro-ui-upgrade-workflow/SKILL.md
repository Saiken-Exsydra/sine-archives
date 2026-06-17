---
name: astro-ui-upgrade-workflow
description: Project-specific workflow for visual improvements, layout improvements, CSS cleanup, animation improvements, responsive fixes, and interface polish on the SiNE Archives Astro website.
---

# Astro UI Upgrade Workflow

Use this skill when the user asks for visual improvements, layout improvements, CSS cleanup, animation improvements, responsive fixes, or interface polish on this Astro website.

## Required Reading

Before making any visual decision or edit:

1. Read `AGENTS.md`.
2. Read `DESIGN_SYSTEM.md`.
3. Inspect the relevant Astro page, component, layout, script, and CSS files.

Do not rely on memory alone when the current source files are available.

## Design Context First

Before editing:

1. Identify the current design pattern already used by the page or component.
2. Note which shared system owns the behavior or styling, such as:
   - `src/layouts/SiteShell.astro`
   - `src/layouts/MainLayout.astro`
   - `src/styles/global.css`
   - `src/styles/transition-system.css`
   - component-scoped `<style>` blocks
3. Explain which files you plan to change and why.
4. Propose a small visual plan before editing.

If the request conflicts with `DESIGN_SYSTEM.md`, explain the conflict before editing.

## Implementation Rules

- Make small, reversible changes.
- Prefer the existing Astro component and routing structure.
- Prefer the existing CSS architecture.
- Avoid introducing a new CSS framework.
- Avoid adding dependencies.
- Do not install packages unless the user explicitly approves the exact package name.
- Preserve semantic HTML.
- Preserve existing routes, slugs, anchors, collection structure, and locale structure unless the user explicitly asks otherwise.
- Use existing CSS custom properties and design tokens before adding new ones.
- Avoid `transition: all`.
- Prefer animating `transform` and `opacity` where appropriate.
- Respect `prefers-reduced-motion`.
- Keep motion purposeful and consistent with `src/styles/transition-system.css`.
- Do not scatter route-level View Transition rules across page files when `transition-system.css` should own them.

## Accessibility Checks

For interactive elements:

- Use `<button>` for actions and `<a href>` for navigation.
- Ensure keyboard access exists for every pointer interaction.
- Ensure focus states are visible.
- Keep accessible names clear, especially for icon-only controls.
- Keep ARIA state in sync when using `aria-expanded`, `aria-selected`, `aria-current`, or related attributes.
- Avoid adding ARIA where native HTML already provides the correct semantics.

## Responsive Checks

Before finishing:

- Check mobile layout assumptions.
- Confirm text does not overlap or overflow its container.
- Confirm fixed, sticky, fullscreen, or panel layouts account for `--nav-height` where relevant.
- Confirm controls remain usable on narrow screens.

## Verification

After editing, run the safest relevant local checks from `package.json` when practical:

- `npm run build` for broad site validation.
- `npm run check` when Astro typing/schema changes are involved.
- `npm run test:transitions` when navigation, transitions, or page lifecycle behavior changes.

If a command fails, explain the failure in plain English before attempting fixes.

## Final Summary

After editing, summarize visual changes in plain English:

- What changed visually.
- Which files changed.
- Which checks ran and whether they passed.
- Any remaining risks or follow-up work.
