function initBtnPatternLock(root) {
  var pad = root.querySelector('.btn-pattern-lock__pad');
  var text = root.querySelector('.btn-pattern-lock__text');
  var hint = root.querySelector('.btn-pattern-lock__hint');
  if (!pad || !text || !hint) return;
  var NS = 'http://www.w3.org/2000/svg';
  var AT = [18, 48, 78];
  var DOTS = [];
  AT.forEach(function (y) { AT.forEach(function (x) { DOTS.push({ x: x, y: y }); }); });
  var DEMO = [0, 1, 2, 4, 6, 7, 8];
  var groups = pad.querySelectorAll('g');
  var line = document.createElementNS(NS, 'polyline');
  line.setAttribute('class', 'btn-pattern-lock__line');
  pad.insertBefore(line, pad.firstChild);
  var path = [];
  var cursor = null;
  var status = 'idle';
  var timers = [];

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function render() {
    root.setAttribute('data-status', status);
    groups.forEach(function (g, i) {
      var on = path.indexOf(i) >= 0;
      g.querySelectorAll('circle').forEach(function (c) { c.toggleAttribute('data-on', on); });
    });
    var pts = path.map(function (i) { return DOTS[i].x + ',' + DOTS[i].y; });
    if (cursor && status === 'drawing' && path.length) pts.push(cursor.x + ',' + cursor.y);
    line.setAttribute('points', pts.length > 1 ? pts.join(' ') : '');
    text.firstChild.textContent = status === 'ok' ? 'Unlocked' : 'Locked';
    hint.textContent = status === 'ok' ? 'Welcome back' : status === 'bad' ? 'Try 4+ dots' : 'Draw to unlock';
  }

  function reset() {
    status = 'idle';
    path = [];
    cursor = null;
    render();
  }

  function finish() {
    cursor = null;
    status = path.length >= 4 ? 'ok' : 'bad';
    render();
    later(reset, status === 'ok' ? 1800 : 450);
  }

  function local(e) {
    var r = pad.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 96, y: ((e.clientY - r.top) / r.height) * 96 };
  }
  function hit(p) {
    for (var i = 0; i < DOTS.length; i++) if (Math.hypot(DOTS[i].x - p.x, DOTS[i].y - p.y) < 13) return i;
    return -1;
  }

  function down(e) {
    if (status !== 'idle') return;
    var i = hit(local(e));
    if (i < 0) return;
    root.setPointerCapture(e.pointerId);
    status = 'drawing';
    path = [i];
    render();
  }
  function move(e) {
    if (status !== 'drawing' || !root.hasPointerCapture(e.pointerId)) return;
    cursor = local(e);
    var i = hit(cursor);
    if (i >= 0 && path.indexOf(i) < 0) path.push(i);
    render();
  }
  function up(e) {
    if (!root.hasPointerCapture(e.pointerId)) return;
    // A tap on one dot is a click, not a pattern: reset, and the click plays the demo.
    if (path.length <= 1) reset();
    else finish();
  }
  function play() {
    if (status !== 'idle') return;
    status = 'drawing';
    render();
    DEMO.forEach(function (d, i) {
      later(function () {
        path = DEMO.slice(0, i + 1);
        if (i === DEMO.length - 1) finish();
        else render();
      }, 120 * (i + 1));
    });
  }
  root.addEventListener('pointerdown', down);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerup', up);
  root.addEventListener('click', play);

  return function () {
    timers.forEach(clearTimeout);
    line.remove();
    root.removeEventListener('pointerdown', down);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerup', up);
    root.removeEventListener('click', play);
  };
}

document.querySelectorAll('.btn-pattern-lock').forEach(initBtnPatternLock);
