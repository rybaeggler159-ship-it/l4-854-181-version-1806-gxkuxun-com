(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobile = document.querySelector('.mobile-nav');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (slides.length > 1) {
      start();
    }
  }

  var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-site-search]'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.filter-chip'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .rank-row'));
  var filterValue = '';

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilter() {
    var query = normalize(inputs.map(function (input) { return input.value; }).find(Boolean) || '');
    cards.forEach(function (card) {
      var text = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-type'),
        card.getAttribute('data-keywords')
      ].join(' '));
      var passQuery = !query || text.indexOf(query) !== -1;
      var passChip = !filterValue || text.indexOf(normalize(filterValue)) !== -1;
      card.classList.toggle('is-hidden', !(passQuery && passChip));
    });
  }

  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      inputs.forEach(function (other) {
        if (other !== input) {
          other.value = input.value;
        }
      });
      applyFilter();
    });
  });

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (item) { item.classList.remove('active'); });
      chip.classList.add('active');
      filterValue = chip.getAttribute('data-filter-value') || '';
      applyFilter();
    });
  });
})();
