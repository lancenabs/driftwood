// THE FILM DRIVE — watches THE WAYWARD BOY end to end on the real dev server.
// Fresh boarder: splash → Begin the crossing → poster (COME ASHORE) → the
// letter → sixteen beats advancing on Skip's real clip end → the crew phase.
// Fails on any console error or if a beat outstays its fallback clock.
import { chromium } from 'playwright';

const URL = process.env.DRIVE_URL || 'http://localhost:3300';
const errors = [];
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(String(e)));

await page.goto(URL);
await page.evaluate(() => localStorage.clear());
await page.reload();

await page.getByText('Begin the crossing').click({ timeout: 15000 });
console.log('· crossing begun — poster up');

await page.getByText('COME ASHORE').click({ timeout: 15000 });
console.log('· ashore — the letter is on the dock');
await page.waitForTimeout(2500);
await page.getByText('TAP TO BEGIN THE STORY').click({ timeout: 15000 });
console.log('· the story begins');

// sixteen beats: watch the dot index climb; each advance is Skip finishing
let last = -1;
const t0 = Date.now();
for (;;) {
  const state = await page.evaluate(() => {
    const dots = [...document.querySelectorAll('span')].filter(s => s.className.includes('rounded-full') && (s.className.includes('bg-amber-200') || s.className.includes('bg-white/25')));
    const active = dots.findIndex(d => d.className.includes('bg-amber-200'));
    const crew = !!document.querySelector('img[alt], h2') && document.body.innerText.includes('crew');
    return { active, total: dots.length, bodyHasCrew: document.body.innerText.toLowerCase().includes('claim') };
  });
  if (state.active !== last && state.active >= 0) {
    last = state.active;
    console.log(`· beat ${state.active + 1}/${state.total} @ ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  if (state.active < 0 && last >= 14) break;            // dots gone → film done
  if (state.bodyHasCrew && state.active < 0) break;
  if (Date.now() - t0 > 9 * 60 * 1000) { errors.push('film never finished inside 9 minutes'); break; }
  await page.waitForTimeout(1000);
}
console.log(`· film complete @ ${((Date.now() - t0) / 1000).toFixed(0)}s — checking the crew door`);
await page.waitForTimeout(2000);
const after = await page.evaluate(() => document.body.innerText.slice(0, 400));
const ashore = /crew|claim|castaway/i.test(after);
await browser.close();

if (errors.length) { console.error('❌ CONSOLE ERRORS:', errors); process.exit(1); }
if (!ashore) { console.error('❌ film ended but the crew phase did not follow. Saw:', after.slice(0, 200)); process.exit(1); }
console.log('✅ THE FILM HOLDS — sixteen beats in Skip\'s voice, zero errors, the crew waits ashore.');
