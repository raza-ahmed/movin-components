function initBtnAirlock(root) {
  var timer = 0;
  function set(open) {
    root.toggleAttribute('data-open', open);
    root.setAttribute('aria-label', open ? 'Access granted' : 'Request access');
  }
  function click() {
    set(true);
    clearTimeout(timer);
    timer = setTimeout(function () { set(false); }, 2200);
  }
  root.addEventListener('click', click);
  return function () {
    clearTimeout(timer);
    root.removeEventListener('click', click);
  };
}

document.querySelectorAll('.btn-airlock').forEach(initBtnAirlock);
