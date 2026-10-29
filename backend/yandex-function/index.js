/* Lead handler and country lookup for analyticsbuild.com — Yandex Cloud Functions (Node.js 22).

   GET  ?geo=1  -> {"success":true,"country_code":"RU"}   (country by visitor IP, data stays in Russia)
   POST (JSON)  -> sends the full enquiry to the Yandex mailbox (stored in Russia)
                   and a short notice WITHOUT personal data to the Gmail inbox.

   Environment variables (set in the function settings):
     SMTP_USER   — Yandex mailbox that sends and receives leads, e.g. leads@yandex.ru
     SMTP_PASS   — app password for that mailbox (Yandex ID → Пароли приложений → Почта)
     LEADS_TO    — where full enquiries go (defaults to SMTP_USER)
     NOTIFY_TO   — where the short notice goes, e.g. analystleogroup@gmail.com (optional)
     ALLOWED_ORIGINS — comma list, default "https://analyticsbuild.com"
*/
const nodemailer = require('nodemailer');
const geoip = require('geoip-country');

const ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://analyticsbuild.com').split(',').map(s => s.trim());
const MAX_FIELD = 2000;

function cors(origin) {
  const allow = ORIGINS.includes(origin) ? origin : ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  };
}
const reply = (code, body, origin) => ({ statusCode: code, headers: cors(origin), body: JSON.stringify(body) });

function clientIp(event) {
  const h = event.headers || {};
  const xff = h['X-Forwarded-For'] || h['x-forwarded-for'] || '';
  return (xff.split(',')[0] || '').trim() || (event.requestContext && event.requestContext.identity && event.requestContext.identity.sourceIp) || '';
}

function clean(v) {
  return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, MAX_FIELD).trim();
}
function esc(s) {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

let transport;
function mailer() {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: 'smtp.yandex.ru', port: 465, secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transport;
}

module.exports.handler = async function (event) {
  const h = event.headers || {};
  const origin = h.Origin || h.origin || '';
  const method = (event.httpMethod || 'GET').toUpperCase();
  const q = event.queryStringParameters || {};

  if (method === 'OPTIONS') return { statusCode: 204, headers: cors(origin), body: '' };

  if (method === 'GET' && q.geo) {
    const hit = geoip.lookup(clientIp(event));
    return reply(200, { success: true, country_code: hit ? hit.country : null }, origin);
  }

  if (method !== 'POST') return reply(405, { success: false, message: 'Method not allowed' }, origin);
  if (origin && !ORIGINS.includes(origin)) return reply(403, { success: false, message: 'Forbidden' }, origin);

  let data;
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || '');
    data = JSON.parse(raw);
  } catch (e) {
    return reply(400, { success: false, message: 'Bad request' }, origin);
  }
  if (!data || typeof data !== 'object') return reply(400, { success: false, message: 'Bad request' }, origin);
  if (data._honey) return reply(200, { success: true }, origin); // bot filled the hidden field

  const fields = Object.entries(data)
    .filter(([k]) => !k.startsWith('_'))
    .slice(0, 30)
    .map(([k, v]) => [clean(k).slice(0, 120), clean(v)]);
  const name = clean(data.name);
  if (!name || fields.length < 3) return reply(400, { success: false, message: 'Missing fields' }, origin);

  const id = new Date().toISOString().replace(/\D/g, '').slice(2, 12) + '-' + Math.random().toString(36).slice(2, 6);
  const rows = fields.map(([k, v]) => `<tr><td style="padding:6px 12px;border:1px solid #e5e7eb;color:#555;vertical-align:top">${esc(k)}</td><td style="padding:6px 12px;border:1px solid #e5e7eb;white-space:pre-wrap">${esc(v)}</td></tr>`).join('');
  const text = fields.map(([k, v]) => `${k}: ${v}`).join('\n');
  const from = `"Сайт analyticsbuild.com" <${process.env.SMTP_USER}>`;

  try {
    await mailer().sendMail({
      from, to: process.env.LEADS_TO || process.env.SMTP_USER,
      replyTo: data.email ? clean(data.email) : undefined,
      subject: `Новая заявка с сайта №${id}`,
      text: `Заявка №${id}\n\n${text}`,
      html: `<p><b>Заявка №${id}</b></p><table style="border-collapse:collapse;font:14px/1.5 Arial,sans-serif">${rows}</table>`,
    });
  } catch (e) {
    console.error('lead mail failed', e && e.message);
    return reply(502, { success: false, message: 'Delivery failed' }, origin);
  }

  if (process.env.NOTIFY_TO) {
    try {
      await mailer().sendMail({
        from, to: process.env.NOTIFY_TO,
        subject: `Новая заявка с сайта №${id}`,
        text: `Пришла новая заявка №${id}. Данные клиента — в Яндекс Почте (${process.env.LEADS_TO || process.env.SMTP_USER}).`,
      });
    } catch (e) {
      console.error('notice failed', e && e.message); // the lead itself is already delivered
    }
  }
  return reply(200, { success: true, id }, origin);
};
