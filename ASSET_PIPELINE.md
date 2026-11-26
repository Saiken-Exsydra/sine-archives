# SiNE Asset Pipeline

The Archive owns the originals. Sharp prepares publication copies. Git distributes them with the React branch. React chooses an image for the reader’s viewport.

## First-time setup

For development, builds, tests and deployment, install Node.js 22 and run `npm ci`. The repository includes the delivery manifest and every responsive image. Sharp is a development dependency with native binaries installed by npm. Keep optional dependencies enabled on the build machine. The deployed site serves static files.

Only the person generating artwork needs two additional files at the project root. Both are ignored by Git.

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

Use the [shared React API](src/images/publication.tsx) wherever a domain displays published artwork. Choose a stable registration ID and a processing profile for the intended display slot. Commit the approval, manifest and generated public files together. The browser needs only the manifest and public derivatives. Public URLs resolve against Vite’s build-time base, including a path such as `/archive/`. Ordinary installs, tests, builds and static deployments require no Archive, source map, private environment or generation cache.

| API | Use |
| --- | --- |
| `AssetId` | Type record fields from manifest keys. Removing a referenced ID fails type checking. |
| `isAssetId(value)` | Narrow an unknown external value before lookup. Show a localized unavailable message or omit an optional reference when it fails. |
| `PublicationImage` | Render an ordinary image with required ID, slot size and alt text. Defaults to lazy loading and asynchronous decoding. Accepts native image attributes, fit and focal position. |
| `imageProps(id, sizes, alt)` | Supply the same URL, width descriptors, dimensions and decoding hint directly to an image or Motion element. The caller controls loading and priority. |
| `preloadImage(id, sizes)` | Hint one imminent responsive request. Use the same slot as the consumer. This hint supplies no readiness signal. |
| `imageReady(element, signal?)` | Await decode on a mounted or supplied image. The promise rejects on delivery or decode failure, or after cancellation. Removing an element and the browser’s cache policy govern resource lifetime. |
| `prepareImage(id, sizes, signal?)` | Resolve, request and decode one responsive candidate before a consuming image exists. Returns its detached image. Release the reference when finished. Aborting removes its sources while preparation is in progress. |

For a natural-proportion editorial illustration, pass the localized description from the record, a width matching the reading column, and a proportional height. For a diagram or transparent symbol in a fixed frame, use `fit="contain"` and give the element both frame dimensions. A fixed portrait frame can use its own focal point:

```tsx
<PublicationImage asset={entry.illustration} alt={entry.description[locale]}
  sizes="min(90vw, 640px)"
  style={{ width: 'min(90vw, 640px)', height: 'auto' }} />

<PublicationImage asset={person.portrait} alt="" sizes="auto, 80px"
  fit="cover" focalPoint="center 22%" style={{ width: 80, height: 96 }} />
```

Use empty alt for decorative environments and portraits in already-named links. Preserve meaningful localized descriptions for informative content, including a nearby text equivalent for a complex diagram. Native alt and intrinsic dimensions remain available on an ordinary failed request. Use the native `onError` prop for a domain-specific unavailable treatment. Never substitute another subject’s image.

The rail reserves its frame in CSS and uses native lazy-image auto-sizing with an 80-pixel fallback. Search and relationship references can use an explicit small CSS slot or the thumbnail profile. A collection may load nearby portraits progressively. Hero preparation belongs to a specific intended selection. The active expanded hero uses eager loading, high fetch priority and `100vw`. The collapsed exhibition uses lazy loading and normal priority. Inline assignment of responsive sources on the display element already initiates its request.

### Persistent environments and readiness

The [character exhibition](src/grand-index/CharactersShowcase.tsx) stages the requested image at zero opacity in the existing environment. It awaits decode on that exact element. Route changes take effect immediately in browser history. Until decode succeeds the previous title, information, selection and artwork stay together. The new record and its selected section then appear with the shared Motion fade over the previous layer. Completion releases that layer. Reduced motion settles immediately. Section changes and locale changes reuse the image. CSS controls desktop and mobile hero focal positions independently of the portrait frame.

A superseding selection or unmount invalidates the pending result. When a hero fails, the requested record and its navigation stay usable with an EN/PT-BR unavailable message on the underlying obsidian field. Selecting it again after another record, or reloading the route, retries. On a first direct visit the record can be read while the browser paints its initial artwork.

A future registry may prepare one selection while its gallery covers the environment:

```tsx
const controller = new AbortController();
const ready = prepareImage(person.art, '100vw', controller.signal);
// The owner calls controller.abort() when superseded or unmounted.
const decoded = await ready;
if (!controller.signal.aborted) revealSelection(person, decoded);
```

Handle a rejected promise in the owner’s error path. The registry controls its reveal and the lifetime of the returned image. For a mounted hero, await `imageReady` on the actual element, especially after a viewport or DPR change. The browser chooses candidates and manages its own cache. No application-wide image cache or preload queue is necessary.

### Existing artwork and verification

The published inventory currently contains character images. The History landscape, Systems study backdrop and three Systems portal images retain their existing bundled WebPs pending explicit source approvals. The corporate emblem and lockup retain their approved SVG imports. The landing reflection, CSS overlays and WebGL wave are procedural materials. New environmental artwork can use a positioned publication image behind the foreground. An approved SVG uses the same delivery API and retains its original bytes. The editorial regression uses a synthetic diagram in a test-only manifest.

Run `npm run assets:test`, `npm run build`, then `npm test`. The publication regressions exercise request and decode waits independently, request failure, rapid navigation and persistent geometry. The editorial fixture exercises intrinsic dimensions, natural and contained presentation, external ID validation, readiness and nested-base delivery. For a deployment check, build with `npm run build -- --base=/archive/` and serve with `npm run preview -- --base=/archive/`. Open a direct hash route below that prefix.

For network measurements, use a fresh browser context per viewport and DPR against the actual HTTP preview. Inspect image `currentSrc`, CSS slot width, and Resource Timing’s `encodedBodySize`, `transferSize` and duration. Record network throttling and cache state. Compare network entries after changing sections, then selecting an individual. Inspect layout-shift entries and the image’s rectangle, fit and focal position. Playwright’s intercepted-dist mode is useful for deterministic regressions, while the real server is needed for cache and transfer measurements.

## Baseline and maintenance

Eight approved originals for Al’ithia, Hisui, Le’nore and Leonard occupy 23,992,238 bytes. Their 28 responsive WebPs occupy 4,853,300 bytes in Git before repository compression. Selecting only the largest variant of each totals 2,304,568 bytes. These are file sizes, not a page-load benchmark. The current character routes use Hisui and Le’nore. Al’ithia and Leonard are ready for future records.

Phase II sampled a cold direct Characters visit per viewport on Windows using Chromium 148.0.7778.96 and the production preview under `/archive/`. Network emulation used 100 ms latency, 256,000 bytes/s downstream and 128,000 bytes/s upstream. Values below are Resource Timing transfer bytes, including browser-accounted response overhead.

| Viewport and DPR | Rail slot | Le’nore hero | Le’nore portrait | Hisui hero after selection |
| --- | ---: | ---: | ---: | ---: |
| 1440 × 900, 1× | 76.5 px | 1920w · 481,650 B · 4.06 s | 96w · 6,116 B | 1920w · 291,094 B · 1.26 s |
| 390 × 844, 2× | 49.3 px | 1280w · 260,194 B · 3.46 s | 320w · 47,640 B | 1280w · 165,040 B · 0.76 s |

Each cold visit requested one hero and the two visible portraits. The initial layout-shift observer recorded zero entries in both samples through portrait readiness. A separate desktop run against the development server issued a responsive preload hint, awaited preparation and presented Hisui with one 1920w transfer. Cache state, candidate selection and timing vary by browser and connection. These measurements establish a delivery baseline. A before-and-after page-load comparison would require comparable runs of both versions.

If sync reports a missing source, verify the root and exact private mapping. For an approval mismatch, inspect the artwork before replacing the checksum. If check fails on a fresh clone, restore the committed file or ask the artwork workstation to regenerate it. Preserve existing runtime artwork during gradual migration. Review generated files before committing and keep canonical collections and local cache files out of Git.

Revisit storage when binary history materially slows clones or CI, or publication needs independent releases and cache controls. Content-addressed filenames and the centralized delivery base allow a future object store or CDN to serve identical variants. No external hosting is needed today.
