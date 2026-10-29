function initCardEnhance(root) {
  var canvas = root.querySelector('canvas');
  var probe = root.querySelector('.card-enhance__probe');
  var res = root.querySelector('.card-enhance__res');
  if (!canvas || !probe || !res) return;
  var W = 194;
  var H = 120;
  var STEPS = [6, 12, 24, 48, W]; // columns across the picture: blocky to full
  var dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  // The scene, painted once at full size from the palette, read through probe elements.
  var ink = Array.prototype.map.call(probe.children, function (c) { return getComputedStyle(c).color; });
  var full = document.createElement('canvas');
  full.width = W;
  full.height = H;
  var f = full.getContext('2d');
  var sky = f.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, ink[1]);
  sky.addColorStop(1, ink[0]);
  f.fillStyle = sky;
  f.fillRect(0, 0, W, H);
  f.fillStyle = ink[4];
  f.beginPath();
  f.arc(132, 42, 18, 0, Math.PI * 2);
  f.fill();
  function hills(color, start, pts) {
    f.fillStyle = color;
    f.beginPath();
    f.moveTo(0, start);
    pts.forEach(function (p) { f.lineTo(p[0], p[1]); });
    f.fill();
  }
  hills(ink[2], 96, [[30, 58], [58, 80], [92, 40], [126, 84], [160, 56], [194, 78], [194, 120], [0, 120]]);
  hills(ink[3], 108, [[44, 84], [80, 102], [120, 90], [158, 108], [194, 96], [194, 120], [0, 120]]);
  f.fillStyle = ink[1];
  for (var i = 0; i < 6; i++) f.fillRect(0, 112 + i * 2, W, 1);

  var ctx = canvas.getContext('2d');
  var small = document.createElement('canvas');
  function paint(cols) {
    small.width = cols;
    small.height = Math.max(1, Math.round((cols * H) / W));
    small.getContext('2d').drawImage(full, 0, 0, small.width, small.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(small, 0, 0, canvas.width, canvas.height);
  }
  paint(STEPS[0]);
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var s = 0;
  var target = 0;
  var timer = setInterval(function () {
    if (s === target) return;
    s = still ? target : s + Math.sign(target - s);
    paint(STEPS[s]);
    res.textContent = s === STEPS.length - 1 ? 'full res' : STEPS[s] + ' px';
  }, 170);
  function sharpen() { target = STEPS.length - 1; }
  function blur() { target = 0; }
  root.addEventListener('pointerenter', sharpen);
  root.addEventListener('pointerleave', blur);
  root.addEventListener('focus', sharpen);
  root.addEventListener('blur', blur);
  return function () {
    clearInterval(timer);
    root.removeEventListener('pointerenter', sharpen);
    root.removeEventListener('pointerleave', blur);
    root.removeEventListener('focus', sharpen);
    root.removeEventListener('blur', blur);
  };
}

document.querySelectorAll('.card-enhance').forEach(initCardEnhance);
