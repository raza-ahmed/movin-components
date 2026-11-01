function initSliderNudge(root) {
  var W = 240;
  var T = 18;
  var PW = 46;
  var LW = 30;
  var input = root.querySelector('.slider-nudge__input');
  var min = root.querySelector('.slider-nudge__end--min');
  var max = root.querySelector('.slider-nudge__end--max');
  var pill = root.querySelector('.slider-nudge__pill');
  var fill = root.querySelector('.slider-nudge__fill');
  var thumb = root.querySelector('.slider-nudge__thumb');
  function at(v) { return T / 2 + (v / 100) * (W - T); }
  // How far the value pill overlaps an end label, and the knock that gives it: down, out and tipped over.
  function shove(el, overlap, side) {
    var o = Math.min(28, Math.max(0, overlap));
    el.style.transform = 'translate(' + side * o * 0.25 + 'px, ' + o * 0.75 + 'px) rotate(' + side * o * 1.6 + 'deg) scale(' + (1 - o * 0.008) + ')';
    el.style.opacity = 1 - o * 0.018;
  }
  function update() {
    var v = +input.value;
    var x = at(v);
    shove(min, LW + 4 - (x - PW / 2), -1);
    shove(max, x + PW / 2 - (W - LW - 4), 1);
    pill.style.left = x + 'px';
    pill.textContent = v + '%';
    fill.style.width = x + 'px';
    thumb.style.left = x + 'px';
    input.setAttribute('aria-valuetext', v + '%');
  }
  input.addEventListener('input', update);
  return function () {
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-nudge').forEach(initSliderNudge);
