function initRadioChess(root) {
  var flip = 0;
  // Each change flips data-flip between a and b, so the keyframes restart every time.
  function onChange() {
    flip += 1;
    root.setAttribute('data-flip', flip % 2 ? 'a' : 'b');
  }
  root.addEventListener('change', onChange);
  return function () { root.removeEventListener('change', onChange); };
}

document.querySelectorAll('.radio-chess').forEach(initRadioChess);
