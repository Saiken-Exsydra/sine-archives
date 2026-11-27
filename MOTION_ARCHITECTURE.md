# Motion in SiNE Archives

The Circular Emblem and the reflected wave share one point of impact and one clock. React renders the emblem, typography and controls as ordinary content. The optional canvas draws light on the obsidian underneath them. See the [Imperial Obsidian design philosophy](DESIGN_PHILOSOPHY.md) for the visual principles.

## Shared motion

The application root mounts `MotionProvider` from [system.tsx](src/motion/system.tsx). It supplies Motion for React, the user's reduced-motion preference and the shared easing curve. Import lightweight elements as `m` from `motion/react`. Control feedback lasts 180 ms. The language selector moves and resizes its inset over 300 ms with the same easing curve and updates immediately with reduced motion. The shared `reveal` variant settles over 650 ms with cubic Bézier control points (0.22, 0.68, 0.22, 1).

For a new interaction, define its settled, keyboard-accessible state first. Reuse the provider and tokens for its transition. Use a Motion value for continuously changing properties and React state for discrete changes. Read `useMotionPreference()` for effects outside Motion, including shaders, scrolling and CSS animations. The existing Systems study loads its own GSAP and Flip code on entry.

## Source map

| To change | Start here |
| --- | --- |
| Pearl Spectrum reveal on lettering, edges or glass | [Shared optical styles](src/grand-index/pearl-interaction.css) and [surface precedents](DESIGN_PHILOSOPHY.md#pearl-spectrum-in-practice). Use the 300 ms selection interval for reveal and the 180 ms control interval for withdrawal. |
| Shared easing, durations or reduced-motion behavior | [Motion provider and tokens](src/motion/system.tsx) |
| First interaction, phase changes or reveal intervals | [Awakening controller](src/landing/sequence.ts) |
| How the emblem, wordmark and controls follow the clock | [ArchiveHome](src/landing/ArchiveHome.tsx) and [landing layout](src/landing/landing.css) |
| Ripple width, damping, light or resolution | [Material parameters](src/motion/obsidian/material.ts) and [fragment shader](src/motion/obsidian/surface.frag.glsl) |
| CSS crest, fallback timing or resizing | [Surface stylesheet](src/motion/obsidian/surface.css) and [ObsidianSurface](src/motion/obsidian/ObsidianSurface.tsx) |
| Index link, scroll fade or pulse | [ScrollIndicator](src/landing/ScrollIndicator.tsx) |

## Landing sequence

[sequence.ts](src/landing/sequence.ts) owns the four phases and the timing score. A fresh visit starts dormant. Meaningful pointer movement, a press, touch or a scroll starts the awakening. The first event fixes the start time. The surface and interface then sample elapsed time independently from that same timestamp.

| Track | Time after interaction |
| --- | --- |
| Reflected wave | 0–3.5 s |
| Emblem rises | 0.4–1.6 s |
| ARCHIVES appears | 0.8–2.1 s |
| Institutional motto appears | 1.65-2.55 s |
| Masthead appears | 1.7–2.9 s |
| Language and fullscreen controls appear | 2.0–3.2 s |
| Index link appears | 2.7–3.5 s |

At 3.5 s the interface is manifested and the canvas unmounts. Scrolling 22% of the hero height enters exploration and can finish the introduction early. Returning above that threshold restores the manifested composition. The Index link focuses the directory and uses native scrolling. Its hairline pulse pauses offscreen and while the document is hidden.

The homepage uses native vertical scroll snap for the entrance and Grand Index. Both sections follow the dynamic viewport height. If a viewport resize displaces an already aligned Grand Index, the existing scroll observer restores its position immediately. The document ends at the Grand Index, and its horizontal domain track uses that same height throughout selection. On short displays, exhibit text and links can scroll within their own regions. Scroll down and back up in Zen, then resize or toggle fullscreen with the Grand Index in view to check that the current section stays aligned.

Keyboard input releases the controls before the browser processes the original keystroke. Dormant visitors using assistive technology can activate “Open the archive.” Reduced motion gives immediate access, skips the canvas, disables the pulse and uses immediate index scrolling. Direct routes also bypass the introduction.

A completed or intentionally skipped introduction sets `sine.awakening.v1` in session storage. An interrupted introduction can replay on refresh. When storage is unavailable, the current document remembers completion during navigation. For a fresh development preview, open [Replay in Zen](http://localhost:5174/?replay=1#/). The development build consumes the query parameter on load.

## Obsidian material

[ObsidianSurface](src/motion/obsidian/ObsidianSurface.tsx) accepts a start timestamp from `performance.now()` in milliseconds and an optional material configuration. A null start produces the static CSS finish. [material.ts](src/motion/obsidian/material.ts) defines the normalized origin measured from the bottom left, amplitude, damping, strength of reflection, wavefront width, duration and resolution limits.

The [renderer](src/motion/obsidian/renderer.ts) draws one fullscreen triangle. The [fragment shader](src/motion/obsidian/surface.frag.glsl) computes a single broad crest in units of the shorter viewport edge. Its travel distance includes the farthest corner and enough margin for the crest to leave the frame. Its slope tilts reflected light. A resize updates the drawing buffer and aspect correction. The backing store targets at most 1.25 device pixels per CSS pixel and approximately 786,432 pixels in total.

The surface starts with a layered CSS reflection and loads the shader on demand. Failed initialization or context loss leaves the reflection running on the same clock. Restoring the context recreates the GPU resources at the current time. The renderer suspends drawing when hidden or offscreen. Cleanup cancels frames and animations, disconnects observers, removes listeners and releases the WebGL resources.

### Tuning the single crest

The shader uses the slope of one Gaussian crest. Its width is measured against the shorter viewport dimension, so a circle stays circular in portrait and landscape. Amplitude and reflection control the visible contrast. Damping acts on elapsed progress. Travel speed follows from the distance to the farthest corner plus four crest widths, divided by the duration. If the duration changes, review the overlapping reveal intervals in the timing score.

The fallback uses one radial gradient with adjacent shadow and highlight stops. Its innermost transparent stop is at 69% of the gradient radius. The resize calculation uses that same fraction to put the trailing edge at the farthest corner at full scale. Keep those two values together when adjusting the gradient. Check both renderers after changing the appearance.

## Assets, routes and verification

The approved master is `The Archive/Artworks/Design Systems/SiNE-Circular-Emblem.svg` in the sibling archive checkout. Its bundled copy is [SiNE-Circular-Emblem.svg](src/art/SiNE-Circular-Emblem.svg). The smaller masthead uses the separate principal logo. The Grand Index at `#archive-index` stretches one transform track across the registered exhibitions. Domain titles carry a stationary pearl inscription. Hover or keyboard-focus a domain entry or Systems record to uncover the spectrum within its lettering over 300 ms. The edge labels reveal it along their vertical reading direction on desktop and horizontally on phones. Leaving covers the lettering over 180 ms, and reduced motion shows the state immediately. The mouse previews eight percent of the adjacent room. Leaving reverses the preview, and selecting continues from the current position using the shared 650 ms settle and easing tokens. Under reduced motion, selection is immediate and hover leaves the rooms stationary. The entrance score is independent. For direct interaction review, open [the index in Zen](http://localhost:5174/#archive-index).

Use the root Windows launcher for the live preview and check it in Zen Browser. Run `npm run build` and `npm test` for the Chromium regression suite. Playwright loads the production bundle directly into Chromium through request interception, without starting a local server. Sequence screenshots are written under `test-results/awakening/`. Frame timing depends on the browser, GPU and viewport.

For visual changes, inspect the impact and propagation captures for one readable crest, then compare the fallback capture. In Zen, use the development replay with the pointer still until the emblem appears. Watch the wave pass the corners and the Index link arrive last. [Awakening tests](tests/awakening.spec.ts) cover sequencing, resizing, context loss, session behavior and keyboard access. [Systems tests](tests/systems.spec.ts) cover locale switching and navigation from the directory into the records.

## Individual examination

On [Ec’lesia’s Overview in Zen](http://localhost:5174/?lang=en#/characters/eclesia-wonderwall), hover Redactory, hold, then move away. A fine edge with a softened upper boundary uncovers the stationary Pearl Spectrum from left to right over the shared 300 ms selection interval. Leaving covers it again over the 180 ms control interval. Biography uses the same timing on a translucent surface while Overview keeps its selection rail. On Grand Index the reveal travels through the lettering. The dossier controls catch an upper edge, and language and fullscreen controls catch a shallow reflection. Keyboard focus adds the existing outline. Touch provides press feedback and reduced motion immediately shows the corresponding state. Repeat in Portuguese and on a narrow viewport to see the selected tab’s rail move to its upper edge.

Open the [examination replay](http://localhost:5174/#/characters/lenore-engelmeyer) and move between Overview and Biography. The right reading edge stays anchored. On desktop the common caption container widens inward by up to 80px over the 300 ms selection interval. Its category, name, designation, divider and section content move together. The name uses a stable measure drawn from the Overview territory, while the phone layout keeps fixed gutters. Navigation and the decoded hero stay stationary. Prose enters from 5px below. The outgoing layer becomes inert immediately and fades over 180 ms. When the identity leaves less than 112px, the complete examination territory becomes the scroll surface. With the reading panel focused, Home and End jump to the bounds of that surface. The active reading surface resets its scroll on a record, section or locale change. The tab receiving keyboard activation keeps focus.

The upward Registry chevron and its localized label are visible at rest. The centered desktop target spans 280–360px by 66–80px. The phone target is 64px high, clears the bottom safe area and reserves space beneath the examination tabs. The chevron’s highlight varies in opacity over a 5.2-second cycle. Attention across the target strengthens the floor reflection over 180 ms, and direct hover or visible keyboard focus gives it its strongest reflection. Activation still opens the Registry. The highlight rests at a fixed intensity under reduced motion and pauses while the Registry or dossier is open.

Replay the threshold in Zen over both Le’nore’s and Hisui’s artwork. Move the pointer into the outer area, across the chevron, then away. Use Tab and Enter to open the Registry and Escape to return focus to the threshold. Check narrow or short layouts with a long name and confirm that the entire heading follows the reading territory. [Examination regressions](tests/examination.spec.ts) cover all four sections and an isolated long-name publication.

## Characters exhibition

### Grand Index threshold

Open the [Grand Index in Zen](http://localhost:5174/#archive-index), choose **Open Characters**, then return through **Grand Index**. Browser Back and Forward can replay the crossing. The featured hero keeps its responsive source, crop and mounted image element. Its desktop and phone lighting layers blend over the shared 650 ms settle. [CharacterThreshold](src/grand-index/CharacterThreshold.tsx) measures the name and designation in both layouts. Matching lines travel word by word. When the name wraps differently or fills the reading area, the heading travels as a block with the designation beneath it. The layout keeps its native wrapping and scrolling. An interrupted crossing starts from the visible position. A viewport resize settles the text in the new layout.

| Interface | Opening | Returning |
| --- | --- | --- |
| Name, designation and lighting | 0–650 ms | 0–650 ms |
| Index breadcrumb, arrows, featured note and entry | Withdraw over 180 ms | Reappear over 180 ms. The featured label waits until 380 ms to clear the returning name. |
| Examination label, left navigation, return and top controls | 70–370 ms | Withdraw over 180 ms |
| Reading panel | 235–535 ms on desktop and 280–580 ms on phones | Withdraws over 105 ms to clear the moving name |
| Registry threshold | 145–445 ms | Withdraws over 180 ms |

The Grand Index supplies the featured record to the Characters exhibition. A change to that selection stages the new hero in the Index. The visible name, entry link and examination route continue to identify the current portrait until the new hero decodes. Selecting **Open Characters** uses the displayed record, and the shared movement follows its identity. An Index selection change alone does not start the examination transition.

Try the return again after selecting another Registry portrait. The Index restores its current featured selection. The outgoing portrait and identity hold until the featured image decodes, then dissolve into the featured composition over 300 ms. Index navigation and keyboard focus follow the route immediately. Direct examination links and reloads settle in place. Reduced motion removes travel and fades. Repeat on a phone and in Portuguese, then check keyboard focus and the name on a short viewport. [Threshold regressions](tests/character-threshold.spec.ts) capture the crossing in `test-results/react-review/`.

### Registry handoff

Open [Characters](http://localhost:5174/#/characters/lenore-engelmeyer/biography) and activate **Registry of Individuals**. The native modal keeps the hero and reading surface mounted underneath. A single smoky backdrop fades in over the shared 300 ms selection interval as the glass panel rises over 480 ms. The grid and return control travel together. Escape, Return to record, Back, or selecting the current subject lowers the panel over 390 ms. Opening adds a same-URL history entry so Back and Forward can dismiss and reopen discovery.

[CharactersShowcase](src/grand-index/CharactersShowcase.tsx) stages only the intended hero and awaits the mounted image's responsive decode. The pending card and localized status acknowledge input during the wait. Another choice, dismissal or route departure invalidates the pending result. The requested record replaces the discovery history entry and opens Overview. The original record and section remain one Back away.

Selecting a new subject reveals the decoded hero through a rectangular opening in the glass and smoke. The opening grows from the center of the selected portrait to its visible bounds in the first 23% of the 650 ms settle, then expands to the viewport. The Registry measures the portrait against the vertical scroll area at handoff. If the user has scrolled the card out of view, the reveal uses its activation position. Percentage coordinates adapt to a resize. Closing the Registry without a new subject keeps the downward motion. Failed delivery uses the downward motion and shows the requested record's localized unavailable state. Reduced motion settles the glass and hero immediately.

Replay both directions between Le'nore and Hisui. Review the glass, vertical browsing and the resulting record at desktop and phone sizes. The centered return control remains visible. A hovered card rises 5px, scales to 1.018 over the shared 180 ms control interval. The stationary spectrum reveals itself across the name and lower glass bevel over 300 ms and withdraws over 180 ms. A pending selection holds the reflection through the aperture. Reduced motion keeps the optical feedback and skips the lift. [Character regressions](tests/characters.spec.ts) write captures under `test-results/react-review/`. For deliberate network and decode waits, see [publication regressions](tests/publication.spec.ts).

### Complete Dossier expansion

Dossier Mode retains the mounted individual, its decoded hero and the examination section. The shared `settle` token (650 ms) coordinates the artwork translation and the inward reveal of the obsidian reading surface. The glass seam carries a tapered Pearl Spectrum reflection. It brightens when a contents control receives pointer or keyboard attention. Contents lettering reveals the shared spectrum over 300 ms and withdraws over 180 ms. The current heading retains its pearl rail and spectral lettering during reading. The seam follows the revealed edge while the document holds its reading geometry. Over the 180 ms control interval the navigation retracts slightly as it fades, the caption and Registry threshold fade, and Close Dossier comes into view. Focus moves to Close Dossier as soon as the outgoing controls become inert. Closing reverses the geometry and returns focus to Complete Dossier in the preceding section. A direct visit closes to Overview. Ordinary section changes retain their 300 ms transition.

On desktop the surface starts near the left third and reaches the right and lower viewport edges beneath the shared header. Close Dossier occupies the lower-left navigation territory. At tablet widths the contents fold into a disclosure. On phones the seam forms a horizontal sill beneath the character, and the close control sits in a fixed footer with space reserved below the scroll region. When a long title and short viewport leave too little room, the dossier layout itself can scroll to make the full title and document reachable. Reduced motion settles the composition immediately and uses instant heading navigation.

In Zen, open an examination section in the isolated preview and choose Complete Dossier. Watch the seam and artwork settle together, scroll into the document, then choose Close Dossier to verify that the preceding section and focus return. Replay both directions and interrupt either before it settles. The bilingual publication fixture in [dossier.spec.ts](tests/dossier.spec.ts) exercises the same sequence without private editorial material.
