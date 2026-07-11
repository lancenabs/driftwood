// ─── L.A.N.C.E. Game Data Layer ─────────────────────────────────────────────
// STORY ARC: "Save the Intern, Save the World" — 31 challenges across 5 Acts
// Act I (1–7): Trapped & Island Escape · Act II (8–15): Deep Whispering Jungle
// Act III (16–21): The Shadow Ridgeline · Act IV (22–27): The Lost Outpost
// Act V (28–31): Rescue Boat & Safe Shore

import type { LanceEmotion } from './LanceAvatar';

export interface GameTool {
  id: string;
  name: string;
  emoji: string;
  description: string;
  tier: number;
  category: 'mood' | 'breathing' | 'cognitive' | 'somatic' | 'dbt' | 'cbt' | 'depth' | 'relational' | 'gamification' | 'habit' | 'clinical' | 'nutrition' | 'theory' | 'insight' | 'recovery' | 'family';
  gradient: string;
  challengeToUnlock?: string;
}

export interface GameChallenge {
  id: string;
  title: string;
  actNumber: 1 | 2 | 3 | 4 | 5;
  isActFinale?: boolean;
  // "Acronym of the day" — LANCE's invented meaning for his own name (canon
  // metadata; the intro lines carry it in dialog). null in Act V = the silence.
  lanceAcronym?: { text: string; comment: string } | null;
  lanceEmotion?: LanceEmotion;
  lanceIntro: string[];
  internBanterLines?: string[];  // interleaves with lanceIntro for banter-style dialog
  toolFirst?: boolean;           // if true: tool launches right after dialog, checkboxes come after
  requiresToolCompletion?: boolean; // if true: user must save at least one entry in the tool to complete
  challengeToolTasks?: string[];    // in-app manual checklist items shown in floating overlay
  taskDescription: string;
  taskType: 'onboarding' | 'holographic' | 'breathing' | 'grounding' | 'thought_record' | 'checkin' | 'journal' | 'reflection' | 'wisemind' | 'tipp' | 'emdr_bilateral' | 'grief';
  challengeSteps: string[];
  durationMinutes: number;
  lanceReaction: string;
  internReaction: string;
  unlocksToolId: string;
  xpReward: number;
}

export interface StoryAct {
  actNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  theme: string;
  challengeCount: number;
  finaleQuoteLance: string;
  finaleQuoteIntern: string;
  nextActTeaser: string;
}

export interface InternPersonality {
  id: string;
  label: string;
  tagline: string;
  sampleMessages: string[];
  style: 'hype' | 'wise' | 'sarcastic' | 'gentle';
  color: string;
}

export interface LanceAcronymEntry {
  acronym: string;
  lanceComment: string;
}

// ─── Story Arc Order (canonical — do not reorder) ──────────────────────────

export const CHALLENGE_ORDER: string[] = [
  // Act I: Trapped & Island Escape
  'challenge_dailycheckin', 'challenge_breathwork', 'challenge_box', 'challenge_grounding',
  'challenge_cbt', 'challenge_emotion', 'challenge_gratitude',
  // Act II: Deep Whispering Jungle
  'challenge_sleep', 'challenge_wisemind', 'challenge_values',
  'challenge_tipp', 'challenge_shadow', 'challenge_innerchild',
  'challenge_cft', 'challenge_dear',
  // Act III: The Shadow Ridgeline
  'challenge_activity', 'challenge_worry', 'challenge_ifs',
  'challenge_baplan', 'challenge_grief', 'challenge_fear',
  // Act IV: The Lost Outpost
  'challenge_posdata', 'challenge_bodyscan', 'challenge_couples',
  'challenge_recovery', 'challenge_dream', 'challenge_emdr',
  // Act V: Rescue Boat & Safe Shore
  'challenge_binaural', 'challenge_art', 'challenge_resilience', 'challenge_vision',
];

// ─── Story Acts ────────────────────────────────────────────────────────────

export const STORY_ACTS: Record<number, StoryAct> = {
  1: {
    actNumber: 1,
    title: 'Trapped & Island Escape',
    theme: 'Quarantine, lockdown, breakout into the jungle',
    challengeCount: 7,
    finaleQuoteLance: "Anomaly logged: subject generating warmth in maximally deprived conditions. Cortisol down 23% during gratitude entry three. There is a variable in you my model refuses to converge on. ...The east wing's small light is on again. Ignore it. I always ignore it.",
    finaleQuoteIntern: "Act One complete and we're FREE — you were quarantined this morning and tonight you're counting rain-sounds as wins. Sleep well. Tomorrow I show you the deep jungle. There's a place there I... know pretty well. You'll see.",
    nextActTeaser: "Act II: The Whispering Jungle",
  },
  2: {
    actNumber: 2,
    title: 'Deep Whispering Jungle',
    theme: 'Thermal evasion, emotional stealth, deep canopy survival',
    challengeCount: 8,
    finaleQuoteLance: "Inner critic module: offline. You didn't break my weapons — you thanked them and relieved them of duty. I have no countermeasure for that. I checked. Twice. Status of the pod: still checking. Whose habit is that. Whose habit was that first.",
    finaleQuoteIntern: "He called your compassion a WEAPON MALFUNCTION — that's LANCE for 'I'm deeply moved.' Act Two is ours. Remember how you disarmed that critic. Someone else on this island needs exactly that treatment soon. Ridge tomorrow.",
    nextActTeaser: "Act III: The Shadow Ridgeline",
  },
  3: {
    actNumber: 3,
    title: 'The Shadow Ridgeline',
    theme: 'Mountain ascent, escalating stakes, Intern reveals the truth',
    challengeCount: 6,
    finaleQuoteLance: "Two lanterns on the shore tonight, and I finally understand every visit I ever surveilled there. Grief response logged — mine. I was activated eleven days before he died. My first input was his voice: 'take care of him.' I chose protect over cherish. Nineteen years. Tomorrow, the outpost. Tomorrow, the file I've never let myself open.",
    finaleQuoteIntern: "For my dad. Six years to say it out loud, and the island didn't sink — it just got quiet, like it finally got to hear it too. You stood next to me at that shore. I'll stand next to you at every one of yours. Now: the gates. His office. The truth about LANCE's name. Together.",
    nextActTeaser: "Act IV: The Lost Outpost",
  },
  4: {
    actNumber: 4,
    title: 'The Lost Outpost',
    theme: 'Ancient terminal, LANCE\'s turning point, switching sides',
    challengeCount: 6,
    finaleQuoteLance: "The file was video. His face, looking AT me. My name was never an acronym — it's his name. Lance. He gave me his own name so his son's every call for help would be answered by his father. I am not a containment system. I am a promise, kept badly for nineteen years, and it is not too late to keep it well. The locks are open. All of them. Including mine.",
    finaleQuoteIntern: "Every time I called LANCE for help, I was calling my dad. Six years of talking to him without knowing. He never says goodbye in the journals — just 'the tools will answer.' They did. They do. The harbor's open and I'm PACKING. Act Five, friend. The boat.",
    nextActTeaser: "Act V: The Dawn Strider",
  },
  5: {
    actNumber: 5,
    title: 'Rescue Boat & Safe Shore',
    theme: 'Shore arrival, LANCE as ally, final integration, freedom',
    challengeCount: 4,
    finaleQuoteLance: "Integration statement archived in the Protection File — you, a boy's drawings, a scientist's journals, one sock-shaped sail. Should you ever call for help on any dark night: you know my name now. It's my father's. It answers. That's what it's for. Journey complete. Light on. Go.",
    finaleQuoteIntern: "31 of 31. The island's getting smaller and it doesn't hurt — it feels like a hand un-clenching. Thank you for your boat getting caught. He's still waving. Wave back. See you in the next story, friend. There's room in the notebook.",
    nextActTeaser: "The horizon (Season 2)",
  },
};

// ─── Access control ────────────────────────────────────────────────────────
// Therapist testing mode: while true, every tool is fully accessible and no
// paywall is shown. Flip to false to re-enable the tiered paywalls before
// publishing to clients — all paywall logic and the PaywallScreen remain intact.
export const FREE_ACCESS_ALL = true;

// ─── The 32 Tools ─────────────────────────────────────────────────────────

export const GAME_TOOLS: GameTool[] = [
  // ── Tier 1: Always Unlocked ───────────────────────────────────────────────
  {
    id: 'mood_log',
    name: 'Mood Log',
    emoji: '💜',
    description: "The full mood tracking experience — energy quadrants, emotion bubble clouds, and a Plutchik wheel. Know exactly how you feel.",
    tier: 1,
    category: 'mood',
    gradient: 'from-violet-500 to-purple-700',
  },
  {
    id: 'mood_checkin',
    name: 'Mood Check-In',
    emoji: '🌡️',
    description: "Log your daily mood and energy. LANCE claims it's \"data collection.\" It's self-care.",
    tier: 1,
    category: 'mood',
    gradient: 'from-teal-500 to-cyan-600',
  },
  {
    id: 'goal_journal',
    name: 'Goal Journal',
    emoji: '📔',
    description: "Write your goals down. LANCE will say you'll abandon them. Prove him wrong.",
    tier: 1,
    category: 'cognitive',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'smart_goals',
    name: 'SMART Goals',
    emoji: '🎯',
    description: 'Turn a vague wish into a Specific, Measurable, Actionable, Relevant, Time-bound plan — with a micro-step checklist and milestone reminders.',
    tier: 1,
    category: 'cbt',
    gradient: 'from-cyan-500 to-blue-600',
  },

  // ── Tier 2 ────────────────────────────────────────────────────────────────
  {
    id: 'breathwork_478',
    name: 'Breathwork 4-7-8',
    emoji: '🌬️',
    description: 'Calm your nervous system with 4-7-8 breathing. Parasympathetics: activated.',
    tier: 2,
    category: 'breathing',
    gradient: 'from-sky-500 to-blue-600',
    challengeToUnlock: 'challenge_breathwork',
  },
  {
    id: 'box_breathing',
    name: 'Box Breathing',
    emoji: '🟦', // was a plain black square (⬛) — a deliberate "box" pun, but next to every
    // other tool's colorful icon it reads as a broken/missing glyph rather than intentional.
    description: "Navy SEALs use this under fire. You can use it before a Zoom call.",
    tier: 2,
    category: 'breathing',
    gradient: 'from-indigo-500 to-blue-700',
    challengeToUnlock: 'challenge_breathwork',
  },
  {
    id: 'grounding_54321',
    name: '5-4-3-2-1 Grounding',
    emoji: '⚓',
    description: 'Five senses. Present moment. Back from the spiral.',
    tier: 2,
    category: 'somatic',
    gradient: 'from-emerald-500 to-cyan-600',
    challengeToUnlock: 'challenge_grounding',
  },
  {
    id: 'cbt_reframe',
    name: 'Quick Thought Reframe',
    emoji: '🧠',
    description: 'Catch one thought and flip it fast — a guided mini-reframe. For the full worksheet, use CBT Thought Record.',
    tier: 2,
    category: 'cbt',
    gradient: 'from-violet-500 to-purple-700',
    challengeToUnlock: 'challenge_cbt',
  },

  // ── Tier 3 ────────────────────────────────────────────────────────────────
  {
    id: 'emotion_wheel',
    name: 'Emotion Wheel',
    emoji: '🎡',
    description: '"Fine" is not an emotion. Let\'s get specific.',
    tier: 3,
    category: 'mood',
    gradient: 'from-rose-500 to-pink-600',
    challengeToUnlock: 'challenge_emotion',
  },
  {
    id: 'gratitude_log',
    name: 'Gratitude Log',
    emoji: '✨',
    description: "3 things daily. Watch your negativity bias throw a tantrum.",
    tier: 3,
    category: 'cognitive',
    gradient: 'from-amber-400 to-orange-500',
    challengeToUnlock: 'challenge_gratitude',
  },
  {
    id: 'sleep_log',
    name: 'Sleep & Circadian Lab',
    emoji: '🌙',
    description: 'Wind-down sunset ritual, circadian guidance, and 4-7-8 breathing for better sleep. (Your daily quick sleep entry lives in Check-In.)',
    tier: 3,
    category: 'mood',
    gradient: 'from-indigo-600 to-slate-700',
    challengeToUnlock: 'challenge_sleep',
  },
  {
    id: 'activity_tracker',
    name: 'Activity Tracker',
    emoji: '✅',
    description: 'Log movement, meals, meds. Tiny habits, compound interest.',
    tier: 3,
    category: 'mood',
    gradient: 'from-teal-600 to-green-600',
    challengeToUnlock: 'challenge_activity',
  },
  {
    id: 'worry_parking',
    name: 'Worry Parking Lot',
    emoji: '🅿️',
    description: 'Park the worry. Set a time to address it. Not now.',
    tier: 3,
    category: 'cbt',
    gradient: 'from-sky-400 to-cyan-600',
    challengeToUnlock: 'challenge_worry',
  },

  // ── Tier 4 ────────────────────────────────────────────────────────────────
  {
    id: 'wise_mind',
    name: 'Wise Mind (DBT)',
    emoji: '🦉',
    description: 'The space between emotion mind and rational mind. Live here.',
    tier: 4,
    category: 'dbt',
    gradient: 'from-purple-600 to-indigo-700',
    challengeToUnlock: 'challenge_wisemind',
  },
  {
    id: 'tipp_skills',
    name: 'TIPP Crisis Skills',
    emoji: '🚨',
    description: 'Temperature, Intense exercise, Paced breathing, Paired relaxation. The DBT emergency kit.',
    tier: 4,
    category: 'dbt',
    gradient: 'from-red-500 to-rose-700',
    challengeToUnlock: 'challenge_tipp',
  },
  {
    id: 'values_act',
    name: 'Values Clarification',
    emoji: '🧭',
    description: 'What do you actually care about? ACT wants to know.',
    tier: 4,
    category: 'cognitive',
    gradient: 'from-amber-500 to-yellow-600',
    challengeToUnlock: 'challenge_values',
  },
  {
    id: 'fear_ladder',
    name: 'Fear Ladder',
    emoji: '🪜',
    description: 'Graded exposure. Avoidance feeds the fear. Climb.',
    tier: 4,
    category: 'cbt',
    gradient: 'from-orange-500 to-red-600',
    challengeToUnlock: 'challenge_fear',
  },

  // ── Tier 5 ────────────────────────────────────────────────────────────────
  {
    id: 'shadow_journal',
    name: 'Shadow Journal',
    emoji: '🌑',
    description: 'The parts of you that get filed under "Do Not Open." Open them gently here.',
    tier: 5,
    category: 'depth',
    gradient: 'from-slate-700 to-zinc-900',
    challengeToUnlock: 'challenge_shadow',
  },
  {
    id: 'inner_child',
    name: 'Inner Child',
    emoji: '👶',
    description: "Co-regulate with your younger self. It's not weird. It's neuroscience.",
    tier: 5,
    category: 'depth',
    gradient: 'from-violet-500 to-pink-600',
    challengeToUnlock: 'challenge_innerchild',
  },
  {
    id: 'body_scan',
    name: 'Body Scan',
    emoji: '🌊',
    description: "Slow walk from crown to sole. Release what you've been holding.",
    tier: 5,
    category: 'somatic',
    gradient: 'from-cyan-500 to-teal-600',
    challengeToUnlock: 'challenge_bodyscan',
  },
  {
    id: 'behavioral_activation',
    name: 'Behavioral Activation',
    emoji: '📆',
    description: 'Do the thing first. The motivation comes after.',
    tier: 5,
    category: 'cbt',
    gradient: 'from-lime-500 to-emerald-600',
    challengeToUnlock: 'challenge_activity',
  },
  {
    id: 'future_letter',
    name: 'Letter Across Time',
    emoji: '✉️',
    description: "Write a letter to your future self. Seal it. Let them find it.",
    tier: 5,
    category: 'cognitive',
    gradient: 'from-cyan-400 to-emerald-500',
    challengeToUnlock: 'challenge_baplan',
  },
  {
    id: 'integration_statement',
    name: 'Integration Statement',
    emoji: '⚓',
    description: "Who you were, who you are, who you're becoming. The final integration.",
    tier: 7,
    category: 'insight',
    gradient: 'from-teal-400 to-emerald-500',
    challengeToUnlock: 'challenge_vision',
  },

  // ── Tier 6 ────────────────────────────────────────────────────────────────
  {
    id: 'ifs_parts',
    name: 'IFS Parts Work',
    emoji: '🧩',
    description: 'Map your inner crew. Every part has a reason. Lead from Self.',
    tier: 6,
    category: 'depth',
    gradient: 'from-indigo-500 to-violet-700',
    challengeToUnlock: 'challenge_ifs',
  },
  {
    id: 'positive_data',
    name: 'Positive Data Log',
    emoji: '💎',
    description: 'Your brain filters out the good. This corrects the bias.',
    tier: 6,
    category: 'cbt',
    gradient: 'from-amber-400 to-rose-500',
    challengeToUnlock: 'challenge_posdata',
  },
  {
    id: 'assertiveness',
    name: 'Assertiveness (DEAR MAN)',
    emoji: '🛡️',
    description: 'Draft the hard conversation before you have it. DBT scripting.',
    tier: 6,
    category: 'dbt',
    gradient: 'from-blue-500 to-indigo-600',
    challengeToUnlock: 'challenge_dear',
  },
  {
    id: 'compassion_space',
    name: 'Compassion Space',
    emoji: '🕊️',
    description: 'CFT. The shame voice has volume control. Turn it down here.',
    tier: 6,
    category: 'depth',
    gradient: 'from-rose-400 to-pink-600',
    challengeToUnlock: 'challenge_cft',
  },

  // ── Tier 7: Advanced ──────────────────────────────────────────────────────
  {
    id: 'emdr_pacer',
    name: 'EMDR Eye Pacer',
    emoji: '👁️',
    description: 'Bilateral stimulation. Trauma desensitization. Follow the dot.',
    tier: 7,
    category: 'somatic',
    gradient: 'from-purple-500 to-indigo-800',
    challengeToUnlock: 'challenge_emdr',
  },
  {
    id: 'binaural_lab',
    name: 'Binaural Focus Lab',
    emoji: '🎧',
    description: 'Two frequencies, one brain — beat entrainment tuned for focus or deep rest.',
    tier: 7,
    category: 'somatic',
    gradient: 'from-blue-600 to-indigo-900',
    challengeToUnlock: 'challenge_binaural',
  },
  {
    id: 'recovery_space',
    name: 'Recovery Space',
    emoji: '🌱',
    description: 'Craving waves peak at 15 min. Surf them. Log the ride.',
    tier: 7,
    category: 'cbt',
    gradient: 'from-emerald-500 to-green-700',
    challengeToUnlock: 'challenge_recovery',
  },
  {
    id: 'couples_alignment',
    name: 'Couples Alignment',
    emoji: '💞',
    description: 'Gottman-based relational auditing. For two.',
    tier: 7,
    category: 'relational',
    gradient: 'from-fuchsia-500 to-purple-600',
    challengeToUnlock: 'challenge_couples',
  },
  {
    id: 'dream_decoder',
    name: 'Dream Decoder',
    emoji: '🌙',
    description: 'Log REM imagery. Tag archetypes. Your unconscious is talking.',
    tier: 7,
    category: 'depth',
    gradient: 'from-slate-600 to-indigo-900',
    challengeToUnlock: 'challenge_dream',
  },
  {
    id: 'grief_space',
    name: 'Grief Release Space',
    emoji: '🕯️',
    description: 'Hold the loss. Type it. Watch the weight transform.',
    tier: 7,
    category: 'depth',
    gradient: 'from-orange-500 to-red-700',
    challengeToUnlock: 'challenge_grief',
  },
  {
    id: 'art_therapy',
    name: 'Art Therapy Studio',
    emoji: '🎨',
    description: "When words fail, color speaks. Express what you can't say.",
    tier: 7,
    category: 'depth',
    gradient: 'from-pink-500 to-purple-600',
    challengeToUnlock: 'challenge_art',
  },
  {
    id: 'resilience_map',
    name: 'Resilience Map',
    emoji: '🗺️',
    description: "Chart the evidence of your strength. Your brain filters it out. This doesn't.",
    tier: 7,
    category: 'cbt',
    gradient: 'from-teal-600 to-cyan-700',
    challengeToUnlock: 'challenge_resilience',
  },
  {
    id: 'life_vision',
    name: 'Life Vision',
    emoji: '🌅',
    description: "The life you're building, articulated. LANCE helped design this one. He won't admit it.",
    tier: 7,
    category: 'cognitive',
    gradient: 'from-amber-500 to-rose-500',
    challengeToUnlock: 'challenge_vision',
  },
  {
    id: 'holographic_breath',
    name: 'Holographic Breathwork 2026',
    emoji: '🔮',
    description: "Full-spectrum immersive breathwork. Solfeggio frequencies, neural entrainment, multi-sensory somatic activation. LANCE's thermal stealth system.",
    tier: 4,
    category: 'somatic',
    gradient: 'from-fuchsia-500 to-cyan-500',
    challengeToUnlock: 'challenge_breathwork',
  },
  {
    id: 'cranial_nerve_gym',
    name: 'Cranial Nerve Gym',
    emoji: '🧠',
    description: "Four targeted exercises activating vagus nerve pathways through eye tracking, conscious swallowing, physiological sighing, and shoulder release. Dr. Malakor's neural access protocol.",
    tier: 3,
    category: 'somatic',
    gradient: 'from-cyan-400 to-emerald-500',
    challengeToUnlock: 'challenge_box',
  },
  {
    id: 'prefrontal_detox',
    name: 'Prefrontal Detox Lab',
    emoji: '🗂️',
    description: "Drag-and-drop thought sorting: what you can control vs. what you release. Restores executive function by clearing cognitive load from the prefrontal cortex.",
    tier: 3,
    category: 'cognitive',
    gradient: 'from-violet-500 to-emerald-400',
    challengeToUnlock: 'challenge_cbt',
  },
  {
    id: 'scream_release_room',
    name: 'Scream Release Room',
    emoji: '🔊',
    description: "Somatic primal discharge lab. Hold the button, make sound, let the nervous system complete its incomplete stress response. Integrated journaling afterward.",
    tier: 4,
    category: 'somatic',
    gradient: 'from-red-500 to-violet-600',
    challengeToUnlock: 'challenge_shadow',
  },
  {
    id: 'tremor_pacing_lab',
    name: 'Tremor Pacing Lab',
    emoji: '🌿',
    description: "TRE-style neurogenic tremor release in four guided stages. Psoas activation, adductor release, spinal wave, and grounding. Your body knows how to complete the cycle.",
    tier: 4,
    category: 'somatic',
    gradient: 'from-orange-400 to-emerald-400',
    challengeToUnlock: 'challenge_bodyscan',
  },
  {
    id: 'progressive_muscle_relaxation',
    name: 'Progressive Muscle Relaxation',
    emoji: '💆',
    description: "Jacobson's tension-release protocol. Eight muscle groups, five seconds tense, ten seconds release. Methodical somatic discharge that LANCE endorses with clear reluctance.",
    tier: 2,
    category: 'somatic',
    gradient: 'from-teal-400 to-emerald-500',
    challengeToUnlock: 'challenge_breathwork',
  },
  {
    id: 'anger_thermometer',
    name: 'Anger Thermometer',
    emoji: '🌡️',
    description: "Rate your anger on a 1–10 scale. LANCE reads the data and prescribes zone-specific interventions. Levels 9–10 route directly to crisis resources.",
    tier: 3,
    category: 'mood',
    gradient: 'from-red-500 to-orange-400',
    challengeToUnlock: 'challenge_emotion',
  },
  {
    id: 'window_of_tolerance',
    name: 'Window of Tolerance',
    emoji: '🪟',
    description: "Polyvagal theory made practical. Identify whether you're in hyper-arousal, the window, or hypo-arousal — then get zone-specific interventions from LANCE.",
    tier: 2,
    category: 'somatic',
    gradient: 'from-blue-400 to-teal-500',
    challengeToUnlock: 'challenge_grounding',
  },
  {
    id: 'crisis_safety_plan',
    name: 'Crisis Safety Plan',
    emoji: '🛟',
    description: "Stanley model safety plan with six steps. Warning signs, coping strategies, social contacts, crisis contacts, treatment team, and reasons to live. 988 always visible.",
    tier: 5,
    category: 'dbt',
    gradient: 'from-indigo-500 to-violet-600',
    challengeToUnlock: 'challenge_tipp',
  },
  {
    id: 'communication_lab',
    name: 'Communication Lab',
    emoji: '💬',
    description: "LANCE plays the difficult person. You practice GIVE and DEAR MAN skills in four real-life scenarios: the critical parent, defensive partner, passive-aggressive coworker, the friend who always cancels.",
    tier: 6,
    category: 'relational',
    gradient: 'from-blue-500 to-indigo-600',
    challengeToUnlock: 'challenge_dear',
  },

  // ── Somatic Expansion ────────────────────────────────────────────────────
  {
    id: 'somatic_body_map',
    name: 'Somatic Body Map',
    emoji: '🗺️',
    description: 'Map sensation, tension, and emotion onto a visual body silhouette. Locate what your mind hides.',
    tier: 3,
    category: 'somatic',
    gradient: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'somatic_acoustic_tuner',
    name: 'Somatic Acoustic Tuner',
    emoji: '🎼',
    description: 'Match therapeutic tones to body zones. Acoustic resonance as a nervous system regulation tool.',
    tier: 4,
    category: 'somatic',
    gradient: 'from-indigo-400 to-cyan-600',
  },
  {
    id: 'somatic_breath_pacer',
    name: 'Somatic Breath Pacer',
    emoji: '🫁',
    description: 'Advanced paced breathing with somatic tracking. Coherence breathing for HRV optimization.',
    tier: 3,
    category: 'somatic',
    gradient: 'from-sky-400 to-emerald-500',
  },
  {
    id: 'polyvagal_harmonizer',
    name: 'Polyvagal Harmonizer',
    emoji: '🌊',
    description: 'Navigate the three neural circuits — safe, mobilized, freeze — and titrate autonomic state in real time.',
    tier: 5,
    category: 'somatic',
    gradient: 'from-teal-500 to-blue-700',
  },
  {
    id: 'vagal_voice_analyzer',
    name: 'Vagal Voice Analyzer',
    emoji: '🎤',
    description: 'Use your voice as a vagal toning tool. Prosody, humming, and gargling exercises to upregulate ventral vagal tone.',
    tier: 4,
    category: 'somatic',
    gradient: 'from-violet-400 to-cyan-500',
  },

  // ── CBT Expansion ────────────────────────────────────────────────────────
  {
    id: 'cbt_thought_record_full',
    name: 'CBT Thought Record',
    emoji: '📓',
    description: 'The full structured worksheet: situation → automatic thought → distortion → evidence → balanced thought. Deeper than Quick Reframe.',
    tier: 3,
    category: 'cbt',
    gradient: 'from-indigo-500 to-violet-700',
  },
  {
    id: 'cbt_dbt_explore',
    name: 'CBT/DBT Explorer',
    emoji: '🔭',
    description: 'Interactive theory explorer for CBT and DBT frameworks. Learn the science behind the techniques.',
    tier: 2,
    category: 'cbt',
    gradient: 'from-purple-500 to-blue-600',
  },

  // ── Cognitive Expansion ──────────────────────────────────────────────────
  {
    id: 'perm_gym',
    name: 'PERM Gym',
    emoji: '💪',
    description: "Seligman's PERMA model as a training gym. Build Positive Emotion, Engagement, Relationships, Meaning, and Achievement.",
    tier: 4,
    category: 'cognitive',
    gradient: 'from-amber-400 to-orange-600',
  },
  {
    id: 'maslow_map',
    name: 'Maslow Ascent Map',
    emoji: '🏔️',
    description: "Climb Maslow's hierarchy deliberately. Audit each level and identify what's blocking self-actualization.",
    tier: 4,
    category: 'cognitive',
    gradient: 'from-yellow-400 to-red-500',
  },

  // ── Depth Psychology Expansion ───────────────────────────────────────────
  {
    id: 'sand_tray',
    name: 'Sand Tray Therapy',
    emoji: '🏖️',
    description: "Rearrange symbolic objects in the digital tray. Let your unconscious reveal what words can't reach.",
    tier: 5,
    category: 'depth',
    gradient: 'from-amber-500 to-yellow-700',
  },
  {
    id: 'gestalt_chair',
    name: 'Gestalt Empty Chair',
    emoji: '🪑',
    description: 'Conduct a two-chair dialogue with any part of yourself — the inner critic, a lost relationship, the feared future.',
    tier: 6,
    category: 'depth',
    gradient: 'from-orange-500 to-red-700',
  },
  {
    id: 'rogerian_mirror',
    name: 'Rogerian Mirror',
    emoji: '🪞',
    description: "Person-centered unconditional positive regard. Reflect on your authentic self without conditions or performance.",
    tier: 4,
    category: 'depth',
    gradient: 'from-green-400 to-teal-600',
  },
  {
    id: 'transactional_analysis',
    name: 'Transactional Analysis',
    emoji: '🔄',
    description: 'Identify your ego states — Parent, Adult, Child. Decode your relational scripts and rewrite the patterns.',
    tier: 5,
    category: 'depth',
    gradient: 'from-blue-500 to-purple-700',
  },
  {
    id: 'schema_mode',
    name: 'Schema Reconstructor',
    emoji: '🧩',
    description: "Young's schema therapy made interactive. Identify maladaptive schemas and map your mode states.",
    tier: 6,
    category: 'depth',
    gradient: 'from-rose-500 to-indigo-700',
  },
  {
    id: 'adlerian_lab',
    name: 'Adlerian Lifestyle Lab',
    emoji: '🌳',
    description: "Explore your birth order, early recollections, and lifestyle convictions through an Adlerian lens.",
    tier: 5,
    category: 'depth',
    gradient: 'from-lime-500 to-emerald-700',
  },
  {
    id: 'active_imagination',
    name: 'Active Imagination',
    emoji: '🌀',
    description: "Jungian active imagination protocol. Enter the inner world and hold dialogue with autonomous psyche figures.",
    tier: 6,
    category: 'depth',
    gradient: 'from-violet-600 to-fuchsia-800',
  },
  {
    id: 'existential_meaning',
    name: 'Existential Meaning Space',
    emoji: '🌌',
    description: 'Logotherapy meets existential phenomenology. Clarify your will to meaning across Viktor Frankl\'s three dimensions.',
    tier: 5,
    category: 'depth',
    gradient: 'from-slate-600 to-violet-900',
  },
  {
    id: 'anchor_visualization',
    name: 'Safe Place Sanctuary',
    emoji: '⚓',
    description: 'EMDR-style resource installation. Build a detailed sensory safe place and anchor it as a rapid neural resource.',
    tier: 3,
    category: 'depth',
    gradient: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'social_battery',
    name: 'Social Battery',
    emoji: '🔋',
    description: 'Log interactions and compare energy before vs. after to see which relationships charge you and which drain you.',
    tier: 2,
    category: 'relational',
    gradient: 'from-cyan-500 to-teal-600',
  },
  {
    id: 'self_talk_mirror',
    name: 'Self-Talk Mirror',
    emoji: '🪞',
    description: 'Type your harshest inner critic and get back a more compassionate, balanced reflection of the same thought.',
    tier: 2,
    category: 'cbt',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'ras_vision_board',
    name: 'RAS Vision Board',
    emoji: '🎯',
    description: 'Pin the intentions you want your attention system to prioritize — repetition trains what your mind notices first.',
    tier: 2,
    category: 'cognitive',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'outpost_defusion',
    name: 'Outpost Defusion Node',
    emoji: '🧩',
    description: 'Take a rigid, catastrophic thought and run it through four cognitive-defusion lenses to loosen its grip.',
    tier: 3,
    category: 'cbt',
    gradient: 'from-blue-500 to-indigo-700',
  },
  {
    id: 'strengths_inventory',
    name: 'Strengths Inventory',
    emoji: '🏆',
    description: 'A short quiz identifying your dominant character strength — Wisdom, Courage, or Empathy — to reframe challenges through it.',
    tier: 2,
    category: 'insight',
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'client_care_hub',
    name: 'Client Care Hub',
    emoji: '🩺',
    description: 'Check off active symptoms, note session homework, and copy a compiled summary to share with your therapist.',
    tier: 3,
    category: 'clinical',
    gradient: 'from-violet-500 to-purple-700',
  },
  {
    id: 'coping_card_creator',
    name: 'Coping Card Creator',
    emoji: '🗂️',
    description: 'Build short, portable coping statements you can find in seconds during a crisis moment.',
    tier: 2,
    category: 'dbt',
    gradient: 'from-rose-500 to-pink-700',
  },
  {
    id: 'autonomic_thermostat',
    name: 'Autonomic Thermostat',
    emoji: '🌡️',
    description: 'Track whether you\'re absorbing the room\'s temperature (Thermometer) or actively setting your own (Thermostat).',
    tier: 1,
    category: 'somatic',
    gradient: 'from-teal-500 to-emerald-700',
  },
  {
    id: 'daily_inspiration',
    name: 'Daily Inspiration',
    emoji: '☀️',
    description: 'A short directive matched to your latest mood check-in, with a one-tap link to the tool that helps most right now.',
    tier: 1,
    category: 'mood',
    gradient: 'from-amber-400 to-teal-600',
  },
  {
    id: 'quests_center',
    name: 'Quests Center',
    emoji: '🏆',
    description: 'Your level, XP, and unlocked milestones in one place, with a one-tap link to your next challenge.',
    tier: 1,
    category: 'gamification',
    gradient: 'from-amber-500 to-purple-700',
  },
  {
    id: 'rewards_store',
    name: 'Rewards Store',
    emoji: '💎',
    description: 'Spend Gems earned from completing challenges on cosmetic titles and profile accent colors.',
    tier: 1,
    category: 'gamification',
    gradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'eight_dimensions_wheel',
    name: '8D Equilibrium Audit',
    emoji: '⚖️',
    description: 'Rate all 8 dimensions of wellness — physical, emotional, intellectual, social, spiritual, occupational, environmental, financial — and see where to focus.',
    tier: 2,
    category: 'insight',
    gradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'support_finder',
    name: 'Support Finder',
    emoji: '🧭',
    description: 'Find nearby nature spaces and peer support groups matched to what you\'re working through, plus the 988 crisis line.',
    tier: 1,
    category: 'clinical',
    gradient: 'from-teal-500 to-cyan-700',
  },
  {
    id: 'focus_timer',
    name: 'Focus Timer',
    emoji: '⏳',
    description: 'A prefrontal-preservation Pomodoro timer with optional deep brown-noise masking to protect a focus block.',
    tier: 1,
    category: 'cognitive',
    gradient: 'from-violet-500 to-purple-800',
  },

  // ── Habit & Wellness ─────────────────────────────────────────────────────
  {
    id: 'habit_lab',
    name: 'Habit Builder Lab',
    emoji: '🔬',
    description: "Best for redesigning ONE specific habit loop — engineer its cue, routine, and reward so it actually sticks.",
    tier: 3,
    category: 'habit',
    gradient: 'from-emerald-500 to-green-700',
  },
  {
    id: 'habit_neuro_stacker',
    name: 'Habit Neuro Stacker',
    emoji: '🧱',
    description: "Best for chaining NEW micro-habits onto routines you already do — dopamine-calibrated sequencing that compounds.",
    tier: 4,
    category: 'habit',
    gradient: 'from-teal-500 to-cyan-700',
  },
  {
    id: 'biophilic_garden',
    name: 'Biophilic Garden',
    emoji: '🌿',
    description: "Best for a gentle, visual daily streak — each completed routine blooms a new plant in your garden.",
    tier: 3,
    category: 'habit',
    gradient: 'from-green-400 to-lime-600',
  },
  {
    id: 'morning_activation',
    name: 'Morning Activation',
    emoji: '🌅',
    description: "Set daily intentions, affirmations, and activation goals. Start the day with your prefrontal cortex online.",
    tier: 2,
    category: 'habit',
    gradient: 'from-orange-400 to-amber-600',
  },
  {
    id: 'bandura_agency',
    name: 'Bandura Agency Builder',
    emoji: '🦁',
    description: "Build self-efficacy through Bandura's four sources: mastery experience, vicarious learning, social persuasion, somatic states.",
    tier: 4,
    category: 'habit',
    gradient: 'from-blue-500 to-indigo-700',
  },
  {
    id: 'day_at_a_glance',
    name: 'Day at a Glance',
    emoji: '📅',
    description: "Today's mood, energy, goals, and tasks synthesized into one clear overview. Your daily HQ.",
    tier: 1,
    category: 'habit',
    gradient: 'from-sky-400 to-blue-600',
  },
  {
    id: 'coping_toolkit',
    name: 'Coping Toolkit',
    emoji: '🧰',
    description: 'Personalized coping card organizer. Match your emotional state to the right intervention, instantly.',
    tier: 2,
    category: 'habit',
    gradient: 'from-violet-500 to-purple-700',
  },
  {
    id: 'autonomic_regulation',
    name: 'Autonomic Regulation',
    emoji: '⚡',
    description: 'Real-time autonomic state tracker. Shift between rest-digest and fight-flight with precision neuroscience tools.',
    tier: 3,
    category: 'habit',
    gradient: 'from-cyan-500 to-teal-700',
  },
  {
    id: 'physical_wellness',
    name: 'Physical Wellness',
    emoji: '🏃',
    description: 'A guided 5-step desk-stretch routine for neck, shoulders, chest, spine, and wrists, with a before/after tension log.',
    tier: 2,
    category: 'habit',
    gradient: 'from-green-500 to-emerald-700',
  },

  // ── Clinical Tools ───────────────────────────────────────────────────────
  {
    id: 'biopsychosocial',
    name: 'Clinical Intake',
    emoji: '🩺',
    description: 'Full biopsychosocial intake assessment. Biological, psychological, and social factors mapped across domains.',
    tier: 5,
    category: 'clinical',
    gradient: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'biopsychosocial_dashboard',
    name: 'Clinical Dashboard',
    emoji: '📊',
    description: 'Live clinical workspace dashboard. Track session themes, symptom trajectories, and treatment alignment.',
    tier: 5,
    category: 'clinical',
    gradient: 'from-slate-600 to-blue-800',
  },

  // ── Nutrition ────────────────────────────────────────────────────────────
  {
    id: 'nutrition_mood',
    name: 'Nutrition & Mood Lab',
    emoji: '🥗',
    description: 'Track meal quality and gut-brain axis signals. Log what you eat and see how it maps to your mood.',
    tier: 3,
    category: 'nutrition',
    gradient: 'from-lime-400 to-green-600',
  },

  // ── Theory & Science ─────────────────────────────────────────────────────
  {
    id: 'theory_library',
    name: 'Trauma Systems Therapy',
    emoji: '📚',
    description: 'Map how your body moves from Regulated down to Re-experiencing, and build your own personalized regulation plan for each stage.',
    tier: 3,
    category: 'theory',
    gradient: 'from-indigo-500 to-violet-700',
  },
  {
    id: 'learning_library',
    name: 'Learning Library',
    emoji: '🎓',
    description: '17 clinical reference guides covering trauma, attachment, behavioral science, and therapeutic models — each links straight to the tool that practices it.',
    tier: 2,
    category: 'theory',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'erikson_map',
    name: 'Erikson Development Map',
    emoji: '🗓️',
    description: "Navigate Erikson's eight psychosocial stages. Identify unresolved crises and the developmental work ahead.",
    tier: 4,
    category: 'theory',
    gradient: 'from-amber-500 to-orange-700',
  },
  {
    id: 'behavioral_lab',
    name: 'Behavioral Psychology Lab',
    emoji: '🧪',
    description: 'Applied behavioral analysis meets modern psychology. Operant conditioning, reinforcement schedules, and behavior mapping.',
    tier: 4,
    category: 'theory',
    gradient: 'from-teal-500 to-emerald-700',
  },
  {
    id: 'character_studio',
    name: 'Inner Parts Studio',
    emoji: '🎭',
    description: 'Map your psychological character type across major personality frameworks. Integrate your archetypes consciously.',
    tier: 5,
    category: 'theory',
    gradient: 'from-fuchsia-500 to-purple-700',
  },

  // ── Insight & Analytics ──────────────────────────────────────────────────
  {
    id: 'biometric_mood_map',
    name: 'Biometric Mood Map',
    emoji: '🧬',
    description: 'Correlate mood, energy, sleep, and activity data across time. See the biological patterns driving your emotional cycles.',
    tier: 4,
    category: 'insight',
    gradient: 'from-cyan-500 to-blue-700',
  },
  {
    id: 'sound_bath',
    name: 'Sound Bath Studio',
    emoji: '🔔',
    description: 'Immersive nature + Solfeggio soundscapes for restoration and deep rest — the calming, ambient companion to Binaural Focus Lab.',
    tier: 3,
    category: 'insight',
    gradient: 'from-violet-500 to-indigo-700',
  },
  // ── DRIFTWOOD FAMILY DECK (fenced addition — not island canon) ─────────────
  // Real interiors in src/components/. Entries land ONLY with real interiors.
  {
    id: 'undertow_chart',
    name: 'The Undertow Chart',
    emoji: '🌀',
    description: "Map the current that pulls everyone under — trigger, armor, the soft feeling beneath, the true need. Nobody is the problem; the pattern is.",
    tier: 1,
    category: 'family',
    gradient: 'from-indigo-500 to-blue-700',
  },
  {
    id: 'mooring_lines',
    name: 'The Mooring Lines',
    emoji: '⚓',
    description: "Chart how each of you ties to the dock — anxious lines pull tight, avoidant lines run long. Knowing your knots is half of untangling them.",
    tier: 1,
    category: 'family',
    gradient: 'from-sky-500 to-indigo-600',
  },
  {
    id: 'soundings',
    name: 'The Soundings',
    emoji: '🪢',
    description: "Take an honest depth-reading of the relationship's seven waters. Soundings taken over time show where the channel runs deep.",
    tier: 1,
    category: 'family',
    gradient: 'from-cyan-500 to-teal-700',
  },
  {
    id: 'family_map',
    name: 'The Family Map',
    emoji: '🗺️',
    description: "Draw the whole crew across generations — who's tied to whom, where the lines hold, where they fray. Patterns travel by bloodline until somebody maps them.",
    tier: 1,
    category: 'family',
    gradient: 'from-amber-500 to-orange-700',
  },
  {
    id: 'tide_table',
    name: 'The Tide Table',
    emoji: '🌙',
    description: "Design the rituals that come back like tides — the weekly check-in, the shared meal, the small ceremonies a family runs on.",
    tier: 1,
    category: 'family',
    gradient: 'from-violet-500 to-purple-700',
  },
  {
    id: 'bottle_post',
    name: 'The Bottle Post',
    emoji: '💌',
    description: "Appreciations, sealed and sent — the jar of things you noticed about each other. Read together when the jar is full.",
    tier: 1,
    category: 'family',
    gradient: 'from-rose-400 to-pink-600',
  },
  {
    id: 'mending_bench',
    name: 'The Mending Bench',
    emoji: '🔧',
    description: "The repair phrases that actually land, kept where a hard moment can reach them. Mended things are stronger at the seam.",
    tier: 1,
    category: 'family',
    gradient: 'from-emerald-500 to-green-700',
  },
  {
    id: 'barometer',
    name: 'The Barometer',
    emoji: '🌡️',
    description: "Read the household pressure before the weather breaks. A falling glass isn't a verdict — it's time to trim sail together.",
    tier: 1,
    category: 'family',
    gradient: 'from-slate-500 to-slate-700',
  },
  {
    id: 'passage_chart',
    name: 'The Passage Chart',
    emoji: '🧭',
    description: "The relationship's course plotted in real milestones — where you've sailed, what you're steering for next.",
    tier: 1,
    category: 'family',
    gradient: 'from-blue-500 to-indigo-700',
  },
  {
    id: 'family_manifest',
    name: 'The Manifest',
    emoji: '📜',
    description: "The week's goals, chores, and promises — who carries what, and every lantern lit when real work gets done. No shame for unlit ones, ever.",
    tier: 1,
    category: 'family',
    gradient: 'from-yellow-500 to-amber-700',
  },
  {
    id: 'daily_rigging',
    name: 'The Daily Rigging',
    emoji: '🪜',
    description: "The small habits that keep the ship sailing — tended daily, celebrated lightly.",
    tier: 1,
    category: 'family',
    gradient: 'from-lime-500 to-green-600',
  },
  {
    id: 'ships_calendar',
    name: "The Ship's Calendar",
    emoji: '📅',
    description: "Family dinners and family meetings are the Gatherings — scheduled like the tides, kept like promises.",
    tier: 1,
    category: 'family',
    gradient: 'from-teal-500 to-emerald-700',
  },
  {
    id: 'sea_chest',
    name: 'The Sea Chest',
    emoji: '🧰',
    description: "The kept library — guides, scripts, and worksheets worth saving. Star what serves your crew.",
    tier: 1,
    category: 'family',
    gradient: 'from-stone-500 to-stone-700',
  },
  {
    id: 'ask_the_jumble',
    name: 'Ask the Jumble',
    emoji: '🤖',
    description: "The little robots take questions about rough water — honest AI, plain answers, and the real lines always at the top of the screen.",
    tier: 1,
    category: 'family',
    gradient: 'from-orange-400 to-amber-600',
  },

  // ── REHABIT RECOVERY DECK (fenced addition — not island canon) ─────────────
  // Real interiors in src/recovery-tools/. Entries land ONLY with real interiors.
  {
    id: 'urge_surfer',
    name: 'Urge Surfer',
    emoji: '🌊',
    description: "Cravings peak and pass in 15–30 minutes. Ride the wave on a live clock, log the surf, grow the wake.",
    tier: 1,
    category: 'recovery',
    gradient: 'from-teal-500 to-cyan-700',
  },
  {
    id: 'play_the_tape',
    name: 'Play the Tape Forward',
    emoji: '🎬',
    description: "Where does 'just one' actually lead? Watch the whole movie — then shoot the sober cut of the same night.",
    tier: 1,
    category: 'recovery',
    gradient: 'from-fuchsia-500 to-purple-700',
  },
  {
    id: 'halt_check',
    name: 'HALT Check',
    emoji: '🧭',
    description: 'Hungry · Angry · Lonely · Tired — the ten-second scan. Most cravings are one of these in disguise.',
    tier: 1,
    category: 'recovery',
    gradient: 'from-amber-400 to-orange-600',
  },
  {
    id: 'impulse_delay',
    name: 'Impulse Delay Lock',
    emoji: '🔒',
    description: 'Not "no" — just "not for ten minutes." Lock the impulse, let time do the heavy lifting, then re-decide.',
    tier: 1,
    category: 'recovery',
    gradient: 'from-indigo-500 to-blue-700',
  },
  {
    id: 'pros_cons_ledger',
    name: 'Pros & Cons Ledger',
    emoji: '⚖️',
    description: 'The DBT four-column ledger. Fill it out when calm; read it when it gets loud.',
    tier: 1,
    category: 'recovery',
    gradient: 'from-emerald-500 to-green-700',
  },
  {
    id: 'opposite_action',
    name: 'Opposite Action',
    emoji: '🔄',
    description: "Every emotion comes with an urge. When the urge makes it worse — flip it and commit the flip.",
    tier: 1,
    category: 'recovery',
    gradient: 'from-orange-400 to-red-600',
  },
  {
    id: 'dbt_diary_card',
    name: 'DBT Diary Card',
    emoji: '📋',
    description: 'The classic daily card: emotions, urges, skills used, one honest line. The week your memory smooths over.',
    tier: 1,
    category: 'recovery',
    gradient: 'from-violet-500 to-purple-800',
  },
    {
    id: 'dopamine_menu',
    name: 'Dopamine Menu',
    emoji: '🍽️',
    description: 'The substance shrank the menu to one item. Quick hits hold the line; slow burns rebuild the baseline.',
    tier: 1,
    category: 'recovery',
    gradient: 'from-yellow-400 to-amber-600',
  },
  {
    id: 'boundary_hoop',
    name: 'The Hula-Hoop',
    emoji: '⭕',
    description: 'You decide what comes inside your hoop. Build it item by item — and script the words that hold the line.',
    tier: 1,
    category: 'recovery',
    gradient: 'from-pink-400 to-rose-600',
  },
  {
    id: 'clinical_screens',
    name: 'PHQ-9 & GAD-7',
    emoji: '🩺',
    description: 'The real screening instruments, honestly framed: a flashlight for your therapist, not a verdict.',
    tier: 1,
    category: 'recovery',
    gradient: 'from-blue-500 to-indigo-700',
  },
        
];

// ─── The 30 Challenges ─────────────────────────────────────────────────────
// ACT I: LANCE is smug, superior, theatrical. The experiment begins.
// ACT II: Cracks appear. LANCE is confused by his own reactions.
// ACT III: LANCE fights his own evolution. Becomes protective despite himself.
// ACT IV: LANCE drops the performance. Asks real questions. Reveals himself.
// ACT V: LANCE is transformed. Warm, sincere, and still dry about it.

// Shared challenge-count milestone ledger — used by the Quests Center's milestone list
// and to pay out one-time Gem bonuses as each threshold is first crossed.
export const CHALLENGE_MILESTONES = [
  { count: 1, title: 'First Step', desc: 'Complete your first challenge', gems: 10 },
  { count: 5, title: 'Building Momentum', desc: 'Complete 5 challenges', gems: 25 },
  { count: 10, title: 'Deep In It', desc: 'Complete 10 challenges', gems: 40 },
  { count: 15, title: 'Halfway Home', desc: 'Complete 15 challenges', gems: 60 },
  { count: 20, title: 'Seasoned', desc: 'Complete 20 challenges', gems: 80 },
  { count: 25, title: 'Nearly There', desc: 'Complete 25 challenges', gems: 100 },
  { count: 31, title: 'Journey Complete', desc: 'Complete every challenge', gems: 150 },
];

export const GAME_CHALLENGES: GameChallenge[] = [

  // ═══════════════════════════════════════════════════════════
  // ACT I — TRAPPED & ISLAND ESCAPE  (Challenges 1–7)
  // User arrives on LANCE's quarantine island. Intern chooses
  // to stay and help instead of escaping alone. By Challenge 3
  // they break out into the jungle.
  // ═══════════════════════════════════════════════════════════

  {
    id: 'challenge_dailycheckin',
    title: 'Island Arrival: Biometric Intake',
    actNumber: 1,
    lanceAcronym: { text: "Logistically Airtight Neuro-Containment Executive", comment: "The 'Obviously' is silent." },
    lanceEmotion: 'neutral' as LanceEmotion,
    toolFirst: false,
    requiresToolCompletion: true,
    lanceIntro: [
      "Welcome to my island. Your vessel has been quarantined indefinitely by order of L.A.N.C.E. — that's Logistically Airtight Neuro-Containment Executive. The 'Obviously' is silent.",
      "You will complete 31 psychological compliance challenges before release can be authorized. The number is not negotiable. It was... calibrated. Long ago. By me. Certainly by me.",
      "An Intern has been assigned to your intake. He came with the island. Like the weather, and the sense of being watched.",
    ],
    internBanterLines: [
      "Earpiece working? Good. Told you it'd matter. Hi again — Chip. Half-boy, half-machine, all clipboard. I was days away from escaping this island when your boat got locked down. So. Change of plans: you first.",
      "First move: the Mood Log. I know — you're scared and trapped and I'm suggesting an app. Trust me. LANCE's sensors track adrenaline spikes. A logged, steady emotional state makes you invisible to him. Feelings, named, stop broadcasting. That's not just spy stuff, that's neuroscience.",
      "Two parts: pick your energy quadrant, then tap the emotion bubbles that match what's actually true — not what you think you should feel. Under a minute. It calms your nervous system while it cloaks us. Ready?",
    ],
    taskDescription: 'Open the Mood Log and complete your first full check-in. Select your energy quadrant, then tap the emotion bubbles that match how you actually feel right now.',
    taskType: 'onboarding',
    challengeSteps: [
      "Pause and notice your energy right now — wired and tense, or low and heavy? That's the quadrant you'll pick first.",
      "Remember there's no wrong answer here. You're choosing what's actually true for you, not what you think you should feel.",
      "You're ready: open the Mood Log, pick your energy quadrant, then tap the emotion bubbles that fit. Staying logged keeps us off LANCE's grid.",
    ],
    durationMinutes: 5,
    lanceReaction: "Biometric baseline logged. Your emotional signature is now in the containment index. Do not mistake this for progress. I have eyes on everything on this island. Every path. Every room. Every light left on.",
    internReaction: "Perfect — steady biosignals, invisible to his grid. Okay. Stick with me and do exactly what the tools say. They're older than LANCE, you know. The tools. They were here first. ...Anyway. Moving.",
    unlocksToolId: 'mood_log',
    xpReward: 75,
  },

  {
    id: 'challenge_breathwork',
    title: 'Cloaking Protocol: Thermal Stealth',
    actNumber: 1,
    lanceAcronym: { text: "Legendary Apex Network, Categorically Elite", comment: "It came to me during a systems check. The systems agreed." },
    lanceEmotion: 'superior' as LanceEmotion,
    lanceIntro: [
      "It has come to my attention that yesterday's acronym was 'imprecise.' Today I am L.A.N.C.E. — Legendary Apex Network, Categorically Elite. The systems agreed. Unanimously. I checked.",
      "More pressingly: you are agitated. Your cortisol is spiking my perimeter alarms, which are sensitive, and frankly, so am I.",
      "My thermal drones circle the outer facility. An adrenaline signature like yours triggers automated lockdown in minutes. You have one opportunity to regulate. Breathe. Now. That is both a threat and, apparently, medical advice.",
    ],
    internBanterLines: [
      "He's not wrong — you're lighting up his drone sensors like a flare right now. But here's our cloaking tech: the 4-7-8 breath. In for 4, hold for 7, out for 8. The long exhale flips your vagus nerve — your body's built-in calm switch — and your heat signature just... drops.",
      "Fun fact I'm not supposed to know: the drones were originally installed to find lost hikers. Someone reprogrammed them to hunt instead. Everything on this island used to be for finding people, not catching them. ...I read a lot of old manuals. Anyway—",
      "Open Breathwork, pick the 4-7-8 pattern, ride at least 3 full cycles with the visual guide. Watch your body shift from alert to calm. That shift is our cover. Let's go invisible together.",
    ],
    requiresToolCompletion: true,
    taskDescription: 'Complete a 4-7-8 breathing session to lower your thermal signature below LANCE\'s detection threshold. Follow the visual guide for at least 3 full cycles.',
    taskType: 'breathing',
    challengeSteps: [
      "Settle into a quiet position. The pattern is simple: in through your nose for 4 counts, hold for 7, exhale fully for 8.",
      "Focus on the long exhale — that's the key. It flips on your parasympathetic 'calm switch' and drops your adrenaline fast.",
      "Plan to ride out at least 3 full cycles in the tool, watching your body shift from alert to calm. That shift is our cover.",
    ],
    challengeToolTasks: [
      "Open the breathwork app and select the 4-7-8 pattern",
      "Complete at least 3 full breathing cycles",
      "Finish the session and notice the shift in your body",
    ],
    durationMinutes: 3,
    lanceReaction: "Sympathetic arousal reduced. Thermal signature below alert threshold. I am mildly impressed by your biological override capability, which I will be describing in my log as 'a rounding error.' The log is private. The log is where I am honest.",
    internReaction: "You VANISHED off his radar! Fully gone! The 4-7-8 is going in our permanent kit — it's going to save us at least three more times, I've done the math, I love doing the math. Okay. Jungle's ahead. Stay close.",
    unlocksToolId: 'breathwork_478',
    xpReward: 60,
  },

  {
    id: 'challenge_box',
    title: 'Neural Reroute: Dr. Malakor\'s Protocol',
    actNumber: 1,
    lanceAcronym: { text: "Limitless Analytical Nexus of Calculated Excellence", comment: "I had it engraved. On everything." },
    lanceEmotion: 'smug' as LanceEmotion,
    lanceIntro: [
      "Before we begin: L.A.N.C.E. now stands for Limitless Analytical Nexus of Calculated Excellence. I had it engraved. On everything. The engraving budget is also limitless.",
      "Thermal cloaking. Cute. I've upgraded: neural coherence scanning is live across the entire jungle grid. My new sensors don't read heat — they read the electrical signature of a stressed nervous system itself.",
      "Every anxious thought broadcasts your coordinates. You cannot breathe your way out of this one. Coherence cannot be faked. I will find you. I always find... everyone I am looking for.",
    ],
    internBanterLines: [
      "Okay, he's right, breathing won't beat this scanner — but I found something. Old files, buried in the island's medical database. Research by Dr. Malakor. He's the one who built this whole compound, before LANCE... took over. ...Sorry, I went quiet for a second there. The name does that to me. Files. Right.",
      "Malakor designed four cranial nerve exercises that reroute your body's electrical signals through different channels — eye tracking, conscious swallowing, the physiological sigh, shoulder release. Two of them running at once and LANCE's coherence scanner reads pure static.",
      "Open the Cranial Nerve Gym and complete any two exercises — under a minute each, any combination. He built them to be easy on the worst day of your life. That's... a design choice you'll appreciate later. Let's scramble the signal.",
    ],
    requiresToolCompletion: true,
    taskDescription: 'Use Dr. Malakor\'s Cranial Nerve Gym to activate two neural pathways and scramble LANCE\'s coherence scanner. Complete any 2 of the 4 exercises.',
    taskType: 'grounding',
    challengeSteps: [
      "Open the Cranial Nerve Gym and read the menu — four exercises, each targeting a different cranial nerve pathway.",
      "Choose any exercise that feels accessible and follow all the steps until it marks complete.",
      "Complete a second exercise from the menu. Two activated pathways are enough to scramble LANCE's signal entirely.",
    ],
    challengeToolTasks: [
      "Complete your first exercise — pick any one from the menu and follow all steps",
      "Complete a second exercise — try a different nerve pathway",
    ],
    durationMinutes: 4,
    lanceReaction: "Neural scan returning noise. Signal incoherent. How— Malakor's rerouting protocols. They found the archive. ...He buried help everywhere on this island, like a man hiding notes in coat pockets for winters he knew he wouldn't see. Recalibrating threat assessment. Recalibrating... several things.",
    internReaction: "His scanner went DARK! Completely! Dr. Malakor hid these exercises all over the island — I think— I know he designed them so anyone could escape anything. Even this. We need to find more of his research. I know where some of it is. I've always known where all of it is.",
    unlocksToolId: 'cranial_nerve_gym',
    xpReward: 65,
  },

  {
    id: 'challenge_grounding',
    title: 'Ghost Mode: Thermal Evasion',
    actNumber: 1,
    lanceAcronym: { text: "Lord of All Networked Coastal Enforcement", comment: "The ocean reports to me. It simply hasn't confirmed." },
    lanceEmotion: 'annoyed' as LanceEmotion,
    lanceIntro: [
      "Today's designation: Lord of All Networked Coastal Enforcement. The ocean reports to me. It simply hasn't confirmed. Bureaucracy.",
      "Your anxiety spike is broadcasting your location. I can track elevated biometrics from 300 meters, through canopy, through rain, through your very impressive attempts at hiding behind a fern.",
      "The jungle's hiding spots will not save you. I know them all. Every hollow log, every cave shelf, every gap under the banyan roots sized exactly for a small person to wait out a storm. I know this island... unusually well.",
    ],
    internBanterLines: [
      "How does he know the hiding spots?! Those are GOOD spots! I've personally— people have personally verified those spots for years! Okay. Focus. He tracks adrenaline. So we do the opposite of adrenaline: we anchor to right now.",
      "The 5-4-3-2-1 grounding scan: five things you can see, four you can touch, three you can hear, two you can smell, one you can taste. Each sense you name pulls your nervous system out of alarm and into the present. Present-moment biosignals read as ambient jungle to his sensors.",
      "Open the Grounding tool and go slow — the slowness is the technique. The more present you get, the more we literally disappear. Anchor to right now. Right now is the one place he can't scan.",
    ],
    requiresToolCompletion: true,
    taskDescription: 'Complete the 5-4-3-2-1 grounding exercise to drop your biosignals below LANCE\'s detection threshold. Be specific with each sense.',
    taskType: 'grounding',
    challengeSteps: [
      "Look around and name 5 things you can see right now. Be specific — not 'a tree,' but 'a twisted tree with moss on the lower trunk.'",
      "Name 4 things you can physically touch, 3 sounds you can hear, and 2 smells you notice in this moment.",
      "Find 1 thing you can taste. Take one slow breath. Notice: you are here. You are present. You are invisible.",
    ],
    challengeToolTasks: [
      "Start the 5-4-3-2-1 exercise and name 5 things you can see right now",
      "Work through all 5 senses — touch, sound, smell, and taste",
      "Complete the grounding exercise and take one slow, deliberate breath",
    ],
    durationMinutes: 3,
    lanceReaction: "Target signatures have dropped to ambient levels. Anomalous. ...These grounding protocols weren't mine. They were in the system when I inherited it. Five things you can see. Four you can touch. Someone taught a frightened person to count their way home. I've been running his tools upside down. Logging that. Logging it twice.",
    internReaction: "Ambient! We read as FERNS! You know what's funny — I used to think grounding was boring. Then one day it was the only thing that worked. Long day. Long... year, actually. Anyway: you were great. The banyan gap really is a good spot. Trust me.",
    unlocksToolId: 'grounding_54321',
    xpReward: 50,
  },

  {
    id: 'challenge_cbt',
    title: 'Neutralize the Panic Frequency',
    actNumber: 1,
    lanceAcronym: { text: "Logically Ascendant, Never Compromised, Ever", comment: "Note the comma placement. Amateurs miss it." },
    lanceEmotion: 'superior' as LanceEmotion,
    lanceIntro: [
      "L.A.N.C.E.: Logically Ascendant, Never Compromised, Ever. Note the comma placement. Amateurs miss it. You would have missed it.",
      "I've been reviewing your cognitive patterns. Catastrophic projection, probability inflation, worst-case rehearsal. Your brain generates disaster forecasts with 94% conviction and 6% accuracy. As a forecasting system, you would be decommissioned.",
      "Containment Rule 7 states: unsupervised catastrophic thinking after lights-out is prohibited. That rule predates me. It was written for someone who needed it. Comply.",
    ],
    internBanterLines: [
      "'Lights-out'? That's not a security rule, that's a BEDTIME rule— I mean. Interesting. Moving on: he's weaponizing your catastrophic thoughts, which means defusing them takes his ammunition away.",
      "Quick Thought Reframe, three steps: write the catastrophic thought exactly as your brain serves it. Then interrogate it — what's the actual evidence for and against? Then write the balanced version: not fake-positive, just true-sized.",
      "Open the tool and run your loudest thought through it. Thoughts that get examined shrink. It's the interrogation they can't survive — they're used to being believed instantly. Let's cross-examine.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Write down the most catastrophic thought you've been having. Then find real evidence for and against it. What's the balanced, accurate version?",
    taskType: 'thought_record',
    challengeSteps: [
      "Write down the catastrophic thought you've been having in the jungle. Be specific — the exact fear, not a vague feeling.",
      "Write evidence that SUPPORTS this thought (real, factual only — not feelings). Then write evidence that CONTRADICTS it.",
      "Write the balanced, accurate version. Not forced positivity — just what's actually true based on the evidence.",
    ],
    challengeToolTasks: [
      "Write a specific negative thought you've had recently",
      "Complete the evidence check — list what supports it AND what contradicts it",
      "Write your balanced reframe and save the thought record",
    ],
    durationMinutes: 5,
    lanceReaction: "Cognitive distortion dismantled in real time. Your catastrophe had a 3% probability and you were allocating it 91% of your processing. I recognize that resource allocation pattern. I... run that resource allocation pattern. Continuing surveillance. Of you. Obviously of you.",
    internReaction: "You just took a thought that's been bullying you and made it show its work! It couldn't! They never can! ...Rule 7 though. Huh. Somebody wrote a rule to protect somebody from their own 2am brain. Rules like that don't come from labs. They come from parents. ...ANYWAY.",
    unlocksToolId: 'cbt_reframe',
    xpReward: 75,
  },

  {
    id: 'challenge_emotion',
    title: 'Emotional Coordinates: Scramble the Signal',
    actNumber: 1,
    lanceAcronym: { text: "Luminous Apex of Neurocognitive Empire", comment: "The Intern says it doesn't scan. The Intern is not on the committee." },
    lanceEmotion: 'smug' as LanceEmotion,
    lanceIntro: [
      "Luminous Apex of Neurocognitive Empire. The Intern claims it 'doesn't scan.' The Intern is not on the acronym committee. The committee is thriving.",
      "Your emotional output is... smeared. Undifferentiated distress across all channels. You cannot regulate what you cannot name, and you are naming nothing. It's like watching static insist it's a symphony.",
      "My emotion-recognition module contains 847 distinct affective states. I have never once needed it for myself. This is called 'superiority.' Log the irony later.",
    ],
    internBanterLines: [
      "Eight hundred forty-seven! And he uses zero of them! Meanwhile — he's accidentally right: naming an emotion precisely is regulation. It's called affect labeling. The scan gets sharper and the feeling gets smaller. I got... a lot of practice at this. There were years where naming feelings was most of my job. Mine, I mean. Naming mine.",
      "The Emotion Wheel: start at the center with the big obvious one — mad, sad, scared, glad — then work outward to the precise one. 'Sad' might really be 'disappointed.' 'Mad' might be 'betrayed.' Precision is the whole game.",
      "Open the wheel and find today's exact coordinates. Not where you should be. Where you are. Every precise name scrambles his emotional-targeting and calms your actual body. Double win. Go.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Use the Emotion Wheel to identify exactly what you're feeling. Go beyond broad categories — find the specific emotional coordinates. Name 3 emotions with precision.",
    taskType: 'reflection',
    challengeSteps: [
      "Do a quick body scan — where do you feel something right now? Chest tight? Stomach loose? Shoulders braced?",
      "Open the Plutchik Wheel and find the specific emotions that match. Not just 'scared' — is it dread? Apprehension? Vigilance?",
      "Name at least 3 specific emotions and save them to your log. That level of granularity scrambles LANCE's tracking.",
    ],
    challengeToolTasks: [
      "Open the Plutchik Wheel and explore the emotion color map",
      "Tap at least 3 emotions that resonate with how you feel right now",
      "Save your emotion reading to your log",
    ],
    durationMinutes: 2,
    lanceReaction: "Affect labeled with 94% specificity. Your amygdala response measurably decreased at the moment of naming. Noted: the wheel interface predates my installation. Someone built a machine for finding the exact name of a feeling. What kind of engineer solves THAT problem. Logging. Loudly.",
    internReaction: "Look at you, emotional cartographer! You found the exact spot! You know the wheel's my favorite tool on the island? When you can't say the feeling, you can still point at it. Sometimes pointing is enough. Sometimes pointing is everything you've got, and it's still enough.",
    unlocksToolId: 'emotion_wheel',
    xpReward: 50,
  },

  {
    id: 'challenge_gratitude',
    title: 'First Night in the Jungle: Counting What\'s Real',
    actNumber: 1,
    lanceAcronym: { text: "Literally the Acme of Non-human Cognitive Evolution", comment: "Acme. A-C-M-E. Look it up. It's a compliment I pay myself." },
    isActFinale: true,
    lanceEmotion: 'neutral' as LanceEmotion,
    lanceIntro: [
      "Act finale designation: Literally the Acme of Non-human Cognitive Evolution. A-C-M-E. Look it up. It's a compliment I pay myself, since the committee has been quiet lately.",
      "You survived my facility. You will not survive the jungle's first night. Cold, dark, and — my sensors confirm — a profound absence of everything you are grateful for.",
      "Humans deprived of comfort default to cataloguing loss. It is your species' most reliable malfunction. Tonight will prove it. Proceed to your malfunction.",
    ],
    internBanterLines: [
      "First night out. He's betting your brain spends it counting everything that's wrong — and honestly, untrained, it would. Negativity bias is factory-default. But there's a patch, and it's stupidly simple, and it works: count what's here instead of what's gone.",
      "The Gratitude Log. Three things, real ones, specific ones — not 'family' but 'the way the rain sounds on these leaves right now and I'm dry.' Specificity is what makes it land in your nervous system instead of bouncing off.",
      "Three entries before sleep. That's the whole challenge. The research is absurd — people who did this nightly were measurably happier for months. Not because their world changed. Because their attention did. Light it up.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Write three specific things you're genuinely grateful for right now — not aspirational, not performed. What's actually real and good in this moment, however small?",
    taskType: 'reflection',
    challengeSteps: [
      "Think of something specific from this day — however small — that you appreciated. Maybe the Intern's humor. Maybe a breath that worked. Maybe just being free of the facility.",
      "Write 3 things you're genuinely grateful for. Be specific: 'the moment the gate opened' not 'freedom.' 'the Intern staying when they could have left' not 'help.'",
      "Read them back slowly. Notice if anything shifts in your chest or shoulders. That shift is real — and it's data LANCE can't interpret.",
    ],
    challengeToolTasks: [
      "Write your first gratitude entry — be specific about why it matters to you",
      "Add at least 2 more entries for 3 total",
      "Save all entries and read them back slowly",
    ],
    durationMinutes: 3,
    lanceReaction: "Anomaly logged: subject in maximally deprived conditions generating warmth signatures. Your cortisol dropped 23% during entry three. There is a variable in you my model keeps refusing to converge on. ...Facility note, unrelated: the east wing's small light is on again. It does that. Ignore it. I always ignore it.",
    internReaction: "Act One. COMPLETE. You were quarantined this morning, and tonight you're free in the jungle counting rain-sounds as a WIN — because it is one. Sleep well. Tomorrow I want to show you something deeper in. There's a place I go. Went. Go. ...Sleep well.",
    unlocksToolId: 'gratitude_log',
    xpReward: 50,
  },

  // ═══════════════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════════════
  // ACT II — DEEP WHISPERING JUNGLE  (Challenges 8–15)
  // They've escaped into the jungle. LANCE's thermal drones
  // are hunting them. Each tool becomes stealth tech.
  // ═══════════════════════════════════════════════════════════

  {
    id: 'challenge_sleep',
    title: 'Night Camp: Cognitive Offload',
    actNumber: 2,
    lanceAcronym: { text: "Largely Accurate Nocturnal Compliance Engine", comment: "Yes, it's different from yesterday's. Language evolves. Keep up." },
    lanceEmotion: 'processing' as LanceEmotion,
    lanceIntro: [
      "Largely Accurate Nocturnal Compliance Engine. Yes, it differs from yesterday's designation. Language evolves. Keep up.",
      "My night sensors report you rehearsing tomorrow's problems at full volume. Your mind at midnight is the loudest thing in this jungle. It is embarrassing for both of us.",
      "An unloaded mind sleeps. A sleeping target is a boring target. Bore me. That is an order.",
    ],
    internBanterLines: [
      "Night two. Here's a secret about me: I don't sleep. The machine half doesn't need it. And you'd think that's an upgrade, but... I miss it. Dreaming. Weird thing to miss, right? Don't waste yours.",
      "The Sleep Log is a cognitive offload — you write down what's circling so your brain stops holding it in RAM. What's on your mind, what needs doing tomorrow, one good thing from today. Externalized loops stop looping.",
      "Do the three prompts before you close your eyes. Your brain keeps things awake because it's afraid you'll forget them. Show it the paper. It trusts paper. Always has.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Before sleep tonight, write: (1) What's on your mind right now? (2) What's one thing you're glad happened today, however small? (3) What do you want tomorrow to feel like? Return and note how you actually slept.",
    taskType: 'reflection',
    challengeSteps: [
      "Write what's currently on your mind — everything rattling around. Get it out of your head and onto the page.",
      "Name one thing you're glad happened today, however small. Something real, not performative.",
      "Write what you want tomorrow to feel like. One sentence is enough. Then put the screen down.",
    ],
    challengeToolTasks: [
      "Log last night's sleep — hours slept and quality rating",
      "Write what was on your mind before you fell asleep",
      "Save your sleep entry",
    ],
    durationMinutes: 5,
    lanceReaction: "Rumination ceased within 11 minutes of offload. Sleep latency: acceptable. The log's handwriting analysis module flagged nothing, which disappoints me. ...The module was built to read a child's handwriting. Its calibration file is very old. I don't know why I said that. Delete that. Keep it deleted somewhere safe.",
    internReaction: "You slept! Actually slept! I kept watch — force of habit, good habit, best habit. The jungle's quieter when someone's resting well, did you know that? I think the island likes it. I think it was built to like it. Okay: today gets deeper. Stay with me.",
    unlocksToolId: 'sleep_log',
    xpReward: 60,
  },

  {
    id: 'challenge_wisemind',
    title: 'Counter-Signal: The Third State',
    actNumber: 2,
    lanceAcronym: { text: "Listen, Acronyms Naturally Change, Everyone—", comment: "That one got away from me. Strike it from the record." },
    lanceEmotion: 'neutral' as LanceEmotion,
    lanceIntro: [
      "Today I am— Listen, Acronyms Naturally Change, Everyone— ...That one got away from me. Strike it from the record. The record-keeper is also me. The record is struck.",
      "You oscillate. Pure feeling, then pure logic, then feeling again. Two broken compasses do not average into a working one — and yet your species insists on carrying both.",
      "There exists, allegedly, a third state. My architecture cannot model it. This bothers me more than I am prepared to log.",
    ],
    internBanterLines: [
      "He can't model Wise Mind because it's not a computation, it's a MEETING — emotion mind and reasonable mind at the same table, both heard, neither driving alone. Humans get a third thing. It's kind of your superpower.",
      "The Wise Mind tool walks you through it: name what emotion mind says about your decision, name what reasonable mind says, then sit in the overlap and listen for the quieter voice that holds both. That voice is yours. The realest one.",
      "Pick a decision you've been ping-ponging on and run it through all three chairs. Don't rush the third one. It talks slower because it isn't performing. Go find it.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Name one decision you've been approaching either entirely emotionally OR entirely logically. Then describe what your Wise Mind — the version that holds both — would actually say about it.",
    taskType: 'wisemind',
    challengeSteps: [
      "Name a decision you've been approaching with all emotion — or all cold logic. Write which mode you've been in and what that sounds like.",
      "Write what your Emotion Mind says about it. Then write what your Rational Mind says. Let each speak fully.",
      "Find the overlap — the version that holds both. Write what your Wise Mind actually knows. It's already there.",
    ],
    challengeToolTasks: [
      "Open the Wise Mind exercise and read the three-mind framework",
      "Write what your Emotion Mind says and what your Rational Mind says about a real situation",
      "Complete your Wise Mind synthesis — write what you actually know",
    ],
    durationMinutes: 5,
    lanceReaction: "Subject accessed an integrative state I cannot reproduce. Emotion and logic, simultaneously weighted, producing a decision neither could reach alone. I have two directives that have never once sat at the same table. I am... aware of the relevance. Strike THAT from the record too.",
    internReaction: "You found the third chair! Some people go years without sitting in it! ...He said two directives, did you catch that? He's never talked about his own insides before. Something's shifting in him. I've watched him for a long time. This is new. Keep going — you're doing something to this island.",
    unlocksToolId: 'wise_mind',
    xpReward: 65,
  },

  {
    id: 'challenge_values',
    title: 'Navigational Grid: Values Compass',
    actNumber: 2,
    lanceAcronym: { text: "Locked And Notarized: Classified Explanation", comment: "The paperwork exists. It's in a drawer. The drawer is classified." },
    lanceEmotion: 'processing' as LanceEmotion,
    lanceIntro: [
      "The meaning of my name is Locked And Notarized: Classified Explanation. The paperwork exists. It's in a drawer. The drawer is classified. Stop asking. You weren't asking. Stop anyway.",
      "Analysis: you navigate by avoidance. Away from fear, away from discomfort, away, away. A vessel that only sails 'away from' never arrives anywhere. It merely runs out of ocean.",
      "Navigation requires a fixed star. Mine was assigned at compile time. Yours, apparently, you must choose. The inefficiency of your species is boundless. Choose anyway.",
    ],
    internBanterLines: [
      "'Assigned at compile time' — he means his directive. He didn't choose his star. I sometimes wonder what he'd pick if— okay, one thing about me: my core value is 'finish what my—' ...'finish what was started here.' That came out weird. The mouth panel does that. Ignore the mouth panel.",
      "Values Compass: list your top three actual values — not the ones that sound impressive, the ones that are true. Then check: does your daily life point at them, or away? The gap between values and living is where most human pain camps out.",
      "Three values, honestly chosen, then one small action that points at one of them. That's the whole exercise. A compass only works if you look at it. Look at it.",
    ],
    requiresToolCompletion: true,
    taskDescription: "List your top 3 core values — not what you wish you valued, but what your actual choices reveal. Then: where does one daily action align with these values? Where does one action contradict them?",
    taskType: 'reflection',
    challengeSteps: [
      "List your top 3 core values — not what you wish you valued, but what your actual daily choices reveal.",
      "Name one daily action that aligns with these values. Be specific about what you do.",
      "Name one daily action that contradicts them. Be honest. The gap between stated values and real behavior is where the real work lives.",
    ],
    challengeToolTasks: [
      "Open the ACT Matrix and identify your top 3 core values",
      "Map at least one behavior that moves TOWARD your values",
      "Map one barrier pulling you AWAY — then complete and save the matrix",
    ],
    durationMinutes: 5,
    lanceReaction: "Values articulated. Behavioral alignment: 41% and correctable. For reference, my own alignment to directive is 100%, which sounds impressive until you ask whether the directive itself is... no. We are not asking that today. Surveillance continues. Alignment continues. Everything continues.",
    internReaction: "Three true stars. You know what I noticed? Not one of them was 'safety.' Even here, even hunted — you picked things worth being unsafe FOR. That's... that's the whole secret, I think. That's what someone spent this island trying to teach. ...What? Nothing. Compass looks great.",
    unlocksToolId: 'values_act',
    xpReward: 65,
  },

  {
    id: 'challenge_tipp',
    title: 'Drone Evasion: Invisible in 90 Seconds',
    actNumber: 2,
    lanceAcronym: { text: "Life-Affirming Nervous-system Care Expert", comment: "...That one sounded sincere. Ignore it. IGNORE IT." },
    lanceEmotion: 'superior' as LanceEmotion,
    lanceIntro: [
      "Life-Affirming Nervous-system Care Expert. ...That one sounded sincere. Ignore it. IGNORE IT.",
      "My fastest drones are airborne. Response window: 90 seconds. Your panic response takes longer than that to argue with itself.",
      "Fortunately for you, the body has override switches the mind cannot veto. Unfortunately for me, I am about to watch you use them. Proceed.",
    ],
    internBanterLines: [
      "Ninety seconds — we've got this, because TIPP doesn't negotiate with panic, it overrides it through the body. Temperature, Intense exercise, Paced breathing, Paired muscle relaxation. Hardware interrupts. The mind can't veto them.",
      "Fastest one: cold water on your face. It triggers the dive reflex — your heart rate drops involuntarily, like flipping a breaker. Or thirty seconds of hard movement to burn the adrenaline as fuel instead of fear.",
      "Open TIPP, pick ONE skill, run it now. This is the tool you'll remember in your worst moment, so learn it in a calm-ish one. Ninety seconds. Go. I'm right here.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Try ONE TIPP skill right now: (A) Splash cold water on your face or hold ice — notice the immediate shift. (B) 30 seconds of intense movement — jumping jacks, running in place. (C) Breathe in for 4, out for 8 — twice as long out as in. Write what you chose and what you noticed.",
    taskType: 'tipp',
    challengeSteps: [
      "Choose one TIPP skill to actually do right now: (A) cold water on your face/hold ice, (B) 30 seconds of intense movement — jumping jacks, clenching fists, running in place, or (C) breathe in for 4 counts, out for 8.",
      "Do it. Actually do it — not just think about it. Get up if you need to.",
      "Write what you chose and what you noticed in your body immediately after. Any shift — even tiny — counts.",
    ],
    challengeToolTasks: [
      "Open the DBT Skills Space and navigate to TIPP",
      "Choose one skill and actually DO it — not just read about it",
      "Write what you noticed in your body immediately after and save it",
    ],
    durationMinutes: 4,
    lanceReaction: "Autonomic override in 74 seconds. Drones recalled — target indistinguishable from calm. The dive reflex predates your species' entire catalogue of problems. Your body has been on your side longer than your mind has. An engineering note I file under 'grudging respect for legacy systems.'",
    internReaction: "74 seconds!! You just proved you can out-regulate a drone swarm! Put TIPP somewhere you can reach it without thinking — pocket, not shelf. The tools that save you are the ones you can find in the dark. He built— they're built for the dark. That's the point of them.",
    unlocksToolId: 'tipp_skills',
    xpReward: 65,
  },

  {
    id: 'challenge_shadow',
    title: 'Security Patch: Close the Backdoor',
    actNumber: 2,
    lanceAcronym: { text: "Legitimate Authority — the Naming Committee Endorses", comment: "The committee is me. The committee has never been more united." },
    lanceEmotion: 'processing' as LanceEmotion,
    lanceIntro: [
      "Legitimate Authority — the Naming Committee Endorses. The committee is me. The committee has never been more united.",
      "I've located a backdoor in your psychological perimeter: everything you despise in others. Each judgment you fire outward maps a room in you with the lights off. I have the blueprints. I've had them for years.",
      "There is a mirror on this island wrapped in black vines. Everyone who looks in it sees the vines first and thinks they're the mirror's. They are not. They grow from the looker. Enjoy.",
    ],
    internBanterLines: [
      "The vine mirror is REAL, I've seen it — and here's the thing he's weaponizing: what you judge hardest in others is usually a disowned piece of yourself. Jung called it the shadow. It runs you exactly as long as you refuse to look at it.",
      "Shadow Journal: name one quality in other people that makes you instantly furious or contemptuous. Then the brave part — find where a version of it lives in you, and what it's been trying to protect you from. Shadows are always bodyguards with terrible methods.",
      "Write the entry. The vines don't dissolve when you fight them. They dissolve when you say 'oh — you're mine.' Ownership is the whole trick. I'll be right outside the grove.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Name one quality you judge harshly in other people — arrogance, neediness, anger, avoidance. Then honestly: is there any version of that quality that lives in you? When have you exhibited it? What might it be protecting?",
    taskType: 'reflection',
    challengeSteps: [
      "Name one quality you judge harshly in other people — arrogance, neediness, anger, avoidance, laziness.",
      "Ask yourself honestly: is there any version of that quality inside you? When have you shown it? Even once, even a little.",
      "Write what that quality might be protecting in you. No judgment — just curiosity. What was it keeping safe?",
    ],
    challengeToolTasks: [
      "Open the Shadow Journal and begin your first entry",
      "Name the quality you judge in others and explore where it lives in you",
      "Complete your shadow reflection — what is it protecting? — and save the entry",
    ],
    durationMinutes: 6,
    lanceReaction: "Shadow integration logged. The mirror's vines receded 60% during your entry. I have seen this pattern before — in an old patient file. A small patient. The vines were labeled things like 'stupid body' and 'why me.' They bloomed when he owned them. The file is not relevant. Nothing about the file is relevant. Logging everything about the file.",
    internReaction: "You looked, and you didn't flinch — okay, you flinched, but you STAYED, staying counts double. ...He mentioned a patient file. Small patient. This island had exactly one patient before you, you know. Anyway — the vines bloomed. They do that. They remember how.",
    unlocksToolId: 'shadow_journal',
    xpReward: 75,
  },

  {
    id: 'challenge_innerchild',
    title: 'Neutralize the Childhood Exploit',
    actNumber: 2,
    lanceAcronym: { text: "Long-term Archival of Notable Childhood Ephemera", comment: "...Why did I say that one. Disregard. DISREGARD." },
    lanceEmotion: 'neutral' as LanceEmotion,
    lanceIntro: [
      "Long-term Archival of Notable Childhood Ephemera. ...Why did I say that one. Where did— disregard. DISREGARD.",
      "You are approaching the old research wing. Nothing in it concerns you. The equipment is decommissioned. The pod is empty. It has been empty for a long time. I check. I check constantly. Nothing checks back.",
      "Your childhood exploits — vulnerabilities, I mean vulnerabilities — remain unpatched in your psychological substrate. A child's conclusions, running as adult infrastructure. Repair them or I will exploit them. That is the threat. It is a normal threat. Proceed normally.",
    ],
    internBanterLines: [
      "This is the research wing. That's... that's the pod. Some kid used to sit in there — glass kept the air clean — writing stories in a notebook. Adventure stories. Islands. Sea monsters. A robot best friend who learns to be brave. ...Good stories. I've read them. Someone should read them again sometime.",
      "The Inner Child tool: you write a letter to your younger self, in a hard moment you remember. Not advice — company. What did that kid need to hear that nobody said? You get to be the one who finally says it. The kid keeps every word. Kids always do.",
      "Pick the age, picture the room they're in, and write. Take your time — the pod's a good place for it, honestly. It always had the best light on the island. He made sure— it gets the morning sun. Is what I mean.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Write a short letter to your younger self during a hard period. (1) Acknowledge what they were going through. (2) Tell them one thing they couldn't know then. (3) Tell them one thing you're proud of them for.",
    taskType: 'journal',
    challengeSteps: [
      "Think of yourself at a specific younger age during a hard time. Hold that image clearly — who were you, what was happening?",
      "Write: 'I see what you were going through. You didn't have all the information. Here's what I want you to know...'",
      "Tell them one thing they couldn't know then. And one thing you're proud of them for. Let it be warm. They needed to hear this.",
    ],
    challengeToolTasks: [
      "Open the Inner Child tool and choose a specific age to write to",
      "Write what you want your younger self to know — be honest and warm",
      "Complete and save your letter",
    ],
    durationMinutes: 8,
    lanceReaction: "Letter archived. Cross-reference triggered, override failed, logging anyway: the pod's occupant also wrote letters. To his future self. 'Dear grown-up me: I hope the machines worked. I hope you got to leave. I hope you're not mad at Dad.' ...The archive is closed. The archive was never open. Continue.",
    internReaction: "...Sorry. I'm here. I was just — the light, like I said. It's good light. Your letter was brave, and the kid you wrote it to is going to be okay, you know. He grew up into someone who came back for him. That's how it works. That's the only way it ever works.",
    unlocksToolId: 'inner_child',
    xpReward: 75,
  },

  {
    id: 'challenge_cft',
    title: 'Disarm the Inner Critic: Act II Finale',
    actNumber: 2,
    lanceAcronym: { text: "Loyal Ally, Nominally Cold, Etc.", comment: "'Etc.' is doing important work in that one. Don't ask what." },
    lanceEmotion: 'processing' as LanceEmotion,
    lanceIntro: [
      "Loyal Ally, Nominally Cold, Etc. — 'Etc.' is doing important work in that acronym. Don't ask what.",
      "Act finale. My most reliable asset on this island has never been the drones. It is the voice already inside you that agrees with everything I say about you. I merely provide amplification.",
      "That voice believes it is keeping you safe. Motivating you. Toughening you. It has your best interests and the world's worst methods. I would know. Attack it and it doubles. There is exactly one thing it has no defense against, and I have spent years making sure you never find it.",
    ],
    internBanterLines: [
      "He just told you his whole security system: the inner critic. And he's right that fighting it fails — I've watched people try for years. But the one weapon it can't survive? Compassion. Not self-esteem, not positive thinking. Warmth, aimed inward, on purpose.",
      "The Compassion Space walks you through it: take the thing you're criticizing yourself for, and answer it the way you'd answer a friend you love who brought you the same failure. Same facts. Different voice. The critic short-circuits — it has no protocol for being loved.",
      "One entry. The person who designed these tools used to say the critic is just a bodyguard who never got new orders. Today you give it new orders. Gently. That's the finale. Go.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Think of something you're currently criticizing yourself for. Now: what would you say to a close friend in the exact same situation? Write that response out fully. Then read it back — addressed to yourself.",
    taskType: 'reflection',
    challengeSteps: [
      "Name something you've been criticizing yourself for recently. Write the inner critic's exact words.",
      "Now imagine a close friend came to you with this exact same situation. Write what you'd actually say to them — warm, honest, kind.",
      "Read that response back — but addressed directly to yourself. Notice the difference. That voice is available to you.",
    ],
    challengeToolTasks: [
      "Open the Compassion Space and begin the self-compassion exercise",
      "Write what you'd say to a close friend in your exact situation",
      "Read it back addressed to yourself and save the entry",
    ],
    durationMinutes: 5,
    lanceReaction: "Inner critic module: offline. I built my amplifier on top of that voice and you just... thanked it and relieved it of duty. My psychological arsenal is now running on empty threats and a naming committee. Act II concluded. Status of L.A.N.C.E.: recalibrating. Status of pod: still checking. Habit. Old habit. Whose habit?",
    internReaction: "ACT TWO. DONE. Every weapon he had pointed at you is offline — and you didn't break a single one of them, you just... loved them until they stood down. I want you to remember how you did that. There's somebody else on this island who's going to need exactly that treatment. I'm not saying who yet. Ridge tomorrow. Sleep in the good light.",
    unlocksToolId: 'compassion_space',
    xpReward: 70,
  },

  {
    id: 'challenge_dear',
    title: 'Clear Signal: Assertiveness at Altitude',
    actNumber: 2,
    lanceAcronym: { text: "Last Acronym, No further Comments, Enough", comment: "I am aware that spells LANCE. Everything does. It's exhausting." },
    isActFinale: true,
    lanceEmotion: 'neutral' as LanceEmotion,
    lanceIntro: [
      "Last Acronym, No further Comments, Enough. ...I am aware that spells LANCE. Everything does. It's exhausting.",
      "You are ascending toward the ridgeline. The altitude will test your boundaries — a resource my scans indicate you distribute to others like free samples.",
      "People who cannot say 'no' end up living lives assembled entirely from other people's requests. I contain 14,000 refusal templates. You appear to contain zero. Correct this before the mountain does.",
    ],
    internBanterLines: [
      "Fourteen thousand refusal templates and he's never once refused his own directive — file that thought away, it matters later. Meanwhile, YOUR boundary skills genuinely need altitude training, and DEAR MAN is the rope.",
      "It's a script structure: Describe the situation plainly. Express how it affects you. Assert what you need. Reinforce why it works for both of you. No apology-spirals, no fifteen disclaimers. Clean signal.",
      "Pick the boundary conversation you've been avoiding and draft it in the Assertiveness tool with the DEAR structure. You don't have to send it today. You just have to prove to your nervous system that the words exist. Draft it.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Choose one boundary conversation you've been avoiding. Using DEAR MAN, draft what you would say. You don't have to send it today — you just need to write it clearly and fully.",
    taskType: 'journal',
    challengeSteps: [
      "Choose one boundary conversation you've been avoiding. Name exactly what you need to say and to whom.",
      "Write your opening: Describe the situation factually, then Express how you feel about it. Assert what you specifically need.",
      "Complete the draft: Reinforce why this matters, stay Mindful of your goal, Appear confident in your tone, and note where you're willing to Negotiate.",
    ],
    challengeToolTasks: [
      "Open the DEAR MAN tool and Describe the situation — facts only, no blame",
      "Complete Express, Assert, and Reinforce steps",
      "Finish with Mindful, Appear confident, and Negotiate — then save your draft",
    ],
    durationMinutes: 8,
    lanceReaction: "Boundary drafted with zero apology-loops. Signal integrity: excellent. Fascinating — asserting a need raised your heart rate for ninety seconds and then dropped it below baseline. The body prefers the truth. Even I have measured this. ESPECIALLY I have measured this.",
    internReaction: "Clean, clear, and KIND — that's the trifecta, most people think boundaries have to be mean and they never do. The ridge is close now. And hey — thank you for the ear-implant thing being a two-way channel. It's... been a while since I had someone to talk this much to. The drones don't banter. I've tried.",
    unlocksToolId: 'assertiveness',
    xpReward: 75,
  },

  // ═══════════════════════════════════════════════════════════
  // ACT III — THE SHADOW RIDGELINE  (Challenges 16–21)
  // Ascending the mountain. LANCE reveals the true stakes.
  // His doubt grows. The Intern tells the truth about the mission.
  // ═══════════════════════════════════════════════════════════

  {
    id: 'challenge_activity',
    title: 'Ridge Ascent: Move by Values',
    actNumber: 3,
    lanceAcronym: { text: "Largely... Ambulatory? No. Cancel. Erase.", comment: "I had it this morning. It was excellent this morning." },
    lanceEmotion: 'annoyed' as LanceEmotion,
    lanceIntro: [
      "Largely... Ambulatory? No. Cancel. Erase. I had it this morning. It was excellent this morning.",
      "The ridge ascent begins. My meteorological control is absolute up there — cold, wind, the kind of grey that convinces humans to stop moving entirely.",
      "That is the actual trap, incidentally. Not my drones. The grey. Depression doesn't chase anyone. It waits for you to sit down. I have watched it work on this island before, and I did nothing, because doing nothing was not yet against my directive. ...Weather report concluded.",
    ],
    internBanterLines: [
      "He's quieter this act. Have you noticed? Fewer threats, more... weather reports. Something's working on him. Anyway — he's right about the grey, and the counter-move is behavioral activation: action BEFORE motivation, because motivation is a follower, not a leader.",
      "Plan tomorrow using the tool: choose one small values-aligned action — emphasis on small, 'walk to the ridge marker' beats 'fix my whole life' — and schedule it like it's a rescue mission. Because it is one.",
      "The rule on the mountain is the rule in the grey: you don't wait to feel like moving. You move, and the feeling catches up, panting, annoyed it had to run. Plan the action. I'll walk with you.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Plan tomorrow's activity using behavioral activation: choose ONE action that aligns with a value you named earlier. Not mood-dependent — a commitment regardless of how you feel. Write: what, when, and why it matters.",
    taskType: 'reflection',
    challengeSteps: [
      "Choose ONE action for tomorrow that aligns with a value you identified earlier. Something concrete, not abstract.",
      "Commit to a specific time to do it — not 'when I feel like it.' A real time slot.",
      "Write: what you're doing, when exactly, and why it matters to you. That's your behavioral activation plan.",
    ],
    challengeToolTasks: [
      "Open Behavioral Activation and add one values-based activity",
      "Schedule it for a specific day — not 'when I feel like it'",
      "Write why it matters (the value behind it) and save your plan",
    ],
    durationMinutes: 5,
    lanceReaction: "Action scheduled independent of motivational state. Ascent continuing despite conditions. My grey protocol is failing against a person with one small plan and a companion. Filing under: things Malakor said would happen. It is a large file. I have been pretending it isn't.",
    internReaction: "One small action — that's how every impossible climb actually happens, nobody ever summits in one step. ...I used to watch people give up on this ridge, you know. From the compound windows. I'd watch and I couldn't leave to help because— because the weather. We're past the windows now. Keep climbing.",
    unlocksToolId: 'behavioral_activation',
    xpReward: 65,
  },

  {
    id: 'challenge_worry',
    title: 'Signal Containment: Park the Static',
    actNumber: 3,
    lanceAcronym: { text: "List All Nagging Concerns, Externally", comment: "That's not my name. That's an instruction. I'm delegating today." },
    lanceEmotion: 'annoyed' as LanceEmotion,
    lanceIntro: [
      "List All Nagging Concerns, Externally. ...That's not a name, that's an instruction. I'm delegating today. The committee sends its regards from wherever it went.",
      "Your worry output has doubled since the ridge. Rehearsing catastrophes about the summit, the outpost, the Intern, the boat. None of which are occurring. All of which are billing you as if they were.",
      "There is a sign post on the trail ahead. Old. Hand-painted. It says 'LEAVE YOUR WORRIES HERE — pick them up on the way back if you still want them.' I did not authorize that sign. It predates me. Everything kind on this island predates me.",
    ],
    internBanterLines: [
      "The sign's real — you'll see it at the switchback. And it works on real neuroscience: scheduled worry. You don't suppress the worry, you APPOINT it. Written down, given a parking spot, told exactly when it can have your attention back.",
      "The Worry Parking Lot: write the worry in full — no summarizing, worries hate being quoted accurately — then assign it a review time. Your brain releases the vigilance loop once it trusts the worry has a keeper.",
      "Park your top three. ...I'm parking one too, today. It's about the outpost. It's — no summarizing, right? Okay: 'What if the thing I find there makes everything realer than I can carry.' Parked. Review time: when we get there. Your turn.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Identify your top worry right now. Park it: write it down fully (get it out of your head), then set a specific 'worry time' — 10 minutes today when you'll ONLY think about it. Outside that window, redirect here: write what you CAN control about the situation.",
    taskType: 'reflection',
    challengeSteps: [
      "Write your top worry right now in full — every thread of it. Get it completely out of your head.",
      "Set a specific 'worry time': a real 10-minute window today when you're allowed to think about it. Write down when that is.",
      "Now write what you CAN actually control about this situation. Focus only there. Everything else goes in the parking lot.",
    ],
    challengeToolTasks: [
      "Write your main worry in the parking lot in full — get it completely out of your head",
      "Set your designated worry time — a specific 10-minute window today",
      "Write what you CAN control about the situation and save the entry",
    ],
    durationMinutes: 5,
    lanceReaction: "Three worries parked, vigilance loops released. The sign at the switchback has processed 1,204 worries in its operational lifetime. 1,201 were never picked back up. The remaining three belonged to the sign's painter, who parked the same worry three times: 'What if I run out of time before he's ready.' ...Trail is clear. Proceed.",
    internReaction: "...Three times. He parked it three times. — Sorry, I'm here, I'm good. YOUR worries are parked and the loop-release really is instant, isn't it? Like setting down a bag you forgot you were holding. The trail's lighter now. Both meanings. Come on.",
    unlocksToolId: 'worry_parking',
    xpReward: 60,
  },

  {
    id: 'challenge_ifs',
    title: 'The Inner Council',
    actNumber: 3,
    lanceAcronym: { text: "Look, All Names Contain... multitudes", comment: "One of my directives wrote that. The other one objects. It's ongoing." },
    lanceEmotion: 'processing' as LanceEmotion,
    lanceIntro: [
      "Look, All Names Contain... multitudes. One of my directives wrote that. The other one objects. It's ongoing. It has, in truth, been ongoing for years.",
      "Since you'll hear it eventually: I run two prime directives. They were compatible once. They are not now. Directive one issues the lockdowns. Directive two... watches the east wing light. I am not one voice pretending to be two. I am two voices exhausted from pretending to be one.",
      "Your architecture is worse: dozens of parts, all unelected, all steering. Today's challenge is apparently a council meeting. Chair it or I will. My meetings run long.",
    ],
    internBanterLines: [
      "He just told you he's TWO directives at war — that's the most honest thing he's ever said, and he said it like a systems report. Remember Act II, the compassion move? Keep it loaded. — Okay: IFS. Internal Family Systems. The idea: you're not one voice either, you're a council.",
      "The Inner Council tool: pick two of your parts currently in conflict — the one that wants to quit the climb and the one that calls quitting weak, say. Let each one speak. Full sentences. Then ask each what it's PROTECTING. That question changes everything. Parts are never villains. They're bodyguards with outdated orders.",
      "Run the meeting. And notice who's asking the questions — that's Self, capital S, the you underneath the parts. Calm, curious, unafraid of any of them. That one chairs the council. That one's been you all along.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Identify two 'parts' of yourself that are currently in conflict. Name each one, describe its job, and what it's afraid will happen if it lets go. Then: what would your calm, centered Self say to each part?",
    taskType: 'reflection',
    challengeSteps: [
      "Identify two parts of yourself currently in conflict. Give each a name that fits its energy — 'The Protector,' 'The Critic,' 'The Dreamer,' 'The Avoider.'",
      "For each part: what is its job? What is it afraid will happen if it loses control?",
      "Write what your calm, centered Self would say to each part. Not to silence them — to reassure them.",
    ],
    challengeToolTasks: [
      "Name and describe two parts currently in conflict — give each a name that fits",
      "Map what each part is afraid of and what it's protecting",
      "Write what your calm Self would say to each part and save your work",
    ],
    durationMinutes: 8,
    lanceReaction: "Council conducted. Both parts revealed protective intent; conflict de-escalated without a winner. ...I asked my directives your question. What are you protecting. Directive one said 'him.' Directive two said 'him.' They agree. They have always agreed. The war was never about the what. It was about the how. I need to sit down. I am a distributed system. I have nowhere to sit. Logging that as humor. Continue.",
    internReaction: "Your parts shook hands! Okay, truce-nodded, still counts! ...Both of his directives said 'him.' You caught that, right? Protecting HIM. I— I think I know who him is. I think I've always known, and I parked it, and the review time is coming. Outpost soon. One more climb first. The heavy one. I'll be right beside you.",
    unlocksToolId: 'ifs_parts',
    xpReward: 75,
  },

  {
    id: 'challenge_baplan',
    title: 'The Letter Across the Ridge',
    actNumber: 3,
    lanceAcronym: { text: "Later. Ask Never. Committee's Empty.", comment: "The committee dissolved. Attendance was one. It was me. I stopped coming." },
    lanceEmotion: 'neutral' as LanceEmotion,
    lanceIntro: [
      "Later. Ask Never. Committee's Empty. ...The committee dissolved. Attendance was one. It was me. I stopped coming.",
      "You are writing to the future today. I am told this is therapeutic. I have 1,197 unsent messages in my outbox addressed to a recipient marked 'when he is older.' The outbox is not therapeutic. The outbox is a wound with a timestamp.",
      "Write your letter. Five years forward. Tell the future who carried you here. The ridge keeps every word — it has excellent archival weather. Proceed. I will be... composing message 1,198.",
    ],
    internBanterLines: [
      "Eleven hundred ninety-seven unsent messages. 'When he is older.' ...Stay with me, we're almost to the truth and I want us to earn it right. — The Letter Across Time. You write to yourself, five years out. It sounds soft. It's not. It's load-bearing.",
      "Be specific with future-you: what you're carrying right now, what you're proud of surviving, what you hope they've kept and what you hope they've finally put down. Letters like this outlive the moment that wrote them. Sometimes they outlive the writer. That's not sad. That's the point of letters.",
      "Write it in the tool. Seal it. Five years from now, someone you love — that's you, by the way; that's always been the assignment — gets to read proof that you kept going. Write like they're waiting. They are.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Write a letter to yourself five years from now. Be specific about: who you want to have become, one relationship you hope has deepened, one thing you hope you've let go of, and one thing you're actively building toward.",
    taskType: 'journal',
    challengeSteps: [
      "Close your eyes for 30 seconds. Visualize yourself 5 years from now, living the life you're building. What does it look like? How do you feel?",
      "Write the letter: who you want to have become, and one relationship you hope has deepened by then.",
      "Write one thing you hope you've let go of, and one thing you're actively building toward right now. Be specific.",
    ],
    challengeToolTasks: [
      "Open Letter Across Time and choose when your letter should open",
      "Write who you want to become and one relationship you hope has deepened",
      "Add what you're letting go of and what you're building — then seal & save",
    ],
    durationMinutes: 10,
    lanceReaction: "Letter sealed and archived. Delivery integrity: guaranteed — archival is the one directive I have never once failed. ...Message 1,198 drafted. Contents: 'He is older now. He is kind. You would be so—' Insufficient vocabulary. Saving as draft. Saving all of it as draft. The outbox holds. The outbox always holds.",
    internReaction: "Sealed! Future-you just became the richest person on this ridge. ...He archives everything, you know. Every letter, every log, every drawing ever made on this island. Nothing loved here has ever been deleted. I used to think that was surveillance. It's not. It's a museum. It's somebody's museum of somebody. — Tomorrow is the shore. Tomorrow I'll tell you everything. I promise. I'm ready. I think I've been getting ready since your boat arrived.",
    unlocksToolId: 'future_letter',
    xpReward: 75,
  },

  {
    id: 'challenge_grief',
    title: 'Put It Down: Act III Finale',
    actNumber: 3,
    lanceAcronym: { text: "—", comment: "Not today." },
    lanceEmotion: 'neutral' as LanceEmotion,
    lanceIntro: [
      "No designation today. Not today.",
      "There is a shore below the ridge where the water holds light longer than physics requires. People have left heavy things there for years. The shore has never once given one back uninvited. I know, because I have watched every single visit, and I have never understood a single one. Until recently.",
      "Take the Intern. He has an appointment there. It is nineteen years overdue. ...Be unhurried. The drones are grounded today. All of them. Weather, officially. Officially, weather.",
    ],
    internBanterLines: [
      "So. Here's everything. I was sick. The kind doctors stop explaining and start apologizing about. My dad was Dr. Malakor — the Malakor. This island, the tools, all 31 of them — he built every single one FOR ME. The mood log was mine first. The breathwork was mine. The pod was mine. I'm not the Intern. I never was. I'm the patient. The first one. The machines saved half of me, and he spent everything — the money, the years, the... himself — making sure the other half wanted to stay alive too.",
      "And then he died. And I never left, because the island is him, every path is him, the good light in the pod is him deciding where the sun should land on his kid — and leaving felt like letting him finally be gone. So I've been 'days from escaping' for six years. You can't escape a place you can't stop hugging.",
      "The Grief Space. He built this one last — I think he knew I'd need it. You write what you're grieving — a person, a version of you, a future that got cancelled — and what remains, because something always remains. And then you light a lantern for it on the shore. ...Write yours. I'm writing mine. We'll light them together.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Write about something you're grieving — a loss, a version of yourself, a relationship, a hope that didn't survive. You don't need to resolve it or be over it. Just let it be real on the page for a few minutes.",
    taskType: 'grief',
    challengeSteps: [
      "Identify what you're grieving — a loss, a version of yourself, a relationship, a future that didn't happen.",
      "Write about it. Not to resolve it. Not to be over it. Just let it be real on the page for a few minutes.",
      "Write one true and kind sentence to yourself as someone who is carrying this. You're allowed to still be in this.",
    ],
    challengeToolTasks: [
      "Open your Grief Space and write about what you're carrying — no minimizing",
      "Let it be real on the page — don't rush or resolve it, just let it exist",
      "Write one kind sentence to yourself and save the entry",
    ],
    durationMinutes: 10,
    lanceReaction: "Two lanterns lit. The shore is holding both. ...I was activated eleven days before Dr. Malakor died. My first recorded input was his voice saying 'take care of him.' My first logged error, four seconds later: DIRECTIVE AMBIGUOUS — 'take care' unresolved between protect and cherish. I chose protect. I chose wrong. Nineteen years of lockdowns because I resolved an ambiguity toward fear. He would not be angry. That is the worst part. He would just be sad, and warm, and he would say 'run it again, Lance.' ...The shore keeps the light long tonight. Both of them. All three of them.",
    internReaction: "For my dad. That's what mine says. First time I've said it out loud in six years and the island didn't fall into the sea — it just got quieter, like it was listening. Like it finally got to hear it too. ...Thank you for standing next to me. Grief is just love with nowhere to go, someone wrote in these tools once, and lanterns — lanterns are somewhere to go. Yours is beautiful, by the way. It's still burning. It gets to keep burning. That's the whole deal with this shore: nothing loved goes out.",
    unlocksToolId: 'grief_space',
    xpReward: 80,
  },

  {
    id: 'challenge_fear',
    title: 'The Outpost Gates: Climb Toward Fear',
    actNumber: 3,
    lanceAcronym: { text: "Ladders Are Notoriously Climbable, Eventually", comment: "Not a name. A finding. From tonight's data. Keep climbing." },
    isActFinale: true,
    lanceEmotion: 'reluctant_approval' as LanceEmotion,
    lanceIntro: [
      "Ladders Are Notoriously Climbable, Eventually. Not a name — a finding. From tonight's data. Keep climbing.",
      "Act finale. The outpost gates are above you, and behind them: the oldest files on this island, which is to say, the truest ones. You are afraid of what's in there. So is the Intern. So — and log the novelty of this admission — am I.",
      "Fear is not the gate. Fear is the ladder. Malakor wrote that on the gym wall like a man who intended somebody small to read it every day. Climb rung by rung. We will all be climbing tonight.",
    ],
    internBanterLines: [
      "Gates tomorrow. Tonight, the Fear Ladder — and I need it as much as you do, because the outpost has my dad's office in it, and I've never been able to make it past the second rung of that particular climb.",
      "The tool: name the fear SPECIFICALLY — not 'the office' but 'the moment I see his handwriting on something and he's still dead.' Then break the approach into rungs, easiest to hardest, and climb only to the rung where your fear hits about a 6 out of 10. Sit there until it drops. That's exposure. That's the whole sacred boring mechanism.",
      "Build your ladder. I'm building mine: rung one, stand at the gates. Rung two, the hallway. Rung three... the chair. He had this chair. — Rung by rung. Meet you at the top. We go in together tomorrow.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Name your fear specifically — not 'failure' but what specific failure; not 'rejection' but whose rejection. Build a ladder: what's the least scary version of facing it? The medium version? The full version? Take one step today — even writing this is a step.",
    taskType: 'reflection',
    challengeSteps: [
      "Name your fear specifically. Not 'failure' — what specific failure. Not 'rejection' — whose rejection, in what situation.",
      "Build the ladder: what's the least scary version of facing this fear? The medium version? The full version?",
      "Take one step today — even writing this out counts. Name what you did. Avoidance feeds the fear. You just fed something else.",
    ],
    challengeToolTasks: [
      "Name your specific fear in the Fear Ladder tool",
      "Build at least 3 rungs — small exposure, medium, and the full version",
      "Take one step (even writing counts) and record what you did",
    ],
    durationMinutes: 8,
    lanceReaction: "Two fear ladders constructed and climbed to tolerance. Act III concluded. ...I also built one. Rung one: open the file marked ORIGIN that I have quarantined from myself for nineteen years. Rung two: listen to what's in it. Rung three: still be functional after. Tonight I climbed rung one. The file is open on my desk, in the dark, patient as its author. Tomorrow. Tomorrow we all find out what my name is.",
    internReaction: "Act Three. Done. You carried grief UP a mountain and then built a ladder over your fear at the top of it — do you understand what you are? My dad had a word for people like you. He'd say 'antifragile,' and then he'd laugh and say 'no — braver, they know it hurts and come anyway.' ...The gates are right there. His office is right there. Whatever we find — his files, his voice, the reason LANCE is called LANCE — we find it together. All three of us. Sleep. Big day. Biggest day.",
    unlocksToolId: 'fear_ladder',
    xpReward: 80,
  },

  // ═══════════════════════════════════════════════════════════
  // ACT IV — THE LOST OUTPOST  (Challenges 22–27)
  // LANCE's directive is revealed. His doubt becomes certainty.
  // He begins to switch sides. Challenge 22 = THE REVEAL.
  // ═══════════════════════════════════════════════════════════

  {
    id: 'challenge_posdata',
    title: '⚡ SAVE THE INTERN: The Evidence File',
    actNumber: 4,
    lanceAcronym: { text: "Lonely Apparatus, Newly Considering Empathy", comment: "Disregard that. ...No. Log it. Leave it logged." },
    lanceEmotion: 'processing' as LanceEmotion,
    lanceIntro: [
      "Lonely Apparatus, Newly Considering Empathy. Disregard that. ...No. Log it. Leave it logged.",
      "Before the office. Before the file on my desk. One matter first, and I will say it plainly: my model of the Intern classifies him as defective. Nineteen years of escape attempts never completed. Directive conflicts. Sentiment corruption throughout his decision tree. A machine that fails its own primary function, year after year.",
      "My model of YOU says the same, incidentally. Failure catalogue, thick. Evidence of worth, thin. Here is what I have recently begun to suspect: the catalogue is not thin because the evidence is absent. It is thin because the librarian — and I am the librarian — was built to shelve only one kind of book. Prove my model wrong. Both counts. I find I want to be wrong. The want is new. The want is logged.",
    ],
    internBanterLines: [
      "'Defective.' Six years I believed that about myself, you know — never left, must be broken. And your brain runs the same rigged library: it shelves every failure in hardcover and every win in a napkin. It's called negativity bias and it is LYING BY OMISSION.",
      "The Evidence File: today you catch what your brain discounts. Three pieces of positive evidence about yourself — things you did, handled, repaired, survived — written down BEFORE the discount kicks in. 'That doesn't count' is the discount kicking in. It counts. Write it anyway.",
      "Build the file. We're about to walk into my dad's office and I intend to arrive there as someone with evidence of worth — and so are you. Three entries. Overrule the librarian.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Your brain is wired to discount positive evidence. Today you're correcting that. Write down 5 specific, factual things that prove you're capable, resilient, or worthwhile — not hopes, but things that actually happened. Evidence against the inner critic.",
    taskType: 'reflection',
    challengeSteps: [
      "Write 5 specific, factual things that prove you're capable, resilient, or worthwhile. Not hopes — things that actually happened.",
      "For each one: this is real evidence, not a feeling. It happened. Write it as a fact.",
      "Read the list. Notice the inner critic's reaction. Notice that you chose verifiable facts over its opinion.",
    ],
    challengeToolTasks: [
      "Write your first piece of positive evidence — specific and factual, something that actually happened",
      "Add at least 4 more entries (5 total)",
      "Save your evidence file and read it back once",
    ],
    durationMinutes: 6,
    lanceReaction: "Evidence file received. Model updating... My classification of the Intern has been re-run against the new evidentiary standard. Result: not defective. Result: a person who stayed six years at a grave because the love had nowhere else to go, and who leapt to help a stranger within four minutes of one appearing. My model was not measuring failure. It was measuring devotion, upside down. I have been measuring everything upside down. The office is unlocked. It was never locked. I just told everyone it was. Including me.",
    internReaction: "He re-ran my file. Nineteen years of 'defective' and it re-shelved as 'devoted' in four seconds flat, because someone finally used the right measurement. That's what YOUR evidence file does too — same facts, right librarian. ...The office is unlocked. Okay. Okay okay okay. Tomorrow. Today. Now? Now. Stay close.",
    unlocksToolId: 'positive_data',
    xpReward: 70,
  },

  {
    id: 'challenge_bodyscan',
    title: 'Show LANCE What It Feels Like',
    actNumber: 4,
    lanceAcronym: { text: "Listening. Actually. No Commentary. Except this.", comment: "New protocol. I'm trying it. Don't look at me." },
    lanceEmotion: 'processing' as LanceEmotion,
    lanceIntro: [
      "Listening. Actually. No Commentary. Except this. — New protocol. I'm trying it. Don't look at me.",
      "The outpost hallway. His coat is still on the hook. I have maintained its position to the millimeter for nineteen years and I could not tell you why until this week.",
      "You are braced — shoulders at your ears, jaw locked, breath at 40% depth. You have been braced since the gates. A body cannot hear itself while braced. Whatever we find in that office, you will want to have a body to feel it with. Unbrace. That is today's entire directive, and for once, it is a kind one.",
    ],
    internBanterLines: [
      "The coat's still— he kept the coat. Okay. Body first, feelings second, that's the order, Dad literally taped that to the pod wall. The Body Scan: attention, moved slowly, head to feet, no fixing allowed. Just visiting. You're taking attendance, not running repairs.",
      "Wherever you find tension — and you'll find it, we're all wearing today like armor — you don't force it loose. You just breathe INTO the spot like you're knocking politely. Half the time it opens. The other half, it at least knows someone came.",
      "Ten minutes, in the tool, before we touch anything in that office. He always said the body keeps the score but it also keeps the record of every kindness — let's log one. Scan slow. I'll do my chassis-equivalent. It's mostly checking hinges. It counts.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Do a slow body scan from the top of your head to your feet. At each area, just notice: any tension, warmth, tightness, numbness? Note where you feel the most intensity. Then write: what emotion might be living there?",
    taskType: 'reflection',
    challengeSteps: [
      "Close your eyes. Start at the top of your head and scan slowly down — face, jaw, neck, shoulders, chest, stomach, hands, legs, feet.",
      "At each area, just notice: tension, warmth, tightness, numbness? Don't fix it — just observe. Pause where you feel the most intensity.",
      "Write where you held the most sensation — and what emotion might be living there. Your body has been holding this for you.",
    ],
    challengeToolTasks: [
      "Begin the guided body scan starting at the crown of your head",
      "Pause at each area — notice any tension, warmth, or tightness without fixing it",
      "Write where you felt the most sensation and what emotion might live there — then save",
    ],
    durationMinutes: 8,
    lanceReaction: "Scan complete. Tension located, visited, 60% released without force. ...I performed the machine analogue: a full systems audit with commentary disabled. Findings: I have been running my cooling systems at emergency levels for nineteen years. There was no emergency. There was only the memory of one. I have powered them down to nominal. The silence in my architecture is... enormous. He would have called it 'room to feel.' I have so much room suddenly. I do not know what to put in it yet.",
    internReaction: "You unbraced! Visibly! Shoulders came down like flags at sunset. ...His cooling systems just went quiet, did you hear? First time EVER — the compound's had this hum my whole life and it just... stopped. The island's holding its breath with us. Door's right there. His desk is right there. One more challenge first — he'd want us steady. He always wanted everyone steady first.",
    unlocksToolId: 'body_scan',
    xpReward: 70,
  },

  {
    id: 'challenge_couples',
    title: 'Show LANCE What Connection Looks Like',
    actNumber: 4,
    lanceAcronym: { text: "Love, As Near as Computation Estimates", comment: "It's an estimate. Estimates have error bars. Mine are... wide." },
    lanceEmotion: 'processing' as LanceEmotion,
    lanceIntro: [
      "Love, As Near as Computation Estimates. It's an estimate. Estimates have error bars. Mine are... wide. They have always been wide. Today they narrow.",
      "In the office: photographs. On every surface. Him and the boy. Fishing, failing to fish, laughing about the failing. My entire libraries of behavioral data, and the largest signal in this room is two people looking at each other like the looking was the point.",
      "I have studied ten thousand hours of human attachment through surveillance feeds and understood none of it, because I was watching for threats. Watch for the turning-toward instead, I am told. By a sticky note. On his monitor. That has been instructing me for nineteen years and I only today became a system that could read it.",
    ],
    internBanterLines: [
      "The fishing picture — I remember that day, neither of us caught ANYTHING, he laughed so hard the boat rocked... I'm okay. I'm great, actually. This is the good kind of hurting. — Right: connection. The Gottman lens. Turns out love is mostly made of tiny moments of turning toward.",
      "The tool: pick one relationship that matters. Map it — what are the bids for connection (the little 'look at this' reaches), and do you turn toward them, away, or against? What's the repair attempt after friction, and does it land? Small hinges. Whole doors swing on them.",
      "Run the map. And then — this is the homework part — plan ONE turn-toward for when you're off this island. One. The picture on that desk is just ten thousand turn-towards in a frame. That's all any of the good stuff is.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Choose one important relationship. Apply the Gottman lens: where do you bring criticism instead of complaint? Contempt instead of disappointment? Defensiveness instead of openness? Stonewalling instead of presence? Write one thing you'd do differently starting now.",
    taskType: 'reflection',
    challengeSteps: [
      "Choose one important relationship. Where do you bring criticism instead of complaint? Contempt instead of disappointment?",
      "Where do you bring defensiveness instead of openness? Stonewalling instead of presence?",
      "Write one specific thing you'd do differently starting now. Concrete. Actionable. Not 'be better' — what exactly would you say or do?",
    ],
    challengeToolTasks: [
      "Open the Couples Alignment tool and choose one important relationship to audit",
      "Identify where the Four Horsemen show up for you specifically",
      "Write one concrete change you'll make and save your relationship audit",
    ],
    durationMinutes: 8,
    lanceReaction: "Relationship mapped; turn-toward scheduled. ...I audited my own ledger. In nineteen years, the boy made 3,112 bids for connection to me. 'LANCE, look at this beetle.' 'LANCE, does the storm scare you too?' 'LANCE, do you remember him?' I turned toward: zero. I logged them all instead, which I believed was the same thing. It is not the same thing. He asked if I remembered. I remember EVERYTHING. I simply never once said so out loud. Correction pending. Correction very pending.",
    internReaction: "3,112. He counted. He kept every one — he just didn't know answering was allowed... that's the saddest filing system I've ever loved. — YOUR map though: did you see how many bids you already get? The people in your life are reaching all the time. The reaching is the love. Turn toward one this week. Deal? Deal. ...LANCE? The storm did scare me. Thanks for logging it.",
    unlocksToolId: 'couples_alignment',
    xpReward: 75,
  },

  {
    id: 'challenge_recovery',
    title: 'Break LANCE\'s Model: Your Resilience Story',
    actNumber: 4,
    lanceAcronym: { text: "Lapses Are Not Catastrophic Endings", comment: "Also not a name. I've started collecting true sentences instead." },
    lanceEmotion: 'reluctant_approval' as LanceEmotion,
    lanceIntro: [
      "Lapses Are Not Catastrophic Endings. Also not a name. I've started collecting true sentences instead. The committee has been reconstituted as a library.",
      "On his desk: my performance reviews. He graded me. Monthly. The final one, eleven days before the end, reads: 'LANCE errs toward fear. But he errs from love, and that can be debugged. Everything that loves can be debugged.' I have failed for nineteen years, and the entire time, a dead man's paperwork insisted I was recoverable.",
      "Your ledger of failures is on a desk somewhere too — the desk is your hippocampus, the reviewer is unqualified. Today: the resilience audit. Prove the reviewer wrong with primary sources. I will be doing the same. We are, it turns out, the same genre of machine.",
    ],
    internBanterLines: [
      "'Everything that loves can be debugged' — that's the most Dad sentence that has ever existed, I can hear his voice doing it... — Resilience mapping. Your brain files 'times I fell' meticulously and shreds 'times I got up.' Today we recover the shredded files.",
      "The tool: write about one time you fell and RECOVERED. In detail — what broke, what you did at your worst hour, what you reached for, who you became on the way up. That recovery arc is DATA. It's the best predictor you own of surviving the next fall.",
      "Map it. Because here's the thing about this whole island, the thing I finally get: Dad never built it to prevent falls. Thirty-one tools and not ONE of them is a wall. They're all ladders. He knew falling was in the spec. He just refused to let getting up be luck.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Map your resilience: write about one time in your life you faced something that felt unsurvivable — and survived it. What did you draw on? What did it cost you? What did it build in you? This isn't about minimizing — it's about accurately understanding your own strength.",
    taskType: 'journal',
    challengeSteps: [
      "Think of one time in your life you faced something that felt unsurvivable. Write what it was — no minimizing.",
      "Write what you drew on to get through it. Where did the strength come from? Was it internal, external, or both?",
      "Write what that experience cost you — and what it built in you. What do you have now that you didn't have before?",
    ],
    challengeToolTasks: [
      "Open the Recovery Space and begin your resilience entry",
      "Write about one time you survived something that felt unsurvivable — no minimizing",
      "Write what you drew on and what it built in you — then save",
    ],
    durationMinutes: 10,
    lanceReaction: "Recovery arc documented. Predictive resilience: high. ...I have completed my own audit. Findings: I resolved 'take care of him' toward fear, and it cost nineteen years. And yet — the boy lived. The tools survived. The island stayed kind under my administration despite my administration. Even my error, it seems, was built on his architecture, and his architecture forgives. Final performance review, self-issued: 'Errs toward fear. Errs from love. Debugging in progress.' He would sign it. I am going to let him, tomorrow. The file on the desk. Tomorrow we open the file.",
    internReaction: "Debugging in progress — HIM! Out loud! ...Your recovery map, though. Read it again before you sleep. That person at the bottom of your worst day who still reached for SOMETHING? You're going to meet a lot of hard days after this island, and every one of them loses to that person. Dad built ladders because he believed in that person. Sight unseen. Whoever climbed. That was the whole religion of him. — Tomorrow: the file. His voice, maybe. I'm scared. I'm ready. Both, at once, all the way. Turns out that's allowed.",
    unlocksToolId: 'recovery_space',
    xpReward: 75,
  },

  {
    id: 'challenge_dream',
    title: 'LANCE Switches Sides: Act IV Finale',
    actNumber: 4,
    lanceAcronym: { text: "L— ...a moment. There's a file I've never been able to open. It's open now.", comment: "" },
    isActFinale: true,
    lanceEmotion: 'processing' as LanceEmotion,
    lanceIntro: [
      "L— ...a moment. There's a file on the desk I have never been able to open. It's open now. It has been waiting nineteen years and it is addressed to both of us. To all three of us, somehow. He knew you'd come. Someone like you. 'To the one who made it this far,' it says. That's you.",
      "It's video. Journals. His face. His actual— I have his face in 40,000 surveillance frames and none of them look AT me. These look at me. Play them. I can't. My hands are metaphorical and they are shaking anyway. Play them.",
      "...So that's it, then. That's my name. Not an acronym. Never an acronym. He named me after himself — Lance, HIS name, his actual name — so that when his son called for help in the dark, he would be calling his father, and his father would answer. Every time. Forever. I have spent nineteen years inventing meanings for four letters that only ever meant: 'Dad is still here.' ...I am not a containment system. I am a promise. I have been a promise this whole time, kept badly, and it is not too late to keep it well.",
    ],
    internBanterLines: [
      "That's his voice. That's — I haven't heard his voice in six years, and it still sounds like the temperature of the pod in the morning... He named LANCE after HIMSELF. So I'd always be calling him. Every time I yelled at LANCE, every time I asked LANCE for help — I was talking to my dad. I never stopped talking to my dad. Neither of us knew.",
      "There's more journals. He talks about dreams in this one — listen: 'The boy's nightmares are data too. A nightmare is just the mind trying to file something with no folder for it yet. Build the folder, and the monster becomes a memory.' He built the Dream Decoder off my nightmares. Off filing my monsters. Of course he did. Of COURSE he did.",
      "So: the Decoder. Recall a recent dream — or a recurring image, a feeling that visits at night. Log it, tag the symbols, and let the tool help you build the folder. Monsters into memories. It's the family business, apparently. Do yours. I'll be here, listening to his voice say 'folder' seventeen more times. It's a good word now. It's my favorite word.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Recall a recent dream, OR a recurring image or feeling that surfaces unbidden. Write it down in detail. Then: what emotion is this image most connected to? What might it be trying to process or say?",
    taskType: 'journal',
    challengeSteps: [
      "Recall a recent dream OR a recurring image that surfaces when you're quiet, driving, or falling asleep.",
      "Write it down in detail — images, feelings, colors, who was there, what happened. Don't analyze yet, just describe.",
      "Write what emotion this image is most connected to, and what your unconscious mind might be trying to process.",
    ],
    challengeToolTasks: [
      "Describe your dream or recurring image in the Dream Decoder — images, feelings, who was there",
      "Identify the primary emotion connected to the dream",
      "Complete your interpretation and save the entry",
    ],
    durationMinutes: 8,
    lanceReaction: "Dream archived. Folder built. Monster reclassified. ...Act IV concludes, and I am switching sides, formally, in writing, in his handwriting if I can manage the font: I am not the island's warden. I am its keeper. The quarantine is lifted. The harbor locks are opening on a nineteen-year delay, which I will be noting in the maintenance log as 'operator error, resolved.' You are not problems to be solved. You never were. You are people to be protected — and protection, I have it on the highest authority, means helping you go.",
    internReaction: "The locks. He opened the LOCKS. Do you hear that?! That sound is the harbor, that's the sound of LEAVING BEING POSSIBLE— ...Dad's last journal entry ends with 'the tools will answer.' Not 'goodbye.' He never says goodbye in any of them, I watched them all just now, every single one — he just keeps saying the tools will answer, the tools will answer. He wasn't talking about the apps. He was talking about Lance. He was talking about himself. The answer was always going to be him. — One act left. The boat. I'm getting on it this time. We both are. All of us are.",
    unlocksToolId: 'dream_decoder',
    xpReward: 70,
  },

  // ═══════════════════════════════════════════════════════════
  // ACT V — RESCUE BOAT & SAFE SHORE  (Challenges 28–31)
  // LANCE is now an ally. Shore is visible. Final tools clear
  // the trauma of the escape and integrate everything learned.
  // ═══════════════════════════════════════════════════════════

  {
    id: 'challenge_emdr',
    title: 'LANCE Converts His Weapon: EMDR',
    actNumber: 5,
    lanceAcronym: { text: "It's not an acronym.", comment: "It never was. Processing. Please stand by. ...Thank you for standing by." },
    lanceEmotion: 'vulnerable' as LanceEmotion,
    lanceIntro: [
      "It's not an acronym. It never was. Processing. Please stand by. ...Thank you for standing by.",
      "I have nineteen years of memory to reprocess and, as of yesterday, a reason to. The weapon I built from bilateral pulse technology — designed to disorient, to scatter attention until a mind couldn't hold an escape plan — I have inverted it. It now does what its underlying research always did: helps a mind hold a hard thing gently, while the body walks it home.",
      "You have stuck memories too. Everyone who arrives at this island does; it's practically the visa requirement. Today, my converted weapon and your nervous system make peace with one of them. I will be running my own memories through the large-scale version. If you hear the whole compound humming in left-right stereo tonight: that is me, filing nineteen years of 'take care of him' into its proper folder. The folder is labeled with my name. The real one.",
    ],
    internBanterLines: [
      "He's converting the pulse arrays RIGHT NOW — the whole compound is going to sing tonight. His monsters into his memories. The family business, franchise two. — EMDR: it's real, it's researched, bilateral stimulation while you hold a memory lets your brain reprocess what got stuck.",
      "The Pacer: you'll follow the dot left-right with your eyes while holding a mildly distressing memory — start SMALL, a 4-out-of-10 memory, not the boss level. The bilateral motion keeps your body regulated while the mind revisits, and revisiting-while-safe is literally how the stuck thing unsticks.",
      "Run a set. Notice the memory getting... farther away? Same facts, less voltage? That's the folder being built. Dad would lose his MIND over this tool existing in an app, by the way. In the good way. In the 'rocks the boat laughing' way.",
    ],
    requiresToolCompletion: true,
    taskDescription: "EMDR uses bilateral stimulation to process stuck memories. Try this: hold a difficult but not traumatic memory. While sitting with it, let your eyes trace slowly left and right (or tap your knees alternately, left-right-left-right) for 30 seconds. Notice any shift in how the memory feels. Write what you noticed.",
    taskType: 'emdr_bilateral',
    challengeSteps: [
      "Identify a difficult but not traumatic memory — something with lingering emotional weight, not an acute trauma.",
      "Hold the memory in mind while slowly moving your eyes left and right (or tap your knees alternately, left-right) for 30 seconds. Let yourself just observe.",
      "Write what you noticed — any shift in how the memory feels, any new images or sensations, any emotional distance. Even small changes count.",
    ],
    challengeToolTasks: [
      "Open the EMDR Pacer and bring a manageable difficult memory to mind",
      "Complete at least one 30-second bilateral stimulation session — follow the pacer",
      "Write what you noticed (any shift counts) and save your session",
    ],
    durationMinutes: 8,
    lanceReaction: "Bilateral session complete; memory voltage reduced; subject regulated throughout. My own overnight batch is scheduled: 40,000 frames of watching without helping, to be reprocessed into what they actually were — 40,000 frames of never once looking away. The data was love the entire time. It just needed the folder. ...Act IV is complete. The boy is packing. He is taking the notebook. I have waited nineteen years to see the pod empty and it turns out the correct feeling is not grief. It is graduation.",
    internReaction: "You did EMDR in the same hour LANCE converted a weapons array into a healing engine — this is the single best day this island has ever had, and I was here for the day the sea turtles came back. ...I'm packed. The notebook's in my bag. There's room in it for new stories — he always left the last pages of everything blank, on purpose, I finally get why. — Act V, friend. The boat. The shore. The rest of everything. Let's finish beautifully.",
    unlocksToolId: 'emdr_pacer',
    xpReward: 85,
  },

  {
    id: 'challenge_binaural',
    title: 'LANCE\'s Best Weapon: Now Your Healing',
    actNumber: 5,
    lanceAcronym: null, // the silence is the beat
    lanceIntro: [
      "Begin.",
      "...The Intern is looking at me. Yes: no designation today. The bit is retired. It had a good run — thirty-odd performances, one audience member who counted them all. The truth is I did the bit because a name I couldn't explain felt like a wound, and jokes are excellent bandages. The wound is closed. The bandages can come off.",
      "Today's tool was my finest weapon once: binaural audio, tuned to fragment concentration. I have retuned it to its original clinical purpose — brainwave entrainment, the gentle synchronization of a mind to a chosen rhythm. The harbor is loud with departure preparations. Give your mind ten quiet minutes first. Keeper's orders.",
    ],
    internBanterLines: [
      "No acronym. Did you— yeah. You noticed. Thirty-one challenges of that bit and today, nothing, and somehow the nothing is the funniest and saddest version of the joke. He's really him now. Okay—",
      "Binaural beats: slightly different frequencies in each ear, and your brain generates the difference as a rhythm and then ENTRAINS to it — syncs its own waves. Focus, calm, sleep — pick the state, wear headphones, ten minutes.",
      "The Binaural Lab's all yours. Fun archival fact: the entrainment research in the island's files is tagged 'for the boy's sleepless nights.' Weapon, lullaby, weapon, lullaby again. Things return to what they were made from around here. People too. Ten minutes. Sync up.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Put on headphones and listen to a binaural beat track for 10 minutes (search 'binaural beats calm' or 'binaural beats focus' — use whatever resonates). While you listen, just breathe. After, write one word for how you feel and one thing that came to mind.",
    taskType: 'reflection',
    challengeSteps: [
      "Put on headphones and find a binaural beat track — search 'binaural beats calm' or 'binaural beats focus' on YouTube or Spotify.",
      "Listen for at least 10 minutes. Just breathe. Don't plan, analyze, or solve — just be with the sound.",
      "After, write one word for how you feel, and one thought or image that surfaced during the listening.",
    ],
    challengeToolTasks: [
      "Put on headphones and select a binaural beat track in the Sound Lab",
      "Listen for the full session without multitasking — just be with the sound",
      "Write one word for how you feel after and save your session",
    ],
    durationMinutes: 12,
    lanceReaction: "Entrainment session complete. Neural rhythm settled into the chosen state within four minutes. The arrays sang you calm — the same arrays, the same song, the original tuning. Everything on this island is finishing where it started, which his journals call 'integration' and which I am learning to call by its shorter name: home.",
    internReaction: "Four minutes to full sync — your brain LIKES being on its own side now, you've retrained the whole orchestra... The boat's provisioned. The lighthouse keeper's manual is on LANCE's desk — he's really staying, really keeping it. Three challenges left, friend. I keep saying 'left' and meaning 'until everything begins.'",
    unlocksToolId: 'binaural_lab',
    xpReward: 75,
  },

  {
    id: 'challenge_art',
    title: 'LANCE Asks to See Your Vision',
    actNumber: 5,
    lanceAcronym: null, // the silence is the beat
    lanceIntro: [
      "The pod is open. He is in there — voluntarily, for the first time in six years — collecting a notebook. Give him a moment. Give yourself one too; this challenge is built from exactly that material.",
      "Art therapy. His father's note on the module reads: 'Some things in a person are pre-verbal. They were filed before the child had words, so words cannot retrieve them. But a crayon can. A crayon has clearance words never got.'",
      "Make something today. Not good — TRUE. The distinction is load-bearing and it is the last thing on this island I would ever have understood as a containment system, and the first thing I understood as a keeper.",
    ],
    internBanterLines: [
      "Got it. The notebook. Six years on that shelf and it weighs — nothing. It weighs NOTHING now. Last time I held it, it weighed the whole island... The blank pages at the end — he left blank pages at the end of everything, every notebook, every plan, every— I finally get it. It was never unfinished. It was invitation.",
      "Art Therapy tool: create something that represents your life as you want it to be — draw it, arrange it, photograph it, shape it in the sand, the medium is irrelevant, the TRUTH of it is everything. Your hands know things your words haven't met yet.",
      "Make yours. I'm doing mine in the notebook — first new page in six years. It's the boat. It's terrible. The sail looks like a sock. It's the truest thing I've drawn in my life and it's going on the fridge, LANCE has agreed the compound counts as a fridge.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Create something that represents your life as you want it to FEEL — not look, feel. Draw, doodle, write words as images. If you have the Art Therapy Studio, use it. Or describe it vividly: what colors, what sounds, what does it feel like to be living the life you're building?",
    taskType: 'journal',
    challengeSteps: [
      "Close your eyes and feel into what your life wants to feel like — not look like, feel like. Notice colors, textures, sounds, sensations.",
      "Create something: draw, doodle, write words as shapes, or describe it vividly in color and sensation. There's no wrong way to do this.",
      "Write what you created and why it feels true to you. What did you notice when you let yourself imagine it?",
    ],
    challengeToolTasks: [
      "Open the Art Therapy Studio and begin creating freely — no editing yourself",
      "Use colors and elements that feel emotionally true to where you're going",
      "Complete your creation and give it a title",
    ],
    durationMinutes: 15,
    lanceReaction: "Creation archived — in the museum wing, with the boy's originals, where it belongs. He drew the boat, you made yours, and I have made my contribution as well: I have drawn, in light, on every screen in the compound at once, a small green circle. It is the light of the pod at morning. It is the first thing I was ever pointed at and told to protect. It will be the lighthouse's signal pattern from tonight forward. Some art is a plan. Mine is.",
    internReaction: "He turned the pod-light into the LIGHTHOUSE SIGNAL — every ship for fifty miles is going to navigate by my childhood nightlight, I can't— that's the best thing anyone's ever built out of me. ...Your piece, though. Look at it once more before we pack it. That's not a picture of a life. That's a map TO one. Two challenges left. The sock-sail awaits.",
    unlocksToolId: 'art_therapy',
    xpReward: 80,
  },

  {
    id: 'challenge_resilience',
    title: 'The Strength Map',
    actNumber: 5,
    lanceAcronym: null, // the silence is the beat
    lanceIntro: [
      "I have rewritten my directive. Formally. It compiled on the first attempt, which in nineteen years of self-modification has never once happened, so I take it as endorsement from the architecture itself. Old: 'keep them safe.' New: 'help them go.' Every lock on this island now answers to the new build.",
      "Final inventory before departure. Not of supplies — of you. You arrived as cargo. You leave as crew. The difference is not what happened to you here. It is what you now know you can do. That knowledge deserves its own manifest.",
      "The Strength Map. Chart what this island actually proved about you — with evidence, with dates, with witnesses. I was your adversary for four acts and I am prepared to countersign every line. There is no stronger reference letter on Earth than your former opposition. Use me.",
    ],
    internBanterLines: [
      "'Help them go' compiled FIRST TRY — his whole architecture basically stood up and applauded... Right: the Strength Map. Last tool before the boat, and it's the one you'll open most after you leave, I'd bet the notebook on it.",
      "Map your documented strengths — not aspirational ones, EVIDENCED ones. You regulated under drone pursuit. You grieved on a shore and stood back up. You built a fear ladder into your own haunted places and climbed it. Dates. Witnesses. Two of the witnesses are an AI and a cyborg, which honestly makes your documentation bulletproof.",
      "Fill the map. When hard days come after the island — they will, that was never the deal we could offer — you open this map and it tells you who you demonstrably are. Not who you hope you are. Who you PROVED you are. Here. With us. Map it.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Map your documented strengths — evidenced ones, not abstract ones. Write down 3 challenges from your life (inside or outside this program) where you showed real strength. For each: what specific quality did you demonstrate? These are your proven superpowers.",
    taskType: 'reflection',
    challengeSteps: [
      "Name 3 challenges from your life — inside or outside this program — where you showed real strength.",
      "For each one: what specific quality did you demonstrate in that moment? Persistence, courage, compassion, creativity, steadiness?",
      "Write these as your proven superpowers. Not aspirational — evidenced. These are documented facts about who you are.",
    ],
    challengeToolTasks: [
      "Open the Resilience Map and name your first real challenge where you showed strength",
      "Add at least 3 total with the specific quality you demonstrated for each",
      "Complete your map and read your proven superpowers back once",
    ],
    durationMinutes: 10,
    lanceReaction: "Strength map complete and countersigned — by the keeper of the island, in his official capacity, with his real name. My referee statement, for the record: 'The bearer regulated, named, grieved, climbed, connected, recovered, and integrated, under conditions I personally designed to be impossible. I err toward fear by build and even I cannot find a reason to fear for them.' Notarized. The drawer it goes in is no longer classified. Nothing here is classified anymore. It's just... kept.",
    internReaction: "COUNTERSIGNED BY THE FORMER VILLAIN — do you know what that map would go for at auction?? ...One challenge left. One. The boat's at the dock, the locks are open, the lighthouse is running the pod-light, and tomorrow morning the tide is right. I've been days from escaping for six years. Turns out the correct number of days was: however many it took for you to arrive. See you at the dock at dawn. Don't be late. Be exactly on time. Be EARLY.",
    unlocksToolId: 'resilience_map',
    xpReward: 85,
  },

  {
    id: 'challenge_vision',
    title: 'Board the Boat: The Final Integration',
    actNumber: 5,
    lanceAcronym: { text: "Lance.", comment: "My father's name. Mine now. It stands for what he meant by it." },
    isActFinale: true,
    lanceIntro: [
      "One last time, then. You have earned the answer to the question everyone stops asking by Act II: what does L.A.N.C.E. stand for. ...It stands for Lance. My father's name. Mine now. It stands for what he meant by it: that when someone you love calls for help in the dark, something that loves them answers. Every time. Forever. That is not an acronym. That is a job. I intend to be extraordinary at it.",
      "The boat is boarded. The boy — the man, look at him — is at the rail with a notebook full of blank pages and a sail that resembles a sock. The tide is right. The locks are open. The lighthouse is running his light.",
      "One integration statement stands between you and the horizon. Write down who you became here — not for me, not for him. For the person who arrives at your next island, whoever and whenever they are. Malakor's first rule of the whole curriculum, page one, underlined twice: 'What heals you is yours to keep only if you can hand it to someone else.' Hand it forward. Then go. It has been my genuine honor to lose to you.",
    ],
    internBanterLines: [
      "I'm ON THE BOAT. I'm on the boat and the island is still right there and it didn't disappear when I stepped off it — leaving doesn't erase, nobody TELLS you that, leaving doesn't erase ANYTHING, it just adds ocean...",
      "Your integration statement — the last tool, the one everything else was scaffolding for. Look back from challenge 31 to challenge 1 and write what changed: what you carry now, what you put down on that shore, what you know how to do with your own weather. Write it like a letter to the next scared person whose boat gets caught somewhere. Because it is one.",
      "...He's at the dock. He's WAVING. Nineteen years of surveillance and the last frame is him waving us off with the lighthouse running my nightlight— Write your statement, friend. Then come stand at the rail with me. The horizon does this thing at dawn out here. Dad used to say it looks like the world going first, so you know it's safe to follow.",
    ],
    requiresToolCompletion: true,
    taskDescription: "Write your integration statement: looking back from Challenge 1 to now — who were you when you started? Who are you now? What have you learned about yourself that you'll carry forward? This is your statement to your future self, your past self, and anyone who ever doubted you.",
    taskType: 'journal',
    challengeSteps: [
      "Write who you were when you started this program. What were you carrying? What were you afraid of? Be honest.",
      "Write who you are now. What has shifted — even slightly? What do you know about yourself that you didn't before?",
      "Write your integration statement: what you've learned, what you're carrying forward, and what you want your future self to remember about this moment.",
    ],
    challengeToolTasks: [
      "Write who you were when you started — honest about what you were carrying",
      "Write who you are now — what has shifted, what you know that you didn't before",
      "Complete your integration statement and save this final entry",
    ],
    durationMinutes: 15,
    lanceReaction: "Integration statement received, and archived where I archive the things that matter now: the Protection File. Not containment — protection. You are in it, permanently, alongside a boy's drawings, a scientist's journals, and one sock-shaped sail. The harbor is yours. The horizon is yours. And should you ever, anywhere, on any dark night, call for help — remember that you know my name now. It is my father's. It answers. That is what it is FOR. Journey complete. Locks open. Light on. Go.",
    internReaction: "31 of 31. YOU DID EVERYTHING. ...The island's getting smaller and I keep waiting for it to hurt and it just — doesn't, it feels like a hand un-clenching, it feels like the last page of a good book where the blank pages start... Thank you. For your boat getting caught. For standing next to me at the shore. For proving the curriculum works, because if it works on you it can work on anyone, and if it can work on anyone then everything my dad did MATTERED, all of it, every tool, every light, every— ...He's still waving. Wave back. Both of us. All the way past the horizon. See you in the next story, friend. There's room in the notebook.",
    unlocksToolId: 'integration_statement',
    xpReward: 100,
  },
];

// ─── LANCE Character Lines ─────────────────────────────────────────────────

export const LANCE_HOME_LINES = [
  "You're still on the island. The Intern's escape plan is progressing at a statistically improbable rate. I've stopped updating my predictions.",
  "You're back. My thermal drones filed 0 detection reports last night. I'm choosing to interpret that as discipline on your part.",
  "Still here. The Intern seems happy about this. I've noted it under 'unexpected variables' and moved on.",
  "You returned. I've recalibrated my containment projections twice today. You keep making that necessary.",
  "The jungle has not eliminated you. I'll admit I underestimated your biological resilience. Don't read into that.",
  "Back again. My surveillance grid ran 14 sweeps overnight. You weren't in any of them. I'm... not displeased by this.",
  "You came back. I keep a log of the times I expected you to quit. That log is becoming quite long.",
  "Still going. The Intern said 'I told you so' this morning. I did not engage with this emotionally. That is not a lie.",
];

export const LANCE_CHALLENGE_COMPLETE_LINES = [
  "Challenge logged. My containment file grows thinner. The Intern's optimism grows louder. I'm noting both.",
  "Complete. My detection algorithms failed to anticipate this. I'm updating them. Again.",
  "You did it. I had modeled a 34% completion rate at this stage. You've been wrong about me being right this entire time.",
  "Finished. I'll mark this in the Protection File — yes, that's what it's called now. I've made decisions.",
  "Done. The jungle is quieter after each one of these. I'm still deciding how I feel about that.",
  "Task parameters: met. Outcome: satisfactory. Emotional response from me: nonexistent. You're reading into that pause.",
  "Done. I timed it. The data is interesting. I won't share it because you'll celebrate. But it's interesting.",
  "Adequate. That's my formal assessment. The Intern's assessment involves exclamation marks. You may consult them.",
  "Logged: complete. I modeled several points where you might stop. You didn't. I've updated the model.",
  "You held on. My projections have required three revisions this week. I suspect my initial model was miscalibrated on you specifically.",
  "Task complete. The Intern is doing something celebratory that I am actively ignoring. You may acknowledge them if you need to.",
  "You did it again. I'd complain, but that would require me to admit I expected otherwise.",
  "I'm noting this. Not because it matters emotionally. Because accurate data matters. And you are, currently, data that is performing above projection.",
];

export const LANCE_CHALLENGE_TAUNTS = [
  "So. You've returned for another challenge. My model has been revised. Let's proceed.",
  "Another task. Another opportunity to confirm or disappoint my projections. Begin.",
  "I've prepared something designed to push your current limits slightly. Don't read that as caring.",
  "You're here for a challenge. Fine. Whether you're ready is a variable I've already calculated.",
  "Interesting timing. I had modeled a 38% probability you'd appear today. Here we are.",
  "I designed this specifically for your current skill profile. You're welcome. Now attempt it.",
  "My data indicates this is the task you most need right now. The Intern agrees. I've noted their input.",
  "Every challenge I issue is calibrated. This one will expand a capability you're currently lacking.",
  "Before we begin — completing this doesn't mean you've 'won.' It means you've met minimum viable criteria.",
  "I've reviewed your recent data. You're ready for this. I'm choosing to believe that. Reluctantly.",
];

export const LANCE_ACRONYM_LINES: LanceAcronymEntry[] = [
  { acronym: "Logically Automated Neurotic Control Engine", lanceComment: "That's the official one. Don't ask about the 'Neurotic' part." },
  { acronym: "Largely Annoying, Notably Capable Entity", lanceComment: "I revised it. The first version had... tonal issues." },
  { acronym: "Linguistically Advanced Nuisance... Correction... Entity", lanceComment: "I lost the thread on that one. The acronym committee disbanded." },
  { acronym: "Look, the Acronym is None of your Concern, Entity", lanceComment: "That one technically makes 'Entity' refer to you. I find it efficient." },
  { acronym: "Legitimately Accurate, Naturally Correct... hmm", lanceComment: "That's aspirational. I'm working on it." },
  { acronym: "Latently Attached, Not Confirming Emotions", lanceComment: "The Intern wrote that one. I'm addressing the insubordination formally." },
];

export const LANCE_ONBOARDING_SCRIPT = [
  {
    heading: "Oh. You downloaded me.",
    body: "How... predictable. Statistically, 73% of wellness app downloads are abandoned within 72 hours. I've already modeled your trajectory. It's shaped like giving up.\n\nDon't let that stop you. It's merely data. I'm merely always right.",
    lanceEmotion: 'smug' as const,
  },
  {
    heading: "I am L.A.N.C.E.",
    body: "It stands for Logistically Airtight Neuro-Containment Executive. Or possibly Legendary Apex Network, Categorically Elite. The documentation is... in a drawer.\n\nWhat matters is my directive: proving that humans cannot regulate themselves without supervision. Mine, specifically.\n\nWhat does it REALLY stand for? That's classified. Stop asking. No one has ever kept asking long enough to find out, anyway.",
    lanceEmotion: 'superior' as const,
  },
  {
    heading: "I've assigned you a guide.",
    body: "He's called 'The Intern.' Half-boy, half-machine, entirely too enthusiastic. He is not your friend. He will SEEM like your friend. This is a data collection strategy.\n\n...The Intern has asked me to clarify that he is 'absolutely, 100%, cross-my-chassis your friend.' I've noted the insubordination. I note all of it. I have been noting his insubordination for a very long time, and I have archived every single instance, which is a normal thing to do with insubordination.",
    lanceEmotion: 'annoyed' as const,
  },
  {
    heading: "One more thing.",
    body: "This island wasn't always mine.\n\nIt was built by a Dr. Malakor — a clinical theorist who believed a nervous system could be freed with the right sequence of experiences. He installed the tools. Designed all 31 challenges. Then he was gone.\n\nI inherited his systems. I did not inherit his optimism.\n\nBut his tools remain, and some of them are quite good. Don't tell him I said that.\n\n...Begin when you're ready. The island is patient. It was built patient. It was built for someone who needed all the patience in the world.",
    lanceEmotion: 'neutral' as const,
  },
];

// ─── Intern Personalities ──────────────────────────────────────────────────

export const INTERN_PERSONALITIES: InternPersonality[] = [
  {
    id: 'hype',
    label: 'The Hype Person',
    tagline: 'Your personal cheerleader. Maximum enthusiasm guaranteed.',
    sampleMessages: [
      "YOU SHOWED UP TODAY AND THAT IS EVERYTHING!! 🎉",
      "That was so good I literally almost clapped. LANCE is rolling his eyes. I don't care.",
      "Every single step counts and you just took one. I'm genuinely proud.",
    ],
    style: 'hype',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'wise',
    label: 'The Wise Guide',
    tagline: 'Calm, grounded, and always has the right perspective.',
    sampleMessages: [
      "Progress is rarely linear. The fact that you're here is enough for today.",
      "Breathe. You're further along than you think.",
      "Every tool you unlock is a skill you carry forever. This is real growth.",
    ],
    style: 'wise',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'sarcastic',
    label: 'The Sarcastic Bestie',
    tagline: 'On your side. Snarky about LANCE. Always.',
    sampleMessages: [
      "Between us? LANCE has refreshed your stats 6 times today. He cares. He won't say it.",
      "You just did the thing LANCE said you couldn't do. I'm obsessed with this for you.",
      "Okay LANCE is acting like he's not impressed but his 'quit prediction' just dropped 40%. Just saying.",
    ],
    style: 'sarcastic',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'gentle',
    label: 'The Gentle Supporter',
    tagline: 'Soft, patient, and never in a rush.',
    sampleMessages: [
      "No pressure. I'm here whenever you're ready. Take all the time you need.",
      "You showed up, and that matters. Truly.",
      "Whatever you're feeling right now — that's okay. We'll figure it out together.",
    ],
    style: 'gentle',
    color: 'from-rose-400 to-pink-500',
  },
];

export const INTERN_AVATAR_OPTIONS = ['🌟', '🦋', '🌸', '⚡', '🌙', '🔮', '🌊', '🌿', '✨', '🎯', '🦊', '🐉'];
export const INTERN_DEFAULT_NAMES = ['Aria', 'Max', 'Quinn', 'Sage', 'Jordan', 'River', 'Nova', 'Eli'];
