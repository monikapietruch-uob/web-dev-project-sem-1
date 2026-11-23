/* =====================================================================
   js/helpers.js
   Small helpers that every other file uses.
   Uses things from: nothing. This is the first file.
   ===================================================================== */
'use strict';

const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

// h('p', {class: 'quiet', text: 'Hello'}, child, child) makes one element
function h(tag, attrs) {
  const node = document.createElement(tag);
  const a = attrs || {};
  Object.keys(a).forEach(k => {
    const v = a[k];
    if (v === false || v == null) return;
    if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v === true ? '' : v);
  });
  for (let i = 2; i < arguments.length; i++) {
    const child = arguments[i];
    if (child != null && child !== false) node.append(child);
  }
  return node;
}

const esc = s => String(s).replace(/[&<>"]/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[ch]));

// Saving. Uses the browser's localStorage. If that is blocked, it keeps
// things in memory until the page is closed.
const memory = {};
const store = {
  get(key) {
    try { const v = localStorage.getItem('p2p:' + key); if (v !== null) return v; } catch (e) { /* blocked */ }
    return key in memory ? memory[key] : null;
  },
  set(key, value) {
    memory[key] = value;
    try { localStorage.setItem('p2p:' + key, value); } catch (e) { /* blocked */ }
  },
  remove(key) {
    delete memory[key];
    try { localStorage.removeItem('p2p:' + key); } catch (e) { /* blocked */ }
  }
};

// Copy text. If the browser refuses, show the text so it can be copied by hand.
function copyText(text, button) {
  const row = button.parentNode;
  let note = $('.copied', row);
  if (!note) { note = h('span', {class: 'copied', role: 'status'}); button.after(note); }
  const finish = ok => {
    if (ok) { note.textContent = 'Copied.'; setTimeout(() => { note.textContent = ''; }, 2500); return; }
    note.textContent = 'Copying is blocked here. Select the text below and copy it yourself.';
    let box = row.nextElementSibling;
    if (!box || !box.classList.contains('copybox')) {
      box = h('textarea', {class: 'copybox', readonly: true, 'aria-label': 'Text to copy'});
      row.after(box);
    }
    box.value = text; box.focus(); box.select();
  };
  try { navigator.clipboard.writeText(text).then(() => finish(true), () => finish(false)); }
  catch (e) { finish(false); }
}
