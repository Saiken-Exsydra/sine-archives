type MermaidApi = typeof import("mermaid").default;

export {};

declare global {
  interface Window {
    registerPageInit?: (key: string, init: () => void | (() => void)) => void;
  }
}

let mermaidPromise: Promise<MermaidApi> | null = null;
let renderSequence = 0;

function loadMermaid() {
  mermaidPromise ??= import("mermaid").then((module) => module.default);
  return mermaidPromise;
}

function token(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function mermaidConfig() {
  const text = token("--text", "#e8e4dc");

  return {
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    themeVariables: {
      background: "transparent",
      primaryColor: "#202020",
      primaryTextColor: text,
      primaryBorderColor: "#d0d0d0",
      lineColor: "#d0d0d0",
      secondaryColor: "#202020",
      tertiaryColor: "#151515",
      textColor: text,
      mainBkg: "#202020",
      nodeBorder: "#d0d0d0",
      clusterBkg: "#0b0b0b",
      clusterBorder: "#777777",
      edgeLabelBackground: "#000000",
      fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif",
      fontSize: "16px",
    },
    flowchart: {
      curve: "basis",
      htmlLabels: false,
      nodeSpacing: 64,
      rankSpacing: 62,
      padding: 20,
      useMaxWidth: true,
    },
  } as const;
}

function sourceFor(figure: HTMLElement) {
  return figure.querySelector<HTMLElement>(".mermaid-diagram__source code")?.textContent
    ?? figure.querySelector<HTMLElement>(".mermaid-diagram__viewport code")?.textContent
    ?? "";
}

function renderError(viewport: HTMLElement, message: string) {
  viewport.innerHTML = "";
  const error = document.createElement("div");
  error.className = "mermaid-diagram__error";
  error.textContent = message;
  viewport.append(error);
}

async function renderFigure(figure: HTMLElement, mermaid: MermaidApi) {
  const viewport = figure.querySelector<HTMLElement>(".mermaid-diagram__viewport");
  if (!viewport) return;

  const source = sourceFor(figure).trim();
  if (!source) return;
  if (figure.dataset.renderedSource === source && figure.dataset.state === "rendered") return;

  const baseId = figure.dataset.mermaidId || figure.id || "mermaid-diagram";
  const renderId = `${baseId}-${renderSequence += 1}`;

  figure.dataset.state = "loading";
  figure.dataset.renderedSource = source;

  try {
    await mermaid.parse(source);
    const { svg, bindFunctions } = await mermaid.render(renderId, source);

    viewport.innerHTML = svg;
    const svgElement = viewport.querySelector("svg");
    svgElement?.setAttribute("role", "img");
    svgElement?.setAttribute("aria-label", "Rendered Mermaid diagram");
    bindFunctions?.(viewport);
    figure.dataset.state = "rendered";
  } catch {
    figure.dataset.state = "error";
    renderError(viewport, "This Mermaid diagram could not be rendered. Open the source below to inspect the diagram text.");
  }
}

async function renderMermaidDiagrams(root: ParentNode = document) {
  const figures = Array.from(root.querySelectorAll<HTMLElement>("[data-mermaid-diagram]"));
  if (figures.length === 0) return;

  const mermaid = await loadMermaid();
  mermaid.initialize(mermaidConfig());

  await Promise.all(figures.map((figure) => renderFigure(figure, mermaid)));
}

function scheduleRender(root: ParentNode = document) {
  window.requestAnimationFrame(() => {
    void renderMermaidDiagrams(root);
  });
}

window.registerPageInit?.("codex-diagrams", () => {
  scheduleRender();

  const shell = document.getElementById("site-shell");
  const observer = new MutationObserver(() => scheduleRender());
  if (shell) {
    observer.observe(shell, { childList: true, subtree: true });
  }

  return () => observer.disconnect();
});
