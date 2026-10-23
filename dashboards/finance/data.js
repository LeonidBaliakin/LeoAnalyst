/* LeoAnalyst / Finance OS. Synthetic, deterministic demonstration ledger.
   All amounts are stored in RUB, base period through 2026-10-22 (last completed day).
   Unit, day, P&L, budgets, and forecast share this single source of truth. */
(function () {
  'use strict';
  const BASE_DATE = '2026-10-22';
  const RUB_PER_USD = 92; // demo assumption, NOT a live exchange rate
  const units = [
    {id:'digital',ru:'Онлайн-продукт',en:'Digital product',short:'DIG',daily:220000,accent:'#c6e1ff'},
    {id:'services',ru:'Услуги',en:'Services',short:'SRV',daily:143000,accent:'#c4eadd'},
    {id:'retail',ru:'Розница',en:'Retail',short:'RTL',daily:92000,accent:'#f9d6bc'}
  ];
  const categories = [
    {id:'payroll',ru:'Зарплаты',en:'Payroll',share:.33,color:'#657de9'},
    {id:'marketing',ru:'Маркетинг',en:'Marketing',share:.19,color:'#f39e72'},
    {id:'operations',ru:'Операционные',en:'Operations',share:.20,color:'#b1a3ed'},
    {id:'rent',ru:'Аренда',en:'Rent',share:.11,color:'#77b7ca'},
    {id:'technology',ru:'ИТ и сервисы',en:'Technology',share:.10,color:'#afc66c'},
    {id:'taxes',ru:'Налоги и сборы',en:'Taxes & fees',share:.07,color:'#e0b669'}
  ];
  const incomeStreams = [
    {id:'regular',ru:'Основная выручка',en:'Core revenue'},
    {id:'repeat',ru:'Повторные продажи',en:'Repeat purchases'}
  ];
  const partners = [
    {ru:'Партнёрский канал',en:'Partner channel'},
    {ru:'Прямые продажи',en:'Direct sales'},
    {ru:'Клиенты B2B',en:'B2B customers'},
    {ru:'Платформа оплат',en:'Payment platform'},
    {ru:'Корпоративный клиент',en:'Corporate customer'},
    {ru:'Онлайн-магазин',en:'Online store'}
  ];
  const costPartners = {
    payroll:[['Расчётный счёт персонала','Staff payroll account']],
    marketing:[['Рекламные кампании','Advertising campaigns'],['Маркетинговое агентство','Marketing agency']],
    operations:[['Поставщики','Suppliers'],['Операционные подрядчики','Operations vendors']],
    rent:[['Арендодатель','Landlord']],
    technology:[['Облачная инфраструктура','Cloud infrastructure'],['Лицензии ПО','Software subscriptions']],
    taxes:[['Налоговые платежи','Tax payments']]
  };
  function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
  function dayUTC(s){return new Date(s+'T00:00:00Z');}
  function iso(d){return d.toISOString().slice(0,10);}
  function generate(){
    const rand=rng(41026), result=[];let n=1;
    const start=dayUTC('2025-09-15'),end=dayUTC(BASE_DATE);
    for(let t=start.getTime();t<=end.getTime();t+=86400000){
      const d=new Date(t),date=iso(d),day=d.getUTCDay(),month=d.getUTCMonth();
      const seasonal= day===0?.79:day===6?.88:1;
      const seasonalYear=1+.085*Math.sin(2*Math.PI*(month+2)/12);
      const growing= .89+(t-start.getTime())/(end.getTime()-start.getTime())*.24;
      for(const unit of units){
        const rev=Math.round(unit.daily*seasonal*seasonalYear*growing*(.87+rand()*.28));
        const split=.55+rand()*.18;
        for(let j=0;j<2;j++){
          const partner=partners[Math.floor(rand()*partners.length)];
          result.push({id:'TX-'+String(n++).padStart(6,'0'),date,unit:unit.id,type:'income',category:incomeStreams[j].id,amount:j===0?Math.round(rev*split):Math.round(rev*(1-split)),partnerRu:partner.ru,partnerEn:partner.en,status:'completed'});
        }
        const ratio=.675+Math.sin(t/86400000*.09)*.016+rand()*.055;
        const expenses=Math.round(rev*ratio);
        let remaining=expenses;
        categories.forEach((cat,j)=>{
          let amount=j===categories.length-1?remaining:Math.round(expenses*cat.share*(.92+rand()*.16));
          if(amount>remaining)amount=remaining;
          remaining-=amount;
          const vendors=costPartners[cat.id], vendor=vendors[Math.floor(rand()*vendors.length)];
          result.push({id:'TX-'+String(n++).padStart(6,'0'),date,unit:unit.id,type:'expense',category:cat.id,amount,partnerRu:vendor[0],partnerEn:vendor[1],status:'completed'});
        });
      }
    }
    return result;
  }
  window.FINANCE_DATA={BASE_DATE,RUB_PER_USD,units,categories,incomeStreams,generateLedger:generate};
})();
