// ─────────────────────────────────────────────────────────────────────────────
//  AI BRAIN & KEY (2026-07-20) — bring-your-own-key, the fleet law ported from
//  lance-app's AI Brain & Keys. The buyers are THERAPISTS: a practice pastes
//  its Gemini key once in Settings and every AI feature on this shore rides
//  that key from this device. The key lives in localStorage ONLY and travels
//  per-request as the x-gemini-key header — the server never stores it.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = 'driftwood_gemini_key_v1';

export function loadAiKey(): string {
  try { return localStorage.getItem(KEY) || ''; } catch { return ''; }
}

export function saveAiKey(key: string): void {
  try {
    const v = key.trim();
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
  } catch { /* storage unavailable — the house key still works */ }
}

/** Headers for any AI endpoint call: adds x-gemini-key when the practice set one. */
export function aiHeaders(base: Record<string, string> = {}): Record<string, string> {
  const key = loadAiKey();
  return key ? { ...base, 'x-gemini-key': key } : base;
}
