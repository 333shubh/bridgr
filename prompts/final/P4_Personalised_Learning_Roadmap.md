# P4 — Personalised Learning Roadmap

| Field | Value |
|---|---|
| Step in workflow | Step 4 — Close the gap |
| Purpose | Turn missing/partial skills into a realistic week-by-week plan within the student's time budget. |
| Tool and model | Gemini 3.5 Flash via Google AI Studio (OpenAI-compatible endpoint); falls back to Gemini 3 Flash Preview, then Gemini 3.5 Flash Lite |
| Settings | temperature 0.4, response_format json_object, 2 attempts per model |
| Examples included | 0 |
| Output format | JSON object (schema in user prompt) |

## Variables
- `{gaps}` — JSON list of missing + partial skills from P3
- `{weeks}` — Number of weeks available (e.g. 6)
- `{hours_per_week}` — Study hours per week (e.g. 8)
- `{target_role}` — Role the student is preparing for

## System prompt
```text
You are a pragmatic mentor who designs study plans for busy college students. Prioritise High-priority gaps first. Every week must fit inside the hour budget and end with a verifiable milestone (something built or submitted). Prefer free resources (official docs, freeCodeCamp, NPTEL, Kaggle Learn, CS50, YouTube channels). Respond with ONE valid JSON object only. No markdown, no code fences, no commentary. If the input is empty, meaningless or unrelated to careers/education, return {"error":"invalid_input","message":"<short reason>"}.
```

## User prompt template
```text
TARGET ROLE: {target_role}
TIME: {weeks} weeks x {hours_per_week} hours/week
GAPS (JSON):
{gaps}

Return JSON:
{"plan_title":string,"weeks":[{"week":number,"focus":string,"hours":number,"tasks":[string],"resources":[{"title":string,"type":"Docs|Course|Video|Practice"}],"milestone":string}],"capstone_project":{"title":string,"description":string,"skills_covered":[string]},"tips":[string]}
```

## Sample run (test #8, Gemini 3.5 Flash (Google AI Studio), 36.9 s)

Input:
```json
{
  "gaps": "[{\"skill\":\"SQL\",\"priority\":\"High\"},{\"skill\":\"Power BI\",\"priority\":\"Medium\"}]",
  "weeks": "4",
  "hours_per_week": "6",
  "target_role": "Data Analyst Intern"
}
```

Actual output:
```json
{
  "plan_title": "4-Week Data Analyst Intern Prep: SQL & Power BI",
  "weeks": [
    {
      "week": 1,
      "focus": "SQL Fundamentals & Data Aggregation",
      "hours": 6,
      "tasks": [
        "Master SELECT, WHERE, ORDER BY, and basic operators",
        "Practice grouping data with GROUP BY and filtering with HAVING",
        "Set up PostgreSQL/MySQL local environment or practice online"
      ],
      "resources": [
        {
          "title": "SQLBolt - Interactive SQL Tutorials",
          "type": "Practice"
        },
        {
          "title": "Kaggle Learn: Intro to SQL",
          "type": "Course"
        }
      ],
      "milestone": "Solve and publish solutions for 15 foundational SQL practice queries on GitHub."
    },
    {
      "week": 2,
      "focus": "Advanced SQL: Joins, CTEs & Window Functions",
      "hours": 6,
      "tasks": [
        "Master INNER, LEFT, RIGHT, and FULL JOINs across multiple tables",
        "Write Common Table Expressions (CTEs) and Subqueries for complex logic",
        "Apply Window Functions like ROW_NUMBER, RANK, and SUM OVER"
      ],
      "resources": [
        {
          "title": "Mode Analytics SQL Tutorial",
          "type": "Docs"
        },
        {
          "title": "Danny Ma's 8 Week SQL Challenge (Danny's Diner)",
          "type": "Practice"
        }
      ],
      "milestone": "Complete 'Danny's Diner' SQL Case Study with documented query files in a repository."
    },
    {
      "week": 3,
      "focus": "Power BI Data Preparation & DAX Basics",
      "hours": 6,
      "tasks": [
        "Import CSV and SQL dataset into Power BI Desktop",
        "Clean and shape data using Power Query Editor (pivoting, types, conditional columns)",
        "Learn basic DAX measures (SUM, CALCULATE, COUNTROWS, AVERAGE)"
      ],
      "resources": [
        {
          "title": "Microsoft Learn: Get started building with Power BI",
          "type": "Docs"
        },
        {
          "title": "Power BI Full Course for Beginners - Guy in a Cube",
          "type": "Video"
        }
      ],
      "milestone": "Build a 1-page interactive Power BI report with 3 DAX calculated measures and cross-filtering."
    },
    {
      "week": 4,
      "focus": "End-to-End Dashboard Design & Portfolio Polish",
      "hours": 6,
      "tasks": [
        "Structure executive KPI cards, charts, and drill-through filters in Power BI",
        "Optimize visual layout, accessibility, and color palette for stakeholders",
        "Prepare a project presentation write-up explaining data insights"
      ],
      "resources": [
        {
          "title": "Storytelling with Data Principles",
          "type": "Docs"
        },
        {
          "title": "Power BI Documentation: Visualizations",
          "type": "Docs"
        }
      ],
      "milestone": "Publish completed interactive Capstone Dashboard with a comprehensive GitHub README."
    }
  ],
  "capstone_project": {
    "title": "E-Commerce Executive Sales & Customer Insights Dashboard",
    "description": "Extract and transform e-commerce transaction data using advanced SQL queries (CTEs, Joins, Aggregations), load it into Power BI, create custom DAX metrics, and build an interactive 2-page dashboard highlighting sales performance and customer retention insights.",
    "skills_covered": [
      "SQL",
      "Power Query",
      "DAX",
      "Data Visualization",
      "Dashboard Design"
    ]
  },
  "tips": [
    "Study for 1 hour per day over 6 days each week to maximize memory retention over weekend cramming.",
    "Keep all code and visuals documented inside a GitHub repository to showcase to potential interviewers.",
    "Focus on explaining the business narrative behind your charts, not just the technical steps used to build them."
  ]
}
```
