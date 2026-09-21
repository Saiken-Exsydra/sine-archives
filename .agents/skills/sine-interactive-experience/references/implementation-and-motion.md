# Implementation and motion

## State and browser history

Classify each state before choosing storage or navigation architecture:

- Does it represent a distinct concept worth revisiting or sharing?
- Must it survive refresh?
- Is it a transient visual state, a contextual selection, an overlay, or a navigable destination?
- Should Back undo it, close it, leave the page, or do nothing?
- Does Forward need to restore it?

Evaluate routes, nested routes, URL parameters, hashes, `history.pushState`, `history.replaceState`, or a local state model. Use the least complex model that preserves the intended semantics. Meaningful deep states should generally have a stable URL and survive refresh, or have an explicitly designed fallback that retains orientation.

Exercise a representative journey such as A → B → C → D, then verify browser Back returns D → C → B → A where that matches the conceptual journey. Verify Forward, direct entry, refresh, and reload after a deep link. Animation must respond to history restoration without corrupting or duplicating state.

## Semantic motion

Every significant animation must do at least one useful job:

- show origin or destination;
- preserve spatial continuity;
- communicate hierarchy or relationship;
- direct attention;
- confirm interaction;
- express environmental atmosphere;
- communicate system state.

Remove motion whose sole rationale is that it looks impressive. SiNE motion should feel precise, restrained, elegant, slightly uncanny, responsive, layered, and deliberate. Avoid particle spam, exaggerated elastic motion, mobile-app bounce, neon cyberpunk effects, and restless parallax.

Keep text readable and state changes understandable during motion. Define interruption behavior before implementation: complete, reverse, cancel, retarget, or snap to a stable state.

## GSAP

Use GSAP where it provides real coordination: timelines, multi-element transitions, camera-like movement, staged reveals, SVG line animation, transform choreography, interpolation, hover/focus responses, and entrance/exit sequences.

- Prefer a coherent timeline or small animation system over independent ad-hoc tweens that compete for the same properties.
- Give each animation an owner and define what happens on retarget, reversal, rapid input, route change, and teardown.
- Kill timelines, tweens, delayed calls, and GSAP contexts during cleanup.
- Remove listeners, observers, timers, and animation frames in the same lifecycle that created them.
- Use the repository's `window.registerPageInit` convention. Query the current DOM inside the initializer and return cleanup.
- If React is introduced or already involved, scope animation to the component lifecycle and ensure mount/unmount does not duplicate contexts or leave stale targets.
- Preserve reduced-motion state semantics while reducing distance, duration, sequencing, parallax, and continuous movement.

Do not create route-level transition CSS outside `src/styles/transition-system.css`.

## High-frequency pointer response

Avoid framework or component-state updates for every pointer event. For continuous pointer-reactive experiences:

- capture target coordinates in refs or local mutable values;
- update presentation in a single `requestAnimationFrame` loop;
- interpolate with lerp or time-aware smoothing;
- prefer transform and opacity;
- batch and restrain DOM writes;
- throttle only when the lower update rate remains perceptually smooth;
- stop the loop when hidden, offscreen, unmounted, or inactive.

Pointer behavior should be continuous rather than twitchy. Clamp extremes, account for viewport changes, and give keyboard/touch users an equivalent way to reach the underlying state or information.

## SVG, DOM, Canvas, and WebGL

Start by deciding whether DOM/SVG plus CSS and GSAP can express the experience cleanly.

Use SVG for connections, animated paths, masks, clipping, markers, geometry, and scalable symbols. Keep interactive nodes as semantic links or buttons even when the connection layer is separate and non-interactive.

Use Canvas, PixiJS, Three.js, or WebGL only when they provide a concrete advantage, such as very large animated node counts, sophisticated particle fields, shaders, continuously animated scenes, or depth effects that would be costly in DOM/SVG. Do not introduce a rendering architecture for an effect SVG or CSS can deliver elegantly. If a non-DOM renderer is justified, design semantic navigation and non-pointer access separately.

## Performance budget

Inspect and limit:

- DOM and SVG node count;
- unnecessary rerenders and state fan-out;
- expensive blur and large `backdrop-filter` regions;
- simultaneous animations;
- unbounded particles;
- redundant listeners, observers, timers, and render loops;
- layout reads interleaved with writes;
- oversized or unnecessarily high-resolution assets;
- work that continues offscreen, hidden, or after navigation.

Prefer GPU-friendly transforms, measured use of `will-change`, stable geometry, and lazy or contextual activation. Evaluate actual responsiveness during interaction, not only synthetic build output.

## Repository and dependency discipline

Before adding a visual primitive, component, animation rule, typography treatment, spacing system, or interaction convention, inspect the repository for an existing owner. Reuse or consolidate where appropriate; do not create a parallel pattern to avoid understanding the current one.

Do not replace working architecture because another framework is fashionable. Before proposing a dependency, identify the exact problem, whether the repository already solves it, maintenance quality, bundle impact, and the simplest viable alternative. Package additions require explicit approval of exact package names.
