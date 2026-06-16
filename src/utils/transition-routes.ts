export type RouteKind =
  | "home"
  | "search"
  | "character-index"
  | "character-detail"
  | "character-codex"
  | "section-index"
  | "entry-detail"
  | "generic";

export type TransitionProfile =
  | "default"
  | "search-reveal"
  | "character-stage"
  | "character-codex"
  | "entry-detail"
  | "section-index"
  | "redactory-desk"
  | "redactory-dive"
  | "redactory-profile"
  | "redactory-theorem"
  | "home";

export type TransitionRouteMeta = {
  route: string;
  routeKind: RouteKind;
  transitionProfile: TransitionProfile | string;
};

function normalizeRoutePath(pathname: string) {
  if (!pathname || pathname === "/") return "home";
  return pathname.replace(/^\/+|\/+$/g, "") || "home";
}

export function isSearchPath(pathname: string) {
  return /^\/(?:pt-br\/)?search\/?$/i.test(pathname);
}

export function isHomePath(pathname: string) {
  return /^\/(?:pt-br\/)?$/i.test(pathname);
}

export function getDefaultTransitionProfile(routeKind: RouteKind): TransitionProfile {
  switch (routeKind) {
    case "search":
      return "search-reveal";
    case "character-index":
    case "character-detail":
      return "character-stage";
    case "character-codex":
      return "character-codex";
    case "entry-detail":
      return "entry-detail";
    case "section-index":
      return "section-index";
    case "home":
      return "home";
    default:
      return "default";
  }
}

export function resolveTransitionRouteMeta(
  pathname: string,
  routeKind: RouteKind = "generic",
  transitionProfile?: string,
): TransitionRouteMeta {
  return {
    route: normalizeRoutePath(pathname),
    routeKind,
    transitionProfile: transitionProfile ?? getDefaultTransitionProfile(routeKind),
  };
}
