/**
 * @module lib/utils
 * @description General utility functions for parsing, formatting, and debouncing.
 */

/**
 * Escapes HTML to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
export function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats duration in milliseconds to HH:MM:SS
 * @param {number} ms
 * @returns {string}
 */
export function formatDuration(ms) {
  if (!ms || ms <= 0) return '—';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Converts 24-hour time string to 12-hour AM/PM format.
 * @param {string} time24 - "HH:MM"
 * @returns {string} - "h:mm AM/PM"
 */
export function formatTime12Hour(time24) {
  if (!time24) return '';
  const [hr, min] = time24.split(':');
  let h = parseInt(hr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${min} ${ampm}`;
}

/**
 * Sums break durations for a task.
 * @param {import('../store.js').Task} task
 * @returns {number} break time in ms
 */
export function getBreakTime(task) {
  if (!task.breaks || task.breaks.length === 0) return 0;
  return task.breaks.reduce((acc, br) => {
    if (!br.end) return acc;
    return acc + (new Date(br.end).getTime() - new Date(br.start).getTime());
  }, 0);
}

/**
 * Calculates current elapsed time for a task.
 * @param {import('../store.js').Task} task
 * @returns {number} total elapsed time in ms
 */
export function getElapsed(task) {
  let elapsed = task.totalElapsed || 0;
  if (task.status === 'in_progress' && task.startedAt) {
    const started = new Date(task.startedAt).getTime();
    const breaks = getBreakTime(task);
    const activeTime = Date.now() - started - breaks;
    elapsed += activeTime > 0 ? activeTime : 0;
  }
  return elapsed;
}

/**
 * Gets planned minutes from start and end time.
 * @param {import('../store.js').Task} task
 * @returns {number} minutes
 */
export function getPlannedMinutes(task) {
  if (!task.plannedStart || !task.plannedEnd) return 0;
  const [sh, sm] = task.plannedStart.split(':').map(Number);
  const [eh, em] = task.plannedEnd.split(':').map(Number);
  let diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60; // overnight crossing
  return diff;
}

/**
 * Ensures all required task fields exist.
 * @param {Partial<import('../store.js').Task>} data
 * @returns {import('../store.js').Task}
 */
export function normalizeTask(data) {
  return {
    id: data.id || `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    text: data.text || 'Untitled',
    priority: data.priority || 'important',
    status: data.status || 'pending',
    date: data.date || new Date().toISOString().split('T')[0],
    projectId: data.projectId || null,
    plannedStart: data.plannedStart || null,
    plannedEnd: data.plannedEnd || null,
    startedAt: data.startedAt || null,
    completedAt: data.completedAt || null,
    totalElapsed: data.totalElapsed || 0,
    breaks: data.breaks || [],
    note: data.note || ''
  };
}

/**
 * Creates a debounced version of a function.
 * @param {Function} fn
 * @param {number} delay - ms
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Returns today's ISO date string.
 * @returns {string} - YYYY-MM-DD
 */
export function today() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Quick-add parser for NLP-like task creation.
 * e.g., "urgent: call doctor 2pm"
 * @param {string} text
 * @returns {{text: string, priority: string, start: string|null, end: string|null}}
 */
export function parseTaskInput(text) {
  let priority = 'important';
  let t = text.trim();
  
  if (t.toLowerCase().startsWith('urgent:')) {
    priority = 'urgent';
    t = t.substring(7).trim();
  } else if (t.toLowerCase().startsWith('later:')) {
    priority = 'later';
    t = t.substring(6).trim();
  }

  // Simple time extraction matching "1pm", "1:30pm", "13:00" at the end of string
  let start = null;
  const timeRegex = /\b(\d{1,2}(?::\d{2})?(?:am|pm)?)\b$/i;
  const match = t.match(timeRegex);
  if (match) {
    t = t.replace(timeRegex, '').trim();
    // Simplified parsing to standard HH:MM
    let timeStr = match[1].toLowerCase();
    let isPm = timeStr.includes('pm');
    let isAm = timeStr.includes('am');
    timeStr = timeStr.replace('am', '').replace('pm', '');
    
    let hr, min = 0;
    if (timeStr.includes(':')) {
      const parts = timeStr.split(':');
      hr = parseInt(parts[0], 10);
      min = parseInt(parts[1], 10);
    } else {
      hr = parseInt(timeStr, 10);
    }

    if (isPm && hr < 12) hr += 12;
    if (isAm && hr === 12) hr = 0;

    start = `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  }

  return { text: t, priority, start, end: null };
}
