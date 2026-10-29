function initCardRoute(root) {
  var paths = root.querySelectorAll('svg path');
  var car = root.querySelector('.card-route__car');
  var eta = root.querySelector('.card-route__panel b');
  var badge = root.querySelector('.card-route__go');
  var line = root.querySelector('.card-route__path');
  var path = paths[paths.length - 1];
  if (!car || !eta || !badge || !line || !path) return;
  var LOOP = 5200; // ms: drive 3.8 s, arrive, hold, reset
  var len = path.getTotalLength();
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var start = performance.now();
  var raf = 0;
  function tick(now) {
    var u = Math.min(1, ((now - start) % LOOP) / 3800);
    var e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; // ease in-out
    var pt = path.getPointAtLength(e * len);
    car.setAttribute('cx', pt.x.toFixed(1));
    car.setAttribute('cy', pt.y.toFixed(1));
    // The route ahead stays bright; what is driven fades back.
    line.style.strokeDashoffset = String(-e);
    var m = Math.max(0, Math.ceil(12 * (1 - e)));
    eta.textContent = m === 0 ? 'Arrived' : m + ' min';
    badge.textContent = m === 0 ? 'Done' : 'Live';
    root.setAttribute('aria-label', 'Route to Studio, ' + m + ' minutes');
    if (!still) raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  return function () { cancelAnimationFrame(raf); };
}

document.querySelectorAll('.card-route').forEach(initCardRoute);
