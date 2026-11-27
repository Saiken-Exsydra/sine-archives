# Character publication

The private Dy’Aspora Archive governs canon. Google Drive and its synchronized workstation copy represent the same Archive. The React checkout holds approved public editions. The author decides which editions may be released. A canonical change, relocation or outage leaves the site serving the checked-in publication. Canonical reads, interpretation and translation belong to the authoring session. React builds and serves the published files as a static site.

## Adding a character

1. Tell the agent, “Prepare this character’s entry. Their files are in the Archive.” The agent finds the dossier, uses it to prepare Overview, Biography, Abilities and Relations in both languages, attaches the Complete Dossier, and prepares the artwork. Use the private link to review the examination, the dossier and the Registry. Ask for changes in the same chat. The agent updates the preview at the same address.
2. When the review message lists exactly what you want to accept, say, "Push everything in this review." This approves the listed editions and authorizes a commit and push of those files to the React branch. The agent validates the promoted files and sends you the commit link. A public website release requires its own authorization.

The agent stages the edition and handles the Git steps. Every new entry includes a Complete Dossier. The review identifies the exact text and its available languages. If only one language is available, both interfaces open that edition and the reader labels its language. The agent brings you in when a canon, disclosure or artwork decision affects the proposed edition.

## Operating permissions

| Permission | Agent action |
| --- | --- |
| Investigate | Read canonical and publication material and report findings. Run read-only checks. |
| Prepare | Write proposed editions and make a loopback-only preview in a private directory outside the checkout, the Archive and any shared or synchronized location. Present exact review files and disclosure questions to the author. |
| Publish | After explicit approval of the exact material, promote only the approved files into the React checkout, validate and record the approved review. Obtain separate authorization for committing, pushing or deploying. Canonical edits require separate explicit authorization. |

Ordinary requests are enough to start. The agent runs the checks and prepares the local files. The author reviews the editorial decisions.

- “Check which published characters are outdated compared with the Archive” requests investigation and reports changed, unresolved and unreviewed sources distinctly.
- “I’ve reorganized the Imperial Houses. Investigate which published records are affected” requests a read-only review of the governing sources, shared institution definitions and affected records, even if dossier fingerprints match.
- “Prepare Al’ithia for publication from her current dossier and approved artwork” requests a private bilingual examination preview.
- “I’ve retconned Hisui’s abilities. Update her published record according to current canon” requests preparation of a proposed revision and review of its related facts. Present the edition for approval before promotion.
- “Update Le’nore’s Complete Dossier and both localized editions” requests private drafts. Ask the author to approve the named edition in each language and separately approve any examination revisions.

## Editorial preparation and approval

1. Check branch, working tree and affected files. Read the Archive’s root README, `CANON_AUTHORING_STANDARD.md`, the Characters README, the current authoritative dossier and any governing passages. Resolve exact sources using the [private mappings](#private-source-mappings-and-recovery). Use [committed Astro references](README.md#local-workspace) for editorial history. The Legacy Character Publication Audit is a historical reference whose React inventory predates the per-character publication architecture. The durable method is to lead with the person, show practical effects and limits, then explain the relationships that matter.
2. Compare the current source with the existing edition in both languages. Use an earlier canonical revision only when you can verify its provenance. Otherwise compare current canon with the current publication and state that limitation. Inspect the shared institutions and classifications, related published records and approved artwork. Search relevant IDs, terms and relationships in the existing content when governing facts change. Record observed facts, institutional positions, hypotheses and unresolved questions separately in the private review notes.
3. Attach the Complete Dossier in the private copy. Derive Overview, Biography, Abilities and Relations from the current dossier and governing sources. Preserve stable character IDs and let shared facts live in JSON once. Use the approved `hero` and `portrait` IDs in the [asset manifest](src/images/manifest.json). Use the [asset pipeline](ASSET_PIPELINE.md) for new or replacement artwork. Follow the editorial standard below for both languages.
4. [Validate and preview](#validation-and-preview) the isolated edition. Present the exact candidates, an editorial change summary, source revision, disclosure choices, shared-file impacts and open decisions. Identify the examination scope and each Complete Dossier language separately. Artwork approval applies to the image. Each text language and each Complete Dossier need explicit approval of their own content. If a shared field changes both languages, obtain approval for both before promoting that field. A new examination requires both languages because the existing schema requires both.
5. Before promotion, compare the current publication files with the review base, recheck the reviewed source fingerprint and resolve any intervening changes. Verify that the candidates still match the approved bytes. A new entry requires both examination languages and at least one exact approved Complete Dossier. If either is pending, keep the entry in review. Prepare the exact release selection in the isolated copy and validate it before copying it into the publication checkout. Copy each approved dossier with its matching language declaration. Verify the checkout after promotion, then record the approved review in the private map. If part of an affected publication is still awaiting a decision, leave the previous character-wide baseline in place until that review is resolved. A confirmed no-change review updates only the private map. Review the Git diff and use explicit paths for staging if authorized. Use `[CF-Pages-Skip]` on this React branch. Production is governed by separate authorization.

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
      dossier.en.md        English edition, when available
      dossier.pt-BR.md     Brazilian Portuguese edition, when available
```

Include at least one Complete Dossier file for every new entry.

| Material | Editorial purpose |
| --- | --- |
| Canonical dossier | Read the authoritative account in the Archive and check referenced material when a claim depends on it. |
| Overview | Lead with identity, personality, current circumstances and a defining tension. Use designation for the public title, classification for established capabilities and summary for orientation. Introduce only the institutions the reader needs. |
| Biography | Select formative experiences and show how they shaped decisions, habits and present circumstances. Order events for understanding and preserve established chronology. |
| Abilities | Start with an observable effect before its mechanism. Explain manifestations, conditions, costs, limits and risks. Attribute theories and open questions. Leave unsupported classifications absent and describe relevant non-practitioner skills. |
| Relations | Explain what each relationship means in practice. Distinguish affection, kinship, House membership, employment, service, allegiance and legal standing. |
| Complete Dossier | Include the original in private review when the author requests the canonical text. A public copy requires approval of its exact text and disclosure scope. An editorial Complete Dossier or a translation has its own full review. |

### English and Brazilian Portuguese

Review both editions against the same canon, chronology, degree of certainty and disclosure boundary. Read each as natural prose, then compare claims, names, numbers and relationships across the pair. Preserve established public React wording and consult the current terminology policy. The [Astro reference checkout](README.md#local-workspace) has `docs/translation-glossary-pt-BR.md` on `main` for protected terms, gender and agreement. Where prior glossary guidance and a current React label differ, keep unrelated published labels in place and flag the conflict for the author. Use one shared string for genuinely shared wording such as a proper name. Translate reader-facing prose in full. Passage counts and file checks do not establish equivalence.

Use blank lines between paragraphs in Biography, Abilities and Relations. An optional `## Heading` labels the following paragraph. An optional link on its own, after a blank line, attaches to the preceding paragraph. For example, `[Bloom](#/systems/bloom)`. These sections currently display plain paragraph and heading text, with a separate link to Redactory, Divination or Bloom. Write each locale for its own readers and preserve the same published facts and disclosures.

List the exact candidate languages under `"dossier"` in the private `record.json`. In the publication checkout, declare only approved editions. A declared language requires a file, and a dossier file requires a declaration. The reader prefers the interface language and otherwise opens the available edition with a language label. A new entry needs at least one edition, so both interfaces keep the Complete Dossier button. Closing the reader returns to the examination section saved in that history entry, or Overview on a direct visit.

### Complete Dossier reader

Keep the approved document's headings, paragraphs, emphasis, lists, quotations, rules and tables in their original order. An author may approve a verbatim complete dossier for one language independently of the other. A translation has its own exact-text approval. Keep private source links, sensitive annexes and any knowledge beyond the approved scope out of the published files.

[DossierSurface](src/grand-index/DossierSurface.tsx) requests the localized module from the record. [The document renderer](src/grand-index/dossierDocument.tsx) uses the Marked lexer and renders React elements. HTML is displayed as text. Images display their alternative text. Published links may point to HTTP(S), email, archive hash routes or local headings. Wide tables can scroll horizontally. The two source dossiers reviewed for this phase use no Markdown footnote definitions. Review any new syntax against the proposed edition before publication.

Contents follow the parsed headings in source order. Anchor names retain Unicode letters and numbers and gain numeric suffixes on collision. For example, a second heading named Memória can be linked from the document as `[Memória](#memória-2)`. A contents selection updates the current hash route with `?heading=mem%C3%B3ria-2`. Scrolling updates the highlighted heading without writing history. A shared dossier URL such as `#/characters/<id>/dossier` returns to Overview when opened directly.

The [dossier regression](tests/dossier.spec.ts) builds a separate bilingual specimen at a nested base, exercises touch and keyboard navigation, and saves settled screenshots in `test-results/react-review/`.

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

In the character record, `affiliations` entries pair an `institution` ID with a `kind` of `membership`, `blood-lineage`, `service`, `employment` or `association`. Set `"primary": true` on the one entry that should identify the primary institution in examination. Hisui’s service points to the Wonderwall cadet household, whose parent entry identifies the House.

The Empire has fifteen Imperial Houses. Their official heraldic symbols are House Quills. Consult the Wonderwall brief, palette, structured specification and Master, Monochrome and Stasis variants in `Artworks/Design Systems/House Wonderwall/` before choosing a publication asset. The specification calls for a flat, transparent official form and preserves the same silhouette in monochrome or ceremonial use. Register an exact, approved web copy with the `symbol` profile in the existing asset pipeline. Use the appropriate context for each variant and leave `emblem` absent while a House Quill awaits web publication. The Master Wonderwall Quill is approved as the exact original SVG and registered only on House Wonderwall. Hisui's service entry resolves the cadet household's own identity. Parent links provide editorial context and do not confer a parent's emblem.

[AffiliationInsignia and ArchivalInsignia](src/grand-index/ExaminationInsignia.tsx) read the validated publication registries. AffiliationInsignia displays the relationship kind, localized institution name and that institution's optional approved emblem. ArchivalInsignia keeps systems, Anchor type and depth, rank, Mark and other classifications distinct. A native disclosure opens when a published system summary or Anchor explanation exists. Its link follows the corresponding published Systems route. The Phase V editions use text for system and Anchor classifications.

Use [classifications.json](src/content/classifications.json) for reusable public names and optional `insignia` asset IDs with the `symbol` profile. The Archive’s `Artworks/Concepts & Systems/` contains the system logos and the Shallow, Deep and Abyssal Anchor symbols. Register each approved artwork against the classification it represents.

- `classifications.systems` entries pair a `system` ID with `kind` set to `capability` or `affiliation`.
- `classifications.redactory` can carry `anchor.type`, `anchor.depth`, `rank` and a numerical `mark`. Each represents a separate public fact. Omit any field that has no approved value and omit the whole block when inapplicable.
- `classifications.other` can reference other approved labels in the `other` registry. Reference IDs from their matching groups.

## Private source mappings and recovery

Ordinary development and deployment use the checked-in publication. Set up the synchronized Archive only on workstations used for editorial review or original artwork processing.

1. Copy [.env.example](.env.example) to `.env.local`. Set `SINE_ARCHIVE_ROOT` to the actual Dy’Aspora Archive directory that contains `Characters/` and `Artworks/`. Quote the value and use forward slashes on Windows, for example `"D:/Dy’Aspora Archive"`. macOS and Linux can use their native absolute paths. Environment variables already set in the shell take precedence over the file values.
2. Restore `.asset-sources.local.json` and `.character-sources.local.json` into the React project root from an access-controlled backup. Keep the existing artwork map relative to `Artworks/`. An explicit `SINE_ARTWORKS` overrides the derived artwork directory and continues to work by itself for the artwork pipeline.
3. If the maps were lost, reconstruct the character map using exact paths relative to the Archive root. Confirm the title, active parent directory and authority against the Archive index and governing documentation. Verify the Drive identity and parent when available, especially if same-name copies exist. Historical snapshots, reports and the Experience Lab are reference material. Fully read the synchronized file to confirm availability. If it is missing or moved, verify the exact new location before remapping. If local synchronization is stale or offline, use the verified active Drive file for private editorial reading, report the limitation and resolve the local mapping before recording the review. Rebuild the artwork map from the IDs and SHA-256 values in [approved.json](tools/assets/approved.json). `Get-FileHash -Algorithm SHA256 -LiteralPath` works with exact filenames on Windows.

```json
{
  "published-character-id": {
    "source": "Characters/Exact Dossier Filename.md"
  }
}
```

### Freshness and approved review

`npm run archive:check` checks all published dossiers and the configured artwork paths. `npm run archive:check -- hisui-kirasagi` checks exact dossier IDs only. Pass more IDs as needed, including a privately mapped candidate for an unpublished character. A missing source is reported beside the results for accessible dossiers.

| Status | Meaning |
| --- | --- |
| `reviewed` | The source bytes match the last approved review. |
| `changed` | The bytes differ. Investigate whether the public edition is affected. |
| `unreviewed` | The source is readable and has no recorded baseline. |
| `unavailable` | Verify the source, restore configuration or check local access and synchronization. |
| `reviewed-no-public-change` | The bytes match an approved decision to keep the current edition. |

The checker reads source bytes and writes nothing. Exit status `1` signals unavailable input or invalid configuration, `2` signals pending review and `0` means each requested check passed. A dossier checksum is a change signal for that file. Institutional sources, rules and the timeline can change independently. Review the governing sources named in each task even if the dossier checksum matches.

After the author approves the review, the agent re-runs the targeted check and compares its hash with the source actually reviewed. Update `reviewedSha256` in `.character-sources.local.json` to that exact hash and set `reviewOutcome` to `publication-updated` after validated promotion, or `no-public-change` for an explicitly approved decision to retain the edition. Older hash-only entries still work. Preserve other mapping entries and verify the result with the targeted check. Keep approval notes and source identity details in private storage. The private map is a lightweight review baseline for a character, while Git records the approved public bytes.

Back up the relative maps privately after each update. Keep a separate recoverable backup of the synchronized Archive as appropriate. On a new machine, clone the React branch, install Node.js 22.18 or later and run `npm ci`. Point the new `.env.local` at the synchronized location and restore the two maps. Run `npm run archive:check` and `npm run assets:dry-run` to verify the mappings and exact approved art. With the derived artwork location, relocating the Archive only requires changing `SINE_ARCHIVE_ROOT`. If you use `SINE_ARTWORKS` and move that directory too, update or remove the override. Leave `reviewedSha256` absent if its previously reviewed value is unavailable.

## Validation and preview

### Refreshing an Overview

Use Le’nore’s Overview as the presentation template. Seek the same personal fields for each dossier and fill only those supported for the dated record. Use the established identity slots in their shared order. Use occupation for a verified profession or principal role. A hobby, employer, posting or isolated task does not by itself establish an occupation. Additional names, dates and measurements require the relevant identity slot and a meaningful qualification. Keep secondary affiliations in the structured record. Display the primary affiliation once beside the navigation on desktop or within the Overview on phones. Follow the identity fields with only the applicable capability profiles. Different dossier headings or incidental narrative details do not create new Overview rows.

Use `Characters/Individual Registry Guide.md` in the Archive, including its character exceptions and Section 8. Run `npm run archive:check -- <character-id>` to compare the current dossier with the last approved revision. For a local evidence index, run `node tools/archive/check.mjs --overview <character-id>` from the checkout. It reports the same revision fingerprint alongside candidate fields, section titles and line numbers from tables, labeled entries and prose. Keep that output private. Exit code 2 means there is an unreviewed revision. Read the relevant passages in the full dossier and its governing sources. Where the source has moved, resolve its identity before refreshing the private map.

Update the existing `src/content/characters/<character-id>/record.json` in the isolated site. Keep personal facts in `overview`, office and other institutional ties in `affiliations`, and capability details in `classifications.profiles`. Store a number, year, relationship or classification once and use the existing bilingual value format `{ "en": "...", "pt-BR": "..." }` for wording that changes between locales. Preserve distinct known values in arrays, such as citizenships and residences. A Redactory profile stores Anchors separately and associates each Anchor with its own assessed depth, reading and rank where applicable. The practitioner Mark belongs to the profile. Bloom, Divination, Elemental, Continuity and exceptional profiles carry their own fields. A profile is optional. When updating a legacy record, replace its old classification fields in the same review.

In the private review note, cite the dossier and governing passages for changed values and log editorial gaps, contradictions, intentional ambiguity, inapplicable attributes and withheld information. Preserve previously approved values while investigating a blank or a conflict. Confirm the scope for affected linked sections and Complete Dossiers, including either language that offers a fallback dossier. Include only public-safe data in a proposed publication record. Keep source paths, excerpts, countersigned revisions and reasons for withholding a field outside `src/` and the preview build.

Use the same preview and promotion steps below. Approval of a changed shared record covers both interface languages. A change to the Archive becomes a website update after the candidate is checked, approved and promoted.

1. Reuse one private review site for the active candidate, such as `%LOCALAPPDATA%\SiNE Archives\Character Review\Site`. Start from a clean export of the approved base. `git archive --format=zip --output="path/to/private/base.zip" HEAD` creates a temporary export to extract there. Include any relevant, already-approved local changes through an explicit file list. Keep the proposed publication files directly in the isolated site. Keep canonical originals and a single review note outside the site. If artwork needs processing, use the local asset mapping and Archive settings in the review site for generation, then move those private files out of the site before serving it. Run `npm ci` inside the private site when setting it up or when its dependency lockfile changes.
2. Keep the ordinary `Start-React-Systems.cmd` launcher running. From the React checkout, run `npm run review -- "<private site directory>" <character-id>`. It checks for a Complete Dossier on the selected record and every new character in the private copy, validates the private site and stages its build outside the checkout. The command exits after staging. The running dev server serves the build at `http://localhost:5174/__review/` with a direct link to the selected record. The regular site continues to use the React checkout at the root URL.
3. Verify the command's direct link in Zen and give the author that link. List the exact examination languages, artwork choices and any Complete Dossier languages included in the review. Keep their approval scope, the candidate file fingerprints and reviewed source revisions in the private note. For revisions, run the same review command and reload the same link. A failed build leaves the last staged review available. After promotion or rejection, run `npm run review -- --clear` to retire the staged review route and clear disposable files subject to the author's retention instructions.

When the author asks to push the explicitly listed scope of a review, that single reply covers edition approval and the commit and push authorization. Follow the promotion checks above, stage only approved files and push to `experiment/react-systems` with the `[CF-Pages-Skip]` commit prefix. Verify the commit on the remote and share its link. Leave the public deployment to its own authorization.

Review Overview, the three prose sections, the Registry and the Complete Dossier from both interface languages. Check direct routes, artwork, keyboard focus, reduced motion and the dossier language label when one edition serves both interfaces. The same record format and asset manifests govern the approved checkout. `npm run content:test`, `npm run archive:test` and `npm run assets:test` exercise the authoring checks. `npm run build` runs asset checks, content checks and TypeScript verification before Vite. Run `npm test` after building for the Chromium regressions. Validate the approved checkout again after promotion before any authorized distribution. Keep private originals and editorial materials out of the publication checkout and Git.
