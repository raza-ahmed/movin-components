function initCardPeel(root) {
  var sticker = root.querySelector('.card-peel__sticker');
  var corner = root.querySelector('.card-peel__corner');
  var shadow = root.querySelector('.card-peel__flap-shadow');
  if (!sticker || !corner || !shadow) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAD = 200; // the flap box overhangs the card by this much on every side
  var w = 0;
  var h = 0;
  var p = { x: 0, y: 0 }; // where the sticker's bottom-right corner is now
  var goal = { x: 0, y: 0 };
  var dragging = false;
  var off = false; // fully peeled
  var raf = 0;

  // Keep the part of polygon `pts` where side(x, y) <= 0 (one half-plane).
  function cut(pts, side) {
    var out = [];
    for (var i = 0; i < pts.length; i++) {
      var a = pts[i];
      var b = pts[(i + 1) % pts.length];
      var sa = side(a);
      var sb = side(b);
      if (sa <= 0) out.push(a);
      if ((sa < 0 && sb > 0) || (sa > 0 && sb < 0)) {
        var t = sa / (sa - sb);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }
    return out;
  }

  function poly(pts, dx, dy) {
    return 'polygon(' + pts.map(function (q) { return (q[0] + dx).toFixed(1) + 'px ' + (q[1] + dy).toFixed(1) + 'px'; }).join(',') + ')';
  }

  function draw() {
    var cx = w - p.x;
    var cy = h - p.y;
    var len = Math.sqrt(cx * cx + cy * cy);
    if (len < 0.5) {
      root.style.removeProperty('--card-peel-clip');
      root.style.removeProperty('--card-peel-flap');
      return;
    }
    // The fold is the perpendicular bisector of corner -> p.
    var nx = cx / len;
    var ny = cy / len;
    var mx = (w + p.x) / 2;
    var my = (h + p.y) / 2;
    var rect = [[0, 0], [w, 0], [w, h], [0, h]];
    var keep = cut(rect, function (q) { return (q[0] - mx) * nx + (q[1] - my) * ny; });
    var gone = cut(rect, function (q) { return -((q[0] - mx) * nx + (q[1] - my) * ny); });
    var flap = gone.map(function (q) {
      var d = (q[0] - mx) * nx + (q[1] - my) * ny;
      return [q[0] - 2 * d * nx, q[1] - 2 * d * ny];
    });
    root.style.setProperty('--card-peel-clip', keep.length ? poly(keep, 0, 0) : 'polygon(0 0, 0 0, 0 0)');
    root.style.setProperty('--card-peel-flap', poly(flap, PAD, PAD));
    // Lit from the fold: the underside darkens toward the crease.
    root.style.setProperty('--card-peel-angle', ((Math.atan2(-ny, -nx) * 180) / Math.PI + 90).toFixed(1) + 'deg');
  }

  function tick() {
    var k = dragging ? 0.5 : 0.18;
    p.x += (goal.x - p.x) * k;
    p.y += (goal.y - p.y) * k;
    draw();
    if (Math.abs(goal.x - p.x) + Math.abs(goal.y - p.y) > 0.3) raf = requestAnimationFrame(tick);
    else {
      p.x = goal.x;
      p.y = goal.y;
      draw();
      raf = 0;
    }
  }

  function aim(x, y) {
    goal.x = x;
    goal.y = y;
    if (reduce) {
      p.x = x;
      p.y = y;
      return draw();
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function rest() {
    aim(w, h);
  }

  function peelOff() {
    off = true;
    corner.setAttribute('aria-pressed', 'true');
    corner.setAttribute('aria-label', 'Stick the sticker back');
    shadow.style.transition = 'opacity 0.5s 0.15s';
    shadow.style.opacity = '0';
    aim(-w * 1.06, -h * 1.06); // fold line just past the far corner: nothing left stuck
  }

  function stickBack() {
    off = false;
    corner.setAttribute('aria-pressed', 'false');
    corner.setAttribute('aria-label', 'Peel the sticker off');
    shadow.style.transition = 'opacity 0.25s';
    shadow.style.opacity = '';
    rest();
  }

  function local(e) {
    var box = root.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  }

  var moved = false;
  function down(e) {
    if (off) return;
    dragging = true;
    moved = false;
    corner.setPointerCapture(e.pointerId);
  }
  function move(e) {
    if (!dragging) return;
    var at = local(e);
    moved = moved || Math.abs(at.x - w) + Math.abs(at.y - h) > 6;
    aim(Math.max(-w * 0.6, Math.min(w, at.x)), Math.max(-h * 0.6, Math.min(h, at.y)));
  }
  function up() {
    if (!dragging) return;
    dragging = false;
    var dx = w - goal.x;
    var dy = h - goal.y;
    // Past ~60% of the diagonal it comes off; otherwise it settles back.
    if (Math.sqrt(dx * dx + dy * dy) > 0.6 * Math.sqrt(w * w + h * h)) peelOff();
    else hover();
  }
  function click() {
    if (moved) {
      moved = false;
      return;
    }
    if (off) stickBack();
    else peelOff();
  }
  // Hovering near the corner lifts it a little: an invitation to pull.
  function hover() {
    if (!off && !dragging) aim(w - 18, h - 14);
  }
  function leave() {
    if (!off && !dragging) rest();
  }

  function measure() {
    w = root.offsetWidth;
    h = root.offsetHeight;
    if (!off && !dragging) {
      p.x = goal.x = w;
      p.y = goal.y = h;
    }
    draw();
  }

  var ro = new ResizeObserver(measure);
  ro.observe(root);
  measure();
  corner.addEventListener('pointerdown', down);
  corner.addEventListener('pointermove', move);
  corner.addEventListener('pointerup', up);
  corner.addEventListener('pointercancel', up);
  corner.addEventListener('click', click);
  root.addEventListener('pointerenter', hover);
  root.addEventListener('pointerleave', leave);

  return function () {
    ro.disconnect();
    cancelAnimationFrame(raf);
    corner.removeEventListener('pointerdown', down);
    corner.removeEventListener('pointermove', move);
    corner.removeEventListener('pointerup', up);
    corner.removeEventListener('pointercancel', up);
    corner.removeEventListener('click', click);
    root.removeEventListener('pointerenter', hover);
    root.removeEventListener('pointerleave', leave);
    root.style.removeProperty('--card-peel-clip');
    root.style.removeProperty('--card-peel-flap');
    shadow.style.opacity = '';
  };
}

document.querySelectorAll('.card-peel').forEach(initCardPeel);
