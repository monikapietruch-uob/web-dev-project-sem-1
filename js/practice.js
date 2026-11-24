/* =====================================================================
   js/practice.js
   Practice tools inside tasks: hear-it buttons, the word counter, the
   timer, spot-it lists, the commit message checker, the flag checker,
   the list of reflections.
   Each tool wakes up when it finds its attribute in the HTML:
     data-say="words"          a button that reads the words aloud
     data-words="45-55"        a writing box that counts words
     class="timer"             a stopwatch with a target time
     class="spot"              a list where you click the things that are wrong
     data-msg                  a box that checks a commit message as you type
     data-flag="code"          a box that checks one answer of "Find the flag"
     data-reflections          the list of every saved Reflect answer
     data-pushlab              three places: a model of commit, push and pull
   Uses things from: helpers.js, pages.js, saved.js, playground.js, checks.js, quizzes.js, demos.js, tools.js
   ===================================================================== */
'use strict';

// ---- 1. Hear it ----
// The browser reads the words aloud. British English is chosen when the computer has it.
let VOICE = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const all = speechSynthesis.getVoices();
  VOICE = all.find(v => /en[-_]GB/i.test(v.lang)) || all.find(v => /^en/i.test(v.lang)) || null;
}
function say(words, button) {
  const quiet = () => {
    // No voice: show the words instead, so the task still works.
    let note = button.nextElementSibling;
    if (!note || !note.classList.contains('say-note')) { note = h('span', {class: 'say-note', role: 'status'}); button.after(note); }
    note.textContent = 'This browser cannot read aloud. The words are: ' + words;
  };
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') { quiet(); return; }
  try {
    if (!VOICE) pickVoice();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(words);
    u.lang = VOICE ? VOICE.lang : 'en-GB';
    if (VOICE) u.voice = VOICE;
    u.rate = 0.85;
    u.onerror = quiet;
    speechSynthesis.speak(u);
  } catch (e) { quiet(); }
}

// ---- 2. A box that counts words ----
function initWordCounts() {
  $$('[data-words]').forEach(box => {
    const range = box.dataset.words.split('-').map(Number), low = range[0], high = range[1] || range[0];
    const out = h('p', {class: 'wordcount', role: 'status'});
    box.after(out);
    const paint = () => {
      const n = (box.value.trim().match(/\S+/g) || []).length;
      out.textContent = n + (n === 1 ? ' word' : ' words') + '. Aim for ' + low + ' to ' + high + '.';
      out.classList.toggle('is-ok', n >= low && n <= high);
    };
    box.addEventListener('input', paint);
    box.paintCount = paint;
  });
}

// ---- 3. A stopwatch with a target time ----
// <div class="timer" data-name="talk" data-min="180" data-max="300" data-what="talk"></div>
const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
function initTimers() {
  $$('.timer').forEach(root => {
    const min = Number(root.dataset.min), max = Number(root.dataset.max), key = 'timer:' + root.dataset.name;
    const what = root.dataset.what || 'talk';
    const face = h('p', {class: 'timer-face', role: 'timer', 'aria-label': 'Time', text: '0:00'});
    const verdict = h('p', {class: 'timer-say', role: 'status', text: 'Target: ' + clock(min) + ' to ' + clock(max) + '.'});
    const go = h('button', {type: 'button', class: 'btn small primary', text: 'Start'});
    const zero = h('button', {type: 'button', class: 'btn small', text: 'Reset'});
    const log = h('ol', {class: 'timer-log'});
    let began = 0, tick = null, secs = 0;
    const tries = () => { try { return JSON.parse(store.get(key) || '[]'); } catch (e) { return []; } };
    const judge = s => s < min ? 'too short' : (s > max ? 'too long' : 'in the target zone');
    const paintLog = () => {
      log.textContent = '';
      tries().forEach(s => log.append(h('li', {text: clock(s) + ', ' + judge(s)})));
    };
    const paint = () => {
      face.textContent = clock(secs);
      root.dataset.zone = secs < min ? 'short' : (secs > max ? 'long' : 'good');
    };
    const stop = () => {
      clearInterval(tick); tick = null; go.textContent = 'Start';
      if (secs < 5) return;                           // a slip of the finger is not an attempt
      verdict.textContent = 'Your ' + what + ' took ' + clock(secs) + ': ' + judge(secs) + '.';
      store.set(key, JSON.stringify(tries().concat(secs).slice(-5)));
      paintLog();
    };
    go.addEventListener('click', () => {
      if (tick) { stop(); return; }
      began = Date.now() - secs * 1000;
      go.textContent = 'Stop';
      tick = setInterval(() => { secs = (Date.now() - began) / 1000; paint(); }, 250);
    });
    zero.addEventListener('click', () => {
      clearInterval(tick); tick = null; secs = 0; go.textContent = 'Start'; paint();
      verdict.textContent = 'Target: ' + clock(min) + ' to ' + clock(max) + '.';
    });
    root.append(face, verdict, h('p', {class: 'btnrow'}, go, zero), h('p', {class: 'quiet', text: 'Your last five attempts:'}), log);
    paint(); paintLog();
  });
}

// ---- 4. Spot it: click the things that are wrong ----
// <div class="spot"> <button class="spot-item" data-clue="Why it is wrong">text</button> <button class="spot-item">fine text</button> </div>
function initSpots() {
  $$('.spot').forEach(root => {
    const items = $$('.spot-item', root), need = items.filter(b => b.dataset.clue).length;
    const score = h('p', {class: 'spot-score', role: 'status'});
    root.append(score);
    const paint = () => {
      const found = items.filter(b => b.classList.contains('is-found')).length;
      const looked = items.filter(b => b.classList.contains('is-found') || b.classList.contains('is-fine')).length;
      // A group with nothing to find (an honest email, for example) is complete when every line has been checked.
      const complete = need ? found === need : looked === items.length;
      if (!need) score.textContent = complete ? (root.dataset.none || 'You checked every line, and nothing is wrong. Sometimes a message is simply real.')
        : looked + ' of ' + items.length + ' lines checked.';
      else score.textContent = complete ? (root.dataset.all || 'You found all ' + need + '. Well spotted.') : found + ' of ' + need + ' found. Keep looking.';
      root.classList.toggle('is-complete', complete);
    };
    items.forEach(b => b.addEventListener('click', () => {
      let note = b.nextElementSibling;
      if (!note || !note.classList.contains('spot-note')) { note = h('span', {class: 'spot-note'}); b.after(note); }
      if (b.dataset.clue) { b.classList.add('is-found'); note.textContent = b.dataset.clue; }
      else { b.classList.add('is-fine'); note.textContent = b.dataset.fine || 'Nothing wrong here.'; }
      paint();
    }));
    paint();
  });
}

// ---- 5. The commit message checker ----
const MSG_VERBS = ['add', 'fix', 'remove', 'update', 'change', 'rename', 'move', 'improve', 'correct', 'replace',
  'delete', 'create', 'make', 'use', 'link', 'tidy', 'write', 'show', 'hide', 'set', 'test', 'merge', 'resize', 'translate'];
function messageProblems(text) {
  const t = text.trim(), first = (t.split(/\s+/)[0] || ''), low = first.toLowerCase().replace(/[^a-z]/g, '');
  const out = [];
  if (!t) return out;
  if (t.split(/\s+/).length < 2) out.push('One word is not enough. Say what you changed, and where.');
  if (/^(i|we)$/i.test(first)) out.push('Leave out “I” and “we”. Start with the verb.');
  else if (/ing$/.test(low) && low.length > 4) out.push('“' + first + '” ends in -ing. Use the short form, like an instruction: Add, Fix, Update.');
  else if (/(ed|ied)$/.test(low) && low.length > 4) out.push('“' + first + '” is the past form. Write it like an instruction: Add, not Added.');
  else if (MSG_VERBS.indexOf(low) === -1) out.push('Start with a verb that gives an instruction, such as Add, Fix, Remove or Update.');
  if (first && first[0] !== first[0].toUpperCase()) out.push('Start with a capital letter.');
  if (t.length > 50) out.push('It has ' + t.length + ' characters. Keep it to 50 or fewer.');
  if (/[.!]$/.test(t)) out.push('No full stop at the end. It is a title, not a sentence.');
  return out;
}
function initMessageChecks() {
  $$('[data-msg]').forEach(input => {
    const out = h('ul', {class: 'msg-out', role: 'status'});
    input.after(out);
    const paint = () => {
      const problems = messageProblems(input.value);
      out.textContent = '';
      if (!input.value.trim()) return;
      if (!problems.length) out.append(h('li', {class: 'is-ok', text: 'Good message.'}));
      problems.forEach(p => out.append(h('li', {text: p})));
    };
    input.addEventListener('input', paint);
    input.paintMsg = paint;
  });
}

// ---- 6. Find the flag: the answers are stored as short codes, so they cannot be read here ----
function flagCode(text) {
  let n = 2166136261;
  for (let i = 0; i < text.length; i++) { n ^= text.charCodeAt(i); n = Math.imul(n, 16777619); }
  return (n >>> 0).toString(16);
}
function initFlags() {
  $$('[data-flag]').forEach(input => {
    const out = h('span', {class: 'flag-out', role: 'status'});
    input.after(out);
    const paint = () => {
      const v = input.value.trim();
      const ok = flagCode(v.toLowerCase()) === input.dataset.flag;
      out.textContent = !v ? '' : (ok ? 'Correct. Flag captured.' : (/^flag\{.*\}$/i.test(v) ? 'Not this one.' : 'A flag looks like this: flag{some-words}'));
      out.classList.toggle('is-ok', ok);
      const all = $$('[data-flag]'), got = all.filter(f => flagCode(f.value.trim().toLowerCase()) === f.dataset.flag).length;
      $$('[data-flag-count]').forEach(s => { s.textContent = got + ' of ' + all.length + ' flags captured'; });
    };
    input.addEventListener('input', paint);
    input.paintFlag = paint;
  });
}

// ---- 7. Every saved Reflect answer in one list (the task "From reflections to presentation") ----
function drawReflections() {
  $$('[data-reflections]').forEach(box => {
    box.textContent = '';
    let count = 0;
    Object.keys(TRACKS).forEach(track => {
      const rows = [];
      inTrack(track).forEach(task => {
        $$('.block[data-label="Reflect"] [data-save]', task).forEach(f => {
          const answer = (store.get('f:' + f.dataset.save) || '').trim();
          if (!answer || task.contains(box)) return;
          const pick = h('input', {type: 'checkbox', id: 'pick-' + f.dataset.save});
          pick.checked = store.get('pick:' + f.dataset.save) === '1';
          pick.addEventListener('change', () => store.set('pick:' + f.dataset.save, pick.checked ? '1' : '0'));
          rows.push(h('li', {},
            h('label', {for: pick.id}, pick, h('span', {},
              h('b', {text: task.dataset.title + ': '}), h('span', {class: 'quiet', text: labelFor(f)}),
              h('span', {class: 'refl-text', text: answer})))));
          count++;
        });
      });
      if (rows.length) box.append(h('h3', {text: TRACKS[track]}), h('ul', {class: 'ticks refl'}, ...rows));
    });
    if (!count) box.append(h('p', {class: 'callout careful', text: 'No reflections are saved in this browser yet. Do a few tasks and fill in the Reflect boxes. Then come back.'}));
  });
}
function pickedReflections() {
  const out = [];
  tasks.forEach(task => $$('.block[data-label="Reflect"] [data-save]', task).forEach(f => {
    if (store.get('pick:' + f.dataset.save) === '1') out.push(task.dataset.title + '\n' + (store.get('f:' + f.dataset.save) || '').trim());
  }));
  return out.join('\n\n');
}

// ---- 8. Three places: a small model of commit, push and pull ----
// <div class="pushlab" data-pushlab></div>
// Nothing here talks to GitHub. It is a model: a folder, the history on your computer and GitHub,
// each kept as a list. The pretend commit messages come from the two lists below.
const LAB_MINE = ['Add opening hours', 'Fix spelling in heading', 'Add photo of my desk', 'Update contact section',
  'Tidy the list of projects', 'Change the background colour'];
const LAB_THEIRS = ['Add Tom to the team list', 'Fix link on the home page', 'Add alt text to the logo', 'Update the README'];
function initPushLab() {
  $$('[data-pushlab]').forEach(root => {
    let s = null;
    const fresh = () => {
      const first = { who: 'you', msg: 'Add my first page', old: true };
      return { changed: false, local: [first], remote: [first], mine: 0, theirs: 0, pushed: false, refused: false, repaired: false };
    };
    const ahead = () => s.local.filter(c => s.remote.indexOf(c) === -1);     // commits that GitHub does not have
    const behind = () => s.remote.filter(c => s.local.indexOf(c) === -1);    // commits that your computer does not have
    const count = n => n + (n === 1 ? ' commit' : ' commits');
    const GOALS = [
      { t: 'Change a file and commit the change.', f: () => s.local.some(c => c.who === 'you' && !c.old) },
      { t: 'Push, so that GitHub has your commit.', f: () => s.pushed },
      { t: 'Let a teammate commit on GitHub. Commit again yourself, and try to push. Read the answer.', f: () => s.refused },
      { t: 'Pull. Then push again.', f: () => s.repaired }
    ];
    const folder = h('div', {class: 'lab-body'}), mine = h('ol', {class: 'lab-body lab-list'}), hub = h('ol', {class: 'lab-body lab-list'});
    const say = h('p', {class: 'lab-say', role: 'status'}), arrows = h('p', {class: 'lab-arrows'});
    const goalEls = GOALS.map(g => h('li', {}, h('span', {class: 'goal-mark', text: 'Not yet'}), h('span', {text: g.t})));
    const score = h('p', {class: 'pg-score'});
    const row = (c, note) => h('li', {class: c.who === 'you' ? 'is-mine' : 'is-theirs'},
      h('span', {class: 'lab-msg', text: c.msg}), h('span', {class: 'lab-who', text: c.who === 'you' ? 'you' : 'Tom'}),
      note ? h('span', {class: 'lab-note', text: note}) : null);
    const paint = () => {
      const up = ahead(), down = behind();
      folder.textContent = '';
      folder.append(h('p', {class: 'lab-file'}, h('code', {text: 'index.html'}),
        s.changed ? h('span', {class: 'lab-note', text: 'M: changed, not committed'}) : h('span', {class: 'lab-clean', text: 'no changes'})));
      mine.textContent = ''; hub.textContent = '';
      s.local.slice().reverse().forEach(c => mine.append(row(c, up.indexOf(c) !== -1 ? 'not pushed yet' : '')));
      s.remote.slice().reverse().forEach(c => hub.append(row(c, down.indexOf(c) !== -1 ? 'not pulled yet' : '')));
      arrows.textContent = '';
      arrows.append(h('b', {text: 'main'}), ' ', h('span', {class: 'lab-count', text: down.length + '↓'}), ' ', h('span', {class: 'lab-count', text: up.length + '↑'}),
        h('span', {class: 'quiet', text: '  ' + count(down.length) + ' to pull, ' + count(up.length) + ' to push. VS Code shows the same two numbers in its Status Bar.'}));
      let done = 0;
      GOALS.forEach((g, i) => {
        const ok = !!g.f();
        goalEls[i].classList.toggle('is-done', ok);
        goalEls[i].firstChild.textContent = ok ? 'Done' : 'Not yet';
        if (ok) done++;
      });
      score.textContent = done === GOALS.length ? 'All four done. That is the whole idea of push and pull.' : done + ' of ' + GOALS.length + ' goals done';
      root.classList.toggle('is-complete', done === GOALS.length);
    };
    const tell = (text, kind) => { say.textContent = text; say.dataset.kind = kind || ''; paint(); };
    const act = {
      change() { s.changed = true; tell('You changed index.html and saved it. Saved is not committed.'); },
      commit() {
        if (!s.changed) { tell('Nothing to commit. Change a file first.'); return; }
        s.local.push({ who: 'you', msg: LAB_MINE[s.mine++ % LAB_MINE.length] });
        s.changed = false;
        tell('Committed. The commit is in the history on your computer. GitHub has not seen it.', 'ok');
      },
      push() {
        const up = ahead(), down = behind();
        if (!up.length) { tell(down.length ? 'You have nothing to push. GitHub has ' + count(down.length) + ' that you could pull.' : 'Nothing to push. GitHub already has everything.'); return; }
        if (down.length) { s.refused = true; tell('Rejected. GitHub has ' + count(down.length) + ' that your computer does not have. Pull first, then push.', 'bad'); return; }
        if (s.refused && s.local.some(c => c.who === 'mate')) s.repaired = true;
        s.remote = s.local.slice(); s.pushed = true;
        tell('Pushed ' + count(up.length) + '. GitHub is up to date.', 'ok');
      },
      pull() {
        const up = ahead(), down = behind();
        if (!down.length) { tell('Already up to date. Nothing to pull.'); return; }
        s.local = s.remote.concat(up);
        tell('Pulled ' + count(down.length) + '.' + (up.length ? ' Git joined Tom’s work and yours. Now your push will fit.' : ' Your computer has Tom’s work now.'), 'ok');
      },
      mate() {
        s.remote = s.remote.concat({ who: 'mate', msg: LAB_THEIRS[s.theirs++ % LAB_THEIRS.length] });
        tell('Tom committed on GitHub. Your computer does not have his commit yet.');
      },
      again() { s = fresh(); tell('Three places, five buttons. Start with “Change a file”.'); }
    };
    const btn = (name, text, cls) => { const b = h('button', {type: 'button', class: 'btn small' + (cls ? ' ' + cls : ''), text: text}); b.addEventListener('click', act[name]); return b; };
    const place = (num, title, sub, body) => h('div', {class: 'lab-place'},
      h('p', {class: 'label', text: 'Place ' + num}), h('h4', {text: title}), h('p', {class: 'lab-sub', text: sub}), body);
    root.append(
      h('div', {class: 'lab-places'},
        place(1, 'Your folder', 'The files as they are now', folder),
        h('div', {class: 'lab-link', 'aria-hidden': 'true'}, h('span', {text: 'commit'})),
        place(2, 'Your history', 'The commits on your computer', mine),
        h('div', {class: 'lab-link two', 'aria-hidden': 'true'}, h('span', {text: 'push'}), h('span', {class: 'back', text: 'pull'})),
        place(3, 'GitHub', 'What everybody else sees', hub)),
      h('div', {class: 'lab-ctrl'},
        h('p', {class: 'btnrow'}, btn('change', 'Change a file'), btn('commit', 'Commit'), btn('push', 'Push', 'primary'), btn('pull', 'Pull')),
        h('p', {class: 'btnrow'}, btn('mate', 'A teammate commits on GitHub'), btn('again', 'Start again'))),
      say, arrows,
      h('div', {class: 'pg-under'}, h('h4', {text: 'Four goals'}), h('ul', {class: 'pg-goals'}, ...goalEls), score));
    act.again();
  });
}

function initPractice() {
  if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  // every word in the Word bank gets a "hear it" button
  $$('table.words tbody td:first-child').forEach(td => {
    const word = td.textContent.replace(/\(.*?\)/g, '').trim();
    td.append(' ', h('button', {type: 'button', class: 'say mini', 'data-say': word, 'aria-label': 'Hear the word ' + word}));
  });
  document.addEventListener('click', e => {
    const b = e.target.closest ? e.target.closest('[data-say]') : null;
    if (b) say(b.dataset.say, b);
    const c = e.target.closest ? e.target.closest('[data-copy-picked]') : null;
    if (c) copyText(pickedReflections() || 'Nothing is ticked yet.', c);
  });
  initWordCounts();
  initTimers();
  initSpots();
  initMessageChecks();
  initFlags();
  initPushLab();
  onShow['l-6'] = drawReflections;
}
// After the saved values are back in the boxes, the counters and checkers read them once.
function refreshPractice() {
  $$('[data-words]').forEach(b => b.paintCount && b.paintCount());
  $$('[data-msg]').forEach(b => b.paintMsg && b.paintMsg());
  $$('[data-flag]').forEach(b => b.paintFlag && b.paintFlag());
}
