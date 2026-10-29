function initFieldGrow(root) {
  var box = root.querySelector('.field-grow__box');
  var gutter = root.querySelector('.field-grow__gutter');
  var area = root.querySelector('.field-grow__area');
  var foot = root.querySelectorAll('.field-grow__foot span');
  if (!box || !gutter || !area || foot.length !== 2) return;
  var LINE = 18;
  var MIN = 2;
  var MAX = 7;
  var line = 1;
  function render() {
    var value = area.value;
    var lines = value.split('\n').length;
    var rows = Math.max(MIN, Math.min(MAX, lines));
    box.style.height = rows * LINE + 16 + 'px';
    area.rows = rows;
    area.toggleAttribute('data-scroll', lines > MAX);
    // Keep existing numbers; only new ones slide in.
    while (gutter.children.length > lines) gutter.lastChild.remove();
    while (gutter.children.length < lines) {
      var n = document.createElement('span');
      n.textContent = String(gutter.children.length + 1);
      gutter.appendChild(n);
    }
    Array.prototype.forEach.call(gutter.children, function (n, i) { n.toggleAttribute('data-cur', i + 1 === line); });
    foot[0].textContent = 'Ln ' + line + ', ' + lines + ' line' + (lines === 1 ? '' : 's');
    foot[1].textContent = value.length + ' chars';
  }
  function caret() {
    line = area.value.slice(0, area.selectionStart).split('\n').length;
    render();
  }
  function scroll() { gutter.scrollTop = area.scrollTop; }
  area.addEventListener('input', caret);
  area.addEventListener('select', caret);
  area.addEventListener('click', caret);
  area.addEventListener('keyup', caret);
  area.addEventListener('scroll', scroll);
  render();
  return function () {
    area.removeEventListener('input', caret);
    area.removeEventListener('select', caret);
    area.removeEventListener('click', caret);
    area.removeEventListener('keyup', caret);
    area.removeEventListener('scroll', scroll);
  };
}

document.querySelectorAll('.field-grow').forEach(initFieldGrow);
