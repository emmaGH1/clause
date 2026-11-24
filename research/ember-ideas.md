# Ember ideas — ambition first

Research sub-agent, 23 Nov 2026. For the KaneCLI Online Hackathon ([kaneclihack.sh](https://www.kaneclihack.sh/)), deadline 26 Nov 11:59pm IST (7:29pm Lagos), ~2.5 days solo.

First pass is ambition. Feasibility is in the finalists, not the one-liners.

## The bar I am aiming at

Read the winners post myself ([TestMu blog](https://www.testmuai.com/blog/kane-cli-hackathon-winners/)). Three patterns:

1. **demo.studio (gold)** — Kane *performs* the product's job on a live site (narrated demo video), plus build partner, plus tester. Kane is runtime, not the test step at the end.
2. **GuardianKane (silver)** — Kane is a gate the agent cannot talk past. Breadth of evidence (4 defect types) beat one planted bug.
3. **KANE vs. ABLE (bronze)** — Kane is an *unscripted independent player*. Nobody handed it the solution; it solved the dungeon. That independence is the point.

The post says it plainly: none treated Kane as a test runner at the end of a pipeline. And it closes by pushing `kane-cli explore`: map screens and flows from one URL. Six weeks later TestMu shipped the features August winners did not use — Exploration end-to-end (28 Oct, up to 20 parallel cloud browsers, React Flow live map, per-finding clips, re-check leases), policy gates over sealed evidence packs (`--policy-id`, `evidence verdict`), real Android/iOS devices (15 Oct), tunnels to private backends (7 Nov), `--agent` NDJSON everywhere. Zero of the landscape sample uses Exploration or policy gates as the product. That is the lane.

Judging is 25/25/25/25 Ships / Verified / Closed loop / Craft, ties break Verified then Closed loop. So a bigger idea still needs a *meaningful Kane finding or confirmation* and a *visible agent decision from Kane evidence*. Onred lost as a toy because it verified the builder's own cart and one planted bug. Avoid that disease: favour Kane working on **real external sites** (JAMB, CAC, Maps, demo stores) where nobody can claim planted.

Human world (used only where natural): Lagos traders, gov portals, cash anxiety, webtoons, geology, ElevenLabs clone + HTML-to-video.

Rejected, not resubmitted: Wild Bugs, Lost & Found, Parity, Contact Sheet, The Other Reading, Whot Table, Docs Walker, Ajo Circle, Can't Reproduce. Crowded: red→patch→green, stop gates, README/claims-to-tests, mutation, PR/CI bots. Organiser-suggested (likely crowded): self-healing checkout, PR bot, README lie detector, agent game, two-agent adversarial.

---

## 14 one-liners

Format: When &lt;person&gt; &lt;does one action&gt;, they get &lt;result&gt;, and TestMu gets &lt;what&gt;.

1. **Portal Pal.** When a trader drops a government portal link they dread (JAMB, CAC, NIMC), they get a one-page Pidgin/English step card proven against that portal *today* — and TestMu gets `explore run --policy read_only` mapping a hostile civic site plus a policy gate judging "did the card hallucinate a step?"
2. **Kane Directs the Internet Movie.** When a viewer picks a genre (heist, horror, love story), they get a 3-minute film acted live across 5 real websites as sets with Kane as the actor, and TestMu gets Kane doing unscripted real jobs on the open internet — performance as Verified, not a test runner.
3. **Kane's Lagos Escape.** When a player is shown a street photo from Lagos and asked "where was this taken?", they get to watch Kane hunt the answer live on Maps/search and drop the pin, and TestMu gets Kane as an unscripted navigator on a real world map — KANE vs. ABLE, but the dungeon is Lagos.
4. **Price War Referee.** When a shopper drops two competing shop URLs for the same basket, they get a ringside verdict on the true cheaper total after delivery and surprise fees, and TestMu gets `--max-parallel` cloud browsers fighting in parallel corners of the ring.
5. **Flash Sale Swarm.** When a seller presses "start flash sale", they get a 20-Kane crowd hitting Buy at the same second from different countries and devices, with oversell and slow-request evidence before real customers arrive, and TestMu gets the full 20-browser HyperExecute swarm as the show.
6. **Kane Sits the Exam.** When a student drops a practice-exam URL, they get a live invigilated mock where Kane sits it *explained* and a second Kane cross-examines each answer against sources, and TestMu gets a real-device run plus an `evidence verdict` on academic honesty: did it guess?
7. **The People vs. Your Checkout (Courtroom).** When a builder drops their checkout URL, they get a public trial where Prosecution-Kane argues 5 crimes (slow, inaccessible, confusing) and a policy judge delivers the verdict as a sealed evidence pack, and TestMu gets policy gates as the judge on screen.
8. **Museum of the Dying Web.** When an archivist drops a dying site URL, they get a playable expedition film preserving it before it vanishes — Kane with a machete cursor, agent as mapmaker — and TestMu gets the Exploration map itself as the museum floorplan.
9. **Bank Teller on Real Android.** When a first-time user drops a Nigerian fintech onboarding URL, they get a real-Android walkthrough on a cheap phone and slow network proving the flow works, filmed with device evidence, and TestMu gets the newest 0.9.0/0.10.3 path: real devices plus tunnels to private backends.
10. **Haggle Coach.** When a diaspora shopper drops a Naija market listing, they get a live haggling coach where Kane negotiates in Pidgin in the listing's own chat while the agent translates tactics, and TestMu gets `explore --policy mutating` doing a real negotiation no read-only crawler can.
11. **Mystery Shopper Crowd.** When a small seller drops their own store URL, they get 10 persona Kanes (broke student, auntie on 3G, diaspora on iPhone, keyboard-only user) buying at once and a findings film, and TestMu gets parallel browsers plus axe findings as a crowd, not a single user.
12. **The Jury.** When a builder drops an app URL, they get 12 Kanes each attempting a different task and voting guilty/innocent, with the tally as a policy verdict, and TestMu gets a multi-agent society where disagreement is the evidence.
13. **Kane the DJ.** When a musician drops a web synth URL, they get a live set where Kane composes the beat by performing on the synth and the agent arranges structure, with crowd vote, and TestMu gets Kane as a creative performer operating a real instrument UI.
14. **Night Watchman.** When a small team drops their app URL at close of business, they get a morning report where 5 night Kanes patrolled all night, tried to break it, and left clip incident cards, and TestMu gets long-running Exploration with re-check leases marking reproduced / not_reproduced overnight.

---

## Finalist 1 — Portal Pal (bet)

**One-liner.** When a trader drops a government portal link they dread (JAMB, CAC, NIMC), they get a one-page Pidgin/English step card proven against that portal *today* — and TestMu gets `explore run --policy read_only` mapping a hostile civic site plus a policy gate judging "did the card hallucinate a step?"

Universal frame (so it is not niche): every country has a portal that lies to you. Lagos is the proof, not the limit. JAMB and CAC both return 200 guest-reachable today (checked 23 Nov); Jumia returns 403 to bots — a reminder to pick portals over shops.

### 60-second film storyboard

- **0–8s — the dread.** Phone in hand, trader on screen (or HTML-to-video re-creation): JAMB homepage, broken link, spinner. Voice (ElevenLabs): "Nobody warns you. The portal changed again." Search bar: "JAMB result checker".
- **8–18s — the map.** Paste URL. Split screen: left, Kane's Exploration live map blooming (screens, flows, findings in red); right, blank card assembling. Kane has never seen this portal. No script. Caption: "Kane is mapping it like a stranger."
- **18–30s — the card lies, Kane catches it.** Card draft appears: "Step 3: tap *Print result*." Kane follows the card *as a visitor* (`kane-cli run "Follow these steps exactly..."`). Red flash: button says *Check result*, not *Print*. Narrator: "The card was wrong. Kane just proved it."
- **30–45s — the rewrite.** Agent rewrites Step 3 from the screenshot, re-sends Kane. Green: Kane reaches the result page, screenshot pinned to the card. Policy verdict stamps the card: *VERIFIED — no hallucinated steps.*
- **45–60s — the handoff.** Card + evidence pack + map link. On-screen: "Paste the next link." Cut to Lagos street. Caption: "Kane Pal. No more guessing at the queue."

### How the agent and Kane talk

Loop is *advice revision*, not code patching — deliberately not a repair loop:

1. Agent: `explore run --project X --url <portal> --policy read_only --prompt "Map the public info flows a first-time citizen needs"` → map + findings NDJSON.
2. Agent drafts step card (3–5 steps) from map screens/flows.
3. Agent → Kane: `kane-cli run "Follow this card exactly as a first-time citizen would. Store each step's reached screen and any mismatch as 'mismatch'" --agent`. Kane's `final_state` + step screenshots come back.
4. Agent compares card vs Kane evidence. If mismatch, rewrites *only that step*, re-sends Kane the same objective with revised card. Two revisions max.
5. Policy gate: `evidence verdict` over the sealed pack against "every card step was reached by Kane on the live portal and no step describes a control Kane did not see." Pass → publish card with timestamp + run id.

Genuine because Kane's screenshot changes the next card text on screen. No code fix, no stop gate — the loop edits *words*, and the film shows the words changing.

### What is real

Live JAMB/CAC/NIMC public pages (no login, no fabricated users). Real Exploration map with real screens/flows/findings. Real Kane visitor runs with step clips. Judge can reopen the portal and check the button label themselves. Artist: no fake "10,000 traders" stats; if we claim demand we say "inferred from queue stories, not interviewed" — or better, we don't claim it. Need 2 portals minimum so the second is a blind test.

### Riskiest hour-1 assumption

That `explore run --policy read_only` returns a usable map of a real portal within credit/time budget *without* login/CAPTCHA walls, and that `kane-cli run` can follow a card step on that portal and report a screenshot. JAMB/CAC returning 200 on HEAD does not guarantee guest flows work in a cloud browser (Jumia-hot warning). If Exploration stalls at sign-in or Kane cannot read the portal's controls, kill it before UI time — see Hour-1 gate below.

### Why a TestMu judge would put it in the winners post

> "A trader pasted a portal link she dreaded and got a step card Kane had actually followed as a stranger. When the card invented a button, Kane caught it on the live site, the agent rewrote the step, and Kane proved the fix — no hallucinated steps."

### Closest existing thing

Landscape: *Signed Off* (requirements-to-proof), *README PROOF* (claims-to-tests), *Docs Walker* (rejected: Kane follows tutorials, refreshes screenshots), *Wild Bugs* (rejected: Explore + fix upstream). Wedge: none of these is a *citizen-facing* card verified on a *hostile third-party portal* with a policy gate judging hallucination; Docs Walker verifies our own docs, Portal Pal verifies advice about *someone else's* site. Web collision searches (Bing, 23 Nov: "AI navigate government portal citizen guide", "nigeria government portal JAMB CAC help guide") returned only generic AI/government pages — no dedicated portal navigator found. GitHub API: 0 repos for `kane cli geoguessr` / `kane cli explore` (limited query, not a census).

---

## Finalist 2 — Kane Directs the Internet Movie

**One-liner.** When a viewer picks a genre (heist, horror, love story), they get a 3-minute film acted live across 5 real websites as sets with Kane as the actor, and TestMu gets Kane doing unscripted real jobs on the open internet — performance as Verified, not a test runner.

Bigger than demo.studio on purpose: demo.studio *explains* a site; this *performs* on sites. A tutorial says "here is how checkout works"; a heist movie puts Kane *inside* the shop as the character. Director-adaptive, not narrated walkthrough.

### 60-second film storyboard

- **0–8s — the pitch.** Title card, ElevenLabs director voice: "The internet is the film set. Kane is the actor." Genre chips: Heist / Horror / Love. Big button: *ROLL CAMERAS.*
- **8–18s — Day 1: the market (Amazon/Supermart as location).** Kane on screen, cursor as character. Objective: "You are the thief. Find the most expensive item under ₦50k and describe its label." Kane scrolls, hesitates, reports. Agent (director) reads Kane's description and writes the next line of dialogue *from what Kane actually saw*. Caption: "The next scene depends on Kane's eyes."
- **18–32s — Day 2: the library (Wikipedia as location).** "Find a woman inventor and prove it with two sources." Kane hunts, clip evidence. Split-screen: Kane's view + director's script updating live. Narrator: "No one scripted Kane's route."
- **32–45s — Day 3: the getaway (Maps).** "Find a route that avoids the expressway." Kane pans Maps, drops a pin. Green stamp on the storyboard.
- **45–60s — the premiere.** 60-second cut played back: Kane clips in sequence with agent-written captions, ElevenLabs narration over the top. End card: "Filmed live. No sets. No actors. One browser agent." Launch-post bait.

### How the agent and Kane talk

Director/actor loop, not test/patch:

1. Agent (director) picks next scene from genre graph + Kane's last report. Sends Kane: `kane-cli run "You are <role>. <job on this real site>. Store the proof as 'proof' and the surprise you saw as 'note'" --agent`.
2. Kane performs on the real site, returns `final_state.proof`, `final_state.note`, step screenshots + `run_end` status.
3. Agent uses `note` (Kane's own words about what it saw) to write the *next* scene's objective and on-screen caption. If Kane failed to reach the set, agent picks a different set — never replays the same clip as "success".
4. Final film is assembled from Kane's clips in order, with captions quoting Kane's `note`s verbatim. If Kane discovered a broken link/console error on a set, that becomes a title card: "Even the set was broken."

Genuine because the script literally cannot be written before Kane acts — the agent's next prompt contains Kane's description of the previous site. Judge can check: open the run log, see `proof`/`note` flowing into the next objective.

### What is real

Five real public sites (Amazon/Supermart catalogue, Wikipedia, Google Maps, automationexercise.com — all return 200 guest-reachable 23 Nov). Real Kane clips. Real surprise notes. No fabricated movie: if Kane fails a scene, the film shows the failure and the director's recovery. Studio needs: one fixed genre + 5 sites + 3 scenes for the hackathon cut (genre picker can be single-genre with three seeds under the hood).

### Riskiest hour-1 assumption

That two `kane-cli run` jobs on two different real sites return readable `final_state` (`store ... as 'proof'`) *and* step screenshots we can feed to the writer agent within one round-trip, without login/CAPTCHA/geo walls. If extraction is flaky (ambiguous prices, robot checks), the director has nothing to write from and the film is staged. Test this before building any player UI.

### Why a TestMu judge would put it in the winners post

> "Kane starred in a film acted live across real websites, with the next scene written from what Kane actually saw. The browser agent was not testing the movie — it was the movie."

### Closest existing thing

Landscape + winners: *demo.studio* (gold, Kane films narrated demos — the lane, but tutorial not drama), *KANE vs. ABLE* (Kane plays a planted dungeon — ours plays the unscripted open internet), organiser suggestion "Wikipedia speedrun bot" (speed, not narrative), *The Other Reading* (rejected: branching stories — ours is not a reader, it is a performance). Web searches (Bing: "browser agent film movie websites actors", "browser agent plays Geoguessr AI") returned only generic browser/AI pages — no browser-actor film found. GitHub: no collision repo surfaced.

---

## Finalist 3 — Kane's Lagos Escape (GeoGuessr)

**One-liner.** When a player is shown a street photo from Lagos and asked "where was this taken?", they get to watch Kane hunt the answer live on Maps/search and drop the pin, and TestMu gets Kane as an unscripted navigator on a real world map — KANE vs. ABLE, but the dungeon is Lagos.

### 60-second film storyboard

- **0–8s — the challenge.** Street photo fills screen: ochre shop, sign in Yoruba/English, danfo. Voice: "Where in Lagos was this taken? Kane gets one browser. No hints." Countdown starts.
- **8–22s — the hunt.** Kane's browser live: searches a sign, opens Maps, pans Street View, zooms. Step captions: "Reading the sign…", "Checking the bus stop…", "Comparing shop fronts…". Editor trick: 3 speed-ramps, keep one hesitation (Kane unsure) — that is the suspense.
- **22–35s — the wrong pin.** Kane drops inside Lekki. CUT TO: true location in Ikeja. Red stamp: "2 km off." Narrator: "The agent is not happy. The next photo gets harder."
- **35–50s — the fix.** Agent reads Kane's last search terms + screenshot, picks a harder photo with fewer signs, Kane hunts again, drops inside 300m. Green stamp: "ESCAPED."
- **50–60s — the verdict.** Map pulls back: start photo, two pins, distance. Caption: "Kane was not scripted through Lagos. It found its way out."

### How the agent and Kane talk

Adaptive-difficulty loop:

1. Agent picks photo + true pin (from a small rights-cleared Lagos set, 8–12 photos) and sends Kane: `kane-cli run "Find where this street photo was taken using the web and maps. Store your best guess area as 'guess' and your evidence as 'evidence'" --agent` with the photo as upload (`{{file.photo}}`).
2. Kane reports `guess` + step screenshots. Agent computes distance to true pin (haversine, no Kane needed).
3. If distance &lt; 500m, agent raises difficulty for the next photo (fewer signs, denser market) and tells Kane the new photo. If Kane is stuck (&gt;3km), agent offers a *compass clue* derived from Kane's own failed search terms ("You searched 'Lekki mall' — try the market side") and Kane re-hunts. Document the clue so the loop is visible.
4. Win = two consecutive &lt;500m pins. Publish pins + clips + distance ledger.

Genuine because the next photo and clue change based on Kane's scored error, and the clue quotes Kane's search history. Not a repair loop, not a stop gate — a coach loop.

### What is real

Real Lagos photos (publicly licensed/own phone photos with locations), real Google Maps/Street View as the board, real Kane hunt clips, real distance math. No fake leaderboard. Judge can open the winning pin in Maps and compare with the clue photo. If Kane uses image search, that is allowed and shown in steps — it is still real hunting, not cheating, provided we say so.

### Riskiest hour-1 assumption

That Kane can get from photo → *some* verifiable guess via browser search + Maps within a bounded number of steps and credits, and that the guess is *readable* (`store ... as 'guess'`) without Street View teleports stalling it. Maps UI is heavy; if Kane cannot pan/zoom or reads nothing, the whole game collapses. Must test with one hard photo in hour 1; if Kane stalls, pivot to "Kane as trivia researcher" (search-first, Maps second) or kill.

### Why a TestMu judge would put it in the winners post

> "We showed Kane a Lagos street photo and Kane searched the live web to find it. The first pin was 2 kilometres off; the agent made the next photo harder and Kane closed to 300 metres."

### Closest existing thing

GeoGuessr exists as a game (geoguessr.com returns 200; the *game* is not the claim — Kane as an unscripted player with clip proof is). Winners: *KANE vs. ABLE* (planted dungeon — ours is the real world, no planted maze), *Playtest Studio* (Kane checks game rules — ours *plays*, not checks). Organisers suggest "agent that beats a browser game on vision alone" — GeoGuessr-adjacent, so expect some convergence; wedge is *real-world place-finding with adaptive coaching*, not beating a browser game. GitHub API: 0 repos for `kane cli geoguessr`. Bing collision searches surfaced no Kane GeoGuessr player.

---

## Ranking, bet, honest stretches

**1. Portal Pal — BET.** Best prize odds. Hits all four bars with tiebreakers strongest: Verified is a live hostile portal (undeniable), Closed loop is visible word-rewrites driven by Kane screenshots (tighter and fresher than patch loops), Ships/ Craft is a one-page card a judge can reopen on their phone. Uses both Oct features TestMu wants shown next (Explore read_only + policy gate) in their *intended* roles. Film is calm-vs-chaos, universally felt (everyone has fought a portal). Buildable in 2.5 days *if* Hour-1 gate passes.

**2. Kane Directs the Internet Movie — film/virability bet.** Most spectacular, most gold-lane (Kane as runtime/star), simplest build (no store, no login, no parallel, no device plan), ElevenLabs voice does real work. Risk: Verified/Closed-loop scoring weaker than Portal Pal (performance vs defect), and it must be *clearly bigger* than demo.studio or it reads as a reskin. Ship it only with the director-adapts-to-Kane-notes mechanic visible in the film.

**3. Kane's Lagos Escape — wow/stretch bet.** Most memorable single image (Kane lost in Lagos, finding its way out), most ABLE-like ("Kane was not scripted... it solved it") but on the real world. Risk: highest Hour-1 technical risk (Maps navigation) and closest to organiser-suggested "agent game". Keep as third, not first, because Ships is hardest to guarantee on a clock.

**Cut for feasibility (saying it straight):**
- *Price War Referee* — wow is ringside, but two-shop alignment + bot walls (Jumia 403) makes Hour 1 a lottery. Keep as backup only.
- *Flash Sale Swarm* — 20 parallel is the best TestMu flex, but credit/parallel Hour-1 risk + own-store toy risk (Onred's ghost) kills it for a solo 2.5-day sprint. Would win if we had 5 days.
- *Bank Teller on Real Android* — newest-feature story is perfect, but real-device plan entitlement is unproven on a fresh account. Too much entitlement risk to bet the sprint.
- *Courtroom / Jury / Night Watchman* — filmable, but each risks reading as a stop gate or Wild Bugs in costume. Portal Pal's word-rewrite loop is cleaner.
- *Haggle Coach / Mystery Shopper Crowd* — commerce-culture charm, but mutating live chats + persona crowd is the most credits-hungry build of the set.
- *Kane Sits the Exam / Museum / DJ* — delightful, but exam integrity framing and synth operation are Hour-1 gambles with lower Verified ceilings. Museum is second reserve if agents want a poetic fallback.

### Hour-1 gates (kill before UI — any finalist)

1. Install Kane (`npm install -g @testmuai/kane-cli`), `whoami`/`balance`, one `kane-cli run "... store ... as 'x'" --agent` against the finalist's *actual* target site. Require: `run_end` + `final_state` + ≥1 step screenshot the writer/agent can actually read.
2. Portal Pal: one `explore run --policy read_only --max-leases 40` against JAMB/CAC. Require: ≥5 screens + ≥1 flow in the map. If login wall: try the other portal; if both wall, kill.
3. Movie: two Kane jobs on two different sites (Wikipedia + Maps/demo store). Require: both return `proof`/`note`. If either blocks: swap site once, then kill.
4. Lagos Escape: one photo → one Kane guess with screenshot. Require: guess distance &lt;5km or a plausible search trail. If Kane stalls on Maps: switch to search-first brief once, then kill.

Setup that every finalist needs by end of hour 4: Next.js shell on Vercel + VM worker polling jobs, streaming Kane NDJSON steps to the page, immutable run ids, recorded fallback run for the demo. Freeze features at 75%, film + posts after (submission needs public repo from 12 Nov, YouTube 3–5 min, two public posts).

---

## Appendix: collision searches + sources

- Winners post: https://www.testmuai.com/blog/kane-cli-hackathon-winners/ (read 23 Nov)
- Event/rules/judging: https://www.kaneclihack.sh/
- Kane CHANGELOG (0.10.3 7 Nov; 0.10.0 28 Oct Exploration + policy gates; 0.9.0 15 Oct real devices): https://github.com/LambdaTest/kane-cli/blob/main/CHANGELOG.md
- Exploration docs: https://www.testmuai.com/docs/kane-cli-exploration
- Landscape/minefield file read: research/terra-landscape.md (69 Aug submissions, crowded patterns, showcase items); rejected set per brief.
- Quick web checks 23 Nov via Bing/GitHub API/curl (no search tool loaded; Bing generic results were thin, GitHub API returned 0 for `kane cli geoguessr` / `kane cli explore`; HEAD checks: jamb.gov.ng 200, cac.gov.ng 200, geoguessr.com 200, automationexercise.com 200, supermart.ng 200, jumia.com.ng 403). Treat as "no collision surfaced in a brief search", not proof of absence.
- No authenticated Kane run was conducted for this research. All Hour-1 gates are unrun. Demand claims are inferences; build estimates are 2.5-day solo inferences.
