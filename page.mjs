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
  passed: "Kane found every cited quote again.",
  empty: "The message contains no quoted pitch claims to check.",
  noQuotes: "Sharing requires a quote captured and rechecked by Kane.",
  failed: "Recheck failed. Sharing is locked.",
  recheck: "Recheck cited pages",
  point: "Point this claim at the homepage",
  share: "Share",
  captured: "Captured by Kane",
  citation: "Cited page",
  run: "Kane run ID",
  freshRun: "Kane recheck run ID",
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
  ${refresh ? '<meta http-equiv="refresh" content="2">' : ""}
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

function action(c, name, label, extra = "", disabled = false) {
  return `<form method="post" action="/case/${c.id}/${name}">${extra}<button${disabled ? " disabled" : ""}>${label}</button></form>`;
}

function claimRow(c, sentence, { shared, offerWrongPage }) {
  const { claim, text, verdict, bound, evidence, quote, sourceUrl } = sentence;
  const contradicted = verdict === "corrected";
  const result = c.recheck?.perClaim?.find((entry) => entry.claim === claim);
  const pitch = `<span class="pitch-text" data-demo="draft-claim" data-struck="${contradicted}">${contradicted ? `<s>${escape(text)}</s>` : escape(text)}</span>`;
  const proof = bound ? `
    <blockquote data-demo="kane-quote">${escape(quote)}</blockquote>
    <figure data-demo="kane-shot"><img src="/api/cases/${c.id}/shots/${claim}.jpg" alt="${copy.shot}"></figure>
    <p>${copy.citation} <a data-demo="kane-source" href="${escape(sourceUrl)}" rel="noreferrer">${escape(defang(sourceUrl))}</a></p>
    <p>${copy.captured} <time datetime="${escape(c.kane.capturedAt)}">${escape(c.kane.capturedAt)}</time></p>`
    : `<p>${escape(sentence.english)}</p>`;
  return `<li data-demo="claim-row" data-claim="${claim}">
  <p>${pitch}</p>
  <div data-demo="final-claim" data-verdict="${verdict}"${bound ? ` data-evidence="${escape(evidence)}"` : ""}>${proof}</div>
  ${result && !result.matched && c.recheck.status === "failed" ? `<p data-demo="claim-recheck" data-verdict="missing">${NOT_FOUND}</p>` : ""}
  ${!shared && offerWrongPage && canPointAtHomepage(c, sentence) ? action(c, "wrong-page", copy.point, `<input type="hidden" name="claim" value="${claim}">`) : ""}
</li>`;
}

export function report(c, { shared = false, offerRecheck = true, offerWrongPage = true } = {}) {
  const heading = `<h1>${shared ? copy.shared : copy.report}</h1>
    ${c.regulator ? `<p data-demo="supported-demo">${copy.supported}</p>` : ""}
    ${c.replay || c.recheck?.replay ? `<p data-demo="replay">${copy.replay}</p>` : ""}
    ${c.wrongPage ? `<p data-demo="wrong-page">${copy.wrongPage}</p>` : ""}`;
  if (c.format !== 1 || c.stage === "failed") return layout(`${heading}<p role="status">${INCOMPLETE}</p><a href="/">${copy.newCheck}</a>`);
  if (c.stage !== "ready") {
    const progress = c.kaneProgress?.filter(Boolean) ?? [];
    return layout(`${heading}<p role="status">${copy[c.stage]}</p>
      ${progress.length ? `<ol>${progress.map((step) => `<li>${escape(step)}</li>`).join("")}</ol>` : ""}`, { refresh: true });
  }

  const recheck = c.recheck;
  const recheckVerdict = { passed: "match", failed: "missing" };
  const notice = c.regulator;
  const rows = c.sentences.map((sentence) => claimRow(c, sentence, { shared, offerWrongPage })).join("");
  return layout(`<article data-demo="report">
    ${heading}
    ${rows ? `<ol>${rows}</ol>` : `<p>${copy.empty}</p>`}
    ${c.kane?.runId ? `<p>${copy.run} <code data-demo="kane-run">${escape(c.kane.runId)}</code></p>` : ""}
    ${notice ? `<section data-demo="regulator">
      <h2>${copy.regulator}</h2>
      <blockquote>${escape(notice.quote)}</blockquote>
      <p><span data-demo="regulator-name">${escape(notice.name)}</span> · <time datetime="${escape(notice.date)}">${escape(notice.date)}</time></p>
      <p><a href="${escape(notice.url)}" rel="noreferrer">${copy.noticeLink}</a></p>
    </section>` : ""}
    ${recheck ? `<p role="status" data-demo="kane-recheck" data-verdict="${recheckVerdict[recheck.status] ?? recheck.status}">
      ${recheck.status === "incomplete" ? INCOMPLETE : copy[recheck.status]}
    </p>` : ""}
    ${recheck?.runId ? `<p>${copy.freshRun} <code data-demo="kane-recheck-run">${escape(recheck.runId)}</code></p>` : ""}
    ${!recheck && !c.sentences.some(({ bound }) => bound) ? `<p>${copy.noQuotes}</p>` : ""}
    ${!shared && offerRecheck && canRecheck(c) ? action(c, "recheck", copy.recheck) : ""}
    ${!shared ? action(c, "share", copy.share, "", !canShare(c)) : ""}
    <p><a href="/">${copy.newCheck}</a></p>
  </article>`, { refresh: recheck?.status === "running" });
}
