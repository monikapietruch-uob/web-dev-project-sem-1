/* =====================================================================
   js/pages.js
   Pages, tasks and progress: the names of the tracks and stages, the
   link to the Notion template, the headings of tasks, the lists,
   the progress bars, the course map, and showing one page at a time.
   Uses things from: helpers.js
   ===================================================================== */
'use strict';

const TRACKS = { solo: 'Solo track', team: 'Team track', notes: 'Notes track', next: 'What next track' };

// The link to the Notion study hub template. Paste the public link between the quotes
// when the template is published. While it is empty, the site says "ask your tutor".
const HUB_URL = '';

const STAGES = {
  look:   { name: 'Look',          blurb: 'See what real portfolios look like.' },
  html:   { name: 'HTML gym',      blurb: 'Revise the tags from class, one at a time.' },
  css:    { name: 'CSS gym',       blurb: 'Revise colours, fonts, boxes and classes.' },
  git:    { name: 'GitHub',        blurb: 'Put your page online and learn to commit.' },
  proj:   { name: 'Projects',      blurb: 'Collect your projects and sketch your portfolio.' },
  net:    { name: 'LinkedIn',      blurb: 'Make a profile, follow people, find events.' },
  js:     { name: 'JavaScript',    blurb: 'One button. That is all.' },
  start:  { name: 'Start',         blurb: 'Meet the project, join the repository, warm up.' },
  plan:   { name: 'Plan',          blurb: 'Share the jobs on the board.' },
  flow:   { name: 'Pull requests', blurb: 'Change the website safely, as a team.' },
  build:  { name: 'Build',         blurb: 'Make your page, then make it better.' },
  finish: { name: 'Finish',        blurb: 'Check everything and publish.' },
  // notes track
  first:  { name: 'First page',    blurb: 'What Notion is, and your first page of notes.' },
  tpl:    { name: 'Templates',     blurb: 'Look inside pages that other people made.' },
  db:     { name: 'Databases',     blurb: 'One list, seen in several ways.' },
  hub:    { name: 'Study hub',     blurb: 'Copy the class template and make it yours.' },
  ob:     { name: 'Year 2',        blurb: 'A quick look at Obsidian. Not for now.' },
  // what next track
  choose: { name: 'Choose',        blurb: 'Pick a direction for the next months.' },
  learn:  { name: 'Learn',         blurb: 'Free and cheap courses that people recommend.' },
  ask:    { name: 'Ask',           blurb: 'Reddit and AI: where to ask, and how.' },
  sem2:   { name: 'Semester 2',    blurb: 'Your own plan for the months with no programming class.' }
};

const views = $$('.view');
const tasks = $$('.task');
const inTrack = track => tasks.filter(t => t.dataset.track === track);
const isDone = id => store.get('done:' + id) === '1';

// Adds the heading, the labels, the "done" button and the Back / Next links to every task.
function dressTasks() {
  tasks.forEach(task => {
    const d = task.dataset, list = inTrack(d.track), n = list.indexOf(task);
    const wrap = $('.wrap', task);
    d.n = n + 1;
    $$('.block', task).forEach(block => {
      block.prepend(h('h2', {class: 'blk-name', text: block.dataset.label}));
      if (block.dataset.label === 'Reflect') {
        block.append(
          h('p', {class: 'quiet read', text: 'Copy your answer into your reflection post, for example on Padlet.'}),
          h('p', {class: 'btnrow read'}, h('button', {type: 'button', class: 'btn small copy-notes', text: 'Copy my notes from this task'})));
      }
    });
    wrap.prepend(h('header', {class: 'task-head'},
      h('p', {class: 'crumbs'},
        h('a', {href: '#' + d.track, text: TRACKS[d.track]}),
        h('span', {text: 'Mission ' + String(n + 1).padStart(2, '0')})),
      h('h1', {text: d.title}),
      h('p', {class: 'chips'},
        h('span', {class: 'chip of-stage', text: STAGES[d.stage].name}),
        h('span', {class: d.level === 'new' ? 'chip new' : 'chip', text: d.level === 'new' ? 'New' : 'Revise'}),
        h('span', {class: 'meta', text: 'About ' + d.mins + ' minutes'}),
        h('span', {class: 'meta', text: 'Task ' + (n + 1) + ' of ' + list.length}))),
      stripFor(task, list));
    const prev = list[n - 1], next = list[n + 1];
    wrap.append(h('footer', {class: 'task-foot'},
      h('button', {type: 'button', class: 'btn-done', 'data-done': task.id}),
      h('span', {class: 'pager'},
        prev ? h('a', {class: 'btn', href: '#' + prev.id, text: 'Back: ' + prev.dataset.title}) : null,
        next ? h('a', {class: 'btn primary', href: '#' + next.id, text: 'Next: ' + next.dataset.title})
             : h('a', {class: 'btn primary', href: '#' + d.track, text: 'Back to the ' + TRACKS[d.track].toLowerCase()}))));
  });
}

// The stage of one task as a line of stops: the tasks of that stage, with this one marked "You are here".
// At each end is the name of the stage before and the stage after.
function stripFor(task, list) {
  const stage = list.filter(t => t.dataset.stage === task.dataset.stage);
  const before = list[list.indexOf(stage[0]) - 1], after = list[list.indexOf(stage[stage.length - 1]) + 1];
  const end = (t, side) => t
    ? h('a', {class: 'strip-end ' + side, href: '#' + t.id}, h('span', {text: STAGES[t.dataset.stage].name}))
    : h('span', {class: 'strip-end none ' + side});
  const stops = h('ol');
  stage.forEach(t => stops.append(h('li', {class: t === task ? 'is-now' : null, 'data-stop': t.id},
    h('a', {href: '#' + t.id, 'aria-current': t === task ? 'step' : null}, h('span', {text: t.dataset.title})))));
  return h('nav', {class: 'strip', 'aria-label': 'Tasks in the stage ' + STAGES[task.dataset.stage].name}, end(before, 'prev'), stops, end(after, 'next'));
}

function paintDone() {
  $$('.btn-done').forEach(b => {
    const on = isDone(b.dataset.done);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.textContent = on ? 'Done. Click to undo' : 'Mark this task as done';
  });
  $$('[data-stop]').forEach(li => li.classList.toggle('is-done', isDone(li.dataset.stop) && !li.classList.contains('is-now')));
}

// Draws the list of stations on the track pages, and every progress bar.
function drawLists() {
  $$('[data-list]').forEach(box => {
    box.textContent = '';
    let stage = null, list = null;
    inTrack(box.dataset.list).forEach(t => {
      const d = t.dataset;
      if (d.stage !== stage) {
        stage = d.stage;
        list = h('ol', {class: 'stations'});
        box.append(h('section', {class: 'stage', 'data-stage': stage},
          h('div', {class: 'stage-name'}, h('h2', {text: STAGES[stage].name}), h('p', {text: STAGES[stage].blurb})),
          list));
      }
      const done = isDone(t.id);
      list.append(h('li', {class: done ? 'station is-done' : 'station'},
        h('a', {href: '#' + t.id},
          h('span', {class: 'st-n', 'aria-hidden': 'true', text: done ? '✓' : d.n}),
          h('span', {class: 'st-title', text: d.title}),
          h('span', {class: 'st-meta'},
            done ? h('span', {class: 'chip', text: 'Done'}) : null,
            d.level === 'new' ? h('span', {class: 'chip new', text: 'New'}) : null,
            d.mins + ' min'))));
    });
  });
  $$('[data-progress]').forEach(box => {
    const list = inTrack(box.dataset.progress);
    const done = list.filter(t => isDone(t.id)).length;
    const next = list.find(t => !isDone(t.id));
    box.textContent = '';
    box.append(
      h('div', {class: 'bar', role: 'img', style: '--n:' + list.length, 'aria-label': done + ' of ' + list.length + ' tasks done'},
        h('i', {style: 'width:' + (100 * done / list.length) + '%;--d:' + Math.max(done, 1)})),
      h('p', {class: 'count', text: done + ' of ' + list.length + ' tasks done'}),
      next ? h('p', {class: 'next'}, 'Next: ', h('a', {href: '#' + next.id, text: next.dataset.title}))
           : h('p', {class: 'next', text: 'All done. Well done.'}));
  });
  // The course map on the home page: a finished stage is filled, the stage you are on has a ring.
  Object.keys(TRACKS).forEach(track => {
    let found = false;
    $$('.tube .stn.' + track).forEach(stop => {
      const list = inTrack(track).filter(t => t.dataset.stage === stop.dataset.stage);
      const todo = list.find(t => !isDone(t.id));
      stop.classList.toggle('is-done', !todo);
      stop.classList.toggle('is-now', !!todo && !found);
      if (todo) found = true;
      stop.setAttribute('href', '#' + (todo || list[0] || {id: track}).id);
    });
  });
}

// Shows one view and hides the others.
function show(id, moveFocus) {
  let view = id ? document.getElementById(id) : null;
  if (!view || !view.classList.contains('view')) view = document.getElementById('home');
  views.forEach(v => { v.hidden = v !== view; });
  const track = view.dataset.track || 'home';
  document.body.dataset.track = track;
  $$('.topnav a').forEach(a => {
    if (a.dataset.nav === track) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
  PGS.forEach(pg => { if (view.contains(pg.root)) pg.open(); });
  if (moveFocus) {
    const h1 = $('h1', view);
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({preventScroll: true}); }
  }
}

function reportText() {
  const out = ['Page to Portfolio: progress report', new Date().toLocaleDateString('en-GB'), ''];
  Object.keys(TRACKS).forEach(track => {
    const list = inTrack(track), done = list.filter(t => isDone(t.id));
    out.push(TRACKS[track] + ': ' + done.length + ' of ' + list.length + ' tasks done');
    done.forEach(t => out.push('  done: ' + t.dataset.title));
    out.push('');
  });
  const user = store.get('f:my-github'), url = store.get('f:my-pages-url');
  if (user) out.push('GitHub username: ' + user);
  if (url) out.push('My live page: ' + url);
  return out.join('\n');
}
