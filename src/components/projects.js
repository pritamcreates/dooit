/**
 * @module components/projects
 * @description Projects panel — create, list, drill into, and delete projects.
 */

import { state } from '../store.js';
import { saveProjects, saveTasks } from '../services/db.js';
import { escHtml } from '../lib/utils.js';

let _panelOpen = false;

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

export function initProjects() {
  const toggle = document.getElementById('projects-panel-toggle');
  const addBtn = document.querySelector('#projects-panel .projects-add-form button');
  const input  = document.getElementById('new-project-name');

  toggle?.addEventListener('click', toggleProjectsPanel);

  addBtn?.addEventListener('click', () => {
    const name = input?.value?.trim();
    if (name) { createProject(name); input.value = ''; }
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const name = input.value.trim();
      if (name) { createProject(name); input.value = ''; }
    }
  });

  document.addEventListener('click', (e) => {
    const panel = document.getElementById('projects-panel');
    const btn   = document.getElementById('projects-panel-toggle');
    if (_panelOpen && panel && !panel.contains(e.target) && !btn?.contains(e.target)) {
      _panelOpen = false;
      panel.classList.remove('open');
    }
  });
}

// ─────────────────────────────────────────────────────────────
// PANEL
// ─────────────────────────────────────────────────────────────

export function toggleProjectsPanel() {
  _panelOpen = !_panelOpen;
  const panel = document.getElementById('projects-panel');
  panel?.classList.toggle('open', _panelOpen);
  if (_panelOpen) renderProjects();
}

// ─────────────────────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────────────────────

export function renderProjects() {
  const list = document.getElementById('projects-panel-list');
  const countBadge = document.getElementById('projects-panel-count');
  if (!list) return;

  const projects = state.projectDefs ?? [];
  const tasks    = state.tasks ?? [];

  // Update project select dropdowns across the app
  _syncProjectSelects(projects);

  if (countBadge) {
    const count = projects.length;
    countBadge.textContent = count;
    countBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  if (projects.length === 0) {
    list.innerHTML = '<div class="projects-empty">No projects yet.</div>';
    return;
  }

  list.innerHTML = projects.map((proj) => {
    const projTasks  = tasks.filter(t => t.projectId === proj.id && t.date === state.today);
    const doneCount  = projTasks.filter(t => t.status === 'done').length;
    const totalCount = projTasks.length;
    const pct        = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    return `
      <div class="project-row" data-project-id="${proj.id}">
        <div class="project-row-main">
          <span class="project-row-dot" style="background:${proj.color ?? '#888'}"></span>
          <span class="project-row-name">${escHtml(proj.name)}</span>
          <span class="project-row-count">${doneCount}/${totalCount}</span>
        </div>
        <div class="project-row-bar-wrap">
          <div class="project-row-bar" style="width:${pct}%"></div>
        </div>
        <div class="project-row-actions">
          <button class="project-drill-btn" data-id="${proj.id}">View</button>
          <button class="project-delete-btn" data-id="${proj.id}">×</button>
        </div>
      </div>
    `;
  }).join('');

  // Delegate clicks inside the rendered list
  list.querySelectorAll('.project-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteProject(btn.dataset.id);
    });
  });

  list.querySelectorAll('.project-drill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      drillIntoProject(btn.dataset.id);
    });
  });
}

// ─────────────────────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────────────────────

export function createProject(name) {
  const COLORS = ['#6366f1','#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6','#ec4899'];
  const id = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const color = COLORS[state.projectDefs.length % COLORS.length];
  state.projectDefs.push({ id, name: name.trim(), color, createdAt: new Date().toISOString() });
  saveProjects();
  renderProjects();
}

export function deleteProject(id) {
  state.projectDefs = state.projectDefs.filter(p => p.id !== id);
  // Unassign tasks that belonged to this project
  state.tasks.forEach(t => { if (t.projectId === id) t.projectId = null; });
  saveProjects();
  saveTasks();
  renderProjects();
}

export function drillIntoProject(id) {
  const project = state.projectDefs.find(p => p.id === id);
  if (!project) return;

  state.selectedProjectId = id;
  const tasks = state.tasks.filter(t => t.projectId === id);

  const modal = document.getElementById('modal-content');
  const overlay = document.getElementById('modal-overlay');
  if (!modal || !overlay) return;

  const doneCount = tasks.filter(t => t.status === 'done').length;

  modal.innerHTML = `
    <button class="modal-close-btn" id="proj-modal-close">×</button>
    <div class="proj-modal-header">
      <span class="proj-modal-dot" style="background:${project.color}"></span>
      <h2 class="proj-modal-title">${escHtml(project.name)}</h2>
      <span class="proj-modal-stat">${doneCount} / ${tasks.length} done</span>
    </div>
    <div class="proj-modal-tasks">
      ${tasks.length === 0
        ? '<p class="proj-modal-empty">No tasks assigned to this project.</p>'
        : tasks.map(t => `
          <div class="proj-modal-task ${t.status === 'done' ? 'done' : ''}">
            <span class="proj-modal-task-status">${t.status === 'done' ? '✓' : '○'}</span>
            <span class="proj-modal-task-name">${escHtml(t.text)}</span>
            <span class="proj-modal-task-priority">${t.priority}</span>
          </div>
        `).join('')
      }
    </div>
  `;

  overlay.classList.add('open');
  document.getElementById('proj-modal-close')?.addEventListener('click', closeModal);
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/** Sync all project <select> dropdowns in the app */
function _syncProjectSelects(projects) {
  document.querySelectorAll('select.project-select, #new-task-project').forEach(sel => {
    const current = sel.value;
    sel.innerHTML = '<option value="">No project</option>' +
      projects.map(p => `<option value="${p.id}">${escHtml(p.name)}</option>`).join('');
    sel.value = current;
  });
}

// ─────────────────────────────────────────────────────────────
// PUBLIC: expose to HTML event handlers
// ─────────────────────────────────────────────────────────────
window.toggleProjectsPanel  = toggleProjectsPanel;
window.createProjectFromInput = () => {
  const input = document.getElementById('new-project-name');
  const name  = input?.value?.trim();
  if (name) { createProject(name); input.value = ''; }
};

function closeModal() {
  document.getElementById('modal-overlay')?.classList.remove('open');
}
window.closeModal = closeModal;
