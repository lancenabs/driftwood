import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Check, Thermometer, Zap, Wind, ShieldAlert, AlertTriangle, Play, HelpCircle, Activity, Hourglass, RefreshCw,
  Eye, Fingerprint, Volume2, Smile, VolumeX, Volume1, Compass, Link2, Trash2, Plus, ArrowDown, Save, FileText, CheckSquare, Layers, Clock, AlertOctagon,
  Scale, Phone, MessageSquare
} from 'lucide-react';

interface DbtSkillsSpaceProps {
  onTriggerInteractionAlert: (title: string, body: string) => void;
  // Which tab this space opens on — the Library has two entry points into this same
  // component (Wise Mind vs TIPP Crisis Skills); each should land on its own content
  // instead of both dropping the user onto a generic default.
  focusTab?: 'wisemind' | 'stop' | 'temperature';
}

type DbtTab = 'wisemind' | 'stop' | 'temperature' | 'pacedbreath' | 'intense' | 'paired' | 'grounding' | 'chain';

export default function DbtSkillsSpace({ onTriggerInteractionAlert, focusTab = 'stop' }: DbtSkillsSpaceProps) {
  const [activeTab, setActiveTab] = useState<DbtTab>(focusTab);

  // Wise Mind reflection states — Emotion Mind vs Reasonable Mind vs the synthesis,
  // the actual DBT mindfulness exercise this tool was missing entirely before.
  const [emotionMindText, setEmotionMindText] = useState('');
  const [reasonableMindText, setReasonableMindText] = useState('');
  const [wiseMindText, setWiseMindText] = useState('');
  const [wiseMindSaved, setWiseMindSaved] = useState(false);

  // Paced Breathing (the 2nd "P" in TIPP — extended exhale slows the heart via the
  // vagus nerve). This existed only as an unused `pacedCount` state before; the tab
  // itself was never built, so TIPP was missing 1 of its 4 components.
  const [pacedBreathPhase, setPacedBreathPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [pacedBreathCycle, setPacedBreathCycle] = useState(0);
  const PACED_BREATH_TARGET_CYCLES = 6;

  // SOS Temperature States
  const [tempTimer, setTempTimer] = useState(0);
  const [tempRunning, setTempRunning] = useState(false);
  const [isCooled, setIsCooled] = useState(false);

  // SOS Intense Exercise States
  const [dischargeProgress, setDischargeProgress] = useState(0);
  const [adrenalineReleased, setAdrenalineReleased] = useState(false);

  // SOS Paired Muscle Checkboxes
  const [muscleStates, setMuscleStates] = useState<{ [key: string]: boolean }>({
    jaw: false,
    shoulders: false,
    fists: false,
    stomach: false,
    hips: false
  });

  // 5-4-3-2-1 Sensory Grounding States
  const [groundingStep, setGroundingStep] = useState<number>(5); // 5 to 1, then 0 for complete/success
  const [groundingItemsClicked, setGroundingItemsClicked] = useState<boolean[]>(new Array(5).fill(false));
  const [customGroundingInputs, setCustomGroundingInputs] = useState<string[]>(new Array(5).fill(''));
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);

  // DBT Chain Analysis States
  const [chainProblemBehavior, setChainProblemBehavior] = useState('Reacted with an angry email/text to feedback');
  const [chainVulnerability, setChainVulnerability] = useState('Exhausted on 5 hours of sleep, had skipped lunch, and had too much caffeine');
  const [chainTriggerEvent, setChainTriggerEvent] = useState('An automated criticism message or comment received outer channel');
  const [chainShortConsequence, setChainShortConsequence] = useState('Quick release of energy, venting, short temporary control');
  const [chainLongConsequence, setChainLongConsequence] = useState('Strained relational dynamics, lingering high anxiety, hours of rumination');
  const [chainLinks, setChainLinks] = useState<{ id: string; type: 'thought' | 'emotion' | 'sensation' | 'urge' | 'action'; value: string }[]>([
    { id: '1', type: 'thought', value: 'They think my work is totally worthless and they do not respect me.' },
    { id: '2', type: 'emotion', value: 'Intense shame, defensive rage and catastrophic fear' },
    { id: '3', type: 'sensation', value: 'Accelerated heart rate, intense facial flushing, chest tightness' },
    { id: '4', type: 'urge', value: 'Immediate urge to lash back to protect my dignity and pride' }
  ]);
  const [chainAlternativeSkills, setChainAlternativeSkills] = useState<{ [linkId: string]: string }>({
    '1': 'STOP Skill: Pause and challenge binary mind distortion with facts.',
    '3': 'Mammalian Dive Reflex: Splash cold water to lower nervous system pulse.'
  });
  const [savedChains, setSavedChains] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('therapy_dbt_chain_analyses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel(); // Clears any speaking buffers
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92; // Serene pacing
      utterance.pitch = 1.05; // Slightly comforting lift
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis blocked or unsupported:", e);
    }
  };

  // Reinitialize states and trigger speech reading when the grounding step changes
  useEffect(() => {
    if (activeTab === 'grounding') {
      setGroundingItemsClicked(new Array(groundingStep).fill(false));
      setCustomGroundingInputs(new Array(groundingStep).fill(''));
      
      const prompts: { [key: number]: string } = {
        5: "Identify five things you can see around you. Tap and name each object to focus your visual center.",
        4: "Next, connect with somatic touch. Tap four distinct things you can physically feel or touch right now.",
        3: "Excellent. Listen carefully. Name three different sounds you can pick up in your surroundings.",
        2: "Moving deeper. Scent promotes safety. Identify two scents, fragrances, or air qualities near you.",
        1: "Final anchor. Direct your focus inward. Notice one thing you can physically taste, or have a refresh of water."
      };
      if (prompts[groundingStep]) {
        speakText(prompts[groundingStep]);
      }
    }
  }, [groundingStep]);

  // Tab switching triggers reset or clears audio synthesis
  useEffect(() => {
    if (activeTab === 'grounding') {
      setGroundingStep(5);
      setGroundingItemsClicked(new Array(5).fill(false));
      setCustomGroundingInputs(new Array(5).fill(''));
      speakText("Let's activate the five four three two one sensory grounding protocol. Direct your sight to five objects you can see around you. Tap each block as you focus on it.");
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [activeTab]);

  const allCurrentItemsClicked = groundingItemsClicked.length > 0 && groundingItemsClicked.every(v => v);

  const handleToggleGroundingItem = (index: number) => {
    const next = [...groundingItemsClicked];
    next[index] = !next[index];
    setGroundingItemsClicked(next);
    
    if (next[index]) {
      const textInput = customGroundingInputs[index];
      const whisper = ENCOURAGING_WHISPERS[Math.floor(Math.random() * ENCOURAGING_WHISPERS.length)];
      const audioToSpeak = textInput 
        ? `${textInput} acknowledged.` 
        : `${whisper}`;
      speakText(audioToSpeak);
    }
  };

  const handleNextGroundingStep = () => {
    if (groundingStep > 1) {
      setGroundingStep(g => g - 1);
    } else {
      setGroundingStep(0);
      logSkillUsage("5-4-3-2-1 Sensory Grounding");
      onTriggerInteractionAlert(
        "🧠 5-4-3-2-1 Sensory Grounding Loop Complete",
        "Sensational progress! Directly connecting to external visual cues, physical touch, external acoustics, air scents, and taste signals your motor and sensory organs that no real immediate threat exists. This effectively soothes the amygdala."
      );
      speakText("Wonderful! You have completed the series and unified your senses. Your nervous system is now anchored in comfort and immediate safety.");
    }
  };

  const logSkillUsage = (skillName: string) => {
    try {
      const raw = localStorage.getItem('therapy_dbt_rescue_logs') || '[]';
      const logs = JSON.parse(raw);
      logs.push({
        id: `dbt-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        skill: skillName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      localStorage.setItem('therapy_dbt_rescue_logs', JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (tempRunning && tempTimer > 0) {
      interval = setInterval(() => {
        setTempTimer(t => t - 1);
      }, 1000);
    } else if (tempRunning && tempTimer === 0) {
      setTempRunning(false);
      setIsCooled(true);
      logSkillUsage("Mammalian Dive Reflex (Vagus Nerve Cooling)");
      onTriggerInteractionAlert(
        "❄️ Mammalian Dive Reflex Triggered", 
        "Excellent! Splashing cold water on your temples and eyes signals the vagal heart node to immediately lower your pulse by 15-25%, breaking acute mental fight-or-flight states."
      );
    }
    return () => clearInterval(interval);
  }, [tempRunning, tempTimer]);

  const handleStartTempChallenge = () => {
    setTempTimer(15);
    setTempRunning(true);
    setIsCooled(false);
  };

  const handleTapDischarge = () => {
    if (adrenalineReleased) return;
    setDischargeProgress(p => {
      const next = p + 8;
      if (next >= 100) {
        setAdrenalineReleased(true);
        logSkillUsage("Intense Isometric Muscle Flexing");
        onTriggerInteractionAlert(
          "⚡ Somatic Tension Discharged", 
          "Beautifully done! Converting raw mental anxiety adrenaline into high-intensity physical flexing or isometric resistance signals the brain that the physical fight has concluded, prompting cortisol breakdown."
        );
        return 100;
      }
      return next;
    });
  };

  const resetDischarge = () => {
    setDischargeProgress(0);
    setAdrenalineReleased(false);
  };

  // Paced Breathing: 4s inhale, 2s hold, 8s exhale — an extended-exhale ratio, which is
  // the actual clinical TIPP-P technique (longer exhale than inhale slows heart rate via
  // the vagus nerve; this is a different pattern than box breathing's equal 4-4-4-4).
  const PACED_PHASE_SECONDS: Record<'inhale' | 'hold' | 'exhale', number> = { inhale: 4, hold: 2, exhale: 8 };
  useEffect(() => {
    if (pacedBreathPhase === 'idle') return;
    const seconds = PACED_PHASE_SECONDS[pacedBreathPhase];
    const timer = setTimeout(() => {
      if (pacedBreathPhase === 'inhale') setPacedBreathPhase('hold');
      else if (pacedBreathPhase === 'hold') setPacedBreathPhase('exhale');
      else {
        const nextCycle = pacedBreathCycle + 1;
        if (nextCycle >= PACED_BREATH_TARGET_CYCLES) {
          setPacedBreathCycle(nextCycle);
          setPacedBreathPhase('idle');
          logSkillUsage('Paced Breathing (Extended Exhale)');
          onTriggerInteractionAlert(
            '🫁 Paced Breathing Complete',
            `${PACED_BREATH_TARGET_CYCLES} extended-exhale cycles complete. A longer exhale than inhale activates your vagus nerve's calming brake on heart rate — this is a real, measurable physiological shift, not just a mental trick.`
          );
        } else {
          setPacedBreathCycle(nextCycle);
          setPacedBreathPhase('inhale');
        }
      }
    }, seconds * 1000);
    return () => clearTimeout(timer);
  }, [pacedBreathPhase, pacedBreathCycle]);

  const startPacedBreathing = () => {
    setPacedBreathCycle(0);
    setPacedBreathPhase('inhale');
  };
  const stopPacedBreathing = () => {
    setPacedBreathPhase('idle');
    setPacedBreathCycle(0);
  };

  // Wise Mind reflection — the actual missing DBT mindfulness exercise. Saves to the
  // same log TIPP skills use (therapy_dbt_rescue_logs) so it counts toward challenge
  // completion the same way, plus keeps the reflection text itself for the client to
  // revisit (not just a "skill used" tag like the TIPP timers log).
  const saveWiseMindReflection = () => {
    if (!wiseMindText.trim()) return;
    try {
      const raw = localStorage.getItem('therapy_dbt_rescue_logs') || '[]';
      const logs = JSON.parse(raw);
      logs.push({
        id: `dbt-wisemind-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        skill: 'Wise Mind Reflection',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotionMind: emotionMindText.trim(),
        reasonableMind: reasonableMindText.trim(),
        wiseMind: wiseMindText.trim(),
      });
      localStorage.setItem('therapy_dbt_rescue_logs', JSON.stringify(logs));
      setWiseMindSaved(true);
      onTriggerInteractionAlert(
        '🧭 Wise Mind Reflection Saved',
        'You found the synthesis between what you feel and what you know. That\'s Wise Mind — not suppressing the emotion, not ignoring the logic, but both at once.'
      );
      setTimeout(() => setWiseMindSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleMuscle = (key: string) => {
    setMuscleStates(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const allSelected = Object.values(next).every(v => v === true);
      if (allSelected && !prev[key]) { // Trigger alert only on final click
        logSkillUsage("Paired Progressive Muscle Relaxation");
        onTriggerInteractionAlert(
          "🌟 Total Somatic Peace Activated", 
          "By intentionally contracting major muscular groups and fully letting gravity take over, you have successfully down-regulated somatic sympathetic hyper-arousal."
        );
      }
      return next;
    });
  };

  return (
    <div className="space-y-5 text-left">
      {/* SOS Acute Distress Alert Banner */}
      <div className="duo-banner duo-banner-red space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚨</span>
          <span className="duo-badge duo-badge-orange">DBT Crisis Zone — TIPP Protocol</span>
        </div>
        <h3 className="font-sans text-base font-bold text-slate-800">When Emotions Hit 10 out of 10</h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
          If your emotional fire is burning too hot, cognitive thoughts do not work. You must use immediate <strong>biological hacks</strong> to cool down your neuro-chemistry.
        </p>
        <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-red-800">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span>In real danger right now? </span>
          <a href="tel:988" className="underline decoration-2 underline-offset-2">Call 988</a>
          <span>or</span>
          <a href="sms:988" className="underline decoration-2 underline-offset-2">text 988</a>
          <span>— free, 24/7.</span>
        </div>
      </div>

      {/* Internal Subtabs Row */}
      <div className="grid grid-cols-2 xs:grid-cols-4 sm:flex flex-wrap gap-1 p-1 bg-white border border-neutral-200/80 shadow-[0_1px_5px_rgba(0,0,0,0.02)] rounded-2xl max-w-3xl mx-auto w-full">
        {[
          { id: 'wisemind' as const, label: '🧭 Wise Mind', color: 'text-teal-700' },
          { id: 'stop' as const, label: '🛑 STOP', color: 'text-red-700' },
          { id: 'temperature' as const, label: '❄️ Cooling', color: 'text-sky-700' },
          { id: 'pacedbreath' as const, label: '🫁 Paced Breath', color: 'text-cyan-700' },
          { id: 'intense' as const, label: '⚡ Tension', color: 'text-amber-700' },
          { id: 'paired' as const, label: '💆 Muscle', color: 'text-emerald-700' },
          { id: 'grounding' as const, label: '👁️ 5-4-3-2-1', color: 'text-indigo-700' },
          { id: 'chain' as const, label: '⛓️ Chain Analysis', color: 'text-violet-700' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center sm:flex-1 ${
              activeTab === tab.id
                ? 'text-white shadow-sm font-black'
                : `${tab.color} hover:text-slate-900 hover:bg-neutral-50 font-semibold`
            }`}
            style={activeTab === tab.id ? { background: '#58CC02' } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'wisemind' && (
          <motion.div
            key="wisemind"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Scale className="w-4 h-4 text-teal-600" />
                <span>Wise Mind</span>
              </h4>
              <p className="text-[10.5px] text-zinc-500 font-semibold leading-relaxed">
                Wise Mind is the overlap between <strong className="text-rose-700">Emotion Mind</strong> (what
                you feel, hot and fast) and <strong className="text-indigo-700">Reasonable Mind</strong> (what
                you know, cool and logical). It's not a compromise between the two — it's the place where both
                are true at once. Write through all three below.
              </p>
            </div>

            {/* Emotion vs Reasonable Mind visual */}
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-center text-[9px] font-black text-rose-800 bg-rose-100 border border-rose-200 -mr-4 z-0">
                Emotion<br/>Mind
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-center text-[9px] font-black text-teal-800 bg-teal-200/80 border-2 border-teal-400 z-10 shadow-sm">
                Wise<br/>Mind
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-center text-[9px] font-black text-indigo-800 bg-indigo-100 border border-indigo-200 -ml-4 z-0">
                Reasonable<br/>Mind
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-1.5">
                <label className="text-xs font-black text-rose-800 font-mono block">
                  What is Emotion Mind saying?
                </label>
                <p className="text-[9.5px] text-rose-700/70 font-semibold">
                  The raw feeling, no filter. "I feel like..." not "I think..."
                </p>
                <textarea
                  value={emotionMindText}
                  onChange={e => setEmotionMindText(e.target.value)}
                  rows={2}
                  placeholder="e.g., I feel like everyone is against me and I want to shut everyone out right now."
                  className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none resize-none bg-white border border-rose-200 text-slate-800"
                />
              </div>

              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-1.5">
                <label className="text-xs font-black text-indigo-800 font-mono block">
                  What is Reasonable Mind saying?
                </label>
                <p className="text-[9.5px] text-indigo-700/70 font-semibold">
                  The facts only — what's actually, provably true right now.
                </p>
                <textarea
                  value={reasonableMindText}
                  onChange={e => setReasonableMindText(e.target.value)}
                  rows={2}
                  placeholder="e.g., One person didn't reply yet. That's the only fact. Everything else is a story I'm adding."
                  className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none resize-none bg-white border border-indigo-200 text-slate-800"
                />
              </div>

              <div className="p-3.5 bg-teal-50/70 border-2 border-teal-300 rounded-2xl space-y-1.5">
                <label className="text-xs font-black text-teal-800 font-mono block">
                  Where do they meet? (Wise Mind)
                </label>
                <p className="text-[9.5px] text-teal-700/80 font-semibold">
                  Not "calm down" — a true sentence that honors both the feeling and the facts.
                </p>
                <textarea
                  value={wiseMindText}
                  onChange={e => setWiseMindText(e.target.value)}
                  rows={2}
                  placeholder="e.g., I'm hurt and scared of being abandoned, AND I don't actually have proof that's happening. I can wait and check before I react."
                  className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none resize-none bg-white border border-teal-300 text-slate-800"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={saveWiseMindReflection}
              disabled={!wiseMindText.trim()}
              className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: wiseMindSaved ? '#58CC02' : 'linear-gradient(135deg,#14B8A6,#0D9488)', color: '#fff' }}
            >
              {wiseMindSaved ? '✓ Saved to your log' : 'Save This Reflection'}
            </button>
          </motion.div>
        )}

        {activeTab === 'stop' && (
          <motion.div
            key="stop"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800">The DBT STOP Skill Blueprint</h4>
              <p className="text-[10.5px] text-zinc-500 font-semibold leading-relaxed">
                When you sense your biological tension rising, take complete command of your physical autonomy immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1.5">
              <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-2xl space-y-1">
                <span className="text-xs font-black text-red-800 font-mono">S - STOP!</span>
                <p className="text-[10.5px] text-slate-600 leading-relaxed font-semibold">
                  Do not speak, react, or text message. Freeze immediately. Your raw feelings are attempting to make you jump to automatic behaviors.
                </p>
              </div>

              <div className="p-3.5 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-1">
                <span className="text-xs font-black text-sky-800 font-mono">T - Take a Step Back!</span>
                <p className="text-[10.5px] text-slate-600 leading-relaxed font-semibold">
                  Physically move away from the prompt. Take a deep, slow diaphragmatic sigh and loosen your closed fingers.
                </p>
              </div>

              <div className="p-3.5 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-1">
                <span className="text-xs font-black text-purple-800 font-mono">O - Observe!</span>
                <p className="text-[10.5px] text-slate-600 leading-relaxed font-semibold">
                  Look around neutrally. What are pure objective facts? Avoid stories, theories, or guessing what people's intentions are.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-1">
                <span className="text-xs font-black text-emerald-800 font-mono">P - Proceed Mindfully!</span>
                <p className="text-[10.5px] text-slate-600 leading-relaxed font-semibold">
                  Ask yourself: "What behavior will improve the current moment or support my peace right now?" Act purely from Wise Mind.
                </p>
              </div>
            </div>

            <p className="text-[11px] font-semibold leading-relaxed rounded-xl px-3 py-2" style={{ color: '#0D9488', background: '#14B8A614' }}>
              🧭 Wise Mind = the balance point between <strong>Emotion Mind</strong> (feelings driving the bus) and <strong>Reasonable Mind</strong> (pure logic, no feelings). It's where facts and feelings meet.
            </p>
          </motion.div>
        )}

        {activeTab === 'temperature' && (
          <motion.div 
            key="temp"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800">T - Temperature (Mammalian Dive Reflex)</h4>
              <p className="text-[10.5px] text-zinc-500 font-bold leading-relaxed">
                Splashing freezing cold water on your closed face or eyes triggers rapid vagus nerve cooling to bypass immediate panic.
              </p>
            </div>

            {/* Mindset Integration Block */}
            <div className="p-3.5 bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] rounded-2xl border border-sky-200 flex items-start gap-2.5">
              <span className="text-lg">🎛️</span>
              <div className="space-y-0.5">
                <h5 className="text-[10.5px] font-black text-sky-950 uppercase tracking-wider">The Thermostatic Shift</h5>
                <p className="text-[9.5px] text-sky-800 font-bold leading-relaxed">
                  When your environment rises in emotional drama, do not act as a <strong>Thermometer</strong> reflecting their heat. Apply physical cooling to reset your vagus nerve, reclaiming your authority as a conscious <strong>Thermostat</strong> who regulates their own internal temperature.
                </p>
              </div>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex flex-col items-center text-center space-y-3.5">
              <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200">
                <Thermometer className="w-6 h-6 stroke-[2.5]" />
              </div>

              {tempRunning ? (
                <div className="space-y-2">
                  <span className="text-2xl font-black font-mono text-sky-800 block">{tempTimer}s remaining</span>
                  <p className="text-[11px] text-sky-700 font-semibold max-w-xs">
                    Hold a cold, wet cloth or ice pack over your upper brow and eyes now. Breathe smoothly and slowly.
                  </p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden max-w-[200px] mx-auto">
                    <motion.div 
                      className="bg-sky-600 h-full"
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 15, ease: 'linear' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {isCooled ? (
                    <span className="text-emerald-700 font-bold text-xs block">✨ Vagal Nerve Calmed Successfully</span>
                  ) : (
                    <p className="text-[10.5px] text-slate-500 font-bold leading-relaxed max-w-sm">
                      Go to a bathroom sink, compile cold tap water, hold your breath, and press "Start Cold Timer" while keeping cold contact on your eyes.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleStartTempChallenge}
                    className="py-2 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black transition shadow-sm cursor-pointer"
                  >
                    Start 15s Cold Checkup
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'pacedbreath' && (
          <motion.div
            key="pacedbreath"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800">P - Paced Breathing (Extended Exhale)</h4>
              <p className="text-[10.5px] text-zinc-500 font-bold leading-relaxed">
                A longer exhale than inhale directly activates your vagus nerve's "brake" on heart rate. Follow the circle: in for 4, hold for 2, out for 8.
              </p>
            </div>

            <div className="p-5 bg-cyan-50 rounded-2xl border border-cyan-100 flex flex-col items-center text-center space-y-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <motion.div
                  className="absolute rounded-full bg-cyan-200/70 border-2 border-cyan-400"
                  animate={{
                    width: pacedBreathPhase === 'exhale' ? 60 : pacedBreathPhase === 'idle' ? 80 : 128,
                    height: pacedBreathPhase === 'exhale' ? 60 : pacedBreathPhase === 'idle' ? 80 : 128,
                  }}
                  transition={{ duration: pacedBreathPhase === 'inhale' ? 4 : pacedBreathPhase === 'exhale' ? 8 : 0.5, ease: 'easeInOut' }}
                />
                <span className="relative text-xs font-black text-cyan-900 uppercase tracking-wider">
                  {pacedBreathPhase === 'idle' ? 'Ready' : pacedBreathPhase === 'inhale' ? 'In...' : pacedBreathPhase === 'hold' ? 'Hold' : 'Out...'}
                </span>
              </div>

              {pacedBreathPhase === 'idle' ? (
                <div className="space-y-3">
                  {pacedBreathCycle >= PACED_BREATH_TARGET_CYCLES ? (
                    <span className="text-emerald-700 font-bold text-xs block">✨ {PACED_BREATH_TARGET_CYCLES} Cycles Complete — Heart Rate Signal Sent</span>
                  ) : (
                    <p className="text-[10.5px] text-slate-500 font-bold leading-relaxed max-w-sm">
                      Sit comfortably. Tap start and follow the circle for {PACED_BREATH_TARGET_CYCLES} full breaths.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={startPacedBreathing}
                    className="py-2 px-5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-black transition shadow-sm cursor-pointer"
                  >
                    {pacedBreathCycle >= PACED_BREATH_TARGET_CYCLES ? 'Breathe Again' : 'Start Paced Breathing'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[11px] text-cyan-800 font-bold">Cycle {pacedBreathCycle + 1} of {PACED_BREATH_TARGET_CYCLES}</span>
                  <button
                    type="button"
                    onClick={stopPacedBreathing}
                    className="block mx-auto text-[9.5px] text-cyan-700 hover:underline font-extrabold font-mono"
                  >
                    Stop
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'intense' && (
          <motion.div 
            key="intense"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800">I - Intense Somatic Adrenaline Discharge</h4>
              <p className="text-[10.5px] text-zinc-500 font-bold leading-relaxed">
                When alarmed, your adrenal glands flood your veins with performance fuel. Convert this hyper-arousal into heavy muscle work to safely signal the brain that safety has arrived.
              </p>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex flex-col items-center text-center space-y-4">
              <div className="w-full space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#955a1a] block">
                  Interactive Adrenaline Release Valve
                </span>
                <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden relative border border-slate-300">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-150"
                    style={{ width: `${dischargeProgress}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800">
                    {dischargeProgress === 100 ? "Adrenaline Fully Resolved!" : `${dischargeProgress}% Expelled`}
                  </span>
                </div>
              </div>

              {!adrenalineReleased ? (
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-500 font-medium max-w-sm leading-relaxed">
                    Option 1: Perform 20 fast squats or push-ups. <br />
                    Option 2: Stand against a wall, push it with 100% force, and <strong>rapidly tap</strong> the button below to discharge motor cortex anxiety signal paths.
                  </p>

                  <button
                    type="button"
                    onClick={handleTapDischarge}
                    className="py-3 px-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-105 active:scale-95 text-white rounded-xl text-xs font-black transition shadow-sm cursor-pointer select-none"
                  >
                    ⚡ Somatic Wall Push Release ⚡
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={resetDischarge}
                  className="text-[9.5px] text-amber-800 hover:underline font-extrabold font-mono"
                >
                  Clear and recharge sensor valve
                </button>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'paired' && (
          <motion.div 
            key="paired"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800">P - Paired Progressive Muscle Relaxation</h4>
              <p className="text-[10.5px] text-zinc-500 font-semibold leading-relaxed">
                Fists, jaw, and shoulders hold onto latent emergency readiness. Consciously squeeze each zone for 5 seconds, then abruptly loosen to let blood flow and neural calmness return.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { key: 'jaw', title: '1. Tight Jaw, Brow, and Lips', instruction: 'Clench your teeth together tightly, squeeze your eyes locked closed, and purse your mouth. Hold... then relax completely.' },
                { key: 'shoulders', title: '2. Shoulders & Trapezius', instruction: 'Shrug your shoulders up high towards your earlobes as if trying to squeeze them. Hold... then let gravity drop them.' },
                { key: 'fists', title: '3. Fists & Upper Biceps', instruction: 'Clench both hands into powerful fists, bending your elbows to tense your biceps. Hold... then spread your fingers wide.' },
                { key: 'stomach', title: '4. Stomach Core Muscle Shield', instruction: 'Draw your abdominal stomach tight as if bracing for a sudden impact. Hold... then breathe wide into your core.' }
              ].map((m) => {
                const isSel = muscleStates[m.key];
                return (
                  <div 
                    key={m.key}
                    onClick={() => toggleMuscle(m.key)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSel 
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' 
                        : 'bg-slate-50 border-gray-200.5 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-4.5 h-4.5 mt-0.5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                      isSel ? 'bg-emerald-600 border-transparent text-white' : 'bg-white border-zinc-300'
                    }`}>
                      {isSel && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <h5 className={`text-[11.5px] font-black ${isSel ? 'text-emerald-900' : 'text-slate-800'}`}>{m.title}</h5>
                      <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">{m.instruction}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'grounding' && (
          <motion.div 
            key="grounding"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4"
          >
            {/* Header Info with Voice Guidances Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-gray-100">
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-600 animate-spin" style={{ animationDuration: '10s' }} />
                  <span>5-4-3-2-1 Sensory Grounding Technique</span>
                </h4>
                <p className="text-[10.5px] text-zinc-500 font-semibold leading-relaxed">
                  Anchor hyper-aroused states by systematically routing neural focus through external physical senses.
                </p>
              </div>

              {/* Voice Guidance Toggle */}
              <button
                type="button"
                onClick={() => {
                  const nextState = !speechEnabled;
                  setSpeechEnabled(nextState);
                  if (nextState) {
                    speakText("Voice guidance enabled.");
                  } else {
                    if (typeof window !== 'undefined' && window.speechSynthesis) {
                      window.speechSynthesis.cancel();
                    }
                  }
                }}
                className={`py-1.5 px-3 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition border outline-none ${
                  speechEnabled
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100/60'
                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200/60'
                }`}
                title={speechEnabled ? "Mute interactive TTS" : "Enable spoken sensory directives"}
              >
                {speechEnabled ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{speechEnabled ? 'VOICE: GUIDING' : 'VOICE: MUTED'}</span>
              </button>
            </div>

            {/* Step Content */}
            {groundingStep > 0 ? (
              <div className="space-y-4">
                {/* Horizontal Step Progress Bar */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[5, 4, 3, 2, 1].map((step) => {
                    const isActive = groundingStep === step;
                    const isCompleted = groundingStep < step;
                    return (
                      <div key={step} className="flex flex-col items-center space-y-1">
                        <div 
                          className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                            isActive 
                              ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]' 
                              : isCompleted 
                                ? 'bg-emerald-500' 
                                : 'bg-slate-100'
                          }`}
                        />
                        <span className={`text-[9px] font-extrabold tracking-wider uppercase ${
                          isActive
                            ? 'text-indigo-600'
                            : isCompleted
                              ? 'text-emerald-600'
                              : 'text-slate-400'
                        }`}>
                          {step} {step === 5 ? 'See' : step === 4 ? 'Touch' : step === 3 ? 'Hear' : step === 2 ? 'Smell' : 'Taste'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Main Guided Card */}
                {(() => {
                  const currentSetup = SENSORY_GUIDES[groundingStep];
                  if (!currentSetup) return null;
                  return (
                    <motion.div 
                      key={groundingStep}
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-2xl border transition ${currentSetup.bgClass} space-y-3`}
                    >
                      {/* Title with corresponding icon */}
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl border ${currentSetup.accentClass} shrink-0`}>
                          {currentSetup.icon}
                        </div>
                        <div className="space-y-0.5">
                          <h5 className={`text-xs font-black uppercase tracking-wider ${currentSetup.textAccentClass}`}>
                            STEP {groundingStep}: {currentSetup.title}
                          </h5>
                          <p className="text-[10px] text-slate-500 font-bold leading-normal">
                            {currentSetup.description}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Touch/Click Items */}
                      <div className="space-y-2 pt-1">
                        {new Array(groundingStep).fill(null).map((_, index) => {
                          const isClicked = groundingItemsClicked[index] || false;
                          const placeholder = currentSetup.examples[index % currentSetup.examples.length];
                          
                          return (
                            <div 
                              key={index} 
                              className={`p-2 rounded-xl border flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 transition-all ${
                                isClicked 
                                  ? 'bg-white border-emerald-400 shadow-xs' 
                                  : 'bg-white/70 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {/* The Interactive Acknowledge Trigger Button */}
                              <button
                                type="button"
                                onClick={() => handleToggleGroundingItem(index)}
                                className={`py-1.5 px-3 rounded-lg text-[10px] font-black transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 select-none border outline-none ${
                                  isClicked
                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-transparent'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-black border-slate-200'
                                }`}
                              >
                                {isClicked ? (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                ) : (
                                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[8px] font-black">
                                    {index + 1}
                                  </span>
                                )}
                                <span>{isClicked ? "CONFIRMED" : "TAP TO ANCHOR"}</span>
                              </button>

                              {/* Custom written feedback inputs standardizes touch-mind context */}
                              <div className="flex-1 flex gap-2 items-center">
                                <span className="text-[10px] text-slate-400 font-extrabold italic select-none hidden xs:inline uppercase tracking-widest pl-1">
                                  {primaryVerbForStep(groundingStep)}:
                                </span>
                                <input
                                  type="text"
                                  value={customGroundingInputs[index] || ''}
                                  onChange={(e) => {
                                    const nextInputs = [...customGroundingInputs];
                                    nextInputs[index] = e.target.value;
                                    setCustomGroundingInputs(nextInputs);
                                  }}
                                  placeholder={`Optional: Name what you ${primaryVerbForStep(groundingStep)} (e.g., "${placeholder}")`}
                                  className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-[11px] font-bold text-slate-800 placeholder-slate-400 border border-slate-200 rounded-lg py-1 px-2.5 outline-none focus:border-indigo-500/50 transition duration-200"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                          {groundingItemsClicked.filter(Boolean).length} of {groundingStep} Confirmed
                        </span>

                        <button
                          type="button"
                          onClick={handleNextGroundingStep}
                          disabled={!allCurrentItemsClicked}
                          className={`py-2 px-5 rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-1 select-none cursor-pointer outline-none ${
                            allCurrentItemsClicked
                              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:brightness-110 active:scale-97 text-white'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-65'
                          }`}
                        >
                          <span>{groundingStep === 1 ? "Complete Sensory Anchor" : `Connect to Step ${groundingStep - 1}`}</span>
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Reset helper */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setGroundingStep(5);
                      speakText("Grounding protocol reset back to visual step five.");
                    }}
                    className="text-[9.5px] text-indigo-600 hover:underline font-extrabold tracking-wider uppercase font-mono cursor-pointer"
                  >
                    Reset & start over from See (5)
                  </button>
                </div>
              </div>
            ) : (
              /* Grounding Succesfully Integrated Card */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl flex flex-col items-center text-center space-y-4 bg-white"
                style={{ boxShadow: '0 8px 28px rgba(99,102,241,0.16)', border: '2px solid #6366F133' }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center animate-bounce" style={{ background: '#6366F118', color: '#4338CA' }}>
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>

                <div className="space-y-1.5 max-w-sm">
                  <span
                    className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full inline-block font-mono"
                    style={{ background: '#6366F118', color: '#4338CA' }}
                  >
                    ✨ Soma & Amygdala Grounded ✨
                  </span>
                  <h5 className="text-base font-black" style={{ color: '#3C3C3C' }}>Sensory Loop Completed!</h5>
                  <p className="text-[11px] leading-relaxed font-semibold" style={{ color: '#6B7280' }}>
                    Wonderful. By systematically moving awareness outward from sight to touch, sound, smell, and taste, you verified actual current security context to soothe hyper-arousal.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setGroundingStep(5);
                      speakText("Let's practice grounding again. Focus your vision on five objects around you.");
                    }}
                    className="flex-1 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition cursor-pointer border"
                    style={{ background: '#F9FAFB', borderColor: '#E5E7EB', color: '#3C3C3C' }}
                  >
                    Practice Again
                  </button>
                  <motion.button
                    whileTap={{ y: 3, boxShadow: 'none' }}
                    type="button"
                    onClick={() => setActiveTab('stop')}
                    className="flex-1 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition cursor-pointer text-white"
                    style={{ background: 'linear-gradient(135deg, #14B8A6, #58CC02)', boxShadow: '0 4px 0 #0D9488' }}
                  >
                    Back to SOS Home
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'chain' && (
          <motion.div 
            key="chain"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="space-y-6"
          >
            {/* Explainer Block */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 text-[9px] font-black uppercase tracking-wider font-mono">
                      DBT Behavioral Skill
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider font-mono">
                      Reflections
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-violet-600" />
                    <span>Behavioral Chain Analysis Workshop</span>
                  </h4>
                  <p className="text-xs text-zinc-500 font-semibold leading-relaxed max-w-2xl">
                    Every problematic habit or reaction is the final result of a sequential chain of events. By breaking this chain down into its molecular parts (Vulnerability &rarr; Prompt/Trigger &rarr; Thoughts &rarr; Feelings &rarr; Sensations &rarr; Urges), you discover precise intervention thresholds where custom coping skills will disrupt future automatic escalation.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setChainProblemBehavior('Yelled or reacted impulsively under social stress');
                      setChainVulnerability('High cognitive fatigue, skipped lunch, insufficient deep sleep');
                      setChainTriggerEvent('Received an unexpected critical feedback or message notification');
                      setChainShortConsequence('Immediate distraction and release of tension');
                      setChainLongConsequence('Regret, hours of uncomfortable rumination, relational depletion');
                      setChainLinks([
                        { id: '1', type: 'thought', value: 'They do not appreciate any of my hard efforts here.' },
                        { id: '2', type: 'emotion', value: 'Shame, defensive rage, catastrophic rejection anxiety' },
                        { id: '3', type: 'sensation', value: 'Fast heartbeat, temperature flushing, stomach knotting' },
                        { id: '4', type: 'urge', value: 'Immediate urge to draft an angry, defensive email reply' }
                      ]);
                      setChainAlternativeSkills({
                        '1': 'STOP Skill: Step back and identify biased cognitive framing.',
                        '3': 'TIPP: Lower biological rate with deep diaphragmatic breathing cycles.'
                      });
                    }}
                    className="px-3 py-1.5 bg-slate-100 font-bold hover:bg-slate-200 text-[10.5px] rounded-xl text-slate-600 cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset to Sample</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Core Interactive Builder Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Input Panel (7 Cols) */}
              <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 space-y-5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">
                  1. Deconstruct the Behavioral Path
                </span>

                {/* Step 1: Vulnerability Factors */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[11.5px] font-extrabold text-slate-700 block">
                    🔋 Stage A: Vulnerability Factors (What made you sensitive?)
                  </label>
                  <textarea
                    rows={2}
                    value={chainVulnerability}
                    onChange={(e) => setChainVulnerability(e.target.value)}
                    placeholder="e.g., Exhausted, skipped breakfast, fought with partner earlier, high caffeine."
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:outline-none rounded-xl"
                  />
                </div>

                {/* Step 2: Triggering Event */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[11.5px] font-extrabold text-slate-700 block">
                    ⚡ Stage B: Triggering Event (The match that sparked the fire)
                  </label>
                  <input
                    type="text"
                    value={chainTriggerEvent}
                    onChange={(e) => setChainTriggerEvent(e.target.value)}
                    placeholder="e.g., Partner mentioned chores, saw a specific text message, felt neglected."
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:outline-none rounded-xl"
                  />
                </div>

                {/* Step 3: Progressive Mind Chain Links */}
                <div className="space-y-3 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[11.5px] font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Link2 className="w-4 h-4 text-violet-500" />
                      <span>Stage C: Sequential Chain Links (Escalating Phases)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newId = String(Date.now());
                        setChainLinks(prev => [
                          ...prev,
                          { id: newId, type: 'thought', value: '' }
                        ]);
                      }}
                      className="px-2.5 py-1 bg-violet-50 text-violet-700 font-bold text-[10.5px] hover:bg-violet-100 rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Chain Link</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-zinc-400 font-semibold leading-normal">
                    List each internal reaction as it unfolded. Modify the category box and text below to reflect your real somatic escalation.
                  </p>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {chainLinks.map((link, index) => (
                      <div key={link.id} className="p-3 bg-violet-50/20 border border-violet-100 rounded-2xl flex items-start gap-2">
                        {/* Drag/Order Indicator Badge */}
                        <span className="w-5 h-5 bg-violet-100 text-violet-800 font-black text-[9.5px] rounded-lg flex items-center justify-center shrink-0 mt-2 font-mono">
                          {index + 1}
                        </span>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2">
                          {/* Type Select */}
                          <select
                            value={link.type}
                            onChange={(e) => {
                              const updated = [...chainLinks];
                              updated[index].type = e.target.value as any;
                              setChainLinks(updated);
                            }}
                            className="text-xs font-black p-1.5 rounded-lg border border-slate-200 bg-white sm:col-span-3 text-slate-700 focus:outline-none"
                          >
                            <option value="thought">🧠 Thought</option>
                            <option value="emotion">🎭 Emotion</option>
                            <option value="sensation">💓 Sensation</option>
                            <option value="urge">⚡ Urge</option>
                            <option value="action">🎯 Action</option>
                          </select>

                          {/* Link Value */}
                          <input
                            type="text"
                            value={link.value}
                            onChange={(e) => {
                              const updated = [...chainLinks];
                              updated[index].value = e.target.value;
                              setChainLinks(updated);
                            }}
                            placeholder="Describe this mental occurrence..."
                            className="text-xs font-semibold p-1.5 rounded-lg border border-slate-200 sm:col-span-9 bg-white focus:outline-none focus:border-violet-400"
                          />
                        </div>

                        {/* Trash button */}
                        <button
                          type="button"
                          disabled={chainLinks.length <= 1}
                          onClick={() => {
                            setChainLinks(prev => prev.filter(l => l.id !== link.id));
                            // also scrub breakpoints config
                            setChainAlternativeSkills(prev => {
                              const copy = { ...prev };
                              delete copy[link.id];
                              return copy;
                            });
                          }}
                          className="w-10 h-10 flex items-center justify-center shrink-0 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition disabled:opacity-40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 4: Problem Behavior Screen */}
                <div className="space-y-1.5 text-left pt-2 border-t border-slate-200">
                  <label className="text-[11.5px] font-extrabold text-slate-700 block text-rose-800">
                    🎯 Stage D: Target Problematic Behavior (The reaction we want to break)
                  </label>
                  <input
                    type="text"
                    value={chainProblemBehavior}
                    onChange={(e) => setChainProblemBehavior(e.target.value)}
                    placeholder="e.g., Drank excessive alcohol, yelled impulsively, isolation bingeing."
                    className="w-full text-xs font-bold p-2.5 bg-rose-50/5 border border-rose-200 text-rose-900 focus:outline-none focus:border-rose-400 rounded-xl"
                  />
                </div>

                {/* Step 5: Consequences */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-700 block">⚡ Short-term Consequences (Temporary relief)</span>
                    <input
                      type="text"
                      value={chainShortConsequence}
                      onChange={(e) => setChainShortConsequence(e.target.value)}
                      placeholder="e.g., Shunted emotional discomfort for 20 minutes."
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-400 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 block">🍂 Long-term Consequences (Net negative price)</span>
                    <input
                      type="text"
                      value={chainLongConsequence}
                      onChange={(e) => setChainLongConsequence(e.target.value)}
                      placeholder="e.g., Extreme shame, guilt cycles, broken trust."
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-400 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Chain Diagnostic & Breakpoint Skills (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Visual Mapping Panel */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                      2. Interactive Chain Map & Breakpoints
                    </span>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  </div>

                  <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
                    Write down a specific DBT/CBT intervention skill to disrupt each link of the chain below. This trains cognitive cognitive-behavioral agility.
                  </p>

                  {/* Flow Map Visualisation */}
                  <div className="space-y-3 pt-2 relative">
                    
                    {/* Vulnerability Node */}
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-3xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-extrabold uppercase font-mono">
                          Vulnerability context
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400">Step A</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-700 italic">
                        "{chainVulnerability || 'Unspecified vulnerability...'}"
                      </p>
                      
                      {/* Counter-Skill */}
                      <div className="pt-1.5 border-t border-slate-100/60 mt-1">
                        <input
                          type="text"
                          value={chainAlternativeSkills['vulnerability'] || ''}
                          onChange={(e) => {
                            setChainAlternativeSkills(prev => ({
                              ...prev,
                              'vulnerability': e.target.value
                            }));
                          }}
                          placeholder="🛡️ What buffer skill helps? (e.g. PLEASE, physical nap)"
                          className="w-full text-[10.5px] font-bold text-emerald-800 bg-emerald-50/20 p-1.5 border border-emerald-200/50 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Connecting line */}
                    <div className="flex justify-center -my-2.5">
                      <div className="w-1.5 h-6 bg-slate-200" />
                    </div>

                    {/* Trigger Event Node */}
                    <div className="p-3 bg-white border border-indigo-100/80 rounded-2xl space-y-1 shadow-3xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold uppercase font-mono">
                          Triggering Event
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400">Step B</span>
                      </div>
                      <p className="text-[11px] font-bold text-indigo-900 italic">
                        "{chainTriggerEvent || 'No Trigger reported...'}"
                      </p>
                    </div>

                    {/* Connecting line */}
                    <div className="flex justify-center -my-2.5">
                      <div className="w-1.5 h-6 bg-slate-200" />
                    </div>

                    {/* Dynamic Links list with intervention inputs */}
                    {chainLinks.map((link, idx) => {
                      const typeColors: { [key: string]: string } = {
                        thought: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                        emotion: 'bg-rose-100 text-rose-800 border-rose-200',
                        sensation: 'bg-amber-100 text-amber-800 border-amber-200',
                        urge: 'bg-violet-100 text-violet-800 border-violet-200',
                        action: 'bg-sky-100 text-sky-800 border-sky-200'
                      };

                      return (
                        <div key={link.id} className="space-y-1">
                          <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-3xs">
                            <div className="flex items-center justify-between">
                              <span className={`text-[8.5px] px-1.5 py-0.5 rounded-full font-black border uppercase font-mono ${typeColors[link.type] || 'bg-slate-100'}`}>
                                Link {idx + 1}: {link.type}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono font-bold">Step C.{idx+1}</span>
                            </div>
                            <p className="text-[11px] font-semibold text-slate-800">
                              "{link.value || '(Incomplete text...)'}"
                            </p>

                            {/* Alternative skill override input specifically for this link */}
                            <div className="pt-2 border-t border-slate-100">
                              <input
                                type="text"
                                value={chainAlternativeSkills[link.id] || ''}
                                onChange={(e) => {
                                  setChainAlternativeSkills(prev => ({
                                    ...prev,
                                    [link.id]: e.target.value
                                  }));
                                }}
                                placeholder="🪄 What skill breaks this step? (e.g. STOP, Reframing)"
                                className="w-full text-[10.5px] font-bold text-violet-800 bg-violet-50/20 p-1.5 border border-violet-200/50 rounded-lg focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Connection down lines */}
                          <div className="flex justify-center -my-2">
                            <div className="w-1.5 h-5 bg-slate-200" />
                          </div>
                        </div>
                      );
                    })}

                    {/* Problem Behavior Node */}
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 shadow-3xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold uppercase font-mono">
                          Target behavior
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400">Step D</span>
                      </div>
                      <p className="text-[11px] font-black text-rose-900">
                        "{chainProblemBehavior || 'Undefined reaction...'}"
                      </p>
                    </div>
                  </div>

                  {/* Submission and Save Action Arena */}
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Assemble the full analysis
                        const finalObject = {
                          id: `chain-${Date.now()}`,
                          date: new Date().toLocaleDateString(),
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          problemBehavior: chainProblemBehavior,
                          vulnerability: chainVulnerability,
                          triggerEvent: chainTriggerEvent,
                          shortConsequence: chainShortConsequence,
                          longConsequence: chainLongConsequence,
                          links: chainLinks,
                          alternativeSkills: chainAlternativeSkills
                        };

                        const nextHistory = [finalObject, ...savedChains];
                        try {
                          localStorage.setItem('therapy_dbt_chain_analyses', JSON.stringify(nextHistory));
                          setSavedChains(nextHistory);
                          
                          // Trigger clean platform log
                          logSkillUsage("DBT Behavior Chain Analysis");

                          onTriggerInteractionAlert(
                            "⛓️ Behavior Chain Analysis Saved!",
                            `Your behavioral map has been recorded to browser memory. Consistently mapping triggers trains frontal cortex networks to override automatic stress reactions!`
                          );
                        } catch (e) {
                          console.error("Local storage save failed:", e);
                        }
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-700 hover:brightness-110 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>Log Chain Analysis Audit</span>
                    </button>
                  </div>
                </div>

                {/* historical completed audits list */}
                {savedChains.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3.5">
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block font-mono">
                      Logged Chain Audits ({savedChains.length})
                    </span>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {savedChains.map((hist) => (
                        <div key={hist.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-left relative group">
                          {/* Top row */}
                          <div className="flex items-center justify-between text-[9px] text-zinc-400 font-bold">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{hist.date} &middot; {hist.time}</span>
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => {
                                const next = savedChains.filter(c => c.id !== hist.id);
                                localStorage.setItem('therapy_dbt_chain_analyses', JSON.stringify(next));
                                setSavedChains(next);
                              }}
                              className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5 rounded-lg hover:bg-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <h5 className="text-[11px] font-black text-rose-900">
                              Reaction: {hist.problemBehavior}
                            </h5>
                            <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                              <strong>Trigger:</strong> {hist.triggerEvent}
                            </p>
                            <p className="text-[10px] text-zinc-500 leading-normal">
                              <strong>Vulnerability:</strong> {hist.vulnerability}
                            </p>
                          </div>

                          {/* Collapsable or miniature links visual preview to save space */}
                          <div className="pt-2 border-t border-slate-200/55 text-[9.5px] text-violet-900 font-bold space-y-1">
                            <span>🔗 Structured Escapes & Solutions Map:</span>
                            <div className="flex flex-wrap gap-1">
                              {hist.links?.map((lnk: any, i: number) => {
                                const hasSkill = hist.alternativeSkills?.[lnk.id];
                                return (
                                  <span 
                                    key={i} 
                                    className={`px-1.5 py-0.5 rounded font-mono uppercase text-[8px] flex items-center gap-0.5 ${
                                      hasSkill ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                                    }`}
                                    title={hasSkill ? `Alternative Skill: ${hasSkill}` : "No counter-skill assigned"}
                                  >
                                    {lnk.type[0].toUpperCase()}
                                    {hasSkill && <Check className="w-2.5 h-2.5 text-emerald-700 inline" />}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 5-4-3-2-1 Sensory Grounding Auxiliary Layout Configurations & Helper Constants
const ENCOURAGING_WHISPERS = [
  "Grounding contact verified.",
  "Breathe gently, draw yourself here.",
  "Perfect somatic anchor points.",
  "Stay fully present inside your body.",
  "Acknowledge and release.",
  "Return to your immediate surroundings.",
  "Somatic awareness solidifying.",
  "You are safe in this physical moment."
];

const primaryVerbForStep = (step: number): string => {
  switch (step) {
    case 5: return 'see';
    case 4: return 'touch';
    case 3: return 'hear';
    case 2: return 'smell';
    case 1: return 'taste';
    default: return 'notice';
  }
};

const SENSORY_GUIDES: { [key: number]: {
  title: string;
  description: string;
  verb: string;
  icon: React.ReactNode;
  examples: string[];
  bgClass: string;
  accentClass: string;
  textAccentClass: string;
}} = {
  5: {
    title: '5 things you can SEE',
    description: 'Slowly scan your room or physical environment. Find 5 distinct items, notice their depth of color, shadow lines, or sharp edges.',
    verb: 'Visualise and lock focus on item',
    icon: <Eye className="w-5 h-5 text-indigo-600" />,
    examples: ['A picture frame', 'A shadow pattern', 'A plant leaf', 'A water bottle', 'Light reflecting off glass'],
    bgClass: 'bg-indigo-50/50 border-indigo-100',
    accentClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    textAccentClass: 'text-indigo-800'
  },
  4: {
    title: '4 things you can TOUCH',
    description: 'Interact with physical boundaries. Touch different textures nearby and notice their coldness, roughness, hardness, or warmth.',
    verb: 'Gently touch or feel texture',
    icon: <Fingerprint className="w-5 h-5 text-sky-600" />,
    examples: ['Your clothing fabric', 'The solid wooden desk', 'The plastic key cap', 'Weight of feet against the floor'],
    bgClass: 'bg-sky-50/50 border-sky-100',
    accentClass: 'bg-sky-100 text-sky-700 border-sky-200',
    textAccentClass: 'text-sky-800'
  },
  3: {
    title: '3 things you can HEAR',
    description: 'Tune into your acoustic environment. Listen under the ambient noise for fine details of sound coming from inside or outside.',
    verb: 'Listen closely and identify sound',
    icon: <Volume2 className="w-5 h-5 text-emerald-600" />,
    examples: ['Hum of ventilation fan', 'Distant street wind rustling', 'Chirp of a morning bird', 'Your own respiration tempo'],
    bgClass: 'bg-emerald-50/50 border-emerald-100',
    accentClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    textAccentClass: 'text-emerald-800'
  },
  2: {
    title: '2 things you can SMELL',
    description: 'Breathe wide into your olfactory cortex. Scent is a super-highway to sensory-mind presence. Move or pick up an item if needed.',
    verb: 'Inhale scent & notice nuance',
    icon: <Compass className="w-5 h-5 text-amber-600" />,
    examples: ['Ambient fresh air', 'Hand soap or moisturizer', 'Scent of paper pages', 'Ambient coffee notes'],
    bgClass: 'bg-amber-50/50 border-amber-100',
    accentClass: 'bg-amber-100 text-amber-700 border-amber-200',
    textAccentClass: 'text-amber-800'
  },
  1: {
    title: '1 thing you can TASTE',
    description: 'Center your internal bio feedback. Notice any current flavor or moisture check inside your palate. Run your tongue softly.',
    verb: 'Savor taste or take a glass sip',
    icon: <Smile className="w-5 h-5 text-rose-600" />,
    examples: ['Minty morning toothpaste', 'Lingering coffee notes', 'A refreshing clean sip of water', 'Slight saltiness on palate'],
    bgClass: 'bg-rose-50/50 border-rose-100',
    accentClass: 'bg-rose-100 text-rose-700 border-rose-200',
    textAccentClass: 'text-rose-800'
  }
};
