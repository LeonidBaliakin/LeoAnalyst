/* Ritm · team workspace — LeoAnalyst interactive demo. Synthetic data only. */
(function(){
'use strict';
const D=window.RITM_DATA,DAY=D.DAY,TODAY=D.today;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{const v=localStorage.getItem('ritm_'+k);return v==null?d:JSON.parse(v)}catch(_){return d}},set(k,v){try{localStorage.setItem('ritm_'+k,JSON.stringify(v))}catch(_){}}};
const saved=store.get('tasks',null);
if(Array.isArray(saved)){const map=Object.fromEntries(saved.map(t=>[t.id,t]));D.tasks=D.tasks.map(t=>map[t.id]?{...t,status:map[t.id].status,progress:map[t.id].progress}:t).concat(saved.filter(t=>t.custom));}
const state={lang:store.get('lang','ru'),theme:store.get('theme','light'),accent:store.get('accent','ocean'),page:'dashboard',filter:'all',dept:'all',person:null,anPeriod:30,calMonth:null,calDay:TODAY,setTab:'profile',modal:null,q:'',
 timer:{running:true,start:Date.now()-(1*3600+24*60+8)*1000,acc:0},capSel:null,notif:store.get('notif',{tasks:true,mentions:true,digest:false,deadlines:true}),weekStart:store.get('week','mon')};
const T=(ru,en)=>state.lang==='ru'?ru:en,L=o=>o?(state.lang==='ru'?o.ru:o.en):'';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const loc=()=>state.lang==='ru'?'ru-RU':'en-GB';
const num=v=>new Intl.NumberFormat(loc(),{maximumFractionDigits:1}).format(v);
const dt=(t,o)=>new Date(t).toLocaleDateString(loc(),o||{day:'numeric',month:'short'});
const ppl=Object.fromEntries(D.people.map(p=>[p.id,p])),prj=Object.fromEntries(D.projects.map(p=>[p.id,p])),tagBy=Object.fromEntries(D.tags.map(t=>[t.id,t])),dep=Object.fromEntries(D.depts.map(d=>[d.id,d]));
const initials=p=>L(p).split(' ').map(w=>w[0]).join('');
const avBg=p=>`hsl(${p.hue} 70% 90%)`,avFg=p=>`hsl(${p.hue} 45% 32%)`;
const stColor={online:'#1f9a6e',away:'#e8a32e',offline:'#aab1c0'};
function av(p,size='sm',dot){return`<span class="av av-${size}" style="background:${avBg(p)};color:${avFg(p)}" title="${esc(L(p))}">${esc(initials(p))}${dot?`<i style="background:${stColor[p.status]}"></i>`:''}</span>`;}
const STAGES=[{id:'todo',ru:'К выполнению',en:'To do',c:'#9aa3b5'},{id:'progress',ru:'В работе',en:'In progress',c:'#e8a32e'},{id:'review',ru:'На проверке',en:'In review',c:'#2f5cd0'},{id:'done',ru:'Готово',en:'Done',c:'#1f9a6e'}];
const stLabel=s=>L(STAGES.find(x=>x.id===s));
const ME='p1';
function saveTasks(){store.set('tasks',D.tasks.map(t=>({id:t.id,status:t.status,progress:t.progress,...(t.custom?t:{})})));}

const I={
 grid:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
 check:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
 cal:'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/>',
 chart:'<path d="M5 20V10M10 20V5M15 20v-7M20 20v-4"/>',
 team:'<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.3a3 3 0 0 1 0 5.6M18 14.5c1.6.6 2.6 2 3 4.5"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
 help:'<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.6M12 16.8v.2"/>',
 out:'<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h9"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
 bell:'<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5h4"/>',
 mail:'<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path d="m4.5 7 7.5 6 7.5-6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 arrow:'<path d="M8 16 16 8M9 8h7v7"/>',
 import:'<path d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3"/>',
 video:'<rect x="3.5" y="6.5" width="12" height="11" rx="3"/><path d="m15.5 10.5 5-3v9l-5-3"/>',
 pause:'<path d="M9 6v12M15 6v12"/>',play:'<path d="M8 5.5v13l10-6.5z"/>',stop:'<rect x="7" y="7" width="10" height="10" rx="2"/>',
 flag:'<path d="M6 21V4m0 0h10l-2 4 2 4H6"/>',clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',chat:'<path d="M5 18.5V7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v6a2.5 2.5 0 0 1-2.5 2.5H8z"/>',
 x:'<path d="m6 6 12 12M18 6 6 18"/>',pin:'<path d="M12 21s6-5.6 6-10.5a6 6 0 0 0-12 0C6 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2"/>',
 user:'<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',palette:'<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.6-.9 1.2-1.8-.5-1-.1-2.2 1.2-2.2H17a3.5 3.5 0 0 0 3.5-3.5c0-5.3-3.8-9.5-8.5-9.5z"/><circle cx="8" cy="11" r="1"/><circle cx="11" cy="7.5" r="1"/><circle cx="15.5" cy="8.5" r="1"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',moon:'<path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z"/>',
 logo:'<path d="M4 15.5 9 9l4 4.5L20 6"/><path d="M15 6h5v5"/>',phone:'<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 17.5h2"/>'
};
const ico=(n,s=18)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
function pico(p){const c=p.color;const o={bars:`<path d="M4 18 10 6M9 18l6-12M14 18l6-12" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`,ring:`<circle cx="12" cy="12" r="8" fill="${c}"/><circle cx="12" cy="12" r="4" fill="#fff" opacity=".85"/>`,plus:`<path d="M12 3v18M3 12h18" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`,half:`<path d="M3 15a9 9 0 0 1 18 0z" fill="${c}"/><rect x="3" y="16" width="18" height="3" rx="1.5" fill="${c}" opacity=".5"/>`,stack:`<rect x="4" y="4" width="16" height="5" rx="2.5" fill="${c}"/><rect x="4" y="10" width="16" height="5" rx="2.5" fill="${c}" opacity=".7"/><rect x="4" y="16" width="16" height="4" rx="2" fill="${c}" opacity=".4"/>`,dot:`<circle cx="12" cy="12" r="5" fill="${c}"/><circle cx="12" cy="12" r="9" fill="none" stroke="${c}" stroke-width="1.5" opacity=".5"/>`};return`<svg class="pico" viewBox="0 0 24 24" aria-hidden="true">${o[p.icon]}</svg>`;}

/* charts */
function niceMax(v){if(v<=0)return 4;const raw=v/4,p=Math.pow(10,Math.floor(Math.log10(raw))),n=raw/p;const opts=p>=10?[1,1.25,1.5,2,2.5,3,4,5,6,8,10]:[1,1.5,2,2.5,3,4,5,6,8,10];let st=opts.find(o=>o>=n-1e-9)*p;if(raw<1)st=Math.ceil(raw*2)/2||.5;return st*4;}
function smooth(pts){if(pts.length<2)return'';let d=`M${pts[0][0]} ${pts[0][1]}`;for(let i=0;i<pts.length-1;i++){const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2,t=.16;d+=` C${(p1[0]+(p2[0]-p0[0])*t).toFixed(1)} ${(p1[1]+(p2[1]-p0[1])*t).toFixed(1)} ${(p2[0]-(p3[0]-p1[0])*t).toFixed(1)} ${(p2[1]-(p3[1]-p1[1])*t).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;}return d;}
function lineChart(el,cfg){const W=Math.max(260,el.clientWidth),cmp=W<520,H=cmp?230:360,L0=cmp?30:40,R0=8,T0=14,B0=30,pw=W-L0-R0,ph=H-T0-B0,n=cfg.labels.length;
 const max=niceMax(Math.max(...cfg.series.flatMap(s=>s.data))*1.05);const X=i=>L0+i/(n-1)*pw,Y=v=>T0+ph-v/max*ph;
 let g='';for(let k=0;k<=4;k++){const v=max*k/4,y=Y(v);g+=`<line x1="${L0}" x2="${W-R0}" y1="${y}" y2="${y}" stroke="var(--line)" ${k?'stroke-dasharray="2 6"':''}/><text x="${L0-8}" y="${y+4}" text-anchor="end" font-size="11">${num(v)}</text>`;}
 const step=Math.ceil(n/(cmp?4:7));cfg.labels.forEach((l,i)=>{if(i%step===0)g+=`<text x="${X(i)}" y="${H-8}" text-anchor="middle" font-size="11">${esc(l)}</text>`;});
 let p='';cfg.series.forEach((s,si)=>{const pts=s.data.map((v,i)=>[X(i),Y(v)]),d=smooth(pts);if(s.area){p+=`<defs><linearGradient id="ar${si}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity=".28"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs><path d="${d} L${X(n-1)} ${Y(0)} L${X(0)} ${Y(0)}Z" fill="url(#ar${si})"/>`;}p+=`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.dash?1.8:2.6}" ${s.dash?'stroke-dasharray="4 5"':''} stroke-linecap="round"/>`;});
 el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cfg.aria)}">${g}${p}<line class="gl" y1="${T0}" y2="${T0+ph}" stroke="var(--muted)" stroke-dasharray="3 4" visibility="hidden"/><circle class="gd" r="5.5" fill="var(--surface)" stroke="${cfg.series[0].color}" stroke-width="3" visibility="hidden"/><rect class="hit" x="${L0}" y="${T0}" width="${pw}" height="${ph}" fill="transparent"/></svg><div class="tip"></div>`;
 const svg=$('svg',el),tip=$('.tip',el);
 $('.hit',el).addEventListener('pointermove',e=>{const r=svg.getBoundingClientRect(),x=(e.clientX-r.left)*(W/r.width);const i=Math.max(0,Math.min(n-1,Math.round((x-L0)/pw*(n-1))));const gx=X(i);$('.gl',el).setAttribute('x1',gx);$('.gl',el).setAttribute('x2',gx);$('.gl',el).setAttribute('visibility','visible');const gd=$('.gd',el);gd.setAttribute('cx',gx);gd.setAttribute('cy',Y(cfg.series[0].data[i]));gd.setAttribute('visibility','visible');
  tip.innerHTML=cfg.tip(i);tip.classList.add('on');const tw=tip.offsetWidth,sx=r.width/W;let left=gx*sx-tw/2;left=Math.max(0,Math.min(r.width-tw,left));tip.style.left=left+'px';tip.style.top=(Y(cfg.series[0].data[i])*sx-tip.offsetHeight-14)+'px';});
 $('.hit',el).addEventListener('pointerleave',()=>{tip.classList.remove('on');$('.gl',el).setAttribute('visibility','hidden');$('.gd',el).setAttribute('visibility','hidden');});}
function halfDonut(p,segments){const cx=130,cy=130,r=100,sw=34;const pol=a=>[cx+r*Math.cos(Math.PI*(1-a)),cy-r*Math.sin(Math.PI*(1-a))];
 const arc=(a0,a1)=>{const[x0,y0]=pol(a0),[x1,y1]=pol(a1);return`M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;};
 let s=`<defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="var(--surface)"/><line x1="0" y1="0" x2="0" y2="7" stroke="var(--line-2)" stroke-width="3"/></pattern></defs><path d="${arc(0.001,0.999)}" fill="none" stroke="url(#hatch)" stroke-width="${sw}"/>`;
 let a=0;segments.forEach(sg=>{const b=a+sg.v;if(sg.v>0.004)s+=`<path d="${arc(a+0.004,b-0.004)}" fill="none" stroke="${sg.c}" stroke-width="${sw}"/>`;a=b;});
 return`<svg viewBox="0 0 260 150" aria-hidden="true">${s}</svg>`;}
function donut(items){const tot=items.reduce((a,b)=>a+b.v,0)||1,r=70,c=2*Math.PI*r;let off=0;const segs=items.map(it=>{const len=it.v/tot*c;const s=`<circle cx="95" cy="95" r="${r}" fill="none" stroke="${it.c}" stroke-width="26" stroke-dasharray="${Math.max(0,len-3).toFixed(1)} ${c.toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" transform="rotate(-90 95 95)"/>`;off+=len;return s;}).join('');
 return`<svg viewBox="0 0 190 190" aria-hidden="true"><circle cx="95" cy="95" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="26"/>${segs}<text x="95" y="92" text-anchor="middle" font-size="26" font-weight="800" fill="var(--ink)">${num(tot)}${T('ч','h')}</text><text x="95" y="114" text-anchor="middle" font-size="11" fill="var(--muted)">${T('за период','this period')}</text></svg>`;}

/* ---------- pages ---------- */
const PAGES=[{id:'dashboard',icon:'grid',ru:'Дашборд',en:'Dashboard'},{id:'tasks',icon:'check',ru:'Задачи',en:'Tasks'},{id:'calendar',icon:'cal',ru:'Календарь',en:'Calendar'},{id:'analytics',icon:'chart',ru:'Аналитика',en:'Analytics'},{id:'team',icon:'team',ru:'Команда',en:'Team'}];
const jobs=[];
const openTasks=()=>D.tasks.filter(t=>t.status!=='done');
function dueLabel(t){const d=Math.round((t.due-TODAY)/DAY);if(t.status==='done')return dt(t.due);if(d<0)return`<span class="late">${T('просрочено','overdue')}</span>`;if(d===0)return T('сегодня','today');if(d===1)return T('завтра','tomorrow');return T(`через ${d} дн.`,`in ${d} days`);}
function pageDashboard(){
 const tot=D.projects.length+18,ended=10+D.projects.filter(p=>p.status==='done').length,running=D.projects.filter(p=>p.status==='running').length+7,pending=D.projects.filter(p=>p.status!=='running').length+1;
 const week=[...Array(7)].map((_,i)=>{const dow=(new Date(TODAY).getDay()+6)%7;const t=TODAY-(dow-i)*DAY;const h=D.history.find(x=>x.t===t);return{t,v:h?h.done:0,future:t>TODAY,today:t===TODAY};});
 const wmax=Math.max(1,...week.map(w=>w.v)),days=state.lang==='ru'?['Пн','Вт','Ср','Чт','Пт','Сб','Вс']:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
 const sel=state.capSel??week.findIndex(w=>w.today);
 const ev=D.events.find(e=>e.featured);
 const doneN=D.tasks.filter(t=>t.status==='done').length,revN=D.tasks.filter(t=>t.status==='review').length,progN=D.tasks.filter(t=>t.status==='progress').length,all=D.tasks.length;
 const pct=Math.round(doneN/all*100);
 const team=D.people.slice(0,5).map(p=>{const t=D.tasks.find(x=>x.assignees.includes(p.id)&&x.status!=='done')||D.tasks.find(x=>x.assignees.includes(p.id));return{p,t};});
 return`
 <div class="ph"><div><h1>${T('Дашборд','Dashboard')}</h1><p>${T('Всё, над чем работает команда, — в одном спокойном месте','Everything your team is shipping, in one calm place')}</p></div>
  <div class="acts"><button class="btn btn-p" data-act="newtask">${ico('plus',16)}${T('Новая задача','New task')}</button><button class="btn btn-hide-sm" data-act="toast" data-v="${T('Импорт данных доступен в полной версии','Data import is available in the full version')}">${ico('import',16)}${T('Импорт данных','Import data')}</button></div></div>
 <div class="g g4">
  ${stat(T('Всего проектов','Total projects'),tot,'+3',T('с прошлого месяца','since last month'),true)}
  ${stat(T('Завершены','Completed'),ended,'+2',T('с прошлого месяца','since last month'))}
  ${stat(T('В работе','In progress'),running,'+1',T('с прошлого месяца','since last month'))}
  ${stat(T('Ждут проверки','Awaiting review'),pending,'',T('нужна ваша оценка','need your sign-off'))}
 </div>
 <div class="g gdash mt">
  <section class="card has-caps"><div class="ch"><div><h2 class="ct">${T('Закрытые задачи за неделю','Tasks closed this week')}</h2><p class="cs">${T('Наведите на день — штриховкой показаны будущие дни','Hover a day — hatched days are still ahead')}</p></div></div>
   <div class="caps">${week.map((w,i)=>`<button class="cap" data-act="cap" data-v="${i}" aria-pressed="${i===sel}" aria-label="${days[i]}: ${w.future?T('ещё впереди','ahead'):w.v+' '+T('задач','tasks')}"><span class="bubble">${w.future?T('впереди','ahead'):w.v+' '+T('задач','tasks')}</span><span class="pill ${w.future?'off':''}" style="height:${w.future?62:Math.max(18,w.v/wmax*100)}%;${w.future?'':`background:${i===sel?'var(--bar-1)':w.v/wmax>.7?'var(--bar-2)':'var(--bar-3)'}`}"></span><span>${days[i]}</span></button>`).join('')}</div></section>
  <section class="card remind"><div class="ch"><h2 class="ct">${T('Напоминание','Reminder')}</h2></div>
   <h3>${esc(L(ev))}</h3><p>${T('Сегодня','Today')}, ${ev.start}:00 — ${ev.end}:00 · ${esc(L(prj[ev.project]))}</p>
   <div class="avs" style="justify-content:flex-start;margin:12px 0 0 7px">${ev.people.map(id=>av(ppl[id])).join('')}</div>
   <button class="btn btn-p" data-act="meet">${ico('video',16)}${T('Начать встречу','Start meeting')}</button></section>
  <section class="card"><div class="ch"><h2 class="ct">${T('Проекты','Projects')}</h2><button class="btn btn-sm" data-act="go" data-v="tasks">${ico('plus',14)}${T('Задача','Task')}</button></div>
   <div class="plist">${D.projects.slice(0,6).map(p=>`<button class="prow" data-act="proj" data-v="${p.id}">${pico(p)}<span><b>${esc(L(p))}</b><small>${T('Срок','Due')}: ${dt(p.due,{day:'numeric',month:'short',year:'numeric'})}</small></span></button>`).join('')}</div></section>
 </div>
 <div class="g gdash mt">
  <section class="card"><div class="ch"><div><h2 class="ct">${T('Команда','Team collaboration')}</h2><p class="cs">${T('Кто чем занят прямо сейчас','Who is working on what right now')}</p></div><button class="btn btn-sm" data-act="go" data-v="team">${ico('plus',14)}${T('Участник','Member')}</button></div>
   <div>${team.map(({p,t})=>`<div class="mrow">${av(p,'md',true)}<span><b>${esc(L(p))}</b><small>${T('Работает над','Working on')} <em>${esc(L(t))}</em></small></span><span class="pill-st st-${t.status}">${stLabel(t.status)}</span></div>`).join('')}</div></section>
  <section class="card"><div class="ch"><div><h2 class="ct">${T('Прогресс задач','Task progress')}</h2><p class="cs">${T('Все задачи текущего спринта','All tasks in the current sprint')}</p></div></div>
   <div class="half">${halfDonut(pct,[{v:doneN/all,c:'var(--bar-1)'},{v:revN/all,c:'var(--bar-2)'},{v:progN/all,c:'var(--bar-3)'}])}<div class="v"><b>${pct}%</b><small>${T('задач закрыто','tasks closed')}</small></div></div>
   <div class="half-legend"><span><i style="background:var(--bar-1)"></i>${T('Готово','Done')}</span><span><i style="background:var(--bar-2)"></i>${T('Проверка','Review')}</span><span><i style="background:var(--bar-3)"></i>${T('В работе','In progress')}</span><span><i style="background:repeating-linear-gradient(45deg,var(--line-2) 0 2px,transparent 2px 4px)"></i>${T('Не начаты','Not started')}</span></div></section>
  <section class="card timer ${state.timer.running?'':'paused'}"><div><h2 class="ct">${T('Учёт времени','Time tracker')}</h2><div class="now-task">${T('Сейчас','Now')}: ${esc(L(D.tasks[7]))}</div></div>
   <div class="clock" id="clock">${clockText()}</div>
   <div class="tbtns"><button class="pause" data-act="timer" aria-label="${state.timer.running?T('Пауза','Pause'):T('Продолжить','Resume')}">${ico(state.timer.running?'pause':'play')}</button><button class="stop" data-act="stoptimer" aria-label="${T('Остановить','Stop')}">${ico('stop')}</button></div></section>
 </div>`;}
function stat(label,n,chg,foot,hero){return`<section class="card stat ${hero?'hero':''}"><div class="lab">${label}<button class="arrow" data-act="go" data-v="analytics" aria-label="${T('Подробнее','Details')}">${ico('arrow',15)}</button></div><div class="num">${n}</div><div class="foot">${chg?`<span class="chg">${chg}</span>`:''}${foot}</div></section>`;}
function elapsed(){const t=state.timer;return Math.floor((t.acc+(t.running?Date.now()-t.start:0))/1000);}
function clockText(){const s=elapsed(),h=String(Math.floor(s/3600)).padStart(2,'0'),m=String(Math.floor(s%3600/60)).padStart(2,'0'),ss=String(s%60).padStart(2,'0');return`${h}<i>:</i>${m}<i>:</i>${ss}`;}

function pageTasks(){
 const filters=[['all',T('Все','All')],['mine',T('Мои задачи','My tasks')],['high',T('Высокий приоритет','High priority')],['week',T('На этой неделе','Due this week')]];
 const q=state.q.toLowerCase();
 const list=D.tasks.filter(t=>(state.filter==='all'||(state.filter==='mine'&&t.assignees.includes(ME))||(state.filter==='high'&&t.prio==='high')||(state.filter==='week'&&t.due>=TODAY&&t.due<=TODAY+7*DAY&&t.status!=='done'))&&(!q||(L(t)+' '+L(prj[t.project])).toLowerCase().includes(q)));
 return`
 <div class="ph"><div><h1>${T('Задачи','Tasks')}</h1><p>${T('Перетащите карточку в другую колонку или смените статус через меню «⋯»','Drag a card to another stage, or use its ⋯ menu to move it')}</p></div><div class="acts"><button class="btn btn-p" data-act="newtask">${ico('plus',16)}${T('Новая задача','New task')}</button></div></div>
 <div class="acts" style="justify-content:space-between;margin-bottom:14px"><div class="tabs">${filters.map(([v,l])=>`<button data-act="filter" data-v="${v}" aria-pressed="${state.filter===v}">${l}</button>`).join('')}</div><span class="hint">${T('Показано задач','Showing')}: <b>${list.length}</b></span></div>
 <div class="board">${STAGES.map(st=>{const items=list.filter(t=>t.status===st.id);return`<section class="col" data-stage="${st.id}" aria-label="${esc(L(st))}"><div class="col-h"><i style="background:${st.c}"></i>${esc(L(st))}<span>${items.length}</span></div>
  ${items.map(taskCard).join('')||`<div class="empty-col">${T('Перетащите сюда задачу','Drop a task here')}</div>`}</section>`;}).join('')}</div>`;}
function taskCard(t){const tg=tagBy[t.tag];return`<article class="task" draggable="true" data-task="${t.id}">
 <div class="tk-top"><span class="tag" style="background:color-mix(in srgb,${tg.c} 14%,transparent);color:${tg.c}">${esc(L(tg))}</span><span class="prio ${t.prio}">${ico('flag',12)}${{high:T('Высокий','High'),medium:T('Средний','Medium'),low:T('Низкий','Low')}[t.prio]}</span>
 <label class="tk-menu"><span aria-hidden="true">⋯</span><select data-move="${t.id}" aria-label="${T('Переместить задачу','Move task')}">${STAGES.map(s=>`<option value="${s.id}" ${s.id===t.status?'selected':''}>${esc(L(s))}</option>`).join('')}</select></label></div>
 <p class="tk-title">${esc(L(t))}</p><p class="tk-proj">${esc(L(prj[t.project]))}</p>
 ${t.status!=='todo'?`<div class="bar"><i style="width:${t.progress}%;${t.status==='done'?'background:var(--ok)':''}"></i></div>`:''}
 <div class="tk-foot"><span>${ico('clock',13)}${dueLabel(t)}</span><span>${ico('chat',13)}${t.comments}</span><span class="avs">${t.assignees.map(id=>av(ppl[id])).join('')}</span></div></article>`;}

function pageTeam(){
 const tabs=[['all',T('Все','All')]].concat(D.depts.map(d=>[d.id,L(d)]));
 const list=D.people.filter(p=>state.dept==='all'||p.dept===state.dept);
 return`
 <div class="ph"><div><h1>${T('Команда','Team')}</h1><p>${T('Все сотрудники: чем заняты, сколько сделали и насколько загружены','Everyone on the workspace: what they carry and how busy they are')}</p></div><div class="acts"><button class="btn btn-p" data-act="toast" data-v="${T('Приглашение отправлено (демо)','Invite sent (demo)')}">${ico('plus',16)}${T('Пригласить','Invite')}</button></div></div>
 <div class="tabs" style="margin-bottom:16px;overflow-x:auto;max-width:100%">${tabs.map(([v,l])=>`<button data-act="dept" data-v="${v}" aria-pressed="${state.dept===v}">${esc(l)}</button>`).join('')}</div>
 <div class="people">${list.map(p=>{const s=personStats(p.id);return`<section class="card person">${av(p,'lg',true)}<b>${esc(L(p))}</b><small>${esc(L(p.role))}</small><span class="tag" style="background:var(--a-100);color:var(--a-700)">${esc(L(dep[p.dept]))}</span>
  <div class="pstats"><div><b>${s.open}</b><small>${T('открыто','open')}</small></div><div><b>${s.done}</b><small>${T('сделано','done')}</small></div></div>
  <div class="wl"><span>${T('Загрузка','Workload')}</span><b>${s.load}%</b></div><div class="bar"><i style="width:${s.load}%;background:${s.load>85?'var(--danger)':s.load>65?'var(--bar-2)':'var(--bar-3)'}"></i></div>
  <div class="pbtns"><button class="btn" data-act="toast" data-v="${T('Чат откроется в полной версии','Chat opens in the full version')}">${T('Написать','Message')}</button><button class="btn btn-p" data-act="person" data-v="${p.id}">${T('Профиль','Profile')}</button></div></section>`;}).join('')}</div>`;}
function personStats(id){const open=D.tasks.filter(t=>t.assignees.includes(id)&&t.status!=='done').length;const h=id.charCodeAt(id.length-1);return{open,done:18+((h*7)%30),load:Math.min(96,38+open*14+(h%5)*4),hours:D.timeLog[id]};}
function drawer(){const p=ppl[state.person];if(!p)return'';const s=personStats(p.id),ts=D.tasks.filter(t=>t.assignees.includes(p.id));
 return`<div class="drawer-bg" data-act="closeperson"></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="${esc(L(p))}"><button class="ibtn x" data-act="closeperson" aria-label="${T('Закрыть','Close')}">${ico('x')}</button>
 <div class="dr-head">${av(p,'xl')}<b>${esc(L(p))}</b><small style="color:var(--muted)">${esc(L(p.role))}</small><div class="dr-meta"><span>${ico('pin',13)} ${esc(L(p.city))}</span><span>${esc(L(dep[p.dept]))}</span><span style="color:${stColor[p.status]}">● ${{online:T('В сети','Online'),away:T('Отошёл','Away'),offline:T('Не в сети','Offline')}[p.status]}</span></div></div>
 <div class="dr-stats"><div><b>${s.open}</b><small>${T('Открыто','Open')}</small></div><div><b>${s.done}</b><small>${T('Сделано','Done')}</small></div><div><b>${s.load}%</b><small>${T('Загрузка','Load')}</small></div></div>
 <h4 style="margin:0;font-size:13.5px">${T('Назначенные задачи','Assigned tasks')}</h4>
 <div class="dr-tasks">${ts.map(t=>`<div><i style="background:${STAGES.find(x=>x.id===t.status).c}"></i><span>${esc(L(t))}</span><small>${stLabel(t.status)}</small></div>`).join('')||`<div><span style="color:var(--muted)">${T('Пока нет задач','No tasks yet')}</span></div>`}</div>
 <div class="pbtns"><button class="btn" data-act="toast" data-v="${T('Чат откроется в полной версии','Chat opens in the full version')}">${T('Написать','Message')}</button><button class="btn btn-p" data-act="newtask" data-v="${p.id}">${ico('plus',15)}${T('Назначить','Assign task')}</button></div></aside>`;}

function pageCalendar(){
 const base=new Date(state.calMonth??TODAY);base.setDate(1);const y=base.getFullYear(),m=base.getMonth();
 const startOff=state.weekStart==='mon'?(base.getDay()+6)%7:base.getDay();const first=new Date(y,m,1-startOff).getTime();
 const cells=[...Array(42)].map((_,i)=>{const d=new Date(first);d.setDate(d.getDate()+i);return d.getTime();});
 const kindColor={mgmt:'var(--a-700)',sales:'#1d9a8a',design:'#d0457a',dev:'#2f5cd0',marketing:'#d48a1c'};
 const evOn=t=>D.events.filter(e=>e.t===t).sort((a,b)=>a.start-b.start);
 const daysH=state.lang==='ru'?['Пн','Вт','Ср','Чт','Пт','Сб','Вс']:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];const hdr=state.weekStart==='mon'?daysH:[daysH[6],...daysH.slice(0,6)];
 const sel=evOn(state.calDay);const upcoming=D.events.filter(e=>e.t>state.calDay).sort((a,b)=>a.t-b.t||a.start-b.start).slice(0,4);
 const evHtml=e=>`<div class="ev"><i style="background:${kindColor[e.kind]}"></i><div><b>${esc(L(e))}</b><small>${e.start}:00 — ${e.end}:00 · ${esc(L(prj[e.project]))}</small><div class="avs" style="justify-content:flex-start">${e.people.map(id=>av(ppl[id])).join('')}</div></div></div>`;
 return`
 <div class="ph"><div><h1>${T('Календарь','Calendar')}</h1><p>${T('Встречи, созвоны и релизы команды','Meetings, calls and releases')}</p></div><div class="acts"><button class="btn" data-act="cal" data-v="-1" aria-label="${T('Предыдущий месяц','Previous month')}">‹</button><button class="btn" data-act="cal" data-v="0">${T('Сегодня','Today')}</button><button class="btn" data-act="cal" data-v="1" aria-label="${T('Следующий месяц','Next month')}">›</button></div></div>
 <div class="g g21"><section class="card"><div class="ch"><h2 class="ct">${(m=>m.charAt(0).toUpperCase()+m.slice(1))(base.toLocaleDateString(loc(),{month:'long',year:'numeric'}))}</h2></div>
  <div class="cal">${hdr.map(d=>`<span class="dh">${d}</span>`).join('')}${cells.map(t=>{const d=new Date(t),es=evOn(t);return`<button data-act="day" data-v="${t}" class="${d.getMonth()!==m?'out':''} ${t===TODAY?'today':''}" aria-pressed="${t===state.calDay}" aria-label="${dt(t,{day:'numeric',month:'long'})}: ${es.length} ${T('событий','events')}">${d.getDate()}<span class="dots">${es.slice(0,3).map(e=>`<i style="background:${t===state.calDay?'#fff':kindColor[e.kind]}"></i>`).join('')}</span></button>`;}).join('')}</div></section>
  <div class="stack" style="display:flex;flex-direction:column;gap:16px"><section class="card"><div class="ch"><h2 class="ct">${dt(state.calDay,{weekday:'long',day:'numeric',month:'long'})}</h2><button class="btn btn-sm" data-act="toast" data-v="${T('Событие добавлено (демо)','Event added (demo)')}">${ico('plus',14)}${T('Событие','Event')}</button></div>
   <div class="agenda">${sel.map(evHtml).join('')||`<p class="cs">${T('В этот день встреч нет — хорошее время для глубокой работы.','No meetings this day — good time for focused work.')}</p>`}</div></section>
   <section class="card"><div class="ch"><h2 class="ct">${T('Дальше по плану','Coming up')}</h2></div><div class="agenda">${upcoming.map(e=>`<div class="ev"><i style="background:${kindColor[e.kind]}"></i><div><b>${esc(L(e))}</b><small>${dt(e.t,{weekday:'short',day:'numeric',month:'short'})}, ${e.start}:00</small></div></div>`).join('')}</div></section></div></div>`;}

function pageAnalytics(){
 const n=state.anPeriod,cur=D.history.slice(-n),prev=D.history.slice(-2*n,-n);
 const sum=(a,f)=>a.reduce((s,x)=>s+f(x),0);
 const done=sum(cur,h=>h.done),doneP=sum(prev,h=>h.done),hours=sum(cur,h=>h.hours),hoursP=sum(prev,h=>h.hours);
 const ontime=sum(cur,h=>h.ontime)/cur.length*100,ontimeP=sum(prev,h=>h.ontime)/(prev.length||1)*100;const cycle=Math.max(1.4,3.6-done/(n*7)),cycleP=Math.max(1.4,3.6-doneP/(n*7));
 const chg=(a,b,inv)=>{const d=(a-b)/(b||1)*100;const good=inv?d<=0:d>=0;return`<span class="chg ${good?'':'neg'}">${d>=0?'+':'−'}${num(Math.abs(d))}%</span>`;};
 const roll=a=>a.map((_,i)=>{const w=a.slice(Math.max(0,i-6),i+1);return w.reduce((s,x)=>s+x.done,0)/w.length;});
 const cr=roll(D.history.slice(-n-6)).slice(6),pr=roll(D.history.slice(-2*n-6,-n)).slice(6);
 jobs.push(()=>{const el=$('#thru');if(!el)return;lineChart(el,{labels:cur.map(h=>dt(h.t)),aria:T('Закрытые задачи в день','Tasks closed per day'),series:[{data:cr,color:'var(--bar-2)',area:true},{data:pr,color:'var(--muted)',dash:true}],
  tip:i=>`<small>${dt(cur[i].t,{weekday:'short',day:'numeric',month:'short'})}</small><b>${cur[i].done} ${T('задач','tasks')}</b><small>${T('среднее за 7 дн.','7-day avg')} ${num(cr[i])} · ${T('прошлый период','prev.')} ${num(pr[i]||0)}</small>`});});
 const ph=D.projects.map(p=>({p,v:Math.round(D.projectHours[p.id]*n/30)})).sort((a,b)=>b.v-a.v);
 const loads=D.people.map(p=>({p,s:personStats(p.id)})).sort((a,b)=>b.s.load-a.s.load);
 return`
 <div class="ph"><div><h1>${T('Аналитика','Analytics')}</h1><p>${T('Скорость команды, время по проектам и загрузка людей','Team throughput, time by project and workload')}</p></div><div class="acts"><div class="tabs">${[7,30,90].map(d=>`<button data-act="anp" data-v="${d}" aria-pressed="${n===d}">${d} ${T('дней','days')}</button>`).join('')}</div><button class="btn" data-act="csv">${ico('import',16)}CSV</button></div></div>
 <div class="g g4">
  ${aStat(T('Закрыто задач','Tasks closed'),num(done),chg(done,doneP))}${aStat(T('Часов отработано','Hours logged'),num(Math.round(hours)),chg(hours,hoursP))}${aStat(T('Сдано в срок','On time'),num(Math.round(ontime))+'%',chg(ontime,ontimeP))}${aStat(T('Средний цикл задачи','Avg cycle time'),num(Math.round(cycle*10)/10)+' '+T('дн.','d'),chg(cycle,cycleP,true))}
 </div>
 <div class="g g21 mt"><section class="card"><div class="ch"><div><h2 class="ct">${T('Скорость команды','Throughput')}</h2><p class="cs">${T('Закрытые задачи в день, среднее за 7 дней, в сравнении с прошлым периодом','Tasks closed per day, 7-day average, vs the previous period')}</p></div><div class="legend"><span><i style="background:var(--bar-2)"></i>${T('Этот период','This period')}</span><span><i class="dash"></i>${T('Прошлый','Previous')}</span></div></div><div class="chart" id="thru"></div></section>
  <section class="card"><div class="ch"><div><h2 class="ct">${T('Время по проектам','Time by project')}</h2><p class="cs">${T('Где команда проводит часы','Where the hours go')}</p></div></div><div class="donut-wrap">${donut(ph.map(x=>({v:x.v,c:x.p.color})))}<div class="dl">${ph.map(x=>`<div><i style="background:${x.p.color}"></i><span>${esc(L(x.p))}</span><b>${num(x.v)} ${T('ч','h')}</b></div>`).join('')}</div></div></section></div>
 <section class="card mt"><div class="ch"><div><h2 class="ct">${T('Загрузка сотрудников','Team workload')}</h2><p class="cs">${T('Выше 85% — риск выгорания и сорванных сроков','Above 85% — risk of burnout and missed deadlines')}</p></div></div>
  ${loads.map(({p,s})=>`<div class="hbar"><span>${av(p)}${esc(L(p).split(' ')[0])}</span><span class="t"><i style="width:${s.load}%;background:${s.load>85?'var(--danger)':s.load>65?'var(--bar-2)':'var(--bar-3)'}"></i></span><b>${s.load}%</b></div>`).join('')}</section>`;}
function aStat(l,v,c){return`<section class="card stat"><div class="lab">${l}</div><div class="num" style="font-size:32px">${v}</div><div class="foot">${c}${T('к прошлому периоду','vs previous period')}</div></section>`;}

function pageSettings(){const p=ppl[ME];const tabs=[['profile','user',T('Профиль','Profile')],['notif','bell',T('Уведомления','Notifications')],['look','palette',T('Оформление','Appearance')]];
 let body='';
 if(state.setTab==='profile')body=`<div class="ch"><div style="display:flex;gap:14px;align-items:center">${av(p,'lg')}<div><h2 class="ct">${T('Профиль','Profile')}</h2><p class="cs">${T('Так вас видят коллеги в рабочем пространстве','How teammates see you across the workspace')}</p></div></div></div>
  <form class="form" id="profForm"><label>${T('Имя и фамилия','Full name')}<input value="${esc(L(p))}"></label><label>Email<input value="irina@ritm.demo"></label><label>${T('Роль','Role')}<input value="${esc(L(p.role))}"></label><label>${T('Часовой пояс','Time zone')}<select><option>GMT+3 · ${T('Москва','Moscow')}</option><option>GMT+5 · ${T('Екатеринбург','Yekaterinburg')}</option><option>GMT+7 · ${T('Новосибирск','Novosibirsk')}</option></select></label><label class="full">${T('О себе','Bio')}<textarea>${T('Делаем понятный софт вместе с доброй командой.','Shipping calm software with a kind team.')}</textarea></label></form>
  <div class="form-end"><button class="btn" data-act="toast" data-v="${T('Изменения отменены','Changes discarded')}">${T('Отменить','Discard')}</button><button class="btn btn-p" data-act="toast" data-v="${T('Профиль сохранён','Profile saved')}">${T('Сохранить','Save changes')}</button></div>`;
 else if(state.setTab==='notif'){const rows=[['tasks',T('Новые задачи','New tasks'),T('Когда вам назначают задачу','When a task is assigned to you')],['mentions',T('Упоминания','Mentions'),T('Когда вас отмечают в комментариях','When someone mentions you')],['deadlines',T('Сроки','Deadlines'),T('За день до срока задачи','A day before a task is due')],['digest',T('Еженедельная сводка','Weekly digest'),T('Итоги недели на почту по пятницам','Weekly summary by email on Fridays')]];
  body=`<div class="ch"><div><h2 class="ct">${T('Уведомления','Notifications')}</h2><p class="cs">${T('Выберите, о чём сообщать','Choose what to hear about')}</p></div></div>${rows.map(([k,a,b])=>`<div class="trow"><span><b>${a}</b><small>${b}</small></span><button class="tg" data-act="notif" data-v="${k}" aria-pressed="${!!state.notif[k]}" aria-label="${a}"></button></div>`).join('')}`;}
 else body=`<div class="ch"><div><h2 class="ct">${T('Оформление','Appearance')}</h2><p class="cs">${T('Акцент перекрашивает всё пространство и запоминается на этом устройстве','The accent recolours the whole workspace and is remembered on this device')}</p></div></div>
  <h4 style="margin:4px 0 10px;font-size:13px">${T('Акцентный цвет','Accent')}</h4><div class="swatches">${[['forest','#1c5e45',T('Лес','Forest')],['ocean','#1c3a8c',T('Океан','Ocean')],['plum','#55257a',T('Слива','Plum')],['ember','#8a3414',T('Янтарь','Ember')]].map(([k,c,l])=>`<button class="sw" data-act="accent" data-v="${k}" aria-pressed="${state.accent===k}"><i style="background:${c}"></i>${l}</button>`).join('')}</div>
  <h4 style="margin:20px 0 10px;font-size:13px">${T('Тема','Theme')}</h4><div class="tabs"><button data-act="theme" data-v="light" aria-pressed="${state.theme==='light'}">${T('Светлая','Light')}</button><button data-act="theme" data-v="dark" aria-pressed="${state.theme==='dark'}">${T('Тёмная','Dark')}</button></div>
  <h4 style="margin:20px 0 10px;font-size:13px">${T('Неделя начинается с','Week starts on')}</h4><div class="tabs"><button data-act="week" data-v="sun" aria-pressed="${state.weekStart==='sun'}">${T('Воскресенья','Sunday')}</button><button data-act="week" data-v="mon" aria-pressed="${state.weekStart==='mon'}">${T('Понедельника','Monday')}</button></div>`;
 return`<div class="ph"><div><h1>${T('Настройки','Settings')}</h1><p>${T('Профиль, уведомления и внешний вид','Your profile, notifications and how Ritm looks')}</p></div></div>
 <div class="set"><nav class="card set-nav">${tabs.map(([k,i,l])=>`<button data-act="settab" data-v="${k}" aria-pressed="${state.setTab===k}">${ico(i,16)}${l}</button>`).join('')}</nav><section class="card">${body}</section></div>`;}

function modalTask(pre){return`<div class="overlay" data-act="closemodal"><div class="modal" role="dialog" aria-modal="true"><h3>${T('Новая задача','New task')}</h3>
 <form class="form" id="taskForm"><label class="full">${T('Название','Title')}<input name="title" required maxlength="80" placeholder="${T('Например, подготовить отчёт для клиента','e.g. Prepare the client report')}"></label>
 <label>${T('Проект','Project')}<select name="project">${D.projects.map(p=>`<option value="${p.id}">${esc(L(p))}</option>`).join('')}</select></label>
 <label>${T('Исполнитель','Assignee')}<select name="who">${D.people.map(p=>`<option value="${p.id}" ${p.id===pre?'selected':''}>${esc(L(p))}</option>`).join('')}</select></label>
 <label>${T('Направление','Area')}<select name="tag">${D.tags.map(t=>`<option value="${t.id}">${esc(L(t))}</option>`).join('')}</select></label>
 <label>${T('Приоритет','Priority')}<select name="prio"><option value="high">${T('Высокий','High')}</option><option value="medium" selected>${T('Средний','Medium')}</option><option value="low">${T('Низкий','Low')}</option></select></label>
 <label class="full">${T('Срок, дней','Due in, days')}<input name="due" type="number" min="0" max="90" value="5"></label></form>
 <p class="cs" style="margin-top:10px">${T('Демо: задача сохранится только в этом браузере.','Demo: the task is stored in this browser only.')}</p>
 <div class="form-end"><button class="btn" data-act="closemodal">${T('Отмена','Cancel')}</button><button class="btn btn-p" form="taskForm" type="submit">${T('Создать задачу','Create task')}</button></div></div></div>`;}

/* ---------- shell ---------- */
function render(){
 jobs.length=0;document.documentElement.lang=state.lang;document.body.classList.toggle('dark',state.theme==='dark');document.body.dataset.accent=state.accent;
 const pg={dashboard:pageDashboard,tasks:pageTasks,calendar:pageCalendar,analytics:pageAnalytics,team:pageTeam,settings:pageSettings}[state.page]();
 const navBtn=p=>`<button data-act="go" data-v="${p.id}" ${state.page===p.id?'aria-current="page"':''} title="${esc(L(p))}">${ico(p.icon)}<span class="lbl">${esc(L(p))}</span>${p.id==='tasks'?`<span class="count">${openTasks().length}</span>`:''}</button>`;
 const me=ppl[ME];
 $('#app').innerHTML=`<div class="app">
 <aside class="side"><div class="logo"><span>${ico('logo')}</span><b>Ritm</b></div>
  <h6>${T('Меню','Menu')}</h6><nav class="nav">${PAGES.map(navBtn).join('')}</nav>
  <h6>${T('Общее','General')}</h6><nav class="nav">${navBtn({id:'settings',icon:'gear',ru:'Настройки',en:'Settings'})}<button data-act="toast" data-v="${T('Справка откроется в полной версии','Help opens in the full version')}">${ico('help')}<span class="lbl">${T('Помощь','Help')}</span></button><button data-act="toast" data-v="${T('Это демо — выйти нельзя 🙂','This is a demo — nowhere to log out to')}">${ico('out')}<span class="lbl">${T('Выйти','Log out')}</span></button></nav>
  <div class="promo"><span style="position:relative;z-index:1">${ico('phone',20)}</span><b style="position:relative;z-index:1">${T('Ritm для iOS и Android','Ritm for iOS & Android')}</b><small style="position:relative;z-index:1">${T('Задачи всегда под рукой','Your board, in your pocket')}</small><button class="pbtn" data-act="toast" data-v="${T('Приложение — часть демо','The app is part of the demo')}">${T('Скачать','Download')}</button></div></aside>
 <main class="main"><div class="top"><span class="logo-m"><span>${ico('logo',16)}</span>Ritm</span>
  <label class="search">${ico('search')}<input id="q" value="${esc(state.q)}" placeholder="${T('Поиск задач и людей','Search tasks & people')}" aria-label="${T('Поиск задач и людей','Search tasks & people')}"><kbd>⌘K</kbd></label>
  <div class="top-r"><button class="ibtn" data-act="lang" aria-label="${T('Switch to English','Переключить на русский')}">${state.lang==='ru'?'EN':'RU'}</button><button class="ibtn" data-act="theme" data-v="${state.theme==='dark'?'light':'dark'}" aria-label="${T('Сменить тему','Toggle theme')}">${ico(state.theme==='dark'?'sun':'moon')}</button><button class="ibtn" data-act="toast" data-v="${T('3 новых сообщения от команды','3 new messages from the team')}" aria-label="${T('Сообщения','Messages')}">${ico('mail')}<span class="dot"></span></button><button class="ibtn" data-act="go" data-v="tasks" aria-label="${T('Уведомления','Notifications')}">${ico('bell')}<span class="dot"></span></button>
  <span class="me">${av(me,'md')}<span class="mtext"><b>${esc(L(me))}</b><small>${esc(L(me.role))}</small></span></span></div></div>
  <nav class="mtabs" aria-label="${T('Разделы','Sections')}">${PAGES.concat([{id:'settings',ru:'Настройки',en:'Settings'}]).map(p=>`<button data-act="go" data-v="${p.id}" ${state.page===p.id?'aria-current="page"':''}>${esc(L(p))}</button>`).join('')}</nav>
  ${pg}<p class="foot">${T('Демонстрационный дашборд LeoAnalyst. Компания, люди и проекты вымышлены','LeoAnalyst demo dashboard. The company, people and projects are fictional')}</p></main></div>
 ${state.person?drawer():''}${state.modal==='task'?modalTask(state.modalPre):''}`;
 jobs.forEach(f=>{try{f()}catch(e){console.error(e)}});bindDnD();
 const tf=$('#taskForm');if(tf){setTimeout(()=>$('input[name=title]',tf).focus(),30);tf.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(tf);const t={id:'c'+Date.now(),ru:String(f.get('title')),en:String(f.get('title')),tag:f.get('tag'),prio:f.get('prio'),status:'todo',due:TODAY+(+f.get('due')||0)*DAY,project:f.get('project'),assignees:[f.get('who')],progress:0,comments:0,custom:true};D.tasks.unshift(t);saveTasks();state.modal=null;state.person=null;state.page='tasks';state.filter='all';render();toast(T('Задача создана','Task created'));});}
 const q=$('#q');q.addEventListener('keydown',e=>{if(e.key==='Enter'){state.q=q.value.trim();const hitP=D.people.find(p=>L(p).toLowerCase().includes(state.q.toLowerCase()));if(hitP&&state.q){state.page='team';state.person=hitP.id;state.q='';}else state.page='tasks';render();}});
}
function bindDnD(){$$('.task[draggable]').forEach(c=>{c.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',c.dataset.task);c.classList.add('drag');});c.addEventListener('dragend',()=>c.classList.remove('drag'));});
 $$('.col').forEach(col=>{col.addEventListener('dragover',e=>{e.preventDefault();col.classList.add('over');});col.addEventListener('dragleave',()=>col.classList.remove('over'));col.addEventListener('drop',e=>{e.preventDefault();col.classList.remove('over');moveTask(e.dataTransfer.getData('text/plain'),col.dataset.stage);});});}
function moveTask(id,stage){const t=D.tasks.find(x=>x.id===id);if(!t||t.status===stage)return;t.status=stage;t.progress=stage==='done'?100:stage==='review'?Math.max(t.progress,85):stage==='progress'?Math.max(t.progress,20):0;saveTasks();render();toast(T(`Перенесено: ${stLabel(stage)}`,`Moved to ${stLabel(stage)}`));}
function toast(m){$$('.toast').forEach(x=>x.remove());const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200);}
function csv(){const rows=[['date','tasks_closed','hours_logged','on_time_share']].concat(D.history.slice(-state.anPeriod).map(h=>[new Date(h.t).toISOString().slice(0,10),h.done,h.hours,h.ontime.toFixed(2)]));const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+rows.map(r=>r.join(',')).join('\n')],{type:'text/csv'}));a.download='ritm-analytics.csv';a.click();}

document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el)return;const a=el.dataset.act,v=el.dataset.v;
 if(a==='closemodal'&&el.classList.contains('overlay')&&e.target!==el)return;
 switch(a){
 case'go':state.page=v;state.person=null;window.scrollTo(0,0);break;
 case'lang':state.lang=state.lang==='ru'?'en':'ru';store.set('lang',state.lang);break;
 case'theme':state.theme=v;store.set('theme',v);break;
 case'accent':state.accent=v;store.set('accent',v);break;
 case'week':state.weekStart=v;store.set('week',v);break;
 case'toast':toast(v);return;
 case'cap':state.capSel=+v;break;
 case'meet':toast(T('Встреча началась — демо без видео','Meeting started — demo without video'));return;
 case'proj':state.page='tasks';state.q=L(prj[v]);break;
 case'timer':{const t=state.timer;if(t.running){t.acc+=Date.now()-t.start;t.running=false;}else{t.start=Date.now();t.running=true;}break;}
 case'stoptimer':{const s=elapsed();state.timer={running:false,start:Date.now(),acc:0};toast(T(`Записано ${Math.floor(s/3600)} ч ${Math.floor(s%3600/60)} мин`,`Logged ${Math.floor(s/3600)}h ${Math.floor(s%3600/60)}m`));break;}
 case'filter':state.filter=v;break;
 case'dept':state.dept=v;break;
 case'person':state.person=v;break;
 case'closeperson':state.person=null;break;
 case'newtask':state.modal='task';state.modalPre=v||ME;break;
 case'closemodal':state.modal=null;break;
 case'cal':if(+v===0){state.calMonth=null;state.calDay=TODAY;}else{const d=new Date(state.calMonth??TODAY);d.setDate(1);d.setMonth(d.getMonth()+(+v));state.calMonth=d.getTime();}break;
 case'day':state.calDay=+v;break;
 case'anp':state.anPeriod=+v;break;
 case'csv':csv();return;
 case'settab':state.setTab=v;break;
 case'notif':state.notif[v]=!state.notif[v];store.set('notif',state.notif);break;
 default:return;}
 render();});
document.addEventListener('change',e=>{if(e.target.matches('select[data-move]'))moveTask(e.target.dataset.move,e.target.value);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(state.modal||state.person)){state.modal=null;state.person=null;render();}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){const q=$('#q');if(q&&q.offsetParent){e.preventDefault();q.focus();}}});
setInterval(()=>{const c=$('#clock');if(c&&state.timer.running)c.innerHTML=clockText();},1000);
let lw=innerWidth;addEventListener('resize',()=>{clearTimeout(window.__rz);window.__rz=setTimeout(()=>{if(Math.abs(innerWidth-lw)>8){lw=innerWidth;jobs.length&&render();}},160);});
render();
})();
