# AGENTS.md

## Project Context

SiNE Archives is an existing deployed Astro website. Treat it as production-adjacent even when working locally. Avoid large rewrites unless the user explicitly asks for them.

Use npm for project commands because this repository has `package-lock.json`.

## Safety Rules

- Prefer small, reversible changes.
- Before editing, explain which files you plan to change and why.
- Do not install new packages unless the user explicitly approves the exact package name.
- Do not change deployment, Cloudflare, DNS, environment variables, or secrets unless the user explicitly asks.
- Never deploy automatically.
- Do not edit generated output folders or build artifacts, including `dist/`, `.astro/`, `node_modules/`, `test-results/`, and similar generated files.
- Do not rewrite routing, layouts, or shared systems unless the user clearly asks for that scope.

## Astro Structure

- Preserve Astro routing and component structure.
- Routes live in `src/pages/`.
- Shared layouts live in `src/layouts/`.
- Reusable UI lives in `src/components/`.
- Content collections live in `src/content/`.
- Shared scripts and helpers live in `src/scripts/` and `src/utils/`.
- Static public assets live in `public/`.

## Styling

- Always read `DESIGN_SYSTEM.md` before making visual, layout, CSS, animation, typography, spacing, color, or component changes.
- Treat `DESIGN_SYSTEM.md` as the main source of truth for visual decisions.
- If a requested design change conflicts with `DESIGN_SYSTEM.md`, explain the conflict before editing.
- Prefer matching the existing CSS/style system instead of introducing a new one.
- Prefer improving the existing design system instead of inventing a new one.
- Use the existing plain CSS and Astro component styles.
- Shared styles live in `src/styles/`, especially `global.css`, `transition-system.css`, `cards.css`, and `archive-refs.css`.
- Use existing CSS custom properties and design tokens before adding new colors or layout patterns.
- Do not install packages, UI libraries, animation libraries, icon libraries, CSS frameworks, Tailwind, CSS modules, or another styling framework unless explicitly approved.

## Content And Canon

- Treat `The Archive/` as canon source material.
- Do not invent lore.
- Preserve existing slugs, frontmatter, routes, anchors, collection names, and locale structure unless the user asks for a change.
- Prefer moving or reconciling existing material over deleting meaningful content.

## Local Checks

After changes, run the safest available local checks based on `package.json` scripts.

Common checks in this project:

- `npm run build` for the main site validation.
- `npm run check` for Astro checks.
- `npm run test:transitions` for transition smoke tests when navigation or transition behavior changes.

If a command fails, explain the failure in plain English before trying fixes. Do not hide failed checks.

## Deployment

- Do not deploy.
- Do not connect to Cloudflare.
- Do not change Cloudflare Pages, Workers, DNS, secrets, environment variables, or production settings unless explicitly asked.
- Deployment-related files such as `public/_headers`, `public/robots.txt`, `astro.config.mjs`, `package.json`, and `package-lock.json` require extra care and a clear reason before editing.
