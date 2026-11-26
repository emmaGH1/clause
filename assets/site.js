import { iconCanvas } from "/assets/pixels.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

// Every pixel icon on the page.
const icons = new Map();
for (const canvas of document.querySelectorAll("canvas[data-pixel]")) {
  const icon = iconCanvas(canvas, { line: canvas.classList.contains("claim-icon") || canvas.classList.contains("lock-icon") || canvas.classList.contains("dim") ? null : "#E6E6E0" });
  icon.set(canvas.dataset.pixel);
  icons.set(canvas, icon);
}

// Chapter icons glitch in when they scroll into view.
const seen = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const icon = icons.get(entry.target);
    icon?.set("kane");
    setTimeout(() => icon?.morph(entry.target.dataset.pixel, 600), 150);
    seen.unobserve(entry.target);
  }
}, { threshold: .6 });
document.querySelectorAll(".chapter canvas[data-pixel]").forEach((c) => seen.observe(c));

// Draw a crop of a screenshot into a canvas, pixelated by `block` px (1 = sharp).
function drawCrop(canvas, img, crop, block) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  if (block <= 1) { ctx.imageSmoothingEnabled = true; ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, w, h); return; }
  const sw = Math.max(1, Math.round(w / block)), sh = Math.max(1, Math.round(h / block));
  const tmp = drawCrop.tmp ??= document.createElement("canvas");
  tmp.width = sw; tmp.height = sh;
  const t = tmp.getContext("2d");
  t.imageSmoothingEnabled = true;
  t.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, sw, sh);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(tmp, 0, 0, sw, sh, 0, 0, w, h);
}

async function resolve(canvas, img, crop, ms = 1100) {
  const blocks = [28, 20, 14, 10, 7, 5, 3, 2, 1];
  for (const b of blocks) { drawCrop(canvas, img, crop, b); await wait(ms / blocks.length); }
}

function cropFor(bounds, img) {
  if (!bounds) return { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight, box: null };
  const left = Math.max(0, bounds.x - 30), top = Math.max(0, bounds.y - 103);
  const w = Math.min(bounds.width, bounds.right + 39) - left, h = Math.min(bounds.height, bounds.bottom + 30) - top;
  return { x: left, y: top, w, h, box: { x: bounds.x - left - 8, y: bounds.y - top - 8, w: bounds.right - bounds.x + 16, h: bounds.bottom - bounds.y + 16 } };
}

function boxOverlay(holder, crop) {
  if (!crop.box) return;
  const box = document.createElement("span");
  box.className = "cap-box";
  Object.assign(box.style, { left: crop.box.x / crop.w * 100 + "%", top: crop.box.y / crop.h * 100 + "%", width: crop.box.w / crop.w * 100 + "%", height: crop.box.h / crop.h * 100 + "%" });
  holder.append(box);
}

// The landing's product window: replays Kane's real run on the sample case.
const demo = document.querySelector("[data-demo-window]");
if (demo) {
  const data = JSON.parse(demo.dataset.demoWindow);
  const stageIcon = icons.get(demo.querySelector(".stage-icon"));
  const stage = demo.querySelector(".stage");
  const steps = demo.querySelector("[data-demo-steps]");
  const capture = demo.querySelector("[data-capture]");
  const shotHolder = capture.querySelector(".cap-shot");
  const label = capture.querySelector(".cap-label");
  const quote = demo.querySelector("[data-quote]");
  const badge = demo.querySelector("[data-badge]");
  const claimRows = [...demo.querySelectorAll("[data-claims] li")];
  const free = [...demo.querySelectorAll("mark.false")].find((m) => /free/i.test(m.textContent));
  const img = new Image();
  img.src = data.shot;
  const canvas = document.createElement("canvas");
  shotHolder.append(canvas);
  let crop;
  img.decode().then(() => {
    crop = cropFor(data.bounds, img);
    canvas.width = crop.w; canvas.height = crop.h;
    shotHolder.style.setProperty("--ratio", `${crop.w}/${crop.h}`);
    boxOverlay(shotHolder, crop);
  }).catch(() => {});

  const status = (claim, text, cls = "") => { const li = claimRows.find((r) => r.dataset.claim === String(claim)); if (li) { li.className = cls; li.querySelector("b").textContent = text; } };
  async function loop() {
    for (;;) {
      steps.replaceChildren(); capture.hidden = true; stage.hidden = false; quote.hidden = true; free?.classList.remove("struck");
      badge.textContent = `Kane CLI · run ${data.run}`; badge.classList.remove("done");
      stageIcon.set("kane");
      data.claims.forEach(({ claim }) => status(claim, "Waiting"));
      await wait(900);
      stageIcon.morph("term");
      data.claims.forEach(({ claim }) => status(claim, "Reading…"));
      for (const [i, step] of data.steps.entries()) {
        const [verb, ...rest] = step.split(": ");
        const li = document.createElement("li");
        li.innerHTML = `<span>${String(i + 1).padStart(2, "0")}</span>`;
        li.append(`${verb} ${rest.join(": ").replace(/^(Navigate to|Clicking|Scrolling to)\s*/i, "")}`);
        steps.append(li);
        await wait(850);
      }
      stageIcon.morph("camera");
      await wait(900);
      stage.hidden = true; capture.hidden = false; label.textContent = "Kane capture · c2";
      if (crop) await resolve(canvas, img, crop);
      data.claims.forEach(({ claim, bound }) => status(claim, bound ? "Captured" : "Not found", bound ? "got" : "miss"));
      await wait(500);
      free?.classList.add("struck"); quote.hidden = false;
      await wait(1600);
      if (data.recheck) { badge.textContent = `✓ Re-found by run ${data.recheck}`; badge.classList.add("done"); }
      await wait(5200);
    }
  }
  if (reduce) {
    capture.hidden = false; stage.hidden = true; quote.hidden = false; free?.classList.add("struck");
    img.decode().then(() => drawCrop(canvas, img, crop, 1)).catch(() => {});
  } else loop();
}

// Reading page: Kane's capture resolves from pixels to the real screenshot.
for (const fig of document.querySelectorAll("figure[data-resolve]")) {
  const img = fig.querySelector("img");
  const bounds = fig.dataset.bounds ? JSON.parse(fig.dataset.bounds) : null;
  img.decode().then(async () => {
    const crop = cropFor(bounds, img);
    const holder = document.createElement("div");
    holder.className = "cap-shot";
    holder.style.setProperty("--ratio", `${crop.w}/${crop.h}`);
    const canvas = document.createElement("canvas");
    canvas.width = crop.w; canvas.height = crop.h;
    holder.append(canvas);
    img.hidden = true;
    img.after(holder);
    await resolve(canvas, img, crop, 1300);
    boxOverlay(holder, crop);
  }).catch(() => {});
}
