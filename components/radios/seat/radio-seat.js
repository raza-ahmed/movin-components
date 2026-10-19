function initRadioSeat(root) {
  var code = root.querySelector('.radio-seat__code');
  if (!code) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Roll the ticket to the new seat: the old code leaves upward as the new
  // one rises in.
  function roll() {
    var input = root.querySelector('.radio-seat__input:checked');
    if (!input) return;
    Array.prototype.forEach.call(code.children, function (old) {
      if (reduce) return old.remove();
      old.className = 'radio-seat__code-out';
      setTimeout(function () {
        old.remove();
      }, 260);
    });
    var next = document.createElement('span');
    next.className = 'radio-seat__code-in';
    next.textContent = input.value;
    code.appendChild(next);
  }

  root.addEventListener('change', roll);
  if (root.querySelector('.radio-seat__input:checked')) {
    code.textContent = '';
    roll();
  }
  return function () {
    root.removeEventListener('change', roll);
  };
}

document.querySelectorAll('.radio-seat').forEach(initRadioSeat);
