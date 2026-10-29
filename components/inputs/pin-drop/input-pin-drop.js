function initFieldPinDrop(root) {
  var STEP = 10;
  var CITIES = [
    { name: 'Lisbon', country: 'Portugal', x: 11, y: 3 },
    { name: 'Oslo', country: 'Norway', x: 13, y: 1 },
    { name: 'Cairo', country: 'Egypt', x: 14, y: 4 },
    { name: 'Tokyo', country: 'Japan', x: 21, y: 3 },
    { name: 'New York', country: 'United States', x: 6, y: 3 },
    { name: 'Lima', country: 'Peru', x: 7, y: 7 },
    { name: 'Sydney', country: 'Australia', x: 20, y: 8 },
    { name: 'Nairobi', country: 'Kenya', x: 14, y: 6 },
  ];
  var input = root.querySelector('.field-pin-drop__input');
  var map = root.querySelector('.field-pin-drop__map');
  var where = root.querySelector('.field-pin-drop__where');
  var current = null;
  function update() {
    var t = input.value.trim().toLowerCase();
    // A city counts once what you typed can only be that one.
    var hits = t.length >= 2 ? CITIES.filter(function (c) { return c.name.toLowerCase().indexOf(t) === 0; }) : [];
    var city = hits.length === 1 ? hits[0] : CITIES.find(function (c) { return c.name.toLowerCase() === t; }) || null;
    where.textContent = city ? city.country : '';
    if (city === current) return;
    current = city;
    var old = map.querySelector('.field-pin-drop__pin');
    if (old) old.remove();
    if (!city) return;
    // A new pin each time, so it drops in and rings out from the start.
    var pin = document.createElement('span');
    pin.className = 'field-pin-drop__pin';
    pin.style.left = city.x * STEP + 5 + 'px';
    pin.style.top = city.y * STEP + 5 + 'px';
    pin.innerHTML = '<span class="field-pin-drop__ring"></span><svg viewBox="0 0 14 20"><path d="M7 20C3 14 0 10.5 0 7a7 7 0 0 1 14 0c0 3.5-3 7-7 13Z"></path><circle cx="7" cy="7" r="2.6"></circle></svg>';
    map.appendChild(pin);
  }
  input.addEventListener('input', update);
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.field-pin-drop').forEach(initFieldPinDrop);
