function initCardRings(root) {
  var flip = 0;
  // Each visit flips data-flip between a and b, so the rings close again from empty.
  function replay() {
    flip += 1;
    root.setAttribute('data-flip', flip % 2 ? 'a' : 'b');
  }
  root.addEventListener('pointerenter', replay);
  root.addEventListener('focus', replay);
  return function () {
    root.removeEventListener('pointerenter', replay);
    root.removeEventListener('focus', replay);
  };
}

document.querySelectorAll('.card-rings').forEach(initCardRings);
