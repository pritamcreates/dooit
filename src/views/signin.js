
export function render() {
    const content = `
 ── Top bar ── 
<div class="topbar">
<a class="brand" href="index.html">
<span class="brand-name">dooit</span>
<span class="brand-tag">task &amp; time</span>
</a>
<a class="back-link" href="index.html">
    ← <span>Back to homepage</span>
</a>
</div>
 ── Main ── 
<div class="page-body">
<!-- Left: value prop -->
<div class="left-panel">
<div class="left-top">
<span class="panel-eyebrow">Why sign in?</span>
<h1 class="panel-headline">
        Your work,<br/>
        everywhere<br/>
<em>you are.</em>
</h1>
<ul class="perks">
<li class="perk">
<div class="perk-icon">
<svg fill="none" height="14" viewbox="0 0 14 14" width="14">
<rect height="12" stroke="#111110" stroke-width="1.1" width="12" x="1" y="1"></rect>
<path d="M3.5 7L6 9.5L10.5 4.5" stroke="#111110" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"></path>
</svg>
</div>
<div class="perk-text">
<strong>Sync across all devices</strong>
<span>Start a task on your laptop, check progress on your phone. Everything stays in sync automatically via Firestore.</span>
</div>
</li>
<li class="perk">
<div class="perk-icon">
<svg fill="none" height="14" viewbox="0 0 14 14" width="14">
<path d="M7 1.5C7 1.5 2.5 3.5 2.5 7.5V11H11.5V7.5C11.5 3.5 7 1.5 7 1.5Z" fill="none" stroke="#111110" stroke-width="1.1"></path>
<line stroke="#111110" stroke-width="1.1" x1="1.5" x2="12.5" y1="11" y2="11"></line>
</svg>
</div>
<div class="perk-text">
<strong>Never lose your data</strong>
<span>Without sign-in, data lives only in your browser. One cleared cache and it's gone. Signed in means it's safe, always.</span>
</div>
</li>
<li class="perk">
<div class="perk-icon">
<svg fill="none" height="14" viewbox="0 0 14 14" width="14">
<rect height="10" stroke="#111110" stroke-width="1.1" width="12" x="1" y="3"></rect>
<line stroke="#111110" stroke-width="1.1" x1="1" x2="13" y1="6" y2="6"></line>
<line stroke="#111110" stroke-width="1.1" x1="4.5" x2="4.5" y1="1.5" y2="4"></line>
<line stroke="#111110" stroke-width="1.1" x1="9.5" x2="9.5" y1="1.5" y2="4"></line>
</svg>
</div>
<div class="perk-text">
<strong>Full history &amp; analytics</strong>
<span>Access your weekly analytics, daily reports, and productivity scores going back as far as you've been using dooit.</span>
</div>
</li>
<li class="perk">
<div class="perk-icon">
<svg fill="none" height="14" viewbox="0 0 14 14" width="14">
<circle cx="7" cy="7" r="5.5" stroke="#111110" stroke-width="1.1"></circle>
<line stroke="#111110" stroke-width="1.1" x1="7" x2="7" y1="7" y2="3.5"></line>
<line stroke="#111110" stroke-width="1.1" x1="7" x2="9.5" y1="7" y2="7"></line>
</svg>
</div>
<div class="perk-text">
<strong>Early access to Pro features</strong>
<span>Signed-in users get first access to upcoming Pro features — advanced reports, team projects, and more.</span>
</div>
</li>
</ul>
</div>
<div class="left-footer">
      Your data is stored securely in Google Firestore.<br/>
      We only store what you create inside dooit.<br/>
      No tracking. No ads. Ever.
    </div>
</div>
<!-- Right: sign-in card -->
<div class="right-panel">
<div class="signin-card">
<!-- Default state -->
<div id="default-state">
<div class="signin-card-header">
<h2>Welcome to dooit</h2>
<p>Sign in with Google to sync your tasks and time across all your devices. Free, always.</p>
</div>
<!-- Google Sign-In button -->
<div class="google-btn-wrap">
<div id="google-signin-btn"></div>
</div>
<div class="signin-card-footer">
          By signing in, you agree to store your task data in Google Firestore linked to your Google account. You can delete your data any time by contacting us.
        </div>
<!-- Mini app preview -->
<div class="preview-strip">
<div class="preview-strip-label">Your tasks are waiting</div>
<div class="preview-tasks">
<div class="preview-task">
<div class="preview-dot active"></div>
<span class="preview-task-name">Client proposal draft</span>
<span class="preview-task-time">10:00 – 11:30am</span>
</div>
<div class="preview-task">
<div class="preview-dot"></div>
<span class="preview-task-name">Review invoice #047</span>
<span class="preview-task-time">2:00 – 2:30pm</span>
</div>
<div class="preview-task">
<div class="preview-dot"></div>
<span class="preview-task-name">Update portfolio</span>
<span class="preview-task-time">4:00 – 5:00pm</span>
</div>
</div>
</div>
</div>
<!-- Loading state -->
<div class="loading-state" id="loading-state">
<div class="spinner"></div>
<p>Signing you in &amp; syncing your data…</p>
</div>
<!-- Success state -->
<div class="success-state" id="success-state">
<div class="success-icon">✓</div>
<h3 id="success-name">Welcome back.</h3>
<p id="success-sub">Syncing your tasks now. You'll be redirected automatically.</p>
<a class="go-btn" href="app.html" id="go-btn">Open dooit →</a>
<div class="progress-bar">
<div class="progress-fill" id="progress-fill"></div>
</div>
</div>
</div>
</div>
</div>

`;
    document.body.insertAdjacentHTML('afterbegin', content);
    
    // Execute inline scripts
    
  // ── Firebase imports ──
  import { initializeApp }
    from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
  import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged }
    from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

  // ── Config ──
  const firebaseConfig = {
    apiKey:            "AIzaSyAMacwdf0ltK-JL6_ErdR9jaV8yJlGrOJc",
    authDomain:        "letsdooit---final-edition.firebaseapp.com",
    projectId:         "letsdooit---final-edition",
    storageBucket:     "letsdooit---final-edition.firebasestorage.app",
    messagingSenderId: "162170588177",
    appId:             "1:162170588177:web:152261bfc17674451df5b0",
  };

  const GOOGLE_CLIENT_ID  = '304870276366-tkt7j2g8g0qm88pgkq22mvp4qorif7ad.apps.googleusercontent.com';
  const STORAGE_AUTH_USER = 'dooit_auth_user';
  const APP_URL           = 'app.html';

  const fbApp = initializeApp(firebaseConfig);
  const auth  = getAuth(fbApp);

  // ── State machine helpers ──
  function showState(id) {
    ['default-state', 'loading-state', 'success-state'].forEach(s => {
      document.getElementById(s).style.display = s === id ? 'block' : 'none';
    });
  }

  function showSuccessAndRedirect(user) {
    showState('success-state');
    const firstName = (user.name || 'back').split(' ')[0];
    document.getElementById('success-name').textContent = `Welcome, ${firstName}.`;
    document.getElementById('success-sub').textContent =
      `Signed in as ${user.email}. Redirecting you to dooit…`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById('progress-fill').style.width = '100%';
      });
    });
    setTimeout(() => { window.location.href = APP_URL; }, 2800);
  }

  // ── Check Firebase session first (handles page refresh / return visits) ──
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      // Already authenticated with Firebase — restore profile and redirect
      try {
        const saved = localStorage.getItem(STORAGE_AUTH_USER);
        const profile = saved ? JSON.parse(saved) : {};
        const user = {
          id:      firebaseUser.uid,
          name:    profile.name    || firebaseUser.displayName,
          email:   profile.email   || firebaseUser.email,
          picture: profile.picture || firebaseUser.photoURL,
        };
        localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(user));
        showSuccessAndRedirect(user);
      } catch(e) {
        showSuccessAndRedirect({
          id: firebaseUser.uid, name: firebaseUser.displayName,
          email: firebaseUser.email, picture: firebaseUser.photoURL,
        });
      }
    }
    // If no Firebase session, the Google button (already rendered) handles sign-in
  });

  // ── Handle Google credential response ──
  // FIX: now calls signInWithCredential so Firebase gets a real session
  window.handleCredentialResponse = async function(response) {
    showState('loading-state');
    try {
      const idToken = response.credential;

      // Decode profile for display (with correct base64 padding)
      const rawPayload = idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = rawPayload + '=='.slice(0, (4 - rawPayload.length % 4) % 4);
      const profile = JSON.parse(atob(padded));

      // Sign in to Firebase Auth — this creates the persistent session
      // that app.html's onAuthStateChanged will detect
      const credential = GoogleAuthProvider.credential(idToken);
      let uid;
      try {
        const result = await signInWithCredential(auth, credential);
        uid = result.user.uid;
      } catch(e) {
        console.warn('Firebase sign-in failed, falling back to sub:', e);
        uid = profile.sub;
      }

      const user = {
        id:      uid,
        name:    profile.name,
        email:   profile.email,
        picture: profile.picture,
      };
      localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(user));

      setTimeout(() => showSuccessAndRedirect(user), 800);

    } catch(err) {
      console.error('Auth error', err);
      showState('default-state');
      alert('Something went wrong during sign in. Please try again.');
    }
  };

  // ── Init Google Sign-In button ──
  function initGoogle() {
    if (typeof google === 'undefined' || !google.accounts?.id) {
      setTimeout(initGoogle, 150);
      return;
    }
    google.accounts.id.initialize({
      client_id:   GOOGLE_CLIENT_ID,
      callback:    window.handleCredentialResponse,
      auto_select: false,
    });
    google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large', width: '100%',
        text: 'signin_with', shape: 'rectangular', logo_alignment: 'left' }
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGoogle);
  } else {
    initGoogle();
  }


}