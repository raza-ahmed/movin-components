function initLoaderRally(root) {
  var ball = root.querySelector('.loader-rally__ball');
  var paddles = root.querySelectorAll('.loader-rally__paddle');
  if (!ball || paddles.length !== 2) return;
  var W = 128;
  var H = 80;
  var minX = 12;
  var maxX = W - 18;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var x = minX;
  var y = 30;
  var vx = 95;
  var vy = 61;
  var pl = 30;
  var pr = 30;
  var last = performance.now();
  var raf = 0;

  function tick(now) {
    var dt = Math.min(0.04, (now - last) / 1000);
    last = now;
    x += vx * dt;
    y += vy * dt;
    if (y < 4 || y > H - 10) {
      vy = -vy;
      y = Math.max(4, Math.min(H - 10, y));
    }
    if (x > maxX || x < minX) {
      vx = -vx;
      x = Math.max(minX, Math.min(maxX, x));
      vy += (Math.random() - 0.5) * 30; // a little spin off the paddle
    }
    // Each paddle chases the ball only while it is coming their way, and a touch late.
    if (vx < 0) pl += (y - 6 - pl) * 0.12;
    else pr += (y - 6 - pr) * 0.12;
    ball.style.transform = 'translate(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px)';
    paddles[0].style.transform = 'translate(6px, ' + pl.toFixed(1) + 'px)';
    paddles[1].style.transform = 'translate(' + (W - 10) + 'px, ' + pr.toFixed(1) + 'px)';
    if (!still) raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  return function () { cancelAnimationFrame(raf); };
}

document.querySelectorAll('.loader-rally').forEach(initLoaderRally);
