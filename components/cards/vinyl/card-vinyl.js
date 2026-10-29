function initCardVinyl(root) {
  var grooves = root.querySelector('.card-vinyl__grooves');
  if (!grooves) return;
  // Spin only while it is out of the sleeve.
  function play() { grooves.style.animationPlayState = 'running'; }
  function stop() { grooves.style.animationPlayState = 'paused'; }
  root.addEventListener('pointerenter', play);
  root.addEventListener('pointerleave', stop);
  root.addEventListener('focus', play);
  root.addEventListener('blur', stop);
  return function () {
    root.removeEventListener('pointerenter', play);
    root.removeEventListener('pointerleave', stop);
    root.removeEventListener('focus', play);
    root.removeEventListener('blur', stop);
  };
}

document.querySelectorAll('.card-vinyl').forEach(initCardVinyl);
