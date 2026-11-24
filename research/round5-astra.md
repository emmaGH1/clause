# Shine Your Eye · judge’s review, 24 November 2026

**GO-with-changes · 7/10.** I would shortlist the version that can answer a family member asking “Where does it actually say that?” I would pass on the promised undercover tour. None of today’s checks established a working signup-to-withdrawal journey. The best available scene happens before login, when the investigator has to correct its own allegation.

**The two sentences I’d publish if the build earns them**

> A Nigerian builder turned a forwarded investment link into a 30-second Pidgin briefing that a family could share without opening the site. When the agent wanted to say a customer had to send more money to withdraw, Kane found the actual fee wording and made the agent change what the family heard.

I’d forget a danger score, four red icons and a fluent voice saying what the SEC already said. Compared with Ember’s Portal Pal, the family has a clearer reason to forward the result immediately. Compared with demo.studio, video generation itself earns few points. Compared with the prior Astra review, the same standard applies here: one fresh, reproducible observation that changes the product. Verified and Closed loop decide ties. [Previous winners](https://www.testmuai.com/blog/kane-cli-hackathon-winners/) · [Judging and entry rules](https://www.kaneclihack.sh/)

## Ballot on the submitted pitch

| Test | Points | Reason |
|---|---:|---|
| Sponsor | 2 | Switch off Kane and a new link loses its witnessed route and dated screenshot. The app must then withhold a fresh briefing. Other browser agents could implement this idea. |
| Both halves | 2 | One pasted forward gives the family shareable evidence and gives TestMu a public demonstration of its browser settling a disputed sentence. |
| Gate | 1 | Solo entry from Nigeria fits. Account eligibility, a completed Kane call and a usable evidence artifact still need verification. |
| Real | 1 | Real notices and a reachable public fee page exist. The promised unlock demand and downstream funnel remain unobserved. |
| Buildable | 1 | A phone page, one case and one captioned export look achievable by halfway. Account creation, arbitrary domains, WhatsApp bot integration and backend withdrawal states put that milestone outside the builder’s control. |

## What responded

Checked on 24 November from this sandbox with plain curl GETs, normal TLS verification and HTTPS redirects. Examined returned HTML as text. No JavaScript execution, browser automation, form submissions or accounts. Codes describe this vantage point. A phone field establishes a request for a number only. Server-side OTP and conditional challenges remain unknown throughout.

| Subject and domain provenance | GET result | Public signup evidence |
|---|---|---|
| Glorious Wealth Fund · exact domain in Nigeria SEC notice | Both apex and www of `gloriouswealthfund[.]com` failed DNS resolution here. Search still indexes the supervision claim. | No current HTML. Excellent historical contradiction, poor live demo dependency. [SEC notice](https://sec.gov.ng/for-investors/keep-track-of-circulars/suspected-fraudulent-investment-activities-of-glorious-wealth-fund-gwf/) |
| Aurum Bot · separate SEC warning from ModMount; NZ FMA connects the warning to named sites | `aurum[.]foundation/en` returned 403 with a country restriction. `aurumfoundation[.]io` and `aurum-foundation[.]com` failed DNS here. | No signup HTML on those responses. [Nigeria SEC](https://sec.gov.ng/for-investors/keep-track-of-circulars/suspected-fraudulent-activities-of-aurum-bot/) · [NZ FMA domain list](https://www.fma.govt.nz/library/unregistered-businesses/aurum-foundation-unregistered-financial-service-provider-promotion-of-high-risk-products) |
| ModMount Services Limited · entity named by SEC; site identifies the same company and Seychelles registration, and its client agreement names the unhyphenated domain | `modmountltd[.]com` redirected to www and returned 403 with a JavaScript/cookie challenge. `www.mod-mountltd[.]com/en/` and its linked FAQ returned 200 with substantive content. | Public landing HTML includes a reCAPTCHA script. Its Open Account link returned a 533-byte 200 onboarding shell with no visible fields. Enforcement and OTP unknown. [Nigeria SEC](https://home.sec.gov.ng/for-investors/keep-track-of-circulars/suspected-fraudulent-activities-of-modmount-services-limited/) · [Company agreement](https://www.mod-mountltd.com/wp-content/uploads/sites/21/16.02.2026-Client-Agreement_Modmount.pdf) |
| AfriQuantumX · SEC names the platform without a domain | GhanaFact’s documented campaign host `pereseptestart[.]online` failed DNS here. The brand-matching `afriquantumx[.]net` returned 200 at root and /sign/. Operator continuity with the SEC subject is unverified. | Form requests first and last name, email and required telephone number. No obvious OTP field or CAPTCHA widget in returned markup. Exclude this host from attributed claims pending a reliable identity match. [Nigeria SEC](https://sec.gov.ng/for-investors/keep-track-of-circulars/public-notice-afriquantumx/) · [GhanaFact investigation](https://ghanafact.com/scam-alert-afriquantumx-fake-investment-platform-using-ai-generated-endorsement-videos-of-president-mahama-brother/) |
| TOSAF · SEC names the fund without a hostname | Search yielded no sufficiently attributable investment domain to GET. An unrelated plastics business uses the acronym. | Reachability and gate unknown. [Nigeria SEC](https://sec.gov.ng/for-investors/keep-track-of-circulars/suspected-fraudulent-activities-of-tunbosayo-okekunle-strategic-alpha-fund-tosaf/) |

**Best specimen.** The public ModMount FAQ says withdrawal fees may apply depending on circumstances. Its homepage claims Seychelles authorization. Nigeria’s SEC separately says the company lacks Nigerian registration and reports receiving withdrawal complaints. These statements can all coexist. The geographic distinction alone is worth explaining to a relative. No inspected page demonstrated an advance-payment demand, a failed withdrawal or a fabricated testimonial.

**Two replenishment sources.** California DFPI’s tracker pairs victim narratives with reported platform domains. Look for a recent entry with a specific public claim someone can check. Chainabuse accepts URLs as well as wallet addresses and distinguishes moderator-checked reports. Prefer recent URL-bearing, checked reports, match the exact host, then establish reachability independently. Treat reports as leads and attribute every allegation. Neither feed guarantees a working specimen. [DFPI Crypto Scam Tracker](https://dfpi.ca.gov/consumers/crypto/crypto-scam-tracker/) · [Chainabuse FAQ](https://chainabuse.com/faq)

## What actually earns Closed loop

Draft → screenshot → delete is genuine feedback, but weak for 25% if the final script is a canned warning either way. Make the **family’s briefing the artifact under test**.

1. Accept a pasted message or URL on a mobile page. For the demo, disclose the supported case list. Extract the relative’s question and convert each factual premise into a testable hypothesis. Keep the original draft in the trace.
2. Give Kane an open question such as “From the homepage, find what a visitor can learn about withdrawing money.” Let it choose the public route. Capture the visible passage, surrounding qualification, resolved host, UTC time, screenshot and run ID. Capture the matching regulator notice independently with its date and jurisdiction.
3. Have the agent bind each proposed sentence to its evidence. Use constrained sentence templates for attributed claims and keep conditionals, amounts and jurisdiction intact. A sealed run establishes evidence provenance. The application must enforce sentence-to-source correspondence itself. A missing passage yields “couldn’t verify.” A timeout yields “check incomplete.” Neither can produce a clean bill of health. [Kane evidence policies](https://github.com/LambdaTest/kane-cli/blob/main/docs/user-guide/policies.md)
4. Return the rejected premise and observed wording to the agent. It rewrites the captions **and** narration. A fresh Kane session opens the finished briefing on the builder’s own app, follows its receipt and checks the published sentence against the capture. Only then enable sharing. Remove the evidence ID as a separate negative control and show the export being blocked. Preserve the draft, structured failure, revised script and rerun so a judge can trace the decision. Label any deliberately injected test as such.

## Five objections I’d raise at the judging table

| Objection | Concrete design decision |
|---|---|
| Defamation or misidentification | Use dated, attributed statements about the exact entity and jurisdiction. Quote the page with its qualifiers. Require a human review of the single public demo case and redact names, contact details and clickable suspect URLs from the shareable clip. A screenshot of a testimonial proves it appeared; authenticity remains unknown. |
| Burner ethics | End the walk at the first request for identity, contact, money or consent. Show the boundary as a finding. An account-only flow belongs on a consenting partner’s test system with supplied credentials. |
| Risk to TestMu infrastructure | Use approved targets and enforce an outbound allowlist, disposable credential-free browser, blocked downloads, form submissions and external redirects. A read-only prompt alone cannot enforce that. If hosted inspection is unsupported, run Kane on a builder-controlled, inert copy with dated provenance and label it replay; reserve claims of fresh observation for permitted live runs. |
| Site disappears during judging | Save the real run and receipts at first success. Give judges both “Check again” and “View capture from [date]”. A dead endpoint should visibly fail the fresh check while the earlier briefing remains playable. |
| Product demo obscures verification | Let the judge remove the fee receipt and regenerate. An unchanged voiceover fails Verified. Show Kane testing the app’s published result and an actual revision or meaningful confirmation in the run history. |

## Collision check

- **AWS’s sample agentic phishing detector** already takes a URL, opens an isolated browser, collects a screenshot and returns an explained assessment. **PhishIntention** already uses dynamic navigation to discover credential-taking pages. The earlier “no walker found” conclusion does not hold. [AWS sample](https://github.com/aws-samples/sample-agentic-phishing-detection) · [PhishIntention](https://github.com/lindsey98/PhishIntention/blob/main/README.md)
- **BrowseCheck** is a hackathon build with a cloud browser walking a staged phishing flow and blocking risky actions. **ScamShield** already lets the public check suspected scams. Sending a suspicious link for analysis is familiar to consumers. [BrowseCheck on Devpost](https://devpost.com/software/browsecheck) · [ScamShield](https://www.scamshield.gov.sg/check-for-scams/how-to-check-for-scams-on-scamshield-app/)
- Within Kane’s field, **demo.studio** owns narrated site walks and **GuardianKane** owns evidence gates. The defensible contribution is a briefing a relative can forward, where every consequential sentence can be challenged and a failed check changes what the family hears. Search found adjacent work, and the November field is incomplete. [TestMu winners](https://www.testmuai.com/blog/kane-cli-hackathon-winners/)

## The first sixty seconds of the submission film

| Time | What the judge sees and hears |
|---|---|
| 0–7s | A staged family message, clearly labeled: “My brother, dem say I need pay again before I fit withdraw. Where dem write am?” One paste into Shine Your Eye. |
| 7–18s | Kane moves from the real homepage to the FAQ. Hold on the actual conditional fee wording until it can be read on a phone. |
| 18–28s | The forwarded premise appears beside the capture. The agent withdraws the stronger claim. The SEC notice enters with source, date and Nigerian jurisdiction. |
| 28–58s | Play the recipient’s complete 30-second clip, Pidgin voice and English captions. Give the actual fee wording, the attributed SEC warning and what remains unknown. End on the phone’s share action and evidence receipt. |
| 58–60s | Freeze on the receipt. Use the rest of the required 3–5 minute YouTube film for the independent rerun, negative control and judge instructions. |

**Single proof frame.** On one phone screen, show the source crop with the conditional fee wording highlighted, directly above the family-facing caption “The site says a fee may apply. We couldn’t verify a demand to send more money.” Below it, show the capture time, defanged host and inspectable Kane run ID. The screenshot and the final spoken sentence must come from the same run. An Exploration map can help tell the story earlier. It cannot carry this frame.

## Hour 1 decides it

- **0–10 minutes.** Confirm entrant eligibility (18+, eligible employment status), event registration, TestMu account, CLI access and an eligible public repo initialized on or after 12 November. Budget for two public posts and the 3–5 minute YouTube demo before **19:29 Lagos time, 26 November**. [Official rules](https://www.kaneclihack.sh/)
- **10–40 minutes.** On an allowed target, run one real Kane objective from the homepage. Require a second public screen, a legible passage answering the forwarded question, and a retained screenshot attached to a run ID. Record actual time and credit use. ModMount’s public FAQ is the first candidate. A 200 response or a preselected screenshot cannot pass this test.
- **40–60 minutes.** Feed the result into the agent. Produce one supported sentence and one explicit unknown, then remove the supporting receipt and confirm that export fails. Open the receipt on a phone. **GO** if this works on a real, attributable specimen. **NO-GO for this submission** if the only evidence is an archive, a blocked run, a name-match domain or generic landing-page copy. Stop before spending the remaining window on narration.
- **Halfway checkpoint.** From a logged-out phone, paste one supported link, receive and play the captioned 30-second briefing, open its evidence and share the finished file. One real case is enough. Cut WhatsApp bot integration, bulk scanning and custom animation before cutting this journey.
