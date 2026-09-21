# Browser validation

## Browser-first rule

Source inspection, type checking, and compilation do not prove an interactive experience works. After every significant structural or visual change, use the available browser/computer capability to operate the actual page.

At minimum:

1. load the route from a clean entry;
2. click and keyboard-activate every changed control;
3. hover and focus interactive elements;
4. exercise browser Back and Forward;
5. reopen visited states;
6. interact rapidly and retarget during transitions;
7. resize through representative desktop, tablet, and narrow-mobile widths;
8. inspect awkward intermediate animation states;
9. verify transitions visually;
10. continue through several interactions and confirm the interface remains understandable.

Rebuild before testing the production preview server. Use repository Playwright coverage where applicable, but also perform direct exploratory interaction; scripted tests and human-visible inspection catch different failures.

## History, refresh, and interruption matrix

For navigable states, test:

- A → B → C → D, then Back to C, B, and A;
- Forward after Back;
- refresh at B, C, and D;
- direct entry to a deep URL;
- Back during or immediately after a transition;
- selecting a new target while another transition runs;
- returning to a visited node;
- closing an overlay versus leaving a conceptual state;
- Home/reset versus conceptual parent/Up;
- navigation away and return through browser cache or Astro routing.

At every step, check URL, visual state, active/focused element, persistent context, and available return path. No intermediate action may leave stale labels, disabled controls, orphaned overlays, duplicated history entries, or conflicting animations.

## Accessibility

Design accessibility with the interaction model, not as a final patch. Verify:

- logical keyboard order;
- visible focus states using the project language;
- semantic links for navigation and buttons for in-place actions;
- accessible names and current/expanded/selected states where relevant;
- ARIA only where native semantics are insufficient;
- focus containment, Escape/backdrop dismissal, inert background, and focus return for dialogs;
- adequate contrast and readable sizes;
- practical click and touch targets;
- a non-pointer path to the same concepts and actions.

With `prefers-reduced-motion`, preserve hierarchy, causality, current state, and feedback while removing or simplifying long travel, parallax, continuous motion, and decorative sequencing. Reduced motion must not become reduced comprehension.

## Responsive and visual regression

After a significant visual change:

1. open the result rather than trusting CSS inspection;
2. compare it with the intended composition and existing project hierarchy;
3. inspect at least 320, 390, 768, 1440, and 1920px where the page family supports them;
4. inspect intermediate entrance, exit, focus, overlay, and retarget states;
5. check safe areas, overflow, labels, controls, panels, type measure, and focal assets;
6. correct obvious hierarchy and layout problems;
7. repeat until stable.

Do not preserve a desktop composition by making labels, nodes, or panels too small to understand.

## Interaction stress test

Deliberately try to break the page:

- click or key-activate rapidly;
- alternate targets before motion finishes;
- press Back/Forward during transitions;
- revisit prior nodes repeatedly;
- resize with a state or overlay open;
- refresh on a deep state;
- switch input method between pointer and keyboard;
- enable reduced motion mid-session when the environment permits;
- hide/show the tab or navigate away while render loops run;
- trigger controls at viewport edges and touch-sized layouts.

The state machine must settle into one coherent stable state after imperfect input. Fix races at the state/animation ownership level rather than adding delays.

## Performance observation

During direct use, watch for delayed input, uneven pointer tracking, dropped frames, content jumps, blurry text, late asset shifts, persistent background work, and increasing sluggishness after repeated navigation. Inspect implementation when behavior suggests rerender storms, layout thrashing, duplicate listeners, orphaned timelines, or oversized assets.

## Completion evidence

Report:

- routes and states exercised;
- viewport sizes and input methods checked;
- Back/Forward, refresh, and deep-link behavior;
- reduced-motion and keyboard results;
- automated commands run;
- remaining weaknesses or checks that could not be completed.

Do not claim the feature is finished if the changed interaction was not actually operated.
