function initCardCompass(root) {
  var dial = root.querySelector('.card-compass__dial');
  var needle = root.querySelector('.card-compass__dial svg g');
  var read = root.querySelector('.card-compass__read');
  if (!dial || !needle || !read) return;
  var DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var target = 0;
  var idle = 0;
  var a = 0;
  var v = 0;
  var raf = 0;
  // A damped spring toward the target bearing: it overshoots and settles, like a real needle.
  function tick(now) {
    // With no pointer around, the target drifts slowly so the needle still hunts.
    if (performance.now() - idle > 2500) target = Math.sin(now / 2200) * 40 + 20;
    var d = (((target - a) + 540) % 360) - 180; // the short way round
    if (still) a = target;
    else {
      v = (v + d * 0.012) * 0.9;
      a += v;
    }
    needle.style.transform = 'rotate(' + a.toFixed(2) + 'deg)';
    var heading = Math.round(((a % 360) + 360) % 360);
    read.firstChild.textContent = heading + '°';
    read.querySelector('small').textContent = DIRS[Math.round(heading / 45) % 8];
    root.setAttribute('aria-label', 'Compass heading ' + heading + ' degrees');
    raf = requestAnimationFrame(tick);
  }
  function move(e) {
    var r = dial.getBoundingClientRect();
    // Bearing measured clockwise from up.
    target = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
    idle = performance.now();
  }
  window.addEventListener('pointermove', move);
  raf = requestAnimationFrame(tick);
  return function () {
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', move);
  };
}

document.querySelectorAll('.card-compass').forEach(initCardCompass);
