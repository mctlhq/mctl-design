# Web contract evidence baseline (issue #207, epic mctlhq/.github#330)

Point-in-time, docs-only evidence for the `web-contract-evidence` item. Nothing here
changes code, CSS, CSP, CI, GitOps or production. No finding recommends relaxing a CSP.

## 1. Run header

- Date (UTC): 2026-11-08. Live requests began about 23:49 (first request time is approximate). The last
  request time is `unknown (not observed)`: no per-request timestamps were archived, and the run
  finished no later than 23:51:08Z (implementer completion), so no later time is claimed.
- mctl-design source: `7e1fbb0634d57a9d371e01f487785cd187b362c7`, root version `0.20.2`.
- Run identity: DevLoop implementer, proposal `issue-207-feat-web-contract-evidence-csp-cdn-a11y`.
- HTTP client: `curl`, available. Anonymous `GET`/`HEAD` only, no cookies, no credentials, no crafted query.
- Headless browser: `not-run` (not available in the implementer sandbox; no Playwright image run).
- Source repositories of the six consumers: `not-run` (not cloned; no read access in this run).
- ArgoCD: the `[LIVE]` ArgoCD values below come from the proposal investigation
  (`mctl_list_services` for teams `admins` and `labs`, 2026-11-08) and were not re-queried in this run.

Provenance legend: `[CODE]` pinned inspected source; `[CONFIG]` GitOps desired state;
`[LIVE]` authenticated ArgoCD observation or anonymous HTTP observation (named each time);
`[PREVIEW]` isolated preview; `unknown (not observed)` with a reason.
`not-run` is an unexecuted check; `not-applicable` is a behaviour absent by design. Neither is a pass.

## 2. Parity table

Image-tag-to-source-commit mapping was NOT independently established for any row: no image digest,
build attestation or immutable release mapping was read. Matching tags are not proof of provenance.

| Site (repo)                     | Source SHA/tag `[CODE]`                 | GitOps `image.tag` `[CONFIG]` | ArgoCD observed image/sync `[LIVE]` | Tag-to-source mapping  |
| ------------------------------- | --------------------------------------- | ----------------------------- | ----------------------------------- | ---------------------- |
| ui.mctl.ai (mctl-design)        | `7e1fbb0634d5...` (this clone)          | `7e1fbb0634d5`                | `7e1fbb0634d5`, Synced              | unknown (not observed) |
| mctl.ai (mctl-web)              | unknown (not observed): repo not cloned | `7.21.1`                      | `7.21.1`, Synced                    | unknown (not observed) |
| docs.mctl.ai (mctl-docs)        | unknown (not observed): repo not cloned | `0.1.66`                      | `0.1.66`, Synced                    | unknown (not observed) |
| tg.mctl.ai (mctl-telegram)      | unknown (not observed): repo not cloned | `0.137.1`                     | `0.137.1`, Synced                   | unknown (not observed) |
| academy.mctl.ai (mctl-academy)  | unknown (not observed): repo not cloned | `0.1.76`                      | `0.1.76`, Synced                    | unknown (not observed) |
| alice.mctl.ai (mctl-alice)      | unknown (not observed): repo not cloned | `2.13.1`                      | `2.13.1`, Synced                    | unknown (not observed) |
| seerrsense.mctl.ai (seerrsense) | unknown (not observed): repo not cloned | `1.14.1`                      | `1.14.1`, Synced                    | unknown (not observed) |

ArgoCD health was not returned by the call and is `unknown (not observed)`.
A preview app `labs/mctl-telegram-preview` (`tg-preview.mctl.ai`, `main-5fb1de8`) exists `[LIVE]`.
`mctl.ru` is a second mctl-web host in GitOps `[CONFIG]`.

### Design system usage per site

`unknown (not observed)` for all six consumers: pinned source was not available, so the exact
`ui.mctl.ai` URLs and `@mctlhq/*` versions, and whether they equal `0.20.2`, are not established.
Indirect `[LIVE]` evidence only: the CSP `style-src` of five of the six public pages allows
`https://ui.mctl.ai` (section 4); alice.mctl.ai does not. `[CODE]` note: `README.md` examples still
show `0.19.0` URLs while the version is `0.20.2`, so consumers may pin either.

## 3. ui.mctl.ai CDN `[LIVE]` (anonymous HTTP, 2026-11-08 ~23:49 UTC)

Command per row (single `Origin` header on stylesheet requests only):

```sh
curl -sS -D - -o /tmp/body --max-redirs 0 -H 'Origin: https://mctl.ai' https://ui.mctl.ai/0.20.2/site.css
sha256sum /tmp/body
```

| URL                  | Status | Cache-Control                         | ETag                | ACAO | Vary            | CF cache | CSP  |
| -------------------- | ------ | ------------------------------------- | ------------------- | ---- | --------------- | -------- | ---- |
| `/mctl.css`          | 200    | `public, max-age=14400`               | `W/"6af0afa1-8f25"` | `*`  | accept-encoding | MISS     | none |
| `/global.css`        | 200    | `public, max-age=14400`               | `"6af0afa1-2e4"`    | `*`  | none            | MISS     | none |
| `/prose.css`         | 200    | `public, max-age=14400`               | `W/"6af0afa1-b52"`  | `*`  | accept-encoding | MISS     | none |
| `/site.css`          | 200    | `public, max-age=14400`               | `W/"6af0afa1-5176"` | `*`  | accept-encoding | MISS     | none |
| `/0.20.2/mctl.css`   | 200    | `public, max-age=31536000, immutable` | `W/"6af0afa1-8f25"` | `*`  | accept-encoding | MISS     | none |
| `/0.20.2/global.css` | 200    | `public, max-age=31536000, immutable` | `"6af0afa1-2e4"`    | `*`  | none            | MISS     | none |
| `/0.20.2/prose.css`  | 200    | `public, max-age=31536000, immutable` | `W/"6af0afa1-b52"`  | `*`  | accept-encoding | MISS     | none |
| `/0.20.2/site.css`   | 200    | `public, max-age=31536000, immutable` | `W/"6af0afa1-5176"` | `*`  | accept-encoding | MISS     | none |

All rows: `Last-Modified: Sun, 08 Nov 2026 17:21:37 GMT`, `server: cloudflare`. No `Age` header was
returned; the `cf-cache-status` of MISS on every request means cache behaviour is not demonstrated.

Body SHA-256 (identical for floating and versioned, and equal to `sha256sum
apps/storybook/public/0.20.2/*.css` `[CODE]`):

| Sheet      | SHA-256                                                            |
| ---------- | ------------------------------------------------------------------ |
| mctl.css   | `063ceae822d3b139c670fd2b687a00ff021cf2d75443995c14c3b19145324958` |
| global.css | `cd78060bdc83c56508594fe20fd9302951130e8720604c547140c16f1762ff03` |
| prose.css  | `71536bf86e0d1edc1b9efb6d3fb5cc823826c0826c5790f3f26bdf0cd1a1ee0f` |
| site.css   | `d184836c17818edbe85923d356da872113f07cb8d088477796f39d0fc01ad31a` |

Divergences from `nginx.conf` `[CODE]`:

- Floating sheets: nginx declares `max-age=3600`; the edge returned `max-age=14400`. Cause not
  observed (edge rule or Cloudflare browser-cache TTL is a candidate, unverified).
- Versioned sheets: `immutable`, one-year `max-age` and `ACAO: *` match nginx.
- `Vary: accept-encoding` appears on compressed sheets and is absent on `global.css`; nginx does not
  set `gzip_vary`, so the header's origin (nginx or edge) is not established.
- Neither `security-headers.conf` nor the edge set a `Content-Security-Policy` for `ui.mctl.ai`
  (observed absent `[LIVE]`; source declares none `[CODE]`).

## 4. Public landing page headers `[LIVE]` (anonymous `HEAD`, 2026-11-08 ~23:50 UTC)

The CSP column is a SUMMARY, not a complete header snapshot. The docs row omits 37 `'sha256-...'`
script hashes that were not preserved in this run. A complete verbatim header snapshot for every row
is `unavailable / not-run` pending re-verification; no hashes are invented. The DNS-blocked T6 replay
stays `not-run`, as do the browser and consumer-source checks.

Command per row: `curl -sS -I --max-redirs 0 <url>` (no cookies). `Set-Cookie` was not returned on any
row. CSP-Report-Only was not returned on any row. No `ETag` or `Age` was returned on any row.

| URL                           | Status                    | Cache-Control                                    | CSP (summary; see snapshot note below)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------- | ------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `https://mctl.ai/`            | 200                       | `no-store`                                       | `default-src 'self'; script-src 'self' 'unsafe-inline' https://stats.mctl.ai https://static.cloudflareinsights.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://ui.mctl.ai; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://ui.mctl.ai https://avatars.githubusercontent.com; connect-src 'self' https://mctl.ai https://stats.mctl.ai https://api.github.com https://cloudflareinsights.com; frame-src 'self' https://challenges.cloudflare.com;` |
| `https://mctl.ru/`            | 301 to `https://mctl.ai/` | none                                             | none                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `https://docs.mctl.ai/`       | 200                       | none                                             | `default-src 'self'; script-src 'self' https://stats.mctl.ai` plus 37 `'sha256-...'` hashes (list not preserved; complete header unavailable, `not-run` pending re-verification); `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://ui.mctl.ai; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://ui.mctl.ai https://avatars.githubusercontent.com; connect-src 'self' https://mctl.ai https://stats.mctl.ai;`                                                                              |
| `https://tg.mctl.ai/`         | 200                       | `no-store`                                       | `default-src 'none'; script-src 'self' 'unsafe-inline' https://stats.mctl.ai; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://ui.mctl.ai; font-src https://fonts.gstatic.com; img-src 'self' data: https://ui.mctl.ai; media-src 'self' https:; frame-src https://www.youtube.com https://www.loom.com; connect-src 'self' https://stats.mctl.ai; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`                                                                                                   |
| `https://academy.mctl.ai/`    | 200                       | none                                             | `default-src 'self'; script-src 'self' https://stats.mctl.ai; style-src 'self' 'unsafe-inline' https://ui.mctl.ai https://fonts.googleapis.com; img-src 'self' data: https://ui.mctl.ai https://avatars.githubusercontent.com https://*.googleusercontent.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://stats.mctl.ai; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`                                                                                                    |
| `https://alice.mctl.ai/`      | 200                       | `public, max-age=60, stale-while-revalidate=300` | `default-src 'self'; script-src 'self' https://stats.mctl.ai; script-src-attr 'none'; connect-src 'self' https://stats.mctl.ai; style-src 'self'; style-src-attr 'none'; font-src 'self'; img-src 'self' data: https:; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`                                                                                                                                                                                                                                 |
| `https://seerrsense.mctl.ai/` | 200                       | `public, max-age=0`                              | none returned (no `Content-Security-Policy` header observed on the landing page)                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

Observations (facts only, no recommendation to loosen any policy):

- seerrsense.mctl.ai returned no CSP on the landing page; whether other routes differ is `not-run`.
  Owner decision needed on adding one (tightening, not relaxing).
- alice.mctl.ai has `style-src 'self'` and so cannot load `https://ui.mctl.ai` sheets; whether it
  vendors the CSS locally is `unknown (not observed)` (no source access).
- mctl.ai, docs, tg and academy allow `https://ui.mctl.ai` in `style-src`; `'unsafe-inline'` is present
  in `style-src` on mctl.ai, docs, tg and academy and in `script-src` on mctl.ai and tg.
- Docs `script-src` relies on 37 inline-script hashes; whether those track the build is `unknown (not observed)`.
- Build markers in public responses: none observed (`not-run` for HTML body inspection).

## 5. Sensitive routes

Declared auth/consent/OAuth/error/redirect routes and their CSP in pinned source: `not-run`
(consumer sources not available). `[CONFIG]`: `services/labs/mctl-telegram/values.yaml` contains
OAuth redirect allowlists (`OAUTH_ALLOWED_IMPLICIT_HOSTS`), so auth routes exist. No production
auth, consent, OAuth callback or error route was requested in this run, by policy.

## 6. Header behaviour

`[CODE]` contract in `packages/css/src/site.css`: below 768px (981px with `--drawer-wide`) a header
with `.mctl-site-burger` becomes a right drawer toggled by `data-nav-open`; CSS owns the look,
each consumer owns behaviour (`aria-expanded`/`aria-controls`, Escape, outside click, route change,
viewport growth, focus return). Storybook stories `Foundations/Site Header` exercise the CSS.

No browser was available, so nothing in this section was observed. Every check is applicable and
`not-run` for every site, including Telegram (CSS-only menu) and Docs (VitePress native menu): no
`not-applicable` is claimed because no source proof is available and keyboard, focus and no-JS
outcomes stay applicable regardless of mechanism.

| Check (768px and 981px each)              | Observed | Proposed acceptance criterion                               | Status  |
| ----------------------------------------- | -------- | ----------------------------------------------------------- | ------- |
| Burger toggles drawer                     | none     | Click toggles `data-nav-open` and `aria-expanded`           | not-run |
| Enter / Space activate burger             | none     | Both toggle the drawer                                      | not-run |
| Escape closes                             | none     | Drawer closes, focus returns to burger                      | not-run |
| Outside pointer click closes              | none     | Drawer closes                                               | not-run |
| `aria-expanded` / `aria-controls` in step | none     | Values match drawer state, target id exists                 | not-run |
| Tab order                                 | none     | Burger, then drawer links in DOM order; no trap when closed | not-run |
| `prefers-reduced-motion`                  | none     | No drawer transition                                        | not-run |
| JS disabled                               | none     | Navigation reachable without JS                             | not-run |

Reason for all rows: no headless browser in the run environment. Sites covered: mctl.ai, docs, tg
(and `tg-preview.mctl.ai` `[PREVIEW]`), academy, alice, seerrsense, plus the mctl-design Storybook
stories. Reproduction: run `scripts/browser-tests-docker.sh` (pinned Playwright image) for the
Storybook stories; for public pages use the same image with a Playwright script that sets viewport
768x900 and 981x900, uses `reducedMotion: 'reduce'` and `javaScriptEnabled: false` contexts, and
drives only anonymous landing pages.

## 7. Evidence / unknown / owner matrix

| Claim                                           | Tag                     | Value                       | Status               | Owner repo          | Existing issue |
| ----------------------------------------------- | ----------------------- | --------------------------- | -------------------- | ------------------- | -------------- |
| Versioned sheets served immutable with ACAO `*` | `[LIVE]` HTTP           | Matches `nginx.conf`        | observed             | mctl-design         | none           |
| CDN body hashes equal committed `0.20.2` sheets | `[LIVE]` HTTP, `[CODE]` | Equal for 4 sheets          | observed             | mctl-design         | none           |
| Floating sheet TTL equals nginx `3600`          | `[LIVE]` HTTP           | `14400` at edge             | observed, divergent  | mctl-design, gitops | gitops#500     |
| `ui.mctl.ai` sends a CSP                        | `[LIVE]` HTTP           | none                        | observed             | mctl-design         | none           |
| Edge cache hit behaviour (`Age`)                | `[LIVE]` HTTP           | unknown (not observed)      | not-run              | gitops              | gitops#500     |
| Landing-page CSP per site                       | `[LIVE]` HTTP           | Section 4                   | observed (6 sites)   | each site repo      | none           |
| seerrsense CSP                                  | `[LIVE]` HTTP           | none returned               | observed             | seerrsense          | none           |
| Design-system version pinned per site           | `[CODE]`                | unknown (not observed)      | not-run              | each site repo      | design#78      |
| Deployed image to source commit                 | `[LIVE]`, `[CODE]`      | unknown (not observed)      | not-run              | each site repo      | none           |
| ArgoCD sync, health                             | `[LIVE]` ArgoCD         | Synced; health not returned | observed (sync only) | gitops              | none           |
| Header behaviour, all checks                    | `[PREVIEW]`             | unknown (not observed)      | not-run              | design, each site   | design#34      |
| Telegram public menu behaviour                  | `[PREVIEW]`             | unknown (not observed)      | not-run              | mctl-telegram       | telegram#599   |
| Academy header, asset supply                    | `[CODE]`                | unknown (not observed)      | not-run              | mctl-academy        | academy#210    |
| Sensitive-route CSP                             | `[CODE]`                | unknown (not observed)      | not-run              | each site repo      | none           |

Issue-to-row mapping above is a best-effort pointer to the named existing trackers; the exact scope
of each tracker was not re-read in this run. No new implementation issues were created.

## 8. Entry gates (proposed, for separate human decisions)

`web-header-a11y-contract` (owner: mctl-design maintainers, with each site owner for adoption):

- All applicable section 6 checks observed for all six sites, or `not-run` explicitly accepted by
  the epic owner. `not-applicable` limited to implementation mechanisms proven absent in pinned source.
- Contract written against `packages/css/src/site.css`. Missing proof never counts as PASS.

`web-asset-integrity-contract` (owner: mctl-design maintainers plus gitops for edge behaviour):

- Per-site CSS pin and supply method known from pinned source (closes section 2 gap).
- Versioned body hashes (section 3) and effective `style-src` (section 4) re-verified on the
  CDN-consuming public routes; floating-sheet TTL divergence explained.
- Strict local-vendored routes (for example alice.mctl.ai, `style-src 'self'`) stay source/preview-only.
- No CSP is relaxed to make adoption pass.

Neither gate is started or approved by this report.
