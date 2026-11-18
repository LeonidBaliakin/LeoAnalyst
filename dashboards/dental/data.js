/* LeoAnalyst · Dental clinic demo - synthetic, reproducible data (no real people or companies) */
(function(){
  function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  const R=rng(20261023);
  const pick=(arr,w)=>{const total=w.reduce((a,b)=>a+b,0);let x=R()*total;for(let i=0;i<arr.length;i++){x-=w[i];if(x<=0)return arr[i];}return arr[arr.length-1];};

  const categories=[
    {id:'ther',ru:'Терапия',en:'General dentistry',w:34},
    {id:'hyg',ru:'Гигиена',en:'Hygiene',w:18},
    {id:'surg',ru:'Хирургия и имплантация',en:'Surgery & implants',w:14},
    {id:'orth',ru:'Ортопедия',en:'Prosthodontics',w:14},
    {id:'ortho',ru:'Ортодонтия',en:'Orthodontics',w:10},
    {id:'kids',ru:'Детская стоматология',en:'Paediatric',w:10}
  ];
  const services=[
    {id:'s1',cat:'ther',ru:'Консультация и план лечения',en:'Consultation & treatment plan',price:1000,min:30,w:12,tag:'hit',art:'mirror',hue:185},
    {id:'s2',cat:'ther',ru:'Лечение кариеса',en:'Cavity filling',price:6500,min:60,w:10,tag:'hit',art:'tooth',hue:185},
    {id:'s3',cat:'ther',ru:'Художественная реставрация',en:'Aesthetic restoration',price:9500,min:90,w:3,art:'tooth',hue:185},
    {id:'s4',cat:'ther',ru:'Лечение каналов',en:'Root canal treatment',price:16000,min:120,w:3,art:'xray',hue:185},
    {id:'s5',cat:'ther',ru:'Снимок КТ',en:'CBCT scan',price:3000,min:20,w:5,art:'xray',hue:185},
    {id:'s6',cat:'hyg',ru:'Профессиональная гигиена',en:'Professional cleaning',price:5500,min:60,w:9,tag:'hit',art:'dropper',hue:185},
    {id:'s7',cat:'hyg',ru:'Отбеливание',en:'Teeth whitening',price:18000,min:90,w:1.4,tag:'low',art:'tooth',hue:185},
    {id:'s8',cat:'surg',ru:'Удаление зуба',en:'Tooth extraction',price:4500,min:45,w:4,art:'tooth',hue:185},
    {id:'s9',cat:'surg',ru:'Удаление зуба мудрости',en:'Wisdom tooth removal',price:9000,min:60,w:2,art:'tooth',hue:185},
    {id:'s10',cat:'surg',ru:'Имплантация',en:'Dental implant',price:48000,min:90,w:1.6,tag:'premium',art:'implant',hue:185},
    {id:'s11',cat:'orth',ru:'Коронка из диоксида циркония',en:'Zirconia crown',price:28000,min:60,w:2.2,art:'implant',hue:185},
    {id:'s12',cat:'orth',ru:'Виниры',en:'Veneers',price:38000,min:90,w:0.8,tag:'low',art:'tooth',hue:185},
    {id:'s13',cat:'ortho',ru:'Установка брекетов',en:'Braces fitting',price:65000,min:120,w:0.6,tag:'premium',art:'braces',hue:185},
    {id:'s14',cat:'ortho',ru:'Коррекция брекетов',en:'Braces adjustment',price:3500,min:30,w:4,art:'braces',hue:185},
    {id:'s15',cat:'kids',ru:'Детский приём',en:'Child check-up',price:2500,min:40,w:4,tag:'new',art:'mirror',hue:185},
    {id:'s16',cat:'kids',ru:'Герметизация фиссур',en:'Fissure sealing',price:2200,min:30,w:2.4,art:'tooth',hue:185}
  ];
  const masters=[
    {id:'m1',ru:'Анна Ковалёва',en:'Emma Collins',role:{ru:'Стоматолог-терапевт',en:'General dentist'},cats:['ther'],rating:4.9,color:'#1565c0'},
    {id:'m2',ru:'Игорь Белов',en:'James Hart',role:{ru:'Стоматолог-терапевт',en:'General dentist'},cats:['ther'],rating:4.8,color:'#3f86d9'},
    {id:'m3',ru:'Дмитрий Орлов',en:'Oliver Turner',role:{ru:'Хирург-имплантолог',en:'Oral surgeon'},cats:['surg'],rating:4.9,color:'#0e8fa3'},
    {id:'m4',ru:'Ольга Смирнова',en:'Sophie Bennett',role:{ru:'Гигиенист',en:'Dental hygienist'},cats:['hyg'],rating:4.8,color:'#13a3b5'},
    {id:'m5',ru:'Сергей Никитин',en:'Liam Parker',role:{ru:'Стоматолог-ортопед',en:'Prosthodontist'},cats:['orth'],rating:4.7,color:'#2f6db5'},
    {id:'m6',ru:'Екатерина Волкова',en:'Grace Morgan',role:{ru:'Ортодонт',en:'Orthodontist'},cats:['ortho'],rating:4.9,color:'#4fb7c9'},
    {id:'m7',ru:'Алина Морозова',en:'Mia Russell',role:{ru:'Детский стоматолог',en:'Paediatric dentist'},cats:['kids'],rating:4.9,color:'#5aa0e6'}
  ];
  const channels=[
    {id:'online',ru:'Онлайн-запись',en:'Online booking',w:30,color:'#1565c0'},
    {id:'phone',ru:'Звонок в клинику',en:'Phone call',w:30,color:'#3f86d9'},
    {id:'maps',ru:'Яндекс Карты',en:'Google Maps',w:18,color:'#13a3b5'},
    {id:'referral',ru:'Рекомендации',en:'Referrals',w:14,color:'#6fc9d6'},
    {id:'social',ru:'Соцсети',en:'Social media',w:8,color:'#a9cdee'}
  ];
  const districts=[
    {id:'d1',ru:'Центр',en:'City centre',w:26},{id:'d2',ru:'Северный',en:'North',w:20},{id:'d3',ru:'Южный',en:'South',w:16},
    {id:'d4',ru:'Западный',en:'West',w:13},{id:'d5',ru:'Восточный',en:'East',w:11},
    {id:'d6',ru:'Пригород',en:'Suburbs',w:8},{id:'d7',ru:'Другие',en:'Other',w:6}
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
    const dayFactor=[0.35,1.05,1.0,1.02,1.05,1.1,0.85][dow];
    const season=[0.85,0.98,1.05,1.04,1.0,0.9,0.82,0.88,1.06,1.08,1.06,1.02][month];
    const trend=0.86+0.24*((t-START.getTime())/(today.getTime()-START.getTime()));
    const n=Math.max(4,Math.round(24*dayFactor*season*trend*(0.86+R()*0.28)));
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
  // consultations: any doctor except the hygienist; each gets a treatment plan value
  const consultDocs=['m1','m1','m2','m2','m3','m5','m6','m7'];
  for(const b of bookings){if(b.service==='s1'){b.master=consultDocs[Math.floor(R()*consultDocs.length)];b.plan=Math.round((15000+Math.pow(R(),1.6)*110000)/500)*500;}}
  // part of patients come back for the planned treatment (rate differs by doctor)
  const accept={m1:.5,m2:.36,m3:.46,m5:.42,m6:.28,m7:.56};
  const treat={m1:['s2','s3','s4'],m2:['s2','s3','s4'],m3:['s8','s9','s10'],m5:['s11','s12'],m6:['s13'],m7:['s16','s2']};
  const svcBy=Object.fromEntries(services.map(x=>[x.id,x]));
  const added=[];
  for(const b of bookings){if(b.service!=='s1'||b.status!=='done')continue;if(R()>accept[b.master])continue;
    const delay=(3+Math.floor(R()*26))*DAY,t=b.t+delay;if(t>today.getTime())continue;
    const sid=treat[b.master][Math.floor(R()*treat[b.master].length)],sv=svcBy[sid];
    const doc=masters.find(m=>m.id===b.master&&m.cats.includes(sv.cat))||masters.find(m=>m.cats.includes(sv.cat));
    added.push({id:'',t,hour:9+Math.floor(R()*10),minute:[0,15,30,45][Math.floor(R()*4)],service:sid,master:doc.id,client:b.client,channel:b.channel,status:'done',price:Math.round(sv.price*(0.95+R()*0.15)/50)*50,afterConsult:true});}
  for(const x of added)bookings.push(x);
  bookings.sort((a,b)=>a.t-b.t||a.hour-b.hour||a.minute-b.minute);
  bookings.forEach((b,i)=>{b.id='B'+String(100000+i).slice(1)});
  window.BEAUTY_DATA={categories,services,masters,channels,districts,clients,bookings,today:today.getTime(),DAY,usdRate:92,monthPlan:6500000};
})();
