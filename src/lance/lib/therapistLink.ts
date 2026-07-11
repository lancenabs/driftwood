// ─────────────────────────────────────────────────────────────────────────────
//  Therapist link — the client side of the bridge to Clinical Companion.
//
//  Pairing: user enters a 6-char code from their therapist once → we store
//  {endpoint, clientId, token} locally. Disconnecting deletes the link.
//
//  Sync UP:   POST the real export payload + directive receipts (throttled 1/hr,
//             or forced from Settings/Insights).
//  Sync DOWN: pull the append-only directive log; apply idempotently by seq.
//
//  HARD RULE (enforced here, not on the server): crisis surfaces are NEVER
//  remote-controllable. lock_app/config directives cannot touch CRISIS_TOOLS.
//
//  All calls fail silent-and-quiet: the app never blocks on the network.
// ─────────────────────────────────────────────────────────────────────────────
import { TOOL_COMPLETION, readSaveSignature } from '../components/LANCEGame/challengeCompletion';

const LINK_KEY = 'lance_therapist_link_v1';
const STATE_KEY = 'lance_therapist_directives_v1';
const LAST_SYNC_KEY = 'lance_therapist_last_sync_v1';

// Where the companion (therapist app) lives. Resolution order:
//   1. VITE_COMPANION_ENDPOINT (build-time env override), else
//   2. SAME HOST as the client is served from, on the companion's port 3000.
//      This is what makes the trial work over the tailnet: when the phone loads
//      the client at http://<mini>:3001, the companion is http://<mini>:3000 —
//      no per-device config. On localhost dev this resolves to localhost:3000.
// The chosen endpoint is persisted into the link at pair time (see pairWithCode).
const COMPANION_PORT = 3000;
const ENV_ENDPOINT = ((import.meta as any).env?.VITE_COMPANION_ENDPOINT as string | undefined)?.replace(/\/$/, '');
function resolveEndpoint(): string {
  if (ENV_ENDPOINT) return ENV_ENDPOINT;
  if (typeof location === 'undefined') return `http://localhost:${COMPANION_PORT}`;
  // Companion runs on the same host that served this client, port 3000.
  return `${location.protocol}//${location.hostname}:${COMPANION_PORT}`;
}
const DEFAULT_ENDPOINT = resolveEndpoint();

// Crisis surfaces a therapist can never lock, hide, or de-gamify remotely.
const CRISIS_TOOLS = new Set([
  'crisis_safety_plan', 'tipp_skills', 'grounding_54321', 'recovery_space',
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
  directives: TherapistDirective[];               // full applied log (small)
  receipts: Record<string, { status: string; at: string; detail?: string }>;
  // push_app completion baselines: signature snapshot at apply time
  baselines: Record<string, string>;              // directiveId → signature
}

// ── link ─────────────────────────────────────────────────────────────────────
export function getLink(): TherapistLink | null {
  try { return JSON.parse(localStorage.getItem(LINK_KEY) || 'null'); } catch { return null; }
}

export function disconnect() {
  localStorage.removeItem(LINK_KEY);
  localStorage.removeItem(STATE_KEY);
  localStorage.removeItem(LAST_SYNC_KEY);
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
      ? 'That code isn\'t valid — ask your therapist for a fresh one.'
      : 'Couldn\'t reach your therapist\'s app. Try again in a moment.');
  }
  const { clientId, token, practiceName } = await res.json();
  const link: TherapistLink = { endpoint, clientId, token, practiceName, pairedAt: new Date().toISOString() };
  localStorage.setItem(LINK_KEY, JSON.stringify(link));

  // Reconcile with the cloud save the instant the bridge forms:
  //  • device WITH progress → it's the source of truth: seed/refresh the cloud
  //    save, never overwrite it;
  //  • device WITHOUT progress (fresh install / cleared cache) → pull the cloud
  //    save down and reload; if there's no backup yet, seed it as the primary.
  // Backup hiccups must never fail the pairing itself.
  try {
    if (localHasProgress()) {
      void backupState(link);
    } else {
      const restored = await restoreStateFromServer(link);
      if (restored && typeof location !== 'undefined') { location.reload(); return link; }
      if (!restored) void backupState(link);
    }
  } catch { /* pairing succeeds regardless of backup state */ }
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
  for (const d of s.directives) { // chronological: later directives win
    if (d.type === 'lock_app') (d.payload.toolIds ?? [d.payload.toolId]).forEach((t: string) => t && locked.add(t));
    if (d.type === 'unlock_app') (d.payload.toolIds ?? [d.payload.toolId]).forEach((t: string) => t && locked.delete(t));
  }
  CRISIS_TOOLS.forEach(t => locked.delete(t));
  return locked;
}

/** Tools force-unlocked past tier gating by the therapist. */
export function getUnlockedTools(): Set<string> {
  const s = getDirectiveState();
  const unlocked = new Set<string>();
  for (const d of s.directives) {
    if (d.type === 'unlock_app') {
      if (d.payload.toolIds === 'all') unlocked.add('*');
      else (d.payload.toolIds ?? [d.payload.toolId]).forEach((t: string) => t && unlocked.add(t));
    }
  }
  return unlocked;
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
  void syncNow(); // confirmations matter — push immediately
}

// ── the sync loop ────────────────────────────────────────────────────────────
function detectCompletions(state: DirectiveState) {
  // A pushed tool counts as DONE when its save-signature changes vs. the
  // baseline captured at apply time — the same machinery challenges use.
  for (const d of state.directives) {
    if (d.type !== 'push_app') continue;
    if (state.receipts[d.id]?.status === 'completed') continue;
    const signal = TOOL_COMPLETION[d.payload.toolId as string];
    if (!signal || signal.kind !== 'save') continue;
    const sig = readSaveSignature(signal.keys);
    const base = state.baselines[d.id];
    if (base !== undefined && sig !== base) {
      recordReceipt(state, d.id, 'completed', `${d.payload.toolId} saved`);
    }
  }
}

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
    // capture a completion baseline for pushed tools
    if (d.type === 'push_app') {
      const signal = TOOL_COMPLETION[d.payload.toolId as string];
      if (signal?.kind === 'save') state.baselines[d.id] = readSaveSignature(signal.keys);
    }
  }
  saveDirectiveState(state);
}

/** Build the export payload — same shape LANCEInsights downloads. */
function buildExportPayload(): Record<string, unknown> {
  const read = (k: string) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
  const game = read('lance_game_state_v1') ?? {};
  return {
    appName: 'L.A.N.C.E. Wellness Hub',
    exportTimestamp: new Date().toISOString(),
    clientName: game.userName,
    statistics: { streak: game.streak, xp: game.xp, completedChallenges: (game.completedChallenges ?? []).length },
    moodLogs: game.moodLogs ?? [],
    goals: game.goals ?? [],
    completedChallenges: game.completedChallenges ?? [],
    sleepLogs: read('lance_sleep_v1') ?? [],
    activityLogs: read('lance_activity_v1') ?? [],
    gratitudeEntries: read('lance_gratitude_log') ?? [],
    cbtRecords: read('therapy_cbt_thought_records') ?? [],
    // Island practice: breath rounds, worries parked, lanterns lit, journals
    // heard, in-world challenges — the therapist honors headset work too.
    vrPractice: read('lance_vr_practice_v1') ?? [],
  };
}

// ── Cloud save: full local-state backup & restore ────────────────────────────
// Local-first is the working model (fast, offline-capable); this makes the local
// store durable. The full localStorage snapshot is backed up to the companion on
// every sync and restored after re-pairing on a fresh device / cleared cache — so
// a person never loses their clinical history to an evicted cache. This is the
// client's own save (distinct from the curated therapist-facing export).
// Device-local / transient keys that should not travel between devices.
const BACKUP_DENYLIST = new Set(['lance_dev_bar', LINK_KEY]);

// The app writes a DEFAULT game state on every load, so mere presence can't tell
// a fresh device from an established one — but real progress (a name, streak, XP,
// completed challenges, mood logs) can. A state WITH progress is meaningful data;
// a state WITHOUT is a blank default.
function stateHasProgress(g: any): boolean {
  if (!g || typeof g !== 'object') return false;
  return !!g.userName
    || (g.xp ?? 0) > 0
    || (g.streak ?? 0) > 0
    || (g.completedChallenges?.length ?? 0) > 0
    || (g.moodLogs?.length ?? 0) > 0;
}
function localHasProgress(): boolean {
  try { return stateHasProgress(JSON.parse(localStorage.getItem('lance_game_state_v1') || 'null')); }
  catch { return false; }
}
function snapshotHasProgress(snapshot: Record<string, string>): boolean {
  try { return stateHasProgress(JSON.parse(snapshot['lance_game_state_v1'] || 'null')); }
  catch { return false; }
}

function snapshotLocalStorage(): Record<string, string> {
  const snap: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || BACKUP_DENYLIST.has(k)) continue;
    const v = localStorage.getItem(k);
    if (v != null) snap[k] = v;
  }
  return snap;
}

async function backupState(link: TherapistLink): Promise<void> {
  await fetch(`${link.endpoint}/api/client-backup/${link.clientId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${link.token}` },
    body: JSON.stringify({ snapshot: snapshotLocalStorage(), clientVersion: Date.now() }),
  });
}

/** Pull the cloud save into localStorage. Returns true if data was written
 *  (caller reloads to hydrate it). Gated by the caller, not by local state. */
async function restoreStateFromServer(link: TherapistLink): Promise<boolean> {
  const res = await fetch(`${link.endpoint}/api/client-backup/${link.clientId}`, {
    headers: { Authorization: `Bearer ${link.token}` },
  });
  if (!res.ok) return false; // 404 = no backup yet
  const { snapshot } = await res.json();
  if (!snapshot || typeof snapshot !== 'object') return false;
  // Only restore a backup that actually holds progress — restoring a blank
  // default is pointless and would trigger a needless reload.
  if (!snapshotHasProgress(snapshot as Record<string, string>)) return false;
  for (const [k, v] of Object.entries(snapshot as Record<string, string>)) {
    try { localStorage.setItem(k, v); } catch { /* quota / unavailable */ }
  }
  return Object.keys(snapshot).length > 0;
}

async function pushExport(link: TherapistLink): Promise<void> {
  const state = getDirectiveState();
  detectCompletions(state);
  saveDirectiveState(state);
  const payload = {
    ...buildExportPayload(),
    directiveReceipts: Object.entries(state.receipts).map(([directiveId, r]) => ({
      directiveId, status: r.status, at: r.at, detail: r.detail,
    })),
  };
  await fetch(`${link.endpoint}/api/companion-sync/${link.clientId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${link.token}` },
    body: JSON.stringify(payload),
  });
}

/** Full sync (pull then push). Safe to fire-and-forget. */
export async function syncNow(): Promise<boolean> {
  const link = getLink();
  if (!link) return false;
  try {
    await pullDirectives(link);
    await pushExport(link);
    await backupState(link);   // durable cloud save of the full local state
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    return true;
  } catch {
    return false; // offline / therapist app down — never surface an error
  }
}

/** Throttled app-open sync: at most once per hour. */
export function syncOnOpen() {
  const link = getLink();
  if (!link) return;
  const last = localStorage.getItem(LAST_SYNC_KEY);
  if (last && Date.now() - new Date(last).getTime() < 3600_000) return;
  void syncNow();
}
