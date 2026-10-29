function initFieldConstellation(root) {
  var input = root.querySelector('.field-constellation__input');
  var svg = root.querySelector('.field-constellation__sky svg');
  var fig = root.querySelector('.field-constellation__fig');
  var name = root.querySelector('.field-constellation__name');
  if (!input || !svg || !fig || !name) return;
  var NS = 'http://www.w3.org/2000/svg';
  var W = 256;
  var H = 112;
  var STEP = 9.4;
  function hash(n) {
    var x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  function r2(n) { return Math.round(n * 100) / 100; }
  var value = input.value;
  function star(c, i) {
    return { c: c, x: r2(18 + i * STEP + (hash(i + 7) - 0.5) * 6), y: r2(16 + hash(c.charCodeAt(0) * 3.1 + i * 0.7) * (H - 40)), r: r2(1.3 + hash(c.charCodeAt(0)) * 1.6) };
  }
  // Stars and links keyed by position and letters, so unchanged ones stay and only new ones animate in.
  function render() {
    var next = input.value;
    var stars = next.split('').map(star);
    var keep = {};
    stars.forEach(function (s, i) {
      if (s.c === ' ') return;
      keep['s' + i + s.c] = s;
      var p = stars[i - 1];
      if (p && p.c !== ' ') keep['l' + i + s.c + p.c] = [p, s];
    });
    Array.prototype.slice.call(fig.children).forEach(function (el) {
      if (!keep[el.getAttribute('data-k')]) el.remove();
      else delete keep[el.getAttribute('data-k')];
    });
    Object.keys(keep).forEach(function (k) {
      var v = keep[k];
      var el;
      if (k.charAt(0) === 'l') {
        el = document.createElementNS(NS, 'line');
        el.setAttribute('class', 'field-constellation__line');
        el.setAttribute('x1', v[0].x);
        el.setAttribute('y1', v[0].y);
        el.setAttribute('x2', v[1].x);
        el.setAttribute('y2', v[1].y);
        el.setAttribute('pathLength', '1');
        fig.insertBefore(el, fig.firstChild);
      } else {
        el = document.createElementNS(NS, 'circle');
        el.setAttribute('class', 'field-constellation__star');
        el.setAttribute('cx', v.x);
        el.setAttribute('cy', v.y);
        el.setAttribute('r', v.r);
        el.style.animationDelay = '0s, ' + (0.5 + hash(Number(k.slice(1, -1))) * 2).toFixed(2) + 's';
        fig.appendChild(el);
      }
      el.setAttribute('data-k', k);
    });
    // The whole figure stays centred in the sky, gliding over as it grows.
    fig.style.transform = 'translateX(' + (W - 36 - Math.max(0, next.length - 1) * STEP) / 2 + 'px)';
    name.textContent = next.replace(/\s/g, '').length + ' stars';
    value = next;
  }
  // Tag the server-rendered stars and links with their keys.
  var initial = value.split('').map(star);
  var lines = fig.querySelectorAll('line');
  var circles = fig.querySelectorAll('circle');
  var li = 0;
  var ci = 0;
  initial.forEach(function (s, i) {
    if (s.c === ' ') return;
    var p = initial[i - 1];
    if (p && p.c !== ' ' && lines[li]) lines[li++].setAttribute('data-k', 'l' + i + s.c + p.c);
    if (circles[ci]) circles[ci++].setAttribute('data-k', 's' + i + s.c);
  });
  input.addEventListener('input', render);
  return function () { input.removeEventListener('input', render); };
}

document.querySelectorAll('.field-constellation').forEach(initFieldConstellation);
