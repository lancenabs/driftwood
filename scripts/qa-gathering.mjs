#!/usr/bin/env node
// qa-gathering.mjs — the Gathering relay's standing gate (D3D-0).
// Asserts the transport honestly: camp creation · SSE welcome with backlog ·
// two-device event round trip · dedup · presence on join AND leave · the
// event law enforced (400 without actor/action) · unknown camp → 404.

const BASE = process.env.DRIFTWOOD_BASE || 'http://localhost:3300';
let failures = 0, step = 0;
const ok = (name, cond, detail = '') => {
  step++;
  console.log(`  ${cond ? '✓' : '✗'} ${step}. ${name}${cond ? '' : detail ? ` — ${detail}` : ''}`);
  if (!cond) failures++;
};

// A minimal SSE reader on fetch streams (no dependencies, like the relay itself).
async function openStream(url, onMsg) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`stream ${res.status}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  (async () => {
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf('\n\n')) >= 0) {
          const chunk = buf.slice(0, idx); buf = buf.slice(idx + 2);
          const line = chunk.split('\n').find(l => l.startsWith('data: '));
          if (line) { try { onMsg(JSON.parse(line.slice(6))); } catch { /* beat */ } }
        }
      }
    } catch { /* closed */ }
  })();
  return () => reader.cancel().catch(() => {});
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const j = async (method, p, body) => {
  const r = await fetch(`${BASE}${p}`, {
    method, headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null; try { json = await r.json(); } catch { /* sse */ }
  return { status: r.status, json };
};

console.log(`\n🔥 GATHERING GATE — ${BASE}\n`);

// 1 · host a camp
const host = await j('POST', '/api/gathering');
const code = host.json?.code;
ok('camp hosted (readable code)', host.status === 200 && /^[A-Z2-9]{6}$/.test(code ?? ''), JSON.stringify(host.json));

// 2 · unknown camp refuses honestly
const bad = await j('GET', '/api/gathering/NOCAMP');
ok('unknown camp → 404', bad.status === 404);

// 3 · the event law holds at the door
const lawless = await j('POST', `/api/gathering/${code}/events`, { payload: { anarchic: true } });
ok('DENY: event without actor/action → 400', lawless.status === 400);

// 4 · device A connects; welcome arrives
const seenA = [];
const closeA = await openStream(`${BASE}/api/gathering/${code}/stream?actor=castaway-1&name=Lance`, m => seenA.push(m));
await sleep(400);
ok('A: welcome with empty backlog', seenA.some(m => m.kind === 'welcome' && Array.isArray(m.events)));

// 5 · device B joins; both see presence of 2
const seenB = [];
const closeB = await openStream(`${BASE}/api/gathering/${code}/stream?actor=castaway-2&name=Ashley`, m => seenB.push(m));
await sleep(400);
const lastPresence = arr => [...arr].reverse().find(m => m.kind === 'presence' || m.kind === 'welcome');
ok('B: welcome carries presence of 2', (lastPresence(seenB)?.presence ?? []).length === 2);
ok('A: learns B arrived', seenA.some(m => m.kind === 'presence' && (m.presence ?? []).length === 2));

// 6 · B lights a lantern → A receives the event
const evId = `ev-gate-${Date.now()}`;
const post = await j('POST', `/api/gathering/${code}/events`, { id: evId, actor: 'castaway-2', action: 'lantern_lit', payload: { via: 'gate' }, from: 'dev-b' });
await sleep(400);
ok('B posts a world event (seq assigned)', post.status === 200 && post.json?.seq >= 1);
ok('A receives B\'s event live', seenA.some(m => m.kind === 'event' && m.event?.id === evId && m.event?.action === 'lantern_lit'));

// 7 · dedup: the same event id again is swallowed
const dup = await j('POST', `/api/gathering/${code}/events`, { id: evId, actor: 'castaway-2', action: 'lantern_lit', from: 'dev-b' });
ok('dedup by event id', dup.status === 200 && dup.json?.dedup === true);

// 8 · a latecomer gets the backlog in the welcome
const seenC = [];
const closeC = await openStream(`${BASE}/api/gathering/${code}/stream?actor=castaway-3&name=Kid`, m => seenC.push(m));
await sleep(400);
const welcomeC = seenC.find(m => m.kind === 'welcome');
ok('latecomer welcome carries the session backlog', (welcomeC?.events ?? []).some(e => e.id === evId));

// 9 · leaving updates presence
await closeC();
await sleep(600);
ok('presence updates on leave', [...seenA].reverse().find(m => m.kind === 'presence')?.presence?.length === 2);

await closeA(); await closeB();

// 10 · the camp status endpoint tells the truth
const status = await j('GET', `/api/gathering/${code}`);
ok('camp status honest (events counted)', status.status === 200 && status.json?.events >= 1);

if (failures) { console.log(`\n✗ GATHERING GATE: ${failures} failure(s)\n`); process.exit(1); }
console.log('\n✓ GATHERING GATE: all green — the fire carries between devices.\n');
