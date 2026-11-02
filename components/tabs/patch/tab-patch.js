function initTabsPatch(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var COL = 240 / n;
  var JACK_Y = 36;
  var SOCKET = { x: 120, y: 112 };
  var N = 15;
  var SEG = 9.2;
  var G = 0.3;
  var wire = root.querySelector('.tabs-patch__cord');
  var plug = root.querySelector('.tabs-patch__plug');
  var raf = 0;
  function jack(i) { return { x: i * COL + COL / 2, y: JACK_Y }; }
  // A cord of N links (verlet): each point keeps its own momentum, gravity pulls it down, and a few
  // passes of length constraints keep the links a fixed length. Both ends are held: the switchboard
  // socket and the plug.
  function simulate(p, end) {
    for (var i = 1; i < N; i++) {
      var q = p[i];
      var vx = (q.x - q.px) * 0.97;
      var vy = (q.y - q.py) * 0.97;
      q.px = q.x;
      q.py = q.y;
      q.x += vx;
      q.y += vy + G;
    }
    for (var k = 0; k < 10; k++) {
      p[0].x = SOCKET.x;
      p[0].y = SOCKET.y;
      p[N].x = end.x;
      p[N].y = end.y;
      for (var j = 0; j < N; j++) {
        var a = p[j];
        var b = p[j + 1];
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var d = Math.hypot(dx, dy) || 1;
        var f = (d - SEG) / d / 2;
        if (j > 0) {
          a.x += dx * f;
          a.y += dy * f;
        }
        if (j < N - 1) {
          b.x -= dx * f;
          b.y -= dy * f;
        }
      }
    }
  }
  // The cord hanging still from a jack: start it straight and let it settle.
  function cord(end) {
    var p = [];
    for (var i = 0; i <= N; i++) {
      var x = SOCKET.x + ((end.x - SOCKET.x) * i) / N;
      var y = SOCKET.y + ((end.y - SOCKET.y) * i) / N;
      p.push({ x: x, y: y, px: x, py: y });
    }
    for (var k = 0; k < 400; k++) simulate(p, end);
    return p;
  }
  function draw(p) {
    var d = 'M' + p[0].x.toFixed(1) + ' ' + p[0].y.toFixed(1);
    for (var i = 1; i < N; i++) d += 'Q' + p[i].x.toFixed(1) + ' ' + p[i].y.toFixed(1) + ' ' + ((p[i].x + p[i + 1].x) / 2).toFixed(1) + ' ' + ((p[i].y + p[i + 1].y) / 2).toFixed(1);
    wire.setAttribute('d', d + 'L' + p[N].x.toFixed(1) + ' ' + p[N].y.toFixed(1));
    var a = p[N];
    var b = p[N - 2];
    var len = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    plug.setAttribute('x1', a.x);
    plug.setAttribute('y1', a.y);
    plug.setAttribute('x2', a.x + ((b.x - a.x) / len) * 9);
    plug.setAttribute('y2', a.y + ((b.y - a.y) / len) * 9);
  }
  var pts = cord(jack(sel));
  // Moving the call: the plug lifts out, arcs over to the new jack and pushes in, and the cord
  // swings after it until it hangs still again.
  function move(from, to) {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pts = cord(to);
      return draw(pts);
    }
    var t0 = performance.now();
    var still = 0;
    function sum() { return pts.reduce(function (acc, q) { return acc + q.x + q.y; }, 0); }
    function step(now) {
      var k = Math.min(1, (now - t0) / 600);
      var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      var before = sum();
      simulate(pts, { x: from.x + (to.x - from.x) * e, y: JACK_Y - Math.sin(k * Math.PI) * 18 });
      draw(pts);
      still = k === 1 && Math.abs(sum() - before) < 0.05 ? still + 1 : 0;
      if (still < 10 && now - t0 < 4000) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }

  function select(i) {
    if (i === sel) return;
    var prev = sel;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    move(jack(prev), jack(i));
  }
  function onClick(e) {
    var tab = e.target.closest('[role="tab"]');
    if (tab) select(tabs.indexOf(tab));
  }
  function onKeyDown(e) {
    var next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabs[next].focus();
  }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  draw(pts);
  return function () {
    cancelAnimationFrame(raf);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-patch').forEach(initTabsPatch);
