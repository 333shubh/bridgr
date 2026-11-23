/* Bridgr "cut-outs": die-cut miniatures of Bridgr's own screens, used as card artwork.
   They show example data on purpose, to demonstrate what each tool does. Plain HTML/CSS so
   they stay crisp and themeable. Each one carries a small looping demo (skills filling, a
   cursor clicking Apply, a card moving across the board…) that only runs while its card is
   on screen (the .play class, see app.js) and never with reduced motion. */
(function () {
  const sk = (s, l, k) => `<div class="cu-sk" style="--k:${k}"><span>${s}</span><div class="cu-bar"><i style="width:${l * 20}%"></i></div></div>`;
  const wk = (t, cls, k) => `<div class="cu-wk"><span class="bx ${cls}" style="--k:${k}"></span>${t}</div>`;
  const ln = (o, ...w) => w.map((x, i) => `<div class="cu-line" style="width:${x}%;--k:${o + i}"></div>`).join("");
  const hl = (t, k) => `<span class="cu-hl" style="--k:${k}">${t}</span>`;
  const mark = (cls, sym, t, k) => `<div class="cu-wk"><span class="${cls}" style="--k:${k}">${sym}</span>${t}</div>`;
  const ring = (v, small) => `<div class="cu-ring${small ? " s" : ""}" style="--v:${v}"><b>${v}</b></div>`;
  const radar = `<svg viewBox="0 0 100 100" class="cu-radar" aria-hidden="true">
      <polygon points="50,8 90,36 76,86 24,86 10,36" fill="none" stroke="#e3e3e8" stroke-width="1.5"/>
      <polygon points="50,28 70,42 63,66 37,66 30,42" fill="none" stroke="#e3e3e8" stroke-width="1.5"/>
      <polygon class="cu-poly" points="50,14 84,38 70,78 30,80 16,38" fill="rgba(0,224,255,.25)" stroke="#00c2e0" stroke-width="2"/>
      <polygon class="cu-poly b" points="50,24 76,40 58,70 36,74 22,40" fill="rgba(0,113,227,.25)" stroke="#0071e3" stroke-width="2"/></svg>`;

  window.CUTOUTS = {
    profile: () => `
      <div class="cu" style="left:9%;top:8%;width:64%;--r:-5deg"><span class="cu-scan"></span>
        <div class="cu-h"><i class="av">AV</i><div><b>Ananya V.</b><small>B.Tech CSE · 3rd year</small></div></div>
        ${sk("Python", 4, 0)}${sk("SQL", 3, 1)}${sk("Pandas", 3, 2)}${sk("Excel", 2, 3)}</div>
      <div class="cu sm cu-pop" style="right:7%;bottom:21%;--r:6deg"><span class="cu-chip ok">✓ 13 skills with evidence</span></div>`,
    jd: () => `
      <div class="cu" style="left:7%;top:6%;width:70%;--r:-4deg"><small>Job post · FinEdge Analytics</small><b>Data Analyst Intern</b>
        <p class="cu-p">Strong ${hl("SQL", 0)} and ${hl("Excel", 1)}. Comfortable with ${hl("Python", 2)}; ${hl("Power BI", 3)} is a plus.</p>${ln(0, 86, 62)}</div>
      <div class="cu sm cu-pop" style="right:6%;bottom:9%;width:58%;--r:5deg"><small>Requirements · weighted</small>
        ${[["SQL", 5, 1], ["Excel", 4, 1], ["Python", 4, 1], ["Power BI", 2, 0]].map(([s, w, m]) => `<div class="cu-req"><span>${s}</span><span class="cu-w">${"●".repeat(w)}<em>${"●".repeat(5 - w)}</em></span><span class="cu-chip ${m ? "cy" : ""}">${m ? "must" : "nice"}</span></div>`).join("")}</div>`,
    gap: () => `
      <div class="cu" style="left:8%;top:9%;width:46%;--r:-6deg;text-align:center">${ring(72)}<small>% match · Data Analyst</small></div>
      <div class="cu" style="right:7%;top:22%;width:44%;--r:7deg;--hx:6px">${radar}</div>
      <div class="cu sm cu-pop" style="left:12%;bottom:10%;--r:-3deg"><span class="cu-chip bad">Missing · Statistics</span> <span class="cu-chip mid">Partial · SQL</span></div>`,
    roadmap: () => `
      <div class="cu" style="left:10%;top:7%;width:70%;--r:-4deg"><b>6-week plan · 8 h/week</b><div class="cu-prog"><i style="width:50%"></i></div>
        ${wk("Week 1 · SQL joins", "on", 0)}${wk("Week 2 · Statistics basics", "on", 1)}${wk("Week 3 · Power BI dashboard", "t", 2)}${wk("Week 4 · Capstone project", "", 3)}</div>
      <div class="cu sm cu-pop late" style="right:8%;bottom:21%;--r:7deg"><span class="cu-chip cy">🏁 Week 3 done · 75%</span></div>`,
    internships: () => `
      <div class="cu" style="left:16%;top:6%;width:62%;--r:6deg;opacity:.92"><small>PixelCraft Studios</small><b>Frontend Intern</b>${ln(0, 80, 60)}</div>
      <div class="cu" style="left:8%;top:22%;width:66%;--r:-4deg"><small>FinEdge Analytics · Hybrid</small><b>Data Analyst Intern</b>
        <div style="margin:6px 0"><span class="cu-chip">SQL</span> <span class="cu-chip">Python</span> <span class="cu-chip">Excel</span></div>
        <div class="cu-row"><small>₹25,000 / month</small><span class="cu-btn sw"><span>Apply</span><span>Applied ✓</span></span></div><i class="cu-cursor"></i></div>
      <div class="cu sm" style="right:8%;bottom:21%;--r:8deg;--hy:-12px"><span class="cu-big">92%</span><small>fit for you</small></div>`,
    ats: () => `
      <div class="cu" style="left:10%;top:6%;width:60%;--r:-5deg"><b>resume.pdf</b>${ln(0, 90)}
        <p class="cu-p">Built a ${hl("SQL", 0)} dashboard in ${hl("Power BI", 1)}, cut report time by ${hl("40%", 2)}.</p>${ln(1, 70, 85, 50)}</div>
      <div class="cu sm" style="right:9%;top:30%;--r:8deg;text-align:center;--hy:-10px">${ring(81, 1)}<small>ATS score</small></div>`,
    interview: () => `
      <div class="cu" style="left:8%;top:9%;width:72%;--r:-4deg"><small>Q2 · Technical · SQL</small><b>What's the difference between WHERE and HAVING?</b>
        <div class="cu-row" style="margin-top:8px"><div class="cu-wave">${Array.from({ length: 16 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}</div><span class="cu-chip rec">Listening…</span></div></div>
      <div class="cu sm cu-pop late" style="right:8%;bottom:21%;--r:7deg"><span class="cu-big">8<small style="display:inline;font-size:14px">/10</small></span><small>Accuracy 4 · Depth 2 · Clarity 2</small></div>`,
    mentor: () => `
      <div class="cu" style="left:9%;top:8%;width:74%;--r:-3deg">
        <div class="cu-msg me q">Which internship should I target first?</div>
        <div class="cu-stack"><div class="cu-msg ai dots"><span class="cu-dots"><i></i><i></i><i></i></span></div>
          <div class="cu-msg ai a">Data Analyst roles. You already match 72%. Close Statistics first; it unlocks 4 more listings.</div></div></div>
      <div class="cu sm cu-pop late" style="left:12%;bottom:12%;--r:-4deg"><span class="cu-chip cy">Open my roadmap →</span></div>`,
    resume: () => `
      <div class="cu doc" style="left:14%;top:5%;width:56%;--r:-5deg"><b style="font-size:15px">Ananya Verma</b><small>ananya@college.edu · github.com/ananya</small>
        <div class="cu-sec">Skills</div>${ln(0, 92, 74)}<div class="cu-sec">Projects</div>${ln(2, 88, 66, 80)}<div class="cu-sec">Education</div>${ln(5, 70)}</div>
      <div class="cu sm cu-pop late" style="right:8%;bottom:21%;--r:8deg"><span class="cu-btn">Save as PDF</span></div>`,
    curriculum: () => `
      <div class="cu" style="left:8%;top:8%;width:62%;--r:-4deg"><b>CS301 · DBMS</b>
        ${mark("ok", "✓", "Normalisation &amp; SQL", 0)}${mark("ok", "✓", "Transactions", 1)}${mark("no", "✕", "Hierarchical model", 2)}${mark("add", "+", "Window functions", 3)}${mark("add", "+", "NoSQL lab", 4)}</div>
      <div class="cu sm" style="right:8%;top:26%;--r:8deg;text-align:center;--hy:-10px">${ring(64, 1)}<small>alignment</small></div>`,
    insights: () => `
      <div class="cu" style="left:8%;top:8%;width:76%;--r:-3deg"><b>Industry vs curriculum</b><small>demand index, 0–100</small>
        <div class="cu-bars">${[[88, 40], [82, 55], [76, 30], [70, 62], [64, 22], [58, 35]].map(([a, b], k) => `<i style="--h:${a}%;--k:${k}"></i><i style="--h:${b}%;--k:${k + 0.5}"></i>`).join("")}</div></div>
      <div class="cu sm cu-pop" style="right:8%;bottom:21%;--r:7deg"><span class="cu-chip bad">Biggest gap · Cloud</span></div>`,
    recruiter: () => `
      <div class="cu" style="left:8%;top:7%;width:60%;--r:-5deg"><b>Post an internship</b>
        <div class="cu-field"><span class="cu-type">Data Engineer Intern</span></div><div class="cu-field">Python, SQL, Airflow</div><span class="cu-btn press">Publish</span></div>
      <div class="cu" style="right:7%;top:38%;width:44%;--r:7deg;--hx:6px"><small>Top candidates</small>
        ${[["AV", "92%"], ["RK", "85%"], ["SM", "78%"]].map(([i, f], k) => `<div class="cu-row cand" style="margin-top:5px;--k:${k}"><i class="av sm">${i}</i><b>${f}</b></div>`).join("")}</div>`,
    tracker: () => `
      <div class="cu" style="left:7%;top:10%;width:82%;--r:-3deg"><div class="cu-kb">
        <div><small>Applied</small><span class="ghost"></span><span></span><span></span></div>
        <div><small>Interview</small><span></span><span class="hot"></span></div>
        <div><small>Offer</small></div><i class="cu-mover"></i></div></div>
      <div class="cu sm cu-pop late" style="right:10%;bottom:21%;--r:8deg"><span class="cu-chip ok">🎉 Offer · FinEdge</span></div>`
  };
})();
