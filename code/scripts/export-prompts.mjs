// Writes prompts/final/P*.md from code/api/_prompts.js (single source of truth).
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PROMPTS } from "../api/_prompts.js";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "prompts", "final");
mkdirSync(out, { recursive: true });
for (const p of Object.values(PROMPTS)) {
  const md = `# ${p.id} — ${p.name}

| Field | Value |
|---|---|
| Step in workflow | ${p.step} |
| Purpose | ${p.purpose} |
| Tool and model | Gemini 2.5 Flash via Vercel AI Gateway (OpenAI-compatible chat completions) |
| Settings | temperature ${p.temperature}, response_format json_object, up to 2 retries on invalid JSON |
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
`;
  writeFileSync(join(out, `${p.id}_${p.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/_+$/, "")}.md`), md);
}
console.log("exported", Object.keys(PROMPTS).length, "prompts to", out);
