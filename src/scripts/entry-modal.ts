type EntryModalOptions = {
  overlay: HTMLElement;
  modal: HTMLElement;
  closeButton: HTMLElement;
  body: HTMLElement;
};

/** Shared behavior only: each archive family owns its markup and presentation. */
export function createEntryModal({ overlay, modal, closeButton, body }: EntryModalOptions) {
  // A named View Transition element creates a stacking context. Keep overlays above the shell.
  const placeholder = document.createComment("entry modal position");
  overlay.before(placeholder);
  document.body.append(overlay);
  const controller = new AbortController();
  const { signal } = controller;
  let request: AbortController | undefined;
  let closeTimer = 0;
  let opener: HTMLElement | null = null;
  let previousOverflow = "";
  let isOpen = false;
  const background = new Map<HTMLElement, boolean>();
  const focusable = () => [...modal.querySelectorAll<HTMLElement>(
    'a[href], button, input, select, textarea, summary, [tabindex]',
  )].filter((node) => node.tabIndex >= 0 && !node.matches(':disabled')
    && !node.closest('[inert]') && node.getClientRects().length > 0
    && getComputedStyle(node).visibility !== 'hidden');

  overlay.inert = true;
  modal.tabIndex = -1;

  function finishClose(restoreFocus: boolean) {
    window.clearTimeout(closeTimer);
    request?.abort();
    if (!isOpen) return;
    isOpen = false;
    background.forEach((inert, node) => { node.inert = inert; });
    background.clear();
    document.body.style.overflow = previousOverflow;
    if (restoreFocus && opener?.isConnected) opener.focus({ preventScroll: true });
    overlay.inert = true;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    modal.classList.remove("is-closing");
    if (document.fullscreenElement === modal) void document.exitFullscreen().catch(() => {});
  }

  function close() {
    if (!isOpen || modal.classList.contains("is-closing")) return;
    request?.abort();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose(true);
      return;
    }
    modal.classList.add("is-closing");
    const duration = parseFloat(getComputedStyle(overlay).getPropertyValue("--modal-motion-duration")) || 380;
    closeTimer = window.setTimeout(() => finishClose(true), duration);
  }

  function open() {
    window.clearTimeout(closeTimer);
    if (!isOpen) {
      opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      previousOverflow = document.body.style.overflow;
      // Inert only siblings along the ancestor chain, never the dialog's parent.
      let branch: HTMLElement = overlay;
      while (branch.parentElement) {
        for (const sibling of branch.parentElement.children) {
          if (sibling === branch || !(sibling instanceof HTMLElement)) continue;
          background.set(sibling, sibling.inert);
          sibling.inert = true;
        }
        branch = branch.parentElement;
        if (branch === document.body) break;
      }
    }
    isOpen = true;
    overlay.inert = false;
    overlay.setAttribute("aria-hidden", "false");
    overlay.classList.add("is-open");
    modal.classList.remove("is-closing");
    document.body.style.overflow = "hidden";
    closeButton.focus({ preventScroll: true });
  }

  async function load(url: string, fallback: string, loading: string) {
    request?.abort();
    const current = new AbortController();
    request = current;
    const paragraph = (text: string) => {
      const node = document.createElement("p");
      node.textContent = text;
      body.replaceChildren(node);
    };
    paragraph(loading);
    body.setAttribute("aria-busy", "true");
    try {
      const response = await fetch(url, { signal: current.signal });
      if (!response.ok) throw new Error(`Entry returned ${response.status}`);
      const html = await response.text();
      if (current.signal.aborted || !body.isConnected) return;
      const doc = new DOMParser().parseFromString(html, "text/html");
      const content = doc.querySelector("[data-entry-body], .entry-body, article");
      if (content) body.innerHTML = content.innerHTML;
      else paragraph(fallback);
      body.scrollTop = 0;
    } catch {
      if (!current.signal.aborted && body.isConnected) paragraph(fallback);
    } finally {
      if (request === current) body.removeAttribute("aria-busy");
    }
  }

  closeButton.addEventListener("click", close, { signal });
  overlay.addEventListener("click", (event) => { if (event.target === overlay) close(); }, { signal });
  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;
    if (event.key === "Escape") { event.preventDefault(); close(); }
    if (event.key !== "Tab") return;
    event.preventDefault();
    const nodes = focusable();
    const index = nodes.indexOf(document.activeElement as HTMLElement);
    const next = event.shiftKey
      ? (index <= 0 ? nodes.length - 1 : index - 1)
      : (index + 1) % nodes.length;
    (nodes[next] ?? modal).focus();
  }, { signal });
  document.addEventListener("focusin", (event) => {
    if (isOpen && event.target instanceof Node && !modal.contains(event.target)) closeButton.focus();
  }, { signal });

  return { open, close, load, destroy() {
    controller.abort();
    finishClose(false);
    placeholder.replaceWith(overlay);
  } };
}

export function renderEntryFields(container: HTMLElement, fields: Record<string, unknown>, prefix: string) {
  const rows = Object.entries(fields).map(([key, value]) => {
    const row = document.createElement("div");
    row.className = `${prefix}-field-row`;
    for (const [kind, text] of [["key", key], ["val", String(value)]] as const) {
      const cell = document.createElement("div");
      cell.className = `${prefix}-field-${kind}`;
      cell.textContent = text;
      row.append(cell);
    }
    return row;
  });
  container.replaceChildren(...rows);
}
