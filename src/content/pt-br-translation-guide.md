# pt-BR Translation Workspace

Put Brazilian Portuguese entry files in:

- `src/content/characters_pt_br/`
- `src/content/organizations_pt_br/`
- `src/content/sine_pt_br/`
- `src/content/places_pt_br/`
- `src/content/apparatus_pt_br/`
- `src/content/systems_pt_br/`
- `src/content/cosmology_pt_br/`

Rules:

- Keep same filename/slug as English source.
- Keep frontmatter keys exactly same.
- Translate values and Markdown body.
- Keep image paths, tags, dates, status fields unless intentionally changed.
- If a pt-BR file is missing, runtime may still fall back to the English entry, but the translation workspace will be incomplete and the build guard should fail.
- To create untranslated fallback copies for any missing pt-BR entries, run `npm run seed:pt-br-fallbacks`.
- To verify every English entry has a pt-BR partner file, run `npm run check:pt-br-fallbacks`.
- Save every translation file as UTF-8.
- Do not pass translated text through tools/editors that reinterpret UTF-8 as ANSI/Windows-1252.
- Run `npm run check:text-encoding` before build or commit if you touched pt-BR content.
- If mojibake already landed in a file, run `npm run fix:text-encoding` and review the diff.

Recommended flow:

1. Add or update the English file in the matching `*_en` folder.
2. Run `npm run seed:pt-br-fallbacks` to create missing pt-BR fallback copies without overwriting translated files.
3. Translate frontmatter text + body text in the matching `*_pt_br` file.
4. Run `npm run check:pt-br-fallbacks`.
5. Rebuild site.
