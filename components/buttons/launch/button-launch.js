function initBtnLaunch(root) {
  var btn = root.querySelector('.btn-launch__btn');
  var flame = root.querySelector('.btn-launch__flame');
  if (!btn || !flame) return;
  var phase = 'idle';
  var timers = [];

  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function setPhase(p) {
    phase = p;
    root.setAttribute('data-phase', p);
    root.querySelectorAll('.btn-launch__puff').forEach(function (el) { el.remove(); });
    if (p === 'lift') puffs();
    if (p !== 'count') label(p === 'done' || p === 'land' ? 'Launched' : 'Launch');
  }
  function label(text) {
    btn.textContent = text;
    btn.appendChild(flame);
  }
  function count(n) {
    var s = document.createElement('span');
    s.className = 'btn-launch__count';
    s.textContent = 'T-' + n;
    btn.textContent = '';
    btn.appendChild(s);
    btn.appendChild(flame);
  }
  // Smoke fanned along the ground on both sides.
  function puffs() {
    for (var i = 0; i < 9; i++) {
      var a = Math.PI * (0.05 + (0.9 * i) / 8);
      var p = document.createElement('span');
      p.className = 'btn-launch__puff';
      p.setAttribute('aria-hidden', 'true');
      p.style.setProperty('--x', (Math.cos(a) * 70).toFixed(0) + 'px');
      p.style.setProperty('--y', (-Math.sin(a) * 18 + 6).toFixed(0) + 'px');
      p.style.setProperty('--delay', (i % 3) * 0.05 + 's');
      root.insertBefore(p, btn);
    }
  }
  function go() {
    if (phase !== 'idle' && phase !== 'done') return;
    setPhase('count');
    count(3);
    at(600, function () { count(2); });
    at(1200, function () { count(1); });
    at(1800, function () { setPhase('lift'); });
    at(2700, function () { setPhase('gone'); });
    at(3300, function () { setPhase('land'); });
    at(4100, function () { setPhase('done'); });
    at(5600, function () { setPhase('idle'); });
  }
  btn.addEventListener('click', go);

  return function () {
    timers.forEach(clearTimeout);
    btn.removeEventListener('click', go);
  };
}

document.querySelectorAll('.btn-launch').forEach(initBtnLaunch);
