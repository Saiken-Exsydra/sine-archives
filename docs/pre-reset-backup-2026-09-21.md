# Pre-reset recovery backup — 2026-09-21

This branch preserves only the custom SiNE interaction skill and the pre-existing stash. The website files in this branch's tip are exactly those in main at `bdfc843b7967da7e1fb4cc22ebcd0f3de4976234`. No unfinished Observatory source changes were included. The user reports that The Archive is backed up separately through Google Drive.

## Recover the functioning website

Clone the repository normally and use main. Follow README.md for dependency installation and building.

## Recover the optional interaction skill

From a normal clone on main:

```sh
git restore --source=origin/backup/pre-reset-2026-09-21 -- .agents/skills/sine-interactive-experience
```

## Recover the optional saved work

The original stash commit `def8b87931c6377933802421f29733668ca37767` is the second parent of this backup commit, preserving its working and index snapshots as reachable Git history. Its changes were not applied to the website or to this branch's tip. To recreate the stash entry after cloning:

```sh
git stash store -m "Pre-reset saved work from 2026-09-21" def8b87931c6377933802421f29733668ca37767
```

Inspect it before applying; it contains older layout, navigation, search, metadata, and wording changes and may conflict with later work. Do not merge this backup branch into main to restore the stash.

The disposable Observatory adjustments, dependency/build output, screenshots/logs, and the separately backed-up Archive were intentionally not added. Local branch names with no unique commits were not pushed.
