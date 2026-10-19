function initToggleCheckbox(root) {
  const box = root.querySelector('.toggle-checkbox__box');
  function toggle() {
    box.setAttribute('aria-checked', String(box.getAttribute('aria-checked') !== 'true'));
  }
  box.addEventListener('click', toggle);
  return () => box.removeEventListener('click', toggle);
}

document.querySelectorAll('.toggle-checkbox').forEach(initToggleCheckbox);
