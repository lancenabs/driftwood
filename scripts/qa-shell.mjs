import { chromium } from 'playwright';
const NOISE = /WebSocket|\[vite\]|favicon/i;
const errs = [];
const fails = [];
const check = (label, ok, detail = '') => {
  console.log(`${label}: ${ok ? '✓' : '✗'} ${detail}`.trim());
  if (!ok) fails.push(label);
};
const browser = await chromium.launch();
// desktop
const page = await browser.newPage({ viewport: { width: 1690, height: 860 } });
page.on('console', m => { if (m.type() === 'error' && !NOISE.test(m.text())) errs.push(m.text()); });
page.on('pageerror', e => errs.push(String(e)));
await page.addInitScript(() => {
  localStorage.setItem('driftwood_boarded_v1', '1');
  localStorage.setItem('driftwood_castaways_v1', JSON.stringify([{ slotId: 'castaway-1', name: 'Crawl', claimedAt: new Date().toISOString(), kind: 'human' }]));
});
await page.goto('http://localhost:3300/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
// rail has the flagship's 5 rooms incl Challenges
const rail = await page.locator('nav.hidden button').allTextContents();
console.log('desktop rail:', rail.join(' · '));
check('rail carries Challenges', rail.some(t => /Challenges/.test(t)));
// FLAGSHIP WIDTH LAW: the shell fills the screen (no centered max-w cap)
const mainBox = await page.locator('main').boundingBox();
check('main fills the width (≥ 1400px at 1690)', !!mainBox && mainBox.width >= 1400, `${Math.round(mainBox?.width ?? 0)}px`);
// the Challenges tab: header + trail + the two doors
await page.locator('nav.hidden button', { hasText: 'Challenges' }).click();
await page.waitForTimeout(800);
const body = await page.evaluate(() => document.body.innerText);
check('challenge header (Survival first N of 31)', /Survival first \d+ of 31/.test(body));
check('the trail renders (Milestone Log)', body.includes('The Milestone Log'));
check('campfire door on the tab', await page.getByTestId('challenges-campfire').isVisible());
check('shop door on the tab', await page.getByTestId('challenges-shop').isVisible());
// the campfire door opens the games overlay
await page.getByTestId('challenges-campfire').click();
await page.waitForTimeout(700);
const games = await page.locator('[data-testid^="game-"]').count();
check('campfire overlay games', games >= 20, String(games));
await page.screenshot({ path: '/tmp/shell-challenges-desktop.png' });
// fresh page — the games overlay covers the viewport until closed
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
// check-in banner routes to the campfire overlay
await page.locator('nav.hidden button', { hasText: 'Check-in' }).click();
await page.waitForTimeout(800);
if (await page.getByTestId('checkin-campfire').isVisible().catch(() => false)) {
  await page.getByTestId('checkin-campfire').click();
  await page.waitForTimeout(600);
  const overlayGames = await page.locator('[data-testid^="game-"]').count();
  check('checkin → campfire pointer', overlayGames >= 20, String(overlayGames));
}
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
check('mobile bottom tabs', bottomTabs === 5, String(bottomTabs));
await m.locator('nav.lg\\:hidden button', { hasText: 'Challenges' }).click();
await m.waitForTimeout(600);
const mBody = await m.evaluate(() => document.body.innerText);
check('mobile Challenges tab renders', /Survival first \d+ of 31/.test(mBody));
await m.screenshot({ path: '/tmp/shell-challenges-mobile.png' });
console.log('errors:', errs.length ? errs.join(' | ') : 'none');
await browser.close();
if (fails.length || errs.length) { console.error(`SHELL GATE: ${fails.length} fail(s), ${errs.length} error(s)`); process.exit(1); }
console.log('SHELL GATE: all green');
