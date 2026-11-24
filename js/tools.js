/* =====================================================================
   js/tools.js
   Small tools: the box model explorer and the project card builder.
   Uses things from: helpers.js, pages.js, saved.js, playground.js, checks.js, quizzes.js, demos.js
   ===================================================================== */
'use strict';

// The sliders in "The box model"
function initBoxModel() {
  const box = $('#bm-box');
  if (!box) return;
  const pad = $('#bm-pad'), bor = $('#bm-bor'), mar = $('#bm-mar');
  const paint = () => {
    box.style.padding = pad.value + 'px';
    box.style.borderWidth = bor.value + 'px';
    box.style.margin = mar.value + 'px';
    $('#bm-pad-o').textContent = pad.value + 'px';
    $('#bm-bor-o').textContent = bor.value + 'px';
    $('#bm-mar-o').textContent = mar.value + 'px';
    $('#bm-code').textContent = 'section {\n  padding: ' + pad.value + 'px;\n  border: ' + bor.value +
      'px solid blue;\n  margin: ' + mar.value + 'px;\n}';
  };
  [pad, bor, mar].forEach(input => input.addEventListener('input', paint));
  paint();
}

// The project cards in "Project bank: collect"
function buildMakers() {
  $$('.maker').forEach(maker => {
    const key = k => 'proj' + maker.dataset.maker + '-' + k;
    const field = (k, label, help, big) => {
      const id = 'f-' + key(k);
      const input = big ? h('textarea', {class: 'notes', id: id, 'data-save': key(k)})
                        : h('input', {class: 'line', type: 'text', id: id, 'data-save': key(k)});
      return h('div', {class: 'field'}, h('label', {for: id, text: label}), input, help ? h('span', {class: 'help', text: help}) : null);
    };
    const card = h('div', {class: 'maker-card'}), code = h('code');
    const copy = h('button', {type: 'button', class: 'btn small', text: 'Copy the HTML'});
    maker.append(
      h('div', {},
        field('title', 'Title'),
        field('what', 'What is it? One sentence.', 'A … that … .', true),
        field('tools', 'Tools', 'For example: HTML, CSS'),
        field('learned', 'What I learned', 'How to … .', true),
        field('link', 'Link. You can leave this empty.')),
      h('div', {class: 'maker-out'},
        h('h4', {text: 'Your card'}), card,
        h('h4', {text: 'The HTML for your page'}), h('pre', {class: 'code'}, code),
        h('p', {class: 'btnrow'}, copy)));
    const paint = () => {
      const v = k => ($('#f-' + key(k), maker).value || '').trim();
      const title = v('title') || 'Project title', what = v('what') || 'What it is, in one sentence.';
      const tools = v('tools') || 'HTML, CSS', learned = v('learned') || 'What you learned.';
      const link = /^https?:\/\//i.test(v('link')) ? v('link') : '';
      const lines = ['<section class="card">', '  <h3>' + esc(title) + '</h3>', '  <p>' + esc(what) + '</p>',
        '  <p><strong>Tools:</strong> ' + esc(tools) + '</p>', '  <p><strong>What I learned:</strong> ' + esc(learned) + '</p>'];
      if (link) lines.push('  <p><a href="' + esc(link) + '">See the project</a></p>');
      lines.push('</section>');
      code.textContent = lines.join('\n');
      card.replaceChildren(...[
        h('h3', {text: title}), h('p', {text: what}),
        h('p', {}, h('b', {text: 'Tools: '}), tools),
        h('p', {}, h('b', {text: 'What I learned: '}), learned),
        link ? h('p', {}, h('a', {href: link, text: 'See the project'})) : null
      ].filter(Boolean));
    };
    maker.addEventListener('input', paint);
    copy.addEventListener('click', () => copyText(code.textContent, copy));
    maker.paint = paint;
  });
}
