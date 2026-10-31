# Architecture

## Page ownership

`SiteShell.astro` owns the document, fonts, persisted background, Astro ClientRouter, and browser bootstrap. `MainLayout.astro` adds standard navigation, music, locale switching, search, main content, and footer. `EntryLayout`, `OrganizationDossierLayout`, `CharacterEntryLayout`, and `CharacterCodexLayout` own their distinct reading experiences.

English routes live directly below `src/pages/`; `[locale]` wrappers pass a locale into the same page implementations. `src/i18n/config.ts` owns URL construction; `content.ts` merges locale entries by slug. Keep URLs and route metadata stable. The character index and dossier use the document shell directly because their navigation and reading panes differ from the standard layout.

`src/components/redactory/` and `src/components/systems/` are deliberate feature boundaries. The Observatory, desk, dive, theorem, profile, map, search, and soundtrack catalog are bespoke experiences. Their large style blocks belong to the experience; split them only when a meaningful reusable responsibility exists. Content schemas live in `src/content.config.ts`, section identities in `content-keys.ts`, and section labels in `sections.json`/`sections.ts`.

## Browser lifecycle

`src/scripts/transition-lifecycle.ts` is the sole owner of Astro navigation events. Shell bootstrap queues registration until that module loads. Ordinary controllers use:

```ts
window.registerPageInit?.("stable-feature-key", () => {
  const root = document.querySelector("[data-feature]");
  if (!root) return;
  const controller = new AbortController();
  root.addEventListener("click", handleClick, { signal: controller.signal });
  return () => controller.abort();
});
```

Initializers are keyed by route and stable name. Returning to a route reuses its registration (bundled scripts run once); inline page scripts may replace it with fresh route data. All active cleanups run before swaps and on restored browser-cache pages. A registration retains configuration, never a detached DOM tree: query current elements inside the initializer. `{ persistent: true }` selects controllers needed on every route, such as diagrams; it does not exempt them from teardown.

`src/utils/transition-routes.ts` classifies routes. Intent capture uses `data-transition-trigger` while Astro owns navigation and prefetching. Delayed transition cleanup is tied to the navigation that created it. Do not add fetch warmers or delays before navigation. Runtime diagnostics retain only the latest 40 events.

Preparation context is keyed by Astro's abort signal so a superseded swap cannot consume the latest intent. If an aborted navigation still reaches its swap, preserve pending stylesheet preload nodes through that swap; removing them would strand the next navigation's loader before its load/error event. This adds no requests or delay. Expected native snapshot abort/timeout rejections are recorded as bounded cancellation diagnostics; other transition errors remain visible.

Before ClientRouter loads, the shell selects Astro's animated fallback for Windows WebKit. Its native snapshot renderer reproducibly crashes during large return swaps in Playwright WebKit 2287, even with effects removed; fallback navigation passes the same flow. Chromium and Apple WebKit retain native transitions. Reevaluate this narrow compatibility guard when upgrading the browser runtime. The active route transition is skipped when reduced motion is requested. All Search route motion now belongs to transition CSS, including its snapshot boundary; the full-screen JavaScript circle has been removed.

`src/scripts/motion.ts` provides page-owned cancellable tasks, live motion-preference subscriptions, and visibility/activity gating through `window.sineMotion`. Pass the page's abort signal; the helper does not own navigation. Its persistent initializer pauses decorative CSS loops outside the viewport, while hidden or inert, and under reduced motion, including loops started by later playback state. `archive-ref-previews.ts` owns preview positioning and Escape dismissal; the reference itself remains an ordinary record link.

Conditional animation starts are collected once per frame and only on their owning elements. Already-observed actors are skipped; do not rescan the document for each loading indicator or finite animation start.

Initial ambient discovery runs in the next owned animation frame, after synchronous page controllers finish updating the DOM. Search keeps its already-correct server-rendered default state; only restored queries or section filters rebuild results during initialization. Featured cards and ordinary rows defer offscreen layout while retaining native links and keyboard access.

`src/scripts/entry-modal.ts` owns active entry overlays' focus containment, background inertness, Escape/backdrop dismissal, focus return, request cancellation, and cleanup. It temporarily places overlays directly under the document body so named View Transition layers cannot trap them below navigation. Pages retain their own markup and metadata presentation. `reveal-on-scroll.ts` owns one observer per reveal group. Mermaid loads only when a diagram exists, and DOM updates are coalesced by `codex-diagrams.ts`. Character codex tables receive keyboard-accessible horizontal scroll regions during page initialization.

The Systems addendums overlay reuses the same modal controller. Search server-renders its initial five artwork cards and all ordinary record rows. Two inert card patterns supply later primary/featured results from the serialized index, using text nodes and responsive image sources. Page-owned maps cache reusable cards, while delegated link feedback also covers newly mounted cards. Character TOC tracking reads the active pane's heading positions once per scroll frame. Observatory connector updates collect geometry before writing SVG attributes, and relationship travel samples its path before the timeline starts.

## Content and build pipeline

`The Archive/` contains canon. Only its character records are tracked by this website repository; other local archive folders must not be swept into Git. Public articles in `src/content/<section>_en` and `_pt_br` are maintained editorially, not mechanically generated from dossiers. `character-codex.ts` reads tracked character Markdown at build time for codex routes. The authoring template belongs in `docs/templates/`, outside Astro's content collections.

The reference registry and Markdown plugins share `archive-ref-core.mjs`: the same resolution rules power rendered links, previews, and the command-line guard. Explicit heading IDs remain stable across locales. Public content filtering, reference integrity, encoding checks, and locale partner validation are deliberate safeguards.

Build first runs `generate-song-metadata.mjs`, which reads MP3 tags and editorial overrides, creates `src/data/songs.json`, and extracts `public/music/covers/`. Source MP3s and `source-covers/` are authored media; generated catalog/covers are ignored. `src/data/music.ts` adds localized editorial presentation. `songs:update` edits source tags and requires review.

Astro processes `src/assets/uploads/` into build assets, including appropriately sized WebP homepage previews. `public/uploads/` holds stable URLs used by content and persisted chrome. Identical public/source artwork may therefore be intentional; reference analysis must precede removal. Original source media is preserved; preview optimization happens during the build.

## Dependencies and validation

Astro and TypeScript own compilation, Mermaid owns diagram rendering, fast-glob supports content/media discovery, and music-metadata/node-id3 read/write audio tags. These direct packages all have active callers. Character codex Markdown currently imports Unified/Remark/Rehype packages provided transitively by Astro; declaring them directly requires package approval and is a dependency boundary to revisit. The Vite ARIA query shims reduce browser-side Mermaid metadata; their aliases remain unchanged and are covered by diagram tests.

Playwright tests the production preview in three browser engines. Test files group navigation, character responsiveness, diagrams, home gates, Redactory, entry modals, and route-family coverage. See the README for commands. Browser screenshots and reports are disposable output; no test or build deploys anything.

All specs use `tests/helpers/test.ts`. Its Windows-only local WebKit override launches a loopback browser server so the fixture owns a public process handle. Once that browser has exited, `windows-webkit.ts` checks its auxiliary children by parent PID, executable directory, exact process name and creation interval, rechecks process identity before termination, then releases the exited process's pipe endpoints. Nonzero browser exits and cleanup errors still fail the run. This is test-host compatibility for WebKit 2287 retaining inherited pipes, separate from the site's native-transition fallback. Other engines, platforms and remote connections use the built-in fixture. Reevaluate both WebKit workarounds after runtime upgrades.
