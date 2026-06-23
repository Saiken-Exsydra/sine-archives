import type {
  TransitionBeforePreparationEvent,
} from "astro:transitions/client";
import {
  isTransitionBeforePreparationEvent,
  isTransitionBeforeSwapEvent,
} from "astro:transitions/client";
import {
  isCharacterDetailPath,
  isCharacterIndexPath,
  isHomePath,
  isObservatoryPath,
  isSearchPath,
  isSystemInteractivePath,
} from "../utils/transition-routes";

type PageCleanup = () => void;
type PageInit = () => void | PageCleanup;
type PendingPageInit = [key: string, init: PageInit];

type SearchIntent = {
  type: "search";
  fromPath: string;
  href: string;
  x: number;
  y: number;
};

type ObservatoryHandleIntent = {
  type: "observatory-handle";
  direction: "open" | "close";
  fromPath: string;
  href: string;
};

type SearchHandleIntent = {
  type: "search-handle";
  direction: "open" | "close";
  fromPath: string;
  href: string;
};

type CharacterDossierIntent = {
  type: "character-dossier";
  direction: "open" | "close";
  fromPath: string;
  href: string;
};

type ObservatorySystemIntent = {
  type: "observatory-system";
  systemId: string;
  fromPath: string;
  href: string;
};

type TransitionIntent =
  | SearchIntent
  | ObservatoryHandleIntent
  | SearchHandleIntent
  | CharacterDossierIntent
  | ObservatorySystemIntent;

type TransitionDebugEvent = {
  direction: string;
  event: string;
  from: string;
  intent: string | null;
  navigationType: string;
  timestamp: number;
  to: string;
};

type TransitionRuntimeState = {
  activeIntent: TransitionIntent | null;
  cleanups: Map<string, PageCleanup>;
  debugEvents: TransitionDebugEvent[];
  initializers: Map<string, PageInit>;
  isPageReady: boolean;
  lastIntent: TransitionIntent | null;
  lastNavigation: {
    direction: string;
    from: string;
    navigationType: string;
    to: string;
  } | null;
  pendingIntent: TransitionIntent | null;
  warmedRoutes: Set<string>;
};

declare global {
  interface Window {
    __sinePendingPageInits?: PendingPageInit[];
    __sineTransitionLifecycleInstalled?: boolean;
    __sineTransitionState?: TransitionRuntimeState;
    registerPageInit?: (key: string, init: PageInit) => void;
  }
}

const DEBUG_PREFIX = "[sine-transitions]";
const SEARCH_TRANSITION_DURATION = 1800;
const SEARCH_TRANSITION_EASING = "cubic-bezier(0.2, 0.82, 0.22, 1)";
const TRANSITION_PREPARE_TIMEOUT = 700;
const ROUTE_WARMUP_TIMEOUT = 900;
const HANDLE_INTENT_CLEAR_DELAY = 1300;
const OBSERVATORY_SYMBOL_RESET_DELAY = 1600;
const STATE_CLASSES = [
  "is-preparing-transition",
  "is-swap-pending",
  "is-swapping",
  "is-transitioning",
  "is-page-ready",
] as const;

function getRuntimeState(): TransitionRuntimeState {
  if (!window.__sineTransitionState) {
    window.__sineTransitionState = {
      activeIntent: null,
      cleanups: new Map(),
      debugEvents: [],
      initializers: new Map(),
      isPageReady: false,
      lastIntent: null,
      lastNavigation: null,
      pendingIntent: null,
      warmedRoutes: new Set(),
    };
  }

  return window.__sineTransitionState;
}

function logTransitionEvent(event: string, detail?: Partial<TransitionDebugEvent>) {
  const state = getRuntimeState();
  const nav = state.lastNavigation;
  const entry: TransitionDebugEvent = {
    direction: detail?.direction ?? nav?.direction ?? "forward",
    event,
    from: detail?.from ?? nav?.from ?? location.pathname,
    intent: detail?.intent ?? state.lastIntent?.type ?? null,
    navigationType: detail?.navigationType ?? nav?.navigationType ?? "traverse",
    timestamp: performance.now(),
    to: detail?.to ?? nav?.to ?? location.pathname,
  };

  state.debugEvents.push(entry);
  if (state.debugEvents.length > 40) {
    state.debugEvents.splice(0, state.debugEvents.length - 40);
  }

  if (import.meta.env.DEV) {
    console.debug(DEBUG_PREFIX, entry.event, {
      direction: entry.direction,
      from: entry.from,
      intent: entry.intent,
      to: entry.to,
    });
  }
}

function setLifecycleClasses(
  add: Array<(typeof STATE_CLASSES)[number]> = [],
  remove: Array<(typeof STATE_CLASSES)[number]> = [],
) {
  const root = document.documentElement;
  for (const className of STATE_CLASSES) {
    if (remove.includes(className)) {
      root.classList.remove(className);
      continue;
    }
    if (add.includes(className)) {
      root.classList.add(className);
    }
  }
}

function clearTransitionIntent(doc: Document = document) {
  const root = doc.documentElement;
  root.removeAttribute("data-transition-intent");
  root.removeAttribute("data-observatory-transition");
  root.removeAttribute("data-observatory-system");
  root.removeAttribute("data-search-handle-transition");
  root.removeAttribute("data-character-dossier-transition");
  root.style.removeProperty("--search-vt-x");
  root.style.removeProperty("--search-vt-y");
}

function applyTransitionIntent(doc: Document, intent: TransitionIntent | null) {
  clearTransitionIntent(doc);
  if (!intent) return;

  const root = doc.documentElement;
  root.dataset.transitionIntent = intent.type;
  if (intent.type === "search") {
    root.style.setProperty("--search-vt-x", `${intent.x}px`);
    root.style.setProperty("--search-vt-y", `${intent.y}px`);
    return;
  }
  if (intent.type === "observatory-handle") {
    root.dataset.observatoryTransition = intent.direction;
    return;
  }
  if (intent.type === "observatory-system") {
    root.dataset.observatorySystem = intent.systemId;
    return;
  }
  if (intent.type === "character-dossier") {
    root.dataset.characterDossierTransition = intent.direction;
    return;
  }
  root.dataset.searchHandleTransition = intent.direction;
}

function cleanupInitializers() {
  const state = getRuntimeState();
  for (const cleanup of state.cleanups.values()) {
    try {
      cleanup();
    } catch (error) {
      console.error(DEBUG_PREFIX, "cleanup failed", error);
    }
  }
  state.cleanups.clear();
}

function runInitializer(key: string, init: PageInit) {
  const state = getRuntimeState();
  const existingCleanup = state.cleanups.get(key);
  if (existingCleanup) {
    try {
      existingCleanup();
    } catch (error) {
      console.error(DEBUG_PREFIX, "initializer cleanup failed", error);
    }
  }

  const cleanup = init();
  if (typeof cleanup === "function") {
    state.cleanups.set(key, cleanup);
  } else {
    state.cleanups.delete(key);
  }
}

function runInitializers() {
  const state = getRuntimeState();
  for (const [key, init] of state.initializers) {
    runInitializer(key, init);
  }
}

export function registerPageInit(key: string, init: PageInit) {
  const state = getRuntimeState();
  state.initializers.set(key, init);

  if (state.isPageReady) {
    runInitializer(key, init);
  }
}

function flushPendingRegistrations() {
  const queue = window.__sinePendingPageInits;
  if (!queue?.length) return;

  while (queue.length > 0) {
    const [key, init] = queue.shift()!;
    registerPageInit(key, init);
  }
}

function isPlainLeftClick(event: MouseEvent | PointerEvent) {
  return !(
    event.defaultPrevented
    || ("button" in event && event.button !== 0)
    || event.metaKey
    || event.ctrlKey
    || event.shiftKey
    || event.altKey
  );
}

function getSearchTriggerLink(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  const link = target.closest<HTMLAnchorElement>("[data-transition-trigger=\"search\"]");
  if (!(link instanceof HTMLAnchorElement)) return null;

  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !isSearchPath(url.pathname)) return null;

  return link;
}

function getObservatoryTriggerLink(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  const link = target.closest<HTMLAnchorElement>("[data-transition-trigger=\"observatory-handle\"]");
  if (!(link instanceof HTMLAnchorElement)) return null;

  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !isObservatoryPath(url.pathname)) return null;

  return link;
}

function getObservatorySystemTriggerLink(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  const link = target.closest<HTMLAnchorElement>("[data-transition-trigger=\"observatory-system\"]");
  if (!(link instanceof HTMLAnchorElement)) return null;

  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !isSystemInteractivePath(url.pathname)) return null;

  return link;
}

function getSearchHandleTriggerLink(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  const link = target.closest<HTMLAnchorElement>("[data-transition-trigger=\"search-handle\"]");
  if (!(link instanceof HTMLAnchorElement)) return null;

  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !isSearchPath(url.pathname)) return null;

  return link;
}

function buildSearchIntentFromLink(link: HTMLAnchorElement): SearchIntent {
  const rect = link.getBoundingClientRect();
  return {
    type: "search",
    fromPath: location.pathname,
    href: link.href,
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function buildObservatoryIntentFromLink(link: HTMLAnchorElement): ObservatoryHandleIntent {
  return {
    type: "observatory-handle",
    direction: "open",
    fromPath: location.pathname,
    href: link.href,
  };
}

function buildSearchHandleIntentFromLink(link: HTMLAnchorElement): SearchHandleIntent {
  return {
    type: "search-handle",
    direction: "open",
    fromPath: location.pathname,
    href: link.href,
  };
}

function buildObservatorySystemIntentFromLink(link: HTMLAnchorElement): ObservatorySystemIntent {
  const systemId = link.dataset.systemLaunch || "system";
  return {
    type: "observatory-system",
    systemId,
    fromPath: location.pathname,
    href: link.href,
  };
}

function prepareObservatorySystemSymbol(link: HTMLAnchorElement) {
  const systemId = link.dataset.systemLaunch;
  const root = document.querySelector("[data-observatory-root]");
  if (!systemId || !root) return;

  const node = [...root.querySelectorAll<HTMLElement>("[data-system-node]")]
    .find((candidate) => candidate.dataset.systemNode === systemId);
  const mark = node?.querySelector<HTMLElement>("[data-system-mark]");
  const transitionName = node?.dataset.systemTransitionName;
  if (!mark || !transitionName) return;

  mark.style.viewTransitionName = transitionName;
  window.setTimeout(() => {
    if (mark.isConnected) {
      mark.style.removeProperty("view-transition-name");
    }
  }, OBSERVATORY_SYMBOL_RESET_DELAY);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function shouldWarmTransitionResources() {
  const connection = navigator as Navigator & {
    connection?: { saveData?: boolean };
  };

  return !connection.connection?.saveData;
}

function scheduleIdleTask(callback: () => void) {
  const idleWindow = window as Window & {
    requestIdleCallback?: (task: () => void, options?: { timeout?: number }) => number;
  };

  if (typeof idleWindow.requestIdleCallback === "function") {
    idleWindow.requestIdleCallback(callback, { timeout: ROUTE_WARMUP_TIMEOUT });
    return;
  }

  window.setTimeout(callback, 120);
}

function waitForTimeout(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }

    const timer = window.setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      window.clearTimeout(timer);
      resolve();
    }, { once: true });
  });
}

function normalizeWarmupUrl(src: string, base = location.href) {
  try {
    const url = new URL(src, base);
    if (url.origin !== location.origin) return null;
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

function addWarmupSource(sources: Set<string>, src: string | null | undefined, base?: string) {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return;

  const normalized = normalizeWarmupUrl(src, base);
  if (normalized) sources.add(normalized);
}

function collectWarmupImageSources(doc: Document, max = 4) {
  const sources = new Set<string>();
  const selectors = [
    "main img[fetchpriority=\"high\"]",
    "main img[loading=\"eager\"]",
    "main picture source[srcset]",
    "main img[src]",
    "#page-content img[src]",
    "aside img[src]",
    "img[fetchpriority=\"high\"]",
    "img[loading=\"eager\"]",
  ];

  for (const selector of selectors) {
    for (const element of doc.querySelectorAll(selector)) {
      if (sources.size >= max) return [...sources];

      if (element instanceof HTMLImageElement) {
        addWarmupSource(sources, element.currentSrc || element.src || element.getAttribute("src"));
        continue;
      }

      if (element instanceof HTMLSourceElement) {
        const firstCandidate = element.srcset.split(",")[0]?.trim().split(/\s+/)[0];
        addWarmupSource(sources, firstCandidate);
      }
    }
  }

  return [...sources];
}

async function warmImageSource(src: string, signal?: AbortSignal) {
  if (signal?.aborted) return;

  await Promise.race([
    new Promise<void>((resolve) => {
      const image = new Image();
      const finish = () => resolve();
      image.decoding = "async";
      image.onload = finish;
      image.onerror = finish;
      signal?.addEventListener("abort", finish, { once: true });
      image.src = src;
      if (image.complete) finish();
      void image.decode?.().then(finish, finish);
    }),
    waitForTimeout(TRANSITION_PREPARE_TIMEOUT, signal),
  ]);
}

async function warmDocumentImages(doc: Document, signal?: AbortSignal) {
  if (!shouldWarmTransitionResources()) return;

  const sources = collectWarmupImageSources(doc);
  if (!sources.length) return;

  await Promise.race([
    Promise.allSettled(sources.map((src) => warmImageSource(src, signal))),
    waitForTimeout(TRANSITION_PREPARE_TIMEOUT, signal),
  ]);
}

function getWarmupRouteLinks() {
  const links = new Set<string>();

  for (const link of document.querySelectorAll<HTMLAnchorElement>("a[data-astro-prefetch=\"load\"][href]")) {
    const href = normalizeWarmupUrl(link.href);
    if (!href) continue;

    const url = new URL(href);
    if (url.pathname === location.pathname) continue;
    links.add(url.href);
  }

  return [...links].slice(0, 3);
}

async function warmRouteDocument(href: string) {
  const state = getRuntimeState();
  if (state.warmedRoutes.has(href) || !shouldWarmTransitionResources()) return;
  state.warmedRoutes.add(href);

  try {
    const response = await fetch(href, {
      cache: "force-cache",
      credentials: "same-origin",
      priority: "low",
    } as RequestInit & { priority?: "low" });
    if (!response.ok) return;

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    await Promise.race([
      warmDocumentImages(doc),
      waitForTimeout(ROUTE_WARMUP_TIMEOUT),
    ]);
    logTransitionEvent("route:warm", { to: new URL(href).pathname });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug(DEBUG_PREFIX, "route warm failed", href, error);
    }
  }
}

function scheduleRouteWarmup() {
  if (!shouldWarmTransitionResources()) return;

  scheduleIdleTask(() => {
    for (const href of getWarmupRouteLinks()) {
      void warmRouteDocument(href);
    }
  });
}

function getRevealRadius(x: number, y: number) {
  const topLeft = Math.hypot(x, y);
  const topRight = Math.hypot(window.innerWidth - x, y);
  const bottomLeft = Math.hypot(x, window.innerHeight - y);
  const bottomRight = Math.hypot(window.innerWidth - x, window.innerHeight - y);

  return Math.max(topLeft, topRight, bottomLeft, bottomRight) + 80;
}

function animateSearchReveal(intent: SearchIntent) {
  const radius = getRevealRadius(intent.x, intent.y);
  const origin = `${intent.x}px ${intent.y}px`;

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${origin})`,
        `circle(${radius * 0.22}px at ${origin})`,
        `circle(${radius * 0.62}px at ${origin})`,
        `circle(${radius}px at ${origin})`,
      ],
      filter: [
        "brightness(0.82) saturate(0.9)",
        "brightness(0.9) saturate(1)",
        "brightness(1) saturate(1.08)",
        "brightness(1) saturate(1)",
      ],
      opacity: [1, 1, 1, 1],
    },
    {
      duration: SEARCH_TRANSITION_DURATION,
      easing: SEARCH_TRANSITION_EASING,
      fill: "both",
      pseudoElement: "::view-transition-new(root)",
    },
  );

  document.documentElement.animate(
    {
      filter: [
        "brightness(1)",
        "brightness(0.82)",
        "brightness(0.58)",
        "brightness(0.35)",
      ],
      opacity: [1, 0.72, 0.4, 0.18],
      transform: ["scale(1)", "scale(0.997)", "scale(0.992)", "scale(0.985)"],
    },
    {
      duration: SEARCH_TRANSITION_DURATION,
      easing: SEARCH_TRANSITION_EASING,
      fill: "both",
      pseudoElement: "::view-transition-old(root)",
    },
  );
}

function resolveNavigationIntent(event: TransitionBeforePreparationEvent): TransitionIntent | null {
  const state = getRuntimeState();
  const observatorySystemTriggered = isObservatoryPath(event.from.pathname)
    && isSystemInteractivePath(event.to.pathname)
    && (
      getObservatorySystemTriggerLink(event.sourceElement ?? null)
      || state.pendingIntent?.type === "observatory-system"
    );

  if (observatorySystemTriggered) {
    return state.pendingIntent?.type === "observatory-system"
      ? state.pendingIntent
      : buildObservatorySystemIntentFromLink(event.sourceElement as HTMLAnchorElement);
  }

  const searchHandleTriggered = isSearchPath(event.to.pathname)
    && (
      getSearchHandleTriggerLink(event.sourceElement ?? null)
      || state.pendingIntent?.type === "search-handle"
    );

  if (searchHandleTriggered) {
    return state.pendingIntent?.type === "search-handle"
      ? state.pendingIntent
      : buildSearchHandleIntentFromLink(event.sourceElement as HTMLAnchorElement);
  }

  const searchTriggered = isSearchPath(event.to.pathname)
    && (
      getSearchTriggerLink(event.sourceElement ?? null)
      || (state.pendingIntent?.type === "search" && new URL(state.pendingIntent.href, location.href).pathname === event.to.pathname)
    );

  if (searchTriggered) {
    return state.pendingIntent?.type === "search"
      ? state.pendingIntent
      : buildSearchIntentFromLink(event.sourceElement as HTMLAnchorElement);
  }

  const observatoryTriggered = isObservatoryPath(event.to.pathname)
    && (
      getObservatoryTriggerLink(event.sourceElement ?? null)
      || state.pendingIntent?.type === "observatory-handle"
    );

  if (observatoryTriggered) {
    return state.pendingIntent?.type === "observatory-handle"
      ? state.pendingIntent
      : buildObservatoryIntentFromLink(event.sourceElement as HTMLAnchorElement);
  }

  const observatoryForwardFromHome = isHomePath(event.from.pathname)
    && isObservatoryPath(event.to.pathname);

  if (observatoryForwardFromHome) {
    return {
      type: "observatory-handle",
      direction: "open",
      fromPath: event.from.pathname,
      href: event.to.pathname,
    };
  }

  const observatoryBackHome = isObservatoryPath(event.from.pathname)
    && isHomePath(event.to.pathname)
    && String(event.direction) === "back";

  if (observatoryBackHome) {
    return {
      type: "observatory-handle",
      direction: "close",
      fromPath: event.from.pathname,
      href: event.to.pathname,
    };
  }

  const searchForwardFromHome = isHomePath(event.from.pathname)
    && isSearchPath(event.to.pathname)
    && String(event.navigationType) === "traverse";

  if (searchForwardFromHome) {
    return {
      type: "search-handle",
      direction: "open",
      fromPath: event.from.pathname,
      href: event.to.pathname,
    };
  }

  const searchBackHome = isSearchPath(event.from.pathname)
    && isHomePath(event.to.pathname)
    && String(event.direction) === "back";

  if (searchBackHome) {
    return {
      type: "search-handle",
      direction: "close",
      fromPath: event.from.pathname,
      href: event.to.pathname,
    };
  }

  const characterDossierOpen = isCharacterIndexPath(event.from.pathname)
    && isCharacterDetailPath(event.to.pathname);

  if (characterDossierOpen) {
    return {
      type: "character-dossier",
      direction: "open",
      fromPath: event.from.pathname,
      href: event.to.pathname,
    };
  }

  const characterDossierClose = isCharacterDetailPath(event.from.pathname)
    && isCharacterIndexPath(event.to.pathname);

  if (characterDossierClose) {
    return {
      type: "character-dossier",
      direction: "close",
      fromPath: event.from.pathname,
      href: event.to.pathname,
    };
  }

  return null;
}

function handleBeforePreparation(event: Event) {
  if (!isTransitionBeforePreparationEvent(event)) return;

  const state = getRuntimeState();
  const defaultLoader = event.loader;
  state.isPageReady = false;
  state.activeIntent = resolveNavigationIntent(event);
  state.lastIntent = state.activeIntent;
  state.lastNavigation = {
    direction: String(event.direction),
    from: event.from.pathname,
    navigationType: String(event.navigationType),
    to: event.to.pathname,
  };

  event.loader = async () => {
    await defaultLoader();
    await warmDocumentImages(event.newDocument, event.signal);
  };

  applyTransitionIntent(document, state.activeIntent);
  setLifecycleClasses(["is-preparing-transition", "is-transitioning"], ["is-page-ready", "is-swap-pending", "is-swapping"]);
  logTransitionEvent("astro:before-preparation", {
    direction: String(event.direction),
    from: event.from.pathname,
    intent: state.activeIntent?.type ?? null,
    navigationType: String(event.navigationType),
    to: event.to.pathname,
  });
}

function handleAfterPreparation() {
  setLifecycleClasses(["is-swap-pending", "is-transitioning"], ["is-preparing-transition", "is-page-ready", "is-swapping"]);
  logTransitionEvent("astro:after-preparation");
}

function handleBeforeSwap(event: Event) {
  if (!isTransitionBeforeSwapEvent(event)) return;

  const state = getRuntimeState();
  const activeIntent = state.activeIntent;
  setLifecycleClasses(["is-swapping", "is-transitioning"], ["is-preparing-transition", "is-swap-pending", "is-page-ready"]);
  applyTransitionIntent(document, activeIntent);
  applyTransitionIntent(event.newDocument, activeIntent);
  cleanupInitializers();

  if (activeIntent?.type === "search") {
    event.viewTransition.finished.finally(() => {
      clearTransitionIntent(document);
    });

    event.viewTransition.ready.then(() => {
      if (prefersReducedMotion()) return;
      animateSearchReveal(activeIntent);
    }).catch(() => {
      clearTransitionIntent(document);
    });
  } else if (
    activeIntent?.type === "observatory-handle"
    || activeIntent?.type === "search-handle"
    || activeIntent?.type === "character-dossier"
    || activeIntent?.type === "observatory-system"
  ) {
    const clearHandleIntent = () => clearTransitionIntent(document);
    event.viewTransition.finished.finally(clearHandleIntent);
    window.setTimeout(clearHandleIntent, HANDLE_INTENT_CLEAR_DELAY);
  }

  logTransitionEvent("astro:before-swap");
}

function handleAfterSwap() {
  setLifecycleClasses(["is-transitioning"], ["is-preparing-transition", "is-swap-pending", "is-swapping", "is-page-ready"]);
  logTransitionEvent("astro:after-swap");
}

function handlePageLoad() {
  const state = getRuntimeState();
  const keepIntentUntilTransitionFinished = state.lastIntent?.type === "observatory-handle"
    || state.lastIntent?.type === "search-handle"
    || state.lastIntent?.type === "character-dossier"
    || state.lastIntent?.type === "observatory-system";
  state.isPageReady = true;
  state.pendingIntent = null;

  flushPendingRegistrations();
  runInitializers();
  setLifecycleClasses(["is-page-ready"], ["is-preparing-transition", "is-swap-pending", "is-swapping", "is-transitioning"]);
  if (!keepIntentUntilTransitionFinished) clearTransitionIntent(document);
  scheduleRouteWarmup();
  logTransitionEvent("astro:page-load");

  document.dispatchEvent(new CustomEvent("sine:page-ready", {
    detail: {
      intent: state.lastIntent?.type ?? null,
      route: location.pathname,
    },
  }));
}

function installSearchIntentCapture() {
  document.addEventListener("pointerdown", (event) => {
    const link = getSearchTriggerLink(event.target);
    if (link && isPlainLeftClick(event)) {
      getRuntimeState().pendingIntent = buildSearchIntentFromLink(link);
      return;
    }

    const observatoryLink = getObservatoryTriggerLink(event.target);
    if (observatoryLink && isPlainLeftClick(event)) {
      getRuntimeState().pendingIntent = buildObservatoryIntentFromLink(observatoryLink);
      return;
    }

    const observatorySystemLink = getObservatorySystemTriggerLink(event.target);
    if (observatorySystemLink && isPlainLeftClick(event)) {
      prepareObservatorySystemSymbol(observatorySystemLink);
      getRuntimeState().pendingIntent = buildObservatorySystemIntentFromLink(observatorySystemLink);
      return;
    }

    const searchHandleLink = getSearchHandleTriggerLink(event.target);
    if (!searchHandleLink || !isPlainLeftClick(event)) return;
    getRuntimeState().pendingIntent = buildSearchHandleIntentFromLink(searchHandleLink);
  }, true);

  document.addEventListener("click", (event) => {
    const link = getSearchTriggerLink(event.target);
    if (link && isPlainLeftClick(event)) {
      getRuntimeState().pendingIntent = buildSearchIntentFromLink(link);
      return;
    }

    const observatoryLink = getObservatoryTriggerLink(event.target);
    if (observatoryLink && isPlainLeftClick(event)) {
      getRuntimeState().pendingIntent = buildObservatoryIntentFromLink(observatoryLink);
      return;
    }

    const observatorySystemLink = getObservatorySystemTriggerLink(event.target);
    if (observatorySystemLink && isPlainLeftClick(event)) {
      prepareObservatorySystemSymbol(observatorySystemLink);
      getRuntimeState().pendingIntent = buildObservatorySystemIntentFromLink(observatorySystemLink);
      return;
    }

    const searchHandleLink = getSearchHandleTriggerLink(event.target);
    if (!searchHandleLink || !isPlainLeftClick(event)) return;
    getRuntimeState().pendingIntent = buildSearchHandleIntentFromLink(searchHandleLink);
  }, true);
}

function installLifecycle() {
  if (window.__sineTransitionLifecycleInstalled) return;
  window.__sineTransitionLifecycleInstalled = true;

  window.registerPageInit = registerPageInit;
  flushPendingRegistrations();
  installSearchIntentCapture();

  document.addEventListener("astro:before-preparation", handleBeforePreparation);
  document.addEventListener("astro:after-preparation", handleAfterPreparation);
  document.addEventListener("astro:before-swap", handleBeforeSwap);
  document.addEventListener("astro:after-swap", handleAfterSwap);
  document.addEventListener("astro:page-load", handlePageLoad);
}

installLifecycle();
