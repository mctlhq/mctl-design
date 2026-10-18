# Changelog

All `@mctlhq/*` packages, the Docker image and the CDN sheets share one
version. Versions follow semver with no `v` prefix. `ui.mctl.ai/<version>/`
serves each version's CSS immutably as soon as it reaches `main`; the npm
packages are published to GitHub Packages when the version is tagged.

0.6.0 and 0.7.0 reached the CDN but were never tagged, so GitHub Packages
goes from 0.5.0 straight to 0.8.0. Their changes are listed under their own
headings below and are all included in 0.8.0.

## Unreleased

### Changed

- `MTable`, `MCodeBlock` and `MYamlBlock` are a tab stop only while their
  content overflows, measured with a `ResizeObserver`; one that fits no longer
  leaves an empty stop in the tab order. They still render focusable on the
  server and before hydration, and stay focusable where `ResizeObserver` is
  missing.

### Removed

- **Breaking:** `MTgSheet`'s plain `v-model` (`modelValue`), deprecated in
  0.13.0. Bind visibility with `v-model:open` (or `:open` /
  `@update:open`), as `MModal` does.

## 0.13.0 — 2026-10-18

### Added

- `@mctlhq/ui` exports each component's props type (`MButtonProps`,
  `MModalProps`, … one `M<Name>Props` per component), plus the item types the
  list props take: `MAccordionItem`, `MSelectOption` and `MTabsItem`, next to
  the existing `MTgTab`. Type-only: the built JavaScript and CSS are
  unchanged.
- `@mctlhq/ui` types its slots: the 16 components that take slots declare them
  with `defineSlots` and export the type as `M<Name>Slots` (`MFieldSlots`,
  `MTabsSlots`, …), so an IDE completes slot names and slot props (`MField`'s
  `id` / `describedBy` / `required`, `MTabs`' `active`, `MTooltip`'s `tipId`).
  Type-only.

### Changed

- `MInput`, `MTextarea`, `MSelect`, `MModal` and `MTgSheet` declare their
  v-model with `defineModel`, as `MTabs` and `MTgTabBar` already did. With a
  `v-model` nothing changes. Without one they now keep their own value, so an
  uncontrolled field works on its own. The v-model prop (`modelValue`, or
  `open` for `MModal` and `MTgSheet`) is now part of each component's exported props type,
  `MTabsProps` and `MTgTabBarProps` included.
- **Breaking for Vue 3.4 consumers:** `@mctlhq/ui` needs Vue 3.5 (peer
  `^3.5.0`, was `^3.4.0 || ^3.5.0`), so the release carrying this is a minor.
- Ids now number per Vue app (`useId()`), where they used to be unique across
  the runtime. A page mounting several Vue apps should set a distinct
  `app.config.idPrefix` on each; the Storybook preview does.
- The token and CSS sources are now Prettier-formatted like the rest of the
  repo. The published CSS differs from 0.12.1 only in whitespace (a few
  multi-line custom property values reflow).

### Deprecated

- `MTgSheet`'s plain `v-model` (`modelValue`): use `v-model:open`, the name
  `MModal` already uses, so both overlays bind the same way. The old binding
  keeps working in this release, with a dev-only warning, and is removed in
  the next minor. To migrate, replace `v-model="x"` with `v-model:open="x"`
  (or `:model-value` / `@update:model-value` with `:open` / `@update:open`).

### Fixed

- `MInput`, `MTextarea` and `MSelect` used without a `v-model` lost what the
  user typed or picked on the next re-render: the stale prop was written back
  over it. They keep it now.
- `MModal` and `MTgSheet` opened without a `v-model` (say `:open="true"` with no
  `@update:open` listener) could not be dismissed: Escape, the backdrop and
  the close button only emitted an event nothing heard. They close themselves
  now.
- `MTabs`, `MField`, `MTooltip` and `MAccordion` built their ids from the
  component instance uid, a process-wide counter, so a server render and the
  client numbered them differently and every `aria-*` / `for` reference broke
  on hydration. They now use `useId()`, which is stable across the two (the
  reason for the Vue 3.5 floor). `MModal` and `MTgSheet` had the same bug in
  their title ids (a module-level counter) and use `useId()` too.

## 0.12.1 — 2026-10-17

### Fixed

- `MModal` and `MTooltip` drew no shadow: they used `--mctl-shadow-overlay`,
  which nothing defines, so the declaration was invalid. They now use the
  theme-scoped `--shadow-overlay`. `check:component-tokens` now fails on any
  `var()` with no fallback whose name nothing defines.
- `telegram.css` and the `MTg*` components set their font through
  `var(--font-display)`, which only `theme.css` defines, so a Mini App
  loading `telegram.css` alone fell back to the browser default face.
  `telegram.css` now defines `--tg-font` (`--font-display` when present,
  otherwise the same Onest stack) and the components use it with that
  stack as a fallback. `check:component-tokens` now checks `MTg*` against
  `telegram.css` alone and the rest against `theme`/`global`/`prose`,
  ignores comments and `--x: var(--x)` re-exports, and scopes
  component-defined names to their own file.

## 0.12.0 — 2026-10-17

### Added

- `--control-focus-shadow-invalid`, the focus halo of an invalid field.
  `MInput`, `MSelect` and `MTextarea` used a literal at 22% while the valid
  halo is 20%; both are now 20% and both are overridable.
- `pnpm check:component-tokens`, run in CI: component styles may not carry
  a literal border or outline width, focus offset, fractional opacity,
  duration or z-index. `MTg*` components are exempt; their literals are
  `var()` fallbacks for Mini Apps that load only `telegram.css`.

### Changed

- `MAlert`'s accent stripe is `--mctl-border-width-thick` (2px, as on
  prose blockquotes) instead of a literal 3px.
- `MTabs` pulls the active tab over the list rule by the hairline token
  rather than a literal `-1px`, so the two stay aligned if it is overridden.

## 0.11.0 — 2026-10-17

### Added

- `layout.containerSm`, `containerMd` and `containerLg` (640, 960 and
  1280px; `--mctl-layout-container-{sm,md,lg}`), the widths `MPageLayout`
  and `MFooter` used as literals.

### Changed

- Components take their values from tokens instead of literals:
  hairline and thick borders, focus rings (`--focus-ring`,
  `--focus-ring-width`, `--focus-ring-offset`), the disabled opacity
  (`--mctl-opacity-disabled`, 0.45 everywhere; the form fields were 0.5)
  and `MPageLayout` / `MFooter` widths.
- `MInput`, `MSelect` and `MTextarea` use the documented `--control-bg`,
  `--control-border`, `--control-focus-shadow` and `--control-disabled-bg`.
  Fields now sit on the page background rather than the card colour, and
  the focus halo is 20% accent instead of 22%.
- `MModal`'s backdrop is `--overlay-scrim`, so it follows the theme (a
  light scrim under `data-theme="light"`) instead of 70% ink everywhere.
- `MTgOrderCard`, `MTgSheet` and `MTgTabBar` use the motion tokens, so
  their transitions honour `prefers-reduced-motion` when `theme.css` is
  loaded, and `MTgTabBar` uses `--mctl-z-index-sticky`. Each keeps a
  literal fallback for Mini Apps that load only `telegram.css`. The token
  timings are slightly shorter: the `MTgSheet` slide is 200ms (was 250ms)
  and the `MTgTabBar` colour change 120ms (was 150ms), fallbacks included.

## 0.10.0 — 2026-10-17

### Changed

- Browser floor: `@mctlhq/ui` is built for Chrome/Edge 111, Firefox 113
  and Safari 16.2, the versions the CSS already required for
  `color-mix()`. The JS target used to claim Chrome 87 and Safari 14. The
  README has a Browser support section. (#117)

### Fixed

- The theme sets `color-scheme` (`dark` by default, `light` under
  `data-theme="light"`), so native form controls, scrollbars and the page
  canvas follow it. A light host page importing `mctl.css` should set
  `data-theme="light"` on `<html>`. (#117)
- Motion durations (`--mctl-motion-duration-*`) drop to `0ms` under
  `prefers-reduced-motion: reduce`, so component transitions built on them
  stop animating. The Tailwind `duration-*` utilities (v3 preset and v4
  theme) read the same variables, with the token as fallback, so they stop
  too. (#117)
- `theme.css` no longer declares `--focus-ring`, `--site-header-bg` and
  `--site-header-border` twice; they are set once, with the other derived
  colours. (#117)
- `MTgOrderCard` activates on Space keyup after a keydown on the card,
  like a native button, rather than on keydown; Escape or leaving the card
  cancels the press. (#116)
- `MTgEmptyState`: the loading state is `role="status"` and the error state
  `role="alert"`, so both are announced; the emoji icons are replaced with
  stroke SVGs, and the loading pulse respects `prefers-reduced-motion`.
  (#116)

## 0.9.0 — 2026-10-17

### Added

- `MModal` and `MTgSheet`: an `ariaLabel` prop names the dialog when there
  is no visible title (defaults `'Dialog'` and `'Sheet'`). (#97)
- `MField` wires `MInput`, `MTextarea` and `MSelect` in its slot on its
  own: id, `aria-describedby`, `aria-invalid` and `aria-required`. Without
  `for`, the label points at the control's own `id`, or at a generated one.
  An explicit `aria-describedby` on the control still wins, and the slot
  props stay for other controls. (#113)
- `MSelect`: a `placeholder` prop, shown as a disabled empty option. (#113)
- `MNav`: an `ariaLabel` prop names the landmark (default `'Main'`). (#113)
- `MTable`: a `label` prop names the scroll region (default `'Table'`). (#113)

### Fixed

- Nested theme scopes: `data-theme` and `data-accent` now nest
  independently at any depth. `data-accent` inside `data-theme="light"` used
  to pick the dark palette, and a nested `data-theme` reset the accent to
  terracotta. `pnpm check:themes` resolves the cascade over the built sheet
  in CI. (#114)
- `MTgSheet` now behaves as the modal dialog it declared: Escape closes it,
  focus moves in and is trapped, returns to the opener on close, page scroll
  is locked and the rest of the page is inert. Its z-index moves from a
  fixed 400 to `--mctl-z-index-modal`. An app that relied on the sheet not
  trapping focus, not locking scroll or sitting under its dropdowns will see
  the change. (#97)
- `MModal`: named by its title via `aria-labelledby`; the scroll lock no
  longer shifts the layout; the page behind is inert; a drag between the
  dialog and the backdrop no longer closes it. Stacked modals and sheets can
  close in any order, and the one opened last paints on top. (#97)
- `MTooltip` meets WCAG 1.4.13: Escape hides it without moving focus (and
  does not also close a dialog around it), the pointer can move onto the
  bubble, and long text wraps instead of overflowing. (#111)
- `MModal` and `MTgSheet`: the focus trap skips controls with a negative
  `tabindex` or `visibility: hidden`, Escape that cancels IME composition no
  longer closes the dialog, and the z-index fallback without `mctl.css` is
  900, matching the token. `MTooltip`'s fallback is 800, also matching its
  token. (#112)
- `MAlert` is `role="alert"` only for `tone="bad"`; `info` and `warn` are
  `role="status"`, and `live="none"` renders a static notice. Before, every
  alert interrupted screen readers. (#113)
- `MCodeBlock`, `MYamlBlock` and `MTable` scroll regions are focusable, so
  keyboard users can scroll long lines and wide tables. (#113)

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
