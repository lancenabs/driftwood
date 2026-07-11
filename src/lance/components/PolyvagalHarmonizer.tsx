import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Shield, Heart, Sliders, Play, Info, AlertTriangle, CheckCircle2, RefreshCw, Send, Sparkles, Volume2
} from 'lucide-react';

interface AutonomousBranch {
  name: string;
  chemical: string;
  state: 'ventral' | 'sympathetic' | 'dorsal';
  color: string;
  bgGrad: string;
  accentText: string;
  bgLight: string;
  borderCol: string;
  emoji: string;
  description: string;
  keyKeywords: string[];
  vibeText: string;
  interventions: {
    title: string;
    description: string;
    duration: string;
    exercise: string[];
  }[];
}

const POLYVAGAL_BRANCH_DATA: Record<'ventral' | 'sympathetic' | 'dorsal', AutonomousBranch> = {
  ventral: {
    name: 'Ventral Vagal (Safe, Connected & Creative)',
    chemical: 'Oxytocin / Acetylcholine',
    state: 'ventral',
    color: 'emerald',
    bgGrad: 'from-emerald-500 via-teal-500 to-cyan-500',
    accentText: 'text-emerald-800',
    bgLight: 'bg-emerald-50/70',
    borderCol: 'border-emerald-200',
    emoji: '🟢',
    description: 'The state of relational safety, social collaboration, and active homeostasis. Heart rate is naturally buffered, gut digestion is healthy, and the brain has active access to creative problem-solving and alternative cognitive scenarios.',
    keyKeywords: ['Curious', 'Empathetic', 'Grounded', 'Passionate', 'Playful'],
    vibeText: 'My environment is safe. I can connect, create, rest, and express digestively.',
    interventions: [
      {
        title: 'Reciprocal Vocalization (Humming)',
        description: 'Engaging cranial nerves VII and X to maintain high vagal tone and reinforce connection.',
        duration: '60 seconds',
        exercise: [
          'Take a normal inhalation through your nose, letting your belly inflate.',
          'Exhale with a gentle, low-pitched vocal hum: "Mmmmmmmm".',
          'Notice the vibration in your throat, jaw and upper breastbone.'
        ]
      },
      {
        title: 'Creative Cognitive Exploration',
        description: 'Using high frontal-lobe coherence to solve challenging ideas.',
        duration: 'Continuous',
        exercise: [
          'Open your CBT Thought Record and log any challenging scenarios.',
          'Because your system is safe, brainstorm three alternative hypotheses for difficult events.'
        ]
      }
    ]
  },
  sympathetic: {
    name: 'Sympathetic (Mobilized, Alert & Fight-or-Flight)',
    chemical: 'Adrenaline / Cortisol',
    state: 'sympathetic',
    color: 'orange',
    bgGrad: 'from-orange-500 via-amber-500 to-red-500',
    accentText: 'text-orange-950',
    bgLight: 'bg-orange-50/70',
    borderCol: 'border-orange-200',
    emoji: '🟠',
    description: 'The mobilized survival state. Designed for active kinetic response to threat. Resources are diverted away from internal digestion toward running limbs. Heart rate accelerates, pupils dilate, and perspective narrows into black-and-white threat scanning.',
    keyKeywords: ['Anxious', 'Frustrated', 'Overwhelmed', 'Hyper-focused', 'Restless'],
    vibeText: 'My surroundings are stressful. I must mobilize, fix, fight, or flee immediately.',
    interventions: [
      {
        title: 'Double Physiological Sigh',
        description: 'Dr. Andrew Huberman\'s rapid autonomic downregulator. Re-inflates collapsed lung sacs and activates parasympathetic nerves immediately.',
        duration: '90 seconds',
        exercise: [
          'Take a deep nose inhale expanding your lungs to about 90%.',
          'Take a second quick sharp nose "sniff" to fully pop open the air sacs.',
          'Release with a long, slow sigh through slightly parted lips: "Ahhhhhh".',
          'Repeat for 3 to 5 continuous breaths.'
        ]
      },
      {
        title: 'Bilateral Gaze-Shifting (EMDR light)',
        description: 'Tapping the optic circuitry to signal to the amygdala that safety is physical and horizontal.',
        duration: '2 minutes',
        exercise: [
          'Keep your shoulders entirely facing forward.',
          'Without moving your neck, drift your eyes slowly to the far left corner.',
          'Hold your eyes there for 30 seconds until you feel a spontaneous swallow or sigh.',
          'Slowly move your gaze to the far right corner and hold for 30 seconds.'
        ]
      }
    ]
  },
  dorsal: {
    name: 'Dorsal Vagal (Shutdown, Immobilized & Freeze)',
    chemical: 'Dynorphin / Endorphins',
    state: 'dorsal',
    color: 'slate',
    bgGrad: 'from-slate-600 via-slate-700 to-blue-900',
    accentText: 'text-slate-900',
    bgLight: 'bg-slate-100',
    borderCol: 'border-slate-300 border-2',
    emoji: '🔵',
    description: 'The ancient unmyelinated survival system. When fight or flight is impossible, or exhaustion is absolute, the system enters metabolic emergency. Blood pressure plummets, muscle tone collapses, and feelings turn completely numb or depressed.',
    keyKeywords: ['Burnt out', 'Numb', 'Trapped', 'Leaden', 'Shunned'],
    vibeText: 'This is too much. I must withdraw, freeze, conserve energy, and play dead.',
    interventions: [
      {
        title: 'Somatic Gravity Grounding',
        description: 'Slowing the metabolic drift and sending heavy safety cues to your gravity receptors.',
        duration: '3 minutes',
        exercise: [
          'Lie down or sit back heavily, letting all your body weight sink into the floor or chair.',
          'Exhale all air and pay exclusive attention to where your body meets physical support.',
          'Touch three different textures around you (your clothes, wood, metal) to anchor back in space.'
        ]
      },
      {
        title: 'Gentle Spinal Mobilization',
        description: 'Waking up the spinal receptors slowly without triggering sympathetic alert sirens.',
        duration: '2 minutes',
        exercise: [
          'Sit tall, let your hands hang loose, and slowly tilt your left ear to your left shoulder.',
          'Inhale slow and soft, then gently rotate your chin toward your sternum.',
          'Trace small, slow shoulder rolls backwards. Warm blood returning to your cognitive cortex.'
        ]
      }
    ]
  }
};

export default function PolyvagalHarmonizer() {
  // Somatic Biomarker Inputs states
  const [pulse, setPulse] = useState<number>(() => {
    return parseInt(localStorage.getItem('therapy_polyvagal_pulse') || '72', 10);
  }); // BPM (50 to 130)
  const [breaths, setBreaths] = useState<number>(() => {
    return parseInt(localStorage.getItem('therapy_polyvagal_breaths') || '14', 10);
  }); // Breaths/min (4 to 28)
  const [muscleTension, setMuscleTension] = useState<number>(() => {
    return parseInt(localStorage.getItem('therapy_polyvagal_muscle_tension') || '4', 10);
  }); // scale 1 to 10
  const [gazeEngagement, setGazeEngagement] = useState<number>(() => {
    return parseInt(localStorage.getItem('therapy_polyvagal_gaze_engagement') || '8', 10);
  }); // scale 1 to 10 (avoidant to social)

  useEffect(() => {
    localStorage.setItem('therapy_polyvagal_pulse', pulse.toString());
    localStorage.setItem('therapy_polyvagal_breaths', breaths.toString());
    localStorage.setItem('therapy_polyvagal_muscle_tension', muscleTension.toString());
    localStorage.setItem('therapy_polyvagal_gaze_engagement', gazeEngagement.toString());
  }, [pulse, breaths, muscleTension, gazeEngagement]);
  
  const [activeInterIdx, setActiveInterIdx] = useState<number>(0);
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [progressTracker, setProgressTracker] = useState<string[]>([]);
  const [practiceSuccess, setPracticeSuccess] = useState<boolean>(false);

  // Core Polyvagal algorithm calculates active branch based on physiological inputs
  const currentBranch = useMemo<AutonomousBranch>(() => {
    // We compute a Sympathetic Mobilization Score and a Dorsal Shutdown Score
    let sympatheticFactor = 0;
    let dorsalFactor = 0;

    // 1. Evaluate Heart Rate
    if (pulse >= 90) sympatheticFactor += (pulse - 90) * 1.5;
    if (pulse < 56) dorsalFactor += (56 - pulse) * 2;

    // 2. Evaluate Breaths
    if (breaths >= 18) sympatheticFactor += (breaths - 18) * 3;
    if (breaths < 8) dorsalFactor += (8 - breaths) * 4;

    // 3. Evaluate Tension
    if (muscleTension >= 6) {
      // High tension can be mobilizing (sympathetic) OR rigid stagnation (dorsal shutdown)
      if (pulse < 60) {
        dorsalFactor += (muscleTension) * 5;
      } else {
        sympatheticFactor += (muscleTension) * 5;
      }
    }

    // 4. Evaluate Eye Contact / Speech engagement
    if (gazeEngagement <= 3) {
      dorsalFactor += (4 - gazeEngagement) * 6;
    } else if (gazeEngagement <= 6) {
      sympatheticFactor += (7 - gazeEngagement) * 2;
    }

    // Determine state
    if (sympatheticFactor > 15 && sympatheticFactor >= dorsalFactor) {
      return POLYVAGAL_BRANCH_DATA.sympathetic;
    } else if (dorsalFactor > 15 && dorsalFactor > sympatheticFactor) {
      return POLYVAGAL_BRANCH_DATA.dorsal;
    } else {
      return POLYVAGAL_BRANCH_DATA.ventral;
    }
  }, [pulse, breaths, muscleTension, gazeEngagement]);

  // Audio simulation beep triggers
  const playPulseSimulation = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(currentBranch.state === 'ventral' ? 320 : currentBranch.state === 'sympathetic' ? 440 : 220, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch (e) {
      console.log('AudioContext not allowed or silent bias', e);
    }
  };

  const startInterventionPractice = (durationString: string) => {
    setIsPracticing(true);
    setPracticeSuccess(false);
    // Parse duration (e.g. "90 seconds")
    const match = durationString.match(/\d+/);
    const secs = match ? parseInt(match[0], 10) : 60;
    setSecondsLeft(secs);

    const intvl = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intvl);
          setIsPracticing(false);
          setPracticeSuccess(true);
          // Auto lower biomarkers gracefully!
          if (currentBranch.state === 'sympathetic') {
            setPulse(prevP => Math.max(72, prevP - 8));
            setBreaths(prevB => Math.max(12, prevB - 3));
            setMuscleTension(prevT => Math.max(3, prevT - 2));
          } else if (currentBranch.state === 'dorsal') {
            setPulse(prevP => Math.min(68, prevP + 6));
            setBreaths(prevB => Math.min(11, prevB + 2));
            setGazeEngagement(prevG => Math.min(7, prevG + 2));
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div id="polyvagal-harmonizer-card" className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#0f766e] font-mono">
            <Activity className="w-4 h-4 text-[#0f766e]" />
            <span>Nervous System Calibration</span>
          </div>
          <h3 className="font-display text-base font-bold text-slate-900 tracking-tight">
            Polyvagal State Harmonizer
          </h3>
          <p className="text-[11.5px] text-slate-500 font-medium leading-relaxed">
            Nervous systems don't have flat "moods". They activate real biological branches. Slide your actual biomarkers below to calculate your current state of arousal and obtain immediate somatic relief steps.
          </p>
        </div>

        <div className="bg-slate-100 px-3 py-1 text-[9.5px] font-bold font-mono rounded-lg border border-slate-200 uppercase tracking-widest text-slate-600 block">
          Stephen Porges' Theory
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: BIOMARKER INTERACTIVE DIALS (lg:span-5) */}
        <div className="lg:col-span-5 bg-slate-50/70 border border-slate-100 p-4.5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#3d627f]" />
              <span>Diagnostic Somatic Sliders</span>
            </h4>
            <button 
              type="button" 
              onClick={playPulseSimulation}
              className="text-[10px] font-bold text-[#0f766e] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3 h-3 animate-pulse" />
              <span>Simulate Pulse Tone</span>
            </button>
          </div>

          {/* Slider 1: Pulse */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                ❤️ Heart Rate (BPM):
              </span>
              <span className="font-mono font-black text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                {pulse} bpm
              </span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="130" 
              value={pulse} 
              onChange={(e) => setPulse(parseInt(e.target.value, 10))}
              className="w-full accent-[#0f766e] bg-slate-200 h-1.5 rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Deep Sleep (50)</span>
              <span>Nominal (72)</span>
              <span>Tense / Running (130)</span>
            </div>
          </div>

          {/* Slider 2: Breaths */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1 font-sans">
                🌬️ Respiratory Rate:
              </span>
              <span className="font-mono font-black text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                {breaths} breaths/min
              </span>
            </div>
            <input 
              type="range" 
              min="4" 
              max="28" 
              value={breaths} 
              onChange={(e) => setBreaths(parseInt(e.target.value, 10))}
              className="w-full accent-[#0f766e] bg-slate-200 h-1.5 rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Yogi Sighs (4)</span>
              <span>Nominal (14)</span>
              <span>Panting/Panic (28)</span>
            </div>
          </div>

          {/* Slider 3: Muscle Tension */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">💪 Muscle Posture Rigidity:</span>
              <span className="font-mono font-black text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                {muscleTension} / 10
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={muscleTension} 
              onChange={(e) => setMuscleTension(parseInt(e.target.value, 10))}
              className="w-full accent-[#0f766e] bg-slate-200 h-1.5 rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Loose/Flaccid</span>
              <span>Grounded</span>
              <span>Tense Armored</span>
            </div>
          </div>

          {/* Slider 4: Engagement */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">👀 Social Responsiveness:</span>
              <span className="font-mono font-black text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                {gazeEngagement} / 10
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={gazeEngagement} 
              onChange={(e) => setGazeEngagement(parseInt(e.target.value, 10))}
              className="w-full accent-[#0f766e] bg-slate-200 h-1.5 rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Locked Flat/Decline</span>
              <span>Nominal engagement</span>
              <span>Bright/Reciprocal</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE BRANCH DETAILS & CALIBRATED SOMATIC CUES (lg:span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Diagnostic Active State Banner */}
          <div className={`p-5 rounded-2xl border ${currentBranch.borderCol} ${currentBranch.bgLight} space-y-3 relative overflow-hidden transition-all duration-300 flex-1`}>
            {/* Visual gradient indicator badge */}
            <div className={`h-2.5 w-full bg-gradient-to-r ${currentBranch.bgGrad} rounded-full`} />
            
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest font-mono block">DETECTED BIOLOGICAL BRANCH:</span>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <span className="text-lg">{currentBranch.emoji}</span> {currentBranch.name}
                </h4>
                <div className="text-[10px] bg-white px-2 py-0.5 rounded border border-black/5 inline-block font-mono font-bold text-slate-500">
                  Dominant Chemicals: {currentBranch.chemical}
                </div>
              </div>
            </div>

            <p className="text-xs font-semibold leading-relaxed text-slate-600">
              {currentBranch.description}
            </p>

            <blockquote className="bg-white/70 p-3 rounded-xl text-xs border border-white/60 text-slate-700 italic font-medium leading-normal">
              "{currentBranch.vibeText}"
            </blockquote>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mr-1">Tuning Keywords:</span>
              {currentBranch.keyKeywords.map((word) => (
                <span 
                  key={word} 
                  className="bg-white text-[11px] font-bold text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200/60 shadow-3xs"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Dynamic recommended interventions selector */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-3xs space-y-3">
            <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>Recommended Somatic Interventions</span>
            </h5>

            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold w-full">
              {currentBranch.interventions.map((item, idx) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    setActiveInterIdx(idx);
                    setIsPracticing(false);
                  }}
                  className={`flex-1 py-1 px-2.5 rounded-md text-[10px] uppercase font-bold tracking-tight transition cursor-pointer select-none ${
                    activeInterIdx === idx 
                      ? 'bg-white text-slate-900 shadow-3xs' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>

            {/* Display active intervention steps */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-slate-900">
                  {currentBranch.interventions[activeInterIdx]?.title}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 font-mono">
                  Duration: {currentBranch.interventions[activeInterIdx]?.duration}
                </span>
              </div>
              
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {currentBranch.interventions[activeInterIdx]?.description}
              </p>

              <ol className="space-y-1.5 pl-4 list-decimal text-xs font-medium text-slate-700 leading-relaxed">
                {currentBranch.interventions[activeInterIdx]?.exercise.map((step, idx) => (
                  <li key={idx}>
                    {step}
                  </li>
                ))}
              </ol>

              {/* Start Exercise practice simulator */}
              <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between gap-3">
                {isPracticing ? (
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: secondsLeft, ease: 'linear' }}
                        className="h-full bg-[#0f766e]"
                      />
                    </div>
                    <span className="font-mono text-xs font-black text-[#0f766e] bg-[#0f766e]/10 px-2.5 py-0.5 rounded-lg">
                      {secondsLeft}s
                    </span>
                  </div>
                ) : (
                  <>
                    {practiceSuccess ? (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 p-2 rounded-xl w-full">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Practice log complete! Biometric markers updated to healthier baseline coordinates.</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startInterventionPractice(currentBranch.interventions[activeInterIdx]?.duration)}
                        className="w-full py-2 bg-[#0f766e] hover:bg-[#0f766e]/95 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer select-none"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Begin Coordinated Practice</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
