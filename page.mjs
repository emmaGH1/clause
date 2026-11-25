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

function layout(body, { mode = "report", refresh = false } = {}) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${refresh ? '<noscript><meta http-equiv="refresh" content="3"></noscript>' : ""}
  <title>${copy.name}</title>
  <meta name="theme-color" content="#180F25">
  <link rel="stylesheet" href="/assets/clause.css">
  <script type="module" src="/assets/clause.js"></script>
</head>
<body class="${mode}">
  <canvas class="paper-field" data-paper-field aria-hidden="true"></canvas>
  <header class="masthead"><a class="wordmark" href="/" aria-label="Clause home"><span aria-hidden="true">[&gt;]</span> Clause</a></header>
  <main>${body}</main>
</body>
</html>`;
}

export function home(error = "", sample = null) {
  const excerpt = sample?.message.match(/Your money[^.]*\.\s+Withdrawals are instant and free(?=,|\.)/i)?.[0];
  const hero = sample && excerpt && !error ? `
<section class="landing-hero">
  <div class="landing-title">
    <p class="pitch-label">The pitch</p>
    <h1 class="glyph-title"><span>Instant</span><span>&amp; free.</span></h1>
  </div>
  <canvas class="receipt-art" data-receipt="/assets/receipt.webp" aria-hidden="true"></canvas>
  <div class="landing-copy">
    <p>${escape(excerpt)}.</p>
    <a class="button primary" href="/case/${sample.id}?view=reading"><span aria-hidden="true">[</span> Check this pitch <span aria-hidden="true">→ ]</span></a>
    <a class="paste-link" href="#paste">Paste your own <span aria-hidden="true">↘</span></a>
  </div>
</section>` : "";
  return layout(`${hero}
<form id="paste" class="paste-form" method="post" action="/cases" data-demo="app-ready">
  <h${hero ? 2 : 1}>Check an investment pitch</h${hero ? 2 : 1}>
  ${error ? `<p role="alert">${escape(error)}</p>` : ""}
  <label for="message">${copy.pitch}</label>
  <textarea id="message" name="message" rows="5" required maxlength="8000"></textarea>
  <button class="button primary" type="submit" aria-label="${copy.check}"><span aria-hidden="true">[</span> Check <span aria-hidden="true">→ ]</span></button>
</form>`, { mode: "landing" });
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

export function reading(c, lead, bounds) {
  const complete = c.stage === "ready";
  const title = complete ? "Kane read the site." : c.stage === "kane-reading" ? "Kane is reading the site." : copy[c.stage];
  const source = lead && (c.wrongPage?.claim === lead.claim ? c.wrongPage.originalUrl : lead.sourceUrl);
  return layout(`<section class="reading-page"${complete ? "" : ` data-live-case="${c.id}" data-poll="read" data-stage="${c.stage}"`}>
    <header class="reading-heading">
      <h1>${title}</h1>
      ${c.site ? `<p>${escape(c.site.defanged ?? defang(c.site.url))}</p>` : ""}
    </header>
    <div class="reading-grid">
      ${lead ? `<figure class="reading-capture" data-scan${bounds ? ` data-bounds="${escape(JSON.stringify(bounds))}"` : ""}>
        <img src="${shotUrl(c, lead)}" alt="${copy.shot}">
        <canvas aria-hidden="true"></canvas>
        <span class="scan-guide" aria-hidden="true"></span>
        <span class="scan-brackets" aria-hidden="true"></span>
      </figure>` : complete ? "" : `<div class="reading-idle" aria-hidden="true"><canvas data-idle></canvas></div>`}
      <div class="reading-detail">
        ${lead ? `<blockquote>“${escape(readingQuote(lead.quote))}”</blockquote>
          <a class="capture-link" href="${shotUrl(c, lead)}" target="_blank" rel="noopener">${bounds ? "Open full capture" : "Full capture · quote position unavailable"} <span aria-hidden="true">↗</span></a>`
          : complete ? `<p>${c.sentences?.length ? NOT_FOUND : copy.empty}</p>` : ""}
        ${source ? `<p class="reading-source">${escape(defang(source))}</p>` : ""}
        ${complete ? `<a class="button primary" href="/case/${c.id}"><span aria-hidden="true">[</span> Read the report <span aria-hidden="true">→ ]</span></a>`
          : `<h2 class="reading-steps-heading">Live Kane steps</h2>${ticker(c.kaneProgress)}`}
      </div>
    </div>
  </section>`, { mode: "reading", refresh: !complete });
}

function action(c, name, label, { extra = "", disabled = false, primary = false, quiet = false, visible = label } = {}) {
  return `<form method="post" class="${name}-form" action="/case/${c.id}/${name}">${extra}
    <button class="${quiet ? "text-button" : `button${primary ? " primary" : ""}`}" aria-label="${escape(label)}"${disabled ? " disabled" : ""}>
      ${quiet ? escape(visible) : `<span aria-hidden="true">[</span> ${escape(visible)} <span aria-hidden="true">${disabled ? "]" : "→ ]"}</span>`}
    </button>
  </form>`;
}

function reportHeading(c) {
  const labels = c.sentences.filter(({ verdict }) => verdict === "corrected").flatMap(({ text }) => {
    const claim = text.trim().replace(/[.!?]+$/u, "");
    const descriptor = /^(?:.+\b(?:am|is|are|was|were|be)\s+)?([\p{L}][\p{L}-]{1,10})$/iu.exec(claim)?.[1];
    return descriptor ? [`Not ${descriptor.toLowerCase()}.`] : [];
  });
  const distinct = [...new Set(labels)].slice(0, 2);
  if (distinct.length) return distinct;
  return c.sentences.some(({ verdict }) => verdict === "corrected") ? ["The pitch", "falls short."] : [copy.report];
}

function shotCrop(c, sentence, bounds) {
  const url = shotUrl(c, sentence);
  let geometry = "";
  if (bounds) {
    const { x, y, right, bottom, width, height } = bounds;
    const left = Math.max(0, x - 30);
    const top = Math.max(0, y - 103);
    const cropWidth = Math.min(width, right + 39) - left;
    const cropHeight = Math.min(height, bottom + 30) - top;
    geometry = ` style="--crop-ratio:${cropWidth}/${cropHeight};--shot-w:${width / cropWidth * 100}%;--shot-x:${left / cropWidth * -100}%;--shot-y:${top / cropHeight * -100}%;"`;
  }
  return `<figure class="evidence-frame" data-demo="kane-shot">
    <a href="${url}" target="_blank" rel="noopener" class="shot-link" aria-label="Open full Kane capture in a new tab">
      <span class="bracket-edge" aria-hidden="true"><span>[</span><span>]</span></span>
      <span class="shot-window${bounds ? " crop" : ""}"${geometry}><img src="${url}" alt="${copy.shot}"></span>
      <span class="bracket-edge" aria-hidden="true"><span>[</span><span>]</span></span>
    </a>
    <figcaption>${bounds ? "Open full capture" : "Full capture · quote position unavailable"} <span aria-hidden="true">↗</span></figcaption>
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
  const proof = bound ? `
    <blockquote data-demo="kane-quote">${escape(quote)}</blockquote>
    <p class="evidence-source">${originalSource ? "Re-check page" : copy.citation} <a data-demo="kane-source" href="${escape(sourceUrl)}" rel="noreferrer">${escape(pageLabel(sourceUrl))}</a></p>
    ${originalSource ? `<p class="evidence-source">Original capture ${escape(pageLabel(originalSource))}</p>` : ""}
    ${shotCrop(c, sentence, bounds.get(claim))}
    <div class="capture-meta">
      ${capturedAt ? `<p>Captured <time datetime="${escape(capturedAt)}">${escape(readableTime)}</time></p>` : ""}
      ${c.kane?.runId ? `<p>Run <code>${escape(c.kane.runId)}</code></p>` : ""}
    </div>` : `<p class="no-evidence">${NOT_FOUND}</p>`;
  return `<li class="claim${flagged ? " flagged" : ""}" data-demo="claim-row" data-claim="${claim}">
    <p class="claim-pitch">${pitch}</p>
    ${flagged ? `<div class="claim-alert" data-demo="claim-recheck" data-verdict="missing">
      <strong>Quote missing from the cited page</strong>
      ${result.visitedUrl && result.visitedUrl !== sourceUrl && result.visitedUrl !== originalSource ? `<p>Kane visited ${escape(pageLabel(result.visitedUrl))} during the re-check.</p>` : ""}
    </div>` : ""}
    <div data-demo="final-claim" data-verdict="${escape(verdict)}"${bound ? ` data-evidence="${escape(evidence)}"` : ""}>${proof}</div>
    ${!shared && offerWrongPage && canPointAtHomepage(c, sentence)
      ? action(c, "wrong-page", copy.point, { extra: `<input type="hidden" name="claim" value="${claim}">`, quiet: true }) : ""}
  </li>`;
}

function recheckPanel(c, { shared, offerRecheck }, lead) {
  const recheck = c.recheck;
  const running = recheck?.status === "running";
  const shareable = canShare(c);
  const recheckVerdict = { passed: "match", failed: "missing" };
  const status = recheck ? recheck.status === "incomplete" ? INCOMPLETE : copy[recheck.status] : "Re-check the evidence";
  const detail = shareable ? "A second Kane run found every quote on its cited page."
    : c.replay || recheck?.replay ? copy.replay
    : recheck?.status === "failed" ? "At least one quote was missing from its cited page. Sharing is locked."
    : !lead ? copy.noQuotes
    : running ? "Share unlocks after Kane finds every quote again."
    : "Share unlocks after a successful re-check.";
  return `<aside class="recheck-panel"${running ? ` data-live-case="${c.id}" data-poll="recheck"` : ""}>
    <h2${recheck ? ` role="status" data-demo="kane-recheck" data-verdict="${recheckVerdict[recheck.status] ?? recheck.status}"` : ""}>${status}</h2>
    <p class="recheck-detail">${detail}</p>
    ${running ? ticker(recheck.progress) : ""}
    ${!shared && offerRecheck && canRecheck(c) ? action(c, "recheck", copy.recheck, { primary: true }) : ""}
    ${!shared ? action(c, "share", copy.share, { disabled: !shareable, primary: shareable, visible: shareable ? "Share report" : "Share locked" }) : ""}
    ${c.kane?.runId || recheck?.runId ? `<dl class="run-list">
      ${c.kane?.runId ? `<div><dt>${copy.run}</dt><dd><code data-demo="kane-run">${escape(c.kane.runId)}</code></dd></div>` : ""}
      ${recheck?.runId ? `<div><dt>${copy.freshRun}</dt><dd><code data-demo="kane-recheck-run">${escape(recheck.runId)}</code></dd></div>` : ""}
    </dl>` : ""}
    ${c.wrongPage ? `<a href="/case/${escape(c.wrongPage.from)}">Return to original report <span aria-hidden="true">↗</span></a>` : ""}
  </aside>`;
}

export function report(c, { shared = false, offerRecheck = true, offerWrongPage = true, bounds = new Map() } = {}) {
  if (c.format !== 1 || c.stage === "failed") return layout(`<div class="error-page"><h1>${copy.report}</h1><p role="status">${INCOMPLETE}</p><a href="/">${copy.newCheck}</a></div>`);
  if (c.stage !== "ready") return reading(c);

  const lines = reportHeading(c);
  const longest = Math.max(...lines.map((line) => line.length));
  const lead = leadEvidence(c) ?? c.sentences[0];
  const notice = c.regulator;
  const remaining = c.sentences.filter((sentence) => sentence !== lead);
  const claimOptions = { shared, offerWrongPage, bounds };
  return layout(`<article data-demo="report" class="report-page">
    <header class="report-heading">
      <h1 class="glyph-title report-title" style="--headline-chars:${longest}">${lines.map((line) => `<span>${escape(line)}</span>`).join(" ")}</h1>
      <div class="report-context">
        ${notice ? `<p data-demo="supported-demo">${copy.supported}</p>` : c.site?.defanged ? `<p>${escape(c.site.defanged)}</p>` : ""}
        ${shared ? `<p>${copy.shared}</p>` : ""}
        ${c.replay || c.recheck?.replay ? `<p data-demo="replay">${copy.replay}</p>` : ""}
        ${c.wrongPage ? `<p class="wrong-page-label" data-demo="wrong-page">${copy.wrongPage}${c.recheck?.status === "failed" ? " · Share locked" : ""}</p>` : ""}
      </div>
    </header>
    <div class="report-flow">
      ${lead ? `<ol class="claim-list lead-claim">${claimRow(c, lead, { ...claimOptions, offerWrongPage: false })}</ol>` : `<p class="lead-claim">${copy.empty}</p>`}
      ${recheckPanel(c, claimOptions, lead?.bound && lead)}
      ${remaining.length ? `<ol class="claim-list remaining-claims" start="2">${remaining.map((sentence) => claimRow(c, sentence, claimOptions)).join("")}</ol>` : ""}
      ${notice ? `<section class="regulator" data-demo="regulator">
        <h2>${copy.regulator}</h2>
        <blockquote>${escape(notice.quote)}</blockquote>
        <p><span data-demo="regulator-name">${escape(notice.name)}</span> · <time datetime="${escape(notice.date)}">${escape(notice.date)}</time></p>
        <a href="${escape(notice.url)}" rel="noreferrer">${copy.noticeLink} <span aria-hidden="true">↗</span></a>
      </section>` : ""}
    </div>
    <footer class="report-end">
      ${lead && !shared && offerWrongPage && canPointAtHomepage(c, lead)
        ? action(c, "wrong-page", copy.point, { extra: `<input type="hidden" name="claim" value="${lead.claim}">`, quiet: true, visible: "Test the lead claim against the homepage" }) : ""}
      <a href="/">${copy.newCheck} <span aria-hidden="true">↗</span></a>
    </footer>
  </article>`, { refresh: c.recheck?.status === "running" });
}
