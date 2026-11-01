function initCardHighlight(root) {
  var raf = 0;
  // Sweep once the card is mostly in view; hovering sweeps again.
  var io = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) root.classList.add('card-highlight--on');
    },
    { threshold: 0.6 },
  );
  io.observe(root);
  function replay() {
    root.classList.remove('card-highlight--on');
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      raf = requestAnimationFrame(function () {
        root.classList.add('card-highlight--on');
      });
    });
  }
  root.addEventListener('pointerenter', replay);
  return function () {
    io.disconnect();
    cancelAnimationFrame(raf);
    root.removeEventListener('pointerenter', replay);
  };
}

document.querySelectorAll('.card-highlight').forEach(initCardHighlight);
