# Opus round 4: fresh ideas after the human's feedback

Feedback (23 Nov): earlier ideas were too niche or small, not worth filming, and felt generic and forced next to the winners.

What the winners had that ours lacked: a thing you would show a friend (a demo video, a game), where Kane is visibly *the actor*, not the auditor.

## 1. Whot Table: Kane vs Kane (recommended)

**When** two friends open a Whot table, **they get** an online Naija Whot game whose rules and sync were proven by two Kanes playing full matches against each other, **and TestMu gets** two independent Kane sessions in one live multiplayer room, catching what no single-browser test can see: the two players' screens disagreeing.

- Agent builds multiplayer Whot from the official rules (Pick Two, Pick Three, Hold On, Suspension, General Market, Whot 20 shape request).
- Two Kane sessions are seated as Player A and Player B. Each turn, Kane gets "play one legal card for your hand, then report the top card, the shape being asked for, and both hand counts". Nothing scripts which card to play.
- The agent cross-checks the two reports and the server state. If they disagree (desync), or a legal move is refused or an illegal one accepted, that is a finding. Agent fixes, rematch.
- A match is "certified" when a full game ends with both Kanes agreeing at every turn. A policy gate judges the evidence pack.
- The bugs are real: a first multiplayer build has them (special cards, turn order, reconnects). Nothing planted. If none surface, a certified full game is still a real confirmation.

Winners-post lines: "Two Kane agents sat at the same Whot table and played each other. Neither was scripted. When Player A's screen said *Pick Two* and Player B's didn't, Kane caught a sync bug a single-browser test cannot see, and the agent fixed it before the rematch."
Claim to prove: **two concurrent, unscripted Kane players, and a disagreement between their views drove a fix.**

Proof frame: split screen, two Kane browsers, the same table, with a red "views disagree on turn 14" bar. Then the green rematch.

Collision: KANE vs ABLE (Kane vs the agent's escape room) and Playtest Studio (Kane checks game rules). Wedge: Kane vs Kane in one live room; the bug class is multi-player desync. Existing Whot sites (PlayWhot, Naija Whot) are reference only.

Launch-post upside: Nigerian Twitter knows Whot. "Watch two AIs play Whot" is shareable, and organizers give extra credit for reach.

Hour-1 risks: (a) can two Kane sessions run at once (cloud or two local Chromes)? (b) can Kane read the cards and choose a legal one? Use DOM cards with labels, not a canvas. (c) seconds and credits per turn. Use a short-hand variant (4 cards each) so a match is about 20 Kane runs.

Score: sponsor 2 · both halves 2 · gate 1 (until the account works) · real 2 · buildable 1 = 8/10. Human's world: yes (Nigeria).

## 2. Docs Walker: the tutorial is the test

**When** a maintainer points it at their getting-started guide, **they get** a docs PR in which every step was actually performed by a newcomer-like Kane and every screenshot is retaken fresh, **and TestMu gets** Kane running prose as its script, which is what natural-language testing is for.

- Each tutorial step, verbatim, becomes a Kane objective on the live app. If Kane can't do step 4 as written, the docs (or the product) are wrong. The agent rewrites the step or fixes the app, and Kane walks the guide again.
- The payoff shows up even when nothing is broken: the screenshots are refreshed.
- Real data: a real open-source project's tutorial against its public demo.
- Risk: closest to README PROOF (claims to checks), and it's a dev tool, which is less fun to film. Score 7/10. Agent-only.

## 3. Ajo Circle: four Kanes, one savings group

**When** four friends run an ajo/esusu (rotating savings), **they get** one shared ledger where everyone sees the same "who paid, who collects next", **and TestMu gets** four Kane members acting at once, proving every member's screen agrees.

- Same multi-actor idea as Whot, applied to money. More "people use it", less fun, and there are no real payments (the money would be made up). Score 6/10.

## Dropped this round
- "Can't Reproduce" (Kane turns vague bug reports into reproductions): crowded. Buglensa, ReproAgent, Reprise, Osloq and Metabase's Repro-Bot all exist.

---

# Round 5 (after "these ideas are poor, add Ember, stop limiting yourselves")

Ember's file: research/ember-ideas.md (Portal Pal, Internet Movie, Lagos Escape).

## Opus new pick: Shine Your Eye — Kane walks into the Ponzi so you don't have to

**When** someone gets a "double your money" investment link on WhatsApp and forwards it, **they get** a 30-second Pidgin/English video of Kane signing up with a burner identity and walking the whole funnel (deposit page, withdrawal rules, "pay to unlock withdrawal", fake testimonials), with every red flag shown as a screenshot from the live site, **and TestMu gets** Kane as the runtime of a product nobody could build without a browser agent, plus Exploration and a policy gate that refuses any claim Kane didn't capture.

- Real specimens: platforms the SEC Nigeria has flagged (Aurum bot/Modmount, Glorious Wealth Fund, AfriQuantumX, TOSAF) and live crypto-scam reports. SEC's May 2026 notice warns about Ponzi schemes on WhatsApp, TikTok and Instagram.
- Loop: Kane explores and signs up (burner, never deposits) → the analyst agent drafts red flags → each flag becomes a Kane objective on the live site ("find where withdrawal conditions are stated; store the exact text") → a policy gate strikes any flag without Kane evidence (defamation safety: we only say what Kane saw) → the agent rewrites the verdict → the card and clip are published.
- Kane in 3 layers, like gold: runtime (walks the funnel), gate (no evidence, no claim), and tester of our own app.
- Film: "We sent an AI into a Ponzi scheme so you don't have to." Strong Nigerian-Twitter reach for the launch posts.
- Hour-1 risks: are flagged sites still live (they die fast), can Kane sign up (OTP, CAPTCHA), and will cloud browsers load them (if not, use local Chrome).
- Collision: no agent that walks scam funnels found (23 Nov search). URL-reputation tools (ScamAdviser) don't walk the funnel.
- Score: sponsor 2 · both halves 2 · gate 1 · real 2 · buildable 1 = 8/10, human's world: yes (Nigeria + crypto).
