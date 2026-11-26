# Character publication

The Dy’Aspora Archive owns the canon. The publication workflow prepares approved content. GitHub distributes it. React presents it.

## Prepare a record

1. Read the Archive’s root README, `CANON_AUTHORING_STANDARD.md`, the Characters README and the individual’s current dossier. Check the governing passages and relevant references. The Astro records on committed `main` can help with reader orientation and terminology. Confirm their dates, claims and disclosure boundaries against the dossier.
2. Draft the public edition outside the website build, with human or AI editorial assistance as appropriate. Review the exact text and art for publication in both languages. Keep uncertainty, point of view and capability limits explicit where the source calls for them. Keep restricted material in the Archive.
3. Create a lowercase, hyphenated directory under `src/content/characters/`. The directory name is the stable ID used by links and private mappings. Add the record and six UTF-8 Markdown files below. Match spelling and case, including `pt-BR`.
4. Reference the approved `hero` and `portrait` IDs in the [asset manifest](src/images/manifest.json). Follow the [asset pipeline](ASSET_PIPELINE.md) for a new image or replacement.
5. Check the canonical revision, validate the public files and preview the proposed publication. Commit the approved edition and any associated artwork changes on the React branch with the `[CF-Pages-Skip]` prefix.

```text
src/content/
  institutions.json
  classifications.json
  characters/
    <character-id>/
      record.json
      biography.en.md
      biography.pt-BR.md
      abilities.en.md
      abilities.pt-BR.md
      relations.en.md
      relations.pt-BR.md
      dossier.en.md        optional, explicitly approved
      dossier.pt-BR.md     optional, explicitly approved
```

| Material | Editorial purpose |
| --- | --- |
| Canonical dossier | Read the authoritative account in the Archive and check referenced material when a claim depends on it. |
| Overview | Publish accessible identity and factual information through structured fields. |
| Biography | Select events that explain the individual’s development and present circumstances. |
| Abilities | Describe what a capability does, which system it relates to and where the meaningful limits lie. |
| Relations | Explain the personal stakes of relevant associations, institutions and lineages. |
| Complete Dossier | Prepare the entire approved public edition separately. It can match the canonical text when approved in full, or be an approved edition with different disclosure boundaries. |

Use blank lines between paragraphs in Biography, Abilities and Relations. An optional `## Heading` labels the following paragraph. An optional link on its own, after a blank line, attaches to the preceding paragraph. For example, `[Bloom](#/systems/bloom)`. These sections currently display plain paragraph and heading text, with a separate link to Redactory, Divination or Bloom. Write each locale for its own readers and preserve the same published facts and disclosures.

Complete Dossier Markdown supports its own document structure. List each explicitly approved language under `"dossier"` in `record.json` and add the corresponding file. A declared language requires a file, and a dossier file requires a declaration. Omit the field until an edition is approved. Each approved locale is available to React as native Markdown for a future reader.

## Record template

```json
{
  "name": "Public display name",
  "shortName": "Short name",
  "designation": {
    "en": "Public designation",
    "pt-BR": "Designação pública"
  },
  "summary": {
    "en": "A short public summary.",
    "pt-BR": "Um breve resumo público."
  },
  "hero": "replace-with-approved-hero-id",
  "portrait": "replace-with-approved-portrait-id",
  "overview": {}
}
```

- A name, label or summary that is identical in both languages can use one string. For localized copy use the `en` and `pt-BR` pair. Names and short names are shared.
- Add public facts to `overview` in one place. Supported fields are `age` with `lunarYears` and `asOfImperialYear`, `birth` with `imperialYear` and optional `approximate`, `birthplace`, `heightCm` and `residence`. The renderer supplies localized labels, year notation and units.
- Use `order` to place a record in the Registry. Lower numbers come first. Ties and records without an explicit order sort by ID. Set `"featured": true` on exactly one record across the collection.
- To direct the artwork crop, use CSS object-position strings in `focal`, `mobileFocal` or `portraitFocal`. The hero and portrait default to center, and mobile inherits the desktop hero position when omitted.
- Use `relationships` for a structured connection to another published character, for example `{ "character": "published-character-id", "kind": "family" }`. For people without a published record, keep approved mentions in Relations prose.

### Institutions and classifications

Register institutions by stable ID in [institutions.json](src/content/institutions.json). Give each a public `name` and a `category` of `house`, `company`, `religious`, `household` or `other`. A unit can reference its parent institution using `parent`. An optional `record` reserves the stable ID of a future public institution record. Add `emblem` only when the approved symbol is in the public asset manifest.

In the character record, `affiliations` entries pair an `institution` ID with a `kind` of `membership`, `blood-lineage`, `service`, `employment` or `association`. Set `"primary": true` on the one entry that should supply the current Overview row. Hisui’s service points to the Wonderwall cadet household, whose parent entry identifies the House.

The Empire has fifteen Imperial Houses. Their official heraldic symbols are House Quills. Consult the Wonderwall brief, palette, structured specification and Master, Monochrome and Stasis variants in `Artworks/Design Systems/House Wonderwall/` before choosing a publication asset. The specification calls for a flat, transparent official form and preserves the same silhouette in monochrome or ceremonial use. Register an exact, approved web copy with the `symbol` profile in the existing asset pipeline. Use the appropriate context for each variant and leave `emblem` absent while a House Quill awaits web publication. Phase IV uses no new House Quills or insignia on the interface.

Use [classifications.json](src/content/classifications.json) for reusable public names and optional `insignia` asset IDs with the `symbol` profile. The Archive’s `Artworks/Concepts & Systems/` contains the system logos and the Shallow, Deep and Abyssal Anchor symbols. Register each approved artwork against the classification it represents.

- `classifications.systems` entries pair a `system` ID with `kind` set to `capability` or `affiliation`.
- `classifications.redactory` can carry `anchor.type`, `anchor.depth`, `rank` and a numerical `mark`. Each represents a separate public fact. Omit any field that has no approved value and omit the whole block when inapplicable.
- `classifications.other` can reference other approved labels in the `other` registry. Reference IDs from their matching groups.

## Private source mappings and recovery

Ordinary development and deployment use the checked-in publication. Set up the synchronized Archive only on workstations used for editorial review or original artwork processing.

1. Copy [.env.example](.env.example) to `.env.local`. Set `SINE_ARCHIVE_ROOT` to the actual Dy’Aspora Archive directory that contains `Characters/` and `Artworks/`. Quote the value and use forward slashes on Windows, for example `"D:/Dy’Aspora Archive"`. macOS and Linux can use their native absolute paths. Environment variables already set in the shell take precedence over the file values.
2. Restore `.asset-sources.local.json` and `.character-sources.local.json` into the React project root from an access-controlled backup. Keep the existing artwork map relative to `Artworks/`. An explicit `SINE_ARTWORKS` overrides the derived artwork directory and continues to work by itself for the artwork pipeline.
3. If the maps were lost, reconstruct the character map using exact paths relative to the Archive root. Confirm each original by its title and the Characters index. Rebuild the artwork map from the approved IDs and SHA-256 values in [approved.json](tools/assets/approved.json). On Windows, `Get-FileHash -Algorithm SHA256 -LiteralPath` works with exact filenames. Verify assets by matching the approved checksum.

```json
{
  "published-character-id": {
    "source": "Characters/Exact Dossier Filename.md"
  }
}
```

Run `npm run archive:check` to verify both sets of mappings and identify exact dossier revisions. If a dossier is `unreviewed` or `changed`, compare its current wording and relevant references with both public editions. Decide what to retain, revise or withhold. After the editorial review, add or update that entry’s `reviewedSha256` with the printed hash. This records the reviewed source revision. Public approval applies separately to the actual text and images selected for distribution. The command reads sources and writes nothing. Exit status 1 indicates a configuration or source error, and status 2 indicates pending editorial review.

Back up the relative maps privately after each update. Keep a separate recoverable backup of the synchronized Archive as appropriate. On a new machine, clone the React branch, install Node.js 22.18 or later and run `npm ci`. Point the new `.env.local` at the synchronized location and restore the two maps. Run `npm run archive:check` and `npm run assets:dry-run` to verify the mappings and exact approved art. With the derived artwork location, relocating the Archive only requires changing `SINE_ARCHIVE_ROOT`. If you use `SINE_ARTWORKS` and move that directory too, update or remove the override. Leave `reviewedSha256` absent if its previously reviewed value is unavailable.

## Validation and preview

Run `npm run content:check` for publication validation and `npm run content:test` for the isolated content fixtures. Run `npm run archive:test` when changing private source resolution and `npm run assets:test` when changing the artwork processor. Run `npm run build` and `npm test` before committing. Review Overview, all three reading sections and the Registry in Zen with the root Windows launcher. Check both languages, direct routes, keyboard focus and transitions. Keep private configuration, canonical sources, review hashes and working drafts outside the publication files.
