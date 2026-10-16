# mctl-design

The shared **MCTL design system** — design tokens, CSS themes, a Tailwind
preset, and Vue 3 UI components, plus a Storybook showcase deployed at
[ui.mctl.ai](https://ui.mctl.ai).

## Packages

| Package | Description | Framework |
|---|---|---|
| `@mctlhq/tokens` | Design tokens — colors, surfaces, accents, typography, spacing (TS, CSS, JSON, DTCG) | agnostic |
| `@mctlhq/css` | CSS variables, global styles, prose styles, Tailwind v3 preset and v4 theme | agnostic |
| `@mctlhq/ui` | Vue 3 component library | Vue 3 |

`@mctlhq/tokens` and `@mctlhq/css` are framework-agnostic and can be consumed
by any frontend. `@mctlhq/ui` ships Vue 3 SFCs — consumable from Nuxt/Vue and
VitePress.

## Repository layout

```
packages/tokens   @mctlhq/tokens
packages/css      @mctlhq/css
packages/ui       @mctlhq/ui
apps/storybook    component showcase -> static build -> ui.mctl.ai
```

Monorepo managed with **pnpm workspaces** + **Turborepo**. Node 22.

## Development

Requirements: Node 22+ and pnpm (enabled via `corepack`).

```bash
corepack enable
pnpm install
pnpm build            # build all packages
pnpm build:storybook  # build the static showcase
pnpm dev              # run Storybook in watch mode
```

## Versioning

All published packages and the Docker image are versioned **lockstep** with the
repository: a single semver tag `X.Y.Z` (no `v` prefix). `pnpm check:versions`
fails the build if any package version drifts from the root.

**Changing a token or the theme layer requires a version bump.** `ui.mctl.ai`
serves `/<version>/mctl.css` with a one-year immutable cache, and it deploys on
every merge to `main` rather than on a tag — so two different sheets under one
version would be permanently cached by consumers who can never refresh them.
`pnpm check:token-version` fails any pull request that touches
`packages/tokens/src`, `packages/css/src`, or either package's `scripts/`
directory — `gen-assets.mjs` and `build-css.mjs` produce the bytes just as much
as the sources do — without moving the root version, and refuses a version that
moves backwards. It also refuses any diff that touches a version directory already on `main` — by edit, `git rm` or `git mv` — so a published sheet can only be superseded, never changed or removed. That second rule is what makes the pinned path in the table below actually never move. It also refuses a root version that is not `X.Y.Z` with an optional `-prerelease` suffix: `build-css.mjs` writes the directory verbatim while nginx matches only that shape, so anything else would be served without CORS and never frozen.

Withdrawing published bytes — a sheet built from the wrong branch, a token file that briefly carried something it should not have — is deliberately not something CI will do for you. Superseding leaves the old URL serving the bad bytes for a year to everyone already pinned, so a real removal takes an admin merge past the check and a CDN purge, on purpose.
Everything else — Storybook, docs, components that do not feed `theme.css` —
lands without one.

## Consuming

There are three supported ways to consume the CSS, and they differ only in what
moves under you.

| Path | Moves when | Use for |
|---|---|---|
| `https://ui.mctl.ai/0.7.0/{mctl,global,prose}.css` | never | anything shipped to users |
| `https://ui.mctl.ai/{mctl,global,prose}.css` | every merge to `main` | previews, internal tools, seeing a token change land |
| `@mctlhq/css` on GitHub Packages | on a semver tag | builds that already have a Packages token |

All three sheets are versioned together. Pinning `mctl.css` alone leaves
`global.css` — body typography and base element styles — floating, which is
pinned in name only.

Each sheet names its own version on line 1 (`/* @mctlhq/css 0.7.0 … */`), so a
vendored copy records what it was taken from and a mismatch shows up in a diff.

**CSS — CDN, pinned (preferred).** No npm tag, no GitHub Packages token.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://ui.mctl.ai/0.7.0/mctl.css">
<link rel="stylesheet" href="https://ui.mctl.ai/0.7.0/global.css">
<!-- docs / markdown only: https://ui.mctl.ai/0.7.0/prose.css -->
```

Bumping to a new version is then a one-line edit made on purpose, not something
that happens to a product page four hours after an unrelated merge. The
unversioned `https://ui.mctl.ai/mctl.css` still works and still floats with
`main` — use it where you want the change, not where you want the pin.

Flip surface and accent with `data-theme` (`dark` | `light`) and optional
`data-accent` (`terracotta` default | `cyan` | `lime` | `lilac`). Omit
`data-accent` to follow the CDN default.

Allow `https://ui.mctl.ai` in `style-src`, `img-src` (favicons and marks),
and `https://fonts.gstatic.com` in `font-src` if the app ships a CSP.

**Brand marks — CDN.** Same pipeline as `mctl.css`. Do not vendor copies;
one change here updates every product after the SHA deploy.

| URL | Use |
|---|---|
| `https://ui.mctl.ai/brand/hex.svg` | Hex mark, `currentColor`. Inline or CSS mask. |
| `https://ui.mctl.ai/brand/favicon.svg` | Baked terracotta hex (default). |
| `https://ui.mctl.ai/brand/sidebar-dark.svg` | Manager wordmark (dark chrome). |
| `https://ui.mctl.ai/brand/sidebar-light.svg` | Manager wordmark (light chrome). |
| `https://ui.mctl.ai/brand/favicon-docs.svg` | Docs tab (D) |
| `https://ui.mctl.ai/brand/favicon-web.svg` | Landing tab (W) |
| `https://ui.mctl.ai/brand/favicon-academy.svg` | Academy tab (A) |
| `https://ui.mctl.ai/brand/favicon-telegram.svg` | Telegram tab (T) |
| `https://ui.mctl.ai/brand/favicon-portal.svg` | Portal tab (P) |

Favicons cannot use CSS `currentColor`; the `/brand/favicon*.svg` files bake
terracotta (`#e25a3c` dark / `#b83d28` light). Use a **letter variant** in
`<link rel="icon">` so browser tabs are distinguishable; use the plain hex
or `MLogo` in-app.

```html
<link rel="icon" type="image/svg+xml" href="https://ui.mctl.ai/brand/favicon-docs.svg">
```

**Vue components — npm.** `@mctlhq/ui` is still a GitHub Packages package
(SFCs cannot ship from the CSS CDN). Add an `.npmrc`:

```
@mctlhq:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```ts
import '@mctlhq/ui/style.css';
import { MButton } from '@mctlhq/ui';
```

**Tailwind — npm**, same registry. Tailwind v3 takes the JS preset
(`@mctlhq/css/tailwind-preset`). Tailwind v4 is configured in CSS, so it takes
a theme sheet instead, imported after `theme.css`:

```css
@import "tailwindcss";
@import "@mctlhq/css/theme.css";
@import "@mctlhq/css/tailwind.css";
```

Utility names match the v3 preset (`bg-surface-card`, `text-accent`,
`font-mono`, `shadow-md`, `text-hero`), and opacity modifiers on the
theme-aware colours (`bg-accent/50`) work. The differences, all deliberate:

| v3 preset | Tailwind v4 | Why |
| --- | --- | --- |
| `p-5`, `p-10` … (MCTL scale) | `p-mctl-5`, `p-mctl-10` … | keeps Tailwind's own numeric spacing intact |
| `max-w-page` | `max-w-pagew` | in v4 `max-w-page` resolves to the page padding |
| `max-w-prose` | `max-w-(--container-prose)` | `max-w-prose` is Tailwind's built-in 65ch |
| `divide-y-hairline` … (divide width) | `divide-y-(length:--mctl-border-width-hairline)`; `divide-y-none` is `divide-y-0` | v4 divide widths take a number or a variable, not a named key |
| `bg-ink/disabled` … (opacity key as modifier) | `bg-ink/45` (the token × 100) | v4 modifiers take a number, not a named key; the `--mctl-opacity-*` tokens are unitless, so `bg-ink/(--mctl-opacity-disabled)` would produce an invalid `color-mix()` |

`duration-*`, `opacity-*`, `border-hairline` / `border-thick` (with the
per-side `border-b-hairline` … forms) and `outline-focus` /
`outline-offset-focus` keep their v3 names (emitted as `@utility`, since v4
has no theme namespace for them). `border-none` is
Tailwind's own, which sets `border-style: none` rather than a zero width.
`outline-focus` also sets a `solid` style, as Tailwind's `outline-2` does, so
unlike its v3 namesake it draws without a separate `outline` style utility.

`pnpm check:generated` compiles every v3 preset key against the v4 sheet and
fails on one that neither works nor appears in this table.

`@mctlhq/css` theme/global/prose CSS remains published for offline or
air-gapped builds; prefer the CDN for product apps.

**Tokens for design tools — npm.** `@mctlhq/tokens/tokens.dtcg.json` is the
token tree in the W3C Design Tokens (DTCG 2025.10) format, readable by Style
Dictionary, Terrazzo and Tokens Studio / Figma. Semantic colours are aliases
(`surface.dark.bg` is `{color.ink}`), not copies. Values the format has no
type for — `clamp()` sizes, `em` letter spacing — keep their CSS text and are
marked `$extensions["ai.mctl"].css`.

## Components

`@mctlhq/ui` ships these Vue 3 components (see the
[Storybook showcase](https://ui.mctl.ai) for live examples and props):

- **Brand** — `MLogo` (token-aware hex; see also the CDN kit above)
- **Layout & structure** — `MPageLayout`, `MNav`, `MFooter`, `MCard`
- **Forms** — `MField`, `MInput`, `MTextarea`, `MSelect`, `MButton`
- **Disclosure & overlay** — `MTabs`, `MAccordion`, `MTooltip`, `MModal`
- **Data & status** — `MTable`, `MStat`, `MBadge`, `MPill`, `MAlert`
- **Content** — `MCodeBlock`, `MYamlBlock`, `MStepCard`, `MSpecCard`

## Public site shell

Landing and documentation adapters consume the `--site-*` variables from the
same pinned `mctl.css`. Header height is 80px, content width 1400px and gutters
20px. Wordmarks use Onest 800 at 24px with 2px tracking; navigation uses Onest
500 at 0.95rem. Load Onest through weight 800 in each consumer. The header uses
the semantic surface at 80% opacity, a neutral divider and 12px backdrop blur.
Adapters own framework-specific sidebar and mobile positioning. These tokens
are additive; they do not change existing component layout automatically.

The CSS interface is `--site-header-{height,bg,blur,border}`,
`--site-content-width`, `--site-gutter`,
`--site-wordmark-{size,weight,tracking,accent-gap}` and
`--site-nav-{size,weight}`.

## License

Apache-2.0 — see [LICENSE](./LICENSE).

## Public typography and state colors

The public sites pin the same version of `mctl.css`. Families are `--font-display`
(Onest), `--font-mono` (JetBrains Mono), and optional `--font-editorial`
(Instrument Serif). Public roles expose `--text-<role>-size`, `-weight`,
`-leading`, and `-tracking`: hero, docs-hero, section, title, subtitle, body,
small, caption, micro, label, marker, code, prose, prose-title, prose-section,
and prose-subsection. Existing product/editorial recipes remain unchanged.

Use the prose roles for articles (16px/1.75); do not apply the marketing hero
scale to documentation headings. Adapters retain engine-specific article
width, sidebar, table overflow and mobile navigation.

Forms use `--control-bg`, `--control-disabled-bg`, `--control-border`, and
`--control-focus-shadow`. Feedback uses `--status-{ok,warn,bad}-soft` with the
matching foreground. Overlays use `--overlay-scrim` and `--shadow-overlay`;
public background grids use `--site-grid-line`. Derived colors recompute at
scoped theme/accent boundaries. See **Foundations/Public Sites** and
**Foundations/Typography** in Storybook for both themes and the complete scale.
