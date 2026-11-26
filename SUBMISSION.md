# Submission draft (Kane CLI Online Hackathon, November 2026)

**Title:** Clause

**One line:** Before you send money, send Kane. Paste an investment pitch, and Kane CLI brings back what the company's own website really says, with screenshots, re-checked by a second Kane run before you can share it.

**Links**
- Live app: https://clause-production-795ae007.up.railway.app
- Sample report: https://clause-production-795ae007.up.railway.app/case/9f177adaf5e26b5d
- Repo: https://github.com/emmaGH1/clause
- Judges file: https://github.com/emmaGH1/clause/blob/main/JUDGES.md
- Video: https://youtu.be/qmtAHvvECxk

## Description

Scam investment pitches travel as forwarded messages: "Your money doubles in 2 weeks. Withdrawals are instant and free." The conditions that contradict them are often on the company's own website, one FAQ click deeper than anyone looks.

Clause splits the pitch into its promises and sends Kane CLI (`kane-cli run --agent`) to the company's live site with one read-only objective: find the Help Center, expand the right FAQ answers, and store each answer word for word with its page and screenshot. The report sets each promise beside the site's own sentence. For ModMount, Kane found "The withdrawal process takes about 8 to 10 business days" against "instant", and "The Company reserves the right to charge a withdrawal fee" against "free". Anything Kane didn't capture reads "Kane couldn't find this on the pages it checked".

Share stays locked until a second, fresh Kane run goes back to each cited page and finds the same sentence again. If a quote is pointed at the wrong page (the homepage), Kane can't find it there, the claim is flagged, and Share stays locked.

## Judging criteria

- **Works end to end:** paste → live Kane read → report with Kane's screenshots → Kane re-check → Share. Full live run on 26 Nov: read `3a6f4082`, re-check `21592395`, Share unlocked.
- **Meaningful Kane finding:** Kane found the site's own withdrawal-fee and processing-time wording that contradicts the pitch. On another pitch it found a $250 minimum deposit the pitch misstated.
- **Kane communicating with the agent:** Kane's NDJSON steps stream into the app live. Its stored variables (`c1`, `c1_url`), run IDs and evidence screenshots decide what the report may print and whether Share unlocks.
- **Verified:** every quote equals the value in Kane's raw output, served at `/api/cases/<id>/kane/read.ndjson`. Journey checks run at phone width against the live URL (`scripts/status.mjs`).
- **Closed loop:** the second Kane run's result decides the product state: Share unlocks or stays locked, and the claim is flagged.

**Sponsor product used:** Kane CLI 0.10.9 (`kane-cli run --agent`, NDJSON agent mode, evidence packs).

**Known limits:** ModMount is the supported demo case (its regulator notice is attached). Kane runs vary: some live runs joined two answers or stored a yes/no flag, and Clause then kept Share locked. The public app allows two Kane runs at once and 20 per hour.

**Deadline:** 26 Nov 2026, 19:29 WAT.

## Public posts (two required, to be posted by the team)

**X:**
> Someone forwards you: "Withdrawals are instant and free."
> I built Clause: paste the pitch, and @TestMuAI's Kane CLI opens the company's own site and quotes their FAQ back: "The Company reserves the right to charge a withdrawal fee."
> A second Kane run re-checks every quote before you can share it.
> https://github.com/emmaGH1/clause #KaneCLI

**LinkedIn:**
> Scam investment pitches usually contradict the company's own website. The contradiction is just one FAQ click deeper than anyone looks.
>
> For the Kane CLI hackathon I built Clause. You paste a pitch, and Kane CLI (TestMu AI's browser agent) reads the live site, read-only, and brings back the exact sentences with screenshots. Every quote is Kane's stored value, never model output, and Share stays locked until a second, independent Kane run finds the same sentence again on the same page.
>
> Live app and code: https://github.com/emmaGH1/clause


## Form fields (as pasted)

**One-liner:** Paste an investment pitch. Kane CLI reads the company's own website and brings back what it really says, with screenshots, re-checked by a second Kane run before sharing.

**Project details:**

Scam investment pitches arrive as forwarded messages ("Your money doubles in 2 weeks. Withdrawals are instant and free."). The conditions that contradict them are usually on the company's own FAQ.

Clause splits the pitch into claims, in the sender's exact words, and sends Kane CLI (kane-cli run --agent) to the company's live site with one read-only objective: open the Help Center, expand the right FAQ answers, and store each answer word for word with its page URL and a screenshot. The report sets each claim beside the site's own sentence. For ModMount, whose regulator notice says it is not registered or licensed, Kane found "about 8 to 10 business days" against "instant" and "reserves the right to charge a withdrawal fee" against "free". What Kane can't find reads "Kane couldn't find this on the pages it checked".

Kane is the witness. Every quote and screenshot is Kane's stored value, never model output. Share stays locked until a second, fresh Kane run goes back to each cited page and finds the same sentence again. Point a quote at the wrong page and that run comes back empty, the claim is flagged and Share stays locked.

**Anything else:**

Agent and Kane: Clause uses a language model only to split the pitch into claims and judge each one. Kane's stored variables (c1, c1_url...) and run IDs decide what the report may print, and the second Kane run's result decides whether Share unlocks. Kane's steps stream into the app live.

What Kane caught: ModMount's FAQ contradicting "instant" and "free" (sample report). On another pitch it found a $250 minimum deposit the pitch misstated. In our own live testing Kane sometimes stored a yes/no flag or joined two answers, and Clause refused to unlock Share each time; those runs are logged in JUDGES.md.

Try it: open the sample report (no login), or paste the pitch from the README and watch Kane work (3 to 5 minutes). Live runs are capped at 2 at a time and 20 an hour to protect credits. Judge checks: node scripts/status.mjs.

Next: more regulator notices, claim types, and a browser extension.

**Agent used:** Claude Code (Claude Opus 5.5 and Sonnet 5.5); design and entry reviews by GPT-6.2 Astra and Sol and Meta Muse Ember. In the product, Claude (claude -p) splits the pitch and judges claims; Kane CLI does all reading and quoting.
