(function() {
  // ============ 1. 数据 ============
  // type: home / study / travel
  // cityName 必须与 GeoJSON 中 properties.name 完全一致（DataV：地级市/直辖市/特别行政区）
  // province: 中国大陆省级 adcode；港澳台用 810000/820000/710000；境外用国家代码
  var places = [
    // ===== 家乡 =====
    { type: 'home', lat: 32.39, lng: 119.42, title: '🏠 扬州', desc: '家乡', cityName: '扬州市', province: '320000' },

    // ===== 求学 =====
    { type: 'study', lat: 32.06, lng: 118.78, title: '🎓 南京', desc: '南京大学·鼓楼校区 · 2023-2024', cityName: '南京市', province: '320000' },
    { type: 'study', lat: 31.37, lng: 120.66, title: '🎓 苏州', desc: '南京大学·苏州校区 · 2024-2027', cityName: '苏州市', province: '320000' },
    { type: 'study', lat: 22.30, lng: 114.26, title: '🎓 香港', desc: '香港科技大学(exchange) · 2025秋', cityName: '香港特别行政区', province: '810000', country: 'HK' },

    // ===== 旅行：中国大陆 =====
    // 湖北
    { type: 'travel', lat: 30.59, lng: 114.31, title: '武汉', desc: '武汉', cityName: '武汉市', province: '420000' },
    // 江苏
    { type: 'travel', lat: 31.49, lng: 120.30, title: '无锡', desc: '无锡', cityName: '无锡市', province: '320000' },
    { type: 'travel', lat: 31.77, lng: 120.00, title: '常州', desc: '常州', cityName: '常州市', province: '320000' },
    { type: 'travel', lat: 32.19, lng: 119.45, title: '镇江', desc: '镇江', cityName: '镇江市', province: '320000' },
    { type: 'travel', lat: 33.50, lng: 119.02, title: '淮安', desc: '淮安', cityName: '淮安市', province: '320000' },
    { type: 'travel', lat: 33.35, lng: 120.16, title: '盐城', desc: '盐城', cityName: '盐城市', province: '320000' },
    { type: 'travel', lat: 32.46, lng: 119.91, title: '泰州', desc: '泰州', cityName: '泰州市', province: '320000' },
    // 安徽
    { type: 'travel', lat: 31.33, lng: 118.38, title: '芜湖', desc: '芜湖', cityName: '芜湖市', province: '340000' },
    { type: 'travel', lat: 31.68, lng: 118.51, title: '马鞍山', desc: '马鞍山', cityName: '马鞍山市', province: '340000' },
    { type: 'travel', lat: 30.95, lng: 118.76, title: '宣城', desc: '宣城', cityName: '宣城市', province: '340000' },
    { type: 'travel', lat: 32.30, lng: 118.31, title: '滁州', desc: '滁州', cityName: '滁州市', province: '340000' },
    { type: 'travel', lat: 31.82, lng: 117.23, title: '合肥', desc: '合肥', cityName: '合肥市', province: '340000' },
    { type: 'travel', lat: 29.72, lng: 118.33, title: '黄山', desc: '黄山', cityName: '黄山市', province: '340000' },
    // 浙江
    { type: 'travel', lat: 30.27, lng: 120.15, title: '杭州', desc: '杭州', cityName: '杭州市', province: '330000' },
    { type: 'travel', lat: 29.87, lng: 121.55, title: '宁波', desc: '宁波', cityName: '宁波市', province: '330000' },
    { type: 'travel', lat: 30.87, lng: 120.10, title: '湖州', desc: '湖州', cityName: '湖州市', province: '330000' },
    { type: 'travel', lat: 30.00, lng: 120.58, title: '绍兴', desc: '绍兴', cityName: '绍兴市', province: '330000' },
    { type: 'travel', lat: 30.77, lng: 120.76, title: '嘉兴', desc: '嘉兴', cityName: '嘉兴市', province: '330000' },
    { type: 'travel', lat: 29.95, lng: 122.10, title: '舟山', desc: '舟山', cityName: '舟山市', province: '330000' },
    // 直辖市
    { type: 'travel', lat: 39.90, lng: 116.40, title: '北京', desc: '北京', cityName: '北京市', province: '110000' },
    { type: 'travel', lat: 31.23, lng: 121.47, title: '上海', desc: '上海', cityName: '上海市', province: '310000' },
    // 粤港澳
    { type: 'travel', lat: 23.13, lng: 113.26, title: '广州', desc: '广州', cityName: '广州市', province: '440000' },
    { type: 'travel', lat: 22.55, lng: 114.06, title: '深圳', desc: '深圳', cityName: '深圳市', province: '440000' },
    { type: 'travel', lat: 22.20, lng: 113.55, title: '澳门', desc: '澳门', cityName: '澳门特别行政区', province: '820000', country: 'MO' },
    { type: 'travel', lat: 22.28, lng: 113.58, title: '珠海', desc: '珠海', cityName: '珠海市', province: '440000' },
    // 山东
    { type: 'travel', lat: 36.07, lng: 120.38, title: '青岛', desc: '青岛', cityName: '青岛市', province: '370000' },
    // 辽宁
    { type: 'travel', lat: 38.91, lng: 121.60, title: '大连', desc: '大连', cityName: '大连市', province: '210000' },
    { type: 'travel', lat: 41.80, lng: 123.43, title: '沈阳', desc: '沈阳', cityName: '沈阳市', province: '210000' },
    { type: 'travel', lat: 41.30, lng: 123.77, title: '本溪', desc: '本溪', cityName: '本溪市', province: '210000' },
    // 吉林
    { type: 'travel', lat: 43.88, lng: 125.32, title: '长春', desc: '长春', cityName: '长春市', province: '220000' },
    { type: 'travel', lat: 42.89, lng: 129.51, title: '延吉', desc: '延吉（延边朝鲜族自治州）', cityName: '延边朝鲜族自治州', province: '220000' },
    // 山西
    { type: 'travel', lat: 37.87, lng: 112.55, title: '太原', desc: '太原', cityName: '太原市', province: '140000' },
    // 陕西
    { type: 'travel', lat: 34.26, lng: 108.94, title: '西安', desc: '西安', cityName: '西安市', province: '610000' },
    // 甘肃
    { type: 'travel', lat: 36.06, lng: 103.83, title: '兰州', desc: '兰州', cityName: '兰州市', province: '620000' },
    { type: 'travel', lat: 38.93, lng: 100.45, title: '张掖', desc: '张掖', cityName: '张掖市', province: '620000' },
    { type: 'travel', lat: 39.74, lng: 98.49, title: '酒泉', desc: '酒泉（实际去的是敦煌，看了鸣沙山月牙泉和莫高窟）', cityName: '酒泉市', province: '620000' },
    // 青海
    { type: 'travel', lat: 36.62, lng: 101.78, title: '西宁', desc: '西宁', cityName: '西宁市', province: '630000' },

    // ===== 旅行：韩国 ===== (cityName 与 southkorea-maps GeoJSON 的 properties.name 一致，韩文)
    { type: 'travel', lat: 37.56, lng: 126.98, title: '首尔', desc: '首尔', cityName: '서울특별시', country: 'KR' },
    { type: 'travel', lat: 35.17, lng: 129.07, title: '釜山', desc: '釜山', cityName: '부산광역시', country: 'KR' },
    { type: 'travel', lat: 33.47, lng: 126.53, title: '济州岛', desc: '济州岛', cityName: '제주특별자치도', country: 'KR' }
  ];

  var colors = { home: '#e74c3c', study: '#3b82f6', travel: '#10b981' };

  // ============ 2. 加载 Leaflet ============
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);

  var script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = initMap;
  document.head.appendChild(script);

  // ============ 3. 主初始化 ============
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

    // 两个图层组，便于一键切换
    var markerLayer = L.layerGroup();
    var regionLayer = L.layerGroup();

    buildMarkers(markerLayer);
    buildRegions(regionLayer);

    // 默认显示标记点视图
    markerLayer.addTo(map);

    // ============ 4. 视图切换按钮控件 ============
    var ViewSwitcher = L.Control.extend({
      options: { position: 'topright' },
      onAdd: function() {
        var container = L.DomUtil.create('div', 'footprint-view-switcher leaflet-bar');
        container.innerHTML =
          '<button type="button" data-view="marker" class="fv-btn active">📍 标记点</button>' +
          '<button type="button" data-view="region" class="fv-btn">🗺️ 区域填色</button>';

        // 阻止地图拖动/缩放干扰
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        container.addEventListener('click', function(e) {
          var btn = e.target.closest('button[data-view]');
          if (!btn) return;
          var view = btn.getAttribute('data-view');
          // 切换按钮高亮
          container.querySelectorAll('.fv-btn').forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          // 切换图层
          if (view === 'marker') {
            map.removeLayer(regionLayer);
            markerLayer.addTo(map);
          } else {
            map.removeLayer(markerLayer);
            regionLayer.addTo(map);
          }
        });
        return container;
      }
    });
    map.addControl(new ViewSwitcher());
  }

  // ============ 5. 标记点视图 ============
  function buildMarkers(layer) {
    places.forEach(function(p) {
      var isBig = (p.type === 'home' || p.type === 'study');
      var marker = L.circleMarker([p.lat, p.lng], {
        radius: isBig ? 12 : 7,
        fillColor: colors[p.type],
        color: '#00000050',
        weight: isBig ? 2 : 1.5,
        opacity: 1,
        fillOpacity: isBig ? 0.85 : 0.75
      });
      marker.bindPopup(
        '<h4 style="color:#333;margin-bottom:5px;">' + p.title + '</h4>' +
        '<p style="color:#666;margin:0;">' + p.desc + '</p>'
      );
      layer.addLayer(marker);
    });
  }

  // ============ 6. 区域填色视图 ============
  function buildRegions(layer) {
    var typePriority = { home: 3, study: 2, travel: 1 };
    function pickType(a, b) { return typePriority[a] >= typePriority[b] ? a : b; }

    // cityMap[cityName] = { type, displayName }
    var cnByProvince = {};
    var krCities = {};

    function upsert(map, key, type, displayName) {
      if (map[key]) {
        map[key].type = pickType(map[key].type, type);
      } else {
        map[key] = { type: type, displayName: displayName };
      }
    }

    places.forEach(function(p) {
      // 弹窗显示用：中文 title 优先；韩国附加韩文原名
      var display = p.title.replace(/^[^\u4e00-\u9fa5a-zA-Z]+/, ''); // 去掉前面的 emoji
      if (p.country === 'KR') {
        upsert(krCities, p.cityName, p.type, display + '（' + p.cityName + '）');
      } else if (p.province) {
        if (!cnByProvince[p.province]) cnByProvince[p.province] = {};
        upsert(cnByProvince[p.province], p.cityName, p.type, p.cityName);
      }
    });

    var directMunicipalities = ['110000', '120000', '310000', '500000', '810000', '820000'];

    Object.keys(cnByProvince).forEach(function(adcode) {
      var cityMap = cnByProvince[adcode];

      if (directMunicipalities.indexOf(adcode) >= 0) {
        var onlyKey = Object.keys(cityMap)[0];
        var entry = cityMap[onlyKey];
        fetch('https://geo.datav.aliyun.com/areas_v3/bound/' + adcode + '.json')
          .then(function(r) { return r.json(); })
          .then(function(geo) {
            L.geoJSON(geo, {
              style: regionStyle(entry.type),
              onEachFeature: bindRegionPopup(entry.displayName, entry.type)
            }).addTo(layer);
          })
          .catch(function(err) { console.warn('Failed to load region', adcode, err); });
        return;
      }

      fetch('https://geo.datav.aliyun.com/areas_v3/bound/' + adcode + '_full.json')
        .then(function(r) { return r.json(); })
        .then(function(geo) {
          var filtered = {
            type: 'FeatureCollection',
            features: geo.features.filter(function(f) {
              return cityMap.hasOwnProperty(f.properties.name);
            })
          };
          L.geoJSON(filtered, {
            style: function(f) { return regionStyle(cityMap[f.properties.name].type); },
            onEachFeature: function(f, l) {
              var e = cityMap[f.properties.name];
              bindRegionPopup(e.displayName, e.type)(f, l);
            }
          }).addTo(layer);
        })
        .catch(function(err) { console.warn('Failed to load region', adcode, err); });
    });

    if (Object.keys(krCities).length > 0) {
      fetch('https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/skorea-provinces-2018-geo.json')
        .then(function(r) { return r.json(); })
        .then(function(geo) {
          var filtered = {
            type: 'FeatureCollection',
            features: geo.features.filter(function(f) {
              return krCities.hasOwnProperty(f.properties.name);
            })
          };
          L.geoJSON(filtered, {
            style: function(f) { return regionStyle(krCities[f.properties.name].type); },
            onEachFeature: function(f, l) {
              var e = krCities[f.properties.name];
              bindRegionPopup(e.displayName, e.type)(f, l);
            }
          }).addTo(layer);
        })
        .catch(function(err) { console.warn('Failed to load Korea regions', err); });
    }
  }

  function regionStyle(type) {
    return {
      fillColor: colors[type],
      weight: 1,
      opacity: 1,
      color: '#ffffff',
      fillOpacity: 0.55
    };
  }

  function bindRegionPopup(name, type) {
    var typeLabel = { home: '🏠 家乡', study: '🎓 求学', travel: '✈️ 旅行' }[type] || '';
    return function(feature, layer) {
      layer.bindPopup(
        '<h4 style="color:#333;margin-bottom:5px;">' + name + '</h4>' +
        '<p style="color:#666;margin:0;">' + typeLabel + '</p>'
      );
      layer.on('mouseover', function() { layer.setStyle({ fillOpacity: 0.8 }); });
      layer.on('mouseout', function() { layer.setStyle({ fillOpacity: 0.55 }); });
    };
  }
})();
