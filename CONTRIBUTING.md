# Contributing to mctl-design

Thank you for your interest in contributing to the MCTL design system.

## Prerequisites

- **Node.js** 22.12+, the floor `vite` 7 requires (`^20.19.0 || >=22.12.0`);
  22.0-22.11 satisfies a bare `22` and then fails inside the build. That floor
  is `engines.node` in the root `package.json`. `.nvmrc` is a different
  question — the version this project is *developed* on — and holds a current
  22.x, so a contributor's machine matches CI (`node-version: 22`) and the
  published image (`node:22-alpine`) rather than sitting on the oldest release
  the floor permits.
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
knowingly open: esbuild `GHSA-g7r4-m6w7-qqqr`, which affects `>=0.27.3
<0.28.1`. `pnpm audit` reports it on four paths, all of them
`packages/css` / `packages/tokens` → `tsup@8.5.1` → `esbuild@0.27.7`, and
`tsup`'s latest release still pins `esbuild@^0.27.0`; closing it would mean
forcing 0.28 across a range `tsup` does not declare. The tree holds a second
copy, `esbuild@0.25.12` under `storybook`, which is outside the affected range
and is not what keeps this open. Raise the gate to `low` once `tsup` widens —
and re-read `pnpm audit`'s paths first, because the second copy is the one
that would make that assumption wrong for a future advisory.

## The vite toolchain

`vite`, `@vitejs/plugin-vue` and `vite-plugin-dts` are declared once in the
`catalog:` block of `pnpm-workspace.yaml`.

`vite` and `@vitejs/plugin-vue` are the shared ones — `packages/ui` and
`apps/storybook` both declared the same range and had to be kept in step by
hand, and the catalog makes the next major a one-line change. Add anything
else both of them consume here rather than to two manifests.

`vite-plugin-dts` has a single consumer (`packages/ui`) and is catalogued
anyway, so the whole vite toolchain and the reason each version is where it is
live in one file — in particular the note explaining why it is held at 4.x.

`packages/ui` also pins `build.target` explicitly rather than taking vite's
default, so the published browser floor of `@mctlhq/ui` does not move when
vite changes that default. It is currently the pre-vite-7 floor
(`es2020, chrome87, edge88, firefox78, safari14`); raising it is a deliberate
change, not an upgrade side effect.
