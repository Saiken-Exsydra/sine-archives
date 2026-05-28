export default function remarkArchiveHeadingIds() {
  return function transform(tree) {
    visitNodes(tree, (node) => {
      if (!node || node.type !== "heading" || !Array.isArray(node.children) || node.children.length === 0) {
        return;
      }

      const lastChild = node.children[node.children.length - 1];
      if (!lastChild || lastChild.type !== "text") return;

      const match = lastChild.value.match(/\s*\{#([A-Za-z0-9][\w-]*)\}\s*$/);
      if (!match) return;

      const [, id] = match;
      lastChild.value = lastChild.value.replace(/\s*\{#([A-Za-z0-9][\w-]*)\}\s*$/, "");
      node.data ??= {};
      node.data.hProperties ??= {};
      node.data.hProperties.id = id;
      node.data.id = id;
    });
  };
}

function visitNodes(node, visitor, parent = null) {
  if (!node || typeof node !== "object") return;
  visitor(node, parent);
  if (!Array.isArray(node.children)) return;
  for (const child of node.children) {
    visitNodes(child, visitor, node);
  }
}
