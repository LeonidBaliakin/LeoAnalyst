/* Service pages: language swap, analytics after consent, small cookie notice.
   The Russian text is in the HTML (what Yandex indexes); the English text lives in
   <template id="page-en"> and replaces it when the page language is English. */
(function(){
  var en=document.documentElement.lang==='en';
  if(en){
    var tpl=document.getElementById('page-en'),main=document.getElementById('page');
    if(tpl&&main){main.replaceWith(tpl.content.cloneNode(true))}
  }
  var withLang=function(href){if(window.PAGE_LANG!=='en')return href;var h='',i=href.indexOf('#');if(i>-1){h=href.slice(i);href=href.slice(0,i)}return href+(href.indexOf('?')>-1?'&':'?')+'lang=en'+h};
  if(en)document.querySelectorAll('[data-en]').forEach(function(el){el.textContent=el.getAttribute('data-en')});
  document.querySelectorAll('[data-home]').forEach(function(a){a.setAttribute('href',withLang(a.getAttribute('href')))});

  /* Google Analytics after consent (Yandex Metrica is started by geo-locale.js) */
  function loadGA(){
    if(window.__gaLoaded||window.IS_BOT)return;window.__gaLoaded=true;
    window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};
    gtag('js',new Date());gtag('config','G-RD7CLDCHGF');
    var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-RD7CLDCHGF';document.head.appendChild(s);
  }
  var v=null;try{v=localStorage.getItem('cookieConsent')}catch(e){}
  if(v==='accepted'){loadGA();return}
  if(v==='declined'||window.IS_BOT)return;
  var bar=document.createElement('div');bar.className='cookie';bar.setAttribute('role','region');bar.setAttribute('aria-label','Cookie');
  bar.innerHTML=en
    ?'<p>This site uses cookies, Yandex Metrica and Google Analytics to count visits. <a href="'+withLang('/privacy/')+'">Privacy policy</a></p><div><button type="button" data-c="accepted">Accept</button><button type="button" data-c="declined">Decline</button></div>'
    :'<p>Сайт использует cookie, Яндекс Метрику и Google Analytics, чтобы считать посещения. <a href="/privacy/">Политика конфиденциальности</a></p><div><button type="button" data-c="accepted">Принять</button><button type="button" data-c="declined">Отклонить</button></div>';
  var st=document.createElement('style');
  st.textContent='.cookie{position:fixed;z-index:60;left:16px;bottom:16px;width:min(400px,calc(100% - 32px));background:#fff;border:1px solid #e3e5ea;border-radius:20px;padding:14px 16px;box-shadow:0 20px 50px -20px rgba(20,24,40,.35);font-size:13px;line-height:1.5;color:#4f5560}.cookie p{margin:0 0 10px}.cookie a{color:#1a74de}.cookie div{display:flex;gap:8px}.cookie button{flex:0 0 auto;border:1px solid #d8dbe3;background:#fff;border-radius:999px;padding:8px 16px;font:700 13px/1 inherit;cursor:pointer}.cookie button:first-child{background:#17191e;border-color:#17191e;color:#fff}';
  document.head.appendChild(st);document.body.appendChild(bar);
  bar.addEventListener('click',function(e){var c=e.target.getAttribute&&e.target.getAttribute('data-c');if(!c)return;try{localStorage.setItem('cookieConsent',c)}catch(_){}bar.remove();if(c==='accepted'){loadGA();location.reload()}});
})();
