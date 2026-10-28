"""Builds service (landing) pages from content dicts.

Usage: python3 tools/landing.py <slug>   (pages are defined in tools/pages_*.py)
Russian text goes into the HTML (indexed by Yandex); English goes into
<template id="page-en"> and is swapped in by /assets/landing.js.
"""
import json, html, sys, importlib, os

ORIGIN = 'https://analyticsbuild.com'
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'
LOGO = '<svg viewBox="0 0 64 64" fill="none"><path d="M14 46V31M27 46V19M40 46V27M52 46V13" stroke="#7EDBD3" stroke-width="7" stroke-linecap="round"/></svg>'
EXAMPLES = {
    'ru': [('logistics', 'Логистика'), ('sea-containers', 'Морские перевозки'), ('forwarding', 'Экспедирование'),
           ('staff-crm', 'Персонал и CRM'), ('finance', 'Финансы'), ('product-analytics', 'Продуктовая аналитика'), ('beauty-3d', 'Бьюти-сфера')],
    'en': [('logistics', 'Logistics'), ('sea-containers', 'Ocean shipping'), ('forwarding', 'Freight forwarding'),
           ('staff-crm', 'Team &amp; CRM'), ('finance', 'Finance'), ('product-analytics', 'Product analytics'), ('beauty-3d', 'Beauty salon')],
}
UI = {
    'ru': dict(home='Главная', see='Посмотреть пример', example_sub='Это живой дашборд на вымышленных данных. Пощёлкайте разделы — так будет выглядеть и ваш, только с вашими цифрами.',
               demo='Демо-данные', price_h='Сколько стоит', price_sub='Цена зависит от числа источников данных и экранов. Точный расчёт — в калькуляторе на главной.',
               calc='Рассчитать стоимость', faq='Частые вопросы', q='', lang=''),
    'en': dict(home='Home', see='See an example', example_sub='A live dashboard with sample data. Click through the sections — yours will look like this, with your numbers.',
               demo='Sample data', price_h='Pricing', price_sub='The price depends on the number of data sources and screens. Get an exact estimate in the calculator on the home page.',
               calc='Calculate the price', faq='FAQ', q='?lang=en', lang='en'),
}


def main_block(c, lang):
    u = UI[lang]; q = u['q']; amp = '&amp;' if q else '?'
    home = '/' + q
    dh = '' if q else ' data-home'
    out = [f'<main id="page">',
           f' <section class="hero"><div class="wrap">',
           f'  <p class="crumbs"><a href="{home}"{dh}>{u["home"]}</a> / {c["crumb"]}</p>',
           f'  <h1>{c["h1"]}</h1>',
           f'  <p class="lead">{c["lead"]}</p>',
           f'  <div class="hero-actions">',
           f'   <a class="btn btn-dark" href="/{q}{amp if q else "?"}lead=1"{dh}>{c["cta"]} {ARROW}</a>',
           f'   <a class="btn btn-ghost" href="#example">{u["see"]}</a>',
           f'  </div>',
           f'  <div class="facts">'] + [f'   <div class="fact"><b>{b}</b><span>{s}</span></div>' for b, s in c['facts']] + [
           f'  </div>', f' </div></section>', '',
           f' <section class="sec"><div class="wrap">', f'  <h2>{c["pains_h"]}</h2>', f'  <p class="sub">{c["pains_sub"]}</p>',
           f'  <div class="pains">'] + [f'   <div class="pain">{p}</div>' for p in c['pains']] + [
           f'  </div>', f' </div></section>', '',
           f' <section class="sec"><div class="wrap">', f'  <h2>{c["metrics_h"]}</h2>', f'  <p class="sub">{c["metrics_sub"]}</p>',
           f'  <div class="metrics">'] + [f'   <div class="metric"><b>{b}</b><p>{p}</p></div>' for b, p in c['metrics']] + [
           f'  </div>', f' </div></section>', '']
    ex_slug, ex_name = c['example']
    src = f'/dashboards/{ex_slug}/' + q
    out += [f' <section class="sec" id="example"><div class="wrap">', f'  <h2>{c["example_h"]}</h2>', f'  <p class="sub">{u["example_sub"]}</p>',
            f'  <div class="example">', f'   <div class="example-bar"><b>{ex_name}</b><span>{u["demo"]}</span></div>',
            f'   <div class="example-frame"><iframe src="{src}" title="{html.escape(ex_name)}" loading="lazy"></iframe></div>',
            f'  </div>', f'  <div class="more">']
    for slug, name in EXAMPLES[lang]:
        if slug == ex_slug:
            continue
        out.append(f'   <a href="/dashboards/{slug}/{q}"{dh}>{name}</a>')
    out += [f'  </div>', f' </div></section>', '',
            f' <section class="sec"><div class="wrap">', f'  <h2>{u["price_h"]}</h2>', f'  <p class="sub">{u["price_sub"]}</p>',
            f'  <div class="price">', f'   <div class="price-main">', f'    <small>{c["price_label"]}</small>',
            f'    <div class="sum">{c["price"]}</div>', f'    <p>{c["price_note"]}</p>',
            f'    <a class="btn btn-light" href="/{q}#calc"{dh}>{u["calc"]}</a>', f'   </div>',
            f'   <div class="price-side">', f'    <ul>'] + [f'     <li>{i}</li>' for i in c['includes']] + [
            f'    </ul>', f'   </div>', f'  </div>', f' </div></section>', '',
            f' <section class="sec"><div class="wrap">', f'  <h2>{u["faq"]}</h2>', f'  <div class="faq">'] + [
            f'   <details><summary>{qq}</summary><p>{a}</p></details>' for qq, a in c['faq']] + [
            f'  </div>', f' </div></section>', '',
            f' <section class="sec"><div class="wrap">', f'  <div class="cta">',
            f'   <div><h2>{c["final_h"]}</h2><p>{c["final_p"]}</p></div>',
            f'   <a class="btn" href="/{q}{amp if q else "?"}lead=1"{dh}>{c["final_btn"]} {ARROW}</a>',
            f'  </div>', f' </div></section>', '</main>']
    return '\n'.join(out)


def render(p):
    ru, en = p['ru'], p['en']
    url = f'{ORIGIN}/{p["slug"]}/'
    brand_ru, brand_en = 'Сайты и Аналитика', 'Websites & Analytics'
    t_ru, t_en = f'{ru["title"]} | {brand_ru}', f'{en["title"]} | {brand_en}'
    strip = lambda s: html.unescape(s.replace('<em>', '').replace('</em>', ''))
    ld = [{"@context": "https://schema.org", "@type": "Service", "name": strip(ru['crumb']), "serviceType": p['service_type'],
           "provider": {"@id": f"{ORIGIN}/#service"}, "areaServed": ["RU", "Worldwide"], "url": url,
           "offers": {"@type": "Offer", "priceCurrency": "RUB", "price": str(p['min_price']),
                      "priceSpecification": {"@type": "PriceSpecification", "minPrice": str(p['min_price']), "priceCurrency": "RUB"}}},
          {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": brand_ru, "item": f"{ORIGIN}/"},
              {"@type": "ListItem", "position": 2, "name": strip(ru['crumb']), "item": url}]},
          {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
              {"@type": "Question", "name": strip(qq), "acceptedAnswer": {"@type": "Answer", "text": strip(a)}} for qq, a in ru['faq']]}]
    e = html.escape
    head = f'''<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<script src="/dashboards/_shared/geo-locale.js?v=2"></script>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(t_ru)}</title>
<meta name="description" content="{e(ru["description"])}">
<link rel="alternate" hreflang="ru" href="{url}">
<link rel="alternate" hreflang="en" href="{url}?lang=en">
<link rel="alternate" hreflang="x-default" href="{url}?lang=en">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{brand_ru}">
<meta property="og:title" content="{e(t_ru)}">
<meta property="og:description" content="{e(ru["description"])}">
<meta property="og:image" content="{ORIGIN}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#fafafa">
<script type="application/json" id="seo-i18n">{json.dumps({"ru": {"title": t_ru, "description": ru["description"]}, "en": {"title": t_en, "description": en["description"]}}, ensure_ascii=False)}</script>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<link rel="stylesheet" href="/assets/landing.css?v=1">
</head>
<body>
<header class="top"><div class="wrap top-in">
 <a class="brand" href="/" data-home><i>{LOGO}</i><b data-en="Websites &amp; Analytics">Сайты и Аналитика</b></a>
 <a class="btn btn-dark" href="/?lead=1" data-home data-en="Send an enquiry">Оставить заявку</a>
</div></header>
'''
    foot = '''<footer class="foot"><div class="wrap foot-in">
 <span>© <span data-en="Websites &amp; Analytics">Сайты и Аналитика</span> · <a href="mailto:analystleogroup@gmail.com">analystleogroup@gmail.com</a></span>
 <nav><a href="/" data-home data-en="Home">Главная</a><a href="/privacy/" data-home data-en="Privacy policy">Политика конфиденциальности</a></nav>
</div></footer>
<script src="/assets/landing.js?v=1"></script>
</body>
</html>
'''
    return head + '\n' + main_block(ru, 'ru') + '\n\n<template id="page-en">\n' + main_block(en, 'en') + '\n</template>\n\n' + foot


if __name__ == '__main__':
    sys.path.insert(0, os.path.dirname(__file__))
    slug = sys.argv[1]
    mod = importlib.import_module('pages_' + slug.replace('-', '_'))
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.makedirs(os.path.join(root, slug), exist_ok=True)
    with open(os.path.join(root, slug, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(render(mod.PAGE))
    print('built', slug)
