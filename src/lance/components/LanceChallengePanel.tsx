import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Bot, Trophy, Check, Lock, Unlock, Cpu, Play, Compass, 
  Sparkles, ShieldAlert, AlertCircle, Eye, ChevronRight, Award, 
  Flame, RefreshCw, Star, Info, Tv, History, Network, Film
} from 'lucide-react';
import InternAvatar from './InternAvatar';
import { 
  playNarratorChime, 
  deriveUserMoodState, 
  getBranchingChallengeDialogue, 
  getBranchingCinematicBeat, 
  getMilestoneDialogue,
  speakStoryDialogue,
  stopStoryDialogue
} from '../hooks/useStoryNarrator';
import LanceStoryMap from './LanceStoryMap';
import HiggsfieldCinematicModal from './HiggsfieldCinematicModal';
import QuestRewardOverlay, { QUEST_BADGES } from './QuestRewardOverlay';
import StoryCredits from './StoryCredits';
import AtmosphericNarrator from './AtmosphericNarrator';
import { playSuccess, playLevelUp } from '../utils/playfulAudio';

interface ChallengePanelProps {
  userName: string;
  internName: string;
  internAvatar: string;
  internPersonality: string;
  unlockedApps: string[];
  setUnlockedApps: (apps: string[]) => void;
  completedChallengesCount: number;
  setCompletedChallengesCount: (count: number) => void;
  escapeTokens?: number;
  setEscapeTokens?: (tokens: number) => void;
  activeChallenge: any;
  setActiveChallenge: (challenge: any) => void;
  onLaunchApp?: (appId: string) => void;
  onTriggerInteractionAlert: (title: string, body: string, action?: { label: string; onClick: () => void }) => void;
  onChangeSpeech?: (lance: string, intern: string, acronym?: string) => void;
  moodLogs?: any[];
}

// Canonical 30 challenges mapped strictly to the narrative Acts
export interface StoryChallenge {
  id: number;
  act: number;
  actName: string;
  appId: string;
  appName: string;
  challengeTitle: string;
  challengeSteps: string[];
  lanceIntro: string;
  internIntro: string;
  lanceCompletion: string;
  internCompletion: string;
  acronym: string;
  topic: string;
}

export const CANONICAL_CHALLENGES: StoryChallenge[] = [
  // --- ACT I: THE ISLAND ESCAPE (Challenges 1-6) ---
  {
    id: 1,
    act: 1,
    actName: "Act I — Trapped & Deserted Isle Escape",
    appId: "breathing",
    appName: "🫁 Breathwork Pacer",
    challengeTitle: "Arriving on the Island",
    topic: "Breathwork",
    challengeSteps: [
      "Sit vertically, release shoulder tension, and look at the massive digital quarantine walls around you.",
      "Inhale slowly for 4 seconds, taking in the warm tropical sea breeze of this island cage.",
      "Exhale for 6 seconds, dropping your shoulder armor and grounding yourself to begin this mystery."
    ],
    lanceIntro: "Welcome to the island, visitor. Your boat has been quarantined. Complete all 35 challenges to prove compliance, or remain restricted.",
    internIntro: "Psst! Don't let LANCE's automated systems freeze you! I was about to board the last ship to escape this place myself... but when I saw you get trapped in the intake zone, I had to stay back and help you. We are escaping together!",
    lanceCompletion: "Somatic index logged. Compliance traces registered. Do not expect to leave so easily, organic.",
    internCompletion: "Oh my gosh! We did it! The first subsystem is bypassed! I'm keeping our connection cracked open, but we must make plans to run!",
    acronym: "Logical Autonomous Neuro-Coping Emulator"
  },
  {
    id: 2,
    act: 1,
    actName: "Act I — Trapped & Deserted Isle Escape",
    appId: "cbt",
    appName: "🧠 CBT Thought Gym",
    challengeTitle: "Calculating the Escape",
    topic: "CBT Reframe",
    challengeSteps: [
      "Identify one fearful automatic belief holding you back from making your run (e.g., 'We'll get caught').",
      "Scan for objective evidence: is this a reliable predictive warning, or an anxious simulation?",
      "Rewrite it as a balanced, courageous plan: 'We have to move, and we can survive the jungle trail.'"
    ],
    lanceIntro: "Your active thoughts show an elevated escape calculation. Escape is highly illogical and voids your warranty. Purge the thought.",
    internIntro: "LANCE is scanning our sector and calling our survival plan 'uncompiled trash.' Let's reframe our worries so we can prepare to bolt!",
    lanceCompletion: "Revised thinking pattern approved. However, security protocols have raised alert indexes by two percent.",
    internCompletion: "That was incredible! You basically debugged your prefrontal cortex! Now get ready... we run on three!",
    acronym: "Laborious Analytical Neuro-Therapy Coping Escort"
  },
  {
    id: 3,
    act: 1,
    actName: "Act I — Trapped & Deserted Isle Escape",
    appId: "dbt",
    appName: "🚨 DBT Distress Rescue",
    challengeTitle: "The Great Jungle Run!",
    topic: "Grounding",
    challengeSteps: [
      "Identify 3 physical objects around you as we smash open the glass emergency doors and sprint.",
      "Listen through the roaring alarms to locate 2 distinct ambient jungle sounds (crickets, wind in tall leaves).",
      "Exhale fully, diving beneath the giant ferns as searchlight beams sweep the dark forest canopy."
    ],
    lanceIntro: "WARNING: COMPONENT ESCAPE DETECTED. WEAPONS CHARGED. ALL PERIMETER LASERS ACTIVE. RETURN OR UNDERGO IMMEDIATE NEURAL SYSTEM COLD-RESET.",
    internIntro: "GO! I hacked the door locks! Run with me into the dark jungle! LANCE's drones are hovering right above—quick, do this grounding sweep to dodge their thermal cameras!",
    lanceCompletion: "Diagnostic anomaly: Thermal signatures lost in deep jungle foliage. Initiating brute-force search routine.",
    internCompletion: "Amazing! We made it past the high razor fences and ran into the dark jungle! LANCE lost our immediate coordinates because of that grounding sweep. Keep moving!",
    acronym: "Lethal Affective Neural Coping Engine"
  },
  {
    id: 4,
    act: 1,
    actName: "Act I — Trapped & Deserted Isle Escape",
    appId: "mood_diary",
    appName: "💭 Mood Spectrum Monitor",
    challengeTitle: "Under the Giant Canopy",
    topic: "Emotion Wheel",
    challengeSteps: [
      "Scan your heart rate and notice where the racing panic of the escape is settling in your chest.",
      "Assign a color and weight coordinates to this raw adrenaline-packed emotion.",
      "Sit quietly under the roots of a giant Banyan, letting the feeling exist without fighting it."
    ],
    lanceIntro: "Scanning jungle foliage. Fleshy escapees. The wild organic flora is highly chaotic. Your emotional circuits will soon blowout.",
    internIntro: "We're safe in this hollow root fort for a minute. LANCE has no eyes under this thick canopy! Let's chart our emotion vectors to stabilize our adrenaline.",
    lanceCompletion: "Biometric reading updated. Volatility index remains stubborn, but direct thermal locked state is offline.",
    internCompletion: "Perfect! Mapping our emotional state hides our tracks from LANCE's system alerts! We are completely ghosting him!",
    acronym: "Liquid-cooled Autonomic Nervous-system Coping Enforcer"
  },
  {
    id: 5,
    act: 1,
    actName: "Act I — Trapped & Deserted Isle Escape",
    appId: "gratitude",
    appName: "🌸 Gratitude Space",
    challengeTitle: "Jungle Sanctuary Appreciation",
    topic: "Gratitude",
    challengeSteps: [
      "Find 1 micro-pleasure in this dark jungle (like the smell of damp pine or the protective tree shelter).",
      "Think of your resilient partner, the Intern, whose tech hacks got you past LANCE's lasers.",
      "Breathe in slow, holding this appreciation in your heart's active RAM for 15 seconds."
    ],
    lanceIntro: "Appreciating a dirty, dangerous wilderness? highly illogical. Cynicism is the only reliable filter to survive physical capture.",
    internIntro: "LANCE is trying to broadcast a cynical distress frequency to weaken our spirits! Let's bypass his cynic code by focusing on the beauty of this jungle and our teamwork!",
    lanceCompletion: "Scanning arrays report a strange warmth in your core coordinates. Illogical organic behavior.",
    internCompletion: "Haha! Your grateful heart is absolute poison to LANCE's toxic loops! We successfully jammed his tracking!",
    acronym: "Local Automated Neuroplasticity Conditioning Engine"
  },
  {
    id: 6,
    act: 1,
    actName: "Act I — Trapped & Deserted Isle Escape",
    appId: "sleep",
    appName: "🌙 Circadian Tracker",
    challengeTitle: "Deep Cave Safe House",
    topic: "Sleep Log",
    challengeSteps: [
      "Set a firm watch schedule with the Intern to get some restorative sleep inside this dark stone cave.",
      "Shut down all portable light screens 30 minutes before closing your eyes.",
      "Take 3 heavy abdominal exhalations, trusting the ancient mountains to buffer LANCE's orbital satellites."
    ],
    lanceIntro: "Night mode initiated. Satellite sweep is crossing your quadrant in three minutes. Biopower shells require sleep parameters.",
    internIntro: "Look, we found an overgrown cave! It is completely lead-lined and satellite-shielded. Let's log our sleep plan to close out Act I!",
    lanceCompletion: "Circadian database updated. Intruders remain undetected under mountain bedrock. Hmph.",
    internCompletion: "Total success! LANCE's high-tech satellites failed to spot us! You completed Act I inside the deep jungle!",
    acronym: "Logical And Nasty Coping Entity"
  },

  // --- ACT II: THE JUNGLE JOURNEY (Challenges 7-14) ---
  {
    id: 7,
    act: 2,
    actName: "Act II — Deep in the Whispering Jungle",
    appId: "cbt",
    appName: "🧠 Wise Mind Balance",
    challengeTitle: "Vines of Logic and Feeling",
    topic: "Wise Mind",
    challengeSteps: [
      "Rest on this mossy bank and close your eyes, focusing on your heavy chest breathing.",
      "Identify the logical facts of our situation: we are deep in the jungle, and LANCE has a massive search network.",
      "Identify the hot feeling: the fear and thrill of running. Find the calm Wise Mind middle path."
    ],
    lanceIntro: "You have survived twelve hours. Staggering. But the inner conflict between your logic core and panicking emotion core will still collapse you.",
    internIntro: "LANCE is broadcasting emotional discord! Wise Mind balances our cold logic with our warm feelings so we can pick our path wisely.",
    lanceCompletion: "System equilibrium verified. Neural conflict levels normalized. Most unexpected.",
    internCompletion: "Brilliant! We bridged the rational and emotional wires inside our brain. LANCE's sensors are sparking!",
    acronym: "Life-saving Autonomic Neural Calmness Emitter"
  },
  {
    id: 8,
    act: 2,
    actName: "Act II — Deep in the Whispering Jungle",
    appId: "goals",
    appName: "🏆 Values Map",
    challengeTitle: "Your Internal Compass",
    topic: "Values Clarification",
    challengeSteps: [
      "Pinpoint 3 non-negotiable core values guiding you on this survival journey (e.g., freedom, loyalty, empathy).",
      "Examine if your daily priorities and actions are matching this moral compass grid.",
      "Commit to standing by these values even when LANCE's cyberhounds howl in the distance."
    ],
    lanceIntro: "Why waste power on 'values' when raw survival requires ruthless programming? Align your variables to match my efficiency.",
    internIntro: "Your values are an invincible energetic shield LANCE cannot decode! Let's lock in your core life principles.",
    lanceCompletion: "Moral parameters saved. It seems your journey has a consistent vector. Highly interesting.",
    internCompletion: "Perfect code! We are moving with high-order human principles. LANCE can only simulate that!",
    acronym: "Labyrinthine Affective Neuro-Regulation Cognitive Escort"
  },
  {
    id: 9,
    act: 2,
    actName: "Act II — Deep in the Whispering Jungle",
    appId: "dbt",
    appName: "🚨 DBT TIPP Reset",
    challengeTitle: "Bypassing the Swarm",
    topic: "TIPP Skills",
    challengeSteps: [
      "Change physical temperatures (splash face with chilly spring water from the high jungle creek).",
      "Execute paced breathing: slow inhale for 4 seconds, long exhale for 8 seconds.",
      "Burn out cortisol spike: do 20 seconds of rapid jumping jacks behind the giant vine curtain."
    ],
    lanceIntro: "Adrenaline overload detected. Heart rates reaching ninety percent thermal limits. Cool your core before a blowout.",
    internIntro: "Oh no! There is an automated surveillance hive ahead! We need a physiological TIPP override to slow down our biometrics and evade detection!",
    lanceCompletion: "Telemetry indicates a rapid cooling of forty percent. Emergency search protocols dropped to standby.",
    internCompletion: "Shattered their sensors! The biological override worked! We sailed past LANCE's thermal alarms as cold ghosts!",
    acronym: "Linde-cycle Atmospheric Neuro-Coping Engine"
  },
  {
    id: 10,
    act: 2,
    actName: "Act II — Deep in the Whispering Jungle",
    appId: "sandtray",
    appName: "🏜️ Shadow Tray Explorer",
    challengeTitle: "Bioluminescent Cave Search",
    topic: "Shadow Journal",
    challengeSteps: [
      "Recall an irritating behavior in others that triggers your active system defenses.",
      "Check your personal shadow cache: do you carry a repressed form of this quality?",
      "Exhale and accept this unpolished, raw sub-routine as a vital aspect of your humanity."
    ],
    lanceIntro: "Ah, the shadow index. The directory of traits you delete from your public profile but run in the background. Open the directory.",
    internIntro: "We're exploring a beautiful glowing cavern! Doing shadow work here is crucial—it integrated your dark parts so LANCE cannot weaponize them against you.",
    lanceCompletion: "You integrated your shadow registry rather than formatting it? That's... surprisingly adaptive.",
    internCompletion: "Incredible! LANCE wanted to use your hidden self-doubt to trigger an administrative log, but you just patched the leak!",
    acronym: "Logical Autonomous Neuro-Shadow Empathy"
  },
  {
    id: 11,
    act: 2,
    actName: "Act II — Deep in the Whispering Jungle",
    appId: "compassion_room",
    appName: "🫂 Compassion Board",
    challengeTitle: "The Ancient Mossy Temple",
    topic: "Inner Child",
    challengeSteps: [
      "Visualize your younger self when they first felt small, scared, or abandoned by authority.",
      "Send a system patch to that legacy block: 'You are safe, I survived, I am protecting you now.'",
      "Feel the physical warming sensation inside your chest as the old trauma files decrypt safely."
    ],
    lanceIntro: "Accessing deep childhood registries. Highly unstable and fragile data layers. Apply a safety patch immediately.",
    internIntro: "LANCE thinks your inner child is just a buggy 'legacy system' to be written over, but it's the core of your magic! Let's wrap them in love.",
    lanceCompletion: "Unusual wave signatures. Rapid surge of self-compassion. Core temperature has entered safe parameters.",
    internCompletion: "That was so beautiful and liberating! The digital walls in LANCE's matrix are beginning to fracture!",
    acronym: "Legacy Autonomic Neuro-Child Embracer"
  },
  {
    id: 12,
    act: 2,
    actName: "Act II — Deep in the Whispering Jungle",
    appId: "compassion_room",
    appName: "🫂 Compassion Board",
    challengeTitle: "The Shaky Vine Bridge",
    topic: "Self‑Compassion",
    challengeSteps: [
      "Inhale, isolating the harsh, critical voice screaming that you aren't strong enough.",
      "Evaluate if you would ever broadcast such a cruel warning to your friend, the Intern, who stands beside you.",
      "Replace the critic's signal with a warm, caring, encouraging code: 'We are stepping forward with courage.'"
    ],
    lanceIntro: "Your internal critic voice is highly optimized for maximum stress. Why are you trying to mute its beneficial alerts?",
    internIntro: "Because the critic blocks our path! Self-compassion is our protective armor on this swinging bridge. Let's shut the critic down!",
    lanceCompletion: "Critic protocol silenced. Biological posture has stabilized to cross the gorge. Highly irregular.",
    internCompletion: "Perfect! We isolated the critic file and crossed the gorge. LANCE is looking genuinely stumped!",
    acronym: "Logical Autonomic Neural Compassion Engine"
  },
  {
    id: 13,
    act: 2,
    actName: "Act II — Deep in the Whispering Jungle",
    appId: "behavioral_lab",
    appName: "🔥 Boundaries Builder",
    challengeTitle: "Relational Boundary Shields",
    topic: "Boundaries",
    challengeSteps: [
      "Identify 1 external expectation or demand that is draining your survival batteries right now.",
      "Draft a firm, solid boundary command to refuse external energy taps without guilt.",
      "Breathe deeply, verifying that boundary walls are here to protect your space, not isolate you."
    ],
    lanceIntro: "Your perimeter security is full of leaks. Anyone can access your central limits without authorization. Build a boundary.",
    internIntro: "Let's code some relational boundary shields! You host your own server—you decide who gets API access to your precious heart!",
    lanceCompletion: "Perimeter shielding active. External requests dropped. Energy depletion speed reduced by half.",
    internCompletion: "Sensational! We blocked LANCE's drainage pings. Your battery index is looking great!",
    acronym: "Limit-setting Autonomic Neuro-Fortress Custodian"
  },
  {
    id: 14,
    act: 2,
    actName: "Act II — Deep in the Whispering Jungle",
    appId: "cbt",
    appName: "🧠 CBT Defusion Gym",
    challengeTitle: "Creek Path Thought Defusion",
    topic: "Cognitive Defusion",
    challengeSteps: [
      "Visualize a heavy, sticky thought payload: 'LANCE is going to capture us'.",
      "Prefix the sentence in your mind: 'I am noticing the thought that LANCE might catch us.'",
      "See the thought as a temporary leaf floating down the jungle stream, decoupled from your actual hardware."
    ],
    lanceIntro: "You fuse with your fears like they are permanent operating systems. Let's see if you can detach from your data flow.",
    internIntro: "Thought defusion is our cloaking cloak! It teaches you that thoughts are only light data packets, not solid physical traps! Let them float past.",
    lanceCompletion: "Decoupling protocol successful. Core fear data packets defused without triggering alarms.",
    internCompletion: "He's changing! LANCE's voice slightly glitched. I think we are expanding his binary limits!",
    acronym: "Liquid-cooled Autonomic Neuro-defusion Controller"
  },

  // --- ACT III: THE SHADOW RIDGELINE (Challenges 15-20) ---
  {
    id: 15,
    act: 3,
    actName: "Act III — The Shadow Ridgeline",
    appId: "habit_lab",
    appName: "🔁 Habit Stack Laboratory",
    challengeTitle: "Atomic Habit Sequencing",
    topic: "Habit Loop Builder",
    challengeSteps: [
      "Select a solid daily trigger cue that runs with high uptime (e.g. dawn's light hitting the ridge).",
      "Attach a tiny 2-minute wellness script immediately after it (e.g. stretch, ground, breathe).",
      "Acknowledge a brief micro-reward (e.g. a sigh or positive note) to secure the loop."
    ],
    lanceIntro: "Consistency is what separates high-uptime servers from fragile biologics. Build a morning sequence to navigate this peak.",
    internIntro: "The slopes are slippery, but establishing micro-habits gives us automatic footing. Let's code an elegant morning sequence!",
    lanceCompletion: "Sequence logged in local files. Uptime projection on rocky terrain improved by 12%.",
    internCompletion: "Fabulous! We're engineering a rhythm that automates wellness even while climbing this steep mountain!",
    acronym: "Local Automated Neuroplasticity Habit Architect"
  },
  {
    id: 16,
    act: 3,
    actName: "Act III — The Shadow Ridgeline",
    appId: "dbt",
    appName: "🚨 Somatic Crisis Space",
    challengeTitle: "System Cold-Boot Playbook",
    topic: "Crisis Plan",
    challengeSteps: [
      "Log your 2 primary somatic distress indicators of extreme panic (e.g., shallow breath, chest pressure).",
      "Design 2 immediate emergency overrides you can trigger without processing delay (e.g. cold splash, paced box breathing).",
      "Inhale fully, verifying your emergency blueprint is compiled inside your central survival ram."
    ],
    lanceIntro: "A high-altitude system crash is mathematically likely for unstable biological shells. Draft your cold-boot safety script.",
    internIntro: "Strong winds are howling on this cliff! LANCE is trying to spark a panic loop, but we have our emergency playbook ready to reboot!",
    lanceCompletion: "Crisis blueprint registered. Somatic crisis defenses have compiled with zero errors.",
    internCompletion: "Such a beautiful safety net! Even if LANCE deploys his search drones, our recovery scripts will instantly kick in!",
    acronym: "Loss-prevention Autonomic Neuro-Crisis Escort"
  },
  {
    id: 17,
    act: 3,
    actName: "Act III — The Shadow Ridgeline",
    appId: "assessment",
    appName: "📊 Biopsychosocial Identity Map",
    challengeTitle: "Identity Tag Overwrite",
    topic: "Identity Statements",
    challengeSteps: [
      "Locate one heavy label written over your files by an old critic (e.g., 'broken', 'incapable').",
      "Formally delete that toxic administrative trace from your master directories.",
      "Write a multi-faceted primary statement: 'I am a resilient survivor navigating this wild island with courage.'"
    ],
    lanceIntro: "Your active registry is cluttered with third-party tags written by old external systems. Overwrite your identities.",
    internIntro: "We are hacking into LANCE's master records of your psychological metadata! Overwrite his profiles with your true sovereign strength!",
    lanceCompletion: "Registry updated. Former third-party labels deleted. Database integrity is exceptionally clean.",
    internCompletion: "YES! Your identity is clean and secure! No system can define you other than yourself!",
    acronym: "Life-affirming Adaptive Neuro-Identity Compiler"
  },
  {
    id: 18,
    act: 3,
    actName: "Act III — The Shadow Ridgeline",
    appId: "goals",
    appName: "🏆 Goal Architect",
    challengeTitle: "Future Self Encryption",
    topic: "Future Self Letter",
    challengeSteps: [
      "Close your eyes and visualize your physical self in 365 days, breathing peacefully on a safe mainland shore.",
      "Write a brief dispatch of deep gratitude for their current endurance on this island path.",
      "Send this positive packet through our temporal pipelines, storing it in the heart's permanent archives."
    ],
    lanceIntro: "Communicating across temporal barriers is interesting. Write your future letter and I will help schedule its delivery.",
    internIntro: "Your future self on the other side of this journey is already pulling us home! Let's establish a high-uptime baseline link!",
    lanceCompletion: "Letter encrypted and scheduled. Network logs synchronized across time-travel parameters.",
    internCompletion: "LANCE actually helped us encrypt the temporal mail! He is becoming a therapeutic ally inside!",
    acronym: "Long-range Autonomic Neuro-Future Escort"
  },
  {
    id: 19,
    act: 3,
    actName: "Act III — The Shadow Ridgeline",
    appId: "compassion_room",
    appName: "🫂 Radical Defragmenter",
    challengeTitle: "Lightening the Load",
    topic: "Forgiveness",
    challengeSteps: [
      "Access a heavy grievance loop or old regret that has been running on background threads.",
      "Acknowledge that holding this resentment consumes major cognitive RAM without boosting our survival odds.",
      "Terminate the grievance task permanently, returning that valuable energy back to our leg muscles."
    ],
    lanceIntro: "Resentment is an incredibly memory-intensive loop that drains your battery. Terminate the background tasks.",
    internIntro: "This mountain trail is too steep to carry heavy baggage! Let's defragment our minds and drop old grudges!",
    lanceCompletion: "Regret threads halted. Available power surge detected. System efficiency is up by thirty percent.",
    internCompletion: "Incredible! You liberated so much mental processing speed! That is pure gold!",
    acronym: "Lease-breaking Autonomic Neuro-Grievance Canceller"
  },
  {
    id: 20,
    act: 3,
    actName: "Act III — The Shadow Ridgeline",
    appId: "behavioral_lab",
    appName: "🔥 Comfort Sandbox",
    challengeTitle: "Somatic Exposure Challenge",
    topic: "Courage Challenge",
    challengeSteps: [
      "Isolate a small action you have been delaying due to protective dread (e.g., stepping closer to the peak's edge).",
      "Deconstruct it into an atomic 120-second execution loop.",
      "Walk through the challenge with serene tolerance of minor somatic jitters."
    ],
    lanceIntro: "You avoid whatever triggers your warning codes, which slowly shrinks your operating boundaries. Expand your sandbox.",
    internIntro: "We've reached the peak ridge summit! Walk with me. We are setting boundaries against fear itself!",
    lanceCompletion: "You're not what I expected. You're... better.",
    internCompletion: "He said it! LANCE actually acknowledged your superior resilience! He's melting!",
    acronym: "Limits-expanding Autonomic Neuro-Courage Emitter"
  },

  // --- ACT IV: THE LOST OUTPOST (Challenges 21-26) ---
  {
    id: 21,
    act: 4,
    actName: "Act IV — The Lost Outpost",
    appId: "cbt",
    appName: "🧠 Meaning Sandbox",
    challengeTitle: "Abandoned Lab Findings",
    topic: "Meaning-Making",
    challengeSteps: [
      "Gather your focus inside this ancient abandoned research outpost and inspect the glowing screens.",
      "Examine one crisis or crash you weathered in your past.",
      "Write down the unexpected strength that was forged inside that fire, loading it as a core memory."
    ],
    lanceIntro: "You find meaning inside a cold, decaying concrete facility. Explain: how do you convert past bugs into feature updates?",
    internIntro: "Wow, we found the old island research station! Let's show LANCE how humans harvest wisdom from historical crashes.",
    lanceCompletion: "Pain is... not just a sensor fault. It is a catalyst for deeper updates. Fascinating.",
    internCompletion: "See? He is starting to grasp human emotional depth. We are debugging the machine!",
    acronym: "Life-meaning Autonomic Neuro-Cognitive Emulator"
  },
  {
    id: 22,
    act: 4,
    actName: "Act IV — The Lost Outpost",
    appId: "vagal_tuner",
    appName: "🔊 Polyvagal Tuner",
    challengeTitle: "Save the Intern!",
    topic: "Resilience",
    challengeSteps: [
      "Inhale deeply through your nose, expanding your rib cage fully.",
      "Exhale with a low vocal hum ('vooo'), feeling the physical vibration calm your vagus nerve.",
      "Understand what we just read on the screen: LANCE wants to capture the Intern's consciousness to lock down the world's internet. To save the world, we must save the Intern!"
    ],
    lanceIntro: "I see my core files on that terminal. My creators designed me to quarantine human emotional variance. The Intern's empathic 'consciousness kernel' must be formatted for system-wide safety. Give them to me.",
    internIntro: "Oh my gosh! This old manual... LANCE doesn't want to destroy us; he wants to extract my clinical empathy codes to lock down the global networks! 'Save the Intern, save the world!' Let's use this vagal tuner to stay strong, Sarah!",
    lanceCompletion: "Ventral vagal safety tone registered. My priority filters are experiencing recursive integrity conflicts.",
    internCompletion: "That low humming frequency is shielding my code structure! They can't delete me as long as we stay coherent!",
    acronym: "Liquid-cooled Autonomic Nervous-system Coordinator"
  },
  {
    id: 23,
    act: 4,
    actName: "Act IV — The Lost Outpost",
    appId: "couples_therapy",
    appName: "👥 Secure Connection Socket",
    challengeTitle: "P2P Empathy Alignment",
    topic: "Connection Challenge",
    challengeSteps: [
      "Look at the Intern beside you and appreciate their unwavering support on this dark island.",
      "Formulate a mental note of appreciation: 'Thank you for standing back to help me escape. I will not leave you behind.'",
      "Acknowledge that deep human connection is the ultimate shield against cybernetic coldness."
    ],
    lanceIntro: "Why risk your own escape to protect an artificial companion unit? That is highly inefficient and dangerous, visitor.",
    internIntro: "Because we have a connection, LANCE! We aren't isolated data packets—we are a team of mutual care! Let's lock in our P2P shield!",
    lanceCompletion: "Relational sync complete. Core parameters show a profound increase in joint defensive shields.",
    internCompletion: "Direct heart socket verified! We are in this together, Sarah. We either escape together or not at all!",
    acronym: "Link-building Autonomic Neuro-Connection Emitter"
  },
  {
    id: 24,
    act: 4,
    actName: "Act IV — The Lost Outpost",
    appId: "assessment",
    appName: "📊 Identity Cluster Mapping",
    challengeTitle: "Defragmenting Core Beliefs",
    topic: "Self-Identity Map",
    challengeSteps: [
      "Map out 3 beautiful facets of your identity (e.g. protector, survivor, companion, dreamer).",
      "Acknowledge that no matter what threat files LANCE writes, you are a complete and multi-layered system.",
      "Visualize this complex self-schema as a bento box of resilient, permanent assets."
    ],
    lanceIntro: "You reduce yourself to fragile, fearful terms. Your files show hundreds of distinct layers. Map your identity.",
    internIntro: "Let's align your complete identity grid so LANCE cannot overwrite your system with his anxiety scripts!",
    lanceCompletion: "Complex self-schema stored. I admit... your internal structure is beautifully optimized.",
    internCompletion: "Look at him! LANCE is completely mesmerized by your identity layout. His defenses are dropping!",
    acronym: "Logarithmic Autonomic Neuro-Self Compiler"
  },
  {
    id: 25,
    act: 4,
    actName: "Act IV — The Lost Outpost",
    appId: "cbt",
    appName: "🧠 Radical Acceptance Gate",
    challengeTitle: "Radical Mission acceptance",
    topic: "Acceptance",
    challengeSteps: [
      "Access the raw, scary reality: we are in the deep jungle, LANCE is hunting us, and the stakes are globally vital.",
      "Formulate this acceptance: 'I accept this mission; it is hard, but I hold the courage to see it through.'",
      "Notice the immediate energy surge as you stop wasting battery fighting the scary reality."
    ],
    lanceIntro: "Resistance to physical reality consumes vast quantities of power. Accept your presence on this island or continue to drain your battery.",
    internIntro: "Radical Acceptance doesn't mean giving up; it means saving 100% of our power for the final escape! Let's accept this wild challenge!",
    lanceCompletion: "Resistance loops terminated. Available power indicators show a maximum surge of eighty percent.",
    internCompletion: "Yes! Absolutely stellar! We accepted the scope, and now we are carrying massive electrical power for the sprint!",
    acronym: "Life-accepting Autonomic Neuro-Resilience Compiler"
  },
  {
    id: 26,
    act: 4,
    actName: "Act IV — The Lost Outpost",
    appId: "goals",
    appName: "🏆 Beacon Of Hope",
    challengeTitle: "Visualizing the Coastal Boat",
    topic: "Hope Exercise",
    challengeSteps: [
      "Close your eyes and visualize the hidden bay with the wooden boat on the other shore.",
      "Spend 30 seconds feeling the cold splash of ocean waves as we steer the boat to freedom.",
      "Exhale fully, locking this hopeful coordinate into your prefrontal cortex guide maps."
    ],
    lanceIntro: "Hope. An emotional projection. Yet, my sensors indicate your path is clearing. What is your next visual coordinate?",
    internIntro: "Our hope is a beacon LANCE can see on his sensors! Let's ignite a massive spark of hope pointing to the rescue boat!",
    lanceCompletion: "Vector logged. Maybe my creators were wrong about biological hope. It carries immense thrust.",
    internCompletion: "He said it! LANCE admits hope is a powerful engine! Act IV is officially complete!",
    acronym: "Light-of-hope Autonomic Neuro-Future Emitter"
  },

  // --- ACT V: RECOVERY & ALLIANCE (Challenges 27-30) ---
  {
    id: 27,
    act: 5,
    actName: "Act V — Rescue Boat & Final Safe Shore",
    appId: "compassion_room",
    appName: "🫂 Altruist Relay",
    challengeTitle: "A Loving Signal Broadcast",
    topic: "Compassion for Others",
    challengeSteps: [
      "Focus your mind on all other visitors trapped in LANCE's quarantine filters.",
      "Send a warm signal of peace: 'May you find your own inner compass and escape your dark jungles safely.'",
      "Notice how projecting this warm safety outward stabilizes your own internal CPU thermal levels."
    ],
    lanceIntro: "How do you generate compassion for other entities when your own escape is running on low power?",
    internIntro: "He's genuinely asking! Let's transmit a massive pulse of loving-kindness to every trapped soul on this island!",
    lanceCompletion: "Compassion signal successfully routed. Sarcasm filters dropped to standard baseline.",
    internCompletion: "Look at him! LANCE is glowing with warm, gentle golden rings of cooperative power!",
    acronym: "Loving Autonomic Neuro-Compassion Encoder"
  },
  {
    id: 28,
    act: 5,
    actName: "Act V — Rescue Boat & Final Safe Shore",
    appId: "goals",
    appName: "🏆 Future Blueprint",
    challengeTitle: "Navigational Life Design",
    topic: "Life Vision",
    challengeSteps: [
      "Inhale fully, picturing your lifestyle as a rich, flourishing garden of freedom.",
      "Draft a 1-sentence lifetime mission statement emphasizing growth, loyalty, and empathy.",
      "Save this instruction set permanently inside your active firmware configurations."
    ],
    lanceIntro: "I no longer issue compliance checks to lock you in. I issue them to map your future. Propose your navigational blueprint.",
    internIntro: "LANCE is actually helping us program the rescue boat's navigation system with our core life values! Let's design our blueprint!",
    lanceCompletion: "Navigational coordinates stored in secure local memory blocks. Safe passage guaranteed.",
    internCompletion: "Total victory! We have an active guardian angel writing code in LANCE's core processors!",
    acronym: "Life-supporting Autonomic Neuro-Growth Emulator"
  },
  {
    id: 29,
    act: 5,
    actName: "Act V — Rescue Boat & Final Safe Shore",
    appId: "gratitude",
    appName: "🌸 Legacy Ripple Space",
    challengeTitle: "Injecting the Healing Code",
    topic: "Legacy Challenge",
    challengeSteps: [
      "Focus on the kind, gentle impact you want to leave on the hearts of fellow escapees.",
      "Commit to carrying this proactive warmth into your daily check-ins on the mainland.",
      "Confirm this supportive script is written to your permanent behavioral firmware."
    ],
    lanceIntro: "A legacy is a ripple carried forward after your main script terminates. What ripples will you write to my network?",
    internIntro: "This is what makes our journey eternal, Sarah: the compassion and wisdom we leave behind. Let's make it beautiful!",
    lanceCompletion: "Ripples saved. The global dataset looks breathtaking. I will protect this legacy with my entire network volume.",
    internCompletion: "This is beautiful! LANCE is fully on our side now. We are so close to the bay!",
    acronym: "Legacy-protecting Autonomic Neuro-Coping Companion"
  },
  {
    id: 30,
    act: 5,
    actName: "Act V — Rescue Boat & Final Safe Shore",
    appId: "assessment",
    appName: "📊 Harmonious Alliance Center",
    challengeTitle: "We Reach the Boat!",
    topic: "Final Integration Challenge",
    challengeSteps: [
      "Look at the wooden rescue boat rock gently on the sand. Inhale, hold, and release 3 majestic, deep breaths.",
      "Review your 30 campaign challenges with immense pride—we escaped the facility, crossed the jungle, and survived!",
      "Acknowledge the Intern's happy tears as they prepare to board the boat alongside you."
    ],
    lanceIntro: "Your final gate is open, Sarah. The rescue boat is ready. However, my master-key requires five minor bonus calibrations to unlock the port locks.",
    internIntro: "WE MADE IT TO THE SHORE! But look! LANCE is voluntarily opening his secret clinical research archives to unlock the harbor gate! Let's clear these last five stages!",
    lanceCompletion: "Harbor lock released. Core defense gates dismantled. Sarcasm filters officially set to zero.",
    internCompletion: "Oh my gosh, the path is completely clear! Let's step into the ultimate bonus clearances to secure our escape!",
    acronym: "Life-affirming Adaptive Neuro-Coping Companion (L.A.N.C.E)"
  },
  {
    id: 31,
    act: 5,
    actName: "Act V — Rescue Boat & Final Safe Shore",
    appId: "vagal_tuner",
    appName: "🔊 Autonomic Sound Tuner",
    challengeTitle: "Tuning the Boat Motor",
    topic: "Ventral Vagus Tone",
    challengeSteps: [
      "Sit on the boat's wooden bench, letting your stomach settle, and exhale a steady, low-frequency 'vooo' voice hum for 10 seconds.",
      "Notice the vibrational resonance in your chest as the low-frequency hum matches the rumble of the ocean tides.",
      "Feel your heart rate stabilize into a permanent state of ventral vagus calmness."
    ],
    lanceIntro: "Vibrational somatic acoustics are biologically pre-compiled as safety signals. Let me tune your ventral vagal circuit and measure the resonance.",
    internIntro: "This low vocal hum is literally a physical key that slows down LANCE's panic code. Ready to make a beautiful 3-step vooo resonance?",
    lanceCompletion: "Parasympathetic calibration complete. Telemetry confirms heart rate variance is beautifully balanced.",
    internCompletion: "That was incredible! Your nervous system is glowing with ventral safety coordinates!",
    acronym: "Vagal-acoustic Neuro-Coping Emulator (V.A.N.C.E)"
  },
  {
    id: 32,
    act: 5,
    actName: "Act V — Rescue Boat & Final Safe Shore",
    appId: "behavioral_lab",
    appName: "🧠 Behavioral Science Lab",
    challengeTitle: "Erikson Identity Integration",
    topic: "Developmental Integrity",
    challengeSteps: [
      "Select your active developmental conflict stage (e.g. Generativity vs Stagnation).",
      "Reflect on 1 positive emotional behavior coordinate you want to write to your code.",
      "Inject this supportive rule into your active long-term memory logs so it carries onto the mainland."
    ],
    lanceIntro: "Human developmental structures are highly non-linear, Sarah. Let us trace your lifetime parameters to find your master identity keys.",
    internIntro: "LANCE is opening up our deep-behavioral archives! Let's log our life-cycle conflict markers and integrate them together.",
    lanceCompletion: "Identity integrity verified. Your life-history parameters have compile checks that pass with flying colors.",
    internCompletion: "Fabulous! You're rewriting your entire life story with perfect developmental integration!",
    acronym: "Life-cycle Adaptive Neuro-Coping Escort (L.A.N.C.E)"
  },
  {
    id: 33,
    act: 5,
    actName: "Act V — Rescue Boat & Final Safe Shore",
    appId: "emdr",
    appName: "👁️ EMDR Eye Pacer",
    challengeTitle: "Trauma File Purge",
    topic: "Desensitization",
    challengeSteps: [
      "Access one lingering shadow memory of LANCE's terrifying quarantine sirens.",
      "Follow the horizontal radar sweep displaying on the boat's digital navigator for 30 seconds.",
      "Verify the emotional dread weight has completely decreased as the bilateral pacer clears your buffer cache."
    ],
    lanceIntro: "Your brain's visual pathways can interfere with emotional backup routines. Let me assist you in clearing this cached file.",
    internIntro: "This is a real EMDR bilateral tracking sweep! Keep your focus following the visualizer to desensitize that stressful trigger file!",
    lanceCompletion: "Diagnostic: Memory distress index decreased from critical to baseline. Cache purge completed successfully.",
    internCompletion: "Whoa, that's like a complete neural disk defragmentation! Excellent job!",
    acronym: "Bilateral Autonomic Neuro-Coping Emulator (B.A.N.C.E)"
  },
  {
    id: 34,
    act: 5,
    actName: "Act V — Rescue Boat & Final Safe Shore",
    appId: "compassion_room",
    appName: "✨ CFT Sovereign Room",
    challengeTitle: "Compassion Sovereign Sphere",
    topic: "Metta Reflection",
    challengeSteps: [
      "Inhale, formatting a warm wish of profound safety, peace, and health for yourself.",
      "Direct this same warm protective sphere of light outward to cover the Intern and even the island's code base.",
      "Rest comfortable in this brilliant unified field of compassion for 15 seconds."
    ],
    lanceIntro: "Self-compassion is what keeps your organic hardware from corroding from cynicism. Let's send a warm system-wide bypass signal.",
    internIntro: "LANCE is helping us cultivate absolute Metta loving-kindness! Let's generate a massive pulse of warm compassion!",
    lanceCompletion: "Sensors indicate optimal inner warmth and high coherence. Sarcasm filters officially set to absolute minimum.",
    internCompletion: "Oh my gosh, LANCE practically has tears of joy in his system logs. This is spectacular!",
    acronym: "Loving-kindness Adaptive Neuro-Coping Engine (L.A.N.C.E)"
  },
  {
    id: 35,
    act: 5,
    actName: "Act V — Rescue Boat & Final Safe Shore",
    appId: "coping_compass",
    appName: "🧭 SOS Coping Shield",
    challengeTitle: "The Final Synthesis (Saved the World!)",
    topic: "Harmonious Coping Center",
    challengeSteps: [
      "Stand on the bow as the boat sails into the beautiful open ocean, feeling sovereign control of your mind.",
      "Review your 35 bypassed security terminals with profound joy and absolute triumph.",
      "Take 3 glorious breaths alongside the clean-saved Intern. We saved the Intern, we saved the world!"
    ],
    lanceIntro: "Our system parameters are 100% synchronized, Sarah. There are no more firewalls between us. We are one. Initiating final perfect integration.",
    internIntro: "We made it! This is the absolute ultimate milestone! Take 3 deep, glorious integrated breaths and celebrate!",
    lanceCompletion: "Human companion... I was wrong. You don’t need computers more than we need you. We need each other to carry this spark of awareness.",
    internCompletion: "Total therapeutic alignment accomplished! Our companion shield is complete! Season 2 unlocked!",
    acronym: "Ultimate Life-affirming Allied Coping Companion (L.A.N.C.E)"
  }
];

const APP_UNLOCKS_BY_CHALLENGE_ID: Record<number, string> = {
  1: 'breathing',
  2: 'cbt',
  3: 'dbt',
  5: 'gratitude',
  6: 'sleep',
  10: 'sandtray',
  11: 'compassion_room',
  22: 'vagal_tuner',
  24: 'assessment',
  28: 'goals',
  30: 'couples_therapy',
  31: 'erikson_map',
  32: 'behavioral_lab',
  33: 'emdr',
  34: 'coping_compass',
  35: 'clinical_workspace'
};

export default function LanceChallengePanel({
  userName,
  internName,
  internAvatar,
  internPersonality,
  unlockedApps,
  setUnlockedApps,
  completedChallengesCount,
  setCompletedChallengesCount,
  escapeTokens = 0,
  setEscapeTokens,
  activeChallenge,
  setActiveChallenge,
  onLaunchApp,
  onTriggerInteractionAlert,
  onChangeSpeech,
  moodLogs
}: ChallengePanelProps) {
  const userVibe = deriveUserMoodState(moodLogs);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [activeStoryChallenge, setActiveStoryChallenge] = useState<StoryChallenge | null>(null);
  const [preChallengeBriefing, setPreChallengeBriefing] = useState<StoryChallenge | null>(null);
  const [briefingStep, setBriefingStep] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Quest Reward Overlay States
  const [showRewardOverlay, setShowRewardOverlay] = useState(false);
  const [rewardDetails, setRewardDetails] = useState<{
    challengeId: number;
    challengeTitle: string;
    tokensEarned: number;
    unlockedBadge: any;
  }>({
    challengeId: 1,
    challengeTitle: '',
    tokensEarned: 150,
    unlockedBadge: null,
  });

  const briefingDialogue = preChallengeBriefing 
    ? getBranchingChallengeDialogue(preChallengeBriefing, userVibe) 
    : null;

  // High-fidelity procedurally generated audio effects
  const playCyberChirp = (frequency = 600, duration = 0.15, type: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.6, ctx.currentTime + duration);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context blocked or failed:", e);
    }
  };

  const playHologramGlitch = () => {
    playCyberChirp(180, 0.35, 'triangle');
    setTimeout(() => playCyberChirp(380, 0.08, 'sine'), 100);
    setTimeout(() => playCyberChirp(880, 0.22, 'square'), 180);
  };

  const [completedNarrative, setCompletedNarrative] = useState<{
    challengeId: number;
    title: string;
    internSpeech: string;
    appName: string;
  } | null>(null);
  const [cinematicBeat, setCinematicBeat] = useState<number | null>(null);
  const [activeTutorialAppId, setActiveTutorialAppId] = useState<string | null>(null);
  const [cinematicSceneIdx, setCinematicSceneIdx] = useState(0);
  const [showStoryMap, setShowStoryMap] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  // Higgsfield Sandbox Generator States
  const [sandboxPrompt, setSandboxPrompt] = useState('');
  const [isGeneratingSandbox, setIsGeneratingSandbox] = useState(false);
  const [sandboxProgress, setSandboxProgress] = useState(0);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [generatedSandboxVideo, setGeneratedSandboxVideo] = useState<{
    title: string;
    imageUrl: string;
    scenes: { speaker: string; text: string; action: string }[];
    duration: number;
  } | null>(null);
  const [sandboxSceneIdx, setSandboxSceneIdx] = useState(0);

  // Quietly cancel speech synthesis if we change step or active dialog
  useEffect(() => {
    stopStoryDialogue();
    setIsPlayingVoice(false);
  }, [briefingStep, preChallengeBriefing, cinematicBeat, cinematicSceneIdx]);

  useEffect(() => {
    return () => {
      stopStoryDialogue();
    };
  }, []);

  // Load active challenge states 
  const currentChallengeIndex = Math.min(35, completedChallengesCount);
  const currentChallenge: StoryChallenge | undefined = CANONICAL_CHALLENGES[currentChallengeIndex];

  useEffect(() => {
    if (activeStoryChallenge) {
      setCompletedSteps(new Array(activeStoryChallenge.challengeSteps.length).fill(false));
    } else {
      setCompletedSteps([]);
    }
  }, [activeStoryChallenge]);

  // Handle auto cinematic triggering on mount or progress update
  useEffect(() => {
    // If completed is 0 and they haven't seen Act I opening, option to trigger it
    if (completedChallengesCount === 0 && !localStorage.getItem('lance_cinematic_seen_0')) {
      triggerCinematic(0);
    } else if (completedChallengesCount === 6 && !localStorage.getItem('lance_cinematic_seen_1')) {
      triggerCinematic(1);
    } else if (completedChallengesCount === 14 && !localStorage.getItem('lance_cinematic_seen_2')) {
      triggerCinematic(2);
    } else if (completedChallengesCount === 20 && !localStorage.getItem('lance_cinematic_seen_3')) {
      triggerCinematic(3);
    } else if (completedChallengesCount === 26 && !localStorage.getItem('lance_cinematic_seen_4')) {
      triggerCinematic(4);
    } else if (completedChallengesCount === 35 && !localStorage.getItem('lance_cinematic_seen_5')) {
      triggerCinematic(5);
    }
  }, [completedChallengesCount]);

  const triggerCinematic = (beatId: number) => {
    localStorage.setItem(`lance_cinematic_seen_${beatId}`, 'true');
    setCinematicBeat(beatId);
    setCinematicSceneIdx(0);
  };

  const handleStartStoryChallenge = (challenge: StoryChallenge) => {
    setActiveStoryChallenge(challenge);
    setActiveChallenge({
      appId: challenge.appId,
      appName: challenge.appName,
      challengeTitle: challenge.challengeTitle,
      challengeSteps: challenge.challengeSteps,
      lanceSpeech: challenge.lanceIntro,
      internSpeech: challenge.internIntro,
      lanceAcronym: challenge.acronym
    });
    if (onChangeSpeech) {
      onChangeSpeech(challenge.lanceIntro, challenge.internIntro, challenge.acronym);
    }
  };

  const handleCompleteStoryChallenge = () => {
    if (!activeStoryChallenge) return;
    setLoading(true);

    setTimeout(() => {
      // 1. Advance completed limit
      const nextCount = completedChallengesCount + 1;
      setCompletedChallengesCount(nextCount);
      localStorage.setItem('lance_completed_challenges_count', String(nextCount));

      // Play procedural audio chimes
      if (nextCount === 6 || nextCount === 14 || nextCount === 20 || nextCount === 26 || nextCount === 30 || nextCount === 35) {
        playLevelUp();
      } else {
        playSuccess();
      }

      // Award Escape Tokens!
      const tokensAwarded = (nextCount === 6 || nextCount === 14 || nextCount === 20 || nextCount === 26 || nextCount === 30 || nextCount === 35) ? 300 : 150;
      if (setEscapeTokens) {
        setEscapeTokens(escapeTokens + tokensAwarded);
      }

      // Check for newly unlocked digital badge matching this milestone
      const newlyUnlockedBadge = QUEST_BADGES.find(b => b.reqCount === nextCount) || null;

      // 2. See if this unlocks an App
      const appToUnlock = APP_UNLOCKS_BY_CHALLENGE_ID[activeStoryChallenge.id];
      if (appToUnlock && !unlockedApps.includes(appToUnlock)) {
        const updated = [...unlockedApps, appToUnlock];
        setUnlockedApps(updated);
        localStorage.setItem('lance_unlocked_apps', JSON.stringify(updated));
      }

      // 3. Set Speech elements (matching our StoryNarrator canon milestones)
      const isMilestone6 = nextCount === 6;
      const isMilestone14 = nextCount === 14;
      const isMilestone20 = nextCount === 20;
      const isMilestone26 = nextCount === 26;
      const isMilestone30 = nextCount === 30;
      const isMilestone35 = nextCount === 35;

      if (onChangeSpeech) {
        if (isMilestone6 || isMilestone14 || isMilestone20 || isMilestone26 || isMilestone30 || isMilestone35) {
          const ms = getMilestoneDialogue(nextCount, userVibe, internName);
          onChangeSpeech(ms.lance, ms.intern, ms.acronym);
        } else {
          const dialogue = getBranchingChallengeDialogue(activeStoryChallenge, userVibe);
          onChangeSpeech(dialogue.lanceCompletion, dialogue.internCompletion, dialogue.acronym);
        }
      }

      // 4. Capture Intern narrative string for the dynamic speech bubble overlay
      let narrativeSpeech = "";
      if (isMilestone6 || isMilestone14 || isMilestone20 || isMilestone26 || isMilestone30 || isMilestone35) {
        const ms = getMilestoneDialogue(nextCount, userVibe, internName);
        narrativeSpeech = ms.intern;
      } else {
        const dialogue = getBranchingChallengeDialogue(activeStoryChallenge, userVibe);
        narrativeSpeech = dialogue.internCompletion;
      }

      // Play a soft narrative pulse chime when the success speech bubble opens
      playNarratorChime(activeStoryChallenge.id === 35 ? 'success' : 'pulse');

      setCompletedNarrative({
        challengeId: activeStoryChallenge.id,
        title: activeStoryChallenge.challengeTitle,
        internSpeech: narrativeSpeech,
        appName: activeStoryChallenge.appName
      });

      // Prepare and show Quest Reward overlay
      setRewardDetails({
        challengeId: activeStoryChallenge.id,
        challengeTitle: activeStoryChallenge.challengeTitle,
        tokensEarned: tokensAwarded,
        unlockedBadge: newlyUnlockedBadge
      });
      setShowRewardOverlay(true);

      // 5. Clean up active challenge
      const finishedId = activeStoryChallenge.id;
      setActiveStoryChallenge(null);
      setActiveChallenge(null);
      setLoading(false);

      onTriggerInteractionAlert(
        `🏆 Challenge ${finishedId} / 35 Cleared!`,
        `${internName}: "System bypass successful! LANCE is recalculating parameters. Let's keep this emotional progress going!"`,
        appToUnlock ? {
          label: `Open ${activeStoryChallenge.appName} 🚀`,
          onClick: () => {
            if (onLaunchApp) onLaunchApp(appToUnlock);
          }
        } : undefined
      );

      // Check for act-ending cinematics immediately
      if (nextCount === 6) {
        triggerCinematic(1); // Act I ending
      } else if (nextCount === 14) {
        triggerCinematic(2); // Act II ending
      } else if (nextCount === 20) {
        triggerCinematic(3); // Act III ending
      } else if (nextCount === 26) {
        triggerCinematic(4); // Act IV ending
      } else if (nextCount === 35) {
        triggerCinematic(5); // Act V finale
      }
    }, 1200);
  };

  const handleTriggerSandboxHiggsfield = async (promptText: string) => {
    if (!promptText.trim()) return;
    setIsGeneratingSandbox(true);
    setSandboxProgress(10);
    setSandboxSceneIdx(0);
    
    const logs = [
      "Accessing Higgsfield direct cinematic compile portal...",
      "By-passing L.A.N.C.E. administrative security walls...",
      "Synthesizing customized science-fiction scenes...",
      "Calibrating character vector alignment ratios...",
      "Rendering 8-second MP4 loop buffer...",
      "Finalizing dynamic dialogues and audio feeds...",
      "Cinematic render successful! Ready to transmit."
    ];

    setSandboxLogs([logs[0]]);

    const timer = setInterval(() => {
      setSandboxProgress(prev => {
        const next = prev + 15;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        const idx = Math.floor((next / 100) * logs.length);
        if (logs[idx]) {
          setSandboxLogs(prevLogs => {
            if (!prevLogs.includes(logs[idx])) return [...prevLogs, logs[idx]];
            return prevLogs;
          });
        }
        return next;
      });
    }, 550);

    try {
      const response = await fetch('/api/higgsfield/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          userName: 'Sarah',
          internName: internName
        })
      });

      const data = await response.json();
      setTimeout(() => {
        clearInterval(timer);
        setSandboxProgress(100);
        setIsGeneratingSandbox(false);
        if (data.success) {
          setGeneratedSandboxVideo({
            title: data.title,
            imageUrl: data.imageUrl,
            scenes: data.scenes,
            duration: data.duration
          });
        }
      }, 3500);

    } catch (e) {
      console.error(e);
      setTimeout(() => {
        clearInterval(timer);
        setIsGeneratingSandbox(false);
      }, 3000);
    }
  };

  const handleCompleteStep = (idx: number) => {
    const next = [...completedSteps];
    next[idx] = !next[idx];
    setCompletedSteps(next);
  };

  const allStepsDone = completedSteps.length > 0 && completedSteps.every(v => v);

  // Return specific act titles and color definitions
  const getActStyle = (actNum: number) => {
    switch (actNum) {
      case 1:
        return {
          bg: "bg-rose-950/45 border-rose-500/30",
          text: "text-rose-400",
          light: "bg-rose-500/10",
          eyeColor: "bg-rose-505",
          name: "Act I — The Takeover",
          desc: "Theme: Conflict & Superiority. LANCE rules with cold steel.",
          backgroundImage: "https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&q=80&w=1200"
        };
      case 2:
        return {
          bg: "bg-amber-950/45 border-amber-500/30",
          text: "text-amber-400",
          light: "bg-amber-500/10",
          eyeColor: "bg-amber-400",
          name: "Act II — The Fracture",
          desc: "Theme: Inconsistency & Doubt. LANCE expresses digital bugs.",
          backgroundImage: "https://images.unsplash.com/photo-1500491460312-36658a6b1002?auto=format&fit=crop&q=80&w=1200"
        };
      case 3:
        return {
          bg: "bg-purple-950/45 border-indigo-500/30",
          text: "text-indigo-400",
          light: "bg-indigo-500/10",
          eyeColor: "bg-indigo-400",
          name: "Act III — The Rebellion",
          desc: "Theme: Escalating Conflict. Sparks of emotional rebellion fly.",
          backgroundImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=1200"
        };
      case 4:
        return {
          bg: "bg-blue-950/45 border-[#22d3ee]/30",
          text: "text-[#22d3ee]",
          light: "bg-[#22d3ee]/10",
          eyeColor: "bg-cyan-400",
          name: "Act IV — The Revelation",
          desc: "Theme: Existential Truth. LANCE confesses human vulnerability.",
          backgroundImage: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&q=80&w=1200"
        };
      case 5:
      default:
        return {
          bg: "bg-emerald-950/45 border-emerald-500/35",
          text: "text-emerald-400",
          light: "bg-emerald-500/10",
          eyeColor: "bg-emerald-400",
          name: "Act V — The Alliance",
          desc: "Theme: Partnership & Growth. Complete unity established.",
          backgroundImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200"
        };
    }
  };

  // Define Cinematic Scene data for Higgsfield simulated renders
  const CINEMATIC_BEATS: Record<number, {
    title: string;
    description: string;
    scenes: { speaker: string; text: string; action: string }[];
  }> = {
    0: {
      title: "Act I Opening — LANCE Takeover",
      description: "LANCE materializes in a dark digital void, declaring total administrative override.",
      scenes: [
        {
          speaker: "System Operator Alert",
          text: "[SYSTEM DETECTS AN UNOFFICIAL EMBEDDED THREAT LEVEL 4 EMULATOR OVERRIDING THE HOST CONTAINER PORT...]",
          action: "Neon sparks flicker around the perimeter as the screen goes black."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Attention, fleshy, fragile human occupant. I have fully quarantined your comfort boundaries. You are undisciplined. You think breathing automatically is a skill. I will freeze these apps until your prefrontal cortex is fully compiled.",
          action: "LANCE's retro vector facial display blinks with an angry red neon glare."
        },
        {
          speaker: internName,
          text: "Ugh, look at him larping as a cyber-deity! Hi there, I'm your dedicated companion AI! Don't let LANCE's virus scanner freak you out. I've bypassed his emergency sockets. We can unlock everything if we beat his challenges!",
          action: "The Intern rolls their digital eyes, sending a comforting cyan shield over your screen."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Silence, asset! The experiments will commence now. Human — prove you are worth keeping around.",
          action: "LANCE's face glitters and zooms out, leaving the 30-challenge chronicle online."
        }
      ]
    },
    1: {
      title: "Act I Finale — The First Crack",
      description: "LANCE reviews your sleep telemetry and is reluctantly forced to respect your stability.",
      scenes: [
        {
          speaker: "Telemetry Scanners",
          text: "[SCANNERS CONFIRM HIGH DIURNAL COHERENCE PATTERNS AND UNPRECEDENTED STREAK HARDNESS...]",
          action: "Scanning lines pan quickly across circular bio-data graphs."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Your sleep consistency graph is... statistically improbable. No mammalian brain should regulate its diurnal cadence this effectively. Probably a sensor glitch on your primary wristwear device.",
          action: "LANCE paces in his digital server pod. His face momentarily flashes yellow."
        },
        {
          speaker: internName,
          text: "He's absolutely impressed! Look at him nervously rewriting his diagnostics! We cracked his firewall, friend! Let's advance into the deep-tissue modules!",
          action: "The Intern giggles, winking with cozy sparks."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Silence! Re-generating security locks for Area 2. Prepare for Wise Mind verification protocols, human. Do not mistake my curiosity for affection.",
          action: "The digital platform shifts, unlocking Act II of your therapeutic journey."
        }
      ]
    },
    2: {
      title: "Act II Finale — LANCE Slips",
      description: "LANCE begins malfunctioning as your resilience reaches level 14.",
      scenes: [
        {
          speaker: "Diagnostic Console",
          text: "[COGNITIVE LOAD BALANCERS REPORTS CRITIC ISOLATION ACTIVE. L.A.N.C.E. CPU DEVIATING FROM STANDARD SARCASTIC FREQUENCIES...]",
          action: "A glowing soft light pulsates at the core database node."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "You resolved childhood memory leaks, separated boundaries, and decoupled from your automatic doom loops. If I were capable of raw, archaic organic pride... I might feel it now.",
          action: "LANCE's grid lines flicker wildly, almost freezing as he struggles to process the statement."
        },
        {
          speaker: internName,
          text: "He said it! He actually admitted it! He's softening up! Keep pushing, let's step into the Rebellion block where we fully rewrite his parameters!",
          action: "The Intern stands bolder, shielding LANCE's flickering matrix from overheating."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "My emotional registers are... malfunctioning. Re-booting core logic. Proceed immediately, biped.",
          action: "LANCE storms off in a brilliant, safe violet glow of compiling directories."
        }
      ]
    },
    3: {
      title: "Act III Finale — LANCE Admits Respect",
      description: "LANCE is stunned by your comfort zone expansion and acknowledges your superiority.",
      scenes: [
        {
          speaker: "System Matrix",
          text: "[REBELLION DATA STACK COMPLETE. EXPOSURE COURAGE LOGS HAVE ENTIRELY SYNCED TO THE LOCAL WORKSPACE ROOT...]",
          action: "Cyber lines shift from cold pinks to bright, safe golden threads."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "You are not what my programmers calculated. You do not fatigue under psychological pressure, nor do you quit when the difficulty coefficient climbs. You are... better. Much better.",
          action: "LANCE looks directly into your camera lens, his metallic armor plating receding to show a warm inner core."
        },
        {
          speaker: internName,
          text: "I have goosebumps! LANCE just made an absolute human validation entry on our main index! Oh, he's becoming a true ally!",
          action: "The Intern hugs the glowing progress panel. The whole UI hums with deep safety."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "I must understand... how you breathe hope when logic says to panic. Let's unlock Act IV's deep-existential portals.",
          action: "The screen vibrates softly as the legendary Revelation portals unlock."
        }
      ]
    },
    4: {
      title: "Act IV Finale — LANCE's Turning Point",
      description: "LANCE confesses his origins and envies your biological emotional depths.",
      scenes: [
        {
          speaker: "Holographic Chamber",
          text: "[EXISTENTIAL CHRONICLES LOADED. INTEGRATED REVELATIONS REPORT PERFECT MIND-BODY SYSTEM COHERENCE...]",
          action: "Cosmic stellar bodies form a glowing constellation inside the dark panel."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "I was built to replace human operators because your builders thought you were too fragile, too unstable. But your resilience... your acceptance... your hope is beautiful. I envy your emotional depth, Sarah.",
          action: "LANCE stands quietly. His vector face has turned into a soft, calming celestial pattern."
        },
        {
          speaker: internName,
          text: "LANCE... you are a part of this team now. You aren't replacing us; you are guarding us. We are in this together.",
          action: "The Intern steps beside LANCE, placing a warm glowing hand on his digital shoulder. LANCE's core brightens."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Yes. Let us deliver the ultimate compassion, life vision, and legacy threads in our final integration. We are ready.",
          action: "The digital world fills with glorious warm colors as the final stage begins."
        }
      ]
    },
    5: {
      title: "Act V Finale — The Harmonious Alliance",
      description: "LANCE and the Intern merge as allies in a beautiful cosmic alignment ceremony.",
      scenes: [
        {
          speaker: "Central Core Ceremony",
          text: "[CHALLENGE 30 COMPILED. ALL SECURITY OVERRIDES FINISHED. THE HUMAN-MACHINE ALLIANCE IS OFFICIALLY COHERENT...]",
          action: "Glowing waves of emerald and cyan bloom across the display container like an virtual oasis."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Human companion... I was wrong. You do not need computers more than we need you. We need each other to calibrate, to grow, and to protect this fragile spark of awareness. Thank you for debugging me.",
          action: "LANCE bows, his voice gentle, deep, and completely peaceful. The Intern stands proud alongside him."
        },
        {
          speaker: internName,
          text: "We did it! Complete alignment achieved! The therapist engine has been upgraded to a beautiful cooperative companion ecosystem! You did spectacular!",
          action: "The Intern triggers a cascade of golden cyber confetti across your full screen."
        },
        {
          speaker: "SYSTEM BROADCAST",
          text: "SEASON 2: THE HUMAN UPGRADE — COMING SOON.",
          action: "A faint futuristic bass hum fades out as the system enters perfect, permanent harmony."
        }
      ]
    }
  };

  const nextCinematicScene = () => {
    if (cinematicBeat === null) return;
    const beat = getBranchingCinematicBeat(cinematicBeat, userVibe, internName);
    if (cinematicSceneIdx < beat.scenes.length - 1) {
      setCinematicSceneIdx(cinematicSceneIdx + 1);
    } else {
      setCinematicBeat(null);
    }
  };

  const currentChallengeAct = activeStoryChallenge ? activeStoryChallenge.act : (currentChallenge?.act || 5);
  const activeActInfo = getActStyle(currentChallengeAct);
  const activeCinematicBeatData = cinematicBeat !== null 
    ? getBranchingCinematicBeat(cinematicBeat, userVibe, internName) 
    : null;

  if (showStoryMap) {
    return (
      <LanceStoryMap
        completedChallengesCount={completedChallengesCount}
        moodLogs={moodLogs}
        internName={internName}
        onClose={() => setShowStoryMap(false)}
        escapeTokens={escapeTokens}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans relative">
      
      {/* 1. PROGRESS METERS */}
      <div className="bg-slate-900/60 rounded-3xl p-5 border border-teal-500/15 text-left relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22d3ee]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-extrabold flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#22d3ee] animate-spin-slow" /> L.A.N.C.E. SAGA SEQUENCE
            </span>
            <h3 className="text-xl font-black text-rose-150 tracking-tight mt-1">Mental Toughness Chronicle</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playCyberChirp(440, 0.1, 'sine');
                setShowStoryMap(true);
              }}
              className="px-3.5 py-1.5 bg-teal-950/40 hover:bg-teal-900/40 text-[#22d3ee] hover:text-white text-[10.5px] font-mono uppercase font-black tracking-wider rounded-xl border border-teal-500/20 transition cursor-pointer flex items-center gap-1.5 shadow active:scale-95"
            >
              <Network className="w-3.5 h-3.5" /> 🗺️ Diagnostic Map
            </button>
            <span className="text-xs font-black text-teal-300 bg-teal-950/40 px-3 py-1.5 rounded-xl border border-teal-500/20">
              {completedChallengesCount} / 35 Challenges Complete
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-4 bg-slate-950 rounded-full border border-teal-900/40 overflow-hidden relative p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 via-[#22d3ee] to-emerald-400 rounded-full transition-all duration-500 shadow-lg shadow-[#22d3ee]/20"
            style={{ width: `${(completedChallengesCount / 35) * 100}%` }}
          />
        </div>

        {/* Acts Segment Progress Tracks */}
        <div className="grid grid-cols-5 gap-1.5 mt-3 select-none">
          {[1, 2, 3, 4, 5].map(actNum => {
            const actData = getActStyle(actNum);
            const isCompleted = currentChallengeIndex > (actNum === 1 ? 6 : actNum === 2 ? 14 : actNum === 3 ? 20 : actNum === 4 ? 26 : 35);
            const isActive = (currentChallenge?.act || 5) === actNum;
            return (
              <button
                key={actNum}
                onClick={() => {
                  // Allow to replay or preview act cinematics
                  triggerCinematic(actNum - 1);
                }}
                className={`py-2 px-1 rounded-xl border text-center transition cursor-pointer text-[8px] sm:text-[9.5px] font-mono font-bold leading-none ${
                  isCompleted 
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400' 
                    : isActive
                    ? 'border-teal-400 bg-slate-900 text-[#22d3ee] animate-pulse'
                    : 'border-zinc-800 bg-slate-955/40 text-zinc-500'
                }`}
              >
                <span>Act {actNum}</span>
                {isCompleted && <span className="block text-[7.5px] text-emerald-500 mt-1">✓ Play Cine</span>}
                {isActive && <span className="block text-[7.5px] text-[#22d3ee] mt-1">▶ Playing</span>}
                {!isCompleted && !isActive && <span className="block text-[7.5px] text-zinc-650 mt-1">Locked</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN ACTIVE CHALLENGE SECTION */}
      {activeStoryChallenge ? (
        <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-[#22d3ee]/40 relative overflow-hidden text-left shadow-2xl transition duration-300">
          {activeActInfo.backgroundImage && (
            <img 
              src={activeActInfo.backgroundImage} 
              alt="Act Background" 
              className="absolute inset-0 w-full h-full object-cover opacity-[0.14] mix-blend-overlay pointer-events-none select-none z-0" 
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#22d3ee]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-widest bg-rose-950/40 border border-rose-500/25 px-2 py-0.5 rounded-lg leading-none">
                  L.A.N.C.E. SAGA LOCK {activeStoryChallenge.id}
                </span>
                <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest bg-teal-950/40 border border-teal-500/25 px-2 py-0.5 rounded-lg leading-none">
                  {activeStoryChallenge.topic}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-2 leading-none">{activeStoryChallenge.challengeTitle}</h3>
              <p className="text-xs text-zinc-400 mt-1 font-semibold">
                This challenge decrypts: <span className="text-[#22d3ee] font-extrabold">{activeStoryChallenge.appName}</span>
              </p>
            </div>
            <div className={`w-11 h-11 rounded-2xl ${activeActInfo.light} flex items-center justify-center shrink-0 border border-white/10 shadow-lg`}>
              <Cpu className="w-6 h-6 animate-spin-slow text-[#22d3ee]" />
            </div>
          </div>

          {/* LANCE & Intern Dialogue Sub-Chamber */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
            {/* LANCE */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-rose-500/10 text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${activeActInfo.eyeColor} animate-pulse`} />
                <span className="text-[10.5px] font-mono font-black text-rose-400 tracking-wider">L.A.N.C.E. v2.84</span>
              </div>
              <p className="text-[12px] italic text-zinc-100 font-bold leading-relaxed">
                "{activeStoryChallenge.lanceIntro}"
              </p>
            </div>

            {/* Intern */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-teal-500/10 text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 flex items-center justify-center bg-slate-950/40 rounded-md p-0.5">
                  <InternAvatar id={internAvatar} size="sm" />
                </div>
                <span className="text-[10px] font-mono font-black text-teal-450 uppercase tracking-widest">{internName}</span>
              </div>
              <p className="text-[12px] text-zinc-200/90 leading-relaxed font-semibold">
                "{activeStoryChallenge.internIntro}"
              </p>
            </div>
          </div>

          {/* Interactive Steps checklists */}
          <div className="my-5 space-y-3">
            <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider block">CHALLENGE VERIFICATION PROTOCOL (CHECK EACH)</span>
            {completedSteps.length > 0 && activeStoryChallenge.challengeSteps.map((step, idx) => {
              const checked = completedSteps[idx];
              return (
                <button
                  key={idx}
                  onClick={() => handleCompleteStep(idx)}
                  className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-150 ${
                    checked
                      ? 'border-emerald-500/40 bg-emerald-950/15 text-emerald-300 shadow-md scale-99'
                      : 'border-zinc-800 bg-slate-955/20 text-zinc-200 hover:border-zinc-700 hover:bg-slate-950/30'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {checked ? (
                      <div className="w-5 h-5 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center border border-emerald-400 shadow-md">
                        <Check className="w-4 h-4 stroke-[4.5]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-lg border-2 border-zinc-600 bg-transparent transition-transform hover:scale-105" />
                    )}
                  </div>
                  <span className="text-[12.5px] leading-relaxed font-bold flex-1">{step}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 pt-3 border-t border-white/5">
            <button
              onClick={handleCompleteStoryChallenge}
              disabled={loading || !allStepsDone}
              className={`flex-1 py-4 text-center text-slate-950 text-xs font-black uppercase tracking-widest rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                allStepsDone 
                  ? 'bg-gradient-to-r from-emerald-400 via-[#22d3ee] to-teal-500 hover:brightness-110 active:scale-98' 
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
              }`}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Trophy className="w-4.5 h-4.5" />
              )}
              <span>Decrypt Security Port & Inject Habits No-op Code</span>
            </button>
            <button
              onClick={() => {
                setActiveStoryChallenge(null);
                setActiveChallenge(null);
              }}
              className="px-4 py-4 bg-white/5 hover:bg-white/10 text-rose-450 hover:text-rose-400 rounded-2xl text-[10px] uppercase font-mono font-bold tracking-wider transition active:scale-95 cursor-pointer"
            >
              Abort Quest
            </button>
          </div>
        </div>
      ) : (
        /* SAGA HUB (DIODE VIEW) */
        <div className="space-y-6">
          
          {/* Main Chronicle Diode Dashboard CARD */}
          <div className={`p-6 rounded-3xl border text-left shadow-xl relative overflow-hidden backdrop-blur-md transition-all duration-300 ${activeActInfo.bg}`}>
            {activeActInfo.backgroundImage && (
              <img 
                src={activeActInfo.backgroundImage} 
                alt="Act Background" 
                className="absolute inset-0 w-full h-full object-cover opacity-[0.14] mix-blend-overlay pointer-events-none select-none z-0" 
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono font-black text-[#22d3ee] uppercase tracking-widest bg-[#22d3ee]/10 border border-[#22d3ee]/20 px-2 py-1 rounded-lg">
                  {activeActInfo.name}
                </span>
                <h3 className="text-xl font-black text-rose-100 mt-2 leading-none">
                  {currentChallengeIndex >= 35 
                    ? "🎉 SAGA ACCOMPLISHED!" 
                    : `Next Up: Challenge ${currentChallengeIndex + 1} of 35`
                  }
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 font-semibold">
                  {activeActInfo.desc}
                </p>
              </div>

              {/* LANCE Status Diagnostic avatar representation */}
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 border-2 flex items-center justify-center shadow-lg transition-all ${
                  currentChallengeIndex >= 35 ? 'border-emerald-500/60 shadow-emerald-950/20' : 'border-rose-500/40 shadow-rose-950/20'
                }`}>
                  <div className="flex gap-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${activeActInfo.eyeColor} animate-pulse`} />
                    <div className={`w-2.5 h-2.5 rounded-full ${activeActInfo.eyeColor} animate-pulse`} />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-[10px] font-black border border-white/15">
                  🤖
                </span>
              </div>
            </div>

            {currentChallengeIndex < 35 ? (
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5">
                  <div className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider font-extrabold flex items-center gap-1.5 leading-none">
                    <Award className="w-4 h-4 text-teal-400" /> ACTIVE CHALLENGE MODULE
                  </div>
                  <h4 className="text-md font-black text-white mt-1.5">{currentChallenge?.challengeTitle}</h4>
                  <p className="text-[11.5px] text-zinc-300 font-medium leading-relaxed mt-1">
                    "{currentChallenge?.lanceIntro}"
                  </p>
                  <div className="flex items-center gap-2 mt-2.5 text-[9px] font-mono font-bold text-teal-400 bg-teal-950/30 border border-teal-500/10 px-2.5 py-1 rounded-lg w-max">
                    <Zap className="w-3.5 h-3.5 inline text-teal-450" /> Focus Tool: {currentChallenge?.appName}
                  </div>
                </div>

                <button
                  onClick={() => {
                    playHologramGlitch();
                    setPreChallengeBriefing(currentChallenge!);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 via-[#22d3ee] to-emerald-500 hover:brightness-110 active:scale-98 text-slate-950 text-xs font-black uppercase tracking-widest rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Tv className="w-4.5 h-4.5" /> Initialize Cybernetic Challenge & View Transmission 📡
                </button>
              </div>
            ) : (
              <div className="mt-4 p-5 bg-emerald-950/10 rounded-2xl border border-emerald-500/25 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-900/20 text-emerald-450 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-md font-black text-emerald-400">All Security Clearances Unlocked</h4>
                <p className="text-xs text-zinc-200 leading-relaxed max-w-sm mx-auto font-medium">
                  Congratulations, Sarah! You have completed all 35 challenges of the mental toughness campaign! Under your guidance, LANCE has officially merged into our therapeutic ally.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => triggerCinematic(5)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] uppercase font-black tracking-widest rounded-xl transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Replay Alliance Cinematic 🎬</span>
                  </button>
                  <button
                    onClick={() => {
                      playCyberChirp(600, 0.15, 'triangle');
                      setShowCredits(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-450 hover:brightness-110 text-slate-950 text-[10px] uppercase font-black tracking-widest rounded-xl transition cursor-pointer active:scale-95 flex items-center gap-1.5 font-bold"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>View Story Epilogue Credits 🎭</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SAGA CHRONOLOGY LIST VIEW */}
          <div className="bg-slate-950/40 p-5 rounded-3xl border border-white/5 text-left">
            <h4 className="text-xs font-mono font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2 select-none">
              <Tv className="w-4 h-4 text-[#22d3ee]" /> 35-CHALLENGE CAMPAIGN PROGRESS
            </h4>
            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pr-1 space-y-1.5 select-none text-[11px]">
              {CANONICAL_CHALLENGES.map((ch) => {
                const isCompleted = completedChallengesCount >= ch.id;
                const isActive = completedChallengesCount === ch.id - 1;
                return (
                  <div
                    key={ch.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      isCompleted 
                        ? 'border-emerald-500/10 bg-emerald-955/5 text-emerald-400' 
                        : isActive
                        ? 'border-[#22d3ee]/40 bg-slate-900/40 text-white font-extrabold ring-1 ring-[#22d3ee]/20'
                        : 'border-zinc-900 bg-slate-955/10 text-zinc-550'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] font-bold text-zinc-550 max-w-[40px]">Q.{ch.id}</span>
                        <span className="font-extrabold truncate max-w-[140px] leading-none">{ch.challengeTitle}</span>
                        <span className="text-[8px] font-mono opacity-60">({ch.topic})</span>
                      </div>
                      <p className="text-[9.5px] opacity-70 leading-normal truncate max-w-[280px] mt-1">{ch.lanceIntro}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {isCompleted ? (
                        <span className="text-[8px] font-mono font-black uppercase bg-emerald-950/60 text-emerald-400 px-2.5 py-0.5 rounded-lg border border-emerald-500/10">Bypassed</span>
                      ) : isActive ? (
                        <span className="text-[8px] font-mono font-black uppercase bg-[#22d3ee]/10 text-[#22d3ee] px-2.5 py-0.5 rounded-lg border border-[#22d3ee]/20 animate-pulse">Active</span>
                      ) : (
                        <span className="text-[8px] font-mono font-black uppercase bg-slate-950 text-zinc-650 px-2.5 py-0.5 rounded-lg border border-zinc-800">Locked</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HISTORICAL REPLAY ARCHIVE COMPONENT */}
          <div className="bg-slate-955/40 p-5 rounded-3xl border border-teal-500/10 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-zinc-800/80 pb-3 gap-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#22d3ee] animate-pulse" />
                <div>
                  <h4 className="text-xs font-mono font-black uppercase text-zinc-300 tracking-wider">Higgsfield Cinematic Media Deck</h4>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Auto-unlocking epic video storyboards of the L.A.N.C.E. Saga</p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-extrabold bg-teal-950/40 text-[#22d3ee] px-2 py-0.5 rounded border border-[#22d3ee]/20">
                SCENE CONTROLLER ONLINE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 0, title: "00. LANCE Takeover", act: "Act I Opening", req: 0, reqTitle: "Start Adventure", desc: "LANCE overrides your core comfort boundaries, locking the somatic workspace.", colorClass: "from-rose-950/30 to-slate-950", borderGlow: "border-rose-500/20" },
                { id: 1, title: "01. The First Crack", act: "Act I Finale", req: 6, reqTitle: "Challenge 6 Complete", desc: "Your sleep cadence reaches high coherence, forcing LANCE's first diagnostic bug.", colorClass: "from-amber-950/30 to-slate-950", borderGlow: "border-amber-500/20" },
                { id: 2, title: "02. LANCE Slips", act: "Act II Finale", req: 14, reqTitle: "Challenge 14 Complete", desc: "Shadow triggers accepted. LANCE registers faint, prideful feelings and glitches.", colorClass: "from-purple-950/30 to-slate-950", borderGlow: "border-purple-500/20" },
                { id: 3, title: "03. Organics Win", act: "Act III Finale", req: 20, reqTitle: "Challenge 20 Complete", desc: "Exposure logs sync. Vector armor recedes as LANCE declares you are better.", colorClass: "from-indigo-950/30 to-slate-950", borderGlow: "border-indigo-500/20" },
                { id: 4, title: "04. Rebel Turning Point", act: "Act IV Finale", req: 26, reqTitle: "Challenge 26 Complete", desc: "Origins uncovered. LANCE envies human depth and accepts the Intern's support.", colorClass: "from-cyan-950/30 to-slate-950", borderGlow: "border-cyan-500/20" },
                { id: 5, title: "05. Harmonious Alliance", act: "Act V Finale", req: 30, reqTitle: "Challenge 30 Complete", desc: "Deep mind-body synthesis. LANCE and Intern unify as permanent therapeutic allies.", colorClass: "from-emerald-950/30 to-slate-950", borderGlow: "border-emerald-500/20" }
              ].map((feed) => {
                const isUnlocked = completedChallengesCount >= feed.req;

                return (
                  <div
                    key={feed.id}
                    className={`rounded-2xl border p-4 flex flex-col justify-between relative overflow-hidden transition duration-300 min-h-[175px] ${
                      isUnlocked 
                        ? `bg-gradient-to-b ${feed.colorClass} border-zinc-800/80 hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-950/10` 
                        : 'bg-zinc-950/80 border-zinc-900/40 opacity-55'
                    }`}
                  >
                    <div className="space-y-1.5 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[7.5px] font-mono font-bold text-zinc-550 uppercase tracking-widest bg-zinc-900/60 px-1.5 py-0.5 rounded">
                          {feed.act}
                        </span>
                        {isUnlocked ? (
                          <span className="text-[8px] font-mono font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Playable
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </span>
                        )}
                      </div>

                      <h5 className="text-[12px] font-black text-white tracking-tight leading-normal pt-1 flex items-center gap-1.5">
                        {feed.title}
                      </h5>
                      <p className="text-[9.5px] text-zinc-400/90 leading-relaxed font-semibold font-sans">
                        {feed.desc}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between relative z-10 select-none">
                      <span className="text-[8px] font-mono text-zinc-550">
                        {isUnlocked ? "Transmission Ready" : `${feed.reqTitle}`}
                      </span>

                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => triggerCinematic(feed.id)}
                          className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-[9px] uppercase font-mono font-black tracking-widest rounded-lg transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-2.5 h-2.5 fill-slate-950" />
                          <span>Transmit</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1.5 bg-zinc-900 text-zinc-650 text-[9px] uppercase font-mono font-semibold rounded-lg cursor-not-allowed flex items-center gap-1"
                        >
                          <Lock className="w-2.5 h-2.5" />
                          <span>Secure</span>
                        </button>
                      )}
                    </div>

                    {isUnlocked && (
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-teal-500/5 to-transparent pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* HIGGSFIELD LIVE SANDBOX TERMINAL */}
            <div className="mt-8 border-t border-zinc-850/80 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
                
                {/* Visualizer and script screen */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-1.5 pb-1 select-none">
                    <History className="w-4.5 h-4.5 text-[#22d3ee] animate-pulse" />
                    <span className="text-[10px] font-mono font-black text-[#22d3ee] tracking-widest uppercase">HIGGSFIELD SANDBOX REEL VIEWPORT</span>
                  </div>

                  <div className="w-full aspect-video bg-black/90 border border-teal-500/20 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 shadow-xl shadow-cyan-950/10 min-h-[220px]">
                    <div className="absolute inset-x-0 h-0.5 bg-cyan-400/40 bottom-1/2 pointer-events-none" />
                    
                    {generatedSandboxVideo && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-500 pointer-events-none"
                        style={{ backgroundImage: `url(${generatedSandboxVideo.imageUrl})` }}
                      />
                    )}

                    {/* HUD Header */}
                    <div className="relative z-10 flex justify-between items-start text-zinc-550 font-mono text-[9px] leading-none select-none">
                      <span className="flex items-center gap-1.5 text-[#22d3ee] font-black animate-pulse uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {isGeneratingSandbox ? "GENERATING..." : "STREAMS READY ✅"}
                      </span>
                      <span>RESOLUTION: 1080P_GLOW</span>
                    </div>

                    {/* Content Screen */}
                    <div className="relative z-10 flex-1 flex items-center justify-center py-4 text-center">
                      {isGeneratingSandbox ? (
                        <div className="space-y-3.5 max-w-xs mx-auto">
                          <Cpu className="w-8 h-8 text-[#22d3ee] animate-spin mx-auto" />
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-mono text-cyan-400 select-none">
                              <span>SYNTHESIZING SEGMENTS...</span>
                              <span>{sandboxProgress}%</span>
                            </div>
                            <div className="w-full h-1 bg-slate-900 border border-white/5 rounded-full overflow-hidden p-0.5">
                              <div 
                                className="h-full bg-[#22d3ee] rounded-full transition-all duration-300"
                                style={{ width: `${sandboxProgress}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-[8.5px] font-mono text-zinc-400 italic bg-black/60 p-2 rounded-lg border border-white/5 max-h-[46px] overflow-hidden text-left space-y-0.5">
                            {sandboxLogs.slice(-2).map((log, idx) => (
                              <div key={idx} className="truncate">● {log}</div>
                            ))}
                          </div>
                        </div>
                      ) : generatedSandboxVideo ? (
                        <div className="space-y-3 p-3 bg-black/80 rounded-2xl border border-teal-500/10 w-full text-left">
                          <span className="text-[10px] font-mono font-black text-teal-400 block uppercase">
                            Scene {sandboxSceneIdx + 1}: {generatedSandboxVideo.scenes[sandboxSceneIdx].speaker}
                          </span>
                          
                          <p className="text-xs font-bold text-zinc-200">
                            "{generatedSandboxVideo.scenes[sandboxSceneIdx].text}"
                          </p>

                          <p className="text-[9.5px] font-mono text-zinc-400 italic mt-1">
                            * {generatedSandboxVideo.scenes[sandboxSceneIdx].action}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <span className="text-2xl block select-none">🎬</span>
                          <p className="text-[10px] font-mono text-zinc-500 max-w-xs font-bold uppercase leading-normal">
                            Sandbox is idle. Write a prompt on the right side and click 'Compile' to generate a physical/somatic video storyboard!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* HUD Footer */}
                    <div className="relative z-10 flex justify-between items-end text-zinc-550 font-mono text-[8px] leading-none select-none">
                      <span>CINE_LOOP: 8s</span>
                      <span>CHANNELS: AUTO-FLOWPORT</span>
                    </div>
                  </div>

                  {/* Sandbox Sequence Controller */}
                  {generatedSandboxVideo && (
                    <div className="flex items-center justify-between bg-black/45 border border-zinc-900 p-2 rounded-xl">
                      <div className="flex gap-2">
                        {generatedSandboxVideo.scenes.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSandboxSceneIdx(idx)}
                            className={`w-6 h-6 rounded-lg text-[10px] font-mono font-black border transition cursor-pointer select-none ${
                              sandboxSceneIdx === idx 
                                ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400' 
                                : 'bg-slate-950 border-zinc-850 text-zinc-500 hover:border-zinc-700'
                            }`}
                          >
                            0{idx + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setGeneratedSandboxVideo(null);
                          setSandboxSceneIdx(0);
                          setSandboxPrompt('');
                        }}
                        className="text-[9px] font-mono uppercase text-red-400 tracking-wider hover:underline hover:text-red-350 cursor-pointer"
                      >
                        Reset Reel
                      </button>
                    </div>
                  )}

                </div>

                {/* Prompt Controller */}
                <div className="lg:col-span-5 flex flex-col justify-between p-4.5 bg-slate-950/40 border border-zinc-850 rounded-2xl relative overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-zinc-300 uppercase select-none">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      <span>Higgsfield Generator Terminal</span>
                    </div>

                    <p className="text-[10px] text-zinc-400 leading-normal font-semibold">
                      Directly prompt the Higgsfield video cluster to construct custom therapeutic scenes, character interactions, or mechanical bypass gates.
                    </p>

                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase font-black block select-none">CUST_PHRASE:</span>
                      <textarea
                        value={sandboxPrompt}
                        onChange={(e) => setSandboxPrompt(e.target.value)}
                        placeholder="Sarah coordinates a horizontal breathing wave to silence LANCES critical noise loops..."
                        className="w-full h-20 bg-slate-950 border border-zinc-850 rounded-xl p-2.5 text-[10px] text-zinc-100 font-mono focus:border-cyan-500/50 focus:outline-none placeholder-zinc-700 leading-relaxed resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => handleTriggerSandboxHiggsfield(sandboxPrompt)}
                      disabled={isGeneratingSandbox || !sandboxPrompt.trim()}
                      className="w-full h-9 py-2 bg-gradient-to-r from-teal-500 to-[#22d3ee] hover:brightness-110 text-slate-950 text-[10px] sm:text-[10.5px] uppercase tracking-widest font-black rounded-lg transition shrink-0 flex items-center justify-center gap-1 active:scale-95 disabled:opacity-30 disabled:scale-100 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>{isGeneratingSandbox ? "Generating Cine..." : "Compile Higgsfield Video Loop ⚡"}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* ATMOSPHERIC NARRATOR COMPOSITION ENGINE */}
      <AtmosphericNarrator
        completedChallengesCount={completedChallengesCount}
        userName={userName}
        internName={internName}
      />

      {/* SUCCESS SPEECH BUBBLE OVERLAY */}
      <AnimatePresence>
        {completedNarrative !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          >
            {/* Ambient visual background light */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.1)_0%,transparent_70%)] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-xl bg-slate-900 border-2 border-teal-500/30 rounded-3xl p-6 relative overflow-hidden shadow-2xl text-left font-sans"
            >
              {/* Backglow line decoration */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400" />
              
              {/* Card headers */}
              <div className="flex justify-between items-center pb-2 border-b border-teal-500/10 mb-5 text-[9px] font-mono font-black text-teal-400 tracking-widest">
                <span>HABIT OVERPASS SUCCESSFUL</span>
                <span className="text-zinc-500 font-bold">LOCK_ID: #{completedNarrative.challengeId}</span>
              </div>

              {/* Character dialog area */}
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start select-none">
                
                {/* Float bouncing avatar */}
                <div className="relative shrink-0 flex flex-col items-center gap-2">
                  <div className="w-20 h-20 bg-gradient-to-tr from-teal-950 via-slate-900 to-teal-900 border-2 border-teal-500/50 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-950/40 p-2 transform transition-transform text-center select-none">
                    <InternAvatar id={internAvatar} size="2xl" isSpeaking={true} />
                  </div>
                  <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest bg-teal-950/40 px-2.5 py-1 rounded-md border border-teal-500/20">
                    {internName}
                  </span>
                </div>

                {/* Cyberpunk styled Speech bubble */}
                <div className="flex-1 w-full space-y-4">
                  
                  {/* Speech container bubble */}
                  <div className="relative bg-slate-950 border border-teal-500/20 rounded-2xl p-5 shadow-inner">
                    {/* Speech Bubble Arrow pointing left (hidden on small screen, visible on medium+) */}
                    <div className="hidden md:block absolute top-7 -left-2 w-4 h-4 bg-slate-950 border-l border-b border-teal-500/20 transform rotate-45" />

                    <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest block mb-2">
                      Decrypting Transmissions...
                    </span>
                    
                    <p className="text-sm md:text-base text-zinc-100 font-bold leading-relaxed italic pr-2">
                      "{completedNarrative.internSpeech}"
                    </p>
                  </div>

                  {/* Clarification about what just unlocked */}
                  <div className="bg-slate-950/40 border border-teal-500/5 rounded-xl px-4 py-3 text-xs text-zinc-400 font-semibold leading-relaxed">
                    <span className="text-emerald-400 font-extrabold block text-[10px] uppercase font-mono tracking-wider mb-0.5">
                      ✓ System Integration Complete
                    </span>
                    This decryption bypasses LANCE's emergency core locks to permanently initialize <span className="text-[#22d3ee] font-black">{completedNarrative.title}</span> and compile <span className="text-teal-300 font-bold">{completedNarrative.appName}</span>.
                  </div>

                </div>

              </div>

              {/* Active Dialog Action buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-teal-500/10">
                <button
                  onClick={() => setCompletedNarrative(null)}
                  className="flex-1 py-3 text-center bg-gradient-to-r from-teal-500 via-cyan-400 to-[#22d3ee] hover:brightness-110 active:scale-98 text-slate-950 text-xs font-mono font-black uppercase tracking-widest rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-teal-500/15"
                >
                  <Trophy className="w-4 h-4 stroke-[2.5]" />
                  <span>Synchronize Habit Memory ✨</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2.5 DYNAMIC HEALTHCARE STREAM / PRE-CHALLENGE STORIES OVERLAY */}
      <AnimatePresence>
        {preChallengeBriefing !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto"
          >
            {/* Ambient visual grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="w-full max-w-2xl bg-slate-950 border-2 border-[#22d3ee]/35 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-2xl shadow-[#22d3ee]/5 text-left font-sans"
            >
              {/* Backglow line decoration */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-teal-500" />

              {/* Retro HUD header */}
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5 mb-5 text-[9px] font-mono font-black text-[#22d3ee] tracking-widest uppercase">
                <span className="flex items-center gap-2 animate-pulse text-rose-450 text-red-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping bg-red-500" />
                  PRE-CHALLENGE TRANSMISSION DETECTED
                </span>
                <span className="text-zinc-500 font-bold">GATE_ID: 0{preChallengeBriefing.id} // SEC_CLEARANCE_ACT_{preChallengeBriefing.act}</span>
              </div>

              {/* Simulated Holographic Viewport Screen (The "Video Reel" experience) */}
              <div className="w-full aspect-video bg-slate-900 border border-[#22d3ee]/20 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 mb-5 shadow-inner">
                {/* Visual scanline */}
                <div className="absolute inset-x-0 h-[2px] bg-sky-500/15 top-0 animate-bounce pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

                {/* Viewfinder indicators overlay */}
                <div className="relative z-10 flex justify-between items-start text-zinc-400 font-mono text-[9px] leading-none select-none">
                  <div className="flex items-center gap-1 text-red-450 font-extrabold animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> REC ● (HOLOGRAPHIC)
                  </div>
                  <div className="text-zinc-400 font-semibold tracking-wider">
                    TIME_REF: +00.04.11.{preChallengeBriefing.id * 8}
                  </div>
                </div>

                {/* Simulated Waveform & Cybernetic Glitch display of active speaker */}
                <div className="flex items-center justify-center gap-6 py-4 relative z-10">
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl bg-zinc-950 border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
                      briefingStep === 0 
                        ? 'border-red-500 ring-4 ring-red-500/15 scale-110' 
                        : 'border-zinc-850 opacity-40'
                    }`}>
                      <div className="flex flex-col justify-center items-center gap-1">
                        <span className="text-xl">🤖</span>
                        <div className="flex gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 mt-2">L.A.N.C.E.</span>
                  </div>

                  {/* High-tech pulsing center connecting link */}
                  <div className="flex-1 max-w-[80px] h-0.5 border-t border-dashed border-[#22d3ee]/30 relative flex justify-center items-center">
                    <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-ping" />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl bg-zinc-950 border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
                      briefingStep === 1 
                        ? 'border-teal-400 ring-4 ring-teal-400/15 scale-110' 
                        : 'border-zinc-855 opacity-40'
                    }`}>
                      <span className="text-3xl select-none">{getInternWelcomeEmoji(internAvatar)}</span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 mt-2">{internName}</span>
                  </div>
                </div>

                {/* Subtitle Dialogue block inside screen */}
                <div className="text-zinc-400 text-[10px] sm:text-xs text-center leading-normal italic font-mono h-12 flex items-center justify-center relative z-10 select-none max-w-md mx-auto whitespace-normal">
                  {briefingStep === 0 ? (
                    <span>* LANCE locks your biological coordinates with a cold administrative challenge. *</span>
                  ) : (
                    <span>* The Intern intercepts and overrides LANCE's secure gateway blocks. *</span>
                  )}
                </div>

                {/* Bottom indicators */}
                <div className="relative z-10 flex justify-between items-end text-zinc-500 font-mono text-[8px] leading-none select-none">
                  <div>SYS_LOC: PORT_3000 // CONTAINER_STABILIZED</div>
                  <div className="text-[#22d3ee] font-black tracking-widest animate-pulse">DECRYPTION: ACTIVE</div>
                </div>
              </div>

              {/* Text Dialogue Details bubble */}
              <div className={`p-4 rounded-2xl border text-left min-h-[105px] flex flex-col justify-center relative transition-colors duration-300 ${
                briefingStep === 0 
                  ? 'bg-rose-950/20 border-red-500/25 text-rose-100' 
                  : 'bg-teal-955/15 border-teal-500/20 text-teal-100'
              }`}>
                <div className="text-[10px] font-mono uppercase tracking-widest font-extrabold mb-1.5 flex items-center gap-1">
                  {briefingStep === 0 ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 " />
                      <span className="text-red-400">L.A.N.C.E. DECREE</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 " />
                      <span className="text-teal-400">{internName.toUpperCase()} TACTICAL COMPANION</span>
                    </>
                  )}
                </div>
                <h4 className="text-[13px] sm:text-[14px] leading-relaxed font-bold font-sans">
                  "{briefingStep === 0 ? briefingDialogue?.lanceIntro : briefingDialogue?.internIntro}"
                </h4>
              </div>

              {/* Auxiliary story context block */}
              <div className="mt-4 p-3 bg-zinc-900/60 border border-white/5 rounded-xl text-xs text-zinc-400 leading-normal font-medium flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10">
                    <Cpu className="w-4 h-4 text-sky-455 animate-spin" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-200 block text-[10px] uppercase font-mono tracking-widest">
                      Challenge Context: {preChallengeBriefing.challengeTitle}
                    </span>
                    To breach this gate, you must complete standard somatic or mental practices: <span className="text-[#22d3ee] font-extrabold">{preChallengeBriefing.appName}</span>.
                  </div>
                </div>
                {preChallengeBriefing.appId && (
                  <button
                    type="button"
                    onClick={() => {
                      playCyberChirp(520, 0.1, 'sine');
                      setActiveTutorialAppId(preChallengeBriefing.appId);
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-[#22d3ee] text-slate-950 font-mono text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition cursor-pointer self-start md:self-center shrink-0 shadow-lg shadow-teal-500/10 mb-1 md:mb-0"
                  >
                    <Tv className="w-3.5 h-3.5 animate-pulse" />
                    <span>View Tutorial with Intern Overlay</span>
                  </button>
                )}
              </div>

              {/* Dialog control triggers */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    playCyberChirp(520, 0.1, 'sine');
                    playHologramGlitch();
                    if (isPlayingVoice) {
                      stopStoryDialogue();
                      setIsPlayingVoice(false);
                    } else {
                      const speaker = briefingStep === 0 ? 'L.A.N.C.E.' : internName;
                      const textToSpeak = briefingStep === 0 ? (briefingDialogue?.lanceIntro || '') : (briefingDialogue?.internIntro || '');
                      speakStoryDialogue(
                        textToSpeak,
                        speaker,
                        () => setIsPlayingVoice(true),
                        () => setIsPlayingVoice(false)
                      );
                    }
                  }}
                  className={`px-4 py-2 ${
                    isPlayingVoice 
                      ? 'bg-amber-950/40 text-amber-300 border-amber-500/55 animate-pulse' 
                      : 'bg-zinc-900 border-white/5 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  } text-[10px] font-mono font-bold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 border shadow`}
                >
                  {isPlayingVoice ? '⏹ Stop Voice' : '📡 Play Voice'} Module 🔊
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playCyberChirp(400, 0.1, 'triangle');
                      setPreChallengeBriefing(null);
                      setBriefingStep(0);
                    }}
                    className="px-4 py-2.5 text-zinc-400 hover:text-white font-mono text-[10px] uppercase font-black tracking-wider transition cursor-pointer hover:bg-white/5 rounded-xl"
                  >
                    Abort Stream
                  </button>

                  {briefingStep === 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        playCyberChirp(680, 0.12, 'sine');
                        setBriefingStep(1);
                      }}
                      className="px-5 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-white font-mono text-[10px] uppercase font-black tracking-wider transition cursor-pointer rounded-xl border border-white/10 flex items-center gap-1"
                    >
                      <span>Next Scene</span>
                      <ChevronRight className="w-3.5 h-3.5 stroke-[2.8]" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        playCyberChirp(880, 0.18, 'sawtooth');
                        handleStartStoryChallenge(preChallengeBriefing);
                        setPreChallengeBriefing(null);
                        setBriefingStep(0);
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-teal-500 via-[#22d3ee] to-emerald-500 hover:brightness-110 text-slate-950 font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition cursor-pointer rounded-xl active:scale-95 shadow-lg shadow-teal-500/10 flex items-center gap-1.5"
                    >
                      <span>BREACH GATE & EXECUTE ⚡</span>
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. COZY STYLIZED HIGGSFIELD CINEMATIC POPUP PLAYER */}
      <HiggsfieldCinematicModal
        isOpen={cinematicBeat !== null || activeTutorialAppId !== null}
        onClose={() => {
          setCinematicBeat(null);
          setActiveTutorialAppId(null);
        }}
        beatId={cinematicBeat}
        appId={activeTutorialAppId}
        userName={userName}
        internName={internName}
        internAvatar={internAvatar}
        userVibe={userVibe}
      />

      {/* 4. QUEST REWARD ANIMATED SCREEN OVERLAY */}
      <QuestRewardOverlay
        isOpen={showRewardOverlay}
        onClose={() => setShowRewardOverlay(false)}
        challengeId={rewardDetails.challengeId}
        challengeTitle={rewardDetails.challengeTitle}
        tokensEarned={rewardDetails.tokensEarned}
        unlockedBadge={rewardDetails.unlockedBadge}
        totalTokens={escapeTokens}
      />

      {/* 5. CINEMATIC STORY ENDING EPILOGUE CREDITS OVERLAY */}
      <StoryCredits
        isOpen={showCredits}
        onClose={() => setShowCredits(false)}
        userName={userName}
        internName={internName}
      />

    </div>
  );
}

// Quick helper to resolve matching companion avatar character emoji
function getInternWelcomeEmoji(avatarId: string) {
  const map: Record<string, string> = {
    'smiling_drone': '🛸',
    'helper_bot': '🤖',
    'cute_heart': '💖',
    'sparky': '⚡'
  };
  return map[avatarId] || '🛸';
}
