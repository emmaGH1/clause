// Kane runner: one `kane-cli run --agent`, its raw NDJSON kept verbatim, and the screenshot that proves each stored value.
import { spawn, execFileSync } from "node:child_process";
import { createWriteStream, mkdirSync, readFileSync, readdirSync, existsSync, copyFileSync } from "node:fs";
import { join, relative } from "node:path";

export function runKane({ objective, url, outDir, name = "read", maxSteps = 20, timeoutS = 540, onEvent }) {
  mkdirSync(outDir, { recursive: true });
  const raw = join(outDir, `${name}.ndjson`);
  return new Promise((resolve, reject) => {
    const args = ["run", objective, "--url", url, "--headless", "--max-steps", String(maxSteps), "--timeout", String(timeoutS), "--agent"];
    const p = spawn("kane-cli", args, { stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, INSTABOX_HEADLESS: "1" } });
    const file = createWriteStream(raw);
    let buf = "", end = null, err = "";
    p.stdout.setEncoding("utf8");
    p.on("error", reject);
    file.on("error", reject);
    p.stdout.on("data", (d) => {
      file.write(d);
      buf += d;
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i); buf = buf.slice(i + 1);
        try {
          const ev = JSON.parse(line);
          if (ev.type === "run_end") end = ev;
          onEvent?.(ev);
        } catch {}
      }
    });
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => {
      file.end(() => {
        try {
          if (!end && buf.trim()) {
            const event = JSON.parse(buf);
            if (event.type === "run_end") end = event;
          }
          if (!end) throw new Error(`Kane ended without run_end (exit ${code}): ${err.slice(-300)}`);
          resolve(summarize(end, outDir, name));
        } catch (error) {
          reject(error);
        }
      });
    });
  });
}

// Read a saved run for a labelled replay.
export function loadRun(rawFile, outDir, name, evidencePack) {
  const end = readFileSync(rawFile, "utf8").trim().split("\n").map(JSON.parse).find((event) => event.type === "run_end");
  return summarize(end, outDir, name, evidencePack);
}

export function runIdentity(end) {
  // run_id is "run-0" in unrelated sessions too.
  return end.session_dir?.split(/[/\\]/).filter(Boolean).at(-1) ?? end.run_id;
}

export function runVars(end) {
  return Object.fromEntries(Object.entries(end.context?.memory ?? {}).map(
    ([key, entry]) => [key, end.final_state?.[key] ?? entry.extracted_value],
  ));
}

function summarize(end, outDir, name, evidencePack) {
  if (!end) throw new Error("Kane output has no run_end");
  const vars = runVars(end);
  const shots = extractShots(end, outDir, name, evidencePack);
  const captures = Object.entries(end.context?.memory ?? {}).filter(
    ([key, entry]) => entry.analyzer_type !== "url" && !/(^|_)url$/.test(key),
  );
  const sourceUrls = Object.fromEntries(captures.map(([key]) => [
    key, shots.pageByVar[key] || vars[`${key}_url`] || (captures.length === 1 ? vars.source_url : null),
  ]));
  return {
    status: end.status, runId: runIdentity(end), sessionDir: end.session_dir, testUrl: end.test_url,
    credits: end.credits_consumed, summary: end.per_flow_metadata?.[0]?.summary ?? end.summary,
    vars, sourceUrls, shots, steps: shots.steps,
  };
}

// Kane's evidence pack maps each stored variable to the capture step and its screenshot.
function extractShots(end, outDir, name, evidencePack) {
  const out = { steps: [], byVar: {}, pageByVar: {} };
  const evDir = end.session_dir && join(end.session_dir, "evidence");
  if (!evidencePack && evDir && existsSync(evDir)) {
    const pack = readdirSync(evDir).find((file) => file.endsWith(".evidence"));
    if (pack) evidencePack = join(evDir, pack);
  }
  if (!evidencePack) return out;
  const dest = join(outDir, `${name}-pack`);
  mkdirSync(dest, { recursive: true });
  copyFileSync(evidencePack, join(outDir, `${name}.evidence`));
  execFileSync("unzip", ["-o", "-q", evidencePack, "tests/*/steps/*", "-d", dest]);
  const tests = join(dest, "tests");
  for (const test of readdirSync(tests)) {
    const stepsDir = join(tests, test, "steps");
    if (!existsSync(stepsDir)) continue;
    for (const step of readdirSync(stepsDir).sort((a, b) => parseInt(a) - parseInt(b))) {
      const metaPath = join(stepsDir, step, "step.json");
      if (!existsSync(metaPath)) continue;
      const meta = JSON.parse(readFileSync(metaPath, "utf8"));
      const shot = join(stepsDir, step, "screenshot.jpg");
      out.steps.push({
        ordinal: meta.ordinal, kind: meta.kind, summary: meta.summary, url: meta.url,
        shot: existsSync(shot) ? relative(outDir, shot) : null,
      });
    }
  }
  for (const [key, entry] of Object.entries(end.context?.memory ?? {})) {
    const step = out.steps.find(({ ordinal }) => ordinal === entry.step);
    out.byVar[key] = step?.shot ?? null;
    out.pageByVar[key] = step?.url ?? null;
  }
  return out;
}
