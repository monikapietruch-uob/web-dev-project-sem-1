/* =====================================================================
   The script of the practice puzzle "Find the flag".
   It does one thing: when somebody rings the bell, it writes a line in
   the Console. Visitors never see the Console. Developers always look.
   ===================================================================== */

const bell = document.getElementById('bell');
const bellSays = document.getElementById('bell-says');
let rings = 0;

bell.addEventListener('click', function () {
  rings = rings + 1;

  // This line goes to the Console (Inspect, then the tab Console).
  console.log('Bell number ' + rings + '. Nobody is coming, but here is something for your trouble: flag{the-console-talks}');

  // This line goes on the page, where everybody can see it.
  if (rings === 1) {
    bellSays.textContent = 'Ding. A message has been left for you, in the place where developers look.';
  } else {
    bellSays.textContent = 'Ding, ' + rings + ' times. The message is still in the Console.';
  }
});
