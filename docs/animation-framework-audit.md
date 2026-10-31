# Animation framework audit

Date: 2026-10-30. Method: Impeccable audit, with independent motion-design and implementation assessments, source inspection, a fresh production build, rendered review, and browser regression tests.

Implementation follow-up: [approved workflow targeting 20/20](animation-implementation-workflow.md). The score below remains the historical audit baseline.

Implementation evidence and subsequent scoring: [verification record](animation-framework-verification.md).

## Verdict

SiNE already has a distinctive motion identity and a sound shared navigation architecture. Preserve both. Its best animation expresses the Archive through objects and relationships: directional access gates, quill and paper passage, chart-to-record continuity, finite relationship tracing, and scroll-linked descent.

The principal weakness is motion hierarchy. Long entrances and continuous activity also occur on surfaces used for repeated selection, lookup, and reading. This reduces the distinction between an immersive threshold and an ordinary record. There are also reproducible accessibility and lifecycle failures that should precede any expansion of the animation system.

**Recommended thesis: records remain steady; archive objects move to explain access, selection, and relationships.**

This is an audit of the current working tree, including the pre-existing Observatory changes. It is not a statement about the exact version currently deployed. No application source, canon, package, deployment setting, or existing uncommitted work was changed by the audit.

## Health score

These are motion-focused heuristic scores, not a full-site accessibility certification, a frame-rate benchmark, or a measurement of the quality of the artwork.

| Dimension | Score | Reason |
| --- | ---: | --- |
| Accessibility and motion control | 2/4 | Strong shared modal behavior and Observatory alternatives; incomplete reduced-motion coverage, uncontrolled gallery autoplay, and a focusable closed Atlas panel. |
| Performance discipline | 2/4 | Bounded modern canvases coexist with offscreen activity, animated layout properties, and large filtered route snapshots that still need device profiling. |
| Theming and motion identity | 3/4 | Product-specific materials and coherent route tokens; repeated generic entrances dilute their meaning. |
| Responsive execution | 3/4 | Representative routes fit desktop and phone viewports; compact Observatory remains legible. Motion preferences and mobile operating costs are less consistent. Physical-device gestures were not verified. |
| Implementation integrity | 2/4 | Shared lifecycle is well designed, but page-level timer and reveal behavior bypasses its guarantees. |
| **Total** | **12/20** | **Acceptable; significant targeted work needed. Preserve the architecture and repair its exceptions.** |

Ten consolidated findings: **0 P0, 6 P1, 4 P2**. Performance hypotheses and optional new effects below are not counted as demonstrated defects.

## What the framework actually consists of

There is no single universal animation engine, and one is not needed. The implementation combines several appropriate tools with uneven policy enforcement.

1. **Document and route continuity.** `src/layouts/SiteShell.astro` owns Astro's ClientRouter, dark persisted background, route metadata, and initialization bootstrap. `src/utils/transition-routes.ts` classifies route families. `src/scripts/transition-lifecycle.ts` owns Astro navigation events, transition intent, initialization, and teardown. `src/styles/transition-system.css` owns View Transition profiles.
2. **Page and component feedback.** Scoped CSS owns hover/focus responses, panels, image dissolves, reveal sequences, decorative loops, and local material effects. Most effects use opacity and transforms, with some flex, width, letter-spacing, background-position, and filter animation.
3. **Dynamic instrument motion.** `src/scripts/observatory/motion.ts` uses the existing GSAP dependency for sequencing, interruption, geometry continuity, reactive marks, and relationship travel. Other controllers use CSS classes, requestAnimationFrame, SVG changes, and the Web Animations API.
4. **Ambient rendering.** ArchiveField and Redactory InkFlow draw bounded canvases. The current Observatory uses a compact ArchiveSphere whose canvas is hidden and whose canvas controller is not initialized; the larger sphere implementation remains in its component. These should not be counted as two active Observatory canvas loops.
5. **Shared interaction services.** `reveal-on-scroll.ts` supplies one observer per reveal group. `entry-modal.ts` supplies focus containment, background inertness, Escape/backdrop handling, focus return, request cancellation, and reduced-motion closing.

The lexical source inventory found 68 keyframe declarations and 27 declaration lines using infinite animation. This is a measure of implementation surface, not 68 unique design ideas or 27 simultaneously active effects.

### Strengths worth preserving

- The shared lifecycle keys initializers by route and stable name, cleans up before swaps, restores browser-cache pages, isolates initializer failures, and bounds diagnostic history to 40 events.
- Delayed transition-intent cleanup is associated with its navigation. Route motion has one CSS owner; there is no reason to replace Astro's navigation with a second router.
- The document and transition backgrounds preserve dark-canvas continuity. Snapshot layers are visual and do not deliberately block the settled page's pointer interaction.
- Observatory timelines interrupt previous journeys, revert GSAP contexts, remove departing clones, and clean up observers, listeners, and animation frames. Stable system labels retain their reading role while artwork recedes.
- ArchiveField caps pixel density and particle counts, targets about 30 painted frames per second, stops for intersection/page visibility, and renders a static reduced-motion state. Redactory InkFlow bounds particle count, pixel density, and paint frequency and handles visibility and live preference changes.
- Shared entry modals have substantially better lifecycle and focus behavior than the Atlas panel; reuse the principles without forcing every panel into a modal.
- Ordinary entries, organization dossiers, and codices are comparatively stable. That restraint supports the archive's reference purpose.
- The existing dependencies can express the proposed work. No new animation package is needed.

## Positioning, themes, and fit

The product combines an in-universe institution with a real encyclopedia and portfolio. Its motion must serve both. A visitor can enjoy opening the Archive and then need to consult several records quickly.

| Motion theme | Existing expression | Assessment |
| --- | --- | --- |
| Institutional registration | Rules, seals, brackets, metadata, classified panels | Strong fit when it acknowledges filing, access, or selection. Pulsing a rule indefinitely weakens that meaning. |
| Cinematic presentation | Artwork dissolves, slow zoom, grain, dark transitions | Appropriate for a first threshold and art-led stages. Keep typography and navigation available; reduce replay on routine visits. |
| Scientific instrument | Orbit, path tracing, focus, diagram responses, comparison | Strongest when motion reveals a causal relationship. Continuous activity without an experiment makes the instrument harder to interpret. |
| Material authorship | Quill, papers, ink, folio, depth | Exceptionally specific to Redactory. The implementation should preserve the object through a route change in one sequence. |
| Generic reveal choreography | Repeated fade-and-rise titles, summaries, and calls to action | Weakest fit when repeated across an index. It contributes little archival meaning and delays reading hierarchy. |

Home's left Observatory and right Search gates establish spatial geography, and the directional route profiles follow it. Character index-to-dossier lateral motion also has a plausible relationship and an inverse return. Preserve these bounded relationships.

Routine vertical page entrances imply movement without always explaining a relationship. Search has two entrance metaphors: an edge passage from Home and a radial reveal from the shared search control. Those origins can justify different geometry, but their duration should still reflect that Search is a frequently used tool.

Reading and operating surfaces should prioritize stable type, immediate selected state, predictable focus, and fast feedback. Experience surfaces can sustain one authored focal sequence. Avoid a universal rule that every page must have the same amount of motion.

## Placement and page-family inventory

| Surface | Current execution | Decision |
| --- | --- | --- |
| Shared shell and routes | 480ms default page entrance; 640–720ms edge handles; 680ms character passage; 820ms Observatory launch; 760–880ms Redactory profiles; 1050ms Search reveal | Ownership is sound. Differentiate routine navigation from authored passage and avoid stacking page entrance with delayed local choreography. |
| Home | 28-second image zoom, staged logo/copy/metadata, pulsing rule, bouncing scroll cue, preview crossfades, proximity gates | Keep the threshold, preview relationship, and directional gates. Shorten the composition's initial reveal, make reading copy available sooner, and stop cues after they have served their purpose. |
| Characters index | Artwork stage, 360ms deferred selection, 60ms restaging gap, delayed text/actions, pointer parallax, five-second image rotation | Keep art-led selection and filmstrip. Commit selected state and destination immediately; let artwork carry most of the movement. |
| Character dossier | Portrait fade/slide, optional autoplay, smooth TOC navigation, local feedback | Keep prose still. Supply explicit gallery control, live preference handling, and immediate reduced-motion scrolling. |
| General entries and codices | Restrained border/color feedback, route entrance, reading navigation | Good baseline. New motion should clarify disclosure, reference preview, focus, or media state. No extra article entrance is needed. |
| Search | Radial/edge route reveal, loading pulse, image exposure, hover transforms, chip/filter feedback | Prioritize query and result-state acknowledgment. Do not make a repeated lookup inherit a one-second spectacle. Preserve return state and stable result geometry. |
| Apparatus | Scan beam, staged header and cards, pulsing rule, card feedback | A registry introduction is reasonable, but subsequent filtering should be direct. Its reduced-motion coverage needs repair. |
| Organizations | Image reveal and seven-part stagger for each spread | Editorial imagery works; repeated delayed typography and CTAs weaken scanability. |
| Cosmology | Large chapter panels, repeated 28px reveals, pulsing accents, scroll cue, entry modals | The chapter scale earns imagery-led motion. Keep copy available and give each chapter one exposure instead of separate delayed parts. |
| SiNE / Places / Systems selectors | Large flex expansions, image changes, delayed detail, letter-spacing changes | Expansion can explain selected branch. Reduce travel on repeat use and preserve stable labels. These are frequent choices, not repeated opening ceremonies. |
| Atlas | 640ms map focus and 480ms dossier slide | Pan/zoom communicates geographic focus. Add a direct reduced-motion state and make panel interactivity follow panel visibility. |
| Observatory | About 3.4-second first entrance, chart reshaping, tether to reading, finite relationship tracing, reactive marks, ambient field | Strongest coherent subsystem. Entrance already skips on return/reduced motion and finishes on pointer or keyboard intent. Preserve that behavior; test a shorter first composition and quieter reading background. |
| Resonance / Harmonics | Orbiting nodes, waves, aperture rotation, gradient/drift/ripple responses | Keep movement that teaches an experiment or a time relationship. Settle incidental responses and pause operating loops while the instrument is offscreen. |
| Redactory | Quill/paper departure, named route objects, ink ambience, scroll-linked descent, folio/profile settling | Excellent material language. Replace pre-navigation waits with one continuous route passage. |
| Soundtracks and music chrome | Feature/row entrances, artwork changes, progress, playing signal, control feedback | Playback and actual progress deserve motion. Repeated list entrance is less useful; idle and playing states should remain distinguishable in reduced motion. |
| Visual design lab | Scoped React fixture; no meaningful motion framework of its own | Keep it out of the production motion inventory. It can test future feedback without changing canon. |

English and Portuguese wrappers reuse the same implementations. They need the same motion policy; a second locale-specific animation framework would create avoidable divergence.

## Detailed findings

### F1 — P1: a completed navigation can be overridden by an old Redactory timer

**Category:** implementation integrity. **Evidence:** `src/components/redactory/RedactoryDesk.astro:194`, `:216`, cleanup at `:220`.

Quill and paper actions prevent normal navigation and schedule `location.assign` after 780/820ms. Cleanup removes listeners and classes but does not cancel these timers. The full-document assignment also breaks the continuity that the named route objects are intended to create.

**Reproduced:** activate the quill, then immediately use the Home link. Home was reached at approximately 174–205ms; the old action redirected to the Redactor profile at approximately 797–799ms. Timing is a local diagnostic, not a general performance measurement.

**Recommendation:** let Astro navigate immediately and express the departure/arrival inside the existing route transition. Until then, retain and cancel timer handles during teardown, guard callbacks, and prevent competing delayed actions. A single object passage can retain the theatrical intent without taking control away from the visitor.

**Suggested command:** `$impeccable harden`.

### F2 — P1: reveal-dependent pages hide substantive content when enhancement fails

**Category:** implementation integrity / accessibility. **Evidence:** `src/pages/organizations/index.astro:548`, `src/pages/cosmology/index.astro:519`, `src/scripts/reveal-on-scroll.ts:5`.

Titles, summaries, and entry actions begin at opacity zero and become visible only after script adds `in-view`. With JavaScript disabled, the first Organization title computed to opacity 0 with an 18px translation; the first Cosmology title computed to opacity 0 with a 28px translation. The problem also applies when that enhancement fails to initialize.

**Recommendation:** render readable content by default. Only opt into temporary concealment after an enhancement controller is ready, with a fail-open path. Apply reduced-motion state before any concealed state so it cannot trigger a cascade of entrances.

**Suggested command:** `$impeccable harden`.

### F3 — P1: Atlas's closed dossier remains in the keyboard sequence

**Category:** accessibility. **Evidence:** `src/pages/places/map/index.astro:254`, `:441`, `:738`.

Closing changes `aria-hidden` and slides the panel away; it does not make its controls inert. Runtime keyboard checking confirmed that Tab from the map fullscreen control focuses `#dossierClose` inside `#dossier[aria-hidden="true"]`. Depending on scrolling, the browser may also try to reveal the nominally closed panel. Its hidden accessibility state and interactive state disagree.

**Recommendation:** toggle `inert` with panel state. Choose a deliberate opening focus policy, return focus to the activating region when appropriate, and ensure links from a previously opened dossier do not remain in the closed panel's tab order. The Atlas is a side panel, so it does not automatically need a modal focus trap.

**Suggested command:** `$impeccable harden`.

### F4 — P1: reduced motion is incomplete across page families

**Category:** accessibility / responsive execution. This priority reflects the amount of nonessential spatial motion and the repository's explicit requirement. It is not a claim that every missing media query is automatically a WCAG AA failure.

| Surface | Verified gap | Source |
| --- | --- | --- |
| Home, both locales | 28-second zoom, spatial entrances, pulse, and scroll cue remain active under reduced motion | `src/pages/index.astro:596`, `:636`, `:820`, `:1198` |
| Character index | Pointer movement still rewrites image position; selection still waits about 423ms locally; scripted preference is captured once | `src/pages/characters/index.astro:1238`, `:1515`, `:1546` |
| Apparatus | Grain and card/header entrances remain active; page-local grain supersedes the global static treatment | `src/pages/apparatus/index.astro:337`, `:376`, `:499` |
| Atlas | 640ms map transform and 480ms dossier slide remain | `src/pages/places/map/index.astro:567`, `:739` |
| Places | Computed panel transition remains a 720ms flex change | `src/pages/places/index.astro:537` |
| SiNE | Computed panel transition remains a 600ms flex change; reduced rule only covers modal/overlay | `src/pages/sine/index.astro:312`, `:915` |
| Cosmology | The helper reveals every section immediately, but CSS still animates each title/copy/action from a 28px offset over 1.15 seconds plus stagger | `src/pages/cosmology/index.astro:524`, `:951` |

Character pointer movement also continued after changing the preference while the route stayed open. Other one-time preference snapshots exist in the Resonance controller, dossier gallery, and Search animation decisions.

**Recommendation:** give each owner a complete calm state: stable artwork and text, direct panel selection, static relationship highlights, and immediate navigation. Keep gentle color/opacity feedback where useful. Use a live MediaQueryList to stop current animation and settle the intended state when the preference changes. Do not solve this with a global near-zero-duration rule that indiscriminately erases feedback.

**Standards distinction:** [WCAG 2.3.3, Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) is Level AAA and addresses disabling nonessential interaction motion. Autoplay is a separate concern addressed below.

**Suggested command:** `$impeccable animate`.

### F5 — P1: automatic portrait changes lack persistent visitor control

**Category:** accessibility / motion control. **Evidence:** `src/pages/characters/index.astro:1391`, `src/layouts/CharacterEntryLayout.astro:1928`, `:1938`, `:1985`.

Multi-image character galleries advance automatically every five seconds. The index offers a next-image action; the dossier also pauses on mouse hover. Neither supplies a persistent, keyboard-operable pause/resume control. Hover-only suspension does not let a reader keep the animation paused while using the rest of the page. The controls that hide stage information do not pause the imagery.

**Recommendation:** default to manual advancement on reading surfaces, or provide a named pause/resume button and retain its choice. Stop autoplay while the document/gallery is inactive and update the live reduced-motion preference. Keep manual image access available in every mode.

This is the clearest [WCAG 2.2.2, Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) concern: nonessential auto-updating imagery appears alongside reading content. This criterion is Level A; the five-second exception for moving content does not exempt indefinite auto-updating presentations.

**Suggested command:** `$impeccable animate`.

### F6 — P2: repeat interactions spend too long restaging content

**Category:** execution / design hierarchy. **Evidence:** `src/pages/characters/index.astro:609`, `:1510`, `src/styles/transition-system.css:11`, `src/components/redactory/RedactoryDesk.astro:180`.

Character selection waits 360ms to commit the new content and another 60ms to begin arrival. Actions then use a 430ms delay and 500ms transition: approximately 1.35 seconds from activation to the settled CTA. The underlying link changes before the whole sequence finishes, so this is not a claim of a 1.35-second input lock; it is a visual and selection-feedback cost. Search's 1050ms full-screen reveal is similarly expensive for a frequently used tool. Redactory additionally serializes departure and arrival.

**Recommendation:** commit selected name, state, and destination immediately. Limit repeated character motion mainly to the artwork dissolve, around 350–500ms, with anchored type. Aim for routine search/navigation continuity around 180–300ms. Keep a longer 600–800ms object passage only where it explains an authored relationship. Returns should be shorter than first entrances.

**Suggested command:** `$impeccable animate`.

### F7 — P2: repeated scroll reveals flatten the site's dramatic hierarchy

**Category:** theming / reading performance. **Evidence:** `src/pages/organizations/index.astro:547`, `src/pages/cosmology/index.astro:518`; secondary examples at `src/pages/apparatus/index.astro:499`, `src/pages/soundtracks/index.astro:1189`.

Every Organization spread repeats a seven-part reveal, with its CTA reaching the end of its transition at about 1.67 seconds. Cosmology repeats a similar sequence ending around 1.71 seconds. These are CSS duration-plus-delay totals, not measurements of how long every reader is blocked.

**Recommendation:** keep titles, summaries, and actions readable. Give a chapter image or a registration rule one finite exposure when the composition earns it. Reserve a full composition sequence for the first threshold; do not treat each scrolled record as another introduction. Cap any list stagger's total delay.

**Suggested command:** `$impeccable quieter`.

### F8 — P2: ambient activity is not consistently scoped to active use

**Category:** performance / attention. **Evidence:** `src/components/systems/SystemInterfaceScaffold.astro:1026`, `src/pages/organizations/index.astro:480`, `src/pages/cosmology/index.astro:480`, `src/pages/index.astro:820`.

Resonance's requestAnimationFrame orbit continues until route teardown, even when the instrument has scrolled out of view. The source has no intersection or live preference control for that loop. Runtime inspection also found all seven Organization image-grain animations active together, and numerous Cosmology grain/accent animations across offscreen chapters. Home's image and cue animations remained scheduled after scrolling away.

These observations establish active scheduling, not a specific GPU cost: browsers can throttle or skip painting some offscreen content. No dropped-frame or battery-life claim was measured.

**Recommendation:** borrow ArchiveField's explicit visibility/intersection policy. Pause nonessential loops outside their stage and while hidden. Quiet the ambient layer when a reading pane is active. Use one subdued ambient source per composition and let interaction-caused traces carry stronger contrast. Stop scroll hints after the first meaningful scroll.

**Suggested command:** `$impeccable optimize`.

### F9 — P2: delayed local work is not uniformly owned by teardown

**Category:** implementation integrity. **Evidence:** `src/pages/search/index.astro:979`, `:1068`, `:1076`, state persistence at `:668`; additional animation timers in `src/components/systems/SystemInterfaceScaffold.astro:796`, `:816`, `:950`, `:976`.

Search's 80ms debounce has no cancellation API, and route cleanup does not clear it. Its callback reads the old input and persists state using the current URL. If navigation completes before it fires, it can write old search parameters to the destination URL. This is a source-verified race path; the specific URL corruption was not reproduced in this run. Several instrument timers also continue modifying detached roots after teardown.

**Recommendation:** make the debounced callback cancellable, cancel it in cleanup, and guard delayed work with the active abort signal. Track finite animation timers and frames as explicitly as continuous loops. Test rapid input followed immediately by navigation, and repeated instrument actions during route departure.

**Suggested command:** `$impeccable harden`.

### F10 — P1: two WebKit return-navigation checks fail consistently

**Category:** implementation integrity / cross-browser execution. **Evidence:** `tests/transition-smoke.spec.ts:172`, `:287`; shared navigation owner `src/scripts/transition-lifecycle.ts`.

The WebKit smoke suite passed 9 of 11 navigation/character checks. Returning from a character dossier left the browser on the detail path with a character query instead of the index; activating Home from Atlas left the browser on Atlas. Both failures repeated in an isolated rerun of those two checks. The separate longer character navigation test passed, so the failure depends on the interaction sequence or timing rather than every return being broken.

**Recommendation:** investigate these sequences using their retained traces and lifecycle events, including route intent, initialization timing, URL writes, and click delivery during snapshot transitions. Verify against real Safari before assigning a browser-wide conclusion. The audit establishes failing automated return flows, not their root cause. Do not remove the failing assertions or assume that passing Chromium checks proves equivalent execution.

**Suggested command:** `$impeccable harden`.

## Performance targets that need measurement

These are profiling targets, not additional counted failures.

- **Animated layout:** Places changes flex for 720ms, SiNE changes flex for 600ms, and Systems changes flex-grow for 720ms. This causes layout work by construction. Profile the actual panel content on mobile; use transform-based geometry continuity or a simpler direct switch where it helps. Do not assume that replacing a property automatically produces a better experience.
- **Large route snapshots:** brightness, saturation, blur, and clip-path operate on large image-backed snapshots. They are finite and intentional, so first measure the device cost. Keep expensive material effects bounded to the authored passage.
- **Grain:** background-position animation over SVG turbulence, blending, and duplicate full-stage layers can be expensive. Preserve the film material; static grain can carry the same identity during reading or on low-power surfaces.
- **InkFlow:** large blurred washes coexist with a small canvas. Canvas particle count, DPR, and paint frequency are already bounded. Measure their combined composition cost before rewriting them.
- **Pointer handlers:** Character's mouse handler reads geometry and writes a transform for every event; Observatory batches and bounds its pointer response. Adopt that discipline and prevent pointer depth on reduced-motion or coarse-pointer paths.
- **Persistent hints:** only three will-change declarations were found. Review the portrait gallery and map hints at rest; this is not systemic will-change abuse.
- **Bundle scope:** the Observatory client chunk was about 96.7kB minified / 36.6kB gzip in this build and contains its motion implementation. GSAP is not imported into the shared lifecycle. Mermaid is loaded only for actual diagram content; its larger chunks are not evidence of an animation dependency regression.

## Where new motion would earn its place

Add these only after the P1 fixes and the timing/loop pass. They are interface ideas, not new canon or claims about fictional mechanisms.

| Place | Purpose and proposed effect | Proposed timing | Reduced-motion equivalent |
| --- | --- | --- | --- |
| Archive references | Connect an activated reference to its preview through a small rule or anchored opacity change; preserve hover/focus parity | 120–200ms | Direct preview plus focus/selected border |
| TOC and disclosures | Acknowledge the selected section or opened note; keep the text anchored | 120–180ms | Immediate persistent state marker |
| Search filters/results | Acknowledge the query, selected section, count, and completed result update as one state change | 100–180ms | Direct replacement with clear result status |
| Registry controls | Brief bracket or rule registration on the chosen filter rather than replaying all cards | 140–220ms | Static chosen bracket/rule |
| Character selection | Crossfade artwork while selected name, summary, counter, and destination update immediately | 350–500ms artwork only | Direct artwork replacement |
| Atlas selection | Finite selected-location emphasis and a pan whose duration reflects distance | 250–400ms | Snap to location and direct dossier display |
| Observatory comparison | Synchronize compared marks and the reading plates as one causal selection; build on existing finite tracing rather than adding another loop | 300–500ms | Static compared labels and highlighted relation |
| System experiments | Show the consequence of the visitor's action, then settle; retain waves over time only when time is the concept being explored | 300–700ms | Static before/after state with the existing explanation |
| Redactory passage | Carry the selected quill, inkpot, or papers from source to destination in one route sequence | 600–800ms total | Direct destination with the same object visible |
| Chapter composition | Expose artwork or a rule as one event; do not delay heading and action separately | 350–500ms | Fully composed chapter |
| Soundtrack playback | Use actual progress and a restrained active-track marker; synchronize decorative signals with real playing state | 120–200ms feedback | Static playing/paused marker and actual progress |

Do not add typewriter prose, text scrambling, cursor trails, universal parallax, decorative particle layers on articles, perpetual rotating seals, or repeated stamps on every click. They would compete with the records and make the strongest existing scenes less distinctive. Do not animate authored diagram topology into a new interpretation: any relation motion must preserve the actual reference model.

## A maintainable motion contract

The next implementation should expand the existing design authority rather than create a competing theme system.

- Define semantic timing roles for immediate feedback, local state, pane continuity, artwork, and authored route passage. Keep route values in `transition-system.css`; share only genuinely reusable local roles.
- Record each effect's owner, trigger, meaning, duration, interruption rule, reduced-motion equivalent, visibility policy, and cleanup responsibility.
- Keep CSS for simple declarative transitions, WAAPI for controlled dynamic snapshots, and GSAP for the Observatory's coordinated geometry. Do not migrate every hover or fade into a timeline.
- Create small shared utilities only where actual duplication exists: cancellable debounce, visibility-gated loop management, and live motion preference handling. Avoid a new global animation manager that becomes a second lifecycle owner.
- Preserve default-visible content and progressive enhancement. A transition can be absent without making the record absent.
- Keep focus and interactive state tied to the real interface state, not just its final opacity or position. Test the period during opening, interruption, and closing.
- Maintain separate behavior for first arrival and repeated interaction. Observatory's return skip is a useful precedent.
- Distinguish ambient, reactive, relational, and navigation motion. The brighter or larger signal should generally be caused by an action.

The proposed shorter durations would revise some currently documented values, including the 480ms default and 1050ms Search profile. That would require a deliberate update to `docs/design-system.md` alongside source changes. This audit does not silently redefine those tokens. Similarly, making grain static or visibility-gated preserves the documented material while changing its animation policy.

## Prioritized implementation sequence

1. **`$impeccable harden`** — fix F1/F2/F3 and the delayed-work ownership in F9, and investigate F10: Redactory redirect cancellation/immediate routing, visible-by-default reveals, Atlas inertness/focus, cancellable search work, and WebKit return-navigation failures.
2. **`$impeccable animate`** — implement complete live reduced-motion behavior, explicit gallery control, immediate selection state, shorter repeated interactions, and one Redactory passage.
3. **`$impeccable quieter`** — reduce repeated text choreography and clarify the hierarchy between threshold, instrument, and record.
4. **`$impeccable optimize`** — stop offscreen loops and profile layout, grain, full-stage filters, and ink composition on representative devices.
5. **`$impeccable document`** — update the existing visual authority with timing roles, visibility policy, replay rules, and intentional reduced states.
6. **`$impeccable polish`** — verify perceived continuity, keyboard behavior, first/repeat visits, both locales, narrow screens, and interruption after the fixes.

A framework replacement would add risk without addressing the central problems. The work is a sequence of targeted repairs and a clearer motion direction.

## Validation and evidence

- `npm run check`: passed, 142 files, zero errors/warnings/hints.
- `npm run build`: passed; 295 routes built. Initial sandbox attempts failed local module/realpath resolution; rerunning outside the restricted sandbox passed without source or dependency changes.
- Existing Chromium browser suite: **62/62 passed**. This includes route lifecycle, repeated character navigation, modal focus/cleanup, Redactory, Observatory interaction/reduced motion, responsive routes, diagrams, and the lab.
- Additional runtime inventory: **24 routes in desktop normal motion and 390px reduced motion, 48 route checks total**; no captured page errors or document-width overflow. These checks include both locales on Home and Observatory and all principal page families.
- Independent rendered review: Home, character selection, Observatory overview/focused reading, and Redactory on desktop; Characters and Observatory on a 390px viewport. Screenshot review also covered representative desktop and reduced-motion captures.
- Targeted runtime failures: delayed Redactory redirect after reaching Home; invisible Organization/Cosmology headings without JavaScript; reduced-mode animation gaps; continued character pointer motion after a live preference change; closed Atlas dossier keyboard focus.
- Cross-engine navigation and character regression attempt: **WebKit 9/11 passed**. The character dossier return check stayed on the detail URL with a character query, and the section-return check stayed on Atlas after activating Home. **Both failed again in a targeted two-test rerun**; their causes remain unassigned (F10). **Firefox's 11 checks could not start** because its browser process failed to launch (`browserType.launch: spawn UNKNOWN`). The Firefox result is an environment limitation, not a demonstrated website failure.

The bundled Impeccable detector returned **880 suggestions across 38 files: 871 advisory and 9 warning**. Most are font-size/color/radius token advisories. They are not 880 animation defects. The two bounce findings match keyframe names rather than elastic easing; the two image findings concern initially inert modal placeholders populated before opening; the rounded accent border is an ink trace; and bespoke scales/accents are explicitly permitted by the visual authority. The detector missed the important timer, hidden-focus, and no-script failures. Findings in this report were verified separately.

Raw detector output is retained locally at `.impeccable/motion-assessment-b-detector.json`. Runtime JSON and screenshots are retained in the session's visualization output directory, outside application source.

**Limits:** headless Chromium and emulated viewports do not prove physical-device touch behavior, hardware frame smoothness, energy consumption, or screen-reader experience. No complete flash-threshold, contrast, or WCAG conformance assessment was performed. Not every canonical entry was individually opened: shared route/layout ownership was inspected and representative variants were exercised. Search's post-teardown URL race remains source evidence, while the Redactory race and Atlas focus issue were reproduced.

## Product decisions for the next pass

The audit can be acted on without answering these first, but the answers would shape optional motion work:

- Is a repeat visit primarily a lookup session, an immersive exploration, or an explicit choice between both?
- Should character imagery advance automatically at all on reading pages?
- Should the approximately 3.4-second first Observatory entrance remain the signature duration, given that it already dismisses on user intent?
- Should an explicit site motion preference supplement the operating-system preference, allowing cinematic passage with still reading surfaces?
- Which real phone or low-power device should define the performance budget?

The primary recommendation is to repair control and reliability, then give the existing signature motion more room by making routine use quieter and faster.
