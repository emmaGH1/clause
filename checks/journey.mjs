// checks/journey.mjs: one check per journey step in docs/PLAN.md.
// rules: runs against the LIVE url, logged out, phone width. returns what it SAW; throws with what went wrong.
// Kane costs credits, so status never starts a Kane run: J2/J5 inspect the latest real case the app holds
// and tie what the page shows to that run's raw Kane output (served by the app from the run's NDJSON).

export const url = (process.env.LIVE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function deployId() {
  const r = await fetch(`${url}/version.json`).catch(() => null);
  return r?.ok ? `deploy ${(await r.json()).commit}` : "";
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

// the newest real case: { id, url, kane: { runId, testUrl, quote, sourceUrl }, recheck: {...} }
async function latestCase() {
  const r = await fetch(`${url}/api/cases/latest`).catch(() => null);
  if (!r?.ok) throw new Error(`no case yet (/api/cases/latest → ${r?.status ?? "unreachable"})`);
  return r.json();
}

async function rawRun(caseId, which) {
  const r = await fetch(`${url}/api/cases/${caseId}/kane/${which}.ndjson`);
  if (!r.ok) throw new Error(`raw Kane output for ${which} not served (${r.status})`);
  const lines = (await r.text()).trim().split("\n").map((l) => JSON.parse(l));
  const end = lines.find((l) => l.type === "run_end");
  if (!end) throw new Error(`${which}: no run_end in raw Kane output`);
  return end;
}

const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

export default {
  J1: () =>
    phone(async (page) => {
      await page.goto(url, { waitUntil: "networkidle" });
      await page.locator("[data-demo=app-ready]").waitFor({ timeout: 15_000 });
      const box = page.getByRole("textbox").first();
      await box.waitFor({ timeout: 5_000 });
      const btn = page.getByRole("button", { name: /check/i }).first();
      if (!(await btn.isVisible())) throw new Error("no Check button next to the paste box");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (overflow) throw new Error("page scrolls sideways at phone width");
      return "paste box and Check button visible at 390px";
    }),

  J2: (ctx) =>
    phone(async (page) => {
      const c = await latestCase();
      const end = await rawRun(c.id, "read");
      if (end.status !== "passed") throw new Error(`Kane read run ended ${end.status}`);
      const vars = end.final_state?.variables ?? end.variables ?? {};
      const rawQuote = norm(Object.values(vars).find((v) => /quote|text/i.test(v?.syntax ?? ""))?.value ?? JSON.stringify(vars));
      await page.goto(`${url}/case/${c.id}`, { waitUntil: "networkidle" });
      const shown = norm(await page.locator("[data-demo=kane-quote]").first().innerText({ timeout: 15_000 }));
      if (!shown || !rawQuote.includes(shown.replace(/^[“"]|[”"]$/g, ""))) throw new Error("the quote on the page is not the value in Kane's raw output");
      const runId = norm(await page.locator("[data-demo=kane-run]").first().innerText());
      if (!runId || !JSON.stringify(end).includes(runId)) throw new Error("the run ID on the page doesn't match Kane's run");
      const shot = page.locator("[data-demo=kane-shot] img").first();
      const w = await shot.evaluate((i) => i.naturalWidth).catch(() => 0);
      if (!w) throw new Error("Kane's screenshot doesn't load");
      ctx?.save?.("J2-kane-read", { case: c.id, runId, quote: shown });
      return `Kane run ${runId} quote shown: “${shown.slice(0, 60)}…”`;
    }),

  J3: () =>
    phone(async (page) => {
      const c = await latestCase();
      await page.goto(`${url}/case/${c.id}`, { waitUntil: "networkidle" });
      const draft = page.locator("[data-demo=draft-claim][data-struck=true]").first();
      await draft.waitFor({ timeout: 15_000 });
      const finals = await page.locator("[data-demo=final-claim]").allInnerTexts();
      if (!finals.length) throw new Error("no revised sentences");
      const quote = norm(await page.locator("[data-demo=kane-quote]").first().innerText());
      const bound = await page.locator("[data-demo=final-claim][data-evidence]").count();
      const unverified = await page.locator("[data-demo=final-claim][data-verdict=unverified]").count();
      if (bound + unverified < finals.length) throw new Error("a revised sentence has neither Kane evidence nor 'not stated on the site'");
      if (!quote) throw new Error("no Kane quote on the case");
      return `draft struck; ${finals.length} revised sentences (${bound} bound to Kane evidence, ${unverified} unverified)`;
    }),

  J4: () =>
    phone(async (page) => {
      const c = await latestCase();
      await page.goto(`${url}/case/${c.id}`, { waitUntil: "networkidle" });
      const rows = page.locator("[data-demo=report] [data-demo=claim-row]");
      await rows.first().waitFor({ timeout: 15_000 });
      const n = await rows.count();
      for (let i = 0; i < n; i++) {
        const r = rows.nth(i);
        const hasShot = (await r.locator("[data-demo=kane-shot] img").count()) > 0;
        const notStated = /not stated on the site/i.test(await r.innerText());
        if (!hasShot && !notStated) throw new Error(`claim ${i + 1} has neither Kane's screenshot nor "not stated on the site"`);
      }
      const reg = norm(await page.locator("[data-demo=regulator]").innerText().catch(() => ""));
      if (reg && !/20\d\d/.test(reg)) throw new Error("regulator notice shown without a date");
      return `report lists ${n} claims, each with Kane's screenshot or "not stated on the site"`;
    }),

  J5: () =>
    phone(async (page) => {
      const c = await latestCase();
      const read = await rawRun(c.id, "read");
      const re = await rawRun(c.id, "recheck");
      if (re.status !== "passed") throw new Error(`Kane recheck ended ${re.status}`);
      if (re.run_dir === read.run_dir || re.session_dir === read.session_dir) throw new Error("recheck reused the first Kane session");
      if (!JSON.stringify(re).includes(c.id)) throw new Error("recheck did not open this case's briefing page");
      await page.goto(`${url}/case/${c.id}`, { waitUntil: "networkidle" });
      await page.locator("[data-demo=kane-recheck][data-verdict=match]").waitFor({ timeout: 15_000 });
      const share = page.getByRole("button", { name: /share/i }).first();
      if (!(await share.isEnabled())) throw new Error("Share still disabled after a matching recheck");
      return "second Kane run confirmed the briefing; Share enabled";
    }),

  "J5!": () =>
    phone(async (page) => {
      const c = await latestCase();
      await page.goto(`${url}/case/${c.id}`, { waitUntil: "networkidle" });
      await page.getByRole("button", { name: /remove kane'?s receipt/i }).click({ timeout: 15_000 });
      await page.getByText(/not stated on the site/i).first().waitFor({ timeout: 15_000 });
      const share = page.getByRole("button", { name: /share/i }).first();
      if (await share.isEnabled()) throw new Error("Share still enabled without Kane's receipt: it's faked");
      const exp = page.getByRole("button", { name: /export|download/i }).first();
      if ((await exp.count()) && (await exp.isEnabled())) throw new Error("export still enabled without Kane's receipt");
      return "without the receipt: 'not stated on the site', Share disabled";
    }),
};
