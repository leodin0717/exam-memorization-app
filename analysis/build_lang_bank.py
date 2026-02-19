#!/usr/bin/env python3
"""Build Korean/English 9-grade bank from attached PDFs.

Outputs:
- analysis/lang_candidate_bank.json
- analysis/lang_candidate_summary_YYYY-MM-DD.md
- lang-data-supplement.js
- analysis/lang_answer_keys.template.json (if answer key missing)

Notes:
- Without answer keys, questions are still playable in self-check mode.
- If answer keys are provided in analysis/lang_answer_keys.json, verified questions
  are auto-graded and available for strict OX training.
"""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path
from typing import Dict, List, Tuple

import pdfplumber


ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = ROOT.parent
PDF_DIR = WORKSPACE_ROOT / "국어 영어 기출"
ANSWER_KEY_PATH = ROOT / "analysis" / "lang_answer_keys.json"
ANSWER_KEY_TEMPLATE_PATH = ROOT / "analysis" / "lang_answer_keys.template.json"
OUT_JSON = ROOT / "analysis" / "lang_candidate_bank.json"
OUT_JS = ROOT / "lang-data-supplement.js"


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def normalize_compact(value: str) -> str:
    return re.sub(r"\s+", "", value or "").strip().lower()


SOURCE_META: Dict[str, Dict[str, object]] = {
    "25년 국가직 9급 국어 기출.pdf": {"subject": "kor", "year": 2025, "exam": "국가직", "tag": "kor_nat_2025"},
    "25년 지방 9급 국어 기출.pdf": {"subject": "kor", "year": 2025, "exam": "지방직", "tag": "kor_loc_2025"},
    "9급 예시 1차 국어.pdf": {"subject": "kor", "year": 2024, "exam": "예시1차", "tag": "kor_ex1"},
    "2차 예시 국어.pdf": {"subject": "kor", "year": 2024, "exam": "예시2차", "tag": "kor_ex2"},
    "국어.pdf": {"subject": "kor", "year": 2023, "exam": "예시1차", "tag": "kor_ex0"},
    "25년 국가직 9급 영어 기출.pdf": {"subject": "eng", "year": 2025, "exam": "국가직", "tag": "eng_nat_2025"},
    "25년 지방 9급 영어 기출.pdf": {"subject": "eng", "year": 2025, "exam": "지방직", "tag": "eng_loc_2025"},
    "1차 영어 예시.pdf": {"subject": "eng", "year": 2024, "exam": "예시1차", "tag": "eng_ex1"},
    "2차 예시 영어.pdf": {"subject": "eng", "year": 2024, "exam": "예시2차", "tag": "eng_ex2"},
    "영어.pdf": {"subject": "eng", "year": 2023, "exam": "예시1차", "tag": "eng_ex0"},
}

EXAM_WEIGHTS = {
    "국가직": 1.0,
    "지방직": 0.88,
    "예시2차": 0.78,
    "예시1차": 0.74,
    "출제기조자료": 0.62,
}

CHAPTERS = {
    "K01": "국어 문법·형태론",
    "K02": "국어 규범·표현",
    "K03": "국어 독해·주제",
    "K04": "국어 논리·추론",
    "K05": "국어 화법·작문·자료",
    "E01": "영어 문법",
    "E02": "영어 어휘",
    "E03": "영어 독해",
    "E04": "영어 순서·삽입·무관문",
    "E05": "영어 대화·실용",
}

CHAPTER_HINTS = {
    "kor": {
        "K01": [r"형태소", r"형태론", r"품사", r"음운", r"문장성분", r"통사"],
        "K02": [r"표준어", r"맞춤법", r"띄어쓰기", r"어문 규정", r"표현"],
        "K03": [r"중심 내용", r"주제", r"요지", r"글의 흐름", r"필자의 견해"],
        "K04": [r"논리", r"강화", r"약화", r"추론", r"타당", r"반박", r"논증"],
        "K05": [r"대화", r"발표", r"토론", r"자료", r"작문", r"화법"],
    },
    "eng": {
        "E01": [r"어법", r"문법", r"옳은 것은", r"적절한 것은"],
        "E02": [r"어휘", r"빈칸", r"밑줄 친 부분", r"단어", r"표현"],
        "E03": [r"주제", r"요지", r"제목", r"내용 일치", r"흐름"],
        "E04": [r"문장", r"들어갈 위치", r"순서", r"어색한 문장", r"삽입"],
        "E05": [r"대화", r"응답", r"상황", r"일상"],
    },
}

WEAK_PRIORITY_CHAPTERS = {
    "kor": {"K01", "K04"},
    "eng": {"E01", "E02", "E04"},
}

HEADER_PATTERNS = [
    re.compile(r"^\d{4}년도 .*필기시험$"),
    re.compile(r"^9급 출제기조 전환 예시문제$"),
    re.compile(r"^국\s*어$"),
    re.compile(r"^영\s*어$"),
    re.compile(r"^책형$"),
    re.compile(r"^책형\s*\d+쪽$"),
    re.compile(r"^\d+쪽$"),
    re.compile(r"^국\s*어\s*책형\s*\d+쪽$"),
    re.compile(r"^영\s*어\s*책형\s*\d+쪽$"),
]

INLINE_NOISE_PATTERNS = [
    re.compile(r"국\s*어\s*책형\s*\d+쪽"),
    re.compile(r"영\s*어\s*책형\s*\d+쪽"),
    re.compile(r"9급\s*출제기조\s*전환.*?\d+쪽"),
]

RANGE_PROMPT_RE = re.compile(r"^\[(\d{1,2})\s*(?:[~\-–～]\s*)?(\d{1,2})\]\s*(.+)$")
Q_START_RE = re.compile(r"^(\d{1,2})\.\s*(.*)$")
CHOICE_MARK_RE = re.compile(r"①|②|③|④|⑤")
STOPWORDS = {
    "다음",
    "설명",
    "적절한",
    "것은",
    "가장",
    "으로",
    "있는",
    "없는",
    "경우",
    "대한",
    "글의",
    "문장",
}


def get_exam_weight(exam: str) -> float:
    return float(EXAM_WEIGHTS.get(exam, 0.65))


def get_importance_weight(imp: str) -> float:
    if imp == "S":
        return 1.0
    if imp == "A":
        return 0.82
    return 0.64


def grade_by_score(score: float) -> str:
    if score >= 0.86:
        return "S"
    if score >= 0.72:
        return "A"
    return "B"


def clean_segment_text(value: str) -> str:
    out = value
    for p in INLINE_NOISE_PATTERNS:
        out = p.sub(" ", out)
    return normalize_space(out)


def words_to_segments(words: List[dict], y_tol: float = 2.2, gap_split: float = 55.0) -> List[Tuple[float, str]]:
    """Convert word list to text segments while splitting wide horizontal gaps.

    Some PDFs place two options on one visual line (left/right). Splitting on
    wide gaps helps recover 4 choices from those rows.
    """
    if not words:
        return []

    ordered = sorted(words, key=lambda w: (float(w.get("top", 0.0)), float(w.get("x0", 0.0))))
    rows: List[List[dict]] = []
    cur: List[dict] = []
    cur_top = None
    for word in ordered:
        top = float(word.get("top", 0.0))
        if cur_top is None or abs(top - cur_top) <= y_tol:
            cur.append(word)
            if cur_top is None:
                cur_top = top
        else:
            rows.append(cur)
            cur = [word]
            cur_top = top
    if cur:
        rows.append(cur)

    out: List[Tuple[float, str]] = []
    for row in rows:
        sorted_row = sorted(row, key=lambda x: float(x.get("x0", 0.0)))
        group = [sorted_row[0]]
        for word in sorted_row[1:]:
            prev = group[-1]
            gap = float(word.get("x0", 0.0)) - float(prev.get("x1", 0.0))
            if gap >= gap_split:
                text = normalize_space(" ".join(w.get("text", "") for w in group))
                if text:
                    out.append((float(group[0].get("x0", 0.0)), text))
                group = [word]
            else:
                group.append(word)
        text = normalize_space(" ".join(w.get("text", "") for w in group))
        if text:
            out.append((float(group[0].get("x0", 0.0)), text))
    return out


def infer_question_type(stem: str, options: List[str]) -> str:
    joined = f"{stem} {' '.join(options)}"
    if "모두 고르면" in joined or any("ㄱ" in opt for opt in options):
        return "combination"
    if any(key in stem for key in ["옳지 않은", "적절하지 않은", "일치하지 않는", "다른 하나"]):
        return "negative"
    return "positive"


def extract_marked_choices(texts: List[str]) -> Tuple[str, List[str]]:
    joined = "\n".join(texts)
    marks = list(CHOICE_MARK_RE.finditer(joined))
    if len(marks) < 4:
        return "", []

    stem = normalize_space(joined[: marks[0].start()])
    options = []
    for i, mark in enumerate(marks):
        start = mark.end()
        end = marks[i + 1].start() if i + 1 < len(marks) else len(joined)
        option = normalize_space(joined[start:end])
        if option:
            options.append(option)
    if len(options) < 4:
        return "", []
    return stem, options[:4]


def parse_source_questions(path: Path) -> List[Tuple[int, str, List[str], str]]:
    bundles: List[dict] = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            words = page.extract_words(
                x_tolerance=1.5,
                y_tolerance=2.0,
                keep_blank_chars=False,
                use_text_flow=False,
            ) or []
            if not words:
                continue

            mid = float(page.width) * 0.5
            left = [w for w in words if float(w.get("x0", 0.0)) < mid]
            right = [w for w in words if float(w.get("x0", 0.0)) >= mid]

            for side in (left, right):
                segs = words_to_segments(side)
                lines: List[Tuple[float, str]] = []
                for x, text in segs:
                    cleaned = clean_segment_text(text)
                    if not cleaned:
                        continue
                    if any(p.match(cleaned) for p in HEADER_PATTERNS):
                        continue
                    lines.append((x, cleaned))
                if lines:
                    min_x = min(x for x, _ in lines)
                    bundles.append({"threshold": min_x + 12.0, "lines": lines})

    question_blocks: Dict[int, List[dict]] = defaultdict(list)
    active_ranges: List[Tuple[int, int, str]] = []
    current_qno = None
    current_lines: List[str] = []
    current_prompt = ""

    def flush() -> None:
        nonlocal current_qno, current_lines, current_prompt
        if current_qno is not None:
            question_blocks[int(current_qno)].append({"lines": current_lines[:], "prompt": current_prompt})
        current_qno = None
        current_lines = []
        current_prompt = ""

    for bundle in bundles:
        threshold = float(bundle["threshold"])
        for x, text in bundle["lines"]:
            range_m = RANGE_PROMPT_RE.match(text)
            if range_m:
                lo, hi = sorted([int(range_m.group(1)), int(range_m.group(2))])
                prompt = normalize_space(range_m.group(3))
                active_ranges.append((lo, hi, prompt))
                continue

            q_m = Q_START_RE.match(text)
            if q_m and float(x) <= threshold:
                qno = int(q_m.group(1))
                if 1 <= qno <= 20:
                    flush()
                    current_qno = qno
                    current_prompt = ""
                    for lo, hi, prompt in reversed(active_ranges):
                        if lo <= qno <= hi:
                            current_prompt = prompt
                            break
                    rest = normalize_space(q_m.group(2))
                    if rest:
                        current_lines.append(rest)
                    continue

            if current_qno is not None:
                current_lines.append(text)

    flush()

    rows: List[Tuple[int, str, List[str], str]] = []
    for qno in range(1, 21):
        best = None
        best_score = -1
        for block in question_blocks.get(qno, []):
            texts = [normalize_space(t) for t in block.get("lines", []) if normalize_space(t)]
            if len(texts) < 4:
                continue
            marked_stem, marked_options = extract_marked_choices(texts)
            if marked_options:
                options = [normalize_space(re.sub(r"^[:·•]\s*", "", t)) for t in marked_options]
                stem = marked_stem
            else:
                options = [normalize_space(re.sub(r"^[:·•]\s*", "", t)) for t in texts[-4:]]
                stem = normalize_space(" ".join(texts[:-4]))

            stem = stem or normalize_space(str(block.get("prompt", "")))
            if not stem:
                continue
            if any(not opt for opt in options):
                continue
            if any(p.match(opt) for opt in options for p in HEADER_PATTERNS):
                continue
            if any(RANGE_PROMPT_RE.match(opt) for opt in options):
                continue
            if any(Q_START_RE.match(opt) for opt in options):
                continue
            if any(len(opt) > 180 for opt in options):
                continue
            score = len(stem) + sum(len(opt) for opt in options)
            if score > best_score:
                best = (qno, stem, options, infer_question_type(stem, options))
                best_score = score
        if best is not None:
            rows.append(best)

    return rows


def infer_chapter(subject: str, text: str) -> str:
    hints = CHAPTER_HINTS[subject]
    scores = defaultdict(float)
    for chapter, patterns in hints.items():
        for pat in patterns:
            hits = len(re.findall(pat, text))
            if hits:
                scores[chapter] += hits * 2.5
    if scores:
        return max(scores.items(), key=lambda x: x[1])[0]
    return "K03" if subject == "kor" else "E03"


def infer_keywords(subject: str, chapter: str, stem: str, options: List[str]) -> List[str]:
    bag = f"{stem} {' '.join(options)}"
    found = []
    for pat in CHAPTER_HINTS[subject].get(chapter, []):
        m = re.search(pat, bag)
        if m:
            token = normalize_space(m.group(0))
            if token and token not in found:
                found.append(token)

    tokens = re.findall(r"[A-Za-z]{2,}|[가-힣]{2,}", bag)
    counter = Counter(t for t in tokens if t not in STOPWORDS)
    for token, _ in counter.most_common(10):
        if token not in found:
            found.append(token)
        if len(found) >= 5:
            break
    return found[:4]


def infer_importance(subject: str, chapter: str, exam: str) -> str:
    if chapter in WEAK_PRIORITY_CHAPTERS[subject]:
        return "S"
    w = get_exam_weight(exam)
    if w >= 0.95:
        return "A"
    if w >= 0.75:
        return "A"
    return "B"


def load_answer_keys() -> Dict[str, Dict[str, int]]:
    if ANSWER_KEY_PATH.exists():
        with ANSWER_KEY_PATH.open("r", encoding="utf-8") as f:
            raw = json.load(f)
        cleaned: Dict[str, Dict[str, int]] = {}
        for source, mapping in raw.items():
            cleaned[source] = {}
            for k, v in mapping.items():
                try:
                    num = int(v)
                except Exception:
                    continue
                if 1 <= num <= 5:
                    cleaned[source][str(int(k))] = num
        return cleaned

    template = {name: {} for name in sorted(SOURCE_META.keys())}
    ANSWER_KEY_TEMPLATE_PATH.write_text(json.dumps(template, ensure_ascii=False, indent=2), encoding="utf-8")
    return {}


def build_question_signature(stem: str, options: List[str], subject: str) -> str:
    return normalize_compact(subject + "|" + stem + "|" + "|".join(options[:2]))


def build_chapter_weights(pool: List[dict]) -> Dict[str, float]:
    bucket = defaultdict(float)
    for q in pool:
        score = get_exam_weight(str(q.get("exam"))) * get_importance_weight(str(q.get("importance")))
        if q.get("verified") is False:
            score *= 0.9
        bucket[str(q.get("chapter"))] += score

    if not bucket:
        return {}

    vals = list(bucket.values())
    mn, mx = min(vals), max(vals)
    out = {}
    for chapter, v in bucket.items():
        if mx == mn:
            out[chapter] = 0.75
        else:
            out[chapter] = round(0.48 + ((v - mn) / (mx - mn)) * 0.52, 3)
    return out


def apply_target_metrics(q: dict, chapter_weights: Dict[str, float]) -> None:
    source_w = get_exam_weight(str(q.get("exam")))
    chapter_w = chapter_weights.get(str(q.get("chapter")), 0.65)
    imp_w = get_importance_weight(str(q.get("importance")))
    raw = round(source_w + chapter_w + imp_w, 3)
    score = round(raw / 3.0, 3)
    q["sourceWeight"] = round(source_w, 3)
    q["chapterFrequencyWeight"] = round(chapter_w, 3)
    q["importanceWeight"] = round(imp_w, 3)
    q["targetScoreRaw"] = raw
    q["targetScore"] = score
    q["targetGrade"] = grade_by_score(score)


def build_keyword_grades(pool: List[dict]) -> Dict[str, dict]:
    score = defaultdict(float)
    for q in pool:
        source_w = get_exam_weight(str(q.get("exam")))
        imp = str(q.get("importance"))
        imp_mul = 1.15 if imp == "S" else (1.0 if imp == "A" else 0.8)
        for kw in {normalize_compact(str(k)) for k in (q.get("keywords") or []) if str(k).strip()}:
            score[kw] += source_w * imp_mul

    ranked = sorted(score.items(), key=lambda x: x[1], reverse=True)
    if not ranked:
        return {}

    s_idx = max(int(len(ranked) * 0.32) - 1, 0)
    a_idx = max(int(len(ranked) * 0.68) - 1, 0)
    s_cut = ranked[s_idx][1]
    a_cut = ranked[a_idx][1]
    out = {}
    for i, (kw, val) in enumerate(ranked, 1):
        grade = "B"
        if val >= s_cut:
            grade = "S"
        elif val >= a_cut:
            grade = "A"
        out[kw] = {"score": round(val, 3), "rank": i, "grade": grade}
    return out


def attach_keyword_profile(pool: List[dict], grades: Dict[str, dict]) -> None:
    for q in pool:
        prof = []
        for kw in q.get("keywords") or []:
            key = normalize_compact(str(kw))
            g = grades.get(key, {}).get("grade", "B")
            prof.append({"keyword": kw, "grade": g})
        q["keywordProfile"] = prof


def main() -> None:
    answer_keys = load_answer_keys()

    seen = set()
    source_reports = []
    verified = []
    candidates = []
    next_id = 10000

    for filename, meta in SOURCE_META.items():
        path = PDF_DIR / filename
        report = {
            "file": filename,
            "exists": path.exists(),
            "subject": meta["subject"],
            "pages": 0,
            "detected_questions": 0,
            "added_verified": 0,
            "added_candidates": 0,
            "weight": get_exam_weight(str(meta["exam"])),
        }
        if not path.exists():
            source_reports.append(report)
            continue

        with pdfplumber.open(path) as pdf:
            report["pages"] = len(pdf.pages)

        parsed = parse_source_questions(path)
        report["detected_questions"] = len(parsed)

        for qno, stem, options, qtype in parsed:
            sig = build_question_signature(stem, options, str(meta["subject"]))
            if sig in seen:
                continue
            seen.add(sig)

            subject = str(meta["subject"])
            chapter = infer_chapter(subject, f"{stem} {' '.join(options)}")
            keywords = infer_keywords(subject, chapter, stem, options)
            importance = infer_importance(subject, chapter, str(meta["exam"]))
            answer = answer_keys.get(filename, {}).get(str(qno))
            verified_flag = isinstance(answer, int) and 1 <= int(answer) <= 4

            row = {
                "id": next_id if verified_flag else f"L_{meta['tag']}_{qno:02d}",
                "subject": subject,
                "year": int(meta["year"]),
                "exam": str(meta["exam"]),
                "grade": 9,
                "chapter": chapter,
                "topic": CHAPTERS.get(chapter, chapter),
                "importance": importance,
                "question": stem,
                "type": qtype,
                "choices": [],
                "keywords": keywords,
                "sourceFile": filename,
                "sourceQuestionNo": qno,
                "verified": verified_flag,
                "answer": int(answer) if verified_flag else None,
            }
            if verified_flag:
                next_id += 1

            for idx, text in enumerate(options, 1):
                c = {"num": idx, "text": text}
                if verified_flag:
                    c["ox"] = idx == int(answer)
                row["choices"].append(c)

            if verified_flag:
                verified.append(row)
                report["added_verified"] += 1
            else:
                candidates.append(row)
                report["added_candidates"] += 1

        source_reports.append(report)

    pool = [*verified, *candidates]
    chapter_weights = build_chapter_weights(pool)
    for q in pool:
        apply_target_metrics(q, chapter_weights)

    keyword_grades = build_keyword_grades(pool)
    attach_keyword_profile(pool, keyword_grades)

    today = date.today().isoformat()
    payload = {
        "date": today,
        "summary": {
            "verifiedAdded": len(verified),
            "candidateAdded": len(candidates),
            "totalSources": len(source_reports),
        },
        "sourceReports": source_reports,
        "chapterFrequencyWeights": chapter_weights,
        "keywordGrades": keyword_grades,
        "verifiedQuestions": verified,
        "candidateQuestions": candidates,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    js = (
        "// Auto-generated by analysis/build_lang_bank.py\n"
        f"const LANG_QUESTIONS_SUPPLEMENT = {json.dumps(verified, ensure_ascii=False)};\n"
        f"const LANG_CANDIDATE_QUESTIONS = {json.dumps(candidates, ensure_ascii=False)};\n"
        f"const LANG_SOURCE_AUDIT = {json.dumps({'date': today, 'sources': source_reports, 'chapterFrequencyWeights': chapter_weights}, ensure_ascii=False)};\n"
        "if (typeof window !== 'undefined') {\n"
        "  window.LANG_QUESTIONS_SUPPLEMENT = LANG_QUESTIONS_SUPPLEMENT;\n"
        "  window.LANG_CANDIDATE_QUESTIONS = LANG_CANDIDATE_QUESTIONS;\n"
        "  window.LANG_SOURCE_AUDIT = LANG_SOURCE_AUDIT;\n"
        "}\n"
    )
    OUT_JS.write_text(js, encoding="utf-8")

    md_path = ROOT / "analysis" / f"lang_candidate_summary_{today}.md"
    total_detected = sum(r["detected_questions"] for r in source_reports)
    lines = [
        "# 국어·영어 기출 자동 점검 요약",
        "",
        f"- 점검일: {today}",
        f"- 점검 소스: {len(source_reports)}개",
        f"- 탐지 문항(원시): {total_detected}",
        f"- 신규 반영: {len(verified) + len(candidates)}문항 (검증완료 {len(verified)} / 검증대기 {len(candidates)})",
        "",
        "| 파일 | 과목 | 탐지 | 반영(검증완료) | 반영(검증대기) |",
        "|---|---|---:|---:|---:|",
    ]
    for r in source_reports:
        lines.append(
            f"| {r['file']} | {r['subject']} | {r['detected_questions']} | {r['added_verified']} | {r['added_candidates']} |"
        )
    lines += [
        "",
        "## 국가9 적합도 자동 산출식",
        "- sourceWeight + chapterFrequencyWeight + importanceWeight 합산 후 /3 정규화",
        "- 정규화 점수 기준 S/A/B 자동 부여",
        "",
        "## 키워드 등급 자동 산출식",
        "- 키워드 점수 = 출처 가중치 × 중요도 계수 누적",
        "- 상위 32% S / 다음 36% A / 나머지 B",
    ]
    md_path.write_text("\n".join(lines), encoding="utf-8")

    print(f"done: verified={len(verified)} candidate={len(candidates)}")
    print(f"json: {OUT_JSON}")
    print(f"js:   {OUT_JS}")


if __name__ == "__main__":
    main()
