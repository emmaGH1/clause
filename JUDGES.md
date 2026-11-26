# For judges and automated reviewers

Every claim Clause makes, where it lives in the code, and how to check it. Kane CLI's part and ours are kept apart.

Live app: https://clause-production-795ae007.up.railway.app
Sample report (passed re-check): https://clause-production-795ae007.up.railway.app/case/9f177adaf5e26b5d
Latest live report (run on Railway, final day): https://clause-production-795ae007.up.railway.app/case/9ad67f5b95e4ffbf
Wrong-page report (Share locked): https://clause-production-795ae007.up.railway.app/case/027d3b20733ae5a4

## One command for the journey

```bash
npm install && npx playwright install chromium
LIVE_URL=https://clause-production-795ae007.up.railway.app node scripts/status.mjs
```

It opens the live app at phone width (390px), logged out, and checks each journey step against the raw Kane output the app serves. Result on Railway, 26 Nov 2026 16:16 WAT: **full journey passed** (J1–J5 and J5!). Read run `a4c448b2`, re-check `aa36edde` unlocked Share; wrong-page re-check `01022c32` missed the homepage quote and kept Share locked.

## Claims, code, checks

| Claim | Code | Check | See it |
|---|---|---|---|
| Kane CLI reads the company's live public site, read-only | `engine/agent.mjs` (`kaneObjective`), `engine/kane.mjs` (runs `kane-cli run --agent`) | J2 | `/api/cases/<id>/kane/read.ndjson` |
| Each quote is Kane's exact stored value, not model output | `engine/agent.mjs` (`bind`) | J2 compares the page quote with `context.memory` in the raw run | Sample report vs `/api/cases/9f177adaf5e26b5d/kane/read.ndjson` |
| Each screenshot is the Kane step that stored the quote | `engine/kane.mjs` (`extractShots`), `engine/evidence-bounds.mjs` | J2, J4 | Click any screenshot in a report |
| Claims are kept in the sender's words, one per promise | `engine/agent.mjs` (`draft`) | J3 | Report rows: "Withdrawals are instant", "free" |
| A claim Kane didn't capture reads "Kane couldn't find this on the pages it checked" | `engine/text.mjs` (`NOT_FOUND`) | J3 | Row 03 of the sample report |
| The regulator notice is quoted word for word | `engine/sources.json` | J4 | Report footer |
| Share needs a second, fresh Kane run that re-finds every quote on its cited page | `engine/recheck.mjs` (`compareRecheck`), `engine/case.mjs` (`canShare`) | J5 | `/api/cases/9f177adaf5e26b5d/kane/recheck.ndjson` (run `d48432e4-…`) |
| Citing the wrong page keeps Share locked | `engine/case.mjs` (`wrongPageCase`) | J5! | `/case/26b37f8dd79cb0ca` |
| Recheck logic: freshness, page match, verbatim match | `engine/recheck.mjs` | `npm test` (7 tests) | |

## Live end-to-end runs (real Kane, real site)

`scripts/live-test.mjs` pastes a pitch into the running app in a visible browser, waits for Kane's read, opens the report, presses Re-check and records the result. Logs and screenshots are in `evidence/live-test/`.

| Run | Pitch | Read | Re-check | Outcome |
|---|---|---|---|---|
| 1 | "…instant and there are no fees at all. Start with $500" | `c5d55e68` · 3 quotes incl. $250 minimum deposit | `c4f9cacb` | Kane stored "true" flags instead of passages → Share locked (fail-closed) |
| 2 | canonical ModMount pitch | `883ff94d` · joined three FAQ answers into one quote | `05ae9df2` | quote not re-found → Share locked (fail-closed) |
| 3 | canonical ModMount pitch, tightened objectives | `3a6f4082` | `21592395` | both quotes re-found → **Share unlocked** |
| 4 | canonical pitch, on Railway | `c4e4de36` | `dd671265` | fee quote cited on the homepage (step metadata) → fixed: cite Kane's stored page URL |
| 5 | canonical pitch, on Railway | `7de291b3` | `ba55aa43` | Share unlocked; fee judged unverified because of Kane's `c2_answer_absent` flag → fixed: verdicts use stored passages only |
| 6 | canonical pitch, on Railway | `a4c448b2` | `aa36edde` | instant and free struck, doubles not found, **Share unlocked**; wrong-page run `01022c32` kept Share locked |

## What's live and what isn't

- The app runs on Railway from this repo's `Dockerfile` (Chromium + Kane CLI 0.10.9), with reports kept on a Railway volume.
- Each check spends Kane credits, so the public app allows two Kane runs at once and 20 per hour.
- Claim splitting and the verdict per claim use Claude (`claude -p`, strict JSON schema). No quote, page or screenshot comes from the model.
- ModMount is the supported demo case. Its regulator notice is stored in `engine/sources.json`.
