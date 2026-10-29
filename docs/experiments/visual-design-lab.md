# SiNE Archives — Visual Design Lab

Updated 2026-10-29. This is the existing Astro + React experiment repurposed as a tool-neutral laboratory. It requires Node/npm and a browser, not a design-service account. The record fixture remains non-canonical sample data; production design and content are unchanged.

## Branch, ownership and preserved work

- Repository: https://github.com/Saiken-Exsydra/sine-archives
- Branch: `experiment/visual-design-lab`. Its history retains the original experiment commit `69be92641a6171a49cdf231dd61f4f2bc29ccb80`, based on production commit `bdfc843b7967da7e1fb4cc22ebcd0f3de4976234`. No history is rewritten.
- Intended local managed checkout: `C:\Users\saike\.codex\worktrees\visual-design-lab\SiNE Archives REPO`. The final transfer/retirement verification appears below.
- `main` deploys automatically through Cloudflare when pushed. Keep this experiment unmerged. No deployment, hosting, DNS, credentials, production navigation or production source changes are part of this cleanup.
- The original authoring checkout and its unrelated uncommitted content/media remain separate and untouched.
- Onlook was never installed or connected. There is no application, SDK, bridge, account or Onlook package to uninstall. Its obsolete naming, route and setup guidance have been replaced. Historical commits and local validation evidence are retained rather than rewritten or deleted.

Astro still owns routing, layouts, content collections and locale URLs; one React island owns the lab controls. Existing dependencies are retained exactly: Astro 5.18.1, React/React DOM 19.3.1, `@astrojs/react` 4.4.2, React type packages 19.3.0, TypeScript 5.9.3, Playwright 1.60.0 and Vite 6.4.2. No npm package, framework upgrade, Tailwind, Next.js or paid service is added by this cleanup. `package.json`, the lockfile, Astro configuration and TypeScript configuration remain unchanged from the previous experiment.

## Work surface and design guidance

| File | Role |
| --- | --- |
| `DESIGN.md` | Experimental brief summarizing typography, tokens, spacing, CSS, components, motion, assets, responsiveness and accessibility. It explicitly defers to `docs/design-system.md`. |
| `src/components/experiments/visual-design/AGENTS.md` | Bounds coding-agent edits to lab fixtures. |
| `src/components/experiments/visual-design/fixtures/ArchiveRecord.tsx` | Preserved bilingual record fixture, with generated accessible IDs so instances can be reused without duplicate IDs. |
| `src/components/experiments/visual-design/fixtures/ArchiveRecord.css` | Preserved styles under the neutral `.visual-lab-record` namespace. |
| `src/pages/[...lab]/visual-design.astro` | Existing MainLayout + hydrated React island at the new lab URLs. |
| `tests/visual-design-lab.spec.ts` | Renamed interaction, hydration, keyboard, responsive and locale/history tests. |
| `scripts/visual-design-lab.mjs` | Local screenshot capture and side-by-side HTML comparison using existing Playwright. |
| `docs/experiments/visual-design-lab.md` | This guide, supported workflows, evidence and cleanup record. |

English: `/_lab/visual-design/`. Portuguese: `/pt-br/_lab/visual-design/`. Both retain robots `noindex, nofollow, noarchive`; neither is linked from public navigation or content/search. They are development fixtures, not access-controlled private pages. Keep them out of production by keeping the branch unmerged. Astro ignores underscore-prefixed source directories, so the existing rest-parameter route emits the two explicit `_lab` paths.

The fixture exercises metadata, serif headings, body text, selected buttons, a density checkbox, expanded/hidden content, keyboard focus and locale changes. It supplies a reusable interface surface, not new lore. React handlers remain confined to the island; no global listeners, controllers or animations were added.

## Launch on Windows

In PowerShell, with Node.js 22 LTS, npm and Git available:

```powershell
Set-Location 'C:\Users\saike\.codex\worktrees\visual-design-lab\SiNE Archives REPO'
npm run dev -- --host 127.0.0.1 --port 4321
```

Open http://127.0.0.1:4321/_lab/visual-design/ and use the existing language switch for Portuguese. Ctrl+C stops the server. The prepared checkout already has dependencies. In a fresh clone of this branch, run `npm ci` first. No environment file, API key, waitlist or design-service account is needed. Existing Google Fonts are loaded by the shared shell; offline/font-blocked captures can differ.

## Immediate edit, inspect and compare workflow

1. Open this checkout in an available coding agent/editor. Read `AGENTS.md`, `DESIGN.md`, `docs/design-system.md`, the fixture and this guide.
2. Start the server as above. Open the local lab in a browser. Use the browser's layout tools, or the coding tool's browser support when available.
3. Before editing, open a second PowerShell terminal in this checkout and run:

```powershell
node scripts/visual-design-lab.mjs capture baseline
```

4. Ask for one concrete improvement inside the fixture, such as clearer metadata hierarchy or reading spacing. Inspect the rendered result at phone and desktop sizes; try keyboard controls and both locales.
5. Capture and compare:

```powershell
node scripts/visual-design-lab.mjs capture spacing-01
node scripts/visual-design-lab.mjs compare baseline spacing-01
```

Open `.tmp/visual-design-lab/compare-baseline-spacing-01.html` in a local browser to see paired images. The helper captures 390px and 1440px views, default/selected/compact/expanded states, Portuguese, and unchanged home/dossier/Observatory reference routes. It waits for an actual React state change before screenshotting, preventing screenshot caret styles from racing hydration. It records browser exceptions/console errors and refuses to overwrite capture labels. Pick fresh labels for later rounds. Use `VISUAL_LAB_URL` only to point to another loopback HTTP port; capture does not target a public server.

Review differences visually: matching hashes prove identical captured pixels, not good design. Differences can include image loading or animation timing. Check hierarchy, contrast, focus visibility, reading comfort, spacing, overflow and preserved reference pages. Outputs stay ignored under `.tmp/visual-design-lab/`, outside the public site.

6. Stop the dev server before production-preview tests, then validate and review the diff:

```powershell
npm run check
npm run build
npx playwright test tests/visual-design-lab.spec.ts
npm run test:transitions
npm run test:characters
git diff --check
git diff
```

Playwright's standard configuration starts the rebuilt preview on 127.0.0.1:4321. Stop other servers so it cannot reuse a stale build. On a fresh test machine, `npx playwright install` downloads the browser binaries already supported by the existing test dependency. Retain the experiment only after reviewing any failures; do not describe the full suite as passing unless it really does.

A useful agent request:

> Read AGENTS.md, DESIGN.md and docs/design-system.md. Improve only the archive-record fixture's reading hierarchy, preserving fonts, tokens, English/Portuguese copy and behavior. Capture a baseline and candidate with scripts/visual-design-lab.mjs, inspect desktop/mobile results and production references, and run the relevant checks. Keep all changes on this experimental branch; leave production components, content, dependencies and deployment alone.

## Different tools, different workflows

The local edit/build/browser workflow is tested here. The external tools below have not been connected to this repository or used for a design session in this cleanup. Product capabilities are documented separately from this lab's verified compatibility.

| Tool or input | Practical use in this Astro lab | Boundary |
| --- | --- | --- |
| [Cursor Agent / Design Mode](https://cursor.com/docs/agent/design-mode) | Open the checkout, read the brief, run the Astro server and ask the agent to edit fixture TSX/CSS. Its browser annotation workflow supplies visual context to code edits. | Source editing by an agent, not a native `.astro` visual parser. Browser/annotation availability depends on the installed Cursor version. No Cursor integration was installed or tested here. |
| [Claude Code with frontend-design](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) | A source-editing agent can inspect Astro/TSX/CSS, apply its design guidance and use the existing terminal/browser checks. | The optional design skill provides guidance, not an Astro migration or guaranteed browser connection. No Claude plugin or account was configured here. |
| [Codex with Impeccable](https://github.com/pbakaus/impeccable) | An optional local skill can guide critique and code edits against DESIGN.md. Its skill files and Windows launcher were smoke-tested as described below. | This is agent guidance plus optional tooling, not a required app dependency or a demonstrated full design session. |
| [v0 / React generators](https://v0.app/docs/faqs) | Request a self-contained React/TypeScript component and plain CSS, then adapt it into a fixture. | Review exports: remove Next-specific imports/server features, replace utility classes with scoped CSS/tokens, and use only approved installed dependencies. Generated code is input to implementation, not automatic compatibility. Do not replace the Astro app with an exported project. |
| [pen.dev](https://www.pen.dev/) | Use screenshots, available code exports or visual specifications as references for an agent to implement in this fixture. | Its canvas/import/MCP features do not establish a direct Astro round trip. Export formats and any connectors must be evaluated separately; none were connected here. |
| [Google Stitch](https://developers.googleblog.com/stitch-a-new-way-to-design-uis/) | Bring its exported frontend code or design images into a bounded fixture implementation. | Exported code needs review and adaptation to existing CSS, typography and Astro ownership. No automatic link to this site is configured. |
| [Figma / Dev Mode or MCP](https://developers.figma.com/docs/figma-mcp-server/) | Use frames, exported assets, measurements and design context to guide implementation in TSX/CSS. | Design context is distinct from the agent writing and testing source. No Figma plugin, MCP server, account access or synchronization is configured by this branch. |

Use the tools and accounts you already have. No subscription, paid request or proprietary design tool is necessary for the laboratory itself. The simplest path is an existing coding agent, local Astro server, browser and the committed screenshot helper.

## Optional Impeccable setup

A project-local manual copy of the official Codex skill is installed at `.agents/skills/impeccable/`, pinned to upstream commit `02523aec3e4c4580102d996d1b6a71fbe062e03f` (skill 4.8.0). The Windows launcher `impeccable.cmd --version` returned `4.8.0`. This verifies installation/launch, not an AI design session or browser Live Mode.

The skill is ignored local tooling and will be carried into the renamed worktree. No global coding-agent configuration, automatic hook, submodule, site dependency or subscription was added. Its launcher may keep a verified engine cache in the user's normal Impeccable cache directory. Reload the coding tool; the installed skill is available on the next turn after discovery. For a first use, ask for a critique limited to the fixture, keeping this brief and the existing design authority. Do not let optional tool defaults redesign production or overwrite established guidance.

For another clean clone, the [official manual-copy workflow](https://github.com/pbakaus/impeccable#installation) can be reproduced without adding an npm package:

```powershell
git clone --filter=blob:none --no-checkout https://github.com/pbakaus/impeccable.git .tmp/impeccable-source
git -C .tmp/impeccable-source checkout 02523aec3e4c4580102d996d1b6a71fbe062e03f
if (Test-Path '.agents/skills/impeccable') { throw 'Review the existing skill; do not overwrite it.' }
New-Item -ItemType Directory -Force .agents/skills | Out-Null
Copy-Item -LiteralPath .tmp/impeccable-source/.agents/skills/impeccable -Destination .agents/skills/impeccable -Recurse
& ./.agents/skills/impeccable/scripts/impeccable.cmd --version
```

Reload the agent afterward. This manual method deliberately skips automatic hooks. The upstream installer is an alternative if hooks are later wanted; review its changes separately rather than modifying this site's package manifest. The skill can be omitted entirely: DESIGN.md, source editing and screenshot comparison remain useful.

## Validation and known failures

- Source check: passed, 142 files, zero errors/warnings/hints. Production build: passed, 295 pages, including all content/encoding/reference guards.
- Renamed lab suite: 8 passed in Chromium/WebKit; 4 Firefox cases failed at browser launch with the existing `spawn UNKNOWN` error. No lab assertions failed in engines that could launch.
- Chromium transition suite: 9/9 passed. Existing character-navigation suite: 4/4 passed across Chromium and WebKit.
- Desktop/mobile capture and comparison: 12 images captured with no browser exceptions or console errors. All six lab images are byte-identical before/after cleanup; five of six production references also match. The remaining image is the Observatory's variable background at 390px. Lab views were visually reviewed at 390 and 1440px; browser tests also cover 320px, keyboard controls, reduced motion, history return and locale switching.
- Old lab URL: HTTP 404. New lab routes build successfully, keep noindex metadata and do not appear in public search. The public search index contains no lab URLs.
- Package manifests/lockfile, Astro/TypeScript configuration, production layouts/styles, content and assets are unchanged. This cleanup does not rerun or claim a passing complete all-browser suite.
- Final-path rebuild and transfer verification will be recorded after the replacement checkout is ready.

The earlier experiment's full-suite result remains historical evidence: 102 passed, 58 failed, 5 unfinished at the 15-minute limit. That included 55 Firefox startup errors, three completed WebKit failures and incomplete transition coverage. The old WebKit TOC failure was reproduced on unchanged main; modal/Observatory failures passed on isolated reruns; a separate WebKit transition run passed seven and failed character-return and map-to-home navigation, consistent with existing repository notes. These are not reported as successes by this cleanup. No system-runtime repair or production navigation refactor is included.

Local historical logs/screenshots are preserved separately from new captures. They may contain retired names as historical evidence. The Git history also preserves the original experiment exactly. Active source, routes, selectors and setup use the neutral laboratory names.

## Retirement and transfer verification

The replacement branch will be pushed and its retained history verified before retiring the old remote and checkout. Final verification is recorded in the follow-up handoff commit.

## Keep or discard a design iteration

Review and commit only intended lab changes on `experiment/visual-design-lab`. Keep generated captures and optional local tooling ignored. A failed visual idea can be reverted with a targeted Git edit after preserving any wanted work. Do not reset the original authoring checkout, remove untracked media or push main. The lab is an experimental workspace; adopting an idea into production is a separate, explicit task.
