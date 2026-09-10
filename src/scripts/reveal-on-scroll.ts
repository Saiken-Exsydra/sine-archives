/** One observer per group; callers own teardown through registerPageInit. */
export function revealOnScroll(elements: Iterable<Element>, threshold = 0.1) {
  const nodes = [...elements];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  }, { threshold });
  const revealAll = () => {
    if (!reducedMotion.matches) return;
    observer.disconnect();
    nodes.forEach((node) => node.classList.add("in-view"));
  };
  nodes.forEach((node, index) => {
    if (index === 0 || reducedMotion.matches) node.classList.add("in-view");
    else observer.observe(node);
  });
  reducedMotion.addEventListener("change", revealAll);
  return () => {
    observer.disconnect();
    reducedMotion.removeEventListener("change", revealAll);
  };
}
