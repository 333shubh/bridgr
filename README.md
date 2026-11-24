# Bridgr — AI-Powered Academia–Industry Skill Mapping and Internship Portal

**Live prototype:** https://bridgr-rose.vercel.app

Bridgr uses structured prompts to compare a student's academic profile with what industry actually asks for, then helps close the gap and land an internship. It also gives institutions a view of how their curriculum lines up with industry demand.

## What it does

| Area | Module | Prompt(s) |
|---|---|---|
| Student | **Profile Skill Extractor**: resume text → evidence-backed skills rated 1–5 | P1 |
| Student | **Skill Gap Mapper**: job description → weighted requirements → match score, radar chart, gap list | P2 → P3 |
| Student | **Learning Roadmap**: week-by-week plan within your hour budget, with a progress tracker | P4 |
| Student | **ATS Resume Scorer**: keyword, impact, structure and relevance scoring with rewrite suggestions | P7 |
| Student | **Mock Interview**: questions aimed at your gaps; type or speak (Web Speech API); rubric scoring | P8 → P9 |
| Student | **AI Career Mentor**: chat grounded in your saved profile and gap report | P10 |
| Student | **Resume Builder**: one-click printable resume from your mapped profile | — |
| Portal | **Internship Portal**: search, filter, sort, AI fit-ranking, one-click apply | P5 |
| Portal | **Application Tracker**: drag-and-drop kanban (Applied → Interview → Offer / Rejected) | — |
| Portal | **Recruiter Console**: post internships that appear instantly in the portal | — |
| Institution | **Curriculum Alignment Auditor**: syllabus vs role → alignment score, outdated topics, unit-level suggestions | P6 |
| Institution | **Skill Demand Insights**: demand charts and an academia–industry gap table | — |

Other features: dark mode, a downloadable run log (JSON) of every AI call, an offline fallback engine, and printable reports.

## How to open / run

- **Use it:** open the live link above. No login is needed, and data stays in your browser.
- **Run locally:** install the Vercel CLI, then run `cd code && vercel dev`. Set `GEMINI_API_KEY` (free from Google AI Studio) as an environment variable; never commit it. Optional: `GEMINI_MODEL` takes a comma-separated list of models to try in order. Google no longer gives `gemini-2.5-flash` to new keys, so the default is `gemini-3.5-flash`.
- **Re-run the test table:** `cd code && node scripts/run-tests.mjs https://bridgr-rose.vercel.app` (outputs go to `test-data/outputs/`).
- **Re-run the prompt-version experiment:** `node code/scripts/compare-versions.mjs https://bridgr-rose.vercel.app 5`
- **Regenerate prompt sheets:** `node code/scripts/export-prompts.mjs`

## Architecture

Browser SPA (vanilla JS, Chart.js) → `POST /api/ai {promptId, vars}` → Vercel Function → Gemini 3.5 Flash via Google AI Studio (JSON mode, temperature per prompt, 2 attempts per model; falls back to Gemini 3 Flash Preview, then Gemini 3.5 Flash Lite) → validated JSON → UI.
If no model is reachable, the UI switches to a labelled **offline heuristic engine** (`code/assets/engine.js`) that returns the same JSON shapes.
No API keys are stored in this repository.

## Repository layout

```
README.md          this file
CHANGELOG.md       dated changes since Milestone 1
prompts/
  v1/ v2/ v3/      prompt versions used in the iteration log (P3, P9)
  final/           final prompts P1–P10, one file each (generated from code/api/_prompts.js)
code/              web app + serverless API + scripts
test-data/         test inputs (test-cases.json) and saved outputs
docs/              diagrams and Milestone 2 report
```

## Team

| Enrollment no. | Name | Main task |
|---|---|---|
| S24CSEU0136 | Rhythm Jain | Prompt design: P1, P2, P4, P5 |
| S24CSEU0361 | Ayush Swamy | P3 and P9, prompt versions v1–v3, iteration log |
| S24CSEU0530 | Shubh Jadiya | Web app, serverless API, deployment |
| S24CSEU0318 | Reyansh Singhal | Test cases, test runs, test table |
| S24CSEU2045 | Ishaan Yadav | P6, P7, P8, P10; diagrams, synopsis, reel |

_Internship listings in the portal are sample data for demonstration._
