/* Bridgr "cut-outs": die-cut miniatures of Bridgr's own screens, used as card artwork
   instead of photos. Plain HTML/CSS so they stay crisp, themeable and animatable. */
(function () {
  const sk = (s, l) => `<div class="cu-sk"><span>${s}</span><div class="cu-bar"><i style="width:${l * 20}%"></i></div></div>`;
  const wk = (t, on) => `<div class="cu-wk"><span class="bx ${on ? "on" : ""}"></span>${t}</div>`;
  const lines = (...w) => w.map(x => `<div class="cu-line" style="width:${x}%"></div>`).join("");
  const radar = `<svg viewBox="0 0 100 100" class="cu-radar" aria-hidden="true">
      <polygon points="50,8 90,36 76,86 24,86 10,36" fill="none" stroke="#e3e3e8" stroke-width="1.5"/>
      <polygon points="50,28 70,42 63,66 37,66 30,42" fill="none" stroke="#e3e3e8" stroke-width="1.5"/>
      <polygon class="cu-poly" points="50,14 84,38 70,78 30,80 16,38" fill="rgba(0,224,255,.25)" stroke="#00c2e0" stroke-width="2"/>
      <polygon class="cu-poly" points="50,24 76,40 58,70 36,74 22,40" fill="rgba(0,113,227,.25)" stroke="#0071e3" stroke-width="2"/></svg>`;

  window.CUTOUTS = {
    profile: () => `
      <div class="cu" style="left:9%;top:8%;width:64%;--r:-5deg">
        <div class="cu-h"><i class="av">AV</i><div><b>Ananya V.</b><small>B.Tech CSE · 3rd year</small></div></div>
        ${sk("Python", 4)}${sk("SQL", 3)}${sk("Pandas", 3)}${sk("Excel", 2)}</div>
      <div class="cu sm" style="right:7%;bottom:21%;--r:6deg;--hy:-10px"><span class="cu-chip ok">✓ 13 skills with evidence</span></div>`,
    gap: () => `
      <div class="cu" style="left:8%;top:9%;width:46%;--r:-6deg;text-align:center"><div class="cu-ring" style="--v:72"><b>72</b></div><small>% match · Data Analyst</small></div>
      <div class="cu" style="right:7%;top:22%;width:44%;--r:7deg;--hx:6px">${radar}</div>
      <div class="cu sm" style="left:16%;bottom:10%;--r:-3deg"><span class="cu-chip bad">Missing · Statistics</span> <span class="cu-chip mid">Partial · SQL</span></div>`,
    roadmap: () => `
      <div class="cu" style="left:10%;top:7%;width:70%;--r:-4deg"><b>6-week plan · 8 h/week</b><div class="cu-prog"><i style="width:50%"></i></div>
        ${wk("Week 1 · SQL joins", 1)}${wk("Week 2 · Statistics basics", 1)}${wk("Week 3 · Power BI dashboard", 0)}${wk("Week 4 · Capstone project", 0)}</div>
      <div class="cu sm" style="right:8%;bottom:21%;--r:7deg"><span class="cu-chip cy">🏁 Milestone: publish dashboard</span></div>`,
    internships: () => `
      <div class="cu" style="left:16%;top:6%;width:62%;--r:6deg;opacity:.92"><small>PixelCraft Studios</small><b>Frontend Intern</b>${lines(80, 60)}</div>
      <div class="cu" style="left:8%;top:22%;width:66%;--r:-4deg"><small>FinEdge Analytics · Hybrid</small><b>Data Analyst Intern</b>
        <div style="margin:6px 0"><span class="cu-chip">SQL</span> <span class="cu-chip">Python</span> <span class="cu-chip">Excel</span></div>
        <div class="cu-row"><small>₹25,000 / month</small><span class="cu-btn">Apply</span></div></div>
      <div class="cu sm" style="right:8%;bottom:21%;--r:8deg;--hy:-12px"><span class="cu-big">92%</span><small>fit for you</small></div>`,
    ats: () => `
      <div class="cu" style="left:10%;top:6%;width:60%;--r:-5deg"><b>resume.pdf</b>${lines(90)}
        <p class="cu-p">Built a <span class="cu-hl">SQL</span> dashboard in <span class="cu-hl">Power BI</span>, cut report time by <span class="cu-hl">40%</span>.</p>${lines(70, 85, 50)}</div>
      <div class="cu sm" style="right:9%;top:30%;--r:8deg;text-align:center;--hy:-10px"><div class="cu-ring" style="--v:81;width:62px;height:62px"><b style="width:48px;height:48px;font-size:17px">81</b></div><small>ATS score</small></div>`,
    interview: () => `
      <div class="cu" style="left:8%;top:9%;width:72%;--r:-4deg"><small>Q2 · Technical · SQL</small><b>What's the difference between WHERE and HAVING?</b>
        <div class="cu-row" style="margin-top:8px"><div class="cu-wave">${Array.from({ length: 16 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}</div><span class="cu-chip">🎙 Listening…</span></div></div>
      <div class="cu sm" style="right:8%;bottom:21%;--r:7deg;--hy:-10px"><span class="cu-big">8<small style="display:inline;font-size:14px">/10</small></span><small>Accuracy 4 · Depth 2 · Clarity 2</small></div>`,
    mentor: () => `
      <div class="cu" style="left:9%;top:8%;width:74%;--r:-3deg">
        <div class="cu-msg me">Which internship should I target first?</div>
        <div class="cu-msg ai">Data Analyst roles. You match 72% already. Close Statistics first, it unlocks 4 listings.</div>
        <div class="cu-msg me" style="width:40%"><span class="cu-dots"><i></i><i></i><i></i></span></div></div>`,
    resume: () => `
      <div class="cu doc" style="left:14%;top:5%;width:56%;--r:-5deg"><b style="font-size:15px">Ananya Verma</b><small>ananya@college.edu · github.com/ananya</small>
        <div class="cu-sec">Skills</div>${lines(92, 74)}<div class="cu-sec">Projects</div>${lines(88, 66, 80)}<div class="cu-sec">Education</div>${lines(70)}</div>
      <div class="cu sm" style="right:8%;bottom:21%;--r:8deg;--hy:-10px"><span class="cu-btn">Save as PDF</span></div>`,
    curriculum: () => `
      <div class="cu" style="left:8%;top:8%;width:62%;--r:-4deg"><b>CS301 · DBMS</b>
        <div class="cu-wk"><span class="ok">✓</span>Normalisation &amp; SQL</div><div class="cu-wk"><span class="ok">✓</span>Transactions</div>
        <div class="cu-wk"><span class="no">✕</span>Hierarchical model</div><div class="cu-wk"><span class="add">+</span>Window functions</div><div class="cu-wk"><span class="add">+</span>NoSQL lab</div></div>
      <div class="cu sm" style="right:8%;top:26%;--r:8deg;text-align:center;--hy:-10px"><div class="cu-ring" style="--v:64;width:62px;height:62px"><b style="width:48px;height:48px;font-size:17px">64</b></div><small>alignment</small></div>`,
    insights: () => `
      <div class="cu" style="left:8%;top:8%;width:76%;--r:-3deg"><b>Industry vs curriculum</b><small>demand index, 0–100</small>
        <div class="cu-bars">${[[88, 40], [82, 55], [76, 30], [70, 62], [64, 22], [58, 35]].map(([a, b]) => `<i style="--h:${a}%"></i><i style="--h:${b}%"></i>`).join("")}</div></div>
      <div class="cu sm" style="right:8%;bottom:21%;--r:7deg;--hy:-10px"><span class="cu-chip bad">Biggest gap · Cloud</span></div>`,
    recruiter: () => `
      <div class="cu" style="left:8%;top:7%;width:60%;--r:-5deg"><b>Post an internship</b>
        <div class="cu-field">Data Engineer Intern</div><div class="cu-field">Python, SQL, Airflow</div><span class="cu-btn">Publish</span></div>
      <div class="cu" style="right:7%;top:36%;width:44%;--r:7deg;--hx:6px"><small>Top candidates</small>
        ${[["AV", "92%"], ["RK", "85%"], ["SM", "78%"]].map(([i, f]) => `<div class="cu-row" style="margin-top:5px"><i class="av sm">${i}</i><b>${f}</b></div>`).join("")}</div>`,
    tracker: () => `
      <div class="cu" style="left:7%;top:10%;width:82%;--r:-3deg"><div class="cu-kb">
        <div><small>Applied</small><span></span><span></span><span></span></div>
        <div><small>Interview</small><span></span><span class="hot"></span></div>
        <div><small>Offer</small><span class="win"></span></div></div></div>
      <div class="cu sm" style="right:10%;bottom:21%;--r:8deg;--hy:-10px"><span class="cu-chip ok">🎉 Offer · FinEdge</span></div>`
  };
})();
