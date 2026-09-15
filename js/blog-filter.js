(function() {
  'use strict';

  var FILTER_KEYS = ['q', 'location', 'year', 'category'];

  function isBlogIndex() {
    return window.location.pathname.replace(/\/+$/, '/') === '/blog/';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, function(char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[char];
    });
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values.filter(Boolean))).sort(function(a, b) {
      return a.localeCompare(b, 'zh-CN');
    });
  }

  function createOption(value, label) {
    var option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    return option;
  }

  function fillSelect(select, values, placeholder) {
    select.replaceChildren(createOption('', placeholder));
    values.forEach(function(value) {
      select.appendChild(createOption(value, value));
    });
  }

  function decorateStandardCards(posts) {
    var byPath = {};
    posts.forEach(function(post) { byPath[post.path] = post; });

    document.querySelectorAll('.post-list.post .post-card').forEach(function(link) {
      if (link.querySelector('.blog-location-badges')) return;
      var path = new URL(link.href, window.location.origin).pathname;
      var post = byPath[path];
      if (!post || !post.locations.length) return;

      var meta = link.querySelector('.meta');
      if (!meta) return;
      var badges = document.createElement('span');
      badges.className = 'blog-location-badges';
      badges.setAttribute('aria-label', '文章地点');
      post.locations.forEach(function(location) {
        var badge = document.createElement('span');
        badge.className = 'blog-location-tag';
        badge.textContent = location;
        badges.appendChild(badge);
      });
      meta.appendChild(badges);
    });
  }

  function cardHtml(post) {
    var cover = post.cover
      ? '<a class="blog-filter-cover" href="' + escapeHtml(post.path) + '"><img src="' + escapeHtml(post.cover) + '" alt="" loading="lazy" decoding="async"></a>'
      : '';
    var locations = post.locations.map(function(location) {
      return '<button type="button" class="blog-result-location" data-location="' + escapeHtml(location) + '">' + escapeHtml(location) + '</button>';
    }).join('');
    var category = post.categories.length ? '<span>' + escapeHtml(post.categories[0]) + '</span>' : '';

    return '<article class="blog-filter-card' + (cover ? ' has-cover' : '') + '">' +
      cover +
      '<div class="blog-filter-card-body">' +
        '<div class="blog-filter-meta"><time datetime="' + escapeHtml(post.date) + '">' + escapeHtml(post.date) + '</time>' + category + '</div>' +
        '<h2><a href="' + escapeHtml(post.path) + '">' + escapeHtml(post.title) + '</a></h2>' +
        '<p>' + escapeHtml(post.description) + '</p>' +
        (locations ? '<div class="blog-result-locations" aria-label="文章地点">' + locations + '</div>' : '') +
      '</div>' +
    '</article>';
  }

  function initBlogFilter() {
    if (!isBlogIndex()) return;

    var standardList = document.querySelector('.post-list.post');
    if (!standardList || document.querySelector('.blog-filter-panel')) return;

    var panel = document.createElement('section');
    panel.className = 'blog-filter-panel';
    panel.setAttribute('aria-label', '博客筛选');
    panel.innerHTML =
      '<div class="blog-filter-heading">' +
        '<div><strong>查找文章</strong><span>按关键词、地点、时间或分类筛选</span></div>' +
        '<button type="button" class="blog-filter-reset">清除筛选</button>' +
      '</div>' +
      '<form class="blog-filter-controls" role="search">' +
        '<label class="blog-filter-search"><span>关键词</span><input type="search" name="q" placeholder="搜索标题或正文" autocomplete="off"></label>' +
        '<label><span>地点</span><select name="location"><option value="">全部地点</option></select></label>' +
        '<label><span>年份</span><select name="year"><option value="">全部年份</option></select></label>' +
        '<label><span>分类</span><select name="category"><option value="">全部分类</option></select></label>' +
      '</form>' +
      '<p class="blog-filter-status" role="status" aria-live="polite">正在载入文章索引...</p>';

    var results = document.createElement('div');
    results.className = 'blog-filter-results';
    results.hidden = true;
    standardList.parentNode.insertBefore(panel, standardList);
    standardList.parentNode.insertBefore(results, standardList);

    var form = panel.querySelector('form');
    var keywordInput = form.elements.q;
    var locationSelect = form.elements.location;
    var yearSelect = form.elements.year;
    var categorySelect = form.elements.category;
    var status = panel.querySelector('.blog-filter-status');
    var reset = panel.querySelector('.blog-filter-reset');
    var pagination = document.querySelector('.paginator, .pagination, nav[aria-label="pagination"]');
    var posts = [];
    var inputTimer;

    function currentFilters() {
      return {
        q: keywordInput.value.trim(),
        location: locationSelect.value,
        year: yearSelect.value,
        category: categorySelect.value
      };
    }

    function readUrl() {
      var params = new URLSearchParams(window.location.search);
      keywordInput.value = params.get('q') || '';
      locationSelect.value = params.get('location') || '';
      yearSelect.value = params.get('year') || '';
      categorySelect.value = params.get('category') || '';
    }

    function writeUrl(filters) {
      var url = new URL(window.location.href);
      FILTER_KEYS.forEach(function(key) {
        if (filters[key]) url.searchParams.set(key, filters[key]);
        else url.searchParams.delete(key);
      });
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }

    function applyFilters(updateUrl) {
      var filters = currentFilters();
      var hasFilters = FILTER_KEYS.some(function(key) { return Boolean(filters[key]); });
      var query = filters.q.toLocaleLowerCase();
      var filtered = posts.filter(function(post) {
        if (filters.location && post.locations.indexOf(filters.location) === -1) return false;
        if (filters.year && post.year !== filters.year) return false;
        if (filters.category && post.categories.indexOf(filters.category) === -1) return false;
        if (!query) return true;
        var haystack = [post.title, post.description, post.searchText]
          .concat(post.tags, post.locations, post.categories)
          .join(' ')
          .toLocaleLowerCase();
        return haystack.indexOf(query) !== -1;
      });

      if (updateUrl) writeUrl(filters);
      reset.hidden = !hasFilters;
      standardList.hidden = hasFilters;
      if (pagination) pagination.hidden = hasFilters;
      results.hidden = !hasFilters;
      status.textContent = hasFilters ? '找到 ' + filtered.length + ' 篇文章' : '共 ' + posts.length + ' 篇文章';

      if (hasFilters) {
        results.innerHTML = filtered.length
          ? filtered.map(cardHtml).join('')
          : '<div class="blog-filter-empty"><strong>没有找到文章</strong><span>换一个地点、年份或关键词试试。</span></div>';
      }
    }

    form.addEventListener('submit', function(event) { event.preventDefault(); });
    keywordInput.addEventListener('input', function() {
      window.clearTimeout(inputTimer);
      inputTimer = window.setTimeout(function() { applyFilters(true); }, 180);
    });
    [locationSelect, yearSelect, categorySelect].forEach(function(select) {
      select.addEventListener('change', function() { applyFilters(true); });
    });
    reset.addEventListener('click', function() {
      form.reset();
      applyFilters(true);
      keywordInput.focus();
    });
    results.addEventListener('click', function(event) {
      var button = event.target.closest('[data-location]');
      if (!button) return;
      locationSelect.value = button.getAttribute('data-location');
      applyFilters(true);
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    fetch('/data/blog-index.json', { credentials: 'same-origin' })
      .then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function(data) {
        posts = data;
        fillSelect(locationSelect, uniqueSorted(posts.flatMap(function(post) { return post.locations; })), '全部地点');
        fillSelect(yearSelect, uniqueSorted(posts.map(function(post) { return post.year; })).reverse(), '全部年份');
        fillSelect(categorySelect, uniqueSorted(posts.flatMap(function(post) { return post.categories; })), '全部分类');
        readUrl();
        decorateStandardCards(posts);
        applyFilters(false);
      })
      .catch(function(error) {
        status.textContent = '文章筛选暂时无法载入';
        console.warn('Failed to load blog index', error);
      });

    window.addEventListener('popstate', function() {
      readUrl();
      applyFilters(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogFilter);
  } else {
    initBlogFilter();
  }
  document.addEventListener('pjax:complete', initBlogFilter);
})();
