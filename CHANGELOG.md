# Changelog

## 2026-11-23: UI revamp
- New sticker kit (`code/assets/stickers.js`): hand-made SVG stickers with a halftone print, die-cut white edge and torn-paper notes. No copied artwork.
- Full-width layout with consistent padding on every page. Page heroes have draggable stickers that also follow the mouse (parallax).
- Animations: headline rise, highlight-marker sweep, scroll reveals, count-up stats, animated score rings and bars, 3D tilt on tiles, skills marquee, page transitions, scroll progress bar. All of them respect reduced-motion settings.
- Photo tiles use free Unsplash images, credited in the footer.
- New multi-column footer, a redesigned logo (bridge mark that draws itself on load), and a mobile menu.

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
