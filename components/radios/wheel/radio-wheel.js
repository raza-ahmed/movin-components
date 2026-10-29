function initRadioWheel(root) {
  var inputs = root.querySelectorAll('input');
  var values = [];
  for (var i = 0; i < inputs.length; i++) values.push(inputs[i].value);
  // Segment k is centred at 45 + 90k degrees clockwise from the top.
  function restFor(k) { return -(45 + k * 90); }
  var checked = root.querySelector('input:checked');
  var turned = restFor(checked ? values.indexOf(checked.value) : 0);
  var flip = 0;
  root.style.setProperty('--radio-wheel-r', turned + 'deg');
  function onChange(e) {
    var k = values.indexOf(e.target.value);
    if (k < 0) return;
    // Always forward: two full turns plus whatever brings the pick under the pointer.
    var delta = (((restFor(k) - turned) % 360) + 360) % 360;
    turned += 720 + delta;
    root.style.setProperty('--radio-wheel-r', turned + 'deg');
    flip += 1;
    root.setAttribute('data-flip', flip % 2 ? 'a' : 'b');
  }
  root.addEventListener('change', onChange);
  return function () { root.removeEventListener('change', onChange); };
}

document.querySelectorAll('.radio-wheel').forEach(initRadioWheel);
