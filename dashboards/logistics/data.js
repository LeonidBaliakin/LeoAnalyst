/* LeoAnalyst · «Магистраль» logistics demo - synthetic, reproducible data. Company, people and plates are fictional. */
(function(){
 function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
 const EN=document.documentElement.lang==='en';
 const R=rng(9157);const pick=a=>a[Math.floor(R()*a.length)];
 const today=new Date();today.setHours(0,0,0,0);const DAY=864e5,T0=today.getTime();
 const letters='АВЕКМНОРСТХ';const plate=()=>{const a=pick(letters)+' '+(100+Math.floor(R()*899))+' '+pick(letters)+pick(letters)+' '+pick(['178','78','98','47','198']);if(!EN)return a;const L='BDFGHJKLNPRSTVXZ';const q=()=>L[Math.floor(R()*L.length)];return q()+q()+'-'+(100+Math.floor(R()*899))+'-'+q()};
 const firstRu=['Сергей','Андрей','Дмитрий','Алексей','Игорь','Николай','Владимир','Михаил','Олег','Евгений','Павел','Роман','Виктор','Юрий','Артём','Иван','Максим','Денис'];
 const firstEn=['Thomas','Lukas','Jan','Mark','Pieter','Stefan','David','Martin','Erik','Jonas','Paul','Ruben','Victor','Daniel','Adam','Kevin','Max','Dennis'];
 const lastRu=['Иванов','Петров','Смирнов','Кузнецов','Соколов','Попов','Лебедев','Козлов','Новиков','Морозов','Волков','Алексеев','Белов','Орлов','Зайцев','Павлов','Семёнов','Голубев','Виноградов','Богданов','Воробьёв','Фёдоров','Михайлов','Тарасов','Беляев','Комаров','Киселёв','Макаров'];
 const lastEn=['de Vries','Jansen','Bakker','Visser','Smit','Meyer','Müller','Schmidt','Fischer','Weber','Novak','Kowalski','Dubois','Martin','Peeters','Janssens','Hoffmann','Wagner','Becker','Schulz','Koch','Richter','Klein','Wolf','Brouwer','Mulder','de Boer','Vos'];
 const cities=[{ru:'Санкт-Петербург',en:'Rotterdam',k:'СПб'},{ru:'Москва',en:'Berlin',k:'МСК'},{ru:'Екатеринбург',en:'Bucharest',k:'ЕКБ'},{ru:'Казань',en:'Barcelona',k:'КЗН'},{ru:'Нижний Новгород',en:'Prague',k:'НН'},{ru:'Великий Новгород',en:'Brussels',k:'ВН'},{ru:'Тверь',en:'Leipzig',k:'ТВР'},{ru:'Мурманск',en:'Stockholm',k:'МУР'},{ru:'Выборг',en:'Antwerp',k:'ВБГ'},{ru:'Гатчина',en:'Utrecht',k:'ГТЧ'}];
 const routes=[
  {id:'r1',from:0,to:1,km:710,seg:'heavy',w:9},{id:'r2',from:0,to:2,km:2240,seg:'heavy',w:4},{id:'r3',from:0,to:3,km:1530,seg:'heavy',w:4},
  {id:'r4',from:1,to:4,km:420,seg:'heavy',w:5},{id:'r5',from:0,to:7,km:1350,seg:'heavy',w:3},{id:'r6',from:0,to:5,km:190,seg:'medium',w:7},
  {id:'r7',from:1,to:6,km:180,seg:'medium',w:6},{id:'r8',from:0,to:8,km:140,seg:'medium',w:6},{id:'r9',from:0,to:9,km:50,seg:'medium',w:8}];
 const models={heavy:[['Volvo FH 460',20],['Scania R450',20],[EN?'DAF XF 480':'КАМАЗ 54901',20],['Mercedes Actros',20],['MAN TGX',20]],medium:[[EN?'Iveco Daily 70C':'ГАЗон Next',5],['Isuzu Elf 7.5',7.5],['Hyundai HD78',5],[EN?'Mercedes Atego 1018':'КАМАЗ Компас 9',9],['Isuzu Forward',10]]};
 const vehicles=[];
 function addV(seg,n){for(let i=0;i<n;i++){const m=pick(models[seg]);vehicles.push({id:'v'+(vehicles.length+1),plate:plate(),model:m[0],cap:m[1],seg,year:2016+Math.floor(R()*9),odo:Math.round((seg==='heavy'?180:90)+R()*(seg==='heavy'?620:260))*1000});}}
 addV('heavy',34);addV('medium',24);
 // statuses: 47 line, 6 base, 5 repair
 const st=[...Array(47).fill('line'),...Array(6).fill('base'),...Array(5).fill('repair')];
 for(let i=st.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[st[i],st[j]]=[st[j],st[i]];}
 vehicles.forEach((v,i)=>v.status=st[i]);
 // drivers
 const drivers=[];for(let i=0;i<52;i++){const f=Math.floor(R()*firstRu.length),l=Math.floor(R()*lastRu.length);drivers.push({id:'d'+(i+1),ru:lastRu[l]+' '+firstRu[f][0]+'.',en:lastEn[l]+' '+firstEn[f][0]+'.',seg:i<30?'heavy':'medium',exp:2+Math.floor(R()*22),rating:Math.round((4.1+R()*.9)*10)/10});}
 // assign drivers to line vehicles
 let di=0;vehicles.forEach(v=>{if(v.status==='line'){const pool=drivers.filter(d=>d.seg===v.seg&&!d.vehicle);const d=pool[0]||drivers.find(x=>!x.vehicle);d.vehicle=v.id;v.driver=d.id;const rs=routes.filter(r=>r.seg===v.seg);const r=rs[Math.floor(R()*rs.length)];v.route=r.id;v.progress=Math.round(8+R()*86);v.load=Math.round(v.cap*(.62+R()*.38)*10)/10;v.trip='24-'+(1000+Math.floor(R()*900));}});
 drivers.forEach(d=>{if(d.vehicle){d.state='line';d.hours=Math.round((2+R()*7)*10)/10;}else{const x=R();d.state=x<.7?'rest':x<.85?'sick':'base';d.hours=0;}d.month=Math.round(120+R()*90);d.trips=Math.round(6+R()*(d.seg==='heavy'?10:28));d.ontime=Math.round(84+R()*15);});
 // repairs
 const reasons=[['Двигатель: замена турбины','Engine: turbo replacement','urgent',186000,3],['Тормозная система','Brake system','urgent',64500,1],['Плановое ТО-2','Scheduled service','plan',18200,0],['Подвеска, рессоры','Suspension, leaf springs','parts',41800,6],['Шиномонтаж и развал','Tyres & alignment','plan',22400,0],['Электрика, генератор','Electrics, alternator','plan',27300,2],['Кузов после ДТП','Body repair after collision','parts',94000,8]];
 let ri=0;vehicles.forEach(v=>{if(v.status==='repair'){const r=reasons[ri++%reasons.length];v.repair={ru:r[0],en:r[1],kind:r[2],cost:r[3],eta:T0+r[4]*DAY,since:T0-Math.floor(1+R()*4)*DAY};}});
 // daily history, 400 days, per segment
 const history=[];
 for(let i=399;i>=0;i--){const t=T0-i*DAY,d=new Date(t),dow=d.getDay(),mon=d.getMonth();
  const wk=dow===0?.55:dow===6?.7:1;const season=[.86,.9,1,1.02,1.06,1.04,.96,.98,1.04,1.08,1.1,1.14][mon];const trend=.88+.18*(1-i/400);
  const day={t};for(const seg of['heavy','medium']){const H=seg==='heavy';const f=wk*season*trend*(.88+R()*.24);
   const trips=Math.round((H?16:30)*f);const avgKm=H?760:95;const km=Math.round(trips*avgKm*(.85+R()*.3));const tons=H?17.2:5.1;const tkm=Math.round(km*tons*(.86+R()*.1));
   const emptyKm=Math.round(km*(H?.16:.24)*(.8+R()*.4));const fuelL=Math.round((km+emptyKm)*(H?.312:.198));const fuelPrice=Math.round((64.8+ (400-i)/400*4.2 + (R()-.5)*.6)*100)/100;
   const rateKm=H?79:104;const revOwn=Math.round(km*rateKm*(.95+R()*.1));
   const hiredTrips=Math.round(trips*(H?.42:.35)*(.8+R()*.4));const hiredKm=hiredTrips*avgKm;const revHired=Math.round(hiredKm*rateKm*(.95+R()*.1));const costHired=Math.round(revHired*(.86+R()*.06));
   const salary=Math.round(km*(H?11.5:24));const repair=Math.round(km*(H?4.6:6.8)*(.6+R()*.8));const leasing=Math.round(H?34*4200:24*2100);const platon=H?Math.round(km*3.1):0;const other=Math.round(revOwn*.05);
   day[seg]={trips,km,tkm,emptyKm,fuelL,fuelPrice,revOwn,revHired,costHired,hiredTrips,hiredTkm:Math.round(hiredKm*tons*.9),salary,repair,leasing,platon,other,ontime:Math.min(1,.88+R()*.11)};}
  history.push(day);}
 window.MAG_DATA={cities,routes,vehicles,drivers,history,today:T0,DAY,usdRate:92};
})();
