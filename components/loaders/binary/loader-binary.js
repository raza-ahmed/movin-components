function initLoaderBinary(root) {
  var bits = root.querySelectorAll('.loader-binary__bit');
  var hex = root.querySelector('.loader-binary__hex b');
  var dec = hex && hex.nextSibling;
  if (bits.length !== 8 || !hex || !dec) return;
  function show(n) {
    bits.forEach(function (b, i) {
      var on = (n >> (7 - i)) & 1;
      b.textContent = String(on);
      b.toggleAttribute('data-on', !!on);
    });
    hex.textContent = n.toString(16).toUpperCase().padStart(2, '0');
    dec.textContent = ' · ' + String(n).padStart(3, '0');
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    show(0x2a);
    return;
  }
  var n = 0;
  var timer = setInterval(function () { show((n = (n + 1) % 256)); }, 110);
  return function () { clearInterval(timer); };
}

document.querySelectorAll('.loader-binary').forEach(initLoaderBinary);
