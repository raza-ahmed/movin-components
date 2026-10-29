var btnPlasmaCount = 0;

function initBtnPlasma(root) {
  var svg = root.querySelector('.btn-plasma__energy');
  if (!svg) return;
  // The filter id must be unique per copy on the page.
  var id = 'btn-plasma-' + ++btnPlasmaCount;
  svg.querySelector('filter').id = id;
  svg.querySelector('rect').setAttribute('filter', 'url(#' + id + ')');
  // SMIL ignores the CSS media query, so reduced motion pauses it here.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) svg.pauseAnimations();
}

document.querySelectorAll('.btn-plasma').forEach(initBtnPlasma);
