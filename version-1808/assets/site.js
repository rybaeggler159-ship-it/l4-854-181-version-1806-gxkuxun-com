(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const siteNav = document.querySelector('[data-site-nav]');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      siteNav.classList.toggle('is-open');
    });
  }

  const carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
    const prev = carousel.querySelector('[data-hero-prev]');
    const next = carousel.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    const setSlide = function (nextIndex) {
      if (slides.length === 0) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };

    const start = function () {
      timer = window.setInterval(function () {
        setSlide(index + 1);
      }, 5000);
    };

    const restart = function () {
      window.clearInterval(timer);
      start();
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setSlide(Number(dot.dataset.heroDot));
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        setSlide(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        setSlide(index + 1);
        restart();
      });
    }

    start();
  }

  const filterPanel = document.querySelector('[data-filter-panel]');

  if (filterPanel) {
    const keywordInput = filterPanel.querySelector('[data-filter-keyword]');
    const yearSelect = filterPanel.querySelector('[data-filter-year]');
    const typeSelect = filterPanel.querySelector('[data-filter-type]');
    const resetButton = filterPanel.querySelector('[data-filter-reset]');
    const cards = Array.from(document.querySelectorAll('[data-filter-results] .movie-card'));
    const countEl = document.querySelector('[data-result-count]');
    const emptyTip = document.querySelector('[data-empty-tip]');

    const applyFilter = function () {
      const keyword = (keywordInput.value || '').trim().toLowerCase();
      const year = yearSelect.value;
      const type = typeSelect.value;
      let shown = 0;

      cards.forEach(function (card) {
        const haystack = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre,
          card.dataset.tags
        ].join(' ').toLowerCase();
        const matchKeyword = !keyword || haystack.includes(keyword);
        const matchYear = !year || card.dataset.year === year;
        const matchType = !type || card.dataset.type === type;
        const visible = matchKeyword && matchYear && matchType;

        card.hidden = !visible;

        if (visible) {
          shown += 1;
        }
      });

      if (countEl) {
        countEl.textContent = shown + ' 部';
      }

      if (emptyTip) {
        emptyTip.hidden = shown !== 0;
      }
    };

    [keywordInput, yearSelect, typeSelect].forEach(function (control) {
      control.addEventListener('input', applyFilter);
      control.addEventListener('change', applyFilter);
    });

    resetButton.addEventListener('click', function () {
      keywordInput.value = '';
      yearSelect.value = '';
      typeSelect.value = '';
      applyFilter();
    });
  }
})();
