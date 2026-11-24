# KaneCLI Online Hackathon judge review

**I’d give Onred 70/100. The loop was real. The demo proved a one-line repair that Onred had deliberately set up, and the submitted hosted path lacked a documented end-to-end smoke test.** These are my scores using the published rubric. I have no judge ballots or submission packet and did a desk review. The 69 entries are from August. The [landscape](/data/home/.t3/projects/kane-hackathon/research/terra-landscape.md) is a sample of public projects across events. [August winners](https://www.testmuai.com/blog/kane-cli-hackathon-winners/) · [November rules](https://www.kaneclihack.sh/#judging)

## 1. Why Onred likely missed the podium

| Dimension | My score | What earned or cost points |
| --- | ---: | --- |
| Ships | 15/25 | The handover records a guarded run that went 2/3 → patch → 3/3. It identifies Vercel → free Render as the submitted path and leaves the hosted smoke test and committed-tree rehearsal unchecked. The README points judges to localhost and recommends Railway. Cold starts, ephemeral state and two local authentications made the exact path harder to trust and try. |
| Verified | 18/25 | A real Chrome assertion distinguished quantity 2 and total $40 from a header count of 1. The unchanged contract passed after the edit, and the README links a Kane run. The claim was narrow. The demo always swapped `sum + i.qty` for `sum + 1` in the sole editable file. It showed that Kane could catch that regression and verify its reversal. The receipt hash adds integrity to the record. The scope of proof is still one fixture and one repair. |
| Closed loop | 22/25 | The strongest dimension. Kane failures enter the opencode prompt with the spec, changed files are checked, Kane reruns, and fresh red evidence can trigger another bounded attempt. Infrastructure failures stop the loop. The documented demo resolves on attempt one, so the retry branch adds engineering credit while the actual proof covers a single pass through the loop. |
| Craft | 15/25 | The visible diff, verdicts and run ID give the receipt a clear job. A “30 seconds” judge path starts at localhost with Node, Chrome, Kane and an authenticated opencode provider, and the final suite alone took 144 seconds. I could inspect the example, but I had little reason to install a console demonstrated only against its own cart. |

**Inference.** The podium gap was the breadth of the proof and the reason to use the product. GuardianKane also showed checkout repair, but its published case included a reusable Claude Code extension and earlier runs that caught several kinds of defects. KANE vs. ABLE let Kane discover an actual dependency problem from a browser objective and gave viewers a payoff they could understand immediately. Onred’s receipt was worth keeping. The demo needed a job that made someone want a second receipt. [Onred README](https://github.com/emmaGH1/onred#readme) · [Handover](https://github.com/emmaGH1/onred/blob/main/HANDOVER.md) · [Loop code](https://github.com/emmaGH1/onred/blob/main/lib/loop.ts) · [August winners](https://www.testmuai.com/blog/kane-cli-hackathon-winners/)

## 2. What survives the 20-second read

**Inference, from a simulated judge’s queue.**

- **I stop** at the organizer’s sample idea with its nouns changed, the third checkout mutating a known line, a stop hook whose only evidence is a green badge, and any README that makes me install two tools before I can see what the product yields. A log viewer with a Kane logo has the same problem.
- **I lean in** when I can see who needs it, the browser or phone state they care about, and the action the agent takes because Kane observed that state. Give me a fresh input I can change and a result I can check.
- **I put it in the winners post** when I can write two specific sentences: who did what and what Kane observed that changed the outcome. I want one frame that shows the evidence and the downstream action, plus a rerun or recorded fallback. August gave TestMu three different stories to tell: Kane filmed a real walkthrough, enforced a developer’s completion criteria, and independently solved a playable room. [August winners](https://www.testmuai.com/blog/kane-cli-hackathon-winners/)

## 3. What TestMu wants more of

**Published judging.** The entry must work end to end, make a meaningful Kane finding or confirmation, and show Kane communicating with the agent. The four scores are equal. Ties go to Verified, then Closed loop. Two distinct public posts on Hacker News, X, Reddit or LinkedIn are mandatory. More posts, reach and engagement get bonus consideration. The rules give no numeric weight for reach. [November rules](https://www.kaneclihack.sh/)

**Published product direction.** The dated changelog goes beyond the landscape’s October snapshot. Remote Android emulator and iOS simulator runs arrived in 0.8.13 (Sep 14). Shareable context stores over GitHub, S3-compatible storage or a folder followed in 0.8.14 (Sep 15). Suite-level `testrun run --agent` and mobile replay fixes for grid hooks and output variables landed in 0.8.21 (Oct 5), with further replay parity in 0.8.22. Real-device runs followed in 0.9.0. The Oct 28 release expanded linked-project operations and standardized NDJSON agent mode across commands. The Nov 7 entry adds tunnel support for private backends and fixes Android tap mapping. The README lists separate access requirements for HyperExecute and real devices. [Changelog](https://github.com/LambdaTest/kane-cli/blob/main/CHANGELOG.md) · [Kane CLI README](https://github.com/LambdaTest/kane-cli#readme)

**Inference.** I’d want a reference example an engineer could reuse: one approved criterion shared across workspaces, or one native-device replay whose structured verdict drives a visible agent decision. Each gives TestMu a specific capability to demonstrate. I’d make the two public posts useful on their own: a short payoff clip for users and a reproducible integration walkthrough for developers. I see no published feature bounty, private roadmap or fixed reach threshold.

## 4. Six kill questions

1. **Eligibility.** Can we qualify by **26 Nov, 11:59 p.m. IST** with a fresh public repo started on or after Nov 12, event and TestMu registrations under the same email, a Kane run, a 3–5 minute YouTube demo, two public posts, and working access and fallback where needed?
2. **Reason to use it.** Who would run this twice, and what work does the second run save them?
3. **Kane’s job.** Which promised result disappears if Kane is disabled?
4. **Verification.** What fresh input and independently checkable screen state would make Kane say yes or no? Can a judge inspect both outcomes?
5. **Closed loop.** Which Kane event changes the agent’s next action? Can we show the original evidence, the action it caused, and verification of the outcome?
6. **Delivery and craft.** Can we prove the riskiest dependency in hour one, make the whole path repeatable by halfway, and show the payoff in the first 20 seconds?

Apply the eligibility and three technical bars before debating novelty. [November rules](https://www.kaneclihack.sh/)

## 5. Three directions I’d want to see

These are proposals, with the solo scope and dependencies stated. For each, capture an agent-built iteration where Kane’s evidence changes the delivered workflow and verify the finished workflow end to end.

**1. Android handoff verifier.** A mobile release engineer pastes a support link and learns which of two app builds opens the exact ticket. Kane replays the same deep-link test on the two APKs with a ticket ID supplied for this run. The agent consumes the suite events, selects the build with a confirmed match, and uses a fresh replay to confirm its recommendation. Show the requested ID beside the actual screen and device/run evidence. **Scope.** one Android target, one screen, two APKs, one link format. Prove upload, entitlement and parameterized replay in hour one. Drop the direction if remote execution is unavailable and no supported local target is in hand. [Kane mobile targets and prerequisites](https://github.com/LambdaTest/kane-cli#readme)

**2. QA shift handoff.** An incoming QA engineer pulls one changed acceptance criterion into a clean workspace and gets evidence for the current rule. Demo one genuine revision to a small app’s cancellation policy. The second workspace starts with stale coverage. The agent uses Kane’s reconciliation and coverage information to select the affected case, runs the reviewed revision, then checks that the current criterion has evidence before issuing the handoff. Show the same criterion ID, old and new rule, changed case and fresh run. **Scope.** two local workspaces, one shared folder store, one criterion and one browser. Prove that a clean second workspace can pull the change and link a fresh verdict to it before building any UI. [Kane changelog](https://github.com/LambdaTest/kane-cli/blob/main/CHANGELOG.md)

**3. Print before closing.** A library patron gives a preferred branch and arrival time. Kane checks the official posted hours and printing instructions in the browser. If the first branch is closed then or the hours are ambiguous, the agent tries the next candidate and asks Kane to verify the recommendation against the original time. Show the rejected branch and the chosen branch with the source excerpts and timestamps. The claim is that the posted hours and service fit the request. **Scope.** San Francisco Public Library, three branches, one small form, no accounts or booking. Prove two live browser outcomes in hour one. I’d pick this for the short build because the payoff is immediate and the evidence comes from a live public source. [SFPL locations](https://sfpl.org/locations) · [SFPL services](https://sfpl.org/services)
