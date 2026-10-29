var loaderFlaskCount = 0;

function initLoaderFlask(root) {
  var clip = root.querySelector('clipPath');
  var group = root.querySelector('g[clip-path]');
  if (!clip || !group) return;
  // The clip id must be unique per copy on the page.
  var id = 'loader-flask-' + ++loaderFlaskCount;
  clip.id = id;
  group.setAttribute('clip-path', 'url(#' + id + ')');
}

document.querySelectorAll('.loader-flask').forEach(initLoaderFlask);
