function initBtnReactor(root) {
  var core = root.querySelector('.btn-reactor__core');
  if (!core) return;
  var on = root.getAttribute('aria-pressed') === 'true';

  // Spin up or down without a jump: the ring animations keep running and only their rate changes.
  function rate(r) {
    root.querySelectorAll('svg').forEach(function (s) {
      s.getAnimations().forEach(function (a) { a.updatePlaybackRate(r); });
    });
  }
  function enter() { rate(on ? 6 : 3); }
  function leave() { rate(on ? 2 : 1); }
  function click() {
    rate(on ? 3 : 6);
    on = !on;
    root.setAttribute('aria-pressed', String(on));
    root.setAttribute('aria-label', on ? 'Core online' : 'Ignite core');
    core.textContent = on ? 'ON' : 'OFF';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var flash = document.createElement('span');
    flash.className = 'btn-reactor__flash';
    flash.setAttribute('aria-hidden', 'true');
    flash.addEventListener('animationend', function () { flash.remove(); });
    root.appendChild(flash);
  }
  root.addEventListener('pointerenter', enter);
  root.addEventListener('pointerleave', leave);
  root.addEventListener('click', click);

  return function () {
    root.removeEventListener('pointerenter', enter);
    root.removeEventListener('pointerleave', leave);
    root.removeEventListener('click', click);
  };
}

document.querySelectorAll('.btn-reactor').forEach(initBtnReactor);
