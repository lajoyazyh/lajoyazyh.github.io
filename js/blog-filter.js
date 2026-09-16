(function() {
  'use strict';

  var FILTER_KEYS = ['q', 'location', 'year', 'category'];
  var LOCATION_LEVELS = [
    { key: 'continent', label: '大洲', placeholder: '全部大洲' },
    { key: 'country', label: '国家 / 地区', placeholder: '全部国家 / 地区' },
    { key: 'province', label: '省级地区', placeholder: '全部省级地区' },
    { key: 'city', label: '城市', placeholder: '全部城市' },
    { key: 'district', label: '区县', placeholder: '全部区县' }
  ];

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

  function locationLabel(locationId, locationById) {
    var location = locationById[locationId];
    return location ? location.displayName : locationId;
  }

  function decorateStandardCards(posts, locationById) {
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
      post.locations.forEach(function(locationId) {
        var badge = document.createElement('span');
        badge.className = 'blog-location-tag';
        badge.textContent = locationLabel(locationId, locationById);
        badges.appendChild(badge);
      });
      meta.appendChild(badges);
    });
  }

  function cardHtml(post, locationById) {
    var cover = post.cover
      ? '<a class="blog-filter-cover" href="' + escapeHtml(post.path) + '"><img src="' + escapeHtml(post.cover) + '" alt="" loading="lazy" decoding="async"></a>'
      : '';
    var locations = post.locations.map(function(locationId) {
      return '<button type="button" class="blog-result-location" data-location="' + escapeHtml(locationId) + '">' + escapeHtml(locationLabel(locationId, locationById)) + '</button>';
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

    var locationControls = LOCATION_LEVELS.map(function(level) {
      return '<label><span>' + level.label + '</span><select name="' + level.key + '"><option value="">' + level.placeholder + '</option></select></label>';
    }).join('');

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
        '<label><span>年份</span><select name="year"><option value="">全部年份</option></select></label>' +
        '<label><span>分类</span><select name="category"><option value="">全部分类</option></select></label>' +
        '<fieldset class="blog-location-filter"><legend>地点 <small>父级会包含下属地区</small></legend><div class="blog-location-controls">' + locationControls + '</div></fieldset>' +
      '</form>' +
      '<p class="blog-filter-status" role="status" aria-live="polite">正在载入文章索引...</p>';

    var results = document.createElement('div');
    results.className = 'blog-filter-results';
    results.hidden = true;
    standardList.parentNode.insertBefore(panel, standardList);
    standardList.parentNode.insertBefore(results, standardList);

    var form = panel.querySelector('form');
    var keywordInput = form.elements.q;
    var yearSelect = form.elements.year;
    var categorySelect = form.elements.category;
    var locationSelects = LOCATION_LEVELS.map(function(level) { return form.elements[level.key]; });
    var status = panel.querySelector('.blog-filter-status');
    var reset = panel.querySelector('.blog-filter-reset');
    var pagination = document.querySelector('.paginator, .pagination, nav[aria-label="pagination"]');
    var posts = [];
    var locationNodes = [];
    var locationById = {};
    var inputTimer;

    function deepestSelectedLocation() {
      for (var index = locationSelects.length - 1; index >= 0; index -= 1) {
        if (locationSelects[index].value) return locationSelects[index].value;
      }
      return '';
    }

    function currentFilters() {
      return {
        q: keywordInput.value.trim(),
        location: deepestSelectedLocation(),
        year: yearSelect.value,
        category: categorySelect.value
      };
    }

    function childLocations(parentId, level) {
      return locationNodes.filter(function(node) {
        return node.parentId === parentId && node.level === level;
      }).sort(function(a, b) {
        return a.name.localeCompare(b.name, 'zh-CN');
      });
    }

    function fillLocationLevel(levelIndex, parentId, selectedId) {
      var level = LOCATION_LEVELS[levelIndex];
      var select = locationSelects[levelIndex];
      var nodes = childLocations(parentId, level.key);
      select.replaceChildren(createOption('', level.placeholder));
      nodes.forEach(function(node) {
        select.appendChild(createOption(node.id, node.name));
      });
      select.disabled = nodes.length === 0;
      if (selectedId && nodes.some(function(node) { return node.id === selectedId; })) {
        select.value = selectedId;
      }
    }

    function syncLocationSelects(selectedId) {
      var selected = locationById[selectedId];
      var selectedByLevel = {};
      if (selected) {
        selected.ancestors.concat(selected.id).forEach(function(locationId) {
          var node = locationById[locationId];
          if (node) selectedByLevel[node.level] = node.id;
        });
      }

      var parentId = null;
      LOCATION_LEVELS.forEach(function(level, levelIndex) {
        var value = selectedByLevel[level.key] || '';
        fillLocationLevel(levelIndex, parentId, value);
        parentId = value || '__none__';
      });
    }

    function updateLocationDescendants(changedIndex) {
      var parentId = locationSelects[changedIndex].value || '__none__';
      for (var index = changedIndex + 1; index < LOCATION_LEVELS.length; index += 1) {
        fillLocationLevel(index, parentId, '');
        parentId = '__none__';
      }
    }

    function resolveLocationId(value) {
      if (!value) return '';
      if (locationById[value]) return value;
      var matching = locationNodes.find(function(node) {
        return node.name === value || node.displayName === value;
      });
      return matching ? matching.id : '';
    }

    function readUrl() {
      var params = new URLSearchParams(window.location.search);
      keywordInput.value = params.get('q') || '';
      yearSelect.value = params.get('year') || '';
      categorySelect.value = params.get('category') || '';
      syncLocationSelects(resolveLocationId(params.get('location') || ''));
    }

    function writeUrl(filters) {
      var url = new URL(window.location.href);
      FILTER_KEYS.forEach(function(key) {
        if (filters[key]) url.searchParams.set(key, filters[key]);
        else url.searchParams.delete(key);
      });
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }

    function locationMatches(postLocationId, selectedLocationId) {
      if (postLocationId === selectedLocationId) return true;
      var postLocation = locationById[postLocationId];
      return Boolean(postLocation && postLocation.ancestors.indexOf(selectedLocationId) !== -1);
    }

    function locationSearchTerms(post) {
      var terms = [];
      post.locations.forEach(function(locationId) {
        var node = locationById[locationId];
        if (!node) return;
        node.ancestors.concat(node.id).forEach(function(pathId) {
          var pathNode = locationById[pathId];
          if (pathNode) terms.push(pathNode.name, pathNode.nameEn, pathNode.displayName);
        });
      });
      return terms;
    }

    function applyFilters(updateUrl) {
      var filters = currentFilters();
      var hasFilters = FILTER_KEYS.some(function(key) { return Boolean(filters[key]); });
      var query = filters.q.toLocaleLowerCase();
      var filtered = posts.filter(function(post) {
        if (filters.location && !post.locations.some(function(locationId) {
          return locationMatches(locationId, filters.location);
        })) return false;
        if (filters.year && post.year !== filters.year) return false;
        if (filters.category && post.categories.indexOf(filters.category) === -1) return false;
        if (!query) return true;
        var haystack = [post.title, post.description, post.searchText]
          .concat(post.tags, post.categories, locationSearchTerms(post))
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
          ? filtered.map(function(post) { return cardHtml(post, locationById); }).join('')
          : '<div class="blog-filter-empty"><strong>没有找到文章</strong><span>这个地点暂时没有相关记录，可以继续选择其他条件。</span></div>';
      }
    }

    form.addEventListener('submit', function(event) { event.preventDefault(); });
    keywordInput.addEventListener('input', function() {
      window.clearTimeout(inputTimer);
      inputTimer = window.setTimeout(function() { applyFilters(true); }, 180);
    });
    [yearSelect, categorySelect].forEach(function(select) {
      select.addEventListener('change', function() { applyFilters(true); });
    });
    locationSelects.forEach(function(select, index) {
      select.addEventListener('change', function() {
        updateLocationDescendants(index);
        applyFilters(true);
      });
    });
    reset.addEventListener('click', function() {
      form.reset();
      syncLocationSelects('');
      applyFilters(true);
      keywordInput.focus();
    });
    results.addEventListener('click', function(event) {
      var button = event.target.closest('[data-location]');
      if (!button) return;
      syncLocationSelects(button.getAttribute('data-location'));
      applyFilters(true);
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    fetch('/data/blog-index.json', { credentials: 'same-origin' })
      .then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function(data) {
        if (!data || !Array.isArray(data.posts) || !Array.isArray(data.locationTaxonomy)) {
          throw new Error('Unsupported blog index schema');
        }
        posts = data.posts;
        locationNodes = data.locationTaxonomy;
        locationNodes.forEach(function(node) { locationById[node.id] = node; });
        fillSelect(yearSelect, uniqueSorted(posts.map(function(post) { return post.year; })).reverse(), '全部年份');
        fillSelect(categorySelect, uniqueSorted(posts.flatMap(function(post) { return post.categories; })), '全部分类');
        readUrl();
        decorateStandardCards(posts, locationById);
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
