/* LeoAnalyst · Finance OS / interactive finance dashboard.
   Framework-free and static-host compatible. All figures are synthetic.
   Every panel derives from one transaction ledger; RUB amounts are converted only for display. */
(function(){
'use strict';
const D=window.FINANCE_DATA;
if(!D){document.body.textContent='Finance data not loaded';return;}
const el=document.getElementById('app');
const RU='ru',BASE=D.BASE_DATE,DAY=86400000;
const nav=[
 ['overview','Обзор','Overview','grid'],
 ['cashflow','Движение денег','Cash flow','activity'],
 ['pnl','Прибыль и убытки','Profit & loss','layers'],
 ['expenses','Расходы','Expenses','pie'],
 ['budgets','Бюджеты','Budgets','target'],
 ['transactions','Операции','Transactions','receipt'],
 ['forecast','Прогноз','Forecast','trend'],
 ['insights','Выводы','Insights','sparkles']
];
const SVG={
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/>',
 activity:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',layers:'<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
 pie:'<path d="M21 12a9 9 0 1 1-9-9v9Z"/><path d="M13 3a8 8 0 0 1 8 8h-8V3Z"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 receipt:'<path d="M4 2h16v20l-4-3-4 3-4-3-4 3V2Z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
 trend:'<path d="m3 18 7-7 4 4 7-8"/><path d="M16 7h5v5"/>',
 sparkles:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z"/><path d="M20 3v4M18 5h4"/>',
 moon:'<path d="M20.6 15.2A9 9 0 0 1 8.8 3.4a9 9 0 1 0 11.8 11.8Z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a3 3 0 0 1 6 1c0 2-3.5 2-3.5 5m0 3h.01"/>',
 chevron:'<path d="m9 18 6-6-6-6"/>',close:'<path d="M18 6 6 18M6 6l12 12"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',edit:'<path d="M14 5 19 10M3 21l5-.9L20 8a2.1 2.1 0 0 0-3-3L5 17l-2 4Z"/>',
 search:'<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
 arrowUp:'<path d="m6 14 6-6 6 6"/><path d="M12 8v12"/>',arrowDown:'<path d="m6 10 6 6 6-6"/><path d="M12 16V4"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
 wallet:'<rect x="3" y="6" width="18" height="15" rx="3"/><path d="M3 9V6a3 3 0 0 1 3-3h12M15 13h6v5h-6a2.5 2.5 0 0 1 0-5Z"/>',
 credit:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h5"/>',
 check:'<path d="m4 12 5 5L20 6"/>',refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5 9a8 8 0 0 1 14-2l1 5M4 12l1 5a8 8 0 0 0 14-2"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v6m0-9v.2"/>',filter:'<path d="M3 5h18M6 12h12M9 19h6"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
 chart:'<path d="M4 20V12m6 8V4m6 16v-9m5 9v-5"/>',
 shield:'<path d="m12 2 9 4v6c0 6-4 9-9 10C7 21 3 18 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
 arrowRight:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
 trash:'<path d="M3 6h18M8 6V4h8v2m-1 0-.7 15H9.7L9 6"/>',
 arrowLeft:'<path d="M20 12H5m6-6-6 6 6 6"/>'
};
function icon(name,size=18){return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${SVG[name]||SVG.grid}</svg>`;}
function storeGet(key,def){try{const v=localStorage.getItem('leoFinance_'+key);return v?JSON.parse(v):def;}catch(_){return def;}}
function storeSet(key,value){try{localStorage.setItem('leoFinance_'+key,JSON.stringify(value));}catch(_){}}
let custom=storeGet('transactions',[]),budgetEdits=storeGet('budgets',{});
let ledger=D.generateLedger().concat(custom);
const state={
 section:'overview',lang:storeGet('language','ru'),currency:storeGet('currency','RUB'),theme:storeGet('theme','light'),period:30,end:BASE,unit:'all',
 series:{income:true,expense:true},expenseCat:'all',txType:'all',txSearch:'',txSort:'date_desc',txShown:12,
 scenario:'base',growth:8,efficiency:5,horizon:6,modal:null,detailId:null,selectedBudget:null
};
function tx(ru,en){return state.lang===RU?ru:en;}
function e(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function day(s){return new Date(s+'T00:00:00Z');}
function iso(d){return d.toISOString().slice(0,10);}
function shift(s,n){return iso(new Date(day(s).getTime()+n*DAY));}
function dateFmt(s,short=false){return new Intl.DateTimeFormat(state.lang==='ru'?'ru-RU':'en-US',short?{day:'numeric',month:'short',timeZone:'UTC'}:{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(day(s));}
function monthFmt(s){return new Intl.DateTimeFormat(state.lang==='ru'?'ru-RU':'en-US',{month:'long',year:'numeric',timeZone:'UTC'}).format(day(s));}
function monthShortFmt(s){return new Intl.DateTimeFormat(state.lang==='ru'?'ru-RU':'en-US',{month:'short',year:'numeric',timeZone:'UTC'}).format(day(s));}
function labelUnit(id){const u=D.units.find(x=>x.id===id);return u?u[state.lang]:id;}
function labelCat(id){const c=D.categories.find(x=>x.id===id)||D.incomeStreams.find(x=>x.id===id);return c?c[state.lang]:id;}
function fnumber(n,dec=0){return new Intl.NumberFormat(state.lang==='ru'?'ru-RU':'en-US',{maximumFractionDigits:dec,minimumFractionDigits:dec}).format(n);}
function fmoney(rub,compact=false){const n=state.currency==='RUB'?rub:rub/D.RUB_PER_USD,abs=Math.abs(n);let v=n,s='';
 if(compact){if(abs>=1e6){v=n/1e6;s=tx(' млн','M');}else if(abs>=1000){v=n/1000;s=tx(' тыс.','K');}}
 const unit=state.currency==='RUB'?' ₽':' $';
 if(compact)return (state.currency==='USD'?'$':'')+fnumber(v,abs>=1e6?1:abs>=1000?1:0)+s+(state.currency==='RUB'?' ₽':'');
 return (state.currency==='USD'?'$':'')+fnumber(n,0)+(state.currency==='RUB'?' ₽':'');
}
function ratio(n,d){return d?100*n/d:0;}
function fpct(n,dec=1){return fnumber(n,dec)+'%';}
function signedPct(n){return `${n>=0?'+':''}${fpct(n,1)}`;}
function sum(arr,pred){return arr.reduce((v,x)=>v+(!pred||pred(x)?x.amount:0),0);}
function countBy(arr,type){return sum(arr,x=>x.type===type);}
function metrics(rows){const revenue=countBy(rows,'income'),expenses=countBy(rows,'expense');return{revenue,expenses,profit:revenue-expenses,margin:ratio(revenue-expenses,revenue),trans:rows.length};}
function rowsFor(start,end=state.end,unit=state.unit){return ledger.filter(x=>x.date>=start&&x.date<=end&&(unit==='all'||x.unit===unit));}
function range(){return{start:shift(state.end,-state.period+1),end:state.end};}
function context(){const r=range(),rows=rowsFor(r.start,r.end),pStart=shift(r.start,-state.period),pEnd=shift(r.start,-1),prev=rowsFor(pStart,pEnd),m=metrics(rows),pm=metrics(prev);return{...r,rows,prev,m,pm};}
function deltas(curr,prev){return !prev?0:100*(curr/prev-1);}
function durationText(){return tx('Период','Period')+': '+dateFmt(range().start,true)+' — '+dateFmt(state.end,true);}
function balanceAt(end=state.end,unit=state.unit){const share=unit==='all'?1:(D.units.find(x=>x.id===unit)?.daily||0)/D.units.reduce((a,x)=>a+x.daily,0);const rows=ledger.filter(x=>x.date<=end&&(unit==='all'||x.unit===unit));const m=metrics(rows);return Math.round(3700000*share)+m.profit;}
function textEmpty(){return `<div class="empty">${tx('Нет данных для выбранных фильтров','No data for current filters')}</div>`;}
function kCard(title,value,delta,subtitle,style=''){const deltaText=typeof delta==='number'?`<span class="mc-delta ${delta<0?'down':''}">${signedPct(delta)}</span>`:'';
 return `<article class="metric-card ${style}"><div class="decor"></div><div class="mc-title">${icon('activity',15)} ${title}</div><div class="mc-value">${value}</div><div class="mc-foot">${deltaText}<span>${subtitle}</span></div></article>`;}
function navButton(item){return `<button type="button" class="tab-btn ${state.section===item[0]?'active':''}" data-action="nav" data-page="${item[0]}" aria-current="${state.section===item[0]?'page':'false'}">${tx(item[1],item[2])}${item[0]==='insights'?'<span class="tabdot"></span>':''}</button>`;}
function uiHead(){let meta=nav.find(n=>n[0]===state.section)||nav[0];const descr={
 overview:['Все финансовые показатели бизнеса на одном экране','Your financial performance at a glance'],
 cashflow:['Контролируйте движение денег и остатки на счетах','Track your inflows, outflows and cash position'],
 pnl:['Узнайте, что формирует прибыль и рентабельность','Understand what drives profit and margins'],
 expenses:['Разбирайте структуру затрат до отдельных операций','Explore cost composition down to each transaction'],
 budgets:['Сравнивайте план и факт, управляйте лимитами','Compare budget vs actual and manage spending limits'],
 transactions:['Ищите, фильтруйте и добавляйте демонстрационные операции','Search, filter and add demo transactions'],
 forecast:['Проверьте сценарии развития и прогноз денежных средств','Model scenarios and project future cash'],
 insights:['Находите возможности роста на основе фактов','Find actionable opportunities backed by numbers']
};
 return `<header class="topbar"><div class="topbar-inner">
  <a href="../../index.html" class="brand" title="LeoAnalyst" target="_top"><div class="brand-mark">${icon('chart',21)}</div><div><div class="brand-name">LEO<span class="orange">.</span> FINANCE</div><div class="brand-caption">ANALYTICS STUDIO · DEMO</div></div></a>
  <nav class="main-tabs" aria-label="${tx('Разделы','Sections')}">${nav.map(navButton).join('')}</nav>
  <div class="topbar-actions"><span class="status-chip" title="${tx('Демонстрационные данные','Synthetic demo data')}">${tx('Демо','Demo')}</span>
   <button class="lang-btn" data-action="lang" aria-label="${tx('Сменить язык','Change language')}">${state.lang==='ru'?'RU':'EN'}</button>
   <button class="currency-btn" data-action="currency" title="${tx('Переключить валюту','Switch currency')}">${state.currency==='RUB'?'₽ RUB':'$ USD'}</button>
   <button class="icon-btn" data-action="theme" aria-label="${tx('Переключить тему','Switch theme')}">${icon(state.theme==='light'?'moon':'sun')}</button>
   <span class="avatar">LA</span>
  </div></div></header>
  <nav class="rail" aria-label="${tx('Быстрая навигация','Quick navigation')}">${nav.slice(0,7).map(n=>`<button class="rail-btn ${state.section===n[0]?'active':''}" title="${tx(n[1],n[2])}" data-action="nav" data-page="${n[0]}">${icon(n[3])}</button>`).join('')}<div class="rail-sep"></div><button class="rail-btn ${state.section==='insights'?'active':''}" title="${tx('Выводы','Insights')}" data-action="nav" data-page="insights">${icon('sparkles')}</button></nav>
  <main class="dashboard"><div class="breadcrumbs"><span class="live-dot"></span>LEOANALYST <span> / </span> FINANCE OS <span> / </span> <span class="orange">${tx(meta[1],meta[2])}</span></div>
  <div class="heading-row"><div><h1 class="page-title">${tx(meta[1],meta[2])}</h1><p class="page-sub">${tx(...descr[state.section])} · ${tx('Все данные вымышленные','All data is synthetic')}</p></div>
  <div class="heading-actions"><button class="btn btn-secondary" data-action="help">${icon('info')}${tx('Методика','Methodology')}</button><button class="btn btn-primary" data-action="export">${icon('download')}${tx('Скачать CSV','Export CSV')}</button></div></div>`;
}
function filterBar(){return `<section class="filters" aria-label="${tx('Фильтры','Filters')}"><span class="filter-label">${tx('Период','Period')}</span>
  <div class="pill-group">${[30,90,365].map(n=>`<button type="button" data-action="period" data-days="${n}" class="${state.period===n?'active':''}">${n===365?tx('Год','1 year'):n+' '+tx('дней','days')}</button>`).join('')}</div>
  <div class="filter-vline"></div><label class="filter-label" for="dateEnd">${tx('По дату','As of')}</label><input id="dateEnd" data-filter="end" class="form-input" type="date" value="${state.end}" min="2025-10-14" max="${BASE}"/>
  <div class="filter-vline"></div><label class="filter-label" for="unitSelect">${tx('Направление','Business unit')}</label><select id="unitSelect" data-filter="unit" class="form-select"><option value="all">${tx('Все направления','All units')}</option>${D.units.map(u=>`<option value="${u.id}" ${u.id===state.unit?'selected':''}>${e(u[state.lang])}</option>`).join('')}</select>
  <div class="filters-spacer"></div><span class="date-chip">${icon('calendar',14)} ${dateFmt(range().start,true)} — ${dateFmt(state.end,true)}</span><button class="btn btn-soft small-btn" data-action="reset">${icon('refresh',13)}${tx('Сбросить','Reset')}</button></section>`;}
function foot(){return `<div class="footer-note">© LeoAnalyst · Finance OS. ${tx('Это интерактивный макет с вымышленными данными. Не является финансовой отчётностью или инвестиционным советом. Курс демонстрации:','Synthetic interactive showcase; not financial reporting or advice. Demo rate:')} $1 = ${fnumber(D.RUB_PER_USD)} ₽ · ${tx('Состояние на','Data through')} ${dateFmt(BASE)}.</div></main>`;}
function makeChartShell(svg){return `<div class="chart"><div class="chart-tooltip" aria-hidden="true"></div>${svg}</div>`;}
function chooseBuckets(rows,days=state.period,end=state.end){
 const endD=day(end).getTime(),startD=endD-(days-1)*DAY;
 let step=days<=35?1:days<=100?7:30;
 const buckets=[],count=Math.ceil(days/step);
 for(let i=0;i<count;i++){
  const first=new Date(startD+i*step*DAY),last=new Date(Math.min(endD,startD+(i+1)*step*DAY-DAY));
  buckets.push({start:iso(first),end:iso(last),income:0,expense:0,profit:0,label:dateFmt(iso(first),true)});
 }
 for(const r of rows){const idx=Math.floor((day(r.date).getTime()-startD)/DAY/step);if(idx>=0&&idx<buckets.length){buckets[idx][r.type]+=r.amount;buckets[idx].profit+=r.type==='income'?r.amount:-r.amount;}}
 return buckets;
}
function pathSmooth(points){if(!points.length)return'';if(points.length===1)return`M ${points[0][0]} ${points[0][1]}`;
 let d=`M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
 for(let i=0;i<points.length-1;i++){const p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];const c1x=p1[0]+(p2[0]-p0[0])/6,c1y=p1[1]+(p2[1]-p0[1])/6,c2x=p2[0]-(p3[0]-p1[0])/6,c2y=p2[1]-(p3[1]-p1[1])/6;d+=` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;}
 return d;
}
function curveChart(buckets, opts={}){
 if(!buckets.length)return textEmpty();
 const keys=opts.keys||['income','expense'],colors={income:'#79aeea',expense:'#d89989',profit:'#96c9b0',cash:'#90b7ec'},titles={income:tx('Выручка','Revenue'),expense:tx('Расходы','Expenses'),profit:tx('Прибыль','Profit'),cash:tx('Остаток денег','Cash balance')};
 const visible=keys.filter(k=>!opts.useLegend||state.series[k]!==false);
 if(!visible.length)return textEmpty();
 const cm=compactCharts(),w=cm?chartW():990,h=cm?250:300,left=cm?58:105,right=cm?12:24,top=20,bottom=cm?40:48,plotW=w-left-right,plotH=h-top-bottom;
 const all=visible.flatMap(k=>buckets.map(b=>b[k]||0)),rawMax=Math.max(1000,...all),rawMin=Math.min(0,...all);
 const max=rawMax*1.17,min=rawMin<0?rawMin*1.15:0,span=Math.max(1,max-min);
 const X=i=>left+(buckets.length===1?plotW/2:(i/(buckets.length-1))*plotW),Y=value=>top+(max-value)/span*plotH;
 const palette=opts.dark?{income:'#9bbff1',expense:'#d5b5a8',profit:'#9dd4ae',cash:'#c6df8c'}:colors;
 let grid='',labels='';
 for(let j=0;j<=4;j++){const v=min+(max-min)*(1-j/4),y=Y(v);grid+=`<line x1="${left}" y1="${y}" x2="${w-right}" y2="${y}" stroke="var(--canvasGrid)" stroke-dasharray="4 7"/>`;
 labels+=`<text x="${left-(cm?8:18)}" y="${y+4}" text-anchor="end" font-size="${cm?10:11}" fill="var(--muted)">${e(fmoney(v,true))}</text>`;}
 const labelStep=Math.max(1,Math.ceil(buckets.length/(cm?4:7)));
 buckets.forEach((b,i)=>{if(i%labelStep===0||i===buckets.length-1)labels+=`<text x="${X(i)}" y="${h-15}" text-anchor="middle" font-size="11" fill="var(--muted)">${e(b.label)}</text>`;});
 let paths='';
 for(const k of visible){const pts=buckets.map((b,i)=>[X(i),Y(b[k]||0)]),p=pathSmooth(pts),area=`${p} L ${X(buckets.length-1)} ${Y(0)} L ${X(0)} ${Y(0)} Z`;
  paths+=`<path d="${area}" fill="url(#fill-${k})" opacity="${k==='income'?.6:.12}"/>`;
  paths+=`<path d="${p}" fill="none" stroke="${palette[k]||'#88b4cf'}" stroke-width="3.4" stroke-linecap="round" ${k==='expense'?'stroke-dasharray="7 6"':''}/>`;
  pts.forEach((p,i)=>{if(i%Math.max(1,Math.round(buckets.length/10))===0||i===buckets.length-1)paths+=`<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="${palette[k]}" stroke="var(--surface)" stroke-width="2"/>`;});
 }
 let hits='';const width=plotW/Math.max(1,buckets.length-1);buckets.forEach((b,i)=>{
  const tip=[`${dateFmt(b.start)}${b.start!==b.end?' — '+dateFmt(b.end):''}`, ...visible.map(k=>`${titles[k]}: ${fmoney(b[k]||0)}`)].join('\n');
  hits+=`<rect class="chart-hit" x="${Math.max(left,X(i)-width/2)}" y="${top}" width="${Math.min(width,w-right-Math.max(left,X(i)-width/2))}" height="${plotH}" fill="transparent" data-tip="${e(tip)}"/>`;
 });
 const defs=Object.entries(palette).map(([k,c])=>`<linearGradient id="fill-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c}" stop-opacity=".38"/><stop offset="100%" stop-color="${c}" stop-opacity="0"/></linearGradient>`).join('');
 return makeChartShell(`<svg role="img" aria-label="${e(tx('График финансовых показателей','Financial metrics chart'))}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet"><defs>${defs}</defs>${grid}${labels}${paths}${hits}</svg>`);
}
function drawBars(items,opts={}){
 const cm=compactCharts(),w=cm?chartW():900,h=cm?240:280,left=cm?54:85,right=cm?10:20,top=18,bottom=cm?40:48,ph=h-top-bottom,pw=w-left-right;
 const series=opts.keys||['income','expense'],max=Math.max(1,...items.flatMap(b=>series.map(k=>b[k]||0)))*1.25;
 const y=v=>top+(max-v)/max*ph;
 let svg='';for(let i=0;i<=4;i++){const v=max*(4-i)/4,Y=y(v);svg+=`<line x1="${left}" y1="${Y}" x2="${w-right}" y2="${Y}" stroke="var(--canvasGrid)" stroke-dasharray="4 7"/><text x="${left-10}" y="${Y+3}" text-anchor="end" font-size="10" fill="var(--muted)">${e(fmoney(v,true))}</text>`;}
 const groupW=pw/items.length,barW=Math.max(5,Math.min(23,groupW/(series.length+1.2)));
 items.forEach((b,i)=>{let x=left+groupW*i+groupW/2-barW*series.length/2;
 series.forEach((k,j)=>{const val=Math.max(0,b[k]||0),Y=y(val);svg+=`<rect data-tip="${e(dateFmt(b.start)+'\n'+(k==='income'?tx('Выручка','Revenue'):tx('Расходы','Expenses'))+': '+fmoney(val))}" class="chart-hit" x="${x+j*barW}" y="${Y}" width="${Math.max(2,barW-3)}" height="${Math.max(0,h-bottom-Y)}" rx="3" fill="${k==='income'?'#87b3f0':'#b7d8bb'}"/>`;});
 if(i%Math.max(1,Math.ceil(items.length/(cm?4:7)))===0||i===items.length-1)svg+=`<text x="${left+groupW*(i+.5)}" y="${h-17}" text-anchor="middle" font-size="10" fill="var(--muted)">${e(b.label)}</text>`;});
 return makeChartShell(`<svg role="img" aria-label="${e(tx('Гистограмма поступлений и выплат','Inflow and outflow bars'))}" viewBox="0 0 ${w} ${h}">${svg}</svg>`);
}
function polar(cx,cy,r,a){const t=(a-90)*Math.PI/180;return[cx+r*Math.cos(t),cy+r*Math.sin(t)];}
function arc(cx,cy,r,start,end){const a=polar(cx,cy,r,end),b=polar(cx,cy,r,start);return`M ${a[0].toFixed(2)} ${a[1].toFixed(2)} A ${r} ${r} 0 ${end-start>180?1:0} 0 ${b[0].toFixed(2)} ${b[1].toFixed(2)}`;}
function marginGauge(margin){const pct=Math.max(0,Math.min(100,margin)),angle=240*pct/100;
 return `<svg class="gauge-svg" viewBox="0 0 250 170" aria-label="${tx('Рентабельность','Profit margin')} ${fpct(margin)}" role="img"><path d="${arc(125,127,89,-120,120)}" fill="none" stroke="var(--surface2)" stroke-width="17" stroke-linecap="round"/><path d="${arc(125,127,89,-120,-120+Math.max(.02,angle))}" fill="none" stroke="${margin<15?'#e0a17d':'var(--lime)'}" stroke-width="17" stroke-linecap="round"/><circle cx="${polar(125,127,89,-120+angle)[0]}" cy="${polar(125,127,89,-120+angle)[1]}" r="8" fill="var(--lime)" stroke="var(--surface)" stroke-width="3"/><text x="125" y="96" font-size="27" font-weight="850" fill="var(--ink)" text-anchor="middle">${e(fpct(margin))}</text><text x="125" y="113" font-size="9" fill="var(--muted)" text-anchor="middle">${tx('ЧИСТАЯ МАРЖА','NET MARGIN')}</text></svg>`;
}
function sectionHeader(title,sub,tools=''){return `<div class="panel-head"><div><h2 class="panel-title">${title}</h2>${sub?`<p class="panel-sub">${sub}</p>`:''}</div><div class="panel-actions">${tools}</div></div>`;}
function nameIcon(kind){return `<span class="table-avatar">${icon(kind==='income'?'arrowDown':'arrowUp',14)}</span>`;}
function tableRecent(rows,max=6){const list=rows.slice().sort((a,b)=>b.date.localeCompare(a.date)||b.amount-a.amount).slice(0,max);
 if(!list.length)return textEmpty();
 return `<div class="table-wrap"><table class="t-table"><thead><tr><th>${tx('Контрагент','Counterparty')}</th><th>${tx('Направление','Business unit')}</th><th>${tx('Дата','Date')}</th><th class="num">${tx('Сумма','Amount')}</th></tr></thead><tbody>${list.map(r=>`<tr data-row-id="${e(r.id)}"><td><div class="name-cell">${nameIcon(r.type)}<div><b>${e(r['partner'+(state.lang==='ru'?'Ru':'En')]||r.description||'—')}</b><div class="quiet">${e(labelCat(r.category))}</div></div></div></td><td>${e(labelUnit(r.unit))}</td><td class="table-date">${dateFmt(r.date,true)}</td><td class="num" style="font-weight:800;color:${r.type==='income'?'var(--positive)':'var(--ink)'}">${r.type==='income'?'+':'−'}${fmoney(r.amount)}</td></tr>`).join('')}</tbody></table></div>`;
}
function overview(ctx){const {m,pm,rows}=ctx;const buckets=chooseBuckets(rows);const month=state.end.slice(0,7),md=monthRows();
 const catActual=D.categories.map(c=>({id:c.id,name:c[state.lang],color:c.color,spent:sum(md,x=>x.type==='expense'&&x.category===c.id)})).sort((a,b)=>b.spent-a.spent);
 const unitSummary=D.units.map(u=>({name:u[state.lang],color:u.accent,revenue:sum(rows,x=>x.unit===u.id&&x.type==='income')}));const total=m.revenue||1;
 return `<div class="metric-grid">
 ${kCard(tx('Выручка','Revenue'),fmoney(m.revenue,true),deltas(m.revenue,pm.revenue),tx('к предыдущему периоду','vs prior period'),'feature')}
 ${kCard(tx('Чистая прибыль','Net profit'),fmoney(m.profit,true),deltas(m.profit,pm.profit),tx('после всех расходов','after expenses'),'blue')}
 ${kCard(tx('Расходы','Expenses'),fmoney(m.expenses,true),deltas(m.expenses,pm.expenses),tx('за выбранный период','in selected period'))}
 ${kCard(tx('Рентабельность','Net margin'),fpct(m.margin),m.margin-pm.margin,tx('доля прибыли в выручке','profit share of revenue'),'mint')}
 </div>
 <div class="layout-main"><section class="panel">${sectionHeader(tx('Финансовая динамика','Financial performance'),tx('Поступления и расходы по датам — наведите на график','Revenue and expenses over time — hover for detail'),`<span class="mini-tag">${state.period} ${tx('дней','days')}</span>`)}
 ${curveChart(buckets,{keys:['income','expense'],useLegend:true})}
 <div class="section-bottom"><div class="chart-legend"><button class="legend-btn ${!state.series.income?'off':''}" data-action="series" data-series="income"><span class="legend-dot" style="background:#79aeea"></span>${tx('Выручка','Revenue')}</button><button class="legend-btn ${!state.series.expense?'off':''}" data-action="series" data-series="expense"><span class="legend-dot" style="background:#d89989"></span>${tx('Расходы','Expenses')}</button></div><span class="section-hint">${tx('Все графики реагируют на фильтры','All charts follow selected filters')}</span></div></section>
 <section class="panel">${sectionHeader(tx('Здоровье финансов','Financial health'),tx('Доля чистой прибыли','Net profit relative to revenue'))}<div class="gauge-box">${marginGauge(m.margin)}<div class="gauge-details"><div><small>${tx('Чистая прибыль','Net profit')}</small><b>${fmoney(m.profit,true)}</b></div><div style="text-align:right"><small>${tx('Остаток денег','Cash balance')}</small><b>${fmoney(balanceAt(),true)}</b></div></div></div></section></div>
 <div class="layout-half"><section class="panel">${sectionHeader(tx('Выручка по направлениям','Revenue by business unit'),tx('Распределение дохода за выбранный период','Income contribution across business units'))}
 ${unitSummary.map(u=>`<div class="rank-row"><div class="rank-label">${e(u.name)}</div><div class="progress-track"><div class="progress-fill" style="width:${ratio(u.revenue,total).toFixed(2)}%;background:${u.color==='#c6e1ff'?'#8bbcf4':u.color==='#c4eadd'?'#80bea8':'#e9a57f'}"></div></div><div class="rank-val">${fpct(ratio(u.revenue,total),0)}</div></div>`).join('')}
 <div class="section-bottom"><span class="footnote">${tx('Можно отфильтровать любое направление сверху','Filter by business unit above')}</span><button class="pill-link" data-action="nav" data-page="pnl">${tx('Отчёт о прибыли','Profit report')} ${icon('arrowRight',13)}</button></div></section>
 <section class="panel">${sectionHeader(tx('Крупнейшие статьи расходов','Top spending categories'),tx('Текущий месяц:','Current month:')+' '+monthFmt(month+'-01'))}
 ${catActual.slice(0,4).map(c=>`<div class="progress-row"><div class="progress-name"><i class="dot" style="background:${c.color}"></i>${e(c.name)}</div><b>${fmoney(c.spent,true)}</b></div><div class="progress-track" style="margin-bottom:11px"><div class="progress-fill" style="background:${c.color};width:${ratio(c.spent,Math.max(1,...catActual.map(x=>x.spent)))}%"></div></div>`).join('')}
 <div class="section-bottom"><span class="footnote">${tx('Фактические расходы с начала месяца','Actual spending month to date')}</span><button class="pill-link" data-action="nav" data-page="expenses">${tx('Подробнее','Details')} ${icon('arrowRight',13)}</button></div></section></div>
 <section class="panel">${sectionHeader(tx('Последние операции','Recent transactions'),tx('Поступления и списания из единого журнала','Inflows and outflows from the shared ledger'),`<button class="btn btn-secondary small-btn" data-action="nav" data-page="transactions">${tx('Все операции','All transactions')} ${icon('arrowRight',13)}</button>`)}${tableRecent(rows,6)}</section>`;
}
function cashflow(ctx){const{rows,m,pm}=ctx,buckets=chooseBuckets(rows),balance=balanceAt();
 const monthly=rollByMonth(rows);const max=Math.max(1,...monthly.map(x=>Math.max(x.income,x.expense)));
 const trend=balanceTrend(buckets);
 return `<div class="metric-grid">
 ${kCard(tx('Поступления','Cash inflows'),fmoney(m.revenue,true),deltas(m.revenue,pm.revenue),tx('за выбранный период','selected period'),'feature')}
 ${kCard(tx('Выплаты','Cash outflows'),fmoney(m.expenses,true),deltas(m.expenses,pm.expenses),tx('за выбранный период','selected period'),'blue')}
 ${kCard(tx('Чистый поток','Net cash flow'),fmoney(m.profit,true),deltas(m.profit,pm.profit),tx('поступления − выплаты','inflows − outflows'))}
 ${kCard(tx('Остаток денег','Cash balance'),fmoney(balance,true),null,tx('на конец выбранного периода','at selected end date'),'mint')}
 </div><div class="layout-main"><section class="panel">${sectionHeader(tx('Движение денежных средств','Cash flow by period'),tx('Сравнение поступлений и выплат','Inflows versus outflows'))}${drawBars(buckets)}<div class="chart-legend"><span class="legend-btn"><span class="legend-dot" style="background:#87b3f0"></span>${tx('Поступления','Inflows')}</span><span class="legend-btn"><span class="legend-dot" style="background:#b7d8bb"></span>${tx('Выплаты','Outflows')}</span></div></section>
 <section class="panel">${sectionHeader(tx('Денежная позиция','Cash position'),tx('Накопленный остаток по дням','Running closing balance'))}${curveChart(trend,{keys:['cash']})}<div class="callout"><div class="ico">${icon('wallet')}</div><div><div class="callout-title">${tx('Остаток на конец периода','Closing balance')}</div><div class="callout-text">${fmoney(balance)} · ${dateFmt(state.end)}</div></div></div></section></div>
 <div class="layout-half"><section class="panel">${sectionHeader(tx('Краткая сводка','Cash flow summary'),tx('Формула: поступления − выплаты','Inflow minus outflow'))}
 <div class="cash-line"><div class="small-kpi"><small>${tx('Поступления','Inflows')}</small><b>${fmoney(m.revenue,true)}</b><span>${tx('денег получено','received')}</span></div><div class="small-kpi"><small>${tx('Выплаты','Outflows')}</small><b>${fmoney(m.expenses,true)}</b><span>${tx('денег выплачено','paid')}</span></div><div class="small-kpi"><small>${tx('Изменение','Net change')}</small><b>${fmoney(m.profit,true)}</b><span>${tx('остаток изменился','cash movement')}</span></div></div>
 <p class="footnote">${tx('Демо: движение денежных средств приравнено к операциям журнала, без дебиторской задолженности и начислений.','Demo: cash flow uses ledger transactions directly; receivables and accruals are omitted.')}</p></section>
 <section class="panel">${sectionHeader(tx('Структура выплат','Breakdown of outflows'),tx('По направлениям бизнеса','By business unit'))}
 ${D.units.map(u=>{const v=sum(rows,x=>x.unit===u.id&&x.type==='expense');return `<div class="rank-row"><div class="rank-label">${e(u[state.lang])}</div><div class="progress-track"><div class="progress-fill" style="width:${ratio(v,m.expenses)}%;background:${u.accent}"></div></div><span class="rank-val">${fmoney(v,true)}</span></div>`;}).join('')}</section></div>
 <section class="panel">${sectionHeader(tx('Последние движения средств','Recent cash movements'),tx('Нажмите на строку для подробностей','Click a row to inspect a transaction'))}${tableRecent(rows,8)}</section>`;
}
function balanceTrend(buckets){let running=balanceAt(shift(range().start,-1)),arr=[];buckets.forEach(b=>{running+=b.profit;arr.push({...b,cash:running});});return arr;}
function rollByMonth(rows){const map=new Map();for(const r of rows){const k=r.date.slice(0,7);if(!map.has(k))map.set(k,{month:k,income:0,expense:0,profit:0});const x=map.get(k);x[r.type]+=r.amount;x.profit+=r.type==='income'?r.amount:-r.amount;}return [...map.values()].sort((a,b)=>a.month.localeCompare(b.month));}
function pnl(ctx){const {rows,prev,m,pm}=ctx,categories=D.categories.map(c=>({...c,current:sum(rows,x=>x.type==='expense'&&x.category===c.id),prev:sum(prev,x=>x.type==='expense'&&x.category===c.id)}));
 const p=(name,val,previous,emph=false,indent=false)=>`<div class="pnl-row ${emph?'emph':''}"><div class="${indent?'indent':''}">${name}</div><div class="num">${fmoney(val)}</div><div class="num quiet">${fmoney(previous)}</div><div class="num ${deltas(val,previous)>=0?'delta-pos':'delta-neg'}">${signedPct(deltas(val,previous))}</div></div>`;
 const revUnits=D.units.map(u=>({name:u[state.lang],current:sum(rows,x=>x.unit===u.id&&x.type==='income'),previous:sum(prev,x=>x.unit===u.id&&x.type==='income')}));
 return `<div class="metric-grid">${kCard(tx('Выручка','Revenue'),fmoney(m.revenue,true),deltas(m.revenue,pm.revenue),tx('за период','during period'),'feature')}${kCard(tx('Валовый результат','Operating result'),fmoney(m.profit,true),deltas(m.profit,pm.profit),tx('без учёта сложных начислений','simplified cash basis'),'blue')}${kCard(tx('Все расходы','Total costs'),fmoney(m.expenses,true),deltas(m.expenses,pm.expenses),tx('операционные и налоговые','operating and tax costs'))}${kCard(tx('Маржа','Profit margin'),fpct(m.margin),m.margin-pm.margin,tx('доля прибыли в выручке','profit share'),'mint')}</div>
 <div class="layout-main"><section class="panel">${sectionHeader(tx('Отчёт о прибылях и убытках','Profit and loss statement'),tx('План-факт не смешиваются: текущий период и предыдущий равной длины','Current period vs prior period of equal length'))}
 <div class="pnl-row head"><div>${tx('Статья','Line item')}</div><div class="num">${tx('Текущий','Current')}</div><div class="num">${tx('Предыдущий','Previous')}</div><div class="num">${tx('Изменение','Change')}</div></div>
 ${p(tx('Выручка','Revenue'),m.revenue,pm.revenue,true)}
 ${revUnits.map(u=>p(e(u.name),u.current,u.previous,false,true)).join('')}
 ${p(tx('Расходы','Expenses'),m.expenses,pm.expenses,true)}
 ${categories.map(c=>p(e(c[state.lang]),c.current,c.prev,false,true)).join('')}
 ${p(tx('Чистая прибыль','Net profit'),m.profit,pm.profit,true)}
 <div class="pnl-row emph"><div>${tx('Рентабельность','Profit margin')}</div><div class="num">${fpct(m.margin)}</div><div class="num">${fpct(pm.margin)}</div><div class="num">${signedPct(m.margin-pm.margin).replace('%',tx(' п.п.',' pp'))}</div></div>
 <p class="footnote">${tx('Демонстрационная управленческая модель: прибыль = выручка − все расходы. НДС, амортизация, дебиторская задолженность и учёт по начислению отдельно не моделируются.','Simplified demo management P&L: profit = revenue − all expenses. VAT, depreciation, receivables and accruals are not modeled.')}</p></section>
 <section class="panel">${sectionHeader(tx('Куда уходит выручка','Revenue allocation'),tx('Как распределён каждый рубль дохода','How each ruble of revenue is allocated'))}
 ${m.revenue?`<div style="display:flex;overflow:hidden;height:20px;border-radius:100px;margin:27px 0 16px"><div style="width:${Math.max(0,m.margin)}%;background:#b7d6a0"></div>${categories.map(c=>`<div style="width:${ratio(c.current,m.revenue)}%;background:${c.color}" title="${e(c[state.lang])}"></div>`).join('')}</div>`:textEmpty()}
 <div class="progress-row"><span class="progress-name"><i class="dot" style="background:#b7d6a0"></i>${tx('Чистая прибыль','Net profit')}</span><b>${fpct(m.margin)}</b></div>
 ${categories.map(c=>`<div class="progress-row"><span class="progress-name"><i class="dot" style="background:${c.color}"></i>${e(c[state.lang])}</span><b>${fpct(ratio(c.current,m.revenue))}</b></div>`).join('')}
 <div class="callout"><div class="ico">${icon('info')}</div><div><div class="callout-title">${tx('Результат в выбранном периоде','Result for selected period')}</div><div class="callout-text">${tx('Компания оставляет','The business retains')} ${fmoney(m.profit)} ${tx('после расходов из','after expenses out of')} ${fmoney(m.revenue)}.</div></div></div></section></div>
 <section class="panel">${sectionHeader(tx('Месячная динамика P&L','Monthly profit and loss'),tx('Сопоставление выручки и расходов','Revenue versus expenses by month'))}${drawBars(rollByMonth(rows).map(x=>({...x,start:x.month+'-01',label:dateFmt(x.month+'-01',true)})))}</section>`;
}
function expenses(ctx){const{rows,m}=ctx;const items=D.categories.map(c=>({...c,value:sum(rows,x=>x.type==='expense'&&x.category===c.id)}));
 const selected=state.expenseCat==='all'?null:items.find(x=>x.id===state.expenseCat);
 const expenseRows=rows.filter(x=>x.type==='expense'&&(state.expenseCat==='all'||x.category===state.expenseCat));
 const total=m.expenses||1;
 const segments=donutHtml(items,selected?.id);
 const vendors=new Map();for(const r of expenseRows){const k=state.lang==='ru'?r.partnerRu:r.partnerEn;vendors.set(k,(vendors.get(k)||0)+r.amount);}
 const topVendors=[...vendors].sort((a,b)=>b[1]-a[1]).slice(0,6);
 return `<div class="metric-grid">${kCard(tx('Все расходы','Total expenses'),fmoney(m.expenses,true),null,tx('за выбранный период','in selected period'),'feature')}${kCard(tx('Крупнейшая статья','Top cost category'),e([...items].sort((a,b)=>b.value-a.value)[0]?.[state.lang]||'—'),null,tx('по сумме расходов','by amount'),'blue')}${kCard(tx('Доля зарплат','Payroll share'),fpct(ratio(items[0].value,m.expenses)),null,tx('в структуре затрат','of total expenses'))}${kCard(tx('Расходы / выручка','Expense ratio'),fpct(ratio(m.expenses,m.revenue)),null,tx('доля затрат в доходах','share of revenue'),'peach')}</div>
 <div class="layout-main"><section class="panel">${sectionHeader(tx('Структура затрат','Expense composition'),tx('Нажмите на категорию, чтобы открыть детализацию','Click a category to drill down'),`<button data-action="expense-cat" data-category="all" class="btn btn-secondary small-btn">${tx('Все расходы','All expenses')}</button>`)}
 <div class="donut-layout"><div>${segments}</div><div class="cat-list">${items.slice().sort((a,b)=>b.value-a.value).map(c=>`<button class="cat-row ${selected?.id===c.id?'active':''}" data-action="expense-cat" data-category="${c.id}"><span class="cat-name"><i class="cat-dot" style="background:${c.color}"></i>${e(c[state.lang])}</span><span class="cat-share">${fmoney(c.value,true)} · ${fpct(ratio(c.value,total),0)}</span></button>`).join('')}</div></div></section>
 <section class="panel">${sectionHeader(tx('Крупнейшие получатели','Top expense recipients'),selected?e(selected[state.lang]):tx('Все категории','All categories'))}
 ${topVendors.map(([name,amt])=>`<div class="rank-row"><span class="rank-label" title="${e(name)}">${e(name)}</span><div class="progress-track"><div class="progress-fill" style="width:${ratio(amt,Math.max(1,topVendors[0][1]))}%;background:var(--blue2)"></div></div><span class="rank-val">${fmoney(amt,true)}</span></div>`).join('')}
 <div class="callout"><div class="ico">${icon('sparkles')}</div><div><div class="callout-title">${tx('Возможность оптимизации','Optimization opportunity')}</div><div class="callout-text">${tx('Снижение выбранных затрат на 5% может экономить','A 5% reduction in selected spending could save')} ${fmoney((selected?selected.value:m.expenses)*.05,true)} ${tx('за период','over the selected period')}.</div></div></div></section></div>
 <section class="panel">${sectionHeader(tx('Операции по затратам','Expense transactions'),tx('Выберите строку для просмотра','Select a row for more detail'),`<button class="btn btn-secondary small-btn" data-action="nav" data-page="transactions">${tx('Полный журнал','Full ledger')} ${icon('arrowRight',13)}</button>`)}${tableRecent(expenseRows,10)}</section>`;
}
function donutHtml(items,active){const total=items.reduce((a,c)=>a+c.value,0)||1;let angle=0;let parts='';
 for(const c of items){const a=360*c.value/total,from=angle,to=angle+a;angle=to;
 parts+=`<path class="donut-segment" data-action="expense-cat" data-category="${c.id}" d="${arc(120,120,84,from,to)}" stroke="${c.color}" stroke-width="${active&&active!==c.id?16:23}" fill="none" stroke-linecap="butt" data-tip="${e(c[state.lang]+': '+fmoney(c.value)+' ('+fpct(ratio(c.value,total))+')')}" style="opacity:${active&&active!==c.id?.3:1}"/>`;
 }
 return `<svg class="donut" role="img" aria-label="${tx('Структура расходов','Expense categories')}" viewBox="0 0 240 240">${parts}<text x="120" y="112" text-anchor="middle" font-size="11" fill="var(--muted)">${tx('РАСХОДЫ','EXPENSES')}</text><text x="120" y="140" text-anchor="middle" font-size="24" font-weight="850" fill="var(--ink)">${e(fmoney(total,true))}</text><text x="120" y="159" text-anchor="middle" font-size="10" fill="var(--muted)">${items.length} ${tx('категорий','categories')}</text></svg>`;
}
function monthRows(){const mm=state.end.slice(0,7);return ledger.filter(r=>r.date.slice(0,7)===mm&&r.date<=state.end&&(state.unit==='all'||r.unit===state.unit));}
function budgetFor(catId){const cat=D.categories.find(x=>x.id===catId),unitDaily=state.unit==='all'?D.units.reduce((a,u)=>a+u.daily,0):D.units.find(x=>x.id===state.unit)?.daily||0;
 const base=Math.round(unitDaily*30*.72*cat.share*1.035);
 const key=`${state.end.slice(0,7)}|${state.unit}|${catId}`;
 return{key,plan:budgetEdits[key]??base,default:base};
}
function budgets(ctx){const month=state.end.slice(0,7),data=monthRows(),items=D.categories.map(c=>{const actual=sum(data,x=>x.type==='expense'&&x.category===c.id),plan=budgetFor(c.id).plan;return{...c,actual,plan,variance:plan-actual,util:ratio(actual,plan)};});
 const actual=items.reduce((a,x)=>a+x.actual,0),plan=items.reduce((a,x)=>a+x.plan,0),over=items.filter(x=>x.actual>x.plan).length;
 return `<div class="metric-grid">${kCard(tx('Бюджет месяца','Monthly budget'),fmoney(plan,true),null,monthFmt(month+'-01'),'feature')}${kCard(tx('Потрачено','Spent so far'),fmoney(actual,true),null,tx('с начала месяца','month to date'),'blue')}${kCard(tx('Остаток лимита','Budget remaining'),fmoney(plan-actual,true),null,tx('план − факт','budget − actual'),'mint')}${kCard(tx('Превышение лимитов','Over-limit categories'),fnumber(over),null,tx('из','out of')+' '+D.categories.length+' '+tx('категорий','categories'))}</div>
 <div class="layout-main"><section class="panel">${sectionHeader(tx('Исполнение бюджета','Budget utilization'),monthFmt(month+'-01')+' · '+tx('факт на','actual through')+' '+dateFmt(state.end),`<button class="btn btn-secondary small-btn" data-action="reset-budgets">${icon('refresh',13)}${tx('Сбросить планы','Reset plans')}</button>`)}
 <div class="callout" style="margin-top:0;margin-bottom:18px"><div class="ico">${icon('info')}</div><div><div class="callout-title">${tx('План на полный месяц','Full-month plan')}</div><div class="callout-text">${tx('Факт считается до выбранной даты. При изменении лимита остальные показатели пересчитываются.','Actuals include days through selected date. Budget edits update every related metric.')}</div></div></div>
 <div class="budget-grid">${items.map(c=>`<div class="budget-card ${c.util>100?'over':''}"><div class="budget-top"><div class="budget-name"><i style="width:10px;height:10px;border-radius:5px;background:${c.color}"></i>${e(c[state.lang])}</div><button class="budget-edit" title="${tx('Изменить план','Edit budget')}" data-action="edit-budget" data-category="${c.id}">${icon('edit',13)}</button></div><div class="budget-sum">${fmoney(c.actual,true)}<small>/ ${fmoney(c.plan,true)}</small></div><div class="budget-stat"><span>${tx('Использовано','Utilization')}</span><b>${fpct(c.util,0)}</b></div><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100,c.util)}%;background:${c.util>100?'#d87f75':c.color}"></div></div><div class="budget-status"><span class="${c.util>100?'overtext':'goodtext'}">${c.util>100?tx('Лимит превышен','Over budget'):tx('В пределах плана','Within budget')}</span><b>${c.variance>=0?'+':'−'}${fmoney(Math.abs(c.variance),true)}</b></div></div>`).join('')}</div></section>
 <section class="panel">${sectionHeader(tx('План и факт','Budget vs actual'),tx('Расходы по категориям','Spending by category'))}
 ${items.map(c=>`<div style="margin:17px 0"><div class="progress-row"><div class="progress-name"><i class="dot" style="background:${c.color}"></i>${e(c[state.lang])}</div><b>${fmoney(c.actual,true)} / ${fmoney(c.plan,true)}</b></div><div class="progress-track" style="height:11px"><div class="progress-fill" style="background:${c.util>100?'#de8a75':'#92bee2'};width:${Math.min(100,c.util)}%"></div></div></div>`).join('')}
 <div class="callout"><div class="ico">${icon('sparkles')}</div><div><div class="callout-title">${tx('Ваша финансовая дисциплина','Budget health')}</div><div class="callout-text">${over?tx('Превышение лимита в','Over budget in')+' '+over+' '+tx('категориях','categories'):tx('Все категории пока укладываются в месячные лимиты.','All categories are within their monthly limits so far.')}</div></div></div></section></div>`;
}
function filteredTransactions(rows){let out=rows.filter(r=>(state.txType==='all'||r.type===state.txType));const q=state.txSearch.trim().toLocaleLowerCase();
 if(q)out=out.filter(r=>[r.id,r.partnerRu,r.partnerEn,r.description,r.category,labelCat(r.category),labelUnit(r.unit)].some(x=>String(x||'').toLocaleLowerCase().includes(q)));
 out.sort((a,b)=>{
  switch(state.txSort){case'amount_desc':return b.amount-a.amount;case'amount_asc':return a.amount-b.amount;case'date_asc':return a.date.localeCompare(b.date)||a.id.localeCompare(b.id);default:return b.date.localeCompare(a.date)||b.id.localeCompare(a.id);}
 });return out;
}
function fullTable(rows){const list=filteredTransactions(rows),visible=list.slice(0,state.txShown);
 if(!visible.length)return `<div id="transactionCount" class="tx-count">0</div>${textEmpty()}`;
 return `<div class="tx-count" id="transactionCount">${tx('Показано','Showing')} ${fnumber(visible.length)} ${tx('из','of')} ${fnumber(list.length)}</div><div class="table-wrap"><table class="t-table"><thead><tr><th>${tx('Операция','Transaction')}</th><th>${tx('Дата','Date')}</th><th>${tx('Категория','Category')}</th><th>${tx('Направление','Unit')}</th><th>${tx('Тип','Type')}</th><th class="num">${tx('Сумма','Amount')}</th></tr></thead><tbody>${visible.map(r=>`<tr data-row-id="${e(r.id)}"><td><div class="name-cell">${nameIcon(r.type)}<div><b>${e(r['partner'+(state.lang==='ru'?'Ru':'En')]||r.description||'—')}</b><div class="quiet">${e(r.id)}</div></div></div></td><td class="table-date">${dateFmt(r.date,true)}</td><td>${e(labelCat(r.category))}</td><td>${e(labelUnit(r.unit))}</td><td><span class="tag ${r.type}">${r.type==='income'?tx('Приход','Income'):tx('Расход','Expense')}</span></td><td class="num" style="font-weight:830;color:${r.type==='income'?'var(--positive)':'var(--ink)'}">${r.type==='income'?'+':'−'}${fmoney(r.amount)}</td></tr>`).join('')}</tbody></table></div>${list.length>state.txShown?`<button class="load-btn" data-action="more">${tx('Показать ещё 20','Show 20 more')} (${fnumber(list.length-state.txShown)} ${tx('осталось','remaining')})</button>`:''}`;
}
function transactions(ctx){const{m,rows}=ctx;return `<div class="metric-grid">${kCard(tx('Всего операций','Transactions'),fnumber(rows.length),null,tx('за выбранный период','selected period'),'feature')}${kCard(tx('Поступления','Inflows'),fmoney(m.revenue,true),null,tx('сумма доходов','incoming total'),'blue')}${kCard(tx('Списания','Outflows'),fmoney(m.expenses,true),null,tx('сумма расходов','outgoing total'))}${kCard(tx('Чистый результат','Net movement'),fmoney(m.profit,true),null,tx('приход − расход','inflows − outflows'),'mint')}</div>
 <section class="panel">${sectionHeader(tx('Журнал операций','Transaction ledger'),tx('Поиск, сортировка, детализация и добавление своих операций','Search, sort, inspect and create demo transactions'),`<button class="btn btn-primary small-btn" data-action="new-tx">${icon('plus',14)}${tx('Новая операция','New transaction')}</button>`)}
 <div class="tx-tools"><div class="search-box">${icon('search',16)}<input id="txSearch" type="search" placeholder="${tx('Контрагент, категория, ID...','Partner, category, ID...')}" autocomplete="off" value="${e(state.txSearch)}" /></div>
 <select class="form-select" data-filter="tx-type"><option value="all" ${state.txType==='all'?'selected':''}>${tx('Все типы','All types')}</option><option value="income" ${state.txType==='income'?'selected':''}>${tx('Поступления','Income')}</option><option value="expense" ${state.txType==='expense'?'selected':''}>${tx('Списания','Expenses')}</option></select>
 <select class="form-select" data-filter="tx-sort"><option value="date_desc" ${state.txSort==='date_desc'?'selected':''}>${tx('Сначала новые','Newest first')}</option><option value="date_asc" ${state.txSort==='date_asc'?'selected':''}>${tx('Сначала старые','Oldest first')}</option><option value="amount_desc" ${state.txSort==='amount_desc'?'selected':''}>${tx('По сумме ↓','Amount ↓')}</option><option value="amount_asc" ${state.txSort==='amount_asc'?'selected':''}>${tx('По сумме ↑','Amount ↑')}</option></select>
 <button class="btn btn-secondary small-btn" data-action="export-transactions">${icon('download',14)}CSV</button></div>
 <div id="txResults">${fullTable(rows)}</div></section>`;
}
function forecastModel(){const end=state.end,start=shift(end,-89),rows=rowsFor(start,end),base=metrics(rows);
 // 90-day history converted to 30-day equivalent; scenarios are illustrative.
 const monthRev=base.revenue/3,monthExp=base.expenses/3;
 const adjust=state.scenario==='optimistic'?{r:4,e:-3}:state.scenario==='conservative'?{r:-4,e:5}:{r:0,e:0};
 let cash=balanceAt(),out=[];
 for(let i=1;i<=state.horizon;i++){
  const monthlyGrowth=(state.growth+adjust.r)/100;
  const revenue=monthRev*Math.pow(1+monthlyGrowth,i);
  const expense=monthExp*Math.pow(1+.012,i)*(1-state.efficiency/100)*(1+adjust.e/100);
  const profit=revenue-expense;cash+=profit;
  const p=day(end);p.setUTCMonth(p.getUTCMonth()+i);
  out.push({month:iso(p),start:iso(p),end:iso(p),label:monthShortFmt(iso(p)),income:revenue,expense,profit,cash});
 }
 return out;
}
function forecast(){const f=forecastModel(),total=f.reduce((a,x)=>a+x.profit,0),first=f[0],last=f.at(-1),scenarios=[['base','Базовый','Base'],['optimistic','Оптимистичный','Optimistic'],['conservative','Осторожный','Conservative']];
 return `<div class="metric-grid">${kCard(tx('Прогноз выручки','Forecast revenue'),fmoney(first.income,true),null,tx('первый месяц','first month'),'feature')}${kCard(tx('Прогноз прибыли','Forecast profit'),fmoney(total,true),null,state.horizon+' '+tx('месяцев суммарно','months combined'),'blue')}${kCard(tx('Ожидаемый остаток','Projected cash'),fmoney(last.cash,true),null,tx('на конец горизонта','at end of horizon'))}${kCard(tx('Прогноз маржи','Forecast margin'),fpct(ratio(last.profit,last.income)),null,tx('последний месяц','last forecast month'),'mint')}</div>
 <section class="panel" style="margin-bottom:15px">${sectionHeader(tx('Конструктор сценариев','Scenario simulator'),tx('Параметры примерные и доступны для изменения','Assumptions are illustrative and editable'))}
 <div class="scenario-cards">${scenarios.map(s=>`<button class="scenario-btn ${state.scenario===s[0]?'active':''}" data-action="scenario" data-scenario="${s[0]}">${tx(s[1],s[2])}</button>`).join('')}</div>
 <div class="control-row"><span class="control-label">${tx('Рост выручки в месяц','Monthly revenue growth')}</span><input type="range" min="-10" max="25" step="1" id="growthRange" value="${state.growth}" data-slider="growth"/><b class="control-value" id="growthVal">${state.growth>=0?'+':''}${state.growth}%</b><div class="filter-vline"></div><span class="control-label">${tx('Снижение расходов','Expense optimization')}</span><input type="range" min="0" max="25" step="1" id="efficiencyRange" value="${state.efficiency}" data-slider="efficiency"/><b class="control-value" id="efficiencyVal">${state.efficiency}%</b><div class="filter-vline"></div><label for="horizon" class="control-label">${tx('Горизонт','Horizon')}</label><select id="horizon" data-filter="horizon" class="form-select">${[3,6,12].map(n=>`<option value="${n}" ${state.horizon===n?'selected':''}>${n} ${tx('мес.','mo.')}</option>`).join('')}</select></div>
 <p class="footnote">${tx('Прогноз строится на среднем результате последних 90 дней. Изменение ползунков пересчитывает модель после отпускания.','Projection uses the most recent 90-day average. Sliders recalculate on release.')}</p></section>
 <div class="layout-main"><section class="panel">${sectionHeader(tx('Прогноз поступлений и выплат','Projected revenues and expenses'),tx('По месяцам — два ряда на единой шкале','Monthly values on a shared scale'))}${drawBars(f)}</section><section class="panel">${sectionHeader(tx('Прогноз остатка денег','Projected cash balance'),tx('Накопление денежных средств','Expected closing balance'))}${curveChart(f,{keys:['cash']})}</section></div>
 <div class="layout-half"><section class="panel">${sectionHeader(tx('Результат сценария','Scenario readout'),tx('Изменения по результатам модели','Outcomes based on scenario assumptions'))}
 <div class="stat-pair"><span>${tx('Деньги сейчас','Cash at start')}</span><b>${fmoney(balanceAt())}</b></div><div class="stat-pair"><span>${tx('Деньги в конце','Cash at end')}</span><b>${fmoney(last.cash)}</b></div><div class="stat-pair"><span>${tx('Прирост денег','Cash gain')}</span><b>${fmoney(total)}</b></div><div class="stat-pair"><span>${tx('Выручка за весь прогноз','Total projected revenue')}</span><b>${fmoney(f.reduce((a,x)=>a+x.income,0))}</b></div><div class="stat-pair"><span>${tx('Затраты за весь прогноз','Total projected expenses')}</span><b>${fmoney(f.reduce((a,x)=>a+x.expense,0))}</b></div></section>
 <section class="panel">${sectionHeader(tx('Помесячная модель','Monthly projection'),tx('Наведите на график или смотрите таблицу','Hover on chart or explore table'))}
 <div class="table-wrap"><table class="t-table" ><thead><tr><th>${tx('Месяц','Month')}</th><th class="num">${tx('Выручка','Revenue')}</th><th class="num">${tx('Расходы','Expenses')}</th><th class="num">${tx('Прибыль','Profit')}</th></tr></thead><tbody>${f.map(x=>`<tr><td>${monthShortFmt(x.month)}</td><td class="num">${fmoney(x.income,true)}</td><td class="num">${fmoney(x.expense,true)}</td><td class="num">${fmoney(x.profit,true)}</td></tr>`).join('')}</tbody></table></div></section></div>`;
}
function insights(ctx){const{m,pm,rows}=ctx,cat=D.categories.map(c=>({...c,value:sum(rows,x=>x.type==='expense'&&x.category===c.id)})).sort((a,b)=>b.value-a.value);
 const top=cat[0],dRev=deltas(m.revenue,pm.revenue),dCost=deltas(m.expenses,pm.expenses),margin=m.margin;
 const monthData=monthRows(),monthSpent=countBy(monthData,'expense'),budget=D.categories.reduce((a,c)=>a+budgetFor(c.id).plan,0);
 const expOpt=m.expenses*.05,cash=balanceAt(),unitVals=D.units.map(u=>({...u,value:sum(rows,x=>x.unit===u.id&&x.type==='income')})).sort((a,b)=>b.value-a.value);
 const insightItems=[
 {type:dRev>=0?'good':'risk',icon:'trend',title:tx(dRev>=0?'Выручка растёт':'Выручка снижается',dRev>=0?'Revenue is growing':'Revenue is declining'),desc:tx('Изменение к предыдущему периоду такой же длины. Изучите вклад направлений и каналов.','Change against an equal-length previous period. Review unit and channel contributions.'),num:signedPct(dRev)},
 {type:margin>=20?'good':'risk',icon:'pie',title:tx('Показатель рентабельности','Profit margin watch'),desc:tx('Чистая прибыль как процент выручки. Проверьте, как рост расходов влияет на результат.','Net profit as a share of revenue. Track whether costs are rising faster than sales.'),num:fpct(margin)},
 {type:'risk',icon:'target',title:tx('Резерв оптимизации затрат','Spending improvement potential'),desc:tx(`Уменьшение расходов на 5% в текущем периоде увеличило бы прибыль на ${fmoney(expOpt)} без учёта побочных эффектов.`,`A 5% cut in expenses would raise profit by ${fmoney(expOpt)} during the period, ignoring side effects.`),num:fmoney(expOpt,true)},
 {type:monthSpent>budget?'risk':'good',icon:'wallet',title:tx('Соблюдение бюджета','Budget performance'),desc:tx('Месячный план сравнивается с фактом с начала месяца по выбранную дату.','Full-month plan versus month-to-date actuals through the selected date.'),num:fpct(ratio(monthSpent,budget))}
 ];
 return `<div class="metric-grid">${kCard(tx('Рост доходов','Revenue movement'),signedPct(dRev),null,tx('к предыдущему периоду','vs previous period'),'feature')}${kCard(tx('Изменение затрат','Cost movement'),signedPct(dCost),null,tx('к предыдущему периоду','vs previous period'),'blue')}${kCard(tx('Потенциал экономии','Potential savings'),fmoney(expOpt,true),null,tx('если снизить расходы на 5%','if costs drop by 5%'))}${kCard(tx('Остаток денег','Cash balance'),fmoney(cash,true),null,tx('на конец периода','at period end'),'mint')}</div>
 <div class="insight-grid">${insightItems.map(x=>`<article class="insight type-${x.type}"><div class="insight-icon">${icon(x.icon)}</div><h3>${x.title}</h3><p>${x.desc}</p><div class="readout"><strong>${x.num}</strong>${tx(' · расчёт по демонстрационным данным',' · calculated from synthetic data')}</div></article>`).join('')}</div>
 <div class="layout-half" style="margin-top:15px"><section class="panel">${sectionHeader(tx('Вклад направлений в выручку','Revenue contributors'),tx('Кому принадлежит наибольшая доля доходов','Which units contribute most revenue'))}
 ${unitVals.map(u=>`<div class="rank-row"><span class="rank-label">${e(u[state.lang])}</span><div class="progress-track"><div class="progress-fill" style="width:${ratio(u.value,m.revenue)}%;background:${u.accent}"></div></div><span class="rank-val">${fpct(ratio(u.value,m.revenue))}</span></div>`).join('')}
 </section><section class="panel">${sectionHeader(tx('Ключевая статья затрат','Dominant cost category'),tx('Самая большая доля расходов','Largest share of expenses'))}
 <div style="font-size:27px;font-weight:860;letter-spacing:-.04em;margin:23px 0 5px">${e(top?.[state.lang]||'—')}</div><div class="quiet" style="font-size:13px">${fmoney(top?.value||0)} · ${fpct(ratio(top?.value||0,m.expenses))} ${tx('всех затрат','of costs')}</div><div class="progress-track" style="margin:19px 0"><div class="progress-fill" style="width:${ratio(top?.value||0,m.expenses)}%;background:${top?.color}"></div></div><button class="pill-link" data-action="nav" data-page="expenses">${tx('Разобрать расходы','Explore costs')}${icon('arrowRight',13)}</button></section></div>
 <div class="callout"><div class="ico">${icon('info')}</div><div><div class="callout-title">${tx('Что означают выводы','About these insights')}</div><div class="callout-text">${tx('Это примеры аналитических гипотез на вымышленных финансовых данных. Они помогают показать подход к работе, но не являются рекомендацией для реального бизнеса.','These are illustrative hypotheses based on fictional numbers. They demonstrate an analytical workflow and are not real financial advice.')}</div></div></div>`;
}
function modalHtml(){if(!state.modal)return'';
 let inner='';
 if(state.modal==='help'){
  inner=`<div class="modal-head"><div class="modal-title">${tx('Как рассчитываются показатели','How the metrics work')}</div><button type="button" class="icon-btn" data-action="close-modal" aria-label="Close">${icon('close')}</button></div>
  <p class="footnote">${tx('Все цифры рассчитаны по сгенерированным операциям. Таблицы и графики используют единый источник данных.','All figures are calculated from a generated transaction ledger; panels use the same source.')}</p>
  ${[
  [tx('Выручка','Revenue'),tx('Сумма входящих операций','Sum of income transactions')],
  [tx('Расходы','Expenses'),tx('Сумма исходящих операций','Sum of expense transactions')],
  [tx('Прибыль','Profit'),tx('Выручка − расходы','Revenue − expenses')],
  [tx('Чистая маржа','Net margin'),tx('Прибыль / выручка × 100%','Profit / revenue × 100%')],
  [tx('Остаток денег','Cash balance'),tx('Начальный демо-остаток + накопленный денежный поток','Demo opening cash + cumulative net cash flows')],
  [tx('Бюджет','Budget'),tx('Заданный месячный план против реальных расходов за прошедшие дни месяца','Monthly planned amount vs month-to-date spend')],
  [tx('Прогноз','Forecast'),tx('Средние суммы за предыдущие 90 дней с допущениями по росту и расходам','Recent 90-day monthly averages with growth and cost assumptions')]
  ].map(([k,v])=>`<div class="key-value"><label>${k}</label><strong style="font-weight:650;max-width:300px">${v}</strong></div>`).join('')}
  <p class="inline-alert">${tx('Валюта: база хранится в рублях. Пересчёт в доллары по фиксированному демонстрационному курсу 92 ₽/$, не по курсу ЦБ.','Currency: base ledger amounts use RUB. USD display is converted at the fixed demo rate 92 RUB/$, not a live FX quote.')}</p>
  <div class="modal-footer"><button type="button" class="btn btn-primary" data-action="close-modal">${tx('Понятно','Got it')}</button></div>`;
 }
 if(state.modal==='budget'){
  const c=D.categories.find(x=>x.id===state.selectedBudget),b=budgetFor(c.id),current=state.currency==='RUB'?b.plan:b.plan/D.RUB_PER_USD;
  inner=`<div class="modal-head"><div class="modal-title">${tx('Изменить бюджет','Edit budget')}</div><button type="button" class="icon-btn" data-action="close-modal">${icon('close')}</button></div>
   <p class="panel-sub">${e(c[state.lang])} · ${monthFmt(state.end.slice(0,7)+'-01')} · ${state.unit==='all'?tx('весь бизнес','all units'):e(labelUnit(state.unit))}</p>
   <form id="budgetForm"><div class="form-field"><label for="budgetValue">${tx('План на месяц','Monthly budget')} (${state.currency==='RUB'?'₽':'$'})</label><input id="budgetValue" name="budget" type="number" min="0" max="99999999999" step="1" value="${Math.round(current)}" required class="form-input"/></div><div class="inline-alert">${tx('Изменение сохраняется в этом браузере, не на сервере. Можно восстановить стандартный план.','Changes are saved in your browser only; you can reset them at any time.')}</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-action="close-modal">${tx('Отмена','Cancel')}</button><button type="submit" class="btn btn-primary">${icon('check',15)}${tx('Сохранить план','Save budget')}</button></div></form>`;
 }
 if(state.modal==='transaction'){
  inner=`<div class="modal-head"><div class="modal-title">${tx('Новая операция','New transaction')}</div><button type="button" class="icon-btn" data-action="close-modal">${icon('close')}</button></div>
  <p class="panel-sub">${tx('Добавленная операция появится во всех финансовых отчётах, если попадает в выбранный период.','A new entry will affect every financial report if it falls in the current date range.')}</p>
  <form id="transactionForm">
    <div class="form-field"><label for="newType">${tx('Тип операции','Transaction type')}</label><select class="form-select" id="newType" name="type" data-field="new-type"><option value="income">${tx('Поступление','Income')}</option><option value="expense">${tx('Списание','Expense')}</option></select></div>
    <div class="form-field"><label for="newDate">${tx('Дата','Date')}</label><input class="form-input" id="newDate" name="date" type="date" min="2025-09-15" max="${BASE}" value="${state.end}" required /></div>
    <div class="form-field"><label for="newAmount">${tx('Сумма','Amount')} (${state.currency==='RUB'?'₽':'$'})</label><input class="form-input" id="newAmount" name="amount" type="number" min="1" step="1" placeholder="10000" required /></div>
    <div class="form-field"><label for="newUnit">${tx('Направление','Business unit')}</label><select class="form-select" id="newUnit" name="unit">${D.units.map(u=>`<option value="${u.id}" ${state.unit===u.id?'selected':''}>${e(u[state.lang])}</option>`).join('')}</select></div>
    <div class="form-field"><label for="newCategory">${tx('Категория','Category')}</label><select class="form-select" id="newCategory" name="category">${D.incomeStreams.map(x=>`<option value="${x.id}">${e(x[state.lang])}</option>`).join('')}</select></div>
    <div class="form-field"><label for="newDescription">${tx('Контрагент / описание','Partner / description')}</label><input class="form-input" id="newDescription" name="description" type="text" maxlength="100" placeholder="${tx('Например: Новый клиент','Example: New customer')}" required /></div>
    <div class="modal-footer"><button type="button" class="btn btn-secondary" data-action="close-modal">${tx('Отмена','Cancel')}</button><button type="submit" class="btn btn-primary">${icon('plus',15)}${tx('Добавить операцию','Add transaction')}</button></div>
  </form>`;
 }
 if(state.modal==='detail'){
  const r=ledger.find(x=>x.id===state.detailId);if(!r){state.modal=null;return'';}
  const line=(k,v)=>`<div class="key-value"><label>${k}</label><strong>${v}</strong></div>`;
  inner=`<div class="modal-head"><div class="modal-title">${tx('Детали операции','Transaction details')}</div><button type="button" class="icon-btn" data-action="close-modal">${icon('close')}</button></div>
  <div style="font-size:34px;font-weight:860;letter-spacing:-.045em;color:${r.type==='income'?'var(--positive)':'var(--ink)'}">${r.type==='income'?'+':'−'}${fmoney(r.amount)}</div>
  <p class="panel-sub">${r.type==='income'?tx('Поступление','Income'):tx('Списание','Expense')} · ${e(r.id)}</p>
  ${line(tx('Дата','Date'),dateFmt(r.date))}
  ${line(tx('Направление','Unit'),e(labelUnit(r.unit)))}
  ${line(tx('Категория','Category'),e(labelCat(r.category)))}
  ${line(tx('Контрагент','Partner'),e(r['partner'+(state.lang==='ru'?'Ru':'En')]||r.description||'—'))}
  ${line(tx('Статус','Status'),tx('Проведено','Completed'))}
  <div class="modal-footer">${r.id.startsWith('USER-')?`<button class="btn btn-danger" data-action="delete-tx" data-id="${e(r.id)}">${icon('trash',14)}${tx('Удалить','Delete')}</button>`:''}<button type="button" class="btn btn-primary" data-action="close-modal">${tx('Закрыть','Close')}</button></div>`;
 }
 return `<div class="modal-backdrop" data-overlay><section class="modal-dialog" role="dialog" aria-modal="true" aria-label="${e(tx('Диалог','Dialog'))}">${inner}</section></div>`;
}
function compactCharts(){return window.innerWidth<720}
function chartW(){return Math.max(280,Math.min(990,Math.round(window.innerWidth-56)))}
let _lastChartW=null;window.addEventListener('resize',()=>{const k=compactCharts()?chartW():'wide';if(k!==_lastChartW){_lastChartW=k;clearTimeout(window._rz);window._rz=setTimeout(()=>{try{render()}catch(_){}} ,150)}});
function render(){_lastChartW=compactCharts()?chartW():'wide';document.documentElement.setAttribute('lang',state.lang);document.documentElement.setAttribute('data-theme',state.theme);document.querySelector('meta[name="theme-color"]')?.setAttribute('content',state.theme==='light'?'#f5f6f8':'#111416');
 const ctx=context();let main='';switch(state.section){
 case'cashflow':main=cashflow(ctx);break;
 case'pnl':main=pnl(ctx);break;
 case'expenses':main=expenses(ctx);break;
 case'budgets':main=budgets(ctx);break;
 case'transactions':main=transactions(ctx);break;
 case'forecast':main=forecast(ctx);break;
 case'insights':main=insights(ctx);break;
 default:main=overview(ctx);break;
 }
 el.innerHTML=`<div class="app-root">${uiHead()}${filterBar()}<div class="section-enter">${main}</div>${foot()}</div>${modalHtml()}`;
}
function saveState(){storeSet('theme',state.theme);storeSet('language',state.lang);storeSet('currency',state.currency);}
function toast(message){document.querySelector('.toast')?.remove();const box=document.createElement('div');box.className='toast';box.textContent=message;document.body.appendChild(box);setTimeout(()=>box.remove(),2400);}
function scrollTop(){window.scrollTo({top:0,behavior:'smooth'});}
function exporter(rows,filename){const h=['ID','Date','Unit','Type','Category','Amount_RUB','Amount_USD','Partner'];
 const protect=s=>{const raw=String(s==null?'':s);const safe=/^[=+@\-]/.test(raw)?"'"+raw:raw;return '"'+safe.replace(/"/g,'""')+'"';};
 const lines=[h.join(';'),...rows.map(r=>[r.id,r.date,r.unit,r.type,r.category,r.amount,(r.amount/D.RUB_PER_USD).toFixed(2),r.partnerRu||r.description||''].map(protect).join(';'))].join('\r\n');
 const blob=new Blob(['\ufeff'+lines],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function showResultsOnly(){if(state.section!=='transactions')return;const holder=document.getElementById('txResults');if(holder)holder.innerHTML=fullTable(context().rows);}
function eventClick(evt){
 const row=evt.target.closest('tr[data-row-id]');if(row&&!evt.target.closest('[data-action]')){state.modal='detail';state.detailId=row.dataset.rowId;render();return;}
 if(evt.target.closest('[data-overlay]')&&evt.target.matches('[data-overlay]')){state.modal=null;render();return;}
 const btn=evt.target.closest('[data-action]');if(!btn)return;
 const action=btn.dataset.action;
 switch(action){
 case'nav':if(!nav.some(n=>n[0]===btn.dataset.page))return;state.section=btn.dataset.page;state.modal=null;state.txShown=12;render();scrollTop();break;
 case'theme':state.theme=state.theme==='light'?'dark':'light';saveState();render();break;
 case'lang':state.lang=state.lang==='ru'?'en':'ru';saveState();render();break;
 case'currency':state.currency=state.currency==='RUB'?'USD':'RUB';saveState();render();break;
 case'period':state.period=Number(btn.dataset.days);state.txShown=12;render();break;
 case'reset':state.period=30;state.end=BASE;state.unit='all';state.series={income:true,expense:true};state.expenseCat='all';state.txSearch='';state.txType='all';state.txSort='date_desc';state.txShown=12;render();break;
 case'series':{const k=btn.dataset.series;if(!['income','expense'].includes(k))break;state.series[k]=!state.series[k];if(!state.series.income&&!state.series.expense)state.series[k]=true;render();break;}
 case'expense-cat':state.expenseCat=btn.dataset.category;render();break;
 case'scenario':state.scenario=btn.dataset.scenario;render();break;
 case'help':state.modal='help';render();break;
 case'close-modal':state.modal=null;render();break;
 case'edit-budget':state.selectedBudget=btn.dataset.category;state.modal='budget';render();break;
 case'reset-budgets':{const p=state.end.slice(0,7)+'|'+state.unit+'|';for(const k of Object.keys(budgetEdits))if(k.startsWith(p))delete budgetEdits[k];storeSet('budgets',budgetEdits);render();toast(tx('Планы восстановлены','Budgets reset'));break;}
 case'new-tx':state.modal='transaction';render();break;
 case'more':state.txShown+=20;showResultsOnly();break;
 case'delete-tx':{const id=btn.dataset.id;if(!id.startsWith('USER-'))break;
 if(!window.confirm(tx('Удалить добавленную операцию?','Delete this custom transaction?')))break;
 custom=custom.filter(r=>r.id!==id);storeSet('transactions',custom);ledger=D.generateLedger().concat(custom);state.modal=null;render();toast(tx('Операция удалена','Transaction removed'));break;}
 case'export':exporter(context().rows,`finance_${state.section}_${state.end}_${state.unit}.csv`);toast(tx('CSV подготовлен','CSV exported'));break;
 case'export-transactions':exporter(filteredTransactions(context().rows),`finance_transactions_${state.end}.csv`);toast(tx('CSV подготовлен','CSV exported'));break;
 default:break;
 }
}
el.addEventListener('click',eventClick);
el.addEventListener('change',evt=>{
 const input=evt.target;
 if(input.matches('[data-filter]')){
  const k=input.dataset.filter,v=input.value;
  if(k==='end'&&/^\d{4}-\d{2}-\d{2}$/.test(v)){state.end=v>BASE?BASE:v<'2025-10-14'?'2025-10-14':v;}
  else if(k==='unit'&&(v==='all'||D.units.some(x=>x.id===v)))state.unit=v;
  else if(k==='tx-type')state.txType=v;
  else if(k==='tx-sort')state.txSort=v;
  else if(k==='horizon')state.horizon=Number(v);
  state.txShown=12;render();return;
 }
 if(input.matches('[data-slider]')){state[input.dataset.slider]=Number(input.value);render();return;}
 if(input.matches('[data-field="new-type"]')){const cat=document.getElementById('newCategory'),options=input.value==='income'?D.incomeStreams:D.categories;cat.innerHTML=options.map(x=>`<option value="${x.id}">${e(x[state.lang])}</option>`).join('');}
});
el.addEventListener('input',evt=>{
 if(evt.target.id==='txSearch'){
  state.txSearch=evt.target.value;state.txShown=12;showResultsOnly();return;
 }
 if(evt.target.matches('[data-slider]')){const k=evt.target.dataset.slider,n=Number(evt.target.value);state[k]=n;const out=document.getElementById(k==='growth'?'growthVal':'efficiencyVal');if(out)out.textContent=(k==='growth'&&n>=0?'+':'')+n+'%';}
});
el.addEventListener('submit',evt=>{
 if(evt.target.id==='budgetForm'){
  evt.preventDefault();const c=state.selectedBudget,amount=Number(evt.target.elements.budget.value);
  if(!Number.isFinite(amount)||amount<0||amount>99999999999){toast(tx('Проверьте сумму','Check the amount'));return;}
  const b=budgetFor(c),rub=Math.round(amount*(state.currency==='USD'?D.RUB_PER_USD:1));budgetEdits[b.key]=rub;storeSet('budgets',budgetEdits);state.modal=null;render();toast(tx('Бюджет сохранён','Budget saved'));return;
 }
 if(evt.target.id==='transactionForm'){
  evt.preventDefault();const f=evt.target.elements,type=f.type.value,date=f.date.value,unit=f.unit.value,category=f.category.value,description=f.description.value.trim();
  let amount=Number(f.amount.value);if(state.currency==='USD')amount*=D.RUB_PER_USD;
  if(!Number.isFinite(amount)||amount<=0||date<'2025-09-15'||date>BASE||!description||!['income','expense'].includes(type)||!D.units.some(x=>x.id===unit)){
   toast(tx('Проверьте поля','Please check the fields'));return;
  }
  if(!(type==='income'?D.incomeStreams:D.categories).some(x=>x.id===category)){toast(tx('Неверная категория','Invalid category'));return;}
  const entry={id:'USER-'+Date.now().toString(36)+'-'+Math.floor(Math.random()*1000),date,unit,type,category,amount:Math.round(amount),partnerRu:description,partnerEn:description,description,status:'completed'};
  custom.push(entry);storeSet('transactions',custom);ledger=D.generateLedger().concat(custom);state.modal=null;render();toast(tx('Операция добавлена','Transaction added'));return;
 }
});
el.addEventListener('pointermove',evt=>{
 const hit=evt.target.closest('.chart [data-tip]');
 const charts=el.querySelectorAll('.chart-tooltip');
 if(!hit){charts.forEach(t=>t.classList.remove('visible'));return;}
 const wrap=hit.closest('.chart'),tip=wrap?.querySelector('.chart-tooltip');if(!tip)return;
 for(const t of charts)if(t!==tip)t.classList.remove('visible');
 tip.textContent=hit.dataset.tip;tip.style.whiteSpace='pre-line';
 const rect=wrap.getBoundingClientRect();let x=evt.clientX-rect.left+14,y=evt.clientY-rect.top-12;
 x=Math.min(x,Math.max(8,rect.width-195));y=Math.max(5,y-78);
 tip.style.left=x+'px';tip.style.top=y+'px';tip.classList.add('visible');
});
el.addEventListener('pointerleave',()=>{el.querySelectorAll('.chart-tooltip').forEach(t=>t.classList.remove('visible'));});
window.addEventListener('keydown',evt=>{if(evt.key==='Escape'&&state.modal){state.modal=null;render();}});
// Non-intrusive debug hook for local UI regression tests.
window.__financeDemo={getState:()=>({...state}),metrics:()=>context().m,filteredRows:()=>context().rows.length,getBudget:(id)=>budgetFor(id).plan,clearLocalChanges:()=>{custom=[];budgetEdits={};storeSet('transactions',custom);storeSet('budgets',budgetEdits);ledger=D.generateLedger();render();}};
render();
})();
