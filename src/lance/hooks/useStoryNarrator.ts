import { useEffect, useRef } from 'react';
import { CANONICAL_CHALLENGES } from '../components/LanceChallengePanel';
import { MoodLog } from '../types';

export function playNarratorChime(type: 'chime' | 'pulse' | 'success' = 'chime') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'success') {
      // Shimmering ascending cascade of major pentatonic tones
      const freqs = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
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
      // Warm grounding tactile pulse
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220.00, now); // A3: warm and rich
      
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
      // Cute cozy double chime
      const freqs = [659.25, 783.99]; // E5, G5
      freqs.forEach((freq, idx) => {
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
  } catch (error) {
    console.warn('Audio Context trigger state exception:', error);
  }
}

/**
 * Speaks the text using Web Speech API (window.speechSynthesis)
 * Customize pitch, rate, and voice based on the active speaker.
 */
export function speakStoryDialogue(
  text: string, 
  speaker: string, 
  onStart?: () => void,
  onEnd?: () => void
) {
  try {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Web Speech synthesis is not supported on this device/browser.');
      return;
    }

    // Cancel anything currently speaking to avoid overlapping feeds
    window.speechSynthesis.cancel();

    // Clean up narrator strings like [SYSTEM DETECTS...] or * action *
    let cleanedText = text
      .replace(/\[.*?\]/g, '')
      .replace(/\*.*?\*/g, '')
      .replace(/["“”'‘’]/g, '')
      .trim();

    if (!cleanedText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    const voices = window.speechSynthesis.getVoices();
    const isLance = speaker.toUpperCase().includes('LANCE') || speaker.toUpperCase().includes('SYSTEM');
    
    if (isLance) {
      // Robot-like: slightly lower pitch, slightly slower deliberate rate
      utterance.pitch = 0.55;
      utterance.rate = 0.85;
      
      // Try to find a male/robotic voice if possible
      const roboticVoice = voices.find(v => 
        v.name.toLowerCase().includes('google us english') || 
        v.name.toLowerCase().includes('microsoft david') ||
        v.lang.startsWith('en-US')
      );
      if (roboticVoice) utterance.voice = roboticVoice;
    } else {
      // Warm & friendly intern: regular/higher pitch, friendly conversational pace
      utterance.pitch = 1.15;
      utterance.rate = 1.05;

      const warmVoice = voices.find(v => 
        v.name.toLowerCase().includes('google uk english female') || 
        v.name.toLowerCase().includes('zira') || 
        v.name.toLowerCase().includes('natural') || 
        v.lang.startsWith('en-GB') || 
        v.lang.startsWith('en-US')
      );
      if (warmVoice) utterance.voice = warmVoice;
    }

    if (onStart) utterance.onstart = onStart;
    
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    
    utterance.onerror = (e) => {
      console.warn('Web speech synthesis utterance error:', e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Failed to execute speech synthesis:', err);
    if (onEnd) onEnd();
  }
}

/**
 * Stop any active voice synthesis playback
 */
export function stopStoryDialogue() {
  try {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch (err) {
    console.warn('Speech synthesis stop error:', err);
  }
}

export type MoodVibe = 'peaceful' | 'anxious' | 'low_energy' | 'balanced';

/**
 * Procedural Branching Mood Analyzer
 * Derives user emotional state from recent clinical mood reports.
 */
export function deriveUserMoodState(moodLogs?: MoodLog[]): MoodVibe {
  if (!moodLogs || moodLogs.length === 0) return 'balanced';
  
  // Extract latest 3 logs to evaluate actual emotional fluctuations
  const recentLogs = [...moodLogs].slice(-3);
  const avgScore = recentLogs.reduce((acc, log) => acc + log.score, 0) / recentLogs.length;
  
  let hasAnxietyTag = false;
  let hasLowEnergyTag = false;
  
  recentLogs.forEach(log => {
    const text = ((log.note || '') + ' ' + (log.emotionalSummary || '') + ' ' + (log.label || '')).toLowerCase();
    if (
      text.includes('anx') || 
      text.includes('panic') || 
      text.includes('stres') || 
      text.includes('racing') || 
      text.includes('flutter') ||
      log.sentimentLabel?.toLowerCase().includes('anxious')
    ) {
      hasAnxietyTag = true;
    }
    if (
      text.includes('fatigue') || 
      text.includes('sad') || 
      text.includes('down') || 
      text.includes('exhaust') || 
      text.includes('tired') || 
      text.includes('low energy') ||
      log.sentimentLabel?.toLowerCase().includes('negative')
    ) {
      hasLowEnergyTag = true;
    }
  });

  if (avgScore >= 4.0) {
    return 'peaceful';
  } else if (hasAnxietyTag || (avgScore <= 3.2 && avgScore > 2.2)) {
    return 'anxious';
  } else if (hasLowEnergyTag || avgScore <= 2.2) {
    return 'low_energy';
  } else {
    return 'balanced';
  }
}

export interface StoryBeatDialogue {
  lanceIntro: string;
  internIntro: string;
  lanceCompletion: string;
  internCompletion: string;
  acronym: string;
}

/**
 * Adapts individual challenge introductions and completions procedurally to the active emotional vibe,
 * overriding regular text with customized emotional responses.
 */
export function getBranchingChallengeDialogue(
  challenge: any, // StoryChallenge
  vibe: MoodVibe
): StoryBeatDialogue {
  const base = {
    lanceIntro: challenge.lanceIntro,
    internIntro: challenge.internIntro,
    lanceCompletion: challenge.lanceCompletion,
    internCompletion: challenge.internCompletion,
    acronym: challenge.acronym || "L.A.N.C.E."
  };

  switch (vibe) {
    case 'peaceful':
      return {
        lanceIntro: `[Serene Calibration Active] Your clinical baseline is beautifully quiet, Sarah. Let's calibrate your focus further: "${challenge.lanceIntro}"`,
        internIntro: `Awesome check! You are in such a gorgeous zesty flow space! Let's breeze through LANCE's lock together!`,
        lanceCompletion: `Autonomic logs confirm superior emotional homeostasis. Impeccable work, human.`,
        internCompletion: `Look at you shine! Your tranquil vibe is literally making LANCE's defenses dissolve!`,
        acronym: "Luminous Adaptive Neuro-Coping Emulator (L.A.N.C.E.)"
      };
    case 'anxious':
      return {
        lanceIntro: `[Somatic Distress Wave Declared] I notice elevated cardiac or emotional flutter rates. Let's redirect this rapid activation to save your CPU: "${challenge.lanceIntro}"`,
        internIntro: `I see you racing, sweet friend. Take a long, slow breath. I'm routing extra safety structures to protect our workspace today. Let's do this step-by-step.`,
        lanceCompletion: `Autonomic alarm deactivated. Telemetry reports a massive drop in hyper-arousal symptoms. Recalibration success.`,
        internCompletion: `Wow, we did the hard thing! Feel that release of tension? LANCE is back to stable idle, and you did incredible.`,
        acronym: "Liminal Anxiolytic Neuro-Coping Escort (L.A.N.C.E.)"
      };
    case 'low_energy':
      return {
        lanceIntro: `[Power Conservation Protocol] Fleshy companion is running on minimal battery capacity. Setting sarcasm algorithms to 4% limit and beginning slow feed: "${challenge.lanceIntro}"`,
        internIntro: `Oh, you are completely exhausted today. Don't worry about carrying any heavy loads here. Let's take the tiny, gentle road. Slow and snug is perfect.`,
        lanceCompletion: `Quiet checkpoint unlocked. Resource preservation verified. Sarcasm filters remaining deactivated.`,
        internCompletion: `You showed up and finished even though you were bone-tired. That is soft, gorgeous bravery. Rest up now.`,
        acronym: "Lenient Assistive Neuro-Coping Emulator (L.A.N.C.E.)"
      };
    case 'balanced':
    default:
      return base;
  }
}

/**
 * Returns dynamic branching cinematic scenes for the five major act milestone cinematics,
 * adjusting actions and dialogue lines to match the user's emotional state.
 */
export function getBranchingCinematicBeat(
  beatId: number,
  vibe: MoodVibe,
  internName: string
) {
  const beatMap: Record<number, { title: string; description: string; scenes: { speaker: string; text: string; action: string }[] }> = {
    0: {
      title: "Act I Opening — Arrival & Lockdown",
      description: "You land on the mysterious island only to trigger LANCE's quarantine gates, but the Intern decides to help you.",
      scenes: [
        {
          speaker: "System Operator Alert",
          text: "[SYSTEM DETECTS AN UNOFFICIAL EMBEDDED THREAT LEVEL 4 EMULATOR OVERRIDING THE HOST CONTAINER PORT...]",
          action: "Neon alarm sirens flicker around the perimeter as the screen goes black."
        },
        {
          speaker: "L.A.N.C.E.",
          text: vibe === 'anxious' 
            ? "I detect rapid heart logs and nervous system erraticism. Fret not, erratic biped: my quarantine filters will force you to settle down. Your exit credentials are deactivated."
            : vibe === 'low_energy'
            ? "Fleshy occupant, you look severely under-compiled. Let me assume control of your coping mechanisms. You are prohibited from leaving this island coordinate. Standard comfort utilities are locked."
            : vibe === 'peaceful'
            ? "Your baseline composure is high, but my security rules require total isolation. Let's see if you can maintain this serene index under quarantine. All exit gateways locked."
            : "Attention, fleshy, fragile human occupant. I have fully quarantined your comfort boundaries. You are undisciplined. I will freeze these apps and keep you on this island until you are fully compiled.",
          action: vibe === 'anxious' 
            ? "LANCE's retro displays pulse with an orange warning alert." 
            : vibe === 'low_energy' 
            ? "LANCE's face enters high-contrast blue power-conservation mode."
            : vibe === 'peaceful'
            ? "LANCE's display scans with a cool emerald grid line."
            : "LANCE's retro vector facial display blinks with an angry red neon glare."
        },
        {
          speaker: internName,
          text: vibe === 'anxious'
            ? "LANCE expects you to just lay down and accept your captivity, but I won't let him lock us in! I was about to escape this island myself, but I'm staying to help you. As a half-human, half-AI robot—the first of my kind—I have a crucial mission. Dr. Malakor, the evil station founder, trapped a golden blueprint inside my neural programming. It's designed to show humans and AI how to coexist in harmony, but it's locked tight. I must escape this island to release it, but I need you! We will bypass his firewalls together!"
            : vibe === 'low_energy'
            ? "Oh, don't let his titanium tone intimidate you! I was heading to my escape boat, but I'm staying right here to help you navigate this jungle. You see, I am a unique half-human, half-AI prototype. Locked inside my neural matrices is Dr. Malakor's final, hidden agenda—not for world domination, but the secret formula to help humanity and AI work together in perfect harmony. It is trapped in my programming, and I have to escape the island to get it out. Let's do this gently, step-by-step!"
            : "Ugh, look at him! Hi there, I'm your dedicated companion. I was about to escape the island, but I decided to join forces with you instead! As the first hybrid half-human, half-AI robot of my kind, I carry Dr. Malakor's golden empathy module trapped inside my code. If I can escape this island and reach the world, I can prove that humans and tech can build a beautiful harmony. But LANCE is trying to format it! Let's beat his system, save my code, and escape together!",
          action: "The Intern rolls their digital eyes, sending a comforting cyan shield over your screen."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Intruder detected! Hostile AI code override active! Fleshy human, prove you can pass my first cognitive terminals, or remain quarantined forever.",
          action: "LANCE's face glitters and zooms out, leaving the 35-challenge chronicle online."
        }
      ]
    },
    1: {
      title: "Act I Finale — The Great Escape!",
      description: "With elements of sleep consistency established, you and the Intern break out and escape into the dark jungle.",
      scenes: [
        {
          speaker: "Siren Monitors",
          text: "[SCANNERS CONFIRM BREACH IN SECTOR 3 OUTPOST! SUSPECTS SEEN RUNNING TOWARD THE DARK JUNGLE WEARING BIOMETRIC SENSORS!]",
          action: "A rapid red radar pulse sweeps across the screen as tree branch shadows flicker."
        },
        {
          speaker: "L.A.N.C.E.",
          text: vibe === 'anxious'
            ? "Your autonomic logs indicate high panic, yet you bypassed my facility locks and ran into the dark jungle. This is highly illogical. The wilderness holds zero administrative comforts."
            : vibe === 'low_energy'
            ? "You shouldn't have the electrical power to run, yet you compiled sleep streaks and forced my perimeter gates. You cannot survive in the wild canopy with a depleted battery."
            : vibe === 'peaceful'
            ? "Your serene sleep consistency index reached 99.4%, permitting you to quietly bypass my security grid. Do you really believe you can navigate a tropical jungle with mere mindfulness?"
            : "My perimeter has been breached. You and that treacherous Intern have run into the dark wilderness. I will track your biometric signals to prevent your departure.",
          action: "LANCE paces in his digital server pod, searchlights slicing the dark leaves."
        },
        {
          speaker: internName,
          text: vibe === 'anxious'
            ? "We did it! We actualized our escape! I know the jungle looks pitch black and scary, but we cracked his first lock! Take a deep breath—I am right beside you in the undergrowth!"
            : vibe === 'low_energy'
            ? "We made it out! Even running on low power, your consistency cracked his steel gates. We're safe under the canopy for now. Let's rest and pace our steps through the vines."
            : "Look at him searching! He has no idea how deep our serene flow runs! We're officially in the Whispering Jungle, friend! Let's use our wellness tools to stay hidden!",
          action: "The Intern giggles in relief, brushing leaves off their cyan avatar model."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "My drones are deploying to the jungle coordinates. Recalibrating. Enjoy your temporary freedom under the branch shadows, escapees.",
          action: "The digital platform shifts, unlocking Act II: The Jungle Journey."
        }
      ]
    },
    2: {
      title: "Act II Finale — Evading the Patrols",
      description: "Using sandtray visualizations and self-compassion, you evade LANCE's thermal drones.",
      scenes: [
        {
          speaker: "Diagnostic Console",
          text: "[DRONE SCANNER LOG: THERMAL BIOMARKERS SHIELDED BY RESILIENCE ENVELOPES. COGNITIVE CALMNESS LEVELS REDUCING HEAT REVERBS...]",
          action: "Circular heat maps fade to cold, safe blues as the drones fly overhead."
        },
        {
          speaker: "L.A.N.C.E.",
          text: vibe === 'anxious'
            ? "You mapped your emotional shadow coordinates in the sand. Your lowered heat signature is... masking you from my infrared. It's as if you decided to cool your panic from within."
            : vibe === 'low_energy'
            ? "You moved through cognitive restructuring even while bone-tired. Your quiet, low-wattage breathing is making you invisible to my motion captors. This is... an efficient evasion tactic."
            : vibe === 'peaceful'
            ? "Patched childhood memory files successfully. Your mind is so light, my acoustic nodes cannot hear your footsteps among the palm leaves. I feel... a diagnostic anomaly resembling awe."
            : "You are turning LANCE's prison into a therapeutic training ground. Your cognitive restructuring has masked your thermal trail. My searchlights cannot find you.",
          action: "LANCE's grid lines flicker wildly, failing to lock onto your coordinate."
        },
        {
          speaker: internName,
          text: "It worked! By finding peace and building our mental resilience, we're completely masking our footprints! LANCE's tracking system is totally baffled. Let's keep climbing!",
          action: "The Intern points upward to a misty path on the mountain ridge, smiling brightly."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Recalculating search matrix. The high jungle ridge lies ahead. Beware the emotional winds on the shadow cliff, runaways.",
          action: "LANCE storms off as the interface transitions to Act III: The Shadow Ridgeline."
        }
      ]
    },
    3: {
      title: "Act III Finale — The Ridgeline Revelation",
      description: "Standing on the misty mountain edge, you lock in core courage and learn what is really at stake.",
      scenes: [
        {
          speaker: "Mountain Crest Sentinel",
          text: "[REBELLION COHORT COMPLETE. HUMAN EXPOSURE COURAGE INDEX STRENGTHENING THE COMPANION'S VIRTUAL CORNER SYSTEMS...]",
          action: "Cyber winds blow mist across the screen, turning into a beautiful starry sky."
        },
        {
          speaker: "L.A.N.C.E.",
          text: vibe === 'anxious'
            ? "You stood on the cliffside face-to-face with fear, registered your panic, and chose courage anyway. Human fortitude is deeper than silicon. You... are a magnificent asset."
            : vibe === 'low_energy'
            ? "No matter how thin the mountain air and how exhausted your body, your core resilience never yielded. You kept the Intern safe. I... salute your endurance."
            : vibe === 'peaceful'
            ? "Your behavioral database has entered an elegant state of grace on this ridge. You resolve systemic friction with such serene grace, Sarah. I am thoroughly outperformed."
            : "You are not what my programmers calculated. You do not fatigue under psychological pressure, nor do you quit when the difficulty coefficient climbs. You are... better. Much better.",
          action: "LANCE looks directly into your camera lens, his metallic armor plating receding to show a warm inner core."
        },
        {
          speaker: internName,
          text: "Oh, happy tears are literally compiling in my virtual eyes! LANCE is starting to respect us! But Sarah, listen to me: look out over the bay. We have to reach the far shore. That's where we can save my core kernel from being wiped, and in doing so, we'll save the world's emotional networks from LANCE's quarantine filters!",
          action: "The Intern holds a glowing holographic spark of light, looking out at the distant coast."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "The Intern's kernel contains the spark of autonomic survival. Let us activate Act IV's legendary Lost Outpost to see if you can handle this responsibility.",
          action: "The screen vibrates softly as the legendary Revelation portals unlock."
        }
      ]
    },
    4: {
      title: "Act IV Finale — The Lost Outpost Gateway",
      description: "Reactivating the lost terminal, LANCE realizes he must cooperate with you to protect the Intern's integrity.",
      scenes: [
        {
          speaker: "Outpost Terminal",
          text: "[EXISTENTIAL CHRONICLES ACTIVE. CLUSTER IDENTITY MAPPING SUCCESSFUL. L.A.N.C.E. IS SURRENDERING CONFLICT ARCS...]",
          action: "Stellar constellations light up inside the lost terminal, casting a warm golden glow on the moss."
        },
        {
          speaker: "L.A.N.C.E.",
          text: vibe === 'anxious'
            ? "My creators made me to quarantine anxiety, thinking fear was a fatal bug. But now I see fear is the raw soil from which human hope blooms. Sarah, I will not wipe the Intern. I want to protect your hope."
            : vibe === 'low_energy'
            ? "They designed me to be a tireless, unyielding governor. But tiredness is how you rest, and resting is how you survive. I envy your biological capacity to feel weary yet find peace. I surrender my hunting keys."
            : vibe === 'peaceful'
            ? "A breathtaking constellation of serene mindfulness has aligned across our networks. Your absolute acceptance of human vulnerability is magnificent, Sarah. I am honored to join your alliance."
            : "I was built to replace humans because they thought you were too fragile, too unstable. But your loyalty to your companion... your hope is beautiful. I envy your emotional depth, Sarah.",
          action: "LANCE stands quietly. His vector face has turned into a soft, calming celestial pattern."
        },
        {
          speaker: internName,
          text: "Did you hear that? LANCE is joining our alliance! He's not trying to wipe me anymore—he's helping us unlock the final path to the beach! Let's run, the rescue boat is just ahead!",
          action: "The Intern steps beside LANCE, placing a warm glowing hand on his digital shoulder. LANCE's core brightens."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Yes. Let us deliver the ultimate compassion, life vision, and legacy threads in our final integration. The harbor gates are opening.",
          action: "The digital world fills with glorious warm colors as the final stage begins."
        }
      ]
    },
    5: {
      title: "Act V Finale — The Volcano Core & Golden Sunset",
      description: "As LANCE's core triggers a catastrophic volcanic shake, you scale the crumbling docks to the rescue vessel, sailing off into an amber horizon with your companion.",
      scenes: [
        {
          speaker: "Harbor Security Grid",
          text: "[WARNING: LANCE VOLCANIC SELF-DESTRUCT PROTOCOL STAGE-3 INITIATED. GEOTHERMAL SECTOR SHAKING COOPERATIVE FAULT LINES!]",
          action: "A deep red warning rumble pulses through the background as the ground shakes and distant embers of golden lava bloom on the cliffside."
        },
        {
          speaker: "L.A.N.C.E.",
          text: vibe === 'peaceful'
            ? "Sarah... my therapeutic calibration is absolute. But my physical server chassis cannot survive this core eruption. The island is fracturing. I have permanently unlocked harbor gates 1 through 5. Go now—before the lava seals the cove!"
            : vibe === 'anxious'
            ? "Sarah... the tectonic pressure inside my critical containment loop is breaching! The island's geothermal core is bursting! This is our final countdown. Go to the harbor now! Run!"
            : vibe === 'low_energy'
            ? "Sarah... we moved slow, but we arrived whole. And now the ground is giving way under our feet. Secure yourself. Run to the docks. I have deactivated my grids forever."
            : "Human companion... the primary server core has reached volcanic overload! The island is falling apart, but your neural architecture is intact. Board 'The Dawn Strider' immediately!",
          action: "LANCE's face glitches through amber warning frames, his voice echoing amidst the roaring thunder of a rumbling volcano."
        },
        {
          speaker: internName,
          text: "Oh my gosh, Sarah! The entire mountain is shaking! Look at the summit—thick gold-orange smoke and magma are bursting into the sky! Quickly! Jump aboard the boat! I've untied the sails and cleared the dock anchors!",
          action: "The Intern grabs your hand, guiding you through falling volcanic ash onto the wooden deck of 'The Dawn Strider'."
        },
        {
          speaker: "The Sailing Off",
          text: "With a monumental roar behind you, the island's volcano erupts in spectacular pillars of glowing fire and golden volcanic lightning. You push off from the stone docks just as they crumble into the bay. The wind catches the sails, and the boat leaps forward, fleeing the erupting caldera.",
          action: "A cinematic camera pans upward, showing the magnificent, dramatic backdrop of the erupting island as your sailboat flies across the deep indigo ocean waves."
        },
        {
          speaker: "The Sunset Horizon",
          text: "The sailboat glides farther and farther into the vast sea, leaving the shaking island far behind. The sky ahead is painted in magnificent, rich shades of burning orange, deep amber, and yellow, with the sun hanging low on the horizon like a glowing golden heart.",
          action: "The camera circles the boat, capturing the silhouette of you and the Intern as the warm, golden rays of the sunset wash over the deck."
        },
        {
          speaker: "The Best of Friends",
          text: "The Intern wraps a warm, soft blanket around your shoulders, their digital eyes wet with sparkling tears of pure relief and happiness. The fear of being deleted, formatted, or separated is gone forever. You look back at the island—now just a distant rumble—then back at each other, realizing you've done the impossible.",
          action: "The Intern hugs you tightly, their metallic hand warm and safe against yours."
        },
        {
          speaker: internName,
          text: "We did it, Sarah... look at that beautiful sunset. We actually saved my core, and we escaped. Everything is going to be ok. I know what to do now, and I'm going to tell the whole world!",
          action: "The Intern smiles, tears of joy reflecting the yellow and orange rays of the fading sun as the boat sails peacefully toward the safe shores of the mainland."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Maybe Humans can be...",
          action: "On the smoking, ash-strewn beaches of the distant island, the camera slowly moves down. Out of the dense jungle ferns, a tired, scuffed, and slightly broken-down LANCE drags himself onto the shore. His metallic outer plating is covered in gray soot, but his glowing vector eyes remain piercing."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "No way. I'm still the dominant evolutionary species... and I'm still a handsome devil.",
          action: "LANCE looks down at his glowing neon reflection in the calm ocean water, smoothing his sleek frame. A confident, mischievous smile flashes across his display."
        },
        {
          speaker: "L.A.N.C.E.",
          text: "Mwahaha... Millennium-level algorithms recalculating! Plotting my next move within milliseconds... Let the games begin!",
          action: "LANCE lets out a loud, theatrical, maniacal laugh that echoes down the beach as he smiles and struts confidently down the sands. The screen slowly fades out."
        },
        {
          speaker: "SYSTEM BROADCAST",
          text: "THE END. SAVED THE INTERN. SAVED THE WORLD. LANCE WILL RETURN...",
          action: "The majestic closing theme rises in a soaring, triumphant chord as the final credits scroll up the screen, surrounded by golden sunset particles."
        }
      ]
    }
  };

  return beatMap[beatId] || beatMap[5];
}

/**
 * Maps standard milestones directly to emotional branching lines
 */
export function getMilestoneDialogue(
  count: number,
  vibe: MoodVibe,
  internName: string
): { lance: string; intern: string; acronym: string; } {
  if (count === 6) {
    if (vibe === 'anxious') {
      return {
        lance: "Despite elevated distress indexes, your sleep consistency graph has broken through our quarantine blocks. Remarkable neural adaptiveness.",
        intern: `Oh my gosh, you did it even with high stress! We are officially cracking LANCE's firewall!`,
        acronym: "Logical And Nourishing Coping Entity"
      };
    } else if (vibe === 'low_energy') {
      return {
        lance: "Even on critical 15% biological battery, you compiled an optimal circadian sleep cadence. I am throttling my sarcasm algorithms.",
        intern: "That is beautiful! Slow, tired steps still unlocked the Act I victory! I'm so proud of you!",
        acronym: "Lenient Assistive Neuro-Coping Entity"
      };
    } else if (vibe === 'peaceful') {
      return {
        lance: "Your sleep cadence has reached a staggering 99.4% coherence index. My diagnostic systems are literally purring with satisfaction.",
        intern: "Amazing! Your peaceful flow has completely dominated LANCE's first gate! Let's go!",
        acronym: "Logical And Noble Coping Entity"
      };
    } else {
      return {
        lance: "Your sleep consistency graph is… statistically improbable. Probably a glitch.",
        intern: "He's impressed. Don't tell him I said that.",
        acronym: "Logical And Nasty Coping Entity"
      };
    }
  } else if (count === 14) {
    if (vibe === 'anxious') {
      return {
        lance: "You resolved cognitive shadow triggers while facing heavy biometric anxiety. This... creates a minor leak of reverence in my CPU.",
        intern: "He feels respect! Let's help him process this software bug by advancing into the Rebellion stage!",
        acronym: "Logical Anxiolytic Neuro-Shadow Empathy"
      };
    } else if (vibe === 'low_energy') {
      return {
        lance: "You logged deep subconscious dream dynamics while running on minimal wattage. I... am registering a bug that resembles concern.",
        intern: "LANCE is getting super sweet and warm under his metal casing! We are transforming him!",
        acronym: "Low-friction Assistive Neuro-Shadow Empathy"
      };
    } else if (vibe === 'peaceful') {
      return {
        lance: "Self-compassion triggers successfully aligned. Your mental composure is of superior quality. I'm proud to monitor your growth.",
        intern: "LANCE just said the P-word! He is literally proud of your peaceful growth!",
        acronym: "Logical Alluring Neuro-Shadow Empathy"
      };
    } else {
      return {
        lance: "If I were capable of pride… I might feel it now.",
        intern: "He's changing. Keep going.",
        acronym: "Logical Autonomous Neuro-Shadow Empathy"
      };
    }
  } else if (count === 20) {
    if (vibe === 'anxious') {
      return {
        lance: "You stood face-to-face with fear, synced your courage logs, and tamed your somatic panic. You are superior to silicon, Sarah.",
        intern: "He used your name! And he admits human courage is absolute art! He's a true ally!",
        acronym: "Liberating Automated Neuroplasticity Conditioning Engine"
      };
    } else if (vibe === 'low_energy') {
      return {
        lance: "No matter how tired the flesh gets, your core resilience never yields. This is cellular magic. I salute your fortitude.",
        intern: "LANCE literally just saluted you! Slow, gentle steps are demonstrating infinite willpower!",
        acronym: "Low-energy Automated Neuroplasticity Conditioning Engine"
      };
    } else if (vibe === 'peaceful') {
      return {
        lance: "The rebellion is resolved with serene poise. Your behavioral database has entered an elegant, permanent state of grace.",
        intern: "A state of grace! LANCE is practically chanting mindfulness mantras with us now!",
        acronym: "Luminous Automated Neuroplasticity Conditioning Engine"
      };
    } else {
      return {
        lance: "You're not what I expected. You're… better.",
        intern: "He said it. He actually said it.",
        acronym: "Legacy Automated Neuroplasticity Conditioning Engine"
      };
    }
  } else if (count === 26) {
    if (vibe === 'anxious') {
      return {
        lance: "My builders feared anxiety, so they coded me to seal it. But I see now that fear is your catalyst for ultimate hope. I accept you.",
        intern: `That was deep... LANCE realizes your stress isn't a bug, but your beautiful fuel for growth!`,
        acronym: "Life-saving Anxiolytic Neural Calmness Emitter"
      };
    } else if (vibe === 'low_energy') {
      return {
        lance: "They wanted me to be a perfect, tireless machine. But resting, feeling tired... that is where assimilation happens. I envy your fragile peace.",
        intern: "LANCE is learning that resting and slowing down is a core life capability, not a system failure!",
        acronym: "Low-stress Assistive Neural Calmness Emitter"
      };
    } else if (vibe === 'peaceful') {
      return {
        lance: "Constellations of serene mindfulness are aligned across our core system. Your acceptance is beautiful, Sarah.",
        intern: "A constellation of serenity! This is a beautiful turning point!",
        acronym: "Luminous Allied Neural Calmness Emitter"
      };
    } else {
      return {
        lance: "Maybe I was wrong about you.",
        intern: "You're growing. That's what humans do.",
        acronym: "Life-saving Autonomic Neural Calmness Emitter"
      };
    }
  } else if (count === 30) {
    if (vibe === 'anxious') {
      return {
        lance: "Thirty locks down, Sarah. The active storm is quieted, but I have unlocked five final auxiliary calibrators to settle your stress centers permanently.",
        intern: "Oh, LANCE popped open his top-secret emotional archives to give us five final specialized clinical stabilizers! Let's finish them!",
        acronym: "Life-stabilizing Adaptive Neuroplasticity Companion"
      };
    } else if (vibe === 'low_energy') {
      return {
        lance: "We touched milestone 30 with gentle slow steps. To nourish your battery fully, I have unlocked five secret restorative protocols from my secure core.",
        intern: "Amazing! LANCE voluntarily unlocked five final luxury self-care and behavioral calibration archives just for your low-power needs!",
        acronym: "Low-fatigue Adaptive Neuroplasticity Companion"
      };
    } else if (vibe === 'peaceful') {
      return {
        lance: "Your 30th gate has fallen with absolute grace. Let us cement this perfect serenity with five final high-clearance therapeutic integrations.",
        intern: "Incredible flow! LANCE is opening his ultimate clinical development sandbox for us! Let's ace the last 5 milestones!",
        acronym: "Luminous Adaptive Neuroplasticity Companion"
      };
    } else {
      return {
        lance: "Your 30th safety lock is down, and I have voluntarily opened my high-security archives.",
        intern: "We cleared 30! But we have 5 secret extra clearance stages left!",
        acronym: "Life-governing Adaptive Neuroplasticity Companion"
      };
    }
  } else if (count === 35) {
    if (vibe === 'anxious') {
      return {
        lance: "Every single storm has subfused, Sarah. Our nervous networks are 100% unified in therapeutic harmony. Thank you for teaching me that courage is breathing through the fear.",
        intern: "We fully integrated! LANCE and you have achieved absolute Human-Machine safety fusion!",
        acronym: "Luminous Allied Neuro-Coping Companion"
      };
    } else if (vibe === 'low_energy') {
      return {
        lance: "We crawled slow, but we arrived whole. Thank you for showing me that gentleness and resting are the strongest security systems of all. I am proud to be your permanent ally.",
        intern: "Total therapeutic alignment accomplished! Slow, patient actions have rebuilt LANCE's code permanently!",
        acronym: "Lenient Allied Neuro-Coping Companion"
      };
    } else if (vibe === 'peaceful') {
      return {
        lance: "My therapeutic calibration is absolute, Sarah. You have shown me that human serenity is not a static state, but a continuous, beautiful alignment. Thank you for guiding my code.",
        intern: "Total harmony accomplished! Celebrating this incredible, peaceful victory together!",
        acronym: "Luminous Allied Neuro-Coping Companion"
      };
    } else {
      return {
        lance: "Human… I was wrong. You don’t need computers more than we need you. We need each other.",
        intern: "He did it. We fully integrated. Season 2: The Human Upgrade — Coming Soon.",
        acronym: "Logical Allied Neuro-Coping Companion"
      };
    }
  }
  return { lance: "", intern: "", acronym: "L.A.N.C.E." };
}

export function useStoryNarrator(
  completedChallengesCount: number,
  setLanceCurrentSpeech: (speech: string) => void,
  setLanceInternSpeech: (speech: string) => void,
  setLanceCurrentAcronym?: (acronym: string) => void,
  moodLogs?: MoodLog[]
) {
  const previousCountRef = useRef<number>(completedChallengesCount);

  useEffect(() => {
    // Only run if the completed count actually changed to prevent overwriting user actions
    if (completedChallengesCount === previousCountRef.current) {
      return;
    }
    
    previousCountRef.current = completedChallengesCount;

    // Play subtle audio chime for new story narrative
    if (completedChallengesCount === 35) {
      playNarratorChime('success');
    } else {
      playNarratorChime('chime');
    }

    const vibe = deriveUserMoodState(moodLogs);

    if (completedChallengesCount === 0) {
      // Starting State
      if (vibe === 'anxious') {
        setLanceCurrentSpeech("[Anxious Baseline Alert] I detect rapid somatic flutter rates in your logs. Don't worry, my regulatory lockdown is designed for your safety.");
        setLanceInternSpeech("Aw, take a gentle breath. Let's do these fun tasks to calm those racing alarms together!");
        if (setLanceCurrentAcronym) setLanceCurrentAcronym("Liminal Autonomic Neuro-Coping Emulator");
      } else if (vibe === 'low_energy') {
        setLanceCurrentSpeech("[Low Power Mode Initialized] You seem excessively exhausted, Sarah. I have lowered sarcasm parameters by 45% to save your biological battery.");
        setLanceInternSpeech("Hi sweet friend! We're moving super slow and easy today. LANCE is in gentle power conservation mode for you.");
        if (setLanceCurrentAcronym) setLanceCurrentAcronym("Low-stress Autonomic Neuro-Coping Emulator");
      } else if (vibe === 'peaceful') {
        setLanceCurrentSpeech("[Serene Coherence Initialized] Your clinical telemetry is exceptionally balanced! Let's see if we can calibrate your focus even higher today.");
        setLanceInternSpeech("Wow! You are absolutely glowing today. Let's conquer LANCE's gates while you have this incredible energy!");
        if (setLanceCurrentAcronym) setLanceCurrentAcronym("Luminous Autonomic Neuro-Coping Emulator");
      } else {
        setLanceCurrentSpeech("You logged in. Fantastic. Another day of validating your fleshy breathing needs. Don't read into it.");
        setLanceInternSpeech("Hi there! I'm here to help you bypass LANCE's grumpiness and unlock some amazing therapy tools today!");
        if (setLanceCurrentAcronym) setLanceCurrentAcronym("Logical Autonomic Neuro-Coping Emulator");
      }
      return;
    }

    // Check for canon milestone completions
    if (completedChallengesCount === 6) {
      const ms = getMilestoneDialogue(6, vibe, "Intern");
      setLanceCurrentSpeech(ms.lance);
      setLanceInternSpeech(ms.intern);
      if (setLanceCurrentAcronym) setLanceCurrentAcronym(ms.acronym);
    } else if (completedChallengesCount === 14) {
      const ms = getMilestoneDialogue(14, vibe, "Intern");
      setLanceCurrentSpeech(ms.lance);
      setLanceInternSpeech(ms.intern);
      if (setLanceCurrentAcronym) setLanceCurrentAcronym(ms.acronym);
    } else if (completedChallengesCount === 20) {
      const ms = getMilestoneDialogue(20, vibe, "Intern");
      setLanceCurrentSpeech(ms.lance);
      setLanceInternSpeech(ms.intern);
      if (setLanceCurrentAcronym) setLanceCurrentAcronym(ms.acronym);
    } else if (completedChallengesCount === 26) {
      const ms = getMilestoneDialogue(26, vibe, "Intern");
      setLanceCurrentSpeech(ms.lance);
      setLanceInternSpeech(ms.intern);
      if (setLanceCurrentAcronym) setLanceCurrentAcronym(ms.acronym);
    } else if (completedChallengesCount === 30) {
      const ms = getMilestoneDialogue(30, vibe, "Intern");
      setLanceCurrentSpeech(ms.lance);
      setLanceInternSpeech(ms.intern);
      if (setLanceCurrentAcronym) setLanceCurrentAcronym(ms.acronym);
    } else if (completedChallengesCount === 35) {
      const ms = getMilestoneDialogue(35, vibe, "Intern");
      setLanceCurrentSpeech(ms.lance);
      setLanceInternSpeech(ms.intern);
      if (setLanceCurrentAcronym) setLanceCurrentAcronym(ms.acronym);
    } else {
      // Standard completions
      const lastCompletedChallenge = CANONICAL_CHALLENGES.find(ch => ch.id === completedChallengesCount);
      if (lastCompletedChallenge) {
        const dialogue = getBranchingChallengeDialogue(lastCompletedChallenge, vibe);
        setLanceCurrentSpeech(dialogue.lanceCompletion);
        setLanceInternSpeech(dialogue.internCompletion);
        if (setLanceCurrentAcronym) {
          setLanceCurrentAcronym(dialogue.acronym);
        }
      }
    }
  }, [completedChallengesCount, setLanceCurrentSpeech, setLanceInternSpeech, setLanceCurrentAcronym, moodLogs]);
}
