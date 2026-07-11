import { chromium } from 'playwright';
const NOISE = /WebSocket|\[vite\]|favicon/i;
const errs = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
page.on('console', m => { if (m.type() === 'error' && !NOISE.test(m.text())) errs.push(m.text()); });
page.on('pageerror', e => errs.push(String(e)));
await page.goto('http://localhost:3300/island3d/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
const before = await page.locator('#shells').textContent();
// the starter shell waits at (2,90), spawn is (2,86): walk south
await page.keyboard.down('s'); await page.waitForTimeout(900); await page.keyboard.up('s');
await page.waitForTimeout(500);
const after = await page.locator('#shells').textContent();
const persisted = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('driftwood_shells_v1') || '{}')).length);
console.log('shells:', before !== after && persisted >= 1 ? `✓ ${before} → ${after} (persisted ${persisted})` : `✗ ${before} → ${after}, persisted ${persisted}`);
await page.screenshot({ path: '/tmp/shells.png' });
console.log('errors:', errs.length ? errs.join(' | ') : 'none');
await browser.close();
