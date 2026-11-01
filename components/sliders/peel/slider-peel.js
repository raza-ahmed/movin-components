function initSliderPeel(root) {
  var W = 240;
  var MID = 22;
  var H = 18;
  var REST = 16;
  var NS = 'http://www.w3.org/2000/svg';
  var input = root.querySelector('.slider-peel__input');
  var svg = root.querySelector('.slider-peel__svg');
  var tape = root.querySelector('.slider-peel__tape');
  var flap = root.querySelector('.slider-peel__flap');
  var sheen = flap.nextElementSibling;
  var crease = root.querySelector('.slider-peel__crease');
  var ring = root.querySelector('.slider-peel__ring');
  var label = root.querySelector('.slider-peel__value b');
  var top = MID - H / 2 - 1.5;
  var bot = MID + H / 2 + 1.5;
  // Crepe paper: faint, uneven creases across the strip, enough for a full-length tape.
  root.querySelectorAll('.slider-peel__crepe').forEach(function (l) { l.remove(); });
  var crepe = [];
  for (var i = 0; i * 3.5 + 6 < W; i++) {
    var l = document.createElementNS(NS, 'line');
    l.setAttribute('class', 'slider-peel__crepe');
    l.setAttribute('x1', 6 + i * 3.5);
    l.setAttribute('x2', 6.6 + i * 3.5);
    l.setAttribute('y1', MID - H / 2 + 1);
    l.setAttribute('y2', MID + H / 2 - 1);
    l.style.opacity = [0.22, 0.1, 0.16, 0.07, 0.13][i % 5];
    svg.insertBefore(l, flap);
    crepe.push(l);
  }
  var q = { x: target(), v: 0, lift: 0, lv: 0 };
  var raf = 0;
  function target() { return 28 + (+input.value / 100) * (W - 30); }
  // Torn ends: a short zigzag rather than a clean cut.
  function tear(x, y0, y1, dir) {
    var pts = [];
    for (var i = 0; i < 7; i++) pts.push(x + dir * (i % 2 ? 2.2 : 0) + ',' + (y0 + (i * (y1 - y0)) / 6));
    return pts.join('L');
  }

  function draw() {
    var x = q.x;
    // The flap is the tape folded back over itself from the fold at x; its free end is what you hold.
    var flapLen = Math.max(4, Math.min(x - 3, REST + q.lift));
    var end = x - flapLen;
    var d = 'M' + (x - 4) + ',' + top + 'Q' + x + ',' + top + ' ' + x + ',' + (top + 4) + 'L' + x + ',' + (bot - 4) + 'Q' + x + ',' + bot + ' ' + (x - 4) + ',' + bot + 'L' + tear(end, bot, top, 1) + 'Z';
    var lift = Math.max(0, q.lift);
    tape.setAttribute('d', 'M' + tear(3, MID - H / 2, MID + H / 2, -1) + 'L' + x + ',' + (MID + H / 2) + 'L' + x + ',' + (MID - H / 2) + 'Z');
    crepe.forEach(function (l, i) { l.style.display = 6 + i * 3.5 < x - 3 ? '' : 'none'; });
    flap.setAttribute('d', d);
    // The lifted flap casts a shadow that grows as it lifts.
    flap.style.filter = 'drop-shadow(' + (-2 - q.lift * 0.15) + 'px ' + (2.5 + lift * 0.12) + 'px ' + (2.5 + lift * 0.1) + 'px light-dark(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.7)))';
    sheen.setAttribute('d', d);
    crease.setAttribute('x1', x - 0.5);
    crease.setAttribute('x2', x - 0.5);
    ring.setAttribute('x', end - 4);
    ring.setAttribute('width', flapLen + 8);
  }
  // The fold trails the value; pulling back (negative speed) lifts the flap, pressing forward lays it flatter.
  function run() {
    cancelAnimationFrame(raf);
    label.textContent = input.value + '%';
    input.setAttribute('aria-valuetext', input.value + '%');
    var goal = target();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q = { x: goal, v: 0, lift: 0, lv: 0 };
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-260 * (q.x - goal) - 30 * q.v) * dt;
      q.x += q.v * dt;
      var want = Math.max(-6, Math.min(26, -q.v * 0.07));
      q.lv += (-240 * (q.lift - want) - 16 * q.lv) * dt;
      q.lift += q.lv * dt;
      if (Math.abs(q.x - goal) < 0.05 && Math.abs(q.v) < 1 && Math.abs(q.lift) < 0.05 && Math.abs(q.lv) < 0.5) {
        q = { x: goal, v: 0, lift: 0, lv: 0 };
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  input.addEventListener('input', run);
  draw();
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', run);
  };
}

document.querySelectorAll('.slider-peel').forEach(initSliderPeel);
