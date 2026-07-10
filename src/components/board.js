/**
 * @module components/board
 * @description Main task board and drag-and-drop orchestration.
 */

import { state } from '../store.js';
import { saveTasks } from '../services/db.js';
import { escHtml, formatDuration, getElapsed, getPlannedMinutes, today } from '../lib/utils.js';
import { renderRibbon } from './ribbon.js';
import { renderProjects } from './projects.js';
import { FOCUS_LIMIT } from '../config.js';

let _timerInterval = null;
let _dragSourceId = null;

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

export function initBoard() {
  document.addEventListener('dooit:tasks-updated', () => renderBoard());
  document.addEventListener('dooit:cache-loaded', () => renderBoard());

  // Global tick for active task timer
  _timerInterval = setInterval(() => {
    if (state.activeTaskId && !state.isFocusMode) {
      const task = state.tasks.find(t => t.id === state.activeTaskId);
      if (task) {
        const elapsed = getElapsed(task);
        const timerEl = document.getElementById(`timer-${task.id}`);
        if (timerEl) timerEl.textContent = formatDuration(elapsed);
      }
    }
  }, 1000);

  // Global click delegate for board actions
  document.addEventListener('click', (e) => {
    const t = e.target;
    
    // Toggle card expansion
    const card = t.closest('.task-card');
    if (card && t.classList.contains('task-name')) {
      card.classList.toggle('collapsed');
      return;
    }

    if (t.matches('.start-btn')) startTask(t.dataset.id);
    if (t.matches('.pause-btn')) pauseTask(t.dataset.id);
    if (t.matches('.resume-btn')) resumeTask(t.dataset.id);
    if (t.matches('.done-btn')) completeTask(t.dataset.id);
    if (t.matches('.del-btn')) deleteTask(t.dataset.id);
    if (t.matches('.cf-collapse-hint')) toggleCarryForwardCollapse();
    if (t.matches('.cf-rescue-all-btn')) rescheduleAllUnfinished();
  });
}

// ─────────────────────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────────────────────

export function renderBoard() {
  const currentDay = state.today;
  const cols = ['previous_unfinished', 'urgent', 'important', 'later'];
  
  cols.forEach(col => {
    const listEl = document.querySelector(`#col-${col.replace('_','-')} .task-list`);
    const countEl = document.querySelector(`#col-${col.replace('_','-')} .count`);
    if (!listEl) return;

    let colTasks;
    if (col === 'previous_unfinished') {
      colTasks = state.tasks.filter(t => t.date !== currentDay && t.status !== 'done' && t.status !== 'previous_unfinished');
    } else {
      colTasks = state.tasks.filter(t => t.date === currentDay && t.priority === col && t.status !== 'done');
    }

    if (countEl) countEl.textContent = `(${colTasks.length})`;

    if (colTasks.length === 0) {
      listEl.innerHTML = `<div class="board-empty-state">
        <p>Drop tasks here</p>
      </div>`;
    } else {
      const showLimit = col === 'previous_unfinished' ? colTasks.length : FOCUS_LIMIT;
      const visible = colTasks.slice(0, showLimit);
      const hidden = colTasks.length - showLimit;

      listEl.innerHTML = visible.map(t => _buildCard(t)).join('');
      
      if (hidden > 0) {
        listEl.innerHTML += `<div class="col-show-more">+ ${hidden} more</div>`;
      }
    }
  });

  renderRibbon();
  renderProjects(); // Updates project completion bars
}

function _buildCard(task) {
  const elapsed = getElapsed(task);
  const planned = getPlannedMinutes(task);
  const isRunning = task.status === 'in_progress';
  const isPaused = task.status === 'paused';
  
  let classes = 'task-card';
  if (isRunning) classes += ' in-progress';
  else if (isPaused) classes += ' paused collapsed';
  else classes += ' collapsed'; // pending tasks start collapsed
  
  if (task._justAdded) {
    classes += ' flash-in';
    delete task._justAdded;
  }

  const proj = state.projectDefs.find(p => p.id === task.projectId);
  const projTag = proj ? `<span class="task-proj-tag" style="color:${proj.color}">[${escHtml(proj.name)}]</span> ` : '';

  return `
    <div class="${classes}" data-id="${task.id}" id="card-${task.id}" draggable="true" ondragstart="window.dragStart(event, '${task.id}')" ondragend="window.dragEnd()">
      <div class="task-header">
        <div class="task-name">${projTag}${escHtml(task.text)}</div>
        <div class="task-expand-hint">tap to expand</div>
        ${task.plannedStart ? `<div class="task-time-planned">${task.plannedStart}</div>` : ''}
      </div>
      <div class="task-body">
        <div class="task-timer" id="timer-${task.id}">${formatDuration(elapsed)}</div>
        ${planned > 0 ? `<div class="task-planned-label">Planned: ${planned}m</div>` : ''}
        ${task.note ? `<div class="task-note-snippet">${escHtml(task.note)}</div>` : ''}
        <div class="task-controls">
          ${isRunning ? `
            <button class="pause-btn" data-id="${task.id}">Pause</button>
            <button class="done-btn" data-id="${task.id}">Done</button>
          ` : isPaused ? `
            <button class="resume-btn" data-id="${task.id}">Resume</button>
            <button class="done-btn" data-id="${task.id}">Done</button>
          ` : `
            <button class="start-btn" data-id="${task.id}">Start</button>
            <button class="done-btn" data-id="${task.id}">Done</button>
          `}
          <button class="del-btn" data-id="${task.id}" style="margin-left:auto;opacity:0.6;">Del</button>
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────────────

export function addTask(text, priority, start, end, projectId) {
  const task = {
    id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    text,
    priority,
    status: 'pending',
    date: state.today,
    projectId: projectId || null,
    plannedStart: start || null,
    plannedEnd: end || null,
    totalElapsed: 0,
    breaks: [],
    _justAdded: true
  };
  state.tasks.push(task);
  saveTasks();
  renderBoard();
}

export function startTask(id) {
  if (state.activeTaskId && state.activeTaskId !== id) {
    pauseTask(state.activeTaskId);
  }
  
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  if (task.status === 'pending') {
    task.startedAt = new Date().toISOString();
  } else if (task.status === 'paused' && task.breaks.length > 0) {
    task.breaks[task.breaks.length - 1].end = new Date().toISOString();
  }
  
  task.status = 'in_progress';
  task.date = state.today; // Pull forward if from previous day
  state.activeTaskId = id;
  
  saveTasks();
  renderBoard();
}

export function pauseTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  if (task.status === 'in_progress') {
    task.breaks = task.breaks || [];
    task.breaks.push({ start: new Date().toISOString() });
    task.status = 'paused';
    task.totalElapsed = getElapsed(task);
    if (state.activeTaskId === id) state.activeTaskId = null;
    saveTasks();
    renderBoard();
  }
}

export function resumeTask(id) {
  startTask(id);
}

export function completeTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  if (task.status === 'in_progress') pauseTask(id);
  task.status = 'done';
  task.completedAt = new Date().toISOString();
  
  if (state.activeTaskId === id) state.activeTaskId = null;
  
  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.classList.add('done-flash');
    setTimeout(() => {
      saveTasks();
      renderBoard();
      document.dispatchEvent(new CustomEvent('dooit:task-completed'));
    }, 400);
  } else {
    saveTasks();
    renderBoard();
    document.dispatchEvent(new CustomEvent('dooit:task-completed'));
  }
}

export function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  if (state.activeTaskId === id) state.activeTaskId = null;
  saveTasks();
  renderBoard();
}

// ─────────────────────────────────────────────────────────────
// DRAG & DROP
// ─────────────────────────────────────────────────────────────

window.dragStart = (e, id) => {
  _dragSourceId = id;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', id);
  setTimeout(() => document.getElementById(`card-${id}`)?.classList.add('dragging'), 0);
};

window.dragEnd = () => {
  if (_dragSourceId) {
    document.getElementById(`card-${_dragSourceId}`)?.classList.remove('dragging');
  }
  _dragSourceId = null;
  document.querySelectorAll('.column').forEach(c => c.classList.remove('drag-over'));
};

window.dragOver = (e, priority) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const colId = priority === 'previous_unfinished' ? 'previous-unfinished' : priority;
  const col = document.getElementById(`col-${colId}`);
  if (col && !col.classList.contains('drag-over')) {
    col.classList.add('drag-over');
  }
};

window.dragLeave = (e) => {
  const col = e.currentTarget;
  if (col) col.classList.remove('drag-over');
};

window.dropTask = (e, priority) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const task = state.tasks.find(t => t.id === id);
  document.querySelectorAll('.column').forEach(c => c.classList.remove('drag-over'));
  
  if (task) {
    if (priority === 'previous_unfinished') return; // Cannot drop into carry-forward
    task.priority = priority;
    if (task.date !== state.today) task.date = state.today; // Moving forwards updates date
    saveTasks();
    renderBoard();
  }
};

// ─────────────────────────────────────────────────────────────
// CARRY FORWARD
// ─────────────────────────────────────────────────────────────

export function toggleCarryForwardCollapse() {
  const col = document.getElementById('col-previous-unfinished');
  if (col) col.classList.toggle('collapsed');
}

export function rescheduleAllUnfinished() {
  const oldTasks = state.tasks.filter(t => t.date !== state.today && t.status !== 'done');
  oldTasks.forEach(t => {
    t.date = state.today;
  });
  saveTasks();
  renderBoard();
}

// Expose these explicitly
window.toggleCarryForwardCollapse = toggleCarryForwardCollapse;
window.rescheduleAllUnfinished = rescheduleAllUnfinished;
