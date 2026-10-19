function initRadioMatrix(root) {
  const GLYPHS = '0123456789ABCDEF\u30a2\u30a4\u30a6\u30a8\u30aa!@#$%^&*';
  const CYCLES = 6;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer = 0;

  // The chosen label decodes left to right: each letter flickers through
  // random glyphs for six ticks before it locks.
  function decode(event) {
    const label = event.target.closest('.radio-matrix__option')?.querySelector('.radio-matrix__label');
    if (!label || reduce.matches) return;
    clearTimeout(timer);
    root.querySelectorAll('.radio-matrix__label').forEach((el) => (el.textContent = el.dataset.text || el.textContent));
    const text = label.dataset.text || label.textContent;
    label.dataset.text = text;
    let step = 0;
    const tick = () => {
      label.textContent = [...text]
        .map((ch, i) => {
          const progress = step - i * CYCLES;
          return progress >= 0 && progress < CYCLES ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : ch;
        })
        .join('');
      if (++step <= text.length * CYCLES) timer = setTimeout(tick, 40);
    };
    tick();
  }

  root.addEventListener('change', decode);
  return () => {
    clearTimeout(timer);
    root.removeEventListener('change', decode);
  };
}

document.querySelectorAll('.radio-matrix').forEach(initRadioMatrix);
