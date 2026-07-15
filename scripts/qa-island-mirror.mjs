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

console.log(`\n${failures === 0 ? '✅ THE MIRROR HOLDS' : `❌ ${failures} FAILURE(S)`} — the island says what the canon says.\n`);
process.exit(failures === 0 ? 0 : 1);
