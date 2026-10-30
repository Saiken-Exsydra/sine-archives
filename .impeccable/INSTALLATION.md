# Project-local Impeccable

Installed using the official npm package `impeccable@4.8.0`, provider `codex`, scope `project`. Skill version 4.8.0; bundled engine release 0.1.18 (these are distinct version labels). Node requirement: >=18.19.0; tested here with Node 22.23.2 and npm 10.9.8.

The unmodified compiled skill, references, launcher, engine checksums and data are tracked under `.agents/skills/impeccable/`; the upstream Apache-2.0 license is retained at `.impeccable/LICENSE` (outside the installer-replaced skill directory). Generated Windows engine binaries, hook consent, caches, reports and sessions are ignored. No runtime package is added to package.json or its lockfile.

Run `Setup-Visual-Design-Lab.cmd` from a fresh checkout to restore the platform engine through the pinned official installer. The launcher can also download its checksum-verified engine on first use. Do not commit binaries or private trust/consent state. Review any installer changes to the tracked skill/hook manifest before committing updates.

`PRODUCT.md` follows init's product-schema 1. `DESIGN.md` merges the prior lab brief into document's canonical token frontmatter/eight sections. `.impeccable/design.json` follows document's schemaVersion 2, with extensions and self-contained previews drawn from actual source; it does not duplicate primitive tokens. `docs/design-system.md` remains the visual authority.

Official workflow: https://impeccable.style/tutorials/getting-started/ ; https://impeccable.style/docs/hooks/ ; https://github.com/pbakaus/impeccable .

Codex trust is deliberately not automated: project-local hooks require a trusted project and review of their exact definitions in Settings → Hooks or CLI `/hooks`. Impeccable's `hooks status` enabled state alone does not prove Codex dispatch. Normal agent/browser iteration is prepared; Impeccable Live Mode's optional browser injection/helper server is not enabled and has not been tested here.

`.gitattributes` keeps vendored source at LF, Windows launchers at CRLF, and exempts only the unmodified upstream skill from trailing-whitespace checks. Site source formatting is unaffected.
