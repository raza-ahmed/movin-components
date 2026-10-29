function initFieldUrl(root) {
  var input = root.querySelector('.field-url__input');
  if (!input) return;
  var LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z"></path></svg>';
  var OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M7 11V8a5 5 0 0 1 9.5-2M5 11h14v10H5z"></path></svg>';
  function parse(raw) {
    var s = raw.trim();
    if (!s || /\s/.test(s)) return null;
    try {
      var u = new URL(/^[a-z]+:\/\//i.test(s) ? s : 'https://' + s);
      return u.hostname.indexOf('.') >= 0 ? u : null;
    } catch (e) {
      return null;
    }
  }
  function render() {
    var old = root.querySelector('.field-url__parts');
    var u = parse(input.value);
    var list;
    if (!u) {
      list = document.createElement('div');
      list.className = 'field-url__parts';
      old.replaceWith(list);
      return;
    }
    list = document.createElement('ul');
    list.className = 'field-url__parts';
    list.setAttribute('aria-label', 'Address parts');
    var n = 0;
    function chip(html, kind) {
      var li = document.createElement('li');
      li.className = 'field-url__part';
      if (kind) li.setAttribute('data-kind', kind);
      li.style.animationDelay = n++ * 50 + 'ms';
      li.innerHTML = html;
      return li;
    }
    function text(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }
    list.appendChild(chip((u.protocol === 'https:' ? LOCK : OPEN) + (u.protocol === 'https:' ? 'secure' : text(u.protocol.replace(':', '')))));
    list.appendChild(chip(text(u.hostname.replace(/^www\./, '')), 'host'));
    u.pathname.split('/').filter(Boolean).forEach(function (seg) {
      var li = document.createElement('li');
      li.style.display = 'contents';
      var sep = document.createElement('span');
      sep.className = 'field-url__sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '/';
      var part = document.createElement('span');
      part.className = 'field-url__part';
      part.style.animationDelay = n++ * 50 + 'ms';
      part.textContent = decodeURIComponent(seg);
      li.appendChild(sep);
      li.appendChild(part);
      list.appendChild(li);
    });
    u.searchParams.forEach(function (v, k) {
      list.appendChild(chip('<b>' + text(k) + '</b>' + text(v), 'query'));
    });
    old.replaceWith(list);
  }
  input.addEventListener('input', render);
  return function () { input.removeEventListener('input', render); };
}

document.querySelectorAll('.field-url').forEach(initFieldUrl);
