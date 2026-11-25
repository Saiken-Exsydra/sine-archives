# SiNE Archives — Redactory Asset Production Roadmap

**Status:** Working production guide, not a canonical Dy’Aspora document  
**Created:** 24 November 2026  
**Scope:** Asset research, acquisition, creation, preparation, and first interactive Redactory prototype  
**Project:** The Redactory Academy — Experience Lab

## 0. Read this first: the experience we are building

SiNE Archives is conceived as a **public-facing website produced by SiNE inside Dy’Aspora**, not as an out-of-universe encyclopedia. Its visual sophistication expresses SiNE's reach, knowledge, and respect for the subjects it presents. SiNE supplies the institutional frame; the subject supplies the local language.

**For Redactory:** the visitor enters a SiNE-curated, Academy-inspired area drawing on the **Apocachynthion Academy**: blue and white, dark wood, writing desks, shelves, leaves, ink, books, pages, and instructional materials. It must feel simultaneously like a public archive and a place where a visitor can *learn by doing*. The longer-term inspiration is the layered, cinematic, operational feel of *Path to Nowhere* interfaces—**not** copied game art, UI layouts, branding, or screenshots republished as site assets.

**For SiNE throughout:** preserve its black/white/red/gold identity and existing original marks. The red, three-like Wonderwall-family symbol has in-world significance; do not treat it as a generic red flourish. Use the logo and that mark according to their actual context rather than stamping them onto everything.

**Boundary:** This document plans visual production. It does not alter canon, create new canonical symbols, or modify the existing website/repositories. The Experience Lab's reference codices are point-in-time research copies; the current governing originals remain authoritative.

---

## Phase 1 — Inventory what already exists

**Goal:** Reuse the best assets you already own before hunting for substitutes.

### Actions
- [ ] Examine the existing SiNE website's `src/assets/`, `public/`, and other relevant image/UI directories, and any local illustrations archive.
- [ ] Catalogue existing SiNE wordmarks, simplified logos, Wonderwall mark, system emblems, Anchor symbols, textures, illustrations, and UI graphics.
- [ ] Include the supplied examples as **reference originals**: `CLOCKWORK.png`, `HourGlass.png`, `SiNE Large.png`, `sine-clepsydra.png`, `StaSis Large Variant 2.png`, `ui-sine-logo.png`, and `ui-sine-logo-home.png`.
- [ ] Identify the intended meaning of each symbol; do **not** guess that an image is a Redactory or Anchor mark just because it looks appropriate.
- [ ] Record for each: filename, preview, dimensions, source/location, editable source availability, copyright/permission status, transparent/opaque background, intended usage, and whether it is approved for the project.
- [ ] Preserve source originals unchanged. Make working copies for edits and web optimization.

**Deliverable:** `Asset Inventory.md` plus an indexed `originals/` collection (links or copies according to existing repository/Drive ownership).  
**Exit test:** You can answer “Do we already have this?” before making each new asset.

---

## Phase 2 — Establish a tiny Redactory art direction

**Goal:** Prevent a library of unrelated beautiful images.

### Create one reference sheet covering
- **Institutional frame:** SiNE black, white, red, gold; public-record navigation, metadata, labels, seals, footer, and provenance.
- **Redactory environment:** Academy blue, white/ivory, richly textured wood, paper, books, ink, leaves, scholarly apparatus.
- **Material behavior:** polished versus worn surfaces, crisp printed lines versus handwritten marks, matte paper versus reflective details.
- **Spatial tone:** prestigious, inviting, intellectually serious; theatrical where it helps learning, not uniformly dark or cluttered.
- **Contrast and legibility:** ornamental surfaces should never obscure diagrams or reading text.
- **Motion:** purposeful: paper unfolding, lines being routed, instrument pointers shifting, overlays revealing—not movement merely to impress.

Choose an **initial** color palette from existing project assets rather than canonizing invented hex codes. Create a one-page collage with roughly 10–15 references and note what each reference teaches. Keep *Path to Nowhere* screenshots in a **reference-only** folder; use them to study composition and density, not to extract production artwork.

**Deliverable:** `Redactory Art Direction.md` with a palette, materials, typography references, and 3–5 visual rules.  
**Exit test:** You can tell whether a newly generated texture “belongs” to Redactory without relying on taste alone.

---

## Phase 3 — Source free assets safely

**Goal:** Gather raw materials—not finished identity—using documented permission.

### Good starting points

| Source | Useful for | Licensing note |
|---|---|---|
| [ambientCG](https://ambientcg.com/) | Paper-adjacent materials, wood, stone, leather, surface maps | Publishes assets under **CC0**; verify the individual asset page and keep its URL. [License](https://docs.ambientcg.com/license/) |
| [Poly Haven](https://polyhaven.com/) | Realistic materials, HDRIs, 3D props/environment starting points | Publishes assets under **CC0**; retain the source link. [License](https://polyhaven.com/license) |
| [Kenney](https://kenney.nl/assets) | Generic interface/game primitives that can be heavily restyled | Asset-page game packs are **CC0** per publisher guidance; check the actual pack and do not reuse Kenney's own logo. [FAQ](https://kenney.nl/support) |
| [Wikimedia Commons](https://commons.wikimedia.org/) | Historical manuscript details and reference photography | **License varies per file.** Check attribution, adaptation, and share-alike obligations individually. [Reuse guidance](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia) |

Search terms to try: `dark walnut seamless texture`, `oak wood grain`, `vellum paper grain`, `ivory handmade paper`, `blue woven cloth texture`, `ink bleed overlay`, `antique book leather texture`, `archival desk surface`, `brass patina`. Free is not the same as unrestricted: avoid taking a photo from Pinterest, a screenshot from a game, or an image from a search-result thumbnail as production material.

### Acquisition protocol
1. Open the **original asset page**, not just an image result.
2. Inspect actual license terms, including commercial use, attribution, edits, redistribution, AI-use restrictions, and whether logos/trademarks are excluded.
3. Download the highest useful source quality; note the download date.
4. Save a source URL and license evidence in the asset manifest. Keep an attribution list even for CC0 (useful for provenance, though typically not legally required).
5. Mark ambiguous-license items **reference only** until resolved.

**Deliverable:** 12–20 *candidate* source materials with license notes, before selecting the best 6–10.  
**Exit test:** Every asset can be traced back to a known source and an allowed use.

---

## Phase 4 — Generate missing assets with ChatGPT

**Goal:** Produce *specific missing pieces*, not a random stream of artwork.

Use image generation for backgrounds, texture concepts, environmental props, and exploratory compositions. For mathematically precise diagrams, repeated UI borders, editable vectors, and layout behavior, prefer SVG/CSS/React or a graphics editor; a generated picture is not a working UI component.

### Prompt template

> Create a **[asset type]** for a fictional public educational archive commissioned by SiNE, presenting Redactory through the visual traditions of the Apocachynthion Academy. Material: **[wood/paper/cloth/ink]**. Palette: **[Academy blue, ivory, wood; specific accents if needed]**. Composition: **[tileable / centered object / wide empty text-safe region / isolated transparent object]**. Lighting: **[describe]**. Texture scale: **[fine / medium]**. Avoid text, letters, logos, corporate marks, watermarks, recognizable copyrighted interface layouts, and extra objects. Intended use: **[specific screen/component]**.

### Example requests
- **Seamless material:** “Produce a subtle, straight-on, seamless dark walnut grain texture, evenly lit, without desk objects or dramatic highlights, suitable behind a website panel.”
- **Paper:** “Make a restrained ivory paper surface with fine fibers and barely visible age variation, clean central reading area, no printed text or borders.”
- **Academy blue:** “Create a deep blue woven-fabric texture for a narrow UI banner, subtle weave, no emblem or typography.”
- **Scene:** “Create a wide Academy study background with bookshelves and carved wood, blue-and-white accents, and generous dark negative space on the right for readable interface overlays. No writing or logos.”

### Quality procedure
- [ ] Generate a few alternatives for one clearly defined job.
- [ ] Compare at the *actual screen size* against real text and existing SiNE identity.
- [ ] Reject illegible pseudo-writing, malformed apparatus, inconsistent perspective, repeated visual artifacts, or unintentional symbols.
- [ ] Edit/crop/tile/test the chosen result; do not assume an image is seamlessly tileable because its prompt asked for it.
- [ ] Record `origin = AI-generated`, prompt summary, date, revisions, and intended use.
- [ ] If the imagery suggests a mechanism not established in canon, label it **illustrative metaphor**, not a factual representation.

**Deliverable:** Only the chosen assets, plus a prompt record and rejected-variant notes.  
**Exit test:** Each generated file has a specific use and doesn't contradict established system mechanics.

---

## Phase 5 — Produce the first usable texture set

**Goal:** Make a modest, consistent kit that supports multiple screens.

| Priority | Asset | Intended usage |
|---|---|---|
| 1 | Dark wood (subtle) | Major background planes, desk surfaces |
| 1 | Clean ivory paper | Reading panels and lessons |
| 1 | Aged paper | Historical pages, occasional secondary layers |
| 1 | Academy blue cloth | Banners, tabs, section transitions |
| 1 | Fine neutral grain | Cohesion overlay, used lightly |
| 2 | Ink bleed/stain (transparent) | Document emphasis and decorative states |
| 2 | Book leather | Covers and edge treatments |
| 2 | Metal/brass patina | Select instrument parts only |

### Processing checklist
- [ ] Keep a high-resolution master; export smaller web variants.
- [ ] Remove unintended lighting hotspots from tileable surfaces.
- [ ] Check seams by repeating the image at least 3 × 3.
- [ ] Test against light and dark text, including a mobile-sized viewport.
- [ ] Keep contrast subdued under body copy.
- [ ] Export as WebP/AVIF where appropriate; use PNG where alpha/transparency or lossless detail warrants it.

**Deliverable:** 8 production-ready textures, each with preview and source record.  
**Exit test:** One convincing reading panel and one dark wood surface built with real assets, not flat-color placeholders.

---

## Phase 6 — Make reusable ornaments and symbols

**Goal:** Give Redactory a recognizable graphic grammar without inventing canon.

Build a small set: page corners, double-rule dividers, margin ticks, archival labels, bookmarks, annotation pointers, bookplate frames, seal holders, thin line connectors, and classroom-diagram grids. Reuse existing approved marks rather than generating substitutes.

- [ ] Build crisp, scalable **SVG** ornaments where possible.
- [ ] Create at least one **simplified** variant for small screens.
- [ ] Separate **official in-world marks** from **new editorial ornament**.
- [ ] Never use the Wonderwall mark as arbitrary filler.
- [ ] Keep technical diagrams semantically faithful to the Redactory and Schematic/Leaf codices; distinguish visual analogy from literal mechanics.

**Deliverable:** 10–15 small SVG/CSS components plus the approved original symbols.  
**Exit test:** A sample Academy document is recognizably Redactory/SiNE without a large background illustration.

---

## Phase 7 — Design real interface primitives

**Goal:** Move from images to components a visitor can operate.

Start with these eight: **SiNE shell/header, Academy tab, archival sidebar item, document panel, page viewer, annotated callout, diagram canvas, primary/secondary button**. Add paper drawers, floating cards, and instrument dials only when the prototype requires them.

For every component, design: normal/hover/focus/disabled states; desktop and narrow-width layouts; readable typography; keyboard use; reduced-motion behavior. Prefer actual HTML/CSS/React components over baking text and buttons into background images.

**Deliverable:** A small interactive component gallery showing each control in at least two states.  
**Exit test:** You can assemble a navigable, accessible screen out of reusable parts.

---

## Phase 8 — Create only the hero assets the prototype needs

**Goal:** Invest in memorable compositions *after* the reusable pieces work.

Choose **one** primary screen to build first: a **Redactory Academy entrance / first lesson** is the recommended pilot. For it, commission or generate at most three specialized compositions:

1. **Academy study or bookcase environment** — wide background with deliberate empty space for live UI.
2. **Manuscript or desk composition** — manipulable layers, not a single picture containing baked-in controls.
3. **Teaching diagram/instrument** — ideally editable SVG or a React visualization with canonical constraints documented.

Build the screen in layers: background → ambient effects → surfaces → live UI → instrumentation → explanatory annotations. This enables interaction, responsiveness, and selective motion.

**Deliverable:** One coherent Redactory entrance/lesson mockup with three hero assets or fewer.  
**Exit test:** At least one meaningful action changes the visitor's understanding, not merely the animation.

---

## Phase 9 — Build the first interactive vertical slice

**Goal:** Prove the entire production method on one small journey.

Suggested flow:

1. Visitor chooses **Redactory** from SiNE's Systems page.
2. The SiNE navigation persists while the visual environment becomes Academy-inspired.
3. A manuscript or instructional desk opens.
4. Visitor changes one controlled element of a **source-grounded** learning exercise.
5. The interface displays a consequence, explanation, and why a common misconception fails.
6. Visitor can reset and compare outcomes.

Before implementation, consult the **Redactory Codex**, **Redactor Life and Academy Codex**, **Schematic and Leaf Codex**, and governing Archive material. If the demonstration invents a teaching analogy, label it explicitly; do not present a fictional UI mechanism as a canonically real instrument without approval.

**Deliverable:** A clickable prototype on a separate development branch or sandbox; no changes to the live site without authorization.  
**Exit test:** Someone unfamiliar with Redactory can interact once and learn a principle they could explain back.

---

## Phase 10 — Audit, optimize, and expand

**Goal:** Make the prototype maintainable before adding dozens of rooms and systems.

- [ ] Check license provenance and provide required credits.
- [ ] Compress assets; use responsive dimensions, lazy loading, and avoid oversized textures.
- [ ] Test on desktop and mobile, with keyboard navigation and reduced motion.
- [ ] Check text contrast, loading performance, and layout shifts.
- [ ] Review every apparent in-world claim against current canonical sources.
- [ ] Identify assets that are *truly reusable* and promote them to shared libraries.
- [ ] List missing assets based on actual prototype limitations—not speculative completeness.
- [ ] Only then plan the next lesson, room, or system.

**Deliverable:** Versioned starter kit, working demo, licensing ledger, and next-iteration backlog.  
**Exit test:** Another collaborator can identify, edit, replace, or credit every asset without guessing.

---

## Proposed folder structure

```text
SiNE Visual Library/
├── README.md
├── Asset Inventory.md
├── Licenses and Credits.md
├── SiNE Core/
│   ├── Original Logos and Marks/
│   ├── Shared Interface/
│   └── Color and Type References/
├── Redactory/
│   ├── Art Direction/
│   ├── References — Not for Publication/
│   ├── Originals — Do Not Edit/
│   ├── Textures/
│   ├── Symbols and Ornaments/
│   ├── Interface Components/
│   ├── Environments and Props/
│   ├── Hero Compositions/
│   ├── Prototypes/
│   └── Generation Prompts/
└── Future Systems/  # Divination, Bloom, etc. — only when needed
```

Use human-readable filenames with purpose and variant, e.g. `Redactory - Ivory Paper - Fine Grain - v01.webp`, not `final-new-3.png`. Preserve originals separately from exported website versions. Folder names are suggestions; do not duplicate an existing canonical or project folder merely to follow this tree.

## Minimum asset manifest entry

Copy this template for each accepted asset:

```yaml
asset_id: redactory-paper-ivory-001
name: Redactory - Ivory Paper - Fine Grain
category: texture
file: Redactory/Textures/Redactory - Ivory Paper - Fine Grain - v01.webp
origin: third-party | original | AI-generated | custom-designed
creator: ""
source_url: ""
license: ""              # Exact license/version; not simply 'free'
license_evidence: ""     # URL or stored copy of the relevant terms
attribution_required: false
attribution_text: ""
acquired_or_created: YYYY-MM-DD
canonical_status: editorial-visual  # or approved-in-world-symbol / illustrative-metaphor
intended_use: reading-panel-background
approved_for_publication: false
master_source: ""
notes: ""
```

## First milestone: an achievable starter kit

| Group | Initial target | Completion criterion |
|---|---:|---|
| Existing symbols/logos | Inventory all relevant originals | Meaning and rights recorded |
| Texture exports | 8 | Tile/contrast tests passed |
| Ornaments | 10–15 | SVG/CSS, readable at small size |
| Reusable UI primitives | 8 | Interactive and keyboard-accessible |
| Specialized hero compositions | Up to 3 | Designed for the actual prototype |
| Demonstration | 1 | Teaches one verifiable Redactory idea |

**Rule for every phase:** Build the smallest useful collection, use it in a real screen, then expand. The library is a production system, not an illustration trophy cabinet.

## Source and authority reminders

- **Canonical truth:** active Dy’Aspora Archive and governing codices.
- **Experimental teaching:** Redactory Academy Experience Lab, marked as interpretation/prototype.
- **Original visual identity:** existing SiNE/ Wonderwall artwork and approved symbols, retained and tracked.
- **External inspiration:** design principles may be studied; third-party screenshots and proprietary game art are not reusable website assets merely because they were supplied as inspiration.
- **Free asset sources:** verify the current per-asset license before publishing; the links above were checked for general guidance on 24 November 2026.
