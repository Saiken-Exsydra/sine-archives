# Complete Archive snapshot — 2026-09-21

This ZIP captures all 309 files and 50 directories present in The Archive, including hidden and ignored items. It contains 596,598,751 uncompressed bytes. No lore or media was changed. The accompanying manifest records each file's SHA-256 checksum.

ZIP SHA-256: `f4b549862675b7bea8fb158b851aaac84c909d445753f964347c8ec22ca57be6`

The ZIP is stored using Git LFS. On GitHub, open the ZIP file and use the raw-file download button to download the actual ZIP. To retrieve from a clone with Git LFS installed:

```sh
git fetch origin backup/pre-reset-2026-09-21
git switch backup/pre-reset-2026-09-21
git lfs pull --include="backups/archive-snapshot-2026-09-21/The-Archive-snapshot-2026-09-21.zip" --exclude=""
```

Extract the ZIP into a separate recovery folder first. It contains a top-level `The Archive` folder. Do not rely on GitHub's generic repository ZIP download to include LFS content. Keep using main for the functioning website; this branch is for recovery only.

The ZIP was checked for corruption, and every archived file's checksum was matched against the local source before upload.
