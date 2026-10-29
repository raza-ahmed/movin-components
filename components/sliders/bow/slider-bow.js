function initSliderBow(root) {
  var input = root.querySelector('.slider-bow__input');
  var string = root.querySelector('.slider-bow__string');
  var shaft = root.querySelector('.slider-bow__shaft');
  var head = root.querySelector('.slider-bow__head');
  var fletch = root.querySelector('.slider-bow__fletch');
  var limb = root.querySelector('.slider-bow__limb');
  var grip = root.querySelector('.slider-bow__grip');
  var read = root.querySelector('.slider-bow__read b');
  function f(n) { return n.toFixed(1); }
  function update() {
    var t = input.value / 100;
    var tipX = 132 - t * 14;
    var nockX = tipX - t * 84;
    var belly = 168 + t * 10;
    var lb = Math.round(20 + t * 40);
    string.setAttribute('d', 'M' + f(tipX) + ' 12L' + f(nockX) + ' 70L' + f(tipX) + ' 128');
    shaft.setAttribute('x1', f(nockX));
    shaft.setAttribute('x2', f(nockX + 112));
    head.setAttribute('d', 'M' + f(nockX + 122) + ' 70l-12-5v10Z');
    fletch.setAttribute('d', 'M' + f(nockX + 2) + ' 70l10-8h8l-8 8Z M' + f(nockX + 2) + ' 70l10 8h8l-8-8Z');
    limb.setAttribute('d', 'M' + f(tipX) + ' 12Q' + f(belly) + ' 70 ' + f(tipX) + ' 128');
    grip.setAttribute('x', f((tipX + belly) / 2 - 5));
    read.textContent = lb + ' lb';
    input.setAttribute('aria-valuetext', lb + ' pounds');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-bow').forEach(initSliderBow);
