---
name: sine-interactive-experience
description: Design, implement, and browser-validate sophisticated SiNE Archives experiences where spatial navigation, animation, conceptual relationships, or visual storytelling are central. Use for the Systems Observatory and similarly immersive pages; do not invoke for routine prose, simple forms, or ordinary component maintenance.
---

# SiNE Interactive Experience

Build high-quality interactive editorial experiences, not generic application UI. Treat interaction design, navigation state, motion, readability, accessibility, and performance as one system. The user's explicit instructions take precedence over this skill.

## Required context

Before visual, motion, or interaction changes:

1. Read the repository's `AGENTS.md`, `docs/design-system.md`, and `docs/architecture.md`.
2. Inspect the relevant route, components, styles, tests, and current browser experience.
3. For Systems Observatory work, inspect `src/components/systems/SystemsObservatoryPage.astro` and its related components before proposing new primitives.
4. Preserve canon, disclosure boundaries, terminology, slugs, routes, anchors, locales, and content ownership.

For any major interactive experience, read all four references before implementation:

- [Interaction and navigation](references/interaction-and-navigation.md): use to reconstruct the reader's mental model, design spatial navigation and progressive disclosure, and evaluate relationship or image semantics.
- [Implementation and motion](references/implementation-and-motion.md): use to select state/history architecture, animation and rendering techniques, lifecycle cleanup, and performance strategy.
- [Browser validation](references/browser-validation.md): use to run the mandatory browser-first, accessibility, history, responsive, visual, and stress checks.
- [SiNE identity](references/sine-identity.md): use to preserve the project's restrained editorial language and repository conventions.

## Mandatory workflow

Follow this sequence for a major interactive page. Small fixes may compress steps, but may not skip the checks relevant to the changed behavior.

1. Open the existing interface in a browser and use it as a reader.
2. Inspect its source and reconstruct the interaction/state model.
3. Write down the current state, meaningful actions, navigation semantics, reversibility, persistence, contextual information, expected feedback, and return paths.
4. Identify UX, state-architecture, accessibility, responsive, and performance problems before choosing visual effects.
5. Research external references only when the interaction problem is unusual or a proven technique would reduce uncertainty. Study techniques, not skins.
6. Define the intended state and navigation model, including browser Back/Forward and refresh behavior.
7. Implement the smallest coherent structural change first. Reuse existing project systems and avoid framework or dependency churn.
8. Operate that change in the browser before adding polish.
9. Add semantic motion and visual refinement as a coherent system.
10. Exercise pointer, keyboard, Back/Forward, resize, refresh, reduced motion, repeated input, interrupted transitions, and revisited states.
11. Inspect visual hierarchy and intermediate animation states across representative viewport sizes; correct problems and repeat.
12. Check cleanup, rerender behavior, animation load, DOM size, expensive effects, and asset weight.
13. Run repository validation required by `AGENTS.md` and the changed surface.
14. Report what changed, what was actually exercised, and any remaining weakness.

## Working rules

- Navigation state is a design material, not an implementation detail. Never collapse browser Back, local Back, conceptual parent/Up, Home/reset, overlay dismissal, focus change, zoom, and concept navigation into one ambiguous action.
- Do not let cinematic animation override browser conventions, state coherence, readability, or input responsiveness.
- Use motion only when it communicates origin, destination, spatial continuity, hierarchy, relationship, attention, interaction confirmation, atmosphere, or system state.
- Keep a spatial metaphor informational. A constellation or network must communicate position, distance, hierarchy, relationships, and reachable context rather than serving as a decorative modal launcher.
- Prefer orientation first and depth second. Do not expose the whole lore graph at once.
- Treat performance as visual quality. A stuttering or twitchy interaction is unfinished.
- Source inspection and successful compilation are necessary but insufficient; the interaction must be experienced through the browser.

## Definition of finished

A sophisticated interactive feature is finished only when it is functionally correct, visually coherent, understandable, responsive, browser-history-safe, keyboard-usable where appropriate, reduced-motion-safe, performant, tested through actual interaction, and consistent with SiNE's identity.
