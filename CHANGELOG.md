# Changelog

## 2026-11-23: Landing page and polish
- Original arc-and-dots logo and favicon restored.
- Homepage hero shows a working Skill Gap window: it scores a saved profile against four roles from the role data (or a labelled sample student) and cycles through them.
- Tool cards sit in one row per section. The row stays in place while the page scroll slides it sideways, then the page carries on down. No previous/next buttons.
- "How it works" is pinned too: scrolling steps through the five prompts, each with its own live screen.
- Every card uses one surface colour (white in light mode, graphite in dark).
- The mini screens inside cards play short looping demos while visible (skills filling, a cursor pressing Apply, a card moving across the tracker, chat replies). Off with reduced motion.
- Page headers on every tool show that tool's live mini screen instead of a paper note.
- Removed the bridge illustration and the numbers strip. Added a simple closing call to action.
- Highlighted headings no longer cover the letters on the line above.
- Short laptop screens and phones get compact versions of the pinned sections.

## 2026-11-23: UI revamp
- New sticker kit (`code/assets/stickers.js`): hand-made SVG stickers with a halftone print, die-cut white edge and torn-paper notes. No copied artwork.
- Full-width layout with consistent padding on every page. Page heroes have draggable stickers that also follow the mouse (parallax).
- Animations: headline rise, highlight-marker sweep, scroll reveals, count-up stats, animated score rings and bars, 3D tilt on tiles, skills marquee, page transitions, scroll progress bar. All of them respect reduced-motion settings.
- Card artwork is die-cut miniatures of Bridgr's own screens (`code/assets/cutouts.js`), not photos. The homepage banner is an animated bridge illustration from campus to career.
- Tab row under each page header to jump between related tools, as on the reference store's sub-pages. Internship cards follow the product-card layout.
- Phone layout checked at 390 px wide.
- Simplified footer and a mobile menu.

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
