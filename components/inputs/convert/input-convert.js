function initFieldConvert(root) {
  var input = root.querySelector('.field-convert__input');
  var rows = root.querySelector('.field-convert__rows');
  if (!input || !rows) return;
  function lin(group, name, k) {
    return { group: group, name: name, toBase: function (v) { return v * k; }, fromBase: function (v) { return v / k; } };
  }
  var UNITS = {
    km: lin('length', 'kilometres', 1000),
    m: lin('length', 'metres', 1),
    mi: lin('length', 'miles', 1609.344),
    ft: lin('length', 'feet', 0.3048),
    kg: lin('mass', 'kilograms', 1),
    g: lin('mass', 'grams', 0.001),
    lb: lin('mass', 'pounds', 0.45359237),
    c: { group: 'temp', name: 'Celsius', toBase: function (v) { return v; }, fromBase: function (v) { return v; } },
    f: { group: 'temp', name: 'Fahrenheit', toBase: function (v) { return ((v - 32) * 5) / 9; }, fromBase: function (v) { return (v * 9) / 5 + 32; } },
  };
  var SYMBOL = { c: '°C', f: '°F' };
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var group = null;
  var shown = {};
  var raf = 0;

  function fmt(v, unit) {
    return v.toLocaleString('en-GB', { maximumFractionDigits: Math.abs(v) < 10 ? 2 : 1 }) + ' ' + (SYMBOL[unit] || unit);
  }
  // Each value eases to its new number instead of jumping.
  function tween(targets) {
    cancelAnimationFrame(raf);
    var from = {};
    Object.keys(targets).forEach(function (u) { from[u] = shown[u] === undefined ? targets[u] : shown[u]; });
    var start = performance.now();
    function step(now) {
      var t = still ? 1 : Math.min(1, (now - start) / 450);
      var k = 1 - Math.pow(1 - t, 3);
      Object.keys(targets).forEach(function (u) {
        shown[u] = from[u] + (targets[u] - from[u]) * k;
        var b = rows.querySelector('[data-unit="' + u + '"] b');
        if (b) b.textContent = fmt(shown[u], u);
      });
      if (t < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function update() {
    var m = /^\s*(-?\d[\d,]*\.?\d*)\s*°?\s*(km|mi|m|ft|kg|g|lb|c|f)\s*$/i.exec(input.value);
    var unit = m && m[2].toLowerCase();
    var n = m ? parseFloat(m[1].replace(/,/g, '')) : NaN;
    if (!unit || !isFinite(n)) {
      rows.textContent = '';
      group = null;
      shown = {};
      return;
    }
    var others = Object.keys(UNITS).filter(function (u) { return u !== unit && UNITS[u].group === UNITS[unit].group; });
    var targets = {};
    others.forEach(function (u) { targets[u] = UNITS[u].fromBase(UNITS[unit].toBase(n)); });
    // A new family of units gets fresh rows, which rise in one after another.
    if (UNITS[unit].group !== group || rows.children.length !== others.length || others.some(function (u) { return !rows.querySelector('[data-unit="' + u + '"]'); })) {
      group = UNITS[unit].group;
      rows.textContent = '';
      shown = {};
      others.forEach(function (u, i) {
        var row = document.createElement('div');
        row.className = 'field-convert__row';
        row.setAttribute('data-unit', u);
        row.style.animationDelay = i * 50 + 'ms';
        var b = document.createElement('b');
        var name = document.createElement('span');
        name.textContent = UNITS[u].name;
        row.appendChild(b);
        row.appendChild(name);
        rows.appendChild(row);
      });
    }
    tween(targets);
  }
  // The server-rendered rows carry no data-unit: rebuild them once.
  rows.textContent = '';
  input.addEventListener('input', update);
  update();
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.field-convert').forEach(initFieldConvert);
