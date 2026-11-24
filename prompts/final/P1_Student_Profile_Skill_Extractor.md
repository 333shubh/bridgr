# P1 — Student Profile Skill Extractor

| Field | Value |
|---|---|
| Step in workflow | Step 1 — Understand the student |
| Purpose | Turn free-text resume / profile into a structured, evidence-backed skill inventory. |
| Tool and model | Gemini 3.5 Flash via Google AI Studio (OpenAI-compatible endpoint); falls back to Gemini 3 Flash Preview, then Gemini 3.5 Flash Lite |
| Settings | temperature 0.2, response_format json_object, 2 attempts per model |
| Examples included | 1 |
| Output format | JSON object (schema in user prompt) |

## Variables
- `{profile_text}` — Raw resume or self-description pasted by the student

## System prompt
```text
You are an academic skills auditor for Indian engineering students. You extract ONLY skills that are supported by evidence in the text (courses, projects, internships, certifications). Never invent skills. Rate each skill 1-5: 1=heard of it, 2=coursework only, 3=used in a project, 4=used in multiple projects/internship, 5=expert/production. Normalise names (e.g. 'reactjs' -> 'React'). Respond with ONE valid JSON object only. No markdown, no code fences, no commentary. If the input is empty, meaningless or unrelated to careers/education, return {"error":"invalid_input","message":"<short reason>"}.
```

## User prompt template
```text
Extract the student's profile.

PROFILE TEXT:
"""{profile_text}"""

Return JSON with this exact shape:
{"name":string|null,"degree":string|null,"year":string|null,"skills":[{"name":string,"category":"Programming|Web|Data/AI|Cloud/DevOps|Core CS|Tools|Soft skill","level":1-5,"evidence":string}],"projects":[{"title":string,"tech":[string]}],"interests":[string],"summary":string}

EXAMPLE
Input: "2nd year BTech CSE. Built a todo app in React with Firebase. Did DSA in C++ (200 LeetCode)."
Output: {"name":null,"degree":"BTech CSE","year":"2nd","skills":[{"name":"React","category":"Web","level":3,"evidence":"Built todo app"},{"name":"Firebase","category":"Cloud/DevOps","level":3,"evidence":"Todo app backend"},{"name":"C++","category":"Programming","level":3,"evidence":"DSA practice"},{"name":"Data Structures & Algorithms","category":"Core CS","level":3,"evidence":"200 LeetCode problems"}],"projects":[{"title":"Todo app","tech":["React","Firebase"]}],"interests":["Web development"],"summary":"2nd-year CSE student with hands-on React and solid DSA practice."}
```

## Sample run (test #1, Gemini 3.5 Flash (Google AI Studio), 15.0 s)

Input:
```json
{
  "profile_text": "Ananya Verma, 3rd year B.Tech CSE (AI/ML specialisation), CGPA 8.4.\nCourses: Data Structures, DBMS (SQL, normalisation), Probability & Statistics, Machine Learning (theory), Python Programming.\nProjects: (1) Movie recommender in Python with Pandas and Scikit-learn (collaborative filtering, 0.82 precision@10). (2) College event website using HTML, CSS and basic JavaScript, hosted on GitHub Pages.\nCertifications: Google Data Analytics (Coursera). Solved 150 LeetCode problems in Python.\nInterests: data science, analytics, AI products. Comfortable with Excel pivot tables and Git basics."
}
```

Actual output:
```json
{
  "name": "Ananya Verma",
  "degree": "B.Tech CSE (AI/ML specialisation)",
  "year": "3rd year",
  "skills": [
    {
      "name": "Python",
      "category": "Programming",
      "level": 4,
      "evidence": "Coursework, Movie recommender project, and solved 150 LeetCode problems"
    },
    {
      "name": "Data Structures",
      "category": "Core CS",
      "level": 3,
      "evidence": "Coursework and 150 LeetCode problems"
    },
    {
      "name": "Machine Learning",
      "category": "Data/AI",
      "level": 3,
      "evidence": "Theory coursework and Movie recommender project"
    },
    {
      "name": "Pandas",
      "category": "Data/AI",
      "level": 3,
      "evidence": "Used in Movie recommender project"
    },
    {
      "name": "Scikit-learn",
      "category": "Data/AI",
      "level": 3,
      "evidence": "Used in Movie recommender project"
    },
    {
      "name": "SQL",
      "category": "Data/AI",
      "level": 2,
      "evidence": "DBMS coursework"
    },
    {
      "name": "HTML",
      "category": "Web",
      "level": 3,
      "evidence": "Built college event website"
    },
    {
      "name": "CSS",
      "category": "Web",
      "level": 3,
      "evidence": "Built college event website"
    },
    {
      "name": "JavaScript",
      "category": "Web",
      "level": 3,
      "evidence": "Built college event website"
    },
    {
      "name": "Git",
      "category": "Tools",
      "level": 3,
      "evidence": "Hosted site on GitHub Pages, comfortable with Git basics"
    },
    {
      "name": "Excel",
      "category": "Tools",
      "level": 3,
      "evidence": "Comfortable with pivot tables, completed Google Data Analytics certification"
    }
  ],
  "projects": [
    {
      "title": "Movie recommender",
      "tech": [
        "Python",
        "Pandas",
        "Scikit-learn"
      ]
    },
    {
      "title": "College event website",
      "tech": [
        "HTML",
        "CSS",
        "JavaScript",
        "GitHub Pages"
      ]
    }
  ],
  "interests": [
    "data science",
    "analytics",
    "AI products"
  ],
  "summary": "3rd-year B.Tech CSE (AI/ML) student with a strong background in Python, machine learning projects, data analytics certification, and web development fundamentals."
}
```
