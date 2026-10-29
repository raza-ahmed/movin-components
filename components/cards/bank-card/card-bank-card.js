function initCardBankCard(root) {
  var number = root.querySelector('.card-bank-card__number');
  if (!number) return;
  var REAL = '4532 9187 2201 4821';
  var MASKED = '•••• •••• •••• 4821';
  var timer = 0;
  // Scramble toward the real number: each digit cycles random numbers, then locks, left to right.
  function reveal() {
    clearInterval(timer);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      number.textContent = REAL;
      return;
    }
    var frame = 0;
    timer = setInterval(function () {
      frame += 1;
      var locked = Math.floor(frame / 1.4);
      number.textContent = REAL.split('').map(function (c, i) {
        return c === ' ' || i < locked || i >= 15 ? c : String(Math.floor(Math.random() * 10));
      }).join('');
      if (locked >= 15) clearInterval(timer);
    }, 35);
  }
  function mask() {
    clearInterval(timer);
    number.textContent = MASKED;
  }
  root.addEventListener('pointerenter', reveal);
  root.addEventListener('pointerleave', mask);
  root.addEventListener('focus', reveal);
  root.addEventListener('blur', mask);
  return function () {
    clearInterval(timer);
    root.removeEventListener('pointerenter', reveal);
    root.removeEventListener('pointerleave', mask);
    root.removeEventListener('focus', reveal);
    root.removeEventListener('blur', mask);
  };
}

document.querySelectorAll('.card-bank-card').forEach(initCardBankCard);
