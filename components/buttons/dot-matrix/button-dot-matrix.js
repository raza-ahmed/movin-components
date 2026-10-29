function initBtnDotMatrix(root) {
  var dots = root.querySelectorAll('.btn-dot-matrix__dot');
  if (!dots.length) return;
  // 5x7 glyphs, one string of five bits per row.
  var FONT = {
    A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
    C: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
    H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
    L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
    N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
    U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
    '>': ['01000', '00100', '00010', '00001', '00010', '00100', '01000'],
    ' ': ['000', '000', '000', '000', '000', '000', '000'],
  };
  function columns(text) {
    var cols = [];
    text.split('').forEach(function (ch) {
      var g = FONT[ch];
      for (var c = 0; c < g[0].length; c++) cols.push(g.map(function (row) { return row[c] === '1'; }));
      cols.push([false, false, false, false, false, false, false]);
    });
    return cols;
  }
  var VISIBLE = 37;
  var WORD = columns('LAUNCH');
  var LOOP = columns('LAUNCH >> ');
  var PAD = Math.floor((VISIBLE - WORD.length + 1) / 2);
  var timer = 0;

  // At rest: the word, centred. Scrolling: the looped message from `offset`.
  function paint(offset) {
    for (var r = 0; r < 7; r++) {
      for (var c = 0; c < VISIBLE; c++) {
        var on = offset === null ? !!(WORD[c - PAD] && WORD[c - PAD][r]) : LOOP[(c + offset) % LOOP.length][r];
        dots[r * VISIBLE + c].toggleAttribute('data-on', on);
      }
    }
  }
  function start() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearInterval(timer);
    // Start where the resting word already sits, so the first frame doesn't jump.
    var o = (LOOP.length - PAD) % LOOP.length;
    paint(o);
    timer = setInterval(function () { paint((o = (o + 1) % LOOP.length)); }, 70);
  }
  function stop() {
    clearInterval(timer);
    paint(null);
  }
  root.addEventListener('pointerenter', start);
  root.addEventListener('pointerleave', stop);
  root.addEventListener('focus', start);
  root.addEventListener('blur', stop);

  return function () {
    clearInterval(timer);
    root.removeEventListener('pointerenter', start);
    root.removeEventListener('pointerleave', stop);
    root.removeEventListener('focus', start);
    root.removeEventListener('blur', stop);
  };
}

document.querySelectorAll('.btn-dot-matrix').forEach(initBtnDotMatrix);
