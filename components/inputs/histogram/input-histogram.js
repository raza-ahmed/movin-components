function initFieldHistogram(root) {
  var ranges = root.querySelectorAll('.field-histogram__range');
  var bars = root.querySelectorAll('.field-histogram__bar');
  var sel = root.querySelector('.field-histogram__sel');
  var count = root.querySelector('.field-histogram__count');
  var vals = root.querySelectorAll('.field-histogram__vals span');
  if (ranges.length !== 2 || !bars.length || !sel || !count || vals.length !== 2) return;
  var BINS = bars.length;
  var STEP = 20;
  // How many products sit in each $20 band: the same numbers the bars were drawn from.
  var COUNTS = [];
  for (var i = 0; i < BINS; i++) {
    var x = i / BINS;
    var n = Math.sin(i * 9.17) * 43758.5;
    COUNTS.push(Math.round(4 + 70 * Math.exp(-Math.pow((x - 0.28) / 0.17, 2)) + 24 * Math.exp(-Math.pow((x - 0.7) / 0.1, 2)) + (n - Math.floor(n)) * 10));
  }
  var lo = Number(ranges[0].value);
  var hi = Number(ranges[1].value);
  var shown = null;
  var raf = 0;
  function pct(i) { return 'calc(9px + (100% - 18px) * ' + i / BINS + ')'; }
  function tweenCount(target) {
    cancelAnimationFrame(raf);
    if (shown === null) shown = target;
    function step() {
      shown += (target - shown) * 0.25;
      if (Math.abs(target - shown) < 0.5) shown = target;
      count.textContent = Math.round(shown) + ' products';
      if (shown !== target) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function render() {
    bars.forEach(function (b, i) { b.toggleAttribute('data-in', i >= lo && i < hi); });
    sel.style.left = pct(lo);
    sel.style.right = 'calc(100% - ' + pct(hi) + ')';
    ranges[0].setAttribute('aria-valuetext', '$' + lo * STEP);
    ranges[1].setAttribute('aria-valuetext', '$' + hi * STEP);
    vals[0].textContent = '$' + lo * STEP;
    vals[1].textContent = '$' + hi * STEP + (hi === BINS ? '+' : '');
    tweenCount(COUNTS.slice(lo, hi).reduce(function (a, b) { return a + b; }, 0));
  }
  // Each thumb stays at least one band away from the other.
  function onLo() {
    lo = Math.min(Number(ranges[0].value), hi - 1);
    ranges[0].value = String(lo);
    render();
  }
  function onHi() {
    hi = Math.max(Number(ranges[1].value), lo + 1);
    ranges[1].value = String(hi);
    render();
  }
  ranges[0].addEventListener('input', onLo);
  ranges[1].addEventListener('input', onHi);
  render();
  return function () {
    cancelAnimationFrame(raf);
    ranges[0].removeEventListener('input', onLo);
    ranges[1].removeEventListener('input', onHi);
  };
}

document.querySelectorAll('.field-histogram').forEach(initFieldHistogram);
