function initCardInkReveal(root) {
  var ink = root.querySelector('.card-ink-reveal__face--ink');
  var mask = root.querySelector('mask');
  var filter = root.querySelector('filter');
  var group = root.querySelector('.card-ink-reveal__blobs');
  if (!ink || !mask || !filter || !group) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // SVG ids are page-global: give this copy its own so two cards never share a mask.
  var n = (initCardInkReveal.count = (initCardInkReveal.count || 0) + 1);
  mask.id = 'card-ink-reveal-mask-' + n;
  filter.id = 'card-ink-reveal-goo-' + n;
  group.setAttribute('filter', 'url(#' + filter.id + ')');
  ink.style.mask = ink.style.webkitMask = 'url(#' + mask.id + ')';

  var circles = Array.prototype.slice.call(group.querySelectorAll('circle'));
  var SIZES = [30, 24, 19, 15, 11, 8]; // head, then a tapering tail
  var blobs = circles.map(function () {
    return { x: 0, y: 0, r: 0 };
  });
  var target = { x: 0, y: 0 };
  var inside = false;
  var flood = false;
  var raf = 0;

  function draw() {
    blobs.forEach(function (b, i) {
      circles[i].setAttribute('cx', b.x.toFixed(1));
      circles[i].setAttribute('cy', b.y.toFixed(1));
      circles[i].setAttribute('r', b.r.toFixed(1));
    });
  }

  function tick() {
    var moving = false;
    var big = Math.sqrt(root.offsetWidth * root.offsetWidth + root.offsetHeight * root.offsetHeight);
    blobs.forEach(function (b, i) {
      // The head chases the cursor, each drop chases the one before it.
      var lead = i === 0 ? target : blobs[i - 1];
      var k = reduce ? 1 : i === 0 ? 0.3 : 0.32;
      b.x += (lead.x - b.x) * k;
      b.y += (lead.y - b.y) * k;
      var want = flood ? (i === 0 ? big : 0) : inside ? SIZES[i] : 0;
      b.r += (want - b.r) * (reduce ? 1 : 0.16);
      if (Math.abs(lead.x - b.x) + Math.abs(lead.y - b.y) + Math.abs(want - b.r) > 0.2) moving = true;
    });
    draw();
    raf = moving ? requestAnimationFrame(tick) : 0;
  }

  function kick() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function local(e) {
    var box = root.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  }

  function enter(e) {
    var at = local(e);
    inside = true;
    target = at;
    // Start the whole trail at the entry point, so it does not streak in.
    if (!flood) blobs.forEach(function (b) { b.x = at.x; b.y = at.y; });
    kick();
  }
  function move(e) {
    target = local(e);
    kick();
  }
  function leave() {
    inside = false;
    flood = false;
    kick();
  }
  function click(e) {
    flood = !flood;
    target = local(e);
    kick();
  }

  root.addEventListener('pointerenter', enter);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  root.addEventListener('click', click);
  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointerenter', enter);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    root.removeEventListener('click', click);
    circles.forEach(function (c) { c.setAttribute('r', '0'); });
  };
}

document.querySelectorAll('.card-ink-reveal').forEach(initCardInkReveal);
