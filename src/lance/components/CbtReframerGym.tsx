import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Check, HelpCircle, AlertTriangle, ArrowRight, Brain, RotateCcw, 
  Award, Lightbulb, Heart, ShieldAlert, Plus, BookOpen, Trash2, Loader2, ArrowLeft, Mic, MicOff
} from 'lucide-react';

interface DistortionDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  example: string;
  reframedExample: string;
}

const DISTORTION_LIBRARY: DistortionDefinition[] = [
  {
    id: 'dist-1',
    name: 'All-or-Nothing Thinking',
    emoji: '🖤',
    description: 'Viewing things in black-and-white categories. If a situation falls short of perfect, you see it as a total failure.',
    example: '"Because I missed one meditation session, my entire calm routine is completely ruined and useless."',
    reframedExample: '"I missed one session, but that is just a temporary break. I can restart with my next meal or breath, building off my existing efforts."'
  },
  {
    id: 'dist-2',
    name: 'Catastrophizing',
    emoji: '☄️',
    description: 'Exaggerating the importance of minor glitches or automatically anticipating the worst possible absolute disaster.',
    example: '"My email had a minor typo; I am definitely going to get fired and lose my entire savings."',
    reframedExample: '"Typos happen to everyone. I am valued here, and I can send a quick, polite correction email without panic."'
  },
  {
    id: 'dist-3',
    name: 'Mind Reading',
    emoji: '🔮',
    description: 'Arbitrarily concluding that someone is reacting negatively to you, without checking it out or having factual proof.',
    example: '"They looked away for a split second when I spoke; they must think I am incredibly boring and stupid."',
    reframedExample: '"They looked away momentarily — they might be tired, distracted, or thinking about their own day. I shouldn\'t guess."'
  },
  {
    id: 'dist-4',
    name: 'Emotional Reasoning',
    emoji: '🌡️',
    description: 'Assuming that your negative emotions reflect how things really are: "I feel it, therefore it must be true."',
    example: '"I feel extremely nervous right now, which means I am in real life-threatening danger and shouldn\'t speak at all."',
    reframedExample: '"I feel nervous because I care. This physical adrenaline surge is just energy; I am completely secure."'
  },
  {
    id: 'dist-5',
    name: 'Should Statements',
    emoji: '⚖️',
    description: 'Trying to motivate yourself with "shoulds" and "shouldn\'ts", leading to severe guilt, frustration, and resentment.',
    example: '"I should be completely happy and positive every single day without any anxious moments."',
    reframedExample: '"It is completely fine to have complex emotions. I accept myself fully as a human being growing at my own natural pace."'
  },
  {
    id: 'dist-6',
    name: 'Overgeneralization',
    emoji: '🕸️',
    description: 'Viewing a single negative event as part of an inevitable, never-ending pattern of defeat and failure.',
    example: '"My application was rejected. I am never going to find a fulfilling role, nothing ever works out."',
    reframedExample: '"This particular application was not the right fit, but it is just one event. With persistence, other opportunities will open up."'
  },
  {
    id: 'dist-7',
    name: 'Personalization',
    emoji: '📌',
    description: 'Holding yourself personally responsible for events completely outside of your direct control or influence.',
    example: '"My friend is very quiet and looks upset today. It must be because I said something wrong or made them angry."',
    reframedExample: '"My friend might be dealing with their own stress or fatigue on their end today. I will check in on them with kindness instead of self-blame."'
  },
  {
    id: 'dist-8',
    name: 'Reactive Absorption (Thermometer)',
    emoji: '🌡️',
    description: 'Unconsciously absorbing the heated emotional climate, mood swings, or chaos of your surroundings and other people.',
    example: '"My team leader came into the meeting room completely furious and stressed out today; therefore, I am forced to spend the rest of my day in high somatic panic and feel completely miserable."',
    reframedExample: '"My leader\'s stress represents their current climate. My internal thermostat is set to calm and steady. I will engage deep slow breathing to remain insulated while protecting my boundaries."'
  }
];

interface PracticeThought {
  id: string;
  rawThought: string;
  correctDistortionId: string;
  hint: string;
  clincialFeedback: string;
  customDraftReframe?: string;
}

const SAMPLE_CHALLENGES: PracticeThought[] = [
  {
    id: 'chall-1',
    rawThought: "They looked at their phone for three seconds while I was explaining my proposal. They must absolutely detest working with me.",
    correctDistortionId: 'dist-3', // Mind Reading
    hint: "You are guessing their internal feelings and motivation based on a very brief physical action.",
    clincialFeedback: "Spot on! That is 'Mind Reading'. In truth, we cannot read minds. Assuming bad thoughts from others leads directly to isolation behavior."
  },
  {
    id: 'chall-2',
    rawThought: "If I cannot do this workout perfectly for 45 minutes, there is zero benefit in moving or exercising at all.",
    correctDistortionId: 'dist-1', // All-or-Nothing
    hint: "This thought splits reality into either 100% success or 0% failure, with no middle terrain.",
    clincialFeedback: "Excellent catch! In behavioral physics, 5 minutes of moving is vastly superior to zero. Black-and-white categories make progress unnecessarily difficult."
  },
  {
    id: 'chall-3',
    rawThought: "I feel this intense pocket of dread in my stomach right now, so that proves this upcoming interview is definitely going to turn into a nightmare.",
    correctDistortionId: 'dist-4', // Emotional Reasoning
    hint: "You are treating a physical emotion or somatic dread as a definitive prediction of physical fact.",
    clincialFeedback: "Yes! That is 'Emotional Reasoning'. Dread is a biological reaction to stress, not a time-traveling crystal ball showing future failures."
  },
  {
    id: 'chall-4',
    rawThought: "My coworker came into the meeting room screaming and complaining about everything. It immediately infected my day, and now I feel incredibly nervous and defensive for the rest of my tasks.",
    correctDistortionId: 'dist-8', // Reactive Absorption
    hint: "You are acting like a thermometer—unconsciously absorbing and reflecting their external heat rather than regulating your own safe autonomic boundaries.",
    clincialFeedback: "Stellar! You spotted 'Reactive Absorption (Thermometer Mode)'. Instead of raising your internal climate to reflect their external panic, you can activate your inner 'Thermostat' to keep a steady, cool comfort level."
  }
];

interface CustomReframeEntry {
  id: string;
  rawThought: string;
  selectedDistortion: string;
  reframedThought: string;
  date: string;
}

interface CbtReframerGymProps {
  onTriggerInteractionAlert: (title: string, body: string, action?: { label: string; onClick: () => void }) => void;
}

export default function CbtReframerGym({ onTriggerInteractionAlert }: CbtReframerGymProps) {
  // Navigation State inside CBT Gym
  const [activeTab, setActiveTab] = useState<'guided' | 'challenge' | 'library'>('guided');

  // GUIDED AI REFRAMER STATE
  const [guidedStep, setGuidedStep] = useState<1 | 2 | 3>(1);
  const [guidedRawThought, setGuidedRawThought] = useState('');
  const [guidedSelectedDistortionId, setGuidedSelectedDistortionId] = useState('dist-1');
  const [guidedReframedThought, setGuidedReframedThought] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    identifiedDistortion: string;
    reframedThought: string;
    suggestion: string;
  } | null>(null);

  // Practice Gym State (Mini Game)
  const [currentChallIdx, setCurrentChallIdx] = useState(0);
  const [selectedGuessId, setSelectedGuessId] = useState<string | null>(null);
  const [isGuessCorrect, setIsGuessCorrect] = useState<boolean | null>(null);
  const [hasRevealedHint, setHasRevealedHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [draftedPracticeReframe, setDraftedPracticeReframe] = useState('');
  const [completedPracticeReframes, setCompletedPracticeReframes] = useState<string[]>([]);

  // Ledger state
  const [mySavedReframes, setMySavedReframes] = useState<CustomReframeEntry[]>(() => {
    const saved = localStorage.getItem('therapy_cbt_saved_reframes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: 'user-ref-1',
        rawThought: "If I can't be at the top of the leaderboards, I am a failure.",
        selectedDistortion: "All-or-Nothing Thinking",
        reframedThought: "Doing my own best and enjoying the process is beautiful. I don't need top validation to be worthy.",
        date: "2026-06-11"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('therapy_cbt_saved_reframes', JSON.stringify(mySavedReframes));
  }, [mySavedReframes]);

  // Speech Recognition states
  const [activeSpeechField, setActiveSpeechField] = useState<string | null>(null);
  const recognitionRef = React.useRef<any>(null);
  const speechSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startSpeechRecognition = (field: string, setFieldVal: React.Dispatch<React.SetStateAction<string>>) => {
    if (!speechSupported) return;
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      const SpeechLib = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechLib();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setActiveSpeechField(field);
      };
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setFieldVal((prev) => (prev ? prev + ' ' + transcript : transcript));
        }
      };
      recognition.onerror = () => {
        setActiveSpeechField(null);
      };
      recognition.onend = () => {
        setActiveSpeechField(null);
      };
      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setActiveSpeechField(null);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setActiveSpeechField(null);
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // GUIDED AI REFRAMER HANDLERS
  const handleNextGuidedStep = () => {
    if (guidedStep === 1) {
      if (!guidedRawThought.trim()) {
        onTriggerInteractionAlert("⚠️ Thought Required", "Please express what distressing thought is currently repeating in your mind.");
        return;
      }
      setGuidedStep(2);
    }
  };

  const handleFetchAiReframe = async () => {
    if (!guidedRawThought.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/therapy/cbt-reframe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: guidedRawThought.trim() })
      });

      const data = await res.json();
      if (data && data.success) {
        setAiResponse({
          identifiedDistortion: data.identifiedDistortion,
          reframedThought: data.reframedThought,
          suggestion: data.suggestion
        });
        setGuidedReframedThought(data.reframedThought);
        setGuidedStep(3);
      } else {
        throw new Error("Failed to consult therapist endpoint");
      }
    } catch (err) {
      console.warn("AI therapeutic reframing error, loading local cognitive rules engine fallback:", err);
      
      // Clinical Heuristic rules fallback
      const lower = guidedRawThought.toLowerCase();
      let identifiedDistortion = "Emotional Reasoning";
      let reframedThought = "I am processing strong emotional highlights right now, but feelings are temporary bio-chemical signals and do not represent permanent outer physical facts.";
      let suggestion = "Take three slow, full diaphragmatic exhales, anchoring yourself to your physical posture.";

      if (lower.includes("never") || lower.includes("always") || lower.includes("everything") || lower.includes("nothing")) {
        identifiedDistortion = "All-or-Nothing Thinking";
        reframedThought = "Life is rarely purely black-and-white. I am going through a specific, isolated hurdle, but there are still spaces of peace and capability inside me.";
        suggestion = "List two tiny things that went reasonably okay today, like sipping clean water.";
      } else if (lower.includes("fail") || lower.includes("terrible") || lower.includes("useless") || lower.includes("bad")) {
        identifiedDistortion = "Should Statements / Personalization";
        reframedThought = "Making structural mistakes is part of learning. I am a person doing their genuine best, not a single permanent label of failure.";
        suggestion = "Place a comforting hand over your chest, breathe out, and say: 'I accept myself fully as I am.'";
      } else if (lower.includes("worst") || lower.includes("ruined") || lower.includes("destroyed") || lower.includes("catastrophe")) {
        identifiedDistortion = "Catastrophizing";
        reframedThought = "Even if this situation proves quite difficult, I contain resilient skills that I have tested before. I will navigate this one light step at a time.";
        suggestion = "Conduct a 5-second physical stretch to release the somatic adrenaline stored in your neck.";
      }

      setAiResponse({ identifiedDistortion, reframedThought, suggestion });
      setGuidedReframedThought(reframedThought);
      setGuidedStep(3);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveGuidedReframe = () => {
    const raw = guidedRawThought.trim();
    const reframed = guidedReframedThought.trim();

    if (!raw || !reframed) {
      onTriggerInteractionAlert("⚠️ Complete Reframe", "Please make sure your thought and reframe are written before cataloging.");
      return;
    }

    const distortionName = DISTORTION_LIBRARY.find(d => d.id === guidedSelectedDistortionId)?.name || 'Custom Trap';

    const newEntry: CustomReframeEntry = {
      id: `guided-${Date.now()}`,
      rawThought: raw,
      selectedDistortion: distortionName,
      reframedThought: reframed,
      date: new Date().toISOString().split('T')[0]
    };

    setMySavedReframes(prev => [newEntry, ...prev]);

    // Reset state
    setGuidedRawThought('');
    setGuidedReframedThought('');
    setAiResponse(null);
    setGuidedStep(1);

    onTriggerInteractionAlert(
      "🌸 Blueprint Cataloged Successfully", 
      "Beautiful! Your AI-assisted balanced reframe is saved. It has been categorized under your cognitive ledger for periodic mental anchoring."
    );
  };

  // PRACTICE CHALLENGE DECK HANDLERS
  const activeChallenge = SAMPLE_CHALLENGES[currentChallIdx];

  const handleGuess = (distortionId: string) => {
    if (selectedGuessId) return; // already guessed
    setSelectedGuessId(distortionId);
    
    if (distortionId === activeChallenge.correctDistortionId) {
      setIsGuessCorrect(true);
      setShowExplanation(true);
    } else {
      setIsGuessCorrect(false);
    }
  };

  const handleNextChallenge = () => {
    setSelectedGuessId(null);
    setIsGuessCorrect(null);
    setHasRevealedHint(false);
    setShowExplanation(false);
    setDraftedPracticeReframe('');
    setCurrentChallIdx((prev) => (prev + 1) % SAMPLE_CHALLENGES.length);
  };

  const handleSavePracticeReframe = () => {
    if (!draftedPracticeReframe.trim()) {
      onTriggerInteractionAlert("⚠️ Blank Reframe", "Please write a brief balanced alternative thought before finalizing.");
      return;
    }
    setCompletedPracticeReframes(prev => [...prev, activeChallenge.id]);
    onTriggerInteractionAlert("☀️ Reframing Logged", "Beautiful work rewriting that cognitive pathway! Writing balanced thoughts builds durable mental flexibility.");
  };

  const handleDeleteSavedReframe = (id: string) => {
    setMySavedReframes(prev => prev.filter(r => r.id !== id));
  };


  return (
    <div className="space-y-6">
      {/* Educational Header Banner */}
      <div
        className="p-5 rounded-3xl text-left space-y-3"
        style={{ background: '#FFFFFF', boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ background: '#14B8A618' }}>🧠</div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#0D9488' }}>
              CBT Mental Fitness Lounge
            </span>
            <h4 className="text-base font-black leading-tight" style={{ color: '#3C3C3C' }}>Interactive Cognitive Reframing</h4>
          </div>
        </div>
        <p className="text-xs leading-relaxed font-medium" style={{ color: '#6B7280' }}>
          Our thoughts construct our emotional worlds. Use our structured tools to identify automated thinking patterns, expose exaggerations, and harness the server-side <strong style={{ color: '#3C3C3C' }}>AI Cognitive Specialist</strong> to suggest balanced, evidence-based perspectives under pressure.
        </p>
        <p className="text-[11px] leading-relaxed font-semibold rounded-2xl px-3 py-2" style={{ color: '#0D9488', background: '#14B8A614' }}>
          💡 A <strong>cognitive distortion</strong> is just a mental habit — an exaggerated or inaccurate thought pattern your brain runs on autopilot when it's stressed. Spotting one is the first step to talking back to it.
        </p>
      </div>

      {/* Structured Pill Navigation Tabs */}
      <div className="flex gap-1.5 p-1 bg-white border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.02)] rounded-2xl w-full max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('guided')}
          className={`flex-1 py-1.5 text-center rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'guided'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          🔮 AI Reframer
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('challenge')}
          className={`flex-1 py-1.5 text-center rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'challenge'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          🏋️ Practice Gym
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-1.5 text-center rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'library'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          📚 Distortion Book
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: AI GUIDED REFRAMING */}
        {activeTab === 'guided' && (
          <motion.div
            key="tab-guided-pane"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-5 text-left">
              {/* Stepper info */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 px-2.5 bg-teal-50 text-teal-800 text-[9px] font-black rounded-lg uppercase tracking-wide">
                    Step {guidedStep} of 3
                  </span>
                  <span className="text-[10px] text-slate-300 font-bold">|</span>
                  <span className="text-[10.5px] text-slate-600 font-extrabold">
                    {guidedStep === 1 && "Unburden Automatic Voice"}
                    {guidedStep === 2 && "Spot the Trap & Query AI"}
                    {guidedStep === 3 && "AI Reframing Suggestion Review"}
                  </span>
                </div>
                {guidedStep > 1 && (
                  <button
                    onClick={() => setGuidedStep(1)}
                    className="text-[10.5px] text-teal-700 hover:underline font-bold transition flex items-center gap-0.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" /> Start Over
                  </button>
                )}
              </div>

              {/* STEP 1: DISTRESS INPUT */}
              {guidedStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                      <span>1. Distressing Automatic Thought</span>
                    </label>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                      Describe the critical voice or fear currently repeating. CBT models suggest unburdening the raw, unedited automatic assumptions first.
                    </p>
                    <div className="relative">
                      <textarea
                        value={guidedRawThought}
                        onChange={(e) => setGuidedRawThought(e.target.value)}
                        placeholder={activeSpeechField === 'guidedRawThought' ? "Listening... Speak your automatic thought clearly" : "e.g., Everyone seemed quiet during my demo presentation today. They must think I am completely incompetent and I have ruined my track record on this team..."}
                        className={`w-full text-xs font-semibold p-4 ${speechSupported ? 'pr-12' : ''} bg-slate-50/50 border border-gray-200 rounded-2xl focus:border-primary outline-none focus:bg-white text-slate-800 min-h-[110px] leading-relaxed resize-none`}
                      />
                      {speechSupported && (
                        <button
                          type="button"
                          onClick={() => activeSpeechField === 'guidedRawThought' ? stopSpeechRecognition() : startSpeechRecognition('guidedRawThought', setGuidedRawThought)}
                          className={`absolute right-3.5 bottom-3.5 p-2 rounded-xl transition-all duration-205 cursor-pointer ${
                            activeSpeechField === 'guidedRawThought' 
                              ? 'bg-rose-500 text-white animate-pulse' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                          title={activeSpeechField === 'guidedRawThought' ? "Stop recording" : "Speak automatic thought"}
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ y: 3, boxShadow: 'none' }}
                    type="button"
                    onClick={handleNextGuidedStep}
                    className="w-full py-3.5 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #14B8A6, #58CC02)', boxShadow: '0 5px 0 #0D9488' }}
                  >
                    <span>Identify My Pattern</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              )}

              {/* STEP 2: DISTORTION DROPDOWN & TRIGGER */}
              {guidedStep === 2 && (
                <div className="space-y-4">
                  {/* Raw thought review card */}
                  <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 italic space-y-1">
                    <span className="text-[8.5px] uppercase tracking-widest font-extrabold text-teal-800 block not-italic">Automatic Statement Under Evaluation:</span>
                    <p className="text-xs font-bold leading-relaxed text-teal-950">
                      "{guidedRawThought}"
                    </p>
                  </div>

                  {/* Drop-down selection */}
                  <div className="space-y-2">
                    <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-600 block">
                      2. Select the Closest Distortion Pattern
                    </label>
                    <select
                      value={guidedSelectedDistortionId}
                      onChange={(e) => setGuidedSelectedDistortionId(e.target.value)}
                      className="w-full text-xs font-bold py-3 px-4 bg-white border border-gray-300 rounded-xl focus:border-primary outline-none text-slate-800 focus:ring-1 focus:ring-primary shadow-2xs"
                    >
                      {DISTORTION_LIBRARY.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.emoji} {d.name}
                        </option>
                      ))}
                    </select>

                    {/* Contextual guidance on the active dropdown item */}
                    {guidedSelectedDistortionId && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base select-none">
                            {DISTORTION_LIBRARY.find(d => d.id === guidedSelectedDistortionId)?.emoji}
                          </span>
                          <h5 className="font-black text-slate-800">
                            {DISTORTION_LIBRARY.find(d => d.id === guidedSelectedDistortionId)?.name}
                          </h5>
                        </div>
                        <p className="text-[10.5px] text-zinc-500 font-semibold leading-relaxed">
                          {DISTORTION_LIBRARY.find(d => d.id === guidedSelectedDistortionId)?.description}
                        </p>
                        <div className="pt-1 select-none space-y-1">
                          <p className="text-[10px] text-red-600 font-bold italic">
                            ❌ Example: {DISTORTION_LIBRARY.find(d => d.id === guidedSelectedDistortionId)?.example}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI trigger Button */}
                  <button
                    type="button"
                    disabled={isAiLoading}
                    onClick={handleFetchAiReframe}
                    className="w-full py-3 bg-gradient-to-r from-teal-700 to-teal-800 hover:brightness-105 disabled:opacity-75 text-white font-black text-xs rounded-xl transition shadow-sm active:scale-97 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-teal-200" />
                        <span>Formulating Evidence-based Suggestion...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-white text-teal-200" />
                        <span>✨ Generate AI Balanced Perspective</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 3: PERSPECTIVE REVIEW */}
              {guidedStep === 3 && aiResponse && (
                <div className="space-y-4">
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-1">
                    <span className="text-[8.5px] uppercase tracking-widest font-extrabold text-slate-400 block pb-0.5">Original Thought</span>
                    <p className="text-zinc-500 font-semibold italic">"{guidedRawThought}"</p>
                    <div className="flex gap-2 items-center pt-2 select-none">
                      <span className="text-[8.5px] uppercase tracking-wider font-extrabold bg-[#f5eefb] text-[#5b3d88] px-2 py-0.5 rounded border border-[#dfcceb]">
                        Identified Distortion: {aiResponse.identifiedDistortion}
                      </span>
                    </div>
                  </div>

                  {/* AI Reframed perspective */}
                  <div className="p-4 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 border border-emerald-300/40 rounded-3xl space-y-2 text-left shadow-2xs relative">
                    <span className="absolute -top-2.5 left-4 text-[8px] uppercase tracking-widest font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-2xs">
                      AI Suggested Counterpoint
                    </span>
                    <h5 className="font-black text-emerald-900 text-xs flex items-center gap-1 pt-1">
                      <Heart className="w-3.5 h-3.5 fill-emerald-100 text-emerald-600" />
                      <span>Compassionate & Factual Rebalance</span>
                    </h5>
                    <p className="text-[11.5px] font-bold text-slate-800 leading-relaxed font-sans">
                      "{aiResponse.reframedThought}"
                    </p>
                  </div>

                  {/* AI suggestion */}
                  <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-1.5 text-left text-xs">
                    <h5 className="font-extrabold text-[#3d627f] flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 fill-sky-200 text-[#3d627f]" />
                      <span>Mindful Physical Recommendation</span>
                    </h5>
                    <p className="text-[10.5px] text-zinc-600 font-semibold leading-relaxed">
                      {aiResponse.suggestion}
                    </p>
                  </div>

                  {/* User edit configuration */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-600 block">
                      Configure Your Final Personalized Reframe
                    </label>
                    <div className="relative">
                      <textarea
                        value={guidedReframedThought}
                        onChange={(e) => setGuidedReframedThought(e.target.value)}
                        placeholder={activeSpeechField === 'guidedReframedThought' ? "Listening... Speak your final personalized reframe" : "Configure your final personalized reframe details..."}
                        className={`w-full text-xs font-semibold p-3.5 ${speechSupported ? 'pr-12' : ''} bg-white border border-gray-300 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-800 leading-relaxed shadow-3xs resize-none`}
                        rows={3}
                      />
                      {speechSupported && (
                        <button
                          type="button"
                          onClick={() => activeSpeechField === 'guidedReframedThought' ? stopSpeechRecognition() : startSpeechRecognition('guidedReframedThought', setGuidedReframedThought)}
                          className={`absolute right-3.5 bottom-3.5 p-2 rounded-xl transition-all duration-205 cursor-pointer ${
                            activeSpeechField === 'guidedReframedThought' 
                              ? 'bg-rose-500 text-white animate-pulse' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                          title={activeSpeechField === 'guidedReframedThought' ? "Stop recording" : "Speak personalized reframe"}
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Save action */}
                  <button
                    type="button"
                    onClick={handleSaveGuidedReframe}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-700/15 transition active:scale-97 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 font-black" />
                    <span>Catalog Completed Reframe ✓</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 2: CHALLENGE GYM MINIGAME */}
        {activeTab === 'challenge' && (
          <motion.div
            key="tab-challenge-pane"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 p-5 rounded-3xl text-left space-y-4">
              <div className="flex justify-between items-center w-full">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-purple-700 uppercase tracking-widest font-mono">Interactive Training Desk</span>
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-1">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span>Draft a Reframed Alternative</span>
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="text-[10px] font-black bg-white hover:bg-purple-100 border border-purple-200 text-purple-700 px-2.5 py-1.5 rounded-xl transition cursor-pointer shadow-3xs"
                >
                  Skip Challenge ⏭️
                </button>
              </div>

              {/* DISTRESSING AUTOMATED THOUGHT CHANCELLOR */}
              <div className="bg-teal-50/70 text-teal-950 p-4 rounded-2xl border border-teal-200/50 relative">
                <span className="absolute -top-2.5 left-4 text-[8px] uppercase tracking-widest font-black bg-red-500 text-white px-2 py-0.5 rounded-md shadow-2xs">
                  Distressed Automated Thought
                </span>
                <p className="text-xs font-bold leading-relaxed text-teal-900 italic pt-1.5">
                  "{activeChallenge.rawThought}"
                </p>
              </div>

              {/* OPTIONS GENERATOR */}
              <div className="space-y-2">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Which distortion is this?</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DISTORTION_LIBRARY.slice(0, 5).map((dist) => {
                    const isSelected = selectedGuessId === dist.id;
                    const isCorrectOpt = dist.id === activeChallenge.correctDistortionId;
                    
                    let btnStyle = "bg-white text-slate-700 border-gray-200 hover:border-purple-300";
                    if (selectedGuessId) {
                      if (isCorrectOpt) {
                        btnStyle = "bg-emerald-600 text-white border-transparent shadow-sm";
                      } else if (isSelected) {
                        btnStyle = "bg-red-50 text-red-800 border-red-200";
                      } else {
                        btnStyle = "bg-white text-slate-400 border-gray-100 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={dist.id}
                        type="button"
                        onClick={() => handleGuess(dist.id)}
                        className={`py-2 px-3 text-left rounded-xl border text-[10.5px] font-bold transition-all flex items-center gap-2 ${btnStyle} ${selectedGuessId ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span className="text-sm shrink-0">{dist.emoji}</span>
                        <span className="truncate">{dist.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ANSWER EXPOSURES */}
              <AnimatePresence>
                {selectedGuessId && (
                  <motion.div 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200"
                  >
                    <div className="flex gap-2 items-start">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${isGuessCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {isGuessCorrect ? '🎉 Clean Hit!' : '❌ Incorrect alternative'}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-semibold text-slate-600 text-left">
                      {activeChallenge.clincialFeedback}
                    </p>

                    {/* DRAFTING COMPOSER EXPOSURES */}
                    <div className="pt-2 text-left space-y-2">
                      <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block">
                        Interactive Practice: Reframe this thought in your own words
                      </label>
                      <div className="relative">
                        <textarea
                          value={draftedPracticeReframe}
                          onChange={(e) => setDraftedPracticeReframe(e.target.value)}
                          placeholder={activeSpeechField === 'draftedPracticeReframe' ? "Listening... Speak your alternative reframe" : "Draft a compassionate, balanced, factual alternative thought here..."}
                          className={`w-full text-xs font-semibold p-2.5 ${speechSupported ? 'pr-10' : ''} bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-purple-500 text-slate-800 min-h-[60px] resize-none`}
                        />
                        {speechSupported && (
                          <button
                            type="button"
                            onClick={() => activeSpeechField === 'draftedPracticeReframe' ? stopSpeechRecognition() : startSpeechRecognition('draftedPracticeReframe', setDraftedPracticeReframe)}
                            className={`absolute right-2 bottom-2 p-1.5 rounded-lg transition-all duration-205 cursor-pointer ${
                              activeSpeechField === 'draftedPracticeReframe' 
                                ? 'bg-rose-500 text-white animate-pulse' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                            title={activeSpeechField === 'draftedPracticeReframe' ? "Stop recording" : "Speak alternative reframe"}
                          >
                            <Mic className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setDraftedPracticeReframe(
                              DISTORTION_LIBRARY.find(d => d.id === activeChallenge.correctDistortionId)?.reframedExample || ''
                            );
                          }}
                          className="text-[9.5px] text-purple-600 hover:underline font-bold cursor-pointer"
                        >
                          💡 Show Clinical Recommendation
                        </button>
                        <button
                          type="button"
                          onClick={handleSavePracticeReframe}
                          className="py-1.5 px-4 bg-purple-700 text-white rounded-lg text-[10px] font-black hover:bg-purple-800 transition shadow-sm cursor-pointer"
                        >
                          Log My Reframe ✓
                        </button>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {/* HINT SYSTEM */}
              {!selectedGuessId && (
                <div className="flex items-center justify-between text-left">
                  {hasRevealedHint ? (
                    <p className="text-[10.5px] text-amber-800 font-medium bg-amber-50 py-2 px-3.5 rounded-xl border border-amber-100">
                      💡 <strong>Hint:</strong> {activeChallenge.hint}
                    </p>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setHasRevealedHint(true)}
                      className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Need a hint? Show clues.
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: DISTORTION BOOK LIBRARY */}
        {activeTab === 'library' && (
          <motion.div
            key="tab-library-pane"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-3 text-left">
              <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-widest block pl-1">Interactive Mental Distortion Library</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DISTORTION_LIBRARY.map((dist) => (
                  <div 
                    key={dist.id}
                    className="bg-white p-4.5 rounded-3xl border border-gray-200 shadow-3xs flex flex-col justify-between hover:shadow-xs hover:border-teal-300 transition-all duration-300 space-y-3.5"
                  >
                    <div className="space-y-1.5">
                      <div className="flex gap-2 items-center">
                        <span className="text-lg p-1.5 bg-teal-50 rounded-xl leading-none">{dist.emoji}</span>
                        <h5 className="text-[12.5px] font-black text-slate-800 leading-none">{dist.name}</h5>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed">
                        {dist.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-dashed border-gray-100 space-y-2 select-none">
                      <p className="text-[10px] text-red-600 leading-relaxed font-semibold">
                        ❌ <em className="font-bold">{dist.example}</em>
                      </p>
                      <p className="text-[10px] text-emerald-800 leading-relaxed font-semibold">
                        ✅ <em className="font-bold">{dist.reframedExample}</em>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent ledger of saved reframes */}
      {mySavedReframes.length > 0 && (
        <div className="space-y-3 text-left pt-2">
          <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest pl-1 block">My Cognitive Reframes Ledger</span>
          <div className="space-y-2.5">
            {mySavedReframes.map((ref) => (
              <div 
                key={ref.id}
                className="p-4 bg-teal-50/20 border border-teal-100 rounded-2xl flex justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[8px] uppercase tracking-wider font-mono font-extrabold bg-teal-100/60 text-teal-800 px-2 py-0.5 rounded border border-teal-200/50">
                      {ref.selectedDistortion}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold font-mono">{ref.date}</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-red-700/80 font-semibold italic select-none">
                      ❌ "{ref.rawThought}"
                    </p>
                    <p className="text-emerald-900 font-bold leading-normal">
                      👉 "{ref.reframedThought}"
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSavedReframe(ref.id)}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-50 transition self-start cursor-pointer shrink-0"
                  title="Remove Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
