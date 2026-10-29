function initBtnBlackHole(root) {
  var word = root.querySelector('.btn-black-hole__word');
  if (!word) return;
  // Each letter's distance to the centre: its pivot, and how long it lags before falling in.
  var mid = word.offsetWidth / 2;
  word.querySelectorAll('.btn-black-hole__ch').forEach(function (ch) {
    var dx = mid - (ch.offsetLeft + ch.offsetWidth / 2);
    ch.style.setProperty('--dx', dx.toFixed(1) + 'px');
    ch.style.setProperty('--d', (Math.abs(dx) / 260).toFixed(3) + 's');
  });
}

document.querySelectorAll('.btn-black-hole').forEach(initBtnBlackHole);
