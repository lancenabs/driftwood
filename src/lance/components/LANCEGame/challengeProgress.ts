// ─── Per-challenge in-progress state ────────────────────────────────────────
// Persists where the user is *inside* a single challenge (which dialogue line,
// whether they've reached the task steps, and which steps are checked) so that
// leaving the challenge — or reloading the app entirely — restores them exactly
// where they were instead of dropping them back at the first LANCE line.
//
// This is intentionally separate from the main game save (lance_game_state_v1),
// which only tracks *which* challenge is current — not progress within it.

export interface ChallengeProgress {
  dialogIdx: number;
  showTask: boolean;
  completedSteps: boolean[];
}

const PROGRESS_KEY = 'lance_challenge_progress';

type ProgressMap = Record<string, ChallengeProgress>;

function loadAll(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') as ProgressMap;
  } catch {
    return {};
  }
}

export function loadChallengeProgress(id: string | null): ChallengeProgress | null {
  if (!id) return null;
  return loadAll()[id] ?? null;
}

export function saveChallengeProgress(id: string, data: ChallengeProgress): void {
  const all = loadAll();
  all[id] = data;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  } catch {
    /* storage full / unavailable — non-fatal */
  }
}

export function clearChallengeProgress(id: string): void {
  const all = loadAll();
  if (!(id in all)) return;
  delete all[id];
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  } catch {
    /* non-fatal */
  }
}

// True when the user has meaningfully started this challenge (moved past the
// first dialogue line, reached the task view, or checked at least one step).
// Used to decide whether to surface a "Resume Challenge" affordance.
export function hasChallengeProgress(id: string | null): boolean {
  const p = loadChallengeProgress(id);
  if (!p) return false;
  return p.dialogIdx > 0 || p.showTask || (p.completedSteps?.some(Boolean) ?? false);
}
