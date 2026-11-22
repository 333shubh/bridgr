# Bridgr: Diagrams (Milestone 2)

These Mermaid diagrams render on GitHub. They describe the system exactly as built in `code/`.

## 1. Prompt workflow
```mermaid
flowchart LR
  A[Resume / profile text] -->|P1 Skill Extractor| B[(Student skills JSON)]
  C[Job description or role] -->|P2 Requirement Analyzer| D[(Role requirements JSON)]
  B --> E{{P3 Skill Gap Mapper}}
  D --> E
  E --> F[(Match score + matched / partial / missing)]
  F -->|P4| G[Week-by-week roadmap]
  F -->|P8| H[Interview questions] -->|student answer| I{{P9 Evaluator}} --> J[Score + feedback]
  B -->|P5 + internship list| K[Ranked internships]
  B -->|P7 + JD| L[ATS score]
  M[Syllabus] -->|P6| N[Curriculum alignment report]
  B & F -->|context| O[P10 Mentor chat]
```

## 2. Task decomposition
```mermaid
mindmap
  root((Map student to industry))
    Understand student
      Extract skills P1
      Rate proficiency 1-5 with evidence
    Understand industry
      Parse JD P2
      Weight must-have vs good-to-have
    Compare
      Synonym-aware matching P3
      Weighted score formula
    Close gap
      Roadmap P4
      Mock interview P8 P9
      Mentor P10
    Apply
      Rank internships P5
      ATS check P7
      Track applications
    Institution
      Curriculum audit P6
      Demand insights
```

## 3. Input–output flow (core path)
```mermaid
sequenceDiagram
  participant S as Student (browser)
  participant API as /api/ai (Vercel Function)
  participant LLM as Gemini 2.5 Flash
  S->>API: {promptId:"P1", vars:{profile_text}}
  API->>LLM: system + filled user template (temp 0.2, JSON mode)
  LLM-->>API: JSON skills
  API-->>S: {ok, data, model, ms}
  S->>API: P2 {jd_text}
  API-->>S: requirements JSON
  S->>API: P3 {student_skills, role_requirements}
  API-->>S: match_score, gaps
  Note over S: Rendered as score ring, radar chart and gap table
```

## 4. System architecture
```mermaid
flowchart TB
  subgraph Browser
    UI[SPA: vanilla JS + Chart.js<br/>12 modules, hash router]
    LS[(localStorage<br/>profile, gaps, apps, run log)]
    OFF[Offline heuristic engine]
  end
  subgraph Vercel
    ST[Static hosting]
    FN[api/ai.js<br/>prompt library P1-P10<br/>versions v1/v2<br/>JSON parse + retry]
  end
  G1[Google AI Studio<br/>Gemini 2.5 Flash]
  G2[Vercel AI Gateway]
  UI <--> LS
  UI -->|fetch| FN
  FN -->|GEMINI_API_KEY| G1
  FN -->|OIDC / gateway key| G2
  UI -.->|on failure| OFF
  ST --> UI
```
