function initSliderGlide(root) {
  var W = 240, R = 12, LO = R, HI = W - R;
  var input = root.querySelector('.slider-glide__input');
  var thumb = root.querySelector('.slider-glide__thumb');
  var value = root.querySelector('.slider-glide__value');
  var x = LO + (input.value / 100) * (HI - LO);
  var held = false, grab = 0, samples = [], raf = 0, timer, squash = { s: 0, side: 0 };
  function clamp(n) { return Math.max(LO, Math.min(HI, n)); }
  function local(e) { return e.clientX - root.getBoundingClientRect().left; }
  function drawThumb() {
    var k = held ? 1.1 : 1;
    thumb.style.transform = 'scale(' + k * (1 - squash.s) + ', ' + k * (1 + squash.s * 0.7) + ')';
    thumb.style.transformOrigin = squash.side < 0 ? '0% 50%' : squash.side > 0 ? '100% 50%' : '50% 50%';
    thumb.style.transition = squash.s ? 'transform 0.06s ease-out' : 'transform 0.45s cubic-bezier(0.3, 1.8, 0.5, 1)';
  }
  function setX(n) {
    x = n;
    var v = Math.round(((x - LO) / (HI - LO)) * 100);
    root.style.setProperty('--slider-glide-x', x + 'px');
    value.textContent = v;
    input.value = v;
  }
  function bump(speed, side) {
    squash = { s: Math.min(0.32, speed / 2600), side: side };
    drawThumb();
    clearTimeout(timer);
    timer = setTimeout(function () {
      squash = { s: 0, side: side };
      drawThumb();
    }, 70);
  }
  function glide(v0) {
    var v = v0, pos = x, last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      pos += v * dt;
      // Friction slows it; an end returns it at under half the speed, squashed against the wall.
      v *= Math.exp(-dt * 2.6);
      if (pos < LO || pos > HI) {
        bump(Math.abs(v), pos < LO ? -1 : 1);
        pos = clamp(pos);
        v = -v * 0.42;
      }
      setX(pos);
      if (Math.abs(v) < 10) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function down(e) {
    cancelAnimationFrame(raf);
    root.setPointerCapture(e.pointerId);
    var px = local(e);
    // Grab the thumb where you touched it; press the track and it jumps under the pointer.
    var onThumb = Math.abs(px - x) <= R + 4;
    grab = onThumb ? px - x : 0;
    if (!onThumb) setX(clamp(px));
    samples = [{ t: e.timeStamp, x: px }];
    held = true;
    root.classList.add('slider-glide--held');
    drawThumb();
    input.focus({ preventScroll: true });
  }
  function move(e) {
    if (!held) return;
    var px = local(e);
    setX(clamp(px - grab));
    samples.push({ t: e.timeStamp, x: px });
    while (samples.length > 2 && e.timeStamp - samples[0].t > 100) samples.shift();
  }
  function up(e) {
    if (!held) return;
    held = false;
    root.classList.remove('slider-glide--held');
    drawThumb();
    var a = samples[0], b = samples[samples.length - 1];
    // A drag that stopped before release doesn't glide.
    if (!a || b.t - a.t < 10 || e.timeStamp - b.t > 60) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var v = Math.max(-3000, Math.min(3000, ((b.x - a.x) / (b.t - a.t)) * 1000));
    if (Math.abs(v) > 60) glide(v);
  }
  function cancel() {
    held = false;
    root.classList.remove('slider-glide--held');
    drawThumb();
  }
  function key() {
    cancelAnimationFrame(raf);
    setX(LO + (input.value / 100) * (HI - LO));
  }
  root.addEventListener('pointerdown', down);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerup', up);
  root.addEventListener('pointercancel', cancel);
  input.addEventListener('input', key);
  return function () {
    cancelAnimationFrame(raf);
    clearTimeout(timer);
    root.removeEventListener('pointerdown', down);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerup', up);
    root.removeEventListener('pointercancel', cancel);
    input.removeEventListener('input', key);
  };
}

document.querySelectorAll('.slider-glide').forEach(initSliderGlide);
