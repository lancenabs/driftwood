// ─────────────────────────────────────────────────────────────────────────────
//  qa-bridge — the gate that guards Lance's bright line.
//
//  Driftwood is bridge client #3, and the only one that syncs a RELATIONSHIP.
//  Three laws (Lance's decisions, 2026-07-14) are load-bearing and easy to break
//  by accident six months from now, when somebody adds "just one more field":
//
//   1 · THE CHAT NEVER CROSSES. Not redacted, not summarised — never sent.
//   2 · CRISIS TOOLS ARE NEVER REMOTE-LOCKABLE. Fleet law §0.0.
//   3 · NO HOTLINES ON ANY SURFACE. Crisis lives in Settings only.
//
//  The voices in the Command Center died six times because nothing asserted
//  them. This asserts these. Static analysis — no browser, no network, runs in
//  a second, and fails loudly.
//
//  Run: node scripts/qa-bridge.mjs
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';

const SRC = 'src/lib/companionLink.ts';
let failures = 0;

function ok(label, cond, detail = '') {
  console.log(`  ${cond ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!cond) failures++;
}

console.log('\nqa-bridge — the treaty, and the bright line\n');

if (!fs.existsSync(SRC)) {
  console.log(`  ✗ ${SRC} does not exist — Driftwood has no bridge.`);
  process.exit(1);
}
const src = fs.readFileSync(SRC, 'utf8');

// ── A · the bright line ─────────────────────────────────────────────────────
console.log('A · THE CHAT NEVER CROSSES');
const CHAT_KEYS = [
  'driftwood_jumble_chat_v1',
  'driftwood_gathering_v1',
  'driftwood_session_history',
  'driftwood_feedback_comments',
];
ok('CHAT_KEYS denylist exists', /const CHAT_KEYS\s*=\s*new Set\(/.test(src));
for (const k of CHAT_KEYS) {
  ok(`${k} is on the denylist`, new RegExp(`CHAT_KEYS[\\s\\S]*?${k}`).test(src));
}
// The real assertion: no chat key may be READ into a payload. It may only ever
// appear inside the CHAT_KEYS block itself.
const denylistBlock = (src.match(/const CHAT_KEYS\s*=\s*new Set\(\[[\s\S]*?\]\);/) ?? [''])[0];
for (const k of CHAT_KEYS) {
  const outside = src.split(denylistBlock).join('');
  const readIn = new RegExp(`readLog\\(\\s*['"\`]${k}|getItem\\(\\s*['"\`]${k}`).test(outside);
  ok(`${k} is never read into a payload`, !readIn,
    readIn ? 'FOUND A READ — the bright line is broken' : '');
}
ok('a runtime guard rejects chat in any payload', /function assertNoChat/.test(src));
ok('the guard actually runs before returning the payload',
  /assertNoChat\(payload\)/.test(src));

// ── B · crisis is never remote-controllable ─────────────────────────────────
console.log('\nB · CRISIS TOOLS ARE NEVER REMOTE-LOCKABLE (fleet law §0.0)');
ok('CRISIS_TOOLS set is defined', /const CRISIS_TOOLS\s*=\s*new Set\(/.test(src));
for (const t of ['crisis_safety_plan', 'tipp_skills', 'grounding_54321', 'recovery_space']) {
  ok(`${t} is protected`, new RegExp(`CRISIS_TOOLS[\\s\\S]{0,200}${t}`).test(src));
}
ok('lock directives filter crisis tools defensively',
  /CRISIS_TOOLS\.forEach\(\s*t\s*=>\s*locked\.delete\(t\)\s*\)/.test(src));

// ── C · no hotline ever appears here (crisis law 2026-07-12) ────────────────
console.log('\nC · NO HOTLINE ON ANY SURFACE (Settings-only law)');
const HOTLINES = [/\b988\b/, /1-800-799-7233/, /1-800-273/, /\bSAMHSA\b/, /741741/];
for (const re of HOTLINES) {
  ok(`no ${re.source} in the bridge`, !re.test(src));
}

// ── D · the treaty holds ────────────────────────────────────────────────────
console.log('\nD · the proven contract (ported from lance-app → rehabit → here)');
for (const fn of ['pairWithCode', 'syncNow', 'getLockedTools', 'getTherapistConfig', 'buildExportPayload']) {
  ok(`${fn} exists`, new RegExp(`export (async )?function ${fn}`).test(src));
}
ok('world is declared as shore', /world:\s*['"`]shore['"`]/.test(src));
ok('sync fails silent (never blocks the island)',
  /catch\s*{[\s\S]{0,120}return false/.test(src));

// ── E · the dyad + the deferral signal (Lance's decisions) ──────────────────
console.log('\nE · the dyad, and the signal he asked for');
ok('disconnect() unpairs THIS device only (either can leave alone)',
  /Unpair THIS device only/.test(src));
ok('the deferral signal is built', /export function buildDeferralRecords/.test(src));
ok('it records hours-to-open (the "did they put it off" tell)',
  /hoursToOpen/.test(src));
ok('it records whether they were together', /together\?:\s*boolean|together:/.test(src));
ok('together counts distinct ACTORS, not actor-vs-device (the bug that would lie)',
  /actors\.size > 1/.test(src) && !/a\s*!==\s*me/.test(src));
ok('the no-scorekeeping law is written at the seam',
  /NO SCOREKEEPING BETWEEN PARTNERS/.test(src));

console.log(`\n${failures === 0 ? '✅ THE BRIDGE HOLDS' : `❌ ${failures} FAILURE(S)`} — what they say at the waterfall stays theirs.\n`);
process.exit(failures === 0 ? 0 : 1);
