function initCardShatter(root) {
  var shards = root.querySelectorAll('.card-shatter__shard');
  var flash = root.querySelector('.card-shatter__flash');
  if (!shards.length || !flash) return;
  var W = 224;
  var H = 148;
  // The same fixed pseudo-random sequence the shard geometry was built from.
  function rnd(n) {
    var x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  // Each shard's centre is its transform-origin.
  var centres = Array.prototype.map.call(shards, function (s) {
    var o = s.style.transformOrigin.split(' ');
    return { x: parseFloat(o[0]), y: parseFloat(o[1]) };
  });
  var broken = false;

  function click(e) {
    var r = root.getBoundingClientRect();
    // Keyboard presses report no position: break from the middle.
    var hx = e.detail === 0 ? W / 2 : e.clientX - r.left;
    var hy = e.detail === 0 ? H / 2 : e.clientY - r.top;
    broken = !broken;
    if (broken) {
      flash.style.left = hx + 'px';
      flash.style.top = hy + 'px';
    }
    shards.forEach(function (s, i) {
      var c = centres[i];
      if (broken) {
        var dx = c.x - hx;
        var dy = c.y - hy;
        var dist = Math.hypot(dx, dy) || 1;
        var push = 50 + rnd(i + 7) * 80;
        s.style.setProperty('--tx', ((dx / dist) * push).toFixed(1) + 'px');
        s.style.setProperty('--ty', ((dy / dist) * push + 60 + rnd(i + 3) * 40).toFixed(1) + 'px');
        s.style.setProperty('--tz', (40 + rnd(i + 11) * 80).toFixed(0) + 'px');
        s.style.setProperty('--rx', ((rnd(i + 13) - 0.5) * 140).toFixed(0) + 'deg');
        s.style.setProperty('--ry', ((rnd(i + 17) - 0.5) * 140).toFixed(0) + 'deg');
        s.style.setProperty('--rz', ((rnd(i + 19) - 0.5) * 180).toFixed(0) + 'deg');
        s.style.setProperty('--d', (0.08 + dist * 0.0016).toFixed(3) + 's');
      } else {
        ['--tx', '--ty', '--tz', '--rx', '--ry', '--rz'].forEach(function (k) { s.style.removeProperty(k); });
        s.style.setProperty('--d', (rnd(i + 23) * 0.12).toFixed(3) + 's');
      }
    });
    root.setAttribute('aria-pressed', String(broken));
    root.setAttribute('aria-label', broken ? 'Reward revealed: 30% off with code MOVIN30. Press to reseal' : 'Mystery drop. Press to break the seal');
  }
  root.addEventListener('click', click);
  return function () { root.removeEventListener('click', click); };
}

document.querySelectorAll('.card-shatter').forEach(initCardShatter);
