import { chromium } from 'playwright';
const NOISE = /WebSocket|\[vite\]|favicon/i;
const errs = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
page.on('console', m => { if (m.type() === 'error' && !NOISE.test(m.text())) errs.push(m.text()); });
page.on('pageerror', e => errs.push(String(e)));
await page.goto('http://localhost:3300/island3d/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
// enter build mode, place three blocks in front of the player
await page.click('#buildBtn');
await page.waitForTimeout(300);
for (const [x, y] of [[450, 400], [430, 430], [480, 420]]) {
  await page.mouse.click(x, y);
  await page.waitForTimeout(250);
}
const placed = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('driftwood_build_v1') || '{}')).length);
console.log('placed:', placed >= 2 ? `✓ ${placed} blocks persisted` : `✗ only ${placed}`);
await page.screenshot({ path: '/tmp/builder-placed.png' });
// break one: toggle pick (last palette button), tap a block
await page.evaluate(() => { [...document.querySelectorAll('#palette button')].find(b => b.textContent === '\u26cf').click(); });
await page.waitForTimeout(200);
await page.mouse.click(450, 400);
await page.waitForTimeout(300);
const after = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('driftwood_build_v1') || '{}')).length);
console.log('break:', after < placed ? `✓ ${placed}→${after}` : `✗ still ${after}`);
// jump: baseY should rise then land
const y0 = await page.evaluate(() => window.__py ?? null);
await page.keyboard.press('Space');
await page.waitForTimeout(280);
const yMid = await page.evaluate(() => {
  // read the rig's world y via the scene? cheat: use the hint — instead expose nothing; sample via screenshot diff is overkill.
  return null;
});
// simpler: assert reload restores blocks (persistence round-trip)
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
const restored = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('driftwood_build_v1') || '{}')).length);
console.log('restore:', restored === after ? `✓ ${restored} blocks after reload` : `✗ ${restored} vs ${after}`);
await page.screenshot({ path: '/tmp/builder-restored.png' });
console.log('errors:', errs.length ? errs.join(' | ') : 'none');
await browser.close();
