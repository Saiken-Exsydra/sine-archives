# SiNE Asset Pipeline

The Archive owns the originals. Sharp prepares publication copies. Git distributes them with the React branch. React chooses an image for the reader’s viewport.

## First-time setup

For development, builds, tests and deployment, install Node.js 22 and run `npm ci`. The repository includes the delivery manifest and every responsive image. Sharp is a development dependency with native binaries installed by npm. Keep optional dependencies enabled on the build machine. The deployed site serves static files.

Only the person generating artwork needs two additional files at the project root. Both are ignored by Git. This checkout is already configured.

1. Copy `.env.example` to `.env.local`. Set `SINE_ARTWORKS` to the **Artworks** directory containing the character, place and institutional collections. Quote the value. Paths with spaces and Windows drive letters work. Keep this variable private and omit the Vite public-variable prefix.
2. Transfer the private `.asset-sources.local.json` mapping from your artwork workstation, or create it using exact filenames relative to Artworks. Each approved ID needs one entry. JSON strings support Unicode and apostrophes. Forward slashes work on Windows.

The local Archive happens to live under **The Archive/Artworks** in the sibling Astro checkout. The two checkouts use the same Git remote and can have different branches checked out. A directory’s presence there grants no publication rights. The first eight registrations match standard portrait and hero image blobs from the sibling’s committed `main`. This excludes alternate, legacy and duplicate files.

## Publish or replace an illustration

1. Update the canonical record, place the original in its established Archive folder, and review that exact image for public distribution. Use the existing character slug for a portrait or hero. For other subjects, choose a stable descriptive ID and category.
2. Add a private mapping entry. For example, an approved place illustration could use `"north-garden-view": "Places & Regions/North Garden/View.png"`. Changing the Archive location later only requires updating local configuration.
3. In PowerShell, run `(Get-FileHash -Algorithm SHA256 -LiteralPath "D:/your-archive/Artworks/Places & Regions/North Garden/View.png").Hash.ToLowerInvariant()`. Add an object to the array in [approved.json](tools/assets/approved.json) using that value:

   ```json
   {
     "id": "north-garden-view",
     "category": "place",
     "profile": "illustration",
     "approvedSha256": "replace-with-the-64-character-lowercase-hash"
   }
   ```

   For a character, register the two images separately, e.g. `hisui-kirasagi-portrait` and `hisui-kirasagi-hero`. Replacing an illustration keeps its ID and requires approval of the new file’s hash. A changed file cannot silently inherit an earlier approval.
4. Run `npm run assets:dry-run`, then `npm run assets:sync`. Review the inventory with `npm run assets:report`. If it lists obsolete files, inspect them and move confirmed obsolete copies outside `public/` before building. Generation never deletes publication files.
5. Reference the ID in the appropriate component or character record. Open the root launcher and preview in Zen. Run `npm run assets:test`, `npm run build` and `npm test`. Commit the approvals, derivatives, manifest and consuming code together on the React branch with the required commit prefix.

## Generation and verification

| npm command | Operation | Needs Artworks |
| --- | --- | --- |
| `assets:dry-run` | Read exact approved sources, verify hashes, list planned widths and cache hits. Writes nothing. | Yes |
| `assets:sync` | Generate new or changed sets and repair missing or damaged derivatives. | Yes |
| `assets:rebuild` | Encode all registered sets even on cache hits. Identical files retain their timestamps. | Yes |
| `assets:report` | Verify inventory and print source bytes, variant widths and encoded bytes. | No |
| `assets:check` | Verify registrations, dimensions, formats, filenames, lengths and SHA-256 digests. Reject additional publication files. Also runs during build. | No |
| `assets:test` | Exercise the processor on temporary synthetic artwork. | No |

[Profiles](tools/assets/profiles.mjs) define the target widths and WebP quality. Initial values are thumbnail 96/192/320 at 86, portrait 96/320/640/960 at 90, hero 1280/1920/2560 at 90, illustration 640/1280/1920 at 90, symbol 96/256/512 at 94 and background 960/1600/2560 at 88. Choose the profile the interface actually uses. The 96-pixel portrait serves the small navigation rail. Widths clamp to the oriented original and repeated sizes collapse into one.

The engine processes one image and one width at a time. PNG, JPEG and WebP inputs yield WebP in sRGB with source orientation applied, full composition, alpha preserved and embedded metadata removed. Animated images are outside the initial scope. For SVG, review the entire original including metadata, links and active content, then explicitly set `"publishOriginalSvg": true` on its approval. The exact reviewed SVG bytes are copied once. The pipeline does not sanitize vector originals. Existing corporate SVG masters continue through their established Vite imports.

Each file in `public/media/` carries its stable ID, width and a derivative content-hash suffix. The public [manifest](src/images/manifest.json) holds delivery metadata and integrity information. Source filenames and absolute paths stay local. A cache in `.asset-pipeline/` fingerprints the approval, profile, engine and Sharp versions. Even cache hits verify output integrity. A writer lock prevents simultaneous syncs. New files are written atomically and the manifest switches only after all sets succeed. A failed sync can leave unreferenced copies; the inventory lists them for manual review. For a stale lock after interruption, confirm no sync is running before removing `.asset-pipeline/cache.json.lock`.

## React delivery

Use the typed [delivery layer](src/images/publication.tsx) for content images and Motion backdrops. The manifest supplies intrinsic dimensions, fallback URL and width descriptors. Give `sizes` the CSS display width and supply localized alt text. Use an empty alt when adjacent text already identifies a decorative image.

```tsx
<PublicationImage asset="hisui-kirasagi-portrait" sizes="60px" alt="" />
<m.img {...imageProps(character.art, '100vw', '')} className="scene-art" />
```

The first form defaults to lazy loading and asynchronous decoding. For critical art pass `loading="eager"` and, selectively, `fetchPriority="high"`. A route that knows its critical image in advance can call `preloadImage(id, sizes)` with the same slot size. For an externally supplied ID, check `isAssetId(value)` and render a localized fallback if it is unknown. A network failure retains the declared dimensions and native alt behavior.

Set the frame’s dimensions in CSS. Use `fit="cover"` for a cropped frame, with centered positioning by browser default or `focalPoint="42% 28%"` to override. Use `contain` for full composition. The character scene retains its full-viewport Motion element and its existing desktop and mobile focus rules. Switching sections keeps that element mounted.

## Baseline and maintenance

Eight approved originals for Al’ithia, Hisui, Le’nore and Leonard occupy 23,992,238 bytes. Their 28 responsive WebPs occupy 4,853,300 bytes in Git before repository compression. Selecting only the largest variant of each totals 2,304,568 bytes. These are file sizes, not a page-load benchmark. The current character routes use Hisui and Le’nore. Al’ithia and Leonard are ready for future records.

If sync reports a missing source, verify the root and exact private mapping. For an approval mismatch, inspect the artwork before replacing the checksum. If check fails on a fresh clone, restore the committed file or ask the artwork workstation to regenerate it. Preserve existing runtime artwork during gradual migration. Review generated files before committing and keep canonical collections and local cache files out of Git.

Revisit storage when binary history materially slows clones or CI, or publication needs independent releases and cache controls. Content-addressed filenames and the centralized delivery base allow a future object store or CDN to serve identical variants. No external hosting is needed today.
