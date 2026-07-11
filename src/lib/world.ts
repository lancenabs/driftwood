// ═════════════════════════════════════════════════════════════════════════════
//  THE WORLD LEDGER — Driftwood's single source of shore-truth.
//
//  THE EVENT LAW (bible §6, in code from the first tick): every world mutation
//  is an event { actor, action, payload, at } appended to driftwood_events_v1.
//  v2 multi-device co-op becomes a TRANSPORT for this stream, not a rewrite.
//
//  THE HONEST-STATE LAW: the shore renders only what really happened — needs,
//  planks, embers, and lanterns all derive from the event stream and the
//  tools' own save keys. No fake weather, no decay theatrics, no shame:
//  lanterns lit are celebrated; lanterns unlit are simply unlit. And the camp
//  never shrinks — planks are keep-forever (the wake law in wood).
// ═════════════════════════════════════════════════════════════════════════════

export interface WorldEvent {
  actor: string;              // castaway id ('castaway-1'…'castaway-7')
  action: string;             // 'tool_work' | 'milestone_closed' | 'lantern_lit' | 'gathering_held' | 'swap_debriefed' | …
  payload?: Record<string, unknown>;
  at: string;                 // ISO
}

const EVENTS_KEY = 'driftwood_events_v1';
const EVENT_CAP = 2000;       // plenty of history, bounded on-device

export function appendEvent(actor: string, action: string, payload?: Record<string, unknown>) {
  try {
    const log: WorldEvent[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    log.push({ actor, action, payload, at: new Date().toISOString() });
    localStorage.setItem(EVENTS_KEY, JSON.stringify(log.slice(-EVENT_CAP)));
    window.dispatchEvent(new CustomEvent('driftwood:world-event'));
  } catch { /* the shore forgives a full disk */ }
}

export function readEvents(): WorldEvent[] {
  try {
    const log = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    return Array.isArray(log) ? log : [];
  } catch { return []; }
}

// ── Planks & embers (the wage) ───────────────────────────────────────────────
// Planks: earned by closed milestones and real week-work; they stack at the
// camp and never un-earn. Embers: the small currency — feed the fire, light
// lanterns. Derived from events so they can never drift from the truth.
export function planksEarned(): number {
  return readEvents().filter(e => e.action === 'milestone_closed' || e.action === 'plank_earned').length;
}
export function embersHeld(): number {
  const earned = readEvents().filter(e => e.action === 'ember_earned').length;
  const spent = readEvents().filter(e => e.action === 'ember_spent').length;
  return Math.max(0, earned - spent);
}

// ── The five needs (derived, honest) ─────────────────────────────────────────
// Each need reads the RECENCY of its real work. Fresh (≤2 days) = full;
// stale fades gently; nothing punishes — a low meter is an invitation, not a
// verdict. TOGETHER can only be fed by conjoint acts (bible: the fifth need
// refills only conjointly).
export interface NeedReading {
  id: 'warmth' | 'water' | 'food' | 'shelter' | 'together';
  label: string;
  emoji: string;
  level: number;              // 0..1
  fedBy: string;              // the honest sentence: what refills this
}

const DAY = 86400000;

function recencyLevel(dates: number[], halfLifeDays: number): number {
  if (!dates.length) return 0.15;                     // dawn state — never zero, never full
  const newest = Math.max(...dates);
  const ageDays = (Date.now() - newest) / DAY;
  return Math.max(0.1, Math.min(1, Math.exp(-ageDays / halfLifeDays)));
}

function keyDates(keys: string[]): number[] {
  const out: number[] = [];
  for (const k of keys) {
    try {
      const raw = JSON.parse(localStorage.getItem(k) || 'null');
      const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
      for (const item of arr) {
        const t = Date.parse(item?.at ?? item?.timestamp ?? item?.date ?? '');
        if (!Number.isNaN(t)) out.push(t);
      }
    } catch { /* unreadable = unfed */ }
  }
  return out;
}

function eventDates(actions: string[]): number[] {
  return readEvents()
    .filter(e => actions.includes(e.action))
    .map(e => Date.parse(e.at))
    .filter(t => !Number.isNaN(t));
}

export function readNeeds(): NeedReading[] {
  return [
    {
      id: 'warmth', label: 'Warmth', emoji: '🔥',
      level: recencyLevel([...eventDates(['fire_tended', 'ember_earned']), ...keyDates(['driftwood_habits_v1'])], 3),
      fedBy: 'tending the fire — daily rigging kept, embers earned',
    },
    {
      id: 'water', label: 'Water', emoji: '💧',
      level: recencyLevel(keyDates(['driftwood_barometer_v1']), 4),
      fedBy: 'honest readings — the barometer taken when the glass moves',
    },
    {
      id: 'food', label: 'Food', emoji: '🍲',
      level: recencyLevel(keyDates(['driftwood_weekly_goals_v1', 'driftwood_milestones_v1']), 5),
      fedBy: 'the manifest worked — real chores and goals done',
    },
    {
      id: 'shelter', label: 'Shelter', emoji: '⛺',
      level: recencyLevel([...keyDates(['driftwood_undertow_v1', 'driftwood_mending_v1']), ...eventDates(['milestone_closed'])], 7),
      fedBy: 'the structure kept — cycles charted, repairs logged, milestones closed',
    },
    {
      id: 'together', label: 'TOGETHER', emoji: '🫂',
      // The soul-meter: ONLY conjoint acts feed it.
      level: recencyLevel([...eventDates(['gathering_held', 'swap_debriefed', 'milestone_closed']), ...keyDates(['driftwood_gratitude_notes', 'driftwood_calendar_events_v1'])], 4),
      fedBy: 'only together — gatherings held, bottles posted, milestones closed as a crew',
    },
  ];
}

// ── The lantern dock ─────────────────────────────────────────────────────────
// One lantern per castaway; lit when that castaway logged real work in the
// last 7 days. Unlit lanterns get no copy, no color of blame — simply unlit.
export function lanternLit(castawayId: string): boolean {
  const cutoff = Date.now() - 7 * DAY;
  return readEvents().some(e =>
    e.actor === castawayId &&
    ['tool_work', 'lantern_lit', 'milestone_closed', 'gathering_held'].includes(e.action) &&
    Date.parse(e.at) > cutoff);
}
