/*
 * Synthetic, reproducible account/activity-level dataset for the portfolio demo.
 * Every active user and transaction is generated deterministically; no network,
 * cookies, customer data, or external API is used.
 */
(function () {
  'use strict';
  const DAYS = 210;
  const LAST_DATE = new Date().toISOString().slice(0, 10); // slides with the current day; still 100% synthetic
  const DAY_MS = 86400000;
  const finalUTC = Date.parse(LAST_DATE + 'T00:00:00Z');
  const originUTC = finalUTC - (DAYS - 1) * DAY_MS;
  const dateAt = (n) => new Date(originUTC + n * DAY_MS).toISOString().slice(0, 10);

  function seeded(seed) {
    let a = seed | 0;
    return () => {
      a += 0x6D2B79F5;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const random = seeded(20261023);
  const take = (list, weights) => {
    const x = random() * weights.reduce((s, v) => s + v, 0);
    let sum = 0;
    for (let i = 0; i < list.length; i++) {
      sum += weights[i];
      if (x < sum) return list[i];
    }
    return list[list.length - 1];
  };
  const countries = document.documentElement.lang === 'en' ? ['GB', 'US', 'DE', 'IN', 'BR'] : ['RU', 'US', 'DE', 'IN', 'BR'];
  const platforms = ['web', 'ios', 'android'];
  const channels = ['organic', 'paid', 'direct', 'social', 'referral'];
  const users = [];
  const count = 28000;
  for (let id = 1; id <= count; id++) {
    const joined = Math.min(DAYS - 1, Math.floor(DAYS * Math.pow(random(), 0.78)));
    const country = take(countries, [32, 25, 15, 18, 10]);
    const platform = take(platforms, [48, 30, 22]);
    const channel = take(channels, [34, 22, 20, 13, 11]);
    const persona = take([0, 1, 2], [26, 40, 34]);
    const days = [joined];
    const onboarded = random() < [0.92, 0.74, 0.50][persona];
    const onboardingCandidate = onboarded ? joined + Math.floor(random() * 3) : null;
    const onboardingDay = onboardingCandidate !== null && onboardingCandidate < DAYS ? onboardingCandidate : null;
    const activated = onboardingDay !== null && random() < [0.95, 0.79, 0.58][persona];
    const activationCandidate = activated ? onboardingDay + Math.floor(random() * 6) : null;
    const activationDay = activationCandidate !== null && activationCandidate < DAYS ? activationCandidate : null;
    const willPay = activationDay !== null && random() < [0.21, 0.12, 0.042][persona];
    const purchases = [];
    if (willPay) {
      let payDay = activationDay + Math.floor(random() * 17);
      const planPrice = random() < 0.72 ? 14.99 : 29.99;
      // Do not move future purchases into the last recorded day.
      // That used to produce an artificial last-day spike in revenue charts.
      if (payDay < DAYS) {
        purchases.push({ d: payDay, usd: planPrice });
        while (payDay + 29 < DAYS && random() < (persona === 0 ? 0.84 : 0.64)) {
          payDay += 29 + Math.floor(random() * 4);
          if(payDay < DAYS)purchases.push({ d: payDay, usd: planPrice });
        }
      }
    }
    for (let d = joined + 1; d < DAYS; d++) {
      const age = d - joined;
      const weekday = new Date(originUTC + d * DAY_MS).getUTCDay();
      const wFactor = weekday === 0 || weekday === 6 ? 0.87 : 1;
      const base = persona === 0 ? 0.41 * Math.exp(-age / 400) + 0.065
        : persona === 1 ? 0.14 * Math.exp(-age / 160) + 0.012
        : 0.042 * Math.exp(-age / 55) + 0.003;
      const nudge = age <= 3 ? [0.22, 0.15, 0.055][persona] : 0;
      if (random() < Math.min(0.90, (base + nudge) * wFactor)) days.push(d);
    }
    for (const p of purchases) {
      if (!days.includes(p.d)) days.push(p.d);
    }
    days.sort((a, b) => a - b);
    users.push({
      id, joined, country, platform, channel, persona,
      plan: purchases.length ? 'paid' : 'free',
      onboardingDay, activationDay, days, purchases
    });
  }
  window.PULSE_DATA = Object.freeze({
    kind: 'fictional-demo', count, days: DAYS, lastDate: LAST_DATE,
    originUTC, DAY_MS, countries, platforms, channels, users, dateAt
  });
})();
