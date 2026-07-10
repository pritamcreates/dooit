/**
 * @module components/challenges
 * @description 21-day challenge tracking.
 */

import { state } from '../store.js';
import { saveChallenges } from '../services/db.js';
import { escHtml } from '../lib/utils.js';
import { renderScore } from './header.js';

export function initChallenges() {
  const header = document.querySelector('.cs-header');
  header?.addEventListener('click', () => {
    const body = document.getElementById('cs-body');
    body?.classList.toggle('open');
  });

  const addBtn = document.getElementById('cs-quick-add-btn');
  const input = document.getElementById('cs-quick-add-input');
  
  addBtn?.addEventListener('click', () => {
    const name = input?.value?.trim();
    if (name) { beginChallenge(name); input.value = ''; }
  });
  
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const name = input.value.trim();
      if (name) { beginChallenge(name); input.value = ''; }
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.matches('.cs-check-btn')) {
      checkInChallenge(e.target.dataset.id);
    }
    if (e.target.matches('.cs-del-btn')) {
      deleteChallenge(e.target.dataset.id);
    }
  });
}

export function renderChallenges() {
  const list = document.getElementById('cs-cards');
  const badge = document.getElementById('cs-badge');
  const empty = document.getElementById('cs-empty');
  if (!list) return;

  const challenges = state.challenges || [];
  
  if (badge) badge.textContent = `${challenges.length} active`;

  if (challenges.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  
  if (empty) empty.style.display = 'none';

  list.innerHTML = challenges.map(c => {
    const day = getTodayDayForChallenge(c);
    const doneToday = (c.completions || []).includes(state.today);
    const progressPct = Math.min(100, Math.round(((day - 1 + (doneToday ? 1 : 0)) / 21) * 100));
    
    return `
      <div class="cs-card ${doneToday ? 'done-today' : ''}">
        <div class="cs-card-name">${escHtml(c.name)}</div>
        <div class="cs-card-meta">
          <span>Day ${day} of 21</span>
          <span class="cs-card-streak">${(c.completions || []).length} total check-ins</span>
        </div>
        <div class="cs-card-progress">
          <div class="cs-card-progress-fill" style="width:${progressPct}%"></div>
        </div>
        <div class="cs-card-check">
          ${doneToday 
            ? `<button class="cs-check-btn checked">✓ Done Today</button>`
            : `<button class="cs-check-btn" data-id="${c.id}">Check in</button>`
          }
          <button class="cs-del-btn" data-id="${c.id}" style="margin-left:auto;border:none;background:transparent;opacity:0.3;cursor:pointer;font-size:0.8rem;">×</button>
        </div>
      </div>
    `;
  }).join('');
}

export function beginChallenge(name) {
  const id = `chal_${Date.now()}`;
  state.challenges.push({
    id,
    name,
    startDate: state.today,
    completions: [],
    createdAt: new Date().toISOString()
  });
  saveChallenges();
  renderChallenges();
}

export function checkInChallenge(id) {
  const c = state.challenges.find(x => x.id === id);
  if (!c) return;
  
  if (!c.completions) c.completions = [];
  if (!c.completions.includes(state.today)) {
    c.completions.push(state.today);
    saveChallenges();
    renderChallenges();
    renderScore(); // updates bonus points
  }
}

export function deleteChallenge(id) {
  state.challenges = state.challenges.filter(c => c.id !== id);
  saveChallenges();
  renderChallenges();
}

export function getTodayDayForChallenge(challenge) {
  const start = new Date(challenge.startDate);
  const now = new Date(state.today);
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays + 1;
}

window.beginChallenge = beginChallenge;
window.checkInChallenge = checkInChallenge;
window.deleteChallenge = deleteChallenge;
