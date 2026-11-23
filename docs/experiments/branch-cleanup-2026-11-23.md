# Repository cleanup — 23 November 2026

Scope: the `Saiken-Exsydra/sine-archives` repository, not other GitHub repositories.
The remote branch list, local branch tips, worktree registrations, unique commit
sets, React component history, package manifests, and migration boundaries were
examined before retiring branches.

Production base: `a6746aff13f9b5f4a25ddbd02ac0f284d083bd3a`.
`main` remains at this commit. There were no open pull requests at inspection.

| Old remote branch | Finding | Disposition |
| --- | --- | --- |
| `experiment/visual-design-lab` | Tip `1959487`; already an ancestor of main. Its sole React component is a small bilingual record fixture, not a rewrite. | Retire branch; all work remains in main's history and source. |
| `codex/northern-naval-consolidation` | Tip `7e8ed1e`; already an ancestor of main. | Retire branch; canon changes remain in main. |
| `backup/pre-reset-2026-09-21` | Tip `ce5e19c`; contains unique recovery history, optional interaction skill, an old stash, and an LFS Archive snapshot. | Preserve as an additional parent of the React experiment before retiring its branch ref. |

All local branch tips were also inspected. The old local working branches point
to `bdfc843`, `1959487`, or `a6746af`, all reachable from main. The original
authoring checkout has uncommitted changes and read-only Git metadata in this
session, so its branch refs, files, and stale worktree registration are preserved.
The clean experiment is assembled in an independent checkout.

## Recovery without an extra branch

The React experiment's first commit has ordered parents `a6746af` and
`ce5e19c`. Its working tree starts from main plus the React experiment; obsolete
backup website files are not restored. The second parent keeps the full backup
and saved stash reachable in an ordinary full clone of the experiment branch.

```sh
git show ce5e19c:docs/pre-reset-backup-2026-09-21.md
git show ce5e19c:backups/archive-snapshot-2026-09-21/README.md
git show ce5e19c:.agents/skills/sine-interactive-experience/SKILL.md
```

The saved stash is commit `def8b87931c6377933802421f29733668ca37767`.
Review the recovery guide before applying it; it predates the current website.

The Archive snapshot is 582,818,753 bytes in LFS, with SHA-256
`f4b549862675b7bea8fb158b851aaac84c909d445753f964347c8ec22ca57be6`.
Its LFS pointer and manifest remain in the preserved commit. This cleanup does
not download, re-upload, or claim fresh verification of the large binary itself.

To recover the snapshot, create a separate recovery checkout at `ce5e19c`, then
use Git LFS for the path named in that commit's README. Do not merge its obsolete
website tree into main.

The intended final remote branch set is `main` plus `experiment/react-systems`.
Production files, canon, and uncommitted authoring work are not part of branch
deletion. Deleting a branch name does not delete commits reachable from the
remaining branches.
