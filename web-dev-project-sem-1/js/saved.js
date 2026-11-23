/* =====================================================================
   js/saved.js
   Boxes that save themselves: anything with data-save="a-name".
   Uses things from: helpers.js, pages.js
   ===================================================================== */
'use strict';

function initSaved() {
  $$('[data-save]').forEach(f => {
    const key = 'f:' + f.dataset.save, tick = f.type === 'checkbox';
    if (!f.id) f.id = 'f-' + f.dataset.save;
    const saved = store.get(key);
    if (tick) f.checked = saved === '1'; else if (saved !== null) f.value = saved;
    f.addEventListener(tick ? 'change' : 'input', () => {
      store.set(key, tick ? (f.checked ? '1' : '0') : f.value);
      fillNames();
    });
  });
  fillNames();
}

// Puts the student's GitHub username into example addresses.
function fillNames() {
  $$('[data-fill]').forEach(span => {
    const v = (store.get('f:' + span.dataset.fill) || '').trim();
    span.textContent = v || 'your-username';
  });
}

function labelFor(f) {
  if (f.labels && f.labels.length) return f.labels[0].textContent.trim();
  return f.getAttribute('aria-label') || '';
}

function notesText(view) {
  const lines = [view.dataset.title || $('h1', view).textContent, ''];
  $$('[data-save]', view).forEach(f => {
    if (f.type === 'checkbox') { if (f.checked) lines.push('[x] ' + labelFor(f)); return; }
    if (f.value.trim()) lines.push(labelFor(f), f.value.trim(), '');
  });
  return lines.join('\n');
}
