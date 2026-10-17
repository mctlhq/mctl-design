# Changelog

All `@mctlhq/*` packages, the Docker image and the CDN sheets share one
version. Versions follow semver with no `v` prefix. `ui.mctl.ai/<version>/`
serves each version's CSS immutably as soon as it reaches `main`; the npm
packages are published to GitHub Packages when the version is tagged.

0.6.0 and 0.7.0 reached the CDN but were never tagged, so GitHub Packages
goes from 0.5.0 straight to 0.8.0. Their changes are listed under their own
headings below and are all included in 0.8.0.

## 0.8.0 — 2026-10-17

### Added
- Tailwind preset and v4 theme: `font-extrabold` from the token scale, and
  `h-site-header`, which follows `--site-header-height` so it tracks a
  shell override. (#92)

### Fixed
- `MTabs`: arrow keys, Home and End keep roving when the parent applies
  `v-model` asynchronously (for example a router push), and focus stays on
  the selected tab when tab values repeat. `Tab.value` is documented as
  unique. (#92)
- `check:generated` checks every `var()` in the v4 sheet, fails if no
  emitted `@theme` declaration was parsed, and asserts that `duration-base`
  sets `transition-duration`. (#92)
- README: a nested theme scope must set `data-theme` and `data-accent` on
  the same element. (#92)

### Changed
- Development toolchain: tsup 9 (closes esbuild GHSA-g7r4-m6w7-qqqr),
  turbo 2.11, prettier 3.9, typescript-eslint 8.71, eslint 9.39. The
  `pnpm audit` gate is now `low`. The supported Node range for working on
  the repo is `^22.18.0 || ^24.11.0 || >=26.0.0`. Consumers are not
  affected. (#94)

## 0.7.0 — 2026-10-16 (CDN only)

### Added
- Tailwind v4 theme at `@mctlhq/css/tailwind.css`, at parity with the v3
  preset and checked by `pnpm check:generated`. The README lists the few
  deliberate naming differences. (#90)
- Design tokens in the W3C DTCG 2025.10 format at
  `@mctlhq/tokens/tokens.dtcg.json`, with semantic colours as aliases. (#90)
- Theme-aware syntax colours (`--syntax-*`, dark and light). (#90)

### Fixed
- `MTabs` works without `v-model`, uses index-based ids and keyboard roving,
  and renders no empty tablist. (#90)
- `MTgTabBar` is a `nav` landmark with `aria-current`. (#90)
- `MButton` defaults to `type="button"` and no longer submits forms by
  accident. When disabled it strips `href`, `to` and event handlers, and it
  accepts a component in `as`. (#90)
- Text colours that failed WCAG AA (fg3, paper subtle text, cyan, lime and
  status "deep" shades, syntax punctuation) were adjusted. (#90)

### Changed
- CI runs component tests with axe, a WCAG contrast check over every
  rendered pair and the generated-export checks. Deploys to ui.mctl.ai wait
  for green CI on `main`. (#90)
- tailwindcss 4 and eslint-plugin-vue 10 in development; the
  `tailwindcss` peer is `^3.4.0 || ^4.0.0`. (#91)
- UI declarations are built with vue-tsc and rollup-plugin-dts, which
  removes sprintf-js from the build. (#93)

## 0.6.0 — 2026-10-16 (CDN only)

### Added
- Public site shell tokens shared by the landing and documentation sites:
  header height, container width, gutters, wordmark and navigation
  typography. (#89)
- Public typography roles (marketing, UI, code, reading), Onest 800, and
  semantic control, status, overlay and grid colours, with examples under
  Foundations/Public Sites in Storybook. (#89)

## 0.5.0 and earlier

See the [tags](https://github.com/mctlhq/mctl-design/tags) and the git history.
