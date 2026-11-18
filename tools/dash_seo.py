"""Search text for the example dashboards (/dashboards/<slug>/).

Adds to each dashboard page: short title, static canonical, and a
collapsible «О дашборде» panel (H1 + 150-250 words, RU and EN).
Also used by tools/hub.py for the /dashboards/ catalogue.

    python3 tools/dash_seo.py
"""
import json, os, re, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGIN = 'https://analyticsbuild.com'

DASH = {
 'finance': {
  'service': ('/financial-dashboard/', 'Финансовый анализ бизнеса', 'Financial dashboard'),
  'ru': {
   'title': 'Финансовый дашборд: прибыль, расходы, план-факт - пример',
   'h1': 'Финансовый дашборд для бизнеса',
   'card': 'Выручка, расходы, прибыль, движение денег и план-факт бюджета на одном экране.',
   'p': ['Финансовый дашборд показывает владельцу главное о деньгах компании: сколько заработали, куда ушли расходы, сколько осталось прибыли и денег на счетах. Это пример на вымышленных данных - пощёлкайте периоды и разделы.',
         'Внутри: выручка и расходы по статьям, валовая и чистая прибыль, рентабельность, движение денежных средств, бюджет план-факт и прогноз до конца года. Отклонения от плана подсвечены, по каждой цифре можно провалиться до детали.'],
   'q': 'На какие вопросы отвечает: почему прибыль есть, а денег нет; какие расходы растут быстрее выручки; какое направление убыточно; хватит ли денег на зарплату и налоги через два месяца. Подходит владельцам, финансовым директорам и бухгалтерам, которые устали собирать отчёты в Excel.',
   'li': ['Данные берём из 1С, банковских выписок, касс и таблиц', 'Обновление каждый день без ручных выгрузок', 'Подходит для малого и среднего бизнеса, сетей и холдингов'],
   'end': 'Такой же дашборд соберём на ваших данных: прототип за 48 часов, запуск за 3-5 недель, от 65 000 ₽.',
  },
  'en': {'title': 'Financial Dashboard Example: Profit, Costs, Budget', 'h1': 'Financial dashboard for business',
         'card': 'Revenue, costs, profit, cash flow and budget vs actual on one screen.',
         'p': ['An interactive example with sample data: revenue and costs by category, gross and net profit, cash flow, budget vs actual and a year-end forecast.'],
         'li': ['Data from accounting, bank, POS and spreadsheets', 'Refreshes daily', 'For small and mid-sized companies'],
         'end': 'We can build the same on your data: prototype in 48 hours, launch in 3-5 weeks.'},
 },
 'retail': {
  'service': ('/sales-analytics/', 'Аналитика продаж', 'Sales analytics'),
  'ru': {
   'title': 'Дашборд для опта и розницы: клиенты, товары, склад - пример',
   'h1': 'Дашборд для оптовой и розничной торговли',
   'card': 'Клиенты на карте, маржа и остатки, ABC/XYZ-анализ, поставщики, долги и продажи из CRM.',
   'p': ['Дашборд для торговой компании собирает в одном месте продажи, товары, склад, поставщиков и деньги. Это пример на вымышленных данных: магазины и оптовые клиенты, тысячи позиций, несколько складов.',
         'Видно, какие товары приносят маржу, а какие лежат на складе мёртвым грузом (ABC/XYZ-анализ), кто из клиентов покупает реже, чем раньше, какие поставщики срывают сроки и сколько денег заморожено в дебиторке и остатках. Для цветочного магазина или небольшой сети - то же самое: какие позиции продаются, сколько уходит в списание, кто покупает повторно.'],
   'q': 'На какие вопросы отвечает: что заказать у поставщика на следующей неделе; какие товары вывести из ассортимента; какие клиенты перестали покупать; где деньги застряли на складе. Подходит оптовым компаниям, сетям магазинов, цветочным и продуктовым магазинам.',
   'li': ['Данные из 1С, кассы, CRM и складского учёта', 'Карта клиентов и продажи по регионам', 'Остатки, оборачиваемость и списания'],
   'end': 'Соберём такой дашборд под ваш магазин или оптовую компанию - от 65 000 ₽, прототип за 48 часов.',
  },
  'en': {'title': 'Retail & Wholesale Dashboard Example: Clients, Stock', 'h1': 'Retail and wholesale dashboard',
         'card': 'Client map, margins and stock, ABC/XYZ, suppliers, receivables and CRM sales.',
         'p': ['A sample-data example for a trading company: which products earn margin, which sit in stock, which clients buy less, which suppliers are late and how much cash is tied up in receivables and inventory.'],
         'li': ['Data from accounting, POS, CRM and warehouse', 'Client map and regional sales', 'Stock, turnover and write-offs'],
         'end': 'We can build one for your store or wholesale business.'},
 },
 'beauty-salon': {
  'service': ('/dashboard-salona-krasoty/', 'Дашборд для салона под ключ', 'Salon dashboard'),
  'ru': {
   'title': 'Дашборд салона красоты: записи, мастера, клиенты - пример',
   'h1': 'Дашборд для салона красоты',
   'card': 'Записи, загрузка мастеров, возвраты клиентов, каналы привлечения и план выручки.',
   'p': ['Дашборд для салона красоты, барбершопа, косметологии или студии маникюра. Пример на вымышленных данных показывает, что владелец видит каждое утро: сколько записей, как загружены мастера, сколько клиентов вернулось и выполняется ли план по выручке.',
         'Главная точка роста салона - повторные визиты. Дашборд показывает, какая доля новых клиентов приходит второй раз, у каких мастеров клиенты возвращаются чаще, какие услуги приносят больше денег за час работы и из каких каналов приходят клиенты, которые остаются.'],
   'q': 'На какие вопросы отвечает: почему в этом месяце выручка ниже; кого из мастеров загрузить; какие клиенты пропали и кому напомнить о записи; окупается ли реклама. Подходит одному салону и сети из нескольких точек.',
   'li': ['Данные из YCLIENTS, Arnica, DIKIDI или таблиц', 'Загрузка мастеров и пустые окна', 'Возвраты клиентов и средний чек'],
   'end': 'Покажем такой дашборд на данных вашего салона бесплатно - нужна выгрузка онлайн-записи за 3 месяца.',
  },
  'en': {'title': 'Beauty Salon Dashboard Example: Bookings, Staff, Clients', 'h1': 'Beauty salon dashboard',
         'card': 'Bookings, staff utilization, client retention, channels and revenue plan.',
         'p': ['A sample-data example for a salon, barbershop or nail studio: bookings, staff utilization, returning clients, revenue per service hour and the channels that bring loyal clients.'],
         'li': ['Data from booking software or spreadsheets', 'Staff utilization and empty slots', 'Retention and average ticket'],
         'end': 'We can show it on your salon’s data for free.'},
 },
 'beauty-3d': {
  'service': ('/dashboards/beauty-salon/', 'Обычная версия дашборда салона', 'Flat version'),
  'ru': {
   'title': '3D-дашборд салона красоты: финансы, мастера, склад - пример',
   'h1': '3D-дашборд салона красоты',
   'card': 'Салон в 3D: нажмите на зону - финансы, ресепшн, мастера, склад и аренда.',
   'p': ['Тот же дашборд салона красоты, но в виде 3D-модели помещения. Нажмите на зону - ресепшн, кабинеты мастеров, склад или кабинет управляющего - и откроются цифры этой части бизнеса. Пример на вымышленных данных.',
         'Так удобнее показывать данные команде: администратор видит записи и клиентов, мастер - свою загрузку и выручку, управляющий - финансы, расход материалов и коммунальные платежи. Формат подходит для салонов, клиник, кафе и любых бизнесов с понятным помещением.'],
   'q': 'На какие вопросы отвечает: какая зона салона приносит больше денег; сколько стоят аренда, материалы и коммуналка на одного клиента; где простаивают кресла и кабинеты. Хороший способ вовлечь команду в цифры без таблиц.',
   'li': ['Финансы, клиенты, мастера и склад', 'Расход материалов и аренда с коммуналкой', 'Переключение между 3D и обычным видом'],
   'end': 'Сделаем 3D- или обычный дашборд под ваш бизнес - от 65 000 ₽.',
  },
  'en': {'title': '3D Beauty Salon Dashboard Example', 'h1': '3D beauty salon dashboard',
         'card': 'A 3D salon: click a zone to see finance, front desk, staff, stock and rent.',
         'p': ['The salon dashboard as a 3D floor model: click the front desk, treatment rooms or stock room to open the numbers for that part of the business. Sample data.'],
         'li': ['Finance, clients, staff and stock', 'Materials, rent and utilities', 'Switch between 3D and flat view'],
         'end': 'We can build a 3D or flat dashboard for your business.'},
 },
 'logistics': {
  'service': ('/logistics-analytics/', 'Аналитика для транспортной компании', 'Logistics analytics'),
  'ru': {
   'title': 'Дашборд транспортной компании: парк, рейсы, маржа - пример',
   'h1': 'Дашборд транспортной компании',
   'card': 'Тонно-километры, загрузка парка, свой и наёмный транспорт, ремонты, водители и маржа.',
   'p': ['3D-дашборд для транспортной компании с собственным и наёмным парком. Пример на вымышленных данных: грузовики, рейсы, водители, ремонты и топливо.',
         'Руководитель видит, сколько машин в рейсе, на ремонте и в простое, сколько тонно-километров сделал каждый грузовик, какая маржа у рейсов и клиентов после топлива, зарплаты и платных дорог, и когда выгоднее нанять перевозчика, чем гонять свою машину.'],
   'q': 'На какие вопросы отвечает: какие машины простаивают; какой рейс оказался в минусе; сколько стоит километр с учётом ремонтов; кто из водителей тратит больше топлива. Подходит перевозчикам с парком от 5 машин и экспедиторам со своим транспортом.',
   'li': ['Данные из 1С, TMS, GPS и топливных карт', 'Учёт автопарка, ремонтов и водителей', 'Маржа по рейсам и клиентам'],
   'end': 'Соберём такой дашборд для вашего автопарка - от 65 000 ₽, прототип за 48 часов.',
  },
  'en': {'title': 'Trucking & Fleet Dashboard Example: Trips, Margin', 'h1': 'Trucking company dashboard',
         'card': 'Ton-km, fleet utilization, own vs hired trucks, repairs, drivers and margin.',
         'p': ['A 3D sample-data dashboard for a trucking company: trucks on the road, in repair and idle, ton-km per truck, margin per trip and client after fuel, pay and tolls.'],
         'li': ['Data from TMS, GPS and fuel cards', 'Fleet, repairs and drivers', 'Margin by trip and client'],
         'end': 'We can build one for your fleet.'},
 },
 'forwarding': {
  'service': ('/logistics-analytics/', 'Аналитика для логистики', 'Logistics analytics'),
  'ru': {
   'title': 'Дашборд экспедитора: оборот, профит, маржа - пример',
   'h1': 'Дашборд экспедиторской компании',
   'card': 'Оборот и профит, маржа по направлениям, клиенты, нагрузка сотрудников и конверсия заявок.',
   'p': ['Дашборд для экспедиторской компании: сколько перевезли и заработали, какие направления и клиенты дают профит, как загружены сотрудники и сколько запросов превращается в заказы. Пример на вымышленных данных.',
         'Экспедитору важно видеть не оборот, а профит - разницу между ставкой клиента и затратами на перевозчиков. Дашборд показывает маржу по каждому направлению, клиенту и менеджеру, а воронка заявок - на каком этапе теряются запросы на ставку.'],
   'q': 'На какие вопросы отвечает: какие направления самые прибыльные; кто из менеджеров приносит больше профита; почему клиенты не принимают ставки; сколько заявок в работе у каждого сотрудника. Подходит экспедиторам по автоперевозкам, ЖД, морю и авиа.',
   'li': ['Данные из 1С, CRM и таблиц ставок', 'Профит по направлениям и клиентам', 'Конверсия запросов в заказы'],
   'end': 'Сделаем такой дашборд для вашей компании - от 65 000 ₽.',
  },
  'en': {'title': 'Freight Forwarding Dashboard Example: Profit, Margin', 'h1': 'Freight forwarding dashboard',
         'card': 'Turnover and profit, margin by lane, clients, workload and quote conversion.',
         'p': ['Sample-data dashboard for a forwarder: profit by lane, client and manager, team workload and how many quotes turn into orders.'],
         'li': ['Data from accounting, CRM and rate sheets', 'Profit by lane and client', 'Quote-to-order conversion'],
         'end': 'We can build one for your company.'},
 },
 'sea-containers': {
  'service': ('/logistics-analytics/', 'Аналитика для логистики', 'Logistics analytics'),
  'ru': {
   'title': 'Дашборд контейнерных перевозок: суда, клиенты - пример',
   'h1': 'Дашборд морских контейнерных перевозок',
   'card': 'Суда в пути, контейнеры по линиям, клиенты, автовывоз и ЖД, ставки и продажи.',
   'p': ['3D-дашборд для компании, которая возит контейнеры морем. Пример на вымышленных данных: суда на карте, контейнеры по линиям и портам, клиенты, автовывоз и железная дорога, ставки и работа отдела продаж.',
         'Видно, где сейчас каждый контейнер и когда он придёт, какие линии и направления выгоднее, как меняются ставки фрахта, кто из клиентов приносит больше всего и где задерживается вывоз из порта.'],
   'q': 'На какие вопросы отвечает: когда придёт контейнер клиента; какая линия выгоднее на направлении; где простаивают контейнеры и растут штрафы за сверхнормативное хранение; какие клиенты дают основной оборот. Подходит экспедиторам и импортёрам.',
   'li': ['Суда и контейнеры в пути', 'Ставки и маржа по линиям', 'Автовывоз, ЖД и клиенты'],
   'end': 'Соберём такой дашборд под ваши перевозки - от 65 000 ₽.',
  },
  'en': {'title': 'Container Shipping Dashboard Example: Vessels, Clients', 'h1': 'Container shipping dashboard',
         'card': 'Vessels at sea, containers by carrier, clients, trucking and rail, rates and sales.',
         'p': ['A 3D sample-data dashboard for ocean container logistics: vessels on the map, containers by carrier and port, clients, inland delivery, freight rates and sales.'],
         'li': ['Vessels and containers in transit', 'Rates and margin by carrier', 'Trucking, rail and clients'],
         'end': 'We can build one for your shipments.'},
 },
 'product-analytics': {
  'service': ('/sales-analytics/', 'Аналитика продаж', 'Sales analytics'),
  'ru': {
   'title': 'Дашборд продуктовой аналитики: DAU, удержание, LTV - пример',
   'h1': 'Дашборд продуктовой аналитики',
   'card': 'DAU/WAU/MAU, удержание и когорты, воронки, LTV и ARPU.',
   'p': ['Дашборд для сайта, приложения или онлайн-сервиса: сколько людей приходит, сколько остаётся и где они уходят до покупки. Пример на вымышленных данных.',
         'Внутри: активная аудитория (DAU, WAU, MAU), удержание по когортам, воронка от первого визита до оплаты, LTV и ARPU, источники трафика. Видно, какой шаг воронки ломается и какие изменения стоит проверить A/B-тестом.'],
   'q': 'На какие вопросы отвечает: почему пользователи не доходят до оплаты; через сколько дней уходит большинство новичков; какой канал приносит платящих клиентов; окупается ли привлечение. Подходит интернет-магазинам, онлайн-школам, SaaS и мобильным приложениям.',
   'li': ['Данные из Яндекс Метрики, GA4, базы продукта', 'Воронки, когорты и удержание', 'LTV, ARPU и окупаемость каналов'],
   'end': 'Настроим продуктовую аналитику для вашего продукта - от 65 000 ₽.',
  },
  'en': {'title': 'Product Analytics Dashboard Example: DAU, Retention, LTV', 'h1': 'Product analytics dashboard',
         'card': 'DAU/WAU/MAU, retention cohorts, funnels, LTV and ARPU.',
         'p': ['A sample-data dashboard for a website, app or online service: active users, cohort retention, the funnel from first visit to payment, LTV, ARPU and traffic sources.'],
         'li': ['Data from web analytics and product database', 'Funnels, cohorts and retention', 'LTV, ARPU and channel payback'],
         'end': 'We can set up product analytics for you.'},
 },
 'staff-crm': {
  'service': ('/management-reporting/', 'Управленческая отчётность', 'Management reporting'),
  'ru': {
   'title': 'Дашборд команды и задач: загрузка, сроки, канбан - пример',
   'h1': 'Дашборд команды и задач',
   'card': 'Задачи на канбан-доске, загрузка сотрудников, учёт времени, встречи и скорость работы.',
   'p': ['Дашборд для руководителя команды: кто чем занят, какие задачи горят, сколько времени уходит на проекты и как быстро команда закрывает работу. Пример на вымышленных данных.',
         'Канбан-доска показывает задачи по этапам, отчёт по загрузке - кто перегружен, а у кого есть время, учёт часов - сколько стоит каждый проект, а графики скорости - становится ли команда быстрее.'],
   'q': 'На какие вопросы отвечает: кто из сотрудников перегружен; какие задачи висят дольше недели; сколько часов ушло на клиента и окупается ли он; успевает ли команда к сроку. Подходит агентствам, студиям, отделам продаж и проектным командам.',
   'li': ['Данные из Битрикс24, Jira, YouGile или таблиц', 'Загрузка и учёт времени сотрудников', 'Сроки и просрочки задач'],
   'end': 'Сделаем такой дашборд для вашей команды - от 65 000 ₽.',
  },
  'en': {'title': 'Team & Task Dashboard Example: Workload, Kanban', 'h1': 'Team and task dashboard',
         'card': 'Kanban tasks, employee workload, time tracking, meetings and delivery speed.',
         'p': ['A sample-data dashboard for team leads: tasks by stage, who is overloaded, hours per project and whether the team is getting faster.'],
         'li': ['Data from task trackers or spreadsheets', 'Workload and time tracking', 'Deadlines and overdue tasks'],
         'end': 'We can build one for your team.'},
 },
}

CSS = ('<style id="seo-about-css">'
 '.seo-about{position:fixed;left:16px;bottom:16px;z-index:41;max-width:min(440px,calc(100vw - 32px));font:400 14px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1d1f25}'
 '.seo-about>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:999px;background:rgba(255,255,255,.94);border:1px solid rgba(20,24,40,.12);box-shadow:0 12px 30px -14px rgba(20,24,40,.45);font-weight:650;font-size:12.5px;color:#30333b;backdrop-filter:blur(10px)}'
 '.seo-about>summary::-webkit-details-marker{display:none}'
 '.seo-about>summary::before{content:"i";display:grid;place-items:center;width:16px;height:16px;border-radius:50%;background:#17191e;color:#fff;font:700 10.5px/1 Georgia,serif}'
 '.seo-about[open]>summary{margin-bottom:8px}'
 '.seo-about .sa-box{background:#fff;border:1px solid rgba(20,24,40,.1);border-radius:18px;padding:18px 20px;box-shadow:0 24px 50px -20px rgba(20,24,40,.5);max-height:min(62vh,520px);overflow:auto}'
 '.seo-about h1{font-size:19px;line-height:1.25;margin:0 0 10px;letter-spacing:-.01em}'
 '.seo-about p{margin:0 0 10px;color:#41444d}.seo-about ul{margin:0 0 10px;padding-left:18px;color:#41444d}.seo-about li{margin:0 0 4px}'
 '.seo-about .sa-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}'
 '.seo-about .sa-links a{display:inline-block;padding:7px 12px;border-radius:999px;background:#17191e;color:#fff;text-decoration:none;font-weight:600;font-size:13px}'
 '.seo-about .sa-links a+a{background:#eef0f3;color:#17191e}'
 'html[lang="en"] .seo-about [lang="ru"],html:not([lang="en"]) .seo-about [lang="en"]{display:none}'
 '@media(max-width:700px){.seo-about{left:10px;bottom:74px}}'
 '</style>')


def panel(slug):
    d = DASH[slug]
    href, svc_ru, svc_en = d['service']
    e = html.escape

    def block(lang):
        c = d[lang]
        lis = ''.join(f'<li>{e(x)}</li>' for x in c['li'])
        ps = ''.join(f'<p>{e(x)}</p>' for x in c['p'] + ([c['q']] if 'q' in c else []))
        if lang == 'ru':
            links = f'<a href="/dashboards/">Все примеры дашбордов</a><a href="{href}">{e(svc_ru)}</a>'
            return f'<div lang="ru"><h1>{e(c["h1"])}</h1>{ps}<ul>{lis}</ul><p>{e(c["end"])}</p><div class="sa-links">{links}</div></div>'
        links = f'<a href="/?lang=en">Websites &amp; Analytics</a>'
        return f'<div lang="en"><p><b>{e(c["h1"])}</b></p>{ps}<ul>{lis}</ul><p>{e(c["end"])}</p><div class="sa-links">{links}</div></div>'

    return ('<!--seo-about-->' + CSS +
            '<details class="seo-about"><summary><span lang="ru">О дашборде</span><span lang="en">About</span></summary>'
            f'<div class="sa-box">{block("ru")}{block("en")}</div></details><!--/seo-about-->')


def apply(slug):
    p = os.path.join(ROOT, 'dashboards', slug, 'index.html')
    s = open(p, encoding='utf-8').read()
    d = DASH[slug]
    url = f'{ORIGIN}/dashboards/{slug}/'
    e = html.escape
    t_ru, t_en = d['ru']['title'], d['en']['title']
    s = re.sub(r'<title>[^<]*</title>', f'<title>{e(t_ru)}</title>', s, count=1)
    s = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{e(t_ru)}">', s, count=1)
    m = re.search(r'(<script type="application/json" id="seo-i18n">)(.*?)(</script>)', s, re.S)
    data = json.loads(m.group(2))
    data['ru']['title'], data['en']['title'] = t_ru, t_en
    s = s[:m.start(2)] + json.dumps(data, ensure_ascii=False) + s[m.end(2):]
    if 'rel="canonical"' not in s:
        s = s.replace('<link rel="alternate" hreflang="ru"', f'<link rel="canonical" href="{url}">\n<link rel="alternate" hreflang="ru"', 1)
    # noscript h1 -> p (the real H1 lives in the panel)
    s = re.sub(r'(<noscript>\s*)<h1>(.*?)</h1>', r'\1<p><b>\2</b></p>', s, flags=re.S)
    s = re.sub(r'<!--seo-about-->.*?<!--/seo-about-->', '', s, flags=re.S)
    s = s.replace('</body>', panel(slug) + '\n</body>', 1)
    open(p, 'w', encoding='utf-8').write(s)


if __name__ == '__main__':
    for slug in DASH:
        apply(slug)
        print('dash', slug, len(DASH[slug]['ru']['title']), len(DASH[slug]['en']['title']))
