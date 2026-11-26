import { createServer } from "node:http";
import { execFileSync } from "node:child_process";
import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { canShare, canRecheck, caseDir, createCase, latestCase, readCase, recheckCase, wrongPageCase } from "./engine/case.mjs";
import { home, report, reading, leadEvidence, errorPage, errors } from "./page.mjs";
import { quoteBounds } from "./engine/evidence-bounds.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const sampleId = "9f177adaf5e26b5d";
const assetTypes = new Map([
  ["clause.css", "text/css; charset=utf-8"],
  ["clause.js", "text/javascript; charset=utf-8"],
  ["glyph-mask.svg", "image/svg+xml"],
  ["receipt.webp", "image/webp"],
  ["site.css", "text/css; charset=utf-8"],
  ["site.js", "text/javascript; charset=utf-8"],
  ["pixels.js", "text/javascript; charset=utf-8"],
  ["logo.svg", "image/svg+xml"],
  ["fonts/inter-tight.woff2", "font/woff2"],
  ["fonts/jetbrains-mono.woff2", "font/woff2"],
  ["fonts/ibm-plex-mono-400.woff2", "font/woff2"],
  ["fonts/ibm-plex-mono-600.woff2", "font/woff2"],
  ["fonts/space-mono-700.woff2", "font/woff2"],
]);
const commit = process.env.APP_COMMIT || gitCommit();
const dev = process.env.NODE_ENV !== "production";
const readReplay = dev && process.env.KANE_REPLAY_READ ? {
  raw: process.env.KANE_REPLAY_READ,
  evidence: process.env.KANE_REPLAY_READ_EVIDENCE,
} : null;
const recheckReplay = dev ? process.env.KANE_RECHECK_REPLAY : null;
const wrongPageReplay = dev ? process.env.KANE_RECHECK_WRONG_PAGE_REPLAY : null;
const replayMode = Boolean(readReplay || recheckReplay || wrongPageReplay);

function gitCommit() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "unknown";
  }
}

function send(res, status, body, type = "text/html; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

function json(res, data, status = 200) {
  send(res, status, JSON.stringify(data), "application/json; charset=utf-8");
}

function redirect(res, location) {
  res.writeHead(303, { Location: location });
  res.end();
}

function fail(res, status) {
  send(res, status, errorPage(status));
}

async function form(req) {
  let length = 0;
  const chunks = [];
  for await (const chunk of req) {
    length += chunk.length;
    if (length > 128 * 1024) return null;
    chunks.push(chunk);
  }
  return new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
}

function serveFile(res, file, type) {
  if (!existsSync(file)) return fail(res, 404);
  res.writeHead(200, { "Content-Type": type });
  const stream = createReadStream(file);
  stream.on("error", () => res.destroy());
  res.on("close", () => stream.destroy());
  stream.pipe(res);
}

function summary(c) {
  const { id, stage, replay, site, sentences, recheck, wrongPage } = c;
  const kane = c.kane && { runId: c.kane.runId, testUrl: c.kane.testUrl };
  return { id, url: `/case/${id}`, stage, replay, site, sentences, kane, recheck, wrongPage };
}

async function route(req, res) {
  const { pathname, searchParams } = new URL(req.url, "http://localhost");
  const get = req.method === "GET";
  const post = req.method === "POST";
  if (get && pathname.startsWith("/assets/")) {
    const asset = pathname.slice("/assets/".length);
    const type = assetTypes.get(asset);
    if (type) return serveFile(res, join(root, "assets", asset), type);
  }
  if (get && pathname === "/") {
    const sample = existsSync(join(caseDir(sampleId), "case.json")) ? readCase(sampleId) : null;
    const bounds = new Map();
    for (const sentence of sample?.sentences?.filter(({ bound }) => bound) ?? []) {
      bounds.set(sentence.claim, await quoteBounds(caseDir(sampleId), sentence));
    }
    return send(res, 200, home("", sample, bounds));
  }
  if (get && pathname === "/version.json") return json(res, { commit });
  if (get && pathname === "/api/cases/latest") {
    const c = latestCase({ wrongPage: searchParams.get("variant") === "wrong-page" });
    return c ? json(res, summary(c)) : json(res, { error: errors[404] }, 404);
  }
  if (post && pathname === "/cases") {
    const message = (await form(req))?.get("message");
    if (!message?.trim() || message.length > 8000) return send(res, 400, home(errors[400]));
    if (replayMode && !readReplay) return fail(res, 409);
    void createCase(message, {
      replay: readReplay,
      onUpdate(c) {
        if (!res.headersSent) redirect(res, `/case/${c.id}?view=reading`);
      },
    }).catch((error) => {
      console.error(error.message);
      if (!res.headersSent) fail(res, 500);
    });
    return;
  }

  const match = pathname.match(/^\/(case|share|api\/cases)\/([a-f0-9]{10,16})(?:\/(.*))?$/);
  if (!match) return fail(res, 404);
  const [, section, id, action] = match;
  if (!existsSync(join(caseDir(id), "case.json"))) return fail(res, 404);
  const c = readCase(id);
  const replayFor = (wrongPage) => wrongPage ? wrongPageReplay : recheckReplay;
  const allowRecheck = (wrongPage) => (!replayMode && !c.replay) || Boolean(replayFor(wrongPage));
  const renderReport = async (options) => {
    const bounds = new Map();
    if (c.format === 1 && c.stage === "ready") {
      for (const sentence of c.sentences.filter(({ bound }) => bound)) {
        bounds.set(sentence.claim, await quoteBounds(caseDir(id), sentence));
      }
    }
    return send(res, 200, report(c, { ...options, bounds }));
  };
  if (get && section === "case" && !action) {
    if (c.format === 1 && c.stage !== "failed" && (c.stage !== "ready" || searchParams.get("view") === "reading")) {
      const lead = leadEvidence(c);
      return send(res, 200, reading(c, lead, await quoteBounds(caseDir(id), lead)));
    }
    return renderReport({ offerRecheck: allowRecheck(Boolean(c.wrongPage)), offerWrongPage: allowRecheck(true) });
  }
  if (get && section === "share" && !action) {
    return canShare(c) ? renderReport({ shared: true }) : fail(res, 404);
  }
  if (get && section === "api/cases") {
    if (action === "progress") {
      return json(res, {
        stage: c.stage,
        steps: c.kaneProgress ?? [],
        recheck: c.recheck && { status: c.recheck.status, steps: c.recheck.progress ?? [] },
      });
    }
    const raw = action?.match(/^kane\/(read|recheck)\.ndjson$/);
    if (raw) return serveFile(res, join(caseDir(id), `${raw[1]}.ndjson`), "application/x-ndjson; charset=utf-8");
    const image = action?.match(/^shots\/(\d+)\.jpg$/);
    const shot = image && c.sentences?.find(({ claim }) => claim === Number(image[1]))?.shot;
    return shot ? serveFile(res, join(caseDir(id), shot), "image/jpeg") : fail(res, 404);
  }
  if (post && section === "case") {
    if (action === "share") return canShare(c) ? redirect(res, `/share/${id}`) : fail(res, 409);
    if (action === "recheck") {
      const wrongPage = Boolean(c.wrongPage);
      if (!allowRecheck(wrongPage) || !canRecheck(c)) return fail(res, 409);
      const raw = replayFor(wrongPage);
      void recheckCase(c, { replay: raw ? { raw } : null });
      return redirect(res, `/case/${id}`);
    }
    if (action === "wrong-page") {
      if (!allowRecheck(true) || c.format !== 1) return fail(res, 409);
      const claim = Number((await form(req))?.get("claim"));
      const variant = wrongPageCase(c, claim);
      if (!variant) return fail(res, 409);
      void recheckCase(variant, { replay: wrongPageReplay ? { raw: wrongPageReplay } : null });
      return redirect(res, `/case/${variant.id}`);
    }
  }
  return fail(res, 404);
}

const port = Number(process.env.PORT ?? 3000);
createServer((req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
  route(req, res).catch((error) => {
    console.error(error.message);
    if (!res.headersSent) fail(res, 500);
    else res.destroy();
  });
}).listen(port, () => console.log(`Clause listening on port ${port}`));
