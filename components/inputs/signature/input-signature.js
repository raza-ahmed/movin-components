function initFieldSignature(root) {
  var pad = root.querySelector('.field-signature__pad');
  var canvas = root.querySelector('canvas');
  var probe = root.querySelector('.field-signature__probe');
  var clear = root.querySelector('.field-signature__clear');
  var alt = root.querySelector('.field-signature__alt');
  var status = root.querySelector('#field-signature-status') || root.querySelector('[aria-live]');
  if (!pad || !canvas || !probe || !clear || !alt || !status) return;
  var W = 256;
  var H = 100;
  var dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  var strokes = [];
  var drawing = null;
  var typed = null;

  function paint() {
    var ctx = canvas.getContext('2d');
    ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = getComputedStyle(probe).color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Midpoint quadratics smooth the jitter; each segment takes the width of its speed.
    strokes.forEach(function (s) {
      for (var i = 1; i < s.length; i++) {
        var a = s[i - 1];
        var b = s[i];
        var prev = s[i - 2] || a;
        ctx.lineWidth = (a.w + b.w) / 2;
        ctx.beginPath();
        ctx.moveTo((prev.x + a.x) / 2, (prev.y + a.y) / 2);
        ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.stroke();
      }
    });
  }
  function setSigned(on) {
    status.textContent = '';
    if (on) status.innerHTML = '<span class="field-signature__ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>Signed</span>';
  }
  function showTyped(name) {
    if (typed) typed.remove();
    typed = null;
    if (!name) return;
    typed = document.createElement('span');
    typed.className = 'field-signature__typed';
    typed.setAttribute('aria-hidden', 'true');
    typed.textContent = name;
    pad.appendChild(typed);
  }
  function point(e) {
    var r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: 2.4 };
  }
  function down(e) {
    pad.setPointerCapture(e.pointerId);
    alt.value = '';
    showTyped('');
    drawing = { t: performance.now() };
    strokes.push([point(e)]);
  }
  function move(e) {
    if (!drawing) return;
    var s = strokes[strokes.length - 1];
    var p = point(e);
    var last = s[s.length - 1];
    var now = performance.now();
    var speed = Math.hypot(p.x - last.x, p.y - last.y) / Math.max(1, now - drawing.t);
    drawing.t = now;
    // Fast strokes run thin, slow ones pool ink; eased so the width never jumps.
    p.w = last.w + (Math.max(0.9, Math.min(3.6, 3.8 - speed * 1.6)) - last.w) * 0.35;
    s.push(p);
    paint();
  }
  function up() {
    drawing = null;
    if (strokes.some(function (s) { return s.length > 3; })) setSigned(true);
  }
  function onType() {
    strokes = [];
    paint();
    showTyped(alt.value);
    setSigned(alt.value.trim().length > 1);
  }
  function reset() {
    strokes = [];
    alt.value = '';
    showTyped('');
    setSigned(false);
    paint();
  }
  // Repaint if the theme flips, so the ink follows it.
  var mq = matchMedia('(prefers-color-scheme: dark)');
  function scheme() { requestAnimationFrame(paint); }
  pad.addEventListener('pointerdown', down);
  pad.addEventListener('pointermove', move);
  pad.addEventListener('pointerup', up);
  alt.addEventListener('input', onType);
  clear.addEventListener('click', reset);
  mq.addEventListener('change', scheme);
  paint();
  return function () {
    pad.removeEventListener('pointerdown', down);
    pad.removeEventListener('pointermove', move);
    pad.removeEventListener('pointerup', up);
    alt.removeEventListener('input', onType);
    clear.removeEventListener('click', reset);
    mq.removeEventListener('change', scheme);
  };
}

document.querySelectorAll('.field-signature').forEach(initFieldSignature);
