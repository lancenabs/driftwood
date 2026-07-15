// Look at the waterfall. Not "did it throw" — LOOK at it.
// The first pass exited clean with zero console errors while the geometry was
// visibly broken on screen. The screenshot is the only real gate here.
//
//   node scripts/shot-waterfall.mjs      → /tmp/wf-*.png
import { chromium } from 'playwright';

const OUT = process.env.OUT || '/tmp/wf';
const errs = [];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 900, height: 640 } });
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
p.on('pageerror', e => errs.push(String(e)));

// NB: /island3d/ hits the SPA fallback and serves the React app. The static
// world only answers to its full path.
await p.goto('http://localhost:3300/island3d/index.html', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);

const G = (x, z) => p.evaluate(([x, z]) => +window._islandDebug.groundY(x, z).toFixed(2), [x, z]);
const WF = [-52, -18], WS = [-20, -64], TT = [6, 86];
console.log('ground at waterfall', await G(...WF), '· workshop', await G(...WS), '· totem', await G(...TT));

const shots = [
  // free camera — [camera xyz, target xyz]. The chase cam cannot see a hillside.
  // base = groundY(-52,-18) = 22.39. Eye height 1.6 above real ground: this is
  // what a PERSON sees walking up the ramp from the shore, which is the only
  // view that decides whether this place works.
  ['P1-approach-30m', [[-52, 18.6, 4],   [-52, 25, -22]]],   // ground 17.0
  ['P2-approach-14m', [[-52, 22.7, -12], [-52, 26, -22]]],   // ground 21.1
  ['P3-at-the-rim',   [[-52, 24.0, -16], [-52, 26, -23]]],   // ground 22.4 — the reveal
  ['C-falls-side',    [[-38, 29, -12],   [-52, 25, -23]]],
  ['D-falls-air',     [[-52, 42, 6],     [-52, 25, -24]]],
  ['E-cave-inside',   [[-52, 26.3, -23.0], [-52, 26.4, -30]]],  // facing the back wall
  ['E2-cave-outward', [[-52, 26.9, -28.5], [-52, 25, -12]]],  // looking out THROUGH the water
  ['F-workshop',      [[-20, 30, -52],   [-20, 27, -64]]],
  ['G-totem',         [[6, 8, 98],       [6, 4, 86]]],
];

for (const [label, [pos, target]] of shots) {
  await p.evaluate(([pos, target]) => window._islandDebug.freeCam(pos, target), [pos, target]);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}-${label}.png` });
  console.log(`  ${label}`);
}
await p.evaluate(() => window._islandDebug.freeCam(null));   // hand it back

console.log(errs.length
  ? `\n❌ ${errs.length} console error(s):\n${errs.join('\n')}`
  : '\n✓ no console errors — which proves nothing about how it LOOKS. Open the PNGs.');
await b.close();
