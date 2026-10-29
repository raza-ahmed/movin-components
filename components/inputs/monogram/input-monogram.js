function initFieldMonogram(root) {
  var input = root.querySelector('.field-monogram__input');
  var crest = root.querySelector('.field-monogram__crest');
  var shown = { first: '', last: '' };
  function initial(w) {
    var m = w && w.match(/\p{L}/u);
    return m ? m[0].toUpperCase() : '';
  }
  function letter(cls, c) {
    var el = document.createElement('span');
    el.className = cls;
    el.textContent = c;
    return el;
  }
  function update() {
    var words = input.value.trim().split(/\s+/).filter(function (w) { return /\p{L}/u.test(w); });
    var first = initial(words[0]);
    var last = words.length > 1 ? initial(words[words.length - 1]) : '';
    if (first === shown.first && last === shown.last) return;
    // Only a letter that changed is set again, so only it plays its entrance.
    if (!first) {
      crest.innerHTML = '<span class="field-monogram__empty">initials</span>';
    } else {
      var pair = crest.querySelector('.field-monogram__pair');
      if (!pair || first !== shown.first) {
        pair = document.createElement('span');
        pair.className = 'field-monogram__pair';
        pair.appendChild(letter('field-monogram__a', first));
        crest.replaceChildren(pair);
        shown.last = '';
      }
      if (last !== shown.last) {
        var b = pair.querySelector('.field-monogram__b');
        if (b) b.remove();
        if (last) pair.appendChild(letter('field-monogram__b', last));
      }
    }
    shown = { first: first, last: last };
  }
  input.addEventListener('input', update);
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.field-monogram').forEach(initFieldMonogram);
