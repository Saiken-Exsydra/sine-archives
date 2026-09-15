# Systems Observatory

The Observatory is a conceptual map, not a literal depiction of an atemporal Archive moving through physical space. Existing system routes, site chrome, symbols, content collections, and canonical files remain authoritative.

## Ownership

- `src/data/observatory.ts`: localized explanatory copy, system identities and destinations, concept types, parents and children, explicit relationships, source links, and field behavior metadata.
- `src/components/systems/SystemsObservatoryPage.astro`: the existing route composition, accessible map controls, relationship inspection and compact destination disclosure.
- `FloatingSystemPage.astro` and `ArchiveIntroduction.astro`: server-rendered introduction templates. The Archive has its own explanation rather than becoming an equivalent seventh system.
- `src/scripts/observatory/controller.ts`: content state, keyboard/pointer feedback, concept lineage, contextual definitions, comparison, and focus return.
- `src/scripts/observatory/motion.ts`: interruptible GSAP entrance, page collapse/unfold, focus shift and relationship travel. Snapshots are inert and hidden from assistive technology.
- `src/scripts/observatory/archive-field.ts`: the single decorative Canvas loop. `ArchiveField.astro` remains its markup owner. The Observatory uses the existing sphere component in compact mode without its second Canvas controller; other sphere consumers retain their behavior.
- `src/styles/observatory.css`: feature-local layout and motion styling, using existing site tokens. Global route snapshots remain owned by `transition-system.css`.

## Navigation and lifecycle

`#map`, `#archive`, `#redactory`, `#redactory/anchor`, and `#redactory/anchor/reach` represent meaningful states. Other system concepts follow the same pattern. Links keep real URLs, including modified-click behavior. The lifecycle module's `navigateObservatory` helper calls Astro's existing `navigate` API; Astro owns history indexing and scroll restoration. No custom history stack or SPA router is introduced. Back, Forward, direct links and full-entry return navigation are covered by tests.

One keyed `registerPageInit` registration initializes current DOM on each eligible route. Its cleanup cancels Canvas frames, disconnects observers, aborts listeners, dismisses definitions, removes animation snapshots and reverts the GSAP context. The persistent registration is guarded by the Observatory root and keeps neither old route data nor detached roots.

Entrance lasts approximately 3.4 seconds and can complete immediately on pointer or keyboard input. Return visits in the same client session, deep links and history traversal skip the full entrance. Reduced motion shows the complete static map directly, changes content without spatial travel, and draws the Canvas only when state or geometry changes.

## Authoring and canon

The controlling sources audited were the Archive Codex, Redactory Codex, Resonance Codex, Interface Doctrine and the existing public Redactory, Resonance, Bloom, Divination, Shores and Harmonics interfaces. Public source links are carried by every system, concept and relationship. No canon file was rewritten.

The first Redactory view exposes Dive, Anchor, Route and Reach. Major concepts open pages; definition concepts open dismissible native popovers without history entries. Practice and danger definitions appear only in relevant deeper pages. Parents remain visible as linked lineage. Text links, concept nodes, route geometry and the background share explicit concept IDs.

Remaining systems use the same grammar with deliberately smaller introductory sets: gradients and fields, recurrence, Pathway and Communion, Rootline, and Shorefall/Shorewalking. Expand these only from controlling material. Harmonics has an existing interactive route but no standalone public Harmonics codex; its source links retain the existing Resonance public entry and Harmonic Array. No Stars node or mechanics were fabricated because no existing Stars system route was found.

The decorative field expresses routing, coherence, recurrence, fusion, biological rooting and threshold emphasis through small changes to the same network. These are explanatory motifs, not new mechanics. Relationship records describe specific shared conditions while retaining distinct system verbs. Comparison of pairs without a recorded direct relationship presents their sourced descriptions and common Archive context without asserting a new causal link.

## Responsive and accessible behavior

Desktop retains a spatial constellation beside an anchored, unboxed reading surface. Phones use a compact Archive point above a stable system selector, then an inline reading surface. Relationship explanations are available as text controls at every width; SVG edges are additionally keyboard-operable on desktop in relationship mode. All main concepts remain HTML links or buttons. Active nodes expose `aria-current`; definitions manage focus, Escape and dismissal. Lineage has an accessible name and textual links. The Canvas is decorative.

## Performance and validation

The field uses 210 points on desktop and 90 on phones, a maximum of two precomputed neighboring edges per point, capped pixel density and a roughly 30 fps render cadence. It stops when the document is hidden or the Observatory leaves the viewport. No per-frame DOM layout is performed by the field. Finite GSAP travel moves a single SVG marker; all timelines are disposed on route teardown.

`tests/observatory.spec.ts` covers the complete Redactory journey, direct links, Back/Forward, Escape, focus, definitions, cross-system travel, comparison, all six system concept sets, Portuguese, reduced motion, five viewport widths, repeated client navigation, and stopped painting on detached canvases. The existing transition smoke test now opens the introduction before following its retained full-interface link.

The repository's standard check, build and all-browser regression commands remain the validation entry points. No packages, deployment settings, environment settings, or canonical files are changed by the feature. Existing uncommitted GSAP manifest and lockfile changes are preserved.

### Validation results — 2026-09-13

- `npm run check`: 138 files, zero errors, warnings or hints.
- `npm run build`: passed, 293 pages; encoding and archive-reference checks passed.
- Observatory coverage: all 12 tests passed on Chromium, Firefox and WebKit (36 cases), including interrupted relationship travel. That regression first reproduced a marker remaining visible after switching systems mid-travel; the motion controller now resets unfinished path and marker styles before each transition.
- Transition coverage: all nine cases passed on Chromium and Firefox; seven passed on WebKit across focused batches (25 of 27 cases). WebKit still fails the character dossier return because the target page/context/browser closes, and map-to-home navigation in the section-index test because the URL remains `/places/map/`. Both failures repeated in isolated diagnostics, including an increased overall test timeout. Neither test enters the Observatory.
- The separate WebKit character-history test also reproduced a closed page/context/browser at the dossier return. Its Chromium and Firefox variants passed in the broader run. Character and map source files were not changed; these unresolved WebKit failures prevent reporting the whole suite as green.
- The broader `npm test` run before the final interruption fix recorded 135 passes, one WebKit character failure and five unrun cases at its 15-minute global limit. Final feature and transition checks were split into bounded batches afterward; this is not a single full-suite passing run.
- Desktop and phone screenshots were inspected, alongside keyboard, focus return, definitions, Portuguese, reduced motion, and viewport coverage from 320 to 1920 pixels. No deployment was performed.


## Interaction and visual depth pass

The existing map, source copy, hash navigation, and entrance remain the foundation. Desktop marks grow from 56 to 96 pixels; phone marks grow from 40 to 64 pixels, with an 84-pixel tablet step. The Archive retains a central point and fine registration rings rather than taking a system symbol.

Motion has four responsibilities:

- **Ambient:** slow Canvas drift and CSS halo breathing. Desktop density stays at 210 points, tablets use 140 and phones 90. Neighbor links are computed only on resize.
- **Reactive:** pointer samples are coalesced into animation frames, a GSAP quickTo pair moves the chart by at most five/four pixels, and local Canvas light follows proximity. At most three fading observation waves brighten nearby edges without drawing literal ripple circles. Decorative system tracery uses branch, echo, interval, thread, unfolding and horizon gestures; this is visual behavior, not new canon.
- **Relational:** a single interruptible GSAP path-highlight family answers hover, keyboard focus, selection and comparison. Archive observation responds along all six primary paths. Only explicit source relationships activate secondary links. Old pulse and symbol contexts are reverted before replacement.
- **Transitional:** the existing seam reveal remains, while chart reframing preserves symbol proportions, local concepts emerge in a short stagger, and the existing reading fragment opens from its source. Mode changes use the same motion owner.

Follow a point is now an explicit mode with localized guidance and visible onward concept targets. Comparison keeps the selected systems equally emphasized in the central chart and displays their sourced summaries in opposing reading plates (inline on phones). Its detail shows the recorded shared/different relationship, or the existing common Archive context when no direct relationship is recorded. Switching modes and deselecting nodes clear prior comparison detail.

Concept branches are measured from their actual HTML anchors and only exist for actual concepts. Optional related concept IDs can extend a local constellation through the existing concept renderer. Source content is unchanged.

Systems and concepts can define optional image metadata with src, meaningful localized alt text, and a caption. Redactory uses its existing public entry artwork in the focused fragment. Missing images produce no figure or placeholder. The source art keeps its colors; the plate adds only thin rules and faded side edges.

All new interaction remains keyboard-accessible. Reduced motion keeps semantic visibility but suppresses parallax, pulse travel, symbol motion and Canvas drift. Fine-pointer reactions are disabled on phones and touch input. Page cleanup aborts listeners, stops pending frames, disconnects observers and reverts GSAP contexts. The field stops drawing when hidden or offscreen.


### Visual depth verification — 2026-09-13

- Final source check: 138 files, zero errors, warnings or hints. Final production build: 293 pages; content, encoding and archive-reference checks passed.
- Observatory regression: all 15 cases passed in Chromium and Firefox. WebKit initially passed 13 of 15 while the navigation suite ran concurrently; its complete isolated rerun passed all 15, including the two initially failing repeated-navigation and all-system exploration cases. This is coverage across separate runs, not a claim that the first combined run passed.
- Navigation suite: 25 of 27 passed. The remaining WebKit character-dossier return and Places-map-to-home failures reproduce the previously documented failures above, outside the Observatory. No character, map or shared navigation source was changed in this pass.
- Visual review: overview, hover, intermediate focus frames, focused reading, opposing comparison plates, 768-pixel tablet layout and 390-pixel phone art/comparison. Browser coverage also checks 320/390/768/1440/1920 pixels, keyboard definitions and comparison, Portuguese, reduced motion, interrupted travel, and teardown of detached Canvas instances.
- A transition-frame review found horizontal symbol stretching during chart resizing; counter-scaling now preserves their silhouettes and typography. Local concept branches terminate at the real anchors. The final mode reset also clears obsolete relationship pressed states.
- Firefox could not create pages inside the filesystem sandbox. An isolated homepage check succeeded outside it, after which the regression runs used that environment. No dependencies or browser packages were changed.
- Review evidence is local in .tmp/observatory-depth/. Existing uncommitted work was preserved on codex/observatory-visual-depth. No deployment was performed.
- The final guided/comparison/relationship-reset case also passed on Chromium and Firefox after the last accessibility edit (2 of 2); WebKit includes that edit in its full 15-case passing rerun.
