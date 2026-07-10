/**
 * @module router
 * @description Single Page Application router.
 */

export async function navigate(path) {
  // Clear body except for any global root elements if needed.
  // Actually we can just clear document.body entirely, but let's keep it safe.
  document.body.innerHTML = '';

  // Standardize path
  if (path.startsWith('/')) path = path.substring(1);
  if (path === '' || path === 'index.html') {
    const { render } = await import('./views/index.js');
    render();
  } else if (path === 'app' || path === 'app.html') {
    const { render } = await import('./views/app.js');
    render();
  } else if (path === 'calendar' || path === 'calendar.html') {
    const { render } = await import('./views/calendar.js');
    render();
  } else if (path === '21days' || path === '21days.html') {
    const { render } = await import('./views/21days.js');
    render();
  } else if (path === 'signin' || path === 'signin.html') {
    const { render } = await import('./views/signin.js');
    render();
  } else {
    // 404 fallback
    const { render } = await import('./views/app.js');
    render();
  }
}

// Intercept global link clicks
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && link.href && link.href.startsWith(window.location.origin)) {
    e.preventDefault();
    const path = link.pathname;
    window.history.pushState({}, '', path);
    navigate(path);
  }
});

// Intercept popstate (back/forward buttons)
window.addEventListener('popstate', () => {
  navigate(window.location.pathname);
});

// Provide a global programmatic navigation method
window.flushAndNavigate = (url) => {
  // If absolute path like 'calendar.html'
  let path = url;
  if (url.startsWith('http')) {
    path = new URL(url).pathname;
  } else if (!url.startsWith('/')) {
    path = '/' + url;
  }
  window.history.pushState({}, '', path);
  navigate(path);
};
