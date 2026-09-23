# Placera

Placera is an AI-powered placement intelligence platform for student profiles,
campus opportunity matching, eligibility checks, skill-gap planning, ATS resume
analysis, and placement readiness tracking.

## What is included

- Responsive white, slate, navy, and indigo interface
- Backward-compatible student authentication and `localStorage` profiles
- 25+ clearly labelled synthetic placement opportunities
- Eight target career roles and role-specific preparation roadmaps
- Client-side ATS resume analysis and skill extraction
- Strict CGPA, branch, backlog, and configured graduation-year eligibility checks
- Explainable deterministic matching using TF-IDF/cosine similarity, direct skill
  coverage, academic fit, role alignment, and project relevance
- Placement Readiness Index and non-persistent Improve My Match simulator
- AI transparency/pipeline documentation with no API keys or hidden model claims

All company, compensation, and job information in the bundled dataset is
**demo/synthetic data**. Verify any real-world opening independently.

## Run locally

```bash
npm install
npm run dev
```

The app is fully client-side and does not require a Gemini/API key. Validate the
production bundle with:

```bash
npm run lint
npm run build
```

## GitHub Pages

The Vite configuration uses a relative base path (`./`) so the generated
`dist/` bundle can be hosted from a project page. Publish the contents of
`dist/` through the repository's GitHub Pages settings or a Pages deployment
workflow. This repository does not treat synthetic opportunities as live
recruiter data.
