#!/usr/bin/env python3
"""Build supplementary law question bank from attached PDF sources.

Outputs
- analysis/law_candidate_bank.json
- analysis/law_candidate_summary_YYYY-MM-DD.md
- data-law-supplement.js
- analysis/law_answer_keys.template.json (if answer key file is missing)

Note:
- Questions without verified answers are kept in candidate bank (`verified=false`) and
  are excluded from scored quiz flow by app logic.
"""

from __future__ import annotations

import json
import re
import subprocess
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Dict, List, Tuple

import pdfplumber


ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = ROOT.parent
DATA_JS = ROOT / "data.js"
PDF_DIR = WORKSPACE_ROOT / "행정법" / "최신기출" / "기출 각각 파일"
ANSWER_KEY_PATH = ROOT / "analysis" / "law_answer_keys.json"
ANSWER_KEY_TEMPLATE_PATH = ROOT / "analysis" / "law_answer_keys.template.json"
OUT_JSON = ROOT / "analysis" / "law_candidate_bank.json"
OUT_JS = ROOT / "data-law-supplement.js"


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def normalize_compact(value: str) -> str:
    return re.sub(r"\s+", "", value or "").strip().lower()


EXAM_WEIGHTS = {
    "국가직": 1.0,
    "지방직": 0.86,
    "국가직7급": 0.72,
    "국회직8급": 0.68,
    "소방총론": 0.35,
    "소방승진": 0.33,
    "소방간부": 0.33,
    "해양경찰": 0.33,
    "경찰승진": 0.33,
}

FALLBACK_CHAPTER_WEIGHTS = {
    "CH01": 0.88,
    "CH02": 0.82,
    "CH03": 0.95,
    "CH04": 0.93,
    "CH05": 0.90,
    "CH06": 0.90,
    "CH07": 0.86,
    "CH08": 0.86,
    "CH09": 0.89,
    "CH10": 0.94,
    "CH11": 0.96,
    "CH12": 0.82,
    "CH13": 0.74,
    "CH14": 0.85,
    "CH15": 0.83,
    "CH16": 0.68,
    "CH17": 0.66,
    "CH18": 0.68,
    "CH19": 0.84,
    "CH20": 0.80,
    "CH21": 0.73,
    "CH22": 0.58,
    "CH23": 0.77,
    "CH24": 0.48,
}

SOURCE_META: Dict[str, Dict[str, object]] = {
    "230408 국가 9급 행정법총론-나.pdf": {"year": 2023, "exam": "국가직", "grade": 9, "tag": "g9_2304"},
    "240323 국가 9급 행정법총론-가.pdf": {"year": 2024, "exam": "국가직", "grade": 9, "tag": "g9_2403"},
    "240622 지방 9급 행정법총론-C.pdf": {"year": 2024, "exam": "지방직", "grade": 9, "tag": "l9_2406"},
    "250405 국가 9급 행정법총론-나.pdf": {"year": 2025, "exam": "국가직", "grade": 9, "tag": "g9_2504"},
    "250621 지방 9급 행정법총론-B.pdf": {"year": 2025, "exam": "지방직", "grade": 9, "tag": "l9_2506"},
    "250920 국가 7급 2차 행정법-가.pdf": {"year": 2025, "exam": "국가직7급", "grade": 7, "tag": "g7_2509"},
    "2025 국회직 8급 행정법.pdf": {"year": 2025, "exam": "국회직8급", "grade": 8, "tag": "na8_2025"},
    "2025 소방 간부후보 행정법 문제.pdf": {"year": 2025, "exam": "소방간부", "grade": 0, "tag": "fire_off_2025"},
    "2025 소방 행정법총론.pdf": {"year": 2025, "exam": "소방총론", "grade": 0, "tag": "fire_gen_2025"},
    "2025년 소방승진 행정법(소방위)기출 .pdf": {"year": 2025, "exam": "소방승진", "grade": 0, "tag": "fire_promo_2025"},
    "2025년도 하반기 해양경찰청 간부후보 행정법 기출.pdf": {"year": 2025, "exam": "해양경찰", "grade": 0, "tag": "coast_2025"},
    "2026년도 경찰공무원 승진시험 행정법(경정) 기출.pdf": {"year": 2026, "exam": "경찰승진", "grade": 0, "tag": "pol_promo_2026"},
    "26년 소방간부행정법 기출.pdf": {"year": 2026, "exam": "소방간부", "grade": 0, "tag": "fire_off_2026"},
}

CHAPTER_HINTS: Dict[str, List[str]] = {
    "CH01": [r"신뢰보호", r"비례원칙", r"평등", r"실권의 법리", r"공적.?견해"],
    "CH02": [r"행정입법", r"법규명령", r"행정규칙", r"위임입법", r"재위임", r"고시"],
    "CH03": [r"행정행위", r"허가", r"특허", r"인가", r"공정력", r"불가쟁"],
    "CH04": [r"부관", r"부담", r"조건", r"기한", r"철회권.?유보"],
    "CH05": [r"하자", r"무효", r"취소사유", r"하자승계", r"치유", r"전환"],
    "CH06": [r"직권취소", r"철회", r"취소의 취소", r"쟁송취소"],
    "CH07": [r"행정계획", r"계획재량", r"이익형량"],
    "CH08": [r"행정절차", r"이유.?제시", r"청문", r"사전.?통지", r"공청회"],
    "CH09": [r"대집행", r"이행강제금", r"직접강제", r"행정벌", r"강제징수"],
    "CH10": [r"항고소송", r"행정소송", r"처분성"],
    "CH11": [r"취소소송", r"제소기간", r"피고적격", r"원고적격", r"집행정지", r"기속력"],
    "CH12": [r"무효.?확인", r"부작위.?위법"],
    "CH13": [r"당사자소송", r"객관소송", r"민중소송", r"기관소송"],
    "CH14": [r"국가배상", r"영조물", r"상호보증", r"구상권"],
    "CH15": [r"손실보상", r"토지수용", r"사업인정", r"보상금", r"수용재결"],
    "CH16": [r"공법상.?계약"],
    "CH17": [r"정보공개", r"비공개"],
    "CH18": [r"사인의.?공법행위", r"신고", r"수리", r"자기완결"],
    "CH19": [r"기속행위", r"재량행위", r"재량권"],
    "CH20": [r"제재처분", r"과징금", r"제척기간"],
    "CH21": [r"인허가.?의제"],
    "CH22": [r"부당이득", r"과오납", r"변상금"],
    "CH23": [r"행정심판", r"재결", r"심판청구"],
    "CH24": [r"행정조사"],
}

STOPWORDS = {
    "대한",
    "설명",
    "것은",
    "경우",
    "있다",
    "없다",
    "하여",
    "으로",
    "에서",
    "또는",
    "모두",
    "고르면",
    "다음",
    "판례",
    "입장",
}

HEADER_PATTERNS = [
    re.compile(r"^\d{4}년도 .*필기시험 .*책형 \d+쪽$"),
    re.compile(r"^행정법총론$"),
    re.compile(r"^지문의 내용에 대해 .* 판례에 의함$"),
    re.compile(r"^\s*-\s*\d+\s*-\s*$"),
]

Q_BLOCK_RE = re.compile(r"(?ms)^\s*(\d{1,2})\.\s*(.+?)(?=^\s*\d{1,2}\.\s|\Z)")
CHOICE_MARK_RE = re.compile(r"①|②|③|④|⑤")
INLINE_NOISE_PATTERNS = [
    re.compile(r"행정법총론\s*[가-힣]?\s*책형\s*\d+쪽"),
    re.compile(r"\d{4}년도\s+국가공무원\s*\d+급\s*공채\s*필기시험"),
]


@dataclass
class ExtractedQuestion:
    source_file: str
    source_qno: int
    year: int
    exam: str
    grade: int
    question: str
    choices: List[str]
    qtype: str
    chapter: str
    topic: str
    importance: str
    keywords: List[str]
    answer: int | None
    verified: bool


def load_base_data() -> Tuple[List[dict], Dict[str, str]]:
    node_code = r"""
const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync(process.argv[1], 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(code + '\nthis.__out = { QUESTIONS, CHAPTERS };', sandbox);
process.stdout.write(JSON.stringify(sandbox.__out));
"""
    out = subprocess.check_output(["node", "-e", node_code, str(DATA_JS)], text=True)
    loaded = json.loads(out)
    return loaded["QUESTIONS"], loaded["CHAPTERS"]


def get_exam_weight(exam: str) -> float:
    return float(EXAM_WEIGHTS.get(exam, 0.4))


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


def choice_symbol_to_num(symbol: str) -> int:
    return {"①": 1, "②": 2, "③": 3, "④": 4, "⑤": 5}[symbol]


def clean_page_text(text: str) -> str:
    lines = []
    for raw in (text or "").splitlines():
        line = normalize_space(raw)
        if not line:
            continue
        if any(p.match(line) for p in HEADER_PATTERNS):
            continue
        lines.append(line)
    return "\n".join(lines)


def words_to_lines(words: List[dict], y_tol: float = 2.2) -> List[str]:
    if not words:
        return []
    ordered = sorted(words, key=lambda w: (float(w.get("top", 0.0)), float(w.get("x0", 0.0))))
    buckets: List[List[dict]] = []
    cur: List[dict] = []
    cur_top: float | None = None

    for word in ordered:
        top = float(word.get("top", 0.0))
        if cur_top is None or abs(top - cur_top) <= y_tol:
            cur.append(word)
            if cur_top is None:
                cur_top = top
        else:
            buckets.append(cur)
            cur = [word]
            cur_top = top
    if cur:
        buckets.append(cur)

    lines = []
    for bucket in buckets:
        line = " ".join(w.get("text", "") for w in sorted(bucket, key=lambda x: float(x.get("x0", 0.0))))
        line = normalize_space(line)
        if line:
            lines.append(line)
    return lines


def extract_page_text_by_columns(page) -> str:
    words = page.extract_words(
        x_tolerance=1.5,
        y_tolerance=2.0,
        keep_blank_chars=False,
        use_text_flow=False,
    ) or []
    if not words:
        return ""

    mid = float(page.width) * 0.5
    left = [w for w in words if float(w.get("x0", 0.0)) < mid]
    right = [w for w in words if float(w.get("x0", 0.0)) >= mid]

    left_lines = words_to_lines(left)
    right_lines = words_to_lines(right)
    return "\n".join(left_lines + right_lines)


def parse_question_blocks(full_text: str) -> List[Tuple[int, str, List[str], str]]:
    def sanitize_fragment(value: str) -> str:
        out = value
        for p in INLINE_NOISE_PATTERNS:
            out = p.sub(" ", out)
        return normalize_space(out)

    parsed = []
    for m in Q_BLOCK_RE.finditer(full_text):
        qno = int(m.group(1))
        body = normalize_space(m.group(2))
        marks = list(CHOICE_MARK_RE.finditer(body))
        if len(marks) < 4:
            continue
        stem = sanitize_fragment(body[: marks[0].start()])
        options: List[str] = []
        for idx, mark in enumerate(marks):
            start = mark.end()
            end = marks[idx + 1].start() if idx + 1 < len(marks) else len(body)
            option = sanitize_fragment(body[start:end])
            if option:
                options.append(option)
        if len(options) < 4 or not stem:
            continue
        options = options[:4]
        parsed.append((qno, stem, options, infer_type(stem, options)))
    return parsed


def infer_type(stem: str, options: List[str]) -> str:
    joined = f"{stem} {' '.join(options)}"
    if "모두 고르면" in joined or "조합" in joined or any("ㄱ" in o for o in options):
        return "combination"
    if "옳지 않은" in stem:
        return "negative"
    return "positive"


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
    with ANSWER_KEY_TEMPLATE_PATH.open("w", encoding="utf-8") as f:
        json.dump(template, f, ensure_ascii=False, indent=2)
    return {}


def build_existing_signature_set(base_questions: List[dict]) -> set[str]:
    sigs = set()
    for q in base_questions:
        stem = normalize_space(str(q.get("question") or ""))
        options = [normalize_space(str(c.get("text") or "")) for c in (q.get("choices") or [])]
        if not stem or len(options) < 2:
            continue
        sig = normalize_compact(f"{stem}|{options[0]}|{options[1]}")
        sigs.add(sig)
    return sigs


def build_chapter_keyword_lexicon(base_questions: List[dict], chapters: Dict[str, str]) -> Tuple[Dict[str, Counter], List[str]]:
    lexicon: Dict[str, Counter] = defaultdict(Counter)
    global_kw = Counter()
    for q in base_questions:
        chapter = str(q.get("chapter") or "")
        if chapter:
            lexicon[chapter][normalize_space(str(q.get("topic") or ""))] += 2
            lexicon[chapter][normalize_space(chapters.get(chapter, chapter))] += 1
        for kw in q.get("keywords") or []:
            kw_norm = normalize_space(str(kw))
            if not kw_norm:
                continue
            lexicon[chapter][kw_norm] += 3
            global_kw[kw_norm] += 1
    ranked_keywords = [kw for kw, _ in global_kw.most_common()]
    return lexicon, ranked_keywords


def infer_chapter(text: str, chapter_lexicon: Dict[str, Counter]) -> str:
    compact = normalize_compact(text)
    scores: Dict[str, float] = defaultdict(float)

    for chapter, patterns in CHAPTER_HINTS.items():
        for pat in patterns:
            for _ in re.finditer(pat, text):
                scores[chapter] += 2.4

    for chapter, lex in chapter_lexicon.items():
        for term, w in lex.items():
            term_compact = normalize_compact(term)
            if len(term_compact) < 2:
                continue
            if term_compact in compact:
                scores[chapter] += min(3.0, 0.7 + (0.1 * w))

    if not scores:
        return "CH11"
    return max(scores.items(), key=lambda item: item[1])[0]


def infer_keywords(text: str, ranked_keywords: List[str], chapter: str, chapter_lexicon: Dict[str, Counter]) -> List[str]:
    compact = normalize_compact(text)
    found: List[str] = []

    chapter_terms = [kw for kw, _ in chapter_lexicon.get(chapter, Counter()).most_common()]
    ordered = chapter_terms + [kw for kw in ranked_keywords if kw not in set(chapter_terms)]

    for kw in ordered:
        kw_norm = normalize_compact(kw)
        if len(kw_norm) < 2:
            continue
        if kw_norm in compact:
            found.append(kw)
        if len(found) >= 6:
            break

    if found:
        return found[:4]

    tokens = re.findall(r"[가-힣A-Za-z]{2,}", text)
    token_counter = Counter(t for t in tokens if t not in STOPWORDS)
    return [t for t, _ in token_counter.most_common(4)]


def build_chapter_importance_profile(base_questions: List[dict]) -> Dict[str, float]:
    imp_value = {"S": 3.0, "A": 2.0, "B": 1.0, "C": 0.7}
    bucket: Dict[str, List[float]] = defaultdict(list)
    for q in base_questions:
        chapter = str(q.get("chapter") or "")
        imp = str(q.get("importance") or "B")
        if chapter:
            bucket[chapter].append(imp_value.get(imp, 1.0))

    profile: Dict[str, float] = {}
    for chapter, values in bucket.items():
        profile[chapter] = round(sum(values) / max(1, len(values)), 3)
    return profile


def infer_importance(chapter: str, exam: str, chapter_imp_profile: Dict[str, float]) -> str:
    base = chapter_imp_profile.get(chapter, 1.9)
    source_w = get_exam_weight(exam)
    bonus = 0.0
    if source_w >= 0.95:
        bonus = 0.35
    elif source_w >= 0.75:
        bonus = 0.2
    elif source_w <= 0.4:
        bonus = -0.1
    score = base + bonus
    if score >= 2.65:
        return "S"
    if score >= 1.95:
        return "A"
    return "B"


def build_chapter_frequency_weights(pool: List[dict]) -> Dict[str, float]:
    freq: Dict[str, float] = defaultdict(float)
    for q in pool:
        chapter = str(q.get("chapter") or "")
        if not chapter:
            continue
        source_w = get_exam_weight(str(q.get("exam") or ""))
        imp_w = get_importance_weight(str(q.get("importance") or "B"))
        verified_w = 1.0 if q.get("verified", True) else 0.9
        freq[chapter] += source_w * imp_w * verified_w

    if not freq:
        return {}

    values = list(freq.values())
    mn, mx = min(values), max(values)
    weights: Dict[str, float] = {}
    for chapter, value in freq.items():
        if mx == mn:
            weights[chapter] = 0.75
        else:
            weights[chapter] = round(0.48 + ((value - mn) / (mx - mn)) * 0.52, 3)
    return weights


def build_keyword_grade_map(pool: List[dict]) -> Dict[str, dict]:
    score = defaultdict(float)
    for q in pool:
        source_w = get_exam_weight(str(q.get("exam") or ""))
        imp = str(q.get("importance") or "B")
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

    out: Dict[str, dict] = {}
    for i, (kw, val) in enumerate(ranked, 1):
        grade = "B"
        if val >= s_cut:
            grade = "S"
        elif val >= a_cut:
            grade = "A"
        out[kw] = {"score": round(val, 3), "rank": i, "grade": grade}
    return out


def apply_fit_metrics(q: dict, chapter_weights: Dict[str, float]) -> None:
    source_w = get_exam_weight(str(q.get("exam") or ""))
    chapter = str(q.get("chapter") or "")
    chapter_w = chapter_weights.get(chapter, FALLBACK_CHAPTER_WEIGHTS.get(chapter, 0.65))
    imp_w = get_importance_weight(str(q.get("importance") or "B"))

    raw = round(source_w + chapter_w + imp_w, 3)
    norm = round(raw / 3.0, 3)

    q["sourceWeight"] = round(source_w, 3)
    q["chapterFrequencyWeight"] = round(chapter_w, 3)
    q["importanceWeight"] = round(imp_w, 3)
    q["targetScoreRaw"] = raw
    q["targetScore"] = norm
    q["targetGrade"] = grade_by_score(norm)


def parse_sources(
    base_questions: List[dict],
    chapters: Dict[str, str],
    answer_keys: Dict[str, Dict[str, int]],
) -> Tuple[List[dict], List[dict], List[dict]]:
    existing_sigs = build_existing_signature_set(base_questions)
    chapter_lexicon, ranked_keywords = build_chapter_keyword_lexicon(base_questions, chapters)
    chapter_imp_profile = build_chapter_importance_profile(base_questions)

    source_reports: List[dict] = []
    verified: List[dict] = []
    candidates: List[dict] = []
    local_sig = set(existing_sigs)
    next_id = max(int(q.get("id", 0)) for q in base_questions if str(q.get("id", "")).isdigit()) + 1

    for filename, meta in SOURCE_META.items():
        path = PDF_DIR / filename
        report = {
            "file": filename,
            "exists": path.exists(),
            "pages": 0,
            "detected_questions": 0,
            "added_verified": 0,
            "added_candidates": 0,
            "weight": get_exam_weight(str(meta["exam"])),
        }
        if not path.exists():
            source_reports.append(report)
            continue

        page_texts = []
        with pdfplumber.open(path) as pdf:
            report["pages"] = len(pdf.pages)
            for page in pdf.pages:
                page_texts.append(clean_page_text(extract_page_text_by_columns(page)))

        parsed = parse_question_blocks("\n".join(page_texts))
        report["detected_questions"] = len(parsed)

        for qno, stem, options, qtype in parsed:
            sig = normalize_compact(f"{stem}|{options[0]}|{options[1]}")
            if sig in local_sig:
                continue
            local_sig.add(sig)

            text_bag = f"{stem} {' '.join(options)}"
            chapter = infer_chapter(text_bag, chapter_lexicon)
            topic = chapters.get(chapter, chapter)
            keywords = infer_keywords(text_bag, ranked_keywords, chapter, chapter_lexicon)
            importance = infer_importance(chapter, str(meta["exam"]), chapter_imp_profile)

            answer = answer_keys.get(filename, {}).get(str(qno))
            verified_flag = isinstance(answer, int) and 1 <= int(answer) <= 4

            row = {
                "year": int(meta["year"]),
                "exam": str(meta["exam"]),
                "grade": int(meta["grade"]),
                "chapter": chapter,
                "topic": topic,
                "importance": importance,
                "question": stem,
                "type": qtype,
                "choices": [],
                "keywords": keywords,
                "sourceFile": filename,
                "sourceQuestionNo": qno,
                "verified": verified_flag,
            }

            for idx, choice_text in enumerate(options, 1):
                c = {"num": idx, "text": choice_text}
                if verified_flag:
                    c["ox"] = idx == int(answer)
                    c["stamp"] = []
                row["choices"].append(c)

            if verified_flag:
                row["id"] = next_id
                row["answer"] = int(answer)
                next_id += 1
                verified.append(row)
                report["added_verified"] += 1
            else:
                row["id"] = f"C_{meta['tag']}_{qno:02d}"
                row["answer"] = None
                candidates.append(row)
                report["added_candidates"] += 1

        source_reports.append(report)

    return source_reports, verified, candidates


def attach_keyword_profiles(pool: List[dict], keyword_grade_map: Dict[str, dict]) -> None:
    for q in pool:
        profile = []
        for kw in q.get("keywords") or []:
            key = normalize_compact(str(kw))
            info = keyword_grade_map.get(key)
            grade = info["grade"] if info else "B"
            profile.append({"keyword": kw, "grade": grade})
        q["keywordProfile"] = profile


def write_outputs(
    source_reports: List[dict],
    verified_questions: List[dict],
    candidate_questions: List[dict],
    chapter_weights: Dict[str, float],
    keyword_grade_map: Dict[str, dict],
) -> None:
    today = date.today().isoformat()

    payload = {
        "date": today,
        "sourceReports": source_reports,
        "summary": {
            "verifiedAdded": len(verified_questions),
            "candidateAdded": len(candidate_questions),
            "totalSources": len(source_reports),
        },
        "chapterFrequencyWeights": chapter_weights,
        "keywordGrades": keyword_grade_map,
        "verifiedQuestions": verified_questions,
        "candidateQuestions": candidate_questions,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    js = (
        "// Auto-generated by analysis/build_law_supplement.py\n"
        f"const LAW_SUPPLEMENT_QUESTIONS = {json.dumps(verified_questions, ensure_ascii=False)};\n"
        f"const LAW_CANDIDATE_QUESTIONS = {json.dumps(candidate_questions, ensure_ascii=False)};\n"
        f"const LAW_SOURCE_AUDIT = {json.dumps({'date': today, 'sources': source_reports, 'chapterFrequencyWeights': chapter_weights}, ensure_ascii=False)};\n"
        "if (typeof window !== 'undefined') {\n"
        "  window.LAW_SUPPLEMENT_QUESTIONS = LAW_SUPPLEMENT_QUESTIONS;\n"
        "  window.LAW_CANDIDATE_QUESTIONS = LAW_CANDIDATE_QUESTIONS;\n"
        "  window.LAW_SOURCE_AUDIT = LAW_SOURCE_AUDIT;\n"
        "}\n"
    )
    OUT_JS.write_text(js, encoding="utf-8")

    md_path = ROOT / "analysis" / f"law_candidate_summary_{today}.md"
    total_detected = sum(r["detected_questions"] for r in source_reports)
    total_added = len(verified_questions) + len(candidate_questions)

    lines = [
        "# 행정법 확장 문항 자동 점검 요약",
        "",
        f"- 점검일: {today}",
        f"- 점검 소스: {len(source_reports)}개",
        f"- 탐지 문항(원시): {total_detected}",
        f"- 신규 반영: {total_added}문항 (검증완료 {len(verified_questions)} / 검증대기 {len(candidate_questions)})",
        "",
        "| 파일 | 탐지 | 반영(검증완료) | 반영(검증대기) |",
        "|---|---:|---:|---:|",
    ]
    for row in source_reports:
        lines.append(
            f"| {row['file']} | {row['detected_questions']} | {row['added_verified']} | {row['added_candidates']} |"
        )

    lines += [
        "",
        "## 국가9 적합도 자동 산출식",
        "",
        "- `sourceWeight(출처 가중치)` + `chapterFrequencyWeight(단원 빈도 가중치)` + `importanceWeight(S/A/B)`를 합산",
        "- 합산 점수 / 3을 `targetScore`로 정규화하고 S/A/B 등급 자동 부여",
        "",
        "## 키워드 등급 자동 산출식",
        "",
        "- 키워드 빈도 점수 = `출처 가중치 × 중요도 계수` 누적",
        "- 상위 32% `S`, 다음 36% `A`, 나머지 `B`",
    ]
    md_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    base_questions, chapters = load_base_data()
    answer_keys = load_answer_keys()

    source_reports, verified_questions, candidate_questions = parse_sources(
        base_questions=base_questions,
        chapters=chapters,
        answer_keys=answer_keys,
    )

    all_pool = [*base_questions, *verified_questions, *candidate_questions]
    chapter_weights = build_chapter_frequency_weights(all_pool)

    for q in verified_questions:
        apply_fit_metrics(q, chapter_weights)
    for q in candidate_questions:
        apply_fit_metrics(q, chapter_weights)

    keyword_grade_map = build_keyword_grade_map(all_pool)
    attach_keyword_profiles(verified_questions, keyword_grade_map)
    attach_keyword_profiles(candidate_questions, keyword_grade_map)

    write_outputs(
        source_reports=source_reports,
        verified_questions=verified_questions,
        candidate_questions=candidate_questions,
        chapter_weights=chapter_weights,
        keyword_grade_map=keyword_grade_map,
    )

    print(f"done: verified={len(verified_questions)} candidate={len(candidate_questions)}")
    print(f"json: {OUT_JSON}")
    print(f"js:   {OUT_JS}")


if __name__ == "__main__":
    main()
