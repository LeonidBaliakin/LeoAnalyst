/* «Балтик Лайн» - LeoAnalyst sea container demo. 3D terminal (three.js) + sections. Synthetic data. */
(function(){
'use strict';
const D=window.SEA_DATA,RU=document.documentElement.lang!=='en';
const T=(r,e)=>RU?r:e,L=a=>Array.isArray(a)?(RU?a[0]:a[1]):String(a).split('|')[RU?0:1];
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const loc=RU?'ru-RU':'en-GB',nf=(v,d=0)=>new Intl.NumberFormat(loc,{maximumFractionDigits:d,minimumFractionDigits:d}).format(v);
const pct=(v,d=1)=>nf(v,d)+'%';
function money(v,short){if(!RU){const x=v/D.usdRate,a=Math.abs(x);if(short){if(a>=1e6)return '$'+nf(x/1e6,a>=1e7?1:2)+'M';if(a>=1e4)return '$'+nf(x/1e3,0)+'K'}return '$'+nf(x)}
 const a=Math.abs(v);if(short){if(a>=1e6)return nf(v/1e6,a>=1e8?0:1)+' млн ₽';if(a>=1e4)return nf(v/1e3,0)+' тыс. ₽'}return nf(v)+' ₽'}
const days=n=>RU?n+' '+(n%10===1&&n%100!==11?'день':n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?'дня':'дней'):n+(n===1?' day':' days');
const track=(e,p)=>{try{if(window.ym&&window.YM_ID)ym(window.YM_ID,'reachGoal',e,p)}catch(_){}};

/* ---------- vessels geometry ---------- */
const R=6371,rad=x=>x*Math.PI/180;
function hav(a,b){const dl=rad(b.lat-a.lat),dn=rad(b.lon-a.lon),h=Math.sin(dl/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
const today=new Date(2026,9,28);
D.VESSELS.forEach(v=>{const pts=D.ROUTES[v.route].map(k=>D.WP[k]);const seg=[];let tot=0;for(let i=1;i<pts.length;i++){const d=hav(pts[i-1],pts[i]);seg.push(d);tot+=d}
 const at=tot*v.prog;let acc=0,i=0;while(i<seg.length&&acc+seg[i]<at){acc+=seg[i];i++}const f=seg[i]?(at-acc)/seg[i]:0;const a=pts[i],b=pts[Math.min(i+1,pts.length-1)];
 v.pos={lon:a.lon+(b.lon-a.lon)*f,lat:a.lat+(b.lat-a.lat)*f};v.where=f<.5?a:b;v.pts=pts;v.idx=i;v.total=tot;
 v.eta=Math.max(1,Math.ceil((tot-at)/D.kmPerDay))+(v.delay||0);v.teu=v.c20+2*v.c40;v.from=D.ROUTE_NAME[v.route];v.dest=D.DEST[v.to];
 const d=new Date(today);d.setDate(d.getDate()+v.eta);v.date=d.toLocaleDateString(loc,{day:'numeric',month:'short'})});
const VS=[...D.VESSELS].sort((a,b)=>a.eta-b.eta);
const vById=Object.fromEntries(D.VESSELS.map(v=>[v.id,v]));

/* ---------- aggregates ---------- */
const F=D.fin,last=F[11],prev=F[10];
const margin=last.profit/last.rev*100;
const teuMonth=D.clients.reduce((a,c)=>a+c.teu[5],0);
const amortTrucks=D.trucks.reduce((a,t)=>a+t.amort,0);
const loadTrucks=D.trucks.reduce((a,t)=>a+t.load,0)/D.trucks.length;
const fu=D.sales.funnel,conv=fu[3][2]/fu[0][2]*100;
const teamLoad=p=>p.weeks.slice(-4).reduce((a,b)=>a+b,0)/4/40*100;
const over=D.team.filter(p=>teamLoad(p)>108);

/* ---------- dispatch model ---------- */
const STL={ok:['подтвердил','confirmed'],busy:['нет машин','no capacity'],up:['ставка выросла','rate up'],wait:['ждём ответ','awaiting reply']};
const rateOf=(c,dir,mode,type)=>{const r=c.rates[dir]&&c.rates[dir][mode];if(!r)return null;let v=r.r40*(type===20?.75:1);if(r.status==='up')v*=1+r.chg/100;return {v:Math.round(v/100)*100,status:r.status,chg:r.chg}};
function options(l){return D.carriers.map(c=>({c,r:rateOf(c,l.dir,l.mode,l.type)})).filter(o=>o.r)}
function bestFor(l){const o=options(l).filter(x=>x.r.status!=='busy');const rank={ok:0,up:1,wait:2};o.sort((a,b)=>rank[a.r.status]-rank[b.r.status]||a.r.v-b.r.v);return o[0]?o[0].c.id:null}
D.lots.forEach(l=>{l.carrier=bestFor(l)});
function lotCalc(l){const o=options(l).find(x=>x.c.id===l.carrier);const base=D.DIRS[l.dir][l.mode==='rail'?3:2]*(l.type===20?.75:1);const sale=Math.round(base*l.markup/100)*100;
 if(!o)return {rate:0,cost:0,sale:sale*l.qty,margin:0,status:'none'};const cost=o.r.v*l.qty;return {rate:o.r.v,cost,sale:sale*l.qty,margin:sale*l.qty-cost,status:o.r.status,chg:o.r.chg}}

/* ---------- small charts ---------- */
function bars(vals,{w=1160,h=220,labels=[],color='var(--sea2)',line=null,lineColor='var(--or)',fmt=v=>v,plan=null,pad=64}={}){
 const max=Math.max(...vals,...(plan||[]))*1.08,bw=(w-pad)/vals.length;let s=`<svg class="ch" viewBox="0 -12 ${w} ${h+34}" role="img">`;
 for(let i=0;i<=3;i++){const y=h-h*i/3;s+=`<line x1="${pad}" x2="${w}" y1="${y}" y2="${y}" stroke="#e3e8eb"/>`;s+=`<text x="0" y="${y+3}">${fmt(max*i/3)}</text>`}
 vals.forEach((v,i)=>{const bh=v/max*h,x=pad+i*bw+bw*.18;s+=`<rect x="${x}" y="${h-bh}" width="${bw*.64}" height="${bh}" rx="4" fill="${color}"><title>${labels[i]||''}: ${fmt(v)}</title></rect>`;
  if(plan)s+=`<line x1="${x-2}" x2="${x+bw*.64+2}" y1="${h-plan[i]/max*h}" y2="${h-plan[i]/max*h}" stroke="var(--ink)" stroke-width="2"/>`;
  if(labels[i])s+=`<text x="${x+bw*.32}" y="${h+16}" text-anchor="middle">${labels[i]}</text>`});
 if(line){const lm=Math.max(...line)*1.08;s+=`<polyline fill="none" stroke="${lineColor}" stroke-width="2.5" points="${line.map((v,i)=>`${pad+i*bw+bw/2},${h-v/max*h}`).join(' ')}"/>`;line.forEach((v,i)=>s+=`<circle cx="${pad+i*bw+bw/2}" cy="${h-v/max*h}" r="3.2" fill="${lineColor}"/>`)}
 return s+'</svg>'}
function lineChart(vals,{w=560,h=170,labels=[],fmt=v=>v,color='var(--sea2)',min=null,pad=44}={}){const mx=Math.max(...vals)*1.05,mn=min!=null?min:Math.min(...vals)*.9,sx=(w-pad)/(vals.length-1);
 const y=v=>h-(v-mn)/(mx-mn)*h;let s=`<svg class="ch" viewBox="0 -12 ${w} ${h+34}">`;for(let i=0;i<=3;i++){const val=mn+(mx-mn)*i/3;s+=`<line x1="${pad}" x2="${w}" y1="${y(val)}" y2="${y(val)}" stroke="#e3e8eb"/><text x="0" y="${y(val)+3}">${fmt(val)}</text>`}
 s+=`<polyline fill="none" stroke="${color}" stroke-width="2.5" points="${vals.map((v,i)=>`${pad+i*sx},${y(v)}`).join(' ')}"/>`;vals.forEach((v,i)=>{s+=`<circle cx="${pad+i*sx}" cy="${y(v)}" r="3.5" fill="${color}"><title>${labels[i]}: ${fmt(v)}</title></circle><text x="${pad+i*sx}" y="${h+16}" text-anchor="${i===vals.length-1?'end':'middle'}">${labels[i]}</text>`});return s+'</svg>'}
function spark(vals,color='var(--sea2)'){const w=90,h=26,mx=Math.max(...vals),mn=Math.min(...vals),r=mx-mn||1;return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><polyline fill="none" stroke="${color}" stroke-width="2" points="${vals.map((v,i)=>`${i*w/(vals.length-1)},${h-2-(v-mn)/r*(h-4)}`).join(' ')}"/></svg>`}
const stat=(l,v,s='',cls='')=>`<div class="card stat"><small>${l}</small><b class="${cls}">${v}</b>${s?`<span>${s}</span>`:''}</div>`;
const mixHtml=v=>`<span class="cbadge c20">20′ ×${v.c20}</span><span class="cbadge c40">40′ ×${v.c40}</span>`;

/* ---------- header, fleet list, dock ---------- */
$('#top').innerHTML=`<div class="brand"><div class="logo">${D.HOME.brand[0]}</div><div><b>${D.HOME.brand}</b><span>${T('морские контейнерные перевозки · демо','ocean container shipping · demo')}</span></div></div>
<div class="kpis"><button class="kpi" data-open="finance"><small>${T('Оборот, октябрь','Turnover, October')}</small><b>${money(last.rev,1)}</b><span class="up">↑${pct((last.rev/prev.rev-1)*100)}</span></button>
<button class="kpi" data-open="finance"><small>${T('Профит','Profit')}</small><b>${money(last.profit,1)}</b></button><button class="kpi" data-open="finance"><small>${T('Маржинальность','Margin')}</small><b>${pct(margin)}</b></button></div>`;
$('#fleet').innerHTML=`<h3><span><i class="live"></i>${T('Суда в пути','Vessels at sea')}</span><small>${T('наши контейнеры','our boxes')}</small></h3>`+
 VS.slice(0,5).map(v=>`<button class="vrow" data-vessel="${v.id}"><b>${esc(v.name)}</b><span class="eta${v.delay?' late':''}">${T('через','in')} ${days(v.eta)}</span><span>${L([v.where.ru,v.where.en])} → ${L(v.dest)}</span><span>${v.teu} TEU</span><span class="mix">${mixHtml(v)}</span></button>`).join('')+
 `<button class="all" data-open="vessels">${T('Все суда и карта →','All vessels & map →')}</button>`;
const SECS=[['terminal','Терминал','Terminal'],['vessels','Суда в пути','Vessels'],['dispatch','Распределение','Dispatch'],['finance','Финансы','Finance'],['clients','Клиенты','Clients'],['trucks','Автовывоз','Trucking'],['rail','ЖД','Rail'],['team','Команда','Team'],['sales','Продажи','Sales']];
$('#dock').innerHTML=SECS.map(s=>`<button data-open="${s[0]}"${s[0]==='terminal'?' class="on"':''}>${T(s[1],s[2])}</button>`).join('');
$('#hint').textContent=T('Поворачивайте мышью · нажмите на объект, чтобы открыть раздел','Drag to rotate · click an object to open its section');

/* ---------- sections ---------- */
let cur=null,selVessel=null;
const SEC={
vessels(){const our20=D.VESSELS.reduce((a,v)=>a+v.c20,0),our40=D.VESSELS.reduce((a,v)=>a+v.c40,0),soon=D.VESSELS.filter(v=>v.eta<=7);
 return head(T('Суда в пути','Vessels at sea'),T('Где сейчас наши контейнеры, на каком судне и когда придут. Позиции обновляются по данным AIS.','Where our containers are, on which vessel and when they arrive. Positions refresh from AIS data.'))+
 `<div class="grid g4">${stat(T('Судов в пути','Vessels at sea'),D.VESSELS.length,T('ещё одно на выгрузке у нас','plus one unloading at our berth'))}${stat(T('Наших контейнеров','Our containers'),nf(our20+our40),`20′ ×${our20} · 40′ ×${our40}`)}${stat('TEU',nf(our20+2*our40),T('20′ = 1 TEU, 40′ = 2 TEU','20′ = 1 TEU, 40′ = 2 TEU'))}${stat(T('Придут за 7 дней','Arriving in 7 days'),soon.length+' '+T('судна','vessels'),nf(soon.reduce((a,v)=>a+v.teu,0))+' TEU')}</div>
 <div class="card" style="margin-top:12px"><h4>${T('Карта','Map')}</h4><div class="sub">${T('Нажмите на судно, чтобы выделить его в таблице','Click a vessel to highlight it in the table')}</div>${worldMap()}
 <div class="legend" style="margin-top:8px"><span><i style="background:var(--sea)"></i>${T('пройдено','covered')}</span><span><i style="background:var(--sea2);opacity:.5"></i>${T('осталось','remaining')}</span><span><i style="background:var(--or);border-radius:50%"></i>${T('судно','vessel')}</span></div></div>
 <div class="card" style="margin-top:12px"><table class="t cards"><colgroup><col style="width:19%"><col style="width:20%"><col style="width:21%"><col style="width:18%"><col style="width:12%"><col style="width:10%"></colgroup>
 <thead><tr><th>${T('Судно','Vessel')}</th><th>${T('Маршрут','Route')}</th><th>${T('Где сейчас','Now')}</th><th>${T('Контейнеры','Containers')}</th><th>${T('Прибытие','Arrival')}</th><th>${T('Статус','Status')}</th></tr></thead><tbody>`+
 VS.map(v=>`<tr data-vrow="${v.id}"${selVessel===v.id?' class="sel"':''}><td data-l="${T('Судно','Vessel')}"><b>${esc(v.name)}</b><div class="muted">${L(v.flag)}</div></td><td data-l="${T('Маршрут','Route')}">${L(v.from)} → ${L(v.dest)}</td><td data-l="${T('Где сейчас','Now')}">${L([v.where.ru,v.where.en])}<div class="bar" style="margin-top:5px"><i style="width:${v.prog*100}%"></i></div></td><td data-l="${T('Контейнеры','Containers')}">${mixHtml(v)}<div class="muted">${v.teu} TEU</div></td><td data-l="${T('Прибытие','Arrival')}"><b>${T('через','in')} ${days(v.eta)}</b><div class="muted">${v.date}</div></td><td data-l="${T('Статус','Status')}">${v.delay?`<span class="chip busy">${T('задержка','delayed')} +${days(v.delay)}</span>`:`<span class="chip ok">${T('в пути','on route')}</span>`}</td></tr>`).join('')+`</tbody></table></div>`},
dispatch(){const rows=D.lots.map(l=>({l,c:lotCalc(l)}));const tot=rows.reduce((a,{l,c})=>(a.cost+=c.cost,a.sale+=c.sale,a.m+=c.margin,a.n+=l.qty,a.teu+=l.qty*(l.type===40?2:1),a.att+=(c.status!=='ok'?1:0),a),{cost:0,sale:0,m:0,n:0,teu:0,att:0});
 const vn=id=>id==='berth'?D.BERTH.name:vById[id].name,ve=id=>id==='berth'?T('на выгрузке','unloading'):T('через ','in ')+days(vById[id].eta);
 return head(T('Распределение контейнеров','Container dispatch'),T('Контейнеры, которые пришли и подходят в Петербург: куда везти дальше, каким способом и кем. По умолчанию выбран самый дешёвый перевозчик, который подтвердил заявку.',`Containers arriving at ${D.HOME.city[1]}: where they go next, by which mode and with whom. By default the cheapest carrier who confirmed is selected.`))+
 `<div class="card"><div class="totals"><div><small>${T('Партий','Lots')}</small><b>${rows.length}</b></div><div><small>${T('Контейнеров','Containers')}</small><b>${tot.n} · ${tot.teu} TEU</b></div><div><small>${T('Платим перевозчикам','Paid to carriers')}</small><b id="tCost">${money(tot.cost,1)}</b></div><div><small>${T('Выставим клиентам','Billed to clients')}</small><b id="tSale">${money(tot.sale,1)}</b></div><div><small>${T('Маржа','Margin')}</small><b id="tM" class="pos">${money(tot.m,1)} · ${pct(tot.m/tot.sale*100)}</b></div><div><small>${T('Требуют звонка','Need a call')}</small><b id="tAtt" class="${tot.att?'neg':'pos'}">${tot.att}</b></div></div></div>
 <div class="card" style="margin-top:12px"><table class="t cards" id="lots"><colgroup><col style="width:12%"><col style="width:15%"><col style="width:8%"><col style="width:16%"><col style="width:29%"><col style="width:10%"><col style="width:10%"></colgroup>
 <thead><tr><th>${T('Судно','Vessel')}</th><th>${T('Клиент и груз','Client & cargo')}</th><th>${T('Конт.','Boxes')}</th><th>${T('Куда и как','Where & how')}</th><th>${T('Перевозчик и ставка','Carrier & rate')}</th><th class="r">${T('Себест.','Cost')}</th><th class="r">${T('Маржа','Margin')}</th></tr></thead><tbody>`+
 rows.map(({l,c})=>{const cl=D.clients[l.client],dir=D.DIRS[l.dir];const opts=options(l);return `<tr data-lot="${l.id}"><td data-l="${T('Судно','Vessel')}"><b>${esc(vn(l.vessel))}</b><div class="muted">${ve(l.vessel)}</div></td><td data-l="${T('Клиент','Client')}">${esc(L([cl.ru,cl.en]))}<div class="muted">${L(cl.cargo)}</div></td><td data-l="${T('Контейнеры','Boxes')}"><span class="cbadge ${l.type===40?'c40':'c20'}">${l.type}′ ×${l.qty}</span></td>
 <td data-l="${T('Куда','Where')}">${L([dir[0],dir[1]])}<div style="margin-top:4px">${dir[3]?['auto','rail'].map(m=>`<button class="chip ${l.mode===m?m:'wait'}" data-mode="${m}" style="border:0;margin-right:3px">${m==='auto'?T('авто','truck'):T('ЖД','rail')}</button>`).join(''):`<span class="chip auto">${T('авто','truck')}</span>`}</div></td>
 <td data-l="${T('Перевозчик','Carrier')}" class="full"><select class="pick" data-pick="${l.id}" aria-label="${T('Перевозчик','Carrier')}">${opts.map(o=>`<option value="${o.c.id}"${o.c.id===l.carrier?' selected':''}${o.r.status==='busy'?' disabled':''}>${esc(L([o.c.ru,o.c.en]))} · ${money(o.r.v)}${o.r.status==='ok'?'':' · '+L(STL[o.r.status])}${o.r.status==='up'?' +'+o.r.chg+'%':''}</option>`).join('')}</select><div class="muted" style="margin-top:4px">${c.status==='none'?`<span class="neg">${T('никто не может - звонить','nobody available - call around')}</span>`:`<span class="chip ${c.status}">${L(STL[c.status])}${c.status==='up'?' +'+c.chg+'%':''}</span> ${money(c.rate)} ${T('за контейнер','per box')}`}</div></td>
 <td data-l="${T('Себестоимость','Cost')}" class="r">${money(c.cost,1)}</td><td data-l="${T('Маржа','Margin')}" class="r ${c.margin>=0?'pos':'neg'}"><b>${money(c.margin,1)}</b><div class="muted">${c.sale?pct(c.margin/c.sale*100):''}</div></td></tr>`}).join('')+`</tbody></table></div>
 <div class="card" style="margin-top:12px"><h4>${T('Ставки перевозчиков за 40′ контейнер','Carrier rates per 40′ container')}</h4><div class="sub">${T('Договорные ставки и ответ на сегодня. 20′ - примерно 75% от ставки за 40′.','Contract rates and today’s reply. A 20′ box is about 75% of the 40′ rate.')}</div>
 <table class="t cards"><colgroup><col style="width:22%">${D.DIRS.map(()=>'<col>').join('')}</colgroup><thead><tr><th>${T('Перевозчик','Carrier')}</th>${D.DIRS.map(d=>`<th class="r">${L([d[0],d[1]])}</th>`).join('')}</tr></thead><tbody>`+
 D.carriers.map(c=>`<tr><td data-l="" class="full"><b>${esc(L([c.ru,c.en]))}</b> <span class="chip ${c.mode==='rail'?'rail':'auto'}">${c.mode==='auto'?T('авто','truck'):c.mode==='rail'?T('ЖД','rail'):T('авто + ЖД','truck + rail')}</span></td>${D.DIRS.map((d,j)=>{const r=c.rates[j];const ks=Object.keys(r);return `<td class="r" data-l="${L([d[0],d[1]])}">${ks.length?ks.map(m=>`<div title="${L(STL[r[m].status])}"><span style="color:var(--${r[m].status==='ok'?'ok':r[m].status==='busy'?'bad':r[m].status==='up'?'warn':'muted'})">●</span> ${money(r[m].r40,1)}${ks.length>1?` <span class="muted">${m==='auto'?T('авто','truck'):T('ЖД','rail')}</span>`:''}</div>`).join(''):'<span class="muted">-</span>'}</td>`}).join('')}</tr>`).join('')+
 `</tbody></table><div class="legend" style="margin-top:10px">${Object.keys(STL).map(k=>`<span><i style="background:var(--${k==='ok'?'ok':k==='busy'?'bad':k==='up'?'warn':'line2'})"></i>${L(STL[k])}</span>`).join('')}</div></div>`},
finance(){const L12=F.map(f=>L(f.m));const done=last.rev/last.plan*100;
 return head(T('Финансы','Finance'),T('Оборот, профит и маржинальность по месяцам и по видам услуг.','Turnover, profit and margin by month and by service.'))+
 `<div class="grid g4">${stat(T('Оборот, октябрь','Turnover, October'),money(last.rev,1),`<span class="pos">↑${pct((last.rev/prev.rev-1)*100)}</span> ${T('к сентябрю','vs September')}`)}${stat(T('Профит','Profit'),money(last.profit,1),`<span class="pos">↑${pct((last.profit/prev.profit-1)*100)}</span> ${T('к сентябрю','vs September')}`)}${stat(T('Маржинальность','Margin'),pct(margin),T('профит / оборот','profit / turnover'))}${stat(T('План месяца','Monthly plan'),pct(done),money(last.plan,1)+' '+T('план','plan'),done>=100?'pos':'neg')}</div>
 <div class="card" style="margin-top:12px"><h4>${T('Оборот и профит за 12 месяцев','Turnover and profit, 12 months')}</h4><div class="sub">${T('Столбцы - оборот, чёрная черта - план, линия - профит','Bars - turnover, black tick - plan, line - profit')}</div>${bars(F.map(f=>f.rev),{labels:L12,plan:F.map(f=>f.plan),line:F.map(f=>f.profit),fmt:v=>money(v,1)})}</div>
 <div class="grid g2" style="margin-top:12px"><div class="card"><h4>${T('Маржинальность по месяцам','Margin by month')}</h4>${lineChart(F.map(f=>f.profit/f.rev*100),{labels:L12,fmt:v=>pct(v),color:'var(--or)'})}</div>
 <div class="card"><h4>${T('По видам услуг, октябрь','By service, October')}</h4><table class="t"><colgroup><col style="width:40%"><col><col><col></colgroup><thead><tr><th>${T('Услуга','Service')}</th><th class="r">${T('Оборот','Turnover')}</th><th class="r">${T('Профит','Profit')}</th><th class="r">${T('Маржа','Margin')}</th></tr></thead><tbody>${D.split.map(s=>{const rv=last.rev*s[2];return `<tr><td>${L([s[0],s[1]])}<div class="bar" style="margin-top:4px"><i style="width:${s[2]*100}%"></i></div></td><td class="r">${money(rv,1)}</td><td class="r">${money(rv*s[3],1)}</td><td class="r">${pct(s[3]*100)}</td></tr>`}).join('')}</tbody></table></div></div>`},
clients(){const cs=[...D.clients].sort((a,b)=>b.rev-a.rev),top=cs[0];const ch=c=>(c.teu[5]/(c.teu[3])-1)*100;const up=cs.filter(c=>ch(c)>3).length,dn=cs.filter(c=>ch(c)<-3).length;
 return head(T('Клиенты','Clients'),T('Оборот и профит по клиентам и как у них меняются объёмы перевозок.','Turnover and profit by client and how their volumes move.'))+
 `<div class="grid g4">${stat(T('Активных клиентов','Active clients'),cs.length)}${stat(T('Перевезли за октябрь','Moved in October'),nf(teuMonth)+' TEU')}${stat(T('Крупнейший клиент','Largest client'),pct(top.rev/last.rev*100),esc(L([top.ru,top.en]))+' - '+T('доля оборота','share of turnover'))}${stat(T('Объёмы за 2 месяца','Volumes over 2 months'),`<span class="pos">↑${up}</span> · <span class="neg">↓${dn}</span>`,T('растут · падают','growing · falling'))}</div>
 <div class="card" style="margin-top:12px"><table class="t cards"><colgroup><col style="width:22%"><col style="width:15%"><col style="width:16%"><col style="width:9%"><col style="width:13%"><col style="width:13%"><col style="width:12%"></colgroup><thead><tr><th>${T('Клиент','Client')}</th><th>TEU, ${T('6 мес.','6 mo')}</th><th></th><th class="r">${T('Динамика','Trend')}</th><th class="r">${T('Оборот','Turnover')}</th><th class="r">${T('Профит','Profit')}</th><th class="r">${T('Маржа','Margin')}</th></tr></thead><tbody>`+
 cs.map(c=>{const d=ch(c);return `<tr><td data-l="${T('Клиент','Client')}"><b>${esc(L([c.ru,c.en]))}</b><div class="muted">${L(c.cargo)}</div></td><td data-l="TEU">${nf(c.teu[5])} <span class="muted">${T('в окт.','in Oct')}</span></td><td data-l="${T('Объёмы','Volumes')}">${spark(c.teu,d<-3?'var(--bad)':'var(--sea2)')}</td><td class="r ${d>3?'pos':d<-3?'neg':''}" data-l="${T('Динамика','Trend')}">${d>0?'↑':'↓'}${pct(Math.abs(d),0)}</td><td class="r" data-l="${T('Оборот','Turnover')}">${money(c.rev,1)}</td><td class="r" data-l="${T('Профит','Profit')}">${money(c.profit,1)}</td><td class="r" data-l="${T('Маржа','Margin')}">${pct(c.profit/c.rev*100)}</td></tr>`}).join('')+`</tbody></table></div>`},
trucks(){const ts=[...D.trucks].sort((a,b)=>a.load-b.load),idle=ts.filter(t=>t.load<55),waste=idle.reduce((a,t)=>a+t.amort*(1-t.load/100),0);
 return head(T('Автовывоз','Trucking'),T('Свои тягачи: загрузка, амортизация и сколько стоит простой.','Own tractors: utilisation, depreciation and the cost of idle time.'))+
 `<div class="grid g4">${stat(T('Тягачей','Tractors'),D.trucks.length,T('3 в ремонте','3 in repair'))}${stat(T('Средняя загрузка','Avg utilisation'),pct(loadTrucks))}${stat(T('Амортизация в месяц','Depreciation / month'),money(amortTrucks,1),T('линейно, 7 лет','straight-line, 7 years'))}${stat(T('Простаивают','Underused'),idle.length,T('загрузка ниже 55%','below 55% load'),'neg')}</div>
 <div class="note" style="margin-top:12px">${T(`На ${idle.length} тягачах с низкой загрузкой амортизация идёт впустую примерно на ${money(waste,1)} в месяц. Их можно отдать в аренду или перевести на маршруты в ${D.HOME.run[0]}.`,`About ${money(waste,1)} a month of depreciation is wasted on ${idle.length} underused tractors. They could be leased out or moved to ${D.HOME.run[1]} shuttle runs.`)}</div>
 <div class="card" style="margin-top:12px"><h4>${T('Загрузка каждого тягача, октябрь','Utilisation per tractor, October')}</h4>${bars(D.trucks.map(t=>t.load),{h:180,pad:44,labels:D.trucks.map((t,i)=>i%4?'':t.id),fmt:v=>pct(v,0),color:'var(--warn)'})}</div>
 <div class="card" style="margin-top:12px"><h4>${T('Меньше всего загружены','Least utilised')}</h4><table class="t cards"><colgroup><col><col><col><col><col><col></colgroup><thead><tr><th>${T('Тягач','Tractor')}</th><th class="r">${T('Возраст','Age')}</th><th class="r">${T('Цена покупки','Purchase price')}</th><th class="r">${T('Амортизация / мес','Depreciation / mo')}</th><th class="r">${T('Пробег, км','Mileage, km')}</th><th>${T('Загрузка','Utilisation')}</th></tr></thead><tbody>`+
 ts.slice(0,10).map(t=>`<tr><td data-l="${T('Тягач','Tractor')}"><b>${t.id}</b>${t.repair?` <span class="chip busy">${T('ремонт','repair')}</span>`:''}</td><td class="r" data-l="${T('Возраст','Age')}">${t.age} ${T('г.','y')}</td><td class="r" data-l="${T('Цена','Price')}">${money(t.price,1)}</td><td class="r" data-l="${T('Амортизация','Depreciation')}">${money(t.amort,1)}</td><td class="r" data-l="${T('Пробег','Mileage')}">${nf(t.km)}</td><td data-l="${T('Загрузка','Utilisation')}"><div class="bar"><i style="width:${t.load}%;background:${t.load<55?'var(--bad)':'var(--warn)'}"></i></div><span class="muted">${t.load}%</span></td></tr>`).join('')+`</tbody></table></div>`},
rail(){const r=D.rail,M6=D.MONTHS.map(m=>L(m));return head(T('ЖД-платформы','Rail flatcars'),T('Загрузка платформ, амортизация своих и аренда чужих, оборот платформы.','Flatcar utilisation, depreciation of own and lease of hired, flatcar turnaround.'))+
 `<div class="grid g4">${stat(T('Платформ','Flatcars'),r.own+r.leased,`${r.own} ${T('своих','own')} · ${r.leased} ${T('в аренде','leased')}`)}${stat(T('Загрузка','Utilisation'),pct(r.load[5],0))}${stat(T('Амортизация своих','Own depreciation'),money(r.amortOwn,1),T('в месяц','per month'))}${stat(T('Аренда','Lease'),money(r.lease,1),T('в месяц','per month'))}</div>
 <div class="grid g2" style="margin-top:12px"><div class="card"><h4>${T('Загрузка платформ, %','Flatcar utilisation, %')}</h4>${lineChart(r.load,{labels:M6,fmt:v=>pct(v,0),color:'var(--ok)'})}</div><div class="card"><h4>${T('Оборот платформы, дней','Flatcar turnaround, days')}</h4><div class="sub">${T('Сколько дней платформа идёт от погрузки до новой погрузки','Days from one loading to the next')}</div>${bars(r.turnDays,{w:560,h:170,pad:40,labels:M6,fmt:v=>nf(v,1),color:'var(--ok)'})}</div></div>
 <div class="note" style="margin-top:12px">${T(`Своя платформа обходится в ${money(r.amortOwn/r.own)} в месяц, арендованная - в ${money(r.lease/r.leased)}. При загрузке выше 70% выгоднее докупать свои.`,`An own flatcar costs ${money(r.amortOwn/r.own)} a month, a leased one ${money(r.lease/r.leased)}. Above 70% utilisation it pays to buy more.`)}</div>`},
team(){const col=v=>v>=48?['var(--bad)','#fff']:v>=44?['var(--warn)','#fff']:v>=36?['var(--sea-soft)','var(--sea)']:['var(--s2)','var(--muted)'];
 return head(T('Команда','Team'),T('Нагрузка сотрудников по неделям, часов в неделю (норма - 40).','Workload by week, hours per week (norm - 40).'))+
 `<div class="grid g4">${stat(T('Сотрудников','People'),D.team.length)}${stat(T('Средняя нагрузка','Average load'),pct(D.team.reduce((a,p)=>a+teamLoad(p),0)/D.team.length,0))}${stat(T('Перегружены','Overloaded'),over.length,over.map(p=>L([p.ru,p.en])).join(', '),'neg')}${stat(T('Задач за месяц','Tasks this month'),nf(D.team.reduce((a,p)=>a+p.tasks,0)))}</div>
 <div class="card" style="margin-top:12px"><div class="heat"><span></span>${Array.from({length:8},(_,i)=>`<span class="muted wk" style="text-align:center"><i>${T('нед.','wk')} </i>${i+37}</span>`).join('')}<span class="muted" style="text-align:right">${T('нагрузка','load')}</span>`+
 D.team.map(p=>`<span><b>${esc(L([p.ru,p.en]))}</b><br><span class="muted">${L(p.role)}</span></span>`+p.weeks.map(h=>{const c=col(h);return `<span class="c" style="background:${c[0]};color:${c[1]}" title="${h} ${T('ч','h')}">${h}</span>`}).join('')+`<b style="text-align:right" class="${teamLoad(p)>108?'neg':''}">${pct(teamLoad(p),0)}</b>`).join('')+`</div>
 <div class="legend" style="margin-top:12px"><span><i style="background:var(--s2)"></i>${T('меньше 36 ч','under 36 h')}</span><span><i style="background:var(--sea-soft)"></i>36–43</span><span><i style="background:var(--warn)"></i>44–47</span><span><i style="background:var(--bad)"></i>${T('48 ч и больше','48 h and more')}</span></div></div>`},
sales(){const s=D.sales,M6=D.MONTHS.map(m=>L(m)),mgr=D.HOME.sales.map((n,i)=>[n[0],n[1],[62,91,83][i],[14,13,16][i]]);
 return head(T('Продажи','Sales'),T('Воронка лидов за октябрь и конверсия в сделки.','Lead funnel for October and conversion into deals.'))+
 `<div class="grid g4">${stat(T('Лидов','Leads'),fu[0][2])}${stat(T('Сделок','Deals'),fu[3][2])}${stat(T('Конверсия лидов','Lead conversion'),pct(conv),`<span class="pos">↑${pct(conv-s.conv[4])}</span> ${T('к сентябрю','vs September')}`)}${stat(T('КП отправлено','Quotes sent'),fu[2][2],pct(fu[3][2]/fu[2][2]*100,0)+' '+T('стали сделками','became deals'))}</div>
 <div class="grid g2" style="margin-top:12px"><div class="card funnel"><h4>${T('Воронка','Funnel')}</h4>${fu.map((f,i)=>`<div class="st"><span>${L([f[0],f[1]])}</span><div style="width:${f[2]/fu[0][2]*100}%;background:${['var(--sea2)','var(--sea)','var(--violet)','var(--ok)'][i]}">${f[2]}</div><span class="muted">${i?pct(f[2]/fu[i-1][2]*100,0):''}</span></div>`).join('')}</div>
 <div class="card"><h4>${T('Конверсия по месяцам, %','Conversion by month, %')}</h4>${lineChart(s.conv,{labels:M6,fmt:v=>pct(v,0),color:'var(--violet)'})}</div></div>
 <div class="grid g2" style="margin-top:12px"><div class="card"><h4>${T('Источники лидов','Lead sources')}</h4><table class="t"><colgroup><col style="width:44%"><col><col></colgroup><thead><tr><th>${T('Источник','Source')}</th><th class="r">${T('Доля лидов','Share of leads')}</th><th class="r">${T('Конверсия','Conversion')}</th></tr></thead><tbody>${s.sources.map(x=>`<tr><td>${L([x[0],x[1]])}</td><td class="r">${pct(x[2]*100,0)}</td><td class="r ${x[3]<.12?'neg':''}">${pct(x[3]*100,0)}</td></tr>`).join('')}</tbody></table></div>
 <div class="card"><h4>${T('Менеджеры','Managers')}</h4><table class="t"><colgroup><col style="width:44%"><col><col></colgroup><thead><tr><th>${T('Менеджер','Manager')}</th><th class="r">${T('Лидов','Leads')}</th><th class="r">${T('Сделок','Deals')}</th></tr></thead><tbody>${mgr.map(m=>`<tr><td>${L([m[0],m[1]])}</td><td class="r">${m[2]}</td><td class="r">${m[3]} <span class="muted">(${pct(m[3]/m[2]*100,0)})</span></td></tr>`).join('')}</tbody></table></div></div>`}
};
function head(t,p){return `<div class="sh-title"><h2>${t}</h2><p>${p}</p></div>`}
function worldMap(){const X=lo=>(lo+180)/360*1000,Y=la=>(90-la)/180*500;let s=`<svg class="map" viewBox="${D.HOME.view}" role="img" aria-label="${T('Карта судов','Vessel map')}"><path class="land" d="${window.WORLD_LAND}"/>`;
 const ports=new Set();D.VESSELS.forEach(v=>{const pts=v.pts;s+=`<polyline class="route" points="${pts.map(p=>X(p.lon)+','+Y(p.lat)).join(' ')}"/>`;s+=`<polyline class="done" points="${pts.slice(0,v.idx+1).map(p=>X(p.lon)+','+Y(p.lat)).concat([X(v.pos.lon)+','+Y(v.pos.lat)]).join(' ')}"/>`;ports.add(pts[0]);ports.add(pts[pts.length-1])});
 const OFF={'Shanghai':[-3,-2,'end'],'Ningbo':[-3,6,'end'],'Istanbul':[-3,6,'end'],'Busan':[3,4,'start'],'Hamburg':RU?[-3,6,'end']:[3,-3,'start'],'Antwerp':[-3,6,'end'],'Rotterdam':[-3,-3,'end']};
 ports.forEach(p=>{const o=OFF[p.en]||[3,-3,'start'];s+=`<circle class="port" cx="${X(p.lon)}" cy="${Y(p.lat)}" r="1.8"/><text x="${X(p.lon)+o[0]}" y="${Y(p.lat)+o[1]}" text-anchor="${o[2]}">${L([p.ru,p.en])}</text>`});
 D.VESSELS.forEach(v=>{s+=`<g class="ship${selVessel===v.id?' on':''}" data-ship="${v.id}"><circle cx="${X(v.pos.lon)}" cy="${Y(v.pos.lat)}" r="${selVessel===v.id?4.5:3.4}"/><title>${v.name} · ${v.teu} TEU · ${T('через','in')} ${days(v.eta)}</title></g>`});
 return s+'</svg>'}

/* ---------- panel ---------- */
const panel=$('#panel'),sheet=$('#sheet');let lastFocus=null;
function open(id){if(id==='terminal'){close();return}cur=id;lastFocus=lastFocus||document.activeElement;
 sheet.innerHTML=`<div class="sh-head"><div class="tabs">${SECS.filter(s=>s[0]!=='terminal').map(s=>`<button data-tab="${s[0]}"${s[0]===id?' class="on"':''}>${T(s[1],s[2])}</button>`).join('')}</div><button class="close" id="close" aria-label="${T('Закрыть','Close')}">✕</button></div>`+SEC[id]();
 panel.classList.add('on');panel.setAttribute('aria-hidden','false');$$('#dock button').forEach(b=>b.classList.toggle('on',b.dataset.open===id));$('#close').focus({preventScroll:true});track('open_section',{section:id})}
function close(){cur=null;panel.classList.remove('on');panel.setAttribute('aria-hidden','true');$$('#dock button').forEach(b=>b.classList.toggle('on',b.dataset.open==='terminal'));if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});lastFocus=null}
function rerender(){const y=sheet.scrollTop;open(cur);sheet.scrollTop=y}
document.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o){open(o.dataset.open);return}
 const v=e.target.closest('[data-vessel]');if(v){selVessel=v.dataset.vessel;open('vessels');return}
 const tb=e.target.closest('[data-tab]');if(tb){open(tb.dataset.tab);sheet.scrollTop=0;return}
 if(e.target.closest('#close')){close();return}
 const sh=e.target.closest('[data-ship]')||e.target.closest('[data-vrow]');if(sh){selVessel=sh.dataset.ship||sh.dataset.vrow;rerender();return}
 const md=e.target.closest('[data-mode]');if(md){const l=D.lots.find(x=>x.id===md.closest('[data-lot]').dataset.lot);if(l.mode!==md.dataset.mode){l.mode=md.dataset.mode;l.carrier=bestFor(l);rerender()}return}
 if(e.target===panel)close()});
document.addEventListener('change',e=>{const p=e.target.closest('[data-pick]');if(p){D.lots.find(x=>x.id===p.dataset.pick).carrier=p.value;rerender();track('pick_carrier',{})}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cur)close()});

/* ---------- 3D terminal ---------- */
const W=$('#world'),mobile=innerWidth<700;let R3;try{R3=new THREE.WebGLRenderer({antialias:true})}catch(_){W.style.background='#e8eef0';return}
R3.setPixelRatio(Math.min(mobile?1.5:2,devicePixelRatio));R3.shadowMap.enabled=true;R3.shadowMap.type=THREE.PCFSoftShadowMap;R3.outputColorSpace=THREE.SRGBColorSpace;W.appendChild(R3.domElement);
const S=new THREE.Scene();S.background=new THREE.Color('#e8eef0');S.fog=new THREE.Fog('#e8eef0',100,190);
const C=new THREE.PerspectiveCamera(30,1,.1,500);C.position.set(54,50,58);
const O=new OrbitControls(C,R3.domElement);O.target.set(-1,0,0);O.enableDamping=true;O.maxPolarAngle=1.2;O.minPolarAngle=.45;O.minDistance=30;O.maxDistance=130;O.enablePan=false;
S.add(new THREE.HemisphereLight('#ffffff','#cfd8dc',1.5));const sun=new THREE.DirectionalLight('#fff7ee',2.3);sun.position.set(25,40,18);sun.castShadow=true;sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);Object.assign(sun.shadow.camera,{left:-38,right:38,top:38,bottom:-38});sun.shadow.bias=-.0005;S.add(sun);
const MC={},M=c=>MC[c]||(MC[c]=new THREE.MeshStandardMaterial({color:c,roughness:.8}));
function box(w,h,d,c,x,y,z,p=S){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y+h/2,z);m.castShadow=m.receiveShadow=true;p.add(m);return m}
const water=new THREE.Mesh(new THREE.BoxGeometry(90,1,30),new THREE.MeshStandardMaterial({color:'#7fb2c9',roughness:.35,metalness:.1}));water.position.set(0,-1.2,-20);water.receiveShadow=true;S.add(water);
box(72,1.6,22,'#d7d9d4',0,-1.6,6);box(72,.3,.6,'#f2c230',0,0,-4.8);
box(72,.04,3.4,'#5d6670',0,0,.4);for(let x=-34;x<35;x+=3)box(1.4,.05,.15,'#ffffff',x,.02,.4);
box(72,.04,2.2,'#a99a86',0,0,6.2);[5.6,6.8].forEach(z=>box(72,.12,.12,'#6b6f74',0,.05,z));for(let x=-35;x<36;x+=1.2)box(.25,.06,1.8,'#7a634c',x,.02,6.2);
const ship=new THREE.Group();S.add(ship);
box(38,3.2,7.6,'#25425e',0,-1.4,-11,ship);box(38,.4,7.6,'#c24b3a',0,-1.8,-11,ship);box(38.4,.3,7.8,'#ffffff',0,1.8,-11,ship);
box(4,6,6.4,'#f4f4f2',15.5,1.8,-11,ship);box(4.4,.6,7,'#25425e',15.5,7.8,-11,ship);box(1,2.5,1,'#c24b3a',15.5,8.4,-11,ship);
const CC=['#ff5a1f','#4f73c9','#1f9a6e','#e8a32e','#c24b3a','#8b6fd0','#5aa7c7'];
function cont(c){const g=new THREE.Group();const m=new THREE.Mesh(new THREE.BoxGeometry(2.6,1.1,1.05),M(c));m.position.y=.55;m.castShadow=m.receiveShadow=true;g.add(m);return g}
const deck=[];let k=0;
for(let x=-16;x<=12;x+=2.8)for(let z=-13.6;z<=-8.4;z+=1.3)for(let t=0;t<(2+((x*7+z*3)|0)%2);t++){const g=cont(CC[(k++)%CC.length]);g.position.set(x,2.1+t*1.12,z);S.add(g);deck.push(g)}
for(let x=-8;x<=20;x+=2.8)for(let z=10;z<=12.6;z+=1.3)for(let t=0;t<1+((x+z)|0)%3;t++){const g=cont(CC[(k++)%CC.length]);g.position.set(x,t*1.12,z);S.add(g)}
deck.forEach(d=>d.userData.home=d.position.clone());
box(8,7,6,'#f4f6f7',-19,0,10);for(let f=0;f<3;f++)for(let i=0;i<4;i++)box(1.3,1.2,.1,'#9fc3d6',-21.9+i*1.9,1.2+f*2,13.05);box(8.4,.5,6.4,'#1f5f8b',-19,7,10);box(2,1.6,.1,'#1f5f8b',-19,0,13.05);
box(4,3,3.4,'#f4f6f7',24,0,11.5);box(4.4,.4,3.8,'#8b6fd0',24,3,11.5);box(3,1,.1,'#9fc3d6',24,1.5,13.22);box(.1,1,2.2,'#9fc3d6',21.98,1.5,11.5);
function crane(cx,z1,z2,color){const g={cx};const H=9;[[-1.8,z1],[1.8,z1],[-1.8,z2],[1.8,z2]].forEach(([dx,z])=>box(.5,H,.5,color,cx+dx,0,z));
 box(4.1,.6,.6,color,cx,H-.6,z1);box(4.1,.6,.6,color,cx,H-.6,z2);box(.5,.6,z2-z1,color,cx-1.8,H-.6,(z1+z2)/2);box(.5,.6,z2-z1,color,cx+1.8,H-.6,(z1+z2)/2);
 box(1.2,.7,22,color,cx,H,(z1-16+z2)/2);box(2.4,1.6,2,'#f4f6f7',cx+2.2,H-1.6,z2-1);
 [-1.8,1.8].forEach(dx=>{box(.7,.5,1.2,'#2b2f35',cx+dx,0,z1);box(.7,.5,1.2,'#2b2f35',cx+dx,0,z2)});
 g.trolley=box(1.6,.6,1.4,'#2b2f35',cx,H-.6,z1);g.H=H-.6;g.cable=new THREE.Mesh(new THREE.BoxGeometry(.06,1,.06),M('#2b2f35'));S.add(g.cable);g.spreader=box(2.7,.25,1.1,'#f2c230',cx,0,z1);return g}
const cranes=[crane(-6,-3.6,3.2,'#ff5a1f'),crane(8,-3.6,8.4,'#4f73c9')];
function truck(){const g=new THREE.Group();const p=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);m.castShadow=true;g.add(m)};
 p(1.4,1.3,1.3,'#f4f6f7',1.9,1,0);p(.06,.5,1,'#9fc3d6',2.62,1.3,0);p(3,.25,1.1,'#2b2f35',-.3,.55,0);
 [1.9,-.8,-1.6].forEach(x=>[-.55,.55].forEach(z=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.25,14),M('#1b1e22'));w.rotation.x=Math.PI/2;w.position.set(x,.32,z);g.add(w)}));g.rotation.y=Math.PI;S.add(g);return g}
const trucks=[0,1,2].map(i=>({g:truck(),x:14+i*12,state:'come',load:null}));
const train=new THREE.Group();S.add(train);const PL=3.2,NP=5,slots=[];
for(let i=0;i<NP;i++){box(3,.35,1.2,'#5d4636',i*PL,.45,0,train);[-1,1].forEach(dx=>[-.45,.45].forEach(z=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.15,12),M('#1b1e22'));w.rotation.x=Math.PI/2;w.position.set(i*PL+dx,.25,z);train.add(w)}));slots.push(null)}
box(3.6,1.8,1.3,'#1f9a6e',-3.6,.45,0,train);box(1.2,.6,1.3,'#1f9a6e',-4.6,2.25,0,train);
train.position.set(-48,.1,6.2);let trainState='arrive',trainSlot=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
cranes.forEach((c,i)=>{c.z=-10;c.y=c.H-1;c.phase='toShip';c.carry=null;c.target=i===0?'truck':'rail';c.wait=i*2});
function nearestDeck(cx){let best=null,bd=1e9;deck.forEach(d=>{if(d.userData.taken)return;const dd=Math.abs(d.position.x-cx);if(dd<1.5){const top=!deck.some(o=>o!==d&&!o.userData.taken&&Math.abs(o.position.x-d.position.x)<.1&&Math.abs(o.position.z-d.position.z)<.1&&o.position.y>d.position.y);if(top&&dd<bd){bd=dd;best=d}}});return best}
function resetShip(){deck.forEach(d=>{if(d.parent!==S)S.attach(d);d.userData.taken=false;d.position.copy(d.userData.home)})}
const lerpTo=(v,t,s)=>Math.abs(t-v)<s?t:v+Math.sign(t-v)*s;
function tick(dt){if(reduce)return;const cx=cranes[0].cx;
 trucks.forEach(t=>{if(t.state==='come'){const q=trucks.some(o=>o!==t&&o.state!=='leave'&&o.x<t.x&&o.x>t.x-5.5);if(!q)t.x=Math.max(cx,t.x-dt*8);if(t.x===cx)t.state='wait'}
  else if(t.state==='leave'){t.x-=dt*7;if(t.x<-34){t.x=34;t.state='come';if(t.load){t.load.userData.taken=false;t.load.position.copy(t.load.userData.home);t.load=null}}}
  t.g.visible=Math.abs(t.x)<33.5;if(t.load)t.load.visible=t.g.visible;t.g.position.set(t.x,0,.4);if(t.load)t.load.position.set(t.x-.3,.68,.4)});
 if(trainState==='arrive'){const tx=cranes[1].cx-trainSlot*PL;train.position.x=lerpTo(train.position.x,tx,dt*8);if(train.position.x===tx)trainState='ready'}
 else if(trainState==='leave'){train.position.x+=dt*9;if(train.position.x>40){slots.forEach((s,i)=>{if(s){S.attach(s);s.visible=true;s.userData.taken=false;s.position.copy(s.userData.home)}slots[i]=null});trainSlot=0;train.position.x=-48;trainState='arrive'}}
 train.visible=train.position.x>-38&&train.position.x<30;
 cranes.forEach(c=>{if(c.wait>0){c.wait-=dt;return}const sp=dt*8,vs=dt*6.5,top=c.H-1;
  if(c.phase==='toShip'){c.y=lerpTo(c.y,top,vs);if(c.y===top){c.pick=c.pick||nearestDeck(c.cx);if(!c.pick){resetShip();return}c.pick.userData.taken=true;c.z=lerpTo(c.z,c.pick.position.z,sp);if(c.z===c.pick.position.z)c.phase='down'}}
  else if(c.phase==='down'){const ty=c.pick.position.y+1.12;c.y=lerpTo(c.y,ty,vs);if(c.y===ty){c.carry=c.pick;c.pick=null;c.phase='up'}}
  else if(c.phase==='up'){c.y=lerpTo(c.y,top,vs);if(c.y===top)c.phase='toTarget'}
  else if(c.phase==='toTarget'){const tz=c.target==='truck'?.4:6.2,ready=c.target==='truck'?trucks.some(t=>t.state==='wait'):trainState==='ready';c.z=lerpTo(c.z,tz,sp);if(c.z===tz&&ready)c.phase='drop'}
  else if(c.phase==='drop'){const ty=(c.target==='truck'?.68:.9)+1.12;c.y=lerpTo(c.y,ty,vs);if(c.y===ty){
    if(c.target==='truck'){const t=trucks.find(t=>t.state==='wait');t.load=c.carry;t.state='leave'}else{train.attach(c.carry);c.carry.position.set(trainSlot*PL,.8,0);slots[trainSlot]=c.carry;trainSlot++;trainState=trainSlot>=NP?'leave':'arrive'}
    c.carry=null;c.phase='toShip'}}
  c.trolley.position.z=c.z;c.spreader.position.set(c.cx,c.y,c.z);const len=c.H-c.y;c.cable.scale.y=Math.max(.01,len);c.cable.position.set(c.cx,c.y+len/2+.2,c.z);if(c.carry)c.carry.position.set(c.cx,c.y-1.12,c.z)})}
const unassigned=D.lots.filter(l=>lotCalc(l).status!=='ok').length;
const TAGS=[
 {p:[-19,9.5,10],s:'finance',c:'#1f5f8b',h:T('Финансы','Finance'),b:T('профит ','profit ')+money(last.profit,1)},
 {p:[2,9.5,-11],s:'clients',c:'#ff5a1f',h:T('Клиенты','Clients'),b:nf(teuMonth)+' TEU · '+D.clients.length+' '+T('клиентов','clients')},
 {p:[-14,3.2,.4],s:'trucks',c:'#e8a32e',h:T('Автовывоз','Trucking'),b:D.trucks.length+' '+T('тягача','tractors')+' · '+pct(loadTrucks,0),x:T('амортизация ','depreciation ')+money(amortTrucks,1)+T(' / мес',' / mo')},
 {p:[16,3,6.2],s:'rail',c:'#1f9a6e',h:T('ЖД-платформы','Rail flatcars'),b:(D.rail.own+D.rail.leased)+' '+T('платформ','flatcars')+' · '+pct(D.rail.load[5],0),x:T('амортизация ','depreciation ')+money(D.rail.amortOwn,1)+T(' / мес',' / mo')},
 {p:[6,4.4,11.5],s:'dispatch',c:'#3a86b7',h:T('Распределение','Dispatch'),b:D.lots.length+' '+T('партий к отправке','lots to send'),w:unassigned?unassigned+' '+T('ждут ответа перевозчика','awaiting carriers'):''},
 {p:[24,4.4,11.5],s:'sales',c:'#8b6fd0',h:T('Продажи и команда','Sales & team'),b:T('конверсия лидов ','lead conversion ')+pct(conv,0),w:over.length+' '+T('перегружены','overloaded')},
];
const TG=$('#tags');TAGS.forEach(t=>{t.el=document.createElement('button');t.el.className='tag';t.el.dataset.open=t.s;t.el.innerHTML=`<small><i style="background:${t.c}"></i>${t.h}</small><b>${t.b}</b>${t.x?`<span>${t.x}</span>`:''}${t.w?`<span class="warn">${t.w}</span>`:''}<em>${T('Открыть →','Open →')}</em>`;TG.appendChild(t.el);t.v=new THREE.Vector3(...t.p)});
// click on 3D objects
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();let down=null;
R3.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
R3.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;mv.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(mv,C);const h=ray.intersectObjects(S.children,true)[0];if(!h)return;const p=h.point;
 let s=null;if(p.z<-5)s='clients';else if(p.x<-14&&p.z>6)s='finance';else if(p.x>21&&p.z>9)s='sales';else if(Math.abs(p.z-6.2)<1.3)s='rail';else if(Math.abs(p.z-.4)<2)s='trucks';else if(p.z>9)s='dispatch';if(s)open(s)});
function size(){R3.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;C.fov=innerWidth<700?52:innerWidth<1100?38:30;C.updateProjectionMatrix()}addEventListener('resize',size);size();
const tmp=new THREE.Vector3(),clock=new THREE.Clock();
(function loop(){const dt=Math.min(clock.getDelta(),.05);if(!cur){tick(dt);O.update();R3.render(S,C);TAGS.forEach(t=>{tmp.copy(t.v).project(C);t.el.style.left=(tmp.x*.5+.5)*innerWidth+'px';t.el.style.top=(-tmp.y*.5+.5)*innerHeight-10+'px'})}requestAnimationFrame(loop)})();
})();
