function initFieldOdometer(root) {
  var value = root.querySelector('.field-odometer__value');
  var wheels = root.querySelectorAll('.field-odometer__digit');
  var steps = root.querySelectorAll('[data-field-odometer-step]');
  if (!value || wheels.length !== 2) return;
  var min = Number(value.getAttribute('aria-valuemin')) || 0;
  var max = Number(value.getAttribute('aria-valuemax')) || 99;
  var unit = value.getAttribute('data-unit') || '';
  var n = Number(value.getAttribute('aria-valuenow')) || min;
  var drag = null;

  wheels.forEach(function (w) {
    var strip = document.createElement('span');
    strip.className = 'field-odometer__strip';
    for (var i = 0; i < 10; i++) {
      var d = document.createElement('span');
      d.textContent = String(i);
      strip.appendChild(d);
    }
    w.appendChild(strip);
  });

  // Pushing past either end nudges the number toward the way it was pushed.
  function limit(dir) {
    root.style.setProperty('--field-odometer-dir', dir * 4 + 'px');
    root.classList.remove('field-odometer--limit');
    void root.offsetWidth;
    root.classList.add('field-odometer--limit');
  }

  function set(v) {
    var c = Math.max(min, Math.min(max, v));
    if (c !== v) limit(v > c ? 1 : -1);
    n = c;
    value.setAttribute('aria-valuenow', String(n));
    value.setAttribute('aria-valuetext', unit ? n + ' ' + unit : String(n));
    wheels[0].style.setProperty('--field-odometer-d', String(Math.floor(n / 10) % 10));
    wheels[1].style.setProperty('--field-odometer-d', String(n % 10));
    root.classList.toggle('field-odometer--single', n < 10);
    steps.forEach(function (b) {
      var s = Number(b.getAttribute('data-field-odometer-step'));
      b.setAttribute('aria-disabled', String(s < 0 ? n <= min : n >= max));
    });
  }

  function click(e) {
    var b = e.target.closest('[data-field-odometer-step]');
    if (b) set(n + Number(b.getAttribute('data-field-odometer-step')));
  }

  function key(e) {
    var to = {
      ArrowUp: n + 1,
      ArrowRight: n + 1,
      ArrowDown: n - 1,
      ArrowLeft: n - 1,
      PageUp: n + 10,
      PageDown: n - 10,
      Home: min,
      End: max,
    }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    set(to);
  }

  // Scrub: every 14px of sideways drag is one step.
  function down(e) {
    if (e.button !== 0) return;
    drag = { x: e.clientX, from: n, at: n };
    value.setPointerCapture(e.pointerId);
    value.focus();
  }
  function move(e) {
    if (!drag) return;
    var to = drag.from + Math.trunc((e.clientX - drag.x) / 14);
    if (to !== drag.at) {
      drag.at = to;
      set(to);
    }
  }
  function up() {
    drag = null;
  }

  root.addEventListener('click', click);
  value.addEventListener('keydown', key);
  value.addEventListener('pointerdown', down);
  value.addEventListener('pointermove', move);
  value.addEventListener('pointerup', up);
  value.addEventListener('pointercancel', up);
  set(n);
  return function () {
    root.removeEventListener('click', click);
    value.removeEventListener('keydown', key);
    value.removeEventListener('pointerdown', down);
    value.removeEventListener('pointermove', move);
    value.removeEventListener('pointerup', up);
    value.removeEventListener('pointercancel', up);
    wheels.forEach(function (w) {
      w.textContent = '';
    });
  };
}

document.querySelectorAll('.field-odometer').forEach(initFieldOdometer);
