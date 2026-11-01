function initSliderStrand(root) {
  var W = 240;
  var MID = 22;
  var BOUND = 1.75;
  var LOOSE = 3.9;
  var input = root.querySelector('.slider-strand__input');
  var loose = root.querySelectorAll('.slider-strand__loose');
  var bound = root.querySelectorAll('.slider-strand__bound');
  var ring = root.querySelector('.slider-strand__ring');
  var focus = root.querySelector('.slider-strand__focus');
  var label = root.querySelector('.slider-strand__value b');
  var N = loose.length;
  var q = { t: target(), v: 0, amp: 0, phase: 0 };
  var raf = 0;
  function target() { return 7 + (+input.value / 100) * (W - 14); }
  function smooth(a, b, x) {
    var t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  function draw() {
    var t = q.t;
    for (var i = 0; i < N; i++) {
      var o = i - (N - 1) / 2;
      var y = function (x) {
        // Bound behind the ring, fanning out to loose over the next 40px, held again at the far end.
        var spread = BOUND + (LOOSE - BOUND) * smooth(t, t + 40, x) * (1 - smooth(W - 26, W, x) * 0.55);
        var env = x > t ? Math.sin((Math.PI * (x - t)) / Math.max(1, W - t)) : 0;
        return MID + o * spread + q.amp * env * Math.sin((x - t) / 11 - q.phase + i * 0.9);
      };
      var pts = function (a, b) {
        var out = [];
        for (var x = a; x < b; x += 3) out.push(x.toFixed(1) + ',' + y(x).toFixed(2));
        out.push(b.toFixed(1) + ',' + y(b).toFixed(2));
        return 'M' + out.join('L');
      };
      loose[i].setAttribute('d', pts(t, W - 0.5));
      bound[i].setAttribute('d', pts(0.5, t));
    }
    ring.setAttribute('x', t - 4);
    focus.setAttribute('x', t - 8);
  }
  // Moving the ring sets the slack strands rippling away from it; the ripple dies down after it stops.
  function run() {
    cancelAnimationFrame(raf);
    var goal = target();
    label.textContent = input.value + '%';
    input.setAttribute('aria-valuetext', input.value + '%');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.t = goal;
      q.v = 0;
      q.amp = 0;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-240 * (q.t - goal) - 28 * q.v) * dt;
      q.t += q.v * dt;
      q.amp = Math.max(q.amp * Math.exp(-dt * 2.6), Math.min(3.4, Math.abs(q.v) * 0.012));
      q.phase += dt * 9;
      if (Math.abs(q.t - goal) < 0.05 && Math.abs(q.v) < 0.5 && q.amp < 0.03) {
        q.t = goal;
        q.v = 0;
        q.amp = 0;
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  input.addEventListener('input', run);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', run);
  };
}

document.querySelectorAll('.slider-strand').forEach(initSliderStrand);
