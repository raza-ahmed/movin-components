function initCardCarousel(root) {
  var SW = 212;
  var SLIDES = [
    { title: 'Dunes', note: 'Sand ridges at first light' },
    { title: 'Harbour', note: 'Boats on a still morning' },
    { title: 'Orchard', note: 'Rows of pear trees in May' },
    { title: 'Quarry', note: 'Cut stone and green water' },
  ];
  var track = root.querySelector('.card-carousel__track');
  var prev = root.querySelector('.card-carousel__nav--prev');
  var next = root.querySelector('.card-carousel__nav--next');
  var title = root.querySelector('.card-carousel__title');
  var note = root.querySelector('.card-carousel__note');
  var dots = root.querySelectorAll('.card-carousel__dot');

  // Each dot's width and strength follow the scroll position itself, so they stretch mid-swipe.
  function onScroll() {
    var p = track.scrollLeft / SW;
    var at = Math.round(p);
    dots.forEach(function (dot, i) {
      var k = Math.max(0, 1 - Math.abs(i - p));
      dot.style.width = 6 + 12 * k + 'px';
      dot.style.opacity = 0.3 + 0.7 * k;
    });
    title.textContent = SLIDES[at].title;
    note.textContent = SLIDES[at].note;
    prev.disabled = at === 0;
    next.disabled = at === SLIDES.length - 1;
  }
  function go(d) {
    track.scrollBy({ left: d * SW, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function onPrev() {
    go(-1);
  }
  function onNext() {
    go(1);
  }
  track.addEventListener('scroll', onScroll, { passive: true });
  prev.addEventListener('click', onPrev);
  next.addEventListener('click', onNext);
  return function () {
    track.removeEventListener('scroll', onScroll);
    prev.removeEventListener('click', onPrev);
    next.removeEventListener('click', onNext);
  };
}

document.querySelectorAll('.card-carousel').forEach(initCardCarousel);
