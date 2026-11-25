// One case: forwarded message → agent draft → Kane reads the live site → agent rewrites from Kane only → a fact report.
// Every stage is written to data/cases/<id>/case.json as it happens, so the app can show progress.
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import * as agent from "./agent.mjs";
import { runKane, loadRun } from "./kane.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const CASES = process.env.CASES_DIR ?? join(ROOT, "data/cases");
const SOURCES = JSON.parse(readFileSync(join(ROOT, "engine/sources.json"), "utf8"));

export const caseDir = (id) => join(CASES, id);
export const readCase = (id) => JSON.parse(readFileSync(join(caseDir(id), "case.json"), "utf8"));

function saver(c) {
  return (patch) => {
    Object.assign(c, patch, { updatedAt: new Date().toISOString() });
    writeFileSync(join(caseDir(c.id), "case.json"), JSON.stringify(c, null, 2));
    return c;
  };
}

const hostOf = (u) => { try { return new URL(u).hostname.toLowerCase(); } catch { return ""; } };
export const defang = (u) => String(u).replace(/^https?:\/\//, "").replace(/\./g, "[.]").replace(/\/$/, "");

export function sourceFor(url) {
  const h = hostOf(url);
  return Object.values(SOURCES).find((s) => s.hosts?.includes(h)) ?? null;
}

// replay: path to a saved real Kane NDJSON (dev only; the case is labelled replay and can never be shared)
export async function createCase(message, { replay = null, onUpdate } = {}) {
  const id = randomBytes(5).toString("hex");
  mkdirSync(caseDir(id), { recursive: true });
  const c = { id, message, createdAt: new Date().toISOString(), stage: "drafting", replay: !!replay };
  const save = (p) => { const r = saver(c)(p); onUpdate?.(r); return r; };
  save({});
  try {
    const d = await agent.draft(message);
    const source = sourceFor(d.url);
    save({ stage: "kane-reading", draft: d, site: { url: d.url, host: hostOf(d.url), defanged: defang(d.url) }, source });

    const objective = agent.kaneObjective(d);
    let kane;
    if (replay) {
      kane = loadRun(replay, caseDir(id), "read");
      copyFileSync(replay, join(caseDir(id), "read.ndjson"));
    } else {
      kane = await runKane({ objective, url: d.url, outDir: caseDir(id), name: "read",
        onEvent: (ev) => ev.step && ev.status === "done" && save({ kaneProgress: [...(c.kaneProgress ?? []), ev.remark] }) });
    }
    save({ stage: "rewriting", kane: { objective, ...kane, capturedAt: new Date().toISOString() } });
    if (kane.status !== "passed") throw new Error(`Kane couldn't finish reading the site (${kane.status})`);

    const { sentences } = await agent.rewrite(d, kane.vars);
    const bound = agent.bind(sentences, kane.vars, d).map((s) => ({ ...s, shot: s.bound ? kane.shots.byVar[s.evidence] : null }));
    const regulator = source ? { name: source.regulator, date: source.date, url: source.url, quote: source.quote,
      text: `${source.regulator} (${enDate(source.date)}): ${source.entity} is not registered or licensed to solicit investments in Nigeria.` } : null;
    save({ stage: "ready", sentences: bound, regulator });
  } catch (e) {
    save({ stage: "failed", error: String(e.message ?? e) });
  }
  return c;
}

const enDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
