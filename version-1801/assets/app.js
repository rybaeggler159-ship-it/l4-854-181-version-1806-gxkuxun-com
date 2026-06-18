(function () {
    function toggleMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-site-nav]');
        if (!button || !nav) {
            return;
        }

        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        if (slides.length === 0) {
            return;
        }

        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var next = Number(dot.getAttribute('data-hero-dot')) || 0;
                show(next);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
        scopes.forEach(function (scope) {
            var input = scope.querySelector('[data-filter-input]');
            var count = scope.querySelector('[data-filter-count]');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-filter]'));
            var params = new URLSearchParams(window.location.search);
            var initialQuery = scope.hasAttribute('data-query-from-url') ? params.get('q') : '';

            function applyFilter() {
                var query = normalize(input ? input.value : '');
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute('data-filter'));
                    var matched = !query || haystack.indexOf(query) !== -1;
                    card.classList.toggle('is-hidden', !matched);
                    if (matched) {
                        visible += 1;
                    }
                });
                if (count) {
                    count.textContent = visible + ' 部';
                }
            }

            if (input) {
                if (initialQuery) {
                    input.value = initialQuery;
                }
                input.addEventListener('input', applyFilter);
            }

            Array.prototype.slice.call(scope.querySelectorAll('[data-filter-token]')).forEach(function (button) {
                button.addEventListener('click', function () {
                    if (input) {
                        input.value = button.getAttribute('data-filter-token') || '';
                    }
                    applyFilter();
                });
            });

            applyFilter();
        });
    }

    function setupImageFallbacks() {
        Array.prototype.slice.call(document.querySelectorAll('.movie-poster')).forEach(function (poster) {
            var image = poster.querySelector('img');
            var label = poster.querySelector('.movie-cover-index');
            if (!image) {
                return;
            }

            poster.setAttribute('data-fallback', label ? label.textContent : '封面图');
            image.addEventListener('error', function () {
                poster.classList.add('is-missing');
            }, { once: true });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        toggleMenu();
        setupHero();
        setupFilters();
        setupImageFallbacks();
    });
})();
