"""Builds the blog (/blog/ and /blog/<slug>/) as trimmed copies of the home page.
Russian only. Posts live in tools/posts.py.

    python3 tools/blog.py
"""
import json, os, re, sys, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from posts import POSTS  # noqa: E402

ORIGIN = 'https://analyticsbuild.com'
BRAND = 'Сайты и Аналитика'
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'
CSS = '''
/* blog */
.blog{padding:40px 0 24px}
.blog-head{max-width:760px;margin:0 0 36px}
.blog-crumbs{font-size:13.5px;color:#70727b;margin:0 0 18px}
.blog-crumbs a{color:inherit;text-decoration:none}.blog-crumbs a:hover{color:#08080a}
.blog-head h1{font-weight:780;font-size:clamp(34px,5.4vw,64px);letter-spacing:-.055em;line-height:1.04;margin:0 0 16px}
.blog-head p{color:#70727b;font-size:17px;line-height:1.65;margin:0;max-width:600px}
.post-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.post-card{display:flex;flex-direction:column;gap:12px;background:#fff;border:1px solid #e7e8ec;border-radius:22px;padding:24px;text-decoration:none;color:inherit;transition:transform .2s var(--ease),border-color .2s ease}
.post-card:active{transform:scale(.98)}
@media(hover:hover) and (pointer:fine){.post-card:hover{border-color:#cfd2d9;transform:translateY(-2px)}}
.post-tag{align-self:flex-start;font-size:12px;font-weight:700;color:#1d63d8;background:#eef4ff;border-radius:999px;padding:5px 10px}
.post-card b{font-size:20px;line-height:1.25;letter-spacing:-.02em}
.post-card span.d{color:#70727b;font-size:14.5px;line-height:1.55}
.post-meta{margin-top:auto;font-size:13px;color:#8b8e96}
.post{max-width:740px}
.post .blog-head{margin-bottom:28px}
.post-lead{font-size:19px!important;color:#3d4049!important;line-height:1.6!important}
.post-body{font-size:17px;line-height:1.75;color:#24262c}
.post-body h2{font-size:clamp(23px,2.6vw,30px);letter-spacing:-.03em;line-height:1.2;margin:44px 0 14px;max-width:none;font-weight:760}
.post-body p{margin:0 0 16px}
.post-body ul,.post-body ol{margin:0 0 18px;padding-left:22px}
.post-body li{margin:0 0 10px;padding-left:4px}
.post-service{margin:40px 0 0;background:#fff;border:1px solid #e7e8ec;border-radius:22px;padding:24px;display:flex;gap:20px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.post-service small{display:block;font-size:12px;font-weight:800;letter-spacing:.06em;color:#1d63d8;margin-bottom:8px}
.post-service p{margin:0;max-width:440px;color:#4b4e57;line-height:1.55}
.post-service a{white-space:nowrap}
.blog-cta{padding:56px 0 88px}
.blog-card{background:var(--board);color:#fff;border-radius:28px;padding:clamp(28px,5vw,52px);display:flex;align-items:center;justify-content:space-between;gap:28px;flex-wrap:wrap}
.blog-card h2{color:#fff;margin:0 0 10px;font-size:clamp(26px,3.4vw,38px);line-height:1.1;letter-spacing:-.035em;max-width:20ch}
.blog-card p{margin:0;color:#a9afbd;max-width:46ch;line-height:1.55}
.blog-card .solid-btn{background:#fff;color:var(--ink)}
@media(max-width:900px){.post-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.post-grid{grid-template-columns:1fr}.blog{padding:24px 0 8px}.post-body{font-size:16.5px}}
'''


def base(title, desc, url, ld, content):
    s = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    e = html.escape

    def sub(pat, val, flags=0, count=1):
        nonlocal s
        assert re.search(pat, s, flags), pat
        s = re.sub(pat, lambda m: val, s, count=count, flags=flags)

    full = f'{title} | {BRAND}'
    sub(r'<title>[^<]*</title>', f'<title>{e(full)}</title>')
    sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{e(desc)}">')
    sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{e(full)}">')
    sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{e(desc)}">')
    sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">')
    s = re.sub(r'<meta property="og:locale:alternate"[^>]*>\n', '', s)
    sub(r'<link rel="canonical" href="[^"]*" id="canonicalLink">', f'<link rel="canonical" href="{url}" id="canonicalLink">')
    sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n', '', count=0)
    sub(r'<meta name="(yandex|google)-site-verification"[^>]*>\n', '', count=0)
    sub(r'<script type="application/ld\+json">.*?</script>', f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>', re.S)
    over = {'pageTitle': full, 'pageDesc': desc}
    sub(r'<meta charset="utf-8">\n', '<meta charset="utf-8">\n<script>window.FORCE_LOCALE="ru";window.LANDING=%s;window.LANDING_URL=%s;</script>\n'
        % (json.dumps({'ru': over, 'en': over}, ensure_ascii=False), json.dumps(url)))
    sub(r'</style>', CSS + '</style>')
    s = re.sub(r'(href|src)="(?!https?:|#|/|mailto:|data:|javascript:)([^"]+)"', r'\1="/\2"', s)
    for a in ('problems', 'demo', 'calc'):
        s = s.replace(f'href="#{a}"', f'href="/#{a}"')
    s = s.replace('<a href="#top" class="brand"', '<a href="/" class="brand"')
    # replace everything inside <main> and drop the calculator
    s = re.sub(r'(<main id="top">)(.*?)(\n</main>)', lambda m: m.group(1) + content + m.group(3), s, count=1, flags=re.S)
    sub(r'\n <section class="calc-section" id="calc".*?\n </section>\n', '\n', re.S)
    return s


def cta():
    return f'''
 <section class="blog-cta"><div class="container"><div class="blog-card">
  <div><h2>Покажем на цифрах, что происходит в вашем бизнесе</h2><p>Созвонимся на 15 минут, разберём вашу ситуацию и назовём стоимость до начала работ.</p></div>
  <button type="button" class="solid-btn" data-open-lead><span>Оставить заявку</span>{ARROW}</button>
 </div></div></section>'''


def build_index():
    url = f'{ORIGIN}/blog/'
    cards = '\n'.join(f'''   <a class="post-card" href="/blog/{p["slug"]}/"><span class="post-tag">{p["tag"]}</span><b>{p["title"]}</b><span class="d">{p["desc"]}</span><span class="post-meta">{p["date_ru"]} · {p["read"]}</span></a>''' for p in POSTS)
    content = f'''
 <section class="blog"><div class="container">
  <div class="blog-head"><p class="blog-crumbs"><a href="/">Главная</a> / Статьи</p><h1>Статьи</h1>
  <p>Простым языком о цифрах в бизнесе: прибыль, деньги, продажи, отчёты и дашборды. Без воды и сложных терминов.</p></div>
  <div class="post-grid">
{cards}
  </div>
 </div></section>{cta()}'''
    ld = [{"@context": "https://schema.org", "@type": "Blog", "name": f"Статьи - {BRAND}", "url": url, "inLanguage": "ru",
           "blogPost": [{"@type": "BlogPosting", "headline": p['title'], "url": f"{ORIGIN}/blog/{p['slug']}/", "datePublished": p['date']} for p in POSTS]},
          {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": BRAND, "item": f"{ORIGIN}/"},
              {"@type": "ListItem", "position": 2, "name": "Статьи", "item": url}]}]
    return base('Статьи о цифрах в бизнесе: прибыль, деньги, продажи, отчёты', 'Статьи простым языком о прибыли, деньгах, продажах, управленческой отчётности и дашбордах для владельцев и руководителей бизнеса.', url, ld, content)


def build_post(p):
    url = f'{ORIGIN}/blog/{p["slug"]}/'
    href, name, text = p['service']
    others = [o for o in POSTS if o['slug'] != p['slug']][:3]
    more = ''
    if others:
        more = '\n  <div class="blog-head" style="margin:64px 0 20px"><h2 style="font-size:clamp(24px,3vw,34px);letter-spacing:-.035em;margin:0">Ещё статьи</h2></div>\n  <div class="post-grid">' + ''.join(
            f'<a class="post-card" href="/blog/{o["slug"]}/"><span class="post-tag">{o["tag"]}</span><b>{o["title"]}</b><span class="post-meta">{o["date_ru"]} · {o["read"]}</span></a>' for o in others) + '</div>'
    content = f'''
 <section class="blog"><div class="container">
  <article class="post">
   <div class="blog-head"><p class="blog-crumbs"><a href="/">Главная</a> / <a href="/blog/">Статьи</a> / {p["tag"]}</p>
   <h1>{p["title"]}</h1><p class="post-meta" style="margin:0 0 18px">{p["date_ru"]} · {p["read"]} чтения</p>
   <p class="post-lead">{p["lead"]}</p></div>
   <div class="post-body">{p["body"]}</div>
   <aside class="post-service"><div><small>КАК МЫ ПОМОГАЕМ</small><p>{text}</p></div><a class="light-btn" href="{href}"><span>{name}</span>{ARROW}</a></aside>
  </article>{more}
 </div></section>{cta()}'''
    ld = [{"@context": "https://schema.org", "@type": "BlogPosting", "headline": p['title'], "description": p['desc'], "datePublished": p['date'],
           "dateModified": p['date'], "inLanguage": "ru", "mainEntityOfPage": url, "image": f"{ORIGIN}/og-image.png",
           "author": {"@type": "Organization", "name": BRAND, "url": f"{ORIGIN}/"}, "publisher": {"@type": "Organization", "name": BRAND, "url": f"{ORIGIN}/"}},
          {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": BRAND, "item": f"{ORIGIN}/"},
              {"@type": "ListItem", "position": 2, "name": "Статьи", "item": f"{ORIGIN}/blog/"},
              {"@type": "ListItem", "position": 3, "name": p['title'], "item": url}]}]
    return base(p['title'], p['desc'], url, ld, content)


def main():
    os.makedirs(os.path.join(ROOT, 'blog'), exist_ok=True)
    open(os.path.join(ROOT, 'blog', 'index.html'), 'w', encoding='utf-8').write(build_index())
    for p in POSTS:
        d = os.path.join(ROOT, 'blog', p['slug'])
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(build_post(p))
    print('built blog:', len(POSTS), 'posts')


if __name__ == '__main__':
    main()
