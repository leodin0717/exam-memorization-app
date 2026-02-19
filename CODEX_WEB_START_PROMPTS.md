# Codex Web Start Prompts

Use one of the prompts below in Codex Web.

## Prompt A (Shortest)
```
Read HANDOFF.md in this repository and continue from that exact state.
Do not redesign broadly. Keep current UX style.
First run a quick integrity check, then implement only the highest-impact next step.
```

## Prompt B (Recommended)
```
Please continue this project from HANDOFF.md.

Context:
- This is a public exam memorization web app (행정법/행정학/국어/영어/한국사).
- Unified journal was added (study-journal.js + journal.html + journal-app.js).
- iPad landscape touch use is primary.

What I want now:
1) Verify current app behavior quickly (core flows only).
2) Identify the single most effective upgrade for score and time efficiency.
3) Implement it end-to-end (UI + logic + persistence if needed).
4) Keep existing structure and naming style.
5) Report changed files and how to test.
```

## Prompt C (If you only want bug-fix review)
```
Read HANDOFF.md and do a focused production-readiness review.
Prioritize bugs, regressions, and missing edge-case handling over refactoring.
Then patch only concrete issues with minimal changes.
```

## Prompt D (If you want cross-device record sync next)
```
Continue from HANDOFF.md and add JSON export/import for study journal.
Requirements:
- Export current study_journal_v1 as downloadable JSON.
- Import JSON safely with merge option (no blind overwrite by default).
- Add this UI in journal.html.
- Keep iPad touch usability.
Also provide a short user guide.
```

## One-Line Commit Message Template
```
feat: continue from HANDOFF and implement [target feature]
```

