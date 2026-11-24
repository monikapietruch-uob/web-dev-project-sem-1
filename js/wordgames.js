/* =====================================================================
   js/wordgames.js
   Word practice (flashcards and matching) and the symbol gym.
   The words come from the tables of the Word bank, so a new row there
   is in the games at once.
   Uses things from: helpers.js, pages.js, saved.js, playground.js, checks.js, quizzes.js, demos.js, tools.js, practice.js, terminal.js
   ===================================================================== */
'use strict';

const shuffle = list => {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
};
function bankWords() {
  const out = [];
  $$('#words table.words').forEach(table => {
    let hd = table.closest('.tablewrap').previousElementSibling;
    const topic = hd ? hd.textContent.trim() : '';
    $$('tbody tr', table).forEach(tr => {
      const word = tr.cells[0].firstChild.textContent.trim();
      out.push({ word: word, meaning: tr.cells[1].textContent.trim(), example: tr.cells[2].textContent.trim(), topic: topic });
    });
  });
  return out;
}

function initCards() {
  const root = $('#cards');
  if (!root) return;
  const all = bankWords();
  const topics = Array.from(new Set(all.map(w => w.topic)));
  const pickTopic = h('select', {class: 'line', id: 'cards-topic'}, h('option', {value: '', text: 'All topics (' + all.length + ' words)'}));
  topics.forEach(t => pickTopic.append(h('option', {value: t, text: t})));
  const onlyNew = h('input', {type: 'checkbox', id: 'cards-new'});
  const face = h('div', {class: 'card-face'}), count = h('p', {class: 'quiet', role: 'status'});
  const flip = h('button', {type: 'button', class: 'btn small primary', text: 'Show the meaning'});
  const knew = h('button', {type: 'button', class: 'btn small', text: 'I knew it'});
  const notYet = h('button', {type: 'button', class: 'btn small', text: 'Not yet'});
  let pile = [], i = 0, open = false;
  const knows = w => store.get('known:' + w.word) === '1';
  const deal = () => {
    pile = shuffle(all.filter(w => (!pickTopic.value || w.topic === pickTopic.value) && (!onlyNew.checked || !knows(w))));
    i = 0; open = false; paint();
  };
  const paint = () => {
    const w = pile[i];
    face.textContent = '';
    knew.hidden = notYet.hidden = !open || !w;
    flip.hidden = open || !w;
    if (!w) {
      face.append(h('p', {class: 'card-word', text: 'No cards left.'}), h('p', {text: 'You went through the whole pile. Change the topic, or untick the box to see every word again.'}));
      count.textContent = all.filter(knows).length + ' of ' + all.length + ' words marked “I knew it”.';
      return;
    }
    face.append(h('p', {class: 'label', text: w.topic}),
      h('p', {class: 'card-word'}, w.word, ' ', h('button', {type: 'button', class: 'say mini', 'data-say': w.word.replace(/\(.*?\)/g, '').trim(), 'aria-label': 'Hear the word'})));
    if (open) face.append(h('p', {class: 'card-meaning', text: w.meaning}), h('p', {class: 'quiet', text: 'Example: ' + w.example}));
    else face.append(h('p', {class: 'quiet', text: 'Say the meaning aloud, or write it. Then check.'}));
    count.textContent = 'Card ' + (i + 1) + ' of ' + pile.length + '. ' + all.filter(knows).length + ' of ' + all.length + ' words marked “I knew it”.';
  };
  flip.addEventListener('click', () => { open = true; paint(); knew.focus(); });
  const next = yes => { const w = pile[i]; if (yes) store.set('known:' + w.word, '1'); else store.remove('known:' + w.word); i++; open = false; paint(); if (pile[i]) flip.focus(); };
  knew.addEventListener('click', () => next(true));
  notYet.addEventListener('click', () => next(false));
  pickTopic.addEventListener('change', deal);
  onlyNew.addEventListener('change', deal);
  root.append(
    h('div', {class: 'field'}, h('label', {for: 'cards-topic', text: 'Topic'}), pickTopic),
    h('ul', {class: 'ticks'}, h('li', {}, h('label', {for: 'cards-new'}, onlyNew, h('span', {text: 'Only show words that I have not marked “I knew it”'})))),
    face, h('p', {class: 'btnrow'}, flip, knew, notYet), count);
  deal();
}

function initMatch() {
  const root = $('#match');
  if (!root) return;
  const all = bankWords();
  const left = h('div', {class: 'match-col'}), right = h('div', {class: 'match-col'}), status = h('p', {role: 'status', class: 'quiet'});
  const again = h('button', {type: 'button', class: 'btn small', text: 'New round'});
  let chosen = null, found = 0, tries = 0;
  const deal = () => {
    const round = shuffle(all).slice(0, 5);
    left.textContent = ''; right.textContent = ''; chosen = null; found = 0; tries = 0;
    status.textContent = 'Click a word. Then click its meaning.';
    round.forEach(w => {
      const b = h('button', {type: 'button', class: 'match-item', text: w.word});
      b.addEventListener('click', () => {
        $$('.is-picked', left).forEach(x => x.classList.remove('is-picked'));
        b.classList.add('is-picked'); chosen = { w: w, b: b };
      });
      left.append(b);
    });
    shuffle(round).forEach(w => {
      const b = h('button', {type: 'button', class: 'match-item', text: w.meaning});
      b.addEventListener('click', () => {
        if (!chosen) { status.textContent = 'Click a word first.'; return; }
        tries++;
        if (chosen.w === w) {
          b.disabled = chosen.b.disabled = true;
          b.classList.add('is-right'); chosen.b.classList.add('is-right'); chosen.b.classList.remove('is-picked');
          chosen = null; found++;
          status.textContent = found === 5 ? 'All five matched in ' + tries + ' tries. Five is perfect.' : 'Correct. ' + (5 - found) + ' to go.';
        } else {
          status.textContent = 'Not that one. Try another meaning.';
        }
      });
      right.append(b);
    });
  };
  again.addEventListener('click', deal);
  root.append(h('div', {class: 'match'}, left, right), status, h('p', {class: 'btnrow'}, again));
  deal();
}

// Where each symbol is on three keyboards. "uk" = a UK Windows keyboard, "mac" = a British Mac, "us" = a US keyboard.
const SAME = k => ({ uk: k, mac: k, us: k });
const SYMBOLS = [
  { ch: '<', name: 'less than, or opening angle bracket', keys: SAME('Shift + , (comma)') },
  { ch: '>', name: 'greater than, or closing angle bracket', keys: SAME('Shift + . (full stop)') },
  { ch: '/', name: 'forward slash', keys: SAME('the key left of the right Shift') },
  { ch: '\\', name: 'backslash', keys: { uk: 'the key left of Z', mac: 'the key left of Return', us: 'the key above Enter' } },
  { ch: '|', name: 'pipe, or vertical bar', keys: { uk: 'Shift + \\ (left of Z)', mac: 'Shift + \\ (left of Return)', us: 'Shift + \\ (above Enter)' } },
  { ch: '{', name: 'opening curly bracket', keys: SAME('Shift + [') },
  { ch: '}', name: 'closing curly bracket', keys: SAME('Shift + ]') },
  { ch: '[', name: 'opening square bracket', keys: SAME('the key right of P') },
  { ch: ']', name: 'closing square bracket', keys: SAME('two keys right of P') },
  { ch: '(', name: 'opening round bracket', keys: SAME('Shift + 9') },
  { ch: ')', name: 'closing round bracket', keys: SAME('Shift + 0') },
  { ch: '#', name: 'hash', keys: { uk: 'the # key, left of Enter', mac: 'Option (⌥) + 3', us: 'Shift + 3' } },
  { ch: '"', name: 'double quotation mark', keys: { uk: 'Shift + 2', mac: 'Shift + \' (right of ;)', us: 'Shift + \' (right of ;)' } },
  { ch: '\'', name: 'single quotation mark, or apostrophe', keys: SAME('the key two to the right of L') },
  { ch: '@', name: 'at sign', keys: { uk: 'Shift + \' (two keys right of L)', mac: 'Shift + 2', us: 'Shift + 2' } },
  { ch: '`', name: 'backtick', keys: { uk: 'top left, under Esc', mac: 'the key left of Z', us: 'top left, under Esc' } },
  { ch: '~', name: 'tilde', keys: { uk: 'Shift + # (left of Enter)', mac: 'Shift + ` (left of Z)', us: 'Shift + ` (top left)' } },
  { ch: ';', name: 'semicolon', keys: SAME('the key right of L') },
  { ch: ':', name: 'colon', keys: SAME('Shift + ; (right of L)') },
  { ch: '=', name: 'equals sign', keys: SAME('two keys right of 0') },
  { ch: '-', name: 'hyphen', keys: SAME('the key right of 0') },
  { ch: '_', name: 'underscore', keys: SAME('Shift + - (right of 0)') },
  { ch: '!', name: 'exclamation mark', keys: SAME('Shift + 1') },
  { ch: '&', name: 'ampersand', keys: SAME('Shift + 7') },
  { ch: '*', name: 'asterisk, or star', keys: SAME('Shift + 8') },
  { ch: '%', name: 'per cent sign', keys: SAME('Shift + 5') }
];
const GYM_LINES = ['<h1>Robin Vale</h1>', '<a href="index.html">Home</a>', '<img src="images/desk.jpg" alt="My desk">',
  'h1 { color: #14213d; }', '.card { padding: 10px 20px; }', 'body { font-family: Arial, sans-serif; }',
  'const button = document.getElementById("hello");', 'message.textContent = "Hello!";', 'if (count > 3) { stop(); }',
  'git commit -m "Add contact page"', 'https://robin-vale.github.io/my-first-page/', '<li class="done">Buy toner</li>'];

function initGym() {
  const root = $('#gym-root');
  if (!root) return;
  const layout = h('select', {class: 'line', id: 'gym-layout'},
    h('option', {value: 'uk', text: 'UK keyboard (Windows laptop or PC)'}),
    h('option', {value: 'mac', text: 'Mac, British keyboard'}),
    h('option', {value: 'us', text: 'US keyboard'}));
  layout.value = store.get('gym:layout') || 'uk';
  const mode = h('select', {class: 'line', id: 'gym-mode'},
    h('option', {value: 'sym', text: 'Round 1: single symbols (12 of them)'}),
    h('option', {value: 'line', text: 'Round 2: whole lines of code (5 of them)'}));
  const WAIT = 'Press “Start a round”. A symbol appears here, and you type it.';
  const target = h('p', {class: 'gym-target', 'aria-live': 'polite'}), help = h('p', {class: 'gym-help', text: WAIT});
  const input = h('input', {class: 'line gym-in', type: 'text', id: 'gym-in', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false'});
  const status = h('p', {role: 'status', class: 'gym-status'});
  const go = h('button', {type: 'button', class: 'btn small primary', text: 'Start a round'});
  const table = h('tbody');
  let list = [], i = 0, slips = 0, began = 0, running = false;
  const paintTable = () => {
    table.textContent = '';
    SYMBOLS.forEach(s => table.append(h('tr', {}, h('td', {}, h('code', {text: s.ch})), h('td', {text: s.name}), h('td', {text: s.keys[layout.value]}))));
  };
  const show = () => {
    const item = list[i];
    input.value = '';
    if (mode.value === 'sym') {
      target.textContent = item.ch;
      help.textContent = item.name + '. On your keyboard: ' + item.keys[layout.value] + '.';
    } else {
      target.textContent = item;
      help.textContent = 'Type the whole line. Every space and every symbol counts.';
    }
    status.textContent = (mode.value === 'sym' ? 'Symbol ' : 'Line ') + (i + 1) + ' of ' + list.length + '. Slips: ' + slips;
  };
  const finish = () => {
    running = false;
    const secs = Math.round((Date.now() - began) / 1000), key = 'gym:best:' + mode.value;
    const best = Number(store.get(key) || 0);
    if (!best || secs < best) store.set(key, String(secs));
    target.textContent = 'Done';
    help.textContent = '';
    status.textContent = 'Time: ' + secs + ' seconds. Slips: ' + slips + '.' + (best && secs >= best ? ' Your best is ' + best + ' seconds.' : ' That is your best time.');
    go.textContent = 'Start another round';
  };
  go.addEventListener('click', () => {
    list = mode.value === 'sym' ? shuffle(SYMBOLS).slice(0, 12) : shuffle(GYM_LINES).slice(0, 5);
    i = 0; slips = 0; began = Date.now(); running = true;
    show(); input.focus();
  });
  input.addEventListener('input', () => {
    if (!running) return;
    const want = mode.value === 'sym' ? list[i].ch : list[i], got = input.value;
    if (got === want) { i++; if (i >= list.length) { input.value = ''; finish(); } else show(); return; }
    const ok = want.indexOf(got) === 0;
    input.classList.toggle('is-wrong', !ok);
    if (!ok) { slips++; status.textContent = 'Not quite. Check the last key. Slips: ' + slips; if (mode.value === 'sym') input.value = ''; }
  });
  layout.addEventListener('change', () => { store.set('gym:layout', layout.value); paintTable(); if (running) show(); });
  mode.addEventListener('change', () => { running = false; target.textContent = ''; help.textContent = WAIT; status.textContent = ''; go.textContent = 'Start a round'; });
  root.append(
    h('div', {class: 'gym-top'},
      h('div', {class: 'field'}, h('label', {for: 'gym-layout', text: 'My keyboard'}), layout),
      h('div', {class: 'field'}, h('label', {for: 'gym-mode', text: 'Round'}), mode)),
    h('div', {class: 'gym-box'}, target, help,
      h('div', {class: 'field'}, h('label', {for: 'gym-in', text: 'Type it here'}), input), status, h('p', {class: 'btnrow'}, go)),
    h('h2', {text: 'Where is that key?'}),
    h('div', {class: 'tablewrap'}, h('table', {class: 'gym-keys'},
      h('thead', {}, h('tr', {}, h('th', {text: 'Symbol'}), h('th', {text: 'What people call it'}), h('th', {text: 'On the keyboard you chose'}))), table)));
  paintTable();
}

function initWordGames() { initCards(); initMatch(); initGym(); }
