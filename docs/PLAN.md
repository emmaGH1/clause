# plan: Shine Your Eye

> the human's. agents never edit this file: they propose one exact change (old line, new line, why), the human says yes, then `node scripts/status.mjs --approve "<why>"`.

## north star

- **singularity:** when someone pastes a "double your money" investment message they were forwarded, they get a 30-second Pidgin briefing for their family where every sentence comes from what Kane actually saw on the live site, and TestMu gets Kane as the witness the agent can't argue past: Kane's capture rewrites what the family hears.
- **the sponsor's job:** Kane CLI (`kane-cli run --agent`) walks the scheme's public pages, live, and captures the exact wording, screenshot and run ID (J2). A second, fresh Kane run opens our published briefing and confirms that the spoken sentence matches the capture before sharing is unlocked (J5).
- **main prize:** KaneCLI Online Hackathon 1st place (Verified + Closed loop break ties) · **extras:** launch-post reach (brownie points)
- **not building:** sign-ups or burner accounts, deposits, a WhatsApp bot, bulk scanning, a danger score, Exploration maps in the core path, custom animation, multiple languages beyond Pidgin + English captions

## the journey

each row has a check in `checks/journey.mjs`. `scripts/status.mjs` reads this table; keep the columns.

| id | step | done means (what a judge sees, on a phone, logged out) | sponsor |
|---|---|---|---|
| J1 | open it from the public link | the paste box ("Paste wetin dem send you") opens at phone width, not a landing page | |
| J2 | Kane reads the live site | the case shows Kane's exact quoted wording, its screenshot, the source page and a Kane run ID, and the quote equals the value in that run's raw Kane output | sponsor |
| J3 | the agent rewrites from Kane's evidence | the agent's first draft claim is shown struck out, beside the revised sentence that quotes Kane; anything Kane didn't capture reads "we couldn't verify" | |
| J4 | the family briefing | a 20–45 second Pidgin voice clip with English captions plays on the phone, built from the revised sentences, with the SEC notice attributed by date | |
| J5 | Kane checks our briefing | a second Kane run (different run ID) opened the published briefing, followed its receipt and confirmed that the sentence matches; only then is Share enabled | sponsor |
| J5! | fail-closed | pressing "Remove Kane's receipt" turns the sentence into "we couldn't verify", and Share and export are disabled | |

## winners-post lines

A Nigerian builder turned a forwarded investment link into a 30-second Pidgin briefing a family could share without opening the site. When the agent wanted to say customers had to pay to withdraw, **Kane found the site's actual fee wording and made the agent change what the family heard.**

## proof frame

One phone screen: Kane's screenshot crop with the conditional fee wording highlighted, above the family caption "Di site talk say dem fit charge withdrawal fee. We no fit confirm say dem dey force you pay before you withdraw." Below that: the capture time, the defanged host and the Kane run ID.

- the viewer's question: "does this site really make you pay to get your money out?"
- answers they might give: yes (what the WhatsApp message claims) · no · nobody knows
- the shot that settles it, with no voice or captions: the site's own sentence, in Kane's screenshot, next to the struck-out draft claim

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
