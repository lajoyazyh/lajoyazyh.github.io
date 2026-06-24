(function() {
  'use strict';

  var dataUrl = '/data/gallery/photos.json';
  var photos = [];
  var activePlace = null;
  var map = null;
  var markerLayer = null;

  var els = {
    map: document.getElementById('gallery-map'),
    grid: document.getElementById('gallery-grid'),
    status: document.getElementById('gallery-status'),
    clear: document.getElementById('gallery-clear'),
    empty: document.getElementById('gallery-empty'),
    lightbox: document.getElementById('gallery-lightbox'),
    lightboxImage: document.getElementById('gallery-lightbox-image'),
    lightboxTitle: document.getElementById('gallery-lightbox-title'),
    lightboxCaption: document.getElementById('gallery-lightbox-caption'),
    lightboxClose: document.getElementById('gallery-lightbox-close')
  };

  function getLang() {
    try {
      return localStorage.getItem('site-lang-preference') || 'zh';
    } catch (e) {
      return 'zh';
    }
  }

  function t(item, key) {
    var lang = getLang();
    var localizedKey = key + (lang === 'en' ? 'En' : 'Zh');
    return item[localizedKey] || item[key + 'Zh'] || item[key + 'En'] || '';
  }

  function placeKey(item) {
    return item.placeEn || item.placeZh || item.id;
  }

  function filteredPhotos() {
    if (!activePlace) return photos;
    return photos.filter(function(photo) {
      return placeKey(photo) === activePlace;
    });
  }

  function updateStatus(list) {
    var lang = getLang();
    if (!els.status || !els.clear) return;
    if (activePlace) {
      var current = photos.find(function(photo) { return placeKey(photo) === activePlace; });
      var place = current ? t(current, 'place') : activePlace;
      els.status.textContent = lang === 'en'
        ? list.length + ' moments in ' + place
        : place + ' · ' + list.length + ' 个瞬间';
      els.clear.textContent = lang === 'en' ? 'Show all' : '显示全部';
    } else {
      els.status.textContent = lang === 'en'
        ? list.length + ' illustrated moments'
        : list.length + ' 个插画瞬间';
      els.clear.textContent = lang === 'en' ? 'Show all' : '显示全部';
    }
  }

  function renderCards() {
    if (!els.grid) return;
    var list = filteredPhotos();
    els.grid.innerHTML = '';
    updateStatus(list);
    if (els.empty) {
      els.empty.style.display = list.length ? 'none' : 'block';
    }

    list.forEach(function(photo) {
      var card = document.createElement('article');
      card.className = 'gallery-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', t(photo, 'title'));
      card.innerHTML =
        '<img src="' + photo.src + '" alt="' + escapeHtml(t(photo, 'title')) + '" loading="lazy">' +
        '<div class="gallery-card-body">' +
          '<h3 class="gallery-card-title">' + escapeHtml(t(photo, 'title')) + '</h3>' +
          '<div class="gallery-card-meta">' +
            '<span>' + escapeHtml(photo.date || '') + '</span>' +
            '<span>·</span>' +
            '<span>' + escapeHtml(t(photo, 'place')) + '</span>' +
          '</div>' +
          '<p class="gallery-card-caption">' + escapeHtml(t(photo, 'caption')) + '</p>' +
        '</div>';
      card.addEventListener('click', function() { openLightbox(photo); });
      card.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(photo);
        }
      });
      els.grid.appendChild(card);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function openLightbox(photo) {
    if (!els.lightbox) return;
    els.lightboxImage.src = photo.src;
    els.lightboxImage.alt = t(photo, 'title');
    els.lightboxTitle.textContent = t(photo, 'title');
    els.lightboxCaption.textContent = t(photo, 'caption');
    els.lightbox.classList.add('open');
    els.lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!els.lightbox) return;
    els.lightbox.classList.remove('open');
    els.lightbox.setAttribute('aria-hidden', 'true');
    els.lightboxImage.src = '';
  }

  function loadLeaflet(callback) {
    if (window.L) {
      callback();
      return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    var script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  function initMap() {
    if (!els.map || !window.L || !photos.length) return;
    map = L.map('gallery-map', {
      center: [31.8, 118.9],
      zoom: 4,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);

    markerLayer = L.layerGroup().addTo(map);
    renderMarkers();
  }

  function renderMarkers() {
    if (!window.L || !markerLayer) return;
    markerLayer.clearLayers();

    var grouped = {};
    photos.forEach(function(photo) {
      var key = placeKey(photo);
      if (!grouped[key]) {
        grouped[key] = {
          placeKey: key,
          lat: photo.lat,
          lng: photo.lng,
          count: 0,
          sample: photo
        };
      }
      grouped[key].count += 1;
    });

    Object.keys(grouped).forEach(function(key) {
      var group = grouped[key];
      var marker = L.circleMarker([group.lat, group.lng], {
        radius: activePlace === key ? 12 : 8,
        fillColor: activePlace === key ? '#f59e0b' : '#3b82f6',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.86
      });
      marker.bindTooltip(t(group.sample, 'place') + ' · ' + group.count, {
        className: 'gallery-marker-label'
      });
      marker.on('click', function() {
        activePlace = key;
        renderCards();
        renderMarkers();
      });
      markerLayer.addLayer(marker);
    });
  }

  function refreshLanguage() {
    renderCards();
    renderMarkers();
  }

  function bindEvents() {
    if (els.clear) {
      els.clear.addEventListener('click', function() {
        activePlace = null;
        renderCards();
        renderMarkers();
      });
    }
    if (els.lightboxClose) {
      els.lightboxClose.addEventListener('click', closeLightbox);
    }
    if (els.lightbox) {
      els.lightbox.addEventListener('click', function(event) {
        if (event.target === els.lightbox) closeLightbox();
      });
    }
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') closeLightbox();
    });

    var originalShowLang = window.showLang;
    window.showLang = function(lang) {
      if (originalShowLang) originalShowLang(lang);
      setTimeout(refreshLanguage, 30);
    };
  }

  function init() {
    bindEvents();
    fetch(dataUrl)
      .then(function(response) { return response.json(); })
      .then(function(items) {
        photos = Array.isArray(items) ? items : [];
        renderCards();
        loadLeaflet(initMap);
      })
      .catch(function(error) {
        console.warn('Failed to load gallery data', error);
        if (els.status) {
          els.status.textContent = getLang() === 'en'
            ? 'Failed to load gallery.'
            : '相册加载失败。';
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
