function initTabsPart(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var COL = 240 / n;
  var INK = { on: 'light-dark(#fbfcfd, #121417)', lit: 'light-dark(#373a40, #f1f2f3)', dim: 'light-dark(#5f626a, #a7abb2)' };
  var pill = root.querySelector('.tabs-part__pill');
  var labels = root.querySelectorAll('.tabs-part__label');
  function center(i) { return i * COL + COL / 2; }
  var s = { x: center(sel), v: 0 };
  var raf = 0;
  function draw() {
    pill.style.transform = 'translateX(' + s.x + 'px)';
    var fast = Math.min(1, Math.abs(s.v) / 260);
    labels.forEach(function (el, i) {
      var near = Math.max(0, 1 - Math.abs(center(i) - s.x) / 30);
      el.style.transform = 'translateY(' + -9 * near * fast + 'px) scale(' + (1 - 0.12 * near * fast) + ')';
      el.style.color = i === sel && near > 0.6 && fast < 0.5 ? INK.on : i === sel ? INK.lit : INK.dim;
    });
  }
  // The pill slides on a spring, and the labels it passes over step up out of its way, more the
  // faster it goes, then settle back. Only once it has stopped does the label under it turn dark.
  function run() {
    cancelAnimationFrame(raf);
    var goal = center(sel);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s = { x: goal, v: 0 };
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      s.v += (-120 * (s.x - goal) - 17 * s.v) * dt;
      s.x += s.v * dt;
      if (Math.abs(s.x - goal) < 0.05 && Math.abs(s.v) < 0.5) {
        s = { x: goal, v: 0 };
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
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
    run();
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
  draw();
  return function () {
    cancelAnimationFrame(raf);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-part').forEach(initTabsPart);
