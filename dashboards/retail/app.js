/* «СетьСклад Опт» - retail dashboard renderer. Language and currency come from ../_shared/geo-locale.js (IP country). */
(function () {
  'use strict';
  var D = window.RETAIL_DATA;
  if (!D) return;

  var lang = document.documentElement.lang === 'en' ? 'en' : 'ru';
  D.EN = lang === 'en';
  var T = D.i18n[lang];
  var USD = D.usdRate;

  var savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('retail-dash-theme') || 'dark'; } catch (e) {}

  var state = {
    section: (location.hash || '#clients').replace('#', '') || 'clients',
    period: 1,
    warehouse: 'all',
    channel: 'all',
    currency: lang === 'en' ? 'USD' : 'RUB',
    theme: savedTheme === 'light' ? 'light' : 'dark',
    mapTopN: 25,
    mapOverdueOnly: false,
    mapZoom: 1,
    mapPanX: 0,
    mapPanY: 0,
    clientView: 'table',
    disciplineMetric: 'pct',
    disciplineTab: 'best',
    productSort: 'turnover',
    expandedCats: {},
    abcAxis: 'turnover',
    abcCell: null,
    supplierTab: 'margin',
    selectedSupplier: D.suppliers[0] && D.suppliers[0].id,
    budgetHorizon: 1,
    incomeHorizon: 1,
    salesMetric: 'turnover',
    newClientHorizon: 'm1',
    expandedManager: null,
    productSearch: '',
    selectedClient: null,
    legendOff: {},
    tableFilters: {}
  };

  var SECTIONS = ['clients', 'products', 'suppliers', 'finance', 'logistics', 'sales'];
  if (SECTIONS.indexOf(state.section) < 0) state.section = 'clients';

  var ICONS = {
    clients: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 19c.8-3.2 2.9-5 5.5-5s4.7 1.8 5.5 5M13.5 19c.4-2 1.6-3.4 3.5-3.4 1.5 0 2.6.8 3.2 2.2"/></svg>',
    products: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M12 12V4M4 8l8 4 8-4"/></svg>',
    suppliers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V7l8-3 8 3v12"/><path d="M9 19v-6h6v6M4 11h16"/></svg>',
    finance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19h16M7 16V9M12 16V5M17 16v-4"/><path d="M4 5h3"/></svg>',
    logistics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.7"/><circle cx="17.5" cy="18" r="1.7"/></svg>',
    sales: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V8l8-4 8 4v11"/><path d="M9 19v-5h6v5M8 11h8"/></svg>',
    brand: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 16l3.2-8h2.2L14 16h-2.1l-.6-1.6H7.7L7.1 16H5zm3.2-3.2h2.9L9.7 9.4 8.2 12.8zM16 16V8h4.2c.7 0 2.8.9 2.8 2.3 0 .9-.5 1.6-1.3 2 .9.3 1.5 1.1 1.5 2.1 0 1.5-1.2 2.6-3.1 2.6H16zm2-6.4v1.8h1.8c.7 0 1.1-.3 1.1-.9s-.4-.9-1.1-.9H18zm0 3.4V14h2.1c.8 0 1.2-.4 1.2-1s-.4-1-1.2-1H18z" fill="currentColor"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 14.5A7.5 7.5 0 1 1 9.5 4 6 6 0 0 0 20 14.5z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"/></svg>'
  };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function nf(v, d) { return new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d || 0 }).format(v); }
  function money(v, short) {
    var x = state.currency === 'USD' ? v / USD : v;
    var a = Math.abs(x);
    if (state.currency === 'USD') {
      if (short) { if (a >= 1e6) return '$' + nf(x / 1e6, 2) + 'M'; if (a >= 1e4) return '$' + nf(x / 1e3, 0) + 'K'; }
      return '$' + nf(x);
    }
    if (short) {
      if (a >= 1e6) return nf(x / 1e6, 1) + (lang === 'ru' ? ' млн ₽' : 'M ₽');
      if (a >= 1e4) return nf(x / 1e3, 0) + (lang === 'ru' ? ' тыс. ₽' : 'K ₽');
    }
    return nf(x) + ' ₽';
  }
  function fmtBaseDate() {
    var d = new Date(D.BASE_DATE + 'T12:00:00');
    return lang === 'ru' ? d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).replace(' г.', '') : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function pct(v, d) { return nf(v, d == null ? 1 : d) + '%'; }
  function deltaPct(v) {
    return '<span class="kpi-change' + (v >= 0 ? '' : ' neg') + '">' + (v >= 0 ? '+' : '') + pct(v) + '</span>';
  }

  function applyTheme() {
    var root = document.documentElement;
    root.setAttribute('data-theme', state.theme);
    root.style.colorScheme = state.theme;
    document.body && (document.body.style.background = '');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', state.theme === 'light' ? '#eef0f5' : '#10121c');
    try { localStorage.setItem('retail-dash-theme', state.theme); } catch (e) {}
  }

  function sparkSvg(vals, color) {
    if (!vals || !vals.length) return '';
    var w = 83, h = 29, max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
    var span = max - min || 1;
    var pts = vals.map(function (v, i) {
      var x = (i / Math.max(vals.length - 1, 1)) * (w - 2) + 1;
      var y = h - 2 - ((v - min) / span) * (h - 4);
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    return '<svg class="kpi-spark" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><polyline fill="none" stroke="' + (color || '#72ddbf') + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" points="' + pts + '"/></svg>';
  }

  function donut(segments, centerStrong, centerSpan, key) {
    var off = state.legendOff[key] || {};
    var active = segments.filter(function (s) { return !off[s.id]; });
    var total = active.reduce(function (a, s) { return a + s.value; }, 0) || 1;
    var acc = 0;
    var stops = active.map(function (s) {
      var start = acc / total * 100;
      acc += s.value;
      var end = acc / total * 100;
      return s.color + ' ' + start + '% ' + end + '%';
    }).join(',');
    var bg = active.length ? 'conic-gradient(' + stops + ')' : 'conic-gradient(#333 0 100%)';
    var legend = segments.map(function (s) {
      var isOff = !!off[s.id];
      return '<button type="button" class="legend-button' + (isOff ? ' off' : '') + '" data-legend="' + esc(key) + '" data-seg="' + esc(s.id) + '" aria-pressed="' + (!isOff) + '">' +
        '<span class="legend-dot" style="background:' + s.color + '"></span><span class="legend-name">' + esc(s.name) + '</span>' +
        '<span class="legend-val">' + (s.pct != null ? pct(s.pct, 0) : money(s.value, true)) + '</span></button>';
    }).join('');
    return '<div class="donut-ring" style="background:' + bg + '"><div class="donut-center"><strong>' + centerStrong + '</strong><span>' + esc(centerSpan) + '</span></div></div><div class="legend">' + legend + '</div>';
  }

  function tableBar(id) {
    var f = state.tableFilters[id];
    var label = lang === 'ru' ? 'Сброс' : 'Reset';
    return '<div class="table-toolbar">' +
      (f ? '<span class="filter-chip">' + (lang === 'ru' ? 'Фильтр: ' : 'Filter: ') + esc(f.label || f.value) + '</span>' : '<span class="filter-chip muted">' + (lang === 'ru' ? 'Клик по ячейке - фильтр' : 'Click cell to filter') + '</span>') +
      '<button type="button" class="reset-btn" data-reset-table="' + esc(id) + '"' + (f ? '' : ' disabled') + '>' + label + '</button></div>';
  }

  function matchFilter(rowText, tableId) {
    var f = state.tableFilters[tableId];
    if (!f || !f.value) return true;
    return String(rowText).toLowerCase().indexOf(String(f.value).toLowerCase()) >= 0;
  }

  function filterClients() {
    return D.clients.filter(function (c) {
      if (state.warehouse !== 'all' && c.rcId !== state.warehouse) return false;
      if (state.channel !== 'all' && c.channel !== state.channel) return false;
      return true;
    });
  }

  function kpiCard(name, value, changeHtml, spark) {
    return '<div class="kpi"><div class="kpi-name">' + esc(name) + '</div><div class="kpi-value">' + value + '</div><div class="kpi-bottom">' + changeHtml + (spark || '') + '</div></div>';
  }

  function insightCard(text) {
    return '<div class="glass-card insight-card"><div class="insight-icon">' + ICONS.spark + '</div><h4>' + (lang === 'ru' ? 'Вывод' : 'Insight') + '</h4><p>' + esc(text) + '</p></div>';
  }

  function heading() {
    var s = T.sections[state.section];
    var periods = [1, 3, 6, 12].map(function (p) {
      return '<button type="button" data-period="' + p + '" aria-pressed="' + (state.period === p) + '">' + esc(T.periods[p]) + '</button>';
    }).join('');
    var wh = Object.keys(T.warehouses).map(function (k) {
      return '<option value="' + k + '"' + (state.warehouse === k ? ' selected' : '') + '>' + esc(T.warehouses[k]) + '</option>';
    }).join('');
    var ch = Object.keys(T.channels).map(function (k) {
      return '<option value="' + k + '"' + (state.channel === k ? ' selected' : '') + '>' + esc(T.channels[k]) + '</option>';
    }).join('');
    return '<div class="dashboard-heading"><div><div class="board-eyebrow">' + esc(s.eyebrow) + '</div><h2 class="board-title">' + esc(s.title) + '</h2><p class="board-desc">' + esc(s.desc) + '</p></div>' +
      '<div class="dash-controls"><div class="period-control" role="group" aria-label="Period">' + periods + '</div>' +
      '<div class="select-wrap"><select class="channel-select" data-filter="warehouse" aria-label="Warehouse">' + wh + '</select></div>' +
      '<div class="select-wrap"><select class="channel-select" data-filter="channel" aria-label="Channel">' + ch + '</select></div></div></div>';
  }

  function turnColor(t, maxT) {
    var r = t / (maxT || 1);
    if (r >= 0.66) return '#6e96ff';
    if (r >= 0.33) return '#8f79e5';
    return '#53cbb8';
  }

  /* ---------- CLIENTS ---------- */
  function renderClients() {
    var list = filterClients();
    var scaleF = D.periodScale[state.period];
    var active = list.length;
    var turnover = list.reduce(function (s, c) { return s + c.turnover; }, 0) * scaleF;
    var overdue = list.reduce(function (s, c) {
      var L = D.clientLedger.find(function (x) { return x.clientId === c.id; });
      return s + (L ? L.overdueAmount : 0);
    }, 0);
    var zoneSum = D.zoneDonut.reduce(function (s, z) { return s + z.value; }, 0) || 1;
    var html = heading();
    html += '<div class="kpi-grid kpi-3">' +
      kpiCard(lang === 'ru' ? 'Активные клиенты' : 'Active clients', nf(active), deltaPct(4.2), sparkSvg([170, 172, 175, 178, 180, 183, 186])) +
      kpiCard(lang === 'ru' ? 'Оборот клиентов' : 'Client turnover', money(turnover, true), deltaPct(6.1), sparkSvg([40, 42, 41, 45, 47, 46, 49], '#6e96ff')) +
      kpiCard(lang === 'ru' ? 'Просроченная задолженность' : 'Overdue receivables', money(overdue, true), '<span class="kpi-change neg">+' + money(0.4e6, true) + '</span>', sparkSvg([2.8, 3.0, 3.2, 3.4, 3.5, 3.7, 3.8], '#f3a09c')) +
      '</div>';

    var mapClients = list.slice().sort(function (a, b) { return b.turnover - a.turnover; });
    if (state.mapOverdueOnly) mapClients = mapClients.filter(function (c) { return c.payStatus === 'overdue'; });
    mapClients = mapClients.slice(0, state.mapTopN);
    var rc = D.RC.find(function (r) { return r.id === (state.warehouse === 'all' ? 'msk' : state.warehouse); }) || D.RC[0];

    html += '<div class="analytics-row"><div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Карта точек клиентов' : 'Client outlets map') + '</h3><p class="card-subtitle">' + (lang === 'ru' ? 'Зум · кластеры (маржа + число точек) · подписи без наложений' : 'Zoom · clusters (margin + count) · non-overlapping labels') + '</p></div>' +
      '<div class="dash-controls"><div class="seg-tabs">' +
      [10, 25, 50].map(function (n) { return '<button type="button" data-map-top="' + n + '" aria-pressed="' + (state.mapTopN === n) + '">' + (lang === 'ru' ? 'топ-' : 'top ') + n + '</button>'; }).join('') +
      '</div></div></div>' +
      clientMapSvg(rc, mapClients) +
      '<div class="map-legend"><span><i class="map-dot" style="background:#6e96ff"></i>' + (lang === 'ru' ? 'высокий оборот' : 'high turnover') + '</span>' +
      '<span><i class="map-dot" style="background:#8f79e5"></i>' + (lang === 'ru' ? 'средний' : 'medium') + '</span>' +
      '<span><i class="map-dot" style="background:#53cbb8"></i>' + (lang === 'ru' ? 'низкий' : 'lower') + '</span></div></div>' +
      '<div class="glass-card channel-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Оборот по зонам' : 'Turnover by distance') + '</h3><p class="card-subtitle">' + (lang === 'ru' ? 'Расстояние от склада до точки' : 'Distance from warehouse to outlet') + '</p></div></div>' +
      donut(D.zoneDonut.map(function (z) { return Object.assign({}, z, { value: turnover * z.value / zoneSum }); }), money(turnover, true), lang === 'ru' ? 'оборот' : 'turnover', 'zones');

    if (state.selectedClient) {
      var sc = D.clients.find(function (c) { return c.id === state.selectedClient; });
      var L = D.clientLedger.find(function (x) { return x.clientId === state.selectedClient; });
      if (sc) {
        html += '<div class="side-panel" style="margin-top:12px"><h4>' + esc(sc.name) + '</h4><dl>' +
          '<div><dt>' + (lang === 'ru' ? 'Оборот' : 'Turnover') + '</dt><dd>' + money(sc.turnover * scaleF, true) + '</dd></div>' +
          '<div><dt>' + (lang === 'ru' ? 'Маржа' : 'Margin') + '</dt><dd>' + pct(sc.marginPct) + '</dd></div>' +
          '<div><dt>' + (lang === 'ru' ? 'Долг' : 'Owed') + '</dt><dd>' + money(L ? L.owed : 0, true) + '</dd></div></dl></div>';
      }
    }
    html += '</div></div>';

    var top = list.slice().sort(function (a, b) { return b.turnover - a.turnover; }).slice(0, 10);
    var topSum = top.reduce(function (s, c) { return s + c.turnover; }, 0) || 1;
    var topFiltered = top.filter(function (c) { return matchFilter(c.name + ' ' + c.id, 'clients-top'); });
    html += '<div class="deep-row"><div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Топ клиентов по обороту' : 'Top clients by turnover') + '</h3></div>' +
      '<div class="seg-tabs"><button type="button" data-client-view="table" aria-pressed="' + (state.clientView === 'table') + '">' + (lang === 'ru' ? 'Таблица' : 'Table') + '</button>' +
      '<button type="button" data-client-view="donut" aria-pressed="' + (state.clientView === 'donut') + '">' + (lang === 'ru' ? 'Топ-10, кольцо' : 'Top 10, donut') + '</button></div></div>';
    if (state.clientView === 'donut') {
      var colors = ['#6e96ff', '#8f79e5', '#f0a66c', '#53cbb8', '#f18e75', '#72ddbf', '#a8c0ff', '#ebc26b', '#c39bff', '#7ec8e3'];
      html += donut(top.map(function (c, i) { return { id: c.id, name: c.name, value: c.turnover * scaleF, color: colors[i % colors.length], pct: c.turnover / topSum * 100 }; }), money(topSum * scaleF, true), (lang === 'ru' ? 'топ-10' : 'top 10'), 'topc');
    } else {
      html += tableBar('clients-top') + '<div class="table-wrap"><table class="data" data-table="clients-top"><thead><tr><th>#</th><th>' + (lang === 'ru' ? 'Клиент' : 'Client') + '</th><th class="num">' + (lang === 'ru' ? 'Точек' : 'Outlets') + '</th><th class="num">' + (lang === 'ru' ? 'Оборот' : 'Turnover') + '</th><th class="num">' + (lang === 'ru' ? 'Маржа' : 'Margin') + '</th><th class="num">' + (lang === 'ru' ? 'Доля' : 'Share') + '</th></tr></thead><tbody>' +
        topFiltered.map(function (c, i) {
          var share = c.turnover / topSum * 100;
          return '<tr data-client="' + c.id + '"><td data-filter-val="' + esc(String(i + 1)) + '">' + (i + 1) + '</td><td data-filter-val="' + esc(c.name) + '">' + esc(c.name) + '</td><td class="num" data-filter-val="' + c.points.length + '">' + c.points.length + '</td><td class="num" data-filter-val="' + esc(c.name) + '"><div class="bar-cell"><div class="bar-track"><div class="bar-fill" style="width:' + share + '%"></div></div>' + money(c.turnover * scaleF, true) + '</div></td><td class="num" data-filter-val="' + pct(c.marginPct) + '">' + pct(c.marginPct) + '</td><td class="num" data-filter-val="' + pct(share, 1) + '">' + pct(share, 1) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    html += '</div>';

    var byDisc = list.slice().sort(function (a, b) {
      return state.disciplineMetric === 'pct' ? b.paidOnTimePct - a.paidOnTimePct : a.avgPayDays - b.avgPayDays;
    });
    var discList = state.disciplineTab === 'best' ? byDisc.slice(0, 10) : byDisc.slice().reverse().slice(0, 10);
    discList = discList.filter(function (c) { return matchFilter(c.name, 'clients-disc'); });
    html += '<div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Платёжная дисциплина' : 'Payment discipline') + '</h3></div>' +
      '<div class="dash-controls"><div class="seg-tabs"><button type="button" data-disc-metric="pct" aria-pressed="' + (state.disciplineMetric === 'pct') + '">% ' + (lang === 'ru' ? 'вовремя' : 'on time') + '</button>' +
      '<button type="button" data-disc-metric="days" aria-pressed="' + (state.disciplineMetric === 'days') + '">' + (lang === 'ru' ? 'ср. дней' : 'avg days') + '</button></div>' +
      '<div class="seg-tabs"><button type="button" data-disc-tab="best" aria-pressed="' + (state.disciplineTab === 'best') + '">' + (lang === 'ru' ? 'Лучшие' : 'Best') + '</button>' +
      '<button type="button" data-disc-tab="worst" aria-pressed="' + (state.disciplineTab === 'worst') + '">' + (lang === 'ru' ? 'Худшие' : 'Worst') + '</button></div></div></div>' +
      tableBar('clients-disc') +
      '<div class="table-wrap"><table class="data" data-table="clients-disc"><thead><tr><th>' + (lang === 'ru' ? 'Клиент' : 'Client') + '</th><th class="num">%</th><th class="num">' + (lang === 'ru' ? 'Ср. дней' : 'Avg days') + '</th><th class="num">' + (lang === 'ru' ? 'Просрочено' : 'Overdue') + '</th><th class="num">' + (lang === 'ru' ? 'Отсрочка' : 'Terms') + '</th></tr></thead><tbody>' +
      discList.map(function (c) {
        var L = D.clientLedger.find(function (x) { return x.clientId === c.id; });
        return '<tr data-client="' + c.id + '"><td data-filter-val="' + esc(c.name) + '">' + esc(c.name) + '</td><td class="num" data-filter-val="' + pct(c.paidOnTimePct) + '">' + pct(c.paidOnTimePct) + '</td><td class="num" data-filter-val="' + nf(c.avgPayDays, 1) + '">' + nf(c.avgPayDays, 1) + '</td><td class="num" data-filter-val="' + (L ? L.overdueAmount : 0) + '">' + money(L ? L.overdueAmount : 0, true) + '</td><td class="num" data-filter-val="' + c.paymentTermsDays + '">' + c.paymentTermsDays + '</td></tr>';
      }).join('') + '</tbody></table></div></div></div>';

    var paid = 0, owed = 0, ovd = 0;
    list.forEach(function (c) {
      var L = D.clientLedger.find(function (x) { return x.clientId === c.id; });
      if (!L) return;
      paid += L.paid * scaleF; owed += L.owed; ovd += L.overdueAmount;
    });
    var ledgerRows = list.slice().sort(function (a, b) {
      var La = D.clientLedger.find(function (x) { return x.clientId === a.id; });
      var Lb = D.clientLedger.find(function (x) { return x.clientId === b.id; });
      return (Lb ? Lb.owed : 0) - (La ? La.owed : 0);
    }).slice(0, 15).filter(function (c) { return matchFilter(c.name, 'clients-ar'); });
    html += '<div class="analytics-row"><div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Дебиторка клиентов' : 'Client receivables (AR)') + '</h3><p class="card-subtitle">' + (lang === 'ru' ? 'Сколько заплатили / должны / срок' : 'Paid / owed / due') + '</p></div></div>' +
      tableBar('clients-ar') +
      '<div class="table-wrap"><table class="data" data-table="clients-ar"><thead><tr><th>' + (lang === 'ru' ? 'Клиент' : 'Client') + '</th><th class="num">' + (lang === 'ru' ? 'Заплатили' : 'Paid') + '</th><th class="num">' + (lang === 'ru' ? 'Должны' : 'Owed') + '</th><th class="num">' + (lang === 'ru' ? 'Просрочено' : 'Overdue') + '</th><th>' + (lang === 'ru' ? 'Срок' : 'Due') + '</th></tr></thead><tbody>' +
      ledgerRows.map(function (c) {
        var L = D.clientLedger.find(function (x) { return x.clientId === c.id; }) || {};
        var badge = L.dueInDays < 0 ? '<span class="badge bad">' + (lang === 'ru' ? 'просрочка ' : 'overdue ') + Math.abs(L.dueInDays) + '</span>'
          : (L.dueInDays <= 7 ? '<span class="badge warn">' + (lang === 'ru' ? 'до оплаты ' : 'due ') + L.dueInDays + '</span>' : '<span class="badge ok">' + (lang === 'ru' ? 'до оплаты ' : 'due ') + L.dueInDays + '</span>');
        return '<tr data-client="' + c.id + '"><td data-filter-val="' + esc(c.name) + '">' + esc(c.name) + '</td><td class="num">' + money((L.paid || 0) * scaleF, true) + '</td><td class="num">' + money(L.owed || 0, true) + '</td><td class="num">' + money(L.overdueAmount || 0, true) + '</td><td data-filter-val="' + (L.dueInDays < 0 ? (lang === 'ru' ? 'просрочка' : 'overdue') : (lang === 'ru' ? 'срок' : 'due')) + '">' + badge + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +
      '<div class="glass-card">' + donut([
        { id: 'paid', name: lang === 'ru' ? 'Оплачено в срок' : 'Paid on time', value: paid * 0.82, color: '#53cbb8' },
        { id: 'due', name: lang === 'ru' ? 'К оплате' : 'Due', value: Math.max(owed - ovd, 0), color: '#ebc26b' },
        { id: 'ovd', name: lang === 'ru' ? 'Просрочено' : 'Overdue', value: ovd, color: '#f3a09c' }
      ], money(owed, true), lang === 'ru' ? 'долг сейчас' : 'owed now', 'arclient') + '</div></div>';

    html += insightCard(D.insights.clients);
    return html;
  }

  function projectLatLon(lat, lon, w, h) {
    var x = ((lon - 27) / (55 - 27)) * (w - 40) + 20;
    var y = ((62 - lat) / (62 - 50)) * (h - 40) + 20;
    return { x: Math.max(16, Math.min(w - 16, x)), y: Math.max(16, Math.min(h - 16, y)) };
  }

  function clientMapSvg(rc, clients) {
    var payload = {
      rc: { id: rc.id, name: rc.name, lat: rc.lat, lon: rc.lon },
      zoom: state.mapZoom,
      panX: state.mapPanX,
      panY: state.mapPanY,
      points: clients.map(function (c) {
        var p = c.points[0];
        return {
          id: c.id,
          name: c.name,
          lat: p.lat,
          lon: p.lon,
          turnover: c.turnover,
          marginPct: c.marginPct
        };
      })
    };
    window.__retailMapPayload = payload;
    return '<div class="map-wrap" id="clientMap" data-map="1">' +
      '<img class="map-bg" src="map-bg.png" alt="" aria-hidden="true"/>' +
      '<div class="map-zoom-controls" role="group" aria-label="Zoom">' +
      '<button type="button" class="map-zoom-btn" data-map-zoom="in" title="+">+</button>' +
      '<button type="button" class="map-zoom-btn" data-map-zoom="out" title="-">-</button>' +
      '<button type="button" class="map-zoom-btn" data-map-zoom="reset" title="1x">1x</button>' +
      '</div>' +
      '<div class="map-zoom-hint">' + (lang === 'ru' ? 'колёсико - зум' : 'wheel to zoom') + '</div>' +
      '<svg class="map-svg" viewBox="0 0 640 340" role="img" aria-label="Client map"></svg>' +
      '</div>';
  }

  function clusterPoints(pts, cell) {
    var buckets = {};
    pts.forEach(function (p) {
      var key = Math.floor(p.x / cell) + ':' + Math.floor(p.y / cell);
      if (!buckets[key]) buckets[key] = [];
      buckets[key].push(p);
    });
    return Object.keys(buckets).map(function (k) {
      var arr = buckets[k];
      if (arr.length === 1) return { type: 'point', item: arr[0] };
      var sx = 0, sy = 0, st = 0, sm = 0;
      arr.forEach(function (p) { sx += p.x; sy += p.y; st += p.turnover; sm += p.marginPct * p.turnover; });
      return {
        type: 'cluster',
        x: sx / arr.length,
        y: sy / arr.length,
        count: arr.length,
        turnover: st,
        marginPct: st ? sm / st : 0,
        items: arr
      };
    });
  }

  function labelBoxesCollide(a, b) {
    return !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
  }

  function mountClientMap() {
    var root = document.getElementById('clientMap');
    var svg = root && root.querySelector('.map-svg');
    var data = window.__retailMapPayload;
    if (!root || !svg || !data) return;

    var W = 640, H = 340;
    var zoom = Math.max(0.85, Math.min(4.5, data.zoom || state.mapZoom || 1));
    var panX = data.panX || state.mapPanX || 0;
    var panY = data.panY || state.mapPanY || 0;
    var maxT = Math.max.apply(null, data.points.map(function (p) { return p.turnover; }).concat([1]));
    var rcBase = projectLatLon(data.rc.lat, data.rc.lon, W, H);
    var dragging = false, lastX = 0, lastY = 0;

    function world(pt) {
      return {
        x: (pt.x - W / 2) * zoom + W / 2 + panX,
        y: (pt.y - H / 2) * zoom + H / 2 + panY
      };
    }

    function draw() {
      state.mapZoom = zoom;
      state.mapPanX = panX;
      state.mapPanY = panY;
      var basePts = data.points.map(function (p) {
        var b = projectLatLon(p.lat, p.lon, W, H);
        var w = world(b);
        return {
          id: p.id,
          name: p.name,
          turnover: p.turnover,
          marginPct: p.marginPct,
          bx: b.x, by: b.y,
          x: w.x, y: w.y,
          color: turnColor(p.turnover, maxT),
          r: (5 + (p.turnover / maxT) * 12) * Math.min(1.35, 0.75 + zoom * 0.25)
        };
      });
      var rcW = world(rcBase);
      // cluster threshold: larger cells when zoomed out
      var useClusters = zoom < 1.65;
      var cell = useClusters ? Math.max(36, 92 / zoom) : 0;
      var nodes = useClusters ? clusterPoints(basePts, cell) : basePts.map(function (p) { return { type: 'point', item: p }; });

      var parts = [];
      // arrows only for singles (not clusters) and only if not too many
      nodes.forEach(function (n) {
        if (n.type !== 'point') return;
        var p = n.item;
        if (p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40) return;
        parts.push('<line class="map-link" x1="' + rcW.x + '" y1="' + rcW.y + '" x2="' + p.x + '" y2="' + p.y + '" stroke="' + p.color + '" stroke-opacity=".22" stroke-width="1.1"/>');
      });

      var labelCandidates = [];
      nodes.forEach(function (n) {
        if (n.type === 'cluster') {
          if (n.x < -30 || n.x > W + 30 || n.y < -30 || n.y > H + 30) return;
          var cr = 16 + Math.min(18, n.count * 1.8);
          var mtxt = pct(n.marginPct, 0);
          parts.push('<g class="map-cluster" data-map-cluster="1" data-cx="' + n.x + '" data-cy="' + n.y + '" transform="translate(' + n.x + ',' + n.y + ')" style="cursor:pointer">' +
            '<circle r="' + cr + '" fill="#2a3350" fill-opacity=".92" stroke="#8f79e5" stroke-width="2"/>' +
            '<text class="map-cluster-text" text-anchor="middle" y="-2" font-size="11" font-weight="800">' + mtxt + '</text>' +
            '<text class="map-cluster-text" text-anchor="middle" y="12" font-size="10" font-weight="700">' + n.count + ' ' + (lang === 'ru' ? 'точ.' : 'pts') + '</text>' +
            '<title>' + (lang === 'ru' ? 'Маржа ' : 'Margin ') + mtxt + ' · ' + n.count + (lang === 'ru' ? ' точек · клик для зума' : ' points · click to zoom') + '</title></g>');
        } else {
          var p = n.item;
          if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) return;
          parts.push('<circle class="map-marker" data-client="' + p.id + '" cx="' + p.x + '" cy="' + p.y + '" r="' + p.r.toFixed(1) + '" fill="' + p.color + '" fill-opacity=".92" stroke="#fff" stroke-width="1.2" stroke-opacity=".55"><title>' + esc(p.name) + ' · ' + money(p.turnover, true) + ' · ' + pct(p.marginPct) + '</title></circle>');
          if (zoom >= 1.35) {
            var short = p.name.length > 20 ? p.name.slice(0, 18) + '…' : p.name;
            labelCandidates.push({
              id: p.id,
              name: short,
              sub: money(p.turnover, true),
              x: p.x + p.r + 4,
              y: p.y + 3,
              turnover: p.turnover,
              w: Math.min(150, 7.2 * short.length + 8),
              h: 26
            });
          }
        }
      });

      // collision-aware labels (greedy by turnover)
      labelCandidates.sort(function (a, b) { return b.turnover - a.turnover; });
      var placed = [];
      labelCandidates.forEach(function (lab) {
        var box = { x1: lab.x - 2, y1: lab.y - 10, x2: lab.x + lab.w, y2: lab.y + lab.h };
        // keep on canvas roughly
        if (box.x2 > W - 4) { lab.x = lab.x - lab.w - 18; box = { x1: lab.x - 2, y1: lab.y - 10, x2: lab.x + lab.w, y2: lab.y + lab.h }; }
        if (box.y1 < 4 || box.y2 > H - 4 || box.x1 < 4) return;
        for (var i = 0; i < placed.length; i++) {
          if (labelBoxesCollide(box, placed[i])) return;
        }
        placed.push(box);
        parts.push('<text class="map-label" x="' + lab.x + '" y="' + lab.y + '" font-size="9.5" font-weight="700">' + esc(lab.name) + '</text>');
        parts.push('<text class="map-label map-label-sub" x="' + lab.x + '" y="' + (lab.y + 11) + '" font-size="8.5">' + esc(lab.sub) + '</text>');
      });

      parts.push('<circle cx="' + rcW.x + '" cy="' + rcW.y + '" r="9" fill="#f68c6a" stroke="#fff" stroke-width="2"/>');
      parts.push('<text class="map-label map-rc-label" x="' + (rcW.x + 12) + '" y="' + (rcW.y + 4) + '" font-size="11" font-weight="700">' + esc(data.rc.name) + '</text>');

      // bg transform via CSS on image
      var bg = root.querySelector('.map-bg');
      if (bg) {
        bg.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + zoom + ')';
        bg.style.transformOrigin = '50% 50%';
      }
      svg.innerHTML = parts.join('');
      root.setAttribute('data-zoom', zoom.toFixed(2));
    }

    function zoomAt(factor, cx, cy) {
      var prev = zoom;
      zoom = Math.max(0.85, Math.min(4.5, zoom * factor));
      // zoom toward cursor
      panX = cx - (cx - panX) * (zoom / prev);
      panY = cy - (cy - panY) * (zoom / prev);
      draw();
    }

    root.onwheel = function (e) {
      e.preventDefault();
      var rect = root.getBoundingClientRect();
      var cx = ((e.clientX - rect.left) / rect.width) * W;
      var cy = ((e.clientY - rect.top) / rect.height) * H;
      zoomAt(e.deltaY > 0 ? 0.9 : 1.12, cx, cy);
    };
    root.querySelectorAll('[data-map-zoom]').forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var act = btn.getAttribute('data-map-zoom');
        if (act === 'in') zoomAt(1.2, W / 2, H / 2);
        else if (act === 'out') zoomAt(1 / 1.2, W / 2, H / 2);
        else { zoom = 1; panX = 0; panY = 0; draw(); }
      };
    });
    svg.onpointerdown = function (e) {
      if (e.target.closest('.map-cluster') || e.target.closest('.map-marker')) return;
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      try { svg.setPointerCapture(e.pointerId); } catch (err) {}
    };
    svg.onpointermove = function (e) {
      if (!dragging) return;
      var rect = root.getBoundingClientRect();
      var dx = (e.clientX - lastX) / rect.width * W;
      var dy = (e.clientY - lastY) / rect.height * H;
      panX += dx; panY += dy;
      lastX = e.clientX; lastY = e.clientY;
      draw();
    };
    function endDrag(e) {
      dragging = false;
      try { svg.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    svg.onpointerup = endDrag;
    svg.onpointercancel = endDrag;

    svg.onclick = function (e) {
      var cl = e.target.closest('.map-cluster');
      if (cl) {
        e.preventDefault();
        e.stopPropagation();
        var cx = +cl.getAttribute('data-cx');
        var cy = +cl.getAttribute('data-cy');
        zoomAt(1.55, cx, cy);
        return;
      }
      var mk = e.target.closest('.map-marker');
      if (mk) {
        state.selectedClient = mk.getAttribute('data-client');
        render();
      }
    };

    draw();
  }

  /* ---------- PRODUCTS ---------- */
  function renderProducts() {
    var prods = D.products.slice();
    var scaleF = D.periodScale[state.period];
    var wAvgMargin = prods.reduce(function (s, p) { return s + p.marginPct * p.turnover; }, 0) / (prods.reduce(function (s, p) { return s + p.turnover; }, 0) || 1);
    var skuActive = prods.filter(function (p) { return p.turnover > 0; }).length;
    var surplus = prods.filter(function (p) { return p.stockDays > 60; });
    var deficit = prods.filter(function (p) { return p.stockDays < 7; });
    var surplusVal = surplus.reduce(function (s, p) { return s + Math.round(p.turnover / 30 * p.stockDays * (1 - p.marginPct / 100)); }, 0);
    var deficitLost = deficit.reduce(function (s, p) { return s + Math.round(p.dailySales * Math.max(7 - p.stockDays, 1) * (p.turnover / Math.max(p.dailySales * 30, 1))); }, 0);

    var html = heading();
    html += '<div class="kpi-grid">' +
      kpiCard(lang === 'ru' ? 'Средняя маржа' : 'Avg margin', pct(wAvgMargin), deltaPct(0.6), sparkSvg([21, 21.5, 22, 21.8, 22.2, 22.4], '#72ddbf')) +
      kpiCard(lang === 'ru' ? 'SKU в обороте' : 'Active SKUs', nf(skuActive), deltaPct(2.1), sparkSvg([4500, 4600, 4700, 4750, 4800, 4820], '#6e96ff')) +
      kpiCard(lang === 'ru' ? 'Излишки (стоимость)' : 'Surplus value', money(surplusVal, true), '<span class="kpi-change neg">+8%</span>', sparkSvg([5, 5.2, 5.5, 5.8, 6.0, 6.1], '#f0a66c')) +
      kpiCard(lang === 'ru' ? 'Дефицит (потери)' : 'Deficit (lost)', money(deficitLost, true), '<span class="kpi-change neg">+' + money(0.3e6, true) + '</span>', sparkSvg([1.4, 1.5, 1.6, 1.7, 1.8, 1.9], '#f3a09c')) +
      '</div>';

    var cats = D.categories.map(function (cat) {
      var items = prods.filter(function (p) { return p.categoryId === cat.id; });
      var turn = items.reduce(function (s, p) { return s + p.turnover; }, 0);
      var marg = items.reduce(function (s, p) { return s + p.marginPct * p.turnover; }, 0) / (turn || 1);
      var days = items.reduce(function (s, p) { return s + p.stockDays; }, 0) / (items.length || 1);
      return { cat: cat, items: items, turn: turn, marg: marg, days: days };
    }).sort(function (a, b) {
      if (state.productSort === 'margin') return b.marg - a.marg;
      if (state.productSort === 'days') return b.days - a.days;
      return b.turn - a.turn;
    });
    var catTot = cats.reduce(function (s, c) { return s + c.turn; }, 0) || 1;

    html += '<div class="glass-card" style="margin-bottom:14px"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Категория → товар' : 'Category → SKU') + '</h3></div>' +
      '<div class="seg-tabs"><button type="button" data-psort="turnover" aria-pressed="' + (state.productSort === 'turnover') + '">' + (lang === 'ru' ? 'Оборот' : 'Turnover') + '</button>' +
      '<button type="button" data-psort="margin" aria-pressed="' + (state.productSort === 'margin') + '">' + (lang === 'ru' ? 'Маржа' : 'Margin') + '</button>' +
      '<button type="button" data-psort="days" aria-pressed="' + (state.productSort === 'days') + '">' + (lang === 'ru' ? 'Дни запаса' : 'Stock days') + '</button></div></div>' +
      '<div class="tree-head tree-head-5"><span>' + (lang === 'ru' ? 'Категория / товар' : 'Category / SKU') + '</span><span>' + (lang === 'ru' ? 'Оборот' : 'Turnover') + '</span><span>' + (lang === 'ru' ? 'Маржа' : 'Margin') + '</span><span>' + (lang === 'ru' ? 'Дни' : 'Days') + '</span><span>ABC</span></div><div class="tree">';
    cats.forEach(function (c) {
      var open = !!state.expandedCats[c.cat.id];
      html += '<button type="button" class="tree-row tree-row-5' + (open ? ' open' : '') + '" data-expand-cat="' + c.cat.id + '"><span><span class="tree-toggle">' + (open ? '▾' : '▸') + '</span> ' + esc(lang === 'ru' ? c.cat.name : c.cat.nameEn) + '</span>' +
        '<span>' + money(c.turn * scaleF, true) + '</span><span>' + pct(c.marg) + '</span><span>' + nf(c.days, 0) + '</span><span>' + pct(c.turn / catTot * 100, 1) + '</span></button>';
      if (open) {
        c.items.slice().sort(function (a, b) { return b.turnover - a.turnover; }).forEach(function (p) {
          html += '<button type="button" class="tree-child tree-row-5" data-sku="' + p.id + '"><span>' + esc(p.sku) + ' · ' + esc(p.name) + '</span><span>' + money(p.turnover * scaleF, true) + '</span><span>' + pct(p.marginPct) + '</span><span>' + p.stockDays + ' / ' + nf(p.stockQty) + '</span><span><span class="badge ' + (p.abc === 'A' ? 'ax' : (p.abc === 'C' ? 'cz' : '')) + '">' + p.abc + '</span></span></button>';
        });
      }
    });
    html += '</div></div>';

    var surplusRows = surplus.slice().sort(function (a, b) { return b.stockDays - a.stockDays; }).slice(0, 10).filter(function (p) { return matchFilter(p.name, 'prod-surplus'); });
    var deficitRows = deficit.slice().sort(function (a, b) { return a.stockDays - b.stockDays; }).slice(0, 10).filter(function (p) { return matchFilter(p.name, 'prod-deficit'); });
    html += '<div class="deep-row"><div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Излишки' : 'Surplus') + '</h3></div></div>' +
      tableBar('prod-surplus') +
      '<div class="table-wrap"><table class="data" data-table="prod-surplus"><thead><tr><th>' + (lang === 'ru' ? 'Товар' : 'Product') + '</th><th>' + (lang === 'ru' ? 'Категория' : 'Category') + '</th><th class="num">' + (lang === 'ru' ? 'Остаток, ₽' : 'Stock, $') + '</th><th class="num">' + (lang === 'ru' ? 'Дни' : 'Days') + '</th><th>' + (lang === 'ru' ? 'Рекомендация' : 'Action') + '</th></tr></thead><tbody>' +
      surplusRows.map(function (p) {
        var cat = D.categories.find(function (c) { return c.id === p.categoryId; });
        var val = Math.round(p.turnover / 30 * p.stockDays * (1 - p.marginPct / 100));
        return '<tr><td data-filter-val="' + esc(p.name) + '">' + esc(p.name) + '</td><td data-filter-val="' + esc(cat ? cat.name : '') + '">' + esc(cat ? cat.name : '') + '</td><td class="num">' + money(val, true) + '</td><td class="num" data-filter-val="' + p.stockDays + '">' + p.stockDays + '</td><td data-filter-val="' + esc(p.recommendation || (lang === 'ru' ? 'акция' : 'promo')) + '"><span class="badge warn">' + esc(p.recommendation || (lang === 'ru' ? 'акция' : 'promo')) + '</span></td></tr>';
      }).join('') + '</tbody></table></div></div>' +
      '<div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Дефицит' : 'Deficit') + '</h3></div></div>' +
      tableBar('prod-deficit') +
      '<div class="table-wrap"><table class="data" data-table="prod-deficit"><thead><tr><th>' + (lang === 'ru' ? 'Товар' : 'Product') + '</th><th class="num">' + (lang === 'ru' ? 'Дни' : 'Days') + '</th><th class="num">' + (lang === 'ru' ? 'Продажи/день' : 'Sales/day') + '</th><th>' + (lang === 'ru' ? 'Лучший поставщик' : 'Best supplier') + '</th><th>' + (lang === 'ru' ? 'Статус' : 'Status') + '</th></tr></thead><tbody>' +
      deficitRows.map(function (p) {
        var offers = D.offerPrices.filter(function (o) { return o.productId === p.id; }).sort(function (a, b) { return a.leadTimeDays - b.leadTimeDays; });
        var best = offers[0];
        var sup = best && D.suppliers.find(function (s) { return s.id === best.supplierId; });
        return '<tr><td data-filter-val="' + esc(p.name) + '">' + esc(p.name) + '</td><td class="num">' + p.stockDays + '</td><td class="num">' + nf(p.dailySales, 1) + '</td><td data-filter-val="' + esc(sup ? sup.name : '') + '">' + esc(sup ? (sup.name + ' · ' + best.leadTimeDays + (lang === 'ru' ? ' дн' : ' d')) : '-') + '</td><td data-filter-val="' + esc(p.orderStatus) + '"><span class="badge bad">' + esc(p.orderStatus) + '</span></td></tr>';
      }).join('') + '</tbody></table></div></div></div>';

    var matrix = { A: { X: 0, Y: 0, Z: 0 }, B: { X: 0, Y: 0, Z: 0 }, C: { X: 0, Y: 0, Z: 0 } };
    prods.forEach(function (p) { matrix[p.abc][p.xyz]++; });
    html += '<div class="deep-row"><div class="glass-card"><div class="card-heading"><div><h3 class="card-title">ABC/XYZ</h3></div>' +
      '<div class="seg-tabs"><button type="button" data-abc-axis="turnover" aria-pressed="' + (state.abcAxis === 'turnover') + '">' + (lang === 'ru' ? 'По обороту' : 'By turnover') + '</button>' +
      '<button type="button" data-abc-axis="margin" aria-pressed="' + (state.abcAxis === 'margin') + '">' + (lang === 'ru' ? 'По прибыли' : 'By profit') + '</button></div></div>' +
      '<div class="abc-matrix"><div class="abc-corner"></div><div class="abc-lab">X</div><div class="abc-lab">Y</div><div class="abc-lab">Z</div>';
    ['A', 'B', 'C'].forEach(function (a) {
      html += '<div class="abc-lab">' + a + '</div>';
      ['X', 'Y', 'Z'].forEach(function (x) {
        var id = a + x;
        html += '<button type="button" class="abc-cell" data-abc-cell="' + id + '" aria-pressed="' + (state.abcCell === id) + '">' + id + '<small>' + matrix[a][x] + ' SKU</small></button>';
      });
    });
    var filtered = (state.abcCell ? prods.filter(function (p) { return p.abc + p.xyz === state.abcCell; }) : prods.slice(0, 12)).filter(function (p) { return matchFilter(p.name + ' ' + p.sku, 'prod-abc'); });
    html += '</div></div><div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (state.abcCell ? ('SKU · ' + state.abcCell) : 'SKU') + '</h3></div></div>' +
      tableBar('prod-abc') +
      '<div class="table-wrap"><table class="data" data-table="prod-abc"><thead><tr><th>SKU</th><th>' + (lang === 'ru' ? 'Название' : 'Name') + '</th><th class="num">' + (lang === 'ru' ? 'Оборот' : 'Turnover') + '</th><th>ABC</th></tr></thead><tbody>' +
      filtered.slice(0, 15).map(function (p) {
        return '<tr data-sku="' + p.id + '"><td data-filter-val="' + esc(p.sku) + '">' + esc(p.sku) + '</td><td data-filter-val="' + esc(p.name) + '">' + esc(p.name) + '</td><td class="num">' + money(p.turnover * scaleF, true) + '</td><td data-filter-val="' + p.abc + p.xyz + '"><span class="badge">' + p.abc + p.xyz + '</span></td></tr>';
      }).join('') + '</tbody></table></div></div></div>';

    var q = (state.productSearch || '').toLowerCase();
    var priceRows = prods.filter(function (p) { return !q || p.name.toLowerCase().indexOf(q) >= 0 || p.sku.toLowerCase().indexOf(q) >= 0; }).filter(function (p) { return matchFilter(p.name + ' ' + p.sku, 'prod-price'); }).slice(0, 20);
    html += '<div class="glass-card" style="margin-bottom:14px"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Товар - маржа - поставщики' : 'Product - margin - suppliers') + '</h3></div>' +
      '<input class="search-input" data-product-search placeholder="' + (lang === 'ru' ? 'Поиск артикул / название' : 'Search SKU / name') + '" value="' + esc(state.productSearch) + '"></div>' +
      tableBar('prod-price') +
      '<div class="table-wrap"><table class="data" data-table="prod-price"><thead><tr><th>' + (lang === 'ru' ? 'Товар' : 'Product') + '</th><th class="num">' + (lang === 'ru' ? 'Маржа' : 'Margin') + '</th><th>' + (lang === 'ru' ? 'Лучший поставщик' : 'Best supplier') + '</th><th class="num">' + (lang === 'ru' ? 'Цена' : 'Price') + '</th><th>' + (lang === 'ru' ? 'Альтернативы' : 'Alternatives') + '</th></tr></thead><tbody>' +
      priceRows.map(function (p) {
        var offers = D.offerPrices.filter(function (o) { return o.productId === p.id; }).sort(function (a, b) { return a.price - b.price; });
        var best = offers[0];
        var bestS = best && D.suppliers.find(function (s) { return s.id === best.supplierId; });
        var alts = offers.slice(1).map(function (o) {
          var s = D.suppliers.find(function (x) { return x.id === o.supplierId; });
          return '<li><span>' + esc(s ? s.name : o.supplierId) + ' · ' + o.leadTimeDays + (lang === 'ru' ? ' дн' : ' d') + '</span><span>' + money(o.price) + ' (+' + money(o.price - best.price) + ')</span></li>';
        }).join('');
        return '<tr><td data-filter-val="' + esc(p.name) + '">' + esc(p.name) + '</td><td class="num">' + pct(p.marginPct) + '</td><td data-filter-val="' + esc(bestS ? bestS.name : '') + '">' + esc(bestS ? bestS.name : '-') + '</td><td class="num">' + (best ? money(best.price) : '-') + '</td><td><details><summary>' + Math.max(offers.length - 1, 0) + '</summary><ul class="alt-list">' + alts + '</ul></details></td></tr>';
      }).join('') + '</tbody></table></div></div>';

    html += insightCard(D.insights.products);
    return html;
  }

  /* ---------- SUPPLIERS ---------- */
  function renderSuppliers() {
    var scaleF = D.periodScale[state.period];
    var ap = D.supplierDebt.reduce(function (s, d) { return s + d.weOwe; }, 0);
    var ar = D.supplierDebt.reduce(function (s, d) { return s + d.theyOwe; }, 0);
    var purch = D.suppliers.reduce(function (s, x) { return s + x.purchaseAmt; }, 0) * scaleF;
    var avgM = D.suppliers.reduce(function (s, x) { return s + x.marginPct * x.purchaseAmt; }, 0) / (D.suppliers.reduce(function (s, x) { return s + x.purchaseAmt; }, 0) || 1);
    var paid = D.suppliers.reduce(function (s, x) { return s + x.paid; }, 0) * scaleF;
    var overdueAp = D.supplierDebt.filter(function (d) { return d.overdueDays > 0; }).reduce(function (s, d) { return s + d.weOwe * 0.45; }, 0);

    var html = heading();
    html += '<div class="kpi-grid">' +
      kpiCard(lang === 'ru' ? 'Общая дебиторка' : 'Total AP label', money(ap, true), '<span class="kpi-change">' + (lang === 'ru' ? 'расчёты с пост.' : 'settlements') + '</span>', sparkSvg([10, 11, 11.5, 12, 12.2, 12.4], '#f0a66c')) +
      kpiCard(lang === 'ru' ? 'Долг поставщиков нам' : 'They owe us', money(ar, true), deltaPct(-12), sparkSvg([0.9, 0.8, 0.7, 0.65, 0.62, 0.6], '#72ddbf')) +
      kpiCard(lang === 'ru' ? 'Оборот закупок' : 'Purchase turnover', money(purch, true), deltaPct(5.4), sparkSvg([28, 29, 30, 30.5, 31, 31.2], '#6e96ff')) +
      kpiCard(lang === 'ru' ? 'Ср. маржа' : 'Avg margin', pct(avgM), deltaPct(0.4), sparkSvg([20, 20.4, 20.8, 21, 21.1], '#8f79e5')) +
      '</div>';
    html += '<p class="card-subtitle" style="margin:-6px 0 14px">' + (lang === 'ru' ? '«Общая дебиторка» - по сути кредиторка перед поставщиками; отдельно - долг поставщиков нам.' : 'Total label is AP to suppliers; supplier AR shown separately.') + '</p>';

    var sorted = D.suppliers.slice().sort(function (a, b) {
      if (state.supplierTab === 'margin') return b.marginPct - a.marginPct;
      if (state.supplierTab === 'paid') return b.paid - a.paid;
      if (state.supplierTab === 'debt') {
        var da = D.supplierDebt.find(function (x) { return x.supplierId === a.id; });
        var db = D.supplierDebt.find(function (x) { return x.supplierId === b.id; });
        return (db ? db.weOwe : 0) - (da ? da.weOwe : 0);
      }
      return b.purchaseAmt - a.purchaseAmt;
    }).filter(function (s) { return matchFilter(s.name, 'sup-top'); });

    html += '<div class="analytics-row"><div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Топ поставщиков' : 'Top suppliers') + '</h3></div>' +
      '<div class="seg-tabs">' +
      [['margin', lang === 'ru' ? 'Маржа' : 'Margin'], ['turnover', lang === 'ru' ? 'Оборот' : 'Turnover'], ['paid', lang === 'ru' ? 'Оплаты' : 'Paid'], ['debt', lang === 'ru' ? 'Долг' : 'Debt']].map(function (t) {
        return '<button type="button" data-sup-tab="' + t[0] + '" aria-pressed="' + (state.supplierTab === t[0]) + '">' + t[1] + '</button>';
      }).join('') + '</div></div>' + tableBar('sup-top') +
      '<div class="table-wrap"><table class="data" data-table="sup-top"><thead><tr><th>' + (lang === 'ru' ? 'Поставщик' : 'Supplier') + '</th><th class="num">' + (lang === 'ru' ? 'Закупки' : 'Purchases') + '</th><th class="num">' + (lang === 'ru' ? 'Маржа' : 'Margin') + '</th><th class="num">' + (lang === 'ru' ? 'Оплатили' : 'Paid') + '</th><th class="num">' + (lang === 'ru' ? 'Доля' : 'Share') + '</th></tr></thead><tbody>' +
      sorted.map(function (s) {
        return '<tr data-supplier="' + s.id + '"><td data-filter-val="' + esc(s.name) + '">' + esc(s.name) + ' <span class="badge">' + s.abc + s.xyz + '</span></td><td class="num">' + money(s.purchaseAmt * scaleF, true) + '</td><td class="num">' + pct(s.marginPct) + '</td><td class="num">' + money(s.paid * scaleF, true) + '</td><td class="num">' + pct(s.share, 1) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +
      '<div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Структура расчётов' : 'Settlement mix') + '</h3></div></div>' +
      donut([
        { id: 'due', name: lang === 'ru' ? 'К оплате' : 'Due', value: Math.max(ap - overdueAp, 0), color: '#ebc26b' },
        { id: 'ovd', name: lang === 'ru' ? 'Просрочено' : 'Overdue', value: overdueAp, color: '#f3a09c' },
        { id: 'paid', name: lang === 'ru' ? 'Оплачено за период' : 'Paid in period', value: paid * 0.35, color: '#53cbb8' }
      ], money(ap, true), lang === 'ru' ? 'расчёты' : 'settlements', 'supap') + '</div></div>';

    var sid = state.selectedSupplier || (sorted[0] && sorted[0].id) || D.suppliers[0].id;
    var pur = D.purchases.filter(function (p) { return p.supplierId === sid; });
    var sup = D.suppliers.find(function (s) { return s.id === sid; });
    var colors = ['#6e96ff', '#8f79e5', '#f0a66c', '#53cbb8', '#f18e75', '#72ddbf'];
    html += '<div class="deep-row"><div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Структура поставщика' : 'Supplier mix') + '</h3><p class="card-subtitle">' + esc(sup ? sup.name : '') + '</p></div>' +
      '<div class="select-wrap"><select class="channel-select" data-filter="supplier">' + D.suppliers.map(function (s) {
        return '<option value="' + s.id + '"' + (s.id === sid ? ' selected' : '') + '>' + esc(s.name) + '</option>';
      }).join('') + '</select></div></div>' +
      donut(pur.map(function (p, i) {
        var cat = D.categories.find(function (c) { return c.id === p.categoryId; });
        return { id: p.categoryId, name: cat ? cat.name : p.categoryId, value: p.amount * scaleF, color: colors[i % colors.length] };
      }), money(pur.reduce(function (s, p) { return s + p.amount; }, 0) * scaleF, true), lang === 'ru' ? 'закупки' : 'purchases', 'supcat') +
      tableBar('sup-cat') +
      '<div class="table-wrap" style="margin-top:8px"><table class="data" data-table="sup-cat"><thead><tr><th>' + (lang === 'ru' ? 'Категория' : 'Category') + '</th><th class="num">' + (lang === 'ru' ? 'Закупка' : 'Amount') + '</th><th class="num">' + (lang === 'ru' ? 'Маржа' : 'Margin') + '</th><th class="num">SKU</th></tr></thead><tbody>' +
      pur.filter(function (p) {
        var cat = D.categories.find(function (c) { return c.id === p.categoryId; });
        return matchFilter(cat ? cat.name : p.categoryId, 'sup-cat');
      }).map(function (p) {
        var cat = D.categories.find(function (c) { return c.id === p.categoryId; });
        return '<tr><td data-filter-val="' + esc(cat ? cat.name : '') + '">' + esc(cat ? cat.name : '') + '</td><td class="num">' + money(p.amount * scaleF, true) + '</td><td class="num">' + pct(p.marginPct) + '</td><td class="num">' + p.skuCount + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +
      '<div class="glass-card"><div class="card-heading"><div><h3 class="card-title">ABC/XYZ</h3></div></div><div class="abc-matrix"><div class="abc-corner"></div><div class="abc-lab">X</div><div class="abc-lab">Y</div><div class="abc-lab">Z</div>';
    var sm = { A: { X: [], Y: [], Z: [] }, B: { X: [], Y: [], Z: [] }, C: { X: [], Y: [], Z: [] } };
    D.suppliers.forEach(function (s) { sm[s.abc][s.xyz].push(s); });
    ['A', 'B', 'C'].forEach(function (a) {
      html += '<div class="abc-lab">' + a + '</div>';
      ['X', 'Y', 'Z'].forEach(function (x) {
        var id = a + x;
        html += '<button type="button" class="abc-cell" data-sabc="' + id + '" aria-pressed="' + (state.abcCell === 's' + id) + '">' + id + '<small>' + sm[a][x].length + '</small></button>';
      });
    });
    var showSup = state.abcCell && state.abcCell.charAt(0) === 's' ? D.suppliers.filter(function (s) { return s.abc + s.xyz === state.abcCell.slice(1); }) : D.suppliers.slice(0, 6);
    html += '</div><ul class="alt-list" style="margin-top:12px">' + showSup.map(function (s) { return '<li><span>' + esc(s.name) + ' <span class="badge">' + s.abc + s.xyz + '</span></span><span>' + money(s.purchaseAmt * scaleF, true) + '</span></li>'; }).join('') + '</ul></div></div>';

    html += insightCard(D.insights.suppliers);
    return html;
  }

  /* ---------- FINANCE ---------- */
  function financeSlice() {
    var weeks = D.financeWeekly || [];
    var nWeeks = { 1: 4, 3: 13, 6: 26, 12: 52 }[state.period] || 4;
    return weeks.slice(-nWeeks);
  }

  function renderFinance() {
    var slice = financeSlice();
    var monthly = D.financeMonthly.slice(-state.period);
    var turnover = slice.reduce(function (s, m) { return s + m.turnover; }, 0);
    var profit = slice.reduce(function (s, m) { return s + m.profit; }, 0);
    var margin = turnover ? profit / turnover * 100 : 0;
    var cash = monthly.reduce(function (s, m) { return s + m.cashflow; }, 0);
    var ar = D.arApAging.filter(function (x) { return x.side === 'ar'; }).reduce(function (s, x) { return s + x.amount; }, 0);
    var ap = D.arApAging.filter(function (x) { return x.side === 'ap'; }).reduce(function (s, x) { return s + x.amount; }, 0);
    var saldo = ar - ap;

    var html = heading();
    html += '<div class="kpi-grid">' +
      kpiCard(lang === 'ru' ? 'Оборот' : 'Turnover', money(turnover, true), deltaPct(4.9), sparkSvg(slice.map(function (m) { return m.turnover / 1e6; }), '#6e96ff')) +
      kpiCard(lang === 'ru' ? 'Валовая маржа' : 'Gross margin', pct(margin), deltaPct(-0.4), sparkSvg(slice.map(function (m) { return m.marginPct; }), '#72ddbf')) +
      kpiCard(lang === 'ru' ? 'Прибыль' : 'Profit', money(profit, true), deltaPct(2.9), sparkSvg(slice.map(function (m) { return m.profit / 1e6; }), '#8f79e5')) +
      kpiCard(lang === 'ru' ? 'Чистый денежный поток' : 'Net cash flow', (cash >= 0 ? '+' : '') + money(cash, true), deltaPct(8.1), sparkSvg(monthly.map(function (m) { return m.cashflow / 1e6; }), cash >= 0 ? '#72ddbf' : '#f3a09c')) +
      '</div>';

    html += '<div class="analytics-row"><div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Дебиторка / кредиторка' : 'AR / AP') + '</h3></div></div>' +
      donut([
        { id: 'ar', name: lang === 'ru' ? 'Дебиторка' : 'AR', value: ar, color: '#6e96ff' },
        { id: 'ap', name: lang === 'ru' ? 'Кредиторка' : 'AP', value: ap, color: '#f0a66c' }
      ], (saldo >= 0 ? '+' : '') + money(saldo, true), lang === 'ru' ? 'сальдо' : 'balance', 'arap') +
      tableBar('fin-aging') +
      '<div class="table-wrap" style="margin-top:8px"><table class="data" data-table="fin-aging"><thead><tr><th>' + (lang === 'ru' ? 'Сторона' : 'Side') + '</th><th>' + (lang === 'ru' ? 'Корзина' : 'Bucket') + '</th><th class="num">' + (lang === 'ru' ? 'Сумма' : 'Amount') + '</th></tr></thead><tbody>' +
      D.arApAging.filter(function (r) { return matchFilter((r.side === 'ar' ? (lang === 'ru' ? 'ДЗ' : 'AR') : (lang === 'ru' ? 'КЗ' : 'AP')) + ' ' + r.bucket, 'fin-aging'); }).map(function (r) {
        var side = r.side === 'ar' ? (lang === 'ru' ? 'ДЗ' : 'AR') : (lang === 'ru' ? 'КЗ' : 'AP');
        return '<tr><td data-filter-val="' + side + '">' + side + '</td><td data-filter-val="' + r.bucket + '">' + r.bucket + '</td><td class="num">' + money(r.amount, true) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +
      '<div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Оборот / маржа / прибыль' : 'Turnover / margin / profit') + '</h3><p class="card-subtitle">' + (lang === 'ru' ? 'Недельные точки · столбцы оборот, линия прибыль, пунктир маржа %' : 'Weekly points · bars turnover, line profit, dashed margin %') + ' · ' + slice.length + ' ' + (lang === 'ru' ? 'точек' : 'pts') + '</p></div></div>' +
      comboChart(slice) +
      tableBar('fin-series') +
      '<div class="table-wrap" style="margin-top:10px"><table class="data" data-table="fin-series"><thead><tr><th>' + (lang === 'ru' ? 'Период' : 'Period') + '</th><th class="num">' + (lang === 'ru' ? 'Оборот' : 'Turnover') + '</th><th class="num">' + (lang === 'ru' ? 'Маржа' : 'Margin') + '</th><th class="num">' + (lang === 'ru' ? 'Прибыль' : 'Profit') + '</th><th class="num">' + (lang === 'ru' ? 'План' : 'Plan') + '</th></tr></thead><tbody>' +
      slice.filter(function (m) { return matchFilter(m.label, 'fin-series'); }).map(function (m) {
        return '<tr><td data-filter-val="' + esc(m.label) + '">' + esc(m.label) + '</td><td class="num">' + money(m.turnover, true) + '</td><td class="num">' + pct(m.marginPct) + '</td><td class="num">' + money(m.profit, true) + '</td><td class="num">' + money(m.plan, true) + '</td></tr>';
      }).join('') + '</tbody></table></div></div></div>';

    var bh = state.budgetHorizon;
    var scaleB = bh === 3 ? 2.9 : 1;
    var exp = (D.expenseBudget || []).map(function (e) {
      return { id: e.id, name: lang === 'ru' ? e.name : e.nameEn, done: Math.round(e.done * scaleB), upcoming: Math.round(e.upcoming * scaleB), total: Math.round(e.total * scaleB), dueDate: e.dueDate };
    });
    var totalUpcoming = exp.reduce(function (s, e) { return s + e.upcoming; }, 0);
    html += '<div class="deep-row"><div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Бюджет расходов' : 'Expense budget') + '</h3><p class="card-subtitle">' + (lang === 'ru' ? 'Выполнено / предстоит · сколько подготовить' : 'Done / upcoming · cash to prepare') + '</p></div>' +
      '<div class="seg-tabs"><button type="button" data-budget-h="1" aria-pressed="' + (bh === 1) + '">1 ' + (lang === 'ru' ? 'мес' : 'mo') + '</button>' +
      '<button type="button" data-budget-h="3" aria-pressed="' + (bh === 3) + '">3 ' + (lang === 'ru' ? 'мес' : 'mo') + '</button></div></div>' +
      '<div class="prepare-banner">' + (lang === 'ru' ? 'К подготовке до ближайших сроков: ' : 'To prepare by upcoming dues: ') + '<strong>' + money(totalUpcoming, true) + '</strong></div>';
    exp.forEach(function (e) {
      var donePct = e.total ? e.done / e.total * 100 : 0;
      html += '<div class="budget-split"><div class="budget-split-head"><span>' + esc(e.name) + '</span><span class="badge warn">' + (lang === 'ru' ? 'срок ' : 'due ') + esc(e.dueDate) + '</span></div>' +
        '<div class="dual-bars"><div class="dual-seg done" style="width:' + donePct + '%" title="' + (lang === 'ru' ? 'Выполнено' : 'Done') + '"></div><div class="dual-seg upcoming" style="width:' + (100 - donePct) + '%" title="' + (lang === 'ru' ? 'Предстоит' : 'Upcoming') + '"></div></div>' +
        '<div class="dual-meta"><span class="ok-txt">' + (lang === 'ru' ? 'Выполнено' : 'Done') + ': ' + money(e.done, true) + '</span><span class="warn-txt">' + (lang === 'ru' ? 'Предстоит' : 'Upcoming') + ': <b>' + money(e.upcoming, true) + '</b></span></div></div>';
    });
    html += '</div>';

    var ih = state.incomeHorizon;
    var scaleI = ih === 3 ? 2.9 : 1;
    var inc = (D.incomeBudget || []).map(function (e) {
      return { id: e.id, name: lang === 'ru' ? e.name : e.nameEn, collected: Math.round(e.collected * scaleI), toCollect: Math.round(e.toCollect * scaleI), total: Math.round(e.total * scaleI), availableBy: e.availableBy };
    });
    var totalToCollect = inc.reduce(function (s, e) { return s + e.toCollect; }, 0);
    var totalCollected = inc.reduce(function (s, e) { return s + e.collected; }, 0);
    html += '<div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Бюджет доходов' : 'Income budget') + '</h3><p class="card-subtitle">' + (lang === 'ru' ? 'Собрано / ещё поступит к датам расходов' : 'Collected / still due by expense dates') + '</p></div>' +
      '<div class="seg-tabs"><button type="button" data-income-h="1" aria-pressed="' + (ih === 1) + '">1 ' + (lang === 'ru' ? 'мес' : 'mo') + '</button>' +
      '<button type="button" data-income-h="3" aria-pressed="' + (ih === 3) + '">3 ' + (lang === 'ru' ? 'мес' : 'mo') + '</button></div></div>' +
      '<div class="prepare-banner income">' + (lang === 'ru' ? 'Уже собрано: ' : 'Collected: ') + '<strong>' + money(totalCollected, true) + '</strong> · ' + (lang === 'ru' ? 'ещё поступит: ' : 'still to collect: ') + '<strong>' + money(totalToCollect, true) + '</strong></div>';
    inc.forEach(function (e) {
      var colPct = e.total ? e.collected / e.total * 100 : 0;
      html += '<div class="budget-split"><div class="budget-split-head"><span>' + esc(e.name) + '</span><span class="badge ok">' + (lang === 'ru' ? 'к ' : 'by ') + esc(e.availableBy) + '</span></div>' +
        '<div class="dual-bars"><div class="dual-seg done" style="width:' + colPct + '%"></div><div class="dual-seg upcoming income" style="width:' + (100 - colPct) + '%"></div></div>' +
        '<div class="dual-meta"><span class="ok-txt">' + (lang === 'ru' ? 'Собрано' : 'Collected') + ': ' + money(e.collected, true) + '</span><span class="warn-txt">' + (lang === 'ru' ? 'Ещё поступит' : 'To collect') + ': <b>' + money(e.toCollect, true) + '</b></span></div></div>';
    });
    html += '<p class="card-subtitle" style="margin-top:12px">' + (lang === 'ru' ? 'Даты поступления выровнены с сроками расходов (закупки 05.11, ЗП 10.11, налоги 15.11) - видно, хватит ли кассы.' : 'Collection dates aligned with expense dues so cash coverage is visible.') + '</p></div></div>';

    html += insightCard(D.insights.finance);
    return html;
  }

  function comboChart(slice) {
    var w = 720, h = 240, padL = 44, padR = 44, padT = 16, padB = 28;
    var maxT = Math.max.apply(null, slice.map(function (m) { return m.turnover; }).concat([1])) * 1.08;
    var maxP = Math.max.apply(null, slice.map(function (m) { return m.profit; }).concat([1])) * 1.15;
    var plotW = w - padL - padR;
    var plotH = h - padT - padB;
    var bw = plotW / slice.length;
    var bars = slice.map(function (m, i) {
      var bh = (m.turnover / maxT) * plotH;
      var x = padL + i * bw + bw * 0.15;
      return '<rect x="' + x + '" y="' + (padT + plotH - bh) + '" width="' + Math.max(2, bw * 0.55) + '" height="' + bh + '" rx="2" fill="#6e96ff" fill-opacity=".72"><title>' + esc(m.label) + ': ' + money(m.turnover, true) + '</title></rect>';
    }).join('');
    var profitPts = slice.map(function (m, i) {
      var x = padL + i * bw + bw * 0.42;
      var y = padT + plotH - (m.profit / maxP) * plotH;
      return x + ',' + y;
    }).join(' ');
    var marginPts = slice.map(function (m, i) {
      var x = padL + i * bw + bw * 0.42;
      var y = padT + plotH - ((m.marginPct - 18) / 10) * plotH;
      return x + ',' + Math.max(padT, Math.min(padT + plotH, y));
    }).join(' ');
    var labelStep = slice.length > 26 ? 4 : (slice.length > 13 ? 2 : 1);
    var labels = slice.map(function (m, i) {
      if (i % labelStep !== 0 && i !== slice.length - 1) return '';
      return '<text class="chart-label" x="' + (padL + i * bw + bw * 0.42) + '" y="' + (h - 6) + '" text-anchor="middle" font-size="9">' + esc(m.label) + '</text>';
    }).join('');
    return '<div class="chart-box"><svg viewBox="0 0 ' + w + ' ' + h + '">' + bars +
      '<polyline fill="none" stroke="#72ddbf" stroke-width="2" points="' + profitPts + '"/>' +
      '<polyline fill="none" stroke="#f0a66c" stroke-width="1.6" stroke-dasharray="4 3" points="' + marginPts + '"/>' +
      labels +
      '<text x="' + (w - 8) + '" y="14" text-anchor="end" fill="#72ddbf" font-size="10">' + (lang === 'ru' ? 'прибыль' : 'profit') + '</text>' +
      '<text x="' + (w - 8) + '" y="28" text-anchor="end" fill="#f0a66c" font-size="10">' + (lang === 'ru' ? 'маржа %' : 'margin %') + '</text>' +
      '</svg></div>';
  }

  /* ---------- LOGISTICS ---------- */
  function renderLogistics() {
    var trips = D.fleetTrips.filter(function (t) { return state.warehouse === 'all' || t.rcId === state.warehouse; });
    var scaleF = Math.max(1, state.period);
    var stock = D.stockByRc;
    var stockTot = stock.reduce(function (s, r) { return s + r.value; }, 0);
    var tripCost = trips.reduce(function (s, t) { return s + t.cost; }, 0) * scaleF;
    var avgTrip = trips.length ? tripCost / (trips.length * scaleF) : 0;

    var html = heading();
    html += '<div class="kpi-grid">' +
      kpiCard(lang === 'ru' ? 'Стоимость остатков' : 'Stock value', money(stockTot, true), deltaPct(1.8), sparkSvg([80, 81, 82, 83, 84, 84.7], '#6e96ff')) +
      kpiCard(lang === 'ru' ? 'Складов в отчёте' : 'Warehouses', '3', '<span class="kpi-change">' + (lang === 'ru' ? 'МСК · СПб · КЗН' : 'RTM · HAM · LYS') + '</span>', sparkSvg([3, 3, 3, 3, 3, 3], '#8f79e5')) +
      kpiCard(lang === 'ru' ? 'Рейсов за период' : 'Trips', nf(Math.round(trips.length * scaleF * 9.8)), deltaPct(4.5), sparkSvg([380, 390, 395, 400, 408, 412], '#f0a66c')) +
      kpiCard(lang === 'ru' ? 'Ср. стоимость рейса' : 'Avg trip cost', money(avgTrip, true), deltaPct(-2.1), sparkSvg([19.2, 19, 18.8, 18.6, 18.5, 18.4], '#72ddbf')) +
      '</div>';

    html += '<div class="analytics-row"><div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Стоимость остатков по складам' : 'Stock by warehouse') + '</h3></div></div>' +
      tableBar('log-stock') +
      '<div class="table-wrap"><table class="data" data-table="log-stock"><thead><tr><th>' + (lang === 'ru' ? 'Склад' : 'Warehouse') + '</th><th class="num">' + (lang === 'ru' ? 'Стоимость' : 'Value') + '</th><th class="num">SKU</th><th class="num">' + (lang === 'ru' ? 'Доля' : 'Share') + '</th><th class="num">' + (lang === 'ru' ? 'Дни' : 'Days') + '</th></tr></thead><tbody>' +
      stock.filter(function (r) {
        var rc = D.RC.find(function (x) { return x.id === r.rcId; });
        return matchFilter(rc ? rc.name : r.rcId, 'log-stock');
      }).map(function (r) {
        var rc = D.RC.find(function (x) { return x.id === r.rcId; });
        return '<tr data-set-wh="' + r.rcId + '"><td data-filter-val="' + esc(rc ? rc.name : r.rcId) + '">' + esc(rc ? rc.name : r.rcId) + '</td><td class="num"><div class="bar-cell"><div class="bar-track"><div class="bar-fill" style="width:' + r.share + '%"></div></div>' + money(r.value, true) + '</div></td><td class="num">' + nf(r.sku) + '</td><td class="num">' + pct(r.share, 1) + '</td><td class="num">' + r.stockDays + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +
      '<div class="glass-card">' + donut(stock.map(function (r, i) {
        var rc = D.RC.find(function (x) { return x.id === r.rcId; });
        return { id: r.rcId, name: rc ? rc.name : r.rcId, value: r.value, color: ['#6e96ff', '#8f79e5', '#f0a66c'][i], pct: r.share };
      }), money(stockTot, true), lang === 'ru' ? 'остатки' : 'stock', 'stock') + '</div></div>';

    var km = trips.reduce(function (s, t) { return s + t.km; }, 0) * scaleF;
    var tripRows = trips.slice(0, 18).filter(function (t) { return matchFilter(t.vehicle + ' ' + t.driver + ' ' + t.to, 'log-trips'); });
    html += '<div class="glass-card" style="margin-bottom:14px"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Доставка' : 'Delivery') + '</h3><p class="card-subtitle">' + (lang === 'ru' ? 'Стоимость км: ' : 'Cost per km: ') + money(tripCost / (km || 1)) + ' · ' + nf(Math.round(km)) + (lang === 'ru' ? ' км' : ' km') + '</p></div></div>' +
      miniBars(trips.slice(0, 14).reverse()) + tableBar('log-trips') +
      '<div class="table-wrap" style="margin-top:12px"><table class="data" data-table="log-trips"><thead><tr><th>' + (lang === 'ru' ? 'Дата' : 'Date') + '</th><th>' + (lang === 'ru' ? 'ТС' : 'Vehicle') + '</th><th>' + (lang === 'ru' ? 'Водитель' : 'Driver') + '</th><th>' + (lang === 'ru' ? 'Маршрут' : 'Route') + '</th><th class="num">' + (lang === 'ru' ? 'км' : 'km') + '</th><th class="num">' + (lang === 'ru' ? 'Стоимость' : 'Cost') + '</th></tr></thead><tbody>' +
      tripRows.map(function (t) {
        return '<tr><td data-filter-val="' + esc(t.date) + '">' + esc(t.date) + '</td><td data-filter-val="' + esc(t.vehicle) + '">' + esc(t.vehicle) + '</td><td data-filter-val="' + esc(t.driver) + '">' + esc(t.driver) + '</td><td data-filter-val="' + esc(t.to) + '">' + esc(t.from) + ' → ' + esc(t.to) + '</td><td class="num">' + t.km + '</td><td class="num">' + money(t.cost, true) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';

    var maxAsm = Math.max.apply(null, D.pickers.map(function (p) { return p.assemblies; }));
    html += '<div class="glass-card" style="margin-bottom:14px"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Сборка' : 'Picking') + '</h3></div></div>';
    D.pickers.forEach(function (p) {
      var status = p.load > 1.05 ? 'bad' : (p.load > 0.95 ? 'warn' : 'ok');
      var label = status === 'ok' ? (lang === 'ru' ? 'в норме' : 'normal') : (status === 'warn' ? (lang === 'ru' ? 'на пределе' : 'at limit') : (lang === 'ru' ? 'перегруз' : 'overloaded'));
      html += '<div class="progress-row"><div>' + esc(p.name) + ' <span class="load-pill ' + status + '">' + label + '</span></div>' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + (p.assemblies / maxAsm * 100) + '%"></div></div>' +
        '<div class="num">' + p.assemblies + '</div><div class="num">' + nf(p.linesPerHour) + (lang === 'ru' ? '/ч' : '/h') + '</div></div>';
    });
    html += '</div>' + insightCard(D.insights.logistics);
    return html;
  }

  function miniBars(trips) {
    var w = 640, h = 90, pad = 20;
    var max = Math.max.apply(null, trips.map(function (t) { return t.km; }).concat([1]));
    var bw = (w - pad * 2) / trips.length;
    return '<div class="chart-box"><svg viewBox="0 0 ' + w + ' ' + h + '">' + trips.map(function (t, i) {
      var bh = (t.km / max) * (h - 24);
      return '<rect x="' + (pad + i * bw + 2) + '" y="' + (h - 14 - bh) + '" width="' + Math.max(4, bw - 4) + '" height="' + bh + '" rx="3" fill="#8f79e5" fill-opacity=".8"><title>' + t.date + ': ' + t.km + (lang === 'ru' ? ' км' : ' km') + '</title></rect>';
    }).join('') + '</svg></div>';
  }

  /* ---------- SALES ---------- */
  function renderSales() {
    var scaleF = D.periodScale[state.period];
    var stats = D.managerStats;
    var turn = stats.reduce(function (s, m) { return s + m.turnover; }, 0) * scaleF;
    var profit = stats.reduce(function (s, m) { return s + m.profit; }, 0) * scaleF;
    var calls = stats.reduce(function (s, m) { return s + m.calls; }, 0);
    var trips = stats.reduce(function (s, m) { return s + m.trips; }, 0);
    var hz = state.newClientHorizon;
    var newC = stats.reduce(function (s, m) { return s + m.newClients[hz]; }, 0);

    var html = heading();
    html += '<div class="crm-banner"><strong>' + (lang === 'ru' ? 'Данные раздела зависят от CRM.' : 'This section depends on CRM.') + '</strong>' +
      (lang === 'ru'
        ? 'Обороты/прибыль - CRM↔1С. Звонки и визиты - если активности фиксируются. В демо - синтетика.'
        : 'Turnover/profit from CRM↔ERP. Demo uses synthetic data.') +
      '</div>';

    html += '<div class="kpi-grid kpi-5">' +
      kpiCard(lang === 'ru' ? 'Оборот отдела' : 'Team turnover', money(turn, true), deltaPct(5.2), sparkSvg([36, 37, 38, 39, 40, 41.2], '#6e96ff')) +
      kpiCard(lang === 'ru' ? 'Прибыль отдела' : 'Team profit', money(profit, true), deltaPct(7.1), sparkSvg([3.2, 3.4, 3.5, 3.7, 3.8, 3.9], '#72ddbf')) +
      kpiCard(lang === 'ru' ? 'Звонков' : 'Calls', nf(Math.round(calls * Math.min(scaleF, 3))), deltaPct(3.4), sparkSvg([1600, 1680, 1720, 1780, 1810, 1842], '#8f79e5')) +
      kpiCard(lang === 'ru' ? 'Визитов' : 'Visits', nf(Math.round(trips * Math.min(scaleF, 2.5))), deltaPct(1.8), sparkSvg([240, 248, 252, 258, 262, 268], '#f0a66c')) +
      kpiCard(lang === 'ru' ? 'Новых клиентов' : 'New clients', nf(newC), deltaPct(12), sparkSvg([20, 24, 28, 31, 34, 37], '#53cbb8')) +
      '</div>';

    var sorted = stats.slice().sort(function (a, b) {
      return state.salesMetric === 'profit' ? b.profit - a.profit : b.turnover - a.turnover;
    }).filter(function (ms) {
      var m = D.managers.find(function (x) { return x.id === ms.managerId; });
      return matchFilter(m ? m.name : ms.managerId, 'sales-mgr');
    });
    html += '<div class="glass-card" style="margin-bottom:14px"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Топ менеджеров' : 'Top managers') + '</h3></div>' +
      '<div class="seg-tabs"><button type="button" data-sales-metric="turnover" aria-pressed="' + (state.salesMetric === 'turnover') + '">' + (lang === 'ru' ? 'Оборот' : 'Turnover') + '</button>' +
      '<button type="button" data-sales-metric="profit" aria-pressed="' + (state.salesMetric === 'profit') + '">' + (lang === 'ru' ? 'Прибыль' : 'Profit') + '</button></div></div>' +
      tableBar('sales-mgr') +
      '<div class="table-wrap"><table class="data" data-table="sales-mgr"><thead><tr><th>' + (lang === 'ru' ? 'Менеджер' : 'Manager') + '</th><th class="num">' + (lang === 'ru' ? 'Клиентов' : 'Clients') + '</th><th class="num">' + (lang === 'ru' ? 'Оборот' : 'Turnover') + '</th><th class="num">' + (lang === 'ru' ? 'Прибыль' : 'Profit') + '</th><th class="num">' + (lang === 'ru' ? 'Звонков' : 'Calls') + '</th><th class="num">' + (lang === 'ru' ? 'Визитов' : 'Visits') + '</th></tr></thead><tbody>';
    sorted.forEach(function (ms) {
      var m = D.managers.find(function (x) { return x.id === ms.managerId; });
      var maxV = (sorted[0] && sorted[0][state.salesMetric]) || 1;
      html += '<tr data-manager="' + ms.managerId + '"><td data-filter-val="' + esc(m ? m.name : '') + '">' + esc(m ? m.name : ms.managerId) + '</td><td class="num">' + ms.clients + '</td>' +
        '<td class="num"><div class="bar-cell"><div class="bar-track"><div class="bar-fill" style="width:' + (ms.turnover / maxV * 100) + '%"></div></div>' + money(ms.turnover * scaleF, true) + '</div></td>' +
        '<td class="num">' + money(ms.profit * scaleF, true) + '</td><td class="num">' + ms.calls + '</td><td class="num">' + ms.trips + '</td></tr>';
      if (state.expandedManager === ms.managerId) {
        var clients = D.clients.filter(function (c) { return c.managerId === ms.managerId; }).slice(0, 8);
        html += '<tr><td colspan="6"><div class="side-panel"><h4>' + (lang === 'ru' ? 'Клиенты менеджера' : 'Manager clients') + '</h4><div class="table-wrap"><table class="data"><thead><tr><th>' + (lang === 'ru' ? 'Клиент' : 'Client') + '</th><th class="num">' + (lang === 'ru' ? 'Оборот' : 'Turnover') + '</th><th class="num">' + (lang === 'ru' ? 'Маржа' : 'Margin') + '</th></tr></thead><tbody>' +
          clients.map(function (c) {
            return '<tr><td>' + esc(c.name) + '</td><td class="num">' + money(c.turnover * scaleF, true) + '</td><td class="num">' + pct(c.marginPct) + '</td></tr>';
          }).join('') + '</tbody></table></div></div></td></tr>';
      }
    });
    html += '</tbody></table></div></div>';

    html += '<div class="deep-row"><div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Активность' : 'Activity') + '</h3></div></div>' +
      tableBar('sales-act') +
      '<div class="table-wrap"><table class="data" data-table="sales-act"><thead><tr><th>' + (lang === 'ru' ? 'Менеджер' : 'Manager') + '</th><th class="num">' + (lang === 'ru' ? 'Исх.' : 'Out') + '</th><th class="num">' + (lang === 'ru' ? 'Вх.' : 'In') + '</th><th class="num">' + (lang === 'ru' ? 'Дозвон' : 'Reach') + '</th><th class="num">' + (lang === 'ru' ? 'Визиты' : 'Visits') + '</th></tr></thead><tbody>' +
      stats.filter(function (ms) {
        var m = D.managers.find(function (x) { return x.id === ms.managerId; });
        return matchFilter(m ? m.name : '', 'sales-act');
      }).map(function (ms) {
        var m = D.managers.find(function (x) { return x.id === ms.managerId; });
        return '<tr><td data-filter-val="' + esc(m ? m.name : '') + '">' + esc(m ? m.name : '') + '</td><td class="num">' + ms.callsOut + '</td><td class="num">' + ms.callsIn + '</td><td class="num">' + pct(ms.callSuccessPct) + '</td><td class="num">' + ms.trips + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +
      '<div class="glass-card"><div class="card-heading"><div><h3 class="card-title">' + (lang === 'ru' ? 'Новые клиенты' : 'New clients') + '</h3></div>' +
      '<div class="seg-tabs">' +
      [['d7', T.periods[7]], ['m1', T.periods[1]], ['m3', T.periods[3]], ['m6', T.periods[6]], ['m12', T.periods[12]]].map(function (h) {
        return '<button type="button" data-new-hz="' + h[0] + '" aria-pressed="' + (state.newClientHorizon === h[0]) + '">' + h[1] + '</button>';
      }).join('') + '</div></div>' + tableBar('sales-new') +
      '<div class="table-wrap"><table class="data" data-table="sales-new"><thead><tr><th>' + (lang === 'ru' ? 'Менеджер' : 'Manager') + '</th><th class="num">' + (lang === 'ru' ? 'Новых' : 'New') + '</th><th class="num">' + (lang === 'ru' ? 'Оборот новых' : 'New turnover') + '</th><th class="num">' + (lang === 'ru' ? 'Конверсия' : 'Conv.') + '</th></tr></thead><tbody>' +
      stats.slice().sort(function (a, b) { return b.newClients[hz] - a.newClients[hz]; }).filter(function (ms) {
        var m = D.managers.find(function (x) { return x.id === ms.managerId; });
        return matchFilter(m ? m.name : '', 'sales-new');
      }).map(function (ms) {
        var m = D.managers.find(function (x) { return x.id === ms.managerId; });
        return '<tr><td data-filter-val="' + esc(m ? m.name : '') + '">' + esc(m ? m.name : '') + '</td><td class="num">' + ms.newClients[hz] + '</td><td class="num">' + money(ms.newClientsTurnover * (hz === 'd7' ? 0.2 : 1), true) + '</td><td class="num">' + pct(ms.conversion) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    var f = stats[1].funnel;
    html += '<div class="funnel-row"><div class="funnel-step"><b>' + f.leads + '</b><span>' + (lang === 'ru' ? 'Лиды' : 'Leads') + '</span></div>' +
      '<div class="funnel-step"><b>' + f.meetings + '</b><span>' + (lang === 'ru' ? 'Встречи' : 'Meetings') + '</span></div>' +
      '<div class="funnel-step"><b>' + f.firstShip + '</b><span>' + (lang === 'ru' ? 'Первая отгрузка' : 'First ship') + '</span></div></div></div></div>';

    html += insightCard(D.insights.sales);
    return html;
  }

  /* ---------- SHELL ---------- */
  function render() {
    applyTheme();
    var seo = document.getElementById('seo-i18n');
    if (seo) {
      try {
        var pack = JSON.parse(seo.textContent)[lang];
        if (pack) { document.title = pack.title; var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', pack.description); }
      } catch (e) {}
    }
    document.documentElement.lang = lang;

    var app = document.getElementById('app');
    var body = {
      clients: renderClients,
      products: renderProducts,
      suppliers: renderSuppliers,
      finance: renderFinance,
      logistics: renderLogistics,
      sales: renderSales
    }[state.section]();

    app.innerHTML =
      '<div class="demo-outer"><div class="dashboard" id="dashRoot">' +
      '<aside class="rail" aria-label="Sections">' +
      '<button type="button" class="rail-brand" title="' + esc(T.company) + '">' + ICONS.brand + '</button>' +
      '<div class="rail-tabs">' + SECTIONS.map(function (id) {
        return '<button type="button" class="rail-tab" data-section="' + id + '" aria-pressed="' + (state.section === id) + '" aria-label="' + esc(T.sections[id].eyebrow) + '">' + ICONS[id] + '<span class="tip">' + esc(T.sections[id].eyebrow) + '</span></button>';
      }).join('') + '</div></aside>' +
      '<div class="dashboard-main">' +
      '<div class="dashboard-toolbar">' +
      '<div class="window-dots" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '<div class="toolbar-center"><b>' + esc(T.company) + '</b><span>·</span><span>' + (lang === 'ru' ? 'оптово-розничная торговля' : 'wholesale & retail') + '</span><span>·</span><span class="tb-date">' + esc(fmtBaseDate()) + '</span></div>' +
      '<div class="toolbar-actions">' +
      '<span class="demo-chip"><i></i>' + esc(T.demoChip) + '</span>' +
      '<button type="button" class="theme-btn" data-theme-toggle title="' + (state.theme === 'dark' ? (lang === 'ru' ? 'Светлая тема' : 'Light theme') : (lang === 'ru' ? 'Тёмная тема' : 'Dark theme')) + '">' + (state.theme === 'dark' ? ICONS.sun : ICONS.moon) + '</button>' +
      '<button type="button" class="expand-btn" data-fullscreen title="Fullscreen">' + ICONS.expand + '</button>' +
      '</div></div>' +
      '<div class="dash-content">' + body + '</div></div></div>' +
      '<p class="demo-caption"><strong>' + esc(T.demoNote) + '</strong> · analyticsbuild.com / dashboards/retail</p></div>';
    if (state.section === 'clients') {
      requestAnimationFrame(function () { mountClientMap(); });
    }
  }

  function setSection(id) {
    state.section = id;
    location.hash = id;
    render();
  }

  document.addEventListener('click', function (e) {
    var cell = e.target.closest('td[data-filter-val]');
    if (cell) {
      var table = cell.closest('table[data-table]');
      if (table) {
        var tid = table.getAttribute('data-table');
        var val = cell.getAttribute('data-filter-val');
        state.tableFilters[tid] = { value: val, label: val };
        e.preventDefault();
        render();
        return;
      }
    }

    var t = e.target.closest('[data-section],[data-period],[data-currency],[data-theme-toggle],[data-fullscreen],[data-map-top],[data-toggle-overdue],[data-client-view],[data-disc-metric],[data-disc-tab],[data-client],[data-expand-cat],[data-psort],[data-abc-cell],[data-abc-axis],[data-sup-tab],[data-supplier],[data-sabc],[data-budget-h],[data-income-h],[data-set-wh],[data-sales-metric],[data-manager],[data-new-hz],[data-legend],[data-sku],[data-reset-table]');
    if (!t) return;
    if (t.hasAttribute('data-section')) setSection(t.getAttribute('data-section'));
    else if (t.hasAttribute('data-period')) { state.period = +t.getAttribute('data-period'); render(); }
    else if (t.hasAttribute('data-currency')) { state.currency = state.currency === 'USD' ? 'RUB' : 'USD'; render(); }
    else if (t.hasAttribute('data-theme-toggle')) { state.theme = state.theme === 'dark' ? 'light' : 'dark'; render(); }
    else if (t.hasAttribute('data-fullscreen')) {
      var root = document.getElementById('dashRoot');
      if (!document.fullscreenElement) root.requestFullscreen && root.requestFullscreen();
      else document.exitFullscreen && document.exitFullscreen();
    }
    else if (t.hasAttribute('data-reset-table')) {
      delete state.tableFilters[t.getAttribute('data-reset-table')];
      render();
    }
    else if (t.hasAttribute('data-map-top')) { state.mapTopN = +t.getAttribute('data-map-top'); render(); }
    else if (t.hasAttribute('data-toggle-overdue')) { state.mapOverdueOnly = !state.mapOverdueOnly; render(); }
    else if (t.hasAttribute('data-client-view')) { state.clientView = t.getAttribute('data-client-view'); render(); }
    else if (t.hasAttribute('data-disc-metric')) { state.disciplineMetric = t.getAttribute('data-disc-metric'); render(); }
    else if (t.hasAttribute('data-disc-tab')) { state.disciplineTab = t.getAttribute('data-disc-tab'); render(); }
    else if (t.hasAttribute('data-client')) { state.selectedClient = t.getAttribute('data-client'); render(); }
    else if (t.hasAttribute('data-expand-cat')) {
      var id = t.getAttribute('data-expand-cat');
      state.expandedCats[id] = !state.expandedCats[id];
      render();
    }
    else if (t.hasAttribute('data-psort')) { state.productSort = t.getAttribute('data-psort'); render(); }
    else if (t.hasAttribute('data-abc-cell')) { state.abcCell = t.getAttribute('data-abc-cell'); render(); }
    else if (t.hasAttribute('data-abc-axis')) { state.abcAxis = t.getAttribute('data-abc-axis'); render(); }
    else if (t.hasAttribute('data-sup-tab')) { state.supplierTab = t.getAttribute('data-sup-tab'); render(); }
    else if (t.hasAttribute('data-supplier')) { state.selectedSupplier = t.getAttribute('data-supplier'); render(); }
    else if (t.hasAttribute('data-sabc')) { state.abcCell = 's' + t.getAttribute('data-sabc'); render(); }
    else if (t.hasAttribute('data-budget-h')) { state.budgetHorizon = +t.getAttribute('data-budget-h'); render(); }
    else if (t.hasAttribute('data-income-h')) { state.incomeHorizon = +t.getAttribute('data-income-h'); render(); }
    else if (t.hasAttribute('data-set-wh')) { state.warehouse = t.getAttribute('data-set-wh'); render(); }
    else if (t.hasAttribute('data-sales-metric')) { state.salesMetric = t.getAttribute('data-sales-metric'); render(); }
    else if (t.hasAttribute('data-manager')) {
      var mid = t.getAttribute('data-manager');
      state.expandedManager = state.expandedManager === mid ? null : mid;
      render();
    }
    else if (t.hasAttribute('data-new-hz')) { state.newClientHorizon = t.getAttribute('data-new-hz'); render(); }
    else if (t.hasAttribute('data-legend')) {
      var key = t.getAttribute('data-legend'), seg = t.getAttribute('data-seg');
      state.legendOff[key] = state.legendOff[key] || {};
      state.legendOff[key][seg] = !state.legendOff[key][seg];
      render();
    }
    else if (t.hasAttribute('data-sku')) {
      var skuId = t.getAttribute('data-sku');
      var p = D.products.find(function (x) { return x.id === skuId; });
      if (p) { state.productSearch = p.sku; state.section = 'products'; location.hash = 'products'; render(); }
    }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('[data-filter="warehouse"]')) { state.warehouse = t.value; render(); }
    else if (t.matches('[data-filter="channel"]')) { state.channel = t.value; render(); }
    else if (t.matches('[data-filter="supplier"]')) { state.selectedSupplier = t.value; render(); }
  });

  document.addEventListener('input', function (e) {
    if (e.target.matches('[data-product-search]')) {
      state.productSearch = e.target.value;
      clearTimeout(window.__retailSearchT);
      window.__retailSearchT = setTimeout(render, 220);
    }
  });

  window.addEventListener('hashchange', function () {
    var id = (location.hash || '#clients').replace('#', '');
    if (SECTIONS.indexOf(id) >= 0 && id !== state.section) { state.section = id; render(); }
  });

  applyTheme();
  render();
})();
