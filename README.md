# SiNE Archives — React Reconstruction

This branch is the foundation of a **new SiNE Archives website**: a gradual reconstruction of the existing archive, built primarily with React.

The intention is for this website to **eventually replace the current website on `main`**. That transition is a long-term direction, **not an immediate migration or deployment plan**. For now, `main` remains the established website and the reference for its existing public experience. Development here can proceed incrementally, with room to experiment, rebuild, and validate individual parts before any replacement is considered.

## Direction

- **Reconstruct, rather than immediately port, the website.** Existing content and functionality can inform the redesign without requiring a one-to-one technical migration.
- **Use React as the primary interface technology.** The implementation may evolve as the new site develops.
- **Migrate gradually.** Pages, systems, navigation, and presentation can be rebuilt in stages instead of moving everything at once.
- **Keep the two websites distinct for now.** Work on this branch is not a signal that `main` should be retired, replaced, or deployed differently.
- **Preserve the archive's substance.** Website reconstruction does not itself authorize changes to established lore or canonical source material.

There is currently **no fixed launch date, cutover schedule, or commitment to merge this branch into `main`**. The eventual replacement should happen only after the reconstructed website is ready and an explicit transition decision is made.

## Current starting point: React Systems

This branch began as the **React Systems experiment**. Its present experience lets visitors explore Redactory, Divination, and Bloom in English or Brazilian Portuguese. Select Redactory and then **Examine the Anchor** to follow the first concept.

Systems is the first part of the full-site reconstruction.

## Source material

The [Google Drive source folder](https://drive.google.com/drive/folders/1FE6HmV2ajz02Or79rc95Nyd-A8wmICrN) is a source of truth for the text used in the reconstructed site. As a design develops, bring in the passages it needs. An extract can live in Markdown, structured data, or directly in a React component, whichever suits the interface.

## Run locally

On Windows, double-click **Start-React-Systems.cmd** and leave its window open. The launcher installs dependencies on first use. It opens http://localhost:5174/#/systems in your default browser when Vite is ready.

From a terminal with Node.js 22 and npm, run:

```sh
npm ci
npm run dev
```

Edit components, navigation, and styles in `src/`. The six Markdown records in `src/content/` and three illustrations in `src/art/` supply the current experience. The full existing website lives on `main`.

Run `npm run build` to type-check and build. Run `npx playwright install chromium` once for browser tests, then `npm test` after building. Tests use a separate local port.

## Branch relationship

- **`main`** — current SiNE Archives website; continues independently during reconstruction.
- **`experiment/react-systems`** — React successor website under active, incremental development.

This README describes the intended role of the branch, not an assertion that the migration has already occurred.
