function initBtnBell(root) {
  var off = root.querySelector('.btn-bell__off');
  var on = root.querySelector('.btn-bell__on');
  function onClick() {
    var pressed = root.getAttribute('aria-pressed') !== 'true';
    root.setAttribute('aria-pressed', String(pressed));
    // Only the label that is showing is read out.
    off.setAttribute('aria-hidden', String(pressed));
    on.setAttribute('aria-hidden', String(!pressed));
  }
  root.addEventListener('click', onClick);
  return function () { root.removeEventListener('click', onClick); };
}

document.querySelectorAll('.btn-bell').forEach(initBtnBell);
