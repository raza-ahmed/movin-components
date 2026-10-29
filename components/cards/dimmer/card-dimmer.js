function initCardDimmer(root) {
  var range = root.querySelector('.card-dimmer__range');
  var state = root.querySelector('.card-dimmer__state');
  if (!range || !state) return;
  function update() {
    var v = Number(range.value);
    root.style.setProperty('--v', String(v / 100));
    state.textContent = v === 0 ? 'Off' : v + '% · 2700K';
  }
  range.addEventListener('input', update);
  update();
  return function () { range.removeEventListener('input', update); };
}

document.querySelectorAll('.card-dimmer').forEach(initCardDimmer);
