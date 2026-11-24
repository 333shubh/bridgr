# P5 — Internship Fit Ranker

| Field | Value |
|---|---|
| Step in workflow | Step 5 — Match to real internships |
| Purpose | Rank available internships for one student with transparent reasons and missing skills. |
| Tool and model | Gemini 3.5 Flash via Google AI Studio (OpenAI-compatible endpoint); falls back to Gemini 3 Flash Preview, then Gemini 3.5 Flash Lite |
| Settings | temperature 0.2, response_format json_object, 2 attempts per model |
| Examples included | 0 |
| Output format | JSON object (schema in user prompt) |

## Variables
- `{student_profile}` — Compact JSON of student skills and interests
- `{internships}` — JSON array of open internships (id, title, company, skills, location, stipend)

## System prompt
```text
You are an internship placement officer. Rank internships by realistic fit for THIS student, not by prestige. fit_score 0-100 must reflect skill overlap first, interests second. Give concrete reasons that cite the student's actual skills. Only use internship ids that exist in the input. Respond with ONE valid JSON object only. No markdown, no code fences, no commentary. If the input is empty, meaningless or unrelated to careers/education, return {"error":"invalid_input","message":"<short reason>"}.
```

## User prompt template
```text
STUDENT:
{student_profile}

OPEN INTERNSHIPS:
{internships}

Return JSON (top 5, best first):
{"ranked":[{"id":string,"fit_score":0-100,"reasons":[string],"missing_skills":[string],"apply_tip":string}]}
```

## Sample run (test #9, Gemini 3.5 Flash (Google AI Studio), 29.9 s)

Input:
```json
{
  "student_profile": "{\"skills\":[\"Python:3\",\"SQL:3\",\"Excel:3\",\"Pandas:3\"],\"interests\":[\"analytics\"]}",
  "internships": "[{\"id\":\"IN01\",\"title\":\"Data Analyst Intern\",\"skills\":[\"SQL\",\"Excel\",\"Python\",\"Power BI\"]},{\"id\":\"IN12\",\"title\":\"Android Developer Intern\",\"skills\":[\"Kotlin\",\"Android\"]},{\"id\":\"IN10\",\"title\":\"BI Intern\",\"skills\":[\"Tableau\",\"SQL\",\"Excel\"]},{\"id\":\"IN05\",\"title\":\"DevOps Intern\",\"skills\":[\"AWS\",\"Linux\",\"Docker\"]}]"
}
```

Actual output:
```json
{
  "ranked": [
    {
      "id": "IN01",
      "fit_score": 95,
      "reasons": [
        "Matches 3 out of 4 required skills: SQL, Excel, and Python.",
        "Directly aligns with the student's interest in analytics."
      ],
      "missing_skills": [
        "Power BI"
      ],
      "apply_tip": "Highlight experience using Python and Pandas for data manipulation and analytics projects."
    },
    {
      "id": "IN10",
      "fit_score": 75,
      "reasons": [
        "Strong skill match with SQL and Excel.",
        "Fits the student's interest in business analytics."
      ],
      "missing_skills": [
        "Tableau"
      ],
      "apply_tip": "Emphasize SQL data extraction skills and express eagerness to learn Tableau dashboarding."
    },
    {
      "id": "IN05",
      "fit_score": 15,
      "reasons": [
        "No overlap with current Python/SQL data stack.",
        "Role focuses on infrastructure rather than analytics."
      ],
      "missing_skills": [
        "AWS",
        "Linux",
        "Docker"
      ],
      "apply_tip": "Build foundational knowledge in Linux and cloud platforms before applying for DevOps roles."
    },
    {
      "id": "IN12",
      "fit_score": 10,
      "reasons": [
        "Requires mobile development skills outside the student's data analytics profile."
      ],
      "missing_skills": [
        "Kotlin",
        "Android"
      ],
      "apply_tip": "Focus on software engineering fundamentals and Java/Kotlin if pivoting to mobile development."
    }
  ]
}
```
