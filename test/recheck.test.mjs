import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { bind, validateClaims } from "../engine/agent.mjs";
import { canShare, sourceFor } from "../engine/case.mjs";
import { loadRun, runIdentity } from "../engine/kane.mjs";
import { compareRecheck, recheckObjective } from "../engine/recheck.mjs";
import { NOT_FOUND } from "../engine/text.mjs";
import { originalEnd, originalRun, originalPack, quote, faq, homepage, replayNdjson } from "./recheck-fixture.mjs";

const readRunId = runIdentity(originalEnd);
const claim = { claim: 2, quote, sourceUrl: faq };

function temp(t) {
  const dir = mkdtempSync(join(tmpdir(), "clause-fixture-"));
  t.after(() => rmSync(dir, { force: true, recursive: true }));
  return dir;
}

function recheck(t, options) {
  const dir = temp(t);
  const raw = join(dir, "recheck.ndjson");
  writeFileSync(raw, replayNdjson(options));
  return loadRun(raw, dir, "recheck");
}

test("the validator preserves original pitch punctuation and whitespace and drops invented or duplicate text", () => {
  const message = "Withdrawals are   “instant” and free.";
  const claims = [
    { text: 'Withdrawals are "instant"', question: "How soon?" },
    { text: "free", question: "How much?" },
    { text: "always free", question: "How much?" },
    { text: "free", question: "How much?" },
  ];
  assert.deepEqual(validateClaims(message, claims).map((c) => c.text), ["Withdrawals are   “instant”", "free"]);
});

test("hour-1 evidence binds its exact Kane quote, capture page and screenshot to the fee claim only", (t) => {
  const kane = loadRun(fileURLToPath(originalRun), temp(t), "read", fileURLToPath(originalPack));
  const claims = [{ text: "Withdrawals are instant" }, { text: "free" }, { text: "double in 2 weeks" }];
  const verdicts = [{ claim: 2, verdict: "corrected", evidence: "withdrawal_text" }];
  const [timing, fee, returns] = bind(verdicts, kane, { claims });
  assert.equal(timing.english, NOT_FOUND);
  assert.equal(fee.quote, quote);
  assert.equal(fee.sourceUrl, faq);
  assert.match(fee.shot, /5-0-5\/screenshot\.jpg$/);
  assert.equal(returns.english, NOT_FOUND);
  assert.equal(sourceFor(homepage)?.regulator, "Securities and Exchange Commission, Nigeria");
  assert.equal(sourceFor("https://example.org/"), null);
});

test("a fresh recheck passes when captured page text contains the whole normalized quote", (t) => {
  const text = "FAQ\n" + quote.replace("withdrawal fee", "withdrawal\nfee");
  const run = recheck(t, { text });
  const result = compareRecheck([claim], run, readRunId);
  assert.equal(result.status, "passed");
  assert.deepEqual(result.perClaim, [{ claim: 2, variable: "r2", sourceUrl: faq, visitedUrl: faq, foundText: text, matched: true }]);
  assert.equal(canShare({ format: 1, recheck: result }), true);
  assert.equal(canShare({ format: 1, replay: true, recheck: result }), false);
  assert.equal(canShare({ format: 1, recheck: { ...result, replay: true } }), false);
});

test("homepage text fails the recheck and keeps Share locked", (t) => {
  const run = recheck(t, { url: homepage, text: "ModMount | Trading Accounts" });
  const result = compareRecheck([{ ...claim, sourceUrl: homepage }], run, readRunId);
  assert.equal(result.status, "failed");
  assert.equal(result.perClaim[0].visitedUrl, homepage);
  assert.equal(result.perClaim[0].matched, false);
  assert.equal(canShare({ format: 1, recheck: result }), false);
});

test("matching text from a different page and missing quotes fail closed", (t) => {
  const offPage = recheck(t, { url: homepage });
  assert.equal(compareRecheck([claim], offPage, readRunId).status, "failed");
  const good = recheck(t);
  const absent = { claim: 3, quote: "A separate quote.", sourceUrl: faq };
  const mixed = compareRecheck([claim, absent], good, readRunId);
  assert.equal(mixed.status, "failed");
  assert.deepEqual(mixed.perClaim.map(({ matched }) => matched), [true, false]);
});

test("an incomplete or reused Kane run cannot pass even with matching text", (t) => {
  assert.equal(compareRecheck([claim], recheck(t, { status: "failed" }), readRunId).status, "incomplete");
  assert.equal(compareRecheck([claim], recheck(t, { session: readRunId }), readRunId).status, "incomplete");
});

test("Kane is sent to each cited page without being given the answer", () => {
  const objective = recheckObjective([claim, { ...claim, claim: 3, sourceUrl: homepage }],
    [{ question: "Timing?" }, { question: "Withdrawal fees?" }, { question: "When are fees charged?" }]);
  assert.ok(objective.includes(faq) && objective.includes(homepage));
  assert.ok(objective.includes("r2_url") && objective.includes("r3_url") && objective.includes("NOT FOUND"));
  assert.ok(!objective.includes(quote));
});
