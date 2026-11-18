"""Builds /dashboards/ - catalogue of example dashboards (Russian).
Uses the blog page shell (tools/blog.py) and texts from tools/dash_seo.py.

    python3 tools/hub.py
"""
import os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from blog import base, cta, ORIGIN, BRAND, ARROW, ROOT  # noqa: E402
from dash_seo import DASH  # noqa: E402

ORDER = ['finance', 'retail', 'beauty-salon', 'beauty-3d', 'dental', 'dental-3d', 'logistics', 'forwarding', 'sea-containers', 'product-analytics', 'staff-crm']
TAGS = {'finance': 'Финансы', 'retail': 'Опт и розница', 'beauty-salon': 'Салоны красоты', 'beauty-3d': 'Салоны красоты · 3D', 'dental': 'Стоматология', 'dental-3d': 'Стоматология · 3D',
        'logistics': 'Логистика · 3D', 'forwarding': 'Экспедирование', 'sea-containers': 'Морские перевозки · 3D',
        'product-analytics': 'Продуктовая аналитика', 'staff-crm': 'Команда и задачи'}

CSS = '''<style>
.hub-text{max-width:760px;font-size:17px;line-height:1.75;color:#24262c;margin:56px 0 0}
.hub-text h2{font-size:clamp(24px,3vw,34px);letter-spacing:-.035em;line-height:1.15;margin:40px 0 14px}
.hub-text p{margin:0 0 14px}.hub-text ul{margin:0 0 16px;padding-left:22px}.hub-text li{margin:0 0 8px}
.hub-text a{color:#1d63d8}
.post-card .go{margin-top:auto;font-size:13.5px;font-weight:650;color:#1d63d8}
</style>'''


def main():
    url = f'{ORIGIN}/dashboards/'
    cards = '\n'.join(
        f'   <a class="post-card" href="/dashboards/{s}/"><span class="post-tag">{TAGS[s]}</span><b>{DASH[s]["ru"]["h1"]}</b>'
        f'<span class="d">{DASH[s]["ru"]["card"]}</span><span class="go">Открыть пример →</span></a>' for s in ORDER)
    content = f'''{CSS}
 <section class="blog"><div class="container">
  <div class="blog-head"><p class="blog-crumbs"><a href="/">Главная</a> / Примеры дашбордов</p><h1>Примеры дашбордов для бизнеса</h1>
  <p>11 живых интерактивных дашбордов для разных отраслей: финансы, торговля, салоны красоты, стоматология, логистика, продуктовая аналитика и команда. Данные вымышленные, но всё работает: меняйте периоды, открывайте разделы, нажимайте на графики.</p></div>
  <div class="post-grid">
{cards}
  </div>
  <div class="hub-text">
   <h2>Что такое дашборд и зачем он бизнесу</h2>
   <p>Дашборд - это один экран, на котором собраны главные цифры бизнеса: выручка, прибыль, продажи, клиенты, остатки, загрузка сотрудников. Данные подтягиваются сами из 1С, CRM, кассы, банка и таблиц, поэтому не нужно каждую неделю собирать отчёт вручную.</p>
   <p>Хороший дашборд отвечает на конкретные вопросы руководителя: где теряются деньги, какой отдел не выполняет план, какие клиенты перестали покупать. Поэтому каждый пример выше построен вокруг вопросов отрасли, а не вокруг красивых графиков.</p>
   <h2>Как мы делаем дашборд под ваш бизнес</h2>
   <ul>
    <li>Созваниваемся на 15 минут и выясняем, какие решения вы принимаете и каких цифр не хватает.</li>
    <li>За 48 часов собираем прототип на ваших выгрузках или на одном из примеров.</li>
    <li>Подключаем источники данных и сверяем цифры с бухгалтерией.</li>
    <li>Запускаем, учим команду, первый месяц дорабатываем бесплатно.</li>
   </ul>
   <h2>Сколько стоит разработка дашборда</h2>
   <p>Создание дашборда под ключ - от 65 000 ₽, срок от 2 до 8 недель. Цена зависит от числа источников данных и разделов. Точную стоимость называем после первого созвона. Подробнее по направлениям: <a href="/management-reporting/">управленческая отчётность</a>, <a href="/financial-dashboard/">финансовый анализ</a>, <a href="/1c-power-bi/">дашборды из 1С и Power BI</a>, <a href="/sales-analytics/">аналитика продаж</a>, <a href="/logistics-analytics/">аналитика для логистики</a>, <a href="/dashboard-salona-krasoty/">дашборд для салона красоты</a>.</p>
  </div>
 </div></section>{cta()}'''
    ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": "Примеры дашбордов для бизнеса", "url": url, "inLanguage": "ru",
           "hasPart": [{"@type": "WebPage", "name": DASH[s]['ru']['h1'], "url": f"{ORIGIN}/dashboards/{s}/"} for s in ORDER]},
          {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": BRAND, "item": f"{ORIGIN}/"},
              {"@type": "ListItem", "position": 2, "name": "Примеры дашбордов", "item": url}]}]
    out = base('Примеры дашбордов для бизнеса: 9 интерактивных демо',
               'Живые примеры дашбордов для бизнеса: финансы, опт и розница, салон красоты, транспорт, экспедирование, продуктовая аналитика. Откройте и попробуйте сами.',
               url, ld, content)
    open(os.path.join(ROOT, 'dashboards', 'index.html'), 'w', encoding='utf-8').write(out)
    print('built /dashboards/')


if __name__ == '__main__':
    main()
