(function () {
  'use strict';

  const SUBJECT_ORDER = ['law', 'admin', 'kor', 'eng', 'his'];
  const SUBJECT_LABELS = {
    law: '행정법',
    admin: '행정학',
    kor: '국어',
    eng: '영어',
    his: '한국사'
  };

  const REASON_LABELS = {
    scholar: '학자·이론 주체',
    framework: '분류틀·비교축',
    contrast: '반대개념 변별',
    number: '숫자·기간',
    wording: '문구 함정',
    unknown: '개념 낯섦'
  };

  const STATE = {
    page: 'daily',
    selectedDate: '',
    focusSubject: ''
  };

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function formatDateK(dateKey) {
    const raw = String(dateKey || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
    const [y, m, d] = raw.split('-');
    return `${y}.${m}.${d}`;
  }

  function formatPct(value, fallback) {
    if (!Number.isFinite(value)) return fallback || '--%';
    return `${Math.round(value * 100)}%`;
  }

  function formatMinutes(totalSec) {
    const min = (Number(totalSec || 0) / 60);
    if (!Number.isFinite(min)) return '0m';
    return `${min.toFixed(1)}m`;
  }

  function subjectName(subject) {
    return SUBJECT_LABELS[subject] || '과목';
  }

  function subjectRoute(subject) {
    if (subject === 'law') return { href: 'index.html?auto=review', label: '행정법 복습 시작' };
    if (subject === 'admin') return { href: 'admin.html?auto=review', label: '행정학 복습 시작' };
    if (subject === 'kor' || subject === 'eng') {
      return { href: `lang.html?subject=${subject}&auto=review`, label: `${subjectName(subject)} 복습 시작` };
    }
    if (subject === 'his') return { href: 'history.html?auto=retry', label: '한국사 재압축 시작' };
    return { href: 'index.html', label: '학습 시작' };
  }

  function topEntries(mapObj, limit) {
    const max = Number.isFinite(limit) ? Math.max(1, limit) : 3;
    return Object.entries(mapObj || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, max);
  }

  function setupSubjectSwitch() {
    const el = document.getElementById('subjectSwitch');
    if (!el) return;
    el.value = 'journal';
    el.addEventListener('change', e => {
      const value = e.target.value;
      if (value === 'journal') return;
      if (value === 'law') {
        window.location.href = 'index.html';
        return;
      }
      if (value === 'admin') {
        window.location.href = 'admin.html';
        return;
      }
      if (value === 'his') {
        window.location.href = 'history.html';
        return;
      }
      if (value === 'kor' || value === 'eng') {
        window.location.href = `lang.html?subject=${value}`;
      }
    });
  }

  function setupNav() {
    const nav = document.getElementById('navTabs');
    if (!nav) return;
    nav.addEventListener('click', e => {
      const tab = e.target.closest('.nav-tab');
      if (!tab) return;
      switchPage(tab.dataset.page);
    });
  }

  function switchPage(page) {
    STATE.page = page;
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.page === page);
    });
    document.querySelectorAll('.page').forEach(section => {
      section.classList.toggle('active', section.id === `page-${page}`);
    });

    if (page === 'range') renderRange();
  }

  function parseQuery() {
    const params = new URLSearchParams(window.location.search);
    const subject = params.get('subject');
    if (subject && SUBJECT_LABELS[subject]) STATE.focusSubject = subject;
    const date = params.get('date');
    if (date) STATE.selectedDate = date;
    const page = params.get('page');
    if (page) STATE.page = page;
  }

  function syncUrl() {
    const params = new URLSearchParams();
    if (STATE.focusSubject) params.set('subject', STATE.focusSubject);
    if (STATE.selectedDate) params.set('date', STATE.selectedDate);
    if (STATE.page && STATE.page !== 'daily') params.set('page', STATE.page);
    const next = params.toString();
    const path = window.location.pathname;
    window.history.replaceState({}, '', next ? `${path}?${next}` : path);
  }

  function setDateBadge(date) {
    const badge = document.getElementById('recordDateBadge');
    if (!badge) return;
    badge.textContent = formatDateK(date);
  }

  function getDatePool() {
    if (!window.StudyJournal) return [todayKey()];
    const dates = window.StudyJournal.getDates(21);
    const today = todayKey();
    if (!dates.includes(today)) dates.unshift(today);
    return dates;
  }

  function ensureSelectedDate() {
    const dates = getDatePool();
    if (!STATE.selectedDate || !dates.includes(STATE.selectedDate)) {
      STATE.selectedDate = dates[0] || todayKey();
    }
  }

  function renderDateChips() {
    const el = document.getElementById('dateChips');
    if (!el) return;
    const dates = getDatePool();
    if (!dates.length) {
      el.innerHTML = '<div class="journal-empty">기록된 학습일이 없습니다.</div>';
      return;
    }

    el.innerHTML = dates.map(date => {
      const active = date === STATE.selectedDate ? 'active' : '';
      return `<button class="journal-date-chip ${active}" data-date="${date}">${formatDateK(date)}</button>`;
    }).join('');
  }

  function renderFocusNote() {
    const el = document.getElementById('focusSubjectNote');
    if (!el) return;
    if (!STATE.focusSubject) {
      el.textContent = '전과목 통합 시야로 확인 중';
      return;
    }
    el.textContent = `현재 포커스: ${subjectName(STATE.focusSubject)} (필요한 과목만 선별 표시)`;
  }

  function filterByFocus(subjectMap) {
    if (!STATE.focusSubject) return subjectMap;
    const one = subjectMap?.[STATE.focusSubject];
    return one ? { [STATE.focusSubject]: one } : {};
  }

  function renderDailyTop(summary) {
    const total = summary?.total || { attempts: 0, accuracy: 0, totalSec: 0, slow: 0 };
    document.getElementById('dailyAttempts').textContent = String(total.attempts || 0);
    document.getElementById('dailyAccuracy').textContent = (total.graded || 0) > 0 ? formatPct(total.accuracy, '--%') : '--%';
    document.getElementById('dailyTime').textContent = formatMinutes(total.totalSec || 0);
    document.getElementById('dailySlow').textContent = String(total.slow || 0);
  }

  function renderSubjectReport(summary) {
    const el = document.getElementById('subjectReport');
    if (!el) return;

    const subjectStats = filterByFocus(summary?.subjects || {});
    const list = SUBJECT_ORDER.filter(s => subjectStats[s] && subjectStats[s].attempts > 0);

    if (!list.length) {
      el.innerHTML = '<div class="journal-empty">선택한 날짜에 저장된 학습기록이 없습니다.</div>';
      return;
    }

    el.innerHTML = list.map(subject => {
      const stats = subjectStats[subject];
      const route = subjectRoute(subject);
      const modeTop = topEntries(stats.modeCounts, 2).map(([mode, count]) => `${mode} ${count}`).join(' · ') || '기록 없음';
      const reasonTop = topEntries(stats.reasonCounts, 2)
        .map(([reason, count]) => `${REASON_LABELS[reason] || reason} ${count}`)
        .join(' · ') || '태깅 없음';

      return `<div class="journal-subject-card">
        <div class="journal-subject-head">
          <div class="journal-subject-title">${subjectName(subject)}</div>
          <span class="q-badge">${stats.attempts}회</span>
        </div>
        <div class="journal-metrics">
          <div class="journal-metric"><span>정확도</span><strong>${stats.graded > 0 ? formatPct(stats.accuracy) : '--%'}</strong></div>
          <div class="journal-metric"><span>평균속도</span><strong>${stats.avgSec.toFixed(1)}s</strong></div>
          <div class="journal-metric"><span>지연</span><strong>${stats.slow}회</strong></div>
          <div class="journal-metric"><span>오답</span><strong>${stats.wrong}회</strong></div>
        </div>
        <div class="journal-meta-line">학습방식: ${escapeHtml(modeTop)}</div>
        <div class="journal-meta-line">느린이유: ${escapeHtml(reasonTop)}</div>
        <a class="btn btn-primary journal-action-btn" href="${route.href}">${route.label}</a>
      </div>`;
    }).join('');
  }

  function renderMetaInsight(summary) {
    const el = document.getElementById('metaInsightBoard');
    if (!el) return;

    const total = summary?.total || {};
    const reasons = topEntries(total.reasonCounts, 5);
    const tags = topEntries(total.tagCounts, 6);

    if (!reasons.length && !tags.length) {
      el.innerHTML = '<div class="journal-empty">메타인지 태깅이 아직 부족합니다. 느린 이유를 체크하면 학습법 추천 정확도가 올라갑니다.</div>';
      return;
    }

    const reasonLine = reasons.length
      ? reasons.map(([k, v]) => `<span class="journal-chip">${escapeHtml(REASON_LABELS[k] || k)} · ${v}</span>`).join('')
      : '<span class="scope-note">기록된 느린 이유 없음</span>';

    const tagLine = tags.length
      ? tags.map(([k, v]) => `<span class="journal-chip alt">${escapeHtml(k)} · ${v}</span>`).join('')
      : '<span class="scope-note">기록된 태그 없음</span>';

    el.innerHTML = `
      <div class="journal-meta-block">
        <div class="journal-meta-title">느린 이유 TOP</div>
        <div class="journal-chip-wrap">${reasonLine}</div>
      </div>
      <div class="journal-meta-block" style="margin-top:10px;">
        <div class="journal-meta-title">자주 걸린 태그</div>
        <div class="journal-chip-wrap">${tagLine}</div>
      </div>
    `;
  }

  function weakReasonText(row) {
    const reasons = [];
    if (row.graded > 0 && row.accuracy < 0.75) reasons.push(`정확도 ${Math.round(row.accuracy * 100)}%`);
    if (row.slow > 0) reasons.push(`지연 ${row.slow}회`);
    const topReason = topEntries(row.reasons, 1)[0];
    if (topReason) reasons.push(`원인 ${REASON_LABELS[topReason[0]] || topReason[0]}`);
    return reasons.join(' · ') || '재인출 권장';
  }

  function renderRetrievalPlan() {
    const el = document.getElementById('retrievalPlan');
    if (!el) return;

    if (!window.StudyJournal) {
      el.innerHTML = '<div class="journal-empty">기록 엔진이 비활성화되어 있습니다.</div>';
      return;
    }

    const weakMap = window.StudyJournal.getWeakBySubject(14, 5);
    const filtered = filterByFocus(weakMap);
    const subjects = SUBJECT_ORDER.filter(subject => Array.isArray(filtered[subject]) && filtered[subject].length > 0);

    if (!subjects.length) {
      el.innerHTML = '<div class="journal-empty">최근 14일 기준 긴급 복습 대상이 없습니다. 현재 페이스를 유지하세요.</div>';
      return;
    }

    el.innerHTML = subjects.map(subject => {
      const route = subjectRoute(subject);
      const rows = filtered[subject].slice(0, 3);
      const items = rows.map(row => {
        const title = row.topic || row.chapter || row.qid || '핵심문항';
        return `<div class="journal-plan-item">
          <div class="journal-plan-topic">${escapeHtml(title)}</div>
          <div class="journal-plan-meta">${escapeHtml(weakReasonText(row))} · 평균 ${row.avgSec.toFixed(1)}초</div>
        </div>`;
      }).join('');

      return `<div class="journal-plan-card">
        <div class="journal-subject-head">
          <div class="journal-subject-title">${subjectName(subject)} 우선 복습</div>
          <span class="q-badge">${filtered[subject].length}개 후보</span>
        </div>
        <div class="journal-plan-list">${items}</div>
        <a class="btn btn-secondary journal-action-btn" href="${route.href}">${route.label}</a>
      </div>`;
    }).join('');
  }

  function renderTimeline(summary) {
    const el = document.getElementById('eventTimeline');
    if (!el) return;

    const rows = (summary?.rows || [])
      .filter(row => !STATE.focusSubject || row.subject === STATE.focusSubject)
      .slice(0, 60);

    if (!rows.length) {
      el.innerHTML = '<div class="journal-empty">타임라인에 표시할 기록이 없습니다.</div>';
      return;
    }

    el.innerHTML = rows.map(row => {
      const dt = new Date(row.ts || Date.now());
      const hh = String(dt.getHours()).padStart(2, '0');
      const mm = String(dt.getMinutes()).padStart(2, '0');
      const verdict = row.correct === null ? '보류' : row.correct ? '정답' : '오답';
      const verdictCls = row.correct === null ? 'hold' : row.correct ? 'ok' : 'ng';
      const tagLine = [...(row.metaReasons || []), ...(row.tags || [])]
        .slice(0, 4)
        .map(tag => REASON_LABELS[tag] || tag)
        .join(', ');

      return `<div class="journal-timeline-row">
        <div class="journal-time">${hh}:${mm}</div>
        <div class="journal-row-main">
          <div class="journal-row-head">
            <span class="journal-subject-badge ${row.subject}">${subjectName(row.subject)}</span>
            <span class="journal-verdict ${verdictCls}">${verdict}</span>
            <span class="q-badge">${escapeHtml(row.mode || 'study')}</span>
            <span class="q-badge">${Number(row.sec || 0).toFixed(1)}초</span>
          </div>
          <div class="journal-row-topic">${escapeHtml(row.topic || row.chapter || row.qid || '문항')}</div>
          ${tagLine ? `<div class="journal-row-tags">${escapeHtml(tagLine)}</div>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  function renderDaily() {
    if (!window.StudyJournal) return;
    ensureSelectedDate();
    setDateBadge(STATE.selectedDate);
    renderDateChips();
    renderFocusNote();

    const summary = window.StudyJournal.summarizeDay(STATE.selectedDate);
    renderDailyTop(summary);
    renderSubjectReport(summary);
    renderMetaInsight(summary);
    renderRetrievalPlan();
    renderTimeline(summary);
    syncUrl();
  }

  function renderRange() {
    if (!window.StudyJournal) return;

    const range = window.StudyJournal.summarizeRange(7);
    const summaryEl = document.getElementById('rangeSummary');
    const rowsEl = document.getElementById('rangeRows');

    if (!summaryEl || !rowsEl) return;

    summaryEl.innerHTML = `
      <div class="journal-range-grid">
        <div class="journal-range-item"><span>총 풀이</span><strong>${range.total.attempts}</strong></div>
        <div class="journal-range-item"><span>정확도</span><strong>${range.total.graded > 0 ? formatPct(range.total.accuracy) : '--%'}</strong></div>
        <div class="journal-range-item"><span>총 시간</span><strong>${formatMinutes(range.total.totalSec)}</strong></div>
        <div class="journal-range-item"><span>지연</span><strong>${range.total.slow}</strong></div>
      </div>
    `;

    if (!range.daily.length) {
      rowsEl.innerHTML = '<div class="journal-empty">최근 7일 기록이 없습니다.</div>';
      return;
    }

    rowsEl.innerHTML = range.daily.map(row => {
      const subjectSummary = window.StudyJournal.summarizeDay(row.date).subjects;
      const entries = Object.entries(filterByFocus(subjectSummary));
      const topSubject = entries.sort((a, b) => (b[1].attempts || 0) - (a[1].attempts || 0))[0];
      const topLabel = topSubject ? `${subjectName(topSubject[0])} ${topSubject[1].attempts}회` : '과목기록 없음';

      return `<button class="journal-range-row" data-date="${row.date}">
        <div class="journal-range-date">${formatDateK(row.date)}</div>
        <div class="journal-range-meta">${row.attempts}회 · ${row.graded > 0 ? formatPct(row.accuracy) : '--%'} · ${formatMinutes(row.totalSec)} · ${topLabel}</div>
      </button>`;
    }).join('');
  }

  function bindEvents() {
    const chips = document.getElementById('dateChips');
    if (chips) {
      chips.addEventListener('click', e => {
        const chip = e.target.closest('[data-date]');
        if (!chip) return;
        STATE.selectedDate = chip.dataset.date;
        renderDaily();
      });
    }

    const rows = document.getElementById('rangeRows');
    if (rows) {
      rows.addEventListener('click', e => {
        const btn = e.target.closest('[data-date]');
        if (!btn) return;
        STATE.selectedDate = btn.dataset.date;
        switchPage('daily');
        renderDaily();
      });
    }

    const todayBtn = document.getElementById('goTodayBtn');
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        STATE.selectedDate = todayKey();
        renderDaily();
      });
    }
  }

  function renderNoDataFallback() {
    const fallback = '<div class="journal-empty">아직 저장된 학습기록이 없습니다. 문제를 1개 이상 풀면 자동으로 누적됩니다.</div>';
    const subject = document.getElementById('subjectReport');
    const meta = document.getElementById('metaInsightBoard');
    const plan = document.getElementById('retrievalPlan');
    const timeline = document.getElementById('eventTimeline');
    const rangeRows = document.getElementById('rangeRows');
    const rangeSummary = document.getElementById('rangeSummary');

    if (subject) subject.innerHTML = fallback;
    if (meta) meta.innerHTML = fallback;
    if (plan) plan.innerHTML = fallback;
    if (timeline) timeline.innerHTML = fallback;
    if (rangeRows) rangeRows.innerHTML = fallback;
    if (rangeSummary) rangeSummary.innerHTML = fallback;
  }

  function init() {
    parseQuery();
    setupSubjectSwitch();
    setupNav();
    bindEvents();

    if (!window.StudyJournal) {
      renderNoDataFallback();
      return;
    }

    ensureSelectedDate();
    switchPage(STATE.page || 'daily');
    renderDaily();
    if (STATE.page === 'range') renderRange();
  }

  init();
})();
