// Runs the test table against the deployed API and saves real outputs.
// Usage: node scripts/run-tests.mjs [baseUrl]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const base = process.argv[2] || "https://bridgr-333shubhs-projects.vercel.app";
const cases = JSON.parse(readFileSync(join(root, "test-data", "test-cases.json"), "utf8"));
mkdirSync(join(root, "test-data", "outputs"), { recursive: true });

const results = [];
for (const c of cases) {
  const t0 = Date.now();
  let out, status;
  try {
    const r = await fetch(base + "/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ promptId: c.promptId, vars: c.vars }) });
    status = r.status; out = await r.json();
  } catch (e) { out = { ok: false, error: e.message }; }
  const res = { no: c.no, promptId: c.promptId, type: c.type, input: c.input, expected: c.expected, status, ms: Date.now() - t0, model: out.model, output: out.data ?? out };
  writeFileSync(join(root, "test-data", "outputs", `test_${String(c.no).padStart(2, "0")}_${c.promptId}.json`), JSON.stringify(res, null, 2));
  results.push(res);
  console.log(`#${c.no} ${c.promptId} ${c.type} -> ${status} ${res.ms}ms`);
}
writeFileSync(join(root, "test-data", "outputs", "_summary.json"), JSON.stringify(results.map(({ output, ...r }) => r), null, 2));
