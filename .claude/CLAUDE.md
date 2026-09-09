# mctl-design

The shared MCTL design system: design tokens, CSS, Tailwind preset, and Vue 3
components, plus a Storybook showcase served at `ui.mctl.ai`.

## Stack
- pnpm workspaces + Turborepo monorepo, TypeScript, Node 22
- `@mctlhq/tokens` — design tokens (framework-agnostic)
- `@mctlhq/css` — CSS variables, global/prose styles, Tailwind preset (agnostic)
- `@mctlhq/ui` — Vue 3 component library (SFCs, `M`-prefixed)
- `apps/storybook` — Storybook (Vue 3 + Vite), static build to nginx image

## Conventions
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `ci:`
- Subject line under 72 characters; body explains WHY
- Semver tags, NO `v` prefix (`0.1.0`, not `v0.1.0`)
- Lockstep versioning: root + all package versions + image tag share one `X.Y.Z`
- `pnpm check:versions` must pass
- Components prefixed `M` (`MButton`, `MBadge`) to avoid collisions in consumers
- No emoji in code or commit messages unless explicitly requested
- English for all code, comments, documentation
- Prefer editing existing files over creating new ones

## Build & deploy
- CI (`ci.yml`) runs PR validation only: install, audit, lint, typecheck, build, build:storybook, check:versions, generated-CSS-is-committed, check:token-version
- `ui.mctl.ai` serves `/<version>/{mctl,global,prose}.css` immutable for a year while `/mctl.css` floats with `main`. The versioned copies are committed under `apps/storybook/public/<version>/` — a build only writes its own version, so an uncommitted directory 404s at the next release. `check:token-version` blocks a change under `packages/{tokens,css}/{src,scripts}` that does not bump the root version, a root version that moves backwards, and any edit, `git mv` or `git rm` of a version directory already on `main`.
- Docker image is built centrally via mctl-gitops, not in this repo's CI
- `publish.yml` publishes `@mctlhq/*` to GitHub Packages on a semver tag
- Design source of truth: the MCTL landing design spec (color system, typography, layout)
