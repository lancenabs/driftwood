import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Check, Flame, Plus, Trash2, ArrowRight, AlertCircle, Info, BookOpen, Clock, Lightbulb, Zap, Shield,
  Smile, Frown, Meh, Wind, Anchor, Users, Compass
} from 'lucide-react';

interface HabitStack {
  id: string;
  triggerHabit: string; // "After I..." (e.g., pour my morning tea)
  targetHabit: string;  // "I will..." (e.g., breathe mindfully for 3 minutes)
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  streak: number;
  completedToday: boolean;
  notes?: string;
}

const MOOD_DATA_MAP: Record<number, { label: string; icon: any; color: string; bgColor: string; borderColor: string; description: string }> = {
  1: { label: 'Low/Anxious', icon: Frown, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', description: 'Gently ground your nervous system. Prioritize physical comfort and safety.' },
  2: { label: 'Down/Heavy', icon: Frown, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', description: 'Introduce highly gentle activation cues. Reduce resistance to take one tiny action.' },
  3: { label: 'Neutral/Okay', icon: Meh, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-[#fef08a]/40', description: 'Calibrate your daily baseline. Anchor positive intentions for structural focus.' },
  4: { label: 'Good/Steady', icon: Smile, color: 'text-teal-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-200', description: 'Expand your perspective. Direct steady optimism into behavioral gratitude loops.' },
  5: { label: 'Great/Inspired', icon: Smile, color: 'text-emerald-600', bgColor: 'bg-[#ecfdf5]', borderColor: 'border-emerald-200', description: 'Capitalize on peak dopamine. Set bold intentions or manifest strategic SMART milestones.' }
};

const MOOD_SUGGESTIONS_MAP: Record<number, Array<{
  title: string;
  defaultTrigger: string;
  description: string;
  benefit: string;
  icon: any;
}>> = {
  1: [
    {
      title: "do slow box-breathing for 2 minutes (4-4-4s model)",
      defaultTrigger: "feel anxiety building or sit down at my desk",
      description: "Proven to immediately lower heart rate and calm overstimulated adrenal receptors.",
      benefit: "Soothes acute stress signaling instantly",
      icon: Wind
    },
    {
      title: "take a brief 5-minute offline steps walk",
      defaultTrigger: "close my laptop for a midday break",
      description: "Generates bilateral optical stimulation which calms the brain's alarm network.",
      benefit: "Breaks repetitive negative cognitive loops",
      icon: Sparkles
    }
  ],
  2: [
    {
      title: "do a gentle neck and shoulder release stretch",
      defaultTrigger: "finish a long work task or sit back",
      description: "Somatic release targets areas where our bodies carry ancestral stress and emotional defensiveness.",
      benefit: "Releases trapped somatic rigidity",
      icon: Shield
    },
    {
      title: "write 1 automated negative thought on the CBT board",
      defaultTrigger: "catch myself overthinking or sighing",
      description: "Externalizing worries makes them objectifiable, preventing raw identification with sorrow.",
      benefit: "Boosts objectivity and mental relief",
      icon: BookOpen
    }
  ],
  3: [
    {
      title: "drink a full glass of refreshing water",
      defaultTrigger: "stand up from my workspace to rest",
      description: "Hydration immediately clears mild chemical tiredness and boosts cellular ATP output.",
      benefit: "Restores clean cognitive hydration status",
      icon: Zap
    },
    {
      title: "complete a 2-minute somatic breathing alignment check",
      defaultTrigger: "first open my computer browser in the morning",
      description: "Connect to the support of the solid ground below before high focus intervals.",
      benefit: "Locks in clean focus and nervous system stability",
      icon: Anchor
    }
  ],
  4: [
    {
      title: "express 3 rapid blessings on the Gratitude tab",
      defaultTrigger: "close my evening work or chores list",
      description: "Practicing deliberate appreciation rewires the neural pathways to scan for abundance.",
      benefit: "Actively combats genetic negativity fatigue",
      icon: Sparkles
    },
    {
      title: "send an uplifting message to someone I care about",
      defaultTrigger: "first unlock my phone after lunch",
      description: "Social cohesion behavior stimulates warm oxytocin flow, lowering baseline cortisol.",
      benefit: "Reinforces supportive relationship bridges",
      icon: Users
    }
  ],
  5: [
    {
      title: "flesh out details of 1 custom SMART goal milestone",
      defaultTrigger: "wake up with high excited clarity",
      description: "Channeling a surge of dopamine into specific planning turns motivation into strategic habit momentum.",
      benefit: "Transfers raw excitement into concrete actions",
      icon: Clock
    },
    {
      title: "project current polarizing feelings onto the Sand Tray",
      defaultTrigger: "complete my core visual goal of the day",
      description: "Unleash ultimate expressive and creative potential while in an unburdened psychological peak.",
      benefit: "Explores unconscious archetypal symbolism",
      icon: Compass
    }
  ]
};

interface HabitLabProps {
  onTriggerInteractionAlert: (title: string, body: string) => void;
}

export default function HabitLab({ onTriggerInteractionAlert }: HabitLabProps) {
  const [habitStacks, setHabitStacks] = useState<HabitStack[]>(() => {
    const saved = localStorage.getItem('therapy_habit_lab_stacks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback below
      }
    }
    return [
      {
        id: 'stack-1',
        triggerHabit: 'pour my morning tea',
        targetHabit: 'sit peacefully and write down 1 gratitude entry',
        timeOfDay: 'morning',
        streak: 5,
        completedToday: true,
        notes: 'Keep journal right next to the kettle as a visual cue.'
      },
      {
        id: 'stack-2',
        triggerHabit: 'close my laptop after work',
        targetHabit: 'stretch my neck and take 3 deep somatic breaths',
        timeOfDay: 'afternoon',
        streak: 3,
        completedToday: false,
        notes: 'Friction reduction: Stand up immediately.'
      }
    ];
  });

  // State for the Habit Formula Constructor
  const [newTrigger, setNewTrigger] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newTime, setNewTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [newCueNotes, setNewCueNotes] = useState('');

  // Mood-Sync features state
  const [currentMoodScore, setCurrentMoodScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('therapy_mood_logs');
      if (saved) {
        const logs = JSON.parse(saved);
        if (Array.isArray(logs) && logs.length > 0) {
          const sorted = [...logs].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const score = Number(sorted[0].score);
          if (score >= 1 && score <= 5) return score;
        }
      }
    } catch (e) {}
    return 3; // Neutral default
  });

  // Track edits to individual suggestion triggers
  const [suggestionTriggers, setSuggestionTriggers] = useState<Record<string, string>>({});

  const handleAdoptSuggestion = (title: string, defaultTrigger: string) => {
    const trigger = (suggestionTriggers[title] !== undefined ? suggestionTriggers[title] : defaultTrigger).trim();
    if (!trigger) {
      onTriggerInteractionAlert("⚠️ Trigger Required", "Please set an anchoring trigger action (e.g. 'After I stretch') so your brain can index the new habit loop!");
      return;
    }

    const newStack: HabitStack = {
      id: `stack-${Date.now()}`,
      triggerHabit: trigger,
      targetHabit: title,
      timeOfDay: 'afternoon',
      streak: 0,
      completedToday: false,
      notes: 'Formulated via Mood-Sync Suggestion Engine'
    };

    setHabitStacks(prev => [newStack, ...prev]);
    onTriggerInteractionAlert("🌟 Mood-Synced Routine Stacked!", `"${title}" has been successfully added as a routine following your cue: "After I ${trigger}".`);
  };

  // Daily Quick Quiz or Knowledge challenge state on cognitive habit formation
  const [quizAnsweredId, setQuizAnsweredId] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Synchronize to localStorage
  useEffect(() => {
    localStorage.setItem('therapy_habit_lab_stacks', JSON.stringify(habitStacks));
  }, [habitStacks]);

  const handleCreateStack = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTrigger = newTrigger.trim();
    const cleanTarget = newTarget.trim();

    if (!cleanTrigger || !cleanTarget) {
      onTriggerInteractionAlert("⚠️ Setup Incomplete", "Please define both your anchoring trigger habit and your new positive target habit.");
      return;
    }

    const newStack: HabitStack = {
      id: `stack-${Date.now()}`,
      triggerHabit: cleanTrigger,
      targetHabit: cleanTarget,
      timeOfDay: newTime,
      streak: 0,
      completedToday: false,
      notes: newCueNotes.trim() || undefined
    };

    setHabitStacks(prev => [newStack, ...prev]);
    setNewTrigger('');
    setNewTarget('');
    setNewCueNotes('');
    
    onTriggerInteractionAlert("🌿 Habit Chain Created", "Your new habit stack has been formulated! Setting clear cues is proven to increase compliance by 200%.");
  };

  const handleToggleComplete = (id: string) => {
    setHabitStacks(prev => prev.map(stack => {
      if (stack.id === id) {
        const nextCompleted = !stack.completedToday;
        return {
          ...stack,
          completedToday: nextCompleted,
          streak: nextCompleted ? stack.streak + 1 : Math.max(0, stack.streak - 1)
        };
      }
      return stack;
    }));
  };

  const handleDeleteStack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHabitStacks(prev => prev.filter(s => s.id !== id));
  };

  const handleResetDaily = () => {
    setHabitStacks(prev => prev.map(s => ({ ...s, completedToday: false })));
    onTriggerInteractionAlert("🔄 Reset Completed", "All habits successfully unlocked for a fresh 24-hour cycle. Stay consistent!");
  };

  // Static learning cards for habit loops
  const learningKeypoints = [
    {
      title: "1. Cue (The Anchor)",
      desc: "Your trigger should be something you already do without thinking every day, like brushing teeth, boiling tea, or opening the laptop.",
      icon: Clock,
      color: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      title: "2. Friction Framing",
      desc: "To start a good habit, reduce the steps needed (make it simple). To break a bad habit, increase the steps (put phone in another room).",
      icon: Zap,
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      title: "3. Tiny Rewards",
      desc: "Reward yourself immediately with a tiny sense of completion. Checking a box off or whispering 'Well done' wires the habit loop in your brain.",
      icon: Sparkles,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200"
    }
  ];

  const quizQuestions = [
    {
      id: 1,
      q: "According to behavioral research, what is the most effective way to adopt a new meditative routine?",
      options: [
        "A. Meditating randomly for 1 hour once a week when you feel extremely stressed.",
        "B. Stacking a brief 3-minute session immediately after an established, daily anchor habit.",
        "C. Relying entirely on sudden spurts of mental willpower."
      ],
      correct: 1, // index 1 is B
      explanation: "Daily habits grow strongest when anchored onto automatic 'trigger' behaviors. Keeping it small (3 mins) reduces cognitive resistance."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Introduction Banner explaining the neuroscience */}
      <div className="bg-white rounded-3xl p-5 border border-[#F0F0F0] relative overflow-hidden" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-black tracking-widest uppercase block px-2.5 py-0.5 rounded-full w-fit" style={{ background: '#6366F118', color: '#4338CA' }}>
            Neuroplasticity 🧠
          </span>
          <h3 className="font-sans text-base font-bold" style={{ color: '#3C3C3C' }}>The Science of CBT Habit Loops</h3>
          <p className="text-[11px] leading-relaxed max-w-lg" style={{ color: '#6B7280' }}>
            Neuroscientists have discovered that our brains learn habits using <strong style={{ color: '#3C3C3C' }}>anchor chains</strong>. Instead of fighting willpower, we wire healthy habits directly into existing synaptic pathways.
          </p>
        </div>
        <div className="absolute top-4 right-4 pointer-events-none select-none" style={{ color: '#6366F112' }}>
          <BookOpen className="w-24 h-24 stroke-[1]" />
        </div>
      </div>

      {/* 🧠 Mood-Sync Habit Advisor Card */}
      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200/80 space-y-4 text-left" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>🧠 Mood-Sync Habit Advisor</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Explore custom-curated CBT and Somatic micro-habits optimized specifically for your emotional state.
            </p>
          </div>

          {/* Active indicator showing where the current mood lands */}
          <div className="shrink-0 flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-slate-200 self-start sm:self-auto" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
            <span className="text-[10px] font-black text-slate-400 font-mono tracking-wider">LATEST MOOD:</span>
            <div className={`flex items-center gap-1.5 text-[11px] font-extrabold ${MOOD_DATA_MAP[currentMoodScore]?.color || 'text-slate-600'}`}>
              {MOOD_DATA_MAP[currentMoodScore] && React.createElement(MOOD_DATA_MAP[currentMoodScore].icon, { className: "w-3.5 h-3.5" })}
              <span>{MOOD_DATA_MAP[currentMoodScore]?.label || 'Neutral'}</span>
            </div>
          </div>
        </div>

        {/* Live Simulator selector so the user can easily toggle the mood level to see differences */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block">
            Adapt Recommendations for Feeling State:
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((level) => {
              const meta = MOOD_DATA_MAP[level];
              const isSelected = currentMoodScore === level;
              const Icon = meta.icon;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setCurrentMoodScore(level)}
                  className={`p-2 border rounded-xl transition flex flex-col items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95 min-h-[40px] ${
                    isSelected
                      ? `bg-white border-indigo-400 ring-2 ring-indigo-100`
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                  style={isSelected ? { boxShadow: '0 3px 14px rgba(0,0,0,0.05)' } : undefined}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? meta.color : 'text-slate-400'}`} />
                  <span className={`text-[10px] font-extrabold tracking-tight truncate leading-none ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                    {meta.label.split('/')[0]}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 font-bold italic pl-1">
            🌿 Goal focus: {MOOD_DATA_MAP[currentMoodScore]?.description}
          </p>
        </div>

        {/* Render suggestions for the selected score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {MOOD_SUGGESTIONS_MAP[currentMoodScore]?.map((sug) => {
            const SugIcon = sug.icon;
            // Get current trigger value or default
            const triggerVal = suggestionTriggers[sug.title] !== undefined 
              ? suggestionTriggers[sug.title] 
              : sug.defaultTrigger;
            
            return (
              <div
                key={sug.title}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all duration-200"
                style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 shrink-0">
                      <SugIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide leading-tight">
                      {sug.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal font-semibold">
                    {sug.description}
                  </p>
                  <div className="text-[10px] font-black text-rose-500 bg-rose-50 rounded px-1.5 py-0.5 w-fit uppercase tracking-wider">
                    ⚡ {sug.benefit}
                  </div>
                </div>

                {/* Micro Constructor inline editing of the trigger anchoring action */}
                <div className="space-y-2.5 pt-2.5 border-t border-slate-100/80">
                  <div className="text-[10px] leading-relaxed">
                    <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-widest block">1. Define Anchor Cue:</span>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 px-2.5 rounded-xl border border-slate-200 mt-1">
                      <span className="text-slate-500 font-bold whitespace-nowrap text-[11px]">After I:</span>
                      <input
                        type="text"
                        value={triggerVal}
                        onChange={(e) => {
                          setSuggestionTriggers({
                            ...suggestionTriggers,
                            [sug.title]: e.target.value
                          });
                        }}
                        className="bg-transparent border-none outline-none text-slate-800 font-bold text-xs p-0 w-full focus:ring-0 leading-tight italic"
                        placeholder="Anchor event..."
                      />
                    </div>
                  </div>

                  <div className="text-[10px] leading-relaxed">
                    <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-widest block">2. Positive Response Outcome:</span>
                    <div className="text-slate-800 font-bold bg-indigo-50/40 p-2 rounded-xl mt-1 border border-indigo-100/60 text-[11px]">
                      I will: <span className="font-extrabold text-indigo-700">{sug.title}</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ y: 2, boxShadow: 'none' }}
                    type="button"
                    onClick={() => handleAdoptSuggestion(sug.title, sug.defaultTrigger)}
                    className="w-full py-2.5 text-white rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #4338CA)', boxShadow: '0 4px 0 #3730A3' }}
                  >
                    <span>+ Integrate Routine Stack</span>
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit Stack Formula Board */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 block">Active Habit Stacks</span>

        {habitStacks.length === 0 ? (
          <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
            <Info className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
            <p className="text-[11px] text-gray-500 font-bold">No active habit formulas compiled yet.</p>
            <p className="text-[11px] text-gray-400">Construct your first behavioral stack using the builder below!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {habitStacks.map((stack) => (
              <div
                key={stack.id}
                onClick={() => handleToggleComplete(stack.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                  stack.completedToday
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3 items-start flex-1">
                    <button
                      type="button"
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border mt-0.5 transition-colors ${
                        stack.completedToday 
                          ? 'bg-emerald-600 border-transparent text-white' 
                          : 'bg-white border-zinc-300 group-hover:border-zinc-500'
                      }`}
                    >
                      {stack.completedToday && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="space-y-1 text-left">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] tracking-wider uppercase font-black font-mono text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">
                          {stack.timeOfDay}
                        </span>
                        {stack.streak > 0 && (
                          <span className="text-[10px] font-black text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 flex items-center gap-0.5">
                            <Flame className="w-3 h-3 text-amber-500 fill-current animate-pulse" />
                            <span>{stack.streak} Day Streak</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs leading-relaxed font-semibold">
                        <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">After I:</span>{" "}
                        <span className="text-slate-700 italic">{stack.triggerHabit}</span>
                        <br />
                        <span className="text-rose-500 font-extrabold uppercase text-[10px] tracking-wider">I will:</span>{" "}
                        <strong className="text-slate-900 font-black">{stack.targetHabit}</strong>
                      </div>

                      {stack.notes && (
                        <p className="text-[11px] text-slate-400 font-medium pl-1.5 border-l border-slate-300">
                          💡 <em>Cue Friction: {stack.notes}</em>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteStack(stack.id, e)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-red-500 transition shrink-0 -mt-1.5 -mr-1.5"
                    title="Delete Stack"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleResetDaily}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200 min-h-[40px]"
              >
                <span>🔄 Reset All Checklist Daily Unlock</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Habit Stack Formula Builder (CBT Toolkit) */}
      <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4 text-left">
        <div className="space-y-1">
          <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Habit Stack Formula Builder</span>
          </h4>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
            Construct a CBT micro-habit. We define a highly clear daily physical anchor, then chain the healthy action immediately behind it.
          </p>
        </div>

        <form onSubmit={handleCreateStack} className="space-y-3.5 pt-1">
          {/* 1. Trigger */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              1. Anchoring Trigger Habit (Something you already do daily)
            </label>
            <input
              type="text"
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              placeholder="e.g. pour my morning cup of coffee / shut down my work computer"
              className="w-full text-xs font-semibold py-2 px-3.5 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-800"
              required
            />
          </div>

          {/* 2. Target */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              2. New Positive Target Habit (Keep it under 5 minutes to stay easy)
            </label>
            <input
              type="text"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              placeholder="e.g. stretch my spine for 2 minutes / list 3 rapid things I am grateful for"
              className="w-full text-xs font-semibold py-2 px-3.5 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-800"
              required
            />
          </div>

          {/* Time & Friction Notes in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                3. Approximate Time
              </label>
              <select
                value={newTime}
                onChange={(e: any) => setNewTime(e.target.value)}
                className="w-full text-xs font-bold py-2 px-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 outline-none text-slate-700"
              >
                <option value="morning">🌅 Morning Cue</option>
                <option value="afternoon">☀️ Afternoon Cue</option>
                <option value="evening">🌙 Evening Cue</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                4. Reduce Friction Trick (Visual cue placement)
              </label>
              <input
                type="text"
                value={newCueNotes}
                onChange={(e) => setNewCueNotes(e.target.value)}
                placeholder="e.g. I will put my yoga mat out night before / close other tabs"
                className="w-full text-xs font-semibold py-2 px-3.5 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-900 text-white rounded-xl text-xs font-black hover:bg-indigo-800 transition shadow-sm active:scale-97 cursor-pointer block text-center"
          >
            + Register Custom Habit Stack Formula
          </button>
        </form>
      </div>

      {/* Interactive Habit Loops Learning Points */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Behavioral Physics Cheat Sheet</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {learningKeypoints.map((pt, idx) => {
            const IconComponent = pt.icon;
            return (
              <div 
                key={idx}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-1.5 ${pt.color}`}
              >
                <div className="flex justify-between items-center w-full">
                  <h5 className="text-[11px] font-black uppercase tracking-wide">{pt.title}</h5>
                  <IconComponent className="w-3.5 h-3.5 text-current shrink-0" />
                </div>
                <p className="text-[10px] leading-relaxed font-semibold opacity-90">{pt.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* mini habit quiz interactive task */}
      <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 text-left space-y-3">
        <div className="flex gap-2 items-center">
          <Lightbulb className="w-4 h-4 text-indigo-700 shrink-0" />
          <h5 className="text-xs font-black text-indigo-900 uppercase tracking-wide">Quick CBT Habit Quiz</h5>
        </div>
        
        {quizAnsweredId === null ? (
          <div className="space-y-3">
            <p className="text-[11.5px] font-semibold text-indigo-950">
              {quizQuestions[0].q}
            </p>
            <div className="space-y-1.5">
              {quizQuestions[0].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => {
                    setQuizAnsweredId(oIdx);
                    if (oIdx === quizQuestions[0].correct) {
                      setQuizScore(1);
                    } else {
                      setQuizScore(0);
                    }
                  }}
                  className="w-full py-2 px-3 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition rounded-xl text-[10.5px] font-bold text-slate-700 text-left cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-black px-2 py-0.5 rounded-md ${quizScore === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {quizScore === 1 ? '🎉 Correct!' : '❌ Let\'s Learn This'}
              </span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
              {quizQuestions[0].explanation}
            </p>
            <button
              onClick={() => setQuizAnsweredId(null)}
              className="text-[10px] font-bold text-indigo-900 hover:underline cursor-pointer"
            >
              Take Quiz Again
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
