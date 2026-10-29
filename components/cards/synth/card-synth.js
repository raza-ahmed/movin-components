function initCardSynth(root) {
  var wave = root.querySelector('.card-synth__wave');
  var knobs = root.querySelectorAll('.card-synth__knob');
  var reads = root.querySelectorAll('.card-synth__value');
  if (!wave || knobs.length !== 2 || reads.length !== 2) return;
  var W = 212;
  var H = 70;
  var SHAPES = ['Sine', 'Triangle', 'Square', 'Saw'];
  var values = [0.35, 0.2]; // freq, shape
  var formats = [
    function (v) { return Math.round(110 * Math.pow(2, v * 3)) + ' Hz'; },
    function (v) { return SHAPES[Math.round(v * 3)]; },
  ];
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = 0;

  function draw(now) {
    var f = values[0];
    var s = values[1];
    var cycles = 1 + f * 6;
    var phase = still ? 0 : now / 400;
    var d = '';
    for (var i = 0; i <= 120; i++) {
      var u = i / 120;
      var x = (u * cycles + phase) % 1;
      // Shape morphs sine, triangle, square, saw as the knob turns.
      var sine = Math.sin(x * Math.PI * 2);
      var tri = 1 - 4 * Math.abs(x - 0.5);
      var sq = x < 0.5 ? 1 : -1;
      var saw = 2 * x - 1;
      var k = s * 3;
      var seg = Math.min(2, Math.floor(k));
      var t = k - seg;
      var pair = [[sine, -tri], [-tri, sq], [sq, saw]][seg];
      var y = pair[0] * (1 - t) + pair[1] * t;
      d += (i ? 'L' : 'M') + (u * W).toFixed(1) + ' ' + (H / 2 - y * 24).toFixed(1);
    }
    wave.setAttribute('d', d);
    if (!still) raf = requestAnimationFrame(draw);
  }

  function set(n, v) {
    values[n] = Math.min(1, Math.max(0, v));
    var knob = knobs[n];
    knob.style.transform = 'rotate(' + (-135 + values[n] * 270) + 'deg)';
    knob.setAttribute('aria-valuenow', String(Math.round(values[n] * 100)));
    knob.setAttribute('aria-valuetext', formats[n](values[n]));
    reads[n].textContent = formats[n](values[n]);
    if (still) draw(0);
  }

  // A knob: drag up or down (or use the arrow keys) to turn it through 270 degrees.
  var cleanups = [];
  knobs.forEach(function (knob, n) {
    var drag = null;
    function down(e) {
      knob.setPointerCapture(e.pointerId);
      drag = { y: e.clientY, v: values[n] };
    }
    function move(e) {
      if (drag) set(n, drag.v + (drag.y - e.clientY) / 120);
    }
    function up() { drag = null; }
    function key(e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') set(n, values[n] + 0.05);
      if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') set(n, values[n] - 0.05);
    }
    knob.addEventListener('pointerdown', down);
    knob.addEventListener('pointermove', move);
    knob.addEventListener('pointerup', up);
    knob.addEventListener('keydown', key);
    cleanups.push(function () {
      knob.removeEventListener('pointerdown', down);
      knob.removeEventListener('pointermove', move);
      knob.removeEventListener('pointerup', up);
      knob.removeEventListener('keydown', key);
    });
  });
  raf = requestAnimationFrame(draw);

  return function () {
    cancelAnimationFrame(raf);
    cleanups.forEach(function (c) { c(); });
  };
}

document.querySelectorAll('.card-synth').forEach(initCardSynth);
