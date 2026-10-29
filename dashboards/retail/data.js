/* «СетьСклад Опт» - retail/wholesale demo dataset. Synthetic, seeded, fictional.
   Language comes from <html lang>, set by ../_shared/geo-locale.js before this file. */
(function (global) {
  'use strict';
  var EN = typeof document !== 'undefined' && document.documentElement.lang === 'en';
  function L(ru, en) { return EN ? en : ru; }

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var rnd = mulberry32(0x5E7C0DE);
  function r(a, b) { return a + rnd() * (b - a); }
  function ri(a, b) { return Math.floor(r(a, b + 1)); }
  function pick(arr) { return arr[ri(0, arr.length - 1)]; }
  function spark(n, base, vol) {
    var out = [], v = base;
    for (var i = 0; i < n; i++) { v = Math.max(0, v + r(-vol, vol)); out.push(+v.toFixed(2)); }
    return out;
  }

  var BASE_DATE = '2026-10-28';
  var USD_RATE = 92;

  var RC = [
    { id: 'msk', name: L('РЦ Москва', 'DC Rotterdam'), nameEn: 'DC Rotterdam', lat: 55.7558, lon: 37.6173 },
    { id: 'spb', name: L('Склад СПб', 'WH Hamburg'), nameEn: 'WH Hamburg', lat: 59.9311, lon: 30.3609 },
    { id: 'kzn', name: L('Склад Казань', 'WH Lyon'), nameEn: 'WH Lyon', lat: 55.7961, lon: 49.1064 }
  ];

  var CATEGORIES = [
    { id: 'fmcg', name: L('FMCG / бакалея', 'FMCG / grocery'), nameEn: 'FMCG / grocery' },
    { id: 'house', name: L('Хозтовары', 'Household'), nameEn: 'Household' },
    { id: 'bev', name: L('Напитки', 'Beverages'), nameEn: 'Beverages' },
    { id: 'care', name: L('Гигиена', 'Personal care'), nameEn: 'Personal care' },
    { id: 'pet', name: L('Зоотовары', 'Pet supplies'), nameEn: 'Pet supplies' },
    { id: 'pack', name: L('Упаковка', 'Packaging'), nameEn: 'Packaging' }
  ];

  var SUPPLIER_NAMES = EN ? [
    'AgriTrade', 'NordPack', 'RhineTrade', 'AlpineFood', 'MegaHome',
    'BalticDrinks', 'CleanLine', 'PetLine', 'EuroPack', 'SouthWholesale',
    'CentralStock', 'TimberTrade'
  ] : [
    'АгроОпт', 'НордПак', 'ВолгаТрейд', 'СибирьФуд', 'МегаХоз',
    'БалтикДринк', 'ЧистоЛайн', 'ПетЛайн', 'УралПак', 'ЮгОпт',
    'ЦентрСток', 'ЛесПромТорг'
  ];
  var suppliers = SUPPLIER_NAMES.map(function (name, i) {
    return { id: 's' + (i + 1), name: name, abc: 'C', xyz: 'Z' };
  });

  var managers = [
    { id: 'm1', name: L('Ирина Соколова', 'Emma Fischer') },
    { id: 'm2', name: L('Алексей Орлов', 'Lucas Martin') },
    { id: 'm3', name: L('Мария Ким', 'Sophie Laurent') },
    { id: 'm4', name: L('Дмитрий Волков', 'Daniel Becker') },
    { id: 'm5', name: L('Елена Панина', 'Olivia Turner') },
    { id: 'm6', name: L('Павел Жуков', 'Marco Rossi') }
  ];

  var CLIENT_NAMES = EN ? [
    'Bloom Market', 'Northgate Hyper', 'Daisy Store', 'Polaris Hyper',
    'Corner Fresh', 'Rowan Supermarket', 'Cornflower Shop', 'City Hypermarket',
    'Maple Store', 'Swallow Trading', 'Snowdrop Shop', 'Orion Hyper',
    'Lilac Store', 'Avenue Super', 'Forget-me-not', 'Quarter Hypermarket',
    'Iris Shop', 'Droplet Chain', 'Aster Store', 'Meridian Hyper',
    'Peony Shop', 'Birch Supermarket', 'Tulip Store', 'Eastside Hypermarket',
    'Gladiolus Shop', 'Homely Hardware', 'Mimosa Store', 'Park Hyper',
    'Chrysanthemum Shop', 'Sunrise Super', 'Violet Store', 'Line Hypermarket',
    'Dahlia Shop', 'Northern Mall', 'Lily Store', 'Boulevard Hyper',
    'Narcissus Shop', 'Keystone Supermarket', 'Poppy Store', 'Square Hypermarket',
    'Bluebell Shop', 'Fresh Pantry', 'Columbine Store', 'Centre Hyper',
    'Periwinkle Shop', 'Ray Super', 'Phlox Store', 'Home Hypermarket'
  ] : [
    'Магазин «Лютик»', 'Гипермаркет «Ваши»', 'Магазин «Ромашка»', 'Гипер «Север»',
    'Магазин «Одуванчик»', 'Супермаркет «Рябина»', 'Магазин «Василёк»', 'Гипермаркет «Город»',
    'Магазин «Калина»', 'Торговый дом «Ласточка»', 'Магазин «Подснежник»', 'Гипер «Орион»',
    'Магазин «Сирень»', 'Супер «Аллея»', 'Магазин «Незабудка»', 'Гипермаркет «Квартал»',
    'Магазин «Ирис»', 'Сеть «Капля»', 'Магазин «Астра»', 'Гипер «Меридиан»',
    'Магазин «Пион»', 'Супермаркет «Берёзка»', 'Магазин «Тюльпан»', 'Гипермаркет «Восток»',
    'Магазин «Гладиолус»', 'Хозмаркет «Уют»', 'Магазин «Мимоза»', 'Гипер «Парк»',
    'Магазин «Хризантема»', 'Супер «Рассвет»', 'Магазин «Фиалка»', 'Гипермаркет «Линия»',
    'Магазин «Георгин»', 'ТК «Северный»', 'Магазин «Ландыш»', 'Гипер «Проспект»',
    'Магазин «Нарцисс»', 'Супермаркет «Ключ»', 'Магазин «Мак»', 'Гипермаркет «Площадь»',
    'Магазин «Колокольчик»', 'Лавка «Свежесть»', 'Магазин «Аквилегия»', 'Гипер «Центр»',
    'Магазин «Барвинок»', 'Супер «Луч»', 'Магазин «Флокс»', 'Гипермаркет «Дом»'
  ];

  function clientPoint(baseLat, baseLon, km) {
    var ang = r(0, Math.PI * 2);
    var dlat = (km / 111) * Math.cos(ang);
    var dlon = (km / (111 * Math.cos(baseLat * Math.PI / 180))) * Math.sin(ang);
    return { lat: +(baseLat + dlat).toFixed(4), lon: +(baseLon + dlon).toFixed(4), km: Math.round(km) };
  }

  var clients = [];
  var clientLedger = [];
  for (var ci = 0; ci < 48; ci++) {
    var rc = RC[ci % 3];
    var dist = r(12, 380);
    var pts = [];
    var nPts = ri(1, 4);
    for (var p = 0; p < nPts; p++) {
      var pt = clientPoint(rc.lat, rc.lon, dist * r(0.85, 1.15));
      pt.address = rc.name + L(' · зона ', ' · zone ') + Math.round(pt.km) + L(' км', ' km');
      pts.push(pt);
    }
    var payStatus = rnd() < 0.62 ? 'ok' : (rnd() < 0.55 ? 'soon' : 'overdue');
    var turnover = Math.round(r(180000, 4200000));
    var marginPct = +r(14, 32).toFixed(1);
    var paidOnTimePct = payStatus === 'ok' ? r(88, 99) : (payStatus === 'soon' ? r(70, 88) : r(35, 68));
    var avgPayDays = payStatus === 'ok' ? r(8, 22) : (payStatus === 'soon' ? r(20, 35) : r(32, 55));
    var owed = Math.round(turnover * r(0.04, 0.22));
    var overdueAmount = payStatus === 'overdue' ? Math.round(owed * r(0.35, 0.9)) : (payStatus === 'soon' ? Math.round(owed * r(0, 0.15)) : 0);
    var dueInDays = payStatus === 'overdue' ? -ri(3, 28) : (payStatus === 'soon' ? ri(1, 7) : ri(8, 30));
    var channel = pick(['opt', 'retail', 'own']);
    var c = {
      id: 'c' + (ci + 1),
      name: CLIENT_NAMES[ci % CLIENT_NAMES.length] + (ci >= CLIENT_NAMES.length ? ' ' + (ci + 1) : ''),
      points: pts,
      managerId: managers[ci % managers.length].id,
      paymentTermsDays: pick([7, 14, 21, 30, 45]),
      rcId: rc.id,
      channel: channel,
      turnover: turnover,
      marginPct: marginPct,
      payStatus: payStatus,
      paidOnTimePct: +paidOnTimePct.toFixed(1),
      avgPayDays: +avgPayDays.toFixed(1),
      distKm: Math.round(Math.min.apply(null, pts.map(function (x) { return x.km; }))),
      spark: spark(12, turnover / 12, turnover / 40)
    };
    clients.push(c);
    clientLedger.push({
      clientId: c.id,
      paid: Math.round(turnover * r(0.7, 0.95)),
      owed: owed,
      overdueAmount: overdueAmount,
      dueInDays: dueInDays,
      nextPayDate: dueInDays < 0
        ? '2026-10-' + String(28 + dueInDays).padStart(2, '0')
        : (dueInDays <= 3 ? '2026-10-31' : '2026-11-' + String(Math.min(28, dueInDays)).padStart(2, '0'))
    });
  }

  var PRODUCT_STEMS = EN ? [
    ['Premium flour 2kg', 'Long-grain rice 1kg', 'Granulated sugar 1kg', 'Sunflower oil 1L', 'Buckwheat 900g', 'Spaghetti 450g'],
    ['Floor cleaner 1L', 'Household gloves', 'Bin bags 30L', 'All-purpose brush', 'Kitchen sponges 5pk', 'Glass cleaner'],
    ['Still water 1.5L', 'Apple juice 1L', 'Classic lemonade 0.5L', 'Black tea 100 bags', 'Ground coffee 250g', 'Energy drink 0.45L'],
    ['Liquid soap 500ml', 'Shampoo 400ml', 'Toothpaste 100ml', 'Wet wipes 80pk', 'Shower gel 250ml', 'Deodorant 150ml'],
    ['Dry pet food 2kg', 'Cat litter 5L', 'Pet treats 100g', 'Plastic bowl', 'Collar M', 'Toy ball'],
    ['LDPE bag 30×40', 'Stretch film', 'Carton box S', 'Packing tape 48mm', 'Thermal label', 'PP strap']
  ] : [
    ['Мука высший сорт 2кг', 'Рис длиннозёрный 1кг', 'Сахар песок 1кг', 'Масло подсолнечное 1л', 'Крупа гречневая 900г', 'Макароны спагетти 450г'],
    ['Средство для пола 1л', 'Перчатки хозяйственные', 'Мешки для мусора 30л', 'Щётка универсальная', 'Губки кухонные 5шт', 'Средство для стёкол'],
    ['Вода негаз. 1.5л', 'Сок яблочный 1л', 'Лимонад классик 0.5л', 'Чай чёрный 100пак', 'Кофе молотый 250г', 'Энергетик 0.45л'],
    ['Мыло жидкое 500мл', 'Шампунь 400мл', 'Зубная паста 100мл', 'Салфетки влажные 80шт', 'Гель для душа 250мл', 'Дезодорант 150мл'],
    ['Корм сухой 2кг', 'Наполнитель 5л', 'Лакомство 100г', 'Миска пластик', 'Ошейник M', 'Игрушка мяч'],
    ['Пакет ПВД 30×40', 'Стретч-плёнка', 'Коробка картон S', 'Скотч 48мм', 'Этикетка термо', 'Лента ПП']
  ];
  var products = [];
  var offerPrices = [];
  var sku = 10000;
  CATEGORIES.forEach(function (cat, cix) {
    var stems = PRODUCT_STEMS[cix];
    for (var i = 0; i < 14; i++) {
      var stockDays = rnd() < 0.12 ? ri(0, 6) : (rnd() < 0.18 ? ri(65, 140) : ri(10, 55));
      var dailySales = +(r(2, 85)).toFixed(1);
      var stockQty = stockDays === 0 ? 0 : Math.round(dailySales * stockDays);
      var turnover = Math.round(dailySales * 30 * r(80, 420));
      var marginPct = +r(12, 38).toFixed(1);
      var cv = r(0.04, 0.42);
      var xyz = cv < 0.1 ? 'X' : (cv < 0.25 ? 'Y' : 'Z');
      var abc = 'C';
      var id = 'p' + products.length;
      var name = stems[i % stems.length] + (i >= stems.length ? ' #' + (i + 1) : '');
      var prod = {
        id: id,
        sku: 'SS-' + (sku++),
        name: name,
        categoryId: cat.id,
        stockQty: stockQty,
        stockDays: stockDays,
        dailySales: dailySales,
        marginPct: marginPct,
        turnover: turnover,
        abc: abc,
        xyz: xyz,
        cv: +cv.toFixed(3),
        recommendation: stockDays > 60 ? pick(EN ? ['stop buying', 'promo', 'return to supplier'] : ['стоп-закуп', 'акция', 'возврат поставщику']) : null,
        orderStatus: stockDays < 7 ? pick(EN ? ['in transit', 'order placed', 'urgent'] : ['в пути', 'заказ создан', 'срочно']) : '-'
      };
      products.push(prod);
      var nOffers = ri(2, 4);
      var prices = [];
      for (var o = 0; o < nOffers; o++) {
        prices.push({
          productId: id,
          supplierId: suppliers[(cix * 2 + o) % suppliers.length].id,
          price: Math.round(r(45, 890)),
          leadTimeDays: ri(2, 21)
        });
      }
      prices.sort(function (a, b) { return a.price - b.price; });
      offerPrices = offerPrices.concat(prices);
    }
  });

  // ABC by turnover
  products.sort(function (a, b) { return b.turnover - a.turnover; });
  var totTurn = products.reduce(function (s, p) { return s + p.turnover; }, 0);
  var acc = 0;
  products.forEach(function (p) {
    acc += p.turnover;
    var share = acc / totTurn;
    p.abc = share <= 0.8 ? 'A' : (share <= 0.95 ? 'B' : 'C');
  });
  products.sort(function (a, b) { return a.sku.localeCompare(b.sku); });

  var purchases = [];
  var supplierDebt = [];
  suppliers.forEach(function (s, i) {
    var purchaseAmt = Math.round(r(800000, 4500000));
    var marginPct = +r(15, 28).toFixed(1);
    var weOwe = Math.round(purchaseAmt * r(0.08, 0.35));
    var theyOwe = i % 5 === 0 ? Math.round(r(20000, 180000)) : 0;
    var overdueDays = rnd() < 0.25 ? ri(5, 40) : 0;
    s.purchaseAmt = purchaseAmt;
    s.marginPct = marginPct;
    s.marginRub = Math.round(purchaseAmt * marginPct / 100);
    s.paid = Math.round(purchaseAmt * r(0.55, 0.92));
    s.share = 0;
    supplierDebt.push({ supplierId: s.id, weOwe: weOwe, theyOwe: theyOwe, overdueDays: overdueDays });
    CATEGORIES.forEach(function (cat) {
      if (rnd() < 0.55) {
        purchases.push({
          supplierId: s.id,
          categoryId: cat.id,
          amount: Math.round(purchaseAmt * r(0.08, 0.35)),
          marginPct: +r(14, 30).toFixed(1),
          skuCount: ri(4, 28)
        });
      }
    });
  });
  var purchTot = suppliers.reduce(function (s, x) { return s + x.purchaseAmt; }, 0);
  suppliers.forEach(function (s) { s.share = +(s.purchaseAmt / purchTot * 100).toFixed(1); });
  // supplier ABC/XYZ
  suppliers.sort(function (a, b) { return b.purchaseAmt - a.purchaseAmt; });
  var sAcc = 0, sTot = purchTot;
  suppliers.forEach(function (s) {
    sAcc += s.purchaseAmt;
    var share = sAcc / sTot;
    s.abc = share <= 0.8 ? 'A' : (share <= 0.95 ? 'B' : 'C');
    var cv = r(0.05, 0.4);
    s.xyz = cv < 0.1 ? 'X' : (cv < 0.25 ? 'Y' : 'Z');
    s.cv = +cv.toFixed(3);
  });

  var months = ['2025-11','2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10'];
  var monthLabels = EN ? ['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'] : ['Ноя','Дек','Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт'];
  var financeMonthly = months.map(function (m, i) {
    var turnover = Math.round(r(45e6, 62e6) * (0.92 + i * 0.012));
    var marginPct = +r(20.5, 24.8).toFixed(1);
    var profit = Math.round(turnover * marginPct / 100 * r(0.32, 0.42));
    return {
      month: m,
      label: monthLabels[i],
      turnover: turnover,
      marginPct: marginPct,
      profit: profit,
      cashflow: Math.round(profit * r(0.35, 0.7) * (rnd() > 0.2 ? 1 : -0.4)),
      planIncome: Math.round(turnover * r(0.94, 1.06)),
      planExpense: {
        procurement: Math.round(turnover * 0.58),
        arCollection: Math.round(turnover * 0.12),
        payroll: Math.round(r(2.8e6, 3.6e6)),
        taxes: Math.round(r(1.1e6, 1.8e6)),
        loans: Math.round(r(0.6e6, 1.2e6))
      },
      factExpense: {},
      incomeByChannel: {
        opt: Math.round(turnover * r(0.48, 0.58)),
        retail: Math.round(turnover * r(0.22, 0.3)),
        own: Math.round(turnover * r(0.12, 0.18)),
        other: Math.round(turnover * r(0.02, 0.06))
      }
    };
  });
  financeMonthly.forEach(function (f) {
    var pe = f.planExpense;
    f.factExpense = {
      procurement: Math.round(pe.procurement * r(0.96, 1.08)),
      arCollection: Math.round(pe.arCollection * r(0.72, 0.92)),
      payroll: Math.round(pe.payroll * r(0.98, 1.04)),
      taxes: Math.round(pe.taxes * r(0.95, 1.05)),
      loans: Math.round(pe.loans * r(0.99, 1.01))
    };
  });

  // Dense weekly series for turnover / margin / profit charts (52 weeks ≈ 12 months)
  var financeWeekly = [];
  var weekLabels = [];
  var baseTurn = 11.2e6;
  for (var wi = 0; wi < 52; wi++) {
    var wTurn = Math.round(baseTurn * (0.88 + wi * 0.0045) * r(0.93, 1.08));
    var wMarg = +r(20.2, 24.9).toFixed(1);
    var wProfit = Math.round(wTurn * wMarg / 100 * r(0.33, 0.42));
    var weekNo = wi + 1;
    var lab = 'W' + weekNo;
    if (wi >= 40) lab = (EN ? ['Sep','Oct'] : ['Сен','Окт'])[wi >= 48 ? 1 : 0] + '·' + ((wi % 4) + 1);
    financeWeekly.push({
      week: weekNo,
      label: lab,
      turnover: wTurn,
      marginPct: wMarg,
      profit: wProfit,
      plan: Math.round(wTurn * r(0.95, 1.04))
    });
  }

  // Expense budget: выполнено / предстоит (prepare cash)
  var expenseBudget = [
    { id: 'procurement', name: 'Закупки', nameEn: 'Procurement', total: 30400000, done: 18600000, upcoming: 11800000, dueDate: '2026-11-05' },
    { id: 'arCollection', name: 'Сбор дебиторки', nameEn: 'AR collection', total: 6200000, done: 5020000, upcoming: 1180000, dueDate: '2026-10-31' },
    { id: 'payroll', name: 'Зарплата', nameEn: 'Payroll', total: 3400000, done: 1700000, upcoming: 1700000, dueDate: '2026-11-10' },
    { id: 'taxes', name: 'Налоги', nameEn: 'Taxes', total: 1600000, done: 800000, upcoming: 800000, dueDate: '2026-11-15' },
    { id: 'loans', name: 'Кредиты / займы', nameEn: 'Loans', total: 980000, done: 490000, upcoming: 490000, dueDate: '2026-11-03' }
  ];

  // Income budget: собрано / ещё поступит - timing aligned with expense due dates
  var incomeBudget = [
    { id: 'opt', name: 'Опт', nameEn: 'Wholesale', total: 28600000, collected: 19400000, toCollect: 9200000, availableBy: '2026-11-03' },
    { id: 'retail', name: 'Розница', nameEn: 'Retail', total: 13800000, collected: 10200000, toCollect: 3600000, availableBy: '2026-11-05' },
    { id: 'own', name: 'Собственная сеть', nameEn: 'Own network', total: 7200000, collected: 5400000, toCollect: 1800000, availableBy: '2026-11-10' },
    { id: 'other', name: 'Прочее', nameEn: 'Other', total: 1800000, collected: 1100000, toCollect: 700000, availableBy: '2026-11-15' }
  ];

  var arApAging = [
    { side: 'ar', bucket: '0-30', amount: 4800000, counterparties: [] },
    { side: 'ar', bucket: '31-60', amount: 2100000, counterparties: [] },
    { side: 'ar', bucket: '61-90', amount: 900000, counterparties: [] },
    { side: 'ar', bucket: '90+', amount: 520000, counterparties: [] },
    { side: 'ap', bucket: '0-30', amount: 6100000, counterparties: [] },
    { side: 'ap', bucket: '31-60', amount: 3400000, counterparties: [] },
    { side: 'ap', bucket: '61-90', amount: 1800000, counterparties: [] },
    { side: 'ap', bucket: '90+', amount: 1100000, counterparties: [] }
  ];
  clients.slice(0, 12).forEach(function (c, i) {
    var bucket = ['0-30', '31-60', '61-90', '90+'][i % 4];
    var row = arApAging.find(function (x) { return x.side === 'ar' && x.bucket === bucket; });
    row.counterparties.push({ name: c.name, amount: Math.round(c.turnover * 0.08) });
  });
  suppliers.slice(0, 12).forEach(function (s, i) {
    var bucket = ['0-30', '31-60', '61-90', '90+'][i % 4];
    var row = arApAging.find(function (x) { return x.side === 'ap' && x.bucket === bucket; });
    var d = supplierDebt.find(function (x) { return x.supplierId === s.id; });
    row.counterparties.push({ name: s.name, amount: d ? d.weOwe : 100000 });
  });

  var DRIVERS = EN ? ['Smith A.', 'Müller J.', 'Dubois P.', 'Novak T.', 'Jansen D.', 'Weber S.'] : ['Смирнов А.', 'Козлов И.', 'Фёдоров П.', 'Никитин В.', 'Морозов Д.', 'Белов С.'];
  var VEHICLES = EN ? ['NL 12-ABC-3', 'HH-KL 456', 'FR-789-TU', 'NL 23-XKL-4', 'HH-RS 567', 'FR-890-UK'] : ['А123ВС 777', 'К456ОР 178', 'М789ТУ 116', 'Н234ЕК 50', 'Р567ХА 16', 'С890УК 716'];
  var fleetTrips = [];
  for (var t = 0; t < 42; t++) {
    var day = 28 - (t % 28);
    var km = ri(45, 420);
    var cost = Math.round(km * r(28, 55) + r(2000, 8000));
    fleetTrips.push({
      id: 'tr' + (t + 1),
      date: '2026-10-' + String(Math.max(1, day)).padStart(2, '0'),
      vehicle: VEHICLES[t % VEHICLES.length],
      driver: DRIVERS[t % DRIVERS.length],
      from: RC[t % 3].name,
      to: pick(clients).name,
      points: ri(2, 9),
      km: km,
      cost: cost,
      rcId: RC[t % 3].id
    });
  }

  var pickers = [
    { name: L('Анна Громова', 'Anna Schmidt'), assemblies: 412, linesPerHour: 86, errorPct: 0.4, load: 0.92 },
    { name: L('Игорь Савельев', 'Thomas Klein'), assemblies: 388, linesPerHour: 79, errorPct: 0.8, load: 1.08 },
    { name: L('Ольга Рыбакова', 'Claire Moreau'), assemblies: 356, linesPerHour: 74, errorPct: 0.3, load: 0.85 },
    { name: L('Кирилл Дорохов', 'Jan de Vries'), assemblies: 341, linesPerHour: 71, errorPct: 1.2, load: 1.15 },
    { name: L('Наталья Ежова', 'Laura Bianchi'), assemblies: 298, linesPerHour: 68, errorPct: 0.5, load: 0.78 },
    { name: L('Роман Титов', 'Ryan Cooper'), assemblies: 275, linesPerHour: 64, errorPct: 0.9, load: 0.95 }
  ];

  var stockByRc = [
    { rcId: 'msk', value: 41200000, sku: 3180, stockDays: 28, share: 48.6 },
    { rcId: 'spb', value: 24800000, sku: 2140, stockDays: 34, share: 29.3 },
    { rcId: 'kzn', value: 18700000, sku: 1620, stockDays: 47, share: 22.1 }
  ];

  var managerStats = managers.map(function (m, i) {
    var turnover = Math.round(r(4.5e6, 9.5e6));
    var profit = Math.round(turnover * r(0.08, 0.14));
    return {
      managerId: m.id,
      turnover: turnover,
      profit: profit,
      marginPct: +(profit / turnover * 100).toFixed(1),
      clients: ri(18, 42),
      calls: ri(220, 420),
      callsIn: ri(40, 90),
      callsOut: ri(160, 320),
      callSuccessPct: +r(58, 82).toFixed(1),
      trips: ri(28, 62),
      tripKm: ri(900, 2400),
      newClients: { d7: ri(0, 3), m1: ri(3, 9), m3: ri(8, 18), m6: ri(14, 28), m12: ri(22, 45) },
      newClientsTurnover: Math.round(r(0.4e6, 2.2e6)),
      conversion: +r(12, 34).toFixed(1),
      spark: spark(6, turnover / 6, turnover / 25),
      funnel: { leads: ri(40, 90), meetings: ri(18, 40), firstShip: ri(6, 18) }
    };
  });

  // boost two managers for insight
  managerStats[1].newClients = { d7: 2, m1: 8, m3: 16, m6: 24, m12: 38 };
  managerStats[2].newClients = { d7: 3, m1: 9, m3: 15, m6: 22, m12: 35 };
  managerStats[1].calls = 210;
  managerStats[2].calls = 195;

  var zoneDonut = [
    { id: 'z0', name: L('0-50 км', '0-50 km'), value: 12.4e6, color: '#6e96ff' },
    { id: 'z1', name: '50-150', value: 18.6e6, color: '#8f79e5' },
    { id: 'z2', name: '150-300', value: 11.2e6, color: '#f0a66c' },
    { id: 'z3', name: '300+', value: 6.4e6, color: '#53cbb8' }
  ];

  var periodScale = { 1: 1, 3: 2.85, 6: 5.5, 12: 10.8 };

  var i18n = {
    ru: {
      company: 'СетьСклад Опт',
      demoChip: 'ДЕМО-ДАШБОРД',
      demoNote: 'Все данные вымышленные',
      currency: '₽',
      sections: {
        clients: { eyebrow: 'Клиенты', title: 'Клиентская сеть и платежи', desc: 'Точки, оборот, дисциплина оплаты и дебиторка клиентов' },
        products: { eyebrow: 'Товары', title: 'Ассортимент, маржа и остатки', desc: 'Средняя маржа, дерево категория→товар, излишки, дефицит, ABC/XYZ и цены поставщиков' },
        suppliers: { eyebrow: 'Поставщики', title: 'Закупки, маржа и расчёты', desc: 'Оборот, маржа, долги и структура по категориям' },
        finance: { eyebrow: 'Финансы', title: 'Деньги, бюджеты и прибыль', desc: 'Дебиторка/кредиторка, бюджеты и динамика прибыли' },
        logistics: { eyebrow: 'Логистика и склад', title: 'Остатки, доставка и сборка', desc: 'Стоимость остатков, доставка и сборка' },
        sales: { eyebrow: 'Продажи · CRM', title: 'Менеджеры, активность и новые клиенты', desc: 'Менеджеры, звонки, визиты и новые клиенты · зависит от CRM' }
      },
      periods: { 1: '1 мес', 3: '3 мес', 6: '6 мес', 12: '12 мес', 7: '7 дн' },
      warehouses: { all: 'Все склады', msk: 'РЦ Москва', spb: 'Склад СПб', kzn: 'Склад Казань' },
      channels: { all: 'Все', opt: 'Опт', retail: 'Розница', own: 'Собственная сеть' },
      vsPrior: 'к пред. периоду'
    },
    en: {
      company: 'NetStock Wholesale',
      demoChip: 'DEMO DASHBOARD',
      demoNote: 'All data is fictional',
      currency: '$',
      sections: {
        clients: { eyebrow: 'Clients', title: 'Client network & payments', desc: 'Outlets, turnover, payment discipline and client receivables' },
        products: { eyebrow: 'Products', title: 'Assortment, margin & stock', desc: 'Margin, category→SKU tree, surplus, deficit, ABC/XYZ and supplier prices' },
        suppliers: { eyebrow: 'Suppliers', title: 'Purchases, margin & settlements', desc: 'Turnover, margin, debts and category mix' },
        finance: { eyebrow: 'Finance', title: 'Cash, budgets & profit', desc: 'AR/AP, budgets and profit dynamics' },
        logistics: { eyebrow: 'Logistics & warehouse', title: 'Stock, delivery & picking', desc: 'Stock value, delivery and picking' },
        sales: { eyebrow: 'Sales · CRM', title: 'Managers, activity & new clients', desc: 'Managers, calls, visits and new clients · CRM-dependent' }
      },
      periods: { 1: '1 mo', 3: '3 mo', 6: '6 mo', 12: '12 mo', 7: '7 d' },
      warehouses: { all: 'All warehouses', msk: 'DC Rotterdam', spb: 'WH Hamburg', kzn: 'WH Lyon' },
      channels: { all: 'All', opt: 'Wholesale', retail: 'Retail', own: 'Own network' },
      vsPrior: 'vs prior period'
    }
  };

  var insights = {
    clients: '3 клиента дают 28% оборота и 41% просрочки - проверьте лимиты отсрочки и визиты менеджеров.',
    products: '12% SKU в зоне CZ держат 31% стоимости склада - кандидаты на сокращение ассортимента.',
    suppliers: 'Поставщик «АгроОпт» - 9% закупок и 18% просрочки нашего долга: сдвиньте график оплат или пересмотрите отсрочку.',
    finance: 'План закупок выполнен на 104%, сбор дебиторки - на 81%: кассовый разрыв в конце месяца.',
    logistics: 'Склад Казань держит 22% стоимости остатков при 9% оборота - пересмотрите страховой запас.',
    sales: 'У двух менеджеров 61% новых клиентов за квартал и только 22% звонков - масштабируйте их скрипт, а не только холодный обзвон.'
  };
  var insightsEn = {
    clients: '3 clients bring 28% of turnover and 41% of overdue debt - review their credit limits and manager visits.',
    products: '12% of SKUs in the CZ zone hold 31% of stock value - candidates for cutting the range.',
    suppliers: 'Supplier AgriTrade is 9% of purchases but 18% of our overdue debt: shift the payment schedule or renegotiate terms.',
    finance: 'Purchasing plan is at 104%, receivables collection only at 81%: expect a cash gap at month end.',
    logistics: 'WH Lyon holds 22% of stock value with only 9% of turnover - review the safety stock.',
    sales: 'Two managers bring 61% of new clients this quarter with only 22% of calls - scale their script, not just cold calling.'
  };
  if (EN) insights = insightsEn;

  global.RETAIL_DATA = {
    BASE_DATE: BASE_DATE,
    usdRate: USD_RATE,
    periodScale: periodScale,
    RC: RC,
    categories: CATEGORIES,
    suppliers: suppliers,
    clients: clients,
    clientLedger: clientLedger,
    products: products,
    offerPrices: offerPrices,
    purchases: purchases,
    supplierDebt: supplierDebt,
    financeMonthly: financeMonthly,
    financeWeekly: financeWeekly,
    expenseBudget: expenseBudget,
    incomeBudget: incomeBudget,
    arApAging: arApAging,
    fleetTrips: fleetTrips,
    pickers: pickers,
    stockByRc: stockByRc,
    managers: managers,
    managerStats: managerStats,
    zoneDonut: zoneDonut,
    i18n: i18n,
    insights: insights,
    EN: EN
  };
})(typeof window !== 'undefined' ? window : globalThis);
