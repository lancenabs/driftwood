import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Check, Trash2, ArrowRight, ArrowLeft, Brain, Sparkles, Smile, MessageSquare, AlertCircle, Bookmark, RefreshCw, BarChart, Mic, MicOff
} from 'lucide-react';

interface ThoughtRecord {
  id: string;
  date: string;
  situation: string;
  automaticThought: string;
  initialBelief: number; // 0 - 100 %
  emotion: string;
  initialIntensity: number; // 0 - 100 %
  distortion: string;
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
  finalBelief: number; // 0 - 100 %
  finalIntensity: number; // 0 - 100 %
}

interface CbtThoughtRecordProps {
  onTriggerInteractionAlert: (title: string, body: string) => void;
}

const DISTORTION_OPTIONS = [
  { label: 'All-or-Nothing Thinking', desc: 'Black-and-white categories; either perfect or a failure.' },
  { label: 'Catastrophizing', desc: 'Predicting the absolute worst potential outcome.' },
  { label: 'Mind Reading', desc: 'Assuming people are thinking negatively of you.' },
  { label: 'Emotional Reasoning', desc: 'Assuming feelings reflect objective physical reality.' },
  { label: 'Should Statements', desc: 'Judging self or others harshly using "should" or "must".' },
  { label: 'Personalization', desc: 'Blaming yourself for events outside of your direct control.' },
  { label: 'Reactive Absorption (Thermometer)', desc: 'Unconsciously absorbing the heated emotional climate/stress of your surroundings or other people.' }
];

export default function CbtThoughtRecord({ onTriggerInteractionAlert }: CbtThoughtRecordProps) {
  const [records, setRecords] = useState<ThoughtRecord[]>(() => {
    const saved = localStorage.getItem('therapy_cbt_thought_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: 'record-initial-1',
        date: '2026-06-10',
        situation: 'My teammate did not answer my feedback request on Slack for three hours.',
        automaticThought: 'They think my work is terrible and they are going to exclude me from the project.',
        initialBelief: 85,
        emotion: 'Anxious / Rejected',
        initialIntensity: 90,
        distortion: 'Mind Reading / Catastrophizing',
        evidenceFor: 'They replied to others in general chat, but ignored my direct message thread.',
        evidenceAgainst: 'They have been working on a complex release all morning. They always validate my work when they have time.',
        balancedThought: 'They are likely very occupied with their own immediate tasks. Slow responses are normal and do not reflect my worth.',
        finalBelief: 25,
        finalIntensity: 30
      }
    ];
  });

  const [wizardStep, setWizardStep] = useState<number>(0); // 0: list, 1: Situation, 2: Automatic thought, 3: Evidence, 4: Reframed review
  
  // Builder form states
  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [initialBelief, setInitialBelief] = useState<number>(70);
  const [emotion, setEmotion] = useState('');
  const [initialIntensity, setInitialIntensity] = useState<number>(80);
  const [selectedDistortion, setSelectedDistortion] = useState(DISTORTION_OPTIONS[0].label);
  const [evidenceFor, setEvidenceFor] = useState('');
  const [evidenceAgainst, setEvidenceAgainst] = useState('');
  const [balancedThought, setBalancedThought] = useState('');
  const [finalBelief, setFinalBelief] = useState<number>(30);
  const [finalIntensity, setFinalIntensity] = useState<number>(35);

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

  useEffect(() => {
    localStorage.setItem('therapy_cbt_thought_records', JSON.stringify(records));
  }, [records]);

  const handleStartWizard = () => {
    setSituation('');
    setAutomaticThought('');
    setInitialBelief(75);
    setEmotion('');
    setInitialIntensity(80);
    setEvidenceFor('');
    setEvidenceAgainst('');
    setBalancedThought('');
    setFinalBelief(30);
    setFinalIntensity(35);
    setWizardStep(1);
  };

  const handleNextStep = () => {
    if (wizardStep === 1) {
      if (!situation.trim() || !emotion.trim()) {
        onTriggerInteractionAlert("⚠️ Complete Required Fields", "Please outline what happened (Situation) and how you felt (Emotion).");
        return;
      }
      setWizardStep(2);
    } else if (wizardStep === 2) {
      if (!automaticThought.trim()) {
        onTriggerInteractionAlert("⚠️ Core Thought Required", "Please express what exact automatic words or thoughts ran through your mind.");
        return;
      }
      setWizardStep(3);
    } else if (wizardStep === 3) {
      if (!evidenceFor.trim() || !evidenceAgainst.trim()) {
        onTriggerInteractionAlert("⚠️ Evidence Gathering", "To create an honest reframe, please write down at least one point supporting your thought, and one point of objective reality opposing it.");
        return;
      }
      setWizardStep(4);
    }
  };

  const handlePrevStep = () => {
    setWizardStep(prev => prev - 1);
  };

  const handleSaveRecord = () => {
    if (!balancedThought.trim()) {
      onTriggerInteractionAlert("⚠️ Write a Balance Thought", "Please compile your balanced, alternative thought before saving.");
      return;
    }

    const newRec: ThoughtRecord = {
      id: `rec-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      situation: situation.trim(),
      automaticThought: automaticThought.trim(),
      initialBelief,
      emotion: emotion.trim(),
      initialIntensity,
      distortion: selectedDistortion,
      evidenceFor: evidenceFor.trim(),
      evidenceAgainst: evidenceAgainst.trim(),
      balancedThought: balancedThought.trim(),
      finalBelief,
      finalIntensity
    };

    setRecords(prev => [newRec, ...prev]);
    setWizardStep(0);
    onTriggerInteractionAlert(
      "🌱 Thought Record Cataloged", 
      `Perfect job! Believing the automatic thought dropped from ${initialBelief}% to ${finalBelief}%. Testing your thoughts against physical evidence reshapes negative neural biases.`
    );
  };

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const reliefDeltaAverage = records.length > 0 
    ? Math.round(records.reduce((acc, curr) => acc + (curr.initialIntensity - curr.finalIntensity), 0) / records.length)
    : 0;

  return (
    <div className="space-y-5 text-left">
      {/* Overview Analytics Bar */}
      {wizardStep === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-[#ebe6f4] to-white p-4 rounded-3xl border border-[#decfe8] flex flex-col justify-between">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#7450a1]">Records Tracked</span>
            <span className="text-xl font-black text-slate-800 mt-2">{records.length} Worksheet{records.length === 1 ? '' : 's'}</span>
          </div>

          <div className="bg-gradient-to-br from-[#e1f5fe]/50 to-white p-4 rounded-3xl border border-sky-100 flex flex-col justify-between">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-sky-700">Average Relief Shift</span>
            <span className="text-xl font-black text-emerald-700 mt-2">-{reliefDeltaAverage}% Intensity</span>
          </div>

          <div className="bg-[#fcf7ee] p-4 rounded-3xl border border-amber-100 flex flex-col justify-between">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-800">CBT Methodology</span>
            <span className="text-[10px] text-slate-500 font-bold leading-normal mt-2">Using Cognitive Restructuring loops to challenge mental biases.</span>
          </div>
        </div>
      )}

      {/* Main record wizard step switches */}
      {wizardStep === 0 ? (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex justify-between items-center gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">CBT Thought Distiller</h4>
              <h3 className="text-base font-black text-slate-800">Challenge Distressing Automatic Voices</h3>
              <p className="text-[10.5px] text-zinc-500 font-semibold leading-relaxed">
                When anxiety or sadness flares up, use the structured Thought Record framework to separate emotional storyboards from factual physical proof.
              </p>
            </div>
            <button
              onClick={handleStartWizard}
              className="btn-duo btn-duo-green text-xs py-2.5 px-5 shrink-0"
            >
              + Draw New Record
            </button>
          </div>

          {/* Historical records list */}
          {records.length === 0 ? (
            <div className="bg-gradient-to-b from-sky-50/20 via-white to-white rounded-3xl p-8 border border-sky-100 shadow-[0_12px_24px_rgba(56,189,248,0.02)] text-center flex flex-col items-center relative overflow-hidden">
              {/* Decorative backgrounds */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400" />
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-sky-50/50 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-indigo-50/30 rounded-full blur-xl pointer-events-none" />
              
              {/* Illustration Container */}
              <div className="relative mb-5 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute w-12 h-12 rounded-full bg-sky-100/50 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-sky-600 animate-bounce" style={{ animationDuration: '4s' }} />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
              </div>

              <h4 className="font-display text-sm font-extrabold text-neutral-800 tracking-tight">Your CBT Thought Chronicle is Open</h4>
              <p className="text-[11px] text-zinc-500 font-semibold max-w-[320px] mt-1.5 leading-relaxed">
                Unlock the clinical ability to reframe automatic voices. Challenging cognitive distortions builds stronger, more objective neural networks.
              </p>

              {/* Step By Step Guide */}
              <div className="w-full max-w-[340px] mt-6 bg-slate-50/75 border border-slate-100 rounded-2xl p-4 text-left space-y-3">
                <h5 className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">Thought Reframing Protocol:</h5>
                <div className="space-y-2.5 text-[10.5px]">
                  <div className="flex gap-2.5">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[8.5px] font-extrabold shrink-0">1</div>
                    <p className="text-slate-600 font-semibold leading-normal">
                      <strong className="text-neutral-800">Pinpoint the Situation</strong>: Track exactly what triggers your distress and write the automatic thought loop.
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[8.5px] font-extrabold shrink-0">2</div>
                    <p className="text-slate-600 font-semibold leading-normal">
                      <strong className="text-neutral-800">Evaluate objectively</strong>: Map automatic thoughts to clinical distortions (e.g. mind-reading, catastrophizing).
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[8.5px] font-extrabold shrink-0">3</div>
                    <p className="text-slate-600 font-semibold leading-normal">
                      <strong className="text-neutral-800">Establish factual proof</strong>: Contrast physical facts against emotional worries to anchor a healthy reframed statement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-widest pl-1">Historical Thought Records</span>
              
              {records.map((rec) => {
                const shift = rec.initialIntensity - rec.finalIntensity;
                return (
                  <div 
                    key={rec.id}
                    className="p-5 bg-white border border-gray-100 rounded-3xl space-y-3.5 hover:shadow-xs transition duration-300"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[8.5px] font-bold font-mono text-slate-400">{rec.date}</span>
                        <h4 className="text-xs font-black text-slate-800 line-clamp-1">{rec.situation}</h4>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-[9px] shrink-0">
                        {shift > 0 && (
                          <span className="bg-emerald-50 text-emerald-800 font-black px-2 py-0.5 rounded-md border border-emerald-100">
                            -{shift}% Intensity Drop!
                          </span>
                        )}
                        <button
                          onClick={(e) => handleDeleteRecord(rec.id, e)}
                          className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5 border-t border-dashed border-slate-100">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-wider text-red-500 block">Automatic Distress Thought</span>
                        <p className="text-[11px] font-semibold text-slate-700 italic">
                          "{rec.automaticThought}"
                        </p>
                        <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-slate-400 font-bold">
                          <span>Belief: {rec.initialBelief}%</span>
                          <span>•</span>
                          <span>Emotion: {rec.emotion} ({rec.initialIntensity}%)</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-wider text-emerald-600 block">Balanced Reframe</span>
                        <p className="text-[11px] font-bold text-slate-900 leading-normal">
                          "{rec.balancedThought}"
                        </p>
                        <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-slate-500 font-bold">
                          <span className="text-emerald-700 font-black">Belief: {rec.finalBelief}%</span>
                          <span>•</span>
                          <span>Intensity Remaining: {rec.finalIntensity}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* WIZARD BUILDER PANEL */
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-5">
          {/* Progress stepper indication */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="p-1 px-2.5 bg-[#f5eefb] text-[#5b3d88] text-[9.5px] font-black rounded-lg uppercase tracking-wide">
                Step {wizardStep} of 4
              </span>
              <span className="text-[10px] text-slate-400 font-bold">|</span>
              <span className="text-[10.5px] text-slate-600 font-semibold font-sans">
                {wizardStep === 1 && "Situation & Core Emotion"}
                {wizardStep === 2 && "The Negative Automatic Voices"}
                {wizardStep === 3 && "Evidence Weighing Laboratory"}
                {wizardStep === 4 && "Constructing Balanced Compassion"}
              </span>
            </div>

            <button
              onClick={() => setWizardStep(0)}
              className="text-[10px] text-neutral-400 hover:text-black font-extrabold"
            >
              Cancel Worksheet
            </button>
          </div>

          <AnimatePresence mode="wait">
            {wizardStep === 1 && (
              <motion.div 
                key="step-1"
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    1. The Situation (What triggered this emotion?)
                  </label>
                  <p className="text-[9.5px] text-slate-400">Describe only the physical facts of what happened without interpreting motives.</p>
                  <div className="relative">
                    <input
                      type="text"
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      placeholder={activeSpeechField === 'situation' ? "Listening... Speak trigger situation clearly" : "e.g. Received a critical remark on my code pull-request from my team lead..."}
                      className={`w-full text-xs font-semibold py-2 ${speechSupported ? 'pl-3 pr-10' : 'px-3'} bg-slate-50/50 border border-gray-100 rounded-xl focus:border-black outline-none focus:bg-white text-slate-800`}
                    />
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={() => activeSpeechField === 'situation' ? stopSpeechRecognition() : startSpeechRecognition('situation', setSituation)}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-205 cursor-pointer ${
                          activeSpeechField === 'situation' 
                            ? 'bg-rose-500 text-white animate-pulse' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                        title={activeSpeechField === 'situation' ? "Stop recording" : "Speak trigger situation"}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      2. Primary Emotion (e.g. Hurt, Fear, Rage, Shame)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={emotion}
                        onChange={(e) => setEmotion(e.target.value)}
                        placeholder={activeSpeechField === 'emotion' ? "Listening... Speak emotion" : "e.g. Inferior / Anxious"}
                        className={`w-full text-xs font-semibold py-2 ${speechSupported ? 'pl-3 pr-10' : 'px-3'} bg-slate-50/50 border border-gray-100 rounded-xl focus:border-black outline-none focus:bg-white text-slate-800`}
                      />
                      {speechSupported && (
                        <button
                          type="button"
                          onClick={() => activeSpeechField === 'emotion' ? stopSpeechRecognition() : startSpeechRecognition('emotion', setEmotion)}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-205 cursor-pointer ${
                            activeSpeechField === 'emotion' 
                              ? 'bg-rose-500 text-white animate-pulse' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                          title={activeSpeechField === 'emotion' ? "Stop recording" : "Speak emotion"}
                        >
                          <Mic className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex justify-between">
                      <span>3. Emotional Intensity</span>
                      <span className="text-black font-bold font-mono">{initialIntensity}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={initialIntensity}
                      onChange={(e) => setInitialIntensity(parseInt(e.target.value))}
                      className="w-full accent-black h-1 bg-gray-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-[9px] text-slate-400 font-bold block pt-1">How overwhelming does this feel physically?</span>
                  </div>
                </div>
              </motion.div>
            )}

            {wizardStep === 2 && (
              <motion.div 
                key="step-2"
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    4. Automatic Thought (What are you telling yourself?)
                  </label>
                  <p className="text-[9.5px] text-slate-400">Write down the absolute raw words, assumptions, or worst-case predictions.</p>
                  <div className="relative">
                    <textarea
                      value={automaticThought}
                      onChange={(e) => setAutomaticThought(e.target.value)}
                      placeholder={activeSpeechField === 'automaticThought' ? "Listening... Speak your automatic fear" : "e.g. They think I am incompetent and are going to replace me. I will fail this probation period..."}
                      className={`w-full text-xs font-semibold p-2.5 ${speechSupported ? 'pr-10' : ''} bg-slate-50/50 border border-gray-100 rounded-xl focus:border-black outline-none focus:bg-white text-slate-800 min-h-[70px] resize-none`}
                    />
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={() => activeSpeechField === 'automaticThought' ? stopSpeechRecognition() : startSpeechRecognition('automaticThought', setAutomaticThought)}
                        className={`absolute right-2 bottom-3.5 p-1.5 rounded-lg transition-all duration-205 cursor-pointer ${
                          activeSpeechField === 'automaticThought' 
                            ? 'bg-rose-500 text-white animate-pulse' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                        title={activeSpeechField === 'automaticThought' ? "Stop recording" : "Speak automatic thought"}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex justify-between">
                      <span>Belief in this Thought</span>
                      <span className="text-red-500 font-black font-mono">{initialBelief}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={initialBelief}
                      onChange={(e) => setInitialBelief(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 text-red-500 rounded-lg cursor-pointer accent-red-500"
                    />
                    <span className="text-[9px] text-slate-400 font-bold block pt-1">At this exact moment, how true does this thought feel?</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                      5. Prominent Distortion Trap
                    </label>
                    <select
                      value={selectedDistortion}
                      onChange={(e) => setSelectedDistortion(e.target.value)}
                      className="w-full text-xs font-bold py-2 px-3 bg-white border border-gray-200 rounded-xl focus:border-black outline-none text-slate-700"
                    >
                      {DISTORTION_OPTIONS.map((d, optIdx) => (
                        <option key={optIdx} value={d.label}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[9px] text-indigo-700 mt-1 font-semibold leading-relaxed">
                      💡 <em>{DISTORTION_OPTIONS.find(d => d.label === selectedDistortion)?.desc}</em>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {wizardStep === 3 && (
              <motion.div 
                key="step-3"
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className="space-y-4"
              >
                <div className="bg-indigo-50/40 p-3.5 border border-indigo-100 rounded-2xl">
                  <h4 className="text-xs font-black text-indigo-900 flex items-center gap-1.5 leading-none">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>The Evidence Trial</span>
                  </h4>
                  <p className="text-[9.5px] text-indigo-800 leading-relaxed font-semibold mt-1">
                    Be a rigorous defense attorney. Separate actual courtroom evidence (facts, history, actions) from mental projections and guesses.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-red-600 block">
                      6. Evidence supporting the thought
                    </label>
                    <span className="text-[9px] text-slate-400 block font-semibold">What objective facts make this thought feel correct?</span>
                    <div className="relative">
                      <textarea
                        value={evidenceFor}
                        onChange={(e) => setEvidenceFor(e.target.value)}
                        placeholder={activeSpeechField === 'evidenceFor' ? "Listening... Speak evidence for" : "e.g. My PR comments were blunt, and this is the second time my lead re-reviewed my commits..."}
                        className={`w-full text-xs font-semibold p-2.5 ${speechSupported ? 'pr-10' : ''} bg-slate-50/50 border border-gray-100 rounded-xl focus:border-red-400 outline-none focus:bg-white text-slate-800 min-h-[80px] resize-none`}
                      />
                      {speechSupported && (
                        <button
                          type="button"
                          onClick={() => activeSpeechField === 'evidenceFor' ? stopSpeechRecognition() : startSpeechRecognition('evidenceFor', setEvidenceFor)}
                          className={`absolute right-2 bottom-3.5 p-1.5 rounded-lg transition-all duration-205 cursor-pointer ${
                            activeSpeechField === 'evidenceFor' 
                              ? 'bg-rose-500 text-white animate-pulse' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                          title={activeSpeechField === 'evidenceFor' ? "Stop recording" : "Speak facts"}
                        >
                          <Mic className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                      7. Evidence AGAINST the thought
                    </label>
                    <span className="text-[9px] text-slate-400 block font-semibold">What factual clues, past track records, or outer context prove otherwise?</span>
                    <div className="relative">
                      <textarea
                        value={evidenceAgainst}
                        onChange={(e) => setEvidenceAgainst(e.target.value)}
                        placeholder={activeSpeechField === 'evidenceAgainst' ? "Listening... Speak evidence against" : "e.g. My lead praised my codebase structure in direct DMs yesterday. They did a strict PR review for everyone in my squad because of critical releases this week."}
                        className={`w-full text-xs font-semibold p-2.5 ${speechSupported ? 'pr-10' : ''} bg-slate-50/50 border border-gray-100 rounded-xl focus:border-emerald-400 outline-none focus:bg-white text-slate-800 min-h-[80px] resize-none`}
                      />
                      {speechSupported && (
                        <button
                          type="button"
                          onClick={() => activeSpeechField === 'evidenceAgainst' ? stopSpeechRecognition() : startSpeechRecognition('evidenceAgainst', setEvidenceAgainst)}
                          className={`absolute right-2 bottom-3.5 p-1.5 rounded-lg transition-all duration-205 cursor-pointer ${
                            activeSpeechField === 'evidenceAgainst' 
                              ? 'bg-rose-500 text-white animate-pulse' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                          title={activeSpeechField === 'evidenceAgainst' ? "Stop recording" : "Speak exceptions"}
                        >
                          <Mic className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {wizardStep === 4 && (
              <motion.div 
                key="step-4"
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    8. Create a compassionate, Balanced Alternative Thought
                  </label>
                  <p className="text-[9.5px] text-slate-400">Synthesize evidence. Write a realistic statement that acknowledges the facts without catastrophic projection.</p>
                  <div className="relative">
                    <textarea
                      value={balancedThought}
                      onChange={(e) => setBalancedThought(e.target.value)}
                      placeholder={activeSpeechField === 'balancedThought' ? "Listening... Speak your balanced perspective" : "e.g. Although the critiques are strict, the code comments are purely technical and aiming to avoid system bugs. This is a common part of technical learning, not a personal threat."}
                      className={`w-full text-xs font-semibold p-2.5 ${speechSupported ? 'pr-10' : ''} bg-slate-50/50 border border-gray-100 rounded-xl focus:border-black outline-none focus:bg-white text-slate-800 min-h-[70px] resize-none`}
                    />
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={() => activeSpeechField === 'balancedThought' ? stopSpeechRecognition() : startSpeechRecognition('balancedThought', setBalancedThought)}
                        className={`absolute right-2 bottom-3.5 p-1.5 rounded-lg transition-all duration-205 cursor-pointer ${
                          activeSpeechField === 'balancedThought' 
                            ? 'bg-rose-500 text-white animate-pulse' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                        title={activeSpeechField === 'balancedThought' ? "Stop recording" : "Speak balanced alternative"}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setBalancedThought(
                          `Having examined both sides, a balanced look proves: the immediate situation does not completely support the automatic fear of "${automaticThought.toLowerCase().replace(/[".]/g, '')}". There is substantial factual context, including "${evidenceAgainst.toLowerCase().replace(/[".]/g, '')}" which indicates a much more peaceful outcome.`
                        );
                      }}
                      className="text-[9px] text-indigo-700 font-bold hover:underline"
                    >
                      🪄 Auto-Synthesize Balanced Draft
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex justify-between">
                      <span>Re-Rate belief in original automated thought</span>
                      <span className="text-emerald-700 font-extrabold font-mono">{finalBelief}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={finalBelief}
                      onChange={(e) => setFinalBelief(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg cursor-pointer accent-emerald-600"
                    />
                    <span className="text-[9px] text-slate-400 font-bold block pt-1">Belief originally: {initialBelief}%</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex justify-between">
                      <span>Remaining Emotion Intensity</span>
                      <span className="text-[#3d627f] font-extrabold font-mono">{finalIntensity}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={finalIntensity}
                      onChange={(e) => setFinalIntensity(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg cursor-pointer accent-[#3d627f]"
                    />
                    <span className="text-[9px] text-slate-400 font-bold block pt-1">Intensity originally: {initialIntensity}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stepper dynamic navigation controllers */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            {wizardStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="py-2 px-4 border border-zinc-200 hover:border-zinc-400 text-zinc-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {wizardStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-duo btn-duo-teal text-xs py-2 px-5 flex items-center gap-1"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveRecord}
                className="py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition cursor-pointer"
              >
                Log Complete Record ✓
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
