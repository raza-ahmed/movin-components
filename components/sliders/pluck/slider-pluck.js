function initSliderPluck(root) {
  var W = 240, Y = 34;
  var input = root.querySelector('.slider-pluck__input');
  var on = root.querySelector('.slider-pluck__on');
  var off = root.querySelector('.slider-pluck__off');
  var circles = root.querySelectorAll('.slider-pluck__bead, .slider-pluck__ring');
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // The bead's height on the string as a lightly damped spring: pressing bends it, letting go twangs it.
  var s = { y: 0, vy: 0, target: 0, raf: 0 };
  var y0 = 0;
  function draw() {
    var bx = 20 + (input.value / 100) * (W - 40);
    var by = Y + s.y;
    on.setAttribute('x2', bx);
    on.setAttribute('y2', by);
    off.setAttribute('x1', bx);
    off.setAttribute('y1', by);
    circles.forEach(function (c) {
      c.setAttribute('cx', bx);
      c.setAttribute('cy', by);
    });
  }
  function run() {
    if (still) {
      s.y = s.target;
      draw();
      return;
    }
    if (s.raf) return;
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      for (var i = 0; i < 4; i++) {
        var a = -1200 * (s.y - s.target) - 7 * s.vy;
        s.vy += (a * dt) / 4;
        s.y += (s.vy * dt) / 4;
      }
      if (Math.abs(s.y - s.target) < 0.04 && Math.abs(s.vy) < 0.6) {
        s.y = s.target;
        s.vy = 0;
        s.raf = 0;
        draw();
        return;
      }
      draw();
      s.raf = requestAnimationFrame(step);
    }
    s.raf = requestAnimationFrame(step);
  }
  // Pull up or down while holding to bend the string further.
  function move(e) {
    s.target = Math.max(-16, Math.min(18, 7 + (e.clientY - y0) * 0.8));
    run();
  }
  function up() {
    s.target = 0;
    run();
    removeEventListener('pointermove', move);
    removeEventListener('pointerup', up);
    removeEventListener('pointercancel', up);
  }
  function down(e) {
    y0 = e.clientY;
    s.target = 7;
    run();
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  }
  // A light pluck on every key step.
  function key(e) {
    if (/^Arrow|^Page|^Home$|^End$/.test(e.key) && !still) {
      s.vy += 70;
      run();
    }
  }
  input.addEventListener('input', draw);
  input.addEventListener('pointerdown', down);
  input.addEventListener('keydown', key);
  draw();
  return function () {
    cancelAnimationFrame(s.raf);
    up();
    input.removeEventListener('input', draw);
    input.removeEventListener('pointerdown', down);
    input.removeEventListener('keydown', key);
  };
}

document.querySelectorAll('.slider-pluck').forEach(initSliderPluck);
