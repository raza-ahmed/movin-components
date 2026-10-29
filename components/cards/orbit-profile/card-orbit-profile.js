function initCardOrbitProfile(root) {
  var chips = root.querySelectorAll('.card-orbit-profile__chip');
  if (!chips.length) return;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var open = false;
  // Row positions (centre x) for the settled state, laid out from the chips' real widths.
  var widths = Array.prototype.map.call(chips, function (c) { return c.offsetWidth; });
  var total = widths.reduce(function (a, b) { return a + b; }, 0) + 4 * (chips.length - 1);
  var rows = [];
  var x = (root.clientWidth - total) / 2;
  widths.forEach(function (w) {
    rows.push({ x: x + w / 2, y: 158 });
    x += w + 4;
  });
  var mix = 0;
  var angle = 0;
  var last = performance.now();
  var raf = 0;
  function tick(now) {
    var dt = (now - last) / 1000;
    last = now;
    mix += ((open ? 1 : 0) - mix) * Math.min(1, dt * 7);
    if (!still) angle += dt * 0.6 * (1 - mix);
    chips.forEach(function (c, i) {
      var a = angle + (i / chips.length) * Math.PI * 2;
      // Orbit: an ellipse round the avatar; chips behind it shrink and dim.
      var ox = root.clientWidth / 2 + Math.cos(a) * 75;
      var oy = 74 + Math.sin(a) * 37;
      var depth = (Math.sin(a) + 1) / 2;
      var px = ox + (rows[i].x - ox) * mix;
      var py = oy + (rows[i].y - oy) * mix;
      var s = (0.8 + depth * 0.25) * (1 - mix) + mix;
      c.style.transform = 'translate(' + (px - widths[i] / 2).toFixed(1) + 'px, ' + (py - 10).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
      c.style.opacity = String((0.55 + depth * 0.45) * (1 - mix) + mix);
      c.style.zIndex = depth > 0.5 || mix > 0.5 ? '2' : '0';
    });
    raf = requestAnimationFrame(tick);
  }
  function set(v) {
    open = v;
    root.toggleAttribute('data-open', v);
  }
  function on() { set(true); }
  function off() { set(false); }
  root.addEventListener('pointerenter', on);
  root.addEventListener('pointerleave', off);
  root.addEventListener('focus', on);
  root.addEventListener('blur', off);
  raf = requestAnimationFrame(tick);
  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointerenter', on);
    root.removeEventListener('pointerleave', off);
    root.removeEventListener('focus', on);
    root.removeEventListener('blur', off);
  };
}

document.querySelectorAll('.card-orbit-profile').forEach(initCardOrbitProfile);
