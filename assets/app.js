(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
      document.body.classList.toggle('is-menu-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var value = input ? input.value.trim() : '';
      var query = value ? '?q=' + encodeURIComponent(value) : '';
      window.location.href = './search.html' + query;
    });
  });

  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide-dot]'));
    var index = 0;

    if (!slides.length) {
      return;
    }

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    showSlide(0);
    window.setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  });

  function applyFilters(scope) {
    var input = scope.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search-item]'));
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-value]'));
    var empty = scope.querySelector('[data-empty-state]');
    var activeValue = '';

    if (!cards.length) {
      return;
    }

    function update() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var visible = 0;

      cards.forEach(function (card) {
        var search = (card.getAttribute('data-search') || '').toLowerCase();
        var matchKeyword = !keyword || search.indexOf(keyword) !== -1;
        var matchFilter = !activeValue || search.indexOf(activeValue.toLowerCase()) !== -1;
        var matched = matchKeyword && matchFilter;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');
      if (query) {
        input.value = query;
      }
      input.addEventListener('input', update);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        activeValue = button.getAttribute('data-filter-value') || '';
        update();
      });
    });

    update();
  }

  document.querySelectorAll('[data-filter-scope]').forEach(applyFilters);
})();

function initializePlayer(source) {
  var video = document.getElementById('main-video');
  var shell = document.querySelector('[data-video-shell]');
  var overlay = document.querySelector('[data-player-overlay]');
  var button = document.querySelector('[data-play-button]');
  var hlsInstance = null;
  var ready = false;

  if (!video || !source) {
    return;
  }

  function loadSource() {
    if (ready) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }

    ready = true;
  }

  function start() {
    loadSource();
    if (shell) {
      shell.classList.add('is-playing');
    }
    if (overlay) {
      overlay.hidden = true;
    }
    var playback = video.play();
    if (playback && typeof playback.catch === 'function') {
      playback.catch(function () {
        if (overlay) {
          overlay.hidden = false;
        }
        if (shell) {
          shell.classList.remove('is-playing');
        }
      });
    }
  }

  if (button) {
    button.addEventListener('click', start);
  }

  if (overlay) {
    overlay.addEventListener('click', start);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });

  video.addEventListener('play', function () {
    if (shell) {
      shell.classList.add('is-playing');
    }
    if (overlay) {
      overlay.hidden = true;
    }
  });

  video.addEventListener('ended', function () {
    if (overlay) {
      overlay.hidden = false;
    }
    if (shell) {
      shell.classList.remove('is-playing');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });

  loadSource();
}
