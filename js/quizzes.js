/* =====================================================================
   js/quizzes.js
   Quizzes: a fieldset with class="q" and data-right="2".
   Uses things from: helpers.js, pages.js, saved.js, playground.js, checks.js
   ===================================================================== */
'use strict';

function initQuizzes() {
  $$('.q').forEach(q => {
    const right = Number(q.dataset.right), why = $('.q-why', q), buttons = $$('.q-opts button', q);
    const status = h('p', {class: 'quiet', role: 'status'});
    $('.q-opts', q).after(status);
    buttons.forEach((b, i) => b.addEventListener('click', () => {
      if (i + 1 === right) {
        buttons.forEach(x => { x.classList.remove('is-wrong'); x.disabled = x !== b; });
        b.classList.add('is-right');
        status.textContent = 'Correct.';
        if (why) why.hidden = false;
      } else {
        b.classList.add('is-wrong');
        status.textContent = 'Not that one. Try again.';
      }
    }));
  });
}
