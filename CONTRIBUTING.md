# Contributing to mctl-design

Thank you for your interest in contributing to the MCTL design system.

## Prerequisites

- **Node.js** 22.18+ (or 24.11+, or 26+): the range `tsup` 9 requires
  (`^22.18.0 || ^24.11.0 || >=26.0.0`), which is narrower than `vite` 7's
  (`^20.19.0 || >=22.12.0`). An older 22.x satisfies a bare `22` and then fails
  inside the build. That range is `engines.node` in the root `package.json`. `.nvmrc` is a different
  question — the version this project is _developed_ on — and holds a current
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
pnpm format           # prettier --write; CI runs pnpm format:check
pnpm typecheck
pnpm test             # component contracts + axe (packages/ui, vitest + jsdom)
pnpm check:versions
pnpm check:contrast        # text/background pairs per theme and accent meet
                           # WCAG AA (run after pnpm build)
pnpm check:themes          # data-theme and data-accent nest independently at
                           # any depth (run after pnpm build)
pnpm check:themes:selftest # the check still fails a sheet with the 0.8.0 bug
pnpm check:generated       # tailwind.css and tokens.dtcg.json are internally
                           # consistent (run after pnpm build)
pnpm check:license         # README's License section still links to LICENSE,
                           # and every package.json license field matches
pnpm check:token-version   # a token or generator change needs a version bump,
                           # a published <version>/ directory cannot be touched,
                           # and the root version must be X.Y.Z(-prerelease)
```

## Branch strategy

- `main` is always deployable.
- Feature branches: `feat/description` or `fix/description`.
- Merge commits, no squash — `gh pr merge <N> --merge --delete-branch`.

## Commit conventions

Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`,
`ci:`. Subject line under 72 characters. The body explains _why_, not _what_.

## Versioning

All published packages are versioned lockstep with the repository. To cut a
release, bump the version in **every** `package.json` (root + each package) to
the same `X.Y.Z`, add a `## X.Y.Z` entry to `CHANGELOG.md` (`check:versions`
fails in CI without one), then tag `X.Y.Z` (no `v` prefix) on `main`. The tag publishes the packages to GitHub Packages; a
prerelease tag such as `0.9.0-rc.1` publishes under the `next` dist-tag.
`pnpm check:versions` is enforced in CI and before publish.

`ui.mctl.ai` serves a version's CSS as soon as it reaches `main`, before any
tag, so tag every version that changes `packages/{tokens,css}` — otherwise
npm consumers fall behind the CDN.

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

| Override                      | Closes                                                    |
| ----------------------------- | --------------------------------------------------------- |
| `@vitest/mocker@3`            | path traversal / arbitrary file read, GHSA-82fw-gwwq-j7x9 |
| `brace-expansion@1` `@2` `@5` | ReDoS, GHSA lines on all three majors                     |
| `fast-uri@3`                  | ReDoS in URI parsing                                      |
| `js-yaml@4`                   | prototype pollution / DoS                                 |
| `nanoid@3`                    | predictable IDs on non-integer input                      |
| `postcss@8`                   | parsing DoS                                               |
| `ws@8`                        | DoS on excessive headers                                  |

Every selector is scoped to a major (`pkg@N`). Do not add an unscoped or
open-ended key: an override applies to _every_ version line that matches, so
`"ws": "^8.21.0"` would silently clamp a future `ws@9` down to 8.x in a parent
that was never tested against it.

`@vitest/mocker@3` is the one key that resolves _across_ a major, and that is
deliberate rather than an oversight. GHSA-82fw-gwwq-j7x9 covers `>=2.1.0
<4.1.11` and was never backported — 3.2.7, the newest 3.x, is still inside the
range — so there is no in-major fix to point at. The parent is the `storybook` core
package (the lockfile lists `@vitest/mocker` in _its_ dependencies, not
`@storybook/builder-vite`'s), which is a devDependency: it does not reach the
published packages, and the nginx image ships static output with no Node
runtime at all. Drop the key once Storybook widens on its own — the scoping
rule is about not clamping a future line _down_, which this does not do.

The override does leave a version skew inside Storybook's test stack:
`storybook@9.1.21` keeps `@vitest/expect@3.2.4` and `@vitest/spy@3.2.4`, while
`@vitest/mocker@4.1.11` brings its own `@vitest/spy@4.1.11`, so a mocked module
would be spied by v4 and asserted by a v3 `expect`. That is safe here for one
reason only, and it is not that the build passes: **nothing in this repo
exercises the mocking path.** There are no `play` functions, no `storybook/test`
import and no `@storybook/addon-vitest`. The `Test` step in `ci.yml` runs
`packages/ui`'s own `vitest` (a direct devDependency, already on 4.x) and does
not load Storybook's test stack. If any of the Storybook pieces arrive,
re-check this key before trusting it.

CI runs `pnpm audit --audit-level low` as a gate, so a transitive bump
that reintroduces one of these advisories fails the pull request rather than
filing an alert after merge.

It gates at `low` because nothing is knowingly open. The last low advisory,
esbuild `GHSA-g7r4-m6w7-qqqr` (`>=0.27.3 <0.28.1`), reached the tree only
through `tsup@8` → `esbuild@0.27.x`; `tsup@9` depends on `esbuild@^0.28.2` and
closed it. The tree still holds a second copy, `esbuild@0.25.12` under
`storybook` / `vite`, which is outside that range — re-read `pnpm audit`'s
paths before assuming a future esbuild advisory comes from one copy only. If an
advisory has to stay open, lower the gate to one level above it and record the
reason here rather than ignoring it.

### Audit exceptions

There are no ignored advisories. `sprintf-js` and its API Extractor dependency
chain were removed by replacing `vite-plugin-dts` with `vue-tsc` declaration
emission followed by `rollup-plugin-dts` bundling. The published UI entry still
contains the component declarations rather than references to unshipped files.
`tsup` does not use its optional API Extractor peer for the tokens/CSS builds.

## tailwindcss in @mctlhq/css

`@mctlhq/css` keeps a `tailwindcss` devDependency only for the type behind
`satisfies Partial<Config>` in `src/tailwind-preset.ts`, the one check on the
preset's shape. The peer is `^3.4.0 || ^4.0.0` -- v3 consumers take the JS
preset, v4 consumers take `tailwind.css` -- but the preset itself is a v3
preset, and the devDependency is on 4: installing tailwindcss 3 brings
`braces@3`, whose advisory
(GHSA-vfj7-8cjw-p6xm, `<= 3.0.3`) has no patched release. v4 still exports
`Config` as its legacy JS-config type (`UserConfig`, kept for `@config`), the
v3 shape, so the check still runs, but against v4's copy: a key v4 accepts
and v3 does not would typecheck here and be wrong for a v3 consumer. The built
preset does not reference `tailwindcss`, so the published bytes do not depend
on which major was installed.

## The vite toolchain

`vite` and `@vitejs/plugin-vue` are declared once in the
`catalog:` block of `pnpm-workspace.yaml`.

`vite` and `@vitejs/plugin-vue` are the shared ones — `packages/ui` and
`apps/storybook` both declared the same range and had to be kept in step by
hand, and the catalog makes the next major a one-line change. Add anything
else both of them consume here rather than to two manifests.

`packages/ui` also pins `build.target` explicitly rather than taking vite's
default, so the published browser floor of `@mctlhq/ui` does not move when
vite changes that default. It is currently the pre-vite-7 floor
(`es2020, chrome87, edge88, firefox78, safari14`); raising it is a deliberate
change, not an upgrade side effect.
