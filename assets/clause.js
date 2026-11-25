const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const field = document.querySelector("[data-paper-field]");
const rainGlyphs = "|:.,*+";
const glyphs = " .:;=+*#%@";

function fitCanvas(canvas, width, height) {
  const scale = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext("2d");
  context.scale(scale, scale);
  return context;
}

function drawField(tick = 0) {
  const { clientWidth: width, clientHeight: height } = field;
  if (!width || !height) return;
  const context = fitCanvas(field, width, height);
  context.font = '10px "IBM Plex Mono", monospace';
  const columns = Math.ceil(width / 34);
  for (let column = 0; column < columns; column++) {
    const random = (column * 127 + 81) % 197 / 197;
    const head = ((column * 233 + tick * (2 + column % 3)) % height + height) % height;
    for (let index = 0; index < 2 + column % 5; index++) {
      context.fillStyle = column % 7 === 3 ? "#ffaa70" : "#cf9cff";
      context.globalAlpha = (.12 + random * .35) * (1 - index / 7);
      const char = rainGlyphs[(column + index + Math.floor(tick / 3)) % rainGlyphs.length];
      context.fillText(char, column * 34 + 6 + random * 19, head - index * 7);
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
  const drawWidth = drawHeight * cellHeight * sourceRatio / cellWidth;
  pixels.translate(mobile ? columns : 0, 0);
  pixels.scale(mobile ? -1 : 1, 1);
  pixels.drawImage(source, (columns - drawWidth) / 2, (rows - drawHeight) / 2, drawWidth, drawHeight);
  const rgba = pixels.getImageData(0, 0, columns, rows).data;
  context.font = `600 ${cellHeight * 1.26}px "IBM Plex Mono", monospace`;
  context.textBaseline = "top";
  for (let index = 0; index < columns * rows; index++) {
    const [red, green, blue, alpha] = rgba.subarray(index * 4, index * 4 + 4);
    if (alpha < 34) continue;
    const light = (.25 * red + .6 * green + .15 * blue) / 255 * alpha / 255;
    const value = Math.max(1, Math.min(glyphs.length - 1, Math.round(light * (glyphs.length - 1))));
    context.fillStyle = red > blue + 9 ? "#fff1d6" : "#cf9cff";
    context.globalAlpha = .32 + light * .68;
    context.fillText(glyphs[value], (index % columns) * cellWidth, Math.floor(index / columns) * cellHeight);
  }
}

drawField();
new ResizeObserver(() => drawField()).observe(field);

const receipt = document.querySelector("[data-receipt]");
if (receipt) {
  const source = new Image();
  source.src = receipt.dataset.receipt;
  Promise.all([source.decode(), document.fonts.load('600 12px "IBM Plex Mono"')]).then(() => {
    new ResizeObserver(() => drawReceipt(receipt, source)).observe(receipt);
  }).catch(() => {});
}
