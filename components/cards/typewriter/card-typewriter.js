function initCardTypewriter(root) {
  const title = root.querySelector('.card-typewriter__title > span');
  const text = root.querySelector('.card-typewriter__text');
  const rest = { title: title.textContent, text: text.textContent };
  const hover = { title: root.dataset.hoverTitle, text: root.dataset.hoverText };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;

  // Erase el's text a letter at a time, then type target, then call done.
  function retype(el, target, done) {
    if (el.textContent.length > 0) {
      el.textContent = el.textContent.slice(0, -1);
      timer = setTimeout(() => retype(el, target, done), 30);
      return;
    }
    let i = 0;
    const type = () => {
      el.textContent = target.slice(0, ++i);
      if (i < target.length) timer = setTimeout(type, 40);
      else done();
    };
    timer = setTimeout(type, 80);
  }

  function show(next) {
    clearTimeout(timer);
    if (reduce.matches) {
      title.textContent = next.title;
      text.textContent = next.text;
      return;
    }
    root.classList.add('card-typewriter--typing');
    retype(title, next.title, () =>
      retype(text, next.text, () => root.classList.remove('card-typewriter--typing')),
    );
  }

  const enter = () => show(hover);
  const leave = () => show(rest);
  root.addEventListener('pointerenter', enter);
  root.addEventListener('pointerleave', leave);
  return () => {
    clearTimeout(timer);
    root.removeEventListener('pointerenter', enter);
    root.removeEventListener('pointerleave', leave);
  };
}

document.querySelectorAll('.card-typewriter').forEach(initCardTypewriter);
