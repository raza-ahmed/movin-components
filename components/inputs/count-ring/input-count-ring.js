function initFieldCountRing(root) {
  const input = root.querySelector('.field-count-ring__input');
  const arc = root.querySelector('.field-count-ring__arc');
  const left = root.querySelector('.field-count-ring__left');
  const max = input.maxLength;

  function update() {
    const pct = Math.min(input.value.length / max, 1);
    arc.style.strokeDashoffset = String(1 - pct);
    left.textContent = String(max - input.value.length);
    root.classList.toggle('field-count-ring--near', pct >= 0.85 && pct < 1);
    root.classList.toggle('field-count-ring--full', pct >= 1);
  }

  update();
  input.addEventListener('input', update);
  return () => input.removeEventListener('input', update);
}

document.querySelectorAll('.field-count-ring').forEach(initFieldCountRing);
