# Animation implementation workflow: target 20/20

Status: **implementation integrated; current assessment 18/20; accessibility and performance gates remain open**. See the [verification record](animation-framework-verification.md) for results, measured improvements and limitations. The 20/20 target has not been awarded.

Follow-up: the user identified invisible Home index links after the first verification pass. Their abandoned entrance state has been repaired, effective-opacity regression coverage now extends beyond the hero, and Search startup/focus refinement has continued. Firefox launch and Windows WebKit shutdown have since been recovered; clean engine verification closes the former third gate and raises the score to 18/20. The verification record preserves the earlier incomplete evidence and failed attempts.

Created: 2026-10-30. Baseline: [animation framework audit](animation-framework-audit.md), **12/20**, ten findings (F1–F10). Authority: [design system](design-system.md), [architecture](architecture.md), and repository contributor instructions.

## Outcome and authorization

Implement the complete animation audit, refine the surrounding interface where necessary, and earn **4/4 in each of Impeccable's five audit dimensions**. The user has authorized new animations, effects, hover/focus treatments, code changes, adaptations, and refinements. Routine implementation and design choices within this scope can proceed without another approval round.

The deliverable is a working, tested frontend plus an evidence-backed final audit. A clean detector output alone does not establish 20/20. Preserve the original audit and its 12/20 result; record subsequent scores separately.

The audit baseline was motion-focused. Keep that comparison visible, and expand final verification to the accessibility, token, responsive, and implementation checks required by the actual five-dimension rubric. Do not imply that a motion-only inspection establishes whole-site accessibility conformance.

Preserve canonical prose, fictional terminology, disclosure boundaries, routes, slugs, anchors, collections, artwork, and both locales. Changes to interface wording needed for accessible controls are in scope; invented lore is not. Keep the dark editorial archive identity and bespoke page families. Use Astro, plain CSS, the existing GSAP dependency, browser animation APIs, and the npm lockfile. Package additions still require approval of their exact names under AGENTS.md. Deployment, infrastructure, credentials, and environment changes retain their separate authorization requirement.

## Creative direction

**Records remain steady; archive objects move to explain access, selection, and relationships.**

Give Home, character artwork, the Observatory, and Redactory distinctive focal moments. Make search, filtering, reading, navigation, and repeated selection precise and direct. Motion should communicate one of four things: an action was accepted, a state changed, two objects are related, or the visitor crossed a meaningful threshold.

Use the existing materials: fine rules, registration marks, brackets, authored imagery, restrained crimson/gold signals, paper, ink, and instrument paths. Coordinate hover, keyboard focus, active, selected, loading, disabled, and reduced-motion states. Avoid adding a common hover lift or glow to every component.

Implementation defaults resolve the earlier audit's open questions:

- Repeat visits prioritize fast lookup while retaining the identity of immersive scenes.
- Character dossier galleries start in manual mode. The artwork-led index can offer explicit playback; automatic changes require an accessible persistent pause control.
- Every signature entrance is interruptible. Subsequent visits skip or shorten the initial choreography.
- Reading focus quiets ambient activity. Hidden and offscreen decorative systems stop.
- The operating-system motion preference is authoritative. Add a compact, clearly named site motion control only if it improves access without crowding existing navigation. Persist only explicit choices; never override a request for reduced motion with more movement.
- The initial performance budget targets ordinary 60Hz desktop rendering and a constrained mobile profile. Capture real-device evidence when hardware is available and identify simulation separately.

## Execution rules

Continue on the dedicated `codex/animation-framework-audit` branch if it is still the active audit branch; otherwise create a suitable `codex/` implementation branch. Before editing, record the current branch, tracked/untracked status, and the existing diff. The Observatory and shared navigation already contain unrelated uncommitted work. Read those current files and integrate with them; do not reset, discard, stash indiscriminately, or stage the whole tree.

For each stage:

1. Read its target source and the relevant Impeccable playbook. Read `reference/craft-floor.md` immediately before UI editing, as required by the skill.
2. State the target files, intended behavior, and any deliberate change to the visual authority.
3. Capture the relevant baseline and add only meaningful regression coverage for real failures.
4. Implement one coherent batch. Retain the existing ownership of routes, components, and controllers.
5. Verify the changed behavior, inspect the rendered result, and update this workflow's status and evidence.
6. Continue to the next stage when its exit criteria pass. An environment failure is recorded and investigated separately from an application failure.

Use reviewable logical batches. Do not merge, push, or deploy as a side effect of the workflow. If later instructed to commit and push, follow the repository's standing main-integration rule.

## Stages and dependencies

| Stage | Purpose | Depends on | Current status |
| --- | --- | --- | --- |
| 0 | Establish a reproducible baseline | — | Complete; Firefox recovered through a verified project-local official runtime |
| 1 | Fix reliability and inaccessible interaction states | 0 | Implemented; focused regressions pass; host runtime limits recorded |
| 2 | Establish motion tokens, control, and lifecycle helpers | 1 | Implemented; regression coverage added |
| 3 | Refine reading, browsing, and shared feedback | 2 | Implemented; Search rendering optimized |
| 4 | Author Home, Characters, and Redactory sequences | 2, 3 | Implemented and visually reviewed |
| 5 | Refine Observatory and system instruments | 2, 3 | Implemented; connector reads/writes batched |
| 6 | Complete responsive, theme, accessibility, and performance work | 3, 4, 5 | Implemented and sampled; constrained startup and whole-site accessibility evidence remain open |
| 7 | Run release-quality verification and independent rescoring | 6 | Complete Chromium/Firefox/WebKit suites pass; final affected readiness cases pass; WebKit exits cleanly with no owned runtime processes left |
| 8 | Close remaining findings, polish, and record the final result | 7; repeat as needed | Assessed at 18/20; constrained performance and whole-site accessibility evidence remain open |

Stages 4 and 5 have separate feature ownership, but shared tokens and lifecycle work must settle first. If parallel agents are used under an applicable skill, give each distinct file ownership and integrate before validation. Do not let agents independently rewrite shared navigation or styles.

## Stage 0 — Baseline and evidence

**Targets:** audit report, current source/diff, existing browser suites, and local preview setup. Change test configuration only if a reproducibility problem actually requires it.

- Record the initial diff and a fingerprint of every overlapping file before changing it.
- Run source checks and build from the current tree. Start a production preview from that build on a known available local port; verify its identity instead of trusting an already-running server.
- Reproduce F1–F10, separating confirmed runtime failures from source-derived risks.
- Resolve Firefox's browser-launch environment problem using the installed tooling and locked project dependencies. Do not remove Firefox from the test matrix to make it green.
- Retain WebKit traces for character return and Atlas-to-Home failures. Inspect navigation events, URL writes, initializers, and click delivery before choosing a fix.
- Capture normal/reduced motion, initial/repeat entry, both locales, and representative widths. Record baseline timings and traces for Home, character selection, Observatory focus/travel, Resonance, Atlas, and Redactory passage.

**Exit:** a reproducible baseline with exact commands, browser versions, viewport/input settings, build identity, and clearly classified failures. Create an evidence log in `docs/animation-framework-verification.md`; scores remain unassigned until evaluated.

## Stage 1 — Reliability before choreography

**Impeccable:** `harden`. **Findings:** F1, F2, F3, F9, F10.

| Work | Primary targets | Required behavior |
| --- | --- | --- |
| Remove delayed navigation races | `src/components/redactory/RedactoryDesk.astro`, `src/scripts/transition-lifecycle.ts`, `src/styles/transition-system.css` | Astro owns immediate navigation. No old timer redirects after a later action. Preserve named object continuity for Stage 4. |
| Make reveals fail open | `src/scripts/reveal-on-scroll.ts`, Organizations and Cosmology indexes | Titles, summaries, and links are readable before enhancement and if scripts fail. Enhancement can animate imagery/rules without withholding records. |
| Repair Atlas panel state | `src/pages/places/map/index.astro` | A closed dossier is inert; opening/closing has a deliberate focus policy and return target. Rapid interruption never leaves invisible controls focusable. |
| Own delayed work | Search index and `SystemInterfaceScaffold.astro` | Debounces, timers, frames, and callbacks cancel or settle on teardown. Stale Search work never changes another route's URL. |
| Repair WebKit return flows | Shared lifecycle, character controllers, Atlas owner, relevant tests | Fix the observed cause. Preserve history/selection and normal links without adding navigation delays or weakening assertions. |

Regression coverage belongs principally in `tests/transition-smoke.spec.ts`, `tests/character-navigation.spec.ts`, `tests/redactory-ui.spec.ts`, and focused motion/lifecycle coverage where existing suites lack an appropriate home.

**Exit:** later navigation always wins; no-script record content is visible; closed Atlas content is outside keyboard order; detached controllers cannot mutate live URL/state; both previously failing WebKit sequences pass repeatedly. Repetition is limited to demonstrating that these known failures are fixed.

## Stage 2 — A coherent motion contract and visitor control

**Impeccable:** `animate`, then `document`. **Findings:** F4, F5; foundation for F6/F8/F9.

**Targets:** `src/styles/global.css`, `src/styles/transition-system.css`, existing motion controllers, both character gallery owners, and `docs/design-system.md`. Add small shared helpers under `src/scripts/` only for genuinely repeated responsibilities: live preference subscription, cancellable delayed work, and visibility-gated activity. `transition-lifecycle.ts` remains the sole Astro event owner.

Proposed roles are starting values to tune in the rendered interface:

| Role | Starting duration | Use |
| --- | --- | --- |
| Immediate feedback | 100–150ms | Press, focus, active rule, accepted action |
| Local state | 160–240ms | Filter, disclosure, selected marker |
| Routine navigation | 220–300ms | Search access and ordinary record continuity |
| Pane continuity | 280–380ms | Dialog/panel change, with faster exit |
| Artwork | 350–500ms | Character image or editorial artwork exposure |
| Authored passage | 600–800ms total | A meaningful threshold or object transition |

Keep route durations in their existing owner and scope local material differences. Update the design authority in the same batch when replacing current documented timings. Avoid translating these ranges into dozens of near-duplicate tokens.

Implement live normal/reduced behavior, including preference changes during an active transition. Cancel spatial motion, settle the intended state, and retain selected colors, labels, relationships, and useful opacity feedback. Cover Home, Character index/dossier, Apparatus, SiNE, Places, Atlas, Cosmology, Search, Observatory, Redactory, and system instruments. Replace indiscriminate near-zero-duration fallbacks where a clear state alternative is needed.

Gallery controls need named play/pause and manual advance where appropriate, meaningful state, keyboard access, pause on focus/hidden state, and a persistent explicit pause choice. A pause must remain effective while the visitor reads elsewhere.

**Exit:** every animation owner has a normal state, a meaningful reduced state, an interruption rule, and cleanup. No nonessential spatial movement or autoplay survives a live request for reduced motion. Every hover effect has equivalent focus feedback and a usable touch path.

## Stage 3 — Reading, browsing, and shared interaction craft

**Impeccable:** `quieter`, `animate`, `polish`. **Findings:** F6, F7 and parts of F4/F8.

| Family and targets | Implementation |
| --- | --- |
| Entry cards and section lists | Refine border/rule/thumbnail feedback around the selected record. Keep headings anchored; avoid universal hover lift. Preserve mobile reading order. |
| Archive references and reading layouts | Anchor previews to their reference, keep focus visible, prevent viewport clipping, and provide touch access to equivalent information. Do not reveal protected content. |
| TOC and disclosures | Make section selection and open/closed state legible with restrained active rules and immediate semantics. Respect reduced-motion scrolling. |
| Search | Shorten tool access; coordinate query, chip, count, and result changes. Preserve focus, image geometry, empty/loading states, URL/history, and return state. |
| Apparatus | Introduce the registry as one composition; make subsequent filtering direct. Use selected brackets/rules and measured image feedback. Repair the scan/grain reduced states. |
| Organizations and Cosmology | Replace repeated multi-part text staging with a single artwork/rule exposure when useful. Keep titles, summaries, and actions available. |
| SiNE, Places, and Systems selectors | Commit selection immediately, keep labels stable, and make branch expansion explain the choice. Replace costly flex choreography when profiling or responsiveness warrants it. |
| Atlas | Tune geographic focus by distance, refine the chosen-location marker, and coordinate dossier appearance with the focused location. Reduced motion snaps to the same state. |
| Soundtracks and MusicPlayer | Tie active-track treatment, progress, controls, and signals to actual playback. Stop decorative playing effects when paused. Preserve persisted audio behavior. |

**Primary files:** `EntryCard.astro`, `SectionList.astro`, `ArchiveRef.astro`, `MusicPlayer.astro`, reading layouts, `src/styles/archive-refs.css`, and the owning index/map pages. Consult current source before choosing whether behavior belongs in shared CSS or a page controller.

**Exit:** ordinary reading begins immediately; selection acknowledgment targets the next paint; feedback is complete for mouse, keyboard, and touch; repeated actions do not replay an opening ceremony. Long/missing content and both locales remain usable.

## Stage 4 — Signature sequences

**Impeccable:** `animate`, `delight`, `polish`. **Findings:** F1/F6 refinements after their reliability fixes.

| Experience | Focal sequence | Supporting behavior |
| --- | --- | --- |
| Home — `src/pages/index.astro` | Compose authored imagery and the Archive mark into one threshold, aiming for 600–800ms rather than a chain of delayed text | Preserve directional gates; shorten routine Search passage; crossfade the section preview; quiet the scroll cue after use; retain static film grain in calm states. |
| Character index — `src/pages/characters/index.astro` | Let artwork carry a 350–500ms dissolve while name, selected state, count, and destination commit immediately | Batch bounded pointer depth on fine pointers only; interrupt previous changes cleanly; make filmstrip, gallery, and dossier return feel continuous. |
| Character dossier — `CharacterEntryLayout.astro` | A restrained media change that leaves the reading column fixed | Manual-first gallery, explicit playback if offered, direct reduced state, calm TOC navigation, and stable focus. |
| Redactory — components and route profiles | Carry quill, inkpot, or papers through one 600–800ms departure/arrival sequence | Keep object hit areas and focus intact; make return faster; preserve dark continuity, scroll-linked descent, and stable folio/profile reading. |

Use controlled crops, bounded masks, shared objects, opacity, and precise registration rather than stacking several effects. Keep essential controls available throughout. Any unsupported View Transition path must still navigate normally and retain a complete destination.

**Exit:** each experience has a recognizable focal idea; repeated visits are faster; any new input can interrupt the sequence; the static reduced version expresses the same identity. The effect adds meaning that would be lost if removed.

## Stage 5 — Observatory and causal instruments

**Impeccable:** `animate`, `optimize`, `polish`. **Finding:** F8 and remaining F4/F9 coverage.

**Targets:** `src/scripts/observatory/`, `src/styles/observatory.css`, Systems Observatory components, `SystemInterfaceScaffold.astro`, related interface pages, and Redactory background/depth controllers where activity policy is shared in principle.

- Preserve current Observatory work, sourced relationships, readable labels, stable compact selector, comparison, deep links, history, popovers, responsive images, and one active controller/field loop.
- Refine the first aperture entrance while retaining return skip and dismissal on intent.
- Make chart geometry, relationship travel, selected marks, tether, and reading pane one understandable change. Interruptions settle to the latest intent without orphan paths, markers, clones, or timelines.
- Quiet ambient texture behind active reading. Keep finite reactive/relational signals distinguishable from the ambient layer.
- For Resonance/Harmonics, show an experiment's consequence and then settle. Retain time-based motion only where time is part of the explanation.
- Gate instrument loops on document visibility, actual stage intersection, and current motion preference. Batch geometry reads and writes; bound density and pixel ratio.
- Keep existing static explanations and direct destination links meaningful when an instrument or script is unavailable.

**Exit:** diagrams communicate causal state, every loop has an explicit activity policy, labels remain readable through comparison/focus, and repeated route entry leaves no duplicate controllers, listeners, canvases, or GSAP work.

## Stage 6 — Earn the remaining points across the whole interface

**Impeccable:** `adapt`, `colorize`, `typeset` where needed, `harden`, `optimize`, `document`.

Check the full public frontend, including controls affected by motion:

- Measure text/control/focus contrast on the rendered backdrop in default, hover, focus, active, disabled, and overlay states. Refine tokens and local semantic roles where needed. Preserve bespoke accents with explicit purpose. Do not introduce a light theme merely to satisfy a generic checklist.
- Check labels, headings, announcements, focus order/return, hidden states, dialog names, keyboard paths, media descriptions, and reading semantics. Validate screen-reader behavior when that capability is available; mark unavailable evidence honestly.
- Inspect 320, 390, 768, 1000/1001 where the Observatory changes mode, 1440, and 1920px; include narrow landscape, text enlargement, and browser zoom. Keep diagrams and long tables internally scrollable instead of overflowing the document.
- Exercise touch gestures with synthesized touch where supported: filmstrip scrolling, sliders, panel choices, map controls, and any actual drag interaction. Test interruption/cancel paths. A resized screenshot does not establish gesture support.
- Profile before/after on the same build and conditions. Focus on layout animation, full-stage filters/masks, grain/blending, pointer updates, canvas, and image decoding. Keep font/image loading stable and verify missing/slow media.

Project performance gates are test targets, not claims of field Core Web Vitals:

| Concern | Acceptance target |
| --- | --- |
| Action acknowledgment | Selected state or accepted-action feedback at the next rendering opportunity; no artificial pre-navigation waits |
| Routine motion | Typically 100–300ms; longer movement justified by its material/distance role |
| Focal sequence | Typically no more than 800ms total; immediately interruptible; any deliberate exception measured and documented |
| Main-thread work | No recurring animation-attributable long tasks over 50ms in the sampled interaction; investigate outliers rather than hiding them |
| Smoothness | Inspect frame traces on a 60Hz desktop profile and a constrained mobile profile; eliminate sustained visible stalls, with before/after evidence |
| Decorative canvas | At most about 30 painted frames/second unless a measured interaction justifies more; static under reduced motion |
| Idle/offscreen/hidden | Zero active nonessential application-managed loops for an inactive stage; pause CSS loops as well as JavaScript activity |
| Layout stability | No motion-induced displacement of reading content or essential controls; stable media dimensions |
| Payload | No new motion package; no unexplained growth in common-route JavaScript; feature code remains scoped to its owning route |

Use a few comparable samples for noisy timing measurements; record the conditions and ranges. A fast desktop run does not prove low-power hardware behavior. Use available physical devices for the final experience check, and distinguish that evidence from emulation.

**Exit:** identified contrast/token, responsive, keyboard/touch, loading, and performance gaps are fixed. The design authority reflects the final behavior rather than the abandoned implementation.

## Stage 7 — Verification matrix and scoring

Build before preview tests. Run these repository checks after the final source integration:

```powershell
npm run check
npm run build
npm run test:transitions
npm run test:characters
npm test
git diff --check
```

During earlier batches, run the checks appropriate to the change: source/build after source edits, transitions for lifecycle/navigation, characters for character behavior, and the relevant feature suite. The final full suite covers all configured browser engines. Do not repeatedly rerun an already-passing full suite without a new change or unresolved concern.

Extend existing tests for meaningful user-visible regressions. Add focused tests only where an existing suite cannot express the behavior clearly:

| Verification | Observable pass condition |
| --- | --- |
| Redactory rapid navigation | Activate an object, choose a different destination, and remain at the latest destination after the old delay window |
| Failed enhancement | Organization/Cosmology content and links remain visible with JavaScript disabled or reveal enhancement interrupted |
| Atlas focus | Closed panel cannot receive Tab focus; open/close and Escape retain sensible focus and state |
| Live motion preference | Switching during entrances, selection, orbit, or autoplay stops nonessential movement and leaves the intended content visible |
| Gallery control | Keyboard-accessible pause persists; manual navigation works; focus/hidden/reduced states do not restart unwanted playback |
| Selection speed and interruption | Latest character/filter/panel state wins immediately and can be activated while art is transitioning |
| Search teardown | Type then immediately navigate; the destination URL and controller remain untouched by stale Search work |
| Loop lifecycle | Scroll away, hide/restore, change preference, and revisit routes; inactive loops stop and only one controller resumes |
| Browser return paths | Chromium, Firefox, and WebKit pass character return, Atlas/Home, back/forward, locale navigation, and restored selection |
| Responsive input | Real keyboard and synthesized touch flows work at the relevant breakpoints, including canceled gestures |

Cover normal/reduced motion, first/repeated entry, EN/pt-BR, slow/missing images, empty results, open overlays, and navigation during animation. Reuse existing feature tests for Observatory interruption/history, modal containment, diagrams, and responsive character reading.

Run the bundled detector according to the active skill/hook instructions. Review suggestions in context. Preserve intentional local scales, archive border treatments, and authored materials when justified; do not silence the scanner wholesale or remove identity to reduce its count. Pair deterministic findings with an independent rendered design pass. Use isolated design and implementation assessments when the selected skill requires them, then synthesize their evidence.

### Definition of 4/4

| Dimension | Baseline | Evidence needed for 4/4 |
| --- | ---: | --- |
| Accessibility | 2/4 | Complete meaningful motion alternatives and live changes; controllable autoplay; correct focus/hidden/dialog states; measured contrast; accessible labels/semantics and keyboard/input flows across representative public variants; no known material accessibility failures in audited scope |
| Performance | 2/4 | Measured improvements and satisfied activity/payload/frame budgets; no unbounded/offscreen decorative work or repeated layout thrashing; stable media/loading; smooth representative interactions under stated conditions |
| Theming | 3/4 | Coherent semantic color/type/motion roles; all public families fit the archive identity; contextual local exceptions documented; controls and focus remain clear on real backgrounds |
| Responsive design | 3/4 | Required widths/zoom/text cases fit; touch targets and gestures are verified; no hover-only essential information; compact and wide modes preserve reading order, focus, and safe-area access |
| Implementation integrity | 2/4 | F1–F10 closed with evidence; lifecycle/resource ownership verified; browser/history/locale suites pass; no material detector findings, stale callbacks, hidden records, or competing initialization systems |
| **Target** | **12/20** | **20/20 only when every row has verified 4/4 evidence** |

The local Impeccable audit rubric remains authoritative. This table operationalizes its criteria for SiNE; it must not lower the skill's scoring bar. Theming does not require adding an unsupported theme. Emulation, automated accessibility scans, and laboratory timing do not establish all aspects of real-device or WCAG conformance.

## Stage 8 — Iterate, polish, and close

If any dimension is below 4/4, convert the remaining evidence into specific implementation work, fix the relevant owner, rerun affected checks, and rescore. Never award the missing point because the phase is complete or because the detector is quiet.

Keep an explicit finding ledger:

| Finding | Implementation stage | Closure evidence |
| --- | --- | --- |
| F1 delayed Redactory redirect | 1, 4 | Latest navigation wins; one continuous route passage |
| F2 invisible reveal content | 1, 3 | Visible readable/linkable no-script and failed-enhancement states |
| F3 closed Atlas focus | 1, 6 | Tab/open/close/Escape checks with correct inert/focus state |
| F4 incomplete reduced motion | 2–6 | Complete normal/reduced and live-change matrix |
| F5 uncontrolled gallery autoplay | 2, 4 | Manual-first reading gallery and accessible explicit playback control |
| F6 slow repeated interaction | 3, 4 | Immediate state/destination and measured bounded visual continuation |
| F7 repeated scroll choreography | 3 | Stable readable copy/actions; composed artwork/rule reveal |
| F8 inactive ambient work | 2, 5, 6 | Visibility/intersection/preference traces show inactive work stopped |
| F9 uncanceled local work | 1, 2 | No post-teardown URL/DOM activity; interruption regression coverage |
| F10 WebKit return failures | 0, 1, 7 | Root cause recorded; both sequences and full return matrix pass |

Finish with `$impeccable polish`: inspect complete journeys, optical alignment, typography, focus, hover, touch, timing, images, loading, and reduced motion. Recheck the diff for accidental changes, generated artifacts, unsupported abstractions, and interference with the initial uncommitted work.

Final deliverables:

- Implemented, reviewable source changes and targeted regression coverage.
- Updated `docs/design-system.md` and architecture notes only where behavior/ownership changed.
- `docs/animation-framework-verification.md` containing the score per dimension, exact tested revision/build, commands/results, F1–F10 closures, before/after evidence, intentional exceptions, and remaining limitations.
- Original audit retained as historical baseline, with a link to the final verification.
- A concise handoff naming changed behavior, verification results, actual earned score, and any remaining requirements.

**Completion condition:** all ten findings closed, all planned page families covered, all five dimensions independently supported at 4/4, required checks passing, and no known material defect left open. Unavailable evidence remains marked unverified and is resolved before claiming 20/20. A limited audit may be reported honestly with its scope, but must not be presented as the requested completed whole-site result.

The workflow follows the project's installed Impeccable playbooks; the upstream [workflow guide](https://impeccable.style/docs/) provides broader command guidance.
