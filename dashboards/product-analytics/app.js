/* Pulse / LeoAnalyst product intelligence demo. Zero external dependencies. */
(() => {
  'use strict';
  const D = window.PULSE_DATA;
  const root = document.getElementById('app');
  if (!D || !root) return;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const saved = (k, fallback) => { try { return localStorage.getItem('pulse_' + k) || fallback; } catch (_) { return fallback; } };
  const store = (k, v) => { try { localStorage.setItem('pulse_' + k, v); } catch (_) {} };
  const state = {
    lang: saved('lang', 'ru'), currency: saved('currency', 'RUB'),
    theme: saved('theme', 'light'), page: 'overview', range: 30,
    end: D.days - 1, country: 'all', platform: 'all', channel: 'all', plan: 'all',
    metric: 'dau', funnelStep: 2, retentionDay: 7, search: '',
    modal: null, navOpen: false, sort: 'count', sortDesc: true, scenario: 2,
  };
  const paths = {
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
    funnel:'<path d="M4 4h16l-6.5 7.5V20l-3 1v-9.5z"/>',
    dollar:'<line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9a4 4 0 1 0 0 8h6a4 4 0 1 1 0 8H6"/>',
    table:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>',
    layers:'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',
    spark:'<path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    export:'<path d="M12 3v12m-4-4 4 4 4-4"/><path d="M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
    moon:'<path d="M20.5 14.4A8.8 8.8 0 0 1 9.6 3.5 9 9 0 1 0 20.5 14.4Z"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    close:'<path d="M18 6 6 18M6 6l12 12"/>',
    arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    back:'<path d="M20 12H4m6-6-6 6 6 6"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    info:'<circle cx="12" cy="12" r="10"/><path d="M12 10v6M12 7h.01"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    shield:'<path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    chart:'<path d="M4 20V9m6 11V4m6 16v-7m5 7H2"/>',
    rocket:'<path d="M12 15 9 12a17 17 0 0 1 11-9 17 17 0 0 1-9 11Z"/><path d="M9 12H5l-2 5 6-2M12 15l-2 6 5-2v-4"/>',
    wallet:'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M16 12h5M5 5V3h13"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    filter:'<path d="M4 7h16M7 12h10M10 17h4"/>',
    sparkles:'<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
    dot:'<circle cx="12" cy="12" r="7"/>',
  };
  const ico = (key, c = '') => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[key] || paths.dot}</svg>`;
  const T = (ru, en) => state.lang === 'ru' ? ru : en;
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nf = (num, options = {}) => new Intl.NumberFormat(state.lang === 'ru' ? 'ru-RU' : 'en-US', options).format(num || 0);
  const number = (x, digits = 0) => nf(x, {maximumFractionDigits: digits, minimumFractionDigits: digits});
  const compact = x => nf(x, {notation:'compact',maximumFractionDigits:x>=1000 ? 1 : 0});
  const pct = (x, digits = 1) => number(100*x, digits) + '%';
  const RATE = 86.4; /* deliberately fixed, demonstrational FX rate */
  const money = (x, short = false) => {
    const v = (x || 0) * (state.currency === 'RUB' ? RATE : 1);
    return new Intl.NumberFormat(state.lang === 'ru' ? 'ru-RU' : 'en-US', {style:'currency',currency:state.currency,notation:short?'compact':'standard',maximumFractionDigits:short?1:0}).format(v);
  };
  const dateObj = (day) => new Date(D.originUTC + day * D.DAY_MS);
  const formattedDate = (d, opts = {}) => dateObj(d).toLocaleDateString(state.lang === 'ru' ? 'ru-RU':'en-US', opts);
  const dateFor = d => D.dateAt(d);
  const shortDay = d => formattedDate(d, {day:'numeric',month:'short'});
  const groupName = (value, kind) => {
    const labels = {
      RU:[ 'Россия', 'Russia'],US:['США','United States'],DE:['Германия','Germany'],IN:['Индия','India'],BR:['Бразилия','Brazil'],
      web:['Веб','Web'],ios:['iOS','iOS'],android:['Android','Android'],
      organic:['Поиск','Organic'],paid:['Реклама','Paid ads'],direct:['Прямые','Direct'],social:['Соцсети','Social'],referral:['Рекомендации','Referrals'],
      free:['Бесплатный','Free'],paidplan:['Платный','Paid']
    };
    if (value === 'all') return T('Все','All');
    if (kind==='plan' && value === 'paid') value='paidplan';
    return labels[value] ? labels[value][state.lang==='ru'?0:1] : value;
  };
  const tabs = [
    {id:'overview',icon:'grid',ru:'Обзор',en:'Overview'},
    {id:'audience',icon:'users',ru:'Аудитория',en:'Audience'},
    {id:'retention',icon:'repeat',ru:'Удержание',en:'Retention'},
    {id:'funnels',icon:'funnel',ru:'Воронки',en:'Funnels'},
    {id:'revenue',icon:'wallet',ru:'Монетизация',en:'Revenue'},
    {id:'cohorts',icon:'table',ru:'Когорты',en:'Cohorts'},
    {id:'events',icon:'activity',ru:'События',en:'Events'},
    {id:'insights',icon:'sparkles',ru:'Выводы',en:'Insights'}
  ];
  const metricInfo = {
    dau:{ru:'DAU',en:'DAU',color:'#18b894',icon:'activity',descRu:'Уникальные пользователи с активностью в последний день выбранного периода.',descEn:'Unique users active on the last date of the selected period.'},
    wau:{ru:'WAU',en:'WAU',color:'#557bf0',icon:'users',descRu:'Уникальные пользователи за последние 7 дней на дату окончания периода.',descEn:'Unique users active during the 7 days ending on the selected date.'},
    mau:{ru:'MAU',en:'MAU',color:'#a681e6',icon:'users',descRu:'Уникальные пользователи за последние 30 дней на дату окончания периода.',descEn:'Unique users active during the 30 days ending on the selected date.'},
    stickiness:{ru:'DAU / MAU',en:'DAU / MAU',color:'#e6a454',icon:'repeat',descRu:'Доля месячной аудитории, активной в последний день. DAU ÷ MAU.',descEn:'Share of monthly active users returning on the final day. DAU ÷ MAU.'},
    revenue:{ru:'Выручка',en:'Revenue',color:'#218aa8',icon:'wallet',descRu:'Сумма успешных демонстрационных платежей за выбранный период.',descEn:'Sum of successful synthetic payments over the selected period.'},
    arpu:{ru:'ARPU',en:'ARPU',color:'#809cd7',icon:'wallet',descRu:'Выручка за период, делённая на число уникальных активных пользователей за период.',descEn:'Revenue for the selected period divided by unique active users in that period.'},
    ltv:{ru:'LTV',en:'LTV',color:'#71a493',icon:'chart',descRu:'Историческая средняя выручка на одного зарегистрированного пользователя по выбранным сегментам (не прогноз).',descEn:'Historical average revenue per registered user for selected segments (not a forecast).'},
    retention:{ru:'Retention D7',en:'D7 retention',color:'#4b87dd',icon:'repeat',descRu:'Доля пользователей зрелых когорт, вернувшихся ровно через 7 дней после регистрации.',descEn:'Share of mature signup cohorts returning exactly 7 days after signup.'}
  };
  const allEventTypes = [
    {id:'session',ru:'Начало сеанса',en:'Session started'},
    {id:'signup',ru:'Регистрация',en:'Sign-up'},
    {id:'onboarding',ru:'Завершение обучения',en:'Onboarding completed'},
    {id:'feature',ru:'Использование функции',en:'Feature used'},
    {id:'activation',ru:'Активация',en:'Activation'},
    {id:'pricing',ru:'Просмотр цен',en:'Pricing viewed'},
    {id:'checkout',ru:'Начало оплаты',en:'Checkout started'},
    {id:'purchase',ru:'Успешная оплата',en:'Purchase succeeded'}
  ];
  function isMatch(u) {
    return (state.platform === 'all' || u.platform === state.platform) &&
      (state.country === 'all' || u.country === state.country) &&
      (state.channel === 'all' || u.channel === state.channel) &&
      (state.plan === 'all' || (state.plan === 'paid' ? u.purchases.some(p=>p.d<=state.end) : !u.purchases.some(p=>p.d<=state.end)));
  }
  function zeroDaily() { return {active:0,new:0,sessions:0,revenue:0,purchases:0,payers:0,features:0,pricing:0}; }
  let cache = {key:'',data:null};
  function activeOn(u, d) { return u.days.includes(d); }
  function getData() {
    const key = [state.end,state.range,state.country,state.platform,state.channel,state.plan].join('|');
    if (cache.key === key && cache.data) return cache.data;
    const end = state.end, start = Math.max(0, end-state.range+1), prevEnd = start-1;
    const daily = Array.from({length:D.days}, zeroDaily);
    const matching = [];
    const activeUsers = [];
    const newUsers = [];
    const payingUsers = [];
    const tx = [];
    const eventMap = Object.fromEntries(allEventTypes.map(e=>[e.id,{id:e.id,count:0,people:new Set()}]));
    const allSegments = {platform:{},country:{},channel:{}};
    for (const kind of ['platform','country','channel']) {
      for (const v of D[kind==='platform'?'platforms':kind==='country'?'countries':'channels']) allSegments[kind][v] = {value:v,active:0,new:0,revenue:0};
    }
    let dau=0,wau=0,mau=0,prevDau=0,prevWau=0,prevMau=0,prevRevenue=0,prevActive=0,prevNew=0;
    let prevPaid=0, revenue=0, sessions=0, totalActions=0;
    const priorStart = Math.max(0,start-state.range);
    for (const u of D.users) {
      if (u.joined > end || !isMatch(u)) continue;
      matching.push(u);
      const isNew = u.joined>=start && u.joined<=end;
      if(isNew) {
        newUsers.push(u);
        daily[u.joined].new++;
        eventMap.signup.count++;
        eventMap.signup.people.add(u.id);
        for(const kind of ['platform','country','channel']) allSegments[kind][u[kind]].new++;
      }
      if (u.onboardingDay !== null && u.onboardingDay>=start && u.onboardingDay<=end) {eventMap.onboarding.count++;eventMap.onboarding.people.add(u.id);}
      if (u.activationDay !== null && u.activationDay>=start && u.activationDay<=end) {eventMap.activation.count++;eventMap.activation.people.add(u.id);}
      let activeCurrent=false,activePrevious=false,active7=false,active30=false,old7=false,old30=false,last=false,previousLast=false;
      for (const d of u.days) {
        if (d > end) break;
        if (d===end) last=true;
        if (d===prevEnd) previousLast=true;
        if (d>=end-6) active7=true;
        if (d>=end-29) active30=true;
        if (d<=prevEnd && d>=prevEnd-6) old7=true;
        if (d<=prevEnd && d>=prevEnd-29) old30=true;
        if (d>=priorStart && d<start) activePrevious=true;
        if (d<start) continue;
        activeCurrent=true;
        const moreSession = ((u.id*17+d*11)%5 === 0) ? 1 : 0;
        const countSessions = 1+moreSession;
        daily[d].active++;
        daily[d].sessions+=countSessions;
        sessions+=countSessions;
        eventMap.session.count+=countSessions;
        eventMap.session.people.add(u.id);
        const feature = u.activationDay !== null && u.activationDay<=d && ((u.id*3+d)%7 !== 0);
        if(feature){eventMap.feature.count++;eventMap.feature.people.add(u.id);daily[d].features++;totalActions++;}
        const pricing = ((u.id+d*7)%13 === 0);
        if(pricing){eventMap.pricing.count++;eventMap.pricing.people.add(u.id);daily[d].pricing++;}
      }
      if(activeCurrent) {
        activeUsers.push(u);
        for(const kind of ['platform','country','channel']) allSegments[kind][u[kind]].active++;
      }
      if(activePrevious) prevActive++;
      if(last)dau++;
      if(previousLast)prevDau++;
      if(active7)wau++;
      if(active30)mau++;
      if(old7)prevWau++;
      if(old30)prevMau++;
      let paidInPeriod=false,paidPrev=false;
      for (const p of u.purchases) {
        if (p.d>end) break;
        if (p.d>=priorStart && p.d<start) {prevRevenue+=p.usd;paidPrev=true;}
        if (p.d<start)continue;
        paidInPeriod=true;
        revenue+=p.usd;
        daily[p.d].revenue+=p.usd;
        daily[p.d].purchases++;
        tx.push({id:u.id,day:p.d,usd:p.usd,country:u.country,platform:u.platform});
        eventMap.purchase.count++;eventMap.purchase.people.add(u.id);
        eventMap.checkout.count++;eventMap.checkout.people.add(u.id);
        for(const kind of ['platform','country','channel']) allSegments[kind][u[kind]].revenue+=p.usd;
      }
      if(paidInPeriod)payingUsers.push(u);
      if(paidPrev)prevPaid++;
    }
    tx.sort((a,b)=>b.day-a.day || b.id-a.id);
    const retention = (day, window=state.range) => {
      const upper = end-day;
      const lower = Math.max(0, end-day-Math.max(20,window)+1);
      let base=0,retained=0;
      for(const u of matching){if(u.joined>=lower && u.joined<=upper){base++;if(activeOn(u,u.joined+day))retained++;}}
      return {base,retained,rate:base ? retained/base : 0};
    };
    const d7 = retention(7),d30=retention(30);
    const totalLifetimeRevenue = matching.reduce((s,u)=>s+u.purchases.filter(p=>p.d<=end).reduce((v,p)=>v+p.usd,0),0);
    const metrics = {
      dau,wau,mau,stickiness:mau?dau/mau:0,revenue,retention:d7.rate,
      users:activeUsers.length,signups:newUsers.length,payers:payingUsers.length,
      sessions,actions:totalActions,purchases:tx.length,d30:d30.rate,
      conversion:activeUsers.length?payingUsers.length/activeUsers.length:0,
      arpu:activeUsers.length?revenue/activeUsers.length:0,
      arppu:payingUsers.length?revenue/payingUsers.length:0,
      ltv:matching.length?totalLifetimeRevenue/matching.length:0,
      revenuePerSession:sessions?revenue/sessions:0,
    };
    const prevStickiness=prevMau?prevDau/prevMau:0;
    const prevD7 = (()=>{
      const oldEnd = Math.max(0,prevEnd);
      let base=0,keep=0;
      for(const u of matching) if(u.joined>=Math.max(0,oldEnd-7-Math.max(20,state.range)+1) && u.joined<=oldEnd-7){base++;if(activeOn(u,u.joined+7))keep++;}
      return base?keep/base:0;
    })();
    const prevCohortUsers=matching.filter(u=>u.joined<=prevEnd);
    const prevLifetimeRevenue=prevCohortUsers.reduce((sum,u)=>sum+u.purchases.filter(p=>p.d<=prevEnd).reduce((t,p)=>t+p.usd,0),0);
    const compare={dau:prevDau,wau:prevWau,mau:prevMau,stickiness:prevStickiness,revenue:prevRevenue,retention:prevD7,arpu:prevActive?prevRevenue/prevActive:0,ltv:prevCohortUsers.length?prevLifetimeRevenue/prevCohortUsers.length:0};
    const values = {end,start,prevEnd,priorStart,daily,matching,activeUsers,newUsers,payingUsers,tx,metrics,compare,allSegments,retention,eventMap};
    cache={key,data:values};
    return values;
  }
  const delta = (current, old) => old ? (current-old)/Math.abs(old) : current?1:0;
  const deltaHTML = (val,old,points=false) => {
    const d=points ? (val-old)*100 : delta(val,old)*100;
    return `<span class="delta ${d<0?'negative':''}">${d>0?'+':''}${number(d,1)}${points ? ' '+T('п.п.','pp') : '%'}</span>`;
  };
  function metricDisplay(key,value) {
    if(key==='revenue')return money(value,true);
    if(key==='arpu'||key==='ltv')return money(value);
    if(key==='retention'||key==='stickiness')return pct(value);
    return compact(value);
  }
  function metricCards(s, keys=['revenue','mau','dau','retention','wau','stickiness','arpu','ltv']) {
    return `<div class="metric-grid">${keys.map(key=>{
      const o=metricInfo[key],v=s.metrics[key],old=s.compare[key];
      return `<button type="button" class="metric-card metric-card--${key} ${state.metric===key?'selected':''}" style="--marker:${o.color}" data-metric="${key}" title="${esc(state.lang==='ru'?o.descRu:o.descEn)}">
        <span class="metric-overline"><span>${T(o.ru,o.en)}</span><span class="metric-icon">${ico(o.icon)}</span></span>
        <div class="metric-value">${metricDisplay(key,v)}</div>
        <div class="metric-foot">${deltaHTML(v,old,key==='retention'||key==='stickiness')}<span class="comparison-text">${T('к прошлому периоду','vs previous')}</span></div>
      </button>`;
    }).join('')}</div>`;
  }
  let chartIndex=0,charts=new Map();
  /* Chart axes are outside the plotting canvas: labels never get clipped. */
  function svgLine(values, color='#2f6c85', opts={}) {
    const width=900,height=252,left=12,right=14,top=16,bottom=19;
    const rawMax=Math.max(1,...values.map(v=>Number(v)||0));
    const ymax=rawMax*1.16;
    const xmin=left,xmax=width-right,ymin=top,ymaxP=height-bottom;
    const nx=values.length,step=(xmax-xmin)/Math.max(1,nx-1);
    const positions=values.map((v,i)=>[xmin+i*step,ymaxP-(Math.max(0,v||0)/ymax)*(ymaxP-ymin)]);
    const path=positions.map((point,i)=>(i?'L':'M')+point[0].toFixed(2)+','+point[1].toFixed(2)).join(' ');
    const bottomPath=`${path}L${positions.at(-1)[0].toFixed(2)},${ymaxP}L${xmin},${ymaxP}Z`;
    const id='g'+chartIndex++;
    const gridColor=state.theme==='dark'?'#384653':'#e7edf0';
    const lines=[0,.25,.5,.75,1].map(v=>{
      const y=ymaxP-(ymaxP-ymin)*v;
      return `<line x1="${xmin}" y1="${y}" x2="${xmax}" y2="${y}" stroke="${gridColor}" stroke-width="1" stroke-dasharray="${v===0?'0':'3 6'}"/>`;
    }).join('');
    const shortAxis=v=>{
      if(opts.format==='percent')return number(v,0)+'%';
      if(opts.format==='money'){
        const fx=state.currency==='RUB'?RATE:1;
        const val=v*fx,suffix=state.currency==='RUB'?' ₽':' $';
        if(val>=1e6)return number(val/1e6,1)+T(' млн','M')+suffix;
        if(val>=1e3)return number(val/1e3,0)+T(' тыс.','K')+suffix;
        return number(val,0)+suffix;
      }
      if(v>=1e6)return number(v/1e6,1)+T(' млн','M');
      if(v>=1e3)return number(v/1e3,1)+T(' тыс.','K');
      return number(v,0);
    };
    const ticks=[1,.75,.5,.25,0].map(v=>`<span>${shortAxis(v*ymax)}</span>`).join('');
    const svg=`<svg role="img" aria-label="${esc(opts.label||'Trend')}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity=".22"/><stop offset="100%" stop-color="${color}" stop-opacity=".005"/></linearGradient></defs>${lines}<path d="${bottomPath}" fill="url(#${id})"/><path d="${path}" fill="none" stroke="${color}" stroke-width="3.5" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/><line class="chart-hover-line" x1="0" y1="${ymin}" x2="0" y2="${ymaxP}" stroke="${color}" stroke-dasharray="4 5" stroke-width="1" visibility="hidden"/><circle class="chart-hover-dot" cx="0" cy="0" r="5.5" fill="${color}" stroke="${state.theme==='dark'?'#202a32':'white'}" stroke-width="2.8" visibility="hidden"/><circle cx="${positions.at(-1)[0]}" cy="${positions.at(-1)[1]}" r="5" fill="${color}" stroke="${state.theme==='dark'?'#202a32':'white'}" stroke-width="3" vector-effect="non-scaling-stroke"/></svg>`;
    charts.set(id,{values,positions,dates:opts.dates||[],format:opts.format||'num',color,width,height});
    const labels=[0,.25,.5,.75,1].map(v=>{const i=Math.round((nx-1)*v);return `<span>${esc(opts.dates?.[i]||'')}</span>`;}).join('');
    return `<div class="chart-frame"><div class="chart-y-axis" aria-hidden="true">${ticks}</div><div class="chart-drawing"><div class="chart-stage" data-chart="${id}">${svg}<div class="chart-tooltip" hidden></div></div><div class="axis-labels">${labels}</div></div></div>`;
  }
  function aggregateRolling(s,window) {
    const start=s.start,end=s.end,changes=new Int32Array(end-start+2);
    for(const u of s.matching){
      let segStart=-1,segEnd=-1;
      const emit=()=>{if(segStart<0)return;changes[segStart-start]++;if(segEnd<end)changes[segEnd-start+1]--;};
      for(const day of u.days){
        if(day>end)break;
        const a=Math.max(start,day),b=Math.min(end,day+window-1);
        if(b<start)continue;
        if(a<=segEnd+1){segEnd=Math.max(segEnd,b);}
        else{emit();segStart=a;segEnd=b;}
      }
      emit();
    }
    let count=0;const out=[];
    for(let i=0;i<end-start+1;i++){count+=changes[i];out.push(count);}
    return out;
  }
  function trendSeries(s, metric) {
    const days=Array.from({length:s.end-s.start+1},(_,i)=>s.start+i);
    let values=[];
    if(metric==='dau') values=days.map(d=>s.daily[d].active);
    else if(metric==='wau')values=aggregateRolling(s,7);
    else if(metric==='mau')values=aggregateRolling(s,30);
    else if(metric==='revenue')values=days.map(d=>s.daily[d].revenue);
    else if(metric==='arpu')values=days.map(d=>s.daily[d].active?s.daily[d].revenue/s.daily[d].active:0);
    else if(metric==='ltv'){
      const bySignup=new Int32Array(s.end+1),byPayment=new Float64Array(s.end+1);
      for(const u of s.matching){
        if(u.joined<=s.end)bySignup[u.joined]++;
        for(const p of u.purchases)if(p.d<=s.end)byPayment[p.d]+=p.usd;
      }
      let members=0,earned=0;
      const cumulative=Array.from({length:s.end+1},(_,d)=>{
        members+=bySignup[d];earned+=byPayment[d];return members?earned/members:0;
      });
      values=days.map(d=>cumulative[d]);
    }
    else if(metric==='stickiness'){
      const monthly=aggregateRolling(s,30);
      values=days.map((d,i)=>monthly[i]?s.daily[d].active/monthly[i]*100:0);
    }
    else if(metric==='retention'){
      const base=new Float64Array(D.days),keep=new Float64Array(D.days);
      for(const u of s.matching){
        const day=u.joined+7;
        if(day>=s.start&&day<=s.end){base[day]++;if(activeOn(u,day))keep[day]++;}
      }
      values=days.map(d=>base[d]?keep[d]/base[d]*100:0);
    }
    else values=days.map(d=>s.daily[d].new);
    return {values,dates:days.map(shortDay)};
  }
  function trendPanel(s) {
    const key=state.metric,meta=metricInfo[key],ts=trendSeries(s,key);
    const fmt=(['revenue','arpu','ltv'].includes(key)?'money':key==='retention'||key==='stickiness'?'percent':'num');
    return `<section class="card"><div class="card-inner"><div class="card-header">
      <div><h2 class="card-title">${T('Динамика ключевых показателей','Key metric trends')}</h2><p class="card-subtitle">${T('Изменения по дням · наведите на график','Daily performance · hover to explore')}</p></div>
      <button class="head-btn" data-detail="${key}" title="${T('Описание метрики','Metric definition')}">${ico('info')}</button></div>
      ${svgLine(ts.values,meta.color,{dates:ts.dates,label:T(meta.ru,meta.en),format:fmt})}
      <div class="legend"><span class="legend-item"><span class="legend-mark" style="background:${meta.color}"></span>${T(meta.ru,meta.en)}</span><span class="micro-label">${T('Выберите показатель сверху для переключения графика','Select a metric above to switch the chart')}</span></div>
    </div></section>`;
  }
  const palette=['#28bc99','#5d81e9','#a48ce7','#edb66d','#70b9c9'];
  function donutSegments(s,kind) {
    const map=s.allSegments[kind];
    const values=Object.values(map).sort((a,b)=>b.active-a.active);
    const total=values.reduce((a,v)=>a+v.active,0);
    let running=0;
    const gradient=values.map((v,i)=>{const from=running;running+=total?v.active/total*100:0;return `${palette[i]} ${from}% ${running}%`;}).join(',');
    const label=kind==='platform'?T('Платформы','Platforms'):kind==='country'?T('География','Geography'):T('Источники','Channels');
    return `<section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${label}</h2><p class="card-subtitle">${T('Распределение активных пользователей','Active user breakdown')}</p></div><span class="card-head-tag">${T('Можно фильтровать','Interactive')}</span></div>
      <div class="donut-row"><div class="donut" style="background:conic-gradient(${gradient||'#e9eef0 0 100%'})"><div class="donut-center"><strong>${total?compact(total):'—'}</strong><small>${T('пользователей','users')}</small></div></div><div class="donut-legend">
      ${values.map((v,i)=>`<button class="legend-row" data-segment="${kind}|${v.value}"><small><span class="legend-mark" style="background:${palette[i]}"></span>${esc(groupName(v.value,kind))}</small><b>${total?pct(v.active/total,0):'—'}</b></button>`).join('')}
      </div></div></div></section>`;
  }
  function narrative(s) {
    const ltv=s.metrics.ltv,conv=s.metrics.conversion;
    const idea = s.metrics.d7 < .33
      ? {title:T('Удержание — ключевая возможность роста','Retention is a growth opportunity'),text:T(`На 7-й день возвращаются ${pct(s.metrics.retention)} новых пользователей. Проверьте первый опыт, полезность ключевой функции и напоминания.`,`Only ${pct(s.metrics.retention)} of new users return on day 7. Review onboarding, core value discovery, and re-engagement.`),tab:'retention'}
      : {title:T('Усилите переход к оплате','Improve the path to payment'),text:T(`Платящая аудитория за период — ${pct(conv)} активных пользователей. Изучите шаги регистрации, активации и оплаты.`,`Paying users account for ${pct(conv)} of active users. Explore signup, activation and payment steps.`),tab:'funnels'};
    return `<section class="narrative-card"><span class="hint">${ico('sparkles','icon-inline')} ${T('Что показывают цифры','What the data suggests')}</span><h3>${idea.title}</h3><p>${idea.text}</p><button class="goto-link" data-page="${idea.tab}">${T('Перейти к деталям','Explore the data')} ${ico('arrow','icon-inline')}</button></section>`;
  }
  function quickStats(s) {
    return `<section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${T('Здоровье продукта','Product health')}</h2><p class="card-subtitle">${T('Дополнительные показатели за период','Supporting metrics for the period')}</p></div></div>
      <div class="submetrics"><div class="submetric"><span>${T('Активных за период','Active in period')}</span><b>${compact(s.metrics.users)}</b></div><div class="submetric"><span>${T('Новых пользователей','New users')}</span><b>${compact(s.metrics.signups)}</b></div><div class="submetric"><span>${T('Плательщиков','Payers')}</span><b>${compact(s.metrics.payers)}</b></div></div>
      <div class="mini-list" style="margin-top:23px">
       ${[{icon:'clock',label:T('Сеансов','Sessions'),value:compact(s.metrics.sessions),info:T('Активность за период','Period activity')},{icon:'repeat',label:T('Удержание D30','D30 retention'),value:pct(s.metrics.d30),info:T('Возвраты через 30 дней','30-day return rate')},{icon:'dollar',label:'ARPU',value:money(s.metrics.arpu),info:T('Выручка на активного','Revenue per active user')}].map(row=>`<div class="mini-item"><span class="mini-icon">${ico(row.icon)}</span><span class="mini-text"><strong>${row.label}</strong><small>${row.info}</small></span><b>${row.value}</b></div>`).join('')}
      </div></div></section>`;
  }
  function overview(s) {
    return `${metricCards(s)}<div class="grid-main">${trendPanel(s)}${quickStats(s)}</div>
      <div class="grid-main">${donutSegments(s,'platform')}${narrative(s)}</div>
      <div class="grid-equal">${segmentTable(s,'country')}${overviewFunnel(s)}</div>`;
  }
  function segmentTable(s,kind='country') {
    const label=kind==='country'?T('Аудитория по странам','Audience by country'):kind==='channel'?T('Источники трафика','Acquisition channels'):T('Платформы','Platforms');
    const v=Object.values(s.allSegments[kind]).sort((a,b)=>b.active-a.active);
    return `<section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${label}</h2><p class="card-subtitle">${T('Нажмите на строку для фильтра','Select any row to filter the dashboard')}</p></div></div><div class="table-scroll"><table class="data-table"><thead><tr><th>${T('Сегмент','Segment')}</th><th class="table-num">${T('Активные','Active')}</th><th class="table-num">${T('Новые','New')}</th><th class="table-num">${T('Выручка','Revenue')}</th></tr></thead><tbody>
      ${v.map(a=>`<tr class="clickable-row" data-segment="${kind}|${a.value}" style="cursor:pointer"><td>${esc(groupName(a.value,kind))}</td><td class="table-num">${number(a.active)}</td><td class="table-num">${number(a.new)}</td><td class="table-num">${money(a.revenue)}</td></tr>`).join('')}</tbody></table></div></div></section>`;
  }
  function funnelFor(s) {
    const n=s.newUsers.filter(u=>u.joined<=s.end);
    const counts = [n.length,
      n.filter(u=>u.onboardingDay!==null && u.onboardingDay<=s.end).length,
      n.filter(u=>u.activationDay!==null && u.activationDay<=s.end).length,
      n.filter(u=>u.purchases.length && u.purchases[0].d<=s.end).length];
    const items=[T('Регистрация','Signed up'),T('Прошли обучение','Onboarded'),T('Активация','Activated'),T('Первая оплата','First purchase')];
    return counts.map((count,i)=>({i,count,label:items[i],percent:counts[0]?count/counts[0]:0,
      fromPrev:i?counts[i-1]?count/counts[i-1]:0:1}));
  }
  function overviewFunnel(s){
    const rows=funnelFor(s);
    return `<section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${T('Путь к первой оплате','First purchase funnel')}</h2><p class="card-subtitle">${T('Новые пользователи за период','Users who signed up during the period')}</p></div><button data-page="funnels" class="head-btn" title="${T('Открыть воронку','Open funnel')}">${ico('arrow')}</button></div>
    <div class="funnel-rows">${rows.map((r,i)=>`<div><div class="funnel-step-head"><strong>${i+1}. ${r.label}</strong><span>${number(r.count)} · ${pct(r.percent,0)}</span></div><div class="progress-track"><div class="progress-fill" style="width:${r.percent*100}%;background:${['#2aba96','#69a9c9','#6989e7','#967cdb'][i]}"></div></div></div>`).join('')}</div></div></section>`;
  }
  function audience(s) {
    const days=Array.from({length:s.end-s.start+1},(_,i)=>s.start+i);
    const newVals=days.map(d=>s.daily[d].new);
    const returnVals=days.map(d=>Math.max(0,s.daily[d].active-s.daily[d].new));
    const returning=state.audienceMetric==='return';
    return `<div class="grid-three">
       ${summaryTile(T('Новых пользователей','New sign-ups'),compact(s.metrics.signups),T('За выбранный период','Selected period'),'users')}
       ${summaryTile(T('Активных пользователей','Unique active users'),compact(s.metrics.users),T('За выбранный период','Selected period'),'activity')}
       ${summaryTile(T('Доля возвращающихся','Returning audience'),pct(s.metrics.users?Math.max(0,s.metrics.users-s.metrics.signups)/s.metrics.users:0),T('Оценка по новым регистрациям','Based on new sign-ups'),'repeat')}
     </div><div class="grid-main"><section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${T('Рост аудитории','Audience growth')}</h2><p class="card-subtitle">${T('Новые и возвращающиеся по дням','Daily new and returning activity')}</p></div><div class="tab-pills"><button class="tab-pill ${!returning?'active':''}" data-audience="new">${T('Новые','New')}</button><button class="tab-pill ${returning?'active':''}" data-audience="return">${T('Вернувшиеся','Returning')}</button></div></div>
      ${svgLine(returning?returnVals:newVals,returning?'#5b83e7':'#1fbe92',{dates:days.map(shortDay),format:'num',label:returning?T('Вернувшиеся','Returning'):T('Новые','New')})}
    </div></section>${donutSegments(s,'country')}</div>
    <div class="grid-equal">${segmentTable(s,'platform')}${segmentTable(s,'channel')}</div>`;
  }
  function summaryTile(label,value,subtitle,iconKey){return `<section class="card"><div class="card-inner"><div class="metric-overline">${label}<span class="metric-icon">${ico(iconKey)}</span></div><div class="metric-value">${value}</div><p class="card-subtitle">${subtitle}</p></div></section>`;}
  /* Exact-day cohort retention, grouped by signup week. */
  function dailyRetentionCohorts(s) {
    const ages=[0,1,3,7,14,30,60];
    const rows=[];
    for(let w=0;w<12;w++){
      const end=s.end-w*7;
      const begin=Math.max(0,end-6);
      if(end<0)break;
      const users=s.matching.filter(u=>u.joined>=begin && u.joined<=end);
      const cells=ages.map(age=>{
        if(age===0)return 1;
        // A cell is shown only when every user in the signup cohort
        // has had enough time to reach this exact day.
        if(end+age>s.end)return null;
        return users.length?users.filter(u=>activeOn(u,u.joined+age)).length/users.length:0;
      });
      rows.push({begin,end,users:users.length,ages,cells});
    }
    return rows;
  }
  function retentionHeatmap(s) {
    const cohorts=dailyRetentionCohorts(s),ages=[0,1,3,7,14,30,60];
    const heat=(v,age)=>{
      const strength=age===0?0.96:Math.min(0.94,Math.max(.12, v*2.3));
      return state.theme==='dark'?`rgba(81,188,201,${strength.toFixed(3)})`:`rgba(67,165,185,${strength.toFixed(3)})`;
    };
    return `<section class="card retention-matrix-card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${T('Когортная карта удержания','Retention cohort heatmap')}</h2><p class="card-subtitle">${T('Точный возврат на D1, D3, D7 и другие дни. Наведите на ячейку или нажмите для подробностей.','Exact-day returns for D1, D3, D7 and more. Hover or click a cell for details.')}</p></div><span class="card-head-tag">${T('Интерактивно','Interactive')}</span></div>
    <div class="table-scroll"><table class="cohort-table daily-cohort-table"><thead><tr><th>${T('Неделя регистрации','Signup week')}</th><th>${T('Пользователи','Users')}</th>${ages.map(d=>`<th>D${d}</th>`).join('')}</tr></thead><tbody>
    ${cohorts.map((c,i)=>`<tr><th class="cohort-name">${shortDay(c.begin)}–${shortDay(c.end)}</th><td class="cohort-users">${number(c.users)}</td>${c.cells.map((value,j)=>value===null?`<td><span class="cohort-empty" title="${T('Срок наблюдения не завершён','Not mature yet')}">—</span></td>`:`<td><button type="button" class="cohort-cell daily-cell ${value>.2?'high-retention':''}" style="background:${heat(value,ages[j])}" data-retention-cell="${i}|${j}" title="D${ages[j]} · ${pct(value)}">${pct(value,0)}</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <div class="heatmap-foot"><div class="heatmap-key"><span>${T('Низкое','Lower')}</span><i></i><i></i><i></i><i></i><i></i><span>${T('Высокое','Higher')}</span></div><span class="micro-label">${T('Пустые ячейки — когорта ещё не достигла этого дня','Empty cells mean the cohort has not yet matured')}</span></div>
    </div></section>`;
  }
  function retentionPage(s) {
    const d1=s.retention(1),d7=s.retention(7),d30=s.retention(30);
    const drop=d1.rate>0?(d1.rate-d7.rate):0;
    return `<div class="grid-three retention-summary">
      ${summaryTile('D1 retention',pct(d1.rate),T('Вернулись на следующий день','Returned the following day'),'repeat')}
      ${summaryTile('D7 retention',pct(d7.rate),T('Вернулись на седьмой день','Returned on day seven'),'repeat')}
      ${summaryTile('D30 retention',pct(d30.rate),T('Вернулись на тридцатый день','Returned on day thirty'),'repeat')}
      </div>${retentionHeatmap(s)}<div class="grid-equal retention-explain">
      <section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${T('Как читать таблицу','How to read this matrix')}</h2><p class="card-subtitle">${T('Одна строка = одна неделя регистраций','One row = one signup week')}</p></div></div>
      <div class="retention-guide"><div><span class="guide-step">01</span><b>${T('Когорта','Cohort')}</b><p>${T('Люди, зарегистрировавшиеся в течение одной недели.','Users who signed up during the same week.')}</p></div><div><span class="guide-step">02</span><b>${T('Точный день','Exact day')}</b><p>${T('D7 = возврат ровно на седьмой день, а не в любой день первой недели.','D7 means returning on day seven, not any day during that week.')}</p></div><div><span class="guide-step">03</span><b>${T('Сравнивайте','Compare')}</b><p>${T('По строкам видно удержание отдельной группы; по столбцам — качество новых когорт.','Rows show one group’s retention; columns reveal trends across signup cohorts.')}</p></div></div></div></section>
      <section class="focus-card"><div class="focus-tag">${T('Ключевой сигнал','Key signal')}</div><h2>${T('От первого дня к седьмому','From day one to day seven')}</h2><div class="focus-value">${number(Math.max(0,drop)*100,1)} ${T('п.п.','pp')}</div><p>${T('Разница между D1 и D7. Найдите, какие первые действия связаны с повторным использованием продукта.','The gap between D1 and D7. Investigate which first actions are tied to repeat product usage.')}</p><button type="button" data-page="cohorts">${T('Открыть недельные когорты','Explore weekly cohorts')} ${ico('arrow','icon-inline')}</button></section>
      </div>`;
  }
  function funnelsPage(s) {
    const rows=funnelFor(s), first=rows[0].count,last=rows.at(-1).count;
    const step=clamp(state.funnelStep,0,3);
    const explanations=[
      T('Регистрация — отправная точка. Здесь считаются только пользователи, зарегистрировавшиеся в выбранном периоде.','Sign-up is the starting point. Only users who joined during the selected period are counted.'),
      T('Проверьте, достаточно ли прост первый запуск и понятно ли пользователю, что делать после регистрации.','Evaluate whether onboarding is short enough and the next action is immediately clear.'),
      T('Покажите ценность ключевой функции до предложения оплаты — это обычно повышает готовность платить.','Demonstrate core product value before introducing the paywall to increase purchase intent.'),
      T('Анализируйте цены, неудобные формы оплаты и причины отклонённых платежей.','Examine pricing clarity, checkout friction, and failed payment reasons.')
    ];
    return `<div class="grid-three">
      ${summaryTile(T('Регистрации','Sign-ups'),number(first),T('Размер входной когорты','Cohort size'),'users')}
      ${summaryTile(T('Оплатили','Converted to paid'),number(last),T('Первые оплаты','First purchases'),'wallet')}
      ${summaryTile(T('Конверсия в оплату','Signup → purchase'),first?pct(last/first):'—',T('От регистрации до первой покупки','From signup to first purchase'),'funnel')}
    </div><div class="funnel-layout">
      <section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${T('Воронка активации и оплаты','Activation & purchase funnel')}</h2><p class="card-subtitle">${T('Нажмите на этап, чтобы увидеть рекомендации','Select a step for recommendations')}</p></div></div>
        <div class="funnel-rows">${rows.map(r=>`<button class="funnel-step ${r.i===step?'selected':''}" data-funnel="${r.i}"><div class="funnel-step-head"><strong>${r.i+1}. ${r.label}</strong><span>${number(r.count)}</span></div><div class="progress-track"><div class="progress-fill" style="background:${palette[r.i]};width:${r.percent*100}%"></div></div><div class="funnel-note"><span>${pct(r.percent,1)} ${T('от входа','of sign-ups')}</span><span>${r.i?T('Прошли шаг','Step-through')+' '+pct(r.fromPrev,1):'100%'}</span></div></button>`).join('')}</div>
      </div></section><section class="narrative-card"><span class="hint">${T('Этап','Stage')} ${step+1} / 4</span><h3>${rows[step].label}</h3><p>${explanations[step]}</p><p>${T('Потеря относительно предыдущего шага','Drop-off vs previous stage')}: <strong style="color:#a8f5d8">${step?number(rows[step-1].count-rows[step].count):'—'}</strong></p><button class="goto-link" data-page="insights">${T('Посмотреть выводы','See recommendations')}${ico('arrow','icon-inline')}</button></section>
    </div>`;
  }
  function revenuePage(s) {
    const days=Array.from({length:s.end-s.start+1},(_,i)=>s.start+i);
    const vals=days.map(d=>s.daily[d].revenue);
    return `<div class="grid-three">
      ${summaryTile(T('Выручка','Revenue'),money(s.metrics.revenue,true),T('Успешные платежи за период','Successful payments in period'),'dollar')}
      ${summaryTile('ARPU',money(s.metrics.arpu),T('Выручка / активные пользователи','Revenue / active users'),'users')}
      ${summaryTile('ARPPU',money(s.metrics.arppu),T('Выручка / платящие пользователи','Revenue / paying users'),'wallet')}
    </div>
    <div class="grid-main"><section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${T('Динамика выручки','Revenue trend')}</h2><p class="card-subtitle">${T('Все успешные демонстрационные платежи по дням','Daily successful synthetic payments')}</p></div></div>${svgLine(vals,'#20b68e',{dates:days.map(shortDay),format:'money',label:T('Выручка','Revenue')})}</div></section>
    <section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${T('Экономика продукта','Unit economics')}</h2></div></div>
      <div class="mini-list">
      ${[
        [T('Условный LTV на дату','Observed LTV to date'),money(s.metrics.ltv),T('Выручка за всё время / все регистрации','Lifetime revenue / registered users')],
        [T('Доля платящих','Paying share'),pct(s.metrics.conversion),T('Покупатели / активные за период','Buyers / period active users')],
        [T('Успешных платежей','Successful payments'),number(s.metrics.purchases),T('Платежи в выбранном периоде','Purchases in selected period')],
        [T('Средний платёж','Average payment'),money(s.metrics.purchases?s.metrics.revenue/s.metrics.purchases:0),T('Выручка / платежи','Revenue / payments')]
      ].map((row,i)=>`<div class="mini-item"><span class="mini-icon">${ico(['wallet','users','dollar','chart'][i])}</span><span class="mini-text"><strong>${row[0]}</strong><small>${row[2]}</small></span><b>${row[1]}</b></div>`).join('')}
      </div></div></section></div>
      <div class="grid-equal">${segmentTable(s,'channel')}${transactionsPanel(s)}</div>`;
  }
  function transactionsPanel(s) {
    const rows=s.tx.slice(0,10);
    return `<section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${T('Последние платежи','Recent payments')}</h2><p class="card-subtitle">${T('Вымышленные транзакции','Synthetic transactions')}</p></div><button class="head-btn" data-export="transactions" title="CSV">${ico('export')}</button></div>
     <div class="table-scroll"><table class="data-table"><thead><tr><th>${T('Дата','Date')}</th><th>${T('Клиент','User')}</th><th>${T('Страна','Country')}</th><th class="table-num">${T('Сумма','Amount')}</th></tr></thead><tbody>
      ${rows.length?rows.map(tx=>`<tr><td>${shortDay(tx.day)}</td><td>#${String(tx.id).padStart(6,'0')}</td><td>${esc(groupName(tx.country,'country'))}</td><td class="table-num text-success">${money(tx.usd)}</td></tr>`).join(''):`<tr><td colspan="4">${T('В этом периоде нет платежей','No payments in this period')}</td></tr>`}
     </tbody></table></div></div></section>`;
  }
  function makeCohorts(s) {
    const rows=[];
    for(let w=0;w<9;w++){
      const end=s.end-7-w*7;
      const begin=end-6;
      if(begin<0)break;
      const users=s.matching.filter(u=>u.joined>=begin && u.joined<=end);
      const weeks=Array.from({length:9},(_,age)=>{
        if(age===0)return 1;
        if(end+(age+1)*7-1>s.end)return null;
        return users.length?users.filter(u=>u.days.some(day=>day>=u.joined+age*7 && day<u.joined+(age+1)*7 && day<=s.end)).length/users.length:0;
      });
      rows.push({begin,end,users:users.length,weeks});
    }
    return rows;
  }
  function cohortPage(s) {
    const cohorts=makeCohorts(s);
    return `<div class="grid-three">${summaryTile(T('Когорт','Cohorts'),number(cohorts.length),T('Недельные группы регистраций','Weekly signup groups'),'users')}
      ${summaryTile('D7 retention',pct(s.metrics.retention),T('Точный возврат на 7-й день','Exact day-7 return'),'repeat')}
      ${summaryTile('D30 retention',pct(s.metrics.d30),T('Точный возврат на 30-й день','Exact day-30 return'),'repeat')}</div>
      <section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${T('Недельные когорты','Weekly retention cohorts')}</h2><p class="card-subtitle">${T('Возврат хотя бы в один из дней каждой недели жизни. Выберите ячейку для деталей.','Returned at least once in each lifecycle week. Select any cell to inspect.')}</p></div><span class="card-head-tag">${T('Интерактивная таблица','Interactive matrix')}</span></div>
      <div class="table-scroll"><table class="cohort-table"><thead><tr><th>${T('Регистрация','Signup week')}</th><th>${T('Польз.','Users')}</th>${Array.from({length:9},(_,i)=>`<th>W${i}</th>`).join('')}</tr></thead><tbody>
      ${cohorts.map((c,i)=>`<tr><th class="cohort-name">${shortDay(c.begin)}–${shortDay(c.end)}</th><td class="cohort-users">${number(c.users)}</td>${c.weeks.map((value,w)=>value===null?`<td><span class="cohort-empty">—</span></td>`:`<td><button class="cohort-cell" style="background:${state.theme==='dark'?'rgba(24,183,142,':'rgba(38,194,152,'}${Math.max(.06,value*.85).toFixed(3)})" data-cohort="${i}|${w}" title="${pct(value)}">${pct(value,0)}</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <div class="legend" style="margin-top:19px"><span class="legend-item"><span class="legend-mark" style="background:#c9f8e5"></span>${T('Низкое удержание','Lower retention')}</span><span class="legend-item"><span class="legend-mark" style="background:#23be95"></span>${T('Высокое удержание','Higher retention')}</span><span class="micro-label">${T('W0 = все регистрации; W1 = дни 7–13 и т. д.','W0 = all signups; W1 = days 7–13, etc.')}</span></div>
      </div></section>`;
  }
  function eventsList(s) {
    let items=allEventTypes.map(e=>{const r=s.eventMap[e.id];return {...e,count:r.count,users:r.people.size};});
    const q=state.search.trim().toLowerCase();
    if(q)items=items.filter(item=>(item.ru+' '+item.en+' '+item.id).toLowerCase().includes(q));
    const sort=state.sort,dir=state.sortDesc?-1:1;
    items.sort((a,b)=>sort==='name'?dir*T(a.ru,a.en).localeCompare(T(b.ru,b.en)):dir*(a[sort]-b[sort]));
    return items;
  }
  function eventRows(s) {
    const max=Math.max(1,...allEventTypes.map(e=>s.eventMap[e.id].count));
    const items=eventsList(s);
    if(!items.length)return `<tr><td colspan="4">${T('События не найдены','No events match your search')}</td></tr>`;
    return items.map((item)=>`<tr><td>${T(item.ru,item.en)}</td><td class="table-num">${number(item.count)}</td><td class="table-num">${number(item.users)}</td><td><div class="progress-track" style="height:7px;min-width:48px"><div class="progress-fill" style="width:${item.count/max*100}%"></div></div></td></tr>`).join('');
  }
  function eventsPage(s) {
    return `<div class="grid-three">
      ${summaryTile(T('Событий всего','Total events'),compact(allEventTypes.reduce((v,e)=>v+s.eventMap[e.id].count,0)),T('Сумма по отслеживаемым типам','Across tracked event types'),'activity')}
      ${summaryTile(T('Сеансов','Sessions'),compact(s.metrics.sessions),T('События начала сеанса','Session start events'),'users')}
      ${summaryTile(T('Ключевых действий','Core feature actions'),compact(s.metrics.actions),T('Использование основной функции','Core feature usage'),'spark')}
    </div><section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${T('Каталог событий','Event explorer')}</h2><p class="card-subtitle">${T('Количество событий и уникальных пользователей','Event frequency and unique users')}</p></div><input class="input-search" data-event-search placeholder="${T('Поиск события…','Search events…')}" type="search" aria-label="${T('Поиск события','Search event')}" value="${esc(state.search)}"></div>
    <div class="table-scroll"><table class="data-table"><thead><tr><th><button class="sort-header" data-sort="name">${T('Событие','Event')} ⇅</button></th><th class="table-num"><button class="sort-header" data-sort="count">${T('Срабатываний','Occurrences')} ⇅</button></th><th class="table-num"><button class="sort-header" data-sort="users">${T('Пользователей','Users')} ⇅</button></th><th>${T('Частота','Relative volume')}</th></tr></thead><tbody id="event-rows">${eventRows(s)}</tbody></table></div>
    <p class="card-subtitle" style="margin-top:17px">${T('Каждый показатель рассчитывается из демонстрационных действий пользователей.','Each measure is computed from synthetic user activities.')}</p>
    </div></section>`;
  }
  function insightsPage(s) {
    const rate=s.metrics.conversion;
    const avgPay=s.metrics.purchases?s.metrics.revenue/s.metrics.purchases:14.99;
    const extraUsers=s.metrics.users*state.scenario/100;
    const extraMoney=extraUsers*avgPay;
    const items=[
      {icon:'repeat',name:T('Удержание на D7','Day-7 retention'),desc:T(`Сейчас возвращается ${pct(s.metrics.retention)} пользователей зрелых когорт. Проверьте, какие действия совершает человек в первую неделю.`,`Currently ${pct(s.metrics.retention)} of mature cohorts return on day 7. Study what users do in the first week.`),goto:'retention',tag:'D7'},
      {icon:'funnel',name:T('Конверсия в первую оплату','First purchase conversion'),desc:T(`Доля платящих за период — ${pct(rate)}. Выясните, на каком шаге регистрации, активации и оплаты больше всего потерь.`,`Paying share is ${pct(rate)}. Identify the largest drop-off between sign-up, activation and payment.`),goto:'funnels',tag:T('Воронка','Funnel')},
      {icon:'wallet',name:T('Выручка на пользователя','Revenue per user'),desc:T(`ARPU за период — ${money(s.metrics.arpu)}, ARPPU — ${money(s.metrics.arppu)}. Разделите платежи по планам и источникам.`,`Period ARPU is ${money(s.metrics.arpu)}, ARPPU is ${money(s.metrics.arppu)}. Compare payment performance by channel.`),goto:'revenue',tag:'ARPU'},
      {icon:'users',name:T('Рост активной аудитории','Active audience growth'),desc:T(`За выбранный период зарегистрировалось ${number(s.metrics.signups)} пользователей. Сопоставьте приток и активную аудиторию по платформам.`,`${number(s.metrics.signups)} users joined during this period. Compare acquisition to active users by platform.`),goto:'audience',tag:'MAU'},
    ];
    return `<div class="grid-main"><section class="card"><div class="card-inner"><div class="card-header"><div><h2 class="card-title">${T('Оценка потенциала','What-if calculator')}</h2><p class="card-subtitle">${T('Как изменение конверсии может повлиять на выручку','How an uplift in conversion could affect revenue')}</p></div></div>
      <div class="scenario-box"><span class="micro-label">${T('Дополнительная конверсия в оплату','Conversion uplift')} · +${number(state.scenario,1)} ${T('п.п.','pp')}</span><input aria-label="${T('Повышение конверсии','Conversion uplift')}" class="range-slider" data-scenario type="range" min="0" max="10" step="0.5" value="${state.scenario}">
      <div class="scenario-highlight">+${money(extraMoney,true)}</div><strong>${T('Условный рост выручки за период','Illustrative incremental revenue')}</strong>
      <p>${T(`Расчёт: ${number(s.metrics.users)} активных пользователей × ${number(state.scenario,1)} п.п. × средний платёж ${money(avgPay)}. Это сценарий, а не прогноз.`,`Formula: ${number(s.metrics.users)} active users × ${number(state.scenario,1)} pp × average payment ${money(avgPay)}. This is a scenario, not a forecast.`)}</p></div>
    </div></section><section class="narrative-card"><span class="hint">${T('Принцип аналитики','How to use the data')}</span><h3>${T('От вопроса к измеримому решению','From questions to measurable decisions')}</h3><p>${T('Связывайте каждую проблему с метрикой, гипотезой и измерением после изменения. Демонстрационные данные не описывают реальный бизнес.','Tie every problem to a metric, hypothesis, and measurement after the change. Synthetic data is not real business performance.')}</p></section></div>
    <div class="section-break"><h2>${T('На что обратить внимание','What to investigate')}</h2><p>${T('Выводы обновляются по фильтрам','Recommendations respond to selected filters')}</p></div>
    <div class="insight-grid">${items.map((item,i)=>`<div class="insight-tile"><div class="insight-top"><span class="insight-number">0${i+1}</span><span class="pill green">${item.tag}</span></div><h3>${item.name}</h3><p>${item.desc}</p><div class="insight-bottom"><span class="tiny-muted">${T('Следующий шаг','Next step')}</span><button data-page="${item.goto}">${T('Открыть анализ','Open analysis')} →</button></div></div>`).join('')}</div>`;
  }
  function renderModal(s) {
    if(!state.modal)return '';
    const m=state.modal;
    if(m.type==='daily-retention'){
      const row=dailyRetentionCohorts(s)[m.row];
      const age=row?.ages[m.col],value=row?.cells[m.col];
      if(!row||value===null||value===undefined)return '';
      return `<div class="overlay" data-overlay="1"><section class="overlay-panel" role="dialog" aria-modal="true" aria-label="${T('Удержание когорты','Cohort retention')}"><button type="button" class="overlay-x" data-close title="${T('Закрыть','Close')}">${ico('close')}</button><span class="eyebrow">${T('Когортное удержание','Cohort retention')}</span><h2>${shortDay(row.begin)}–${shortDay(row.end)} · D${age}</h2><p>${T('Доля зарегистрировавшихся за эту неделю пользователей, вернувшихся ровно в указанный день жизни продукта.','Share of this signup-week cohort returning on exactly this lifecycle day.')}</p><div class="detail-kpis"><div class="detail-kpi"><small>${T('Зарегистрировалось','Signup users')}</small><b>${number(row.users)}</b></div><div class="detail-kpi"><small>${T('Вернулись на D','Returned on D')}${age}</small><b>${number(Math.round(row.users*value))}</b></div><div class="detail-kpi"><small>${T('Удержание','Retention')}</small><b>${pct(value)}</b></div><div class="detail-kpi"><small>${T('Отслеживаемый день','Lifecycle day')}</small><b>D${age}</b></div></div><div class="modal-divider"></div><p>${T('В расчёт включаются только зрелые когорты, для которых день наблюдения уже наступил.','Only mature cohorts that have reached this lifecycle day are measured.')}</p></section></div>`;
    }
    if(m.type==='cohort'){
      const cohorts=makeCohorts(s),row=cohorts[m.row],value=row?.weeks[m.week];
      if(!row||value===null||value===undefined)return '';
      return `<div class="overlay" data-overlay="1"><section class="overlay-panel" role="dialog" aria-modal="true" aria-label="${T('Когортный анализ','Cohort analysis')}"><button class="overlay-x" data-close title="${T('Закрыть','Close')}">${ico('close')}</button><span class="eyebrow">${T('Детализация когорты','Cohort detail')}</span><h2>${shortDay(row.begin)}–${shortDay(row.end)} · W${m.week}</h2><p>${T('Доля пользователей этой недели регистрации, которые вернулись хотя бы один раз в указанную неделю жизни.','Share of this signup-week cohort returning at least once in the specified lifecycle week.')}</p><div class="detail-kpis"><div class="detail-kpi"><small>${T('В когорте','Cohort size')}</small><b>${number(row.users)}</b></div><div class="detail-kpi"><small>${T('Удержание','Retention')}</small><b>${pct(value)}</b></div></div><div class="modal-divider"></div><p>${T('Отсчёт W0 начинается с даты регистрации каждого пользователя. Незрелые недели скрыты.','W0 starts on each user’s own signup date. Incomplete lifecycle weeks are hidden.')}</p></section></div>`;
    }
    if(m.type==='metric'){
      const inf=metricInfo[m.metric]||metricInfo.dau;
      return `<div class="overlay" data-overlay="1"><section class="overlay-panel" role="dialog" aria-modal="true" aria-label="${T('Определение показателя','Metric definition')}"><button class="overlay-x" data-close title="${T('Закрыть','Close')}">${ico('close')}</button><span class="eyebrow">${T('Справочник показателей','Metric glossary')}</span><h2>${T(inf.ru,inf.en)}</h2><p>${T(inf.descRu,inf.descEn)}</p><div class="detail-kpis"><div class="detail-kpi"><small>${T('Текущее значение','Current value')}</small><b>${metricDisplay(m.metric,s.metrics[m.metric])}</b></div><div class="detail-kpi"><small>${T('Период','Date range')}</small><b style="font-size:14px">${shortDay(s.start)}–${shortDay(s.end)}</b></div></div></section></div>`;
    }
    if(m.type==='command'){
      return `<div class="overlay" data-overlay="1"><section class="overlay-panel" role="dialog" aria-modal="true" aria-label="${T('Быстрый переход','Quick navigation')}"><button class="overlay-x" data-close title="${T('Закрыть','Close')}">${ico('close')}</button><h2>${T('Куда перейти?','Where to?')}</h2><input type="search" class="command-input" data-command-input placeholder="${T('Поиск раздела…','Search sections…')}" autofocus><div class="command-list" id="command-list">${commandRows('')}</div><div class="modal-divider"></div><p style="margin:0;font-size:11px">Ctrl+K · Esc</p></section></div>`;
    }
    return '';
  }
  function commandRows(term) {
    const q=term.trim().toLowerCase();
    return tabs.filter(t=>(t.ru+' '+t.en+' '+t.id).toLowerCase().includes(q)).map(t=>`<button class="command-item" data-page="${t.id}">${ico(t.icon)}<span>${T(t.ru,t.en)}</span></button>`).join('')||`<p class="empty-state">${T('Ничего не найдено','Nothing found')}</p>`;
  }
  function filterSelect(field, options, label) {
    return `<div class="filter-group"><label for="sel-${field}">${label}</label><select id="sel-${field}" class="control" data-filter="${field}" aria-label="${label}"><option value="all">${T('Все','All')}</option>${options.map(v=>`<option value="${v}" ${state[field]===v?'selected':''}>${esc(groupName(v,field))}</option>`).join('')}</select></div>`;
  }
  function toolbar() {
    return `<section class="filterbar" aria-label="${T('Фильтры дашборда','Dashboard filters')}">
      <div class="filter-group"><label for="sel-range">${T('Период','Period')}</label><select id="sel-range" class="control" data-filter="range">${[7,30,90].map(v=>`<option value="${v}" ${state.range===v?'selected':''}>${T('Последние','Last')} ${v} ${T('дней','days')}</option>`).join('')}</select></div>
      <div class="filter-group"><label for="sel-end">${T('По дату','Until')}</label><input id="sel-end" class="control date-input" type="date" data-filter="end" min="${D.dateAt(90)}" max="${D.lastDate}" value="${D.dateAt(state.end)}"></div>
      <span class="divider-v"></span>
      ${filterSelect('platform',D.platforms,T('Платформа','Platform'))}
      ${filterSelect('country',D.countries,T('Страна','Country'))}
      ${filterSelect('channel',D.channels,T('Канал','Source'))}
      ${filterSelect('plan',['free','paid'],T('Тариф','Plan'))}
      <button class="filter-reset" data-reset title="${T('Очистить все фильтры','Reset all filters')}">${T('Сбросить','Reset')} ↺</button>
    </section>`;
  }
  const subtitles={
    overview:['Вся картина продукта — в одном месте','A clear picture of your product performance'],
    audience:['Кто приходит, как растёт аудитория и откуда пользователи','Who your users are, how they grow, and where they come from'],
    retention:['Понимайте, кто и когда возвращается в продукт','Understand who comes back — and when'],
    funnels:['На каких шагах теряются потенциальные покупатели','Find the drop-offs along the conversion journey'],
    revenue:['Платежи, выручка и экономика пользователей','Payments, revenue and user-level economics'],
    cohorts:['Поведение пользователей с одинаковой датой регистрации','How signup cohorts behave over time'],
    events:['Какие действия совершают пользователи','How users interact with your product'],
    insights:['Превращайте данные в проверяемые решения','Turn observed metrics into testable improvements']
  };
  function layout(s,body) {
    const item=tabs.find(t=>t.id===state.page)||tabs[0];
    const pageTitle=state.page==='overview'?T('Продукт под контролем','Your product, in focus'):T(item.ru,item.en);
    // page title is kept for search (set by geo-locale.js)
    document.documentElement.lang=state.lang;
    document.body.classList.toggle('dark',state.theme==='dark');
    return `<div class="shell"><aside class="sidebar ${state.navOpen?'open':''}" id="sidebar">
      <a href="../../index.html" class="brand"><span class="brand-emblem">${ico('activity')}</span><span><b>pulse<span style="color:#8de0ba">.</span></b><small>BY LEOANALYST</small></span></a>
      <div class="side-label">${T('Рабочее пространство','Workspace')}</div><nav class="side-nav" aria-label="${T('Разделы','Sections')}">
       ${tabs.map(t=>`<button type="button" class="nav-button ${state.page===t.id?'active':''}" title="${T(t.ru,t.en)}" aria-label="${T(t.ru,t.en)}" data-page="${t.id}" ${state.page===t.id?'aria-current="page"':''}><span class="nav-ico">${ico(t.icon)}</span>${T(t.ru,t.en)}</button>`).join('')}
      </nav><div class="sidebar-bottom"><div class="sidebar-note"><span class="status-dot"></span><strong>${T('Интерактивное демо','Interactive demo')}</strong><p>${T('Все показатели рассчитаны по вымышленным данным. Можно свободно менять фильтры.','All measures are based on fictional data. Feel free to explore filters.')}</p></div><a class="back-link" href="../../index.html">${ico('back')} ${T('На главную','Back to home')}</a></div>
    </aside><div class="main"><header class="topbar"><div class="topbar-left">
      <div class="topbar-logo"><span class="logo-dot">P</span><span><strong>Pulse</strong><small>${T('демо','demo')}</small></span></div>
      <nav class="workspace-tabs" aria-label="${T('Разделы аналитики','Analytics sections')}">${tabs.map(t=>`<button type="button" class="workspace-tab ${state.page===t.id?'active':''}" data-page="${t.id}" ${state.page===t.id?'aria-current="page"':''}>${T(t.ru,t.en)}</button>`).join('')}</nav>
      </div><div class="bar-actions"><span class="flag-chip"><span class="status-dot"></span>DEMO</span><button type="button" class="head-btn" data-command title="${T('Быстрый поиск','Quick search')} Ctrl+K">${ico('search')}<span class="btn-copy">Ctrl K</span></button><button type="button" class="head-btn head-text" data-lang title="${T('Сменить язык','Switch language')}">${state.lang.toUpperCase()}</button><button type="button" class="head-btn head-text" data-currency title="${T('Сменить валюту','Switch currency')}">${state.currency==='RUB'?'₽':'$'}</button><button type="button" class="head-btn theme-toggle" data-theme-toggle aria-label="${T('Переключить тему','Toggle theme')}" title="${T('Только эта кнопка меняет тему','This button changes the theme')}">${ico(state.theme==='dark'?'sun':'moon')}</button></div>
    </header><main class="content"><div class="page-head"><div><p class="eyebrow">${ico('activity','icon-inline')} ${T('ПРОДУКТОВАЯ АНАЛИТИКА / LIVE DEMO','PRODUCT ANALYTICS / LIVE DEMO')}</p><h1>${pageTitle}</h1><p class="subhead">${T(...subtitles[state.page])}</p></div><div class="page-cta"><button class="secondary-btn" data-detail="${state.metric}">${ico('info')} ${T('Методика','Definitions')}</button><button class="primary-btn" data-export="${state.page}">${ico('export')} CSV</button></div></div>${toolbar()}${body}<div class="demo-disclaimer">${T('Демонстрационные данные · локальная работа без сервера · курс 1 USD = 86,4 RUB (условный)','Fictional data · runs locally without a backend · 1 USD = 86.4 RUB (fixed demo rate)')}</div></main></div></div>${renderModal(s)}`;
  }
  function render() {
    charts=new Map();chartIndex=0;
    const s=getData();
    const views={overview,audience,retention:retentionPage,funnels:funnelsPage,revenue:revenuePage,cohorts:cohortPage,events:eventsPage,insights:insightsPage};
    root.innerHTML=layout(s,(views[state.page]||views.overview)(s));
    root.querySelectorAll('[data-chart]').forEach(el=>{
      el.addEventListener('pointermove',event=>chartPointer(el,event));
      el.addEventListener('pointerleave',()=>{const tip=el.querySelector('.chart-tooltip'),line=el.querySelector('.chart-hover-line'),dot=el.querySelector('.chart-hover-dot');if(tip)tip.hidden=true;if(line)line.setAttribute('visibility','hidden');if(dot)dot.setAttribute('visibility','hidden');});
    });
    if(state.modal?.type==='command')root.querySelector('[data-command-input]')?.focus();
  }
  function chartPointer(el,e) {
    const chart=charts.get(el.dataset.chart);
    if(!chart)return;
    const rect=el.getBoundingClientRect();
    const relative=(e.clientX-rect.left)/rect.width;
    const normalized=(relative-12/900)/((900-14-12)/900);
    const i=clamp(Math.round(normalized*(chart.values.length-1)),0,chart.values.length-1);
    const x=chart.positions[i][0],y=chart.positions[i][1];
    const line=el.querySelector('.chart-hover-line'),dot=el.querySelector('.chart-hover-dot'),tip=el.querySelector('.chart-tooltip');
    line.setAttribute('x1',x);line.setAttribute('x2',x);line.setAttribute('visibility','visible');
    dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('visibility','visible');
    const value=chart.values[i];
    const label=chart.format==='money'?money(value):chart.format==='percent'?number(value,1)+'%':number(value);
    tip.hidden=false;tip.innerHTML=`<small>${esc(chart.dates[i]||'')}</small>${label}`;
    const pos=rect.width*(x/chart.width);
    tip.style.left=clamp(pos+8,7,rect.width-132)+'px';
    tip.style.top=clamp(rect.height*(y/chart.height)-48,4,rect.height-55)+'px';
  }
  function nav(page) {if(!tabs.some(t=>t.id===page))return;state.page=page;state.navOpen=false;state.modal=null;state.search='';window.scrollTo({top:0,behavior:'instant'});render();}
  function reset() {Object.assign(state,{range:30,end:D.days-1,country:'all',platform:'all',channel:'all',plan:'all'});cache.key='';render();}
  function updateFilter(name,value) {
    if(name==='range')state.range=clamp(Number(value),7,90);
    else if(name==='end')state.end=clamp(Math.round((Date.parse(value+'T00:00:00Z')-D.originUTC)/D.DAY_MS),90,D.days-1);
    else if(['country','platform','channel','plan'].includes(name))state[name]=value;
    cache.key='';render();
  }
  function csvCell(value) {
    const raw=String(value===undefined||value===null?'':value);
    // Stop opening exported demo values as spreadsheet formulas.
    const safe=/^[=+@\-\t\r]/.test(raw) ? "'"+raw : raw;
    return '"'+safe.replaceAll('"','""')+'"';
  }
  function exportCSV(type) {
    const s=getData(); let name='',headers=[],rows=[];
    if(type==='transactions'||type==='revenue'){
      name='transactions';headers=['Date','User ID','Country','Platform','Amount USD'];
      rows=s.tx.map(tx=>[dateFor(tx.day),tx.id,tx.country,tx.platform,tx.usd.toFixed(2)]);
    }else if(type==='retention'){
      name='retention_cohorts';headers=['Signup week','Users','D0','D1','D3','D7','D14','D30','D60'];
      rows=dailyRetentionCohorts(s).map(c=>[dateFor(c.begin),c.users,...c.cells.map(v=>v===null?'':(v*100).toFixed(2)+'%')]);
    }else if(type==='cohorts'){
      name='cohorts';headers=['Signup week','Users',...Array.from({length:9},(_,i)=>'W'+i)];
      rows=makeCohorts(s).map(c=>[dateFor(c.begin),c.users,...c.weeks.map(v=>v===null?'':(v*100).toFixed(2)+'%')]);
    }else if(type==='events'){
      name='events';headers=['Event','Occurrences','Unique users'];
      rows=eventsList(s).map(r=>[r.en,r.count,r.users]);
    }else if(type==='audience'){
      name='audience';headers=['Dimension','Segment','Active users','New users','Revenue USD'];
      rows=['platform','country','channel'].flatMap(k=>Object.values(s.allSegments[k]).map(v=>[k,v.value,v.active,v.new,v.revenue.toFixed(2)]));
    }else if(type==='funnels'){
      name='funnel';headers=['Stage','Users','Share of signups'];
      rows=funnelFor(s).map(r=>[r.label,r.count,(r.percent*100).toFixed(2)+'%']);
    }else{
      name='product_metrics';headers=['Date','DAU','New users','Sessions','Payments','Revenue USD'];
      rows=s.daily.slice(s.start,s.end+1).map((d,i)=>[dateFor(s.start+i),d.active,d.new,d.sessions,d.purchases,d.revenue.toFixed(2)]);
    }
    const data='\uFEFF'+[headers,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n');
    const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8'}));
    link.download=`leoanalyst_${name}_${dateFor(s.end)}.csv`;document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(link.href),30000);
    toast(T('CSV успешно подготовлен','CSV export is ready'));
  }
  let toastTimer;
  function toast(message) {
    document.querySelector('.toast')?.remove();
    const el=document.createElement('div');el.className='toast';el.textContent=message;
    document.body.appendChild(el);clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.remove(),3500);
  }
  root.addEventListener('click',e=>{
    const hit=e.target.closest('[data-page],[data-metric],[data-funnel],[data-segment],[data-cohort],[data-retention-cell],[data-detail],[data-sort],[data-export],[data-reset],[data-theme-toggle],[data-lang],[data-currency],[data-command],[data-close],[data-menu],[data-audience],[data-overlay]');
    if(!hit)return;
    const d=hit.dataset;
    if(!hit.matches('button, a, [data-overlay]') && !hit.hasAttribute('data-segment'))return;
    if(d.overlay && e.target!==hit)return;
    if(d.page){nav(d.page);return;}
    if(d.metric){state.metric=d.metric;render();return;}
    if(d.funnel!==undefined){state.funnelStep=Number(d.funnel);render();return;}
    if(d.segment){const [kind,value]=d.segment.split('|');state[kind]=state[kind]===value?'all':value;cache.key='';render();return;}
    if(d.retentionCell){const [row,col]=d.retentionCell.split('|').map(Number);state.modal={type:'daily-retention',row,col};render();return;}
    if(d.cohort){const [row,week]=d.cohort.split('|').map(Number);state.modal={type:'cohort',row,week};render();return;}
    if(d.detail){state.modal={type:'metric',metric:d.detail};render();return;}
    if(d.sort){if(state.sort===d.sort)state.sortDesc=!state.sortDesc;else{state.sort=d.sort;state.sortDesc=d.sort!=='name';}render();return;}
    if(d.export){exportCSV(d.export);return;}
    if(d.reset!==undefined){reset();return;}
    if(d.themeToggle!==undefined && hit.matches('button[data-theme-toggle]')){state.theme=state.theme==='light'?'dark':'light';store('theme',state.theme);render();return;}
    if(d.lang!==undefined){state.lang=state.lang==='ru'?'en':'ru';store('lang',state.lang);render();return;}
    if(d.currency!==undefined){state.currency=state.currency==='RUB'?'USD':'RUB';store('currency',state.currency);render();return;}
    if(d.command!==undefined){state.modal={type:'command'};render();return;}
    if(d.close!==undefined || d.overlay!==undefined){state.modal=null;render();return;}
    if(d.menu!==undefined){state.navOpen=!state.navOpen;render();return;}
    if(d.audience){state.audienceMetric=d.audience;render();return;}
  });
  root.addEventListener('change',e=>{
    if(e.target.matches('select[data-filter],input[data-filter]')){
      // Native select/date fields are handled exclusively by change events.
      // No generic click handler can change the theme or steal the selection.
      const key=e.target.dataset.filter,value=e.target.value;
      updateFilter(key,value);
    }
  });
  root.addEventListener('input',e=>{
    if(e.target.hasAttribute('data-event-search')){
      state.search=e.target.value;
      const target=root.querySelector('#event-rows');if(target)target.innerHTML=eventRows(getData());
    }else if(e.target.hasAttribute('data-command-input')){
      root.querySelector('#command-list').innerHTML=commandRows(e.target.value);
    }else if(e.target.hasAttribute('data-scenario')){
      state.scenario=Number(e.target.value);
      const s=getData();
      const avg=s.metrics.purchases?s.metrics.revenue/s.metrics.purchases:14.99;
      const extra=s.metrics.users*state.scenario/100*avg;
      const lbl=root.querySelector('.scenario-box .micro-label');if(lbl)lbl.textContent=T('Дополнительная конверсия в оплату','Conversion uplift')+' · +'+number(state.scenario,1)+' '+T('п.п.','pp');
      const total=root.querySelector('.scenario-highlight');if(total)total.textContent='+'+money(extra,true);
      const p=root.querySelector('.scenario-box p');if(p)p.textContent=T(`Расчёт: ${number(s.metrics.users)} активных пользователей × ${number(state.scenario,1)} п.п. × средний платёж ${money(avg)}. Это сценарий, а не прогноз.`,`Formula: ${number(s.metrics.users)} active users × ${number(state.scenario,1)} pp × average payment ${money(avg)}. This is a scenario, not a forecast.`);
    }
  });
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();state.modal={type:'command'};render();}
    if(e.key==='Escape'&&(state.modal||state.navOpen)){state.modal=null;state.navOpen=false;render();}
  });
  render();
})();
