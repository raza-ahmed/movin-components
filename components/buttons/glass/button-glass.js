function initBtnGlass(root) {
  var pane = root.querySelector('.btn-glass__pane');
  var lights = root.querySelectorAll('.btn-glass__light');
  if (!pane || lights.length < 3) return;
  // Resting orbits for the three lights (centre offsets in px, radius, speed).
  var ORBITS = [
    { cx: -50, cy: -10, r: 26, s: 0.5 },
    { cx: 46, cy: 14, r: 22, s: -0.7 },
    { cx: 0, cy: 22, r: 30, s: 0.35 },
  ];
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pos = ORBITS.map(function () { return { x: root.clientWidth / 2, y: root.clientHeight / 2 }; });
  var pointer = null;
  var raf = 0;

  function tick(now) {
    var t = now / 1000;
    var w = root.clientWidth;
    var h = root.clientHeight;
    ORBITS.forEach(function (o, i) {
      var home = { x: w / 2 + o.cx + Math.cos(t * o.s + i) * o.r, y: h / 2 + o.cy + Math.sin(t * o.s * 1.3 + i) * o.r * 0.6 };
      // Each light gathers toward the cursor, staggered so they arrive one after another.
      var target = pointer ? { x: home.x * 0.35 + pointer.x * 0.65, y: home.y * 0.35 + pointer.y * 0.65 } : home;
      var k = 0.04 + i * 0.02;
      pos[i].x += (target.x - pos[i].x) * k;
      pos[i].y += (target.y - pos[i].y) * k;
      lights[i].style.transform = 'translate(' + pos[i].x.toFixed(1) + 'px, ' + pos[i].y.toFixed(1) + 'px)';
    });
    if (!still) raf = requestAnimationFrame(tick);
  }

  function move(e) {
    var r = root.getBoundingClientRect();
    pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    var b = pane.getBoundingClientRect();
    pane.style.setProperty('--hx', e.clientX - b.left + 'px');
    pane.style.setProperty('--hy', e.clientY - b.top + 'px');
  }
  function leave() { pointer = null; }
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  raf = requestAnimationFrame(tick);

  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
  };
}

document.querySelectorAll('.btn-glass').forEach(initBtnGlass);
