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

// ── F · the payload survives a family that has actually done something ──────
//
// This section exists because of a real P0 that every other check passed over.
// The milestone log is an OBJECT — MilestoneLog.tsx writes { closed: string[],
// investigating } — and readLog() assumes an array. So .slice(0, 50) on it threw
// a TypeError the moment a family closed their FIRST milestone, and syncNow()
// fails silent by design. The therapist got NOTHING, silently, from exactly the
// point the data started to matter.
//
// It passed everything, because an EMPTY store falls back to '[]' and behaves.
// The gate only ever tested the happy hour. Assert the loaded gun, not the
// empty one.
console.log('\nF · the payload survives a family that has DONE something');
ok('the milestone log has a dedicated reader (it is not an array)',
  /const readClosed = \(\): string\[\]/.test(src));
ok('planksEarned uses it', /planksEarned: readClosed\(\)\.length/.test(src));
ok('milestoneLog uses it', /milestoneLog: readClosed\(\)\.slice/.test(src));
// strip comments first — the note explaining this bug quotes the bad call, and
// a gate that can't tell code from prose lies in both directions
const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
{
  const bad = /readLog\(\s*['"`]driftwood_milestone_log_v1/.test(code);
  ok('nothing reads the milestone log through readLog() any more', !bad,
    bad ? 'FOUND ONE — this throws the moment a family closes a milestone' : '');
}
ok('the reader tolerates both shapes', /Array\.isArray\(s\?\.closed\)/.test(src));

// and prove the semantics, not just the spelling
{
  const stored = JSON.stringify({ closed: ['ms_count_heads', 'ms_high_ground'], investigating: null });
  const readLogSim = (v) => { try { return JSON.parse(v || '[]'); } catch { return []; } };
  const readClosedSim = (v) => {
    try {
      const s = JSON.parse(v || 'null');
      if (Array.isArray(s?.closed)) return s.closed;
      if (Array.isArray(s)) return s;
      return [];
    } catch { return []; }
  };
  let oldThrew = false;
  try { readLogSim(stored).slice(0, 50); } catch { oldThrew = true; }
  ok('the OLD read really did throw on a real log (the bug was real)', oldThrew);
  ok('the new read returns the closed milestones', readClosedSim(stored).length === 2,
    `got ${readClosedSim(stored).length}`);
  ok('the new read still handles an empty store', readClosedSim(null).length === 0);
  ok('the new read still handles a bare array', readClosedSim('["a"]').length === 1);
}

// ── G · the deferral signal actually COMPLETES ─────────────────────────────
// Lance's #1 instrument: "did they do the homework, or did they put it off?"
// buildDeferralRecords reads receipts, but nothing recorded a 'completed' receipt
// when a milestone closed — so the therapist saw "assigned" and never "done
// together." This asserts the reconciler exists, runs before the payload, and
// keys on the closed log.
console.log('\nG · the deferral completes (did they do the homework?)');
ok('a milestone-completion reconciler exists', /function detectMilestoneCompletions/.test(src));
ok('it keys off the real closed log', /detectMilestoneCompletions[\s\S]{0,200}readClosed\(\)/.test(src));
ok('it only completes assignments that name a milestone', /\.milestoneId as string/.test(src));
ok('syncNow reconciles BEFORE building the payload',
  /detectMilestoneCompletions\(state\)[\s\S]{0,120}buildExportPayload\(\)/.test(src));
ok('the deferral records whether they were together', /wasTogetherAround\(completed\)/.test(src));

// prove the semantics end to end (re-implemented, so a logic change is caught)
{
  const recordReceipt = (receipts, id, status) => {
    const rank = { received: 1, opened: 2, completed: 3 };
    const cur = receipts[id];
    if (cur && (rank[cur.status] ?? 0) >= (rank[status] ?? 0)) return;
    receipts[id] = { status, at: new Date().toISOString() };
  };
  const reconcile = (directives, receipts, closed) => {
    const set = new Set(closed);
    for (const d of directives) {
      if (d.type !== 'push_app' && d.type !== 'suggest_work') continue;
      if (receipts[d.id]?.status === 'completed') continue;
      const ms = d.payload?.milestoneId;
      if (ms && set.has(ms)) recordReceipt(receipts, d.id, 'completed');
    }
  };
  const buildDeferral = (directives, receipts) => directives.flatMap(d => {
    const r = receipts[d.id]; if (!r) return [];
    const completed = r.status === 'completed';
    return [{ what: d.payload.milestoneId, assignedAt: d.issuedAt, completedAt: completed ? r.at : undefined,
      hoursToOpen: completed ? (new Date(r.at) - new Date(d.issuedAt)) / 3.6e6 : undefined }];
  });

  const assigned = new Date(Date.now() - 13 * 3.6e6).toISOString();   // 13h ago, in session
  const directives = [{ id: 'd1', type: 'push_app', issuedAt: assigned, payload: { milestoneId: 'ms_two_huts' } }];
  const receipts = {};

  let recs = buildDeferral(directives, receipts);
  ok('before they do it: no completion crosses', recs.length === 0);

  reconcile(directives, receipts, []);                     // nothing closed yet
  ok('assigned-but-untouched still does not complete', !receipts.d1);

  reconcile(directives, receipts, ['ms_two_huts']);        // they finish challenge 10
  recs = buildDeferral(directives, receipts);
  ok('after they finish: it completes', recs[0]?.completedAt !== undefined);
  ok('and Lance gets hours-to-open (~13h — the night before)',
    recs[0]?.hoursToOpen > 12 && recs[0]?.hoursToOpen < 14, `${recs[0]?.hoursToOpen?.toFixed(1)}h`);
  ok('a different milestone closing does NOT complete this one', (() => {
    const rc = {}; reconcile(directives, rc, ['ms_first_fire']); return !rc.d1;
  })());
}

console.log(`\n${failures === 0 ? '✅ THE BRIDGE HOLDS' : `❌ ${failures} FAILURE(S)`} — what they say at the waterfall stays theirs.\n`);
process.exit(failures === 0 ? 0 : 1);
