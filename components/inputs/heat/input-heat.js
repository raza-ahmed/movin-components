function initFieldHeat(root) {
  var input = root.querySelector('.field-heat__input');
  var mirror = root.querySelector('.field-heat__mirror');
  var wpmEl = root.querySelector('.field-heat__wpm');
  var meter = root.querySelector('.field-heat__meter span');
  if (!input || !mirror || !wpmEl || !meter) return;
  var value = input.value;
  var last = 0;
  var gaps = [];
  var wpm = 0;
  function showWpm() {
    wpmEl.textContent = Math.round(wpm) + ' wpm';
    meter.style.transform = 'scaleX(' + Math.min(1, wpm / 110) + ')';
  }
  // Speed decays when you stop typing.
  var timer = setInterval(function () {
    if (performance.now() - last > 1200 && wpm > 0) {
      wpm = wpm < 1 ? 0 : wpm * 0.7;
      showWpm();
    }
  }, 200);
  function change() {
    var next = input.value;
    var now = performance.now();
    var gap = last ? now - last : 1000;
    last = now;
    var p = 0;
    while (p < value.length && p < next.length && value[p] === next[p]) p++;
    var s = 0;
    while (s < value.length - p && s < next.length - p && value[value.length - 1 - s] === next[next.length - 1 - s]) s++;
    // Fast keystrokes come out hot; slow ones barely warm. Untouched letters keep cooling as they were.
    var h = Math.max(0, Math.min(1, (380 - gap) / 300));
    var spans = Array.prototype.slice.call(mirror.children);
    spans.slice(p, spans.length - s).forEach(function (el) { el.remove(); });
    var after = spans[spans.length - s] || null;
    next.slice(p, next.length - s).split('').forEach(function (c) {
      var el = document.createElement('span');
      el.className = 'field-heat__ch';
      el.style.setProperty('--h', String(h));
      el.textContent = c;
      mirror.insertBefore(el, after);
    });
    var added = next.length - p - s;
    if (added > 0 && gap < 1500) {
      gaps = gaps.concat([gap]).slice(-8);
      wpm = 60000 / ((gaps.reduce(function (a, b) { return a + b; }, 0) / gaps.length) * 5);
      showWpm();
    }
    value = next;
  }
  input.addEventListener('input', change);
  return function () {
    clearInterval(timer);
    input.removeEventListener('input', change);
  };
}

document.querySelectorAll('.field-heat').forEach(initFieldHeat);
