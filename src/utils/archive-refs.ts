import {
  buildRelativeArchiveHref,
  buildRelativeCodexHref,
  getArchiveRegistry,
  renderArchiveRefHtml,
  resolveArchiveRef,
} from "./archive-ref-core.mjs";

export type ArchiveRefResolution =
  | {
      exists: true;
      href: string;
      label: string;
      preview: string;
      targetTitle: string;
      targetSection: string;
      targetSlug: string;
      targetKind: "archive" | "codex";
      targetKey: string;
      anchor: string;
      locale: "en" | "pt-br";
    }
  | {
      exists: false;
      reason: string;
      message: string;
      target?: {
        section: string;
        slug: string;
      };
    };

export {
  buildRelativeArchiveHref,
  buildRelativeCodexHref,
  getArchiveRegistry,
  renderArchiveRefHtml,
  resolveArchiveRef,
};
