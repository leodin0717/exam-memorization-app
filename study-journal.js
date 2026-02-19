(function (window) {
  'use strict';

  const STORAGE_KEY = 'study_journal_v1';
  const MAX_EVENTS = 30000;

  const SUBJECT_NAMES = {
    law: '행정법',
    admin: '행정학',
    kor: '국어',
    eng: '영어',
    his: '한국사'
  };

  function safeParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function loadStore() {
    const parsed = safeParse(localStorage.getItem(STORAGE_KEY), null);
    if (!parsed || typeof parsed !== 'object') {
      return { version: 1, events: [] };
    }
    const events = Array.isArray(parsed.events) ? parsed.events : [];
    return {
      version: 1,
      events
    };
  }

  function saveStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function toDateKey(ts) {
    const d = new Date(Number.isFinite(ts) ? ts : Date.now());
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function uniq(items) {
    return [...new Set((items || []).filter(Boolean).map(v => String(v).trim()).filter(Boolean))];
  }

  function normalizeSubject(subject) {
    const key = String(subject || '').toLowerCase();
    if (SUBJECT_NAMES[key]) return key;
    return 'law';
  }

  function normalizeMode(mode) {
    const key = String(mode || '').toLowerCase();
    if (!key) return 'study';
    return key;
  }

  function normalizeImportance(importance) {
    if (importance === 'S' || importance === 'A' || importance === 'B') return importance;
    return '';
  }

  function normalizeSec(sec) {
    const value = Number(sec);
    if (!Number.isFinite(value) || value < 0) return 0;
    return Number(value.toFixed(1));
  }

  function buildId(ts) {
    const rand = Math.random().toString(36).slice(2, 8);
    return `sj_${Number(ts).toString(36)}_${rand}`;
  }

  function applyLimit(events) {
    if (events.length <= MAX_EVENTS) return events;
    return events.slice(events.length - MAX_EVENTS);
  }

  function logAttempt(input) {
    if (!input || typeof input !== 'object') return null;

    const ts = Number.isFinite(input.ts) ? Number(input.ts) : Date.now();
    const sec = normalizeSec(input.sec);
    const slowThreshold = Number.isFinite(input.slowThreshold) ? Math.max(1, Number(input.slowThreshold)) : 9;
    const correct = input.correct === null ? null : input.correct === undefined ? null : Boolean(input.correct);

    const event = {
      id: input.id ? String(input.id) : buildId(ts),
      ts,
      date: toDateKey(ts),
      subject: normalizeSubject(input.subject),
      mode: normalizeMode(input.mode),
      qid: String(input.qid || ''),
      chapter: String(input.chapter || ''),
      topic: String(input.topic || ''),
      importance: normalizeImportance(input.importance),
      correct,
      sec,
      slow: input.slow === undefined ? sec >= slowThreshold : Boolean(input.slow),
      tags: uniq(input.tags),
      metaReasons: uniq(input.metaReasons || input.reasons),
      source: String(input.source || ''),
      note: String(input.note || '')
    };

    const store = loadStore();
    store.events.push(event);
    store.events = applyLimit(store.events);
    saveStore(store);
    return event.id;
  }

  function appendMeta(eventId, input) {
    if (!eventId) return false;
    const store = loadStore();
    for (let i = store.events.length - 1; i >= 0; i -= 1) {
      const row = store.events[i];
      if (String(row.id) !== String(eventId)) continue;
      row.tags = uniq([...(row.tags || []), ...uniq(input?.tags)]);
      row.metaReasons = uniq([...(row.metaReasons || []), ...uniq(input?.metaReasons || input?.reasons)]);
      if (input && typeof input.note === 'string' && input.note.trim()) {
        row.note = input.note.trim();
      }
      saveStore(store);
      return true;
    }
    return false;
  }

  function getEvents(options) {
    const opts = options || {};
    const store = loadStore();
    let rows = [...store.events];

    if (opts.subject) {
      const subject = normalizeSubject(opts.subject);
      rows = rows.filter(r => r.subject === subject);
    }

    if (opts.date) {
      rows = rows.filter(r => r.date === opts.date);
    }

    if (Number.isFinite(opts.days) && opts.days > 0) {
      const cutoff = Date.now() - (opts.days * 86400000);
      rows = rows.filter(r => Number(r.ts || 0) >= cutoff);
    }

    if (opts.sort === 'asc') {
      rows.sort((a, b) => Number(a.ts || 0) - Number(b.ts || 0));
    } else {
      rows.sort((a, b) => Number(b.ts || 0) - Number(a.ts || 0));
    }

    return rows;
  }

  function getDates(limit) {
    const max = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 30;
    const dates = uniq(getEvents({ sort: 'desc' }).map(r => r.date));
    return dates.slice(0, max);
  }

  function summarizeRows(rows) {
    const attempts = rows.length;
    const gradedRows = rows.filter(r => r.correct !== null);
    const graded = gradedRows.length;
    const correct = gradedRows.filter(r => r.correct === true).length;
    const wrong = gradedRows.filter(r => r.correct === false).length;
    const deferred = attempts - graded;
    const totalSec = rows.reduce((acc, r) => acc + (Number(r.sec) || 0), 0);
    const slow = rows.filter(r => r.slow).length;

    const tagCounts = {};
    const reasonCounts = {};
    const modeCounts = {};
    const importanceCounts = {};

    rows.forEach(row => {
      modeCounts[row.mode] = (modeCounts[row.mode] || 0) + 1;
      if (row.importance) importanceCounts[row.importance] = (importanceCounts[row.importance] || 0) + 1;
      (row.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
      (row.metaReasons || []).forEach(reason => {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      });
    });

    return {
      attempts,
      graded,
      correct,
      wrong,
      deferred,
      slow,
      totalSec: Number(totalSec.toFixed(1)),
      avgSec: attempts ? Number((totalSec / attempts).toFixed(1)) : 0,
      accuracy: graded ? Number((correct / graded).toFixed(3)) : 0,
      modeCounts,
      importanceCounts,
      tagCounts,
      reasonCounts
    };
  }

  function summarizeDay(dateKey) {
    const rows = getEvents({ date: dateKey, sort: 'desc' });
    const bySubject = {};

    rows.forEach(row => {
      if (!bySubject[row.subject]) bySubject[row.subject] = [];
      bySubject[row.subject].push(row);
    });

    const subjects = {};
    Object.keys(bySubject).forEach(subject => {
      subjects[subject] = summarizeRows(bySubject[subject]);
    });

    return {
      date: dateKey,
      total: summarizeRows(rows),
      subjects,
      rows
    };
  }

  function summarizeRange(days) {
    const rows = getEvents({ days: Number.isFinite(days) ? days : 7, sort: 'desc' });
    const dateMap = {};
    rows.forEach(row => {
      if (!dateMap[row.date]) dateMap[row.date] = [];
      dateMap[row.date].push(row);
    });

    const dates = Object.keys(dateMap).sort((a, b) => b.localeCompare(a));
    const daily = dates.map(date => ({
      date,
      ...summarizeRows(dateMap[date])
    }));

    return {
      days: Number.isFinite(days) ? days : 7,
      total: summarizeRows(rows),
      daily
    };
  }

  function getWeakBySubject(days, limitPerSubject) {
    const maxRows = Number.isFinite(limitPerSubject) ? Math.max(1, Math.floor(limitPerSubject)) : 8;
    const rows = getEvents({ days: Number.isFinite(days) ? days : 14, sort: 'desc' });
    const map = {};

    rows.forEach(row => {
      const key = `${row.subject}::${row.qid || row.topic || row.chapter}`;
      if (!map[key]) {
        map[key] = {
          subject: row.subject,
          qid: row.qid || '',
          chapter: row.chapter || '',
          topic: row.topic || '',
          importance: row.importance || 'B',
          attempts: 0,
          graded: 0,
          correct: 0,
          wrong: 0,
          slow: 0,
          totalSec: 0,
          lastTs: 0,
          modes: {},
          reasons: {}
        };
      }

      const agg = map[key];
      agg.attempts += 1;
      agg.totalSec += Number(row.sec || 0);
      if (row.correct !== null) {
        agg.graded += 1;
        if (row.correct) agg.correct += 1;
        else agg.wrong += 1;
      }
      if (row.slow) agg.slow += 1;
      agg.lastTs = Math.max(agg.lastTs, Number(row.ts || 0));
      agg.modes[row.mode] = (agg.modes[row.mode] || 0) + 1;
      (row.metaReasons || []).forEach(reason => {
        agg.reasons[reason] = (agg.reasons[reason] || 0) + 1;
      });
    });

    const grouped = {};
    Object.values(map).forEach(row => {
      const accuracy = row.graded ? row.correct / row.graded : 0;
      const wrongRate = row.graded ? row.wrong / row.graded : 0;
      const slowRate = row.attempts ? row.slow / row.attempts : 0;
      const avgSec = row.attempts ? row.totalSec / row.attempts : 0;

      let score = 0;
      score += wrongRate * 2.2;
      score += slowRate * 1.2;
      if (row.graded === 0) score += 0.5;
      if (row.importance === 'S') score += 0.35;
      else if (row.importance === 'A') score += 0.2;
      if (avgSec >= 10) score += 0.2;

      const ready = {
        ...row,
        avgSec: Number(avgSec.toFixed(1)),
        accuracy: Number(accuracy.toFixed(3)),
        score: Number(score.toFixed(3)),
        lastDate: toDateKey(row.lastTs)
      };

      if (!grouped[row.subject]) grouped[row.subject] = [];
      grouped[row.subject].push(ready);
    });

    Object.keys(grouped).forEach(subject => {
      grouped[subject].sort((a, b) => b.score - a.score || b.lastTs - a.lastTs);
      grouped[subject] = grouped[subject].slice(0, maxRows);
    });

    return grouped;
  }

  function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function getSubjectName(subject) {
    return SUBJECT_NAMES[normalizeSubject(subject)] || '과목';
  }

  window.StudyJournal = {
    storageKey: STORAGE_KEY,
    logAttempt,
    appendMeta,
    getEvents,
    getDates,
    summarizeDay,
    summarizeRange,
    getWeakBySubject,
    getSubjectName,
    clearAll
  };
})(window);
