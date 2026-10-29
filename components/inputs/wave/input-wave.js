function initFieldWave(root) {
  var input = root.querySelector('.field-wave__input');
  var mirror = root.querySelector('.field-wave__mirror');
  if (!input || !mirror) return;
  var value = input.value;
  // Diff by common prefix and suffix: only the letters actually typed are new, so only they animate in.
  function change() {
    var next = input.value;
    var p = 0;
    while (p < value.length && p < next.length && value[p] === next[p]) p++;
    var s = 0;
    while (s < value.length - p && s < next.length - p && value[value.length - 1 - s] === next[next.length - 1 - s]) s++;
    var spans = Array.prototype.slice.call(mirror.children);
    spans.slice(p, spans.length - s).forEach(function (el) { el.remove(); });
    var after = spans[spans.length - s] || null;
    next.slice(p, next.length - s).split('').forEach(function (c) {
      var el = document.createElement('span');
      el.className = 'field-wave__ch';
      el.textContent = c;
      mirror.insertBefore(el, after);
    });
    // Each letter's place in the wave.
    Array.prototype.forEach.call(mirror.children, function (el, i) { el.style.setProperty('--i', String(i)); });
    value = next;
  }
  input.addEventListener('input', change);
  return function () { input.removeEventListener('input', change); };
}

document.querySelectorAll('.field-wave').forEach(initFieldWave);
