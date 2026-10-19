function initBtnLoupe(root) {
  var content = root.querySelector('.btn-loupe__content');
  var zoom = root.querySelector('.btn-loupe__zoom');
  if (!content || !zoom) return;
  var copy = content.cloneNode(true);
  zoom.appendChild(copy);

  function measure() {
    root.style.setProperty('--btn-loupe-w', root.clientWidth + 'px');
    root.style.setProperty('--btn-loupe-h', root.clientHeight + 'px');
  }

  function move(e) {
    var box = root.getBoundingClientRect();
    root.style.setProperty('--btn-loupe-x', (e.clientX - box.left - root.clientLeft).toFixed(1) + 'px');
    root.style.setProperty('--btn-loupe-y', (e.clientY - box.top - root.clientTop).toFixed(1) + 'px');
  }

  var ro = new ResizeObserver(measure);
  ro.observe(root);
  measure();
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerenter', move);
  root.classList.add('btn-loupe--live');

  return function () {
    ro.disconnect();
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerenter', move);
    root.classList.remove('btn-loupe--live');
    copy.remove();
  };
}

document.querySelectorAll('.btn-loupe').forEach(initBtnLoupe);
