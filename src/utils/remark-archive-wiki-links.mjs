import {
  getArchiveContextFromFile,
  nextArchiveRefPreviewId,
  renderArchiveRefHtml,
  resolveArchiveRef,
  tokenizeArchiveRefText,
} from "./archive-ref-core.mjs";

const SKIP_PARENT_TYPES = new Set(["link", "linkReference", "definition", "html"]);

export default function remarkArchiveWikiLinks() {
  return function transform(tree, file) {
    const context = getArchiveContextFromFile(String(file.path ?? ""));
    if (!context) return;

    visitNodes(tree, (node, parent) => {
      if (!parent || !Array.isArray(parent.children)) return;
      if (!node || node.type !== "text" || typeof node.value !== "string") return;
      if (SKIP_PARENT_TYPES.has(parent.type)) return;

      const { segments, errors } = tokenizeArchiveRefText(node.value);
      if (!segments.some((segment) => segment.type === "ref") && errors.length === 0) {
        return;
      }

      for (const error of errors) {
        const message = file.message(error.message, node.position);
        message.fatal = true;
        throw message;
      }

      const replacement = [];
      for (const segment of segments) {
        if (segment.type === "text") {
          replacement.push({ type: "text", value: segment.value });
          continue;
        }

        const resolved = resolveArchiveRef({
          ref: segment.parsed,
          currentSection: context.section,
          currentSlug: context.slug,
          locale: context.locale,
        });

        if (!resolved.exists) {
          const message = file.message(`${resolved.message} Offending ref: ${segment.value}`, node.position);
          message.fatal = true;
          throw message;
        }

        replacement.push({
          type: "html",
          value: renderArchiveRefHtml(resolved, {
            previewId: resolved.preview ? nextArchiveRefPreviewId() : null,
          }),
        });
      }

      const index = parent.children.indexOf(node);
      parent.children.splice(index, 1, ...replacement);
    });
  };
}

function visitNodes(node, visitor, parent = null) {
  if (!node || typeof node !== "object") return;

  if (Array.isArray(node.children)) {
    for (const child of [...node.children]) {
      visitNodes(child, visitor, node);
    }
  }

  visitor(node, parent);
}
