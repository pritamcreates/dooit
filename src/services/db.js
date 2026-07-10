/**
 * @module services/db
 * @description Firestore read/write operations and localStorage fallbacks.
 */

import { state } from '../store.js';
import { initFirebase, getDb, getUid } from './firebase.js';
import { CDN_BASE } from '../config.js';
import { debounce, normalizeTask } from '../lib/utils.js';

let _lastSyncedTaskIds = new Set();
let _saveTasksBatchTimeout = null;

export function setSyncStatus(status) {
  const el = document.getElementById('sync-status');
  if (!el) return;
  el.className = '';
  
  if (status === 'syncing') {
    el.innerHTML = '<span class="status-dot amber"></span>Syncing';
    el.classList.add('syncing');
  } else if (status === 'error') {
    el.innerHTML = '<span class="status-dot red"></span>Offline';
    el.classList.add('error');
  } else if (status === 'saved') {
    el.innerHTML = '<span class="status-dot green"></span>Saved';
    el.classList.add('saved');
    setTimeout(() => {
      if (el.classList.contains('saved')) {
        el.innerHTML = '';
        el.className = '';
      }
    }, 3000);
  } else {
    el.innerHTML = '';
  }
}

/**
 * Writes data to a Firestore document path.
 * @param {string} docPath
 * @param {Object} data
 * @param {boolean} [merge=false]
 */
export async function fsSet(docPath, data, merge = false) {
  const uid = getUid();
  if (!uid) return;
  try {
    const { doc, setDoc } = await import(`${CDN_BASE}/firebase-firestore.js`);
    const db = getDb();
    await setDoc(doc(db, docPath), data, { merge });
  } catch (err) {
    console.error(`fsSet error [${docPath}]:`, err);
    setSyncStatus('error');
  }
}

/**
 * Deletes a Firestore document path.
 * @param {string} docPath
 */
export async function fsDelete(docPath) {
  const uid = getUid();
  if (!uid) return;
  try {
    const { doc, deleteDoc } = await import(`${CDN_BASE}/firebase-firestore.js`);
    const db = getDb();
    await deleteDoc(doc(db, docPath));
  } catch (err) {
    console.error(`fsDelete error [${docPath}]:`, err);
    setSyncStatus('error');
  }
}

/**
 * Pulls all user data from Firestore on initial load.
 */
export async function pullAll() {
  const uid = getUid();
  if (!uid) return;
  
  setSyncStatus('syncing');
  
  try {
    const { doc, getDoc, collection, getDocs, onSnapshot } = await import(`${CDN_BASE}/firebase-firestore.js`);
    const db = getDb();

    // 1. Pull Tasks (one-time fetch, listener set up separately)
    const tasksSnap = await getDocs(collection(db, `users/${uid}/tasks`));
    const tasks = [];
    _lastSyncedTaskIds.clear();
    tasksSnap.forEach(d => {
      const data = d.data();
      tasks.push(normalizeTask(data));
      _lastSyncedTaskIds.add(data.id);
    });
    state.tasks = tasks;

    // 2. Pull Meta Documents
    const metaNames = [
      { key: 'ptTasks', docId: 'ptTasks' },
      { key: 'upcomingEvents', docId: 'events' },
      { key: 'routines', docId: 'routines' },
      { key: 'challenges', docId: 'challenges' },
      { key: 'projectDefs', docId: 'projects' }
    ];

    for (const meta of metaNames) {
      const snap = await getDoc(doc(db, `users/${uid}/meta/${meta.docId}`));
      if (snap.exists()) {
        const data = snap.data();
        if (meta.key === 'ptTasks') {
          state.ptTasks = {
            urgent: data.urgent || [],
            important: data.important || [],
            later: data.later || []
          };
        } else {
          state[meta.key] = data.items || [];
        }
      }
    }

    setSyncStatus('saved');
    saveToLocalStorage(); // cache
    startListeners();

  } catch (err) {
    console.error("pullAll error:", err);
    setSyncStatus('error');
    loadFromLocalStorage(); // fallback
  }
}

/**
 * Sets up real-time listener for tasks.
 */
export async function startListeners() {
  const uid = getUid();
  if (!uid) return;

  const { collection, onSnapshot } = await import(`${CDN_BASE}/firebase-firestore.js`);
  const db = getDb();

  window._unsub = window._unsub || {};
  if (window._unsub.tasks) window._unsub.tasks();

  window._unsub.tasks = onSnapshot(collection(db, `users/${uid}/tasks`), (snap) => {
    if (snap.metadata.hasPendingWrites) return; // Ignore local echoes

    const freshTasks = [];
    snap.forEach(d => freshTasks.push(normalizeTask(d.data())));
    
    // Check if we need to update state (e.g., changes from another tab)
    // For simplicity, we just overwrite state and re-render board.
    // In a fully robust app, we'd merge cautiously if a task is active.
    state.tasks = freshTasks;
    _lastSyncedTaskIds.clear();
    freshTasks.forEach(t => _lastSyncedTaskIds.add(t.id));
    
    // Trigger board re-render event
    document.dispatchEvent(new CustomEvent('dooit:tasks-updated'));
  });
}

/**
 * Batch saves tasks to Firestore (debounced).
 */
export const saveTasks = debounce(() => {
  _saveTasksBatch();
}, 600);

async function _saveTasksBatch() {
  const uid = getUid();
  if (!uid) return;
  
  try {
    const { writeBatch, doc } = await import(`${CDN_BASE}/firebase-firestore.js`);
    const db = getDb();
    const batch = writeBatch(db);

    const currentIds = new Set();
    state.tasks.forEach(task => {
      currentIds.add(task.id);
      batch.set(doc(db, `users/${uid}/tasks/${task.id}`), task);
    });

    // Delete tasks that were removed
    _lastSyncedTaskIds.forEach(oldId => {
      if (!currentIds.has(oldId)) {
        batch.delete(doc(db, `users/${uid}/tasks/${oldId}`));
      }
    });

    await batch.commit();
    _lastSyncedTaskIds = currentIds;
    saveToLocalStorage();
  } catch (err) {
    console.error("saveTasks error:", err);
    setSyncStatus('error');
  }
}

// Singular saves for meta collections
export const saveRoutines = debounce(() => {
  const uid = getUid();
  if (uid) fsSet(`users/${uid}/meta/routines`, { items: state.routines });
  saveToLocalStorage();
}, 400);

export const saveChallenges = debounce(() => {
  const uid = getUid();
  if (uid) fsSet(`users/${uid}/meta/challenges`, { items: state.challenges });
  saveToLocalStorage();
}, 400);

export const savePtTasks = debounce(() => {
  const uid = getUid();
  if (uid) fsSet(`users/${uid}/meta/ptTasks`, state.ptTasks);
  saveToLocalStorage();
}, 400);

export const saveEvents = debounce(() => {
  const uid = getUid();
  if (uid) fsSet(`users/${uid}/meta/events`, { items: state.upcomingEvents });
  saveToLocalStorage();
}, 400);

export const saveProjects = debounce(() => {
  const uid = getUid();
  if (uid) fsSet(`users/${uid}/meta/projects`, { items: state.projectDefs });
  saveToLocalStorage();
}, 400);

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE CACHE (Offline Fallback)
// ─────────────────────────────────────────────────────────────

export function saveToLocalStorage() {
  const data = {
    tasks: state.tasks,
    ptTasks: state.ptTasks,
    routines: state.routines,
    challenges: state.challenges,
    events: state.upcomingEvents,
    projects: state.projectDefs
  };
  localStorage.setItem('dooit_offline_cache', JSON.stringify(data));
}

export function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem('dooit_offline_cache');
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.tasks) state.tasks = data.tasks;
    if (data.ptTasks) state.ptTasks = data.ptTasks;
    if (data.routines) state.routines = data.routines;
    if (data.challenges) state.challenges = data.challenges;
    if (data.events) state.upcomingEvents = data.events;
    if (data.projects) state.projectDefs = data.projects;
    document.dispatchEvent(new CustomEvent('dooit:cache-loaded'));
  } catch (e) {
    console.error("Local storage load failed", e);
  }
}
