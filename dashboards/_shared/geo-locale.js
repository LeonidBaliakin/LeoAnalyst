/* Language and currency come only from the visitor's IP country:
   RU / BY -> Russian + roubles, any other country -> English + dollars.
   There is no manual switch. Runs before each dashboard's app.js. */
(function(){
  var KEY='geoLocale';
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
  var known=get(),used=known||browser();
  apply(used);
  // hide every language / currency switch
  var st=document.createElement('style');
  st.textContent='[data-act="lang"],[data-act="cur"],[data-action="lang"],[data-action="currency"],[data-lang],[data-currency]{display:none!important}';
  document.head.appendChild(st);
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
