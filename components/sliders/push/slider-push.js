function initSliderPush(root) {
  var L = 8;
  var TW = 224;
  var G = 6;
  var NAMES = ['Design', 'Build', 'Test', 'Ship'];
  var thumbs = Array.prototype.slice.call(root.querySelectorAll('.slider-push__thumb'));
  var segs = root.querySelectorAll('.slider-push__seg');
  var labels = root.querySelectorAll('.slider-push__label');
  var vals = thumbs.map(function (t) { return +t.getAttribute('aria-valuenow'); });
  function x(n) { return L + (n / 100) * TW; }
  function draw() {
    var bounds = [0].concat(vals, [100]);
    NAMES.forEach(function (name, j) {
      var a = x(bounds[j]) + (j ? 4 : 0);
      var b = x(bounds[j + 1]) - (j < 3 ? 4 : 0);
      var wide = b - a;
      segs[j].style.left = a + 'px';
      segs[j].style.width = wide + 'px';
      // Narrow segments drop their name, then their figure.
      var label = labels[j];
      label.hidden = wide < 18;
      label.style.left = (a + b) / 2 + 'px';
      label.firstChild.nodeValue = wide >= 40 ? name : ' ';
      label.querySelector('b').textContent = bounds[j + 1] - bounds[j] + '%';
    });
    thumbs.forEach(function (t, i) {
      var touching = (vals[i + 1] !== undefined && vals[i + 1] - vals[i] <= G) || (vals[i - 1] !== undefined && vals[i] - vals[i - 1] <= G);
      t.classList.toggle('slider-push__thumb--touch', touching);
      t.style.left = x(vals[i]) + 'px';
      t.setAttribute('aria-valuenow', vals[i]);
      t.setAttribute('aria-valuetext', NAMES[i] + ' ends at ' + vals[i] + '%');
    });
  }
  // Move one divider and shove its neighbours along, never letting a segment drop below G.
  function move(i, to) {
    vals[i] = Math.round(Math.min(100 - (3 - i) * G, Math.max((i + 1) * G, to)));
    for (var j = i + 1; j < 3; j++) vals[j] = Math.max(vals[j], vals[j - 1] + G);
    for (var k = i - 1; k >= 0; k--) vals[k] = Math.min(vals[k], vals[k + 1] - G);
    draw();
  }
  var offs = thumbs.map(function (t, i) {
    function down(e) { t.setPointerCapture(e.pointerId); }
    function drag(e) {
      if (!t.hasPointerCapture(e.pointerId)) return;
      move(i, ((e.clientX - root.getBoundingClientRect().left - L) / TW) * 100);
    }
    function key(e) {
      var step = e.shiftKey ? 10 : 1;
      var by = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: 10, PageDown: -10 }[e.key];
      if (e.key === 'Home') move(i, 0);
      else if (e.key === 'End') move(i, 100);
      else if (by) move(i, vals[i] + by);
      else return;
      e.preventDefault();
    }
    t.addEventListener('pointerdown', down);
    t.addEventListener('pointermove', drag);
    t.addEventListener('keydown', key);
    return function () {
      t.removeEventListener('pointerdown', down);
      t.removeEventListener('pointermove', drag);
      t.removeEventListener('keydown', key);
    };
  });
  return function () {
    offs.forEach(function (off) { off(); });
  };
}

document.querySelectorAll('.slider-push').forEach(initSliderPush);
