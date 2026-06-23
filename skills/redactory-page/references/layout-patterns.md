# Layout Patterns

Use these patterns before inventing new page architecture.

## MainLayout Pages

Use `src/layouts/MainLayout.astro` for ordinary pages with normal navigation, footer, music player, locale switch, search, and fullscreen controls.

Good fits:

- section indexes.
- entry details.
- search.
- soundtracks.
- normal systems/cosmology/organization pages.

## SiteShell Direct Pages

Use `src/layouts/SiteShell.astro` directly only for application-like or full-screen pages that need custom navigation or special behavior.

Existing examples:

- `src/pages/characters/index.astro`
- `src/layouts/CharacterEntryLayout.astro`

## Redactory Pages

Use `src/components/redactory/*` before creating new primitives:

- `RedactoryGateway.astro`
- `RedactoryDesk.astro`
- `DiveScroll.astro`
- `IndexTheorem.astro`
- `RedactorProfile.astro`
- `DeskHotspot.astro`
- `LorePanel.astro`

Page routes live under `src/pages/systems/redactory/` and localized mirrors under `src/pages/[locale]/systems/redactory/`.

## Observatory And Systems

Use `src/components/systems/*` for observatory-like pages:

- map/sphere/node layout.
- destination panels.
- active system panel.
- route-aware system transitions.

## Lore And Registry Structure

Prefer:

- dossier rail plus main reading pane.
- registry header plus filter/search controls.
- editorial spread with image pane and metadata pane.
- document fragments, file fields, addenda, warning strips, and related entries.

Avoid treating lore pages like blog posts or generic docs.
