function initFieldTally(root) {
  var board = root.querySelector('.field-tally__board');
  var svg = root.querySelector('.field-tally__board svg');
  var count = root.querySelector('.field-tally__count');
  var hint = root.querySelector('#field-tally-hint') || root.querySelector('.field-tally__foot span');
  var undo = root.querySelector('.field-tally__undo');
  if (!board || !svg || !count || !hint || !undo) return;
  var NS = 'http://www.w3.org/2000/svg';
  var MAX_SHOWN = 30;
  function jitter(n, k) {
    var x = Math.sin(n * 91.7 + k * 13.3) * 43758.5;
    return Math.round((x - Math.floor(x) - 0.5) * 240) / 100;
  }
  // Stroke n of the tally: four uprights, then a slash across them, in groups of five.
  function mark(n) {
    var g = Math.floor(n / 5);
    var k = n % 5;
    var x0 = 18 + g * 36;
    if (k < 4) {
      var x = x0 + k * 7;
      return 'M' + (x + jitter(n, 1)) + ' ' + (22 + jitter(n, 2)) + ' L' + (x + jitter(n, 3)) + ' ' + (56 + jitter(n, 4));
    }
    return 'M' + (x0 - 5) + ' ' + (50 + jitter(n, 5)) + ' L' + (x0 + 27) + ' ' + (28 + jitter(n, 6));
  }
  var n = Number(count.textContent) || 0;
  function render() {
    var empty = svg.querySelector('.field-tally__empty');
    if (n === 0 && !empty) {
      var t = document.createElementNS(NS, 'text');
      t.setAttribute('class', 'field-tally__empty');
      t.setAttribute('x', '120');
      t.setAttribute('y', '44');
      t.setAttribute('text-anchor', 'middle');
      t.textContent = 'Tap to count';
      svg.appendChild(t);
    } else if (n > 0 && empty) empty.remove();
    var marks = svg.querySelectorAll('.field-tally__mark');
    var want = Math.min(n, MAX_SHOWN);
    for (var i = marks.length; i < want; i++) {
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('class', 'field-tally__mark');
      p.setAttribute('d', mark(i));
      p.setAttribute('pathLength', '1');
      svg.appendChild(p);
    }
    for (var j = marks.length - 1; j >= want; j--) marks[j].remove();
    // The number rolls in when it changes.
    count.textContent = '';
    var s = document.createElement('span');
    s.textContent = String(n);
    count.appendChild(s);
    hint.textContent = n > MAX_SHOWN ? 'Board full, still counting' : '';
    undo.disabled = n === 0;
  }
  function add() { n += 1; render(); }
  function back() { n = Math.max(0, n - 1); render(); }
  board.addEventListener('click', add);
  undo.addEventListener('click', back);
  return function () {
    board.removeEventListener('click', add);
    undo.removeEventListener('click', back);
  };
}

document.querySelectorAll('.field-tally').forEach(initFieldTally);
