function initSliderFoam(root) {
  var W = 240;
  var N = 121;
  var TOP = 30;
  var BOT = 50;
  var T = 18;
  var SIGMA = 9;
  var input = root.querySelector('.slider-foam__input');
  var surfaces = root.querySelectorAll('.slider-foam__surface');
  var done = root.querySelector('#slider-foam-done rect');
  var puck = root.querySelector('.slider-foam__puck');
  var ring = root.querySelector('.slider-foam__ring');
  var label = root.querySelector('.slider-foam__value b');
  var x = at(+input.value);
  var vx = 0;
  var goal = x;
  var held = false;
  var on = false;
  var raf = 0;
  var mem = [];
  for (var i = 0; i < N; i++) mem.push(dentAt(i, x, 5));
  function at(v) { return 10 + (v / 100) * (W - 20); }
  function dentAt(i, cx, depth) { return depth * Math.exp(-Math.pow(i * 2 - cx, 2) / (2 * SIGMA * SIGMA)); }
  function draw() {
    var d = 'M 0 ' + (TOP + mem[0]);
    for (var i = 1; i < N; i++) d += ' L ' + i * 2 + ' ' + (TOP + mem[i]).toFixed(2);
    d += ' L ' + W + ' ' + BOT + ' L 0 ' + BOT + ' Z';
    surfaces.forEach(function (s) { s.setAttribute('d', d); });
    done.setAttribute('width', x);
    var cy = TOP + mem[Math.round(Math.min(W, Math.max(0, x)) / 2)] - T / 2 + 1;
    [puck, ring].forEach(function (c) {
      c.setAttribute('cx', x);
      c.setAttribute('cy', cy);
    });
  }
  // Memory foam: the dent under the puck is pressed in at once, but where the puck has been it creeps back up.
  function kick() {
    if (on) return;
    var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    on = true;
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      if (still) {
        x = goal;
        vx = 0;
      } else {
        vx += (-160 * (x - goal) - 24 * vx) * dt;
        x += vx * dt;
      }
      var depth = held ? 8 : 5;
      var fade = still ? 0 : Math.exp(-dt / 0.8);
      var busy = Math.abs(x - goal) > 0.05 || Math.abs(vx) > 0.5;
      for (var i = 0; i < N; i++) {
        var dent = dentAt(i, x, depth);
        mem[i] = Math.max(dent, mem[i] * fade);
        if (mem[i] - dent > 0.03) busy = true;
      }
      draw();
      if (busy) raf = requestAnimationFrame(step);
      else on = false;
    }
    raf = requestAnimationFrame(step);
  }
  function update() {
    goal = at(+input.value);
    label.textContent = input.value + '%';
    input.setAttribute('aria-valuetext', input.value + '%');
    kick();
  }
  function down() {
    held = true;
    kick();
  }
  function up() {
    held = false;
    kick();
  }
  input.addEventListener('input', update);
  input.addEventListener('pointerdown', down);
  input.addEventListener('pointerup', up);
  input.addEventListener('pointercancel', up);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', update);
    input.removeEventListener('pointerdown', down);
    input.removeEventListener('pointerup', up);
    input.removeEventListener('pointercancel', up);
  };
}

document.querySelectorAll('.slider-foam').forEach(initSliderFoam);
