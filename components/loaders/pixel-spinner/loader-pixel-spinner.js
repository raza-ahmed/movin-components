function initLoaderPixelSpinner(root) {
  var px = root.querySelectorAll('.loader-pixel-spinner__px');
  var N = 11;
  if (px.length !== N * N) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var C = (N - 1) / 2;
  // The ring: every pixel whose centre lies between radius 3.4 and 5.1, ordered by angle.
  var ring = [];
  for (var i = 0; i < N * N; i++) {
    var d = Math.hypot((i % N) - C, Math.floor(i / N) - C);
    if (d > 3.4 && d < 5.1) ring.push(i);
  }
  function ang(i) { return Math.atan2(Math.floor(i / N) - C, (i % N) - C); }
  ring.sort(function (a, b) { return ang(a) - ang(b); });
  var TAIL = 5;
  var head = 0;
  var timer = setInterval(function () {
    head = (head + 1) % ring.length;
    px.forEach(function (p) { p.removeAttribute('data-lit'); });
    // Brightness by distance behind the head: 3 for the head, fading to 1 at the tail.
    for (var k = 0; k < TAIL; k++) {
      px[ring[(head - k + ring.length) % ring.length]].setAttribute('data-lit', k < 2 ? '3' : k < 4 ? '2' : '1');
    }
  }, 55);
  return function () { clearInterval(timer); };
}

document.querySelectorAll('.loader-pixel-spinner').forEach(initLoaderPixelSpinner);
