function initFieldCombination(root) {
  var dial = root.querySelector('.field-combination__dial');
  var slots = root.querySelectorAll('.field-combination__slot');
  var setBtn = root.querySelector('.field-combination__set');
  var slotsEl = root.querySelector('.field-combination__slots');
  var hint = root.querySelector('.field-combination__hint');
  if (!dial || slots.length !== 3 || !setBtn || !slotsEl || !hint) return;
  var N = 40;
  var STEP = 360 / N;
  var rot = 0;
  var code = [];
  var drag = null;

  function current() { return ((Math.round(-rot / STEP) % N) + N) % N; }
  function render() {
    var cur = current();
    var open = code.length === 3;
    var dir = code.length % 2 === 0 ? 'right' : 'left';
    dial.style.transform = 'rotate(' + rot + 'deg)';
    dial.setAttribute('aria-valuenow', String(cur));
    dial.setAttribute('aria-label', 'Dial, turn ' + dir);
    root.toggleAttribute('data-open', open);
    slots.forEach(function (s, i) {
      s.toggleAttribute('data-next', i === code.length);
      if (code[i] !== undefined) {
        if (!s.querySelector('b') || s.textContent !== String(code[i])) {
          s.textContent = '';
          var b = document.createElement('b');
          b.textContent = String(code[i]);
          s.appendChild(b);
        }
      } else s.textContent = i === code.length ? String(cur) : '';
    });
    slotsEl.setAttribute('aria-label', 'Entered: ' + (code.join(', ') || 'none'));
    setBtn.textContent = open ? 'Lock again' : 'Enter ' + cur;
    hint.textContent = open ? 'Open' : '';
  }
  function enter() {
    if (code.length === 3) code = [];
    else {
      var cur = current();
      code.push(cur);
      // Settle exactly on the number that was entered.
      rot = -cur * STEP + Math.round(rot / 360) * 360;
    }
    render();
  }
  function angle(e) {
    var r = dial.getBoundingClientRect();
    return (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180) / Math.PI;
  }
  function down(e) {
    dial.setPointerCapture(e.pointerId);
    drag = angle(e);
  }
  function move(e) {
    if (drag === null) return;
    var a = angle(e);
    rot += ((a - drag + 540) % 360) - 180;
    drag = a;
    render();
  }
  function up() {
    drag = null;
    rot = Math.round(rot / STEP) * STEP;
    render();
  }
  function key(e) {
    var k = { ArrowRight: -1, ArrowUp: -1, ArrowLeft: 1, ArrowDown: 1 }[e.key];
    if (k) {
      e.preventDefault();
      rot = Math.round(rot / STEP) * STEP + k * STEP;
      render();
    }
    if (e.key === 'Enter') enter();
  }
  dial.addEventListener('pointerdown', down);
  dial.addEventListener('pointermove', move);
  dial.addEventListener('pointerup', up);
  dial.addEventListener('keydown', key);
  setBtn.addEventListener('click', enter);
  return function () {
    dial.removeEventListener('pointerdown', down);
    dial.removeEventListener('pointermove', move);
    dial.removeEventListener('pointerup', up);
    dial.removeEventListener('keydown', key);
    setBtn.removeEventListener('click', enter);
  };
}

document.querySelectorAll('.field-combination').forEach(initFieldCombination);
