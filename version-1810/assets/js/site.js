(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
    startTimer();
  }

  var filterList = document.querySelector('[data-filter-list]');
  var filterInput = document.querySelector('[data-filter-input]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var emptyState = document.querySelector('[data-empty-state]');
  var filterForm = document.querySelector('[data-filter-form]');

  if (filterList && filterInput) {
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('[data-filter-card]'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (initialQuery) {
      filterInput.value = initialQuery;
    }

    function filterCards() {
      var query = filterInput.value.trim().toLowerCase();
      var year = yearFilter ? yearFilter.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var keywords = card.getAttribute('data-keywords') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var matchesQuery = !query || keywords.indexOf(query) !== -1;
        var matchesYear = !year || cardYear === year;
        var show = matchesQuery && matchesYear;
        card.style.display = show ? '' : 'none';

        if (show) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    }

    filterInput.addEventListener('input', filterCards);

    if (yearFilter) {
      yearFilter.addEventListener('change', filterCards);
    }

    if (filterForm) {
      filterForm.addEventListener('submit', function (event) {
        if (filterList) {
          event.preventDefault();
          filterCards();
        }
      });
    }

    filterCards();
  }
})();
