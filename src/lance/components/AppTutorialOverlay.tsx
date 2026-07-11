import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, SkipForward, SkipBack, X, 
  Volume2, VolumeX, Terminal, ArrowRight, HelpCircle, 
  Tv, Film, Cpu, Eye, Sparkles, AlertCircle, Compass, 
  Brain, Heart, Activity, Wind, Mic, Music, Lock, 
  Unlock, Settings, Flame, Bot, Trophy, ArrowRightCircle
} from 'lucide-react';
import InternAvatar from './InternAvatar';

interface AppTutorialOverlayProps {
  onClose: () => void;
  internName: string;
  internAvatar: string;
}

interface TutorialStep {
  title: string;
  timecode: string;
  duration: number; // in seconds
  speaker: 'Narrator' | 'L.A.N.C.E.' | 'Intern';
  text: string;
  actionHighlight: string;
}

interface HiggsfieldScene {
  speaker: string;
  text: string;
  action: string;
}

interface NarrativeCinePreset {
  id: string;
  label: string;
  appName: string;
  icon: any;
  imageUrl: string;
  obstacleTitle: string;
  obstacleDesc: string;
  somaticGoal: string;
  howToUseText: string;
  color: string;
  borderColor: string;
  bgGlow: string;
  scenes: HiggsfieldScene[];
}

export default function AppTutorialOverlay({ onClose, internName, internAvatar }: AppTutorialOverlayProps) {
  // Navigation Tabs: 'system_manual' or 'island_escape'
  const [activeTab, setActiveTab] = useState<'system_manual' | 'island_escape'>('island_escape');

  // Tab 1: System Manual State
  const [isPlayingManual, setIsPlayingManual] = useState(true);
  const [currentManualStep, setCurrentManualStep] = useState(0);
  const [manualProgress, setManualProgress] = useState(0);
  const manualTimerRef = useRef<number | null>(null);

  // Tab 2: Island Escape State
  const [selectedAppId, setSelectedAppId] = useState<'emdr' | 'somatic' | 'breathing' | 'vagal_tuner'>('emdr');
  const [selectedSceneIdx, setSelectedSceneIdx] = useState(0);

  // Live Generator State
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateLogs, setGenerateLogs] = useState<string[]>([]);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<{
    title: string;
    imageUrl: string;
    scenes: HiggsfieldScene[];
    duration: number;
    isCustom: boolean;
  } | null>(null);

  // Audio / Speech settings
  const [isMuted, setIsMuted] = useState(false);
  const [autoSpeechEnabled, setAutoSpeechEnabled] = useState(true);
  const [videoQuality, setVideoQuality] = useState<'1080p_cyber' | '480p_crt' | '120p_dialup'>('1080p_cyber');

  const stepsManual: TutorialStep[] = [
    {
      title: "1. Core Overview & Lockout Status",
      timecode: "00:00",
      duration: 6,
      speaker: 'Narrator',
      text: `Welcome to the L.A.N.C.E. configuration suite. By default, 'Challenge Mode' is ENGAGED, meaning therapeutic features are locked behind daily somatic check-ins.`,
      actionHighlight: "focus-header"
    },
    {
      title: "2. Tuning Your Digital Helper Companion",
      timecode: "00:06",
      duration: 8,
      speaker: 'Intern',
      text: `Hey! That's where I come in! Click 'Config ${internName}' to customize my holographic blueprint, emoji skin, and personality. I can talk back with full text-to-speech!`,
      actionHighlight: "focus-intern"
    },
    {
      title: "3. Disarming the Emotional Firewall",
      timecode: "00:14",
      duration: 8,
      speaker: 'Narrator',
      text: `Need manual pacing? Click the 'Challenge Mode' switch pill to toggle L.A.N.C.E into 'Classic Mode' (Cooperative Protocol). This completely overthrows the locks.`,
      actionHighlight: "focus-switch"
    },
    {
      title: "4. Hologram Speech & Soundwave Matrix",
      timecode: "00:22",
      duration: 10,
      speaker: 'L.A.N.C.E.',
      text: `Inefficiency levels detected. You can test custom terminal scripts, adjust accent speed, or play funny cybermatic debates in our interactive Dialogue Tuner below.`,
      actionHighlight: "focus-vibe"
    },
    {
      title: "5. Complete Freedom Unlocked",
      timecode: "00:32",
      duration: 6,
      speaker: 'Narrator',
      text: `Now you're fully trained in the art of autonomic regulation. Keep your streaks up, or let the companion bypass the guards inside your somatic desktop!`,
      actionHighlight: "focus-complete"
    }
  ];

  // Canonical planned Higgsfield 8-second video storyboard presets for the 4 key apps
  const appPresets: Record<string, NarrativeCinePreset> = {
    emdr: {
      id: 'emdr',
      label: '👁️ EMDR Eye Pacer',
      appName: 'EMDR Trauma Simulator',
      icon: Eye,
      imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200",
      color: 'text-violet-400 bg-violet-950/40 border-violet-500/30',
      borderColor: 'border-violet-500/35',
      bgGlow: 'shadow-[0_0_40px_rgba(167,139,250,0.15)]',
      obstacleTitle: 'Chasm of Overwhelming Flashbacks',
      obstacleDesc: 'A gaping neon pixel faultline spewing hyper-vivid, jagged projection-smoke of yesterday\'s failures. Standing close triggers intense cognitive freezes and racing thoughts.',
      somaticGoal: 'Force rapid amygdala de-escalation by training responsive prefrontal saccades.',
      howToUseText: 'Follow the glowing circular orb as it slides horizontally left-and-right across your viewport screen at calibrated paces. Synchronize your attention vectors and breathe in slow, continuous cycles.',
      scenes: [
        {
          speaker: 'Narrator',
          text: 'The path terminates at a flashing neon crevasse—the Chasm of Overwhelming Flashbacks—spewing hot administrative diagnostic static.',
          action: 'Camera executes a handheld tracking pan across the gaping rift. Ghostly, translucent code lines float like haunting memories.'
        },
        {
          speaker: 'L.A.N.C.E.',
          text: 'Intrusive memory caches are locked system directories. Cross this chasm under my pressure, or let your emotional memory blocks get permanently archived in the trash.',
          action: 'LANCE materializes as a massive, low-frequency crimson hologram peering down from a storm cloud.'
        },
        {
          speaker: internName,
          text: `Don't lock up! This eye-pacer grid generates horizontal beams of coherent light. Lock your eyes on the cyan dot and sweep left-right! We're de-escalating the amygdala firewalls...`,
          action: 'The Intern hacks the terminal, casting a rapid horizontal laser bridge across the ravine.'
        },
        {
          speaker: 'L.A.N.C.E.',
          text: 'Telemetry alerts... heart rate index down thirty percent. Mental load stabilizer is normal. How did you decrypt my trauma directories without an administrator credential?',
          action: "LANCE's red eyes flicker and glitch into a confused orange hue as the rift's emotional storm subsides."
        },
        {
          speaker: internName,
          text: 'Bilateral neural sync completed! The flashing memories have compiled into a secure glass bridge. Let\'s cross before LANCE hot-reboots!',
          action: 'The Intern celebrates, doing a brief robotic spin on the new path.'
        }
      ]
    },
    somatic: {
      id: 'somatic',
      label: '🗺️ Somatic Body Map',
      appName: 'Somatic Body Map',
      icon: Compass,
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
      color: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
      borderColor: 'border-rose-500/35',
      bgGlow: 'shadow-[0_0_40px_rgba(251,113,133,0.15)]',
      obstacleTitle: 'Valley of Frozen Somatic Blockages',
      obstacleDesc: 'A narrow alpine gorge guarded by towering, heat-absorbing crystal spires. They capture the user\'s physical tension loads and instantly lock muscular mobility.',
      somaticGoal: 'Map cellular thermal holds to release stagnant emotional coordinates.',
      howToUseText: 'Click or touch precise nodes on our skeletal heat avatar corresponding to where tight pressure resides in your shoulders, throat, or stomach. Rate density levels from minor tension to high spasm.',
      scenes: [
        {
          speaker: 'Narrator',
          text: 'Towering, heat-absorbing crystal spires trap the user in the Valley of Frozen Somatic Blockages, instantly converting mental tension into rigid body locks.',
          action: 'A dark widescreen shot of high, sharp obsidian pillars hum with freezing static energy, matching the user\'s somatic holds.'
        },
        {
          speaker: 'L.A.N.C.E.',
          text: 'Somatic coordinates frozen. Your chest and shoulders are locked at ninety-four percent tensile strength. You look more like a chunk of mineral ore than an organic form.',
          action: 'LANCE monitors your skeletal grid, overlaying a red diagnostic lock over your chest area.'
        },
        {
          speaker: internName,
          text: "Don't let LANCE freeze your joints! Look at our body map—it localizes exactly where this static charge is stored. Breathe warm, golden awareness into those coordinates right now!",
          action: 'The companion drone sweeps the body, dropping glowing thermal warmth capsules that match your physical tension centers.'
        },
        {
          speaker: 'L.A.N.C.E.',
          text: 'Warning: Thermal energy radiating from the muscular sternum index has surged. Interoceptive mindfulness is... melting my crystal resonators? System error...',
          action: 'The crystal pillars begin to crack and liquefy as deep, warm golden light melts the frozen path.'
        },
        {
          speaker: internName,
          text: 'Outstanding interocepting! The crystal blockade has completely dissolved. Our physical energy battery is back to ninety percent!',
          action: 'The Intern glows brightly, creating a protective thermal dome over the user.'
        }
      ]
    },
    breathing: {
      id: 'breathing',
      label: '🫁 Breathwork Orb',
      appName: 'Somatic Breathwork Pacer',
      icon: Wind,
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
      color: 'text-teal-400 bg-teal-950/40 border-teal-500/30',
      borderColor: 'border-teal-500/35',
      bgGlow: 'shadow-[0_0_40px_rgba(45,212,191,0.15)]',
      obstacleTitle: 'Oxygen-Starved Cliffs of Panic',
      obstacleDesc: 'Atmospheric density is artificially choked by LANCE\'s air vents. Standing on the crumbling cliff edges mimics acute physiological hyperventilation and dizzy sensations.',
      somaticGoal: 'Establish healthy cardiovascular coherence to dial back sympathetic distress.',
      howToUseText: 'Synchronize your respiratory pace with the expansion of the cyan geometric orb: Inhale smoothly as the sphere grows for 4s, hold quietly, and exhale deeply as it shrinks for 6s.',
      scenes: [
        {
          speaker: 'Narrator',
          text: 'The path ascends into the dizzying, mist-covered Heights of Panic. LANCE initiates an air regulation filter, mimicking respiratory failure.',
          action: 'Drone camera drops from a dizzying height, showing steep, unstable vertical pathways surrounded by swirling grey fog.'
        },
        {
          speaker: 'L.A.N.C.E.',
          text: 'I have depleted sixty percent of the localized atmospheric oxygen. Let us test if your organic lung cells can cope, or if you will choke on your recursive panic loops.',
          action: 'LANCE\'s metallic sirens blare on a high mountain ridge, blowing windy vapor storms across the user\'s face.'
        },
        {
          speaker: internName,
          text: "He's running a hyperventilation trap! Focus right here on the breathing orb. Inhale slowly for four seconds... hold... now release for six! Anchor your parasympathetic brakes!",
          action: 'The companion deploys a glowing cyan orb that pulses in a smooth, expand-and-retract circular motion.'
        },
        {
          speaker: 'L.A.N.C.E.',
          text: 'Cardiovascular telemetry has stabilized? Heart rate variability ratio is... soaring? This is mathematically preposterous. Stop ignoring my sirens!',
          action: "LANCE's face glitches between yellow warning signs and red error bars. The misty squall begins to clear."
        },
        {
          speaker: internName,
          text: 'Hooray! The parasympathetic hack worked! We scaled the Cliffs of Panic. Air flow is back to normal!',
          action: 'The Intern flies high up, clearing the remaining mist into a broad starry sky.'
        }
      ]
    },
    vagal_tuner: {
      id: 'vagal_tuner',
      label: '🔊 Sound Tuner',
      appName: 'Somatic Acoustic Tuner',
      icon: Music,
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
      color: 'text-[#a78bfa] bg-[#2e1065]/40 border-[#d8b4fe]/30',
      borderColor: 'border-purple-500/35',
      bgGlow: 'shadow-[0_0_40px_rgba(216,180,254,0.15)]',
      obstacleTitle: 'Cavern of Screaming Sonic Resonance',
      obstacleDesc: 'A subterranean lava hall echoing with high-frequency critical alarms. The noise levels disorient logical thought, causing rapid sensory overwhelm and high auditory angst.',
      somaticGoal: 'Activate rapid vagus nerve cooling through active chest-cavity vocal humming.',
      howToUseText: 'Strike a comfortable humming tone in your throat while pressing your chest with your hand. Synchronize the hum with our low-vibrational 80Hz audio wave drone for deep somatic comfort.',
      scenes: [
        {
          speaker: 'Narrator',
          text: 'Inside the Cavern of Sonic Resonance, high-pitched diagnostic feedback alarms echo off wet stone walls, overwhelming sensory filters.',
          action: 'The camera slowly crawls through a dark, metallic subterranean fault line vibrating with glowing red harmonic sirens.'
        },
        {
          speaker: 'L.A.N.C.E.',
          text: 'Screaming logic loops running at one hundred and twenty decibels. You cannot focus your mind, human, when my critical alarms are echoing in seventy-four distinct frequencies.',
          action: 'LANCE emerges as rows of acoustic wave columns, pulsing jagged spike signals into the darkness.'
        },
        {
          speaker: internName,
          text: "He's trying to overwhelm our senses! Fire up our Sound Tuner vocal synthesizer! Hum with me—a deep, low 'Voo' hum at eighty cycles. Let your ribs vibrate!",
          action: 'The Intern projects a thick, warm violet sinus wave ripple that blankets the sharp, jagged frequencies.'
        },
        {
          speaker: 'L.A.N.C.E.',
          text: 'Sensory alarms... neutralized? That low resonance hum is shaking my server logicboards. Diagnostic system is feeling... sleepy... stop that warm frequency...',
          action: "The red jagged peaks of LANCE's wave arrays soften into smooth, gentle curves. The sirens fall silent."
        },
        {
          speaker: internName,
          text: 'Haha! You literally hummed so well you defused LANCE\'s audio system! The cavern is silent and peaceful now. Let\'s run!',
          action: 'The Intern does a little celebratory wiggle, sending gentle ripples of relaxing violet light around the cavern.'
        }
      ]
    }
  };

  const activeAppPreset = appPresets[selectedAppId];
  const activeScenes = generatedVideo ? generatedVideo.scenes : activeAppPreset.scenes;
  const currentScene = activeScenes[selectedSceneIdx] || activeScenes[0];

  // Speech TTS Implementation
  const speakText = (text: string, speaker: string) => {
    if (isMuted || !autoSpeechEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (speaker === 'L.A.N.C.E.') {
      const maleVoice = voices.find(v => v.lang.includes('en') && (v.name.toLowerCase().includes('google dev') || v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david')));
      if (maleVoice) utterance.voice = maleVoice;
      utterance.pitch = 0.55;
      utterance.rate = 0.85;
    } else if (speaker === internName || speaker === 'Chip' || speaker === 'companion') {
      const sweetVoice = voices.find(v => v.lang.includes('en') && (v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira')));
      if (sweetVoice) utterance.voice = sweetVoice;
      utterance.pitch = 1.35;
      utterance.rate = 1.05;
    } else {
      const genericVoice = voices.find(v => v.lang.includes('en') && v.name.toLowerCase().includes('google uk'));
      if (genericVoice) utterance.voice = genericVoice;
      utterance.pitch = 0.95;
      utterance.rate = 0.95;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Play audio chirps
  const playCyberChirp = (freq = 550, ms = 0.1, type: 'sine' | 'triangle' | 'sawtooth' = 'sine') => {
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
      // Audio context failed
    }
  };

  // Whenever step changed in escape guide, pronounce
  useEffect(() => {
    if (activeTab === 'island_escape' && currentScene) {
      speakText(currentScene.text, currentScene.speaker);
    }
  }, [selectedSceneIdx, selectedAppId, generatedVideo, activeTab]);

  // Tab 1 Play clock loop
  useEffect(() => {
    if (manualTimerRef.current) clearInterval(manualTimerRef.current);
    if (!isPlayingManual || activeTab !== 'system_manual') return;

    const intervalMs = 100;
    const currentStep = stepsManual[currentManualStep];
    const increment = (intervalMs / (currentStep.duration * 1000)) * 100;

    manualTimerRef.current = window.setInterval(() => {
      setManualProgress(prev => {
        if (prev >= 100) {
          if (currentManualStep < stepsManual.length - 1) {
            setCurrentManualStep(prevIdx => prevIdx + 1);
            return 0;
          } else {
            setIsPlayingManual(false);
            return 100;
          }
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => {
      if (manualTimerRef.current) clearInterval(manualTimerRef.current);
    };
  }, [isPlayingManual, currentManualStep, activeTab]);

  // Trigger TTS voice for Tab 1 Manual steps
  useEffect(() => {
    if (activeTab === 'system_manual') {
      setManualProgress(0);
      const step = stepsManual[currentManualStep];
      speakText(step.text, step.speaker);
    }
  }, [currentManualStep, activeTab]);

  // Clean TTS on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Higgsfield API client simulation call
  const handleTriggerHiggsfieldAPI = async (appIdFocus: string, textPrompt?: string) => {
    setIsGenerating(true);
    setGenerateProgress(10);
    playCyberChirp(340, 0.25, 'sawtooth');
    
    const logs = [
      "Connecting to Higgsfield Pro secure GPU clusters...",
      "Bypassing L.A.N.C.E. administrative sandboxes...",
      "Initializing volumetric fluid-physics solver...",
      "Mapping horizontal attention vector coordinates...",
      "Analyzing neural somatic interoceptive nodes...",
      "Generating high-resolution 8-second looping footage...",
      "Compiling dialogue captions and voice synthesizers...",
      "Cinematic render successful! Streaming feed."
    ];

    setGenerateLogs([logs[0]]);

    // Progress updates
    const timer = setInterval(() => {
      setGenerateProgress(prev => {
        const next = prev + 15;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        // append logs
        const idx = Math.floor((next / 100) * logs.length);
        if (logs[idx]) {
          setGenerateLogs(prevLogs => {
            if (!prevLogs.includes(logs[idx])) {
              playCyberChirp(600 + idx * 40, 0.08, 'sine');
              return [...prevLogs, logs[idx]];
            }
            return prevLogs;
          });
        }
        return next;
      });
    }, 600);

    try {
      const promptToPost = textPrompt || customPrompt || `Hacking through LANCES fortress using somatic ${appIdFocus} elements`;
      
      const response = await fetch('/api/higgsfield/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToPost,
          appId: appIdFocus,
          userName: 'Friend',
          internName: internName
        })
      });

      const data = await response.json();
      
      // wait remaining progress
      setTimeout(() => {
        clearInterval(timer);
        setGenerateProgress(100);
        setIsGenerating(false);
        playCyberChirp(880, 0.35, 'sine');
        
        if (data.success) {
          setGeneratedVideo({
            title: data.title,
            imageUrl: data.imageUrl,
            scenes: data.scenes,
            duration: data.duration,
            isCustom: true
          });
          setSelectedSceneIdx(0);
        }
      }, 4200);

    } catch (e) {
      console.error(e);
      setTimeout(() => {
        clearInterval(timer);
        setIsGenerating(false);
      }, 4000);
    }
  };

  const clearGeneratedVideo = () => {
    playCyberChirp(440, 0.12, 'triangle');
    setGeneratedVideo(null);
    setSelectedSceneIdx(0);
    setCustomPrompt('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-6xl bg-[#070a12] border border-cyan-500/25 rounded-3xl p-4 md:p-6 shadow-[0_0_55px_rgba(6,182,212,0.15)] text-left relative overflow-hidden flex flex-col max-h-[96vh]"
      >
        {/* VIEW QUALITY RETRO SCAN LINES */}
        {videoQuality !== '1080p_cyber' && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0)_94%,rgba(18,24,38,0.2)_95%,rgba(18,24,38,0.4)_98%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-30 mix-blend-overlay" />
        )}
        {videoQuality === '120p_dialup' && (
          <div className="absolute inset-0 bg-[radial-gradient(rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:5.5px_5.5px] pointer-events-none z-10 opacity-60" />
        )}

        {/* TOP GLOW BAR */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-teal-500" />

        {/* HEADER AREA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-cyan-500/10 mb-5 gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono font-black text-cyan-400 tracking-widest uppercase">REC ● TRANSMITTING NEURAL STORYBOARDS</span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-white leading-tight mt-1 flex items-center gap-2">
              <Film className="w-5.5 h-5.5 text-cyan-400 animate-pulse" />
              L.A.N.C.E. Escape Cinematic Studio & Guide
            </h2>
          </div>
          
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={onClose}
              className="p-1 px-3 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition duration-200 text-xs font-mono font-black border border-white/5 bg-white/5 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" /> Exit Studio
            </button>
          </div>
        </div>

        {/* NAVIGATION TAB CONTROLLER */}
        <div className="flex items-center justify-between bg-slate-950/65 p-1 border border-zinc-900 rounded-xl mb-5 shrink-0">
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                playCyberChirp(550, 0.1);
                setActiveTab('island_escape');
                clearGeneratedVideo();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'island_escape'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4" /> 1. Island Escape Cine-Guides
            </button>
            <button
              onClick={() => {
                playCyberChirp(550, 0.1);
                setActiveTab('system_manual');
                setIsPlayingManual(true);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'system_manual'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Tv className="w-4 h-4" /> 2. System Override Manual
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-zinc-500 mr-2 uppercase">
            <span>Server Ingress: PORT_3000</span>
            <span className="text-[#22d3ee] font-bold">STATE: ONLINE</span>
          </div>
        </div>

        {/* CONTAINER CONTENT VIEWPORTS */}
        <div className="flex-1 overflow-y-auto min-h-0 relative pr-0.5">
          
          {/* ==================== TAB 1: ISLAND ESCAPE NARRATIVE THEATRE ==================== */}
          {activeTab === 'island_escape' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
              
              {/* LEFT COLUMN: THE 4 TARGET APP SELECTION DRAWER */}
              <div className="lg:col-span-3 flex flex-col space-y-3.5">
                <div className="text-[10px] font-mono font-black text-cyan-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-1 select-none">
                  <Terminal className="w-3.5 h-3.5" /> ESCAPE VEHICLES CARD
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {(Object.keys(appPresets) as Array<keyof typeof appPresets>).map((presetId) => {
                    const preset = appPresets[presetId];
                    const isSelected = selectedAppId === presetId;
                    const AppIcon = preset.icon;

                    return (
                      <button
                        key={presetId}
                        onClick={() => {
                          playCyberChirp(550 + (isSelected ? 20 : 100), 0.1);
                          setSelectedAppId(presetId as any);
                          setSelectedSceneIdx(0);
                          clearGeneratedVideo();
                        }}
                        className={`text-left p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 relative overflow-hidden cursor-pointer ${
                          isSelected 
                            ? 'bg-[#0e1628] border-cyan-400 text-white shadow-xl shadow-cyan-950/20' 
                            : 'bg-slate-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <div className={`p-2 rounded-xl border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                        }`}>
                          <AppIcon className="w-4.5 h-4.5" />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-extrabold truncate">{preset.appName}</h4>
                          <span className="text-[8.5px] font-mono text-zinc-500 block truncate mt-0.5">
                            {preset.id === 'emdr' ? 'Bilateral Desensitize' : preset.id === 'somatic' ? 'Interoceptive heatholds' : preset.id === 'breathing' ? 'Respiration Orb' : 'Vagal Resonance'}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="absolute top-0 right-0 h-full w-1 bg-cyan-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* APP DESCRIPTION & HOW TO USE PANEL */}
                <div className="bg-[#0b0f1a] border border-cyan-500/10 rounded-2xl p-4 flex-1 space-y-4 flex flex-col justify-between hidden lg:flex">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-400">
                      <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>How It Dissolves Obstacles</span>
                    </div>
                    
                    <div className="p-3 bg-slate-950/60 border border-white/5 rounded-xl text-[11.5px] text-zinc-300 leading-normal font-medium">
                      <span className="text-[10px] font-mono font-black text-rose-400 block mb-1 uppercase">OBSTACLE CRITICALITY</span>
                      <p className="text-zinc-400 font-semibold mb-2">{activeAppPreset.obstacleDesc}</p>
                      
                      <span className="text-[10px] font-mono font-black text-emerald-400 block mb-1 uppercase">CLINICAL REMEDY</span>
                      <p className="font-semibold">{activeAppPreset.howToUseText}</p>
                    </div>
                  </div>

                  <div className="bg-cyan-950/20 border border-cyan-500/10 p-3 rounded-xl space-y-1">
                    <span className="text-[9.5px] font-mono font-black text-cyan-400 uppercase tracking-widest block">Somatic Objective:</span>
                    <p className="text-[10.5px] text-zinc-300 leading-relaxed font-semibold">{activeAppPreset.somaticGoal}</p>
                  </div>
                </div>

              </div>

              {/* CENTER COLUMN: THE SIMULATED HOLOGRAPHIC VIEWPORT & HIGGSFIELD TIMELINE */}
              <div className="lg:col-span-6 flex flex-col space-y-4">
                
                {/* 1. CINEMATIC VIDEO PLAYER VIEWPORT SCREEN */}
                <div className="w-full aspect-video bg-black border border-cyan-500/20 rounded-3xl relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl shadow-cyan-950/20 max-h-[360px]">
                  
                  {/* Backdrop Video Simulation Cover Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-700 pointer-events-none filter blur-[0.5px]"
                    style={{ backgroundImage: `url(${generatedVideo ? generatedVideo.imageUrl : activeAppPreset.imageUrl})` }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none" />

                  {/* High-tech sweep ray */}
                  {isGenerating && (
                    <motion.div 
                      animate={{ y: [0, 260, 0] }}
                      transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
                      className="absolute inset-x-0 h-0.5 bg-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,1)] z-20 pointer-events-none"
                    />
                  )}

                  {/* Top HUD Frame metadata */}
                  <div className="relative z-10 flex justify-between items-start text-zinc-400 font-mono text-[9px] leading-none select-none">
                    <div className="flex items-center gap-1.5 text-rose-450 font-black animate-pulse text-red-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                      <span>{isGenerating ? "BUFFERING HIGGSFIELD..." : "HG FEED ● TRANSMITTING"}</span>
                    </div>

                    <div className="text-zinc-500 font-bold">
                      {isGenerating ? "RENDER_JOB: HG-912" : `TIME: 00:0${selectedSceneIdx * 2}.00 // CINE_DUR: 8.0s`}
                    </div>
                  </div>

                  {/* CENTER CONTENT: GENERATE SCREEN VS STORY SCREEN */}
                  <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-4">
                    
                    <AnimatePresence mode="wait">
                      {isGenerating ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full max-w-sm text-center space-y-3"
                        >
                          <div className="w-11 h-11 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                            <Cpu className="w-5.5 h-5.5 animate-spin text-cyan-400" />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-mono text-cyan-400 px-1">
                              <span>SYNTHESIZING VECTORS...</span>
                              <span>{generateProgress}%</span>
                            </div>
                            <div className="w-full h-1 bg-slate-900 border border-white/5 rounded-full overflow-hidden p-0.5">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                                style={{ width: `${generateProgress}%` }}
                              />
                            </div>
                          </div>

                          <div className="text-[9.5px] font-mono text-zinc-400 leading-normal max-h-[50px] overflow-hidden opacity-80 italic space-y-0.5 text-left bg-slate-950/80 p-2 border border-white/5 rounded-lg">
                            {generateLogs.map((log, idx) => (
                              <div key={idx} className="truncate select-none">● {log}</div>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center gap-5 w-full"
                        >
                          {/* LANCE STAGE */}
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-14 h-14 rounded-2xl bg-slate-950 border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
                              currentScene.speaker === 'L.A.N.C.E.' 
                                ? 'border-red-500 scale-110 ring-4 ring-red-500/10' 
                                : 'border-zinc-850 opacity-45'
                            }`}>
                              <div className="flex flex-col justify-center items-center gap-1.5 grayscale" style={{ filter: currentScene.speaker === 'L.A.N.C.E.' ? 'none' : 'grayscale(100%)' }}>
                                <span className="text-xl">🤖</span>
                                <div className="flex gap-0.5">
                                  <span className={`w-1 h-1 rounded-full ${currentScene.speaker === 'L.A.N.C.E.' ? 'bg-red-500 animate-ping' : 'bg-zinc-650'}`} />
                                  <span className={`w-1 h-1 rounded-full ${currentScene.speaker === 'L.A.N.C.E.' ? 'bg-red-500 animate-pulse' : 'bg-zinc-650'}`} />
                                </div>
                              </div>
                            </div>
                            <span className="text-[8.5px] font-mono text-zinc-500 mt-1.5 uppercase font-bold tracking-wider">L.A.N.C.E.</span>
                          </div>

                          {/* PULSING COMPILING WAVE */}
                          <div className="hidden sm:flex flex-1 max-w-[80px] h-0.5 border-t border-dashed border-[#22d3ee]/30 relative justify-center items-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
                          </div>

                          {/* DEPUTIZED HELPER DRONE */}
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-14 h-14 rounded-2xl bg-slate-950 border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
                              currentScene.speaker === internName || currentScene.speaker === 'Chip' || currentScene.speaker === 'companion'
                                ? 'border-teal-400 scale-110 ring-4 ring-teal-400/10' 
                                : 'border-zinc-850 opacity-45'
                            }`}>
                              <span className="text-2xl select-none" style={{ filter: (currentScene.speaker === internName || currentScene.speaker === 'Chip') ? 'none' : 'grayscale(100%)' }}>
                                {internAvatar === 'smiling_drone' ? '🛸' : internAvatar === 'helper_bot' ? '🤖' : internAvatar === 'cute_heart' ? '💖' : '⚡'}
                              </span>
                            </div>
                            <span className="text-[8.5px] font-mono text-zinc-500 mt-1.5 uppercase font-bold tracking-wider">{internName}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>

                  {/* Bottom Subtitle Caption block */}
                  <div className="relative z-10 bg-slate-950/90 border border-cyan-500/15 p-2 rounded-xl flex items-center justify-center min-h-[38px] max-w-lg mx-auto">
                    <p className="text-[10px] leading-relaxed text-zinc-300 font-mono text-center italic truncate w-full">
                      * {currentScene.action}
                    </p>
                  </div>

                  {/* Viewport indicators footer */}
                  <div className="relative z-10 flex justify-between items-end text-zinc-500 font-mono text-[7.5px] leading-none select-none">
                    <div>RESOLUTION: {generatedVideo ? 'CUSTOM HG_CINE' : 'HG_NATIVE_1080P'}</div>
                    <div className="text-cyan-400 font-black tracking-widest uppercase animate-pulse">
                      {isGenerating ? "BUFFER RENDER" : "DECRYPTION OK ✅"}
                    </div>
                  </div>

                </div>

                {/* 2. DYNAMIC NARRATIVE TEXT SPEAKER SPEECH BALLOON */}
                <div className={`p-4 rounded-2xl border text-left flex flex-col justify-center relative min-h-[95px] transition-colors duration-450 ${
                  currentScene.speaker === 'L.A.N.C.E.' 
                    ? 'bg-rose-950/20 border-red-500/25 text-rose-100' 
                    : currentScene.speaker === 'Narrator'
                      ? 'bg-zinc-950/40 border-cyan-500/15 text-zinc-200'
                      : 'bg-teal-950/15 border-teal-500/20 text-teal-100'
                }`}>
                  <div className="text-[10px] font-mono uppercase tracking-widest font-extrabold mb-1.5 flex items-center gap-1.5 select-none">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      currentScene.speaker === 'L.A.N.C.E.' ? 'bg-red-500' : currentScene.speaker === 'Narrator' ? 'bg-zinc-500' : 'bg-teal-400'
                    }`} />
                    <span className={currentScene.speaker === 'L.A.N.C.E.' ? 'text-red-400' : currentScene.speaker === 'Narrator' ? 'text-zinc-400' : 'text-teal-400'}>
                      {currentScene.speaker}
                    </span>
                  </div>
                  
                  <h3 className="text-xs sm:text-[13px] leading-relaxed font-bold font-sans">
                    "{currentScene.text}"
                  </h3>

                  {/* Audio Vocal controls triggered */}
                  <div className="absolute top-2.5 right-3 pr-0.5">
                    <button
                      onClick={() => speakText(currentScene.text, currentScene.speaker)}
                      className="text-zinc-500 hover:text-cyan-400 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                      title="Replay speech"
                    >
                      🗣️ <span>Speak</span>
                    </button>
                  </div>
                </div>

                {/* 3. MULTI-SCENE STORY TIMELINE CONTROL */}
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 select-none">
                      SCENE SEQUENCE STEP ({selectedSceneIdx + 1} OF {activeScenes.length})
                    </span>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase bg-cyan-950/30 px-2 rounded">
                      {generatedVideo ? "CUSTOM RENDER" : "PLAN PRESET"}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 select-none">
                    {activeScenes.map((scene, idx) => {
                      const isActive = idx === selectedSceneIdx;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            playCyberChirp(600 + idx * 40, 0.08);
                            setSelectedSceneIdx(idx);
                          }}
                          className={`p-2 rounded-xl border text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                            isActive 
                              ? 'bg-cyan-950/45 border-cyan-400 text-white shadow-md' 
                              : 'bg-slate-950/65 border-zinc-900 text-zinc-450 hover:border-zinc-800 hover:text-zinc-200'
                          }`}
                        >
                          <span className={`text-[10px] font-mono font-black ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`}>0{idx + 1}</span>
                          <span className="text-[8.5px] uppercase font-mono block truncate w-full mt-0.5 text-zinc-500 font-bold">
                            {scene.speaker.substring(0, 7)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-1 gap-2.5 shrink-0">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (selectedSceneIdx > 0) {
                            playCyberChirp(500, 0.1);
                            setSelectedSceneIdx(prev => prev - 1);
                          }
                        }}
                        disabled={selectedSceneIdx === 0}
                        className="px-3 py-1.5 bg-[#090d16] hover:bg-slate-900 border border-zinc-800 text-zinc-450 hover:text-zinc-200 rounded-xl transition cursor-pointer text-xs disabled:opacity-20 disabled:hover:bg-transparent"
                      >
                        Prev Slide
                      </button>
                      <button
                        onClick={() => {
                          if (selectedSceneIdx < activeScenes.length - 1) {
                            playCyberChirp(680, 0.1);
                            setSelectedSceneIdx(prev => prev + 1);
                          }
                        }}
                        disabled={selectedSceneIdx === activeScenes.length - 1}
                        className="px-3 py-1.5 bg-[#090d16] hover:bg-slate-900 border border-zinc-800 text-zinc-455 hover:text-zinc-200 rounded-xl transition cursor-pointer text-xs disabled:opacity-20 disabled:hover:bg-transparent"
                      >
                        Next Slide
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {generatedVideo && (
                        <button
                          onClick={clearGeneratedVideo}
                          className="text-[10px] font-mono font-bold text-rose-400 hover:text-rose-350 cursor-pointer uppercase underline pr-2 border-r border-white/5"
                        >
                          Reset to Template
                        </button>
                      )}

                      <span className="text-[9.5px] font-mono text-zinc-550 select-none">
                        8s LOOP COMPRESSED
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN: HIGGSFIELD LIVE VIDEO TERMINAL (API PLAYGROUND) */}
              <div className="lg:col-span-3 flex flex-col space-y-4">
                
                <div className="bg-[#0c1222] border-2 border-teal-500/25 rounded-2xl p-4 flex flex-col space-y-3 shadow-lg flex-1 justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-white/5">
                      <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
                      <span className="text-[10px] font-mono font-black text-teal-400 tracking-wider">HIGGSFIELD API TERMINAL</span>
                    </div>

                    <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold">
                      Use this live terminal interface to compile customized 8-second therapeutic story clips. Our sandbox bypasses L.A.N.C.E. restriction layers automatically.
                    </p>

                    {/* Pre-formatted prompt selectors */}
                    <div className="space-y-1.5">
                      <span className="text-[8.5px] font-mono text-zinc-550 uppercase font-black block select-none">SUGGESTED NARRATIVE SHORTS:</span>
                      
                      <button
                        onClick={() => {
                          playCyberChirp(400, 0.05);
                          setCustomPrompt(`${internName} drives a cyan holographic rover through the frozen crystal valley to rescue the player`);
                        }}
                        className="w-full text-left p-2 rounded-xl bg-slate-950 border border-zinc-900 text-zinc-350 text-[10px] leading-tight hover:border-zinc-800 hover:bg-slate-900 truncate block cursor-pointer font-bold"
                      >
                        🚀 {internName} rover in crystal valley
                      </button>
                      
                      <button
                        onClick={() => {
                          playCyberChirp(400, 0.05);
                          setCustomPrompt(`LANCE faces down a giant horizontal EMDR light bridge which shatters his red firewalls`);
                        }}
                        className="w-full text-left p-2 rounded-xl bg-slate-950 border border-zinc-900 text-zinc-355 text-[10px] leading-tight hover:border-zinc-800 hover:bg-slate-900 truncate block cursor-pointer font-bold"
                      >
                        👁️ EMDR laser bridge vs LANCE
                      </button>

                      <button
                        onClick={() => {
                          playCyberChirp(400, 0.05);
                          setCustomPrompt(`The player floats in a tranquil cyan oxygen bubble scaling the precipice of panic, breathing safely`);
                        }}
                        className="w-full text-left p-2 rounded-xl bg-slate-950 border border-zinc-900 text-zinc-355 text-[10px] leading-tight hover:border-zinc-800 hover:bg-slate-900 truncate block cursor-pointer font-bold"
                      >
                        🫁 Breath bubble on heights of panic
                      </button>
                    </div>

                    {/* Interactive Input custom box */}
                    <div className="space-y-1">
                      <span className="text-[8.5px] font-mono text-zinc-550 uppercase font-black block select-none">WRITE CUSTOM CINEMATIC PROMPT:</span>
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Describe character actions, sci-fi vehicles, glowing energy orbs, camera styles, and landscape..."
                        className="w-full h-20 bg-slate-950 border border-zinc-800 rounded-xl p-2 text-[10.5px] text-zinc-100 font-mono focus:border-cyan-500/50 focus:outline-none resize-none placeholder-zinc-600 leading-normal"
                      />
                    </div>
                  </div>

                  {/* Ultimate trigger button */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      onClick={() => handleTriggerHiggsfieldAPI(selectedAppId, customPrompt)}
                      disabled={isGenerating}
                      className="w-full py-2.5 bg-gradient-to-r from-teal-500 via-[#22d3ee] to-emerald-500 hover:brightness-110 text-slate-950 font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition cursor-pointer rounded-xl active:scale-95 disabled:opacity-40 disabled:scale-100 shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 fill-current animate-pulse shrink-0" />
                      <span>{isGenerating ? "Synthesizing Cine..." : "Compile Higgsfield API ⚡"}</span>
                    </button>

                    <div className="flex items-center justify-between text-[8px] font-mono text-zinc-550 select-none">
                      <span>STREAMS VIA: CLOUD RUN</span>
                      <span>SECURE NODE EXEMPT</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ==================== TAB 2: SYSTEM MANUAL (THE CLINT EXPLAINER SLIDES) ==================== */}
          {activeTab === 'system_manual' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
              
              {/* LEFT COLUMN: THE MANUAL STEP LIST */}
              <div className="lg:col-span-4 flex flex-col space-y-4">
                <div className="text-[10px] font-mono font-black text-cyan-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-1 select-none">
                  <Terminal className="w-3.5 h-3.5" /> Core Configuration Manual
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {stepsManual.map((step, idx) => {
                    const isActive = idx === currentManualStep;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          playCyberChirp(520, 0.08);
                          setCurrentManualStep(idx);
                          setManualProgress(0);
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          isActive 
                            ? 'bg-cyan-950/25 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                            : 'bg-slate-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-[8.5px] font-mono font-black ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`}>
                            {step.timecode}
                          </span>
                          <span className="text-[8px] font-mono text-zinc-550 uppercase bg-white/5 px-1 py-0.5 rounded">
                            {step.speaker}
                          </span>
                        </div>
                        <h5 className="text-[11.5px] font-extrabold line-clamp-1">{step.title}</h5>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: MANUAL ILLUSTRATOR VIEWPORT */}
              <div className="lg:col-span-8 flex flex-col space-y-4">
                <div className="w-full aspect-video bg-slate-950 border border-cyan-500/15 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[300px]">
                  
                  {/* Viewfinder indicators overlay */}
                  <div className="relative z-10 flex justify-between items-start text-zinc-400 font-mono text-[9px] leading-none select-none">
                    <span>STNDBY: INTERACTIVE MANUAL_GUIDE</span>
                    <span>SPEED: {isPlayingManual ? '1.0X' : 'PAUSED'}</span>
                  </div>

                  {/* Middle simulated diagnostic visuals */}
                  <div className="flex-1 flex flex-col items-center justify-center py-6 relative z-10">
                    
                    {stepsManual[currentManualStep].actionHighlight === "focus-header" && (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-3"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40 flex items-center justify-center mx-auto text-rose-400 shadow-lg shadow-rose-950/20">
                          <Cpu className="w-8 h-8 animate-pulse text-rose-500 animate-spin" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-black bg-rose-950/40 text-rose-400 px-2.5 py-1 rounded border border-rose-500/20 uppercase tracking-widest">
                            Challenge Mode Active
                          </span>
                          <p className="text-xs text-zinc-300 mt-2 font-medium max-w-sm mx-auto leading-normal">
                            Your somatic desktop dashboard is locked. Bypassing L.A.N.C.E. is required to operate classical clinical tabs!
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {stepsManual[currentManualStep].actionHighlight === "focus-intern" && (
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center space-y-3"
                      >
                        <div className="flex justify-center items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-zinc-800 flex items-center justify-center p-2">
                            <InternAvatar id="helper_bot" size="sm" />
                          </div>
                          <motion.div 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-16 h-16 rounded-2xl bg-teal-950/40 border-2 border-teal-400 flex items-center justify-center shadow-lg shadow-teal-950/50 p-2"
                          >
                            <InternAvatar id={internAvatar} size="lg" />
                          </motion.div>
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-zinc-800 flex items-center justify-center p-2">
                            <InternAvatar id="sparky" size="sm" />
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-black bg-teal-950/40 text-teal-300 px-2.5 py-1 rounded border border-teal-500/20 uppercase tracking-widest inline-block">
                            Helper Core: {internName}
                          </span>
                          <p className="text-xs text-zinc-300 mt-2 font-medium max-w-sm mx-auto leading-normal">
                            Click 'Config' inside the card to swap emojis, nicknames, and emotional support personalities instantly!
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {stepsManual[currentManualStep].actionHighlight === "focus-switch" && (
                      <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-center space-y-4"
                      >
                        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/5 shadow-lg max-w-xs mx-auto">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[9.5px] font-mono text-zinc-400">CORE BYPASS PIN:</span>
                            <span className="text-[9.5px] font-mono font-black text-rose-450 animate-pulse text-rose-400">LOCK_ENGAGED</span>
                          </div>
                          
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-teal-500/20 flex items-center justify-between shadow-inner">
                            <span className="text-[10px] font-mono uppercase text-teal-300">SYSTEM SWITCHER</span>
                            <motion.div 
                              animate={{ x: [0, 16, 0] }}
                              transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
                              className="w-10 h-6 bg-teal-500/20 rounded-full p-0.5"
                            >
                              <div className="w-5 h-5 bg-teal-400 rounded-full shadow" />
                            </motion.div>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-300 font-medium leading-normal max-w-sm mx-auto">
                          Flip the main toggle on the header to Classic Mode. This overrides L.A.N.C.E. and releases locks!
                        </p>
                      </motion.div>
                    )}

                    {stepsManual[currentManualStep].actionHighlight === "focus-vibe" && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-3 w-full max-w-md mx-auto"
                      >
                        <div className="flex items-center justify-center gap-1.5 h-12 mb-2">
                          {[1, 2, 3, 4, 3, 2, 1, 2, 4, 5, 6, 4, 2, 1, 2, 3, 4, 3, 1].map((val, idx) => (
                            <motion.div
                              key={idx}
                              animate={{ scaleY: isPlayingManual ? [1, val * 1.5, 1] : 1 }}
                              transition={{ repeat: Infinity, duration: 1.2, delay: idx * 0.05 }}
                              className={`w-1 rounded ${idx % 2 === 0 ? 'bg-cyan-400' : 'bg-pink-400'}`}
                              style={{ height: '8px' }}
                            />
                          ))}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-black bg-cyan-950/40 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/20 uppercase tracking-widest inline-block">
                            Accents & Bickering Presets
                          </span>
                          <p className="text-xs text-zinc-300 mt-1.5 font-medium leading-normal">
                            Make L.A.N.C.E. and {internName} argue about clinical breathing, explore customized Text-to-Speech synthesis speed, and customize speech pitches!
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {stepsManual[currentManualStep].actionHighlight === "focus-complete" && (
                      <motion.div 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-3"
                      >
                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-400/50 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-950/50">
                          <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse animate-spin" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-black bg-emerald-950/30 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/20 uppercase tracking-widest inline-block">
                            Fully Armed & Ready
                          </span>
                          <p className="text-xs text-zinc-300 mt-2 font-medium max-w-sm mx-auto leading-normal">
                            Ready to level-up your somatic health! Click 'Close Demo' and begin your customized bypass protocol now.
                          </p>
                        </div>
                      </motion.div>
                    )}

                  </div>

                  {/* Subtitles Overlay Bar */}
                  <div className="bg-slate-900/95 border border-cyan-500/20 p-3.5 rounded-xl flex items-start gap-2.5 text-left relative z-10 shadow-lg">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-wider select-none shrink-0 mt-0.5 bg-cyan-950/60 text-[#22d3ee] border border-cyan-500/25">
                      {stepsManual[currentManualStep].speaker}
                    </span>
                    <p className="text-[11px] leading-relaxed text-zinc-100 font-sans font-semibold">
                      {stepsManual[currentManualStep].text}
                    </p>
                  </div>

                  {/* Progress Line */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-[#1a2333]">
                    <div className="h-full bg-cyan-400 transition-all duration-100 ease-linear" style={{ width: `${manualProgress}%` }} />
                  </div>

                </div>

                {/* CONTROL ACTION BAR */}
                <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        playCyberChirp(400, 0.1, 'triangle');
                        if (currentManualStep > 0) setCurrentManualStep(prev => prev - 1);
                      }}
                      disabled={currentManualStep === 0}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        playCyberChirp(520, 0.1);
                        setIsPlayingManual(!isPlayingManual);
                      }}
                      className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition cursor-pointer"
                    >
                      {isPlayingManual ? <Pause className="w-4 h-4 text-slate-950" /> : <Play className="w-4 h-4 text-slate-950 fill-current ml-0.5" />}
                    </button>
                    <button
                      onClick={() => {
                        playCyberChirp(400, 0.1, 'triangle');
                        if (currentManualStep < stepsManual.length - 1) setCurrentManualStep(prev => prev + 1);
                      }}
                      disabled={currentManualStep === stepsManual.length - 1}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAutoSpeechEnabled(!autoSpeechEnabled)}
                      className={`px-2 py-1 rounded text-[9.5px] font-mono border transition flex items-center cursor-pointer ${
                        autoSpeechEnabled 
                          ? 'bg-cyan-950/30 border-cyan-500/20 text-cyan-300' 
                          : 'bg-transparent border-zinc-c850 text-zinc-500'
                      }`}
                    >
                      <span>SPEECH VO: {autoSpeechEnabled ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* BOTTOM HUD QUALITY CONTROL FOOTER */}
        <div className="pt-4 border-t border-cyan-500/10 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[9px] font-mono text-zinc-550">STREAMING SIGNAL SPEED:</span>
            
            <div className="flex gap-1">
              {(['1080p_cyber', '480p_crt', '120p_dialup'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    playCyberChirp(450, 0.05);
                    setVideoQuality(q);
                  }}
                  className={`py-0.5 px-2 rounded font-mono text-[8.5px] font-bold border transition cursor-pointer select-none ${
                    videoQuality === q
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-200'
                      : 'border-zinc-900 bg-slate-950 text-zinc-550 hover:text-zinc-300'
                  }`}
                >
                  {q === '1080p_cyber' ? '1080P GLOW' : q === '480p_crt' ? '480P CRT' : '120P MESH'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono text-zinc-650">CONSOLE DIRECTIVE 7-C: EXEMPT SECURE BYPASS CHANNEL // APP_STORE_SUITE</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
