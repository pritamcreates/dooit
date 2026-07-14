// src/store.js
/**
 * Simple global store for in‑memory state management.
 * This follows the pattern used throughout the project – a mutable object
 * that components can import and modify directly. For a production app,
 * you would replace this with a proper state library or persistent storage.
 */
export const state = {
  // Task objects: { id, title, priority, dueDate, completed }
  tasks: [],
  // Simple notification objects: { id, message, read }
  notifications: [],
  // Currently signed‑in user (null when not authenticated)
  user: null,
};

let nextTaskId = 1;
let nextNotificationId = 1;

export function addTask({ title, priority = 'Low', dueDate = null }) {
  const task = {
    id: nextTaskId++,
    title,
    priority,
    dueDate,
    completed: false,
  };
  state.tasks.push(task);
  return task;
}

export function toggleTaskComplete(taskId) {
  const task = state.tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
  }
  return task;
}

export function addNotification(message) {
  const notification = {
    id: nextNotificationId++,
    message,
    read: false,
  };
  state.notifications.push(notification);
  return notification;
}

export function markNotificationRead(notificationId) {
  const n = state.notifications.find((n) => n.id === notificationId);
  if (n) n.read = true;
  return n;
}

export function clearNotifications() {
  state.notifications = [];
}
