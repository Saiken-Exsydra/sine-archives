function visit(node, visitor, parent = null) {
  if (!node || typeof node !== "object") return;
  visitor(node, parent);

  if (!Array.isArray(node.children)) return;
  for (const child of [...node.children]) {
    visit(child, visitor, node);
  }
}

function isElement(node, tagName) {
  return node?.type === "element" && node.tagName === tagName;
}

function classList(node) {
  const value = node?.properties?.className;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
  return [];
}

function getCodeLanguage(codeNode) {
  const languageClass = classList(codeNode).find((name) => name.startsWith("language-"));
  return languageClass?.replace(/^language-/, "").toLowerCase() ?? "";
}

function textContent(node) {
  if (!node || typeof node !== "object") return "";
  if (node.type === "text") return String(node.value ?? "");
  if (!Array.isArray(node.children)) return "";
  return node.children.map(textContent).join("");
}

function hashString(value) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
}

function text(value) {
  return { type: "text", value };
}

function element(tagName, properties = {}, children = []) {
  return { type: "element", tagName, properties, children };
}

function replaceNode(parent, oldNode, newNode) {
  const index = parent?.children?.indexOf(oldNode) ?? -1;
  if (index === -1) return;
  parent.children.splice(index, 1, newNode);
}

function createDiagramFigure(source) {
  return element(
    "figure",
    {
      className: ["codex-diagram"],
      role: "group",
      ariaLabel: "Codex diagram",
    },
    [
      element("figcaption", { className: ["codex-diagram__label"] }, [text("CODEX DIAGRAM")]),
      element("div", { className: ["codex-diagram__scroll"] }, [
        element("pre", { className: ["codex-diagram__pre"] }, [
          element("code", { className: ["codex-diagram__code"] }, [text(source)]),
        ]),
      ]),
    ],
  );
}

function createMermaidFigure(source, id) {
  return element(
    "figure",
    {
      className: ["mermaid-diagram"],
      dataMermaidDiagram: "",
      dataMermaidId: id,
      role: "group",
      ariaLabel: "Mermaid diagram",
    },
    [
      element("figcaption", { className: ["mermaid-diagram__label"] }, [text("Mermaid")]),
      element("div", { className: ["mermaid-diagram__viewport"], tabIndex: 0 }, [
        element("pre", { className: ["mermaid-diagram__source-pre"] }, [
          element("code", { className: ["mermaid-diagram__source-code"] }, [text(source)]),
        ]),
      ]),
      element("details", { className: ["mermaid-diagram__source"] }, [
        element("summary", {}, [text("Source")]),
        element("pre", { className: ["mermaid-diagram__source-pre"] }, [
          element("code", { className: ["mermaid-diagram__source-code"] }, [text(source)]),
        ]),
      ]),
    ],
  );
}

export default function rehypeCodexDiagrams() {
  return function transform(tree, file) {
    let mermaidIndex = 0;
    const filePath = String(file.path ?? "markdown");

    visit(tree, (node, parent) => {
      if (!isElement(node, "pre") || !Array.isArray(node.children) || !parent) return;

      const codeNode = node.children.find((child) => isElement(child, "code"));
      if (!codeNode) return;

      const language = getCodeLanguage(codeNode);
      if (language !== "diagram" && language !== "mermaid") return;

      const source = textContent(codeNode);

      if (language === "diagram") {
        replaceNode(parent, node, createDiagramFigure(source));
        return;
      }

      mermaidIndex += 1;
      const id = `mermaid-${hashString(`${filePath}:${mermaidIndex}:${source}`)}`;
      replaceNode(parent, node, createMermaidFigure(source, id));
    });
  };
}
