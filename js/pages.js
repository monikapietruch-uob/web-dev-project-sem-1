/* =====================================================================
   js/pages.js
   Pages, tasks and progress: the names of the tracks and stages, the
   links to the Notion template and the Practice Hub, the headings of
   tasks, the lists, the progress bars, the course map, and showing
   one page at a time.
   Uses things from: helpers.js
   ===================================================================== */
'use strict';

const TRACKS = { solo: 'Solo track', team: 'Team track', yours: 'Make it yours', notes: 'Notes track', next: 'What next track',
  lang: 'Language lab', path: 'Pathways' };
// How the last task of a track says "Back to …"
const BACK_TO = { solo: 'the solo track', team: 'the team track', yours: 'Make it yours', notes: 'the notes track',
  next: 'the what next track', lang: 'the Language lab', path: 'Pathways' };

// ---------------------------------------------------------------------
// LOCKED TRACKS
// A locked track keeps its own page, and that page still shows the path.
// Its tasks and checkpoints cannot be opened: the names on the path are
// plain text, and an address such as #t-1 leads back to the page of the track.
// To open a track for the students, delete its name from this list.
// The seven names are: 'solo', 'team', 'yours', 'notes', 'next', 'lang', 'path'.
// ---------------------------------------------------------------------
const LOCKED = ['team', 'yours', 'notes', 'next', 'lang', 'path'];
const LOCK_TEXT = 'This area will unlock soon.';
// The tutor's preview opens the locked tracks in one browser only (see setPreview, further down).
let PREVIEW = false;
try { PREVIEW = localStorage.getItem('p2p-preview') === '1'; } catch (e) { /* saving is blocked in this browser */ }
const isLocked = track => !PREVIEW && LOCKED.indexOf(track) !== -1;
// Inside an open track the students can stop at one task for now. Everything after it is locked,
// and so is the checkpoint of every stage that is not fully open. Write the address of the LAST OPEN task.
// To open more, write a later task. To open the whole track, delete its line.
// Solo: open up to Mission 18, Put your page online (s-git-4). Decided on 25 November 2026.
const OPEN_UNTIL = { solo: 's-git-4' };

// The address of the Tech Practice Hub, for the Python tasks. Links with data-practice-hub use it.
const PRACTICE_HUB_URL = 'https://cefl-foundation.github.io/tech/';

// The link to the Notion study hub template. Paste the public link between the quotes
// when the template is published. While it is empty, the site says "ask your tutor".
const HUB_URL = '';

const STAGES = {
  look:   { name: 'Look',          blurb: 'See what real portfolios look like.' },
  html:   { name: 'HTML gym',      blurb: 'Revise the tags from class, one at a time.' },
  css:    { name: 'CSS gym',       blurb: 'Revise colours, fonts, boxes and classes.' },
  git:    { name: 'GitHub',        blurb: 'Put your page online and learn to commit.' },
  vsc:    { name: 'VS Code',       blurb: 'A real code editor: first in the browser, then on your own computer.' },
  push:   { name: 'Push',          blurb: 'Send your commits to GitHub: in the browser, and from your own computer.' },
  proj:   { name: 'Projects',      blurb: 'Collect your projects and draw your portfolio.' },
  net:    { name: 'LinkedIn',      blurb: 'Make a profile, follow people, find events.' },
  js:     { name: 'JavaScript',    blurb: 'One button. Then a few more.' },
  start:  { name: 'Start',         blurb: 'Meet the project, join the repository, warm up.' },
  plan:   { name: 'Plan',          blurb: 'Share the jobs on the board.' },
  flow:   { name: 'Pull requests', blurb: 'Change the website safely, as a team.' },
  build:  { name: 'Build',         blurb: 'Make your page, then make it better.' },
  finish: { name: 'Finish',        blurb: 'Test it, publish it, look back.' },
  // make it yours
  fork:   { name: 'Fork',          blurb: 'Take your own copy of the team website.' },
  remake: { name: 'Rebuild',       blurb: 'Turn the copy into a site about you.' },
  launch: { name: 'Launch',        blurb: 'Put it online and tell people.' },
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
  career: { name: 'Careers',       blurb: 'A CV, a job advert, your stories and ten questions.' },
  sem2:   { name: 'Semester 2',    blurb: 'Your own plan for the months with no programming class.' },
  // language lab
  say:    { name: 'Say',           blurb: 'Say code aloud, so that people understand you.' },
  read:   { name: 'Read',          blurb: 'Find answers in the documentation.' },
  write:  { name: 'Write',         blurb: 'Commit messages, a summary and an argument.' },
  present:{ name: 'Present',       blurb: 'Turn your reflections into a short talk.' },
  // pathways
  ee:     { name: 'Electronic engineering', blurb: 'A circuit, a datasheet and the units.' },
  cyber:  { name: 'Cyber security', blurb: 'Secrets, phishing and a hunt for flags.' },
  cs:     { name: 'Computer science', blurb: 'How a page travels, and how to read code.' }
};

const views = $$('.view');
const tasks = $$('.task');
const inTrack = track => tasks.filter(t => t.dataset.track === track);
const isDone = id => store.get('done:' + id) === '1';

// The track of a task or a checkpoint, worked out from its address. Any other address gives ''.
function trackOf(id) {
  if (!id) return '';
  if (id.indexOf('cp-') === 0 && CHECKPOINTS[id.slice(3)]) return stageTrack(id.slice(3));
  const el = document.getElementById(id);
  return el && el.classList.contains('task') ? el.dataset.track : '';
}
// Is this task locked? Yes when its whole track is locked, or when it comes after the last open task of its track (OPEN_UNTIL).
function taskLocked(t) {
  if (PREVIEW || !t || !t.dataset) return false;
  const track = t.dataset.track;
  if (isLocked(track)) return true;
  if (!OPEN_UNTIL[track]) return false;
  const list = inTrack(track), cut = list.findIndex(x => x.id === OPEN_UNTIL[track]);
  return cut !== -1 && list.indexOf(t) > cut;
}
// Is the checkpoint of this stage locked? Yes when any task of the stage is locked.
const stageLocked = stage => !PREVIEW && (isLocked(stageTrack(stage)) || tasks.some(t => t.dataset.stage === stage && taskLocked(t)));
// The open tasks of one track.
const openIn = track => inTrack(track).filter(t => !taskLocked(t));
// The page of the track that a locked address leads to, or '' when the address is open.
const lockedTrack = id => {
  const track = trackOf(id);
  if (!track) return '';
  if (isLocked(track)) return track;
  if (id.indexOf('cp-') === 0) return stageLocked(id.slice(3)) ? track : '';
  return taskLocked(document.getElementById(id)) ? track : '';
};
// The tasks and stages that are open now. The numbers on the site count only these.
const openTasks = () => tasks.filter(t => !taskLocked(t));
const openStages = () => Object.keys(CHECKPOINTS).filter(stage => !stageLocked(stage));
// The words for a track that is open only in part, for example "Missions 19 to 37".
function lockedRange(track) {
  const list = inTrack(track), shut = list.filter(taskLocked);
  return shut.length ? 'Missions ' + (list.indexOf(shut[0]) + 1) + ' to ' + list.length : '';
}

// The notice on a locked track. "big" is the one on the page of the track, with a second sentence.
function lockNote(big) {
  return h('div', {class: big ? 'lock-note big' : 'lock-note'},
    h('i', {class: 'lock-ico', 'aria-hidden': 'true'}),
    h('p', {}, h('b', {text: LOCK_TEXT}), big ? h('span', {text: 'You can look at the path. The tasks open later.'}) : null));
}
// The notice on a track that is open only in part, under its progress bar.
function partNote(track, big) {
  const list = inTrack(track), last = list.filter(t => !taskLocked(t)).length;
  return h('div', {class: big ? 'lock-note part big' : 'lock-note part'},
    h('i', {class: 'lock-ico', 'aria-hidden': 'true'}),
    h('p', {}, h('b', {text: lockedRange(track) + ' will unlock soon.'}),
      big ? h('span', {text: 'For now, you finish at Mission ' + last + ': ' + list[last - 1].dataset.title + '. You can look at the path.'}) : null));
}

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
        d.tag ? h('span', {class: 'chip tag', text: d.tag}) : null,
        h('span', {class: 'meta', text: 'About ' + d.mins + ' minutes'}),
        h('span', {class: 'meta', text: 'Task ' + (n + 1) + ' of ' + list.length}))),
      stripFor(task, list));
    const prev = list[n - 1], next = list[n + 1], nextShut = !!next && taskLocked(next) && !taskLocked(task);
    wrap.append(h('footer', {class: 'task-foot'},
      h('button', {type: 'button', class: 'btn-done', 'data-done': task.id}),
      h('span', {class: 'pager'},
        prev ? h('a', {class: 'btn', href: '#' + prev.id, text: 'Back: ' + prev.dataset.title}) : null,
        next && !nextShut ? h('a', {class: 'btn primary', href: '#' + next.id, text: 'Next: ' + next.dataset.title})
             : h('a', {class: 'btn primary', href: '#' + d.track, text: 'Back to ' + BACK_TO[d.track]})),
      // The last open task of a track says that the next one is locked.
      nextShut ? h('p', {class: 'next-locked'}, h('i', {class: 'lock-ico', 'aria-hidden': 'true'}),
        'This is the last open mission for now. The next one, ' + next.dataset.title + ', will unlock soon.') : null),
      h('p', {class: 'stuck-link'}, h('a', {href: '#stuck', text: 'Stuck? Open the help page'})));
  });
}

// The stage of one task as a line of stops: the tasks of that stage, with this one marked "You are here".
// At each end is the name of the stage before and the stage after.
function stripFor(task, list) {
  const stage = list.filter(t => t.dataset.stage === task.dataset.stage);
  const before = list[list.indexOf(stage[0]) - 1], after = list[list.indexOf(stage[stage.length - 1]) + 1];
  // A locked task or stage is plain text on the strip: it cannot be clicked.
  const end = (t, side) => !t ? h('span', {class: 'strip-end none ' + side})
    : taskLocked(t) ? h('span', {class: 'strip-end is-locked ' + side}, h('span', {text: STAGES[t.dataset.stage].name}))
    : h('a', {class: 'strip-end ' + side, href: '#' + t.id}, h('span', {text: STAGES[t.dataset.stage].name}));
  const stops = h('ol');
  stage.forEach(t => stops.append(taskLocked(t) && t !== task
    ? h('li', {class: 'is-locked', 'data-stop': t.id}, h('span', {class: 'stop-locked'}, h('span', {text: t.dataset.title + ' (unlocks soon)'})))
    : h('li', {class: t === task ? 'is-now' : null, 'data-stop': t.id},
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
    // On a locked track every row is plain text: there is nothing to click. On a track that is open
    // only in part (OPEN_UNTIL), the rows of the locked tasks and checkpoints are plain text.
    const whole = isLocked(box.dataset.list);
    box.textContent = '';
    box.classList.toggle('is-locked', whole);
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
      const done = isDone(t.id), shut = taskLocked(t);
      const row = [
        h('span', {class: 'st-n', 'aria-hidden': 'true', text: done ? '✓' : d.n}),
        h('span', {class: 'st-title', text: d.title}),
        h('span', {class: 'st-meta'},
          done ? h('span', {class: 'chip', text: 'Done'}) : null,
          shut && !done ? h('span', {class: 'chip locked', text: 'Locked'}) : null,
          !shut && d.level === 'new' ? h('span', {class: 'chip new', text: 'New'}) : null,
          !shut && d.tag ? h('span', {class: 'chip tag', text: d.tag}) : null,
          d.mins + ' min')];
      list.append(h('li', {class: (done ? 'station is-done' : 'station') + (shut && !whole ? ' is-shut' : '')},
        shut ? h('span', {class: 'st-row'}, ...row) : h('a', {href: '#' + t.id}, ...row)));
    });
    // at the end of every stage: its checkpoint quiz, and the mission patch beside the name of the stage
    $$('.stage', box).forEach(sec => {
      const st = sec.dataset.stage;
      if (!CHECKPOINTS[st]) return;
      const passed = cpPassed(st), shut = stageLocked(st);
      const row = [
        h('span', {class: 'st-n', 'aria-hidden': 'true', text: passed ? '★' : '?'}),
        h('span', {class: 'st-title', text: 'Checkpoint: ' + STAGES[st].name}),
        h('span', {class: 'st-meta'},
          passed ? h('span', {class: 'chip', text: 'Patch earned'}) : null,
          shut && !passed ? h('span', {class: 'chip locked', text: 'Locked'}) : null,
          CHECKPOINTS[st].length + ' questions')];
      $('.stations', sec).append(h('li', {class: (passed ? 'station cp is-done' : 'station cp') + (shut && !whole ? ' is-shut' : '')},
        shut ? h('span', {class: 'st-row'}, ...row) : h('a', {href: '#cp-' + st}, ...row)));
      $('.stage-name', sec).append(patchFor(st, passed));
    });
  });
  $$('[data-progress]').forEach(box => {
    const track = box.dataset.progress, list = openIn(track), part = !isLocked(track) && list.length < inTrack(track).length;
    const done = list.filter(t => isDone(t.id)).length;
    const next = list.find(t => !isDone(t.id));
    const onTrackPage = !!box.closest('.trackhead');
    box.textContent = '';
    // A locked track shows the notice in place of the progress bar.
    if (isLocked(track)) { box.append(lockNote(onTrackPage)); return; }
    if (PREVIEW && onTrackPage && LOCKED.indexOf(track) !== -1) box.append(h('p', {class: 'preview-note', text: 'Tutor preview: students see this area as locked.'}));
    if (PREVIEW && onTrackPage && OPEN_UNTIL[track] && LOCKED.indexOf(track) === -1) {
      const all = inTrack(track), cut = all.findIndex(x => x.id === OPEN_UNTIL[track]);
      if (cut !== -1 && cut < all.length - 1) box.append(h('p', {class: 'preview-note', text: 'Tutor preview: students see Missions ' + (cut + 2) + ' to ' + all.length + ' as locked.'}));
    }
    box.append(
      h('div', {class: 'bar', role: 'img', style: '--n:' + list.length, 'aria-label': done + ' of ' + list.length + ' tasks done'},
        h('i', {style: 'width:' + (100 * done / list.length) + '%;--d:' + Math.max(done, 1)})),
      h('p', {class: 'count', text: done + ' of ' + list.length + ' tasks done'}),
      next ? h('p', {class: 'next'}, 'Next: ', h('a', {href: '#' + next.id, text: next.dataset.title}))
           : h('p', {class: 'next', text: part ? 'All open missions done. Well done.' : 'All done. Well done.'}));
    if (part) box.append(partNote(track, onTrackPage));
  });
  // The status line under the top bar: how many tasks are done, and how many patches are earned.
  $$('[data-status]').forEach(s => {
    s.textContent = s.dataset.status === 'patches' ? patchCount() : openTasks().filter(t => isDone(t.id)).length;
  });
  // The course map on the home page: a finished stage is filled, the stage you are on has a ring.
  // A stop of a locked track is drawn pale, and it is not a link.
  Object.keys(TRACKS).forEach(track => {
    const shut = isLocked(track);
    let found = false;
    $$('.tube .stn.' + track).forEach(stop => {
      const all = inTrack(track).filter(t => stop.dataset.stage === 'all' || t.dataset.stage === stop.dataset.stage);
      const list = all.filter(t => !taskLocked(t)), stopShut = shut || !list.length;
      const todo = list.find(t => !isDone(t.id)), allDone = !all.find(t => !isDone(t.id));
      stop.classList.toggle('is-locked', stopShut);
      stop.classList.toggle('is-done', allDone && !stopShut);
      stop.classList.toggle('is-now', !!todo && !found && !stopShut);
      if (todo) found = true;
      if (stopShut) stop.removeAttribute('href');
      else stop.setAttribute('href', '#' + (todo || list[0] || {id: track}).id);
    });
  });
}

// Jobs to do when a page opens. For example:  onShow.record = drawRecord
const onShow = {};

// Shows one view and hides the others.
function show(id, moveFocus) {
  if (id === 'preview-on' || id === 'preview-off') { setPreview(id === 'preview-on'); return; }
  // A task or a checkpoint of a locked track cannot be opened. Its address leads to the page of the track.
  const shut = lockedTrack(id);
  if (shut) {
    id = shut;
    try { history.replaceState(null, '', '#' + shut); } catch (e) { /* the address keeps its old ending */ }
  }
  let view = id ? document.getElementById(id) : null;
  let track = '';
  // A checkpoint has an address like #cp-html. All checkpoints share one page, drawn again each time.
  if (id && id.indexOf('cp-') === 0 && CHECKPOINTS[id.slice(3)]) {
    view = document.getElementById('checkpoint');
    track = drawCheckpoint(id.slice(3));
  }
  if (!view || !view.classList.contains('view')) view = document.getElementById('home');
  views.forEach(v => { v.hidden = v !== view; });
  track = track || view.dataset.track || 'home';
  document.body.dataset.track = track;
  $$('.topnav a').forEach(a => {
    if (a.dataset.nav === track) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
  PGS.forEach(pg => { if (view.contains(pg.root)) pg.open(); });
  if (onShow[view.id]) onShow[view.id]();
  if (moveFocus) {
    const h1 = $('h1', view);
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({preventScroll: true}); }
  }
}

// The tutor's preview. The address ending #preview-on opens every locked track in this browser only,
// and #preview-off locks them again. The choice is kept in the browser, apart from the students' progress.
function setPreview(on) {
  try { if (on) localStorage.setItem('p2p-preview', '1'); else localStorage.removeItem('p2p-preview'); } catch (e) { /* saving is blocked */ }
  let moved = false;
  try { history.replaceState(null, '', '#home'); moved = location.hash === '#home'; } catch (e) { /* stays where it is */ }
  if (moved) location.reload(); else location.hash = 'home';
}

// Runs once when the page opens: everything that a locked track changes outside its own lists.
function initLocks() {
  if (PREVIEW) {
    document.body.prepend(h('p', {class: 'preview-bar'}, 'Tutor preview: the locked areas are open in this browser only. ',
      h('a', {href: '#preview-off', text: 'Lock them again'})));
  }
  const shutNames = Object.keys(TRACKS).filter(isLocked);
  const partNames = Object.keys(TRACKS).filter(track => !isLocked(track) && openIn(track).length < inTrack(track).length);
  if (!shutNames.length && !partNames.length) return;
  // 1. A link to a locked task becomes plain text, with "(unlocks soon)" after it.
  $$('a[href^="#"]').forEach(a => {
    if (a.closest('.tube') || !lockedTrack(a.getAttribute('href').slice(1))) return;
    a.replaceWith(h('span', {class: 'locked-link'}, a.textContent, h('span', {class: 'locked-tag', text: ' (unlocks soon)'})));
  });
  shutNames.forEach(track => {
    // 2. The home page: the card of a locked track offers the path, and the big button to it is hidden.
    $$('.trackcard .btn[href="#' + track + '"]').forEach(a => { a.textContent = 'See the path'; a.closest('.trackcard').classList.add('is-locked'); });
    $$('.hero .btnrow a[href="#' + track + '"]').forEach(a => { a.hidden = true; });
    // 3. The course map: the name of the line says it, and so does the big stop at the end of a pair of lines.
    const names = $$('.tube > .ttl.' + track);
    names.forEach(t => { t.textContent += ' · unlocks soon'; });
    if (!names.length) $$('.tube .stn.' + track + ' .sub').forEach(t => { t.textContent = 'unlocks soon'; });
    $$('.tube .ln.' + track).forEach(line => line.classList.add('is-locked'));
  });
  // 4. The description of the map, which a screen reader reads out.
  const desc = $('#map-desc');
  if (desc && shutNames.length) desc.textContent += ' These lines are locked for now and will unlock soon: ' + shutNames.map(t => TRACKS[t]).join(', ') + '.';
  partNames.forEach(track => {
    const stages = Array.from(new Set(inTrack(track).map(t => t.dataset.stage))).filter(st => inTrack(track).filter(t => t.dataset.stage === st).every(taskLocked));
    if (desc && stages.length) desc.textContent += ' On the ' + TRACKS[track] + ' line these stops will unlock soon: ' + stages.map(st => STAGES[st].name).join(', ') + '.';
  });
}

function reportText() {
  const out = ['Page to Portfolio: progress report', new Date().toLocaleDateString('en-GB'), ''];
  Object.keys(TRACKS).filter(track => !isLocked(track)).forEach(track => {
    const list = openIn(track), done = list.filter(t => isDone(t.id));
    out.push(TRACKS[track] + ': ' + done.length + ' of ' + list.length + ' tasks done');
    done.forEach(t => out.push('  done: ' + t.dataset.title));
    out.push('');
  });
  out.push('Mission patches: ' + patchCount() + ' of ' + openStages().length, '');
  const user = store.get('f:my-github'), url = store.get('f:my-pages-url');
  if (user) out.push('GitHub username: ' + user);
  if (url) out.push('My live page: ' + url);
  return out.join('\n');
}
