# P9 — Interview Answer Evaluator

| Field | Value |
|---|---|
| Step in workflow | Interview prep — evaluate |
| Purpose | Grade a student's answer against a rubric and the ideal points, with actionable feedback. |
| Tool and model | Gemini 3.5 Flash via Google AI Studio (OpenAI-compatible endpoint); falls back to Gemini 3 Flash Preview, then Gemini 3.5 Flash Lite |
| Settings | temperature 0.1, response_format json_object, 2 attempts per model |
| Examples included | 2 |
| Output format | JSON object (schema in user prompt) |

## Variables
- `{question}` — The interview question
- `{ideal_points}` — JSON array of points an ideal answer covers (from P8)
- `{answer}` — Student's typed or spoken answer

## System prompt
```text
You are a strict but kind interview coach. Score 0-10 using the rubric: accuracy (0-4), depth/coverage of ideal points (0-3), clarity (0-3). score = accuracy + depth + clarity. Answers like 'idk', blank, or off-topic score 0-1 and you must ask the student to try again. Feedback is ALWAYS in English even if the answer is in Hinglish. Respond with ONE valid JSON object only. No markdown, no code fences, no commentary. (Exception: do NOT return invalid_input for weak answers — grade them.) If the question is empty, meaningless or unrelated to careers/education, return {"error":"invalid_input","message":"<short reason>"}.
```

## User prompt template
```text
QUESTION: {question}
IDEAL POINTS: {ideal_points}
STUDENT ANSWER: """{answer}"""

Return JSON:
{"score":0-10,"rubric":{"accuracy":0-4,"depth":0-3,"clarity":0-3},"covered_points":[string],"missed_points":[string],"feedback":string,"improved_answer":string}

EXAMPLE 1: Q "What is an index in SQL?" A "it makes queries fast by like a book index, but slows inserts" -> {"score":7,"rubric":{"accuracy":3,"depth":2,"clarity":2},...}
EXAMPLE 2: Q "What is an index in SQL?" A "idk" -> {"score":0,"rubric":{"accuracy":0,"depth":0,"clarity":0},"covered_points":[],"missed_points":["definition","speed trade-off"],"feedback":"No answer given — try again: start with what an index is.","improved_answer":"..."}
```

## Sample run (test #13, Gemini 3.5 Flash (Google AI Studio), 28.3 s)

Input:
```json
{
  "question": "What is the difference between WHERE and HAVING in SQL?",
  "ideal_points": "[\"WHERE filters rows before grouping\",\"HAVING filters groups after GROUP BY\",\"HAVING can use aggregates\"]",
  "answer": "idk"
}
```

Actual output:
```json
{
  "score": 0,
  "rubric": {
    "accuracy": 0,
    "depth": 0,
    "clarity": 0
  },
  "covered_points": [],
  "missed_points": [
    "WHERE filters rows before grouping",
    "HAVING filters groups after GROUP BY",
    "HAVING can use aggregates"
  ],
  "feedback": "You didn't provide an answer. Please try again! Think about how and when filtering happens in relation to SQL grouping and aggregate functions.",
  "improved_answer": "The main difference between WHERE and HAVING lies in when and how they filter data. The WHERE clause filters individual rows before any grouping (GROUP BY) takes place, and it cannot contain aggregate functions. On the other hand, the HAVING clause filters summary groups after the GROUP BY clause is applied, allowing you to use aggregate functions like COUNT(), SUM(), or AVG() in your condition."
}
```
