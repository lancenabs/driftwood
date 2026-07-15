// ─────────────────────────────────────────────────────────────────────────────
//  qa-island-mirror — the island3d world is a MIRROR. This proves it still is.
//
//  public/island3d/index.html is a standalone module page: it cannot import a
//  .ts file, so the 31 milestones, the season circles and the address book are
//  hand-copied into it. Hand-copied data drifts — that is not a worry, it is a
//  measurement. The island's LANDMARKS and VR's have ALREADY drifted to the
//  point of sharing almost nothing (VR has no Waterfall, no Workshop, no
//  Lookout, no Wreck Beach), and nothing noticed, because nothing asserted it.
//
//  So: assert it. This is the cheap half of "one source of truth" — we can't
//  stop the copy, but a copy that is checked every run cannot lie for long.
//
//  Run: node scripts/qa-island-mirror.mjs
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';

const HTML = 'public/island3d/index.html';
let failures = 0;
const ok = (label, cond, detail = '') => {
  console.log(`  ${cond ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!cond) failures++;
};

console.log('\nqa-island-mirror — the island still says what the canon says\n');

const html = fs.readFileSync(HTML, 'utf8');
const craft = fs.readFileSync('src/data/milestoneCraft.ts', 'utf8');
const canon = fs.readFileSync('src/data/milestones.ts', 'utf8');

// ── A · the 31, and their season numbers ────────────────────────────────────
console.log('A · the 31 milestones');
const msLine = html.match(/^const MS = (\[.*\]);$/m);
ok('island3d has its MS mirror', !!msLine);
const MS = msLine ? JSON.parse(msLine[1]) : [];
ok('it mirrors 31 milestones', MS.length === 31, `found ${MS.length}`);

// canon: id/n/season triples out of milestones.ts
const canonMs = [...canon.matchAll(/id:\s*'(ms_[a-z_0-9]+)',\s*n:\s*(\d+),\s*season:\s*(\d+)/g)]
  .map(m => ({ id: m[1], n: +m[2], s: +m[3] }));
ok('canon parses 31 milestones', canonMs.length === 31, `found ${canonMs.length}`);

for (const c of canonMs) {
  const m = MS.find(x => x.id === c.id);
  if (!m) { ok(`${c.id} is on the island`, false, 'MISSING from the mirror'); continue; }
  if (m.n !== c.n || m.s !== c.s) {
    ok(`${c.id} agrees`, false, `canon n=${c.n} s=${c.s} · island n=${m.n} s=${m.s}`);
  }
}
const strays = MS.filter(m => !canonMs.some(c => c.id === m.id));
ok('the island invents no milestones', strays.length === 0, strays.map(s => s.id).join(', '));
if (canonMs.length === 31 && strays.length === 0) ok('every milestone matches the canon', true);

// ── B · the address book ────────────────────────────────────────────────────
console.log('\nB · the address book (Lance\'s sentence: "meet me at the waterfall")');
const tsPlaces = Object.fromEntries(
  [...(craft.match(/export const MILESTONE_PLACE[^}]+}/s)?.[0] ?? '')
    .matchAll(/(ms_[a-z_0-9]+):\s*'([a-z_]+)'/g)].map(m => [m[1], m[2]]));
const jsPlaces = Object.fromEntries(
  [...(html.match(/const MS_PLACE = \{[^}]+\}/s)?.[0] ?? '')
    .matchAll(/(ms_[a-z_0-9]+):\s*'([a-z_]+)'/g)].map(m => [m[1], m[2]]));

ok('milestoneCraft.ts declares an address book', Object.keys(tsPlaces).length > 0);
ok('island3d mirrors it', Object.keys(jsPlaces).length > 0);
ok('the two agree exactly', JSON.stringify(tsPlaces) === JSON.stringify(jsPlaces),
  JSON.stringify(tsPlaces) === JSON.stringify(jsPlaces) ? ''
    : `canon=${JSON.stringify(tsPlaces)} island=${JSON.stringify(jsPlaces)}`);

// every address must resolve to a real landmark, or the couple walks to nowhere
const landmarks = [...html.matchAll(/\{\s*id:\s*'([a-z_]+)',\s*name:\s*'[^']+',\s*emoji/g)].map(m => m[1]);
ok('LANDMARKS parse', landmarks.length >= 8, `found ${landmarks.length}: ${landmarks.join(', ')}`);
for (const [ms, place] of Object.entries(tsPlaces)) {
  ok(`${ms} → ${place} is a real place`, landmarks.includes(place),
    landmarks.includes(place) ? '' : 'NO SUCH LANDMARK — this milestone has no address');
}
ok('milestoneSpot actually honours the address book', /const addr = MS_PLACE\[m\.id\]/.test(html));

// ── C · the season circles ──────────────────────────────────────────────────
console.log('\nC · the season circles');
// NB: NOT [^;]+ — the TS type annotation (Record<number, { x: number; z: number
// ... }>) is full of semicolons, so that stops dead inside the type and reports
// zero circles. It looked like drift and was this regex.
const tsC = [...(craft.match(/export const SEASON_CIRCLES[\s\S]*?\n\};/)?.[0] ?? '')
  .matchAll(/(\d):\s*\{\s*x:\s*(-?\d+),\s*z:\s*(-?\d+)/g)].map(m => `${m[1]}:${m[2]},${m[3]}`);
const jsC = [...(html.match(/const SEASON_CIRCLES = \{[\s\S]*?\};/)?.[0] ?? '')
  .matchAll(/(\d):\s*\{\s*x:\s*(-?\d+),\s*z:\s*(-?\d+)/g)].map(m => `${m[1]}:${m[2]},${m[3]}`);
ok('all five seasons are anchored', tsC.length === 5, `canon has ${tsC.length}`);
ok('the island stands them in the same places', tsC.join(' | ') === jsC.join(' | '),
  tsC.join(' | ') === jsC.join(' | ') ? '' : `canon=[${tsC}] island=[${jsC}]`);

// ── D · DRIFTWOOD CITY — one island, one geography ──────────────────────────
//
// Lance's call 2026-07-14: the city is ON the walkable island and the 31 light
// it. Before that every surface placed the city itself — island3d didn't render
// it at all, VR strung it in a ring, the board laid it flat — and they had
// drifted to sharing almost nothing. The coords in driftwoodCity.ts are now the
// ONE geography; the generated JSON is how the standalone worlds read them.
console.log('\nD · Driftwood City — one island, one geography');
const cityTs = fs.readFileSync('src/data/driftwoodCity.ts', 'utf8');
const cityJson = JSON.parse(fs.readFileSync('public/city/driftwood-city.json', 'utf8'));

ok('every place has an address in the source of truth',
  (cityTs.match(/ x: -?\d+, z: -?\d+,/g) ?? []).length === 27,
  `${(cityTs.match(/ x: -?\d+, z: -?\d+,/g) ?? []).length}/27`);
ok('the generated JSON carries them',
  cityJson.places.every(p => typeof p.x === 'number' && typeof p.z === 'number'));
ok('the JSON is not stale (27 places)', cityJson.places.length === 27, `${cityJson.places.length}`);
ok('island3d reads the generated city', /fetch\('\/city\/driftwood-city\.json'\)/.test(html));

const lits = cityJson.places.map(p => p.lightsAt);
ok('every place is keyed to the milestone that lights it',
  lits.every(n => Number.isInteger(n) && n >= 1 && n <= 31));
ok('nothing lights before milestone 4 (First Fire is the turn)',
  Math.min(...lits) >= 4, `min=${Math.min(...lits)}`);
ok('the last thing to light is lantern-park at 31 — the payoff',
  cityJson.places.find(p => p.id === 'lantern-park')?.lightsAt === 31);
ok('no two places light at the same milestone', new Set(lits).size === lits.length);
ok('the city is DARK until earned (ch 18: lamps that had never been lit)',
  /opacity: 0,[\s\S]{0,90}AdditiveBlending/.test(html));
ok('milestone 31 lights everything still dark', /n >= L\.lightsAt \|\| n >= 31/.test(html));
ok('the lamps are halos, not 27 PointLights (this must run on a phone)',
  !/const glow = new THREE\.PointLight\(0xFFC98A/.test(html));

// every place must stand on real, walkable ground — islandHeight transcribed
const cityH = (x, z) => {
  const ss = (v, a, b) => { if (v <= a) return 0; if (v >= b) return 1; v = (v - a) / (b - a); return v * v * (3 - 2 * v); };
  const noise = (a, c) => Math.sin(a * 0.055) * Math.cos(c * 0.047) + Math.sin(a * 0.021 + c * 0.033) * 1.6;
  const r = Math.hypot(x, z); if (r > 136) return -6;
  let h = -5 + (1 - ss(r, 98, 130)) * 5.9;
  const shore = 1 - ss(r, 55, 102);
  h += shore * (7 + noise(x, z) * 2.4);
  h += Math.exp(-Math.pow((x + 40) / 55, 2)) * Math.exp(-Math.pow((z + 55) / 70, 2)) * 26 * shore;
  return h;
};
const cityGrade = (x, z) => { const e = 1.5;
  return Math.hypot((cityH(x + e, z) - cityH(x - e, z)) / (2 * e), (cityH(x, z + e) - cityH(x, z - e)) / (2 * e)); };
const drowned = cityJson.places.filter(p => cityH(p.x, p.z) < 2);
const steep = cityJson.places.filter(p => cityGrade(p.x, p.z) > 0.17);
ok('no place is in the sea', drowned.length === 0, drowned.map(p => p.id).join(', '));
ok('no place is on unbuildable ground (>17% grade)', steep.length === 0,
  steep.map(p => `${p.id} ${(cityGrade(p.x, p.z) * 100).toFixed(0)}%`).join(', '));
const STORY = [['wreck_beach', -6, 96], ['forge', -34, -44], ['waterfall', -52, -18],
  ['totem', 6, 86], ['workshop', -20, -64], ['camp', 0, 92], ['lookout', 30, -85]];
const onTop = cityJson.places.flatMap(p => STORY
  .filter(([n, x, z]) => Math.hypot(p.x - x, p.z - z) < 12).map(([n]) => `${p.id}->${n}`));
ok('the city does not stand on a story landmark', onTop.length === 0, onTop.join(', '));

console.log(`\n${failures === 0 ? '✅ THE MIRROR HOLDS' : `❌ ${failures} FAILURE(S)`} — the island says what the canon says.\n`);
process.exit(failures === 0 ? 0 : 1);
