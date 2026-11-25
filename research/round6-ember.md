# Review: pitch-checker with Kane as witness

**Verdict: PASS WITH CHANGES.** The hour-1 result is real and the proof frame is strong. Judges will still ask “why not ChatGPT?”, and the second Kane run, as planned, is near-decoration. Fix the five points below or this reads as a well-built wrapper.

## 1. Why important? Who uses it?

The problem is real but narrow: a relative forwards a WhatsApp-style pitch (“withdrawals are instant and free”) and a family helper must answer “where does it actually say that?” That helper, not the investor, is the user, and the forwardable report is the product.

Today it only truly works for one case. `engine/sources.json` holds one hand-quoted regulator notice (ModMount); `engine/case.mjs:28` attaches it only on a host match. For any other site the regulator section vanishes and the report is just site quotes. Fine for a hackathon, but do not imply arbitrary pitches work. Say “supported demo case”.

## 2. “Isn't this just a scam detector / ask ChatGPT?”

Honest answer: mostly yes. ChatGPT, Claude and Codex can now browse, quote and summarise. Pasted the FAQ link, they will likely return the same fee sentence. Your edge is not intelligence; it is provenance and enforcement:

- Kane navigates live (homepage → Help Center → FAQ) and stores the quote, screenshot and run ID (`evidence/hour1/run.ndjson`, passed, 6 steps, 23.3 credits). ChatGPT gives a citation; you give an inspectable run.
- `engine/agent.mjs:106-109` (`bind`) only lets a sentence cite evidence if the quote is a substring of Kane’s capture; otherwise it becomes “not stated on the site” (`agent.mjs:115-118`). A chat prompt does not enforce that.

Visible in 2 minutes? Only if you show enforcement: draft struck out, quote equal to raw Kane output, then “Remove Kane’s receipt” disables Share (J5!). Narration alone loses to ChatGPT.

## 3. Why Kane, a testing agent? Is J5 meaningful?

J2 is a repurposing, and you should say so. There is no app under test or assertion; Kane is a structured browser reader returning variables, screenshots and a run ID. `engine/kane.mjs` spawns `kane-cli run --agent`, keeps raw NDJSON verbatim, and maps each variable to the screenshot of the step that stored it. A scraper could not reliably expand the FAQ; Playwright could, but without agent navigation and the evidence pack.

J5 as written (`docs/PLAN.md:22`, “second run opened the published report and confirms each quote matches its screenshot”) is decoration: it proves transcription, not truth. It is not even built — `engine/case.mjs` ends at `stage: "ready"` (`:61`), while `checks/journey.mjs:115-123` expects a `recheck` NDJSON nothing produces. Build it honestly or cut the claim. GuardianKane’s gate could block; yours currently cannot block anything.

## 4. Against past winners

| Score (1–10) | Why |
|---|---|
| Judge “wow” | 6. Clear one-screen proof frame; no surprise like KANE vs ABLE. |
| Kane centrality | 5. J2 central; J5 absent. |
| Originality | 7. Not the crowded repair loop in `research/terra-landscape.md`; claims-to-evidence is thin, though scam-checkers exist. |
| Buildability in ~28h | 8. Riskiest step passed. But 174 credits remain (`evidence/hour1/balance-after.txt`, ~7 runs); 10,000-credit request pending. |
| Demo clarity | 8. Best part: one claim, one screenshot, one run ID. |

Winners made Kane performer (demo.studio), gate (GuardianKane) or adversary (KANE vs ABLE). “Witness the agent can’t argue past” passes — if the witness visibly overrules the agent (`bind`) and the second witness is honest.

## 5. PASS WITH CHANGES (ranked)

1. **Make J5 re-observe, or delete it.** Second run opens the *origin* FAQ, extracts the fee sentence independently, compares to the report; mismatch keeps Share disabled. One extra run plus one comparison. No time? Remove J5, keep J5! as the gate.
2. **Lock to supported cases, cache evidence.** Ship ModMount with saved NDJSON/screenshot as judge fallback plus “Check again” for fresh runs. Disclose the list. Survives 403s (Astra found `modmountltd.com` blocked; only `www.mod-mountltd.com/en/` worked) and scarce credits.
3. **First 60 seconds = enforcement.** Struck draft → screenshot with highlighted quote → remove receipt → “not stated on the site” + Share disabled. That answers ChatGPT without narration.
4. **Stop synthesising the regulator line.** `case.mjs:59-60` templates a claim. Show the regulator’s verbatim quote, name, date, jurisdiction, defanged, with “not legal advice”. Never call the site a scam yourself.
5. **Fix credits first.** Chase 10,000 today; budget read + recheck per case. If it fails, label replays “replay, not shareable” and record the live demo.

## 6. README pitch

Paste an investment pitch and get a one-page report where every claim is set beside the site’s own words, backed by Kane’s screenshot and run ID — or “not stated on the site”.
