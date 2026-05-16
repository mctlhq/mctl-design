# Contributing to mctl-design

Thank you for your interest in contributing to the MCTL design system.

## Prerequisites

- **Node.js** v22+ (`.nvmrc` pins the version)
- **pnpm** via Corepack (`corepack enable`)
- **Git**

## Local development

```bash
corepack enable
pnpm install
pnpm dev              # Storybook in watch mode
pnpm build            # build all packages
pnpm build:storybook  # static showcase
pnpm lint
pnpm typecheck
pnpm check:versions
```

## Branch strategy

- `main` is always deployable.
- Feature branches: `feat/description` or `fix/description`.
- Merge commits, no squash — `gh pr merge <N> --merge --delete-branch`.

## Commit conventions

Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`,
`ci:`. Subject line under 72 characters. The body explains *why*, not *what*.

## Versioning

All published packages are versioned lockstep with the repository. To cut a
release, bump the version in **every** `package.json` (root + each package) to
the same `X.Y.Z`, then tag `X.Y.Z` (no `v` prefix). `pnpm check:versions` is
enforced in CI and before publish.

## Adding a component

1. Create `packages/ui/src/components/M<Name>.vue` (Vue 3 SFC).
2. Export it from `packages/ui/src/index.ts`.
3. Add a story under `apps/storybook/stories/`.
4. Components are prefixed `M` to avoid collisions in Nuxt/VitePress.

## Pull requests

Non-trivial PRs are reviewed automatically. Address every P1/P2 finding before
merge; CI must be green.
