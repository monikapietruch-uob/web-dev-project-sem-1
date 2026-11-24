/* =====================================================================
   js/settings.js
   Display settings: text size, light theme, less motion.
   This file is loaded in the <head>, before the page is drawn, so the
   page never flashes in the wrong colours. It uses nothing from the
   other files until initSettings() runs.
   Three choices, saved in this browser: text size, theme, motion.
   They are written on the <html> element as data-size, data-theme and
   data-motion. The rules that use them are in css/settings.css.
   Uses things from: nothing at first. Later: helpers.js
   ===================================================================== */
'use strict';

// This part runs at once, before the page is drawn.
(function applySettings() {
  try {
    ['size', 'theme', 'motion'].forEach(k => {
      const v = localStorage.getItem('p2p:set:' + k);
      if (v) document.documentElement.dataset[k] = v;
    });
  } catch (e) { /* saving is blocked: the standard look is used */ }
})();

// This part runs at the start, with everything else. It connects the buttons on the page "Display settings".
function initSettings() {
  $$('[data-setting]').forEach(group => {
    const key = group.dataset.setting, now = document.documentElement.dataset[key] || 'normal';
    $$('input', group).forEach(radio => {
      radio.checked = radio.value === now;
      radio.addEventListener('change', () => {
        if (radio.value === 'normal') { delete document.documentElement.dataset[key]; store.remove('set:' + key); }
        else { document.documentElement.dataset[key] = radio.value; store.set('set:' + key, radio.value); }
        if (key === 'motion') DEMO_LIST.forEach(d => { d.userPaused = radio.value === 'less' || d.userPaused; if (radio.value === 'less') d.halt(); });
      });
    });
  });
}
