/* «Балтик Лайн» — sea container demo data. Synthetic, deterministic. */
(function(){
const EN=document.documentElement.lang==='en';
let s=20261028;const rnd=()=>{s=(s*1103515245+12345)%2147483648;return s/2147483648};const pick=a=>a[Math.floor(rnd()*a.length)];
const P=(lon,lat,ru,en)=>({lon,lat,ru,en});
const WP={
 sha:P(122,31,'Шанхай','Shanghai'),ecs:P(121,25,'Тайваньский пролив','Taiwan Strait'),scs:P(114,19,'Южно-Китайское море','South China Sea'),scs2:P(108,10,'Южно-Китайское море','South China Sea'),
 sin:P(104,1.3,'Сингапур','Singapore'),mal:P(97,5,'Малаккский пролив','Strait of Malacca'),ind:P(80,6,'Индийский океан','Indian Ocean'),ara:P(60,13,'Аравийское море','Arabian Sea'),
 ade:P(48,12,'Аденский залив','Gulf of Aden'),bab:P(43.4,12.6,'Баб-эль-Мандеб','Bab-el-Mandeb'),red:P(38,20,'Красное море','Red Sea'),suez:P(32.5,30,'Суэцкий канал','Suez Canal'),
 psd:P(32.3,31.5,'Порт-Саид','Port Said'),med1:P(25,34,'Средиземное море','Mediterranean'),med2:P(12,37,'Средиземное море','Mediterranean'),gib:P(-5.6,36,'Гибралтар','Gibraltar'),
 por:P(-10,38,'у берегов Португалии','off Portugal'),bis:P(-8,45,'Бискайский залив','Bay of Biscay'),chn:P(1,50.5,'Ла-Манш','English Channel'),nsea:P(4.5,53,'Северное море','North Sea'),
 nsea2:P(8,56,'Северное море','North Sea'),skg:P(10.6,57.9,'Скаген','Skagen'),kat:P(12,56,'Каттегат','Kattegat'),bal:P(16,55.5,'Балтийское море','Baltic Sea'),bal2:P(20.5,57.5,'Балтийское море','Baltic Sea'),
 fin:P(25,59.6,'Финский залив','Gulf of Finland'),spb:P(30.2,59.9,'Санкт-Петербург','St Petersburg'),
 ham:P(9.9,53.5,'Гамбург','Hamburg'),kiel:P(10.3,54.4,'Кильский канал','Kiel Canal'),bal0:P(13,54.6,'Балтийское море','Baltic Sea'),
 nb:P(121.9,29.9,'Нинбо','Ningbo'),bus:P(129,35.1,'Пусан','Busan'),jap:P(132,38,'Японское море','Sea of Japan'),vvo:P(131.9,43.1,'Владивосток','Vladivostok'),kor:P(126,33,'Корейский пролив','Korea Strait'),
 ist:P(28.9,41,'Стамбул','Istanbul'),bsea:P(33,42.6,'Чёрное море','Black Sea'),nvr:P(37.8,44.7,'Новороссийск','Novorossiysk'),aeg:P(25.5,38.5,'Эгейское море','Aegean Sea'),dar:P(26.4,40.2,'Дарданеллы','Dardanelles'),
 jea:P(55,25,'Джебель-Али','Jebel Ali'),hor:P(56.5,26.4,'Ормузский пролив','Strait of Hormuz'),oman:P(58.5,22.5,'Оманский залив','Gulf of Oman'),ar2:P(55,15,'Аравийское море','Arabian Sea'),
 nsh:P(72.9,18.9,'Нава-Шева','Nhava Sheva'),ar3:P(65,15,'Аравийское море','Arabian Sea'),
 rtm:P(4.1,51.95,'Роттердам','Rotterdam'),ant:P(4.3,51.25,'Антверпен','Antwerp'),elb:P(8.4,54,'устье Эльбы','Elbe estuary'),nyc:P(-74,40.6,'Нью-Йорк','New York'),
 atl1:P(-60,41.5,'Северная Атлантика','North Atlantic'),atl2:P(-40,45,'Северная Атлантика','North Atlantic'),atl3:P(-20,48,'Северная Атлантика','North Atlantic'),cel:P(-6.5,49.3,'Кельтское море','Celtic Sea'),
 hou:P(-95,29.3,'Хьюстон','Houston'),gom:P(-88,25.5,'Мексиканский залив','Gulf of Mexico'),fla:P(-80.6,24.4,'Флоридский пролив','Florida Strait'),sar:P(-70,32,'Саргассово море','Sargasso Sea'),mid:P(-42,40,'центр Атлантики','Mid-Atlantic'),
 san:P(-46.3,-24,'Сантус','Santos'),sa1:P(-37,-14,'Южная Атлантика','South Atlantic'),sa2:P(-29,0,'экватор, Атлантика','Equatorial Atlantic'),sa3:P(-21,15,'у Кабо-Верде','off Cape Verde'),can:P(-16,29,'у Канарских островов','off the Canaries'),
 atl4:P(-20,36,'Атлантика','Atlantic'),atl5:P(-48,38.5,'Атлантика','Atlantic')
};
const EU=['sin','mal','ind','ara','ade','bab','red','suez','psd','med1','med2','gib','por','bis','chn','nsea','nsea2','skg','kat','bal','bal2','fin','spb'];
const EUR=['sin','mal','ind','ara','ade','bab','red','suez','psd','med1','med2','gib','por','bis','chn'];
const ROUTES_RU={
 shaSpb:['sha','ecs','scs','scs2',...EU],nbSpb:['nb','ecs','scs','scs2',...EU],
 busVvo:['bus','kor','jap','vvo'],shaVvo:['sha','kor','jap','vvo'],
 istNvr:['ist','bsea','nvr'],jeaNvr:['jea','hor','oman','ar2','ade','bab','red','suez','psd','med1','aeg','dar','ist','bsea','nvr'],
 nshSpb:['nsh','ar3','ade',...EU.slice(EU.indexOf('bab'))],hamSpb:['ham','kiel','bal0','bal2','fin','spb']
};
const ROUTES_EN={shaRtm:['sha','ecs','scs','scs2',...EUR,'rtm'],nbHam:['nb','ecs','scs','scs2',...EUR,'nsea','elb','ham'],nycRtm:['nyc','atl1','atl2','atl3','cel','chn','rtm'],houAnt:['hou','gom','fla','sar','mid','atl3','cel','chn','ant'],
 sanRtm:['san','sa1','sa2','sa3','can','por','bis','chn','rtm'],shaNyc:['sha','ecs','scs','scs2',...EUR.slice(0,EUR.indexOf('gib')+1),'atl4','atl5','nyc'],nshRtm:['nsh','ar3','ade',...EUR.slice(EUR.indexOf('bab')),'rtm'],jeaAnt:['jea','hor','oman','ar2','ade',...EUR.slice(EUR.indexOf('bab')),'ant']};
const ROUTES=EN?ROUTES_EN:ROUTES_RU;
const ROUTE_NAME={shaRtm:['Шанхай','Shanghai'],nbHam:['Нинбо','Ningbo'],nycRtm:['Нью-Йорк','New York'],houAnt:['Хьюстон','Houston'],sanRtm:['Сантус','Santos'],shaNyc:['Шанхай','Shanghai'],nshRtm:['Нава-Шева','Nhava Sheva'],jeaAnt:['Джебель-Али','Jebel Ali'],shaSpb:['Шанхай','Shanghai'],nbSpb:['Нинбо','Ningbo'],busVvo:['Пусан','Busan'],shaVvo:['Шанхай','Shanghai'],istNvr:['Стамбул','Istanbul'],jeaNvr:['Джебель-Али','Jebel Ali'],nshSpb:['Нава-Шева','Nhava Sheva'],hamSpb:['Гамбург','Hamburg']};
const DEST={rtm:['Роттердам','Rotterdam'],ham:['Гамбург','Hamburg'],ant:['Антверпен','Antwerp'],nyc:['Нью-Йорк','New York'],spb:['Санкт-Петербург','St Petersburg'],vvo:['Владивосток','Vladivostok'],nvr:['Новороссийск','Novorossiysk']};
const VESSELS_EN=[
 {id:'v1',name:'Nord Aurora',route:'nycRtm',to:'rtm',prog:.84,c20:46,c40:58,flag:'Либерия|Liberia'},
 {id:'v2',name:'Pacific Lumen',route:'shaRtm',to:'rtm',prog:.86,c20:64,c40:112,flag:'Панама|Panama'},
 {id:'v3',name:'Amber Crest',route:'nbHam',to:'ham',prog:.47,c20:38,c40:96,flag:'Мальта|Malta'},
 {id:'v4',name:'Gulf Kite',route:'houAnt',to:'ant',prog:.55,c20:52,c40:40,flag:'США|United States'},
 {id:'v5',name:'Santos Breeze',route:'sanRtm',to:'rtm',prog:.4,c20:30,c40:22,flag:'Бразилия|Brazil'},
 {id:'v6',name:'Indigo Bay',route:'jeaAnt',to:'ant',prog:.33,c20:24,c40:44,flag:'Либерия|Liberia'},
 {id:'v7',name:'Sapphire Line',route:'nshRtm',to:'rtm',prog:.18,c20:20,c40:36,flag:'Сингапур|Singapore'},
 {id:'v8',name:'Jade Meridian',route:'shaNyc',to:'nyc',prog:.3,c20:40,c40:62,flag:'Гонконг|Hong Kong'},
 {id:'v9',name:'Silver Heron',route:'shaRtm',to:'rtm',prog:.07,c20:58,c40:104,flag:'Панама|Panama',delay:2},
];
const VESSELS_RU=[
 {id:'v1',name:'Nord Aurora',route:'hamSpb',to:'spb',prog:.62,c20:46,c40:58,flag:'Либерия|Liberia'},
 {id:'v2',name:'Pacific Lumen',route:'shaSpb',to:'spb',prog:.86,c20:64,c40:112,flag:'Панама|Panama'},
 {id:'v3',name:'Amber Crest',route:'nbSpb',to:'spb',prog:.47,c20:38,c40:96,flag:'Мальта|Malta'},
 {id:'v4',name:'Polar Kite',route:'busVvo',to:'vvo',prog:.55,c20:52,c40:40,flag:'Корея|Korea'},
 {id:'v5',name:'Volga Breeze',route:'istNvr',to:'nvr',prog:.4,c20:30,c40:22,flag:'Турция|Türkiye'},
 {id:'v6',name:'Indigo Bay',route:'jeaNvr',to:'nvr',prog:.33,c20:24,c40:44,flag:'Либерия|Liberia'},
 {id:'v7',name:'Sapphire Line',route:'nshSpb',to:'spb',prog:.18,c20:20,c40:36,flag:'Сингапур|Singapore'},
 {id:'v8',name:'Jade Meridian',route:'shaVvo',to:'vvo',prog:.12,c20:40,c40:62,flag:'Гонконг|Hong Kong'},
 {id:'v9',name:'Silver Heron',route:'shaSpb',to:'spb',prog:.07,c20:58,c40:104,flag:'Панама|Panama',delay:2},
];
const VESSELS=EN?VESSELS_EN:VESSELS_RU;
const BERTH={name:'Neva Star',c20:72,c40:118,done:.38};
// clients
const CL_EN=[['','Brightline Electronics','','electronics'],['','Atlas Steel Trading','','steel'],['','Nordic Home Furniture','','furniture'],['','Greenfield Foods','','food'],['','AutoParts Europe','','auto parts'],['','BuildRight Materials','','building'],['','Textura Apparel','','textile'],['','MediSupply','','medical'],['','HomeTech Appliances','','appliances'],['','EcoPolymer','','polymers'],['','Peak Sport','','sport goods'],['','ChemSource','','chemicals'],['','ToyWorld','','toys'],['','BeanRoute Coffee','','coffee & tea']];
const CL_RU=[['ТехноМаркет','TechnoMarket','электроника','electronics'],['Северсталь-Трейд','Severstal Trade','металлопрокат','steel'],['МебельГрад','MebelGrad','мебель','furniture'],['АгроИмпорт','AgroImport','продукты','food'],['АвтоДеталь','AutoDetal','автозапчасти','auto parts'],['СтройКомплект','StroyKomplekt','стройматериалы','building'],['ТекстильПро','TextilePro','текстиль','textile'],['ФармаЛогист','PharmaLogist','медтовары','medical'],['ДомТехника','DomTechnika','бытовая техника','appliances'],['ЭкоПластик','EcoPlastic','полимеры','polymers'],['Спорт-Опт','Sport Opt','спорттовары','sport goods'],['ХимРесурс','ChemResource','химия','chemicals'],['Игрушки Мира','World Toys','игрушки','toys'],['КофеТрейд','CoffeeTrade','кофе и чай','coffee & tea']];
const CL=EN?CL_RU.map((c,i)=>[c[0],CL_EN[i][1],c[2],CL_EN[i][3]]):CL_RU;
const MONTHS=['май|May','июн|Jun','июл|Jul','авг|Aug','сен|Sep','окт|Oct'];
const clients=CL.map((c,i)=>{const base=520-i*32+rnd()*40;const trend=(rnd()-.45)*.18;const teu=MONTHS.map((m,j)=>Math.round(base*(1+trend*j)*(0.9+rnd()*.2)));const last=teu[5];const rpt=26000+rnd()*14000;const rev=last*rpt;const mg=.11+rnd()*.12;return {ru:c[0],en:c[1],cargo:[c[2],c[3]],teu,rev:Math.round(rev),profit:Math.round(rev*mg)}});
// scale so totals ~186M / 31M
const tr=clients.reduce((a,c)=>a+c.rev,0),tp=clients.reduce((a,c)=>a+c.profit,0);clients.forEach(c=>{c.rev=Math.round(c.rev*186e6/tr);c.profit=Math.round(c.profit*31.1e6/tp)});
// finance 12 months
const M12=['ноя|Nov','дек|Dec','янв|Jan','фев|Feb','мар|Mar','апр|Apr','май|May','июн|Jun','июл|Jul','авг|Aug','сен|Sep','окт|Oct'];
const fin=M12.map((m,i)=>{const rev=Math.round((142+i*3.6+(rnd()-.5)*10)*1e6);const mg=.145+i*.002+(rnd()-.5)*.02;return {m,rev,profit:Math.round(rev*mg),plan:Math.round((140+i*3.9)*1e6)}});
fin[11].rev=186e6;fin[11].profit=31.1e6;fin[10].rev=173.5e6;fin[10].profit=27.6e6;
const split=[['Морской фрахт','Ocean freight',.46,.12],['Автовывоз','Trucking',.24,.21],['ЖД-отправка','Rail',.19,.19],['Терминал и хранение','Terminal & storage',.11,.31]];
// trucks
const trucks=[];for(let i=0;i<42;i++){const age=1+Math.floor(rnd()*7);const price=Math.round((9.2+rnd()*3.2)*1e6/1e4)*1e4;const load=Math.round(i<5?35+rnd()*20:68+rnd()*30);trucks.push({id:(EN?'T':'Т')+(101+i),age,price,load,km:Math.round(6000+load*95+rnd()*1500),amort:Math.round(price/84),repair:i===7||i===19||i===31})}
// rail platforms (aggregate by group)
const rail={own:80,leased:40,load:[71,74,69,77,73,74],amortOwn:2.6e6,lease:40*58000,turnDays:[9.2,8.8,9.6,8.4,8.9,8.6]};
// team
const NAMES_EN=['Laura M.','Pieter V.','Sofia K.','Mark D.','Hannah B.','Daniel R.','Ellen T.','Ian M.','Sarah G.','Tom N.'];
const roles0=[['Ирина К.','Irina K.','логист','logistics'],['Павел С.','Pavel S.','логист','logistics'],['Марина Л.','Marina L.','логист','logistics'],['Олег Д.','Oleg D.','диспетчер','dispatcher'],['Анна В.','Anna V.','диспетчер','dispatcher'],['Денис Р.','Denis R.','менеджер продаж','sales'],['Елена Т.','Elena T.','менеджер продаж','sales'],['Игорь М.','Igor M.','менеджер продаж','sales'],['Светлана Г.','Svetlana G.','таможенный брокер','customs broker'],['Артём Н.','Artyom N.','таможенный брокер','customs broker']];
const roles=roles0.map((r,i)=>EN?[r[0],NAMES_EN[i],r[2],r[3]]:r);
const team=roles.map((r,i)=>{const lvl=[1.18,.96,1.12,.88,.92,1.02,.79,.94,1.05,.86][i];return {ru:r[0],en:r[1],role:[r[2],r[3]],weeks:Array.from({length:8},(_,w)=>Math.round(40*lvl*(0.92+rnd()*.16)+(w>5?(lvl>1.1?4:0):0))),tasks:Math.round(30+lvl*40+rnd()*10)}});
// sales funnel
const sales={funnel:[['Лиды','Leads',236],['Квалифицированы','Qualified',131],['Отправлено КП','Quotes sent',78],['Сделки','Deals',43]],
 sources:[['Сайт','Website',.34,.22],['Рекомендации','Referrals',.21,.31],['Холодные звонки','Cold calls',.27,.09],['Выставки','Trade shows',.18,.17]],
 conv:[14.2,15.1,15.8,16.4,17.1,18.2]};
// dispatch: carriers and rates
const DIRS_EN=[['','Duisburg',750*92,520*92],['','Frankfurt',1250*92,820*92],['','Paris',1350*92,null],['','Munich',1900*92,1150*92],['','Milan',2600*92,1500*92],['','Rotterdam warehouse',260*92,null]];
const DIRS_RU=[['Москва','Moscow',95000,70000],['Нижний Новгород','Nizhny Novgorod',120000,88000],['Казань','Kazan',150000,98000],['Екатеринбург','Yekaterinburg',230000,135000],['Новосибирск','Novosibirsk',380000,195000],['Склад СПб','SPb warehouse',18000,null]];
const DIRS=EN?DIRS_EN:DIRS_RU;
const CAR_EN=['Rhine Freight','NorthSea Haulage','EuroRoad Logistics','Maas Trucking','RailPort Europe','Alpine Rail Cargo','Delta Forwarding','Westport Logistics'];
const CAR0=[['СеверТранс','SeverTrans','auto',.97],['Магистраль-Лог','Magistral Log','auto',1.0],['ТрансЛайн Авто','TransLine Auto','auto',.94],['ВолгаКарго','VolgaCargo','auto',1.06],['РейлКонтейнер','RailContainer','rail',.96],['Евразия Рейл','Eurasia Rail','rail',1.02],['ПетроЭкспедиция','PetroExpedition','both',1.04],['Балт Форвард','Balt Forward','both',.99]];
const CAR=CAR0.map((c,i)=>EN?[c[0],CAR_EN[i],c[2],c[3]]:c);
const ST=['ok','ok','ok','ok','busy','up','wait'];
const carriers=CAR.map((c,i)=>({id:'c'+i,ru:c[0],en:c[1],mode:c[2],rates:DIRS.map((d,j)=>{const modes=c[2]==='both'?['auto','rail']:[c[2]];const o={};modes.forEach(m=>{const base=m==='auto'?d[2]:d[3];if(!base)return;if(i===2&&j===4)return;o[m]={r40:Math.round(base*c[3]*(0.97+rnd()*.06)/500)*500,status:pick(ST),chg:0}});Object.values(o).forEach(x=>{if(x.status==='up')x.chg=Math.round(5+rnd()*10)});return o})}));
// containers arriving to SPb (next vessels): lots
carriers.forEach(c=>{const a=c.rates[3].auto;if(a)a.status=['up','busy','wait'][c.id.charCodeAt(1)%3];const r4=c.rates[4].rail;if(r4)r4.status=c.id==='c4'?'wait':'busy';const r4a=c.rates[4].auto;if(r4a)r4a.status='busy';Object.values(c.rates[3]).forEach(x=>{if(x.status==='up'&&!x.chg)x.chg=9})});
const lots=[];const spbV=[{id:'berth',name:BERTH.name,eta:0},{id:'v1',eta:2},{id:'v2',eta:9}];
let n=0;spbV.forEach(v=>{const k=v.id==='berth'?7:v.id==='v1'?5:6;for(let i=0;i<k;i++){const ci=Math.floor(rnd()*CL.length);const dj=Math.floor(rnd()*DIRS.length);const big=rnd()<.62;lots.push({id:'L'+(++n),vessel:v.id,client:ci,dir:dj,type:big?40:20,qty:1+Math.floor(rnd()*(big?6:8)),mode:DIRS[dj][3]?(rnd()<.45?'rail':'auto'):'auto',markup:1.17+rnd()*.1})}});
const HOME=EN?{brand:'Northport Line',city:['','Rotterdam'],run:['','Duisburg'],view:'215 60 640 280',sales:[['','Daniel R.'],['','Ellen T.'],['','Ian M.']]}:{brand:'Baltic Line',city:['Петербург','St Petersburg'],run:['Москву','Moscow'],view:'430 28 520 270',sales:[['Денис Р.','Denis R.'],['Елена Т.','Elena T.'],['Игорь М.','Igor M.']]};
window.SEA_DATA={HOME,WP,ROUTES,ROUTE_NAME,DEST,VESSELS,BERTH,clients,MONTHS,fin,split,trucks,rail,team,sales,DIRS,carriers,lots,usdRate:92,kmPerDay:720};
})();
