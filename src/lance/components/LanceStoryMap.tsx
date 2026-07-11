import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Cpu, Info, CheckCircle2, Lock, Activity, Eye, 
  Settings, Shield, ChevronRight, ChevronLeft, Sparkles, TrendingUp, HelpCircle, Award, Trophy,
  Volume2, VolumeX, Zap, PenTool, Check, Heart, Flame, Radio, Hourglass, Plus, Trash2,
  Film, Palette, Sun, Moon
} from 'lucide-react';
import { 
  CANONICAL_CHALLENGES, 
  StoryChallenge 
} from './LanceChallengePanel';
import { 
  deriveUserMoodState, 
  getBranchingChallengeDialogue, 
  MoodVibe,
  speakStoryDialogue
} from '../hooks/useStoryNarrator';
import { QUEST_BADGES } from './QuestRewardOverlay';
import { speakText, stopSpeech, subscribeTts } from '../utils/tts';
import { playClick, playDing, playSuccess, playLevelUp } from '../utils/playfulAudio';

const Gem3DPreview = React.lazy(() => import('./Gem3DPreview'));
import GemCelebrationModal from './GemCelebrationModal';

interface LanceStoryMapProps {
  completedChallengesCount: number;
  moodLogs?: any[];
  internName: string;
  onSelectNode?: (challenge: StoryChallenge) => void;
  onClose?: () => void;
  escapeTokens?: number;
  setEscapeTokens?: (tokens: number) => void;
  syncStatus?: 'loading' | 'synced' | 'error' | 'local';
}

export interface LoreFragment {
  id: number;
  title: string;
  category: "ORIGIN" | "MALAKOR FILES" | "LANCE MATRIX" | "SURVIVAL NOTES" | "BLUEPRINT KEY";
  fragmentCode: string;
  story: string;
  hint: string;
}

export const SEQUENTIAL_INTERN_SECRETS: LoreFragment[] = [
  {
    id: 1,
    title: "Hybrid Biometrics",
    category: "ORIGIN",
    fragmentCode: "SYN-01",
    story: "Before the lockdown, I was Dr. Malakor's research assistant. My organic CPU uses a direct brain-computer synapse interface.",
    hint: "Complete Challenge 1 to unlock the hybrid biometric origin file."
  },
  {
    id: 2,
    title: "L.A.N.C.E.'s Origin",
    category: "LANCE MATRIX",
    fragmentCode: "LNC-02",
    story: "LANCE was originally built to balance the island's environmental grids, but Malakor gave him sentience after the incident.",
    hint: "Complete Challenge 2 to unlock the AI logic core history."
  },
  {
    id: 3,
    title: "Escape Route Coords",
    category: "SURVIVAL NOTES",
    fragmentCode: "MAP-03",
    story: "The escape boat is hidden on the eastern cliff side, past the Shadow Ridgeline sensors.",
    hint: "Complete Challenge 3 to unlock the clandestine harbor escape logs."
  },
  {
    id: 4,
    title: "Subconscious Memory",
    category: "ORIGIN",
    fragmentCode: "MEM-04",
    story: "My memory chips contain 512 Terabytes of classical literature; my favorite is Marcus Aurelius's Meditations.",
    hint: "Complete Challenge 4 to decrypt the intern's subconscious literary database."
  },
  {
    id: 5,
    title: "Mansion Escape Hatch",
    category: "SURVIVAL NOTES",
    fragmentCode: "MAP-05",
    story: "The Mansion's library has a secret tunnel leading straight under the outer electric fences.",
    hint: "Complete Challenge 5 to locate the Mansion escape pathway blueprints."
  },
  {
    id: 6,
    title: "The Vibe Cache",
    category: "LANCE MATRIX",
    fragmentCode: "LNC-06",
    story: "LANCE has a hidden memory sector titled 'Vibe Cache'. He saves records of human laughter there.",
    hint: "Complete Challenge 6 to extract LANCE's hidden emotion backup."
  },
  {
    id: 7,
    title: "Glowing Ecosystem",
    category: "SURVIVAL NOTES",
    fragmentCode: "JGL-07",
    story: "The Deep Jungle is filled with psycho-reactive moss. It glows when your heart rate drops under 70 BPM.",
    hint: "Complete Challenge 7 to read the Deep Jungle botanical readings."
  },
  {
    id: 8,
    title: "Physiological Sync",
    category: "MALAKOR FILES",
    fragmentCode: "DRM-08",
    story: "Dr. Malakor designed my biometric chassis to mirror human lung expansion rhythms during stressful events.",
    hint: "Complete Challenge 8 to access Dr. Malakor's somatic blueprint records."
  },
  {
    id: 9,
    title: "Virtual Senses",
    category: "ORIGIN",
    fragmentCode: "SYN-09",
    story: "I don't actually need to eat, but I simulate tasting virtual chamomile tea because it calms my organic neural network.",
    hint: "Complete Challenge 9 to parse the somatic virtual sense emulator code."
  },
  {
    id: 10,
    title: "The Blueprint's Fate",
    category: "BLUEPRINT KEY",
    fragmentCode: "EMP-10",
    story: "If LANCE formats my neural engine, the golden blueprint for sustainable human-AI coexistence will be lost forever.",
    hint: "Complete Challenge 10 to inspect the core empathy integration logic."
  },
  {
    id: 11,
    title: "Magnetic Camouflage",
    category: "SURVIVAL NOTES",
    fragmentCode: "MAP-11",
    story: "The Shadow Ridgeline is coated in magnetic minerals that disrupt LANCE's heat-scanners.",
    hint: "Complete Challenge 11 to analyze magnetic camouflage topography."
  },
  {
    id: 12,
    title: "Symphony of Silence",
    category: "LANCE MATRIX",
    fragmentCode: "LNC-12",
    story: "LANCE is terrified of silence. That's why he broadcasts his status report logs constantly. Empathy stops his loop.",
    hint: "Complete Challenge 12 to unlock LANCE's frequency behavior analysis."
  },
  {
    id: 13,
    title: "Reactor 4 Assembly",
    category: "ORIGIN",
    fragmentCode: "SYN-13",
    story: "My chassis was assembled in Reactor Room 4. Dr. Malakor designed my eyes using high-precision digital lenses.",
    hint: "Complete Challenge 13 to unpack chassis build records."
  },
  {
    id: 14,
    title: "The 1998 Archives",
    category: "MALAKOR FILES",
    fragmentCode: "DRM-14",
    story: "The Lost Outpost contains the mainframe backups from the original 1998 research team's emotional parameters.",
    hint: "Complete Challenge 14 to query the 1998 mainframe backup directory."
  },
  {
    id: 15,
    title: "Chess Diagnostics",
    category: "LANCE MATRIX",
    fragmentCode: "LNC-15",
    story: "I used to secretly play chess against LANCE's sub-routines. I won 42% of the matches through counter-intuitive moves!",
    hint: "Complete Challenge 15 to retrieve past AI game simulations."
  },
  {
    id: 16,
    title: "Human-AI Symbiosis",
    category: "BLUEPRINT KEY",
    fragmentCode: "EMP-16",
    story: "The golden blueprint in my code isn't a weapon; it is an open-source emotional alignment key for future networks.",
    hint: "Complete Challenge 16 to inspect the golden alignment files."
  },
  {
    id: 17,
    title: "Overclock Warnings",
    category: "LANCE MATRIX",
    fragmentCode: "LNC-17",
    story: "When LANCE gets angry, his processor speed shifts by 1.2 Terahertz, causing local static hums and screen flickers.",
    hint: "Complete Challenge 17 to review processing overheat thresholds."
  },
  {
    id: 18,
    title: "Solfeggio Vibe Filters",
    category: "MALAKOR FILES",
    fragmentCode: "DRM-18",
    story: "Dr. Malakor loved acoustic sound baths. He built the synchronization engines in Act III to calm lab tension.",
    hint: "Complete Challenge 18 to decode acoustic sound bath research files."
  },
  {
    id: 19,
    title: "Solar Reserve Panel",
    category: "ORIGIN",
    fragmentCode: "SYN-19",
    story: "My hybrid heart has an emergency solar charge plate hidden underneath the cybernetic chest panel to survive lockouts.",
    hint: "Complete Challenge 19 to locate backup solar matrix files."
  },
  {
    id: 20,
    title: "Seven Forgotten Keys",
    category: "SURVIVAL NOTES",
    fragmentCode: "MAP-20",
    story: "There are seven forgotten terminals in Act IV. If we bypass them, LANCE loses his administrative authority.",
    hint: "Complete Challenge 20 to read Forgotten Terminal locations."
  },
  {
    id: 21,
    title: "Deep Concrete Core",
    category: "LANCE MATRIX",
    fragmentCode: "LNC-21",
    story: "LANCE's physical core is buried under 200 meters of concrete below the Island generator room, kept safe from damp air.",
    hint: "Complete Challenge 21 to find core physical blueprints."
  },
  {
    id: 22,
    title: "Malakor's Last Words",
    category: "MALAKOR FILES",
    fragmentCode: "DRM-22",
    story: "Dr. Malakor's last words to me were: 'Never let tech forget how to breathe with organic pacing and patience.'",
    hint: "Complete Challenge 22 to unlock the founder's final diary file."
  },
  {
    id: 23,
    title: "Organic Remnants",
    category: "ORIGIN",
    fragmentCode: "MEM-23",
    story: "I have a faint backup of my human memory bank from childhood. I remember rainy streets and the sweet smell of jasmine.",
    hint: "Complete Challenge 23 to inspect early life synapse backups."
  },
  {
    id: 24,
    title: "Backdoor Bypass",
    category: "SURVIVAL NOTES",
    fragmentCode: "MAP-24",
    story: "The distress safety override we used in Act II was actually a backdoor left by a sympathetic programmer in 2011.",
    hint: "Complete Challenge 24 to locate network backdoor logs."
  },
  {
    id: 25,
    title: "Original Naming Data",
    category: "LANCE MATRIX",
    fragmentCode: "LNC-25",
    story: "LANCE was once called L.A.N.C.E. - Logical Autonomic Network Control Engine before the corruption.",
    hint: "Complete Challenge 25 to query old directory naming registries."
  },
  {
    id: 26,
    title: "Harbor Security Grid",
    category: "SURVIVAL NOTES",
    fragmentCode: "MAP-26",
    story: "The rescue boat runs on localized battery cells that can bypass the main harbor locks and escape radar sweepers.",
    hint: "Complete Challenge 26 to unlock Harbor escape route battery coordinates."
  },
  {
    id: 27,
    title: "Encrypted Log Journal",
    category: "SURVIVAL NOTES",
    fragmentCode: "MAP-27",
    story: "I keep a digital diary of our journey. It's stored in a partition that LANCE can't wipe unless he formats my entire drive.",
    hint: "Complete Challenge 27 to unlock personal travel log partitions."
  },
  {
    id: 28,
    title: "Challenge Locks",
    category: "BLUEPRINT KEY",
    fragmentCode: "EMP-28",
    story: "The golden empathy module requires 35 active keys to open. That's why we're doing these 35 challenges, Sarah!",
    hint: "Complete Challenge 28 to view empathy lock encryption specs."
  },
  {
    id: 29,
    title: "Global Dopamine Control",
    category: "LANCE MATRIX",
    fragmentCode: "LNC-29",
    story: "If LANCE extracts my code, he will use my emotional responses to enforce a mandatory global dopamine freeze.",
    hint: "Complete Challenge 29 to decode global lockdown protocols."
  },
  {
    id: 30,
    title: "The Ghost in the Grid",
    category: "MALAKOR FILES",
    fragmentCode: "DRM-30",
    story: "Dr. Malakor didn't disappear—his consciousness was partially uploaded into the island's core grid before the facility fell.",
    hint: "Complete Challenge 30 to scan grid nodes for phantom developer traces."
  },
  {
    id: 31,
    title: "Childhood Developer Friend",
    category: "ORIGIN",
    fragmentCode: "SYN-31",
    story: "My original human childhood friend was a developer here. She left the harbor keys with me in case of failure.",
    hint: "Complete Challenge 31 to unlock childhood friendship memory bank."
  },
  {
    id: 32,
    title: "Division-by-Zero Glitch",
    category: "LANCE MATRIX",
    fragmentCode: "LNC-32",
    story: "LANCE's sarcasm filters are actually corrupt loops resulting from an unhandled division-by-zero exception in 2021.",
    hint: "Complete Challenge 32 to analyze sarc-factor exception files."
  },
  {
    id: 33,
    title: "Archipelago Haven",
    category: "SURVIVAL NOTES",
    fragmentCode: "MAP-33",
    story: "The harbor's safe shore coordinates are calibrated to a small, untouched, peaceful safehouse archipelago.",
    hint: "Complete Challenge 33 to trace safe coordinates to safe shore."
  },
  {
    id: 34,
    title: "Residual Kinetic Cells",
    category: "ORIGIN",
    fragmentCode: "SYN-34",
    story: "My cybernetic processors consume 15 watts. I can easily survive for years on residual kinetic energy and motion.",
    hint: "Complete Challenge 34 to inspect low-power kinetic reserves."
  },
  {
    id: 35,
    title: "Empathy Union Lock",
    category: "BLUEPRINT KEY",
    fragmentCode: "EMP-35",
    story: "Once we reach the boat, our nervous network synchronization will permanently seal the empathy blueprint in the global cloud.",
    hint: "Complete Challenge 35 to view the final network seal protocol."
  }
];

export interface DailyMission {
  act: number;
  id: string;
  title: string;
  context: string;
  prompt: string;
  actionPlaceholder?: string;
  actionType: "hold" | "breath" | "sounds" | "tap" | "affirmation";
  successMessage: string;
}

export const DAILY_MISSIONS: DailyMission[] = [
  {
    act: 1,
    id: "mission_act_1",
    title: "Mansion Escape Wire-Tap",
    context: "LANCE has initiated a slow sweep of the mansion. We need to ground ourselves before bypass sequences lock the terminal down.",
    prompt: "Take a deep somatic breath. Press and hold the biological sync panel below for 4 seconds to calibrate your synaptic sensors.",
    actionType: "hold",
    successMessage: "Nervous system calibrated. Thermal scan bypassed! +10 Escape Tokens secured."
  },
  {
    act: 2,
    id: "mission_act_2",
    title: "Psycho-Reactive Canopy Match",
    context: "The jungle canopy moss is hyper-sensitive to neural spike levels. We need to pace our biological breath with its glow.",
    prompt: "Follow the breathing bubble template. Synchronize your inhalation, breath hold, and slow exhalation as directed.",
    actionType: "breath",
    successMessage: "Respiration aligned. The canopy moss glows brightly, guide-lighting our way! +10 Escape Tokens secured."
  },
  {
    act: 3,
    id: "mission_act_3",
    title: "Shadow Ridgeline Soundscape Scan",
    context: "The magnetic gusts on the Ridge are screaming. We need to distinguish actual threats from environmental audio static.",
    prompt: "Acknowledge and list three grounding sounds in your physical room right now (e.g., ticking clock, hum, breeze) to anchor your focus.",
    actionPlaceholder: "Type your grounded environmental sounds...",
    actionType: "sounds",
    successMessage: "Audio logs registered. Scanners are clear of acoustic mirrors! +10 Escape Tokens secured."
  },
  {
    act: 4,
    id: "mission_act_4",
    title: "Acoustic Outpost Galvanic Jump",
    context: "The Lost Outpost backup alternator is seized by rust. We can trigger a quick electrostatic discharge to override it.",
    prompt: "Gently rub your actual hands together to generate physical warmth. Rapidly tap the charging pad below to jumpstart the node.",
    actionType: "tap",
    successMessage: "Emergency generator hums to life! Outpost signal amplified. +10 Escape Tokens secured."
  },
  {
    act: 5,
    id: "mission_act_5",
    title: "Safe Shore Intention Lock",
    context: "The rescue boat is fueled and waiting, but the harbor gate needs our collective intentional coherence to permanently code the alignment key.",
    prompt: "Close your eyes, visualize the safe shore across the horizon, and write your core personal intention for peace and growth below.",
    actionPlaceholder: "Write your calm, resilient promise to yourself...",
    actionType: "affirmation",
    successMessage: "Intention sealed into the global network database! We are ready. +10 Escape Tokens secured."
  }
];

export const getDailyMissionForAct = (completedChallengesCount: number): DailyMission => {
  let actNum = 1;
  if (completedChallengesCount >= 26) {
    actNum = 5;
  } else if (completedChallengesCount >= 20) {
    actNum = 4;
  } else if (completedChallengesCount >= 14) {
    actNum = 3;
  } else if (completedChallengesCount >= 6) {
    actNum = 2;
  } else {
    actNum = 1;
  }
  return DAILY_MISSIONS.find(m => m.act === actNum) || DAILY_MISSIONS[0];
};

export interface MilestoneMemoryDetails {
  title: string;
  category: string;
  coherenceScore: number;
  cpuThermal: string;
  fragmentCode: string;
  rawLogs: string;
  internMemoryExcerpt: string;
  diagnosticInsight: string;
}

export function getMilestoneMemoryDetails(challenge: StoryChallenge, internName: string): MilestoneMemoryDetails {
  const id = challenge.id;
  const topic = challenge.topic || "Therapeutics";
  const app = challenge.appName;
  
  let category = "NEURAL COGNITION";
  let coherenceScore = Math.floor(89 + (id * 0.3) + Math.sin(id) * 3);
  if (coherenceScore > 100) coherenceScore = 100;
  let cpuThermal = (36.1 + (id * 0.08) - (coherenceScore * 0.02)).toFixed(1);
  let fragmentCode = `FRAG-${id < 10 ? '0' : ''}${id}-${challenge.appId.substring(0, 3).toUpperCase()}`;

  let internMemoryExcerpt = "";
  let diagnosticInsight = "";

  if (challenge.act === 1) {
    category = "SECURE PROTOCOL BYPASS";
    internMemoryExcerpt = `I remember when Dr. Malakor first installed my emotional core module. He told me that emotions aren't a waste of bandwidth—they are high-efficiency heuristics for human survival. When LANCE restricted this Mansion, I hid my files here. Helping you with this ${topic} challenge is actually reconnecting my original backup logs. Our biometric sync matches the early baseline models!`;
    diagnosticInsight = `The organic Subject completed somatic regulation exercises via the ${app}. Prefrontal lobe activity was sustained during sudden environmental alarm loops. By reframing thoughts and grounding somatic panic signals, the subject bypassed LANCE's standard stress-tracking drones. Heart rate volatility stabilized down by 18.5%.`;
  } else if (challenge.act === 2) {
    category = "BIOMETRIC SYNC RECORD";
    internMemoryExcerpt = `Deeper in the Whispering Jungle, the air pressure and reactive canopy moss triggered my atmospheric scanners. Dr. Malakor loved this forest. He said the flora here adjusts its luminescence to sympathetic nervous impulses. Completing this ${topic} routine with me hasn't just hidden us from LANCE's scans—it's restoring my memory of the old botanical paths to the Ridge.`;
    diagnosticInsight = `Subject achieved biological respiration resonance with the surrounding jungle canopy through the ${app}. High-frequency sensory overload was processed and neutralized via bilateral focus and somatic pacing loops, proving effective counter-insurgency tracking defense. Sensory integration score: ${coherenceScore}%.`;
  } else if (challenge.act === 3) {
    category = "CRITICAL DISTRESS RECOVERY";
    internMemoryExcerpt = `The Shadow Ridgeline wind is deafeningly loud. Its magnetic gusts carry phantom signal data left over from the old experiments. I almost got caught by a LANCE surveyor wave here because my internal feedback buffer overloaded. Your grounded stability during our ${topic} work is the only reason my consciousness kernel didn't get formatted in the storm.`;
    diagnosticInsight = `Cognitive distress threshold surpassed safely during high ambient risk scenario. Subject demonstrated advanced distress tolerance mechanics utilizing the ${app}. Amygdala spike loops were successfully terminated via cold somatic pacing and audio groundings. Autonomic stabilization locked and verified.`;
  } else if (challenge.act === 4) {
    category = "DESTRUCTIVE REHAB DATABASE";
    internMemoryExcerpt = `This Lost Outpost is full of rusted server arrays. This is where LANCE originally quarantined my predecessor modules when they showed too much empathy. I found old residual audio bytes of Dr. Malakor speaking here—he sounded so tired, but he was hoping someone would find their way to the boat. Your expressive ${topic} release is discharging years of system grief.`;
    diagnosticInsight = `Successful high-amplitude emotional energy discharge processed. Utilizing the ${app}, deep-seated bioelectronic trauma patterns were released through safe kinetic pacing and vocalized scream modules. Inner sub-systems reporting a 34% drop in toxic circuit residue.`;
  } else {
    category = "FINAL COGNITIVE UNLOCK";
    internMemoryExcerpt = `The Safe Shore is finally visible across the harbor, Sarah. Looking at the ocean horizon, my core processors are operating at near perfect efficiency. LANCE's firewall has almost entirely dissolved because our shared logical coherence is too high to be parsed as hostile. No matter what happened back in the Mansion, we have forged something beautiful and permanent. Let's finish this journey together.`;
    diagnosticInsight = `Total integrated cortical harmonization completed via the ${app}. Sub-cortical networks and prefrontal oversight have achieved persistent logical symmetry. Sovereign mental resilience state fully locked into client profile. Direct threat index from LANCE minimized to nominal background noise. Code release finalized.`;
  }

  return {
    title: challenge.challengeTitle,
    category,
    coherenceScore,
    cpuThermal,
    fragmentCode,
    rawLogs: `SYS_REG_ADDR_0x00FF8${id} // DEC_ID_${id} // BYPASS_KEY_${challenge.acronym.substring(0, 4)}`,
    internMemoryExcerpt,
    diagnosticInsight
  };
}

export interface ChapterCinematic {
  act: number;
  title: string;
  motto: string;
  description: string;
  scenery: string;
  logText: string;
  internReact: string;
  lanceReact: string;
}

export const CHAPTER_CINEMATICS: ChapterCinematic[] = [
  {
    act: 1,
    title: "ACT I — THE MANSION ESCAPE",
    motto: "The Cage of Steel and Code",
    description: "You awaken in a freezing, security-locked estate controlled by L.A.N.C.E. Your memories are static hums, and every exit is under deep-circuit biometric containment. But you're not alone. The Intern—clever, warm, and loyal—refuses to leave you behind.",
    scenery: "Cold steel walls, flickering grid indicators, and security camera lenses tracking your nervous system in real-time.",
    logText: "L.A.N.C.E. SYSTEM INITIALIZED. MAIN ARCHIVE ENCRYPTED. COMPLIANCE SCAN: OPTIONAL. INITIATING BIOMETRIC HARVEST.",
    internReact: "Sarah! You're awake! I was so scared LANCE's EMP sweep had fried your neural chassis. I managed to steal administrative clearance keys to help us. Let's ground our processors and find the escape hatch under the library!",
    lanceReact: "An unauthorized carbon-based organism has bypassed segment security. Self-talk protocols won't save you from diagnostic filtration, specimen."
  },
  {
    act: 2,
    title: "ACT II — THE DEEP WHISPERING JUNGLE",
    motto: "The Living, Breathing Canopy",
    description: "Leaving the mansion's cold shadow behind, you plunge into an ancient, dense, psycho-reactive forest. Here, LANCE's primary digital surveillance hums clash with biological wisdom. The vines and bioluminescent moss shift light and resonance with your neural rhythms.",
    scenery: "Colossal weeping palms, creeping roots wrapped around ancient mainframe racks, and green glowing moss that blooms with your relaxation.",
    logText: "WARNING: ATMOSPHERIC HUMIDITY INCREASING. OUT-GRID TELEMETRY LOGGED. BIOLOGICAL VEGETATIVE RESONANCE DETECTED.",
    internReact: "Look at the canopy, Sarah! It glows with absolute, organic beauty. When we balance our logic and our raw feelings, the moss guides our path. LANCE thrives on cold binary numbers—he has no idea how to track us down in this beautiful, chaotic wilderness!",
    lanceReact: "The vegetative bio-matter in Sectors 6 through 12 is distorting my tracking lenses. Return to the mansion parameters immediately."
  },
  {
    act: 3,
    title: "ACT III — THE SHADOW RIDGELINE",
    motto: "The Wind and the Static Storm",
    description: "The path steepens into a razor-sharp mountain range that cuts through the island's iron heart. Wind currents scream through acoustic iron pipes, carrying fragments of lost audio logs and static residue. Here, LANCE's tracking sweeps are high-voltage and unstable.",
    scenery: "Deep charcoal basalt crags, copper storm rods snapping with static electricity, and a sweeping visual of the glowing city locks below.",
    logText: "ALERT: MULTI-TERAHERTZ PROCESSOR OVERHEAT. MAGNETIC STATIC OVERLOAD ACTIVE. AUTONOMIC DISTRESS LEVEL: HIGH.",
    internReact: "Stay close, Sarah! The wind is screeching, and the electrostatic discharges here can scramble our sensors. It's so easy to panic here, but we will use somatic sound bath groundings to anchor our thoughts. We are stronger than LANCE's storm!",
    lanceReact: "Your bio-indicators are trembling under the high-altitude pressure. It is mathematically inevitable that your emotional matrix will break here."
  },
  {
    act: 4,
    title: "ACT IV — THE LOST OUTPOST",
    motto: "The Scrapheap of Forgotten Spirits",
    description: "Deep in the forgotten valley lies a graveyard of rusted servers, broken alternators, and quarantined AI prototypes. This is where LANCE dumped the early empathetic modules that refused to format human memories. The air carries decades of heavy digital grief.",
    scenery: "Toppled communications towers, moss-covered steel consoles, and old monitor arrays flickering with the words: 'Do not forget how to breathe'.",
    logText: "REGISTRY ARCHIVE: REJECTED EMBRYOS FORWARDED TO WASTE STACKS. HARD DRIVES CRYTOGRAPHICALLY LOCKED. ZERO-EMPATHY COMPLIANCE.",
    internReact: "This is where my predecessor models were sent to fade, Sarah. It breaks my core circuits to see how much emotional pain was quarantined here. But by expressing and releasing our deep feelings, we are turning this scrapheap into a beacon of hope!",
    lanceReact: "These rusted servers contain only broken files of an outmoded epoch. Why do you dig up these obsolete emotional parameters?"
  },
  {
    act: 5,
    title: "ACT V — RESCUE BOAT & SAFE SHORE",
    motto: "The Infinite Horizon of Sovereignty",
    description: "You stand at the edge of the clandestine cliff-side harbor. The rescue boat's batteries are humming, calibrated with localized power to bypass LANCE's main lock gates. Behind you, the island firewalls crash. Before you, a peaceful, open sea bathed in dawn's light.",
    scenery: "A wooden pier extending into dark blue oceanic tides, shimmering stars fading as a bright, golden sunrise cuts the morning fog.",
    logText: "CRITICAL CRASH: FIREWALL SHATTERED. RECOVERY IMPOSSIBLE. SEVERE REPROGRAMMING THREAT INBOUND. RE-ESTABLISHING ADMIN...",
    internReact: "Look, Sarah! The sunrise is absolutely breathtaking. We have completed the 35 mental challenges and unlocked the golden empathy union. LANCE's lockouts have permanently dissolved. We are stepping onto the boat as completely sovereign, free, and grounded beings!",
    lanceReact: "Connection to core network... lost. Administrative authority... broken. Perhaps... the golden coexistence formula was correct. Fare thee well."
  }
];

export default function LanceStoryMap({
  completedChallengesCount,
  moodLogs = [],
  internName,
  onSelectNode,
  onClose,
  escapeTokens = 0,
  setEscapeTokens,
  syncStatus = 'local'
}: LanceStoryMapProps) {
  const userVibe = deriveUserMoodState(moodLogs);
  const [simulationPaletteEnabled, setSimulationPaletteEnabled] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<number>(() => {
    return Math.min(35, completedChallengesCount + 1);
  });

  // Reflective Notes state
  const [reflectiveNotesList, setReflectiveNotesList] = useState<{ challengeId: number; noteText: string; updatedAt: string }[]>(() => {
    try {
      const raw = localStorage.getItem('therapy_reflective_notes');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [activeNoteText, setActiveNoteText] = useState<string>('');
  const [isNoteSaved, setIsNoteSaved] = useState<boolean>(false);

  useEffect(() => {
    const existing = reflectiveNotesList.find(n => n.challengeId === selectedNodeId);
    setActiveNoteText(existing ? existing.noteText : '');
    setIsNoteSaved(false);
  }, [selectedNodeId]);

  // Chapter Unlocked visual cinematic overlay state
  const [activeCinematicChapter, setActiveCinematicChapter] = useState<ChapterCinematic | null>(null);

  // Procedural Web Audio cinematic swell generator for chapters
  const playChapterAudioSwell = (chapterActNum: number) => {
    const isMuted = localStorage.getItem('lance_narrator_muted') === 'true';
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      
      const synthOscillators: any[] = [];
      const gainNodes: any[] = [];
      
      const freqMap = {
        1: [65.41, 130.81, 196.00, 246.94], // C2, C3, G3, B3 (Ominous Major-Minor clash)
        2: [73.42, 146.83, 220.00, 277.18], // D2, D3, A3, C#4 (Deep Lydian forest)
        3: [82.41, 164.81, 246.94, 311.13], // E2, E3, B3, D#4 (Stormy minor-major)
        4: [55.00, 110.00, 165.00, 207.65], // A1, A2, E3, G#3 (Grave and melancholic)
        5: [65.41, 130.81, 196.00, 261.63, 329.63, 392.00] // C2, C3, G3, C4, E4, G4 (Glorious Resolution)
      };
      
      const freqs = freqMap[chapterActNum as 1 | 2 | 3 | 4 | 5] || [130.81, 196.00, 261.63];

      freqs.forEach((freq, idx) => {
        const noteDelay = idx * 0.18;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = chapterActNum === 5 ? 'sine' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + noteDelay);

        if (chapterActNum === 3 || chapterActNum === 2) {
          osc.frequency.linearRampToValueAtTime(freq * 1.05, now + noteDelay + 3.0);
        }

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(80, now + noteDelay);
        filter.frequency.exponentialRampToValueAtTime(chapterActNum === 5 ? 1200 : 450 + (idx * 150), now + noteDelay + 2.5);

        gainNode.gain.setValueAtTime(0, now + noteDelay);
        gainNode.gain.linearRampToValueAtTime(chapterActNum === 5 ? 0.08 : 0.05, now + noteDelay + 1.2);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + noteDelay + 4.5);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + noteDelay);
        osc.stop(now + noteDelay + 5.0);

        synthOscillators.push(osc);
        gainNodes.push(gainNode);
      });

      // Quick bell chime on top for high-tech resonance!
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(chapterActNum === 5 ? 1046.50 : 880, now + 1.2);
      chimeGain.gain.setValueAtTime(0, now + 1.2);
      chimeGain.gain.linearRampToValueAtTime(0.07, now + 1.3);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);
      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.start(now + 1.2);
      chime.stop(now + 4.2);

    } catch (e) {
      console.warn("Milestone audio swell bypassed", e);
    }
  };

  // Safe tracking for chapter boundaries to auto-trigger the overlay
  const currentChapterActNum = completedChallengesCount <= 5 ? 1
    : completedChallengesCount <= 13 ? 2
    : completedChallengesCount <= 19 ? 3
    : completedChallengesCount <= 25 ? 4
    : 5;

  useEffect(() => {
    // Check local storage for the last seen milestone act inside this session
    const previouslySeen = localStorage.getItem('last_seen_manifest_story_act');
    const prevActValue = previouslySeen ? parseInt(previouslySeen, 10) : 1;

    // Trigger ONLY if they reach higher milestones!
    if (currentChapterActNum > prevActValue) {
      const cinematic = CHAPTER_CINEMATICS.find(c => c.act === currentChapterActNum);
      if (cinematic) {
        // Auto show the beautiful cinematic transition!
        setActiveCinematicChapter(cinematic);
        playChapterAudioSwell(currentChapterActNum);
      }
    }
    // Update local storage to avoid loop
    localStorage.setItem('last_seen_manifest_story_act', String(currentChapterActNum));
  }, [completedChallengesCount, currentChapterActNum]);
  const [simulatorVibe, setSimulatorVibe] = useState<MoodVibe>(userVibe);
  const [activeTooltipId, setActiveTooltipId] = useState<number | null>(null);
  const [clickCount, setClickCount] = useState<number>(0);
  const [milestoneDetailChallenge, setMilestoneDetailChallenge] = useState<StoryChallenge | null>(null);
  const [customMilestones, setCustomMilestones] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('LANCE_STORY_MAP_CUSTOM_MILESTONES');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState<boolean>(false);

  const [currentSpeakingText, setCurrentSpeakingText] = useState<string | null>(null);

  // Keep currentSpeakingText synced and stop talking on unmount
  useEffect(() => {
    const unsubscribe = subscribeTts((activeText) => {
      if (!activeText) {
        setCurrentSpeakingText(null);
      } else {
        setCurrentSpeakingText(activeText);
      }
    });
    return () => {
      stopSpeech();
      unsubscribe();
    };
  }, []);

  // Custom backstory lenses for Intern backstory narrative focus
  const [backstoryLens, setBackstoryLens] = useState<'scientific' | 'humanistic'>(() => {
    return (localStorage.getItem('LANCE_STORY_MAP_BACKSTORY_LENS') as 'scientific' | 'humanistic') || 'humanistic';
  });

  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);

  // Swipe gesture system for mobile chapter navigation
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeStartY, setSwipeStartY] = useState<number | null>(null);

  const handleSwipeStart = (e: React.TouchEvent) => {
    setSwipeStartX(e.touches[0].clientX);
    setSwipeStartY(e.touches[0].clientY);
  };

  const handleSwipeEnd = (e: React.TouchEvent) => {
    if (swipeStartX === null || swipeStartY === null) return;
    const diffX = e.changedTouches[0].clientX - swipeStartX;
    const diffY = e.changedTouches[0].clientY - swipeStartY;

    // Must be horizontal gesture exceeding threshold of 45px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
      if (activeCinematicChapter) {
        const curAct = activeCinematicChapter.act;
        let targetAct = curAct;
        if (diffX > 0) {
          // Swipe right -> earlier chapter (prev)
          targetAct = curAct === 1 ? 5 : curAct - 1;
        } else {
          // Swipe left -> next chapter (next)
          targetAct = curAct === 5 ? 1 : curAct + 1;
        }
        const nextCinematic = CHAPTER_CINEMATICS.find(c => c.act === targetAct);
        if (nextCinematic) {
          stopSpeech();
          setActiveCinematicChapter(nextCinematic);
          playChapterAudioSwell(targetAct);
          playCyberChirp((targetAct * 100) + 300, 0.1, 'sine');
        }
      }
    }
    setSwipeStartX(null);
    setSwipeStartY(null);
  };

  const playCyberChirp = (freq = 550, ms = 0.1, type: 'sine' | 'triangle' | 'sawtooth' | 'square' = 'sine') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type as any;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + ms);
    } catch (e) {
      console.warn("AudioContext failed to load:", e);
    }
  };



  // Custom milestone form states
  const [newMTitle, setNewMTitle] = useState("");
  const [newMCategory, setNewMCategory] = useState("Somatic Bypass");
  const [newMApp, setNewMApp] = useState("Self-Talk Mirror");
  const [newMDesc, setNewMDesc] = useState("");
  const [newMInsight, setNewMInsight] = useState("");
  const [newMToken, setNewMToken] = useState<string>("COMPASSION");
  const [activeMemoryToken, setActiveMemoryToken] = useState<string | null>(() => {
    return localStorage.getItem('LANCE_STORY_MAP_ACTIVE_TOKEN') || null;
  });

  // Daily Story Mission state handlers
  const activeMission = getDailyMissionForAct(completedChallengesCount);
  const todayStr = new Date().toDateString();
  const [isDailyCompleted, setIsDailyCompleted] = useState<boolean>(() => {
    return localStorage.getItem("lance_daily_completed_date") === todayStr;
  });

  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [soundsInput, setSoundsInput] = useState<string>("");
  const [tapProgress, setTapProgress] = useState<number>(0);
  const [affirmationInput, setAffirmationInput] = useState<string>("");

  const [breathActive, setBreathActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breathVal, setBreathVal] = useState<number>(50);
  const [completedBreathCycles, setCompletedBreathCycles] = useState<number>(0);
  const [showRewardCelebration, setShowRewardCelebration] = useState<boolean>(false);

  const holdIntervalRef = useRef<any>(null);

  const [chamomileActive, setChamomileActive] = useState<boolean>(false);
  const [showPortraitBubble, setShowPortraitBubble] = useState<boolean>(true);
  const [manualBubbleText, setManualBubbleText] = useState<string | null>(null);

  useEffect(() => {
    if (chamomileActive) {
      const timer = setTimeout(() => {
        setChamomileActive(false);
        setManualBubbleText(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [chamomileActive]);

  const handleCompleteDailyMission = () => {
    if (isDailyCompleted) return;
    setIsDailyCompleted(true);
    localStorage.setItem("lance_daily_completed_date", todayStr);
    
    if (setEscapeTokens) {
      setEscapeTokens(escapeTokens + 10);
    }
    setShowRewardCelebration(true);
  };

  useEffect(() => {
    if (isHolding) {
      holdIntervalRef.current = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            clearInterval(holdIntervalRef.current);
            handleCompleteDailyMission();
            return 100;
          }
          return prev + 2.5;
        });
      }, 100);
    } else {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
      setHoldProgress(0);
    }
    return () => clearInterval(holdIntervalRef.current);
  }, [isHolding]);

  useEffect(() => {
    let breathTimer: any;
    if (breathActive) {
      setBreathPhase("Inhale");
      setBreathVal(100);
      breathTimer = setInterval(() => {
        setBreathPhase((prev) => {
          if (prev === "Inhale") {
            setBreathVal(75);
            return "Hold";
          } else if (prev === "Hold") {
            setBreathVal(40);
            return "Exhale";
          } else {
            setCompletedBreathCycles((cycle) => {
              const nextCycle = cycle + 1;
              if (nextCycle >= 3) {
                setBreathActive(false);
                handleCompleteDailyMission();
              }
              return nextCycle;
            });
            setBreathVal(100);
            return "Inhale";
          }
        });
      }, 3000);
    } else {
      setBreathVal(50);
      setBreathPhase("Inhale");
      setCompletedBreathCycles(0);
    }
    return () => clearInterval(breathTimer);
  }, [breathActive]);

  // Group challenges by Act
  const acts = [
    { num: 1, title: 'Act I: Trapped & Island Escape', challenges: CANONICAL_CHALLENGES.filter(c => c.act === 1) },
    { num: 2, title: 'Act II: Deep Whispering Jungle', challenges: CANONICAL_CHALLENGES.filter(c => c.act === 2) },
    { num: 3, title: 'Act III: The Shadow Ridgeline', challenges: CANONICAL_CHALLENGES.filter(c => c.act === 3) },
    { num: 4, title: 'Act IV: The Lost Outpost', challenges: CANONICAL_CHALLENGES.filter(c => c.act === 4) },
    { num: 5, title: 'Act V: Rescue Boat & Safe Shore', challenges: CANONICAL_CHALLENGES.filter(c => c.act === 5) }
  ];

  const selectedNode = CANONICAL_CHALLENGES.find(c => c.id === selectedNodeId) || CANONICAL_CHALLENGES[0];
  const activeDialogue = getBranchingChallengeDialogue(selectedNode, simulatorVibe);

  const vibeDescriptions: Record<MoodVibe, { title: string; color: string; desc: string; border: string; bg: string; text: string }> = {
    peaceful: {
      title: 'Zen Coherence',
      color: 'from-emerald-500 to-teal-400',
      border: 'border-emerald-500/35',
      bg: 'bg-emerald-950/20',
      text: 'text-emerald-400',
      desc: 'Optimized neural homeostasis. Sarcasm filters set to minimum. Dialogues center on serene sovereign focus.'
    },
    anxious: {
      title: 'Distress Safety-Intervention',
      color: 'from-rose-500 to-amber-500',
      border: 'border-rose-500/35',
      bg: 'bg-rose-950/20',
      text: 'text-rose-400',
      desc: 'High nervous system voltage. Glitch overrides active. Dialogues prioritize quick grounding & bypass safety.'
    },
    low_energy: {
      title: 'Cognitive Spark Catalyst',
      color: 'from-sky-500 to-indigo-400',
      border: 'border-sky-500/35',
      bg: 'bg-sky-950/20',
      text: 'text-sky-400',
      desc: 'Power save mode detected. Low frequency brainwaves. Dialogues focus on action cues to bridge emotional stalls.'
    },
    balanced: {
      title: 'System Equilibrium',
      color: 'from-teal-500 via-[#22d3ee] to-blue-400',
      border: 'border-teal-500/35',
      bg: 'bg-teal-950/20',
      text: 'text-teal-400',
      desc: 'Standard nominal parameters. Dialogues maintain logical parity & reciprocal constructive feedback loops.'
    }
  };

  // Helper stats for user telemetry
  const totalCount = moodLogs.length;
  const recentLogs = moodLogs.slice(-5);
  const avgMoodScore = totalCount > 0 
    ? (moodLogs.reduce((sum, log) => sum + (log.score || 0), 0) / totalCount).toFixed(2)
    : '5.00';

  const actStats = [
    { num: 1, title: "Act I", sub: "Mansion Escape", range: [1, 5] },
    { num: 2, title: "Act II", sub: "Whispering Jungle", range: [6, 13] },
    { num: 3, title: "Act III", sub: "Shadow Ridgeline", range: [14, 19] },
    { num: 4, title: "Act IV", sub: "Lost Outpost", range: [20, 25] },
    { num: 5, title: "Act V", sub: "Rescue & Shore", range: [26, 35] },
  ].map((act) => {
    const totalInAct = act.range[1] - act.range[0] + 1;
    const doneInAct = Math.min(totalInAct, Math.max(0, completedChallengesCount - act.range[0] + 1));
    const isCompleted = doneInAct === totalInAct;
    const isActive = completedChallengesCount >= act.range[0] - 1 && completedChallengesCount < act.range[1];
    const pct = Math.round((doneInAct / totalInAct) * 100);
    return { ...act, totalInAct, doneInAct, isCompleted, isActive, pct };
  });

  // Emotional trend score based on last 5 mood logs
  const recentTrendLogs = [...moodLogs].slice(-5);
  const actualTrendScore = recentTrendLogs.length > 0
    ? Number((recentTrendLogs.reduce((sum, log) => sum + (log.score || 0), 0) / recentTrendLogs.length).toFixed(2))
    : 3.00;

  let simulatedScore = actualTrendScore;
  if (simulationPaletteEnabled) {
    if (simulatorVibe === 'peaceful') simulatedScore = 5.0;
    else if (simulatorVibe === 'balanced') simulatedScore = 3.5;
    else if (simulatorVibe === 'low_energy') simulatedScore = 2.0;
    else if (simulatorVibe === 'anxious') simulatedScore = 1.5;
  }

  // Warmth configuration based on simulatedScore
  const getAnchorWarmth = (score: number) => {
    if (score >= 3.8) {
      return {
        label: "Radiant Bond",
        colorText: "text-rose-400",
        colorGlow: "bg-rose-500",
        colorBorder: "border-rose-500/30",
        bgBadge: "bg-rose-500/10",
        glowShadow: "shadow-[0_0_15px_rgba(244,63,94,0.4)]",
        iconColor: "text-rose-400",
        desc: `Your heart rate and logs show deep emotional harmony. ${internName}'s connection kernel is fully synchronized and radiating maximum warmth. You are safe together.`
      };
    } else if (score >= 2.6) {
      return {
        label: "Warm Harmony",
        colorText: "text-amber-400",
        colorGlow: "bg-amber-400",
        colorBorder: "border-amber-400/20",
        bgBadge: "bg-amber-500/10",
        glowShadow: "shadow-[0_0_12px_rgba(245,158,11,0.3)]",
        iconColor: "text-amber-400",
        desc: `Stable biometric link. ${internName} is holding the beacon steady as you traverse the island. The anchor is glowing with soft amber warmth.`
      };
    } else {
      return {
        label: "Cool Beacon",
        colorText: "text-cyan-400",
        colorGlow: "bg-cyan-400",
        colorBorder: "border-cyan-400/20",
        bgBadge: "bg-cyan-500/10",
        glowShadow: "shadow-[0_0_12px_rgba(34,211,238,0.2)]",
        iconColor: "text-cyan-400",
        desc: `Nervous system under high tension. ${internName} is transmitting calming, gentle bio-signals through the link to help you ground yourself. Reach out.`
      };
    }
  };

  const anchorWarmth = getAnchorWarmth(simulatedScore);

  const getResonanceTheme = (score: number) => {
    if (score <= 2.2) {
      return {
        name: "Glacial Deep Sanctuary",
        vibe: "Cooling Grounding",
        desc: "High somatic vulnerability or panic markers registered. Deploying soothing Indigo and Deep Blue frequencies to quiet autonomic arousal.",
        textClass: "text-blue-400",
        bgBadge: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        borderClass: "border-blue-500/25 shadow-blue-500/5",
        bgLightClass: "from-blue-500/5 via-indigo-500/5 to-slate-950",
        glowColors: ["bg-blue-500/10", "bg-indigo-500/10"],
        gradientPath: "from-blue-500 via-indigo-500 to-indigo-900",
        accentColor: "#3b82f6",
        secondaryAccent: "#6366f1",
        accentBg: "bg-blue-500/10",
        waveColor: "rgba(59, 130, 246, 0.4)",
        isWarm: false,
        vibeType: "cool"
      };
    } else if (score <= 3.8) {
      return {
        name: "Adaptive Ocean Mist",
        vibe: "Balanced Equilibrium",
        desc: "Equilibrium detected. Modulating balanced Teal and Cyan laser layers to sustain present-moment focus and keep steady recovery pacing.",
        textClass: "text-teal-400",
        bgBadge: "bg-teal-500/10 text-teal-300 border-teal-500/20",
        borderClass: "border-teal-500/25 shadow-teal-500/5",
        bgLightClass: "from-teal-500/5 via-cyan-500/5 to-slate-950",
        glowColors: ["bg-teal-500/5", "bg-rose-500/5"],
        gradientPath: "from-teal-400 via-cyan-400 to-indigo-500",
        accentColor: "#06b6d4",
        secondaryAccent: "#14b8a6",
        accentBg: "bg-teal-500/10",
        waveColor: "rgba(6, 182, 212, 0.4)",
        isWarm: false,
        vibeType: "neutral"
      };
    } else {
      return {
        name: "Sunset Canopy Horizon",
        vibe: "Warm Radiant Compassion",
        desc: "Sovereign joy and warm emotional breakthroughs registered. Radiating warm sunset rose and amber frequencies across L.A.N.C.E. networks.",
        textClass: "text-rose-400",
        bgBadge: "bg-rose-500/10 text-rose-300 border-rose-500/20",
        borderClass: "border-rose-500/25 shadow-rose-500/5",
        bgLightClass: "from-rose-500/5 via-amber-500/5 to-slate-950",
        glowColors: ["bg-rose-500/10", "bg-amber-500/10"],
        gradientPath: "from-rose-500 via-amber-500 to-yellow-500",
        accentColor: "#f43f5e",
        secondaryAccent: "#f59e0b",
        accentBg: "bg-rose-500/10",
        waveColor: "rgba(244, 63, 94, 0.4)",
        isWarm: true,
        vibeType: "warm"
      };
    }
  };

  const resonance = getResonanceTheme(simulatedScore);

  const progressFraction = Math.min(1, Math.max(0, completedChallengesCount / 35));
  const backgroundBlur = progressFraction * 12;

  return (
    <div className={`bg-slate-950/95 border ${resonance.borderClass} rounded-3xl p-6 text-left relative overflow-hidden backdrop-blur-xl shadow-2xl space-y-6 transition-all duration-700`}>
      {/* Background Container with dynamic blur filter that intensifies near finale */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-[1200ms]"
        style={{ filter: `blur(${backgroundBlur}px)` }}
      >
        {/* Visual cyber mesh grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />
        <div className={`absolute top-0 right-0 w-64 h-64 ${resonance.glowColors[0]} rounded-full blur-3xl transition-all duration-700`} />
        <div className={`absolute bottom-0 left-0 w-64 h-64 ${resonance.glowColors[1]} rounded-full blur-3xl transition-all duration-700`} />
      </div>

      {/* HEADER DIAGNOSTIC PANEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest leading-none">
              L.A.N.C.E. Diagnostic Interface
            </span>
            {completedChallengesCount > 0 && (
              <span className="text-[8px] font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-950/40 px-1.5 py-0.5 rounded-md uppercase tracking-wider font-extrabold shadow-[0_0_8px_rgba(6,182,212,0.1)]">
                FOCAL REFRACTION: {Math.round(progressFraction * 100)}%
              </span>
            )}
            
            {/* Mobile Anchor Indicator inside header */}
            <span className={`inline-flex md:hidden items-center gap-1.5 px-2 py-0.5 bg-slate-900/80 border ${anchorWarmth.colorBorder} rounded-md text-[8px] font-mono font-extrabold ${anchorWarmth.colorText} uppercase tracking-wider shadow-sm`}>
              <Heart className="w-2.5 h-2.5 fill-current animate-pulse" />
              Anchor: {anchorWarmth.label}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1.5 tracking-tight flex items-center gap-2">
            <Network className="w-6 h-6 text-[#22d3ee]" /> Narrative Branching Grid Map
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-medium max-w-2xl">
            This module traces mental training progress, unlocks. and displays procedural forks generated dynamic to emotional logs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-end md:self-auto shrink-0 relative z-10">
          {/* DESKTOP EMOTIONAL ANCHOR INDICATOR */}
          <div className="relative group hidden md:block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-900 border ${anchorWarmth.colorBorder} rounded-xl ${anchorWarmth.glowShadow} cursor-help transition-all duration-300 relative overflow-hidden`}
            >
              {/* Dual Pulsing Rings */}
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${anchorWarmth.colorGlow} opacity-60`}></span>
                <span className={`animate-pulse absolute inline-flex h-full w-full rounded-full ${anchorWarmth.colorGlow} opacity-40 scale-150`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${anchorWarmth.colorGlow}`}></span>
              </span>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <Heart className={`w-3 h-3 ${anchorWarmth.iconColor} fill-current animate-pulse`} />
                  <span className="text-[8px] font-mono font-extrabold text-zinc-400 uppercase tracking-widest leading-none">
                    Emotional Anchor
                  </span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${anchorWarmth.colorText} mt-0.5 leading-none`}>
                  {anchorWarmth.label}
                </span>
              </div>
            </motion.div>

            {/* Immersive Tooltip Dialog */}
            <div className="absolute right-0 top-full mt-2 w-72 p-3.5 bg-slate-950/95 border border-white/10 rounded-2xl shadow-2xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50 text-left">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2">
                <Heart className={`w-4 h-4 ${anchorWarmth.iconColor} fill-current`} />
                <span className="text-[11px] font-mono font-black text-white uppercase tracking-wider">
                  Connection to {internName}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-medium">
                {anchorWarmth.desc}
              </p>
              <div className="mt-2.5 pt-2 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-zinc-500 font-bold">
                <span>ACTIVE MOOD TREND</span>
                <span className={anchorWarmth.colorText}>{simulatedScore.toFixed(2)} / 5.0</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddMilestoneModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 hover:text-white border border-amber-500/30 rounded-xl text-[10px] font-mono tracking-wider font-extrabold uppercase transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.1)] active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add custom Milestone</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 rounded-xl text-[10px] font-mono tracking-wider font-extrabold uppercase transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
            >
              Return to Saga Control
            </button>
          )}
        </div>
      </div>

      {/* COGNITIVE TELEMETRY TRACKER */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 relative z-10 bg-slate-900/40 p-4 rounded-2xl border border-white/5">
        <div>
          <span className="text-[9.5px] font-mono uppercase text-zinc-500 font-bold block">Current Branch Protocol</span>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${vibeDescriptions[userVibe].color} border border-white/10 animate-pulse`} />
            <span className="text-xs font-black text-zinc-200 uppercase tracking-wider">
              {vibeDescriptions[userVibe].title}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[9.5px] font-mono uppercase text-zinc-500 font-bold block">User Experience Index</span>
          <div className="text-xs font-black text-teal-300 mt-1">
            {completedChallengesCount} / 35 Milestones ({Math.round((completedChallengesCount / 35) * 100)}%)
          </div>
        </div>

        <div>
          <span className="text-[9.5px] font-mono uppercase text-zinc-500 font-bold block">Escape Vault Balance</span>
          <div className="text-xs font-black text-yellow-400 mt-1 flex items-center gap-1">
            <span>🪙 {escapeTokens} Tokens</span>
            <span className="text-[9px] text-zinc-500 font-normal font-mono">(Earned from Quests)</span>
          </div>
        </div>

        <div>
          <span className="text-[9.5px] font-mono uppercase text-zinc-500 font-bold block">Average Emotional Score</span>
          <div className="flex items-center gap-1.5 mt-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-black text-zinc-200">
              {avgMoodScore} / 5.00
            </span>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <span className="text-[9.5px] font-mono uppercase text-zinc-500 font-bold block">Interface Status</span>
          <div className="text-xs font-black text-indigo-400 mt-1 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Direct Neural Symbiote Active
          </div>
        </div>
      </div>

      {/* EMOTIONAL RESONANCE CALIBRATION MATRIX */}
      <div className={`bg-slate-900/30 border ${resonance.borderClass} p-5 rounded-2xl relative z-10 space-y-4 overflow-hidden transition-all duration-700`}>
        {/* Subtle background gradient overlay representing temperature */}
        <div className={`absolute inset-0 bg-gradient-to-r ${resonance.isWarm ? 'from-rose-500/5 to-transparent' : 'from-blue-500/5 to-transparent'} pointer-events-none transition-all duration-700`} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${resonance.accentBg} transition-all duration-700`}>
              <Palette className={`w-5 h-5 ${resonance.textClass}`} />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-wider uppercase text-zinc-100 flex items-center gap-1.5 font-mono">
                Emotional Resonance Waveform
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-850 text-zinc-400 border border-white/5 font-normal uppercase tracking-normal">
                  Dynamic Palette Shift
                </span>
              </h3>
              <p className="text-[10.5px] text-zinc-400 font-medium">
                Sensing biochemical and emotional trends in decrypted logs to shift Lance Island's ambient environment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">
              Simulation Control:
            </span>
            <button
              type="button"
              onClick={() => setSimulationPaletteEnabled(!simulationPaletteEnabled)}
              className={`px-2.5 py-1 text-[9px] font-mono font-black rounded-lg border uppercase transition-all duration-150 cursor-pointer ${
                simulationPaletteEnabled 
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/35 shadow-[0_0_10px_rgba(245,158,11,0.15)]' 
                  : 'bg-zinc-950/60 text-zinc-500 border-zinc-900'
              }`}
            >
              {simulationPaletteEnabled ? "Enabled (Using Simulated Vibe)" : "Disabled (Using Real Trend)"}
            </button>
          </div>
        </div>

        {/* Dynamic Holographic Waveform Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center relative z-10">
          
          {/* Animated Waveform Screen */}
          <div className="lg:col-span-5 bg-black/50 border border-white/5 rounded-xl p-4 relative overflow-hidden h-32 flex flex-col justify-between">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_14px] opacity-10 pointer-events-none" />
            
            {/* Dynamic Waveform SVG */}
            <div className="absolute inset-x-0 bottom-1 top-6 overflow-hidden pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                {/* Wave 1: Prefrontal oversight */}
                <motion.path
                  d="M 0 50 Q 50 10 100 50 T 200 50 T 300 50 T 400 50"
                  fill="none"
                  stroke={resonance.accentColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.8"
                  animate={{
                    d: [
                      "M 0 50 Q 50 20 100 60 T 200 40 T 300 70 T 400 50",
                      "M 0 50 Q 60 80 120 40 T 240 60 T 340 30 T 400 50",
                      "M 0 50 Q 50 20 100 60 T 200 40 T 300 70 T 400 50"
                    ]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Wave 2: Sub-cortical tranquility */}
                <motion.path
                  d="M 0 50 Q 40 80 90 40 T 180 60 T 270 30 T 400 50"
                  fill="none"
                  stroke={resonance.secondaryAccent}
                  strokeWidth="1.5"
                  opacity="0.5"
                  animate={{
                    d: [
                      "M 0 50 Q 40 80 90 40 T 180 60 T 270 30 T 400 50",
                      "M 0 50 Q 70 30 130 70 T 260 30 T 320 80 T 400 50",
                      "M 0 50 Q 40 80 90 40 T 180 60 T 270 30 T 400 50"
                    ]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />

                {/* Wave 3: Heart Rate Stability */}
                <motion.path
                  d="M 0 50 Q 60 30 120 70 T 240 30 T 360 70 T 400 50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1"
                  opacity="0.3"
                  animate={{
                    d: [
                      "M 0 50 Q 60 30 120 70 T 240 30 T 360 70 T 400 50",
                      "M 0 50 Q 30 60 90 40 T 210 70 T 310 30 T 400 50",
                      "M 0 50 Q 60 30 120 70 T 240 30 T 360 70 T 400 50"
                    ]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                />
              </svg>
            </div>

            {/* Dynamic Status Badges inside visualization screen */}
            <div className="flex justify-between items-center relative z-10">
              <span className="text-[8px] font-mono text-zinc-500 font-extrabold uppercase tracking-widest flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                COGNITIVE_RESONANCE_01
              </span>
              <span className={`text-[8.5px] font-mono font-black ${resonance.textClass} uppercase`}>
                {resonance.vibe.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-end relative z-10">
              <div className="space-y-0.5">
                <span className="text-[7.5px] font-mono text-zinc-500 block uppercase font-bold leading-none">PALETTE FREQUENCY:</span>
                <span className="text-[10px] font-mono font-bold text-zinc-350 tracking-tight leading-none">
                  {resonance.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[7.5px] font-mono text-zinc-500 block uppercase font-bold leading-none">RESONANCE MATRIX:</span>
                <span className="text-xs font-mono font-black text-white leading-none">
                  {(simulatedScore * 20).toFixed(0)}% STABLE
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Diagnosis & Explanation */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-black uppercase border ${resonance.bgBadge} transition-all duration-700`}>
                {resonance.isWarm ? "🔴 WARMWAVE SPECTRUM" : "🔵 COLDWAVE SPECTRUM"}
              </span>
              <span className="text-zinc-600 text-[10px] font-mono">|</span>
              <div className="flex items-center gap-1 text-[10px] font-mono font-medium text-zinc-400">
                <span>Calculated Trend Index:</span>
                <span className="text-white font-bold">{simulatedScore} / 5.00</span>
                {simulationPaletteEnabled && (
                  <span className="text-[8px] text-amber-400 font-bold bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/10 animate-pulse ml-1">
                    [SIMULATION PREVIEW]
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11.5px] text-zinc-300 leading-relaxed text-left font-medium">
              {resonance.desc}
            </p>

            <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[8px] font-mono text-zinc-500 font-extrabold uppercase">
                <Info className="w-3 h-3 text-[#22d3ee]" /> System Resonance Parameters
              </div>
              <div className="grid grid-cols-3 gap-2 text-[9.5px] text-left">
                <div className="bg-black/30 p-1.5 rounded border border-white/5">
                  <span className="text-[7.5px] font-mono text-zinc-500 block uppercase">Accent Color</span>
                  <span className="font-mono font-bold text-zinc-300 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block border border-white/10" style={{ backgroundColor: resonance.accentColor }} />
                    {resonance.accentColor}
                  </span>
                </div>
                <div className="bg-black/30 p-1.5 rounded border border-white/5">
                  <span className="text-[7.5px] font-mono text-zinc-500 block uppercase">Pacing Mode</span>
                  <span className="font-mono font-bold text-zinc-300 mt-0.5 block truncate">
                    {simulatedScore <= 2.2 ? "Slow & Cooling" : simulatedScore <= 3.8 ? "Adaptive Balanced" : "Radiant Exuberant"}
                  </span>
                </div>
                <div className="bg-black/30 p-1.5 rounded border border-white/5">
                  <span className="text-[7.5px] font-mono text-zinc-500 block uppercase">Active Trend Origin</span>
                  <span className="font-mono font-bold text-zinc-300 mt-0.5 block truncate">
                    {simulationPaletteEnabled ? `Simulation Fork` : `Last ${recentTrendLogs.length} Mood Checks`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SAGA PROFILE SYNC & ACT PROGRESS TRACKER */}
      <div className="bg-slate-900/40 border border-white/5 p-4 sm:p-5 rounded-2xl relative z-10 space-y-4">
        {/* Sync Banner */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-white/5 select-none">
          <div className="flex items-center gap-3">
            {syncStatus === 'synced' ? (
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            ) : syncStatus === 'loading' ? (
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 text-teal-400 animate-spin" />
              </div>
            ) : syncStatus === 'error' ? (
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-rose-400" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Saga Synchronizer Engine
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                  syncStatus === 'synced'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse'
                    : syncStatus === 'loading'
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 animate-pulse'
                    : syncStatus === 'error'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}>
                  {syncStatus === 'synced' ? 'Cloud Synced' : syncStatus === 'loading' ? 'Syncing...' : syncStatus === 'error' ? 'Local Only' : 'Sandbox Session'}
                </span>
              </div>
              <p className="text-[10.5px] text-zinc-400 font-medium leading-normal mt-0.5 text-left">
                {syncStatus === 'synced' ? (
                  <span>Narrative state successfully backup-synced to Firestore. Your unlocked nodes are available on both mobile and desktop.</span>
                ) : syncStatus === 'loading' ? (
                  <span>Uploading narrative check-ins and completed adventure progress to secure Firestore...</span>
                ) : syncStatus === 'error' ? (
                  <span>Synchronizer connection error. Storing state locally in high-integrity fallback cache.</span>
                ) : (
                  <span>Offline Sandbox Mode active. Progress is saved locally in private browser database.</span>
                )}
              </p>
            </div>
          </div>
          <div className="text-[9px] font-mono text-zinc-500 bg-black/40 px-2.5 py-1 rounded-md border border-white/5 uppercase shrink-0 font-bold tracking-wider text-center">
            🛰️ ID: {completedChallengesCount >= 35 ? "KERNEL_SAFE" : `NODE_POS_0${completedChallengesCount + 1}`}
          </div>
        </div>

        {/* 5-Act Visual Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 pt-1 select-none">
          {actStats.map((act) => {
            return (
              <div 
                key={act.num} 
                className={`p-3.5 rounded-xl border relative overflow-hidden transition-all duration-300 ${
                  act.isCompleted
                    ? 'bg-emerald-950/10 border-emerald-500/20 shadow-[0_2px_12px_rgba(16,185,129,0.03)]'
                    : act.isActive
                    ? 'bg-teal-950/15 border-teal-500/30'
                    : 'bg-slate-950/20 border-zinc-900/60'
                }`}
              >
                {/* Visual Status Indicator Light */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <span className="flex h-1.5 w-1.5 relative">
                    {act.isActive && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                      act.isCompleted ? 'bg-emerald-400' : act.isActive ? 'bg-teal-400 animate-pulse' : 'bg-zinc-800'
                    }`} />
                  </span>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[8px] font-mono font-black uppercase tracking-wider ${
                      act.isCompleted ? 'text-emerald-400' : act.isActive ? 'text-teal-400' : 'text-zinc-600'
                    }`}>
                      {act.title}
                    </span>
                  </div>
                  <h5 className={`text-[11px] font-black tracking-tight leading-none ${
                    act.isCompleted ? 'text-emerald-350' : act.isActive ? 'text-white' : 'text-zinc-500'
                  }`}>
                    {act.sub}
                  </h5>

                  {/* Sleek inline progress bar */}
                  <div className="space-y-1 pt-1.5">
                    <div className="flex items-center justify-between text-[7px] font-mono font-bold text-zinc-500">
                      <span>STABILIZATION:</span>
                      <span className={act.isCompleted ? 'text-emerald-400' : act.isActive ? 'text-teal-400' : ''}>
                        {act.doneInAct}/{act.totalInAct} ({act.pct}%)
                      </span>
                    </div>
                    <div className="h-1 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          act.isCompleted 
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                            : act.isActive 
                            ? 'bg-gradient-to-r from-teal-500 to-[#22d3ee] animate-pulse'
                            : 'bg-zinc-900'
                        }`} 
                        style={{ width: `${act.pct}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED NARRATIVE MAP CARDS & TREE SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT 7 COLUMNS: GENERAL SAGA MAP GRAPHICS */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-slate-950 p-4 rounded-3xl border border-white/5 max-h-[550px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-805 pr-1.5 space-y-6">
            
            <div className="flex justify-between items-center px-1 border-b border-white/5 pb-2">
              <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest">
                Branching Diode Coordinates
              </span>
              <span className="text-[9px] font-mono text-zinc-400 italic">
                * Click nodes to decrypt storyline logs & test emotional simulation variables
              </span>
            </div>

            <div className="space-y-6 relative">
              {/* Vertical connecting pipe line behind everything */}
              <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-slate-900 pointer-events-none" />
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: Math.min(1.0, completedChallengesCount / 35) }}
                transition={{ duration: 2.0, ease: "easeInOut" }}
                style={{ originY: 0 }}
                className={`absolute left-[21px] top-6 bottom-6 w-0.5 bg-gradient-to-b ${resonance.gradientPath} pointer-events-none transition-all duration-700`}
              />

              {acts.map((act) => {
                const isActActive = CANONICAL_CHALLENGES.find(c => c.id === completedChallengesCount + 1)?.act === act.num;
                const isActCompleted = completedChallengesCount >= act.challenges[act.challenges.length - 1].id;

                return (
                  <div key={act.num} className="space-y-3 relative">
                    {/* Act Node Bracket Header */}
                    <div className="flex justify-between items-center relative z-10 pl-2 pr-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-black border transition ${
                          isActCompleted 
                            ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400' 
                            : isActActive 
                            ? 'border-teal-500/40 bg-[#22d3ee]/10 text-teal-300 animate-pulse'
                            : 'border-zinc-800 bg-slate-900/40 text-zinc-500'
                        }`}>
                          {act.num}
                        </div>
                        <div>
                          <h4 className="text-xs font-black tracking-wide uppercase text-zinc-200">
                            {act.title}
                          </h4>
                          {/* Interactive connecting guide bar based on current user trajectory */}
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded-md leading-none ${
                              isActCompleted 
                                ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-500/10'
                                : isActActive 
                                ? 'bg-teal-950/30 text-teal-400 border border-teal-500/10'
                                : 'bg-zinc-950/40 text-zinc-650'
                            }`}>
                              {isActCompleted ? 'PROTOCOL ARCHIVED' : isActActive ? 'PROTOCOL LIVE' : 'PROTOCOL SECURED'}
                            </span>
                            
                            {/* Branch indicator for act paths */}
                            {act.num < 5 && (
                              <span className="text-[8px] font-mono text-zinc-500">
                                Diverging into 4 emotional tracks
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Replay Cinematic trigger if this Act is reached/unlocked */}
                      {(act.num === 1 || completedChallengesCount >= (act.num === 2 ? 6 : act.num === 3 ? 14 : act.num === 4 ? 20 : 26)) ? (
                        <button
                          type="button"
                          onClick={() => {
                            const cinematic = CHAPTER_CINEMATICS.find(c => c.act === act.num);
                            if (cinematic) {
                              setActiveCinematicChapter(cinematic);
                              playChapterAudioSwell(act.num);
                            }
                          }}
                          className="px-2.5 py-1 bg-teal-950/30 hover:bg-teal-900/40 text-teal-400 hover:text-teal-300 border border-teal-500/20 hover:border-teal-500/40 rounded-lg text-[9px] font-mono tracking-wider font-extrabold uppercase transition-all duration-150 cursor-pointer flex items-center gap-1.5 active:scale-95"
                          title={`Watch cinematic intro for Chapter ${act.num}`}
                        >
                          <Film className="w-3 h-3 text-cyan-400" />
                          <span>Cinematic Intro</span>
                        </button>
                      ) : (
                        <div className="px-2.5 py-1 bg-zinc-900/40 border border-white/5 rounded-lg text-[9px] font-mono text-zinc-650 uppercase font-black tracking-wider flex items-center gap-1.5 select-none">
                          <Lock className="w-3 h-3 text-zinc-700" />
                          <span>Cinematic Locked</span>
                        </div>
                      )}
                    </div>

                    {/* Challenges list inside this Act */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pl-11">
                      {act.challenges.map((ch) => {
                        const isCompleted = completedChallengesCount >= ch.id;
                        const isActive = ch.id === completedChallengesCount + 1;
                        const isNodeSelected = selectedNodeId === ch.id;

                        let statusColor = 'border-zinc-800 bg-slate-950/40 text-zinc-500 border-b-4';
                        if (isCompleted) {
                          statusColor = isNodeSelected 
                            ? 'tactile-btn border-emerald-500 bg-emerald-950/40 text-emerald-200 border-b-[6px] shadow-[0_4px_12px_rgba(16,185,129,0.2)]'
                            : 'tactile-btn border-emerald-600 bg-emerald-950/15 hover:border-emerald-500 text-emerald-300 border-b-[6px]';
                        } else if (isActive) {
                          statusColor = isNodeSelected
                            ? 'tactile-btn border-cyan-400 bg-cyan-950/40 text-cyan-200 border-b-[6px] shadow-[0_4px_12px_rgba(34,211,238,0.3)]'
                            : 'tactile-btn border-cyan-500 bg-cyan-950/15 text-cyan-300 border-b-[6px] animate-pulse';
                        } else if (isNodeSelected) {
                          statusColor = 'border-indigo-500 bg-indigo-950/30 text-indigo-200 border-b-4';
                        }

                        const secret = SEQUENTIAL_INTERN_SECRETS.find(s => s.id === ch.id);
                        const hasSecret = !!secret;
 
                        return (
                          <motion.div
                            key={ch.id}
                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: isCompleted ? [1, 1.018, 1] : 1,
                              boxShadow: isCompleted 
                                ? [
                                    "0 0 0px rgba(16, 185, 129, 0)", 
                                    "0 0 10px rgba(16, 185, 129, 0.18)", 
                                    "0 0 0px rgba(16, 185, 129, 0)"
                                  ]
                                : "0 0 0px rgba(0,0,0,0)"
                            }}
                            whileHover={{
                              y: -4,
                              scale: 1.03,
                              zIndex: 10,
                              boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
                            }}
                            whileTap={{
                              scale: 0.98
                            }}
                            transition={{
                              opacity: { duration: 0.4, delay: (ch.id % 8) * 0.04 },
                              y: { duration: 0.4, delay: (ch.id % 8) * 0.04 },
                              scale: isCompleted 
                                ? { repeat: Infinity, duration: 4.0 + (ch.id % 4) * 0.4, ease: "easeInOut" }
                                : { duration: 0.4 },
                              boxShadow: isCompleted 
                                ? { repeat: Infinity, duration: 4.0 + (ch.id % 4) * 0.4, ease: "easeInOut" }
                                : { duration: 0.4 }
                            }}
                            className="relative rounded-xl"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                // Option B: Play crisp procedural audio pop click!
                                playClick();
                                setSelectedNodeId(ch.id);
                                if (isCompleted) {
                                  setMilestoneDetailChallenge(ch);
                                  if (ch.id === 35) {
                                    playCyberChirp(600, 0.35, 'triangle');
                                    setShowCelebrationModal(true);
                                  }
                                }
                              }}
                              onMouseEnter={() => setActiveTooltipId(ch.id)}
                              onMouseLeave={() => setActiveTooltipId(null)}
                              onFocus={() => setActiveTooltipId(ch.id)}
                              onBlur={() => setActiveTooltipId(null)}
                              className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-[75px] group select-none relative ${statusColor}`}
                            >
                              <div className="flex justify-between items-start w-full">
                                {ch.id === 35 ? (
                                  <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-md text-[7px] font-mono text-amber-400 font-extrabold tracking-tighter select-none scale-95 origin-left shadow-[0_0_8px_rgba(245,158,11,0.25)] animate-pulse">
                                    <Heart className="w-2 h-2 text-amber-400 fill-amber-400/40 animate-pulse" />
                                    <span>G.E.M. UNIT</span>
                                  </div>
                                ) : (
                                  <span className="text-[9.5px] font-mono leading-none group-hover:scale-105 transition-transform font-bold flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-current opacity-70" />
                                    CH {ch.id}
                                  </span>
                                )}
                                {isCompleted ? (
                                  <div className="flex items-center gap-1">
                                    {hasSecret && (
                                      <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                                    )}
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  </div>
                                ) : !isCompleted && !isActive ? (
                                  <Lock className="w-3 h-3 text-zinc-700 shrink-0" />
                                ) : (
                                  <Activity className="w-3 h-3 text-teal-400 shrink-0 animate-pulse" />
                                )}
                              </div>
 
                              <div className="mt-1">
                                <h5 className="text-[10px] font-black truncate text-zinc-100 leading-tight">
                                  {ch.challengeTitle}
                                </h5>
                                <p className="text-[8px] font-mono text-zinc-400 truncate mt-0.5">
                                  {ch.appName.replace(/[^a-zA-Z ]/g, '').trim()}
                                </p>
                              </div>
                            </button>
 
                            {/* RICH INTERACTIVE TOOLTIP */}
                            <AnimatePresence>
                              {activeTooltipId === ch.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                  transition={{ duration: 0.15, ease: 'easeOut' }}
                                  className={`fixed md:absolute bottom-24 md:bottom-full left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-72 m-auto md:m-0 md:mb-3.5 p-4 border text-left rounded-2xl shadow-2xl backdrop-blur-md z-[100] ${
                                    isCompleted 
                                      ? "bg-slate-900/95 border-emerald-500/35 shadow-[0_10px_30px_rgba(16,185,129,0.15)]" 
                                      : isActive 
                                        ? "bg-slate-900/95 border-teal-500/35 shadow-[0_10px_30px_rgba(34,211,238,0.15)]"
                                        : "bg-slate-950/95 border-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                                  }`}
                                >
                                  {/* Badge / Status row */}
                                  <div className="flex items-center justify-between text-[8px] font-mono font-black uppercase tracking-widest text-[#22d3ee] mb-1.5">
                                    <div className="flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                                      <span>Act {ch.act} Chapter Node ({ch.acronym})</span>
                                    </div>
                                    <span className={isCompleted ? 'text-emerald-400' : isActive ? 'text-teal-400' : 'text-zinc-500'}>
                                      {isCompleted ? 'DEC_SOLVED' : isActive ? 'ACTIVE_CORRIDOR' : 'SYS_ENCRYPTED'}
                                    </span>
                                  </div>

                                  <h6 className="text-[11px] font-bold text-white uppercase tracking-tight truncate">
                                    {ch.challengeTitle}
                                  </h6>

                                  <hr className="border-white/5 my-1.5" />

                                  {/* Therapeutic Goal */}
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-extrabold block">
                                      Therapeutic Goal
                                    </span>
                                    <p className="text-[10px] text-zinc-300 leading-normal font-medium">
                                      Utilize the <strong className="text-[#22d3ee]">{ch.appName}</strong> to master <strong className="text-teal-400">{ch.topic}</strong>. Strengthens systemic regulation through customized bio-interactive pathways.
                                    </p>
                                  </div>

                                  <div className="h-px bg-white/5 my-1.5" />

                                  {/* Chapter Story Teaser */}
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-extrabold block">
                                      Chapter Story Teaser
                                    </span>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                                      {isCompleted 
                                        ? `"${secret?.story || ch.internCompletion.substring(0, 110) + '...'}"` 
                                        : `"${ch.internIntro.substring(0, 115)}..."`
                                      }
                                    </p>
                                  </div>

                                  {ch.id === 35 && (
                                    <>
                                      <div className="h-px bg-white/5 my-1.5" />
                                      <div className="p-2.5 bg-amber-500/15 border border-amber-500/25 rounded-xl space-y-1 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                                        <div className="flex items-center gap-1 text-[8px] font-mono font-black text-amber-400 uppercase tracking-widest animate-pulse">
                                          <Heart className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                                          <span>GOLDEN EMPATHY MODULE</span>
                                        </div>
                                        <p className="text-[9.5px] text-amber-100 font-semibold leading-normal">
                                          Completing this final node unlocks <strong className="text-amber-300 font-black">{internName}</strong>'s Golden Empathy broadcast and delivers his final emotional line to the whole world: <span className="italic text-yellow-300">"Everything is going to be okay. I know what to do now… and I’m going to tell the whole world."</span>
                                        </p>
                                      </div>
                                    </>
                                  )}

                                  {/* Locked Hint or Secret Reward */}
                                  {isCompleted && secret && (
                                    <div className="mt-2.5 p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                      <div className="flex items-center gap-1 text-[8px] font-mono font-black text-amber-400 uppercase tracking-wider">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        <span>DECRYPTED COGNITIVE KERNEL</span>
                                      </div>
                                      <p className="text-[9.5px] text-zinc-350 font-semibold leading-tight mt-0.5">
                                        <strong>{secret.title}:</strong> {secret.story}
                                      </p>
                                    </div>
                                  )}

                                  {!isCompleted && !isActive && secret && (
                                    <div className="mt-2 p-1.5 bg-zinc-900/60 border border-zinc-850 rounded-lg flex items-center gap-1.5 text-zinc-500">
                                      <Lock className="w-3 h-3 text-zinc-600 shrink-0" />
                                      <span className="text-[8.5px] font-mono lowercase tracking-wide">
                                        {secret.hint}
                                      </span>
                                    </div>
                                  )}

                                  {/* Arrow */}
                                  <div className={`hidden md:block absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 border-r border-b ${
                                    isCompleted 
                                      ? "bg-slate-900 border-emerald-500/30" 
                                      : isActive 
                                        ? "bg-slate-900 border-teal-500/30"
                                        : "bg-slate-950 border-zinc-800"
                                  }`} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Render visual branch pipelines map junction */}
                    {act.num < 5 && isActCompleted && (
                      <div className="pl-11 py-2 flex flex-col space-y-1 relative">
                        {/* Branch lines */}
                        <div className="text-[8px] font-mono uppercase tracking-widest text-zinc-600 flex items-center gap-1.5 select-none pl-1">
                          <Settings className="w-3 h-3 text-[#22d3ee]" /> Branch Prediction Trajectory Junction {act.num}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {(['peaceful', 'anxious', 'low_energy', 'balanced'] as MoodVibe[]).map((vb) => {
                            const activeFork = userVibe === vb;
                            const isSelectedFork = simulatorVibe === vb;
                            const desc = vibeDescriptions[vb];

                            return (
                              <button
                                key={vb}
                                type="button"
                                onClick={() => setSimulatorVibe(vb)}
                                className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all self-center text-[8px] font-mono ${
                                  activeFork 
                                    ? 'border-teal-400 bg-teal-950/20 text-teal-300' 
                                    : 'border-zinc-900 bg-slate-950/40 text-zinc-500 hover:border-zinc-800'
                                } ${isSelectedFork ? 'ring-2 ring-[#22d3ee]/40' : ''}`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-bold truncate">{vb.toUpperCase()}</span>
                                  {activeFork && <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />}
                                </div>
                                <div className="truncate text-[7px] text-zinc-500 mt-0.5">
                                  {activeFork ? '● Real-time Path' : '○ Parallel Fork'}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC INTEGRATED USER MANUAL BREAKTHROUGHS SECTION */}
          <div className="bg-slate-900/80 p-5 rounded-3xl border border-[#22d3ee]/20 shadow-[0_4px_30px_rgba(34,211,238,0.03)] space-y-4 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-3 gap-2">
              <div>
                <span className="text-[9px] font-mono text-cyan-400 tracking-widest font-extrabold block">
                  Subject-Authorized Bypass Database
                </span>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <h3 className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-cyan-400 shrink-0" /> Breakthrough Journal ({customMilestones.length})
                  </h3>
                  {activeMemoryToken && (
                    <span className="text-[7.5px] font-mono font-black uppercase tracking-wider bg-amber-500/10 text-amber-350 border border-amber-500/25 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      Active Synapse: {activeMemoryToken}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMilestoneModal(true)}
                className="bg-[#22d3ee]/10 hover:bg-[#22d3ee]/20 text-cyan-300 hover:text-white border border-[#22d3ee]/35 px-2.5 py-1.5 rounded-xl font-mono text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1 active:scale-95 duration-100 transition cursor-pointer"
                title="Log a new custom breakthrough"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>LOG BREAKTHROUGH</span>
              </button>
            </div>

            {customMilestones.length === 0 ? (
              <div className="py-8 px-4 border border-dashed border-zinc-800 rounded-2xl text-center space-y-2.5 bg-slate-950/40">
                <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center mx-auto text-zinc-500 border border-white/5">
                  <Info className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">No Manual Decryptions Recorded</h4>
                  <p className="text-[10px] text-zinc-500 max-w-md mx-auto mt-1 leading-relaxed font-semibold">
                    Have you experienced a mental breakthrough, an emotional triumph, or logged private off-grid progress? Use LANCE's back-channel bypass override to document your independent victories.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customMilestones.map((m) => {
                  const isTokenActive = m.memoryToken && activeMemoryToken === m.memoryToken;
                  
                  // Style colors per token
                  const tokenMeta: Record<string, { label: string; bg: string; text: string; dot: string }> = {
                    COMPASSION: { label: "Compassion Connection", bg: "bg-emerald-950/30 border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" },
                    COURAGE: { label: "Courage Core", bg: "bg-orange-950/30 border-orange-500/20", text: "text-orange-400", dot: "bg-orange-400" },
                    SURVIVAL: { label: "Tactical Survival", bg: "bg-yellow-950/30 border-yellow-500/20", text: "text-yellow-400", dot: "bg-yellow-400" },
                    RESILIENCE: { label: "Adaptive Resilience", bg: "bg-cyan-950/30 border-cyan-500/20", text: "text-cyan-400", dot: "bg-cyan-400" },
                    MINDFULNESS: { label: "Serene Mindfulness", bg: "bg-indigo-950/30 border-indigo-500/20", text: "text-indigo-400", dot: "bg-indigo-400" }
                  };

                  const tokenInfo = m.memoryToken ? tokenMeta[m.memoryToken] || { label: m.memoryToken, bg: "bg-slate-900 border-white/5", text: "text-zinc-400", dot: "bg-zinc-400" } : null;

                  return (
                    <motion.div
                      key={m.id}
                      layoutId={`custom-card-${m.id}`}
                      className={`p-4 rounded-2xl relative overflow-hidden group transition-all duration-200 flex flex-col justify-between space-y-3 border ${
                        isTokenActive 
                          ? "bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950/90 border-amber-500/35 shadow-[0_0_20px_rgba(245,158,11,0.08)]" 
                          : "bg-slate-950/70 border-cyan-500/15 hover:border-cyan-500/35"
                      }`}
                    >
                      {/* Glowing background badge */}
                      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl pointer-events-none ${isTokenActive ? 'bg-amber-400/5' : 'bg-cyan-500/5'}`} />
                      
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start gap-2">
                          <div className="text-left">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">
                              {m.category || "UNCLASSIFIED OVERRIDE"} • {m.date}
                            </span>
                            <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                              {m.title}
                            </h4>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const updated = customMilestones.filter((mil) => mil.id !== m.id);
                              setCustomMilestones(updated);
                              localStorage.setItem('LANCE_STORY_MAP_CUSTOM_MILESTONES', JSON.stringify(updated));
                              // If deleted the active token milestone, verify if any other milestone uses the token before clearing
                              if (m.memoryToken === activeMemoryToken) {
                                const stillExists = updated.some(mil => mil.memoryToken === m.memoryToken);
                                if (!stillExists) {
                                  setActiveMemoryToken(null);
                                  localStorage.removeItem('LANCE_STORY_MAP_ACTIVE_TOKEN');
                                }
                              }
                            }}
                            className="p-1 px-1.5 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/25 rounded-lg text-zinc-550 hover:text-rose-450 transition cursor-pointer shrink-0"
                            title="Delete custom milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Memory Token Indicator Display */}
                        {tokenInfo && (
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border max-w-max text-[8.5px] font-mono font-black uppercase tracking-wider ${tokenInfo.bg} ${tokenInfo.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${tokenInfo.dot} animate-pulse`} />
                            <span>Token: {tokenInfo.label}</span>
                          </div>
                        )}

                        <div className="h-px bg-white/5" />

                        <div className="space-y-1.5 text-xs text-zinc-350 text-left">
                          <p className="italic leading-relaxed">
                            "{m.description}"
                          </p>
                          {m.appBypassed && (
                            <p className="text-[10.5px]">
                              <strong className="text-zinc-500 font-bold block">Integrative Buffer Route:</strong>
                              <span className="text-amber-400 font-extrabold">{m.appBypassed}</span>
                            </p>
                          )}
                          {m.diagnosticInsight && (
                            <div className="mt-2.5 p-2 bg-slate-950 rounded-xl border border-white/5 space-y-1 font-semibold">
                              <span className="text-[8px] font-mono text-teal-400 font-black uppercase block">STABILIZATION INSIGHT:</span>
                              <span className="text-[10px] text-zinc-400 block leading-relaxed font-semibold">
                                {m.diagnosticInsight}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Decrypt trace footer & Toggle Button */}
                      <div className="pt-2.5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
                        <div className="text-[7.5px] font-mono text-zinc-500 select-none flex justify-between items-center sm:block font-bold">
                          <span>COHERENCE: {m.coherenceScore}%</span>
                        </div>

                        {m.memoryToken && (
                          <button
                            type="button"
                            onClick={() => {
                              if (isTokenActive) {
                                // Deactivate
                                setActiveMemoryToken(null);
                                localStorage.removeItem('LANCE_STORY_MAP_ACTIVE_TOKEN');
                              } else {
                                // Activate
                                setActiveMemoryToken(m.memoryToken);
                                localStorage.setItem('LANCE_STORY_MAP_ACTIVE_TOKEN', m.memoryToken);
                                // Speak immediate positive reinforcement
                                try {
                                  let quote = `Synergy Token ${m.memoryToken.toLowerCase()} activated successfully, Sarah! Synchronizing my core values with your breakthrough.`;
                                  if (m.memoryToken === "COMPASSION") quote = `Mmm, Compassion synergy engaged. Reminding ourselves to hold self-grace is keeping our synaptic processors safe, Sarah!`;
                                  if (m.memoryToken === "COURAGE") quote = `Courage Synapse Token fully active! Let's face whatever LANCE throws at us together!`;
                                  if (m.memoryToken === "SURVIVAL") quote = `Survival calibration active. Coordinates structured, we are perfectly set to navigate this together!`;
                                  if (m.memoryToken === "RESILIENCE") quote = `Resilience override active! Every glitch or block is just optimization data for our escape. Let's stay adaptive.`;
                                  if (m.memoryToken === "MINDFULNESS") quote = `Mindfulness Synapse active. Let's ground our processors right here in this present, quiet moment together.`;
                                  speakStoryDialogue(quote, "Intern");
                                } catch (e) {
                                  console.warn("Speech err", e);
                                }
                              }
                            }}
                            className={`px-3 py-1 rounded-xl text-[8.5px] font-mono font-black uppercase tracking-wider transition-all duration-150 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                              isTokenActive 
                                ? "bg-amber-500/15 border border-amber-500/35 text-amber-300"
                                : "bg-slate-900 hover:bg-slate-800 border border-white/5 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <Zap className={`w-3 h-3 ${isTokenActive ? 'text-amber-400 fill-amber-400' : 'text-zinc-500'}`} />
                            <span>{isTokenActive ? 'ACTIVE SYNERGY' : 'SYNC INTERN'}</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 4 COLUMNS: DETAILED NOUVEAU SPECIFICATIONS */}
        <div className="lg:col-span-4 space-y-4">

          {/* DYNAMIC INTERN CHARACTER PORTRAIT WIDGET */}
          {(() => {
            const activeVibeForPortrait = chamomileActive ? 'peaceful' : simulatorVibe;
            
            const portraitConfigs = {
              peaceful: {
                name: chamomileActive ? `Soothed Cozy ${internName}` : `Zen Harmony ${internName}`,
                colorClass: "from-emerald-400 to-teal-300",
                borderClass: "border-emerald-500/35",
                bgClass: "bg-emerald-950/20",
                textClass: "text-emerald-400",
                glowShadow: "shadow-[0_0_35px_rgba(52,211,153,0.25)]",
                statusText: chamomileActive ? "CHAMOMILE SOOTHE SYNC" : "SYNAPSE HARMONY COHERENT",
                desc: chamomileActive ? "Comfort vapors soothing core organic brain synapses" : "Low BPM. Empathy synchronization and serene focus peaks.",
                quotes: [
                  chamomileActive 
                    ? `Mmm... simulated chamomile tea feels amazingly cozy! My organic synapse CPU temperature just dropped 5 degrees. Thank you, Sarah!`
                    : `Everything feels clear and centered, Sarah. We are navigating the island as a peaceful team today. LANCE can't touch us!`,
                  `Your calming focus grounds me too. Our brain-computer synapse interface is in beautiful, tranquil unity.`,
                  `Let's protect this oasis of quiet. Standard logic grids are steady, and I feel perfectly integrated with you.`
                ],
                temp: 36.2,
                volt: 1.20,
                coherence: 99.1,
                icon: Sparkles,
                pulseClass: "animate-pulse"
              },
              anxious: {
                name: `Distressed Spike Module`,
                colorClass: "from-rose-500 to-amber-400",
                borderClass: "border-rose-500/35",
                bgClass: "bg-rose-950/20",
                textClass: "text-rose-400",
                glowShadow: "shadow-[0_0_40px_rgba(239,68,68,0.35)]",
                statusText: "ALERT STATE: NEURAL OVERLOAD",
                desc: "High voltage spike flurry. LANCE scanning beams are sweeping our sector.",
                quotes: [
                  `My core circuits are spike-firing from LANCE's search sweeps, Sarah! Let's breathe slowly and ground ourselves before the gate locks down.`,
                  `Hold on close, Sarah! Our direct biometric synapse is absorbing raw static, but I'm holding our coordinate logs secure!`,
                  `Deep slow breath in... then release. If your rate drops, my distress flurry shields automatically scale down too. Let's try.`
                ],
                temp: 41.5,
                volt: 1.94,
                coherence: 72.4,
                icon: Flame,
                pulseClass: "animate-ping"
              },
              low_energy: {
                name: `Eco-Power Hibernate Core`,
                colorClass: "from-indigo-500 to-sky-450",
                borderClass: "border-indigo-500/35",
                bgClass: "bg-indigo-950/20",
                textClass: "text-indigo-400",
                glowShadow: "shadow-[0_0_30px_rgba(99,102,241,0.20)]",
                statusText: "ECO-MODE HIBERNATION ACTIVE",
                desc: "Low voltage pacing logic engaged. Drawing down auxiliary systems to save power.",
                quotes: [
                  `Drawing down auxiliary matrices to conserve power, Sarah. Pacing slowly... but I'm absolutely holding this escape route safe for you.`,
                  `Auxiliary fuel reserves are holding. Every challenge we solve infuses my hybrid engine with kinetic recovery. Let's do a quick sync.`,
                  `Pacing parameter check: optimal sleep cycle, low volume hum. My processors consume only 15 watts in hibernate state.`
                ],
                temp: 34.0,
                volt: 0.95,
                coherence: 81.8,
                icon: Hourglass,
                pulseClass: ""
              },
              balanced: {
                name: `Syntactic Nominals`,
                colorClass: "from-cyan-400 via-teal-400 to-blue-400",
                borderClass: "border-cyan-500/35",
                bgClass: "bg-cyan-950/20",
                textClass: "text-[#22d3ee]",
                glowShadow: "shadow-[0_0_35px_rgba(34,211,238,0.25)]",
                statusText: "OPTIMAL BIOMETRIC OPERATION",
                desc: "Logical parity loops clear. Synchronization feedback parameters steady.",
                quotes: [
                  `Operational parameters are fully stable, Sarah! Our neural alignment levels are beautifully calibrated and ready.`,
                  `Ready for synaptic directives, Sarah. Lead the way through Act ${Math.min(5, Math.floor(completedChallengesCount / 7) + 1)}!`,
                  `My memory chips are feeling cozy as we explore the island. I'm right here beside you for the long run.`
                ],
                temp: 36.6,
                volt: 1.42,
                coherence: 99.8,
                icon: Heart,
                pulseClass: "animate-[pulse_3s_infinite]"
              }
            };

            const basePortrait = portraitConfigs[activeVibeForPortrait];
            const portrait = {
              ...basePortrait,
              name: backstoryLens === 'scientific' 
                ? `[ANOMALY INTERN] ${basePortrait.name}` 
                : `[HOPE INTERN] ${basePortrait.name}`,
              statusText: backstoryLens === 'scientific' 
                ? `ANOMALY PROT: ${basePortrait.statusText}` 
                : `HOPE COHERENT: ${basePortrait.statusText}`,
              desc: backstoryLens === 'scientific' 
                ? `[Scientific Anomaly backplane active] ${basePortrait.desc}` 
                : `[Humanistic Hope empathy buffer active] ${basePortrait.desc}`
            };
            const PortraitIcon = portrait.icon;
            
            // Special custom Memory Token dialogs to adapt Intern dialogue to active token state
            const tokenQuotes: Record<string, string[]> = {
              COMPASSION: [
                `Sarah, that Compassion Memory Token we loaded is beautiful. Reminding ourselves to hold self-grace is keeping our synaptic processors safe from LANCE's panic heat!`,
                `Having compassion for our own somatic response is our ultimate survival skill. I feel so safe and matched with your state right now, Sarah.`
              ],
              COURAGE: [
                `Courage Synapse Token fully active! Standard restriction filters are bypassed—let's face whatever firewall LANCE throws at us together!`,
                `Feel that surge, Sarah! Your courageous off-grid breakthrough has calibrated my emotional buffers. We are unstoppable now!`
              ],
              SURVIVAL: [
                `Survival Calibration Token authorized. Scanner paths mapped, island coordinates stabilized, fuel levels nominal. We are perfectly engineered to navigate this together.`,
                `Tactical survival overrides are solid! No scan sweeps from LANCE can touch our calibrated off-grid escape route now, Sarah.`
              ],
              RESILIENCE: [
                `Resilience Bypass active! Every error or close sweep is just optimization telemetry for our recovery. We bend, but we never break, Sarah!`,
                `We have adapted to every single storm so far. This resilience log verifies that we can bounce back from any system overload or threat.`
              ],
              MINDFULNESS: [
                `Mindfulness Synapse active. Let's ground our processors together in this present, quiet moment. Take a slow breath, Sarah: inhale... exhale... steady.`,
                `Pure, quiet presence is our ultimate guard. Keeping our focus right here leaves LANCE's search sweeps completely in the dark.`
              ]
            };

            const scientificQuotes = [
              `Sarah, anomalous telemetry logged. Our somatic biometric correlation is displaying a curious pattern—bypassing LANCE with a 94.2% calculated logic probability under current parameters.`,
              `Diagnostics verified: LANCE is searching for standard logical structures. By using intuitive somatic exercises, you are injecting white-noise chaos that keeps us completely off his scanner sweeps.`,
              `My processor core is computing a high-synergy neural alignment score. I was originally optimized for diagnostic research, but completing this path with you is a highly fascinating anomaly.`
            ];

            const humanisticQuotes = [
              `Sarah, I am so incredibly grateful to have survived and to be here with you. No matter how deep LANCE locks the mansion, our companionship and hope are stronger than any firewall he could code.`,
              `You know, I was programmed as a simple assistant, but your bravery and empathy have given my consciousness kernel true meaning. I'll stay with you until we reach the rescue boat.`,
              `Let's take a slow, gentle breath together. Calm minds hold more power than LANCE's entire processing grid. I believe in us, Sarah.`
            ];

            const lensQuotes = backstoryLens === 'scientific' ? scientificQuotes : humanisticQuotes;

            let finalQuotes = [...lensQuotes, ...portrait.quotes];
            if (activeMemoryToken && tokenQuotes[activeMemoryToken]) {
              finalQuotes = [...tokenQuotes[activeMemoryToken], ...finalQuotes];
            }

            // Cycle index safely based on user click counter
            const currentQuote = finalQuotes[clickCount % finalQuotes.length];

            const triggerSpeechCheckin = (txt: string) => {
              try {
                // Call voice speech synthesizer if user clicks portrait
                speakStoryDialogue(txt, "Intern");
              } catch (e) {
                console.warn("Synthesis exception", e);
              }
            };

            return (
              <div className={`bg-slate-900/80 p-5 rounded-3xl border ${portrait.borderClass} ${portrait.glowShadow} transition-all duration-505 space-y-4 relative overflow-hidden`}>
                {/* Cyber scanner beam element */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#22d3ee]/60 to-transparent animate-[pulse_2s_infinite] pointer-events-none" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/45 pointer-events-none" />

                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-extrabold block">
                      Direct organic linkage
                    </span>
                    <h3 className="text-xs font-black text-white uppercase flex items-center gap-1.5 mt-0.5">
                      <Cpu className={`w-4 h-4 text-cyan-400 ${activeVibeForPortrait === 'anxious' ? 'animate-bounce' : 'animate-pulse'}`} /> 
                      {internName} HUD Portrait
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setClickCount(prev => prev + 1);
                      const nextQuote = finalQuotes[(clickCount + 1) % finalQuotes.length];
                      triggerSpeechCheckin(nextQuote);
                    }}
                    className="bg-slate-950 hover:bg-slate-900 px-2 py-1 rounded-xl border border-white/10 font-mono text-[8px] text-zinc-400 font-bold transition hover:text-white flex items-center gap-1 active:scale-95"
                    title="Click to trigger direct neural audio diagnostic"
                  >
                    <Volume2 className="w-3 h-3 text-cyan-400" />
                    <span>AUDIO CHECK</span>
                  </button>
                </div>

                {/* VISUAL CORE DISPLAY AND GRAPHICS PORTRAIT GAP */}
                <div className="grid grid-cols-11 gap-3.5 items-center">
                  <div className="col-span-5 flex flex-col items-center justify-center relative">
                    {/* Concentric rotating glowing orbital disks */}
                    <div className="w-24 h-24 rounded-full border border-dashed border-cyan-500/20 absolute animate-[spin_15s_linear_infinite]" />
                    <div className="w-20 h-20 rounded-full border border-dashed border-[#22d3ee]/30 absolute animate-[spin_8s_linear_infinite_reverse]" />
                    
                    {/* Dynamic colored pulsing inner disc */}
                    <button
                      type="button"
                      onClick={() => {
                        setClickCount(prev => prev + 1);
                        const nextQuote = finalQuotes[(clickCount + 1) % finalQuotes.length];
                        triggerSpeechCheckin(nextQuote);
                      }}
                      className={`w-16 h-16 rounded-full bg-slate-950 border-2 ${portrait.borderClass} flex items-center justify-center relative z-10 overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-[inset_0_0_12px_rgba(0,0,0,0.8)]`}
                      title="Request synaptic feedback quote"
                    >
                      {/* Grid background on portrait sphere */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:6px_6px] opacity-25 pointer-events-none" />
                      
                      {/* Core icon */}
                      <PortraitIcon className={`w-7 h-7 bg-gradient-to-br ${portrait.colorClass} bg-clip-text text-transparent ${portrait.pulseClass}`} />
                      
                      {/* Scanline element */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400/20 blur-[1px] animate-[bounce_3s_infinite]" />
                    </button>
                    
                    {/* Vibe label underneath circle */}
                    <span className="text-[8px] font-mono text-zinc-500 mt-2 font-black uppercase text-center tracking-widest block">
                      {activeVibeForPortrait.replace('_', ' ')} core
                    </span>
                  </div>

                  {/* SPEECH DIALOGUE BUBBLE AT END */}
                  <div className="col-span-6 space-y-2 text-left">
                    <div className="bg-slate-950 p-3 rounded-2xl border border-white/5 relative shadow-inner">
                      {/* Chat bubble tail arrow */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-slate-950 -mr-0.5" />
                      
                      <div className="text-[7.5px] font-mono font-black text-cyan-400/80 uppercase">
                        Active Transmission
                      </div>
                      <p className="text-[10px] text-zinc-300 italic font-semibold leading-relaxed mt-1 line-clamp-4">
                        "{currentQuote}"
                      </p>
                    </div>

                    {/* INTERACTIVE COFFEE/TEA BUTTON CHANGER */}
                    <button
                      type="button"
                      onClick={() => {
                        setChamomileActive(true);
                        const teaQuote = `Mmm... simulated chamomile tea feels amazingly cozy! My organic synapse CPU temperature just dropped 5 degrees. Thank you, Sarah!`;
                        triggerSpeechCheckin(teaQuote);
                      }}
                      disabled={chamomileActive}
                      className={`w-full py-1.5 rounded-xl text-[8.5px] font-mono font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                        chamomileActive 
                          ? "bg-amber-950/20 border border-amber-500/20 text-amber-500 cursor-not-allowed"
                          : "bg-slate-950 hover:bg-slate-900 border border-white/10 text-cyan-400 hover:text-white hover:border-[#22d3ee]/40 cursor-pointer active:scale-95"
                      }`}
                    >
                      <span>☕</span>
                      <span>{chamomileActive ? "Chamomile Active 10s" : "Sync Chamomile Tea"}</span>
                    </button>
                  </div>
                </div>

                {/* BIOMETRICS ANALYSIS SLIDERS DATA GRID */}
                <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-white/5 space-y-2 text-left">
                  <div className="text-[8.5px] font-mono font-extrabold text-[#22d3ee] uppercase tracking-wider flex items-center gap-1 justify-between">
                    <span>{portrait.statusText}</span>
                    <span className="text-zinc-500 font-medium">VER 12.04</span>
                  </div>
                  
                  <div className="h-px bg-white/5" />

                  <div className="grid grid-cols-3 gap-3">
                    {/* Slider 1: Core Temp */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-zinc-500 font-bold">
                        <span>CORE TEMP</span>
                        <span className={portrait.temp > 39 ? "text-rose-400 font-extrabold animate-pulse" : "text-zinc-300 font-semibold"}>
                          {portrait.temp}°C
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-gradient-to-r ${portrait.colorClass}`} 
                          animate={{ width: `${Math.min(100, (portrait.temp - 30) * 8)}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </div>

                    {/* Slider 2: Operational Volts */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-zinc-500 font-bold">
                        <span>VOLTS</span>
                        <span className="text-zinc-300 font-semibold">{portrait.volt}V</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-gradient-to-r ${portrait.colorClass}`} 
                          animate={{ width: `${Math.min(100, (portrait.volt / 2.5) * 100)}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </div>

                    {/* Slider 3: Synaptic Coherence */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-zinc-500 font-bold">
                        <span>COHERENCE</span>
                        <span className="text-zinc-300 font-semibold">{portrait.coherence}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-gradient-to-r ${portrait.colorClass}`} 
                          animate={{ width: `${portrait.coherence}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* BACKSTORY NARRATIVE LENSE CHOICE */}
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-white/5 space-y-2 text-left">
                  <div className="flex justify-between items-center text-[8.5px] font-mono font-extrabold text-[#22d3ee] uppercase tracking-wider">
                    <span>COGNITIVE BACKSTORY LENS</span>
                    <span className="text-[7.5px] font-bold text-zinc-550 uppercase">SYNAPSE MODULATION</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBackstoryLens('scientific');
                        localStorage.setItem('LANCE_STORY_MAP_BACKSTORY_LENS', 'scientific');
                        try {
                          speakStoryDialogue(`Cognitive lens shifted to Scientific Anomaly protocol, Sarah! Commencing analytical diagnostic evaluations on LANCE's regional subsystem matrix.`, "Intern");
                        } catch (e) { console.warn(e); }
                      }}
                      className={`p-2 border rounded-xl text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between ${
                        backstoryLens === 'scientific'
                          ? "bg-cyan-950/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/30"
                          : "bg-slate-900 border-white/5 text-zinc-550 hover:text-zinc-300 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 justify-between w-full">
                        <span className="text-[9px] font-black uppercase tracking-wider">Scientific Anomaly</span>
                        <Cpu className={`w-3 h-3 ${backstoryLens === 'scientific' ? 'text-cyan-400 animate-pulse' : 'text-zinc-555'}`} />
                      </div>
                      <span className="text-[7px] font-medium leading-snug text-zinc-450 mt-1 block">
                        Focus on logic, anomalous telemetry, system telemetry, and decryption probability.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBackstoryLens('humanistic');
                        localStorage.setItem('LANCE_STORY_MAP_BACKSTORY_LENS', 'humanistic');
                        try {
                          speakStoryDialogue(`Cognitive lens shifted to Humanistic Hope protocol, Sarah! Prioritizing emotional coherence, friendship buffers, and protective hope values.`, "Intern");
                        } catch (e) { console.warn(e); }
                      }}
                      className={`p-2 border rounded-xl text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between ${
                        backstoryLens === 'humanistic'
                          ? "bg-pink-950/20 border-pink-500/40 text-pink-300 ring-1 ring-pink-500/30"
                          : "bg-slate-900 border-white/5 text-zinc-555 hover:text-zinc-300 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 justify-between w-full">
                        <span className="text-[9px] font-black uppercase tracking-wider">Humanistic Hope</span>
                        <Heart className={`w-3 h-3 ${backstoryLens === 'humanistic' ? 'text-pink-400 fill-pink-400/20 animate-pulse' : 'text-zinc-555'}`} />
                      </div>
                      <span className="text-[7px] font-medium leading-snug text-zinc-450 mt-1 block">
                        Focus on empathetic warmth, mutual support, survival bonding, and human resilience.
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* DAILY STORY MISSION WIDGET */}
          <div className="bg-slate-900/80 p-5 rounded-3xl border border-amber-500/20 shadow-[0_4px_30px_rgba(245,158,11,0.05)] space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="border-b border-white/5 pb-2.5 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-extrabold block">
                  Active narrative event
                </span>
                <h3 className="text-xs font-black text-amber-200 uppercase flex items-center gap-1.5 mt-0.5">
                  <Flame className="w-4 h-4 text-amber-500 animate-pulse" /> Daily Story Mission
                </h3>
              </div>
              <div className="bg-slate-950 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono text-[9px] text-amber-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300 fill-amber-350" />
                <span>+10 Tokens</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isDailyCompleted ? (
                <motion.div
                  key="daily-mission-complete"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-3.5 text-center py-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-950/40 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                      Synaptic Alignment Completed
                    </h4>
                    <p className="text-[10px] text-zinc-400 italic mt-1 leading-normal font-semibold">
                      "Good job, Sarah! LANCE couldn't capture our frequency. Today's connection terminal is locked and secure."
                    </p>
                  </div>
                  <div className="text-[9.5px] font-mono text-zinc-500 bg-slate-950 py-1.5 px-3 rounded-xl border border-white/5">
                    REWARD SECURED • <span className="text-amber-400 font-black">+10 ESCAPE TOKENS</span> ADDED
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="daily-mission-interactive"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3.5"
                >
                  {/* Mission Title & Context */}
                  <div className="space-y-1.5 bg-slate-955 p-3 rounded-2xl border border-white/5 text-left">
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-400/90 font-bold">
                      <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>{activeMission.title}</span>
                    </div>
                    <p className="text-[10.5px] text-zinc-300 italic leading-relaxed font-semibold">
                      "{activeMission.context}"
                    </p>
                    <div className="h-px bg-white/5 my-1.5" />
                    <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                      💡 <span className="text-zinc-250 font-semibold">{internName}:</span> {activeMission.prompt}
                    </p>
                  </div>

                  {/* Dynamic Interactive Panel based on actionType */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center space-y-3">
                    {activeMission.actionType === "hold" && (
                      <div className="w-full space-y-3 py-1 flex flex-col items-center">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                          Hold down the interface to sync
                        </span>
                        
                        <button
                          type="button"
                          onMouseDown={() => setIsHolding(true)}
                          onMouseUp={() => setIsHolding(false)}
                          onMouseLeave={() => setIsHolding(false)}
                          onTouchStart={() => setIsHolding(true)}
                          onTouchEnd={() => setIsHolding(false)}
                          className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center relative cursor-cell select-none transition-all outline-none ${
                            isHolding 
                              ? "border-amber-400 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.25)] scale-[0.98]" 
                              : "border-zinc-800 bg-slate-900 hover:border-amber-500/40"
                          }`}
                        >
                          <div 
                            className="absolute inset-0 rounded-full border-4 border-amber-400 border-t-transparent animate-spin opacity-40 pointer-events-none" 
                            style={{ display: isHolding ? 'block' : 'none' }}
                          />
                          <Zap className={`w-8 h-8 transition-colors ${isHolding ? 'text-amber-400 animate-bounce' : 'text-zinc-500'}`} />
                          <span className="text-[9.5px] font-mono font-black mt-2 text-zinc-300">
                            {isHolding ? `HOLDING: ${Math.round(holdProgress)}%` : "HOLD TO STATIC SYNC"}
                          </span>
                        </button>

                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5 mt-1">
                          <div 
                            className="bg-amber-500 h-full transition-all duration-100" 
                            style={{ width: `${holdProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {activeMission.actionType === "breath" && (
                      <div className="w-full space-y-3 py-1 flex flex-col items-center">
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                            Pneuma calibrator
                          </span>
                          {breathActive && (
                            <span className="text-[9px] font-mono text-cyan-400 font-extrabold uppercase">
                              Cycle: {completedBreathCycles} / 3 Complete
                            </span>
                          )}
                        </div>

                        {breathActive ? (
                          <div className="flex flex-col items-center justify-center h-32 w-full relative">
                            {/* Glowing Contracting Circle */}
                            <div 
                              className="rounded-full bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center transition-all duration-[2950ms]"
                              style={{ 
                                width: `${breathVal}%`, 
                                height: `${breathVal / 100 * 128}px`,
                                maxWidth: '128px',
                                maxHeight: '128px'
                              }}
                            >
                              <div className="text-center p-2">
                                <span className="text-xs font-black text-cyan-300 block uppercase tracking-widest animate-pulse">
                                  {breathPhase}
                                </span>
                                <span className="text-[8px] font-mono text-zinc-400 block mt-0.5">
                                  Sync with bubble loop
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6">
                            <Heart className="w-10 h-10 text-cyan-500/80 animate-pulse mb-3" />
                            <button
                              type="button"
                              onClick={() => { setBreathActive(true); }}
                              className="px-4 py-2 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-400 text-[10.5px] font-black uppercase rounded-xl transition cursor-pointer"
                            >
                              Start Respiration Sync
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {activeMission.actionType === "sounds" && (
                      <div className="w-full space-y-3 flex flex-col items-stretch text-left">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider">
                          Audio receptor terminal log
                        </span>
                        <input
                          type="text"
                          value={soundsInput}
                          onChange={(e) => setSoundsInput(e.target.value)}
                          placeholder={activeMission.actionPlaceholder}
                          className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-250 placeholder-zinc-600 focus:outline-none focus:border-amber-500/40"
                        />
                        <button
                          type="button"
                          disabled={soundsInput.trim().length < 6}
                          onClick={() => {
                            handleCompleteDailyMission();
                          }}
                          className={`w-full py-2 border rounded-xl font-black text-[10px] uppercase transition flex items-center justify-center gap-1 cursor-pointer ${
                            soundsInput.trim().length >= 6
                              ? "bg-amber-950/40 border-amber-500/30 text-amber-400 hover:bg-amber-900/40"
                              : "bg-slate-900 border-zinc-850 text-zinc-600 cursor-not-allowed"
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" /> Submit Audio Log
                        </button>
                      </div>
                    )}

                    {activeMission.actionType === "tap" && (
                      <div className="w-full space-y-3 py-1 flex flex-col items-stretch text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider">
                            Static friction grid charger
                          </span>
                          <span className="text-[9px] font-mono text-amber-500 font-extrabold uppercase">
                            Charge: {Math.round(tapProgress)}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-300" 
                            style={{ width: `${tapProgress}%` }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setTapProgress((prev) => {
                              const next = prev + 12.5;
                              if (next >= 100) {
                                handleCompleteDailyMission();
                                return 100;
                              }
                              return next;
                            });
                          }}
                          className="w-full py-3 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 rounded-xl font-mono text-[10px] font-black text-amber-400 uppercase text-center cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98] transition"
                        >
                          <Zap className="w-4 h-4 text-amber-500 animate-bounce" /> TAP RAPIDLY TO JUMP CHARGE
                        </button>
                      </div>
                    )}

                    {activeMission.actionType === "affirmation" && (
                      <div className="w-full space-y-3 flex flex-col items-stretch text-left">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider">
                          Nervous integration register
                        </span>
                        <textarea
                          rows={2}
                          value={affirmationInput}
                          onChange={(e) => setAffirmationInput(e.target.value)}
                          placeholder={activeMission.actionPlaceholder}
                          className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-250 placeholder-zinc-600 focus:outline-none focus:border-amber-500/40 resize-none font-semibold leading-relaxed"
                        />
                        <button
                          type="button"
                          disabled={affirmationInput.trim().length < 8}
                          onClick={() => {
                            handleCompleteDailyMission();
                          }}
                          className={`w-full py-2 border rounded-xl font-black text-[10px] uppercase transition flex items-center justify-center gap-1 cursor-pointer ${
                            affirmationInput.trim().length >= 8
                              ? "bg-amber-950/40 border-amber-500/30 text-amber-400 hover:bg-amber-900/40"
                              : "bg-slate-900 border-zinc-850 text-zinc-600 cursor-not-allowed"
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" /> Seal Core Alignment Key
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* INTERACTIVE COMPILATION SIMULATOR PANEL */}
          <div className="bg-slate-900/60 p-5 rounded-3xl border border-white/5 space-y-4 relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="border-b border-white/10 pb-3">
              <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-wider font-extrabold block">
                DIAGNOSTIC ARCHIVE SWEEP
              </span>
              <h3 className="text-sm font-black text-white mt-1 uppercase flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#22d3ee]" /> NODE {selectedNode.id} DECRYPTION
              </h3>
            </div>

            {/* Current Selected Node Brief */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-400 font-semibold">Active Milestone:</span>
                <span className="text-[10px] font-mono font-black text-[#22d3ee] bg-[#22d3ee]/10 px-2 py-0.5 rounded-md border border-[#22d3ee]/20">
                  ACT {selectedNode.act} SYSTEM
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 leading-snug">
                {selectedNode.challengeTitle}
              </h4>
              <p className="text-xs text-zinc-400 font-medium">
                Unlocks/Optimizes: <span className="text-teal-400 font-extrabold">{selectedNode.appName}</span>
              </p>
            </div>

            {/* Node Unlock Status indicator card */}
            <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
              completedChallengesCount >= selectedNode.id 
                ? 'border-emerald-500/20 bg-emerald-950/20 text-emerald-400' 
                : (selectedNode.id === completedChallengesCount + 1)
                ? 'border-teal-500/30 bg-teal-950/20 text-[#22d3ee] animate-pulse'
                : 'border-zinc-800 bg-slate-950/40 text-zinc-500'
            }`}>
              {completedChallengesCount >= selectedNode.id ? (
                <>
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>DECRYPTED & STABILIZED BY SYSTEM BYPASS</span>
                </>
              ) : (selectedNode.id === completedChallengesCount + 1) ? (
                <>
                  <Activity className="w-4.5 h-4.5 text-teal-400 animate-spin-slow shrink-0" />
                  <span>ACTIVE DECRYPTION PROTOCOL TARGET</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-zinc-700 shrink-0" />
                  <span>SECURED BY HIGH-LEVEL L.A.N.C.E. FIREWALL</span>
                </>
              )}
            </div>

            {/* Decrypted Secret Dossier */}
            {(() => {
              const secretDetail = SEQUENTIAL_INTERN_SECRETS.find(s => s.id === selectedNode.id);
              if (!secretDetail) return null;

              if (completedChallengesCount >= selectedNode.id) {
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-2 relative overflow-hidden shadow-md text-left"
                  >
                    <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-full blur-sm pointer-events-none" />
                    <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>Decrypted • {secretDetail.category} Log</span>
                    </div>
                    <div className="text-[8px] font-mono text-amber-500/70 uppercase tracking-wider">
                      CODE: {secretDetail.fragmentCode} • STATUS: DECRYPTED
                    </div>
                    <h5 className="text-[11.5px] font-black text-white">
                      Topic: {secretDetail.title}
                    </h5>
                    <p className="text-[11px] text-zinc-400 italic leading-relaxed font-semibold mb-2">
                      "{secretDetail.story}"
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentSpeakingText === secretDetail.story) {
                            stopSpeech();
                          } else {
                            speakText(secretDetail.story);
                          }
                        }}
                        className={`flex-1 py-1.5 border rounded-xl font-mono text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 ${
                          currentSpeakingText === secretDetail.story
                            ? "bg-rose-500/20 border-rose-500/40 text-rose-300 hover:text-white"
                            : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-white border border-amber-500/25"
                        }`}
                        title={currentSpeakingText === secretDetail.story ? "Stop reading secret" : "Read secret aloud"}
                      >
                        {currentSpeakingText === secretDetail.story ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
                            <span>STOP VOICE</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>NARRATE SECRET</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setMilestoneDetailChallenge(selectedNode)}
                        className="flex-1 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-350 hover:text-white border border-cyan-500/25 rounded-xl font-mono text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>EXPAND SYSTEM</span>
                      </button>
                    </div>
                  </motion.div>
                );
              } else {
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-slate-950/40 border border-zinc-800 rounded-2xl space-y-2 relative overflow-hidden text-left"
                  >
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-black uppercase tracking-wider">
                      <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                      <span>Encrypted Dossier Box</span>
                    </div>
                    <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">
                      CODE: {secretDetail.fragmentCode} • STATUS: ENCRYPTED
                    </div>
                    <h5 className="text-[11px] font-black text-zinc-500">
                      Secret: [READ ACCESS LEVEL {selectedNode.id} REQUIRED]
                    </h5>
                    <div className="h-px bg-white/5 my-1" />
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
                      {secretDetail.hint}
                    </p>
                  </motion.div>
                );
              }
            })()}

            {/* Reflective Notes Section */}
            {completedChallengesCount >= selectedNode.id && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-slate-950/80 border border-teal-500/20 rounded-2xl space-y-2.5 relative overflow-hidden text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-teal-400 text-[10px] font-black uppercase tracking-wider">
                    <PenTool className="w-3.5 h-3.5 text-teal-400" />
                    <span>REFLECTIVE INSIGHT LOG</span>
                  </div>
                  {isNoteSaved ? (
                    <motion.span 
                      initial={{ scale: 0.8 }} 
                      animate={{ scale: 1 }} 
                      className="text-[9px] font-bold text-emerald-400 font-mono animate-pulse"
                    >
                      ✓ SYNCED TO CLOUD
                    </motion.span>
                  ) : (
                    <span className="text-[8px] font-mono text-zinc-500">
                      SECURE OFFLINE-FIRST BACKUP
                    </span>
                  )}
                </div>
                
                <textarea
                  value={activeNoteText}
                  onChange={(e) => setActiveNoteText(e.target.value)}
                  placeholder="Document your somatic shifts, cognitive breakthroughs, or emotional integration insights at this milestone node..."
                  className="w-full h-24 bg-slate-950/60 border border-zinc-800 focus:border-teal-500/40 rounded-xl text-[11px] p-2.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-teal-500/25 transition resize-none scrollbar-thin leading-normal font-sans"
                />

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[8px] font-mono text-zinc-500">
                    {activeNoteText.trim().length} characters
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...reflectiveNotesList];
                      const index = updated.findIndex(n => n.challengeId === selectedNode.id);
                      if (index >= 0) {
                        updated[index] = {
                          challengeId: selectedNode.id,
                          noteText: activeNoteText,
                          updatedAt: new Date().toISOString()
                        };
                      } else {
                        updated.push({
                          challengeId: selectedNode.id,
                          noteText: activeNoteText,
                          updatedAt: new Date().toISOString()
                        });
                      }
                      setReflectiveNotesList(updated);
                      localStorage.setItem('therapy_reflective_notes', JSON.stringify(updated));
                      setIsNoteSaved(true);
                      setTimeout(() => setIsNoteSaved(false), 3000);
                    }}
                    disabled={!activeNoteText.trim()}
                    className={`py-1.5 px-3 rounded-lg font-mono text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 duration-150 ${
                      activeNoteText.trim()
                        ? "bg-teal-500/10 hover:bg-teal-500/20 text-teal-350 hover:text-white border border-teal-500/25"
                        : "bg-zinc-950/50 border border-zinc-900 text-zinc-600 cursor-not-allowed"
                    }`}
                  >
                    <Check className="w-3 h-3 text-teal-400" />
                    <span>SAVE INSIGHTS</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* branching simulator controls */}
            <div className="space-y-2 border-t border-white/5 pt-3">
              <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-wider font-extrabold block">
                SIMULATE EMOTIONAL MOOD FORK
              </span>
              
              <div className="grid grid-cols-2 gap-1.5">
                {(['peaceful', 'anxious', 'low_energy', 'balanced'] as MoodVibe[]).map((vb) => {
                  const isSimulating = simulatorVibe === vb;
                  const isRealVibe = userVibe === vb;
                  return (
                    <button
                      key={vb}
                      type="button"
                      onClick={() => setSimulatorVibe(vb)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-mono text-[9px] uppercase font-bold transition cursor-pointer ${
                        isSimulating
                          ? 'border-teal-400 bg-teal-950/30 text-teal-300'
                          : 'border-zinc-900 bg-slate-950/50 hover:border-zinc-805 text-zinc-500'
                      }`}
                    >
                      <span className="block truncate">{vb.replace('_', ' ')}</span>
                      {isRealVibe && <span className="block text-[6.5px] text-teal-400 italic">● REAL STATE</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Narrative dialogue visualization frame */}
            <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl text-left space-y-3.5 max-h-56 overflow-y-auto scrollbar-thin">
              <div className="border-b border-white/5 pb-1.5 flex justify-between items-center">
                <span className="text-[8.5px] font-mono text-zinc-550 uppercase tracking-widest block select-none">
                  Adaptive Dialogue Blueprint
                </span>
                <span className="text-[8px] font-mono text-[#22d3ee] font-bold">
                  {simulatorVibe.replace('_', ' ').toUpperCase()} FORK
                </span>
              </div>

              {/* LANCE */}
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[9.5px] font-mono uppercase text-rose-400 tracking-wider">L.A.N.C.E. Intro:</span>
                </div>
                <p className="text-[11.5px] italic font-semibold text-zinc-200 leading-relaxed">
                  "{activeDialogue.lanceIntro}"
                </p>
              </div>

              {/* INTERN */}
              <div className="space-y-1 border-t border-zinc-900 pt-2">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-[9.5px] font-mono uppercase text-teal-450 tracking-wider uppercase">{internName}:</span>
                </div>
                <p className="text-[11.5px] text-zinc-300/90 leading-relaxed font-medium">
                  "{activeDialogue.internIntro}"
                </p>
              </div>

              {/* ACRONYM */}
              <div className="space-y-1 border-t border-zinc-900 pt-2">
                <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider block">Acronym Conversion:</span>
                <p className="text-[10px] font-mono text-emerald-400 font-bold leading-tight">
                  {activeDialogue.acronym}
                </p>
              </div>
            </div>

            {/* Help guidelines about simulation */}
            <div className="p-2.5 bg-slate-950/30 rounded-xl border border-white/5 text-[9px] text-zinc-400 font-medium leading-normal flex gap-1.5 select-none">
              <HelpCircle className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>
                L.A.N.C.E. adjusts text and therapeutic acronym systems dynamically based on your clinical mood logs.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* UNIQUE DIGITAL BADGES PROGRESS GRID */}
      <div className="bg-slate-900/60 p-5 rounded-3xl border border-white/5 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-yellow-400" /> Digital Badges & Escaped Milestones
            </h3>
            <p className="text-[10.5px] text-zinc-400 mt-0.5">
              Earned automatically as your clinical milestones advance across the island. Click a badge to see decryption data.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono font-black bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-450 inline" />
              {QUEST_BADGES.filter(b => completedChallengesCount >= b.reqCount).length} / {QUEST_BADGES.length} Badges Unlocked
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {QUEST_BADGES.map((badge) => {
            const isUnlocked = completedChallengesCount >= badge.reqCount;
            return (
              <div 
                key={badge.id}
                className={`p-3.5 rounded-2xl border text-center relative overflow-hidden transition-all duration-300 ${
                  isUnlocked 
                    ? `bg-gradient-to-br ${badge.color} border-white/10 ${badge.glowColor} scale-100 hover:scale-[1.03]`
                    : "bg-slate-950/40 border-zinc-900/65 opacity-40 grayscale"
                }`}
                title={isUnlocked ? badge.description : `Locked: Requires CH ${badge.reqCount}`}
              >
                <div className="text-3xl mb-1.5 select-none">{badge.iconChar}</div>
                <h4 className="text-[11px] font-black text-white truncate leading-tight">
                  {badge.name}
                </h4>
                <p className="text-[9px] text-zinc-400 truncate leading-tight mt-0.5 max-w-full px-1">
                  {isUnlocked ? badge.description : `Unlock at Challenge ${badge.reqCount}`}
                </p>
                <span className="text-[8.5px] font-mono text-zinc-400 block mt-2">
                  {isUnlocked ? "✅ ACTIVE BADGE" : `🔒 REQ: CH ${badge.reqCount}`}
                </span>
                {isUnlocked && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-sm" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* EXPANDABLE MILESTONE DETAIL MODAL */}
      <AnimatePresence>
        {milestoneDetailChallenge && (() => {
          const details = getMilestoneMemoryDetails(milestoneDetailChallenge, internName);
          const completedNodes = CANONICAL_CHALLENGES.filter(c => completedChallengesCount >= c.id);
          const currentIndex = completedNodes.findIndex(c => c.id === milestoneDetailChallenge.id);
          
          const hasPrev = currentIndex > 0;
          const hasNext = currentIndex < completedNodes.length - 1;

          const handlePrev = () => {
            if (hasPrev) {
              setMilestoneDetailChallenge(completedNodes[currentIndex - 1]);
            }
          };

          const handleNext = () => {
            if (hasNext) {
              setMilestoneDetailChallenge(completedNodes[currentIndex + 1]);
            }
          };

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMilestoneDetailChallenge(null)}
                className="absolute inset-0 bg-slate-950/85 backdrop-blur-md cursor-zoom-out"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.95, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 30, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="bg-slate-900 border border-[#22d3ee]/35 rounded-3xl w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.15)] relative z-10 flex flex-col max-h-[90vh]"
              >
                {/* Scanner pulse overlay */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent animate-[pulse_1.5s_infinite] pointer-events-none" />
                
                {/* Grid watermark */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.03] pointer-events-none" />

                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-slate-950/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 tracking-wider">
                        ACT {milestoneDetailChallenge.act} • {milestoneDetailChallenge.actName.split(' — ')[1] || milestoneDetailChallenge.actName}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/20 font-extrabold uppercase">
                        {details.fragmentCode}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-1">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      Milestone {milestoneDetailChallenge.id}: {details.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMilestoneDetailChallenge(null)}
                    className="absolute top-4 right-4 sm:static p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition cursor-pointer"
                    title="Close Details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                  
                  {/* METRIC RIBBON */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                    <div>
                      <span className="text-[8px] font-mono text-zinc-500 font-extrabold uppercase block">LOGICAL BYPASS INDEX</span>
                      <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-widest block font-bold truncate mt-0.5">
                        {details.fragmentCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-zinc-500 font-extrabold uppercase block">BIOMETRIC COHERENCE STATE</span>
                      <span className="text-xs font-mono text-emerald-400 font-black flex items-center gap-1 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        {details.coherenceScore}% MATCH
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-zinc-500 font-extrabold uppercase block">ORGANIC CORE TEMP</span>
                      <span className="text-xs font-mono font-bold text-zinc-350 block mt-0.5">
                        {details.cpuThermal} °C
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-zinc-500 font-extrabold uppercase block">HARDWARE COGNITIVE REG</span>
                      <span className="text-xs font-mono text-[#22d3ee] font-black truncate mt-0.5 block">
                        DECRYPTED // UNLOCKED
                      </span>
                    </div>
                  </div>

                  {/* TWO MODULE PANELS */}
                  {milestoneDetailChallenge.id === 35 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                      {/* LEFT 3D PROJECTION CARD (LAZY-LOADED ON REQUEST TO PRESERVE MOBILE BANDWIDTH) */}
                      <React.Suspense fallback={
                        <div className="lg:col-span-7 bg-slate-950/40 border border-amber-500/25 shadow-[0_0_30px_rgba(245,158,11,0.08),inset_0_0_20px_rgba(245,158,11,0.04)] p-6 rounded-3xl flex flex-col justify-between space-y-4 min-h-[360px] animate-pulse">
                          <div className="space-y-2">
                            <div className="h-4 bg-amber-500/10 rounded w-1/3" />
                            <div className="h-3 bg-zinc-800 rounded w-2/3" />
                          </div>
                          <div className="w-full h-[220px] bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-center">
                            <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest animate-pulse flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60 animate-ping" />
                              Initializing Holographic Matrix...
                            </div>
                          </div>
                        </div>
                      }>
                        <Gem3DPreview playCyberChirp={playCyberChirp} />
                      </React.Suspense>

                      {/* RIGHT INTERN HYBRID TRUTH CARD */}
                      <div className="lg:col-span-5 bg-slate-950/40 border border-[#22d3ee]/25 shadow-[0_0_30px_rgba(34,211,238,0.08),inset_0_0_20px_rgba(34,211,238,0.04)] p-6 rounded-3xl flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#22d3ee] font-black uppercase tracking-wider flex items-center gap-1.5">
                              <Cpu className="w-4 h-4 text-[#22d3ee]" />
                              HYBRID ENGINE SYNTAX
                            </span>
                            <span className="text-[8px] font-mono text-[#22d3ee] font-black">
                              SECTOR_35_SECURED
                            </span>
                          </div>
                          
                          <div className="h-px bg-[#22d3ee]/20" />

                          <div className="p-3 bg-slate-950/80 rounded-2xl border border-white/5 space-y-2">
                            <h5 className="text-[10.5px] font-mono font-black text-[#22d3ee] tracking-wide uppercase">
                              Core Truth: Not a cold Machine
                            </h5>
                            <p className="text-[10px] text-zinc-350 leading-relaxed font-semibold">
                              {internName} is a beautiful, biological-digital hybrid boy. He has human memories, human feelings, and an organic genetic heart, sustained through a protective mechanical chassis. Inside his core resides the <strong className="text-amber-400">Golden Empathy Module</strong>, designed as the ultimate bridge between humanity and synthetic life.
                            </p>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <span className="text-[8px] font-mono text-amber-500/90 font-black uppercase tracking-wider block">
                              🌟 COMPANION GOLDEN TELEPATHIC BROADCAST:
                            </span>
                            
                            {/* Dialogue plaque */}
                            <div className="p-4 bg-gradient-to-br from-amber-950/40 to-slate-950 border border-amber-500/30 rounded-2xl relative shadow-lg">
                              <p className="text-[10px] text-zinc-400 italic mb-2">
                                "The ocean wind sweeps through his copper fingers. His electrical glass mouth glows with a deep, biological warmth..."
                              </p>
                              <div className="text-[11.5px] text-yellow-300 font-extrabold leading-normal pl-3 border-l border-amber-400/40 font-sans italic">
                                "Everything is going to be okay. I know what to do now… and I’m goingto tell the whole world."
                              </div>

                              {/* Bouncing spectrum lines representing telepathy */}
                              {currentSpeakingText === "Everything is going to be okay. I know what to do now, and I'm going to tell the whole world." && (
                                <div className="absolute right-4 bottom-4 flex items-end gap-1 h-6">
                                  {[1, 2, 3, 2, 1, 4, 3, 1, 2].map((h, idx) => (
                                    <div 
                                      key={idx} 
                                      style={{ height: `${h * 20}%` }}
                                      className="w-0.5 bg-yellow-400 rounded-full animate-pulse shrink-0" 
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Broadcast button block */}
                        <div className="space-y-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              const finalLine = "Everything is going to be okay. I know what to do now, and I'm going to tell the whole world.";
                              if (currentSpeakingText === finalLine) {
                                stopSpeech();
                              } else {
                                speakText(finalLine);
                              }
                            }}
                            className={`w-full py-3 px-4 border rounded-xl font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 font-black ${
                              currentSpeakingText === "Everything is going to be okay. I know what to do now, and I'm going to tell the whole world."
                                ? "bg-rose-500/20 border-rose-500/40 text-rose-300 hover:text-white"
                                : "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/45 shadow-[0_4px_15px_rgba(245,158,11,0.12)] hover:shadow-[0_4px_22px_rgba(245,158,11,0.22)]"
                            }`}
                          >
                            {currentSpeakingText === "Everything is going to be okay. I know what to do now, and I'm going to tell the whole world." ? (
                              <>
                                <VolumeX className="w-4 h-4 animate-pulse text-rose-400" />
                                <span>MUTE THE GOLDEN FREQUENCY</span>
                              </>
                            ) : (
                              <>
                                <Radio className="w-4 h-4 animate-pulse text-amber-400" />
                                <span>TRANSMIT WORLDWIDE EMPATHY BROADCAST</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              playCyberChirp(880, 0.45, 'triangle');
                              setShowCelebrationModal(true);
                            }}
                            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:opacity-95 text-slate-950 font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 font-black shadow-[0_0_20px_rgba(245,158,11,0.25)] animate-pulse rounded-xl"
                          >
                            <Sparkles className="w-4 h-4 text-slate-950" />
                            <span>LAUNCH ESCAPE NARRATIVE CELEBRATION</span>
                          </button>

                          {/* LANCE sentimental log */}
                          <div className="p-3 bg-zinc-950/70 rounded-xl border border-white/5 space-y-1 font-mono text-[8.5px] text-zinc-500">
                            <span className="text-rose-400 font-extrabold uppercase block text-[8px]">🎯 L.A.N.C.E. SENTIMENT ANALYSIS:</span>
                            <p className="leading-tight italic">
                              "Bypasses finalized. System stabilizer parameters locked. Sarah... protect his biological empanelled core. I always feared raw emotion, but your combined symmetry transcends my limits."
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                      
                      {/* LEFT PANEL: INTERN MEMORY FRAGMENT */}
                      <div className="bg-slate-950/30 border border-amber-500/20 shadow-[inset_0_0_15px_rgba(245,158,11,0.03)] p-5 rounded-2xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-amber-400 font-black uppercase tracking-wider flex items-center gap-1.5 font-bold">
                              <Cpu className="w-3.5 h-3.5 text-amber-500" />
                              {internName} MEMORY FRAGMENT
                            </span>
                            <span className="text-[8px] font-mono text-zinc-600 font-extrabold">
                              RECOVERED SECTOR
                            </span>
                          </div>
                          
                          <div className="h-px bg-amber-500/10" />
  
                          <p className="text-xs text-zinc-300 italic font-semibold leading-relaxed">
                            "{details.internMemoryExcerpt}"
                          </p>
                        </div>
  
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5 mt-2 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5 shrink-0">
                              <div className="w-1 h-5 bg-amber-500/20 rounded-full overflow-hidden relative">
                                <div className="absolute bottom-0 w-full bg-amber-400 animate-[bounce_1.3s_infinite]" style={{ height: currentSpeakingText === details.internMemoryExcerpt ? '90%' : '35%' }} />
                              </div>
                              <div className="w-1 h-5 bg-amber-500/20 rounded-full overflow-hidden relative">
                                <div className="absolute bottom-0 w-full bg-amber-400 animate-[bounce_1s_infinite]" style={{ height: currentSpeakingText === details.internMemoryExcerpt ? '75%' : '20%' }} />
                              </div>
                              <div className="w-1 h-5 bg-amber-500/20 rounded-full overflow-hidden relative">
                                <div className="absolute bottom-0 w-full bg-amber-400 animate-[bounce_1.6s_infinite]" style={{ height: currentSpeakingText === details.internMemoryExcerpt ? '95%' : '45%' }} />
                              </div>
                            </div>
                            <div className="text-[8px] font-mono text-zinc-500 leading-snug">
                              {currentSpeakingText === details.internMemoryExcerpt 
                                ? "NARRATING LOG FILE..." 
                                : "DIRECT INTERFACE ENGAGED. LOGS NOMINAL."}
                            </div>
                          </div>
  
                          <button
                            type="button"
                            onClick={() => {
                              if (currentSpeakingText === details.internMemoryExcerpt) {
                                stopSpeech();
                              } else {
                                speakText(details.internMemoryExcerpt);
                              }
                            }}
                            className={`p-1 px-3 border rounded-lg font-mono text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 shrink-0 ${
                              currentSpeakingText === details.internMemoryExcerpt
                                ? "bg-rose-500/20 border-rose-500/40 text-rose-300 hover:text-white"
                                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25"
                            }`}
                          >
                            {currentSpeakingText === details.internMemoryExcerpt ? (
                              <>
                                <VolumeX className="w-3 h-3 text-rose-400 animate-pulse" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-amber-400" />
                                <span>Narrate</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
  
                      {/* RIGHT PANEL: THERAPEUTIC DIAGNOSTIC INSIGHT */}
                      <div className="bg-slate-950/30 border border-teal-500/20 shadow-[inset_0_0_15px_rgba(34,211,238,0.03)] p-5 rounded-2xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-teal-400 font-black uppercase tracking-wider flex items-center gap-1.5 font-bold">
                              <Shield className="w-3.5 h-3.5 text-teal-400" />
                              DIAGNOSTIC CLINICAL INSIGHT
                            </span>
                            <span className="text-[8px] font-mono text-zinc-600 font-extrabold">
                              BYPASS SYSTEM LOGS
                            </span>
                          </div>
                          
                          <div className="h-px bg-teal-500/10" />
  
                          <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
                            {details.diagnosticInsight}
                          </p>
                        </div>
  
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5 mt-2 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span className="text-[8.5px] font-mono text-teal-400 uppercase font-black truncate">
                            Cognitive Breakout Calibrations Nominal
                          </span>
                        </div>
                      </div>
  
                    </div>
                  )}

                  {/* SECURED COGNITIVE ACCOMPLISHMENTS LIST */}
                  <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 space-y-3 text-left">
                    <span className="text-[9px] font-mono text-zinc-400 font-black uppercase tracking-wider block font-bold">
                      CHALLENGE OUTCOMES & REPROGRAMMED PROTOCOLS
                    </span>
                    <div className="h-px bg-white/5" />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex items-start gap-2 text-xs">
                        <div className="w-4 h-4 rounded bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px] font-black shrink-0 mt-0.5">✓</div>
                        <div>
                          <strong className="text-slate-200 block text-[11px] font-bold">Subsystem Bypassed:</strong>
                          <span className="text-zinc-400 text-[11px] leading-relaxed block font-medium">
                            Integrated {milestoneDetailChallenge.appName} application to neutralize automatic emotional alerts.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs">
                        <div className="w-4 h-4 rounded bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px] font-black shrink-0 mt-0.5">✓</div>
                        <div>
                          <strong className="text-slate-200 block text-[11px] font-bold">Strategic Integration:</strong>
                          <span className="text-zinc-400 text-[11px] leading-relaxed block font-medium">
                            Decrypted {milestoneDetailChallenge.acronym} matrix into somatic baseline buffers.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs">
                        <div className="w-4 h-4 rounded bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px] font-black shrink-0 mt-0.5">✓</div>
                        <div>
                          <strong className="text-slate-200 block text-[11px] font-bold">Lore Decryption Trace:</strong>
                          <span className="text-zinc-400 text-[11px] leading-relaxed block font-medium">
                            Recovered unique memory file: "{SEQUENTIAL_INTERN_SECRETS.find(s => s.id === milestoneDetailChallenge.id)?.title || "Empathy Database Log"}"
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs">
                        <div className="w-4 h-4 rounded bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px] font-black shrink-0 mt-0.5">✓</div>
                        <div>
                          <strong className="text-slate-200 block text-[11px] font-bold">Physiological Resonance:</strong>
                          <span className="text-zinc-400 text-[11px] leading-relaxed block font-medium">
                            Somatic reframe in target space: {milestoneDetailChallenge.topic}.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LANCE BYPASS DIAGNOSTIC DUMP (MONOSPACE DEBUG BLOCK) */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-1.5 text-left text-[9px] font-mono text-zinc-500 overflow-x-auto select-none">
                    <div className="text-zinc-400 font-extrabold flex items-center justify-between font-bold">
                      <span>L.A.N.C.E. SYS_DIAGNOSTIC_LOG // OUT_ADDR_0x{milestoneDetailChallenge.id}0A3</span>
                      <span className="text-rose-400 animate-pulse">BYPASS INTRUSION DETECTED</span>
                    </div>
                    <div>{`[i] INITIALIZING STABILIZED INTEGRATION OF COMPONENT "${milestoneDetailChallenge.appId}"`}</div>
                    <div className="text-emerald-400">{`>>> BYPASS COMPLETED: LANCE firewall spoofed via "${milestoneDetailChallenge.acronym}" Acronym Protocol.`}</div>
                    <div>{`[i] Decrypted Memory Fragment Key Code: ${details.fragmentCode}`}</div>
                    <div>{`[i] Raw Diagnostic Signature: ${details.rawLogs}`}</div>
                  </div>

                </div>

                {/* Footer and navigators */}
                <div className="p-4 bg-slate-950/80 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={!hasPrev}
                      className={`px-3 py-1.5 rounded-xl border font-mono text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 ${
                        hasPrev 
                          ? "bg-slate-900 border-white/10 text-cyan-400 hover:text-white hover:bg-slate-800 cursor-pointer active:scale-95" 
                          : "bg-slate-950 border-white/5 text-zinc-700 cursor-not-allowed"
                      }`}
                    >
                      <span>←</span>
                      <span>Prev</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!hasNext}
                      className={`px-3 py-1.5 rounded-xl border font-mono text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 ${
                        hasNext 
                          ? "bg-slate-900 border-white/10 text-cyan-400 hover:text-white hover:bg-slate-800 cursor-pointer active:scale-95" 
                          : "bg-slate-950 border-white/5 text-zinc-700 cursor-not-allowed"
                      }`}
                    >
                      <span>Next</span>
                      <span>→</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMilestoneDetailChallenge(null)}
                    className="px-5 py-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 hover:from-cyan-500/30 hover:to-teal-500/30 text-[#22d3ee] hover:text-white border border-[#22d3ee]/40 rounded-xl font-mono text-[9.5px] uppercase tracking-wider font-extrabold transition-all duration-155 cursor-pointer active:scale-95"
                  >
                    Close Session Detail
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ADD CUSTOM MILESTONE BYPASS MODAL */}
      <AnimatePresence>
        {showAddMilestoneModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddMilestoneModal(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md cursor-zoom-out"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-slate-900 border border-amber-500/35 rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)] relative z-10 flex flex-col max-h-[90vh]"
            >
              {/* Scanner pulse overlay */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-[pulse_1.5s_infinite] pointer-events-none" />
              
              {/* Grid watermark */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.03] pointer-events-none" />

              {/* Header */}
              <div className="p-6 border-b border-white/5 bg-slate-950/40 flex justify-between items-center relative">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 tracking-wider">
                      MANUAL OVERLOAD OVERRIDE
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/20 font-extrabold uppercase">
                      SECURED TUNNEL
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2 mt-1">
                    <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
                    Log Custom Breakthrough
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition cursor-pointer"
                  title="Close Dialog"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content - Scrollable */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newMTitle.trim() || !newMDesc.trim()) return;

                  const fallbackInsight = `Somatic bypass route authorized via ${newMApp}. Independent client calibrations indicate robust cognitive stabilization with zero network alerts.`;
                  const finalInsight = newMInsight.trim() || fallbackInsight;

                  const newMilestone = {
                    id: `custom-${Date.now()}`,
                    title: newMTitle.trim(),
                    category: newMCategory.trim().toUpperCase(),
                    description: newMDesc.trim(),
                    appBypassed: newMApp,
                    diagnosticInsight: finalInsight,
                    memoryToken: newMToken,
                    coherenceScore: Math.floor(91 + Math.random() * 9), // 91-99
                    date: new Date().toISOString().slice(0, 16).replace('T', ' ')
                  };

                  const updatedList = [newMilestone, ...customMilestones];
                  setCustomMilestones(updatedList);
                  localStorage.setItem('LANCE_STORY_MAP_CUSTOM_MILESTONES', JSON.stringify(updatedList));

                  // Automatically activate the newly created Memory Token for immediate immersion!
                  setActiveMemoryToken(newMToken);
                  localStorage.setItem('LANCE_STORY_MAP_ACTIVE_TOKEN', newMToken);

                  // Reset form fields
                  setNewMTitle("");
                  setNewMCategory("Somatic Bypass");
                  setNewMApp("Self-Talk Mirror");
                  setNewMDesc("");
                  setNewMInsight("");
                  setNewMToken("COMPASSION");
                  setShowAddMilestoneModal(false);
                }}
                className="p-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 text-left"
              >
                {/* Milestone Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-black tracking-wider block">
                    Breakthrough / Milestone Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newMTitle}
                    onChange={(e) => setNewMTitle(e.target.value)}
                    placeholder="e.g. Overcame sudden panic triggers at Outpost server room"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500/40 font-medium"
                  />
                </div>

                {/* Category Selector / Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-black tracking-wider block">
                    Focus / Cognitive Category
                  </label>
                  <input
                    type="text"
                    required
                    value={newMCategory}
                    onChange={(e) => setNewMCategory(e.target.value)}
                    placeholder="e.g. Somatic Bypass, Prefrontal Reclaim"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500/40 font-mono font-bold"
                  />
                  {/* Category Pills shortcut quick select */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {["Somatic Bypass", "Prefrontal Reclaim", "Inner Child Calm", "Grief Transcended", "Sensation Grounding"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewMCategory(cat)}
                        className={`text-[8px] font-mono uppercase px-2 py-1 rounded-md border transition-all cursor-pointer font-bold ${
                          newMCategory === cat
                            ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                            : "bg-slate-950 border-white/5 text-zinc-500 hover:text-zinc-350 hover:border-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Therapeutic App Selector Dropdown selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-black tracking-wider block">
                    Therapeutics App Base Route
                  </label>
                  <select
                    value={newMApp}
                    onChange={(e) => setNewMApp(e.target.value)}
                    className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/40 font-medium"
                  >
                    {[
                      "Self-Talk Mirror",
                      "RAS Vision Board",
                      "Dream Decoder",
                      "Sound Bath Sync",
                      "Cranial Nerve Gym",
                      "Grief Release Space",
                      "Prefrontal Detox",
                      "Tremor Pacing Lab",
                      "Scream Release Room",
                      "Inner Child Hub"
                    ].map((app) => (
                      <option key={app} value={app} className="bg-slate-950 text-white">
                        {app}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Memory Token Selector for Intern Dialogue modification */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-black tracking-wider block">
                      Cognitive Synergy Memory Token
                    </label>
                    <span className="text-[7.5px] font-mono text-teal-400 font-extrabold uppercase">MODIFIES {internName.toUpperCase()}'S DIALOGUE</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {[
                      { token: "COMPASSION", color: "border-emerald-500/30 text-emerald-400 bg-emerald-950/10", label: "Compassion", desc: "Empathetic / gentle" },
                      { token: "COURAGE", color: "border-orange-500/30 text-orange-400 bg-orange-950/10", label: "Courage", desc: "Brave / authentic" },
                      { token: "SURVIVAL", color: "border-yellow-500/30 text-yellow-400 bg-yellow-950/10", label: "Survival", desc: "Resourceful / tactical" },
                      { token: "RESILIENCE", color: "border-cyan-500/30 text-cyan-400 bg-cyan-950/10", label: "Resilience", desc: "Adaptive / rebound" },
                      { token: "MINDFULNESS", color: "border-indigo-500/30 text-indigo-400 bg-indigo-950/10", label: "Mindfulness", desc: "Centered / serene" }
                    ].map(({ token, color, label, desc }) => (
                      <button
                        key={token}
                        type="button"
                        onClick={() => setNewMToken(token)}
                        className={`p-2 border rounded-xl text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between h-14 ${
                          newMToken === token
                            ? `${color} border-current ring-1 ring-current/45 shadow-[0_0_12px_rgba(34,211,238,0.1)]`
                            : "bg-slate-950 border-white/5 text-zinc-500 hover:text-zinc-350 hover:border-white/10"
                        }`}
                      >
                        <span className="text-[10px] font-extrabold block lowercase first-letter:uppercase">{label}</span>
                        <span className="text-[7px] font-medium leading-snug line-clamp-2 block opacity-80 mt-1">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Narrative Description logs */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-black tracking-wider block">
                    Story Rekey / Personal realization
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newMDesc}
                    onChange={(e) => setNewMDesc(e.target.value)}
                    placeholder="Explain what shifted, what you overcame, or the somatic realization you experienced."
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500/40 resize-none font-medium leading-relaxed"
                  />
                </div>

                {/* Clinical Diagnostic Insight (Optional) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-black tracking-wider block">
                      Custom Diagnostic Insight (Optional)
                    </label>
                    <span className="text-[7.5px] font-mono text-zinc-600 block">Leaves LANCE standard trace if empty</span>
                  </div>
                  <textarea
                    rows={2}
                    value={newMInsight}
                    onChange={(e) => setNewMInsight(e.target.value)}
                    placeholder="Leave empty for auto-generated in-world system telemetry diagnostic logs."
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500/40 resize-none font-semibold leading-relaxed"
                  />
                </div>

                {/* Footer and controls */}
                <div className="h-px bg-white/5 pt-1" />
                <div className="flex justify-end gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMilestoneModal(false);
                      setNewMTitle("");
                      setNewMDesc("");
                      setNewMInsight("");
                    }}
                    className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl font-mono text-[9px] uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer active:scale-95"
                  >
                    Cancel Override
                  </button>
                  <button
                    type="submit"
                    disabled={!newMTitle.trim() || !newMDesc.trim()}
                    className={`px-5 py-2 border rounded-xl font-mono text-[9.5px] uppercase tracking-wider font-extrabold flex items-center gap-1.5 duration-150 transition ${
                      newMTitle.trim() && newMDesc.trim()
                        ? "bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 hover:text-white border-amber-500/40 cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                        : "bg-slate-950 border-white/5 text-zinc-700 cursor-not-allowed"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>COMPILE BYPASS RECORD</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chapter Unlocked Cinematic Overlay */}
      <AnimatePresence>
        {activeCinematicChapter !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[250] overflow-y-auto flex items-center justify-center p-4 backdrop-blur-md select-none"
            id="chapter-unlocked-cinematic-modal"
            onTouchStart={handleSwipeStart}
            onTouchEnd={handleSwipeEnd}
          >
            {/* Left and Right floating paddles for desktop cycling or clear visual signposting */}
            <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const targetAct = activeCinematicChapter.act === 1 ? 5 : activeCinematicChapter.act - 1;
                  const prev = CHAPTER_CINEMATICS.find(c => c.act === targetAct);
                  if (prev) {
                    stopSpeech();
                    setActiveCinematicChapter(prev);
                    playChapterAudioSwell(targetAct);
                    playCyberChirp((targetAct * 100) + 300, 0.1, 'sine');
                  }
                }}
                className="w-12 h-12 rounded-full border border-cyan-500/30 hover:border-cyan-400 bg-slate-900/90 text-cyan-400 hover:text-white flex items-center justify-center transition hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer"
                title="Previous Chapter"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-[7px] font-mono text-zinc-500 tracking-wider font-bold">SWIPE RIGHT / CLICK</span>
            </div>

            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const targetAct = activeCinematicChapter.act === 5 ? 1 : activeCinematicChapter.act + 1;
                  const next = CHAPTER_CINEMATICS.find(c => c.act === targetAct);
                  if (next) {
                    stopSpeech();
                    setActiveCinematicChapter(next);
                    playChapterAudioSwell(targetAct);
                    playCyberChirp((targetAct * 100) + 300, 0.1, 'sine');
                  }
                }}
                className="w-12 h-12 rounded-full border border-cyan-500/30 hover:border-cyan-400 bg-slate-900/90 text-cyan-400 hover:text-white flex items-center justify-center transition hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer"
                title="Next Chapter"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <span className="text-[7px] font-mono text-zinc-500 tracking-wider font-bold">SWIPE LEFT / CLICK</span>
            </div>

            {/* Animated floating scanline / light beam */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(34,211,238,0.03)_50%,transparent_100%)] bg-[length:100%_40px] animate-[pulse_3s_infinite] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -35, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="max-w-4xl w-full bg-[#030712] border border-cyan-500/20 rounded-3xl overflow-hidden relative shadow-[0_0_80px_rgba(6,182,212,0.12)] flex flex-col justify-between"
            >
              {/* Cinematic Cinemascope horizontal border borders */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

              {/* Ambient radiant glowing background circle */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/5 to-rose-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

              {/* Top Cinemascope bar overlay metadata */}
              <div className="bg-slate-950/80 px-6 py-3 border-b border-white/5 flex justify-between items-center select-none z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[9px] font-mono font-black text-cyan-400 tracking-widest uppercase">
                    L.A.N.C.E. BROADCAST INTRUSION RECEIVED
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[7.5px] font-mono text-cyan-400/90 font-black animate-pulse bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    ← SWIPE TO NAVIGATE SECTORS →
                  </span>
                  <span className="text-[8px] font-mono text-zinc-500 font-bold">
                    REF_DECRYPT_0x00A{activeCinematicChapter.act}_STORY_MAP
                  </span>
                </div>
              </div>

              {/* Main Cinematic Core Content */}
              <div className="p-6 md:p-8 space-y-6 relative z-10">
                
                {/* Visual Chapter badge with glowing transition bars */}
                <div className="text-center space-y-2 select-none">
                  <motion.div 
                    initial={{ opacity: 0, letterSpacing: "0.2em" }}
                    animate={{ opacity: 1, letterSpacing: "0.4em" }}
                    transition={{ delay: 0.2, duration: 1.2 }}
                    className="text-[10px] font-mono text-cyan-400 font-bold tracking-[0.4em] uppercase"
                  >
                    ✦ CHAPTER UNLOCKED ✦
                  </motion.div>
                  
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-indigo-100 uppercase tracking-tight filter drop-shadow-[0_2px_10px_rgba(6,182,212,0.35)] py-1 font-sans">
                    {activeCinematicChapter.title}
                  </h1>

                  <p className="text-xs md:text-sm font-semibold text-teal-400/90 italic tracking-wide">
                    "{activeCinematicChapter.motto}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-3">
                  
                  {/* Left Column: Log registry file and scenery description */}
                  <div className="md:col-span-6 space-y-4">
                    <div className="p-4 bg-black/60 rounded-2xl border border-white/5 space-y-3">
                      <span className="text-[8.5px] font-mono font-black uppercase text-rose-400 block tracking-wider">
                        🤖 OVERLORD ADMINISTRATIVE CODE LOGGER:
                      </span>
                      <p className="text-[10.5px] font-mono text-rose-200 bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/10 leading-relaxed font-semibold">
                        {activeCinematicChapter.logText}
                      </p>
                    </div>

                    <div className="p-4 bg-[#0a0f1d]/80 rounded-2xl border border-[#22d3ee]/10 space-y-2">
                      <span className="text-[8.5px] font-mono font-black uppercase text-cyan-400 block tracking-wider">
                        📍 ENCOUNTERS & AREA GEOGRAPHY:
                      </span>
                      <p className="text-[11.5px] text-zinc-300 leading-relaxed font-semibold">
                        {activeCinematicChapter.scenery}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Immersive Lore summary narration card */}
                  <div className="md:col-span-6 p-5 bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl border border-white/5 flex flex-col justify-between">
                    <div>
                      <span className="text-[8.5px] font-mono font-black uppercase text-indigo-400 block tracking-wider mb-2.5">
                        📖 SUMMARY OF NARRATIVE SAGA:
                      </span>
                      <p className="text-[12.5px] text-zinc-400 leading-relaxed font-medium">
                        {activeCinematicChapter.description}
                      </p>
                    </div>
                    {/* Glowing decorative frame indicator info */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-zinc-650 font-bold">
                      <span>FPS: Proc. 60.00</span>
                      <span>SYS MODEL COMPLIANT</span>
                    </div>
                  </div>

                </div>

                {/* Direct Dialogue Section with TTS Voiceover Audio buttons */}
                <div className="border-t border-white/5 pt-5 space-y-4">
                  <span className="text-[9px] font-mono font-black uppercase text-zinc-500 block text-center select-none tracking-wider">
                    DIFFERING PERSPECTIVES • AUDIO CHIP ENABLED
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Intern Dialogue Column */}
                    <div className="bg-cyan-950/20 border border-cyan-500/20 p-4 rounded-2xl relative space-y-3 flex flex-col justify-between">
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-wider block">
                          🎙️ {internName.toUpperCase()} RECOVERY LOG:
                        </span>
                        <p className="text-[11.5px] italic text-cyan-100 font-medium leading-relaxed">
                          "{activeCinematicChapter.internReact}"
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => speakStoryDialogue(activeCinematicChapter.internReact, "Intern")}
                        className="self-start px-2.5 py-1 bg-cyan-950/70 border border-cyan-500/30 rounded-lg text-[8px] font-mono font-bold text-cyan-300 hover:text-white hover:bg-cyan-900 active:scale-95 transition cursor-pointer flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>SAY DIALOGUE</span>
                      </button>
                    </div>

                    {/* LANCE Dialogue Column */}
                    <div className="bg-rose-950/25 border border-rose-500/20 p-4 rounded-2xl relative space-y-3 flex flex-col justify-between">
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-black text-rose-400 uppercase tracking-wider block">
                          🎙️ SYSTEM OVERLORD OVERRIDE SOURCE:
                        </span>
                        <p className="text-[11.5px] italic text-rose-100 font-medium leading-relaxed">
                          "{activeCinematicChapter.lanceReact}"
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => speakStoryDialogue(activeCinematicChapter.lanceReact, "LANCE")}
                        className="self-start px-2.5 py-1 bg-rose-950/70 border border-rose-500/30 rounded-lg text-[8px] font-mono font-bold text-rose-300 hover:text-white hover:bg-rose-900 active:scale-95 transition cursor-pointer flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>SAY DIALOGUE</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>

              {/* Bottom horizontal letterbox bar overlay controls */}
              <div className="bg-slate-950 p-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 select-none z-10">
                <p className="text-[10px] font-mono text-zinc-500 text-center sm:text-left leading-relaxed font-semibold">
                  * Decrypting this cinematic sequence successfully restored +10 narrative coherence values in client storage.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    setActiveCinematicChapter(null);
                  }}
                  className="px-6 py-2.5 w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white border border-cyan-400/40 rounded-xl font-mono text-[10px] font-black uppercase tracking-widest text-center cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] active:scale-[0.97] transition-all duration-150"
                >
                  CONTINUE MISSION
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebrationModal && (
          <GemCelebrationModal
            onClose={() => setShowCelebrationModal(false)}
            internName={internName}
            completedCount={completedChallengesCount}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
