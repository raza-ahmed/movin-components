function initRadioHop(root) {
  var inputs = root.querySelectorAll('input');
  var values = [];
  for (var i = 0; i < inputs.length; i++) values.push(inputs[i].value);
  var checked = root.querySelector('input:checked');
  var last = checked ? values.indexOf(checked.value) : 0;
  var flip = 0;
  root.style.setProperty('--radio-hop-k', last);
  // One hop for every tile the ball crosses: --n sets both the hop count and the travel time.
  function onChange(e) {
    var k = values.indexOf(e.target.value);
    if (k < 0) return;
    root.style.setProperty('--radio-hop-n', Math.max(1, Math.abs(k - last)));
    root.style.setProperty('--radio-hop-k', k);
    last = k;
    flip += 1;
    root.setAttribute('data-flip', flip % 2 ? 'a' : 'b');
  }
  root.addEventListener('change', onChange);
  return function () { root.removeEventListener('change', onChange); };
}

document.querySelectorAll('.radio-hop').forEach(initRadioHop);
