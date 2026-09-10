# Character entry model

Public character entries are reader-guided articles, not abbreviated private dossiers.
The canonical authoring template is `docs/templates/character-entry-template.md`.

## Reading order

1. Establish the living person, their present role, and the tension that makes them matter.
2. Explain temperament and the causal background needed to understand the present.
3. Show what their practice looks like before its technical mechanics, then state limits.
4. Introduce institutional standing and relationships only after their personal stakes are clear.
5. Keep orientation metadata in front matter so the interface can present it before the long-form record.
6. Put restricted, spoiler-heavy, cosmological, or identity-level material last.

## Authoring boundaries

- Use only canon supported by `The Archive/`; omit unknown fields instead of filling them.
- Define an unfamiliar setting term in a short clause on first meaningful use.
- Keep front matter concise and searchable. It powers cards and the Classification, Registry, and Personal Record modules; do not repeat it mechanically in the prose.
- Give the long-form canon dossier through `codex_file` when one exists. The website page explains the character; it does not duplicate the dossier.
- Retain the supplied section order unless a character needs a clearly justified variation. Optional sections may be omitted.

## Hero copy contract

Every character entry in both locales must define two distinct frontmatter fields immediately beneath the character name in the interface:

- `designation` is the character's title: a compact, character-specific noun phrase expressing a defining role, contradiction, reputation, danger, promise, or image. Prefer roughly 2-8 words. It must stand alone, remain canon-grounded, and must not imply a literal office, sainthood, inheritance, divinity, betrayal, or other status the source material does not support.
- `summary` is one concise, understandable character statement, not another title. Aim for roughly 15-35 words and include at least one concrete action, role, belief, relationship, wound, choice, or consequence. Give the reader a person and a tension; use poetry through exact phrasing rather than unexplained abstraction.

The fields must strengthen one another without paraphrasing one another. Before writing either field, read the current character dossier or controlling Archive source, preserve the public entry's spoiler boundary, and identify the character's central dramatic identity. Keep existing copy when it already meets this contract. Do not invent a stronger-sounding concept merely to fill the hero.

When localizing an entry, preserve the same dramatic identity and disclosure level rather than translating word for word. The English and pt-BR pairs may differ in rhythm, but neither locale may retain an obsolete or contradictory character premise.

The character collection schema requires both fields to be non-empty and limits `designation` to 80 characters and `summary` to 300 characters. Those limits prevent missing or biography-length hero copy; they do not replace editorial review.

Final test: the designation should make the reader curious, the summary should reward that curiosity with something concrete, and the pair should not plausibly belong to five other characters.

## Interface contract

The page surface is designed for two passes: the name, designation, and summary establish the hero reading path before the dossier prose; the table of contents and responsive dossier modules are orientation tools. Metadata modules stay outside the Markdown heading hierarchy. Every authored `##` heading is a navigable reader-guide section, so write headings that remain understandable when reached directly.
