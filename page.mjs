import { canShare, canRecheck, canPointAtHomepage, defang } from "./engine/case.mjs";
import { INCOMPLETE, NOT_FOUND } from "./engine/text.mjs";

const copy = {
  name: "Clause",
  pitch: "Paste an investment pitch with the site's web address",
  check: "Check",
  report: "Pitch report",
  shared: "Shared pitch report",
  supported: "ModMount · Supported demo case",
  replay: "Replay of saved Kane evidence. Sharing is locked.",
  wrongPage: "Homepage recheck demo",
  extracting: "Finding the claims in the pitch…",
  "kane-reading": "Kane is reading the public site…",
  assessing: "Matching Kane’s evidence to the claims…",
  running: "Kane is rechecking the cited pages…",
  passed: "Re-checked by Kane",
  empty: "The message contains no quoted pitch claims to check.",
  noQuotes: "Sharing requires a quote captured and rechecked by Kane.",
  failed: "Re-check failed",
  recheck: "Re-check cited pages",
  point: "Point this claim at the homepage",
  share: "Share",
  citation: "Cited page",
  run: "Kane run ID",
  freshRun: "Re-check run",
  shot: "Screenshot of the source page captured by Kane",
  regulator: "Regulator notice",
  noticeLink: "Read the original notice",
  newCheck: "Check another pitch",
  notFound: "Page not found",
  badPitch: "Enter a pitch of up to 8,000 characters.",
  unavailable: "This action is unavailable for this case.",
};
export const errors = { 400: copy.badPitch, 404: copy.notFound, 409: copy.unavailable, 500: INCOMPLETE };

const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[ch]);

const MARK = `<svg class="mark" viewBox="0 0 16 16" aria-hidden="true" shape-rendering="crispEdges"><g fill="currentColor"><rect x="0" y="0" width="8" height="2"/><rect x="0" y="0" width="2" height="12"/><rect x="8" y="2" width="2" height="2"/><rect x="4" y="4" width="7" height="2"/><rect x="4" y="4" width="2" height="12"/><rect x="11" y="5" width="2" height="2"/><rect x="13" y="7" width="2" height="2"/><rect x="14" y="8" width="2" height="8"/><rect x="4" y="14" width="12" height="2"/></g><rect x="7" y="9" width="5" height="2" fill="#2433FF"/></svg>`;

function layout(body, { mode = "report", refresh = false } = {}) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${refresh ? '<noscript><meta http-equiv="refresh" content="3"></noscript>' : ""}
  <title>${copy.name}</title>
  <meta name="description" content="Paste an investment pitch. Kane CLI opens the company's own website and brings back what it really says, with screenshots.">
  <meta name="theme-color" content="#F7F7F5">
  <link rel="icon" href="/assets/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/site.css">
  <script type="module" src="/assets/clause.js"></script>
  <script type="module" src="/assets/site.js"></script>
</head>
<body class="${mode}">
  <header class="nav">
    <a class="wordmark" href="/" aria-label="Clause home">${MARK}<span>Clause</span></a>
    <nav class="nav-links mono"><a href="/#how">How it works</a><a href="/#kane">Kane stack</a><a href="/case/9f177adaf5e26b5d">Sample report</a></nav>
    <a class="nav-cta" href="/#paste">Check a pitch</a>
  </header>
  <main>${body}</main>
  <footer class="foot mono"><span>Clause · Built on Kane CLI by TestMu AI</span><span>Read-only · no sign-ups · no deposits</span></footer>
</body>
</html>`;
}

const CLAIM_WORDS = /\b(?:doubles?(?: in \d+ weeks?)?|instant(?:ly)?|free|no fees?(?: at all)?|guaranteed|licensed|regulated|safe)\b/gi;
const markPitch = (text) => escape(text).replace(CLAIM_WORDS, '<mark class="false">$&</mark>');

function bubble(message, { label = "Forwarded message · pasted by you" } = {}) {
  return `<figure class="bubble">
    <figcaption class="mono"><span aria-hidden="true">↪</span> ${escape(label)} <span class="tag">Unverified pitch</span></figcaption>
    <blockquote>“${markPitch(message.trim())}”</blockquote>
  </figure>`;
}

function claimIcon(text = "") {
  if (/double|return|profit|%|earn|grow/i.test(text)) return "chart";
  if (/free|fee|charge|cost/i.test(text)) return "card";
  if (/instant|withdraw|fast|day|payout/i.test(text)) return "coins";
  if (/licen|regist|regulat|safe|legit/i.test(text)) return "locked";
  return "doc";
}
const pixel = (icon, cls = "") => `<canvas class="px ${cls}" data-pixel="${icon}" aria-hidden="true"></canvas>`;

export function home(error = "", sample = null, bounds = new Map()) {
  const lead = sample?.sentences?.filter(({ bound }) => bound).find(({ text }) => /free/i.test(text)) ?? sample?.sentences?.find(({ bound }) => bound);
  const demo = sample && lead ? {
    message: "Join ModMount today! Your money doubles in 2 weeks. Withdrawals are instant and free.",
    steps: (sample.kaneProgress ?? []).filter((step) => /^(navigate|click|scroll)/.test(step)).slice(0, 5),
    claims: sample.sentences.map(({ claim, text, bound }) => ({ claim, text, bound })),
    quote: readingQuote(lead.quote),
    shot: shotUrl(sample, lead),
    bounds: bounds.get(lead.claim) ?? null,
    run: sample.kane?.runId?.slice(0, 8),
    recheck: sample.recheck?.runId?.slice(0, 8),
    page: defang(lead.sourceUrl).replace(/^www\[\.\]/, ""),
    report: `/case/${sample.id}`,
  } : null;
  const hero = !error ? `
<section class="hero">
  <p class="eyebrow mono">Built on Kane CLI by TestMu AI</p>
  <h1>Before you send money, <em>send Kane.</em></h1>
  <p class="lede">Paste an investment pitch. Kane opens the company's own website and brings back what it really says, with screenshots.</p>
  <div class="hero-ctas"><a class="btn primary" href="#paste">Check a pitch</a>${sample ? `<a class="btn ghost" href="/case/${sample.id}">View sample report</a>` : ""}</div>
</section>
${demo ? `<section class="window demo" aria-label="Clause checking a sample pitch" data-demo-window='${escape(JSON.stringify(demo))}'>
  <div class="chrome"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="addr mono">Replay · Kane run ${escape(demo.run)} · 25 Nov 2026</span></div>
  <div class="panes">
    <div class="pane left">
      ${bubble(demo.message, { label: "Sample pitch · replayed from a real run" })}
      <ul class="claims" data-claims>${demo.claims.map(({ claim, text }) => `<li data-claim="${claim}"><span>${escape(text)}</span><b class="mono">Waiting</b></li>`).join("")}</ul>
      <div class="link-quote" data-quote hidden><blockquote>“${escape(demo.quote)}”</blockquote><p class="mono">${escape(demo.page)} · run ${escape(demo.run)}</p></div>
    </div>
    <div class="pane right">
      <div class="stage-head"><span class="badge mono" data-badge>Kane CLI · run ${escape(demo.run)}</span></div>
      <div class="stage">${pixel("kane", "stage-icon")}</div><figure class="capture" data-capture hidden><span class="cap-label mono">Kane capture · step 08</span><div class="cap-shot"></div></figure>
      <ol class="steps mono" data-demo-steps></ol>
    </div>
  </div>
</section>` : ""}
<!--paste-->
<section class="chapters" id="how">
  <article class="chapter">${pixel("pitch")}<div><p class="mono">01 · The problem</p><h2>The pitch says <s>free</s>. The fine print doesn't.</h2><p>Forwarded pitches promise instant withdrawals and money that doubles. The conditions sit on the company's own FAQ, one click deeper than anyone looks.</p></div></article>
  <article class="chapter">${pixel("lens")}<div><p class="mono">02 · What Clause does</p><h2>Paste the pitch. Get <em>their own words</em> back.</h2><p>Clause splits the message into claims, one per promise, and sets each one beside the sentence the site actually publishes. Anything Kane can't find is labelled, never guessed.</p></div></article>
  <article class="chapter" id="kane">${pixel("term")}<div><p class="mono">03 · Kane stack</p><h2><em>Kane CLI</em> reads the live site.</h2><p>One objective, run as an agent with <code>kane-cli run --agent</code>: open the homepage, find the Help Center, expand the right FAQ, store the exact wording and a screenshot. Read-only: no sign-ups, no deposits.</p></div></article>
  <article class="chapter">${pixel("camera")}<div><p class="mono">04 · Capture</p><h2>Every quote comes with <em>Kane's screenshot.</em></h2><p>The report prints only text Kane stored itself, beside the screenshot, page and run ID it came from. Nothing is paraphrased.</p></div></article>
  <article class="chapter">${pixel("lock")}<div><p class="mono">05 · Re-check</p><h2>A second Kane run, <em>or no Share.</em></h2><p>A fresh run goes back to each cited page and must find the same sentence again. Cite the wrong page and Share stays locked.</p></div></article>
</section>` : "";
  const paste = `<section class="paste-wrap" id="paste">
  ${pixel("eye", "paste-icon")}
  <form class="paste-form" method="post" action="/cases" data-demo="app-ready">
    <h${hero ? 2 : 1}>Check an investment pitch</h${hero ? 2 : 1}>
    ${error ? `<p role="alert">${escape(error)}</p>` : ""}
    <label for="message" class="mono">${copy.pitch}</label>
    <textarea id="message" name="message" rows="5" required maxlength="8000" placeholder="Paste the message you were sent, with the company's link"></textarea>
    <div class="paste-row"><span class="mono">Kane reads the site live · about 3 minutes</span><button class="btn primary" type="submit" aria-label="${copy.check}">Check <span aria-hidden="true">→</span></button></div>
  </form>
</section>`;
  return layout(error ? paste : hero.replace("<!--paste-->", paste), { mode: "landing" });
}

export function errorPage(status) {
  return layout(`<h1>${errors[status]}</h1><p><a href="/">${copy.newCheck}</a></p>`);
}

const shotUrl = (c, sentence) => `/api/cases/${c.id}/shots/${sentence.claim}.jpg`;

export function leadEvidence(c) {
  const captured = c.sentences?.filter(({ bound }) => bound) ?? [];
  return captured.find(({ claim }) => claim === c.wrongPage?.claim)
    ?? captured.findLast(({ verdict }) => verdict === "corrected") ?? captured[0];
}

function stepMarkup(step) {
  const match = /^([a-z]+):\s*(.*)$/i.exec(step);
  return match ? `<span>${escape(match[1])}</span> ${escape(match[2])}` : escape(step);
}

function readingQuote(quote) {
  const firstSentence = quote.match(/^.*?[.!?](?=\s+[A-Z]|$)/u)?.[0];
  return firstSentence ?? quote;
}

function ticker(steps = []) {
  const events = steps.filter(Boolean).slice(-3);
  return `<div class="ticker">
    <ol data-steps data-snapshot="${escape(JSON.stringify(events))}" aria-label="Latest Kane steps">${events.map((step) => `<li>${stepMarkup(step)}</li>`).join("")}</ol>
    <p class="ticker-wait">Waiting for the first step…</p>
    <p class="screen-reader" data-step-announcement aria-live="polite"></p>
  </div>`;
}

const STAGE_ICON = { extracting: "eye", "kane-reading": "term", assessing: "camera", ready: "camera" };

export function reading(c, lead, bounds) {
  const complete = c.stage === "ready";
  const title = complete ? "Kane read the site." : c.stage === "kane-reading" ? "Kane is reading the site." : copy[c.stage];
  const source = lead && (c.wrongPage?.claim === lead.claim ? c.wrongPage.originalUrl : lead.sourceUrl);
  const claims = c.sentences ?? c.draft?.claims?.map((claim, i) => ({ claim: i + 1, text: claim.text ?? claim.draft })) ?? [];
  const status = (sentence) => complete ? (sentence.bound ? "Captured" : "Not found") : c.stage === "assessing" ? "Matching" : "Reading…";
  return layout(`<section class="reading-page"${complete ? "" : ` data-live-case="${c.id}" data-poll="read" data-stage="${c.stage}"`}>
    <header class="page-head">
      <p class="mono">${c.site ? escape(c.site.defanged ?? defang(c.site.url)) : "Clause"}</p>
      <h1>${title}</h1>
    </header>
    <div class="window app">
      <div class="chrome"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="addr mono">clause.app/case/${escape(c.id.slice(0, 8))}</span></div>
      <div class="panes">
        <div class="pane left">
          ${bubble(c.message ?? "")}
          ${claims.length ? `<ul class="claims">${claims.map((sentence) => `<li class="${complete && sentence.bound ? "got" : ""}"><span>${escape(sentence.text)}</span><b class="mono">${status(sentence)}</b></li>`).join("")}</ul>` : ""}
          ${lead ? `<div class="link-quote"><blockquote>“${escape(readingQuote(lead.quote))}”</blockquote>${source ? `<p class="mono reading-source">${escape(defang(source))}${c.kane?.runId ? ` · run ${escape(c.kane.runId.slice(0, 8))}` : ""}</p>` : ""}</div>`
            : complete ? `<p class="none">${c.sentences?.length ? NOT_FOUND : copy.empty}</p>` : ""}
          ${complete ? `<a class="btn primary" href="/case/${c.id}">Read the report <span aria-hidden="true">→</span></a>` : ""}
        </div>
        <div class="pane right">
          <div class="stage-head"><span class="badge mono">Kane CLI${c.kane?.runId ? ` · run ${escape(c.kane.runId.slice(0, 8))}` : " · live"}</span></div>
          ${lead ? `<figure class="capture shown" data-resolve${bounds ? ` data-bounds="${escape(JSON.stringify(bounds))}"` : ""}>
              <span class="cap-label mono">Kane capture</span>
              <img src="${shotUrl(c, lead)}" alt="${copy.shot}">
              <a class="mono cap-open" href="${shotUrl(c, lead)}" target="_blank" rel="noopener">${bounds ? "Open full capture" : "Full capture · quote position unavailable"} ↗</a>
            </figure>`
            : `<div class="stage">${pixel(STAGE_ICON[c.stage] ?? "term", "stage-icon")}</div>`}
          ${complete ? "" : `<h2 class="mono steps-title">Live Kane steps</h2>${ticker(c.kaneProgress)}`}
        </div>
      </div>
    </div>
  </section>`, { mode: "reading", refresh: !complete });
}

function action(c, name, label, { extra = "", disabled = false, primary = false, quiet = false, visible = label } = {}) {
  return `<form method="post" class="${name}-form" action="/case/${c.id}/${name}">${extra}
    <button class="${quiet ? "text-button" : `button${primary ? " primary" : ""}`}" aria-label="${escape(label)}"${disabled ? " disabled" : ""}>
      ${quiet ? escape(visible) : `${escape(visible)}${disabled ? "" : ' <span aria-hidden="true">→</span>'}`}
    </button>
  </form>`;
}

function reportHeading(c) {
  const corrected = c.sentences.filter(({ verdict }) => verdict === "corrected");
  if (corrected.length) {
    const faq = corrected.every(({ sourceUrl }) => /faq/i.test(sourceUrl ?? ""));
    return { plain: "The pitch says one thing.", blue: faq ? "Their own FAQ disagrees." : "Their own site disagrees." };
  }
  return { plain: copy.report, blue: c.sentences.length ? "Kane couldn't confirm it." : "" };
}

function shotCrop(c, sentence, bounds) {
  const url = shotUrl(c, sentence);
  let geometry = "";
  let mark = "";
  if (bounds) {
    const { x, y, right, bottom, width, height } = bounds;
    const left = Math.max(0, x - 30);
    const top = Math.max(0, y - 103);
    const cropWidth = Math.min(width, right + 39) - left;
    const cropHeight = Math.min(height, bottom + 30) - top;
    geometry = ` style="--crop-ratio:${cropWidth}/${cropHeight};--shot-w:${width / cropWidth * 100}%;--shot-x:${left / cropWidth * -100}%;--shot-y:${top / cropHeight * -100}%;"`;
    const pad = 8;
    mark = `<span class="cap-box" style="left:${(x - left - pad) / cropWidth * 100}%;top:${(y - top - pad) / cropHeight * 100}%;width:${(right - x + pad * 2) / cropWidth * 100}%;height:${(bottom - y + pad * 2) / cropHeight * 100}%"></span>`;
  }
  return `<figure class="evidence-frame" data-demo="kane-shot">
    <a href="${url}" target="_blank" rel="noopener" class="shot-link" aria-label="Open full Kane capture in a new tab">
      <span class="shot-window${bounds ? " crop" : ""}"${geometry}><img src="${url}" alt="${copy.shot}">${mark}</span>
    </a>
    <figcaption class="mono">${bounds ? "Open full capture" : "Full capture · quote position unavailable"} <span aria-hidden="true">↗</span></figcaption>
  </figure>`;
}

function claimRow(c, sentence, { shared, offerWrongPage, bounds }) {
  const { claim, text, verdict, bound, evidence, quote, sourceUrl } = sentence;
  const contradicted = verdict === "corrected";
  const result = c.recheck?.perClaim?.find((entry) => entry.claim === claim);
  const flagged = result && !result.matched && c.recheck.status === "failed";
  const originalSource = c.wrongPage?.claim === claim ? c.wrongPage.originalUrl : null;
  const pageLabel = (url) => defang(url).replace(/^www\[\.\]/, "");
  const pitch = `<span class="pitch-text" data-demo="draft-claim" data-struck="${contradicted}">${contradicted ? `<s>${escape(text)}</s>` : escape(text)}</span>`;
  const capturedAt = c.kane?.capturedAt;
  const readableTime = capturedAt?.replace("T", " ").replace(/(?:\.\d+)?Z$/, " UTC");
  const excerpt = bound && contradicted ? readingQuote(quote) : "";
  const proof = bound ? `
    <div class="col quote-col">
      <p class="col-label mono">The site says</p>
      <blockquote data-demo="kane-quote">${excerpt ? `<mark>${escape(excerpt)}</mark>${escape(quote.slice(excerpt.length))}` : escape(quote)}</blockquote>
      <p class="evidence-source mono">${originalSource ? "Re-check page" : copy.citation} <a data-demo="kane-source" href="${escape(sourceUrl)}" rel="noreferrer">${escape(pageLabel(sourceUrl))}</a></p>
      ${originalSource ? `<p class="evidence-source mono">Original capture ${escape(pageLabel(originalSource))}</p>` : ""}
    </div>
    <div class="col shot-col">
      ${shotCrop(c, sentence, bounds.get(claim))}
      <div class="capture-meta mono">
        ${capturedAt ? `<p>Captured <time datetime="${escape(capturedAt)}">${escape(readableTime)}</time></p>` : ""}
        ${c.kane?.runId ? `<p>Run ${escape(c.kane.runId.slice(0, 8))}</p>` : ""}
      </div>
    </div>` : `<div class="col quote-col"><p class="col-label mono">The site says</p><p class="no-evidence">${NOT_FOUND}</p></div><div class="col shot-col empty" aria-hidden="true">${pixel("lens", "dim")}</div>`;
  return `<li class="claim${flagged ? " flagged" : ""}${contradicted ? " corrected" : ""}" data-demo="claim-row" data-claim="${claim}">
    <div class="col claim-col">
      <span class="num mono">${String(claim).padStart(2, "0")}</span>
      ${pixel(claimIcon(text), "claim-icon")}
      <p class="col-label mono">The pitch said</p>
      <p class="claim-pitch">${pitch}</p>
      ${flagged ? `<div class="claim-alert" data-demo="claim-recheck" data-verdict="missing">
        <strong class="mono">Not on the cited page</strong>
        ${result.visitedUrl && result.visitedUrl !== sourceUrl && result.visitedUrl !== originalSource ? `<p>Kane visited ${escape(pageLabel(result.visitedUrl))} during the re-check.</p>` : ""}
      </div>` : ""}
    </div>
    ${bound ? `<div class="final" data-demo="final-claim" data-verdict="${escape(verdict)}" data-evidence="${escape(evidence)}">${proof}</div>`
      : `<div class="final"><div class="col quote-col"><p class="col-label mono">The site says</p><p class="no-evidence" data-demo="final-claim" data-verdict="${escape(verdict)}">${NOT_FOUND}</p></div><div class="col shot-col empty" aria-hidden="true">${pixel("lens", "dim")}</div></div>`}
  </li>`;
}

function recheckPanel(c, { shared, offerRecheck }, hasEvidence) {
  const recheck = c.recheck;
  const running = recheck?.status === "running";
  const shareable = canShare(c);
  const recheckVerdict = { passed: "match", failed: "missing" };
  const status = recheck ? recheck.status === "incomplete" ? INCOMPLETE : copy[recheck.status] : "Re-check the evidence";
  const detail = shareable ? "A second Kane run found every quote on its cited page."
    : c.replay || recheck?.replay ? copy.replay
    : recheck?.status === "failed" ? "At least one quote was missing from its cited page. Sharing is locked."
    : !hasEvidence ? copy.noQuotes
    : running ? "Share unlocks after Kane finds every quote again."
    : "Share unlocks after a successful re-check.";
  return `<aside class="recheck-panel${shareable ? " open" : ""}"${running ? ` data-live-case="${c.id}" data-poll="recheck"` : ""}>
    ${pixel(shareable ? "lock" : running ? "term" : "locked", "lock-icon")}
    <div class="recheck-copy">
      <h2${recheck ? ` role="status" data-demo="kane-recheck" data-verdict="${recheckVerdict[recheck.status] ?? recheck.status}"` : ""}>${status}${recheck?.status === "failed" ? ' <span aria-hidden="true">· Share locked</span>' : ""}</h2>
      <p class="recheck-detail">${detail}</p>
      ${running ? ticker(recheck.progress) : ""}
      ${c.kane?.runId || recheck?.runId ? `<dl class="run-list mono">
        ${c.kane?.runId ? `<div><dt>${copy.run}</dt><dd><code data-demo="kane-run">${escape(c.kane.runId)}</code></dd></div>` : ""}
        ${recheck?.runId ? `<div><dt>${copy.freshRun}</dt><dd><code data-demo="kane-recheck-run">${escape(recheck.runId)}</code></dd></div>` : ""}
      </dl>` : ""}
    </div>
    <div class="recheck-actions">
      ${!shared && offerRecheck && canRecheck(c) ? action(c, "recheck", copy.recheck, { primary: true }) : ""}
      ${!shared ? action(c, "share", copy.share, { disabled: !shareable, primary: shareable, visible: shareable ? "Share report" : "Share locked" }) : ""}
    </div>
    ${c.wrongPage ? `<a class="mono back" href="/case/${escape(c.wrongPage.from)}">Return to original report ↗</a>` : ""}
  </aside>`;
}

export function report(c, { shared = false, offerRecheck = true, offerWrongPage = true, bounds = new Map() } = {}) {
  if (c.format !== 1 || c.stage === "failed") return layout(`<div class="error-page"><h1>${copy.report}</h1><p role="status">${INCOMPLETE}</p><a class="btn ghost" href="/">${copy.newCheck}</a></div>`);
  if (c.stage !== "ready") return reading(c);

  const heading = reportHeading(c);
  const rows = [...c.sentences].sort((a, b) => a.claim - b.claim);
  const notice = c.regulator;
  const claimOptions = { shared, offerWrongPage, bounds };
  return layout(`<article data-demo="report" class="report-page">
    <header class="report-heading">
      <div class="report-context mono">
        ${notice ? `<p data-demo="supported-demo">${copy.supported}</p>` : c.site?.defanged ? `<p>${escape(c.site.defanged)}</p>` : ""}
        ${shared ? `<p>${copy.shared}</p>` : ""}
        ${c.replay || c.recheck?.replay ? `<p data-demo="replay">${copy.replay}</p>` : ""}
        ${c.wrongPage ? `<p class="wrong-page-label" data-demo="wrong-page">${copy.wrongPage}${c.recheck?.status === "failed" ? " · Share locked" : ""}</p>` : ""}
      </div>
      <h1><span>${escape(heading.plain)}</span> <em>${escape(heading.blue)}</em></h1>
    </header>
    ${c.message ? `<div class="report-pitch">${bubble(c.message)}</div>` : ""}
    ${rows.length ? `<ol class="claim-list">${rows.map((sentence) => claimRow(c, sentence, claimOptions)).join("")}</ol>` : `<p class="lead-claim">${copy.empty}</p>`}
    ${recheckPanel(c, { shared, offerRecheck }, c.sentences.some(({ bound }) => bound))}
    ${notice ? `<section class="regulator" data-demo="regulator">
      <h2 class="mono">${copy.regulator}</h2>
      <blockquote>${escape(notice.quote)}</blockquote>
      <p class="mono"><span data-demo="regulator-name">${escape(notice.name)}</span> · <time datetime="${escape(notice.date)}">${escape(notice.date)}</time></p>
      <a class="mono" href="${escape(notice.url)}" rel="noreferrer">${copy.noticeLink} ↗</a>
    </section>` : ""}
    <footer class="report-end mono">
      ${rows[0] && !shared && offerWrongPage && canPointAtHomepage(c, rows[0])
        ? action(c, "wrong-page", copy.point, { extra: `<input type="hidden" name="claim" value="${rows[0].claim}">`, quiet: true, visible: "Test the lead claim against the homepage" }) : ""}
      <a href="/">${copy.newCheck} ↗</a>
    </footer>
  </article>`, { refresh: c.recheck?.status === "running" });
}
