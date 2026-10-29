function initFieldExtrude(root) {
  var word = root.querySelector('.field-extrude__word');
  var probe = root.querySelector('.field-extrude__probe');
  var input = root.querySelector('.field-extrude__input');
  if (!word || !probe || !input) return;
  var layers = word.children;
  var depth = layers[0];
  var DEPTH = 12;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ptr = null;
  var t = { x: 0, y: 0 };
  var raf = 0;
  var value = input.value;
  function rgb(c) { return (c.match(/[\d.]+/g) || ['0', '0', '0']).slice(0, 3).map(Number); }

  function tick(now) {
    // Tilt toward the pointer; with no pointer, sway slowly on its own.
    var tx = ptr ? (ptr.x - 0.5) * 2 : still ? 0.3 : Math.sin(now / 1400) * 0.6;
    var ty = ptr ? (ptr.y - 0.5) * 2 : still ? -0.3 : Math.cos(now / 1900) * 0.35;
    t.x += (tx - t.x) * 0.12;
    t.y += (ty - t.y) * 0.12;
    var near = rgb(getComputedStyle(probe.children[0]).color);
    var far = rgb(getComputedStyle(probe.children[1]).color);
    // The extrusion runs away from the viewer, so it always shows on the side you're looking from.
    var shadows = [];
    for (var i = 0; i < DEPTH; i++) {
      var k = (i + 1) / DEPTH;
      var c = near.map(function (v, j) { return Math.round(v + (far[j] - v) * k); });
      shadows.push((-t.x * (i + 1) * 0.9).toFixed(1) + 'px ' + (-t.y * (i + 1) * 0.9 + (i + 1) * 0.4).toFixed(1) + 'px 0 rgb(' + c.join(',') + ')');
    }
    depth.style.textShadow = shadows.join(',');
    word.style.transform = 'rotateY(' + (t.x * 18).toFixed(2) + 'deg) rotateX(' + (-t.y * 14).toFixed(2) + 'deg)';
    raf = requestAnimationFrame(tick);
  }
  // Letters keyed by position and character: only a changed one pops in, on both layers.
  function change() {
    var next = input.value;
    Array.prototype.forEach.call(layers, function (layer) {
      var spans = layer.children;
      while (spans.length > next.length) layer.lastChild.remove();
      next.split('').forEach(function (c, i) {
        if (spans[i] && value[i] === c) return;
        var s = document.createElement('span');
        s.className = 'field-extrude__ch';
        s.textContent = c;
        if (spans[i]) spans[i].replaceWith(s);
        else layer.appendChild(s);
      });
    });
    value = next;
  }
  function move(e) {
    var r = root.getBoundingClientRect();
    ptr = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }
  function leave() { ptr = null; }
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  input.addEventListener('input', change);
  raf = requestAnimationFrame(tick);
  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    input.removeEventListener('input', change);
  };
}

document.querySelectorAll('.field-extrude').forEach(initFieldExtrude);
