/* =====================================================================
   js/playground.js
   Playgrounds: the editor with the result beside it.
   Uses things from: helpers.js, pages.js, saved.js
   ===================================================================== */
'use strict';

// Pictures that work inside playgrounds. They are drawn here, so no files are needed.
const ASSETS = {};
(function drawPictures() {
  const uri = inner => 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300">' + inner + '</svg>');
  const colours = ['#b8400f', '#1857c9', '#2a7230', '#a1286e', '#14213d', '#7d6000', '#00727a'];
  let books = '<rect width="480" height="300" fill="#efe6d3"/>';
  for (let row = 0; row < 3; row++) {
    let x = 20, i = row * 3;
    while (x < 440) {
      const w = 14 + ((i * 7) % 5) * 5, tall = 62 + ((i * 11) % 4) * 6;
      books += '<rect x="' + x + '" y="' + (106 + row * 95 - tall) + '" width="' + w + '" height="' + tall + '" fill="' + colours[i % colours.length] + '"/>';
      x += w + 3; i++;
    }
    books += '<rect x="10" y="' + (106 + row * 95) + '" width="460" height="8" fill="#6b4a2b"/>';
  }
  ASSETS['images/library.jpg'] = uri(books);
  let campus = '<rect width="480" height="300" fill="#cfe6f5"/><rect y="230" width="480" height="70" fill="#7fae6a"/>' +
    '<rect x="90" y="70" width="300" height="170" fill="#c9ccd6"/><rect x="210" y="180" width="60" height="60" fill="#14213d"/>';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
    campus += '<rect x="' + (110 + c * 46) + '" y="' + (88 + r * 30) + '" width="30" height="18" fill="#f4f5f9"/>';
  }
  ASSETS['images/campus.jpg'] = uri(campus);
  ASSETS['images/robot.jpg'] = uri('<rect width="480" height="300" fill="#e9ecf3"/>' +
    '<rect x="170" y="80" width="140" height="110" rx="18" fill="#00727a"/>' +
    '<circle cx="210" cy="125" r="14" fill="#fff"/><circle cx="270" cy="125" r="14" fill="#fff"/>' +
    '<circle cx="210" cy="125" r="6" fill="#14213d"/><circle cx="270" cy="125" r="6" fill="#14213d"/>' +
    '<rect x="215" y="155" width="50" height="8" rx="4" fill="#fff"/>' +
    '<rect x="236" y="50" width="8" height="30" fill="#14213d"/><circle cx="240" cy="46" r="9" fill="#c8102e"/>' +
    '<rect x="190" y="200" width="100" height="70" rx="10" fill="#4a5672"/>');
})();

const PGS = [];
let FALLBACK = false;          // true = draw the result without an iframe
let frameSeen = false, frameTimer = null;
const COMMENT = new RegExp('<' + '!--[\\s\\S]*?--' + '>', 'g');
const linked = html => /<link\b[^>]*stylesheet/i.test(html) && /<link\b[^>]*href\s*=\s*["']?[^"'>\s]+\.css/i.test(html);

// Reads the student's CSS the way a browser does, so goals can ask questions about it.
function parseCss(source) {
  const rules = [];
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(source || '');
    Array.from(sheet.cssRules).forEach(rule => {
      if (!rule.selectorText) return;
      rule.selectorText.split(',').forEach(s => rules.push({ sel: s.trim().replace(/\s+/g, ' ').toLowerCase(), style: rule.style }));
    });
  } catch (e) { /* very old browser: goals about CSS stay "Not yet" */ }
  const val = (sel, prop) => {
    let found = '';
    rules.forEach(r => { if (r.sel === sel) { const v = r.style.getPropertyValue(prop); if (v) found = v; } });
    return found;
  };
  return { val, has: (sel, prop) => !!val(sel, prop) };
}

// Builds the page that goes into the result window.
function composeDoc(code, runsScripts) {
  let html = code.html || '';
  const css = (code.css || '').replace(/<\/style/gi, '<\\/style');
  html = html.replace(/(src\s*=\s*")([^"]+)(")/gi, (all, a, path, b) => ASSETS[path] ? a + ASSETS[path] + b : all);
  const extra = '<base target="_blank">' + (runsScripts ? REPORTER : '');
  const style = '<style>' + css + '</style>';
  if (/<html[\s>]/i.test(html)) {
    // A whole page. The CSS only works when the page has its <link> line, as on a real site.
    html = html.replace(/<link\b[^>]*stylesheet[^>]*>/gi, tag => /href\s*=\s*["']?[^"'>\s]+\.css/i.test(tag) ? style : '');
    return /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, tag => tag + extra) : extra + html;
  }
  return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' + extra + style + '</head><body>' + html + '</body></html>';
}

// A few lines that run inside the result window of a JavaScript task.
// They tell this page about clicks and about errors.
const REPORTER = '<script>(function(){var send=function(t,d){parent.postMessage({p2p:t,data:d},"*")};' +
  'window.addEventListener("error",function(e){send("error",(e.message||"Error")+(e.lineno?" (line "+e.lineno+")":""))});' +
  'window.addEventListener("load",function(){send("ready",document.body?document.body.innerText:"")});' +
  'document.addEventListener("click",function(e){var b=e.target&&e.target.closest?e.target.closest("button"):null;' +
  'if(b){setTimeout(function(){send("click",document.body.innerText)},40)}})})();<\/script>';

// Second way to draw the result, for browsers that block the iframe.
function renderShadow(box, code) {
  const host = h('div', {class: 'pg-shadow'});
  box.replaceChildren(host);
  const root = host.attachShadow({mode: 'open'});
  const doc = new DOMParser().parseFromString(code.html || '', 'text/html');
  $$('script, iframe, object, embed, link, meta, base, style', doc).forEach(n => n.remove());
  $$('*', doc).forEach(n => Array.from(n.attributes).forEach(a => { if (/^on/i.test(a.name)) n.removeAttribute(a.name); }));
  $$('img', doc).forEach(i => { const p = i.getAttribute('src'); if (ASSETS[p]) i.setAttribute('src', ASSETS[p]); });
  let css = '';
  if (!/<html[\s>]/i.test(code.html || '') || linked(code.html || '')) {
    css = (code.css || '').replace(/(^|[\s,}])(html|body)(?=\s*[{,:.])/g, '$1.pv-body');
  }
  const style = document.createElement('style');
  style.textContent = ':host{all:initial;display:block}.pv-body{display:block;margin:8px;font:16px "Times New Roman",serif;color:#000}' + css;
  const body = h('div', {class: 'pv-body'});
  while (doc.body.firstChild) body.appendChild(doc.body.firstChild);
  root.append(style, body);
  root.addEventListener('click', e => { if (e.target.closest && e.target.closest('a')) e.preventDefault(); });
}

function useFallback() {
  if (FALLBACK) return;
  FALLBACK = true;
  PGS.forEach(pg => { if (pg.built) pg.render(); });
}
document.addEventListener('securitypolicyviolation', e => {
  if (/frame|child/.test(e.violatedDirective || '')) useFallback();
});

// A gentle warning about tags and brackets that do not match.
const PAIRS = ['html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'a', 'section', 'header', 'main',
  'footer', 'nav', 'div', 'button', 'strong', 'em', 'figure', 'figcaption', 'script', 'style'];
function matchHint(code) {
  const html = (code.html || '').replace(COMMENT, '');
  for (const tag of PAIRS) {
    const open = (html.match(new RegExp('<' + tag + '(\\s[^>]*)?>', 'gi')) || []).length;
    const close = (html.match(new RegExp('</' + tag + '\\s*>', 'gi')) || []).length;
    if (open > close) return 'Check your code: a closing </' + tag + '> tag is missing.';
    if (close > open) return 'Check your code: there is a closing </' + tag + '> with no opening <' + tag + '>.';
  }
  const css = code.css || '';
  if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) return 'Check your CSS: the { and } do not match.';
  return '';
}

function Pg(root) {
  this.root = root;
  this.n = PGS.length;
  this.id = root.dataset.pg;
  this.goalsName = root.dataset.goals || this.id;
  this.langs = (root.dataset.tabs || 'html').split(',');
  this.mode = root.dataset.mode || 'live';
  const names = (root.dataset.files || '').split(',');
  this.files = {};
  this.langs.forEach((lang, i) => { this.files[lang] = names[i] || (lang === 'css' ? 'style.css' : 'index.html'); });
  this.start = {}; this.answer = {};
  $$('.pg-src', root).forEach(t => { this.start[t.dataset.lang] = t.value.replace(/\n$/, ''); });
  $$('.pg-ans', root).forEach(t => { this.answer[t.dataset.lang] = t.value.replace(/\n$/, ''); });
  this.built = false;
  this.current = this.langs[0];
  this.run = { clicked: false, changed: false, base: null };
  PGS.push(this);
}

Pg.prototype.saved = function (lang) {
  const s = store.get('pg:' + this.id + ':' + lang);
  return s !== null ? s : (this.start[lang] || '');
};

Pg.prototype.code = function () {
  const out = {};
  ['html', 'css'].forEach(lang => {
    out[lang] = this.built && this.areas[lang] ? this.areas[lang].value : this.saved(lang);
  });
  return out;
};

Pg.prototype.open = function () {
  if (!this.built) this.build();
  this.langs.forEach(lang => { this.areas[lang].value = this.saved(lang); this.lines(lang); });
  this.render();
};

Pg.prototype.lines = function (lang) {
  const count = this.areas[lang].value.split('\n').length;
  let text = '';
  for (let i = 1; i <= count; i++) text += i + '\n';
  this.gutters[lang].textContent = text;
};

Pg.prototype.pick = function (lang) {
  this.current = lang;
  this.langs.forEach(l => {
    this.panes[l].hidden = l !== lang;
    this.tabEls[l].setAttribute('aria-selected', l === lang ? 'true' : 'false');
  });
};

Pg.prototype.build = function () {
  const self = this, root = this.root;
  root.textContent = '';
  this.areas = {}; this.panes = {}; this.tabEls = {}; this.gutters = {};

  // left side: the editor
  const tabs = h('div', {class: 'pg-tabs', role: 'tablist', 'aria-label': 'Files'});
  const edit = h('div', {class: 'pg-edit'}, tabs);
  this.langs.forEach((lang, i) => {
    const pid = 'pg' + self.n + '-' + lang;
    const tab = h('button', {type: 'button', class: 'pg-tab', role: 'tab', id: pid + '-tab', 'aria-controls': pid,
      'aria-selected': i === 0 ? 'true' : 'false', text: self.files[lang]});
    tab.addEventListener('click', () => self.pick(lang));
    const gutter = h('pre', {class: 'pg-gutter', 'aria-hidden': 'true'});
    const area = h('textarea', {class: 'pg-area', id: pid + '-code', spellcheck: 'false', autocapitalize: 'off',
      autocomplete: 'off', wrap: 'off',
      'aria-label': 'Code for ' + self.files[lang] + '. To leave the editor, press Escape and then Tab.'});
    area.addEventListener('input', () => {
      store.set('pg:' + self.id + ':' + lang, area.value);
      self.lines(lang);
      clearTimeout(self.wait);
      self.wait = setTimeout(() => { if (self.mode === 'live') self.render(); else self.check(); }, 300);
    });
    area.addEventListener('scroll', () => { gutter.scrollTop = area.scrollTop; });
    area.addEventListener('keydown', e => {
      if (e.key === 'Escape') { self.leaving = true; return; }
      if (e.key === 'Tab' && !self.leaving && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        area.setRangeText('  ', area.selectionStart, area.selectionEnd, 'end');
        area.dispatchEvent(new Event('input'));
      }
      if (e.key !== 'Shift') self.leaving = false;
    });
    const pane = h('div', {class: 'pg-pane', id: pid, role: 'tabpanel', 'aria-labelledby': pid + '-tab', hidden: i !== 0}, gutter, area);
    tabs.append(tab); edit.append(pane);
    self.areas[lang] = area; self.panes[lang] = pane; self.tabEls[lang] = tab; self.gutters[lang] = gutter;
  });
  this.hint = h('p', {class: 'pg-hint', role: 'status'});
  edit.append(this.hint);

  // right side: the result
  this.frameBox = h('div', {class: 'pg-frame'});
  this.console = h('p', {class: 'pg-console', role: 'status', hidden: true});
  const bar = h('div', {class: 'pg-outbar'}, h('span', {text: 'Result'}));
  if (this.mode === 'run') {
    const runBtn = h('button', {type: 'button', class: 'btn small primary', text: 'Run'});
    runBtn.addEventListener('click', () => self.render());
    bar.append(runBtn);
  } else {
    bar.append(h('small', {text: 'Links are switched off here'}));
  }
  const out = h('div', {class: 'pg-out'}, bar, this.frameBox, this.console);

  // under both: goals and buttons
  this.goalEls = [];
  const goals = h('ul', {class: 'pg-goals'});
  (CHECKS[this.goalsName] || []).forEach(goal => {
    const li = h('li', {}, h('span', {class: 'goal-mark', text: 'Not yet'}), h('span', {text: goal.t}));
    goals.append(li); self.goalEls.push(li);
  });
  this.score = h('p', {class: 'pg-score', role: 'status'});

  const reset = h('button', {type: 'button', class: 'btn small', text: 'Start this file again'});
  reset.addEventListener('click', () => {
    if (reset.dataset.sure !== '1') {
      reset.dataset.sure = '1';
      reset.textContent = 'Click again to delete your code in this file';
      setTimeout(() => { reset.dataset.sure = ''; reset.textContent = 'Start this file again'; }, 3500);
      return;
    }
    reset.dataset.sure = ''; reset.textContent = 'Start this file again';
    store.remove('pg:' + self.id + ':' + self.current);
    self.open();
  });

  const answerBox = h('div', {class: 'pg-answer', hidden: true});
  Object.keys(this.answer).forEach(lang => {
    answerBox.append(h('h5', {text: self.files[lang] || lang}), h('pre', {class: 'code'}, h('code', {text: self.answer[lang]})));
  });
  const answerBtn = h('button', {type: 'button', class: 'btn small', 'aria-expanded': 'false', text: 'Show a model answer'});
  answerBtn.addEventListener('click', () => {
    answerBox.hidden = !answerBox.hidden;
    answerBtn.setAttribute('aria-expanded', answerBox.hidden ? 'false' : 'true');
    answerBtn.textContent = answerBox.hidden ? 'Show a model answer' : 'Hide the model answer';
  });
  const swap = h('button', {type: 'button', class: 'pg-switch', text: 'Result empty? Switch the preview'});
  swap.addEventListener('click', () => { FALLBACK = !FALLBACK; PGS.forEach(pg => { if (pg.built) pg.render(); }); });

  root.append(
    h('div', {class: 'pg-grid'}, edit, out),
    h('div', {class: 'pg-under'}, h('h4', {text: 'Goals'}), goals, this.score,
      h('div', {class: 'pg-actions'}, reset, Object.keys(this.answer).length ? answerBtn : null, swap),
      answerBox));
  this.built = true;
};

Pg.prototype.render = function () {
  const code = this.code(), runs = this.mode === 'run';
  this.console.hidden = true;
  this.run = { clicked: false, changed: false, base: null };
  if (FALLBACK) {
    renderShadow(this.frameBox, code);
    this.frame = null;
    if (runs) {
      this.console.textContent = 'This preview cannot run JavaScript. Your button will work on your live page.';
      this.console.hidden = false;
    }
  } else {
    const frame = h('iframe', {title: 'Result of your code', sandbox: runs ? 'allow-scripts' : ''});
    frame.addEventListener('load', () => { frameSeen = true; });
    frame.srcdoc = composeDoc(code, runs);
    this.frameBox.replaceChildren(frame);
    this.frame = frame;
    if (!frameSeen && !frameTimer) frameTimer = setTimeout(() => { if (!frameSeen) useFallback(); }, 3000);
  }
  this.check();
};

Pg.prototype.check = function () {
  const code = this.code();
  const c = {
    src: code,
    doc: new DOMParser().parseFromString(code.html || '', 'text/html'),
    css: parseCss(code.css),
    run: this.run
  };
  let need = 0, done = 0;
  (CHECKS[this.goalsName] || []).forEach((goal, i) => {
    let ok = false;
    try { ok = !!goal.f(c); } catch (e) { ok = false; }
    const li = this.goalEls[i];
    li.classList.toggle('is-done', ok);
    li.firstChild.textContent = ok ? 'Done' : (goal.extra ? 'Extra' : 'Not yet');
    if (!goal.extra) { need++; if (ok) done++; }
  });
  this.score.textContent = done === need ? 'All goals done. Nice work.' : done + ' of ' + need + ' goals done';
  this.root.classList.toggle('is-complete', done === need);
  this.hint.textContent = matchHint(code);
};

// Messages from the result window of a JavaScript task.
window.addEventListener('message', e => {
  const d = e.data;
  if (!d || typeof d.p2p !== 'string') return;
  const pg = PGS.find(p => p.frame && p.frame.contentWindow === e.source);
  if (!pg) return;
  if (d.p2p === 'ready') pg.run.base = String(d.data);
  if (d.p2p === 'click') { pg.run.clicked = true; pg.run.changed = pg.run.base !== null && String(d.data) !== pg.run.base; }
  if (d.p2p === 'error') { pg.console.textContent = 'The browser says: ' + String(d.data); pg.console.hidden = false; }
  pg.check();
});

function savedCode(id, lang) {
  const pg = PGS.find(p => p.id === id && lang in p.start) || PGS.find(p => p.id === id);
  return pg ? pg.saved(lang) : '';
}
