/* Bridgr sticker kit — hand-built SVG stickers with halftone print, die-cut paper edge
   and torn-paper notes. No external images. Usage: Sticker("cap"), TextSticker("hired!"), Paper("note"). */
(function () {
  const C = { cyan: "#00e0ff", pink: "#ff3df2", green: "#19f59b", yellow: "#ffe600", orange: "#ff5a1f", blue: "#4d7cff", purple: "#a066ff", red: "#ff3b5c", lime: "#c6ff1a" };

  const starPath = (cx, cy, R, r, n, rot = -90) => {
    let d = "";
    for (let i = 0; i < n * 2; i++) {
      const a = ((rot + (180 / n) * i) * Math.PI) / 180, rr = i % 2 ? r : R;
      d += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1);
    }
    return d + "Z";
  };

  // geo = silhouette (gets colour, halftone and the white die-cut); det = line-art on top
  const S = {
    cap: { c: "green", geo: `<path d="M6 48 60 22l54 26-54 26z"/><path d="M30 60v24c16 13 44 13 60 0V60L60 74z"/>`, det: `<path d="M102 54v28"/><circle cx="102" cy="88" r="6" fill="#111"/>` },
    brief: { c: "orange", geo: `<rect x="12" y="38" width="96" height="66" rx="12"/><path d="M42 40V28q0-9 9-9h18q9 0 9 9v12h-9V30q0-2-2-2H53q-2 0-2 2v10z"/>`, det: `<path d="M12 66h96"/><rect x="51" y="59" width="18" height="14" rx="3" fill="#111"/>` },
    burst: { c: "pink", geo: `<path d="${starPath(60, 60, 56, 34, 12)}"/>`, det: `` },
    star: { c: "yellow", geo: `<path d="${starPath(60, 62, 56, 24, 5)}"/>`, det: `<circle cx="50" cy="58" r="4" fill="#111"/><circle cx="70" cy="58" r="4" fill="#111"/><path d="M50 72q10 8 20 0"/>` },
    sparkle: { c: "cyan", geo: `<path d="M60 4c6 34 22 50 56 56-34 6-50 22-56 56-6-34-22-50-56-56 34-6 50-22 56-56z"/>`, det: `` },
    bolt: { c: "yellow", geo: `<path d="M70 4 20 68h32l-12 48 58-70H64z"/>`, det: `` },
    heart: { c: "pink", geo: `<path d="M60 106 16 62C2 48 6 20 30 16c14-2 24 6 30 16 6-10 16-18 30-16 24 4 28 32 14 46z"/>`, det: `<path d="M30 40q4-10 14-10"/>` },
    eyes: { c: "yellow", geo: `<ellipse cx="36" cy="60" rx="26" ry="38"/><ellipse cx="86" cy="60" rx="26" ry="38"/>`, det: `<circle cx="42" cy="68" r="12" fill="#111"/><circle cx="92" cy="68" r="12" fill="#111"/><circle cx="46" cy="63" r="3.5" fill="#fff" stroke="none"/><circle cx="96" cy="63" r="3.5" fill="#fff" stroke="none"/>` },
    bulb: { c: "yellow", geo: `<path d="M60 8C35 8 20 26 20 47c0 14 8 24 16 32v12h48V79c8-8 16-18 16-32C100 26 85 8 60 8z"/><rect x="38" y="94" width="44" height="18" rx="7"/>`, det: `<path d="M48 70l12-16 12 16M60 54v36"/><path d="M38 103h44"/>` },
    chat: { c: "blue", geo: `<path d="M16 18h88a10 10 0 0 1 10 10v50a10 10 0 0 1-10 10H54l-28 22 5-22H16A10 10 0 0 1 6 78V28a10 10 0 0 1 10-10z"/>`, det: `<circle cx="36" cy="53" r="7" fill="#111"/><circle cx="60" cy="53" r="7" fill="#111"/><circle cx="84" cy="53" r="7" fill="#111"/>` },
    target: { c: "red", geo: `<circle cx="54" cy="66" r="48"/>`, det: `<circle cx="54" cy="66" r="31" fill="#fff"/><circle cx="54" cy="66" r="15" fill="#111"/><path d="M54 66 108 12"/><path d="M92 10l16 2 2 16"/>` },
    chart: { c: "lime", geo: `<rect x="8" y="10" width="104" height="100" rx="20"/>`, det: `<rect x="26" y="62" width="16" height="32" rx="4" fill="#111"/><rect x="52" y="44" width="16" height="50" rx="4" fill="#111"/><rect x="78" y="26" width="16" height="68" rx="4" fill="#111"/>` },
    rocket: { c: "purple", geo: `<path d="M60 4c24 16 32 42 22 72H38C28 46 36 20 60 4z"/><path d="M38 56 16 86l26-4z"/><path d="M82 56l22 30-26-4z"/><path d="M46 82h28l-14 34z"/>`, det: `<circle cx="60" cy="42" r="11" fill="#fff"/>` },
    mic: { c: "pink", geo: `<rect x="38" y="6" width="44" height="68" rx="22"/><path d="M55 86h10v16h20v12H35v-12h20z"/>`, det: `<path d="M22 54c0 24 16 36 38 36s38-12 38-36"/><path d="M50 26h20M50 40h20"/>` },
    doc: { c: "cyan", geo: `<path d="M22 6h54l26 26v82H22z"/>`, det: `<path d="M76 6v26h26"/><path d="M36 52h50M36 67h50M36 82h32"/>` },
    trophy: { c: "yellow", geo: `<path d="M30 10h60v32c0 22-12 36-30 36S30 64 30 42z"/><rect x="50" y="76" width="20" height="16"/><rect x="32" y="92" width="56" height="20" rx="5"/>`, det: `<path d="M30 22H12c0 20 8 28 20 30M90 22h18c0 20-8 28-20 30"/><path d="M52 34l8-8v28"/>` },
    school: { c: "orange", geo: `<path d="M8 46 60 12l52 34z"/><rect x="16" y="46" width="88" height="56"/><rect x="4" y="100" width="112" height="14" rx="4"/>`, det: `<path d="M33 58v34M51 58v34M69 58v34M87 58v34"/><circle cx="60" cy="33" r="6" fill="#111"/>` },
    pencil: { c: "yellow", geo: `<path d="M88 8l24 24-68 68-32 8 8-32z"/>`, det: `<path d="M76 20l24 24M20 76l24 24"/><path d="M12 108l8-30 22 22z" fill="#111"/>` },
    search: { c: "green", geo: `<circle cx="48" cy="48" r="38"/><path d="M72 80l10-10 32 32-10 10z"/>`, det: `<circle cx="48" cy="48" r="23" fill="#fff"/><path d="M36 40q6-10 16-8"/>` },
    coins: { c: "yellow", geo: `<path d="M18 32v58c0 9 19 16 42 16s42-7 42-16V32z"/><ellipse cx="60" cy="32" rx="42" ry="16"/>`, det: `<ellipse cx="60" cy="32" rx="42" ry="16"/><path d="M18 52c0 9 19 16 42 16s42-7 42-16M18 72c0 9 19 16 42 16s42-7 42-16"/>` },
    smile: { c: "orange", geo: `<circle cx="60" cy="60" r="52"/>`, det: `<circle cx="42" cy="48" r="8" fill="#111"/><circle cx="78" cy="48" r="8" fill="#111"/><path d="M34 70c10 20 42 20 52 0"/>` },
    pin: { c: "red", geo: `<path d="M60 114C36 82 18 64 18 44a42 42 0 0 1 84 0c0 20-18 38-42 70z"/>`, det: `<circle cx="60" cy="44" r="15" fill="#fff"/>` },
    map: { c: "green", geo: `<path d="M6 24l36-14 36 14 36-14v86l-36 14-36-14-36 14z"/>`, det: `<path d="M42 10v86M78 24v86"/><path d="M20 76c12-22 30 6 42-14s26-8 36-26" stroke-dasharray="7 7"/>` },
    board: { c: "purple", geo: `<rect x="6" y="12" width="108" height="96" rx="16"/>`, det: `<rect x="18" y="26" width="24" height="32" rx="5" fill="#fff"/><rect x="48" y="26" width="24" height="54" rx="5" fill="#fff"/><rect x="78" y="26" width="24" height="22" rx="5" fill="#fff"/>` },
    laptop: { c: "blue", geo: `<rect x="20" y="16" width="80" height="58" rx="8"/><path d="M4 84h112l-8 18H12z"/>`, det: `<rect x="30" y="26" width="60" height="38" rx="3" fill="#fff"/><path d="M40 40l8 6-8 6M56 54h14"/>` }
  };

  let uid = 0;
  window.STICKER_NAMES = Object.keys(S);
  window.STICKER_COLORS = C;

  // m = halftone mask direction (1-4)
  window.Sticker = function (name, o = {}) {
    const s = S[name] || S.star, col = C[o.c] || o.c || C[s.c], m = o.m || 1 + (uid++ % 4);
    return `<svg class="stk-svg" viewBox="-12 -12 144 144" aria-hidden="true" focusable="false">
      <g class="cut" filter="url(#bh-rough)">${s.geo}${s.det}</g>
      <g fill="${col}" stroke="#111" stroke-width="3.5" stroke-linejoin="round">${s.geo}</g>
      <g fill="url(#bh-dots)" mask="url(#bh-m${m})">${s.geo}</g>
      <g fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${s.det}</g></svg>`;
  };

  window.TextSticker = function (txt, c = "cyan", o = {}) {
    const w = Math.round(txt.length * 15 + 34), h = 50, col = C[c] || c, m = o.m || 2;
    const geo = `<rect x="0" y="0" width="${w}" height="${h}" rx="16"/>`;
    return `<svg class="stk-svg" viewBox="-12 -12 ${w + 24} ${h + 24}" aria-hidden="true" focusable="false">
      <g class="cut" filter="url(#bh-rough)">${geo}</g>
      <g fill="${col}" stroke="#111" stroke-width="3.5">${geo}</g>
      <g fill="url(#bh-dots)" mask="url(#bh-mt${m})">${geo}</g>
      <text x="${w / 2}" y="34" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="27" font-weight="800" fill="#111" letter-spacing="-0.5">${txt}</text></svg>`;
  };

  // deterministic jagged edge so a note keeps the same tear every render
  function rng(seed) { let x = seed || 7; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }
  function hash(s) { let h = 9; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) % 2147483647; return h || 7; }
  window.tornClip = function (seed, edges = "tb") {
    const r = rng(hash(seed)), pts = [];
    const jag = (a, b) => a + r() * (b - a);
    if (edges.includes("t")) for (let x = 0; x <= 100; x += 3 + r() * 3) pts.push(`${Math.min(x, 100).toFixed(1)}% ${jag(0, 5).toFixed(1)}%`);
    else pts.push("0% 0%", "100% 0%");
    pts.push(`100% ${jag(2, 6).toFixed(1)}%`, `${jag(99, 100).toFixed(1)}% 50%`);
    if (edges.includes("b")) for (let x = 100; x >= 0; x -= 3 + r() * 3) pts.push(`${Math.max(x, 0).toFixed(1)}% ${jag(94, 100).toFixed(1)}%`);
    else pts.push("100% 100%", "0% 100%");
    pts.push(`0% ${jag(94, 100).toFixed(1)}%`, `${jag(0, 1).toFixed(1)}% 50%`);
    return `polygon(${pts.join(",")})`;
  };

  // Paper("Note text", {lined, rot, cls, tape})
  window.Paper = function (html, o = {}) {
    const rot = o.rot ?? -3;
    return `<div class="paper ${o.lined ? "lined" : ""} ${o.kraft ? "kraft" : ""} ${o.cls || ""}" style="--rot:${rot}deg">
      <div class="paper-in" style="clip-path:${tornClip(o.seed || html, o.edges || "tb")}">${html}</div>${o.tape === false ? "" : '<i class="tape"></i>'}</div>`;
  };
})();
