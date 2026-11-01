function initTabsTilt(root) {
  var BALL = 10;
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var beam = root.querySelector('.tabs-tilt__beam');
  var ball = root.querySelector('.tabs-tilt__ball');
  var COL = list.offsetWidth / tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var s = { x: sel * COL + COL / 2, v: 0, tilt: 0, tv: 0 };
  var raf = 0;
  function draw() {
    beam.style.transform = 'rotate(' + s.tilt + 'deg)';
    // A mark on the ball turns with the distance, so it reads as rolling, not sliding.
    ball.style.transform = 'translateX(' + s.x + 'px) rotate(' + (s.x / (BALL / 2)) * (180 / Math.PI) + 'deg)';
  }
  // The beam tips towards the tab you picked; gravity along the slope rolls the ball there, and the
  // beam levels out as the ball arrives.
  function run() {
    cancelAnimationFrame(raf);
    var goal = sel * COL + COL / 2;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s = { x: goal, v: 0, tilt: 0, tv: 0 };
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      var want = Math.max(-7, Math.min(7, (goal - s.x) * 0.09));
      s.tv += (-120 * (s.tilt - want) - 20 * s.tv) * dt;
      s.tilt += s.tv * dt;
      s.v += (s.tilt * 95 - (s.x - goal) * 22 - 8 * s.v) * dt;
      s.x += s.v * dt;
      if (Math.abs(s.x - goal) < 0.1 && Math.abs(s.v) < 1 && Math.abs(s.tilt) < 0.02 && Math.abs(s.tv) < 0.1) {
        s = { x: goal, v: 0, tilt: 0, tv: 0 };
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function select(i) {
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
    var n = tabs.length;
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

document.querySelectorAll('.tabs-tilt').forEach(initTabsTilt);
