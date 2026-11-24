/* =====================================================================
   js/terminal.js
   The pretend terminal in the task "A pretend terminal".
   A small made-up computer: folders and files kept in memory. Nothing on
   the real computer is touched. The jobs are in TERM_JOBS.
   Uses things from: helpers.js, pages.js, saved.js, playground.js, checks.js, quizzes.js, demos.js, tools.js, practice.js
   ===================================================================== */
'use strict';

function freshDisk() {
  return { home: { robin: {
    'notes.txt': 'Buy toner for the replicator.\nAsk the robot to stop hoovering at 3 a.m.',
    projects: { 'my-first-page': {
      'index.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Robin Vale</title>\n</head>\n<body>\n  <h1>Robin Vale</h1>\n</body>\n</html>',
      'style.css': 'body {\n  font-family: Arial, sans-serif;\n}',
      images: { 'desk.jpg': '(a picture of a desk)' } } } } } };
}
const TERM_JOBS = [
  { t: 'Ask where you are.', hint: 'pwd', f: s => s.used.pwd },
  { t: 'List what is in this folder.', hint: 'ls', f: s => s.used.ls },
  { t: 'Go into projects, then into my-first-page.', hint: 'cd projects', f: s => s.cwd.join('/') === 'home/robin/projects/my-first-page' || s.been },
  { t: 'Read index.html without opening an editor.', hint: 'cat index.html', f: s => s.used.cat },
  { t: 'Go up one level.', hint: 'cd ..', f: s => s.used.up },
  { t: 'Make a folder called practice.', hint: 'mkdir practice', f: s => s.used.mkdir },
  { t: 'Make a file with one line of text in it.', hint: 'echo "Hello" > hello.txt', f: s => s.used.write },
  { t: 'Copy a file.', hint: 'cp hello.txt copy.txt', f: s => s.used.cp },
  { t: 'Rename a file.', hint: 'mv copy.txt second.txt', f: s => s.used.mv },
  { t: 'Clear the screen.', hint: 'clear', f: s => s.used.clear }
];

function Term(root) {
  const self = this;
  this.root = root;
  this.screen = h('div', {class: 'term-screen', role: 'log', 'aria-live': 'polite', 'aria-label': 'Terminal output'});
  this.prompt = h('span', {class: 'term-prompt'});
  this.input = h('input', {class: 'term-in', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
    'aria-label': 'Type a command and press Enter'});
  this.jobs = h('ul', {class: 'pg-goals'});
  this.jobEls = TERM_JOBS.map(job => {
    const li = h('li', {}, h('span', {class: 'goal-mark', text: 'Not yet'}), h('span', {}, job.t + ' ', h('code', {class: 'term-hint', text: job.hint})));
    self.jobs.append(li);
    return li;
  });
  this.score = h('p', {class: 'pg-score', role: 'status'});
  const again = h('button', {type: 'button', class: 'btn small', text: 'Start the terminal again'});
  again.addEventListener('click', () => { self.reset(); self.input.focus(); });
  const hints = h('button', {type: 'button', class: 'btn small', 'aria-pressed': 'true', text: 'Hide the commands'});
  hints.addEventListener('click', () => {
    const on = root.classList.toggle('no-hints');
    hints.setAttribute('aria-pressed', on ? 'false' : 'true');
    hints.textContent = on ? 'Show the commands' : 'Hide the commands';
  });
  root.append(
    h('div', {class: 'term-box'}, this.screen, h('label', {class: 'term-line'}, this.prompt, this.input)),
    h('div', {class: 'pg-under'}, h('h4', {text: 'Ten jobs'}), this.jobs, this.score, h('div', {class: 'pg-actions'}, again, hints)));
  this.input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { self.run(self.input.value); self.input.value = ''; }
    else if (e.key === 'ArrowUp' && self.past.length) { e.preventDefault(); self.at = Math.max(0, self.at - 1); self.input.value = self.past[self.at]; }
    else if (e.key === 'ArrowDown') { self.at = Math.min(self.past.length, self.at + 1); self.input.value = self.past[self.at] || ''; }
  });
  root.querySelector('.term-box').addEventListener('click', () => self.input.focus());
  this.reset();
}
Term.prototype.reset = function () {
  this.disk = freshDisk();
  this.state = { cwd: ['home', 'robin'], used: {}, been: false };
  this.past = []; this.at = 0;
  this.screen.textContent = '';
  this.print('A pretend terminal. Type help and press Enter.', 'term-dim');
  this.paint();
};
Term.prototype.print = function (text, cls) {
  this.screen.append(h('div', {class: cls || null, text: text}));
  this.screen.scrollTop = this.screen.scrollHeight;
};
Term.prototype.paint = function () {
  const s = this.state;
  this.prompt.textContent = 'robin@pretend:' + ('/' + s.cwd.join('/')).replace('/home/robin', '~') + '$ ';
  let done = 0;
  TERM_JOBS.forEach((job, i) => {
    const ok = !!job.f(s);
    this.jobEls[i].classList.toggle('is-done', ok);
    this.jobEls[i].firstChild.textContent = ok ? 'Done' : 'Not yet';
    if (ok) done++;
  });
  this.score.textContent = done === TERM_JOBS.length ? 'All ten jobs done. You can use a terminal.' : done + ' of ' + TERM_JOBS.length + ' jobs done';
  this.root.classList.toggle('is-complete', done === TERM_JOBS.length);
};
// Turns "images/../style.css" into a list of folder names, starting from the top of the disk.
Term.prototype.path = function (text) {
  let parts = text.indexOf('/') === 0 ? [] : this.state.cwd.slice();
  if (text === '~' || text.indexOf('~/') === 0) { parts = ['home', 'robin']; text = text.slice(1); }
  text.split('/').forEach(p => {
    if (!p || p === '.') return;
    if (p === '..') parts.pop(); else parts.push(p);
  });
  return parts;
};
Term.prototype.find = function (parts) {
  let node = this.disk;
  for (const p of parts) {
    if (node === null || typeof node !== 'object' || !(p in node)) return undefined;
    node = node[p];
  }
  return node;
};
Term.prototype.run = function (line) {
  const s = this.state, text = line.trim();
  this.print(this.prompt.textContent + text, 'term-cmd');
  if (!text) return;
  this.past.push(text); this.at = this.past.length;
  // echo "some text" > file.txt   is the one command with a special shape
  const echo = text.match(/^echo\s+(.*?)(?:\s*>\s*(\S+))?$/);
  const words = text.split(/\s+/), cmd = words[0], a = words[1], b = words[2];
  const isDir = n => n !== null && typeof n === 'object';
  const fail = msg => this.print(msg, 'term-err');
  if (cmd === 'help') {
    this.print('pwd            where am I?\nls             list this folder\ncd name        go into a folder\ncd ..          go up one level\n' +
      'mkdir name     make a folder\necho "text" > file.txt   make a file with that text\ncat file       show what is in a file\n' +
      'cp a b         copy a to b\nmv a b         rename a to b (or move it)\nclear          clear the screen', 'term-pre');
  } else if (cmd === 'pwd') {
    this.print('/' + s.cwd.join('/')); s.used.pwd = true;
  } else if (cmd === 'ls') {
    const node = this.find(a ? this.path(a) : s.cwd);
    if (node === undefined) fail('ls: there is no ' + a + ' here');
    else if (!isDir(node)) this.print(a);
    else { this.print(Object.keys(node).sort().map(k => isDir(node[k]) ? k + '/' : k).join('   ') || '(empty)'); s.used.ls = true; }
  } else if (cmd === 'cd') {
    const to = this.path(a || '~'), node = this.find(to);
    if (node === undefined) fail('cd: there is no folder called ' + a + ' here. Type ls to see what is here.');
    else if (!isDir(node)) fail('cd: ' + a + ' is a file, not a folder');
    else {
      if (a === '..' || (a || '').indexOf('../') === 0) s.used.up = true;
      s.cwd = to;
      if (to.join('/') === 'home/robin/projects/my-first-page') s.been = true;
    }
  } else if (cmd === 'mkdir') {
    if (!a) fail('mkdir: give the folder a name, for example mkdir practice');
    else {
      const to = this.path(a), parent = this.find(to.slice(0, -1)), name = to[to.length - 1];
      if (!isDir(parent)) fail('mkdir: cannot make ' + a + ' there');
      else if (name in parent) fail('mkdir: ' + name + ' is already here');
      else { parent[name] = {}; s.used.mkdir = true; }
    }
  } else if (echo) {
    const said = echo[1].replace(/^["']|["']$/g, '');
    if (!echo[2]) this.print(said);
    else {
      const to = this.path(echo[2]), parent = this.find(to.slice(0, -1)), name = to[to.length - 1];
      if (!isDir(parent) || isDir(parent[name])) fail('echo: cannot write to ' + echo[2]);
      else { parent[name] = said; s.used.write = true; }
    }
  } else if (cmd === 'cat') {
    const node = a ? this.find(this.path(a)) : undefined;
    if (!a) fail('cat: which file? For example cat notes.txt');
    else if (node === undefined) fail('cat: there is no ' + a + ' here');
    else if (isDir(node)) fail('cat: ' + a + ' is a folder. Use ls ' + a);
    else { this.print(node, 'term-pre'); s.used.cat = true; }
  } else if (cmd === 'cp' || cmd === 'mv') {
    const from = a ? this.path(a) : null, node = from ? this.find(from) : undefined;
    if (!a || !b) fail(cmd + ': two names are needed, for example ' + cmd + ' old.txt new.txt');
    else if (node === undefined) fail(cmd + ': there is no ' + a + ' here');
    else if (isDir(node) && cmd === 'cp') fail('cp: ' + a + ' is a folder. This pretend terminal copies files only.');
    else {
      let to = this.path(b);
      if (isDir(this.find(to))) to = to.concat(from[from.length - 1]);        // "mv file folder" puts the file inside
      const parent = this.find(to.slice(0, -1));
      if (!isDir(parent)) fail(cmd + ': cannot put it at ' + b);
      else {
        parent[to[to.length - 1]] = node;
        if (cmd === 'mv') delete this.find(from.slice(0, -1))[from[from.length - 1]];
        s.used[cmd] = true;
      }
    }
  } else if (cmd === 'clear') {
    this.screen.textContent = ''; s.used.clear = true;
  } else if (cmd === 'rm' || cmd === 'rmdir') {
    fail(cmd + ' deletes things for ever, with no bin. This pretend terminal does not have it. A real one does. Be careful there.');
  } else {
    fail(cmd + ': command not found. Type help to see the ten commands.');
  }
  this.paint();
};
function initTerminals() {
  $$('[data-term]').forEach(root => new Term(root));
}
