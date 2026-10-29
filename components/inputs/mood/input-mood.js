function initFieldMood(root) {
  var range = root.querySelector('.field-mood__range');
  var word = root.querySelector('.field-mood__word');
  var mouth = root.querySelector('.field-mood__mouth');
  var brows = root.querySelectorAll('.field-mood__brow');
  var eyes = root.querySelectorAll('.field-mood__eye');
  var cheeks = root.querySelectorAll('.field-mood__cheek');
  if (!range || !word || !mouth || brows.length !== 2) return;
  var WORDS = ['Awful', 'Bad', 'Okay', 'Good', 'Great'];
  function brow(x, dir, t) { return 'M' + (x - 6) + ' ' + (24 - t * dir * 3) + ' L' + (x + 6) + ' ' + (24 + t * dir * 3); }
  function update() {
    var v = Number(range.value);
    var t = (v - 50) / 50; // -1 sad, 1 happy
    var w = WORDS[Math.min(4, Math.floor(v / 20))];
    // The mouth bends, the brows tilt and the eyes open wider as the mood lifts.
    mouth.setAttribute('d', 'M26 ' + (52 - t * 2) + ' Q38 ' + (52 + t * 11) + ' 50 ' + (52 - t * 2));
    brows[0].setAttribute('d', brow(27, -1, t));
    brows[1].setAttribute('d', brow(49, 1, t));
    eyes.forEach(function (e) { e.setAttribute('ry', String(3.4 + Math.max(0, t) * 1.2)); });
    cheeks.forEach(function (c) { c.setAttribute('opacity', String(Math.max(0, t) * 0.8)); });
    range.setAttribute('aria-valuetext', w);
    if (word.textContent !== w) {
      // The word flips in when it changes.
      var fresh = word.cloneNode(false);
      fresh.textContent = w;
      word.replaceWith(fresh);
      word = fresh;
    }
  }
  range.addEventListener('input', update);
  return function () { range.removeEventListener('input', update); };
}

document.querySelectorAll('.field-mood').forEach(initFieldMood);
