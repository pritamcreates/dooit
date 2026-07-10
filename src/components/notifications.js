/**
 * @module components/notifications
 * @description In-app notification system and browser push notification scheduling.
 */

import { state } from '../store.js';
import { escHtml } from '../lib/utils.js';

/** @type {NodeJS.Timeout|null} */
let _tickInterval = null;

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

export function initNotifications() {
  const toggle   = document.getElementById('notification-panel-toggle');
  const clearBtn = document.getElementById('clear-all-notifications');

  toggle?.addEventListener('click', toggleNotificationPanel);
  clearBtn?.addEventListener('click', clearAllNotifications);

  // Close panel on outside click
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('notification-panel');
    if (panel?.classList.contains('open') &&
        !panel.contains(e.target) &&
        !toggle?.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Request browser notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(p => {
      state.notificationPermissionGranted = p === 'granted';
    });
  } else {
    state.notificationPermissionGranted = Notification?.permission === 'granted';
  }

  // Start the notification check tick (every 60s)
  _tickInterval = setInterval(checkScheduledNotifications, 60_000);
  checkScheduledNotifications(); // immediate first check
}

// ─────────────────────────────────────────────────────────────
// PANEL
// ─────────────────────────────────────────────────────────────

export function toggleNotificationPanel() {
  const panel = document.getElementById('notification-panel');
  const isOpen = panel?.classList.toggle('open');
  if (isOpen) renderNotifications();
}

// ─────────────────────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────────────────────

export function renderNotifications() {
  const list   = document.getElementById('notification-list');
  const badge  = document.getElementById('unread-notification-count');
  if (!list) return;

  const notifications = state.currentDayNotifications ?? [];
  const unread = notifications.filter(n => !n.read).length;

  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'flex' : 'none';
  }

  if (notifications.length === 0) {
    list.innerHTML = '<div class="notif-empty">No notifications yet.</div>';
    return;
  }

  list.innerHTML = notifications
    .slice()
    .reverse()
    .map((n) => `
      <div class="notif-item ${n.read ? 'read' : 'unread'}" data-id="${n.id}">
        <div class="notif-item-icon">${_iconForType(n.type)}</div>
        <div class="notif-item-body">
          <div class="notif-item-text">${escHtml(n.message)}</div>
          <div class="notif-item-time">${_relativeTime(n.createdAt)}</div>
        </div>
        <button class="notif-dismiss" data-id="${n.id}" title="Dismiss">×</button>
      </div>
    `).join('');

  // Mark all as read on open
  notifications.forEach(n => { n.read = true; });
  if (badge) badge.style.display = 'none';

  list.querySelectorAll('.notif-dismiss').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissNotification(btn.dataset.id);
    });
  });
}

// ─────────────────────────────────────────────────────────────
// NOTIFICATION MANAGEMENT
// ─────────────────────────────────────────────────────────────

/**
 * Push an in-app notification.
 * @param {string} message
 * @param {'info'|'success'|'warning'|'task'|'event'} type
 */
export function pushNotification(message, type = 'info') {
  const notif = {
    id: `notif_${Date.now()}`,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };

  if (!Array.isArray(state.currentDayNotifications)) {
    state.currentDayNotifications = [];
  }
  state.currentDayNotifications.unshift(notif);

  // Cap at 50 notifications
  if (state.currentDayNotifications.length > 50) {
    state.currentDayNotifications = state.currentDayNotifications.slice(0, 50);
  }

  // Update badge
  const badge = document.getElementById('unread-notification-count');
  const unread = state.currentDayNotifications.filter(n => !n.read).length;
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'flex' : 'none';
  }
}

export function dismissNotification(id) {
  state.currentDayNotifications = (state.currentDayNotifications ?? []).filter(n => n.id !== id);
  renderNotifications();
}

export function clearAllNotifications() {
  state.currentDayNotifications = [];
  renderNotifications();
}

// ─────────────────────────────────────────────────────────────
// SCHEDULED TASK NOTIFICATIONS
// ─────────────────────────────────────────────────────────────

export function checkScheduledNotifications() {
  const now    = new Date();
  const today  = state.today;
  const tasks  = state.tasks ?? [];
  const events = state.upcomingEvents ?? [];

  // Task start-time reminders
  tasks.forEach(task => {
    if (task.status !== 'pending' || task.date !== today) return;
    if (!task.plannedStart || state.firedNotifications?.has(task.id)) return;

    const [hour, min] = task.plannedStart.split(':').map(Number);
    const taskTime = new Date();
    taskTime.setHours(hour, min, 0, 0);

    const diffMs = taskTime - now;
    if (diffMs > 0 && diffMs <= 10 * 60 * 1000) {
      const minsAway = Math.ceil(diffMs / 60_000);
      pushNotification(`⏰ "${task.text}" starts in ${minsAway} min`, 'task');
      state.firedNotifications?.add(task.id);
      _sendBrowserNotification(`Task starting soon`, `"${task.text}" starts in ${minsAway} minutes`);
    }
  });

  // Event reminders
  events.forEach(event => {
    if (state.firedEventNotifications?.has(event.id)) return;
    if (!event.date || !event.time) return;

    const eventDt = new Date(`${event.date}T${event.time}`);
    const diffMs  = eventDt - now;

    if (diffMs > 0 && diffMs <= 30 * 60 * 1000) {
      const minsAway = Math.ceil(diffMs / 60_000);
      pushNotification(`📅 "${event.title}" in ${minsAway} min`, 'event');
      state.firedEventNotifications?.add(event.id);
      _sendBrowserNotification(`Upcoming event`, `"${event.title}" in ${minsAway} minutes`);
    }
  });
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function _sendBrowserNotification(title, body) {
  if (!state.notificationPermissionGranted) return;
  if (document.visibilityState === 'visible') return; // Don't notify if tab is active
  try {
    new Notification(title, { body, icon: '/favicon.ico' });
  } catch (_) {
    // Notification API unavailable
  }
}

function _iconForType(type) {
  const icons = { info: 'ℹ', success: '✓', warning: '⚠', task: '⏰', event: '📅' };
  return icons[type] ?? 'ℹ';
}

function _relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins   = Math.floor(diffMs / 60_000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─────────────────────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────────────────────
window.toggleNotificationPanel = toggleNotificationPanel;
window.clearAllNotifications   = clearAllNotifications;
