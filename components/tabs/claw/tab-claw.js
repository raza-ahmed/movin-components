function initTabsClaw(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var W = 240;
  var PAD = 8;
  var COL = (W - 2 * PAD) / n;
  var REST = 54; // chip top, sitting in its slot
  var PIVOT = 12; // where the cable leaves the carriage
  var HUB = 4; // cable end to the top of the chip it holds
  var LOW = REST - PIVOT - HUB; // cable length down on a chip
  var DROP = LOW - 7; // lets go a little above the slot
  var HIGH = 10; // cable length with the claw up
  var OPEN = 24; // prong angle when open, in degrees
  var shadows = root.querySelectorAll('.tabs-claw__shadow');
  var carriage = root.querySelector('.tabs-claw__carriage');
  var swing = root.querySelector('.tabs-claw__rig > g');
  var cable = root.querySelector('.tabs-claw__cable');
  var head = cable.nextElementSibling;
  var prongs = root.querySelectorAll('.tabs-claw__prong');
  var raf = 0;
  function home(i) { return PAD + i * COL + COL / 2; }
  function loose() { return { held: false, dx: 0, dy: 0, r: 0, vx: 0, vy: 0, vr: 0 }; }
  function holding(i) {
    var chips = tabs.map(loose);
    chips[i].held = true;
    chips[i].dy = PIVOT + HIGH + HUB - REST;
    return { x: home(i), L: HIGH, th: 0, g: 1, vx: 0, vL: 0, vth: 0, vg: 0, closing: false, chips: chips };
  }
  var p = holding(sel);
  // Where the cable ends, swung through th radians about the carriage.
  function tip() { return { x: p.x - (p.L + HUB) * Math.sin(p.th), y: PIVOT + (p.L + HUB) * Math.cos(p.th) }; }
  function draw() {
    var open = OPEN * (1 - p.g);
    carriage.setAttribute('x', p.x - 11);
    swing.setAttribute('transform', 'translate(' + p.x + ' ' + PIVOT + ') rotate(' + (p.th * 180) / Math.PI + ')');
    cable.setAttribute('y2', p.L);
    head.setAttribute('transform', 'translate(0 ' + p.L + ')');
    prongs[0].setAttribute('transform', 'translate(-9 2) rotate(' + open + ')');
    prongs[1].setAttribute('transform', 'translate(9 2) rotate(' + -open + ')');
    p.chips.forEach(function (c, i) {
      var lift = Math.min(1, -c.dy / 30);
      tabs[i].style.transform = 'translate(' + c.dx + 'px, ' + c.dy + 'px) rotate(' + c.r + 'rad)';
      tabs[i].toggleAttribute('data-held', c.held);
      shadows[i].style.left = home(i) + c.dx + 'px';
      shadows[i].style.opacity = String(1 - lift * 0.75);
      shadows[i].style.transform = 'scaleX(' + (1 - lift * 0.45) + ')';
    });
  }
  // The claw works through a chore list every frame, so a new pick can cut in at any point: put back
  // the chip it holds, rise, ride the gantry over, drop open, close on the chip and lift it out. It
  // hangs from a cable, so starting and stopping set it swinging.
  function step(now, last) {
    var dt = Math.min(0.032, (now - last) / 1000);
    var held = p.chips.findIndex(function (c) { return c.held; });
    var tx = p.x;
    var tL = HIGH;
    var tg = p.g;
    var t;
    if (held >= 0 && held !== sel) {
      tL = DROP;
      tg = p.L > DROP - 1.5 ? 0 : 1;
      if (p.g < 0.6) {
        // Let go: the chip drops the last few pixels into its slot.
        t = tip();
        p.chips[held] = { held: false, dx: t.x - home(held), dy: t.y - REST, r: p.th, vx: 0, vy: p.vL * Math.cos(p.th), vr: p.vth };
      }
    } else if (held < 0) {
      tg = 0;
      if (Math.abs(p.x - home(sel)) > 2.5 || Math.abs(p.vx) > 60) {
        p.closing = false;
        if (p.L < HIGH + 10) tx = home(sel);
      } else {
        tx = home(sel);
        tL = LOW;
        // Only close once it is down on the chip, then keep closing.
        p.closing = p.closing || p.L > LOW - 1;
        if (p.closing) tg = 1;
        if (p.g > 0.92) {
          p.chips[sel] = loose();
          p.chips[sel].held = true;
          p.closing = false;
        }
      }
    } else {
      tx = home(sel);
      tg = 1;
    }
    var ax = 170 * (tx - p.x) - 26 * p.vx;
    p.vx += ax * dt;
    p.x += p.vx * dt;
    p.vL += (650 * (tL - p.L) - 51 * p.vL) * dt;
    p.L += p.vL * dt;
    p.vg += (1100 * (tg - p.g) - 66 * p.vg) * dt;
    p.g = Math.max(0, Math.min(1, p.g + p.vg * dt));
    // A pendulum on the cable: shorter swings faster, and the carriage's pull sets it going.
    p.vth += ((-2400 / (p.L + 20)) * p.th - 5 * p.vth + 0.0008 * ax) * dt;
    p.th += p.vth * dt;
    var busy = Math.abs(p.x - home(sel)) > 0.2 || Math.abs(p.vx) > 1 || Math.abs(p.L - HIGH) > 0.2 || Math.abs(p.vL) > 1;
    busy = busy || p.g < 0.99 || Math.abs(p.th) > 0.002 || Math.abs(p.vth) > 0.02 || held !== sel;
    t = tip();
    p.chips.forEach(function (c, i) {
      if (c.held) {
        c.dx = t.x - home(i);
        c.dy = t.y - REST;
        c.r = p.th;
        return;
      }
      // Loose chips fall under gravity, bounce once or twice and straighten up.
      c.vy += 2600 * dt;
      c.dy += c.vy * dt;
      if (c.dy > 0) {
        c.dy = 0;
        c.vy = Math.abs(c.vy) < 40 ? 0 : -c.vy * 0.35;
      }
      c.vx += (-300 * c.dx - 30 * c.vx) * dt;
      c.dx += c.vx * dt;
      c.vr += (-500 * c.r - 26 * c.vr) * dt;
      c.r += c.vr * dt;
      busy = busy || c.dy < -0.1 || Math.abs(c.vy) > 0 || Math.abs(c.dx) > 0.1 || Math.abs(c.r) > 0.002;
    });
    if (!busy) p = holding(sel);
    draw();
    if (busy) raf = requestAnimationFrame(function (next) { step(next, now); });
  }
  function run() {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      p = holding(sel);
      return draw();
    }
    var now = performance.now();
    raf = requestAnimationFrame(function (next) { step(next, now); });
  }

  function select(i) {
    if (i === sel) return;
    var prev = sel;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    run();
  }
  function onClick(e) {
    var tab = e.target.closest('[role="tab"]');
    if (tab) select(tabs.indexOf(tab));
  }
  function onKeyDown(e) {
    var next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabs[next].focus();
  }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  return function () {
    cancelAnimationFrame(raf);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-claw').forEach(initTabsClaw);
