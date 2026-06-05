(function() {
  // Load Leaflet CSS
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);

  // Load Leaflet JS
  var script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = function() {
    initMap();
  };
  document.head.appendChild(script);

  function initMap() {
    var map = L.map('footprint-map', {
      center: [33, 112],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);

    var colors = { home: '#e74c3c', study: '#3b82f6', travel: '#10b981' };

    // 家乡
    var home = [
      { lat: 32.39, lng: 119.42, title: '🏠 扬州', desc: '家乡' }
    ];

    // 求学
    var study = [
      { lat: 32.06, lng: 118.78, title: '🎓 南京·鼓楼校区', desc: '南京大学 · 2023-2024' },
      { lat: 31.37, lng: 120.66, title: '🎓 苏州', desc: '南京大学苏州校区 · 2024-2027' },
      { lat: 22.30, lng: 114.26, title: '🎓 香港', desc: '香港科技大学交换 · 2025秋' }
    ];

    // 旅行
    var travel = [
    // 中国
      // 湖北
      { lat: 30.59, lng: 114.31, title: '武汉' },
      // 江苏
      { lat: 31.49, lng: 120.30, title: '无锡' },
      { lat: 31.77, lng: 120.00, title: '常州' },
      { lat: 32.19, lng: 119.45, title: '镇江' },
      { lat: 33.50, lng: 119.02, title: '淮安' },
      { lat: 33.35, lng: 120.16, title: '盐城' },
      { lat: 32.46, lng: 119.91, title: '泰州' },
      // 安徽
      { lat: 31.33, lng: 118.38, title: '芜湖' },
      { lat: 31.68, lng: 118.51, title: '马鞍山' },
      { lat: 30.95, lng: 118.76, title: '宣城' },
      { lat: 32.30, lng: 118.31, title: '滁州' },
      { lat: 31.82, lng: 117.23, title: '合肥' },
      { lat: 29.72, lng: 118.33, title: '黄山' },
      // 浙江
      { lat: 30.27, lng: 120.15, title: '杭州' },
      { lat: 29.87, lng: 121.55, title: '宁波' },
      { lat: 30.87, lng: 120.10, title: '湖州' },
      { lat: 30.00, lng: 120.58, title: '绍兴' },
      { lat: 30.77, lng: 120.76, title: '嘉兴' },
      { lat: 29.95, lng: 122.10, title: '舟山' },
      // 直辖市
      { lat: 39.90, lng: 116.40, title: '北京' },
      { lat: 31.23, lng: 121.47, title: '上海' },
      // 粤港澳
      { lat: 23.13, lng: 113.26, title: '广州' },
      { lat: 22.55, lng: 114.06, title: '深圳' },
      { lat: 22.20, lng: 113.55, title: '澳门' },
      { lat: 22.28, lng: 113.58, title: '珠海' },
      // 山东
      { lat: 36.07, lng: 120.38, title: '青岛' },
      // 辽宁
      { lat: 38.91, lng: 121.60, title: '大连' },
      { lat: 41.80, lng: 123.43, title: '沈阳' },
      { lat: 41.30, lng: 123.77, title: '本溪' },
      // 吉林
      { lat: 43.88, lng: 125.32, title: '长春' },
      { lat: 42.89, lng: 129.51, title: '延吉' },
      // 山西
      { lat: 37.87, lng: 112.55, title: '太原' },
      // 陕西
      { lat: 34.26, lng: 108.94, title: '西安' },
      // 甘肃
      { lat: 36.06, lng: 103.83, title: '兰州' },
      { lat: 38.93, lng: 100.45, title: '张掖' },
      { lat: 40.14, lng: 94.66, title: '敦煌' },
      // 青海
      { lat: 36.62, lng: 101.78, title: '西宁' },
    //韩国
      { lat: 37.56, lng: 126.98, title: '首尔' },
      { lat: 35.17, lng: 129.07, title: '釜山' },
      { lat: 33.47, lng: 126.53, title: '济州岛' }
    ];

    // 添加家乡标记
    home.forEach(function(p) {
      L.circleMarker([p.lat, p.lng], {
        radius: 12, fillColor: colors.home, color: '#fff',
        weight: 2, opacity: 1, fillOpacity: 0.85
      }).addTo(map).bindPopup('<h4>' + p.title + '</h4><p>' + p.desc + '</p>');
    });

    // 添加求学标记
    study.forEach(function(p) {
      L.circleMarker([p.lat, p.lng], {
        radius: 12, fillColor: colors.study, color: '#fff',
        weight: 2, opacity: 1, fillOpacity: 0.85
      }).addTo(map).bindPopup('<h4>' + p.title + '</h4><p>' + p.desc + '</p>');
    });

    // 添加旅行标记（小圆点）
    travel.forEach(function(p) {
      L.circleMarker([p.lat, p.lng], {
        radius: 7, fillColor: colors.travel, color: '#fff',
        weight: 1.5, opacity: 1, fillOpacity: 0.75
      }).addTo(map).bindPopup('<h4>' + p.title + '</h4>');
    });
  }
})();