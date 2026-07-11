import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, Check, Plus, Trash2, ArrowRight, Sparkles, RefreshCw, Clock, Award, HelpCircle, Mic
} from 'lucide-react';

import { ActivityReminder } from '../types';

interface SmartGoal {
  id: string;
  rawGoalText: string;
  title: string;
  s_specific: string;
  m_measurable: string;
  a_actionable: string;
  r_relevant: string;
  t_timebound: string;
  actionPlan: string[];
  completedSteps: boolean[]; // tracks completion of the 4 actionPlan steps
  aiCopingTip: string;
  createdAt: string;
  isCustomRaw: boolean;
}


interface ScreenSmartGoalsProps {
  userName: string;
  onTriggerInteractionAlert?: (title: string, body: string) => void;
  activityReminders?: ActivityReminder[];
  setActivityReminders?: (reminders: ActivityReminder[]) => void;
}

const PRESET_RAW_GOALS = [
  "I want to practice deep breathing every morning to manage my panic spikes.",
  "I goal myself to write down gratitude things in evening so I don't focus on negatives.",
  "I want to catch my cognitive distortion patterns and reframe thoughts at least once a day.",
  "I wish to take a daily mindful walk outside for grounding is my therapeutic goal."
];

export default function ScreenSmartGoals({ 
  userName, 
  onTriggerInteractionAlert,
  activityReminders = [],
  setActivityReminders
}: ScreenSmartGoalsProps) {
  const [goals, setGoals] = useState<SmartGoal[]>(() => {
    const saved = localStorage.getItem('therapy_smart_goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Return initial preloaded SMART Goal
    return [
      {
        id: 'initial-goal-1',
        rawGoalText: "I want to practice deep breathing every morning to manage my panic spikes.",
        title: "Daily Morning Resonant Breath Breathing",
        s_specific: "Complete 5 minutes of somatic box breathing in the Breathwork lounge in my cozy armchair immediately upon waking up.",
        m_measurable: "Log your practice using the built-in Daily Habits check-ins and progress metrics 5 days a week.",
        a_actionable: "Configure a 7:30 AM specific daily reminder now and begin with 3 cooling chest-release breaths first thing tomorrow morning.",
        r_relevant: "Directly down-regulates autonomic amygdala hyper-vigilance, helping stop morning cortisol and adrenaline dumps.",
        t_timebound: "Follow this trial setup for exactly 14 consecutive calendar days.",
        actionPlan: [
          "Sit upright immediately after your alarm rings and relax your jaw.",
          "Activate the Somatic Breath Sync visual circles for 5 complete cycles.",
          "Sip a cup of warm water mindfully, observing 3 distinct sensory properties.",
          "Keep a simple checkmark tracked in your self-care status dashboard."
        ],
        completedSteps: [true, false, false, false],
        aiCopingTip: "Friction is highest on day 3. Give yourself unconditional validation for trying, even if you only achieve 45 seconds of pacing.",
        createdAt: new Date().toISOString(),
        isCustomRaw: false
      }
    ];
  });

  const [activeGoalId, setActiveGoalId] = useState<string>('initial-goal-1');
  const [newGoalInput, setNewGoalInput] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [activeBadgeInfo, setActiveBadgeInfo] = useState<'S' | 'M' | 'A' | 'R' | 'T' | null>(null);

  // Motivation vs Discipline Architect states
  const [disciplineAnchor, setDisciplineAnchor] = useState("shutting down my computer browser");
  const [disciplineHabit, setDisciplineHabit] = useState("breathe slow deep breaths for 2 minutes");
  const [frictionPrep, setFrictionPrep] = useState(true);
  const [frictionMinute, setFrictionMinute] = useState(true);
  const [frictionIdentity, setFrictionIdentity] = useState(true);

  // Milestone Reminder States
  const [reminderTime, setReminderTime] = useState<string>("08:00");
  const [selectedRemStep, setSelectedRemStep] = useState<string>("overall");

  // Speech Recognition states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognitionRef = React.useRef<any>(null);
  const speechSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startSpeechRecognition = () => {
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
        setIsRecording(true);
      };
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setNewGoalInput((prev) => (prev ? prev + ' ' + transcript : transcript));
        }
      };
      recognition.onerror = () => {
        setIsRecording(false);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsRecording(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  interface ConfettiParticle {
    id: number;
    color: string;
    size: number;
    left: number;
    delay: number;
    duration: number;
    rotate: number;
    xOffset: number;
    yDrop: number;
    shape: 'square' | 'circle' | 'triangle';
  }

  const [confettiBurst, setConfettiBurst] = useState<ConfettiParticle[]>([]);

  const triggerConfettiCelebration = () => {
    const colors = [
      '#f43f5e', '#ec4899', '#d946ef', '#a855f7', 
      '#6366f1', '#3b82f6', '#06b6d4', '#14b8a6', 
      '#10b981', '#22c55e', '#eab308', '#f97316'
    ];
    const shapes: ('square' | 'circle' | 'triangle')[] = ['square', 'circle', 'triangle'];
    const newParticles = Array.from({ length: 85 }).map((_, idx) => {
      const left = Math.random() * 100; // random percentage across screen width
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.floor(Math.random() * 8) + 8; // 8px to 16px
      const delay = Math.random() * 0.45; // slightly staggered
      const duration = Math.random() * 2.2 + 2.2; // fall time
      const rotate = Math.random() * 720 - 360; // rotation spin
      const xOffset = Math.random() * 160 - 80; // random horizontal wind drift
      const yDrop = Math.random() * 150 + 400; // fall offset
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      return {
        id: Date.now() + idx,
        color,
        size,
        left,
        delay,
        duration,
        rotate,
        xOffset,
        yDrop,
        shape
      };
    });
    setConfettiBurst(newParticles);
    
    // Clear out to prevent memory leaks after sequence completes
    setTimeout(() => {
      setConfettiBurst([]);
    }, 6500);
  };

  useEffect(() => {
    localStorage.setItem('therapy_smart_goals', JSON.stringify(goals));
  }, [goals]);

  const activeGoal = goals.find(g => g.id === activeGoalId) || goals[0];

  const handleAddNewRawGoal = () => {
    const text = newGoalInput.trim();
    if (!text) return;
    
    // Create pre-filled initial draft that can be immediately refined by AI
    const newDraft: SmartGoal = {
      id: String(Date.now()),
      rawGoalText: text,
      title: "Draft Wellness Goal",
      s_specific: "Please click 'Optimize with AI Cognitive Coach' to generate a specific target outline.",
      m_measurable: "Define trackable outcomes to check your progress objectively.",
      a_actionable: "Focus on a tiny 2-minute actionable launch key to bypass task paralysis.",
      r_relevant: "Align this exercise to soothe your current emotional stressors and mood patterns.",
      t_timebound: "Select an trial milestone (e.g. 14 days) to evaluate cognitive progression.",
      actionPlan: [
        "First step draft",
        "Second step draft",
        "Third step draft",
        "Fourth step draft"
      ],
      completedSteps: [false, false, false, false],
      aiCopingTip: "Your AI Coach stands ready to evaluate this draft goal and forge a precise therapeutic blueprint.",
      createdAt: new Date().toISOString(),
      isCustomRaw: true
    };

    setGoals([newDraft, ...goals]);
    setActiveGoalId(newDraft.id);
    setNewGoalInput('');
  };

  const handleOptimizeWithAI = async (goalId: string) => {
    const targetGoal = goals.find(g => g.id === goalId);
    if (!targetGoal) return;

    setIsOptimizing(true);
    try {
      const response = await fetch('/api/therapy/refine-smart-goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rawGoal: targetGoal.rawGoalText,
          userName: userName
        })
      });

      const data = await response.json();
      if (data.success) {
        const updated = goals.map(g => {
          if (g.id === goalId) {
            return {
              ...g,
              title: data.title,
              s_specific: data.s_specific,
              m_measurable: data.m_measurable,
              a_actionable: data.a_actionable,
              r_relevant: data.r_relevant,
              t_timebound: data.t_timebound,
              actionPlan: data.actionPlan || g.actionPlan,
              completedSteps: [false, false, false, false],
              aiCopingTip: data.aiCopingTip,
              isCustomRaw: false
            };
          }
          return g;
        });
        setGoals(updated);
        
        if (onTriggerInteractionAlert) {
          onTriggerInteractionAlert(
            "🧠 SMART Blueprint Prepared!",
            `Your AI Coach successfully converted "${data.title}" into a clinical-grade action plan. Make sure to check the sequential steps!`
          );
        }
      }
    } catch (err) {
      console.error("Failed to call SMART Goals endpoint:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    const index = goals.findIndex(g => g.id === goalId);
    const updated = goals.filter(g => g.id !== goalId);
    setGoals(updated);
    if (updated.length > 0) {
      const nextActiveIndex = index === 0 ? 0 : index - 1;
      setActiveGoalId(updated[nextActiveIndex].id);
    }
  };

  const toggleStepCompleted = (goalId: string, stepIndex: number) => {
    const originalGoal = goals.find(g => g.id === goalId);
    if (!originalGoal) return;
    const wasAlreadyComplete = originalGoal.completedSteps.every(v => v);

    const updated = goals.map(g => {
      if (g.id === goalId) {
        const nextCompleted = [...g.completedSteps];
        nextCompleted[stepIndex] = !nextCompleted[stepIndex];
        return { ...g, completedSteps: nextCompleted };
      }
      return g;
    });
    setGoals(updated);

    // If fully completed, showcase celebratory animations + custom alerts
    const targetGoal = updated.find(g => g.id === goalId);
    if (targetGoal && targetGoal.completedSteps.every(v => v)) {
      if (!wasAlreadyComplete) {
        triggerConfettiCelebration();
      }
      if (onTriggerInteractionAlert) {
        onTriggerInteractionAlert(
          "🏆 Deep Coherence Achieved!",
          `Congratulations ${userName}! You've checked off every micro-step in your "${targetGoal.title}" blueprint. This is an stellar milestone in self-care pacing!`
        );
      }
    }
  };

  const handleScheduleReminder = () => {
    if (!activeGoal) return;
    if (!setActivityReminders) return;

    let activityName = `🎯 SMART Goal: ${activeGoal.title}`;
    if (selectedRemStep !== "overall") {
      const stepIdx = parseInt(selectedRemStep, 10);
      const stepText = activeGoal.actionPlan[stepIdx];
      activityName = `⏰ Step ${stepIdx + 1} milestone: ${stepText || 'Practice step'}`;
    }

    const newReminder: ActivityReminder = {
      id: `smart-goal-${activeGoal.id}-${selectedRemStep}-${Date.now()}`,
      activity: activityName,
      time: reminderTime,
      enabled: true
    };

    setActivityReminders([...activityReminders, newReminder]);

    if (onTriggerInteractionAlert) {
      onTriggerInteractionAlert(
        "🔔 Push-Notification Milestone Locked!",
        `Successfully scheduled your reminder for "${activityName}" at ${reminderTime}. This milestone is fully synced with our main active alarm dispatcher.`
      );
    }
  };

  const handleDeleteReminder = (remId: string) => {
    if (!setActivityReminders) return;
    setActivityReminders(activityReminders.filter(r => r.id !== remId));
  };

  const handleToggleReminder = (remId: string) => {
    if (!setActivityReminders) return;
    setActivityReminders(activityReminders.map(r => r.id === remId ? { ...r, enabled: !r.enabled } : r));
  };

  const SMART_CRITERIA_EXPLANATIONS = {
    S: {
      term: "Specific",
      desc: "Narrow down exactly what action you will execute. Vague goals fail because direction is absent. Clarity creates physical action lanes."
    },
    M: {
      term: "Measurable",
      desc: "Assign a clean trackable metric (e.g. logging occurrences, days per week) so you can evidence your gradual progress and feel mastery."
    },
    A: {
      term: "Actionable",
      desc: "Design an initial launch micro-habits action taking under 2 minutes. Low physical friction overrides initial cognitive task blockages."
    },
    R: {
      term: "Relevant",
      desc: "Align your behavior directly with biological coping mechanisms, neural down-regulation, or psychiatric directives that suit your current mental workload."
    },
    T: {
      term: "Time-bound",
      desc: "State a strict localized timeline trial phase (like 14 days) to bypass eternal procrastination and support clean self-evaluation."
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Introduction Banner */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute right-[-10px] top-[-10px] opacity-[0.06] pointer-events-none">
          <Target className="w-40 h-40 text-teal-700" />
        </div>
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-1.5 bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider w-fit border border-teal-100">
            <Target className="w-3 h-3 text-teal-600" />
            <span>Behavioral Therapy Lab • CBT / SMART Goals</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight font-sans text-slate-800">
            Interactive SMART Goals Planner
          </h2>
          <p className="text-[11.5px] text-slate-500 leading-relaxed font-semibold max-w-lg">
            A vague intent leads to mental paralysis. Convert generic desires into precise, clinical-grade cognitive blueprints.
          </p>
        </div>
      </div>

      {/* Main Goal Configuration Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        {/* Left Panel: Goal list and fast inputs (4 cols on wide, full on mobile) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3.5">
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest font-sans">
                Active Wellness Goals
              </h4>
              <span className="text-[10px] text-slate-400 font-semibold block">Select your active self-care focus</span>
            </div>

            {/* List block */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {goals.map((g) => {
                const isSelected = activeGoalId === g.id;
                const totalSteps = g.completedSteps.length;
                const completedCount = g.completedSteps.filter(Boolean).length;
                const pct = Math.round((completedCount / totalSteps) * 100);

                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveGoalId(g.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition duration-200 cursor-pointer flex items-center justify-between gap-2.5 text-xs ${
                      isSelected
                        ? 'border-teal-600 bg-teal-500/[0.04] ring-1 ring-teal-600'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className={`font-black block truncate ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                        {g.title === "Draft Wellness Goal" ? "📝 " + g.rawGoalText.slice(0, 30) : g.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 font-mono">
                          Progress: {completedCount}/{totalSteps}
                        </span>
                        <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-600 transition-all duration-300" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                    {g.isCustomRaw && (
                      <span className="shrink-0 bg-amber-50 border border-amber-200 text-amber-800 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md">
                        Draft
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Presets Input Section */}
            <div className="pt-2.5 border-t border-slate-100 space-y-2">
              <label className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">Fast Presets</label>
              <div className="flex flex-col gap-1">
                {PRESET_RAW_GOALS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewGoalInput(preset)}
                    className="w-full py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 text-[10px] text-slate-700 font-bold transition rounded-lg text-left truncate cursor-pointer"
                  >
                    🎯 {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Custom Goal Form */}
            <div className="space-y-1.5">
              <div className="relative">
                <textarea
                  value={newGoalInput}
                  onChange={(e) => setNewGoalInput(e.target.value)}
                  placeholder={isRecording ? "Listening... Speak your goal clearly" : "Type your wellness goal details..."}
                  className={`w-full h-16 pt-2 pb-2 pl-3 ${speechSupported ? 'pr-12' : 'pr-3'} bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500 resize-none font-sans`}
                />
                {speechSupported && (
                  <button
                    type="button"
                    onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}
                    className={`absolute right-2.5 bottom-2.5 p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                      isRecording 
                        ? 'bg-rose-500 text-white animate-pulse shadow-md' 
                        : 'bg-teal-50 hover:bg-teal-100 text-teal-700'
                    }`}
                    title={isRecording ? "Stop dictation" : "Dictate your goal"}
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddNewRawGoal}
                disabled={!newGoalInput.trim()}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white disabled:bg-slate-200 text-[10.5px] font-bold uppercase tracking-wider transition rounded-xl flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Initialize Goal Draft
              </button>
            </div>
          </div>

          {/* Motivation vs. Discipline System Architect widget */}
          <div className="bg-white border text-left border-indigo-100 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Discipline System Architect</span>
                <span className="text-[9px] font-bold text-slate-400">Identity Mode</span>
              </div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Motivation vs. Discipline</h4>
              <p className="text-[10px] text-zinc-500 font-semibold leading-normal">
                Motivation is a volatile emotional state driven by active dopamine peaks. Discipline is a <strong>system of minimised friction</strong> that carries you through when raw willpower runs dry.
              </p>
            </div>

            <div className="premium-divider" />

            {/* Neuro-Stack Formulation Inputs */}
            <div className="space-y-2.5 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-[#52525b] uppercase tracking-wider">1. Anchor Cue (Existing Permanent Routine):</label>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold">After I...</span>
                  <input
                    type="text"
                    value={disciplineAnchor}
                    onChange={(e) => setDisciplineAnchor(e.target.value)}
                    className="bg-transparent border-none p-0 focus:ring-0 text-[11px] font-semibold flex-1 outline-none text-slate-800"
                    placeholder="pour my first morning tea"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-[#52525b] uppercase tracking-wider">2. Micro-Habit (Friction-Minimized action):</label>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold">I will...</span>
                  <input
                    type="text"
                    value={disciplineHabit}
                    onChange={(e) => setDisciplineHabit(e.target.value)}
                    className="bg-transparent border-none p-0 focus:ring-0 text-[11px] font-semibold flex-1 outline-none text-slate-800"
                    placeholder="breathe mindfully for 1 minute"
                  />
                </div>
              </div>
            </div>

            {/* Friction Defences Checklist */}
            <div className="space-y-2">
              <label className="text-[9px] font-extrabold text-[#52525b] uppercase tracking-wider block">3. Friction reduction safeguards:</label>
              
              <div className="space-y-1.5 text-[10px] font-semibold text-slate-700">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={frictionPrep}
                    onChange={(e) => setFrictionPrep(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  />
                  <span>Preparation Safeguard: I will set up visual/physical reminders beforehand (+30% Stability)</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={frictionMinute}
                    onChange={(e) => setFrictionMinute(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  />
                  <span>2-Minute Fast Rule: Starting takes fewer than 120 seconds of effort (+45% Stability)</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={frictionIdentity}
                    onChange={(e) => setFrictionIdentity(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  />
                  <span>Identity Bridge: Connects directly to who I am ("I am a calm, steady person") (+25% Stability)</span>
                </label>
              </div>
            </div>

            {/* Discipline Score Assessment Gauge */}
            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60">
              <div className="flex justify-between items-center text-[9px] font-bold text-indigo-950 uppercase tracking-wider mb-1">
                <span>System Resistance Rating:</span>
                <span className="font-mono text-xs font-black">
                  { (frictionPrep ? 30 : 0) + (frictionMinute ? 45 : 0) + (frictionIdentity ? 25 : 0) }% Stable
                </span>
              </div>
              <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-indigo-600 h-full transition-all duration-500"
                  style={{ width: `${(frictionPrep ? 30 : 0) + (frictionMinute ? 45 : 0) + (frictionIdentity ? 25 : 0)}%` }}
                />
              </div>
              <p className="text-[9px] text-indigo-900 mt-1.5 leading-normal italic font-medium">
                {((frictionPrep ? 30 : 0) + (frictionMinute ? 45 : 0) + (frictionIdentity ? 25 : 0)) === 100 
                  ? "🧠 Perfectly insulated! This discipline network has near-zero behavioral friction. No motivation required." 
                  : "💡 Try toggling more friction safeguards to make this system run seamlessly regardless of feelings."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onTriggerInteractionAlert) {
                  onTriggerInteractionAlert(
                    "🔒 Discipline Neurological System Locked!",
                    `Successfully converted your goal into an automated habit system: "After I ${disciplineAnchor}, I will immediately ${disciplineHabit}." Your baseline stability coefficient has increased from behavioral encapsulation!`
                  );
                }
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
            >
              Deploy Discipline Stack
            </button>
          </div>
        </div>

        {/* Right Panel: Detailed SMART breakdown & interactive steps (7 cols) */}
        {activeGoal ? (
          <div className="md:col-span-7 space-y-4">
            {/* Header & Delete Option */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-gray-800 font-sans">
                    {activeGoal.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    <strong>Original Intent:</strong> "{activeGoal.rawGoalText}"
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteGoal(activeGoal.id)}
                  className="p-1 px-1.5 border border-slate-100 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 transition cursor-pointer"
                  title="Abandon Goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action alert if not optimized */}
              {activeGoal.isCustomRaw && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-2">
                  <p className="text-[10px] font-bold leading-relaxed">
                    🌟 <strong>Optimize Draft Goal:</strong> Let Gemini evaluate this intention and structure details for Specificity, Measurement, and biological relevance.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOptimizeWithAI(activeGoal.id)}
                    disabled={isOptimizing}
                    className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 focus:ring-1 ring-amber-500 text-white font-extrabold text-[10px] rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-300"
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Refining Goal with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Optimize with AI Cognitive Coach
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Interactive S-M-A-R-T Grid system */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  SMART Matrix Elements
                </span>

                <div className="grid grid-cols-5 gap-1">
                  {(['S', 'M', 'A', 'R', 'T'] as const).map((letter) => {
                    const isBadgeActive = activeBadgeInfo === letter;
                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => setActiveBadgeInfo(isBadgeActive ? null : letter)}
                        className={`py-2 border text-center transition duration-200 cursor-pointer rounded-xl flex flex-col items-center justify-center gap-0.5 ${
                          isBadgeActive
                            ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-100/80 text-teal-800'
                        }`}
                      >
                        <span className="text-xs font-black">{letter}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Criterion Expand Window */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10.5px] leading-relaxed transition-all min-h-[50px] relative">
                  {activeBadgeInfo ? (
                    <div className="space-y-1">
                      <span className="font-extrabold text-teal-900 block uppercase text-[10px] tracking-wider">
                        ⭐ {SMART_CRITERIA_EXPLANATIONS[activeBadgeInfo].term} Criterion Guide:
                      </span>
                      <p className="text-slate-600 font-semibold text-[10px]">
                        {SMART_CRITERIA_EXPLANATIONS[activeBadgeInfo].desc}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-400">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-[9.5px]">Click any SMART badge letter above to reveal behavioral coaching guidelines.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Breakdown Fields */}
              <div className="space-y-2.5 border-t border-slate-50 pt-4">
                {[
                  { label: "📍 Specific Pacing (S)", val: activeGoal.s_specific, color: "text-slate-800 bg-slate-100/50" },
                  { label: "📊 Measurement Metric (M)", val: activeGoal.m_measurable, color: "text-slate-800 bg-slate-100/50" },
                  { label: "⚡ Action Trigger (A)", val: activeGoal.a_actionable, color: "text-slate-800 bg-slate-100/50" },
                  { label: "🧠 Psychological Relevance (R)", val: activeGoal.r_relevant, color: "text-slate-800 bg-slate-100/50" },
                  { label: "📅 Timeframe Trial Limit (T)", val: activeGoal.t_timebound, color: "text-slate-800 bg-slate-100/50" },
                ].map((item, index) => (
                  <div key={index} className="space-y-1 p-2.5 bg-slate-50/40 rounded-xl border border-slate-100/60">
                    <span className="text-[10px] font-black text-slate-700 block">{item.label}</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                      {item.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro Action Plan Checklist */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest font-sans">
                    Therapeutic Micro Action Plan
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold block">Tick off these tiny items to cement your self-care pathway</span>
                </div>
                <div className="p-1 px-1.5 bg-slate-100 rounded-lg text-slate-600 text-[10px] font-black font-mono">
                  {activeGoal.completedSteps.filter(Boolean).length}/4 Done
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-100">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300" 
                  style={{ width: `${(activeGoal.completedSteps.filter(Boolean).length / 4) * 100}%` }} 
                />
              </div>

              <div className="space-y-2">
                {activeGoal.actionPlan.map((step, idx) => {
                  const isChecked = activeGoal.completedSteps[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleStepCompleted(activeGoal.id, idx)}
                      className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition duration-150 flex items-start gap-3 cursor-pointer group"
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isChecked 
                          ? 'bg-teal-600 border-teal-600 text-white' 
                          : 'border-slate-300 group-hover:border-slate-400'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <span className={`text-[11px] leading-relaxed block font-semibold ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          Step {idx + 1}: {step}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* AI Coping Shield */}
              {activeGoal.aiCopingTip && (
                <div className="p-3.5 bg-teal-50/50 border border-teal-100/50 rounded-2xl space-y-1">
                  <span className="text-[10px] font-black text-teal-900 block uppercase tracking-wider">
                    💡 AI Clinical Coping Shield:
                  </span>
                  <p className="text-[10.5px] text-teal-800 leading-normal font-semibold italic">
                    "{activeGoal.aiCopingTip}"
                  </p>
                </div>
              )}
            </div>

            {/* Milestone Push-Notification Scheduler Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="space-y-0.5 text-left">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600 animate-pulse" />
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest font-sans">
                    Push-Notification Reminders
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block">Set specific hourly alarms for individual goal milestone steps</span>
              </div>

              {/* Set Reminder controls */}
              <div className="bg-slate-50/50 border border-slate-100/80 rounded-xl p-3.5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <label htmlFor="reminder-target-select" className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Target Milestone Step</label>
                    <select
                      id="reminder-target-select"
                      value={selectedRemStep}
                      onChange={(e) => setSelectedRemStep(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:outline-none focus:border-teal-500 rounded-lg text-[11px] font-semibold text-slate-700"
                    >
                      <option value="overall">🎯 Overall Goal Practice</option>
                      {activeGoal.actionPlan.map((step, idx) => (
                        <option key={idx} value={String(idx)}>⏰ Step {idx + 1}: {step.slice(0, 30)}...</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="reminder-time-input" className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Daily Alarm Time</label>
                    <input
                      id="reminder-time-input"
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:outline-none focus:border-teal-500 rounded-lg text-[11px] font-semibold text-slate-700 text-neutral-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleScheduleReminder}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 border border-slate-800 shadow-sm text-white text-[10px] uppercase font-black tracking-wider transition rounded-lg hover:shadow-md flex items-center gap-1.5 cursor-pointer animate-none"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Secure Milestone Alarm
                  </button>
                </div>
              </div>

              {/* Scheduled Reminders List for this goal */}
              <div className="space-y-2 text-left">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Active Goal Alarms ({activityReminders.filter(r => r.id.startsWith("smart-goal-" + activeGoal.id)).length})</span>

                <div className="space-y-2">
                  {activityReminders.filter(r => r.id.startsWith("smart-goal-" + activeGoal.id)).map((reminder) => (
                    <div 
                      key={reminder.id} 
                      className="p-3 bg-slate-50 border border-slate-100 hover:border-teal-200 rounded-xl flex items-center justify-between gap-3 text-xs transition"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="font-extrabold text-slate-800 block truncate">
                          {reminder.activity}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-teal-700 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded font-mono">
                            ⏰ {reminder.time}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 font-sans">
                            {reminder.enabled ? "Active Daily Dispatch" : "Silenced"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Status Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleReminder(reminder.id)}
                          className={`w-8 h-4.5 rounded-full p-0.5 transition-colors relative cursor-pointer ${
                            reminder.enabled ? 'bg-teal-600' : 'bg-slate-300'
                          }`}
                          style={{
                            backgroundColor: reminder.enabled ? '#0d9488' : '#cbd5e1'
                          }}
                        >
                          <div 
                            className="bg-white w-3.5 h-3.5 rounded-full shadow-md transition-all absolute top-0.5 animate-none"
                            style={{
                              left: reminder.enabled ? '16px' : '2px'
                            }}
                          />
                        </button>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg border border-transparent hover:border-rose-100 transition cursor-pointer"
                          title="Remove reminder"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {activityReminders.filter(r => r.id.startsWith("smart-goal-" + activeGoal.id)).length === 0 && (
                    <div className="p-4 text-center border border-dashed border-slate-200/80 rounded-xl text-slate-400 text-[10.5px]">
                      No active reminder alarms configured for this goal. Set a milestone step time above to test our live push worker!
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="md:col-span-12 py-12 text-center bg-white border border-slate-100 rounded-3xl text-slate-400 space-y-2">
            <Target className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold">You have no active wellness goals.</p>
            <p className="text-[10px]">Create or select a generic raw goal draft in the left panel to begin.</p>
          </div>
        )}

      </div>

      {/* Interactive Framer Motion Confetti & Celebration Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
        <AnimatePresence>
          {confettiBurst.map((p) => (
            <motion.div
              key={p.id}
              initial={{ 
                opacity: 1, 
                y: -40, 
                x: `${p.left}vw`, 
                rotate: 0, 
                scale: 0.2 
              }}
              animate={{ 
                opacity: [0, 1, 1, 0.8, 0],
                y: window.innerHeight ? window.innerHeight + p.yDrop : 800,
                x: `${p.left}vw`,
                marginLeft: p.xOffset,
                rotate: p.rotate, 
                scale: [0.2, 1.2, 1, 0.8, 0.6] 
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: p.duration, 
                delay: p.delay, 
                ease: "easeOut" 
              }}
              className="absolute animate-none"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === 'circle' ? '50%' : undefined,
                clipPath: p.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
              }}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {confettiBurst.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/15 backdrop-blur-[1.5px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.3, y: 120, rotate: -15 }}
                animate={{ 
                  opacity: [0, 1, 1, 1, 0], 
                  scale: [0.3, 1.15, 1, 1, 0.75], 
                  y: [120, -15, 0, 0, -80],
                  rotate: [-15, 5, 0, 0, 12]
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 3.5, ease: "easeInOut" }}
                className="bg-white/95 backdrop-blur-md border-2 border-emerald-500 rounded-3xl p-6 shadow-[0_20px_50px_rgba(16,185,129,0.35)] text-center flex flex-col items-center gap-2.5 max-w-sm pointer-events-auto"
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.25, 1],
                    rotate: [0, 360, 360]
                  }}
                  transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
                  className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-300"
                >
                  <Award className="w-8 h-8 stroke-[2.5px]" />
                </motion.div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest font-mono block">
                    Deep Coherence Achieved 🏆
                  </span>
                  <h4 className="text-base font-black text-slate-800 leading-tight">
                    Goal Fully Completed!
                  </h4>
                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                    Congratulations! You've checked off every micro-step in your wellness goal blueprint. Keep up this stunning progress!
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
