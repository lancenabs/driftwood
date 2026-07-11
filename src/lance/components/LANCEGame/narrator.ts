// ═════════════════════════════════════════════════════════════════════════════
//  THE NARRATOR SEAM — who speaks inside the tools on THIS shore.
//
//  The island's tools were written with L.A.N.C.E. as their in-tool voice; on
//  the voyage it was the shipmate. On the tide line the speaking companions
//  are THE JUMBLE — the little Washed-Ashore robots. SKIP (the eager one) is
//  the first voice; THE COLLIER (the elder forge-keeper) is the second.
//
//  ⚓ THIS IS ALSO THE CARTRIDGE SOCKET (SOP-6): a practice cartridge answers
//  these lookups with the therapist's naming when one is in the slot. And the
//  base layer holds here as everywhere: the narrator never touches the crisis
//  strip, the private boarding page, or the no-shame law.
// ═════════════════════════════════════════════════════════════════════════════

function guideName(): string {
  try {
    const w = JSON.parse(localStorage.getItem('driftwood_guide_v1') || 'null');
    if (w?.name && typeof w.name === 'string' && w.name.trim()) return w.name.trim();
  } catch { /* not chosen yet */ }
  return 'Skip';
}

export const NARRATOR = {
  get name(): string { return guideName(); },
  portrait: '/robots/skip.webp',
};

export const SECOND_VOICE = {
  name: 'The Collier',
  portrait: '/robots/collier.webp',
};
