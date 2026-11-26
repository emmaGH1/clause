// 16x16 pixel icons on a faint grid, with a row-by-row glitch between them.
export const PAL = { k: "#0D0D0C", w: "#FFFFFF", b: "#2433FF", l: "#C9CEFF", r: "#F0442B", y: "#FFC21A", e: "#22C55E", g: "#B8B8B1" };

export const ICONS = {
  eye: ["................", "................", "................", "......kkkk......", "....kkwwwwkk....", "...kwwwbbwwwk...", "..kwwwbbbbwwwk..", ".kwwwbbwkbbwwwk.", ".kwwwbbkkbbwwwk.", "..kwwwbbbbwwwk..", "...kwwwbbwwwk...", "....kkwwwwkk....", "......kkkk......", "................", "................", "................"],
  pitch: ["................", "..kkkkkkkkkkkk..", ".krrrrrrrrrrrrk.", ".krrrrrwrrrrrrk.", ".krrrrwwwwrrrrk.", ".krrrwrwrrrrrrk.", ".krrrrwwwrrrrrk.", ".krrrrrrwrwrrrk.", ".krrrwwwwrrrrrk.", ".krrrrrwrrrrrrk.", ".krrrrrrrrrrrrk.", "..krrkkkkkkkkk..", "..krk...........", "..kk............", "................", "................"],
  kane: ["................", "...kkkkkkkkkk...", "..kwwwwwwwwwwk..", "..kwkkkkkkkkwk..", "..kwkbbbbbbkwk..", "..kwkbwbbbbkwk..", "..kwkbbwbbbkwk..", "..kwkbwbwwbkwk..", "..kwkbbbbbbkwk..", "..kwkkkkkkkkwk..", "..kwwwwwwwwwwk..", "...kkkkkkkkkk...", ".....kwwwwk.....", "....kbbkkbbk....", "....kbbk.kbbk...", "....kkk...kkk..."],
  camera: ["................", "................", ".....kkkkk......", "....kwwwwwk.....", ".kkkkkkkkkkkkkk.", ".kbbbbbbbbbbbbk.", ".kbbbbkkkkbbbbk.", ".kbbbkwwwwkbbbk.", ".kbbkwwkkwwkbbk.", ".kbbkwkllkwkbbk.", ".kbbkwwkkwwkbbk.", ".kbbbkwwwwkbbbk.", ".kbbbbkkkkbbbbk.", ".kkkkkkkkkkkkkk.", "................", "................"],
  lens: ["................", "....kkkkkk......", "..kkllllllkk....", ".kllllllllllk...", ".klbbbbbbbllk...", ".kllllllllllk...", ".klbbbbbllllk...", ".kllllllllllk...", ".klbbbbbbbllk...", "..kkllllllkk....", "....kkkkkkkk....", "..........kkk...", "...........kkk..", "............kkk.", ".............kk.", "................"],
  term: ["................", "kkkkkkkkkkkkkkkk", "krkykekkkkkkkkkk", "kkkkkkkkkkkkkkkk", "kwwwwwwwwwwwwwwk", "kwbwwwwwwwwwwwwk", "kwwbwwwwwwwwwwwk", "kwwwbwwwwwwwwwwk", "kwwbwwwwwwwwwwwk", "kwbwwwbbbbbwwwwk", "kwwwwwwwwwwwwwwk", "kwwgggggggwwwwwk", "kwwwwwwwwwwwwwwk", "kkkkkkkkkkkkkkkk", "................", "................"],
  shot: ["................", "kkkk........kkkk", "k..............k", "k..............k", "................", "..gggggggggg....", "................", "..bbbbbbbbbbbb..", "..bbbbbbbbb.....", "................", "..gggggggg......", "................", "k..............k", "k..............k", "kkkk........kkkk", "................"],
  lock: [".....kkkkk......", "....kk...kk.....", "...kk.....kk....", "...kk.....kk....", "...kk...........", "...kk...........", ".kkkkkkkkkkkkk..", ".kbbbbbbbbbbbk..", ".kbbbbbkbbbbbk..", ".kbbbbkkkbbbbk..", ".kbbbbbkbbbbbk..", ".kbbbbbkbbbbbk..", ".kbbbbbbbbbbbk..", ".kkkkkkkkkkkkk..", "................", "................"],
  locked: [".....kkkkk......", "....kk...kk.....", "...kk.....kk....", "...kk.....kk....", "...kk.....kk....", "...kk.....kk....", ".kkkkkkkkkkkkk..", ".kggggggggggggk.", ".kgggggkgggggk..", ".kggggkkkggggk..", ".kgggggkgggggk..", ".kgggggkgggggk..", ".kgggggggggggk..", ".kkkkkkkkkkkkk..", "................", "................"],
  doc: ["..kkkkkkkkk.....", "..kwwwwwwwkk....", "..kwwwwwwwkwk...", "..kwgggggwkkkk..", "..kwwwwwwwwwwk..", "..kwrrrrrrrrwk..", "..kwwwwwwwwwwk..", "..kwbbbbbbbbwk..", "..kwbbbbbbwwwk..", "..kwwwwwwwwwwk..", "..kwgggggggwwk..", "..kwwwwwwwwwwk..", "..kwgggggwwwwk..", "..kwwwwwwwwwwk..", "..kkkkkkkkkkkk..", "................"],
  coins: ["................", "................", "........kkkkk...", ".......kyyyyyk..", ".......kkkkkkk..", ".......kyyyyyk..", "..kkkkkkkkkkkk..", ".kyyyyyk.kyyyyk.", ".kkkkkkk.kkkkkk.", ".kyyyyyk.kyyyyk.", ".kkkkkkk.kkkkkk.", ".kyyyyyk.kyyyyk.", ".kkkkkkk.kkkkkk.", "................", "................", "................"],
  card: ["................", "................", "................", ".kkkkkkkkkkkkkk.", ".kbbbbbbbbbbbbk.", ".kwwwwwwwwwwwwk.", ".kbbbbbbbbbbbbk.", ".kbbbbbbbbbbbbk.", ".kbbyybbbbbbbbk.", ".kbbyybbbbbbbbk.", ".kbbbbbbbbbbbbk.", ".kkkkkkkkkkkkkk.", "................", "................", "................", "................"],
  chart: ["................", "................", "...........rrr..", "............rr..", "...........r.r..", "..........r.....", "......r..r......", ".....r.rr.......", "....r...........", "...........kbbk.", ".......kbbkkbbk.", "...kbbkkbbkkbbk.", "...kbbkkbbkkbbk.", ".kkkkkkkkkkkkkkk", "................", "................"],
};

export function iconCanvas(canvas, { grid = 22, line = "#E6E6E0" } = {}) {
  const ctx = canvas.getContext("2d");
  const state = { from: null, to: null, t: 1, cell: 10, grid, jit: Array.from({ length: 16 }, () => Math.random()) };
  function size() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const box = canvas.getBoundingClientRect();
    state.cell = Math.max(2, Math.floor(Math.min(box.width, box.height || box.width) / grid));
    const s = state.cell * grid;
    canvas.width = s * dpr; canvas.height = s * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function draw() {
    const { cell } = state, s = cell * grid, o = (grid - 16) / 2 * cell;
    ctx.clearRect(0, 0, s, s);
    if (line) {
      ctx.strokeStyle = line; ctx.lineWidth = 1;
      for (let k = 0; k <= grid; k++) {
        ctx.beginPath(); ctx.moveTo(k * cell + .5, 0); ctx.lineTo(k * cell + .5, s); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, k * cell + .5); ctx.lineTo(s, k * cell + .5); ctx.stroke();
      }
    }
    const sr = state.t * 19 - 1.5;
    for (let j = 0; j < 16; j++) {
      const d = j - sr;
      let name = d < 0 ? state.to : (state.from ?? state.to), shift = 0;
      if (state.t < 1 && Math.abs(d) < 1.6) { shift = Math.round((state.jit[j] - .5) * 6); name = Math.random() < .5 ? state.from ?? state.to : state.to; }
      const row = ICONS[name]?.[j] ?? "";
      for (let i = 0; i < 16; i++) {
        const c = row[i];
        if (!c || c === ".") continue;
        ctx.fillStyle = PAL[c];
        ctx.fillRect(o + (i + shift) * cell, o + j * cell, cell + .5, cell + .5);
      }
    }
    if (state.t < 1 && sr >= 0) { ctx.fillStyle = "#0D0D0C"; ctx.fillRect(0, o + sr * cell, s, 1); }
  }
  size();
  addEventListener("resize", () => { size(); draw(); });
  return {
    set(name) { state.from = null; state.to = name; state.t = 1; draw(); },
    morph(name, ms = 520) {
      if (name === state.to) return;
      state.from = state.to; state.to = name; state.t = 0;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) { state.t = 1; draw(); return; }
      const start = performance.now();
      const step = (now) => { state.t = Math.min(1, (now - start) / ms); draw(); if (state.t < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    },
  };
}
