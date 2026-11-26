# Motion in SiNE Archives

The Circular Emblem and the reflected wave share one point of impact and one clock. React renders the emblem, typography and controls as ordinary content. The optional canvas draws light on the obsidian underneath them. See the [Imperial Obsidian design philosophy](DESIGN_PHILOSOPHY.md) for the visual principles.

## Shared motion

The application root mounts `MotionProvider` from [system.tsx](src/motion/system.tsx). It supplies Motion for React, the user's reduced-motion preference and the shared easing curve. Import lightweight elements as `m` from `motion/react`. Control feedback lasts 180 ms. The language selector moves and resizes its inset over 300 ms with the same easing curve and updates immediately with reduced motion. The shared `reveal` variant settles over 650 ms with cubic Bézier control points (0.22, 0.68, 0.22, 1).

For a new interaction, define its settled, keyboard-accessible state first. Reuse the provider and tokens for its transition. Use a Motion value for continuously changing properties and React state for discrete changes. Read `useMotionPreference()` for effects outside Motion, including shaders, scrolling and CSS animations. The existing Systems study loads its own GSAP and Flip code on entry.

## Source map

| To change | Start here |
| --- | --- |
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

The approved master is `The Archive/Artworks/Design Systems/SiNE-Circular-Emblem.svg` in the sibling archive checkout. Its bundled copy is [SiNE-Circular-Emblem.svg](src/art/SiNE-Circular-Emblem.svg). The smaller masthead uses the separate principal logo. The Grand Index at `#archive-index` stretches one transform track across the registered exhibitions. The mouse previews eight percent of the adjacent room. Leaving reverses the preview, and selecting continues from the current position using the shared 650 ms settle and easing tokens. Under reduced motion, selection is immediate and hover leaves the rooms stationary. The entrance score is independent. For direct interaction review, open [the index in Zen](http://localhost:5174/#archive-index).

Use the root Windows launcher for the live preview and check it in Zen Browser. Run `npm run build` and `npm test` for the Chromium regression suite. Where the test runner cannot connect to local sockets, the existing `SINE_TEST_DIST=1` option serves built assets through Playwright request interception. This verifies the production bundle independently of the Windows server connection. Sequence screenshots are written under `test-results/awakening/`. Frame timing depends on the browser, GPU and viewport.

For visual changes, inspect the impact and propagation captures for one readable crest, then compare the fallback capture. In Zen, use the development replay with the pointer still until the emblem appears. Watch the wave pass the corners and the Index link arrive last. [Awakening tests](tests/awakening.spec.ts) cover sequencing, resizing, context loss, session behavior and keyboard access. [Systems tests](tests/systems.spec.ts) cover locale switching and navigation from the directory into the records.

## Characters exhibition

Open [Characters](http://localhost:5174/#/characters/lenore-engelmeyer/biography) and activate **Registry of Individuals**. The native modal rises one viewport over the shared 650 ms settle curve. The hero and reading surface stay mounted beneath it. Escape, Return to record, Back, or selecting the current subject lowers the same surface. Opening adds a same-URL history entry so Back and Forward can dismiss and reopen discovery.

[CharactersShowcase](src/grand-index/CharactersShowcase.tsx) stages only the intended hero and awaits the mounted image’s responsive decode. The selected frame and localized status acknowledge input during the wait. Another choice, dismissal or route departure invalidates the pending result. On success, the selected record replaces the discovery history entry and opens Overview. The original record and section remain one Back away. The gallery measures the frame at handoff. A rectangular opening through the gallery grows from its center to its bounds in the first 23% of the 650 ms settle, then expands to the viewport. Percentage coordinates adapt to a resize. The exposed surface is the actual character interface, so the portrait keeps its original proportions and the hero needs a single display element. Browser-driven record changes outside discovery retain the ordinary 300 ms hero fade. Failed delivery reveals the requested record’s localized unavailable state. Reduced motion skips the travel and aperture.

Replay both directions between Le’nore and Hisui. Review the gallery, selection mask and reading state at desktop and phone sizes. [Character regressions](tests/characters.spec.ts) write captures under `test-results/react-review/`. For deliberate network and decode waits, see [publication regressions](tests/publication.spec.ts).

The centered floor chevron reveals its localized return label on hover or keyboard focus. Touch shows the label at rest. The frame and placard rise together by 3px over the 300ms selection interval. Edge, shadow and threshold feedback use the 180ms control interval. One wall reflection follows the attended exhibit and settles over 400ms. Scrolling updates its horizontal position directly. Activation holds the visible frame transform for the measured reveal. Reduced motion retains optical feedback with immediate placement.
