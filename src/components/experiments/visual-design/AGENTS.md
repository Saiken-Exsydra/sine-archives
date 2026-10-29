# Visual design fixture instructions

Read the repository's AGENTS.md, DESIGN.md, docs/design-system.md and the target source first. This directory holds non-canonical development fixtures rendered inside Astro. Keep visual experiments within this subtree unless the user's request explicitly includes the Astro lab wrapper or test tooling.

Use the existing tokens, typography and plain CSS. Scope selectors under `.visual-lab-record`; do not restyle shared layouts or global production CSS. Preserve English/Portuguese labels, semantic controls, keyboard focus and reduced-motion behavior. Return effect cleanup if adding React effects. Reuse the fixture's generated IDs for accessible relationships.

Capture before and after with scripts/visual-design-lab.mjs, review desktop/mobile images and unchanged production references, and run the checks documented in docs/experiments/visual-design-lab.md. Keep changes on the experimental branch. Content, canon, assets, production routes, deployment and main remain outside this lab task.
