# Web asset integrity contract (issue #210, epic mctlhq/.github#330)

Docs-only contract for the `web-asset-integrity-contract` item. It specifies how an immutable
design-system CSS release is identified, verified, consumed and rolled back on the six MCTL sites.

Status: the owner GO covers contract preparation only. This document does NOT authorize SRI
rollout, CI steps, GitOps changes, CSP changes, consumer edits or deployment. Enforcement waits for
the separately approved `web-contract-preview-assurance` phase (gate G3).

Related: epic mctlhq/.github#330, evidence `docs/evidence/web-contract-evidence.md` (#207, #208),
this issue #210. Requirements use RFC 2119 keywords. Specified requirements (what MUST hold) are
kept apart from evidence (what was observed on `0.20.2`).

Provenance legend (same as the evidence report): `[CODE]` pinned inspected source; `[CONFIG]`
GitOps desired state; `[LIVE]` HTTP or ArgoCD observation; `[PREVIEW]` isolated preview.
`unknown (not observed)` and `not-run` are never a pass.

## 1. Terms

- Exact version: a version `X.Y.Z(-prerelease)` whose directory `apps/storybook/public/<version>/`
  is committed and served at `https://ui.mctl.ai/<version>/`.
- Floating sheet: `https://ui.mctl.ai/{mctl,global,prose,site}.css`, which follows `main`.
- Manifest: the record of one exact version described in section 2.
- Delivery mode A: exact-version CDN. Delivery mode B: locally vendored CSS.
- Route class: a group of pages on one site that share a stylesheet policy.
- Verified version: an exact version whose bytes were checked against its manifest (G1).

## 2. Release manifest specification

Each exact version MUST have a manifest with these fields.

| Field                | Requirement                                                                           | `0.20.2` status                                                                     |
| -------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `designVersion`      | MUST equal the root version and the directory name                                    | `0.20.2` `[CODE]`                                                                   |
| `sourceCommit`       | MUST be the canonical 40-hex commit SHA                                               | unknown (not observed), see note below                                              |
| `provenance`         | MUST name the CI run and image digest; SHOULD carry a signed attestation              | run and digest: not-run. Attestation: not produced by `publish.yml` or `deploy.yml` |
| `assets[].path`      | MUST give the npm path `@mctlhq/css/<export>` (and `@mctlhq/tokens` where it applies) | `mctl.css` is `@mctlhq/css/theme.css`; others `[CODE]` only                         |
| `assets[].url`       | MUST be `https://ui.mctl.ai/<version>/<file>`                                         | observed `[LIVE]`, HTTP 200 (2026-11-08)                                            |
| `assets[].bytes`     | MUST be the size in bytes                                                             | `[CODE]` only                                                                       |
| `assets[].mediaType` | MUST be `text/css`                                                                    | unknown (not observed): `Content-Type` was not recorded in the evidence run         |
| `assets[].sha256`    | MUST be lowercase hex                                                                 | observed (`[LIVE]` body hash equals `[CODE]`, evidence section 3)                   |
| `assets[].sri`       | MAY be `sha384-<base64>`                                                              | `[CODE]` only, never verified at the edge or in a browser                           |
| `immutability`       | MUST reference `check:token-version`                                                  | `[CODE]`                                                                            |

Note on `sourceCommit`: the `0.20.2` tag resolves to `7e1fbb0634d57a9d371e01f487785cd187b362c7`
(`git rev-parse 0.20.2`). The implementation clone is shallow (`git rev-parse
--is-shallow-repository` returned `true`), and the tag was not checked against the commit that
first wrote the `0.20.2` directory or against the image build. The commit is therefore recorded as
unknown (not observed) until a maintainer verifies it from full history.

Illustrative, non-executable example. It is not a published artifact; no such file exists in this
repository or on the CDN.

```yaml
# ILLUSTRATIVE EXAMPLE, NOT EXECUTED, NOT A PUBLISHED ARTIFACT
designVersion: 0.20.2 # [CODE]
sourceCommit: unknown (not observed) # tag 0.20.2 not verified against build, shallow clone
provenance:
  ciRun: not-run
  imageDigest: not-run
  attestation: not-run # SHOULD exist in a future phase
assets:
  - path: '@mctlhq/css/theme.css' # [CODE]
    url: https://ui.mctl.ai/0.20.2/mctl.css # observed
    bytes: 36645 # [CODE] only
    mediaType: text/css # unknown (not observed)
    sha256: 063ceae822d3b139c670fd2b687a00ff021cf2d75443995c14c3b19145324958 # observed
    sri: sha384-3c3+7j/sxG7OAo0w/yu2pbf6w6gfo4Wmog6O/9Hh/6uS1/ysGw7jx9JMmJhCbSdJ # [CODE] only
  - path: '@mctlhq/css/global.css' # [CODE]
    url: https://ui.mctl.ai/0.20.2/global.css # observed
    bytes: 740 # [CODE] only
    mediaType: text/css # unknown (not observed)
    sha256: cd78060bdc83c56508594fe20fd9302951130e8720604c547140c16f1762ff03 # observed
    sri: sha384-QI5S3hNyBuvXCFO1r4dGHnHjwPBFfInNOAtwUndgzzREPzLWFy3rVFOjLk7Z8Fqm # [CODE] only
  - path: '@mctlhq/css/prose.css' # [CODE]
    url: https://ui.mctl.ai/0.20.2/prose.css # observed
    bytes: 2898 # [CODE] only
    mediaType: text/css # unknown (not observed)
    sha256: 71536bf86e0d1edc1b9efb6d3fb5cc823826c0826c5790f3f26bdf0cd1a1ee0f # observed
    sri: sha384-iBepqPx8VGFFM+TEA8To9z2KXjf3l+WOSIZ0eqckqW1SspX5n17F06nGq+cAh5g4 # [CODE] only
  - path: '@mctlhq/css/site.css' # [CODE]
    url: https://ui.mctl.ai/0.20.2/site.css # observed
    bytes: 20854 # [CODE] only
    mediaType: text/css # unknown (not observed)
    sha256: d184836c17818edbe85923d356da872113f07cb8d088477796f39d0fc01ad31a # observed
    sri: sha384-qlcodqkR2eUiRvfnSbsSiyqozeCRlSN2XcBFBh89Icj/J+fOzr9VXUH46sKSvHBj # [CODE] only
```

Checking a version against its bytes: hash `apps/storybook/public/<version>/<file>`, the file in
the `@mctlhq/css` npm tarball, and the CDN response body. All three MUST be equal. On the CDN,
`mctl.css` equals `@mctlhq/css/theme.css`. The npm tarball comparison is `not-run`.

## 3. Delivery modes

Mode A, exact-version CDN. A public page loads `https://ui.mctl.ai/<exact semver>/<file>`.

- It MAY add `integrity` with `crossorigin="anonymous"` only after gate G3 has verified real CORS,
  bytes and rollback in a browser.
- Whether the source is allowed is decided by the route's effective `style-src` (or the
  `default-src` fallback when `style-src` is absent). It MUST NOT be inferred from `script-src`.
  Academy public is an example: its script policy forbids inline scripts, and its `style-src`
  still allows `https://ui.mctl.ai` (evidence section 4).
- A successful `curl` does not prove browser SRI or CORS behaviour.
- The floating URL MUST NOT be used for any page shipped to users. Floating sheets are for
  previews and internal tools only.

Mode B, locally vendored CSS. A deterministic sync copies the CSS byte for byte from a manifest
version into the consumer's own origin. A `--check` style CI step compares its SHA-256 against the
manifest. The line-1 banner `/* @mctlhq/css <version> ... */` is the human-readable cross-check.

- Mode B is REQUIRED while the effective stylesheet policy is restricted to the route's own origin
  (`style-src 'self'`, or a restrictive `default-src` fallback when `style-src` is absent), and
  for sensitive routes (auth, consent, OAuth) whose policy requires local resources.
- A route MUST NOT add `https://ui.mctl.ai` to its CSP, or widen CSP in any way, merely to adopt
  Mode A.

## 4. Six-site supply matrix

Observed values are from evidence section 4 (landing pages only, 2026-11-08). GitOps tags are
`[CONFIG]`, read 2026-11-09 at mctl-gitops `d704b725f3cb`. Every other cell is unknown (not
observed) or not-run. No CSP is relaxed by this contract.

| Route class        | Source pin             | GitOps tag `[CONFIG]`              | Effective `style-src`, landing page `[LIVE]`                                        | Permitted mode | Integrity | Owner repo, ticket          |
| ------------------ | ---------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- | -------------- | --------- | --------------------------- |
| mctl.ai public     | unknown (not observed) | `7.21.1`                           | `'self' 'unsafe-inline'` plus `https://ui.mctl.ai`                                  | A or B         | not-run   | mctl-web, none              |
| docs public        | unknown (not observed) | `0.1.66`                           | `'self' 'unsafe-inline'` plus `https://ui.mctl.ai`. 37 hashes unavailable / not-run | A or B         | not-run   | mctl-docs, none             |
| tg public          | unknown (not observed) | `0.137.1` (preview `main-d5b3a7d`) | `'self' 'unsafe-inline'` plus `https://ui.mctl.ai`                                  | A or B         | not-run   | mctl-telegram, telegram#599 |
| tg lite/auth       | unknown (not observed) | `0.137.1`                          | not-run                                                                             | B (sensitive)  | not-run   | mctl-telegram, design#78    |
| academy            | unknown (not observed) | `0.1.76`                           | `'self' 'unsafe-inline'` plus `https://ui.mctl.ai`                                  | A or B         | not-run   | mctl-academy, academy#210   |
| alice              | unknown (not observed) | `2.13.1`                           | `'self'` only                                                                       | B only         | not-run   | mctl-alice, none            |
| seerrsense public  | unknown (not observed) | `1.14.1`                           | no CSP header returned                                                              | A or B         | not-run   | seerrsense, none            |
| seerrsense consent | unknown (not observed) | `1.14.1`                           | not-run                                                                             | B (sensitive)  | not-run   | seerrsense, none            |

The route classes are abstract. Their real paths are not-run, because consumer source was not read.
The docs CSP row stays unavailable / not-run for the full header; no script hashes are reproduced.
A site with no CSP is not thereby restricted, but the owner decision on adding one (tightening) is
outside this contract.

Sensitive routes (auth, consent, OAuth callback, error, redirect) MUST be verified only through
source, dev/test fixtures or isolated preview, never by production probes, credentials or callback
requests.

## 5. Verification chain

| Link               | Verified by and how                              | ui.mctl.ai status                                                                        | Consumers status               |
| ------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------ |
| Source pin         | maintainer: tag to 40-hex commit                 | unknown (not observed), see section 2 note                                               | unknown (not observed)         |
| Package lock / URL | consumer owner: exact version, no `^`            | not applicable (it is the source)                                                        | unknown (not observed)         |
| Manifest           | maintainer: section 2 field table                | not-run (no published manifest)                                                          | not-run                        |
| Build artifact     | CI: hash equality of repo, npm tarball, CDN body | CDN body equals repo bytes, observed; npm not-run                                        | not-run                        |
| OCI image digest   | CI or registry: digest of the deployed tag       | unknown (not observed); no digest pinned `[CONFIG]`                                      | unknown (not observed)         |
| GitOps desired     | `image.tag` in mctl-gitops                       | `7340576f6dcc` `[CONFIG]`                                                                | see section 4 `[CONFIG]`       |
| ArgoCD observed    | ArgoCD sync, health, image                       | Synced, Healthy, `7340576f6dcc` (2026-11-09); revision and digest unknown (not observed) | not-run (not re-queried)       |
| HTTP response      | anonymous `GET`/`HEAD`: headers and body hash    | observed 2026-11-08 `[LIVE]`                                                             | landing pages only, evidence 4 |

Matching image tags are not proof of provenance until the digest and source commit are linked.

## 6. Caching

- Versioned URLs are `public, max-age=31536000, immutable`. A published version directory MUST
  NOT be mutated, moved or deleted. `scripts/check-token-version-bump.mjs` (CI
  `check:token-version`) already blocks edits, moves and removals of a version directory present on
  `main`. Withdrawing published bytes needs an admin merge past that check plus a CDN purge,
  neither of which CI performs.
- Floating sheets are served with `max-age=3600` at origin (`nginx.conf` `[CODE]`) and
  `max-age=14400` at the edge (`[LIVE]`, 2026-11-08). The cause is unexplained. It is an open
  follow-up with gitops#500 as the candidate owner; the epic owner decides the routing. This
  contract proposes no fix.
- Edge `Age` and cache HIT behaviour: not-run (every observed response was a MISS).

## 7. Rollback and failure behaviour

| Trigger                                   | Action                                                       | Verification                                    | Forbidden                                               |
| ----------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------- |
| A version is faulty                       | Mode A: repoint the pin to the last verified exact version   | G1 hash check of the target version; page loads | Editing or deleting the faulty version's bytes in place |
| A version is faulty                       | Mode B: re-sync the previous manifest version, run `--check` | `--check` passes against that manifest          | Hand-editing the vendored copy                          |
| CDN request fails                         | Page stays functional unstyled, or uses the local copy       | Page remains usable                             | Widening CSP; switching to the floating URL             |
| Integrity mismatch (browser blocks sheet) | Same fail-safe, then roll back as above                      | Compare hashes to the manifest                  | Removing `integrity`; widening CSP; floating URL        |

Rollback is no-downtime because the previous directory under `apps/storybook/public/<version>/` is
committed and keeps being served. An incident never calls for a CSP bypass.

## 8. Gates and migration

- G1 (MUST): SHA-256 content verification against the manifest.
- G2 (MAY): SHA-384 SRI.
- G3: no enforcement (including `integrity` attributes) until `web-contract-preview-assurance` has
  verified ACAO, `crossorigin`, cache and real browser outcomes. All of these are not-run today.
- G4: consumers pin an exact version, with no `^` range. Academy's `^0.20.2` is the current state
  and is owned by academy#210.
- A signed attestation (GitHub artifact attestation or cosign on the GHCR image) SHOULD be added in
  a future phase.

## 9. Existing owners

This contract references existing tickets and creates no new implementation work.

- design#34: header contract and behaviour checks.
- design#78: design-system version pinning and local fallback for Telegram.
- telegram#599: Telegram public menu behaviour.
- academy#210: Academy header and asset supply, including its version range.
- gitops#500: candidate owner for the floating-sheet TTL difference and edge cache behaviour. The
  scope of each ticket was not re-read; the mapping is best effort.
