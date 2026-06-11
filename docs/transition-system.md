# Transition System

## What this is

This site now has one shared transition system instead of many separate animation patches.

If you ask Codex to add or change transitions later, these are now the main files:

- `src/layouts/SiteShell.astro`
  This is shared page shell. It owns Astro transition router, global head items, lifecycle script load, and route data markers.
- `src/styles/transition-system.css`
  This is only main place for View Transition CSS, route-wide timing, lifecycle classes, reduced-motion rules, and future animation hooks.
- `src/scripts/transition-lifecycle.ts`
  This is only main place for Astro lifecycle events and shared page re-initialization.
- `src/utils/transition-routes.ts`
  This maps pages into route kinds like `home`, `search`, `character-index`, and `character-detail`.

## How pages plug in

Pages and layouts should use one of these patterns:

- Use `MainLayout.astro` for normal site pages.
- Use `SiteShell.astro` directly only for special full-screen pages that need custom structure.
- Put route content inside `transition:name="page-content"` so only inner content swaps.
- Add `routeKind` and optional `transitionProfile` when a page needs special transition styling.

## How page scripts should work

Do not add new `astro:page-load` or `astro:before-swap` listeners in random files.

Use this shared hook instead:

```ts
window.registerPageInit?.("my-page-key", () => {
  // set up listeners
  return () => {
    // clean up listeners/timers
  };
});
```

That hook runs on first load and again after Astro client-side navigation.

## How Search flicker was fixed

Search stays a full route. Fix used four pieces together:

1. Search now uses same shell/router foundation as rest of site.
2. Search button uses stronger prefetch: `data-astro-prefetch="load"`.
3. Search reveal intent is captured on click, but navigation stays native. No more custom `preventDefault()` + manual navigation path.
4. Search card images now keep stable dimensions and use calmer loading/fade behavior, so cold image loads do not flash before animation.

## How to add future transitions

### Simple route style

1. Pick route kind or transition profile in `transition-routes.ts`.
2. Pass that profile from page layout.
3. Add CSS in `transition-system.css` using route data attributes like:

```css
html[data-transition-profile="my-profile"]::view-transition-new(page-content) {
  /* animation here */
}
```

### Tile expansion animation

For card-to-page motion:

1. Mark trigger with a data attribute like `data-transition-trigger="tile-name"`.
2. Capture origin or box in `transition-lifecycle.ts`.
3. Add route/profile CSS in `transition-system.css`.
4. Keep page-specific JS out of View Transition plumbing unless absolutely needed.

### Circular reveal animation

Search is example. Reuse same pattern:

1. Mark trigger.
2. Capture click origin in lifecycle script.
3. Store intent on `document.documentElement`.
4. Animate only from shared lifecycle + shared CSS.

## Reduced motion

Reduced motion lives in `src/styles/transition-system.css`.

If you add a new large motion effect:

- add reduced-motion fallback there too
- use fade or instant swap
- avoid large transform, blur, or clip-path motion for reduced-motion users

## What not to do

- Do not add another standalone transition script for one page.
- Do not put `ClientRouter` on individual pages.
- Do not scatter `::view-transition` CSS across multiple files.
- Do not rely only on `DOMContentLoaded` for page features that must survive Astro navigation.
- Do not bring back manual click interception for Search unless whole transition architecture changes.

## Quick checklist for Codex

If future animation work is requested, tell Codex:

1. Check `SiteShell.astro`, `transition-system.css`, and `transition-lifecycle.ts` first.
2. Reuse `registerPageInit(...)`.
3. Keep route shell stable.
4. Add route/profile metadata instead of new ad-hoc classes.
5. Test first navigation, not only repeat navigation.
