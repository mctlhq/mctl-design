# Claude Design sync notes

- Target project: "MCTL Design" (`projectId` in `config.json`). Tokens, CSS, fonts and one static reference card per component.
- The repo is Vue 3. The stock `/design-sync` converter targets React (it bundles against `window.React`), so it does NOT work here. Do not run its converter path; `"shape": "package"` in `config.json` only exists to pin the project id.
- Build the upload set with `pnpm build && pnpm build:design-sync` (writes `ds-bundle/`, gitignored). The script renders every `M*.stories.ts` with `@vue/server-renderer` and fails on any story it cannot render unless it is listed in `KNOWN_UNRENDERABLE` with a reason.
- Upload is done from Claude Code with the `DesignSync` tool (`finalize_plan` for the paths below, then `write_files` in 3 steps: sentinel `_ds_needs_recompile`, the files, the sentinel again). Writes: `components/**`, `tokens/**`, `fonts/**`, `brand/**`, `styles.css`, `README.md`.
- `styles.css` import order: `fonts/fonts.css`, `tokens.css`, `theme.css`, `global.css`, `site.css`, `prose.css`. `telegram.css` is shipped but deliberately not imported (it only defines `--tg-*`).
- Semantic variables exist only under `[data-theme]` / `[data-accent]`; `README.md` tells the design agent to set both on `<html>`.
- Fonts (Onest, JetBrains Mono, Instrument Serif; latin + cyrillic) are copied from `@fontsource` (OFL-1.1) at build time; the library itself loads them from Google Fonts.
- No `_ds_sync.json` anchor is written, so every sync re-uploads everything. Deletions of removed components are not automatic: list the remote files and delete the ones the new build does not contain.
