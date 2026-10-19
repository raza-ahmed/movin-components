function initCbStamp(root) {
  const input = root.querySelector('.cb-stamp__input');
  const touch = () => root.classList.add('cb-stamp--touched');
  input.addEventListener('change', touch);
  return () => input.removeEventListener('change', touch);
}

document.querySelectorAll('.cb-stamp').forEach(initCbStamp);
