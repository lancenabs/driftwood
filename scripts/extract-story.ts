// Dumps the Driftwood story (cold open + 31 milestone openings + closings)
// to the public website's data dir. Run: npx tsx scripts/extract-story.ts
import { MILESTONES, SEASONS } from '../src/data/milestones';
import { CRAFT } from '../src/data/milestoneCraft';
import { writeFileSync } from 'fs';

// The boarding cold open (BoardingStory.tsx CINEMATIC — mirrored here since
// the component file can't be imported headless).
const COLD_OPEN = [
  { speaker: 'THE DOCK', location: 'PIER 4 · MORNING · THE FAMILY TOUR', text: 'The brochure said ISLAND ADVENTURE — A DAY TO RECONNECT. The family arrives the way they arrive everywhere lately: together, and in separate rooms. Two phones out. One argument already half-finished from the car, warming up for its hundredth performance.' },
  { speaker: 'THE ARGUMENT', location: 'PIER 4 · THE SAME FIGHT', text: '"You PROMISED you\'d leave work at home—" "Somebody has to PAY for—" "Can we not. CAN WE NOT." "Nobody even asked what I wanted to do today." Four voices, one knot. The youngest counts seagulls and pretends not to hear, which is a skill nobody should have to be good at.' },
  { speaker: 'MR. BAUER', location: 'THE GANGWAY · THE GUIDE', text: 'The guide is waiting at the boat like he\'s been waiting longer than a morning. Weathered hands. Eyes that do a headcount of the family and land somewhere deeper than a headcount. "Mr. Bauer," he says. "I take families to the island. Just families. It only works on families." Odd thing to say. He says it like a man who has seen this exact argument board this exact boat before.' },
  { speaker: 'THE STORM', location: 'OPEN WATER · NO WARNING', text: 'It comes over the horizon like a decision. The sky goes green-black. Bauer\'s voice changes registers — the tour-guide is gone; something older takes the wheel. "LIFE JACKETS. NOW. All of you — to the mast line."' },
  { speaker: 'MR. BAUER', location: 'THE MAST LINE · HIS LAST ORDER', text: 'He lashes the family\'s hands to one rope, hand over hand over hand, and puts both of his over all of theirs. "HOLD THE LINE. Not the rail — EACH OTHER. Whatever the sea takes, it does not get to take the LINE—" Lightning. The wheel spinning. His silhouette going back for it.' },
  { speaker: 'THE TIDE LINE', location: 'THE ISLAND · THE GREY BEFORE DAWN', text: 'Sand. Rain-light. The sound of a sea pretending nothing happened. The family wakes scattered down one shoreline — soaked, bruised, alive, still holding one rope with no boat on the end of it. They count heads the way you count when you cannot breathe until the number is right. The number is right. All of them. Except—' },
  { speaker: 'THE COMPASS', location: 'THE WRECK LINE · WHAT WASHED UP', text: 'Mr. Bauer is not on the beach. Not in the shallows. Not anywhere a voice can reach. What washes up instead, glinting in the tide junk, is his brass compass — heavy, old, engraved with letters gone soft: TO M.B. — COME HOME. The needle does not point north. It points INLAND, toward the jungle, steady as a held breath. And from the treeline — small, wooden, gone the second anyone looks — something watches the family count heads.' },
];

const out = {
  title: 'Driftwood',
  tagline: 'A family that loves together. A family that works together. A family that survives together.',
  coldOpen: COLD_OPEN,
  seasons: SEASONS,
  milestones: MILESTONES.map(m => ({
    id: m.id, n: m.n, season: m.season, title: m.title, first: m.first,
    opening: m.opening,
    closing: CRAFT[m.id]?.closing ?? [],
  })),
};
writeFileSync('/Users/lancenabers/lancenabers-site/src/data/driftwood-story.json', JSON.stringify(out, null, 1));
console.log('driftwood-story.json:', out.milestones.length, 'milestones');
