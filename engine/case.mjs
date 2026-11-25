// A case persists each stage as the pitch and live evidence are checked.
import { cpSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, copyFileSync, renameSync } from "node:fs";
import { join, dirname } from "node:path";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import * as agent from "./agent.mjs";
import { runKane, loadRun } from "./kane.mjs";
import { compareRecheck, recheckObjective } from "./recheck.mjs";
import { INCOMPLETE, publicUrl } from "./text.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const CASES = process.env.CASES_DIR ?? join(ROOT, "data/cases");
const SOURCES = JSON.parse(readFileSync(join(ROOT, "engine/sources.json"), "utf8"));

export const caseDir = (id) => join(CASES, id);
export const readCase = (id) => JSON.parse(readFileSync(join(caseDir(id), "case.json"), "utf8"));

function save(c, patch) {
  Object.assign(c, patch, { updatedAt: new Date().toISOString() });
  const path = join(caseDir(c.id), "case.json");
  writeFileSync(`${path}.tmp`, JSON.stringify(c, null, 2));
  renameSync(`${path}.tmp`, path);
}

function newCase(fields) {
  const id = randomBytes(8).toString("hex");
  mkdirSync(caseDir(id), { recursive: true });
  const c = { ...fields, id, createdAt: new Date().toISOString() };
  save(c, {});
  return c;
}

export function latestCase({ wrongPage = false, from, claim } = {}) {
  if (!existsSync(CASES)) return null;
  const cases = readdirSync(CASES).filter((id) => /^[a-f0-9]{10,16}$/.test(id)).flatMap((id) => {
    if (!existsSync(join(caseDir(id), "case.json"))) return [];
    const c = readCase(id);
    if (c.format !== 1 || Boolean(c.wrongPage) !== wrongPage) return [];
    if (from && (c.wrongPage.from !== from || c.wrongPage.claim !== claim)) return [];
    return [c];
  });
  return cases.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null;
}

export const defang = (url) => String(url).replace(/^https?:\/\//, "").replace(/\./g, "[.]").replace(/\/$/, "");

export function sourceFor(url) {
  const host = publicUrl(url)?.hostname;
  return Object.values(SOURCES).find((source) => source.hosts?.includes(host)) ?? null;
}

function runForCase(c, name, objective, url, replay, onEvent) {
  if (!replay) return runKane({ objective, url, outDir: caseDir(c.id), name, onEvent });
  const { raw, evidence } = replay;
  copyFileSync(raw, join(caseDir(c.id), `${name}.ndjson`));
  return loadRun(raw, caseDir(c.id), name, evidence);
}

export async function createCase(message, { replay = null, onUpdate } = {}) {
  const c = newCase({ format: 1, message, stage: "extracting", replay: Boolean(replay) });
  const update = (patch) => {
    save(c, patch);
    onUpdate?.(c);
  };
  update({});
  try {
    const d = await agent.draft(message);
    const url = new URL(d.url);
    const source = sourceFor(d.url);
    const regulator = source && { name: source.regulator, date: source.date, url: source.url, quote: source.quote };
    update({ stage: "kane-reading", draft: d, site: { url: d.url, host: url.hostname, defanged: defang(url.hostname) }, regulator });
    if (!d.claims.length) {
      update({ stage: "ready", sentences: [] });
      return c;
    }

    // Keep the engine's existing string-path replay option.
    if (typeof replay === "string") replay = { raw: replay };
    const objective = agent.kaneObjective(d);
    const kane = await runForCase(c, "read", objective, d.url, replay, (event) => {
      if (event.step && event.status === "done") {
        update({ kaneProgress: [...(c.kaneProgress ?? []), event.remark] });
      }
    });
    update({ stage: "assessing", kane: { ...kane, capturedAt: new Date().toISOString() } });
    if (kane.status !== "passed") throw new Error(INCOMPLETE);
    const { sentences } = await agent.rewrite(d, kane.vars);
    update({ stage: "ready", sentences: agent.bind(sentences, kane, d) });
  } catch (error) {
    console.error("Case read failed", c.id, error.message);
    update({ stage: "failed", error: INCOMPLETE });
  }
  return c;
}

export const canShare = (c) => c.format === 1 && !c.replay && !c.recheck?.replay && c.recheck?.status === "passed";

export const canRecheck = (c) => c.stage === "ready" && !c.recheck && c.sentences.some(({ bound }) => bound);

function homepageFor(c, sentence) {
  const home = new URL(sentence.sourceUrl);
  const firstPage = publicUrl(c.kane.steps.find((step) => step.kind === "navigate")?.url);
  if (firstPage?.origin === home.origin && /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/?)?$/i.test(firstPage.pathname)) {
    return firstPage.href;
  }
  // Preserve a locale prefix (e.g. /en/) when the cited page has one.
  home.pathname = (home.pathname.match(/^\/[a-z]{2}(?:-[a-z]{2})?(?=\/|$)/i)?.[0] ?? "") + "/";
  home.search = "";
  return home.href;
}

export function wrongPageCase(c, claim) {
  if (c.stage !== "ready" || c.wrongPage) return null;
  const target = c.sentences.find((sentence) => sentence.claim === claim && sentence.bound);
  if (!target) return null;
  const sourceUrl = homepageFor(c, target);
  if (sourceUrl === target.sourceUrl) return null;
  const existing = latestCase({ wrongPage: true, from: c.id, claim });
  if (existing) return existing;
  const { id, createdAt, updatedAt, recheck, ...fields } = c;
  const variant = newCase({
    ...fields,
    wrongPage: { from: id, claim, originalUrl: target.sourceUrl },
    sentences: c.sentences.map((sentence) => sentence === target ? { ...sentence, sourceUrl } : sentence),
  });
  copyFileSync(join(caseDir(id), "read.ndjson"), join(caseDir(variant.id), "read.ndjson"));
  cpSync(join(caseDir(id), "read-pack"), join(caseDir(variant.id), "read-pack"), { recursive: true });
  return variant;
}

export function canPointAtHomepage(c, sentence) {
  return !c.wrongPage && sentence.bound && homepageFor(c, sentence) !== sentence.sourceUrl;
}

export async function recheckCase(c, { replay = null } = {}) {
  if (!canRecheck(c) || (c.replay && !replay)) return;
  const claims = c.sentences.filter(({ bound }) => bound);
  save(c, { recheck: { status: "running", replay: Boolean(replay) } });
  try {
    const objective = recheckObjective(claims, c.draft.claims);
    const run = await runForCase(c, "recheck", objective, claims[0].sourceUrl, replay);
    save(c, { recheck: { ...compareRecheck(claims, run, c.kane.runId), replay: Boolean(replay) } });
  } catch (error) {
    console.error("Case recheck failed", c.id, error.message);
    save(c, { recheck: { status: "incomplete", replay: Boolean(replay), perClaim: [] } });
  }
}
