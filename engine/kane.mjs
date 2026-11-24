// Kane runner: one `kane-cli run --agent`, its raw NDJSON kept verbatim, and the screenshot that proves each stored value.
import { spawn, execFileSync } from "node:child_process";
import { createWriteStream, mkdirSync, readFileSync, readdirSync, existsSync, copyFileSync } from "node:fs";
import { join } from "node:path";

export function runKane({ objective, url, outDir, name = "read", maxSteps = 20, timeoutS = 540, onEvent }) {
  mkdirSync(outDir, { recursive: true });
  const raw = join(outDir, `${name}.ndjson`);
  return new Promise((resolve, reject) => {
    const args = ["run", objective, "--url", url, "--headless", "--max-steps", String(maxSteps), "--timeout", String(timeoutS), "--agent"];
    const p = spawn("kane-cli", args, { stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, INSTABOX_HEADLESS: "1" } });
    const file = createWriteStream(raw);
    let buf = "", end = null, err = "";
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
      file.end();
      if (!end) return reject(new Error(`Kane ended without run_end (exit ${code}): ${err.slice(-300)}`));
      resolve(summarize(end, outDir, name));
    });
  });
}

// Read a saved run (used for replays of real past runs; never for a new case's sponsor step).
export function loadRun(rawFile, outDir, name) {
  const end = readFileSync(rawFile, "utf8").trim().split("\n").map((l) => JSON.parse(l)).find((e) => e.type === "run_end");
  return summarize(end, outDir, name);
}

function summarize(end, outDir, name) {
  const mem = end.context?.memory ?? {};
  const vars = Object.fromEntries(Object.keys(mem).map((k) => [k, end.final_state?.[k] ?? mem[k].extracted_value]));
  const shots = extractShots(end, outDir, name);
  return { status: end.status, runId: end.session_dir?.split("/").pop() ?? end.run_id, sessionDir: end.session_dir, testUrl: end.test_url, credits: end.credits_consumed,
    summary: end.per_flow_metadata?.[0]?.summary ?? end.summary, vars, shots, steps: shots.steps };
}

// The evidence pack (zip) has steps/<n>/screenshot.jpg + step.json. The step that stored a variable is an `analyze` step.
function extractShots(end, outDir, name) {
  const out = { steps: [], byVar: {} };
  const evDir = end.session_dir && join(end.session_dir, "evidence");
  if (!evDir || !existsSync(evDir)) return out;
  const pack = readdirSync(evDir).find((f) => f.endsWith(".evidence"));
  if (!pack) return out;
  const dest = join(outDir, `${name}-pack`);
  mkdirSync(dest, { recursive: true });
  copyFileSync(join(evDir, pack), join(outDir, `${name}.evidence`));
  execFileSync("unzip", ["-o", "-q", join(evDir, pack), "tests/*/steps/*", "-d", dest]);
  const tests = join(dest, "tests");
  for (const t of readdirSync(tests)) {
    const stepsDir = join(tests, t, "steps");
    for (const s of readdirSync(stepsDir).sort((a, b) => parseInt(a) - parseInt(b))) {
      const meta = JSON.parse(readFileSync(join(stepsDir, s, "step.json"), "utf8"));
      const shot = existsSync(join(stepsDir, s, "screenshot.jpg")) ? join(stepsDir, s, "screenshot.jpg") : null;
      out.steps.push({ ordinal: meta.ordinal, kind: meta.kind, summary: meta.summary, url: meta.url, shot: shot && shot.slice(outDir.length + 1) });
    }
  }
  // context.memory.<var>.step is the ordinal of the analyze step that stored it
  for (const [v, m] of Object.entries(end.context?.memory ?? {})) out.byVar[v] = out.steps.find((s) => s.ordinal === m.step)?.shot ?? null;
  return out;
}
