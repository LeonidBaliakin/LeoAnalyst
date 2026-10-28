/* Language and currency for people come only from the visitor's IP country:
   RU / BY -> Russian + roubles, any other country -> English + dollars.
   There is no manual switch. Runs before each dashboard's app.js.

   Search engines are different: every page has two addresses,
   /page/ (Russian) and /page/?lang=en (English). Crawlers get the language
   of the address they asked for, so Yandex and Google index each version
   with matching text, title and description. */
(function(){
  var KEY='geoLocale';
  var ORIGIN='https://analyticsbuild.com';
  var PAGE_LANG=/[?&]lang=en(&|$)/.test(location.search)?'en':'ru';
  var IS_BOT=/bot|crawl|spider|slurp|yandex|bingpreview|lighthouse|pagespeed|google-inspectiontool|googleother|facebookexternalhit|telegrambot|vkshare/i.test(navigator.userAgent||'');
  window.PAGE_LANG=PAGE_LANG;window.IS_BOT=IS_BOT;

  function get(){try{var v=localStorage.getItem(KEY);return v==='ru'||v==='en'?v:null}catch(e){return null}}
  function browser(){return /^(ru|be)(-|$)/i.test(navigator.language||'')?'ru':'en'}
  function apply(loc){
    var cur=loc==='ru'?'RUB':'USD';
    try{
      localStorage.setItem('pulse_lang',loc);localStorage.setItem('pulse_currency',cur);
      localStorage.setItem('leoFinance_language',JSON.stringify(loc));localStorage.setItem('leoFinance_currency',JSON.stringify(cur));
      localStorage.setItem('mira_lang',JSON.stringify(loc));localStorage.setItem('mira_cur',JSON.stringify(cur));
      localStorage.setItem('ritm_lang',JSON.stringify(loc));
      localStorage.setItem('mag_lang',JSON.stringify(loc));
    }catch(e){}
    document.documentElement.lang=loc;
  }

  /* ---- search tags: canonical, title, description, og:locale ---- */
  var path=location.pathname;
  var canonical=ORIGIN+path+(PAGE_LANG==='en'?'?lang=en':'');
  function setLink(rel,href){var l=document.querySelector('link[rel="'+rel+'"]:not([hreflang])');if(!l){l=document.createElement('link');l.rel=rel;document.head.appendChild(l)}l.href=href}
  function setMeta(attr,name,val){var m=document.querySelector('meta['+attr+'="'+name+'"]');if(!m){m=document.createElement('meta');m.setAttribute(attr,name);document.head.appendChild(m)}m.setAttribute('content',val)}
  setLink('canonical',canonical);
  function seoText(){
    var lang=document.documentElement.lang==='en'?'en':'ru';
    setMeta('property','og:url',canonical);
    setMeta('property','og:locale',lang==='en'?'en_US':'ru_RU');
    var box=document.getElementById('seo-i18n');if(!box)return;
    var t;try{t=JSON.parse(box.textContent)[lang]}catch(e){return}
    if(!t)return;
    document.title=t.title;
    setMeta('name','description',t.description);
    setMeta('property','og:title',t.title);
    setMeta('property','og:description',t.description);
  }
  window.applySeoText=seoText;

  var used;
  if(IS_BOT){used=PAGE_LANG}else{used=get()||browser()}
  apply(used);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',seoText);else seoText();

  // hide every language / currency switch
  var st=document.createElement('style');
  st.textContent='[data-act="lang"],[data-act="cur"],[data-action="lang"],[data-action="currency"],[data-lang],[data-currency]{display:none!important}';
  document.head.appendChild(st);

  /* ---- Yandex Metrica, only after cookie consent (same rule as Google Analytics) ---- */
  var YM_ID=113847848; /* Yandex Metrica counter */
  try{if(YM_ID&&!IS_BOT&&window.self===window.top&&localStorage.getItem('cookieConsent')==='accepted'){
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
    ym(YM_ID,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
  }}catch(e){}

  if(IS_BOT)return;
  // confirm by IP; if the country says otherwise, store it and reload once
  function done(country){
    if(!/^[A-Z]{2}$/.test(country||''))return;
    var loc=(country==='RU'||country==='BY')?'ru':'en';
    try{localStorage.setItem(KEY,loc)}catch(e){}
    if(loc!==used){apply(loc);location.reload()}
  }
  function fetchJSON(url){return fetch(url,{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()})}
  if(!window.fetch)return;
  fetchJSON('https://ipwho.is/?fields=success,country_code').then(function(d){if(d.success===false)throw 0;done(d.country_code)})
    .catch(function(){return fetchJSON('https://ipapi.co/json/').then(function(d){done(d.country_code)})}).catch(function(){});
})();
