# SiNE Archives — React experiment

Branch: `experiment/react-systems`. The live Astro website remains on `main`.

This is the beginning of a new, standalone React website. Systems is the first
experience: select Redactory, Divination, or Bloom, then follow Redactory into
its Anchor explanation without leaving the interface. React owns the UI and
history subscription; GSAP/Flip coordinates spatial changes. Plain CSS preserves
the archive's established palette and typography.

## Start

Use Node 22 and npm:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5174, or use `Start-React-Systems.cmd` on Windows.
The interface supports English and Portuguese, keyboard navigation, browser
Back/Forward, direct links, phone layouts, and reduced motion.

## Validate

```sh
npm run check
npm run build
npm run test:react
```

The React source is in `react-site/`. The old Astro source, public articles,
canon, and media are preserved for gradual migration. Existing package versions
and the npm lockfile are reused; no new package is introduced. The old application
has explicit `legacy:dev`, `legacy:check`, `legacy:build`, `legacy:preview`,
and `legacy:test` commands. The new default build writes `dist-react/`.

Read [the experiment guide](docs/experiments/react-systems.md) for ownership,
content sources, routes, and migration boundaries. The [branch cleanup record](docs/experiments/branch-cleanup-2026-11-23.md)
explains what was retired and how the old recovery history remains accessible.

Keep this branch separate from production. Experimental commits use
`[CF-Pages-Skip]` to prevent a Cloudflare Pages build. Nothing here authorizes
changes to hosting, DNS, credentials, or production deployment.
