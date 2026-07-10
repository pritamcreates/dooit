/**
 * @module components/planTomorrow
 * @description Plan Tomorrow strip for capturing tasks for the next day.
 */

import { state } from '../store.js';
import { savePtTasks, saveTasks } from '../services/db.js';
import { addTask, renderBoard } from './board.js';
import { escHtml } from '../lib/utils.js';

export function initPlanTomorrow() {
  const header = document.querySelector('.pt-header');
  header?.addEventListener('click', togglePlanTomorrow);

  // Bind add inputs
  ['urgent', 'important', 'later'].forEach(prio => {
    const input = document.getElementById(`pt-add-${prio}`);
    const btn = document.getElementById(`pt-btn-${prio}`);
    
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const text = input.value.trim();
        if (text) { addPtTask(prio, text); input.value = ''; }
      }
    });

    btn?.addEventListener('click', () => {
      const text = input?.value?.trim();
      if (text) { addPtTask(prio, text); input.value = ''; }
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.matches('.pt-task-del')) {
      const prio = e.target.dataset.prio;
      const idx = parseInt(e.target.dataset.index, 10);
      deletePtTask(prio, idx);
    }
  });

  document.getElementById('pt-promote-btn')?.addEventListener('click', promotePtTasks);
}

export function renderPlanTomorrow() {
  const countsEl = document.getElementById('pt-counts');
  
  if (!state.ptTasks) state.ptTasks = { urgent: [], important: [], later: [] };
  
  ['urgent', 'important', 'later'].forEach(prio => {
    const listEl = document.getElementById(`pt-col-${prio}`);
    if (!listEl) return;
    
    const tasks = state.ptTasks[prio] || [];
    
    if (tasks.length === 0) {
      listEl.innerHTML = `<div class="pt-empty">No tasks</div>`;
    } else {
      listEl.innerHTML = tasks.map((t, idx) => `
        <div class="pt-task-row">
          <div class="pt-task-text">${escHtml(t)}</div>
          <button class="pt-task-del" data-prio="${prio}" data-index="${idx}">×</button>
        </div>
      `).join('');
    }
  });

  if (countsEl) {
    countsEl.innerHTML = `
      <span class="pt-count-badge">${state.ptTasks.urgent.length} urg</span>
      <span class="pt-count-badge">${state.ptTasks.important.length} imp</span>
      <span class="pt-count-badge">${state.ptTasks.later.length} lat</span>
    `;
  }
}

export function addPtTask(priority, text) {
  if (!state.ptTasks[priority]) state.ptTasks[priority] = [];
  state.ptTasks[priority].push(text);
  savePtTasks();
  renderPlanTomorrow();
}

export function deletePtTask(priority, index) {
  if (state.ptTasks[priority]) {
    state.ptTasks[priority].splice(index, 1);
    savePtTasks();
    renderPlanTomorrow();
  }
}

export function promotePtTasks() {
  let promoted = 0;
  ['urgent', 'important', 'later'].forEach(prio => {
    if (state.ptTasks[prio]) {
      state.ptTasks[prio].forEach(text => {
        addTask(text, prio);
        promoted++;
      });
      state.ptTasks[prio] = [];
    }
  });
  
  if (promoted > 0) {
    savePtTasks();
    saveTasks();
    renderPlanTomorrow();
    renderBoard();
    togglePlanTomorrow(); // collapse it
  }
}

export function togglePlanTomorrow() {
  state.ptOpen = !state.ptOpen;
  const body = document.getElementById('pt-body');
  const icon = document.getElementById('pt-toggle-icon');
  
  if (state.ptOpen) {
    body?.classList.add('open');
    if (icon) icon.textContent = '▲';
  } else {
    body?.classList.remove('open');
    if (icon) icon.textContent = '▼';
  }
}

window.addPtTask = addPtTask;
window.deletePtTask = deletePtTask;
window.promotePtTasks = promotePtTasks;
window.togglePlanTomorrow = togglePlanTomorrow;
