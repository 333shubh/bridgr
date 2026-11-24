# Bridgr: AI-powered academia-industry skill mapping and internship portal

Synopsis · SCSE4041 Mini Project, Milestone 2 · Team Prompt Busters (PE-B65-43)

## Problem

An engineering student can finish three years of coursework and still not know which of those skills an internship posting will count. Syllabi change every few years, while job descriptions change every hiring season. Students guess what to learn next, faculty seldom see what employers ask for, and recruiters screen applicants whose skills do not fit the role.

## Objectives

1. Read a student's resume or self-description and list only the skills it gives evidence for, each rated from 1 to 5.
2. Compare that list with a real job description and produce a match score the student can check by hand, with each requirement marked matched, partial or missing.
3. Help close the gap with a week-by-week learning plan, mock interviews scored against a rubric, an ATS resume check and a mentor chat that knows the student's profile.
4. Let faculty test a syllabus against a target role and see which topics are outdated and which units need new material.
5. Link the result to internships: rank openings by fit, apply in one click and track each application.

## Scope

Bridgr is built for undergraduate engineering students in India who are looking for internships, and for the faculty and recruiters around them. The Milestone 2 prototype is a web app with 12 modules. It needs no login and keeps all data in the browser. Internship listings are sample data. Accounts, live job feeds and a mobile app are outside the current scope.

## Methodology

The work is split into ten prompts (P1 to P10), one per task. The skill list from P1 and the job requirements from P2 feed several later modules, so each step returns its own JSON that the app can store and reuse. Each prompt has a fixed role, explicit rules, a JSON schema, a temperature chosen for the task (0.1 for scoring, higher for the mentor chat) and a rule that returns `{"error":"invalid_input"}` for empty or unrelated text. The core path is P1 (extract skills), P2 (weight the job's requirements) and P3 (score the gap).

The browser app (vanilla JavaScript and Chart.js) sends each request to a Vercel serverless function, which calls Gemini 3.5 Flash through Google AI Studio in JSON mode. If that model is busy or out of quota, the function tries Gemini 3 Flash Preview and then Gemini 3.5 Flash Lite. If no model answers, a labelled offline engine returns the same JSON shapes so the interface keeps working.

The Skill Gap prompt (P3) went through three versions. Version 1 was a one-line request at temperature 1. Version 2 added a role and a JSON shape. Version 3 added scoring rules, synonym handling, a weighted formula, one worked example and temperature 0.1. Fifteen test cases covering normal, edge and invalid inputs run by script against the API, and their outputs are saved in the repository.

## Results so far

Fourteen of the 15 test cases pass. The failure is the curriculum auditor (P6), which scored a DBMS syllabus at 62 when we expected 30 to 60. In three runs of each P3 version on Gemini 3 Flash Preview, version 1 never returned valid JSON. Version 2 returned JSON every time with a score of 50, but it called SQL and Excel "matched" while its own verdict said both were below the required level. Version 3 returned JSON every time with a score of 54, which is what its formula gives when worked by hand (100 × 10 ÷ 18.5 = 54.05).

## Expected outcome

A student pastes a resume, picks a role and gets a score with the reasons behind it, a short list of what to learn and internships ranked by fit. Faculty get a unit-by-unit list of syllabus changes. For Milestone 3 the team plans to pilot Bridgr with students and faculty, add accounts with cloud sync, and connect live internship listings.

Prototype: https://bridgr-rose.vercel.app · Repository: https://github.com/333shubh/bridgr
