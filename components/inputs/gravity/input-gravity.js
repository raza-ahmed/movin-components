function initFieldGravity(root) {
  var input = root.querySelector('.field-gravity__input');
  var box = root.querySelector('.field-gravity__box');
  if (!input || !box) return;
  var PAD = 12;
  var ctx = document.createElement('canvas').getContext('2d');
  var value = input.value;
  var id = 0;
  function change() {
    var next = input.value;
    if (next.length < value.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Find what was removed, and where each removed letter sat on screen.
      var p = 0;
      while (p < next.length && value[p] === next[p]) p++;
      var removed = value.slice(p, p + value.length - next.length);
      ctx.font = getComputedStyle(input).font;
      removed.split('').forEach(function (c, i) {
        id += 1;
        var r = Math.sin(id * 78.233) * 43758.5;
        var f = r - Math.floor(r);
        var drop = document.createElement('span');
        drop.className = 'field-gravity__drop';
        drop.setAttribute('aria-hidden', 'true');
        drop.textContent = c;
        drop.style.left = PAD + ctx.measureText(value.slice(0, p + i)).width - input.scrollLeft + 'px';
        drop.style.animationDelay = i * 25 + 'ms';
        drop.style.setProperty('--dx', ((f - 0.5) * 50).toFixed(0) + 'px');
        drop.style.setProperty('--rot', ((f - 0.5) * 300).toFixed(0) + 'deg');
        drop.addEventListener('animationend', function () { drop.remove(); });
        box.appendChild(drop);
      });
    }
    value = next;
  }
  input.addEventListener('input', change);
  return function () { input.removeEventListener('input', change); };
}

document.querySelectorAll('.field-gravity').forEach(initFieldGravity);
