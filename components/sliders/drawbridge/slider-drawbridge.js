function initSliderDrawbridge(root) {
  var input = root.querySelector('.slider-drawbridge__input');
  function update() {
    var v = +input.value;
    root.style.setProperty('--slider-drawbridge-v', v / 100);
    // Cars cross only while it is down; the boat sails once it is well open.
    root.toggleAttribute('data-shut', v === 0);
    root.toggleAttribute('data-open', v >= 75);
    input.setAttribute('aria-valuetext', v === 0 ? 'Closed' : v + ' percent open');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-drawbridge').forEach(initSliderDrawbridge);
