"""Builds service (landing) pages as trimmed copies of the home page.

Each landing page = home page header + hero (texts for one search query)
+ one example dashboard + enquiry block. Same styles, scripts and lead form.
Rebuild every landing page after changing index.html:

    python3 tools/landing.py            # all pages
    python3 tools/landing.py <slug>     # one page

Page texts live in tools/pages.py.
"""
import json, os, re, sys, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pages import PAGES  # noqa: E402
from more import MORE, STEPS, FAQ_COMMON  # noqa: E402

ORIGIN = 'https://analyticsbuild.com'
BRAND_RU, BRAND_EN = 'Сайты и Аналитика', 'Websites & Analytics'
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'
CSS = '''
/* landing pages */
.lp-example{padding:24px 0 72px}
.lp-frame{background:var(--board);border-radius:28px;padding:14px}
.lp-frame-bar{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:4px 8px 12px;color:#fff;font-size:15px;font-weight:700}
.lp-frame-bar span{font-size:13px;font-weight:500;color:#a9afbd}
.lp-frame-in{border-radius:18px;overflow:hidden;background:#fff;height:min(720px,80vh)}
.lp-frame-in iframe{display:block;width:100%;height:100%;border:0}
.lp-contact{padding:0 0 88px}
.lp-card{background:var(--board);color:#fff;border-radius:28px;padding:clamp(28px,5vw,56px);display:flex;align-items:center;justify-content:space-between;gap:28px;flex-wrap:wrap}
.lp-card small{display:block;font-size:12.5px;font-weight:800;letter-spacing:.08em;color:var(--mint);margin-bottom:12px}
.lp-card h2{color:#fff;margin:0 0 10px;font-size:clamp(26px,3.6vw,40px);line-height:1.1;letter-spacing:-.035em;max-width:20ch}
.lp-card p{margin:0;color:#a9afbd;max-width:48ch;line-height:1.55}
.lp-card .solid-btn{background:#fff;color:var(--ink)}
/* text blocks */
.lp-more{background:transparent;padding:16px 0 72px}
.lp-more h2{font-size:clamp(28px,3.6vw,46px);letter-spacing:-.045em;line-height:1.1;margin:0 0 28px;max-width:22ch}
.lp-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.lp-item{background:#fff;border:1px solid var(--line);border-radius:22px;padding:26px}
.lp-item h3{margin:0 0 10px;font-size:19px;letter-spacing:-.02em;line-height:1.3}
.lp-item p{margin:0;color:#5b5e67;line-height:1.65;font-size:15.5px}
.lp-steps{counter-reset:st;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;list-style:none;margin:0;padding:0}
.lp-steps li{counter-increment:st;background:#fff;border:1px solid var(--line);border-radius:22px;padding:24px}
.lp-steps li::before{content:counter(st);display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--board);color:#fff;font-weight:750;font-size:15px;margin-bottom:14px}
.lp-steps h3{margin:0 0 8px;font-size:17.5px;letter-spacing:-.02em}
.lp-steps p{margin:0;color:#5b5e67;line-height:1.6;font-size:15px}
.lp-price{background:#fff;border:1px solid var(--line);border-radius:26px;padding:clamp(24px,4vw,40px);max-width:860px}
.lp-price p{margin:0 0 12px;font-size:17px;line-height:1.7;color:#30333b}.lp-price p:last-child{margin:0}
.lp-faq{max-width:860px;display:grid;gap:10px}
.lp-faq details{background:#fff;border:1px solid var(--line);border-radius:18px;padding:0 22px}
.lp-faq summary{cursor:pointer;list-style:none;padding:18px 28px 18px 0;font-weight:680;font-size:17px;position:relative}
.lp-faq summary::-webkit-details-marker{display:none}
.lp-faq summary::after{content:'+';position:absolute;right:0;top:14px;font-size:24px;font-weight:400;color:#8b8e96;transition:transform .2s var(--ease)}
.lp-faq details[open] summary::after{transform:rotate(45deg)}
.lp-faq details p{margin:0 0 18px;color:#5b5e67;line-height:1.65}
@media(max-width:900px){.lp-steps{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.lp-grid,.lp-steps{grid-template-columns:1fr}.lp-more{padding:8px 0 48px}}
@media(max-width:600px){.lp-frame{border-radius:22px;padding:8px}.lp-frame-in{height:72vh;border-radius:14px}.lp-example{padding:8px 0 48px}}
'''


def faq_items(slug, lang):
    return MORE[slug][lang]['faq'] + FAQ_COMMON[lang]


def more_keys(slug, lang):
    m, (st_h, steps) = MORE[slug][lang], STEPS[lang]
    k = {'m_get_h': m['get_h'], 'm_st_h': st_h, 'm_pr_h': m['price_h'], 'm_faq_h': 'Частые вопросы' if lang == 'ru' else 'FAQ'}
    for i, (t, x) in enumerate(m['get']):
        k[f'm_g{i}t'], k[f'm_g{i}p'] = t, x
    for i, (t, x) in enumerate(steps):
        k[f'm_s{i}t'], k[f'm_s{i}p'] = t, x
    for i, x in enumerate(m['price']):
        k[f'm_pr{i}'] = x
    for i, (q, a) in enumerate(faq_items(slug, lang)):
        k[f'm_q{i}'], k[f'm_a{i}'] = q, a
    if m.get('metrics'):
        k['m_mt_h'] = m['metrics_h']
        for i, (t, x) in enumerate(m['metrics']):
            k[f'm_mt{i}t'], k[f'm_mt{i}p'] = t, x
    return k


def more_html(slug):
    k = more_keys(slug, 'ru')
    m, steps = MORE[slug]['ru'], STEPS['ru'][1]
    t = lambda key, tag, cls='': f'<{tag}{cls} data-i18n="{key}">{k[key]}</{tag}>'
    get = ''.join(f'<div class="lp-item">{t(f"m_g{i}t", "h3")}{t(f"m_g{i}p", "p")}</div>' for i in range(len(m['get'])))
    st = ''.join(f'<li>{t(f"m_s{i}t", "h3")}{t(f"m_s{i}p", "p")}</li>' for i in range(len(steps)))
    pr = ''.join(t(f'm_pr{i}', 'p') for i in range(len(m['price'])))
    fq = ''.join(f'<details><summary data-i18n="m_q{i}">{k[f"m_q{i}"]}</summary>{t(f"m_a{i}", "p")}</details>' for i in range(len(faq_items(slug, 'ru'))))
    mt = ''
    if m.get('metrics'):
        cards = ''.join(f'<div class="lp-item">{t(f"m_mt{i}t", "h3")}{t(f"m_mt{i}p", "p")}</div>' for i in range(len(m['metrics'])))
        mt = f'''
 <section class="lp-more"><div class="container">{t("m_mt_h", "h2")}<div class="lp-grid">{cards}</div></div></section>'''
    return mt + f'''
 <section class="lp-more" id="more"><div class="container">{t("m_get_h", "h2")}<div class="lp-grid">{get}</div></div></section>
 <section class="lp-more"><div class="container">{t("m_st_h", "h2")}<ol class="lp-steps">{st}</ol></div></section>
 <section class="lp-more"><div class="container">{t("m_pr_h", "h2")}<div class="lp-price">{pr}</div></div></section>
 <section class="lp-more"><div class="container">{t("m_faq_h", "h2")}<div class="lp-faq">{fq}</div></div></section>
'''


# starting price per page (RUB, USD) - shown in meta description and Service/Offer markup
PRICE = {'website-development': (35000, 700), 'ai-implementation': (60000, 1500)}
PRICE_DEFAULT = (65000, 1300)


def build(p):
    s = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    rub, usd = PRICE.get(p['slug'], PRICE_DEFAULT)
    ru, en = dict(p['ru']), dict(p['en'])
    ru['desc'] = f"От {rub:,} ₽. ".replace(',', '\u00a0') + ru['desc']
    en['desc'] = f"From ${usd:,}. " + en['desc']
    url = f'{ORIGIN}/{p["slug"]}/'
    t_ru, t_en = ru['title'], en['title']
    e = html.escape

    def sub(pat, val, flags=0, count=1):
        nonlocal s
        n = len(re.findall(pat, s, flags))
        assert n >= 1, pat
        s = re.sub(pat, lambda m: val, s, count=count, flags=flags)

    # ---- head ----
    sub(r'<title>[^<]*</title>', f'<title>{e(t_ru)}</title>')
    sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{e(ru["desc"])}">')
    sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{e(t_ru)}">')
    sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{e(ru["desc"])}">')
    sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">')
    sub(r'<link rel="canonical" href="[^"]*" id="canonicalLink">', f'<link rel="canonical" href="{url}" id="canonicalLink">')
    sub(r'<link rel="alternate" hreflang="ru" href="[^"]*">', f'<link rel="alternate" hreflang="ru" href="{url}">')
    sub(r'<link rel="alternate" hreflang="en" href="[^"]*">', f'<link rel="alternate" hreflang="en" href="{url}?lang=en">')
    sub(r'<link rel="alternate" hreflang="x-default" href="[^"]*">', f'<link rel="alternate" hreflang="x-default" href="{url}?lang=en">')
    sub(r'<meta name="(yandex|google)-site-verification"[^>]*>\n', '', count=0)
    ld = [{"@context": "https://schema.org", "@type": "Service", "name": ru['crumb'], "serviceType": ru['crumb'],
           "provider": {"@id": f"{ORIGIN}/#service"}, "areaServed": ["RU", "Worldwide"], "url": url,
           "offers": {"@type": "Offer", "url": url, "priceCurrency": "RUB", "priceSpecification": {"@type": "PriceSpecification", "minPrice": rub, "priceCurrency": "RUB"}}},
          {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": BRAND_RU, "item": f"{ORIGIN}/"},
              {"@type": "ListItem", "position": 2, "name": ru['crumb'], "item": url}]}]
    sub(r'<script type="application/ld\+json">.*?</script>', f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>', re.S)

    def copy(c, title, lang):
        return {'pageTitle': title, 'pageDesc': c['desc'], 'heroTag': c['tag'], 'heroTitleA': c['qs'][0], 'heroQs': c['qs'],
                'heroLead': c['lead'], 'ctaExplore': c['see'], 'lpExHeading': c['ex_h'], 'lpExDesc': c['ex_p'],
                'lpExName': c['ex_name'], 'lpExDemo': 'Демо-данные' if lang == 'ru' else 'Sample data',
                'lpTag': c['final_tag'], 'lpHeading': c['final_h'], 'lpDesc': c['final_p'],
                **more_keys(p['slug'], lang)}
    if 'ex_h' not in ru:
        for c in (ru, en):
            c.setdefault('ex_h', ''); c.setdefault('ex_p', ''); c.setdefault('ex_name', '')
    landing = {'ru': copy(ru, t_ru, 'ru'), 'en': copy(en, t_en, 'en')}
    faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq_items(p['slug'], 'ru')]}
    s = s.replace('</script>\n<meta property="og:type"', '</script>\n<script type="application/ld+json">%s</script>\n<meta property="og:type"' % json.dumps(faq_ld, ensure_ascii=False), 1)
    sub(r'<meta charset="utf-8">\n', '<meta charset="utf-8">\n<script>window.LANDING=%s;window.LANDING_URL=%s;</script>\n'
        % (json.dumps(landing, ensure_ascii=False), json.dumps(url)))
    sub(r'</style>', CSS + '</style>')

    # ---- links: page lives one level down ----
    s = re.sub(r'(href|src)="(?!https?:|#|/|mailto:|data:|javascript:)([^"]+)"', r'\1="/\2"', s)
    for a in ('problems', 'demo', 'calc'):
        s = s.replace(f'href="#{a}"', f'href="/#{a}"')
    s = s.replace('<a href="#top" class="brand"', '<a href="/" class="brand"')

    # ---- hero static text (what Yandex reads) ----
    sub(r'<span data-i18n="heroTag">[^<]*</span>', f'<span data-i18n="heroTag">{ru["tag"]}</span>')
    sub(r'<span class="q-fallback" data-i18n="heroTitleA">[^<]*</span>', f'<span class="q-fallback" data-i18n="heroTitleA">{ru.get("seo_q", ru["qs"][0])}</span>')
    sub(r'<span class="sr-only q-seo" data-i18n="heroTitleA">[^<]*</span>', f'<span class="sr-only q-seo" data-i18n="heroTitleA">{ru.get("seo_q", ru["qs"][0])}</span>')
    sub(r'<p class="hero-lead" data-i18n="heroLead">[^<]*</p>', f'<p class="hero-lead" data-i18n="heroLead">{ru["lead"]}</p>')
    sub(r'<a href="/#problems" class="light-btn"><span data-i18n="ctaExplore">[^<]*</span>',
        f'<a href="#example" class="light-btn"><span data-i18n="ctaExplore">{ru["see"]}</span>')

    # ---- body: drop problems, examples grid and calculator; add one example + enquiry ----
    sub(r'\n <section class="problems-section".*?\n </section>\n', '\n', re.S)
    ex = p['example']
    ex_block = f'''
 <section class="lp-example" id="example">
  <div class="container">
   <div class="showcase-intro"><div><h2 data-i18n="lpExHeading">{ru["ex_h"]}</h2></div><p class="section-description" data-i18n="lpExDesc">{ru["ex_p"]}</p></div>
   <div class="lp-frame"><div class="lp-frame-bar"><b data-i18n="lpExName">{ru["ex_name"]}</b><span data-i18n="lpExDemo">Демо-данные</span></div>
    <div class="lp-frame-in"><iframe id="lpFrame" src="/dashboards/{ex}/" title="{e(ru["ex_name"])}" loading="lazy"></iframe></div></div>
   <script>if(window.PAGE_LANG==='en')document.getElementById('lpFrame').src='/dashboards/{ex}/?lang=en';</script>
  </div>
 </section>''' if ex else ''
    if not ex:
        s = s.replace('<a href="#example" class="light-btn">', '<a href="#more" class="light-btn">', 1)
    block = ex_block + more_html(p['slug']) + f'''
 <section class="lp-contact" id="contact">
  <div class="container"><div class="lp-card">
   <div><small data-i18n="lpTag">{ru["final_tag"]}</small><h2 data-i18n="lpHeading">{ru["final_h"]}</h2><p data-i18n="lpDesc">{ru["final_p"]}</p></div>
   <button type="button" class="solid-btn" data-open-lead><span data-i18n="ctaDiscuss">Оставить заявку</span>{ARROW}</button>
  </div></div>
 </section>
'''
    sub(r'\n <section class="showcase" id="demo">.*?\n </section>\n', block, re.S)
    sub(r'\n <section class="calc-section" id="calc".*?\n </section>\n', '\n', re.S)
    sub(r'\n <section class="svc-links".*?\n </section>\n', '\n', re.S)
    sub(r'\n <section class="home-faq".*?\n </section>\n', '\n', re.S)
    sub(r'<script type="application/ld\+json" id="homeFaqLd">.*?</script>\n', '', re.S)
    return s


def main():
    slugs = sys.argv[1:] or list(PAGES)
    for slug in slugs:
        out = build(PAGES[slug])
        os.makedirs(os.path.join(ROOT, slug), exist_ok=True)
        open(os.path.join(ROOT, slug, 'index.html'), 'w', encoding='utf-8').write(out)
        print('built', slug)


if __name__ == '__main__':
    main()
