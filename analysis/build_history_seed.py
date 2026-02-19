#!/usr/bin/env python3
"""Build Korean-history source seeds from attached PDFs.

Outputs:
- history-data-supplement.js
- analysis/history_source_summary_YYYY-MM-DD.md
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
PDF_DIR = WORKSPACE_ROOT / "한국사"
OUT_JS = ROOT / "history-data-supplement.js"
OUT_JSON = ROOT / "analysis" / "history_source_seed.json"

SOURCE_META: Dict[str, Dict[str, object]] = {
    "250405 국가 9급 한국사-나.pdf": {"year": 2025, "exam": "국가직", "weight": 1.0},
    "250621 지방 9급 한국사-B.pdf": {"year": 2025, "exam": "지방직", "weight": 0.88},
}

HEADER_PATTERNS = [
    re.compile(r"^\d{4}년도 .*필기시험$"),
    re.compile(r"^한\s*국\s*사$"),
    re.compile(r"^책형\s*\d*쪽?$"),
    re.compile(r"^\d+쪽$"),
]

Q_START_RE = re.compile(r"^(\d{1,2})\.\s*(.*)$")
CHOICE_MARK_RE = re.compile(r"①|②|③|④|⑤")
STOPWORDS = {
    "다음",
    "설명",
    "대한",
    "해당",
    "옳은",
    "옳지",
    "것",
    "것은",
    "가장",
    "자료",
    "밑줄",
    "시기",
    "기간",
    "관련",
    "우리",
    "나라",
    "국왕",
}


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def clean_line(value: str) -> str:
    value = normalize_space(value)
    value = re.sub(r"한\s*국\s*사\s*책형\s*\d+쪽", " ", value)
    value = re.sub(r"\b한\s*국\s*사\b", " ", value)
    return normalize_space(value)


def words_to_segments(words: List[dict], y_tol: float = 2.2, gap_split: float = 55.0) -> List[Tuple[float, str]]:
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
        row_sorted = sorted(row, key=lambda x: float(x.get("x0", 0.0)))
        group = [row_sorted[0]]
        for word in row_sorted[1:]:
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


def parse_source_questions(path: Path) -> List[Tuple[int, str]]:
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
                    cleaned = clean_line(text)
                    if not cleaned:
                        continue
                    if any(p.match(cleaned) for p in HEADER_PATTERNS):
                        continue
                    lines.append((x, cleaned))
                if lines:
                    min_x = min(x for x, _ in lines)
                    bundles.append({"threshold": min_x + 12.0, "lines": lines})

    blocks = defaultdict(list)
    current_no = None
    current_lines: List[str] = []

    def flush() -> None:
        nonlocal current_no, current_lines
        if current_no is not None:
            blocks[int(current_no)].append(current_lines[:])
        current_no = None
        current_lines = []

    for bundle in bundles:
        threshold = float(bundle["threshold"])
        for x, text in bundle["lines"]:
            m = Q_START_RE.match(text)
            if m and x <= threshold:
                qno = int(m.group(1))
                if 1 <= qno <= 20:
                    flush()
                    current_no = qno
                    rest = normalize_space(m.group(2))
                    if rest:
                        current_lines.append(rest)
                    continue
            if current_no is not None:
                current_lines.append(text)

    flush()

    out: List[Tuple[int, str]] = []
    for qno in range(1, 21):
        best = ""
        best_len = -1
        for lines in blocks.get(qno, []):
            joined = " ".join(lines)
            joined = normalize_space(joined)
            if not joined:
                continue
            joined = CHOICE_MARK_RE.split(joined)[0]
            joined = normalize_space(joined)
            if not joined:
                continue
            if len(joined) > best_len:
                best = joined
                best_len = len(joined)
        if best:
            out.append((qno, best))
    return out


def detect_type(stem: str) -> str:
    if re.search(r"사이", stem):
        return "between"
    if re.search(r"이후|뒤", stem):
        return "after"
    if re.search(r"시기|재위", stem):
        return "sameEra"
    if re.search(r"원인|배경|결과|영향", stem):
        return "cause"
    return "factual"


def tokenize_keywords(text: str) -> List[str]:
    tokens = re.findall(r"[가-힣]{2,}", text)
    out = []
    for token in tokens:
        if token in STOPWORDS:
            continue
        if token not in out:
            out.append(token)
    return out


def grade_by_count(c: float, s_cut: float, a_cut: float) -> str:
    if c >= s_cut:
        return "S"
    if c >= a_cut:
        return "A"
    return "B"


def main() -> None:
    source_reports = []
    stems = []
    kw_counter: Dict[str, float] = defaultdict(float)
    type_counter: Dict[str, float] = defaultdict(float)

    for filename, meta in SOURCE_META.items():
        path = PDF_DIR / filename
        report = {
            "file": filename,
            "exists": path.exists(),
            "year": int(meta["year"]),
            "exam": str(meta["exam"]),
            "weight": float(meta["weight"]),
            "detected_questions": 0,
            "stems": [],
        }
        if not path.exists():
            source_reports.append(report)
            continue

        parsed = parse_source_questions(path)
        report["detected_questions"] = len(parsed)
        report["stems"] = [
            {"no": qno, "text": stem, "type": detect_type(stem)}
            for qno, stem in parsed
        ]

        w = float(meta["weight"])
        for qno, stem in parsed:
            qtype = detect_type(stem)
            type_counter[qtype] += w
            stems.append({
                "sourceFile": filename,
                "sourceQuestionNo": qno,
                "exam": str(meta["exam"]),
                "year": int(meta["year"]),
                "type": qtype,
                "stem": stem,
            })
            for kw in tokenize_keywords(stem):
                kw_counter[kw] += w

        source_reports.append(report)

    ranked = sorted(kw_counter.items(), key=lambda x: x[1], reverse=True)
    if ranked:
        s_cut = ranked[max(int(len(ranked) * 0.30) - 1, 0)][1]
        a_cut = ranked[max(int(len(ranked) * 0.65) - 1, 0)][1]
    else:
        s_cut = a_cut = 0

    keyword_freq = [
        {
            "keyword": kw,
            "count": round(score, 3),
            "grade": grade_by_count(score, s_cut, a_cut),
            "rank": idx + 1,
        }
        for idx, (kw, score) in enumerate(ranked)
    ]

    payload = {
        "generatedAt": date.today().isoformat(),
        "sources": source_reports,
        "typeFreq": {k: round(v, 3) for k, v in sorted(type_counter.items())},
        "keywordFreq": keyword_freq,
        "questionStems": stems,
    }

    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    OUT_JS.write_text(
        "// 한국사 PDF 기반 시드 데이터\n"
        f"const HISTORY_SOURCE_SEEDS = {json.dumps(payload, ensure_ascii=False, indent=2)};\n\n"
        "if (typeof window !== 'undefined') {\n"
        "  window.HISTORY_SOURCE_SEEDS = HISTORY_SOURCE_SEEDS;\n"
        "}\n",
        encoding="utf-8",
    )

    md_lines = [
        "# 한국사 PDF 시드 추출 요약",
        "",
        f"- 생성일: {payload['generatedAt']}",
        f"- 총 stem: {len(stems)}",
        "",
        "## 소스별 검출",
        "",
        "| 파일 | 검출 문항 |",
        "|---|---:|",
    ]
    for src in source_reports:
        md_lines.append(f"| {src['file']} | {src['detected_questions']} |")

    md_lines.extend([
        "",
        "## 유형 빈도",
        "",
        "| 유형 | 가중치 빈도 |",
        "|---|---:|",
    ])
    for t, v in sorted(type_counter.items(), key=lambda x: x[1], reverse=True):
        md_lines.append(f"| {t} | {v:.3f} |")

    md_lines.extend([
        "",
        "## 상위 키워드",
        "",
        "| 키워드 | 빈도 | 등급 |",
        "|---|---:|---|",
    ])
    for row in keyword_freq[:30]:
        md_lines.append(f"| {row['keyword']} | {row['count']:.3f} | {row['grade']} |")

    summary = ROOT / "analysis" / f"history_source_summary_{date.today().isoformat()}.md"
    summary.write_text("\n".join(md_lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
