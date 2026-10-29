function initBtnMorse(root) {
  var reel = root.querySelector('.btn-morse__reel');
  var tape = root.querySelector('.btn-morse__tape');
  var lamp = root.querySelector('.btn-morse__lamp');
  if (!reel || !tape || !lamp) return;
  var CODE = { S: '...', E: '.', N: '-.', D: '-..' };
  var U = 6; // px per Morse time unit
  // Marks as [start, length] in units: dot 1, dash 3, 1 between marks, 3 between letters, 7 between words.
  var MARKS = [];
  var at = 0;
  'SEND'.split('').forEach(function (ch) {
    CODE[ch].split('').forEach(function (sym) {
      var len = sym === '.' ? 1 : 3;
      MARKS.push([at, len]);
      at += len + 1;
    });
    at += 2;
  });
  var PERIOD = at + 4;
  var sending = false;
  var pos = -6;
  var last = performance.now();
  var raf = 0;

  function tick(now) {
    var dt = (now - last) / 1000;
    last = now;
    if (sending) pos += dt * 9; // nine units a second
    var p = ((pos % PERIOD) + PERIOD) % PERIOD;
    reel.style.transform = 'translateX(' + (tape.clientWidth / 2 - p * U).toFixed(1) + 'px)';
    lamp.toggleAttribute('data-on', sending && MARKS.some(function (m) { return p >= m[0] && p < m[0] + m[1]; }));
    raf = requestAnimationFrame(tick);
  }
  function on() { sending = !matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function off() { sending = false; }
  root.addEventListener('pointerenter', on);
  root.addEventListener('pointerleave', off);
  root.addEventListener('focus', on);
  root.addEventListener('blur', off);
  raf = requestAnimationFrame(tick);

  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointerenter', on);
    root.removeEventListener('pointerleave', off);
    root.removeEventListener('focus', on);
    root.removeEventListener('blur', off);
  };
}

document.querySelectorAll('.btn-morse').forEach(initBtnMorse);
