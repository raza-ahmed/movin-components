function initSliderPill(root) {
  var input = root.querySelector('.slider-pill__input');
  var fill = root.querySelector('.slider-pill__fill');
  var thumb = root.querySelector('.slider-pill__thumb');
  var value = root.querySelector('.slider-pill__value');
  var waves = root.querySelectorAll('.slider-pill__wave');
  var hover = false;
  var keys = false;
  var drag = false;
  var tap = false;
  var timer = 0;
  function sync() { root.classList.toggle('slider-pill--open', hover || keys || drag || tap); }
  // On touch there is no hover: a tap opens it, and it folds away after a moment of no use.
  function stay() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      tap = false;
      sync();
    }, 2500);
  }
  function enter(e) {
    if (e.pointerType !== 'mouse') return;
    hover = true;
    sync();
  }
  function leave(e) {
    if (e.pointerType !== 'mouse') return;
    hover = false;
    sync();
  }
  function touch(e) {
    if (e.pointerType === 'mouse') return;
    tap = true;
    stay();
    sync();
  }
  function focus() {
    keys = input.matches(':focus-visible');
    sync();
  }
  function blur() {
    keys = false;
    sync();
  }
  function down() {
    drag = true;
    sync();
  }
  function up() {
    drag = false;
    if (tap) stay();
    sync();
  }
  function update() {
    var v = +input.value;
    fill.style.width = v + '%';
    thumb.style.left = v + '%';
    value.textContent = v + '%';
    waves[0].setAttribute('opacity', v > 0 ? 1 : 0.25);
    waves[1].setAttribute('opacity', v > 50 ? 1 : 0.25);
    input.setAttribute('aria-valuetext', v + '%');
    if (tap) stay();
  }
  root.addEventListener('pointerenter', enter);
  root.addEventListener('pointerleave', leave);
  root.addEventListener('pointerdown', touch);
  input.addEventListener('focus', focus);
  input.addEventListener('blur', blur);
  input.addEventListener('pointerdown', down);
  input.addEventListener('pointerup', up);
  input.addEventListener('pointercancel', up);
  input.addEventListener('input', update);
  return function () {
    clearTimeout(timer);
    root.removeEventListener('pointerenter', enter);
    root.removeEventListener('pointerleave', leave);
    root.removeEventListener('pointerdown', touch);
    input.removeEventListener('focus', focus);
    input.removeEventListener('blur', blur);
    input.removeEventListener('pointerdown', down);
    input.removeEventListener('pointerup', up);
    input.removeEventListener('pointercancel', up);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-pill').forEach(initSliderPill);
