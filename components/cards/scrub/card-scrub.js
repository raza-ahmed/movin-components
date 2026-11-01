function initCardScrub(root) {
  var FRAMES = 12;
  var thumb = root.querySelector('.card-scrub__thumb');
  var far = root.querySelector('.card-scrub__far');
  var near = root.querySelector('.card-scrub__near');
  var trail = root.querySelector('.card-scrub__trail');
  var plane = root.querySelector('.card-scrub__plane').parentNode;
  var fill = root.querySelector('.card-scrub__bar span');
  var chip = root.querySelector('.card-scrub__chip');
  var f = 0;
  var live = false;

  function time(n) {
    return '0:' + String(n * 2).padStart(2, '0');
  }
  // One frame of the clip: a paper plane loops across, the hills sliding behind it at two speeds.
  function drawFrame() {
    var t = f / (FRAMES - 1);
    var x = 22 + t * 168;
    var y = 58 - 30 * Math.sin(t * Math.PI) + 10 * Math.sin(t * Math.PI * 3);
    var dy = -30 * Math.PI * Math.cos(t * Math.PI) + 30 * Math.PI * Math.cos(t * Math.PI * 3);
    var tilt = (Math.atan2(dy / 168, 1) * 180) / Math.PI;
    var a = -t * 30;
    var b = -t * 70;
    far.setAttribute('d', 'M' + a + ' 86 Q' + (40 + a) + ' 64 ' + (90 + a) + ' 80 T' + (200 + a) + ' 74 T' + (300 + a) + ' 78 V112 H' + a + ' Z');
    near.setAttribute('d', 'M' + b + ' 98 Q' + (50 + b) + ' 84 ' + (110 + b) + ' 96 T' + (230 + b) + ' 92 T' + (340 + b) + ' 96 V112 H' + b + ' Z');
    trail.setAttribute('d', 'M 10 58 Q ' + (10 + x) / 2 + ' ' + (y - 18) + ' ' + (x - 8) + ' ' + y);
    plane.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(' + tilt + ')');
  }
  function render() {
    root.classList.toggle('card-scrub--live', live);
    drawFrame();
    fill.style.width = ((f + 1) / FRAMES) * 100 + '%';
    chip.textContent = live ? time(f) : time(FRAMES - 1);
    thumb.setAttribute('aria-valuenow', f);
    thumb.setAttribute('aria-valuetext', time(f));
  }
  // The pointer's position across the thumbnail picks the frame; the keys step through them.
  // Under prefers-reduced-motion nothing plays by itself: every frame is one the reader chose.
  function pick(e) {
    var r = thumb.getBoundingClientRect();
    live = true;
    f = Math.max(0, Math.min(FRAMES - 1, Math.floor(((e.clientX - r.left) / r.width) * FRAMES)));
    render();
  }
  function onLeave() {
    live = false;
    f = 0;
    render();
  }
  function onKey(e) {
    var next = { ArrowRight: f + 1, ArrowLeft: f - 1, Home: 0, End: FRAMES - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    live = true;
    f = Math.max(0, Math.min(FRAMES - 1, next));
    render();
  }
  function onBlur() {
    live = false;
    render();
  }
  thumb.addEventListener('pointermove', pick);
  thumb.addEventListener('pointerdown', pick);
  thumb.addEventListener('pointerleave', onLeave);
  thumb.addEventListener('keydown', onKey);
  thumb.addEventListener('blur', onBlur);
  return function () {
    thumb.removeEventListener('pointermove', pick);
    thumb.removeEventListener('pointerdown', pick);
    thumb.removeEventListener('pointerleave', onLeave);
    thumb.removeEventListener('keydown', onKey);
    thumb.removeEventListener('blur', onBlur);
  };
}

document.querySelectorAll('.card-scrub').forEach(initCardScrub);
