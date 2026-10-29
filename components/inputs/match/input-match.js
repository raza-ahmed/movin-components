function initFieldMatch(root) {
  var inputs = root.querySelectorAll('.field-match__input');
  var a = inputs[0];
  var b = inputs[1];
  var chain = root.querySelector('.field-match__chain');
  var status = root.querySelector('.field-match__status');
  function update() {
    var n = Math.min(a.value.length, 14);
    var same = 0;
    while (same < b.value.length && same < a.value.length && a.value[same] === b.value[same]) same++;
    var bad = b.value.length > same;
    var done = a.value.length > 0 && a.value === b.value;
    // One bead per character of the password, added or removed at the end.
    var beads = chain.querySelectorAll('.field-match__bead');
    for (var k = beads.length; k < n; k++) {
      var bead = document.createElement('span');
      bead.className = 'field-match__bead';
      bead.setAttribute('aria-hidden', 'true');
      chain.insertBefore(bead, status);
    }
    for (var j = beads.length - 1; j >= n; j--) beads[j].remove();
    chain.querySelectorAll('.field-match__bead').forEach(function (el, i) {
      el.toggleAttribute('data-on', i < same);
      el.toggleAttribute('data-link', i < same - 1 || (done && i < n - 1));
      el.toggleAttribute('data-bad', bad && i === same);
    });
    root.toggleAttribute('data-done', done);
    b.setAttribute('aria-invalid', String(bad));
    status.textContent = !a.value ? '' : done ? 'Passwords match' : bad ? 'Doesn’t match yet' : b.value ? same + ' of ' + a.value.length : '';
  }
  root.addEventListener('input', update);
  return function () { root.removeEventListener('input', update); };
}

document.querySelectorAll('.field-match').forEach(initFieldMatch);
