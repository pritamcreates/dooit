
document.addEventListener('DOMContentLoaded', () => {
    const content = `
<div class="container">
<!-- ══════════════════════════════════════
       HEADER
  ══════════════════════════════════════ -->
<header>
<div class="header-top">
<div style="display:flex;align-items:baseline;gap:4px;">
<a class="brand" href="app.html">dooit</a>
<span class="brand-tagline">21 days challenge</span>
</div>
<div class="header-actions">
<span id="sync-status" style="font-size:0.6rem;opacity:0.45;letter-spacing:0.05em;align-self:center;"></span>
<button onclick="window.location.href='app.html'">← Back to App</button>
<button id="btn-export" onclick="exportLog()" style="display:none;">Export Log</button>
<button id="btn-edit" onclick="openEditMode()" style="display:none;">Edit Challenge</button>
<button id="btn-reset" onclick="confirmReset()" style="opacity:0.5;">Reset</button>
<button id="btn-new" onclick="openSetup()">+ New Challenge</button>
</div>
</div>
</header>
<!-- ══════════════════════════════════════
       EMPTY STATE
  ══════════════════════════════════════ -->
<div id="empty-view">
<div class="empty-strip">
<div class="empty-strip-title">No challenge running.</div>
<p class="empty-strip-sub">Pick one habit. Commit to 21 days. Don't break the chain.</p>
<button onclick="openSetup()" style="padding:10px 28px;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;background:var(--text);color:var(--bg);border:1px solid var(--border);">Begin a challenge →</button>
</div>
</div>
<!-- ══════════════════════════════════════
       SETUP VIEW
  ══════════════════════════════════════ -->
<div id="setup-view" style="display:none;">
<div class="setup-header">
<h2 id="setup-title">Set your challenge</h2>
<span class="sub">One habit · 21 days</span>
</div>
<div class="setup-grid">
<div class="setup-left">
<div class="setup-field">
<label>What is your 21-day challenge?</label>
<input id="ch-name" maxlength="80" placeholder="e.g. Write 500 words every morning" type="text"/>
</div>
<div class="setup-field">
<label>Category</label>
<div class="cat-pills" id="cat-pills">
<button class="cat-pill" onclick="pickCat(this,'Health')">Health</button>
<button class="cat-pill" onclick="pickCat(this,'Mindset')">Mindset</button>
<button class="cat-pill" onclick="pickCat(this,'Craft')">Craft</button>
<button class="cat-pill" onclick="pickCat(this,'Business')">Business</button>
<button class="cat-pill" onclick="pickCat(this,'Learning')">Learning</button>
<button class="cat-pill" onclick="pickCat(this,'Fitness')">Fitness</button>
<button class="cat-pill" onclick="pickCat(this,'Finance')">Finance</button>
<button class="cat-pill" onclick="pickCat(this,'Other')">Other</button>
</div>
</div>
<div class="setup-field">
<label>What does "done" mean each day?</label>
<textarea id="ch-desc" placeholder="Done = I sat at my desk and wrote at least 500 words before 9am. Nothing less counts."></textarea>
</div>
<div class="setup-field">
<label>Why does this matter? (up to 3 reasons)</label>
<div class="why-list">
<div class="why-row"><span class="why-num">1.</span><input class="why-input" id="why-1" maxlength="100" placeholder="Because I want to finish my book this year..." type="text"/></div>
<div class="why-row"><span class="why-num">2.</span><input class="why-input" id="why-2" maxlength="100" placeholder="Because I've started and quit before..." type="text"/></div>
<div class="why-row"><span class="why-num">3.</span><input class="why-input" id="why-3" maxlength="100" placeholder="Because doing this makes me feel like myself..." type="text"/></div>
</div>
</div>
<button class="setup-start-btn" id="setup-submit-btn" onclick="submitChallenge()">Begin 21-day challenge →</button>
</div>
<div class="setup-right">
<div class="setup-preview-label">Preview</div>
<div class="setup-preview-name" id="preview-name">Your challenge name</div>
<div class="mini-chain" id="mini-chain"></div>
<div class="setup-tip"><strong>The author's rule.</strong> You're allowed to miss one day — but never two in a row. Two missed days is a new habit forming: the habit of quitting.</div>
<div class="setup-tip" style="margin-top:10px;"><strong>Identity shift.</strong> The goal isn't to do the thing. It's to become the person who does it. After 21 days, it's just who you are.</div>
<div class="setup-tip" id="preview-desc-tip" style="margin-top:10px; display:none;"><strong>Your "done" definition:</strong> <span id="preview-desc-text" style="font-style:italic;opacity:0.7;"></span></div>
</div>
</div>
</div>
<!-- ══════════════════════════════════════
       DASHBOARD VIEW
  ══════════════════════════════════════ -->
<div id="dashboard-view" style="display:none;">
<!-- Complete Banner (shown when all 21 days done) -->
<div class="complete-banner" id="complete-banner" style="display:none;">
<div class="complete-banner-left">
<div class="complete-banner-title">Challenge complete.</div>
<div class="complete-banner-sub" id="complete-sub">21 days. You did it. Now set a new one.</div>
</div>
<div class="complete-banner-actions">
<button class="btn-complete-action" onclick="exportLog()">Export log</button>
<button class="btn-complete-action" onclick="confirmReset()">New challenge</button>
</div>
</div>
<!-- Stat bar -->
<div class="stat-bar">
<div class="stat-cell">
<div class="stat-num" id="s-done">0</div>
<div class="stat-label">Days done</div>
<div class="stat-bar-fill" id="sf-done" style="width:0%"></div>
</div>
<div class="stat-cell">
<div class="stat-num" id="s-streak">0</div>
<div class="stat-label">Streak</div>
<div class="stat-bar-fill" id="sf-streak" style="width:0%"></div>
</div>
<div class="stat-cell">
<div class="stat-num" id="s-rate">—</div>
<div class="stat-label">Completion %</div>
<div class="stat-bar-fill" id="sf-rate" style="width:0%"></div>
</div>
<div class="stat-cell">
<div class="stat-num" id="s-left">21</div>
<div class="stat-label">Days left</div>
</div>
<div class="stat-cell">
<div class="stat-num" id="s-day">—</div>
<div class="stat-label">Today</div>
</div>
</div>
<!-- Main 3-col grid -->
<div class="dashboard-grid">
<!-- LEFT: Today check-in -->
<div class="panel today-panel" id="left-panel">
<div class="panel-header">
<span class="panel-title">Today's check-in</span>
<span id="today-date-tag" style="font-size:0.55rem;opacity:0.4;"></span>
</div>
<div class="panel-body">
<div class="today-day-num" id="today-big-num">1</div>
<div class="today-challenge-name" id="today-ch-name">—</div>
<div class="today-cat-tag" id="today-cat">—</div>
<input class="today-note-input" id="today-note" maxlength="120" placeholder="Quick note about today's session..." type="text"/>
<div class="today-hint">How did it go? (optional)</div>
<div class="mood-row" id="mood-row">
<button class="mood-pill" onclick="pickMood(this,5)" title="Crushed it">🔥</button>
<button class="mood-pill" onclick="pickMood(this,4)" title="Solid">✓</button>
<button class="mood-pill" onclick="pickMood(this,3)" title="Showed up">→</button>
<button class="mood-pill" onclick="pickMood(this,2)" title="Struggled">↓</button>
<button class="mood-pill" onclick="pickMood(this,1)" title="Barely">✕</button>
</div>
<button class="btn-checkin" id="checkin-btn" onclick="doCheckIn()">✓ Mark done</button>
<button class="btn-skip" id="skip-btn" onclick="doSkip()">Skip today</button>
<!-- Quote -->
<div class="quote-block">
<div class="quote-label">Daily fuel</div>
<div class="quote-text" id="q-text">—</div>
<div class="quote-author" id="q-author">—</div>
</div>
<!-- Why -->
<div class="why-display" id="why-display" style="display:none;">
<div class="why-display-label">Why you started</div>
<div id="why-list"></div>
</div>
</div>
</div>
<!-- CENTRE: Chain grid -->
<div class="panel chain-panel">
<div class="panel-header">
<span class="panel-title" id="chain-panel-title">21-day chain</span>
<span style="font-size:0.55rem;opacity:0.4;">click any past day to edit</span>
</div>
<div class="chain-progress">
<div class="chain-progress-bar-bg">
<div class="chain-progress-bar-fill" id="chain-bar" style="width:0%"></div>
</div>
<span class="chain-progress-label" id="chain-bar-label">0 / 21</span>
</div>
<div class="chain-grid" id="chain-grid"></div>
<div class="chain-legend">
<div class="legend-item"><div class="legend-swatch done-swatch"></div>Done</div>
<div class="legend-item"><div class="legend-swatch skip-swatch"></div>Skipped</div>
<div class="legend-item"><div class="legend-swatch" style="border-color:var(--text);"></div>Today</div>
<div class="legend-item"><div class="legend-swatch" style="opacity:0.3;"></div>Upcoming</div>
</div>
</div>
<!-- RIGHT col -->
<div class="right-col">
<!-- Streak panel -->
<div class="panel">
<div class="panel-header">
<span class="panel-title">Streak</span>
</div>
<div class="streak-display">
<div class="streak-big" id="streak-big">0</div>
<div class="streak-unit">day streak</div>
<div class="streak-sub" id="streak-sub">Start your streak today.</div>
</div>
<div class="mood-section">
<div class="mood-section-title">Mood — 21 days</div>
<div class="mood-bars" id="mood-bars"></div>
</div>
<div class="challenge-meta-card">
<div class="meta-row">
<span class="meta-key">Started</span>
<span class="meta-val" id="meta-started">—</span>
</div>
<div class="meta-row">
<span class="meta-key">Category</span>
<span class="meta-val" id="meta-cat">—</span>
</div>
<div class="meta-row">
<span class="meta-key">Ends</span>
<span class="meta-val" id="meta-ends">—</span>
</div>
</div>
</div>
<!-- Actions panel -->
<div class="panel actions-panel">
<div class="panel-header">
<span class="panel-title">Manage</span>
</div>
<div class="panel-body">
<button class="action-btn" onclick="exportLog()">Export log</button>
<button class="action-btn" onclick="openEditMode()">Edit challenge</button>
<button class="action-btn danger" onclick="confirmReset()">Reset challenge</button>
</div>
</div>
</div>
</div>
</div>
</div> /container 
 ══════════════════════════════════════
     DAY MODAL
══════════════════════════════════════ 
<div class="overlay" id="day-modal">
<div class="modal">
<div class="modal-hdr">
<span class="modal-hdr-title" id="modal-title">Day —</span>
<span class="modal-hdr-day" id="modal-date">—</span>
</div>
<button class="modal-close" onclick="closeModal()">Close ✕</button>
<div class="modal-body">
<div class="modal-field">
<label>Note — what did you do or notice?</label>
<textarea id="modal-note" placeholder="Sat down at 6:45am, wrote for 35 minutes..."></textarea>
</div>
<div class="modal-field">
<label>How did it feel?</label>
<div class="modal-moods">
<button class="modal-mood-btn" onclick="moodSel(this,5)">🔥 Crushed</button>
<button class="modal-mood-btn" onclick="moodSel(this,4)">✓ Solid</button>
<button class="modal-mood-btn" onclick="moodSel(this,3)">→ Showed up</button>
<button class="modal-mood-btn" onclick="moodSel(this,2)">↓ Struggled</button>
<button class="modal-mood-btn" onclick="moodSel(this,1)">✕ Barely</button>
</div>
</div>
<div class="modal-actions">
<button class="modal-save" onclick="saveModal()">Save entry</button>
<button class="modal-skip-btn" id="modal-toggle-skip" onclick="toggleModalSkip()">Mark skipped</button>
</div>
</div>
</div>
</div>
<div class="toast" id="toast"></div>

 ══════════════════════════════════════
     FIREBASE SYNC
══════════════════════════════════════ 

`;
    document.body.insertAdjacentHTML('afterbegin', content);
    
    // Execute inline scripts
    
// Global safety net
window.onerror = function(msg, src, line, col, err) {
  console.error("JS Error:", msg, "Line:", line, err);
  try { showEmpty(); } catch(e) {}
  return false;
};

// ════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════
const QUOTES = [
  { text: "We are what we repeatedly do. Excellence is not an act but a habit.", author: "Aristotle" },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Don't break the chain.", author: "Jerry Seinfeld" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "The chains of habit are too light to be felt until they are too heavy to be broken.", author: "Warren Buffett" },
  { text: "Each morning we are born again. What we do today matters most.", author: "Buddha" },
  { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
  { text: "Show up. Even on the bad days. Especially on the bad days.", author: "Anonymous" },
  { text: "One day or day one — you decide.", author: "Anonymous" },
  { text: "Motivation gets you started. Habit keeps you going.", author: "Jim Ryun" },
  { text: "Your future self will thank you for what you do today.", author: "Anonymous" },
  { text: "The secret is to fall seven times and get up eight.", author: "Japanese Proverb" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "It's not about having time. It's about making time.", author: "Anonymous" },
  { text: "The difference between who you are and who you want to be is what you do.", author: "Anonymous" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Winning is a habit. Unfortunately, so is losing.", author: "Vince Lombardi" },
];

const MOOD_ICONS = ['', '✕', '↓', '→', '✓', '🔥'];

// ════════════════════════════════════
// STATE
// ════════════════════════════════════
let S = { challenge: null, days: [] };
let selectedCat = '';
let todayMood = null;
let modalIdx = null;
let modalMoodVal = null;

// ════════════════════════════════════
// BOOT
// ════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  buildMiniChain();
  loadState();
  renderQuote();

  // Live preview for setup
  document.getElementById('ch-name').addEventListener('input', e => {
    const v = e.target.value.trim();
    const el = document.getElementById('preview-name');
    el.textContent = v || 'Your challenge name';
    el.classList.toggle('has-val', !!v);
  });
  document.getElementById('ch-desc').addEventListener('input', e => {
    const v = e.target.value.trim();
    const tip = document.getElementById('preview-desc-tip');
    document.getElementById('preview-desc-text').textContent = v;
    tip.style.display = v ? '' : 'none';
  });

  // Close modal on overlay click
  document.getElementById('day-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('day-modal')) closeModal();
  });
});

function loadState() {
  try {
    const raw = localStorage.getItem('dooit_21days');
    if (raw) {
      S = JSON.parse(raw);
      if (S.challenge) {
        // ── Migrate old field names from previous version ──
        const c = S.challenge;
        if (c.description !== undefined && c.desc === undefined) c.desc = c.description;
        if (c.category   !== undefined && c.cat  === undefined) c.cat  = c.category;
        if (!c.cat)  c.cat  = 'Other';
        if (!c.desc) c.desc = '';
        if (!c.name) c.name = '';
        if (!Array.isArray(c.whys)) c.whys = [];
        // ── Ensure days array is always 21 well-formed items ──
        if (!Array.isArray(S.days) || S.days.length < 21) {
          S.days = Array.from({length: 21}, (_, i) =>
            (S.days && S.days[i]) ? S.days[i] : { status: 'pending', note: '', mood: null, date: null }
          );
        }
        S.days = S.days.slice(0, 21).map(d => ({
          status: d.status || 'pending',
          note:   d.note   || '',
          mood:   d.mood   || null,
          date:   d.date   || null
        }));
        showDashboard();
        try { renderDashboard(); }
        catch(err) {
          console.error('renderDashboard failed:', err);
          // State may be corrupt — show empty so user isn't stuck
          showEmpty();
        }
      } else {
        showEmpty();
      }
    } else {
      showEmpty();
    }
  } catch(e) {
    console.error('State load error:', e);
    showEmpty();
  }
}

function save() {
  localStorage.setItem('dooit_21days', JSON.stringify(S));
  if (window.__21daysSync) window.__21daysSync.push();
}

// ════════════════════════════════════
// VIEW SWITCHING
// ════════════════════════════════════
function showEmpty() {
  document.getElementById('empty-view').style.display = 'block';
  document.getElementById('setup-view').style.display = 'none';
  document.getElementById('dashboard-view').style.display = 'none';
  document.getElementById('btn-new').style.display = 'inline-block';
  document.getElementById('btn-export').style.display = 'none';
  document.getElementById('btn-edit').style.display = 'none';
  document.getElementById('btn-reset').style.display = 'none';
}

function showSetup() {
  document.getElementById('empty-view').style.display = 'none';
  document.getElementById('setup-view').style.display = 'block';
  document.getElementById('dashboard-view').style.display = 'none';
  document.getElementById('btn-new').style.display = 'none';
  document.getElementById('btn-export').style.display = 'none';
  document.getElementById('btn-edit').style.display = 'none';
  document.getElementById('btn-reset').style.display = 'none';
}

function showDashboard() {
  document.getElementById('empty-view').style.display = 'none';
  document.getElementById('setup-view').style.display = 'none';
  document.getElementById('dashboard-view').style.display = 'block';
  document.getElementById('btn-new').style.display = 'none';
  document.getElementById('btn-export').style.display = 'inline-block';
  document.getElementById('btn-edit').style.display = 'inline-block';
  document.getElementById('btn-reset').style.display = 'inline-block';
}

function openSetup() {
  document.getElementById('setup-title').textContent = 'Set your challenge';
  document.getElementById('setup-submit-btn').textContent = 'Begin 21-day challenge →';
  // Clear form
  document.getElementById('ch-name').value = '';
  document.getElementById('ch-desc').value = '';
  document.getElementById('why-1').value = '';
  document.getElementById('why-2').value = '';
  document.getElementById('why-3').value = '';
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('selected'));
  selectedCat = '';
  document.getElementById('preview-name').textContent = 'Your challenge name';
  document.getElementById('preview-name').classList.remove('has-val');
  document.getElementById('preview-desc-tip').style.display = 'none';
  showSetup();
}

function openEditMode() {
  if (!S.challenge) return;
  document.getElementById('setup-title').textContent = 'Edit challenge';
  document.getElementById('setup-submit-btn').textContent = 'Save changes →';
  document.getElementById('ch-name').value = S.challenge.name || '';
  document.getElementById('ch-desc').value = S.challenge.desc || '';
  document.getElementById('why-1').value = S.challenge.whys?.[0] || '';
  document.getElementById('why-2').value = S.challenge.whys?.[1] || '';
  document.getElementById('why-3').value = S.challenge.whys?.[2] || '';

  selectedCat = S.challenge.cat || '';
  document.querySelectorAll('.cat-pill').forEach(p => {
    p.classList.toggle('selected', p.textContent === selectedCat);
  });

  const nameEl = document.getElementById('preview-name');
  nameEl.textContent = S.challenge.name || 'Your challenge name';
  nameEl.classList.toggle('has-val', !!S.challenge.name);

  const descVal = S.challenge.desc || '';
  document.getElementById('preview-desc-text').textContent = descVal;
  document.getElementById('preview-desc-tip').style.display = descVal ? '' : 'none';

  showSetup();
}

// ════════════════════════════════════
// SETUP
// ════════════════════════════════════
function buildMiniChain() {
  const g = document.getElementById('mini-chain');
  g.innerHTML = '';
  for (let i = 1; i <= 21; i++) {
    const d = document.createElement('div');
    d.className = 'mini-cell' + (i === 1 ? ' today-cell' : '');
    d.textContent = i;
    g.appendChild(d);
  }
}

function pickCat(el, cat) {
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  selectedCat = cat;
}

function submitChallenge() {
  const name = document.getElementById('ch-name').value.trim();
  if (!name) { toast('Please name your challenge first.'); return; }

  const desc = document.getElementById('ch-desc').value.trim();
  const w1 = document.getElementById('why-1').value.trim();
  const w2 = document.getElementById('why-2').value.trim();
  const w3 = document.getElementById('why-3').value.trim();
  const whys = [w1, w2, w3].filter(Boolean);

  const isEdit = !!S.challenge;
  const startDate = isEdit ? S.challenge.startDate : today();

  S = {
    challenge: {
      name, desc, whys,
      cat: selectedCat || 'Other',
      startDate
    },
    days: isEdit && S.days.length === 21
      ? S.days
      : Array.from({length: 21}, () => ({ status: 'pending', note: '', mood: null, date: null }))
  };

  save();
  showDashboard();
  renderDashboard();
  toast(isEdit ? 'Challenge updated.' : 'Challenge started. Day 1 begins today.');
}

// ════════════════════════════════════
// DASHBOARD RENDER
// ════════════════════════════════════
function renderDashboard() {
  if (!S.challenge) return;
  const c = S.challenge;
  const todayStr = today();
  if (!c.startDate) { showEmpty(); return; }
  const startDate = new Date(c.startDate + 'T00:00:00');
  const todayDt = new Date(todayStr + 'T00:00:00');
  const todayIdx = Math.round((todayDt - startDate) / 86400000);

  const done = S.days.filter(d => d.status === 'done').length;
  const streak = calcStreak(todayIdx);
  const pastDays = S.days.slice(0, Math.min(todayIdx + 1, 21));
  const pastDone = pastDays.filter(d => d.status === 'done').length;
  const rate = pastDays.length > 0 ? Math.round((pastDone / pastDays.length) * 100) : 0;
  const remaining = Math.max(0, 21 - done);

  // Stat bar
  document.getElementById('s-done').textContent = done;
  document.getElementById('s-streak').textContent = streak;
  document.getElementById('s-rate').textContent = rate + '%';
  document.getElementById('s-left').textContent = remaining;
  document.getElementById('s-day').textContent = todayIdx >= 0 && todayIdx < 21 ? 'Day ' + (todayIdx + 1) : (todayIdx < 0 ? 'Not started' : 'Complete');

  document.getElementById('sf-done').style.width = Math.round((done / 21) * 100) + '%';
  document.getElementById('sf-streak').style.width = Math.round((streak / 21) * 100) + '%';
  document.getElementById('sf-rate').style.width = rate + '%';

  // Left panel
  document.getElementById('today-big-num').textContent = todayIdx >= 0 && todayIdx < 21 ? todayIdx + 1 : '—';
  document.getElementById('today-ch-name').textContent = c.name || '—';
  document.getElementById('today-cat').textContent = c.cat || c.category || '';
  document.getElementById('today-date-tag').textContent = fmtDate(todayStr, 'short');

  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  // Today check-in state
  const checkBtn = document.getElementById('checkin-btn');
  const skipBtnEl = document.getElementById('skip-btn');
  const todayData = todayIdx >= 0 && todayIdx < 21 ? S.days[todayIdx] : null;

  if (!todayData || todayIdx < 0 || todayIdx >= 21) {
    checkBtn.style.display = 'none';
    skipBtnEl.style.display = 'none';
    document.getElementById('today-note').style.display = 'none';
    document.getElementById('mood-row').style.display = 'none';
  } else if (todayData.status === 'done') {
    checkBtn.textContent = '✓ Done — ' + (MOOD_ICONS[todayData.mood] || '');
    checkBtn.className = 'btn-checkin done';
    checkBtn.disabled = true;
    if (todayData.note) document.getElementById('today-note').value = todayData.note;
    skipBtnEl.style.display = 'none';
    // Mark mood pill
    if (todayData.mood) {
      document.querySelectorAll('.mood-pill').forEach((p, i) => {
        const v = [5,4,3,2,1][i];
        p.classList.toggle('active', v === todayData.mood);
      });
    }
  } else if (todayData.status === 'skipped') {
    checkBtn.textContent = '✓ Mark done';
    checkBtn.className = 'btn-checkin';
    checkBtn.disabled = false;
    skipBtnEl.textContent = 'Undo skip';
  } else {
    checkBtn.textContent = '✓ Mark done';
    checkBtn.className = 'btn-checkin';
    checkBtn.disabled = false;
    skipBtnEl.textContent = 'Skip today';
  }

  // Why
  if (c.whys && c.whys.length > 0) {
    document.getElementById('why-display').style.display = '';
    document.getElementById('why-list').innerHTML = c.whys.map(w =>
      `<div class="why-display-item">${w}</div>`
    ).join('');
  } else {
    document.getElementById('why-display').style.display = 'none';
  }

  // Chain panel title
  document.getElementById('chain-panel-title').textContent = c.name || '21-day chain';

  // Chain progress bar
  document.getElementById('chain-bar').style.width = Math.round((done / 21) * 100) + '%';
  document.getElementById('chain-bar-label').textContent = done + ' / 21';

  // Chain grid
  renderChainGrid(todayIdx, startDate);

  // Right col
  document.getElementById('streak-big').textContent = streak;
  document.getElementById('streak-sub').textContent =
    streak >= 14 ? "Unstoppable. Protect this." :
    streak >= 7  ? "You're in the zone. Don't break it." :
    streak >= 3  ? "Building. Three is a pattern." :
    streak === 1 ? "Day one. Start the chain." :
    "Start your streak today.";

  // Mood bars
  const barsEl = document.getElementById('mood-bars');
  barsEl.innerHTML = '';
  for (let i = 0; i < 21; i++) {
    const d = S.days[i];
    const bar = document.createElement('div');
    bar.className = 'mood-bar-item';
    const h = d.mood ? (d.mood / 5) * 100 : 0;
    bar.style.height = Math.max(2, h) + '%';
    if (d.mood >= 4) bar.classList.add('hi');
    else if (d.mood >= 2) bar.classList.add('md');
    barsEl.appendChild(bar);
  }

  // Meta
  document.getElementById('meta-started').textContent = fmtDate(c.startDate, 'short');
  document.getElementById('meta-cat').textContent = c.cat || c.category || '—';
  const endDt = new Date(startDate); endDt.setDate(startDate.getDate() + 20);
  document.getElementById('meta-ends').textContent = fmtDate(endDt.toISOString().split('T')[0], 'short');

  // Complete banner
  const isComplete = done >= 21 || (todayIdx >= 21);
  document.getElementById('complete-banner').style.display = isComplete ? '' : 'none';
  if (isComplete) {
    document.getElementById('complete-sub').textContent =
      done + ' of 21 days done. ' + (rate >= 80 ? 'Outstanding.' : rate >= 60 ? 'Solid effort.' : 'You showed up.') + ' Set a new one.';
  }

  // Update today's pre-existing note
  if (todayData && todayData.note) {
    document.getElementById('today-note').value = todayData.note;
  }
}

function renderChainGrid(todayIdx, startDate) {
  const grid = document.getElementById('chain-grid');
  grid.innerHTML = '';
  for (let i = 0; i < 21; i++) {
    const d = S.days[i];
    const isFuture = i > todayIdx;
    const isToday = i === todayIdx;

    const cell = document.createElement('div');
    cell.className = 'day-cell';
    if (d.status === 'done') cell.classList.add('done');
    if (d.status === 'skipped') cell.classList.add('skipped');
    if (isFuture) cell.classList.add('future');
    if (isToday) cell.classList.add('today');
    if (d.note) cell.classList.add('has-note');

    const dayDt = new Date(startDate);
    dayDt.setDate(startDate.getDate() + i);
    const dateStr = dayDt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    cell.title = `Day ${i+1} — ${dateStr}${d.note ? '\n' + d.note : ''}`;

    const moodIcon = d.status === 'done' && d.mood ? MOOD_ICONS[d.mood] : '';

    cell.innerHTML = `
      <div class="dc-num">${i + 1}</div>
      <div class="dc-check">✓</div>
      <div class="dc-dot"></div>
      <div class="dc-mood">${moodIcon}</div>
    `;

    if (!isFuture) {
      cell.addEventListener('click', () => openModal(i));
    }
    grid.appendChild(cell);
  }
}

// ════════════════════════════════════
// CHECK-IN
// ════════════════════════════════════
function doCheckIn() {
  const todayStr = today();
  const idx = dayIndex();
  if (idx < 0 || idx >= 21) return;

  const note = document.getElementById('today-note').value.trim();
  S.days[idx] = {
    ...S.days[idx],
    status: 'done',
    note,
    mood: todayMood || S.days[idx].mood || 3,
    date: todayStr
  };
  save();
  renderDashboard();
  toast('Day ' + (idx + 1) + ' done ✓ Keep the chain going.');
  todayMood = null;
}

function doSkip() {
  const idx = dayIndex();
  if (idx < 0 || idx >= 21) return;

  if (S.days[idx].status === 'skipped') {
    S.days[idx] = { ...S.days[idx], status: 'pending' };
    toast('Skip removed.');
  } else {
    S.days[idx] = { ...S.days[idx], status: 'skipped', date: today() };
    toast('Skipped. Come back stronger tomorrow.');
  }
  save();
  renderDashboard();
}

function pickMood(el, val) {
  todayMood = val;
  document.querySelectorAll('.mood-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
}

// ════════════════════════════════════
// DAY MODAL
// ════════════════════════════════════
function openModal(idx) {
  modalIdx = idx;
  modalMoodVal = S.days[idx].mood || null;

  const c = S.challenge;
  const startDate = new Date(c.startDate + 'T00:00:00');
  const dayDt = new Date(startDate);
  dayDt.setDate(startDate.getDate() + idx);
  const dateStr = dayDt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  document.getElementById('modal-title').textContent = 'Day ' + (idx + 1) + ' — ' + c.name;
  document.getElementById('modal-date').textContent = dateStr;
  document.getElementById('modal-note').value = S.days[idx].note || '';

  document.querySelectorAll('.modal-mood-btn').forEach(b => b.classList.remove('sel'));
  if (modalMoodVal) {
    const moodMap = [5,4,3,2,1];
    const mIdx = moodMap.indexOf(modalMoodVal);
    const btns = document.querySelectorAll('.modal-mood-btn');
    if (mIdx !== -1 && btns[mIdx]) btns[mIdx].classList.add('sel');
  }

  const skipLabel = S.days[idx].status === 'skipped' ? 'Undo skipped' : 'Mark skipped';
  document.getElementById('modal-toggle-skip').textContent = skipLabel;

  document.getElementById('day-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('day-modal').classList.remove('open');
  modalIdx = null;
  modalMoodVal = null;
}

function moodSel(el, val) {
  modalMoodVal = val;
  document.querySelectorAll('.modal-mood-btn').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
}

function saveModal() {
  if (modalIdx === null) return;
  const note = document.getElementById('modal-note').value.trim();
  const wasSkipped = S.days[modalIdx].status === 'skipped';
  S.days[modalIdx] = {
    ...S.days[modalIdx],
    note,
    mood: modalMoodVal,
    status: S.days[modalIdx].status === 'pending' ? 'done' : S.days[modalIdx].status,
    date: S.days[modalIdx].date || (() => {
      const c = S.challenge;
      const startDate = new Date(c.startDate + 'T00:00:00');
      const dayDt = new Date(startDate);
      dayDt.setDate(startDate.getDate() + modalIdx);
      return dayDt.toISOString().split('T')[0];
    })()
  };
  save();
  renderDashboard();
  closeModal();
  toast('Day ' + (modalIdx + 1) + ' saved.');
}

function toggleModalSkip() {
  if (modalIdx === null) return;
  const d = S.days[modalIdx];
  const c = S.challenge;
  const startDate = new Date(c.startDate + 'T00:00:00');
  const dayDt = new Date(startDate);
  dayDt.setDate(startDate.getDate() + modalIdx);

  if (d.status === 'skipped') {
    S.days[modalIdx] = { ...d, status: 'pending' };
  } else {
    S.days[modalIdx] = { ...d, status: 'skipped', date: dayDt.toISOString().split('T')[0] };
  }
  save();
  renderDashboard();
  closeModal();
  toast(S.days[modalIdx].status === 'skipped' ? 'Day marked skipped.' : 'Skip removed.');
}

// ════════════════════════════════════
// HELPERS
// ════════════════════════════════════
function today() { return new Date().toISOString().split('T')[0]; }

function dayIndex() {
  if (!S.challenge) return -1;
  const start = new Date(S.challenge.startDate + 'T00:00:00');
  const now = new Date(today() + 'T00:00:00');
  return Math.round((now - start) / 86400000);
}

function calcStreak(todayIdx) {
  let s = 0;
  const cap = Math.min(todayIdx, 20);
  for (let i = cap; i >= 0; i--) {
    if (S.days[i].status === 'done') s++;
    else break;
  }
  return s;
}

function fmtDate(str, style) {
  const d = new Date(str + 'T00:00:00');
  if (style === 'short') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function renderQuote() {
  const q = QUOTES[new Date().getDate() % QUOTES.length];
  document.getElementById('q-text').textContent = q.text;
  document.getElementById('q-author').textContent = '— ' + q.author;
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ════════════════════════════════════
// MANAGE
// ════════════════════════════════════
function confirmReset() {
  if (confirm('Reset your 21-day challenge? All progress will be erased.')) {
    const old = S;
    localStorage.removeItem('dooit_21days');
    S = { challenge: null, days: [] };
    // Also remove from app.html's multi-challenge localStorage
    try {
      const raw = localStorage.getItem('dooit_challenges');
      if (raw && old.challenge) {
        let arr = JSON.parse(raw);
        arr = arr.filter(c => !(c.challenge &&
          c.challenge.name === old.challenge.name &&
          c.challenge.startDate === old.challenge.startDate));
        localStorage.setItem('dooit_challenges', JSON.stringify(arr));
      }
    } catch(e) {}
    showEmpty();
    toast('Challenge reset. Start fresh.');
  }
}

function exportLog() {
  if (!S.challenge) return;
  const c = S.challenge;
  const lines = [
    'dooit — 21-DAY CHALLENGE LOG',
    '='.repeat(40),
    'Challenge: ' + c.name,
    'Category:  ' + c.cat,
    'Started:   ' + fmtDate(c.startDate, 'long'),
    'Done:      ' + c.desc,
    '',
    'WHY I STARTED:',
    ...(c.whys || []).map((w, i) => `  ${i+1}. ${w}`),
    '',
    'DAY LOG:',
    '-'.repeat(40),
    ...S.days.map((d, i) => {
      const status = d.status === 'done' ? '✓ Done' : d.status === 'skipped' ? '✗ Skipped' : '· Pending';
      const mood = d.mood ? ['','Barely','Struggled','Showed up','Solid','Crushed it'][d.mood] : '';
      return `Day ${String(i+1).padStart(2,' ')}: ${status}${mood ? ' [' + mood + ']' : ''}${d.note ? '\n         Note: ' + d.note : ''}`;
    }),
    '',
    'Exported: ' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dooit-21days-' + c.name.replace(/\s+/g, '-').toLowerCase() + '.txt';
  a.click();
  URL.revokeObjectURL(url);
  toast('Log exported.');
}


import { initializeApp }    from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc }
    from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged }
    from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const firebaseConfig = {
    apiKey:            "AIzaSyAMacwdf0ltK-JL6_ErdR9jaV8yJlGrOJc",
    authDomain:        "letsdooit---final-edition.firebaseapp.com",
    projectId:         "letsdooit---final-edition",
    storageBucket:     "letsdooit---final-edition.firebasestorage.app",
    messagingSenderId: "162170588177",
    appId:             "1:162170588177:web:152261bfc17674451df5b0"
};

const fbApp = initializeApp(firebaseConfig, '21days');
const db    = getFirestore(fbApp);
const auth  = getAuth(fbApp);

let _uid       = null;
let _pushTimer = null;

function setSyncStatus(state) {
    const el = document.getElementById('sync-status');
    if (!el) return;
    const msgs = { syncing: '↑ syncing…', saved: '✓ synced', error: '⚠ sync error', '': '' };
    el.textContent = msgs[state] || '';
    el.style.opacity = state === 'saved' ? '0.35' : '0.75';
    if (state === 'saved') setTimeout(() => { if (el.textContent === '✓ synced') el.textContent = ''; }, 2500);
}

async function pull(uid) {
    setSyncStatus('syncing');
    try {
        const snap = await getDoc(doc(db, 'users', uid, 'meta', '21days'));
        if (snap.exists()) {
            const data = snap.data().state;
            if (data) {
                localStorage.setItem('dooit_21days', JSON.stringify(data));
                if (typeof loadState === 'function') loadState();
            }
        }
        setSyncStatus('saved');
    } catch(e) {
        console.error('21days pull error', e);
        setSyncStatus('error');
    }
}

function push() {
    if (!_uid) return;
    clearTimeout(_pushTimer);
    _pushTimer = setTimeout(async () => {
        setSyncStatus('syncing');
        try {
            const raw = localStorage.getItem('dooit_21days');
            const state = raw ? JSON.parse(raw) : null;
            if (state) {
                // Write to legacy path (21days.html's own doc)
                await setDoc(doc(db, 'users', _uid, 'meta', '21days'), { state }, { merge: true });

                // Also sync into the app.html multi-challenge array so the inline strip stays current.
                try {
                    const snap = await getDoc(doc(db, 'users', _uid, 'meta', 'challenges'));
                    let arr = snap.exists() ? (snap.data().challenges || []) : [];
                    const idx = arr.findIndex(c =>
                        c.challenge &&
                        c.challenge.name === state.challenge?.name &&
                        c.challenge.startDate === state.challenge?.startDate
                    );
                    if (idx >= 0) arr[idx] = state;
                    else arr.unshift(state);
                    await setDoc(doc(db, 'users', _uid, 'meta', 'challenges'), { challenges: arr }, { merge: false });
                    try { localStorage.setItem('dooit_challenges', JSON.stringify(arr)); } catch(e) {}
                } catch(e2) {
                    console.warn('21days→challenges sync error:', e2);
                }
            }
            setSyncStatus('saved');
        } catch(e) {
            console.error('21days push error', e);
            setSyncStatus('error');
        }
    }, 1500);
}

window.__21daysSync = { push };

// Use Firebase Auth state — same session as app.html, no extra sign-in needed
onAuthStateChanged(auth, (user) => {
    if (user) {
        _uid = user.uid;
        // Update localStorage with correct Firebase UID
        try {
            const saved = localStorage.getItem('dooit_auth_user');
            const profile = saved ? JSON.parse(saved) : {};
            localStorage.setItem('dooit_auth_user', JSON.stringify({
                ...profile, id: user.uid
            }));
        } catch(e) {}
        pull(_uid);
    } else {
        setSyncStatus('');
    }
});


});
