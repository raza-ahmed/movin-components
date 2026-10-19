function initRadioDelivery(root) {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var x = null;
  var timer = 0;
  var frame = 0;

  // The truck parks at the arrival day, as a fraction of the week.
  function place() {
    var input = root.querySelector('.radio-delivery__input:checked');
    if (!input) return;
    var nx = Math.min(1, Number(input.getAttribute('data-days')) / 7);
    if (x !== null && nx !== x) {
      root.classList.toggle('radio-delivery--back', nx < x);
      root.classList.add('radio-delivery--moving');
      clearTimeout(timer);
      timer = setTimeout(
        function () {
          root.classList.remove('radio-delivery--moving');
        },
        reduce ? 0 : 800
      );
    }
    x = nx;
    root.style.setProperty('--radio-delivery-x', String(nx));
  }

  root.addEventListener('change', place);
  place();
  // Park without driving on load; animate from then on.
  frame = requestAnimationFrame(function () {
    root.classList.add('radio-delivery--ready');
  });
  return function () {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    root.removeEventListener('change', place);
  };
}

document.querySelectorAll('.radio-delivery').forEach(initRadioDelivery);
