function initRadioTypewriter(root) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer = 0;
  let typing = null;

  function retype(event) {
    const text = event.target.closest('.radio-typewriter__option')?.querySelector('.radio-typewriter__text');
    if (!text || reduce.matches) return;
    // Finish any option still typing before starting the next.
    clearInterval(timer);
    if (typing) typing.el.textContent = typing.full;
    typing = { el: text, full: text.dataset.text || text.textContent };
    text.dataset.text = typing.full;
    text.textContent = '';
    root.classList.add('radio-typewriter--typing');
    let i = 0;
    timer = setInterval(() => {
      text.textContent = typing.full.slice(0, ++i);
      if (i < typing.full.length) return;
      clearInterval(timer);
      typing = null;
      root.classList.remove('radio-typewriter--typing');
    }, 50);
  }

  root.addEventListener('change', retype);
  return () => {
    clearInterval(timer);
    if (typing) typing.el.textContent = typing.full;
    root.removeEventListener('change', retype);
  };
}

document.querySelectorAll('.radio-typewriter').forEach(initRadioTypewriter);
