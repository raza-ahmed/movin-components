function initToggleSegmented(root) {
  const options = root.querySelectorAll('.toggle-segmented__option');
  function select(event) {
    const picked = event.target.closest('.toggle-segmented__option');
    if (!picked) return;
    options.forEach((option) => option.setAttribute('aria-pressed', String(option === picked)));
  }
  root.addEventListener('click', select);
  return () => root.removeEventListener('click', select);
}

document.querySelectorAll('.toggle-segmented').forEach(initToggleSegmented);
