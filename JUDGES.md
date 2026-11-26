# For judges and automated reviewers

Every claim Clause makes, where it lives in the code, and how to check it. Kane CLI's part and ours are kept apart.

Live app: https://3000-agq3ndu665es5t4nn6gjyv7wca.instabox.tech
Sample report (passed re-check): https://3000-agq3ndu665es5t4nn6gjyv7wca.instabox.tech/case/9f177adaf5e26b5d
Latest live report (run during the final day): https://3000-agq3ndu665es5t4nn6gjyv7wca.instabox.tech/case/72c82b0f4da6fee9

## One command for the journey

```bash
npm install && npx playwright install chromium
LIVE_URL=https://3000-agq3ndu665es5t4nn6gjyv7wca.instabox.tech node scripts/status.mjs
```

It opens the live app at phone width (390px), logged out, and checks each journey step against the raw Kane output the app serves. Last result on the final day (26 Nov 2026, 14:02 WAT): J1, J2, J3, J4 and J5 passed. J5! (fail-closed) kept Share locked, but Kane stored a yes/no flag instead of a sentence for one claim, so the strict check reported it red. J5! passed earlier on Kane run `f58874ef-fbfe-41d6-baf1-9b141c9ab485` (`evidence/status/`).

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

## What's live and what isn't

- The app runs on our sandbox at the URL above. It answers while the sandbox is running.
- Each check spends Kane credits, so the public app allows two Kane runs at once and 20 per hour.
- Claim splitting and verdict wording use Claude through the `claude` CLI. No quote, page or screenshot comes from Claude.
- ModMount is the supported demo case. Its regulator notice is stored in `engine/sources.json`.
