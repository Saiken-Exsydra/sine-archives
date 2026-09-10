import { createEntryModal, renderEntryFields } from "./entry-modal";

type Panel = {
  slug: string;
  image?: string;
  fields?: Record<string, string>;
  tags?: string[];
  accent?: string;
  accentColor?: string;
  type?: string;
  subtitle?: string;
  title?: string;
  label?: string;
  designation?: string;
  summary?: string;
  tagline?: string;
};

window.registerPageInit?.("entry-index-modal", () => {
  const overlay = document.querySelector<HTMLElement>("[data-entry-modal]");
  if (!overlay) return;
  const prefix = overlay.dataset.entryModal!;
  const entryBase = overlay.dataset.entryBase!;
  const byId = <T extends HTMLElement = HTMLElement>(name: string) =>
    overlay.querySelector<T>(`#${prefix}-modal-${name}`)!;
  const modal = overlay.querySelector<HTMLElement>(`#${prefix}-modal`)!;
  const body = byId(prefix === "sine" ? "main" : "body");
  const closeButton = byId("close");
  const panels: Panel[] = JSON.parse(overlay.dataset.panels || "[]");
  const controller = new AbortController();
  const { signal } = controller;
  const dialog = createEntryModal({ overlay, modal, closeButton, body });
  const loading = document.documentElement.lang === "pt-BR" ? "Carregando entrada…" : "Loading…";

  function openPanel(panel: Panel) {
    const accent = panel.accent ?? panel.accentColor ?? "#b13a34";
    const img = byId<HTMLImageElement>("img");
    if (panel.image) img.src = panel.image;
    else img.removeAttribute("src");
    img.style.display = panel.image ? "" : "none";
    byId("title").textContent = panel.title ?? panel.label ?? "";
    renderEntryFields(byId("fields"), panel.fields ?? {}, prefix);

    if (prefix === "sine") {
      byId("accent").style.background = `linear-gradient(135deg, ${accent}33, transparent)`;
      byId("subtitle").textContent = panel.subtitle ?? "";
      byId("subtitle").style.color = accent;
      byId("tagline").textContent = `"${panel.tagline ?? ""}"`;
      byId("sidebar-title").style.color = accent;
      byId("divider").style.background = accent;
      modal.querySelector(".sine-modal__body")?.scrollTo({ top: 0 });
    } else {
      byId("accent").style.background = `linear-gradient(to top, ${accent}33, transparent 55%)`;
      byId("bar").style.background = `linear-gradient(to bottom, transparent, ${accent}aa, transparent)`;
      byId("type").textContent = (panel.type || "Cosmology").toUpperCase();
      byId("type").style.color = accent;
      byId("designation").textContent = panel.designation ?? "";
      byId("designation").style.color = accent;
      byId("fields-title").style.color = accent;
      byId("lead").textContent = panel.summary ?? "";
      byId("tags").replaceChildren(...(panel.tags ?? []).map((text) => {
        const tag = document.createElement("span");
        tag.className = "cosmo-modal__tag";
        tag.style.borderColor = `${accent}55`;
        tag.textContent = text;
        return tag;
      }));
      byId("pane").scrollTop = 0;
    }
    body.scrollTop = 0;
    dialog.open();
    void dialog.load(`${entryBase}${panel.slug}/`, panel.summary ?? panel.tagline ?? "", loading);
  }

  const triggerSelector = prefix === "sine" ? ".sine-panel[data-slug]" : ".cosmo-root [data-open-entry]";
  document.querySelectorAll<HTMLElement>(triggerSelector).forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const panel = panels.find((item) => item.slug === (trigger.dataset.slug ?? trigger.dataset.openEntry));
      if (!panel) return;
      // Safari does not focus buttons on pointer activation; retain a concrete return target.
      trigger.focus({ preventScroll: true });
      openPanel(panel);
    }, { signal });
  });

  const fullscreen = byId("fullscreen");
  if (fullscreen) {
    if (!modal.requestFullscreen) fullscreen.hidden = true;
    else {
      const sync = () => {
        const active = document.fullscreenElement === modal;
        const label = (active ? fullscreen.dataset.exitLabel : fullscreen.dataset.enterLabel) ?? "Full screen";
        fullscreen.setAttribute("aria-label", label);
        fullscreen.setAttribute("title", label);
        fullscreen.setAttribute("aria-pressed", String(active));
        fullscreen.classList.toggle("is-active", active);
      };
      fullscreen.addEventListener("click", async () => {
        try {
          if (document.fullscreenElement === modal) await document.exitFullscreen();
          else await modal.requestFullscreen();
        } catch { sync(); }
      }, { signal });
      document.addEventListener("fullscreenchange", sync, { signal });
      sync();
    }
  }
  return () => { controller.abort(); dialog.destroy(); };
}, { persistent: true });
