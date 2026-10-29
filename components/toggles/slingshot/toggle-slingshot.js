function initToggleSlingshot(root) {
  var input = root.querySelector('input');
  var track = root.querySelector('.toggle-slingshot__track');
  var thumb = root.querySelector('.toggle-slingshot__thumb');
  var band = root.querySelector('.toggle-slingshot__band path');
  if (!input || !track || !thumb || !band) return;
  var W = 88;
  var MID = W / 2;
  var OFF = 16;
  var ON = W - 16;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var s = { x: input.checked ? ON : OFF, v: 0, drag: null, moved: false };
  var last = performance.now();
  var raf = 0;

  function tick(now) {
    var dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    var target = input.checked ? ON : OFF;
    if (!s.drag) {
      if (still) {
        s.x = target;
        s.v = 0;
      } else {
        // A loose spring: it overshoots and settles like a ball on elastic.
        s.v += ((target - s.x) * 320 - s.v * 13) * dt;
        s.x += s.v * dt;
      }
    }
    thumb.style.transform = 'translateX(' + (s.x - 11).toFixed(2) + 'px)';
    // The band runs post, thumb, post; the further it stretches, the thinner it gets.
    band.setAttribute('d', 'M' + MID + ' 2 Q ' + s.x.toFixed(1) + ' 17 ' + MID + ' 32');
    band.style.strokeWidth = String(Math.max(1, 2.6 - Math.abs(s.x - MID) / 30));
    raf = requestAnimationFrame(tick);
  }
  function local(e) { return e.clientX - track.getBoundingClientRect().left; }
  function down(e) {
    thumb.setPointerCapture(e.pointerId);
    s.drag = { start: local(e), x0: s.x };
    s.moved = false;
  }
  function move(e) {
    if (!s.drag) return;
    var dx = local(e) - s.drag.start;
    if (Math.abs(dx) > 3) s.moved = true;
    s.x = Math.max(2, Math.min(W - 2, s.drag.x0 + dx));
    s.v = 0;
  }
  function up() {
    if (!s.drag) return;
    s.drag = null;
    if (!s.moved) return;
    // Pulled back past its rest and let go: fire across. Dragged over the middle: it lands there.
    var on = input.checked;
    var pulled = on ? s.x - ON : OFF - s.x;
    var crossed = on ? s.x < MID : s.x > MID;
    if (pulled > 4 || crossed) {
      s.v = (on ? -1 : 1) * Math.max(0, pulled) * 22;
      input.checked = !on;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  // A drag already decided the state; don't let the click that follows flip it back.
  function click(e) {
    if (s.moved) {
      e.preventDefault();
      s.moved = false;
    }
  }
  thumb.addEventListener('pointerdown', down);
  thumb.addEventListener('pointermove', move);
  thumb.addEventListener('pointerup', up);
  root.addEventListener('click', click);
  raf = requestAnimationFrame(tick);

  return function () {
    cancelAnimationFrame(raf);
    thumb.removeEventListener('pointerdown', down);
    thumb.removeEventListener('pointermove', move);
    thumb.removeEventListener('pointerup', up);
    root.removeEventListener('click', click);
  };
}

document.querySelectorAll('.toggle-slingshot').forEach(initToggleSlingshot);
