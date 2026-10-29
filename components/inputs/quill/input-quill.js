function initFieldQuill(root) {
  var WET = 800; // ms a fresh letter stays wet
  var input = root.querySelector('.field-quill__input');
  var mirror = root.querySelector('.field-quill__mirror');
  var nib = root.querySelector('.field-quill__nib');
  var value = '';
  var times = [];
  var timer;
  function render() {
    var now = performance.now();
    var chars = mirror.querySelectorAll('.field-quill__ch');
    for (var k = chars.length; k < value.length; k++) {
      var el = document.createElement('span');
      el.className = 'field-quill__ch';
      mirror.insertBefore(el, nib);
    }
    for (var j = chars.length - 1; j >= value.length; j--) chars[j].remove();
    mirror.querySelectorAll('.field-quill__ch').forEach(function (el, i) {
      el.textContent = value[i];
      el.toggleAttribute('data-wet', now - (times[i] || 0) < WET);
    });
    root.toggleAttribute('data-empty', !value);
    // Every third word the quill goes back to the pot.
    var words = value.trim() ? value.trim().split(/\s+/).length : 0;
    var dip = Math.floor(words / 3);
    if (dip) root.setAttribute('data-dip', dip % 2 ? 'a' : 'b');
    else root.removeAttribute('data-dip');
  }
  function onInput() {
    var next = input.value;
    var now = performance.now();
    // Keep the times of the letters that did not change: the common start and end.
    var a = 0;
    while (a < value.length && a < next.length && value[a] === next[a]) a++;
    var b = 0;
    while (b < value.length - a && b < next.length - a && value[value.length - 1 - b] === next[next.length - 1 - b]) b++;
    times = times.slice(0, a).concat(new Array(next.length - a - b).fill(now), times.slice(times.length - b));
    value = next;
    render();
    // Once the newest letter has dried, draw again so it settles.
    clearTimeout(timer);
    timer = setTimeout(render, WET + 20);
  }
  input.addEventListener('input', onInput);
  return function () {
    clearTimeout(timer);
    input.removeEventListener('input', onInput);
  };
}

document.querySelectorAll('.field-quill').forEach(initFieldQuill);
