import type {
  TransitionBeforePreparationEvent,
} from "astro:transitions/client";
import {
  isTransitionBeforePreparationEvent,
  isTransitionBeforeSwapEvent,
} from "astro:transitions/client";
import { isSearchPath } from "../utils/transition-routes";

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
  activeIntent: SearchIntent | null;
  cleanups: Map<string, PageCleanup>;
  debugEvents: TransitionDebugEvent[];
  initializers: Map<string, PageInit>;
  isPageReady: boolean;
  lastIntent: SearchIntent | null;
  lastNavigation: {
    direction: string;
    from: string;
    navigationType: string;
    to: string;
  } | null;
  pendingIntent: SearchIntent | null;
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
const SEARCH_TRANSITION_DURATION = 1500;
const SEARCH_TRANSITION_EASING = "cubic-bezier(.16, 1, .3, 1)";
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
  root.style.removeProperty("--search-vt-x");
  root.style.removeProperty("--search-vt-y");
}

function applyTransitionIntent(doc: Document, intent: SearchIntent | null) {
  clearTransitionIntent(doc);
  if (!intent) return;

  const root = doc.documentElement;
  root.dataset.transitionIntent = intent.type;
  root.style.setProperty("--search-vt-x", `${intent.x}px`);
  root.style.setProperty("--search-vt-y", `${intent.y}px`);
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

function resolveNavigationIntent(event: TransitionBeforePreparationEvent) {
  const state = getRuntimeState();
  const searchTriggered = isSearchPath(event.to.pathname)
    && (
      getSearchTriggerLink(event.sourceElement ?? null)
      || (state.pendingIntent && new URL(state.pendingIntent.href, location.href).pathname === event.to.pathname)
    );

  if (!searchTriggered) return null;
  return state.pendingIntent ?? buildSearchIntentFromLink(event.sourceElement as HTMLAnchorElement);
}

function handleBeforePreparation(event: Event) {
  if (!isTransitionBeforePreparationEvent(event)) return;

  const state = getRuntimeState();
  state.isPageReady = false;
  state.activeIntent = resolveNavigationIntent(event);
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
  setLifecycleClasses(["is-swapping", "is-transitioning"], ["is-preparing-transition", "is-swap-pending", "is-page-ready"]);
  applyTransitionIntent(document, state.activeIntent);
  applyTransitionIntent(event.newDocument, state.activeIntent);
  cleanupInitializers();

  if (state.activeIntent?.type === "search") {
    event.viewTransition.finished.finally(() => {
      clearTransitionIntent(document);
    });

    event.viewTransition.ready.then(() => {
      if (prefersReducedMotion()) return;
      animateSearchReveal(state.activeIntent!);
    }).catch(() => {
      clearTransitionIntent(document);
    });
  }

  logTransitionEvent("astro:before-swap");
}

function handleAfterSwap() {
  setLifecycleClasses(["is-transitioning"], ["is-preparing-transition", "is-swap-pending", "is-swapping", "is-page-ready"]);
  logTransitionEvent("astro:after-swap");
}

function handlePageLoad() {
  const state = getRuntimeState();
  state.isPageReady = true;
  state.pendingIntent = null;

  flushPendingRegistrations();
  runInitializers();
  setLifecycleClasses(["is-page-ready"], ["is-preparing-transition", "is-swap-pending", "is-swapping", "is-transitioning"]);
  clearTransitionIntent(document);
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
    if (!link || !isPlainLeftClick(event)) return;
    getRuntimeState().pendingIntent = buildSearchIntentFromLink(link);
  }, true);

  document.addEventListener("click", (event) => {
    const link = getSearchTriggerLink(event.target);
    if (!link || !isPlainLeftClick(event)) return;
    getRuntimeState().pendingIntent = buildSearchIntentFromLink(link);
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
