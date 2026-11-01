function initSliderThumbwheel(root) {
  var WHEEL = 224;
  var RIDGES = 40;
  var STEP = 360 / RIDGES;
  var PX = 14;
  var MIN = -9;
  var MAX = 9;
  var svg = root.querySelector('.slider-thumbwheel__svg');
  var label = root.querySelector('.slider-thumbwheel__value');
  var pos = +root.getAttribute('aria-valuenow');
  // The stop it is resting on or settling into; while dragging, the stop under the notch.
  var goal = pos;
  var drag = null;
  var raf = 0;
  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
  function value() { return drag ? clamp(Math.round(pos), MIN, MAX) : goal; }
  // Thirds of a stop, the way a camera counts them.
  function ev(n) { return n === 0 ? '0' : (n < 0 ? '−' : '+') + (Math.abs(n) / 3).toFixed(1); }

  function draw() {
    var phi = pos * STEP;
    var out = '';
    for (var i = 0; i < RIDGES; i++) {
      var a = ((((i * STEP + phi) % 360) + 540) % 360) - 180;
      if (Math.abs(a) > 86) continue;
      // Ridges crowd together and darken as the cylinder turns away at either end.
      var c = Math.cos((a * Math.PI) / 180);
      var w = 0.4 + 2.6 * c;
      var x = WHEEL / 2 + (WHEEL / 2) * Math.sin((a * Math.PI) / 180);
      out += '<rect x="' + (x - w / 2) + '" y="2" width="' + w + '" height="22" rx="' + w / 2 +
        '" style="fill: color-mix(in oklab, light-dark(#50535b, #c6c8cd) ' + Math.round(c * 85) + '%, light-dark(#dbdde1, #2e3035))"></rect>';
    }
    svg.innerHTML = out;
    var n = value();
    label.textContent = ev(n) + ' EV';
    root.setAttribute('aria-valuenow', n);
    root.setAttribute('aria-valuetext', ev(n) + ' EV');
    root.style.setProperty('--slider-thumbwheel-at', ((n - MIN) / (MAX - MIN)) * 100 + '%');
  }
  // Lets go into the nearest click stop, the way a detented wheel does.
  function settle(to) {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pos = to;
      return draw();
    }
    var v = 0;
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      v += (-500 * (pos - to) - 32 * v) * dt;
      pos += v * dt;
      if (Math.abs(pos - to) < 0.002 && Math.abs(v) < 0.01) {
        pos = to;
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function down(e) {
    if (e.button !== 0) return;
    cancelAnimationFrame(raf);
    root.setPointerCapture(e.pointerId);
    drag = { x: e.clientX, from: pos };
  }
  function move(e) {
    if (!drag) return;
    // The surface moves with your finger: drag right and the wheel turns up through the stops.
    pos = clamp(drag.from + (e.clientX - drag.x) / PX, MIN - 0.4, MAX + 0.4);
    draw();
  }
  function up() {
    if (!drag) return;
    goal = value();
    drag = null;
    settle(goal);
  }
  function onKeyDown(e) {
    var n = value();
    var next = { ArrowRight: n + 1, ArrowUp: n + 1, ArrowLeft: n - 1, ArrowDown: n - 1, PageUp: n + 3, PageDown: n - 3, Home: MIN, End: MAX }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    goal = clamp(next, MIN, MAX);
    settle(goal);
  }
  root.addEventListener('pointerdown', down);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerup', up);
  root.addEventListener('pointercancel', up);
  root.addEventListener('keydown', onKeyDown);
  draw();
  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointerdown', down);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerup', up);
    root.removeEventListener('pointercancel', up);
    root.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.slider-thumbwheel').forEach(initSliderThumbwheel);
