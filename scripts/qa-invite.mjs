// ─────────────────────────────────────────────────────────────────────────────
//  qa-invite — "meet me at the waterfall" survives, from link to beacon.
//
//  The invite is a four-file chain and every link is silent when it breaks: a
//  bad hop just means the beacon quietly doesn't rise, and the couple stands in
//  an empty clearing. So assert the chain end to end, statically:
//
//    invite.ts     builds/parses the link, hosts the camp
//    App.tsx       accepts it on load → joins the camp → routes to the island
//    ChallengesTab hands the place to the iframe as #at=<place>
//    island3d      parses the hash and raises the beacon
//
//  The live proof (a real browser, both devices) is scripts/shot-invite.mjs.
//  This is the cheap tripwire that runs every commit.
//
//  Run: node scripts/qa-invite.mjs
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';

let failures = 0;
const ok = (label, cond, detail = '') => {
  console.log(`  ${cond ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!cond) failures++;
};

console.log('\nqa-invite — from a texted link to a beacon on the waterfall\n');

const invite = fs.readFileSync('src/lib/invite.ts', 'utf8');
const app = fs.readFileSync('src/App.tsx', 'utf8');
const challenges = fs.readFileSync('src/components/ChallengesTab.tsx', 'utf8');
const island = fs.readFileSync('public/island3d/index.html', 'utf8');

// ── A · the module ──────────────────────────────────────────────────────────
console.log('A · invite.ts');
for (const fn of ['parseInvite', 'buildInviteURL', 'createInvite', 'acceptInvite', 'consumeRallyTarget', 'clearInviteFromURL']) {
  ok(`exports ${fn}`, new RegExp(`export (async )?function ${fn}`).test(invite));
}
ok('createInvite hosts a camp if this device has none',
  /if \(!code\) code = await hostGathering\(\)/.test(invite));

// every meetable place must be a real island landmark, or the beacon can't rise
const meetIds = [...(invite.match(/export const MEET_PLACES[\s\S]*?\n\};/)?.[0] ?? '')
  .matchAll(/^\s{2}([a-z_]+):\s*\{/gm)].map(m => m[1]);
const landmarks = [...island.matchAll(/\{\s*id:\s*'([a-z_]+)',\s*name:\s*'[^']+',\s*emoji/g)].map(m => m[1]);
ok('MEET_PLACES is non-empty', meetIds.length > 0, meetIds.join(', '));
for (const id of meetIds) {
  ok(`${id} is a real island landmark`, landmarks.includes(id),
    landmarks.includes(id) ? '' : 'NO SUCH LANDMARK — an invite here raises no beacon');
}

// ── B · the pure round-trip (re-implemented, so a logic change is caught) ────
console.log('\nB · build → parse is stable');
{
  const build = (code, place, ms) => {
    const q = new URLSearchParams({ meet: code });
    if (place) q.set('at', place);
    if (ms) q.set('ms', String(ms));
    return `https://x/?${q.toString()}`;
  };
  const parse = (url) => {
    const q = new URLSearchParams(new URL(url).search);
    const code = (q.get('meet') || '').trim().toUpperCase();
    if (!code) return null;
    const place = (q.get('at') || '').trim().toLowerCase();
    const msRaw = q.get('ms');
    const ms = msRaw && /^\d+$/.test(msRaw) ? Number(msRaw) : undefined;
    return { code, place: place || undefined, milestone: ms };
  };
  const a = parse(build('ABC123', 'waterfall', 4));
  ok('code round-trips', a?.code === 'ABC123', a?.code);
  ok('place round-trips', a?.place === 'waterfall', a?.place);
  ok('milestone round-trips', a?.milestone === 4, String(a?.milestone));
  ok('no code → no invite', parse('https://x/?at=waterfall') === null);
  ok('lowercase code is normalised up', parse('https://x/?meet=abc123')?.code === 'ABC123');
}

// ── C · the app accepts it ──────────────────────────────────────────────────
console.log('\nC · App.tsx honours an arriving invite');
ok('parses the invite on load', /parseInvite\(\)/.test(app));
ok('accepts it (joins the camp)', /acceptInvite\(inv\)/.test(app));
ok('lands on the ISLAND, not the home tab', /setActiveTab\('challenges'\)/.test(app));
ok('clears the live code from the address bar', /clearInviteFromURL\(\)/.test(app));

// ── D · the place reaches the island ────────────────────────────────────────
console.log('\nD · the place reaches the island iframe');
ok('ChallengesTab consumes the rally target', /consumeRallyTarget\(\)/.test(challenges));
ok('and passes it as the iframe hash', /island3d\/index\.html#\$\{/.test(challenges));
ok('computed once at mount (a re-render must not reload the iframe)',
  /useMemo\(\(\) => \{[\s\S]*?consumeRallyTarget/.test(challenges));

// ── E · the island raises the beacon ────────────────────────────────────────
console.log('\nE · island3d raises the beacon from the hash');
ok('reads #at from the hash', /new URLSearchParams\(\(location\.hash \|\| ''\)/.test(island));
ok('validates it against a real landmark', /LANDMARKS\.some\(l => l\.id === at\)/.test(island));
ok('raises the rally beacon', /invitedBeacon[\s\S]{0,400}raiseRally\(at/.test(island));
ok('the sender can text a link (the rally button builds one)',
  /\$\{location\.origin\}\/\?meet=\$\{campCode\}&at=\$\{nearLandmark\.id\}/.test(island));

console.log(`\n${failures === 0 ? '✅ THE INVITE HOLDS' : `❌ ${failures} FAILURE(S)`} — "meet me at the waterfall" is a sentence the app can honour.\n`);
process.exit(failures === 0 ? 0 : 1);
