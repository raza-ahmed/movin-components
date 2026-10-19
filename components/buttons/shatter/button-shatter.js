function initBtnShatter(root) {
  var face = root.querySelector('.btn-shatter__face');
  if (!face) return;
  var COLS = 6;
  var ROWS = 2;
  var shards = [];
  var busy = false;

  function clear() {
    shards.forEach(function (s) {
      s.remove();
    });
    shards = [];
    root.classList.remove('btn-shatter--broken');
    busy = false;
  }

  function shatter(e) {
    if (busy) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      face.animate([{ opacity: 1 }, { opacity: 0.5 }, { opacity: 1 }], { duration: 300 });
      return;
    }
    busy = true;
    var w = face.offsetWidth;
    var h = face.offsetHeight;
    var box = face.getBoundingClientRect();
    // From the click point; from the centre for a keyboard press.
    var ox = e.detail ? e.clientX - box.left : w / 2;
    var oy = e.detail ? e.clientY - box.top : h / 2;

    // A jittered grid, each cell cut on a random diagonal: 24 irregular triangles.
    var pts = [];
    for (var r = 0; r <= ROWS; r++) {
      pts.push([]);
      for (var c = 0; c <= COLS; c++) {
        var edge = r === 0 || r === ROWS || c === 0 || c === COLS;
        pts[r].push([
          (c / COLS) * w + (edge ? 0 : (Math.random() - 0.5) * (w / COLS) * 0.6),
          (r / ROWS) * h + (edge ? 0 : (Math.random() - 0.5) * (h / ROWS) * 0.5),
        ]);
      }
    }
    var tris = [];
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        var a = pts[y][x], b = pts[y][x + 1], c2 = pts[y + 1][x + 1], d = pts[y + 1][x];
        if (Math.random() < 0.5) tris.push([a, b, c2], [a, c2, d]);
        else tris.push([a, b, d], [b, c2, d]);
      }
    }

    var left = tris.length;
    tris.forEach(function (tri) {
      var shard = face.cloneNode(true);
      shard.classList.add('btn-shatter__shard');
      shard.setAttribute('aria-hidden', 'true');
      shard.style.clipPath = 'polygon(' + tri.map(function (p) { return p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px'; }).join(',') + ')';
      var cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
      var cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
      shard.style.transformOrigin = cx + 'px ' + cy + 'px';
      root.appendChild(shard);
      shards.push(shard);

      var dx = cx - ox;
      var dy = cy - oy;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var power = 1.3 - Math.min(1, dist / w); // shards near the hit fly furthest
      var reach = 26 + Math.random() * 60 * power;
      var out =
        'translate3d(' + ((dx / dist) * reach).toFixed(1) + 'px,' + ((dy / dist) * reach * 1.4 - 8).toFixed(1) + 'px,' + (30 + Math.random() * 110).toFixed(0) + 'px) ' +
        'rotateX(' + ((Math.random() - 0.5) * 140).toFixed(0) + 'deg) rotateY(' + ((Math.random() - 0.5) * 140).toFixed(0) + 'deg) rotateZ(' + ((Math.random() - 0.5) * 120).toFixed(0) + 'deg)';
      var drift = out.replace(/^translate3d\(([-\d.]+)px,([-\d.]+)px/, function (_, tx, ty) {
        return 'translate3d(' + tx + 'px,' + (parseFloat(ty) + 5).toFixed(1) + 'px';
      });
      var rest = 'translate3d(0px,0px,0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
      var lit = 'brightness(' + (0.55 + Math.random() * 0.7).toFixed(2) + ')';
      var anim = shard.animate(
        [
          { transform: rest, filter: 'brightness(1)', offset: 0, easing: 'cubic-bezier(0.12, 0.9, 0.25, 1)' },
          { transform: out, filter: lit, offset: 0.4, easing: 'linear' },
          { transform: drift, filter: lit, offset: 0.56, easing: 'cubic-bezier(0.7, 0, 0.25, 1)' },
          { transform: rest, filter: 'brightness(1)', offset: 1 },
        ],
        { duration: 1400 + Math.random() * 250 }
      );
      anim.onfinish = function () {
        if (--left) return;
        clear();
        face.animate([{ scale: '1.06' }, { scale: '1' }], { duration: 260, easing: 'cubic-bezier(0.3, 1.6, 0.5, 1)' });
      };
    });
    root.classList.add('btn-shatter--broken');
  }

  root.addEventListener('click', shatter);
  return function () {
    root.removeEventListener('click', shatter);
    clear();
  };
}

document.querySelectorAll('.btn-shatter').forEach(initBtnShatter);
