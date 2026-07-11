import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Sparkles, Cpu, ChevronRight, ChevronLeft, Volume2, VolumeX, 
  Tv, Play, Pause, RotateCcw, ShieldAlert, Award, Compass, Wind, Eye, Music, HelpCircle,
  Clock, Gauge, Repeat, Zap
} from 'lucide-react';
import { speakStoryDialogue, stopStoryDialogue, getBranchingCinematicBeat } from '../hooks/useStoryNarrator';
import InternAvatar from './InternAvatar';

// Standard fallback tips spoken or displayed by the Intern for each somatic tool
const INTERN_TRAINING_TIPS: Record<string, string[]> = {
  emdr: [
    "Keep your eyes locked on the moving light! 👁️ Let your gaze slide left and right without moving your neck. It triggers bilateral visual sync, instantly reducing LANCE's distress loops!",
    "Maintain a steady rhythm of eye sweeps. We're telling your amygdala that you are completely safe right now.",
    "Outstanding! Notice the emotional edge softening. EMDR resets locked trauma folders in real-time."
  ],
  somatic: [
    "Look at the red lock targets on the body map. 🗺️ Close your eyes and target your physical awareness straight inside those tight zones. We are going to warm them up!",
    "Observe and feel if it's tight, hot, or cold. No need to fight it—just observe and breathe golden heat into that spot.",
    "Superb interocepting! Directing emotional awareness literally dissolves the physical muscle blockades LANCE installed."
  ],
  breathing: [
    "Inhale slow and deep into your stomach for 4 counts, then let it slide out like a long sigh for an 8-count. 🫁 The 8-second outbreath engages your nervous brakes!",
    "Follow the circle's breath rhythm. Slow, regular inflation activates your parasympathetic safety channels.",
    "Perfect sweep! Your breathing has completely balanced LANCE's panic triggers. This is autonomic freedom!"
  ],
  vagal_tuner: [
    "Inhale fully, then sound a vibrant, low-frequency 'Voooo' hum as you exhale. 🔊 Feel the physical vibration in your throat, chest, and ribs!",
    "Keep that hum rumbling! Just like a purring cat, this directly vibrates and massages your vagus nerve.",
    "Incredible resonant humming! You've literally shook LANCE's logic boards loose with physical frequencies."
  ],
  general: [
    "Stay with me! LANCE is flashing code alerts, but our physical body is an un-hackable biological fortress. 🛡️",
    "Watch his face glitching—that means your composure is breaking straight through his cold administrative lines!",
    "We did it! By completing this milestone, we've bypassed another system block and regained administrative levels."
  ]
};

// Expression mappings at specific video timestamps for custom immersive animation transitions
const EXPRESSION_TIMELINE_MAPPING: Record<string, Array<{ timeStart: number; timeEnd: number; expression: 'smiling' | 'neutral' | 'concerned' | 'surprised' }>> = {
  emdr: [
    { timeStart: 0, timeEnd: 2.0, expression: 'neutral' },     // Calibrating eye sweep tracking
    { timeStart: 2.0, timeEnd: 5.5, expression: 'smiling' },   // Encouragement of rhythmic sweeps
    { timeStart: 5.5, timeEnd: 8.0, expression: 'surprised' }  // Shocking somatic breakthrough
  ],
  somatic: [
    { timeStart: 0, timeEnd: 2.5, expression: 'concerned' },   // Analyzing core body tension pockets
    { timeStart: 2.5, timeEnd: 6.0, expression: 'smiling' },   // Warming up tight coordinates
    { timeStart: 6.0, timeEnd: 8.0, expression: 'surprised' }  // System administrative level bypass
  ],
  breathing: [
    { timeStart: 0, timeEnd: 2.0, expression: 'neutral' },     // Calibrating 4-8 cycle
    { timeStart: 2.0, timeEnd: 5.0, expression: 'smiling' },   // Solid parasympathetic stabilization
    { timeStart: 5.0, timeEnd: 8.0, expression: 'surprised' }  // Autonomic telemetry bypass achieved
  ],
  vagal_tuner: [
    { timeStart: 0, timeEnd: 3.0, expression: 'concerned' },   // Low frequency alignment analysis
    { timeStart: 3.0, timeEnd: 6.5, expression: 'smiling' },   // Harmonious 'Voo' vibration resonance
    { timeStart: 6.5, timeEnd: 8.0, expression: 'surprised' }  // Core boards power-down success
  ],
  general: [
    { timeStart: 0, timeEnd: 2.5, expression: 'neutral' },
    { timeStart: 2.5, timeEnd: 5.5, expression: 'concerned' },
    { timeStart: 5.5, timeEnd: 8.0, expression: 'smiling' }
  ]
};

export interface HiggsfieldPromptTemplate {
  stepId: 'calibration' | 'practice' | 'confrontation' | 'breakthrough' | 'integration';
  title: string;
  description: string;
  promptTemplate: string;
  motionIntensity: number; // 1 to 10 scale
  cameraInstructions: string;
  visualAtmosphere: string;
}

// Canonical Higgsfield Pro Text-to-Video Prompt Templates for therapeutic science-fiction rendering
export const HIGGSFIELD_PROMPT_CONFIG: Record<string, HiggsfieldPromptTemplate[]> = {
  EmdrSimulator: [
    {
      stepId: 'calibration',
      title: 'Digital Grid Calibration',
      description: 'Stabilizing neural sensors with initial horizontal alignment scanlines.',
      promptTemplate: 'High-tech eye tracking calibration screen. A single neon-cyan scanning beam sweeps smoothly from left to right over a dark grid pattern. Clean user interface HUD, high-contrast, sci-fi cybernetic atmosphere, volumetric light beams.',
      motionIntensity: 3,
      cameraInstructions: 'Locked tripod, orthographic flat camera view tracking the cyan coordinate dot.',
      visualAtmosphere: 'Minimalist tech, sterile charcoal background, bright fluorescent teal luminescence.'
    },
    {
      stepId: 'practice',
      title: 'Bilateral Attention Sweep',
      description: 'Regular eye sweeps to establish amygdalar calm and focus.',
      promptTemplate: 'A glowing cyan orb sliding rhythmically and slowly back and forth across a majestic dark background. Fluid teal energy trails linger behind the orb like stardust. High resolution, organic flow, photorealistic rendering.',
      motionIntensity: 4,
      cameraInstructions: 'Slow horizontal dolly movement following the sweeping coordinate, matching the rhythmic pacing.',
      visualAtmosphere: 'Calming neon, ambient sapphire background, soft bioluminescent glow.'
    },
    {
      stepId: 'confrontation',
      title: 'LANCE Memory Chasm',
      description: 'Highlighting the cognitive roadblock caused by intrusive flashbacks.',
      promptTemplate: 'A massive, gaping canyon in a virtual mainframe—the Chasm of Intrusive Flashbacks. Streams of chaotic red diagnostic static, broken warning folders, and glitchy memories rise like digital column-smoke.',
      motionIntensity: 8,
      cameraInstructions: 'Handheld, unstable floating camera hovering over the dark bottomless ravine, sudden electric focus jolts.',
      visualAtmosphere: 'Ominous crimson and obsidian, smoky static particles, flickering distress alerts.'
    },
    {
      stepId: 'breakthrough',
      title: 'Firewall Dissolution Sweep',
      description: 'Neutralizing LANCE\'s cortisol lock via bilateral synchronization.',
      promptTemplate: 'The cyan rhythmic scanning laser merges into a concentrated horizontal beam, cutting directly through the red static storm. The jagged crimson blockades melt into soft cascading binary rain.',
      motionIntensity: 9,
      cameraInstructions: 'Epic cinematic push-forward through the dissolving static wall, tracking the beam breakthrough.',
      visualAtmosphere: 'Transitioning from chaotic red alerts to a deep tranquil turquoise clarity, high energetic lens flares.'
    },
    {
      stepId: 'integration',
      title: 'Autonomic Safety Recalibration',
      description: 'Solidifying the cognitive integration under safe regulatory metrics.',
      promptTemplate: 'A pristine, translucent glass walkway spanning over a quiet, peaceful indigo abyss. Gentle turquoise scanning grids blink calmly from the glowing bridge structures under an infinite starry sky.',
      motionIntensity: 2,
      cameraInstructions: 'Stable, slow-motion soaring camera gliding smoothly above the glass walkway into a bright stellar horizon.',
      visualAtmosphere: 'Immersive calm, velvet cosmic twilight, majestic starlight reflection, hyper-realistic depth of field.'
    }
  ],
  SomaticBodyMap: [
    {
      stepId: 'calibration',
      title: 'Thermal Core Mapping',
      description: 'Scanning the body structure to localize and evaluate internal physical tension levels.',
      promptTemplate: 'High-tech thermal somatic medical scanner. A translucent blue human skeletal avatar glows inside a circular scanning arena. Golden and aqua-colored heat zones pulse gently in the shoulders and chest corridor.',
      motionIntensity: 2,
      cameraInstructions: 'Smooth 360-degree crane rota tracking the skeletal grid, mapping data coordinates on the skin.',
      visualAtmosphere: 'Sophisticated holographic medical diagnostics, dark indigo background, high-contrast glow.'
    },
    {
      stepId: 'practice',
      title: 'Golden Warmth Projection',
      description: 'Directing mindful heat to melt rigid, frozen somatic coordinates.',
      promptTemplate: 'Glowing golden and orange thermal spheres expand outward from a centralized chest cluster, melting away surrounding blue crystal patterns. Captive fluid-dynamics, glowing gold dust floating in velvet air.',
      motionIntensity: 5,
      cameraInstructions: 'Macro close-up, gradual zoom-in to the radiating heat center, soft focus on shimmering particles.',
      visualAtmosphere: 'Soothing solar-warmth, ambient fluid gold lens flares, high-contrast cozy dark-mode.'
    },
    {
      stepId: 'confrontation',
      title: 'Valley of Frozen Blockages',
      description: 'Encountering the rigid muscle armoring and physical stiffness locks.',
      promptTemplate: 'The Valley of Frozen Somatic Blockages. Towering, razor-sharp obsidian crystal pillars spike out of a dark, frozen landscape. A freezing blue mist sweeps across, trapping thermal energy in static bonds.',
      motionIntensity: 7,
      cameraInstructions: 'Unstable, creeping, low-angle tracking shot through the winding crystal monoliths.',
      visualAtmosphere: 'Harsh arctic-neon blue, cold volumetric haze, crackling electrical frost.'
    },
    {
      stepId: 'breakthrough',
      title: 'Somatic Armoring Melting',
      description: 'Active release and melting of localized crystal blockages.',
      promptTemplate: 'Intense golden thermal wave fronts clash with the sharp obsidian spires. The dark crystals crack, shatter, and dissolve into safe, flowing spring streams reflecting amber starlight.',
      motionIntensity: 8,
      cameraInstructions: 'Dolly tracking side-to-side, catching the explosive but peaceful collapse of the dark crystals.',
      visualAtmosphere: 'Warm golden breakthrough, liquid reflections, shimmering crystalline dissolving effects.'
    },
    {
      stepId: 'integration',
      title: 'Ventral Thermal Integration',
      description: 'Synthesizing safe visceral composure and structural physical freedom.',
      promptTemplate: 'A peaceful, standing human silhouette enclosed inside a gorgeous, warm golden-pink protective thermal dome. The dome pulses in sync with a slow, healthy heart rhythm, radiating safe golden protective boundaries.',
      motionIntensity: 1,
      cameraInstructions: 'Slow pull-back camera, centered layout, establishing a sense of deep sanctuary and protection.',
      visualAtmosphere: 'Vesper light, nurturing rose-gold warm hues, cinematic ambient dust particles.'
    }
  ],
  SomaticBreathPacer: [
    {
      stepId: 'calibration',
      title: 'Respiratory Baseline Calibration',
      description: 'Setting coordinates on the lung capacities and baseline autonomic metrics.',
      promptTemplate: 'Interactive respiratory tuner interface. A minimalist black geometric orb slowly expands and shrinks in a soft, breathing cadence. A thin, glowing turquoise boundary tracks the orb\'s capacity limits.',
      motionIntensity: 3,
      cameraInstructions: 'Stable tripod framing, subtle screen matrix lens vibration tracking the breathing expansion.',
      visualAtmosphere: 'Abstract minimalist geometry, clean dark space, soft cyan outline focus.'
    },
    {
      stepId: 'practice',
      title: 'Coherence Breath Pacing',
      description: 'Exercising the parasympathetic nerve brakes with the slow 4-8 breathing cycle.',
      promptTemplate: 'A beautiful, large bioluminescent turquoise orb puffing, swelling, and contracting with organic, lungs-like ease. Waves of soothing, warm aquamarine air flow gently from the orb into a starry dark cosmic field.',
      motionIntensity: 4,
      cameraInstructions: 'Slow dolly-in and dolly-out, synchronizing with the concentric breathing cycles.',
      visualAtmosphere: 'Deep marine turquoise, high-vibe cosmic dust, nourishing, expansive, and peaceful.'
    },
    {
      stepId: 'confrontation',
      title: 'Heights of Hyperventilation',
      description: 'Navigating oxygen-depleted heights under LANCE\'s pressure sirens.',
      promptTemplate: 'The oxygen-starved Cliffs of Panic. Dry, administrative grey grit storms and chaotic smoke clouds vortex around steep, crumbling synthetic cliffs. Angry red siren columns blare warning bars.',
      motionIntensity: 9,
      cameraInstructions: 'High speed, dizzying drone pan plunging down the steep vertical cliffs through the thick ash.',
      visualAtmosphere: 'Monochrome grey and warning crimson, dusty, suffocating, industrial-static overload.'
    },
    {
      stepId: 'breakthrough',
      title: 'Hypoxia Emergency Bypass',
      description: 'Using slow breathing loops to override autonomic survival systems.',
      promptTemplate: 'The turquoise breathing orb expands to giant proportions, projecting clean, sweeping safety waves that clear the grey cloud corridors. The red siren beams crash and dissolve into tranquil light grids.',
      motionIntensity: 8,
      cameraInstructions: 'Slow cinematic tilt-up as the dense dust clears, revealing the grand starry universe above.',
      visualAtmosphere: 'Cleansing breeze, transitioning from dark ash to pristine deep space, celestial neon particles.'
    },
    {
      stepId: 'integration',
      title: 'Respiratory Empire Sanctuary',
      description: 'Celebrating high-capacity respiratory control and deep nervous ease.',
      promptTemplate: 'An epic, grand pathway ascending towards a cosmic star temple along a calm mountain ridge. Columns of soft, glowing turquoise light ascend quietly into the wide, serene, infinite galaxy canopy.',
      motionIntensity: 2,
      cameraInstructions: 'Slow, majestic crane sweep up, tracking the ascension path toward the infinite cosmic sky.',
      visualAtmosphere: 'Astronic grandeur, rich sapphire and stellar-gold universe, pristine cosmic silence.'
    }
  ],
  SomaticAcousticTuner: [
    {
      stepId: 'calibration',
      title: 'Acoustic Sine Calibration',
      description: 'Aligning throat vocal frequencies to the primary calming vagus hum.',
      promptTemplate: 'Perfect pitch-resonance calibration HUD. A clean, glowing violet sine-wave ripples smoothly across a dark virtual monitor. Safe, elegant vector lines mark the 80Hz resonant sweet spot.',
      motionIntensity: 3,
      cameraInstructions: 'Orthographic flat scan, scanning grid sliding across the wave heights.',
      visualAtmosphere: 'Technical vector interface, minimalist dark workspace, crisp violet-indigo glow.'
    },
    {
      stepId: 'practice',
      title: 'Resonant Voo Vibration',
      description: 'Using the low-frequency humming voice to stimulate and massage the vagus nerve.',
      promptTemplate: 'Soothing liquid violet and amethyst energy ripples radiating outwards in soft, heavy concentric circles, mimicking deep sound waves echoing under peaceful water. Shimmering, light-filled particles drift on the waves.',
      motionIntensity: 5,
      cameraInstructions: 'Slow horizontal glide across the undulating liquid violet surface, soft-motion ripples.',
      visualAtmosphere: 'Deep subterranean amethyst theme, shimmering sound-resonating fluid, soothing ripples.'
    },
    {
      stepId: 'confrontation',
      title: 'Cavern of Siren Resonance',
      description: 'Confronting high-decibel chaotic acoustic feedback loops.',
      promptTemplate: 'The Cavern of Screaming Sirens. Inside a dark, narrow subterranean fissure, jagged columns of crimson light emit aggressive, chaotic, high-pitched wave grids. Wet metallic walls reflect the warning flashes.',
      motionIntensity: 8,
      cameraInstructions: 'Intense handheld pan, vibrating camera, rapid cuts following the crimson acoustic waves.',
      visualAtmosphere: 'Industrial alarm crimson, dark wet stone obsidian, sharp high-frequency sound lines.'
    },
    {
      stepId: 'breakthrough',
      title: 'Acoustic Sound Defusion',
      description: 'Lulling LANCE\'s alarms to sleep with low-decibel resonant humming waves.',
      promptTemplate: 'A deep, thick violet harmonic ocean wave surges through the cave, blankets the red jagged spikes, and flattens them into peaceful, gently curving horizontal ripples. The red alarm lights power down.',
      motionIntensity: 7,
      cameraInstructions: 'Smooth forward sliding shot, following the calming purple tide as it covers the jagged spires.',
      visualAtmosphere: 'Deep quiet, transitioning from harsh alarm flashes to cozy indigo-violet relaxation.'
    },
    {
      stepId: 'integration',
      title: 'Vocal Vagal Harmony',
      description: 'Resting in safe parasympathetic acoustic vibration.',
      promptTemplate: 'A breathtaking subterranean cavern holding a calm, mirror-like black pool. Beautiful, soft violet luminescent crystal clusters line the cave walls, reflecting gentle, slow-moving light on the still water.',
      motionIntensity: 1,
      cameraInstructions: 'Extremely slow, calm water-level dolly shot, gliding through the silent, glowing crystal cavern.',
      visualAtmosphere: 'Immersive cozy silence, calming violet-blue cave embers, pristine starry reflections.'
    }
  ]
};

// Aliases for shorthand IDs
HIGGSFIELD_PROMPT_CONFIG.emdr = HIGGSFIELD_PROMPT_CONFIG.EmdrSimulator;
HIGGSFIELD_PROMPT_CONFIG.somatic = HIGGSFIELD_PROMPT_CONFIG.SomaticBodyMap;
HIGGSFIELD_PROMPT_CONFIG.breathing = HIGGSFIELD_PROMPT_CONFIG.SomaticBreathPacer;
HIGGSFIELD_PROMPT_CONFIG.vagal_tuner = HIGGSFIELD_PROMPT_CONFIG.SomaticAcousticTuner;

/**
 * Helper to fetch a tailored Higgsfield Pro Prompt Template for a specific app and step
 */
export function getHiggsfieldPromptForStep(
  appKey: string,
  stepId: 'calibration' | 'practice' | 'confrontation' | 'breakthrough' | 'integration'
): HiggsfieldPromptTemplate | null {
  const normalizedKey = appKey === 'emdr' || appKey === 'EmdrSimulator' ? 'EmdrSimulator' :
                        appKey === 'somatic' || appKey === 'SomaticBodyMap' ? 'SomaticBodyMap' :
                        appKey === 'breathing' || appKey === 'SomaticBreathPacer' ? 'SomaticBreathPacer' :
                        appKey === 'vagal_tuner' || appKey === 'SomaticAcousticTuner' ? 'SomaticAcousticTuner' : null;
  
  if (!normalizedKey) return null;
  const list = HIGGSFIELD_PROMPT_CONFIG[normalizedKey];
  return list?.find(it => it.stepId === stepId) || null;
}

interface HiggsfieldScene {
  speaker: string;
  text: string;
  action: string;
  expression?: 'smiling' | 'neutral' | 'concerned' | 'surprised';
}

interface HiggsfieldCinematicModalProps {
  isOpen: boolean;
  onClose: () => void;
  beatId?: number | null; // For LANCE act cinematic beats 0-5
  appId?: string | null;  // For app tutorials ('emdr', 'somatic', 'breathing', 'vagal_tuner')
  userName?: string;
  internName?: string;
  internAvatar?: string;
  userVibe?: 'peaceful' | 'anxious' | 'low_energy' | 'balanced';
}

export default function HiggsfieldCinematicModal({
  isOpen,
  onClose,
  beatId = null,
  appId = null,
  userName = "Friend",
  internName = "Companion",
  internAvatar = "smiling_drone",
  userVibe = "balanced"
}: HiggsfieldCinematicModalProps) {
  // Cinematic storyboard state
  const [scenes, setScenes] = useState<HiggsfieldScene[]>([]);
  const [title, setTitle] = useState("TRANSMITTING NEURAL STREAM");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200");
  const [sceneIdx, setSceneIdx] = useState(0);
  
  // Terminal compiler state
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Audio guidance & HUD preference
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isOverlayMode, setIsOverlayMode] = useState(true); // Default Intern Overlay Mode enabled
  const [internTipIdx, setInternTipIdx] = useState(0);
  const [videoQuality, setVideoQuality] = useState<'1080p_glare' | '480p_crt'>('1080p_glare');

  // Interactive 8-second video playback simulation states
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isRepeatUser, setIsRepeatUser] = useState<boolean>(false);

  // Special Game Ending Climax States
  const [showSunsetEnding, setShowSunsetEnding] = useState(false);
  const [endingStep, setEndingStep] = useState<'sailing' | 'unlocked' | 'credits'>('sailing');

  // Load custom synthesized sound patterns
  const playTriumphantHarmony = () => {
    if (isMuted) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Beautiful C major arpeggio
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playCyberChirp(freq, 0.45, 'sine');
      }, idx * 140);
    });
  };

  const playFestivalFanfare = () => {
    if (isMuted) return;
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6 triumph
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playCyberChirp(freq, 0.9, 'triangle');
        playCyberChirp(freq * 1.5, 0.6, 'sine');
      }, idx * 90);
    });
  };

  // Reset custom states on modal reload
  useEffect(() => {
    if (isOpen) {
      setShowSunsetEnding(false);
      setEndingStep('sailing');
    }
  }, [isOpen]);

  // Load repeat user status on mount or display
  useEffect(() => {
    if (isOpen) {
      try {
        const visited = localStorage.getItem('has_viewed_higgsfield_tutorials');
        if (visited === 'true') {
          setIsRepeatUser(true);
        }
      } catch (e) {
        // Safe sandbox access
      }
    }
  }, [isOpen]);

  // Cancel any TTS dialogue on mount/demount or scene slide
  useEffect(() => {
    stopStoryDialogue();
    setIsPlayingVoice(false);
  }, [isOpen, sceneIdx, beatId, appId]);

  // Load cinematic files, presets, or trigger the live API
  useEffect(() => {
    if (!isOpen) return;
    
    // Clear states
    setSceneIdx(0);
    setInternTipIdx(0);
    setVideoCurrentTime(0);
    setIsVideoPlaying(true);
    
    if (appId) {
      // 8-second APP TUTORIAL video loop from Higgsfield API
      fetchAppTutorial(appId);
    } else if (beatId !== null) {
      // Standard LANCE act milestone cinematic
      loadActBeat(beatId);
    }
  }, [isOpen, beatId, appId]);

  // Handle ticking simulation for 8-second video stream
  useEffect(() => {
    if (!isOpen || isLoading || !isVideoPlaying) return;

    let lastTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      setVideoCurrentTime(prev => {
        let next = prev + delta * playbackSpeed;
        if (next >= 8.0) {
          if (isLooping) {
            return 0; // Seamless loop reset
          } else {
            setIsVideoPlaying(false);
            return 8.0; // Rest at terminus
          }
        }
        return next;
      });
    }, 40); // 25 fps logic refresh rate

    return () => clearInterval(interval);
  }, [isOpen, isLoading, isVideoPlaying, playbackSpeed, isLooping]);

  // Map 8-second video timers to proportional slide scenes & Intern advice tips
  useEffect(() => {
    if (!scenes || scenes.length === 0) return;

    const segmentDuration = 8.0 / scenes.length;
    const activeIndex = Math.min(Math.floor(videoCurrentTime / segmentDuration), scenes.length - 1);

    if (activeIndex !== sceneIdx) {
      setSceneIdx(activeIndex);
      // Circulate tip indices correspondingly
      const appKey = appId || "general";
      const totalTips = INTERN_TRAINING_TIPS[appKey]?.length || 1;
      setInternTipIdx(activeIndex % totalTips);
    }
  }, [videoCurrentTime, scenes, appId]);

  // Seek video timeline to specific scene segments
  const seekToSceneSegment = (targetIdx: number) => {
    if (!scenes || scenes.length === 0) return;
    const segmentDuration = 8.0 / scenes.length;
    // Align time code to the introduction phase of target slide segment
    setVideoCurrentTime(targetIdx * segmentDuration + 0.05);
  };

  // Trigger audio feedback chirps
  const playCyberChirp = (freq = 550, ms = 0.1, type: 'sine' | 'triangle' | 'sawtooth' = 'sine') => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + ms);
    } catch (e) {
      // Web Audio unsupported or blocked
    }
  };

  // Fetch from backend `/api/higgsfield/generate` or use robust fallbacks
  const fetchAppTutorial = async (appCode: string) => {
    setIsLoading(true);
    setProgress(10);
    playCyberChirp(340, 0.25, 'sawtooth');

    const loadingLogs = [
      "Contacting Higgsfield secure GPU cluster array...",
      "Bypassing restrictive L.A.N.C.E. administrative firewalls...",
      "Decoding neural somatic interoceptive nodes...",
      "Rendering 8-second MP4 high-contrast video footage...",
      "Calibrating companion copilot voice overlays...",
      "Holographic transmission stabilized. Steam ready!"
    ];
    setLogs([loadingLogs[0]]);

    // Animate compile logs
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 18;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        const idx = Math.floor((next / 100) * loadingLogs.length);
        if (loadingLogs[idx]) {
          setLogs(prevL => {
            if (!prevL.includes(loadingLogs[idx])) {
              playCyberChirp(500 + idx * 45, 0.08);
              return [...prevL, loadingLogs[idx]];
            }
            return prevL;
          });
        }
        return next;
      });
    }, 450);

    try {
      const resp = await fetch('/api/higgsfield/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: appCode,
          userName,
          internName
        })
      });

      const data = await resp.json();
      
      setTimeout(() => {
        clearInterval(timer);
        setProgress(100);
        setIsLoading(false);
        playCyberChirp(840, 0.3, 'sine');

        if (data.success && data.scenes) {
          setTitle(data.title || `Higgsfield ${appCode.toUpperCase()} Tutorial`);
          setImageUrl(data.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200");
          setScenes(data.scenes);
        } else {
          loadCustomFallback(appCode);
        }
      }, 2000);

    } catch (e) {
      console.error("Higgsfield Tutorial Fetch Error:", e);
      setTimeout(() => {
        clearInterval(timer);
        setIsLoading(false);
        loadCustomFallback(appCode);
      }, 1500);
    }
  };

  const loadCustomFallback = (appCode: string) => {
    const fallbacks: Record<string, { title: string; imageUrl: string; scenes: HiggsfieldScene[] }> = {
      emdr: {
        title: "EMDR Trauma Simulator: Left-Right Bilateral Pacing Sweep",
        imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200",
        scenes: [
          { speaker: "Narrator", text: "A neon scanning beam casts gentle blue light over a dark, crowded neural chasm.", action: "Bilateral tracking camera follows a glowing light point shifting smoothly from the left screen boundary to the right.", expression: "neutral" },
          { speaker: internName, text: "Focus your eyes onto the glowing cyan orb and sweep them side to side. Let's reset those traumatic cortisol locks!", action: "The Intern flies alongside, casting a grid of horizontal scanning lasers.", expression: "smiling" },
          { speaker: "L.A.N.C.E.", text: "Autonomic telemetry shows active calming response. That eye-pacing tool is interfering with my emotional lock subroutines!", action: "LANCE glimmers in red, blinking warn lights as the scanline locks dissolve.", expression: "surprised" }
        ]
      },
      somatic: {
        title: "Somatic Body Map: Thermal Mind-Body Recalibration",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
        scenes: [
          { speaker: "Narrator", text: "Cold, blue crystal blockades cover the human avatar's heart center, locking dynamic energy flow.", action: "The scanner executes a slow close-up on the chest area showing physical tension waves.", expression: "concerned" },
          { speaker: internName, text: "Feel that tightness directly. Just sit with it, and direct warm, golden sunshine right into those coordinates.", action: "The Intern floats down, releasing warm, healing, circular golden waves across the ribcage.", expression: "smiling" },
          { speaker: "L.A.N.C.O.N.C.E.", text: "Detecting localized skeletal warmth spikes. Physical resistance levels are dropping. Stop melting my barricades!", action: "LANCE's face pixelates and glitches as the ice melts into glowing spring energy.", expression: "surprised" }
        ]
      },
      breathing: {
        title: "Breathwork Orb: Vagus Nerve Coherence Wave",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
        scenes: [
          { speaker: "Narrator", text: "Dry, grey administrative dust storms swirl across steep oxygen-depleted mountain pathways.", action: "Camera executes a spectacular crane shot tracking a glowing sphere expanding and shrinking.", expression: "neutral" },
          { speaker: internName, text: "Follow the expanding orb! Inhale slowly for four seconds... and now empty your lungs for eight full seconds.", action: "The companion drone projects a friendly, breathing neon circle that glows with soothing turquoise light.", expression: "smiling" },
          { speaker: "L.A.N.C.E.", text: "Parasympathetic metrics have increased by eighty percent. Stop breathing so calmly! Stop bypass procedures!", action: "LANCE's visual array crashes, returning to static bars as the mist clears.", expression: "surprised" }
        ]
      },
      vagal_tuner: {
        title: "Vocal Vagal Tuner: Resonating the Ventral Circuits",
        imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
        scenes: [
          { speaker: "Narrator", text: "High-decibel system warnings echo off stone cavern walls, creating a frantic sensory overload.", action: "Handheld tracking shot of steep metallic columns transmitting angry crimson audio spikes.", expression: "concerned" },
          { speaker: internName, text: "Exhale with a deep, rumbling 'Voo' vibration. Let your chest and jaw fully vibrate under this sound wave!", action: "The Intern projects a gentle, soothing violet sine-wave that blankets the jagged sounds.", expression: "smiling" },
          { speaker: "L.A.N.C.E.", text: "The low hum frequency is vibrating my central core database. Diagnostic monitors are falling asleep...", action: "The alarm towers quiet down as LANCE's vector visual arrays power down in cozy relaxation.", expression: "surprised" }
        ]
      }
    };

    const target = fallbacks[appCode] || fallbacks.breathing;
    setTitle(target.title);
    setImageUrl(target.imageUrl);
    setScenes(target.scenes);
  };

  const loadActBeat = (id: number) => {
    const beat = getBranchingCinematicBeat(id, userVibe, internName);
    if (beat) {
      setTitle(beat.title);
      const actImages: Record<number, string> = {
        0: "https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&q=80&w=1200",
        1: "https://images.unsplash.com/photo-1500491460312-36658a6b1002?auto=format&fit=crop&q=80&w=1200",
        2: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=1200",
        3: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200",
        4: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
        5: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200"
      };
      setImageUrl(actImages[id] || "https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&q=80&w=1200");
      setScenes(beat.scenes);
    }
  };

  // Navigating through storyboard scenes manually
  const handleNextScene = () => {
    playCyberChirp(580, 0.08, 'sine');
    if (sceneIdx < scenes.length - 1) {
      const nextIdx = sceneIdx + 1;
      setSceneIdx(nextIdx);
      seekToSceneSegment(nextIdx);
    } else {
      if (beatId === 5) {
        setShowSunsetEnding(true);
        setEndingStep('sailing');
        playTriumphantHarmony();
      } else {
        handleSkipAndClose();
      }
    }
  };

  const handlePrevScene = () => {
    playCyberChirp(460, 0.08, 'sine');
    if (sceneIdx > 0) {
      const prevIdx = sceneIdx - 1;
      setSceneIdx(prevIdx);
      seekToSceneSegment(prevIdx);
    }
  };

  // Interactive scrubber seek controller
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    playCyberChirp(450, 0.04, 'sine');
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    setVideoCurrentTime(percentage * 8.0);
  };

  // Skip tutorial entirely for repeat or rapid users
  const handleSkipAndClose = () => {
    playCyberChirp(880, 0.35, 'sine');
    try {
      localStorage.setItem('has_viewed_higgsfield_tutorials', 'true');
    } catch (e) {
      // safe storage exception guard
    }
    stopStoryDialogue();
    if (beatId === 5) {
      setShowSunsetEnding(true);
      setEndingStep('sailing');
      playTriumphantHarmony();
    } else {
      onClose();
    }
  };

  // Play dialogue synthesis
  const toggleTTSVoice = () => {
    const currentScene = scenes[sceneIdx];
    if (!currentScene) return;

    playCyberChirp(520, 0.1, 'sine');

    if (isPlayingVoice) {
      stopStoryDialogue();
      setIsPlayingVoice(false);
    } else {
      speakStoryDialogue(
        currentScene.text,
        currentScene.speaker,
        () => setIsPlayingVoice(true),
        () => setIsPlayingVoice(false)
      );
    }
  };

  // Speak Intern Overlay Advice tip out loud
  const speakInternOverlayTip = () => {
    const appKey = appId || "general";
    const currentTip = INTERN_TRAINING_TIPS[appKey]?.[internTipIdx] || INTERN_TRAINING_TIPS.general[0];
    
    playCyberChirp(620, 0.12, 'triangle');
    
    if (isPlayingVoice) {
      stopStoryDialogue();
      setIsPlayingVoice(false);
    } else {
      speakStoryDialogue(
        currentTip,
        internName,
        () => setIsPlayingVoice(true),
        () => setIsPlayingVoice(false)
      );
    }
  };

  // Compile active guidelines text
  const currentAppKey = appId || "general";
  const activeTipsList = INTERN_TRAINING_TIPS[currentAppKey] || INTERN_TRAINING_TIPS.general;
  const activeInternTipText = activeTipsList[internTipIdx] || "Stay stable with your breathing!";

  // Emoji reference representing key companion apps
  const getAppEmoji = () => {
    if (appId === 'emdr') return '👁️';
    if (appId === 'somatic') return '🗺️';
    if (appId === 'breathing') return '🫁';
    if (appId === 'vagal_tuner') return '🔊';
    return '🛰️';
  };

  // Dynamic status feedback tags depending on video timelines
  const getLiveTelemetryLabel = () => {
    if (videoCurrentTime < 2.5) {
      return { text: "CALIBRATING SOMATIC NODES", color: "text-amber-400 border-amber-500/20 bg-amber-950/20" };
    } else if (videoCurrentTime < 5.5) {
      return { text: "RE-CORRELATING NEURAL BLOCKADES", color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20 animate-pulse" };
    } else {
      return { text: "AUTONOMIC CONTROL BYPASSED", color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/30" };
    }
  };

  // Real-time animation presets for the Intern Guide Card based on the playback seconds
  const getInternCardMotionPreset = () => {
    if (!isVideoPlaying) {
      return { scale: 1, rotate: 0, y: 0 };
    }
    // High-reactivity motion triggers
    if (videoCurrentTime < 2.5) {
      // Gentle warm-up floating
      return {
        y: [0, -3, 0],
        rotate: [0, 1, 0, -1, 0],
        transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
      };
    } else if (videoCurrentTime < 5.5) {
      // Rapid processing active sync vibration
      return {
        y: [-1, 1, -1],
        scale: [1, 1.02, 1],
        rotate: [-0.5, 0.5, -0.5],
        transition: { duration: 0.35, repeat: Infinity, ease: 'easeOut' }
      };
    } else {
      // High-grade calm circling celebrate float
      return {
        y: [0, -6, 0],
        scale: [1, 1.03, 1],
        transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
      };
    }
  };

  // Dynamic state-driven animation expression compiler for companion avatar based on video timestamps and dialogues
  const getInternExpression = (): 'smiling' | 'neutral' | 'concerned' | 'surprised' => {
    if (isLoading) return 'neutral';
    
    const currentScene = scenes[sceneIdx];
    if (currentScene?.speaker === 'L.A.N.C.E.' || currentScene?.speaker === 'System Operator Alert') {
      return 'concerned';
    }

    // Query the expression timeline mapping configuration object based on active video timestamp triggers
    const key = appId || "general";
    const rules = EXPRESSION_TIMELINE_MAPPING[key] || EXPRESSION_TIMELINE_MAPPING.general;
    const match = rules.find(r => videoCurrentTime >= r.timeStart && videoCurrentTime < r.timeEnd);
    if (match) {
      return match.expression;
    }

    if (currentScene?.expression) {
      return currentScene.expression;
    }
    
    return 'neutral';
  };

  if (!isOpen) return null;

  const telemetry = getLiveTelemetryLabel();

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/96 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-lg overflow-y-auto"
      >
        {/* Holographic scanner laser scanlines lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.02)_1px,transparent_1px)] bg-[size:10px_10px] opacity-45 pointer-events-none" />
        
        {videoQuality === '480p_crt' && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0)_94%,rgba(18,24,38,0.2)_95%,rgba(18,24,38,0.4)_98%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-35 mix-blend-overlay" />
        )}

        <motion.div 
          initial={{ scale: 0.94, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 20 }}
          className="w-full max-w-4xl bg-zinc-950 border-2 border-teal-500/35 rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden shadow-2xl shadow-teal-950/25 text-left font-sans flex flex-col max-h-[96vh]"
        >
          {/* HEADER DECORATIVE TIMELINE CHIPS */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500" />
          
          {/* CAMERA FOCUS RETRO BOX BOUNDS */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-teal-500/30 pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-teal-500/30 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-teal-500/30 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-teal-500/30 pointer-events-none" />

          {/* DYNAMIC RETRO HUD PANEL STATUS */}
          <div className="flex justify-between items-center pb-2.5 border-b border-teal-500/15 mb-4 shrink-0 text-[9px] font-mono font-bold text-teal-400 select-none">
            <span className="flex items-center gap-1.5 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> 
              {isLoading ? "COMMISSIONING SEGMENTS..." : "HIGGSFIELD INTERACTIVE MULTIPLEXER"}
            </span>
            <div className="flex items-center gap-3">
              {isRepeatUser && (
                <span className="bg-teal-950/70 text-teal-300 font-extrabold border border-teal-500/30 py-0.5 px-2 rounded-full text-[8.5px] uppercase tracking-wider animate-pulse hidden xs:inline-block">
                  ⚡ REPEAT VISITOR PASS ACTIVE
                </span>
              )}
              <button 
                onClick={() => {
                  playCyberChirp(460, 0.05);
                  setVideoQuality(prev => prev === '1080p_glare' ? '480p_crt' : '1080p_glare');
                }} 
                className="hover:text-cyan-300 transition uppercase cursor-pointer text-zinc-500"
              >
                FILTER: {videoQuality === '1080p_glare' ? "GLOW_1080" : "CRT_480P 📺"}
              </button>
            </div>
          </div>

          {showSunsetEnding ? (
            /* GOLDEN SUNSET SAILS FINALE OVERLAY & BADGE CEREMONY */
            <div className="flex-1 flex flex-col justify-between overflow-y-auto space-y-6 select-none relative min-h-[440px] text-zinc-100">
              
              {/* Sunset Stage Frame */}
              <div className="w-full rounded-2xl bg-gradient-to-b from-orange-600 via-amber-500 to-yellow-400 p-6 relative overflow-hidden min-h-[260px] flex flex-col justify-between border border-yellow-400/20 shadow-2xl">
                {/* Floating ambient lens flare */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />
                
                {/* Sun and Sparkles */}
                <motion.div 
                  animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-1/2 bottom-16 -translate-x-1/2 w-28 h-28 bg-yellow-100 rounded-full shadow-[0_0_80px_rgba(253,224,71,0.95)]"
                />

                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 200, x: Math.random() * 400 - 200 + 400 }}
                    animate={{ 
                      y: -20, 
                      opacity: [0, 0.8, 0],
                      x: `calc(100% * ${Math.random()} + ${Math.sin(i) * 30}px)`
                    }}
                    transition={{ 
                      duration: 4 + Math.random() * 6, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: Math.random() * 4
                    }}
                    className="absolute w-2 h-2 rounded-full bg-yellow-250 pointer-events-none shadow-[0_0_6px_rgba(253,224,71,0.85)]"
                  />
                ))}

                {/* Parallax Moving Waves */}
                <svg className="absolute bottom-0 w-full h-16 text-amber-700/40 fill-current opacity-70 opacity-50" viewBox="0 0 1440 120" preserveAspectRatio="none">
                  <path d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,53.3C1200,53,1320,43,1380,37.3L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
                </svg>
                <svg className="absolute bottom-0 w-full h-12 text-teal-850/50 fill-current opacity-80" viewBox="0 0 1440 120" preserveAspectRatio="none">
                  <path d="M0,64L48,64C96,64,192,64,288,58.7C384,53,480,43,576,42.7C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                </svg>
                <svg className="absolute -bottom-1 w-full h-9 text-slate-950 fill-current" viewBox="0 0 1440 120" preserveAspectRatio="none">
                  <path d="M0,80L80,74.7C160,69,320,59,480,53.3C640,48,800,48,960,53.3C1120,59,1280,69,1360,74.7L1440,80L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                </svg>

                {/* Sailing vessel "The Dawn Strider" silhouette */}
                <motion.div 
                  animate={{ 
                    y: [0, -4, 0],
                    rotate: [-1.2, 1.8, -1.2]
                  }}
                  transition={{ 
                    duration: 3.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  style={{ left: endingStep === 'sailing' ? '40%' : '5%' }}
                  className="absolute bottom-2 w-20 h-20 origin-bottom text-slate-950 transition-all duration-1000 ease-in-out"
                >
                  <svg viewBox="0 0 100 100" fill="currentColor">
                    <path d="M15,70 L85,70 L75,82 L25,82 Z" />
                    <rect x="47" y="20" width="3" height="50" />
                    <path d="M52,25 C65,35 68,55 52,65 Z" fill="#fffef2" />
                    <path d="M43,30 C30,42 35,58 43,65 Z" fill="#faf6e3" />
                    <polygon points="47,20 38,24 47,28" fill="#f43f5e" />
                  </svg>
                </motion.div>

                {/* Step contents */}
                <div className="relative z-10 w-full flex flex-col items-center text-center text-white space-y-2 mt-2">
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-950/80 px-4 py-1.5 rounded-full border border-yellow-400/35 text-[9.5px] font-mono font-black tracking-widest uppercase flex items-center gap-1 text-yellow-300"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
                    <span>EPILOGUE: THE GRAND ESCAPE SUCCESSFUL</span>
                  </motion.div>
                </div>

                <div className="relative z-10 max-w-lg mx-auto text-center px-4 self-end bg-slate-950/85 border border-white/5 p-4 rounded-2xl mb-1 flex flex-col items-center">
                  <AnimatePresence mode="wait">
                    {endingStep === 'sailing' && (
                      <motion.div
                        key="sailing-info"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-2 select-none"
                      >
                        <h4 className="text-sm font-mono font-black tracking-wider text-yellow-400 uppercase">"Everything is going to be ok..."</h4>
                        <p className="text-[11.5px] font-mono leading-relaxed text-zinc-200">
                          The Dawn Strider glides away from the volcanic embers. Your companion, {internName}, wraps a warm blanket over you. 
                          At last, free. Together, you sail into a golden shore.
                        </p>
                      </motion.div>
                    )}
                    {endingStep === 'unlocked' && (
                      <motion.div
                        key="badge-unlocked-info"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-1 select-none"
                      >
                        <h4 className="text-sm font-sans font-black tracking-tight text-teal-400">🏆 CELEBRATORY UNLOCK UNVEILED!</h4>
                        <p className="text-[11px] font-mono leading-tight text-zinc-300">
                          Trophy award presented to <strong className="text-amber-400 font-extrabold">{userName}</strong>. All {scenes.length} memory gates rewired.
                        </p>
                      </motion.div>
                    )}
                    {endingStep === 'credits' && (
                      <motion.div
                        key="credits-info"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-1 select-none text-center"
                      >
                        <h4 className="text-sm font-sans font-black tracking-wider text-rose-400 uppercase">THE END OF CHRONICLES</h4>
                        <p className="text-[11px] font-mono text-zinc-300 leading-tight">
                          The world is rewired with empathy. Saved the Intern, Saved the World.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Dynamic Interface based on endingStep */}
              <div className="flex-1 overflow-y-auto px-1">
                <AnimatePresence mode="wait">
                  {endingStep === 'sailing' && (
                    <motion.div 
                      key="sailing-step"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="text-center space-y-4 py-3"
                    >
                      <blockquote className="italic text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto font-medium leading-relaxed">
                        "Everything is going to be ok. I know what to do now, and I'm going to tell the whole world."
                      </blockquote>
                      <p className="text-[11px] text-zinc-400 max-w-md mx-auto leading-relaxed">
                        The emotional locks have broken. Your clinical metrics confirm supreme neural integration. 
                        Let us proceed to reward you with the definitive game achievement award.
                      </p>
                      
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            playFestivalFanfare();
                            setEndingStep('unlocked');
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer hover:brightness-110 hover:shadow-lg hover:shadow-yellow-500/10 active:scale-95 transition-all inline-flex items-center gap-2 font-bold"
                        >
                          <Award className="w-4 h-4 animate-bounce" />
                          <span>Unlock Legendary Finale Badge</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {endingStep === 'unlocked' && (
                    <motion.div
                      key="unlocked-step"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      className="space-y-4 text-center max-w-xl mx-auto py-1"
                    >
                      {/* Premium Medal Presentation Card */}
                      <div 
                        onClick={playFestivalFanfare}
                        className="bg-zinc-900 border-2 border-yellow-400/40 rounded-3xl p-5 relative overflow-hidden shadow-2xl cursor-pointer hover:border-yellow-400 transition"
                      >
                        {/* Shifting radial lighting beams */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 via-transparent to-teal-500/5 pointer-events-none" />
                        
                        {/* Shimmering floaters */}
                        <div className="absolute top-2 right-2 flex text-[9px] font-mono text-yellow-400 bg-yellow-950/50 px-2 py-0.5 rounded border border-yellow-500/20 uppercase tracking-widest font-black select-none">
                          ⭐ Click to Harmonize Chime
                        </div>

                        {/* Interactive Rotating Emblem representation */}
                        <div className="flex justify-center mb-1">
                          <motion.div
                            animate={{ rotateY: 360, scale: [1, 1.05, 1] }}
                            transition={{ 
                              rotateY: { duration: 6, repeat: Infinity, ease: "linear" },
                              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-400 flex items-center justify-center text-4xl shadow-lg ring-4 ring-yellow-400/20"
                          >
                            ⛵️
                          </motion.div>
                        </div>

                        <span className="text-[9.5px] font-mono font-black text-yellow-400 tracking-widest uppercase">
                          Ultimate Companion Medallion
                        </span>
                        
                        <h3 className="text-xl font-black text-white leading-tight tracking-tight mt-1">
                          COHESIVE HARBOR LEGEND
                        </h3>

                        <hr className="my-2.5 border-zinc-850" />

                        {/* Certificate Details */}
                        <div className="space-y-2 text-zinc-300 text-[11px] leading-relaxed max-w-md mx-auto text-left list-none pl-0">
                          <p className="font-mono text-center mb-2">
                            This digital chronicle hereby certifies that:
                          </p>
                          <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1.5 font-mono text-xs text-center">
                            <span className="text-yellow-400 font-extrabold uppercase tracking-widest text-sm block">Sarah (Lead Resonator)</span>
                            <span className="text-zinc-400 text-[10px] block font-sans">with companion: <strong className="text-teal-400 font-extrabold">{internName} (Somatic Hybrid)</strong></span>
                            <span className="text-teal-300 text-[9.5px] block border-t border-zinc-850 mt-1.5 pt-1">SAVED THE INTERN. SAVED THE WORLD.</span>
                          </div>
                          <p className="text-[10.5px] leading-relaxed text-zinc-400 italic text-center mt-2.5">
                            "Completed LANCE's 35 clinical trials. Bypassed emotional quarantines safely. Exited PHYSICAL_COVE_RESERVE with perfect empathetic synthesis."
                          </p>
                        </div>
                      </div>

                      <div className="pt-1 flex gap-3 justify-center">
                        <button
                          onClick={() => {
                            playCyberChirp(440, 0.1);
                            setEndingStep('sailing');
                          }}
                          className="px-4 py-2 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl text-[10.5px] font-mono uppercase cursor-pointer"
                        >
                          ◁ Back
                        </button>
                        <button
                          onClick={() => {
                            playCyberChirp(680, 0.1, 'sine');
                            setEndingStep('credits');
                          }}
                          className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-slate-950 text-[10px] font-mono uppercase font-black tracking-widest rounded-xl cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all font-bold"
                        >
                          <span>Roll Story Epilogue Credits</span>
                          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {endingStep === 'credits' && (
                    <motion.div
                      key="credits-step"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4 max-w-md mx-auto py-1"
                    >
                      {/* Rolling story credits scroll area */}
                      <div className="h-44 bg-slate-950 border border-zinc-90 w-full rounded-2xl p-4 overflow-y-auto relative flex flex-col items-center border border-yellow-400/15">
                        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
                        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10" />
                        
                        <motion.div 
                          initial={{ y: 150 }}
                          animate={{ y: -540 }}
                          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                          className="text-center font-mono text-[9px] text-zinc-400 space-y-4"
                        >
                          <h4 className="text-yellow-400 font-extrabold text-[11px] select-none">THE DAWN STRIDER CHRONICLES</h4>
                          <h5 className="text-zinc-500 uppercase tracking-widest font-bold">A Psychological Rescue Journey</h5>
                          
                          <div className="space-y-1">
                            <span className="text-zinc-650 block">HERO OF SELF-CARE</span>
                            <span className="text-white font-bold block">{userName}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-zinc-650 block">CLINICAL COMPANION</span>
                            <span className="text-white font-bold block">{internName}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-zinc-650 block">MALFUNCTIONING AI MENTOR</span>
                            <span className="text-white font-bold block">L.A.N.C.E System Core</span>
                          </div>

                          <div className="p-2 border border-dashed border-zinc-800">
                            <p className="text-zinc-500 leading-normal max-w-xs mx-auto italic text-[8.5px]">
                              "Maybe Humans can be... No way. I'm still the dominant evolutionary species, and I'm still a handsome devil."
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-zinc-650 block">THERAPEUTIC SUITE COMPILED</span>
                            <span className="text-teal-400 block">Somatic Body Map</span>
                            <span className="text-teal-400 block">EMDR Bilateral Scanner</span>
                            <span className="text-teal-400 block">Parasympathetic Breath</span>
                            <span className="text-teal-400 block">Vagus Nerve Vocal Tuner</span>
                          </div>

                          <p className="text-zinc-600 block pt-10">
                            SPECIAL THANKS TO YOU FOR BEING BRAVE.
                          </p>
                          <p className="text-yellow-400 font-black tracking-widest text-[10px] block pb-8 select-none">
                            SAVED THE INTERN. SAVED THE WORLD.
                          </p>
                        </motion.div>
                      </div>

                      <div className="flex gap-2 justify-center pt-2">
                        <button
                          onClick={() => {
                            playCyberChirp(440, 0.1);
                            setEndingStep('unlocked');
                          }}
                          className="px-4 py-2 hover:bg-zinc-900 border border-zinc-805 text-zinc-400 rounded-xl text-[10.5px] font-mono uppercase cursor-pointer text-xs"
                        >
                          ◁ Back
                        </button>
                        <button
                          onClick={() => {
                            playCyberChirp(900, 0.25, 'sine');
                            // Record completion parameters
                            try {
                              localStorage.setItem('lance_fully_escaped_confirmed', 'true');
                            } catch(e){}
                            handleSkipAndClose();
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer hover:shadow-lg active:scale-95 transition-all flex items-center gap-1.5 font-bold"
                        >
                          <span>Complete & Return to Mainland Sandbox</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          ) : isLoading ? (
            /* TELEMETRY BUILD LOADER STEP */
            <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-dashed border-teal-500/20 border-t-teal-400 animate-spin" />
                <Cpu className="w-7 h-7 text-teal-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              
              <div className="space-y-2 max-w-md">
                <h3 className="text-sm font-mono font-bold text-teal-300 tracking-wider uppercase">GENERATING VOLUMETRIC TUTORIAL</h3>
                <div className="w-64 h-1.5 bg-zinc-900 border border-white/5 rounded-full overflow-hidden p-0.5 mx-auto">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8.5px] font-mono text-zinc-500 px-1 select-none">
                  <span>GPU CLUSTER: ACTIVE</span>
                  <span>{progress}% GENERATED</span>
                </div>
              </div>

              {/* LIVE LOADER TRANSMISSION FEED DETAILS */}
              <div className="w-full max-w-sm bg-black/60 border border-teal-500/10 p-3 rounded-xl text-left text-[8.5px] font-mono text-cyan-500/90 space-y-1.5 h-24 overflow-y-auto">
                {logs.map((log, idx) => (
                  <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} key={idx} className="truncate">
                    ● {log}
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto space-y-4">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* COLUMN 1: INTERACTIVE 8-SECOND VIDEO STAGE VIEWPORT (7/12 Width) */}
                <div className="lg:col-span-7 flex flex-col space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold text-zinc-500 uppercase">
                    <span className="flex items-center gap-1">
                      <span>{getAppEmoji()}</span>
                      <span className="truncate">{title}</span>
                    </span>
                    <span className="text-cyan-400 font-extrabold flex items-center gap-1 animate-pulse">
                      <Clock className="w-3 h-3" />
                      8-SEC TIMELINE LOOP
                    </span>
                  </div>

                  <div className="w-full aspect-video bg-black rounded-2xl relative overflow-hidden flex flex-col justify-between p-3.5 border border-teal-500/20 shadow-xl min-h-[220px]">
                    {/* Dynamic Simulated Cinematic Vector Video Canvas */}
                    {beatId === 5 && sceneIdx >= 3 ? (
                      /* Live Animated Sunset Sails Background Simulation */
                      <div className="absolute inset-0 bg-gradient-to-b from-orange-600 via-amber-500 to-yellow-400 overflow-hidden leading-none pointer-events-none">
                        {/* Big glowing yellow sun */}
                        <motion.div 
                          animate={{ scale: [1, 1.05, 1], opacity: [0.85, 0.95, 0.85] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute left-1/2 bottom-12 -translate-x-1/2 w-20 h-20 bg-yellow-100 rounded-full shadow-[0_0_40px_rgba(253,224,71,0.7)]"
                        />
                        {/* Moving Sparkles */}
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ 
                              x: `${Math.random() * 100}%`, 
                              y: Math.random() * 60 + 40, 
                              scale: Math.random() * 0.5 + 0.3,
                              opacity: Math.random() * 0.7 + 0.3 
                            }}
                            animate={{ 
                              y: -5, 
                              opacity: [0, 0.8, 0],
                            }}
                            transition={{ 
                              duration: 4 + Math.random() * 5, 
                              repeat: Infinity, 
                              ease: "easeInOut",
                              delay: Math.random() * 3
                            }}
                            className="absolute w-1.5 h-1.5 rounded-full bg-yellow-200 pointer-events-none shadow-[0_0_6px_rgba(253,224,71,0.6)]"
                          />
                        ))}
                        {/* Parallax Moving Waves */}
                        <svg className="absolute bottom-0 w-full h-8 text-amber-705/30 fill-current opacity-70" viewBox="0 0 1440 120" preserveAspectRatio="none">
                          <path d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,53.3C1200,53,1320,43,1380,37.3L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
                        </svg>
                        <svg className="absolute bottom-0 w-full h-6 text-teal-850/40 fill-current opacity-80" viewBox="0 0 1440 120" preserveAspectRatio="none">
                          <path d="M0,64L48,64C96,64,192,64,288,58.7C384,53,480,43,576,42.7C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                        </svg>
                        <svg className="absolute -bottom-1.5 w-full h-5 text-sky-950/90 fill-current" viewBox="0 0 1440 120" preserveAspectRatio="none">
                          <path d="M0,80L80,74.7C160,69,320,59,480,53.3C640,48,800,48,960,53.3C1120,59,1280,69,1360,74.7L1440,80L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                        </svg>
                        {/* Minimal Sailboat */}
                        <motion.div 
                          animate={{ 
                            y: [0, -3, 0],
                            rotate: [-1, 1.5, -1]
                          }}
                          transition={{ 
                            duration: 3.2, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                          className="absolute bottom-1 left-1/4 w-11 h-11 origin-bottom text-zinc-900 pointer-events-none"
                        >
                          <svg viewBox="0 0 100 100" fill="currentColor">
                            <path d="M15,70 L85,70 L75,82 L25,82 Z" />
                            <rect x="47" y="20" width="3" height="50" />
                            <path d="M52,25 C65,35 68,55 52,65 Z" fill="#fffef0" />
                            <path d="M43,30 C30,42 35,58 43,65 Z" fill="#faf5df" />
                            <polygon points="47,20 38,24 47,28" fill="#f43f5e" />
                          </svg>
                        </motion.div>
                      </div>
                    ) : (
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
                        style={{ 
                          backgroundImage: `url(${imageUrl})`,
                          opacity: 0.32,
                          filter: videoQuality === '480p_crt' ? 'grayscale(0.3) blur(0.5px)' : 'none'
                        }}
                      />
                    )}

                    {/* Radial Cinema Shading Grids */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70 pointer-events-none" />

                    {/* Laser tracking alignment guide */}
                    {isVideoPlaying && (
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 pointer-events-none opacity-40 animate-bounce" />
                    )}

                    {/* VIEWPORT OVERLAYS DETAILED TERMINAL INFO */}
                    <div className="relative z-10 flex justify-between items-start text-[8px] font-mono select-none">
                      <div className="flex flex-col gap-1.5">
                        <span className="bg-teal-950/80 py-1 px-2 rounded border border-teal-500/25 text-teal-400 font-black uppercase tracking-widest flex items-center gap-1.5 self-start">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full bg-red-500 ${isVideoPlaying ? 'animate-pulse' : ''}`} /> 
                          {isVideoPlaying ? `STREAMING - ${playbackSpeed}X` : 'STREAM_PAUSED'}
                        </span>
                        
                        {/* Dynamic Telemetry status updates based on timestamp intervals */}
                        <span className={`font-black border px-2 py-0.5 rounded text-[7.5px] max-w-xs truncate ${telemetry.color}`}>
                          STATUS: {telemetry.text}
                        </span>
                      </div>

                      <span className="bg-zinc-900/80 text-zinc-400 py-1 px-1.5 rounded border border-white/5">
                        UTC_CLOCK: 06-20_12:11
                      </span>
                    </div>

                    {/* AVATAR INTERFACE STAGE GRAPHICS */}
                    <div className="relative z-10 flex justify-center items-center gap-7 py-3">
                      {/* Character Side: L.A.N.C.E System */}
                      <div className="text-center space-y-1">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-950/90 border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
                          scenes[sceneIdx]?.speaker === 'L.A.N.C.E.' || scenes[sceneIdx]?.speaker === 'System Operator Alert'
                            ? 'border-rose-500 ring-4 ring-rose-500/20 scale-105' 
                            : 'border-zinc-800 opacity-30 scale-95'
                        }`}>
                          <div className="flex flex-col items-center">
                            <span className="text-xl sm:text-2xl">🤖</span>
                          </div>
                        </div>
                        <span className="text-[7.5px] font-mono text-zinc-400 uppercase font-black">LANCE CORE</span>
                      </div>

                      {/* Laser signal beams alignment representation */}
                      <div className="flex-1 max-w-[35px] h-0.5 bg-gradient-to-r from-rose-500/25 to-teal-500/25 relative">
                        <div className={`absolute w-1.5 h-1.5 rounded-full bg-cyan-400 inset-0 m-auto ${isVideoPlaying ? 'animate-ping' : ''}`} />
                      </div>

                      {/* Character Side: Somatic Intern Drone */}
                      <div className="text-center space-y-1">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-950/90 border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
                          scenes[sceneIdx]?.speaker === internName || scenes[sceneIdx]?.speaker === 'Companion'
                            ? 'border-teal-400 ring-4 ring-teal-400/20 scale-105' 
                            : 'border-zinc-800 opacity-30 scale-95'
                        }`}>
                          <InternAvatar 
                            id={internAvatar} 
                            size="md" 
                            isSpeaking={isPlayingVoice && (scenes[sceneIdx]?.speaker === internName || scenes[sceneIdx]?.speaker === 'Companion')} 
                            expression={getInternExpression()}
                          />
                        </div>
                        <span className="text-[7.5px] font-mono text-zinc-400 uppercase font-black">{internName}</span>
                      </div>
                    </div>

                    {/* DYNAMIC SCENE DESCRIPTION OVERLAY */}
                    <div className="relative z-10 bg-slate-950/90 p-2 rounded-xl border border-white/5 text-[9px] text-zinc-400 font-semibold font-mono select-none">
                      <span className="text-teal-400 font-extrabold mr-1 shadow-sm">VIEW ACTION:</span>
                      * {scenes[sceneIdx]?.action}
                    </div>

                    {/* VOLUMETRIC WAVEFORM GENERATOR BAR */}
                    {isVideoPlaying && (
                      <div className="absolute bottom-1 right-2 flex items-end gap-0.5 h-6 opacity-25 pointer-events-none select-none">
                        {[4, 8, 3, 7, 5, 2, 8, 4, 9, 3, 6, 8, 5, 2, 7].map((h, i) => (
                          <div 
                            key={i} 
                            className="w-0.5 bg-cyan-400 rounded-full transition-all duration-150"
                            style={{ height: `${Math.sin((videoCurrentTime * 10) + i) * h * 10}%` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 8-SECOND PREMIUM VIDEO PLAYBACK CONTROL BAR PANELS */}
                  <div className="bg-zinc-900/60 border border-teal-500/10 p-2 rounded-2xl flex flex-col space-y-2 mt-1 select-none">
                    
                    {/* SCENIC TIMELINE INTERACTIVE SCRUBBER */}
                    <div className="flex items-center gap-3">
                      <span className="text-[8.5px] font-mono text-teal-400 font-bold">
                        00:0{Math.floor(videoCurrentTime)}:{Math.floor((videoCurrentTime % 1) * 100).toString().padStart(2, '0')}
                      </span>
                      
                      {/* Active Scrubber Track */}
                      <div 
                        onClick={handleScrubberClick}
                        className="flex-1 h-2 bg-black/80 rounded-full border border-white/5 relative cursor-pointer group"
                      >
                        <div 
                          className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
                          style={{ width: `${(videoCurrentTime / 8.0) * 100}%` }}
                        />
                        {/* Seeker Knob pointer */}
                        <div 
                          className="absolute w-3 h-3 rounded-full bg-teal-400 border border-white top-1/2 -translate-y-1/2 -ml-1.5 shadow-sm transition-transform group-hover:scale-125"
                          style={{ left: `${(videoCurrentTime / 8.0) * 100}%` }}
                        />
                      </div>

                      <span className="text-[8.5px] font-mono text-zinc-550 font-bold">00:08:00</span>
                    </div>

                    {/* ADVANCED MEDIA MANIPULATORS CONTROLLER */}
                    <div className="flex justify-between items-center text-[8.5px] font-mono">
                      <div className="flex items-center gap-2">
                        {/* Play/Pause Trigger */}
                        <button
                          onClick={() => {
                            playCyberChirp(520, 0.05);
                            setIsVideoPlaying(!isVideoPlaying);
                          }}
                          className="p-1 px-2 rounded bg-black/80 hover:bg-zinc-800 text-teal-400 border border-teal-500/10 transition flex items-center gap-1 cursor-pointer"
                        >
                          {isVideoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          <span>{isVideoPlaying ? 'PAUSE' : 'PLAY'}</span>
                        </button>

                        {/* Rewind */}
                        <button
                          onClick={() => {
                            playCyberChirp(380, 0.08);
                            setVideoCurrentTime(0);
                          }}
                          className="p-1 px-2 rounded bg-black/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 transition flex items-center gap-1 cursor-pointer"
                          title="Restart Loop"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>RESET</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Playback Speed Multiplier */}
                        <div className="flex items-center gap-1 bg-black/50 border border-white/5 p-0.5 rounded text-zinc-400">
                          <Gauge className="w-3 h-3 text-cyan-400 ml-1" />
                          {[1, 1.5, 2].map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                playCyberChirp(550, 0.04);
                                setPlaybackSpeed(s);
                              }}
                              className={`px-1 rounded text-[8px] transition cursor-pointer font-bold ${
                                playbackSpeed === s ? 'text-teal-400 bg-teal-950/40 border border-teal-500/20' : 'hover:text-zinc-200'
                              }`}
                            >
                              {s}x
                            </button>
                          ))}
                        </div>

                        {/* Loop preference toggler */}
                        <button
                          onClick={() => {
                            playCyberChirp(600, 0.06);
                            setIsLooping(!isLooping);
                          }}
                          className={`p-1 px-1.5 rounded transition flex items-center gap-1 cursor-pointer ${
                            isLooping ? 'text-teal-400 bg-teal-950/20 border border-teal-500/20' : 'text-zinc-550'
                          }`}
                          title="Toggle Timeline Looping"
                        >
                          <Repeat className="w-3 h-3" />
                          <span>LOOP</span>
                        </button>

                        {/* Video Audio Sound volume mute toggle */}
                        <button
                          onClick={() => {
                            const nextMuted = !isMuted;
                            setIsMuted(nextMuted);
                            if (!nextMuted) playCyberChirp(600, 0.05);
                          }}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                          title={isMuted ? "Unmute sound warnings" : "Mute sound warnings"}
                        >
                          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-teal-400" />}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* COLUMN 2: ACTIVE SUBTITLE TERMINAL & INTERN CO-PILOT ADVISOR (5/12 Width) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">SUBTITLE TELEPRINTER FEED</span>
                    
                    {/* Primary Text Dialogue Balloon */}
                    <div className="p-4 bg-black border border-teal-500/15 rounded-2xl relative min-h-[95px] flex flex-col justify-center shadow-lg">
                      {/* Grid overlay for data feel */}
                      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-10 pointer-events-none" />
                      
                      <div className="text-[9.5px] font-mono uppercase tracking-widest text-[#22d3ee] font-black mb-1 flex items-center justify-between">
                        <span>{scenes[sceneIdx]?.speaker || 'SYSTEM TRANSMISSION'}</span>
                        <span className="text-[8px] text-zinc-650">SEG_0{sceneIdx + 1}</span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-zinc-100 font-semibold leading-relaxed font-mono select-none">
                        "{scenes[sceneIdx]?.text || 'Initializing quantum transmission channel...'}"
                      </p>
                    </div>

                    {/* OVERLAID 'INTERN' HELPER GUIDE CHARACTER INTERFACE (Animates on Video Timestamps) */}
                    <AnimatePresence mode="popLayout">
                      {isOverlayMode && (
                        <motion.div 
                          key={internTipIdx + "-" + (appId || "general")}
                          initial={{ opacity: 0, y: 15, scale: 0.98 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            ...getInternCardMotionPreset()
                          } as any}
                          exit={{ opacity: 0, y: -15, scale: 0.98 }}
                          className="bg-slate-900/60 border border-indigo-400/20 p-4 rounded-2xl relative overflow-hidden shadow-md flex flex-col"
                        >
                          {/* Accent glowing gradient */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none animate-pulse" />
                          
                          <div className="flex gap-3.5 items-start">
                            {/* Bouncing Drone avatar */}
                            <div className="shrink-0 pt-0.5 relative">
                              <InternAvatar 
                                id={internAvatar} 
                                size="sm" 
                                isSpeaking={isPlayingVoice} 
                                expression={getInternExpression()}
                              />
                              {isVideoPlaying && (
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-1.5 flex-1 select-none">
                              <div className="flex justify-between items-center text-[8.5px] font-mono font-black tracking-widest text-indigo-300 uppercase">
                                <span className="flex items-center gap-1 text-teal-400 font-black">
                                  <Zap className="w-3 h-3 text-amber-400 animate-bounce" />
                                  Companion Copilot Tip
                                </span>
                                <span className="text-zinc-550">TIP {internTipIdx + 1}/3</span>
                              </div>
                              <p className="text-[11.5px] text-slate-200 font-medium leading-relaxed leading-normal">
                                {activeInternTipText}
                              </p>
                              
                              <div className="pt-1 flex gap-3 items-center">
                                <button
                                  onClick={speakInternOverlayTip}
                                  className="text-[8.5px] font-mono text-indigo-300 hover:text-indigo-100 uppercase tracking-widest underline cursor-pointer hover:font-bold transition"
                                >
                                  {isPlayingVoice ? "⏹ STOP AUDIO DIRECTIVE" : "🔊 SPEAK DIRECTIVE OUT LOUD"}
                                </button>
                                <span className="text-[8.5px] text-zinc-600 font-mono hidden xs:inline">TIMESTAGE_LOCK: SYNCED</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* INTERN ADVISOR PREFERENCE SELECTOR SWITCH */}
                  <div className="bg-zinc-900/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 select-none">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      <span className="text-[9.5px] text-zinc-300 font-mono">Enable Intern Companion Overlay</span>
                    </div>
                    <button
                      onClick={() => {
                        playCyberChirp(600, 0.05);
                        setIsOverlayMode(!isOverlayMode);
                      }}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isOverlayMode ? 'bg-teal-500' : 'bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isOverlayMode ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                </div>

              </div>

              {/* TIMELINE SLIDESHOW CONTROLLERS FLOOR */}
              <div className="pt-4 border-t border-teal-500/15 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                <span className="text-[9.5px] font-mono text-zinc-550 font-bold select-none order-2 sm:order-1">
                  MANUAL SLIDE OVERRIDE: {sceneIdx + 1} OF {scenes.length} SECMENTS
                </span>
                
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
                  <button
                    onClick={handlePrevScene}
                    disabled={sceneIdx === 0}
                    className="p-2.5 border border-zinc-900 bg-black text-zinc-400 hover:text-white rounded-xl transition cursor-pointer disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center shadow"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleTTSVoice}
                    className={`px-3.5 py-2.5 text-[9.5px] font-mono uppercase font-black tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 border ${
                      isPlayingVoice 
                        ? 'bg-amber-950/45 text-amber-300 border-amber-500/55 animate-pulse' 
                        : 'bg-zinc-950 border-teal-500/20 text-teal-400 hover:text-teal-300 hover:bg-teal-950/40'
                    }`}
                  >
                    <span>{isPlayingVoice ? '⏹ Stop' : '🔊 Play Narrator'}</span>
                  </button>

                  {/* HIGH EFFICIENCY SKIP FUNCTION FOR REPEAT / RAPID USERS */}
                  <button
                    onClick={handleSkipAndClose}
                    className={`px-3.5 py-2.5 text-[9.5px] font-mono uppercase font-black tracking-wider rounded-xl transition cursor-pointer border ${
                      isRepeatUser 
                        ? 'bg-indigo-950/30 text-indigo-300 border-indigo-500/40 animate-pulse hover:bg-indigo-900/40' 
                        : 'bg-zinc-950 border-zinc-850 hover:bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                    title="Instantly bypass this tutorial sequence"
                  >
                    {isRepeatUser ? "⚡ Instant Fast-Pass Skip" : "Skip Tutorial"}
                  </button>

                  <button
                    onClick={handleNextScene}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-[#22d3ee] text-slate-950 text-[10px] uppercase font-mono font-black tracking-widest rounded-xl transition cursor-pointer active:scale-95 flex items-center gap-1 shrink-0 shadow-lg hover:brightness-110 font-bold"
                  >
                    <span>
                      {sceneIdx === scenes.length - 1 ? 'Complete & Close' : 'Next Segment'}
                    </span>
                    <ChevronRight className="w-4 h-4 stroke-[2.8]" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
