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
// rail has the flagship's 5 rooms — island-only law (2026-07-12): the 4th is
// "Island" now, the 3D world itself, not a browsable "Challenges" list.
const rail = await page.locator('nav.hidden button').allTextContents();
console.log('desktop rail:', rail.join(' · '));
check('rail carries Island', rail.some(t => /Island/.test(t)));
check('rail does NOT carry a bare Challenges room', !rail.some(t => /^Challenges$/.test(t.trim())));
// FLAGSHIP WIDTH LAW: the shell fills the screen (no centered max-w cap)
const mainBox = await page.locator('main').boundingBox();
check('main fills the width (≥ 1400px at 1690)', !!mainBox && mainBox.width >= 1400, `${Math.round(mainBox?.width ?? 0)}px`);
// the Home shore's hero door also lands on the island (one consolidated path)
check('Enter the Island hero on Home', await page.getByTestId('walk-island').isVisible());
check('Campfire Games is NOT a direct door off-island', !(await page.getByTestId('fire-quiz').isVisible().catch(() => false)));
await page.getByTestId('walk-island').click();
await page.waitForTimeout(2200);
check('the 3D island mounted', await page.locator('iframe[title="The Island in three dimensions"]').isVisible());
check('the Trail (read-only progress) stays reachable', await page.getByTestId('challenges-tidechart').isVisible());
check('no browsable milestone shelf floats over the island', !(await page.getByText('The Milestone Log').first().isVisible().catch(() => false)));
await page.screenshot({ path: '/tmp/shell-island-desktop.png' });
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
await m.locator('nav.lg\\:hidden button', { hasText: 'Island' }).click();
await m.waitForTimeout(2200);
check('mobile Island tab mounts the 3D world', await m.locator('iframe[title="The Island in three dimensions"]').isVisible());
await m.screenshot({ path: '/tmp/shell-island-mobile.png' });
console.log('errors:', errs.length ? errs.join(' | ') : 'none');
await browser.close();
if (fails.length || errs.length) { console.error(`SHELL GATE: ${fails.length} fail(s), ${errs.length} error(s)`); process.exit(1); }
console.log('SHELL GATE: all green');
