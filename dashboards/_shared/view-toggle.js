/* «3D / Обычный» switch for the 3D demo dashboards.
   The choice is remembered for all 3D dashboards (localStorage 'dashView').
   Page config, set before this script:
     window.VIEW_TOGGLE = { flat(){...}, full(){...} }          — same page, two views
     window.VIEW_TOGGLE = { page:'3d'|'flat', other:'../x/' }    — two separate pages */
(function(){
  var cfg=window.VIEW_TOGGLE||{};var KEY='dashView';
  var en=document.documentElement.lang==='en';
  function get(){try{return localStorage.getItem(KEY)==='flat'?'flat':'3d'}catch(e){return '3d'}}
  function put(v){try{localStorage.setItem(KEY,v)}catch(e){}}
  var st=document.createElement('style');
  st.textContent=
   '.vt{position:fixed;right:16px;bottom:16px;z-index:40;display:flex;gap:2px;padding:4px;border-radius:999px;background:rgba(255,255,255,.92);border:1px solid rgba(20,24,40,.1);box-shadow:0 12px 30px -14px rgba(20,24,40,.45);font:650 12.5px/1 system-ui,-apple-system,"Segoe UI",sans-serif;backdrop-filter:blur(10px)}'+
   '.vt button{border:0;background:transparent;color:#5b5f69;border-radius:999px;padding:8px 13px;cursor:pointer;font:inherit;transition:background .18s,color .18s}'+
   '.vt button.on{background:#17191e;color:#fff}.vt button:active{transform:scale(.97)}'+
   '@media(hover:hover) and (pointer:fine){.vt button:not(.on):hover{color:#17191e}}'+
   '@media(max-width:700px){.vt{right:10px;bottom:74px}body.flat .vt{bottom:12px}}'+
   'body.flat #world,body.flat .label,body.flat .dock,body.flat .hint,body.flat #tags,body.flat .tag,body.flat #labels{display:none!important}'+
   'body.flat .panel{opacity:1!important;pointer-events:auto!important;background:var(--bg,#f4f4f2)!important;backdrop-filter:none!important}'+
   'body.flat .sheet{transform:none!important;box-shadow:none!important}'+
   'body.flat .panel .back,body.flat .panel #close{display:none!important}'+
   '@media(max-width:700px){body.flat .sheet{padding-bottom:120px}}';
  document.head.appendChild(st);
  var cur=cfg.page||get();
  var box=document.createElement('div');box.className='vt';box.setAttribute('role','group');box.setAttribute('aria-label',en?'View':'Вид');
  box.innerHTML='<button type="button" data-v="3d">3D</button><button type="button" data-v="flat">'+(en?'Standard':'Обычный')+'</button>';
  function paint(){[].forEach.call(box.children,function(b){var on=b.getAttribute('data-v')===cur;b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))})}
  function apply(v,first){
    cur=v;paint();
    if(cfg.page){if(v!==cfg.page&&!first){put(v);location.href=cfg.other+location.search}return}
    if(v==='flat'){document.body.classList.add('flat');cfg.flat&&cfg.flat()}
    else if(!first){document.body.classList.remove('flat');cfg.full&&cfg.full()}
  }
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var v=b.getAttribute('data-v');if(v===cur)return;if(!cfg.page)put(v);apply(v,false)});
  document.body.appendChild(box);
  if(cfg.page){if(cfg.page==='3d'&&get()==='flat'&&!window.IS_BOT){location.replace(cfg.other+location.search);return}paint();return}
  apply(cur,true);
})();
