// ═════════════════════════════════════════════════════════════════════════════
//  THE MILESTONE LOG — the 31 survival firsts, five seasons (bible §4).
//  Every milestone is completed only through its conjoint tool — the survival
//  loop IS the therapy delivery. Same engine laws as every world:
//   · the log is optional and exitable at every beat; tools are NEVER gated
//   · crisis surfaces are never instruments
//   · couple/family framings share one engine (framing field, not two logs)
//   · no shame: an unfinished milestone is simply unfinished
// ═════════════════════════════════════════════════════════════════════════════

export type Beat =
  | { kind: 'narration'; text: string }
  | { kind: 'robot'; who: 'skip' | 'hollow' | 'echo2' | 'bailer' | 'collier'; text: string };

export interface Milestone {
  id: string;
  n: number;                   // 1..31
  season: 1 | 2 | 3 | 4 | 5;
  title: string;
  first: string;               // "the survival first" — what gets done on the island
  opening: Beat[];             // short scene (2–4 beats, kid-safe register)
  instrument: {
    toolId: string;            // REAL tool id (family deck or island library)
    toolName: string;
    why: string;               // the in-story reason this tool does this job
    conjoint: boolean;         // true = the conch passes; every present member confirms
  } | null;                    // null = pure story beat
  planks: number;              // the wage (keystones pay more)
}

export interface Season {
  n: 1 | 2 | 3 | 4 | 5;
  name: string;
  arc: string;                 // the clinical arc, honestly named
}

export const SEASONS: Season[] = [
  { n: 1, name: 'THE WRECK',        arc: 'safety & co-regulation' },
  { n: 2, name: 'THE CAMP',         arc: 'structure — roles, boundaries, the family meeting' },
  { n: 3, name: 'THE SIGNAL FIRES', arc: 'connection — bids, rituals, appreciation' },
  { n: 4, name: 'THE STORM RETURNS',arc: 'the cycle — naming the Undertow, repair, the forge' },
  { n: 5, name: 'THE RAFT',         arc: 'integration — the launch, and what the boat is named' },
];

const M = (m: Milestone) => m;

export const MILESTONES: Milestone[] = [
  // ═══ SEASON I · THE WRECK (1–6) — safety & co-regulation ═══
  M({
    id: 'ms_count_heads', n: 1, season: 1,
    title: 'Count Heads',
    first: 'Everyone is found on the beach. Everyone gets counted, out loud, by name.',
    opening: [
      { kind: 'narration', text: 'You wake on sand, in the grey before dawn. One by one, shapes down the tide line stir. The first law of any wreck: count heads before you count losses.' },
      { kind: 'robot', who: 'skip', text: 'FOUND ONE! Found— found ALL of you! Hold still, I\'m counting. I\'m very good at counting. One… one… okay I\'m better at FINDING.' },
      { kind: 'narration', text: 'A little brass robot with too much energy is tugging your sleeve toward the others. Whatever else is true this morning: everyone made it to the same shore.' },
    ],
    instrument: {
      toolId: 'family_map', toolName: 'The Family Map',
      why: 'Count heads properly: put every member of this crew on the map — who\'s here, who\'s connected to whom. A family that can see itself whole has already started.',
      conjoint: false,
    },
    planks: 1,
  }),
  M({
    id: 'ms_high_ground', n: 2, season: 1,
    title: 'High Ground',
    first: 'Before anything else: where does everyone go when big water comes?',
    opening: [
      { kind: 'narration', text: 'The tide is coming in. Before shelter, before food — the crew agrees where HIGH GROUND is: what each person does when a big wave (the real kind, the feelings kind) rolls in.' },
      { kind: 'robot', who: 'bailer', text: 'I bail! That\'s my plan! It\'s always my plan! …The little ones should have a better plan than mine. Everyone should know theirs BEFORE the water, not during.' },
    ],
    instrument: {
      toolId: 'barometer', toolName: 'The Barometer',
      why: 'Take the household\'s first honest pressure reading together, and agree what each person does when the glass drops fast. High ground, chosen in calm water.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_first_fire', n: 3, season: 1,
    title: 'First Fire',
    first: 'The island\'s law, learned the hard way: fires lit alone gutter out.',
    opening: [
      { kind: 'narration', text: 'Three tries alone. Three small flames, guttered. Then two of you kneel at the same pit, and — this is the strange part — when your breathing slows TOGETHER, the ember takes.' },
      { kind: 'robot', who: 'skip', text: 'It\'s the island! It only works TOGETHER, I keep telling everyone! Breathe slow! Same speed! The fire LIKES it!' },
    ],
    instrument: {
      toolId: 'box_breathing', toolName: 'Box Breathing',
      why: 'The fire catches when the crew\'s breath paces align. Sit close, breathe the square together — slow in, hold, slow out, hold — until the ember takes. Co-regulation is the first survival skill.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_fresh_water', n: 4, season: 1,
    title: 'Fresh Water',
    first: 'The spring is found. The first rule of rationing: needs before wants, said out loud.',
    opening: [
      { kind: 'narration', text: 'A spring above the rocks — cold, clean, real. The crew\'s first council is short: what does each of us NEED today, and what merely wants? The island rations honesty before it rations water.' },
      { kind: 'robot', who: 'echo2', text: 'Needs before… wants before… needs? I always mix it up. Say yours slowly so I get it right when I repeat it wrong.' },
    ],
    instrument: {
      toolId: 'family_manifest', toolName: 'The Manifest',
      why: 'Write the first manifest: each person names one real need for this week — sleep, help, time, quiet — and the crew carries them on purpose.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_salvage', n: 5, season: 1,
    title: 'The Salvage',
    first: 'The wreck washed in more than wreckage: the crew inventories what it still HAS.',
    opening: [
      { kind: 'narration', text: 'All morning the tide delivers pieces of the old boat. And something turns when the counting starts: this crew is not empty-handed. It never was. Salvage first, grief later — the inventory of what you still have is the inventory of what you\'ll build with.' },
      { kind: 'robot', who: 'collier', text: '…Mm. Wreck-wood is not dead wood, small ones. Everything that floats ashore can hold a nail again. Same for crews.' },
    ],
    instrument: {
      toolId: 'bottle_post', toolName: 'The Bottle Post',
      why: 'The first salvage is each other: every member posts one bottle naming a strength another member carried through the wreck. Read them at the fire.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_night_watch', n: 6, season: 1,
    title: 'First Night Watch',
    first: 'The first dark. The worries come out with the stars — so the watch writes them down.',
    opening: [
      { kind: 'narration', text: 'Night one. Every worry the day was too busy for arrives at once. The watch-keeper\'s trick, taught by a robot who bails dry boats: write each worry on a leaf, set it in the WATCH PILE, and stand relieved until morning. The pile keeps the watch so you can sleep.' },
      { kind: 'robot', who: 'bailer', text: 'You can\'t bail worries at midnight! Believe me! I\'ve TRIED! You park them. Parked worries wait. Bailed worries splash.' },
    ],
    instrument: {
      toolId: 'worry_parking', toolName: 'The Watch Pile',
      why: 'Park tonight\'s worries — named, dated, given their morning hour. The night watch holds them so the crew can actually sleep. Season I closes with everyone breathing.',
      conjoint: false,
    },
    planks: 2, // keystone — season end
  }),

  // ═══ SEASON II · THE CAMP (7–13) — structure ═══
  M({
    id: 'ms_who_builds_what', n: 7, season: 2,
    title: 'Who Builds What',
    first: 'The camp needs hands. The crew deals out real jobs — by choice, not by habit.',
    opening: [
      { kind: 'narration', text: 'Shelter, water-carry, firewood, the cook-pit. The island\'s second law surfaces at the job-dealing: roles chosen out loud hold; roles assumed silently breed splinters. Who has been carrying what WITHOUT ever being asked?' },
      { kind: 'robot', who: 'hollow', text: '…I always take the wall-building. Nobody asked. Nobody ever asks. That\'s not the same as choosing it. (…is it?)' },
    ],
    instrument: {
      toolId: 'family_manifest', toolName: 'The Manifest',
      why: 'Deal the week\'s real jobs in the open — who carries what, chosen not assumed — and lantern-light the ones that get done. The invisible labor of a family, made visible without a scoreboard.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_walls_door', n: 8, season: 2,
    title: 'The Walls and the Door',
    first: 'The shelter rises: walls keep weather out — and the door is built ON PURPOSE.',
    opening: [
      { kind: 'narration', text: 'A shelter is two lessons in one build. The walls: what this family keeps OUT (the phone at dinner, the third-party opinions, the old fight scripts). The door: what gets let IN, and who decides. Every wall names its builder.' },
      { kind: 'robot', who: 'hollow', text: 'I\'m good at walls. Too good. I built one with no door once. It\'s… it\'s very quiet in there. Build the door FIRST, that\'s my advice.' },
    ],
    instrument: {
      toolId: 'boundary_hoop', toolName: 'The Walls & the Door',
      why: 'Draw the family\'s circle: what stays outside the walls, what comes through the door, and the exact words that hold the line. Hollow\'s lesson: a boundary with no door is a tomb; a door with no walls is weather.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_larder_rules', n: 9, season: 2,
    title: 'The Larder Rules',
    first: 'Food stores need rules everyone made — the first real family meeting.',
    opening: [
      { kind: 'narration', text: 'The larder is stocked; now it needs LAW. The first family meeting convenes at the driftwood table: short, structured, everyone speaks, everything decided gets written. Meetings that work are a technology — most families were never handed it.' },
      { kind: 'robot', who: 'echo2', text: 'I\'ll take minutes! I repeat everything slightly wrong, which is EXACTLY why you should write it down properly yourselves.' },
    ],
    instrument: {
      toolId: 'ships_calendar', toolName: 'The Ship\'s Calendar',
      why: 'Schedule the standing family meeting — a real slot, kept like a tide — and log the first one held. The Gathering is the app\'s whole sync rhythm: this milestone starts it.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_two_huts', n: 10, season: 2,
    title: 'Two Huts or One',
    first: 'The camp layout argument — and the honest map of closeness and distance underneath it.',
    opening: [
      { kind: 'narration', text: 'Where does each person sleep? Together, apart, near, far — the camp layout is the family\'s closeness map drawn in sand. There is no right answer; there is only the HONEST one, and it\'s allowed to be different per person, per season.' },
      { kind: 'robot', who: 'hollow', text: 'Close is warm and loud. Far is quiet and cold. I keep choosing far and wishing someone would visit. …Put THAT on your map.' },
    ],
    instrument: {
      toolId: 'mooring_lines', toolName: 'The Mooring Lines',
      why: 'Chart each person\'s honest closeness-distance settings — the anxious lines that pull tight, the avoidant lines that run long. Knowing your knots is how two huts stay one camp.',
      conjoint: false,
    },
    planks: 1,
  }),
  M({
    id: 'ms_second_language', n: 11, season: 2,
    title: 'The Second Language',
    first: 'Half the crew\'s signals were missing their targets. The island teaches signal-reading.',
    opening: [
      { kind: 'narration', text: 'Skip waves flags nobody reads. Hollow leaves gifts nobody notices. The camp discovers its oldest problem: everyone is SENDING love; not everyone is receiving on that channel. Time to learn each other\'s actual frequencies — the bids, the small reaches, the "watch this."' },
      { kind: 'robot', who: 'skip', text: 'I chase because I MISS people! It never once worked! What if — okay wild idea — what if I just SAID that part?' },
    ],
    instrument: {
      toolId: 'assertiveness', toolName: 'The Signal Book',
      why: 'Build the ask that lands: Describe, Express, Assert, Reinforce — the DEAR MAN script for the thing you keep signaling sideways. Say the missing part out loud, kindly, on purpose.',
      conjoint: false,
    },
    planks: 1,
  }),
  M({
    id: 'ms_storm_proofing', n: 12, season: 2,
    title: 'Storm-Proofing',
    first: 'The ridgepole gets set: the values this camp will NOT trade, whatever the weather.',
    opening: [
      { kind: 'narration', text: 'Any wind can take a tent. What holds a camp through real weather is the ridgepole — the two or three things this family is FOR, chosen together, said out loud, lashed tight. Everything else can flex. The ridgepole doesn\'t.' },
      { kind: 'robot', who: 'collier', text: 'Forge-truth, small ones: metal bends where it isn\'t sure what it\'s for. Same with crews. Decide your iron.' },
    ],
    instrument: {
      toolId: 'values_act', toolName: 'The Ridgepole',
      why: 'Sort what this family is FOR — the values that hold in any weather — from the cargo that just rides along. The ridgepole gets set once, together, and everything else gets built under it.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_map_of_us', n: 13, season: 2,
    title: 'The Map of Us',
    first: 'The camp is standing. The crew maps where it came from — every branch, every knot.',
    opening: [
      { kind: 'narration', text: 'Season II closes at the driftwood table with the biggest chart yet: the family across generations. Who taught whom to argue like that? Where did the silence pattern sail in from? Patterns travel by bloodline until somebody maps them — and a mapped current is a swimmable one.' },
      { kind: 'robot', who: 'echo2', text: 'Your grandmother\'s sayings live in YOUR mouth. I know because I repeat you both. Slightly wrong. But the MATCH is unmistakable.' },
    ],
    instrument: {
      toolId: 'family_map', toolName: 'The Family Map',
      why: 'Draw the whole line: generations, ties, the places patterns crossed the water. The camp that knows its currents stops blaming its swimmers. Season II closes with the map on the wall.',
      conjoint: true,
    },
    planks: 2, // keystone
  }),

  // ═══ SEASON III · THE SIGNAL FIRES (14–19) — connection ═══
  M({
    id: 'ms_appreciation_volley', n: 14, season: 3,
    title: 'Appreciation Volley',
    first: 'The signal fires get lit — starting with the smallest fuel: things noticed out loud.',
    opening: [
      { kind: 'narration', text: 'Season III opens with a game the Jumble invented and takes absurdly seriously: the volley. One appreciation, specific, true, lobbed across the fire. Returned. Kept aloft. The rule: no "thanks for everything" — only "I saw the exact thing you did."' },
      { kind: 'robot', who: 'skip', text: 'RALLY RULES! Specific! True! No fetching compliments back for yourself, that\'s MY bad habit! Go go go!' },
    ],
    instrument: {
      toolId: 'bottle_post', toolName: 'The Bottle Post',
      why: 'Play the volley for real: every member posts specific appreciations — the exact thing, not the general thanks. The jar is the season\'s first signal fire.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_game_night', n: 15, season: 3,
    title: 'Game Night on the Sand',
    first: 'The camp plays — on purpose, on the calendar, no earning it first.',
    opening: [
      { kind: 'narration', text: 'The Jumble is scandalized to learn the crew hasn\'t PLAYED since landfall. Play is not the reward for a finished camp; play is load-bearing. It goes on the calendar like water-carry, or it doesn\'t happen.' },
      { kind: 'robot', who: 'bailer', text: 'I schedule my joy! Tuesdays! People laugh but MY joy actually HAPPENS.' },
    ],
    instrument: {
      toolId: 'ships_calendar', toolName: 'The Ship\'s Calendar',
      why: 'Put play on the tide table — a real game night, scheduled and kept. Fun that isn\'t scheduled is fun that erodes first.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_story_circle', n: 16, season: 3,
    title: 'The Story Circle',
    first: 'The fire gets its true purpose: the crew tells its own history, each voice a chapter.',
    opening: [
      { kind: 'narration', text: 'The Collier wakes long enough to teach the oldest technology on any island: the story circle. Each member tells one true family story — the funny one, the hard one, the one the youngest has never heard. A family is a story it keeps agreeing to tell together.' },
      { kind: 'robot', who: 'collier', text: 'Every crew that lasts, small ones, is a story that got told at enough fires. Start telling yours ON PURPOSE.' },
    ],
    instrument: {
      toolId: 'passage_chart', toolName: 'The Passage Chart',
      why: 'Plot the family\'s real milestones — where you\'ve actually sailed, told around the fire, entered on the chart. The story circle becomes a map the youngest can hold.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_signal_fire', n: 17, season: 3,
    title: 'The Signal Fire',
    first: 'One fire is kept burning ALWAYS — the one that says "reach for me and I\'ll turn."',
    opening: [
      { kind: 'narration', text: 'The crew builds a second, smaller fire that never goes out: the signal fire. Its law is Gottman\'s oldest finding wearing driftwood: when someone makes a bid — "look at this," "sit with me," a sigh aimed at the room — TURNING TOWARD it is what keeps crews alive. The fire is tended daily or it isn\'t a signal fire.' },
      { kind: 'robot', who: 'skip', text: 'A bid is a stick held out! You don\'t have to build a CATHEDRAL! You just have to TAKE THE STICK!' },
    ],
    instrument: {
      toolId: 'daily_rigging', toolName: 'The Daily Rigging',
      why: 'Tend the signal fire as a daily habit: one turned-toward bid per day, logged honestly. Small, daily, compounding — the whole science in one rigging line.',
      conjoint: false,
    },
    planks: 1,
  }),
  M({
    id: 'ms_feast_small_things', n: 18, season: 3,
    title: 'Feast of the Small Things',
    first: 'The camp invents its own holiday — a ritual nobody else on earth has.',
    opening: [
      { kind: 'narration', text: 'The Jumble throws a feast for no reason except that the water-carry got done four days running. And the crew learns ritual-craft: the strongest families run on ceremonies they invented themselves — the pancake protocol, the terrible-joke toast, the Sunday walk. Design yours.' },
      { kind: 'robot', who: 'echo2', text: 'A ritual is a thing you repeat ON PURPOSE! I repeat things by accident and it\'s NOT the same, believe me.' },
    ],
    instrument: {
      toolId: 'tide_table', toolName: 'The Tide Table',
      why: 'Design a ritual that belongs to THIS family only — its name, its trigger, its tiny ceremony — and set it returning like a tide.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_quiet_cove', n: 19, season: 3,
    title: 'The Quiet Cove',
    first: 'Pairs rotate through the cove — every two-person bond gets its own hour.',
    opening: [
      { kind: 'narration', text: 'Season III closes on the island\'s gentlest law: a family is not one relationship; it is every PAIR inside it. The quiet cove takes two at a time — parent and kid, partner and partner, sibling and sibling — for an hour that belongs to that pair alone. The rotation is the point: every line in the family gets tended, not just the loudest.' },
      { kind: 'robot', who: 'hollow', text: 'Two at a time I can DO. Whole crowds shut my shell. …Most people have a shell, they just hide it better than I do.' },
    ],
    instrument: {
      toolId: 'ships_calendar', toolName: 'The Ship\'s Calendar',
      why: 'Schedule the cove rotation: one pair, one hour, protected like a tide. Log the first one held. Season III closes with every line in the family lit.',
      conjoint: true,
    },
    planks: 2, // keystone
  }),

  // ═══ SEASON IV · THE STORM RETURNS (20–26) — the cycle ═══
  M({
    id: 'ms_naming_undertow', n: 20, season: 4,
    title: 'Naming the Undertow',
    first: 'The storm comes back — and the crew finally maps the current under every fight.',
    opening: [
      { kind: 'narration', text: 'It starts over nothing — firewood stacking — and in four exchanges two of the crew are drowning in the oldest current on the island. That night, Skip and Hollow ask for help with THEIR loop: Skip chases, Hollow seals, Skip chases harder, Hollow seals deeper. The crew maps it for the robots… and the map looks terribly familiar.' },
      { kind: 'robot', who: 'skip', text: 'When he closes up I get LOUD and fetch-y and worse, and the louder I get the more closed he— …oh. OH. Are we… is this a THING other crews do?' },
      { kind: 'robot', who: 'hollow', text: '(from inside the shell, very quietly) …nobody is the problem. The CURRENT is the problem. Say that part again.' },
    ],
    instrument: {
      toolId: 'undertow_chart', toolName: 'The Undertow Chart',
      why: 'THE KEYSTONE. Map your family\'s own current: the spark, the chase, the seal, the soft feeling underneath each armor, the true need at the bottom. Nobody is the problem; the pattern is — and a mapped current is swimmable.',
      conjoint: true,
    },
    planks: 2, // the crown milestone pays like a keystone
  }),
  M({
    id: 'ms_who_chases', n: 21, season: 4,
    title: 'Who Chases, Who Hides',
    first: 'Each crew member finds their own move in the current — without shame, without exile.',
    opening: [
      { kind: 'narration', text: 'With the Undertow mapped, each member does the braver, smaller thing: finds THEIR OWN move in it. The chaser\'s chase is love with the volume broken. The hider\'s shell is safety learned young. No move is villainy; every move once made sense.' },
      { kind: 'robot', who: 'hollow', text: 'My shell kept me safe in the shipping crate. It\'s allowed to have been useful AND be in the way now. Both. At once.' },
    ],
    instrument: {
      toolId: 'mooring_lines', toolName: 'The Mooring Lines',
      why: 'Re-chart your lines now that the current is named: which way do YOU move under pressure, and what soft thing is that move protecting? Compassion for the move is the price of changing it.',
      conjoint: false,
    },
    planks: 1,
  }),
  M({
    id: 'ms_speakers_shell', n: 22, season: 4,
    title: 'The Speaker\'s Shell',
    first: 'The conch arrives: whoever holds it, speaks; everyone else turns toward.',
    opening: [
      { kind: 'narration', text: 'The sea delivers a conch shell the size of two hands, and the Collier declares the oldest parliament: whoever holds the shell speaks without interruption. On this island — and this is the trick — THE PHONE IS THE CONCH: pass the device, and the holder\'s voice is the only one.' },
      { kind: 'robot', who: 'echo2', text: 'When you hold the shell I can\'t repeat over you! It\'s AGONY! It\'s also… probably the point.' },
    ],
    instrument: {
      toolId: 'soundings', toolName: 'The Soundings',
      why: 'Hold the conch in turns and take the seven-waters reading together — each person answers for themselves, uninterrupted, phone passed hand to hand. The first full sounding taken as a parliament.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_repair_rope', n: 23, season: 4,
    title: 'Repair Rope',
    first: 'The crew braids the rope that gets thrown DURING the storm, not after.',
    opening: [
      { kind: 'narration', text: 'Rope work today: short lines, braided in calm water, thrown in rough. "I\'m getting loud — I need a minute, I\'m not leaving." "Can we start over?" "You matter more than this argument." A repair line only works if it was braided BEFORE the wave.' },
      { kind: 'robot', who: 'skip', text: 'MY rope says "I\'m chasing because I\'m scared, not mad." Hollow braided it FOR me. I keep it in my chest hatch.' },
    ],
    instrument: {
      toolId: 'mending_bench', toolName: 'The Mending Bench',
      why: 'Braid your family\'s real repair lines — the exact phrases that reach each member mid-storm — and keep them where a wave can\'t wash them off.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_apology_forge', n: 24, season: 4,
    title: 'The Apology Forge',
    first: 'The Collier\'s forge relights — and broken things get mended VISIBLY.',
    opening: [
      { kind: 'narration', text: 'The old forge-keeper wakes fully the day the crew relights his forge, and teaches the kintsugi law of the island: mended things are stronger at the seam, and the seam SHOWS, proudly. An apology is a forging: name the break, feel its heat honestly, shape the repair, and let the join be visible forever.' },
      { kind: 'robot', who: 'collier', text: 'Any fool can hide a crack, small ones. Crews that LAST are the ones that gild them.' },
    ],
    instrument: {
      toolId: 'undertow_chart', toolName: 'The Undertow Chart',
      why: 'Forge one real repair: take a recent break to the chart, walk its cycle honestly, and write the repair script — the named hurt, the owned part, the changed thing. The seam stays visible; that\'s the strength.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_flooded_camp', n: 25, season: 4,
    title: 'The Flooded Camp',
    first: 'A storm takes the cook-pit — and the crew learns the PAUSE signal.',
    opening: [
      { kind: 'narration', text: 'Real weather, real flood, and the crew discovers mid-argument that you cannot bail and fight at once. The island installs its pause law: any member may call WATER RISING — the agreed signal that means twenty minutes, separate tasks, hearts below a hundred, then return. Calling it is seamanship, not surrender. The RETURN is the promise.' },
      { kind: 'robot', who: 'bailer', text: 'Twenty minutes! Timed! I\'ll hold the timer! Flooded decks make TERRIBLE meeting rooms, I have MINUTES on this!' },
    ],
    instrument: {
      toolId: 'barometer', toolName: 'The Barometer',
      why: 'Install the pause: agree the WATER RISING signal, the twenty-minute rule, and the promised return — then log the storm-reading honestly. Flooding is physiology, not failure.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_riding_it_out', n: 26, season: 4,
    title: 'Riding It Out Together',
    first: 'The season\'s last storm is ridden, start to finish, with every tool on the belt.',
    opening: [
      { kind: 'narration', text: 'Season IV closes with weather the crew doesn\'t dodge: a real disagreement, taken ON PURPOSE, with the whole kit — the named current, the conch, the ropes, the pause. Not to win it. To ride it together and come out the far side still a crew. The Undertow doesn\'t die; it becomes crossable.' },
      { kind: 'robot', who: 'hollow', text: 'Shell stayed OPEN the whole storm. Four minutes. …New record. (Skip cried. Don\'t tell Skip I told you.)' },
    ],
    instrument: {
      toolId: 'mending_bench', toolName: 'The Mending Bench',
      why: 'Ride one real wave with the kit and log the repair that closed it — what was said, what was thrown, what held. Season IV closes with the current crossed, on purpose, together.',
      conjoint: true,
    },
    planks: 2, // keystone
  }),

  // ═══ SEASON V · THE RAFT (27–31) — integration ═══
  M({
    id: 'ms_every_plank', n: 27, season: 5,
    title: 'Every Plank Has a Name',
    first: 'Raft-building begins — from the season\'s own planks, each one read aloud.',
    opening: [
      { kind: 'narration', text: 'The raft goes together from everything the crossing earned: every plank is a milestone this crew actually closed, and each one gets read aloud at the laying — remember the first fire? The larder rules? The night the current got named? The reward economy IS the story\'s ending: you built the boat all along.' },
      { kind: 'robot', who: 'echo2', text: 'I remember ALL of it! Slightly wrong! "The night the current got FAMOUS!" …close enough, WRITE IT DOWN.' },
    ],
    instrument: {
      toolId: 'passage_chart', toolName: 'The Passage Chart',
      why: 'Read the history back: enter the crossing\'s real milestones on the chart, in the crew\'s own words. The raft is only as true as its named planks.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_load_test', n: 28, season: 5,
    title: 'The Load Test',
    first: 'Before launch: the raft carries the HEAVIEST cargo once, on purpose, in the shallows.',
    opening: [
      { kind: 'narration', text: 'No crew launches untested. The load test is the hard conversation the family has been sailing around — rehearsed first in the shallows, with the conch, the ropes, and the pause all rigged. Say the heavy thing where the water is knee-deep. That\'s what shallows are FOR.' },
      { kind: 'robot', who: 'collier', text: 'Test in the shallows, small ones. Deep water is a terrible place to learn your knots.' },
    ],
    instrument: {
      toolId: 'undertow_chart', toolName: 'The Undertow Chart',
      why: 'Rig the hard conversation before having it: chart where its current will pull, choose the ropes, agree the pause. Then hold it in the shallows — rehearsed brave beats ambushed brave.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_letter_bottle', n: 29, season: 5,
    title: 'The Letter in the Bottle',
    first: 'Each member writes to the family a year out — sealed, launched, trusted to the tide.',
    opening: [
      { kind: 'narration', text: 'The Jumble\'s launch-gift: bottles, one per member. Inside, a letter to this same family one year from now — what today-you wants remembered when the weather argues. The tide delivers these. It always has.' },
      { kind: 'robot', who: 'skip', text: 'I\'ll fetch them back at the PERFECT moment! Fetching things at the perfect moment is my ONE skill and I\'m MAGNIFICENT at it!' },
    ],
    instrument: {
      toolId: 'future_letter', toolName: 'The Letter in the Bottle',
      why: 'Write to the family a year out — each member their own letter, sealed today. Kindness from your own crew\'s hands still counts. Especially then.',
      conjoint: false,
    },
    planks: 1,
  }),
  M({
    id: 'ms_launch_council', n: 30, season: 5,
    title: 'The Launch Council',
    first: 'The last council: what does this family take off the island — and what does it leave?',
    opening: [
      { kind: 'narration', text: 'The night before launch, the driftwood table hosts its last parliament. Two lists by firelight: what this crew TAKES (the meeting, the cove, the ropes, the pause, the fire law) and what it LEAVES (the silent roles, the unread signals, the scorekeeping). Said aloud. Written down. Witnessed by robots.' },
      { kind: 'robot', who: 'bailer', text: 'I\'m keeping your old scorekeeping! I\'ll bail it somewhere DEEP. It\'s the one cargo I\'m glad to sink.' },
    ],
    instrument: {
      toolId: 'tide_table', toolName: 'The Tide Table',
      why: 'Set the rituals that sail home with you — the ones this island taught, written as standing tides. The take-list is a design document for the family you\'re choosing to be.',
      conjoint: true,
    },
    planks: 1,
  }),
  M({
    id: 'ms_naming_boat', n: 31, season: 5,
    title: 'The Naming of the Boat',
    first: 'The launch — and the reveal the whole crossing was building toward.',
    opening: [
      { kind: 'narration', text: 'Dawn. The raft sits at the tide line, every plank named, and the Collier — who has not stood fully upright in years — stands to speak the island\'s last lesson: "Look at what you\'re standing on, small ones. Driftwood. The wreck of the thing that broke you, rebuilt into the thing that carries you. That was always the assignment."' },
      { kind: 'robot', who: 'collier', text: 'A family is not the boat that sank. It\'s what they build from it. …Now name your boat, and GO. Somebody out there is waiting to see it float.' },
      { kind: 'narration', text: 'From the ridge, the whole Jumble waves — and far out, crossing the horizon, a ship with bone-white letters on its hull dips its colors once. High in its crow\'s nest, a small figure raises a lantern. The family was the somebody. The vote to launch is unanimous. The name goes on the bow — that part belongs to your family alone.' },
    ],
    instrument: {
      toolId: 'life_vision', toolName: 'The Far Charts',
      why: 'Name the boat by charting where it sails: the family ten years out, an ordinary Tuesday of it, drawn in real detail together. Blank futures get filled by drift or by drawing. This crew draws.',
      conjoint: true,
    },
    planks: 3, // the finale
  }),
];

// Season keystones (the last milestone of each season) drop the curtain.
export const isSeasonEnd = (m: Milestone) =>
  MILESTONES.filter(x => x.season === m.season).slice(-1)[0]?.id === m.id;

export const STORY_LAWS = {
  storySkippable: true,
  toolsNeverGated: true,
  crisisNeverInstruments: true,
  noShame: true,
} as const;
