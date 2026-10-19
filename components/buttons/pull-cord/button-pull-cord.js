function initBtnPullCord(root) {
  var button = root.querySelector('.btn-pull-cord__button');
  var bead = root.querySelector('.btn-pull-cord__bead');
  var line = root.querySelector('.btn-pull-cord__line');
  if (!button || !bead || !line) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LENGTH = 44; // cord at rest
  var PULL = 34; // how far past rest a pull must go to switch
  var anchor = { x: 0, y: 0 };
  var p = { x: 0, y: 0 };
  var v = { x: 0, y: 0 };
  var grab = null; // pointer offset while dragging
  var raf = 0;
  var last = 0;

  function draw() {
    // The cord sags sideways against the bead's swing.
    var cx = (anchor.x + p.x) / 2 - v.x * 0.04;
    var cy = (anchor.y + p.y) / 2;
    line.setAttribute('d', 'M' + anchor.x + ' ' + anchor.y + 'Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + p.x.toFixed(1) + ' ' + p.y.toFixed(1));
    root.style.setProperty('--btn-pull-cord-x', p.x.toFixed(1) + 'px');
    root.style.setProperty('--btn-pull-cord-y', p.y.toFixed(1) + 'px');
    root.classList.toggle('btn-pull-cord--armed', !!grab && p.y - anchor.y - LENGTH > PULL);
  }

  function tick(now) {
    var dt = Math.min(0.032, (now - last) / 1000 || 0.016);
    last = now;
    var rx = anchor.x;
    var ry = anchor.y + LENGTH;
    v.x += (160 * (rx - p.x) - 5 * v.x) * dt; // a loose pendulum
    v.y += (420 * (ry - p.y) - 14 * v.y) * dt;
    p.x += v.x * dt;
    p.y += v.y * dt;
    draw();
    if (Math.abs(v.x) + Math.abs(v.y) > 0.5 || Math.abs(rx - p.x) + Math.abs(ry - p.y) > 0.1) raf = requestAnimationFrame(tick);
    else {
      raf = 0;
      p.x = rx;
      p.y = ry;
      draw();
    }
  }

  function kick() {
    if (reduce) {
      p.x = anchor.x;
      p.y = anchor.y + LENGTH;
      v.x = v.y = 0;
      return draw();
    }
    if (!raf && !grab) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  }

  function toggle() {
    button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  }

  function local(e) {
    var box = root.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  }

  function down(e) {
    var at = local(e);
    grab = { x: at.x - p.x, y: at.y - p.y, t: performance.now() };
    bead.setPointerCapture(e.pointerId);
    cancelAnimationFrame(raf);
    raf = 0;
    v.x = v.y = 0;
  }

  function move(e) {
    if (!grab) return;
    var at = local(e);
    var nx = at.x - grab.x;
    var ny = Math.max(anchor.y + 12, at.y - grab.y);
    // The cord stretches, but only so far.
    var dx = nx - anchor.x;
    var dy = ny - anchor.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    var max = LENGTH + 80;
    if (d > max) {
      nx = anchor.x + (dx / d) * max;
      ny = anchor.y + (dy / d) * max;
    }
    var now = performance.now();
    var ms = Math.max(8, now - grab.t);
    v.x = ((nx - p.x) / ms) * 1000;
    v.y = ((ny - p.y) / ms) * 1000;
    grab.t = now;
    p.x = nx;
    p.y = ny;
    draw();
  }

  function up() {
    if (!grab) return;
    var pulled = p.y - anchor.y - LENGTH > PULL;
    grab = null;
    root.classList.remove('btn-pull-cord--armed');
    if (pulled) toggle();
    kick();
  }

  function click() {
    toggle();
    v.y += 320; // a tug on the cord
    kick();
  }

  function measure() {
    anchor.x = button.offsetLeft + button.offsetWidth / 2;
    anchor.y = button.offsetTop + button.offsetHeight;
    if (!raf && !grab) {
      p.x = anchor.x;
      p.y = anchor.y + LENGTH;
    }
    draw();
  }

  var ro = new ResizeObserver(measure);
  ro.observe(root);
  measure();
  bead.addEventListener('pointerdown', down);
  bead.addEventListener('pointermove', move);
  bead.addEventListener('pointerup', up);
  bead.addEventListener('pointercancel', up);
  button.addEventListener('click', click);

  return function () {
    ro.disconnect();
    cancelAnimationFrame(raf);
    bead.removeEventListener('pointerdown', down);
    bead.removeEventListener('pointermove', move);
    bead.removeEventListener('pointerup', up);
    bead.removeEventListener('pointercancel', up);
    button.removeEventListener('click', click);
  };
}

document.querySelectorAll('.btn-pull-cord').forEach(initBtnPullCord);
