function initSliderWeight(root) {
  var NAMES = ['Thin', 'Extra light', 'Light', 'Regular', 'Medium', 'Semibold', 'Bold', 'Extra bold', 'Black'];
  var input = root.querySelector('.slider-weight__input');
  var name = root.querySelector('.slider-weight__name');
  var num = name.querySelector('b');
  function update() {
    var w = +input.value;
    var v = (w - 100) / 800;
    var label = NAMES[Math.round(v * 8)];
    root.style.setProperty('--slider-weight-v', v);
    num.textContent = w;
    name.replaceChildren(label + ' ', num);
    input.setAttribute('aria-valuetext', w + ', ' + label);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-weight').forEach(initSliderWeight);
