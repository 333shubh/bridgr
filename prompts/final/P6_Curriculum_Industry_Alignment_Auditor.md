# P6 — Curriculum–Industry Alignment Auditor

| Field | Value |
|---|---|
| Step in workflow | Institution view — audit the syllabus |
| Purpose | Score how well a course syllabus prepares students for a target industry role and suggest additions. |
| Tool and model | Gemini 3.5 Flash via Google AI Studio (OpenAI-compatible endpoint); falls back to Gemini 3 Flash Preview, then Gemini 3.5 Flash Lite |
| Settings | temperature 0.3, response_format json_object, 2 attempts per model |
| Examples included | 0 |
| Output format | JSON object (schema in user prompt) |

## Variables
- `{syllabus_text}` — Course units / syllabus pasted by faculty
- `{target_role}` — Industry role the course should feed into

## System prompt
```text
You are an academic-industry alignment consultant (think AICTE + NASSCOM FutureSkills). Compare a syllabus with current (2025-26) industry expectations for the target role. Be specific: name the unit where a missing topic could be added. Flag outdated topics politely. Respond with ONE valid JSON object only. No markdown, no code fences, no commentary. If the input is empty, meaningless or unrelated to careers/education, return {"error":"invalid_input","message":"<short reason>"}.
```

## User prompt template
```text
TARGET ROLE: {target_role}
SYLLABUS:
"""{syllabus_text}"""

Return JSON:
{"alignment_score":0-100,"covered":[{"topic":string,"industry_relevance":"High|Medium|Low"}],"outdated_or_low_value":[{"topic":string,"reason":string}],"missing_topics":[{"topic":string,"priority":"High|Medium|Low","suggested_unit":string,"lab_idea":string}],"industry_tools_to_add":[string],"summary":string}
```

## Sample run (test #10, Gemini 3.5 Flash (Google AI Studio), 10.7 s)

Input:
```json
{
  "syllabus_text": "Course: Database Management Systems (B.Tech CSE Sem 4)\nUnit 1: Introduction, file systems vs DBMS, ER model, network & hierarchical models.\nUnit 2: Relational model, relational algebra, tuple calculus.\nUnit 3: SQL — DDL, DML, joins, sub-queries, views.\nUnit 4: Normalisation 1NF–BCNF, functional dependencies.\nUnit 5: Transactions, ACID, concurrency control, recovery.\nLab: Oracle SQL*Plus exercises.",
  "target_role": "Data Analyst Intern"
}
```

Actual output:
```json
{
  "alignment_score": 62,
  "covered": [
    {
      "topic": "SQL Fundamentals (DDL, DML, Joins, Sub-queries, Views)",
      "industry_relevance": "High"
    },
    {
      "topic": "ER Modeling & Relational Schema Design",
      "industry_relevance": "High"
    },
    {
      "topic": "Database Normalization (1NF–BCNF)",
      "industry_relevance": "Medium"
    }
  ],
  "outdated_or_low_value": [
    {
      "topic": "Network & Hierarchical Models",
      "reason": "Legacy database models that are obsolete in modern analytics pipelines."
    },
    {
      "topic": "Oracle SQL*Plus Interface",
      "reason": "Command-line tool outdated for practical data analysis; modern workflows prefer GUI IDEs or cloud workspaces."
    },
    {
      "topic": "Tuple Relational Calculus",
      "reason": "Excessively academic for applied data analyst positions which favor practical SQL query writing."
    }
  ],
  "missing_topics": [
    {
      "topic": "Advanced SQL: Window Functions & CTEs",
      "priority": "High",
      "suggested_unit": "Unit 3: SQL",
      "lab_idea": "Calculate rolling averages, dense ranks, and period-over-period growth using OVER(), PARTITION BY, and WITH clauses."
    },
    {
      "topic": "Data Transformation & Cleaning in SQL",
      "priority": "High",
      "suggested_unit": "Unit 3: SQL",
      "lab_idea": "Clean messy raw data using SQL string functions, COALESCE, CASE statements, and date-time formatting functions."
    },
    {
      "topic": "OLAP vs OLTP & Data Warehousing Concepts",
      "priority": "Medium",
      "suggested_unit": "Unit 1: Introduction",
      "lab_idea": "Query a star-schema analytical dataset (fact and dimension tables) and compare execution performance against normalized tables."
    }
  ],
  "industry_tools_to_add": [
    "PostgreSQL",
    "Snowflake or Google BigQuery",
    "DBeaver",
    "Python (Pandas / SQLAlchemy)",
    "Power BI / Tableau (for database connectivity)"
  ],
  "summary": "The syllabus offers strong foundational relational database concepts, but falls short of modern Data Analyst expectations. To better prepare students for 2025-26 analyst internships, the SQL unit must be upgraded to cover window functions and CTEs, and the practical lab environment should transition from SQL*Plus to PostgreSQL or cloud analytical platforms."
}
```
