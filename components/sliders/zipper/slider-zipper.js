function initSliderZipper(root) {
  var W = 220;
  var MID = 34;
  var OPEN = 20; // How far each edge has parted at the far end when fully unzipped.
  var input = root.querySelector('.slider-zipper__input');
  var fabric = root.querySelectorAll('.slider-zipper__fabric');
  var teeth = root.querySelectorAll('.slider-zipper__tooth');
  var pull = root.querySelector('svg g');
  function update() {
    var v = +input.value;
    var px = 10 + (v / 100) * (W - 20);
    var spread = (OPEN * px) / W;
    // How far an edge has parted at x: nothing at the pull, most at the left end.
    function off(x) { return x >= px ? 0 : (spread * (px - x)) / px; }
    // Teeth come in pairs, top then bottom, every 10 units from x = 2.
    for (var i = 0; i < teeth.length; i += 2) {
      var x = 2 + (i / 2) * 10;
      teeth[i].setAttribute('y', (MID - 7 - off(x + 3)).toFixed(1));
      teeth[i + 1].setAttribute('y', (MID + off(x + 8)).toFixed(1));
    }
    var p = px.toFixed(1);
    fabric[0].setAttribute('d', 'M0 8a8 8 0 0 1 8-8H' + (W - 8) + ' a8 8 0 0 1 8 8V' + (MID - 5) + 'H' + p + 'L0 ' + (MID - 5 - spread).toFixed(1) + 'Z');
    fabric[1].setAttribute('d', 'M0 60a8 8 0 0 0 8 8H' + (W - 8) + ' a8 8 0 0 0 8-8V' + (MID + 5) + 'H' + p + 'L0 ' + (MID + 5 + spread).toFixed(1) + 'Z');
    pull.setAttribute('transform', 'translate(' + p + ' ' + MID + ')');
    input.setAttribute('aria-valuetext', v + ' percent open');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-zipper').forEach(initSliderZipper);
