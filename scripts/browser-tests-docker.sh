#!/usr/bin/env bash
# Run the Storybook browser tests (a11y + visual) in the pinned Playwright
# image, on a copy of this checkout. Screenshot baselines are only valid from
# that image: font rasterisation differs between machines, so a baseline taken
# on a laptop fails in CI. CI runs this same script.
#
#   scripts/browser-tests-docker.sh            run the tests
#   scripts/browser-tests-docker.sh --update   rewrite the visual baselines
#
# Keep IMAGE in step with the exact @playwright/test version in
# apps/storybook/package.json.
set -euo pipefail

IMAGE=mcr.microsoft.com/playwright:v1.64.1-noble
root=$(git rev-parse --show-toplevel)
app=apps/storybook
shots=$app/visual/__screenshots__
update=""
if [ "${1:-}" = "--update" ]; then update=1; fi

# No bind mounts: the tree goes in on stdin and results come back with
# docker cp, so this works on engines that share no host paths (colima,
# remote daemons) and never touches the host's node_modules, which may be
# built for another OS. Tracked and new files only, so nothing ignored
# (node_modules, dist, storybook-static) is copied.
cid=$(docker create -i --ipc=host -e CI -e UPDATE="$update" -e SHOTS="$shots" "$IMAGE" bash -euo pipefail -c '
  mkdir /work && tar -C /work -xf - && cd /work
  corepack enable
  CI=1 pnpm install --frozen-lockfile
  pnpm build
  pnpm build:storybook
  if [ -n "$UPDATE" ]; then
    # Baselines only: the a11y run has nothing to update. Start from none,
    # so a renamed or deleted story leaves no orphan PNG behind.
    rm -rf "$SHOTS"
    pnpm --filter @mctlhq/storybook exec playwright test --update-snapshots=all
  else
    pnpm --filter @mctlhq/storybook test:browser
  fi
')
trap 'docker rm -f "$cid" >/dev/null' EXIT

status=0
(cd "$root" && git ls-files -co --exclude-standard | while IFS= read -r f; do
  [ -e "$f" ] && printf '%s\n' "$f"
done | COPYFILE_DISABLE=1 tar -cf - -T -) | docker start -ai "$cid" || status=$?

# The diff images and report, for a failing run (CI uploads them).
rm -rf "${root:?}/$app/test-results" "${root:?}/$app/playwright-report"
docker cp "$cid:/work/$app/test-results" "$root/$app/" 2>/dev/null || true
docker cp "$cid:/work/$app/playwright-report" "$root/$app/" 2>/dev/null || true

if [ -n "$update" ] && [ "$status" = 0 ]; then
  rm -rf "${root:?}/$shots"
  docker cp "$cid:/work/$shots" "$root/$shots"
fi
exit "$status"
