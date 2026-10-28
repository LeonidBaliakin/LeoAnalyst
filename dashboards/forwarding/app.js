/* «Вектор Логистик» — LeoAnalyst freight forwarding demo. Synthetic data. */
(function(){
'use strict';
const D=window.FWD_DATA,RU=!D.EN,T=(r,e)=>RU?r:e;
const loc=RU?'ru-RU':'en-GB',nf=(v,d=0)=>new Intl.NumberFormat(loc,{maximumFractionDigits:d,minimumFractionDigits:d}).format(v),pct=(v,d=1)=>nf(v,d)+'%';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function money(v,short){if(!RU){const x=v/D.usdRate,a=Math.abs(x);if(short){if(a>=1e6)return '$'+nf(x/1e6,2)+'M';if(a>=1e4)return '$'+nf(x/1e3,0)+'K'}return '$'+nf(x)}const a=Math.abs(v);if(short){if(a>=1e6)return nf(v/1e6,1)+' млн ₽';if(a>=1e4)return nf(v/1e3,0)+' тыс. ₽'}return nf(v)+' ₽'}
const days=n=>RU?n+' '+(n%10===1&&n%100!==11?'день':n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?'дня':'дней'):n+(n===1?' day':' days');
const track=(e,p)=>{try{gtag('event',e,p)}catch(_){}};
const ini=n=>n.split(' ').map(w=>w[0]).join('').slice(0,2);
const F=D.fin,last=F[11],prev=F[10],margin=last.profit/last.rev*100,pmargin=prev.profit/prev.rev*100;
const fu=D.funnel,conv=fu[3][1]/fu[0][1]*100,pconv=D.convTrend[4];
const dpct=(a,b)=>(a/b-1)*100;
const delta=(v,good=true)=>`<span class="dl ${(v>=0)===good?'up':'dn'}">${v>=0?'↑':'↓'}${pct(Math.abs(v))}</span>`;
const IC={rub:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h13a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M4 7l11-3v3M16 13h1"/></svg>',
 up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 17l6-6 4 4 6-7"/><path d="M15 8h5v5"/></svg>',
 pie:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 3v9h9a9 9 0 1 1-9-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/></svg>',
 fun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 5h18l-7 8v5l-4 2v-7z"/></svg>',
 truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3.2v2.8h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
 phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
 msg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 5h16v11H8l-4 4z"/></svg>'};

/* charts */
function barsLine(vals,line,plan,labels,{w=760,h=230,pad=58}={}){const max=Math.max(...vals,...plan)*1.08,bw=(w-pad)/vals.length;let s=`<svg class="chart" viewBox="0 -10 ${w} ${h+32}" role="img">`;
 for(let i=0;i<=3;i++){const y=h-h*i/3;s+=`<line x1="${pad}" x2="${w}" y1="${y}" y2="${y}" stroke="#e8ebee"/><text x="0" y="${y+4}">${money(max*i/3,1)}</text>`}
 vals.forEach((v,i)=>{const x=pad+i*bw+bw*.2,bh=v/max*h;s+=`<rect x="${x}" y="${h-bh}" width="${bw*.6}" height="${bh}" rx="6" fill="${i===vals.length-1?'var(--or)':'#d5d9df'}"><title>${labels[i]}: ${money(v,1)}</title></rect><line x1="${x-2}" x2="${x+bw*.6+2}" y1="${h-plan[i]/max*h}" y2="${h-plan[i]/max*h}" stroke="var(--ink)" stroke-width="2"/><text x="${x+bw*.3}" y="${h+18}" text-anchor="middle">${labels[i]}</text>`});
 const lm=Math.max(...line)*1.12,ly=v=>h-v/lm*h*.92;s+=`<polyline fill="none" stroke="var(--ink)" stroke-width="2.5" points="${line.map((v,i)=>`${pad+i*bw+bw/2},${ly(v)}`).join(' ')}"/>`;line.forEach((v,i)=>s+=`<circle cx="${pad+i*bw+bw/2}" cy="${ly(v)}" r="3.5" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"><title>${labels[i]}: ${money(v,1)}</title></circle>`);return s+'</svg>'}
function spark(v,c){const w=96,h=26,mx=Math.max(...v),mn=Math.min(...v),r=mx-mn||1;return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><polyline fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round" points="${v.map((x,i)=>`${i*w/(v.length-1)},${h-3-(x-mn)/r*(h-6)}`).join(' ')}"/></svg>`}
function lineSmall(v,labels,{w=420,h=120,color='var(--or)'}={}){const pad=34,mx=Math.max(...v)*1.04,mn=Math.min(...v)*.94,sx=(w-pad)/(v.length-1),y=x=>h-(x-mn)/(mx-mn)*h;let s=`<svg class="chart" viewBox="0 -8 ${w} ${h+28}">`;
 [mn,(mn+mx)/2,mx].forEach(t=>s+=`<line x1="${pad}" x2="${w}" y1="${y(t)}" y2="${y(t)}" stroke="#e8ebee"/><text x="0" y="${y(t)+4}">${pct(t,0)}</text>`);
 s+=`<polyline fill="none" stroke="${color}" stroke-width="2.5" points="${v.map((x,i)=>`${pad+i*sx},${y(x)}`).join(' ')}"/>`;v.forEach((x,i)=>s+=`<circle cx="${pad+i*sx}" cy="${y(x)}" r="3.5" fill="${color}"><title>${labels[i]}: ${pct(x)}</title></circle><text x="${pad+i*sx}" y="${h+18}" text-anchor="${i===v.length-1?'end':'middle'}">${labels[i]}</text>`);return s+'</svg>'}
function gauge(p){const R=60,cx=75,cy=72,seg=18;let s=`<svg viewBox="0 0 150 86" role="img" aria-label="${pct(p)}">`;for(let i=0;i<seg;i++){const a0=Math.PI+i*Math.PI/seg+.03,a1=Math.PI+(i+1)*Math.PI/seg-.03,on=(i+.5)/seg<=p/25;const pt=(a,r)=>`${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;s+=`<path d="M${pt(a0,R)} A${R} ${R} 0 0 1 ${pt(a1,R)} L${pt(a1,R-16)} A${R-16} ${R-16} 0 0 0 ${pt(a0,R-16)}Z" fill="${on?'var(--or)':'#e3e6ea'}"/>`}return s+'</svg>'}

/* state */
let cur=0,sortBy='rev';
const S=D.shipments;
function shipCard(sh){const cl=D.clients[sh.client];return `<div class="t"><span>${T('Перевозка','Shipment')}</span><span class="st ${sh.status}">${sh.stLabel}</span></div>
 <div class="id">${sh.id}<small>${esc(cl.name)} · ${esc(cl.cargo)}</small></div>
 <div class="rows"><div><span>${T('Контейнер','Container')}</span><b>${sh.container} · ${sh.type}′</b></div><div><span>${T('Маршрут','Route')}</span><b>${esc(sh.from)} → ${esc(sh.to)}</b></div><div><span>${T('Перевозчик','Carrier')}</span><b>${esc(sh.carrier)}</b></div><div><span>${T('Вес','Weight')}</span><b>${sh.weight} ${T('т','t')}</b></div><div><span>${T('Прибытие','Arrival')}</span><b>${sh.eta?T('через ','in ')+days(sh.eta):T('сегодня','today')}</b></div></div>`}
function sidePanel(sh){const lg=D.team[sh.logist],pr=sh.sale-sh.cost,m=pr/sh.sale*100;
 return `<div class="card"><div class="ch"><div><h3>${T('Рейс','Trip')}</h3><div class="sub">${sh.plate}</div></div></div>
 <div class="who"><span class="ava">${ini(lg.name)}</span><div><small>${T('Ответственный логист','Logistics manager')}</small><b>${esc(lg.name)}</b></div><span class="act"><button class="iconb" aria-label="${T('Позвонить','Call')}">${IC.phone}</button><button class="iconb" aria-label="${T('Написать','Message')}">${IC.msg}</button></span></div>
 <div class="trip"><div><small>${T('Ставка клиенту','Client rate')}</small><b>${money(sh.sale)}</b></div><div><small>${T('Перевозчику','Carrier rate')}</small><b>${money(sh.cost)}</b></div><div><small>${T('Профит','Profit')}</small><b class="pos">${money(pr)}</b></div></div>
 <div class="route"><div><b>${esc(sh.from)}</b><small>${T('отправка','origin')}</small></div><div class="track"><i style="width:${sh.progress}%"></i><em style="left:${Math.min(97,Math.max(3,sh.progress))}%"></em></div><div class="r"><b>${esc(sh.to)}</b><small>${T('доставка','destination')}</small></div></div>
 <div class="btns"><button class="btn">${T('Сменить перевозчика','Change carrier')}</button><button class="btn">${T('Документы','Documents')}</button></div></div>
 <div class="card"><div class="ch"><div><h3>${T('Маржа рейса','Trip margin')}</h3><div class="sub">${T('шкала до 25%','scale up to 25%')}</div></div></div>
 <div class="gauge">${gauge(m)}<div class="mini"><div><small>${T('Маржинальность','Margin')}</small><b class="num">${pct(m)}</b></div><div><small>${T('Средняя по компании','Company average')}</small><b>${pct(margin)}</b></div></div></div></div>`}
function render(){
 const sh=S[cur],app=document.getElementById('app');
 const cls=[...D.clients].sort((a,b)=>sortBy==='rev'?b.rev-a.rev:sortBy==='profit'?b.profit-a.profit:dpct(b.ship[5],b.ship[3])-dpct(a.ship[5],a.ship[3]));
 const totalShip=D.clients.reduce((a,c)=>a+c.ship[5],0);const over=D.team.filter(p=>p.active/p.norm>1.08);
 app.innerHTML=`<header class="top"><div class="brand"><span class="logo">${IC.truck}</span>${esc(D.company)}</div>
 <nav class="nav" aria-label="${T('Разделы','Sections')}"><a href="#overview" class="on">${T('Обзор','Overview')}</a><a href="#finance">${T('Финансы','Finance')}</a><a href="#clients">${T('Клиенты','Clients')}</a><a href="#team">${T('Команда','Team')}</a><a href="#sales">${T('Продажи','Sales')}</a></nav>
 <span class="date">${new Date(2026,9,28).toLocaleDateString(loc,{day:'numeric',month:'long',year:'numeric'})}</span><span class="ava" style="background:var(--or)">${ini(D.team[0].name)}</span></header>
 <section class="head" id="overview"><div><h1>${T('Обзор за октябрь','October overview')}</h1><p>${T('Главное для руководителя: деньги, клиенты, нагрузка команды и продажи.','What matters to the owner: money, clients, team workload and sales.')}</p></div>
 <div class="kpis"><div class="kpi"><span class="ic">${IC.rub}</span><div><small>${T('Общий оборот','Total turnover')}</small><b>${money(last.rev,1)}</b>${delta(dpct(last.rev,prev.rev))}</div></div>
 <div class="kpi"><span class="ic">${IC.up}</span><div><small>${T('Общий профит','Total profit')}</small><b>${money(last.profit,1)}</b>${delta(dpct(last.profit,prev.profit))}</div></div>
 <div class="kpi"><span class="ic">${IC.pie}</span><div><small>${T('Маржинальность','Margin')}</small><b>${pct(margin)}</b>${delta(margin-pmargin)}</div></div>
 <div class="kpi"><span class="ic">${IC.fun}</span><div><small>${T('Конверсия лидов','Lead conversion')}</small><b>${pct(conv)}</b>${delta(conv-pconv)}</div></div></div></section>
 <div class="grid main"><div class="card hero"><div class="stage"><img id="heroImg" src="img/hero${sh.img}.jpg" alt="${T('Контейнеровоз','Container truck')}" width="1200" height="900"></div><div class="ship" id="shipCard">${shipCard(sh)}</div>
 <div class="strip" role="listbox" aria-label="${T('Перевозки в работе','Active shipments')}">${S.map((x,i)=>`<button class="chip${i===cur?' on':''}" data-i="${i}" role="option" aria-selected="${i===cur}"><b>${x.id}</b><span>${esc(x.from)} → ${esc(x.to)}</span><img src="img/thumb${x.img}.jpg" alt="" loading="lazy"></button>`).join('')}</div></div>
 <aside class="side" id="side">${sidePanel(sh)}</aside></div>
 <div class="grid lower">
 <section class="card span2" id="finance"><div class="ch"><div><h3>${T('Оборот и профит','Turnover and profit')}</h3><div class="sub">${T('12 месяцев · столбцы — оборот, черта — план, линия — профит (своя шкала)','12 months · bars — turnover, tick — plan, line — profit (own scale)')}</div></div><div class="legend"><span><i style="background:var(--or)"></i>${T('октябрь','October')}</span><span><i style="background:var(--ink)"></i>${T('профит','profit')}</span></div></div>${barsLine(F.map(f=>f.rev),F.map(f=>f.profit),F.map(f=>f.plan),D.MONTHS)}</section>
 <section class="card"><div class="ch"><div><h3>${T('Оборот по типу перевозки','Turnover by equipment')}</h3><div class="sub">${T('октябрь · доля и маржа','October · share and margin')}</div></div></div><div class="bodies">${D.bodies.map(b=>`<div class="body"><img src="img/${b[1]}.jpg" alt="" loading="lazy"><div><b>${b[0]}</b><div class="bar"><i style="width:${b[2]*100/0.5}%"></i></div></div><div class="v">${money(last.rev*b[2],1)}<small>${T('маржа ','margin ')}${pct(b[3]*100,0)}</small></div></div>`).join('')}</div></section>
 <section class="card span3" id="clients"><div class="ch"><div><h3>${T('Клиенты: оборот, профит и движение объёмов','Clients: turnover, profit and volume trend')}</h3><div class="sub">${T(`${nf(totalShip)} перевозок за октябрь · график — перевозки за 6 месяцев`,`${nf(totalShip)} shipments in October · chart — shipments over 6 months`)}</div></div>
 <div class="seg" role="group" aria-label="${T('Сортировка','Sort')}">${[['rev',T('Оборот','Turnover')],['profit',T('Профит','Profit')],['trend',T('Динамика','Trend')]].map(o=>`<button data-sort="${o[0]}" class="${sortBy===o[0]?'on':''}">${o[1]}</button>`).join('')}</div></div>
 <table class="t cards"><colgroup><col style="width:22%"><col style="width:10%"><col style="width:14%"><col style="width:10%"><col style="width:13%"><col style="width:12%"><col style="width:9%"><col style="width:10%"></colgroup>
 <thead><tr><th>${T('Клиент','Client')}</th><th class="r">${T('Перевозок','Shipments')}</th><th>${T('6 месяцев','6 months')}</th><th class="r">${T('Динамика','Trend')}</th><th class="r">${T('Оборот','Turnover')}</th><th class="r">${T('Профит','Profit')}</th><th class="r">${T('Маржа','Margin')}</th><th class="r">${T('Доля','Share')}</th></tr></thead><tbody>${cls.map(c=>{const d=dpct(c.ship[5],c.ship[3]);return `<tr><td data-l="${T('Клиент','Client')}"><b>${esc(c.name)}</b><span class="muted">${esc(c.cargo)}</span></td><td class="r" data-l="${T('Перевозок','Shipments')}">${c.ship[5]}</td><td data-l="${T('6 месяцев','6 months')}">${spark(c.ship,d<-3?'var(--bad)':'var(--ink2)')}</td><td class="r ${d>3?'pos':d<-3?'neg':''}" data-l="${T('Динамика','Trend')}">${d>=0?'↑':'↓'}${pct(Math.abs(d),0)}</td><td class="r" data-l="${T('Оборот','Turnover')}">${money(c.rev,1)}</td><td class="r" data-l="${T('Профит','Profit')}">${money(c.profit,1)}</td><td class="r" data-l="${T('Маржа','Margin')}">${pct(c.profit/c.rev*100)}</td><td class="r" data-l="${T('Доля','Share')}">${pct(c.rev/last.rev*100,0)}</td></tr>`}).join('')}</tbody></table></section>
 <section class="card span2" id="team"><div class="ch"><div><h3>${T('Нагрузка сотрудников','Team workload')}</h3><div class="sub">${T('перевозок и заявок в работе сейчас · черта — норма','shipments and requests in progress now · tick — norm')}</div></div><div class="legend"><span><i style="background:var(--ink2)"></i>${T('в норме','normal')}</span><span><i style="background:var(--warn)"></i>${T('на пределе','at limit')}</span><span><i style="background:var(--bad)"></i>${T('перегруз','overloaded')}</span></div></div>
 <div class="people">${D.team.map(p=>{const r=p.active/p.norm,w=Math.min(100,r/1.4*100);return `<div class="person"><div><b>${esc(p.name)}</b><small>${esc(p.role)}</small></div><div class="load" title="${p.active} / ${p.norm}"><i class="${r>1.08?'hi':r>.98?'mid':''}" style="width:${w}%"></i><u style="left:${100/1.4}%"></u></div><span class="pc ${r>1.08?'neg':''}">${p.active}/${p.norm}</span></div>`}).join('')}</div>
 ${over.length?`<div class="note">${T(`Перегружены: ${over.map(p=>p.name).join(', ')}. Новые заявки лучше передать тем, у кого запас.`,`Overloaded: ${over.map(p=>p.name).join(', ')}. Route new requests to people with spare capacity.`)}</div>`:''}</section>
 <section class="card" id="sales"><div class="ch"><div><h3>${T('Конверсия лидов','Lead conversion')}</h3><div class="sub">${T('октябрь · от заявки до сделки','October · from enquiry to deal')}</div></div></div>
 <div class="funnel">${fu.map((f,i)=>`<div class="fstep"><span>${f[0]}</span><div style="width:${Math.max(18,f[1]/fu[0][1]*100)}%;opacity:${1-i*.17}">${f[1]}</div><span>${i?pct(f[1]/fu[i-1][1]*100,0):''}</span></div>`).join('')}</div>
 <div style="margin-top:12px">${lineSmall(D.convTrend,D.MONTHS.slice(-6))}</div>
 <table class="t" style="margin-top:6px"><colgroup><col style="width:50%"><col><col></colgroup><thead><tr><th>${T('Источник','Source')}</th><th class="r">${T('Лидов','Leads')}</th><th class="r">${T('Конверсия','Conv.')}</th></tr></thead><tbody>${D.sources.map(x=>`<tr><td>${x[0]}</td><td class="r">${pct(x[1]*100,0)}</td><td class="r ${x[2]<.1?'neg':''}">${pct(x[2]*100,0)}</td></tr>`).join('')}</tbody></table></section>
 </div><p class="foot">${T('Демо-данные. Компания, клиенты и сотрудники вымышленные.','Demo data. Company, clients and people are fictional.')}</p>`;
}
render();
function select(i){if(i===cur)return;cur=i;const sh=S[i],img=document.getElementById('heroImg');const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const swap=()=>{img.src=`img/hero${sh.img}.jpg`;img.classList.remove('out')};
 if(reduce)swap();else{img.classList.add('out');setTimeout(()=>{const pre=new Image();pre.onload=pre.onerror=swap;pre.src=`img/hero${sh.img}.jpg`},140)}
 document.getElementById('shipCard').innerHTML=shipCard(sh);document.getElementById('side').innerHTML=sidePanel(sh);
 document.querySelectorAll('.chip').forEach((c,k)=>{c.classList.toggle('on',k===i);c.setAttribute('aria-selected',k===i)});track('select_shipment',{})}
document.addEventListener('click',e=>{const c=e.target.closest('.chip');if(c){select(+c.dataset.i);return}
 const so=e.target.closest('[data-sort]');if(so){sortBy=so.dataset.sort;const y=scrollY;render();scrollTo(0,y);return}
 const a=e.target.closest('.nav a');if(a){document.querySelectorAll('.nav a').forEach(x=>x.classList.toggle('on',x===a))}});
// preload hero images after first paint
addEventListener('load',()=>S.forEach(s=>{const i=new Image();i.src=`img/hero${s.img}.jpg`}));
})();
