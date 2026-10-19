function initBtnHalftone(root) {
  function local(e) {
    var box = root.getBoundingClientRect();
    // A keyboard press has no pointer: start from the centre.
    return e.detail === 0 && e.type === 'click'
      ? [box.width / 2, box.height / 2]
      : [e.clientX - box.left, e.clientY - box.top];
  }

  function move(e) {
    var p = local(e);
    root.style.setProperty('--btn-halftone-x', p[0] + 'px');
    root.style.setProperty('--btn-halftone-y', p[1] + 'px');
  }

  function wave(e) {
    var p = local(e);
    root.style.setProperty('--btn-halftone-wx', p[0] + 'px');
    root.style.setProperty('--btn-halftone-wy', p[1] + 'px');
    root.classList.remove('btn-halftone--wave');
    void root.offsetWidth; // restart the ring
    root.classList.add('btn-halftone--wave');
  }

  function done(e) {
    if (e.animationName === 'btn-halftone-wave') root.classList.remove('btn-halftone--wave');
  }

  root.addEventListener('pointermove', move);
  root.addEventListener('pointerenter', move);
  root.addEventListener('pointerenter', wave);
  root.addEventListener('click', wave);
  root.addEventListener('animationend', done);
  return function () {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerenter', move);
    root.removeEventListener('pointerenter', wave);
    root.removeEventListener('click', wave);
    root.removeEventListener('animationend', done);
    root.classList.remove('btn-halftone--wave');
  };
}

document.querySelectorAll('.btn-halftone').forEach(initBtnHalftone);
