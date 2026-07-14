// ─────────────────────────────────────────────────────────────────────────────
//  DRIFTWOOD CITY — the wooden supersystem the Driftwood robots built.
//
//  One island, seven regions, twenty-seven places. Every place is real in the
//  therapeutic sense: it maps to a skill a person, a couple, or a family can
//  practice there. Somewhere for everyone — solo reflection, a couple's trust
//  walk, a family's play afternoon, a kid's wonder, and a few caves with little
//  mysteries for the explorers.
//
//  This is the SOURCE OF TRUTH for the city. The Driftwood app renders it, the
//  VR island places it in 3D, and the board game lays it on a board — all read
//  this one file, so the world stays consistent everywhere.
//
//  Robot law: everything here is WOODEN, hand-built by the Driftwood robots
//  (Bailer, Collier, Echo-2, Hollow, Skip and their kin). The metal robots stay
//  on Voyager.
// ─────────────────────────────────────────────────────────────────────────────

export type Audience = 'everyone' | 'solo' | 'couples' | 'families' | 'kids';

export interface CityPlace {
  id: string;
  name: string;
  glyph: string;
  region: string;              // region id
  audience: Audience[];
  /** The therapeutic promise — what you practice here, in the therapist's terms. */
  purpose: string;
  /** The postcard line — how it feels to be there. */
  vibe: string;
  /** Explorable places hide a little mystery: a question, a find, a quiet quest. */
  mystery?: string;
  /** Which built-in Driftwood tool/game this place naturally opens (optional). */
  tool?: string;
  /** Art status — real art is generated later (Foundry/Higgsfield). */
  art?: string;
}

export interface CityRegion {
  id: string;
  name: string;
  glyph: string;
  tagline: string;
  /** A warm accent for the region on the map (client register). */
  color: string;
}

export const CITY_REGIONS: CityRegion[] = [
  { id: 'harbor',   name: 'Driftwood Harbor',   glyph: '⚓', tagline: 'where every crossing begins',        color: '#3ba7d4' },
  { id: 'hollow',   name: 'Driftwood Hollow',   glyph: '🌊', tagline: 'the still, pretty lake',              color: '#4fae9a' },
  { id: 'canyon',   name: 'Driftwood Canyon',   glyph: '🏜️', tagline: 'where the echo answers back',         color: '#c98a3a' },
  { id: 'mountain', name: 'Mount Driftwood',    glyph: '⛰️', tagline: 'the long climb, together',            color: '#8b9bb0' },
  { id: 'timber',   name: 'Timber Town',        glyph: '🪵', tagline: 'the wooden city the robots built',    color: '#b8804a' },
  { id: 'green',    name: 'The Driftwood Green', glyph: '🌳', tagline: 'parks, play, and open sky',           color: '#63b34a' },
  { id: 'wilds',    name: 'The Wilds',          glyph: '🍄', tagline: 'ferns, fireflies, and little mysteries', color: '#7a6cc4' },
];

export const CITY_PLACES: CityPlace[] = [
  // ── Driftwood Harbor — arrivals, grounding ──
  { id: 'harbor-docks',   name: 'The Driftwood Docks', glyph: '⚓', region: 'harbor', audience: ['everyone'], purpose: 'Arrival & orientation — name where you are today.', vibe: 'Salt air, creaking planks, the robots waving you in.' },
  { id: 'lighthouse',     name: 'The Lighthouse',      glyph: '🗼', region: 'harbor', audience: ['everyone', 'solo'], purpose: 'Grounding & safety — your steady light when the water is rough.', vibe: 'A warm beam sweeping the dark, saying: you are not lost.' },
  { id: 'tidepool-walk',  name: 'Tidepool Boardwalk',  glyph: '🐚', region: 'harbor', audience: ['everyone', 'kids', 'families'], purpose: 'Sensory mindfulness — five senses at the water’s edge.', vibe: 'Warm boards, cool pools, tiny crabs the kids name.', tool: 'grounding_54321' },

  // ── Driftwood Hollow — the pretty lake, reflection ──
  { id: 'mirror-lake',    name: 'Mirror Lake',         glyph: '🪞', region: 'hollow', audience: ['solo', 'couples'], purpose: 'Reflection — see yourself, and let your partner truly see you.', vibe: 'Glass-still water that holds the whole sky.' },
  { id: 'gratitude-grove',name: 'The Gratitude Grove', glyph: '🍃', region: 'hollow', audience: ['everyone', 'families'], purpose: 'Gratitude practice — hang one true thankful thing on the wishing tree.', vibe: 'Ribbons in the branches, each one a small thank-you.', tool: 'gratitude_log' },
  { id: 'skipping-shore', name: 'Skipping-Stone Shore',glyph: '🪨', region: 'hollow', audience: ['solo', 'couples'], purpose: 'Letting go — write the weight on a stone, then skip it across the water.', vibe: 'The satisfying plink-plink-plink and the ripples fading.' },
  { id: 'hollow-cabins',  name: 'The Hollow Cabins',   glyph: '🛖', region: 'hollow', audience: ['couples'], purpose: 'Couples’ retreat — an unhurried evening to reconnect.', vibe: 'Lantern light, two rocking chairs, no clocks.' },

  // ── Driftwood Canyon — resilience, communication, mystery ──
  { id: 'echo-canyon',    name: 'Echo Canyon',         glyph: '📣', region: 'canyon', audience: ['couples', 'families'], purpose: 'Being heard — say the hard thing; the canyon repeats it back gently.', vibe: 'Red walls that carry your voice a long, long way.' },
  { id: 'rope-bridges',   name: 'The Rope Bridges',    glyph: '🌉', region: 'canyon', audience: ['couples', 'families'], purpose: 'Trust — cross together; one holds the rope while the other steps.', vibe: 'A gentle sway, a hand on your back, the far side getting closer.' },
  { id: 'whispering-caves',name: 'The Whispering Caves',glyph: '🕳️', region: 'canyon', audience: ['solo', 'everyone'], purpose: 'Shadow work — meet the quiet worry you keep in the dark.', vibe: 'Cool stone, a torch, your own soft echo.', mystery: 'Deep in the third cave, a wooden robot left a single carved word. Explorers who reach it say it changes for each person.' },
  { id: 'sunstone-overlook',name: 'Sunstone Overlook',  glyph: '🌅', region: 'canyon', audience: ['everyone'], purpose: 'Perspective & awe — see how small today’s trouble is from up here.', vibe: 'The whole island gold in the late light.' },

  // ── Mount Driftwood — goals, effort, self-care ──
  { id: 'basecamp-meadow',name: 'Basecamp Meadow',     glyph: '⛺', region: 'mountain', audience: ['everyone', 'solo'], purpose: 'Goal-setting — pack only what you’ll actually carry up.', vibe: 'Wildflowers, a map on a stump, the peak in view.', tool: 'goal_journal' },
  { id: 'switchback-trail',name: 'The Switchback Trail', glyph: '🥾', region: 'mountain', audience: ['everyone'], purpose: 'Persistence — the path bends back on itself, and still it climbs.', vibe: 'One switchback at a time; the valley shrinking behind you.' },
  { id: 'summit',         name: 'The Summit',          glyph: '🏔️', region: 'mountain', audience: ['everyone', 'families'], purpose: 'Milestone & achievement — plant your flag; the robots ring the bell.', vibe: 'Thin bright air and a view that earns the whole climb.' },
  { id: 'snowdrift-hut',  name: 'Snowdrift Hut',       glyph: '🔥', region: 'mountain', audience: ['solo', 'couples'], purpose: 'Rest & self-care — permission to stop and warm your hands.', vibe: 'A little fire, a heavy blanket, snow tapping the window.' },

  // ── Timber Town — the wooden city, community ──
  { id: 'gathering-bar',  name: 'The Gathering Bar',   glyph: '🍵', region: 'timber', audience: ['everyone'], purpose: 'Connection — pull up a stool; the robots pour something warm and listen.', vibe: 'Lantern glow, low talk, someone always glad you came.', tool: 'gathering' },
  { id: 'robot-workshop', name: 'The Robot Workshop',  glyph: '🔧', region: 'timber', audience: ['everyone', 'kids'], purpose: 'Repair & self-compassion — the robots fix what’s broken without shame.', vibe: 'Sawdust, gentle hammering, a robot saying “this can be mended.”' },
  { id: 'family-hearth',  name: 'The Family Hearth',   glyph: '🏡', region: 'timber', audience: ['families'], purpose: 'Family time — one table, the day’s highs and lows, no phones.', vibe: 'A big wooden table, a stew on, everyone’s chair kept.' },
  { id: 'amphitheater',   name: 'The Driftwood Amphitheater', glyph: '🎭', region: 'timber', audience: ['families', 'kids'], purpose: 'Expression & play — say it as a song, a skit, a silly voice.', vibe: 'Wooden tiers, a robot band, laughter carrying up the rows.' },
  { id: 'market-square',  name: 'Market Square',       glyph: '🏮', region: 'timber', audience: ['everyone'], purpose: 'Needs & choices — trade what you have too much of for what you lack.', vibe: 'Stalls of carved trinkets, warm bread, a fair exchange.' },

  // ── The Green — parks & play, families/kids ──
  { id: 'golf-park',      name: 'The Golf Park',       glyph: '⛳', region: 'green', audience: ['families', 'couples'], purpose: 'Playful challenge — lose gracefully, cheer each other, keep it light.', vibe: 'Rolling wooden greens, a windmill hole, gentle rivalry.' },
  { id: 'kite-meadow',    name: 'Kite Meadow',         glyph: '🪁', region: 'green', audience: ['kids', 'families'], purpose: 'Play & letting the wind help — run, release, look up together.', vibe: 'A hundred kites and one perfect gust.' },
  { id: 'butterfly-garden',name: 'The Butterfly Garden',glyph: '🦋', region: 'green', audience: ['kids', 'everyone'], purpose: 'Calm & sensory delight — go slow enough for one to land on you.', vibe: 'Warm color everywhere and a hush that isn’t empty.' },
  { id: 'lantern-park',   name: 'Lantern Park',        glyph: '🏮', region: 'green', audience: ['couples', 'everyone'], purpose: 'Evening ritual — light one lantern for something you hope for.', vibe: 'Dusk, warm dots of light lifting off the water.' },

  // ── The Wilds — exploration & little mysteries ──
  { id: 'fern-hollow',    name: 'Fern Hollow',         glyph: '🌿', region: 'wilds', audience: ['solo', 'everyone'], purpose: 'Nature immersion — a green quiet that lowers the whole nervous system.', vibe: 'Filtered light, soft moss, birdsong you didn’t notice arriving.' },
  { id: 'firefly-caves',  name: 'The Firefly Caves',   glyph: '✨', region: 'wilds', audience: ['kids', 'families'], purpose: 'Wonder & hope — the dark isn’t empty; it’s full of small lights.', vibe: 'A living ceiling of soft green stars.', mystery: 'The fireflies spell a different short word each night. Kids who chart a week of them unlock the Keeper’s lantern.' },
  { id: 'old-root-grove', name: 'The Old-Root Grove',  glyph: '🌳', region: 'wilds', audience: ['families'], purpose: 'Heritage & roots — trace the family tree carved into the great trunk.', vibe: 'One ancient wooden tree whose roots hold everyone’s names.', tool: 'genogram' },
];

export const cityStats = {
  regions: CITY_REGIONS.length,
  places: CITY_PLACES.length,
  mysteries: CITY_PLACES.filter(p => p.mystery).length,
};

export function placesByRegion(regionId: string): CityPlace[] {
  return CITY_PLACES.filter(p => p.region === regionId);
}
export function placesFor(audience: Audience): CityPlace[] {
  return CITY_PLACES.filter(p => p.audience.includes(audience) || p.audience.includes('everyone'));
}
