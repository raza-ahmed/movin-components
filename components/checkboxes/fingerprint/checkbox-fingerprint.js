function initCbFingerprint(root) {
  var input = root.querySelector('.cb-fingerprint__input');
  if (!input) return;
  var timer = 0;
  var holding = false;

  function hold() {
    var ms = parseFloat(getComputedStyle(root).getPropertyValue('--cb-fingerprint-hold')) || 700;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms;
  }

  function stop() {
    clearTimeout(timer);
    holding = false;
    root.classList.remove('cb-fingerprint--holding');
  }

  // Holding to the end toggles it; the change event fires like a real click.
  function down(e) {
    if (e.button !== 0) return;
    holding = true;
    root.classList.add('cb-fingerprint--holding');
    timer = setTimeout(function () {
      stop();
      input.checked = !input.checked;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, hold());
  }

  // A pointer click must not toggle on its own; only the hold does.
  // Keyboard clicks (detail 0) pass through, so Space still works.
  function click(e) {
    if (e.detail !== 0) e.preventDefault();
  }

  // A long press must not open the touch context menu mid-hold.
  function menu(e) {
    if (holding) e.preventDefault();
  }

  root.addEventListener('pointerdown', down);
  root.addEventListener('pointerup', stop);
  root.addEventListener('pointerleave', stop);
  root.addEventListener('pointercancel', stop);
  root.addEventListener('click', click);
  root.addEventListener('contextmenu', menu);

  return function () {
    stop();
    root.removeEventListener('pointerdown', down);
    root.removeEventListener('pointerup', stop);
    root.removeEventListener('pointerleave', stop);
    root.removeEventListener('pointercancel', stop);
    root.removeEventListener('click', click);
    root.removeEventListener('contextmenu', menu);
  };
}

document.querySelectorAll('.cb-fingerprint').forEach(initCbFingerprint);
