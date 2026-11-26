import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const active = new Map();
let ocrUnavailable = false;
const words = (value) => value.normalize("NFKC").toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

function findQuote(tsv, quote) {
  const rows = tsv.trimEnd().split("\n").slice(1).map((row) => row.split("\t"));
  const page = rows.find(([level]) => level === "1");
  const [width, height] = page?.slice(8, 10).map(Number) ?? [];
  const tokens = rows.filter(([level]) => level === "5").flatMap((row) => {
    const [x, y, w, h] = row.slice(6, 10).map(Number);
    return words(row[11] ?? "").map((text) => ({ text, x, y, w, h }));
  });
  const target = words(quote);
  if (!width || !height || !target.length) return null;
  const start = tokens.findIndex(({ text }, i) =>
    text === target[0] && target.every((word, offset) => tokens[i + offset]?.text === word));
  if (start < 0) return null;
  const match = tokens.slice(start, start + target.length);
  const x = Math.min(...match.map((word) => word.x));
  const y = Math.min(...match.map((word) => word.y));
  const right = Math.max(...match.map((word) => word.x + word.w));
  const bottom = Math.max(...match.map((word) => word.y + word.h));
  // Reject matches spanning distant columns or disjoint parts of the screenshot.
  if (bottom - y > height * .45) return null;
  return { x, y, right, bottom, width, height };
}

async function locate(dir, shot, quote, cache) {
  try {
    return JSON.parse(await readFile(cache, "utf8"));
  } catch {}
  if (ocrUnavailable) return null;

  let bounds;
  try {
    const { stdout } = await run("tesseract", [join(dir, shot), "stdout", "tsv"], {
      timeout: 4500, maxBuffer: 1024 * 1024, env: { ...process.env, OMP_THREAD_LIMIT: "1" },
    });
    bounds = findQuote(stdout, quote);
  } catch (error) {
    if (error.code === "ENOENT") ocrUnavailable = true;
    return null;
  }
  try {
    const temp = `${cache}.${process.pid}.tmp`;
    await writeFile(temp, JSON.stringify(bounds));
    await rename(temp, cache);
  } catch {}
  return bounds;
}

// Each immutable capture/quote pair runs OCR once per case, including cached misses.
export function quoteBounds(dir, { shot, quote } = {}) {
  if (!shot || !quote) return Promise.resolve(null);
  const hash = createHash("sha256").update(JSON.stringify([shot, quote])).digest("hex").slice(0, 24);
  const cache = join(dir, `quote-bounds-v1-${hash}.json`);
  if (!active.has(cache)) {
    active.set(cache, locate(dir, shot, quote, cache).finally(() => active.delete(cache)));
  }
  return active.get(cache);
}

// Kane sometimes stores a value on the step before the answer is expanded on screen.
// When the bound screenshot doesn't show the quote, use the nearest screenshot from the
// same Kane run (next steps first) where OCR finds the exact quote, so the image proves the text.
export async function evidenceShot(dir, sentence = {}) {
  const { shot, quote } = sentence;
  const own = await quoteBounds(dir, sentence);
  if (own || !shot || !quote) return { shot, bounds: own };
  const parts = shot.split("/");
  const stepsDir = parts.slice(0, -2).join("/");
  const steps = (await readdir(join(dir, stepsDir)).catch(() => [])).sort((a, b) => parseInt(a) - parseInt(b));
  const at = steps.indexOf(parts.at(-2));
  if (at < 0) return { shot, bounds: null };
  const order = [at + 1, at + 2, at + 3, at - 1, at - 2].filter((i) => i >= 0 && i < steps.length);
  for (const i of order) {
    const candidate = `${stepsDir}/${steps[i]}/screenshot.jpg`;
    const bounds = await quoteBounds(dir, { shot: candidate, quote });
    if (bounds) return { shot: candidate, bounds };
  }
  return { shot, bounds: null };
}
