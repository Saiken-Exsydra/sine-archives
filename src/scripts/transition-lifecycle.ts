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
type PageInitOptions = { persistent?: boolean };
type PendingPageInit = [key: string, init: PageInit, options?: PageInitOptions];
type PageInitializerRecord = { init: PageInit; key: string; persistent: boolean; route: string };

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
  navigationId: number;
  timestamp: number;
  to: string;
};

type TransitionRuntimeState = {
  activeIntent: TransitionIntent | null;
  cleanups: Map<string, PageCleanup>;
  debugEvents: TransitionDebugEvent[];
  initializers: Map<string, PageInitializerRecord>;
  isPageReady: boolean;
  lastIntent: TransitionIntent | null;
  lastNavigation: {
    direction: string;
    from: string;
    navigationType: string;
    to: string;
  } | null;
  pendingIntent: TransitionIntent | null;
  navigationId: number;
};

declare global {
  interface Window {
    __sinePendingPageInits?: PendingPageInit[];
    __sineTransitionLifecycleInstalled?: boolean;
    __sineTransitionState?: TransitionRuntimeState;
    registerPageInit?: (key: string, init: PageInit, options?: PageInitOptions) => void;
  }
}

const DEBUG_PREFIX = "[sine-transitions]";
const HANDLE_INTENT_CLEAR_DELAY = 950;
const OBSERVATORY_SYMBOL_RESET_DELAY = 1100;
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
      navigationId: 0,
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
    navigationId: detail?.navigationId ?? state.navigationId,
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

function runInitializer(id: string, record: PageInitializerRecord) {
  const state = getRuntimeState();
  const existingCleanup = state.cleanups.get(id);
  if (existingCleanup) {
    try {
      existingCleanup();
    } catch (error) {
      console.error(DEBUG_PREFIX, "initializer cleanup failed", error);
    }
  }

  let cleanup: void | PageCleanup;
  try {
    cleanup = record.init();
  } catch (error) {
    state.cleanups.delete(id);
    console.error(DEBUG_PREFIX, `initializer failed: ${record.key}`, error);
    return;
  }
  if (typeof cleanup === "function") {
    state.cleanups.set(id, cleanup);
  } else {
    state.cleanups.delete(id);
  }
}

function runInitializers() {
  const state = getRuntimeState();
  const route = currentRoute();
  for (const [id, record] of state.initializers) {
    if (!record.persistent && record.route !== route) continue;
    runInitializer(id, record);
  }
}

function currentRoute() {
  return document.documentElement.dataset.route || location.pathname;
}

function getInitializerId(key: string, route: string, persistent: boolean) {
  return persistent ? `persistent:${key}` : `route:${route}:${key}`;
}

export function registerPageInit(key: string, init: PageInit, options: PageInitOptions = {}) {
  const state = getRuntimeState();
  const route = currentRoute();
  const persistent = options.persistent === true;
  const id = getInitializerId(key, route, persistent);
  const record = { init, key, persistent, route };
  state.initializers.set(id, record);

  if (state.isPageReady) {
    runInitializer(id, record);
  }
}

function flushPendingRegistrations() {
  const queue = window.__sinePendingPageInits;
  if (!queue?.length) return;

  while (queue.length > 0) {
    const [key, init, options] = queue.shift()!;
    registerPageInit(key, init, options);
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

function getRevealRadius(x: number, y: number) {
  const topLeft = Math.hypot(x, y);
  const topRight = Math.hypot(window.innerWidth - x, y);
  const bottomLeft = Math.hypot(x, window.innerHeight - y);
  const bottomRight = Math.hypot(window.innerWidth - x, window.innerHeight - y);

  return Math.max(topLeft, topRight, bottomLeft, bottomRight) + 80;
}

function animateSearchReveal(intent: SearchIntent) {
  const styles = getComputedStyle(document.documentElement);
  const duration = parseFloat(styles.getPropertyValue("--search-vt-duration")) || 1050;
  const easing = styles.getPropertyValue("--search-vt-ease").trim() || "ease-out";
  const radius = getRevealRadius(intent.x, intent.y);
  const origin = `${intent.x}px ${intent.y}px`;

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${origin})`,
        `circle(${radius * 0.42}px at ${origin})`,
        `circle(${radius}px at ${origin})`,
      ],
      opacity: [0.86, 1, 1],
    },
    {
      duration,
      easing,
      fill: "both",
      pseudoElement: "::view-transition-new(root)",
    },
  );

  document.documentElement.animate(
    {
      opacity: [1, 0.62, 0.18],
      transform: ["scale(1)", "scale(0.995)", "scale(0.985)"],
    },
    {
      duration,
      easing,
      fill: "both",
      pseudoElement: "::view-transition-old(root)",
    },
  );
}

function pendingIntentMatches(intent: TransitionIntent | null, destination: URL) {
  if (!intent) return false;
  try {
    const intended = new URL(intent.href, location.href);
    return intended.origin === destination.origin
      && intended.pathname === destination.pathname
      && intended.search === destination.search;
  } catch {
    return false;
  }
}

function resolveNavigationIntent(event: TransitionBeforePreparationEvent): TransitionIntent | null {
  const state = getRuntimeState();
  const matchingPendingIntent = pendingIntentMatches(state.pendingIntent, event.to) ? state.pendingIntent : null;
  const observatorySystemTriggered = isObservatoryPath(event.from.pathname)
    && isSystemInteractivePath(event.to.pathname)
    && (
      getObservatorySystemTriggerLink(event.sourceElement ?? null)
      || matchingPendingIntent?.type === "observatory-system"
    );

  if (observatorySystemTriggered) {
    return matchingPendingIntent?.type === "observatory-system"
      ? matchingPendingIntent
      : buildObservatorySystemIntentFromLink(event.sourceElement as HTMLAnchorElement);
  }

  const searchHandleTriggered = isSearchPath(event.to.pathname)
    && (
      getSearchHandleTriggerLink(event.sourceElement ?? null)
      || matchingPendingIntent?.type === "search-handle"
    );

  if (searchHandleTriggered) {
    return matchingPendingIntent?.type === "search-handle"
      ? matchingPendingIntent
      : buildSearchHandleIntentFromLink(event.sourceElement as HTMLAnchorElement);
  }

  const searchTriggered = isSearchPath(event.to.pathname)
    && (
      getSearchTriggerLink(event.sourceElement ?? null)
      || matchingPendingIntent?.type === "search"
    );

  if (searchTriggered) {
    return matchingPendingIntent?.type === "search"
      ? matchingPendingIntent
      : buildSearchIntentFromLink(event.sourceElement as HTMLAnchorElement);
  }

  const observatoryTriggered = isObservatoryPath(event.to.pathname)
    && (
      getObservatoryTriggerLink(event.sourceElement ?? null)
      || matchingPendingIntent?.type === "observatory-handle"
    );

  if (observatoryTriggered) {
    return matchingPendingIntent?.type === "observatory-handle"
      ? matchingPendingIntent
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
  state.navigationId += 1;
  state.isPageReady = false;
  state.activeIntent = resolveNavigationIntent(event);
  state.pendingIntent = null;
  state.lastIntent = state.activeIntent;
  state.lastNavigation = {
    direction: String(event.direction),
    from: event.from.pathname,
    navigationType: String(event.navigationType),
    to: event.to.pathname,
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
  const navigationId = state.navigationId;
  const clearCurrentIntent = () => {
    if (getRuntimeState().navigationId === navigationId) clearTransitionIntent(document);
  };
  setLifecycleClasses(["is-swapping", "is-transitioning"], ["is-preparing-transition", "is-swap-pending", "is-page-ready"]);
  applyTransitionIntent(document, activeIntent);
  applyTransitionIntent(event.newDocument, activeIntent);
  cleanupInitializers();

  if (activeIntent?.type === "search") {
    const clearSearchIntent = clearCurrentIntent;
    void event.viewTransition.finished.then(clearSearchIntent, clearSearchIntent);

    event.viewTransition.ready.then(() => {
      if (prefersReducedMotion() || getRuntimeState().navigationId !== navigationId) return;
      animateSearchReveal(activeIntent);
    }).catch(clearCurrentIntent);
  } else if (
    activeIntent?.type === "observatory-handle"
    || activeIntent?.type === "search-handle"
    || activeIntent?.type === "character-dossier"
    || activeIntent?.type === "observatory-system"
  ) {
    const clearHandleIntent = clearCurrentIntent;
    void event.viewTransition.finished.then(clearHandleIntent, clearHandleIntent);
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
  assertPageReadyInvariants();
  logTransitionEvent("astro:page-load");

  document.dispatchEvent(new CustomEvent("sine:page-ready", {
    detail: {
      intent: state.lastIntent?.type ?? null,
      route: location.pathname,
    },
  }));
}

function assertPageReadyInvariants() {
  if (!import.meta.env.DEV) return;

  const root = document.documentElement;
  if (root.classList.contains("is-transitioning")) {
    console.error(DEBUG_PREFIX, "page load settled with a transition lock still active");
  }
  if (root.inert || document.body.inert) {
    console.error(DEBUG_PREFIX, "page load settled with the document left inert");
  }

  if (isCharacterIndexPath(location.pathname)) {
    const state = getRuntimeState();
    const route = currentRoute();
    const id = getInitializerId("characters-page", route, false);
    const characterRoot = document.querySelector("#chars-root");
    if (!state.initializers.has(id) || !state.cleanups.has(id) || characterRoot?.getAttribute("data-character-controller") !== "ready") {
      console.error(DEBUG_PREFIX, "character index settled without one active controller", {
        cleanupActive: state.cleanups.has(id),
        controllerRegistered: state.initializers.has(id),
        rootConnected: characterRoot?.isConnected === true,
      });
    }
  }
}

function handlePageShow(event: PageTransitionEvent) {
  if (!event.persisted) return;

  const state = getRuntimeState();
  state.isPageReady = true;
  state.pendingIntent = null;
  cleanupInitializers();
  flushPendingRegistrations();
  runInitializers();
  setLifecycleClasses(["is-page-ready"], ["is-preparing-transition", "is-swap-pending", "is-swapping", "is-transitioning"]);
  clearTransitionIntent(document);
  assertPageReadyInvariants();
  logTransitionEvent("pageshow:persisted");
}

function installSearchIntentCapture() {
  const captureIntent = (event: MouseEvent | PointerEvent) => {
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
  };
  document.addEventListener("pointerdown", captureIntent, true);
  document.addEventListener("click", captureIntent, true);
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
  window.addEventListener("pageshow", handlePageShow);
}

installLifecycle();
