// ─────────────────────────────────────────────────────────────────────────────
//  Companion link — Driftwood's side of the bridge to the Clinical Companion.
//
//  Bridge client #3. Ported from Rehabit's companionLink.ts, which was ported
//  from lance-app's therapistLink.ts — the same treaty, proven twice:
//  pair → token → sync + receipts → directives → cloud save, fail-silent.
//
//  BUT DRIFTWOOD SYNCS A RELATIONSHIP, AND NO APP IN THIS FLEET EVER HAS.
//  The island app and the voyage sync one person. A couple is not one person,
//  and it is not two unrelated people either. Three rules follow, and all three
//  are Lance's decisions (2026-07-14), not conveniences:
//
//   1 · TWO CODES, NOT ONE. Each partner pairs their own device with their own
//       code and their own consent, and the Companion links them with partnerOf.
//       Either can unpair ALONE and the other's island survives. Consent-first,
//       the same spine as the Perspective Swap. A couple is two people who chose
//       this; it is never one account somebody else holds the keys to.
//
//   2 · THE CHAT NEVER CROSSES. Not redacted, not summarised, not opt-in —
//       NEVER SENT. The therapist learns THAT they met at the waterfall, when,
//       and for how long. Not one word of what was said. A couple must be able
//       to be honest somewhere their therapist cannot see; that is not a gap in
//       the product, it IS the product. See CHAT_KEYS below — that denylist is
//       load-bearing and qa-bridge asserts it.
//
//   3 · NO SCOREKEEPING BETWEEN PARTNERS. The payload distinguishes joint acts
//       from solo ones because that difference is clinically the whole point —
//       but the app never renders the comparison to the couple. The Undertow
//       wins the moment this becomes a leaderboard. The therapist sees it. They
//       don't.
//
//  HARD RULE (enforced here, not on the server): crisis surfaces are NEVER
//  remote-controllable. lock_app/config directives cannot touch CRISIS_TOOLS.
//  Crisis law §0.0 (2026-07-12): crisis info lives ONLY in Settings → Safety &
//  Crisis, therapist-configured. This file never carries a hotline.
//
//  All calls fail silent-and-quiet: the app never blocks on the network.
// ─────────────────────────────────────────────────────────────────────────────
import { readEvents } from './world';

// DELIBERATE: identical keys to the vendored library's therapistLink. The
// vendored LibraryTab reads therapist locks through these — by sharing them,
// lock/unlock directives govern the library here with zero extra wiring.
const LINK_KEY = 'lance_therapist_link_v1';
const STATE_KEY = 'lance_therapist_directives_v1';
const LAST_SYNC_KEY = 'lance_therapist_last_sync_v1';

// Where the companion lives. Same resolution as the island and the voyage:
//   1. VITE_COMPANION_ENDPOINT (build-time override), else
//   2. SAME HOST this app is served from, on the companion's port 3000.
//      (Tailnet-friendly: phone loads Driftwood at http://<mini>:3300, the
//      companion answers at :3000 — no per-device config.)
const COMPANION_PORT = 3000;
const ENV_ENDPOINT = ((import.meta as any).env?.VITE_COMPANION_ENDPOINT as string | undefined)?.replace(/\/$/, '');
function resolveEndpoint(): string {
  if (ENV_ENDPOINT) return ENV_ENDPOINT;
  if (typeof location === 'undefined') return `http://localhost:${COMPANION_PORT}`;
  return `${location.protocol}//${location.hostname}:${COMPANION_PORT}`;
}
export const DEFAULT_ENDPOINT = resolveEndpoint();

// Crisis surfaces a therapist can never lock, hide, or de-gamify remotely.
// Same set as the island and the voyage — the ids exist in the vendored
// library here too. This travels to every world; it is not negotiable.
const CRISIS_TOOLS = new Set([
  'crisis_safety_plan', 'tipp_skills', 'grounding_54321', 'recovery_space',
]);

// ── THE BRIGHT LINE ──────────────────────────────────────────────────────────
// What two people say to each other on that island is theirs. These keys never
// enter a payload, never enter a backup, never leave the device. If you are
// adding a key that holds words a couple said to each other, ADD IT HERE FIRST.
const CHAT_KEYS = new Set([
  'driftwood_jumble_chat_v1',   // the island's chat — the waterfall conversation
  'driftwood_gathering_v1',     // live gathering transport (carries chat frames)
  'driftwood_session_history',  // local conversation history
  'driftwood_feedback_comments',// free-text he never asked for and won't get
]);

export interface TherapistLink {
  endpoint: string;
  clientId: string;
  token: string;
  practiceName?: string;
  pairedAt: string;
}

export interface TherapistDirective {
  id: string;
  seq: number;
  type: 'push_app' | 'lock_app' | 'unlock_app' | 'suggest_work' | 'daily_plan'
      | 'message' | 'confirm_session' | 'config';
  payload: Record<string, any>;
  issuedAt: string;
}

interface DirectiveState {
  appliedSeq: number;
  directives: TherapistDirective[];
  receipts: Record<string, { status: string; at: string; detail?: string }>;
  baselines: Record<string, string>;
}

// ── link ─────────────────────────────────────────────────────────────────────
export function getLink(): TherapistLink | null {
  try { return JSON.parse(localStorage.getItem(LINK_KEY) || 'null'); } catch { return null; }
}

/** Unpair THIS device only. Rule 1: either partner can leave alone, and the
 *  other's island is untouched — their pairing lives on their own phone. */
export function disconnect() {
  localStorage.removeItem(LINK_KEY);
  localStorage.removeItem(STATE_KEY);
  localStorage.removeItem(LAST_SYNC_KEY);
}

export function getLastSync(): string | null {
  return localStorage.getItem(LAST_SYNC_KEY);
}

export async function pairWithCode(code: string, endpoint = DEFAULT_ENDPOINT): Promise<TherapistLink> {
  const res = await fetch(`${endpoint}/api/pair`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error === 'invalid or expired code'
      ? "That code isn't valid — ask your therapist for a fresh one."
      : "Couldn't reach your therapist's app. Try again in a moment.");
  }
  const { clientId, token, practiceName } = await res.json();
  const link: TherapistLink = { endpoint, clientId, token, practiceName, pairedAt: new Date().toISOString() };
  localStorage.setItem(LINK_KEY, JSON.stringify(link));
  return link;
}

// ── directive state ──────────────────────────────────────────────────────────
export function getDirectiveState(): DirectiveState {
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY) || 'null');
    if (s && typeof s.appliedSeq === 'number') return s;
  } catch { /* fall through */ }
  return { appliedSeq: 0, directives: [], receipts: {}, baselines: {} };
}

function saveDirectiveState(s: DirectiveState) {
  localStorage.setItem(STATE_KEY, JSON.stringify(s));
}

function recordReceipt(state: DirectiveState, directiveId: string, status: string, detail?: string) {
  const rank: Record<string, number> = { received: 1, opened: 2, completed: 3, confirmed: 3, declined: 3 };
  const cur = state.receipts[directiveId];
  if (cur && (rank[cur.status] ?? 0) >= (rank[status] ?? 0)) return;
  state.receipts[directiveId] = { status, at: new Date().toISOString(), detail };
}

// ── derived views the app reads ──────────────────────────────────────────────
export function getTherapistAssignments(): TherapistDirective[] {
  const s = getDirectiveState();
  return s.directives.filter(d =>
    (d.type === 'push_app' || d.type === 'suggest_work' || d.type === 'daily_plan')
    && s.receipts[d.id]?.status !== 'completed');
}

export function getTherapistMessages(): TherapistDirective[] {
  const s = getDirectiveState();
  return s.directives.filter(d => d.type === 'message' && s.receipts[d.id]?.status !== 'opened');
}

export function getPendingConfirms(): TherapistDirective[] {
  const s = getDirectiveState();
  return s.directives.filter(d => d.type === 'confirm_session'
    && !['confirmed', 'declined'].includes(s.receipts[d.id]?.status ?? ''));
}

/** Tools force-locked by the therapist (crisis tools filtered defensively). */
export function getLockedTools(): Set<string> {
  const s = getDirectiveState();
  const locked = new Set<string>();
  for (const d of s.directives) {
    if (d.type === 'lock_app') (d.payload.toolIds ?? [d.payload.toolId]).forEach((t: string) => t && locked.add(t));
    if (d.type === 'unlock_app') (d.payload.toolIds ?? [d.payload.toolId]).forEach((t: string) => t && locked.delete(t));
  }
  CRISIS_TOOLS.forEach(t => locked.delete(t));
  return locked;
}

export function getTherapistConfig(): { gamificationIntensity?: 'full' | 'quiet'; showStreaks?: boolean } {
  const s = getDirectiveState();
  let cfg: any = {};
  for (const d of s.directives) if (d.type === 'config') cfg = { ...cfg, ...d.payload };
  return cfg;
}

// ── user actions that produce receipts ───────────────────────────────────────
export function markDirectiveOpened(directiveId: string) {
  const s = getDirectiveState();
  recordReceipt(s, directiveId, 'opened');
  saveDirectiveState(s);
}

export function respondToConfirm(directiveId: string, answer: 'confirmed' | 'declined') {
  const s = getDirectiveState();
  recordReceipt(s, directiveId, answer);
  saveDirectiveState(s);
  void syncNow();
}

// ── THE DEFERRAL SIGNAL ──────────────────────────────────────────────────────
// Lance's scene: "did they work on the homework, or did they put it off?"
//
// Not a metric — a clinical instrument. It is the tell every therapist knows:
// the couple who did the homework in the car on the way to session. He walks in
// already holding it, they laugh about it, and then the real thing comes out.
//
// LAW: therapist's eyes only. Never scored, never surfaced to the couple, never
// coloured red, never a streak. Shame is a relapse engine in every world.
export interface DeferralRecord {
  directiveId: string;
  what: string;
  assignedAt: string;
  openedAt?: string;
  completedAt?: string;
  /** hours between the therapist assigning it and the couple opening it */
  hoursToOpen?: number;
  /** true when both castaways were present on the island as it completed */
  together?: boolean;
  /** which device arrived at the place first — never shown to either of them */
  firstToArrive?: string;
}

/** Was a family member other than this one present around `at`?
 *
 *  Read from the world log, which already stamps every act with `actor` (the
 *  castaway id — castaway-1…7) and `from` (the device that spoke). Two distinct
 *  ACTORS inside the window means two people were on the island together.
 *
 *  CAREFUL: actor and from are different namespaces. Comparing an actor id
 *  against deviceId() is always unequal, which would report "together" for solo
 *  work and quietly hand Lance a false clinical signal. Count distinct actors —
 *  and corroborate with distinct devices, since one phone passed between two
 *  people (the conch) is genuinely together, and two tabs on one device is not.
 */
function wasTogetherAround(at: string, windowMin = 20): { together: boolean; firstToArrive?: string } {
  try {
    const t = new Date(at).getTime();
    const near = readEvents()
      .filter(e => {
        const et = new Date(e.at ?? 0).getTime();
        return Number.isFinite(et) && Math.abs(et - t) <= windowMin * 60_000;
      })
      .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

    const actors = new Set(near.map(e => e.actor).filter(Boolean));
    const devices = new Set(near.map(e => e.from).filter(Boolean));
    // Two castaways acted, or two devices spoke. Either is together; one actor
    // on one device is one person, however many events they produced.
    const together = actors.size > 1 || devices.size > 1;
    const firstToArrive = near.length ? near[0].actor || undefined : undefined;
    return { together, firstToArrive };
  } catch { return { together: false }; }
}

/**
 * THE MISSING HALF OF THE DEFERRAL SIGNAL.
 *
 * buildDeferralRecords reads receipts, but nothing here ever recorded a
 * 'completed' receipt when a milestone closed — the vendored LANCE library has
 * detectCompletions(); Driftwood's bridge never got it. So the therapist saw
 * "assigned" and, if wired, "opened," but never "completed together" — which is
 * the entire tell Lance's scene turns on: *did they do the homework, or did they
 * put it off, and did they do it as a couple?*
 *
 * An assigned milestone is DONE the instant it's in driftwood_milestone_log_v1's
 * closed list. That's the honest completion signal (the milestone log only grows
 * when a real instrument's store grew — boxes are never self-checked). Stamped at
 * reconcile time, which syncNow runs right after a close, so wasTogetherAround's
 * ±20-min window still sees both castaways who just finished together.
 *
 * `payload.milestoneId` is the same field buildDeferralRecords already keys on —
 * no new contract with the Companion, just the completion it was always missing.
 * (Tool assignments complete through the app's own tool_work events; this closes
 * the milestone half, which is what "challenge 10" actually is.)
 */
function detectMilestoneCompletions(s: DirectiveState): boolean {
  const closed = new Set(readClosed());
  let changed = false;
  for (const d of s.directives) {
    if (d.type !== 'push_app' && d.type !== 'suggest_work') continue;
    if (s.receipts[d.id]?.status === 'completed') continue;
    const ms = (d.payload as any)?.milestoneId as string | undefined;
    if (ms && closed.has(ms)) { recordReceipt(s, d.id, 'completed', `${ms} closed`); changed = true; }
  }
  return changed;
}

export function buildDeferralRecords(): DeferralRecord[] {
  const s = getDirectiveState();
  const out: DeferralRecord[] = [];
  for (const d of s.directives) {
    if (d.type !== 'push_app' && d.type !== 'suggest_work') continue;
    const r = s.receipts[d.id];
    if (!r) continue;
    const opened = r.status === 'opened' || r.status === 'completed' ? r.at : undefined;
    const completed = r.status === 'completed' ? r.at : undefined;
    const rec: DeferralRecord = {
      directiveId: d.id,
      what: String(d.payload.toolId ?? d.payload.milestoneId ?? d.payload.text ?? 'assignment'),
      assignedAt: d.issuedAt,
      openedAt: opened,
      completedAt: completed,
    };
    if (opened) {
      rec.hoursToOpen = Math.max(0,
        (new Date(opened).getTime() - new Date(d.issuedAt).getTime()) / 3_600_000);
    }
    if (completed) {
      const { together, firstToArrive } = wasTogetherAround(completed);
      rec.together = together;
      rec.firstToArrive = firstToArrive;
    }
    out.push(rec);
  }
  return out;
}

// ── the sync loop ────────────────────────────────────────────────────────────
async function pullDirectives(link: TherapistLink): Promise<void> {
  const state = getDirectiveState();
  const res = await fetch(
    `${link.endpoint}/api/companion-sync/${link.clientId}/directives?since=${state.appliedSeq}`,
    { headers: { Authorization: `Bearer ${link.token}` } },
  );
  if (!res.ok) return;
  const { directives } = await res.json();
  if (!Array.isArray(directives) || directives.length === 0) return;
  for (const d of directives as TherapistDirective[]) {
    if (d.seq <= state.appliedSeq) continue; // idempotent
    state.directives.push(d);
    state.appliedSeq = d.seq;
    recordReceipt(state, d.id, 'received');
  }
  saveDirectiveState(state);
  try { window.dispatchEvent(new CustomEvent('driftwood:directives-updated')); } catch { /* SSR */ }
}

// ── the export payload: what the therapist's cockpit receives ────────────────
const readLog = (k: string): any[] => {
  try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; }
};

/**
 * THE MILESTONE LOG IS THE ONE STORE THAT IS NOT AN ARRAY. Use this, never readLog.
 *
 * MilestoneLog.tsx writes `{ closed: string[], investigating }` — an object.
 * readLog() assumes an array, so `readLog('driftwood_milestone_log_v1').slice(0, 50)`
 * threw a TypeError the moment a family closed their FIRST milestone — and
 * syncNow() fails silent by design ("never block the island"). Net effect: the
 * therapist received NOTHING, silently, from exactly the point the data began to
 * matter. The 31 are the most clinically valuable thing this app produces and
 * none of it crossed. `planksEarned` was `undefined` for the same reason.
 *
 * It worked perfectly in every fresh browser — the absent key falls back to '[]'
 * and behaves. It only broke once it counted, which is why it survived.
 *
 * qa-bridge now builds the payload against a POPULATED log. A gate that only
 * ever sees an empty store only ever tests the happy hour.
 */
const readClosed = (): string[] => {
  try {
    const s = JSON.parse(localStorage.getItem('driftwood_milestone_log_v1') || 'null');
    if (Array.isArray(s?.closed)) return s.closed;   // the real shape
    if (Array.isArray(s)) return s;                  // tolerate a bare array
    return [];
  } catch { return []; }
};

/** Guard: nothing from CHAT_KEYS may ever appear in a payload. Called on the
 *  way out; qa-bridge asserts it independently. Belt and braces on purpose —
 *  this is the one promise in this file that cannot be broken by accident. */
function assertNoChat(payload: Record<string, unknown>) {
  const s = JSON.stringify(payload);
  for (const k of CHAT_KEYS) {
    if (s.includes(k)) throw new Error(`BRIGHT LINE: ${k} must never cross the bridge`);
  }
}

export async function buildExportPayload(): Promise<Record<string, unknown>> {
  const events = readEvents();
  const deferrals = buildDeferralRecords();

  const payload = {
    appName: 'Driftwood — the family shore',
    world: 'shore',
    exportTimestamp: new Date().toISOString(),

    // Rule 1 · the dyad. This device is one partner. The Companion links the
    // two clients with partnerOf; we tell it who WE are, never who they are.
    castaway: (() => {
      try { return JSON.parse(localStorage.getItem('driftwood_active_castaway_v1') || 'null'); }
      catch { return null; }
    })(),
    familyUnitName: localStorage.getItem('driftwood_family_unit_name_v1') ?? undefined,

    statistics: {
      milestonesComplete: readLog('driftwood_milestones_v1').length,
      gamesPlayed: events.filter(e => String((e as any).action ?? '').endsWith('_played')).length,
      // Warmth is the fire's height — the family's, never a per-person score.
      togetherActs: events.filter(e => String((e as any).action ?? '').includes('together')).length,
      planksEarned: readClosed().length,
    },

    // Rule 3 · joint vs solo is recorded because it's the clinical signal.
    // It is NEVER rendered as a comparison inside the app.
    deferrals,

    driftwood: {
      milestoneLog: readClosed().slice(0, 50),
      repairRope: readLog('driftwood_repair_rope_v1').slice(0, 30),
      choreSwaps: readLog('driftwood_chore_swap_v1').slice(0, 30),
      rituals: readLog('driftwood_rituals_v1').slice(0, 20),
      weeklyGoals: readLog('driftwood_weekly_goals_v1').slice(0, 20),
      undertow: readLog('driftwood_undertow_v1').slice(0, 10),
      // NOTE: driftwood_jumble_chat_v1 is DELIBERATELY ABSENT and always will be.
    },
  };

  assertNoChat(payload);
  return payload;
}

// ── sync ─────────────────────────────────────────────────────────────────────
export async function syncNow(): Promise<boolean> {
  const link = getLink();
  if (!link) return false;
  try {
    await pullDirectives(link);
    const state = getDirectiveState();
    // reconcile milestone assignments against the closed log BEFORE the payload
    // is built, so a milestone finished since the last sync crosses as completed
    if (detectMilestoneCompletions(state)) saveDirectiveState(state);
    const payload = await buildExportPayload();
    const res = await fetch(`${link.endpoint}/api/companion-sync/${link.clientId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${link.token}` },
      body: JSON.stringify({ payload, receipts: state.receipts }),
    });
    if (!res.ok) return false;
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    return true;
  } catch {
    return false; // fail silent — the island never blocks on the network
  }
}
