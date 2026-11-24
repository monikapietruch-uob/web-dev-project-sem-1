/* =====================================================================
   js/demos.js
   Moving sketches: the steps (DEMOS) and the code that plays them.
   Each step:  scr = screen to show     hot = thing the pointer visits
               say = the sentence       who = the person who is clicking
               put = text to write      on = things to switch on
               move = a card to move to another column
   Uses things from: helpers.js, pages.js, saved.js, playground.js, checks.js, quizzes.js
   ===================================================================== */
'use strict';

const DEMOS = {
  'edit-file': [
    { scr: 'file',   hot: 'pencil', say: 'Open the file. Click the pencil.' },
    { scr: 'edit',   hot: 'line',   say: 'Change the text.', put: { line: '<li>Amara</li>' } },
    { scr: 'edit',   hot: 'commit', say: 'Click “Commit changes…”.' },
    { scr: 'dialog', hot: 'msg',    say: 'Write a short message that says what you changed.', put: { msg: 'Add Amara to the team list' } },
    { scr: 'dialog', hot: 'ok',     say: 'Click “Commit changes”.' },
    { scr: 'done',   hot: 'last',   say: 'Saved. Your name and your message are in the history.' }
  ],
  'upload-image': [
    { scr: 'list', hot: 'add',    say: 'Open the images folder. Click “Add file”.' },
    { scr: 'menu', hot: 'upload', say: 'Choose “Upload files”.' },
    { scr: 'drop', hot: 'drop',   say: 'Drag your picture into the box.', put: { drop: 'library.jpg is ready' } },
    { scr: 'drop', hot: 'msg',    say: 'Write a commit message.', put: { msg: 'Add photo of the library' } },
    { scr: 'drop', hot: 'ok',     say: 'Click “Commit changes”. In the team repository GitHub starts a pull request first.' },
    { scr: 'done', hot: 'new',    say: 'The picture is in the folder. Its address is images/library.jpg.' }
  ],
  'new-issue': [
    { scr: 'list', hot: 'new',    say: 'Open the Issues tab. Click “New issue”.', who: 'Sana' },
    { scr: 'form', hot: 'title',  say: 'Write a title that starts with a verb.', put: { title: 'Build page: Where we pretend to study' } },
    { scr: 'form', hot: 'desc',   say: 'Describe the job. Say what “done” means.', put: { desc: 'Goal: show the library, honestly. Done means: 5 sentences, 1 picture, alt text.' } },
    { scr: 'form', hot: 'assign', say: 'Under Assignees, choose yourself.', put: { assign: 'sana' } },
    { scr: 'form', hot: 'proj',   say: 'Under Projects, choose the team board.', put: { proj: 'Class of 2026 board' } },
    { scr: 'form', hot: 'create', say: 'Click “Create”.' },
    { scr: 'open', hot: 'status', say: 'The issue has a number, an owner and a card on the board.' }
  ],
  'board': [
    { scr: 'board', hot: 'card',  say: 'Find your card in Todo.', who: 'Sana' },
    { scr: 'board', hot: 'card',  say: 'When you start work, drag it to In Progress.', move: { card: 'doing' } },
    { scr: 'board', hot: 'doing', say: 'Now the whole team can see what you are doing. Nobody has to ask.' },
    { scr: 'board', hot: 'card',  say: 'When your pull request is merged, the card goes to Done.', move: { card: 'finished' } }
  ],
  'pull-request': [
    { scr: 'dialog', hot: 'msg',     say: 'The author edits a file and writes a commit message.', who: 'Sana, the author', put: { msg: 'Add first sentence to the library page' } },
    { scr: 'dialog', hot: 'radio',   say: 'Main is protected, so GitHub makes a new branch.' },
    { scr: 'dialog', hot: 'propose', say: 'Click “Propose changes”.' },
    { scr: 'open',   hot: 'desc',    say: 'Write “Closes #3” to connect the pull request to your issue.', put: { desc: 'Closes #3' } },
    { scr: 'open',   hot: 'create',  say: 'Click “Create pull request”. Ask a teammate to review it.' },
    { scr: 'review', hot: 'rev',     say: 'The reviewer opens “Files changed” and reads the green lines.', who: 'Leo, the reviewer' },
    { scr: 'review', hot: 'approve', say: 'Click “Review changes”, write one comment and choose “Approve”.', on: ['approve'], put: { comment: 'Looks good to me. Nice first sentence.' } },
    { scr: 'review', hot: 'submit',  say: 'Click “Submit review”.' },
    { scr: 'merge',  hot: 'merge',   say: 'Now the button is green. Click “Merge pull request”, then “Confirm merge”.', who: 'Sana or Leo' },
    { scr: 'merged', hot: 'delete',  say: 'Merged. Delete the branch. The issue closes by itself.' }
  ],
  'notion-views': [
    { scr: 'table',   hot: 'row',     say: 'This is a database. Every row is one channel.' },
    { scr: 'table',   hot: 'plus1',   say: 'Click + next to the name of the view.' },
    { scr: 'menu',    hot: 'gallery', say: 'Choose Gallery. Name the view “Cards”.' },
    { scr: 'gallery', hot: 'tabg',    say: 'The same four channels, now as cards.', put: { tab2: 'Cards' } },
    { scr: 'gallery', hot: 'plus2',   say: 'Click + again.' },
    { scr: 'menu',    hot: 'board',   say: 'Choose Board. Group it by Topic.' },
    { scr: 'board',   hot: 'tabb',    say: 'The same channels again, with one column for each topic.' },
    { scr: 'board',   hot: 'card',    say: 'Click one card to open it.' },
    { scr: 'page',    hot: 'shot',    say: 'Every row is also a page. Paste a screenshot or write a note.' }
  ],
  'notion-copy': [
    { scr: 'public', hot: 'dup',     say: 'Open the link from your tutor. Log in to Notion. Then click “Duplicate”.', who: 'Robin' },
    { scr: 'choose', hot: 'ws',      say: 'Choose your own workspace.', on: ['ws'] },
    { scr: 'mine',   hot: 'where',   say: 'The copy is under Private in the list on the left. It is yours now.' },
    { scr: 'mine',   hot: 'title',   say: 'Put your name in the title.', put: { title: 'Robin’s study hub', crumb: 'Robin’s study hub' } },
    { scr: 'res',    hot: 'tabnext', say: 'Open Resources. The tab “To try next” shows free things that you have not started.' },
    { scr: 'res',    hot: 'status',  say: 'Choose one. Change its status to “Trying”.', put: { status: 'Trying' } },
    { scr: 'plan',   hot: 'card',    say: 'Go back to the first page. Scroll down to the board. Drag one card from To do to Doing.', move: { card: 'doing' } }
  ],
  'vscode-tour': [
    { scr: 'win', hot: 'side',     say: 'The Explorer lists the files and folders of your project.' },
    { scr: 'win', hot: 'f-index',  say: 'Click a file to open it.' },
    { scr: 'win', hot: 'tab',      say: 'Every open file has a tab, like a page in a browser.' },
    { scr: 'win', hot: 'code',     say: 'The editor colours your code. Tags, attributes and text each get a colour.' },
    { scr: 'win', hot: 'a-search', say: 'Search looks through all your files at once.' },
    { scr: 'win', hot: 'a-scm',    say: 'Source Control is where you commit. The number says how many files you changed.', on: ['badge'], put: { badge: '1' } },
    { scr: 'win', hot: 'status',   say: 'The Status Bar shows the branch, the line you are on and the language.' },
    { scr: 'pal', hot: 'pal-in',   say: 'The Command Palette finds any command. F1 opens it.', put: { 'pal-in': '>theme' } }
  ],
  'github-dev': [
    { scr: 'repo', hot: 'key',     say: 'Open your repository on GitHub. Press the full stop key.', who: 'Robin' },
    { scr: 'ed',   hot: 'f-index', say: 'The same files, now in an editor. Click index.html.' },
    { scr: 'ed',   hot: 'line',    say: 'Change the line under your name.', put: { line: '<p>Student, future engineer.</p>' } },
    { scr: 'ed',   hot: 'a-scm',   say: 'Source Control shows a 1: one changed file. Click the icon.', on: ['badge'] },
    { scr: 'scm',  hot: 'plus',    say: 'Click the + beside the file. This is called staging.' },
    { scr: 'scm',  hot: 'msg',     say: 'Write a commit message.', put: { msg: 'Update line under my name' } },
    { scr: 'scm',  hot: 'push',    say: 'Click “Commit & Push”.' },
    { scr: 'done', hot: 'last',    say: 'Back on GitHub, your commit is in the history. The live page follows a minute later.' }
  ],
  'vscode-push': [
    { scr: 'ed',   hot: 'line',    say: 'Change a line and save the file.', who: 'Robin', put: { line: '<p>Student, future engineer.</p>' } },
    { scr: 'ed',   hot: 'f-index', say: 'An M appears beside the file: modified. Saved is not committed.', put: { 'm-mark': 'M' } },
    { scr: 'ed',   hot: 'a-scm',   say: 'The Source Control icon shows a 1. Click it.', on: ['badge'] },
    { scr: 'scm1', hot: 'plus',    say: 'Move the mouse over the file and click +. The file is staged: it goes into the next commit.' },
    { scr: 'scm2', hot: 'msg',     say: 'Type a message that says what you changed.', put: { msg: 'Update my line' } },
    { scr: 'scm2', hot: 'commit',  say: 'Click Commit. The commit is in the history on your computer. GitHub has not seen it.' },
    { scr: 'scm3', hot: 'sync',    say: 'The button now says Sync Changes, with a 1 and an up arrow: one commit is waiting to go up. Click it.' },
    { scr: 'ask',  hot: 'allow',   say: 'The first time, VS Code asks to sign in to GitHub. Say yes, finish in the browser and come back.' },
    { scr: 'ok',   hot: 'st',      say: 'No numbers are waiting beside the arrows in the Status Bar. GitHub has everything.' }
  ],
  'conflict': [
    { scr: 'pr',    hot: 'resolve', say: 'Leo and Sana each added a name in the same place. GitHub cannot choose. Click “Resolve conflicts”.', who: 'Leo' },
    { scr: 'edit',  hot: 'm1',      say: 'GitHub shows both versions. Under the row of < signs is the line from your branch.' },
    { scr: 'edit',  hot: 'm2',      say: 'The row of = signs is the wall between the two versions.' },
    { scr: 'edit',  hot: 'm3',      say: 'Above the row of > signs is the line that is on main now.' },
    { scr: 'fixed', hot: 'code',    say: 'Decide what the file should say. Here both names stay. Delete the three marker lines.' },
    { scr: 'fixed', hot: 'mark',    say: 'Click “Mark as resolved”.' },
    { scr: 'fixed', hot: 'commit',  say: 'Then click “Commit merge”.' },
    { scr: 'ok',    hot: 'merge',   say: 'The conflict is gone. A teammate approves, and you merge as usual.' }
  ],
  'page-journey': [
    { scr: 'net', hot: 'you',  say: 'You type an address and press Enter.' },
    { scr: 'net', hot: 'q1',   say: 'Computers find each other by number. The browser asks DNS which number belongs to this name.', on: ['q1'] },
    { scr: 'net', hot: 'a1',   say: 'DNS answers with the number. This one is only an example.', on: ['a1'] },
    { scr: 'net', hot: 'q2',   say: 'The browser sends a request to that computer. It is called a server.', on: ['q2'] },
    { scr: 'net', hot: 'a2',   say: 'The server answers with a status code and the file. 200 means OK.', on: ['a2'] },
    { scr: 'net', hot: 'q3',   say: 'The browser reads the HTML. It finds a style sheet and a picture, and asks for them too.', on: ['q3'] },
    { scr: 'net', hot: 'a3',   say: 'The server sends them.', on: ['a3'] },
    { scr: 'net', hot: 'page', say: 'The browser puts everything together and draws the page. All of this took less than a second.', on: ['page'] }
  ],
  'new-repo': [
    { scr: 'home', hot: 'plus',   say: 'On any page of GitHub, click the + at the top right.' },
    { scr: 'menu', hot: 'new',    say: 'Choose “New repository”.' },
    { scr: 'form', hot: 'name',   say: 'Type the name: my-first-page.', put: { name: 'my-first-page' } },
    { scr: 'form', hot: 'public', say: 'Choose “Public”, so that everyone can see your page.', on: ['public'] },
    { scr: 'form', hot: 'readme', say: 'Turn on “Add a README file”.', put: { readme: 'On' }, on: ['readme'] },
    { scr: 'form', hot: 'create', say: 'Click “Create repository”.' },
    { scr: 'done', hot: 'repo',   say: 'This is your repository. It has one file in it: README.md.' }
  ],
  'new-file': [
    { scr: 'repo',   hot: 'add',    say: 'In your repository, click “Add file”.' },
    { scr: 'menu',   hot: 'create', say: 'Choose “Create new file”.' },
    { scr: 'edit',   hot: 'name',   say: 'Type the name of the file: index.html. Small letters only.', put: { name: 'index.html' } },
    { scr: 'edit',   hot: 'box',    say: 'Click in the big box and paste your page.', put: { box: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <title>Robin Vale | Portfolio</title>\n  …' } },
    { scr: 'edit',   hot: 'commit', say: 'Click “Commit changes…”.' },
    { scr: 'dialog', hot: 'msg',    say: 'Write the message: Add my first page.', put: { msg: 'Add my first page' } },
    { scr: 'dialog', hot: 'ok',     say: 'Click “Commit changes”.' },
    { scr: 'done',   hot: 'new',    say: 'index.html is in your repository. Do the same for style.css.' }
  ]
};

const calm = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
  document.documentElement.dataset.motion === 'less';
const DEMO_LIST = [];

function Demo(root) {
  this.root = root;
  this.steps = DEMOS[root.dataset.demo] || [];
  this.tpl = $('template[data-screens="' + root.dataset.demo + '"]');
  this.i = 0; this.timer = null; this.built = false; this.userPaused = calm;
  DEMO_LIST.push(this);
}
Demo.prototype.find = function (key) { return $('[data-k="' + key + '"]', this.body); };
Demo.prototype.build = function () {
  const self = this;
  this.body = h('div', {class: 'mk-body'});
  this.who = h('span', {class: 'mk-who'});
  this.cursor = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  this.cursor.setAttribute('class', 'mk-cursor');
  this.cursor.setAttribute('viewBox', '0 0 24 24');
  this.cursor.setAttribute('aria-hidden', 'true');
  const tip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  tip.setAttribute('d', 'M4 2l15 9-7 1.5L8.5 20z');
  tip.setAttribute('fill', '#14213d'); tip.setAttribute('stroke', '#fff'); tip.setAttribute('stroke-width', '1.5');
  tip.setAttribute('stroke-linejoin', 'round');
  this.cursor.append(tip);
  this.stage = h('div', {class: 'demo-stage'},
    h('div', {class: 'mk-win'},
      h('div', {class: 'mk-top'}, h('span', {class: 'mk-dots'}, h('i'), h('i'), h('i')),
        h('span', {class: 'mk-url', text: this.tpl.dataset.url}), this.who),
      this.body),
    this.cursor);
  this.list = h('ol', {class: 'demo-steps'});
  this.steps.forEach(s => self.list.append(h('li', {text: s.say})));
  this.count = h('span', {class: 'demo-count', role: 'status'});
  this.playBtn = h('button', {type: 'button', class: 'btn small', text: 'Play'});
  const back = h('button', {type: 'button', class: 'btn small', text: 'Back'});
  const next = h('button', {type: 'button', class: 'btn small', text: 'Next'});
  back.addEventListener('click', () => { self.userPaused = true; self.halt(); self.go(self.i - 1); });
  next.addEventListener('click', () => { self.userPaused = true; self.halt(); self.go(self.i + 1); });
  this.playBtn.addEventListener('click', () => {
    if (self.timer) { self.userPaused = true; self.halt(); } else { self.userPaused = false; self.play(); }
  });
  this.root.append(this.stage,
    h('div', {class: 'demo-side'},
      h('h4', {text: this.root.dataset.title}),
      h('p', {class: 'demo-note', text: 'A simplified sketch. The real screen has more on it.'}),
      this.list,
      h('div', {class: 'demo-ctrl'}, back, this.playBtn, next, this.count)));
  this.built = true;
  this.go(0);
};
Demo.prototype.go = function (i) {
  const n = this.steps.length;
  this.i = (i + n) % n;
  this.body.replaceChildren(this.tpl.content.cloneNode(true));
  let who = '';
  for (let k = 0; k <= this.i; k++) {       // replay every step up to this one
    const s = this.steps[k];
    if (s.who) who = s.who;
    Object.keys(s.put || {}).forEach(key => { const el = this.find(key); if (el) el.textContent = s.put[key]; });
    (s.on || []).forEach(key => { const el = this.find(key); if (el) el.classList.add('is-on'); });
    Object.keys(s.move || {}).forEach(key => { const el = this.find(key), to = this.find(s.move[key]); if (el && to) to.append(el); });
  }
  const step = this.steps[this.i];
  $$('[data-scr]', this.body).forEach(scr => { scr.hidden = scr.dataset.scr !== step.scr; });
  this.who.textContent = who;
  const hot = this.find(step.hot);
  if (hot) {
    hot.classList.add('is-hot');
    const a = this.stage.getBoundingClientRect(), b = hot.getBoundingClientRect();
    const x = b.left - a.left + Math.min(b.width / 2, b.width - 12), y = b.top - a.top + b.height * 0.55;
    this.cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }
  $$('li', this.list).forEach((li, k) => {
    if (k === this.i) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
  });
  this.count.textContent = 'Step ' + (this.i + 1) + ' of ' + n;
};
Demo.prototype.play = function () {
  if (this.timer) return;
  this.timer = setInterval(() => this.go(this.i + 1), 3200);
  this.playBtn.textContent = 'Pause';
};
Demo.prototype.halt = function () {
  clearInterval(this.timer); this.timer = null;
  if (this.playBtn) this.playBtn.textContent = 'Play';
};

function initDemos() {
  $$('.demo').forEach(root => new Demo(root));
  // A sketch plays only while it is on the screen.
  const watch = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const demo = DEMO_LIST.find(d => d.root === entry.target);
      if (entry.isIntersecting) {
        if (!demo.built) demo.build(); else demo.go(demo.i);
        if (!demo.userPaused) demo.play();
      } else if (demo.built) {
        demo.halt();
      }
    });
  }, {threshold: 0.25});
  DEMO_LIST.forEach(d => watch.observe(d.root));
  window.addEventListener('resize', () => DEMO_LIST.forEach(d => { if (d.built && d.root.offsetParent) d.go(d.i); }));
}
