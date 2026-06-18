(function () {
  const input = document.querySelector('[data-search-input]');
  const form = document.querySelector('[data-search-form]');
  const results = document.querySelector('[data-search-results]');
  const meta = document.querySelector('[data-search-meta]');
  const movies = window.SITE_MOVIES || [];

  if (!input || !results || !meta) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  input.value = initialQuery;

  const normalize = function (value) {
    return String(value || '').trim().toLowerCase();
  };

  const render = function (query) {
    const keyword = normalize(query);

    if (!keyword) {
      results.innerHTML = '';
      meta.textContent = '请输入关键词开始搜索。';
      return;
    }

    const matched = movies.filter(function (movie) {
      const haystack = [
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.tags.join(' '),
        movie.oneLine
      ].join(' ').toLowerCase();

      return haystack.includes(keyword);
    }).slice(0, 120);

    meta.textContent = '找到 ' + matched.length + ' 条结果，最多显示 120 条。';

    results.innerHTML = matched.map(function (movie) {
      return [
        '<article class="movie-card">',
        '  <a class="card-cover" href="' + movie.url + '">',
        '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '    <span class="badge">' + escapeHtml(movie.type) + '</span>',
        '    <span class="play-icon" aria-hidden="true"></span>',
        '  </a>',
        '  <div class="card-body">',
        '    <a class="card-title" href="' + movie.url + '">' + escapeHtml(movie.title) + '</a>',
        '    <p class="card-desc">' + escapeHtml(movie.oneLine) + '</p>',
        '    <div class="card-meta">',
        '      <span>' + movie.year + '年</span>',
        '      <span>' + escapeHtml(movie.region) + '</span>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  };

  const escapeHtml = function (value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  };

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const query = input.value.trim();
      const url = new URL(window.location.href);

      if (query) {
        url.searchParams.set('q', query);
      } else {
        url.searchParams.delete('q');
      }

      history.replaceState(null, '', url.toString());
      render(query);
    });
  }

  input.addEventListener('input', function () {
    render(input.value);
  });

  render(initialQuery);
})();
