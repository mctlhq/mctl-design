## Summary

<!-- What does this PR do and why? -->

## Test plan

- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes
- [ ] `pnpm build:storybook` passes
- [ ] `pnpm check:versions` passes (lockstep versions)
- [ ] `pnpm check:token-version` passes (a token or generator change bumps the version — ui.mctl.ai serves `/<version>/mctl.css` immutable)
- [ ] No already-published `apps/storybook/public/<version>/` directory is edited, moved or deleted — supersede it with a new version instead
- [ ] Generated CSS under `apps/storybook/public` is committed, including the new `<version>/` directory
- [ ] Storybook stories added/updated for any component change

## Notes

- [ ] No design values hard-coded outside `@mctlhq/tokens`
- [ ] Package exports / peerDependencies updated if the public API changed
