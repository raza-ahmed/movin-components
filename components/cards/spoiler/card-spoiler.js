function initCardSpoiler(root) {
  var btn = root.querySelector('.card-spoiler__hidden');
  var text = root.querySelector('.card-spoiler__text');
  var hint = root.querySelector('.card-spoiler__hint');
  var c = root.querySelector('.card-spoiler__dust');
  var ctx = c.getContext('2d');
  var dpr = Math.min(2, window.devicePixelRatio || 1);
  var box = btn.getBoundingClientRect();
  var w = box.width;
  var h = box.height;
  c.width = w * dpr;
  c.height = h * dpr;
  ctx.scale(dpr, dpr);
  var colour = getComputedStyle(c).color;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var specks = [];
  var burst = 0;
  var raf = 0;
  var on = false;
  var shown = false;
  var last = 0;

  function seed() {
    burst = 0;
    specks = [];
    for (var i = 0; i < Math.round((w * h) / 7); i++) {
      specks.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, r: 0.5 + Math.random() * 0.6, a: Math.random() });
    }
  }
  // Specks drift and twinkle over the hidden words. Revealing throws each one away from the click and fades them out.
  // Under reduced motion the specks hold still and a reveal simply clears them.
  function draw(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    var fade = burst ? (still ? 0 : Math.max(0, 1 - (now - burst) / 650)) : 1;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = colour;
    specks.forEach(function (s) {
      if (!still) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (!burst) {
          if (s.x < 0 || s.x > w) s.vx *= -1;
          if (s.y < 0 || s.y > h) s.vy *= -1;
        }
        s.a = Math.max(0.15, Math.min(1, s.a + (Math.random() - 0.5) * 0.2));
      }
      ctx.globalAlpha = s.a * fade;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    if (fade === 0 || still) {
      on = false;
      return;
    }
    raf = requestAnimationFrame(draw);
  }
  function run() {
    if (on) return;
    on = true;
    last = performance.now();
    raf = requestAnimationFrame(draw);
  }
  // The loop stops when the specks are gone and pauses off screen.
  var io = new IntersectionObserver(function (entries) {
    cancelAnimationFrame(raf);
    on = false;
    if (entries[0].isIntersecting) run();
  });
  io.observe(c);
  seed();

  function onClick(e) {
    if (shown) {
      seed();
      shown = false;
    } else {
      var r = btn.getBoundingClientRect();
      // From the click, or the middle when it came from the keyboard.
      var x = e.detail ? e.clientX - r.left : w / 2;
      var y = e.detail ? e.clientY - r.top : h / 2;
      specks.forEach(function (s) {
        var a = Math.atan2(s.y - y, s.x - x);
        var v = 40 + Math.random() * 90;
        s.vx = Math.cos(a) * v;
        s.vy = Math.sin(a) * v;
      });
      burst = performance.now();
      shown = true;
    }
    btn.classList.toggle('card-spoiler__hidden--shown', shown);
    btn.setAttribute('aria-expanded', String(shown));
    if (shown) btn.removeAttribute('aria-label');
    else btn.setAttribute('aria-label', 'Hidden spoiler, show it');
    text.setAttribute('aria-hidden', String(!shown));
    hint.textContent = shown ? 'Click it again to hide it.' : 'Click the specks to reveal.';
    run();
  }
  btn.addEventListener('click', onClick);
  return function () {
    io.disconnect();
    cancelAnimationFrame(raf);
    btn.removeEventListener('click', onClick);
  };
}

document.querySelectorAll('.card-spoiler').forEach(initCardSpoiler);
