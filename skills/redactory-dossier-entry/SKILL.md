---
name: redactory-dossier-entry
description: Use for lore-heavy, text-heavy, character, archive, classified document, Dark Ends, Index Theorem, Redactory theory, or dossier entry pages in SiNE Archives where readability, archival metadata, annotations, warnings, related entries, and canon preservation matter more than generic blog or documentation layouts.
triggers:
  - dossier
  - character entry
  - lore page
  - Dark Ends entry
  - classified document
  - Index Theorem explanation
  - Redactory theory
od:
  design_system: redactory
  design_system_path: design-systems/redactory/DESIGN.md
  preferred_agent: codex
---

# Redactory Dossier Entry

Use this skill for lore-heavy entry pages and classified document-style presentation.

## Required Context

Read first:

1. `AGENTS.md`
2. The active Open Design design system selected for the task.
3. If the active design system is `redactory`, read `design-systems/redactory/DESIGN.md`.
4. Read root `DESIGN_SYSTEM.md` if present. This repository uses `DESIGN_SYSTEM.md`; do not assume a root `DESIGN.md` exists.
5. Existing entry layout or target content collection
6. `references/lore-page-structure.md`
7. `references/writing-ui-rules.md`

The `od:` frontmatter is documentation for Open Design. Essential behavior is written in this markdown body so the skill works even if a tool ignores extra metadata fields.

## Workflow

1. Identify the entry type: character dossier, standard entry, codex, theory page, Dark Ends entry, or Redactory explanation.
2. Inspect matching layout: `EntryLayout`, `CharacterEntryLayout`, `CharacterCodexLayout`, or Redactory component page.
3. Preserve slugs, frontmatter, anchors, locale structure, and canon references.
4. Structure long material with readable sections, metadata rails, warnings, annotations, related entries, and progressive disclosure when useful.
5. Keep mystery through framing and hierarchy, not low contrast or hidden text.
6. Test long text on mobile and desktop widths.

## Implementation Rules

- Do not invent lore.
- Treat `The Archive/` as canon source material when content changes are explicitly requested.
- Use existing content fields and schemas.
- Avoid generic blog layout and generic docs layout.
- Avoid large SaaS cards for prose.
- Keep headings, anchors, and related links stable unless the user asks otherwise.
- Prefer moving/reconciling existing material over deleting meaningful content.

## Visual Quality Rules

- Use archival labels, metadata rails, section dividers, file fields, warnings, annotations, fragments, and related-entry references.
- Keep body prose readable with constrained widths and generous line-height.
- Use Cormorant for major headings and DM Sans for long body/UI.
- Use crimson and gold sparingly for warnings, seals, and metadata.
- Avoid decorative text treatments that reduce comprehension.

## Final Self-Review

- Lore readability preserved.
- Canon/source boundaries respected.
- Headings and anchors stable unless intentionally changed.
- Entry avoids generic blog/docs feel.
- Metadata/annotations improve clarity.
- Mobile reading experience checked.
