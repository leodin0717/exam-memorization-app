# HANDOFF (Codex App -> Codex Web)

Updated: 2026-02-19

## 1) Project Root
- `/Users/parkgwanho/Library/Mobile Documents/com~apple~CloudDocs/공시학습/나를믿는사람들을위해/행정법-암기전략앱`

## 2) Current Scope
- Subjects: 행정법, 행정학, 국어, 영어, 한국사
- Added: unified study journal + daily metacognition dashboard
- Added: iPad-focused pressure timeline and touch-friendly UI

## 3) Key Files
- Main apps
  - `app.js` (행정법)
  - `admin-app.js` (행정학)
  - `lang-app.js` (국어/영어)
  - `history-app.js` (한국사)
- Journal
  - `study-journal.js` (common event log + aggregates)
  - `journal.html` (report page)
  - `journal-app.js` (report logic)
- Styles
  - `style.css`
  - `admin-style.css`

## 4) Implemented Features (Important)
- All subject pages include `📒 학습기록` quick link.
- Attempt logs are written to `study_journal_v1` localStorage.
- 행정학 meta modal reasons are appended to journal events.
- Auto deep-link actions:
  - `index.html?auto=review`
  - `admin.html?auto=review`
  - `lang.html?subject=kor&auto=review`
  - `lang.html?subject=eng&auto=review`
  - `history.html?auto=retry`

## 5) Generated Report
- PDF:
  - `reports/공시_암기전략_웹앱_운용보고서.pdf`
- Source markdown:
  - `reports/공시_암기전략_웹앱_운용보고서.md`

## 6) Verification Snapshot
- JS syntax checks passed:
  - `study-journal.js`, `journal-app.js`, `app.js`, `admin-app.js`, `lang-app.js`, `history-app.js`
- local resource references in HTML pages verified.

## 7) Known Constraints
- localStorage is device/browser-local. (Mac Safari vs iPad Safari are separate.)
- For cross-device continuity, use GitHub commits + this handoff file.

## 8) Next Suggested Work (if requested)
- Add JSON export/import for journal to sync learning records across devices.
- Add one-tap “today weakest 20” launcher in each subject dashboard.
- Add mini heatmap (last 14 days) in `journal.html`.

## 9) Quick Resume Command Ideas
- Start local static server (Mac):
  - `python3 -m http.server 8787`
- Open pages:
  - `index.html`, `admin.html`, `lang.html?subject=kor`, `lang.html?subject=eng`, `history.html`, `journal.html`

