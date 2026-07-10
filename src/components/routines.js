/**
 * @module components/routines
 * @description Recurring routines tracking.
 */

import { state } from '../store.js';
import { saveRoutines } from '../services/db.js';
import { escHtml } from '../lib/utils.js';

export function initRoutines() {
  const header = document.querySelector('.rs-header');
  header?.addEventListener('click', () => {
    const body = document.getElementById('rs-body');
    body?.classList.toggle('open');
  });

  const addBtn = document.getElementById('rs-add-btn');
  addBtn?.addEventListener('click', () => {
    const name = document.getElementById('new-routine-name')?.value?.trim();
    const freq = parseInt(document.getElementById('new-routine-freq')?.value || '1', 10);
    const unit = document.getElementById('new-routine-unit')?.value || 'days';
    
    let intervalDays = freq;
    if (unit === 'weeks') intervalDays = freq * 7;
    if (unit === 'months') intervalDays = freq * 30;

    if (name) {
      addRoutine(name, intervalDays);
      document.getElementById('new-routine-name').value = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.matches('.rs-item-done-btn')) completeRoutine(e.target.dataset.id);
    if (e.target.matches('.rs-item-del')) deleteRoutine(e.target.dataset.id);
  });
}

export function renderRoutines() {
  const list = document.getElementById('rs-list');
  const badge = document.getElementById('rs-due-badge');
  const empty = document.getElementById('rs-empty');
  if (!list) return;

  const routines = state.routines || [];
  
  if (routines.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    if (badge) badge.style.display = 'none';
    return;
  }

  if (empty) empty.style.display = 'none';

  let dueCount = 0;
  list.innerHTML = routines.map(r => {
    const due = isRoutineDue(r);
    if (due) dueCount++;
    const doneToday = (r.completions || []).includes(state.today);
    
    let badgeHtml = '';
    if (due && !doneToday) badgeHtml = `<span class="rs-next-due-badge due">DUE</span>`;
    else if (doneToday) badgeHtml = `<span class="rs-next-due-badge ok">Done today</span>`;
    
    return `
      <div class="rs-item">
        <div class="rs-item-status ${due && !doneToday ? 'due' : ''}"></div>
        <div class="rs-item-main">
          <div class="rs-item-name">${escHtml(r.name)}</div>
          <div class="rs-item-meta">Every ${r.intervalDays} days</div>
        </div>
        ${badgeHtml}
        ${doneToday 
          ? `<button class="rs-item-done-btn completed">✓</button>`
          : `<button class="rs-item-done-btn" data-id="${r.id}">Done</button>`
        }
        <button class="rs-item-del" data-id="${r.id}">×</button>
      </div>
    `;
  }).join('');

  if (badge) {
    badge.textContent = `${dueCount} due`;
    badge.style.display = dueCount > 0 ? 'inline-block' : 'none';
  }
}

export function addRoutine(name, intervalDays) {
  state.routines.push({
    id: `rout_${Date.now()}`,
    name,
    intervalDays,
    completions: [],
    createdAt: new Date().toISOString()
  });
  saveRoutines();
  renderRoutines();
}

export function completeRoutine(id) {
  const r = state.routines.find(x => x.id === id);
  if (!r) return;
  if (!r.completions) r.completions = [];
  if (!r.completions.includes(state.today)) {
    r.completions.push(state.today);
    saveRoutines();
    renderRoutines();
  }
}

export function deleteRoutine(id) {
  state.routines = state.routines.filter(r => r.id !== id);
  saveRoutines();
  renderRoutines();
}

export function isRoutineDue(routine) {
  if (!routine.completions || routine.completions.length === 0) return true;
  
  // Sort completions descending
  const sorted = [...routine.completions].sort((a,b) => new Date(b) - new Date(a));
  const lastDate = new Date(sorted[0]);
  const now = new Date(state.today);
  
  const diffTime = Math.abs(now - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays >= routine.intervalDays;
}

window.addRoutine = addRoutine;
window.completeRoutine = completeRoutine;
window.deleteRoutine = deleteRoutine;
