function initFieldPeek(root) {
  var input = root.querySelector('.field-peek__input');
  var toggle = root.querySelector('.field-peek__toggle');
  if (!input || !toggle) return;
  var ctx = document.createElement('canvas').getContext('2d');

  // Where the caret sits across the visible text, from -1 (left edge) to 1.
  function look() {
    if (!ctx || input.type === 'password' || document.activeElement !== input) {
      root.style.setProperty('--field-peek-x', '0px');
      return;
    }
    var cs = getComputedStyle(input);
    ctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    var text = input.value.slice(0, input.selectionEnd || 0);
    var spacing = parseFloat(cs.letterSpacing) || 0;
    var x = ctx.measureText(text).width + spacing * text.length - input.scrollLeft;
    var t = Math.max(0, Math.min(1, x / input.clientWidth)) * 2 - 1;
    root.style.setProperty('--field-peek-x', (t * 4.5).toFixed(2) + 'px');
  }

  // Switching the type resets the selection in some browsers; keep it.
  function flip() {
    var a = input.selectionStart;
    var b = input.selectionEnd;
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    root.classList.toggle('field-peek--shown', show);
    toggle.setAttribute('aria-pressed', String(show));
    toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    input.focus();
    if (a !== null) input.setSelectionRange(a, b);
    look();
  }

  function selection() {
    if (document.activeElement === input) look();
  }

  // Keep focus in the field when the eye is pressed with a pointer.
  function down(e) {
    e.preventDefault();
  }

  toggle.addEventListener('click', flip);
  toggle.addEventListener('pointerdown', down);
  input.addEventListener('input', look);
  input.addEventListener('blur', look);
  input.addEventListener('scroll', look);
  document.addEventListener('selectionchange', selection);
  return function () {
    toggle.removeEventListener('click', flip);
    toggle.removeEventListener('pointerdown', down);
    input.removeEventListener('input', look);
    input.removeEventListener('blur', look);
    input.removeEventListener('scroll', look);
    document.removeEventListener('selectionchange', selection);
  };
}

document.querySelectorAll('.field-peek').forEach(initFieldPeek);
