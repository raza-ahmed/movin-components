function initFieldNaturalDate(root) {
  var input = root.querySelector('.field-natural-date__input');
  var out = root.querySelector('.field-natural-date__out');
  if (!input || !out) return;
  var DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  // Reads phrases like "tomorrow 9am", "next fri 3pm", "in 3 days", "tonight". Null when nothing is recognised.
  function parse(text, now) {
    var s = text.toLowerCase();
    var d = new Date(now);
    var hit = false;
    var time = null;
    if (/\btoday\b/.test(s)) hit = true;
    if (/\btomorrow\b|\btmrw\b/.test(s)) {
      d.setDate(d.getDate() + 1);
      hit = true;
    }
    if (/\btonight\b/.test(s)) {
      time = [20, 0];
      hit = true;
    }
    var wd = /\b(?:next\s+)?(sun|mon|tue|wed|thu|fri|sat)[a-z]*\b/.exec(s);
    if (wd) {
      d.setDate(d.getDate() + ((DAYS.indexOf(wd[1]) - d.getDay() + 7) % 7 || 7));
      hit = true;
    }
    var rel = /\bin\s+(\d+)\s*(min|minute|hour|hr|day|week)s?\b/.exec(s);
    if (rel) {
      var n = Number(rel[1]);
      var unit = rel[2];
      if (unit === 'min' || unit === 'minute') d.setMinutes(d.getMinutes() + n);
      else if (unit === 'hour' || unit === 'hr') d.setHours(d.getHours() + n);
      else d.setDate(d.getDate() + n * (unit === 'week' ? 7 : 1));
      hit = true;
    }
    var ampm = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/.exec(s);
    var clock = /\b(\d{1,2}):(\d{2})\b/.exec(s);
    if (ampm) time = [(Number(ampm[1]) % 12) + (ampm[3] === 'pm' ? 12 : 0), Number(ampm[2] || 0)];
    else if (clock) time = [Number(clock[1]), Number(clock[2])];
    else if (/\bnoon\b/.test(s)) time = [12, 0];
    else if (/\bmorning\b/.test(s)) time = [9, 0];
    else if (/\bevening\b/.test(s)) time = [18, 0];
    if (time) {
      d.setHours(time[0], time[1], 0, 0);
      hit = true;
    } else if (hit && !rel) d.setHours(9, 0, 0, 0);
    return hit ? d : null;
  }
  function relative(d, now) {
    var mins = Math.round((d.getTime() - now.getTime()) / 60000);
    if (mins < 0) return 'already passed';
    if (mins < 60) return 'in ' + mins + ' min';
    var hours = Math.round(mins / 60);
    if (hours < 24) return 'in ' + hours + ' h';
    var days = Math.round(hours / 24);
    return days === 1 ? 'in 1 day' : 'in ' + days + ' days';
  }

  var last = null;
  function update() {
    var now = new Date();
    var d = parse(input.value, now);
    var key = d ? d.getTime() : null;
    if (key === last && out.firstChild) return;
    last = key;
    out.textContent = '';
    if (!d) return;
    // A fresh chip each time the date changes, so it flips in.
    var chip = document.createElement('div');
    chip.className = 'field-natural-date__chip';
    chip.innerHTML = '<span class="field-natural-date__cal" aria-hidden="true"><i></i><b></b></span><span><div class="field-natural-date__when"></div><div class="field-natural-date__rel"></div></span>';
    chip.querySelector('i').textContent = d.toLocaleDateString('en-GB', { month: 'short' });
    chip.querySelector('b').textContent = String(d.getDate());
    chip.querySelector('.field-natural-date__when').textContent =
      d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    chip.querySelector('.field-natural-date__rel').textContent = relative(d, now);
    out.appendChild(chip);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.field-natural-date').forEach(initFieldNaturalDate);
