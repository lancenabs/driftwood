import { chromium } from 'playwright';
const NOISE = /WebSocket|\[vite\]|favicon/i;
const errs = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
page.on('console', m => { if (m.type() === 'error' && !NOISE.test(m.text())) errs.push(m.text()); });
page.on('pageerror', e => errs.push(String(e)));
await page.goto('http://localhost:3300/island3d/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
// open build → flag painter
await page.click('#buildBtn');
await page.waitForTimeout(200);
await page.evaluate(() => { [...document.querySelectorAll('#palette button')].find(b => b.textContent === '\ud83d\udea9').click(); });
await page.waitForTimeout(300);
// draw a stroke on the flag canvas
const box = await page.locator('#flagCanvas').boundingBox();
await page.mouse.move(box.x + 30, box.y + 40);
await page.mouse.down();
await page.mouse.move(box.x + box.width - 40, box.y + box.height - 50, { steps: 10 });
await page.mouse.up();
await page.click('#flagHoist');
await page.waitForTimeout(400);
const flags = await page.evaluate(() => JSON.parse(localStorage.getItem('driftwood_flags_v1') || '[]').length);
console.log('hoisted:', flags === 1 ? '✓ 1 flag persisted' : `✗ ${flags}`);
// reload → flag restored into the scene
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
const restored = await page.evaluate(() => JSON.parse(localStorage.getItem('driftwood_flags_v1') || '[]').length);
console.log('restored:', restored === 1 ? '✓ flag survives reload' : `✗ ${restored}`);
await page.screenshot({ path: '/tmp/flag.png' });
console.log('errors:', errs.length ? errs.join(' | ') : 'none');
await browser.close();
