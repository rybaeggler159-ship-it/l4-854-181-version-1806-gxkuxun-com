(function () {
  var holder = document.querySelector('[data-play]');
  if (!holder) {
    return;
  }

  var video = holder.querySelector('video');
  var overlay = holder.querySelector('.play-overlay');
  var source = holder.getAttribute('data-play');
  var hls = null;
  var ready = false;
  var wanted = false;

  function markStarted() {
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }

  function tryPlay() {
    var attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {});
    }
  }

  function setup() {
    if (ready) {
      return;
    }
    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      if (wanted) {
        tryPlay();
      }
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        if (wanted) {
          tryPlay();
        }
      });
      return;
    }

    video.src = source;
    if (wanted) {
      tryPlay();
    }
  }

  function start() {
    wanted = true;
    markStarted();
    setup();
    if (video.readyState > 0 || video.src) {
      tryPlay();
    }
  }

  if (overlay) {
    overlay.addEventListener('click', start);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });

  video.addEventListener('play', markStarted);
})();
