function initBtnTypewriter(root) {
  const text = root.querySelector('.btn-typewriter__text');
  const rest = text.textContent;
  const hover = root.dataset.hoverLabel;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer = 0;

  // Backspace the current label a letter at a time, then type the target.
  function retype(target) {
    clearInterval(timer);
    if (reduce.matches) {
      text.textContent = target;
      return;
    }
    timer = setInterval(() => {
      if (text.textContent.length > 0) {
        text.textContent = text.textContent.slice(0, -1);
        return;
      }
      clearInterval(timer);
      let i = 0;
      timer = setInterval(() => {
        text.textContent = target.slice(0, ++i);
        if (i >= target.length) clearInterval(timer);
      }, 55);
    }, 45);
  }

  const enter = () => retype(hover);
  const leave = () => retype(rest);
  root.addEventListener('pointerenter', enter);
  root.addEventListener('pointerleave', leave);
  return () => {
    clearInterval(timer);
    root.removeEventListener('pointerenter', enter);
    root.removeEventListener('pointerleave', leave);
  };
}

document.querySelectorAll('.btn-typewriter').forEach(initBtnTypewriter);
