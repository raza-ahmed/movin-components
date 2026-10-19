function initBtnInkStamp(root) {
  let timer = 0;
  function stamp() {
    root.classList.remove('btn-ink-stamp--stamping');
    void root.offsetWidth; // restart the splash even mid-animation
    root.classList.add('btn-ink-stamp--stamping');
    clearTimeout(timer);
    timer = setTimeout(() => root.classList.remove('btn-ink-stamp--stamping'), 700);
  }
  root.addEventListener('click', stamp);
  return () => {
    clearTimeout(timer);
    root.removeEventListener('click', stamp);
  };
}

document.querySelectorAll('.btn-ink-stamp').forEach(initBtnInkStamp);
