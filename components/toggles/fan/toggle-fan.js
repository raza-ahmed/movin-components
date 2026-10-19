function initToggleFan(root) {
  var input = root.querySelector('.toggle-fan__input');
  var blades = root.querySelector('.toggle-fan__blades');
  if (!input || !blades) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MAX = 900; // degrees per second at full speed
  var v = 0; // 0..1 of full speed
  var angle = 0;
  var last = 0;
  var frame = 0;

  // Speed eases toward its target: quicker spinning up than coasting down.
  // The angle just accumulates, so it stops wherever it happens to be.
  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    var target = input.checked ? 1 : 0;
    var tau = target ? 0.45 : 1.1;
    v += (target - v) * (1 - Math.exp(-dt / tau));
    if (!target && v < 0.004) v = 0;
    angle = (angle + v * MAX * dt) % 360;
    blades.style.transform = 'rotate(' + angle.toFixed(2) + 'deg)';
    root.style.setProperty('--toggle-fan-v', v.toFixed(3));
    frame = v || target ? requestAnimationFrame(tick) : 0;
  }

  function change() {
    if (reduce || frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }

  input.addEventListener('change', change);
  return function () {
    cancelAnimationFrame(frame);
    input.removeEventListener('change', change);
  };
}

document.querySelectorAll('.toggle-fan').forEach(initToggleFan);
