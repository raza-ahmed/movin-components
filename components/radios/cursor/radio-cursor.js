function initRadioCursor(root) {
  const pill = root.querySelector('.radio-cursor__pill');
  function place() {
    const option = root.querySelector('.radio-cursor__input:checked')?.closest('.radio-cursor__option');
    pill.style.opacity = option ? '1' : '0';
    if (!option) return;
    pill.style.transform = `translateY(${option.offsetTop}px)`;
    pill.style.height = option.offsetHeight + 'px';
  }
  place();
  requestAnimationFrame(() => root.classList.add('radio-cursor--ready'));
  root.addEventListener('change', place);
  return () => root.removeEventListener('change', place);
}

document.querySelectorAll('.radio-cursor').forEach(initRadioCursor);
