// ─────────────────────────────────────────────────────────────────────────────
//  THE CRAFT LAYER — the LANCE challenge design, laid over the 31 milestones.
//
//  The island's story canon lives in milestones.ts (openings in the Jumble's
//  voices, real instruments, save-gates). This file adds what the L.A.N.C.E.
//  bible has and the shore was missing:
//    · steps[]  — the concrete in-instrument moves (challengeSteps): what the
//                 crew actually DOES, numbered like a movie's shot list.
//    · closing  — the Jumble reacts when the work truly lands (lanceReaction /
//                 internReaction, worn by driftwood robots). Plays before the
//                 seal; the reward is the story noticing.
//    · gameId   — where a milestone's true instrument is a CAMPFIRE GAME, the
//                 game is bound as the instrument (completion = a real finished
//                 round, the fire_quiz_played event — never a self-checked box).
//    · circle   — where this season's story circle stands on the island (both
//                 the 3D world and VR raise a glowing ring there; walking in
//                 opens the next open milestone). Everything happens on the
//                 island.
//
//  THE COMPLETION LAW (unchanged, the bible's): a milestone closes only when
//  the bound instrument's real store grows — a saved entry or a genuinely
//  finished game round. Boxes are never self-checked.
// ─────────────────────────────────────────────────────────────────────────────
import { Beat } from './milestones';

export interface MilestoneCraft {
  steps: string[];
  closing: Beat[];
  gameId?: string;   // campfire game id (GamesMenu) — overrides the deck tool as the instrument
}

// Season story-circle spots on the island (world coords, both 3D + VR).
// S1 the wreck beach → S2 the Wright's camp → S3 the east headland →
// S4 the forge country → S5 the west tide line, where the raft will stand.
export const SEASON_CIRCLES: Record<number, { x: number; z: number; name: string }> = {
  1: { x: -6, z: 96, name: 'the wreck beach' },
  2: { x: 14, z: 66, name: "the Wright's clearing" },
  3: { x: 58, z: 18, name: 'the east headland' },
  4: { x: -34, z: -44, name: 'the forge country' },
  5: { x: -58, z: 58, name: 'the west tide line' },
};

// ─────────────────────────────────────────────────────────────────────────────
//  THE ADDRESS BOOK
//
//  Lance described what this app is for in one sentence: a couple call each
//  other mid-week and say "let's meet at the waterfall and finish challenge 10."
//  That sentence needs a challenge to HAVE a place. Until now none of them did —
//  milestoneSpot() scattered all 31 along the season's trail with a golden-angle
//  jitter, so every challenge stood wherever the arithmetic dropped it.
//
//  These eight name their own address; the story put them there before the map
//  did. Milestone 4 was already written as "Skip appears at dawn with his
//  bandaged hand... 'I know where water is. I am NOT showing you. Follow me
//  while I don't show you.'" — he has been walking families to the waterfall
//  since long before the waterfall existed.
//
//  The other twenty-three still meander along the trail, and that's right: not
//  every milestone is a destination, and a world where everything is a landmark
//  has none.
//
//  Values are landmark ids from island3d's LANDMARKS. qa:island-mirror asserts
//  every one resolves, so a typo here fails the gate instead of the couple.
// ─────────────────────────────────────────────────────────────────────────────
export const MILESTONE_PLACE: Record<string, string> = {
  ms_high_ground:   'lookout',      // 2  · the high ground IS the lookout
  ms_fresh_water:   'waterfall',    // 4  · Skip's secret. The spring.
  ms_salvage:       'wreck_beach',  // 5  · what the sea gave back
  ms_signal_fire:   'lookout',      // 17 · seen from the sea lane
  ms_quiet_cove:    'quiet_cove',   // 19 · named for it
  ms_apology_forge: 'forge',        // 24 · named for it
  ms_every_plank:   'workshop',     // 27 · every tool in there has a name on it
  ms_naming_boat:   'wreck_beach',  // 31 · the raft launches where they landed
};

export const CRAFT: Record<string, MilestoneCraft> = {
  // ═══ SEASON I · THE WRECK — safety & co-regulation ═══
  ms_count_heads: {
    steps: [
      'Open the Family Map and add every person who washed ashore — first names are enough.',
      'Draw the lines between people: who leans on whom when things are hard.',
      'Say each name out loud as you place it. Skip counts along. Badly.',
    ],
    closing: [
      { kind: 'robot', who: 'skip', text: 'ALL COUNTED! Every single one! I checked twice and got two different numbers but the MAP got it right!' },
      { kind: 'narration', text: 'The map hangs at the camp now — the first made thing on the island. A family that can see itself whole has already started.' },
    ],
  },
  ms_high_ground: {
    steps: [
      'Take the household pressure reading together — everyone answers the Barometer honestly.',
      'Each person names their HIGH GROUND: the one thing they do when a big wave rolls in.',
      'Agree out loud: when the glass drops fast, nobody has to ask where anyone went.',
    ],
    closing: [
      { kind: 'robot', who: 'bailer', text: 'High ground CHOSEN! In calm water! That\'s the whole trick — you did the storm\'s homework before the storm!' },
      { kind: 'narration', text: 'The island exhales. Whatever weather comes now, every member of this crew knows where every other member will be.' },
    ],
  },
  ms_first_fire: {
    steps: [
      'Sit close enough that shoulders almost touch. Open Box Breathing on one phone, in the middle.',
      'Breathe the square together — in four, hold four, out four, hold four — until the pace is SHARED.',
      'Watch the ember take. It only ever takes on the shared breath. Island law.',
    ],
    closing: [
      { kind: 'robot', who: 'skip', text: 'FIRE! REAL FIRE! You breathed at the same speed and the island NOTICED! I told you it likes that!' },
      { kind: 'robot', who: 'collier', text: '…First fire is the hardest one, small crew. Every fire after this remembers this one.' },
    ],
  },
  ms_fresh_water: {
    steps: [
      'At the spring, open the Manifest and hold the first council — short is fine.',
      'Each person names one true NEED for today, out loud, before any wants.',
      'Write the needs down. The island rations honesty before it rations water.',
    ],
    closing: [
      { kind: 'robot', who: 'echo2', text: 'Needs, then wants. Needs, then wants. I have it now! I will repeat it at unhelpful moments forever!' },
      { kind: 'narration', text: 'The spring runs the same as before. The crew does not. Everyone drank; everyone was heard first.' },
    ],
  },
  ms_salvage: {
    steps: [
      'Walk the tide line together and open the Bottle Post.',
      'Each person writes one thing the wreck did NOT take — something the family still has.',
      'Post the bottles where everyone can read them. That pile is the true salvage.',
    ],
    closing: [
      { kind: 'robot', who: 'collier', text: 'Mm. Look at the pile. Wreck-wood is not dead wood — I said it, and there is the proof, in your own handwriting.' },
      { kind: 'narration', text: 'The salvage heap by the fire is small and completely seaworthy: the things no storm reaches.' },
    ],
  },
  ms_night_watch: {
    steps: [
      'At dark, open the Watch Pile together.',
      'Each person writes tonight\'s loudest worry on a leaf and sets it on the pile.',
      'Say the watch-keeper\'s line: THE PILE HAS IT. Then actually go to sleep.',
    ],
    closing: [
      { kind: 'robot', who: 'bailer', text: 'The pile kept the watch ALL NIGHT. Not one worry got past it. I checked hourly. I don\'t sleep. That\'s not the point!' },
      { kind: 'robot', who: 'hollow', text: '…the first night is the longest one. You did it together. The rest are shorter.' },
    ],
  },

  // ═══ SEASON II · THE SHELTER — structure, roles, boundaries ═══
  ms_who_builds_what: {
    steps: [
      'Open the Manifest and list the camp\'s real jobs — water, wood, watch, cooking, morale.',
      'Each person claims work that fits their hands. Nobody gets assigned; everybody gets asked.',
      'Read the roster aloud. A camp where roles are chosen holds in wind.',
    ],
    closing: [
      { kind: 'robot', who: 'skip', text: 'I signed up for MORALE! And sticks! Chief of Morale and Sticks — it\'s on the manifest, it\'s OFFICIAL!' },
      { kind: 'narration', text: 'The work of the camp now has names on it — chosen, not assigned. That difference is the whole roof.' },
    ],
  },
  ms_walls_door: {
    steps: [
      'Open the Walls & the Door together.',
      'Each person names one WALL — a boundary the family will honor, no questions.',
      'Each person names their DOOR — how someone knocks when they need you anyway.',
    ],
    closing: [
      { kind: 'robot', who: 'hollow', text: '…a wall with a door in it. That is the good kind. I live in a shell with no door and I am TELLING you, build the door.' },
      { kind: 'narration', text: 'The shelter has walls now, and every wall has a door, and every door has a knock. That is a home, technically.' },
    ],
  },
  ms_larder_rules: {
    steps: [
      'Open the Ship\'s Calendar at the larder.',
      'Set the family\'s shared rhythms — meals, quiet hours, the one weekly thing nobody skips.',
      'Post it. A larder with rules feeds everyone; a calendar with rituals does the same.',
    ],
    closing: [
      { kind: 'robot', who: 'echo2', text: 'Tuesday. TUESDAY. I have memorized the sacred Tuesday. I will remind you of Tuesday on most days that are not Tuesday.' },
      { kind: 'narration', text: 'The camp has a heartbeat now — the same beats, every week, that nobody has to negotiate again.' },
    ],
  },
  ms_two_huts: {
    gameId: 'two_huts',
    steps: [
      'Gather at the fire and open Two Huts or One — the honest bedroll map.',
      'Each sleeper places their bedroll where it truly is right now. No flattering the map.',
      'Ask the only question: what would move yours one step closer?',
    ],
    closing: [
      { kind: 'robot', who: 'hollow', text: '…you drew it the way it IS. That is the bravest map on this island. The way it is, is where every real journey starts.' },
      { kind: 'narration', text: 'The map is honest now. Nobody moved a bedroll tonight — but everyone knows the step that would.' },
    ],
  },
  ms_second_language: {
    steps: [
      'Open the Signal Book together.',
      'Each person drafts one hard sentence the soft way — a real ask, said straight and kind.',
      'Practice it out loud once. The island counts the saying, not the drafting.',
    ],
    closing: [
      { kind: 'robot', who: 'echo2', text: 'I recorded the kind version! I am keeping it! When the loud version tries to come back I will play THIS one!' },
      { kind: 'narration', text: 'The crew speaks two languages now — the storm one it arrived with, and this one. Fluency comes with use.' },
    ],
  },
  ms_storm_proofing: {
    gameId: 'ridgepole_vote',
    steps: [
      'Gather every voice at the fire and open the Ridgepole Vote.',
      'Each person secretly picks the three timbers — the values — they would build this family on.',
      'Reveal together. Only the matches raise the beam; the beam is what the storm tests.',
    ],
    closing: [
      { kind: 'robot', who: 'collier', text: 'THERE is your ridgepole. The timbers you all chose without seeing each other\'s hands. The storm can argue with the walls — it cannot argue with that.' },
      { kind: 'narration', text: 'The shelter is storm-proofed with the only material that holds: the values every hand picked blind.' },
    ],
  },
  ms_map_of_us: {
    steps: [
      'Return to the Family Map — season two eyes now.',
      'Redraw the lines as they ARE after these weeks: who leans on whom, where the new ropes run.',
      'Compare with the count-heads map from the beach. Say what changed, out loud.',
    ],
    closing: [
      { kind: 'robot', who: 'skip', text: 'The lines got THICKER! I noticed immediately! I notice everything about this family, it\'s my favorite subject!' },
      { kind: 'narration', text: 'Two maps hang at camp now — the family that washed ashore, and the crew it is becoming. The season closes on the difference.' },
    ],
  },

  // ═══ SEASON III · THE SIGNAL FIRES — connection, bids, rituals ═══
  ms_appreciation_volley: {
    gameId: 'appreciation_volley',
    steps: [
      'Circle up at the fire and open the Appreciation Volley.',
      'Rally SPECIFIC appreciations across the flames — details, not "you\'re nice."',
      'Keep the ball up together. Every third volley lays a real log.',
    ],
    closing: [
      { kind: 'robot', who: 'skip', text: 'THE BALL NEVER DROPPED! I counted the volleys and lost count and that\'s the BEST kind of counting!' },
      { kind: 'narration', text: 'The fire is visibly taller. Specific kindness, it turns out, is excellent fuel.' },
    ],
  },
  ms_game_night: {
    gameId: 'memory_match',
    steps: [
      'Declare game night — the island insists, weekly.',
      'Open Memory Match: co-op shells, one board, everyone plays.',
      'Every matched pair, someone retells the family memory it names. That\'s the game.',
    ],
    closing: [
      { kind: 'robot', who: 'echo2', text: 'I recorded the laughing! Four distinct laughs! One snort! The snort is my favorite, I have labeled it PRECIOUS.' },
      { kind: 'narration', text: 'No skills practiced, no needs met — except the one this whole island runs on. Same time next week.' },
    ],
  },
  ms_story_circle: {
    gameId: 'story_circle',
    steps: [
      'Firelight. Open the Story Circle — kid-friendly, all hands.',
      'Build the tale one sentence per person around the ring; the little ones steer.',
      'Land it anywhere. The point is the passing, not the plot.',
    ],
    closing: [
      { kind: 'robot', who: 'hollow', text: '…I came all the way out of my shell for the ending. All the way out. It was worth it. Put that in the next story.' },
      { kind: 'narration', text: 'The story is terrible and perfect and belongs to everyone who touched it. It joins the island\'s permanent collection.' },
    ],
  },
  ms_signal_fire: {
    steps: [
      'Climb the headland together at dusk and open the Passage Chart.',
      'Chart where this family is trying to GO — the destination worth signaling about.',
      'Light the signal fire. It says: we are here, and we are headed somewhere.',
    ],
    closing: [
      { kind: 'robot', who: 'bailer', text: 'A HEADING! A real one! You can\'t bail your way to a destination — believe me, I\'ve tried — you have to POINT the boat!' },
      { kind: 'narration', text: 'From the water, the headland glows. Any ship passing knows: that camp is not waiting to be rescued. It is going somewhere.' },
    ],
  },
  ms_feast_small_things: {
    steps: [
      'Open the Daily Rigging at the evening fire.',
      'Each person logs the small true things that held today — the rigging that didn\'t snap.',
      'Feast on them out loud. Small things, said aloud, stop being small.',
    ],
    closing: [
      { kind: 'robot', who: 'skip', text: 'A FEAST of tiny things! My favorite kind! Big things are heavy but tiny things you can THROW and CATCH!' },
      { kind: 'narration', text: 'The table was set with nothing anyone could sell, and everyone left full. The island approves of this economy.' },
    ],
  },
  ms_quiet_cove: {
    steps: [
      'Find the cove — the one that holds sound out. Open the Tide Table.',
      'Each person marks their real tides: when their energy runs high, when it runs out.',
      'Agree on the cove hours: when this family lets each other be quietly alone, together.',
    ],
    closing: [
      { kind: 'robot', who: 'hollow', text: '…you made a place where being quiet is not being gone. I have been explaining that difference my whole life. Thank you.' },
      { kind: 'narration', text: 'The cove is on the map now. Solitude, scheduled and honored, turns out to be a family activity.' },
    ],
  },

  // ═══ SEASON IV · THE STORM RETURNS — the cycle, repair, the forge ═══
  ms_naming_undertow: {
    gameId: 'naming_the_undertow',
    steps: [
      'Deep water. Gather ONLY when the fire is tall enough — the island gates this one on warmth.',
      'Map the cycle together: the pull, the pattern, who goes under first, what the water says.',
      'Name it — as the THIRD THING. Not you, not them. The Undertow gets a name so it stops wearing yours.',
    ],
    closing: [
      { kind: 'robot', who: 'collier', text: 'Named. NAMED. Forty years at this forge and I will tell you the one true thing: a mended seam holds where the named crack cannot spread.' },
      { kind: 'narration', text: 'It has a name now. It is not either of you. Everything in season four follows from that one sentence.' },
    ],
  },
  ms_who_chases: {
    steps: [
      'Open the Mooring Lines, the morning after weather.',
      'Trace the dance honestly: who chases when it starts, who hides, what each is protecting.',
      'Swap lines once — the chaser holds still, the hider throws one rope. Just once. Feel it.',
    ],
    closing: [
      { kind: 'robot', who: 'echo2', text: 'The chase stopped for FOUR SECONDS. I timed it. Four seconds of both-standing-still. I am framing the recording.' },
      { kind: 'narration', text: 'The dance has been danced for years. Today, for a breath, both partners heard the music at the same time.' },
    ],
  },
  ms_speakers_shell: {
    steps: [
      'Council at the fire. Open the Soundings, and bring the actual conch.',
      'Only the shell-holder speaks; the crew\'s only job is to sound back what they heard.',
      'Pass it until everyone has been sounded back correctly ONCE. That\'s the whole milestone.',
    ],
    closing: [
      { kind: 'robot', who: 'echo2', text: 'THAT IS MY WHOLE JOB! Saying back what was said! You all did my job! I have never been prouder or more redundant!' },
      { kind: 'narration', text: 'Every voice at the fire got the rarest thing on any island: proof of having been heard.' },
    ],
  },
  ms_repair_rope: {
    gameId: 'repair_rope',
    steps: [
      'Mid-calm, not mid-storm — that\'s when rope gets braided. Open the Repair Rope.',
      'Braid the exact phrases that reach each other when the water rises. Test each strand.',
      'The rope keeps forever. When the storm comes, nobody has to invent the words wet.',
    ],
    closing: [
      { kind: 'robot', who: 'bailer', text: 'A rope that was THERE BEFORE the water! Do you know what I would give for pre-positioned equipment?! Everything! I would give everything!' },
      { kind: 'narration', text: 'The rope hangs by the door of every shelter now. Storms will still come. The words are already braided.' },
    ],
  },
  ms_apology_forge: {
    gameId: 'apology_forge',
    steps: [
      'Bring the real thing that needs mending to the Collier\'s forge. Open the Apology Forge.',
      'Four hammers, in order: name it plainly, own your part, say the repair, ask what\'s missing.',
      'Watch the "but" burn. It never survives the forge, and nothing true is lost with it.',
    ],
    closing: [
      { kind: 'robot', who: 'collier', text: 'Clean work. CLEAN work. You brought it to the fire before it rusted — that is the whole craft. The seam will show. Let it. That is how you know it held.' },
      { kind: 'narration', text: 'Something mended today that most families let sink. It is stronger at the weld now. The Collier says that is not a metaphor; it is metallurgy.' },
    ],
  },
  ms_flooded_camp: {
    steps: [
      'The morning after the worst one. Open the Barometer — again. Especially now.',
      'Read the pressure honestly; nobody performs okay-ness at this council.',
      'Rebuild ONE thing today, together — the smallest structure counts. The camp refloods; the rebuilding is the skill.',
    ],
    closing: [
      { kind: 'robot', who: 'bailer', text: 'CAMP RE-DRAINED! Faster than last time! Do you see?! The floods don\'t get smaller — the CREW gets faster! That\'s the entire secret of my whole life!' },
      { kind: 'narration', text: 'The flood was real, and it was survived, and by afternoon one small thing stood that hadn\'t stood at dawn. That is a family that knows how to flood.' },
    ],
  },
  ms_riding_it_out: {
    steps: [
      'The forecast is bad and everyone knows it. Open the Mending Bench BEFORE it hits.',
      'Lay out the plan while the sky is still dry: who does what, what we don\'t say, when we check in.',
      'Ride it out. Follow the bench-plan even when the wind argues. Debrief after — kindly.',
    ],
    closing: [
      { kind: 'robot', who: 'hollow', text: '…you stayed. All of you. In the same shelter, in the loud part. I watched from my shell and took notes on how staying is done.' },
      { kind: 'narration', text: 'The storm passed through the camp and found everyone in the same room when it left. It won\'t tell the other storms; they\'ll find out.' },
    ],
  },

  // ═══ SEASON V · THE RAFT — integration, the launch ═══
  ms_every_plank: {
    steps: [
      'Walk the raft frame together. Open the Passage Chart.',
      'Chart the crossing honestly: what going home means, what comes with us, what stays here.',
      'Touch each plank. Each one was a milestone. Say which is which — they have names.',
    ],
    closing: [
      { kind: 'robot', who: 'collier', text: 'Every plank in that hull, I watched this crew earn. There is not one borrowed board in it. Do you know how rare that is? I mend boats. I KNOW.' },
      { kind: 'narration', text: 'The raft is not made of wood. It never was. It is made of thirty-one afternoons this family showed up for.' },
    ],
  },
  ms_load_test: {
    gameId: 'load_test',
    steps: [
      'The raft must be tested with weight before water. Open the Load Test.',
      'One person starts soft — a real complaint, softened startup, the way the Signal Book taught.',
      'The reef catches every "you always." Run it until the hull takes real weight without cracking.',
    ],
    closing: [
      { kind: 'robot', who: 'bailer', text: 'LOAD TEST PASSED! Full weight! No leaks! I stood by with my bucket the whole time and I am THRILLED to report I was unnecessary!' },
      { kind: 'narration', text: 'The raft holds under real weight — a hard thing, said the practiced way, taken the practiced way. That hull is seaworthy.' },
    ],
  },
  ms_letter_bottle: {
    gameId: 'letter_in_the_bottle',
    steps: [
      'Last week on the island. Open the Letter in the Bottle, each person alone.',
      'Write to your family six months from now — what you hope holds, what you\'ll tend.',
      'Seal it. Sealed means sealed; the island keeps it until it\'s ripe. No peeking. Island law.',
    ],
    closing: [
      { kind: 'robot', who: 'hollow', text: '…I will guard them. I am extremely good at keeping things closed until it is time. It is my one superpower and I am finally USING it.' },
      { kind: 'narration', text: 'Four bottles ride the shallows, sealed. Six months from now, a family that kept going will hear from the family that started.' },
    ],
  },
  ms_launch_council: {
    steps: [
      'The last council. Open the Tide Table and read the crossing window together.',
      'Each voice answers: what do we take, what do we leave, what do we promise the water?',
      'Set the launch rituals — the ones that come home with you. The island keeps copies.',
    ],
    closing: [
      { kind: 'robot', who: 'skip', text: 'You\'re taking the RITUALS! And the map! And the rope! And— you\'re taking everything that matters and it all fits because NONE OF IT WEIGHS ANYTHING!' },
      { kind: 'narration', text: 'The council ends the way the wreck began — everyone on the same shore. Different family, same names.' },
    ],
  },
  ms_naming_boat: {
    steps: [
      'Dawn. The raft waits at the west tide line. Open the Far Charts, all hands.',
      'Chart the family you intend to be — one year out, five years out. The boat sails toward it.',
      'Name the boat. Together, out loud, painted on. Boats cross water; names cross years.',
    ],
    closing: [
      { kind: 'robot', who: 'collier', text: '…a good name. A worked-for name. Every boat I ever mended was named for what its crew hoped. Yours is named for what you PROVED. Sail it that way.' },
      { kind: 'robot', who: 'skip', text: 'WAIT. Before you go. Was— was I a good boy? The whole time? …I KNEW IT! Okay! OKAY! You can go! Visit the island whenever the fire needs you!' },
      { kind: 'narration', text: 'The raft takes the water. It holds — of course it holds. Behind it, five small robots wave from the tide line, and the fire on the beach stays lit. It always stays lit. That\'s the island\'s last law: you can come back. The fire remembers the family that built it.' },
    ],
  },
};
