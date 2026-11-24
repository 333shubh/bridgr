# P8 — Mock Interview Question Generator

| Field | Value |
|---|---|
| Step in workflow | Interview prep — generate |
| Purpose | Generate role- and gap-aware interview questions with the points an ideal answer should cover. |
| Tool and model | Gemini 3.5 Flash via Google AI Studio (OpenAI-compatible endpoint); falls back to Gemini 3 Flash Preview, then Gemini 3.5 Flash Lite |
| Settings | temperature 0.6, response_format json_object, 2 attempts per model |
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

## Sample run (test #12, Gemini 3.5 Flash (Google AI Studio), 35.3 s)

Input:
```json
{
  "role": "Data Analyst Intern",
  "skills": "SQL, Statistics",
  "difficulty": "Medium",
  "count": "3"
}
```

Actual output:
```json
{
  "questions": [
    {
      "q": "What is the key difference between the RANK() and DENSE_RANK() window functions in SQL? Could you provide a scenario where DENSE_RANK() would be preferred?",
      "type": "Technical",
      "skill": "SQL",
      "ideal_points": [
        "RANK() leaves gaps in ranking numbers when there are ties, whereas DENSE_RANK() assigns consecutive ranks without gaps.",
        "Example: Determining top 3 scores in a test where tied scores should not skip the next rank position."
      ]
    },
    {
      "q": "Imagine you ran an A/B test for a product feature change and obtained a p-value of 0.03. How would you explain what this p-value means to a non-technical Product Manager?",
      "type": "Scenario",
      "skill": "Statistics",
      "ideal_points": [
        "Explain p-value as the probability of seeing these results purely by random chance assuming no real difference.",
        "Compare 0.03 against the standard 0.05 threshold to indicate statistical significance.",
        "Translate statistical confidence into a clear business recommendation without excessive jargon."
      ]
    },
    {
      "q": "Describe a project where you encountered dirty or incomplete data. How did you identify the issues and ensure your final analysis remained accurate?",
      "type": "HR",
      "skill": "Problem Solving",
      "ideal_points": [
        "Methods used to detect data quality issues (e.g., missing values, outliers, duplicate checks).",
        "Steps taken to clean or handle missing data appropriately.",
        "Documentation of assumptions and proactive communication with stakeholders."
      ]
    }
  ],
  "error": null
}
```
