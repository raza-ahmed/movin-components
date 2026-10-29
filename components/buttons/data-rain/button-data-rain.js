function initBtnDataRain(root) {
  var canvas = root.querySelector('canvas');
  if (!canvas) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var GLYPHS = '01アイウエオカキクケコサシスセソ<>/{}=+*#ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘ';
  var COL = 11;
  var FONT = 11;
  var ctx = canvas.getContext('2d');
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;
  var dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  // Each column: head position (in rows), fall speed, and whether it is still pouring.
  var drops = [];
  for (var i = 0; i < Math.ceil(w / COL); i++) drops.push({ y: -Math.random() * 10, v: 9 + Math.random() * 10, on: false });
  var raining = false;
  var last = performance.now();
  var raf = 0;

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    ctx.fillStyle = getComputedStyle(root).color;
    // Fade what is already drawn, leaving a trail behind each head (destination-out uses only alpha).
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 0.14;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.font = FONT + 'px ui-monospace, SFMono-Regular, Menlo, monospace';
    drops.forEach(function (d, c) {
      if (raining) d.on = true;
      if (!d.on) return;
      var before = Math.floor(d.y);
      d.y += d.v * dt;
      if (Math.floor(d.y) !== before && d.y > 0) {
        ctx.globalAlpha = 0.95;
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], c * COL + 1, d.y * FONT);
      }
      if (d.y * FONT > h + FONT) {
        // Off the bottom: start again from the top, or stop if the hover has ended.
        d.y = -Math.random() * 6;
        d.v = 9 + Math.random() * 10;
        d.on = raining;
      }
    });
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }
  function on() { raining = true; }
  function off() { raining = false; }
  root.addEventListener('pointerenter', on);
  root.addEventListener('pointerleave', off);
  root.addEventListener('focus', on);
  root.addEventListener('blur', off);
  raf = requestAnimationFrame(frame);

  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointerenter', on);
    root.removeEventListener('pointerleave', off);
    root.removeEventListener('focus', on);
    root.removeEventListener('blur', off);
  };
}

document.querySelectorAll('.btn-data-rain').forEach(initBtnDataRain);
