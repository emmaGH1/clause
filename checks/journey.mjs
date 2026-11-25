// One check per PLAN.md journey row. Use the live URL, logged out, at 390px.
// Sponsor checks only inspect completed real runs using raw Kane NDJSON served by the app.
import { readFileSync } from "node:fs";
import { runIdentity, runVars } from "../engine/kane.mjs";
import { normalize, NOT_FOUND, publicUrl } from "../engine/text.mjs";

export const url = (process.env.LIVE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const sources = JSON.parse(readFileSync(new URL("../engine/sources.json", import.meta.url), "utf8"));

export async function deployId() {
  const response = await fetch(`${url}/version.json`).catch(() => null);
  return response?.ok ? `deploy ${(await response.json()).commit}` : "";
}

const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

async function phone(fn) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  try {
    const page = await (await browser.newContext(PHONE)).newPage();
    return await fn(page);
  } finally {
    await browser.close();
  }
}

const hook = (locator, name) => locator.locator(`[data-demo=${name}]`);
const requireThat = (condition, reason) => { if (!condition) throw new Error(reason); };

async function latestCase(variant = "") {
  const response = await fetch(`${url}/api/cases/latest${variant}`);
  requireThat(response.ok, `no case yet (/api/cases/latest returned ${response.status})`);
  return response.json();
}

async function rawRun(id, which) {
  const response = await fetch(`${url}/api/cases/${id}/kane/${which}.ndjson`);
  requireThat(response.ok, `raw Kane output for ${which} unavailable (${response.status})`);
  const events = (await response.text()).trim().split("\n").map(JSON.parse);
  const end = events.find((event) => event.type === "run_end");
  requireThat(end?.status === "passed", `${which} Kane run ended ${end?.status ?? "without run_end"}`);
  return end;
}

async function report(page, c) {
  await page.goto(`${url}/case/${c.id}`, { waitUntil: "networkidle" });
  await hook(page, "report").waitFor({ timeout: 15_000 });
  await fitsPhone(page);
}

async function fitsPhone(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  requireThat(!overflow, "page scrolls sideways at phone width");
}

function realCase(c) {
  requireThat(!c.replay && !c.recheck?.replay, "Latest case uses replay evidence. A real Kane run is required.");
}

async function verifyRecheck(page, c, read, re) {
  const runId = runIdentity(re);
  requireThat(runId && runId !== runIdentity(read), "recheck reused the first Kane session");
  requireThat(runId === c.recheck?.runId, "case recheck ID differs from raw output");
  requireThat(normalize(await hook(page, "kane-recheck-run").innerText()) === runId, "recheck run ID differs on the report");

  const vars = runVars(re);
  const bound = c.sentences.filter((sentence) => sentence.bound);
  requireThat(bound.length > 0 && bound.length === c.recheck.perClaim.length, "recheck does not account for every cited quote");
  for (const sentence of bound) {
    const row = page.locator(`[data-demo=claim-row][data-claim="${sentence.claim}"]`);
    const quote = await hook(row, "kane-quote").innerText();
    const source = await hook(row, "kane-source").getAttribute("href");
    const evidence = await hook(row, "final-claim").getAttribute("data-evidence");
    requireThat(normalize(quote) === normalize(runVars(read)[evidence]) && normalize(quote), "cited quote differs from the original Kane output");
    const result = c.recheck.perClaim.find(({ claim }) => claim === sentence.claim);
    const slot = `r${sentence.claim}`;
    requireThat(result?.variable === slot && result.sourceUrl === source, "recheck is not tied to the cited claim and page");
    requireThat(publicUrl(vars[`${slot}_url`])?.href === source && result.visitedUrl === source, "raw recheck did not record the cited page as visited");
    const text = normalize(vars[slot]);
    requireThat(text && normalize(result.foundText) === text, "recheck text on the case differs from the raw Kane output");
    requireThat(result.matched === (text !== "NOT FOUND" && text.includes(normalize(quote))), "Kane’s raw text disagrees with the claim’s recheck result");
  }
  return runId;
}

export default {
  J1: () => phone(async (page) => {
    await page.goto(url, { waitUntil: "networkidle" });
    const form = hook(page, "app-ready");
    await form.getByRole("textbox").waitFor({ timeout: 15_000 });
    requireThat(await form.getByRole("button", { name: "Check", exact: true }).isVisible(), "no Check button next to the paste box");
    await fitsPhone(page);
    return "paste box and Check button visible at 390px";
  }),

  J2: (ctx) => phone(async (page) => {
    const c = await latestCase();
    realCase(c);
    const end = await rawRun(c.id, "read");
    await report(page, c);
    const row = hook(page, "claim-row").filter({ has: page.locator("[data-demo=kane-quote]") }).first();
    const quote = normalize(await hook(row, "kane-quote").innerText({ timeout: 7_000 }));
    const variable = await hook(row, "final-claim").getAttribute("data-evidence");
    const vars = runVars(end);
    requireThat(quote && quote === normalize(vars[variable]), "quote on the page differs from the exact stored Kane value");
    const runId = normalize(await hook(page, "kane-run").innerText());
    requireThat(runId && runId === runIdentity(end), "run ID on the page differs from Kane's raw output");
    const shot = hook(row, "kane-shot").locator("img");
    requireThat(await shot.evaluate((img) => img.naturalWidth > 0), "Kane's screenshot doesn't load");
    const source = await hook(row, "kane-source").getAttribute("href");
    const claim = Number(await row.getAttribute("data-claim"));
    const rawSource = vars[`${variable}_url`];
    requireThat(publicUrl(source) && c.sentences.find((entry) => entry.claim === claim)?.sourceUrl === source, "Kane source page is missing");
    if (rawSource) requireThat(publicUrl(rawSource)?.href === source, "cited source differs from Kane's recorded page");
    ctx?.save?.("J2-kane-read", { case: c.id, runId, quote, source });
    return `Kane run ${runId} shows the exact stored quote, screenshot and source page`;
  }),

  J3: () => phone(async (page) => {
    const c = await latestCase();
    await report(page, c);
    const rows = await hook(page, "claim-row").all();
    const shown = [];
    let missing = 0;
    for (const row of rows) {
      const id = Number(await row.getAttribute("data-claim"));
      const excerpt = hook(row, "draft-claim");
      const final = hook(row, "final-claim");
      const text = await excerpt.textContent();
      requireThat(normalize(text) === normalize(c.sentences.find(({ claim }) => claim === id)?.text), "report changes the wording of a pitch claim");
      const verdict = await final.getAttribute("data-verdict");
      const struck = await excerpt.locator("s").count() === 1;
      requireThat(struck === (verdict === "corrected"), "strikethrough disagrees with the claim verdict");
      if (struck) requireThat(await hook(row, "kane-quote").isVisible(), "a struck claim has no Kane quote beside it");
      if (verdict === "unverified") {
        requireThat(normalize(await final.innerText()) === NOT_FOUND, "missing claim uses the wrong wording");
        missing++;
      }
      shown.push({ text, struck });
    }
    const instant = shown.find(({ text }) => /\binstant\b/.test(text));
    const free = shown.find(({ text }) => /\bfree\b/.test(text));
    requireThat(instant && free && instant !== free, "demo pitch must show “instant” and “free” as separate excerpts");
    requireThat(free.struck && missing, "demo pitch needs a struck-out fee claim and an uncaptured claim");
    return `${rows.length} pitch excerpts, with instant and free separate and ${missing} uncaptured`;
  }),

  J4: () => phone(async (page) => {
    const c = await latestCase();
    await report(page, c);
    const rows = await hook(hook(page, "report"), "claim-row").all();
    requireThat(rows.length && rows.length === c.sentences.length, "report does not list every pitch claim");
    for (const row of rows) {
      requireThat(normalize(await hook(row, "draft-claim").textContent()), "report row omits the pitch wording");
      const shot = hook(row, "kane-shot").locator("img");
      if (await shot.count()) {
        requireThat(await shot.evaluate((img) => img.naturalWidth > 0), "Kane's screenshot doesn't load");
        requireThat(await hook(row, "kane-quote").isVisible(), "screenshot has no quoted wording");
      } else {
        requireThat(normalize(await hook(row, "final-claim").innerText()) === NOT_FOUND, "report row lacks evidence or the required not-found wording");
      }
    }
    const source = sources.modmount;
    requireThat(source.hosts.includes(c.site?.host), "latest report is not for the supported ModMount demo");
    requireThat(await hook(page, "supported-demo").isVisible(), "ModMount supported demo label is missing");
    const notice = hook(page, "regulator");
    requireThat(await notice.locator("blockquote").textContent() === source.quote, "regulator notice differs from the original quote");
    requireThat(await hook(notice, "regulator-name").textContent() === source.regulator, "regulator name is missing or wrong");
    requireThat(await notice.locator("time").getAttribute("datetime") === source.date, "regulator date is missing or wrong");
    requireThat(await notice.getByRole("link").getAttribute("href") === source.url, "regulator link is missing or wrong");
    return `report shows all ${rows.length} claims and the original regulator notice on the supported ModMount case`;
  }),

  J5: () => phone(async (page) => {
    const c = await latestCase();
    realCase(c);
    const read = await rawRun(c.id, "read");
    const re = await rawRun(c.id, "recheck");
    await report(page, c);
    const id = await verifyRecheck(page, c, read, re);
    requireThat(c.recheck.status === "passed" && c.recheck.perClaim.every(({ matched }) => matched), "fresh Kane recheck did not find every quote");
    requireThat(await page.locator("[data-demo=kane-recheck][data-verdict=match]").isVisible(), "matching recheck result is absent");
    requireThat(await page.getByRole("button", { name: "Share", exact: true }).isEnabled(), "Share is locked after a matching recheck");
    return `fresh Kane run ${id} re-found every quote on its cited page and unlocked Share`;
  }),

  "J5!": () => phone(async (page) => {
    const original = await latestCase();
    const c = await latestCase("?variant=wrong-page");
    realCase(c);
    requireThat(c.wrongPage?.from === original.id, "homepage demo must come from the current report");
    const read = await rawRun(c.id, "read");
    const re = await rawRun(c.id, "recheck");
    await report(page, c);
    const id = await verifyRecheck(page, c, read, re);
    requireThat(id !== original.recheck?.runId, "homepage demo reused the successful recheck session");
    requireThat(c.recheck.status === "failed", "homepage demo did not fail the quote comparison");
    const result = c.recheck.perClaim.find(({ claim }) => claim === c.wrongPage.claim);
    const pageUrl = publicUrl(result?.sourceUrl);
    requireThat(pageUrl?.href !== c.wrongPage.originalUrl && pageUrl && /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/?)?$/i.test(pageUrl.pathname), "the cited page is not the site's homepage");
    requireThat(result && !result.matched, "Kane found the quote on the homepage");
    const row = page.locator(`[data-demo=claim-row][data-claim="${c.wrongPage.claim}"]`);
    requireThat(await row.locator("[data-demo=claim-recheck][data-verdict=missing]").isVisible(), "the wrong-page claim is not flagged");
    requireThat(await page.getByRole("button", { name: "Share", exact: true }).isDisabled(), "Share is enabled after a missing quote");
    return `fresh Kane run ${id} missed the homepage quote, flagged the claim, and kept Share locked`;
  }),
};
