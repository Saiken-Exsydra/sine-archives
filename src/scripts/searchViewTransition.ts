import { navigate } from "astro:transitions/client";

declare global {
  interface Window {
    __searchViewTransitionInstalled?: boolean;
    __searchViewTransitionCleanupTimer?: number;
  }
}

const SEARCH_TRANSITION_DURATION = 1500;
const SEARCH_TRANSITION_EASING = "cubic-bezier(.16, 1, .3, 1)";

type SearchTransitionInfo = {
  type: "search-open";
  x: number;
  y: number;
};

function getRevealRadius(x: number, y: number) {
  const topLeft = Math.hypot(x, y);
  const topRight = Math.hypot(window.innerWidth - x, y);
  const bottomLeft = Math.hypot(x, window.innerHeight - y);
  const bottomRight = Math.hypot(window.innerWidth - x, window.innerHeight - y);

  return Math.max(topLeft, topRight, bottomLeft, bottomRight) + 80;
}

function isModifiedClick(event: MouseEvent) {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setSearchTransitionState(x: number, y: number) {
  document.documentElement.style.setProperty("--search-vt-x", `${x}px`);
  document.documentElement.style.setProperty("--search-vt-y", `${y}px`);
  document.documentElement.dataset.searchVt = "active";
}

function clearSearchTransitionState() {
  document.documentElement.removeAttribute("data-search-vt");
  document.documentElement.style.removeProperty("--search-vt-x");
  document.documentElement.style.removeProperty("--search-vt-y");
}

function scheduleSearchTransitionCleanup() {
  if (window.__searchViewTransitionCleanupTimer) {
    window.clearTimeout(window.__searchViewTransitionCleanupTimer);
  }

  window.__searchViewTransitionCleanupTimer = window.setTimeout(() => {
    clearSearchTransitionState();
    window.__searchViewTransitionCleanupTimer = undefined;
  }, SEARCH_TRANSITION_DURATION + 250);
}

function installSearchViewTransition() {
  if (window.__searchViewTransitionInstalled) return;
  window.__searchViewTransitionInstalled = true;

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("[data-search-trigger]");
      if (!link) return;

      if (isModifiedClick(event)) return;
      if (link.target && link.target !== "_self") return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash === window.location.hash) {
        return;
      }

      event.preventDefault();

      const rect = link.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      setSearchTransitionState(x, y);

      const info: SearchTransitionInfo = {
        type: "search-open",
        x,
        y,
      };

      void navigate(url.pathname + url.search + url.hash, {
        history: "push",
        sourceElement: link,
        info,
      }).catch(() => {
        clearSearchTransitionState();
        window.location.href = url.href;
      });
    },
    true,
  );

  document.addEventListener("astro:before-swap", (event) => {
    const transitionEvent = event as Event & {
      info?: SearchTransitionInfo;
      newDocument?: Document;
      viewTransition?: ViewTransition;
    };

    const info = transitionEvent.info;
    if (!info || info.type !== "search-open") return;

    const { x, y } = info;
    setSearchTransitionState(x, y);
    const nextRoot = transitionEvent.newDocument?.documentElement;
    if (nextRoot) {
      nextRoot.style.setProperty("--search-vt-x", `${x}px`);
      nextRoot.style.setProperty("--search-vt-y", `${y}px`);
      nextRoot.dataset.searchVt = "active";
    }

    transitionEvent.viewTransition?.ready.then(() => {
      if (prefersReducedMotion()) return;

      const radius = getRevealRadius(x, y);
      const origin = `${x}px ${y}px`;

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${origin})`,
            `circle(${radius * 0.22}px at ${origin})`,
            `circle(${radius * 0.62}px at ${origin})`,
            `circle(${radius}px at ${origin})`,
          ],
          opacity: [1, 1, 1, 1],
          filter: [
            "brightness(0.82) saturate(0.9)",
            "brightness(0.9) saturate(1)",
            "brightness(1) saturate(1.08)",
            "brightness(1) saturate(1)",
          ],
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
          opacity: [1, 0.72, 0.4, 0.18],
          filter: [
            "brightness(1)",
            "brightness(0.82)",
            "brightness(0.58)",
            "brightness(0.35)",
          ],
          transform: ["scale(1)", "scale(0.997)", "scale(0.992)", "scale(0.985)"],
        },
        {
          duration: SEARCH_TRANSITION_DURATION,
          easing: SEARCH_TRANSITION_EASING,
          fill: "both",
          pseudoElement: "::view-transition-old(root)",
        },
      );
    }).catch(() => {
      clearSearchTransitionState();
    });
  });

  document.addEventListener("astro:after-swap", () => {
    scheduleSearchTransitionCleanup();
  });

  document.addEventListener("astro:page-load", () => {
    if (!/^\/(?:pt-br\/)?search\/?$/.test(location.pathname)) return;

    window.setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(
        "[data-search-input], input[type=\"search\"], input[name=\"search\"]",
      );

      input?.focus?.({ preventScroll: true });
    }, SEARCH_TRANSITION_DURATION + 100);
  });
}

installSearchViewTransition();
