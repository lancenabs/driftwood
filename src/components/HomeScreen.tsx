import React, { useState, useEffect } from 'react';
import { Flame, Play, Check, Trophy, Sparkles, BookOpen, Compass, Award, Gamepad2, ArrowRight, Heart, Plus, Trash2, Calendar as CalendarIcon, CheckSquare, Timer, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SwitchUserBar, { SIMULATED_PROFILES, UserProfile } from './SwitchUserBar';
import CalendarSection from './CalendarSection';
import HabitsRitualsSection from './HabitsRitualsSection';
import FamilyToolsSection from './FamilyToolsSection';
import FamilyStressMeter from './FamilyStressMeter';

interface Milestone {
  id: string;
  title: string;
  date: string;
  emoji: string;
  category: string;
  isCustom?: boolean;
}

interface Nudge {
  id: string;
  title: string;
  action: string;
  clinicalReason: string;
  emoji: string;
}

const NUDGE_DATA: Record<string, Nudge[]> = {
  gottman: [
    {
      id: 'g1',
      title: 'Offer a 6-Second Hug',
      action: 'Hug or kiss your partner for at least 6 continuous seconds. This duration triggers oxytocin release, lowering defenses and forming a somatic connection bridge.',
      clinicalReason: 'Magic 6-Second Connection: Drs. John and Julie Gottman proved a 6-second physical connection acts as a physiological de-escalation mechanism, letting heart rates synchronize.',
      emoji: '💋'
    },
    {
      id: 'g2',
      title: 'State a Sincere Appreciation',
      action: 'Turn to your partner and say: "One thing I appreciate about you today is..." and cite a concrete, specific event from the past 24 hours.',
      clinicalReason: 'Creating the Magic 5:1 Ratio: Expressing spontaneous validation feeds the fondness-and-admiration system, blocking the build-up of resentment.',
      emoji: '💖'
    },
    {
      id: 'g3',
      title: 'Practice a Softened Startup',
      action: 'Draft a complaint in your mind or out loud. Use the formula: "I feel [emotion] about [specific event], and I need [positive action]." Avoid blame or "You always".',
      clinicalReason: 'Softened Startup Rule: 94% of conflicts end on the exact same emotional octave they start. Softening the initial verbal bid protects co-op repairs.',
      emoji: '💬'
    }
  ],
  eft: [
    {
      id: 'e1',
      title: 'The "Slow Down" Cycle Pause',
      action: 'In a moment of mild disconnect, say: "My system is spinning a little right now. Let\'s take a 60-second silent pause so I can reconnect with what is happening underneath my defenses."',
      clinicalReason: 'Emotionally Focused Reframing: De-escalating the pursuer-distancer pattern requires slowing down the cycle before protective threat shields activate fully.',
      emoji: '🧘'
    },
    {
      id: 'e2',
      title: 'Express a Soft Under-Emotion',
      action: 'Stop and name a softer, vulnerable primary emotion underneath any protective irritation: "Underneath my frustration, what I\'m actually feeling is a bit invisible right now."',
      clinicalReason: 'Accessing Primary Affect: EFT teaches that secondary anger often hides primary fears of isolation. Sharing the soft under-emotion invites safe attachment.',
      emoji: '🥺'
    },
    {
      id: 'e3',
      title: 'The Vulnerable Validation',
      action: 'Look at your partner and validate their perspective: "I hear you, and it makes complete sense that you felt overwhelmed or alone when I pulled away."',
      clinicalReason: 'Attachment Security: Validating your partner\'s emotional reaction builds the safe haven, reassuring them that their nervous system is heard.',
      emoji: '🤝'
    }
  ],
  polyvagal: [
    {
      id: 'p1',
      title: 'Resonant Breath Co-Regulation',
      action: 'Sit close, face-to-face, lightly holding hands. Synchronize and take 3 deep, slow breaths together (Inhale for 4 seconds, exhale slowly for 6 seconds).',
      clinicalReason: 'Somatic Co-Regulation: Slow exhalations activate the vagus nerve (Ventral Vagal state), signaling safe social engagement directly to both brain stems.',
      emoji: '🌬️'
    },
    {
      id: 'p2',
      title: 'Ventral Eye-Lock Drift',
      action: 'Look into your partner\'s eyes with a relaxed, soft gaze for 15 seconds. Let your facial muscles soften to signal safety and warm intention.',
      clinicalReason: 'Social Engagement System: Face-to-face ocular contact stimulates cranial nerves that control cardiac deceleration, lowering heart rate spikes.',
      emoji: '👀'
    },
    {
      id: 'p3',
      title: 'The 20-Second Soothing Hug',
      action: 'Wrap your arms around your partner and hold them for a full 20 seconds, fully leaning your weight in until both of your heart rates begin to slow.',
      clinicalReason: 'Nervous System Synchronization: A deep 20-second embrace calms hyper-aroused sympathetic fight-or-flight states, replacing alarm with biological safety.',
      emoji: '🤗'
    }
  ],
  cbt: [
    {
      id: 'c1',
      title: 'Separate Facts from Story',
      action: 'In your mind, separate the event from your interpretation. Ask: "What is the absolute objective fact of what occurred, and what is the story my mind is spinning?"',
      clinicalReason: 'Cognitive Restructuring: Distinguishing hard events from interpretive emotional stories reduces automatic negative thoughts (ANTs).',
      emoji: '🧠'
    },
    {
      id: 'c2',
      title: 'The 3-Breath Mindful Pause',
      action: 'Before replying to a comment or text that triggered you, close your eyes, inhale deeply for 4 seconds, hold for 2, and exhale for 4. Repeat 3 times.',
      clinicalReason: 'Amygdala Hijack Prevention: Pausing before reacting gives your rational prefrontal cortex time to catch up and regulate the autonomic flight response.',
      emoji: '🛑'
    },
    {
      id: 'c3',
      title: 'Identify the Cognitive Distortion',
      action: 'Ask yourself: "Am I catastrophizing, mind-reading, or engaging in all-or-nothing thinking right now?" Name the distortion out loud to strip its power.',
      clinicalReason: 'Metacognitive Awareness: Labeling thinking errors activates rational networks, dampening high-potency emotional distress.',
      emoji: '🛡️'
    }
  ]
};

interface HomeScreenProps {
  onStartLesson: () => void;
  onEnterPractice: () => void;
  onViewGoals?: () => void;
  onViewGenogram?: () => void;
  streak: number;
}

export default function HomeScreen({ onStartLesson, onEnterPractice, onViewGoals, onViewGenogram, streak }: HomeScreenProps) {
  // Active states for couples/family expansion
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'calendar' | 'habits' | 'tools'>('dashboard');
  const [activeProfile, setActiveProfile] = useState<UserProfile>(SIMULATED_PROFILES[0]); // Defaults to Alex

  // Weekly relationship goal state with localStorage persistence
  const [goalText, setGoalText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('familyframe_weekly_goal_text');
      if (saved) return saved;
    } catch {}
    return "Have a 15-minute check-in conversation using Softened Startups 🗣️";
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('familyframe_weekly_goal_completed');
      if (saved) return saved === 'true';
    } catch {}
    return false;
  });

  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>("");
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  // --- STATE: NUDGE SYSTEM ---
  const [selectedNudgeModel, setSelectedNudgeModel] = useState<'gottman' | 'eft' | 'polyvagal' | 'cbt'>('gottman');
  const [activeNudgeIndex, setActiveNudgeIndex] = useState(0);
  const [nudgeTimerSeconds, setNudgeTimerSeconds] = useState(60);
  const [nudgeTimerActive, setNudgeTimerActive] = useState(false);
  const [nudgeCompleted, setNudgeCompleted] = useState(false);
  const [nudgeFeedback, setNudgeFeedback] = useState<string | null>(null);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (nudgeTimerActive && nudgeTimerSeconds > 0) {
      interval = setInterval(() => {
        setNudgeTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (nudgeTimerSeconds === 0) {
      setNudgeTimerActive(false);
      setNudgeCompleted(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [nudgeTimerActive, nudgeTimerSeconds]);

  const presets = [
    "Have a 15-minute check-in conversation using Softened Startups 🗣️",
    "Practice 10 minutes of active listening without giving advice 🤝",
    "Identify and express 3 genuine appreciations to my partner ❤️",
    "Conduct a 15-minute alignment check-in for parenting/rules 📅",
    "Establish a shared 'No-Permission Budget' alignment draft 💵"
  ];

  const handleToggleGoal = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      try {
        localStorage.setItem('familyframe_weekly_goal_completed', 'true');
      } catch {}

      // Celebrate! Spawn beautiful particles floating upwards and rotating
      const emojis = ['❤️', '✨', '🎉', '🌟', '💖', '🥰', '🌱'];
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 120 - 60,
        y: Math.random() * -100 - 50,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      }));
      setParticles(newParticles);
      // Clear after animation completes
      setTimeout(() => setParticles([]), 2000);
    } else {
      setIsCompleted(false);
      try {
        localStorage.setItem('familyframe_weekly_goal_completed', 'false');
      } catch {}
    }
  };

  const handleResetGoal = () => {
    setIsCompleted(false);
    try {
      localStorage.setItem('familyframe_weekly_goal_completed', 'false');
    } catch {}
  };

  const handleSaveGoal = () => {
    const finalGoalText = customInput.trim() || goalText;
    setGoalText(finalGoalText);
    setIsCompleted(false);
    setIsCustomizing(false);
    try {
      localStorage.setItem('familyframe_weekly_goal_text', finalGoalText);
      localStorage.setItem('familyframe_weekly_goal_completed', 'false');
    } catch {}
  };

  const weeklyGoals = [
    { day: 'M', completed: true, active: false },
    { day: 'T', completed: true, active: false },
    { day: 'W', completed: false, active: false },
    { day: 'T', completed: false, active: true },
    { day: 'F', completed: false, active: false },
    { day: 'S', completed: false, active: false },
    { day: 'S', completed: false, active: false },
  ];

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem('familyframe_milestones_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: '1',
        title: 'Started Our Shared Journey 🌱',
        date: '2026-07-06',
        emoji: '🌱',
        category: 'clinical'
      },
      {
        id: '2',
        title: 'Reached 100 XP & Level 2 🪙',
        date: '2026-07-08',
        emoji: '✨',
        category: 'streak'
      },
      {
        id: '3',
        title: 'First Simulation Completed 💬',
        date: '2026-07-09',
        emoji: '💬',
        category: 'clinical'
      },
      {
        id: '4',
        title: 'Weekly Goal Achieved! 🎯',
        date: '2026-07-10',
        emoji: '🎉',
        category: 'personal'
      },
    ];
  });

  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [newEmoji, setNewEmoji] = useState("❤️");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('familyframe_milestones_v1', JSON.stringify(milestones));
    } catch {}
  }, [milestones]);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      date: newDate,
      emoji: newEmoji,
      category: 'personal',
      isCustom: true
    };

    setMilestones(prev => [newMilestone, ...prev]);
    setNewTitle("");
    setShowAddForm(false);

    // Celebrate!
    const emojis = [newEmoji, '✨', '🎉', '💖', '🥰', '🌱'];
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 120 - 60,
      y: Math.random() * -100 - 50,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  const handleAddMilestoneDirect = (title: string, emoji: string) => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title,
      date: new Date().toISOString().split('T')[0],
      emoji,
      category: 'personal',
      isCustom: true
    };
    setMilestones(prev => [newMilestone, ...prev]);
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  interface CoupleRitual {
    id: string;
    name: string;
    emoji: string;
    frequency: 'daily' | 'weekly';
    streak: number;
    completed: boolean;
    lastCompleted?: string;
  }

  // Couples Rituals State with LocalStorage Persistence
  const [coupleRituals, setCoupleRituals] = useState<CoupleRitual[]>(() => {
    try {
      const saved = localStorage.getItem('familyframe_couple_rituals_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'cr1', name: 'Weekly Date Night', emoji: '🍕', frequency: 'weekly', streak: 4, completed: false },
      { id: 'cr2', name: 'Morning Coffee Check-in', emoji: '☕', frequency: 'daily', streak: 12, completed: false },
      { id: 'cr3', name: '6-Second Kiss Anchor', emoji: '💋', frequency: 'daily', streak: 18, completed: false },
      { id: 'cr4', name: 'Appreciation Exchange', emoji: '💬', frequency: 'daily', streak: 7, completed: false }
    ];
  });

  const [showAddRitualForm, setShowAddRitualForm] = useState(false);
  const [newRitualName, setNewRitualName] = useState("");
  const [newRitualEmoji, setNewRitualEmoji] = useState("❤️");
  const [newRitualFreq, setNewRitualFreq] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    try {
      localStorage.setItem('familyframe_couple_rituals_v2', JSON.stringify(coupleRituals));
    } catch {}
  }, [coupleRituals]);

  const handleToggleRitual = (id: string) => {
    setCoupleRituals(prev => prev.map(r => {
      if (r.id === id) {
        const nextCompleted = !r.completed;
        const nextStreak = nextCompleted ? r.streak + 1 : Math.max(0, r.streak - 1);
        
        if (nextCompleted) {
          // Celebrate!
          const emojis = [r.emoji, '🔥', '✨', '💖', '🥰', '🌟'];
          const newParticles = Array.from({ length: 12 }).map((_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 120 - 60,
            y: Math.random() * -100 - 50,
            emoji: emojis[Math.floor(Math.random() * emojis.length)]
          }));
          setParticles(newParticles);
          setTimeout(() => setParticles([]), 2000);

          // Log to timeline directly
          handleAddMilestoneDirect(`Ritual Completed: ${r.emoji} ${r.name}`, r.emoji);
        }

        return {
          ...r,
          completed: nextCompleted,
          streak: nextStreak
        };
      }
      return r;
    }));
  };

  const handleAddRitual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRitualName.trim()) return;

    const newRitual: CoupleRitual = {
      id: 'cr-' + Date.now(),
      name: newRitualName.trim(),
      emoji: newRitualEmoji,
      frequency: newRitualFreq,
      streak: 0,
      completed: false
    };

    setCoupleRituals(prev => [...prev, newRitual]);
    setNewRitualName("");
    setShowAddRitualForm(false);
    
    // Celebrate addition
    const emojis = [newRitualEmoji, '✨', '🎉', '🌱'];
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 120 - 60,
      y: Math.random() * -100 - 50,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  const handleDeleteRitual = (id: string) => {
    setCoupleRituals(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-5 py-2 w-full max-w-md mx-auto text-on-background animate-fade-in-up">
      {/* Header section with Flame & Stats */}
      <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-[2rem] border-2 border-outline-variant shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-base font-bold border border-primary/20">
            {activeProfile.avatar}
          </div>
          <div>
            <h2 className="font-display font-black text-sm text-on-surface leading-none">{activeProfile.name}</h2>
            <p className="font-sans text-[10px] text-on-surface-variant mt-1.5 font-bold uppercase tracking-wider">{activeProfile.roleText}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Flame streak */}
          <div className="group relative flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border-2 border-outline-variant shadow-sm hover:border-orange-400 transition-all cursor-help">
            <span className="text-orange-500 font-display font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
              <span>🔥</span>
              <span>{streak} DAY STREAK</span>
            </span>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2.5 hidden group-hover:block bg-neutral-900 text-white text-[10px] font-sans font-normal rounded-xl p-2.5 shadow-xl w-56 text-center z-50 border border-neutral-800 leading-relaxed pointer-events-none">
              <strong>Habit Loop Streak</strong><br />
              Consistent 5-minute daily sessions build emotional reflexes to handle real conflict.
              <div className="absolute top-full right-6 -mt-1 border-4 border-transparent border-t-neutral-900" />
            </div>
          </div>

          {/* Coins */}
          <div className="group relative flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border-2 border-outline-variant shadow-sm cursor-help">
            <span className="text-sm">🪙</span>
            <span className="font-display font-black text-xs text-[#4B4B4B]">250</span>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2.5 hidden group-hover:block bg-neutral-900 text-white text-[10px] font-sans font-normal rounded-xl p-2.5 shadow-xl w-56 text-center z-50 border border-neutral-800 leading-relaxed pointer-events-none">
              <strong>Practice Tokens</strong><br />
              Earned by successfully validating and active listening during co-op drills.
              <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-neutral-900" />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Device Sign-in switcher */}
      <SwitchUserBar currentUser={activeProfile} onChangeUser={setActiveProfile} />

      {/* Sub-Tab Selector for Home Screen */}
      <div className="flex bg-surface-container rounded-2xl p-1 gap-1 border-2 border-outline-variant">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex-1 font-display font-black text-[9px] py-2 px-1 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1 ${activeSubTab === 'dashboard' ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6]' : 'text-[#4B4B4B] hover:bg-surface-container-high'}`}
        >
          <span>🏡 Home</span>
        </button>
        <button
          onClick={() => setActiveSubTab('calendar')}
          className={`flex-1 font-display font-black text-[9px] py-2 px-1 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1 ${activeSubTab === 'calendar' ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302]' : 'text-[#4B4B4B] hover:bg-surface-container-high'}`}
        >
          <span>📅 Calendar</span>
        </button>
        <button
          onClick={() => setActiveSubTab('habits')}
          className={`flex-1 font-display font-black text-[9px] py-2 px-1 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1 ${activeSubTab === 'habits' ? 'bg-[#CE9FFC] text-white border-b-4 border-[#b784f9]' : 'text-[#4B4B4B] hover:bg-surface-container-high'}`}
        >
          <span>⚡ Habits</span>
        </button>
        <button
          onClick={() => setActiveSubTab('tools')}
          className={`flex-1 font-display font-black text-[9px] py-2 px-1 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1 ${activeSubTab === 'tools' ? 'bg-[#FF8A00] text-white border-b-4 border-[#cc6e00]' : 'text-[#4B4B4B] hover:bg-surface-container-high'}`}
        >
          <span>🛠️ Family Tools</span>
        </button>
      </div>

      {/* Conditional Rendering of Sections */}
      {activeSubTab === 'dashboard' && (
        <div className="flex flex-col gap-6 animate-fade-in text-on-surface">
          {/* Motivational statement */}
          <div>
            <h1 className="font-display font-black text-2xl text-on-surface tracking-tight">Your Connected Space</h1>
            <p className="font-sans text-xs text-on-surface-variant">Consistent small steps build powerful family resilience.</p>
          </div>

          {/* Daily Micro-Lesson Card */}
          <section 
            onClick={onStartLesson}
            className="relative bg-primary text-white rounded-[2rem] p-5 border-2 border-outline-variant shadow-3d-primary transition-all hover:brightness-105 active:translate-y-[2px] active:shadow-none cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-white/80">Active Program</span>
                <h3 className="font-display font-black text-xl text-white mt-0.5">The Gottman Method</h3>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10">
                Daily Lesson
              </div>
            </div>
            
            <p className="font-sans text-xs text-white/95 leading-relaxed mb-4">
              The Magic 5:1 Ratio — Successful couples maintain a ratio of 5 positive interactions for every 1 negative.
            </p>

            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
              <div className="group relative flex items-center gap-2 flex-grow mr-4 cursor-help">
                <span className="text-[10px] font-bold text-white/80 shrink-0">Progress</span>
                <div className="flex-grow h-2.5 bg-black/25 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '60%' }}></div>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-neutral-900 text-white text-[10px] font-sans font-normal rounded-xl p-2.5 shadow-xl w-52 text-left z-50 border border-neutral-800 leading-relaxed pointer-events-none">
                  <span className="font-display font-black text-primary text-[10px] uppercase tracking-wider block mb-0.5">❤️ Program Progress (60%)</span>
                  Tracks completed lessons in <strong>The Gottman Method</strong> module. Complete daily CBT micro-lessons to unlock clinical practice scenarios.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
                </div>
              </div>
              
              <button className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-sm border-2 border-white/25 hover:scale-105 transition-transform shrink-0 cursor-pointer">
                <Play className="w-5 h-5 fill-primary text-primary ml-0.5" />
              </button>
            </div>
          </section>

          {/* Family Stress Meter Widget */}
          <FamilyStressMeter />

          {/* Practice Space (Co-op Simulations gateway) Card */}
          <section 
            onClick={onEnterPractice}
            className="bg-secondary text-white rounded-[2rem] p-5 border-2 border-outline-variant shadow-3d-secondary hover:brightness-105 active:translate-y-[2px] active:shadow-none transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-2">
              <div className="bg-white/10 w-fit p-2 rounded-xl backdrop-blur-sm border border-white/25">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-black text-xl text-white mt-1">Co-op Practice Gym</h3>
              <p className="font-sans text-xs text-white/90 max-w-[280px]">
                Step into interactive, branching roleplay scenarios to master de-escalation safely.
              </p>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); onEnterPractice(); }}
              className="relative z-10 w-full bg-white text-secondary font-display font-black py-3 rounded-xl border-b-[4px] border-[#E5E5E5] hover:bg-slate-50 active:translate-y-[2px] active:border-b-[2px] transition-all flex items-center justify-center gap-2 mt-5 shadow-sm cursor-pointer"
            >
              <span>Enter the Gym</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>

          {/* Actionable NudgeSystem (1-Minute Somatic & Clinical Micro-Intervention) */}
          <section className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4 text-[#4B4B4B]">
            <div className="flex flex-col gap-1 border-b border-outline-variant pb-3">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B] flex items-center gap-1.5">
                  <span className="text-rose-500 animate-pulse">⚡</span> Actionable Micro-Intervention
                </h3>
                <span className="text-[7.5px] font-black uppercase bg-[#FFE5E6] text-[#FF5A5F] px-2 py-0.5 rounded-lg border border-red-200">
                  1-Min Somatic Drill
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant/90 leading-tight">
                Quick somatic and psychological co-regulation practices to lower autonomic defenses instantly.
              </p>
            </div>

            {/* Model Pills */}
            <div className="flex bg-slate-50 p-1 rounded-xl border border-outline-variant gap-1">
              {(['gottman', 'eft', 'polyvagal', 'cbt'] as const).map((model) => (
                <button
                  key={model}
                  onClick={() => {
                    setSelectedNudgeModel(model);
                    setActiveNudgeIndex(0);
                    setNudgeTimerSeconds(60);
                    setNudgeTimerActive(false);
                    setNudgeCompleted(false);
                    setNudgeFeedback(null);
                  }}
                  className={`flex-1 text-[8px] font-black py-1.5 px-0.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer text-center ${
                    selectedNudgeModel === model
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-[#4B4B4B] hover:bg-slate-100'
                  }`}
                >
                  {model === 'gottman' ? 'Gottman' : model === 'eft' ? 'EFT' : model === 'polyvagal' ? 'Polyvagal' : 'CBT'}
                </button>
              ))}
            </div>

            {/* Current Nudge Card Content */}
            {(() => {
              const currentNudge = NUDGE_DATA[selectedNudgeModel][activeNudgeIndex];
              return (
                <div className="bg-slate-50 border border-outline-variant/60 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl select-none p-1.5 bg-white rounded-xl shadow-sm border border-outline-variant/40">
                      {currentNudge.emoji}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-display font-black text-xs text-[#4B4B4B]">
                        {currentNudge.title}
                      </h4>
                      <p className="font-sans text-[10px] text-on-surface-variant/90 leading-relaxed mt-1">
                        {currentNudge.action}
                      </p>
                    </div>
                  </div>

                  {/* Clinical Explanation */}
                  <div className="bg-indigo-50/60 border border-indigo-100/50 p-2.5 rounded-xl text-[9px] text-indigo-900 leading-relaxed">
                    <strong>💡 Clinical Insight:</strong> {currentNudge.clinicalReason}
                  </div>

                  {/* Timer UI or feedback */}
                  {nudgeFeedback ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#E2F0D9] border border-[#A9D18E] text-[#385723] p-2.5 rounded-xl text-[9.5px] font-bold text-center flex flex-col items-center gap-1"
                    >
                      <span>🏆 {nudgeFeedback}</span>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-1">
                      {/* Interactive Timer Progress bar */}
                      {nudgeTimerActive && (
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[8.5px] font-mono text-[#4B4B4B]">
                            <span>🌬️ Active Core Practice...</span>
                            <span className="font-bold">{nudgeTimerSeconds}s left</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-outline-variant/40">
                            <motion.div 
                              key={nudgeTimerSeconds}
                              initial={{ width: `${((nudgeTimerSeconds + 1) / 60) * 100}%` }}
                              animate={{ width: `${(nudgeTimerSeconds / 60) * 100}%` }}
                              transition={{ duration: 1, ease: 'linear' }}
                              className="bg-rose-500 h-full"
                            />
                          </div>
                          {/* Animated Inhale/Exhale Cue */}
                          <p className="text-center font-display font-black text-[9px] uppercase tracking-wider text-rose-500 animate-pulse mt-0.5">
                            {nudgeTimerSeconds % 10 < 5 ? '🧘 Inhale Calmness...' : '🌬️ Exhale Resentment...'}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {!nudgeTimerActive && !nudgeCompleted ? (
                          <button
                            onClick={() => {
                              setNudgeTimerSeconds(60);
                              setNudgeTimerActive(true);
                            }}
                            className="flex-1 bg-indigo-600 text-white border-b-4 border-indigo-800 text-[10px] font-black uppercase py-2.5 rounded-xl transition-all hover:brightness-105 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Timer className="w-3.5 h-3.5" />
                            <span>Start 1-Min Drill</span>
                          </button>
                        ) : nudgeTimerActive ? (
                          <button
                            onClick={() => {
                              setNudgeTimerActive(false);
                              setNudgeTimerSeconds(60);
                            }}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 border-2 border-outline-variant text-[10px] font-black uppercase py-2 rounded-xl transition-all cursor-pointer text-[#4B4B4B] flex items-center justify-center gap-1"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Reset Timer</span>
                          </button>
                        ) : null}

                        <button
                          onClick={() => {
                            // Instant completion or claiming reward
                            const title = `Completed somatic co-regulation: ${currentNudge.title} ${currentNudge.emoji}`;
                            handleAddMilestoneDirect(title, currentNudge.emoji);
                            
                            // Success Feedback
                            setNudgeFeedback(`Success! Complete (+20 XP)!`);
                            
                            // Particle celebration
                            const emojis = [currentNudge.emoji, '✨', '🎉', '🌟', '💖', '🥰', '🌱'];
                            const newParticles = Array.from({ length: 12 }).map((_, i) => ({
                              id: Date.now() + i,
                              x: Math.random() * 120 - 60,
                              y: Math.random() * -100 - 50,
                              emoji: emojis[Math.floor(Math.random() * emojis.length)]
                            }));
                            setParticles(newParticles);
                            setTimeout(() => setParticles([]), 2000);

                            setTimeout(() => {
                              setNudgeFeedback(null);
                              setNudgeCompleted(false);
                              setNudgeTimerSeconds(60);
                              setNudgeTimerActive(false);
                              // Advance to next nudge index
                              setActiveNudgeIndex((prev) => (prev + 1) % NUDGE_DATA[selectedNudgeModel].length);
                            }, 3500);
                          }}
                          className={`flex-1 text-white border-b-4 text-[10px] font-black uppercase py-2.5 rounded-xl transition-all hover:brightness-105 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 ${
                            nudgeCompleted 
                              ? 'bg-[#58CC02] border-[#46A302]' 
                              : 'bg-rose-500 border-rose-700'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>{nudgeCompleted ? 'Claim Reward!' : 'Mark Completed'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </section>

          {/* Weekly Relationship Goal Card */}
          <section className="bg-surface-container-lowest rounded-[2rem] p-5 border-2 border-outline-variant shadow-sm flex flex-col gap-3 relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🎯</span>
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B]">Weekly Relationship Goal</h3>
              </div>
              {!isCustomizing && (
                <button
                  onClick={() => {
                    setIsCustomizing(true);
                    setCustomInput(goalText);
                  }}
                  className="text-[9px] font-black uppercase tracking-wider text-secondary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>✏️ Customize</span>
                </button>
              )}
            </div>

            {isCustomizing ? (
              <div className="flex flex-col gap-3 animate-fade-in text-on-surface">
                <div>
                  <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block mb-1.5">
                    Choose a clinical goal preset:
                  </label>
                  <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1 no-scrollbar">
                    {presets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomInput(preset)}
                        className={`text-left text-[10px] font-sans font-medium p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                          customInput === preset
                            ? 'bg-primary/10 border-primary text-[#4B4B4B]'
                            : 'bg-white border-outline-variant hover:border-slate-300 text-on-surface-variant'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">
                    Or type a custom relationship goal:
                  </label>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g. Leave a cute sticky note for my partner"
                    className="w-full bg-white text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans font-bold text-[#4B4B4B]"
                  />
                </div>

                <div className="flex gap-2 justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => setIsCustomizing(false)}
                    className="bg-white text-[#4B4B4B] text-[9.5px] px-3.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveGoal}
                    className="bg-primary text-white text-[9.5px] px-4 py-1.5 rounded-xl border-b-[3px] border-primary-dark font-black uppercase tracking-wider cursor-pointer"
                  >
                    Set Goal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3.5 items-center relative py-1">
                  {/* Checkbox button with relative particle anchor */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={handleToggleGoal}
                      className={`w-11 h-11 rounded-full flex items-center justify-center border-2.5 cursor-pointer transition-all duration-300 relative group/check ${
                        isCompleted
                          ? 'bg-primary border-primary text-white shadow-3d-primary'
                          : 'bg-white border-outline-variant hover:border-primary text-transparent hover:text-primary/30'
                      }`}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <Check className="w-5.5 h-5.5 stroke-[3.5px] text-white" />
                        </motion.div>
                      ) : (
                        <Check className="w-5 h-5 stroke-[3.5px] transition-transform group-hover/check:scale-110" />
                      )}
                    </button>

                    {/* Sparkling celebratory particles float upwards from here */}
                    <AnimatePresence>
                      {particles.map((p) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                          animate={{
                            opacity: [1, 1, 0],
                            scale: [0.6, 1.4, 0.8],
                            x: p.x,
                            y: p.y,
                            rotate: Math.random() * 120 - 60
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="absolute pointer-events-none text-sm z-30 select-none"
                          style={{ left: '14px', top: '14px' }}
                        >
                          {p.emoji}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Goal Text description */}
                  <div className="flex-grow min-w-0">
                    <p className={`font-sans text-[11.5px] font-bold leading-relaxed transition-all duration-300 ${
                      isCompleted ? 'line-through text-on-surface-variant/50 italic' : 'text-on-surface'
                    }`}>
                      {goalText}
                    </p>
                    <p className={`text-[8.5px] font-sans font-bold mt-0.5 ${isCompleted ? 'text-primary' : 'text-on-surface-variant/80'}`}>
                      {isCompleted ? '🎉 Goal Achieved! Phenomenal teamwork.' : '💡 Click the circle to mark completed.'}
                    </p>
                  </div>
                </div>

                {/* Undo button to reset goal */}
                {isCompleted && (
                  <div className="flex justify-end -mt-1 animate-fade-in">
                    <button
                      type="button"
                      onClick={handleResetGoal}
                      className="text-[8.5px] font-black uppercase text-on-surface-variant hover:text-primary flex items-center gap-1 cursor-pointer bg-surface-container px-2.5 py-1 rounded-lg border border-outline-variant transition-all hover:scale-105"
                    >
                      <span>🔄 Undo / Reset</span>
                    </button>
                  </div>
                )}

                {/* Clinical context footer inside the card */}
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex gap-2 items-start text-[10px] leading-relaxed text-[#4B4B4B] mt-0.5">
                  <span className="text-xs shrink-0">🤝</span>
                  <p className="font-sans">
                    <strong>Gottman Insight:</strong> Setting one small, explicit relationship goal weekly helps couples actively direct conscious warmth toward each other, blocking resentment before it accumulates.
                  </p>
                </div>

                {/* View Household Goals button */}
                {onViewGoals && (
                  <button
                    type="button"
                    onClick={onViewGoals}
                    className="w-full bg-[#1CB0F6] hover:bg-[#1899D6] text-white font-display font-black py-2.5 rounded-xl border-b-[4px] border-[#1899D6] active:translate-y-[2px] active:border-b-[2px] transition-all flex items-center justify-center gap-2 mt-2 text-[10px] uppercase tracking-wider cursor-pointer shadow-sm"
                  >
                    <span>🎯 View Household Goals Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Weekly Practice Streak Card */}
          <section className="bg-surface-container-lowest rounded-[2rem] p-5 border-2 border-outline-variant shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B]">Weekly Practice Streak</h3>
              <span className="font-sans text-xs font-bold text-primary">3 / 5 Sessions Completed</span>
            </div>

            {/* Horizontal Days row */}
            <div className="flex justify-between items-center w-full px-1">
              {weeklyGoals.map((g, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  {g.completed ? (
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-3d-primary border-2 border-[#46A302] animate-fade-in">
                      <Check className="w-5 h-5 text-white stroke-[3px]" />
                    </div>
                  ) : g.active ? (
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-secondary text-secondary flex items-center justify-center shadow-3d-secondary relative overflow-hidden animate-pulse">
                      <span className="font-sans text-xs font-bold">🔥</span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface-container border-2 border-outline-variant flex items-center justify-center opacity-60">
                      <div className="w-2 h-2 rounded-full bg-outline-variant" />
                    </div>
                  )}
                  <span className={`font-sans text-[10px] font-black ${g.active ? 'text-secondary font-extrabold' : 'text-on-surface-variant'}`}>{g.day}</span>
                </div>
              ))}
            </div>

            {/* Thick Progress bar */}
            <div className="mt-6">
              <div className="h-3.5 bg-surface-container rounded-full overflow-hidden shadow-inner border border-outline-variant/50">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '60%' }} />
              </div>
            </div>
          </section>

          {/* Couples Rituals Dashboard Card */}
          <section className="bg-surface-container-lowest rounded-[2rem] p-5 border-2 border-outline-variant shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B]">Couples Rituals Dashboard</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddRitualForm(!showAddRitualForm)}
                className="text-[9px] font-black bg-secondary/10 text-secondary hover:bg-secondary/15 px-2.5 py-1.5 rounded-xl border border-secondary/20 transition-all flex items-center gap-1 cursor-pointer uppercase tracking-wider font-display"
              >
                <Plus className="w-3 h-3" />
                <span>{showAddRitualForm ? 'Cancel' : 'Add Ritual'}</span>
              </button>
            </div>

            {/* Add Ritual Form */}
            {showAddRitualForm && (
              <form
                onSubmit={handleAddRitual}
                className="bg-surface-container p-4 rounded-2xl border-2 border-outline-variant flex flex-col gap-3 animate-fade-in text-on-surface"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-black text-[9px] uppercase tracking-wider text-on-surface-variant">Log New Shared Ritual</h4>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Ritual Name</label>
                  <input
                    type="text"
                    required
                    value={newRitualName}
                    onChange={(e) => setNewRitualName(e.target.value)}
                    placeholder="e.g. Sunday Morning Pancakes"
                    className="w-full bg-white text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-secondary font-sans font-bold text-[#4B4B4B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Frequency</label>
                    <select
                      value={newRitualFreq}
                      onChange={(e) => setNewRitualFreq(e.target.value as 'daily' | 'weekly')}
                      className="w-full bg-white text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-secondary font-sans font-bold text-[#4B4B4B] appearance-none"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Emoji Icon</label>
                    <select
                      value={newRitualEmoji}
                      onChange={(e) => setNewRitualEmoji(e.target.value)}
                      className="w-full bg-white text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-secondary font-sans font-bold text-[#4B4B4B] appearance-none"
                    >
                      {['🍕', '☕', '💋', '💬', '🏃', '🛋️', '🌱', '🛁', '🍿', '🕯️', '📚', '🍷', '🍳', '🚶'].map((em) => (
                        <option key={em} value={em}>{em}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-secondary text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl border-b-4 border-secondary-dark hover:brightness-105 active:translate-y-[2px] active:border-b-2 transition-all mt-1 cursor-pointer text-center"
                >
                  Create Couple Ritual
                </button>
              </form>
            )}

            {/* List representation of rituals */}
            <div className="flex flex-col gap-3">
              {coupleRituals.map((ritual) => (
                <div 
                  key={ritual.id} 
                  className={`flex justify-between items-center p-3 rounded-2xl border-2 transition-all ${
                    ritual.completed 
                      ? 'bg-slate-50 border-outline-variant/60' 
                      : 'bg-white border-outline-variant hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Compact simple Checkbox button */}
                    <button
                      type="button"
                      onClick={() => handleToggleRitual(ritual.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2.5 cursor-pointer transition-all shrink-0 ${
                        ritual.completed
                          ? 'bg-[#58CC02] border-[#58CC02] text-white shadow-3d-secondary'
                          : 'bg-white border-outline-variant hover:border-[#58CC02] text-transparent hover:text-[#58CC02]/30'
                      }`}
                    >
                      {ritual.completed ? (
                        <Check className="w-5 h-5 stroke-[4px] text-white" />
                      ) : (
                        <span className="text-xs font-bold font-sans">✓</span>
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm">{ritual.emoji}</span>
                        <h4 className={`font-sans text-[11px] font-black text-[#4B4B4B] leading-none ${ritual.completed ? 'line-through text-on-surface-variant/60 italic' : ''}`}>
                          {ritual.name}
                        </h4>
                        <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                          ritual.frequency === 'daily' 
                            ? 'bg-primary/5 text-primary border-primary/10' 
                            : 'bg-secondary/5 text-secondary border-secondary/10'
                        }`}>
                          {ritual.frequency}
                        </span>
                      </div>

                      {/* Completion Streak status */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px]">🔥</span>
                        <span className="font-display font-black text-[9px] text-orange-500 uppercase tracking-wider">
                          {ritual.streak} {ritual.frequency === 'daily' ? 'day' : 'week'} streak
                        </span>
                        {ritual.completed && (
                          <span className="text-[8.5px] font-sans font-bold text-green-600">
                            • Completed today!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Option for any custom or standard rituals */}
                  <button
                    type="button"
                    onClick={() => handleDeleteRitual(ritual.id)}
                    className="text-on-surface-variant hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all cursor-pointer opacity-30 hover:opacity-100"
                    title="Remove Ritual"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Gottman advice info footer */}
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex gap-2 items-start text-[10px] leading-relaxed text-[#4B4B4B]">
              <span className="text-xs shrink-0">🕯️</span>
              <p className="font-sans">
                <strong>Shared Meaning Pillars:</strong> In the Sound Relationship House, <em>Rituals of Connection</em> are structural routines (like morning coffees or dates) that secure shared meaning and shield the marriage against chronic drift.
              </p>
            </div>
          </section>

          {/* Relationship History Timeline Card */}
          <section className="bg-surface-container-lowest rounded-[2rem] p-5 border-2 border-outline-variant shadow-sm flex flex-col gap-4 relative">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">📜</span>
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B]">Relationship History Timeline</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-[9px] font-black bg-primary/10 text-primary hover:bg-primary/15 px-2.5 py-1.5 rounded-xl border border-primary/20 transition-all flex items-center gap-1 cursor-pointer uppercase tracking-wider"
              >
                <Plus className="w-3 h-3" />
                <span>Add Event</span>
              </button>
            </div>

            {/* Add Milestone Form */}
            {showAddForm && (
              <form
                onSubmit={handleAddMilestone}
                className="bg-surface-container p-4 rounded-2xl border-2 border-outline-variant flex flex-col gap-3 animate-fade-in text-on-surface"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-black text-[10px] uppercase tracking-wider text-on-surface-variant">Log New Milestone</h4>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-[9px] font-black uppercase text-on-surface-variant hover:underline"
                  >
                    Cancel
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Milestone Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. First Simulation Completed"
                    className="w-full bg-white text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans font-bold text-[#4B4B4B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Date</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-white text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans font-bold text-[#4B4B4B]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Emoji Icon</label>
                    <div className="relative">
                      <select
                        value={newEmoji}
                        onChange={(e) => setNewEmoji(e.target.value)}
                        className="w-full bg-white text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans font-bold text-[#4B4B4B] appearance-none"
                      >
                        {['❤️', '✨', '🎉', '🌟', '💬', '🔥', '🌱', '🏆', '💍', '🏡', '✈️', '🐶', '🍕', '🔑'].map((em) => (
                          <option key={em} value={em}>{em}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs text-on-surface-variant">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-primary text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl border-b-4 border-primary-dark hover:brightness-105 active:translate-y-[2px] active:border-b-2 transition-all mt-1 cursor-pointer text-center"
                >
                  Save to Timeline
                </button>
              </form>
            )}

            {/* Timeline representation */}
            <div className="relative pl-7 flex flex-col gap-5 mt-2">
              {/* Vertical Timeline Bar line */}
              <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-outline-variant/60 border-l border-dashed border-outline-variant" />

              {milestones.length === 0 ? (
                <p className="text-[10px] text-on-surface-variant italic text-center py-4">No milestones logged yet. Click "Add Event" to begin your journey!</p>
              ) : (
                [...milestones]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((milestone) => (
                    <div key={milestone.id} className="relative group/item flex flex-col gap-0.5">
                      {/* Circle bubble on the timeline line */}
                      <div className="absolute -left-7 top-0.5 w-7 h-7 rounded-full bg-white border-2 border-outline-variant flex items-center justify-center shadow-xs group-hover/item:border-primary transition-all z-10">
                        <span className="text-xs">{milestone.emoji}</span>
                      </div>

                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-sans text-[11.5px] font-bold text-on-surface group-hover/item:text-primary transition-colors leading-snug">
                            {milestone.title}
                          </p>
                          <span className="text-[9px] font-mono font-bold text-on-surface-variant/80">
                            {new Date(milestone.date + 'T00:00:00').toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        {milestone.isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            className="opacity-0 group-hover/item:opacity-100 text-on-surface-variant hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all cursor-pointer"
                            title="Delete milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Clinical insight footer about narrative */}
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex gap-2 items-start text-[10px] leading-relaxed text-[#4B4B4B] mt-1">
              <span className="text-xs shrink-0">📖</span>
              <p className="font-sans">
                <strong>The Relational Narrative:</strong> Documenting shared milestones strengthens your relationship's "shared meaning system," one of the core pillars of the Gottman Sound Relationship House.
              </p>
            </div>
          </section>
        </div>
      )}

      {activeSubTab === 'calendar' && (
        <div className="animate-fade-in">
          <CalendarSection currentUser={activeProfile} />
        </div>
      )}

      {activeSubTab === 'habits' && (
        <div className="animate-fade-in">
          <HabitsRitualsSection currentUser={activeProfile} onAddMilestone={handleAddMilestoneDirect} />
        </div>
      )}

      {activeSubTab === 'tools' && (
        <div className="animate-fade-in">
          <FamilyToolsSection onViewGenogram={onViewGenogram} />
        </div>
      )}
    </div>
  );
}
