// ─────────────────────────────────────────────────────────────────────────────
// Challenge progress bus
//
// Lets an experiential tool (breathwork, etc.) report *real, countable* progress
// — e.g. "the user just finished one full breath cycle" — and lets the challenge
// overlay subscribe to it. This is how a challenge can require "3 cycles" of an
// exercise that doesn't persist anything to localStorage.
//
// Counts live in module memory keyed by a channel (we use the toolId). They are
// reset when a challenge attempt begins so each run starts from zero.
// ─────────────────────────────────────────────────────────────────────────────

const EVENT = 'lance-challenge-progress';
const counts: Record<string, number> = {};

export function reportChallengeCycle(channel: string): void {
  counts[channel] = (counts[channel] ?? 0) + 1;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { channel, count: counts[channel] } }));
  }
}

export function resetChallengeProgress(channel: string): void {
  counts[channel] = 0;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { channel, count: 0 } }));
  }
}

export function getChallengeProgress(channel: string): number {
  return counts[channel] ?? 0;
}

// Subscribe to progress updates. Returns an unsubscribe function.
export function onChallengeProgress(
  cb: (channel: string, count: number) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail as { channel: string; count: number };
    cb(detail.channel, detail.count);
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
