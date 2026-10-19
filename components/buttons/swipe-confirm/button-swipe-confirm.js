function initBtnSwipeConfirm(root) {
  var knob = root.querySelector('.btn-swipe-confirm__knob');
  if (!knob) return;
  var travel = 0;
  var p = 0;
  var start = null; // pointer x at p = 0 while dragging
  var moved = false;
  var done = false;
  var nudge = 0;

  function set(v) {
    p = v;
    root.style.setProperty('--btn-swipe-confirm-p', v.toFixed(4));
  }

  function measure() {
    travel = root.clientWidth - knob.offsetWidth - 2 * knob.offsetLeft;
    root.style.setProperty('--btn-swipe-confirm-travel', travel + 'px');
  }

  function confirm() {
    done = true;
    set(1);
    root.classList.add('btn-swipe-confirm--done');
    knob.setAttribute('aria-label', 'Confirmed. Activate to reset');
    root.dispatchEvent(new CustomEvent('confirm', { bubbles: true }));
  }

  function reset() {
    done = false;
    set(0);
    root.classList.remove('btn-swipe-confirm--done');
    knob.setAttribute('aria-label', 'Confirm');
  }

  function down(e) {
    if (done) return;
    start = e.clientX - p * travel;
    moved = false;
    knob.setPointerCapture(e.pointerId);
    root.classList.add('btn-swipe-confirm--drag');
  }

  function move(e) {
    if (start === null) return;
    var raw = (e.clientX - start) / travel;
    if (Math.abs(raw - p) * travel > 2) moved = true;
    set(Math.max(0, Math.min(1, raw)));
  }

  function up() {
    if (start === null) return;
    start = null;
    root.classList.remove('btn-swipe-confirm--drag');
    if (p > 0.9) confirm();
    else set(0); // springs home: the transition is back on
  }

  // A tap without a drag: keyboard slides it, a pointer gets a nudge as a hint.
  function click(e) {
    if (moved) {
      moved = false;
      return;
    }
    if (done) return reset();
    if (e.detail === 0) return confirm();
    clearTimeout(nudge);
    set(0.18);
    nudge = setTimeout(function () {
      if (!done) set(0);
    }, 180);
  }

  var ro = new ResizeObserver(measure);
  ro.observe(root);
  measure();
  knob.addEventListener('pointerdown', down);
  knob.addEventListener('pointermove', move);
  knob.addEventListener('pointerup', up);
  knob.addEventListener('pointercancel', up);
  knob.addEventListener('click', click);

  return function () {
    ro.disconnect();
    clearTimeout(nudge);
    knob.removeEventListener('pointerdown', down);
    knob.removeEventListener('pointermove', move);
    knob.removeEventListener('pointerup', up);
    knob.removeEventListener('pointercancel', up);
    knob.removeEventListener('click', click);
    reset();
  };
}

document.querySelectorAll('.btn-swipe-confirm').forEach(initBtnSwipeConfirm);
