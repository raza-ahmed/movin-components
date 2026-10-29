function initFieldScramble(root) {
  var keys = root.querySelectorAll('.field-scramble__key');
  var dotsEl = root.querySelector('.field-scramble__dots');
  var dots = root.querySelectorAll('.field-scramble__dot');
  var status = root.querySelector('.field-scramble__status');
  if (keys.length !== 12 || !dotsEl || dots.length !== 4 || !status) return;
  var DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  var DIGIT_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10];
  var digitKeys = Array.prototype.slice.call(keys, 0, 10);
  var clear = keys[10];
  var del = keys[11];
  var pin = '';
  var timer = 0;
  function slot(i) { return 'translate(' + (i % 3) * 59 + 'px, ' + Math.floor(i / 3) * 44 + 'px)'; }
  function shuffle() {
    var a = DIGITS.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }
  function render() {
    var done = pin.length === 4;
    dots.forEach(function (d, i) { d.toggleAttribute('data-on', i < pin.length); });
    dotsEl.toggleAttribute('data-done', done);
    dotsEl.setAttribute('aria-label', pin.length + ' of 4 digits entered');
    status.textContent = done ? 'PIN entered' : '';
  }
  function press(e) {
    if (pin.length === 4) return;
    pin += e.currentTarget.textContent.trim();
    // Reshuffle so the finger pattern gives nothing away.
    var order = shuffle();
    digitKeys.forEach(function (k) { k.style.transform = slot(DIGIT_SLOTS[order.indexOf(k.textContent.trim())]); });
    if (pin.length === 4) timer = setTimeout(function () { pin = ''; render(); }, 1600);
    render();
  }
  function reset() { pin = ''; render(); }
  function back() { pin = pin.slice(0, -1); render(); }
  digitKeys.forEach(function (k) { k.addEventListener('click', press); });
  clear.addEventListener('click', reset);
  del.addEventListener('click', back);
  return function () {
    clearTimeout(timer);
    digitKeys.forEach(function (k) { k.removeEventListener('click', press); });
    clear.removeEventListener('click', reset);
    del.removeEventListener('click', back);
  };
}

document.querySelectorAll('.field-scramble').forEach(initFieldScramble);
