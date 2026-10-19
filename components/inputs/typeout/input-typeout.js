function initFieldTypeout(root) {
  const input = root.querySelector('.field-typeout__input');
  const hint = root.querySelector('.field-typeout__hint');
  const typed = root.querySelector('.field-typeout__typed');
  const full = hint.dataset.text;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  input.placeholder = ' '; // lets the CSS hide the hint once there is text
  let timer = 0;

  function type() {
    clearInterval(timer);
    if (document.activeElement === input || input.value) return;
    if (reduce.matches) {
      typed.textContent = full;
      root.classList.add('field-typeout--typed');
      return;
    }
    let i = 0;
    typed.textContent = '';
    root.classList.remove('field-typeout--typed');
    timer = setInterval(() => {
      typed.textContent = full.slice(0, ++i);
      if (i < full.length) return;
      clearInterval(timer);
      root.classList.add('field-typeout--typed');
    }, 60);
  }

  type();
  input.addEventListener('blur', type);
  return () => {
    clearInterval(timer);
    input.removeEventListener('blur', type);
  };
}

document.querySelectorAll('.field-typeout').forEach(initFieldTypeout);
