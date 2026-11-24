/* =====================================================================
   js/checks.js
   The goals for each playground.
   Each goal has t (the sentence the student reads) and f (a test).
   In a test:  c.doc = the student's HTML, read as a page
               c.css = questions about the student's CSS
               c.src = the code as plain text      c.run = what happened after Run
   Uses things from: helpers.js, pages.js, saved.js, playground.js
   ===================================================================== */
'use strict';

const words = s => (s || '').trim().split(/\s+/).filter(Boolean).length;
const text = node => (node ? node.textContent.trim() : '');
const notZero = v => !!v && !/^0(px|em|rem|%)?$/.test(v);
function cssBlock(css, sel) {
  const clean = (css || '').replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /([^{}]+)\{([^}]*)\}/g;
  let body = '', m;
  while ((m = re.exec(clean))) {
    if (m[1].split(',').some(s => s.trim().toLowerCase() === sel)) body += m[2] + ';';
  }
  return body;
}

// A "state" from the result window ends with the background colour and the text colour of the page.
const coloursOf = state => String(state || '').split('\u0001').slice(2).join(' ');
const CHECKS = {
  'html-skeleton': [
    { t: 'The first line is <!DOCTYPE html>',
      f: c => /^\s*<!doctype html>/i.test(c.src.html) },
    { t: 'The <title> has text in it',
      f: c => text($('head title', c.doc)).length > 1 },
    { t: 'The <body> has one <h1> with your name',
      f: c => $$('body h1', c.doc).length === 1 && text($('body h1', c.doc)).length > 1 },
    { t: 'Under the heading there is a <p> with three words or more',
      f: c => words(text($('body h1 ~ p', c.doc))) >= 3 }
  ],
  'html-about': [
    { t: 'One <h1>, with your own name in it',
      f: c => $$('h1', c.doc).length === 1 && text($('h1', c.doc)).length > 1 && text($('h1', c.doc)) !== 'Your Name' },
    { t: 'An <h2> heading, such as “About me”',
      f: c => text($('h2', c.doc)).length > 1 },
    { t: 'Two paragraphs, with five words or more in each',
      f: c => $$('p', c.doc).filter(p => words(text(p)) >= 5).length >= 2 }
  ],
  'html-lists': [
    { t: 'A <ul> list with three items or more',
      f: c => c.doc.querySelectorAll('ul > li').length >= 3 },
    { t: 'An <ol> list with three items or more',
      f: c => c.doc.querySelectorAll('ol > li').length >= 3 },
    { t: 'Every <li> is inside a <ul> or an <ol>, and none is empty',
      f: c => { const all = $$('li', c.doc); return all.length > 0 && all.every(li => /^(UL|OL)$/.test(li.parentNode.nodeName) && text(li).length > 0); } }
  ],
  'html-links': [
    { t: 'A link to GitHub. Its href starts with https://github.com/',
      f: c => $$('a', c.doc).some(a => /^https:\/\/github\.com\/[\w-]+/i.test(a.getAttribute('href') || '')) },
    { t: 'A link to LinkedIn. Its href starts with https://www.linkedin.com/',
      f: c => $$('a', c.doc).some(a => /^https:\/\/(www\.)?linkedin\.com\/\S+/i.test(a.getAttribute('href') || '')) },
    { t: 'Every <a> has an href',
      f: c => { const all = $$('a', c.doc); return all.length >= 2 && all.every(a => (a.getAttribute('href') || '').trim().length > 0); } },
    { t: 'The link text is words. It is not “click here” and it is not a web address.',
      f: c => { const all = $$('a', c.doc); return all.length >= 2 && all.every(a => text(a).length > 2 && !/click here|^here$|^https?:|^www\./i.test(text(a))); } }
  ],
  'html-image': [
    { t: 'An <img> that shows one of the three files',
      f: c => $$('img', c.doc).some(i => !!ASSETS[i.getAttribute('src')]) },
    { t: 'The alt text has three words or more',
      f: c => $$('img', c.doc).some(i => words(i.getAttribute('alt')) >= 3) },
    { t: 'The image is inside <figure>, with a <figcaption>', extra: true,
      f: c => !!$('figure img', c.doc) && text($('figure figcaption', c.doc)).length > 0 }
  ],
  'mypage-html': [
    { t: 'The <h1> has your name',
      f: c => { const t = text($('header h1', c.doc)); return t.length > 1 && t !== 'Your Name'; } },
    { t: 'The line under your name says something about you',
      f: c => { const t = text($('header p', c.doc)); return words(t) >= 3 && t !== 'One line about you.'; } },
    { t: 'The About me section has two paragraphs',
      f: c => { const all = $$('section', c.doc); const s = all.find(x => /about/i.test(text($('h2', x)))) || all[0]; return !!s && $$('p', s).filter(p => words(text(p)) >= 4).length >= 2; } },
    { t: 'The Skills section has a list with three items or more',
      f: c => $$('section', c.doc).some(s => /skills/i.test(text($('h2', s))) && $$('li', s).length >= 3) },
    { t: 'The footer has a link',
      f: c => $$('footer a', c.doc).some(a => (a.getAttribute('href') || '').length > 3 && text(a).length > 1) },
    { t: 'The page has a picture with alt text', extra: true,
      f: c => $$('img', c.doc).some(i => words(i.getAttribute('alt')) >= 3) }
  ],
  'css-first': [
    { t: 'The h1 has a color',
      f: c => c.css.has('h1', 'color') },
    { t: 'The body has a background-color',
      f: c => c.css.has('body', 'background-color') },
    { t: 'The p has a font-size',
      f: c => c.css.has('p', 'font-size') },
    { t: 'index.html still has its <link> line',
      f: c => linked(c.src.html) }
  ],
  'css-colour': [
    { t: 'The body has a font-family',
      f: c => c.css.has('body', 'font-family') },
    { t: 'The h1 has a color, written as a hex code',
      f: c => /(^|[;\s])color\s*:\s*#[0-9a-f]{3,8}\b/i.test(cssBlock(c.src.css, 'h1')) },
    { t: 'The body has a color and a background-color, and they are different',
      f: c => { const a = c.css.val('body', 'color'), b = c.css.val('body', 'background-color'); return !!a && !!b && a !== b; } }
  ],
  'css-box': [
    { t: 'The section has padding',
      f: c => notZero(c.css.val('section', 'padding-top')) },
    { t: 'The section has a border, with a width, a style and a colour',
      f: c => notZero(c.css.val('section', 'border-top-width')) && !/^(none|hidden|)$/.test(c.css.val('section', 'border-top-style')) },
    { t: 'The section has margin-bottom, so there is space between the two boxes',
      f: c => notZero(c.css.val('section', 'margin-bottom')) }
  ],
  'css-class': [
    { t: 'Two elements or more have class="card"',
      f: c => c.doc.querySelectorAll('.card').length >= 2 },
    { t: 'The .card rule has a background-color',
      f: c => c.css.has('.card', 'background-color') },
    { t: 'The .card rule has padding',
      f: c => notZero(c.css.val('.card', 'padding-top')) },
    { t: 'The .card rule has a border-radius, for round corners', extra: true,
      f: c => notZero(c.css.val('.card', 'border-top-left-radius')) }
  ],
  'mypage-css': [
    { t: 'index.html has the <link> line for style.css',
      f: c => linked(c.src.html) },
    { t: 'The body has a font-family',
      f: c => c.css.has('body', 'font-family') },
    { t: 'The header or the h1 has a color or a background-color',
      f: c => ['header', 'h1'].some(s => c.css.has(s, 'color') || c.css.has(s, 'background-color')) },
    { t: 'The sections have padding',
      f: c => ['section', '.card', 'main'].some(s => notZero(c.css.val(s, 'padding-top'))) },
    { t: 'There are six lines of style or more',
      f: c => (c.src.css.replace(/\/\*[\s\S]*?\*\//g, '').match(/[\w-]+\s*:[^;{}]+;/g) || []).length >= 6 },
    { t: 'Links have their own colour', extra: true,
      f: c => c.css.has('a', 'color') }
  ],
  'js-button': [
    { t: 'The page has a button',
      f: c => !!$('button', c.doc) },
    { t: 'The script listens for a click',
      f: c => /addEventListener\(\s*["']click["']/.test(c.src.html) || /\.onclick\s*=/.test(c.src.html) },
    { t: 'You clicked Run, then clicked the button, and the page changed',
      f: c => c.run.clicked && c.run.changed },
    { t: 'The message is your own sentence',
      f: c => /textContent\s*=\s*["'`][^"'`]{3,}/.test(c.src.html) && c.src.html.indexOf('Hello! Thank you for visiting my page.') === -1 },
    { t: 'The click also changes a colour', extra: true,
      f: c => /\.style\.(color|backgroundColor)\s*=/.test(c.src.html) }
  ],
  'js-dark': [
    { t: 'The CSS has a .dark rule with a background-color',
      f: c => ['.dark', 'body.dark'].some(s => c.css.has(s, 'background-color')) },
    { t: 'The .dark rule changes the colour of the text too',
      f: c => ['.dark', 'body.dark'].some(s => c.css.has(s, 'color')) },
    { t: 'You clicked Run, then the button, and the colours changed',
      f: c => c.run.clicked && c.run.states.some(st => coloursOf(st) !== coloursOf(c.run.base)) },
    { t: 'You clicked the button again, and the page went back to light',
      f: c => c.run.states.length >= 2 && c.run.states.some(st => coloursOf(st) !== coloursOf(c.run.base)) && c.run.states.indexOf(c.run.base) !== -1 }
  ],
  'js-toggle': [
    { t: 'One element starts hidden',
      f: c => !!$('[hidden]', c.doc) },
    { t: 'You clicked Run, then the button, and the hidden text appeared',
      f: c => c.run.clicked && c.run.changed },
    { t: 'The script uses if and else to change the text on the button',
      f: c => /if\s*\(/.test(c.src.html) && /\belse\b/.test(c.src.html) && /\.textContent\s*=/.test(c.src.html) },
    { t: 'The hidden sentence is your own',
      f: c => { const el = $('[hidden]', c.doc); return !!el && text(el).length > 5 && text(el).indexOf('It hoovers at 3 a.m.') === -1; } }
  ],
  'js-counter': [
    { t: 'The script keeps the number in a variable made with let',
      f: c => /\blet\s+\w+\s*=\s*0/.test(c.src.html) },
    { t: 'You clicked Run, then the button twice, and the number went up each time',
      f: c => c.run.states.length >= 2 && c.run.states[0] !== c.run.base && c.run.states[1] !== c.run.states[0] },
    { t: 'An if checks the number and changes what the page says',
      f: c => /if\s*\(\s*\w+\s*(>=|>|===|==)\s*\d+\s*\)/.test(c.src.html) },
    { t: 'A second button puts the number back to zero', extra: true,
      f: c => $$('button', c.doc).length >= 2 && (c.src.html.match(/=\s*0\s*;/g) || []).length >= 2 }
  ],
  'form-contact': [
    { t: 'An email box: <input type="email"> with an id',
      f: c => !!$('form input[type="email"][id]', c.doc) },
    { t: 'A message box: <textarea> with an id',
      f: c => !!$('form textarea[id]', c.doc) },
    { t: 'Three labels. The for of each label matches the id of its box.',
      f: c => { const boxes = $$('form input, form textarea', c.doc); return boxes.length >= 3 && boxes.every(b => b.id && $$('label', c.doc).some(l => l.getAttribute('for') === b.id && text(l).length > 1)); } },
    { t: 'The email box is required',
      f: c => { const e = $('form input[type="email"]', c.doc); return !!e && e.hasAttribute('required'); } },
    { t: 'You clicked Run, filled in the form and pressed Send. The page said thank you.',
      f: c => c.run.submitted && c.run.changed }
  ],
  'conflict': [
    { t: 'No marker lines are left: no row of <, no row of = and no row of >',
      f: c => !/<{4,}|={4,}|>{4,}/.test(c.src.html) },
    { t: 'Leo is in the list',
      f: c => $$('ul > li', c.doc).some(li => text(li) === 'Leo') },
    { t: 'Sana is in the list',
      f: c => $$('ul > li', c.doc).some(li => text(li) === 'Sana') },
    { t: 'The list has four names, and each name is there once',
      f: c => { const names = $$('ul > li', c.doc).map(text); return names.length === 4 && new Set(names).size === 4; } }
  ],
  'yours-home': [
    { t: 'The <h1> is your name',
      f: c => { const t = text($('h1', c.doc)); return t.length > 2 && !/class of 2026/i.test(t); } },
    { t: 'The <title> and the link in the header have your name too',
      f: c => !/class of 2026/i.test(text($('head title', c.doc))) && text($('head title', c.doc)).length > 2 && !/class of 2026/i.test(text($('header', c.doc))) },
    { t: 'An “About me” heading, with two paragraphs of six words or more',
      f: c => $$('h2', c.doc).some(x => /about/i.test(text(x))) && $$('main p', c.doc).filter(p => !$('a', p) && words(text(p)) >= 6).length >= 2 },
    { t: 'A link to projects.html',
      f: c => !!$('a[href="projects.html"]', c.doc) },
    { t: 'One link to a page file at most. The links to your teammates’ pages are gone.',
      f: c => $$('a', c.doc).filter(a => /page-\d\.html/.test(a.getAttribute('href') || '')).length <= 1 && !$$('li', c.doc).some(li => /team member/i.test(text(li))) },
    { t: 'The footer has your name in it',
      f: c => { const t = text($('footer', c.doc)); return t.length > 3 && !/the team/i.test(t); } },
    { t: 'The bar at the top has your own colour',
      f: c => { const v = c.css.val('header', 'background-color'); return !!v && v !== 'rgb(34, 34, 34)' && linked(c.src.html); } },
    { t: 'A font that is not Arial', extra: true,
      f: c => { const v = c.css.val('body', 'font-family'); return !!v && !/^\s*arial/i.test(v); } }
  ],
  'teampage': [
    { t: 'The <h1> is the title of your page',
      f: c => { const t = text($('h1', c.doc)); return t.length > 2 && t !== 'Page title'; } },
    { t: 'The <title> in the head has the same title',
      f: c => { const t = text($('head title', c.doc)); return t.length > 2 && !/^Page title/i.test(t); } },
    { t: 'Your text has 20 words or more',
      f: c => { const t = $$('main p', c.doc).map(text).join(' '); return words(t) >= 20 && t.indexOf('Write your first paragraph here') === -1; } },
    { t: 'A picture from the images folder, with alt text of three words or more',
      f: c => $$('img', c.doc).some(i => !!ASSETS[i.getAttribute('src')] && words(i.getAttribute('alt')) >= 3) },
    { t: 'The link to index.html is still there',
      f: c => !!$('a[href="index.html"]', c.doc) },
    { t: 'The footer has your first name',
      f: c => { const t = text($('footer', c.doc)); return t.length > 3 && t.indexOf('your first name') === -1; } }
  ]
};
