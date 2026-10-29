function initRadioResolution(root) {
  var canvas = root.querySelector('canvas');
  var probe = root.querySelector('.radio-resolution__probe');
  if (!canvas || !probe) return;
  var W = 192;
  var H = 108;
  var COLS = { '240': 24, '720': 64, '4k': 192 };
  var dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  var ctx = canvas.getContext('2d');
  var timer = 0;

  // The scene, as a palette index (0 darkest … 6 lightest) at u, v in 0…1.
  function shade(u, v) {
    var sun = Math.hypot((u - 0.7) * 1.78, v - 0.3);
    if (sun < 0.1) return 6;
    var ridge = 0.6 - 0.24 * Math.max(0, 1 - Math.abs(u - 0.28) / 0.3) - 0.16 * Math.max(0, 1 - Math.abs(u - 0.62) / 0.24);
    if (v > 0.8) return Math.abs(u - 0.7) < 0.035 && v < 0.95 ? 5 : 2;
    var hill = 0.74 - 0.05 * Math.sin(u * 9);
    if (v > hill) return 4;
    if (v > ridge) return v < ridge + 0.05 && Math.abs(u - 0.28) < 0.06 ? 5 : 3;
    if (sun < 0.16) return 4;
    return v < 0.3 ? 0 : 1;
  }

  function draw(cols) {
    // Read the colours from hidden swatches, so the picture follows the page theme.
    var palette = [];
    for (var i = 0; i < probe.children.length; i++) palette.push(getComputedStyle(probe.children[i]).color);
    var rows = Math.round((cols * H) / W);
    var cw = canvas.width / cols;
    var ch = canvas.height / rows;
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        ctx.fillStyle = palette[shade((x + 0.5) / cols, (y + 0.5) / rows)];
        ctx.fillRect(Math.floor(x * cw), Math.floor(y * ch), Math.ceil(cw), Math.ceil(ch));
      }
    }
  }

  var checked = root.querySelector('input:checked');
  var shown = COLS[checked ? checked.value : '240'];
  draw(shown);

  // Step through the resolutions in between, so it sharpens (or breaks up) progressively.
  function show(cols) {
    clearTimeout(timer);
    var from = shown;
    var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var steps = [];
    if (still || from === cols) steps.push(cols);
    else for (var i = 0; i < 6; i++) steps.push(Math.round(from * Math.pow(cols / from, (i + 1) / 6)));
    var n = 0;
    (function next() {
      draw(steps[n]);
      shown = steps[n];
      if (++n < steps.length) timer = setTimeout(next, 70);
    })();
  }

  function onChange(e) {
    if (COLS[e.target.value]) show(COLS[e.target.value]);
  }
  root.addEventListener('change', onChange);
  return function () {
    clearTimeout(timer);
    root.removeEventListener('change', onChange);
  };
}

document.querySelectorAll('.radio-resolution').forEach(initRadioResolution);
