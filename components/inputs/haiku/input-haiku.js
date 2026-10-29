function initFieldHaiku(root) {
  var TARGETS = [5, 7, 5];
  var SR = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
  var rows = root.querySelectorAll('.field-haiku__row');
  var seal = root.querySelector('.field-haiku__seal');
  // An English syllable estimate: vowel groups, less a silent ending. Good enough to count beads by.
  function syllables(text) {
    return text
      .toLowerCase()
      .split(/[^a-z']+/)
      .filter(Boolean)
      .reduce(function (n, w) {
        if (w.length <= 3) return n + 1;
        var core = w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, '').replace(/^y/, '');
        return n + Math.max(1, (core.match(/[aeiouy]{1,2}/g) || []).length);
      }, 0);
  }
  function update() {
    var done = true;
    rows.forEach(function (row, i) {
      var c = syllables(row.querySelector('input').value);
      var target = TARGETS[i];
      if (c !== target) done = false;
      row.toggleAttribute('data-over', c > target);
      row.querySelectorAll('.field-haiku__bead').forEach(function (bead, k) { bead.toggleAttribute('data-on', k < c); });
      row.querySelector('.field-haiku__over').innerHTML = c > target ? '+' + (c - target) : '<span style="' + SR + '">' + c + ' of ' + target + ' syllables</span>';
    });
    if (done !== root.hasAttribute('data-done')) {
      root.toggleAttribute('data-done', done);
      seal.innerHTML = done ? 'HAI<br>KU' : '';
    }
  }
  root.addEventListener('input', update);
  return function () { root.removeEventListener('input', update); };
}

document.querySelectorAll('.field-haiku').forEach(initFieldHaiku);
