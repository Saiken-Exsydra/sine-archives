# Content + Image Workflow

This file explains the current content/image workflow for this repo.

Short version:

- New entry images that should be optimized by Astro go in `src/assets/uploads/...`
- Old raw public files still live in `public/uploads/...`
- For new content entries, use `src/assets/uploads/...` unless you have a specific reason not to
- `public/uploads/...` is now mostly for legacy/static files like logos or files that must stay addressable by a fixed URL

## The Two Upload Folders

### `src/assets/uploads`

Use this for:

- character portraits
- hero images
- place images
- cosmology images
- organization images
- system images
- any new artwork that belongs to content entries

Why:

- Astro can optimize these files
- Astro can generate responsive `avif`, `webp`, and fallback variants
- the browser will get `/_astro/...` files instead of the original giant source file

Recommended location pattern:

- `src/assets/uploads/characters/...`
- `src/assets/uploads/places/...`
- `src/assets/uploads/cosmology/...`
- `src/assets/uploads/organizations/...`
- `src/assets/uploads/systems/...`
- `src/assets/uploads/apparatus/...`
- `src/assets/uploads/sine/...`

### `public/uploads`

Use this only when you need a raw public URL like:

- `/uploads/ui-sine-logo.png`
- `/uploads/sine-logo.png`

Good uses for `public/uploads`:

- logos
- tiny UI assets
- files that are intentionally referenced by a hardcoded public URL
- legacy files not yet migrated

Do not use `public/uploads` for new entry hero art unless you intentionally want to bypass Astro optimization.

## The Rule For New Entries

If you are adding a new content entry and it has an image, put that image in `src/assets/uploads/...`.

That is the default rule.

## Where Entry Files Live

Each content type has two folders:

- English: `src/content/<collection>_en/`
- Portuguese: `src/content/<collection>_pt_br/`

Examples:

- characters: `src/content/characters_en/` and `src/content/characters_pt_br/`
- places: `src/content/places_en/` and `src/content/places_pt_br/`
- cosmology: `src/content/cosmology_en/` and `src/content/cosmology_pt_br/`
- organizations: `src/content/organizations_en/` and `src/content/organizations_pt_br/`
- systems: `src/content/systems_en/` and `src/content/systems_pt_br/`
- apparatus: `src/content/apparatus_en/` and `src/content/apparatus_pt_br/`
- sine: `src/content/sine_en/` and `src/content/sine_pt_br/`

## How To Add A New Entry

### 1. Create the image file

Put the image in the matching `src/assets/uploads/<section>/` folder.

Examples:

- `src/assets/uploads/characters/char-my-new-character.png`
- `src/assets/uploads/characters/char-my-new-character-hero.png`
- `src/assets/uploads/places/place-my-new-city.png`
- `src/assets/uploads/cosmology/cosm-my-new-concept.png`

### 2. Create the content file

Create the markdown file in the correct collection folder.

Examples:

- `src/content/characters_en/my-new-character.md`
- `src/content/characters_pt_br/my-new-character.md`

### 3. Fill frontmatter

The main image fields are:

- `image`
- `hero_image`

`image` is usually the main portrait/panel image.

`hero_image` is usually the wide hero/stage image.

Use a relative path from the markdown file to `src/assets/uploads/...`.

Because the markdown files live in `src/content/<collection>_<locale>/`, the path is usually:

`../../assets/uploads/...`

### Character example

```md
---
title: "My New Character"
type: "Character"
summary: "Short summary here."
tags: ["Character", "Example"]
status: "public"
created: "2026-05-14"
updated: "2026-05-14"
image: "../../assets/uploads/characters/char-my-new-character.png"
hero_image: "../../assets/uploads/characters/char-my-new-character-hero.png"
---
```

### Place example

```md
---
title: "My New City"
type: "Place"
summary: "Short summary here."
tags: ["Places", "Example"]
status: "public"
created: "2026-05-14"
updated: "2026-05-14"
image: "../../assets/uploads/places/place-my-new-city.png"
---
```

### Cosmology example

```md
---
title: "My New Concept"
type: "Cosmology"
summary: "Short summary here."
tags: ["Cosmology", "Example"]
status: "public"
created: "2026-05-14"
updated: "2026-05-14"
image: "../../assets/uploads/cosmology/cosm-my-new-concept.png"
---
```

## Exact Path Rule

If the markdown file is inside `src/content/...`, and the image is inside `src/assets/uploads/...`, the path should usually start with:

`../../assets/uploads/`

Correct:

- `../../assets/uploads/characters/char-solytra.jpg`
- `../../assets/uploads/characters/char-solytra-hero.png`
- `../../assets/uploads/places/place-vrenne.png`

Wrong:

- `/uploads/char-solytra.jpg`
- `../../assets../../assets/uploads/...`
- `src/assets/uploads/...`

Do not put absolute filesystem paths in frontmatter.

Do not put `src/assets/...` directly without the relative `../../`.

## Which Image Field To Use

Use `image` when:

- the entry needs one main image
- the page/card/record uses the main portrait or panel image

Use `hero_image` when:

- the entry has a dedicated wide hero image
- the characters index stage or hero layout needs a separate cinematic image

Some entries only need `image`.

Some entries need both.

## If The Same Image Is Used In EN And PT-BR

Point both markdown files to the same file in `src/assets/uploads/...`.

That is normal and preferred.

Example:

- `src/content/characters_en/my-new-character.md`
- `src/content/characters_pt_br/my-new-character.md`

Both can use:

- `image: "../../assets/uploads/characters/char-my-new-character.png"`

## How Page Code Should Reference Images

If the image belongs to a content entry, prefer frontmatter fields like `image` and `hero_image`.

If a page needs a standalone asset outside content frontmatter, import it from `src/assets/uploads/...`.

Example:

```astro
import myPanelImage from "../../assets/uploads/systems/sys-my-panel.png";
```

Do this for page-owned assets that are not coming from a markdown entry.

## When To Use `public/uploads` On Purpose

Only use `public/uploads` when at least one of these is true:

- the file is a logo or tiny UI asset
- the file must stay reachable at a stable public URL
- the file should not go through Astro image optimization
- the code is intentionally using `src="/uploads/..."`

Example:

```html
<img src="/uploads/ui-sine-logo.png" alt="SiNE" />
```

That is fine for UI logos.

That is not the recommended pattern for new giant character art.

## What To Do With New Big Images

For any new large image:

1. Put it in `src/assets/uploads/<section>/`
2. Link it from frontmatter using `../../assets/uploads/<section>/file-name.ext`
3. Let Astro generate optimized variants

Do not put new 10 MB to 20 MB hero art in `public/uploads` unless you explicitly want raw delivery.

## Naming Conventions

Follow the existing style as closely as possible:

- characters: `char-name.png`, `char-name-hero.png`
- places: `place-name.png`
- cosmology: `cosm-name.png`
- organizations: `org-name.png`
- systems: `sys-name.png`
- apparatus: `app-name.png`
- sine: `sine-name.png`

Try to keep names lowercase and hyphenated.

## Existing Legacy Files

Right now this repo still contains:

- old files in `public/uploads/`
- migrated content art in `src/assets/uploads/`

That is why both folders exist.

This is intentional during migration.

For new work, do not treat both folders as equal.

Preferred source of truth for new content art:

- `src/assets/uploads/...`

Legacy/static public bucket:

- `public/uploads/...`

## Quick Checklist

For a new entry with images:

1. Put image files in `src/assets/uploads/<section>/`
2. Create the entry in `src/content/<collection>_en/`
3. Create the PT-BR partner in `src/content/<collection>_pt_br/` if needed
4. Set `image` and `hero_image` using `../../assets/uploads/...`
5. Run `npm run build`

## If Something Breaks

Check these first:

- path starts with `../../assets/uploads/`
- filename exactly matches the real file
- extension matches exactly: `.png`, `.jpg`, `.webp`, etc.
- file is inside `src/assets/uploads/...`, not just `public/uploads/...`
- you did not accidentally write `../../assets../../assets/...`

## Recommended Team Rule

If you are unsure:

- entry image = `src/assets/uploads/...`
- UI logo/static public file = `public/uploads/...`

That rule will keep you out of trouble most of the time.
