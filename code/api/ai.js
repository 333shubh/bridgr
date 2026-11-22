// Bridgr serverless LLM endpoint (Vercel Function).
// POST /api/ai  { promptId: "P1".."P10", vars: {...} }  ->  { ok, data, model, ms }
// No API key is stored in the repo. Auth order:
//   1. GEMINI_API_KEY env var  (Google AI Studio, OpenAI-compatible endpoint)
//   2. AI_GATEWAY_API_KEY env var or Vercel OIDC token  (Vercel AI Gateway)
import { PROMPTS, fill } from "./_prompts.js";
import { VERSIONS } from "./_versions.js";

const GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

function parseJSON(text) {
  if (!text) throw new Error("empty model output");
  let t = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try { return JSON.parse(t); } catch {}
  const s = t.indexOf("{"), e = t.lastIndexOf("}");
  if (s >= 0 && e > s) return JSON.parse(t.slice(s, e + 1));
  throw new Error("model did not return JSON");
}

async function callLLM({ url, token, model, messages, temperature, strictJSON = true }) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ model, messages, temperature, ...(strictJSON ? { response_format: { type: "json_object" } } : {}) })
  });
  const body = await r.text();
  if (!r.ok) throw new Error(`${r.status}: ${body.slice(0, 200)}`);
  const j = JSON.parse(body);
  return j.choices?.[0]?.message?.content || "";
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const hasGateway = !!(process.env.AI_GATEWAY_API_KEY || req.headers["x-vercel-oidc-token"] || process.env.VERCEL_OIDC_TOKEN);
    return res.status(200).json({ ok: true, prompts: Object.keys(PROMPTS), gateway: hasGateway, gemini: !!process.env.GEMINI_API_KEY });
  }
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "POST only" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { promptId, vars = {} } = body;
  const p = PROMPTS[promptId];
  if (!p) return res.status(400).json({ ok: false, error: "unknown promptId" });

  for (const k of Object.keys(p.variables)) {
    const v = vars[k];
    if (v === undefined || v === null || (typeof v === "string" && v.length > 20000))
      return res.status(400).json({ ok: false, error: `missing or too long variable: ${k}` });
  }

  // Optional: run an older prompt version (iteration-log experiments). Default = final v3.
  const ver = body.version && VERSIONS[promptId]?.[body.version];
  const sys = ver ? ver.system : p.system;
  const messages = [
    ...(sys && sys !== "none" ? [{ role: "system", content: sys }] : []),
    { role: "user", content: fill(ver ? ver.user : p.user, vars) }
  ];
  const temperature = ver ? ver.temperature : p.temperature;
  const strictJSON = !ver || body.version !== "v1";

  const providers = [];
  if (process.env.GEMINI_API_KEY) providers.push({ url: GEMINI_URL, token: process.env.GEMINI_API_KEY, model: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Google AI Studio)" });
  const gwToken = process.env.AI_GATEWAY_API_KEY || req.headers["x-vercel-oidc-token"] || process.env.VERCEL_OIDC_TOKEN;
  if (gwToken) providers.push({ url: GATEWAY_URL, token: gwToken, model: process.env.AI_MODEL || "google/gemini-2.5-flash", label: "Gemini 2.5 Flash (Vercel AI Gateway)" });
  if (!providers.length) return res.status(503).json({ ok: false, error: "no_llm_configured" });

  const t0 = Date.now();
  const errors = [];
  for (const pr of providers) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const out = await callLLM({ ...pr, messages, temperature, strictJSON });
        let data;
        if (body.version) { try { data = parseJSON(out); } catch { data = { raw: out, json_valid: false }; } }
        else data = parseJSON(out);
        return res.status(200).json({ ok: true, data, model: pr.label, version: body.version || "v3", ms: Date.now() - t0, attempt: attempt + 1 });
      } catch (e) {
        errors.push(`${pr.label}#${attempt + 1}: ${e.message}`);
        if (/^(401|403|402)/.test(e.message)) break;
      }
    }
  }
  return res.status(502).json({ ok: false, error: "llm_failed", details: errors });
}
