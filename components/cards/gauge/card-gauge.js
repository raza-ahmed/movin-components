function initCardGauge(root) {
  var fill = root.querySelector('.card-gauge__fill');
  var needle = root.querySelector('.card-gauge__needle');
  var value = root.querySelector('.card-gauge__v');
  if (!fill || !needle || !value) return;
  var VALUE = 72; // out of 100
  var shown = 0;
  var raf = 0;

  function set(on) {
    var target = on ? VALUE : 0;
    fill.style.strokeDashoffset = String(1 - target / 100);
    needle.style.transform = 'rotate(' + (target / 100) * 180 + 'deg)';
    // The readout counts toward wherever the needle is heading.
    var from = shown;
    var start = performance.now();
    cancelAnimationFrame(raf);
    function tick(now) {
      var p = Math.min(1, (now - start) / 1000);
      shown = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      value.firstChild.textContent = String(shown);
      fill.style.opacity = shown > 0 ? '1' : '0';
      root.setAttribute('aria-valuenow', String(shown));
      if (p < 1) raf = requestAnimationFrame(tick);
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

document.querySelectorAll('.card-gauge').forEach(initCardGauge);
