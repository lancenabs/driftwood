// ═════════════════════════════════════════════════════════════════════════════
//  THE MILESTONE LOG — the 31 survival firsts, five seasons (bible §4).
//  Every milestone is completed only through its conjoint tool — the survival
//  loop IS the therapy delivery. Same engine laws as every world:
//   · the log is optional and exitable at every beat; tools are NEVER gated
//   · crisis surfaces are never instruments
//   · couple/family framings share one engine (framing field, not two logs)
//   · no shame: an unfinished milestone is simply unfinished
// ═════════════════════════════════════════════════════════════════════════════

// THE BRANCHING SPINE (ported from the Voyager's season engine, 2026-07-12):
// `choice` beats let the family decide and the story remember (flags in
// driftwood_story_choices_v1); `when` renders a beat only on a matching flag.
// The full story rewrite (THE_DRIFTWOOD_STORY_BIBLE.md) builds on this.
export interface BeatCondition { flag: string; is: string }

export type Beat =
  | { kind: 'narration'; text: string; when?: BeatCondition }
  | { kind: 'robot'; who: 'skip' | 'hollow' | 'echo2' | 'bailer' | 'collier'; text: string; when?: BeatCondition }
  | { kind: 'choice'; id: string; prompt: string; when?: BeatCondition;
      options: { id: string; label: string }[] };

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
      { kind: 'narration', text: 'Day one. The family walks the beach shouting for Mr. Bauer until their voices go ragged. No guide. No wreckage worth a signal. No boats on any horizon. The compass still points inland, and nobody wants to say what nobody is saying: there is no help coming. Whatever happens next, they are it.' },
      { kind: 'narration', text: 'And then — by the jumble of driftwood at the treeline — a log MOVES. Stands up. It has legs made of branch-wood, a chest of weathered plank, two round eyes like knots in pine, and it is holding a small crab like a shield.' },
      { kind: 'robot', who: 'skip', text: 'AAAAAH! …wait. AAAAH! No — hold on — I practiced this— DO NOT EAT ME. I am ninety percent driftwood and ten percent regret and I taste TERRIBLE, ask the crab.' },
      { kind: 'narration', text: 'The family screams. The robot screams. The crab, released, walks away from the entire situation. For nine full seconds, four humans and one small wooden machine stare at each other across the sand, all five of them absolutely certain they are the one in danger.' },
      { kind: 'choice', id: 's1_first_meeting', prompt: 'A talking driftwood robot. Terrified of you. Someone has to move first.',
        options: [
          { id: 'kneel', label: 'Kneel down slowly — get small, get safe' },
          { id: 'speak', label: 'Speak first — "we\'re shipwrecked. we need help."' },
        ] },
      { kind: 'narration', when: { flag: 's1_first_meeting', is: 'kneel' }, text: 'The tallest of you kneels — slow, palms open, the way you approach anything small that could bolt. The robot watches. Then, very carefully, he kneels TOO, which is not how any of this works, and somehow that is the moment everyone stops being scared.' },
      { kind: 'narration', when: { flag: 's1_first_meeting', is: 'speak' }, text: '"We\'re shipwrecked," someone says, hands up. "Our guide is gone. We need help." The robot\'s knot-eyes go from face to face — and stop on the youngest, who waves. A small wooden hand, entirely without permission from its owner, waves back.' },
      { kind: 'robot', who: 'skip', text: '…You\'re a FAMILY. We saw you land. We watched from the trees — we watch everything that washes in. And we heard you on the beach yesterday. The loud voices. The words you threw.' },
      { kind: 'narration', text: 'The little robot straightens up to his entire unimpressive height, and delivers what is obviously a rehearsed line from somebody older:' },
      { kind: 'robot', who: 'skip', text: 'The Jumble does not help storms. And a family that talks to each other like weather… is a storm. I\'m sorry. I\'m not allowed. I\'m— I\'m really sorry. You seem nice when you\'re not shouting.' },
      { kind: 'narration', text: 'And he is gone into the treeline, quick as the crab. The family stands in the wash of it — judged by a piece of driftwood, and (this is the part that stings) not wrongly. Tonight: count heads, hold together, start from what is TRUE. Everyone made this shore. That is not nothing. That is, in fact, everything.' },
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
      { kind: 'narration', text: 'The first shelter is three palm fronds and an argument. It falls down twice. The second time, nobody blames anybody, which on this beach counts as a miracle worth logging. From the treeline, unseen, small knot-eyes watch the family try.' },
      { kind: 'robot', who: 'bailer', text: '(from somewhere in the leaves, allegedly to Skip, definitely audible) They\'re doing it WRONG. The lean-to goes AGAINST the wind— no. No! We do not help storms. Stop LOOKING at me like that, Skip.' },
      { kind: 'narration', text: 'The tide is coming in — the water kind tonight, the feelings kind soon enough. Before shelter, before food, the family agrees where HIGH GROUND is: what each person does when a big wave rolls in. Because the next storm on this island will not be made of weather.' },
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
      { kind: 'narration', text: 'Night two. No fire. Three tries, three guttered flames, and the cold coming in off the water like it has a key to the place. The youngest is shivering. The argument starts the way it always starts — whose fault, whose job — and then stops, because a small wooden shape steps out of the dark carrying dry tinder in both branch-arms.' },
      { kind: 'robot', who: 'skip', text: 'I\'m not helping! This is NOT helping. This is… littering. In your direction. Cold kids override the rules — that one\'s MY rule, I just made it, don\'t tell the Collier.' },
      { kind: 'narration', text: 'He shows them the trick of it — the nest of fibers, the patient breath, slower, slower — and leans close to demonstrate, and the ember catches all at once. Beautifully. Onto his hand.' },
      { kind: 'robot', who: 'skip', text: 'oh. OH. FIRE. I\'M THE FIRE NOW. THIS IS WHY WE HAVE RULES—' },
      { kind: 'narration', text: 'What happens next takes four seconds and no discussion: one of you snatches him up, one scoops wet sand, two pairs of hands smother the little burning fist together — four humans moving as ONE THING for the first time since the dock. The flame dies. The hand is charred at the knuckles. The robot stares at it, then at the circle of terrified faces around him, and his knot-eyes do something wooden eyes should not be able to do.' },
      { kind: 'robot', who: 'skip', text: '…You saved me. I\'m FLAMMABLE, that\'s the whole reason we don\'t DO fire rescue, it\'s in the SONG we sing about it — and you just— all four of you, at the same time— (very quietly) The Jumble is wrong about you. Storms don\'t put things out.' },
      { kind: 'narration', text: 'He sits with them at their fire — THEIR fire, the one that finally caught — until the youngest falls asleep. In the morning he is back, hand bandaged in palm-leaf, standing very formally on a piece of driftwood to be taller, with news.' },
      { kind: 'robot', who: 'skip', text: 'I asked. I argued! I told them about the sand and the hands. And the Elders said: rules are rules — the Jumble helps FAMILY, and family is EARNED. Thirty-one challenges. The same ones every one of us passed to become Jumble. Finish them and you\'re not strangers we\'re helping. You\'re one of us — and we get you HOME. All of you. I already signed as your sponsor. It\'s me. I\'m the sponsor. I may have signed before asking them, please do well.' },
      { kind: 'choice', id: 's1_the_pledge', prompt: 'Thirty-one challenges to earn a family of robots — and a way home. The family answers as one:',
        options: [
          { id: 'together', label: '"We\'ll do it. Together."' },
          { id: 'skeptic', label: '"Fine — but this is ridiculous." (someone says it with love)' },
        ] },
      { kind: 'narration', when: { flag: 's1_the_pledge', is: 'together' }, text: 'Together. The word lands in the middle of the family like the first plank of something. Skip writes it — laboriously, tongue-out, in charcoal on a plank: CHALLENGE LOG — THEM. He underlines THEM twice.' },
      { kind: 'narration', when: { flag: 's1_the_pledge', is: 'skeptic' }, text: '"This is ridiculous," someone mutters, and someone else laughs — the first laugh since the boat — and Skip solemnly writes RIDICULOUS. BUT IN. at the top of a charcoal plank, and that is somehow the truest contract this family has signed in years.' },
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
      { kind: 'narration', text: 'Skip appears at dawn with his bandaged hand and an enormous secret he is terrible at keeping. "I know where water is. I am NOT showing you. Follow me while I don\'t show you."' },
      { kind: 'robot', who: 'skip', text: 'Rules say I can\'t bring you INTO Jumble country. But the spring is on the EDGE of Jumble country. I checked the map. I made the map. It\'s a good map.' },
      { kind: 'narration', text: 'A spring above the rocks — cold, clean, real. And around it, half-hidden in the green: little wooden markers, carved with care. Cups sized for branch-hands. Someone taught the robots to share a spring long ago. The family\'s first council is short: what does each of us NEED today, and what merely wants? The island rations honesty before it rations water.' },
      { kind: 'robot', who: 'bailer', text: '(from behind a rock, pretending not to be there) Tell them needs go FIRST. Wants go in the... the second bucket. The man taught us that. (a pause, then, horrified at himself) NOBODY said "the man." Nobody heard "the man."' },
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
      { kind: 'narration', text: 'All morning the tide delivers pieces of the old boat. And something turns when the counting starts: this family is not empty-handed. It never was. Salvage first, grief later — the inventory of what SURVIVED.' },
      { kind: 'narration', text: 'Then the youngest finds it, wedged under a hull plank: Mr. Bauer\'s tackle box. Latched, dry inside. Fishing line, hooks, a fire-steel, a folded photograph gone soft with salt — a family, but not YOUR family. Four faces, sun-squinting, on a boat. On the back, one word in pencil: "us."' },
      { kind: 'choice', id: 's1_tackle_box', prompt: 'Mr. Bauer\'s tackle box, and someone else\'s family in a photograph. What does yours do with it?',
        options: [
          { id: 'use', label: 'Use the tools — he\'d want them keeping you alive' },
          { id: 'cairn', label: 'Build a cairn for the box — tools borrowed, photo kept safe' },
        ] },
      { kind: 'narration', when: { flag: 's1_tackle_box', is: 'use' }, text: 'The vote is quiet and unanimous: Bauer lashed your hands to a line so you\'d live. The tools go to work — the line to the fishing rocks, the fire-steel to the pit keeper. The photograph gets a dry pocket and a promise: whoever "us" is, the box goes back to him. Somehow.' },
      { kind: 'narration', when: { flag: 's1_tackle_box', is: 'cairn' }, text: 'You build the cairn above the tide line, borrow the tools one at a time like library books, and set the photograph inside facing the sea. The youngest asks who they are. Nobody knows. "Somebody\'s us," says the oldest, and that answer holds all season.' },
      { kind: 'robot', who: 'hollow', text: '(the tall quiet one, first words to the family, from a distance) …He kept that box on his knee, crossings back. Log what washed in. All of it. What survives a wreck is never random. It\'s what was HELD tightest.' },
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
      { kind: 'narration', text: 'Night one of real watches. Every worry the day was too busy for arrives at once, the way worries do — in a crowd, after dark. The watch-keeper\'s trick, taught by a robot who bails dry boats: write each worry on a leaf, set it in the WATCH PILE, and stand the watch on what is actually in front of you.' },
      { kind: 'robot', who: 'bailer', text: 'I stood four thousand watches before I learned it. The water you\'re bailing is usually TOMORROW\'S water. Tonight\'s boat is dry. Look — dry! Bail tomorrow tomorrow.' },
      { kind: 'narration', text: 'Past midnight, the watch-keeper sees them: small lights in the treeline, paired like eyes, keeping their own vigil. The Jumble stands watch over the family that is standing watch. Nobody official announces this. It is simply true from now on, the way the best protections are.' },
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
      { kind: 'narration', text: 'Season two opens with an invitation nobody expected: Skip, scrubbed and standing at attention, flanked by a robot built like a furnace with hands like anvils. The Collier. He looks at the family the way a master builder looks at warped lumber — skeptically, but already planning.' },
      { kind: 'robot', who: 'collier', text: 'The little one vouches for you. The little one also once vouched for a seagull. So. The Elders say: one hut of the village opens for every trust you earn. Today you earn the FIRST — by showing us a family that deals its work OUT LOUD. Shelter, water-carry, firewood, cook-pit. Silent assumptions breed splinters. I have pulled enough splinters.' },
      { kind: 'robot', who: 'skip', text: '(whispering, thrilled) That\'s the nicest thing he\'s said about anyone since the seagull.' },
      { kind: 'narration', text: 'Who has been carrying what without ever being asked? The job-dealing goes on the driftwood table, face up. And when it\'s done — dealt, spoken, agreed — the Collier walks the family up the jungle path to a clearing where little driftwood houses stand in a ring, and pushes open the first door.' },
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
      { kind: 'narration', text: 'In the village ring, the family meets Echo-2 — a slender robot with a radio-dish face who repeats what you say back to you, half a shade kinder. The Jumble\'s rules live on a post in the ring\'s center, burned into a plank. Rule one: NEVER LIE BY THE FIRE. Rule two: WHOEVER HOLDS THE CONCH IS HEARD TO THE END. Rule three: REPAIRS BEFORE VERDICTS.' },
      { kind: 'robot', who: 'echo2', text: 'The walls of a shelter and the walls of a family are the same build. What do you keep OUT? (she waits) …Phones at dinner. Old fight scripts. Other people\'s opinions of your people. And the DOOR — who decides what comes in? Build it out loud, and the hut is yours tonight.' },
      { kind: 'narration', text: 'Every plank spoken for. The walls: what this family keeps out. The door: what gets let in, and who decides. Echo-2 listens to the whole negotiation and repeats back only the kindest sentence anyone said, which turns out to be a whole education in what to say more of.' },
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
      { kind: 'narration', text: 'The larder hut opens — and Bailer is ALREADY IN IT, mid-count, surrounded by the most organized shelves on the island. He has counted everything. He has counted things that cannot be counted. There is a shelf labeled "MISC. DREAD (4)."' },
      { kind: 'robot', who: 'bailer', text: 'RULES OF THE LARDER. One: needs before wants — the man taught— A ROBOT taught us that, an anonymous robot. Two: nobody eats the last of anything alone; last-of-anything is a FAMILY food. Three: whoever is hungriest gets believed. We learned rule three the hard way. There is a song about it. There will not be a performance.' },
      { kind: 'narration', text: 'The family writes its own larder rules under the Jumble\'s — needs and wants, out loud, and the discovery every stocked shelf makes possible: this family has ENOUGH, when the counting is honest. Enough was never the problem. The counting was.' },
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
      { kind: 'narration', text: 'Where does each person sleep? Together, apart, near, far — the camp layout is the family\'s closeness map drawn in sand. There is no right answer; there is only the HONEST one, and it\'s allowed to change.' },
      { kind: 'robot', who: 'skip', text: 'Want to see ours? (he does not wait for an answer) The Jumble bunks in a spiral — closest to the fire is whoever had the hardest day, farthest is whoever needs the quiet, and we re-draw it EVERY night at gong. Nobody\'s spot means anything about being loved. The spiral is about TODAY. Hollow slept fire-side nine nights straight once and nobody said a word about it.' },
      { kind: 'robot', who: 'hollow', text: '…Ten nights. And they left shells by my bunk. Every morning. Nobody ever admitted it.' },
      { kind: 'choice', id: 's2_spiral', prompt: 'The Jumble re-draws their closeness every night. Does the family adopt the spiral?',
        options: [
          { id: 'adopt', label: 'Adopt it — hardest day sleeps nearest the fire' },
          { id: 'own', label: 'Draw your own map — honest, in your family\'s shape' },
        ] },
      { kind: 'narration', when: { flag: 's2_spiral', is: 'adopt' }, text: 'The spiral comes to camp. The first night, nobody will admit to the hardest day — so the youngest assigns it, with terrifying accuracy, and the right person sleeps warm. The spiral knows. The spiral always knows.' },
      { kind: 'narration', when: { flag: 's2_spiral', is: 'own' }, text: 'Your family draws its own shape in the sand — not the Jumble\'s spiral, yours — and Skip studies it for a long time and then copies it into his charcoal log under the heading OTHER GOOD SHAPES. The village has been collecting family-shapes for years, it turns out. All of them count.' },
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
      { kind: 'narration', text: 'It starts with a squeak. Skip\'s elbow, dry as a hinge in a drought — and the Collier, without a word, crossing the whole ring to oil it. Skip lights up like a lantern.' },
      { kind: 'robot', who: 'skip', text: 'The Jumble has five oils! Everybody runs best on a different one. The Collier\'s is FIXING things for you — he never says a nice word, he just re-shingles your roof at dawn. Bailer\'s is counted time — sit with him while he counts and he\'s HAPPY. Echo-2 needs the words out loud. Hollow needs the shells — little gifts, no note. And mine is— (he goes shy) —mine\'s when somebody just… stays nearby. That\'s the whole oil. Nearby.' },
      { kind: 'narration', text: 'The question lands on the family like a dropped conch: which oil does each of YOU run on? Wrong-oiling is the loneliest maintenance there is — years of faithful effort, poured into the wrong hinge. Today the family learns each other\'s.' },
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
      { kind: 'narration', text: 'The Collier calls it weather-sense: the village storm-proofs on the CALM days, because lashing a roof in the wind is just expensive praying. The family works the camp — extra lashings, deeper stakes, the fire\'s dry-store — and it\'s the oldest who finds it, scouting deadfall up the north path.' },
      { kind: 'narration', text: 'A campsite. Old. Cold. A stone ring gone green, a lean-to collapsed into its own bones — and driven into the log beside the fire ring, waiting years for a hand its size: a knife. Bone-handled, sea-rusted, and along the flat of the blade, scratched deep and deliberate: M. BAUER.' },
      { kind: 'robot', who: 'skip', text: '(gone very still, both hands around his bandaged one) …That\'s the quiet camp. We don\'t play there. The Elders say it belongs to the Before. (a long pause) I don\'t know what the Before is. Whenever I ask, the Collier oils something that isn\'t squeaking.' },
      { kind: 'choice', id: 's2_knife', prompt: 'Mr. Bauer\'s knife — YEARS old, in an island campsite. He has been here before. What now?',
        options: [
          { id: 'follow', label: 'Follow the overgrown trail past the camp — now' },
          { id: 'mark', label: 'Mark it on the map, storm-proof first — the island keeps its secrets one more night' },
        ] },
      { kind: 'narration', when: { flag: 's2_knife', is: 'follow' }, text: 'The trail runs inland, toward the falls — and dies at a rockslide older than the trail. Whatever Bauer walked toward, the island closed the road years ago. The compass in camp, when you check it that night, still points the same way. Patient as a held breath.' },
      { kind: 'narration', when: { flag: 's2_knife', is: 'mark' }, text: 'The knife goes on the map — a careful X and the words THE QUIET CAMP — and the family finishes the storm-proofing by dusk, which matters more than anyone knows yet. Some doors keep. The compass points at this one all night, like it approves of the patience.' },
      { kind: 'narration', text: 'That night, the fire burns with the tackle box\'s fire-steel and the storm-lashings hold in the first hard gusts of the season. Bauer\'s tools keeping Bauer\'s tour alive. Wherever the trail goes, it goes THROUGH this family now.' },
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
      { kind: 'narration', text: 'Season two closes in the village\'s longest hut — the one the Jumble calls the Remembering House. The family is invited in for the first time. The walls are carved, floor to eave: robot history, panel by panel, in patient knife-work.' },
      { kind: 'narration', text: 'And in every early panel: a MAN. Broad hands. A tackle box. Carving robots out of storm-wreck driftwood, one by one — teaching them fire, teaching them the spiral, teaching them the five oils. In the last panel of the row he stands with seven small figures around him, and the carver has worked the wood so the man\'s face is turned away. Toward the sea.' },
      { kind: 'robot', who: 'echo2', text: '(quietly, watching the family look) Every family has panels like these. Who taught whom to argue like that? Where did the silence pattern sail in from? Patterns travel bloodlines like currents travel water. Tonight you carve YOUR panels — the family across generations — and you get to mark which patterns land with you, and which ones you leave in the water.' },
      { kind: 'narration', text: 'Nobody asks the Jumble who the man is. Not yet. Some questions you carry until they\'re ripe. But the youngest, on the way out, stops at the turned-away face and — very gently, when the robots aren\'t looking — touches the carved tackle box with one finger. It is exactly the same box. Down to the latch.' },
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
      { kind: 'narration', text: 'Season three opens with the strangest sound the island has made yet: laughing. The camp works now — water, walls, the fire that takes on the first breath. And into the ease walks Skip, carrying a woven ball with the ceremony of a crown.' },
      { kind: 'robot', who: 'skip', text: 'THE VOLLEY BALL. Not volleyball — the VOLLEY ball. Jumble rules: you can\'t hold it. You catch it, you say one true good thing about the thrower, you throw it on. Holding it too long is called HOARDING THE WARM and Bailer will make the noise.' },
      { kind: 'robot', who: 'bailer', text: '(demonstrating the noise. It is somehow both a foghorn and a disappointed aunt.)' },
      { kind: 'narration', text: 'The ball goes up. And the family discovers what the Jumble learned long ago: appreciation, in motion, with a timer, is a GAME — and games get played, where speeches get postponed. The specific ones land hardest. "You always check the fire last" beats "you\'re great" every single throw.' },
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
      { kind: 'narration', text: 'The Collier — THE COLLIER — arrives at the family fire carrying a driftwood box with a hinged lid, and the entire Jumble goes silent the way a town goes silent when the bank opens its vault.' },
      { kind: 'robot', who: 'collier', text: 'Game night. Village law: once a week, all work stops. This box is older than any of us — HE built it before he built the first — (a pause, a re-route) —it was built. Long ago. Shell-toss, sand-nine, the memory game with the terrible penalties. Tonight your family hosts. Do not let Bailer bank the shells. He counts cards. He IS cards.' },
      { kind: 'robot', who: 'skip', text: '(whispering) You\'re getting GAME NIGHT. It took the seagull two years to get game night.' },
      { kind: 'narration', text: 'The lesson hides inside the fun, where the best ones live: a family that plays together builds a bank of light moments to spend on the heavy ones. Tonight the island collects deposits. The penalties ARE terrible. The youngest wins everything.' },
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
      { kind: 'narration', text: 'The morning of story circle, the tide brings a guest: a green glass bottle, wax-sealed, riding the swell into the cove like it had the address. Inside — two letters, salt-stiff, in two different hands.' },
      { kind: 'narration', text: 'The first is from a boy named Chip, to an island, to a workshop, to a father: thank-you words from someone who made it. The second is stranger — a captain, writing to their own future self: "there will be hard weeks; this is what today proves." At the bottom, under both signatures, a line in the boy\'s hand: "If a family finds this — the crew says: keep each other. It\'s the whole trick. — C."' },
      { kind: 'robot', who: 'hollow', text: '…Other crews. Other water. Same trick. (he holds the bottle up to the light a long time) Put it on the story shelf. Tonight the circle goes around and every voice tells one: the hardest crossing you ever made, and who kept you. The bottle proves the genre. Your family proves the sequel.' },
      { kind: 'choice', id: 's3_bottle', prompt: 'Two letters from another world\'s crossing. After the circle, what does the family do with them?',
        options: [
          { id: 'answer', label: 'Write back — seal your own letter in with theirs and give the sea all three' },
          { id: 'keep', label: 'Keep them on the story shelf — some letters are meant to be arrived, not forwarded' },
        ] },
      { kind: 'narration', when: { flag: 's3_bottle', is: 'answer' }, text: 'The family writes back — to Chip, to the captain, to whoever the sea appoints next: what THIS crossing has proven so far, signed with every name at the fire. Three letters, one bottle, one tide. Skip salutes it out of the cove like a departing ship.' },
      { kind: 'narration', when: { flag: 's3_bottle', is: 'keep' }, text: 'The letters take the place of honor on the story shelf, weighted with a game-night shell. Some nights, after circle, someone reads Chip\'s last line out loud like a toast: keep each other. It\'s the whole trick.' },
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
      { kind: 'narration', text: 'The cliff-top signal fire is the season\'s biggest build — a tower of dry wood, visible for miles, kept ready but unlit. The Collier supervises with unusual gravity, and halfway through the work the family realizes why: the Jumble has maintained a signal fire on this cliff for YEARS. Fresh-stocked. Never lit.' },
      { kind: 'robot', who: 'collier', text: 'We keep it for HIM. (the words are out before the re-route can catch them; this time he lets them stand, hammering a stake much harder than the stake requires) …Someone taught us: a light you keep ready is a promise you haven\'t given up on. We re-stack it every storm season. You\'ll re-stack yours too. That\'s the milestone. Not the fire. The KEEPING of the fire.' },
      { kind: 'robot', who: 'skip', text: '(very quietly, to the family, watching the Collier work) I told you I don\'t know what the Before is. But it has a signal fire. It\'s had one my whole life.' },
      { kind: 'narration', text: 'The family builds theirs beside the Jumble\'s — two unlit promises on one cliff — and the compass, checked at dusk, points straight between them.' },
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
      { kind: 'narration', text: 'Bailer announces it at dawn with the full foghorn: THE FEAST OF SMALL THINGS. The Jumble\'s oldest festival. Rules: no big dishes, no grand gestures — the table is built entirely from tiny good things, each one presented OUT LOUD with its story. The first shell of the day. The joke that landed. The nap.' },
      { kind: 'robot', who: 'echo2', text: 'Big joys are weather — they come when they come. Small joys are AGRICULTURE. You farm them or you starve slow, and nobody notices they\'re starving because look, the sun\'s out. Tonight: everyone brings five. Yes, five. Hungry hearts underestimate the harvest. That\'s rather the point of the feast.' },
      { kind: 'narration', text: 'By dark the driftwood table is covered — leaf-plates of little moments, each with its teller. It is ridiculous. It is the best meal anyone has had since the wreck. The youngest brings seven and is declared, by unanimous Jumble vote, "dangerously good at this."' },
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
      { kind: 'narration', text: 'Hollow leads them there himself, which has never happened — a cove on the leeward side where the water goes so still it doubles the sky. The Jumble\'s quiet place. No games here. No volley ball. The rule of the cove is carved small on one stone: BE. STILL. TOGETHER.' },
      { kind: 'robot', who: 'hollow', text: 'The village taught you loud-together. This is the other half. Sitting in the same silence, on purpose, nobody performing — that\'s a family skill too. The hardest one. (he settles onto a stone like a heron) The little one couldn\'t do it for two years. Kept narrating the silence.' },
      { kind: 'robot', who: 'skip', text: 'I\'ve gotten SO good at it now. Watch. (four seconds) That was the demo. The real one\'s longer.' },
      { kind: 'narration', text: 'The family sits, still, together, while the tide breathes. Season three closes on the quietest triumph of the crossing so far: nobody needed anything to be different. Far out over the water, the sky is building something on the horizon. Nobody looks at it yet.' },
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
      { kind: 'narration', text: 'The storm the horizon was building arrives at midnight, and it is not weather with a name — it is the first storm\'s bigger sibling. By dawn the camp is wreckage: the shelter roof gone, the larder soaked, the volley ball in a tree. And in the wreck of it, cold and wet and exhausted, the family does the thing it swore it was done doing. The dock argument. Word for word. Like it never left — like it was only ever waiting for enough rain.' },
      { kind: 'robot', who: 'skip', text: '(standing in the middle of it, small, rain running off him) STOP. Please. Please stop. You sound like the beach again. You sound like the day we wouldn\'t help you. (his voice does the wooden-crack thing) It\'s not YOU. Can\'t you feel it? It\'s the pull. The Elders have a name for it—' },
      { kind: 'robot', who: 'hollow', text: 'The Undertow. (he says it like a tide table — a fact, not a curse) Every family that ever wrecked here brought one ashore. It isn\'t a person. It has never once been a person. It\'s the current that pulls each of you SEPARATELY so it can have you all. It is strongest after storms, when everyone is tired, and its favorite trick — its only trick — is convincing you the pull is coming from each other.' },
      { kind: 'narration', text: 'The rain thins. The family stands among their broken camp, looking at each other — really looking — at four tired people who all thought the pull was coming from across the fire. Name a current and you can swim it. Refuse to name it, and it names you. Today, at last: the naming.' },
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
      { kind: 'narration', text: 'Rebuilding starts — planks re-lashed, larder dried — and the Undertow, named now, becomes visible in the daylight: when the hard talk starts, who in this family CHASES (louder, closer, fix it NOW), and who HIDES (quieter, farther, later, gone)? The Jumble sorts itself shamelessly for the demonstration.' },
      { kind: 'robot', who: 'bailer', text: 'CHASER. Obviously. If a problem exists I am ALREADY AT IT, counting it. (a beat) Hollow once didn\'t speak for six days and I stood outside his hut for four of them. In the rain. Counting. It did not help. IT FELT LIKE HELPING.' },
      { kind: 'robot', who: 'hollow', text: 'Hider. (nothing else. then, because the family waits:) …The chase feels like being hunted, to a hider. And the hide feels like abandonment, to a chaser. Neither of us is wrong. Both of us are drowning in the same current, in opposite directions. The trick the village learned: the chaser counts to sixty. The hider promises to come BACK. Out loud. Every time. The promise is the plank you both hold.' },
      { kind: 'narration', text: 'The family sorts itself — honestly, gently, laughing once at how obvious it all is once it\'s on the sand. Chasers and hiders. And the plank between them, spoken out loud for the first time in maybe a decade of this family\'s pattern: sixty seconds, and always come back.' },
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
      { kind: 'narration', text: 'The conch comes down from the rules post — the actual conch, cool and heavy, passed to the family with two ceremonies\' worth of Jumble solemnity. Whoever holds it is heard to the end. Tonight the family runs its first full SHELL COUNCIL on the storm\'s hardest leftovers: the things said in the wreck of the camp.' },
      { kind: 'robot', who: 'echo2', text: 'The shell has one law and it is not "be nice." It is: FINISH. Nobody gets interrupted into silence, and nobody escapes into it either. You hold it, you empty it — the true thing, all the way out. Then it passes. I will repeat back the kindest full sentence each of you manages. I am told this is very annoying and very effective.' },
      { kind: 'narration', text: 'It is both. The shell goes around. The storm-words get finished properly this time — and it turns out half of them, said all the way to the end, were apologies wearing armor.' },
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
      { kind: 'narration', text: 'The Collier brings out the village\'s strangest tool: a rope of many splices — dozens of them, knot after knot, each one wrapped in a different lashing. It is, he explains, ONE rope. It has never been replaced. It has only ever been repaired.' },
      { kind: 'robot', who: 'collier', text: 'Every splice is a break that got MENDED. That\'s the whole rope. Anyone can keep an unbroken rope — there\'s no such thing, so it\'s easy. A family rope is splices or it\'s nothing. Today: each of you brings one frayed place — one break from the storm, or from before the island, we don\'t audit — and we splice it. Properly. So it holds LOAD.' },
      { kind: 'robot', who: 'skip', text: '(holding up his bandaged hand, newly re-wrapped) I\'m basically a splice with legs. It\'s the strongest part of me now. That\'s not a metaphor, the Collier reinforced the joint. (a beat) Okay it\'s also a metaphor.' },
      { kind: 'narration', text: 'The family splices. The repairs go in wrapped and deliberate, stronger at the mend than the rope ever was before the break — which is not a thing anyone believes about ropes or families until they\'ve made one hold.' },
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
      { kind: 'narration', text: 'The forge hut opens last of all the village — the Collier\'s own country, coal-warm, tool-hung, immaculate. On the anvil: nothing. That\'s the point. What gets forged here isn\'t metal.' },
      { kind: 'robot', who: 'collier', text: 'Four hammers make an apology that HOLDS. One: what I did — no fog, no "if anyone felt." Two: what it cost you — I say YOUR cost, out loud, so you know I carried it home. Three: what I\'ll do different — specific, or it\'s decoration. Four: the ask — not for forgiveness, that\'s yours to give or keep, but the ask to REPAIR. (he taps the anvil once) And the law of my forge: the word "but" melts here. Whatever it touches comes apart.' },
      { kind: 'narration', text: 'One by one, family members take the anvil. The forge is hot and honest and nobody rushes anybody, and somewhere in the middle of it the storm\'s last damage — the damage the rain didn\'t do — gets hammered back true.' },
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
      { kind: 'narration', text: 'The storm\'s tail floods the creek at dusk, and in the scramble to move the camp uphill, the count comes up short. One head. The youngest. Gone — and the sand by the north path says WHERE, and the where stops every heart in the camp: small footprints, heading inland. Toward the quiet camp. Toward the compass\'s heading. Looking for Mr. Bauer.' },
      { kind: 'robot', who: 'skip', text: '(already moving, already shouting over his shoulder) JUMBLE! ALL LANTERNS! THE LITTLE ONE\'S GONE TOWARD THE FALLS — (and then, to the family, his knot-eyes fierce) Together. You hear me? The island only yields to together — TONIGHT MORE THAN EVER. Nobody searches alone. NOBODY.' },
      { kind: 'choice', id: 's4_search', prompt: 'Dark. Flood water rising. The search parties form — where does the family line hold?',
        options: [
          { id: 'pairs', label: 'Split in pairs with lanterns — cover both paths' },
          { id: 'oneline', label: 'One line, hands linked, straight up the compass heading' },
        ] },
      { kind: 'narration', when: { flag: 's4_search', is: 'pairs' }, text: 'Pairs, lanterns, whistles — the Jumble takes the ridge, the family takes the paths. It\'s Echo-2 who catches it on the wind: a small voice, singing to itself to be brave, somewhere behind the sound of falling water.' },
      { kind: 'narration', when: { flag: 's4_search', is: 'oneline' }, text: 'One line, hands linked — the mast line all over again, Bauer\'s last order made flesh. The line walks the compass heading through the dark, nobody let go of, until the sound of falling water grows a second sound inside it: a small voice, singing to itself to be brave.' },
      { kind: 'narration', text: 'THE WATERFALL. And behind the water, where no map on this island ever put anything: a glow. Warm. Steady. Firelight — coming from inside the falls. The youngest\'s voice is coming from the light. And the youngest\'s voice says the impossible thing, clear over the water: "IT\'S OKAY! COME SEE! IT\'S MISTER BAUER\'S HOUSE!"' },
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
      { kind: 'narration', text: 'Behind the waterfall: a cave the size of a chapel, dry as a kept promise. A cot. A workbench. Tools worn to the shape of one man\'s hands. Shelf after shelf of carved driftwood — practice arms, test legs, knot-eyes in rows like a choir. And the youngest, wrapped in an old oilskin coat, safe by a fire pit that was laid ready — laid YEARS ago — with dry wood that only needed a spark.' },
      { kind: 'narration', text: 'On the workbench wall, burned into a plank in a steady hand, the words the family has been living without knowing it: A FAMILY THAT LOVES TOGETHER. A FAMILY THAT WORKS TOGETHER. A FAMILY THAT SURVIVES TOGETHER. And beneath the plank, a photograph — the same four sun-squinting faces from the tackle box. And beside it, a ledger, and the ledger tells the whole story to whoever reads page one.' },
      { kind: 'robot', who: 'hollow', text: '(from the cave mouth — the whole Jumble crowding behind him, and none of them surprised) …So. You found the Before. (he steps in, and for once the tall quiet one talks long) His name was Bauer. He wrecked here first — years before any of you — with everything he loved already lost to him back on the mainland. A family that came apart in the ordinary way: too busy, too proud, too late. He built US from the storm-wood. One of us for each of them. He taught us fire and the spiral and the oils and the games — every lesson he wished he\'d taught THEM. And when he\'d built us whole, he sailed home to try again with the living. He came back every season after. Tours, he called them. Families, he brought. YOURS was the twelfth.' },
      { kind: 'robot', who: 'skip', text: '(very small) The signal fire is his. We keep it lit-ready so he can always find the way back in. He made me LAST. Out of the leftover pieces. He said— (the wooden-crack voice) —he said the smallest scraps hold the most love per splinter, because you have to choose every single one.' },
      { kind: 'narration', text: 'And the ledger\'s last entry, dated the morning of your tour, in the steady hand: "Family twelve today. They argue like I did. If the sea takes me before I get them home — Jumble, you know the drill. Thirty-one lessons. Give them everything. They\'re why we practice." The sea kept him. The lessons kept you. The family sits down together in Mr. Bauer\'s house, the storm riding itself out beyond the falls, and lets the truth be both things at once: the saddest story on this island, and the reason they\'re alive inside it.' },
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
      { kind: 'narration', text: 'The morning after the cave, the Collier stands the family in front of the village and says the sentence the whole island has been building toward: "The Elders met. The trials begin. Five of them — the same five every Jumble passed. Finish, and you are one of us. And one of us…" (he looks at the sea) "…gets taken home."' },
      { kind: 'robot', who: 'collier', text: 'Trial one: THE RAFT. His plans — Bauer\'s, from the cave, drawn for exactly this. Every plank gets a name before it gets a lashing: the name of something this family survived. You don\'t float on wood. You float on what the wood MEANS. That\'s not poetry. That\'s engineering. His kind.' },
      { kind: 'robot', who: 'skip', text: '(clutching the plans, vibrating) I get to build a BOAT with my FAMILY from HIS DRAWINGS. If anyone needs me I\'ll be right here being extremely professional about it.' },
      { kind: 'narration', text: 'The naming takes all morning — the storm, the argument, the flood, the fire that wouldn\'t light and then did — every survived thing made a plank, every plank made part of the hull. The raft grows on the beach like the family\'s whole crossing, keel-up.' },
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
      { kind: 'narration', text: 'Trial two, and the Collier is merciless the way only love gets: THE LOAD TEST. The raft goes in the cove water, and then the family goes ON it — all of them at once, then in every combination, while the Jumble watches from the rocks with clipboards. (Bailer has an actual clipboard. Nobody knows where he got a clipboard.)' },
      { kind: 'robot', who: 'bailer', text: 'A raft that holds ONE of you is driftwood. A raft that holds ALL of you is a VESSEL. We test where it flexes when the weight shifts — because weight ALWAYS shifts. Someone gets sick. Someone gets sad. Someone gets a promotion in a city far away, hypothetically. The lashings that hold are the ones you tied TOGETHER. Shift the load. Again. AGAIN.' },
      { kind: 'robot', who: 'echo2', text: '(as the family scrambles, laughing, re-balancing) …Notice what you\'re doing without being told: calling the shift OUT LOUD before you move. "Coming to your side." "Take my corner." That\'s the whole test. The raft was never being tested.' },
      { kind: 'narration', text: 'By sundown the vessel holds every combination — even the silly ones, even everyone-on-one-corner while Skip shrieks about physics. It holds. The family knew it would. That\'s new, that knowing. That\'s the trial passed.' },
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
      { kind: 'narration', text: 'Trial three is not a trial, the Jumble admits — it\'s a FEAST, the biggest the village has thrown since the Before: the acceptance feast, fires doubled, the volley ball retrieved from its tree, the game box open, every small thing on the long table. And at the head of the table, one empty chair with an oilskin coat over it, because this village knows how to hold a feast and a missing person in the same heart.' },
      { kind: 'robot', who: 'skip', text: 'Trial three is the letters. Everyone writes one — that\'s the rule from HIS book. To someone who isn\'t here, or someone who is, or someone you were. The sea delivers. It always has. (he pats the youngest\'s shoulder with his spliced hand) You can dictate. I write very fast and only some letters backward.' },
      { kind: 'choice', id: 's5_letter', prompt: 'The feast quiets. The bottles wait. Who does your family write to?',
        options: [
          { id: 'bauer', label: 'To Mr. Bauer — the thank-you he sailed away before hearing' },
          { id: 'selves', label: 'To yourselves, one year from now — from the people you became here' },
        ] },
      { kind: 'narration', when: { flag: 's5_letter', is: 'bauer' }, text: 'The letter to Bauer takes four hands and one page: what the lessons did, what the robots became, what the family knows now that the dock family didn\'t. Hollow seals it. The Jumble walks it to the water together, every lantern lit, and the tide takes it toward wherever kept him. Nobody says a word the whole way back. Nobody needs to.' },
      { kind: 'narration', when: { flag: 's5_letter', is: 'selves' }, text: 'The letter forward gets written around the table, every voice a line: remember the spiral. Remember the sixty seconds. Remember the oils, the shell, the planks with names. Skip adds a postscript nobody reads until it\'s sealed: "P.S. — you have a robot family on an island and we are NOT hypothetical. Visit. — S." The tide takes it toward next year.' },
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
      { kind: 'narration', text: 'Trial four convenes at the village totem — the tall carved post where every Jumble\'s name lives, cut deep by the Collier\'s own hands. Tonight the whole village stands in a ring, lanterns up, and the Elders speak the old words: "Who vouches?"' },
      { kind: 'robot', who: 'skip', text: 'I DO. (he is standing on a stump to be taller and still isn\'t, and has never cared less) I vouched on day one before I asked permission and I vouch LOUDER now. They put out my hand with THEIR hands. They named their planks. They found the Before and didn\'t look away. They are the twelfth family and the FIRST to finish, and I\'m the one who gets to say it because I\'m the sponsor: THEY\'RE OURS.' },
      { kind: 'narration', text: 'The Collier steps to the totem with his carving knife. And one by one — each family member\'s name, spoken by the youngest robot and cut by the oldest — the family goes into the wood, into the village, into the long record of the island. Below the names, the Collier cuts one more line, his splices steady: MR. BAUER\'S FAMILY — ALL OF US.' },
      { kind: 'robot', who: 'hollow', text: 'One of us. (the whole Jumble, together, like a bell:) ONE OF US. …The signal fire is yours to light now. Trial five is the lighting — and the choosing of what comes after. Sleep well. Tomorrow, the sea answers.' },
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
      { kind: 'narration', text: 'Dawn. The signal fire takes on the first spark — the family\'s spark, struck with Bauer\'s fire-steel — and climbs the cliff-top wood like it was born knowing the way. Smoke, straight and tall, into a clear sky. And before the morning is out, the sea answers: a shape on the horizon. A boat. Real. Coming.' },
      { kind: 'narration', text: 'The village walks the family down to the raft — which will not be needed now, and which nobody would un-build for anything — and the Collier asks the last question of the thirty-one: "She needs a name before she\'s a vessel. Even one that never sails. ESPECIALLY one that never sails. Name her."' },
      { kind: 'choice', id: 's5_boat_name', prompt: 'The raft built from every named plank of this crossing. Her name:',
        options: [
          { id: 'bauer', label: 'THE MR. BAUER — so he gets his boat back' },
          { id: 'together', label: 'THE TOGETHER — the island\'s one law, made a vessel' },
          { id: 'skip', label: 'THE SKIP — the smallest scraps hold the most love per splinter' },
        ] },
      { kind: 'narration', when: { flag: 's5_boat_name', is: 'bauer' }, text: 'THE MR. BAUER, painted along the hull in the youngest\'s best letters. The Collier has to oil something that isn\'t squeaking. Twice.' },
      { kind: 'narration', when: { flag: 's5_boat_name', is: 'together' }, text: 'THE TOGETHER, painted along the hull — the law made a vessel. Echo-2 repeats the name back exactly as spoken, which she has never once done, because there was no kinder way to say it.' },
      { kind: 'narration', when: { flag: 's5_boat_name', is: 'skip' }, text: 'THE SKIP. The little robot reads his own name on a hull built from a family\'s survived things, and sits down right there on the sand, and the whole village pretends not to notice the smallest scrap of the Jumble holding his spliced hand over his knot-eyes.' },
      { kind: 'narration', text: 'The rescue boat anchors off the cove. And at the water\'s edge, Skip presses something into the family\'s hands: the compass. Polished. The needle swings once, twice — and settles, pointing not at the island, not at the boat, but square at the middle of the family standing together on the sand. "He fixed it years ago," Skip says. "It never pointed north. It points HOME. That\'s why it kept pointing at the village — and look what it points at now." The family that boards the boat is not the family that fell off one. Behind them the signal fire burns tall — lit-ready, always, for whoever wrecks next. A family that loves together. A family that works together. A family that survives together. THE END — and the beginning, which is the same thing, on this island.' },
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
