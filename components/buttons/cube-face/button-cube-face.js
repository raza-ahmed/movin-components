function initBtnCubeFace(root) {
  const front = root.querySelector('.btn-cube-face__front');
  let timer = 0;
  function confirm() {
    if (root.classList.contains('btn-cube-face--done')) return;
    root.classList.add('btn-cube-face--done');
    timer = setTimeout(() => root.classList.remove('btn-cube-face--done'), 1800);
  }
  front.addEventListener('click', confirm);
  return () => {
    clearTimeout(timer);
    front.removeEventListener('click', confirm);
  };
}

document.querySelectorAll('.btn-cube-face').forEach(initBtnCubeFace);
