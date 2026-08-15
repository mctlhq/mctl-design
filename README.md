# mctl-design

The shared **MCTL design system** — design tokens, CSS themes, a Tailwind
preset, and Vue 3 UI components, plus a Storybook showcase deployed at
[ui.mctl.ai](https://ui.mctl.ai).

## Packages

| Package | Description | Framework |
|---|---|---|
| `@mctlhq/tokens` | Design tokens — colors, surfaces, accents, typography, spacing | agnostic |
| `@mctlhq/css` | CSS variables, global styles, prose styles, Tailwind preset | agnostic |
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

## Consuming

**CSS — CDN (preferred).** Tokens and the semantic theme ship with Storybook
and update on every merge to `main`. No npm tag, no GitHub Packages token.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://ui.mctl.ai/mctl.css">
<link rel="stylesheet" href="https://ui.mctl.ai/global.css">
<!-- docs / markdown only: https://ui.mctl.ai/prose.css -->
```

Flip surface and accent with `data-theme` (`dark` | `light`) and optional
`data-accent` (`terracotta` default | `cyan` | `lime` | `lilac`). Omit
`data-accent` to follow the CDN default.

Allow `https://ui.mctl.ai` in `style-src` and `https://fonts.gstatic.com` in
`font-src` if the app ships a CSP.

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

**Tailwind preset — npm** (`@mctlhq/css/tailwind-preset`), same registry.
`@mctlhq/css` theme/global/prose CSS remains published for offline or
air-gapped builds; prefer the CDN for product apps.

## Components

`@mctlhq/ui` ships these Vue 3 components (see the
[Storybook showcase](https://ui.mctl.ai) for live examples and props):

- **Layout & structure** — `MPageLayout`, `MNav`, `MFooter`, `MCard`
- **Forms** — `MField`, `MInput`, `MTextarea`, `MSelect`, `MButton`
- **Disclosure & overlay** — `MTabs`, `MAccordion`, `MTooltip`, `MModal`
- **Data & status** — `MTable`, `MStat`, `MBadge`, `MPill`, `MAlert`
- **Content** — `MCodeBlock`, `MYamlBlock`, `MStepCard`, `MSpecCard`

## License

Apache-2.0 — see [LICENSE](./LICENSE).
