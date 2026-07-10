/**
 * @module services/firebase
 * @description Lazy-loaded Firebase initialization.
 */

import { FIREBASE_CONFIG, CDN_BASE } from '../config.js';

let _initialized = false;

window._db = null;
window._auth = null;
window._app = null;
window._uid = null;

/**
 * Dynamically imports and initializes Firebase SDK from CDN.
 * @returns {Promise<{db: any, auth: any}>}
 */
export async function initFirebase() {
  if (_initialized) return { db: window._db, auth: window._auth };

  try {
    const { initializeApp } = await import(`${CDN_BASE}/firebase-app.js`);
    const { getFirestore } = await import(`${CDN_BASE}/firebase-firestore.js`);
    const { getAuth } = await import(`${CDN_BASE}/firebase-auth.js`);

    const app = initializeApp(FIREBASE_CONFIG);
    const db = getFirestore(app);
    const auth = getAuth(app);

    window._app = app;
    window._db = db;
    window._auth = auth;
    
    _initialized = true;
    return { db, auth };
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    throw error;
  }
}

/**
 * Returns initialized Firestore instance.
 * @returns {any}
 */
export function getDb() {
  if (!window._db) throw new Error("Firestore not initialized.");
  return window._db;
}

/**
 * Returns initialized Auth instance.
 * @returns {any}
 */
export function getAuth() {
  if (!window._auth) throw new Error("Auth not initialized.");
  return window._auth;
}

/**
 * Returns current User ID.
 * @returns {string|null}
 */
export function getUid() {
  return window._uid || null;
}
