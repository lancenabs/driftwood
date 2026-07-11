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
}

const KEY = 'driftwood_castaways_v1';
const ACTIVE_KEY = 'driftwood_active_castaway_v1';

export function readCrew(): ClaimedCastaway[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
}

export function claimSlot(slotId: string, name: string): ClaimedCastaway[] {
  const crew = readCrew().filter(c => c.slotId !== slotId);
  crew.push({ slotId, name: name.trim() || 'Castaway', claimedAt: new Date().toISOString(), kind: 'human' });
  localStorage.setItem(KEY, JSON.stringify(crew));
  return crew;
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
