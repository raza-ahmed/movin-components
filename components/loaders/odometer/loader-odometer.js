function initLoaderOdometer(root) {
  var strips = root.querySelectorAll('.loader-odometer__strip');
  if (strips.length !== 3) return;
  function show(n) {
    String(n).padStart(3, '0').split('').forEach(function (d, i) {
      strips[i].style.transform = 'translateY(' + -Number(d) * 30 + 'px)';
    });
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    show(42);
    return;
  }
  var n = 0;
  // Count in uneven jumps, like a real transfer, then hold at 100 and start again.
  var timer = setInterval(function () {
    n = n >= 100 ? 0 : Math.min(100, n + 1 + Math.floor(Math.random() * 4));
    show(n);
  }, 140);
  return function () { clearInterval(timer); };
}

document.querySelectorAll('.loader-odometer').forEach(initLoaderOdometer);
