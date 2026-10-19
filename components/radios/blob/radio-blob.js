function initRadioBlob(root) {
  const pill = root.querySelector('.radio-blob__pill');
  function place() {
    const option = root.querySelector('.radio-blob__input:checked')?.closest('.radio-blob__option');
    pill.style.opacity = option ? '1' : '0';
    if (!option) return;
    pill.style.transform = `translateY(${option.offsetTop}px)`;
    pill.style.height = option.offsetHeight + 'px';
  }
  place();
  requestAnimationFrame(() => root.classList.add('radio-blob--ready'));
  root.addEventListener('change', place);
  return () => root.removeEventListener('change', place);
}

document.querySelectorAll('.radio-blob').forEach(initRadioBlob);
