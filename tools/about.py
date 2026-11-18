"""Builds /about/ - who stands behind the site (author page, Person schema).
Uses the blog page shell (tools/blog.py).

    python3 tools/about.py
"""
import os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from blog import base, cta, ORIGIN, BRAND, ROOT  # noqa: E402


def main():
    url = f'{ORIGIN}/about/'
    content = f'''
 <section class="blog"><div class="container">
  <article class="post">
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
 </div></section>{cta()}'''
    person = {"@context": "https://schema.org", "@type": "Person", "@id": f"{ORIGIN}/about/#person", "name": "Леонид Балякин",
              "alternateName": "Leonid Baliakin", "jobTitle": "Бизнес- и продуктовый аналитик, руководитель продукта",
              "description": "Частный аналитик: дашборды, бизнес- и продуктовая аналитика, сайты и внедрение ИИ для малого и среднего бизнеса.",
              "url": url, "email": "analystleogroup@gmail.com", "worksFor": {"@id": f"{ORIGIN}/#service", "@type": "ProfessionalService", "name": BRAND},
              "address": {"@type": "PostalAddress", "addressLocality": "Санкт-Петербург", "addressCountry": "RU"},
              "knowsAbout": ["Бизнес-аналитика", "Продуктовая аналитика", "Дашборды", "Power BI", "Яндекс DataLens", "SQL", "PostgreSQL", "ClickHouse", "A/B-тесты", "Логистика"],
              "sameAs": ["https://vk.ru/analyticsbuild", "https://dzen.ru/id/6ae34ff6e289c924db117c66", "https://yandex.ru/maps/org/66144833648/"]}
    ld = [{"@context": "https://schema.org", "@type": "ProfilePage", "url": url, "inLanguage": "ru", "mainEntity": {"@id": f"{ORIGIN}/about/#person"}}, person,
          {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": BRAND, "item": f"{ORIGIN}/"},
              {"@type": "ListItem", "position": 2, "name": "Обо мне", "item": url}]}]
    out = base('Леонид Балякин - аналитик данных и руководитель продукта',
               'Кто делает дашборды и аналитику «Сайты и Аналитика»: Леонид Балякин, больше 5 лет в продуктовой аналитике, опыт в логистике. SQL, Power BI, ClickHouse. Санкт-Петербург, удалённо.',
               url, ld, content)
    os.makedirs(os.path.join(ROOT, 'about'), exist_ok=True)
    open(os.path.join(ROOT, 'about', 'index.html'), 'w', encoding='utf-8').write(out)
    print('built /about/')


if __name__ == '__main__':
    main()
