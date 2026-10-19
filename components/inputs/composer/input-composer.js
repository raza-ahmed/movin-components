function initFieldComposer(root) {
  var input = root.querySelector('.field-composer__input');
  var send = root.querySelector('.field-composer__send');
  var thread = root.querySelector('.field-composer__thread');
  if (!input || !send || !thread) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var spring = 'cubic-bezier(0.3, 1.25, 0.5, 1)';

  // Measure the content at height auto without letting that frame show,
  // then let the height transition spring to it.
  function fit() {
    var was = input.style.height;
    input.style.transition = 'none';
    input.style.height = 'auto';
    var want = input.scrollHeight;
    var max = parseFloat(getComputedStyle(input).maxHeight) || Infinity;
    input.style.height = was;
    void input.offsetHeight;
    input.style.transition = '';
    input.style.height = Math.min(want, max) + 'px';
    root.classList.toggle('field-composer--scroll', want > max);
    send.setAttribute('aria-disabled', String(!input.value.trim()));
  }

  // FLIP the thread: the new message rises out of the box into place while
  // the older ones step up to make room.
  function post() {
    var text = input.value.trim();
    if (!text) return;
    var olds = Array.prototype.slice.call(thread.children, -5);
    var before = olds.map(function (m) {
      return m.getBoundingClientRect().top;
    });
    var from = input.getBoundingClientRect();
    var li = document.createElement('li');
    li.className = 'field-composer__msg field-composer__msg--mine';
    li.textContent = text;
    thread.appendChild(li);
    // Messages scrolled out of sight are not kept.
    while (thread.children.length > 6) thread.removeChild(thread.firstElementChild);
    input.value = '';
    fit();
    if (reduce) return;
    olds.forEach(function (m, i) {
      var dy = before[i] - m.getBoundingClientRect().top;
      if (dy) m.animate([{ transform: 'translateY(' + dy + 'px)' }, { transform: 'none' }], { duration: 380, easing: spring });
    });
    var to = li.getBoundingClientRect();
    li.animate(
      [
        { opacity: 0.3, transform: 'translate(' + (from.left - to.left) + 'px,' + (from.top - to.top) + 'px) scale(0.92)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 460, easing: spring }
    );
  }

  function key(e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      post();
    }
  }

  function click() {
    post();
    input.focus();
  }

  input.addEventListener('input', fit);
  input.addEventListener('keydown', key);
  send.addEventListener('click', click);
  fit();
  return function () {
    input.removeEventListener('input', fit);
    input.removeEventListener('keydown', key);
    send.removeEventListener('click', click);
  };
}

document.querySelectorAll('.field-composer').forEach(initFieldComposer);
