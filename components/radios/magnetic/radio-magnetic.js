function initRadioMagnetic(root) {
  const pill = root.querySelector('.radio-magnetic__pill');
  function place() {
    const option = root.querySelector('.radio-magnetic__input:checked')?.closest('.radio-magnetic__option');
    pill.style.opacity = option ? '1' : '0';
    if (!option) return;
    pill.style.transform = `translateY(${option.offsetTop}px)`;
    pill.style.height = option.offsetHeight + 'px';
  }
  place();
  requestAnimationFrame(() => root.classList.add('radio-magnetic--ready'));
  root.addEventListener('change', place);
  return () => root.removeEventListener('change', place);
}

document.querySelectorAll('.radio-magnetic').forEach(initRadioMagnetic);
