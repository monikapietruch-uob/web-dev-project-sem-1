/* =====================================================================
   js/quizzes.js
   Quizzes: a fieldset with class="q" and data-right="2".
   Gap-fills: a box with class="gaps" (see initGaps at the end).
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

// Gap-fills: <div class="gaps"> with gaps such as <input class="gap" data-answer="item">
// (more than one right word: data-answer="closes|ends"), a button with class="gap-check"
// and a status line with class="gap-status". The button marks each gap green or red.
function initGaps() {
  $$('.gaps').forEach(box => {
    const gaps = $$('input.gap', box), check = $('.gap-check', box), status = $('.gap-status', box);
    if (!check || !status) return;
    check.addEventListener('click', () => {
      let right = 0;
      gaps.forEach(g => {
        const ok = g.dataset.answer.split('|').includes(g.value.trim().toLowerCase());
        g.classList.toggle('is-right', ok);
        g.classList.toggle('is-wrong', !ok);
        if (ok) right++;
      });
      status.textContent = right === gaps.length ? 'All correct.' : right + ' of ' + gaps.length + ' are right. Try the red ones again.';
    });
    gaps.forEach(g => g.addEventListener('input', () => g.classList.remove('is-right', 'is-wrong')));
  });
}
