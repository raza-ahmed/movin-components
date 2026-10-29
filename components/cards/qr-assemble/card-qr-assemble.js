function initCardQrAssemble(root) {
  var mods = root.querySelectorAll('.card-qr-assemble__m');
  var label = root.querySelector('.card-qr-assemble__label');
  var N = 21;
  if (mods.length !== N * N || !label) return;
  // Two seeded fields (the same as the markup was built from): the noise it shows at rest and the code it settles into.
  var seed = 17;
  function rand() { return (seed = (seed * 16807) % 2147483647) / 2147483647; }
  function inFinder(x, y) { return (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7); }
  var noise = [];
  var code = [];
  for (var i = 0; i < N * N; i++) {
    var x = i % N;
    var y = Math.floor(i / N);
    var zone = (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
    noise.push(!inFinder(x, y) && rand() > 0.62);
    code.push(!zone && (rand() > 0.5 || (y === 6 && x % 2 === 0) || (x === 6 && y % 2 === 0)));
    rand(); // the delay, already in the markup
  }
  function set(ready) {
    root.toggleAttribute('data-ready', ready);
    var field = ready ? code : noise;
    mods.forEach(function (m, k) { m.toggleAttribute('data-on', field[k]); });
    label.textContent = ready ? 'Ready to scan' : 'Generating…';
  }
  function on() { set(true); }
  function off() { set(false); }
  root.addEventListener('pointerenter', on);
  root.addEventListener('pointerleave', off);
  root.addEventListener('focus', on);
  root.addEventListener('blur', off);
  return function () {
    root.removeEventListener('pointerenter', on);
    root.removeEventListener('pointerleave', off);
    root.removeEventListener('focus', on);
    root.removeEventListener('blur', off);
  };
}

document.querySelectorAll('.card-qr-assemble').forEach(initCardQrAssemble);
