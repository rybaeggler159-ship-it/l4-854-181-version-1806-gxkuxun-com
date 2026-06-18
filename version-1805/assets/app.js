(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  function setupNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function setupHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) return;
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    if (slides.length <= 1) return;
    var index = 0;
    var timer;

    function show(next) {
      slides[index].classList.remove('active');
      if (dots[index]) dots[index].classList.remove('active');
      index = (next + slides.length) % slides.length;
      slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(dotIndex);
        start();
      });
    });

    start();
  }

  function setupFilters() {
    var bars = Array.prototype.slice.call(document.querySelectorAll('.filter-bar'));
    bars.forEach(function (bar) {
      var scopeSelector = bar.getAttribute('data-filter-scope');
      var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
      if (!scope) return;
      var input = bar.querySelector('.filter-input');
      var selects = Array.prototype.slice.call(bar.querySelectorAll('.filter-select'));
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

      function normalize(value) {
        return String(value || '').trim().toLowerCase();
      }

      function apply() {
        var query = normalize(input ? input.value : '');
        var selected = selects.map(function (select) {
          return {
            key: select.getAttribute('data-filter'),
            value: normalize(select.value)
          };
        });

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-year'),
            card.getAttribute('data-type'),
            card.getAttribute('data-tags')
          ].join(' '));
          var matchesQuery = !query || haystack.indexOf(query) !== -1;
          var matchesSelects = selected.every(function (item) {
            if (!item.value) return true;
            var raw = normalize(card.getAttribute('data-' + item.key));
            return raw.indexOf(item.value) !== -1;
          });
          card.classList.toggle('is-hidden', !(matchesQuery && matchesSelects));
        });
      }

      if (input) input.addEventListener('input', apply);
      selects.forEach(function (select) {
        select.addEventListener('change', apply);
      });
    });
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('.video-player'));
    players.forEach(function (video) {
      var src = video.getAttribute('data-video');
      var shell = video.closest('.player-shell');
      var overlay = shell ? shell.querySelector('.player-overlay') : null;
      var hlsInstance = null;

      if (src) {
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls();
          hlsInstance.loadSource(src);
          hlsInstance.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else {
          video.src = src;
        }
      }

      function playVideo() {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }

      if (overlay) {
        overlay.addEventListener('click', playVideo);
      }

      video.addEventListener('play', function () {
        if (shell) shell.classList.add('is-playing');
      });

      video.addEventListener('pause', function () {
        if (shell) shell.classList.remove('is-playing');
      });

      video.addEventListener('ended', function () {
        if (shell) shell.classList.remove('is-playing');
      });

      window.addEventListener('beforeunload', function () {
        if (hlsInstance) hlsInstance.destroy();
      });
    });
  }

  function setupLikes() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.like-btn'));
    buttons.forEach(function (button) {
      var key = button.getAttribute('data-like-key');
      if (!key) return;
      if (localStorage.getItem(key) === '1') {
        button.classList.add('active');
      }
      button.addEventListener('click', function () {
        var active = button.classList.toggle('active');
        localStorage.setItem(key, active ? '1' : '0');
      });
    });
  }

  ready(function () {
    setupNav();
    setupHero();
    setupFilters();
    setupPlayers();
    setupLikes();
  });
})();
