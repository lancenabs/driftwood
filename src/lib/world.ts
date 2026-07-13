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
  id?: string;                // dedup key for the Gathering transport (v2 law)
  from?: string;              // which device spoke (this device's id, or a remote one)
}

const EVENTS_KEY = 'driftwood_events_v1';
const EVENT_CAP = 2000;       // plenty of history, bounded on-device
const DEVICE_KEY = 'driftwood_device_v1';

/** This device's stable id — how the Gathering tells its own voice from the family's. */
export function deviceId(): string {
  try {
    let d = localStorage.getItem(DEVICE_KEY);
    if (!d) { d = `dev-${Math.random().toString(36).slice(2, 10)}`; localStorage.setItem(DEVICE_KEY, d); }
    return d;
  } catch { return 'dev-volatile'; }
}

export function appendEvent(actor: string, action: string, payload?: Record<string, unknown>) {
  try {
    const ev: WorldEvent = {
      actor, action, payload, at: new Date().toISOString(),
      id: `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      from: deviceId(),
    };
    const log: WorldEvent[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    log.push(ev);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(log.slice(-EVENT_CAP)));
    window.dispatchEvent(new CustomEvent('driftwood:world-event', { detail: ev }));
  } catch { /* the shore forgives a full disk */ }
}

/** The Gathering's inbound door: merge a family member's event into this
 *  device's log (dedup by id) — the shore re-renders exactly as if the work
 *  had happened here, because on the island it did. Never re-broadcast. */
export function mergeRemoteEvent(ev: WorldEvent): boolean {
  try {
    if (!ev?.actor || !ev?.action) return false;
    const log: WorldEvent[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    if (ev.id && log.some(e => e.id === ev.id)) return false;
    log.push({ ...ev, at: ev.at ?? new Date().toISOString() });
    localStorage.setItem(EVENTS_KEY, JSON.stringify(log.slice(-EVENT_CAP)));
    window.dispatchEvent(new CustomEvent('driftwood:world-event', { detail: ev }));
    return true;
  } catch { return false; }
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

// ── Matches & rations (the survival wage of the task list) ──────────────────
// Every checked task in a milestone's work checklist strikes a MATCH or lands
// a RATION (Lance's 2026-07-12 order: "these tasks give matches, or food, so
// they must be on the island where they are shipwrecked"). Derived from
// events, same as everything: they can never drift from the truth, and they
// feed the Warmth and Food needs for real.
export function matchesHeld(): number {
  return readEvents().filter(e => e.action === 'match_earned').length;
}
export function rationsHeld(): number {
  return readEvents().filter(e => e.action === 'food_earned').length;
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
      level: recencyLevel([...eventDates(['fire_tended', 'ember_earned', 'match_earned']), ...keyDates(['driftwood_habits_v1'])], 3),
      fedBy: 'tending the fire — daily rigging kept, embers earned, matches struck',
    },
    {
      id: 'water', label: 'Water', emoji: '💧',
      level: recencyLevel(keyDates(['driftwood_barometer_v1']), 4),
      fedBy: 'honest readings — the barometer taken when the glass moves',
    },
    {
      id: 'food', label: 'Food', emoji: '🍲',
      level: recencyLevel([...eventDates(['food_earned']), ...keyDates(['driftwood_weekly_goals_v1', 'driftwood_milestones_v1'])], 5),
      fedBy: 'the manifest worked — real chores done, rations earned on the trail',
    },
    {
      id: 'shelter', label: 'Shelter', emoji: '⛺',
      level: recencyLevel([...keyDates(['driftwood_undertow_v1', 'driftwood_mending_v1']), ...eventDates(['milestone_closed'])], 7),
      fedBy: 'the structure kept — cycles charted, repairs logged, milestones closed',
    },
    {
      id: 'together', label: 'TOGETHER', emoji: '🫂',
      // The soul-meter: ONLY conjoint acts feed it. rally_met is the purest
      // one — two people physically walked their avatars to the same named
      // place ("our rock") from different devices.
      level: recencyLevel([...eventDates(['gathering_held', 'swap_debriefed', 'milestone_closed', 'fire_quiz_played', 'rally_met']), ...keyDates(['driftwood_gratitude_notes', 'driftwood_calendar_events_v1'])], 4),
      fedBy: 'only together — gatherings held, rallies answered at the rock, milestones closed as a crew',
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
