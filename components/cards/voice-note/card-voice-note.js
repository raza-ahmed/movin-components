function initCardVoiceNote(root) {
  var play = root.querySelector('.card-voice-note__play');
  var waveEl = root.querySelector('.card-voice-note__wave');
  var bars = root.querySelectorAll('.card-voice-note__bar');
  var time = root.querySelector('.card-voice-note__time');
  if (!play || !waveEl || !bars.length || !time) return;
  var LEN = 9; // seconds
  var PLAY = 'M8 5v14l11-7z';
  var PAUSE = 'M7 5h4v14H7zM13 5h4v14h-4z';
  var icon = play.querySelector('path');
  var playing = false;
  var pos = 0; // 0-1
  var raf = 0;
  var last = 0;

  function render() {
    bars.forEach(function (b, i) { b.toggleAttribute('data-on', i / bars.length < pos); });
    var secs = Math.floor((playing || pos > 0 ? pos : 1) * LEN);
    time.textContent = '0:' + String(secs).padStart(2, '0');
    play.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    icon.setAttribute('d', playing ? PAUSE : PLAY);
  }
  function tick(now) {
    pos += (now - last) / 1000 / LEN;
    last = now;
    if (pos >= 1) {
      pos = 0;
      playing = false;
      render();
      return;
    }
    render();
    raf = requestAnimationFrame(tick);
  }
  function toggle() {
    playing = !playing;
    cancelAnimationFrame(raf);
    if (playing) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
    render();
  }
  // Click the waveform to seek.
  function seek(e) {
    var r = waveEl.getBoundingClientRect();
    pos = Math.min(0.999, Math.max(0, (e.clientX - r.left) / r.width));
    render();
  }
  play.addEventListener('click', toggle);
  waveEl.addEventListener('click', seek);
  return function () {
    cancelAnimationFrame(raf);
    play.removeEventListener('click', toggle);
    waveEl.removeEventListener('click', seek);
  };
}

document.querySelectorAll('.card-voice-note').forEach(initCardVoiceNote);
