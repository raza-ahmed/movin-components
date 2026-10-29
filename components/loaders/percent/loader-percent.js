function initLoaderPercent(root) {
  var bar = root.querySelector('.loader-percent__bar');
  var value = root.querySelector('.loader-percent__value');
  var done = root.querySelector('.loader-percent__done');
  if (!bar || !value || !done) return;
  // Progress (0-1) against time (s): a quick start, a long slow middle, a stall near the end, then the rest at once.
  var KEYS = [[0, 0], [0.5, 0.34], [1.6, 0.62], [2.2, 0.71], [3.1, 0.74], [3.5, 1]];
  var DONE = 3.5;
  var HOLD = 1.1;
  function at(t) {
    for (var i = 1; i < KEYS.length; i++) {
      if (t <= KEYS[i][0]) {
        var u = (t - KEYS[i - 1][0]) / (KEYS[i][0] - KEYS[i - 1][0]);
        return KEYS[i - 1][1] + (KEYS[i][1] - KEYS[i - 1][1]) * (1 - (1 - u) * (1 - u));
      }
    }
    return 1;
  }
  function show(p) {
    var pct = Math.round(p * 100);
    var finished = pct >= 100;
    bar.style.strokeDashoffset = String(1 - p);
    value.firstChild.textContent = String(pct);
    value.style.opacity = finished ? '0' : '1';
    done.style.strokeDashoffset = finished ? '0' : '1';
    done.style.opacity = finished ? '1' : '0';
    root.setAttribute('aria-valuenow', String(pct));
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    show(0.6);
    return;
  }
  var start = performance.now();
  var raf = 0;
  function tick(now) {
    var t = (now - start) / 1000;
    if (t > DONE + HOLD) {
      start = now;
      t = 0;
    }
    show(at(t));
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  return function () { cancelAnimationFrame(raf); };
}

document.querySelectorAll('.loader-percent').forEach(initLoaderPercent);
