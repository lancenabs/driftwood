// ═════════════════════════════════════════════════════════════════════════════
//  THE INVITE — "let's meet at the waterfall and finish challenge 10 together."
//
//  This is the exact sentence Lance used to describe what Driftwood is FOR: a
//  couple call each other mid-week, one texts the other a link, and they walk
//  their avatars across the island to the same place. Everything before this
//  existed — the Gathering (a shared camp), the Rally (a beacon on a place,
//  arriving together = rally_met) — but nothing bridged "a text message" to "a
//  shared camp with a beacon on the waterfall." A couple could meet only if they
//  were already in the same camp reading a six-letter code aloud. Nobody texts a
//  code. They text a link.
//
//  THE LINK:  <origin>/?meet=<CODE>&at=<place>&ms=<n>
//    meet — the camp code. Joining it is what puts two phones on one island.
//    at   — an island landmark id (waterfall, forge, lookout, …). The beacon.
//    ms   — the milestone number they agreed to finish. Optional, for the label.
//
//  The PLACE travels in the link, so the invitee's beacon does not depend on a
//  live rally event still sitting in the relay backlog. Belt (the URL) and
//  braces (the backlog replay in island3d) both raise it.
//
//  Late-tolerant by Lance's design: whoever arrives first waits by the water.
//  The Skipping is one of the boy's 97 tools — do the useless thing on purpose,
//  where the waiting happens.
// ═════════════════════════════════════════════════════════════════════════════
import { hostGathering, joinGathering, gatheringState } from './gathering';

// The landmarks a rally beacon can stand on — these are island3d's LANDMARKS,
// the places you can say "meet me at" out loud. NOT the city places (a rally
// targets a landmark; the city is the reward you walk to, not a meeting point).
// Kept in step with island3d by qa-invite, which fails if an id here has no
// landmark over there.
export const MEET_PLACES: Record<string, { name: string; emoji: string }> = {
  waterfall:   { name: 'the Waterfall',   emoji: '💧' },
  forge:       { name: 'the Forge',       emoji: '⚒️' },
  lookout:     { name: 'the Lookout',     emoji: '🔭' },
  quiet_cove:  { name: 'the Quiet Cove',  emoji: '🌊' },
  wreck_beach: { name: 'the Wreck Beach', emoji: '⛵' },
  workshop:    { name: 'the Workshop',    emoji: '🔧' },
  totem:       { name: 'the Totem',       emoji: '🪵' },
  our_rock:    { name: 'Our Rock',        emoji: '🪨' },
};

export interface Invite {
  code: string;
  place?: string;    // a MEET_PLACES id
  milestone?: number;
}

const RALLY_TARGET_KEY = 'driftwood_rally_target_v1';   // one-shot, handed to the island

/** Parse an invite out of a URL's query string. Returns null if there's no code. */
export function parseInvite(search: string = location.search): Invite | null {
  const q = new URLSearchParams(search);
  const code = (q.get('meet') || '').trim().toUpperCase();
  if (!code) return null;
  const place = (q.get('at') || '').trim().toLowerCase();
  const msRaw = q.get('ms');
  const ms = msRaw && /^\d+$/.test(msRaw) ? Number(msRaw) : undefined;
  return {
    code,
    place: place && MEET_PLACES[place] ? place : undefined,
    milestone: ms && ms >= 1 && ms <= 31 ? ms : undefined,
  };
}

/** Build the shareable link. Same-origin so the invitee lands in THIS app. */
export function buildInviteURL(inv: Invite, origin: string = location.origin): string {
  const q = new URLSearchParams({ meet: inv.code });
  if (inv.place) q.set('at', inv.place);
  if (inv.milestone) q.set('ms', String(inv.milestone));
  return `${origin}/?${q.toString()}`;
}

/** The human sentence that rides with the link in a text message. */
export function inviteText(inv: Invite): string {
  const p = inv.place ? MEET_PLACES[inv.place] : null;
  const where = p ? `at ${p.name} ${p.emoji}` : 'on the island';
  const what = inv.milestone ? ` and finish challenge ${inv.milestone} together` : '';
  return `Meet me ${where}${what}. Tap to walk over:`;
}

/**
 * Make an invite from wherever you're standing. Hosts a camp if this device
 * isn't already in one, so the wife doesn't have to think about "codes" — she
 * thinks "meet me at the waterfall." Returns the link + the sentence to send.
 */
export async function createInvite(opts: { place?: string; milestone?: number } = {}): Promise<{ url: string; text: string; invite: Invite }> {
  let code = gatheringState().code;
  if (!code) code = await hostGathering();
  const invite: Invite = { code, place: opts.place, milestone: opts.milestone };
  return { url: buildInviteURL(invite), text: inviteText(invite), invite };
}

/**
 * Accept an invite on load: join the camp, and stash the place for the island to
 * pick up when its iframe mounts. Idempotent-ish — joining a camp you're already
 * in is harmless. Never throws into the render path; a bad code just means no
 * beacon, not a broken app.
 */
export async function acceptInvite(inv: Invite): Promise<void> {
  if (inv.place) {
    try { sessionStorage.setItem(RALLY_TARGET_KEY, JSON.stringify({ place: inv.place, milestone: inv.milestone })); } catch { /* fine */ }
  }
  try {
    if (gatheringState().code !== inv.code) await joinGathering(inv.code);
  } catch { /* honest degradation: they still land on the island, just uncamped */ }
}

/** One-shot read for ChallengesTab → the island iframe. Cleared after reading. */
export function consumeRallyTarget(): { place: string; milestone?: number } | null {
  try {
    const raw = sessionStorage.getItem(RALLY_TARGET_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(RALLY_TARGET_KEY);
    const t = JSON.parse(raw);
    return t?.place && MEET_PLACES[t.place] ? t : null;
  } catch { return null; }
}

/** Strip the invite params from the address bar once consumed, so a refresh
 *  doesn't re-trigger and a shared screenshot of the URL isn't a live code. */
export function clearInviteFromURL(): void {
  try {
    if (!location.search.includes('meet=')) return;
    history.replaceState(null, '', location.pathname + location.hash);
  } catch { /* fine */ }
}
