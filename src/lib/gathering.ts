// ═════════════════════════════════════════════════════════════════════════════
//  THE GATHERING — the family on the same shore, live (D3D-0 · bible §6 v2).
//
//  The transport the event law was written for: while gathered, every local
//  world event rides to the camp relay, and every family member's event lands
//  here as if it happened here — because on the island, it did. Live events
//  only in v1 (history/week-sync = the companion-sync pattern, R3 hand-work).
//
//  The no-shame law extends to presence: who is here is shown warmly; who is
//  not here is simply not shown. Nothing counts absence.
// ═════════════════════════════════════════════════════════════════════════════
import { WorldEvent, deviceId, mergeRemoteEvent } from './world';
import { activeCastaway } from './castaways';

export interface GatheringState {
  code: string | null;
  connected: boolean;
  hosting: boolean;
  presence: { actor: string; name: string }[];
  conchHolder: string | null;   // castaway id holding the speaker's shell
  error: string | null;
}

const SAVE_KEY = 'driftwood_gathering_v1';

const state: GatheringState = { code: null, connected: false, hosting: false, presence: [], conchHolder: null, error: null };
let es: EventSource | null = null;
let heldLogged = false;         // gathering_held fires once per hosted session
let publishHook: ((e: Event) => void) | null = null;

const emit = () => window.dispatchEvent(new CustomEvent('driftwood:gathering'));

export function gatheringState(): GatheringState { return { ...state }; }

async function post(path: string, body?: unknown) {
  const r = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error ?? `relay ${r.status}`);
  return d;
}

function publishLocal(ev: WorldEvent) {
  if (!state.connected || !state.code) return;
  if (ev.from !== deviceId()) return;      // never re-broadcast a family member's voice
  fetch(`/api/gathering/${state.code}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ev),
  }).catch(() => { /* the relay will catch up or the leave will be honest */ });
}

function handleMessage(msg: any) {
  if (msg.kind === 'welcome') {
    state.connected = true;
    state.error = null;
    // the session so far: merge what the family did before this device arrived
    for (const ev of msg.events ?? []) {
      if (ev.from !== deviceId()) mergeRemoteEvent(ev);
      if (ev.action === 'conch_passed') state.conchHolder = String(ev.payload?.to ?? '') || null;
    }
    state.presence = msg.presence ?? [];
  } else if (msg.kind === 'event') {
    const ev: WorldEvent = msg.event;
    if (ev.from !== deviceId()) mergeRemoteEvent(ev);
    if (ev.action === 'conch_passed') state.conchHolder = String(ev.payload?.to ?? '') || null;
  } else if (msg.kind === 'presence') {
    state.presence = msg.presence ?? [];
    // THE GATHERING IS HELD: two or more distinct castaways on the shore at
    // once — the host logs it, once, and TOGETHER is fed for the whole crew.
    const distinct = new Set(state.presence.map(p => p.actor));
    if (state.hosting && !heldLogged && distinct.size >= 2) {
      heldLogged = true;
      // dynamic import avoids a cycle: world → (event) → gathering → world
      import('./world').then(w => w.appendEvent(activeCastaway().id, 'gathering_held', { present: [...distinct] }));
    }
  }
  emit();
}

function connect(code: string, hosting: boolean) {
  leaveGathering(false);
  const me = activeCastaway();
  const url = `/api/gathering/${code}/stream?actor=${encodeURIComponent(me.id)}&name=${encodeURIComponent(me.name)}`;
  es = new EventSource(url);
  state.code = code;
  state.hosting = hosting;
  heldLogged = false;
  es.onmessage = e => { try { handleMessage(JSON.parse(e.data)); } catch { /* beat */ } };
  es.onerror = () => {
    // EventSource auto-reconnects; we just tell the truth meanwhile
    state.connected = false;
    emit();
  };
  // publish every local world event while gathered
  publishHook = (e: Event) => {
    const ev = (e as CustomEvent).detail as WorldEvent | undefined;
    if (ev) publishLocal(ev);
  };
  window.addEventListener('driftwood:world-event', publishHook);
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ code, hosting })); } catch { /* fine */ }
  emit();
}

export async function hostGathering(): Promise<string> {
  const d = await post('/api/gathering');
  connect(d.code, true);
  return d.code;
}

export async function joinGathering(code: string): Promise<void> {
  const clean = code.trim().toUpperCase();
  if (!clean) throw new Error('a camp code first');
  // verify the camp exists before opening the stream — an honest error beats a silent spinner
  const r = await fetch(`/api/gathering/${clean}`);
  if (!r.ok) throw new Error('no camp answers to that code — check it with the host');
  connect(clean, false);
}

export function leaveGathering(clearSave = true) {
  if (es) { es.close(); es = null; }
  if (publishHook) { window.removeEventListener('driftwood:world-event', publishHook); publishHook = null; }
  state.code = null; state.connected = false; state.hosting = false;
  state.presence = []; state.conchHolder = null; state.error = null;
  if (clearSave) { try { localStorage.removeItem(SAVE_KEY); } catch { /* fine */ } }
  emit();
}

/** Pass the speaker's shell — on mobile co-op THE PHONE IS THE CONCH (bible §4). */
export function passConch(toCastawayId: string) {
  import('./world').then(w => w.appendEvent(activeCastaway().id, 'conch_passed', { to: toCastawayId }));
  state.conchHolder = toCastawayId;
  emit();
}

/** Rejoin a saved gathering after a reload (a dropped phone shouldn't end the circle). */
export function resumeGathering() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (saved?.code) connect(saved.code, !!saved.hosting);
  } catch { /* fresh shore */ }
}
