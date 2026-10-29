function initBtnTesla(root) {
  var svg = root.querySelector('.btn-tesla__arcs');
  var btn = root.querySelector('.btn-tesla__btn');
  var nodes = root.querySelectorAll('.btn-tesla__node');
  if (!svg || !btn || nodes.length < 2) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var NS = 'http://www.w3.org/2000/svg';
  var L = { x: 38, y: 73 };
  var R = { x: 222, y: 73 };
  var live = false;
  var burst = 0;
  var idle = 0;
  var group = document.createElementNS(NS, 'g');
  svg.insertBefore(group, svg.firstChild);

  // A jagged bolt from a to b, bowed over the top of the button by `lift` px.
  function bolt(a, b, lift, jitter) {
    var n = 16;
    var cx = (a.x + b.x) / 2;
    var cy = Math.min(a.y, b.y) - lift;
    var d = 'M' + a.x + ' ' + a.y;
    for (var i = 1; i < n; i++) {
      var t = i / n;
      var x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cx + t * t * b.x;
      var y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cy + t * t * b.y;
      var k = Math.sin(t * Math.PI) * jitter;
      d += ' L' + (x + (Math.random() - 0.5) * k).toFixed(1) + ' ' + (y + (Math.random() - 0.5) * k * 1.4).toFixed(1);
    }
    return d + ' L' + b.x + ' ' + b.y;
  }

  function draw(arcs) {
    group.textContent = '';
    arcs.forEach(function (d, i) {
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('class', 'btn-tesla__arc' + (i % 2 ? ' btn-tesla__arc--faint' : ''));
      group.appendChild(p);
    });
    nodes[0].toggleAttribute('data-live', arcs.length > 0);
    nodes[1].toggleAttribute('data-live', arcs.length > 1);
  }

  var timer = setInterval(function () {
    if (performance.now() < burst) {
      draw([bolt(L, R, 104, 30), bolt(L, R, 90, 34), bolt(L, R, 122, 24), bolt(L, R, 78, 22)]);
    } else if (live) {
      draw([bolt(L, R, 100, 20), bolt(L, R, 92, 28)]);
    } else {
      // At rest: an occasional short crackle off the left electrode.
      idle += 1;
      draw(idle % 36 < 2 ? [bolt(L, { x: L.x + 22 + Math.random() * 14, y: L.y - 26 }, 6, 10)] : []);
    }
  }, 55);

  function on() { live = true; }
  function off() { live = false; }
  function discharge() {
    burst = performance.now() + 380;
    // Off, then on next frame, so back-to-back clicks restart the flash.
    btn.removeAttribute('data-flash');
    requestAnimationFrame(function () { btn.setAttribute('data-flash', ''); });
  }
  function ended() { btn.removeAttribute('data-flash'); }
  root.addEventListener('pointerenter', on);
  root.addEventListener('pointerleave', off);
  btn.addEventListener('focus', on);
  btn.addEventListener('blur', off);
  btn.addEventListener('click', discharge);
  btn.addEventListener('animationend', ended);

  return function () {
    clearInterval(timer);
    group.remove();
    root.removeEventListener('pointerenter', on);
    root.removeEventListener('pointerleave', off);
    btn.removeEventListener('focus', on);
    btn.removeEventListener('blur', off);
    btn.removeEventListener('click', discharge);
    btn.removeEventListener('animationend', ended);
  };
}

document.querySelectorAll('.btn-tesla').forEach(initBtnTesla);
