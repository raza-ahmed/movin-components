function initBtnEchoStack(root) {
  var top = root.lastElementChild;
  function click() {
    // Off, then on next frame, so back-to-back clicks restart the slam.
    root.removeAttribute('data-slam');
    requestAnimationFrame(function () { root.setAttribute('data-slam', ''); });
  }
  function ended(e) {
    if (e.target === top) root.removeAttribute('data-slam');
  }
  root.addEventListener('click', click);
  root.addEventListener('animationend', ended);
  return function () {
    root.removeEventListener('click', click);
    root.removeEventListener('animationend', ended);
  };
}

document.querySelectorAll('.btn-echo-stack').forEach(initBtnEchoStack);
