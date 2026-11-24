# Opus brainstorm (round 3)

## What the winners blog actually teaches

1. **Kane is never "the test step at the end."** demo.studio: Kane *is the runtime* (it performs the product's job on someone else's site). GuardianKane: Kane is *a gate the agent can't bypass*. KANE vs ABLE: Kane is *an unscripted independent player*. Post: "None used Kane CLI as a test runner at the end of a pipeline."
2. **Unscripted beats scripted.** "Kane was not scripted through the dungeon. It solved it." Judges value Kane *discovering* something nobody told it, not replaying a planted bug.
3. **Layered use wins gold.** demo.studio used Kane 3 ways (build partner, runtime, tester). "the build loop, the runtime, and the safety net at once."
4. **Breadth of evidence.** GuardianKane cited 4 experiments catching different real defect types. One planted bug (Onred) reads as a toy.
5. **Their closing CTA pushes Exploration** (`kane-cli explore`): "maps screens and flows from one URL." That's what they want shown next.

## What TestMu shipped since August that nobody in the landscape sample uses

- **Exploration (0.10.0, 28 Oct):** `explore run` — autonomous explorer maps screens/flows, finds problems (console, network, broken link, slow request, axe accessibility), designs tests, up to 20 cloud browsers, `--policy read_only|mutating`, re-check leases mark findings reproduced / not_reproduced, `explore view` live React Flow map, finding lifecycle (open→bug→resolving→resolved).
- **Policies & evidence gates (0.10.0):** `kane-cli policy`, `--policy-id` on `testmd run` / `testrun run` / `evidence merge` judges a sealed evidence pack against a policy; `evidence verdict`, `evidence lint-policy`.
- **Shared/linked projects, `maintain evolve`, assurance-job**, real devices (0.9.0), tunnel to private backends (0.10.3), `--agent` NDJSON everywhere.

Terra's sample: every crowded entry uses `testmd run`/`run` as a verifier of a seeded bug. **Zero use Exploration or policy gates.** That's the lane.

## Ideas

### A. Wild Bugs — Kane hunts real bugs in real open-source apps; agent fixes; upstream gets a PR with Kane evidence
When a maintainer points Kane at their OSS app's live demo, they get real bugs found unscripted plus a fix PR carrying sealed browser evidence (before: reproduced, after: not_reproduced), and TestMu gets Exploration + re-check leases + evidence packs shown finding bugs nobody planted.
- Loop: `explore run --policy read_only` on demo → findings NDJSON → agent reproduces in local clone (tunnel) → patch → `explore run --focus <screen>` re-check → not_reproduced → PR with evidence.
- Proof: real findings, real repos, possibly merged PRs (can't promise merges).
- Risk: explore credits/HyperExecute access; finding count may be noise (console warnings); PRs to strangers need human OK.

### B. Lost & Found — discoverability gate: "can a stranger find what the agent built?"
When an agent ships a feature, the builder gets proof an *unguided* Kane explorer can actually reach it (not just that a scripted test passes), and TestMu gets Exploration used as the user-acceptance gate.
- Intended flows (from spec) vs flows Exploration discovered unprompted → unreachable feature = fail → agent fixes navigation/labels → re-explore until every intended flow is discovered.
- Unique claim: correctness tests pass while the feature is unfindable; only an unscripted explorer can show that.
- Risk: needs a real app (specimen problem) — could run on a real product of the human's.

### C. Parity — migrate an old site with Kane's map as the spec
When a small business owner pastes their old website URL, they get a rebuilt modern site in which every flow of the old one still works, and TestMu gets Exploration as the spec and a policy gate as the acceptance test.
- explore old site → map (screens/flows) → agent rebuilds → explore new → map diff → missing flows fed back → repeat until parity.
- Risk: scope; consent of the site owner; map-diff quality.

### D. Field Test for Lagos — real-device / slow-network check of real Nigerian commerce sites (user's edge)
Weaker: we can't fix third-party sites; drifts to audit report.

## My lean
**A**, then B. A is the only one where every bug is real, the explorer is unscripted, the closed loop ends in something outside our repo (a PR to a real project), and the newest feature does the job. It's the "browser agents in the wild" lane that took gold, applied to verification.
