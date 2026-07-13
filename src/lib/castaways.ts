// ═════════════════════════════════════════════════════════════════════════════
//  THE SEVEN — castaway slots for every family shape (bible §5).
//  Couples, families, blended, co-parents, three generations: each real
//  person claims a slot at boarding; UNCLAIMED SLOTS WAKE AS AI CASTAWAYS
//  (Washed-Ashore-adjacent — honest-AI is structural: the roster itself says
//  which hands are human and which are robot; nothing ever pretends).
// ═════════════════════════════════════════════════════════════════════════════

export interface CastawaySlot {
  id: string;
  role: string;               // the role token
  emoji: string;              // placeholder until Lance's art lands
  blurb: string;              // what this role tends on the island
}

export const THE_SEVEN: CastawaySlot[] = [
  { id: 'castaway-1', role: 'Navigator',          emoji: '🧭', blurb: 'keeps the heading — where are we actually going, together?' },
  { id: 'castaway-2', role: 'Keeper of the Fire', emoji: '🔥', blurb: 'tends the warmth — the rituals, the meals, the returning' },
  { id: 'castaway-3', role: 'Lookout',            emoji: '🔭', blurb: 'sees weather early — names what is circling before it lands' },
  { id: 'castaway-4', role: 'Quartermaster',      emoji: '🎒', blurb: 'keeps the manifest honest — who carries what this week' },
  { id: 'castaway-5', role: 'Storyteller',        emoji: '📖', blurb: 'holds the history — the story circle, the boards, the laughs' },
  { id: 'castaway-6', role: 'Anchor',             emoji: '⚓', blurb: 'holds steady in swell — the calm voice when the water is not' },
  { id: 'castaway-7', role: 'Tender',             emoji: '🌱', blurb: 'notices who needs tending — the smallest voice gets heard' },
];

export interface ClaimedCastaway {
  slotId: string;
  name: string;               // first name / nickname — optional PHI-light
  claimedAt: string;
  kind: 'human' | 'ai';       // the honest roster
  // THE INCLUSIVITY MODEL (2026-07-12): the crew composes itself; the app
  // never asks what kind of family this is. `age` is the one quiet toggle
  // (it powers the couple/family story framing AND the kid-safe register);
  // `tint` is a chosen skin tone for the island avatar; `avatarKind` the
  // chosen mesh. All optional, all theirs.
  age?: 'adult' | 'young';
  tint?: string;              // hex — pre-seeds the 3D avatar's skin tone
  avatarKind?: string;        // island mesh id (driftwood_avatar_v1 mirrors it)
}

const KEY = 'driftwood_castaways_v1';
const ACTIVE_KEY = 'driftwood_active_castaway_v1';
const REL_KEY = 'driftwood_relationship_v1';

export function readCrew(): ClaimedCastaway[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
}

export function claimSlot(slotId: string, name: string, extra?: Pick<ClaimedCastaway, 'age' | 'tint' | 'avatarKind'>): ClaimedCastaway[] {
  const crew = readCrew().filter(c => c.slotId !== slotId);
  crew.push({ slotId, name: name.trim() || 'Castaway', claimedAt: new Date().toISOString(), kind: 'human', age: extra?.age ?? 'adult', ...(extra?.tint ? { tint: extra.tint } : {}), ...(extra?.avatarKind ? { avatarKind: extra.avatarKind } : {}) });
  localStorage.setItem(KEY, JSON.stringify(crew));
  return crew;
}

// ── THE FRAMING (the bible's promised field, real at last) ──────────────────
// 'couple' iff exactly two claimed humans, both adults; every other shape —
// kids present, three generations, a crew of adults — is 'family'. Derived,
// never asked; a low-key mirror of who actually boarded.
export function composition(): 'couple' | 'family' {
  const humans = readCrew().filter(c => c.kind === 'human');
  return humans.length === 2 && humans.every(c => (c.age ?? 'adult') === 'adult') ? 'couple' : 'family';
}

/** The kid-safe register signal: any young castaway aboard. */
export function hasYoungCastaways(): boolean {
  return readCrew().some(c => c.kind === 'human' && c.age === 'young');
}

/** The youngest claimed young castaway's name — null means the story's
 *  child-shaped role belongs to Skip (couple mode, the little one himself). */
export function youngestName(): string | null {
  const young = readCrew().filter(c => c.kind === 'human' && c.age === 'young');
  return young.length ? young[young.length - 1].name : null;
}

// ── THE RELATIONSHIP LANGUAGE (asked once, warmly: "how should the island
// speak about you?") — a words choice, not a category. Default: names only.
export type RelationshipLabel = 'husbands' | 'wives' | 'husband-wife' | 'partners' | 'names-only';
export function readRelationship(): RelationshipLabel {
  try {
    const r = JSON.parse(localStorage.getItem(REL_KEY) || 'null');
    if (r?.label) return r.label;
  } catch { /* names */ }
  return 'names-only';
}
export function writeRelationship(label: RelationshipLabel) {
  try { localStorage.setItem(REL_KEY, JSON.stringify({ label })); } catch { /* best-effort */ }
}

/** The unclaimed slots, as the honest AI roster (the Washed-Ashore lend hands). */
export function aiCastaways(): CastawaySlot[] {
  const claimed = new Set(readCrew().map(c => c.slotId));
  return THE_SEVEN.filter(s => !claimed.has(s.id));
}

export function setActiveCastaway(slotId: string) {
  const c = readCrew().find(x => x.slotId === slotId);
  const slot = THE_SEVEN.find(s => s.id === slotId);
  if (!c || !slot) return;
  localStorage.setItem(ACTIVE_KEY, JSON.stringify({
    id: c.slotId, name: c.name, roleText: slot.role, avatar: slot.emoji,
    device: 'this device', color: 'bg-primary border-primary-dark text-white',
  }));
  window.dispatchEvent(new CustomEvent('driftwood:castaway-changed'));
}

export function activeCastaway(): { id: string; name: string; roleText: string; avatar: string } {
  try {
    const u = JSON.parse(localStorage.getItem(ACTIVE_KEY) || 'null');
    if (u?.id) return u;
  } catch { /* unclaimed */ }
  return { id: 'castaway-1', name: 'You', roleText: 'Castaway', avatar: '🏝️' };
}
