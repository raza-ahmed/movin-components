function initTabsZip(root) {
  var W = 240;
  var PITCH = 6;
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var teeth = root.querySelectorAll('.tabs-zip__tooth');
  var slider = root.querySelector('.tabs-zip__track > g');
  var pull = slider.querySelector('g');
  var n = tabs.length;
  var col = W / n;
  var teethPerRow = teeth.length / 2;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var s = { x: sel * col + col / 2, v: 0, a: 0, av: 0 };
  var raf = 0;

  // Behind the slider the teeth are meshed in one line; ahead of it the two rows part in a V.
  function draw() {
    for (var i = 0; i < teeth.length; i++) {
      var top = i < teethPerRow;
      var x = (i % teethPerRow) * PITCH + (top ? 1 : 4);
      var d = Math.max(0, Math.min(6, (x + 2 - s.x - 7) * 0.08));
      teeth[i].setAttribute('y', top ? 5 - d : 9 + d);
      teeth[i].classList.toggle('tabs-zip__tooth--shut', !d);
    }
    slider.setAttribute('transform', 'translate(' + s.x + ' 9)');
    pull.setAttribute('transform', 'rotate(' + s.a + ' 0 4)');
  }
  // The slider rides to the chosen tab on a spring. Its pull swings back from the speed and then hangs still.
  function run() {
    cancelAnimationFrame(raf);
    var goal = sel * col + col / 2;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s = { x: goal, v: 0, a: 0, av: 0 };
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      s.v += (-90 * (s.x - goal) - 17 * s.v) * dt;
      s.x += s.v * dt;
      var want = Math.max(-35, Math.min(35, -s.v * 0.12));
      s.av += (-160 * (s.a - want) - 9 * s.av) * dt;
      s.a += s.av * dt;
      if (Math.abs(s.x - goal) < 0.05 && Math.abs(s.v) < 0.5 && Math.abs(s.a) < 0.2 && Math.abs(s.av) < 1) {
        s = { x: goal, v: 0, a: 0, av: 0 };
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function select(i) {
    if (i === sel) return;
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

document.querySelectorAll('.tabs-zip').forEach(initTabsZip);
