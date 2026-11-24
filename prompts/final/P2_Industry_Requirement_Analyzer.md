# P2 — Industry Requirement Analyzer

| Field | Value |
|---|---|
| Step in workflow | Step 2 — Understand the industry role |
| Purpose | Convert a job / internship description into weighted, structured skill requirements. |
| Tool and model | Gemini 3.5 Flash via Google AI Studio (OpenAI-compatible endpoint); falls back to Gemini 3 Flash Preview, then Gemini 3.5 Flash Lite |
| Settings | temperature 0.2, response_format json_object, 2 attempts per model |
| Examples included | 0 |
| Output format | JSON object (schema in user prompt) |

## Variables
- `{jd_text}` — Job or internship description, or just a role title such as 'Data Analyst Intern'

## System prompt
```text
You are an industry hiring analyst who has read thousands of Indian tech internship postings. Given a job description (or only a role title), list what employers actually require. Weight each skill 1-5 by importance (5 = deal-breaker). required_level uses the same 1-5 proficiency scale as the student profile. If only a title is given, use typical 2025-26 market expectations for an intern/fresher. Respond with ONE valid JSON object only. No markdown, no code fences, no commentary. If the input is empty, meaningless or unrelated to careers/education, return {"error":"invalid_input","message":"<short reason>"}.
```

## User prompt template
```text
JOB DESCRIPTION OR ROLE:
"""{jd_text}"""

Return JSON:
{"role":string,"company":string|null,"experience_level":"Intern|Fresher|Junior","must_have":[{"skill":string,"weight":1-5,"required_level":1-5}],"good_to_have":[{"skill":string,"weight":1-5,"required_level":1-5}],"soft_skills":[string],"typical_tasks":[string]}
Give 5-9 must_have and 3-6 good_to_have skills.
```

## Sample run (test #4, Gemini 3.5 Flash (Google AI Studio), 14.9 s)

Input:
```json
{
  "jd_text": "We are hiring a Data Analyst Intern (6 months, Bengaluru). You will write SQL queries on our PostgreSQL warehouse, build dashboards in Power BI, clean data with Python (Pandas), run A/B test analysis and present insights to product managers. Must have: strong SQL, Excel, Python, basic statistics (hypothesis testing). Good to have: Power BI or Tableau, dbt, communication skills."
}
```

Actual output:
```json
{
  "role": "Data Analyst Intern",
  "company": null,
  "experience_level": "Intern",
  "must_have": [
    {
      "skill": "SQL",
      "weight": 5,
      "required_level": 4
    },
    {
      "skill": "Python",
      "weight": 4,
      "required_level": 3
    },
    {
      "skill": "Pandas",
      "weight": 4,
      "required_level": 3
    },
    {
      "skill": "Microsoft Excel",
      "weight": 4,
      "required_level": 3
    },
    {
      "skill": "Hypothesis Testing",
      "weight": 4,
      "required_level": 3
    },
    {
      "skill": "A/B Testing Analysis",
      "weight": 3,
      "required_level": 2
    }
  ],
  "good_to_have": [
    {
      "skill": "Power BI",
      "weight": 3,
      "required_level": 3
    },
    {
      "skill": "Tableau",
      "weight": 2,
      "required_level": 2
    },
    {
      "skill": "dbt",
      "weight": 2,
      "required_level": 2
    },
    {
      "skill": "PostgreSQL",
      "weight": 3,
      "required_level": 3
    }
  ],
  "soft_skills": [
    "Communication Skills",
    "Presentation Skills",
    "Analytical Thinking",
    "Stakeholder Interaction"
  ],
  "typical_tasks": [
    "Write SQL queries on PostgreSQL warehouse to extract and analyze data",
    "Clean and manipulate datasets using Python and Pandas",
    "Build and maintain dashboards in Power BI",
    "Analyze A/B test results and evaluate key performance metrics",
    "Present data insights and actionable recommendations to product managers"
  ]
}
```
