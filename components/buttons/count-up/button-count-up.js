function initBtnCountUp(root) {
  const count = root.querySelector('.btn-count-up__count');
  function increment() {
    count.textContent = String(Number(count.textContent) + 1);
    count.classList.remove('btn-count-up__count--pop');
    void count.offsetWidth; // restart the pop even mid-animation
    count.classList.add('btn-count-up__count--pop');
  }
  root.addEventListener('click', increment);
  return () => root.removeEventListener('click', increment);
}

document.querySelectorAll('.btn-count-up').forEach(initBtnCountUp);
