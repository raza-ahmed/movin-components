function initSliderSpool(root) {
  var W = 240;
  var LINE = 40;
  var R = 17;
  var HUB = 6;
  var START = R + 2;
  var END = W - R - 2;
  var input = root.querySelector('.slider-spool__input');
  var guide = root.querySelector('.slider-spool__guide');
  var thread = root.querySelector('.slider-spool__thread');
  var flange = root.querySelector('.slider-spool__flange');
  var wound = root.querySelector('.slider-spool__wound');
  var spin = root.querySelector('.slider-spool__body g');
  var turns = root.querySelectorAll('.slider-spool__turns');
  var hub = root.querySelector('.slider-spool__hub');
  var holes = root.querySelectorAll('.slider-spool__hole');
  var ring = root.querySelector('.slider-spool__ring');
  var value = root.querySelector('.slider-spool__value b');
  var cx = target();
  var vel = 0;
  var raf = 0;
  function target() { return START + (+input.value / 100) * (END - START); }
  // Thread left on the spool shrinks it by area, so it empties slowly at first and quickly at the end.
  function woundRadius(f) { return Math.sqrt(HUB * HUB + 6 + (1 - f) * (R * R - HUB * HUB - 12)); }

  function draw() {
    var r = woundRadius((cx - START) / (END - START));
    var cy = LINE - R;
    // It rolls on its flanges, so it turns by the distance travelled over the flange radius.
    var turn = ((cx - START) / R) * (180 / Math.PI);
    var tx = cx - r * 0.35;
    var ty = cy + r * 0.94;
    guide.setAttribute('x1', cx + R + 4);
    thread.setAttribute('d', 'M1 ' + LINE + 'H' + Math.max(1, cx - R * 0.9) + 'Q' + (cx - r * 0.6) + ' ' + LINE + ' ' + tx + ' ' + ty);
    [flange, wound, hub, ring].forEach(function (c) { c.setAttribute('cx', cx); });
    wound.setAttribute('r', r);
    spin.setAttribute('transform', 'rotate(' + turn + ' ' + cx + ' ' + cy + ')');
    [0.3, 0.55, 0.8].forEach(function (k, i) {
      turns[i].setAttribute('cx', cx);
      turns[i].setAttribute('r', HUB + (r - HUB) * k);
    });
    [0, 120, 240].forEach(function (a, i) {
      holes[i].setAttribute('cx', cx + Math.cos((a * Math.PI) / 180) * HUB * 0.5);
    });
  }
  // Rolls the spool to the value rather than jumping, so a click far along unwinds the thread on the way.
  function run() {
    cancelAnimationFrame(raf);
    value.textContent = input.value;
    input.setAttribute('aria-valuetext', input.value + ' metres');
    var goal = target();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cx = goal;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      vel += (-200 * (cx - goal) - 26 * vel) * dt;
      cx += vel * dt;
      if (Math.abs(cx - goal) < 0.02 && Math.abs(vel) < 0.05) {
        cx = goal;
        vel = 0;
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  input.addEventListener('input', run);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', run);
  };
}

document.querySelectorAll('.slider-spool').forEach(initSliderSpool);
