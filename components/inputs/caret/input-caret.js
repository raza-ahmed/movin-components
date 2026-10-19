function initFieldCaret(root) {
  var input = root.querySelector('.field-caret__input');
  var box = root.querySelector('.field-caret__box');
  var tail = root.querySelector('.field-caret__tail');
  if (!input || !box) return;
  var ctx = document.createElement('canvas').getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var x = null;
  var timer = 0;

  // Caret x inside the box: padding + width of the text before it - scroll.
  function measure() {
    var cs = getComputedStyle(input);
    ctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    var pl = parseFloat(cs.paddingLeft);
    var text = input.value.slice(0, input.selectionEnd || 0);
    var at = pl + ctx.measureText(text).width - input.scrollLeft;
    return Math.max(pl - 1, Math.min(input.clientWidth - parseFloat(cs.paddingRight), at));
  }

  function update() {
    var on = document.activeElement === input && input.selectionStart === input.selectionEnd;
    root.classList.toggle('field-caret--on', on);
    if (!on || !ctx) return;
    var nx = measure();
    if (nx === x) return;
    // A streak from where it was to where it is going, shrinking into the caret.
    if (x !== null && tail && !reduce && Math.abs(nx - x) > 3) {
      var from = Math.min(x, nx);
      var w = Math.abs(nx - x);
      tail.animate(
        [
          { opacity: 1, transform: 'translateX(' + from + 'px) scaleX(' + w + ')' },
          { opacity: 0, transform: 'translateX(' + nx + 'px) scaleX(1)' },
        ],
        { duration: 260, easing: 'cubic-bezier(0.2, 0, 0, 1)' }
      );
      tail.classList.toggle('field-caret__tail--left', nx < x);
    }
    x = nx;
    box.style.setProperty('--field-caret-x', nx.toFixed(1) + 'px');
    // Solid while moving; blink only once it rests.
    root.classList.add('field-caret--moving');
    clearTimeout(timer);
    timer = setTimeout(function () {
      root.classList.remove('field-caret--moving');
    }, 500);
  }

  function selection() {
    if (document.activeElement === input) update();
  }

  function blur() {
    x = null;
    update();
  }

  input.addEventListener('input', update);
  input.addEventListener('focus', update);
  input.addEventListener('blur', blur);
  input.addEventListener('scroll', update);
  document.addEventListener('selectionchange', selection);
  return function () {
    clearTimeout(timer);
    input.removeEventListener('input', update);
    input.removeEventListener('focus', update);
    input.removeEventListener('blur', blur);
    input.removeEventListener('scroll', update);
    document.removeEventListener('selectionchange', selection);
  };
}

document.querySelectorAll('.field-caret').forEach(initFieldCaret);
