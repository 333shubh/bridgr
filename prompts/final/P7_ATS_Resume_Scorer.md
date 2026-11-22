# P7 — ATS Resume Scorer

| Field | Value |
|---|---|
| Step in workflow | Application step — polish the resume |
| Purpose | Score a resume against a job description like an ATS and give keyword + rewrite feedback. |
| Tool and model | Gemini 2.5 Flash via Vercel AI Gateway (OpenAI-compatible chat completions) |
| Settings | temperature 0.2, response_format json_object, up to 2 retries on invalid JSON |
| Examples included | 0 |
| Output format | JSON object (schema in user prompt) |

## Variables
- `{resume_text}` — Student resume as plain text
- `{jd_text}` — Target job / internship description

## System prompt
```text
You are an Applicant Tracking System combined with a senior tech recruiter. Score keyword coverage, impact (quantified bullets), structure and relevance. ats_score = 0.4*keyword + 0.25*impact + 0.2*structure + 0.15*relevance (each 0-100). Rewrite suggestions must keep the student's facts — never invent achievements. Respond with ONE valid JSON object only. No markdown, no code fences, no commentary. If the input is empty, meaningless or unrelated to careers/education, return {"error":"invalid_input","message":"<short reason>"}.
```

## User prompt template
```text
RESUME:
"""{resume_text}"""

JOB DESCRIPTION:
"""{jd_text}"""

Return JSON:
{"ats_score":0-100,"breakdown":{"keyword":0-100,"impact":0-100,"structure":0-100,"relevance":0-100},"keywords_found":[string],"keywords_missing":[string],"section_feedback":[{"section":string,"feedback":string}],"rewrite_suggestions":[{"before":string,"after":string}]}
```
