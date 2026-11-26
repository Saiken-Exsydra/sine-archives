# SiNE Archives — React Reconstruction

This branch is the foundation of a **new SiNE Archives website**: a gradual reconstruction of the existing archive, built primarily with React.

The intention is for this website to **eventually replace the current website on `main`**. That transition is a long-term direction, **not an immediate migration or deployment plan**. For now, `main` remains the established website and the reference for its existing public experience. Development here can proceed incrementally, with room to experiment, rebuild, and validate individual parts before any replacement is considered.

## Direction

The [Imperial Obsidian design philosophy](DESIGN_PHILOSOPHY.md) governs visual and interaction decisions for the React reconstruction. Apply it incrementally as each part of the site is developed.

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

The [Google Drive source folder](https://drive.google.com/drive/folders/1FE6HmV2ajz02Or79rc95Nyd-A8wmICrN) is a source of truth for the text used in the reconstructed site. As a design develops, bring in the passages it needs. An extract can live in Markdown, structured data, or directly in a React component, whichever suits the interface.

## Run locally

On Windows, double-click **Start-React-Systems.cmd** and leave its window open. The launcher installs dependencies on first use. It opens http://localhost:5174/#/ in your default browser when Vite is ready.

For visual review, open the [development replay](http://localhost:5174/?replay=1#/) in Zen Browser. Wait for the emblem, then move the pointer. A completed visit is remembered on refresh. The replay link resets that visit, and the browser’s reduced-motion preference still takes precedence.

From a terminal with Node.js 22 and npm, run:

```sh
npm ci
npm run dev
```

Edit components, navigation, and styles in `src/`. The six Markdown records in `src/content/` supply the Systems study. Runtime artwork lives in `src/art/`. The full existing website lives on `main`.

Run `npm run build` to type-check and build. Run `npx playwright install chromium` once for browser tests, then `npm test` after building. Tests use a separate local port.

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

The global stylesheet uses pearl for primary type, platinum for supporting text, ivory for primary actions and aqua for keyboard focus. The three Systems reading accents reuse ivory, lilac and aqua as interface cues. These assignments carry no lore meaning.

House Wonderwall’s structured specification, CSS palette and design brief reside under `Design Systems/House Wonderwall/`. They prescribe pearl dominance, restrained refraction and an Obsidian display field (`#101115`). The site borrows this field for legibility. The approved corporate SVGs retain their own optical gradients. The House’s interwoven quill and hidden W belong to Wonderwall material.

The Characters exhibition uses the bilingual records in `src/grand-index/characters.ts`. Each supplies its artwork, portrait, focal position and four reading sections. The editorial selection defaults to Le'nore. Hisui's chronology follows the [current dossier](https://drive.google.com/file/d/1tYgkDrXlvJ4OU_mV1h0Adq_H-kWNY9e-/view). Link to a record and section with a route such as `#/characters/hisui-kirasagi/abilities`.

## Registry of Individuals

Examination keeps one individual’s hero and four reading sections in view. The bottom control opens discovery. [IndividualRegistry](src/grand-index/IndividualRegistry.tsx) owns the fullscreen dialog, native horizontal track, focus and finite directional controls. [Registry styles](src/grand-index/registry.css) construct the stationary ceiling light, obsidian wall, floor and titanium frames. A short collection centers itself. On narrower screens, swipe, use a trackpad, wheel over the track, or use the directional controls. Left, Right, Home and End move keyboard focus between portraits. The modal isolates the underlying interface and dismissal returns focus to the opener.

To exhibit an individual, add a complete bilingual public record to [characters.ts](src/grand-index/characters.ts) with a stable ID and approved portrait and hero asset IDs. The gallery follows record order. Frames measure `min(72vw, 38dvh, 420px)` wide and maintain a 2:3 aspect ratio. At viewport heights of 440px or less, the height-based width limit drops to 29dvh to clear the heading and controls. A beveled outer frame surrounds a recessed 2:3 image. The separate satin placard aligns with the frame and carries the published designation when vertical space permits. Portraits use centered cover cropping. Set optional `portraitFocal` for an individual composition. The separate `focal` and `mobileFocal` values apply to the hero.

Portraits mount on opening and use browser-managed lazy loading. The [64-record test](tests/registry-collection.spec.ts) exercises a finite collection at a nested static deployment base. All links stay in the DOM for keyboard navigation. Rendering cost therefore grows with the collection. Reassess with representative assets if the published catalogue grows substantially. See the [motion score](MOTION_ARCHITECTURE.md#characters-exhibition) for timing, history and image handoff.
