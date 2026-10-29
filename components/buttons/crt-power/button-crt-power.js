function initBtnCrtPower(root) {
  function click() {
    var on = root.getAttribute('aria-pressed') !== 'true';
    root.setAttribute('aria-pressed', String(on));
    root.toggleAttribute('data-booting', on);
  }
  function ended() { root.removeAttribute('data-booting'); }
  root.addEventListener('click', click);
  root.addEventListener('animationend', ended);
  return function () {
    root.removeEventListener('click', click);
    root.removeEventListener('animationend', ended);
  };
}

document.querySelectorAll('.btn-crt-power').forEach(initBtnCrtPower);
