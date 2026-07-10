
document.addEventListener('DOMContentLoaded', () => {
    const content = `
<div id="loading-banner" style="display:none;">
<span id="loading-msg">Connecting…</span>
</div>
 Daily Start Screen 
<div id="daily-start-screen">
<div class="dss-inner">
<div class="dss-greeting" id="dss-greeting">Good morning.</div>
<div class="dss-date" id="dss-date"></div>
<div class="dss-stats">
<div class="dss-stat"><div class="dss-stat-val" id="dss-yesterday-score">—</div><div class="dss-stat-lbl">Yesterday's score</div></div>
<div class="dss-stat"><div class="dss-stat-val" id="dss-carries">0</div><div class="dss-stat-lbl">Carried forward</div></div>
<div class="dss-stat"><div class="dss-stat-val" id="dss-streak">—</div><div class="dss-stat-lbl">Active challenges</div></div>
</div>
<div class="dss-priority-prompt">
<div class="dss-priority-label">What's your #1 priority today?</div>
<input class="dss-priority-input" id="dss-priority-input" placeholder="The one thing that would make today successful…" type="text"/>
<div class="dss-priority-hint">Optional — set your intention before the board opens</div>
</div>
<div class="dss-actions">
<button class="dss-cta" onclick="window.closeDailyStart()">Start my day →</button>
<button class="dss-skip" onclick="window.closeDailyStart(true)">Skip</button>
</div>
</div>
</div>
<div class="container">
<!-- Header -->
<header class="app-header">
<div class="header-top">
<div class="brand-area">
<a class="brand" href="index.html">dooit</a>
<span class="brand-tagline">task &amp; time tracker</span>
</div>
<div class="header-center">
<div class="header-score-widget" id="header-score-widget" title="Daily productivity score">
<div class="header-score-number" id="header-score-num">—</div>
<div class="header-score-bar-bg"><div class="header-score-bar-fill" id="header-score-bar" style="height:0%"></div></div>
<div class="header-score-details">
<div class="header-score-label">Score / 100</div>
<div class="header-score-grade" id="header-score-grade">Ready</div>
</div>
</div>
</div>
<div class="header-actions">
<div id="auth-area" style="visibility:hidden;">
<div id="google-signin-button"></div>
<div id="user-info" style="display:none;">
<img alt="" id="user-avatar" src=""/>
<span id="user-name"></span>
<span id="sync-status"></span>
<button id="sign-out-btn" onclick="window.signOut()">Sign out</button>
</div>
<span id="auth-status-note" style="font-size:0.75rem;opacity:0.45;">not signed in</span>
</div>
<button id="show-summary-btn-header">End of Day</button>
<button id="show-reports-btn">Reports</button>
<div class="more-menu-container">
<button class="more-menu-btn" onclick="window.toggleMoreMenu()">•••</button>
<div class="more-menu-dropdown" id="more-menu-dropdown">
<button onclick="window.flushAndNavigate('calendar.html')">Calendar</button>
<button onclick="window.flushAndNavigate('21days.html')">21 Days</button>
<button id="focus-mode-btn">Focus Mode</button>
</div>
</div>
</div>
</div>
<!-- Quick Add -->
<div class="quick-add">
<div class="quick-add-main">
<input id="new-task-text" placeholder="Add a task… or 'urgent: call doctor 2pm'" type="text"/>
<button id="qa-expand-btn" title="Set time, priority, project">+ details</button>
</div>
<button id="add-task-btn">Add</button>
<div class="quick-add-expanded" id="qa-expanded">
<label>Priority</label>
<select id="new-task-priority">
<option value="urgent">Urgent</option>
<option selected="" value="important">Important</option>
<option value="later">Later</option>
</select>
<label style="margin-left:6px;">Start</label>
<div class="time-input-group">
<input id="new-task-start-hour" max="12" min="1" placeholder="HH" type="number"/>
<span class="time-sep">:</span>
<input id="new-task-start-minute" max="59" min="0" placeholder="MM" type="number"/>
<select id="new-task-start-ampm"><option value="AM">AM</option><option value="PM">PM</option></select>
</div>
<select id="new-task-project" title="Project"><option value="">No project</option></select>
</div>
</div>
</header>
<!-- Focus Ribbon -->
<div class="focus-ribbon" id="focus-ribbon">
<span class="focus-ribbon-done" id="ribbon-done">0</span>
<span class="focus-ribbon-label">done today</span>
<div class="focus-ribbon-bar-wrap"><div class="focus-ribbon-bar" id="ribbon-bar" style="width:0%"></div></div>
<span class="focus-ribbon-msg" id="ribbon-msg">Start your first task</span>
</div>
<!-- Board -->
<div class="board">
<div class="column collapsed" id="col-previous-unfinished" ondragleave="window.dragLeave(event)" ondragover="window.dragOver(event,'previous_unfinished')" ondrop="window.dropTask(event,'previous_unfinished')">
<h2 onclick="window.toggleCarryForwardCollapse()">↩ Carry Forward <span class="count">(0)</span></h2>
<div class="task-list"></div>
<div class="cf-rescue-all">
<button class="cf-rescue-all-btn" onclick="window.rescheduleAllUnfinished()">Reschedule all to today →</button>
</div>
<div class="cf-collapse-hint" onclick="window.toggleCarryForwardCollapse()">tap to expand</div>
</div>
<div class="column" id="col-urgent" ondragleave="window.dragLeave(event)" ondragover="window.dragOver(event,'urgent')" ondrop="window.dropTask(event,'urgent')">
<h2>Urgent <span class="count">(0)</span></h2>
<div class="task-list"></div>
</div>
<div class="column" id="col-important" ondragleave="window.dragLeave(event)" ondragover="window.dragOver(event,'important')" ondrop="window.dropTask(event,'important')">
<h2>Important <span class="count">(0)</span></h2>
<div class="task-list"></div>
</div>
<div class="column" id="col-later" ondragleave="window.dragLeave(event)" ondragover="window.dragOver(event,'later')" ondrop="window.dropTask(event,'later')">
<h2>Later <span class="count">(0)</span></h2>
<div class="task-list"></div>
</div>
</div>
<!-- Plan Tomorrow Strip -->
<div id="plan-tomorrow-strip">
<div class="pt-header">
<div class="pt-header-left">
<span class="pt-title">📋 Plan Tomorrow</span>
<span class="pt-subtitle">Capture next day's priorities</span>
</div>
<div style="display:flex;align-items:center;gap:10px;">
<div class="pt-counts" id="pt-counts"></div>
<span id="pt-toggle-icon" style="font-size:0.75rem;opacity:0.5;">▼</span>
</div>
</div>
<div class="pt-body" id="pt-body">
<div class="pt-col">
<div class="pt-col-header urgent-col">Urgent</div>
<div class="pt-col-tasks" id="pt-col-urgent"></div>
<div class="pt-add-row">
<input id="pt-add-urgent" placeholder="Add urgent task…" type="text"/>
<button class="pt-add-btn" id="pt-btn-urgent">Add</button>
</div>
</div>
<div class="pt-col">
<div class="pt-col-header important-col">Important</div>
<div class="pt-col-tasks" id="pt-col-important"></div>
<div class="pt-add-row">
<input id="pt-add-important" placeholder="Add important task…" type="text"/>
<button class="pt-add-btn" id="pt-btn-important">Add</button>
</div>
</div>
<div class="pt-col">
<div class="pt-col-header later-col">Later</div>
<div class="pt-col-tasks" id="pt-col-later"></div>
<div class="pt-add-row">
<input id="pt-add-later" placeholder="Add later task…" type="text"/>
<button class="pt-add-btn" id="pt-btn-later">Add</button>
</div>
</div>
</div>
<div class="pt-actions" id="pt-actions">
<button id="pt-promote-btn" style="font-size:0.75rem;padding:6px 12px;background:var(--text);color:var(--bg);">Move all to Today's Board</button>
<span class="pt-promote-hint">Click this in the morning to start your day.</span>
</div>
</div>
<!-- Challenges & Routines Row -->
<div style="display:flex; gap:16px; margin-bottom:16px; flex-wrap:wrap;">
<div id="challenges-strip" style="flex:1; min-width:300px;">
<div class="cs-header">
<span class="cs-title">🎯 21-Day Challenges</span>
<span class="cs-badge" id="cs-badge">0 active</span>
</div>
<div class="cs-body" id="cs-body">
<div class="cs-empty" id="cs-empty" style="display:none;">No active challenges. Start one to build a habit.</div>
<div class="cs-cards" id="cs-cards"></div>
<div class="cs-quick-add-row">
<input id="cs-quick-add-input" placeholder="Name your challenge (e.g., Read 20 pages)" type="text"/>
<button id="cs-quick-add-btn">Begin Challenge</button>
</div>
</div>
</div>
<div id="routines-strip" style="flex:1; min-width:300px;">
<div class="rs-header">
<span class="rs-title">🔄 Routines</span>
<span class="rs-due-badge" id="rs-due-badge" style="display:none;">0 due</span>
</div>
<div class="rs-body" id="rs-body">
<div class="rs-empty" id="rs-empty" style="display:none;">No routines set.</div>
<div class="rs-list" id="rs-list"></div>
<div class="rs-add-form">
<input id="new-routine-name" placeholder="Routine name..." type="text"/>
<div class="rs-freq-wrap">
<span>Every</span>
<input id="new-routine-freq" min="1" type="number" value="1"/>
<select id="new-routine-unit"><option value="days">Days</option><option value="weeks">Weeks</option><option value="months">Months</option></select>
</div>
<button id="rs-add-btn">Add</button>
</div>
</div>
</div>
</div>
<!-- Panels Grid -->
<div class="panels-grid">
<div class="panel">
<h3>Progress</h3>
<div class="progress-tabs">
<button class="progress-tab-btn active" data-tab="day">Day</button>
<button class="progress-tab-btn" data-tab="week">Week</button>
<button class="progress-tab-btn" data-tab="month">Month</button>
</div>
<div id="progress-chart-area"></div>
</div>
<div class="panel">
<h3>Done Today</h3>
<div id="done-list-panel"></div>
</div>
<div class="panel">
<h3>Upcoming Events</h3>
<div class="events-add-row">
<input id="new-event-title" placeholder="Event title..." type="text"/>
<input id="new-event-date" type="date"/>
<input id="new-event-time" type="time"/>
<button id="add-event-btn">Add</button>
</div>
<div id="events-list"></div>
</div>
</div>
</div>
 Floating Panels 
<div class="icon-toggle-btn" id="projects-panel-toggle" title="Projects">
<svg fill="none" height="16" viewbox="0 0 16 16" width="16"><rect fill="none" height="10" stroke="currentColor" stroke-width="1.2" width="14" x="1" y="4"></rect><path d="M1 4L4 1H9L11 4" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.2"></path><line stroke="currentColor" stroke-width="1.2" x1="4" x2="12" y1="8" y2="8"></line><line stroke="currentColor" stroke-width="1.2" x1="4" x2="9" y1="11" y2="11"></line></svg>
<span class="icon-badge" id="projects-panel-count" style="display:none;">0</span>
</div>
<div id="projects-panel">
<div id="projects-panel-header"><span>Projects</span></div>
<div class="projects-add-form"><input id="new-project-name" placeholder="New project name…" type="text"/><button onclick="window.createProjectFromInput()">+ Add</button></div>
<div id="projects-panel-list"></div>
</div>
<div class="icon-toggle-btn" id="notification-panel-toggle" title="Notifications">
<svg fill="none" height="16" viewbox="0 0 16 16" width="16"><path d="M8 1.5C8 1.5 4 3 4 8V11.5H12V8C12 3 8 1.5 8 1.5Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.2"></path><line stroke="currentColor" stroke-width="1.2" x1="2.5" x2="13.5" y1="11.5" y2="11.5"></line><path d="M6.5 11.5 C6.5 12.33 7.17 13 8 13 C8.83 13 9.5 12.33 9.5 11.5" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>
<span class="icon-badge" id="unread-notification-count" style="display:none;">0</span>
</div>
<div id="notification-panel">
<div id="notification-panel-header"><span>Notifications</span><button id="clear-all-notifications" style="font-size:0.68rem;padding:2px 7px;">Clear all</button></div>
<div id="notification-list"></div>
</div>
 Modals 
<div class="modal-overlay" id="modal-overlay" onclick="if(event.target===this)window.closeModal()">
<div class="modal" id="modal-content"></div>
</div>
<div class="modal-overlay" id="reports-modal-overlay" onclick="if(event.target===this)window.closeReportsModal()">
<div class="modal" id="reports-modal">
<button class="modal-close-btn" onclick="window.closeReportsModal()">×</button>
<h2>Reports</h2>
<div class="report-toggle-buttons">
<button class="active" id="daily-report-toggle">Daily</button>
<button id="weekly-report-toggle">Weekly</button>
</div>
<div id="daily-report-view">
<div class="report-section">
<h4>Daily Report</h4>
<div class="report-filters">
<label for="daily-report-date">Date:</label>
<input id="daily-report-date" type="date"/>
<button id="daily-report-generate">Show Report</button>
</div>
</div>
<div id="daily-report-content"></div>
</div>
<div id="weekly-report-view" style="display:none;">
<div class="report-section">
<h4>Weekly Report</h4>
<div class="report-filters">
<label for="weekly-report-from">From:</label>
<input id="weekly-report-from" type="date"/>
<label for="weekly-report-to">To:</label>
<input id="weekly-report-to" type="date"/>
<button id="weekly-report-generate">Show Report</button>
</div>
</div>
<div id="weekly-report-content"></div>
</div>
</div>
</div>
 Main App Script 

`;
    document.body.insertAdjacentHTML('afterbegin', content);
    
    // Execute inline scripts
    
});
