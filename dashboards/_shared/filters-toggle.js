/* LeoAnalyst · collapsible filter panels for demo dashboards.
   Usage: <script src="../_shared/filters-toggle.js" data-target=".filterbar"></script>
   Works with apps that re-render their markup: a MutationObserver re-attaches the toggle. */
(function(){
 const me=document.currentScript,SEL=me&&me.dataset.target||'.filterbar';
 const KEY='ft_open_'+location.pathname;
 const read=()=>{try{const v=localStorage.getItem(KEY);return v==null?null:v==='1'}catch(_){return null}};
 const write=v=>{try{localStorage.setItem(KEY,v?'1':'0')}catch(_){}};
 const isRu=()=>(document.documentElement.lang||'ru').toLowerCase().startsWith('ru');
 const defaults=new WeakMap();let baseline=null;
 const css=`.ft-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 12px}
 .ft-btn{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px 0 12px;border-radius:999px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);background:color-mix(in srgb,currentColor 4%,transparent);font:inherit;font-size:13px;font-weight:700;color:inherit;cursor:pointer}
 .ft-btn:hover{background:color-mix(in srgb,currentColor 8%,transparent)}
 .ft-btn svg{width:16px;height:16px}
 .ft-btn .ft-chev{transition:transform .18s}
 .ft-btn[aria-expanded="true"] .ft-chev{transform:rotate(180deg)}
 .ft-count{min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:currentColor;display:inline-grid;place-items:center}
 .ft-count b{color:var(--surface,#fff);font-size:11px;line-height:1;filter:invert(0)}
 .ft-sum{flex:1;min-width:0;font-size:12.5px;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .ft-hidden{display:none!important}
 .ft-btn[aria-expanded="true"]+.ft-sum{display:none}
 @media(max-width:600px){.ft-sum{flex-basis:100%;order:3;white-space:normal}}`;
 const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 function controls(box){return[...box.querySelectorAll('select')];}
 function selText(s){const o=s.options[s.selectedIndex];return o?o.text.trim():'';}
 function labelFor(s,box){const g=s.closest('label,.filter-group');let t=g?(g.querySelector('.filter-label,span,small')||{}).textContent:'';if(!t&&s.getAttribute('aria-label'))t=s.getAttribute('aria-label');return(t||'').trim();}
 function summary(box){const sels=controls(box);if(!baseline)baseline=sels.map(s=>s.value);
  const active=sels.filter((s,i)=>baseline[i]!==undefined&&s.value!==baseline[i]);
  const chips=box.querySelectorAll('[aria-pressed="true"],button.active');const chipTxt=[...chips].map(c=>c.textContent.trim()).filter(Boolean);
  const first=sels[0]?selText(sels[0]):'';
  const parts=[];if(chipTxt.length)parts.push(chipTxt.join(', '));else if(first&&!active.includes(sels[0]))parts.push(first);
  active.forEach(s=>{const l=labelFor(s,box);parts.push((l?l+': ':'')+selText(s));});
  if(!active.length)parts.push(isRu()?'все сегменты':'all segments');
  return{n:active.length,text:parts.join(' · ')};}
 function enhance(){const box=document.querySelector(SEL);if(!box||box.dataset.ft)return;box.dataset.ft='1';
  let open=read();if(open===null)open=window.innerWidth>900;
  const id='ft-panel';box.id=box.id||id;
  const bar=document.createElement('div');bar.className='ft-bar';
  const s=summary(box),ru=isRu();
  bar.innerHTML=`<button type="button" class="ft-btn" aria-expanded="${open}" aria-controls="${box.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>${ru?'Фильтры':'Filters'}${s.n?`<span class="ft-count"><b>${s.n}</b></span>`:''}<svg class="ft-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><span class="ft-sum">${s.text.replace(/[<>&]/g,'')}</span>`;
  box.parentNode.insertBefore(bar,box);
  if(!open)box.classList.add('ft-hidden');
  bar.querySelector('.ft-btn').addEventListener('click',e=>{const nowOpen=box.classList.toggle('ft-hidden')===false;const sum=bar.querySelector('.ft-sum');if(sum)sum.textContent=summary(box).text;e.currentTarget.setAttribute('aria-expanded',nowOpen);write(nowOpen);if(nowOpen){const f=box.querySelector('select,button,input');f&&f.focus({preventScroll:true});}});
 }
 let q=false;new MutationObserver(()=>{if(q)return;q=true;queueMicrotask(()=>{q=false;enhance();});}).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('DOMContentLoaded',enhance);enhance();
})();
