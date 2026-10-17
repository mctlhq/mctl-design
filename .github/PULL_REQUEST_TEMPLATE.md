## Summary

<!-- What does this PR do and why? -->

## Test plan

- [ ] `pnpm audit --audit-level low` reports nothing
- [ ] `pnpm lint` passes
- [ ] `pnpm format:check` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes (component contracts, axe, per-file coverage floor)
- [ ] `pnpm build` passes
- [ ] `pnpm build:storybook` passes
- [ ] `pnpm check:contrast` and `pnpm check:themes` pass (a new `KNOWN` entry is explained in the PR)
- [ ] `pnpm check:generated` and `pnpm check:component-tokens` pass
- [ ] `pnpm check:versions` passes (lockstep versions)
- [ ] `pnpm check:license` passes
- [ ] `pnpm check:token-version` passes (a token or generator change bumps the version — ui.mctl.ai serves `/<version>/mctl.css` immutable)
- [ ] No already-published `apps/storybook/public/<version>/` directory is edited, moved or deleted — supersede it with a new version instead (a genuine withdrawal needs an admin merge and a CDN purge)
- [ ] Root version is `X.Y.Z`, optionally `-prerelease`, with no build metadata — nginx serves no other shape
- [ ] Generated CSS under `apps/storybook/public` is committed, including the new `<version>/` directory
- [ ] Storybook stories added/updated for any component change

## Notes

- [ ] No design values hard-coded outside `@mctlhq/tokens`
- [ ] Package exports / peerDependencies updated if the public API changed
