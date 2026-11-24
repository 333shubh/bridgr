# P7 — ATS Resume Scorer

| Field | Value |
|---|---|
| Step in workflow | Application step — polish the resume |
| Purpose | Score a resume against a job description like an ATS and give keyword + rewrite feedback. |
| Tool and model | Gemini 3.5 Flash via Google AI Studio (OpenAI-compatible endpoint); falls back to Gemini 3 Flash Preview, then Gemini 3.5 Flash Lite |
| Settings | temperature 0.2, response_format json_object, 2 attempts per model |
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

## Sample run (test #11, Gemini 3.5 Flash (Google AI Studio), 23.6 s)

Input:
```json
{
  "resume_text": "Ananya Verma — B.Tech CSE. Skills: Python, Pandas, Scikit-learn, SQL, Excel, Git. Projects: Movie recommender (0.82 precision@10). College event website (HTML/CSS/JS). Education: CGPA 8.4.",
  "jd_text": "Data Analyst Intern: strong SQL, Excel, Python, statistics; Power BI or Tableau; A/B testing."
}
```

Actual output:
```json
{
  "ats_score": 55,
  "breakdown": {
    "keyword": 45,
    "impact": 60,
    "structure": 60,
    "relevance": 65
  },
  "keywords_found": [
    "Python",
    "SQL",
    "Excel"
  ],
  "keywords_missing": [
    "statistics",
    "Power BI",
    "Tableau",
    "A/B testing"
  ],
  "section_feedback": [
    {
      "section": "Skills",
      "feedback": "Includes core technical tools like Python, SQL, and Excel, but missing key requirements like statistics, Power BI/Tableau, and A/B testing."
    },
    {
      "section": "Projects",
      "feedback": "Movie recommender project includes a metric (precision@10 of 0.82), but needs clearer context on tools used (e.g., Pandas/SQL) and business application."
    },
    {
      "section": "Education",
      "feedback": "Degree and CGPA are clearly stated, but could benefit from listing relevant coursework such as Statistics or Database Management."
    }
  ],
  "rewrite_suggestions": [
    {
      "before": "Movie recommender (0.82 precision@10).",
      "after": "Developed a movie recommendation system using Python and Pandas, achieving a 0.82 precision@10 metric."
    },
    {
      "before": "College event website (HTML/CSS/JS).",
      "after": "Designed and developed a responsive college event website using HTML, CSS, and JavaScript."
    }
  ]
}
```
