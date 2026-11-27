# SiNE Archives — React Reconstruction

This branch is the foundation of a **new SiNE Archives website**: a gradual reconstruction of the existing archive, built primarily with React.

The intention is for this website to **eventually replace the current website on `main`**. That transition is a long-term direction, **not an immediate migration or deployment plan**. For now, `main` remains the established website and the reference for its existing public experience. Development here can proceed incrementally, with room to experiment, rebuild, and validate individual parts before any replacement is considered.

## Direction

The [Imperial Obsidian design philosophy](DESIGN_PHILOSOPHY.md) governs visual and interaction decisions for the React reconstruction. The [Pearl Spectrum guide](DESIGN_PHILOSOPHY.md#pearl-spectrum-in-practice) records the four implemented surfaces and how to apply their principles in future interface work. The Grand Index Systems exhibition is part of Phase IV. Phase V was cancelled, and development of the dedicated Systems pages is deferred.

- **Reconstruct, rather than immediately port, the website.** Existing content and functionality can inform the redesign without requiring a one-to-one technical migration.
- **Use React as the primary interface technology.** The implementation may evolve as the new site develops.
- **Migrate gradually.** Pages, systems, navigation, and presentation can be rebuilt in stages instead of moving everything at once.
- **Keep the two websites distinct for now.** Work on this branch is not a signal that `main` should be retired, replaced, or deployed differently.
- **Preserve the archive's substance.** Website reconstruction does not itself authorize changes to established lore or canonical source material.

There is currently **no fixed launch date, cutover schedule, or commitment to merge this branch into `main`**. The eventual replacement should happen only after the reconstructed website is ready and an explicit transition decision is made.

## Current React experience

This branch began as the **React Systems experiment**. Its present experience lets visitors explore Redactory, Divination, and Bloom in English or Brazilian Portuguese. Select Redactory and then **Examine the Anchor** to follow the first concept.

Visitors enter through Obsidian Awakening. A single ripple crosses the obsidian from the central emblem, followed by the wordmark, navigation and Index link. The Grand Index opens below the entrance with Characters at its center, Systems to the left and History to the right.

## Source material

The private Dy’Aspora Archive contains the canonical dossiers and governing sources. The [Redactory Academy Experience Lab](https://drive.google.com/drive/folders/1FE6HmV2ajz02Or79rc95Nyd-A8wmICrN) contains reference copies. The [character publication guide](CHARACTER_PUBLICATION.md) covers editorial review, approved editions, local Archive configuration and recovery. The site runs from the checked-in publication files.

## Run locally

On Windows, double-click **Start-React-Systems.cmd** and leave the first server window open. The launcher installs dependencies on first use and opens SiNE Archives in Zen when available. Starting it again reuses the running server for this checkout. The launcher reports a port conflict if another application owns port 5174.

Use `http://localhost:5174` for all local review. Interface, motion and checked-in publication edits update through Vite. [Staged character editions](CHARACTER_PUBLICATION.md#validation-and-preview) open under `/__review/` on the same server. Reload that tab after staging a revision.

For visual review, open the [development replay](http://localhost:5174/?replay=1#/) in Zen Browser. Wait for the emblem, then move the pointer. A completed visit is remembered on refresh. The replay link resets that visit, and the browser’s reduced-motion preference still takes precedence.

From a terminal with Node.js 22.18 or later and npm, run:

```sh
npm ci
npm run dev
```

Edit components, navigation, and styles in `src/`. The six System Markdown records in `src/content/en/` and `src/content/pt-br/` supply the Systems study. Character editions live in `src/content/characters/`. Bundled artwork lives in `src/art/` and responsive publication derivatives in `public/media/`. The full existing website lives on `main`.

Run `npm run build` to type-check and build. Run `npx playwright install chromium` once for browser tests, then `npm test` after building. Playwright loads the build directly into Chromium without opening a listening port.

## Local workspace

The [SiNE Asset Pipeline](ASSET_PIPELINE.md) manages approved responsive imagery. Its [React delivery guide](ASSET_PIPELINE.md#react-delivery) covers ordinary illustrations, responsive slots, Motion environments, and preparing artwork for an imminent selection. A fresh clone includes the public derivatives needed to run and build the site.

The two sibling folders are separate clones of `Saiken-Exsydra/sine-archives`. Open **React-Systems** to work on the successor.

| Folder | Branch | Role |
| --- | --- | --- |
| `React-Systems/` | `experiment/react-systems` | Implement the React site in `src/` and validate its behavior in `tests/`. |
| `../SiNE Archives REPO/` | `main` is the reference branch | Consult the Astro routes in `src/pages/`, localized records in `src/content/`, and illustrations in `src/assets/uploads/` and `public/uploads/`. |

The Astro checkout can have another branch active. To read the Systems page as committed on its local `main` branch, run this from the React folder in PowerShell. Both checkouts stay on their current branches.

```powershell
$archiveGit = (Resolve-Path '../SiNE Archives REPO/.git').Path
git --git-dir="$archiveGit" show main:src/pages/systems/index.astro
```

The [Redactory asset inventory](Redactory%20Asset%20Production/Planning/Asset%20Inventory.md) and [production roadmap](Redactory%20Asset%20Production/Planning/SiNE_Redactory_Asset_Production_Roadmap.md) support the Experience Lab. The inventory links to local reference artwork in the sibling checkout. The React app keeps its own runtime illustrations in `src/art/`.

## Archive index and visual identity

The root URL and `#/` open Obsidian Awakening. Move the pointer, touch the surface, or scroll to awaken the Circular Emblem. Keyboard navigation and reduced motion give immediate access. Select **Index** or **Índice** to reach the Grand Index. Hover at an edge to see the adjacent domain. Select its name, swipe horizontally, or use the arrow keys within the index to move across. Follow a domain link to open its reading page.

`#archive-index` opens the exhibition directly. The ordered registry in `src/grand-index/domains.ts` pairs each independent showcase with its reading route. `#/systems` retains all three system records. `#/characters` expands the featured record in place and `#/history` opens two entries in the imperial chronology. The character summary follows the public Le’nore record. Classification and dates follow the [current dossier](https://drive.google.com/file/d/17Z3xRUi6Q8EOQuxfunQM7CXM2DTmXJDH/view) and [Timeline](https://drive.google.com/file/d/1BAVfjlo4wEWzo_htMq8sIX7kK9jwA92J/view).

The [motion architecture](MOTION_ARCHITECTURE.md) documents the shared React motion system, the material renderer and the development replay URL. Keep the central seal, serif record titles, original illustrations and approved full-color marks when extending the index.

| SVG paint inventory | Exact sRGB values |
| --- | --- |
| Both corporate marks, shared with the named Pearl Spectrum | Pearl White `#F8F7F4`, Soft Ivory `#F5E9D0`, Pale Platinum `#CDD2DE`, Opaline Lilac `#E2CBEF`, Ice Aqua `#BDEEF0` |
| Additional values in both marks | `#C2EFF0`, `#DDE0E6`, `#E3CEEF`, `#F6ECD6`, `#F6EFDE` |
| Additional principal lockup values | `#E0F3F2`, `#EEE3F2`, `#F1E9F2`, `#F3F6F4`, `#F5F2F3`, `#F7F3E8`, `#F8F6F0` |

Primary type and character names use Pearl White. Pale Platinum supports labels and Ice Aqua marks keyboard focus. The character examination uses a shared, white-led five-stop spectrum for disclosure edges, tab reflections and selected pieces of interactive lettering. The Registry extends the reflection into portrait lettering and the lower glass bevel. Systems reading cues use ivory, lilac and aqua to distinguish their subjects. These cues carry no lore meaning. [Digital palette](src/styles.css) · [Character interaction replay](MOTION_ARCHITECTURE.md#individual-examination)

House Wonderwall’s structured specification, CSS palette and design brief reside under `Design Systems/House Wonderwall/`. They prescribe pearl dominance, restrained refraction and an Obsidian display field (`#101115`). The site borrows this field for legibility. The approved corporate SVGs retain their own optical gradients. The House’s interwoven quill and hidden W belong to Wonderwall material.

The Characters exhibition discovers bilingual records in `src/content/characters/`. Each supplies its artwork, portrait, focal position and four reading sections. Le’nore is the featured record. Link to a record and section with a route such as `#/characters/hisui-kirasagi/abilities`.

The Complete Dossier opens in place from the link below the examination tabs. Both interfaces open the English edition, and the Portuguese reader labels the document “Texto em inglês”. Follow the generated contents or scroll the document. Close Dossier restores the section that opened it. To update an edition after an Archive change, use the [dossier refresh workflow](CHARACTER_PUBLICATION.md#refreshing-a-complete-dossier-from-the-archive).

## Registry of Individuals

Examination keeps one individual's hero and four reading sections in view. The bottom control raises the [Registry dialog](src/grand-index/IndividualRegistry.tsx) over the same hero. The [smoked glass surface](src/grand-index/registry.css) keeps the artwork visible and gives the grid its own vertical scroll. The centered return control stays visible while browsing. Use the arrow keys to move by column or row and Home and End to reach either end of the collection. Tab follows the published order. The modal isolates the underlying interface and dismissal returns focus to the opener. Reopening the same record restores the browsing position. Opening from a different record brings that subject into view.

To exhibit an individual, start with [Adding a character](CHARACTER_PUBLICATION.md#adding-a-character). The agent prepares the bilingual record, provides one local review link and handles the Git steps when authorized. The grid follows the records' editorial order and wraps into two to six columns. Short rows center without stretching the cards. Each obsidian-glass card has a thin edge, a 2:3 portrait and an integrated caption that centers the full name in Pearl White at rest. The localized designation provides the link's accessible description when present. The full Pearl Spectrum catches the name and lower glass on hover, keyboard focus and pending selection, the current record carries a short pearlescent seam, and Ice Aqua outlines keyboard focus. Portraits use centered cover cropping. Set optional `portraitFocal` for an individual composition. The separate `focal` and `mobileFocal` values apply to the hero.

Portraits mount on opening and use browser-managed lazy loading. The [64-record test](tests/registry-collection.spec.ts) exercises a finite collection at a nested static deployment base. All links stay in the DOM for keyboard navigation. Rendering cost therefore grows with the collection. Reassess with representative assets if the published catalogue grows substantially. See the [motion score](MOTION_ARCHITECTURE.md#characters-exhibition) for timing, history and image handoff.
