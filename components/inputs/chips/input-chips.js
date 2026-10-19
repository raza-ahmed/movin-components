function initFieldChips(root) {
  var box = root.querySelector('.field-chips__box');
  var list = root.querySelector('.field-chips__list');
  var input = root.querySelector('.field-chips__input');
  var status = root.querySelector('.field-chips__status');
  if (!box || !list || !input) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var spring = 'cubic-bezier(0.3, 1.3, 0.5, 1)';

  function chips() {
    return Array.prototype.slice.call(list.children);
  }

  function textOf(li) {
    return li.querySelector('.field-chips__text').textContent;
  }

  function say(msg) {
    if (status) status.textContent = msg;
  }

  // FLIP: measure every chip and the input, change the DOM, then slide each
  // one from where it was, so the row reflows smoothly instead of jumping.
  function flip(change) {
    var els = chips().concat(input);
    var before = new Map();
    els.forEach(function (el) {
      before.set(el, el.getBoundingClientRect());
    });
    change();
    if (reduce) return;
    els.forEach(function (el) {
      var a = before.get(el);
      if (!el.isConnected || !a) return;
      var b = el.getBoundingClientRect();
      var dx = a.left - b.left;
      var dy = a.top - b.top;
      if (dx || dy) el.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 320, easing: spring });
    });
  }

  function make(text) {
    var li = document.createElement('li');
    li.className = 'field-chips__chip';
    var t = document.createElement('span');
    t.className = 'field-chips__text';
    t.textContent = text;
    var b = document.createElement('button');
    b.className = 'field-chips__remove';
    b.type = 'button';
    b.setAttribute('aria-label', 'Remove ' + text);
    b.innerHTML = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 3.5l5 5m0-5-5 5" /></svg>';
    li.append(t, b);
    return li;
  }

  function nudge(li) {
    li.classList.remove('field-chips__chip--nudge');
    void li.offsetWidth;
    li.classList.add('field-chips__chip--nudge');
  }

  // The typed words become a chip where they stood; the input moves along.
  function add(raw) {
    var text = raw.trim().replace(/\s+/g, ' ');
    if (!text) return;
    var same = chips().filter(function (li) {
      return textOf(li).toLowerCase() === text.toLowerCase();
    })[0];
    if (same) {
      nudge(same);
      say(text + ' is already added');
      return;
    }
    var li = make(text);
    flip(function () {
      list.appendChild(li);
    });
    if (!reduce) {
      li.animate(
        [
          { opacity: 0.4, transform: 'scale(0.7)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 360, easing: spring }
      );
    }
    say('Added ' + text);
  }

  function remove(li, back) {
    if (li.dataset.leaving) return;
    li.dataset.leaving = '1';
    var text = textOf(li);
    var go = function () {
      flip(function () {
        li.remove();
        if (back) input.value = text;
      });
      say('Removed ' + text);
    };
    if (reduce) return go();
    li.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: back ? 'translateX(12px) scale(0.85)' : 'scale(0.6)' }], {
      duration: 150,
      easing: 'ease-in',
    }).onfinish = go;
  }

  function key(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(input.value);
      input.value = '';
    } else if (e.key === 'Backspace' && !input.value && input.selectionStart === 0) {
      var last = chips().pop();
      if (last) {
        e.preventDefault();
        remove(last, true);
      }
    }
  }

  // A pasted "a, b, c" becomes three chips; whatever follows the last comma stays typed.
  function typed() {
    if (input.value.indexOf(',') === -1) return;
    var parts = input.value.split(',');
    input.value = parts.pop();
    parts.forEach(add);
  }

  function click(e) {
    var x = e.target.closest('.field-chips__remove');
    if (x) {
      remove(x.closest('.field-chips__chip'), false);
      input.focus();
    } else if (e.target === box) {
      input.focus();
    }
  }

  box.addEventListener('click', click);
  input.addEventListener('keydown', key);
  input.addEventListener('input', typed);
  return function () {
    box.removeEventListener('click', click);
    input.removeEventListener('keydown', key);
    input.removeEventListener('input', typed);
  };
}

document.querySelectorAll('.field-chips').forEach(initFieldChips);
