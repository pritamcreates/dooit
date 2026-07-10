/**
 * @module services/auth
 * @description Google One-Tap authentication integrated with Firebase.
 */

import { GOOGLE_CLIENT_ID, CDN_BASE } from '../config.js';
import { initFirebase, getAuth } from './firebase.js';

let _callbacks = { onSignIn: null, onSignOut: null };

/**
 * Initializes Google One-Tap and Firebase Auth listeners.
 * @param {Object} callbacks
 * @param {Function} callbacks.onSignIn
 * @param {Function} callbacks.onSignOut
 */
export async function initAuth(callbacks) {
  _callbacks = callbacks;
  const { auth } = await initFirebase();
  const { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } = await import(`${CDN_BASE}/firebase-auth.js`);

  // Handle Firebase Auth state changes
  onAuthStateChanged(auth, (user) => {
    const authArea = document.getElementById('auth-area');
    const authNote = document.getElementById('auth-status-note');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    const googleBtn = document.getElementById('google-signin-button');

    if (authArea) authArea.style.visibility = 'visible';

    if (user) {
      window._uid = user.uid;
      if (authNote) authNote.style.display = 'none';
      if (googleBtn) googleBtn.style.display = 'none';
      
      if (userInfo) userInfo.style.display = 'flex';
      if (userName) userName.textContent = user.displayName?.split(' ')[0] || 'User';
      if (userAvatar && user.photoURL) {
        userAvatar.src = user.photoURL;
        userAvatar.style.display = 'block';
      }
      
      if (_callbacks.onSignIn) _callbacks.onSignIn(user);
    } else {
      window._uid = null;
      if (authNote) authNote.style.display = 'block';
      if (userInfo) userInfo.style.display = 'none';
      if (googleBtn) googleBtn.style.display = 'block';
      
      _renderGoogleOneTap();
      if (_callbacks.onSignOut) _callbacks.onSignOut();
    }
  });

  // Attach Google One-Tap callback globally so the script can find it
  window._handleGoogleCredentialResponse = async (response) => {
    try {
      const credential = GoogleAuthProvider.credential(response.credential);
      await signInWithCredential(auth, credential);
    } catch (error) {
      console.error("Firebase auth error via Google credential:", error);
    }
  };
}

function _renderGoogleOneTap() {
  if (typeof window.google === 'undefined' || !window.google.accounts) return;
  const btnDiv = document.getElementById('google-signin-button');
  if (!btnDiv) return;

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: window._handleGoogleCredentialResponse,
    context: 'signin',
    ux_mode: 'popup',
    auto_select: false,
    cancel_on_tap_outside: true
  });
  
  window.google.accounts.id.renderButton(btnDiv, {
    theme: "outline",
    size: "medium",
    type: "standard",
    shape: "rectangular",
    text: "signin_with",
    logo_alignment: "left"
  });
  
  window.google.accounts.id.prompt();
}

/**
 * Signs the user out.
 */
export async function signOut() {
  try {
    const auth = getAuth();
    const { signOut: firebaseSignOut } = await import(`${CDN_BASE}/firebase-auth.js`);
    await firebaseSignOut(auth);
    
    // Clear unsubscribers if they exist
    if (window._unsub) {
      Object.values(window._unsub).forEach(u => u && u());
      window._unsub = {};
    }
  } catch (error) {
    console.error("Sign out error:", error);
  }
}

/**
 * Returns current user object.
 * @returns {any|null}
 */
export function getCurrentUser() {
  if (!window._auth) return null;
  return window._auth.currentUser;
}

window.signOut = signOut;
