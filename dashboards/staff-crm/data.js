/* LeoAnalyst · Ritm team workspace demo — synthetic data, fictional people and projects */
(function(){
 function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
 const R=rng(7311);
 const today=new Date();today.setHours(0,0,0,0);const DAY=864e5,T0=today.getTime();
 const depts=[{id:'dev',ru:'Разработка',en:'Engineering'},{id:'design',ru:'Дизайн',en:'Design'},{id:'marketing',ru:'Маркетинг',en:'Marketing'},{id:'sales',ru:'Продажи',en:'Sales'},{id:'mgmt',ru:'Управление',en:'Management'}];
 const people=[
  {id:'p1',ru:'Ирина Соколова',en:'Irina Sokolova',role:{ru:'Руководитель проектов',en:'Project lead'},dept:'mgmt',city:{ru:'Санкт-Петербург',en:'St Petersburg'},status:'online',hue:20},
  {id:'p2',ru:'Максим Егоров',en:'Maxim Egorov',role:{ru:'Бэкенд-разработчик',en:'Backend developer'},dept:'dev',city:{ru:'Санкт-Петербург',en:'St Petersburg'},status:'online',hue:210},
  {id:'p3',ru:'Полина Руднева',en:'Polina Rudneva',role:{ru:'Продуктовый дизайнер',en:'Product designer'},dept:'design',city:{ru:'Москва',en:'Moscow'},status:'online',hue:350},
  {id:'p4',ru:'Артём Ли',en:'Artem Li',role:{ru:'Фронтенд-разработчик',en:'Frontend developer'},dept:'dev',city:{ru:'Казань',en:'Kazan'},status:'away',hue:160},
  {id:'p5',ru:'Мария Ковач',en:'Maria Kovach',role:{ru:'Графический дизайнер',en:'Brand designer'},dept:'design',city:{ru:'Москва',en:'Moscow'},status:'away',hue:45},
  {id:'p6',ru:'Денис Орлов',en:'Denis Orlov',role:{ru:'Тестировщик',en:'QA engineer'},dept:'dev',city:{ru:'Новосибирск',en:'Novosibirsk'},status:'offline',hue:265},
  {id:'p7',ru:'Ольга Миронова',en:'Olga Mironova',role:{ru:'Маркетолог',en:'Marketing manager'},dept:'marketing',city:{ru:'Санкт-Петербург',en:'St Petersburg'},status:'online',hue:300},
  {id:'p8',ru:'Кирилл Белов',en:'Kirill Belov',role:{ru:'Менеджер по продажам',en:'Account executive'},dept:'sales',city:{ru:'Москва',en:'Moscow'},status:'online',hue:120},
  {id:'p9',ru:'Анна Ким',en:'Anna Kim',role:{ru:'Аккаунт-менеджер',en:'Account manager'},dept:'sales',city:{ru:'Екатеринбург',en:'Yekaterinburg'},status:'offline',hue:190},
  {id:'p10',ru:'Глеб Тихонов',en:'Gleb Tikhonov',role:{ru:'Контент-менеджер',en:'Content manager'},dept:'marketing',city:{ru:'Санкт-Петербург',en:'St Petersburg'},status:'away',hue:30}
 ];
 const projects=[
  {id:'pr1',ru:'Мобильное приложение доставки',en:'Delivery mobile app',client:{ru:'Сеть пекарен',en:'Bakery chain'},due:T0+12*DAY,progress:62,icon:'bars',color:'#2c55c9',status:'running'},
  {id:'pr2',ru:'CRM для автосалона',en:'Car dealership CRM',client:{ru:'Автосалон',en:'Car dealership'},due:T0+5*DAY,progress:84,icon:'ring',color:'#1d9a8a',status:'running'},
  {id:'pr3',ru:'Аудит дизайн-системы',en:'Design system audit',client:{ru:'Внутренний',en:'Internal'},due:T0+3*DAY,progress:91,icon:'plus',color:'#e0603d',status:'review'},
  {id:'pr4',ru:'Редизайн интернет-магазина',en:'E-store redesign',client:{ru:'Магазин одежды',en:'Fashion store'},due:T0+21*DAY,progress:35,icon:'half',color:'#e8a32e',status:'running'},
  {id:'pr5',ru:'Сайт стоматологии',en:'Dental clinic website',client:{ru:'Стоматология',en:'Dental clinic'},due:T0+9*DAY,progress:48,icon:'stack',color:'#7a5cd6',status:'running'},
  {id:'pr6',ru:'Отчётность для сети кофеен',en:'Coffee chain reporting',client:{ru:'Сеть кофеен',en:'Coffee chain'},due:T0+16*DAY,progress:22,icon:'dot',color:'#4f8de0',status:'running'},
  {id:'pr7',ru:'Чат-бот поддержки',en:'Support chatbot',client:{ru:'Служба доставки',en:'Courier service'},due:T0+30*DAY,progress:8,icon:'bars',color:'#c4458a',status:'pending'}
 ];
 const tags=[{id:'dev',ru:'Разработка',en:'Engineering',c:'#2c55c9'},{id:'design',ru:'Дизайн',en:'Design',c:'#d0457a'},{id:'marketing',ru:'Маркетинг',en:'Marketing',c:'#d48a1c'},{id:'sales',ru:'Продажи',en:'Sales',c:'#1d9a8a'},{id:'qa',ru:'Тестирование',en:'QA',c:'#7a5cd6'}];
 const T=(ru,en,tag,prio,status,dueIn,proj,who,progress,comments)=>({ru,en,tag,prio,status,due:T0+dueIn*DAY,project:proj,assignees:who,progress,comments});
 let tasks=[
  T('Сохранённые фильтры в отчётах','Saved filters for reports','dev','medium','todo',6,'pr6',['p2'],0,2),
  T('Документация по API','Write API endpoint docs','dev','low','todo',8,'pr2',['p2'],0,1),
  T('Цепочка приветственных писем','Onboarding email sequence','marketing','low','todo',12,'pr7',['p7','p10'],0,0),
  T('Ускорить загрузку до 2 секунд','Cut page load under 2 seconds','dev','high','todo',5,'pr4',['p4'],0,3),
  T('Сценарии чат-бота: возвраты','Chatbot flows: refunds','dev','medium','todo',14,'pr7',['p2','p6'],0,1),
  T('Коммерческое предложение для кофеен','Proposal deck for coffee chain','sales','high','todo',3,'pr6',['p8'],0,4),
  T('Экраны входа и регистрации','Design sign-in & sign-up screens','design','high','progress',2,'pr1',['p3','p5'],45,4),
  T('Вход по коду из SMS','SMS code sign-in','dev','high','progress',3,'pr1',['p2'],60,7),
  T('Обновление сайта агентства','Agency website refresh','marketing','medium','progress',4,'pr5',['p7','p4'],55,3),
  T('Анонс запуска в соцсетях','Launch announcement posts','marketing','medium','progress',8,'pr5',['p10'],30,1),
  T('Воронка продаж в CRM','Sales pipeline in CRM','dev','high','progress',5,'pr2',['p4','p8'],70,5),
  T('Карточка товара: новый макет','Product page layout','design','medium','progress',9,'pr4',['p3'],40,2),
  T('Проверка в Safari и Firefox','Safari & Firefox regression pass','qa','medium','review',1,'pr3',['p6'],90,5),
  T('Набор иллюстраций бренда','Brand illustration set','design','medium','review',2,'pr3',['p5'],85,6),
  T('Договор и счёт клиенту','Contract & invoice for client','sales','high','review',1,'pr2',['p9'],95,2),
  T('Очистка репозитория','Monorepo clean-up','dev','low','done',-3,'pr3',['p2'],100,2),
  T('Виджеты аналитики на дашборде','Dashboard analytics widgets','dev','high','done',-2,'pr6',['p4','p3'],100,4),
  T('Стартовая встреча с клиентом','Kick-off with client','sales','medium','done',-5,'pr1',['p1','p8'],100,4),
  T('Тексты для главной страницы','Homepage copy','marketing','low','done',-1,'pr5',['p10'],100,1),
  T('Тест оплаты картой','Card payment test run','qa','high','done',-4,'pr1',['p6'],100,3)
 ];
 tasks=tasks.map((t,i)=>({id:'t'+(i+1),...t}));
 // history: completed tasks per day & hours logged per person, last 120 days
 const history=[];for(let i=119;i>=0;i--){const d=T0-i*DAY,dow=new Date(d).getDay();const wk=dow===0||dow===6;const trend=1+0.25*(1-i/120);const base=wk?1.2:7.4;history.push({t:d,done:Math.max(0,Math.round(base*trend*(0.65+R()*0.7))),hours:Math.round((wk?6:58)*(0.8+R()*0.35)*trend*10)/10,ontime:Math.min(1,0.78+R()*0.18)});}
 const timeLog={};people.forEach(p=>{timeLog[p.id]=Math.round(60+R()*90);});
 const projectHours={};projects.forEach(p=>{projectHours[p.id]=Math.round(40+R()*180);});
 const events=[];const evTitles=[['Планёрка команды','Team stand-up','mgmt'],['Созвон с клиентом','Client call','sales'],['Дизайн-ревью','Design review','design'],['Демо спринта','Sprint demo','dev'],['Контент-план на месяц','Monthly content plan','marketing'],['Разбор метрик','Metrics review','mgmt'],['Релиз в магазины','Store release','dev']];
 for(let i=-20;i<=40;i++){const d=T0+i*DAY,dow=new Date(d).getDay();if(dow===0||dow===6)continue;if(R()<0.55){const e=evTitles[Math.floor(R()*evTitles.length)];const h=10+Math.floor(R()*8);events.push({t:d,ru:e[0],en:e[1],kind:e[2],start:h,end:h+1+(R()<0.3?1:0),project:projects[Math.floor(R()*projects.length)].id,people:[people[Math.floor(R()*10)].id,people[Math.floor(R()*10)].id].filter((v,i,a)=>a.indexOf(v)===i)});}}
 events.push({t:T0,ru:'Созвон с клиентом: автосалон',en:'Check-in with the dealership',kind:'sales',start:14,end:15,project:'pr2',people:['p1','p8','p4'],featured:true});
 window.RITM_DATA={depts,people,projects,tags,tasks,history,timeLog,projectHours,events,today:T0,DAY};
})();
