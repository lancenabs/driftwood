import { chromium } from 'playwright';
const NOISE = /WebSocket|\[vite\]|favicon/i;
const errs = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
page.on('console', m => { if (m.type() === 'error' && !NOISE.test(m.text())) errs.push(m.text()); });
page.on('pageerror', e => errs.push(String(e)));
await page.goto('http://localhost:3300/island3d/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);
await page.keyboard.down('s'); await page.waitForTimeout(2600); await page.keyboard.up('s');
// yaw the camera ~180° so it faces out over the open sea…
await page.mouse.move(860, 300); await page.mouse.down();
await page.mouse.move(120, 300, { steps: 20 }); await page.mouse.up();
// …and flatten the pitch to the horizon
await page.mouse.move(450, 480); await page.mouse.down();
await page.mouse.move(450, 100, { steps: 14 }); await page.mouse.up();
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/island-horizon.png' });
console.log('errors:', errs.length ? errs.join(' | ') : 'none');
await browser.close();
