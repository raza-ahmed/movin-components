function initCardScrubber(root) {
  var canvas = root.querySelector('canvas');
  var ruler = root.querySelector('.card-scrubber__ruler');
  var probe = root.querySelector('.card-scrubber__probe');
  var panel = root.querySelector('.card-scrubber__panel');
  if (!canvas || !ruler || !probe || !panel) return;
  var W = 252;
  var H = 58;
  var GAP = 26; // px per day
  var DAYS = 30;
  var MAX = (DAYS - 1) * GAP;
  var EVENTS = {
    2: [['09:30', 'Sprint planning']],
    4: [['14:00', 'Design review']],
    6: [['15:30', 'Demo day'], ['19:00', 'Team dinner']],
    9: [['11:00', 'User interviews']],
    12: [['10:00', 'Launch'], ['11:30', 'Press call']],
    13: [['16:00', 'Retro']],
    17: [['08:45', 'Flight to Lisbon']],
    18: [['All day', 'Motion meetup']],
    20: [['13:00', 'Portfolio review']],
    24: [['10:00', 'Quarterly planning'], ['15:00', '1:1 with Maya']],
    26: [['18:30', 'Climbing']],
    30: [['17:00', 'Month wrap-up']],
  };
  function label(d) { return new Date(2026, 10, d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }); }
  var dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var s = { pos: 11 * GAP, vel: 0, mode: 'snap', target: 11 * GAP, day: 12, hold: 0, drag: null };
  var last = performance.now();
  var raf = 0;

  // The day panel, rebuilt with a flip-in from the direction of travel.
  function showDay(d, dir) {
    var old = panel.querySelector('.card-scrubber__day');
    var el = document.createElement('div');
    el.className = 'card-scrubber__day';
    el.style.setProperty('--from', dir * 10 + 'px');
    el.style.setProperty('--tilt', dir * -50 + 'deg');
    var date = document.createElement('div');
    date.className = 'card-scrubber__date';
    date.textContent = label(d);
    el.appendChild(date);
    var events = EVENTS[d];
    if (events) {
      var ul = document.createElement('ul');
      ul.className = 'card-scrubber__events';
      events.forEach(function (ev) {
        var li = document.createElement('li');
        var t = document.createElement('time');
        t.textContent = ev[0];
        li.appendChild(t);
        li.appendChild(document.createTextNode(ev[1]));
        ul.appendChild(li);
      });
      el.appendChild(ul);
    } else {
      var none = document.createElement('div');
      none.className = 'card-scrubber__events card-scrubber__none';
      none.textContent = 'Nothing planned';
      el.appendChild(none);
    }
    if (old) old.replaceWith(el);
    else panel.appendChild(el);
    ruler.setAttribute('aria-valuenow', String(d));
    ruler.setAttribute('aria-valuetext', new Date(2026, 10, d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }));
  }

  function tick(now) {
    var dt = Math.min(0.04, (now - last) / 1000);
    last = now;
    if (s.mode === 'free') {
      // A flick glides on, slowing like a wheel on a bearing; past either end it is pulled back.
      s.vel *= Math.exp(-dt * 2.6);
      if (s.pos < 0 || s.pos > MAX) s.vel += ((s.pos < 0 ? 0 : MAX) - s.pos) * 60 * dt - s.vel * 8 * dt;
      s.pos += s.vel * dt;
      // Wheel input holds the ruler where it is until the scrolling stops, then it snaps.
      if (Math.abs(s.vel) < 90 && now > s.hold) {
        s.mode = 'snap';
        s.target = Math.max(0, Math.min(MAX, Math.round(s.pos / GAP) * GAP));
      }
    } else if (s.mode === 'snap') {
      if (still) {
        s.pos = s.target;
        s.vel = 0;
      } else {
        s.vel += ((s.target - s.pos) * 170 - s.vel * 20) * dt;
        s.pos += s.vel * dt;
      }
    }
    var d = Math.max(1, Math.min(DAYS, Math.round(s.pos / GAP) + 1));
    if (d !== s.day) {
      showDay(d, d > s.day ? 1 : -1);
      s.day = d;
    }
    var dim = getComputedStyle(probe.children[0]).color;
    var ink = getComputedStyle(probe.children[1]).color;
    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = 'center';
    for (var i = 0; i < DAYS; i++) {
      for (var sub = 0; sub < 4; sub++) {
        var x = W / 2 + i * GAP + (sub * GAP) / 4 - s.pos;
        if (x < -10 || x > W + 10 || (i === DAYS - 1 && sub)) continue;
        // Fisheye: everything near the needle swells.
        var mag = Math.exp(-Math.pow((x - W / 2) / 42, 2));
        var major = sub === 0;
        var len = major ? 9 + 15 * mag : 4 + 5 * mag;
        ctx.globalAlpha = major ? 0.45 + 0.55 * mag : 0.35;
        ctx.fillStyle = major && mag > 0.85 ? ink : dim;
        ctx.fillRect(x - (major ? 0.75 : 0.5), H - len, major ? 1.5 : 1, len);
        if (!major) continue;
        ctx.font = (mag > 0.85 ? 600 : 500) + ' ' + (9 + 5 * mag).toFixed(1) + 'px system-ui, sans-serif';
        ctx.fillText(String(i + 1), x, 14 + (1 - mag) * 2);
        if (EVENTS[i + 1]) {
          ctx.beginPath();
          ctx.arc(x, 21 + mag * 2, 1.6 + mag, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(tick);
  }

  function go(d) {
    s.mode = 'snap';
    s.target = (Math.max(1, Math.min(DAYS, d)) - 1) * GAP;
  }
  function down(e) {
    ruler.setPointerCapture(e.pointerId);
    s.mode = 'drag';
    s.vel = 0;
    s.drag = { x: e.clientX, pos: s.pos, hist: [[performance.now(), e.clientX]] };
  }
  function move(e) {
    if (s.mode !== 'drag') return;
    var p = s.drag.pos - (e.clientX - s.drag.x);
    s.pos = p < 0 ? p * 0.35 : p > MAX ? MAX + (p - MAX) * 0.35 : p;
    s.drag.hist = s.drag.hist.concat([[performance.now(), e.clientX]]).slice(-5);
  }
  function up() {
    if (s.mode !== 'drag') return;
    // Release velocity from the last few moves, so a flick carries on.
    var h = s.drag.hist;
    var a = h[0];
    var b = h[h.length - 1];
    var v = b[0] > a[0] ? -((b[1] - a[1]) / (b[0] - a[0])) * 1000 : 0;
    s.vel = performance.now() - b[0] > 80 ? 0 : v;
    s.mode = 'free';
  }
  function key(e) {
    var step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (step) {
      e.preventDefault();
      go(s.day + step);
    }
    if (e.key === 'Home') go(1);
    if (e.key === 'End') go(DAYS);
  }
  // Wheel and trackpad scroll the ruler; not passive, so the page doesn't scroll with it.
  function wheel(e) {
    e.preventDefault();
    s.mode = 'free';
    s.pos = Math.max(-GAP, Math.min(MAX + GAP, s.pos + (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY)));
    s.vel = 0;
    s.hold = performance.now() + 140;
  }
  ruler.addEventListener('pointerdown', down);
  ruler.addEventListener('pointermove', move);
  ruler.addEventListener('pointerup', up);
  ruler.addEventListener('keydown', key);
  ruler.addEventListener('wheel', wheel, { passive: false });
  raf = requestAnimationFrame(tick);

  return function () {
    cancelAnimationFrame(raf);
    ruler.removeEventListener('pointerdown', down);
    ruler.removeEventListener('pointermove', move);
    ruler.removeEventListener('pointerup', up);
    ruler.removeEventListener('keydown', key);
    ruler.removeEventListener('wheel', wheel);
  };
}

document.querySelectorAll('.card-scrubber').forEach(initCardScrubber);
