function initTabsNotch(root) {
  var W = 260, H = 56, INSET = 24;
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var shape = root.querySelector('.tabs-notch__shape');
  var orb = root.querySelector('.tabs-notch__orb');
  var orbIcons = orb.querySelectorAll('svg');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  function centre(i) { return INSET + ((W - INSET * 2) / tabs.length) * (i + 0.5); }
  var m = { x: centre(sel), v: 0, raf: 0 };
  /* The bar, with a smooth dip under the active icon. */
  function bar(x) {
    var c = Math.max(centre(0), Math.min(centre(tabs.length - 1), x));
    return 'M0 16A16 16 0 0 1 16 0H' + (c - 34) + 'C' + (c - 20) + ' 0 ' + (c - 23) + ' 28 ' + c + ' 28S' + (c + 20) + ' 0 ' + (c + 34) + ' 0H' + (W - 16) +
      'A16 16 0 0 1 ' + W + ' 16V' + (H - 16) + 'A16 16 0 0 1 ' + (W - 16) + ' ' + H + 'H16A16 16 0 0 1 0 ' + (H - 16) + 'Z';
  }
  function draw() {
    shape.setAttribute('d', bar(m.x));
    orb.style.transform = 'translateX(' + m.x + 'px)';
  }
  // The notch and its orb travel on a spring, overshooting a touch before they settle.
  function travel() {
    var target = centre(sel);
    cancelAnimationFrame(m.raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      m.x = target;
      draw();
      return;
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      m.v += (-190 * (m.x - target) - 21 * m.v) * dt;
      m.x += m.v * dt;
      if (Math.abs(m.x - target) < 0.05 && Math.abs(m.v) < 0.5) {
        m.x = target;
        draw();
        return;
      }
      draw();
      m.raf = requestAnimationFrame(step);
    }
    m.raf = requestAnimationFrame(step);
  }
  function select(i) {
    if (i === sel) return;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    orbIcons.forEach(function (icon, k) { icon.classList.toggle('tabs-notch__icon--on', k === i); });
    travel();
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
    cancelAnimationFrame(m.raf);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-notch').forEach(initTabsNotch);
