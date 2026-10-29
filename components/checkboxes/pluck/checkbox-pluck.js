function initCbPluck(root) {
  var input = root.querySelector('input');
  var path = root.querySelector('.cb-pluck__string');
  if (!input || !path) return;
  // The string runs between two pins. Ticking pulls its middle down into the vertex of a tick;
  // unticking lets go, and it rings across the straight line before it settles.
  var A = [7, 14.5];
  var B = [21.5, 7.5];
  var MID_X = 12;
  var MID_Y = A[1] + ((MID_X - A[0]) * (B[1] - A[1])) / (B[0] - A[0]);
  var PULL = 20 - MID_Y;
  var x = input.checked ? 1 : 0;
  var v = 0;
  var raf = 0;
  function pathAt(t) {
    return 'M' + A[0] + ' ' + A[1] + 'L' + MID_X + ' ' + (MID_Y + t * PULL).toFixed(2) + 'L' + B[0] + ' ' + B[1];
  }
  path.setAttribute('d', pathAt(x));
  function onChange() {
    var target = input.checked ? 1 : 0;
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      x = target;
      v = 0;
      path.setAttribute('d', pathAt(target));
      return;
    }
    // A taut pull when ticking; a loose, ringing release when unticking.
    var k = input.checked ? 520 : 1100;
    var c = input.checked ? 24 : 5;
    var last = performance.now();
    var acc = 0;
    function tick(now) {
      acc += Math.min(0.05, (now - last) / 1000);
      last = now;
      while (acc >= 1 / 240) {
        v += (k * (target - x) - c * v) / 240;
        x += v / 240;
        acc -= 1 / 240;
      }
      if (Math.abs(target - x) > 0.002 || Math.abs(v) > 0.02) {
        path.setAttribute('d', pathAt(x));
        raf = requestAnimationFrame(tick);
      } else {
        x = target;
        v = 0;
        path.setAttribute('d', pathAt(target));
      }
    }
    raf = requestAnimationFrame(tick);
  }
  input.addEventListener('change', onChange);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('change', onChange);
  };
}

document.querySelectorAll('.cb-pluck').forEach(initCbPluck);
