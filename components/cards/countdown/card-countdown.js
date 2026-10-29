function initCardCountdown(root) {
  var strips = root.querySelectorAll('.card-countdown__strip');
  var ring = root.querySelector('.card-countdown__ring circle:last-child');
  if (strips.length !== 8 || !ring) return;
  var START = 3 * 86400 + 14 * 3600 + 7 * 60 + 52; // 3d 14h 07m 52s
  var NAMES = ['Days', 'Hrs', 'Min', 'Sec'];
  var left = START;
  function render() {
    var units = [Math.floor(left / 86400), Math.floor(left / 3600) % 24, Math.floor(left / 60) % 60, left % 60];
    units.forEach(function (v, i) {
      strips[i * 2].style.transform = 'translateY(' + -Math.floor(v / 10) * 32 + 'px)';
      strips[i * 2 + 1].style.transform = 'translateY(' + -(v % 10) * 32 + 'px)';
    });
    ring.style.strokeDashoffset = String(1 - (left % 60) / 60);
    root.setAttribute('aria-label', 'Launch in ' + units.map(function (v, i) { return v + ' ' + NAMES[i]; }).join(', '));
  }
  var timer = setInterval(function () {
    left = left > 0 ? left - 1 : START;
    render();
  }, 1000);
  return function () { clearInterval(timer); };
}

document.querySelectorAll('.card-countdown').forEach(initCardCountdown);
