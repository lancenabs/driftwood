import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Plus, 
  Trash2, 
  Trophy, 
  Heart, 
  Sparkles, 
  PlusCircle, 
  MinusCircle, 
  CheckSquare, 
  User, 
  Home, 
  Users, 
  ShieldCheck,
  Zap,
  BookOpen,
  Info,
  Lightbulb,
  Award,
  ArrowRight,
  Smile,
  Users2,
  Bookmark,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Definitions for Household Goals
interface HouseholdGoal {
  id: string;
  title: string;
  assignee: 'Husband' | 'Kids' | 'Family' | 'Couples' | 'Individual';
  assigneeName: string;
  category: 'Acts of Love' | 'Chore' | 'Follow Directions' | 'Family Objective' | 'Individual Goal';
  pointsReward: number;
  completed: boolean;
  target: number;
  current: number;
  unit: string;
  emoji: string;
}

// Clinical Model Interface
interface ClinicalModel {
  id: string;
  name: string;
  creator: string;
  description: string;
  howItWorks: string;
  goalSuggestion: string;
  goalEmoji: string;
  category: 'Acts of Love' | 'Chore' | 'Follow Directions' | 'Family Objective' | 'Individual Goal';
}

interface GoalsDashboardProps {
  onBack: () => void;
}

export default function GoalsDashboard({ onBack }: GoalsDashboardProps) {
  // Goals state synchronized with the same localStorage key as the Point Chart
  const [goals, setGoals] = useState<HouseholdGoal[]>(() => {
    try {
      const saved = localStorage.getItem('driftwood_weekly_goals_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      // Husband Acts of Love Goals
      { id: 'g1', title: 'Bring morning coffee or tea to partner in bed', assignee: 'Husband', assigneeName: 'Mark', category: 'Acts of Love', pointsReward: 20, completed: false, target: 3, current: 1, unit: 'times', emoji: '☕' },
      { id: 'g2', title: 'Leave sticky notes with words of appreciation & validation', assignee: 'Husband', assigneeName: 'Mark', category: 'Acts of Love', pointsReward: 15, completed: false, target: 3, current: 0, unit: 'notes', emoji: '📝' },
      { id: 'g3', title: 'Initiate and book a co-op date night (no screen distractions)', assignee: 'Husband', assigneeName: 'Mark', category: 'Acts of Love', pointsReward: 25, completed: false, target: 1, current: 0, unit: 'plan', emoji: '🎫' },
      
      // Kids Chore and Direction Goals
      { id: 'g4', title: 'Empty dishwasher & organize kitchen plates', assignee: 'Kids', assigneeName: 'Jamie', category: 'Chore', pointsReward: 15, completed: false, target: 4, current: 2, unit: 'times', emoji: '🍽️' },
      { id: 'g5', title: 'Complete bedroom tidy-up on first parental prompt', assignee: 'Kids', assigneeName: 'Charlie', category: 'Follow Directions', pointsReward: 15, completed: false, target: 3, current: 1, unit: 'times', emoji: '🧹' },
      { id: 'g6', title: 'Out of bed & ready for school on time without tantrums', assignee: 'Kids', assigneeName: 'Charlie & Jamie', category: 'Follow Directions', pointsReward: 20, completed: false, target: 5, current: 3, unit: 'days', emoji: '🎒' },

      // Family & Couples Individual Goals
      { id: 'g7', title: 'Device-free weekend family board game night', assignee: 'Family', assigneeName: 'All', category: 'Family Objective', pointsReward: 40, completed: false, target: 1, current: 0, unit: 'session', emoji: '🎲' },
      { id: 'g8', title: 'Participate in 15 mins of emotional active listening', assignee: 'Couples', assigneeName: 'Mark & Sarah', category: 'Individual Goal', pointsReward: 30, completed: false, target: 3, current: 1, unit: 'checks', emoji: '💬' }
    ];
  });

  const [activeTab, setActiveTab] = useState<'all' | 'husband' | 'children' | 'couple' | 'clinical'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [celebratedGoal, setCelebratedGoal] = useState<HouseholdGoal | null>(null);

  // New Goal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newGroup, setNewGroup] = useState<'husband' | 'children' | 'couple'>('husband');
  const [newTarget, setNewTarget] = useState(3);
  const [newUnit, setNewUnit] = useState('times');
  const [newPoints, setNewPoints] = useState(15);
  const [newEmoji, setNewEmoji] = useState('❤️');

  // Interactive Clinical Models Library List (Top models from Couples & Family Therapy)
  const clinicalModels: ClinicalModel[] = [
    {
      id: 'm1',
      name: 'The Gottman Method',
      creator: 'Drs. John & Julie Gottman',
      description: 'Strengthens relationship foundations via the "Sound Relationship House" and "Emotional Bank Account" deposits.',
      howItWorks: 'To counter negativity, aim for a 5:1 ratio of positive to negative interactions. "Acts of Love" are direct deposits.',
      goalSuggestion: 'Surprise spouse with a small act of service or explicit words of appreciation',
      goalEmoji: '💖',
      category: 'Acts of Love'
    },
    {
      id: 'm2',
      name: 'Emotionally Focused Therapy (EFT)',
      creator: 'Dr. Sue Johnson',
      description: 'Addresses core attachment security. Helps couples step out of the "pursuer-distancer" cycle and self-regulate together.',
      howItWorks: 'Vulnerability builds empathy. Expressing core emotional needs directly rather than complaining builds safe attachment.',
      goalSuggestion: 'Share one vulnerable feeling about my day without assigning blame',
      goalEmoji: '💬',
      category: 'Individual Goal'
    },
    {
      id: 'm3',
      name: 'Imago Relationship Dialogue',
      creator: 'Drs. Harville Hendrix & Helen LaKelly Hunt',
      description: 'Transforms conflicts into opportunities for healing. Focuses on safe mirroring, validation, and emotional empathy.',
      howItWorks: 'Step 1: Mirror what you hear. Step 2: Validate their logic ("You make sense because..."). Step 3: Empathize with their feeling.',
      goalSuggestion: 'Practice 10 mins of Imago Mirroring dialogue without interrupting',
      goalEmoji: '🔄',
      category: 'Individual Goal'
    },
    {
      id: 'm4',
      name: 'Structural Family Sub-Systems',
      creator: 'Dr. Salvador Minuchin',
      description: 'Maps boundaries, hierarchies, and rules inside a family. Promotes functional teamwork while maintaining clear parent-child roles.',
      howItWorks: 'Establishing clear behavioral expectations (like chores) reduces friction and clarifies parental leadership.',
      goalSuggestion: 'Empty garbage/recycling or sweep floor without being asked twice',
      goalEmoji: '🧹',
      category: 'Chore'
    },
    {
      id: 'm5',
      name: 'Relational Life Therapy (RLT)',
      creator: 'Terry Real',
      description: 'Demands absolute accountability and "fierce intimacy." Targets power imbalances and grandiosity in modern relationships.',
      howItWorks: 'Speak truth with absolute love. Both partners must act as equal allies, taking 100% accountability for their own reactions.',
      goalSuggestion: 'Explicitly apologize for taking defensive tone during a discussion',
      goalEmoji: '🤝',
      category: 'Acts of Love'
    },
    {
      id: 'm6',
      name: 'Bowen Family Systems (Differentiation)',
      creator: 'Dr. Murray Bowen',
      description: 'Focuses on "differentiation of self"—retaining your unique identity while maintaining close emotional connection.',
      howItWorks: 'Avoid triangles (complaining about spouse to kids/relatives). React from high-reasoning "I-positions" instead of emotional reactivity.',
      goalSuggestion: 'Take 5 mindful deep breaths before responding to relationship stress',
      goalEmoji: '🧘',
      category: 'Individual Goal'
    }
  ];

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('driftwood_weekly_goals_v1', JSON.stringify(goals));
    } catch {}
  }, [goals]);

  // Particle celebration engine (bursts from the button)
  const triggerCelebration = (goal: HouseholdGoal) => {
    const emojis = [goal.emoji, '✨', '🎉', '🌟', '🏆', '💖', '👏', '🎁', '🎈'];
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 160,
      y: -Math.random() * 150 - 50,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
    setParticles(newParticles);
    
    // Set completed goal for full-screen celebratory modal popup
    setCelebratedGoal(goal);
    
    // Auto-clear transient particles after some time
    setTimeout(() => setParticles([]), 2000);
  };

  // Toggle complete state
  const handleToggleGoalComplete = (id: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const nextCompleted = !g.completed;
        const nextCurrent = nextCompleted ? g.target : 0;
        
        const updatedGoal = {
          ...g,
          current: nextCurrent,
          completed: nextCompleted
        };

        if (nextCompleted) {
          triggerCelebration(updatedGoal);
          
          // Add to points in local storage
          try {
            const membersRaw = localStorage.getItem('driftwood_members_points_v1');
            if (membersRaw) {
              const list = JSON.parse(membersRaw);
              const updated = list.map((m: any) => {
                if (
                  m.name.toLowerCase().includes(g.assigneeName.toLowerCase()) || 
                  (g.assigneeName === 'All' && m.role.toLowerCase().includes('dad')) || 
                  (g.assigneeName === 'All' && m.role.toLowerCase().includes('mom'))
                ) {
                  return { ...m, points: m.points + g.pointsReward };
                }
                return m;
              });
              localStorage.setItem('driftwood_members_points_v1', JSON.stringify(updated));
            }
          } catch {}

          // Write dynamic activity logs
          try {
            const logsRaw = localStorage.getItem('driftwood_behavior_logs_v1');
            const now = new Date();
            const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            const newLog = {
              id: 'log-' + Date.now(),
              memberName: g.assigneeName,
              behaviorName: `Goal Met: ${g.title}`,
              points: g.pointsReward,
              emoji: g.emoji,
              timestamp: timeStr
            };
            if (logsRaw) {
              const logs = JSON.parse(logsRaw);
              localStorage.setItem('driftwood_behavior_logs_v1', JSON.stringify([newLog, ...logs.slice(0, 9)]));
            } else {
              localStorage.setItem('driftwood_behavior_logs_v1', JSON.stringify([newLog]));
            }
          } catch {}
        }

        return updatedGoal;
      }
      return g;
    }));
  };

  // Adjust progress increments
  const handleAdjustProgress = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        if (g.completed && amount < 0) {
          // Un-complete if reducing
          return {
            ...g,
            current: Math.max(0, g.current + amount),
            completed: false
          };
        }
        
        const nextCurrent = Math.max(0, Math.min(g.target, g.current + amount));
        const nextCompleted = nextCurrent >= g.target;
        const updatedGoal = {
          ...g,
          current: nextCurrent,
          completed: nextCompleted
        };

        if (nextCompleted && !g.completed) {
          triggerCelebration(updatedGoal);
          
          // Reward assignee
          try {
            const membersRaw = localStorage.getItem('driftwood_members_points_v1');
            if (membersRaw) {
              const list = JSON.parse(membersRaw);
              const updated = list.map((m: any) => {
                if (m.name.toLowerCase().includes(g.assigneeName.toLowerCase())) {
                  return { ...m, points: m.points + g.pointsReward };
                }
                return m;
              });
              localStorage.setItem('driftwood_members_points_v1', JSON.stringify(updated));
            }
          } catch {}

          // Write log
          try {
            const logsRaw = localStorage.getItem('driftwood_behavior_logs_v1');
            const now = new Date();
            const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            const newLog = {
              id: 'log-' + Date.now(),
              memberName: g.assigneeName,
              behaviorName: `Completed Goal: ${g.title}`,
              points: g.pointsReward,
              emoji: g.emoji,
              timestamp: timeStr
            };
            if (logsRaw) {
              const logs = JSON.parse(logsRaw);
              localStorage.setItem('driftwood_behavior_logs_v1', JSON.stringify([newLog, ...logs.slice(0, 9)]));
            } else {
              localStorage.setItem('driftwood_behavior_logs_v1', JSON.stringify([newLog]));
            }
          } catch {}
        }

        return updatedGoal;
      }
      return g;
    }));
  };

  // Add new Goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let assignee: 'Husband' | 'Kids' | 'Family' | 'Couples' | 'Individual' = 'Husband';
    let assigneeName = 'Mark';
    let category: 'Acts of Love' | 'Chore' | 'Follow Directions' | 'Family Objective' | 'Individual Goal' = 'Acts of Love';
    let emoji = newEmoji;

    if (newGroup === 'husband') {
      assignee = 'Husband';
      assigneeName = 'Mark';
      category = 'Acts of Love';
      emoji = newEmoji || '❤️';
    } else if (newGroup === 'children') {
      assignee = 'Kids';
      assigneeName = 'Charlie'; 
      category = 'Chore';
      emoji = newEmoji || '🧹';
    } else {
      assignee = 'Couples';
      assigneeName = 'Mark & Sarah';
      category = 'Individual Goal';
      emoji = newEmoji || '💬';
    }

    const newGoal: HouseholdGoal = {
      id: 'g-' + Date.now(),
      title: newTitle.trim(),
      assignee,
      assigneeName,
      category,
      pointsReward: Number(newPoints) || 15,
      completed: false,
      target: Number(newTarget) || 1,
      current: 0,
      unit: newUnit.trim() || 'times',
      emoji
    };

    setGoals(prev => [...prev, newGoal]);
    setNewTitle('');
    setShowAddForm(false);
    
    // Quick pop particle to show addition
    const dummyGoalForEffect = { ...newGoal, emoji: '🎯' };
    triggerCelebration(dummyGoalForEffect);
    setCelebratedGoal(null); // don't show full modal for new addition
  };

  // Add a goal from predesigned clinical templates
  const handleAddClinicalGoal = (model: ClinicalModel) => {
    let assignee: 'Husband' | 'Kids' | 'Couples' | 'Individual' = 'Individual';
    let assigneeName = 'Mark';
    if (model.category === 'Acts of Love') {
      assignee = 'Husband';
      assigneeName = 'Mark';
    } else if (model.category === 'Chore') {
      assignee = 'Kids';
      assigneeName = 'Charlie';
    } else {
      assignee = 'Couples';
      assigneeName = 'Mark & Sarah';
    }

    const templateGoal: HouseholdGoal = {
      id: 'g-' + Date.now(),
      title: model.goalSuggestion,
      assignee,
      assigneeName,
      category: model.category,
      pointsReward: 25,
      completed: false,
      target: 3,
      current: 0,
      unit: 'times',
      emoji: model.goalEmoji
    };

    setGoals(prev => [...prev, templateGoal]);
    setActiveTab('all');
    
    // Particle feedback
    const dummyGoal = { ...templateGoal, emoji: '📚' };
    triggerCelebration(dummyGoal);
    setCelebratedGoal(null); // no modal overlay for template import
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Reset all goals
  const handleResetAll = () => {
    setGoals(prev => prev.map(g => ({ ...g, current: 0, completed: false })));
    const dummyGoal = { id: 'reset', emoji: '♻️' } as any;
    triggerCelebration(dummyGoal);
    setCelebratedGoal(null);
  };

  // Determine if goal matches active filters
  const filteredGoals = goals.filter(g => {
    if (activeTab === 'all') return true;
    if (activeTab === 'husband') return g.assignee === 'Husband' || g.category === 'Acts of Love';
    if (activeTab === 'children') return g.assignee === 'Kids' || g.category === 'Chore' || g.category === 'Follow Directions';
    if (activeTab === 'couple') return g.assignee === 'Couples' || g.assignee === 'Family' || g.category === 'Family Objective' || g.category === 'Individual Goal';
    return true;
  });

  // Pick clinical insight based on goal assignee
  const getClinicalConnectionText = (goal: HouseholdGoal) => {
    if (goal.category === 'Acts of Love' || goal.assignee === 'Husband') {
      return {
        title: "The Gottman Method: Emotional Bank Account",
        text: "John Gottman's research shows that happy couples make 'deposits' into their emotional bank account daily. Small acts of service, verbal check-ins, or morning drinks show deliberate connection, which neutralizes stress during tough times."
      };
    } else if (goal.category === 'Chore' || goal.category === 'Follow Directions') {
      return {
        title: "Structural Family Sub-Systems & Predictability",
        text: "In Structural Family Therapy, kids flourish when parents establish clear, consistent structures. Completing chores or following directions on prompt builds reliable accountability, validating the parent-child subsystem and lowering home friction."
      };
    } else {
      return {
        title: "Emotionally Focused Therapy: Secure Bond Loops",
        text: "Sue Johnson’s EFT emphasizes co-regulation. Shared game nights, active dialogue, and vulnerable listening act as secure attachment reinforcers, replacing toxic disconnect cycles with safe, warm proximity."
      };
    }
  };

  return (
    <div className="flex flex-col gap-4 py-2 w-full max-w-md mx-auto text-on-background relative select-none">
      
      {/* Top Header Row */}
      <div className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-[2rem] border-2 border-outline-variant shadow-sm relative overflow-hidden">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-slate-100 border border-outline-variant hover:bg-slate-200 transition-colors flex items-center justify-center text-on-surface cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
        <div className="flex-grow">
          <h2 className="font-display font-black text-sm text-on-surface flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-primary animate-pulse" />
            <span>Household Goals</span>
          </h2>
          <p className="font-sans text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Active Alignment Dashboard</p>
        </div>
        
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary/10 text-primary hover:bg-primary/20 px-2.5 py-1.5 rounded-xl border border-primary/25 font-display font-black text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Close' : 'New Goal'}</span>
        </button>
      </div>

      {/* Clinical Guidance Tip Banner */}
      <div className="bg-primary/5 border-2 border-primary/10 rounded-[2rem] p-3.5 flex gap-3 items-start text-[10.5px] leading-relaxed text-[#4B4B4B]">
        <span className="text-xl shrink-0 mt-0.5">💡</span>
        <div>
          <strong className="text-[11px] text-primary">Systemic Alignment Hub:</strong> 
          <p className="font-sans mt-0.5 text-[10px] text-on-surface-variant leading-relaxed">
            Monitor daily acts of love, kids' directions, and shared goals. Completed goals deposit rewards directly into character stats while reinforcing evidence-based relationship therapy models!
          </p>
        </div>
      </div>

      {/* Segmented Filter Tab Bar */}
      <div className="flex bg-surface-container rounded-2xl p-1 gap-1 border-2 border-outline-variant">
        {[
          { id: 'all', label: 'All Goals', activeBg: 'bg-[#1CB0F6] border-[#1899D6] text-white shadow-sm' },
          { id: 'husband', label: '👨 Husband', activeBg: 'bg-[#FF5A5F] border-[#d83c41] text-white shadow-sm' },
          { id: 'children', label: '🧒 Kids Chores', activeBg: 'bg-[#58CC02] border-[#46A302] text-white shadow-sm' },
          { id: 'couple', label: '💑 Couples', activeBg: 'bg-[#CE9FFC] border-[#b784f9] text-white shadow-sm' },
          { id: 'clinical', label: '📚 Models', activeBg: 'bg-amber-500 border-amber-600 text-white shadow-sm' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setShowAddForm(false);
            }}
            className={`flex-1 font-display font-black text-[8.5px] py-2 px-0.5 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center ${
              activeTab === tab.id 
                ? tab.activeBg
                : 'text-[#4B4B4B] hover:bg-surface-container-high'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add New Goal Accordion Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddGoal}
            className="bg-white border-2 border-outline-variant p-4 rounded-[2rem] flex flex-col gap-3 shadow-3d-neutral text-[#4B4B4B] overflow-hidden"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
              <h4 className="font-display font-black text-[10px] uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                <PlusCircle className="w-3.5 h-3.5 text-primary" />
                <span>Launch New Accountability Goal</span>
              </h4>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Goal Description</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Empty kitchen recycling bins every Tuesday evening"
                className="w-full bg-slate-50 text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans font-bold text-[#4B4B4B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Responsible Party</label>
                <select
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value as any)}
                  className="w-full bg-slate-50 text-[10px] px-2 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-bold text-[#4B4B4B] appearance-none"
                >
                  <option value="husband">👨 Husband's 'Acts of Love'</option>
                  <option value="children">🧒 Children's 'Chores'</option>
                  <option value="couple">💑 Shared Couple Objective</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Emoji Icon</label>
                <select
                  value={newEmoji}
                  onChange={(e) => setNewEmoji(e.target.value)}
                  className="w-full bg-slate-50 text-[10px] px-2 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-bold text-[#4B4B4B] appearance-none"
                >
                  {['❤️', '☕', '🧹', '🍽️', '📝', '🎫', '🎒', '🎲', '💬', '🏃', '🍕', '🛋️', '🌱', '🍿'].map(em => (
                    <option key={em} value={em}>{em} {em === '❤️' ? 'Love' : em === '☕' ? 'Coffee' : em === '🧹' ? 'Clean' : em === '🍽️' ? 'Dishes' : em === '📝' ? 'Note' : em === '🎫' ? 'Ticket' : em === '🎲' ? 'Game' : 'General'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Target Count</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
                  className="w-full bg-slate-50 text-[10px] px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold text-center"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Target Unit</label>
                <input
                  type="text"
                  required
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  placeholder="times"
                  className="w-full bg-slate-50 text-[10px] px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold text-center"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">XP Reward</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  required
                  value={newPoints}
                  onChange={(e) => setNewPoints(Number(e.target.value))}
                  className="w-full bg-slate-50 text-[10px] px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary text-white font-display font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider border-b-[4px] border-primary-dark hover:brightness-105 active:translate-y-[2px] active:border-b-[2px] transition-all cursor-pointer text-center mt-2 shadow-sm"
            >
              Add Household Goal
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Goal Cards List / Clinical Models view */}
      <div className="flex flex-col gap-3.5 relative min-h-[300px]">
        
        {/* Floating Sparkle Particles (Triggered on Complete) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-40">
          <AnimatePresence>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 0.3, x: 0, y: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0.5, 2.0, 1.0],
                  x: p.x,
                  y: p.y,
                  rotate: Math.random() * 240 - 120
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="absolute text-2xl pointer-events-none select-none drop-shadow"
                style={{ top: '80px' }}
              >
                {p.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="popLayout">
          {activeTab === 'clinical' ? (
            /* Clinical Reference Library View */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-3"
            >
              <div className="bg-amber-500/10 border-2 border-amber-500/25 p-3.5 rounded-2xl text-[10px] leading-relaxed text-[#4B4B4B]">
                <strong className="text-amber-700 flex items-center gap-1">
                  <BookOpen className="w-4.5 h-4.5 shrink-0" />
                  Clinical Therapy Models Catalog
                </strong>
                <p className="font-sans text-on-surface-variant text-[9.5px] mt-1 leading-relaxed">
                  These 6 popular models represent evidence-based relationship therapies. Tap any to instantly generate an active, tracked household goal!
                </p>
              </div>

              {clinicalModels.map((model) => (
                <div
                  key={model.id}
                  className="bg-white border-2 border-outline-variant p-4 rounded-[2rem] shadow-sm hover:border-amber-300 transition-all flex flex-col gap-2.5 relative"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-2xl p-1 bg-amber-500/10 rounded-xl select-none">{model.goalEmoji}</span>
                    <div>
                      <h4 className="font-display font-black text-xs text-[#4B4B4B]">{model.name}</h4>
                      <span className="text-[7.5px] font-black uppercase tracking-widest text-on-surface-variant/75">Founder: {model.creator}</span>
                    </div>
                  </div>

                  <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed">
                    <strong>Premise:</strong> {model.description}
                  </p>

                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[9.5px] text-[#4B4B4B] leading-relaxed">
                    <span className="font-bold text-amber-600 uppercase tracking-wide text-[7.5px] block mb-0.5">Clinical Practice Routine:</span>
                    {model.howItWorks}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddClinicalGoal(model)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-display font-black py-2 rounded-xl text-[8.5px] uppercase tracking-wider border-b-[3px] border-amber-700 active:translate-y-[1px] active:border-b-[1px] transition-all flex items-center justify-center gap-1.5 mt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Adopt Practice Goal: "{model.goalSuggestion}"</span>
                  </button>
                </div>
              ))}
            </motion.div>
          ) : filteredGoals.length === 0 ? (
            /* Empty Goals state */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-slate-50 border-2 border-outline-variant rounded-[2rem] p-8 text-center text-[#4B4B4B]"
            >
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-display font-black text-xs uppercase tracking-wider text-on-surface-variant">No active goals</h3>
              <p className="font-sans text-[10px] text-on-surface-variant/85 mt-1 max-w-[220px] mx-auto leading-relaxed">
                Click "New Goal" above or explore the "Models" catalog to generate relationship practices.
              </p>
            </motion.div>
          ) : (
            /* Active Goals List with responsive completion physics */
            filteredGoals.map((g) => {
              const pct = Math.round((g.current / g.target) * 100);
              
              // Define distinct themes per category
              let themeColor = 'bg-[#1CB0F6]'; 
              let badgeColor = 'bg-slate-100 text-slate-700';

              if (g.assignee === 'Husband' || g.category === 'Acts of Love') {
                themeColor = 'bg-[#FF5A5F]';
                badgeColor = 'bg-rose-50 text-[#FF5A5F] border-rose-100';
              } else if (g.assignee === 'Kids' || g.category === 'Chore' || g.category === 'Follow Directions') {
                themeColor = 'bg-[#58CC02]';
                badgeColor = 'bg-green-50 text-green-700 border-green-100';
              } else {
                themeColor = 'bg-[#CE9FFC]';
                badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-100';
              }

              return (
                <motion.div
                  layout
                  key={g.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-white border-2 p-4 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col gap-3 transition-all ${
                    g.completed ? 'bg-slate-50 border-outline-variant/60 opacity-80' : 'border-outline-variant hover:border-slate-300'
                  }`}
                >
                  {/* Goal Info Row */}
                  <div className="flex justify-between items-start min-w-0 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl shrink-0 select-none">{g.emoji}</span>
                      <div className="min-w-0">
                        <span className={`text-[7.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border inline-block ${badgeColor}`}>
                          {g.category} • {g.assigneeName}
                        </span>
                        <h4 className={`font-sans text-[11.5px] font-black text-[#4B4B4B] leading-snug mt-1 break-words ${g.completed ? 'line-through text-on-surface-variant/60 italic' : ''}`}>
                          {g.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteGoal(g.id)}
                      className="text-on-surface-variant hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all cursor-pointer opacity-30 hover:opacity-100 shrink-0"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Progress stats and animated bar */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bold text-on-surface-variant">
                      <span>Progress: <span className="font-mono text-[#4B4B4B]">{g.current} / {g.target} {g.unit}</span></span>
                      <span>{pct}%</span>
                    </div>

                    {/* Progress Track */}
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 relative shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ type: 'spring', stiffness: 80 }}
                        className={`h-full rounded-full ${themeColor}`}
                      />
                    </div>
                  </div>

                  {/* Interactivity controls (checkbox toggle & incremental buttons) */}
                  <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 gap-2">
                    {/* Incremental +/- Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAdjustProgress(g.id, -1)}
                        disabled={g.current === 0}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          g.current === 0 
                            ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed' 
                            : 'bg-white border-outline-variant hover:bg-slate-100 text-[#4B4B4B]'
                        }`}
                        title="Decrement Progress"
                      >
                        <span className="text-xs font-black">-1</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdjustProgress(g.id, 1)}
                        disabled={g.current >= g.target}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          g.current >= g.target 
                            ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed' 
                            : 'bg-white border-outline-variant hover:bg-slate-100 text-[#4B4B4B]'
                        }`}
                        title="Increment Progress"
                      >
                        <span className="text-xs font-black">+1</span>
                      </button>
                    </div>

                    {/* Checkbox toggle ('Mark as Complete') */}
                    <button
                      type="button"
                      onClick={() => handleToggleGoalComplete(g.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-sans font-black text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                        g.completed
                          ? 'bg-[#58CC02] border-[#46A302] text-white shadow-3d-secondary'
                          : 'bg-white border-outline-variant hover:border-primary text-on-surface-variant'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border-1.5 shrink-0 ${
                        g.completed 
                          ? 'border-white bg-white/20 text-white' 
                          : 'border-slate-400 bg-white'
                      }`}>
                        {g.completed && <Check className="w-2.5 h-2.5 stroke-[4px]" />}
                      </div>
                      <span>{g.completed ? 'Completed' : 'Mark Complete'}</span>
                    </button>
                  </div>

                  {/* XP Reward Indicator inside card */}
                  <div className="absolute top-3 right-10 flex items-center gap-1 bg-amber-500/10 text-amber-600 font-mono text-[8.5px] font-black px-1.5 py-0.5 rounded border border-amber-500/15">
                    <span>🪙</span>
                    <span>+{g.pointsReward} XP</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Bulk controls */}
      <div className="flex gap-2 justify-between items-center mt-2 bg-surface-container-lowest p-3 rounded-[2rem] border-2 border-outline-variant">
        <span className="text-[10px] font-sans font-bold text-on-surface-variant">Active goals: <span className="font-mono text-[#4B4B4B] font-bold">{goals.length}</span></span>
        
        <button
          type="button"
          onClick={handleResetAll}
          className="text-[8.5px] font-black uppercase text-on-surface-variant hover:text-primary flex items-center gap-1.5 cursor-pointer bg-surface-container px-3 py-2 rounded-xl border border-outline-variant transition-all hover:scale-105"
        >
          <span>🔄 Reset Progress</span>
        </button>
      </div>

      {/* Full-Screen celebratory Modal overlay when a goal is completed */}
      <AnimatePresence>
        {celebratedGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Pop-up container */}
            <motion.div
              initial={{ scale: 0.85, y: 30, rotate: -2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.85, y: 30, rotate: 2 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white border-4 border-primary rounded-[2.5rem] shadow-2xl p-6 max-w-xs w-full text-center relative overflow-hidden flex flex-col gap-4.5"
            >
              {/* Confetti canvas backdrop */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#1CB0F6_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Bouncy Big Emoji & Sparkles */}
              <div className="relative inline-block mx-auto mt-2">
                <motion.div
                  animate={{
                    scale: [1, 1.25, 0.95, 1.15, 1],
                    rotate: [0, 10, -10, 5, 0]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 3 }}
                  className="text-6xl select-none relative z-10"
                >
                  {celebratedGoal.emoji}
                </motion.div>
                
                {/* Sparkle background elements */}
                <motion.div
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-3 -right-3 text-2xl"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{ scale: [1.2, 0.8, 1.2], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="absolute -bottom-2 -left-3 text-xl"
                >
                  🌟
                </motion.div>
              </div>

              {/* Completed Message */}
              <div className="relative z-10">
                <h3 className="font-display font-black text-lg text-primary uppercase tracking-tight leading-tight">
                  Goal Smashed!
                </h3>
                <span className="text-[8px] font-black uppercase tracking-widest text-[#FF5A5F] bg-rose-50 px-2 py-0.5 rounded border border-rose-100 inline-block mt-1">
                  {celebratedGoal.assigneeName}'s Victory
                </span>
                <p className="font-sans text-[11px] text-[#4B4B4B] font-bold mt-2 leading-snug">
                  "{celebratedGoal.title}"
                </p>
              </div>

              {/* Rewards Box */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl py-2 px-3 flex justify-center items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
                <div className="text-left">
                  <span className="text-[14px] font-mono font-black text-amber-600 block leading-none">+{celebratedGoal.pointsReward} XP</span>
                  <span className="text-[8px] font-sans font-bold text-amber-700 uppercase tracking-wider">Deposited to Wallet</span>
                </div>
              </div>

              {/* Relationship clinical connection mapping */}
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 text-left">
                <span className="font-display font-black text-[8px] uppercase tracking-wider text-primary flex items-center gap-1 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>{getClinicalConnectionText(celebratedGoal).title}</span>
                </span>
                <p className="font-sans text-[9px] text-[#4B4B4B] leading-relaxed">
                  {getClinicalConnectionText(celebratedGoal).text}
                </p>
              </div>

              {/* Keep Growing button */}
              <button
                type="button"
                onClick={() => setCelebratedGoal(null)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-display font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider border-b-[4px] border-primary-dark active:translate-y-[2px] active:border-b-[2px] transition-all cursor-pointer shadow-md mt-1 z-10"
              >
                Keep Growing! ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
