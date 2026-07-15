// "He tapped the link." Drive the invitee's exact path and prove the beacon
// rises at the waterfall — the keystone of Lance's scene, end to end.
//
//   node scripts/shot-invite.mjs   → /tmp/invite-*.png
import { chromium } from 'playwright';

const BASE = 'http://localhost:3300';
const errs = [];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 900, height: 640 } });
// the husband is an existing client — he's boarded. Simulate that (a brand-new
// user would board first, then the invite honours; the primary path is existing).
await ctx.addInitScript(() => {
  try { localStorage.setItem('driftwood_boarded_v1', '1'); } catch {}
});
const p = await ctx.newPage();
p.on('pageerror', e => errs.push(String(e)));

// The wife hosts the camp (exactly what hostGathering does).
const code = await (await fetch(`${BASE}/api/gathering`, { method: 'POST' })).json().then(d => d.code);
console.log('camp hosted:', code);

// The husband taps the texted link.
const link = `${BASE}/?meet=${code}&at=waterfall&ms=4`;
console.log('he taps:', link);
await p.goto(link, { waitUntil: 'domcontentloaded' });

// The app should: accept the invite, join the camp, route to the island, and the
// island iframe should raise the beacon at the waterfall.
await p.waitForTimeout(1200);
const urlCleared = !p.url().includes('meet=');
console.log('address bar cleared of the live code:', urlCleared);

const camp = await p.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('driftwood_gathering_v1') || 'null')?.code ?? null; } catch { return null; }
});
console.log('camp joined:', camp, camp === code ? '✓' : '✗ MISMATCH');

// reach into the same-origin island iframe
const frame = p.frames().find(f => f.url().includes('island3d'));
console.log('island iframe present:', !!frame);
let rally = null;
if (frame) {
  await frame.waitForFunction(() => !!window._islandDebug, { timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(1500);
  rally = await frame.evaluate(() => window._islandDebug?.rally?.() ?? null);
}
console.log('beacon standing:', JSON.stringify(rally), rally?.spot === 'waterfall' ? '✓ at the waterfall' : '✗ NO BEACON');

await p.screenshot({ path: '/tmp/invite-landing.png' });

const pass = camp === code && rally?.spot === 'waterfall' && urlCleared;
console.log(errs.length ? `\n❌ ${errs.length} error(s):\n${errs.slice(0, 4).join('\n')}`
  : `\n${pass ? '✅ HE LANDED AT THE WATERFALL' : '❌ the invite did not complete'} — camp ${camp === code}, beacon ${rally?.spot === 'waterfall'}, url ${urlCleared}`);
await b.close();
process.exit(pass ? 0 : 1);
