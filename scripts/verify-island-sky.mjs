import { chromium } from 'playwright';
const NOISE = /WebSocket|\[vite\]|favicon/i;
const errs = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
page.on('console', m => { if (m.type() === 'error' && !NOISE.test(m.text())) errs.push(m.text()); });
page.on('pageerror', e => errs.push(String(e)));
// a warm week: 14 campfire-game rounds already played
await page.addInitScript(() => {
  const evs = Array.from({ length: 14 }, (_, i) => ({ actor: 'castaway-1', action: 'fire_quiz_played', payload: {}, at: new Date().toISOString(), id: 'w' + i }));
  localStorage.setItem('driftwood_events_v1', JSON.stringify(evs));
});
await page.goto('http://localhost:3300/island3d/index.html#aerial', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);
await page.screenshot({ path: '/tmp/island-warm1.png' });
// walk down the path toward the fire
await page.keyboard.down('w'); await page.waitForTimeout(2600); await page.keyboard.up('w');
await page.waitForTimeout(600);
await page.screenshot({ path: '/tmp/island-warm2.png' });
console.log('errors:', errs.length ? errs.join(' | ') : 'none');
await browser.close();
