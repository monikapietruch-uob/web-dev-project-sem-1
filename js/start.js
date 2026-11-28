/* =====================================================================
   js/start.js
   Start: runs everything when the page opens. Load this file last.
   Uses things from: helpers.js, pages.js, saved.js, playground.js, checks.js, quizzes.js, demos.js, tools.js, practice.js, terminal.js, wordgames.js, checkpoints.js, record.js
   ===================================================================== */
'use strict';

document.addEventListener('click', e => {
  const b = e.target.closest ? e.target.closest('button') : null;
  if (!b) return;
  if (b.classList.contains('btn-done')) {
    const id = b.dataset.done;
    if (isDone(id)) { store.remove('done:' + id); store.remove('doneAt:' + id); }
    else { store.set('done:' + id, '1'); store.set('doneAt:' + id, today()); }
    paintDone(); drawLists();
  } else if (b.classList.contains('copy-notes')) {
    copyText(notesText(b.closest('.view')), b);
  } else if (b.id === 'copy-report' || b.classList.contains('copy-report')) {
    copyText(reportText(), b);
  } else if (b.dataset.copyText) {
    copyText(document.getElementById(b.dataset.copyText).textContent, b);
  } else if (b.dataset.copyPg) {
    const parts = b.dataset.copyPg.split(':');
    copyText(savedCode(parts[0], parts[1]), b);
  }
});

$$('.pg').forEach(root => new Pg(root));
// Links to the study hub template: real when HUB_URL is filled in, a note for the student when it is not.
$$('[data-hub]').forEach(a => {
  if (HUB_URL) a.setAttribute('href', HUB_URL);
  else a.replaceWith(h('span', {class: 'quiet', text: 'Your tutor will give you the link to the template.'}));
});
$$('[data-practice-hub]').forEach(a => a.setAttribute('href', PRACTICE_HUB_URL));
dressTasks();
buildMakers();
initPractice();
initSaved();
refreshPractice();     // the word counters and checkers read the saved text once
$$('.maker').forEach(maker => maker.paint());
initQuizzes();
initGaps();
initBoxModel();
initDemos();
initLooks();
initTerminals();
initWordGames();
initRecord();
initSettings();
initLocks();
paintDone();
drawLists();
// When the site is not inside another page, links to other sites open in a new tab.
if (window.self === window.top) {
  $$('a[href^="http"]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
}
window.addEventListener('hashchange', () => show(location.hash.slice(1), true));
show(location.hash.slice(1), false);
