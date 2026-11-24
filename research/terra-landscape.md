# Kane CLI hackathon landscape

Research cutoff: 23 November 2026. Public-web reconnaissance, not a census. Event pages and mutable repositories can change after the cutoff; where an item has no reliable date, its presence by the cutoff is unverified. Project descriptions are organizers' or builders' claims, not independent verification that the projects ran or were formally submitted.

## Immediate opportunity: a new event is open

The [KaneCLI Online Hackathon](https://www.kaneclihack.sh/) runs **12–26 November 2026**, with submission due **26 November at 11:59 p.m. IST / 10:29 a.m. PT**, extended from 19 November. [Luma](https://luma.com/kanecli-online-hackathon) corroborates the event and rules. This is a different event from the August competition. No further upcoming TestMu event was reliably identified in this search.

Published rules: build an app, agent or workflow using any coding agent and verify with Kane; be 18+, enter solo or in a team of up to four, register with TestMu and run Kane. The public repository must have been initialized on or after 12 November. Submit a public GitHub repo, description, 3–5 minute YouTube demo, and at least two public posts; a live URL is optional. Give judges working credentials where needed and a fallback for third-party dependencies. No pushes after deadline. New accounts get 10,000 credits for one month. See the [official rules](https://www.kaneclihack.sh/).

Three prerequisites: end-to-end operation, a meaningful Kane finding or confirmation, and communication between agent and Kane. Three TestMu engineers score Ships, Verified, Closed loop, and Craft at 25% each; ties break on Verified then Closed loop. Cash is $1,500/$1,000/$500, plus $250 OpenAI credits per winning team, a founders' 1:1, three months of Kane CLI Pro and a featured post. Public launch posts are mandatory and extra reach/engagement earns brownie points. [Official event](https://www.kaneclihack.sh/).

## Public project inventory

The first three and Onred are known context, included for comparison. The remaining entries are publicly described projects; a hackathon claim does not establish a completed formal submission. The TestMu showcase groups projects from August and the SF Hack Day but does not identify the event for every item. Mutable showcase entries without dates are therefore **date-unverified**.

| Project and evidence | Published description | Pattern |
|---|---|---|
| [demo.studio](https://www.testmuai.com/blog/kane-cli-hackathon-winners/) | First place; Kane operates a live site to make a narrated demo. | Browser agent as product / media |
| [GuardianKane](https://www.testmuai.com/blog/kane-cli-hackathon-winners/) | Second place; stop gate requires browser verification. | Agent completion gate |
| [KANE vs. ABLE](https://www.testmuai.com/blog/kane-cli-hackathon-winners/) | Third place; Kane plays an agent-built escape room. | Adversarial game / repair loop |
| [Onred](https://github.com/emmaGH1/onred) | User-provided context: failing cart flow, agent patch, Kane rerun, repair receipt. | Repair and evidence |
| [Kloop](https://github.com/zachbuilds26/kloop) | README claims an August entry: live feature-to-code-to-Kane-to-fix playground; also describes PR verification. Demo and deployment links are placeholders. | Repair loop / CI |
| [stillhere](https://github.com/Mzee04/stillhere) | Topic listing describes Chrome checkout, Codex repair and Kane confirmation; updated 18 November. | Checkout repair loop |
| [zelkaro](https://github.com/tomcode1000/zelkaro) | Topic listing describes cross-user data leak, agent fix and Kane proof; updated 17 November. | Security repair loop |
| [notyours](https://github.com/Jasekeee/notyours) | Builder's [23 November post](https://www.reddit.com/r/ClaudeAI/comments/1y3m6db/i_built_claude_code_hooks_that_wont_let_the_agent/) describes Claude hooks checking cross-user leakage, with escalation after three failures; seeded demo, with stated limitations on fresh apps. | Security stop gate |
| [README PROOF](https://www.reddit.com/r/u_Electronic_Metal_606/comments/1y0hhdw/readme_proof_a_dashboard_that_makes_your_readme/) | Builder's 19 November post describes README claims converted into browser checks and a fix/recheck evidence dashboard. | Claims-to-tests / repair |
| [Kintsu](https://www.teapawt.org/agentablehq) | Builder's 19 November post says it tests separately built agent features together and routes bugs back to their authors. | Multi-agent integration repair |
| [Reenact](https://dev.to/memeshe/i-made-a-browser-prove-my-ais-bug-fix-3hhj) | Builder describes browser proof of a bug fix, delivered as Rust CLI, UI and GitHub Action. Publication date relative to cutoff not established. | Repair evidence / CI |
| [Furnish](https://dev.to/joyston_ccd43d53e268ec635/i-built-an-ai-home-design-studio-then-let-another-ai-agent-try-to-break-it-2df) | Builder describes an AI home-design studio attacked by another agent. Date relative to cutoff not established. | Adversarial app testing |
| [Signed Off](https://www.testmuai.com/kane-cli/) | TestMu showcase: signed freelance scope mapped to browser-verified promises. Date-unverified. | Requirements-to-proof |
| [LENS](https://www.testmuai.com/kane-cli/) | Showcase: replays business flows and blocks the agent until they hold. Date-unverified. | Agent gate / regression |
| [mutiny](https://www.testmuai.com/kane-cli/) | Showcase: deliberately breaks a promised behavior and flags tests that remain green. Date-unverified. | Test falsification |
| [Pactora](https://www.testmuai.com/kane-cli/) | Showcase: escrow marketplace where Kane finds a bug and Claude patches it. Date-unverified. | Domain app repair |
| [Playtest Studio](https://www.testmuai.com/kane-cli/) | Showcase identifies SF Hack Day entry: plain-English game rules exercised by Kane. Date-unverified showcase. | Game verification |
| [workers](https://xitter.cf/Praise_Prodigyy/status/2122831912989507875) | Post describes migrating Playwright tests to Kane and deliberately breaking the app to compare detection. Post date relative to cutoff not established. | Migration / test falsification |

The [SF Hack Day listing](https://kane-cli-hack-day.devpost.com/) says 30 May 2026, 26 participants and $5,000 in cash, and explicitly encourages hooks, NDJSON-fed iteration and spec-to-flow compilation. The listing's 50-builder wording is promotional, not a count of actual attendees. A later public LinkedIn search result mentions a Kane CLI × OpenAI SF event, but its date, rules and winners were not established as of the cutoff; no claim that it is upcoming is warranted.

## Patterns: observed examples and inference

These are **overlapping counts of the named, publicly described examples above**, not estimates of all 69 August submissions or of the November field. The sample is search-selected, includes builder claims and date-unverified examples, and is too small to measure actual saturation.

| Pattern | Approximate observed examples | Interpretation |
|---|---:|---|
| Agent patches after failure and Kane reruns | At least 7: Onred, Kloop, stillhere, zelkaro, README PROOF, Kintsu, Pactora | Most visibly crowded in this sample; a generic checkout repair receipt is a weak differentiator. |
| Completion/stop gate | 3: GuardianKane, notyours, LENS | Established, including a winner. Security specialization exists too. |
| Requirements or claims to proof | 2: Signed Off, README PROOF | Evidenced but too few to call saturated. |
| Test falsification or mutation | 2: mutiny, workers | Distinctive but already represented; workers' cutoff date unverified. |
| CI / PR integration | 2: Kloop, Reenact | Present as delivery channels; their existence does not establish category saturation. |
| Game / interactive browser challenge | 2: KANE vs. ABLE, Playtest Studio | One winner; game play is no longer a blank space. |
| Visual regression; accessibility audit | 0 identified in this sample | Not found, not proof of an uncrowded field. |

**Inference:** demo.studio is the clearest winner outside the generic repair-loop product category: Kane performs the user-facing job, while also contributing to verification. KANE vs. ABLE combines a familiar repair loop with an unusually legible adversarial game. GuardianKane is itself a gate, so winners did not uniformly avoid standard patterns. The [November organizer's suggested ideas](https://www.kaneclihack.sh/) already include self-healing checkout, PR bot, README lie detector, agent game and two-agent adversarial systems; these are signals of likely convergence, not evidence that anyone built them.

A plausible opening is a concrete user-facing workflow in which browser evidence is essential and an agent changes its behavior based on it, particularly across web and mobile or across multiple actors. That is a hypothesis for further validation, not evidence of an empty category. Avoid presenting a new wrapper around red → patch → green as novel on its own.

## Related events

The [SF Kane Hack Day](https://kane-cli-hack-day.devpost.com/) is the closest verified comparator: Kiro builds, Kane verifies, and the result returns to Kiro, with equal emphasis on shipping, verification, loop and craft. Its suggested hook, structured output and compiled-spec patterns show why those are natural defaults.

A sufficiently sourced 2025–26 Browserbase, Stagehand, Playwright MCP, Bolt or Lovable hackathon submission inventory was **not found** in this pass. Consequently, no cross-event winner counts or claims of comparative saturation are justified. Browserbase's [Stagehand caching announcement](https://www.youtube.com/watch?v=lBrizHj7ESo) and [browser-agent announcement](https://www.youtube.com/watch?v=OFpLX8tXXZ8) illustrate reusable browser automation and cost/observability themes, but are product announcements, not hackathon evidence.

## Features and friction worth investigating

Published post-August changes in the [changelog](https://github.com/LambdaTest/kane-cli/blob/main/CHANGELOG.md): 1 September agent mode pauses on questions and flushes fatal logs; 4 September mobile Python code export, with JavaScript mobile export explicitly unsupported; 10 September unresolved variables fail before dispatch; 15 September shareable context stores over Git, S3-compatible storage or folders and remote mobile execution. The [0.8.21 release, 5 October](https://github.com/LambdaTest/kane-cli/releases), describes mobile replay fixes, iOS screenshot reliability, web interactions with DOM-clickable elements absent from the accessibility tree, and `testrun run --agent`. These are dated releases, not a guarantee that 0.8.21 is the latest version by the cutoff.

**Inference:** a compelling demonstration could show a shared context change leading to a reviewed test change and remote mobile replay with inspectable evidence. The opportunity is stronger if the result serves a real user and the demo makes the agent feedback loop visible. Mobile Python-only export is a documented constraint, not a Discord complaint.

No verifiable post-August Discord complaints or defensible documentation-gap inventory was found. The event points to [Slack](https://www.kaneclihack.sh/) for engineer support; private community conversations were not accessed. Release notes describe bugs fixed, not current unresolved user complaints.
