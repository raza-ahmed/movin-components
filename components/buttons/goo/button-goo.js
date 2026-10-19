function initBtnGoo(root) {
  function fire() {
    root.classList.remove('btn-goo--fire');
    void root.offsetWidth; // restart the animation on every click
    root.classList.add('btn-goo--fire');
  }
  function done(e) {
    if (e.animationName === 'btn-goo-shot') root.classList.remove('btn-goo--fire');
  }
  root.addEventListener('click', fire);
  root.addEventListener('animationend', done);
  return function () {
    root.removeEventListener('click', fire);
    root.removeEventListener('animationend', done);
    root.classList.remove('btn-goo--fire');
  };
}

document.querySelectorAll('.btn-goo').forEach(initBtnGoo);
