# Changelog

## 2026-11-22: Milestone 2
- Added a deployed web prototype on Vercel (https://bridgr-rose.vercel.app).
- Built a serverless `/api/ai` endpoint calling Gemini 2.5 Flash in JSON mode. Keys come only from environment variables.
- Finalised 10 prompts (P1–P10) with explicit JSON schemas, rubric rules and invalid-input handling (`prompts/final/`).
- Kept v1/v2/v3 of the core prompts P3 (Skill Gap Mapper) and P9 (Answer Evaluator), all still runnable via `version` for the iteration log.
- Student modules: profile extractor, skill gap mapper with radar chart, learning roadmap with progress tracking, ATS scorer, mock interview with voice input, career mentor chat, resume builder.
- Portal modules: internship board with AI fit ranking, kanban application tracker, recruiter console.
- Institution modules: curriculum alignment auditor, skill demand insights dashboard.
- Added an offline heuristic fallback engine so the UI stays usable if the model is unavailable.
- Added a 15-case test table (`test-data/test-cases.json`) and scripts that save real outputs.
- New UI design system: dark hero with a cyan zigzag edge, highlighted section titles, horizontal card shelves, dark mode.

## Milestone 1
- Problem statement, use case and initial prompt idea: compare student profiles and curriculum with industry requirements using structured prompts.
