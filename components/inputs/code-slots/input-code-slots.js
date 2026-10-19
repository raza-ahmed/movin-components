function initFieldCodeSlots(root) {
  var input = root.querySelector('.field-code-slots__input');
  var cells = Array.prototype.slice.call(root.querySelectorAll('.field-code-slots__cell'));
  var status = root.querySelector('.field-code-slots__status');
  if (!input || !cells.length) return;

  // Draw the value into the cells; only a digit that changed gets a new
  // span, so only it rolls in.
  function render() {
    var v = input.value.replace(/\D/g, '').slice(0, cells.length);
    if (v !== input.value) input.value = v;
    var focused = document.activeElement === input;
    var done = v.length === cells.length;
    cells.forEach(function (cell, i) {
      var ch = v[i] || '';
      if (cell.textContent !== ch) {
        cell.textContent = '';
        if (ch) {
          var s = document.createElement('span');
          s.textContent = ch;
          cell.appendChild(s);
        }
      }
      cell.classList.toggle('field-code-slots__cell--active', focused && !done && i === v.length);
    });
    root.classList.toggle('field-code-slots--done', done);
    if (status) status.textContent = done ? 'Code complete' : '';
  }

  // The caret always lives at the end, like typing into the next box.
  function toEnd() {
    var n = input.value.length;
    input.setSelectionRange(n, n);
  }

  function key(e) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].indexOf(e.key) !== -1) e.preventDefault();
  }

  function focus() {
    toEnd();
    render();
  }

  input.addEventListener('input', render);
  input.addEventListener('focus', focus);
  input.addEventListener('blur', render);
  input.addEventListener('click', toEnd);
  input.addEventListener('keydown', key);
  render();
  return function () {
    input.removeEventListener('input', render);
    input.removeEventListener('focus', focus);
    input.removeEventListener('blur', render);
    input.removeEventListener('click', toEnd);
    input.removeEventListener('keydown', key);
  };
}

document.querySelectorAll('.field-code-slots').forEach(initFieldCodeSlots);
