function initRadioFrost(root) {
  const pill = root.querySelector('.radio-frost__pill');
  function place() {
    const option = root.querySelector('.radio-frost__input:checked')?.closest('.radio-frost__option');
    pill.style.opacity = option ? '1' : '0';
    if (!option) return;
    pill.style.transform = `translateY(${option.offsetTop}px)`;
    pill.style.height = option.offsetHeight + 'px';
  }
  place();
  requestAnimationFrame(() => root.classList.add('radio-frost--ready'));
  root.addEventListener('change', place);
  return () => root.removeEventListener('change', place);
}

document.querySelectorAll('.radio-frost').forEach(initRadioFrost);
