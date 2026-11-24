// Iteration-log experiment: runs v1, v2, v3 of P3 and P9 on the same input N times
// and records JSON validity and score spread. Usage: node scripts/compare-versions.mjs [baseUrl] [runs]
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const base = process.argv[2] || "https://bridgr-rose.vercel.app";
const N = +(process.argv[3] || 5);
const ONLY = (process.argv[4] || "P3,P9").split(",");
const inputs = {
  P3: { student_skills: '[{"name":"Python","level":3},{"name":"SQL","level":2},{"name":"Pandas","level":3},{"name":"Excel","level":2}]', role_requirements: '{"must_have":[{"skill":"SQL","weight":5,"required_level":3},{"skill":"Excel","weight":4,"required_level":3},{"skill":"Python","weight":4,"required_level":3},{"skill":"Statistics","weight":4,"required_level":3}],"good_to_have":[{"skill":"Power BI","weight":3,"required_level":2}]}' },
  P9: { question: "What is the difference between WHERE and HAVING in SQL?", ideal_points: '["WHERE filters rows before grouping","HAVING filters groups after GROUP BY","HAVING can use aggregates"]', answer: "idk" }
};
const scoreOf = (id, d) => (id === "P3" ? d.match_score : d.score);
const report = [];
for (const id of ONLY) for (const version of ["v1", "v2", "v3"]) {
  const scores = []; let valid = 0; const samples = []; let model = null;
  for (let i = 0; i < N; i++) {
    const r = await fetch(base + "/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ promptId: id, vars: inputs[id], version: version === "v3" ? undefined : version }) }).then(x => x.json()).catch(e => ({ ok: false, error: e.message }));
    const d = r.data || {}; model = r.model || model;
    if (r.ok && d.json_valid !== false) { valid++; const s = scoreOf(id, d); if (typeof s === "number") scores.push(s); }
    samples.push(r.data ?? r);
  }
  const row = { prompt: id, version, model, runs: N, ok_calls: samples.filter(x => !x.error).length, json_valid: valid, scores, min: Math.min(...scores), max: Math.max(...scores) };
  report.push(row); console.log(JSON.stringify(row));
  mkdirSync(join(root, "test-data", "versions"), { recursive: true });
  writeFileSync(join(root, "test-data", "versions", `${id}_${version}.json`), JSON.stringify({ ...row, samples }, null, 2));
}
writeFileSync(join(root, "test-data", "versions", `_summary_${ONLY.join("_")}.json`), JSON.stringify(report, null, 2));
