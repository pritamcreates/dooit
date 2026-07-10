
document.addEventListener('DOMContentLoaded', () => {
    const content = `
 TOP HEADER 
<div class="page-header">
<div class="page-header-left">
<span class="brand">dooit</span>
<span class="brand-tagline">task &amp; time tracker</span>
<span class="page-title-sep">/</span>
<span class="page-title-label">calendar</span>
</div>
<div class="page-header-right">
<button class="back-btn" onclick="window.location.href='app.html'">← Back to Dashboard</button>
</div>
</div>
<div class="app">
<!-- SIDEBAR -->
<aside class="sidebar">
<div class="sidebar-top">
<div class="month-nav">
<button class="nav-btn" onclick="changeMonth(-1)">‹</button>
<div class="month-nav-label" id="sidebarMonthLabel">—</div>
<button class="nav-btn" onclick="changeMonth(1)">›</button>
</div>
<button class="today-btn" onclick="goToday()">↩ Jump to today</button>
<div class="sidebar-stats">
<div class="sidebar-stat">
<div class="sidebar-stat-val" id="statWorkDays">—</div>
<div class="sidebar-stat-lbl">Work</div>
</div>
<div class="sidebar-stat">
<div class="sidebar-stat-val" id="statTravelDays">—</div>
<div class="sidebar-stat-lbl">Away</div>
</div>
<div class="sidebar-stat">
<div class="sidebar-stat-val" id="statFreeDays">—</div>
<div class="sidebar-stat-lbl">Free</div>
</div>
</div>
</div>
<div class="sidebar-projects">
<div class="sidebar-section-label">Projects</div>
<div class="projects-list" id="projectsList"></div>
<button class="add-project-btn" onclick="openProjectModal()">
        + Add Project
      </button>
</div>
<div class="sidebar-travel">
<div class="sidebar-section-label">Away This Month</div>
<div class="travel-chips-wrap" id="travelChips">
<span class="travel-none">No travel logged yet</span>
</div>
</div>
</aside>
<!-- MAIN -->
<main class="main">
<div class="main-header">
<div class="month-display">
<div class="month-eyebrow">Availability &amp; Schedule</div>
<div class="month-title" id="mainMonthTitle">—</div>
</div>
</div>
<div class="conflict-banner" id="conflictBanner">
<span>⚠</span>
<span><strong>Schedule Conflict</strong> — Travel days overlap with remote project blocks.</span>
</div>
<div class="summary-row" id="summaryRow"></div>
<div class="calendar-section">
<div class="cal-day-headers">
<div class="cal-header">Mon</div>
<div class="cal-header">Tue</div>
<div class="cal-header">Wed</div>
<div class="cal-header">Thu</div>
<div class="cal-header">Fri</div>
<div class="cal-header weekend">Sat</div>
<div class="cal-header">Sun</div>
</div>
<div class="cal-grid" id="calGrid"></div>
</div>
<!-- UPCOMING EVENTS -->
<div class="upcoming-section" id="upcomingSection">
<div class="upcoming-header" onclick="toggleUpcoming()">
<div class="upcoming-header-left">
<span class="upcoming-title">Upcoming — Next 60 Days</span>
<span class="upcoming-count-badge" id="upcomingBadge">0 events</span>
</div>
<span class="upcoming-chevron">▾</span>
</div>
<div class="upcoming-body">
<div class="upcoming-list" id="upcomingList"></div>
</div>
</div>
</main>
</div>
 DAY MODAL 
<div class="modal-overlay" id="modalOverlay" onclick="closeModalOnBg(event)">
<div class="modal">
<div class="modal-header">
<div>
<div class="modal-date" id="modalDateTitle">—</div>
<div class="modal-date-sub" id="modalDateSub">—</div>
</div>
<button class="modal-close" onclick="closeModal()">×</button>
</div>
<div class="modal-section">
<div class="modal-label">Assign to Projects</div>
<div class="project-checkboxes" id="modalCheckboxes"></div>
</div>
<div class="modal-section">
<div class="modal-label">Note</div>
<textarea class="modal-note-input" id="modalNote" placeholder="e.g. Russian shoot 2.5hr morning…"></textarea>
</div>
<div class="modal-actions">
<button class="btn-clear" onclick="clearDay()">Clear Day</button>
<button class="btn-save" onclick="saveDay()">Save</button>
</div>
</div>
</div>
 PROJECT MODAL 
<div class="modal-overlay" id="projModalOverlay" onclick="closeProjModalOnBg(event)">
<div class="modal proj-modal">
<div class="modal-header">
<div class="proj-modal-title" id="projModalTitle">Add Project</div>
<button class="modal-close" onclick="closeProjModal()">×</button>
</div>
<div class="form-group">
<label class="form-label">Project Name</label>
<input class="form-input" id="projName" placeholder="e.g. Wedding Photography" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Short Label (calendar tag)</label>
<input class="form-input" id="projLabel" maxlength="12" placeholder="e.g. Wedding" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Description / Notes</label>
<input class="form-input" id="projMeta" placeholder="e.g. Weekends · Seasonal" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Color</label>
<div class="color-picker-row" id="colorPickerRow"></div>
<input id="projColorCustom" onchange="selectCustomColor(this.value)" style="display:none" type="color"/>
</div>
<div class="form-group">
<label class="form-label">Travel Project?</label>
<div class="travel-toggle" id="travelToggle" onclick="toggleTravel()">
<div class="toggle-switch" id="travelSwitch"></div>
<span id="travelToggleLabel">No — remote / local</span>
</div>
</div>
<div class="modal-actions" id="projModalActions">
<button class="btn-ghost" onclick="closeProjModal()">Cancel</button>
<button class="btn-accent" onclick="saveProject()">Save Project</button>
</div>
</div>
</div>

`;
    document.body.insertAdjacentHTML('afterbegin', content);
    
    // Execute inline scripts
    
// ── STATE ─────────────────────────────────────────────────
let currentYear, currentMonth;
let selectedDateKey = null;
let modalProjects = new Set();
let editingProjectKey = null;
let projTravelOn = false;
let selectedColor = '#111110';

const PRESET_COLORS = [
  '#111110','#1a56db','#15803d','#d44d1a',
  '#7c3aed','#a16207','#0891b2','#be185d',
  '#c0392b','#d97706','#0d9488','#65a30d'
];

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ── DEFAULT PROJECTS ──────────────────────────────────────
const DEFAULT_PROJECTS = {
  off: { name:'Day Off', label:'off', meta:'', color:'#a8a79e', travel:false, isOff:true }
};

// ── STORAGE ───────────────────────────────────────────────
function storageKey(y,m) { return `pritam_cal_${y}_${m}`; }
function loadMonthData(y,m){ try{return JSON.parse(localStorage.getItem(storageKey(y,m)))||{};}catch{return{};} }
function saveMonthData(y,m,d){ localStorage.setItem(storageKey(y,m),JSON.stringify(d)); }
function loadProjects(){ try{ const r=localStorage.getItem('pritam_projects'); return r?JSON.parse(r):null; }catch{return null;} }
function saveProjects(p){ localStorage.setItem('pritam_projects',JSON.stringify(p)); }
function getProjects(){ return loadProjects()||DEFAULT_PROJECTS; }

// ── COLOR HELPERS ──────────────────────────────────────────
function hexToRgb(hex){
  const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r?`${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}`:'0,0,0';
}

function getTagStyle(color) {
  const rgb = hexToRgb(color||'#888');
  return `background:rgba(${rgb},0.07);color:${color};border-color:rgba(${rgb},0.3);`;
}

function injectCustomTagStyles(projects){
  let el=document.getElementById('custom-tag-styles');
  if(!el){ el=document.createElement('style'); el.id='custom-tag-styles'; document.head.appendChild(el); }
  let css='';
  Object.entries(projects).forEach(([k,p])=>{
    const rgb=hexToRgb(p.color||'#888');
    css+=`.tag-p-${k}{background:rgba(${rgb},0.07);color:${p.color||'#888'};border-color:rgba(${rgb},0.3);}`;
    css+=`.chip-p-${k}{background:rgba(${rgb},0.07);color:${p.color||'#888'};border-color:rgba(${rgb},0.3);}`;
  });
  el.textContent=css;
}

// ── RENDER PROJECTS SIDEBAR ────────────────────────────────
function renderProjectsList(){
  const projects=getProjects();
  injectCustomTagStyles(projects);
  const list=document.getElementById('projectsList');
  list.innerHTML='';
  Object.entries(projects).forEach(([key,p])=>{
    const pill=document.createElement('div');
    pill.className='project-pill';
    pill.innerHTML=`
      <div class="pill-dot" style="background:${p.color||'#888'}"></div>
      <div class="pill-info">
        <div class="pill-name">${p.name}</div>
        ${p.meta?`<div class="pill-meta">${p.meta}</div>`:''}
      </div>
      <div class="pill-actions">
        ${!p.isOff?`<button class="pill-btn" title="Edit" onclick="openProjectModal('${key}');event.stopPropagation();">✎</button>
        <button class="pill-btn del" title="Delete" onclick="deleteProject('${key}');event.stopPropagation();">✕</button>`:''}
      </div>`;
    list.appendChild(pill);
  });
}

// ── CALENDAR RENDER ────────────────────────────────────────
function renderCalendar(){
  const projects=getProjects();
  injectCustomTagStyles(projects);
  const data=loadMonthData(currentYear,currentMonth);
  const grid=document.getElementById('calGrid');
  grid.innerHTML='';

  const today=new Date();
  const firstDay=new Date(currentYear,currentMonth,1);
  let startDow=firstDay.getDay();
  startDow=startDow===0?6:startDow-1; // Mon-based
  const daysInMonth=new Date(currentYear,currentMonth+1,0).getDate();

  const mn=MONTH_NAMES[currentMonth];
  document.getElementById('mainMonthTitle').innerHTML=`${mn} <em>${currentYear}</em>`;
  document.getElementById('sidebarMonthLabel').textContent=mn+' '+currentYear;

  const travelKeys=Object.entries(projects).filter(([,p])=>p.travel).map(([k])=>k);

  for(let i=0;i<startDow;i++){
    const e=document.createElement('div');
    e.className='cal-day empty';
    grid.appendChild(e);
  }

  let workDays=0, travelDays=0, freeDays=0;
  const counts={};
  Object.keys(projects).forEach(k=>{ counts[k]=0; });
  let conflicts=[];
  let travelBlocks=[];

  for(let d=1;d<=daysInMonth;d++){
    const date=new Date(currentYear,currentMonth,d);
    const dow=date.getDay();
    const isSat=dow===6;
    const dateKey=`${currentYear}-${currentMonth}-${d}`;
    const dayData=data[dateKey]||{};
    const dayProjects=dayData.projects||[];
    const note=dayData.note||'';

    const cell=document.createElement('div');
    cell.className='cal-day';
    if(isSat) cell.classList.add('saturday');

    const isToday=(today.getFullYear()===currentYear&&today.getMonth()===currentMonth&&today.getDate()===d);
    if(isToday) cell.classList.add('today');

    const hasTravel=dayProjects.some(p=>travelKeys.includes(p));
    const hasUK=dayProjects.includes('uk');
    if(hasTravel) cell.classList.add('has-travel');

    if(hasTravel&&hasUK){
      conflicts.push(d);
      const dot=document.createElement('div');
      dot.className='conflict-dot';
      dot.title='Conflict: Travel + UK same day';
      cell.appendChild(dot);
    }

    const numEl=document.createElement('div');
    numEl.className='day-num';
    numEl.textContent=d;
    cell.appendChild(numEl);

    if(isSat&&dayProjects.length===0){
      const tagEl=document.createElement('div');
      tagEl.className='day-tag tag-off';
      tagEl.textContent='off';
      cell.appendChild(tagEl);
    } else {
      dayProjects.forEach(p=>{
        if(projects[p]){
          const tagEl=document.createElement('div');
          tagEl.className=`day-tag tag-p-${p}`;
          tagEl.textContent=projects[p].label||p;
          cell.appendChild(tagEl);
          if(counts[p]!==undefined) counts[p]++;
        }
      });
    }

    if(note){
      const noteEl=document.createElement('div');
      noteEl.className='day-note';
      noteEl.textContent=note;
      cell.appendChild(noteEl);
    }

    if(!isSat){
      if(dayProjects.length===0) freeDays++;
      else if(!dayProjects.includes('off')){ workDays++; if(hasTravel) travelDays++; }
    }
    if(hasTravel) travelBlocks.push({d,projects:dayProjects});

    cell.addEventListener('click',()=>openModal(dateKey,d,dow));
    cell.style.animationDelay=(d*0.008)+'s';
    grid.appendChild(cell);
  }

  document.getElementById('statWorkDays').textContent=workDays;
  document.getElementById('statTravelDays').textContent=travelDays;
  document.getElementById('statFreeDays').textContent=freeDays;

  // Summary cards
  const summaryRow=document.getElementById('summaryRow');
  summaryRow.innerHTML='';
  Object.entries(projects).forEach(([k,p])=>{
    if(p.isOff) return;
    const card=document.createElement('div');
    card.className='summary-card';
    card.style.setProperty('--card-accent', p.color||'#888');
    card.innerHTML=`
      <div class="summary-card-count">${counts[k]||0}</div>
      <div class="summary-card-label">${p.label||p.name}</div>`;
    summaryRow.appendChild(card);
  });

  document.getElementById('conflictBanner').classList.toggle('visible',conflicts.length>0);

  renderUpcoming();

  // Travel chips
  const chipsEl=document.getElementById('travelChips');
  chipsEl.innerHTML='';
  if(travelBlocks.length===0){
    chipsEl.innerHTML='<span class="travel-none">No travel logged yet</span>';
  } else {
    travelBlocks.forEach(tb=>{
      tb.projects.filter(p=>travelKeys.includes(p)).forEach(p=>{
        const chip=document.createElement('span');
        chip.className=`travel-chip chip-p-${p}`;
        chip.textContent=`Day ${tb.d} — ${projects[p]?.label||p}`;
        chipsEl.appendChild(chip);
      });
    });
  }
}

// ── DAY MODAL ──────────────────────────────────────────────
function openModal(dateKey,dayNum,dow){
  selectedDateKey=dateKey;
  modalProjects=new Set();
  const data=loadMonthData(currentYear,currentMonth);
  const dayData=data[dateKey]||{};
  (dayData.projects||[]).forEach(p=>modalProjects.add(p));
  document.getElementById('modalNote').value=dayData.note||'';
  document.getElementById('modalDateTitle').textContent=`${dayNum} ${MONTH_SHORT[currentMonth]}`;
  document.getElementById('modalDateSub').textContent=`${DAY_NAMES[dow]} · ${currentYear}`;
  renderModalCheckboxes();
  document.getElementById('modalOverlay').classList.add('open');
}

function renderModalCheckboxes(){
  const projects=getProjects();
  const container=document.getElementById('modalCheckboxes');
  container.innerHTML='';
  Object.entries(projects).forEach(([key,p])=>{
    const isSelected=modalProjects.has(key);
    const div=document.createElement('div');
    div.className='project-check'+(isSelected?' is-selected':'');
    div.id=`chk-${key}`;
    div.onclick=()=>toggleProject(key);
    div.innerHTML=`
      <div class="check-dot" style="background:${p.color||'#888'}"></div>
      <div class="check-label" style="${isSelected?`color:${p.color}`:''}"> ${p.name}</div>
      <span class="check-mark">✓</span>`;
    container.appendChild(div);
  });
}

function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');
  selectedDateKey=null;
}
function closeModalOnBg(e){ if(e.target===document.getElementById('modalOverlay')) closeModal(); }

function toggleProject(key){
  if(key==='off'){
    if(modalProjects.has('off')) modalProjects.delete('off');
    else { modalProjects.clear(); modalProjects.add('off'); }
  } else {
    modalProjects.delete('off');
    if(modalProjects.has(key)) modalProjects.delete(key);
    else modalProjects.add(key);
  }
  renderModalCheckboxes();
}

function saveDay(){
  if(!selectedDateKey) return;
  const data=loadMonthData(currentYear,currentMonth);
  const note=document.getElementById('modalNote').value.trim();
  if(modalProjects.size===0&&!note) delete data[selectedDateKey];
  else data[selectedDateKey]={ projects:Array.from(modalProjects), note };
  saveMonthData(currentYear,currentMonth,data);
  closeModal(); renderCalendar();
}

function clearDay(){
  if(!selectedDateKey) return;
  const data=loadMonthData(currentYear,currentMonth);
  delete data[selectedDateKey];
  saveMonthData(currentYear,currentMonth,data);
  closeModal(); renderCalendar();
}

// ── PROJECT MODAL ──────────────────────────────────────────
function buildColorPicker(selected){
  const row=document.getElementById('colorPickerRow');
  row.innerHTML='';
  PRESET_COLORS.forEach(c=>{
    const sw=document.createElement('div');
    sw.className='color-swatch'+(selected===c?' selected':'');
    sw.style.background=c;
    sw.onclick=()=>{ selectedColor=c; buildColorPicker(c); };
    row.appendChild(sw);
  });
  const custom=document.createElement('div');
  custom.className='color-swatch-custom';
  custom.title='Custom color';
  custom.textContent='🎨';
  custom.onclick=()=>document.getElementById('projColorCustom').click();
  row.appendChild(custom);
}

function selectCustomColor(c){
  selectedColor=c;
  buildColorPicker(null);
  const sw=document.querySelector('.color-swatch-custom');
  if(sw){ sw.style.background=c; sw.textContent=''; }
}

function openProjectModal(key=null){
  editingProjectKey=key;
  projTravelOn=false;
  selectedColor=PRESET_COLORS[0];
  document.getElementById('projModalTitle').textContent=key?'Edit Project':'Add Project';
  document.getElementById('projName').value='';
  document.getElementById('projLabel').value='';
  document.getElementById('projMeta').value='';
  if(key){
    const p=getProjects()[key];
    if(p){
      document.getElementById('projName').value=p.name||'';
      document.getElementById('projLabel').value=p.label||'';
      document.getElementById('projMeta').value=p.meta||'';
      selectedColor=p.color||PRESET_COLORS[0];
      projTravelOn=!!p.travel;
    }
    const actions=document.getElementById('projModalActions');
    if(!document.getElementById('projDeleteBtn')){
      const del=document.createElement('button');
      del.id='projDeleteBtn'; del.className='btn-danger';
      del.textContent='Delete';
      del.onclick=()=>{ deleteProject(key); closeProjModal(); };
      actions.insertBefore(del,actions.firstChild);
    }
  } else {
    const del=document.getElementById('projDeleteBtn');
    if(del) del.remove();
  }
  buildColorPicker(selectedColor);
  updateTravelToggle();
  document.getElementById('projModalOverlay').classList.add('open');
  setTimeout(()=>document.getElementById('projName').focus(),100);
}

function closeProjModal(){
  document.getElementById('projModalOverlay').classList.remove('open');
  editingProjectKey=null;
  const del=document.getElementById('projDeleteBtn');
  if(del) del.remove();
}
function closeProjModalOnBg(e){ if(e.target===document.getElementById('projModalOverlay')) closeProjModal(); }

function toggleTravel(){ projTravelOn=!projTravelOn; updateTravelToggle(); }
function updateTravelToggle(){
  const t=document.getElementById('travelToggle');
  t.className='travel-toggle'+(projTravelOn?' on':'');
  document.getElementById('travelToggleLabel').textContent=projTravelOn?'Yes — away from base':'No — remote / local';
}

function saveProject(){
  const name=document.getElementById('projName').value.trim();
  if(!name){ document.getElementById('projName').focus(); return; }
  const label=document.getElementById('projLabel').value.trim()||name.slice(0,8);
  const meta=document.getElementById('projMeta').value.trim();
  const projects=getProjects();
  let key=editingProjectKey||name.toLowerCase().replace(/[^a-z0-9]/g,'_').slice(0,16)+'_'+Date.now().toString(36);
  projects[key]={ name, label, meta, color:selectedColor, travel:projTravelOn };
  saveProjects(projects); closeProjModal();
  renderProjectsList(); renderCalendar();
}

function deleteProject(key){
  if(!confirm(`Delete "${getProjects()[key]?.name}"? Past calendar entries are preserved.`)) return;
  const projects=getProjects();
  delete projects[key];
  saveProjects(projects);
  renderProjectsList(); renderCalendar();
}

// ── UPCOMING EVENTS ────────────────────────────────────────
function toggleUpcoming(){
  document.getElementById('upcomingSection').classList.toggle('open');
}

function renderUpcoming(){
  const projects = getProjects();
  const today = new Date();
  today.setHours(0,0,0,0);
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() + 60);

  const DAY_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const MONTH_NAMES_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const events = [];
  let cursor = new Date(today);
  while(cursor <= cutoff){
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const d = cursor.getDate();
    const key = `${y}-${m}-${d}`;
    const data = loadMonthData(y, m);
    const dayData = data[key];
    if(dayData && dayData.projects && dayData.projects.length > 0 && !dayData.projects.includes('off')){
      const diffMs = cursor - today;
      const diffDays = Math.round(diffMs / 86400000);
      events.push({ date: new Date(cursor), y, m, d, key, dayData, diffDays });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  const badge = document.getElementById('upcomingBadge');
  badge.textContent = events.length === 1 ? '1 event' : `${events.length} events`;

  const list = document.getElementById('upcomingList');
  list.innerHTML = '';

  if(events.length === 0){
    list.innerHTML = '<div class="upcoming-empty">No tagged days in the next 60 days.</div>';
    return;
  }

  let lastMonth = null;
  events.forEach(ev => {
    const monthKey = `${ev.y}-${ev.m}`;
    if(monthKey !== lastMonth){
      lastMonth = monthKey;
      const div = document.createElement('div');
      div.className = 'upcoming-month-divider';
      div.innerHTML = `<span class="upcoming-month-label">${MONTH_NAMES_FULL[ev.m]} ${ev.y}</span><div class="upcoming-month-line"></div>`;
      list.appendChild(div);
    }

    const row = document.createElement('div');
    row.className = 'upcoming-row';

    let countdownText, countdownClass;
    if(ev.diffDays === 0){ countdownText = 'Today'; countdownClass = 'today-label'; }
    else if(ev.diffDays === 1){ countdownText = 'Tomorrow'; countdownClass = 'soon'; }
    else if(ev.diffDays <= 7){ countdownText = `in ${ev.diffDays}d`; countdownClass = 'soon'; }
    else { countdownText = `in ${ev.diffDays}d`; countdownClass = ''; }

    const tagsHtml = (ev.dayData.projects || []).map(p => {
      if(p === 'off') return '';
      const proj = projects[p];
      if(!proj) return '';
      return `<span class="day-tag tag-p-${p}">${proj.label || proj.name || p}</span>`;
    }).join('');

    const noteHtml = ev.dayData.note
      ? `<span class="upcoming-note" title="${ev.dayData.note.replace(/"/g,'&quot;')}">${ev.dayData.note}</span>`
      : '';

    row.innerHTML = `
      <div class="upcoming-date-col">
        <div class="upcoming-date-main">${DAY_SHORT[ev.date.getDay()]}, ${ev.d} ${MONTH_SHORT[ev.m]}</div>
        <div class="upcoming-date-sub">${ev.y}</div>
      </div>
      <div class="upcoming-countdown ${countdownClass}">${countdownText}</div>
      <div class="upcoming-tags">${tagsHtml}</div>
      ${noteHtml}`;

    list.appendChild(row);
  });
}

// ── NAVIGATION ─────────────────────────────────────────────
function changeMonth(dir){
  currentMonth+=dir;
  if(currentMonth>11){ currentMonth=0; currentYear++; }
  if(currentMonth<0) { currentMonth=11; currentYear--; }
  renderCalendar();
}
function goToday(){
  const now=new Date();
  currentYear=now.getFullYear(); currentMonth=now.getMonth();
  renderCalendar();
}

// ── KEYBOARD ───────────────────────────────────────────────
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ closeModal(); closeProjModal(); }
  const dayOpen=document.getElementById('modalOverlay').classList.contains('open');
  const projOpen=document.getElementById('projModalOverlay').classList.contains('open');
  if(!dayOpen&&!projOpen){
    if(e.key==='ArrowLeft') changeMonth(-1);
    if(e.key==='ArrowRight') changeMonth(1);
  }
});

// ── INIT ───────────────────────────────────────────────────
(function init(){
  const now=new Date();
  currentYear=now.getFullYear(); currentMonth=now.getMonth();
  renderProjectsList();
  renderCalendar();
})();


});
