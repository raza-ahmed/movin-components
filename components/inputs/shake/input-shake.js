function initFieldShake(root) {
  const input = root.querySelector('.field-shake__input');
  const error = root.querySelector('.field-shake__error');

  function setError(on) {
    input.setAttribute('aria-invalid', String(on));
    error.hidden = !on;
  }

  function submit(event) {
    event.preventDefault();
    const empty = !input.value.trim();
    setError(empty);
    if (!empty) return;
    root.classList.remove('field-shake--shaking');
    void root.offsetWidth; // shake again on every empty submit
    root.classList.add('field-shake--shaking');
  }

  const clear = () => setError(false);
  root.addEventListener('submit', submit);
  input.addEventListener('input', clear);
  return () => {
    root.removeEventListener('submit', submit);
    input.removeEventListener('input', clear);
  };
}

document.querySelectorAll('.field-shake').forEach(initFieldShake);
