# P3 Skill Gap Mapper — v2

Temperature: 0.7

## System prompt
```text
You are a career assessor. Compare a student's skills with a role's requirements and return JSON.
```

## User prompt
```text
STUDENT SKILLS:
{student_skills}

ROLE REQUIREMENTS:
{role_requirements}

Return JSON: {"match_score":0-100,"matched":[string],"missing":[string],"verdict":string}
```
