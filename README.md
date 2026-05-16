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

## Consuming the packages

Packages are published to **GitHub Packages** under the `@mctlhq` scope.
Add an `.npmrc` to the consuming repo:

```
@mctlhq:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### VitePress

```ts
import '@mctlhq/css/theme.css';
import '@mctlhq/css/global.css';
import '@mctlhq/css/prose.css';
```

### Nuxt / Vue

```ts
import '@mctlhq/css/theme.css';
import '@mctlhq/css/global.css';
import { MButton } from '@mctlhq/ui';
```

### Tailwind

```ts
import mctlPreset from '@mctlhq/css/tailwind-preset';

export default {
  presets: [mctlPreset],
};
```

## License

Apache-2.0 — see [LICENSE](./LICENSE).
