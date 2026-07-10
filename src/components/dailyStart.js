/**
 * @module components/dailyStart
 * @description The daily start screen overlay shown once per day.
 */

import { state } from '../store.js';

export function initDailyStart() {
  const priorityInput = document.getElementById('dss-priority-input');
  priorityInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') closeDailyStart(false);
  });
}

export function showDailyStartScreen() {
  const lastOpened = localStorage.getItem('lastDailyStart');
  if (lastOpened === state.today) return; // Already seen today

  const screen = document.getElementById('daily-start-screen');
  if (!screen) return;

  // Greeting
  const hour = new Date().getHours();
  let greeting = 'Good evening.';
  if (hour < 12) greeting = 'Good morning.';
  else if (hour < 17) greeting = 'Good afternoon.';
  
  const greetEl = document.getElementById('dss-greeting');
  if (greetEl) greetEl.textContent = greeting;

  // Date
  const dateEl = document.getElementById('dss-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric' 
    });
  }

  // Active Challenges count
  const streakEl = document.getElementById('dss-streak');
  if (streakEl) {
    const active = (state.challenges || []).length;
    streakEl.textContent = active || '—';
  }

  // Carries
  const carries = (state.tasks || []).filter(t => t.date !== state.today && t.status !== 'done' && t.status !== 'previous_unfinished');
  const carriesEl = document.getElementById('dss-carries');
  if (carriesEl) carriesEl.textContent = carries.length;

  screen.classList.add('visible');
}

export function closeDailyStart(skip = false) {
  const screen = document.getElementById('daily-start-screen');
  if (screen) screen.classList.remove('visible');

  localStorage.setItem('lastDailyStart', state.today);

  if (!skip) {
    const input = document.getElementById('dss-priority-input');
    const priority = input?.value?.trim();
    if (priority) {
      localStorage.setItem('todayPriority', priority);
      // Optional: push an in-app notification Toast here
      if (window.pushNotification) {
        window.pushNotification(`Intention set: "${priority}"`, 'success');
      }
    }
  }
}

window.closeDailyStart = closeDailyStart;
