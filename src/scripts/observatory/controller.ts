import type { ObservatoryData, ObservatoryConcept, ObservatoryImage } from '../../data/observatory';
import { navigateObservatory } from '../transition-lifecycle';
import { createArchiveField } from './archive-field';
import { createObservatoryMotion } from './motion';

export function initObservatory() {
  const candidateRoot = document.querySelector<HTMLElement>('[data-observatory-root]');
  if (!candidateRoot) return;
  const root: HTMLElement = candidateRoot;
  const data: ObservatoryData = JSON.parse(root.querySelector('[data-observatory-data]')!.textContent!);
  const abort = new AbortController(), { signal } = abort;
  const field = createArchiveField(root);
  const motion = createObservatoryMotion(root);
  const stage = root.querySelector<HTMLElement>('.observatory-stage')!;
  const page = root.querySelector<HTMLElement>('[data-floating-page]')!;
  const body = root.querySelector<HTMLElement>('[data-page-body]')!;
  const lineage = root.querySelector<HTMLElement>('[data-concept-lineage]')!;
  const popover = root.querySelector<HTMLElement>('[data-definition]')!;
  const relationPanel = root.querySelector<HTMLElement>('[data-relations-panel]')!;
  const relationDetail = root.querySelector<HTMLElement>('[data-relationship-detail]')!;
  const byId = new Map(data.systems.map(s => [s.id, s]));
  const originalPath = location.pathname;
  let current = '', selected = '', conceptId = '', origin: DOMRect | undefined;
  let currentDepth = 0;
  let popoverOpener: HTMLElement | undefined;
  let mode: 'map' | 'follow' | 'relationships' | 'compare' = 'map';
  let hovered = '', inspectedRelation = '';
  const plates = root.querySelector<HTMLElement>('[data-comparison-plates]')!;
  const guide = root.querySelector<HTMLElement>('[data-follow-guide]')!;
  let comparison: string[] = [];
  const link = (label: string, href: string) => {
    const a = document.createElement('a'); a.textContent = label; a.href = href;
    if (href.startsWith('#')) a.dataset.observatoryLink = '';
    return a;
  };
  const nodeFor = (id: string) => root.querySelector<HTMLElement>(`[data-system-node="${id}"]`);
  function imagePlate(media: ObservatoryImage) {
    const figure = document.createElement('figure'); figure.className = 'observatory-image';
    const image = document.createElement('img'); image.src = media.src; image.alt = media.alt;
    image.loading = 'lazy'; image.decoding = 'async'; figure.append(image);
    if (media.caption) { const caption = document.createElement('figcaption'); caption.textContent = media.caption; figure.append(caption); }
    return figure;
  }
  function syncGraph(pulse = false) {
    const relation = data.relationships.find(r => r.id === inspectedRelation);
    const ids = mode === 'compare' ? comparison : hovered ? [hovered] : relation ? [relation.source, relation.target] : selected ? [selected] : current === 'archive' ? ['archive'] : [];
    const archiveActive = ids.includes('archive');
    const relatedIds = new Set<string>();
    if (mode !== 'compare') data.relationships.forEach(r => { if (ids.includes(r.source)) relatedIds.add(r.target); if (ids.includes(r.target)) relatedIds.add(r.source); });
    root.dataset.engaged = String(ids.length > 0);
    root.dataset.hoverSystem = hovered;
    root.querySelectorAll<HTMLElement>('[data-system-node]').forEach(el => {
      const id = el.dataset.systemNode!;
      el.classList.toggle('is-observed', archiveActive || ids.includes(id));
      el.classList.toggle('is-related', relatedIds.has(id));
    });
    root.querySelector('[data-archive-node]')!.classList.toggle('is-observed', ids.length > 0);
    root.querySelector('[data-archive-node]')!.setAttribute('aria-current', String(current === 'archive'));
    const primary: SVGPathElement[] = [];
    root.querySelectorAll<SVGPathElement>('[data-svg-connector]').forEach(el => {
      const active = archiveActive || ids.includes(el.dataset.svgConnector!);
      el.classList.toggle('is-hovered', active); el.classList.toggle('is-muted', ids.length > 0 && !active);
      if (active) primary.push(el);
    });
    const secondary: SVGPathElement[] = [];
    root.querySelectorAll<SVGPathElement>('[data-relationship-path]').forEach(el => {
      const r = data.relationships.find(r => r.id === el.dataset.relationshipPath)!;
      const active = mode === 'compare' ? comparison.includes(r.source) && comparison.includes(r.target) : archiveActive || ids.includes(r.source) || ids.includes(r.target);
      el.classList.toggle('is-related', active);
      el.classList.toggle('is-selected', r.id === inspectedRelation && mode !== 'compare');
      el.classList.toggle('is-muted', ids.length > 0 && !active);
      if (active) secondary.push(el);
    });
    if (pulse) motion.pulse(inspectedRelation && secondary.length ? secondary : primary, archiveActive || !hovered);
    guide.hidden = mode !== 'follow'; guide.textContent = selected ? data.ui.followNext : data.ui.followPrompt;
  }
  function updateTether() {
    root.querySelectorAll<HTMLElement>('[data-concept-nodes]').forEach(container => {
      const svg = container.querySelector('svg'); if (!svg) return;
      const rect = container.getBoundingClientRect();
      svg.setAttribute('viewBox', ` 0 0 ${rect.width} ${rect.height}`);
      const nodes = container.querySelectorAll<HTMLElement>('.observatory-concept');
      svg.querySelectorAll('path').forEach((path, index) => {
        const node = nodes[index]?.getBoundingClientRect(); if (!node) return;
        const x = node.x + node.width / 2 - rect.x, y = node.y - rect.y - 3;
        path.setAttribute('d', `M${rect.width / 2} 0 Q${x} 8 ${x} ${y}`);
      });
    });
    const tether = root.querySelector('[data-page-tether]')!;
    const node = selected ? nodeFor(selected) : root.querySelector<HTMLElement>('[data-archive-node]');
    if (page.hidden || mode === 'compare' || !node || innerWidth <= 720) { tether.setAttribute('d', ''); return; }
    const a = node.getBoundingClientRect(), b = page.getBoundingClientRect(), base = stage.getBoundingClientRect();
    const x = a.x + a.width / 2 - base.x, y = a.y + a.height / 2 - base.y;
    const endX = b.x - base.x, endY = b.y - base.y;
    tether.setAttribute('d', `M${x} ${y} C${x + 100} ${y},${endX - 80} ${endY},${endX} ${endY}`);
  }
  function conceptHref(system: string, c: ObservatoryConcept) {
    return `#${system}/${c.parent ? `${c.parent}/` : ''}${c.id}`;
  }
  function closeDefinition(restore = false) {
    if (popover.matches(':popover-open')) popover.hidePopover();
    popoverOpener?.setAttribute('aria-expanded', 'false');
    if (restore && popoverOpener?.isConnected) popoverOpener.focus({ preventScroll: true });
  }
  function emphasize(id = '') {
    root.dataset.emphasis = id;
    root.querySelectorAll<HTMLElement>('[data-concept-ref]').forEach(el => el.classList.toggle('is-emphasized', el.dataset.conceptRef === id));
    field.emphasize(id);
  }
  function addConcepts(container: HTMLElement, concepts: ObservatoryConcept[], system: string) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 400 70'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
    container.style.setProperty('--concept-count', String(Math.min(4, concepts.length || 1)));
    container.append(svg);
    for (const c of concepts) {
      const route = document.createElementNS(svg.namespaceURI, 'path'); route.setAttribute('class', 'concept-route'); svg.append(route);
      const el = c.interaction === 'definition' ? document.createElement('button') : link(c.label, conceptHref(system, c));
      if (el instanceof HTMLButtonElement) {
        el.type = 'button'; el.textContent = c.label; el.dataset.definitionId = c.id;
        el.setAttribute('aria-expanded', 'false'); el.setAttribute('aria-controls', 'observatory-definition');
      }
      el.dataset.conceptRef = c.id; el.className = 'observatory-concept'; container.append(el);
    }
  }
  function render() {
    if (location.pathname !== originalPath) return;
    const parts = location.hash.slice(1).split('/');
    const system = byId.get(parts[0]);
    const concepts = system?.concepts || [];
    const candidate = concepts.find(c => c.id === parts.at(-1) && c.interaction === 'concept');
    const validConcept = candidate && (candidate.parent ? parts.join('/') === `${system!.id}/${candidate.parent}/${candidate.id}` : parts.length === 2) ? candidate : undefined;
    const next = system ? `${system.id}${validConcept ? `/${validConcept.id}` : ''}` : parts[0] === 'archive' ? 'archive' : 'map';
    if (next === current) return;
    const previous = selected;
    const previousDepth = currentDepth;
    currentDepth = validConcept ? (validConcept.parent ? 3 : 2) : system ? 1 : 0;
    closeDefinition(); motion.capturePage();
    hovered = ''; inspectedRelation = ''; motion.clearPulse();
    current = next; selected = system?.id || ''; conceptId = validConcept?.id || '';
    root.dataset.state = next;
    const intent = next === 'map' ? 'system-close' : previous && selected && previous !== selected ? 'system-to-system' : previousDepth > currentDepth && previous === selected ? 'concept-close' : validConcept ? 'concept-open' : 'system-open';
    root.dataset.navigationIntent = intent;
    stage.dataset.activeSystem = selected || (next === 'archive' ? 'archive' : '');
    stage.dataset.focused = String(next !== 'map');
    root.querySelectorAll<HTMLElement>('[data-system-node]').forEach(el => {
      const active = el.dataset.systemNode === selected;
      el.classList.toggle('is-active', active);
      if (active) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
    });
    root.querySelectorAll('[data-svg-connector]').forEach(el => el.classList.toggle('is-active', el.getAttribute('data-svg-connector') === selected));
    body.replaceChildren(); lineage.replaceChildren(); page.hidden = next === 'map' || mode === 'compare';
    if (system) {
      const chain = [link(system.title, `#${system.id}`)];
      if (validConcept?.parent) { const p = concepts.find(c => c.id === validConcept.parent)!; chain.push(link(p.label, conceptHref(system.id, p))); }
      if (validConcept) chain.push(link(validConcept.label, conceptHref(system.id, validConcept)));
      chain.at(-1)!.setAttribute('aria-current', 'page'); lineage.append(...chain);
      if (validConcept) {
        const title = document.createElement('h2'); title.id = 'observatory-page-title'; title.tabIndex = -1; title.textContent = validConcept.label;
        const description = document.createElement('p'); description.className = 'observatory-explanation'; description.textContent = validConcept.summary;
        const children = document.createElement('div'); children.className = 'observatory-concepts'; children.dataset.conceptNodes = '';
        addConcepts(children, [...new Set([...validConcept.children, ...(validConcept.related || [])])].map(id => concepts.find(c => c.id === id)!).filter(Boolean), system.id);
        const footer = document.createElement('footer'); footer.className = 'observatory-page__footer'; footer.append(link(data.ui.read, validConcept.source));
        body.append(title, description);
        if (validConcept.image) body.append(imagePlate(validConcept.image));
        body.append(children, footer);
      } else {
        body.append(root.querySelector<HTMLTemplateElement>(`[data-system-template="${system.id}"]`)!.content.cloneNode(true));
        addConcepts(body.querySelector('[data-concept-nodes]')!, concepts.filter(c => c.interaction === 'concept'), system.id);
      }
    } else if (next === 'archive') {
      body.append(root.querySelector<HTMLTemplateElement>('[data-archive-template]')!.content.cloneNode(true));
      lineage.append(link('Archive', '#archive'));
    }
    const related = data.relationships.find(r => (r.source === previous && r.target === selected) || (r.target === previous && r.source === selected));
    root.querySelectorAll('[data-relationship-path]').forEach(el => el.classList.toggle('is-travel', el.getAttribute('data-relationship-path') === related?.id));
    const path = related ? root.querySelector<SVGPathElement>(`[data-relationship-path="${related.id}"]`) || undefined : undefined;
    const hadOrigin = !!origin;
    if (hadOrigin || previous || next !== 'map') motion.transition(origin || nodeFor(selected)?.getBoundingClientRect(), path, related?.target === previous || intent === 'concept-close', updateTether);
    field.focus(system, nodeFor(selected)?.getBoundingClientRect()); emphasize(conceptId);
    syncGraph(true); updateTether();
    if (hadOrigin || previous) {
      if (page.hidden) nodeFor(previous)?.focus({ preventScroll: true });
      else body.querySelector<HTMLElement>('h2')?.focus({ preventScroll: innerWidth > 720 });
    }
    origin = undefined;
  }
  function setMode(next: typeof mode) {
    motion.captureGeometry();
    const closing = mode === next;
    mode = mode === next ? 'map' : next; comparison = [];
    root.dataset.mode = mode;
    relationPanel.hidden = mode === 'map' || mode === 'follow';
    inspectedRelation = ''; hovered = ''; motion.clearPulse();
    root.querySelectorAll('[data-relationship]').forEach(el => el.setAttribute('aria-pressed', 'false'));
    plates.replaceChildren(); plates.hidden = true;
    root.querySelector<HTMLElement>('.observatory-relations__links')!.hidden = mode === 'compare';
    stage.dataset.comparing = String(mode === 'compare');
    page.hidden = mode === 'compare' || current === 'map';
    root.querySelectorAll('[data-relationship-edge]').forEach(el => {
      const interactive = mode === 'relationships' && innerWidth > 720;
      el.setAttribute('tabindex', interactive ? '0' : '-1'); el.setAttribute('aria-hidden', String(!interactive));
    });
    root.querySelector('[data-follow-toggle]')!.setAttribute('aria-pressed', String(mode === 'follow'));
    root.querySelector('[data-relationships-toggle]')!.setAttribute('aria-pressed', String(mode === 'relationships'));
    root.querySelector('[data-compare-toggle]')!.setAttribute('aria-pressed', String(mode === 'compare'));
    root.querySelector('[data-relations-instruction]')!.textContent = mode === 'compare' ? data.ui.comparePrompt : data.ui.relationPrompt;
    relationDetail.replaceChildren();
    root.querySelectorAll('[data-system-node]').forEach(el => {
      el.classList.remove('is-compared');
      if (mode === 'compare') { el.setAttribute('role', 'button'); el.setAttribute('aria-pressed', 'false'); }
      else { el.removeAttribute('role'); el.removeAttribute('aria-pressed'); }
    });
    if (mode === 'relationships' && innerWidth <= 720) relationPanel.querySelector<HTMLButtonElement>('button')?.focus();
    motion.transition(undefined, undefined, false, updateTether);
    if (closing) root.querySelector<HTMLButtonElement>(next === 'relationships' ? '[data-relationships-toggle]' : next === 'follow' ? '[data-follow-toggle]' : '[data-compare-toggle]')?.focus({ preventScroll: true });
  }
  function showRelation(id: string) {
    const r = data.relationships.find(r => r.id === id); if (!r) return;
    inspectedRelation = id;
    relationDetail.replaceChildren();
    for (const [label, text] of [[data.ui.shared, r.summary], [data.ui.different, r.different]]) {
      const p = document.createElement('p'), strong = document.createElement('strong'); strong.textContent = `${label}: `; p.append(strong, text); relationDetail.append(p);
    }
    relationDetail.append(link(byId.get(r.source)!.title, `#${r.source}`), document.createTextNode(' → '), link(byId.get(r.target)!.title, `#${r.target}`), document.createTextNode(' · '), link(data.ui.read, r.reference));
    root.querySelectorAll('[data-relationship-path]').forEach(el => el.classList.toggle('is-selected', el.getAttribute('data-relationship-path') === id));
    root.querySelectorAll('[data-relationship]').forEach(el => el.setAttribute('aria-pressed', String(el.getAttribute('data-relationship') === id)));
    syncGraph(true);
    if (mode === 'compare' && innerWidth <= 720) relationDetail.scrollIntoView({ block: 'nearest' });
  }
  root.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const edge = event.target.closest<SVGElement>('[data-relationship-edge]');
    if (edge) { showRelation(edge.dataset.relationshipEdge!); return; }
    const target = event.target.closest<HTMLElement>('a, button'); if (!target) return;
    if (target.matches('[data-follow-toggle]')) { setMode('follow'); syncGraph(true); return; }
    if (target.matches('[data-relationships-toggle]')) { setMode('relationships'); syncGraph(true); updateTether(); return; }
    if (target.matches('[data-compare-toggle]')) { setMode('compare'); syncGraph(); updateTether(); return; }
    if (target.dataset.relationship) { showRelation(target.dataset.relationship); return; }
    if (target.matches('[data-definition-close]')) { closeDefinition(true); return; }
    if (target.dataset.definitionId) {
      const c = byId.get(selected)?.concepts.find(c => c.id === target.dataset.definitionId); if (!c) return;
      closeDefinition(); popoverOpener = target; target.setAttribute('aria-expanded', 'true');
      popover.querySelector('h3')!.textContent = c.label;
      popover.querySelector('[data-definition-body]')!.textContent = c.summary;
      popover.querySelector<HTMLAnchorElement>('[data-definition-source]')!.href = c.source;
      popover.showPopover();
      const rect = target.getBoundingClientRect();
      popover.style.left = `${Math.max(16, Math.min(rect.left, innerWidth - popover.offsetWidth - 16))}px`;
      popover.style.top = `${Math.max(16, Math.min(rect.bottom + 12, innerHeight - popover.offsetHeight - 16))}px`;
      popover.querySelector<HTMLButtonElement>('button')!.focus({ preventScroll: true }); emphasize(c.id); return;
    }
    if (!target.matches('[data-observatory-link]') || !(target instanceof HTMLAnchorElement) || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault(); motion.finishEntrance();
    if (mode === 'compare' && target.dataset.systemNode) {
      const id = target.dataset.systemNode;
      comparison = comparison.includes(id) ? comparison.filter(s => s !== id) : [...comparison.slice(-1), id];
      root.querySelectorAll<HTMLElement>('[data-system-node]').forEach(el => {
        const included = comparison.includes(el.dataset.systemNode!);
        el.classList.toggle('is-compared', included); el.setAttribute('aria-pressed', String(included));
      });
      root.querySelector('[data-relations-instruction]')!.textContent = `${data.ui.comparePrompt} ${comparison.map(id => byId.get(id)!.title).join(' — ')}`;
      relationDetail.replaceChildren(); inspectedRelation = '';
      plates.replaceChildren(); plates.hidden = comparison.length === 0;
      for (const id of comparison) {
        const system = byId.get(id)!;
        const plate = document.createElement('section'); plate.className = 'observatory-comparison__plate';
        const title = document.createElement('h2'); title.textContent = system.title;
        const summary = document.createElement('p'); summary.textContent = system.summary;
        plate.append(title, summary, link(data.ui.read, system.source)); plates.append(plate);
      }
      syncGraph(true);
      if (comparison.length === 2) {
        const r = data.relationships.find(r => comparison.includes(r.source) && comparison.includes(r.target));
        if (r) showRelation(r.id);
        else {
          relationDetail.replaceChildren();
          for (const id of comparison) { const s = byId.get(id)!; const p = document.createElement('p'); p.textContent = `${s.title}: ${s.summary}`; relationDetail.append(p); }
          const p = document.createElement('p'); p.textContent = data.archive.explanation; relationDetail.append(p);
        }
      }
      return;
    }
    origin = target.getBoundingClientRect(); void navigateObservatory(target.href);
  }, { signal });
  const feedback = (event: Event) => {
    if (!(event.target instanceof Element)) return;
    const term = event.target.closest<HTMLElement>('[data-concept-ref]');
    if (term) emphasize(term.dataset.conceptRef);
    const edge = event.target.closest<SVGElement>('[data-relationship-edge]');
    const button = event.target.closest<HTMLElement>('[data-relationship]');
    if (mode === 'relationships' && (edge || button)) { showRelation((edge?.dataset.relationshipEdge || button?.dataset.relationship)!); return; }
    const node = event.target.closest<HTMLElement>('[data-system-node], [data-archive-node]');
    const id = node?.dataset.systemNode || (node ? 'archive' : '');
    if (id && id !== hovered) {
      hovered = id; syncGraph(true); motion.react(id);
      field.focus(byId.get(id), node!.getBoundingClientRect());
    }
  };
  root.addEventListener('pointerover', feedback, { signal }); root.addEventListener('focusin', feedback, { signal });
  const relax = (event: FocusEvent | PointerEvent) => {
    const next = event.relatedTarget instanceof Element ? event.relatedTarget.closest('[data-concept-ref], [data-system-node], [data-archive-node]') : null;
    if (next) return;
    // Keyboard observation persists when the pointer leaves another surface.
    const focused = document.activeElement?.closest<HTMLElement>('[data-system-node], [data-archive-node]');
    hovered = event.type === 'pointerout' && focused ? focused.dataset.systemNode || 'archive' : '';
    emphasize(conceptId); field.focus(byId.get(selected), nodeFor(selected)?.getBoundingClientRect());
    syncGraph();
  };
  root.addEventListener('pointerout', relax, { signal }); root.addEventListener('focusout', relax, { signal });
  popover.addEventListener('toggle', () => { if (!popover.matches(':popover-open')) { popoverOpener?.setAttribute('aria-expanded', 'false'); emphasize(conceptId); } }, { signal });
  document.addEventListener('keydown', event => {
    motion.finishEntrance();
    if (event.key === ' ' && mode === 'compare' && event.target instanceof HTMLElement && event.target.matches('[data-system-node]')) {
      event.preventDefault(); event.target.click();
    }
    if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof SVGElement && event.target.dataset.relationshipEdge) {
      event.preventDefault(); showRelation(event.target.dataset.relationshipEdge);
    }
    if (event.key === 'Escape' && popover.matches(':popover-open')) { event.preventDefault(); closeDefinition(true); }
    else if (event.key === 'Escape' && mode !== 'map') { setMode(mode); syncGraph(); updateTether(); }
  }, { signal });
  document.addEventListener('pointerdown', motion.finishEntrance, { signal, capture: true });
  document.addEventListener('sine:observatory-state', render, { signal });
  window.addEventListener('popstate', render, { signal }); window.addEventListener('hashchange', render, { signal });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', motion.stopMotion, { signal });
  const geometry = new ResizeObserver(() => {
    updateTether();
    root.querySelectorAll('[data-relationship-edge]').forEach(el => {
      const interactive = mode === 'relationships' && innerWidth > 720;
      el.setAttribute('tabindex', interactive ? '0' : '-1'); el.setAttribute('aria-hidden', String(!interactive));
    });
  }); geometry.observe(stage); geometry.observe(page);
  render(); root.dataset.controller = 'ready';
  return () => { abort.abort(); geometry.disconnect(); closeDefinition(); field.destroy(); motion.destroy(); root.dataset.controller = 'stopped'; };
}
