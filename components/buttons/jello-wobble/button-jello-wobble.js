function initBtnJelloWobble(root) {
  function wobble() {
    root.classList.remove('btn-jello-wobble--wobbling');
    void root.offsetWidth; // replay on every hover, even mid-wobble
    root.classList.add('btn-jello-wobble--wobbling');
  }
  root.addEventListener('pointerenter', wobble);
  return () => root.removeEventListener('pointerenter', wobble);
}

document.querySelectorAll('.btn-jello-wobble').forEach(initBtnJelloWobble);
