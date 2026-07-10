
export function render() {
    const content = `

<nav>
<div class="nav-inner">
<div class="nav-brand">
<span class="brand-name">dooit</span>
<span class="brand-tag">task &amp; time</span>
</div>
<div class="nav-links">
<a class="btn" href="#features">Features</a>
<a class="btn" href="#waitlist">Early Access</a>
<a class="btn" href="21days.html">21 Days Challenge</a>
<a class="btn btn-primary" href="signin.html">Open App →</a>
</div>
</div>
</nav>

<section class="hero">
<div class="container">
<div class="hero-grid">
<!-- Copy -->
<div class="hero-copy">
<span class="hero-eyebrow">Built for freelancers &amp; solopreneurs</span>
<h1 class="hero-headline">
          Your time is<br/>
          your income.<br/>
<em>Stop guessing<br/>where it goes.</em>
</h1>
<p class="hero-sub">
          dooit is a time-aware task manager that shows you exactly how you spend your day — what you planned, what you actually did, and how focused you were. No fluff. Just clarity.
        </p>
<div class="hero-ctas">
<a class="btn btn-primary btn-lg" href="signin.html">Try it free →</a>
<a class="btn btn-lg" href="#waitlist">Join early access</a>
</div>
<p class="hero-note">Free to use · No credit card · Sync coming with Pro</p>
</div>
<!-- App Mockup -->
<div aria-hidden="true" class="hero-mockup">
<div class="mockup-header">
<span class="mockup-brand">dooit</span>
<div style="display:flex;gap:6px;align-items:center;">
<div class="mockup-score">
<div>
<div class="mockup-score-num">84</div>
</div>
<div>
<div class="mockup-score-label">Score / 100</div>
<div style="font-size:0.55rem;font-weight:500;">Good</div>
</div>
</div>
<div style="border:1px solid var(--border);padding:4px 8px;font-size:0.6rem;">Focus Mode</div>
</div>
</div>
<div class="mockup-add-bar">
<div class="mockup-input">Client proposal draft...</div>
<div class="mockup-select">Urgent</div>
<div style="border:1px solid var(--border);padding:5px 9px;font-size:0.62rem;opacity:0.5;">10:00 AM – 11:30 AM</div>
<div class="mockup-btn-add">+ Add</div>
</div>
<div class="mockup-board">
<!-- Urgent -->
<div class="mockup-col">
<div class="mockup-col-title">Urgent (2)</div>
<div class="mockup-card active">
<div class="mockup-card-name">Client proposal</div>
<div class="mockup-timer">00:42:17</div>
<div style="display:flex;gap:4px;">
<span class="mockup-badge active">In Progress</span>
<span class="mockup-badge">10–11:30am</span>
</div>
<div class="mockup-progress-bar"><div class="mockup-progress-fill"></div></div>
</div>
<div class="mockup-card">
<div class="mockup-card-name">Invoice #047</div>
<div class="mockup-card-time">2:00 PM – 2:30 PM</div>
</div>
</div>
<!-- Important -->
<div class="mockup-col">
<div class="mockup-col-title">Important (2)</div>
<div class="mockup-card">
<div class="mockup-card-name">Design review</div>
<div class="mockup-card-time">12:00 – 1:00 PM</div>
</div>
<div class="mockup-card done">
<div class="mockup-card-name">Email follow-ups</div>
<div style="display:flex;gap:4px;margin-top:2px;"><span class="mockup-badge">Done · 28 min</span></div>
</div>
</div>
<!-- Later -->
<div class="mockup-col">
<div class="mockup-col-title">Later (1)</div>
<div class="mockup-card">
<div class="mockup-card-name">Update portfolio</div>
<div class="mockup-card-time">4:00 – 5:00 PM</div>
</div>
</div>
</div>
<!-- Mini stats bar -->
<div style="display:flex;gap:0;margin-top:10px;border:1px solid var(--border);">
<div style="flex:1;padding:7px 10px;border-right:1px solid var(--border);">
<div style="font-size:0.55rem;opacity:0.45;text-transform:uppercase;letter-spacing:0.1em;">Focused</div>
<div style="font-size:0.9rem;font-family:var(--font-serif);">3h 14m</div>
</div>
<div style="flex:1;padding:7px 10px;border-right:1px solid var(--border);">
<div style="font-size:0.55rem;opacity:0.45;text-transform:uppercase;letter-spacing:0.1em;">Tasks done</div>
<div style="font-size:0.9rem;font-family:var(--font-serif);">3 / 5</div>
</div>
<div style="flex:1;padding:7px 10px;">
<div style="font-size:0.55rem;opacity:0.45;text-transform:uppercase;letter-spacing:0.1em;">On time</div>
<div style="font-size:0.9rem;font-family:var(--font-serif);">67%</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section class="truth-strip">
<div class="container">
<div class="truth-inner">
<div class="truth-item">
<div class="truth-num">2.5h</div>
<div class="truth-desc">The average freelancer loses 2.5 hours a day to unplanned tasks and scope creep — without ever knowing it.</div>
</div>
<div class="truth-item">
<div class="truth-num">73%</div>
<div class="truth-desc">Of solo workers undercharge clients because they can't prove how long projects actually took them.</div>
</div>
<div class="truth-item">
<div class="truth-num">1 tab</div>
<div class="truth-desc">That's all dooit needs. No integrations, no setup, no subscriptions to 4 different apps just to track your work.</div>
</div>
</div>
</div>
</section>

<section class="features" id="features">
<div class="container">
<div class="section-header">
<h2 class="section-title">What dooit gives you</h2>
<span class="label">Features</span>
</div>
<div class="features-grid">
<div class="feature-item">
<div class="feature-icon">
<svg fill="none" height="16" viewbox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
<rect height="14" stroke="#111110" stroke-width="1.2" width="14" x="1" y="1"></rect>
<line stroke="#111110" stroke-width="1.2" x1="1" x2="15" y1="5" y2="5"></line>
<line stroke="#111110" stroke-width="1.2" x1="5" x2="5" y1="1" y2="15"></line>
</svg>
</div>
<h3 class="feature-title">Time-aware Kanban</h3>
<p class="feature-desc">Every task has a planned start and end time. See at a glance if you're on schedule, running over, or have room to breathe. No more surprises at the end of the day.</p>
</div>
<div class="feature-item">
<div class="feature-icon">
<svg fill="none" height="16" viewbox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
<circle cx="8" cy="8" r="6.4" stroke="#111110" stroke-width="1.2"></circle>
<line stroke="#111110" stroke-linecap="round" stroke-width="1.2" x1="8" x2="8" y1="8" y2="3"></line>
<line stroke="#111110" stroke-linecap="round" stroke-width="1.2" x1="8" x2="11.5" y1="8" y2="8"></line>
</svg>
</div>
<h3 class="feature-title">Live Task Timer</h3>
<p class="feature-desc">Start, pause, and finish tasks with one click. dooit tracks actual time spent vs. planned time — so you always know your real hourly rate, not the one you guessed.</p>
</div>
<div class="feature-item">
<div class="feature-icon">
<svg fill="none" height="16" viewbox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
<rect height="6" stroke="#111110" stroke-width="1.2" width="3" x="1" y="9"></rect>
<rect height="10" stroke="#111110" stroke-width="1.2" width="3" x="6" y="5"></rect>
<rect height="14" stroke="#111110" stroke-width="1.2" width="3" x="11" y="1"></rect>
</svg>
</div>
<h3 class="feature-title">Weekly Analytics</h3>
<p class="feature-desc">Your focus hours, completion rate, productivity score, and top tasks — all laid out by week. See your patterns and know exactly which days you do your best work.</p>
</div>
<div class="feature-item">
<div class="feature-icon">
<svg fill="none" height="16" viewbox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
<path d="M8 1.5C8 1.5 3.5 3.5 3.5 8.5V12H12.5V8.5C12.5 3.5 8 1.5 8 1.5Z" fill="none" stroke="#111110" stroke-width="1.2"></path>
<line stroke="#111110" stroke-width="1.2" x1="2" x2="14" y1="12" y2="12"></line>
</svg>
</div>
<h3 class="feature-title">Focus Mode</h3>
<p class="feature-desc">Lock in on one task at a time. Focus mode dims everything else and puts your active task front and center with a live progress bar ticking against your deadline.</p>
</div>
<div class="feature-item">
<div class="feature-icon">
<svg fill="none" height="16" viewbox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
<rect fill="none" height="12.5" stroke="#111110" stroke-width="1.2" width="14" x="1" y="2.5"></rect>
<line stroke="#111110" stroke-width="1.2" x1="1" x2="15" y1="6" y2="6"></line>
<line stroke="#111110" stroke-width="1.2" x1="5" x2="5" y1="1" y2="4"></line>
<line stroke="#111110" stroke-width="1.2" x1="11" x2="11" y1="1" y2="4"></line>
</svg>
</div>
<h3 class="feature-title">Project Calendar</h3>
<p class="feature-desc">Plan upcoming client work, deadlines, and milestones on a visual calendar. Never miss a delivery date because it was buried in your notes app.</p>
</div>
<div class="feature-item">
<div class="feature-icon">
<svg fill="none" height="16" viewbox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
<path d="M2 12L6 8L9 11L13 5" stroke="#111110" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"></path>
<circle cx="13" cy="5" fill="#111110" r="1.5"></circle>
</svg>
</div>
<h3 class="feature-title">Daily &amp; Weekly Reports</h3>
<p class="feature-desc">Generate a full breakdown of any day or week — tasks completed, time spent, scores, and notes. Export-ready for client billing or your own retrospectives.</p>
</div>
</div>
</div>
</section>

<section class="how">
<div class="container">
<div class="section-header">
<h2 class="section-title">How it works</h2>
<span class="label">Three steps</span>
</div>
<div class="steps">
<div class="step">
<div class="step-num">01</div>
<h3 class="step-title">Plan your day</h3>
<p class="step-desc">Add your tasks for the day with a planned start and end time and a priority level — Urgent, Important, or Later. Takes less than two minutes each morning.</p>
<span class="step-connector">→</span>
</div>
<div class="step">
<div class="step-num">02</div>
<h3 class="step-title">Work with the timer</h3>
<p class="step-desc">Hit Start when you begin a task. dooit tracks every second. Pause for breaks, resume when you're back. See your live timer vs. your planned window in real time.</p>
<span class="step-connector">→</span>
</div>
<div class="step">
<div class="step-num">03</div>
<h3 class="step-title">Review and improve</h3>
<p class="step-desc">End each day with the summary report. See your productivity score, which tasks overran, and what to carry forward. Weekly analytics show your long-term patterns.</p>
</div>
</div>
</div>
</section>

<section class="proof">
<div class="container">
<div class="proof-inner">
<div class="proof-label-col">
<div class="label" style="margin-bottom:16px;">Why it matters</div>
<p>Built for people who <span>work alone</span> and need to be their own boss, client, and accountant.</p>
</div>
<div class="proof-items">
<div class="proof-item">
<div class="proof-check">✓</div>
<p class="proof-text"><strong>Know your real hourly rate.</strong> When dooit shows you spent 4.5 hours on a "2 hour job," you stop underquoting.</p>
</div>
<div class="proof-item">
<div class="proof-check">✓</div>
<p class="proof-text"><strong>Never drop a deadline again.</strong> Unfinished tasks from yesterday automatically roll over so nothing falls through the cracks.</p>
</div>
<div class="proof-item">
<div class="proof-check">✓</div>
<p class="proof-text"><strong>No setup, no subscriptions to other tools.</strong> It's one HTML file. Sign in with Google, and your data syncs. That's it.</p>
</div>
<div class="proof-item">
<div class="proof-check">✓</div>
<p class="proof-text"><strong>Works completely offline too.</strong> Even without internet, dooit runs from your browser. Your data lives in your browser until you sign in.</p>
</div>
</div>
</div>
</div>
</section>

<section class="waitlist" id="waitlist">
<div class="container">
<div class="waitlist-inner">
<div class="waitlist-copy">
<span class="label" style="display:block;margin-bottom:16px;">Early access</span>
<h2>Be first when<br/><em>Pro launches.</em></h2>
<p>dooit is free today. Pro is coming — with cloud sync across all your devices, advanced reports, and more. Join the waitlist and you'll get early access at a founder's rate before public launch.</p>
<ul class="waitlist-perks">
<li>First to know when Pro goes live</li>
<li>Locked-in founder pricing (before $5/mo public rate)</li>
<li>Direct line to shape features as we build</li>
<li>No spam. One email when it's ready.</li>
</ul>
</div>
<div class="waitlist-form-wrap">
<div id="waitlist-form-area">
<h3>Join the waitlist</h3>
<p class="sub">Takes 20 seconds. No credit card.</p>
<form id="waitlist-form">
<div class="form-row">
<label for="wl-name">Your name</label>
<input id="wl-name" placeholder="Pritam Chhetri" required="" type="text"/>
</div>
<div class="form-row">
<label for="wl-email">Email address</label>
<input id="wl-email" placeholder="you@yourwork.com" required="" type="email"/>
</div>
<div class="form-row">
<label for="wl-role">How do you work?</label>
<input id="wl-role" placeholder="e.g. Freelance designer, solopreneur..." type="text"/>
</div>
<button class="waitlist-submit" type="submit">Join early access →</button>
</form>
<p class="waitlist-note">Your email will only be used to notify you about the Pro launch.</p>
</div>
<div class="success-msg" id="success-msg">
<div class="serif">You're on the list.</div>
<p>We'll reach out when Pro is ready.<br/>In the meantime, <a href="https://pritamcreates.github.io/dooit/" style="text-decoration:underline;">open dooit and start tracking →</a></p>
</div>
</div>
</div>
</div>
</section>

<footer>
<div class="container">
<div class="footer-inner">
<span class="footer-brand">dooit</span>
<div class="footer-links">
<a href="signin.html">Open app</a>
<a href="#features">Features</a>
<a href="#waitlist">Early access</a>
<a href="21days.html">21 Days Challenge</a>
</div>
<span class="footer-copy">© 2026 dooit · Built with focus.</span>
</div>
</div>
</footer>

`;
    document.body.insertAdjacentHTML('afterbegin', content);
    
    // Execute inline scripts
    
  const waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name  = document.getElementById('wl-name').value.trim();
      const email = document.getElementById('wl-email').value.trim();
      const role  = document.getElementById('wl-role').value.trim();

      const entries = JSON.parse(localStorage.getItem('dooit_waitlist') || '[]');
      entries.push({ name, email, role, date: new Date().toISOString() });
      localStorage.setItem('dooit_waitlist', JSON.stringify(entries));

      document.getElementById('waitlist-form-area').style.display = 'none';
      document.getElementById('success-msg').style.display = 'block';
    });
  }

  // Smooth active nav link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 80) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.style.background = '';
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.background = 'var(--text)';
        link.style.color = 'var(--bg)';
      }
    });
  });


}