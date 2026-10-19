function initFieldDrop(root) {
  var input = root.querySelector('.field-drop__input');
  var line = root.querySelector('.field-drop__line');
  if (!input || !line) return;
  var spans = [];
  var text = '';

  function char(c) {
    var s = document.createElement('span');
    s.className = 'field-drop__char';
    s.textContent = c;
    s.style.setProperty('--field-drop-r', (Math.random() * 40 - 20).toFixed(0) + 'deg');
    return s;
  }

  function scroll() {
    line.style.transform = 'translateX(' + -input.scrollLeft + 'px)';
  }

  // Diff old and new text: keep the shared start and end, drop the letters
  // that went, and animate in only the letters that arrived.
  function update() {
    var v = input.value;
    var p = 0;
    while (p < text.length && p < v.length && text[p] === v[p]) p++;
    var s = 0;
    while (s < text.length - p && s < v.length - p && text[text.length - 1 - s] === v[v.length - 1 - s]) s++;
    var added = v.slice(p, v.length - s).split('').map(char);
    var removed = spans.splice.apply(spans, [p, text.length - s - p].concat(added));
    // Measure every leaving letter before any of them leaves the flow.
    var lefts = removed.map(function (r) {
      return r.offsetLeft;
    });
    removed.forEach(function (r, i) {
      if (i > 24) return r.remove();
      r.style.left = lefts[i] + 'px';
      r.classList.add('field-drop__char--out');
      r.addEventListener('animationend', function () {
        r.remove();
      });
      setTimeout(function () {
        r.remove();
      }, 600);
    });
    var next = spans[p + added.length] || null;
    // A paste cascades in left to right.
    added.forEach(function (a, i) {
      a.classList.add('field-drop__char--in');
      if (i) a.style.animationDelay = Math.min(i, 30) * 18 + 'ms';
      line.insertBefore(a, next);
    });
    text = v;
    scroll();
  }

  function caret() {
    if (document.activeElement === input) scroll();
  }

  input.addEventListener('input', update);
  input.addEventListener('scroll', scroll);
  document.addEventListener('selectionchange', caret);
  update();
  return function () {
    input.removeEventListener('input', update);
    input.removeEventListener('scroll', scroll);
    document.removeEventListener('selectionchange', caret);
    line.textContent = '';
  };
}

document.querySelectorAll('.field-drop').forEach(initFieldDrop);
