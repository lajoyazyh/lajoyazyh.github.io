(function() {
  // ============ 1. 数据 ============
  // type: home / study / travel
  // cityName 必须与 GeoJSON 中 properties.name 完全一致（DataV：地级市/直辖市/特别行政区）
  // province: 中国大陆省级 adcode；港澳台用 810000/820000/710000；境外用国家代码
  var places = [
    // ===== 家乡 =====
    { type: 'home', lat: 32.39, lng: 119.42, title: '🏠 扬州', titleEn: 'Yangzhou', desc: '家乡。感谢花园小学、树人初中、扬州中学的栽培，感谢我的父母让我出生在这样一座美丽的城市。', cityName: '扬州市', province: '320000' },

    // ===== 求学 =====
    { type: 'study', lat: 32.06, lng: 118.78, title: '🎓 南京', titleEn: 'Nanjing', desc: '南京大学·鼓楼校区·健雄书院 · 2023-2024 \n 选择南京大学一个后来让我反复崩溃后悔或是庆幸欣慰的选择。不过无论如何，感恩南京用它厚重的历史接住了我最无助迷茫的大一岁月', cityName: '南京市', province: '320000' },
    { type: 'study', lat: 31.37, lng: 120.66, title: '🎓 苏州', titleEn: 'Suzhou', desc: '南京大学·苏州校区·智能软件与工程学院 · 2024-2027 \n 虽然是一次身不由己的rebase（不过身边的不少人反而是冲着苏州才报的这个专业组），不过这座城市还是用它的现代与积极尽可能周到地照顾了我。', cityName: '苏州市', province: '320000' },
    { type: 'study', lat: 22.30, lng: 114.26, title: '🎓 香港', titleEn: 'Hong Kong', desc: '香港科技大学(exchange) · 2025秋 \n 到底是祛魅还是对错过的机会的追忆？我也说不上来。非常珍贵的一段交换经历，让我更加全面的了解这个世界的运转方式，也认识到了很多有趣的外国朋友。', cityName: '香港特别行政区', province: '810000', country: 'HK' },

    // ===== 旅行：中国大陆 =====

    // 江苏
    { type: 'travel', lat: 31.49, lng: 120.30, title: '无锡', titleEn: 'Wuxi', desc: '无锡', cityName: '无锡市', province: '320000' },
    { type: 'travel', lat: 31.77, lng: 120.00, title: '常州', titleEn: 'Changzhou', desc: '常州', cityName: '常州市', province: '320000' },
    { type: 'travel', lat: 32.19, lng: 119.45, title: '镇江', titleEn: 'Zhenjiang', desc: '镇江', cityName: '镇江市', province: '320000' },
    { type: 'travel', lat: 33.50, lng: 119.02, title: '淮安', titleEn: "Huai'an", desc: '淮安', cityName: '淮安市', province: '320000' },
    { type: 'travel', lat: 33.35, lng: 120.16, title: '盐城', titleEn: 'Yancheng', desc: '盐城', cityName: '盐城市', province: '320000' },
    { type: 'travel', lat: 32.46, lng: 119.91, title: '泰州', titleEn: 'Taizhou', desc: '泰州', cityName: '泰州市', province: '320000' },
    // 安徽
    { type: 'travel', lat: 31.33, lng: 118.38, title: '芜湖', titleEn: 'Wuhu', desc: '芜湖', cityName: '芜湖市', province: '340000' },
    { type: 'travel', lat: 31.68, lng: 118.51, title: '马鞍山', titleEn: "Ma'anshan", desc: '马鞍山', cityName: '马鞍山市', province: '340000' },
    { type: 'travel', lat: 30.95, lng: 118.76, title: '宣城', titleEn: 'Xuancheng', desc: '宣城', cityName: '宣城市', province: '340000' },
    { type: 'travel', lat: 32.30, lng: 118.31, title: '滁州', titleEn: 'Chuzhou', desc: '滁州', cityName: '滁州市', province: '340000' },
    { type: 'travel', lat: 31.82, lng: 117.23, title: '合肥', titleEn: 'Hefei', desc: '合肥', cityName: '合肥市', province: '340000' },
    { type: 'travel', lat: 29.72, lng: 118.33, title: '黄山', titleEn: 'Huangshan', desc: '黄山', cityName: '黄山市', province: '340000' },
    // 浙江
    { type: 'travel', lat: 30.27, lng: 120.15, title: '杭州', titleEn: 'Hangzhou', desc: '杭州', cityName: '杭州市', province: '330000' },
    { type: 'travel', lat: 29.87, lng: 121.55, title: '宁波', titleEn: 'Ningbo', desc: '宁波', cityName: '宁波市', province: '330000' },
    { type: 'travel', lat: 30.87, lng: 120.10, title: '湖州', titleEn: 'Huzhou', desc: '湖州', cityName: '湖州市', province: '330000' },
    { type: 'travel', lat: 30.00, lng: 120.58, title: '绍兴', titleEn: 'Shaoxing', desc: '绍兴', cityName: '绍兴市', province: '330000' },
    { type: 'travel', lat: 30.77, lng: 120.76, title: '嘉兴', titleEn: 'Jiaxing', desc: '嘉兴', cityName: '嘉兴市', province: '330000' },
    { type: 'travel', lat: 29.95, lng: 122.10, title: '舟山', titleEn: 'Zhoushan', desc: '舟山', cityName: '舟山市', province: '330000' },
    // 直辖市
    { type: 'travel', lat: 39.90, lng: 116.40, title: '北京', titleEn: 'Beijing', desc: '北京', cityName: '北京市', province: '110000' },
    { type: 'travel', lat: 31.23, lng: 121.47, title: '上海', titleEn: 'Shanghai', desc: '上海', cityName: '上海市', province: '310000' },
    // 粤港澳
    { type: 'travel', lat: 23.13, lng: 113.26, title: '广州', titleEn: 'Guangzhou', desc: '广州', cityName: '广州市', province: '440000' },
    { type: 'travel', lat: 22.55, lng: 114.06, title: '深圳', titleEn: 'Shenzhen', desc: '深圳', cityName: '深圳市', province: '440000' },
    { type: 'travel', lat: 22.20, lng: 113.55, title: '澳门', titleEn: 'Macau', desc: '澳门', cityName: '澳门特别行政区', province: '820000', country: 'MO' },
    { type: 'travel', lat: 22.28, lng: 113.58, title: '珠海', titleEn: 'Zhuhai', desc: '珠海', cityName: '珠海市', province: '440000' },
    // 湖北
    { type: 'travel', lat: 30.59, lng: 114.31, title: '武汉', titleEn: 'Wuhan', desc: '武汉', cityName: '武汉市', province: '420000' },
    // 湖南
    { type: 'travel', lat: 29.117, lng: 110.479, title: '张家界', titleEn: 'Zhangjiajie', desc: '张家界', cityName: '张家界市', province: '430000' },
    // 山东
    { type: 'travel', lat: 36.07, lng: 120.38, title: '青岛', titleEn: 'Qingdao', desc: '青岛', cityName: '青岛市', province: '370000' },
    // 辽宁
    { type: 'travel', lat: 38.91, lng: 121.60, title: '大连', titleEn: 'Dalian', desc: '大连', cityName: '大连市', province: '210000' },
    { type: 'travel', lat: 41.80, lng: 123.43, title: '沈阳', titleEn: 'Shenyang', desc: '沈阳', cityName: '沈阳市', province: '210000' },
    { type: 'travel', lat: 41.30, lng: 123.77, title: '本溪', titleEn: 'Benxi', desc: '本溪', cityName: '本溪市', province: '210000' },
    // 吉林
    { type: 'travel', lat: 43.88, lng: 125.32, title: '长春', titleEn: 'Changchun', desc: '长春', cityName: '长春市', province: '220000' },
    { type: 'travel', lat: 42.89, lng: 129.51, title: '延吉', titleEn: 'Yanji', desc: '延吉（延边朝鲜族自治州）', cityName: '延边朝鲜族自治州', province: '220000' },
    // 不确定算不算 { type: 'travel', lat: 41.933, lng: 126.423, title: '白山', titleEn: 'Baishan', desc: '白山。\n 实际上是去的长白山', cityName: '白山市', province: '220000' },
    // 山西
    { type: 'travel', lat: 36.1954, lng: 113.1163, title: '长治', titleEn: 'Changzhi', desc: '长治。\n 实际上去的是下属的武乡，去这个地方也是当时树人初中组织研学活动，关于这个地方具体的记忆点已经完全没有了，只记得在酒店里我们一堆男生互相打闹恶作剧了哈哈哈', cityName: '长治市', province: '140000' },
    // 陕西
    { type: 'travel', lat: 34.26, lng: 108.94, title: '西安', titleEn: "Xi'an", desc: '西安', cityName: '西安市', province: '610000' },
    // 甘肃
    { type: 'travel', lat: 36.06, lng: 103.83, title: '兰州', titleEn: 'Lanzhou', desc: '兰州', cityName: '兰州市', province: '620000' },
    { type: 'travel', lat: 38.93, lng: 100.45, title: '张掖', titleEn: 'Zhangye', desc: '张掖。 \n 如果没机会去the grand canyon， 那就来一趟七彩丹霞吧！', cityName: '张掖市', province: '620000' },
    { type: 'travel', lat: 39.74, lng: 98.49, title: '酒泉', titleEn: 'Jiuquan', desc: '酒泉。 \n 实际去的是敦煌，游玩了鸣沙山月牙泉和莫高窟，确实是惊为天人。 \n 可惜当时莫高窟参观一次只能由向导随机带领看三个洞窟，然后自由观赏主窟，导致我也只看到了冰山一角。希望有机会再去！）', cityName: '酒泉市', province: '620000' },
    { type: 'travel', lat: 39.7721, lng: 98.2888, title: '嘉峪关', titleEn: 'Jiayuguan', desc: '嘉峪关。\n 其实那次很遗憾，明明都到嘉峪关了，但是当天天气原因（可能是沙尘暴？）嘉峪关城楼没开放，然后旅游团说既然不开放我们就不去了，只好远远的看了一眼（实际上雾蒙蒙的也没看清楚），然后就驶向下一站了。', cityName: '嘉峪关市', province: '620000' },
    // 青海
    { type: 'travel', lat: 36.62, lng: 101.78, title: '西宁', titleEn: 'Xining', desc: '西宁', cityName: '西宁市', province: '630000' },
    { type: 'travel', lat: 36.57, lng: 100.49, title: '海南藏族自治州（青海湖）', titleEn: 'Hainan Tibetan Autonomous Prefecture (Qinghai Lake)', desc: '青海湖。 \n "高原蓝宝石"，我国最大的内陆咸水湖。湖水湛蓝，周围草原辽阔，我去的时候油菜花田正好盛放，确实美不胜收。', cityName: '海南藏族自治州', province: '630000' },
    { type: 'travel', lat: 36.72, lng: 99.08, title: '海西蒙古族藏族自治州（茶卡盐湖）', titleEn: 'Haixi Mongol and Tibetan Autonomous Prefecture (Chaka Salt Lake)', desc: '茶卡盐湖。 \n "天空之镜"，站在湖面上，真的能看到自己的倒影映在天地之间。景区非常有特色的就地取材，用粗大的盐粒直接铺路，还有很多盐雕，很有意思。', cityName: '海西蒙古族藏族自治州', province: '630000' },

    // ===== 旅行：韩国 ===== (cityName 与 southkorea-maps GeoJSON 的 properties.name 一致，韩文)
    { type: 'travel', lat: 37.56, lng: 126.98, title: '首尔', titleEn: 'Seoul', desc: '首尔。 \n "Seoul my soul." 彻底颠覆我对这座城市乃至这个国家刻板印象的一座城市，当之无愧的亚洲一线。尤其欣赏他们在各种国家级博物馆中，对于很多历史事件的陈述与反思，真的很有启发意义。', cityName: '서울특별시', country: 'KR' },
    { type: 'travel', lat: 37.46, lng: 126.71, title: '仁川', titleEn: 'Incheon', desc: '仁川 \n 虽然没下来玩，但是从仁川机场下飞机去的首尔，浅浅地仁川登陆了一下。 \n By the way 我必须吐槽一下仁川机场的入境，让所有外国人（不只是中国人）全部排长队，一排边的窗口只开三个，害我们等了一个多小时才入境。', cityName: '인천광역시', country: 'KR' },
    { type: 'travel', lat: 35.17, lng: 129.07, title: '釜山', titleEn: 'Busan', desc: '釜山。 \n "Busan is good!" \n 深邃的海，柔和的阳光，静静的跨过海湾的广安里大桥，人声鼎沸的扎嘎其海鲜市场，还有热情而不急不躁的市民们。一切都是那么的恰到好处。一定会再见的！', cityName: '부산광역시', country: 'KR' },
    // 济州特别自治道包含济州市和西归浦市两个城市
    { type: 'travel', lat: 33.52, lng: 126.53, title: '济州市', titleEn: 'Jeju-si', desc: '济州市。 \n 会永远纪念人生第一次打车被恶意兜圈子绕路,这座岛唯一值得留恋的就是海景了。 \n 其他地方的话...一句话概括就是中国旅游团挤满韩国大农村————谁也别笑谁，素质这一块都半斤八两', cityName: '제주특별자치도', country: 'KR' },
    { type: 'travel', lat: 33.25, lng: 126.56, title: '西归浦市', titleEn: 'Seogwipo-si', desc: '西归浦市', cityName: '제주특별자치도', country: 'KR' }
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
          '<button type="button" data-view="marker" class="fv-btn active" data-zh="📍 标记点" data-en="📍 Markers">📍 标记点</button>' +
          '<button type="button" data-view="region" class="fv-btn" data-zh="🗺️ 区域填色" data-en="🗺️ Regions">🗺️ 区域填色</button>';

        // Update button texts based on language
        function updateButtonTexts() {
          var currentLang = localStorage.getItem('site-lang-preference') || 'zh';
          var buttons = container.querySelectorAll('[data-view]');
          buttons.forEach(function(btn) {
            var zhText = btn.getAttribute('data-zh');
            var enText = btn.getAttribute('data-en');
            if (zhText && enText) {
              btn.textContent = currentLang === 'en' ? enText : zhText;
            }
          });
        }

        // Initialize button texts
        setTimeout(updateButtonTexts, 100);

        // Listen for language changes
        var originalShowLang = window.showLang;
        window.showLang = function(lang) {
          if (originalShowLang) originalShowLang(lang);
          setTimeout(updateButtonTexts, 50);
        };

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
      
      // Display title with English translation if available
      var displayTitle = p.titleEn ? (p.title + ' <span style="color:#999;font-weight:normal;font-size:0.9em;">(' + p.titleEn + ')</span>') : p.title;
      
      marker.bindPopup(
        '<h4 style="color:#333;margin-bottom:5px;">' + displayTitle + '</h4>' +
        '<p style="color:#666;margin:0;">' + p.desc.replace(/\n/g, '<br>') + '</p>'
      );
      layer.addLayer(marker);
    });
  }

  // ============ 6. 区域填色视图 ============
  function buildRegions(layer) {
    var typePriority = { home: 3, study: 2, travel: 1 };
    function pickType(a, b) { return typePriority[a] >= typePriority[b] ? a : b; }

    // cityMap[cityName] = { type, title, desc }
    var cnByProvince = {};
    var krCities = {};

    function upsert(map, key, p) {
      if (map[key]) {
        map[key].type = pickType(map[key].type, p.type);
      } else {
        // 韩国 title 后面附上韩文原名，便于辨认
        var titleText = (p.country === 'KR') ? (p.title + '（' + p.cityName + '）') : p.title;
        map[key] = { type: p.type, title: titleText, titleEn: p.titleEn, desc: p.desc };
      }
    }

    places.forEach(function(p) {
      if (p.country === 'KR') {
        upsert(krCities, p.cityName, p);
      } else if (p.province) {
        if (!cnByProvince[p.province]) cnByProvince[p.province] = {};
        upsert(cnByProvince[p.province], p.cityName, p);
      }
    });

    var directMunicipalities = ['110000', '120000', '310000', '500000', '810000', '820000'];

    Object.keys(cnByProvince).forEach(function(adcode) {
      var cityMap = cnByProvince[adcode];

      if (directMunicipalities.indexOf(adcode) >= 0) {
        var onlyKey = Object.keys(cityMap)[0];
        var entry = cityMap[onlyKey];
        fetch('/data/geojson/' + adcode + '.json')
          .then(function(r) { return r.json(); })
          .then(function(geo) {
            L.geoJSON(geo, {
              style: regionStyle(entry.type),
              onEachFeature: bindRegionPopup(entry)
            }).addTo(layer);
          })
          .catch(function(err) { console.warn('Failed to load region', adcode, err); });
        return;
      }

      fetch('/data/geojson/' + adcode + '_full.json')
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
              bindRegionPopup(cityMap[f.properties.name])(f, l);
            }
          }).addTo(layer);
        })
        .catch(function(err) { console.warn('Failed to load region', adcode, err); });
    });

    if (Object.keys(krCities).length > 0) {
      fetch('/data/geojson/skorea-provinces-2018-geo.json')
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
              bindRegionPopup(krCities[f.properties.name])(f, l);
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

  function bindRegionPopup(entry) {
    return function(feature, layer) {
      // Display title with English translation if available
      var displayTitle = entry.titleEn ? (entry.title + ' <span style="color:#999;font-weight:normal;font-size:0.9em;">(' + entry.titleEn + ')</span>') : entry.title;
      
      layer.bindPopup(
        '<h4 style="color:#333;margin-bottom:5px;">' + displayTitle + '</h4>' +
        '<p style="color:#666;margin:0;">' + entry.desc.replace(/\n/g, '<br>') + '</p>'
      );
      layer.on('mouseover', function() { layer.setStyle({ fillOpacity: 0.8 }); });
      layer.on('mouseout', function() { layer.setStyle({ fillOpacity: 0.55 }); });
    };
  }
})();