function initFieldRippleType(root) {
  const input = root.querySelector('.field-ripple-type__input');
  function ripple() {
    root.classList.remove('field-ripple-type--rippling');
    void root.offsetWidth; // restart on every keystroke
    root.classList.add('field-ripple-type--rippling');
  }
  input.addEventListener('input', ripple);
  return () => input.removeEventListener('input', ripple);
}

document.querySelectorAll('.field-ripple-type').forEach(initFieldRippleType);
