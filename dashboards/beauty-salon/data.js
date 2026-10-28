/* LeoAnalyst · Beauty Studio demo — synthetic, reproducible data (no real people or companies) */
(function(){
  function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  const R=rng(20261023);
  const pick=(arr,w)=>{const total=w.reduce((a,b)=>a+b,0);let x=R()*total;for(let i=0;i<arr.length;i++){x-=w[i];if(x<=0)return arr[i];}return arr[arr.length-1];};

  const categories=[
    {id:'hair',ru:'Волосы',en:'Hair',w:34},
    {id:'nails',ru:'Ногти',en:'Nails',w:28},
    {id:'face',ru:'Лицо',en:'Face',w:14},
    {id:'brows',ru:'Брови и ресницы',en:'Brows & lashes',w:14},
    {id:'body',ru:'Массаж и SPA',en:'Massage & SPA',w:10}
  ];
  const services=[
    {id:'s1',cat:'hair',ru:'Женская стрижка',en:'Women’s haircut',price:2500,min:60,w:10,tag:'hit',art:'scissors',hue:300},
    {id:'s2',cat:'hair',ru:'Мужская стрижка',en:'Men’s haircut',price:1500,min:45,w:7,art:'clipper',hue:255},
    {id:'s3',cat:'hair',ru:'Окрашивание в один тон',en:'Single-tone colour',price:5500,min:120,w:5,art:'brush',hue:24},
    {id:'s4',cat:'hair',ru:'Сложное окрашивание',en:'Balayage / AirTouch',price:12000,min:240,w:2.2,tag:'premium',art:'palette',hue:330},
    {id:'s5',cat:'hair',ru:'Укладка',en:'Blow-dry & styling',price:1800,min:45,w:4,art:'dryer',hue:272},
    {id:'s6',cat:'hair',ru:'Кератиновое выпрямление',en:'Keratin treatment',price:7000,min:150,w:1.1,tag:'low',art:'bottle',hue:32},
    {id:'s7',cat:'nails',ru:'Маникюр с гель-лаком',en:'Gel manicure',price:2200,min:90,w:12,tag:'hit',art:'polish',hue:350},
    {id:'s8',cat:'nails',ru:'Педикюр с покрытием',en:'Pedicure with polish',price:2900,min:100,w:5,art:'polish',hue:14},
    {id:'s9',cat:'nails',ru:'Наращивание ногтей',en:'Nail extensions',price:3800,min:150,w:2.4,art:'file',hue:305},
    {id:'s10',cat:'face',ru:'Чистка лица',en:'Facial cleansing',price:3500,min:75,w:3.6,art:'dropper',hue:285},
    {id:'s11',cat:'face',ru:'Пилинг',en:'Chemical peel',price:3000,min:45,w:2.2,art:'jar',hue:22},
    {id:'s12',cat:'face',ru:'Массаж лица',en:'Facial massage',price:2500,min:45,w:2,tag:'new',art:'roller',hue:322},
    {id:'s13',cat:'face',ru:'Биоревитализация',en:'Biorevitalisation',price:9000,min:40,w:0.9,tag:'low',art:'serum',hue:262},
    {id:'s14',cat:'brows',ru:'Архитектура бровей',en:'Brow shaping',price:1600,min:45,w:6,art:'brow',hue:26},
    {id:'s15',cat:'brows',ru:'Ламинирование ресниц',en:'Lash lift',price:2400,min:60,w:4,art:'lash',hue:282},
    {id:'s16',cat:'brows',ru:'Наращивание ресниц',en:'Lash extensions',price:3200,min:120,w:3,art:'lash',hue:335},
    {id:'s17',cat:'body',ru:'Массаж спины',en:'Back massage',price:2800,min:60,w:4.5,art:'stones',hue:18},
    {id:'s18',cat:'body',ru:'SPA-программа',en:'SPA ritual',price:6500,min:120,w:1.3,tag:'new',art:'candle',hue:34}
  ];
  const masters=[
    {id:'m1',ru:'Анна Ковалёва',en:'Emma Collins',role:{ru:'Топ-стилист',en:'Senior stylist'},cats:['hair'],rating:4.9,color:'#9a6cc4'},
    {id:'m2',ru:'Ирина Белова',en:'Olivia Hart',role:{ru:'Колорист',en:'Colourist'},cats:['hair'],rating:4.8,color:'#e88a62'},
    {id:'m3',ru:'Дмитрий Орлов',en:'James Turner',role:{ru:'Барбер',en:'Barber'},cats:['hair'],rating:4.7,color:'#6f7fd6'},
    {id:'m4',ru:'Ольга Смирнова',en:'Sophie Bennett',role:{ru:'Мастер ногтевого сервиса',en:'Nail artist'},cats:['nails'],rating:4.9,color:'#d9667f'},
    {id:'m5',ru:'Мария Лебедева',en:'Chloe Evans',role:{ru:'Мастер ногтевого сервиса',en:'Nail artist'},cats:['nails'],rating:4.6,color:'#b98ad8'},
    {id:'m6',ru:'Екатерина Волкова',en:'Grace Morgan',role:{ru:'Косметолог',en:'Cosmetologist'},cats:['face'],rating:4.9,color:'#e0a07a'},
    {id:'m7',ru:'Алина Морозова',en:'Mia Russell',role:{ru:'Бровист, лэшмейкер',en:'Brow & lash artist'},cats:['brows'],rating:4.8,color:'#c79a3e'},
    {id:'m8',ru:'Сергей Никитин',en:'Liam Parker',role:{ru:'Массажист',en:'Massage therapist'},cats:['body','face'],rating:4.7,color:'#5f9e9a'}
  ];
  const channels=[
    {id:'online',ru:'Онлайн-запись',en:'Online booking',w:38,color:'#9a6cc4'},
    {id:'phone',ru:'Телефон и мессенджеры',en:'Phone & messengers',w:24,color:'#6f7fd6'},
    {id:'social',ru:'Соцсети',en:'Social media',w:16,color:'#f0a07e'},
    {id:'maps',ru:'Яндекс Карты',en:'Google Maps',w:14,color:'#d9667f'},
    {id:'referral',ru:'Рекомендации',en:'Referrals',w:8,color:'#5f9e9a'}
  ];
  const districts=[
    {id:'d1',ru:'Мурино',en:'Islington',w:24},{id:'d2',ru:'Кудрово',en:'Hackney',w:19},{id:'d3',ru:'Всеволожск',en:'Camden',w:17},
    {id:'d4',ru:'Девяткино',en:'Shoreditch',w:13},{id:'d5',ru:'Приморский район',en:'Clapham',w:10},
    {id:'d6',ru:'Выборгский район',en:'Battersea',w:9},{id:'d7',ru:'Другие',en:'Other',w:8}
  ];
  const firstNames=['Анна','Мария','Елена','Ольга','Наталья','Татьяна','Ирина','Светлана','Юлия','Дарья','Ксения','Алёна','Виктория','Полина','Екатерина','Софья','Алексей','Михаил','Игорь','Артём'];
  const firstEn=['Amelia','Isla','Ella','Lily','Ava','Freya','Harper','Ruby','Evie','Poppy','Zoe','Alice','Victoria','Holly','Kate','Sophia','Oliver','Jack','Harry','Noah'];
  const lastLetters='АБВГДЕЗИКЛМНОПРСТФЧШ';const lastEn='ABCDEFGHJKLMNPRSTWYH';

  const today=new Date();today.setHours(0,0,0,0);
  const DAY=864e5,START=new Date(today.getTime()-400*DAY),END=new Date(today.getTime()+14*DAY);
  const clients=[];
  function newClient(date){const i=Math.floor(R()*firstNames.length),j=Math.floor(R()*lastLetters.length);const c={id:'c'+(clients.length+1),ru:firstNames[i]+' '+lastLetters[j]+'.',en:firstEn[i]+' '+lastEn[j]+'.',district:pick(districts,districts.map(d=>d.w)).id,channel:pick(channels,channels.map(c=>c.w)).id,since:date,loyal:R()};clients.push(c);return c;}
  for(let i=0;i<260;i++)newClient(START.getTime()-Math.floor(R()*300)*DAY);

  const bookings=[];
  const svcW=services.map(s=>s.w);
  const nowHour=new Date().getHours()+new Date().getMinutes()/60;
  for(let t=START.getTime();t<=END.getTime();t+=DAY){
    const d=new Date(t),dow=d.getDay(),month=d.getMonth();
    const dayFactor=[0.55,0.82,0.9,0.95,1.05,1.22,1.18][dow];
    const season=[0.92,0.95,1.08,1.0,1.02,0.9,0.82,0.86,0.98,1.03,1.05,1.25][month];
    const trend=0.86+0.24*((t-START.getTime())/(today.getTime()-START.getTime()));
    const n=Math.max(4,Math.round(29*dayFactor*season*trend*(0.86+R()*0.28)));
    for(let k=0;k<n;k++){
      const s=pick(services,svcW);
      const ms=masters.filter(m=>m.cats.includes(s.cat));const m=ms[Math.floor(R()*ms.length)];
      const pool=clients;
      let c;if(pool.length>40&&R()<0.64){c=pool[pool.length-1-Math.floor(Math.pow(R(),2.4)*pool.length)];if(c.loyal<0.15&&R()<0.5)c=pool[Math.floor(R()*pool.length)];}else c=newClient(t);
      const hour=9+Math.floor(R()*12),minute=[0,15,30,45][Math.floor(R()*4)];
      const isPast=t<today.getTime()||(t===today.getTime()&&hour+minute/60<nowHour);
      let status;
      if(isPast){const x=R();status=x<0.885?'done':x<0.95?'cancelled':'noshow';}
      else status=R()<0.78?'confirmed':'pending';
      const price=Math.round(s.price*(0.95+R()*0.15)/50)*50;
      bookings.push({id:'B'+String(100000+bookings.length).slice(1),t,hour,minute,service:s.id,master:m.id,client:c.id,channel:R()<0.7?c.channel:pick(channels,channels.map(x=>x.w)).id,status,price});
    }
  }
  bookings.sort((a,b)=>a.t-b.t||a.hour-b.hour||a.minute-b.minute);
  window.BEAUTY_DATA={categories,services,masters,channels,districts,clients,bookings,today:today.getTime(),DAY,usdRate:92,monthPlan:2600000};
})();
