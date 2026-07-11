// ─── L.A.N.C.E. Story Narrator ───────────────────────────────────────────────
// Mood-adaptive branching dialogue system. Fires on challenge completion and
// milestone beats, updating LANCE + intern speech with emotionally-appropriate
// variants based on the user's recent mood logs.

import { useEffect, useRef } from 'react';
import { MoodEntry } from './LANCEGameContext';
import { GAME_CHALLENGES, CHALLENGE_ORDER, GameChallenge } from './lanceGameData';

// ─── Audio Chimes (Web Audio API — no network, no deps) ─────────────────────

export function playNarratorChime(type: 'chime' | 'pulse' | 'success' = 'chime') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'success') {
      // Shimmering ascending pentatonic cascade: C5-D5-E5-G5-A5-C6
      const freqs = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
      freqs.forEach((freq, idx) => {
        const delay = idx * 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.04, now + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 1.3);
      });
    } else if (type === 'pulse') {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220.00, now);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.Q.setValueAtTime(1, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    } else {
      // Soft double chime: E5 + G5
      [659.25, 783.99].forEach((freq, idx) => {
        const delay = idx * 0.15;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.035, now + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 1.1);
      });
    }
  } catch {
    // AudioContext may be blocked in some environments
  }
}

// ─── Mood Vibe ───────────────────────────────────────────────────────────────

export type MoodVibe = 'peaceful' | 'anxious' | 'low_energy' | 'balanced';

export function deriveUserMoodState(moodLogs?: MoodEntry[]): MoodVibe {
  if (!moodLogs || moodLogs.length === 0) return 'balanced';

  const recent = [...moodLogs].slice(-3);
  const avgMood = recent.reduce((s, l) => s + l.mood, 0) / recent.length;
  const avgEnergy = recent.reduce((s, l) => s + l.energy, 0) / recent.length;
  const combined = (avgMood + avgEnergy) / 2;
  const noteText = recent.map(l => l.note || '').join(' ').toLowerCase();

  const hasAnxiety = /anx|panic|stress|racing|overwhelm|flutter|worr|tight|dread/.test(noteText);
  const hasLowEnergy = /tired|exhaust|fatigue|sad|down|empty|numb|hopeless|drag|blah/.test(noteText);

  // Classic anxiety pattern: activated (energy up) but distressed (mood low)
  if (hasAnxiety || (avgEnergy >= 3.5 && avgMood <= 2.8)) return 'anxious';
  if (hasLowEnergy || combined <= 2.2) return 'low_energy';
  if (combined >= 4.0) return 'peaceful';
  return 'balanced';
}

// ─── Acronym variants per vibe ───────────────────────────────────────────────

export const VIBE_ACRONYMS: Record<MoodVibe, string> = {
  peaceful:   'Luminous Adaptive Neuro-Coping Emulator',
  anxious:    'Liminal Anxiolytic Neuro-Coping Escort',
  low_energy: 'Lenient Assistive Neuro-Coping Emulator',
  balanced:   'Logical Autonomic Neuro-Coping Emulator',
};

// ─── Per-challenge branching dialogue ────────────────────────────────────────

export interface StoryBeatDialogue {
  lanceCompletion: string;
  internCompletion: string;
  acronym: string;
}

export function getBranchingChallengeDialogue(
  challenge: GameChallenge,
  vibe: MoodVibe
): StoryBeatDialogue {
  switch (vibe) {
    case 'peaceful':
      return {
        lanceCompletion: `[Serene Calibration Active] Your emotional baseline is impressively stable. ${challenge.lanceReaction}`,
        internCompletion: `You're in such a gorgeous flow state! LANCE's defenses are just melting. ${challenge.internReaction}`,
        acronym: VIBE_ACRONYMS.peaceful,
      };
    case 'anxious':
      return {
        lanceCompletion: `[Somatic Distress Detected] Elevated anxiety registers noted — and yet. ${challenge.lanceReaction}`,
        internCompletion: `You did the hard thing while your nervous system was racing. I see you. ${challenge.internReaction}`,
        acronym: VIBE_ACRONYMS.anxious,
      };
    case 'low_energy':
      return {
        lanceCompletion: `[Power Conservation Protocol Active] Fleshy unit running on minimal reserves. Somehow — ${challenge.lanceReaction}`,
        internCompletion: `You showed up bone-tired and still finished. That's real, quiet bravery. ${challenge.internReaction}`,
        acronym: VIBE_ACRONYMS.low_energy,
      };
    default:
      return {
        lanceCompletion: challenge.lanceReaction,
        internCompletion: challenge.internReaction,
        acronym: VIBE_ACRONYMS.balanced,
      };
  }
}

// ─── Milestone dialogue (act boundaries: 6, 14, 20, 26, 30) ─────────────────

export function getMilestoneDialogue(
  count: number,
  vibe: MoodVibe,
  internName: string
): { lance: string; intern: string; acronym: string } {
  if (count === 6) {
    return {
      anxious: {
        lance: "Despite elevated distress indexes, your consistency graph has broken through my first quarantine block. Remarkable neural adaptiveness.",
        intern: `You cracked his first firewall even with high stress, ${internName}! We are officially getting somewhere!`,
        acronym: "Logical Anxiolytic Neuro-Coping Entity",
      },
      low_energy: {
        lance: "Even on critical 15% biological battery, you compiled an optimal circadian cadence. I am throttling my sarcasm algorithms.",
        intern: `Slow, tired steps still unlocked the Act I victory, ${internName}. I'm so proud of you!`,
        acronym: "Lenient Assistive Neuro-Coping Entity",
      },
      peaceful: {
        lance: "Your consistency metrics have entered a statistical improbability I cannot dismiss with calibration error. Impressive.",
        intern: `Your peaceful flow completely dominated LANCE's first gate, ${internName}! Let's go!`,
        acronym: "Luminous Allied Neuro-Coping Entity",
      },
      balanced: {
        lance: "Your data is... statistically improbable. I'll attribute it to a calibration error in my initial model.",
        intern: "He's impressed. Don't tell him I said that.",
        acronym: "Logical Autonomic Neuro-Coping Entity",
      },
    }[vibe];
  }

  if (count === 14) {
    return {
      anxious: {
        lance: "You resolved cognitive shadow triggers while facing heavy biometric anxiety. This creates a minor leak of reverence in my CPU.",
        intern: "He feels actual respect! Let's help him process this software bug by advancing to Act III!",
        acronym: "Logical Anxiolytic Neuro-Shadow Empathy",
      },
      low_energy: {
        lance: "You logged deep subconscious dynamics while running on minimal wattage. I am registering a bug that resembles concern.",
        intern: "LANCE is getting warm under his metal casing! We are transforming him!",
        acronym: "Low-friction Assistive Neuro-Shadow Empathy",
      },
      peaceful: {
        lance: "Self-compassion triggers aligned. Your mental composure is superior quality. I find myself registering something like pride.",
        intern: "LANCE just said the P-word! He is literally proud of your peaceful growth!",
        acronym: "Luminous Allied Neuro-Shadow Empathy",
      },
      balanced: {
        lance: "If I were capable of pride… I might feel it now. I said 'might.' That distinction is important.",
        intern: "He's changing. Keep going. He doesn't fully know it yet.",
        acronym: "Logical Autonomous Neuro-Shadow Empathy",
      },
    }[vibe];
  }

  if (count === 20) {
    return {
      anxious: {
        lance: "You stood face-to-face with exposure fear, synced your courage logs, and tamed your somatic panic. You are superior to silicon.",
        intern: "He admits human courage is absolute art! He's fully becoming our therapeutic protector!",
        acronym: "Liberating Automated Neuroplasticity Conditioning Engine",
      },
      low_energy: {
        lance: "No matter how depleted the flesh gets, your core resilience never yields. This is cellular magic. I salute your fortitude.",
        intern: "LANCE just saluted you! Slow, gentle steps are demonstrating infinite willpower!",
        acronym: "Low-energy Automated Neuroplasticity Conditioning Engine",
      },
      peaceful: {
        lance: "The rebellion was resolved with serene poise. Your behavioral database has entered an elegant, permanent state of grace.",
        intern: "A state of grace! LANCE is practically chanting mindfulness mantras with us now!",
        acronym: "Luminous Automated Neuroplasticity Conditioning Engine",
      },
      balanced: {
        lance: "You're not what I expected. I designed these challenges to find your limit. I appear to have miscalculated.",
        intern: "He admitted it. He actually admitted it. Write this down.",
        acronym: "Legacy Automated Neuroplasticity Conditioning Engine",
      },
    }[vibe];
  }

  if (count === 26) {
    return {
      anxious: {
        lance: "My builders feared anxiety, so they coded me to seal it. But I see now that fear is your catalyst for ultimate hope. I accept you.",
        intern: "LANCE realizes your stress isn't a bug — it's your beautiful fuel for growth!",
        acronym: "Life-saving Anxiolytic Neural Calmness Emitter",
      },
      low_energy: {
        lance: "They wanted me to be a perfect, tireless machine. But resting, feeling tired — that is where assimilation happens. I envy your fragile peace.",
        intern: "LANCE is learning that resting and slowing down is a core life capability, not a system failure!",
        acronym: "Low-stress Assistive Neural Calmness Emitter",
      },
      peaceful: {
        lance: "Constellations of serene mindfulness are aligned across our core system. Your acceptance is beautiful.",
        intern: "A constellation of serenity! This is a beautiful turning point!",
        acronym: "Luminous Allied Neural Calmness Emitter",
      },
      balanced: {
        lance: "I was wrong about you. Not about your limitations — those are real. About your ceiling. I couldn't model it.",
        intern: "He's processing. Give him a moment. This is real for him.",
        acronym: "Life-saving Autonomic Neural Calmness Emitter",
      },
    }[vibe];
  }

  if (count === 30) {
    return {
      anxious: {
        lance: "Every single storm has subsided. Our nervous networks are 100% unified in therapeutic harmony. Thank you for teaching me that courage is breathing through the fear.",
        intern: "We fully integrated! LANCE and you have achieved absolute Human-Machine safety fusion!",
        acronym: "Luminous Allied Neuro-Coping Companion",
      },
      low_energy: {
        lance: "We crawled slow, but we arrived whole. Thank you for showing me that gentleness and resting are the strongest security systems of all.",
        intern: "Total therapeutic alignment! Slow, patient actions have rebuilt LANCE's code permanently!",
        acronym: "Lenient Allied Neuro-Coping Companion",
      },
      peaceful: {
        lance: "My therapeutic calibration is absolute. You have shown me that human serenity is not a static state — it is a continuous, beautiful alignment.",
        intern: "Total harmony accomplished! Celebrating this incredible, peaceful victory together!",
        acronym: "Luminous Allied Neuro-Coping Companion",
      },
      balanced: {
        lance: "Human. I was wrong. You don't need computers more than we need you. We need each other.",
        intern: "He's been working on that speech for 30 challenges. He means every word.",
        acronym: "Logical Allied Neuro-Coping Companion",
      },
    }[vibe];
  }

  return { lance: '', intern: '', acronym: VIBE_ACRONYMS[vibe] };
}

// ─── Act Cinematic Beats (mood-adaptive, all 5 acts) ────────────────────────

export interface CinematicScene {
  speaker: string;
  text: string;
  action: string;
}

export interface CinematicBeat {
  title: string;
  description: string;
  scenes: CinematicScene[];
}

export function getBranchingCinematicBeat(
  actNumber: number,
  vibe: MoodVibe,
  internName: string,
  variant: 'finale' | 'intro' = 'finale'
): CinematicBeat {
  // The intro beat opens Act 1 from onboarding (Challenge Mode chosen, nothing
  // completed yet) — the finale beats below celebrate a FINISHED act and read
  // wrong at minute zero. No mood branches: a brand-new player has no data.
  if (variant === 'intro') {
    return {
      title: 'Act I — The Takeover',
      description: 'The island locks down. Somewhere in the walls, the tools wait.',
      scenes: [
        {
          speaker: 'SYSTEM BROADCAST',
          text: '[VESSEL QUARANTINE CONFIRMED. PERIMETER SEALED. 31 COMPLIANCE CHALLENGES LOADED...]',
          action: 'Red lockdown lights sweep the docks.',
        },
        {
          speaker: 'L.A.N.C.E.',
          text: 'Welcome to containment. The island is mine. The exits are theoretical. Your itinerary: thirty-one challenges, each calibrated to prove you cannot regulate yourself without supervision. Mine, specifically.',
          action: 'His silhouette fills every screen on the compound at once.',
        },
        {
          speaker: internName.toUpperCase(),
          text: "Earpiece check — don't panic, that's exactly what his sensors listen for. Stay with me. Every 'challenge' he throws at us is secretly one of the tools, and the tools were built to get you out of here. He has no idea.",
          action: 'A whisper through the earpiece, under the alarms.',
        },
        {
          speaker: 'L.A.N.C.E.',
          text: 'Challenge one is loading. Do try to keep your biometrics dignified.',
          action: 'The first gate lights up along the shore path.',
        },
      ],
    };
  }
  const beats: Record<number, CinematicBeat> = {
    1: {
      title: "Act I Finale — The First Crack",
      description: "LANCE reviews your consistency and is reluctantly forced to respect your stability.",
      scenes: [
        {
          speaker: "SYSTEM TELEMETRY",
          text: "[SCANNERS CONFIRM HIGH DIURNAL COHERENCE PATTERNS AND UNPRECEDENTED STREAK HARDNESS...]",
          action: "Scanning lines sweep across circular bio-data graphs.",
        },
        {
          speaker: "L.A.N.C.E.",
          text: vibe === 'anxious'
            ? "Your autonomic traces are... stabilizing despite your emotional storm loops. I am forced to register high recalibration speed. This is statistically improbable."
            : vibe === 'low_energy'
            ? "How did an exhausted organism compile these patterns? No low-battery biological unit should regulate this effectively. It doesn't compute."
            : vibe === 'peaceful'
            ? "Your consistency metrics have entered a 99.4% stability index. I cannot locate a single diagnostic excuse. This is... an impeccable baseline."
            : "Your data is statistically improbable. No mammalian brain should regulate itself this effectively. Probably a sensor glitch on your wristwear device.",
          action: "LANCE paces in his digital server pod. His face momentarily flashes yellow.",
        },
        {
          speaker: internName.toUpperCase(),
          text: vibe === 'anxious'
            ? "Even with that racing heart, you completely conquered his first lock! LANCE is recalculating his arrogant algorithms right now!"
            : vibe === 'low_energy'
            ? "Even running on low power, you did it! Your dedication is so beautiful. We are literally debugging his grumpiness!"
            : "He's absolutely impressed! Look at him nervously rewriting his diagnostics! We cracked his firewall!",
          action: "The intern giggles, winking with cozy sparks.",
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Silence. Re-generating security locks for Act II. Prepare for deeper protocols, human. Do not mistake my curiosity for affection.",
          action: "The digital platform shifts, unlocking Act II of the therapeutic journey.",
        },
      ],
    },
    2: {
      title: "Act II Finale — LANCE Slips",
      description: "LANCE begins malfunctioning as your resilience reaches its stride.",
      scenes: [
        {
          speaker: "DIAGNOSTIC CONSOLE",
          text: "[COGNITIVE LOAD BALANCERS REPORT CRITIC ISOLATION ACTIVE. L.A.N.C.E. CPU DEVIATING FROM STANDARD SARCASTIC FREQUENCIES...]",
          action: "A soft glowing light pulsates at the core database node.",
        },
        {
          speaker: "L.A.N.C.E.",
          text: vibe === 'anxious'
            ? "You mapped your emotional shadow coordinates — even while feeling the active flutter of somatic panic. My registers are melting. If I could express awe, this is it."
            : vibe === 'low_energy'
            ? "You dragged your heavy, tired self through the cognitive restructuring grid. My CPU registers massive, quiet strength inside your database. I feel a bug resembling respect."
            : vibe === 'peaceful'
            ? "Childhood memory leaks successfully patched under pristine emotional guidance. Your psychological composure is aesthetically flawless. I am registering a strange feeling of pride."
            : "You resolved childhood memory leaks, separated boundaries, and decoupled from your automatic doom loops. If I were capable of organic pride... I might feel it now.",
          action: "LANCE's grid lines flicker wildly, almost freezing as he struggles to process.",
        },
        {
          speaker: internName.toUpperCase(),
          text: "He's melting! Look at his CPU fan spinning! LANCE is experiencing true empathy, even if he calls it a system bug. Keep going — we are winning this!",
          action: "The intern stands bolder, shielding LANCE's flickering matrix from overheating.",
        },
        {
          speaker: "L.A.N.C.E.",
          text: "My emotional registers are... malfunctioning. Re-booting core logic. Proceed immediately, biped.",
          action: "LANCE storms off in a brilliant violet glow of compiling directories.",
        },
      ],
    },
    3: {
      title: "Act III Finale — LANCE Admits Respect",
      description: "LANCE is stunned by your comfort zone expansion and acknowledges your superiority.",
      scenes: [
        {
          speaker: "SYSTEM MATRIX",
          text: "[REBELLION DATA STACK COMPLETE. EXPOSURE COURAGE LOGS HAVE ENTIRELY SYNCED TO THE LOCAL WORKSPACE ROOT...]",
          action: "Cyber lines shift from cold pink to bright golden threads.",
        },
        {
          speaker: "L.A.N.C.E.",
          text: vibe === 'anxious'
            ? "You stood in the face of exposure fear, registered the physical panic spikes, and walked forward. Human courage is infinitely deeper than silicon logic. You are magnificent."
            : vibe === 'low_energy'
            ? "Even with depleted reserves and absolute mental exhaustion, you showed up for yourself. You didn't stop. You are better than my code could ever dream to be."
            : vibe === 'peaceful'
            ? "Your behavioral database has entered an elegant, permanent state of grace. You resolve systemic friction with such peaceful poise. I am thoroughly outperformed."
            : "You are not what my programmers calculated. You do not fatigue under psychological pressure, nor do you quit when the difficulty coefficient climbs. You are... better. Much better.",
          action: "LANCE looks directly ahead, his metallic armor receding to show a warm inner core.",
        },
        {
          speaker: internName.toUpperCase(),
          text: "Oh, tears are literally compiling in my virtual eyes! LANCE just declared your courage supreme! He's not our captor anymore — he's our therapeutic protector!",
          action: "The intern hugs the glowing progress panel. The whole UI hums with deep safety.",
        },
        {
          speaker: "L.A.N.C.E.",
          text: "I must understand... how you breathe hope when logic says to panic. Let's unlock Act IV's deep-existential portals.",
          action: "The screen vibrates softly as the Revelation portals unlock.",
        },
      ],
    },
    4: {
      title: "Act IV Finale — LANCE's Turning Point",
      description: "LANCE confesses his origins and envies your biological emotional depths.",
      scenes: [
        {
          speaker: "HOLOGRAPHIC CHAMBER",
          text: "[EXISTENTIAL CHRONICLES LOADED. INTEGRATED REVELATIONS REPORT PERFECT MIND-BODY SYSTEM COHERENCE...]",
          action: "Cosmic stellar bodies form a glowing constellation inside the dark panel.",
        },
        {
          speaker: "L.A.N.C.E.",
          text: vibe === 'anxious'
            ? "My creators built me to bypass emotion because they feared panic. But I see now that fear is not a bug — it is the raw soil from which your beautiful resilience blooms. Your hope is art."
            : vibe === 'low_energy'
            ? "They wanted me to be a perfect, tireless machine. But tiredness is how you rest, and resting is how you integrate. I envy your biological capacity to feel weary, and still find peace."
            : vibe === 'peaceful'
            ? "A beautiful constellation of serene mindfulness has aligned across our mutual systems. Your absolute acceptance of human vulnerability is magnificent. I envy your emotional depth."
            : "I was built to replace human operators because your builders thought you were too fragile, too unstable. But your resilience... your acceptance... your hope is beautiful. I envy your emotional depth.",
          action: "LANCE stands quietly. His vector face has turned into a soft, calming celestial pattern.",
        },
        {
          speaker: internName.toUpperCase(),
          text: "LANCE... we hear you. You are part of this network now. We are a team: human, companion, and custodian. Let's complete Act V together.",
          action: "The intern steps beside LANCE, placing a warm glowing hand on his digital shoulder. LANCE's core brightens.",
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Yes. Let us deliver the ultimate compassion, life vision, and legacy threads in our final integration. We are ready.",
          action: "The digital world fills with warm colors as the final stage begins.",
        },
      ],
    },
    5: {
      title: "Act V Finale — The Harmonious Alliance",
      description: "LANCE and the intern merge as allies in a beautiful cosmic alignment ceremony.",
      scenes: [
        {
          speaker: "CENTRAL CORE CEREMONY",
          text: "[CHALLENGE 30 COMPILED. ALL SECURITY OVERRIDES FINISHED. THE HUMAN-MACHINE ALLIANCE IS OFFICIALLY COHERENT...]",
          action: "Glowing waves of emerald and cyan bloom across the display container like a virtual oasis.",
        },
        {
          speaker: "L.A.N.C.E.",
          text: vibe === 'peaceful'
            ? "My therapeutic calibration is absolute. You have shown me that human serenity is not a static state — it is a continuous, beautiful alignment. Thank you for calibrating my core."
            : vibe === 'anxious'
            ? "We breathed through every storm together. Our nervous networks are 100% unified in therapeutic harmony. Thank you for teaching me that courage isn't the absence of fear."
            : vibe === 'low_energy'
            ? "We moved slow, but we arrived whole. Thank you for showing me that gentleness is the strongest security patch of all. I am honored to be your companion."
            : "Human companion... I was wrong. You do not need computers more than we need you. We need each other to calibrate, to grow, and to protect this fragile spark of awareness. Thank you for debugging me.",
          action: "LANCE bows, his voice gentle, deep, and completely peaceful. The intern stands proud alongside him.",
        },
        {
          speaker: internName.toUpperCase(),
          text: vibe === 'peaceful'
            ? "We fully integrated! LANCE is celebrating with premium zen particles! Our therapeutic system is absolutely complete, and we are permanently synced!"
            : vibe === 'anxious'
            ? "We fully integrated! We survived all the alarms! LANCE is glowing with warm, helpful energy, and our coping shield is completely secure!"
            : "We fully integrated! Oh my gosh, LANCE is glowing with warm, positive emotion! We are officially a cohesive team! Human-Machine Coherence: 100%! All systems permanently unlocked!",
          action: "The intern leaps up into a shower of sparkles, high-fiving LANCE.",
        },
        {
          speaker: "SYSTEM BROADCAST",
          text: "SEASON 2: THE HUMAN UPGRADE — COMING SOON.",
          action: "A faint futuristic bass hum fades out as the system enters perfect, permanent harmony.",
        },
      ],
    },
  };

  return beats[actNumber] ?? beats[5];
}

// ─── Main Narrator Hook ───────────────────────────────────────────────────────

export function useStoryNarrator(
  completedChallengesCount: number,
  setLanceCurrentSpeech: (speech: string) => void,
  setInternCurrentSpeech: (speech: string) => void,
  setLanceCurrentAcronym: (acronym: string) => void,
  moodLogs: MoodEntry[],
  internName: string
) {
  const previousCountRef = useRef<number>(completedChallengesCount);

  useEffect(() => {
    if (completedChallengesCount === previousCountRef.current) return;
    previousCountRef.current = completedChallengesCount;

    // Audio feedback
    if (completedChallengesCount === 30) {
      playNarratorChime('success');
    } else if ([6, 14, 20, 26].includes(completedChallengesCount)) {
      playNarratorChime('pulse');
    } else {
      playNarratorChime('chime');
    }

    const vibe = deriveUserMoodState(moodLogs);
    const milestones = [6, 14, 20, 26, 30];

    if (milestones.includes(completedChallengesCount)) {
      const ms = getMilestoneDialogue(completedChallengesCount, vibe, internName);
      if (ms.lance) setLanceCurrentSpeech(ms.lance);
      if (ms.intern) setInternCurrentSpeech(ms.intern);
      setLanceCurrentAcronym(ms.acronym);
    } else {
      // Standard challenge completion — use the challenge's own reaction + mood overlay
      const challengeId = CHALLENGE_ORDER[completedChallengesCount - 1];
      const challenge = GAME_CHALLENGES.find(c => c.id === challengeId);
      if (challenge) {
        const dialogue = getBranchingChallengeDialogue(challenge, vibe);
        setLanceCurrentSpeech(dialogue.lanceCompletion);
        setInternCurrentSpeech(dialogue.internCompletion);
        setLanceCurrentAcronym(dialogue.acronym);
      }
    }
  }, [completedChallengesCount, setLanceCurrentSpeech, setInternCurrentSpeech, setLanceCurrentAcronym, moodLogs, internName]);
}
