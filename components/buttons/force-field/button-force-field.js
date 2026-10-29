var btnForceFieldCount = 0;

function initBtnForceField(root) {
  var field = root.querySelector('.btn-force-field__field');
  var btn = root.querySelector('.btn-force-field__btn');
  if (!field || !btn) return;
  // Pattern ids must be unique per copy on the page.
  var uid = 'btn-force-field-' + ++btnForceFieldCount;
  field.querySelector('pattern').id = uid + '-f';
  field.querySelector('rect').setAttribute('fill', 'url(#' + uid + '-f)');
  var n = 0;

  function ripple(e) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var r = root.getBoundingClientRect();
    // Keyboard clicks have no pointer position: ripple from the button's centre.
    var x = e.detail ? e.clientX - r.left : r.width / 2;
    var y = e.detail ? e.clientY - r.top : r.height / 2;
    var old = root.querySelector('.btn-force-field__ripple');
    if (old) old.remove();
    var svg = field.cloneNode(true);
    var id = uid + '-r' + ++n;
    svg.setAttribute('class', 'btn-force-field__ripple');
    svg.querySelector('pattern').id = id;
    svg.querySelector('rect').setAttribute('fill', 'url(#' + id + ')');
    svg.style.setProperty('--x', x + 'px');
    svg.style.setProperty('--y', y + 'px');
    svg.addEventListener('animationend', function () { svg.remove(); });
    root.insertBefore(svg, btn);
  }
  btn.addEventListener('click', ripple);

  return function () { btn.removeEventListener('click', ripple); };
}

document.querySelectorAll('.btn-force-field').forEach(initBtnForceField);
