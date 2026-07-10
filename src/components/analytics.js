/**
 * @module components/analytics
 * @description Progress charts, productivity analytics, and weekly/daily reports.
 */

import { state } from '../store.js';
import { formatDuration } from '../lib/utils.js';

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

export function initAnalytics() {
  // Progress tab buttons
  document.addEventListener('click', (e) => {
    if (e.target.matches('.progress-tab-btn')) {
      state.activeProgressTab = e.target.dataset.tab;
      document.querySelectorAll('.progress-tab-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.tab === state.activeProgressTab)
      );
      renderProgressCharts();
    }
    if (e.target.id === 'show-reports-btn') showReportsModal();
    if (e.target.id === 'daily-report-generate') generateDailyReport();
    if (e.target.id === 'weekly-report-generate') generateWeeklyReport();
    if (e.target.id === 'daily-report-toggle') switchReportView('daily');
    if (e.target.id === 'weekly-report-toggle') switchReportView('weekly');
  });
}

// ─────────────────────────────────────────────────────────────
// PROGRESS CHARTS
// ─────────────────────────────────────────────────────────────

export function renderProgressCharts() {
  const tab   = state.activeProgressTab ?? 'day';
  const tasks = state.tasks ?? [];
  const today = state.today;

  if (tab === 'day') _renderDayChart(tasks, today);
  else if (tab === 'week') _renderWeekChart(tasks, today);
  else if (tab === 'month') _renderMonthChart(tasks, today);
}

function _renderDayChart(tasks, today) {
  const container = document.getElementById('progress-chart-area');
  if (!container) return;

  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7am–8pm
  const doneTasks = tasks.filter(t => t.status === 'done' && t.date === today && t.completedAt);

  const bars = hours.map(hr => {
    const label = hr > 12 ? `${hr - 12}pm` : hr === 12 ? '12pm' : `${hr}am`;
    const inHour = doneTasks.filter(t => {
      const comp = new Date(t.completedAt);
      return comp.getHours() === hr;
    }).length;
    return { label, count: inHour };
  });

  const maxCount = Math.max(1, ...bars.map(b => b.count));

  container.innerHTML = `
    <div class="day-bar-chart">
      ${bars.map(b => `
        <div class="day-bar-wrap" title="${b.count} tasks at ${b.label}">
          <div class="day-bar-fill" style="height:${(b.count / maxCount) * 100}%"></div>
          <div class="day-bar-label">${b.label}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function _renderWeekChart(tasks, today) {
  const container = document.getElementById('progress-chart-area');
  if (!container) return;

  const days = _getWeekDays(today, state.analyticsWeekOffset ?? 0);

  const bars = days.map(({ label, iso }) => {
    const count = tasks.filter(t => t.status === 'done' && t.date === iso).length;
    return { label, count, iso };
  });

  const maxCount = Math.max(1, ...bars.map(b => b.count));

  container.innerHTML = `
    <div class="week-nav">
      <button class="week-nav-btn" id="week-prev">←</button>
      <span class="week-nav-label">${_weekLabel(days)}</span>
      <button class="week-nav-btn" id="week-next" ${state.analyticsWeekOffset === 0 ? 'disabled' : ''}>→</button>
    </div>
    <div class="day-bar-chart">
      ${bars.map(b => `
        <div class="day-bar-wrap ${b.iso === today ? 'today' : ''}" title="${b.count} tasks on ${b.label}">
          <div class="day-bar-fill" style="height:${(b.count / maxCount) * 100}%"></div>
          <div class="day-bar-label">${b.label}</div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('week-prev')?.addEventListener('click', () => {
    state.analyticsWeekOffset = (state.analyticsWeekOffset ?? 0) - 1;
    renderProgressCharts();
  });
  document.getElementById('week-next')?.addEventListener('click', () => {
    state.analyticsWeekOffset = Math.min(0, (state.analyticsWeekOffset ?? 0) + 1);
    renderProgressCharts();
  });
}

function _renderMonthChart(tasks, today) {
  const container = document.getElementById('progress-chart-area');
  if (!container) return;

  const now   = new Date(today);
  const year  = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const counts = Array.from({ length: daysInMonth }, (_, i) => {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
    return tasks.filter(t => t.status === 'done' && t.date === iso).length;
  });
  const maxCount = Math.max(1, ...counts);

  container.innerHTML = `
    <div class="month-bar-chart">
      ${counts.map((count, i) => `
        <div class="month-bar-wrap" title="Day ${i + 1}: ${count} done">
          <div class="month-bar-fill" style="height:${(count / maxCount) * 100}%"></div>
        </div>
      `).join('')}
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
// DONE LIST (panel)
// ─────────────────────────────────────────────────────────────

export function renderDoneList() {
  const container = document.getElementById('done-list-panel');
  if (!container) return;

  const today = state.today;
  const done  = (state.tasks ?? [])
    .filter(t => t.status === 'done' && t.date === today)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  if (done.length === 0) {
    container.innerHTML = '<div class="done-empty">Completed tasks will appear here.</div>';
    return;
  }

  container.innerHTML = done.map(t => {
    const elapsed = t.totalElapsed ? formatDuration(t.totalElapsed) : '—';
    const time    = t.completedAt
      ? new Date(t.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
    return `
      <div class="done-item">
        <span class="done-item-check">✓</span>
        <span class="done-item-name">${t.text}</span>
        <span class="done-item-meta">${elapsed}${time ? ' · ' + time : ''}</span>
      </div>
    `;
  }).join('');
}

// ─────────────────────────────────────────────────────────────
// REPORTS MODAL
// ─────────────────────────────────────────────────────────────

export function showReportsModal() {
  const overlay = document.getElementById('reports-modal-overlay');
  if (!overlay) return;
  overlay.classList.add('open');

  // Default: set today's date in the date input
  const dateInput = document.getElementById('daily-report-date');
  if (dateInput && !dateInput.value) dateInput.value = state.today;
}

export function closeReportsModal() {
  document.getElementById('reports-modal-overlay')?.classList.remove('open');
}

export function switchReportView(view) {
  const daily  = document.getElementById('daily-report-view');
  const weekly = document.getElementById('weekly-report-view');
  const dBtn   = document.getElementById('daily-report-toggle');
  const wBtn   = document.getElementById('weekly-report-toggle');

  if (view === 'daily') {
    daily?.style.setProperty('display', 'block');
    weekly?.style.setProperty('display', 'none');
    dBtn?.classList.add('active');
    wBtn?.classList.remove('active');
  } else {
    daily?.style.setProperty('display', 'none');
    weekly?.style.setProperty('display', 'block');
    dBtn?.classList.remove('active');
    wBtn?.classList.add('active');
  }
}

export function generateDailyReport() {
  const date     = document.getElementById('daily-report-date')?.value ?? state.today;
  const tasks    = (state.tasks ?? []).filter(t => t.date === date);
  const done     = tasks.filter(t => t.status === 'done');
  const total    = tasks.length;
  const timeMs   = done.reduce((sum, t) => sum + (t.totalElapsed ?? 0), 0);
  const content  = document.getElementById('daily-report-content');
  if (!content) return;

  content.innerHTML = `
    <div class="report-summary">
      <div class="report-kpi"><span class="report-kpi-val">${done.length}</span><span class="report-kpi-lbl">Completed</span></div>
      <div class="report-kpi"><span class="report-kpi-val">${total - done.length}</span><span class="report-kpi-lbl">Pending</span></div>
      <div class="report-kpi"><span class="report-kpi-val">${formatDuration(timeMs)}</span><span class="report-kpi-lbl">Time tracked</span></div>
    </div>
    <div class="report-task-list">
      ${done.length === 0
        ? '<p class="report-empty">No completed tasks on this date.</p>'
        : done.map(t => `
            <div class="report-task-row">
              <span class="report-task-name">${t.text}</span>
              <span class="report-task-time">${t.totalElapsed ? formatDuration(t.totalElapsed) : '—'}</span>
              <span class="report-task-priority report-priority-${t.priority}">${t.priority}</span>
            </div>
          `).join('')
      }
    </div>
  `;
}

export function generateWeeklyReport() {
  const from  = document.getElementById('weekly-report-from')?.value;
  const to    = document.getElementById('weekly-report-to')?.value;
  const content = document.getElementById('weekly-report-content');
  if (!content || !from || !to) {
    if (content) content.innerHTML = '<p class="report-empty">Please select a date range.</p>';
    return;
  }

  const tasks = (state.tasks ?? []).filter(t => t.date >= from && t.date <= to);
  const done  = tasks.filter(t => t.status === 'done');
  const timeMs = done.reduce((sum, t) => sum + (t.totalElapsed ?? 0), 0);

  const byDay = {};
  done.forEach(t => {
    byDay[t.date] = (byDay[t.date] ?? 0) + 1;
  });
  const bestDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0];

  content.innerHTML = `
    <div class="report-summary">
      <div class="report-kpi"><span class="report-kpi-val">${done.length}</span><span class="report-kpi-lbl">Tasks done</span></div>
      <div class="report-kpi"><span class="report-kpi-val">${formatDuration(timeMs)}</span><span class="report-kpi-lbl">Time tracked</span></div>
      <div class="report-kpi"><span class="report-kpi-val">${bestDay ? bestDay[1] : 0}</span><span class="report-kpi-lbl">Best day</span></div>
    </div>
    <div class="report-task-list">
      ${done.length === 0
        ? '<p class="report-empty">No completed tasks in this range.</p>'
        : done.map(t => `
            <div class="report-task-row">
              <span class="report-task-date">${t.date}</span>
              <span class="report-task-name">${t.text}</span>
              <span class="report-task-time">${t.totalElapsed ? formatDuration(t.totalElapsed) : '—'}</span>
            </div>
          `).join('')
      }
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function _getWeekDays(today, offset = 0) {
  const now = new Date(today);
  const day = now.getDay(); // 0=Sun
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((day + 6) % 7) + offset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    const iso   = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en', { weekday: 'short' });
    return { iso, label };
  });
}

function _weekLabel(days) {
  const first = new Date(days[0].iso);
  const last  = new Date(days[6].iso);
  const fmt   = (d) => d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  return `${fmt(first)} – ${fmt(last)}`;
}

// ─────────────────────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────────────────────
window.closeReportsModal    = closeReportsModal;
window.generateDailyReport  = generateDailyReport;
window.generateWeeklyReport = generateWeeklyReport;
window.switchReportView     = switchReportView;
