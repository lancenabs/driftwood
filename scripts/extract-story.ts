// Dumps the Driftwood story (cold open + 31 milestone openings + closings)
// to the public website's data dir. Run: npx tsx scripts/extract-story.ts
import { MILESTONES, SEASONS } from '../src/data/milestones';
import { CRAFT } from '../src/data/milestoneCraft';
import { writeFileSync } from 'fs';

// The boarding cold open (BoardingStory.tsx CINEMATIC — mirrored here since
// the component file can't be imported headless). 1954 frame, 2026-07-16.
const COLD_OPEN = [
  { speaker: "BEFORE", location: "GULLHAVEN, MAINE \u00b7 1929", text: "A home for foundlings on a gray hook of the coast, and a boy it kept the way a pocket keeps a stone. Twice a family chose him. Twice they brought him back. The other boys had a name for him after that \u2014 DRIFTWOOD \u2014 because he washed up from nowhere, because the sea throws it away. He had one thing. He had hands." },
  { speaker: "BEFORE", location: "AN ISLAND ON NO CHART \u00b7 YEARS LATER", text: "He built a boat out of the material they used to insult him \u2014 fourteen boards, copper nails taken two at a time \u2014 and sailed for an island with nothing on it, because nothing can't give you back. What he built there, alone, out of storm-wood and bottle-glass and need, is ahead of this story. It is still there. All of it. This is the part nobody tells: the island you are about to visit is somebody's whole heart, still running." },
  { speaker: "THE HALCYON", location: "NEW YORK HARBOR \u00b7 AUTUMN 1954", text: "Halcyon: a bird out of an old story that could calm the sea by sitting on it. She sails out of New York in the autumn of 1954 with four hundred and eleven people, a dance band, and a swimming pool \u2014 into the best few years anybody can remember. The war is over. There is money, and nylon, and a feeling. And the people aboard have everything and are, most of them, quietly not all right \u2014 and have no language for it whatsoever, because in 1954 there isn't one." },
  { speaker: "THE SEPARATE ROOMS", location: "ABOARD \u00b7 YOUR FAMILY", text: "Your family is aboard. And on the ship, they do exactly what they do at home: they come apart, politely. One at the rail. One at cards. One trailing the dance band. One counting portholes and pretending not to hear the argument warming up for its hundredth performance \u2014 the same one as always, in nicer clothes. Same vessel. Separate rooms." },
  { speaker: "THE REEF", location: "OPEN WATER \u00b7 THE FIFTH OF NOVEMBER", text: "It comes over the horizon like a decision. The sky goes green-black \u2014 and the sea opens on a reef that is on no chart. No chart, because the only man who ever found the island it guards had nobody to tell." },
  { speaker: "THE LINE", location: "THE BOAT DECK \u00b7 HOLD", text: "LIFE JACKETS. NOW. In the crush of the boat deck, weathered hands \u2014 a steward's, a stranger's, a father's, nobody ever agrees whose \u2014 lash your family's hands to one rope, hand over hand over hand. \"HOLD THE LINE. Not the rail \u2014 EACH OTHER. Whatever the sea takes, it does not get to take the LINE\u2014\" Lightning. The funnel groaning. The water coming up to meet you." },
  { speaker: "THE TIDE LINE", location: "THE ISLAND \u00b7 DAWN \u00b7 NOVEMBER 5, 1954", text: "Sand. Rain-light. The sound of a sea pretending nothing happened. The family wakes scattered down one shoreline \u2014 soaked, bruised, alive, still holding one rope with no ship on the end of it. They count heads the way you count when you cannot breathe until the number is right. The number is right. All of them. And down the beach, other shapes stirring \u2014 a handful of the saved, waking on the same sand." },
  { speaker: "THE COMPASS", location: "THE WRECK LINE \u00b7 WHAT WASHED UP", text: "The Halcyon is gone. What washes up in the tide junk, glinting, is a brass compass \u2014 heavy, old, its casing worked by hand, by somebody who loved it. The needle does not point north. It points INLAND, toward the jungle, steady as a held breath. And from the treeline \u2014 small, wooden, gone the second anyone looks \u2014 something watches the family count heads." },
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
