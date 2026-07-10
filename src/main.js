/**
 * @module main
 * @description Application entry point. Bootstraps modules and auth.
 */

import { initAuth } from './services/auth.js';
import { pullAll, loadFromLocalStorage } from './services/db.js';

// Import components
import { initHeader } from './components/header.js';
import { initBoard, renderBoard } from './components/board.js';
import { initDailyStart, showDailyStartScreen } from './components/dailyStart.js';
import { initPlanTomorrow, renderPlanTomorrow } from './components/planTomorrow.js';
import { initChallenges, renderChallenges } from './components/challenges.js';
import { initRoutines, renderRoutines } from './components/routines.js';
import { initEvents, renderEvents } from './components/events.js';
import { initAnalytics, renderProgressCharts, renderDoneList } from './components/analytics.js';
import { initNotifications, renderNotifications } from './components/notifications.js';
import { initProjects, renderProjects } from './components/projects.js';

let bootstrapped = false;
export async function bootstrap() {
  if (bootstrapped) return;
  bootstrapped = true;
  // Initialize component event listeners
  initHeader();
  initBoard();
  initDailyStart();
  initPlanTomorrow();
  initChallenges();
  initRoutines();
  initEvents();
  initAnalytics();
  initNotifications();
  initProjects();

  // Try to load offline cache immediately for fast render
  loadFromLocalStorage();
  _renderAll();

  // Initialize Auth
  await initAuth({
    onSignIn: async (user) => {
      // Pull fresh data from Firebase
      await pullAll();
      _renderAll();
      showDailyStartScreen();
    },
    onSignOut: () => {
      // Clear screen or show prompt
      document.querySelector('.board').innerHTML = '<div class="board-empty-state"><p>Please sign in to view your tasks.</p></div>';
    }
  });
}

export function _renderAll() {
  renderBoard();
  renderPlanTomorrow();
  renderChallenges();
  renderRoutines();
  renderEvents();
  renderProgressCharts();
  renderDoneList();
  renderNotifications();
  renderProjects();
}
