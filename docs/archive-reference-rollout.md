# Archive Reference Rollout

This file tracks high-value terms that should be highlighted with the archive cross-reference system.

## Current approach

Use three buckets:

1. Direct archive entry or section links for terms with a strong public canon page already in `src/content`.
2. Codex-section links for terms whose best explanation currently lives in a character dossier.
3. Deferred terms for concepts that still need a better canonical public landing page before wide rollout.

This keeps authoring simple while avoiding vague or misleading previews.

## Implemented now

| Term | Ref id | Target | Why this target works |
| --- | --- | --- | --- |
| Mark | `mark` | `organizations:apocachynthion#mark` | Public institutional explanation already exists. |
| Mark 1-5 | `mark-1` to `mark-5` | `organizations:apocachynthion#mark` | Same public section, with term-specific hover summaries. |
| Open Mark | `open-mark` | `organizations:apocachynthion#open-mark` | Public explanation added directly to the Apocachynthion page. |
| Margins | `margins` | `organizations:apocachynthion#margins` | Registry language term repeated across many character entries. |
| Blots | `blots` | `organizations:apocachynthion#blots` | Registry language term repeated across many character entries. |
| Seal | `seal` | `organizations:apocachynthion#seal` | Registry language term repeated across many character entries. |
| Leaf | `leaf` | `organizations:apocachynthion#leaf` | Registry language term repeated across many character entries. |
| Inkless | `inkless` | `organizations:apocachynthion#inkless` | Strong public explanation already exists. |
| Nib | `nib` | `organizations:apocachynthion#nib` | Canon rank page already exists. |
| Quill | `quill` | `organizations:apocachynthion#quill` | Canon rank page already exists. |
| Stylus | `stylus` | `organizations:apocachynthion#stylus` | Canon rank page already exists. |
| Pagers | `pagers` | `organizations:apocachynthion#pagers` | Public institutional explanation already exists. |
| Lucent | `lucent` | `organizations:obsidian-rite#lucent` | Public doctrinal target already exists. |
| Project Kaleidoscope | `project-kaleidoscope` | `codex:ella-wonderwall#project-kaleidoscope` | Best explanation is in Ella's dossier, not her public summary page. |
| White Desert | `white-desert` | `places:aurora#white-desert` | Public geographic explanation already exists. |
| Luminant Shore | `luminant-shore` | `systems:shores#luminant-shore` | Strong systems-level explanation already exists. |
| Shorefall | `shorefall` | `systems:shores#shorefall` | Now has a stable public section anchor. |
| Shorewalker | `shorewalker` | `systems:shores#shorewalker` | Now has a stable public section anchor. |
| The Binding | `binding` | `places:kaltsen#binding` | Good institutional landmark target for city and practitioner pages. |
| Academy of Syr'lene | `academy-of-syrlene` | `places:vrenne#academy-of-syrlene` | Good institutional target for training/certification references. |
| Wonderwall Company | `wonderwall-company` | `sine:sine` | Uses SiNE as the canonical public landing page. |

## First example entry pass

These were updated first because they demonstrate the pattern clearly:

- `src/content/characters_en/ella-wonderwall.md`
- `src/content/characters_pt_br/ella-wonderwall.md`

Registry-sweep standardization has now also been applied to:

- `src/content/characters_en/alithia-wonderwall.md`
- `src/content/characters_en/ayanna-aedh-aibhilyn.md`
- `src/content/characters_en/eclesia-wonderwall.md`
- `src/content/characters_en/emmanuel-wonderwall.md`
- `src/content/characters_en/lenore-engelmeyer.md`
- `src/content/characters_en/leonard-von-engelmeyer.md`
- `src/content/characters_en/rouxinol-kaise.md`
- `src/content/characters_en/daniel-degurechaff.md`
- `src/content/characters_pt_br/alithia-wonderwall.md`
- `src/content/characters_pt_br/ayanna-aedh-aibhilyn.md`
- `src/content/characters_pt_br/eclesia-wonderwall.md`
- `src/content/characters_pt_br/emmanuel-wonderwall.md`
- `src/content/characters_pt_br/lenore-engelmeyer.md`
- `src/content/characters_pt_br/leonard-von-engelmeyer.md`
- `src/content/characters_pt_br/rouxinol-kaise.md`
- `src/content/characters_pt_br/vaey-viktor.md`

They now link registry terms plus `Project Kaleidoscope` and `White Desert`.

Additional second-wave examples now live in:

- `src/content/characters_en/eclesia-wonderwall.md`
- `src/content/characters_pt_br/eclesia-wonderwall.md`
- `src/content/characters_pt_br/emmanuel-wonderwall.md`

These demonstrate `Shorefall`, `BrightCrystal`, and further public-concept linking.

## Audit command

Run:

```bash
npm run report:archive-refs
```

Generated report:

- `docs/archive-reference-audit.md`

This report scans current public content, skips existing wiki refs, and ranks repeated plain-text terms that are strong candidates for cross-linking.

## High-confidence next pass

These appear often enough to be worth wiring next, and they already have either a public page or a plausible canonical host:

| Term | Likely target | Notes |
| --- | --- | --- |
| Gift of Sight | `organizations:the-church#gift-of-sight` | Already implemented as an override; expand usage in entries. |
| Answered | `organizations:obsidian-rite#answered` | Already implemented as an override; expand usage in entries. |
| Lucent | `organizations:obsidian-rite#lucent` | Public target exists now. |
| White Desert Incident | `places:aurora#white-desert` or `codex:ella-wonderwall#white-desert-incident` | Use public place link in general entries; use codex when the incident itself matters. |
| Rite of Radiance | `places:aurora` or a dedicated organization entry later | Good candidate if Aurora references keep growing. |
| Instrument of Light | `places:aurora#white-desert` for now | Better as its own entry later. |
| BrightCrystal | `systems:brightcrystal` | Direct entry already exists; broaden editorial adoption. |
| Apocachynthion | `organizations:apocachynthion` | Very high-frequency institutional mention; best next broad editorial pass. |
| The Church | `organizations:the-church` | Very high-frequency institutional mention; best next broad editorial pass. |
| Obsidian Rite | `organizations:obsidian-rite` | Strong candidate across frontier and character pages. |
| Academy of Syr'lene | `places:vrenne#academy-of-syrlene` | Strong candidate across training-city and certification pages. |

## Deferred until better canon landing page exists

These are strong glossary candidates, but they should not be mass-linked yet unless we create a dedicated public entry or stable section for them:

| Term | Why defer |
| --- | --- |
| Stilllight | Best explanation currently lives mostly in Ec'lesia material; deserves a canonical systems or character-section target first. |
| First Radiance | Repeated and important, but currently split across Wonderwall character and codex material. |
| Remainder | Large concept; should point to a dedicated public concept/system page, not a side mention. |
| KL-83 | Important label, but best destination is still dossier-heavy. |
| Sibling-signatures | Best explanation currently lives in Ella's dossier. |

## Recommended implementation order

1. Use `docs/archive-reference-audit.md` to sweep the highest-frequency public institutions: `Apocachynthion`, `BrightCrystal`, `Obsidian Rite`, `The Church`.
2. Continue Wonderwall-specific passes in Al'ithia, Em'manuel, and Ec'lesia using `Project Kaleidoscope`, `White Desert`, `Luminant Shore`, and `Shorefall`.
3. Expand institutional-place links like `Academy of Syr'lene` and `The Binding` where training or administration is discussed.
4. Only after that, decide which deferred concepts deserve new canonical public entries instead of codex-only landings.

## Author examples

```md
**[[mark|Mark]]:** [[mark-5|Mark 5]]
The final success of [[project-kaleidoscope|Project Kaleidoscope]].
She may have reached the [[luminant-shore|Luminant Shore]] during the [[white-desert|White Desert]] event.
```
