"""Builds /about/ - who stands behind the site (author page, Person schema).
Uses the blog page shell (tools/blog.py).

    python3 tools/about.py
"""
import os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from blog import base, cta, ORIGIN, BRAND, ROOT  # noqa: E402


def cta_en():
    return cta().replace('<section class="blog-cta">', '<section class="blog-cta ab-en">', 1).replace(
        'Покажем на цифрах, что происходит в вашем бизнесе', 'Let’s see what your numbers say').replace(
        'Созвонимся на 15 минут, разберём вашу ситуацию и назовём стоимость до начала работ.',
        'A 15-minute call: we’ll look at your situation and give you a price before any work starts.').replace(
        '<span>Оставить заявку</span>', '<span>Send an enquiry</span>')


def main():
    url = f'{ORIGIN}/about/'
    content = f'''
 <section class="blog"><div class="container">
  <style>html[lang="en"] .ab-ru{{display:none}}html:not([lang="en"]) .ab-en{{display:none}}</style>
  <article class="post ab-ru" lang="ru">
   <div class="blog-head"><p class="blog-crumbs"><a href="/">Главная</a> / Обо мне</p>
   <h1>Леонид Балякин - аналитик и руководитель продукта</h1>
   <p class="post-lead">«Сайты и Аналитика» - это я. Делаю дашборды, бизнес- и продуктовую аналитику, сайты и внедряю ИИ для малого и среднего бизнеса. Работаю сам, без посредников и менеджеров: вы общаетесь напрямую с тем, кто считает ваши цифры.</p></div>
   <div class="post-body">
<h2>Опыт</h2>
<p>Больше 5 лет в продуктовой аналитике и управлении продуктом. Руководил продуктом в международном IT-проекте: настраивал сбор событий, строил воронки, когорты, удержание, LTV и ARPU, проверял изменения A/B-тестами. Один из результатов - +10% выручки от подписок после пересмотра тарифов и цен.</p>
<p>До аналитики работал логистом: звонил перевозчикам, сравнивал ставки по направлениям и размещал грузы. Поэтому дашборды для транспортных и экспедиторских компаний делаю не по учебнику, а зная, как эта работа устроена изнутри.</p>

<h2>Чем работаю</h2>
<ul>
 <li>Базы данных и обработка: SQL, PostgreSQL, ClickHouse.</li>
 <li>Дашборды: Power BI, Яндекс DataLens, веб-дашборды, Excel и Google-таблицы.</li>
 <li>Продуктовая аналитика: Яндекс Метрика, AppMetrica, GA4, собственное логирование событий.</li>
 <li>Источники данных: 1С, CRM, банковские выписки, кассы, маркетплейсы, таблицы.</li>
</ul>

<h2>Как работаю</h2>
<ul>
 <li>Сначала 15-минутный созвон: разбираемся, какие решения вы принимаете и каких цифр не хватает.</li>
 <li>Прототип за 48 часов на ваших выгрузках или на примере.</li>
 <li>Фиксированная цена до начала работ: дашборд под ключ - от 65 000 ₽.</li>
 <li>Работаю под NDA, как самозанятый - с договором и чеком.</li>
 <li>Первый месяц после запуска дорабатываю бесплатно.</li>
</ul>

<h2>Где я работаю</h2>
<p>Санкт-Петербург, удалённо по всей России и для зарубежных компаний. Живые примеры работ - в <a href="/dashboards/">каталоге дашбордов</a>, статьи - в <a href="/blog/">блоге</a>.</p>

<h2>Контакты</h2>
<ul>
 <li>Почта: <a href="mailto:analystleogroup@gmail.com">analystleogroup@gmail.com</a></li>
 <li>Сообщество ВКонтакте: <a href="https://vk.ru/analyticsbuild" rel="me noopener" target="_blank">vk.ru/analyticsbuild</a></li>
 <li>Канал на Дзене: <a href="https://dzen.ru/id/6ae34ff6e289c924db117c66" rel="me noopener" target="_blank">статьи об аналитике для бизнеса</a></li>
 <li>Яндекс Карты: <a href="https://yandex.ru/maps/org/66144833648/" rel="noopener" target="_blank">карточка «Сайты и Аналитика»</a></li>
</ul>
   </div>
  </article>
  <article class="post ab-en" lang="en">
   <div class="blog-head"><p class="blog-crumbs"><a href="/?lang=en">Home</a> / About</p>
   <h1>Leonid Baliakin - analyst and product lead</h1>
   <p class="post-lead">Websites &amp; Analytics is me. I build dashboards, business and product analytics, websites and AI tools for small and mid-sized businesses. No middlemen or account managers: you talk directly to the person working with your numbers.</p></div>
   <div class="post-body">
<h2>Experience</h2>
<p>5+ years in product analytics and product management. As a product lead in an international tech company I set up event tracking, built funnels, cohorts, retention, LTV and ARPU reports and validated changes with A/B tests. One result: +10% subscription revenue after reworking plans and pricing.</p>
<p>Before analytics I worked in freight logistics - calling carriers, comparing lane rates and placing loads. So dashboards for trucking and forwarding companies come from real hands-on experience.</p>
<h2>Tools</h2>
<ul>
 <li>Data: SQL, PostgreSQL, ClickHouse.</li>
 <li>Dashboards: Power BI, web dashboards, Excel and Google Sheets.</li>
 <li>Product analytics: GA4, event logging, mobile analytics SDKs.</li>
 <li>Sources: accounting/ERP systems, CRMs, bank statements, POS, marketplaces, spreadsheets.</li>
</ul>
<h2>How I work</h2>
<ul>
 <li>A 15-minute call to understand the decisions you make and the numbers you are missing.</li>
 <li>A prototype in 48 hours on your exports or sample data.</li>
 <li>A fixed price before work starts: dashboards from $1,300.</li>
 <li>NDA by default. The first month of fixes after launch is free.</li>
</ul>
<h2>Where I work</h2>
<p>Fully remote, with clients worldwide. See live examples in the <a href="/dashboards/?lang=en">dashboard catalogue</a>.</p>
<h2>Contact</h2>
<ul><li>Email: <a href="mailto:analystleogroup@gmail.com">analystleogroup@gmail.com</a></li></ul>
   </div>
  </article>
 </div></section>{cta().replace('<section class="blog-cta">','<section class="blog-cta ab-ru">',1)}{cta_en()}'''
    person = {"@context": "https://schema.org", "@type": "Person", "@id": f"{ORIGIN}/about/#person", "name": "Леонид Балякин",
              "alternateName": "Leonid Baliakin", "jobTitle": "Бизнес- и продуктовый аналитик, руководитель продукта",
              "description": "Частный аналитик: дашборды, бизнес- и продуктовая аналитика, сайты и внедрение ИИ для малого и среднего бизнеса.",
              "url": url, "email": "analystleogroup@gmail.com", "worksFor": {"@id": f"{ORIGIN}/#service", "@type": "ProfessionalService", "name": BRAND},
              "knowsAbout": ["Бизнес-аналитика", "Продуктовая аналитика", "Дашборды", "Power BI", "Яндекс DataLens", "SQL", "PostgreSQL", "ClickHouse", "A/B-тесты", "Логистика"],
              "sameAs": ["https://vk.ru/analyticsbuild", "https://dzen.ru/id/6ae34ff6e289c924db117c66", "https://yandex.ru/maps/org/66144833648/"]}
    ld = [{"@context": "https://schema.org", "@type": "ProfilePage", "url": url, "inLanguage": "ru", "mainEntity": {"@id": f"{ORIGIN}/about/#person"}}, person,
          {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": BRAND, "item": f"{ORIGIN}/"},
              {"@type": "ListItem", "position": 2, "name": "Обо мне", "item": url}]}]
    out = base('Леонид Балякин - аналитик данных и руководитель продукта',
               'Кто делает дашборды и аналитику «Сайты и Аналитика»: Леонид Балякин, больше 5 лет в продуктовой аналитике, опыт в логистике. SQL, Power BI, ClickHouse. Санкт-Петербург, удалённо.',
               url, ld, content,
               en=('Leonid Baliakin - Data Analyst and Product Lead', 'Who is behind Websites & Analytics: Leonid Baliakin, 5+ years in product analytics, background in freight logistics. Dashboards, analytics, websites and AI. Remote, worldwide.'))
    os.makedirs(os.path.join(ROOT, 'about'), exist_ok=True)
    open(os.path.join(ROOT, 'about', 'index.html'), 'w', encoding='utf-8').write(out)
    print('built /about/')


if __name__ == '__main__':
    main()
