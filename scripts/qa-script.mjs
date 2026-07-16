// ─────────────────────────────────────────────────────────────────────────────
//  qa-script — THE STORY GATE. THE_WAYWARD_BOY.md guides everything (Lance,
//  2026-07-16), and this gate is how that stays true without anyone watching.
//
//  Born the day Lance found the boarding still speaking generation-2 script
//  (THE_TIDE_LINE's brochure tour) two days after the origin was rewritten.
//  The reconciliation pass fixed the climax and missed the front door, and
//  nothing noticed — because nothing asserted it. So: assert it.
//
//  Three promises:
//   A · THE_DRIFTWOOD_SCRIPT.md exists and maps every one of the 31 milestones
//   B · the canon marks live in the player-facing sources
//   C · the forbidden generation-2 phrases appear NOWHERE a player can read
//
//  Run: node scripts/qa-script.mjs
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';

let failures = 0;
const ok = (label, cond, detail = '') => {
  console.log(`  ${cond ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!cond) failures++;
};
const read = p => fs.readFileSync(p, 'utf8');

console.log('\nqa-script — the app still tells THE WAYWARD BOY\n');

// A · the script doc, and its coverage of the 31
const script = read('THE_DRIFTWOOD_SCRIPT.md');
const milestones = read('src/data/milestones.ts');
const msIds = [...milestones.matchAll(/id: '(ms_[a-z_0-9]+)'/g)].map(m => m[1]);
ok('the canonical script exists and is non-trivial', script.length > 4000);
ok('the app has 31 milestones', msIds.length === 31, `found ${msIds.length}`);
const unmapped = msIds.filter(id => !script.includes(id));
ok('every milestone id is mapped in the script', unmapped.length === 0, unmapped.join(', '));
ok('the script names the blessed source', script.includes('THE_WAYWARD_BOY.md'));

// B · the canon marks, where players read
const boarding = read('src/components/BoardingStory.tsx');
const island3d = read('public/island3d/index.html');
const vr = read('public/vr/index.html');
ok('the maker is named: Elias speaks from the cave', /Elias/.test(milestones));
// THE 1954 FRAME (Lance, 2026-07-16, restoring his Jul-14 dictation): the
// player family IS a Halcyon family. No guide, no present day, anywhere.
ok('the crossing is the Halcyon (boarding)', /Halcyon/.test(boarding));
ok('the wreck year is 1954 (boarding)', /1954/.test(boarding));
ok('the cave remembers the Brennan boy (milestones)', /Brennan/.test(milestones));
ok("Elias's notebooks close the reveal (why we practice)", /why we practice/.test(milestones));
ok('the ending is Malakor\'s arrival — the invasion', /Malakor/.test(milestones));
ok('the boat can be named DRIFTWOOD (the word said with love)', /THE DRIFTWOOD/.test(milestones));
ok('the prologue carries Gullhaven (Book One opens the app)', /Gullhaven/i.test(boarding));
ok('the prologue carries the name given in love and insult', /DRIFTWOOD/.test(boarding));
ok('the boarding header cites the blessed canon, not the seed',
  boarding.includes('THE_WAYWARD_BOY.md canon'));
ok('THE TOOLS WILL ANSWER stands over the workshop (island3d)', /THE TOOLS WILL ANSWER/.test(island3d));
ok('THE TOOLS WILL ANSWER stands over the workshop (VR)', /THE TOOLS WILL ANSWER/.test(vr));

// C · the forbidden phrases — generation-2 script may not reach a player.
//     Player-facing sources only: docs may quote history; the app may not.
const PLAYER_SOURCES = {
  'BoardingStory.tsx': boarding,
  'milestones.ts': milestones,
  'milestoneCraft.ts': read('src/data/milestoneCraft.ts'),
  'therapyContent.ts': read('src/data/therapyContent.ts'),
  'island3d/index.html': island3d,
  'vr/index.html': vr,
};
const FORBIDDEN = [
  ['the brochure-tour frame', /brochure|ISLAND ADVENTURE/i],
  ['the old robot origin (lost in shipping)', /lost in shipping|shelved at almost|cousins of the Wayward Crew/i],
  // The guide character was cut entire (Lance, 2026-07-16): the player family
  // IS the 1954 family, so no Bauer may reach a player anywhere, ever.
  ['the cut guide character (any Bauer)', /Bauer/i],
  ['the present-day tour frame', /twelfth family|tour boat|island tours/i],
];
for (const [label, re] of FORBIDDEN) {
  const hits = Object.entries(PLAYER_SOURCES)
    .filter(([, src]) => re.test(src)).map(([name]) => name);
  ok(`no player-facing source carries ${label}`, hits.length === 0, hits.join(', '));
}

console.log(`\n${failures === 0 ? '✅ THE STORY HOLDS' : `❌ ${failures} FAILURE(S)`} — the wayward boy guides everything.\n`);
process.exit(failures === 0 ? 0 : 1);
