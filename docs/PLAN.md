# plan: Clause

> the human's. agents never edit this file: they propose one exact change (old line, new line, why), the human says yes, then `node scripts/status.mjs --approve "<why>"`.

## north star

- **singularity:** when someone pastes an investment pitch (a link or a message), they get a one-page report that sets each claim in the pitch beside what the site's own pages actually say, with Kane's screenshot as proof, and TestMu gets Kane as the witness the agent can't argue past: Kane's capture rewrites what the report says.
- **the sponsor's job:** Kane CLI (`kane-cli run --agent`) reads the site's public pages live and captures the exact wording, screenshot and run ID (J2). A second, fresh Kane run goes back to each cited page on the live site and finds the quoted sentence itself before sharing is unlocked (J5).
- **main prize:** KaneCLI Online Hackathon 1st place (Verified + Closed loop break ties) · **extras:** launch-post reach (brownie points)
- **not building:** sign-ups or burner accounts, deposits, a WhatsApp bot, bulk scanning, a danger score, Exploration maps in the core path, custom animation, voice notes, translations, localisation

## the journey

each row has a check in `checks/journey.mjs`. `scripts/status.mjs` reads this table; keep the columns.

| id | step | done means (what a judge sees, on a phone, logged out) | sponsor |
|---|---|---|---|
| J1 | open it from the public link | the paste box opens at phone width, not a landing page | |
| J2 | Kane reads the live site | the case shows Kane's exact quoted wording, its screenshot, the source page and a Kane run ID, and the quote equals the value in that run's raw Kane output | sponsor |
| J3 | the pitch's claims, checked one by one | each claim appears in the sender's exact words, one per claim ("instant" and "free" are separate); a claim the site's own wording contradicts is struck out beside that sentence; anything Kane didn't capture reads "Kane couldn't find this on the pages it checked" | |
| J4 | the report | a shareable report page lists every claim: the pitch's wording, the site's own words with Kane's screenshot, or "Kane couldn't find this on the pages it checked"; the regulator notice is quoted word for word with its name and date; ModMount is labelled the supported demo case | |
| J5 | Kane re-checks the live site | a second, fresh Kane run (different run ID) opens each cited page on the live site and finds the quoted sentence itself; only when every quote is found again is Share enabled | sponsor |
| J5! | fail-closed | a report whose claim cites the wrong page (the homepage) fails the re-check: Kane can't find the sentence there, the claim is flagged, and Share stays locked | |

## winners-post lines

A builder turned an investment pitch into a one-page report where every sentence is backed by a screenshot from the site itself. When the pitch said withdrawals were free, **Kane found the site's own fee wording, and a second Kane run re-found it on the live site before the report could be shared.**

## proof frame

One phone screen: the pitch's claim "Withdrawals are instant and free" struck out, above Kane's screenshot with the site's sentence highlighted ("The Company reserves the right to charge a withdrawal fee depending on the circumstances"). Below that: capture time, the defanged host and the Kane run ID.

- the viewer's question: "is the pitch telling the truth about getting money out?"
- the shot that settles it, with no captions: the site's own sentence in Kane's screenshot next to the struck-out claim

## clock

`status` reads `start` and `deadline` (ISO with offset, e.g. 2026-11-17T09:00+01:00).

| mark | date and time | must be true |
|---|---|---|
| start | 2026-11-24T22:40+01:00 | hardest gate and riskiest sponsor call tried (done: Kane captured ModMount's fee wording, 21:42 UTC) |
| deadline | 2026-11-26T19:29+01:00 | |
| 10% | 2026-11-25T03:09+01:00 | idea picked, journey + checks approved |
| 25% | 2026-11-25T09:52+01:00 | the sponsor step passes in the deployed app |
| 50% | 2026-11-25T21:04+01:00 | the whole journey passes on a phone |
| 75% | 2026-11-26T08:17+01:00 | freeze: readme, film, judges file |
| 90% | 2026-11-26T15:00+01:00 | submitted |

## riskiest assumption

Kane can reach and quote a real flagged scheme's public wording · hour-1 test: `kane-cli run` from mod-mountltd.com's homepage, read-only · result: **passed**. 6 steps, homepage → Help Center → FAQ. It stored "The Company reserves the right to charge a withdrawal fee depending on the circumstances…" and cost 23.3 credits (`evidence/hour1/`). Next risk: credits. 174 are left (~7 runs). We need the hackathon's 10,000.

## ideas dropped (and why)

- Wild Bugs, Lost & Found, Parity, Contact Sheet, The Other Reading, Whot Table, Docs Walker, Ajo Circle: too niche, generic or forced (human, 23 Nov)
- Can't Reproduce: crowded (Buglensa, ReproAgent, Reprise, Osloq)
- Portal Pal, Internet Movie, Lagos Escape (Ember): close to Docs Walker / weak Verified / forced agent role
- burner sign-up through the scheme's funnel: ethics, OTP walls, risk to TestMu's infrastructure (Astra round 5)
