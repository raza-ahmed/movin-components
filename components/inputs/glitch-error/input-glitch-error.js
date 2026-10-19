function initFieldGlitchError(root) {
  const input = root.querySelector('.field-glitch-error__input');
  const error = root.querySelector('.field-glitch-error__error');

  function setError(on) {
    input.setAttribute('aria-invalid', String(on));
    error.hidden = !on;
  }

  function submit(event) {
    event.preventDefault();
    const empty = !input.value.trim();
    setError(empty);
    if (!empty) return;
    root.classList.remove('field-glitch-error--glitching');
    void root.offsetWidth; // replay on every empty submit
    root.classList.add('field-glitch-error--glitching');
  }

  const clear = () => setError(false);
  root.addEventListener('submit', submit);
  input.addEventListener('input', clear);
  return () => {
    root.removeEventListener('submit', submit);
    input.removeEventListener('input', clear);
  };
}

document.querySelectorAll('.field-glitch-error').forEach(initFieldGlitchError);
