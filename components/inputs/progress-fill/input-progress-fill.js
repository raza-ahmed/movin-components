function initFieldProgressFill(root) {
  const input = root.querySelector('.field-progress-fill__input');
  const bar = root.querySelector('.field-progress-fill__bar');
  const count = root.querySelector('.field-progress-fill__count');
  const done = root.querySelector('.field-progress-fill__done');
  const target = Number(root.dataset.target) || 30;

  function update() {
    const n = input.value.length;
    const pct = Math.min(n / target, 1);
    bar.style.transform = `scaleX(${pct})`;
    count.textContent = `${n} / ${target}`;
    done.hidden = pct < 1;
    root.classList.toggle('field-progress-fill--done', pct >= 1);
  }

  update();
  input.addEventListener('input', update);
  return () => input.removeEventListener('input', update);
}

document.querySelectorAll('.field-progress-fill').forEach(initFieldProgressFill);
