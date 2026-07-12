import { chromium } from 'playwright';
const NOISE = /WebSocket|\[vite\]|favicon/i;
const errs = [];
const browser = await chromium.launch();
// desktop
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', m => { if (m.type() === 'error' && !NOISE.test(m.text())) errs.push(m.text()); });
page.on('pageerror', e => errs.push(String(e)));
await page.addInitScript(() => {
  localStorage.setItem('driftwood_boarded_v1', '1');
  localStorage.setItem('driftwood_castaways_v1', JSON.stringify([{ slotId: 'castaway-1', name: 'Crawl', claimedAt: new Date().toISOString(), kind: 'human' }]));
});
await page.goto('http://localhost:3300/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
// rail has 5 tabs incl Campfire
const rail = await page.locator('nav.hidden button').allTextContents();
console.log('desktop rail:', rail.join(' · '));
await page.locator('nav.hidden button', { hasText: 'Campfire' }).click();
await page.waitForTimeout(600);
const games = await page.locator('[data-testid^="game-"]').count();
console.log('campfire tab games:', games >= 20 ? `✓ ${games}` : `✗ ${games}`);
await page.screenshot({ path: '/tmp/shell-campfire-desktop.png' });
// check-in reskin
await page.locator('nav.hidden button', { hasText: 'Check-in' }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/shell-checkin-desktop.png' });
// campfire pointer routes
await page.getByTestId('checkin-campfire').click();
await page.waitForTimeout(500);
const back = await page.locator('[data-testid^="game-"]').count();
console.log('checkin → campfire pointer:', back >= 20 ? '✓ routes' : `✗ ${back}`);
// mobile
const m = await browser.newPage({ viewport: { width: 390, height: 760 } });
m.on('pageerror', e => errs.push(String(e)));
await m.addInitScript(() => {
  localStorage.setItem('driftwood_boarded_v1', '1');
  localStorage.setItem('driftwood_castaways_v1', JSON.stringify([{ slotId: 'castaway-1', name: 'Crawl', claimedAt: new Date().toISOString(), kind: 'human' }]));
});
await m.goto('http://localhost:3300/', { waitUntil: 'networkidle' });
await m.waitForTimeout(1200);
const bottomTabs = await m.locator('nav.lg\\:hidden button').count();
console.log('mobile bottom tabs:', bottomTabs === 5 ? '✓ 5' : `✗ ${bottomTabs}`);
await m.locator('nav.lg\\:hidden button', { hasText: 'Campfire' }).click();
await m.waitForTimeout(500);
await m.screenshot({ path: '/tmp/shell-campfire-mobile.png' });
console.log('errors:', errs.length ? errs.join(' | ') : 'none');
await browser.close();
