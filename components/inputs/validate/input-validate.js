function initFieldValidate(root) {
  const input = root.querySelector('.field-validate__input');
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function update() {
    root.classList.remove('field-validate--invalid');
    input.removeAttribute('aria-invalid');
    root.classList.toggle('field-validate--valid', EMAIL.test(input.value));
  }

  function submit(event) {
    event.preventDefault();
    if (EMAIL.test(input.value)) return;
    root.classList.remove('field-validate--valid', 'field-validate--invalid');
    void root.offsetWidth; // shake again on every bad submit
    root.classList.add('field-validate--invalid');
    input.setAttribute('aria-invalid', 'true');
  }

  input.addEventListener('input', update);
  root.addEventListener('submit', submit);
  return () => {
    input.removeEventListener('input', update);
    root.removeEventListener('submit', submit);
  };
}

document.querySelectorAll('.field-validate').forEach(initFieldValidate);
