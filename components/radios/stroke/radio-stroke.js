function initRadioStroke(root) {
  var flip = 0;
  // Each change flips data-flip between a and b, so the march along the line restarts every time.
  function onChange() {
    flip += 1;
    root.setAttribute('data-flip', flip % 2 ? 'a' : 'b');
  }
  root.addEventListener('change', onChange);
  return function () { root.removeEventListener('change', onChange); };
}

document.querySelectorAll('.radio-stroke').forEach(initRadioStroke);
