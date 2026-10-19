function initCardScratch(root) {
  var canvas = root.querySelector('.card-scratch__foil');
  var action = root.querySelector('.card-scratch__action');
  if (!canvas || !action) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = 1;
  var last = null;
  var strokes = 0;
  var won = false;

  function paint() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    var cs = getComputedStyle(canvas);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, cs.color);
    g.addColorStop(0.45, cs.borderTopColor);
    g.addColorStop(1, cs.color);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // Speckle, so it reads as foil rather than a flat grey.
    ctx.fillStyle = cs.outlineColor;
    for (var i = 0; i < 260; i++) {
      ctx.globalAlpha = Math.random() * 0.35;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }
    ctx.globalAlpha = 1;
    ctx.font = '600 11px ' + getComputedStyle(root).fontFamily;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', w / 2, h / 2);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 24;
  }

  function local(e) {
    var box = canvas.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  }

  function flake(x, y) {
    if (reduce) return;
    var f = document.createElement('span');
    f.className = 'card-scratch__flake';
    f.style.left = x + 'px';
    f.style.top = y + 'px';
    root.appendChild(f);
    var a = f.animate(
      [
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: 'translate(' + (Math.random() * 30 - 15).toFixed(0) + 'px, ' + (30 + Math.random() * 40).toFixed(0) + 'px) rotate(' + (Math.random() * 360).toFixed(0) + 'deg)', opacity: 0 },
      ],
      { duration: 600 + Math.random() * 400, easing: 'cubic-bezier(0.4, 0, 1, 1)' }
    );
    a.onfinish = function () {
      f.remove();
    };
  }

  // Share of the foil scratched away, sampled on a coarse grid.
  function cleared() {
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var step = 8 * dpr;
    var gone = 0;
    var all = 0;
    for (var y = 0; y < canvas.height; y += step) {
      for (var x = 0; x < canvas.width; x += step) {
        all++;
        if (data[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3] < 40) gone++;
      }
    }
    return gone / all;
  }

  function win() {
    won = true;
    root.classList.add('card-scratch--won');
    action.textContent = 'Scratch again';
  }

  function reset() {
    won = false;
    strokes = 0;
    root.classList.remove('card-scratch--won');
    action.textContent = 'Reveal';
    paint();
  }

  function down(e) {
    if (won) return;
    last = local(e);
    canvas.setPointerCapture(e.pointerId);
    move(e);
  }

  function move(e) {
    if (!last || won) return;
    var at = local(e);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(at.x + 0.01, at.y);
    ctx.stroke();
    if (Math.random() < 0.35) flake(at.x, at.y);
    last = at;
    if (++strokes % 10 === 0 && cleared() > 0.5) win();
  }

  function up() {
    last = null;
  }

  function act() {
    if (won) reset();
    else win();
  }

  var ro = new ResizeObserver(function () {
    if (!won) paint();
  });
  ro.observe(canvas);
  paint();
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  action.addEventListener('click', act);

  return function () {
    ro.disconnect();
    canvas.removeEventListener('pointerdown', down);
    canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('pointerup', up);
    canvas.removeEventListener('pointercancel', up);
    action.removeEventListener('click', act);
    root.classList.remove('card-scratch--won');
  };
}

document.querySelectorAll('.card-scratch').forEach(initCardScratch);
