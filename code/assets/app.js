/* Bridgr — single-page app (vanilla JS, hash routing). */
(function () {
  const D = window.BRIDGR_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const app = $("#app");
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- storage (try/catch: private windows can throw) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem("bridgr." + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("bridgr." + k, JSON.stringify(v)); } catch {} }
  };
  const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600); };

  // ---------- theme ----------
  const applyTheme = t => { if (t) document.documentElement.setAttribute("data-theme", t); else document.documentElement.removeAttribute("data-theme"); };
  applyTheme(store.get("theme", null));
  $("#themeBtn").onclick = () => {
    const cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const nt = cur === "dark" ? "light" : "dark"; applyTheme(nt); store.set("theme", nt);
  };
  $("#menuBtn").onclick = () => $("#gnavLinks").classList.toggle("open");

  // ---------- AI client ----------
  let MODE = "checking";
  async function ai(promptId, vars) {
    const t0 = performance.now();
    let result, model, live = true;
    try {
      const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ promptId, vars }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error + (j.details ? " " + j.details.join(" | ") : ""));
      result = j.data; model = j.model;
    } catch (e) {
      console.warn("[Bridgr] LLM unavailable, using offline engine:", e.message);
      result = window.BridgrOffline(promptId, vars); model = "Offline heuristic engine"; live = false;
    }
    MODE = live ? "live" : "offline"; setBadge(model, live);
    const runs = store.get("runs", []);
    runs.push({ at: new Date().toISOString(), promptId, model, ms: Math.round(performance.now() - t0), vars, output: result });
    store.set("runs", runs.slice(-60));
    return { data: result, model, live, ms: Math.round(performance.now() - t0) };
  }
  function setBadge(model, live) { $("#modelBadge").innerHTML = `<span class="badge ${live ? "live" : "off"}">${live ? "Live" : "Offline"}</span> ${esc(model)}`; }
  fetch("/api/ai").then(r => r.json()).then(j => setBadge(j.gateway || j.gemini ? "Gemini 2.5 Flash" : "Offline heuristic engine", j.gateway || j.gemini)).catch(() => setBadge("Offline heuristic engine", false));
  const metaLine = r => `<div class="meta"><span class="badge ${r.live ? "live" : "off"}">${r.live ? "Live AI" : "Offline"}</span><span>${esc(r.model)}</span><span>${(r.ms / 1000).toFixed(1)}s</span></div>`;
  const invalid = d => d && d.error === "invalid_input" ? `<div class="card fade"><h3>⚠️ Couldn't use that input</h3><p class="muted">${esc(d.message || "Please paste real profile / job text.")}</p></div>` : "";

  async function busy(btn, fn) {
    const html = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<span class="spinner"></span> Thinking…`;
    try { await fn(); } catch (e) { console.error(e); toast("Something went wrong: " + e.message); } finally { btn.disabled = false; btn.innerHTML = html; }
  }
  const skel = n => Array.from({ length: n }, (_, i) => `<div class="skeleton" style="width:${90 - i * 12}%"></div>`).join("");
  const ring = (v, c) => `<div class="ring" style="--v:${+v || 0};--c:${c || (v >= 75 ? "var(--green)" : v >= 50 ? "var(--blue)" : v >= 30 ? "var(--amber)" : "var(--red)")}"><b>${+v || 0}</b></div>`;
  const chips = (arr, cls = "") => `<div class="chips">${(arr || []).map(x => `<span class="chip ${cls}">${esc(typeof x === "string" ? x : x.skill || x.name || x.topic)}</span>`).join("") || '<span class="muted small">None</span>'}</div>`;

  // ---------- shared pieces ----------
  const zig = (fill = "var(--bg)") => `<svg class="zig" viewBox="0 0 1440 90" preserveAspectRatio="none"><path d="M0 60 L180 40 L360 70 L560 30 L760 62 L980 26 L1200 58 L1440 34 L1440 90 L0 90Z" fill="${fill}"/><path d="M0 60 L180 40 L360 70 L560 30 L760 62 L980 26 L1200 58 L1440 34" stroke="var(--cyan)" stroke-width="6" fill="none"/></svg>`;
  const pageHero = (eyebrow, title, sub) => `<section class="page-hero"><div class="wrap"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${sub}</p></div>${zig()}</section>`;
  const profile = () => store.get("profile", null);
  const needProfile = () => `<div class="card empty fade"><h3>No profile yet</h3><p>Build your skill profile first — it takes 20 seconds.</p><a class="btn" href="#/profile">Create profile</a></div>`;
  const allInternships = () => [...store.get("posted", []), ...D.internships];

  const MODULES = [
    ["profile", "🎓", "Profile", "Skill Extractor", "AI reads your resume and builds an evidence-backed skill inventory.", "dark", "P1"],
    ["gap", "🧭", "Skill Gap", "Skill Gap Mapper", "Compare your skills with what employers actually ask for.", "ice", "P2 + P3"],
    ["roadmap", "🗺️", "Roadmap", "Learning Roadmap", "A week-by-week plan that fits your timetable.", "", "P4"],
    ["internships", "💼", "Internships", "Internship Portal", "Browse, filter and AI-rank internships by fit.", "dark", "P5"],
    ["ats", "📄", "ATS Score", "ATS Resume Scorer", "See your resume the way a hiring bot does.", "", "P7"],
    ["interview", "🎤", "Interview", "Mock Interview", "Gap-aware questions, voice answers, rubric scoring.", "dark", "P8 + P9"],
    ["curriculum", "🏫", "Curriculum", "Curriculum Auditor", "Faculty: score your syllabus against industry.", "ice", "P6"],
    ["mentor", "💬", "Mentor", "AI Career Mentor", "Ask anything — answers grounded in your profile.", "", "P10"]
  ];

  // ---------- pages ----------
  const pages = {};

  pages.home = () => {
    const p = profile(), gap = store.get("gap", null);
    app.innerHTML = `
    <section class="hero">
      <svg class="sticker" style="left:4%;top:18px;width:74px" viewBox="0 0 80 80"><path d="M6 30 40 14l34 16-34 16z" fill="#1ee39b" stroke="#000" stroke-width="3"/><path d="M20 38v16c10 8 30 8 40 0V38" fill="#1ee39b" stroke="#000" stroke-width="3"/><path d="M70 32v18" stroke="#000" stroke-width="3"/></svg>
      <svg class="sticker" style="left:54%;top:14px;width:64px;animation-delay:-2s" viewBox="0 0 80 80"><path d="M40 4l7 22 22-8-14 18 18 14-23 2 2 23-12-19-12 19 2-23-23-2 18-14L11 18l22 8z" fill="#ff3df2" stroke="#000" stroke-width="3"/></svg>
      <svg class="sticker" style="right:22%;bottom:34px;width:70px;animation-delay:-1s" viewBox="0 0 80 80"><circle cx="40" cy="40" r="30" fill="#ff6a00" stroke="#000" stroke-width="3"/><path d="M26 46c8 10 20 10 28 0" stroke="#000" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="30" cy="32" r="4"/><circle cx="50" cy="32" r="4"/></svg>
      <svg class="sticker" style="left:36%;bottom:26px;width:64px;animation-delay:-3s" viewBox="0 0 80 80"><rect x="10" y="20" width="60" height="44" rx="8" fill="#ffe600" stroke="#000" stroke-width="3"/><path d="M28 20v-6h24v6" stroke="#000" stroke-width="3" fill="none"/><path d="M10 38h60" stroke="#000" stroke-width="3"/></svg>
      <div class="wrap">
        <div><h1>Bridgr</h1><p class="lead">The AI bridge between what you study and what industry hires for. Map your skills, close the gap, land the internship.</p>
          <div class="actions"><a class="btn" href="#/profile">${p ? "Update my profile" : "Start free — map my skills"}</a><a class="btn ghost" style="color:#2997ff;border-color:#2997ff" href="#/internships">Browse internships</a></div></div>
        <div class="hero-side"><h3>Skills, <span class="hl">mapped.</span></h3><a href="#/insights">Institution dashboard ↗</a><a href="#/recruiter">Post an internship ↗</a></div>
      </div>${zig()}
    </section>
    <div class="wrap">
      <div class="cats">${MODULES.map(m => `<a class="cat" href="#/${m[0]}"><span class="cat-ic">${m[1]}</span>${m[2]}</a>`).join("")}</div>
      ${p ? `<section class="sec"><h2 class="sec-h"><span class="hl">Welcome back${p.name ? ", " + esc(p.name.split(" ")[0]) : ""}.</span> <span class="grey">Here's where you stand.</span></h2>
        <div class="grid g3">
          <div class="card"><div class="muted small">Skills on profile</div><div class="stat">${(p.skills || []).length}</div></div>
          <div class="card"><div class="muted small">Latest match ${gap ? "· " + esc(gap.role) : ""}</div><div class="stat">${gap ? gap.result.match_score + "%" : "—"}</div></div>
          <div class="card"><div class="muted small">Applications tracked</div><div class="stat">${store.get("apps", []).length}</div></div>
        </div></section>` : ""}
      <section class="sec"><h2 class="sec-h"><span class="hl">Student journey.</span> <span class="grey">Get sorted with structured AI prompts.</span></h2>
        <div class="shelf" id="shelf1">${MODULES.slice(0, 6).map(tile).join("")}</div>
        <div class="shelf-nav"><button class="round" data-s="shelf1" data-d="-1" aria-label="Previous">‹</button><button class="round" data-s="shelf1" data-d="1" aria-label="Next">›</button></div>
      </section>
      <section class="sec"><h2 class="sec-h"><span class="hl">For campuses & companies.</span> <span class="grey">Close the gap from both sides.</span></h2>
        <div class="shelf" id="shelf2">${[MODULES[6], ["insights", "📊", "Insights", "Skill Demand Insights", "Industry demand vs curriculum coverage, at a glance.", "dark", "Analytics"], ["recruiter", "🏢", "Recruiters", "Recruiter Console", "Post internships and see best-fit candidates.", "", "Portal"], ["tracker", "🗂️", "Tracker", "Application Tracker", "Kanban board for every application.", "ice", "Portal"], ["resume", "🧾", "Resume", "Resume Builder", "One-click resume from your mapped profile.", "dark", "Builder"], MODULES[7]].map(tile).join("")}</div>
        <div class="shelf-nav"><button class="round" data-s="shelf2" data-d="-1" aria-label="Previous">‹</button><button class="round" data-s="shelf2" data-d="1" aria-label="Next">›</button></div>
      </section>
      <section class="sec"><h2 class="sec-h"><span class="hl">How it works.</span> <span class="grey">Five prompts, one pipeline.</span></h2>
        <div class="steps">
          <div class="step"><h3>Extract</h3><p class="muted">P1 turns your resume into skills with proficiency 1–5 and evidence.</p></div>
          <div class="step"><h3>Analyse</h3><p class="muted">P2 turns any job post into weighted requirements.</p></div>
          <div class="step"><h3>Compare</h3><p class="muted">P3 scores the match and lists matched, partial and missing skills.</p></div>
          <div class="step"><h3>Close</h3><p class="muted">P4 builds a roadmap; P8/P9 rehearse the interview.</p></div>
          <div class="step"><h3>Apply</h3><p class="muted">P5 ranks internships; P7 polishes the resume.</p></div>
        </div></section>
    </div>`;
    $$(".round[data-s]").forEach(b => (b.onclick = () => $("#" + b.dataset.s).scrollBy({ left: b.dataset.d * 360, behavior: "smooth" })));
  };
  function tile(m) {
    return `<a class="tile ${m[5]}" href="#/${m[0]}"><span class="cap">${m[5] === "dark" ? "✦" : "◆"}</span><div class="tag">${esc(m[6])}</div><h3>${esc(m[3])}</h3><p>${esc(m[4])}</p><div class="art">${m[1]}</div><span class="go">›</span></a>`;
  }

  // ----- PROFILE (P1)
  pages.profile = () => {
    const p = profile();
    app.innerHTML = pageHero("Prompt P1 · Skill Extractor", "Your skills, <span class='hl'>mapped.</span>", "Paste your resume, LinkedIn summary or just describe yourself. Bridgr extracts only skills backed by evidence.") + `
    <div class="wrap lift"><div class="grid g2">
      <div class="card"><h2>Tell us about you</h2><p class="muted small">Courses, projects, internships, certifications.</p>
        <label for="ptext">Profile / resume text</label><textarea id="ptext" style="min-height:240px" placeholder="e.g. 3rd year BTech CSE. Built a ...">${esc(store.get("ptext", ""))}</textarea>
        <div class="actions"><button class="btn" id="extract">Extract my skills</button><button class="btn ghost" id="sample">Use sample profile</button></div></div>
      <div id="pout">${p ? renderProfile(p) : `<div class="card empty">Your structured profile will appear here.</div>`}</div>
    </div></div>`;
    $("#sample").onclick = () => ($("#ptext").value = D.sampleProfile);
    $("#extract").onclick = e => busy(e.currentTarget, async () => {
      const t = $("#ptext").value.trim(); store.set("ptext", t);
      $("#pout").innerHTML = `<div class="card">${skel(6)}</div>`;
      const r = await ai("P1", { profile_text: t });
      if (r.data.error) return ($("#pout").innerHTML = invalid(r.data));
      store.set("profile", r.data); $("#pout").innerHTML = renderProfile(r.data, r); toast("Profile saved ✓");
    });
    bindProfileEdit();
  };
  function renderProfile(p, r) {
    const cats = {}; (p.skills || []).forEach(s => (cats[s.category || "Other"] = cats[s.category || "Other"] || []).push(s));
    return `<div class="card fade"><h2>${esc(p.name || "Your profile")}</h2><p class="muted">${esc([p.degree, p.year && p.year + " year"].filter(Boolean).join(" · "))}</p><p>${esc(p.summary || "")}</p>
      ${Object.entries(cats).map(([c, list]) => `<h3 style="margin-top:18px">${esc(c)}</h3>${list.map((s, i) => `<div style="margin:10px 0"><div class="row" style="justify-content:space-between"><b style="flex:2">${esc(s.name)}</b><span class="small muted" style="flex:0 0 auto">Level ${s.level}/5</span></div><div class="bar"><i style="width:${s.level * 20}%"></i></div><div class="small muted">${esc(s.evidence || "")}</div></div>`).join("")}`).join("")}
      <div class="row" style="margin-top:16px"><input id="addSkill" placeholder="Add a skill, e.g. Docker" /><select id="addLevel" style="flex:0 0 110px">${[1,2,3,4,5].map(n => `<option ${n === 2 ? "selected" : ""}>${n}</option>`).join("")}</select><button class="btn sm" id="addBtn" style="flex:0 0 auto">Add</button></div>
      <div class="actions"><a class="btn" href="#/gap">Find my skill gap →</a></div>${r ? metaLine(r) : ""}</div>`;
  }
  let profileEditBound = false;
  function bindProfileEdit() {
    if (profileEditBound) return; profileEditBound = true;
    document.addEventListener("click", function h(e) {
      if (e.target.id !== "addBtn") return;
      const p = profile() || { skills: [] }; const n = $("#addSkill").value.trim(); if (!n) return;
      p.skills.push({ name: n, category: "Tools", level: +$("#addLevel").value, evidence: "Added manually" }); store.set("profile", p);
      $("#pout").innerHTML = renderProfile(p); toast("Skill added");
    }, { once: false });
  }

  // ----- SKILL GAP (P2 + P3)
  pages.gap = () => {
    const p = profile(), last = store.get("gap", null);
    app.innerHTML = pageHero("Prompts P2 → P3 · Skill Gap Mapper", "Know the <span class='hl'>gap.</span> Close it.", "Pick a role or paste a real job description. Bridgr analyses the requirements and compares them with your profile.") + `
    <div class="wrap lift">${!p ? needProfile() : `<div class="grid g2">
      <div class="card"><h2>Target role</h2>
        <label for="roleSel">Quick pick</label><select id="roleSel"><option value="">— Paste a JD instead —</option>${Object.keys(D.roles).map(r => `<option>${r}</option>`).join("")}</select>
        <label for="jd">…or paste a job description</label><textarea id="jd" placeholder="Paste internship / job description">${esc(store.get("jd", ""))}</textarea>
        <div class="actions"><button class="btn" id="run">Analyse my gap</button><button class="btn ghost" id="sampleJD">Sample JD</button></div></div>
      <div id="gout">${last ? renderGap(last) : `<div class="card empty">Your match score, radar and gap list will appear here.</div>`}</div></div>`}</div>`;
    if (!p) return;
    $("#sampleJD").onclick = () => { $("#jd").value = D.sampleJD; $("#roleSel").value = ""; };
    $("#run").onclick = e => busy(e.currentTarget, async () => {
      const jd = $("#roleSel").value || $("#jd").value.trim(); if (!jd) return toast("Pick a role or paste a JD");
      store.set("jd", $("#jd").value);
      $("#gout").innerHTML = `<div class="card"><p class="small muted">Step 1/2 · Analysing role requirements (P2)…</p>${skel(5)}</div>`;
      const r2 = await ai("P2", { jd_text: jd });
      if (r2.data.error) return ($("#gout").innerHTML = invalid(r2.data));
      $("#gout").innerHTML = `<div class="card"><p class="small muted">Step 2/2 · Comparing with your ${p.skills.length} skills (P3)…</p>${skel(5)}</div>`;
      const r3 = await ai("P3", { student_skills: JSON.stringify(p.skills.map(s => ({ name: s.name, level: s.level }))), role_requirements: JSON.stringify({ must_have: r2.data.must_have, good_to_have: r2.data.good_to_have }) });
      const g = { role: r2.data.role, req: r2.data, result: r3.data, meta: { model: r3.model, live: r3.live, ms: r2.ms + r3.ms } };
      store.set("gap", g); $("#gout").innerHTML = renderGap(g);
    });
    if (last) drawRadar(last);
  };
  function renderGap(g) {
    const r = g.result;
    setTimeout(() => drawRadar(g), 30);
    return `<div class="card fade"><div class="score">${ring(r.match_score)}<div><div class="muted small">Match for</div><h2>${esc(g.role)}</h2><span class="badge">${esc(r.readiness)}</span></div></div>
      <p style="margin-top:16px">${esc(r.verdict)}</p>
      <div style="height:300px;margin:10px 0"><canvas id="radar"></canvas></div>
      <h3>✅ Matched</h3>${chips(r.matched, "ok")}
      <h3 style="margin-top:14px">🟡 Partial</h3>${chips((r.partial || []).map(x => `${x.skill} (${x.student_level}→${x.required_level})`), "mid")}
      <h3 style="margin-top:14px">❌ Missing</h3>
      <div class="tablewrap"><table><tr><th>Skill</th><th>Priority</th><th>Why it matters</th></tr>${(r.missing || []).map(m => `<tr><td><b>${esc(m.skill)}</b></td><td>${esc(m.priority)}</td><td>${esc(m.why_it_matters)}</td></tr>`).join("") || "<tr><td colspan=3 class=muted>Nothing missing 🎉</td></tr>"}</table></div>
      <div class="actions"><a class="btn" href="#/roadmap">Build my roadmap →</a><a class="btn ghost" href="#/interview">Practise interview</a><button class="btn ghost" onclick="window.print()">Export report</button></div>
      ${metaLine({ ...g.meta })}</div>`;
  }
  let radarChart;
  function drawRadar(g) {
    const c = $("#radar"); if (!c || !window.Chart) return;
    const req = [...(g.req.must_have || []), ...(g.req.good_to_have || [])].slice(0, 10);
    const p = profile() || { skills: [] }; const lv = {}; p.skills.forEach(s => (lv[s.name.toLowerCase()] = s.level));
    const r = g.result; const fromRes = {}; [...(r.matched || []), ...(r.partial || [])].forEach(x => (fromRes[x.skill.toLowerCase()] = x.student_level));
    const dark = document.documentElement.getAttribute("data-theme") === "dark" || (!document.documentElement.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    radarChart && radarChart.destroy();
    radarChart = new Chart(c, { type: "radar", data: { labels: req.map(x => x.skill), datasets: [
      { label: "Industry needs", data: req.map(x => x.required_level), borderColor: "#00b8d9", backgroundColor: "rgba(0,217,255,.15)", pointRadius: 2 },
      { label: "You", data: req.map(x => fromRes[x.skill.toLowerCase()] ?? lv[x.skill.toLowerCase()] ?? 0), borderColor: "#0071e3", backgroundColor: "rgba(0,113,227,.2)", pointRadius: 2 }] },
      options: { maintainAspectRatio: false, scales: { r: { min: 0, max: 5, ticks: { stepSize: 1, display: false }, grid: { color: dark ? "#333" : "#ddd" }, angleLines: { color: dark ? "#333" : "#ddd" }, pointLabels: { color: dark ? "#ddd" : "#333", font: { size: 11 } } } }, plugins: { legend: { labels: { color: dark ? "#ddd" : "#333" } } } } });
  }

  // ----- ROADMAP (P4)
  pages.roadmap = () => {
    const g = store.get("gap", null), rm = store.get("roadmap", null);
    app.innerHTML = pageHero("Prompt P4 · Learning Roadmap", "A plan that <span class='hl'>fits your week.</span>", "Turns your missing and partial skills into weekly tasks, free resources and verifiable milestones.") + `
    <div class="wrap lift">${!g ? `<div class="card empty"><h3>Run a skill gap analysis first</h3><a class="btn" href="#/gap">Go to Skill Gap</a></div>` : `
      <div class="card"><div class="row"><div><label>Target role</label><input id="rRole" value="${esc(g.role)}" /></div><div><label>Weeks</label><input id="rW" type="number" min="1" max="16" value="6" /></div><div><label>Hours / week</label><input id="rH" type="number" min="1" max="40" value="8" /></div><div style="flex:0 0 auto;align-self:flex-end"><button class="btn" id="gen">Generate roadmap</button></div></div>
      <p class="small muted">Gaps used: ${[...(g.result.missing || []), ...(g.result.partial || [])].map(x => esc(x.skill)).join(", ") || "none"}</p></div>
      <div id="rout" style="margin-top:20px">${rm ? renderRoadmap(rm) : ""}</div>`}</div>`;
    if (!g) return;
    $("#gen").onclick = e => busy(e.currentTarget, async () => {
      $("#rout").innerHTML = `<div class="card">${skel(8)}</div>`;
      const gaps = [...(g.result.missing || []), ...(g.result.partial || [])].map(x => ({ skill: x.skill, priority: x.priority || "Medium", current_level: x.student_level || 0, required_level: x.required_level }));
      const r = await ai("P4", { gaps: JSON.stringify(gaps), weeks: $("#rW").value, hours_per_week: $("#rH").value, target_role: $("#rRole").value });
      const rm2 = { ...r.data, _meta: { model: r.model, live: r.live, ms: r.ms }, done: {} }; store.set("roadmap", rm2); $("#rout").innerHTML = renderRoadmap(rm2); bindRoadmap();
    });
    bindRoadmap();
  };
  function renderRoadmap(rm) {
    const total = (rm.weeks || []).reduce((a, w) => a + (w.tasks || []).length, 0), done = Object.values(rm.done || {}).filter(Boolean).length;
    return `<div class="grid g2 fade"><div class="card"><h2>${esc(rm.plan_title)}</h2><p class="muted small">Progress ${done}/${total} tasks</p><div class="bar"><i style="width:${total ? (100 * done) / total : 0}%"></i></div>
      ${(rm.weeks || []).map(w => `<div class="week"><h4>Week ${w.week} · ${esc(w.focus)} <span class="muted small">(${w.hours || ""}h)</span></h4><ul style="list-style:none;padding:0">${(w.tasks || []).map((t, i) => { const k = w.week + "-" + i; return `<li><label style="display:flex;gap:8px;font-weight:400;color:var(--text);margin:4px 0;font-size:15px"><input type="checkbox" data-k="${k}" ${rm.done && rm.done[k] ? "checked" : ""} style="width:auto"/> ${esc(t)}</label></li>`; }).join("")}</ul>
        <div class="small muted">📚 ${(w.resources || []).map(r => esc(r.title) + (r.type ? ` (${esc(r.type)})` : "")).join(" · ")}</div><div class="small">🏁 <b>${esc(w.milestone)}</b></div></div>`).join("")}</div>
      <div><div class="card dark"><div class="tag" style="color:var(--orange);font-size:12px;font-weight:700">CAPSTONE</div><h2>${esc(rm.capstone_project?.title)}</h2><p>${esc(rm.capstone_project?.description)}</p>${chips(rm.capstone_project?.skills_covered)}</div>
      <div class="card" style="margin-top:20px"><h3>Tips</h3><ul>${(rm.tips || []).map(t => `<li>${esc(t)}</li>`).join("")}</ul><div class="actions"><button class="btn ghost" onclick="window.print()">Print plan</button></div>${rm._meta ? metaLine(rm._meta) : ""}</div></div></div>`;
  }
  function bindRoadmap() {
    $$("#rout input[type=checkbox]").forEach(cb => (cb.onchange = () => { const rm = store.get("roadmap", {}); rm.done = rm.done || {}; rm.done[cb.dataset.k] = cb.checked; store.set("roadmap", rm); $("#rout").innerHTML = renderRoadmap(rm); bindRoadmap(); }));
  }

  // ----- INTERNSHIPS (P5)
  pages.internships = () => {
    const list = allInternships(), domains = [...new Set(list.map(i => i.domain))];
    const fits = store.get("fits", {});
    app.innerHTML = pageHero("Prompt P5 · Internship Portal", "Internships, <span class='hl'>ranked for you.</span>", `${list.length} open roles. Filter, search, or let AI rank them by how well they fit your skills.`) + `
    <div class="wrap lift"><div class="card"><div class="row"><input id="q" placeholder="Search title, company or skill" /><select id="dom"><option value="">All domains</option>${domains.map(d => `<option>${d}</option>`).join("")}</select><select id="loc"><option value="">Any location</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select><select id="sort"><option value="fit">Sort: Best fit</option><option value="stipend">Sort: Stipend</option><option value="deadline">Sort: Deadline</option></select><button class="btn" id="rank" style="flex:0 0 auto">✦ AI rank for me</button></div></div>
      <div id="rankOut"></div><div class="grid g3" id="jobs" style="margin-top:20px"></div></div>`;
    const draw = () => {
      const q = $("#q").value.toLowerCase(), dom = $("#dom").value, loc = $("#loc").value, sort = $("#sort").value;
      let l = list.filter(i => (!q || (i.title + i.company + i.skills.join(" ")).toLowerCase().includes(q)) && (!dom || i.domain === dom) && (!loc || i.location.includes(loc)));
      const f = store.get("fits", {});
      l.sort((a, b) => sort === "stipend" ? b.stipend - a.stipend : sort === "deadline" ? a.deadline.localeCompare(b.deadline) : (f[b.id]?.fit_score ?? -1) - (f[a.id]?.fit_score ?? -1));
      $("#jobs").innerHTML = l.map(i => jobCard(i, f[i.id])).join("") || `<div class="card empty">No internships match those filters.</div>`;
      $$("[data-apply]").forEach(b => (b.onclick = () => apply(b.dataset.apply)));
    };
    ["q", "dom", "loc", "sort"].forEach(id => ($("#" + id).oninput = draw)); draw();
    $("#rank").onclick = e => { const p = profile(); if (!p) return (location.hash = "#/profile");
      busy(e.currentTarget, async () => {
        const r = await ai("P5", { student_profile: JSON.stringify({ skills: p.skills.map(s => s.name + ":" + s.level), interests: p.interests || [] }), internships: JSON.stringify(list.map(({ id, title, company, skills, location, stipend }) => ({ id, title, company, skills, location, stipend }))) });
        const map = {}; (r.data.ranked || []).forEach(x => list.find(i => i.id === x.id) && (map[x.id] = x)); store.set("fits", map);
        $("#rankOut").innerHTML = `<div class="card dark fade" style="margin-top:20px"><h2>Your top matches</h2>${(r.data.ranked || []).filter(x => map[x.id]).map((x, n) => { const i = list.find(j => j.id === x.id); return `<div style="padding:12px 0;border-bottom:1px solid #333"><b>${n + 1}. ${esc(i.title)} · ${esc(i.company)}</b> <span class="fit" style="color:var(--cyan)">${x.fit_score}% fit</span><div class="small" style="color:#d2d2d7">${(x.reasons || []).map(esc).join(" · ")}</div><div class="small" style="color:#a1a1a6">To learn: ${(x.missing_skills || []).map(esc).join(", ") || "—"} · Tip: ${esc(x.apply_tip || "")}</div></div>`; }).join("")}${metaLine(r)}</div>`;
        $("#sort").value = "fit"; draw();
      }); };
  };
  function jobCard(i, fit) {
    const applied = store.get("apps", []).some(a => a.id === i.id);
    return `<div class="card ${i.tone === "dark" ? "dark" : ""} job fade"><div class="co">${esc(i.company)} ${i.posted ? '<span class="badge">New</span>' : ""}</div><h3>${esc(i.title)}</h3><div class="small muted">📍 ${esc(i.location)} · ⏱ ${esc(i.duration)}</div><div class="small">₹${i.stipend.toLocaleString("en-IN")}/month · Apply by ${esc(i.deadline)}</div>${chips(i.skills)}
      <div class="foot2">${fit ? `<span class="fit">${fit.fit_score}% fit</span>` : "<span></span>"}<button class="btn sm" data-apply="${i.id}" ${applied ? "disabled" : ""}>${applied ? "Applied ✓" : "Apply"}</button></div></div>`;
  }
  function apply(id) {
    const apps = store.get("apps", []); if (apps.some(a => a.id === id)) return;
    const i = allInternships().find(x => x.id === id); apps.push({ id, title: i.title, company: i.company, stage: "Applied", at: new Date().toISOString().slice(0, 10) });
    store.set("apps", apps); toast(`Applied to ${i.company} — tracked in your board`); route();
  }

  // ----- TRACKER
  pages.tracker = () => {
    const stages = ["Applied", "Interview", "Offer", "Rejected"], apps = store.get("apps", []);
    app.innerHTML = pageHero("Portal · Application Tracker", "Every application, <span class='hl'>sorted.</span>", "Drag cards between columns as you hear back. Stored privately in your browser.") + `
    <div class="wrap lift"><div class="card"><div class="kanban">${stages.map(s => `<div class="col" data-stage="${s}"><h4>${s}<span class="muted">${apps.filter(a => a.stage === s).length}</span></h4>${apps.filter(a => a.stage === s).map(a => `<div class="kcard" draggable="true" data-id="${a.id}"><b>${esc(a.title)}</b>${esc(a.company)}<div class="small muted">Since ${esc(a.at)}</div><div class="row" style="margin-top:6px">${stages.filter(x => x !== s).map(x => `<button class="linkbtn small" data-move="${a.id}" data-to="${x}" style="flex:0 0 auto">→ ${x}</button>`).join("")}</div></div>`).join("") || '<p class="small muted" style="margin:6px">Empty</p>'}</div>`).join("")}</div>
      ${apps.length ? "" : `<div class="empty">No applications yet. <a href="#/internships">Browse internships →</a></div>`}</div></div>`;
    const move = (id, to) => { const a = store.get("apps", []); const x = a.find(y => y.id === id); if (x) { x.stage = to; store.set("apps", a); route(); } };
    $$("[data-move]").forEach(b => (b.onclick = () => move(b.dataset.move, b.dataset.to)));
    $$(".kcard").forEach(c => (c.ondragstart = e => e.dataTransfer.setData("text", c.dataset.id)));
    $$(".col").forEach(c => { c.ondragover = e => { e.preventDefault(); c.classList.add("over"); }; c.ondragleave = () => c.classList.remove("over"); c.ondrop = e => { e.preventDefault(); move(e.dataTransfer.getData("text"), c.dataset.stage); }; });
  };

  // ----- ATS (P7)
  pages.ats = () => {
    app.innerHTML = pageHero("Prompt P7 · ATS Resume Scorer", "Beat the bot. <span class='hl'>Then the human.</span>", "Score your resume against a job description on keywords, impact, structure and relevance.") + `
    <div class="wrap lift"><div class="grid g2"><div class="card"><label for="res">Your resume (plain text)</label><textarea id="res">${esc(store.get("ptext", ""))}</textarea>
      <label for="ajd">Job description</label><textarea id="ajd">${esc(store.get("jd", ""))}</textarea>
      <div class="actions"><button class="btn" id="score">Score my resume</button><button class="btn ghost" id="fill">Use samples</button></div></div><div id="aout"><div class="card empty">Your ATS score will appear here.</div></div></div></div>`;
    $("#fill").onclick = () => { $("#res").value = D.sampleProfile; $("#ajd").value = D.sampleJD; };
    $("#score").onclick = e => busy(e.currentTarget, async () => {
      $("#aout").innerHTML = `<div class="card">${skel(6)}</div>`;
      const r = await ai("P7", { resume_text: $("#res").value, jd_text: $("#ajd").value }); const d = r.data;
      if (d.error) return ($("#aout").innerHTML = invalid(d));
      $("#aout").innerHTML = `<div class="card fade"><div class="score">${ring(d.ats_score)}<div><h2>ATS score</h2><p class="muted small">0.4·keywords + 0.25·impact + 0.2·structure + 0.15·relevance</p></div></div>
        ${Object.entries(d.breakdown || {}).map(([k, v]) => `<div style="margin:10px 0"><div class="row" style="justify-content:space-between"><span style="text-transform:capitalize">${k}</span><b style="flex:0 0 auto">${v}</b></div><div class="bar"><i style="width:${v}%"></i></div></div>`).join("")}
        <h3>Keywords found</h3>${chips(d.keywords_found, "ok")}<h3 style="margin-top:12px">Keywords missing</h3>${chips(d.keywords_missing, "bad")}
        ${(d.section_feedback || []).map(s => `<p><b>${esc(s.section)}:</b> ${esc(s.feedback)}</p>`).join("")}
        ${(d.rewrite_suggestions || []).length ? `<h3>Rewrite suggestions</h3>${d.rewrite_suggestions.map(s => `<div class="card" style="box-shadow:none;background:var(--bg);margin:8px 0;padding:14px"><div class="small muted">Before</div>${esc(s.before)}<div class="small muted" style="margin-top:6px">After</div><b>${esc(s.after)}</b></div>`).join("")}` : ""}${metaLine(r)}</div>`;
    });
  };

  // ----- INTERVIEW (P8 + P9)
  pages.interview = () => {
    const g = store.get("gap", null);
    const focus = g ? [...(g.result.missing || []), ...(g.result.partial || []), ...(g.result.matched || [])].map(x => x.skill).slice(0, 6).join(", ") : "";
    app.innerHTML = pageHero("Prompts P8 → P9 · Mock Interview", "Rehearse. <span class='hl'>Get scored.</span>", "Questions target your gap skills. Type or speak your answer and get rubric-based feedback.") + `
    <div class="wrap lift"><div class="card"><div class="row"><div><label>Role</label><input id="iRole" value="${esc(g?.role || "Data Analyst Intern")}" /></div><div style="flex:2"><label>Focus skills</label><input id="iSk" value="${esc(focus || "SQL, Python, Statistics")}" /></div><div><label>Difficulty</label><select id="iD"><option>Easy</option><option selected>Medium</option><option>Hard</option></select></div><div style="flex:0 0 90px"><label>Count</label><input id="iN" type="number" min="1" max="10" value="5" /></div><div style="flex:0 0 auto;align-self:flex-end"><button class="btn" id="genQ">Generate questions</button></div></div></div>
      <div id="qs" style="margin-top:20px"></div></div>`;
    const saved = store.get("interview", null); if (saved) drawQs(saved);
    $("#genQ").onclick = e => busy(e.currentTarget, async () => {
      $("#qs").innerHTML = `<div class="card">${skel(5)}</div>`;
      const r = await ai("P8", { role: $("#iRole").value, skills: $("#iSk").value, difficulty: $("#iD").value, count: $("#iN").value });
      const s = { questions: r.data.questions || [], evals: {}, meta: { model: r.model, live: r.live, ms: r.ms } }; store.set("interview", s); drawQs(s);
    });
  };
  function drawQs(s) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const avg = Object.values(s.evals).length ? (Object.values(s.evals).reduce((a, e) => a + e.score, 0) / Object.values(s.evals).length).toFixed(1) : null;
    $("#qs").innerHTML = (avg ? `<div class="card dark fade" style="margin-bottom:20px"><div class="score">${ring(avg * 10, "var(--cyan)")}<div><h2>Session score ${avg}/10</h2><p style="color:#a1a1a6">${Object.keys(s.evals).length}/${s.questions.length} answered</p></div></div></div>` : "") +
      s.questions.map((q, i) => `<div class="card fade" style="margin-bottom:16px"><div class="row" style="justify-content:space-between"><span class="badge">${esc(q.type)} · ${esc(q.skill)}</span></div><h3 style="margin-top:10px">Q${i + 1}. ${esc(q.q)}</h3>
        <textarea id="ans${i}" style="min-height:100px" placeholder="Type your answer${SR ? " or press 🎙 to speak" : ""}">${esc(s.evals[i]?.answer || "")}</textarea>
        <div class="actions"><button class="btn sm" data-eval="${i}">Evaluate</button>${SR ? `<button class="btn sm ghost" data-mic="${i}">🎙 Speak</button>` : ""}</div>
        <div id="ev${i}">${s.evals[i] ? renderEval(s.evals[i]) : ""}</div></div>`).join("") + (s.meta ? metaLine(s.meta) : "");
    $$("[data-eval]").forEach(b => (b.onclick = () => busy(b, async () => {
      const i = +b.dataset.eval, q = s.questions[i], answer = $("#ans" + i).value;
      const r = await ai("P9", { question: q.q, ideal_points: JSON.stringify(q.ideal_points || []), answer });
      s.evals[i] = { ...r.data, answer, _m: { model: r.model, live: r.live, ms: r.ms } }; store.set("interview", s); drawQs(s);
    })));
    $$("[data-mic]").forEach(b => (b.onclick = () => {
      const i = +b.dataset.mic, rec = new SR(); rec.lang = "en-IN"; rec.interimResults = false; b.textContent = "● Listening…";
      rec.onresult = e => ($("#ans" + i).value += (($("#ans" + i).value ? " " : "") + e.results[0][0].transcript));
      rec.onend = () => (b.textContent = "🎙 Speak"); rec.onerror = () => toast("Mic not available — type instead"); rec.start();
    }));
  }
  function renderEval(e) {
    return `<div class="fade" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line)"><div class="row" style="align-items:center"><div style="flex:0 0 auto" class="stat">${e.score}<span class="muted" style="font-size:20px">/10</span></div><div class="small muted">Accuracy ${e.rubric?.accuracy}/4 · Depth ${e.rubric?.depth}/3 · Clarity ${e.rubric?.clarity}/3</div></div>
      <p>${esc(e.feedback)}</p>${(e.missed_points || []).length ? `<div class="small"><b>Missed:</b> ${e.missed_points.map(esc).join(" · ")}</div>` : ""}${e.improved_answer ? `<details style="margin-top:8px"><summary class="small" style="cursor:pointer;color:var(--link)">See a stronger answer</summary><p class="small">${esc(e.improved_answer)}</p></details>` : ""}${e._m ? metaLine(e._m) : ""}</div>`;
  }

  // ----- CURRICULUM (P6)
  pages.curriculum = () => {
    app.innerHTML = pageHero("Prompt P6 · For Institutions", "Is your syllabus <span class='hl'>industry-ready?</span>", "Faculty paste a course syllabus; Bridgr scores alignment with a target role and suggests where to add what.") + `
    <div class="wrap lift"><div class="grid g2"><div class="card"><label>Target industry role</label><select id="cRole">${Object.keys(D.roles).map(r => `<option>${r}</option>`).join("")}</select>
      <label for="syl">Syllabus</label><textarea id="syl" style="min-height:260px">${esc(store.get("syl", ""))}</textarea>
      <div class="actions"><button class="btn" id="audit">Audit syllabus</button><button class="btn ghost" id="sSyl">Sample DBMS syllabus</button></div></div><div id="cout"><div class="card empty">Alignment report will appear here.</div></div></div></div>`;
    $("#sSyl").onclick = () => ($("#syl").value = D.sampleSyllabus);
    $("#audit").onclick = e => busy(e.currentTarget, async () => {
      store.set("syl", $("#syl").value); $("#cout").innerHTML = `<div class="card">${skel(7)}</div>`;
      const r = await ai("P6", { syllabus_text: $("#syl").value, target_role: $("#cRole").value }); const d = r.data;
      if (d.error) return ($("#cout").innerHTML = invalid(d));
      $("#cout").innerHTML = `<div class="card fade"><div class="score">${ring(d.alignment_score)}<div><h2>Alignment score</h2><p class="muted">${esc(d.summary)}</p></div></div>
        <h3>Covered</h3>${chips((d.covered || []).map(c => `${c.topic} · ${c.industry_relevance}`), "ok")}
        <h3 style="margin-top:12px">Outdated / low value</h3>${(d.outdated_or_low_value || []).map(o => `<p class="small"><b>${esc(o.topic)}</b> — ${esc(o.reason)}</p>`).join("") || '<p class="small muted">None flagged</p>'}
        <h3>Missing topics</h3><div class="tablewrap"><table><tr><th>Topic</th><th>Priority</th><th>Where</th><th>Lab idea</th></tr>${(d.missing_topics || []).map(m => `<tr><td><b>${esc(m.topic)}</b></td><td>${esc(m.priority)}</td><td>${esc(m.suggested_unit)}</td><td>${esc(m.lab_idea)}</td></tr>`).join("")}</table></div>
        <h3 style="margin-top:12px">Industry tools to add</h3>${chips(d.industry_tools_to_add)}<div class="actions"><button class="btn ghost" onclick="window.print()">Export report</button></div>${metaLine(r)}</div>`;
    });
  };

  // ----- INSIGHTS (analytics, no LLM)
  pages.insights = () => {
    const list = allInternships(), count = {}; list.forEach(i => i.skills.forEach(s => (count[s] = (count[s] || 0) + 1)));
    const top = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const apps = store.get("apps", []);
    app.innerHTML = pageHero("Analytics · Institution Dashboard", "Where demand <span class='hl'>meets the classroom.</span>", "Live skill demand from open internships on Bridgr, compared with typical curriculum coverage.") + `
    <div class="wrap lift"><div class="grid g4"><div class="card"><div class="muted small">Open internships</div><div class="stat">${list.length}</div></div><div class="card"><div class="muted small">Avg stipend</div><div class="stat">₹${Math.round(list.reduce((a, i) => a + i.stipend, 0) / list.length / 1000)}k</div></div><div class="card"><div class="muted small">Distinct skills demanded</div><div class="stat">${Object.keys(count).length}</div></div><div class="card"><div class="muted small">Applications (this device)</div><div class="stat">${apps.length}</div></div></div>
      <div class="grid g2" style="margin-top:20px"><div class="card"><h3>Most-demanded skills (open internships)</h3><div style="height:320px"><canvas id="c1"></canvas></div></div><div class="card"><h3>Industry demand vs curriculum coverage</h3><p class="small muted">Illustrative index (0–100) · gap = opportunity for new electives</p><div style="height:300px"><canvas id="c2"></canvas></div></div></div>
      <div class="card" style="margin-top:20px"><h3>Biggest academia–industry gaps</h3><div class="tablewrap"><table><tr><th>Skill</th><th>Industry</th><th>Curriculum</th><th>Gap</th></tr>${D.demand.labels.map((l, i) => [l, D.demand.industry[i], D.demand.curriculum[i]]).sort((a, b) => b[1] - b[2] - (a[1] - a[2])).map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td><span class="chip ${r[1] - r[2] > 40 ? "bad" : r[1] - r[2] > 20 ? "mid" : "ok"}">${r[1] - r[2]}</span></td></tr>`).join("")}</table></div><div class="actions"><a class="btn" href="#/curriculum">Audit a syllabus →</a></div></div></div>`;
    const go = () => { if (!window.Chart) return setTimeout(go, 100);
      new Chart($("#c1"), { type: "bar", data: { labels: top.map(t => t[0]), datasets: [{ label: "Internships asking", data: top.map(t => t[1]), backgroundColor: "#0071e3", borderRadius: 8 }] }, options: { indexAxis: "y", maintainAspectRatio: false, plugins: { legend: { display: false } } } });
      new Chart($("#c2"), { type: "bar", data: { labels: D.demand.labels, datasets: [{ label: "Industry", data: D.demand.industry, backgroundColor: "#00b8d9", borderRadius: 6 }, { label: "Curriculum", data: D.demand.curriculum, backgroundColor: "#1d1d1f", borderRadius: 6 }] }, options: { maintainAspectRatio: false } }); };
    go();
  };

  // ----- RECRUITER
  pages.recruiter = () => {
    const posted = store.get("posted", []);
    app.innerHTML = pageHero("Portal · Recruiter Console", "Hire for skills, <span class='hl'>not just CGPA.</span>", "Post an internship. It appears instantly in the student portal and AI ranking.") + `
    <div class="wrap lift"><div class="grid g2"><div class="card"><h2>Post an internship</h2>
      <div class="row"><div><label>Title</label><input id="rt" placeholder="e.g. Data Engineer Intern"/></div><div><label>Company</label><input id="rc" placeholder="Company name"/></div></div>
      <div class="row"><div><label>Location</label><input id="rl" placeholder="City · Hybrid / Remote"/></div><div><label>Stipend (₹/month)</label><input id="rs" type="number" value="20000"/></div></div>
      <div class="row"><div><label>Domain</label><select id="rd"><option>Data</option><option>Web</option><option>AI</option><option>Cloud</option><option>Security</option><option>Design</option><option>Product</option><option>Mobile</option></select></div><div><label>Deadline</label><input id="rdl" type="date" value="2026-12-31"/></div></div>
      <label>Required skills (comma separated)</label><input id="rsk" placeholder="Python, SQL, Airflow"/>
      <div class="actions"><button class="btn" id="post">Publish internship</button></div></div>
      <div class="card"><h2>Your postings</h2>${posted.length ? posted.map(p => `<div style="padding:12px 0;border-bottom:1px solid var(--line)"><b>${esc(p.title)}</b> · ${esc(p.company)}<div class="small muted">${esc(p.location)} · ₹${p.stipend} · ${p.skills.map(esc).join(", ")}</div><button class="linkbtn small" data-del="${p.id}">Remove</button></div>`).join("") : '<p class="muted">Nothing posted yet.</p>'}
        <h3 style="margin-top:20px">Candidate on this device</h3>${profile() ? `<p><b>${esc(profile().name || "Student")}</b> — ${profile().skills.length} verified skills${store.get("gap") ? ` · ${store.get("gap").result.match_score}% match for ${esc(store.get("gap").role)}` : ""}</p>${chips(profile().skills.slice(0, 10).map(s => s.name))}` : '<p class="muted small">No student profile yet.</p>'}</div></div></div>`;
    $("#post").onclick = () => {
      const t = $("#rt").value.trim(), c = $("#rc").value.trim(), sk = $("#rsk").value.split(",").map(s => s.trim()).filter(Boolean);
      if (!t || !c || !sk.length) return toast("Title, company and skills are required");
      const p = store.get("posted", []); p.unshift({ id: "P" + Date.now().toString(36), title: t, company: c, location: $("#rl").value || "Remote", stipend: +$("#rs").value || 0, duration: "3 months", skills: sk, domain: $("#rd").value, deadline: $("#rdl").value, tone: "light", posted: true });
      store.set("posted", p); toast("Internship published ✓"); route();
    };
    $$("[data-del]").forEach(b => (b.onclick = () => { store.set("posted", store.get("posted", []).filter(p => p.id !== b.dataset.del)); route(); }));
  };

  // ----- RESUME BUILDER
  pages.resume = () => {
    const p = profile(); const extra = store.get("resumeExtra", { email: "", phone: "", links: "" });
    app.innerHTML = pageHero("Builder · Resume", "One profile. <span class='hl'>One-click resume.</span>", "Generated from your mapped skills. Edit contact details, then print or save as PDF.") + `
    <div class="wrap lift">${!p ? needProfile() : `<div class="card noprint"><div class="row"><div><label>Email</label><input id="xe" value="${esc(extra.email)}"/></div><div><label>Phone</label><input id="xp" value="${esc(extra.phone)}"/></div><div><label>Links</label><input id="xl" value="${esc(extra.links)}" placeholder="github.com/you"/></div><div style="flex:0 0 auto;align-self:flex-end"><button class="btn" onclick="window.print()">Print / Save PDF</button></div></div></div>
      <div class="resume" style="margin-top:20px" id="rv"></div>`}</div>`;
    if (!p) return;
    const draw = () => { const x = { email: $("#xe").value, phone: $("#xp").value, links: $("#xl").value }; store.set("resumeExtra", x);
      const by = {}; p.skills.forEach(s => (by[s.category || "Other"] = by[s.category || "Other"] || []).push(s.name));
      $("#rv").innerHTML = `<h1>${esc(p.name || "Your Name")}</h1><div>${esc([p.degree, p.year && p.year + " year", x.email, x.phone, x.links].filter(Boolean).join(" · "))}</div>
        <h2>Summary</h2><p>${esc(p.summary || "")}</p><h2>Skills</h2>${Object.entries(by).map(([c, l]) => `<div><b>${esc(c)}:</b> ${l.map(esc).join(", ")}</div>`).join("")}
        ${(p.projects || []).length ? `<h2>Projects</h2>${p.projects.map(pr => `<div><b>${esc(pr.title)}</b> — ${(pr.tech || []).map(esc).join(", ")}</div>`).join("")}` : ""}
        ${(p.interests || []).length ? `<h2>Interests</h2><p>${p.interests.map(esc).join(", ")}</p>` : ""}`; };
    ["xe", "xp", "xl"].forEach(id => ($("#" + id).oninput = draw)); draw();
  };

  // ----- MENTOR (P10)
  pages.mentor = () => {
    const chat = store.get("chat", []);
    app.innerHTML = pageHero("Prompt P10 · AI Career Mentor", "Ask your <span class='hl'>mentor.</span>", "Answers are grounded in your saved profile and latest gap report.") + `
    <div class="wrap lift"><div class="card"><div class="chat" id="chat">${chat.map(m => `<div class="msg ${m.r}">${esc(m.t)}</div>`).join("") || `<div class="msg ai">Hi! I'm Bridgr Mentor. Ask me things like “Which internship should I target first?” or “How do I explain my recommender project in an interview?”</div>`}</div>
      <div class="chips" style="margin:12px 0">${["What should I learn first?", "Am I ready to apply?", "Suggest a portfolio project"].map(s => `<button class="chip linkbtn" data-sug="${s}">${s}</button>`).join("")}</div>
      <div class="row"><input id="cm" placeholder="Ask about skills, internships, interviews…" /><button class="btn" id="send" style="flex:0 0 auto">Send</button><button class="btn ghost sm" id="clr" style="flex:0 0 auto">Clear</button></div></div></div>`;
    const box = $("#chat"); box.scrollTop = box.scrollHeight;
    const send = async () => {
      const t = $("#cm").value.trim(); if (!t) return; $("#cm").value = "";
      const c = store.get("chat", []); c.push({ r: "me", t }); store.set("chat", c);
      box.insertAdjacentHTML("beforeend", `<div class="msg me">${esc(t)}</div><div class="msg ai" id="typing">…</div>`); box.scrollTop = box.scrollHeight;
      const p = profile(), g = store.get("gap", null);
      const ctx = p ? { skills: p.skills.map(s => s.name + ":" + s.level), summary: p.summary, target: g?.role, match: g?.result.match_score, missing: g?.result.missing?.map(m => m.skill) } : {};
      const r = await ai("P10", { student_context: JSON.stringify(ctx), message: t });
      const reply = (r.data.reply || r.data.message || "") + (r.data.next_action ? `\n\n👉 Next: ${r.data.next_action}` : "");
      c.push({ r: "ai", t: reply }); store.set("chat", c.slice(-40)); $("#typing").outerHTML = `<div class="msg ai">${esc(reply)}</div>`; box.scrollTop = box.scrollHeight;
    };
    $("#send").onclick = send; $("#cm").onkeydown = e => e.key === "Enter" && send();
    $$("[data-sug]").forEach(b => (b.onclick = () => { $("#cm").value = b.dataset.sug; send(); }));
    $("#clr").onclick = () => { store.set("chat", []); route(); };
  };

  // ---------- router ----------
  function route() {
    const name = (location.hash.replace(/^#\/?/, "").split("?")[0] || "home");
    (pages[name] || pages.home)();
    $$(".gnav-links a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#/" + name));
    $("#gnavLinks").classList.remove("open");
  }
  let lastHash = null;
  window.addEventListener("hashchange", () => { route(); if (location.hash !== lastHash) window.scrollTo(0, 0); lastHash = location.hash; });
  $("#dlRuns").onclick = e => { e.preventDefault(); const b = new Blob([JSON.stringify(store.get("runs", []), null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "bridgr-runs.json"; a.click(); };
  $("#resetAll").onclick = e => { e.preventDefault(); try { Object.keys(localStorage).filter(k => k.startsWith("bridgr.")).forEach(k => localStorage.removeItem(k)); } catch {} toast("Demo data cleared"); route(); };
  route();
})();
