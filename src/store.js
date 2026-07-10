/**
 * @module store
 * @description Shared application state. Imported as a mutable singleton
 *   by all components — mutations are immediately visible everywhere.
 *   Deliberately imperative; reactivity is driven by explicit render calls.
 */

/** @type {string} ISO date string for today, e.g. "2025-07-10" */
const _today = new Date().toISOString().split('T')[0];

/**
 * Central application state.
 * All components import this object and mutate it directly.
 * After mutations, components call the relevant render function.
 *
 * @typedef {Object} AppState
 */
export const state = {
  // ── Task data ──────────────────────────────────────────────
  tasks:          [],
  activeTaskId:   null,
  today:          _today,

  // ── Plan Tomorrow ──────────────────────────────────────────
  ptTasks: { urgent: [], important: [], later: [] },
  ptOpen:  false,

  // ── Projects ───────────────────────────────────────────────
  projectDefs:       [],
  selectedProjectId: null,

  // ── Events ─────────────────────────────────────────────────
  upcomingEvents: [],

  // ── Routines & Challenges ──────────────────────────────────
  routines:   [],
  challenges: [],

  // ── Notifications ──────────────────────────────────────────
  currentDayNotifications: [],
  firedNotifications:      new Set(),
  firedEventNotifications: new Set(),
  notificationPermissionGranted: false,

  // ── UI State ───────────────────────────────────────────────
  isFocusMode:         false,
  activeProgressTab:   'day',
  analyticsWeekOffset: 0,
  projectsPanelOpen:   false,
};
