function initBtnElasticPress(root) {
  let timer = 0;
  function press() {
    root.classList.remove('btn-elastic-press--pressing');
    void root.offsetWidth; // restart the wobble even mid-animation
    root.classList.add('btn-elastic-press--pressing');
    clearTimeout(timer);
    timer = setTimeout(() => root.classList.remove('btn-elastic-press--pressing'), 510);
  }
  root.addEventListener('click', press);
  return () => {
    clearTimeout(timer);
    root.removeEventListener('click', press);
  };
}

document.querySelectorAll('.btn-elastic-press').forEach(initBtnElasticPress);
