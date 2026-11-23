# React Systems experiment

The user has authorized a standalone React rewrite, starting with Systems.
This subtree deliberately replaces Astro page/lifecycle ownership for the new
experience. React owns the document UI and GSAP owns coordinated spatial motion.

- Keep work on `experiment/react-systems`; never merge or deploy automatically.
- The existing `src/`, `The Archive/`, media, and content remain migration sources.
  Do not rewrite canon, translate fictional terms, or change disclosure boundaries.
- Read `docs/experiments/react-systems.md` and `docs/design-system.md` first.
- Use plain CSS, accessible links, addressable states, browser history, visible
  keyboard focus, and live reduced-motion handling. Every effect needs cleanup.
- Avoid porting Astro's page initializer system into React. Use React effects.
- Use existing locked packages. Any additional dependency needs justification.
- Run `npm run check`, `npm run build`, and `npm run test:react`.
- Browser validation for this experiment uses Chromium only. Do not run other
  browser engines, add cross-browser requirements, or carry old host-browser
  troubleshooting into project notes unless the user explicitly requests it.
- Prefix experimental commits with `[CF-Pages-Skip]` to avoid a Pages build.
