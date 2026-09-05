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

## Dependency overrides

`pnpm.overrides` in the root `package.json` forces patched versions of
transitive packages whose parents pin a range that still resolves to a
vulnerable one. Each key exists to close a specific advisory and should be
**removed once the parent widens its range far enough on its own** — check
with `pnpm why <package>` and drop the key if `pnpm install` still resolves at
or above the floor.

| Override | Closes |
| --- | --- |
| `brace-expansion@1` `@2` `@5` | ReDoS, GHSA lines on all three majors |
| `fast-uri@3` | ReDoS in URI parsing |
| `js-yaml@4` | prototype pollution / DoS |
| `nanoid@3` | predictable IDs on non-integer input |
| `postcss@8` | parsing DoS |
| `postcss-selector-parser@6` | uncontrolled AST recursion |
| `ws@8` | DoS on excessive headers |

Every selector is scoped to a major (`pkg@N`). Do not add an unscoped or
open-ended key: an override applies to *every* version line that matches, so
`"ws": "^8.21.0"` would silently clamp a future `ws@9` down to 8.x in a parent
that was never tested against it.

CI runs `pnpm audit --audit-level moderate` as a gate, so a transitive bump
that reintroduces one of these advisories fails the pull request rather than
filing an alert after merge.

It gates at `moderate` rather than `low` because exactly one low advisory is
knowingly open: esbuild `GHSA-g7r4-m6w7-qqqr`, reachable only through `tsup`,
whose latest release still pins `esbuild@^0.27.0`. Closing it would mean
forcing 0.28 across a range `tsup` does not declare. Raise the gate to `low`
once `tsup` widens.

## The vite toolchain

`vite`, `@vitejs/plugin-vue` and `vite-plugin-dts` are declared once in the
`catalog:` block of `pnpm-workspace.yaml` and referenced as `catalog:` from
`packages/ui` and `apps/storybook`. Both consumed the same range and had to be
kept in step by hand; the next major is a one-line change. Add anything else
both of them share to the catalog rather than to two manifests.
