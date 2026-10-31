window.registerPageInit?.('archive-reference-previews', () => {
  const controller = new AbortController();
  const { signal } = controller;
  const references = [...document.querySelectorAll<HTMLElement>('.archive-ref--with-preview')];
  for (const reference of references) {
    const preview = reference.querySelector<HTMLElement>('.archive-ref__preview');
    if (!preview) continue;
    const position = () => {
      reference.removeAttribute('data-preview-dismissed');
      preview.style.removeProperty('left');
      if (innerWidth <= 700) return;
      const rect = preview.getBoundingClientRect();
      const shift = Math.min(0, innerWidth - 16 - rect.right);
      const left = `${Math.max(16 - rect.left, shift)}px`;
      preview.style.left = left;
      reference.style.setProperty('--preview-left', left);
    };
    reference.addEventListener('pointerenter', position, { signal });
    reference.addEventListener('focusin', position, { signal });
    reference.addEventListener('pointerleave', () => reference.removeAttribute('data-preview-dismissed'), { signal });
  }
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    references.forEach(reference => {
      if (reference.matches(':hover, :focus-within')) reference.setAttribute('data-preview-dismissed', '');
    });
  }, { signal });
  return () => controller.abort();
}, { persistent: true });
