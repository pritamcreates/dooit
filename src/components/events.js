/**
 * @module components/events
 * @description Upcoming events tracking.
 */

import { state } from '../store.js';
import { saveEvents } from '../services/db.js';
import { escHtml, formatTime12Hour } from '../lib/utils.js';

export function initEvents() {
  // Bind inputs if present in UI (calendar panel)
  const addBtn = document.getElementById('add-event-btn');
  addBtn?.addEventListener('click', () => {
    const title = document.getElementById('new-event-title')?.value?.trim();
    const date = document.getElementById('new-event-date')?.value;
    const time = document.getElementById('new-event-time')?.value;
    
    if (title && date) {
      addEvent(title, date, time);
      document.getElementById('new-event-title').value = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.matches('.event-del-btn')) deleteEvent(e.target.dataset.id);
  });
}

export function renderEvents() {
  const list = document.getElementById('events-list');
  if (!list) return;

  const events = state.upcomingEvents || [];
  
  // Clean up old events (before yesterday)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const cutoff = yesterday.toISOString().split('T')[0];
  
  const validEvents = events.filter(e => e.date >= cutoff);
  if (validEvents.length !== events.length) {
    state.upcomingEvents = validEvents;
    saveEvents(); // async save
  }

  // Sort by date then time
  validEvents.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    if (a.time && b.time) return a.time.localeCompare(b.time);
    return 0;
  });

  if (validEvents.length === 0) {
    list.innerHTML = '<div class="event-empty">No upcoming events.</div>';
    return;
  }

  list.innerHTML = validEvents.map(e => {
    const d = new Date(e.date);
    const dateStr = d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
    const timeStr = formatTime12Hour(e.time);
    const isPast = e.date < state.today;

    return `
      <div class="event-item ${isPast ? 'past' : ''}">
        <div class="event-item-main">
          <div class="event-item-title">${escHtml(e.title)}</div>
          <div class="event-item-meta">${dateStr}${timeStr ? ' at ' + timeStr : ''}</div>
        </div>
        <button class="event-del-btn" data-id="${e.id}">×</button>
      </div>
    `;
  }).join('');
}

export function addEvent(title, date, time) {
  state.upcomingEvents.push({
    id: `evt_${Date.now()}`,
    title,
    date,
    time: time || null,
    createdAt: new Date().toISOString()
  });
  saveEvents();
  renderEvents();
}

export function deleteEvent(id) {
  state.upcomingEvents = state.upcomingEvents.filter(e => e.id !== id);
  saveEvents();
  renderEvents();
}

window.addEvent = addEvent;
window.deleteEvent = deleteEvent;
