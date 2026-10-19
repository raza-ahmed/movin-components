function initFieldCount(root) {
  const input = root.querySelector('.field-count__input');
  const bar = root.querySelector('.field-count__bar');
  const count = root.querySelector('.field-count__count');
  const max = Number(root.dataset.max) || input.maxLength;

  function update() {
    const n = input.value.length;
    const pct = n / max;
    bar.style.width = Math.min(pct * 100, 100) + '%';
    count.textContent = `${n}/${max}`;
    root.classList.toggle('field-count--filled', n > 0);
    root.classList.toggle('field-count--near', pct >= 0.8 && pct < 1);
    root.classList.toggle('field-count--full', pct >= 1);
  }

  update();
  input.addEventListener('input', update);
  return () => input.removeEventListener('input', update);
}

document.querySelectorAll('.field-count').forEach(initFieldCount);
