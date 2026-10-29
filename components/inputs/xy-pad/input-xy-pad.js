function initFieldXyPad(root) {
  var pad = root.querySelector('.field-xy-pad__pad');
  var canvas = root.querySelector('canvas');
  var probe = root.querySelector('.field-xy-pad__probe');
  var read = root.querySelector('.field-xy-pad__label b');
  if (!pad || !canvas || !probe || !read) return;
  var W = 230;
  var H = 130;
  var dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var val = { x: 0.62, y: 0.35 };
  var p = { x: val.x * W, y: (1 - val.y) * H };
  var trail = [];
  var drag = false;
  var raf = 0;

  function tick(now) {
    // The puck follows with a little lag and leaves a fading trail.
    var k = still ? 1 : 0.3;
    p.x += (val.x * W - p.x) * k;
    p.y += ((1 - val.y) * H - p.y) * k;
    trail.push({ x: p.x, y: p.y, t: now });
    while (trail.length && now - trail[0].t > 450) trail.shift();
    var dim = getComputedStyle(probe.children[0]).color;
    var ink = getComputedStyle(probe.children[1]).color;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(p.x, 0);
    ctx.lineTo(p.x, H);
    ctx.moveTo(0, p.y);
    ctx.lineTo(W, p.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = ink;
    trail.forEach(function (q, i) {
      ctx.globalAlpha = (i / trail.length) * 0.35;
      ctx.beginPath();
      ctx.arc(q.x, q.y, 2 + (i / trail.length) * 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
    ctx.fill();
    raf = requestAnimationFrame(tick);
  }
  function set(x, y) {
    val = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
    var cutoff = Math.round(200 * Math.pow(100, val.x));
    var res = val.y.toFixed(2);
    read.textContent = (cutoff >= 1000 ? (cutoff / 1000).toFixed(1) + ' kHz' : cutoff + ' Hz') + ' · Q ' + res;
    pad.setAttribute('aria-valuenow', String(Math.round(val.x * 100)));
    pad.setAttribute('aria-valuetext', 'Cutoff ' + cutoff + ' hertz, resonance ' + res + '. Arrow keys move; up and down set resonance.');
  }
  function fromPointer(e) {
    var r = pad.getBoundingClientRect();
    set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
  }
  function down(e) {
    pad.setPointerCapture(e.pointerId);
    drag = true;
    fromPointer(e);
  }
  function move(e) { if (drag) fromPointer(e); }
  function up() { drag = false; }
  function key(e) {
    var d = e.shiftKey ? 0.1 : 0.02;
    var m = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, d], ArrowDown: [0, -d] }[e.key];
    if (!m) return;
    e.preventDefault();
    set(val.x + m[0], val.y + m[1]);
  }
  pad.addEventListener('pointerdown', down);
  pad.addEventListener('pointermove', move);
  pad.addEventListener('pointerup', up);
  pad.addEventListener('keydown', key);
  raf = requestAnimationFrame(tick);
  return function () {
    cancelAnimationFrame(raf);
    pad.removeEventListener('pointerdown', down);
    pad.removeEventListener('pointermove', move);
    pad.removeEventListener('pointerup', up);
    pad.removeEventListener('keydown', key);
  };
}

document.querySelectorAll('.field-xy-pad').forEach(initFieldXyPad);
