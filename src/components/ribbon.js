/**
 * @module components/ribbon
 * @description The motivational focus ribbon below the header.
 */

import { state } from '../store.js';
import { RIBBON_MSGS } from '../config.js';

export function renderRibbon() {
  const doneEl = document.getElementById('ribbon-done');
  const barEl = document.getElementById('ribbon-bar');
  const msgEl = document.getElementById('ribbon-msg');
  if (!doneEl || !barEl || !msgEl) return;

  const today = state.today;
  const doneCount = (state.tasks ?? []).filter(t => t.date === today && t.status === 'done').length;

  doneEl.textContent = doneCount;
  
  // Max progress bar at 10 tasks for visual scale
  const pct = Math.min(100, (doneCount / 10) * 100);
  barEl.style.width = `${pct}%`;

  let msg = "Stay focused.";
  for (const [min, max, text] of RIBBON_MSGS) {
    if (doneCount >= min && doneCount <= max) {
      msg = text;
      break;
    }
  }
  msgEl.textContent = msg;
}
