function initFieldMeasure(root) {
  var input = root.querySelector('.field-measure__input');
  var ruler = root.querySelector('.field-measure__ruler');
  var dim = root.querySelector('.field-measure__dim');
  var tag = root.querySelector('.field-measure__tag');
  var meta = root.querySelector('.field-measure__meta span');
  if (!input || !ruler || !dim || !tag || !meta) return;
  var shown = 0;
  var raf = 0;
  function update() {
    ruler.textContent = input.value;
    var w = ruler.offsetWidth;
    dim.style.width = Math.min(w, 228) + 'px';
    meta.textContent = '24 / 700 · ' + input.value.length + ' glyphs';
    // The readout counts to the new width rather than jumping.
    cancelAnimationFrame(raf);
    function step() {
      shown += (w - shown) * 0.3;
      if (Math.abs(w - shown) < 0.5) shown = w;
      tag.textContent = Math.round(shown) + ' px';
      if (shown !== w) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  input.addEventListener('input', update);
  update();
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.field-measure').forEach(initFieldMeasure);
