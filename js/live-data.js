(function () {
  'use strict';

  const DEFAULT = { lat: 39.9042, lon: 116.4074, name: '北京' };
  let coords = { ...DEFAULT };

  const WMO = {
    0: '晴', 1: '大部晴朗', 2: '局部多云', 3: '多云',
    45: '雾', 48: '雾凇',
    51: '小毛毛雨', 53: '毛毛雨', 55: '大毛毛雨',
    61: '小雨', 63: '中雨', 65: '大雨',
    71: '小雪', 73: '中雪', 75: '大雪',
    80: '小阵雨', 81: '阵雨', 82: '大阵雨',
    95: '雷暴', 96: '雷暴伴冰雹', 99: '强雷暴'
  };

  function aqiLabel(aqi) {
    if (aqi == null) return '—';
    if (aqi <= 50) return '优';
    if (aqi <= 100) return '良';
    if (aqi <= 150) return '轻度污染';
    if (aqi <= 200) return '中度污染';
    if (aqi <= 300) return '重度污染';
    return '严重污染';
  }

  function aqiClass(aqi) {
    if (aqi == null) return '';
    if (aqi <= 50) return 'aqi-good';
    if (aqi <= 100) return 'aqi-moderate';
    if (aqi <= 150) return 'aqi-sensitive';
    return 'aqi-bad';
  }

  function $(id) { return document.getElementById(id); }

  function setBody(id, html) {
    const card = $(id);
    if (!card) return;
    const body = card.querySelector('.live-body');
    if (body) {
      body.classList.remove('live-loading');
      body.innerHTML = html;
    }
  }

  function setError(id, msg) {
    setBody(id, `<p class="live-error">${msg}</p>`);
  }

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function reverseGeocode(lat, lon) {
    try {
      const data = await fetchJson(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=zh`
      );
      const label = [data.city || data.locality, data.principalSubdivision, data.countryName]
        .filter(Boolean)
        .join(' · ');
      if (label) return label;
    } catch {
      /* fallback below */
    }
    const latStr = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}`;
    const lonStr = `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;
    return `${latStr}, ${lonStr}`;
  }

  function updateSunFoot() {
    const foot = document.querySelector('#card-sun .live-foot');
    if (foot && coords.name) foot.textContent = `今日 ${coords.name}`;
  }

  async function resolveLocation() {
    const locEl = $('live-location');
    const setLoc = (text) => { if (locEl) locEl.textContent = text; };

    const useCoords = (lat, lon, label, suffix, geocode) => {
      coords = { lat, lon, name: label || '' };
      if (label) {
        setLoc(`当前位置：${label}${suffix}`);
        return;
      }
      setLoc('当前位置：定位中…');
      geocode(lat, lon).then((name) => {
        coords.name = name;
        setLoc(`当前位置：${name}${suffix}`);
        updateSunFoot();
      });
    };

    if (!navigator.geolocation) {
      useCoords(DEFAULT.lat, DEFAULT.lon, DEFAULT.name, '（默认）', reverseGeocode);
      return;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          useCoords(pos.coords.latitude, pos.coords.longitude, '', '', reverseGeocode);
          resolve();
        },
        () => {
          useCoords(DEFAULT.lat, DEFAULT.lon, DEFAULT.name, '（定位未授权，使用默认）', reverseGeocode);
          resolve();
        },
        { timeout: 8000, maximumAge: 300000 }
      );
    });
  }

  async function loadWeatherAndSun() {
    const { lat, lon } = coords;
    const url = [
      'https://api.open-meteo.com/v1/forecast',
      `?latitude=${lat}&longitude=${lon}`,
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
      '&daily=sunrise,sunset,uv_index_max',
      '&timezone=auto&forecast_days=1'
    ].join('');

    try {
      const data = await fetchJson(url);
      const c = data.current;
      const d = data.daily;
      const desc = WMO[c.weather_code] || '未知';
      const temp = Math.round(c.temperature_2m);
      const feels = Math.round(c.apparent_temperature);

      setBody('card-weather', `
        <div class="live-hero">${temp}<span class="live-unit">°C</span></div>
        <p class="live-desc">${desc}</p>
        <dl class="live-stats">
          <div><dt>体感</dt><dd>${feels}°C</dd></div>
          <div><dt>湿度</dt><dd>${c.relative_humidity_2m}%</dd></div>
          <div><dt>风速</dt><dd>${c.wind_speed_10m} km/h</dd></div>
        </dl>
      `);

      const rise = d.sunrise[0]?.slice(11, 16) || '—';
      const set = d.sunset[0]?.slice(11, 16) || '—';
      const uv = d.uv_index_max[0] ?? '—';

      setBody('card-sun', `
        <dl class="live-stats live-stats-block">
          <div><dt>日出</dt><dd>${rise}</dd></div>
          <div><dt>日落</dt><dd>${set}</dd></div>
          <div><dt>UV 指数</dt><dd>${uv}</dd></div>
        </dl>
        <p class="live-foot">今日 ${coords.name}</p>
      `);
    } catch {
      setError('card-weather', '天气数据加载失败');
      setError('card-sun', '日出数据加载失败');
    }
  }

  async function loadAirQuality() {
    const { lat, lon } = coords;
    const url = [
      'https://air-quality-api.open-meteo.com/v1/air-quality',
      `?latitude=${lat}&longitude=${lon}`,
      '&current=pm10,pm2_5,us_aqi,carbon_monoxide',
      '&timezone=auto'
    ].join('');

    try {
      const data = await fetchJson(url);
      const c = data.current;
      const aqi = c.us_aqi != null ? Math.round(c.us_aqi) : null;
      const label = aqiLabel(aqi);
      const cls = aqiClass(aqi);

      setBody('card-air', `
        <div class="live-hero ${cls}">${aqi ?? '—'}<span class="live-unit live-unit-sm">AQI</span></div>
        <p class="live-desc">${label}</p>
        <dl class="live-stats">
          <div><dt>PM2.5</dt><dd>${c.pm2_5?.toFixed(1) ?? '—'} µg/m³</dd></div>
          <div><dt>PM10</dt><dd>${c.pm10?.toFixed(1) ?? '—'} µg/m³</dd></div>
          <div><dt>CO</dt><dd>${c.carbon_monoxide?.toFixed(0) ?? '—'} µg/m³</dd></div>
        </dl>
      `);
    } catch {
      setError('card-air', '空气质量数据加载失败');
    }
  }

  async function loadExchange() {
    try {
      const [usd, eur] = await Promise.all([
        fetchJson('https://api.frankfurter.app/latest?from=USD&to=CNY,JPY,GBP'),
        fetchJson('https://api.frankfurter.app/latest?from=EUR&to=CNY')
      ]);

      setBody('card-exchange', `
        <p class="live-desc">欧洲央行参考汇率 · ${usd.date}</p>
        <dl class="live-stats live-stats-block">
          <div><dt>1 USD</dt><dd>${usd.rates.CNY?.toFixed(4) ?? '—'} CNY</dd></div>
          <div><dt>1 EUR</dt><dd>${eur.rates.CNY?.toFixed(4) ?? '—'} CNY</dd></div>
          <div><dt>1 USD</dt><dd>${usd.rates.JPY?.toFixed(2) ?? '—'} JPY</dd></div>
          <div><dt>1 USD</dt><dd>${usd.rates.GBP?.toFixed(4) ?? '—'} GBP</dd></div>
        </dl>
      `);
    } catch {
      setError('card-exchange', '汇率数据加载失败');
    }
  }

  function loadWorldTime() {
    const zones = [
      { city: '北京', tz: 'Asia/Shanghai' },
      { city: '东京', tz: 'Asia/Tokyo' },
      { city: '伦敦', tz: 'Europe/London' },
      { city: '纽约', tz: 'America/New_York' }
    ];

    const fmt = (tz) => new Intl.DateTimeFormat('zh-CN', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date());

    const rows = zones.map(z =>
      `<div><dt>${z.city}</dt><dd>${fmt(z.tz)}</dd></div>`
    ).join('');

    setBody('card-time', `
      <dl class="live-stats live-stats-block">${rows}</dl>
      <p class="live-foot">每秒本地刷新</p>
    `);

    setInterval(() => {
      const body = $('card-time')?.querySelector('.live-body');
      if (!body || body.classList.contains('live-loading')) return;
      const dds = body.querySelectorAll('dd');
      zones.forEach((z, i) => {
        if (dds[i]) dds[i].textContent = fmt(z.tz);
      });
    }, 1000);
  }

  async function loadGitHub() {
    try {
      const user = await fetchJson('https://api.github.com/users/abcdzyone');
      const since = new Date(user.created_at).getFullYear();

      setBody('card-github', `
        <p class="live-desc">@${user.login}</p>
        <dl class="live-stats live-stats-block">
          <div><dt>公开仓库</dt><dd>${user.public_repos}</dd></div>
          <div><dt>Followers</dt><dd>${user.followers}</dd></div>
          <div><dt>Following</dt><dd>${user.following}</dd></div>
          <div><dt>始于</dt><dd>${since}</dd></div>
        </dl>
        <a class="live-link" href="${user.html_url}" target="_blank" rel="noopener">查看主页 →</a>
      `);
    } catch {
      setError('card-github', 'GitHub 数据加载失败');
    }
  }

  async function init() {
    if (!$('card-weather')) return;

    loadWorldTime();
    loadExchange();
    loadGitHub();

    await resolveLocation();
    await Promise.all([loadWeatherAndSun(), loadAirQuality()]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
