// Look at Driftwood City. Dark, then earned.
import { chromium } from 'playwright';
const OUT = process.env.OUT || '/tmp/city';
const errs = [];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 960, height: 620 } });
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
p.on('pageerror', e => errs.push(String(e)));
await p.goto('http://localhost:3300/island3d/index.html', { waitUntil: 'networkidle' });
await p.waitForTimeout(3500);

console.log('city places built:', await p.evaluate(() => window._islandDebug.whatsAt(-8, 18, 60).filter(o => o.geo === 'ConeGeometry').length), '(roofs within 60m of the Heart)');

const shots = [
  ['A-heart',        [[-8, 30, 40],   [-8, 16, 18]]],
  ['B-city-air',     [[-6, 66, 92],   [-8, 14, 14]]],   // cresting the rise from the wreck beach
  ['C-street',       [[-14, 17, 30],  [-8, 16, 18]]],
  ['D-flume',        [[-34, 34, 8],   [-46, 24, -12]]], // the aqueduct climbing to the falls
  ['E-timber',       [[-2, 22, 34],   [-10, 15, 20]]],
];
for (const [label, [pos, target]] of shots) {
  await p.evaluate(([pos, target]) => window._islandDebug.freeCam(pos, target), [pos, target]);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}-${label}.png` });
  console.log(' ', label);
}
// now EARN it. The city comes on one place at a time.
for (const n of [0, 4, 12, 20, 31]) {
  const r = await p.evaluate((n) => window._islandDebug.closeMilestones(n), n);
  console.log(`  ${String(n).padStart(2)} milestones closed → ${r.lit}/${r.of} lamps lit`);
  await p.evaluate(() => window._islandDebug.freeCam([-8, 34, 46], [-8, 15, 16]));
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}-Z-lit-${String(n).padStart(2,'0')}.png` });
}
console.log(errs.length ? `\n❌ ${errs.length} error(s):\n${errs.slice(0,5).join('\n')}` : '\n✓ no console errors — now LOOK.');
await b.close();
