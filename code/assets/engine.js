// Offline heuristic engine — used ONLY when the LLM endpoint is unreachable.
// Returns the same JSON shapes as prompts P1–P10 so the UI keeps working. Results are marked "offline".
(function () {
  const D = window.BRIDGR_DATA;
  const VOCAB = {
    "Programming": ["Python","Java","C++","C","JavaScript","TypeScript","Kotlin","Go","Rust"],
    "Web": ["HTML","CSS","React","Node.js","Express","Tailwind CSS","REST APIs","Next.js","Responsive Design"],
    "Data/AI": ["SQL","Pandas","NumPy","Scikit-learn","Machine Learning","Deep Learning","PyTorch","TensorFlow","Statistics","Excel","Power BI","Tableau","Data Visualization","OpenCV","Data Analysis"],
    "Cloud/DevOps": ["AWS","Azure","GCP","Docker","Kubernetes","Linux","CI/CD","Firebase","MongoDB","Terraform"],
    "Core CS": ["Data Structures & Algorithms","DBMS","Operating Systems","Networking","OWASP Top 10","Security Fundamentals"],
    "Tools": ["Git","Figma","Jira","Wireshark","Android"],
    "Soft skill": ["Communication","Leadership","Teamwork","Product Thinking","User Research","Agile"]
  };
  const ALIAS = { "reactjs":"React","react.js":"React","js":"JavaScript","node":"Node.js","nodejs":"Node.js","ml":"Machine Learning","dsa":"Data Structures & Algorithms","leetcode":"Data Structures & Algorithms","data structures":"Data Structures & Algorithms","postgres":"SQL","postgresql":"SQL","mysql":"SQL","dbms":"SQL","sklearn":"Scikit-learn","scikit":"Scikit-learn","github":"Git","powerbi":"Power BI","pivot":"Excel","probability":"Statistics","dl":"Deep Learning","k8s":"Kubernetes" };
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const has = (text, term) => new RegExp("(^|[^a-z0-9+#])" + esc(term.toLowerCase()) + "($|[^a-z0-9+#])").test(text);

  function extractSkills(text) {
    const t = (text || "").toLowerCase();
    const found = {};
    for (const [cat, list] of Object.entries(VOCAB)) for (const s of list) if (has(t, s)) found[s] = cat;
    for (const [a, s] of Object.entries(ALIAS)) if (has(t, a)) found[s] = found[s] || Object.keys(VOCAB).find(c => VOCAB[c].includes(s)) || "Tools";
    return Object.entries(found).map(([name, category]) => {
      const n = name.toLowerCase();
      const proj = /project|built|developed|intern/.test(t) && t.split(/[.\n]/).some(l => /project|built|developed|intern/.test(l) && (l.includes(n) || Object.keys(ALIAS).some(a => ALIAS[a] === name && l.includes(a))));
      return { name, category, level: proj ? 3 : 2, evidence: proj ? "Mentioned in a project" : "Mentioned in coursework/profile" };
    });
  }
  const norm = s => (ALIAS[s.toLowerCase()] || s).toLowerCase();
  function roleReq(jd) {
    const key = Object.keys(D.roles).find(r => jd.toLowerCase().includes(r.toLowerCase().split(" ")[0].toLowerCase())) || "Data Analyst Intern";
    const r = D.roles[key];
    const map = a => a.map(([skill, weight, required_level]) => ({ skill, weight, required_level }));
    return { role: key, company: null, experience_level: "Intern", must_have: map(r.must_have), good_to_have: map(r.good_to_have), soft_skills: ["Communication"], typical_tasks: ["Work on real team tasks"] };
  }
  function gap(student, req) {
    const lv = {}; (student || []).forEach(s => (lv[norm(s.name)] = s.level));
    const all = [...req.must_have.map(x => ({ ...x, w: x.weight })), ...(req.good_to_have || []).map(x => ({ ...x, w: x.weight / 2 }))];
    let num = 0, den = 0; const matched = [], partial = [], missing = [];
    all.forEach(x => {
      const l = lv[norm(x.skill)] || 0; den += x.w; num += x.w * Math.min(l / x.required_level, 1);
      if (l >= x.required_level) matched.push({ skill: x.skill, student_level: l, required_level: x.required_level });
      else if (l > 0) partial.push({ skill: x.skill, student_level: l, required_level: x.required_level, gap: x.required_level - l });
      else missing.push({ skill: x.skill, required_level: x.required_level, priority: x.weight >= 4 ? "High" : x.weight >= 3 ? "Medium" : "Low", why_it_matters: "Listed by employers for this role" });
    });
    const score = Math.round((100 * num) / (den || 1));
    return { match_score: score, readiness: score >= 80 ? "Ready" : score >= 60 ? "Almost ready" : score >= 35 ? "Developing" : "Not ready", matched, partial, missing, strengths: matched.map(m => m.skill).slice(0, 4), verdict: `Offline estimate: ${matched.length} skills matched, ${partial.length} partial, ${missing.length} missing.` };
  }
  function roadmap(gaps, weeks, hpw, role) {
    const list = (gaps || []).map(g => g.skill || g); weeks = +weeks || 6;
    const w = Array.from({ length: weeks }, (_, i) => {
      const s = list[i % Math.max(list.length, 1)] || "Portfolio project";
      return { week: i + 1, focus: s, hours: +hpw || 8, tasks: [`Learn ${s} fundamentals`, `Practice 5 exercises on ${s}`, `Apply ${s} in your capstone`], resources: [{ title: `${s} official documentation`, type: "Docs" }], milestone: `Push a ${s} mini-exercise to GitHub` };
    });
    return { plan_title: `${weeks}-week plan for ${role}`, weeks: w, capstone_project: { title: `${role} capstone`, description: "Build one end-to-end project using every gap skill.", skills_covered: list }, tips: ["Study in 2 fixed slots per week", "Share progress on LinkedIn"] };
  }
  function match(profile, internships) {
    const mine = new Set((profile.skills || []).map(s => norm(s.name || s)));
    const ranked = internships.map(i => {
      const hit = i.skills.filter(s => mine.has(norm(s)));
      return { id: i.id, fit_score: Math.round((100 * hit.length) / i.skills.length), reasons: hit.length ? [`You already have ${hit.join(", ")}`] : ["Low overlap with your current skills"], missing_skills: i.skills.filter(s => !mine.has(norm(s))), apply_tip: "Mention your most relevant project in the first line." };
    }).sort((a, b) => b.fit_score - a.fit_score).slice(0, 5);
    return { ranked };
  }
  function ats(resume, jd) {
    const jdSkills = extractSkills(jd).map(s => s.name), rs = new Set(extractSkills(resume).map(s => s.name));
    const found = jdSkills.filter(s => rs.has(s)), missing = jdSkills.filter(s => !rs.has(s));
    const keyword = Math.round((100 * found.length) / (jdSkills.length || 1));
    const impact = Math.min(100, (resume.match(/\d+%?/g) || []).length * 12);
    const structure = ["education","project","skill","experience"].filter(k => resume.toLowerCase().includes(k)).length * 25;
    const relevance = Math.round((keyword + structure) / 2);
    return { ats_score: Math.round(0.4 * keyword + 0.25 * impact + 0.2 * structure + 0.15 * relevance), breakdown: { keyword, impact, structure, relevance }, keywords_found: found, keywords_missing: missing, section_feedback: [{ section: "Overall", feedback: "Offline estimate based on keyword overlap." }], rewrite_suggestions: [] };
  }
  function curriculum(syl, role) {
    const req = roleReq(role), t = syl.toLowerCase();
    const all = [...req.must_have, ...req.good_to_have];
    const covered = all.filter(x => has(t, x.skill) || Object.keys(ALIAS).some(a => ALIAS[a] === x.skill && has(t, a)));
    const missing = all.filter(x => !covered.includes(x));
    return { alignment_score: Math.round((100 * covered.length) / all.length), covered: covered.map(c => ({ topic: c.skill, industry_relevance: "High" })), outdated_or_low_value: /hierarchical|network model|sql\*plus/.test(t) ? [{ topic: "Network/hierarchical models, SQL*Plus", reason: "Rarely used in industry today" }] : [], missing_topics: missing.map(m => ({ topic: m.skill, priority: m.weight >= 4 ? "High" : "Medium", suggested_unit: "Add as a lab", lab_idea: `Mini-lab using ${m.skill}` })), industry_tools_to_add: missing.map(m => m.skill).slice(0, 4), summary: "Offline keyword-based estimate." };
  }
  function interview(role, skills, diff, count) {
    const s = (skills || "").split(",").map(x => x.trim()).filter(Boolean);
    const qs = Array.from({ length: +count || 5 }, (_, i) => { const k = s[i % (s.length || 1)] || role; return { q: i === (+count || 5) - 1 ? `Why do you want to work as a ${role}?` : `Explain a core concept of ${k} and where you used it.`, type: i === (+count || 5) - 1 ? "HR" : "Technical", skill: k, ideal_points: ["Clear definition", "Real example", "Trade-offs"] }; });
    return { questions: qs };
  }
  function evaluate(q, points, ans) {
    const a = (ans || "").trim(); const words = a.split(/\s+/).filter(Boolean).length;
    if (words < 3) return { score: 0, rubric: { accuracy: 0, depth: 0, clarity: 0 }, covered_points: [], missed_points: points || [], feedback: "Answer is too short — please try again with a definition and an example.", improved_answer: "" };
    const depth = Math.min(3, Math.floor(words / 25) + 1), clarity = words > 15 ? 2 : 1, acc = Math.min(4, depth + 1);
    return { score: acc + depth + clarity, rubric: { accuracy: acc, depth, clarity }, covered_points: [], missed_points: [], feedback: "Offline estimate based on length/structure only.", improved_answer: "" };
  }
  window.BridgrOffline = function (id, v) {
    switch (id) {
      case "P1": { const skills = extractSkills(v.profile_text); return { name: null, degree: null, year: null, skills, projects: [], interests: [], summary: `Offline extraction found ${skills.length} skills.` }; }
      case "P2": return roleReq(v.jd_text);
      case "P3": return gap(JSON.parse(v.student_skills), JSON.parse(v.role_requirements));
      case "P4": return roadmap(JSON.parse(v.gaps), v.weeks, v.hours_per_week, v.target_role);
      case "P5": return match(JSON.parse(v.student_profile), JSON.parse(v.internships));
      case "P6": return curriculum(v.syllabus_text, v.target_role);
      case "P7": return ats(v.resume_text, v.jd_text);
      case "P8": return interview(v.role, v.skills, v.difficulty, v.count);
      case "P9": return evaluate(v.question, JSON.parse(v.ideal_points || "[]"), v.answer);
      case "P10": return { reply: "I'm in offline mode right now. Based on your profile, focus on your top gap skills from the Skill Gap page and build one project that uses them.", next_action: "Open Skill Gap and generate a roadmap." };
    }
  };
})();
