function initTabsTuner(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var needle = root.querySelector('.tabs-tuner__needle');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  // A wash of grey static over the panel while it tunes in.
  var STATIC =
    '<svg class="tabs-tuner__static" aria-hidden="true">' +
    '<filter id="tabs-tuner-noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="4"></feTurbulence>' +
    '<feColorMatrix type="saturate" values="0"></feColorMatrix></filter>' +
    '<rect class="tabs-tuner__noise" x="-40" y="-20" width="400" height="120" filter="url(#tabs-tuner-noise)"></rect></svg>';

  function select(i) {
    if (i === sel) return;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    // The needle sweeps to the station (a CSS transition on left).
    needle.style.left = tabs[i].style.left;
    // Replay the tuning-in on the new panel: off station the words are smeared and jumpy.
    var panel = panels[i];
    var words = panel.firstElementChild;
    words.classList.remove('tabs-tuner__tuned');
    void words.offsetWidth;
    words.classList.add('tabs-tuner__tuned');
    root.querySelectorAll('.tabs-tuner__static').forEach(function (s) { s.remove(); });
    panel.insertAdjacentHTML('beforeend', STATIC);
  }
  function onClick(e) {
    var tab = e.target.closest('[role="tab"]');
    if (tab) select(tabs.indexOf(tab));
  }
  function onKeyDown(e) {
    var n = tabs.length;
    var next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabs[next].focus();
  }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  return function () {
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-tuner').forEach(initTabsTuner);
