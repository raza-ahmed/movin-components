function initRadioElastic(root) {
  const pill = root.querySelector('.radio-elastic__pill');
  function place() {
    const option = root.querySelector('.radio-elastic__input:checked')?.closest('.radio-elastic__option');
    pill.style.opacity = option ? '1' : '0';
    if (!option) return;
    pill.style.transform = `translateY(${option.offsetTop}px)`;
    pill.style.height = option.offsetHeight + 'px';
  }
  place();
  requestAnimationFrame(() => root.classList.add('radio-elastic--ready'));
  root.addEventListener('change', place);
  return () => root.removeEventListener('change', place);
}

document.querySelectorAll('.radio-elastic').forEach(initRadioElastic);
