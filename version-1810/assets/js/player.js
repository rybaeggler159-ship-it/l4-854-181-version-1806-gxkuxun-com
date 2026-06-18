(function () {
  var shell = document.querySelector('[data-player]');

  if (!shell) {
    return;
  }

  var video = shell.querySelector('video');
  var overlay = shell.querySelector('[data-play]');
  var stream = shell.getAttribute('data-stream');
  var initialized = false;
  var hlsInstance = null;

  function initialize() {
    if (initialized || !video || !stream) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(video);
    } else {
      video.src = stream;
    }

    video.controls = true;
    initialized = true;
  }

  function play() {
    initialize();
    shell.classList.add('is-playing');

    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        shell.classList.remove('is-playing');
      });
    }
  }

  if (overlay) {
    overlay.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!initialized) {
        play();
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
