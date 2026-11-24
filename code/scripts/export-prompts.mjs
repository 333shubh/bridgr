// Writes prompts/final/P*.md from code/api/_prompts.js (single source of truth).
import { writeFileSync, mkdirSync, readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PROMPTS } from "../api/_prompts.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const out = join(root, "prompts", "final");
// One real sample run per prompt, taken from the saved test outputs (test-data/outputs).
const SAMPLE = { P1: 1, P2: 4, P3: 6, P4: 8, P5: 9, P6: 10, P7: 11, P8: 12, P9: 13, P10: 15 };
const outDir = join(root, "test-data", "outputs");
const cases = JSON.parse(readFileSync(join(root, "test-data", "test-cases.json"), "utf8"));
function sample(id) {
  const no = SAMPLE[id]; if (!no || !existsSync(outDir)) return "";
  const f = readdirSync(outDir).find(x => x.startsWith(`test_${String(no).padStart(2, "0")}_`)); if (!f) return "";
  const r = JSON.parse(readFileSync(join(outDir, f), "utf8")); const c = cases.find(x => x.no === no);
  return `
## Sample run (test #${no}, ${r.model}, ${(r.ms / 1000).toFixed(1)} s)

Input:
\`\`\`json
${JSON.stringify(c.vars, null, 2)}
\`\`\`

Actual output:
\`\`\`json
${JSON.stringify(r.output, null, 2)}
\`\`\`
`;
}
mkdirSync(out, { recursive: true });
for (const p of Object.values(PROMPTS)) {
  const md = `# ${p.id} — ${p.name}

| Field | Value |
|---|---|
| Step in workflow | ${p.step} |
| Purpose | ${p.purpose} |
| Tool and model | Gemini 3.5 Flash via Google AI Studio (OpenAI-compatible endpoint); falls back to Gemini 3 Flash Preview, then Gemini 3.5 Flash Lite |
| Settings | temperature ${p.temperature}, response_format json_object, 2 attempts per model |
| Examples included | ${p.examples} |
| Output format | JSON object (schema in user prompt) |

## Variables
${Object.entries(p.variables).map(([k, v]) => `- \`{${k}}\` — ${v}`).join("\n")}

## System prompt
\`\`\`text
${p.system}
\`\`\`

## User prompt template
\`\`\`text
${p.user}
\`\`\`
${sample(p.id)}`;
  writeFileSync(join(out, `${p.id}_${p.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/_+$/, "")}.md`), md);
}
console.log("exported", Object.keys(PROMPTS).length, "prompts to", out);
