/* =====================================================================
   js/record.js
   My record: what is done and when, saving progress to a file and
   loading it again.
   The page that shows what is done and when, with the mission patches.
   Progress lives in this browser only, so this page can save it to a
   small file and load it again, on this computer or on another one.
   Uses things from: helpers.js, pages.js, saved.js, playground.js, checks.js, quizzes.js, demos.js, tools.js, practice.js, terminal.js, wordgames.js, checkpoints.js
   ===================================================================== */
'use strict';

function drawRecord() {
  const box = $('#record-body');
  if (!box) return;
  box.textContent = '';
  const rows = [], lists = [];
  let allDone = 0, allTasks = 0;
  // A locked track is left out of the record until it opens. Its saved progress is kept.
  const open = Object.keys(TRACKS).filter(track => !isLocked(track));
  open.forEach(track => {
    // Only the open tasks count. In a track that is open in part (OPEN_UNTIL), the locked tasks are left out too.
    const list = openIn(track), done = list.filter(t => isDone(t.id));
    const mins = done.reduce((sum, t) => sum + Number(t.dataset.mins), 0);
    const stages = Array.from(new Set(list.map(t => t.dataset.stage))).filter(s => CHECKPOINTS[s] && !stageLocked(s));
    allDone += done.length; allTasks += list.length;
    rows.push(h('tr', {},
      h('td', {text: TRACKS[track]}), h('td', {text: done.length + ' of ' + list.length}),
      h('td', {text: mins + ' minutes'}), h('td', {text: stages.filter(cpPassed).length + ' of ' + stages.length})));
    if (done.length) {
      const ul = h('ul', {class: 'record-list'});
      done.forEach(t => ul.append(h('li', {}, h('span', {text: t.dataset.title}),
        h('span', {class: 'quiet', text: store.get('doneAt:' + t.id) || 'date not saved'}))));
      lists.push(h('h3', {text: TRACKS[track]}), ul);
    }
  });
  const wall = h('div', {class: 'patch-wall'});
  open.forEach(track => {
    Array.from(new Set(openIn(track).map(t => t.dataset.stage))).filter(s => CHECKPOINTS[s] && !stageLocked(s)).forEach(s => {
      wall.append(h('a', {class: 'patch-cell', href: '#cp-' + s}, patchFor(s, cpPassed(s)), h('span', {text: STAGES[s].name})));
    });
  });
  const name = (store.get('f:my-name') || '').trim();
  box.append(
    h('p', {class: 'record-line'}, h('b', {text: name || 'Name not filled in'}), ' · ' + new Date().toLocaleDateString('en-GB') + ' · ' +
      allDone + ' of ' + allTasks + ' tasks done · ' + patchCount() + ' of ' + openStages().length + ' patches'),
    h('div', {class: 'tablewrap'}, h('table', {},
      h('thead', {}, h('tr', {}, h('th', {text: 'Track'}), h('th', {text: 'Tasks done'}), h('th', {text: 'Time'}), h('th', {text: 'Patches'}))),
      h('tbody', {}, ...rows))),
    h('h2', {text: 'Mission patches'}),
    h('p', {class: 'quiet no-print', text: 'Pass the checkpoint at the end of a stage to earn its patch. Click a patch to open its checkpoint.'}),
    wall,
    ...(open.length < Object.keys(TRACKS).length ? [h('p', {class: 'quiet', text: 'The other areas will unlock soon. Their patches will appear here.'})] : []),
    ...open.filter(track => lockedRange(track)).map(track => h('p', {class: 'quiet', text: lockedRange(track) + ' of the ' + TRACKS[track] + ' will unlock soon. They are not counted yet.'})),
    h('h2', {text: 'Tasks done'}),
    ...(lists.length ? lists : [h('p', {text: 'Nothing is ticked yet. Open a track and start.'})]));
}

// Everything this site has saved in this browser, as one piece of text.
function progressText() {
  const data = {};
  store.keys().forEach(k => { data[k] = store.get(k); });
  return JSON.stringify({ app: 'page-to-portfolio', saved: today(), data: data }, null, 1);
}
function readProgress(text) {
  let file = null;
  try { file = JSON.parse(text); } catch (e) { return null; }
  if (!file || file.app !== 'page-to-portfolio' || !file.data || typeof file.data !== 'object') return null;
  return file;
}
function loadProgress(file) {
  store.keys().forEach(k => store.remove(k));
  Object.keys(file.data).forEach(k => { if (typeof file.data[k] === 'string') store.set(k, file.data[k]); });
  location.hash = 'record';
  location.reload();
}

function initRecord() {
  onShow.record = drawRecord;
  const saveBtn = $('#save-file'), copyBtn = $('#copy-progress'), pick = $('#load-file'), ask = $('#load-ask');
  if (!saveBtn) return;
  saveBtn.addEventListener('click', () => {
    const note = $('#save-note');
    try {
      const url = URL.createObjectURL(new Blob([progressText()], {type: 'application/json'}));
      const a = h('a', {href: url, download: 'page-to-portfolio-progress-' + today() + '.json'});
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      note.textContent = 'Saved. Look in your Downloads folder, then move the file to OneDrive or a USB stick. No download? Use “Copy my progress as text”.';
    } catch (e) {
      note.textContent = 'This browser blocked the download. Use “Copy my progress as text” and paste the text into a file.';
    }
  });
  copyBtn.addEventListener('click', () => copyText(progressText(), copyBtn));
  let waiting = null;
  const offer = text => {
    const file = readProgress(text);
    ask.textContent = '';
    if (!file) { ask.append(h('p', {class: 'callout careful', text: 'This is not a progress file from this site. Nothing was changed.'})); return; }
    waiting = file;
    const yes = h('button', {type: 'button', class: 'btn small primary', text: 'Load it'});
    const no = h('button', {type: 'button', class: 'btn small', text: 'Cancel'});
    yes.addEventListener('click', () => loadProgress(waiting));
    no.addEventListener('click', () => { ask.textContent = ''; waiting = null; });
    ask.append(h('div', {class: 'callout careful'},
      h('b', {text: 'Replace the progress in this browser?'}),
      h('p', {text: 'The file was saved on ' + (file.saved || 'an unknown date') + ' and holds ' + Object.keys(file.data).length +
        ' saved things. Loading it replaces everything this browser has saved for this site.'}),
      h('p', {class: 'btnrow'}, yes, no)));
  };
  pick.addEventListener('change', () => {
    const f = pick.files && pick.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => offer(String(reader.result));
    reader.readAsText(f);
  });
  $('#load-text-go').addEventListener('click', () => offer($('#load-text').value));
  $('#print-record').addEventListener('click', () => window.print());
  $$('[data-print]').forEach(b => b.addEventListener('click', () => window.print()));
}
