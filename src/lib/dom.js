/**
 * @module lib/dom
 * @description DOM manipulation helpers.
 */

/**
 * Selects first element matching selector.
 * @param {string} selector
 * @param {HTMLElement|Document} [root=document]
 * @returns {HTMLElement|null}
 */
export function qs(selector, root = document) {
  return root.querySelector(selector);
}

/**
 * Selects all elements matching selector.
 * @param {string} selector
 * @param {HTMLElement|Document} [root=document]
 * @returns {NodeListOf<HTMLElement>}
 */
export function qsa(selector, root = document) {
  return root.querySelectorAll(selector);
}

/**
 * Shorthand for addEventListener.
 * @param {HTMLElement|Window|Document} element
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean|AddEventListenerOptions} [options]
 */
export function on(element, event, handler, options) {
  if (element) {
    element.addEventListener(event, handler, options);
  }
}

/**
 * Sets textContent of an element by ID.
 * @param {string} id
 * @param {string} value
 */
export function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/**
 * Sets innerHTML of an element by ID.
 * @param {string} id
 * @param {string} value
 */
export function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

/**
 * Minimal DOM builder.
 * @param {string} tag
 * @param {Object} [attrs={}]
 * @param {...(string|HTMLElement)} children
 * @returns {HTMLElement}
 */
export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  
  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === 'className' || key === 'class') {
      element.className = value;
    } else if (key === 'dataset') {
      for (const [dKey, dVal] of Object.entries(value)) {
        element.dataset[dKey] = dVal;
      }
    } else if (key === 'style' && typeof value === 'object') {
      for (const [sKey, sVal] of Object.entries(value)) {
        element.style[sKey] = sVal;
      }
    } else {
      element.setAttribute(key, value);
    }
  }

  children.forEach(child => {
    if (child instanceof Node) {
      element.appendChild(child);
    } else if (child !== null && child !== undefined) {
      element.appendChild(document.createTextNode(String(child)));
    }
  });

  return element;
}
