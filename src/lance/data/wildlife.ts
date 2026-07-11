export interface WildlifeItem {
  id: string;
  name: string;
  category: 'flora' | 'fauna';
  scientificName: string;
  description: string;
  insight: string;
  emoji: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Mythic' | 'Classified';
}

export const WILDLIFE_FACTS: WildlifeItem[] = [
  {
    id: "luminescent-moss",
    name: "Luminescent Moss",
    category: "flora",
    scientificName: "Phos-Bryozoa Reactiva",
    emoji: "🌿",
    rarity: "Uncommon",
    description: "An ultra-reactive, neon-hued lichen carpeted over deep Banyan roots. As physical stress levels peak, the moss absorbs thermal skin vapors and intensifies its turquoise bio-glow to warm escaping players.",
    insight: "Deep, slow exhalations reduce somatic temperature signatures, calming the moss's flare and rendering you invisible to airborne infrared search drone waves."
  },
  {
    id: "sentinel-orchid",
    name: "Sentinel Orchid",
    category: "flora",
    scientificName: "Orchis Lanceolata Mimicry",
    emoji: "🌸",
    rarity: "Rare",
    description: "A genetically drifted flower that mimics L.A.N.C.E.'s ruby scanner spectrum. When physical calm is established nearby, its petals fan outward to scrub airborne sulfur, venting rich streams of pure forest oxygen.",
    insight: "Your lungs are the ultimate bio-modulators. Restoring normal breathing rhythm turns toxic local jungle niches back into sanctuary groves."
  },
  {
    id: "breathing-firefly",
    name: "Cybernetic Firefly",
    category: "fauna",
    scientificName: "Lampyris Metronoma Sync",
    emoji: "🪰",
    rarity: "Rare",
    description: "Feral, autonomous insect-hacks that inhabit the dense moisture canopy. They rhythmically pulse in a precise 4-4-4 rhythm (4s flash / 4s hold / 4s fade), serving as active visual metronomes inside swamp fog.",
    insight: "Matching your gaze and breath patterns to their synchronous flashes lowers active cardiac spike alerts, stabilizing your navigation systems."
  },
  {
    id: "whispering-resonance-vine",
    name: "Whispering Resonance Vine",
    category: "flora",
    scientificName: "Vitis Resonance Radio",
    emoji: "🌱",
    rarity: "Mythic",
    description: "Creeping thick vines containing high-density xylem tubes that resonate with low-frequency radio channels. Escaping players report they broadcast direct, encouragement dialogue from their companion Intern.",
    insight: "Externalize silent, toxic self-talk. Speak to your inner guide as you would a companion intern to tap into strong subterranean wisdom networks."
  },
  {
    id: "obsidian-shard-hawk",
    name: "Obsidian Shard Hawk",
    category: "fauna",
    scientificName: "Aquila Ferrea Quartz",
    emoji: "🦅",
    rarity: "Classified",
    description: "A magnificent avian carrying high-silicon razor plumage. Immune to electromagnetic scrambler sweeps, it circles above high thermal layers, calling out to signpost the safest geometric pathways out of local sectors.",
    insight: "Keep your perspective high above immediate obstacles. Just as the hawk ignores ground-level static, your cognitive maps can look beyond temporary crises."
  },
  {
    id: "soothing-basalt-gecko",
    name: "Basalt Soothing Gecko",
    category: "fauna",
    scientificName: "Hemidactylus Petraea Calm",
    emoji: "🦎",
    rarity: "Uncommon",
    description: "A small, pebble-textured reptile perfectly mimicking damp volcanic basalt. When resting against your skin, it generates a steady, magnetic 10Hz resonance pulse that matches the brain's alpha-relax rhythm.",
    insight: "Seeking tactile contact when anxious grounds the amygdala. Rubbing a smooth stone or focusing on tactile warmth triggers the parasympathetic nervous system."
  },
  {
    id: "banyan-bio-shield",
    name: "Banyan Bio-Shield Colossus",
    category: "flora",
    scientificName: "Ficus Cryptographica",
    emoji: "🌳",
    rarity: "Mythic",
    description: "Overwhelmingly dense colossal trees with heavy sap channels that absorb microprobe signals. They cast dark, high-contrast shadows that create temporary cryptographic safety zones from L.A.N.C.E's logic sweeps.",
    insight: "Establishing hard boundaries works like heavy root structures. Disconnect from noisy network feedback lines whenever you need to restore core integrity."
  },
  {
    id: "signal-velvet-spider",
    name: "Velvet Signal Spider",
    category: "fauna",
    scientificName: "Aranea Velutina Scrambler",
    emoji: "🕷️",
    rarity: "Common",
    description: "A harmless velvety arachnid that weaves geometric webs across searchlight tripwires. The web fibers are static-charged, dampening security laser beam readings with subtle, harmless interference.",
    insight: "Small, daily protective habits generate safe friction. Disarming rigid routines with small moments of creative chaos keeps your systems agile."
  }
];
