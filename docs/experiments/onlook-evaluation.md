# Onlook evaluation for SiNE Archives

Evaluated on 2026-10-29. This branch prepares a working Astro/React test surface. **Onlook itself has not been installed, connected or used to make an edit.** Windows availability blocks that part of the evaluation.

## Isolation and architecture

- Repository: https://github.com/Saiken-Exsydra/sine-archives
- Branch: `experiment/onlook-astro`, based on fetched `origin/main` at `bdfc843b7967da7e1fb4cc22ebcd0f3de4976234`. The branch did not exist locally or remotely when created.
- Work was performed in a separate Git worktree. The original checkout, its uncommitted canon/public-content changes and untracked authoring ZIP were preserved.
- The owner confirmed that pushing `main` automatically deploys through Cloudflare. No GitHub workflow is required. Public HTTP response headers also identify Cloudflare. Cloudflare dashboard branch/build settings were not inspected; no deployment settings were changed. No merge, main push or deployment command was performed.
- Astro 5.18.1 builds static pages. TypeScript 5.9.3, npm 10.9.8 and Node 22.23.2 were used. The baseline lockfile includes Vite 6.4.2, Playwright 1.60.0, GSAP 3.15.0, Mermaid 11.16.0, fast-glob 3.3.3, music-metadata 11.12.3 and node-id3 0.2.9. All existing direct dependency versions remain unchanged.
- Astro owns `src/pages/`, content collections, bilingual route wrappers and layouts. `SiteShell.astro` owns fonts, global tokens, ClientRouter and lifecycle bootstrap. `MainLayout.astro` adds navigation, locale switching, music, search and footer. Character dossiers/codices have dedicated layouts. Markdown and `The Archive/Characters/` supply public and canonical reading views.
- Plain CSS is the established styling system: scoped Astro styles and `src/styles/global.css`, `transition-system.css`, `observatory.css`, diagram/reference styles. Cormorant Garamond and DM Sans, dark surfaces, crimson active states and gold metadata are reused. No React or Tailwind was installed in the baseline. Neither Next.js nor Tailwind is added here.
- Existing interactive features remain native Astro/TypeScript: `SystemsObservatoryPage.astro`, `src/scripts/observatory/{controller,motion,archive-field}.ts`, its GSAP/Canvas/SVG relationships and comparisons; `SystemInterfaceScaffold.astro` for Harmonics/Resonance; `src/components/redactory/` for the desk, dive, Redactor and Index Theorem. These are deliberate feature boundaries, not candidates for automatic conversion.
- Build generates soundtrack metadata/covers, checks locale partners, encoding and archive references, then emits static routes and optimized images. Generated files are not edited or committed.

## Changes

The owner explicitly approved these five package names before installation:

| Package | Installed version | Purpose |
| --- | --- | --- |
| `@astrojs/react` | 4.4.2 | Official React renderer and hydration integration, compatible major 4 for Astro 5 |
| `react` | 19.3.1 | Lab island runtime |
| `react-dom` | 19.3.1 | Lab server rendering and client hydration |
| `@types/react` | 19.3.0 | TypeScript React types, development only |
| `@types/react-dom` | 19.3.0 | TypeScript DOM types, development only |

Exact new versions are pinned in `package.json` and resolved in `package-lock.json`. New transitive dependencies are those resolved by npm for the approved integration. Existing direct packages and Vite 6.4.2 are retained. The React integration adds Babel tooling; npm updates the shared transitive Babel parser/types/string-parser/identifier-validator to compatible 7.29.x versions and hoists/deduplicates tooling entries. Those changes are visible in the lockfile. No permanent overrides or unrelated direct upgrades are added.

| File | Purpose |
| --- | --- |
| `package.json`, `package-lock.json` | Approved integration/runtime/type packages |
| `astro.config.mjs` | Import the official integration and add `react()`; preserve all Markdown, prefetch, shim and toolbar configuration |
| `tsconfig.json` | `jsx: react-jsx` and `jsxImportSource: react`; retain Astro strict settings |
| `src/components/experiments/onlook/ArchiveRecord.tsx` | One SSR + hydrated React/TypeScript record fixture; overview/review states, density control and disclosure, with English and Portuguese UI |
| `src/components/experiments/onlook/ArchiveRecord.css` | Plain CSS scoped by `.onlook-record`, existing tokens/fonts, responsive columns, visible keyboard focus; no new motion |
| `src/pages/[...lab]/onlook.astro` | Explicit static lab URLs with existing MainLayout, `client:load`, and robots `noindex, nofollow, noarchive` |
| `tests/onlook-lab.spec.ts` | Hydration, keyboard interaction, selected/expanded states, overflow, history return and locale-switch checks |
| `docs/experiments/onlook-evaluation.md` | Findings, setup, validation, limitations and disposal |

Astro excludes underscore-prefixed source directories. The rest-parameter route emits only `/_lab/onlook/` and `/pt-br/_lab/onlook/`; simply adding `src/pages/_lab/` would silently omit the page. No link is added to public navigation, content collections or search. The page is not access-controlled: noindex and an unlisted URL are discovery controls, not privacy. It would be included in a build of this experiment branch, which must stay out of production.

The fixture is explicitly non-canonical interface sample data. It does not adapt or duplicate a dossier. React owns only its island and event handlers; it adds no global listeners, timers or observers. Astro still owns routing and the shared lifecycle. The React client bundle is referenced only on lab routes.

## Official Onlook findings

The sources describe multiple generations of Onlook. They should not be treated as one interchangeable distribution.

| Question | Documented evidence | Assessment for this experiment |
| --- | --- | --- |
| Can current Onlook open Astro? | The [React product page](https://www.onlook.com/for/react) explicitly advertises Astro with React, TypeScript and vanilla CSS. The [current quickstart](https://docs.onlook.com/start/quickstart-codebase) describes choosing a local codebase folder and running the app in a canvas. | Documented product claim for Astro + React; not verified by executing Onlook here. |
| Can it visually edit native `.astro` files? | The React page discusses React components. The [current docs](https://docs.onlook.com/start/welcome) describe agent edits to a working app, but do not establish a native `.astro` parser, element-to-source mapping, scoped-style round trip or drag-and-drop support. | Unknown. Rendering an Astro page, an agent editing text, and visual edits round-tripping to `.astro` are different capabilities. No native Astro visual-editing claim is made here. |
| Must the site use Next.js/Tailwind? | The current React product page lists several frameworks/styling systems. The [public repository README](https://github.com/onlook-dev/onlook#readme) describes the earlier Next.js + Tailwind browser editor, with non-Next.js/non-Tailwind support still unchecked. | No documented requirement to migrate for the new product; the earlier browser editor is a poor fit. Do not install Tailwind or migrate to Next.js to satisfy the old editor. |
| Which release is available? | The public repository's [latest release endpoint](https://github.com/onlook-dev/onlook/releases/latest) resolves to [v0.2.32](https://github.com/onlook-dev/onlook/releases/tag/v0.2.32). [Developer docs](https://docs.onlook.com/developers) distinguish that public project from the current Mac app. | v0.2.32 is a public repository tag, not evidence of the current Mac binary version. A current desktop version number was not established. |
| Is Windows supported now? | The [current installation guide](https://docs.onlook.com/start/install) requires Apple silicon and directs Windows/Linux/Intel users to waitlists. The [download page](https://www.onlook.com/download) also waitlists Windows, but advertises an Intel download, conflicting with the guide. | Windows is blocked in both sources. macOS/Intel details are inconsistent; use the stricter install guide until clarified. No Windows installer was downloaded or obsolete desktop build substituted. |
| Can it be self-hosted for free? | [Running locally](https://docs.onlook.com/developers/running-locally) says current desktop source/build instructions are forthcoming. The developer page says earlier browser-editor guides have been retired. Current install/quickstart requires Onlook sign-in and an existing supported AI account. | No documented supported current Windows/self-hosted route established. The editor is described as free; AI provider usage/plan requirements still apply. No Onlook or AI-provider accounts, keys, subscriptions, paid resources or billable AI requests were created. |

**Theoretical compatibility:** a React island creates a focused TSX surface under Astro, with real tokens and plain CSS. If Onlook can load the Astro server and map that island to its source, it could evaluate typography, spacing and component state without migrating content/layouts. Cross-boundary edits to Astro wrappers and scoped CSS remain uncertain.

**Actually verified:** see validation below for local Astro SSR/hydration, browser behavior and builds. Nothing in those checks establishes Onlook compatibility. There is no Onlook SDK, instrumentation plugin, copied configuration or editor bridge in this branch.

## Run locally on Windows

Use Git, Node.js 22 LTS and npm, matching the repository's README. The safest independent checkout avoids touching an existing dirty clone:

```powershell
git clone --single-branch --branch experiment/onlook-astro https://github.com/Saiken-Exsydra/sine-archives.git sine-archives-onlook
Set-Location sine-archives-onlook
npm ci
npm run dev -- --host 127.0.0.1 --port 4321
```

Open http://127.0.0.1:4321/_lab/onlook/ (Portuguese: http://127.0.0.1:4321/pt-br/_lab/onlook/). Ordinary archive routes remain available. Stop the server with Ctrl+C. No environment file, key or Onlook account is required for this local fixture. The shared shell loads existing Google Fonts, so font availability can affect screenshots when offline.

For the already prepared managed worktree, open a PowerShell terminal in:

```text
C:\Users\saike\.codex\worktrees\onlook-astro\SiNE Archives REPO
```

Run the same npm commands there. Do not switch the original dirty checkout just to view the experiment.

Validation on a fresh machine:

```powershell
npm run check
npm run build
npx playwright install
npx playwright test tests/onlook-lab.spec.ts
npm run test:transitions
npm run test:characters
npm test
```

Playwright downloads browser binaries, not project packages. Its configuration starts `npm run preview` on 127.0.0.1:4321; stop any dev/preview server first so tests cannot silently reuse the wrong build. Rebuild after source changes. The first build processes hundreds of image variants and can take several minutes.

## Connect a compatible Onlook editor later

1. Recheck the official install guide and Windows availability. There is no supported Windows setup to perform today; joining the waitlist is optional and was not done here.
2. Install the current supported editor on a supported machine, sign in to Onlook and connect an existing eligible AI account only if its usage terms/costs are acceptable. GitHub access is needed for sharing changes. No credentials belong in this repository.
3. Use a disposable clean copy. **Check the base branch before editing:** [Onlook troubleshooting](https://docs.onlook.com/help/troubleshooting) says it copies the remote main branch. Merely opening a checkout that has this experiment selected may therefore omit the lab. Do not change the repository's default branch or merge this experiment into main to work around that.
4. If the editor cannot select this experiment as its base, ask its agent to fast-forward its own new nonproduction branch from `origin/experiment/onlook-astro` before installing/running, then verify that the lab files and this document exist. If it cannot preserve the experimental base, stop: branch selection is an additional unresolved integration requirement. Never accept a main push or deployment prompt.
5. Use `npm ci` and `npm run dev -- --host 127.0.0.1 --port 4321` in the editor's isolated copy. Navigate its canvas to `/_lab/onlook/`. The route, not the homepage, contains the React fixture. Use the existing npm lockfile; reject unrelated upgrades/migrations.
6. First test a small spacing or heading-size change scoped to `ArchiveRecord.tsx` / `ArchiveRecord.css`. Check the actual diff, reload from disk, test mobile/keyboard/reduced motion, and repeat check/build. Confirm whether a visual selection edits TSX, CSS or merely produces an agent request. Then separately evaluate native `.astro` editing on another disposable fixture if needed.
7. Record the editor version, OS, command, base commit, files modified and whether the visual edit survives reload. Only that would justify marking Onlook editing as verified. Keep all resulting changes on experimental branches for review.

## Validation results

- Baseline `npm run check`: passed, 138 files, zero errors/warnings/hints. Baseline `npm run build`: passed, 293 pages; all content guards passed.
- Experiment clean `npm ci`: passed. `npm run check`: passed, 141 files, zero errors/warnings/hints. Final `npm run build`: passed, 295 pages (293 existing + English/Portuguese lab); all content guards passed.
- Focused lab suite: 8 passed across Chromium/WebKit; all 4 Firefox cases were unable to launch. Each supported engine passed 320/390/1440px interaction tests and history/locale switching. Tests await hydration, exercise Enter/Space, pressed/expanded/compact states, check overflow and record console errors; no lab console errors occurred in passing cases.
- Firefox diagnosis: the installed Playwright Firefox executable fails even with `--version`. Windows reports its side-by-side configuration is incorrect; Playwright reports `browserType.launch: spawn UNKNOWN`. This occurs before a page loads and is an environment/runtime limitation. Browser binaries exist. No system runtimes or security settings were changed to bypass it.
- Full `npm test -- --reporter=dot`: **102 passed, 58 failed, 5 did not run**, with the configured 15-minute suite limit reached and a teardown timeout. Chromium passed all 55 cases. All 55 Firefox cases failed before page launch due to the system runtime issue. Three completed WebKit cases failed (TOC, modal navigation, Observatory history); five final WebKit transition cases were incomplete when the run stopped. This is not an all-browser green result. Separate follow-up coverage is recorded below; it does not turn this into a single passing full-suite run.
- Unchanged-main comparison: a second clean worktree at `bdfc843` installed its original lockfile and built all 293 pages successfully. The WebKit test `one TOC follows the active scroll root in document and pane modes` reproduced the same missing `is-active` assertion at `character-detail-responsive.spec.ts:155` on main. It is pre-existing and was not changed here.
- `npm run test:transitions -- --project=webkit`: completed separately, **7 passed / 2 failed** in 2.2 minutes, covering the cases left incomplete by the global timeout. Character-dossier return and section-index map-to-home navigation fail; these same two WebKit behaviors are already documented in [the existing Observatory validation notes](../observatory.md). They were not fixed as part of the isolated lab. The TOC failure was directly reproduced on unchanged main; these transition failures were compared with the existing recorded baseline, not separately rerun on main in this evaluation.
- The broad run also showed intermittent WebKit failures in `navigation from an open modal releases the background and controller` and `relationships travel across systems and full interfaces remain reachable`. Both passed on unchanged main and both passed when rerun on the experiment (2/2, 22.9s). Their first-run failures remain part of the reported suite result; no production navigation patch was made to conceal them.
- Before/after Chromium captures at 390 and 1440px cover home, Ella's dossier, English/Portuguese Observatory and soundtracks: all ten return HTTP 200 and neither pass records a page exception. Seven screenshots are byte-identical, including all five phone captures and desktop home/dossier. The remaining desktop differences affect 0.14% (English Observatory), 0.30% (Portuguese Observatory) and 0.45% (soundtracks) of pixels. Visual review shows Observatory path-render timing and lazy-loading soundtrack covers, with no visible layout/typography change; screenshots are not a universal pixel-regression guarantee.
- Desktop/mobile lab screenshots were reviewed. The responsive metadata/reading columns, existing typography/tokens and visible focus remain readable. New lab UI has no animation; tests use reduced motion. Existing reduced-motion coverage runs in the regression suite.
- Existing audio smoke check: player opens, source request returns HTTP 206, decoded audio becomes ready, explicit play advances playback and pause stops it. This checks browser behavior, not audible output on physical speakers.
- Built home, dossier and Observatory HTML contain no React islands or lab markup. No public navigation/content files were changed. Authored content and media remain outside the patch.
- The disposable comparison worktree was archived after its evidence was copied to `.tmp/onlook/main-comparison/`. Local evidence stays uncommitted under `.tmp/onlook/`: baseline/experiment logs, `before/`, `after/`, `visual-comparison.json` and the first lab run's artifacts in `lab-first-results/`. Standard Playwright artifacts are in `test-results/` and are disposable. Screenshots cover representative routes and states, not every archive article.

## Limitations and recommendation

Windows editor access, current desktop source availability, experiment-base selection and native Astro visual round-tripping remain unresolved. Firefox execution is blocked by the local Windows runtime, and the existing/intermittent WebKit failures above prevent claiming a fully green regression suite. No proprietary Onlook account or application was available for an actual editor session. The older public browser editor is not a supported substitute for this plain-CSS Astro site.

For SiNE Archives today, keep the Astro structure and use this branch only for investigation. The React fixture is small, but it adds an integration and a client runtime to the lab. Onlook may be worthwhile if a compatible Windows release can edit this island reliably and respect the project's CSS and branch boundaries. It is not yet demonstrated to improve the native Astro pages that make up most of the site.

An Astro-native workflow is currently less disruptive: edit existing Astro/scoped CSS against the design-system authority, inspect the running site with browser layout tools and use the existing Playwright viewport/regression suite. That retains the current architecture and avoids introducing React into production just to accommodate a visual editor.

## Discard safely

Production contains none of this branch's changes. Stop local servers and leave the experiment unmerged; no production rollback is required. Preserve any new experiment work before deleting anything. A managed worktree should be archived through Codex's worktree controls, which keep a recoverable snapshot. A standalone clone may simply remain unused until reviewed.

After archiving/removing its attached worktree, a clean local experiment branch can be deleted from another checkout using `git branch -d experiment/onlook-astro`. Git will normally refuse because the experiment is unmerged; review and back up its commit before using `git branch -D experiment/onlook-astro`. Only if explicitly discarding the remote branch too, use `git push origin --delete experiment/onlook-astro`. Never delete or reset main, and never run cleanup against the original checkout or local authoring media. These disposal commands are instructions only; they were not executed.
