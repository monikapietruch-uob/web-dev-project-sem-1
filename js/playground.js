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
  // Two funnier pictures for the Images task (her note of 27 November, 22:04): a cat asleep on a laptop keyboard,
  // and somebody asleep on a sofa under a blanket, below a REVISION PLAN. campus.jpg and robot.jpg stay, for code saved earlier.
  ASSETS['images/cat.jpg'] = uri(
    '<rect width="480" height="300" fill="#f3ead8"/>' +
    '<rect y="236" width="480" height="64" fill="#8a5a35"/>' +
    '<rect x="118" y="44" width="244" height="160" rx="10" fill="#14213d"/>' +
    '<rect x="132" y="58" width="216" height="130" fill="#0b1a2e"/>' +
    '<text x="144" y="88" font-family="monospace" font-size="17" font-weight="700" fill="#8ee36b">kkkkkkkkkkkkkkkkkkk</text>' +
    '<text x="144" y="114" font-family="monospace" font-size="17" font-weight="700" fill="#8ee36b">jjjjjjj;;;;;;;;;;;;</text>' +
    '<text x="144" y="140" font-family="monospace" font-size="17" font-weight="700" fill="#8ee36b">mmmmmmmmmmmmmmmmmm</text>' +
    '<text x="144" y="166" font-family="monospace" font-size="17" font-weight="700" fill="#8ee36b">8888888888888888888</text>' +
    '<path d="M98 204 H382 L408 240 H72 Z" fill="#c9ccd6"/>' +
    '<path d="M150 214 C 104 222, 86 250, 100 296" stroke="#e08a2e" stroke-width="18" fill="none" stroke-linecap="round"/>' +
    '<path d="M100 270 C 96 280, 98 288, 100 296" stroke="#b8400f" stroke-width="18" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="236" cy="214" rx="104" ry="32" fill="#e08a2e"/>' +
    '<path d="M180 186 C 186 200, 186 222, 180 240" stroke="#b8400f" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    '<path d="M212 183 C 218 200, 218 224, 212 244" stroke="#b8400f" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    '<path d="M244 183 C 250 200, 250 224, 244 244" stroke="#b8400f" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    '<path d="M276 186 C 282 200, 282 222, 276 240" stroke="#b8400f" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="200" cy="238" rx="20" ry="9" fill="#f2b469"/>' +
    '<ellipse cx="262" cy="240" rx="20" ry="9" fill="#f2b469"/>' +
    '<path d="M318 184 L322 150 L344 174 Z" fill="#e08a2e"/>' +
    '<path d="M362 172 L384 148 L388 184 Z" fill="#e08a2e"/>' +
    '<path d="M324 178 L326 160 L338 174 Z" fill="#f2a5b8"/>' +
    '<path d="M366 172 L380 158 L382 178 Z" fill="#f2a5b8"/>' +
    '<circle cx="352" cy="204" r="36" fill="#e08a2e"/>' +
    '<path d="M330 202 q8 7 16 0" stroke="#14213d" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
    '<path d="M358 202 q8 7 16 0" stroke="#14213d" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
    '<path d="M347 214 l5 5 l5 -5 z" fill="#a1286e"/>' +
    '<path d="M312 216 l-22 -3 M312 222 l-22 3 M392 216 l22 -3 M392 222 l22 3" stroke="#14213d" stroke-width="2" stroke-linecap="round"/>' +
    '<text x="396" y="150" font-family="sans-serif" font-size="24" font-weight="700" fill="#1857c9">z</text>' +
    '<text x="416" y="118" font-family="sans-serif" font-size="32" font-weight="700" fill="#1857c9">z</text>' +
    '<text x="440" y="80" font-family="sans-serif" font-size="42" font-weight="700" fill="#1857c9">Z</text>');
  ASSETS['images/sofa.jpg'] = uri(
    '<rect width="480" height="300" fill="#dfe7f2"/>' +
    '<rect x="330" y="30" width="110" height="80" fill="#f4f5f9" stroke="#8b93a8" stroke-width="4"/>' +
    '<text x="345" y="66" font-family="sans-serif" font-size="15" font-weight="700" fill="#14213d">REVISION</text>' +
    '<text x="345" y="88" font-family="sans-serif" font-size="15" font-weight="700" fill="#14213d">PLAN</text>' +
    '<rect y="252" width="480" height="48" fill="#b98b5e"/>' +
    '<rect x="56" y="104" width="368" height="96" rx="28" fill="#00727a"/>' +
    '<rect x="44" y="168" width="392" height="72" rx="22" fill="#0a8a93"/>' +
    '<rect x="28" y="146" width="58" height="100" rx="24" fill="#00626a"/>' +
    '<rect x="394" y="146" width="58" height="100" rx="24" fill="#00626a"/>' +
    '<rect x="66" y="240" width="16" height="16" fill="#3b2a1a"/>' +
    '<rect x="398" y="240" width="16" height="16" fill="#3b2a1a"/>' +
    '<circle cx="108" cy="160" r="24" fill="#5a3b22"/>' +
    '<path d="M86 196 C 120 112, 300 112, 372 196 Z" fill="#a1286e"/>' +
    '<path d="M150 150 C 200 136, 260 136, 316 152" stroke="#ffb020" stroke-width="8" fill="none"/>' +
    '<path d="M122 176 C 190 160, 280 160, 350 178" stroke="#ffb020" stroke-width="8" fill="none"/>' +
    '<rect x="364" y="166" width="34" height="15" rx="7" fill="#ffb020"/>' +
    '<rect x="364" y="183" width="34" height="15" rx="7" fill="#1857c9"/>' +
    '<rect x="372" y="183" width="6" height="15" fill="#f4f5f9"/>' +
    '<rect x="384" y="183" width="6" height="15" fill="#f4f5f9"/>' +
    '<path d="M300 268 h76 l10 14 h-96 z" fill="#c9ccd6"/>' +
    '<rect x="304" y="228" width="68" height="42" rx="4" fill="#14213d"/>' +
    '<rect x="310" y="234" width="56" height="30" fill="#5aa9ff"/>' +
    '<text x="315" y="253" font-family="sans-serif" font-size="10" font-weight="700" fill="#14213d">Episode 7</text>' +
    '<rect x="200" y="246" width="22" height="24" rx="3" fill="#f4f5f9"/>' +
    '<path d="M222 252 q10 6 0 12" stroke="#f4f5f9" stroke-width="4" fill="none"/>' +
    '<text x="140" y="96" font-family="sans-serif" font-size="24" font-weight="700" fill="#1857c9">z</text>' +
    '<text x="118" y="66" font-family="sans-serif" font-size="32" font-weight="700" fill="#1857c9">z</text>' +
    '<text x="90" y="30" font-family="sans-serif" font-size="40" font-weight="700" fill="#1857c9">Z</text>');
  // Two funny places to study, in place of the library and the cat in the Images practice (her note of 27 November, 22:52).
  // bus.jpg: the top deck of a bus. Houses fly past the window, the laptop jumps (BUMP!) and the coffee leaves its cup.
  ASSETS['images/bus.jpg'] = uri(
    '<rect width="480" height="300" fill="#efe6d3"/>' +
    '<rect x="150" y="6" width="190" height="24" rx="4" fill="#14213d"/>' +
    '<text x="158" y="22" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#ffb020">NEXT STOP: UNIVERSITY SQUARE</text>' +
    '<rect x="20" y="40" width="440" height="120" rx="12" fill="#cfe6f5" stroke="#8b93a8" stroke-width="6"/>' +
    '<rect x="23" y="146" width="434" height="11" fill="#7fae6a"/>' +
    '<rect x="40" y="100" width="60" height="46" fill="#b8400f"/><path d="M34 100 L70 74 L106 100 Z" fill="#14213d"/>' +
    '<rect x="124" y="92" width="70" height="54" fill="#f4f5f9"/><path d="M118 92 L159 64 L200 92 Z" fill="#a1286e"/>' +
    '<rect x="152" y="118" width="14" height="28" fill="#1857c9"/>' +
    '<rect x="220" y="106" width="56" height="40" fill="#2a7230"/><path d="M214 106 L248 84 L282 106 Z" fill="#7d6000"/>' +
    '<circle cx="318" cy="108" r="24" fill="#2a7230"/><rect x="314" y="126" width="8" height="20" fill="#7d6000"/>' +
    '<rect x="356" y="96" width="80" height="50" fill="#7d6000"/><path d="M350 96 L396 70 L442 96 Z" fill="#b8400f"/>' +
    '<path d="M44 62 h70 M196 56 h90 M330 64 h96 M120 74 h40" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity=".9"/>' +
    '<rect y="280" width="480" height="20" fill="#4a5672"/>' +
    '<rect x="34" y="176" width="186" height="84" rx="18" fill="#1857c9"/>' +
    '<rect x="262" y="176" width="186" height="84" rx="18" fill="#1857c9"/>' +
    '<path d="M60 194 l7 7 l-7 7 l-7 -7 z M200 194 l7 7 l-7 7 l-7 -7 z M284 196 l7 7 l-7 7 l-7 -7 z M428 194 l7 7 l-7 7 l-7 -7 z" fill="#ffb020"/>' +
    '<circle cx="186" cy="246" r="4" fill="#a1286e"/><circle cx="300" cy="246" r="4" fill="#a1286e"/><circle cx="420" cy="232" r="4" fill="#a1286e"/>' +
    '<rect x="24" y="250" width="206" height="34" rx="12" fill="#14213d"/>' +
    '<rect x="252" y="250" width="206" height="34" rx="12" fill="#14213d"/>' +
    '<rect x="236" y="34" width="10" height="246" fill="#ffb020"/>' +
    '<rect x="223" y="172" width="36" height="20" rx="4" fill="#c8102e"/>' +
    '<text x="228" y="186" font-family="sans-serif" font-size="10" font-weight="700" fill="#ffffff">STOP</text>' +
    '<path d="M70 232 h100 l6 8 h-112 z" fill="#c9ccd6"/>' +
    '<rect x="78" y="176" width="86" height="56" rx="4" fill="#14213d"/>' +
    '<rect x="84" y="182" width="74" height="44" fill="#5aa9ff"/>' +
    '<text x="90" y="200" font-family="sans-serif" font-size="10" font-weight="700" fill="#14213d">essay.docx</text>' +
    '<text x="90" y="216" font-family="sans-serif" font-size="10" fill="#14213d">3 words</text>' +
    '<path d="M80 246 q6 -4 12 0 M150 246 q6 -4 12 0" stroke="#ffb020" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<text x="168" y="174" font-family="sans-serif" font-size="20" font-weight="800" fill="#c8102e">BUMP!</text>' +
    '<g transform="rotate(-28 352 230)"><path d="M338 210 l6 34 h20 l6 -34 z" fill="#f4f5f9"/><rect x="335" y="204" width="38" height="8" rx="3" fill="#b8400f"/></g>' +
    '<path d="M330 200 C 334 170, 368 160, 392 186" stroke="#6b4a2b" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    '<circle cx="320" cy="182" r="5" fill="#6b4a2b"/><circle cx="364" cy="152" r="6" fill="#6b4a2b"/><circle cx="404" cy="170" r="5" fill="#6b4a2b"/>');
  // kitchen.jpg: a standing desk that is really an ironing board. The iron steams, the washing-up has become a tower,
  // and a note on the wall says WASH UP!!
  ASSETS['images/kitchen.jpg'] = uri(
    '<rect width="480" height="300" fill="#dfeee0"/>' +
    '<rect y="112" width="480" height="64" fill="#f4f5f9"/>' +
    '<path d="M0 128 h480 M0 144 h480 M0 160 h480 M32 112 v64 M64 112 v64 M96 112 v64 M128 112 v64 M160 112 v64 M192 112 v64 M224 112 v64 M256 112 v64 M288 112 v64 M320 112 v64 M352 112 v64 M384 112 v64 M416 112 v64 M448 112 v64" stroke="#c9ccd6" stroke-width="1.5"/>' +
    '<rect x="180" y="30" width="62" height="50" fill="#ffe36e" transform="rotate(-6 211 55)"/>' +
    '<text x="190" y="52" font-family="sans-serif" font-size="13" font-weight="800" fill="#14213d" transform="rotate(-6 211 55)">WASH</text>' +
    '<text x="190" y="70" font-family="sans-serif" font-size="13" font-weight="800" fill="#c8102e" transform="rotate(-6 211 55)">UP!!</text>' +
    '<rect y="172" width="214" height="128" fill="#b98b5e"/>' +
    '<rect y="166" width="218" height="12" fill="#8a6a3a"/>' +
    '<path d="M150 166 v-28 h22 v8" stroke="#8b93a8" stroke-width="6" fill="none"/>' +
    '<rect x="35" y="160" width="92" height="8" rx="4" fill="#f4f5f9" stroke="#8b93a8" stroke-width="1"/>' +
    '<rect x="40" y="150" width="92" height="8" rx="4" fill="#c9ccd6" stroke="#8b93a8" stroke-width="1"/>' +
    '<rect x="45" y="140" width="92" height="8" rx="4" fill="#f4f5f9" stroke="#8b93a8" stroke-width="1"/>' +
    '<rect x="35" y="130" width="92" height="8" rx="4" fill="#c9ccd6" stroke="#8b93a8" stroke-width="1"/>' +
    '<rect x="40" y="120" width="92" height="8" rx="4" fill="#f4f5f9" stroke="#8b93a8" stroke-width="1"/>' +
    '<rect x="45" y="110" width="92" height="8" rx="4" fill="#c9ccd6" stroke="#8b93a8" stroke-width="1"/>' +
    '<rect x="35" y="100" width="92" height="8" rx="4" fill="#f4f5f9" stroke="#8b93a8" stroke-width="1"/>' +
    '<rect x="40" y="90" width="92" height="8" rx="4" fill="#c9ccd6" stroke="#8b93a8" stroke-width="1"/>' +
    '<rect x="45" y="80" width="92" height="8" rx="4" fill="#f4f5f9" stroke="#8b93a8" stroke-width="1"/>' +
    '<rect x="35" y="70" width="92" height="8" rx="4" fill="#c9ccd6" stroke="#8b93a8" stroke-width="1"/>' +
    '<rect x="40" y="60" width="92" height="8" rx="4" fill="#f4f5f9" stroke="#8b93a8" stroke-width="1"/>' +
    '<rect x="45" y="50" width="92" height="8" rx="4" fill="#c9ccd6" stroke="#8b93a8" stroke-width="1"/>' +
    '<rect x="62" y="30" width="22" height="20" rx="3" fill="#c8102e"/>' +
    '<path d="M84 34 q10 6 0 12" stroke="#c8102e" stroke-width="4" fill="none"/>' +
    '<path d="M244 286 L404 176 M404 286 L244 176" stroke="#8b93a8" stroke-width="7" stroke-linecap="round"/>' +
    '<rect x="232" y="282" width="26" height="8" rx="3" fill="#4a5672"/><rect x="392" y="282" width="26" height="8" rx="3" fill="#4a5672"/>' +
    '<path d="M222 152 H412 C 442 152, 462 158, 468 164 C 462 170, 442 176, 412 176 H222 Z" fill="#a1286e"/>' +
    '<path d="M240 158 h160 M240 170 h160" stroke="#ffb020" stroke-width="3" stroke-dasharray="10 8"/>' +
    '<path d="M268 146 h100 l6 6 h-112 z" fill="#c9ccd6"/>' +
    '<rect x="276" y="88" width="86" height="58" rx="4" fill="#14213d"/>' +
    '<rect x="282" y="94" width="74" height="46" fill="#5aa9ff"/>' +
    '<text x="287" y="112" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#14213d">essay_final</text>' +
    '<text x="287" y="128" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#14213d">FINAL_2.docx</text>' +
    '<path d="M398 152 L452 152 Q458 130 432 124 L406 124 Q398 124 396 134 Z" fill="#1857c9"/>' +
    '<path d="M408 124 Q422 104 440 124" stroke="#14213d" stroke-width="6" fill="none"/>' +
    '<path d="M416 98 q-6 -8 0 -16 q6 -8 0 -16 M432 98 q-6 -8 0 -16 q6 -8 0 -16 M448 100 q-6 -8 0 -16 q6 -8 0 -16" stroke="#8b93a8" stroke-width="3" fill="none" stroke-linecap="round"/>');
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
// "state" is what the page is like at that moment: its HTML without the scripts (so new text, a class
// that was added or a hidden attribute that was taken away all count), the classes on <body> and the
// two main colours. It is read from the code of the page, not from the screen, so it is the same
// whether or not the browser has drawn the result yet.
const REPORTER = '<script>(function(){var send=function(t,d){parent.postMessage({p2p:t,data:d},"*")};' +
  'var state=function(){var b=document.body;if(!b){return""}var c=b.cloneNode(true),j=c.querySelectorAll("script,style"),i;' +
  'for(i=0;i<j.length;i++){j[i].parentNode.removeChild(j[i])}var s=getComputedStyle(b);' +
  'return c.innerHTML.replace(/\\s+/g," ")+"\\u0001"+b.className+"\\u0001"+s.backgroundColor+"\\u0001"+s.color};' +
  'window.addEventListener("error",function(e){send("error",(e.message||"Error")+(e.lineno?" (line "+e.lineno+")":""))});' +
  'window.addEventListener("load",function(){send("ready",state())});' +
  'document.addEventListener("click",function(e){var b=e.target&&e.target.closest?e.target.closest("button"):null;' +
  'if(b){setTimeout(function(){send("click",state())},40)}});' +
  'document.addEventListener("submit",function(){setTimeout(function(){send("submit",state())},40)})})();<\/script>';

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

// "In the browser": a small picture of the page that a piece of code makes.
// In the task:  <div class="codelook"> <pre class="code">the code</pre> <div class="look" data-look="what it shows, in words"></div> </div>
// The picture is drawn from the code in the <pre>, so the two can never disagree.
// Two more things are possible, both written in red like a note on a handout:
//   data-tab-note="words"                       a note under the tab, with an arrow that points up at it
//   data-mark="h1" data-mark-note="words"       a note under the first <h1> on the small page, with an arrow that points up at it (any CSS selector works)
const PEN_CSS = '.pv-note{display:flex;align-items:center;gap:8px;margin:3px 0 0 12px;font:700 13px/1.3 system-ui,sans-serif;letter-spacing:0;color:#c4161c}' +
  '.pv-note::before{content:"";flex:none;width:16px;height:22px;background:#c4161c;clip-path:polygon(33% 100%,33% 44%,0 44%,50% 0,100% 44%,67% 44%,67% 100%)}';
function initLooks() {
  $$('[data-look]').forEach(box => {
    const pre = box.previousElementSibling;
    if (!pre) return;
    // data-html: draw this HTML in place of the code (a README shows what GitHub makes of its Markdown).
    // Red pen notes in the code (span.pen-note) are for the reader, so they are left out of the picture.
    const code = pre.cloneNode(true);
    $$('.pen-note', code).forEach(note => note.remove());
    const d = box.dataset, html = d.html || code.textContent, title = /<title>([^<]*)<\/title>/i.exec(html), bar = d.bar || 'In the browser';
    const page = h('div', {class: 'look-page'});
    const tab = title ? h('span', {class: 'look-tab', text: title[1]}) : null;
    if (tab && d.tabNote) { tab.append(h('span', {class: 'pen-note up', text: d.tabNote})); page.classList.add('has-tabnote'); }
    box.append(h('p', {class: 'look-bar'}, h('span', {text: bar}), tab), page);
    renderShadow(page, {html: html, css: 'img{max-width:100%;height:auto}' + (d.css || '')});   // data-css: extra style for the picture only
    const root = page.firstChild && page.firstChild.shadowRoot, marked = root && d.mark ? root.querySelector(d.mark) : null;
    if (marked && d.markNote) {
      const style = document.createElement('style');
      style.textContent = PEN_CSS;
      root.append(style);
      marked.append(h('span', {class: 'pv-note', text: d.markNote}));
    }
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', bar + ': ' + box.dataset.look);
  });
}

function useFallback() {
  if (FALLBACK) return;
  FALLBACK = true;
  PGS.forEach(pg => { if (pg.built) pg.render(); });
}
document.addEventListener('securitypolicyviolation', e => {
  if (/frame|child/.test(e.violatedDirective || '')) useFallback();
});

// Looks for a tag that is open and never closed, for a closing tag with no opening tag,
// and for CSS brackets that do not match. Gives back null when all is well.
// If not, it gives back: text (the red message), tag, line and kind ('open', 'close' or 'css').
const PAIRS = ['html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'a', 'section', 'header', 'main',
  'footer', 'nav', 'div', 'button', 'strong', 'em', 'figure', 'figcaption', 'script', 'style'];
function findProblem(code) {
  // comments become spaces, so the line numbers stay right
  const html = (code.html || '').replace(COMMENT, m => m.replace(/[^\n]/g, ' '));
  const lineAt = i => html.slice(0, i).split('\n').length;
  for (const tag of PAIRS) {
    const re = new RegExp('<(/?)' + tag + '(\\s[^>]*)?>', 'gi'), open = [];
    let m;
    while ((m = re.exec(html))) {
      if (!m[1]) { open.push(m.index); continue; }      // an opening tag: remember where it is
      if (open.length) { open.pop(); continue; }        // a closing tag: it closes the last one that is open
      return { kind: 'close', tag: tag, lang: 'html', line: lineAt(m.index),
        text: 'Line ' + lineAt(m.index) + ': there is a closing </' + tag + '>, but no <' + tag + '> before it.' };
    }
    if (open.length) return { kind: 'open', tag: tag, lang: 'html', line: lineAt(open[0]),
      text: 'Line ' + lineAt(open[0]) + ': <' + tag + '> is still open. Close it with </' + tag + '>.' };
  }
  const css = code.css || '';
  if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) {
    return { kind: 'css', tag: '', lang: 'css', line: 0, text: 'Check your CSS: the { and } do not match.' };
  }
  return null;
}

// The code of a model answer, with every class in colour: class="card" in the HTML, and .card in the CSS.
// In the CSS only the names in front of a { are coloured, not the numbers and file names inside a rule.
function paintAnswer(text, lang) {
  const code = h('code', {});
  const re = lang === 'css' ? /\.[A-Za-z_][\w-]*(?=[^{}]*\{)/g : /\bclass\s*=\s*"[^"]*"/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    code.append(text.slice(last, m.index), h('span', {class: 'hl', text: m[0]}));
    last = m.index + m[0].length;
  }
  code.append(text.slice(last));
  return code;
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
  this.run = { clicked: false, changed: false, base: null, states: [], submitted: false };
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

// The line numbers beside the code. The line with a problem gets a red mark (this.bad is set in check).
Pg.prototype.lines = function (lang) {
  const count = this.areas[lang].value.split('\n').length, gutter = this.gutters[lang];
  gutter.textContent = '';
  for (let i = 1; i <= count; i++) {
    gutter.append(h('span', {class: this.bad === lang + ':' + i ? 'is-bad' : false, text: String(i)}), '\n');
  }
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
    const nums = h('span', {class: 'pg-nums'});
    const gutter = h('pre', {class: 'pg-gutter', 'aria-hidden': 'true'}, nums);
    const area = h('textarea', {class: 'pg-area', id: pid + '-code', spellcheck: 'false', autocapitalize: 'off',
      autocomplete: 'off', wrap: 'off',
      'aria-label': 'Code for ' + self.files[lang] + '. To leave the editor, press Escape and then Tab.'});
    area.addEventListener('input', () => {
      store.set('pg:' + self.id + ':' + lang, area.value);
      self.lines(lang);
      clearTimeout(self.wait);
      self.wait = setTimeout(() => { if (self.mode === 'live') self.render(); else self.check(); }, 300);
    });
    // The numbers move with the code. They are moved, not scrolled: the column of numbers is exactly
    // as tall as its numbers, so it has nothing to scroll.
    area.addEventListener('scroll', () => { nums.style.transform = 'translateY(' + (-area.scrollTop) + 'px)'; });
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
    self.areas[lang] = area; self.panes[lang] = pane; self.tabEls[lang] = tab; self.gutters[lang] = nums;
  });
  this.hint = h('p', {class: 'pg-hint', role: 'status'});
  edit.append(this.hint);

  // right side: the result
  this.frameBox = h('div', {class: 'pg-frame'});
  this.console = h('p', {class: 'pg-console', role: 'status', hidden: true});
  this.flag = h('b', {class: 'pg-flag', hidden: true, 'aria-hidden': 'true'});
  // the small tab that shows the words of the <title>. It stays hidden when the code has no <title>.
  this.tabName = h('span', {class: 'pg-tabname', hidden: true});
  const bar = h('div', {class: 'pg-outbar'}, h('span', {}, 'Result', this.flag), this.tabName);
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
    answerBox.append(h('h5', {text: self.files[lang] || lang}), h('pre', {class: 'code'}, paintAnswer(self.answer[lang], lang)));
  });
  // Under the code: what to do with it. The words fit an answer of one file or two, an editor with two tabs,
  // and an editor with a Run button.
  const answered = Object.keys(this.answer);
  if (answered.length) {
    const next = h('p', {class: 'pg-next'}, h('b', {text: 'Now copy this code into the editor above. '}));
    if (answered.length > 1) {
      // Two pieces (Mission 13, Classes): say which tab to click first, in the order of the pieces above.
      next.append('Each piece goes into the file with the same name. ');
      answered.forEach((lang, i) => {
        const name = this.files[lang] || lang;
        next.append(i === 0 ? 'First click the tab ' : 'Next, click the tab ', h('b', {text: name}), ' and paste the piece under ' + name + '. ');
      });
    }
    // Two tabs but one answer: name the file, so that nobody pastes CSS into the HTML file.
    else if (this.langs.length > 1) next.append('It goes into the file ', h('b', {text: this.files[answered[0]] || answered[0]}), ', so click that tab first. ');
    next.append(this.mode === 'run' ? 'Then click Run, and look at the result in the small browser next to the editor.' : 'Then look at the result in the small browser next to the editor.');
    answerBox.append(next);
  }
  const answerBtn = h('button', {type: 'button', class: 'btn small', 'aria-expanded': 'false', text: 'Show a model answer'});
  answerBtn.addEventListener('click', () => {
    answerBox.hidden = !answerBox.hidden;
    answerBtn.setAttribute('aria-expanded', answerBox.hidden ? 'false' : 'true');
    answerBtn.textContent = answerBox.hidden ? 'Show a model answer' : 'Hide the model answer';
  });
  // A hint, for editors with two files: the two most common reasons why "nothing happens".
  let tipBtn = null, tipBox = null;
  if (this.langs.indexOf('css') !== -1 && this.langs.indexOf('html') !== -1) {
    tipBox = h('div', {class: 'pg-tip', hidden: true},
      h('p', {}, h('b', {text: 'Your CSS does nothing? '}), 'Check two things.'),
      h('ol', {},
        h('li', {}, 'Click the tab ', h('b', {text: this.files.css}), ' above the editor. CSS goes in that file, not in ' + this.files.html + '.'),
        h('li', {}, 'Click the tab ', h('b', {text: this.files.html}), '. The head needs the line that links the two files: ',
          h('code', {text: '<link rel="stylesheet" href="' + this.files.css + '">'}))));
    tipBtn = h('button', {type: 'button', class: 'btn small', 'aria-expanded': 'false', text: 'Show a hint'});
    tipBtn.addEventListener('click', () => {
      tipBox.hidden = !tipBox.hidden;
      tipBtn.setAttribute('aria-expanded', tipBox.hidden ? 'false' : 'true');
      tipBtn.textContent = tipBox.hidden ? 'Show a hint' : 'Hide the hint';
    });
  }
  const swap = h('button', {type: 'button', class: 'pg-switch', text: 'Result empty? Switch the preview'});
  swap.addEventListener('click', () => { FALLBACK = !FALLBACK; PGS.forEach(pg => { if (pg.built) pg.render(); }); });

  const hasGoals = this.goalEls.length > 0;
  root.append(
    h('div', {class: 'pg-grid'}, edit, out),
    h('div', {class: 'pg-under'}, hasGoals ? h('h4', {text: 'Goals'}) : null, hasGoals ? goals : null, hasGoals ? this.score : null,
      h('div', {class: 'pg-actions'}, reset, tipBtn, Object.keys(this.answer).length ? answerBtn : null, swap),
      tipBox, answerBox));
  this.built = true;
};

Pg.prototype.render = function () {
  const code = this.code(), runs = this.mode === 'run';
  this.console.hidden = true;
  this.run = { clicked: false, changed: false, base: null, states: [], submitted: false };
  if (FALLBACK) {
    renderShadow(this.frameBox, code);
    this.frame = null;
    if (runs) {
      this.console.textContent = 'This preview cannot run JavaScript. Your button will work on your live page.';
      this.console.hidden = false;
    }
  } else {
    const frame = h('iframe', {title: 'Result of your code', sandbox: runs ? 'allow-scripts allow-forms' : ''});
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
  // The browser guesses where an open tag ends, so the result can look right when the code is not finished.
  // So: while a tag is open, a goal that names that tag is not "Done", and the editor says so in red.
  const problem = findProblem(code);
  let need = 0, done = 0;
  (CHECKS[this.goalsName] || []).forEach((goal, i) => {
    let ok = false;
    try { ok = !!goal.f(c); } catch (e) { ok = false; }
    const held = ok && !!problem && !!problem.tag && goal.t.toLowerCase().indexOf('<' + problem.tag + '>') !== -1;
    if (held) ok = false;
    const li = this.goalEls[i];
    li.classList.toggle('is-done', ok);
    li.classList.toggle('is-held', held);
    li.firstChild.textContent = ok ? 'Done' : (held ? (problem.kind === 'open' ? 'Not closed' : 'Check') : (goal.extra ? 'Extra' : 'Not yet'));
    if (!goal.extra) { need++; if (ok) done++; }
  });
  let say = '';
  if (need) say = done < need ? done + ' of ' + need + ' goals done' : (problem ? 'Almost. First fix the red message.' : 'All goals done. Nice work.');
  this.score.textContent = say;
  this.root.classList.toggle('is-complete', need > 0 && done === need && !problem);
  this.root.classList.toggle('has-problem', !!problem);
  // the red message under the editor, with a big exclamation mark
  this.hint.textContent = '';
  if (problem) this.hint.append(h('span', {class: 'pg-bang', 'aria-hidden': 'true', text: '!'}), h('span', {text: problem.text}));
  // the flag above the result
  this.flag.hidden = !problem;
  // The title is not on the page. A browser writes it on the tab, so the editor writes it on a small tab too.
  const named = /<title[^>]*>([^<]*)<\/title>/i.exec(code.html || '');
  this.tabName.hidden = !named;
  if (named) {
    const words = named[1].replace(/\s+/g, ' ').trim();
    this.tabName.textContent = words || 'no title yet';
    this.tabName.classList.toggle('is-empty', !words);
    this.tabName.setAttribute('aria-label', words ? 'The tab of the browser shows the title: ' + words : 'The tab of the browser is empty: the page has no title yet');
  }
  this.flag.textContent = problem ? (problem.kind === 'open' ? 'Not finished' : 'Check your code') : '';
  // the mark on the line number
  const bad = problem && problem.line ? problem.lang + ':' + problem.line : '';
  if (bad !== this.bad) { this.bad = bad; this.langs.forEach(lang => this.lines(lang)); }
};

// Messages from the result window of a JavaScript task.
window.addEventListener('message', e => {
  const d = e.data;
  if (!d || typeof d.p2p !== 'string') return;
  const pg = PGS.find(p => p.frame && p.frame.contentWindow === e.source);
  if (!pg) return;
  if (d.p2p === 'ready') pg.run.base = String(d.data);
  if (d.p2p === 'click' || d.p2p === 'submit') {
    if (d.p2p === 'click') pg.run.clicked = true; else pg.run.submitted = true;
    pg.run.states.push(String(d.data));       // what the page looked like after each click
    if (pg.run.base !== null && String(d.data) !== pg.run.base) pg.run.changed = true;
  }
  if (d.p2p === 'error') { pg.console.textContent = 'The browser says: ' + String(d.data); pg.console.hidden = false; }
  pg.check();
});

function savedCode(id, lang) {
  const pg = PGS.find(p => p.id === id && lang in p.start) || PGS.find(p => p.id === id);
  return pg ? pg.saved(lang) : '';
}
