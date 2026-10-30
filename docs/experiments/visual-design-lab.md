# SiNE Archives — Visual Design Lab

Updated 2026-10-29 (local time). This is the existing Astro + React experiment repurposed as a tool-neutral laboratory, with project-local Impeccable prepared for Codex. It requires Node/npm and a browser, not a design-service account. The record fixture remains non-canonical sample data; production design and content are unchanged.

## Branch, ownership and preserved work

- Repository: https://github.com/Saiken-Exsydra/sine-archives
- Branch: `experiment/visual-design-lab`. Its history retains the original experiment commit `69be92641a6171a49cdf231dd61f4f2bc29ccb80`, based on production commit `bdfc843b7967da7e1fb4cc22ebcd0f3de4976234`. No history is rewritten.
- Local managed checkout: `C:\Users\saike\.codex\worktrees\visual-design-lab\SiNE Archives REPO`. Transfer/retirement verification is recorded below.
- `main` deploys automatically through Cloudflare when pushed. Keep this experiment unmerged. No deployment, hosting, DNS, credentials, production navigation or production source changes are part of this cleanup.
- The original authoring checkout and its unrelated uncommitted content/media remain separate and untouched.
- Onlook was never installed or connected. There is no application, SDK, bridge, account or Onlook package to uninstall. Its obsolete naming, route and setup guidance have been replaced. Historical commits and local validation evidence are retained rather than rewritten or deleted.

Astro still owns routing, layouts, content collections and locale URLs; one React island owns the lab controls. Existing dependencies are retained exactly: Astro 5.18.1, React/React DOM 19.3.1, `@astrojs/react` 4.4.2, React type packages 19.3.0, TypeScript 5.9.3, Playwright 1.60.0 and Vite 6.4.2. No npm package, framework upgrade, Tailwind, Next.js or paid service is added by this cleanup. `package.json`, the lockfile, Astro configuration and TypeScript configuration remain unchanged from the previous experiment.

## Work surface and design guidance

| File | Role |
| --- | --- |
| `DESIGN.md` | Merged source-derived design record, canonical token frontmatter and eight sections, preserving the prior lab brief and deferring to `docs/design-system.md`. |
| `PRODUCT.md` | Confirmed product context using Impeccable product-schema 1. |
| `.impeccable/design.json` | Supported schemaVersion 2 metadata: shadows, motion, breakpoints and five previews extracted from existing components. |
| `.agents/skills/impeccable/` | Official compiled Codex skill 4.8.0, tracked without its platform engine binary. |
| `.codex/hooks.json` | Official portable PostToolUse/Stop commands, including Windows overrides; user trust required. |
| `.impeccable/config.json` | Hook enabled, plus supported `.mjs` detector extension; no suppressions. |
| `Setup-Visual-Design-Lab.cmd`, `Start-Visual-Design-Lab.cmd` | Pinned reproducible setup and quoted Windows development launcher. |
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
& .\Start-Visual-Design-Lab.cmd
```

Open http://127.0.0.1:4321/_lab/visual-design/ and use the existing language switch for Portuguese. Ctrl+C stops the server. The prepared checkout already has dependencies and Impeccable. In a fresh clone of this branch, run `Setup-Visual-Design-Lab.cmd` first; it runs `npm ci` if dependencies are absent and the pinned official Impeccable installer. The start launcher checks that port 4321 is free and refuses to silently create a second server. No environment file, API key, waitlist or design-service account is needed. Existing Google Fonts are loaded by the shared shell; offline/font-blocked captures can differ.

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

Open `.tmp/visual-design-lab/compare-baseline-spacing-01.html` in a local browser to see paired images. The helper captures 390px and 1440px views, default/selected/compact/expanded states, Portuguese, and unchanged home/dossier/Observatory reference routes. It gives cold development loads a bounded 30-second readiness wait, then verifies an actual React state change before screenshotting, preventing screenshot caret styles from racing hydration. It records browser exceptions/console errors and refuses to overwrite capture labels. Pick fresh labels for later rounds. Use `VISUAL_LAB_URL` only to point to another loopback HTTP port; capture does not target a public server.

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
| [Codex with Impeccable](https://github.com/pbakaus/impeccable) | The official project-local skill, context files, diagnostics, detector and Windows hook commands were verified as described below. | Codex discovers the skill; automatic dispatch awaits project/hook trust. No redesign or optional Live Mode session was run. It adds no app runtime dependency. |
| [v0 / React generators](https://v0.app/docs/faqs) | Request a self-contained React/TypeScript component and plain CSS, then adapt it into a fixture. | Review exports: remove Next-specific imports/server features, replace utility classes with scoped CSS/tokens, and use only approved installed dependencies. Generated code is input to implementation, not automatic compatibility. Do not replace the Astro app with an exported project. |
| [pen.dev](https://www.pen.dev/) | Use screenshots, available code exports or visual specifications as references for an agent to implement in this fixture. | Its canvas/import/MCP features do not establish a direct Astro round trip. Export formats and any connectors must be evaluated separately; none were connected here. |
| [Google Stitch](https://developers.googleblog.com/stitch-a-new-way-to-design-uis/) | Bring its exported frontend code or design images into a bounded fixture implementation. | Exported code needs review and adaptation to existing CSS, typography and Astro ownership. No automatic link to this site is configured. |
| [Figma / Dev Mode or MCP](https://developers.figma.com/docs/figma-mcp-server/) | Use frames, exported assets, measurements and design context to guide implementation in TSX/CSS. | Design context is distinct from the agent writing and testing source. No Figma plugin, MCP server, account access or synchronization is configured by this branch. |

Use the tools and accounts you already have. No subscription, paid request or proprietary design tool is necessary for the laboratory itself. The simplest path is an existing coding agent, local Astro server, browser and the committed screenshot helper.

## Impeccable installed for Codex

The official npm release is **4.8.0**, requiring Node >=18.19.0. This Windows worktree was verified with Node 22.23.2, npm 10.9.8 and Codex CLI `0.162.0-alpha.17.2`. The installer was actually run here:

```powershell
npx --yes impeccable@4.8.0 install --providers=codex --scope=project --yes
& ./.agents/skills/impeccable/scripts/impeccable.cmd hooks on
& ./.agents/skills/impeccable/scripts/impeccable.cmd doctor --json
```

This replaces the previous manual-copy setup. Skill version `4.8.0` and engine release `0.1.18` are different labels used by upstream, not a version mismatch. The compiled skill/references/Windows launcher/checksums/data are tracked under `.agents/skills/impeccable/`, and the upstream license is retained at `.impeccable/LICENSE`. Platform binaries, local hook consent, caches, sessions and reports are ignored. `package.json` and the lockfile are unchanged. No global skill, subscription or API key was added. The installer also does not install Cursor support in this setup.

The `init` and `document` commands are agent workflows, not claims that a terminal command generated prose automatically. Their installed playbooks were followed to create PRODUCT.md, merge the existing DESIGN.md with actual source and write the supported sidecar. Confirmed product purpose, archive/encyclopedia dual perspective, bilingual behavior, constraints and source ownership are recorded. Audience priority and the optional future mockup-first workflow default are deliberately undecided; neither is required to refine reading UI. Existing design guidance is retained and the original visual authority is unchanged.

Codex's actual read-only `skills/list` API returned Impeccable with `scope: repo`, `enabled: true`, the correct worktree path and no skill errors. Doctor returned `findings: []` with the rule registry available. The Windows setup script was rerun successfully, proving installation is reproducible without a site dependency.

Official references: [getting started](https://impeccable.style/tutorials/getting-started/), [hook setup](https://impeccable.style/docs/hooks/), [upstream source](https://github.com/pbakaus/impeccable), [Codex skill discovery](https://learn.chatgpt.com/docs/build-skills), [Codex hook trust](https://learn.chatgpt.com/docs/hooks).

### Required Codex approval before automatic feedback

1. Open **this exact folder** in Codex: `C:\Users\saike\.codex\worktrees\visual-design-lab\SiNE Archives REPO`. Accept the normal project-trust prompt if shown. The original authoring checkout is a separate, dirty workspace and is not the lab.
2. Open **Settings → Hooks**, or enter **`/hooks`** in a Codex CLI launched from this folder.
3. Review and trust Impeccable's **PostToolUse** and **Stop** definitions from this worktree's `.codex/hooks.json`. Changed definitions require review again. Do not disable trust checks or use a bypass option.
4. Start a new turn and type `$impeccable` (or select it from `/skills` in the CLI). Codex detects skills automatically; restart Codex only if it does not appear.

Impeccable reports its shared hook state as enabled. Both manifest command handlers were exercised directly with simulated Codex events, without modifying source. PostToolUse returned valid JSON feedback for TSX/CSS and an ordinary Astro path; TypeScript and JavaScript/module paths were recorded by the hook, with quiet success appropriate for non-UI code. `.astro`, `.css`, `.tsx`, `.ts` and `.js` are built in; `.mjs`, used by this repository, is added through the documented `detector.extensions` mechanism. Stop returned success. Commands use project-relative paths and Windows overrides and were verified in this folder containing spaces. They inspect source; they do not rewrite website components or start another server.

**Automatic Codex dispatch is not yet verified or operating in this session.** The read-only `hooks/list` API returned no loaded project hooks before the project's trust review. We did not modify persisted project/hook trust. Direct handler success and Impeccable's enabled flag are not evidence that Codex has approved or dispatched them. Approval is an unavoidable user action under Codex's trust model.

**Known upstream path limitation:** a simulated edit to `src/pages/[...lab]/visual-design.astro` was skipped by the handler even though an ordinary `.astro` path was scanned. The fixture's main TSX/CSS edit surface works. If the bracket-named route wrapper changes, run the explicit directory scan below; do not assume its edit hook ran. Shell-written changes may also fall outside the manifest's Edit/Write/apply_patch matcher. Use Codex's normal file-edit tools and inspect hook feedback.

```powershell
& ./.agents/skills/impeccable/scripts/impeccable.cmd hooks status
& ./.agents/skills/impeccable/scripts/impeccable.cmd doctor --json
npx --yes impeccable@4.8.0 detect src/ --json
```

Until approval, these manual scans provide the same mechanical detector. Hooks execute with the agent environment; the checksum-verifying launcher and user review are the controls, not a claim that the hook itself is sandboxed. Optional Impeccable Live Mode (browser injection and another helper server) is not enabled or tested: normal source editing, the Astro server, browser review and screenshots already work without changing production layouts or CSP.

## First session in Codex

Open the exact worktree folder above. Run `Start-Visual-Design-Lab.cmd` (or double-click it), then open **http://127.0.0.1:4321/_lab/visual-design/**. The Portuguese URL is **http://127.0.0.1:4321/pt-br/_lab/visual-design/**. Keep the terminal open; Ctrl+C stops the server. For the CLI alternative, run `codex` from this directory. No application settings were changed to repoint the original authoring project: opening this folder is the one workspace-selection step.

Use `$impeccable` for its contextual menu, or the explicit subcommands below. These are Codex prompts, not PowerShell commands.

**Example A — Design audit**

```text
$impeccable audit /_lab/visual-design/
Inspect the existing visual-design laboratory. Read PRODUCT.md, DESIGN.md, docs/design-system.md and the fixture source. Identify weaknesses in hierarchy, spacing, typography, responsiveness and design-system consistency. Do not modify anything yet. Present the most meaningful improvements first. Separate genuine accessibility issues from intentional archive conventions and existing detector warnings. Keep production outside this audit's edit scope.
```

**Example B — Visual refinement**

```text
$impeccable polish /_lab/visual-design/
Improve the laboratory's archive interface. Read PRODUCT.md, DESIGN.md, docs/design-system.md and src/components/experiments/visual-design/AGENTS.md. Preserve its existing content, functionality, English/Portuguese behavior and institutional aesthetic. Improve visual hierarchy, layout, typography and subtle motion only in ArchiveRecord.tsx and ArchiveRecord.css. Capture a baseline and candidate with scripts/visual-design-lab.mjs, inspect desktop and mobile sizes, fix detected issues within this scope and show what changed. Respect reduced motion and keyboard access. Run source/build/relevant tests and separate existing failures. Do not modify production components, canon, dependencies or deployment.
```

For a narrower task use `$impeccable typeset /_lab/visual-design/`, `$impeccable layout /_lab/visual-design/` or `$impeccable animate /_lab/visual-design/`, followed by the requested improvement and the same fixture-only scope. Read the rendered result at both sizes rather than accepting source edits alone. Retain native Astro ownership and the existing React island; artwork can be evaluated later using existing asset conventions.

Review the Git diff, screenshot comparison, keyboard/locale/interactive states and detector feedback before asking the agent to commit. Automatic feedback becomes available only after the hook approval above and an actual supported edit. To discard an uncommitted attempt, inspect `git diff` first, then restore **only the two fixture files** if their changes are all unwanted; do not reset the whole worktree. For a committed attempt, use `git revert <that-iteration-commit>` on this branch. Preserve unrelated work. See the capture commands and discard guidance elsewhere in this guide.

## Impeccable setup validation

- **Installation:** official pinned installer and Windows setup launcher passed; skill 4.8.0 and engine 0.1.18 launch. Codex discovers the enabled repository skill without errors. Final doctor has zero findings; hooks status is enabled with no ignored rules/files/values. Codex automatic hook approval/dispatch remains pending as described above.
- **No redesign:** website source, React integration, routes, CSS, content, translations, assets, runtime dependencies, lockfile and deployment remain unchanged by this setup. New files are local design tooling/context, metadata and launchers; `.gitignore` selectively tracks these while excluding machine state.
- **Source/build:** `npm run check` passed (142 files; zero errors, warnings or hints); `npm run build` passed (295 pages and content guards).
- **Browser regression:** all 8 lab tests passed in Chromium/WebKit on the freshly built preview (21.1 seconds). They cover 320/390/1440px, hydration, keyboard interactions, reduced-motion mode, locale switching and history return. Firefox and the full suite were not rerun; their existing failures below remain unresolved.
- **Detectors:** `npx impeccable@4.8.0 detect src/ --json` completed, exit 2: 9 primary findings and 880 advisories in unchanged source. The targeted TSX/CSS/Astro lab scan completed with **zero findings**, exit 0, after its existing typography was accurately documented. No detector rule was suppressed and no component was redesigned to clear warnings.
- **Rendered detector at 1440×1000:** 6 primary findings: two contrast issues and three undersized-text findings in existing shared logo/locale navigation, plus one heuristic eyebrow-label finding in the lab. At 390×844: 2 primary findings for existing 8px locale labels and one advisory for a single-word paragraph ending. Both URL scans completed with exit 2 (findings, not operational failure). The eyebrow/ruled-pane conventions are established archive patterns to review in context; contrast/small functional text deserves a separately scoped accessibility review.
- **Source finding context:** six accent-side-border warnings reflect existing archival rules; one rounded accent warning is in the bespoke Redactory desk. Two static broken-image reports point to initially empty modal images populated by their controllers. The advisories largely flag page-family typography/colors/radii beyond the deliberately bounded shared snapshot. They are a baseline for review, not proof of regressions or permission to homogenize the site.
- **Local evidence:** `.tmp/impeccable-setup/` contains doctor/discovery JSON, direct hook checks, detector results, source/build/test logs and capture logs; it is intentionally ignored. The first capture attempt encountered two Vite `504 Outdated Optimize Dep` requests while dev and build shared the dependency cache. The server was stopped, the build completed, and the launcher was used to start a fresh dev session before repeating captures. The repeated capture succeeded with 12 images and zero browser errors at `.tmp/visual-design-lab/captures/impeccable-ready/`. The comparison report is `.tmp/visual-design-lab/compare-final-development-impeccable-ready.html`. Ten images are byte-identical to the previous clean development capture; the Portuguese mobile image differs only in the persisted audio icon state, and the mobile Observatory reference differs in its variable background. Desktop/mobile and Portuguese lab images were visually inspected; no source or layout change was introduced.

## Validation and known failures

- Source check: passed, 142 files, zero errors/warnings/hints. Production build: passed, 295 pages, including all content/encoding/reference guards.
- Renamed lab suite: 8 passed in Chromium/WebKit; 4 Firefox cases failed at browser launch with the existing `spawn UNKNOWN` error. No lab assertions failed in engines that could launch.
- Chromium transition suite: 9/9 passed. Existing character-navigation suite: 4/4 passed across Chromium and WebKit.
- Desktop/mobile capture and comparison: 12 images captured with no browser exceptions or console errors. All six lab images are byte-identical before/after cleanup; five of six production references also match. The remaining image is the Observatory's variable background at 390px. Lab views were visually reviewed at 390 and 1440px; browser tests also cover 320px, keyboard controls, reduced motion, history return and locale switching.
- Old lab URL: HTTP 404. New lab routes build successfully, keep noindex metadata and do not appear in public search. The public search index contains no lab URLs.
- Package manifests/lockfile, Astro/TypeScript configuration, production layouts/styles, content and assets are unchanged. This cleanup does not rerun or claim a passing complete all-browser suite.
- Live development workflow at the final path: both locale URLs returned HTTP 200 with noindex metadata, 12 captures completed without browser errors, and the comparison report was generated. The initial five-second capture wait was too short on a cold dev load; the helper now allows a bounded 30 seconds. Evidence: `.tmp/visual-design-lab/captures/final-development/` and `.tmp/visual-design-lab/compare-pre-cleanup-verified-final-development.html`.
- Final neutral checkout: source check passed again with zero diagnostics, build passed again with 295 pages, and all 8 Chromium/WebKit lab cases passed again (31.2s). Firefox was not rerun after the move because its launch failure had already been confirmed in this cleanup. No new regression was found in the exercised cleanup surfaces.

The earlier experiment's full-suite result remains historical evidence: 102 passed, 58 failed, 5 unfinished at the 15-minute limit. That included 55 Firefox startup errors, three completed WebKit failures and incomplete transition coverage. The old WebKit TOC failure was reproduced on unchanged main; modal/Observatory failures passed on isolated reruns; a separate WebKit transition run passed seven and failed character-return and map-to-home navigation, consistent with existing repository notes. These are not reported as successes by this cleanup. No system-runtime repair or production navigation refactor is included.

Local historical logs/screenshots are preserved separately from new captures. They may contain retired names as historical evidence. The Git history also preserves the original experiment exactly. Active source, routes, selectors and setup use the neutral laboratory names.

## Retirement and transfer verification

- Replacement code commit `f098cac36bad7e71ec6193ad6c45ffd46269d439` was pushed and verified before any obsolete remote deletion. Git confirmed that original experiment commit `69be92641a6171a49cdf231dd61f4f2bc29ccb80` is its ancestor. This documentation follow-up remains on the same branch.
- The old local branch name was removed by renaming the existing branch, preserving history. Only `experiment/visual-design-lab` remains among local experimental branches.
- The old checkout had no uncommitted/untracked work, no unpushed commits relative to the replacement remote, and no ignored files left after transfer. Its ignored dependencies, generated caches/media, local Impeccable skill, screenshots and logs were transferred without overwriting destination files. An inventory found no unexpected ignored user files outside those transferred paths.
- Both initial and final GitHub checks found no pull request associated with the obsolete branch, so there was no discussion/status to migrate.
- The old Astro server was stopped. Two orphaned Playwright WebKit network workers from the earlier test run were verified by executable and old working directory and stopped to release Windows' lock on the emptied folder.
- The obsolete Git worktree was archived through Codex's managed operation and unregistered from Git. Its actual checkout directory `C:\Users\saike\.codex\worktrees\onlook-astro\SiNE Archives REPO` no longer exists. Recoverable Codex archive metadata is retained; it is not a second active checkout.
- After the replacement had rebuilt and passed its final lab checks, remote `experiment/onlook-astro` was deleted with a normal branch deletion. Its local ref is absent as well. No force-push or force-deletion was used.
- `git worktree list` shows the original authoring checkout and exactly one experimental checkout at `C:\Users\saike\.codex\worktrees\visual-design-lab\SiNE Archives REPO`, on `experiment/visual-design-lab`.
- Production `main` remains at `bdfc843b7967da7e1fb4cc22ebcd0f3de4976234`. The original author's branch and local content/media edits are preserved. No merge or production deployment was performed.
- Current evidence is under `.tmp/visual-design-lab/`; older evaluation evidence was preserved under `.tmp/previous-evaluation/`. The comparison report is `.tmp/visual-design-lab/compare-pre-cleanup-verified-neutral-lab.html`. These files and the optional local skill remain ignored and are not prerequisites for building a fresh clone.

## Keep or discard a design iteration

Review and commit only intended lab changes on `experiment/visual-design-lab`. Keep generated captures and optional local tooling ignored. A failed visual idea can be reverted with a targeted Git edit after preserving any wanted work. Do not reset the original authoring checkout, remove untracked media or push main. The lab is an experimental workspace; adopting an idea into production is a separate, explicit task.
