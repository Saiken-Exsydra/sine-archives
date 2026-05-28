# Archive Cross References

Use wiki-style refs inside archive Markdown:

```md
[[obsidian-rite]]
[[obsidian-rite|Obsidian Rite]]
[[answered|Answered]]
[[the-church#gift-of-sight|Gift of Sight]]
[[places:ardeatus|Ardeatus]]
[[project-kaleidoscope|Project Kaleidoscope]]
```

## Syntax

- `[[target-id]]`
  Uses target entry title or override label as visible text.
- `[[target-id|Visible Text]]`
  Uses custom visible text.
- `[[target-id#section-anchor|Visible Text]]`
  Links to a specific section anchor.
- `[[section:slug|Visible Text]]`
  Disambiguates collisions when a bare slug is not unique.

## Where Refs Resolve From

- Full archive entries are canonical targets.
- Default hover preview comes from entry frontmatter:
  - `preview` if present
  - otherwise `summary`
- Term-specific overrides live in `src/data/archiveRefs.mjs`.
- Overrides may also point to a character codex section when that is the clearest canonical explanation for a term.

## Entry Metadata

Archive entries may add:

```yaml
ref_id: custom-id
aliases:
  - alternate term
preview: Short hover preview.
```

## Stable Section Anchors

For section links, use explicit heading ids in Markdown:

```md
### The Gift of Sight {#gift-of-sight}
```

This keeps anchors stable across locale files and lets validation confirm the target exists.

Character codex files can use the same explicit heading-id syntax:

```md
## VI. PROJECT KALEIDOSCOPE AS LIVING SHORE CONDITION {#project-kaleidoscope}
```

## Missing Preview Behavior

- If a ref resolves and no preview text exists, link still renders normally.
- Existing standard Markdown links continue to work unchanged.

## Broken Ref Debugging

- Run `npm run check:archive-refs`.
- Build also runs this check automatically.
- Failures report file path, line, column, and reason.
- Common failures:
  - unknown id
  - ambiguous bare slug like `[[ardeatus]]`
  - missing explicit heading id for a section target
  - missing explicit heading id for a codex target
  - duplicate override id or alias

## Rollout Planning

- See `docs/archive-reference-rollout.md` for the curated term list and recommended expansion order.
