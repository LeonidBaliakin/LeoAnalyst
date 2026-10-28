/* «Вектор Логистик» — LeoAnalyst freight forwarding demo. Synthetic, deterministic data. */
(function(){
const EN=document.documentElement.lang==='en';
let s=4417;const rnd=()=>{s=(s*1103515245+12345)%2147483648;return s/2147483648};
const pick=(ru,en)=>EN?en:ru;
const company=pick('Вектор Логистик','Vector Freight');
const CITY=EN?['Rotterdam','Hamburg','Berlin','Munich','Paris','Milan','Warsaw','Prague','Vienna','Antwerp','Lyon']:['Москва','Санкт-Петербург','Казань','Екатеринбург','Новосибирск','Нижний Новгород','Краснодар','Ростов-на-Дону','Самара','Владивосток','Новороссийск'];
const CARRIERS=EN?['Rhine Freight','NorthSea Haulage','EuroRoad Logistics','RailPort Europe','Maas Trucking','Delta Forwarding']:['СеверТранс','ВолгаКарго','ТрансЛайн Авто','РейлКонтейнер','Магистраль-Лог','ПетроЭкспедиция'];
const CL=EN?[['Brightline Electronics','electronics'],['Atlas Steel Trading','steel'],['Nordic Home Furniture','furniture'],['Greenfield Foods','food'],['AutoParts Europe','auto parts'],['BuildRight Materials','building materials'],['MediSupply','medical goods'],['HomeTech Appliances','appliances'],['Peak Sport','sport goods'],['BeanRoute Coffee','coffee & tea']]
 :[['ТехноМаркет','электроника'],['Северсталь-Трейд','металлопрокат'],['МебельГрад','мебель'],['АгроИмпорт','продукты'],['АвтоДеталь','автозапчасти'],['СтройКомплект','стройматериалы'],['ФармаЛогист','медтовары'],['ДомТехника','бытовая техника'],['Спорт-Опт','спорттовары'],['КофеТрейд','кофе и чай']];
const TEAM=EN?[['Laura Meyer','Head of logistics'],['Pieter Visser','Logistics manager'],['Sofia Novak','Logistics manager'],['Mark Dubois','Logistics manager'],['Hannah Brooks','Logistics manager'],['Daniel Reed','Sales manager'],['Ellen Turner','Sales manager'],['Ian Moore','Sales manager']]
 :[['Ирина Крылова','Руководитель отдела'],['Павел Смирнов','Логист'],['Марина Лебедева','Логист'],['Олег Данилов','Логист'],['Анна Волкова','Логист'],['Денис Романов','Менеджер по продажам'],['Елена Тарасова','Менеджер по продажам'],['Игорь Макаров','Менеджер по продажам']];
const MONTHS=EN?['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct']:['ноя','дек','янв','фев','мар','апр','май','июн','июл','авг','сен','окт'];
// finance, 12 months (RUB internally; USD shown at 92 per $ for foreign visitors)
const fin=MONTHS.map((m,i)=>{const rev=Math.round((46+i*1.35+(rnd()-.5)*4)*1e6);const mg=.118+i*.0014+(rnd()-.5)*.012;return {m,rev,profit:Math.round(rev*mg),plan:Math.round((45.5+i*1.45)*1e6)}});
fin[11]={m:MONTHS[11],rev:61.4e6,profit:8.23e6,plan:60e6};fin[10].rev=57.9e6;fin[10].profit=7.3e6;
// clients: shipments per month (6) + October money
const clients=CL.map((c,i)=>{const base=62-i*4.6+rnd()*6;const tr=(rnd()-.42)*.16;const ship=Array.from({length:6},(_,j)=>Math.max(3,Math.round(base*(1+tr*j)*(.9+rnd()*.2))));const avg=118000+rnd()*42000;const rev=ship[5]*avg;const mg=.09+rnd()*.08;return {name:c[0],cargo:c[1],ship,rev,profit:rev*mg}});
const tr=clients.reduce((a,c)=>a+c.rev,0),tp=clients.reduce((a,c)=>a+c.profit,0);clients.forEach(c=>{c.rev=Math.round(c.rev*61.4e6/tr);c.profit=Math.round(c.profit*8.23e6/tp)});
// team load: active shipments now and hours by week
const lvl=[.92,1.18,1.0,.95,.93,1.12,.81,.97];
const team=TEAM.map((t,i)=>({name:t[0],role:t[1],sales:i>=5,lead:i===0,active:Math.round((i>=5?14:24)*lvl[i]+rnd()*2),norm:i>=5?14:24,weeks:Array.from({length:8},(_,w)=>Math.round(40*lvl[i]*(.93+rnd()*.14)+(w>5&&lvl[i]>1.1?3:0)))}));
// leads
const funnel=EN?[['Leads',184],['Rate requests',121],['Quotes sent',86],['Deals',31]]:[['Лиды',184],['Запрос ставки',121],['Отправлено КП',86],['Сделки',31]];
const convTrend=[12.9,13.6,14.1,15.2,15.6,16.8];
const sources=EN?[['Website',.31,.21],['Referrals',.24,.27],['Cold calls',.27,.08],['Freight exchanges',.18,.14]]:[['Сайт',.31,.21],['Рекомендации',.24,.27],['Холодные звонки',.27,.08],['Грузовые биржи',.18,.14]];
// body types share of turnover
const bodies=EN?[['40′ container','10_container_truck',.46,.14],['20′ container','14_medium_box_side',.14,.15],['Curtainsider','11_curtainside_truck',.21,.12],['Reefer','12_refrigerated_truck',.12,.17],['Flatbed','13_flatbed_truck',.07,.11]]
 :[['Контейнер 40′','10_container_truck',.46,.14],['Контейнер 20′','14_medium_box_side',.14,.15],['Тент','11_curtainside_truck',.21,.12],['Рефрижератор','12_refrigerated_truck',.12,.17],['Бортовой','13_flatbed_truck',.07,.11]];
// active shipments
const ST=EN?{road:'On the road',load:'Loading',cust:'At customs',done:'Delivered today'}:{road:'В пути',load:'Погрузка',cust:'На таможне',done:'Доставлен сегодня'};
const raw=[[0,0,2,0,'road',58,1,9,40],[1,9,3,1,'road',34,3,3,40],[2,10,0,4,'load',4,0,10,40],[3,1,5,2,'cust',18,4,5,20],[4,0,8,5,'road',71,2,2,40],[5,6,7,3,'road',46,1,6,20],[6,1,0,0,'done',100,3,4,40],[7,9,4,1,'road',22,4,1,40]];
const shipments=raw.map((r,i)=>{const [cl,from,to,car,st,prog,logist,img,type]=r;const sale=EN?[1450,1750,1950,2000,2300,1250,1050,900][i]*92:[95000,420000,150000,105000,120000,45000,88000,410000][i];const cost=Math.round(sale*(.82+rnd()*.07)/500)*500;
 return {id:(EN?'FWD-':'ЭКС-')+(24511+i*7),client:cl,from:CITY[from],to:CITY[to],carrier:CARRIERS[car],status:st,stLabel:ST[st],progress:prog,logist,img,type,weight:Math.round((type===40?18:11)+rnd()*6),sale,cost,eta:st==='done'?0:Math.max(1,Math.round((100-prog)/24)),plate:EN?['RX-418-K','HB-221-T','VL-903-P','KN-517-D','TZ-664-B','PL-302-F','GR-845-S','MD-129-Z'][i]:['А418КМ 178','В221ТР 78','Е903ОР 98','К517ВН 47','М664ТВ 178','Н302ОХ 98','Р845СА 178','С129ВМ 78'][i],container:['MSKU','TGHU','CMAU','OOLU','HLXU','TCNU','SEGU','FCIU'][i]+' '+(400000+Math.floor(rnd()*599999))}});
window.FWD_DATA={EN,company,fin,clients,team,funnel,convTrend,sources,bodies,shipments,MONTHS,usdRate:92};
})();
