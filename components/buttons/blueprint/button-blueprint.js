function initBtnBlueprint(root) {
  var btn = root.querySelector('.btn-blueprint__btn');
  var w = root.querySelector('.btn-blueprint__label--w');
  var h = root.querySelector('.btn-blueprint__label--h');
  if (!btn || !w || !h) return;
  // The readout is the button's real size, so it stays true to whatever the label is.
  var ro = new ResizeObserver(function () {
    w.textContent = String(Math.round(btn.offsetWidth));
    h.textContent = String(Math.round(btn.offsetHeight));
  });
  ro.observe(btn);
  return function () { ro.disconnect(); };
}

document.querySelectorAll('.btn-blueprint').forEach(initBtnBlueprint);
