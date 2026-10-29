function initFieldCalc(root) {
  var box = root.querySelector('.field-calc__box');
  var input = root.querySelector('.field-calc__input');
  var out = root.querySelector('.field-calc__result');
  var foot = root.querySelector('.field-calc__foot');
  if (!box || !input || !out || !foot) return;

  // A tiny arithmetic parser: + - * / x ( ) and a trailing % on any number. Throws on anything else.
  function evaluate(src) {
    var s = src.replace(/\s+/g, '').replace(/,/g, '').replace(/[x×]/g, '*').replace(/÷/g, '/');
    var i = 0;
    function num() {
      var m = /^\d*\.?\d+/.exec(s.slice(i));
      if (!m) throw new Error('number');
      i += m[0].length;
      var v = parseFloat(m[0]);
      if (s[i] === '%') {
        i++;
        v /= 100;
      }
      return v;
    }
    function factor() {
      if (s[i] === '-') {
        i++;
        return -factor();
      }
      if (s[i] === '(') {
        i++;
        var v = expr();
        if (s[i++] !== ')') throw new Error('paren');
        return v;
      }
      return num();
    }
    function term() {
      var v = factor();
      while (s[i] === '*' || s[i] === '/') {
        var op = s[i++];
        var r = factor();
        v = op === '*' ? v * r : v / r;
      }
      return v;
    }
    function expr() {
      var v = term();
      while (s[i] === '+' || s[i] === '-') {
        var op = s[i++];
        var r = term();
        v = op === '+' ? v + r : v - r;
      }
      return v;
    }
    var v = expr();
    if (i !== s.length || !isFinite(v)) throw new Error('trailing');
    return v;
  }

  var result = null;
  var shown = '';
  function update() {
    var value = input.value;
    result = null;
    if (/[-+*/x×÷%(]/.test(value.replace(/^\s*-/, ''))) {
      try { result = evaluate(value); } catch (e) { result = null; }
    }
    var next = result === null ? '' : result.toLocaleString('en-US', { maximumFractionDigits: 2 });
    // A character only replays its roll when it changes.
    var kids = out.querySelectorAll('span:not(.field-calc__eq)');
    if (!next) out.textContent = '';
    else {
      if (!out.querySelector('.field-calc__eq')) {
        out.textContent = '';
        var eq = document.createElement('span');
        eq.className = 'field-calc__eq';
        eq.textContent = '=';
        out.appendChild(eq);
        kids = [];
      }
      next.split('').forEach(function (c, i) {
        if (kids[i] && shown[i] === c) return;
        var sp = document.createElement('span');
        sp.style.animationDelay = i * 18 + 'ms';
        sp.textContent = c;
        if (kids[i]) kids[i].replaceWith(sp);
        else out.appendChild(sp);
      });
      Array.prototype.slice.call(out.querySelectorAll('span:not(.field-calc__eq)'), next.length).forEach(function (sp) { sp.remove(); });
    }
    shown = next;
  }
  function commit() {
    if (result === null) return;
    var was = foot.querySelector('.field-calc__was') || document.createElement('span');
    was.className = 'field-calc__was';
    was.textContent = input.value.trim();
    foot.appendChild(was);
    input.value = String(Math.round(result * 100) / 100);
    box.removeAttribute('data-flash');
    void box.offsetWidth; // restart the flash
    box.setAttribute('data-flash', '');
    update();
  }
  function key(e) {
    if (e.key === 'Enter') commit();
  }
  input.addEventListener('input', update);
  input.addEventListener('keydown', key);
  update();
  return function () {
    input.removeEventListener('input', update);
    input.removeEventListener('keydown', key);
  };
}

document.querySelectorAll('.field-calc').forEach(initFieldCalc);
