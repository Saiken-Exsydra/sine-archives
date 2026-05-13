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
- If a pt-BR file is missing, that entry simply will not exist in `/pt-br/`.
- Save every translation file as UTF-8.
- Do not pass translated text through tools/editors that reinterpret UTF-8 as ANSI/Windows-1252.
- Run `npm run check:text-encoding` before build or commit if you touched pt-BR content.
- If mojibake already landed in a file, run `npm run fix:text-encoding` and review the diff.

Recommended flow:

1. Copy one English file from matching `*_en` folder.
2. Translate frontmatter text + body text.
3. Save translated file in matching `*_pt_br` folder with same filename.
4. Rebuild site.
