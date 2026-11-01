function initTabsOrbit(root) {
  var TILT = (-12 * Math.PI) / 180;
  var RY = 9;
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var moon = root.querySelector('.tabs-orbit__moon');
  var ring = root.querySelector('.tabs-orbit__path ellipse');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = 0;
  function at(i) {
    var t = tabs[i];
    return { x: t.offsetLeft + t.offsetWidth / 2, y: t.offsetTop + t.offsetHeight / 2, rx: t.offsetWidth / 2 + 13 };
  }
  var o = at(sel);
  o.vx = 0;
  o.vr = 0;
  o.phi = 1.2;
  var last = performance.now();

  // One loop for the component's whole life: the moon keeps circling, and the orbit's centre and width
  // chase the active label on springs, so a switch carries the moon across mid-orbit.
  function step(now) {
    var dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    var g = at(sel);
    if (still) {
      o.x = g.x;
      o.rx = g.rx;
      o.phi = Math.PI / 2;
    } else {
      o.vx += (-90 * (o.x - g.x) - 15 * o.vx) * dt;
      o.x += o.vx * dt;
      o.vr += (-90 * (o.rx - g.rx) - 15 * o.vr) * dt;
      o.rx += o.vr * dt;
      o.phi += dt * 2.1;
    }
    var c = Math.cos(o.phi);
    var s = Math.sin(o.phi);
    var mx = o.x + o.rx * c * Math.cos(TILT) - RY * s * Math.sin(TILT);
    var my = g.y + o.rx * c * Math.sin(TILT) + RY * s * Math.cos(TILT);
    // The lower half of the orbit passes in front of the word, the upper half behind it.
    var front = s > 0;
    moon.style.transform = 'translate(' + mx + 'px, ' + my + 'px) scale(' + (front ? 1 : 0.7) + ')';
    moon.style.zIndex = front ? '2' : '0';
    moon.style.opacity = front ? '1' : '0.45';
    moon.style.visibility = 'visible';
    ring.setAttribute('cx', o.x);
    ring.setAttribute('cy', g.y);
    ring.setAttribute('rx', o.rx);
    ring.setAttribute('transform', 'rotate(' + (TILT * 180) / Math.PI + ' ' + o.x + ' ' + g.y + ')');
    if (!still) raf = requestAnimationFrame(step);
  }
  function select(i) {
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    // Under reduced motion the loop draws one frame at a time, so a switch asks for one more.
    if (still) requestAnimationFrame(step);
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
  raf = requestAnimationFrame(step);
  if (still && document.fonts) document.fonts.ready.then(function () { requestAnimationFrame(step); });
  return function () {
    cancelAnimationFrame(raf);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-orbit').forEach(initTabsOrbit);
