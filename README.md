# SiNE Archives

A bilingual, cinematic archive of characters, places, institutions, and systems from the SiNE setting. Built with Astro 5, TypeScript, plain CSS, and Markdown; dossiers, the atlas, Observatory, Redactory, and soundtrack player retain their own interfaces.

## Development

Use Node.js 22 LTS and npm with the committed lockfile. On a fresh checkout:

```sh
npm ci
npm run dev
```

`npm run preview` serves the most recent build; rebuild before browser tests. No command below deploys the site.

## Validation

```sh
npm run check
npm run build
npm run test:transitions
npm run test:characters
npm test
```

Build generates soundtrack metadata, checks locale partners and text encoding, validates archive references, then builds all routes. `npm test` runs the complete Playwright suite in Chromium, Firefox, and WebKit. Browser binaries must be installed for those engines (`npx playwright install` on a new test machine).

Individual integrity commands: `check:archive-refs`, `check:pt-br-fallbacks`, and `check:text-encoding`. `report:archive-refs` prints editorial candidates to stdout. `seed:pt-br-fallbacks`, `fix:text-encoding`, and `songs:update` write files: inspect their changes before committing.

## Repository

```text
src/
  pages/          Astro routes and localized wrappers
  layouts/        Document shell and page families
  components/     Shared UI; redactory/ and systems/ own bespoke experiences
  scripts/        Browser behavior and navigation lifecycle
  styles/         Global tokens, transitions, references, diagrams
  content/        English and pt-BR public entries
  assets/         Images processed by Astro
  data/           Editorial configuration and soundtrack catalog
  i18n/           Locale paths, collection fallback, interface copy
  utils/          Build/content helpers and route classification
The Archive/      Canon source; tracked character records feed codex routes
public/           Stable public assets and music
scripts/          Content and media maintenance tools
tests/            Browser regressions
docs/             Design, architecture, and content authoring
```

Start with [architecture](docs/architecture.md), the [design system](docs/design-system.md), and [content workflow](docs/content-workflow.md). [AGENTS.md](AGENTS.md) owns automated contributor instructions.

Lore is authored from `The Archive/`; preserve names, slugs, explicit anchors, frontmatter, and locale pairs. Public summaries and canonical dossiers have different disclosure boundaries. Most non-character Archive material is local reference material and intentionally excluded from this website's Git repository.
