import React, { useState, useEffect } from 'react';
import AttachmentMapper from './AttachmentMapper';
import { 
  Award, 
  Sparkles, 
  Smartphone, 
  BookOpen, 
  Plus, 
  Trash2, 
  Coins, 
  Gift, 
  Check, 
  ChevronRight, 
  Users, 
  Heart, 
  AlertCircle, 
  Activity,
  ThumbsUp,
  Flame,
  Timer,
  RefreshCw,
  Play,
  MessageSquare,
  Camera,
  Compass,
  Trophy,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FamilyMemberPoints {
  id: string;
  name: string;
  points: number;
  avatar: string;
  role: string;
}

interface BehaviorTask {
  id: string;
  name: string;
  points: number;
  emoji: string;
  category: 'cooperative' | 'cbt' | 'responsibility' | 'custom';
}

interface RewardItem {
  id: string;
  name: string;
  cost: number;
  emoji: string;
}

interface BehaviorLog {
  id: string;
  memberName: string;
  behaviorName: string;
  points: number;
  emoji: string;
  timestamp: string;
}

interface IntimacyCard {
  id: string;
  category: 'lovemap' | 'bid' | 'spark';
  categoryLabel: string;
  question: string;
  hint: string;
  bgGradient: string;
}

interface ScavengerChallenge {
  id: string;
  title: string;
  emoji: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  pointsReward: number;
  completed: boolean;
}

interface TherapyHomework {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  steps: string[];
  activeStepIndex: number;
  completed: boolean;
}

const INTIMACY_CARDS: IntimacyCard[] = [
  { 
    id: 'c1', 
    category: 'lovemap', 
    categoryLabel: "Intimate Love Maps",
    question: "What is your partner's current biggest stressor in their life outside of your relationship, and what is one small way you can support them tonight?", 
    hint: "Think about their workplace challenges, family commitments, or personal pressures.",
    bgGradient: "from-rose-500 to-pink-600"
  },
  { 
    id: 'c2', 
    category: 'lovemap', 
    categoryLabel: "Intimate Love Maps",
    question: "Name three specific musical artists, albums, or genres that have defined your partner's taste over their lifetime.", 
    hint: "Recall old road trips, concerts, or late-night playlists they often play.",
    bgGradient: "from-purple-600 to-indigo-700"
  },
  { 
    id: 'c3', 
    category: 'bid', 
    categoryLabel: "Bids for Intimacy",
    question: "Turn to your partner, lock eye contact for 5 seconds, and share one minor daily habit of theirs that you secretly find comforting or adorable.", 
    hint: "It could be how they hold their morning mug, their focus expression, or how they laugh.",
    bgGradient: "from-teal-500 to-emerald-600"
  },
  { 
    id: 'c4', 
    category: 'spark', 
    categoryLabel: "Co-op Spark Sparker",
    question: "If we were awarded an absolute surprise 3-day weekend with all expenses covered, what specific getaway or hidden spot would you immediately pitch to me?", 
    hint: "Do they prefer quiet woods, a windy beach, or an active metropolitan escape?",
    bgGradient: "from-orange-500 to-amber-600"
  },
  { 
    id: 'c5', 
    category: 'lovemap', 
    categoryLabel: "Intimate Love Maps",
    question: "What is a major dream or long-term personal aspiration your partner holds that they rarely speak about because of day-to-day survival responsibilities?", 
    hint: "Reflect on their childhood dreams or nostalgic creative hobbies.",
    bgGradient: "from-blue-600 to-sky-700"
  },
  { 
    id: 'c6', 
    category: 'bid', 
    categoryLabel: "Bids for Intimacy",
    question: "What is one way your partner demonstrated their primary Love Language this week, and how did it make you feel physically or emotionally?", 
    hint: "Was it Words of Affirmation, Acts of Service, Quality Time, Physical Touch, or Gifts?",
    bgGradient: "from-rose-600 to-red-500"
  },
  { 
    id: 'c7', 
    category: 'spark', 
    categoryLabel: "Co-op Spark Sparker",
    question: "What does physical affection mean to you when you are feeling intensely overwhelmed or stressed? Do you crave silent holding or verbal comfort?", 
    hint: "Reflect on how your sensory comfort parameters shift during stress.",
    bgGradient: "from-emerald-600 to-cyan-600"
  }
];

export default function FamilyToolsSection({ onViewGenogram }: { onViewGenogram?: () => void }) {
  const [activeTab, setActiveTab] = useState<'chart' | 'playroom' | 'guides' | 'apps'>('playroom');
  const [showAttachmentMapper, setShowAttachmentMapper] = useState(false);
  
  // --- STATE 1: BEHAVIORAL REINFORCEMENT SYSTEM ---
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberPoints[]>(() => {
    try {
      const saved = localStorage.getItem('familyframe_members_points_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'm1', name: 'Mark', role: 'Husband (Dad)', points: 65, avatar: '👨' },
      { id: 'm2', name: 'Sarah', role: 'Partner (Mom)', points: 80, avatar: '👩' },
      { id: 'm3', name: 'Jamie', role: 'Teenager', points: 45, avatar: '🎧' },
      { id: 'm4', name: 'Charlie', role: 'Child', points: 20, avatar: '🧒' }
    ];
  });

  const [behaviorTasks, setBehaviorTasks] = useState<BehaviorTask[]>(() => {
    try {
      const saved = localStorage.getItem('familyframe_behavior_tasks_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'b1', name: 'Expressed raw frustration calmly using an "I feel" statement', points: 20, emoji: '💬', category: 'cbt' },
      { id: 'b2', name: 'Cooperated with sibling or parent without trigger responses', points: 15, emoji: '🤝', category: 'cooperative' },
      { id: 'b3', name: 'Bedtime routine completed independently on first request', points: 15, emoji: '💤', category: 'responsibility' },
      { id: 'b4', name: 'Cleaned bedroom / organized toys and study desk', points: 10, emoji: '🧹', category: 'responsibility' },
      { id: 'b5', name: 'Shared feedback with active listening during dinner round', points: 15, emoji: '🍕', category: 'cbt' }
    ];
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    try {
      const saved = localStorage.getItem('familyframe_rewards_list_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'r1', name: '30-Min Extra Gaming / Digital Screen Time', cost: 40, emoji: '🎮' },
      { id: 'r2', name: 'Choose Sunday morning family pancake specials', cost: 60, emoji: '🥞' },
      { id: 'r3', name: 'One-on-one special dessert date with Mom/Dad', cost: 80, emoji: '🍨' },
      { id: 'r4', name: 'Exempt from one standard household chore this week', cost: 100, emoji: '🃏' }
    ];
  });

  const [logs, setLogs] = useState<BehaviorLog[]>(() => {
    try {
      const saved = localStorage.getItem('familyframe_behavior_logs_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'l1', memberName: 'Jamie', behaviorName: 'Cleaned bedroom / organized toys and study desk', points: 10, emoji: '🧹', timestamp: 'Today, 4:15 PM' },
      { id: 'l2', memberName: 'Charlie', behaviorName: 'Cooperated with sibling or parent without trigger responses', points: 15, emoji: '🤝', timestamp: 'Yesterday, 6:00 PM' }
    ];
  });

  // --- STATE 1B: WEEKLY GOALS & FAMILY RESULTS MEETING SYSTEMS ---
  const [familyGoals, setFamilyGoals] = useState<{
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
  }[]>(() => {
    try {
      const saved = localStorage.getItem('familyframe_weekly_goals_v1');
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

  const [weeklyMeetingActive, setWeeklyMeetingActive] = useState(false);
  const [meetingStep, setMeetingStep] = useState(1);
  const [meetingAppreciationDone, setMeetingAppreciationDone] = useState<string[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  
  // New goal form states
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalAssignee, setNewGoalAssignee] = useState<'Husband' | 'Kids' | 'Family' | 'Couples' | 'Individual'>('Husband');
  const [newGoalAssigneeName, setNewGoalAssigneeName] = useState('Mark');
  const [newGoalCategory, setNewGoalCategory] = useState<'Acts of Love' | 'Chore' | 'Follow Directions' | 'Family Objective' | 'Individual Goal'>('Acts of Love');
  const [newGoalTarget, setNewGoalTarget] = useState(3);
  const [newGoalPoints, setNewGoalPoints] = useState(20);
  const [newGoalUnit, setNewGoalUnit] = useState('times');
  const [newGoalEmoji, setNewGoalEmoji] = useState('❤️');

  const [selectedGoalFilter, setSelectedGoalFilter] = useState<'All' | 'Husband' | 'Kids' | 'Family/Couples'>('All');

  // Form states
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState('🧒');
  const [newMemberRole, setNewMemberRole] = useState('Child');

  const [showAddBehavior, setShowAddBehavior] = useState(false);
  const [newBehaviorName, setNewBehaviorName] = useState('');
  const [newBehaviorPoints, setNewBehaviorPoints] = useState(15);
  const [newBehaviorEmoji, setNewBehaviorEmoji] = useState('🌟');
  const [newBehaviorCat, setNewBehaviorCat] = useState<'cooperative' | 'cbt' | 'responsibility' | 'custom'>('custom');

  const [showAddReward, setShowAddReward] = useState(false);
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardCost, setNewRewardCost] = useState(50);
  const [newRewardEmoji, setNewRewardEmoji] = useState('🎁');

  // Interactive reward and logging handlers
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  // --- COOP PLAYROOM & HOMEWORK STATES ---
  const [scavengerChallenges, setScavengerChallenges] = useState<ScavengerChallenge[]>(() => {
    try {
      const saved = localStorage.getItem('familyframe_scavenger_challenges_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'sh1',
        title: "Sensory Memory Hunt",
        emoji: "📸",
        description: "Silently scour the house to find a physical object that represents a goofy, joyful, or deeply cozy shared memory. Place it on the kitchen table and explain your choice.",
        difficulty: 'easy',
        pointsReward: 25,
        completed: false
      },
      {
        id: 'sh2',
        title: "The Hidden Note Ambush",
        emoji: "✉️",
        description: "Write a brief, specific, two-sentence appreciation note on a physical slip of paper. Hide it in their car, wallet, or pocket where they are guaranteed to stumble upon it.",
        difficulty: 'easy',
        pointsReward: 30,
        completed: false
      },
      {
        id: 'sh3',
        title: "The Comfort Treat Swap",
        emoji: "☕",
        description: "Surprise your partner by preparing their favorite quick comfort treat, tea, coffee, or dessert entirely unprompted when they are busy or winding down.",
        difficulty: 'medium',
        pointsReward: 40,
        completed: false
      },
      {
        id: 'sh4',
        title: "10-Min Tech-Free Sanctuary",
        emoji: "🛋️",
        description: "Concurrently power down or silence all personal digital devices. Sit closely for 10 minutes, and share your favorite highlight from each other's childhood.",
        difficulty: 'medium',
        pointsReward: 45,
        completed: false
      }
    ];
  });

  const [therapyHomework, setTherapyHomework] = useState<TherapyHomework[]>(() => {
    try {
      const saved = localStorage.getItem('familyframe_therapy_homework_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'hw1',
        title: "Gottman's Softened Startup practice",
        subtitle: "Dismantle critical defensiveness early",
        emoji: "💬",
        description: "Therapists emphasize starting complaints softly. Never start with 'You always' or blame. Instead, practice the clinical formula: 'I feel [emotion] about [specific event] and I need [positive action]'.",
        steps: [
          "Step 1: Identify a recent friction point (e.g., dishes left in sink, scheduling delay).",
          "Step 2: Choose your feeling label carefully (e.g., overwhelmed, lonely, invisible, unheard).",
          "Step 3: State the facts objectively without globalizations or 'always' statements.",
          "Step 4: Formulate a clear positive request for what you need to solve this collaboratively."
        ],
        activeStepIndex: 0,
        completed: false
      },
      {
        id: 'hw2',
        title: "Weekly 'State of the Union' Meeting",
        subtitle: "Systemic structured marital alignment",
        emoji: "📋",
        description: "A highly acclaimed structured co-op check-in that protects marriages against chronic drift. Dedicate 30 minutes of uninterrupted screen-free time to review 4 distinct chapters.",
        steps: [
          "Chapter 1: Appreciation Exchange (Share 5 specific actions you noticed and loved about your partner this week).",
          "Chapter 2: What Went Well? (Discuss structural victories in household management, budget, or schedules).",
          "Chapter 3: Hurt Feelings Check (Gently air and heal any unresolved friction using speaker-listener rules).",
          "Chapter 4: Love Planning (How can I make you feel adored, respected, and securely desired this coming week?)"
        ],
        activeStepIndex: 0,
        completed: false
      }
    ];
  });

  // Card deck states
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [selectedCardCategory, setSelectedCardCategory] = useState<'all' | 'lovemap' | 'bid' | 'spark'>('all');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [revealAnswerIdea, setRevealAnswerIdea] = useState(false);

  // Softened startup builder states
  const [startupEmotion, setStartupEmotion] = useState('overwhelmed');
  const [startupEvent, setStartupEvent] = useState('');
  const [startupNeed, setStartupNeed] = useState('');
  const [startupEvaluation, setStartupEvaluation] = useState<string | null>(null);

  // Kiss timer states
  const [kissTimerSeconds, setKissTimerSeconds] = useState(0);
  const [kissTimerActive, setKissTimerActive] = useState(false);
  const [kissTimerSuccess, setKissTimerSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('familyframe_members_points_v1', JSON.stringify(familyMembers));
      localStorage.setItem('familyframe_behavior_tasks_v1', JSON.stringify(behaviorTasks));
      localStorage.setItem('familyframe_rewards_list_v1', JSON.stringify(rewards));
      localStorage.setItem('familyframe_behavior_logs_v1', JSON.stringify(logs));
      localStorage.setItem('familyframe_scavenger_challenges_v1', JSON.stringify(scavengerChallenges));
      localStorage.setItem('familyframe_therapy_homework_v1', JSON.stringify(therapyHomework));
      localStorage.setItem('familyframe_weekly_goals_v1', JSON.stringify(familyGoals));
    } catch {}
  }, [familyMembers, behaviorTasks, rewards, logs, scavengerChallenges, therapyHomework, familyGoals]);

  const triggerCelebration = (emoji: string) => {
    const emojis = [emoji, '✨', '🎉', '🌟', '👍', '💪'];
    const newParticles = Array.from({ length: 14 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 160 - 80,
      y: Math.random() * -120 - 40,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  // 6-Second Kiss Timer countdown loop
  useEffect(() => {
    let interval: any = null;
    if (kissTimerActive && kissTimerSeconds > 0) {
      interval = setInterval(() => {
        setKissTimerSeconds(prev => {
          if (prev <= 1) {
            setKissTimerActive(false);
            setKissTimerSuccess(true);
            triggerCelebration('💋');
            setToastMessage('💋 Completed! Oxytocin alignment & relational safety established!');
            setTimeout(() => setToastMessage(null), 3500);
            
            // Log points directly to family members if possible
            setFamilyMembers(prevM => prevM.map(m => m.id === 'm1' || m.id === 'm2' ? { ...m, points: m.points + 10 } : m));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [kissTimerActive, kissTimerSeconds]);

  const handleToggleScavenger = (id: string) => {
    setScavengerChallenges(prev => prev.map(ch => {
      if (ch.id === id) {
        const nextState = !ch.completed;
        if (nextState) {
          triggerCelebration(ch.emoji);
          setToastMessage(`🎉 Scavenger Hunt Complete: "${ch.title}" (+${ch.pointsReward} pts)!`);
          setTimeout(() => setToastMessage(null), 3500);
          
          // Log points to family members
          setFamilyMembers(prevM => prevM.map(m => m.id === 'm1' || m.id === 'm2' ? { ...m, points: m.points + ch.pointsReward } : m));
          
          // Add to log ledger
          const now = new Date();
          const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          const newLog: BehaviorLog = {
            id: 'log-' + Date.now(),
            memberName: 'Couples',
            behaviorName: `Scavenger Challenge: ${ch.title}`,
            points: ch.pointsReward,
            emoji: ch.emoji,
            timestamp: timeStr
          };
          setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 9)]);
        }
        return { ...ch, completed: nextState };
      }
      return ch;
    }));
  };

  const handleAdvanceHomeworkStep = (hwId: string) => {
    setTherapyHomework(prev => prev.map(hw => {
      if (hw.id === hwId) {
        const nextStep = hw.activeStepIndex + 1;
        if (nextStep >= hw.steps.length) {
          // Completed!
          triggerCelebration('🏆');
          setToastMessage(`🏆 Therapy Homework Completed: "${hw.title}" (+50 pts)!`);
          setTimeout(() => setToastMessage(null), 3500);
          
          // Log points
          setFamilyMembers(prevM => prevM.map(m => m.id === 'm1' || m.id === 'm2' ? { ...m, points: m.points + 50 } : m));
          
          // Add to ledger
          const now = new Date();
          const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          const newLog: BehaviorLog = {
            id: 'log-' + Date.now(),
            memberName: 'Couples',
            behaviorName: `Therapy Homework Complete: ${hw.title}`,
            points: 50,
            emoji: '🏆',
            timestamp: timeStr
          };
          setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 9)]);
          
          return { ...hw, activeStepIndex: 0, completed: true };
        }
        return { ...hw, activeStepIndex: nextStep };
      }
      return hw;
    }));
  };

  const handleEvaluateStartup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startupEvent.trim() || !startupNeed.trim()) {
      setStartupEvaluation("❌ Please fill in the blanks to evaluate your softened startup draft.");
      return;
    }
    
    setStartupEvaluation(`✨ SECURE ATTACHMENT SCORE: 100/100!
Your draft: "I feel ${startupEmotion} about ${startupEvent.trim()} and I need ${startupNeed.trim()}."

Clinical Feedback:
1. Emotion First: By framing your initial words around your raw vulnerability ('I feel ${startupEmotion}'), you completely bypass your partner's survival defense shield.
2. Facts Only: By framing the situation around specific occurrences, you avoid toxic generalizations like 'You always...' or 'You never...'.
3. Positive Request: By stating what you need collaboratively, you provide a helpful playbook for co-op repair instead of leaving them feeling trapped or blamed. Excellent secure communication work!`);
    
    // Grant 10 bonus points!
    setFamilyMembers(prevM => prevM.map(m => m.id === 'm1' || m.id === 'm2' ? { ...m, points: m.points + 10 } : m));
    triggerCelebration('💬');
    
    // Add to ledger
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newLog: BehaviorLog = {
      id: 'log-' + Date.now(),
      memberName: 'Couples',
      behaviorName: `Softened Startup Practiced: "I feel ${startupEmotion}"`,
      points: 10,
      emoji: '💬',
      timestamp: timeStr
    };
    setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 9)]);
  };

  const handleAwardPoints = (memberId: string, task: BehaviorTask) => {
    setFamilyMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const updatedPoints = m.points + task.points;
        
        // Add log
        const now = new Date();
        const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        const newLog: BehaviorLog = {
          id: 'log-' + Date.now(),
          memberName: m.name,
          behaviorName: task.name,
          points: task.points,
          emoji: task.emoji,
          timestamp: timeStr
        };
        setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 9)]);

        setToastMessage(`Awarded +${task.points} pts to ${m.name}! 🎉`);
        setTimeout(() => setToastMessage(null), 3000);
        triggerCelebration(task.emoji);

        // Also add a little milestone to timeline in localStorage indirectly if possible
        try {
          const milestonesRaw = localStorage.getItem('familyframe_milestones_v1');
          if (milestonesRaw) {
            const list = JSON.parse(milestonesRaw);
            list.push({
              id: 'ms-points-' + Date.now(),
              title: `${m.name} earned points: ${task.emoji} ${task.name}`,
              date: new Date().toISOString().split('T')[0],
              emoji: '🏆',
              category: 'personal',
              isCustom: true
            });
            localStorage.setItem('familyframe_milestones_v1', JSON.stringify(list));
          }
        } catch {}

        return { ...m, points: updatedPoints };
      }
      return m;
    }));
  };

  const handleRedeemReward = (memberId: string, reward: RewardItem) => {
    let success = false;
    setFamilyMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        if (m.points >= reward.cost) {
          const updatedPoints = m.points - reward.cost;
          success = true;

          // Add log
          const now = new Date();
          const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          const newLog: BehaviorLog = {
            id: 'log-' + Date.now(),
            memberName: m.name,
            behaviorName: `Redeemed Reward: ${reward.name}`,
            points: -reward.cost,
            emoji: reward.emoji,
            timestamp: timeStr
          };
          setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 9)]);

          setToastMessage(`Redeemed "${reward.name}" for ${m.name}! 🎁`);
          setTimeout(() => setToastMessage(null), 3500);
          triggerCelebration(reward.emoji);

          return { ...m, points: updatedPoints };
        } else {
          setToastMessage(`❌ ${m.name} needs ${reward.cost - m.points} more points for this reward.`);
          setTimeout(() => setToastMessage(null), 3000);
        }
      }
      return m;
    }));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newM: FamilyMemberPoints = {
      id: 'm-' + Date.now(),
      name: newMemberName.trim(),
      points: 0,
      avatar: newMemberAvatar,
      role: newMemberRole
    };

    setFamilyMembers(prev => [...prev, newM]);
    setNewMemberName('');
    setShowAddMember(false);
  };

  const handleAddBehavior = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBehaviorName.trim()) return;

    const newB: BehaviorTask = {
      id: 'b-' + Date.now(),
      name: newBehaviorName.trim(),
      points: Number(newBehaviorPoints),
      emoji: newBehaviorEmoji,
      category: newBehaviorCat
    };

    setBehaviorTasks(prev => [...prev, newB]);
    setNewBehaviorName('');
    setShowAddBehavior(false);
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardName.trim()) return;

    const newR: RewardItem = {
      id: 'r-' + Date.now(),
      name: newRewardName.trim(),
      cost: Number(newRewardCost),
      emoji: newRewardEmoji
    };

    setRewards(prev => [...prev, newR]);
    setNewRewardName('');
    setShowAddReward(false);
  };

  const handleDeleteMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleDeleteBehavior = (id: string) => {
    setBehaviorTasks(prev => prev.filter(b => b.id !== id));
  };

  const handleDeleteReward = (id: string) => {
    setRewards(prev => prev.filter(r => r.id !== id));
  };

  const handleIncrementGoalProgress = (id: string) => {
    setFamilyGoals(prevGoals => prevGoals.map(g => {
      if (g.id === id) {
        if (g.completed) return g;
        const nextVal = g.current + 1;
        const isNowCompleted = nextVal >= g.target;
        
        if (isNowCompleted) {
          // Find member to reward
          setFamilyMembers(prevM => prevM.map(m => {
            if (m.name.toLowerCase().includes(g.assigneeName.toLowerCase()) || 
                (g.assigneeName === 'All' && m.role === 'Husband (Dad)') || 
                (g.assigneeName === 'All' && m.role === 'Partner (Mom)')) {
              return { ...m, points: m.points + g.pointsReward };
            }
            return m;
          }));
          
          // Log it
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
          setLogs(prevL => [newLog, ...prevL.slice(0, 9)]);
          
          setToastMessage(`🎉 Goal Completed! +${g.pointsReward} pts awarded to ${g.assigneeName}!`);
          setTimeout(() => setToastMessage(null), 3500);
          triggerCelebration(g.emoji);
        }
        
        return {
          ...g,
          current: Math.min(g.target, nextVal),
          completed: isNowCompleted
        };
      }
      return g;
    }));
  };

  const handleToggleGoalComplete = (id: string) => {
    setFamilyGoals(prevGoals => prevGoals.map(g => {
      if (g.id === id) {
        const nextCompleted = !g.completed;
        const nextCurrent = nextCompleted ? g.target : 0;
        
        if (nextCompleted) {
          // Reward assignee
          setFamilyMembers(prevM => prevM.map(m => {
            if (m.name.toLowerCase().includes(g.assigneeName.toLowerCase()) || 
                (g.assigneeName === 'All' && m.role === 'Husband (Dad)') || 
                (g.assigneeName === 'All' && m.role === 'Partner (Mom)')) {
              return { ...m, points: m.points + g.pointsReward };
            }
            return m;
          }));
          
          // Log
          const now = new Date();
          const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          const newLog = {
            id: 'log-' + Date.now(),
            memberName: g.assigneeName,
            behaviorName: `Goal Manual Comp: ${g.title}`,
            points: g.pointsReward,
            emoji: g.emoji,
            timestamp: timeStr
          };
          setLogs(prevL => [newLog, ...prevL.slice(0, 9)]);
          
          setToastMessage(`🎉 Goal Completed! +${g.pointsReward} pts to ${g.assigneeName}!`);
          setTimeout(() => setToastMessage(null), 3500);
          triggerCelebration(g.emoji);
        } else {
          // Deduct points
          setFamilyMembers(prevM => prevM.map(m => {
            if (m.name.toLowerCase().includes(g.assigneeName.toLowerCase())) {
              return { ...m, points: Math.max(0, m.points - g.pointsReward) };
            }
            return m;
          }));
        }
        
        return {
          ...g,
          current: nextCurrent,
          completed: nextCompleted
        };
      }
      return g;
    }));
  };

  const handleDeleteGoal = (id: string) => {
    setFamilyGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    let finalEmoji = newGoalEmoji;
    if (newGoalCategory === 'Acts of Love') finalEmoji = '❤️';
    else if (newGoalCategory === 'Chore') finalEmoji = '🧹';
    else if (newGoalCategory === 'Follow Directions') finalEmoji = '👂';
    else if (newGoalCategory === 'Family Objective') finalEmoji = '🏠';
    else if (newGoalCategory === 'Individual Goal') finalEmoji = '🎯';

    const newG = {
      id: 'g-' + Date.now(),
      title: newGoalTitle.trim(),
      assignee: newGoalAssignee,
      assigneeName: newGoalAssigneeName.trim() || 'All',
      category: newGoalCategory,
      pointsReward: Number(newGoalPoints) || 15,
      completed: false,
      target: Number(newGoalTarget) || 1,
      current: 0,
      unit: newGoalUnit.trim() || 'times',
      emoji: finalEmoji
    };

    setFamilyGoals(prev => [...prev, newG]);
    setNewGoalTitle('');
    setShowAddGoal(false);
    setToastMessage(`🎯 Published Goal: "${newG.title}"`);
    setTimeout(() => setToastMessage(null), 3000);
    triggerCelebration('🎯');
  };

  const handleResetWeeklyGoals = () => {
    setFamilyGoals(prev => prev.map(g => ({
      ...g,
      current: 0,
      completed: false
    })));
    setToastMessage('♻️ Weekly Goals Reset for a Fresh Week!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCompleteWeeklyMeeting = () => {
    // Award 50 bonus points to EVERY member
    setFamilyMembers(prevM => prevM.map(m => ({
      ...m,
      points: m.points + 50
    })));
    
    // Log the alignment meeting
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newLog = {
      id: 'log-' + Date.now(),
      memberName: 'Family',
      behaviorName: 'Weekly Results Alignment Meeting Facilitated & Met Objectives',
      points: 50,
      emoji: '🏆',
      timestamp: timeStr
    };
    setLogs(prevL => [newLog, ...prevL.slice(0, 9)]);
    
    // Reset goals progress for next week
    setFamilyGoals(prev => prev.map(g => ({
      ...g,
      current: 0,
      completed: false
    })));

    setWeeklyMeetingActive(false);
    setMeetingStep(1);
    setMeetingAppreciationDone([]);
    
    setToastMessage('🏆 Meeting Successful! +50 XP Alignment Bonus awarded to everyone!');
    setTimeout(() => setToastMessage(null), 4000);
    triggerCelebration('🏆');
  };

  const filteredCards = INTIMACY_CARDS.filter(c => 
    selectedCardCategory === 'all' ? true : c.category === selectedCardCategory
  );
  const currentCard = filteredCards[activeCardIndex % filteredCards.length] || INTIMACY_CARDS[0];

  if (showAttachmentMapper) {
    return (
      <div className="p-1">
        <AttachmentMapper onBack={() => setShowAttachmentMapper(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 text-on-surface">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-3 px-5 rounded-2xl shadow-xl border text-[11.5px] font-sans font-extrabold uppercase tracking-wide flex items-center gap-2 ${
              toastMessage.includes('❌') 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-[#58CC02] text-white border-green-400'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating particles for behavior rewards */}
      <div className="relative">
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
              className="absolute pointer-events-none text-base z-30 select-none"
              style={{ left: '50%', top: '10px' }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Title block */}
      <div className="bg-primary/5 p-3 rounded-2xl border-2 border-primary/20 text-[10.5px] leading-relaxed text-[#4B4B4B] flex items-start gap-1.5">
        <span className="text-base shrink-0">🛠️</span>
        <p className="font-sans">
          <strong>Family Connection Tools:</strong> Use behavioral point charts to reinforce positive attachment habits, access clinical parenting guides, and explore recommended digital organizers.
        </p>
      </div>

      {/* Segmented controls (Duo theme) */}
      <div className="flex bg-surface-container rounded-2xl p-1 gap-1 border-2 border-outline-variant flex-wrap sm:flex-nowrap">
        <button
          onClick={() => setActiveTab('playroom')}
          className={`flex-1 font-display font-black text-[9px] py-2 px-1 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1 min-w-[80px] ${activeTab === 'playroom' ? 'bg-[#FF5A5F] text-white border-b-4 border-[#d83c41]' : 'text-[#4B4B4B] hover:bg-surface-container-high'}`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Couples Play</span>
        </button>
        <button
          onClick={() => setActiveTab('chart')}
          className={`flex-1 font-display font-black text-[9px] py-2 px-1 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1 min-w-[80px] ${activeTab === 'chart' ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302]' : 'text-[#4B4B4B] hover:bg-surface-container-high'}`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Point Chart</span>
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`flex-1 font-display font-black text-[9px] py-2 px-1 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1 min-w-[80px] ${activeTab === 'guides' ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6]' : 'text-[#4B4B4B] hover:bg-surface-container-high'}`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Parent Guides</span>
        </button>
        <button
          onClick={() => setActiveTab('apps')}
          className={`flex-1 font-display font-black text-[9px] py-2 px-1 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1 min-w-[80px] ${activeTab === 'apps' ? 'bg-[#CE9FFC] text-white border-b-4 border-[#b784f9]' : 'text-[#4B4B4B] hover:bg-surface-container-high'}`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Apps & Tools</span>
        </button>
      </div>

      {/* TAB 0: COUPLES PLAYROOM & INTERACTIVE CHALLENGES */}
      {activeTab === 'playroom' && (
        <div className="flex flex-col gap-5 animate-fade-in text-[#4B4B4B]">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-pink-500/15 via-rose-500/10 to-transparent p-4 rounded-[2rem] border-2 border-rose-500/20 text-[11px] leading-relaxed text-rose-950 flex items-start gap-3">
            <span className="text-2xl shrink-0">💖</span>
            <div>
              <p className="font-sans">
                <strong>Couples Connection Playroom:</strong> Discover deep intimacy mini-games, complete physical co-op scavenger hunts, and finish structured homework assignments designed to build a secure, long-term romantic bond between therapy sessions.
              </p>
            </div>
          </div>

          {/* INTERACTIVE GENOGRAM DIAGNOSTIC TREE LAUNCHER */}
          {onViewGenogram && (
            <div className="bg-white border-2 border-outline-variant p-4.5 rounded-[2rem] shadow-sm hover:border-slate-300 transition-all flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
                <span className="text-8xl">🧬</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl p-2 bg-indigo-50 text-indigo-600 rounded-2xl select-none">🧬</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-display font-black text-xs text-[#4B4B4B]">Interactive Family Genogram Builder</h4>
                    <span className="text-[6.5px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                      Bowen Model
                    </span>
                  </div>
                  <p className="font-sans text-[10px] text-on-surface-variant/90 leading-relaxed mt-1">
                    Map out family relationships, emotional bonds (harmonious, conflictual, distant), and multi-generational behavioral traits in a visual, interactive drag-and-drop sandbox.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onViewGenogram}
                className="w-full bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] hover:brightness-110 text-white font-display font-black py-2.5 rounded-xl border-b-[4px] border-indigo-900 active:translate-y-[2px] active:border-b-[2px] transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider cursor-pointer shadow-sm"
              >
                <span>Launch Genogram Assessment Sandbox</span>
                <span className="text-xs">→</span>
              </button>
            </div>
          )}

          {/* ATTACHMENT MAPPER LAUNCHER CARD */}
          <div className="bg-white border-2 border-outline-variant p-4.5 rounded-[2rem] shadow-sm hover:border-slate-300 transition-all flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none text-8xl select-none">
              🧬
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl p-2 bg-pink-50 text-pink-600 rounded-2xl select-none text-center">🔬</span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-display font-black text-xs text-[#4B4B4B]">Autonomic Attachment Mapper</h4>
                  <span className="text-[6.5px] font-black uppercase tracking-widest bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded border border-pink-100">
                    Somatic Dance
                  </span>
                </div>
                <p className="font-sans text-[10px] text-on-surface-variant/90 leading-relaxed mt-1">
                  Plot your scores on the interactive anxiety/avoidance quadrant plane. Complete assessments and decode the underlying defensive cycles.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAttachmentMapper(true)}
              className="w-full bg-gradient-to-r from-[#FF5A5F] to-indigo-600 hover:brightness-110 text-white font-display font-black py-2.5 rounded-xl border-b-[4px] border-indigo-900 active:translate-y-[2px] active:border-b-[2px] transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider cursor-pointer shadow-sm"
            >
              <span>Launch Attachment Dynamic Mapper</span>
              <span className="text-xs">→</span>
            </button>
          </div>

          {/* MODULE 1: INTIMACY CARD DECK */}
          <section className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4">
            <div className="flex flex-col gap-1 border-b border-outline-variant pb-3">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B] flex items-center gap-1.5">
                  <span>🃏</span> Love Maps Intimacy Deck
                </h3>
                <span className="text-[7.5px] font-black uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded-lg border border-rose-200">
                  Gottman-Inspired
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant/90 leading-tight">
                Draw card prompts to check your partner's Love Maps, prompt vulnerability alignment, and trigger co-op romantic sparks.
              </p>
            </div>

            {/* Deck filter buttons */}
            <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-xl border border-outline-variant">
              {(['all', 'lovemap', 'bid', 'spark'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCardCategory(cat);
                    setActiveCardIndex(0);
                    setIsCardFlipped(false);
                    setRevealAnswerIdea(false);
                  }}
                  className={`flex-1 text-[8px] font-black py-1.5 px-1 rounded-lg uppercase tracking-wider transition-all cursor-pointer text-center ${
                    selectedCardCategory === cat
                      ? 'bg-rose-500 text-white border-b-2 border-rose-700'
                      : 'text-on-surface-variant hover:bg-slate-100'
                  }`}
                >
                  {cat === 'all' ? 'All Cards' : cat === 'lovemap' ? 'Love Maps' : cat === 'bid' ? 'Intimate Bids' : 'Co-op Sparks'}
                </button>
              ))}
            </div>

            {/* Interactive Card */}
            <div className="perspective-1000 my-1 flex justify-center">
              <motion.div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={`w-full max-w-sm h-48 rounded-[2rem] cursor-pointer relative shadow-xl transform-style-3d border-2 border-outline-variant overflow-hidden`}
              >
                {/* Front Side */}
                <div 
                  className={`absolute inset-0 w-full h-full p-6 text-white flex flex-col justify-between backface-hidden bg-gradient-to-br ${
                    currentCard?.bgGradient || 'from-rose-500 to-pink-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {currentCard?.categoryLabel || 'Intimacy Prompt'}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">
                      Card #{((activeCardIndex) % filteredCards.length) + 1} of {filteredCards.length}
                    </span>
                  </div>

                  <p className="font-sans font-bold text-xs md:text-sm leading-snug text-center py-2 px-1">
                    "{currentCard?.question}"
                  </p>

                  <div className="flex justify-center items-center gap-1 text-[7.5px] font-black tracking-widest uppercase opacity-90 animate-pulse">
                    <span>🔄 Click card to see tips</span>
                  </div>
                </div>

                {/* Back Side */}
                <div 
                  className="absolute inset-0 w-full h-full p-6 bg-slate-900 text-white flex flex-col justify-between backface-hidden [transform:rotateY(180deg)]"
                >
                  <div className="flex justify-between items-start border-b border-slate-800 pb-1.5">
                    <span className="text-[8px] font-black uppercase tracking-widest text-rose-400">
                      Therapist Clinical Tips
                    </span>
                    <span className="text-[10px] text-slate-400">Back Side 🔄</span>
                  </div>

                  <div className="flex flex-col gap-1.5 text-center px-1 my-auto">
                    <p className="font-sans text-[10.5px] text-slate-200 italic leading-relaxed">
                      "{currentCard?.hint}"
                    </p>
                    <p className="text-[8px] text-rose-300 font-semibold leading-relaxed mt-1">
                      💡 Practice Rule: The active speaker is not allowed to be interrupted. Validate and align before answering.
                    </p>
                  </div>

                  <div className="text-[7.5px] font-black tracking-widest uppercase text-slate-400 text-center">
                    Click anywhere to flip card back
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Card deck controls */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsCardFlipped(false);
                  setTimeout(() => {
                    setActiveCardIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
                    setRevealAnswerIdea(false);
                  }, 150);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 border-2 border-outline-variant text-[10px] font-black uppercase py-2 px-3 rounded-xl transition-all cursor-pointer text-[#4B4B4B]"
              >
                Previous Card
              </button>
              <button
                onClick={() => {
                  setIsCardFlipped(false);
                  setTimeout(() => {
                    setActiveCardIndex(prev => (prev + 1) % filteredCards.length);
                    setRevealAnswerIdea(false);
                  }, 150);
                  triggerCelebration('🃏');
                }}
                className="flex-1 bg-[#FF5A5F] text-white border-b-4 border-[#d83c41] text-[10px] font-black uppercase py-2 px-3 rounded-xl transition-all hover:brightness-105 active:scale-98 cursor-pointer"
              >
                Next Random Card
              </button>
            </div>
          </section>

          {/* MODULE 2: COUPLES SCAVENGER HUNT */}
          <section className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4">
            <div className="flex flex-col gap-1 border-b border-outline-variant pb-3">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B] flex items-center gap-1.5">
                  <span>🧭</span> Couple Scavenger Hunts & Co-op Challenges
                </h3>
                <span className="text-[7.5px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200">
                  Physical Quests
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant/90 leading-tight">
                Cooperative real-world activities to shake up your space, build shared sensory memories, and secure intimacy.
              </p>
            </div>

            {/* Challenge Progress */}
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-outline-variant flex items-center justify-between text-[10px] font-sans">
              <div className="flex flex-col">
                <span className="font-bold text-[#4B4B4B]">Quest Level Completed</span>
                <span className="text-[8px] text-on-surface-variant font-semibold">
                  {scavengerChallenges.filter(c => c.completed).length} of {scavengerChallenges.length} challenges complete
                </span>
              </div>
              <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden border border-outline-variant/60 shrink-0">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${(scavengerChallenges.filter(c => c.completed).length / scavengerChallenges.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Challenges List */}
            <div className="flex flex-col gap-2.5">
              {scavengerChallenges.map((ch) => (
                <div 
                  key={ch.id} 
                  className={`border-2 rounded-2xl p-3 flex items-start gap-3 justify-between transition-all relative ${
                    ch.completed 
                      ? 'bg-emerald-50/45 border-emerald-300 opacity-80' 
                      : 'bg-slate-50/60 border-outline-variant/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex gap-2.5 items-start min-w-0">
                    <span className="text-2xl shrink-0 bg-white w-9 h-9 rounded-full border border-outline-variant/60 flex items-center justify-center shadow-sm">
                      {ch.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-sans text-[11px] font-bold text-[#4B4B4B] leading-snug">
                          {ch.title}
                        </h4>
                        <span className={`text-[6.5px] font-black uppercase px-1 rounded border ${
                          ch.difficulty === 'easy' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {ch.difficulty}
                        </span>
                      </div>
                      <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
                        {ch.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[9.5px] font-mono font-black text-rose-500 shrink-0">
                      +{ch.pointsReward} pts
                    </span>
                    <button
                      onClick={() => handleToggleScavenger(ch.id)}
                      className={`text-[8.5px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wide cursor-pointer transition-all border ${
                        ch.completed
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                          : 'bg-white text-[#4B4B4B] hover:bg-rose-50 hover:border-rose-300 border-outline-variant'
                      }`}
                    >
                      {ch.completed ? 'Completed ✓' : 'Mark Done'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* MODULE 3: INTERACTIVE CLINICAL HOMEWORK */}
          <section className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4">
            <div className="flex flex-col gap-1 border-b border-outline-variant pb-3">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B] flex items-center gap-1.5">
                  <span>📝</span> Homework & Co-op Assignments
                </h3>
                <span className="text-[7.5px] font-black uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-lg border border-purple-200">
                  Therapy Homework
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant/90 leading-tight">
                Actionable homework to practice in between couples therapy sessions to integrate attachment theory and clinical tools.
              </p>
            </div>

            {/* INTERACTIVE COMPONENT A: 6-SECOND KISS TIMER */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-2xl border-2 border-rose-200 flex flex-col items-center gap-3 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-rose-200/50 text-rose-800 text-[6.5px] font-black uppercase tracking-wider px-1.5 py-0.25 rounded">
                Gottman Ritual
              </div>
              
              <div className="text-center max-w-sm">
                <h4 className="font-display font-black text-[10.5px] text-rose-950 uppercase tracking-wide">
                  The 6-Second Kiss Anchor
                </h4>
                <p className="font-sans text-[9px] text-rose-800/90 leading-relaxed mt-0.5">
                  A six-second kiss creates a physical and hormonal transition from survival mode to relational safety. It lowers cortisol and surges trust-building oxytocin.
                </p>
              </div>

              {/* Live circular countdown interface */}
              <div className="relative flex items-center justify-center w-20 h-20 my-1">
                {/* Outer pulsing ring when active */}
                {kissTimerActive && (
                  <div className="absolute inset-0 bg-rose-400/25 rounded-full animate-ping" />
                )}
                
                <div 
                  className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-3 transition-all duration-300 ${
                    kissTimerActive 
                      ? 'bg-rose-500 text-white border-rose-300 scale-105 shadow-lg' 
                      : kissTimerSuccess
                        ? 'bg-emerald-500 text-white border-emerald-300 shadow'
                        : 'bg-white text-rose-500 border-rose-300 hover:bg-rose-50'
                  }`}
                >
                  {kissTimerActive ? (
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-mono font-black">{kissTimerSeconds}</span>
                      <span className="text-[6.5px] font-black uppercase tracking-wider">Secs</span>
                    </div>
                  ) : kissTimerSuccess ? (
                    <Check className="w-8 h-8 animate-bounce" />
                  ) : (
                    <Heart className="w-7 h-7 fill-current text-rose-500 animate-pulse" />
                  )}
                </div>
              </div>

              <div className="flex gap-2 w-full max-w-xs">
                <button
                  onClick={() => {
                    if (kissTimerActive) {
                      setKissTimerActive(false);
                      setKissTimerSeconds(0);
                    } else {
                      setKissTimerSeconds(6);
                      setKissTimerActive(true);
                      setKissTimerSuccess(false);
                    }
                  }}
                  className={`w-full text-[9px] font-black uppercase py-2 px-3 rounded-xl transition-all cursor-pointer text-center ${
                    kissTimerActive
                      ? 'bg-red-500 text-white border-b-4 border-red-700'
                      : 'bg-rose-500 text-white border-b-4 border-rose-700 hover:brightness-105'
                  }`}
                >
                  {kissTimerActive ? 'Reset Timer' : 'Launch 6-Sec Kiss Timer'}
                </button>
              </div>
            </div>

            {/* INTERACTIVE COMPONENT B: SOFTENED STARTUP BUILDER */}
            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-outline-variant flex flex-col gap-3">
              <div className="border-b border-outline-variant/60 pb-1.5 flex items-center justify-between">
                <h4 className="font-sans text-[10.5px] font-bold text-[#4B4B4B] flex items-center gap-1">
                  <span>💬</span> Softened Startup Builder
                </h4>
                <span className="text-[6.5px] font-black uppercase bg-sky-100 text-sky-800 px-1.5 py-0.25 rounded border border-sky-200">
                  Clinical Tool
                </span>
              </div>

              <p className="font-sans text-[9px] text-on-surface-variant/90 leading-relaxed">
                Draft complaints safely before introducing them to your partner. This tool ensures you lead with vulnerability and factual facts instead of global critiques.
              </p>

              <form onSubmit={handleEvaluateStartup} className="flex flex-col gap-2.5">
                {/* Formula display */}
                <div className="bg-white border border-outline-variant/75 p-2 rounded-xl text-[9px] font-mono text-[#4B4B4B] leading-normal">
                  <span className="text-[#FF5A5F] font-bold">"I feel</span> [vulnerability label] <span className="text-[#FF5A5F] font-bold">about</span> [neutral fact] <span className="text-[#FF5A5F] font-bold">and I need</span> [positive need]."
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[8px] font-sans">
                  {/* Part 1: Feeling label */}
                  <div>
                    <label className="font-bold text-on-surface-variant block mb-1">1. Vulnerable Emotion</label>
                    <select
                      value={startupEmotion}
                      onChange={e => {
                        setStartupEmotion(e.target.value);
                        setStartupEvaluation(null);
                      }}
                      className="w-full bg-white text-[10px] font-bold text-[#4B4B4B] p-1.5 rounded-lg border border-outline-variant"
                    >
                      {['overwhelmed', 'lonely', 'unappreciated', 'invisible', 'disconnected', 'stressed', 'anxious', 'sad'].map(em => (
                        <option key={em} value={em}>I feel {em}</option>
                      ))}
                    </select>
                  </div>

                  {/* Part 2: neutral event */}
                  <div className="md:col-span-2">
                    <label className="font-bold text-on-surface-variant block mb-1">2. Specific neutral occurrence (No generalizations)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. the schedule changing at the last minute"
                      value={startupEvent}
                      onChange={e => {
                        setStartupEvent(e.target.value);
                        setStartupEvaluation(null);
                      }}
                      className="w-full bg-white text-[10px] font-semibold text-[#4B4B4B] p-1.5 rounded-lg border border-outline-variant placeholder:opacity-55"
                    />
                  </div>
                </div>

                {/* Part 3: positive request */}
                <div className="text-[8px] font-sans">
                  <label className="font-bold text-on-surface-variant block mb-1">3. Clear Positive Request (How to repair together)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. if we could set a short review sync every Monday morning"
                    value={startupNeed}
                    onChange={e => {
                      setStartupNeed(e.target.value);
                      setStartupEvaluation(null);
                    }}
                    className="w-full bg-white text-[10px] font-semibold text-[#4B4B4B] p-1.5 rounded-lg border border-outline-variant placeholder:opacity-55"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#1CB0F6] text-white text-[9px] font-black uppercase py-2 px-3 rounded-xl border-b-[3px] border-[#1899D6] transition-all hover:brightness-105"
                >
                  Construct & Evaluate Startup Draft
                </button>
              </form>

              {/* Evaluation Feedback */}
              <AnimatePresence>
                {startupEvaluation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-emerald-50 text-[10px] p-3 rounded-xl border border-emerald-200 font-sans leading-relaxed text-[#4B4B4B] whitespace-pre-wrap shadow-sm animate-scale-in"
                  >
                    {startupEvaluation}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Standard Assignments Checklist */}
            <div className="flex flex-col gap-3 mt-1.5">
              <span className="text-[9px] font-black uppercase text-[#4B4B4B] tracking-wider border-b border-outline-variant/60 pb-1 flex items-center gap-1">
                <span>📋</span> In-Between Session Assignments
              </span>

              {therapyHomework.map((hw) => (
                <div key={hw.id} className="bg-slate-50 border border-outline-variant rounded-2xl p-3 flex flex-col gap-2.5">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <span className="text-xl bg-white w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center shrink-0 shadow-sm">{hw.emoji}</span>
                      <div>
                        <h4 className="font-sans text-[11px] font-black text-[#4B4B4B] leading-none">{hw.title}</h4>
                        <span className="text-[8px] text-on-surface-variant font-medium mt-1.5 block">{hw.subtitle}</span>
                      </div>
                    </div>
                    {hw.completed ? (
                      <span className="text-[7.5px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                        Finished ✓
                      </span>
                    ) : (
                      <span className="text-[7.5px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-150 animate-pulse">
                        Active Step: {hw.activeStepIndex + 1}/{hw.steps.length}
                      </span>
                    )}
                  </div>

                  <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed">
                    {hw.description}
                  </p>

                  {/* Guided Chapters Tracker */}
                  <div className="flex flex-col gap-1.5 bg-white p-2.5 rounded-xl border border-outline-variant/80">
                    {hw.steps.map((step, idx) => (
                      <div 
                        key={idx} 
                        className={`text-[9.5px] font-sans py-1 px-1.5 rounded flex items-start gap-1.5 transition-colors ${
                          idx === hw.activeStepIndex && !hw.completed
                            ? 'bg-purple-50 font-bold text-purple-950 border-l-3 border-purple-500 pl-1'
                            : idx < hw.activeStepIndex || hw.completed
                              ? 'text-slate-400 line-through opacity-70'
                              : 'text-slate-500 opacity-90'
                        }`}
                      >
                        <span className="shrink-0 mt-0.5">
                          {idx < hw.activeStepIndex || hw.completed ? '✓' : idx === hw.activeStepIndex ? '👉' : '○'}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Step controls */}
                  <div className="flex justify-end gap-2">
                    {hw.completed && (
                      <button
                        onClick={() => {
                          setTherapyHomework(prev => prev.map(item => item.id === hw.id ? { ...item, completed: false, activeStepIndex: 0 } : item));
                        }}
                        className="text-[8px] font-black border border-outline-variant px-2.5 py-1.5 rounded-lg text-on-surface-variant hover:bg-slate-100 uppercase tracking-wider cursor-pointer"
                      >
                        Reset Assignment
                      </button>
                    )}
                    <button
                      onClick={() => handleAdvanceHomeworkStep(hw.id)}
                      className={`text-[8.5px] font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer transition-all border ${
                        hw.completed
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : hw.activeStepIndex === hw.steps.length - 1
                            ? 'bg-emerald-500 text-white border-b-3 border-emerald-700 hover:brightness-105'
                            : 'bg-purple-600 text-white border-b-3 border-purple-800 hover:brightness-105'
                      }`}
                      disabled={hw.completed}
                    >
                      {hw.completed 
                        ? 'Task Done' 
                        : hw.activeStepIndex === hw.steps.length - 1 
                          ? 'Complete Assignment 🏆' 
                          : 'Check Chapter & Next Step 👉'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB 1: POINT CHART (BEHAVIORAL REINFORCEMENT) */}
      {activeTab === 'chart' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          
          {/* SYSTEM: WEEKLY GOALS & RESULTS ALIGNMENT MEETING */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 p-5 rounded-[2.5rem] shadow-md flex flex-col gap-4">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-indigo-200/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <div>
                  <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#312E81] flex items-center gap-1.5">
                    Family Weekly Goals & Results
                  </h3>
                  <span className="text-[8px] font-black text-indigo-700 uppercase tracking-widest block">
                    Gottman & PBIS Co-parenting Alignment
                  </span>
                </div>
              </div>

              {/* Toggle Meeting Mode button */}
              <button
                onClick={() => {
                  setWeeklyMeetingActive(!weeklyMeetingActive);
                  setMeetingStep(1);
                  setMeetingAppreciationDone([]);
                }}
                className={`text-[9px] font-black px-3.5 py-2 rounded-xl transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1 border shadow-sm ${
                  weeklyMeetingActive
                    ? 'bg-rose-500 text-white border-rose-600 hover:bg-rose-600 shadow-rose-200'
                    : 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {weeklyMeetingActive ? '❌ Cancel Meeting' : '👥 Start Weekly Results Meeting'}
              </button>
            </div>

            {/* IF MEETING IS ACTIVE: Facilitate results alignment meeting wizard */}
            {weeklyMeetingActive ? (
              <div className="bg-white/95 border-2 border-indigo-300 p-4 rounded-3xl shadow-inner flex flex-col gap-4.5 animate-scale-in">
                
                {/* Steps Navigator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-indigo-900">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-lg border border-indigo-200">
                      Weekly Alignment Ritual
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">
                    Step {meetingStep} of 4
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-500"
                    style={{ width: `${(meetingStep / 4) * 100}%` }}
                  />
                </div>

                {/* STEP 1: APPRECIATION EXCHANGE (4:1 RATIO) */}
                {meetingStep === 1 && (
                  <div className="flex flex-col gap-3 animate-fade-in">
                    <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100 text-[11px] leading-relaxed text-indigo-950">
                      <strong className="text-indigo-900 block mb-1">💡 Gottman Clinical Rule (The Appreciation Exchange)</strong>
                      Do not talk about failed chores yet! Before reviewing hard results, every family member must share <strong>one specific action</strong> they noticed and loved about another member this week. Tap each profile below after they speak:
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {familyMembers.map(m => {
                        const done = meetingAppreciationDone.includes(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              if (done) {
                                setMeetingAppreciationDone(prev => prev.filter(id => id !== m.id));
                              } else {
                                setMeetingAppreciationDone(prev => [...prev, m.id]);
                                triggerCelebration('❤️');
                              }
                            }}
                            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left flex items-center justify-between ${
                              done
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl bg-white w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0">{m.avatar}</span>
                              <div>
                                <span className="font-sans text-[11.5px] font-black block leading-none">{m.name}</span>
                                <span className="text-[8px] font-semibold text-slate-500 block mt-1">{m.role}</span>
                              </div>
                            </div>
                            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                              done 
                                ? 'bg-emerald-500 text-white border-emerald-600' 
                                : 'bg-white border-slate-300 text-transparent'
                            }`}>
                              ✓
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-[9px] text-slate-400 italic text-center mt-1">
                      (Check off all family members to advance to results)
                    </p>

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                      <button
                        onClick={() => {
                          setWeeklyMeetingActive(false);
                          setMeetingAppreciationDone([]);
                        }}
                        className="text-[9px] font-black border border-slate-200 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-50 uppercase tracking-wider cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={meetingAppreciationDone.length < familyMembers.length}
                        onClick={() => setMeetingStep(2)}
                        className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-wider transition-all border ${
                          meetingAppreciationDone.length >= familyMembers.length
                            ? 'bg-indigo-600 text-white border-b-3 border-indigo-800 hover:brightness-105 cursor-pointer shadow-md'
                            : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                        }`}
                      >
                        Advance to Results Review 👉
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: WEEKLY RESULTS REVIEW */}
                {meetingStep === 2 && (
                  <div className="flex flex-col gap-3.5 animate-fade-in">
                    <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100 text-[11px] leading-relaxed text-indigo-950">
                      <strong className="text-indigo-900 block mb-1">📋 Section 2: Reviewing Completed Goals</strong>
                      Compare results together! Check completed objectives and praise individual efforts. Mark in-progress tasks as completed if family members did their part.
                    </div>

                    {/* Quick Mini Goals List inside meeting */}
                    <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1 no-scrollbar border border-slate-100 p-2 rounded-2xl bg-slate-50">
                      {familyGoals.map(g => (
                        <div 
                          key={g.id} 
                          className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                            g.completed 
                              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' 
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg bg-white w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center shrink-0">{g.emoji}</span>
                            <div>
                              <span className="font-sans text-[10.5px] font-bold block leading-tight">{g.title}</span>
                              <span className="text-[8px] font-black text-slate-500 block mt-0.5 uppercase tracking-wide">
                                {g.assignee} ({g.assigneeName}) • {g.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[9.5px] font-mono font-bold">
                              {g.current}/{g.target} {g.unit}
                            </span>
                            <button
                              onClick={() => handleToggleGoalComplete(g.id)}
                              className={`text-[8px] font-black uppercase py-1 px-2 rounded-lg cursor-pointer transition-all border ${
                                g.completed
                                  ? 'bg-emerald-500 text-white border-emerald-600'
                                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                              }`}
                            >
                              {g.completed ? '✓ Completed' : 'Mark Done'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-2xl border border-indigo-100 mt-1">
                      <span className="text-[10px] text-indigo-900 font-semibold">
                        Completed Goals This Week:
                      </span>
                      <strong className="text-indigo-900 font-black text-xs">
                        {familyGoals.filter(g => g.completed).length} of {familyGoals.length} ({Math.round((familyGoals.filter(g => g.completed).length / familyGoals.length) * 100 || 0)}%)
                      </strong>
                    </div>

                    <div className="flex justify-between border-t border-slate-100 pt-3">
                      <button
                        onClick={() => setMeetingStep(1)}
                        className="text-[9px] font-black border border-slate-200 px-3.5 py-2 rounded-xl text-slate-500 hover:bg-slate-50 uppercase tracking-wider cursor-pointer"
                      >
                        👈 Back
                      </button>
                      <button
                        onClick={() => setMeetingStep(3)}
                        className="text-[9px] font-black bg-indigo-600 text-white border-b-3 border-indigo-800 hover:brightness-105 px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer shadow-md"
                      >
                        Advance to Celebration 🏆
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: FAMILY CELEBRATION */}
                {meetingStep === 3 && (
                  <div className="flex flex-col gap-3.5 animate-fade-in text-center py-2">
                    <span className="text-4xl block animate-bounce my-1">🏆</span>
                    <h4 className="font-display font-black text-xs uppercase tracking-wider text-indigo-900 leading-none">
                      Family Co-op Objective Met!
                    </h4>
                    <p className="font-sans text-[11px] text-slate-600 px-3 leading-relaxed">
                      You worked collaboratively to tackle individual objectives and protect relationship boundaries. 
                      Completing this structured meeting establishes a solid baseline for family harmony.
                    </p>

                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl max-w-sm mx-auto text-[10px] text-emerald-950 font-medium">
                      🎁 <strong>Meeting Alignment Reward:</strong> Every family member is about to receive a **+50 Points alignment bonus**, and the system ledger will record a successful weekly co-op victory!
                    </div>

                    <div className="flex justify-between border-t border-slate-100 pt-3 mt-2">
                      <button
                        onClick={() => setMeetingStep(2)}
                        className="text-[9px] font-black border border-slate-200 px-3.5 py-2 rounded-xl text-slate-500 hover:bg-slate-50 uppercase tracking-wider cursor-pointer"
                      >
                        👈 Back
                      </button>
                      <button
                        onClick={() => setMeetingStep(4)}
                        className="text-[9px] font-black bg-emerald-500 text-white border-b-3 border-emerald-700 hover:brightness-105 px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer shadow-md"
                      >
                        Go to Final Step 👉
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: FRESH WEEK RESET */}
                {meetingStep === 4 && (
                  <div className="flex flex-col gap-3.5 animate-fade-in text-center py-2">
                    <span className="text-4xl block animate-pulse my-1">♻️</span>
                    <h4 className="font-display font-black text-xs uppercase tracking-wider text-indigo-900 leading-none">
                      Draft Next Week\'s Habits
                    </h4>
                    <p className="font-sans text-[11px] text-slate-600 px-3 leading-relaxed">
                      To lock in progress, click below to conclude the meeting. This will **automatically distribute points to all members** and **clear the goals board** back to 0 so everyone can focus on fresh weekly objectives!
                    </p>

                    <div className="flex flex-col gap-2 max-w-xs mx-auto text-[9.5px] font-sans text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-left mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span> <span>Husband\'s Acts of Love goals reset</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span> <span>Kids\' chores & direction goals reset</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span> <span>Family & couples goals reset</span>
                      </div>
                    </div>

                    <div className="flex justify-between border-t border-slate-100 pt-3 mt-2">
                      <button
                        onClick={() => setMeetingStep(3)}
                        className="text-[9px] font-black border border-slate-200 px-3.5 py-2 rounded-xl text-slate-500 hover:bg-slate-50 uppercase tracking-wider cursor-pointer"
                      >
                        👈 Back
                      </button>
                      <button
                        onClick={handleCompleteWeeklyMeeting}
                        className="text-[9px] font-black bg-[#58CC02] text-white border-b-4 border-[#46A302] hover:brightness-105 px-5 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer shadow-md animate-pulse"
                      >
                        Conclude Meeting & Distribute points! 🏆
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              // IF MEETING IS NOT ACTIVE: Standard goals tracking dashboard
              <div className="flex flex-col gap-3 animate-fade-in">
                
                {/* Dashboard Filters & Controls */}
                <div className="flex flex-col sm:flex-row justify-between gap-2.5 bg-indigo-100/60 p-2.5 rounded-2xl border border-indigo-200/50">
                  
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap gap-1">
                    {(['All', 'Husband', 'Kids', 'Family/Couples'] as const).map(filter => (
                      <button
                        key={filter}
                        onClick={() => setSelectedGoalFilter(filter)}
                        className={`text-[8.5px] font-black py-1 px-2.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                          selectedGoalFilter === filter
                            ? 'bg-indigo-600 text-white border-b-2 border-indigo-800'
                            : 'text-indigo-900 hover:bg-indigo-100'
                        }`}
                      >
                        {filter === 'All' ? '🌐 All' : filter === 'Husband' ? '👨 Husband' : filter === 'Kids' ? '🧒 Kids' : '🏠 Family/Couples'}
                      </button>
                    ))}
                  </div>

                  {/* Right hand add & reset controls */}
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => setShowAddGoal(!showAddGoal)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-[8.5px] font-black py-1 px-2.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer border-b-2 border-indigo-800"
                    >
                      {showAddGoal ? 'Close Form' : '+ Add Weekly Goal'}
                    </button>
                    <button
                      onClick={handleResetWeeklyGoals}
                      className="bg-slate-200 hover:bg-slate-300 text-[#4B4B4B] text-[8.5px] font-black py-1 px-2 rounded-lg uppercase tracking-wider transition-all cursor-pointer border border-slate-300"
                      title="Clear progress and reset for the week"
                    >
                      ♻️ Reset Board
                    </button>
                  </div>

                </div>

                {/* Add Goal form inline */}
                {showAddGoal && (
                  <form onSubmit={handleCreateGoal} className="bg-white p-3.5 rounded-2xl border-2 border-indigo-200 flex flex-col gap-2.5 animate-scale-in text-on-surface text-[10.5px]">
                    <span className="text-[8.5px] font-black uppercase text-indigo-800 block font-display">Create custom weekly objective</span>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[7.5px] font-bold text-slate-500 block">Goal Title / Task</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Wash husband's car, Clean playroom together"
                        value={newGoalTitle}
                        onChange={e => setNewGoalTitle(e.target.value)}
                        className="w-full bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 font-bold text-[#4B4B4B] focus:outline-none focus:bg-white text-[10.5px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[8px] font-sans">
                      <div>
                        <label className="font-bold text-slate-500 block mb-0.5">Assignee Type</label>
                        <select
                          value={newGoalAssignee}
                          onChange={e => {
                            const val = e.target.value as any;
                            setNewGoalAssignee(val);
                            if (val === 'Husband') {
                              setNewGoalAssigneeName('Mark');
                              setNewGoalCategory('Acts of Love');
                            } else if (val === 'Kids') {
                              setNewGoalAssigneeName('Jamie & Charlie');
                              setNewGoalCategory('Chore');
                            } else if (val === 'Family') {
                              setNewGoalAssigneeName('All');
                              setNewGoalCategory('Family Objective');
                            } else {
                              setNewGoalAssigneeName('Mark & Sarah');
                              setNewGoalCategory('Individual Goal');
                            }
                          }}
                          className="w-full bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-[#4B4B4B]"
                        >
                          <option value="Husband">Husband</option>
                          <option value="Kids">Kids</option>
                          <option value="Family">Family Shared</option>
                          <option value="Couples">Couples</option>
                          <option value="Individual">Individual member</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-500 block mb-0.5">Name of Assignee</label>
                        <input
                          type="text"
                          value={newGoalAssigneeName}
                          onChange={e => setNewGoalAssigneeName(e.target.value)}
                          className="w-full bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-[#4B4B4B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-[8px] font-sans">
                      <div className="col-span-2">
                        <label className="font-bold text-slate-500 block mb-0.5">Category Type</label>
                        <select
                          value={newGoalCategory}
                          onChange={e => setNewGoalCategory(e.target.value as any)}
                          className="w-full bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-[#4B4B4B]"
                        >
                          <option value="Acts of Love">Acts of Love</option>
                          <option value="Chore">Household Chore</option>
                          <option value="Follow Directions">Follow Directions / Obedience</option>
                          <option value="Family Objective">Family Objective</option>
                          <option value="Individual Goal">Individual Goal</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-500 block mb-0.5">Target count</label>
                        <input
                          type="number"
                          value={newGoalTarget}
                          onChange={e => setNewGoalTarget(Number(e.target.value))}
                          className="w-full bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-[#4B4B4B]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-500 block mb-0.5">Points Award</label>
                        <input
                          type="number"
                          value={newGoalPoints}
                          onChange={e => setNewGoalPoints(Number(e.target.value))}
                          className="w-full bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-[#4B4B4B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[8px] font-sans">
                      <div>
                        <label className="font-bold text-slate-500 block mb-0.5">Progress unit</label>
                        <input
                          type="text"
                          placeholder="times, days, session"
                          value={newGoalUnit}
                          onChange={e => setNewGoalUnit(e.target.value)}
                          className="w-full bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-[#4B4B4B]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-500 block mb-0.5">Preset Emoji</label>
                        <select
                          value={newGoalEmoji}
                          onChange={e => setNewGoalEmoji(e.target.value)}
                          className="w-full bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-[#4B4B4B]"
                        >
                          {['❤️', '☕', '📝', '🎫', '🧹', '🍽️', '👂', '🎒', '🎲', '💬', '🏃', '🍕'].map(em => (
                            <option key={em} value={em}>{em}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white text-[9px] font-black uppercase py-2 rounded-xl border-b-[3px] border-indigo-800 mt-1 cursor-pointer"
                    >
                      Publish Custom Weekly Goal 🎯
                    </button>
                  </form>
                )}

                {/* Grid of Goals Cards filtered */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
                  {familyGoals
                    .filter(g => {
                      if (selectedGoalFilter === 'All') return true;
                      if (selectedGoalFilter === 'Husband') return g.assignee === 'Husband';
                      if (selectedGoalFilter === 'Kids') return g.assignee === 'Kids';
                      return g.assignee === 'Family' || g.assignee === 'Couples';
                    })
                    .map(g => {
                      const percentage = Math.min(100, (g.current / g.target) * 100);
                      return (
                        <div 
                          key={g.id} 
                          className={`bg-white border-2 rounded-[1.5rem] p-3.5 shadow-sm transition-all relative group/gl ${
                            g.completed 
                              ? 'border-emerald-300 bg-emerald-50/10' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Top row */}
                          <div className="flex justify-between items-start gap-1">
                            <div className="flex gap-2 min-w-0">
                              <span className="text-xl bg-slate-50 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0">
                                {g.emoji}
                              </span>
                              <div className="min-w-0">
                                <h4 className="font-sans text-[11px] font-black text-[#4B4B4B] leading-tight line-clamp-2 pr-4">
                                  {g.title}
                                </h4>
                                <span className="text-[7.5px] font-black text-slate-500 uppercase block mt-1 tracking-wide">
                                  Assignee: <strong className="text-indigo-950 font-black">{g.assigneeName}</strong>
                                </span>
                              </div>
                            </div>

                            {/* Award Badge & Complete marker */}
                            <div className="flex flex-col items-end shrink-0 select-none">
                              {g.completed ? (
                                <span className="text-[7.5px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300">
                                  Completed ✓
                                </span>
                              ) : (
                                <span className="text-[7.5px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                                  +{g.pointsReward} Pts
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Category badge */}
                          <div className="flex gap-1.5 items-center mt-2">
                            <span className={`text-[6.5px] font-black uppercase tracking-widest px-1 py-0.25 rounded border ${
                              g.category === 'Acts of Love' ? 'bg-red-50 text-red-700 border-red-150' :
                              g.category === 'Chore' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
                              g.category === 'Follow Directions' ? 'bg-sky-50 text-sky-700 border-sky-150' :
                              g.category === 'Family Objective' ? 'bg-purple-50 text-purple-700 border-purple-150' :
                              'bg-amber-50 text-amber-700 border-amber-150'
                            }`}>
                              {g.category === 'Acts of Love' ? '❤️ Acts of Love' :
                               g.category === 'Chore' ? '🧹 Family Chore' :
                               g.category === 'Follow Directions' ? '👂 Follow directions' :
                               g.category === 'Family Objective' ? '🏠 Family Objective' :
                               '🎯 Individual Goal'}
                            </span>
                          </div>

                          {/* Progress bar and counter */}
                          <div className="mt-3 flex flex-col gap-1">
                            <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold">
                              <span>Weekly Progress</span>
                              <span className="font-mono text-slate-700 font-bold">
                                {g.current}/{g.target} {g.unit} ({Math.round(percentage)}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  g.completed ? 'bg-emerald-500' : 'bg-indigo-600'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Increment and manual toggle buttons */}
                          <div className="mt-3.5 flex justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleGoalComplete(g.id)}
                              className={`text-[8px] font-black uppercase py-1 px-2 rounded-lg cursor-pointer transition-all border ${
                                g.completed
                                  ? 'bg-slate-100 text-slate-400 border-slate-200'
                                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                              }`}
                            >
                              {g.completed ? 'Reset Goal' : 'Mark Done'}
                            </button>
                            <button
                              disabled={g.completed}
                              onClick={() => handleIncrementGoalProgress(g.id)}
                              className={`text-[8px] font-black uppercase py-1 px-3.5 rounded-lg transition-all border shadow-sm ${
                                g.completed
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none'
                                  : 'bg-indigo-600 text-white border-b-2 border-indigo-800 hover:brightness-105 active:scale-98 cursor-pointer'
                              }`}
                            >
                              + Progress
                            </button>
                          </div>

                          {/* Delete option (trash can) */}
                          <button
                            onClick={() => handleDeleteGoal(g.id)}
                            className="absolute -top-1.5 -right-1.5 bg-red-50 text-red-600 hover:bg-red-100 p-1 rounded-full border border-red-200 opacity-0 group-hover/gl:opacity-100 transition-opacity cursor-pointer"
                            title="Remove Weekly Goal"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>

                        </div>
                      );
                    })}
                </div>

              </div>
            )}

          </div>

          {/* Members points display board */}
          <div className="bg-white border-2 border-outline-variant p-4 rounded-[2rem] shadow-3d-neutral flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2.5">
              <span className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wider">Family Members Point Standings</span>
              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className="text-[8.5px] font-black bg-primary/10 text-primary hover:bg-primary/15 px-2 py-1 rounded-lg border border-primary/20 uppercase tracking-wider font-display"
              >
                {showAddMember ? 'Close' : '+ Add Member'}
              </button>
            </div>

            {/* Add member form overlay */}
            {showAddMember && (
              <form onSubmit={handleAddMember} className="bg-slate-50 p-3 rounded-2xl border-2 border-outline-variant flex flex-col gap-2.5 animate-scale-in text-on-surface">
                <span className="text-[8.5px] font-black uppercase text-on-surface-variant block">New Profile Detail</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[7.5px] font-bold text-on-surface-variant block mb-0.5">Member Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam"
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      className="w-full bg-white text-[10.5px] font-bold text-[#4B4B4B] px-2 py-1.5 rounded-xl border border-outline-variant focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[7.5px] font-bold text-on-surface-variant block mb-0.5">Role Type</label>
                    <select
                      value={newMemberRole}
                      onChange={e => setNewMemberRole(e.target.value)}
                      className="w-full bg-white text-[10.5px] font-bold text-[#4B4B4B] px-2 py-1.5 rounded-xl border border-outline-variant focus:outline-none"
                    >
                      <option value="Child">Child</option>
                      <option value="Teenager">Teenager</option>
                      <option value="Toddler">Toddler</option>
                      <option value="Parent">Parent</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 items-center justify-between">
                  <div>
                    <label className="text-[7.5px] font-bold text-on-surface-variant block mb-0.5">Avatar Emoji</label>
                    <select
                      value={newMemberAvatar}
                      onChange={e => setNewMemberAvatar(e.target.value)}
                      className="bg-white text-xs px-2.5 py-1 rounded-xl border border-outline-variant"
                    >
                      {['🧒', '🎧', '👶', '🐱', '🦕', '⚽', '🎨', '🦁'].map(av => (
                        <option key={av} value={av}>{av}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#58CC02] text-white text-[9px] font-black uppercase px-3 py-2 rounded-xl border-b-[3px] border-[#46A302]"
                  >
                    Save Member
                  </button>
                </div>
              </form>
            )}

            {/* Standings list */}
            <div className="grid grid-cols-2 gap-3">
              {familyMembers.map((m) => (
                <div key={m.id} className="bg-slate-50 border-2 border-outline-variant rounded-2xl p-3 flex justify-between items-center relative group/memb">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl bg-white w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center shrink-0">{m.avatar}</span>
                    <div className="min-w-0">
                      <h4 className="font-sans text-[11px] font-black text-[#4B4B4B] leading-none">{m.name}</h4>
                      <span className="text-[8px] font-bold text-on-surface-variant/80 block mt-1">{m.role}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-display font-black text-sm text-[#58CC02] leading-none">{m.points}</span>
                    <span className="text-[7.5px] font-bold text-on-surface-variant uppercase tracking-wide mt-1">PTS</span>
                  </div>

                  {/* Delete button (only custom members are deleted) */}
                  <button
                    onClick={() => handleDeleteMember(m.id)}
                    className="absolute -top-1 -right-1 bg-red-100 text-red-600 hover:bg-red-200 p-0.5 rounded-full border border-red-200 cursor-pointer opacity-0 group-hover/memb:opacity-100 transition-opacity"
                    title="Remove Profile"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Behavior Award Cards */}
          <div className="bg-white border-2 border-outline-variant p-4 rounded-[2rem] shadow-3d-neutral flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2.5">
              <span className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wider flex items-center gap-1">
                <span>👍</span> Award Points For Positive Behaviors
              </span>
              <button
                onClick={() => setShowAddBehavior(!showAddBehavior)}
                className="text-[8.5px] font-black bg-primary/10 text-primary hover:bg-primary/15 px-2 py-1 rounded-lg border border-primary/20 uppercase tracking-wider font-display"
              >
                {showAddBehavior ? 'Close' : '+ Add Custom'}
              </button>
            </div>

            {/* Add behavior form */}
            {showAddBehavior && (
              <form onSubmit={handleAddBehavior} className="bg-slate-50 p-3 rounded-2xl border-2 border-outline-variant flex flex-col gap-2.5 animate-scale-in text-on-surface">
                <span className="text-[8.5px] font-black uppercase text-on-surface-variant block">Log New Behavioral Task Habit</span>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[7.5px] font-bold text-on-surface-variant block">Behavioral Habit Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shared toys without yelling or triggers"
                    value={newBehaviorName}
                    onChange={e => setNewBehaviorName(e.target.value)}
                    className="w-full bg-white text-[10.5px] font-bold text-[#4B4B4B] px-2.5 py-1.5 rounded-xl border border-outline-variant focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[8px] font-sans">
                  <div>
                    <label className="font-bold text-on-surface-variant block mb-0.5">Points Awarded</label>
                    <input
                      type="number"
                      value={newBehaviorPoints}
                      onChange={e => setNewBehaviorPoints(Number(e.target.value))}
                      className="w-full bg-white px-2 py-1 rounded-lg border border-outline-variant text-[10px] font-bold text-[#4B4B4B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface-variant block mb-0.5">Emoji Icon</label>
                    <select
                      value={newBehaviorEmoji}
                      onChange={e => setNewBehaviorEmoji(e.target.value)}
                      className="w-full bg-white px-2 py-1 rounded-lg border border-outline-variant text-[10px] font-bold text-[#4B4B4B]"
                    >
                      {['🌟', '💬', '🤝', '🧹', '🧸', '📚', '🏃', '🍕'].map(em => (
                        <option key={em} value={em}>{em}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-on-surface-variant block mb-0.5">Class / Category</label>
                    <select
                      value={newBehaviorCat}
                      onChange={e => setNewBehaviorCat(e.target.value as any)}
                      className="w-full bg-white px-1.5 py-1 rounded-lg border border-outline-variant text-[10px] font-bold text-[#4B4B4B]"
                    >
                      <option value="cbt">CBT Skill</option>
                      <option value="cooperative">Cooperative</option>
                      <option value="responsibility">Responsibility</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1CB0F6] text-white text-[9px] font-black uppercase py-2 rounded-xl border-b-[3px] border-[#1899D6] mt-1"
                >
                  Create Reinforcement Habit
                </button>
              </form>
            )}

            {/* List of actions to award points */}
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
              {behaviorTasks.map((task) => (
                <div key={task.id} className="bg-slate-50 hover:bg-slate-100 border border-outline-variant rounded-2xl p-2.5 flex items-start gap-2 justify-between transition-colors relative group/bhv">
                  <div className="flex gap-2 min-w-0">
                    <span className="text-sm shrink-0 bg-white w-7 h-7 rounded-full border border-outline-variant/60 flex items-center justify-center mt-0.5">{task.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-sans text-[10.5px] font-semibold text-[#4B4B4B] leading-tight pr-1">
                        {task.name}
                      </p>
                      <span className={`text-[6.5px] font-black uppercase tracking-widest px-1 py-0.25 rounded border block w-fit mt-1.5 ${
                        task.category === 'cbt' ? 'bg-[#1CB0F6]/5 text-sky-700 border-[#1CB0F6]/15' :
                        task.category === 'cooperative' ? 'bg-[#58CC02]/5 text-green-700 border-[#58CC02]/15' :
                        'bg-purple-50 text-purple-700 border-purple-150'
                      }`}>
                        {task.category === 'cbt' ? 'Clinical CBT Tool' : task.category === 'cooperative' ? 'Cooperative Bond' : 'Household Routine'}
                      </span>
                    </div>
                  </div>

                  {/* Award selector */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-mono font-black text-[#58CC02] shrink-0">+{task.points} pts</span>
                    
                    <div className="flex gap-1 mt-1">
                      {familyMembers.map(m => (
                        <button
                          key={m.id}
                          onClick={() => handleAwardPoints(m.id, task)}
                          className="bg-white hover:bg-emerald-50 text-[9px] font-black text-on-surface border border-outline-variant/80 hover:border-[#58CC02] px-1.5 py-0.75 rounded-md transition-all active:scale-95 cursor-pointer shrink-0"
                          title={`Award to ${m.name}`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delete option */}
                  <button
                    onClick={() => handleDeleteBehavior(task.id)}
                    className="absolute top-1 right-1 bg-red-50 text-red-600 opacity-0 group-hover/bhv:opacity-100 hover:bg-red-100 p-0.5 rounded-full transition-opacity"
                    title="Remove behavior"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reward redemption card */}
          <div className="bg-white border-2 border-outline-variant p-4 rounded-[2rem] shadow-3d-neutral flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2.5">
              <span className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wider flex items-center gap-1">
                <span>🎁</span> Reward Redemption Shop
              </span>
              <button
                onClick={() => setShowAddReward(!showAddReward)}
                className="text-[8.5px] font-black bg-primary/10 text-primary hover:bg-primary/15 px-2 py-1 rounded-lg border border-primary/20 uppercase tracking-wider font-display"
              >
                {showAddReward ? 'Close' : '+ Add Reward'}
              </button>
            </div>

            {/* Add Reward Form */}
            {showAddReward && (
              <form onSubmit={handleAddReward} className="bg-slate-50 p-3 rounded-2xl border-2 border-outline-variant flex flex-col gap-2.5 animate-scale-in text-on-surface">
                <span className="text-[8.5px] font-black uppercase text-on-surface-variant block">Create Reward Offering</span>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[7.5px] font-bold text-on-surface-variant block">Reward Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saturday Bedtime Extended by 1 Hour"
                    value={newRewardName}
                    onChange={e => setNewRewardName(e.target.value)}
                    className="w-full bg-white text-[10.5px] font-bold text-[#4B4B4B] px-2.5 py-1.5 rounded-xl border border-outline-variant focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[8px] font-sans">
                  <div>
                    <label className="font-bold text-on-surface-variant block mb-0.5">Points Cost</label>
                    <input
                      type="number"
                      value={newRewardCost}
                      onChange={e => setNewRewardCost(Number(e.target.value))}
                      className="w-full bg-white px-2 py-1 rounded-lg border border-outline-variant text-[10px] font-bold text-[#4B4B4B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface-variant block mb-0.5">Reward Emoji</label>
                    <select
                      value={newRewardEmoji}
                      onChange={e => setNewRewardEmoji(e.target.value)}
                      className="w-full bg-white px-2 py-1 rounded-lg border border-outline-variant text-[10px] font-bold text-[#4B4B4B]"
                    >
                      {['🎁', '🎮', '🥞', '🍨', '🎬', '🎪', '⚽', '🎒'].map(em => (
                        <option key={em} value={em}>{em}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white text-[9px] font-black uppercase py-2 rounded-xl border-b-[3px] border-purple-800 mt-1"
                >
                  Publish Reward Card
                </button>
              </form>
            )}

            {/* Rewards selection list */}
            <div className="flex flex-col gap-2">
              {rewards.map((reward) => (
                <div key={reward.id} className="bg-slate-50 border border-outline-variant rounded-2xl p-2.5 flex items-center justify-between relative group/rwd">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0 bg-white w-7.5 h-7.5 rounded-full border border-outline-variant/60 flex items-center justify-center">{reward.emoji}</span>
                    <div className="min-w-0">
                      <h5 className="font-sans text-[10.5px] font-bold text-[#4B4B4B] leading-none">{reward.name}</h5>
                      <span className="text-[8px] font-black text-purple-700 uppercase tracking-wider block mt-1">Cost: {reward.cost} points</span>
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    {familyMembers.map(m => (
                      <button
                        key={m.id}
                        disabled={m.points < reward.cost}
                        onClick={() => handleRedeemReward(m.id, reward)}
                        className={`text-[8.5px] font-black px-2 py-1 rounded-md transition-all active:scale-95 cursor-pointer shrink-0 border ${
                          m.points >= reward.cost
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200'
                            : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50 cursor-not-allowed'
                        }`}
                        title={m.points < reward.cost ? `${m.name} lacks enough points (${m.points}/${reward.cost})` : `Redeem for ${m.name}`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>

                  {/* Delete Option */}
                  <button
                    onClick={() => handleDeleteReward(reward.id)}
                    className="absolute top-1 right-1 bg-red-50 text-red-600 opacity-0 group-hover/rwd:opacity-100 hover:bg-red-100 p-0.5 rounded-full transition-opacity"
                    title="Remove reward"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Point logs */}
          <div className="bg-white border-2 border-outline-variant p-4 rounded-[2rem] shadow-3d-neutral flex flex-col gap-2.5">
            <span className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wider border-b border-outline-variant/60 pb-1.5">Action & Redemption History Ledger</span>
            <div className="flex flex-col gap-2 divide-y divide-outline-variant/40 max-h-[160px] overflow-y-auto no-scrollbar">
              {logs.map((log) => (
                <div key={log.id} className="pt-2 flex justify-between items-start text-[10px] font-sans">
                  <div className="flex gap-2 items-start">
                    <span className="text-sm mt-0.5">{log.emoji}</span>
                    <div>
                      <p className="font-semibold text-[#4B4B4B]">
                        <strong>{log.memberName}</strong>: {log.behaviorName}
                      </p>
                      <span className="text-[7.5px] text-on-surface-variant/80 font-mono font-semibold">{log.timestamp}</span>
                    </div>
                  </div>
                  <span className={`font-mono font-black text-[9.5px] shrink-0 ${log.points > 0 ? 'text-[#58CC02]' : 'text-red-500'}`}>
                    {log.points > 0 ? `+${log.points}` : log.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLINICAL GUIDES */}
      {activeTab === 'guides' && (
        <div className="flex flex-col gap-4 animate-fade-in text-[#4B4B4B]">
          
          {/* Guide 1: Gottman's Emotion Coaching */}
          <section className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="text-xl">🎓</span>
              <div>
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B]">Emotion Coaching Guidelines</h3>
                <span className="text-[8px] font-bold text-on-surface-variant block uppercase">By Drs. John & Julie Gottman</span>
              </div>
            </div>

            <p className="font-sans text-[11px] leading-relaxed text-on-surface-variant/95">
              Instead of dismissing, punishing, or ignoring kids' raw emotional upsets (which fractures attachment), use Gottman's <strong>5 Steps of Emotion Coaching</strong> to convert tantrums or anxiety into secure parenting intimacy:
            </p>

            <div className="flex flex-col gap-2.5 mt-1.5 font-sans text-[10.5px]">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-outline-variant">
                <strong>1. Be Aware of Emotions:</strong> Tune in to your own emotional state and notice your child's feelings early, treating quiet withdrawal as a bid for closeness.
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-outline-variant">
                <strong>2. Connect & Teach:</strong> View raw distress as an invaluable opportunity for behavioral teaching, vulnerability alignment, and building emotional vocabulary.
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-outline-variant">
                <strong>3. Listen Empathetically:</strong> Sit in silence, validate their physical state, and refuse to rush into giving parental advice or correcting assumptions.
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-outline-variant">
                <strong>4. Name the Emotion:</strong> Help them attach clear linguistic labels (e.g., jealous, inadequate, anxious, invisible) to their physical sensations.
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-outline-variant">
                <strong>5. Collaborate on Limits:</strong> Say, "I understand you feel angry, but hitting is not okay." Explore constructive reframes and problem-solve together.
              </div>
            </div>
          </section>

          {/* Guide 2: PBIS Positive Parenting Cheat Sheet */}
          <section className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="text-xl">🌱</span>
              <div>
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B]">PBIS Behavioral Reinforcement</h3>
                <span className="text-[8px] font-bold text-on-surface-variant block uppercase">Positive Behavioral Interventions & Supports</span>
              </div>
            </div>

            <p className="font-sans text-[11px] leading-relaxed text-on-surface-variant/95">
              To dismantle negative parent-child power struggles, swap chronic corrections with proactive, positive systemic environments:
            </p>

            <div className="space-y-2 text-[10px] font-sans leading-relaxed">
              <p>
                <strong>🎯 Ratio of 4:1 Positive Reinforcement:</strong> Before pointing out any chore failures or routine delays, identify and explicitly voice 4 distinct, genuine appreciations for things done right.
              </p>
              <p>
                <strong>🏷️ Immediate Behavior Labeling:</strong> Avoid saying generic praises like "Good boy." Instead, use high-fidelity behavioral labeling: <em>"I noticed you kept your voice calm when Taylor took your toys. That showed incredible emotional control!"</em>
              </p>
              <p>
                <strong>⚖️ Avoid "Negative Conditioning" loops:</strong> Nagging teenagers for messy rooms often acts as accidental reinforcement for withdrawal. Use visual co-op chore contracts (like the Fair Play deck) instead of spontaneous verbal demands.
              </p>
            </div>
          </section>

          {/* Recommended Literature */}
          <section className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="text-xl">📚</span>
              <div>
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B]">Recommended Family Books Spec</h3>
                <span className="text-[8px] font-bold text-on-surface-variant block uppercase">Clinical Literature Reference</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 font-sans text-[10.5px]">
              <div>
                <strong className="text-primary block">"Raising An Emotionally Intelligent Child"</strong>
                <span className="text-[8.5px] font-bold text-on-surface-variant block">Dr. John Gottman</span>
                <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                  The seminal guidebook on Gottman's 5 Steps of Emotion Coaching, complete with diagnostic tests for parent styles.
                </p>
              </div>
              <div>
                <strong className="text-primary block">"The Whole-Brain Child"</strong>
                <span className="text-[8.5px] font-bold text-on-surface-variant block">Drs. Daniel J. Siegel & Tina Payne Bryson</span>
                <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                  12 revolutionary strategies to nurture healthy brain development, combining right-brain connection with left-brain logic.
                </p>
              </div>
              <div>
                <strong className="text-primary block">"Fair Play: Share the Load, Decompress Your Marriage"</strong>
                <span className="text-[8.5px] font-bold text-on-surface-variant block">Eve Rodsky</span>
                <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                  Deconstructs domestic cognitive overload and outlines a highly actionable systemic game rules deck for partners.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 3: RECOMMENDED APPS & DIGITAL ORGANIZERS */}
      {activeTab === 'apps' && (
        <div className="flex flex-col gap-4 animate-fade-in text-[#4B4B4B]">
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-[11px] leading-relaxed text-purple-950 flex gap-2">
            <Smartphone className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
            <p>
              <strong>Relational Tech Integrations:</strong> These top-tier external apps and services are highly recommended by clinical therapists to synchronize household labor, protect co-parenting parameters, and gamify daily routines.
            </p>
          </div>

          {/* Directory list of recommended tools */}
          <div className="flex flex-col gap-3">
            
            {/* App 1: OurFamilyWizard */}
            <div className="bg-white border-2 border-outline-variant p-4 rounded-2xl shadow-sm flex gap-3 items-start">
              <span className="text-2xl bg-[#CE9FFC]/10 border border-[#CE9FFC]/20 p-2 rounded-xl shrink-0">⚖️</span>
              <div>
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-black text-xs text-[#4B4B4B]">OurFamilyWizard</h4>
                  <span className="text-[7.5px] font-black uppercase bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Co-Parenting</span>
                </div>
                <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
                  Highly recommended for high-conflict or structured co-parenting situations. Features shared expense ledgers, calendar schedules, secure messaging logs, and clinical parenting alignment tracking.
                </p>
                <span className="text-[8px] font-bold font-mono text-primary block mt-2">💡 BEST FOR: Secure co-parent boundary lines and expense clarity.</span>
              </div>
            </div>

            {/* App 2: Cozi Family Organizer */}
            <div className="bg-white border-2 border-outline-variant p-4 rounded-2xl shadow-sm flex gap-3 items-start">
              <span className="text-2xl bg-[#CE9FFC]/10 border border-[#CE9FFC]/20 p-2 rounded-xl shrink-0">📅</span>
              <div>
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-black text-xs text-[#4B4B4B]">Cozi Family Organizer</h4>
                  <span className="text-[7.5px] font-black uppercase bg-sky-150 text-sky-700 px-1.5 py-0.5 rounded">Domestic Calendar</span>
                </div>
                <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
                  A comprehensive shared family calendar, grocery shopping checklist, chore ledger, and family meal planner. Simple to learn and syncs in real-time across multiple family devices.
                </p>
                <span className="text-[8px] font-bold font-mono text-primary block mt-2">💡 BEST FOR: Streamlining weekly dinners, groceries, and kids' carpools.</span>
              </div>
            </div>

            {/* App 3: Gottman Card Decks */}
            <div className="bg-white border-2 border-outline-variant p-4 rounded-2xl shadow-sm flex gap-3 items-start">
              <span className="text-2xl bg-[#CE9FFC]/10 border border-[#CE9FFC]/20 p-2 rounded-xl shrink-0">❤️</span>
              <div>
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-black text-xs text-[#4B4B4B]">Gottman Card Decks</h4>
                  <span className="text-[7.5px] font-black uppercase bg-rose-150 text-rose-700 px-1.5 py-0.5 rounded">Intimacy Bids</span>
                </div>
                <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
                  Free mobile companion app created by The Gottman Institute. Packed with hundreds of clinical flashcards, open-ended Love Map questions, appreciations, and direct relationship rituals.
                </p>
                <span className="text-[8px] font-bold font-mono text-primary block mt-2">💡 BEST FOR: Quick daily intimacy prompts on the couch or date night.</span>
              </div>
            </div>

            {/* App 4: Fair Play Cards App */}
            <div className="bg-white border-2 border-outline-variant p-4 rounded-2xl shadow-sm flex gap-3 items-start">
              <span className="text-2xl bg-[#CE9FFC]/10 border border-[#CE9FFC]/20 p-2 rounded-xl shrink-0">🃏</span>
              <div>
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-black text-xs text-[#4B4B4B]">The Fair Play Game App</h4>
                  <span className="text-[7.5px] font-black uppercase bg-emerald-150 text-emerald-700 px-1.5 py-0.5 rounded">Domestic Labor</span>
                </div>
                <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
                  The digital counterpart to Eve Rodsky's card system. Facilitates re-allocating household administrative burdens to eliminate resentment, checking, and repetitive domestic nagging.
                </p>
                <span className="text-[8px] font-bold font-mono text-primary block mt-2">💡 BEST FOR: Couples looking to re-balance the invisible domestic mental load.</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
