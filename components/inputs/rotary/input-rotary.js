function initFieldRotary(root) {
  var disc = root.querySelector('.field-rotary__disc');
  var input = root.querySelector('.field-rotary__input');
  if (!disc || !input) return;
  var C = 70;
  var R = 48;
  var STOP = 60; // the finger stop, in degrees clockwise from 3 o'clock
  var DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  // Hole n sits (n + 1) x 30 degrees anticlockwise of the stop, so that is how far it travels to dial.
  function holeAngle(n) { return STOP - (n + 1) * 30; }
  var rot = 0;
  var drag = null;
  var queue = Promise.resolve();
  var number = input.value;

  function turn(r, back) {
    rot = r;
    disc.style.transition = back ? 'transform ' + back + 's cubic-bezier(0.3, 0, 0.6, 1)' : 'none';
    disc.style.transform = 'rotate(' + r + 'deg)';
  }
  // The spring drags it home at a steady governor speed, like the real thing.
  function release(r) { turn(0, Math.max(0.2, (r / 360) * 1.1)); }
  function angleAt(e) {
    var b = disc.getBoundingClientRect();
    return (Math.atan2(e.clientY - b.top - C, e.clientX - b.left - C) * 180) / Math.PI;
  }
  function down(e) {
    var a = angleAt(e);
    var b = disc.getBoundingClientRect();
    var dist = Math.hypot(e.clientX - b.left - C, e.clientY - b.top - C);
    if (dist < R - 13 || dist > R + 13) return;
    // Which hole is under the finger?
    var n = 0;
    for (var i = 0; i < 10; i++) if (Math.abs(((a - holeAngle(i + 1) + 540) % 360) - 180) < 15) n = i + 1;
    if (!n) return;
    disc.setPointerCapture(e.pointerId);
    drag = { n: n, prev: a, rot: 0 };
    turn(0, 0);
  }
  function move(e) {
    if (!drag) return;
    var a = angleAt(e);
    drag.rot = Math.max(0, Math.min((drag.n + 1) * 30, drag.rot + (((a - drag.prev + 540) % 360) - 180)));
    drag.prev = a;
    turn(drag.rot, 0);
  }
  function up() {
    if (!drag) return;
    var d = drag;
    drag = null;
    if (d.rot >= (d.n + 1) * 30 - 6) {
      number = (number + DIGITS[d.n - 1]).slice(0, 14);
      input.value = number;
    }
    release(d.rot);
  }
  // Typing a digit dials it too.
  function autoDial(digit) {
    var n = DIGITS.indexOf(digit) + 1;
    if (!n || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    queue = queue.then(function () {
      return new Promise(function (done) {
        turn((n + 1) * 30, 0.35);
        setTimeout(function () {
          release((n + 1) * 30);
          setTimeout(done, ((n + 1) * 30 * 1.1 * 1000) / 360 + 40);
        }, 380);
      });
    });
  }
  function typed() {
    var v = input.value.replace(/[^\d]/g, '').slice(0, 14);
    if (v.length > number.length) autoDial(v[v.length - 1]);
    number = v;
    input.value = v;
  }
  disc.addEventListener('pointerdown', down);
  disc.addEventListener('pointermove', move);
  disc.addEventListener('pointerup', up);
  input.addEventListener('input', typed);
  return function () {
    disc.removeEventListener('pointerdown', down);
    disc.removeEventListener('pointermove', move);
    disc.removeEventListener('pointerup', up);
    input.removeEventListener('input', typed);
  };
}

document.querySelectorAll('.field-rotary').forEach(initFieldRotary);
