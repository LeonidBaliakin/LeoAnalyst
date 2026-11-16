"""Extra text blocks for landing pages (built by tools/landing.py):
what you get, how we work, price, FAQ. Russian + English.
Each page: MORE[slug] = {'ru': {...}, 'en': {...}}."""

STEPS = {
 'ru': ('Как проходит работа', [
  ('Созвон 15 минут', 'Разбираем задачу: какие вопросы должен закрывать отчёт, где сейчас лежат данные, кто будет смотреть. Называем стоимость и срок до начала работ.'),
  ('Прототип за 48 часов', 'Собираем черновой дашборд на ваших выгрузках или на примере. Вы смотрите, что понятно, а что лишнее, - правим до старта основной работы.'),
  ('Подключение данных', 'Настраиваем автоматическую загрузку из 1С, CRM, банка, таблиц или сервисов. Проверяем цифры с вашей бухгалтерией, чтобы отчёт совпадал до рубля.'),
  ('Запуск и поддержка', 'Передаём доступы, показываем команде, как пользоваться. Первый месяц правим и дорабатываем бесплатно, дальше - по договорённости.'),
 ]),
 'en': ('How we work', [
  ('15-minute call', 'We go through the questions the report must answer, where your data lives and who will use it. You get a price and timeline before any work starts.'),
  ('Prototype in 48 hours', 'A draft dashboard on your exports or sample data. You tell us what is clear and what is noise - we adjust before the main work.'),
  ('Data connection', 'Automatic loading from your accounting system, CRM, bank, spreadsheets or apps. We reconcile the numbers with your accountant.'),
  ('Launch and support', 'We hand over access and train the team. The first month of fixes and tweaks is free.'),
 ]),
}

FAQ_COMMON = {
 'ru': [
  ('Данные у нас в беспорядке. Это проблема?', 'Нет, так почти у всех. Часть работы - навести порядок: убрать дубли, свести справочники, договориться, что считать выручкой. Это входит в стоимость.'),
  ('Насколько это безопасно?', 'Работаем под NDA, берём только тот доступ, который нужен для отчёта. Данные можно хранить на ваших серверах или в российском облаке.'),
 ],
 'en': [
  ('Our data is a mess. Is that a problem?', 'No - that is normal. Cleaning duplicates, aligning reference lists and agreeing on definitions is part of the job and included in the price.'),
  ('Is it secure?', 'We work under NDA and only request the access the report needs. Data can stay on your servers or in a cloud of your choice.'),
 ],
}

MORE = {
 'management-reporting': {
  'ru': {
   'get_h': 'Что даёт управленческая отчётность',
   'get': [
    ('Один экран вместо десяти файлов', 'Продажи, план-факт, прибыль, долги клиентов и остатки денег - в одном дашборде руководителя. Не нужно собирать отчёт из 1С, CRM и Excel вручную.'),
    ('Цифры каждое утро', 'Данные обновляются сами раз в день или чаще. Вы видите вчерашние результаты к началу рабочего дня, а не через неделю после закрытия месяца.'),
    ('Понятно, где отклонение', 'План-факт по отделам, менеджерам и направлениям. Красным подсвечено то, что отстаёт, - видно, с кем говорить и что исправлять.'),
    ('KPI для каждого уровня', 'Владельцу - деньги и прибыль, руководителю отдела - план и конверсия, менеджеру - его сделки. Каждый видит свои показатели.'),
   ],
   'price_h': 'Сколько стоит управленческая отчётность',
   'price': [
    'Дашборд руководителя под ключ - от 65 000 ₽. Цена зависит от числа источников данных и разделов: один отчёт по продажам из CRM дешевле, чем полная управленческая отчётность по 1С, банку и трём отделам.',
    'Срок - от 2 до 8 недель. Прототип показываем через 48 часов, точную стоимость называем после первого созвона и не меняем по ходу работы.',
   ],
   'faq': [
    ('Чем дашборд руководителя лучше отчётов в 1С?', 'В 1С десятки отчётов, и каждый нужно сформировать вручную. Дашборд собирает главное на одном экране, обновляется сам и объединяет 1С с CRM, банком и таблицами.'),
    ('Какие показатели включить в управленческую отчётность?', 'Обычно это выручка, валовая и чистая прибыль, план-факт, дебиторка, деньги на счетах и 3-5 KPI отделов. Точный набор подбираем на созвоне под ваши решения.'),
    ('Можно смотреть отчёт с телефона?', 'Да, дашборд открывается в браузере на телефоне и планшете. Можно настроить утреннюю сводку в Telegram.'),
   ],
  },
  'en': {
   'get_h': 'What management reporting gives you',
   'get': [
    ('One screen instead of ten files', 'Sales, budget vs actual, profit, receivables and cash in one KPI dashboard - no manual report building.'),
    ('Fresh numbers every morning', 'Data refreshes daily or more often, so you see yesterday’s results at the start of the day.'),
    ('Variances are obvious', 'Budget vs actual by team, manager and product line. What lags behind is highlighted.'),
    ('KPIs for every level', 'Owners see cash and profit, team leads see targets and conversion, managers see their deals.'),
   ],
   'price_h': 'How much it costs',
   'price': [
    'A KPI dashboard starts at $1,300. The price depends on the number of data sources and sections.',
    'Timeline: 2 to 8 weeks. You see a prototype in 48 hours and get a fixed price after the first call.',
   ],
   'faq': [
    ('Why a dashboard instead of accounting reports?', 'Accounting systems have dozens of reports you run by hand. A dashboard puts the essentials on one screen, refreshes itself and combines accounting with CRM, bank and spreadsheets.'),
    ('Which KPIs should be included?', 'Usually revenue, gross and net profit, budget vs actual, receivables, cash and 3-5 team KPIs. We pick the set on the first call.'),
    ('Can I view it on my phone?', 'Yes, it works in a mobile browser, and we can set up a morning summary in Telegram.'),
   ],
  },
 },
 'financial-dashboard': {
  'ru': {
   'get_h': 'Что покажет финансовый анализ',
   'get': [
    ('Почему нет прибыли', 'Разложим выручку на себестоимость, переменные и постоянные расходы. Станет видно, какие товары, клиенты или направления съедают прибыль.'),
    ('Рентабельность по каждому направлению', 'Маржа и рентабельность по товарам, услугам, филиалам и менеджерам. Можно решить, что развивать, а что закрыть.'),
    ('Деньги, а не только прибыль', 'Отчёт о движении денег: откуда пришли, куда ушли, сколько будет на счёте через месяц. Объясняет ситуацию «прибыль есть, а денег нет».'),
    ('План-факт и прогноз', 'Бюджет доходов и расходов, сравнение с фактом и прогноз до конца года. Видно заранее, где не хватит денег.'),
   ],
   'price_h': 'Сколько стоит финансовый дашборд',
   'price': [
    'Финансовый дашборд с анализом рентабельности - от 65 000 ₽. Разовый разбор «почему нет прибыли» по выгрузкам за 3-6 месяцев стоит меньше и делается за неделю.',
    'Полный финансовый дашборд с автообновлением из 1С и банка - 3-5 недель. Стоимость фиксируем после созвона.',
   ],
   'faq': [
    ('Чем это отличается от работы бухгалтера?', 'Бухгалтер ведёт учёт для налоговой. Финансовый анализ отвечает на вопросы владельца: где зарабатываем, где теряем и что изменить. Мы берём данные бухгалтерии и превращаем их в решения.'),
    ('Нужна ли финансовая модель?', 'Если планируете открыть точку, поднять цены или взять кредит - да. Соберём финансовую модель бизнеса, где можно менять цифры и сразу видеть результат.'),
    ('С какими данными работаете?', '1С, банковские выписки, Excel и Google-таблицы, кассы, маркетплейсы. Если данных мало, начнём с того, что есть.'),
   ],
  },
  'en': {
   'get_h': 'What the financial analysis shows',
   'get': [
    ('Why there is no profit', 'Revenue broken down into cost of goods, variable and fixed costs - you see which products, clients or lines eat the profit.'),
    ('Profitability by line', 'Margin and profitability by product, service, branch and manager.'),
    ('Cash, not just profit', 'Cash flow: where money came from, where it went and what the balance will be next month.'),
    ('Budget and forecast', 'Budget vs actual and a year-end forecast, so cash gaps are visible in advance.'),
   ],
   'price_h': 'How much it costs',
   'price': [
    'A financial dashboard with profitability analysis starts at $1,300. A one-off “why no profit” review on 3-6 months of exports costs less and takes a week.',
    'A full auto-refreshing financial dashboard takes 3-5 weeks. The price is fixed after the call.',
   ],
   'faq': [
    ('How is this different from bookkeeping?', 'Bookkeeping serves the tax office. Financial analysis answers the owner’s questions: where we earn, where we lose, what to change.'),
    ('Do I need a financial model?', 'If you plan a new location, a price change or a loan - yes. We build a model where you change inputs and see results.'),
    ('What data do you use?', 'Accounting systems, bank statements, Excel and Google Sheets, POS and marketplaces.'),
   ],
  },
 },
 '1c-power-bi': {
  'ru': {
   'get_h': 'Что вы получите',
   'get': [
    ('Дашборды из 1С без ручных выгрузок', 'Подключаемся к 1С (УТ, КА, ERP, Бухгалтерия, Розница) через OData, HTTP-сервис или регулярную выгрузку. Данные обновляются сами.'),
    ('Power BI, DataLens или свой веб-дашборд', 'Подберём инструмент под задачу и бюджет. Яндекс DataLens бесплатен и работает в России, Power BI привычен крупным компаниям, веб-дашборд открывается без лицензий.'),
    ('1С вместе с CRM и таблицами', 'Сводим 1С с amoCRM, Битрикс24, банком, маркетплейсами и Excel. Одна модель данных - одни и те же цифры у всех.'),
    ('Отчёты, которые понятны руководителю', 'Не сто вкладок, а несколько экранов с ответами: выручка, маржа, остатки, долги, план-факт.'),
   ],
   'price_h': 'Сколько стоят дашборды из 1С',
   'price': [
    'Дашборд из 1С или Power BI под ключ - от 65 000 ₽. Цена зависит от конфигурации 1С, числа источников и отчётов.',
    'Срок - 3-6 недель. Лицензии Power BI оплачиваются отдельно, DataLens и веб-дашборд - без лицензий.',
   ],
   'faq': [
    ('Нужен ли программист 1С?', 'Обычно нет: нужен доступ на чтение или регулярная выгрузка. Если в 1С нет нужных данных, подскажем, что доработать, и при необходимости подключим программиста.'),
    ('Что выбрать: Power BI или DataLens?', 'DataLens - бесплатно, хранение в России, быстро стартовать. Power BI - больше возможностей моделирования, но нужны лицензии. Веб-дашборд - когда нужен свой дизайн и доступ без логинов в BI.'),
    ('Будет ли тормозить 1С?', 'Нет. Данные забираем по расписанию в отдельное хранилище, дашборд работает с ним, а не напрямую с базой 1С.'),
   ],
  },
  'en': {
   'get_h': 'What you get',
   'get': [
    ('Dashboards without manual exports', 'We connect to your accounting/ERP system via API or scheduled exports. Data refreshes automatically.'),
    ('Power BI, DataLens or a web dashboard', 'We pick the tool for your task and budget.'),
    ('Accounting plus CRM and spreadsheets', 'One data model combining ERP, CRM, bank, marketplaces and Excel - everyone sees the same numbers.'),
    ('Reports managers understand', 'A few screens with answers: revenue, margin, stock, receivables, budget vs actual.'),
   ],
   'price_h': 'How much it costs',
   'price': [
    'A Power BI or web dashboard starts at $1,300, depending on sources and reports.',
    'Timeline: 3-6 weeks. Power BI licences are paid separately.',
   ],
   'faq': [
    ('Do we need a developer?', 'Usually not - read access or a scheduled export is enough.'),
    ('Power BI or a web dashboard?', 'Power BI offers rich modelling but needs licences. A web dashboard gives custom design and access without BI logins.'),
    ('Will it slow down our ERP?', 'No. Data is pulled on a schedule into a separate store; the dashboard reads from there.'),
   ],
  },
 },
 'logistics-analytics': {
  'ru': {
   'get_h': 'Что покажет дашборд автопарка',
   'get': [
    ('Загрузка парка и простои', 'Сколько машин в рейсе, на ремонте и в простое. Тонно-километры и пробег по каждой машине и водителю.'),
    ('Маржа по рейсам и клиентам', 'Выручка минус топливо, зарплата водителей, платные дороги и ремонты. Видно, какие рейсы и клиенты невыгодны.'),
    ('Свой и наёмный транспорт', 'Сравнение себестоимости своего парка и наёмных перевозчиков - когда выгоднее нанять, а когда купить машину.'),
    ('Ремонты и топливо', 'Расход топлива против нормы, стоимость ремонтов на километр, машины, которые пора менять.'),
   ],
   'price_h': 'Сколько стоит аналитика для транспортной компании',
   'price': [
    'Дашборд для транспортной или экспедиторской компании - от 65 000 ₽. Подключаем 1С, TMS, топливные карты, GPS-мониторинг и таблицы.',
    'Срок - 3-6 недель. Учёт автопарка в Google-таблицах для небольшого парка можно сделать быстрее и дешевле.',
   ],
   'faq': [
    ('У нас учёт в Excel. С этого можно начать?', 'Да. Наведём порядок в таблицах, сделаем шаблон учёта рейсов и автопарка, а дашборд будет обновляться из них.'),
    ('Подходит для экспедиторов?', 'Да: оборот, профит и маржа по направлениям, клиентам и менеджерам, конверсия заявок. Посмотрите пример дашборда экспедиторской компании.'),
    ('Можно подключить GPS и топливные карты?', 'Да, если у сервиса есть выгрузка или API. Так видно реальный пробег и расход топлива по каждой машине.'),
   ],
  },
  'en': {
   'get_h': 'What a fleet dashboard shows',
   'get': [
    ('Fleet utilization and downtime', 'Trucks on the road, in repair and idle; ton-km and mileage per truck and driver.'),
    ('Margin by trip and client', 'Revenue minus fuel, driver pay, tolls and repairs - unprofitable trips stand out.'),
    ('Own vs hired trucks', 'Cost comparison of your fleet vs subcontractors.'),
    ('Repairs and fuel', 'Fuel vs norm, repair cost per km and trucks due for replacement.'),
   ],
   'price_h': 'How much it costs',
   'price': [
    'A trucking or freight dashboard starts at $1,300. We connect TMS, fuel cards, GPS and spreadsheets.',
    'Timeline: 3-6 weeks.',
   ],
   'faq': [
    ('We track everything in Excel. Can we start there?', 'Yes. We tidy up the sheets and the dashboard refreshes from them.'),
    ('Does it work for freight forwarders?', 'Yes: turnover, profit and margin by lane, client and manager, plus quote conversion.'),
    ('Can you connect GPS and fuel cards?', 'Yes, if the service offers an export or API.'),
   ],
  },
 },
 'sales-analytics': {
  'ru': {
   'get_h': 'Что даёт аналитика продаж',
   'get': [
    ('Воронка продаж по шагам', 'Сколько заявок на каждом этапе и где теряется больше всего. Видно, какой шаг чинить первым.'),
    ('План-факт по менеджерам', 'Выручка, число сделок, средний чек и конверсия каждого менеджера против плана. Понятно, кому помочь.'),
    ('Каналы и окупаемость рекламы', 'Сколько стоит заявка и клиент из каждого канала, какой канал приносит выручку, а какой только клики.'),
    ('Маркетплейсы', 'Продажи, остатки, комиссии и реальная маржа по товарам на Wildberries и Ozon после всех удержаний.'),
   ],
   'price_h': 'Сколько стоит дашборд отдела продаж',
   'price': [
    'Дашборд по продажам из CRM - от 65 000 ₽. Подключаем amoCRM, Битрикс24, 1С, Яндекс Метрику, рекламные кабинеты и маркетплейсы.',
    'Срок - 2-5 недель. Чем больше источников, тем дольше, но первый экран с воронкой показываем через 48 часов.',
   ],
   'faq': [
    ('В CRM не все менеджеры ведут сделки. Что делать?', 'Дашборд быстро это покажет: видно, у кого пустые этапы и пропущенные поля. Часто после запуска дисциплина в CRM растёт сама.'),
    ('Можно сделать сквозную аналитику?', 'Да, связываем рекламу, сайт, CRM и оплаты, чтобы видеть выручку по каждому каналу и кампании.'),
    ('Подходит для интернет-магазина?', 'Да: заказы, конверсия сайта, средний чек, повторные покупки и маржа по товарам.'),
   ],
  },
  'en': {
   'get_h': 'What sales analytics gives you',
   'get': [
    ('Step-by-step funnel', 'Leads at each stage and where most are lost.'),
    ('Targets by manager', 'Revenue, deals, average order and conversion for each manager vs target.'),
    ('Channels and ad ROI', 'Cost per lead and per client by channel; which channels bring revenue.'),
    ('Marketplaces', 'Sales, stock, fees and real margin per product after all deductions.'),
   ],
   'price_h': 'How much it costs',
   'price': [
    'A sales dashboard from your CRM starts at $1,300. We connect CRM, web analytics, ad accounts and marketplaces.',
    'Timeline: 2-5 weeks, with the first funnel screen in 48 hours.',
   ],
   'faq': [
    ('Not every manager uses the CRM. What then?', 'The dashboard shows it right away - empty stages and missing fields. CRM discipline usually improves after launch.'),
    ('Can you do end-to-end attribution?', 'Yes - ads, website, CRM and payments linked to show revenue per campaign.'),
    ('Does it work for ecommerce?', 'Yes: orders, conversion, average order, repeat purchases and product margin.'),
   ],
  },
 },
 'ai-implementation': {
  'ru': {
   'get_h': 'Что можно поручить ИИ уже сейчас',
   'get': [
    ('ИИ-ассистент по данным компании', 'Сотрудник пишет в Telegram «сколько продали вчера в Москве?» и получает ответ с цифрами и ссылкой на источник за секунды, без аналитика.'),
    ('Обработка заявок и писем', 'ИИ разбирает входящие письма и заявки, заполняет CRM, готовит черновик ответа и передаёт человеку только сложные случаи.'),
    ('Документы и договоры', 'Поиск по базе договоров, проверка документов по чек-листу, выжимки из длинных файлов.'),
    ('Ответы клиентам', 'Бот на сайте или в мессенджере отвечает на частые вопросы по вашим правилам и прайсу, записывает и передаёт заявки менеджеру.'),
   ],
   'price_h': 'Сколько стоит внедрение ИИ',
   'price': [
    'Пилотный ИИ-ассистент под одну задачу - от 60 000 ₽. Сначала проверяем на ваших реальных вопросах, насколько точно он отвечает, и только потом масштабируем.',
    'Срок пилота - 3-4 недели. Оплата моделей (YandexGPT, GigaChat или другие) - по факту использования, обычно это несколько тысяч рублей в месяц.',
   ],
   'faq': [
    ('С чего начать внедрение ИИ в бизнес?', 'С одного процесса, где много однотипной ручной работы: ответы на вопросы, разбор заявок, отчёты. Считаем, сколько часов это занимает сейчас, и запускаем пилот.'),
    ('Не будет ли ИИ ошибаться?', 'Ассистент отвечает только по подключённым данным и показывает источник. Перед запуском проверяем точность на ваших вопросах, а спорные случаи передаются человеку.'),
    ('Куда уходят наши данные?', 'Можно использовать российские модели (YandexGPT, GigaChat) или модели на вашем сервере. ИИ получает доступ только к согласованным данным.'),
   ],
  },
  'en': {
   'get_h': 'What AI can take over today',
   'get': [
    ('AI assistant for company data', 'An employee asks in Telegram “how much did we sell yesterday?” and gets numbers with a source link in seconds.'),
    ('Leads and email processing', 'AI sorts incoming emails and leads, fills the CRM, drafts replies and escalates only hard cases.'),
    ('Documents and contracts', 'Search across contracts, checklist reviews and summaries of long files.'),
    ('Customer replies', 'A website or messenger bot answers FAQs using your rules and prices and passes leads to a manager.'),
   ],
   'price_h': 'How much it costs',
   'price': [
    'A pilot AI assistant for one task starts at $1,500. We test accuracy on your real questions before scaling.',
    'Pilot timeline: 3-4 weeks. Model usage is paid as you go.',
   ],
   'faq': [
    ('Where should we start with AI?', 'With one process full of repetitive manual work. We measure current hours and run a pilot.'),
    ('Won’t the AI make mistakes?', 'It answers only from connected data and cites the source. We test accuracy first and route unclear cases to a person.'),
    ('Where does our data go?', 'We can use models hosted in your region or on your own server, with access limited to agreed data.'),
   ],
  },
 },
 'website-development': {
  'ru': {
   'get_h': 'Какой сайт вы получите',
   'get': [
    ('Структура и тексты под клиента', 'Сначала разбираемся, кто ваш клиент и что ему важно, потом пишем тексты и собираем страницы. Сайт объясняет и продаёт, а не просто висит в интернете.'),
    ('Аналитика заявок с первого дня', 'Яндекс Метрика, цели и метки: видно, из какого канала пришла каждая заявка и сколько она стоила.'),
    ('Быстрый и удобный на телефоне', 'Большая часть посетителей приходит с телефона. Сайт быстро грузится и удобен на любом экране.'),
    ('Базовое SEO и передача доступов', 'Заголовки, описания, карта сайта, разметка для поисковиков. Публикуем на вашем домене и передаём все доступы.'),
   ],
   'price_h': 'Сколько стоит разработка сайта под ключ',
   'price': [
    'Лендинг или сайт-визитка с формой заявки и аналитикой - от 35 000 ₽. Многостраничный сайт услуг или каталог - от 60 000 ₽.',
    'Срок - от 1 до 4 недель. В цену входят тексты, дизайн, вёрстка, подключение аналитики и публикация.',
   ],
   'faq': [
    ('Чем вы отличаетесь от веб-студии?', 'Мы аналитики: сайт сразу собирается так, чтобы было видно, сколько заявок он приносит и откуда. После запуска можем показать, что улучшить по цифрам.'),
    ('Нужно ли платить за хостинг?', 'Простые сайты можно разместить бесплатно или за несколько сотен рублей в месяц. Домен оплачивается отдельно.'),
    ('Можно доработать мой текущий сайт?', 'Да: проведём аудит, подключим аналитику заявок, перепишем тексты и поправим SEO.'),
   ],
  },
  'en': {
   'get_h': 'What kind of website you get',
   'get': [
    ('Structure and copy for your client', 'We start with who your clients are and what matters to them, then write and build the pages.'),
    ('Lead analytics from day one', 'Goals and UTM tags show where each lead came from and what it cost.'),
    ('Fast and mobile-friendly', 'Most visitors come from phones - the site loads fast on any screen.'),
    ('Basic SEO and full handover', 'Titles, descriptions, sitemap and structured data. Published on your domain with all access handed over.'),
   ],
   'price_h': 'How much it costs',
   'price': [
    'A landing page with a lead form and analytics starts at $700. A multi-page service site starts at $1,500.',
    'Timeline: 1-4 weeks, including copy, design, build, analytics and publishing.',
   ],
   'faq': [
    ('How are you different from a web agency?', 'We are analysts: the site is built so you can see how many leads it brings and from where.'),
    ('Do I pay for hosting?', 'Simple sites can be hosted free or very cheaply. The domain is paid separately.'),
    ('Can you improve my current site?', 'Yes: audit, lead analytics, new copy and SEO fixes.'),
   ],
  },
 },
}
