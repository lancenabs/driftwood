// ═════════════════════════════════════════════════════════════════════════════
//  THE VOICE — how the island speaks about this particular crew (2026-07-12
//  inclusivity law). Names first, always; relationship words only when the
//  family chose them at boarding ("how should the island speak about you?").
//  Story prose is NEVER regex-personalized — beats vary via the composition
//  flag in the story engine; these helpers serve game copy and tool intros.
// ═════════════════════════════════════════════════════════════════════════════
import { readCrew, readRelationship, composition } from './castaways';

/** "your husband" / "your wife" / "your partner" / the other adult's name.
 *  `forName`: whose perspective (defaults to speaking to the whole pair). */
export function partnerWord(forName?: string): string {
  const label = readRelationship();
  if (label === 'husbands') return 'your husband';
  if (label === 'wives') return 'your wife';
  if (label === 'husband-wife') {
    // one word serves both directions honestly only when we know who's asking
    const adults = readCrew().filter(c => c.kind === 'human' && (c.age ?? 'adult') === 'adult');
    const other = forName ? adults.find(a => a.name !== forName) : null;
    return other ? other.name : 'your partner';
  }
  if (label === 'partners') return 'your partner';
  // names-only: the other adult's actual name when knowable, else the warm generic
  const adults = readCrew().filter(c => c.kind === 'human' && (c.age ?? 'adult') === 'adult');
  if (forName) {
    const other = adults.find(a => a.name !== forName);
    if (other) return other.name;
  }
  if (adults.length === 2) return adults.map(a => a.name).join(' and ');
  return 'your person';
}

/** What the group is called: couples are a "crew" of two; everyone else, family. */
export function crewNoun(): string {
  return composition() === 'couple' ? 'crew' : 'family';
}

/** For dyadic game instructions inside a bigger family: the honest phrasing. */
export function pairPhrase(): string {
  return composition() === 'couple' ? partnerWord() : 'a partner for this round';
}
