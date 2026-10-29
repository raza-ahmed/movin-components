function initLoaderPlasmaGlobe(root) {
  var core = root.querySelector('.loader-plasma-globe__core');
  if (!core) return;
  var NS = 'http://www.w3.org/2000/svg';
  var C = { x: 54, y: 54 };
  var R = 44;
  var group = document.createElementNS(NS, 'g');
  root.insertBefore(group, core);

  // A wandering filament from the core to a point on the glass at angle a.
  function filament(a) {
    var end = { x: C.x + Math.cos(a) * (R - 1), y: C.y + Math.sin(a) * (R - 1) };
    var d = 'M' + C.x + ' ' + C.y;
    for (var i = 1; i < 10; i++) {
      var t = i / 10;
      // Sideways wander, strongest mid-way and growing toward the glass.
      var k = Math.sin(t * Math.PI) * 6 + t * 2;
      var off = (Math.random() - 0.5) * 2 * k;
      d += ' L' + (C.x + (end.x - C.x) * t - Math.sin(a) * off).toFixed(1) + ' ' + (C.y + (end.y - C.y) * t + Math.cos(a) * off).toFixed(1);
    }
    return { d: d + ' L' + end.x.toFixed(1) + ' ' + end.y.toFixed(1), end: end };
  }

  // Each filament's foot drifts round the glass at its own pace.
  var feet = [0.3, 1.5, 2.6, 3.9, 5.1].map(function (a, i) { return { a: a, v: (i % 2 ? -1 : 1) * (0.25 + i * 0.07) }; });
  var last = performance.now();
  function step() {
    var now = performance.now();
    var dt = (now - last) / 1000;
    last = now;
    group.textContent = '';
    feet.forEach(function (f) {
      f.a += f.v * dt + (Math.random() - 0.5) * 0.05;
      var b = filament(f.a);
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('class', 'loader-plasma-globe__bolt');
      path.setAttribute('d', b.d);
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('class', 'loader-plasma-globe__strike');
      dot.setAttribute('cx', b.end.x.toFixed(1));
      dot.setAttribute('cy', b.end.y.toFixed(1));
      dot.setAttribute('r', '1.6');
      group.appendChild(path);
      group.appendChild(dot);
    });
  }
  step();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var timer = setInterval(step, 70);
  return function () {
    clearInterval(timer);
    group.remove();
  };
}

document.querySelectorAll('.loader-plasma-globe').forEach(initLoaderPlasmaGlobe);
