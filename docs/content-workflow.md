# Content workflow

## Canon and public entries

`The Archive/` is canonical source material. Public articles live in `src/content/<collection>_en/` and `src/content/<collection>_pt_br/`; they are editorial adaptations, not generated dossier copies. Preserve lore, names, disclosure boundaries, slugs, frontmatter, explicit anchors, and locale structure.

Collections: `characters`, `organizations`, `sine`, `places`, `apparatus`, `systems`, and `cosmology`. The schema in `src/content.config.ts` defines accepted metadata. `status: public` enables public listing. Use [the character model](character-entry-model.md) and [authoring template](templates/character-entry-template.md) for character articles. `designation` and `summary` have separate purposes; read the controlling dossier before editing either.

Character `codex_file` metadata selects a canonical file in `The Archive/Characters/`. Build reads that file directly for the codex route. Do not rename those records or migrate canonical prose as part of an application refactor.

## Images

Content artwork belongs in `src/assets/uploads/<section>/`. Astro processes imported assets into responsive AVIF/WebP variants. Stable URL assets such as UI logos, map layers, and existing homepage backgrounds live in `public/uploads/`. Both locations remain intentional; do not delete public URLs just because a matching optimized source exists.

Use paths relative to the Markdown file:

```yaml
image: "../../assets/uploads/characters/char-name.png"
hero_image: "../../assets/uploads/characters/char-name-hero.png"
portrait_gallery:
  - "../../assets/uploads/characters/char-name-portrait-2.png"
hero_gallery:
  - "../../assets/uploads/characters/char-name-hero-2.png"
```

`image` is the primary card/portrait art; `hero_image` is wide stage art. Gallery arrays add variants. Both locales should reference the same artwork. Preserve exact case, extension, and filenames. Do not put filesystem paths or bare `src/assets/...` paths in frontmatter. Page-owned artwork may be imported directly in Astro; use `optimized-images.ts` for responsive bundles. Keep image dimensions or aspect ratios stable, lazy-load below-fold media, and reserve eager/high-priority loading for the initial viewport.

## Translation

Keep the same filename/slug and frontmatter keys as English. Translate text values and body; preserve image paths, tags, dates, and status unless intentionally changing them. Use [the terminology glossary](translation-glossary-pt-BR.md). The runtime can fall back to English, but the build guard requires every English file to have a pt-BR partner.

1. Add or update the English entry.
2. Run `npm run seed:pt-br-fallbacks` to create missing untranslated partners without replacing translations.
3. Translate the paired file, retaining meaning and disclosure level.
4. Run `npm run check:content` and `npm run build`.

Save UTF-8. Avoid tools that reinterpret text as ANSI/Windows-1252. `npm run fix:text-encoding` writes repairs; review every change. `--overwrite` on the fallback generator is destructive to existing translations and is not part of normal maintenance.

## References and diagrams

[Archive cross-references](archive-cross-references.md) documents wiki links, aliases, previews, and explicit section anchors. `npm run check:archive-refs` validates resolution. `npm run report:archive-refs` prints current editorial candidates; reports are disposable and should not be committed. Reference mappings belong in `src/data/archiveRefs.mjs`.

Use `mermaid` for visual maps and `diagram` for raw alignment-sensitive maps, following the [design system](design-system.md). Canonical names and hierarchy must remain intact.

## Soundtracks

Author MP3s in `public/music/` and deliberate cover overrides in `public/music/source-covers/`. `npm run songs:generate` reads tags and overrides, then generates `src/data/songs.json` and extracted `public/music/covers/`. These derived files remain local and are ignored by Git. Development, checking, and build commands run the generator when needed. Localized catalog copy belongs in `src/data/music.ts`.

`songs:update` writes source MP3 tags; inspect its arguments and the intended files before running it. Do not recompress or retag audio during unrelated maintenance.
