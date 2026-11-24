// Bridgr serverless LLM endpoint (Vercel Function).
// POST /api/ai  { promptId: "P1".."P10", vars: {...} }  ->  { ok, data, model, ms }
// No API key is stored in the repo. Auth order:
//   1. GEMINI_API_KEY env var  (Google AI Studio, OpenAI-compatible endpoint)
//   2. AI_GATEWAY_API_KEY env var or Vercel OIDC token  (Vercel AI Gateway)
import { PROMPTS, fill } from "./_prompts.js";
import { VERSIONS } from "./_versions.js";

const GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
// gemini-2.5-flash is closed to new AI Studio keys. GEMINI_MODEL may list several models (comma-separated);
// each is tried in order, so a 503 "high demand" or a used-up free-tier quota on one falls through to the next.
const GEMINI_MODELS = (process.env.GEMINI_MODEL || "gemini-3.5-flash,gemini-3-flash-preview,gemini-3.5-flash-lite").split(",").map(s => s.trim()).filter(Boolean);
const GEMINI_MODEL = GEMINI_MODELS[0];
const GATEWAY_MODEL = process.env.AI_MODEL || "google/gemini-3.5-flash";
const pretty = m => m.replace(/^.*\//, "").replace(/^gemini-/, "Gemini ").replace(/-flash/, " Flash").replace(/-pro/, " Pro").replace(/-lite/, " Lite").replace(/-preview/, " Preview");

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
    return res.status(200).json({ ok: true, prompts: Object.keys(PROMPTS), gateway: hasGateway, gemini: !!process.env.GEMINI_API_KEY, model: pretty(process.env.GEMINI_API_KEY ? GEMINI_MODEL : GATEWAY_MODEL) });
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
  if (process.env.GEMINI_API_KEY) for (const m of GEMINI_MODELS) providers.push({ url: GEMINI_URL, token: process.env.GEMINI_API_KEY, model: m, label: `${pretty(m)} (Google AI Studio)` });
  const gwToken = process.env.AI_GATEWAY_API_KEY || req.headers["x-vercel-oidc-token"] || process.env.VERCEL_OIDC_TOKEN;
  if (gwToken) providers.push({ url: GATEWAY_URL, token: gwToken, model: GATEWAY_MODEL, label: `${pretty(GATEWAY_MODEL)} (Vercel AI Gateway)` });
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
        if (/^(401|403|402|404|429)/.test(e.message)) break;
        if (/^(429|500|502|503)/.test(e.message)) await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
      }
    }
  }
  return res.status(502).json({ ok: false, error: "llm_failed", details: errors });
}
