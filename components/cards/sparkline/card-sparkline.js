function initCardSparkline(root) {
  var OPEN = 182.4;
  var CLOSE = 196.85;
  var out = root.querySelector('.card-sparkline__price');
  var price = OPEN;
  var raf = 0;
  function show(p) {
    price = p;
    out.textContent = '$' + p.toFixed(2);
  }
  function set(on) {
    root.toggleAttribute('data-on', on);
    cancelAnimationFrame(raf);
    var from = price;
    var to = on ? CLOSE : OPEN;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return show(to);
    var t0 = performance.now();
    // Count with the line: same 1.2s, eased the same way, so the number arrives when the line does.
    function tick(now) {
      var t = Math.min(1, (now - t0) / 1200);
      show(from + (to - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }
  function on() { set(true); }
  function off() { set(false); }
  root.addEventListener('pointerenter', on);
  root.addEventListener('pointerleave', off);
  root.addEventListener('focus', on);
  root.addEventListener('blur', off);
  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointerenter', on);
    root.removeEventListener('pointerleave', off);
    root.removeEventListener('focus', on);
    root.removeEventListener('blur', off);
  };
}

document.querySelectorAll('.card-sparkline').forEach(initCardSparkline);
