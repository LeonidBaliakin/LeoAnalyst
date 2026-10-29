/* Mira · beauty studio - LeoAnalyst interactive demo. All data is synthetic. */
(function(){
'use strict';
const D=window.BEAUTY_DATA,DAY=D.DAY,TODAY=D.today;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{const v=localStorage.getItem('mira_'+k);return v==null?d:JSON.parse(v)}catch(_){return d}},set(k,v){try{localStorage.setItem('mira_'+k,JSON.stringify(v))}catch(_){}}};
const state={
  lang:store.get('lang','ru'),cur:store.get('cur','RUB'),theme:store.get('theme','light'),
  page:'overview',period:30,category:'all',lowOnly:false,search:'',sort:'popular',
  status:'all',journalLimit:12,master:null,channels:Object.fromEntries(D.channels.map(c=>[c.id,true])),
  metric:'revenue',group:'day',compare:true,repChannel:'all',barMode:'month',popover:false,modal:null
};
const extra=store.get('extra',[]);
const T=(ru,en)=>state.lang==='ru'?ru:en;
const L=o=>o?(state.lang==='ru'?o.ru:o.en):'';
const svcById=Object.fromEntries(D.services.map(s=>[s.id,s])),mstById=Object.fromEntries(D.masters.map(m=>[m.id,m])),cliById=Object.fromEntries(D.clients.map(c=>[c.id,c])),catById=Object.fromEntries(D.categories.map(c=>[c.id,c])),chById=Object.fromEntries(D.channels.map(c=>[c.id,c])),distById=Object.fromEntries(D.districts.map(d=>[d.id,d]));
const catColor={hair:'#9a6cc4',nails:'#d9667f',face:'#e88a62',brows:'#c79a3e',body:'#5f9e9a'};
const catSoft={hair:'var(--fern-soft)',nails:'var(--rose-soft)',face:'var(--peach-soft)',brows:'#f8eedb',body:'#e2f1ef'};

/* ---------- data helpers ---------- */
function all(){return D.bookings.concat(extra)}
let firstVisit=null;
function computeFirst(){firstVisit={};for(const b of all()){if(b.status==='cancelled')continue;const f=firstVisit[b.client];if(f===undefined||b.t<f)firstVisit[b.client]=b.t;}}
computeFirst();
const isNew=b=>firstVisit[b.client]===b.t;
function range(days,shift=0){const to=TODAY-shift*days*DAY,from=to-(days-1)*DAY;return[from,to];}
const inR=(b,[f,t])=>b.t>=f&&b.t<=t;
const done=b=>b.status==='done';
const sum=(a,f)=>a.reduce((s,x)=>s+f(x),0);
function money(v,short){const usd=state.cur==='USD';const x=usd?v/D.usdRate:v;const loc=state.lang==='ru'?'ru-RU':'en-US';
  if(short&&Math.abs(x)>=1e6)return(usd?'$':'')+new Intl.NumberFormat(loc,{maximumFractionDigits:1}).format(x/1e6)+(state.lang==='ru'?' млн':'M')+(usd?'':' ₽');
  if(short&&Math.abs(x)>=1e4)return(usd?'$':'')+new Intl.NumberFormat(loc,{maximumFractionDigits:0}).format(x/1e3)+(state.lang==='ru'?' тыс.':'K')+(usd?'':' ₽');
  return usd?'$'+new Intl.NumberFormat(loc,{maximumFractionDigits:0}).format(x):new Intl.NumberFormat(loc,{maximumFractionDigits:0}).format(x)+' ₽';}
const num=v=>new Intl.NumberFormat(state.lang==='ru'?'ru-RU':'en-US',{maximumFractionDigits:0}).format(v);
const pct=(v,d=0)=>new Intl.NumberFormat(state.lang==='ru'?'ru-RU':'en-US',{maximumFractionDigits:d,minimumFractionDigits:d}).format(v)+'%';
const dt=(t,o)=>new Date(t).toLocaleDateString(state.lang==='ru'?'ru-RU':'en-GB',o||{day:'numeric',month:'short'});
const hm=b=>String(b.hour).padStart(2,'0')+':'+String(b.minute).padStart(2,'0');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function delta(now,prev,inverse){if(!prev)return'';const d=(now-prev)/prev*100;const up=d>=0;const good=inverse?!up:up;return`<span class="delta ${good?'':'down'}">${up?'↑':'↓'} ${pct(Math.abs(d),1)}</span>`;}
function statusLabel(s){return{done:T('Пришёл','Completed'),confirmed:T('Подтверждена','Confirmed'),pending:T('Ждёт ответа','Awaiting reply'),cancelled:T('Отмена','Cancelled'),noshow:T('Неявка','No-show')}[s];}
function serviceStats(days){const r=range(days),m={};for(const s of D.services)m[s.id]={n:0,rev:0,clients:new Set(),repeat:0};
  for(const b of all()){if(!inR(b,r)||b.status==='cancelled')continue;const x=m[b.service];x.n++;if(done(b))x.rev+=b.price;x.clients.add(b.client);if(!isNew(b))x.repeat++;}
  const maxByCat={};for(const s of D.services){maxByCat[s.cat]=Math.max(maxByCat[s.cat]||0,m[s.id].n/s.w);}
  const ratios=D.services.map(s=>m[s.id].n/s.w),avgR=ratios.reduce((a,b)=>a+b,0)/ratios.length||1;for(const s of D.services){const x=m[s.id];x.load=Math.max(8,Math.min(96,Math.round(x.n/s.w/avgR*68+(s.w>5?12:0))));if(s.tag==='low')x.load=Math.min(x.load,22+Math.round(s.w*7));}
  return m;}

/* ---------- icons ---------- */
const I={
 home:'<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/>',
 sparkle:'<path d="M12 3c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6zM18.5 15c.3 1.6 1 2.3 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5z"/>',
 calendar:'<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
 people:'<circle cx="9" cy="8.5" r="3.3"/><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5M16 5.5a3 3 0 0 1 0 6M18 14.6c1.9.6 3 2.2 3.4 4.4"/>',
 star:'<path d="m12 4 2.3 4.9 5.2.6-3.9 3.6 1.1 5.2L12 15.7 7.3 18.3l1.1-5.2-3.9-3.6 5.2-.6z"/>',
 chart:'<path d="M4 20V4M4 20h16M8 16l3.5-4 3 2.5L20 8"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 moon:'<path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
 bell:'<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5h4"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 download:'<path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M4.5 19.5h15"/>',
 x:'<path d="m6 6 12 12M18 6 6 18"/>',
 wallet:'<rect x="3.5" y="6" width="17" height="13" rx="3"/><path d="M16 12.5h1.5M3.5 9.5h17M6 6l9.5-2.5L17 6"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 repeat:'<path d="M4 11V9a3 3 0 0 1 3-3h12l-3-3M20 13v2a3 3 0 0 1-3 3H5l3 3"/>',
 alert:'<path d="M12 4 3 19.5h18zM12 10v4.5M12 17.2v.3"/>',
 leaf:'<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15M5 19l7-7"/>',
 back:'<path d="M15 5 8 12l7 7"/>'
};
const ico=(n,s=20)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

/* ---------- service illustrations (original vector art) ---------- */
function art(s,uid){const h=s.hue,id='a'+uid+s.id;
 const bg=`<defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h} 46% 93%)"/><stop offset="1" stop-color="hsl(${(h+25)%360} 40% 83%)"/></linearGradient><radialGradient id="${id}r" cx=".7" cy=".25" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="hsl(${h} 35% 30%)"/><stop offset=".5" stop-color="hsl(${h} 30% 48%)"/><stop offset="1" stop-color="hsl(${h} 35% 28%)"/></linearGradient><linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfd6d8"/><stop offset=".45" stop-color="#f7f9fa"/><stop offset="1" stop-color="#aab3b6"/></linearGradient></defs><rect width="320" height="240" fill="url(#${id}g)"/><circle cx="235" cy="60" r="120" fill="url(#${id}r)"/><ellipse cx="160" cy="206" rx="92" ry="12" fill="hsl(${h} 30% 40%)" opacity=".16"/>`;
 const c1=`hsl(${h} 55% 52%)`,c2=`hsl(${h} 50% 38%)`,c3=`hsl(${(h+30)%360} 60% 70%)`;
 const o={
 scissors:`<g transform="rotate(-18 160 120)"><circle cx="122" cy="168" r="22" fill="none" stroke="${c2}" stroke-width="11"/><circle cx="198" cy="168" r="22" fill="none" stroke="${c2}" stroke-width="11"/><path d="M134 150 196 40l8 4-54 112z" fill="url(#${id}s)"/><path d="M186 150 124 40l-8 4 54 112z" fill="url(#${id}s)"/><circle cx="160" cy="118" r="6" fill="${c2}"/></g><path d="M58 70c20-6 30 6 46 2" stroke="${c3}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`,
 clipper:`<rect x="128" y="62" width="64" height="128" rx="30" fill="${c2}"/><rect x="134" y="40" width="52" height="30" rx="6" fill="url(#${id}s)"/><path d="M138 40v-8M146 40v-8M154 40v-8M162 40v-8M170 40v-8M178 40v-8" stroke="#9aa4a8" stroke-width="3"/><rect x="152" y="96" width="16" height="34" rx="8" fill="${c3}"/><circle cx="160" cy="160" r="7" fill="#fff" opacity=".6"/>`,
 brush:`<path d="M84 170c0-26 34-40 76-40s76 14 76 40v6H84z" fill="${c2}"/><ellipse cx="160" cy="132" rx="76" ry="16" fill="${c1}"/><ellipse cx="160" cy="132" rx="62" ry="10" fill="${c3}"/><g transform="rotate(28 190 90)"><rect x="182" y="20" width="16" height="104" rx="8" fill="hsl(${h} 15% 22%)"/><rect x="178" y="112" width="24" height="16" rx="3" fill="url(#${id}s)"/><path d="M178 128h24l-4 26h-16z" fill="${c3}"/></g>`,
 palette:`<g fill="none" stroke-linecap="round" stroke-width="18"><path d="M110 40c-14 50 24 70 6 160" stroke="hsl(${h} 45% 35%)"/><path d="M146 36c-10 54 20 80 4 166" stroke="${c1}"/><path d="M182 38c-8 56 22 76 4 162" stroke="${c3}"/><path d="M216 44c-12 50 18 72 2 152" stroke="hsl(${(h+40)%360} 70% 82%)"/></g>`,
 dryer:`<rect x="92" y="66" width="140" height="78" rx="39" fill="${c2}"/><circle cx="208" cy="105" r="30" fill="hsl(${h} 25% 20%)"/><circle cx="208" cy="105" r="18" fill="url(#${id}s)"/><rect x="122" y="130" width="36" height="72" rx="14" fill="${c2}"/><rect x="132" y="150" width="16" height="22" rx="6" fill="${c3}"/><path d="M60 92h22M54 106h28M60 120h22" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`,
 bottle:`<rect x="124" y="74" width="72" height="128" rx="18" fill="${c1}"/><rect x="124" y="120" width="72" height="44" fill="#fff" opacity=".85"/><rect x="146" y="48" width="28" height="30" rx="4" fill="hsl(${h} 15% 22%)"/><path d="M160 48V30h28" stroke="hsl(${h} 15% 22%)" stroke-width="9" fill="none" stroke-linecap="round"/><rect x="134" y="134" width="52" height="5" rx="2.5" fill="${c2}" opacity=".6"/><rect x="140" y="146" width="40" height="4" rx="2" fill="${c2}" opacity=".35"/>`,
 polish:`<path d="M114 112h92a10 10 0 0 1 10 10v60a20 20 0 0 1-20 20h-72a20 20 0 0 1-20-20v-60a10 10 0 0 1 10-10z" fill="${c1}"/><path d="M118 118h20v76h-8a12 12 0 0 1-12-12z" fill="#fff" opacity=".28"/><rect x="138" y="40" width="44" height="76" rx="8" fill="hsl(${h} 15% 18%)"/><rect x="145" y="46" width="8" height="62" rx="4" fill="#fff" opacity=".25"/><ellipse cx="92" cy="186" rx="12" ry="18" fill="${c1}" transform="rotate(-20 92 186)"/>`,
 file:`<g transform="rotate(-32 160 120)"><rect x="150" y="18" width="22" height="200" rx="11" fill="hsl(${h} 30% 85%)"/><rect x="150" y="18" width="22" height="100" rx="11" fill="${c3}"/></g><rect x="196" y="122" width="44" height="66" rx="12" fill="${c1}"/><rect x="208" y="96" width="20" height="30" rx="4" fill="hsl(${h} 15% 20%)"/>`,
 dropper:`<rect x="122" y="96" width="76" height="106" rx="22" fill="hsl(${h} 45% 45%)" opacity=".9"/><rect x="122" y="140" width="76" height="62" rx="0" fill="${c2}" opacity=".5"/><rect x="132" y="104" width="12" height="80" rx="6" fill="#fff" opacity=".35"/><rect x="142" y="70" width="36" height="30" rx="5" fill="url(#${id}s)"/><path d="M146 70c0-26 28-26 28 0" fill="hsl(${h} 15% 20%)"/><circle cx="96" cy="78" r="9" fill="${c3}" opacity=".8"/><circle cx="82" cy="102" r="5" fill="${c3}" opacity=".6"/>`,
 jar:`<rect x="96" y="104" width="128" height="88" rx="20" fill="hsl(${h} 15% 18%)"/><rect x="104" y="132" width="112" height="34" rx="6" fill="${c1}"/><rect x="88" y="78" width="144" height="34" rx="14" fill="${c1}"/><rect x="88" y="78" width="144" height="12" rx="6" fill="#fff" opacity=".3"/><ellipse cx="236" cy="70" rx="34" ry="20" fill="${c3}" transform="rotate(25 236 70)"/>`,
 roller:`<g transform="rotate(-28 160 120)"><rect x="152" y="96" width="16" height="120" rx="8" fill="url(#${id}s)"/><path d="M160 98V66" stroke="url(#${id}s)" stroke-width="8"/><rect x="116" y="38" width="88" height="34" rx="17" fill="${c1}"/><rect x="122" y="44" width="40" height="8" rx="4" fill="#fff" opacity=".45"/></g><circle cx="88" cy="168" r="16" fill="${c3}" opacity=".9"/>`,
 serum:`<g>${[0,1,2].map(i=>`<rect x="${112+i*36}" y="${70+i*6}" width="26" height="${120-i*6}" rx="13" fill="${i===1?c1:c3}" opacity="${i===1?1:.85}"/><rect x="${116+i*36}" y="${58+i*6}" width="18" height="18" rx="4" fill="url(#${id}s)"/><rect x="${118+i*36}" y="${84+i*6}" width="6" height="${86-i*6}" rx="3" fill="#fff" opacity=".35"/>`).join('')}</g>`,
 brow:`<path d="M84 120c38-36 108-44 156-14" stroke="hsl(${h} 30% 28%)" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M96 108c4-8 10-12 16-14M120 98c4-8 10-11 16-13M146 92c4-7 10-10 16-11M172 91c4-6 10-8 16-8M198 94c4-5 9-6 14-5" stroke="hsl(${h} 30% 28%)" stroke-width="4" stroke-linecap="round"/><g transform="rotate(-38 190 170)"><rect x="128" y="160" width="130" height="16" rx="8" fill="${c1}"/><path d="M258 160l22 8-22 8z" fill="hsl(${h} 30% 28%)"/></g>`,
 lash:`<path d="M70 132c40-46 140-46 180 0" stroke="hsl(${h} 15% 18%)" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M70 132c40 34 140 34 180 0" fill="#fff" opacity=".7"/><circle cx="160" cy="134" r="22" fill="${c2}"/><circle cx="160" cy="134" r="10" fill="hsl(${h} 15% 15%)"/><circle cx="167" cy="127" r="4" fill="#fff"/>${[...Array(9)].map((_,i)=>{const a=-160+i*17.5,r=a*Math.PI/180,x=160+92*Math.cos(r)*1.0,y=150+64*Math.sin(r);return`<path d="M${x.toFixed(1)} ${(y).toFixed(1)}l${(Math.cos(r)*22).toFixed(1)} ${(Math.sin(r)*26).toFixed(1)}" stroke="hsl(${h} 15% 18%)" stroke-width="4" stroke-linecap="round"/>`}).join('')}`,
 stones:`<ellipse cx="160" cy="184" rx="70" ry="22" fill="hsl(${h} 12% 26%)"/><ellipse cx="160" cy="150" rx="54" ry="19" fill="hsl(${h} 10% 36%)"/><ellipse cx="160" cy="120" rx="40" ry="15" fill="hsl(${h} 9% 46%)"/><ellipse cx="148" cy="114" rx="14" ry="4" fill="#fff" opacity=".25"/><path d="M196 104c6-34 34-50 66-48-2 34-28 54-66 48z" fill="${c1}"/><path d="M200 102c18-14 34-26 56-42" stroke="${c2}" stroke-width="3" fill="none"/>`,
 candle:`<rect x="70" y="150" width="120" height="42" rx="21" fill="#fff" opacity=".9"/><rect x="82" y="118" width="98" height="40" rx="20" fill="hsl(${h} 40% 88%)"/><rect x="186" y="96" width="62" height="96" rx="12" fill="${c1}"/><rect x="186" y="96" width="62" height="16" rx="8" fill="${c2}"/><path d="M217 96V82" stroke="hsl(${h} 15% 20%)" stroke-width="3"/><path d="M217 56c10 12 9 24 0 28-9-4-10-16 0-28z" fill="#f2b24a"/><path d="M217 66c5 6 4 12 0 14-4-2-5-8 0-14z" fill="#fff3c4"/>`
 };
 return `<svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(L(s))}">${bg}${o[s.art]||''}</svg>`;}
let artUid=0;

/* ---------- chart primitives (drawn at real container width) ---------- */
function niceMax(v){if(v<=0)return 4;const raw=v/4,p=Math.pow(10,Math.floor(Math.log10(raw))),n=raw/p;const opts=p>=10?[1,1.25,1.5,2,2.5,3,4,5,6,8,10]:[1,2,3,4,5,6,8,10];let st=opts.find(o=>o>=n-1e-9)*p;if(p<1)st=Math.max(st,1);if(raw<1)st=1;return st*4;}
function smooth(pts){if(pts.length<2)return'';let d=`M${pts[0][0]} ${pts[0][1]}`;for(let i=0;i<pts.length-1;i++){const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;const t=.16;const c1x=p1[0]+(p2[0]-p0[0])*t,c1y=p1[1]+(p2[1]-p0[1])*t,c2x=p2[0]-(p3[0]-p1[0])*t,c2y=p2[1]-(p3[1]-p1[1])*t;d+=` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;}return d;}
function lineChart(el,cfg){
 const W=Math.max(260,el.clientWidth),compact=W<520,H=cfg.h||(compact?220:280),L0=compact?44:58,R0=10,T0=12,B0=30,pw=W-L0-R0,ph=H-T0-B0;
 const labels=cfg.labels,n=labels.length;const max=niceMax(Math.max(1,...cfg.series.flatMap(s=>s.data)));
 const X=i=>L0+(n<=1?pw/2:i/(n-1)*pw),Y=v=>T0+ph-(v/max)*ph;
 let g='';for(let k=0;k<=4;k++){const v=max*k/4,y=Y(v);g+=`<line x1="${L0}" x2="${W-R0}" y1="${y}" y2="${y}" stroke="var(--line)" ${k?'stroke-dasharray="3 6"':''}/><text x="${L0-8}" y="${y+4}" text-anchor="end" font-size="11">${esc(cfg.fmtAxis(v))}</text>`;}
 const step=Math.max(1,Math.ceil(n/(compact?4:7)));labels.forEach((l,i)=>{if(i%step===0||i===n-1&&n-1-(Math.floor((n-1)/step)*step)>step/2)g+=`<text x="${X(i)}" y="${H-8}" text-anchor="middle" font-size="11">${esc(l)}</text>`;});
 let p='';cfg.series.forEach((s,si)=>{const pts=s.data.map((v,i)=>[X(i),Y(v)]);const d=smooth(pts);
  if(s.area){const gid='lg'+Math.random().toString(36).slice(2,7);p+=`<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity=".28"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs><path d="${d} L${X(n-1)} ${Y(0)} L${X(0)} ${Y(0)}Z" fill="url(#${gid})"/>`;}
  p+=`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.dash?2:2.6}" ${s.dash?'stroke-dasharray="5 6" opacity=".75"':''} stroke-linecap="round"/>`;});
 const guide=`<line class="g-line" x1="0" x2="0" y1="${T0}" y2="${T0+ph}" stroke="var(--ink)" stroke-opacity=".25" stroke-dasharray="3 4" visibility="hidden"/>`+cfg.series.map((s,si)=>`<circle class="g-dot" data-s="${si}" r="5" fill="var(--surface)" stroke="${s.color}" stroke-width="2.5" visibility="hidden"/>`).join('');
 el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cfg.aria||'')}">${g}${p}${guide}<rect class="hit" x="${L0}" y="${T0}" width="${pw}" height="${ph}" fill="transparent"/></svg><div class="tip-box"></div>`;
 const svg=$('svg',el),tip=$('.tip-box',el),hit=$('.hit',el);
 function show(i){const x=X(i);$('.g-line',el).setAttribute('x1',x);$('.g-line',el).setAttribute('x2',x);$('.g-line',el).setAttribute('visibility','visible');
  $$('.g-dot',el).forEach(c=>{const s=cfg.series[+c.dataset.s];c.setAttribute('cx',x);c.setAttribute('cy',Y(s.data[i]));c.setAttribute('visibility','visible');});
  tip.innerHTML=`<b>${esc(cfg.tipTitle?cfg.tipTitle(i):labels[i])}</b>`+cfg.series.map(s=>`<div class="tr"><span><i style="background:${s.color}"></i>${esc(s.name)}</span><span>${esc(cfg.fmt(s.data[i]))}</span></div>`).join('');
  tip.classList.add('on');const tw=tip.offsetWidth;let left=x+14;if(left+tw>W)left=x-tw-14;tip.style.left=Math.max(0,left)+'px';tip.style.top=(T0+8)+'px';}
 function hide(){tip.classList.remove('on');$('.g-line',el).setAttribute('visibility','hidden');$$('.g-dot',el).forEach(c=>c.setAttribute('visibility','hidden'));}
 hit.addEventListener('pointermove',e=>{const r=svg.getBoundingClientRect();const x=(e.clientX-r.left)*(W/r.width);const i=Math.round((x-L0)/pw*(n-1));show(Math.max(0,Math.min(n-1,i)));});
 hit.addEventListener('pointerleave',hide);
}
function barChart(el,cfg){
 const W=Math.max(260,el.clientWidth),compact=W<520,H=cfg.h||(compact?220:270),L0=compact?36:46,R0=6,T0=12,B0=28,pw=W-L0-R0,ph=H-T0-B0;
 const n=cfg.labels.length,k=cfg.series.length,max=niceMax(Math.max(1,...cfg.series.flatMap(s=>s.data))*1.08);
 const gw=pw/n,bw=Math.max(4,Math.min(compact?10:16,(gw-6)/k-3));const Y=v=>T0+ph-v/max*ph;
 let g='';for(let j=0;j<=4;j++){const v=max*j/4,y=Y(v);g+=`<line x1="${L0}" x2="${W-R0}" y1="${y}" y2="${y}" stroke="var(--line)" ${j?'stroke-dasharray="3 6"':''}/><text x="${L0-8}" y="${y+4}" text-anchor="end" font-size="11">${esc(cfg.fmtAxis(v))}</text>`;}
 let b='';const lstep=Math.max(1,Math.ceil(n/(compact?6:12)));
 cfg.labels.forEach((l,i)=>{const cx=L0+gw*i+gw/2,x0=cx-(bw*k+3*(k-1))/2;const hl=cfg.highlight===i;
  b+=`<rect x="${L0+gw*i+2}" y="${T0}" width="${gw-4}" height="${ph}" rx="10" fill="${hl?'var(--fern-soft)':'var(--surface-2)'}" opacity="${hl?.9:.55}" class="col" data-i="${i}"/>`;
  cfg.series.forEach((s,si)=>{const v=s.data[i],y=Y(v);b+=`<rect x="${x0+si*(bw+3)}" y="${y}" width="${bw}" height="${Math.max(0,T0+ph-y)}" rx="${Math.min(5,bw/2)}" fill="${s.color}" pointer-events="none"/>`;});
  if(i%lstep===0)b+=`<text x="${cx}" y="${H-8}" text-anchor="middle" font-size="11">${esc(l)}</text>`;});
 el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cfg.aria||'')}">${g}${b}</svg><div class="tip-box"></div>`;
 const tip=$('.tip-box',el),svg=$('svg',el);
 $$('.col',el).forEach(c=>{c.addEventListener('pointerenter',()=>{const i=+c.dataset.i;$$('.col',el).forEach(o=>o.setAttribute('opacity',o===c?.95:.55));
   tip.innerHTML=`<b>${esc(cfg.tipTitle?cfg.tipTitle(i):cfg.labels[i])}</b>`+cfg.series.map(s=>`<div class="tr"><span><i style="background:${s.color}"></i>${esc(s.name)}</span><span>${esc(cfg.fmt(s.data[i],s))}</span></div>`).join('')+(cfg.extraTip?cfg.extraTip(i):'');
   tip.classList.add('on');const r=svg.getBoundingClientRect(),sx=r.width/W;const cx=(L0+gw*i+gw/2)*sx;const tw=tip.offsetWidth;let left=cx+gw*sx/2+6;if(left+tw>r.width)left=cx-gw*sx/2-tw-6;tip.style.left=Math.max(0,left)+'px';tip.style.top='10px';});
  c.addEventListener('pointerleave',()=>{tip.classList.remove('on');$$('.col',el).forEach(o=>o.setAttribute('opacity',cfg.highlight===+o.dataset.i?.9:.55));});});
}
function spark(data,color){const w=110,h=36,max=Math.max(...data),min=Math.min(...data),sp=max-min||1;const pts=data.map((v,i)=>[i/(data.length-1)*w,h-3-(v-min)/sp*(h-8)]);return`<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="${smooth(pts)}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/></svg>`;}
function gauge(p){const N=64,cx=150,cy=150,r1=104,r2=136;let s='';const on=Math.round(N*Math.min(1,p/100));
 for(let i=0;i<N;i++){const a=Math.PI*(1-i/(N-1)),c=Math.cos(a),sn=Math.sin(a);const lit=i<on;const col=lit?`hsl(${((272+i*1.85)%360).toFixed(0)} ${(52+i*0.35).toFixed(0)}% ${(50+i*0.22).toFixed(0)}%)`:'var(--line-2)';s+=`<line x1="${(cx+r1*c).toFixed(1)}" y1="${(cy-r1*sn).toFixed(1)}" x2="${(cx+r2*c).toFixed(1)}" y2="${(cy-r2*sn).toFixed(1)}" stroke="${col}" stroke-width="3.4" stroke-linecap="round"/>`;}
 return`<svg viewBox="0 0 300 160" aria-hidden="true">${s}</svg>`;}
function ring(p,color){const r=20,c=2*Math.PI*r;return`<svg class="ring" width="52" height="52" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="6"/><circle cx="26" cy="26" r="${r}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(c*p/100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 26 26)"/><text x="26" y="30" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">${Math.round(p)}%</text></svg>`;}

/* ---------- pages ---------- */
const PAGES=[{id:'overview',icon:'home',ru:'Обзор',en:'Overview'},{id:'services',icon:'sparkle',ru:'Услуги',en:'Services'},{id:'bookings',icon:'calendar',ru:'Записи',en:'Bookings'},{id:'masters',icon:'star',ru:'Мастера',en:'Team'},{id:'clients',icon:'people',ru:'Клиенты',en:'Clients'},{id:'reports',icon:'chart',ru:'Отчёты',en:'Reports'}];
const chartJobs=[];
function periodSeg(opts){return`<div class="seg" role="group" aria-label="${T('Период','Period')}">${opts.map(d=>`<button data-act="period" data-v="${d}" aria-pressed="${state.period===d}">${d===365?T('Год','Year'):d+T(' дней',' days')}</button>`).join('')}</div>`;}
function lowServices(st){return D.services.filter(s=>st[s.id].load<35);}

function pageOverview(){
 const now=new Date(),hour=now.getHours();
 const greet=hour<12?T('Доброе утро','Good morning'):hour<18?T('Добрый день','Good afternoon'):T('Добрый вечер','Good evening');
 const todayB=all().filter(b=>b.t===TODAY&&b.status!=='cancelled');const lastWeek=all().filter(b=>b.t===TODAY-7*DAY&&b.status!=='cancelled');
 const pending=todayB.filter(b=>b.status==='pending').length+all().filter(b=>b.t===TODAY+DAY&&b.status==='pending').length;
 const left=todayB.filter(b=>b.status==='confirmed'||b.status==='pending').length;
 const bookedMin=sum(todayB,b=>svcById[b.service].min);const freeHours=Math.max(0,Math.round(D.masters.length*11-bookedMin/60));
 const r30=range(30),p30=range(30,1);const rev=sum(all().filter(b=>inR(b,r30)&&done(b)),b=>b.price),revP=sum(all().filter(b=>inR(b,p30)&&done(b)),b=>b.price);
 const dailyCount=[...Array(14)].map((_,i)=>all().filter(b=>b.t===TODAY-(13-i)*DAY&&b.status!=='cancelled').length);
 const dailyRev=[...Array(30)].map((_,i)=>sum(all().filter(b=>b.t===TODAY-(29-i)*DAY&&done(b)),b=>b.price));
 const st=serviceStats(30),low=lowServices(st);
 // gauge: month to date
 const m0=new Date(TODAY);m0.setDate(1);const mFrom=m0.getTime();const mtd=all().filter(b=>b.t>=mFrom&&b.t<=TODAY&&done(b));const mRev=sum(mtd,b=>b.price);const gp=mRev/D.monthPlan*100;
 const dim=new Date(m0.getFullYear(),m0.getMonth()+1,0).getDate(),dayN=new Date(TODAY).getDate();
 const upcoming=all().filter(b=>(b.status==='confirmed'||b.status==='pending')&&(b.t>TODAY||(b.t===TODAY&&b.hour+b.minute/60>=hour+now.getMinutes()/60))).sort((a,b)=>a.t-b.t||a.hour-b.hour||a.minute-b.minute).slice(0,6);
 const topSvc=D.services.map(s=>({s,rev:st[s.id].rev,n:st[s.id].n})).sort((a,b)=>b.rev-a.rev).slice(0,5);const topMax=topSvc[0].rev||1;
 chartJobs.push(()=>{const el=$('#ovBars');if(!el)return;const mode=state.barMode;let labels=[],nw=[],rp=[],rv=[],titles=[];
  if(mode==='month'){for(let i=11;i>=0;i--){const d=new Date(TODAY);d.setDate(1);d.setMonth(d.getMonth()-i);const f=d.getTime(),e=new Date(d.getFullYear(),d.getMonth()+1,0).getTime();const bs=all().filter(b=>b.t>=f&&b.t<=Math.min(e,TODAY)&&done(b));labels.push(d.toLocaleDateString(state.lang==='ru'?'ru-RU':'en-GB',{month:'short'}).replace('.',''));titles.push(d.toLocaleDateString(state.lang==='ru'?'ru-RU':'en-GB',{month:'long',year:'numeric'}));nw.push(bs.filter(isNew).length);rp.push(bs.filter(b=>!isNew(b)).length);rv.push(sum(bs,b=>b.price));}}
  else{for(let i=11;i>=0;i--){const e=TODAY-i*7*DAY,f=e-6*DAY;const bs=all().filter(b=>b.t>=f&&b.t<=e&&done(b));labels.push(dt(f));titles.push(dt(f)+' - '+dt(e));nw.push(bs.filter(isNew).length);rp.push(bs.filter(b=>!isNew(b)).length);rv.push(sum(bs,b=>b.price));}}
  barChart(el,{labels,highlight:11,series:[{name:T('Повторные визиты','Returning visits'),data:rp,color:'var(--fern-2)'},{name:T('Новые клиенты','New clients'),data:nw,color:'var(--peach)'}],fmt:v=>num(v),fmtAxis:v=>num(v),tipTitle:i=>titles[i],extraTip:i=>`<div class="tr"><span>${T('Выручка','Revenue')}</span><span>${money(rv[i])}</span></div>`,aria:T('Визиты по месяцам','Visits by month')});});
 return`
 <div class="grid g-hero">
  <section class="card welcome">
   <span class="when"><i></i>${esc(now.toLocaleDateString(state.lang==='ru'?'ru-RU':'en-GB',{weekday:'long',day:'numeric',month:'long'}))} · ${String(hour).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}</span>
   <h1>${greet},<br>${T('Анна','Emma')}!</h1>
   <p>${T(`Сегодня в студии <b>${todayB.length} записей</b>, впереди ещё ${left}. Ответа ждут <b>${pending} клиентов</b>, у мастеров свободно около ${freeHours} часов.`,`<b>${todayB.length} bookings</b> today, ${left} still ahead. <b>${pending} clients</b> are waiting for a reply, and the team has about ${freeHours} free hours.`)}</p>
   <div class="row"><button class="btn btn-primary" data-act="new">${ico('plus',16)}${T('Новая запись','New booking')}</button><button class="btn" data-act="go" data-v="bookings">${ico('calendar',16)}${T('Журнал записей','Booking log')}</button></div>
  </section>
  <section class="card kpi"><div class="kpi-top"><span class="kpi-label">${T('Записей сегодня','Bookings today')}</span><span class="kpi-ico" style="background:var(--fern-soft);color:var(--fern)">${ico('calendar',18)}</span></div>
   <div class="kpi-value">${num(todayB.length)} ${delta(todayB.length,lastWeek.length)}</div>
   <div class="kpi-chart">${spark(dailyCount,'var(--fern-2)')}</div><div class="kpi-foot"><span>${T('к прошлой','vs last')} ${esc(new Date(TODAY).toLocaleDateString(state.lang==='ru'?'ru-RU':'en-GB',{weekday:'long'}))} · ${T('14 дней на графике','14 days shown')}</span></div></section>
  <section class="card kpi"><div class="kpi-top"><span class="kpi-label">${T('Выручка за 30 дней','Revenue, 30 days')}</span><span class="kpi-ico" style="background:var(--sky-soft);color:var(--sky)">${ico('wallet',18)}</span></div>
   <div class="kpi-value">${money(rev,true)} ${delta(rev,revP)}</div>
   <div class="kpi-chart">${spark(dailyRev,'var(--sky)')}</div><div class="kpi-foot"><span>${T('к прошлым 30 дням','vs previous 30 days')}</span></div></section>
  <section class="card kpi" ${low.length?'role="button" tabindex="0" data-act="lowgo" style="cursor:pointer"':''}><div class="kpi-top"><span class="kpi-label">${T('Услуги с низкой загрузкой','Underbooked services')}</span><span class="kpi-ico" style="background:var(--peach-soft);color:#c0603a">${ico('alert',18)}</span></div>
   <div class="kpi-value">${low.length} <span class="delta down">${T('нужно внимание','needs attention')}</span></div>
   <div class="low-list">${low.slice(0,3).map(s=>`<span class="low-item"><span class="low-thumb">${art(s,'t'+(artUid++))}</span><span>${esc(L(s))}<small>${T('загрузка','load')} ${st[s.id].load}%</small></span></span>`).join('')}</div><div class="kpi-foot"><span>${T('Откройте, чтобы предложить акцию','Open to plan a promotion')}</span></div></section>
 </div>
 <div class="grid g-2-1 mt">
  <section class="card"><div class="card-head"><div><h2 class="card-title">${T('Визиты студии','Studio visits')}</h2><p class="card-sub">${T('Пришедшие клиенты: новые и повторные. Наведите на столбец','Completed visits: new and returning clients. Hover a column')}</p></div>
   <div class="head-actions"><div class="legend"><span><i style="background:var(--fern-2)"></i>${T('Повторные','Returning')}</span><span><i style="background:var(--peach)"></i>${T('Новые','New')}</span></div>
   <div class="seg"><button data-act="barmode" data-v="month" aria-pressed="${state.barMode==='month'}">${T('Месяцы','Months')}</button><button data-act="barmode" data-v="week" aria-pressed="${state.barMode==='week'}">${T('Недели','Weeks')}</button></div></div></div>
   <div class="chart" id="ovBars"></div></section>
  <section class="card"><div class="card-head"><div><h2 class="card-title">${T('План месяца','Monthly target')}</h2><p class="card-sub">${T('Выручка с 1-го числа к плану','Revenue since the 1st vs target')} ${money(D.monthPlan,true)}</p></div></div>
   <div class="gauge-wrap">${gauge(gp)}<div style="margin-top:-62px;text-align:center"><div class="gauge-num">${pct(gp,1)}</div><div class="gauge-cap">${T('плана выполнено','of target reached')}</div></div>
   <div class="gauge-stats"><div><small>${T('Визитов','Visits')}</small><b>${num(mtd.length)}</b></div><div style="text-align:right"><small>${T('Выручка','Revenue')}</small><b>${money(mRev,true)}</b></div></div>
   <div class="gauge-note">${gp>=100?T('План выполнен','Target reached'):T(`До плана ${money(D.monthPlan-mRev,true)} · осталось дней: ${dim-dayN}`,`${money(D.monthPlan-mRev,true)} to go · ${dim-dayN} days left`)}</div></div></section>
 </div>
 <div class="grid g-1-1 mt">
  <section class="card"><div class="card-head"><div><h2 class="card-title">${T('Ближайшие записи','Up next')}</h2><p class="card-sub">${T('Подтверждённые и ожидающие ответа','Confirmed and awaiting reply')}</p></div><button class="btn btn-ghost" data-act="go" data-v="bookings">${T('Все записи','All bookings')}</button></div>
   <div class="list">${upcoming.map(b=>`<div class="li"><span class="li-time">${b.t===TODAY?hm(b):`${dt(b.t)}<br><small style="color:var(--muted);font-weight:500">${hm(b)}</small>`}</span><span class="li-main"><b>${esc(L(cliById[b.client]))} · ${esc(L(svcById[b.service]))}</b><small>${esc(L(mstById[b.master]))} · ${money(b.price)}</small></span><span class="status st-${b.status}">${statusLabel(b.status)}</span></div>`).join('')}</div></section>
  <section class="card"><div class="card-head"><div><h2 class="card-title">${T('Что приносит выручку','Top earning services')}</h2><p class="card-sub">${T('Последние 30 дней','Last 30 days')}</p></div><button class="btn btn-ghost" data-act="go" data-v="services">${T('Каталог','Catalogue')}</button></div>
   <div>${topSvc.map(x=>`<div class="bar-row"><span class="nm">${esc(L(x.s))} <small style="color:var(--muted);font-weight:500">· ${num(x.n)} ${T('визитов','visits')}</small></span><span class="vl">${money(x.rev,true)}</span><span class="track"><span class="fill" style="width:${(x.rev/topMax*100).toFixed(1)}%;background:${catColor[x.s.cat]}"></span></span></div>`).join('')}</div></section>
 </div>`;}

function pageServices(){
 const st=serviceStats(30);const r30=range(30);const b30=all().filter(b=>inR(b,r30)&&done(b));const avg=b30.length?sum(b30,b=>b.price)/b30.length:0;const low=lowServices(st);
 let list=D.services.filter(s=>(state.category==='all'||s.cat===state.category)&&(!state.lowOnly||st[s.id].load<35)&&(!state.search||L(s).toLowerCase().includes(state.search.toLowerCase())||L(catById[s.cat]).toLowerCase().includes(state.search.toLowerCase())));
 const sorters={popular:(a,b)=>st[b.id].n-st[a.id].n,priceAsc:(a,b)=>a.price-b.price,priceDesc:(a,b)=>b.price-a.price,name:(a,b)=>L(a).localeCompare(L(b))};list.sort(sorters[state.sort]);
 const tagL={hit:T('Хит','Bestseller'),new:T('Новинка','New'),premium:T('Премиум','Premium'),low:T('Мало записей','Underbooked')};
 return`
 <div class="page-head"><div><p>${T('Все услуги студии: цены, длительность и спрос за 30 дней','Every studio service: prices, duration and 30-day demand')}</p><h1>${T('Каталог услуг','Service catalogue')}</h1></div>
  <div class="head-actions"><button class="btn" data-act="csv" data-v="services">${ico('download',16)}${T('Скачать CSV','Download CSV')}</button><button class="btn btn-primary" data-act="new">${ico('plus',16)}${T('Записать клиента','Book a client')}</button></div></div>
 <div class="grid g-4">
  ${kpiMini(T('Услуг в каталоге','Services listed'),num(D.services.length),T(`${D.categories.length} направлений`,`${D.categories.length} categories`),'sparkle','var(--fern-soft)','var(--fern)')}
  ${kpiMini(T('Визитов за 30 дней','Visits, 30 days'),num(b30.length),T('пришли и оплатили','completed and paid'),'calendar','var(--sky-soft)','var(--sky)')}
  ${kpiMini(T('Средний чек','Average ticket'),money(avg),T('за одну услугу','per service'),'wallet','var(--peach-soft)','#c0603a')}
  ${kpiMini(T('Низкая загрузка','Underbooked'),num(low.length),T('стоит продвинуть','worth promoting'),'alert','var(--rose-soft)','var(--rose)')}
 </div>
 <div class="toolbar mt"><div class="chips" role="group" aria-label="${T('Направления','Categories')}"><button class="chip" data-act="cat" data-v="all" aria-pressed="${state.category==='all'}">${T('Все','All')} <small>${D.services.length}</small></button>${D.categories.map(c=>`<button class="chip" data-act="cat" data-v="${c.id}" aria-pressed="${state.category===c.id}"><i style="background:${catColor[c.id]}"></i>${esc(L(c))} <small>${D.services.filter(s=>s.cat===c.id).length}</small></button>`).join('')}</div>
  <div class="tools-r"><button class="toggle" data-act="lowonly" aria-pressed="${state.lowOnly}"><span class="sw"></span>${T('Только с низкой загрузкой','Underbooked only')}</button>
   <label class="field">${ico('search',15)}<input id="svcSearch" type="search" value="${esc(state.search)}" placeholder="${T('Найти услугу','Find a service')}" aria-label="${T('Найти услугу','Find a service')}"></label>
   <label class="field"><span class="sr">${T('Сортировка','Sort')}</span><select data-act="sort" aria-label="${T('Сортировка','Sort')}">${[['popular',T('Сначала популярные','Most popular')],['priceDesc',T('Сначала дороже','Price: high to low')],['priceAsc',T('Сначала дешевле','Price: low to high')],['name',T('По названию','By name')]].map(([v,l])=>`<option value="${v}" ${state.sort===v?'selected':''}>${l}</option>`).join('')}</select></label></div></div>
 ${list.length?`<div class="catalog">${list.map(s=>{const x=st[s.id],lowL=x.load<35,col=lowL?'var(--rose)':x.load>75?'var(--fern-2)':'var(--honey)';const tag=lowL?'low':s.tag;
  return`<button class="svc" data-act="svc" data-v="${s.id}"><div class="svc-art">${art(s,'c'+(artUid++))}${tag?`<span class="badge ${tag}">${tagL[tag]}</span>`:''}</div>
  <div class="svc-body"><div class="svc-top"><span class="svc-name">${esc(L(s))}</span><span class="svc-cat" style="background:${catSoft[s.cat]};color:${catColor[s.cat]}">${esc(L(catById[s.cat]))}</span></div>
  <span class="svc-meta">${s.min} ${T('мин','min')} · ${money(s.price)}</span>
  <div class="svc-load"><div class="lbl"><span>${num(x.n)} ${T('записей за 30 дней','bookings, 30 days')}</span><b>${x.load}%</b></div><div class="track"><div class="fill" style="width:${x.load}%;background:${col}"></div></div></div></div></button>`;}).join('')}</div>`
 :`<div class="empty">${T('Ничего не нашлось. Попробуйте другое название или сбросьте фильтры.','Nothing matches. Try another name or reset the filters.')}<br><button class="btn" data-act="resetsvc">${T('Сбросить фильтры','Reset filters')}</button></div>`}`;}
function kpiMini(label,value,foot,icon,bg,fg,extra=''){return`<section class="card kpi"><div class="kpi-top"><span class="kpi-label">${label}</span><span class="kpi-ico" style="background:${bg};color:${fg}">${ico(icon,18)}</span></div><div class="kpi-value">${value}${extra}</div><div class="kpi-foot"><span>${foot}</span></div></section>`;}

function pageBookings(){
 const r=range(state.period),pr=range(state.period,1);
 const past=all().filter(b=>inR(b,r)),prev=all().filter(b=>inR(b,pr));
 const cnt=(a,s)=>a.filter(b=>b.status===s).length;const n=past.length;
 const dn=cnt(past,'done'),cn=cnt(past,'cancelled'),ns=cnt(past,'noshow');
 // funnel
 const confirmed=past.filter(b=>b.status!=='cancelled').length;
 const later={};for(const b of all()){if(b.status==='cancelled')continue;(later[b.client]=later[b.client]||[]).push(b.t);}
 const rebook=past.filter(b=>done(b)&&(later[b.client]||[]).some(t=>t>b.t&&t<=b.t+60*DAY)).length;
 const steps=[[T('Записались','Booked'),n],[T('Не отменили','Kept the booking'),confirmed],[T('Пришли','Showed up'),dn],[T('Записались снова в течение 60 дней','Rebooked within 60 days'),rebook]];
 // heatmap
 const hm2=[...Array(7)].map(()=>Array(12).fill(0));for(const b of past){if(b.status==='cancelled')continue;const d=(new Date(b.t).getDay()+6)%7;const h=b.hour-9;if(h>=0&&h<12)hm2[d][h]++;}
 const hmax=Math.max(1,...hm2.flat());const days=state.lang==='ru'?['Пн','Вт','Ср','Чт','Пт','Сб','Вс']:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
 // journal
 const q=state.search.toLowerCase();
 let j=all().filter(b=>{if(state.status==='upcoming')return b.status==='confirmed'||b.status==='pending';if(state.status!=='all'&&b.status!==state.status)return false;if(state.status==='all'&&(b.t>TODAY||b.status==='confirmed'||b.status==='pending'))return false;return true;});
 if(q)j=j.filter(b=>(L(cliById[b.client])+' '+L(svcById[b.service])+' '+L(mstById[b.master])+' '+b.id).toLowerCase().includes(q));
 j.sort(state.status==='upcoming'?(a,b)=>a.t-b.t||a.hour-b.hour:(a,b)=>b.t-a.t||b.hour-a.hour);
 const shown=j.slice(0,state.journalLimit);
 const filters=[['all',T('Все','All')],['upcoming',T('Предстоящие','Upcoming')],['done',T('Пришли','Completed')],['cancelled',T('Отмены','Cancelled')],['noshow',T('Неявки','No-shows')]];
 return`
 <div class="page-head"><div><p>${T('Кто записался, кто пришёл и когда в студии больше всего клиентов','Who booked, who came, and when the studio is busiest')}</p><h1>${T('Записи','Bookings')}</h1></div><div class="head-actions">${periodSeg([7,30,90])}<button class="btn" data-act="csv" data-v="bookings">${ico('download',16)}CSV</button></div></div>
 <div class="grid g-4">
  ${kpiMini(T('Всего записей','Bookings'),num(n),T('за выбранный период','in the selected period'),'calendar','var(--fern-soft)','var(--fern)',' '+delta(n,prev.length))}
  ${kpiMini(T('Пришли','Show-up rate'),pct(n?dn/n*100:0,1),`${num(dn)} ${T('визитов','visits')}`,'repeat','var(--sky-soft)','var(--sky)')}
  ${kpiMini(T('Отмены','Cancellations'),pct(n?cn/n*100:0,1),`${num(cn)} ${T('записей','bookings')}`,'x','var(--peach-soft)','#c0603a',' '+delta(cn/(n||1),cnt(prev,'cancelled')/(prev.length||1),true))}
  ${kpiMini(T('Неявки','No-shows'),pct(n?ns/n*100:0,1),`${T('потеряно','lost')} ${money(sum(past.filter(b=>b.status==='noshow'),b=>b.price),true)}`,'alert','var(--rose-soft)','var(--rose)')}
 </div>
 <div class="grid g-1-1 mt">
  <section class="card"><div class="card-head"><div><h2 class="card-title">${T('Путь записи','Booking journey')}</h2><p class="card-sub">${T('Сколько клиентов доходит до визита и возвращается','How many clients reach the chair and come back')}</p></div></div>
   <div class="funnel">${steps.map((s,i)=>`<div class="fn"><b>${s[0]}</b><span class="vl">${num(s[1])}<small>${pct(s[1]/(n||1)*100,0)}</small></span><span class="track"><span class="fill" style="width:${(s[1]/(n||1)*100).toFixed(1)}%;opacity:${1-i*.14}"></span></span>${i?`<span class="drop">−${num(steps[i-1][1]-s[1])} ${T('на этом шаге','at this step')}</span>`:''}</div>`).join('')}</div></section>
  <section class="card"><div class="card-head"><div><h2 class="card-title">${T('Загрузка по часам','Busy hours')}</h2><p class="card-sub">${T('Записи по дням недели и времени начала','Bookings by weekday and start time')}</p></div></div>
   <div class="heat"><span></span>${[...Array(12)].map((_,h)=>`<span class="h">${h%2===0?9+h:''}</span>`).join('')}${hm2.map((row,d)=>`<span class="d">${days[d]}</span>${row.map((v,h)=>`<span class="c" title="${days[d]} ${9+h}:00 - ${num(v)} ${T('записей','bookings')}" style="background:color-mix(in srgb,var(--fern-2) ${Math.round(8+v/hmax*88)}%,var(--surface-2))"></span>`).join('')}`).join('')}</div>
   <div class="heat-key">${T('меньше','fewer')}${[10,35,60,85].map(p=>`<span style="background:color-mix(in srgb,var(--fern-2) ${p}%,var(--surface-2))"></span>`).join('')}${T('больше','more')}</div></section>
 </div>
 <section class="card mt"><div class="card-head"><div><h2 class="card-title">${T('Журнал записей','Booking log')}</h2><p class="card-sub">${T('Показано','Showing')} ${num(shown.length)} ${T('из','of')} ${num(j.length)}</p></div>
  <label class="field">${ico('search',15)}<input id="bkSearch" type="search" value="${esc(state.search)}" placeholder="${T('Клиент, услуга, мастер','Client, service, stylist')}" aria-label="${T('Поиск по журналу','Search the log')}"></label></div>
  <div class="chips" style="margin-bottom:10px">${filters.map(([v,l])=>`<button class="chip" data-act="status" data-v="${v}" aria-pressed="${state.status===v}">${l}</button>`).join('')}</div>
  <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${T('Дата','Date')}</th><th>${T('Клиент и услуга','Client & service')}</th><th class="hide-sm">${T('Мастер','Stylist')}</th><th>${T('Статус','Status')}</th><th class="num">${T('Сумма','Amount')}</th></tr></thead>
  <tbody>${shown.map(b=>`<tr><td class="nowrap">${dt(b.t)}<small>${hm(b)}</small></td><td>${esc(L(cliById[b.client]))}<small>${esc(L(svcById[b.service]))}</small></td><td class="hide-sm">${esc(L(mstById[b.master]))}</td><td><span class="status st-${b.status}">${statusLabel(b.status)}</span></td><td class="num">${money(b.price)}</td></tr>`).join('')||`<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:24px">${T('Записей с такими условиями нет','No bookings match')}</td></tr>`}</tbody></table></div>
  ${j.length>shown.length?`<div class="more"><button class="btn" data-act="more">${T('Показать ещё 12','Show 12 more')}</button></div>`:''}</section>`;}

function masterStats(days){const r=range(days);const out={};for(const m of D.masters)out[m.id]={rev:0,n:0,min:0,clients:new Set(),rep:0,dow:Array(7).fill(0),svc:{}};
 for(const b of all()){if(!inR(b,r)||b.status==='cancelled')continue;const x=out[b.master];x.n++;x.min+=svcById[b.service].min;x.clients.add(b.client);if(!isNew(b))x.rep++;x.dow[(new Date(b.t).getDay()+6)%7]++;if(done(b)){x.rev+=b.price;x.svc[b.service]=(x.svc[b.service]||0)+b.price;}}
 for(const m of D.masters){const x=out[m.id];x.load=Math.min(97,x.min/(days*5/7*10*60)*100);}return out;}
function pageMasters(){
 const ms=masterStats(state.period),sel=state.master&&ms[state.master]?state.master:D.masters.slice().sort((a,b)=>ms[b.id].rev-ms[a.id].rev)[0].id;
 const x=ms[sel],m=mstById[sel];const days=state.lang==='ru'?['Пн','Вт','Ср','Чт','Пт','Сб','Вс']:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
 const top=Object.entries(x.svc).sort((a,b)=>b[1]-a[1]).slice(0,4);const topMax=top[0]?top[0][1]:1;
 chartJobs.push(()=>{const el=$('#mstDow');if(!el)return;barChart(el,{labels:days,h:230,series:[{name:T('Записей','Bookings'),data:x.dow,color:m.color}],fmt:v=>num(v),fmtAxis:v=>num(v),aria:T('Записи по дням недели','Bookings by weekday')});});
 return`
 <div class="page-head"><div><p>${T('Загрузка, выручка и постоянные клиенты каждого мастера','Workload, revenue and loyal clients for each team member')}</p><h1>${T('Мастера','Team')}</h1></div><div class="head-actions">${periodSeg([30,90,365])}</div></div>
 <div class="masters">${D.masters.map(mm=>{const s=ms[mm.id];return`<button class="card mst" data-act="master" data-v="${mm.id}" aria-pressed="${mm.id===sel}"><div class="mst-top"><span class="avatar" style="background:${mm.color}">${esc(L(mm).split(' ').map(w=>w[0]).join(''))}</span><span><b>${esc(L(mm))}</b><small>${esc(L(mm.role))}</small><span class="stars">★ ${mm.rating.toFixed(1)}</span></span>${ring(s.load,mm.color)}</div>
  <div class="mst-stats"><div><small>${T('Выручка','Revenue')}</small><b>${money(s.rev,true)}</b></div><div><small>${T('Клиентов','Clients')}</small><b>${num(s.clients.size)}</b></div><div><small>${T('Повторные','Returning')}</small><b>${pct(s.n?s.rep/s.n*100:0)}</b></div></div></button>`;}).join('')}</div>
 <div class="grid g-2-1 mt">
  <section class="card"><div class="card-head"><div><h2 class="card-title">${esc(L(m))}: ${T('записи по дням недели','bookings by weekday')}</h2><p class="card-sub">${T('Помогает планировать смены и акции на тихие дни','Helps plan shifts and promote quiet days')}</p></div></div><div class="chart" id="mstDow"></div></section>
  <section class="card"><div class="card-head"><div><h2 class="card-title">${T('Лучшие услуги мастера','Top services')}</h2><p class="card-sub">${T('По выручке за период','By revenue for the period')}</p></div></div>
   <div>${top.map(([id,v])=>`<div class="bar-row"><span class="nm">${esc(L(svcById[id]))}</span><span class="vl">${money(v,true)}</span><span class="track"><span class="fill" style="width:${(v/topMax*100).toFixed(1)}%;background:${m.color}"></span></span></div>`).join('')}</div>
   <div class="facts"><div class="fact"><small>${T('Загрузка','Utilisation')}</small><b>${pct(x.load)}</b></div><div class="fact"><small>${T('Средний чек','Avg ticket')}</small><b>${money(x.n?x.rev/Math.max(1,x.n):0)}</b></div></div></section>
 </div>`;}

function pageClients(){
 const r=range(state.period),pr=range(state.period,1);const cur=all().filter(b=>inR(b,r)&&done(b)),prev=all().filter(b=>inR(b,pr)&&done(b));
 const uniq=new Set(cur.map(b=>b.client)),newC=new Set(cur.filter(isNew).map(b=>b.client));const repShare=cur.length?cur.filter(b=>!isNew(b)).length/cur.length*100:0;
 const avg=cur.length?sum(cur,b=>b.price)/cur.length:0,avgP=prev.length?sum(prev,b=>b.price)/prev.length:0;
 // districts
 const dist={};for(const b of cur){const d=cliById[b.client].district;(dist[d]=dist[d]||{rev:0,cl:new Set(),n:0});dist[d].rev+=b.price;dist[d].cl.add(b.client);dist[d].n++;}
 const dl=Object.entries(dist).sort((a,b)=>b[1].rev-a[1].rev);const dmax=dl[0]?dl[0][1].rev:1;const dtot=sum(dl,x=>x[1].rev)||1;
 // top clients (all time 365)
 const yr=range(365);const cs={};for(const b of all()){if(!inR(b,yr)||!done(b))continue;(cs[b.client]=cs[b.client]||{n:0,rev:0,last:0,svc:{}});const c=cs[b.client];c.n++;c.rev+=b.price;c.last=Math.max(c.last,b.t);c.svc[b.service]=(c.svc[b.service]||0)+1;}
 const topC=Object.entries(cs).sort((a,b)=>b[1].rev-a[1].rev).slice(0,8);
 chartJobs.push(()=>{const el=$('#chByCh');if(!el)return;const {labels,buckets,titles}=buckets_(state.period,state.period>90?'month':state.period>30?'week':'day');
  const series=D.channels.filter(c=>state.channels[c.id]).map(c=>({name:L(c),color:c.color,data:buckets.map(([f,t])=>sum(cur.filter(b=>b.t>=f&&b.t<=t&&(b.channel===c.id)),b=>b.price))}));
  if(!series.length){el.innerHTML=`<div class="empty">${T('Выберите хотя бы один канал','Pick at least one channel')}</div>`;return;}
  lineChart(el,{labels,series,h:el.clientWidth<520?240:340,fmt:v=>money(v),fmtAxis:v=>money(v,true),tipTitle:i=>titles[i],aria:T('Выручка по каналам','Revenue by channel')});});
 return`
 <div class="page-head"><div><p>${T('Откуда приходят клиенты, где живут и кто возвращается','Where clients come from, where they live and who comes back')}</p><h1>${T('Клиенты','Clients')}</h1></div><div class="head-actions">${periodSeg([30,90,365])}<button class="btn" data-act="csv" data-v="clients">${ico('download',16)}CSV</button></div></div>
 <div class="grid g-4">
  ${kpiMini(T('Клиентов','Clients'),num(uniq.size),T('пришли хотя бы раз','visited at least once'),'people','var(--fern-soft)','var(--fern)',' '+delta(uniq.size,new Set(prev.map(b=>b.client)).size))}
  ${kpiMini(T('Новые','New clients'),num(newC.size),T('первый визит в студию','first visit to the studio'),'sparkle','var(--peach-soft)','#c0603a')}
  ${kpiMini(T('Повторные визиты','Returning visits'),pct(repShare,1),T('доля визитов постоянных','share from regulars'),'repeat','var(--sky-soft)','var(--sky)')}
  ${kpiMini(T('Средний чек','Average ticket'),money(avg),T('к прошлому периоду','vs previous period'),'wallet','var(--rose-soft)','var(--rose)',' '+delta(avg,avgP))}
 </div>
 <div class="grid g-2-1 mt">
  <section class="card"><div class="card-head"><div><h2 class="card-title">${T('Выручка по каналам записи','Revenue by booking channel')}</h2><p class="card-sub">${T('Нажмите на канал, чтобы скрыть или показать его','Click a channel to hide or show it')}</p></div></div>
   <div class="legend" style="margin-bottom:8px">${D.channels.map(c=>`<button data-act="ch" data-v="${c.id}" aria-pressed="${state.channels[c.id]}"><i style="background:${c.color}"></i>${esc(L(c))}</button>`).join('')}</div>
   <div class="chart" id="chByCh"></div></section>
  <section class="card"><div class="card-head"><div><h2 class="card-title">${T('Клиенты по районам','Clients by area')}</h2><p class="card-sub">${T('Куда направить рекламу и листовки','Where to aim ads and flyers')}</p></div></div>
   <div>${dl.map(([id,v])=>`<div class="rank"><span class="n">${dl.findIndex(x=>x[0]===id)+1}</span><span><b>${esc(L(distById[id]))}</b><small>${num(v.cl.size)} ${T('клиентов','clients')} · ${pct(v.rev/dtot*100)}</small></span><span class="vl">${money(v.rev,true)}</span><span class="track"><span class="fill" style="width:${(v.rev/dmax*100).toFixed(1)}%"></span></span></div>`).join('')}</div></section>
 </div>
 <section class="card mt"><div class="card-head"><div><h2 class="card-title">${T('Постоянные клиенты','Loyal clients')}</h2><p class="card-sub">${T('Больше всего потратили за год - им стоит предложить абонемент','Highest spend this year - good candidates for a membership')}</p></div></div>
  <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${T('Клиент','Client')}</th><th class="num">${T('Визитов','Visits')}</th><th class="hide-sm">${T('Любимая услуга','Favourite service')}</th><th class="num hide-sm">${T('Последний визит','Last visit')}</th><th class="num">${T('Потратил','Spent')}</th></tr></thead>
  <tbody>${topC.map(([id,c])=>{const fav=Object.entries(c.svc).sort((a,b)=>b[1]-a[1])[0][0];const cl=cliById[id];return`<tr><td>${esc(L(cl))}<small>${esc(L(distById[cl.district]))} · ${esc(L(chById[cl.channel]))}</small></td><td class="num">${num(c.n)}</td><td class="hide-sm">${esc(L(svcById[fav]))}</td><td class="num hide-sm">${dt(c.last)}</td><td class="num">${money(c.rev)}</td></tr>`;}).join('')}</tbody></table></div></section>`;}

function buckets_(days,group){const [f]=range(days);const labels=[],buckets=[],titles=[];
 if(group==='day'){for(let t=f;t<=TODAY;t+=DAY){buckets.push([t,t]);labels.push(dt(t));titles.push(dt(t,{weekday:'short',day:'numeric',month:'long'}));}}
 else if(group==='week'){for(let e=TODAY;e>=f;e-=7*DAY){const s=Math.max(f,e-6*DAY);buckets.unshift([s,e]);labels.unshift(dt(s));titles.unshift(dt(s)+' - '+dt(e));}}
 else{let d=new Date(f);d.setDate(1);while(d.getTime()<=TODAY){const s=Math.max(f,d.getTime()),e=Math.min(TODAY,new Date(d.getFullYear(),d.getMonth()+1,0).getTime());buckets.push([s,e]);labels.push(d.toLocaleDateString(state.lang==='ru'?'ru-RU':'en-GB',{month:'short'}).replace('.',''));titles.push(d.toLocaleDateString(state.lang==='ru'?'ru-RU':'en-GB',{month:'long',year:'numeric'}));d.setMonth(d.getMonth()+1);}}
 return{labels,buckets,titles};}
const METRICS=[
 {id:'revenue',ru:'Выручка',en:'Revenue',icon:'wallet',calc:a=>sum(a.filter(done),b=>b.price),fmt:v=>money(v,true),fmtFull:v=>money(v)},
 {id:'visits',ru:'Визиты',en:'Visits',icon:'calendar',calc:a=>a.filter(done).length,fmt:num,fmtFull:num},
 {id:'avg',ru:'Средний чек',en:'Avg ticket',icon:'sparkle',calc:a=>{const d=a.filter(done);return d.length?sum(d,b=>b.price)/d.length:0},fmt:v=>money(v),fmtFull:v=>money(v),ratio:true},
 {id:'newc',ru:'Новые клиенты',en:'New clients',icon:'people',calc:a=>a.filter(b=>done(b)&&isNew(b)).length,fmt:num,fmtFull:num},
 {id:'repeat',ru:'Повторные визиты',en:'Returning share',icon:'repeat',calc:a=>{const d=a.filter(done);return d.length?d.filter(b=>!isNew(b)).length/d.length*100:0},fmt:v=>pct(v,1),fmtFull:v=>pct(v,1),ratio:true},
 {id:'noshow',ru:'Неявки',en:'No-shows',icon:'alert',calc:a=>a.filter(b=>b.status==='noshow').length,fmt:num,fmtFull:num,inverse:true}
];
function pageReports(){
 const r=range(state.period),pr=range(state.period,1);const ch=state.repChannel;const flt=b=>ch==='all'||b.channel===ch;
 const cur=all().filter(b=>inR(b,r)&&flt(b)),prev=all().filter(b=>inR(b,pr)&&flt(b));
 const g=state.period===365?(state.group==='day'?'week':state.group):state.group;
 const {buckets}=buckets_(state.period,'day');const sparkB=[];const step=Math.max(1,Math.floor(buckets.length/20));for(let i=0;i<buckets.length;i+=step)sparkB.push([buckets[i][0],(buckets[i+step-1]||buckets[buckets.length-1])[1]]);
 const M=METRICS.find(m=>m.id===state.metric);
 chartJobs.push(()=>{const el=$('#repChart');if(!el)return;const bk=buckets_(state.period,g);const off=state.period*DAY;
  const data=bk.buckets.map(([f,t])=>M.calc(cur.filter(b=>b.t>=f&&b.t<=t)));const prevD=bk.buckets.map(([f,t])=>M.calc(prev.filter(b=>b.t>=f-off&&b.t<=t-off)));
  const series=[{name:T('Текущий период','This period'),data,color:'var(--fern-2)',area:true}];if(state.compare)series.push({name:T('Прошлый период','Previous period'),data:prevD,color:'var(--ink-2)',dash:true});
  lineChart(el,{labels:bk.labels,series,fmt:M.fmtFull,fmtAxis:M.fmt,tipTitle:i=>bk.titles[i],aria:L(M)});});
 return`
 <div class="page-head"><div><p>${T('Соберите отчёт из своих цифр: показатель, канал и период','Build a report from your numbers: metric, channel and period')}</p><h1>${T('Отчёты','Reports')}</h1></div><div class="head-actions">${periodSeg([30,90,365])}<button class="btn btn-primary" data-act="csv" data-v="report">${ico('download',16)}${T('Скачать CSV','Download CSV')}</button></div></div>
 <div class="grid g-6">${METRICS.map(m=>{const v=m.calc(cur),p=m.calc(prev);const sd=sparkB.map(([f,t])=>m.calc(cur.filter(b=>b.t>=f&&b.t<=t)));return`<button class="card kpi" data-act="metric" data-v="${m.id}" aria-pressed="${state.metric===m.id}"><div class="kpi-top"><span class="kpi-label">${esc(L(m))}</span></div><div class="kpi-value">${m.fmt(v)}</div><div class="kpi-foot">${delta(v,p,m.inverse)}${spark(sd,m.inverse?'var(--rose)':'var(--fern-2)')}</div></button>`;}).join('')}</div>
 <section class="card mt"><div class="card-head"><div><h2 class="card-title">${esc(L(M))}</h2><p class="card-sub">${T('Наведите на график, чтобы сравнить с прошлым периодом','Hover the chart to compare with the previous period')}</p></div>
  <div class="head-actions"><div class="seg">${[['day',T('Дни','Days')],['week',T('Недели','Weeks')],['month',T('Месяцы','Months')]].map(([v,l])=>`<button data-act="group" data-v="${v}" aria-pressed="${g===v}" ${state.period===365&&v==='day'?'disabled':''}>${l}</button>`).join('')}</div>
  <button class="toggle" data-act="compare" aria-pressed="${state.compare}"><span class="sw"></span>${T('Сравнить','Compare')}</button></div></div>
  <div class="chips" style="margin-bottom:10px"><button class="chip" data-act="repch" data-v="all" aria-pressed="${ch==='all'}">${T('Все каналы','All channels')}</button>${D.channels.map(c=>`<button class="chip" data-act="repch" data-v="${c.id}" aria-pressed="${ch===c.id}"><i style="background:${c.color}"></i>${esc(L(c))}</button>`).join('')}</div>
  <div class="chart" id="repChart"></div></section>`;}

/* ---------- modals ---------- */
function modalService(id){const s=svcById[id],st=serviceStats(30)[id],st90=serviceStats(90)[id];const weeks=[...Array(12)].map((_,i)=>{const e=TODAY-(11-i)*7*DAY,f=e-6*DAY;return all().filter(b=>b.service===id&&b.t>=f&&b.t<=e&&b.status!=='cancelled').length;});
 const ms=D.masters.filter(m=>m.cats.includes(s.cat));
 chartJobs.push(()=>{const el=$('#svcWeeks');if(!el)return;barChart(el,{labels:weeks.map((_,i)=>dt(TODAY-(11-i)*7*DAY-6*DAY)),h:180,highlight:11,series:[{name:T('Записей','Bookings'),data:weeks,color:catColor[s.cat]}],fmt:v=>num(v),fmtAxis:v=>num(v),tipTitle:i=>T('Неделя с ','Week of ')+dt(TODAY-(11-i)*7*DAY-6*DAY)});});
 return`<div class="modal-head"><h3>${esc(L(s))}</h3><button class="icon-btn" data-act="close" aria-label="${T('Закрыть','Close')}">${ico('x',18)}</button></div>
 <div class="modal-body"><div class="svc-detail"><div class="svc-art">${art(s,'m'+(artUid++))}</div><div>
  <span class="svc-cat" style="background:${catSoft[s.cat]};color:${catColor[s.cat]}">${esc(L(catById[s.cat]))}</span>
  <div class="facts"><div class="fact"><small>${T('Цена','Price')}</small><b>${money(s.price)}</b></div><div class="fact"><small>${T('Длительность','Duration')}</small><b>${s.min} ${T('мин','min')}</b></div><div class="fact"><small>${T('Записей за 30 дней','Bookings, 30 days')}</small><b>${num(st.n)}</b></div><div class="fact"><small>${T('Выручка за 30 дней','Revenue, 30 days')}</small><b>${money(st.rev,true)}</b></div><div class="fact"><small>${T('Повторные клиенты','Returning clients')}</small><b>${pct(st90.n?st90.repeat/st90.n*100:0)}</b></div><div class="fact"><small>${T('Загрузка','Load')}</small><b>${st.load}%</b></div></div>
  <p class="card-sub">${T('Мастера','Team')}: ${ms.map(m=>esc(L(m))).join(', ')}</p></div></div>
  <h4 style="margin:18px 0 4px;font-size:14px">${T('Записи по неделям','Bookings per week')}</h4><div class="chart" id="svcWeeks" style="min-height:180px"></div>
  <div class="form-actions"><button class="btn" data-act="close">${T('Закрыть','Close')}</button><button class="btn btn-primary" data-act="new" data-v="${id}">${ico('plus',16)}${T('Записать на услугу','Book this service')}</button></div></div>`;}
function modalNew(pre){const s0=pre||D.services[0].id;const d0=new Date(TODAY+DAY);const iso=`${d0.getFullYear()}-${String(d0.getMonth()+1).padStart(2,'0')}-${String(d0.getDate()).padStart(2,'0')}`;
 return`<div class="modal-head"><h3>${T('Новая запись','New booking')}</h3><button class="icon-btn" data-act="close" aria-label="${T('Закрыть','Close')}">${ico('x',18)}</button></div>
 <form class="modal-body" id="newForm"><div class="form">
  <label class="full">${T('Имя клиента','Client name')}<input name="name" required maxlength="40" placeholder="${T('Например, Мария К.','e.g. Maria K.')}"></label>
  <label>${T('Услуга','Service')}<select name="service" id="nfService">${D.categories.map(c=>`<optgroup label="${esc(L(c))}">${D.services.filter(s=>s.cat===c.id).map(s=>`<option value="${s.id}" ${s.id===s0?'selected':''}>${esc(L(s))} · ${money(s.price)}</option>`).join('')}</optgroup>`).join('')}</select></label>
  <label>${T('Мастер','Stylist')}<select name="master" id="nfMaster"></select></label>
  <label>${T('Дата','Date')}<input type="date" name="date" value="${iso}" required></label>
  <label>${T('Время','Time')}<select name="time">${[...Array(24)].map((_,i)=>{const h=9+Math.floor(i/2),m=i%2?30:0;return`<option>${String(h).padStart(2,'0')}:${m?'30':'00'}</option>`}).join('')}</select></label>
 </div><p class="card-sub" style="margin-top:12px">${T('Это демо: запись сохранится только в вашем браузере и сразу появится в журнале.','Demo only: the booking is saved in this browser and shows up in the log right away.')}</p>
 <div class="form-actions"><button type="button" class="btn" data-act="close">${T('Отмена','Cancel')}</button><button type="submit" class="btn btn-primary">${T('Сохранить запись','Save booking')}</button></div></form>`;}
function fillMasters(){const sel=$('#nfMaster'),sv=$('#nfService');if(!sel||!sv)return;const s=svcById[sv.value];sel.innerHTML=D.masters.filter(m=>m.cats.includes(s.cat)).map(m=>`<option value="${m.id}">${esc(L(m))}</option>`).join('');}

/* ---------- shell ---------- */
function alerts(){const st=serviceStats(30),low=lowServices(st);const pend=all().filter(b=>b.status==='pending'&&b.t<=TODAY+DAY).length;const ns=all().filter(b=>b.status==='noshow'&&b.t>=TODAY-7*DAY).length;
 return[{c:'var(--honey)',t:T(`${pend} записей на сегодня и завтра ждут подтверждения`,`${pend} bookings for today and tomorrow need confirming`),go:'bookings'},{c:'var(--rose)',t:T(`${ns} неявок за неделю - стоит напоминать за день SMS-кой`,`${ns} no-shows this week - consider a reminder text the day before`),go:'bookings'},{c:'var(--sky)',t:T(`Мало записей: ${low.map(s=>L(s)).join(', ')}`,`Underbooked: ${low.map(s=>L(s)).join(', ')}`),go:'services'}];}
function render(){
 chartJobs.length=0;artUid=0;document.documentElement.lang=state.lang;document.body.classList.toggle('dark',state.theme==='dark');
 const al=alerts();const page={overview:pageOverview,services:pageServices,bookings:pageBookings,masters:pageMasters,clients:pageClients,reports:pageReports}[state.page]();
 const pendingCount=all().filter(b=>b.status==='pending'&&b.t>=TODAY&&b.t<=TODAY+DAY).length;
 $('#app').innerHTML=`<div class="shell">
 <aside class="rail" aria-label="${T('Разделы','Sections')}"><span class="logo">${ico('leaf',22)}</span>
  <div class="theme-switch" role="group" aria-label="${T('Тема','Theme')}"><button data-act="theme" data-v="light" aria-pressed="${state.theme==='light'}" aria-label="${T('Светлая тема','Light theme')}">${ico('sun',16)}</button><button data-act="theme" data-v="dark" aria-pressed="${state.theme==='dark'}" aria-label="${T('Тёмная тема','Dark theme')}">${ico('moon',16)}</button></div>
  <nav class="rail-nav">${PAGES.map(p=>`<button class="rail-btn" data-act="go" data-v="${p.id}" ${state.page===p.id?'aria-current="page"':''} aria-label="${esc(L(p))}">${ico(p.icon)}${p.id==='bookings'&&pendingCount?`<span class="dot">${pendingCount}</span>`:''}${p.id==='services'?`<span class="dot">${lowServices(serviceStats(30)).length}</span>`:''}<span class="tip">${esc(L(p))}</span></button>`).join('')}</nav>
 </aside>
 <div class="main">
  <header class="topbar"><div class="brand"><b>Mira</b><span>${T('студия красоты','beauty studio')}</span></div>
   <nav class="pills" aria-label="${T('Разделы','Sections')}">${PAGES.map(p=>`<button class="pill" data-act="go" data-v="${p.id}" ${state.page===p.id?'aria-current="page"':''}>${esc(L(p))}</button>`).join('')}</nav>
   <div class="top-actions">
    <label class="search">${ico('search',16)}<input id="globalSearch" placeholder="${T('Поиск','Search')}" aria-label="${T('Поиск по услугам и записям','Search services and bookings')}"><kbd>⌘K</kbd></label>
    <button class="icon-btn" data-act="lang" aria-label="${T('Switch to English','Переключить на русский')}">${state.lang==='ru'?'EN':'RU'}</button>
    <button class="icon-btn" data-act="cur" aria-label="${T('Валюта','Currency')}">${state.cur==='RUB'?'$':'₽'}</button>
    <div style="position:relative"><button class="icon-btn" data-act="bell" aria-expanded="${state.popover}" aria-label="${T('Уведомления','Notifications')}">${ico('bell',18)}<span class="dot">${al.length}</span></button>
     ${state.popover?`<div class="pop" role="dialog"><h4>${T('Что требует внимания','Needs your attention')}</h4>${al.map(a=>`<button class="pop-item" style="border:0;background:none;width:100%;text-align:left" data-act="go" data-v="${a.go}"><i style="background:${a.c}"></i><span>${esc(a.t)}</span></button>`).join('')}</div>`:''}</div>
    <button class="btn btn-primary" data-act="new">${ico('plus',16)}<span>${T('Запись','Booking')}</span></button>
    <span class="user"><span class="avatar" style="background:var(--fern)">${T('АС','ES')}</span><span class="u-text"><small>${T('Управляющая','Studio manager')}</small><b>${T('Анна Соколова','Emma Sullivan')}</b></span></span>
   </div></header>
  <main class="content" id="main">${page}<p class="foot">${T('Демонстрационный дашборд «Сайты и Аналитика». Студия, клиенты и цифры вымышлены','Websites & Analytics demo dashboard. The studio, clients and numbers are fictional')} · ${T('курс','rate')} $1 = ${D.usdRate} ₽</p></main>
 </div></div>
 ${state.modal?`<div class="overlay" data-act="overlay"><div class="modal" role="dialog" aria-modal="true">${state.modal.type==='svc'?modalService(state.modal.id):modalNew(state.modal.id)}</div></div>`:''}`;
 drawCharts();fillMasters();
 const nf=$('#newForm');if(nf){$('#nfService').addEventListener('change',fillMasters);nf.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(nf);const name=String(f.get('name')).trim()||T('Клиент','Client');const [y,mo,d]=String(f.get('date')).split('-').map(Number);const t=new Date(y,mo-1,d).getTime();const [h,mi]=String(f.get('time')).split(':').map(Number);const s=svcById[f.get('service')];
  const cid='x'+Date.now();D.clients.push({id:cid,ru:name,en:name,district:'d7',channel:'online',since:t});cliById[cid]=D.clients[D.clients.length-1];
  const b={id:'N'+String(Date.now()).slice(-5),t,hour:h,minute:mi,service:s.id,master:String(f.get('master')),client:cid,channel:'online',status:t<TODAY?'done':'confirmed',price:s.price};extra.push(b);store.set('extra',extra.slice(-30));computeFirst();
  state.modal=null;state.page='bookings';state.status=t>=TODAY?'upcoming':'all';state.search='';render();toast(T('Запись сохранена','Booking saved'));});setTimeout(()=>$('input[name=name]',nf).focus(),30);}
 const ss=$('#svcSearch');if(ss)ss.addEventListener('input',debounce(e=>{state.search=e.target.value;render();const n=$('#svcSearch');n.focus();n.setSelectionRange(n.value.length,n.value.length);},220));
 const bs=$('#bkSearch');if(bs)bs.addEventListener('input',debounce(e=>{state.search=e.target.value;state.journalLimit=12;render();const n=$('#bkSearch');n.focus();n.setSelectionRange(n.value.length,n.value.length);},220));
 const gs=$('#globalSearch');gs.addEventListener('keydown',e=>{if(e.key==='Enter'&&gs.value.trim()){const v=gs.value.trim().toLowerCase();const svcHit=D.services.some(s=>L(s).toLowerCase().includes(v));state.search=gs.value.trim();state.page=svcHit?'services':'bookings';state.category='all';state.status='all';render();}});
}
function drawCharts(){chartJobs.forEach(f=>{try{f()}catch(e){console.error(e)}});}
function debounce(f,ms){let t;return e=>{clearTimeout(t);t=setTimeout(()=>f(e),ms);};}
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200);}
function csv(kind){let rows=[];if(kind==='services'){const st=serviceStats(30);rows=[['service','category','price_rub','minutes','bookings_30d','revenue_30d_rub','load_pct']].concat(D.services.map(s=>[L(s),L(catById[s.cat]),s.price,s.min,st[s.id].n,st[s.id].rev,st[s.id].load]));}
 else if(kind==='clients'){const r=range(state.period);rows=[['date','client','district','channel','service','amount_rub']].concat(all().filter(b=>inR(b,r)&&done(b)).map(b=>[new Date(b.t).toISOString().slice(0,10),L(cliById[b.client]),L(distById[cliById[b.client].district]),L(chById[b.channel]),L(svcById[b.service]),b.price]));}
 else{const r=range(state.period);rows=[['id','date','time','client','service','stylist','channel','status','amount_rub']].concat(all().filter(b=>inR(b,r)).map(b=>[b.id,new Date(b.t).toISOString().slice(0,10),hm(b),L(cliById[b.client]),L(svcById[b.service]),L(mstById[b.master]),L(chById[b.channel]),b.status,b.price]));}
 const text='﻿'+rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));a.download=`mira-${kind}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}

document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');
 if(!el){if(state.popover){state.popover=false;render();}return;}
 const a=el.dataset.act,v=el.dataset.v;
 if(a==='overlay'&&e.target!==el)return;
 const keepPop=a==='bell';if(!keepPop)state.popover=false;
 switch(a){
  case'go':state.page=v;state.search='';state.journalLimit=12;window.scrollTo(0,0);break;
  case'theme':state.theme=v;store.set('theme',v);break;
  case'lang':state.lang=state.lang==='ru'?'en':'ru';store.set('lang',state.lang);break;
  case'cur':state.cur=state.cur==='RUB'?'USD':'RUB';store.set('cur',state.cur);break;
  case'bell':state.popover=!state.popover;break;
  case'period':state.period=+v;state.journalLimit=12;if(+v===365&&state.group==='day')state.group='week';break;
  case'cat':state.category=v;break;
  case'lowonly':state.lowOnly=!state.lowOnly;break;
  case'lowgo':state.page='services';state.lowOnly=true;state.category='all';break;
  case'resetsvc':state.category='all';state.lowOnly=false;state.search='';break;
  case'svc':state.modal={type:'svc',id:v};break;
  case'new':state.modal={type:'new',id:v||null};break;
  case'close':case'overlay':state.modal=null;break;
  case'status':state.status=v;state.journalLimit=12;break;
  case'more':state.journalLimit+=12;break;
  case'master':state.master=v;break;
  case'ch':state.channels[v]=!state.channels[v];break;
  case'metric':state.metric=v;break;
  case'group':state.group=v;break;
  case'compare':state.compare=!state.compare;break;
  case'repch':state.repChannel=v;break;
  case'barmode':state.barMode=v;break;
  case'csv':csv(v);return;
  default:return;}
 render();});
document.addEventListener('change',e=>{if(e.target.matches('select[data-act="sort"]')){state.sort=e.target.value;render();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(state.modal||state.popover)){state.modal=null;state.popover=false;render();}
 if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){const g=$('#globalSearch');if(g&&g.offsetParent){e.preventDefault();g.focus();}}
 if(e.key==='Enter'&&e.target.matches('.kpi[data-act="lowgo"]')){state.page='services';state.lowOnly=true;render();}});
let lastW=window.innerWidth;window.addEventListener('resize',debounce(()=>{if(Math.abs(window.innerWidth-lastW)>8){lastW=window.innerWidth;drawCharts();}},150));
render();
})();
