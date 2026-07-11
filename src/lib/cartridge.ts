// ═════════════════════════════════════════════════════════════════════════════
//  THE PRACTICE CARTRIDGE — Driftwood's slot (SOP-6; the Rehabit R2 pattern).
//  A therapist's cartridge lends the JUMBLE the practice's curriculum — the
//  micro-lesson bank, the staged-scene parameters — never a persona of a real
//  person, never PHI, and never one inch of the crisis strip or the private
//  boarding page. Default = the house family curriculum. R3 delivery rides
//  the companion bridge when the pairing lands (hand-work session).
// ═════════════════════════════════════════════════════════════════════════════

export interface DriftwoodCartridge {
  version: 1;
  id: string;
  practiceName: string;
  authorNote: string;
  // staged-scene rails: which patterns the Theater may stage (patterns, never people)
  stagedPatterns: string[];
  issuedBy?: string;
  issuedAt?: string;
}

const KEY = 'driftwood_cartridge_v1';

export const DEFAULT_CARTRIDGE: DriftwoodCartridge = {
  version: 1,
  id: 'house-family-curriculum',
  practiceName: 'The House Family Curriculum',
  authorNote: 'Gottman- and EFT-grounded, staged by the Jumble — the default voice of the shore.',
  stagedPatterns: ['skip_stages_the_chase', 'hollow_stages_the_shell'],
};

export function loadCartridge(): DriftwoodCartridge {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && raw.version === 1 && Array.isArray(raw.stagedPatterns) && raw.stagedPatterns.length) {
      return raw as DriftwoodCartridge;
    }
  } catch { /* fall through */ }
  return DEFAULT_CARTRIDGE;
}

export function ejectCartridge() { localStorage.removeItem(KEY); }
