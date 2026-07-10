/**
 * @module components/header
 * @description Main application header and quick-add logic.
 */

import { state } from '../store.js';
import { addTask } from './board.js';
import { parseTaskInput } from '../lib/utils.js';

let _scoreInterval = null;

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

export function initHeader() {
  // Quick Add Event Listeners
  const input = document.getElementById('new-task-text');
  const addBtn = document.getElementById('add-task-btn');
  const expandBtn = document.getElementById('qa-expand-btn');
  
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleQuickAdd();
  });
  
  addBtn?.addEventListener('click', handleQuickAdd);
  
  expandBtn?.addEventListener('click', () => {
    const qa = document.getElementById('qa-expanded');
    qa?.classList.toggle('open');
    expandBtn.classList.toggle('active');
  });

  // End of Day Button
  document.getElementById('show-summary-btn-header')?.addEventListener('click', () => {
    // Requires a summary component logic which we can attach to window if needed
    if (typeof window.showSummary === 'function') window.showSummary();
  });

  // Score Updater
  renderScore();
  _scoreInterval = setInterval(renderScore, 30_000);
  document.addEventListener('dooit:task-completed', renderScore);
}

// ─────────────────────────────────────────────────────────────
// QUICK ADD LOGIC
// ─────────────────────────────────────────────────────────────

function handleQuickAdd() {
  const input = document.getElementById('new-task-text');
  const text = input?.value?.trim();
  if (!text) return;

  const parsed = parseTaskInput(text);
  
  const projSelect = document.getElementById('new-task-project');
  const prioSelect = document.getElementById('new-task-priority');
  
  const projectId = projSelect?.value || null;
  const priority = (prioSelect?.value) || parsed.priority;

  // Time overrides
  let start = parsed.start;
  let end = parsed.end;

  const sh = document.getElementById('new-task-start-hour')?.value;
  const sm = document.getElementById('new-task-start-minute')?.value;
  const sa = document.getElementById('new-task-start-ampm')?.value;
  if (sh && sm) {
    let hr = parseInt(sh, 10);
    if (sa === 'PM' && hr < 12) hr += 12;
    if (sa === 'AM' && hr === 12) hr = 0;
    start = `${String(hr).padStart(2,'0')}:${sm.padStart(2,'0')}`;
  }

  addTask(parsed.text, priority, start, end, projectId);
  
  // Reset fields
  input.value = '';
  const qa = document.getElementById('qa-expanded');
  const expandBtn = document.getElementById('qa-expand-btn');
  if (qa?.classList.contains('open')) {
    qa.classList.remove('open');
    expandBtn?.classList.remove('active');
  }
}

// ─────────────────────────────────────────────────────────────
// SCORE LOGIC
// ─────────────────────────────────────────────────────────────

export function renderScore() {
  const today = state.today;
  const tasks = state.tasks ?? [];
  const doneToday = tasks.filter(t => t.date === today && t.status === 'done');
  
  const numEl = document.getElementById('header-score-num');
  const gradeEl = document.getElementById('header-score-grade');
  const barEl = document.getElementById('header-score-bar');

  if (tasks.filter(t => t.date === today).length === 0 && doneToday.length === 0) {
    if (numEl) numEl.textContent = '—';
    if (gradeEl) gradeEl.textContent = 'Ready';
    if (barEl) barEl.style.width = '0%';
    return;
  }

  // Base score = (Done Tasks * 10) + min(Elapsed Minutes, 50)
  const elapsedMs = doneToday.reduce((sum, t) => sum + (t.totalElapsed || 0), 0);
  const elapsedMins = Math.floor(elapsedMs / 60000);
  
  let score = (doneToday.length * 10) + Math.min(elapsedMins, 50);
  
  // Bonus for challenge checkins
  const challengeCheckins = (state.challenges ?? []).filter(c => c.completions?.includes(today)).length;
  score += challengeCheckins * 5;

  score = Math.min(100, Math.max(0, score));

  let grade = 'Off track';
  if (score === 0) grade = 'Ready';
  else if (score < 25) grade = 'Getting started';
  else if (score < 50) grade = 'Building momentum';
  else if (score < 75) grade = 'Good progress';
  else if (score < 90) grade = 'Strong day';
  else grade = 'Exceptional';

  if (numEl) numEl.textContent = score;
  if (gradeEl) gradeEl.textContent = grade;
  if (barEl) barEl.style.width = `${score}%`;
}

// ─────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────

export function toggleMoreMenu() {
  const menu = document.getElementById('more-menu-dropdown');
  if (menu) menu.classList.toggle('open');
}

window.toggleMoreMenu = toggleMoreMenu;


