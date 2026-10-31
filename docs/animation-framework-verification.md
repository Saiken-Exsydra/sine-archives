# Animation framework implementation and verification

Date: 2026-10-30. Branch: `codex/animation-framework-audit`. Base commit: `195948763c4e8f7d930611d20c6b585ca3177193`, with the preserved working-tree changes described below.

Status: implementation integrated and assessed at **18/20**, with two explicit completion gates open. **The 20/20 target is not awarded.** The original [12/20 audit](animation-framework-audit.md) remains the historical baseline. The [implementation workflow](animation-implementation-workflow.md) defines the completion gates. Firefox launch and Windows WebKit shutdown are now recovered with clean verification evidence below.

**Follow-up correction:** the earlier verification missed a Home index regression reported by the user. The repair and expanded checks are recorded below. Earlier green checks and hero captures did not establish that the index text painted; the assessment remains provisional.

## Implementation integrity

The implementation preserves Astro navigation, page-family ownership, the Archive's editorial identity, both locales, and canonical content. No package, lockfile, deployment configuration, secret, or infrastructure setting changed. The initial Observatory/navigation work was retained; its original patch and overlapping file fingerprints were captured under `.impeccable/animation-implementation-baseline/` before implementation.

The shared motion helper owns cancellable local work and activity policy, not navigation. `transition-lifecycle.ts` remains the only Astro event owner. Route CSS stays in `transition-system.css`. Hidden overlays and panels receive deliberate focus and inert states. The Systems addendums overlay now reuses the existing modal controller.

## Delivered behavior

| Area | Implemented behavior |
| --- | --- |
| Shared motion | 140/220/320/450ms local roles; 280ms routine access; live reduced motion; page-owned timers/frames; visibility/inert-gated CSS loops, including loops started later by playback |
| Home | One finite 760ms artwork/mark exposure; visible copy; interaction settles it; repeat visits skip it; scroll cue ends after two cycles |
| Characters | Immediate text, selection, URL, and destination; decoded 450ms artwork dissolve; bounded fine-pointer depth; explicit manual/playback controls; keyboard-accessible artwork restore; cancel-safe touch selection and native horizontal filmstrip scroll |
| Dossier | Manual-first media; named play/pause and next controls; focus/hidden/reduced activity policy; TOC follows the active document/pane scroll root |
| Redactory | Immediate Astro navigation; finite ink/paper feedback; named-object continuity without a full-page reading snapshot; static wash gradients; bounded existing ink canvas |
| Reading indexes | Organizations/Cosmology copy stays visible without enhancement; rule/artwork emphasis replaces text staging; ordinary record links retain no-script navigation |
| Search | No stale debounce URL writes; immediate tool access without a full-screen circle/snapshot; local result feedback; initial five artwork cards plus two reusable inert patterns; later cards mount on demand; all normal record rows remain server-rendered, with stable offscreen layout reservation |
| Places / Atlas | Native region buttons, inert concealed content, deliberate focus return, no-script record navigation, composed record exposure, direct reduced geographic focus, closed search/dossier controls outside keyboard order |
| Observatory / instruments | Short interruptible entrance; static ambient field during reading focus; activity-gated orbit; connector geometry read before SVG writes; relationship path sampled before travel |
| Shared reading / playback | Stable card headings, focus-equivalent feedback, bounded/dismissible reference previews, readable text/placeholder/accent roles, playback signals tied to actual playback; accessible main headings for cinematic indexes; explicit keyboard focus for fields, active filters, SiNE panels and Systems actions |

## Finding ledger

| Finding | Resolution | Evidence |
| --- | --- | --- |
| F1 delayed Redactory redirect | Removed both delayed redirect owners; Astro navigates immediately; superseded swaps preserve pending stylesheet preloads and keep their own intent | Latest-destination regression includes four throttled samples; separate 12-sample stress probe improved from 5/12 to 12/12 successful latest destinations |
| F2 hidden record copy | Default-visible content and native links; optional visual registration only | No-script Organizations/Cosmology checks; character/Places fallback links |
| F3 closed Atlas focus | Initial inert panel, expanded state, remembered opener, Escape/close focus return | Closed/open/close keyboard regression |
| F4 reduced-motion gaps | Page alternatives plus live preference subscriptions; intended state retained | Motion regression matrix and existing reduced Observatory/route suites |
| F5 uncontrolled galleries | Manual-first galleries, explicit playback, persistent pause, live reduced behavior | Default/manual/play/pause regression with a controlled browser clock |
| F6 delayed repeated actions | Character state and destination commit synchronously; routine Search access shortened | Immediate-selection regression and interaction measurements |
| F7 repeated copy choreography | Removed repeated text staging and Places record stagger | Source review, no-script checks, rendered comparison |
| F8 inactive ambient work | One shared CSS activity observer; page-owned JS activity; Observatory field quiets behind reading | Offscreen/resume regression; existing repeated-entry canvas checks |
| F9 unowned delayed work | Abort-owned timers/frames, Search debounce cancellation, canceled resize work | Search teardown/latest-navigation tests; source lifecycle review |
| F10 WebKit return failures | Native Windows WebKit snapshot crash isolated; narrow Astro fallback selected before router startup | Normal and static-CSS native contexts crash; fallback context passes; focused return/navigation assertions pass; clean runner/cross-engine release gate remains open |

## Environment and reproduction

- Windows host; production preview owned by this task at `http://127.0.0.1:4330`. Existing servers on other ports were preserved.
- Locked Playwright 1.60 toolchain: Chromium 148.0.7778.96 (revision 1223), WebKit 26.4 (2287), Firefox 150.0.2 (1522).
- `PLAYWRIGHT_PORT` is an optional test-only port override; the repository default remains 4321.
- Desktop measurement: 1440 × 1080, normal motion, CPU rate 1. Constrained mobile: 390 × 844, mobile/touch emulation, CPU rate 4. These are laboratory profiles, not physical-device or field Core Web Vitals evidence.
- The Windows WebKit platform remains `Win32` even when its test user agent says Mac Safari. The compatibility guard uses the platform plus engine identity; Apple WebKit and Chromium retain native transitions. A legacy-platform deprecation hint is intentional and isolated here.
- The initial Firefox stable/Beta probes failed in Windows SideBySide assembly loading (`mozglue`), before website execution. Reinstalling the official runtimes did not fix the AppData location. A later follow-up recovered Firefox by using an unchanged project-local copy; see the recovery record below. The original failure logs remain historical evidence, not the current launch result.

Commands used for the final source and browser checks:

```powershell
npm run check
npm run build
$env:PLAYWRIGHT_PORT='4330'
npm test -- --project=chromium --reporter=line,json
npx playwright test tests/transition-smoke.spec.ts tests/character-navigation.spec.ts tests/motion-framework.spec.ts --project=webkit --reporter=line,json
npx playwright test tests/transition-smoke.spec.ts --project=firefox --grep 'home to search first' --reporter=line
git diff --check
```

The complete Chromium run includes every transition and character regression, plus 12 new motion tests. WebKit's focused run includes both required feature suites and the new motion suite. Earlier focused runs used an ignored local configuration with the same tests and only a preview-port override. Production builds run all existing content, translation, encoding, and cross-reference guards. Separate output directories prevent concurrent runners from replacing one another's evidence.

### Recorded results

| Check | Result | Local evidence |
| --- | --- | --- |
| Source validation | 145 files; 0 errors, 0 warnings, 1 intentional legacy-platform hint | `.impeccable/animation-final-check.log` |
| Production build | 295 pages in 22.34s; completed 2026-10-30 at 16:57:53 local; content, encoding, translation and reference guards pass | `.impeccable/animation-final-build.log` |
| Complete Chromium suite | 74/74 passed; clean command exit | `.impeccable/release-chromium.json` |
| WebKit navigation/character/motion | 22 passed, 1 deliberately skipped Chromium-only touch case; no failed application assertions; two worker-exit timeouts make the command exit 1 | `.impeccable/verified-webkit.json` |
| Final responsive WebKit matrix | 5/5 viewport cases passed, including main headings across 24 routes per width; two worker-exit timeouts make the command exit 1 | `.impeccable/release-webkit-layout.json` |
| Final Search integration | Chromium and WebKit both pass; clean command exit | `.impeccable/release-search.json` |
| Initial Firefox launch probe | Browser failed before website execution; subsequently recovered in the follow-up | `.impeccable/verified-firefox.log` |
| Rendered contrast | 86 samples, no threshold failures | `animation-final-contrast.json` in the evidence directory |
| Semantics | 50 route/width samples; exposed names, alt presence, headings and overflow pass | `.impeccable/semantics-lab.json` |
| Patch whitespace | Pass | `git diff --check` |

The full Chromium suite and WebKit viewport matrix precede only the final default portrait focal-position correction. That CSS-only correction is rebuilt, visually inspected and covered by the final two-engine Search integration check. Performance measurements precede the focal-position correction; it changes the crop, not layout or lifecycle. The initial integrated full WebKit suite also passed 73 application cases with one intentional skip, while suffering the same worker-exit failure; it is retained as earlier coverage rather than mislabeled as the final source build.

Build identity is the branch/base above plus the working source recorded in `.impeccable/final-build-inputs.json`, whose SHA-256 is `A760CAFF56B9D8C7D08DF5EDCA15C3D9E2645EFA7AB107783BC9116F53D9F9C6`. The test/config manifest `.impeccable/final-test-inputs.json` has SHA-256 `0924E22794EF784B99C88C7331188950F3AFF7B621472F7FCF23462A57034627`. These manifests fingerprint code/config inputs; unchanged canonical media/content and generated output are not reclassified as authored source changes.

The Impeccable hook remains enabled. The reviewed detector output contains 871 token/style advisories and one warning: the quill's curved ink trace uses a 4px geometric border, a false positive for a thick card accent. Local family scales, accent materials and actual map geometry are intentional. Five thick reading-side accents and initially empty image sources were repaired. Findings were not suppressed wholesale, and a detector count was not used as a substitute for the score.

## Measurements and rendered review

Evidence lives at `C:/Users/saike/.codex/visualizations/2026/10/30/01a18af0-0595-7ba2-9164-5ba7003e213b/`. This local evidence is retained separately from generated test output.

- `animation-before-optimization-lab.json`: initial integrated motion measurements, three samples per interaction/profile.
- `animation-middle-optimization-lab.json`: connector batching and first rendering refinements.
- `animation-template-lab.json`: complete interaction matrix before the final Search rendering refinements.
- `animation-card-pattern-lab.json`: two reusable card patterns; confirms that the payload reduction alone did not remove the layout bottleneck.
- `animation-final-lab.json`: complete interaction matrix after heading/focus refinement, before the final observer batching and mobile Search media adjustment.
- `animation-final-activity-lab.json`: Search and Observatory after batched element-scoped animation discovery.
- `animation-final-search-lab.json`: final Search-only measurements after the bounded mobile image/text ordering change.
- `animation-final-contrast.json`: conservative pixel-backdrop samples of representative visible text, with text hidden only in the measurement capture. Text ranges are clipped to visible element bounds; decorative watermarks are excluded. This supplements rendered inspection and does not establish full WCAG conformance.
- `animation-final-*.png`: desktop/mobile Home, Characters, Places, and Observatory views.
- `animation-final-search-390.png` and `animation-final-search-1440.png`: final Search identity/art ordering and portrait focal-position review.

Initial desktop Search frame-gap p95 was about 116–117ms; removing the full-stage snapshot brought desktop Search/Redactory into the approximately 17–33ms range. Removing connector read/write interleaving reduced representative Observatory layout events from about 332–354 to 104–112 on desktop, and from 264–311 to 93–94 in the constrained profile.

Search's generated English HTML decreased from 1,678,015 to about 1,206,000 bytes (uncompressed, approximately 28%) by replacing per-record artwork templates with two patterns. All 84 records remain represented by native links. A trace then identified full-document layout as the remaining bottleneck: 2,293 layout objects and a 208ms layout in the four-times-throttled mobile profile. Offscreen row containment reduced that trace to 451 layout objects and a 118ms initial layout. Element-scoped, frame-batched animation discovery subsequently removed repeated document scans on loading-indicator starts. The final mobile Search samples have about 33–50ms frame-gap p95, with startup long tasks of 223/130/124ms. Final desktop Search samples have no recorded long tasks and a worst p95 of about 33ms. Performance does not earn 4/4 while the constrained startup cost remains. These are laboratory observations, not a universal 60fps guarantee.

The final rendered contrast pass sampled 86 text/placeholder roles at 390 and 1440px, with no failures at their applicable 4.5:1 or 3:1 thresholds. A separate Chromium accessibility-tree/document probe checked 25 routes at both widths: no unnamed exposed controls, images missing an `alt` attribute, document overflow, or missing main heading after the final semantic fixes. Decorative empty alternatives are intentional; an `alt`-presence check alone does not prove description quality. Small inline links were reviewed with their context and spacing; inaccessible/inert or deferred descendants are excluded from target-size conclusions. Focus candidates were inspected in source and rendered state, including indicators drawn on descendants and pseudo-elements that the simple probe cannot recognize.

Chromium CDP synthesized touch changed character selection, recovered from a canceled swipe, and moved the native filmstrip by about 194px. No physical touch device was available. Representative route-family regression covers 320, 390, 768, 1440, and 1920px; Observatory additionally covers its intermediate mode boundaries. Both locales, keyboard paths, overlays, repeated entry, and reduced motion are exercised by the browser suites.

## Final result

The implementation expresses a coherent Archive-specific motion system: objects explain access and relationships, selected state commits promptly, and records remain steady. The original ten findings have implementation resolutions and focused regression evidence; browser-environment limits remain separate from demonstrated application defects.

### Assessment: 18/20, with the 20/20 gate still open

This is a heuristic assessment of the implemented framework and representative public page families, using the installed Impeccable rubric. It is not a WCAG certificate or a field-performance score. The historical 12/20 motion-focused audit remains unchanged; the final pass adds broader semantics, contrast, input and responsive evidence rather than treating motion checks as complete accessibility proof.

| Dimension | Score | Evidence and limit |
| --- | ---: | --- |
| Accessibility | 3/4 | Complete motion alternatives/control and focus repair; measured representative contrast; exposed control names, alternatives and headings checked across 50 route/width samples. A full assistive-technology and whole-site WCAG assessment is not established by those samples. |
| Performance | 3/4 | Snapshot boundaries, layout batching, cached path geometry, inactive-loop gating, leaner Search markup and offscreen containment improve measured execution. Constrained Search startup and some Observatory state-change tasks still exceed the 50ms investigation target. |
| Theming | 4/4 | Shared semantic text/material/motion roles, readable family-tinted text, intentional local material/scales, consistent dark Archive identity and gold focus treatments; no unsupported theme added. |
| Responsive design | 4/4 | Representative families at 320/390/768/1440/1920px; intermediate Observatory modes and text enlargement; native horizontal filmstrip and synthesized touch/cancel paths; compact Search identity precedes bounded art. Physical-device behavior remains untested. |
| Implementation integrity | 4/4 | Lifecycle ownership retained; stale redirects, debounce, focus and reveal failures repaired; rapid-navigation stylesheet race fixed; detector warnings reviewed. Complete engine suites pass after Firefox recovery and Windows-only WebKit process/pipe ownership repair; affected final readiness cases pass in all engines. Deliberate failure still fails, worker shutdown exits cleanly, and no processes from the final WebKit run remain. |
| **Total** | **18/20** | **Excellent; the requested 20/20 has not been awarded.** |

### Remaining gates

1. **P2 — constrained startup cost:** the latest Search samples still have 109–193ms startup tasks under four-times CPU throttling; Observatory's focused panel state change also has occasional 53–116ms tasks after batching. Profile on the intended low-power device before introducing more effects. Optimize the specific loading/layout/state work that remains; do not hide it behind a longer transition. Suggested pass: `$impeccable optimize`.
2. **Accessibility evidence — whole-site review:** representative motion, semantics, focus and contrast evidence is strong, but a complete screen-reader/assistive-technology and public-content variant assessment remains unverified. Complete that assessment and address actual findings before awarding the accessibility point. Finish with `$impeccable polish` after the remaining work.

The former clean-browser verification gate is closed by the final results below. Earlier runner failures remain in this record as historical evidence.

These are explicit completion requirements, not permission requests. No deployment, push, or additional shutdown was performed during implementation.

## Follow-up — Home visibility and continued implementation

The user reported that Home's section links responded to hover and clicks while their names were invisible. The implementation had removed the old row entrance animation but left `.list-row` at `opacity: 0` and `translateY(14px)`. This was a patch-caused regression. The prior `toBeVisible()` checks allow zero opacity, and the retained Home captures showed only the hero. The 86 contrast samples also omitted the index, so none of those results disproved this failure.

`src/pages/index.astro` now renders rows at full opacity with no displaced entrance state. The unused row-delay property was removed, and count text no longer multiplies its semantic color by another 0.4 opacity. Hover, focus, destination links and the preview controller retain their behavior.

Four Home tests cover English/Portuguese, JavaScript on/off, 390/1440px, and normal/reduced motion; they assert row opacity explicitly and exercise preview changes through hover and focus. Four additional tests in `tests/reveal-resilience.spec.ts` cover 64 route/state views across Home, Organizations, Cosmology and Search. These inspect the product of text and ancestor opacity, then focus the final native record link and check its copy in the viewport instead of stopping at the hero. This is targeted visibility coverage, not a claim of complete visual or accessibility verification.

The next implementation batch also:

- Reuses Search's default server-rendered result state, avoiding a redundant reorder, text rewrite and selection animation on arrival. Restored queries and section filters still apply normally.
- Schedules initial ambient animation discovery after synchronous page setup; already-observed actors avoid redundant animation queries.
- Defers offscreen featured-card layout, extending the existing ordinary-row containment strategy. Native record links remain available and keyboard focus brings later content into view.
- Adds the shared gold keyboard-focus ring to primary, featured and ordinary Search result links.

An isolated four-times-CPU mobile trace improved from a 139.3ms maximum layout over 451 objects to 82.6ms over 259 objects. The `astro:page-load` dispatch decreased from 56.6ms to 35.5ms in those traces. Three-sample variant comparisons first confirmed that featured-card containment helped; changing the list to block layout did not. The final interaction samples recorded Search startup tasks of 193/125/109ms, compared with 223/130/124ms in the previous Search-only run. These separate lab runs indicate improvement, not a universal latency guarantee. Observatory still recorded constrained-profile long tasks, and the performance gate remains open.

Follow-up evidence is retained under `.impeccable/home-*.log`, `.impeccable/search-followup-*-trace-summary.json`, and the existing evidence directory. The Home index's 42 additional pixel-backdrop contrast samples have no threshold failures (`animation-home-index-contrast.json`). Desktop and mobile index captures are `home-section-repair-1440.png` and `home-section-repair-390.png`. The interaction report is `animation-home-followup-lab.json`.

The focused two-engine Home run passed all 10 application cases; WebKit again produced two worker-exit timeouts after assertions, so its command exited 1. This host limitation is still open and is not reclassified as a clean browser pass.

The follow-up production build completed at 18:16:50 local: 295 pages, 25.83s, all content guards passed. The source check covers 146 files with zero errors/warnings and the same intentional platform hint. The complete Chromium suite passed 82/82 in 4.4 minutes. It precedes only the final Search focus-ring CSS; the rebuilt final Search integration then passed in Chromium and WebKit with a clean command exit. Logs are `.impeccable/home-followup-final-check.log`, `home-followup-final-build.log`, `home-followup-chromium.json`, and `home-followup-final-search.json`.

The follow-up source manifest `.impeccable/home-followup-build-inputs.json` has SHA-256 `8E728376E85C6FA970ED00535982807F318E8DDA6201D6BFCF9C3693862958BF`. The updated test/config manifest `.impeccable/home-followup-test-inputs.json` has SHA-256 `E7288D71B97A9758FA21108D103718677E57E2AB4354D584837EDD88B58035EC` and includes the Firefox cache selection and final keyboard-path test below. The earlier manifests remain a record of the earlier build.

## Firefox recovery

The user authorized installation and runtime repair. A project-local copy of the existing official Firefox 150.0.2/revision 1522 launched and loaded SiNE successfully. SHA-256 hashes of `firefox.exe` and `mozglue.dll` match the original cache exactly; no browser binary or manifest was patched. Recreating the AppData cache with those same files still failed. The original AppData cache was restored afterward. This demonstrates a location-dependent loading failure, without establishing its underlying Windows cause.

The working runtime is retained in the ignored `.impeccable/playwright-browsers/firefox-1522/` cache. On Windows, `playwright.config.mjs` uses that executable when it exists and matches the revision selected by the installed Playwright package. An explicit `PLAYWRIGHT_BROWSERS_PATH` continues to take precedence. Other hosts use the normal runtime. The README records installation through Playwright's supported cache-path setting. No extra npm package, OS runtime installation, system permission change, default-browser change, or Firefox/Zen profile change was needed.

The complete Firefox run finished with **81 passed, one intentionally skipped Chromium-only CDP touch case, zero failed tests, and a clean command exit** in 6.2 minutes (`.impeccable/firefox-recovered.json`). It includes the final Home/Search source build and all new readability cases. A separate Firefox navigation run without a browser-path override passed through the saved configuration in 15.5s (`.impeccable/firefox-config-smoke.json`). The Firefox launch blocker is resolved for this checkout; WebKit cleanup remains a separate verification requirement.

The isolated-cache full WebKit diagnostic was stopped after the new readability test exposed a harness problem: `scrollIntoViewIfNeeded()` did not bring a deferred Search descendant into view. An isolated probe reproduced a scroll position of zero after that call even after page readiness; focusing the native link instead moved to 25,600px and exposed its heading within the viewport. The final test waits for page readiness and exercises that keyboard path in every family. The stopped run is not counted as a clean full WebKit result; its earlier test artifacts are retained, and the corrected coverage is rerun separately in all three engines.

The corrected cross-engine readability run finished with **12 passed, zero failed application cases**, plus two WebKit worker-exit errors after the default 300,000ms shutdown wait. Its command exited 1 (`.impeccable/reveal-keyboard-engines.json`), so the WebKit runner gate remains open. This confirms the keyboard-path repair without labeling the runner clean. The installed Playwright 1.60 runner exposes `PWTEST_CHILD_PROCESS_TIMEOUT` for bounded future diagnostics; shortening it still reports the shutdown error and does not establish a successful exit.

Final source validation again passed with 146 files, zero errors/warnings and the intentional platform hint (`.impeccable/reveal-final-check.log`). The final rebuild completed at 18:34:50 local: 295 pages in 21.06s, all guards passed (`.impeccable/firefox-recovery-final-build.log`). Production source fingerprints remain unchanged from the follow-up manifest above. The score remains **17/20 provisional**: Firefox is recovered, but constrained startup cost, WebKit worker shutdown and complete accessibility evidence are still open.

## Windows WebKit shutdown investigation

The reproducible failure occurs after the application assertions. The WebKit parent process exits with code 0, but auxiliary WebKit processes retain inherited pipe handles. Node does not emit the child-process `close` event while those pipes remain open; Playwright awaits that event and its worker eventually exceeds the default 300,000ms shutdown timeout. Killing the orphaned network processes alone did not release every pipe. Releasing the exited process's pipe endpoints as well allowed the worker and CLI to finish normally. This is separate from the site's Windows WebKit native-transition fallback.

The ignored diagnostic preload and handle logs are investigation artifacts, not shipped test setup. The maintained solution is `tests/helpers/test.ts`, backed by `tests/helpers/windows-webkit.ts`. On Windows only, local WebKit uses the public [BrowserServer API](https://playwright.dev/docs/api/class-browserserver) to own its process handle. After the parent exits, cleanup matches auxiliary processes by parent PID, exact executable name, runtime directory, and creation time between browser launch and exit. It rechecks each process's start time before termination, then destroys only the exited child's pipe endpoints. A nonzero browser exit or cleanup error still fails the run. Chromium, Firefox, other platforms and external browser connections keep the standard fixture. No vendor files, npm packages, shutdown timeouts, assertions, or operating-system settings were changed by this fix.

The original four-case reproduction passed with a clean command exit in 1.4 minutes (`.impeccable/webkit-owned-fixture.json`). That diagnostic used a 15-second worker timeout only to bound investigation; the final complete suites use the normal timeout and no preload. A separate deliberate assertion failure reached its intended assertion, retained screenshot/trace artifacts, and exited 1 in 4.45 seconds with one failed test and **zero runner errors** (`.impeccable/.impeccable/webkit-negative-final.json`). This verifies that cleanup does not convert a failed assertion into a pass. An earlier version of that temporary control targeted the wrong readiness element and is not used as the final control.

All specs now import the shared fixture. Source checking covers 148 files with zero errors/warnings and the same intentional platform hint (`.impeccable/webkit-fix-final-check.log`). The rebuilt production site contains 295 pages, completed in 24.58 seconds with all content guards passing (`.impeccable/webkit-fix-build.log`). The production-source manifest above is unchanged. A full Firefox run against the new fixture completed with 81 passed, one intentional skip and zero runner errors in 6.3 minutes (`.impeccable/webkit-fixture-firefox.json`). The first full WebKit attempt has no final report and is treated as incomplete; complete WebKit and Chromium verification is recorded below.

The next two-runner attempt exposed a verification setup error: both runners started preview concurrently, one server moved to port 4331, and Chromium's server at the shared target port 4330 stopped when its run ended. WebKit then recorded 19 application failures, 62 passes and one skip; its report has **zero runner errors** and its command exited 1 normally (`.impeccable/webkit-fixed-complete.json`). Those failures do not count as a successful suite. Subsequent runs use an independently owned preview server on 4330 so no suite owns another's server lifetime.

That Chromium run recorded 81 passes and one no-script Home viewport failure. The trace shows focus being applied after DOMContentLoaded, before an explicit native load boundary. A separate repeated-route diagnostic showed layout shifting between the interactive and complete states; isolated keyboard checks succeeded. The no-script readability test now waits for the native load event before focusing, while JavaScript-enabled checks keep their page-ready boundary. All opacity, keyboard-focus, viewport and visible-copy assertions remain intact; there is no arbitrary sleep or website CSS change for this timing case. The initial failed run and probes are retained under `.impeccable/webkit-fixture-chromium.*` and `.impeccable/focus-*.log`.

The assertion-version test/config manifest is `.impeccable/webkit-recovery-test-inputs.json`, SHA-256 `50E923290CF7ED12D589979B6CE8ACE835E24AB329007D2ECE2DECB37883AA2D`. It includes the shared fixture, all spec imports and the final native-load boundary. Production source still matches the earlier source manifest exactly.

The final configuration additionally gives the complete serial three-engine matrix a 45-minute global budget: three 15-minute engine budgets. The old 15-minute global cap was shorter than the combined measured engine runtimes. This does not change individual test, assertion or worker-shutdown timeouts. The browser verification runs were started with the earlier global cap; the budget change is not responsible for clean shutdown. Configuration discovery passes with all 246 cases in 12 spec files (`.impeccable/webkit-final-matrix-list.log`). The final test/config manifest is `.impeccable/webkit-matrix-final-test-inputs.json`, SHA-256 `67DEF99F162F9011ACA36BFC75496151D72D64F75922F5C37B6C73287A0511F4`.

### Final recovery verification — 2026-10-31

| Check | Result | Evidence |
| --- | --- | --- |
| Full Chromium suite | 82 passed, zero failed/flaky cases, zero runner errors, exit 0; 6.2 minutes | `.impeccable/webkit-fixture-chromium-final.json` and `.exit` |
| Full Firefox suite | 81 passed, one intentional Chromium-only CDP skip, zero failed/flaky cases, zero runner errors; 6.3 minutes | `.impeccable/webkit-fixture-firefox.json` |
| Final Firefox readability cases | 4 passed, zero failed/flaky cases, zero runner errors, exit 0; 1.9 minutes | `.impeccable/webkit-fixture-firefox-readiness.json` and `.exit` |
| Full WebKit suite | 81 passed, one intentional Chromium-only CDP skip, zero failed/flaky cases, zero runner errors, exit 0; 14.0 minutes | `.impeccable/webkit-fixed-stable.json` and `.exit` |
| WebKit post-run process check | Zero live runtime processes created by this run; no forced worker exit | `.impeccable/webkit-fixed-cleanup-summary.json` |
| Final source check | 148 files; zero errors/warnings; one intentional platform hint | `.impeccable/webkit-readiness-final-check.log` |
| Final configuration discovery | All 246 cases in 12 spec files; exit 0 | `.impeccable/webkit-final-matrix-list.log` and `.exit` |

The complete Firefox suite precedes only the native-load readiness addition to the four readability tests; all four affected cases were rerun successfully afterward. Full Chromium and WebKit include that addition. Production source is unchanged across these checks. These per-engine suites together cover the complete matrix, including transition and character suites; the single combined command was not rerun after increasing its global budget. The only later configuration change is that overall budget, validated by complete test discovery.

The WebKit runner blocker is resolved for this host/runtime without suppressing assertions, shortening shutdown waits, patching Playwright, or forcing worker success. Reevaluate the narrow Windows fixture after a browser upgrade. The implementation-integrity score rises from 3/4 to 4/4, taking the assessment from **17/20 to 18/20**. Accessibility and performance remain at 3/4 for the explicit evidence limits above.
