// The briefing agent. It drafts, Kane checks, and the agent rewrites only from Kane's captures.
// Runs Claude headless (`claude -p`) with no tools and a strict JSON schema.
import { spawn } from "node:child_process";

const MODEL = process.env.AGENT_MODEL ?? "sonnet";

export function claude(prompt, schema, system) {
  return new Promise((resolve, reject) => {
    const args = ["-p", "--model", MODEL, "--output-format", "json", "--tools", "", "--no-session-persistence",
      "--setting-sources", "", "--json-schema", JSON.stringify(schema), "--system-prompt", system];
    const p = spawn("claude", args, { stdio: ["pipe", "pipe", "pipe"] });
    let out = "", err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => {
      try {
        const r = JSON.parse(out);
        const v = r.structured_output ?? (typeof r.result === "string" ? JSON.parse(r.result) : r.result);
        if (!v) throw new Error("no structured output");
        resolve(v);
      } catch (e) {
        reject(new Error(`agent failed (${code}): ${e.message} ${err.slice(-400)} ${out.slice(-400)}`));
      }
    });
    p.stdin.end(prompt);
  });
}

const DRAFT_SCHEMA = {
  type: "object",
  properties: {
    url: { type: "string", description: "the investment site's URL from the message, with https://" },
    entity: { type: "string", description: "the short brand name only, e.g. ModMount" },
    claims: {
      type: "array", minItems: 1, maxItems: 3,
      items: {
        type: "object",
        properties: {
          draft: { type: "string", description: "the claim as you would state it right now, before any checking (one sentence)" },
          question: { type: "string", description: "what a careful visitor must find on the site's own public pages to confirm or correct it" },
        },
        required: ["draft", "question"],
      },
    },
  },
  required: ["url", "entity", "claims"],
};

export async function draft(message) {
  const system =
    "You help someone understand an investment pitch they were sent. Right now you have NOT seen the website. " +
    "Write the briefing sentences you would naively give based only on what the message says (these drafts will be checked against the live site, so do not hedge them). " +
    "Pick at most 3 claims that matter most to someone deciding whether to send money, especially about getting money out (withdrawals, fees, conditions). " +
    "For each, write the question a careful visitor must answer from the site's own public pages.";
  return claude(`Forwarded message:\n"""\n${message}\n"""`, DRAFT_SCHEMA, system);
}

// One Kane run answers every question, so one case costs one run.
export function kaneObjective(d) {
  const qs = d.claims.map((c, i) => `${i + 1}. ${c.question} Store the site's exact words that answer it as 'c${i + 1}' (copy the sentence(s) verbatim; if the public pages don't say it, store NOT FOUND).`);
  return [
    "You are a careful reader checking an investment website before someone sends money. Starting from this investment company's homepage, read its public pages (Help Center, FAQ, fees, legal pages) to answer these questions.",
    "Only read and navigate public pages. Do NOT fill in, submit or click into any account, sign-up, login, deposit or payment form, and do not download files.",
    ...qs,
    "Also store the URL of the page where you found the most important answer as 'source_url'.",
  ].join("\n");
}

const REWRITE_SCHEMA = {
  type: "object",
  properties: {
    sentences: {
      type: "array",
      items: {
        type: "object",
        properties: {
          claim: { type: "integer", description: "1-based index of the draft claim this replaces" },
          verdict: { type: "string", enum: ["supported", "corrected", "unverified"] },
          evidence: { type: "string", description: "the Kane variable used, e.g. c1, or empty when unverified" },
          quote: { type: "string", description: "the exact substring of Kane's captured text you rely on, copied verbatim; empty when unverified" },
          english: { type: "string", description: "one short plain English sentence (max 30 words including the quote). When using evidence, include the shortest decisive quote verbatim inside quotation marks." },
          why: { type: "string", description: "why the draft changed, in a few words" },
          topic: { type: "string", description: "2-5 word topic of the claim, e.g. 'double money in 2 weeks'" },
        },
        required: ["claim", "verdict", "evidence", "quote", "english", "why", "topic"],
      },
    },
  },
  required: ["sentences"],
};

export async function rewrite(d, kaneVars) {
  const system =
    "You rewrite a short fact summary using ONLY what a browser agent (Kane) captured on the live site. Rules: " +
    "a sentence about what the site says must quote Kane's captured words verbatim; keep every qualifier (may, depending on, can) exactly; " +
    "if Kane stored NOT FOUND or nothing, the verdict is unverified and the sentence says we couldn't verify it on the site; " +
    "never add facts from your own knowledge; never call the site a scam yourself. One sentence per draft claim.";
  const prompt = JSON.stringify({ drafts: d.claims.map((c, i) => ({ claim: i + 1, draft: c.draft, question: c.question })), kane_captured: kaneVars }, null, 2);
  return claude(prompt, REWRITE_SCHEMA, system);
}

// The app, not the model, decides whether a sentence may cite evidence: the quote must be inside Kane's capture.
const n = (s) => String(s ?? "").replace(/[“”"]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
// a quote is compared without its closing punctuation, which often moves outside the quotation marks
const q = (s) => n(s).replace(/[.,;:!?]+$/, "");
export function bind(sentences, kaneVars, d) {
  return sentences.map((s) => {
    // the evidence must be a variable Kane stored whose value contains the quote verbatim
    const holds = (k) => { const v = n(kaneVars[k]); return v && v !== "NOT FOUND" && q(s.quote).length >= 12 && v.includes(q(s.quote)); };
    const varName = holds(s.evidence) ? s.evidence : Object.keys(kaneVars).find(holds);
    const ok = s.verdict !== "unverified" && varName && n(s.english).includes(q(s.quote));
    if (ok) return { ...s, evidence: varName, bound: true, model: { ...s } };
    if (s.verdict === "unverified") return { ...s, bound: false, evidence: "", quote: "", model: { ...s } };
    // the model claimed evidence it doesn't have: the app replaces its words, it doesn't trust them
    const draftText = d.claims[s.claim - 1]?.draft ?? "this claim";
    return { ...s, model: { ...s }, bound: false, verdict: "unverified", evidence: "", quote: "", downgraded: true,
      english: `Not stated on the site's public pages: ${draftText}` };
  });
}
