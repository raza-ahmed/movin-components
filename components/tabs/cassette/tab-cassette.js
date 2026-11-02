function initTabsCassette(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  // Where each track starts along the tape, from 0 (all on the left reel) to 1.
  var AT = [0.04, 0.33, 0.62, 0.9];
  var TAPE = 900;
  var L = { x: 78, y: 72 };
  var R = { x: 142, y: 72 };
  var packs = root.querySelectorAll('.tabs-cassette__pack');
  var spokes = root.querySelectorAll('.tabs-cassette__hub + g');
  var tape = root.querySelector('.tabs-cassette__tape');
  var title = root.querySelector('.tabs-cassette__title');
  var mode = root.querySelector('.tabs-cassette__read b');
  var counter = root.querySelector('.tabs-cassette__read span');
  var s = { p: AT[sel], aL: 0, aR: 0 };
  var raf = 0;
  function packL(p) { return 11 + 19 * (1 - p); }
  function packR(p) { return 11 + 19 * p; }
  function draw(label) {
    var rl = packL(s.p);
    var rr = packR(s.p);
    packs[0].setAttribute('r', rl);
    packs[1].setAttribute('r', rr);
    spokes[0].setAttribute('transform', 'rotate(' + s.aL + ' ' + L.x + ' ' + L.y + ')');
    spokes[1].setAttribute('transform', 'rotate(' + s.aR + ' ' + R.x + ' ' + R.y + ')');
    tape.setAttribute('d', 'M' + L.x + ' ' + (L.y + rl) + 'L36 106H184L' + R.x + ' ' + (R.y + rr));
    mode.textContent = label;
    counter.textContent = String(Math.round(s.p * 600)).padStart(3, '0');
  }
  // Winding to a track runs the reels fast, forward or back. Each reel turns at the speed the tape
  // leaves or reaches it, so the nearly empty one spins hardest; the counter follows the tape.
  function wind() {
    cancelAnimationFrame(raf);
    var from = s.p;
    var to = AT[sel];
    if (from === to) return;
    var label = to > from ? 'Fast forward' : 'Rewind';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s.p = to;
      return draw('Playing');
    }
    var dur = 350 + 1300 * Math.abs(to - from);
    var t0 = performance.now();
    function step(now) {
      var k = Math.min(1, (now - t0) / dur);
      var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      var p = from + (to - from) * e;
      var dp = p - s.p;
      s.aL += ((dp * TAPE) / packL(p)) * (180 / Math.PI);
      s.aR += ((dp * TAPE) / packR(p)) * (180 / Math.PI);
      s.p = p;
      draw(k < 1 ? label : 'Playing');
      if (k < 1) raf = requestAnimationFrame(step);
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
    title.textContent = tabs[i].textContent;
    wind();
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
  return function () {
    cancelAnimationFrame(raf);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-cassette').forEach(initTabsCassette);
