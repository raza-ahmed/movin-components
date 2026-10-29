function initFieldSlug(root) {
  var input = root.querySelector('.field-slug__input');
  var path = root.querySelector('.field-slug__path');
  var copy = root.querySelector('.field-slug__copy');
  if (!input || !path || !copy) return;
  var bold = path.querySelector('b');
  function slugify(s) {
    return s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
  }
  var slug = '';
  function update() {
    var next = slugify(input.value);
    var spans = bold.children;
    // A character only replays its pop when it actually changes.
    next.split('').forEach(function (c, i) {
      if (spans[i] && slug[i] === c) return;
      var s = document.createElement('span');
      s.className = 'field-slug__ch';
      s.textContent = c;
      if (spans[i]) spans[i].replaceWith(s);
      else bold.appendChild(s);
    });
    while (bold.children.length > next.length) bold.lastChild.remove();
    slug = next;
    path.setAttribute('aria-label', 'Address: movin.design/blog/' + slug);
    copy.textContent = 'Copy';
  }
  function doCopy() {
    if (navigator.clipboard) navigator.clipboard.writeText('https://movin.design/blog/' + slug).catch(function () {});
    copy.textContent = 'Copied';
  }
  slug = slugify(input.value);
  input.addEventListener('input', update);
  copy.addEventListener('click', doCopy);
  return function () {
    input.removeEventListener('input', update);
    copy.removeEventListener('click', doCopy);
  };
}

document.querySelectorAll('.field-slug').forEach(initFieldSlug);
