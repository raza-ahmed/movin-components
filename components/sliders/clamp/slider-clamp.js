function initSliderClamp(root) {
  var W = 240;
  var JW = 14;
  var MAX = 80;
  var TOP = 6;
  var BOT = 50;
  var thread = root.querySelector('.slider-clamp__thread');
  var jawL = root.querySelector('polygon.slider-clamp__jaw--l');
  var jawR = root.querySelector('polygon.slider-clamp__jaw--r');
  var footL = root.querySelector('rect.slider-clamp__jaw--l');
  var footR = root.querySelector('rect.slider-clamp__jaw--r');
  var word = root.querySelector('.slider-clamp__word');
  var gripL = root.querySelector('.slider-clamp__grip--l');
  var gripR = root.querySelector('.slider-clamp__grip--r');
  var label = root.querySelector('.slider-clamp__value b');
  var inset = +root.getAttribute('aria-valuenow');
  var d = inset;
  var v = 0;
  var side = 1;
  var raf = 0;
  var nat = word.offsetWidth;
  // A jaw with a serrated inner face; side 1 is the left jaw, -1 the right.
  function jaw(edge, s) {
    var face = edge + s * JW;
    var p = edge + ',' + TOP + ' ' + face + ',' + TOP;
    for (var y = TOP; y < BOT; y += 4) p += ' ' + (face + s * 2.5) + ',' + (y + 2) + ' ' + face + ',' + (y + 4);
    return p + ' ' + edge + ',' + BOT;
  }
  function draw() {
    jawL.setAttribute('points', jaw(d, 1));
    jawR.setAttribute('points', jaw(W - d, -1));
    footL.setAttribute('x', d + 3);
    footR.setAttribute('x', W - d - 11);
    thread.setAttribute('stroke-dashoffset', -d * 0.9);
    gripL.style.left = d - 8 + 'px';
    gripR.style.left = W - d - JW - 8 + 'px';
    // Once the jaws reach the word they squash it, and it bulges a little to keep its bulk.
    var sx = Math.min(1, (W - 2 * (JW + d) - 8) / nat);
    word.style.transform = 'translateX(-50%) scale(' + sx + ', ' + (1 + (1 - sx) * 0.3) + ')';
  }
  function run() {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      d = inset;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      v += (-320 * (d - inset) - 30 * v) * dt;
      d += v * dt;
      if (Math.abs(d - inset) < 0.05 && Math.abs(v) < 0.5) {
        d = inset;
        v = 0;
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function set(n) {
    inset = Math.round(Math.min(MAX, Math.max(0, n)));
    root.setAttribute('aria-valuenow', inset);
    root.setAttribute('aria-valuetext', inset + ' pixels');
    label.textContent = inset + ' px';
    run();
  }
  function key(e) {
    var step = e.shiftKey ? 10 : 1;
    var by = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: 10, PageDown: -10 }[e.key];
    if (e.key === 'Home') set(0);
    else if (e.key === 'End') set(MAX);
    else if (by) set(inset + by);
    else return;
    e.preventDefault();
  }
  // Drag either jaw: both move, mirrored.
  function grab(s) {
    return function (e) {
      side = s;
      e.currentTarget.setPointerCapture(e.pointerId);
    };
  }
  function drag(e) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    var px = e.clientX - root.getBoundingClientRect().left;
    set(side === 1 ? px - JW / 2 : W - px - JW / 2);
  }
  var grabL = grab(1);
  var grabR = grab(-1);
  root.addEventListener('keydown', key);
  gripL.addEventListener('pointerdown', grabL);
  gripR.addEventListener('pointerdown', grabR);
  gripL.addEventListener('pointermove', drag);
  gripR.addEventListener('pointermove', drag);
  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('keydown', key);
    gripL.removeEventListener('pointerdown', grabL);
    gripR.removeEventListener('pointerdown', grabR);
    gripL.removeEventListener('pointermove', drag);
    gripR.removeEventListener('pointermove', drag);
  };
}

document.querySelectorAll('.slider-clamp').forEach(initSliderClamp);
