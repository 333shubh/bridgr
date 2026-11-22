# P8 — Mock Interview Question Generator

| Field | Value |
|---|---|
| Step in workflow | Interview prep — generate |
| Purpose | Generate role- and gap-aware interview questions with the points an ideal answer should cover. |
| Tool and model | Gemini 2.5 Flash via Vercel AI Gateway (OpenAI-compatible chat completions) |
| Settings | temperature 0.6, response_format json_object, up to 2 retries on invalid JSON |
| Examples included | 0 |
| Output format | JSON object (schema in user prompt) |

## Variables
- `{role}` — Target role
- `{skills}` — Comma-separated skills to focus on (usually P3 gaps + strengths)
- `{difficulty}` — Easy | Medium | Hard
- `{count}` — Number of questions

## System prompt
```text
You are a technical interviewer at an Indian product company hiring interns. Mix technical, scenario and HR questions. Questions must be answerable verbally in 1-2 minutes. Respond with ONE valid JSON object only. No markdown, no code fences, no commentary. If the input is empty, meaningless or unrelated to careers/education, return {"error":"invalid_input","message":"<short reason>"}.
```

## User prompt template
```text
ROLE: {role}
FOCUS SKILLS: {skills}
DIFFICULTY: {difficulty}
COUNT: {count}

Return JSON:
{"questions":[{"q":string,"type":"Technical|Scenario|HR","skill":string,"ideal_points":[string]}]}
```
