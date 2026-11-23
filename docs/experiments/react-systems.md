# React Systems rewrite

This branch starts a new website experience in standalone React, TypeScript,
plain CSS, and GSAP. Astro is not part of the new site's routing or runtime.
Vite 6.4.2 is reused from the existing lockfile; no packages or versions were added.
The existing Sharp dependency generates bounded WebP artwork before dev/build;
the original PNGs remain intact. Generated files are ignored, reproducible output.

`main` remains the existing live Astro website. This experiment is not merged
or deployed. Hosting, DNS, secrets, headers, and production settings are unchanged.

## Run locally

Use Node 22 and npm:

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5174/`. The first slice supports:

- `/#/systems` — three persistent system portals.
- `/#/systems/redactory` — Redactory overview and Anchor entrance.
- `/#/systems/redactory/anchor` — Anchor definition and Depth/Reach distinctions.
- `/#/systems/divination` and `/#/systems/bloom` — existing public introductions.
- `/?lang=pt-br#/systems` — Portuguese, preserving the route when switching language.

Hash routes are intentional at this stage: reloads and browser Back/Forward work
on an ordinary static server without changing production redirects. The address
scheme can be revisited when the new site's deployment is explicitly authorized.

## Ownership

| File | Responsibility |
| --- | --- |
| `react-site/src/main.tsx` | React shell, portal composition, focused reading states, GSAP/Flip lifecycle. |
| `react-site/src/navigation.ts` | URL parsing and React subscription to native browser history. |
| `react-site/src/content.ts` | Existing English/Portuguese public Markdown and artwork adapters. |
| `react-site/src/styles.css` | Standalone presentation using the established archive palette and typography. |
| `react-site/vite.config.ts` | Standalone build; excludes the old public media tree. |
| `scripts/react-site.mjs` | New dev/build/preview entry point. |
| `react-site/tests/systems.spec.ts` | History, deep links, focus, locale, motion, and responsive regressions. |

Canonical excerpts are read from the checked-in public Markdown, not copied into
React or generated from private dossiers. Redactory's Anchor definition and its
three measures are taken verbatim; the adapter fails if those source paragraphs
cannot be found. No worldbuilding is changed by this experiment.

The legacy Astro application stays in `src/` as source for gradual migration.
Its old scripts are available as `legacy:dev`, `legacy:check`, `legacy:build`,
`legacy:preview`, and `legacy:test`. Read the production architecture/design
documents when touching those files. This branch changes the default commands;
do not merge it to production as a housekeeping change.

## Validation

```sh
npm run check
npm run build
npm run test:react
```

The production React build goes to ignored `dist-react/`; preview runs at
`http://127.0.0.1:4174`. The test server always serves a prior production build.
The browser suite uses standard Playwright fixtures. On Windows it can reuse an
official Firefox build placed in the existing ignored project browser cache when
the host's AppData copy cannot launch; the cache path is tied to the locked revision.
Inspect desktop/mobile composition and keyboard/reduced-motion behavior before
extending the experience. Do not claim the legacy Astro suite covers this app.

The experimental commit uses `[CF-Pages-Skip]` to suppress Cloudflare Pages
deployment without changing hosting configuration. Keep that prefix on future
experimental commits until preview hosting is explicitly authorized.

### Verification on 23 November 2026

- TypeScript check and production build passed. The JavaScript bundle is about
  389 kB (131 kB gzip); the three generated illustrations total about 208 kB.
- Content checks passed: locale partners, text encoding, and archive references.
- The final Chromium run passed all six tests in 19.3 seconds, including settled
  portal geometry at 320, 390, 768, 1440, and 1920 px. Desktop and mobile captures
  were inspected after the transitions completed.
- Firefox is blocked by this session's Windows environment: the normal binary
  exits with access denied; an official local copy reaches startup but fails on
  `nsIWindowsRegKey.create`. No registry/security settings were changed.
- WebKit passed the six interaction assertions in the preceding cross-browser
  runs, but worker shutdown could not complete reliably in this environment.
  The legacy cleanup helper also requires unavailable CIM access. The full
  three-browser suite is therefore not reported as green.

On this sandbox host, Playwright's default AppData location is redirected. Local
verification explicitly selected the already-installed official browser cache.
Chromium was run against an explicitly owned preview process to avoid the host's
shell-process shutdown problem. These are verification limitations, not suppressed
test failures or changes to the site's runtime.

## Next migration boundary

Develop the Systems navigation and Redactory concepts here first. Divination and
Bloom currently expose their existing introductions; their deeper experiences,
the Academy, search, dossiers, map, audio, and the rest of the archive are future
work. Preserve content files and assets until their consumers have been migrated.
