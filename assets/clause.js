const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const field = document.querySelector("[data-paper-field]");
const rainGlyphs = "|:.,*+";
const glyphs = " .:;=+*#%@";
const composeRibbon = !document.body.matches(".landing") && !document.querySelector("[data-live-case]");

function fitCanvas(canvas, width, height) {
  const scale = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext("2d");
  context.scale(scale, scale);
  return context;
}

function drawField(canvas, tick = 0, dense = false) {
  const { clientWidth: width, clientHeight: height } = canvas;
  if (!width || !height) return;
  const scale = Math.min(devicePixelRatio || 1, 2);
  const resized = canvas.width !== Math.round(width * scale) || canvas.height !== Math.round(height * scale);
  const context = resized ? fitCanvas(canvas, width, height) : canvas.getContext("2d");
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.clearRect(0, 0, width, height);
  context.font = '10px "IBM Plex Mono", monospace';
  if (composeRibbon && !dense) drawRibbons(context, width, height);
  const spacing = dense ? 12 : 34;
  const columns = Math.ceil(width / spacing);
  for (let column = 0; column < columns; column++) {
    const random = (column * 127 + 81) % 197 / 197;
    const head = ((column * 233 + tick * (2 + column % 3)) % height + height) % height;
    for (let index = 0; index < (dense ? 8 : 2) + column % 5; index++) {
      context.fillStyle = column % 7 === 3 ? "#ffaa70" : "#cf9cff";
      context.globalAlpha = (.12 + random * .35) * (1 - index / 7);
      const char = rainGlyphs[(column + index + Math.floor(tick / 3)) % rainGlyphs.length];
      context.fillText(char, column * spacing + 3 + random * spacing * .55, head - index * 7);
    }
  }
}

function drawRibbons(context, width, height) {
  const spacing = width < 600 ? 4 : 5;
  const start = width < 600 ? width * .38 : width * .48;
  context.font = `600 ${spacing + 2}px "IBM Plex Mono", monospace`;
  for (let x = 0; x < width; x += spacing) {
    for (let row = -5; row <= 5; row++) {
      const phase = x / width * Math.PI * 3.5;
      const density = ((x * 23 + row * 17 + 2000) % 37) / 37;
      const strength = .6 - Math.abs(row) * .085;
      if (density > strength + .18) continue;
      const wave = Math.sin(phase) * (19 + row * 1.45);
      const tilt = Math.sin(phase * .45 + row * .11) * 17;
      const top = 17 + wave + tilt + row * 4;
      const bottom = height - 25 - wave + tilt + row * 4;
      const glyph = glyphs[1 + Math.floor(density * (glyphs.length - 1))];
      context.fillStyle = Math.cos(phase + row * .23) > .47 ? "#ffaa70" : "#cf9cff";
      context.globalAlpha = strength * (x < start ? .30 : .56);
      if (x > start) context.fillText(glyph, x, top);
      context.fillText(glyph, x, bottom);
    }
  }
}

function drawReceipt(canvas, source) {
  const { clientWidth: width, clientHeight: height } = canvas;
  if (!width || !height) return;
  const context = fitCanvas(canvas, width, height);
  const mobile = matchMedia("(max-width: 680px)").matches;
  const cellWidth = width < 450 ? 3.5 : 5;
  const cellHeight = cellWidth * 1.25;
  const columns = Math.floor(width / cellWidth);
  const rows = Math.floor(height / cellHeight);
  const sample = document.createElement("canvas");
  sample.width = columns;
  sample.height = rows;
  const pixels = sample.getContext("2d");
  const sourceRatio = source.naturalWidth / source.naturalHeight;
  const drawHeight = Math.min(rows, columns * cellWidth / cellHeight / sourceRatio);
  const offset = mobile ? -columns * .045 : 0;
  const drawWidth = drawHeight * cellHeight * sourceRatio / cellWidth;
  pixels.translate(mobile ? columns : 0, 0);
  pixels.scale(mobile ? -1 : 1, 1);
  pixels.drawImage(source, (columns - drawWidth) / 2 - offset, (rows - drawHeight) / 2, drawWidth, drawHeight);
  const rgba = pixels.getImageData(0, 0, columns, rows).data;
  const paper = new Uint8Array(columns * rows);
  for (let index = 0; index < paper.length; index++) {
    const [red, green, blue, alpha] = rgba.subarray(index * 4, index * 4 + 4);
    paper[index] = alpha > 90 && red > blue + 7 && green > blue + 1;
  }
  context.font = `600 ${cellHeight * 1.26}px "IBM Plex Mono", monospace`;
  context.textBaseline = "top";
  for (let index = 0; index < columns * rows; index++) {
    const [red, green, blue, alpha] = rgba.subarray(index * 4, index * 4 + 4);
    if (alpha < 34) continue;
    const x = index % columns;
    const y = Math.floor(index / columns);
    if (paper[index]) {
      const edge = !paper[index - 1] || !paper[index + 1] || !paper[index - columns] || !paper[index + columns];
      const sourceY = (y - (rows - drawHeight) / 2) / drawHeight;
      const tilt = Math.floor((mobile ? -x : x) / 11);
      const printed = sourceY > .435 && sourceY < .805 && (y + tilt) % 4 === 0;
      const char = edge ? (paper[index - columns] && paper[index + columns] ? "|" : "=")
        : printed ? "==++===="[x % 8] : red < 165 ? "%" : ":."[x % 2];
      context.fillStyle = "#fff1d6";
      context.globalAlpha = edge || printed ? 1 : .4 + red / 255 * .25;
      context.fillText(char, x * cellWidth, y * cellHeight);
      continue;
    }
    const light = (.25 * red + .6 * green + .15 * blue) / 255 * alpha / 255;
    const value = Math.max(1, Math.min(glyphs.length - 1, Math.round(light * (glyphs.length - 1))));
    context.fillStyle = "#cf9cff";
    context.globalAlpha = .42 + light * .58;
    context.fillText(glyphs[value], x * cellWidth, y * cellHeight);
  }
}

const idle = document.querySelector("[data-idle]");
const live = document.querySelector("[data-live-case]");
let tick = 0;
function drawRain() {
  if (field) drawField(field, tick);
  if (idle) drawField(idle, tick, true);
}

const rainObserver = new ResizeObserver(drawRain);
if (field) rainObserver.observe(field);
if (idle) rainObserver.observe(idle);
if (live) {
  let rainTimer;
  function setRainMotion() {
    clearInterval(rainTimer);
    if (!reducedMotion.matches && !document.hidden) rainTimer = setInterval(() => {
      tick++;
      drawRain();
    }, 125);
  }
  setRainMotion();
  reducedMotion.addEventListener("change", setRainMotion);
  document.addEventListener("visibilitychange", setRainMotion);
}

const receipt = document.querySelector("[data-receipt]");
if (receipt) {
  const source = new Image();
  source.src = receipt.dataset.receipt;
  Promise.all([source.decode(), document.fonts.load('600 12px "IBM Plex Mono"')]).then(() => {
    new ResizeObserver(() => drawReceipt(receipt, source)).observe(receipt);
  }).catch(() => {});
}

const scan = document.querySelector("[data-scan][data-bounds]");
if (scan) {
  const image = scan.querySelector("img");
  const canvas = scan.querySelector("canvas");
  const bounds = JSON.parse(scan.dataset.bounds);
  Promise.all([image.decode(), document.fonts.load('600 10px "IBM Plex Mono"')]).then(() => {
    scan.classList.add("scanned");
    const paint = () => drawCapture(scan, image, canvas, bounds);
    paint();
    new ResizeObserver(paint).observe(scan);
  }).catch(() => scan.classList.remove("scanned"));
}

function drawCapture(frame, image, canvas, bounds) {
  const { clientWidth: width, clientHeight: height } = frame;
  if (!width || !height) return;
  const mobile = matchMedia("(max-width: 760px)").matches;
  const x = Math.max(0, bounds.x - 24);
  const y = Math.max(0, bounds.y - 77);
  const right = Math.min(bounds.width, bounds.right + 24);
  const bottom = Math.min(bounds.height, bounds.bottom + 22);
  const scale = mobile
    ? Math.min((width - 24) / (right - x), (height - 24) / (bottom - y))
    : Math.min(width / bounds.width, height / bounds.height);
  const imageWidth = bounds.width * scale;
  const imageHeight = bounds.height * scale;
  const targetX = x * scale;
  const targetY = y * scale;
  const targetRight = right * scale;
  const targetBottom = bottom * scale;
  const left = mobile
    ? Math.min(0, Math.max(width - imageWidth, (width - targetX - targetRight) / 2))
    : (width - imageWidth) / 2;
  const focusTop = Math.min(height - 12 - targetBottom, Math.max(12 - targetY, height * .76 - (targetY + targetBottom) / 2));
  const top = mobile && imageHeight > height
    ? Math.min(0, Math.max(height - imageHeight, focusTop))
    : (height - imageHeight) / 2;

  const geometry = {
    "image-width": imageWidth, "image-height": imageHeight, "image-left": left, "image-top": top,
    "clip-left": targetX, "clip-right": imageWidth - targetRight,
    "clip-top": targetY, "clip-bottom": imageHeight - targetBottom,
    "clip-center": (targetY + targetBottom) / 2,
    "box-left": Math.max(0, left + targetX), "box-right": Math.max(0, width - left - targetRight),
    "box-top": Math.max(0, top + targetY), "box-bottom": Math.max(0, height - top - targetBottom),
    "scan-y": top + (targetY + targetBottom) / 2,
  };
  for (const [name, value] of Object.entries(geometry)) frame.style.setProperty("--" + name, value + "px");

  const context = fitCanvas(canvas, width, height);
  drawCaptureGlyphs(context, image, width, height, { left, top, imageWidth, imageHeight });
  // Retain the site's actual masthead when the mobile crop starts below it.
  if (mobile && top < -imageHeight * .16) {
    const mastheadHeight = Math.ceil(width * bounds.height * .19 / bounds.width);
    context.clearRect(0, 0, width, mastheadHeight);
    drawCaptureGlyphs(context, image, width, mastheadHeight, {
      left: 0, top: 0, imageWidth: width, imageHeight: width * bounds.height / bounds.width,
    });
    context.globalAlpha = .45;
    context.fillRect(0, mastheadHeight, width, 1);
  }
}

function drawCaptureGlyphs(context, image, width, height, { left, top, imageWidth, imageHeight }) {
  const cellWidth = 3;
  const cellHeight = 4.25;
  const columns = Math.ceil(width / cellWidth);
  const rows = Math.ceil(height / cellHeight);
  const samples = 3;
  const sample = document.createElement("canvas");
  sample.width = columns * samples;
  sample.height = rows * samples;
  const sampleContext = sample.getContext("2d");
  sampleContext.fillStyle = "#fff";
  sampleContext.fillRect(0, 0, sample.width, sample.height);
  sampleContext.drawImage(image, left * samples / cellWidth, top * samples / cellHeight,
    imageWidth * samples / cellWidth, imageHeight * samples / cellHeight);
  const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
  context.fillStyle = "#cf9cff";
  context.font = '600 4.8px "IBM Plex Mono", monospace';
  context.textBaseline = "top";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      let sum = 0;
      let darkest = 0;
      let lightest = 1;
      for (let dy = 0; dy < samples; dy++) {
        for (let dx = 0; dx < samples; dx++) {
          const index = ((y * samples + dy) * sample.width + x * samples + dx) * 4;
          const ink = 1 - (.25 * pixels[index] + .6 * pixels[index + 1] + .15 * pixels[index + 2]) / 255;
          sum += ink;
          darkest = Math.max(darkest, ink);
          lightest = Math.min(lightest, ink);
        }
      }
      const mean = sum / (samples * samples);
      const edge = darkest - lightest;
      if (darkest < .055 && edge < .021) continue;
      const tone = Math.min(1, Math.max(mean * .68, Math.pow(edge, .66) * 1.55, darkest * .75));
      const char = glyphs[Math.max(1, Math.round(tone * (glyphs.length - 1)))];
      context.globalAlpha = .34 + tone * .64;
      context.fillText(char, x * cellWidth, y * cellHeight);
    }
  }
}

if (live) {
  const stepsList = live.querySelector("[data-steps]");
  const announcement = live.querySelector("[data-step-announcement]");
  const recheck = live.dataset.poll === "recheck";
  const activeStep = live.querySelector("[data-active-step]");
  const activeAction = live.querySelector("[data-active-action]");
  const activeRemark = live.querySelector("[data-active-remark]");
  let previousSteps = stepsList.dataset.snapshot;
  async function poll() {
    if (!document.hidden) {
      try {
        const response = await fetch("/api/cases/" + live.dataset.liveCase + "/progress");
        if (response.ok) {
          const progress = await response.json();
          if (recheck ? progress.recheck?.status !== "running" : progress.stage !== live.dataset.stage) {
            if (!recheck && progress.stage === "ready" && !location.search) {
              location.replace(location.pathname + "?view=reading");
            } else {
              location.reload();
            }
            return;
          }
          const allSteps = (recheck ? progress.recheck.steps : progress.steps).filter(Boolean);
          const steps = allSteps.slice(-3);
          if (activeStep && allSteps.length) {
            const [verb, ...detail] = allSteps.at(-1).split(": ");
            activeStep.textContent = "STEP " + String(allSteps.length).padStart(2, "0");
            activeAction.textContent = "> " + (detail.length ? verb.toUpperCase() : "READ");
            activeRemark.textContent = detail.length ? detail.join(": ") : verb;
          }
          const snapshot = JSON.stringify(steps);
          if (snapshot !== previousSteps) {
            stepsList.replaceChildren(...steps.map((step) => {
              const item = document.createElement("li");
              const match = /^([a-z]+):\s*(.*)$/i.exec(step);
              if (match) {
                const verb = document.createElement("span");
                verb.textContent = match[1];
                item.append(verb, " " + match[2]);
              } else {
                item.textContent = step;
              }
              return item;
            }));
            if (steps.length) announcement.textContent = steps.at(-1);
            previousSteps = snapshot;
          }
        }
      } catch {
        // Keep the latest real steps visible across temporary network interruptions.
      }
    }
    setTimeout(poll, 2400);
  }
  setTimeout(poll, 2400);
}

document.querySelector(".paste-link")?.addEventListener("click", (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  document.querySelector("#paste").scrollIntoView();
  document.querySelector("#message").focus({ preventScroll: true });
});
