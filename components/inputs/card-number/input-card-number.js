function initFieldCardNumber(root) {
  var inputs = root.querySelectorAll('.field-card-number__input');
  var num = inputs[0];
  var cvc = inputs[1];
  var cvcOut = root.querySelector('.field-card-number__cvc');
  function onNum() {
    var d = num.value.replace(/\D/g, '').slice(0, 16);
    num.value = d.replace(/(\d{4})(?=\d)/g, '$1 ');
    root.querySelectorAll('.field-card-number__d').forEach(function (el, k) {
      var typed = k < d.length;
      // A digit that has just been typed is a fresh element, so it drops in from the start.
      if (typed !== el.hasAttribute('data-typed')) {
        var fresh = el.cloneNode(false);
        fresh.toggleAttribute('data-typed', typed);
        el.replaceWith(fresh);
        el = fresh;
      }
      el.textContent = typed ? d[k] : '•';
    });
  }
  function onCvc() {
    cvc.value = cvc.value.replace(/\D/g, '').slice(0, 3);
    cvcOut.textContent = cvc.value.padEnd(3, '•');
  }
  // The card turns over to its signature strip while the security code has focus.
  function front() { root.removeAttribute('data-back'); }
  function back() { root.setAttribute('data-back', ''); }
  num.addEventListener('input', onNum);
  num.addEventListener('focus', front);
  cvc.addEventListener('input', onCvc);
  cvc.addEventListener('focus', back);
  cvc.addEventListener('blur', front);
  return function () {
    num.removeEventListener('input', onNum);
    num.removeEventListener('focus', front);
    cvc.removeEventListener('input', onCvc);
    cvc.removeEventListener('focus', back);
    cvc.removeEventListener('blur', front);
  };
}

document.querySelectorAll('.field-card-number').forEach(initFieldCardNumber);
