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
  /**
   * WHERE IT STANDS ON THE ISLAND — world coords, the one geography.
   *
   * Lance's call 2026-07-14: ONE ISLAND. The city is not a menu and not a ring
   * around the world — it is the wooden town the robots built on the island's
   * central plain, and the 31 milestones light it. Every surface reads these
   * numbers: the walkable island (island3d), VR, and the board. Before this,
   * each invented its own placement and they had already drifted to sharing
   * almost nothing.
   *
   * Chosen against the real terrain, not by eye: all 27 sit on the inland plain
   * (h 14-17, grade under 17%), clear of every story landmark and season circle.
   * The plain is the ONLY flat ground here — everything else is a 26-36% ramp,
   * and islandHeight() may never change (VR + the board + Build Mode's voxel
   * grid all key to it). Re-run scripts/qa-island-mirror.mjs after editing.
   */
  x: number;
  z: number;
  audience: Audience[];
  /** The therapeutic promise — what you practice here, in the therapist's terms. */
  purpose: string;
  /** The postcard line — how it feels to be there. */
  vibe: string;
  /** Explorable places hide a little mystery: a question, a find, a quiet quest. */
  mystery?: string;
  /** Which built-in Driftwood tool/game this place naturally opens (optional). */
  tool?: string;
  /**
   * WHICH MILESTONE LIGHTS IT — the reward, and it was blessed canon before it
   * was a field. THE_WAYWARD_BOY ch 18, "The City Stands Up":
   *
   *   "They found it on the second day, going inland for water: a city. Empty.
   *    Perfect. Wooden. The waterwheel turning. The clocks running. Streets, and
   *    benches, and a park, and HUNDREDS OF LAMPS THAT HAD NEVER BEEN LIT."
   *   "Kathleen Brennan said, 'There's people here,' and cried with relief, and
   *    there were no people there."
   *
   * The city is found on DAY TWO and it is DARK. It refuses them (ch 19: "The
   * Jumble watched you argue on the beach. We don't help storms."). You walk its
   * streets while it isn't yours. Each milestone the family truly closes brings
   * one place up. Milestone 31 — The Naming of the Boat — lights lantern-park
   * and everything still dark: hundreds of lamps, finally lit, because one
   * family proved they weren't a storm.
   *
   * Nine robots built an instrument for every tool the boy gave them and never
   * had a guest. That's why almost every pairing below is exact — the places and
   * the milestones came out of the same 97 tools.
   *
   * Nothing lights before 4: milestone 3 (First Fire) is the turn, where Skip's
   * hand burns and strangers put it out with their bare hands and NOBODY GIVES
   * HIM BACK. Milestone 30 lights nothing — a council is a decision, not a room.
   */
  lightsAt: number;
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
  { id: 'harbor-docks',   name: 'The Driftwood Docks', glyph: '⚓', region: 'harbor', x: -29, z: 5, lightsAt: 4, audience: ['everyone'], purpose: 'Arrival & orientation — name where you are today.', vibe: 'Salt air, creaking planks, the robots waving you in.' },
  { id: 'lighthouse',     name: 'The Lighthouse',      glyph: '🗼', region: 'harbor', x: -24, z: 14, lightsAt: 6, audience: ['everyone', 'solo'], purpose: 'Grounding & safety — your steady light when the water is rough.', vibe: 'A warm beam sweeping the dark, saying: you are not lost.' },
  { id: 'tidepool-walk',  name: 'Tidepool Boardwalk',  glyph: '🐚', region: 'harbor', x: -19, z: 5, lightsAt: 5, audience: ['everyone', 'kids', 'families'], purpose: 'Sensory mindfulness — five senses at the water’s edge.', vibe: 'Warm boards, cool pools, tiny crabs the kids name.', tool: 'grounding_54321' },

  // ── Driftwood Hollow — the pretty lake, reflection ──
  { id: 'mirror-lake',    name: 'Mirror Lake',         glyph: '🪞', region: 'hollow', x: -39, z: 24, lightsAt: 19, audience: ['solo', 'couples'], purpose: 'Reflection — see yourself, and let your partner truly see you.', vibe: 'Glass-still water that holds the whole sky.' },
  { id: 'gratitude-grove',name: 'The Gratitude Grove', glyph: '🍃', region: 'hollow', x: -36, z: 35, lightsAt: 14, audience: ['everyone', 'families'], purpose: 'Gratitude practice — hang one true thankful thing on the wishing tree.', vibe: 'Ribbons in the branches, each one a small thank-you.', tool: 'gratitude_log' },
  { id: 'skipping-shore', name: 'Skipping-Stone Shore',glyph: '🪨', region: 'hollow', x: -25, z: 32, lightsAt: 24, audience: ['solo', 'couples'], purpose: 'Letting go — write the weight on a stone, then skip it across the water.', vibe: 'The satisfying plink-plink-plink and the ripples fading.' },
  { id: 'hollow-cabins',  name: 'The Hollow Cabins',   glyph: '🛖', region: 'hollow', x: -28, z: 21, lightsAt: 8, audience: ['couples'], purpose: 'Couples’ retreat — an unhurried evening to reconnect.', vibe: 'Lantern light, two rocking chairs, no clocks.' },

  // ── Driftwood Canyon — resilience, communication, mystery ──
  { id: 'echo-canyon',    name: 'Echo Canyon',         glyph: '📣', region: 'canyon', x: 1, z: -10, lightsAt: 11, audience: ['couples', 'families'], purpose: 'Being heard — say the hard thing; the canyon repeats it back gently.', vibe: 'Red walls that carry your voice a long, long way.' },
  { id: 'rope-bridges',   name: 'The Rope Bridges',    glyph: '🌉', region: 'canyon', x: 4, z: -1, lightsAt: 12, audience: ['couples', 'families'], purpose: 'Trust — cross together; one holds the rope while the other steps.', vibe: 'A gentle sway, a hand on your back, the far side getting closer.' },
  { id: 'whispering-caves',name: 'The Whispering Caves',glyph: '🕳️', region: 'canyon', x: 13, z: -4, lightsAt: 20, audience: ['solo', 'everyone'], purpose: 'Shadow work — meet the quiet worry you keep in the dark.', vibe: 'Cool stone, a torch, your own soft echo.', mystery: 'Deep in the third cave, a wooden robot left a single carved word. Explorers who reach it say it changes for each person.' },
  { id: 'sunstone-overlook',name: 'Sunstone Overlook',  glyph: '🌅', region: 'canyon', x: 10, z: -13, lightsAt: 29, audience: ['everyone'], purpose: 'Perspective & awe — see how small today’s trouble is from up here.', vibe: 'The whole island gold in the late light.' },

  // ── Mount Driftwood — goals, effort, self-care ──
  { id: 'basecamp-meadow',name: 'Basecamp Meadow',     glyph: '⛺', region: 'mountain', x: 19, z: 11, lightsAt: 28, audience: ['everyone', 'solo'], purpose: 'Goal-setting — pack only what you’ll actually carry up.', vibe: 'Wildflowers, a map on a stump, the peak in view.', tool: 'goal_journal' },
  { id: 'switchback-trail',name: 'The Switchback Trail', glyph: '🥾', region: 'mountain', x: 28, z: 10, lightsAt: 23, audience: ['everyone'], purpose: 'Persistence — the path bends back on itself, and still it climbs.', vibe: 'One switchback at a time; the valley shrinking behind you.' },
  { id: 'summit',         name: 'The Summit',          glyph: '🏔️', region: 'mountain', x: 27, z: 1, lightsAt: 17, audience: ['everyone', 'families'], purpose: 'Milestone & achievement — plant your flag; the robots ring the bell.', vibe: 'Thin bright air and a view that earns the whole climb.' },
  { id: 'snowdrift-hut',  name: 'Snowdrift Hut',       glyph: '🔥', region: 'mountain', x: 18, z: 2, lightsAt: 26, audience: ['solo', 'couples'], purpose: 'Rest & self-care — permission to stop and warm your hands.', vibe: 'A little fire, a heavy blanket, snow tapping the window.' },

  // ── Timber Town — the wooden city, community ──
  { id: 'gathering-bar',  name: 'The Gathering Bar',   glyph: '🍵', region: 'timber', x: -16, z: 14, lightsAt: 22, audience: ['everyone'], purpose: 'Connection — pull up a stool; the robots pour something warm and listen.', vibe: 'Lantern glow, low talk, someone always glad you came.', tool: 'gathering' },
  { id: 'robot-workshop', name: 'The Robot Workshop',  glyph: '🔧', region: 'timber', x: -15, z: 24, lightsAt: 7, audience: ['everyone', 'kids'], purpose: 'Repair & self-compassion — the robots fix what’s broken without shame.', vibe: 'Sawdust, gentle hammering, a robot saying “this can be mended.”' },
  { id: 'family-hearth',  name: 'The Family Hearth',   glyph: '🏡', region: 'timber', x: -4, z: 26, lightsAt: 10, audience: ['families'], purpose: 'Family time — one table, the day’s highs and lows, no phones.', vibe: 'A big wooden table, a stew on, everyone’s chair kept.' },
  { id: 'amphitheater',   name: 'The Driftwood Amphitheater', glyph: '🎭', region: 'timber', x: 1, z: 17, lightsAt: 16, audience: ['families', 'kids'], purpose: 'Expression & play — say it as a song, a skit, a silly voice.', vibe: 'Wooden tiers, a robot band, laughter carrying up the rows.' },
  { id: 'market-square',  name: 'Market Square',       glyph: '🏮', region: 'timber', x: -6, z: 9, lightsAt: 9, audience: ['everyone'], purpose: 'Needs & choices — trade what you have too much of for what you lack.', vibe: 'Stalls of carved trinkets, warm bread, a fair exchange.' },

  // ── The Green — parks & play, families/kids ──
  { id: 'golf-park',      name: 'The Golf Park',       glyph: '⛳', region: 'green', x: -16, z: 33, lightsAt: 15, audience: ['families', 'couples'], purpose: 'Playful challenge — lose gracefully, cheer each other, keep it light.', vibe: 'Rolling wooden greens, a windmill hole, gentle rivalry.' },
  { id: 'kite-meadow',    name: 'Kite Meadow',         glyph: '🪁', region: 'green', x: -18, z: 40, lightsAt: 21, audience: ['kids', 'families'], purpose: 'Play & letting the wind help — run, release, look up together.', vibe: 'A hundred kites and one perfect gust.' },
  { id: 'butterfly-garden',name: 'The Butterfly Garden',glyph: '🦋', region: 'green', x: -10, z: 47, lightsAt: 18, audience: ['kids', 'everyone'], purpose: 'Calm & sensory delight — go slow enough for one to land on you.', vibe: 'Warm color everywhere and a hush that isn’t empty.' },
  { id: 'lantern-park',   name: 'Lantern Park',        glyph: '🏮', region: 'green', x: -6, z: 37, lightsAt: 31, audience: ['couples', 'everyone'], purpose: 'Evening ritual — light one lantern for something you hope for.', vibe: 'Dusk, warm dots of light lifting off the water.' },

  // ── The Wilds — exploration & little mysteries ──
  { id: 'fern-hollow',    name: 'Fern Hollow',         glyph: '🌿', region: 'wilds', x: -27, z: 39, lightsAt: 27, audience: ['solo', 'everyone'], purpose: 'Nature immersion — a green quiet that lowers the whole nervous system.', vibe: 'Filtered light, soft moss, birdsong you didn’t notice arriving.' },
  { id: 'firefly-caves',  name: 'The Firefly Caves',   glyph: '✨', region: 'wilds', x: -29, z: 50, lightsAt: 25, audience: ['kids', 'families'], purpose: 'Wonder & hope — the dark isn’t empty; it’s full of small lights.', vibe: 'A living ceiling of soft green stars.', mystery: 'The fireflies spell a different short word each night. Kids who chart a week of them unlock the Keeper’s lantern.' },
  { id: 'old-root-grove', name: 'The Old-Root Grove',  glyph: '🌳', region: 'wilds', x: -19, z: 46, lightsAt: 13, audience: ['families'], purpose: 'Heritage & roots — trace the family tree carved into the great trunk.', vibe: 'One ancient wooden tree whose roots hold everyone’s names.', tool: 'genogram' },
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
