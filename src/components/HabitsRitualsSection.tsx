import React, { useState, useEffect } from 'react';
import { Heart, Check, Flame, Award, BookOpen, Sparkles, HelpCircle, CheckSquare, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from './SwitchUserBar';
import GratitudeJar from './GratitudeJar';

interface Habit {
  id: string;
  name: string;
  description: string;
  emoji: string;
  xpValue: number;
}

const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', name: '6-Second Kiss', description: 'Gottman connection physical anchor ritual.', emoji: '💋', xpValue: 15 },
  { id: 'h2', name: 'Express Appreciation', description: 'Verbally appreciate a specific deed or attribute.', emoji: '❤️', xpValue: 10 },
  { id: 'h3', name: 'No Phones at Dinner', description: 'Intentional barrier against virtual intrusion.', emoji: '📵', xpValue: 20 },
  { id: 'h4', name: 'Active Listening (10m)', description: 'Summarize what partner says before you speak.', emoji: '🤝', xpValue: 25 },
  { id: 'h5', name: 'Stress-Reducing Chat', description: 'Decompress together without trying to solve problems.', emoji: '🛋️', xpValue: 15 },
];

const LOVE_MAPS_QUESTIONS = [
  "What is your partner's biggest current stressor outside your relationship?",
  "Who are two of your partner's closest friends, and what are they currently dealing with?",
  "What is a personal dream or project your partner would love to start this year?",
  "What is your partner's favorite way to decompress after an exhausting day?",
  "What is a minor detail of your partner's daily routine that has changed recently?",
  "What was your partner's happiest childhood memory?",
  "If your partner won $10,000, what is the first thing they would buy?"
];

interface HabitsRitualsSectionProps {
  currentUser: UserProfile;
  onAddMilestone: (title: string, emoji: string) => void;
}

export default function HabitsRitualsSection({ currentUser, onAddMilestone }: HabitsRitualsSectionProps) {
  // Habit tracking state (completed dates per user)
  const [completedHabits, setCompletedHabits] = useState<Record<string, { alex: boolean; taylor: boolean }>>(() => {
    try {
      const saved = localStorage.getItem('familyframe_habits_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      h1: { alex: true, taylor: false },
      h2: { alex: false, taylor: true },
      h3: { alex: false, taylor: false },
      h4: { alex: false, taylor: false },
      h5: { alex: true, taylor: true },
    };
  });

  const [activeRitual, setActiveRitual] = useState<'love-maps' | 'appreciation' | 'sotu' | 'gratitude-jar' | null>(null);
  const [randomQuestion, setRandomQuestion] = useState(LOVE_MAPS_QUESTIONS[0]);
  const [ritualInput, setRitualInput] = useState('');
  const [appreciationPartnerInput, setAppreciationPartnerInput] = useState('');
  const [appreciationText, setAppreciationText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('familyframe_habits_v1', JSON.stringify(completedHabits));
    } catch {}
  }, [completedHabits]);

  const handleToggleHabit = (habitId: string, partner: 'alex' | 'taylor') => {
    // Determine if toggle matches current signed-in user or if we are simulating
    const targetName = partner === 'alex' ? 'Alex' : 'Taylor';
    const isCurrentUser = currentUser.id === partner;

    setCompletedHabits(prev => {
      const current = prev[habitId] || { alex: false, taylor: false };
      const nextState = !current[partner];

      if (nextState) {
        const habit = DEFAULT_HABITS.find(h => h.id === habitId);
        const bonus = isCurrentUser ? '' : ' (Simulated Device)';
        triggerToast(`🎉 ${targetName} checked off '${habit?.name}'! +${habit?.xpValue || 10} XP${bonus}`);
        setXpEarned(x => x + (habit?.xpValue || 10));
      }

      return {
        ...prev,
        [habitId]: {
          ...current,
          [partner]: nextState
        }
      };
    });
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Launch Love Maps Ritual
  const startLoveMaps = () => {
    const randomIdx = Math.floor(Math.random() * LOVE_MAPS_QUESTIONS.length);
    setRandomQuestion(LOVE_MAPS_QUESTIONS[randomIdx]);
    setRitualInput('');
    setActiveRitual('love-maps');
  };

  const submitLoveMaps = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ritualInput.trim()) return;

    // Add milestone to history!
    onAddMilestone(`Completed Love Maps Update: Learned about partner's inner world 🗺️`, '🌱');
    
    triggerToast(`❤️ Love Maps Updated! Your therapist log has been synced. +50 XP!`);
    setXpEarned(x => x + 50);
    setActiveRitual(null);
  };

  // Launch Appreciations Swap Ritual
  const startAppreciations = () => {
    setAppreciationPartnerInput(currentUser.id === 'alex' ? 'Taylor' : 'Alex');
    setAppreciationText('');
    setActiveRitual('appreciation');
  };

  const submitAppreciations = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appreciationText.trim()) return;

    onAddMilestone(`Exchanged Appreciation: "${appreciationText.substring(0, 40)}..." ❤️`, '💖');

    triggerToast(`💖 Gratitude logged! Daily positive-sentiment override reinforced. +40 XP!`);
    setXpEarned(x => x + 40);
    setActiveRitual(null);
  };

  return (
    <div className="flex flex-col gap-4 text-on-surface">
      {/* Shared Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="bg-[#58CC02] text-white p-3.5 rounded-2xl text-[10px] font-sans font-black uppercase tracking-wider flex items-center gap-2 shadow-lg border border-green-400 z-50"
          >
            <Sparkles className="w-4.5 h-4.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-primary/5 p-3 rounded-2xl border-2 border-primary/20 text-[10.5px] leading-relaxed text-[#4B4B4B] flex items-start gap-1.5">
        <span className="text-base shrink-0">🤝</span>
        <p className="font-sans">
          <strong>Daily Co-op Habit Loop:</strong> Complete shared habits side-by-side. Perform clinical Gottman rituals together to accumulate XP tokens and de-escalate emotional distance.
        </p>
      </div>

      {/* Habits Card */}
      <div className="bg-white border-2 border-outline-variant p-4 rounded-[2rem] shadow-2xs flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-outline-variant pb-2">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-primary" />
            <span className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wider">Couples Habits Tracker</span>
          </div>
          <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
            +{xpEarned} XP Today
          </span>
        </div>

        {/* Habits Checklist Grid */}
        <div className="flex flex-col gap-3 mt-1">
          <div className="grid grid-cols-12 text-[8px] font-black uppercase tracking-wider text-on-surface-variant pb-1 border-b border-outline-variant/30 text-center">
            <div className="col-span-6 text-left">Behavior Habit</div>
            <div className="col-span-3">Alex's Check</div>
            <div className="col-span-3">Taylor's Check</div>
          </div>

          {DEFAULT_HABITS.map((habit) => {
            const status = completedHabits[habit.id] || { alex: false, taylor: false };
            return (
              <div key={habit.id} className="grid grid-cols-12 gap-1 items-center py-1">
                <div className="col-span-6">
                  <div className="flex items-start gap-1.5">
                    <span className="text-sm shrink-0">{habit.emoji}</span>
                    <div>
                      <h4 className="font-sans text-[10px] font-black text-[#4B4B4B] leading-tight">{habit.name}</h4>
                      <p className="font-sans text-[8px] text-on-surface-variant leading-relaxed">{habit.description}</p>
                    </div>
                  </div>
                </div>

                {/* Alex's toggle */}
                <div className="col-span-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleToggleHabit(habit.id, 'alex')}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                      status.alex
                        ? 'bg-primary border-primary text-white shadow-xs'
                        : 'bg-slate-50 border-outline-variant text-transparent hover:border-primary/50'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 stroke-[3.5px] ${status.alex ? 'text-white' : 'text-slate-300'}`} />
                  </button>
                </div>

                {/* Taylor's toggle */}
                <div className="col-span-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleToggleHabit(habit.id, 'taylor')}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                      status.taylor
                        ? 'bg-secondary border-secondary text-white shadow-xs'
                        : 'bg-slate-50 border-outline-variant text-transparent hover:border-secondary/50'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 stroke-[3.5px] ${status.taylor ? 'text-white' : 'text-slate-300'}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="font-sans text-[8.5px] text-on-surface-variant leading-relaxed text-center italic mt-1.5 border-t border-outline-variant/30 pt-2">
          💡 Tips: Change your signed-in profile using the Switch User Bar above to tick off checkmarks as Alex or Taylor.
        </p>
      </div>

      {/* Clinical Connection Rituals Selector */}
      <div className="bg-white border-2 border-outline-variant p-4 rounded-[2rem] shadow-2xs flex flex-col gap-3">
        <div className="flex items-center gap-1.5 border-b border-outline-variant pb-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />
          <span className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wider">Structured Gottman Rituals</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          {/* Love Maps Ritual Card */}
          <button
            type="button"
            onClick={startLoveMaps}
            className="bg-surface-container hover:bg-slate-100 border-2 border-outline-variant hover:border-primary/30 p-3 rounded-2xl transition-all cursor-pointer text-left flex flex-col gap-1 shadow-2xs"
          >
            <div className="flex justify-between items-center w-full">
              <span className="text-lg">🗺️</span>
              <span className="text-[7px] font-black bg-[#1CB0F6]/10 text-[#1CB0F6] border border-[#1CB0F6]/20 px-1.5 py-0.25 rounded">Gottman</span>
            </div>
            <h4 className="font-sans text-[10.5px] font-black text-[#4B4B4B] mt-1">Love Maps Update</h4>
            <p className="font-sans text-[8.5px] text-on-surface-variant leading-relaxed">
              Answer open-ended questions about your partner's inner world.
            </p>
          </button>

          {/* Appreciations Swapper */}
          <button
            type="button"
            onClick={startAppreciations}
            className="bg-surface-container hover:bg-slate-100 border-2 border-outline-variant hover:border-secondary/30 p-3 rounded-2xl transition-all cursor-pointer text-left flex flex-col gap-1 shadow-2xs"
          >
            <div className="flex justify-between items-center w-full">
              <span className="text-lg">💖</span>
              <span className="text-[7px] font-black bg-secondary/10 text-secondary border border-secondary/20 px-1.5 py-0.25 rounded">Positive</span>
            </div>
            <h4 className="font-sans text-[10.5px] font-black text-[#4B4B4B] mt-1">Appreciation Swap</h4>
            <p className="font-sans text-[8.5px] text-on-surface-variant leading-relaxed">
              Exchange structured gratitude to strengthen positive sentiment.
            </p>
          </button>
        </div>

        {/* Gratitude Jar & Family Sync Card (Full Width for High Engagement Visibility) */}
        <button
          type="button"
          onClick={() => setActiveRitual('gratitude-jar')}
          className="w-full bg-gradient-to-r from-teal-50/60 to-emerald-50/40 hover:from-teal-100/40 hover:to-emerald-100/40 border-2 border-teal-200 hover:border-teal-400 p-3.5 rounded-2xl transition-all cursor-pointer text-left flex justify-between items-center shadow-3xs mt-1"
        >
          <div className="flex gap-3 items-center min-w-0">
            <span className="text-2xl bg-white border border-teal-100 p-1.5 rounded-xl shadow-xs shrink-0">🫙</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-display font-black text-xs text-stone-800">Weekly Gratitude Jar</h4>
                <span className="text-[6.5px] font-black bg-teal-100 text-teal-800 border border-teal-200 px-1.5 py-0.25 rounded uppercase tracking-wider">
                  Family Sync Ritual
                </span>
              </div>
              <p className="font-sans text-[9px] text-stone-500 leading-normal mt-0.5 line-clamp-2">
                Deposit secret appreciations throughout the week, then click to unlock, read aloud, and hug during your Family Sync!
              </p>
            </div>
          </div>
          <ChevronRight size={14} className="text-teal-600 shrink-0 ml-2" />
        </button>
      </div>

      {/* Interactive Ritual Popups */}
      <AnimatePresence>
        {activeRitual === 'love-maps' && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border-2 border-outline-variant shadow-2xl p-5 w-full max-w-[320px] flex flex-col gap-3.5 text-[#4B4B4B]"
            >
              <div className="text-center border-b border-outline-variant pb-2">
                <span className="text-base">🗺️</span>
                <h3 className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wide">Love Maps Interactive Guide</h3>
                <p className="font-sans text-[8.5px] text-on-surface-variant mt-0.5">Build a map of your spouse's current life details.</p>
              </div>

              <div className="bg-primary/5 p-3 rounded-xl border border-primary/20 text-center">
                <span className="text-[7.5px] font-black uppercase text-primary tracking-wider block mb-1">Therapist Core Question:</span>
                <p className="font-sans text-[10.5px] font-bold text-on-surface leading-normal">
                  "{randomQuestion}"
                </p>
              </div>

              <form onSubmit={submitLoveMaps} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">What was their response?</label>
                  <textarea
                    required
                    value={ritualInput}
                    onChange={(e) => setRitualInput(e.target.value)}
                    placeholder="E.g., Taylor's biggest current stressor is the upcoming Q3 project launch and teammate transitions..."
                    className="w-full bg-slate-50 text-[10px] p-2.5 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-sans h-16 resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveRitual(null)}
                    className="bg-white text-[#4B4B4B] text-[9.5px] px-3.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white text-[9.5px] px-4 py-1.5 rounded-xl border-b-[3px] border-primary-dark font-black uppercase tracking-wider cursor-pointer"
                  >
                    Complete Ritual
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {activeRitual === 'appreciation' && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border-2 border-outline-variant shadow-2xl p-5 w-full max-w-[320px] flex flex-col gap-3.5 text-[#4B4B4B]"
            >
              <div className="text-center border-b border-outline-variant pb-2">
                <span className="text-base">💖</span>
                <h3 className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wide">Structured Appreciation Swap</h3>
                <p className="font-sans text-[8.5px] text-on-surface-variant mt-0.5">Reinforce specific, positive behaviors.</p>
              </div>

              <div className="bg-secondary/5 p-3 rounded-xl border border-secondary/20 text-center text-on-surface text-[10px] leading-relaxed italic">
                "I appreciate you for [action], because it makes me feel [feeling]."
              </div>

              <form onSubmit={submitAppreciations} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Write down your appreciation statement:</label>
                  <textarea
                    required
                    value={appreciationText}
                    onChange={(e) => setAppreciationText(e.target.value)}
                    placeholder="E.g., I appreciate you for getting up early to feed the dog, because it gave me an extra 30m of crucial sleep."
                    className="w-full bg-slate-50 text-[10px] p-2.5 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary font-sans h-16 resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveRitual(null)}
                    className="bg-white text-[#4B4B4B] text-[9.5px] px-3.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-secondary text-white text-[9.5px] px-4 py-1.5 rounded-xl border-b-[3px] border-secondary-dark font-black uppercase tracking-wider cursor-pointer"
                  >
                    Share Gratitude
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {activeRitual === 'gratitude-jar' && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-50 rounded-[2.5rem] border-2 border-stone-300 shadow-2xl p-5 w-full max-w-[640px] flex flex-col gap-4 text-[#4B4B4B] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🫙</span>
                  <h3 className="font-display font-black text-xs text-stone-800 uppercase tracking-wide">Gratitude Jar & Family Sync</h3>
                </div>
                <button
                  onClick={() => setActiveRitual(null)}
                  className="p-1.5 hover:bg-stone-200 rounded-full transition cursor-pointer text-stone-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <GratitudeJar 
                currentUser={currentUser} 
                onAddMilestone={onAddMilestone} 
                onClose={() => setActiveRitual(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
