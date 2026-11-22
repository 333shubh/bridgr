# P3 — Skill Gap Mapper

| Field | Value |
|---|---|
| Step in workflow | Step 3 — Compare student vs industry (core) |
| Purpose | Compare the structured student profile with role requirements and produce a scored, explainable gap map. |
| Tool and model | Gemini 2.5 Flash via Vercel AI Gateway (OpenAI-compatible chat completions) |
| Settings | temperature 0.1, response_format json_object, up to 2 retries on invalid JSON |
| Examples included | 1 |
| Output format | JSON object (schema in user prompt) |

## Variables
- `{student_skills}` — JSON array of student skills from P1 (name, level)
- `{role_requirements}` — JSON object from P2 (must_have, good_to_have)

## System prompt
```text
You are a fair, strict career assessor. Compare a student's skills with a role's requirements. Treat obvious synonyms as the same skill (JS = JavaScript, ML = Machine Learning, Postgres = SQL). Rules: matched = student level >= required_level; partial = student has it but below required_level; missing = not present. match_score = round(100 * sum(weight*min(student_level/required_level,1)) / sum(weight)) over must_have and good_to_have (good_to_have weights halved). Be honest — do not inflate scores. Respond with ONE valid JSON object only. No markdown, no code fences, no commentary. If the input is empty, meaningless or unrelated to careers/education, return {"error":"invalid_input","message":"<short reason>"}.
```

## User prompt template
```text
STUDENT SKILLS (JSON):
{student_skills}

ROLE REQUIREMENTS (JSON):
{role_requirements}

Return JSON:
{"match_score":0-100,"readiness":"Not ready|Developing|Almost ready|Ready","matched":[{"skill":string,"student_level":number,"required_level":number}],"partial":[{"skill":string,"student_level":number,"required_level":number,"gap":number}],"missing":[{"skill":string,"required_level":number,"priority":"High|Medium|Low","why_it_matters":string}],"strengths":[string],"verdict":string}

EXAMPLE: student [{"name":"Python","level":3}] vs must_have [{"skill":"Python","weight":5,"required_level":3},{"skill":"SQL","weight":4,"required_level":3}] -> {"match_score":56,"readiness":"Developing","matched":[{"skill":"Python","student_level":3,"required_level":3}],"partial":[],"missing":[{"skill":"SQL","required_level":3,"priority":"High","why_it_matters":"Every analyst query starts in SQL"}],"strengths":["Python fundamentals"],"verdict":"Good Python base; SQL is the single biggest gap."}
```
