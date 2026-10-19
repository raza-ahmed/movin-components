function initRadioDrum(root) {
  var win = root.querySelector('.radio-drum__window');
  var inputs = Array.prototype.slice.call(root.querySelectorAll('.radio-drum__input'));
  if (!win || !inputs.length) return;
  var wheelAcc = 0;
  var drag = null;
  var frame = 0;

  function index() {
    for (var i = 0; i < inputs.length; i++) if (inputs[i].checked) return i;
    return 0;
  }

  function turn() {
    root.style.setProperty('--radio-drum-sel', String(index()));
  }

  // Select like a click would, so the change event fires as usual.
  function pick(i) {
    var c = Math.max(0, Math.min(inputs.length - 1, i));
    if (inputs[c].checked) return;
    inputs[c].checked = true;
    inputs[c].dispatchEvent(new Event('change', { bubbles: true }));
  }

  // One row per 40px of wheel travel, whichever device sends it.
  function wheel(e) {
    e.preventDefault();
    wheelAcc += e.deltaY;
    if (Math.abs(wheelAcc) < 40) return;
    pick(index() + (wheelAcc > 0 ? 1 : -1));
    wheelAcc = 0;
  }

  // Drag: one row per 30px; a drag never also counts as a click.
  function down(e) {
    if (e.button !== 0) return;
    drag = { y: e.clientY, from: index(), moved: false };
  }
  function move(e) {
    if (!drag) return;
    var rows = Math.round((drag.y - e.clientY) / 30);
    if (rows !== 0 && !drag.moved) {
      drag.moved = true;
      win.setPointerCapture(e.pointerId);
    }
    if (drag.moved) pick(drag.from + rows);
  }
  function up() {
    if (drag && drag.moved) {
      win.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(function () {
        win.removeEventListener('click', swallow, { capture: true });
      }, 0);
    }
    drag = null;
  }
  function swallow(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  root.addEventListener('change', turn);
  win.addEventListener('wheel', wheel, { passive: false });
  win.addEventListener('pointerdown', down);
  win.addEventListener('pointermove', move);
  win.addEventListener('pointerup', up);
  win.addEventListener('pointercancel', up);
  turn();
  frame = requestAnimationFrame(function () {
    root.classList.add('radio-drum--ready');
  });
  return function () {
    cancelAnimationFrame(frame);
    root.removeEventListener('change', turn);
    win.removeEventListener('wheel', wheel);
    win.removeEventListener('pointerdown', down);
    win.removeEventListener('pointermove', move);
    win.removeEventListener('pointerup', up);
    win.removeEventListener('pointercancel', up);
  };
}

document.querySelectorAll('.radio-drum').forEach(initRadioDrum);
