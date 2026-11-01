function initCardAccordion(root) {
  var qs = root.querySelectorAll('.card-accordion__q');
  var panels = root.querySelectorAll('.card-accordion__panel');
  var open = 0;

  // Opening one closes the other; each answer animates its grid track between 0fr and 1fr, so it opens to its natural height.
  function onClick(e) {
    var i = Array.prototype.indexOf.call(qs, e.currentTarget);
    open = open === i ? null : i;
    qs.forEach(function (q, k) {
      q.setAttribute('aria-expanded', String(open === k));
      panels[k].classList.toggle('card-accordion__panel--open', open === k);
      panels[k].querySelector('.card-accordion__a').setAttribute('aria-hidden', String(open !== k));
    });
  }
  qs.forEach(function (q) {
    q.addEventListener('click', onClick);
  });
  return function () {
    qs.forEach(function (q) {
      q.removeEventListener('click', onClick);
    });
  };
}

document.querySelectorAll('.card-accordion').forEach(initCardAccordion);
