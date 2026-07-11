import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StickFigureAnimator from './StickFigureAnimator';
import { 
  Heart, Users, Smile, ShieldCheck, Flame, BookOpen, AlertTriangle, 
  CheckCircle, Plus, Trash2, ArrowRight, CornerDownRight, RotateCcw, 
  MessageCircle, Sparkles, Trophy, Shuffle, PenTool, Calendar, Filter,
  Percent, Award, HeartHandshake
} from 'lucide-react';
import { CouplesLogEntry } from '../types';

interface LoveMapQuestion {
  id: number;
  category: string;
  question: string;
}

const LOVE_MAP_QUESTIONS: LoveMapQuestion[] = [
  { id: 1, category: 'Stressors & Worries', question: 'What is your partner’s current biggest professional or personal stressor?' },
  { id: 2, category: 'Friends & Rivals', question: 'Who are your partner’s two best friends right now?' },
  { id: 3, category: 'Dreams & Aspirations', question: 'What is one major dream or goal your partner hopes to accomplish in the next 3 years?' },
  { id: 4, category: 'Unwinding', question: 'How does your partner prefer to rest or unwind after an extremely exhausting day?' },
  { id: 5, category: 'Fond Memories', question: 'What is your partner’s absolute favorite memory of your early relationship?' },
  { id: 6, category: 'Favorites', question: 'What is your partner’s favorite overall meal, restaurant, or comfort food?' },
  { id: 7, category: 'Fears & Triggers', question: 'What is a specific childhood event or old stress trigger that continues to shape how your partner reacts to conflict?' },
  { id: 8, category: 'Appreciations', question: 'What is a specific personality trait or strength of theirs that you admire most?' }
];

const DEEP_LOVE_MAP_QUESTIONS: LoveMapQuestion[] = [
  { id: 9, category: 'Vulnerability & Childhood', question: 'What is an emotional family pattern from childhood that your partner is still actively trying to heal or overcome?' },
  { id: 10, category: 'Security & Comfort', question: 'What somatic or physical gesture (e.g. hand on cheek, deep close hug) lets your partner instantly feel safest when they are crying?' },
  { id: 11, category: 'Future Pathways', question: 'If your partner could change one major thing about their current daily lifestyle design, what would it be?' },
  { id: 12, category: 'Shared Meaning', question: 'What do you think is your partner’s deepest unexpressed hope or dream for the long-term legacy of your relationship?' }
];

const LOVE_LANGUAGES_INFO = {
  words: {
    name: 'Words of Affirmation',
    icon: '🗣️',
    label: 'Words',
    desc: 'Value spoken affection, praise, appreciation stickies, and validating text check-ins.',
    tips: [
      'Write a sticky note detailing 1 character strength you observed in them today.',
      'Send a midday reassurance SMS purely to say how lucky you are to be in their corner.',
      'Explicitly validate their fatigue before talking about chores.'
    ]
  },
  time: {
    name: 'Quality Time',
    icon: '⏳',
    label: 'Time',
    desc: 'Feel most cherished when eyes are locked, phones are pocketed, and focus is shared.',
    tips: [
      'Implement the 10-Minute Stress-Reducing Conversation without look-at-screens.',
      'Invite them to sit on the porch or carpet to discuss their favorite childhood memory for 15 minutes.',
      'Plan a novel weekend walk somewhere neither of you has visited recently.'
    ]
  },
  gifts: {
    name: 'Receiving Gifts',
    icon: '🎁',
    label: 'Gifts',
    desc: 'Cherish thoughtfulness, visual tokens, and unexpected gestures that show you held them in mind while apart.',
    tips: [
      'Pick a singular wildflower on your way home and present it with a 1-sentence joke.',
      'Buy their favorite comfortable snack or juice box and place it on their workspace keyboard.',
      'Create a tiny handmade craft (or fold an elegant paper origami crane) for their bedside.'
    ]
  },
  service: {
    name: 'Acts of Service',
    icon: '🛠️',
    label: 'Service',
    desc: 'Actions speak louder than words. Softening their daily burden of chores lets them feel relaxed and secure.',
    tips: [
      'Reset their workplace coffee cup or make their tea exactly how they take it before they sit down.',
      'Quietly execute a domestic chore they notoriously dread (e.g. wiping counters, scraping windshield).',
      'Take 3 tedious admin paperwork or schedule tasks off their plates for the week.'
    ]
  },
  touch: {
    name: 'Physical Touch',
    icon: '🫂',
    label: 'Touch',
    desc: 'Somatic close contact, hand holding, rubs, hugging, and somatic presence regulate their heart rate.',
    tips: [
      'Trigger the Gottman 6-second hug immediately when you reunite at the end of the day.',
      'Offer a gentle, non-demand shoulder or scalp squeeze while they are sipping evening tea.',
      'Synchronize your breath while keeping hand-holding contact on the couch for 3 minutes.'
    ]
  }
};

interface ConnectionActivity {
  id: string;
  category: 'quick' | 'date' | 'somatic';
  title: string;
  duration: string;
  desc: string;
  clinicalBenefit: string;
  actionInstructions: string;
}

const COUPLES_ACTIVITIES: ConnectionActivity[] = [
  {
    id: 'six_sec_hug',
    category: 'somatic',
    title: 'Physiological Oxytocin Reset (The 6-Second Kiss/Hug)',
    duration: '6 Seconds',
    desc: 'Lock in and hold each other in a continuous, tight embrace or kiss for a minimum of 6 seconds without moving.',
    clinicalBenefit: 'Six seconds is the clinical threshold required to release oxytocin, down-regulate cortisol levels, and signal safety to the amygdala.',
    actionInstructions: "Stand up, face each other, drop your bags, and hold each other's weight. Breathe together."
  },
  {
    id: 'five_min_unwind',
    category: 'quick',
    title: 'The Daily Stress-Reducing Union Dialogue',
    duration: '10 Minutes',
    desc: 'Take turns talking about outside-the-relationship stress for 5 minutes each. The listener must act as an ally without offering solutions.',
    clinicalBenefit: 'De-escalates external stress before it builds up and floods the relationship. Validates mutual listening safety.',
    actionInstructions: "No-advice zone: Your only task is validation. Say: 'That sounds really challenging, I understand why you feel that way.'"
  },
  {
    id: 'eye_melt',
    category: 'somatic',
    title: 'The Eye-Contact Gaze Melt',
    duration: '2 Minutes',
    desc: 'Sit cross-legged facing each other on the floor or couch. Hold hands and look steadily into each other’s eyes without talking.',
    clinicalBenefit: 'Increases vagal tone, enhances couples emotional resonance, and synchronizes cardiovascular breathing.',
    actionInstructions: "Keep hands warm, adjust posture. If you laugh or feel silly, just acknowledge it and return to silence."
  },
  {
    id: 'novel_adventure',
    category: 'date',
    title: 'Gottman Dopamine Romance Date',
    duration: '2 Hours',
    desc: 'Schedule a time to experience a novel, completely new activity together (e.g. scenic road drive, museum, pottery, cooking a complex meal).',
    clinicalBenefit: 'Novel experiences trigger brain dopamine release, which re-activates the neurological sensations of early romantic chemistry.',
    actionInstructions: "Decide on a location neither of you has ever been. Make rules: No work talk allowed during this date."
  },
  {
    id: 'appreciation_trade',
    category: 'quick',
    title: 'The 3-Appreciation Evening Swap',
    duration: '5 Minutes',
    desc: 'Trade 3 small positive actions you noticed your partner perform today, spelling out the character trait behind each of them.',
    clinicalBenefit: 'Generates Gottman’s \"Culture of Appreciation\" and overrides the natural brain survival bias toward scanning for flaws.',
    actionInstructions: "Be highly specific: E.g., 'Thank you for handling our laundry, it showed how supportive you are of my workload.'"
  },
  {
    id: 'future_dream_gaze',
    category: 'date',
    title: 'Legacy & Dreams Hour',
    duration: '30 Minutes',
    desc: 'Sit somewhere warm with pillows and ask each other: \"If money and chores were completely solved, what legacy or hobby would you craft?\"',
    clinicalBenefit: 'Builds positive shared meaning, which is the apex tier of Drs. Gottman’s Sound Relationship House.',
    actionInstructions: "Ask follow-ups: 'What does that dream represent for you?' 'How can I support you in taking a tiny step toward this?'"
  }
];

interface AppreciationNote {
  id: string;
  from: string;
  to: string;
  category: 'fondness' | 'admiration' | 'gratitude' | 'bid_response';
  text: string;
  timestamp: string;
}

interface InteractiveScenario {
  id: number;
  horseman: 'Criticism' | 'Contempt' | 'Defensiveness' | 'Stonewalling';
  situation: string;
  toxicPhrase: string;
  antidoteTitle: string;
  antidoteDescription: string;
  antidoteStarter: string;
}

const HORSEMEN_SCENARIOS: InteractiveScenario[] = [
  {
    id: 1,
    horseman: 'Criticism',
    situation: 'Your partner forgot to take out the garbage again, despite agreeing to do it.',
    toxicPhrase: '“You always forget things! You are totally unreliable and expect me to do everything around here.”',
    antidoteTitle: 'Gentle Start-up',
    antidoteDescription: 'Talk about your feelings using “I” statements and express what positive outcome or help you currently need.',
    antidoteStarter: '“I feel frustrated when the chores get overlooked. Could you please take the garbage out tonight?”'
  },
  {
    id: 2,
    horseman: 'Contempt',
    situation: 'Your partner made a small scheduling error that clashed with your evening plans.',
    toxicPhrase: '“Oh, surprise, you messed up the dates. I guess learning to read a calendar is too complicated for you.”',
    antidoteTitle: 'Culture of Appreciation',
    antidoteDescription: 'Express positive affection, respect, and build on a history of mutual reassurance rather than mockery.',
    antidoteStarter: '“I know you had a crazy busy week and compiled a lot of tasks. Let’s figure out how we can double check dates together.”'
  },
  {
    id: 3,
    horseman: 'Defensiveness',
    situation: 'Your partner tells you that you left the kitchen counters cluttered and requests help.',
    toxicPhrase: '“Well I’ve been busy all day! Why aren’t you talking about how you never clean the bathroom or pick up your clothes?”',
    antidoteTitle: 'Take Responsibility',
    antidoteDescription: 'Acknowledge even a small part of your partner’s perspective or feedback without counter-attacking.',
    antidoteStarter: '“You’re right, I did leave my plates there when I was rushing out. I will clean columns after this meeting.”'
  },
  {
    id: 4,
    horseman: 'Stonewalling',
    situation: 'A heated argument about household finances is starting to trigger panic and physical overwhelm.',
    toxicPhrase: '“Whatever. I’m just going to leave.” (Walking out silently, shutting down, refusing to reply or make eye contact)',
    antidoteTitle: 'Physiological Self-Soothing',
    antidoteDescription: 'Take a structured, biological timeout of at least 20 minutes to restore heart rates, then return to the dialogue.',
    antidoteStarter: '“I feel flooded and overwhelmed right now. I need to take a 20-minute break to calm down, then I promise we can finish talking.”'
  }
];

interface CouplesTherapySpaceProps {
  couplesLogs?: CouplesLogEntry[];
  setCouplesLogs?: React.Dispatch<React.SetStateAction<CouplesLogEntry[]>>;
  onNavigateToTab?: (tab: string, subtab?: string) => void;
}

export default function CouplesTherapySpace({ 
  couplesLogs: incomingCouplesLogs, 
  setCouplesLogs: incomingSetCouplesLogs,
  onNavigateToTab 
}: CouplesTherapySpaceProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState<'love_maps' | 'love_languages' | 'couples_activities' | 'horsemen' | 'appreciation_vault' | 'union_meeting' | 'relationship_logs'>('love_maps');
  
  // Backing state for couples logs if parent didn't specify
  const [localCouplesLogs, setLocalCouplesLogs] = useState<CouplesLogEntry[]>([]);
  const logs = incomingCouplesLogs !== undefined ? incomingCouplesLogs : localCouplesLogs;
  const setLogs = incomingSetCouplesLogs !== undefined ? incomingSetCouplesLogs : setLocalCouplesLogs;

  // Manual log creation inputs
  const [logTitle, setLogTitle] = useState('');
  const [logDescription, setLogDescription] = useState('');
  const [logType, setLogType] = useState<'activity' | 'checkin' | 'milestone' | 'appreciation'>('activity');
  const [logPartnerA, setLogPartnerA] = useState('Alex');
  const [logPartnerB, setLogPartnerB] = useState('Jamie');

  // State for Love Languages & Fuel Tank
  const [partALoveLang, setPartALoveLang] = useState<'words' | 'time' | 'gifts' | 'service' | 'touch'>('words');
  const [partBLoveLang, setPartBLoveLang] = useState<'words' | 'time' | 'gifts' | 'service' | 'touch'>('time');
  const [partALoveTank, setPartALoveTank] = useState<number>(75);
  const [partBLoveTank, setPartBLoveTank] = useState<number>(80);
  const [loveTankNotes, setLoveTankNotes] = useState<string>('');

  // State for Couples Connection Activities
  const [activityCategory, setActivityCategory] = useState<'all' | 'quick' | 'date' | 'somatic'>('all');
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('couples_completed_activities_v1');
    return saved ? JSON.parse(saved) : {};
  });
  const [runningActivityTimer, setRunningActivityTimer] = useState<string | null>(null);
  const [activitySecondsLeft, setActivitySecondsLeft] = useState<number>(0);

  // De-escalation Active state in State of the Union checkins
  const [activeDeEscalation, setActiveDeEscalation] = useState<string | null>(null);

  // State for Love Maps
  const [showDeepLoveMaps, setShowDeepLoveMaps] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [playerAAnswer, setPlayerAAnswer] = useState('');
  const [playerBAnswer, setPlayerBAnswer] = useState('');
  const [showLoveMapReveal, setShowLoveMapReveal] = useState(false);
  const [scoreBoard, setScoreBoard] = useState<{ aScore: number; bScore: number }>({ aScore: 0, bScore: 0 });
  const [scoreHistory, setScoreHistory] = useState<string[]>([]);

  // State for Appreciation Jar
  const [notes, setNotes] = useState<AppreciationNote[]>(() => {
    const saved = localStorage.getItem('couples_appreciation_notes_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse notes", e);
      }
    }
    return [
      {
        id: 'init-1',
        from: 'Alex',
        to: 'Jamie',
        category: 'gratitude',
        text: 'Thank you for taking care of the coffee setup this morning when you saw I was deeply stuck in back-to-back meetings.',
        timestamp: '6/12/2026'
      },
      {
        id: 'init-2',
        from: 'Jamie',
        to: 'Alex',
        category: 'admiration',
        text: 'I admire your endless patience and focus when you were explaining that difficult concept to your colleague.',
        timestamp: '6/13/2026'
      }
    ];
  });

  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  const [noteCategory, setNoteCategory] = useState<'fondness' | 'admiration' | 'gratitude' | 'bid_response'>('gratitude');
  const [noteText, setNoteText] = useState('');

  // State for Antidote scenario sandbox
  const [userAntidoteAttempts, setUserAntidoteAttempts] = useState<Record<number, string>>({});
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);

  // State for State of the Union structure
  const [meetingStep, setMeetingStep] = useState<1 | 2 | 3 | 4>(1);
  const [meetingSpeaker, setMeetingSpeaker] = useState('Partner A');
  const [meetingListener, setMeetingListener] = useState('Partner B');
  const [meetingTopic, setMeetingTopic] = useState('');
  const [meetingTimer, setMeetingTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Sync Appreciation vaults
  useEffect(() => {
    localStorage.setItem('couples_appreciation_notes_v1', JSON.stringify(notes));
  }, [notes]);

  // Intermittent countdown timer for meetings
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && meetingTimer !== null && meetingTimer > 0) {
      interval = setInterval(() => {
        setMeetingTimer(prev => (prev !== null ? prev - 1 : 0));
      }, 1000);
    } else if (meetingTimer === 0) {
      setIsTimerRunning(false);
      setMeetingTimer(null);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, meetingTimer]);

  // Countdown timer for connection activities
  useEffect(() => {
    let interval: any = null;
    if (runningActivityTimer && activitySecondsLeft > 0) {
      interval = setInterval(() => {
        setActivitySecondsLeft(prev => {
          if (prev <= 1) {
            setRunningActivityTimer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [runningActivityTimer, activitySecondsLeft]);

  const activeQuestionsList = showDeepLoveMaps ? [...LOVE_MAP_QUESTIONS, ...DEEP_LOVE_MAP_QUESTIONS] : LOVE_MAP_QUESTIONS;
  const currentQ = activeQuestionsList[currentQuestionIdx % activeQuestionsList.length];

  const triggerNextQuestion = () => {
    setPlayerAAnswer('');
    setPlayerBAnswer('');
    setShowLoveMapReveal(false);
    setCurrentQuestionIdx(prev => (prev + 1) % activeQuestionsList.length);
  };

  const handleLoveMapAward = (player: 'A' | 'B') => {
    setScoreBoard(prev => {
      const updated = {
        ...prev,
        [player === 'A' ? 'aScore' : 'bScore']: prev[player === 'A' ? 'aScore' : 'bScore'] + 1
      };
      setScoreHistory(hist => [
        `🏆 Granted +1 points to ${player === 'A' ? 'Partner A' : 'Partner B'} on: "${currentQ.question.substring(0, 30)}..."`,
        ...hist
      ]);
      return updated;
    });
    triggerNextQuestion();
  };

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !fromName.trim() || !toName.trim()) return;

    const newNote: AppreciationNote = {
      id: `apprec-${Date.now()}`,
      from: fromName.trim(),
      to: toName.trim(),
      category: noteCategory,
      text: noteText.trim(),
      timestamp: new Date().toLocaleDateString()
    };

    setNotes(prev => [newNote, ...prev]);
    setNoteText('');
    
    // Automatically log this appreciation action into couplesLogs for persistent cloud sync
    const logEntry: CouplesLogEntry = {
      id: `couple-log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'appreciation',
      title: `Appreciation shared by ${newNote.from}`,
      description: `Sent a note of ${newNote.category} to ${newNote.to}: "${newNote.text}"`,
      partnerNames: [newNote.from, newNote.to]
    };
    setLogs(prev => [logEntry, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleSaveAntidoteText = (id: number, text: string) => {
    setUserAntidoteAttempts(prev => ({ ...prev, [id]: text }));
  };

  const toggleCompleteScenario = (id: number) => {
    setCompletedScenarios(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startMeetingTimer = (seconds: number) => {
    setMeetingTimer(seconds);
    setIsTimerRunning(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left" id="couples-therapy-container" style={{ background: '#F9FAFB' }}>
      {/* Clinically elegant Couples Space Header */}
      <div
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: '#FFFFFF', boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}
      >
        {/* Decorative soft pink background shapes */}
        <div className="absolute top-0 right-0 w-36 h-36 rounded-full blur-2xl -z-10" style={{ background: '#EC489910' }} />
        <div className="absolute bottom-0 -left-10 w-44 h-44 rounded-full blur-2xl -z-10" style={{ background: '#EC489908' }} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-4 items-start">
            <div
              className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center relative"
              style={{ background: '#EC489914', border: '1px solid #EC489930' }}
              id="couples-stick-fig-header"
            >
              <StickFigureAnimator type="couple" className="w-11 h-11" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1">
                <span
                  className="text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase whitespace-nowrap"
                  style={{ background: '#EC489914', border: '1px solid #EC489930', color: '#DB2777' }}
                >
                  Gottman Method Suite
                </span>
                <span className="flex items-center gap-0.5 text-[10px] font-bold font-mono whitespace-nowrap" style={{ color: '#EC4899' }}>
                  <Sparkles className="w-3 h-3" style={{ color: '#EC4899', fill: '#EC4899' }} />
                  COUPLES LAB
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight leading-none flex items-center gap-2" style={{ color: '#3C3C3C' }}>
                <Heart className="w-6 h-6 shrink-0" style={{ color: '#EC4899', fill: '#EC4899' }} />
                Shared Trust & Intimacy Space
              </h2>
              <p className="text-xs font-medium max-w-2xl leading-relaxed font-sans" style={{ color: '#6B7280' }}>
                Based on the legendary marital psychology research of Drs. John and Julie Gottman. Map relational metrics, practice positive antidotes under pressure, and safely archive bids for intimacy.
              </p>
            </div>
          </div>

          <div
            className="p-3 rounded-2xl flex items-center gap-3 self-stretch sm:self-center shrink-0"
            style={{ background: '#EC489910', border: '1px solid #EC489925' }}
          >
            <div className="space-y-0.5 text-center px-2">
              <div className="text-[9px] uppercase font-mono font-bold" style={{ color: '#DB2777' }}>Score Team A</div>
              <div className="text-xl font-mono font-black" style={{ color: '#3C3C3C' }}>{scoreBoard.aScore}</div>
            </div>
            <div className="h-8 w-[1px]" style={{ background: '#EC489930' }} />
            <div className="space-y-0.5 text-center px-2">
              <div className="text-[9px] uppercase font-mono font-bold" style={{ color: '#DB2777' }}>Score Team B</div>
              <div className="text-xl font-mono font-black" style={{ color: '#3C3C3C' }}>{scoreBoard.bScore}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Sub-navigation bar inside Couples segment — horizontal scroll w/ snap on mobile */}
      <div
        className="flex gap-1.5 p-1.5 rounded-2xl w-full max-w-4xl mx-auto overflow-x-auto snap-x snap-mandatory"
        style={{ background: '#FFFFFF', boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0', WebkitOverflowScrolling: 'touch' }}
      >
        {[
          { id: 'love_maps' as const, label: '🧩 Love Maps' },
          { id: 'love_languages' as const, label: '💖 Love Languages' },
          { id: 'couples_activities' as const, label: '🎯 Connection Activities' },
          { id: 'horsemen' as const, label: '⚖️ Antidotes' },
          { id: 'appreciation_vault' as const, label: '🏺 Appreciation Vault' },
          { id: 'union_meeting' as const, label: '🗣️ State of the Union' },
          { id: 'relationship_logs' as const, label: '📅 History & Logs' }
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setActiveSubTab(tb.id)}
            className="shrink-0 snap-start min-w-[112px] min-h-[40px] px-3 py-2 text-center rounded-xl text-[11px] font-bold uppercase tracking-wider transition cursor-pointer"
            style={
              activeSubTab === tb.id
                ? { background: '#EC4899', color: '#FFFFFF', boxShadow: '0 3px 10px rgba(236,72,153,0.25)' }
                : { color: '#6B7280', background: 'transparent' }
            }
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* MAIN EXECUTABLE COMPONENTS BY SUBTAB */}

      {/* SUBTAB 1: LOVE MAPS INTERACTIVE CHECK-IN */}
      {activeSubTab === 'love_maps' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Assessment card */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="space-y-0.5">
                <h3 className="text-xs font-black uppercase text-slate-500 font-mono tracking-wider">
                  ACTIVATING YOUR PARTNER INSIGHTS
                </h3>
                <h4 className="text-base font-black text-rose-950">
                  Interactive Gottman Love Map Builder
                </h4>
              </div>
              <button
                type="button"
                onClick={triggerNextQuestion}
                className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer flex items-center gap-1 text-[10px] font-bold"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Skip Question</span>
              </button>
            </div>

            {/* Assessment Deck Vulnerability Level Selector */}
            <div className="flex items-center justify-between bg-rose-50/25 p-3 rounded-2xl border border-rose-100/30">
              <div className="space-y-0.5">
                <span className="text-[11px] font-black text-rose-950 uppercase tracking-wide">Love Map Depth Filter</span>
                <p className="text-[10px] text-slate-500 font-semibold leading-none">Unleash advanced Gottman clinical intimacy prompts</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDeepLoveMaps(!showDeepLoveMaps);
                  setCurrentQuestionIdx(0);
                }}
                className={`py-1.5 px-3.5 border rounded-xl text-[10.5px] font-black uppercase tracking-wider transition cursor-pointer select-none ${
                  showDeepLoveMaps
                    ? 'bg-rose-700 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-rose-800 border-rose-200 hover:bg-rose-50'
                }`}
              >
                {showDeepLoveMaps ? '🔥 Deeper Vulnerability Active' : '🌱 Standard Prompts'}
              </button>
            </div>

            {/* Assessment Deck Question box */}
            <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-100/50 space-y-3 relative overflow-hidden">
              <span className="text-[9px] uppercase font-mono tracking-widest font-extrabold text-rose-500">
                CATEGORY: {currentQ.category}
              </span>
              <p className="text-base font-bold text-slate-800 leading-tight">
                {currentQ.question}
              </p>
              <div className="text-[10px] text-slate-400 italic">
                <strong>Directions:</strong> Let Partner A answer, then Partner B checks if they guessed correctly. Write responses below to externalize your perspective!
              </div>
            </div>

            {/* Interactive Inputs for reflection storage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9.5px] uppercase font-black text-rose-700 tracking-wider font-mono">
                  PARTNER A ANSWER FOR PARTNER B
                </label>
                <textarea
                  value={playerAAnswer}
                  onChange={(e) => setPlayerAAnswer(e.target.value)}
                  className="w-full h-24 p-3 border border-slate-200 focus:border-rose-500 bg-slate-50/50 text-xs rounded-xl focus:outline-none focus:bg-white leading-relaxed font-semibold text-slate-700 placeholder-slate-400"
                  placeholder="I think Jamie’s biggest stressor currently is..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9.5px] uppercase font-black text-rose-700 tracking-wider font-mono">
                  PARTNER B ANSWER FOR PARTNER A
                </label>
                <textarea
                  value={playerBAnswer}
                  onChange={(e) => setPlayerBAnswer(e.target.value)}
                  className="w-full h-24 p-3 border border-slate-200 focus:border-rose-500 bg-slate-50/50 text-xs rounded-xl focus:outline-none focus:bg-white leading-relaxed font-semibold text-slate-700 placeholder-slate-400"
                  placeholder="Jamie answers: I think Alex’s biggest stressor is..."
                />
              </div>
            </div>

            {/* Score assigning block */}
            <div className="pt-2 flex flex-wrap gap-2 justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-[11px] text-slate-500 font-semibold">
                Which partner accurately identified their lover’s map parameter?
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleLoveMapAward('A')}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold transition cursor-pointer"
                >
                  Confirm Partner A Correct
                </button>
                <button
                  type="button"
                  onClick={() => handleLoveMapAward('B')}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold transition cursor-pointer"
                >
                  Confirm Partner B Correct
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar scores & background information */}
          <div className="space-y-5">
            {/* Gottman Method Love Maps Definition */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider font-mono flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-slate-500" />
                Clinical Concept
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                A <strong>"Love Map"</strong> is that part of your brain where you store all relevant cognitive information about your partner's life: history, favorite habits, major worries, values, and secret ambitions.
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed italic">
                In couples research, couples with rich detail maps are significantly more resilient to unexpected stressors, conflicts, or external threats.
              </p>
            </div>

            {/* Reward logs */}
            <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-2.5 shadow-xs max-h-[220px] overflow-y-auto">
              <h4 className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-widest flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                AWARD TRANSCRIPTS
              </h4>
              <div className="space-y-1.5">
                {scoreHistory.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">No score submissions yet. Validate of one your answers to begin compilation!</p>
                ) : (
                  scoreHistory.map((h, i) => (
                    <div key={i} className="text-[11px] font-bold text-slate-600 border-b border-dashed border-slate-100 pb-1 flex items-start gap-1">
                      <span className="text-rose-400">•</span>
                      <span>{h}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: LOVE LANGUAGES & FUEL TANK INTEGRATOR */}
      {activeSubTab === 'love_languages' && (
        <div className="space-y-6 text-left">
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-50/40 via-white to-pink-50/20 p-5 rounded-3xl border border-rose-100 shadow-3xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              </span>
              <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-wider">Love Languages & Emotional Reservoir</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Fill each other’s emotional fuel tanks by matching clinical connection bids with your partner’s primary receptivity language.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* PARTNER A CONTROLS */}
            <div className="md:col-span-6 bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-3xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Partner A: {logPartnerA}</span>
                  </h4>
                  <span className="text-[9px] font-mono text-indigo-600 font-extrabold bg-indigo-50 border px-2 py-0.5 rounded uppercase">
                    Sender A
                  </span>
                </div>

                {/* Love language selectors */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-wider">
                    Primary Love Language
                  </label>
                  <select
                    value={partALoveLang}
                    onChange={(e: any) => setPartALoveLang(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none transition cursor-pointer"
                  >
                    {Object.entries(LOVE_LANGUAGES_INFO).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.icon} {value.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Love tank slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black">
                    <span className="text-slate-500 uppercase font-mono">Love Tank Volume</span>
                    <span className="text-rose-600 font-mono">{partALoveTank}% filled</span>
                  </div>
                  
                  {/* Visual liquid volume meter */}
                  <div className="h-6 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative">
                    <div 
                      className="absolute left-0 bottom-0 top-0 bg-gradient-to-r from-teal-400 to-emerald-500 transition-all duration-500 rounded-l"
                      style={{ width: `${partALoveTank}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10.5px] font-black text-slate-800 font-sans z-10">
                      {partALoveTank < 35 ? '⚠️ Reservoir Low' : partALoveTank < 70 ? '⚖️ Homeostasis' : '⚡ High Resilience'} ({partALoveTank}%)
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={partALoveTank}
                    onChange={(e) => setPartALoveTank(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                  />
                </div>

                {/* Selected Love language details & Tips */}
                <div className="bg-slate-50/50 border border-slate-200/70 p-3 rounded-xl space-y-2">
                  <h5 className="text-[10px] uppercase font-black tracking-wide text-slate-500 flex items-center gap-1">
                    <span>{LOVE_LANGUAGES_INFO[partALoveLang].icon}</span>
                    <span>{LOVE_LANGUAGES_INFO[partALoveLang].name} Guideline</span>
                  </h5>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed font-semibold">
                    {LOVE_LANGUAGES_INFO[partALoveLang].desc}
                  </p>
                  
                  <div className="space-y-1 pt-1 border-t border-slate-200/50">
                    <span className="text-[8.5px] font-black text-rose-500 uppercase tracking-widest block font-mono">Suggested Positive Actions:</span>
                    {LOVE_LANGUAGES_INFO[partALoveLang].tips.map((tip, idx) => (
                      <div key={idx} className="text-[10px] font-bold text-slate-600 flex items-start gap-1 pb-1 leading-normal">
                        <span className="text-[#3b82f6] shrink-0">•</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* PARTNER B CONTROLS */}
            <div className="md:col-span-6 bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-3xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                    <span>Partner B: {logPartnerB}</span>
                  </h4>
                  <span className="text-[9px] font-mono text-pink-600 font-extrabold bg-pink-50 border px-2 py-0.5 rounded uppercase">
                    Sender B
                  </span>
                </div>

                {/* Love language selectors */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-wider">
                    Primary Love Language
                  </label>
                  <select
                    value={partBLoveLang}
                    onChange={(e: any) => setPartBLoveLang(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none transition cursor-pointer"
                  >
                    {Object.entries(LOVE_LANGUAGES_INFO).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.icon} {value.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Love tank slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black">
                    <span className="text-slate-500 uppercase font-mono">Love Tank Volume</span>
                    <span className="text-rose-600 font-mono">{partBLoveTank}% filled</span>
                  </div>
                  
                  {/* Visual liquid volume meter */}
                  <div className="h-6 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative">
                    <div 
                      className="absolute left-0 bottom-0 top-0 bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-500 rounded-l"
                      style={{ width: `${partBLoveTank}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10.5px] font-black text-slate-800 font-sans z-10">
                      {partBLoveTank < 35 ? '⚠️ Reservoir Low' : partBLoveTank < 70 ? '⚖️ Homeostasis' : '⚡ High Resilience'} ({partBLoveTank}%)
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={partBLoveTank}
                    onChange={(e) => setPartBLoveTank(parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                  />
                </div>

                {/* Selected Love language details & Tips */}
                <div className="bg-slate-50/50 border border-slate-200/70 p-3 rounded-xl space-y-2">
                  <h5 className="text-[10px] uppercase font-black tracking-wide text-slate-500 flex items-center gap-1">
                    <span>{LOVE_LANGUAGES_INFO[partBLoveLang].icon}</span>
                    <span>{LOVE_LANGUAGES_INFO[partBLoveLang].name} Guideline</span>
                  </h5>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed font-semibold">
                    {LOVE_LANGUAGES_INFO[partBLoveLang].desc}
                  </p>
                  
                  <div className="space-y-1 pt-1 border-t border-slate-200/50">
                    <span className="text-[8.5px] font-black text-rose-500 uppercase tracking-widest block font-mono">Suggested Positive Actions:</span>
                    {LOVE_LANGUAGES_INFO[partBLoveLang].tips.map((tip, idx) => (
                      <div key={idx} className="text-[10px] font-bold text-slate-600 flex items-start gap-1 pb-1 leading-normal">
                        <span className="text-[#3b82f6] shrink-0">•</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core bidding statement text */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
            <h5 className="text-[10px] font-black text-slate-500 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <span>📝 Mutual Connection Bidding Contract</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <input
                type="text"
                value={loveTankNotes}
                onChange={(e) => setLoveTankNotes(e.target.value)}
                className="col-span-12 sm:col-span-9 p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                placeholder="e.g., Alex needs extra Quality Time this weekend due to heavy project fatigue..."
              />
              <button
                onClick={() => {
                  if (loveTankNotes.trim()) {
                    const logEntry: CouplesLogEntry = {
                      id: `tank-bid-${Date.now()}`,
                      date: new Date().toISOString().split('T')[0],
                      type: 'checkin',
                      title: 'Love Tank Optimization Bid',
                      description: `Contract committed: "${loveTankNotes.trim()}"`,
                      partnerNames: [logPartnerA, logPartnerB]
                    };
                    setLogs(prev => [logEntry, ...prev]);
                    setLoveTankNotes('');
                  }
                }}
                className="col-span-12 sm:col-span-3 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase rounded-xl tracking-wider transition cursor-pointer"
              >
                Log Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: CONNECTION ACTIVITIES */}
      {activeSubTab === 'couples_activities' && (
        <div className="space-y-6 text-left">
          {/* Header */}
          <div className="bg-gradient-to-br from-teal-50/40 via-white to-sky-50/20 p-5 rounded-3xl border border-teal-100 shadow-3xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-teal-50 text-teal-800 rounded-xl border border-teal-100">
                <Users className="w-4 h-4 text-teal-600" />
              </span>
              <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-wider">Couples Connection Activities</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Select clinically grounded Exercises to experience sensory connection and synchronize your nervous systems.
            </p>
          </div>

          {/* Running Countdown Overlay if active */}
          {runningActivityTimer && (() => {
            const runningAct = COUPLES_ACTIVITIES.find(a => a.id === runningActivityTimer);
            if (!runningAct) return null;
            const minutes = Math.floor(activitySecondsLeft / 60);
            const secs = activitySecondsLeft % 60;
            const formattedTime = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

            return (
              <div className="bg-[#fffdfd] border-2 border-dashed border-rose-300 p-6 rounded-3xl text-center space-y-4 shadow-sm animate-pulse">
                <div className="space-y-1">
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                    ⏱️ Interactive Connection Clock Active
                  </span>
                  <h4 className="text-sm font-black text-rose-950 mt-2">{runningAct.title}</h4>
                  <p className="text-[10px] text-slate-500 font-bold">Keep absolute proximity and breathe steadily together.</p>
                </div>

                <div className="py-2">
                  <span className="text-4xl sm:text-5xl font-mono font-black text-rose-600 tracking-wider block tabular-nums">
                    {formattedTime}
                  </span>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setRunningActivityTimer(null);
                      setActivitySecondsLeft(0);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border text-slate-600 font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                  >
                    Reset Clock
                  </button>
                  <button
                    onClick={() => {
                      setRunningActivityTimer(null);
                      setActivitySecondsLeft(0);
                      // Toggles completion
                      const isNowCompleted = !completedActivities[runningAct.id];
                      const updated = { ...completedActivities, [runningAct.id]: isNowCompleted };
                      setCompletedActivities(updated);
                      localStorage.setItem('couples_completed_activities_v1', JSON.stringify(updated));

                      if (isNowCompleted) {
                        const logEntry: CouplesLogEntry = {
                          id: `act-${Date.now()}`,
                          date: new Date().toISOString().split('T')[0],
                          type: 'activity',
                          title: `Finished: ${runningAct.title}`,
                          description: `Alex and Jamie completed: "${runningAct.title}" with biological synchronization.`,
                          partnerNames: [logPartnerA, logPartnerB]
                        };
                        setLogs(prev => [logEntry, ...prev]);
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                  >
                    Instantly Finish
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Category Switch Filters */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 border rounded-2xl max-w-lg">
            {(['all', 'quick', 'date', 'somatic'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActivityCategory(cat)}
                className={`flex-1 py-1.5 px-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activityCategory === cat
                    ? 'bg-teal-600 text-white shadow-3xs scale-102'
                    : 'text-teal-900/60 hover:text-teal-900 hover:bg-white/50'
                }`}
              >
                {cat === 'all' ? 'All Activities' 
                 : cat === 'quick' ? '⚡ Quick Reconnect'
                 : cat === 'date' ? '🥂 Dates' : '🧘 Somatic'}
              </button>
            ))}
          </div>

          {/* Activities list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COUPLES_ACTIVITIES.filter(act => activityCategory === 'all' || act.category === activityCategory).map((act) => {
              const isCompleted = !!completedActivities[act.id];
              return (
                <div 
                  key={act.id} 
                  className={`p-4 rounded-3xl border text-left flex flex-col justify-between space-y-3.5 transition-all ${
                    isCompleted 
                      ? 'bg-emerald-50/20 border-emerald-200 ring-1 ring-emerald-100 shadow-3xs' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[9px] font-mono tracking-widest uppercase bg-slate-100 border text-slate-500 px-2 py-0.5 rounded">
                        ⌛ {act.duration}
                      </span>
                      {isCompleted && (
                        <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                          Completed✓
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-black text-slate-800 font-sans leading-tight">
                      {act.title}
                    </h4>

                    <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                      {act.desc}
                    </p>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/50 text-[9.5px] leading-relaxed text-slate-600 font-semibold italic">
                      <strong>Clinical Goal:</strong> {act.clinicalBenefit}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                    <button
                      onClick={() => {
                        let secLeft = 60;
                        if (act.duration.includes('Second')) secLeft = parseInt(act.duration);
                        else if (act.duration.includes('Minute')) secLeft = parseInt(act.duration) * 60;
                        else if (act.duration.includes('Hour')) secLeft = parseInt(act.duration) * 3600;

                        setRunningActivityTimer(act.id);
                        setActivitySecondsLeft(secLeft);
                      }}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
                    >
                      ⏱️ Start Connection Clock
                    </button>

                    <button
                      onClick={() => {
                        const isNowCompleted = !completedActivities[act.id];
                        const updated = { ...completedActivities, [act.id]: isNowCompleted };
                        setCompletedActivities(updated);
                        localStorage.setItem('couples_completed_activities_v1', JSON.stringify(updated));

                        if (isNowCompleted) {
                          const logEntry: CouplesLogEntry = {
                            id: `act-${Date.now()}`,
                            date: new Date().toISOString().split('T')[0],
                            type: 'activity',
                            title: `Completed: ${act.title}`,
                            description: `Alex and Jamie checked off: "${act.title}"`,
                            partnerNames: [logPartnerA, logPartnerB]
                          };
                          setLogs(prev => [logEntry, ...prev]);
                        }
                      }}
                      className={`text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                        isCompleted 
                          ? 'bg-emerald-100 hover:bg-emerald-100 text-emerald-800' 
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      {isCompleted ? 'Reset Completion' : 'Mark Completed✓'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: FOUR HORSEMEN INTERACTIVE DRILLS */}
      {activeSubTab === 'horsemen' && (
        <div className="space-y-6">
          <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-left">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide font-mono">
                UNDERSTANDING DEFENSIVE PATHWAYS
              </h4>
              <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                Drs. John Gottman discovered four communication habits that accurately predict relationship distress: <strong>Criticism</strong>, <strong>Contempt</strong>, <strong>Defensiveness</strong>, and <strong>Stonewalling</strong>. Below, practice identifying scenarios and composing healthier partner expressions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {HORSEMEN_SCENARIOS.map((scenario) => {
              const userAttempt = userAntidoteAttempts[scenario.id] || '';
              const isCompleted = completedScenarios.includes(scenario.id);

              return (
                <div 
                  key={scenario.id} 
                  className={`bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row gap-5 relative overflow-hidden transition-all duration-350 ${
                    isCompleted ? 'border-emerald-300 bg-emerald-50/10' : ''
                  }`}
                >
                  <div className="flex-1 space-y-4">
                    {/* Header badge row */}
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-50 border border-rose-100 text-rose-800 text-[9.5px] px-2.5 py-0.5 rounded-full uppercase font-mono font-black">
                        THE HORSEMAN: {scenario.horseman}
                      </span>
                      <CornerDownRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[9.5px] px-2.5 py-0.5 rounded-full uppercase font-mono font-black">
                        ANTIDOTE: {scenario.antidoteTitle}
                      </span>
                    </div>

                    {/* Scenario parameters */}
                    <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">THE SCENARIO SITUATION</div>
                      <p className="text-xs font-bold text-gray-800">{scenario.situation}</p>
                    </div>

                    {/* Toxic phrase card */}
                    <div className="space-y-1 bg-rose-50/30 p-3 rounded-xl border border-rose-100 border-dashed">
                      <div className="text-[10px] text-rose-500 font-extrabold uppercase font-mono tracking-wider">TOXIC COMMUNICATION EXPRESSED</div>
                      <p className="text-xs text-red-700 font-bold italic">{scenario.toxicPhrase}</p>
                    </div>

                    {/* Interactive reframe draft area */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-mono uppercase font-black text-slate-500">YOUR HEALTHY RESPONSE REFRAME PRACTICE</span>
                        <span className="text-emerald-500 font-extrabold font-mono uppercase">COACH TIP: FEELINGS + NEEDS ("I" STATEMENTS)</span>
                      </div>
                      <textarea
                        value={userAttempt}
                        onChange={(e) => handleSaveAntidoteText(scenario.id, e.target.value)}
                        className="w-full h-20 p-3 border border-slate-200 focus:border-teal-500 bg-slate-50/50 text-xs rounded-xl focus:outline-none focus:bg-white leading-relaxed font-semibold text-slate-700 placeholder-slate-400"
                        placeholder="Draft your own Antidote text here utilizing the starter tips below to help clean the communication..."
                      />
                    </div>
                  </div>

                  {/* Left-side Antidote definition panel */}
                  <div className="w-full md:w-80 bg-slate-50/75 rounded-2xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between shrink-0">
                    <div className="space-y-2">
                      <span className="text-[10px] text-teal-800 font-black uppercase font-mono tracking-wide display-block">
                        ✨ Antidote Concept
                      </span>
                      <p className="text-[11px] font-bold text-slate-700 leading-tight">
                        {scenario.antidoteDescription}
                      </p>
                      
                      <div className="pt-2 border-t border-slate-200 space-y-1">
                        <span className="text-[9px] text-slate-400 font-black uppercase font-mono">Starter Framework suggestion:</span>
                        <p className="text-[11px] text-slate-600 font-medium italic border-l-2 border-rose-200 pl-2">
                          {scenario.antidoteStarter}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-200 justify-end">
                      <button
                        type="button"
                        onClick={() => handleSaveAntidoteText(scenario.id, scenario.antidoteStarter)}
                        className="px-2.5 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-100 rounded-lg text-[10px] font-bold cursor-pointer"
                        title="Load perfect clinical formulation as practice starter"
                      >
                        Insert Suggestion
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCompleteScenario(scenario.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition duration-150 flex items-center gap-1 cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                      >
                        {isCompleted && <CheckCircle className="w-3 h-3 text-emerald-500 stroke-[3px]" />}
                        <span>{isCompleted ? 'Completed' : 'Lock Reframe'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: APPRECIATION JAR & BID VAULT */}
      {activeSubTab === 'appreciation_vault' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Post item Form and Jar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3 space-y-1">
              <h3 className="text-xs font-black uppercase text-slate-400 font-mono tracking-widest">APPRECIATION JAR</h3>
              <h4 className="text-base font-black text-rose-950">Add a Trust Asset</h4>
              <p className="text-[11px] text-slate-500 font-medium">Archiving positive bids and validating appreciation traits is the foundation of emotional stability.</p>
            </div>

            <form onSubmit={handlePostNote} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-black text-slate-500 font-mono">FROM</label>
                  <input
                    type="text"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500 font-semibold"
                    placeholder="Alex"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-black text-slate-500 font-mono">TO PARTNER</label>
                  <input
                    type="text"
                    value={toName}
                    onChange={(e) => setToName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500 font-semibold"
                    placeholder="Jamie"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-black text-slate-500 font-mono">CATEGORY</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-semibold text-slate-700"
                >
                  <option value="gratitude">💝 Daily Gratitude & Chore help</option>
                  <option value="fondness">🌹 Mutual Fondness & Chemistry</option>
                  <option value="admiration">🦁 Character Admiration & Strengths</option>
                  <option value="bid_response">🔗 Positive Response to emotional bid</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-black text-slate-500 font-mono">MESSAGE/DESCRIPTION</label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full h-24 p-3 border border-slate-200 focus:border-rose-500 bg-slate-50/50 text-xs rounded-xl focus:outline-none focus:bg-white leading-relaxed font-semibold text-slate-700"
                  placeholder="Focus on specific actions rather than high-level statements. E.g. I felt special when you hugged me when I stepped out of my taxi..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-[11px] uppercase tracking-wider shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Archive Gratitude Sticky</span>
              </button>
            </form>
          </div>

          {/* Render jar grid */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest font-mono">
                INTIMACY JOURNAL ARCHIVES ({notes.length} assets logged)
              </span>
              <span className="text-[10px] text-pink-500 font-extrabold flex items-center gap-0.5">
                <Flame className="w-3.5 h-3.5" />
                Durable trust vaults
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {notes.length === 0 ? (
                <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 italic">The appreciation vault is vacant. Write down a warm thought to generate intimacy assets!</p>
                </div>
              ) : (
                notes.map((n) => {
                  let badgeColors = 'bg-rose-50 border-rose-100 text-rose-800';
                  let catLabel = 'Gratitude';
                  if (n.category === 'fondness') {
                    badgeColors = 'bg-pink-50 border-pink-100 text-pink-800';
                    catLabel = 'Mutual Fondness';
                  } else if (n.category === 'admiration') {
                    badgeColors = 'bg-amber-50 border-amber-100 text-amber-800';
                    catLabel = 'Admiration';
                  } else if (n.category === 'bid_response') {
                    badgeColors = 'bg-indigo-50 border-indigo-100 text-indigo-800';
                    catLabel = 'Bid Received';
                  }

                  return (
                    <div 
                      key={n.id}
                      className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-3 relative overflow-hidden text-left flex flex-col justify-between"
                    >
                      {/* Decorative corner tag */}
                      <div className="absolute top-0 right-0 w-8 h-8 opacity-25 -z-10 rounded-bl-full bg-rose-200" />
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[8.5px] px-2 py-0.5 border font-extrabold uppercase tracking-wider font-mono rounded ${badgeColors}`}>
                            {catLabel}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono tracking-wider font-semibold">{n.timestamp}</span>
                        </div>

                        <p className="text-xs font-semibold text-slate-700 leading-relaxed italic">
                          "{n.text}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold">
                          From: <strong className="text-rose-700">{n.from}</strong> • For: <strong className="text-rose-700">{n.to}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(n.id)}
                          className="p-1 hover:bg-rose-50 text-slate-300 hover:text-red-500 rounded transition cursor-pointer"
                          title="Erase Note from Jar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: STATE OF THE UNION MEETING COMPONENT */}
      {activeSubTab === 'union_meeting' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 text-left relative">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono font-black text-rose-500 tracking-wider">ANNUAL OR WEEKLY CHECK-IN TEMPLATE</span>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-rose-600 block shrink-0" />
                Structured "State of the Union" Conflict Workbook
              </h3>
            </div>

            <div className="flex gap-1">
              {[1, 2, 3, 4].map((stepNum) => (
                <button
                  key={stepNum}
                  onClick={() => setMeetingStep(stepNum as any)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition flex items-center justify-center border cursor-pointer ${
                    meetingStep === stepNum
                      ? 'bg-rose-600 border-rose-500 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  {stepNum}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive metadata setup */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 font-mono">ACTIVE SPEAKER / STORYTELLER</label>
              <input
                type="text"
                value={meetingSpeaker}
                onChange={(e) => setMeetingSpeaker(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-rose-500 font-semibold"
                placeholder="Alex (feels topic)"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 font-mono">ACTIVE LISTENER / REFLECTOR</label>
              <input
                type="text"
                value={meetingListener}
                onChange={(e) => setMeetingListener(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-rose-500 font-semibold"
                placeholder="Jamie (reflects state)"
              />
            </div>
            <div className="space-y-1 col-span-1">
              <label className="text-[9px] font-black uppercase text-slate-400 font-mono">CONCERN / DIALOGUE OBJECTIVE</label>
              <input
                type="text"
                value={meetingTopic}
                onChange={(e) => setMeetingTopic(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-rose-500 font-semibold"
                placeholder="Holiday schedule triggers..."
              />
            </div>
          </div>

          {/* Step Detail display cards */}
          <AnimatePresence mode="wait">
            {meetingStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] text-teal-800 font-black uppercase font-mono tracking-widest">STEP 1 OF 4</span>
                  <h4 className="text-sm font-black text-rose-950">Appreciations & Connecting Bids</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>Instructions:</strong> Before discussing any point of irritation, partners must trade 3 specific highlights of the past week. Do not discuss stress triggers immediately without anchoring physical security first.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-2xl text-[11px] leading-relaxed font-semibold">
                  📖 <strong>Speaker Prompt:</strong> "Jamie, this week, I felt especially loved when you checked in on my day after that long client call."
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[9px] font-black uppercase text-slate-500 block font-mono">Partner check-in checkmark checklist:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-2.5 rounded-xl cursor-pointer">
                      <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500" />
                      <span>Traded Appreciations</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-2.5 rounded-xl cursor-pointer">
                      <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500" />
                      <span>Confirmed presence</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-2.5 rounded-xl cursor-pointer">
                      <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500" />
                      <span>Put away smartphones</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {meetingStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] text-teal-800 font-black uppercase font-mono tracking-widest">STEP 2 OF 4</span>
                  <h4 className="text-sm font-black text-rose-950">Active Speaker Presentation ({meetingSpeaker})</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>Instructions:</strong> The speaker ({meetingSpeaker}) presents their perspective of concern {meetingTopic ? `("${meetingTopic}")` : ''} without blaming the partner. Rely purely on expressing feelings and spelling out their own positive core need. No finger-pointing or generalizations (Avoid saying "you always" or "you never").
                  </p>
                </div>

                {/* Built-in active listening timer */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">ACTIVE SPEAKING CONVERSATIONAL BLOCK TIMER</span>
                    {meetingTimer !== null ? (
                      <div className="text-2xl font-mono font-black text-rose-900">{formatTimer(meetingTimer)}</div>
                    ) : (
                      <div className="text-sm font-bold text-slate-500">Timer is standing by. Give yourself 3 minutes to share without interrupted feedback.</div>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => startMeetingTimer(180)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition duration-150 cursor-pointer"
                    >
                      Configure 3 Min Limits
                    </button>
                    {isTimerRunning && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsTimerRunning(false);
                          setMeetingTimer(null);
                        }}
                        className="p-1 px-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 text-amber-900 border border-amber-100 rounded-2xl text-[11px] leading-relaxed font-semibold">
                  💡 <strong>Formulating the Core Need:</strong> State what you want, rather than mapping what you *don't* want. E.g. "Jamie, I feel overwhelmed by the house clutters. I need us to designate 15 minutes of joint pick-up tasks at 9:00 PM."
                </div>
              </motion.div>
            )}

            {meetingStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] text-teal-800 font-black uppercase font-mono tracking-widest">STEP 3 OF 4</span>
                  <h4 className="text-sm font-black text-rose-950">Active Listener Validation ({meetingListener})</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>Instructions:</strong> The listener ({meetingListener}) does not make defenses, rebuttals, or excuses. Instead, they reflect the content back to their partner, validating the partner's emotional right to feel their way.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-2xl text-[11px] leading-relaxed font-semibold">
                    🗣️ &lsquo;What I Heard You Say...&rsquo;
                    <p className="font-normal pt-1.5 leading-relaxed text-slate-700">
                      "I hear that you feel physically exhausted and anxious when the kitchen counter matches a cluttered state because your mind relies on tidy spaces to relax."
                    </p>
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-2xl text-[11px] leading-relaxed font-semibold">
                    🛡️ &lsquo;That makes sense to me because...&rsquo;
                    <p className="font-normal pt-1.5 leading-relaxed text-slate-700">
                      "It makes complete sense that you'd want us to tackle tidy actions together because you already carry a heavy mental cargo during work hours."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {meetingStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] text-teal-800 font-black uppercase font-mono tracking-widest">STEP 4 OF 4</span>
                  <h4 className="text-sm font-black text-rose-950">Collaborative Resolution / Brainstorming</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>Instructions:</strong> Now that both viewpoints are validated and understood, explore a joint resolution where neither partner has to lose their core truth. Write down joint habits or schedule entries!
                  </p>
                </div>

                <div className="bg-emerald-500 text-white rounded-2xl p-5 border border-emerald-400 shadow-xs flex flex-col sm:flex-row items-center gap-4">
                  <ShieldCheck className="w-8 h-8 shrink-0 text-white" />
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm">Gottman Resolution Accomplished!</h5>
                    <p className="text-xs text-emerald-50 leading-relaxed">
                      You completed a complete State of the Union check-in cycle. By validating before fixing, you reduce adrenaline levels and secure durable relationship trust assets. Let's record this milestone!
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMeetingStep(1);
                      setMeetingTopic('');
                    }}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs uppercase cursor-pointer"
                  >
                    Reset Check-in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const topicStr = meetingTopic || 'Weekly Check-in';
                      setScoreBoard(prev => ({ ...prev, aScore: prev.aScore + 1, bScore: prev.bScore + 1 }));
                      setScoreHistory(prev => [
                        `💖 Completed a "State of the Union" resolution for: "${topicStr}"! +1 points awarded to both partners.`,
                        ...prev
                      ]);

                      // Log into couplesLogs for cloud sync persistence
                      const logEntry: CouplesLogEntry = {
                        id: `couple-log-${Date.now()}`,
                        date: new Date().toISOString().split('T')[0],
                        type: 'checkin',
                        title: `State of the Union Check-in: "${topicStr}"`,
                        description: `Completed structural feedback cycle. Partners engaged in gentle start-up presentations and listening confirmation validation.`,
                        partnerNames: [meetingSpeaker, meetingListener]
                      };
                      setLogs(prev => [logEntry, ...prev]);

                      setMeetingStep(1);
                      setMeetingTopic('');
                      setActiveSubTab('relationship_logs');
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase shadow-xs cursor-pointer"
                  >
                    Award +1 Relationship Victory Points
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <button
              type="button"
              disabled={meetingStep === 1}
              onClick={() => setMeetingStep(prev => (prev - 1) as any)}
              className="px-3 py-1.5 border border-slate-200 text-xs font-bold rounded-xl hover:bg-slate-50 disabled:opacity-50 text-slate-500 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              disabled={meetingStep === 4}
              onClick={() => setMeetingStep(prev => (prev + 1) as any)}
              className="px-3 py-1.5 bg-white hover:bg-white text-[#3C3C3C] text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1"
            >
              <span>Next Phase</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {activeSubTab === 'relationship_logs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timeline Feed column */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="border-b pb-3 border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">💖 Joint Trust Timeline & Milestones</h3>
                <p className="text-[10px] text-slate-500">Live synchronized records of your check-ins, joint tasks, and mutual appreciation milestones.</p>
              </div>
              <span className="text-[9px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
                Synced with Cloud
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-10 px-4 space-y-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">No Relationship Logs Yet</h4>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                  Log your first check-in, complete a State of the Union structure, or write a manual milestone using the form!
                </p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-rose-100">
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-white border border-slate-100 hover:border-rose-200 p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2"
                  >
                    {/* Circle marker on timeline */}
                    <span className="absolute -left-6 top-4 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white shadow-[0_0_0_2px_#ffe4e6]" />
                    
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                            log.type === 'checkin' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' :
                            log.type === 'milestone' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            log.type === 'appreciation' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-slate-50 text-slate-700 border border-slate-200'
                          }`}>
                            {log.type}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800">{log.title}</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{log.description}</p>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 shrink-0 select-none">
                        {log.date}
                      </span>
                    </div>

                    {log.partnerNames && log.partnerNames.length > 0 && (
                      <div className="flex items-center gap-1 pt-1.5 border-t border-slate-50">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span className="text-[9px] font-medium text-slate-500">
                          Participants: {log.partnerNames.join(' & ')}
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setLogs(prev => prev.filter(x => x.id !== log.id));
                      }}
                      className="absolute top-2 right-2 p-1 text-slate-300 hover:text-rose-600 rounded bg-slate-50 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete log"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Form manual log entry */}
          <div className="bg-slate-50/50 rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-black text-rose-950 uppercase tracking-wider">Add Shared Milestone</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Manually record a collaborative counseling triumph, joint date, conflict resolution, or physical relationship milestone.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!logTitle.trim() || !logDescription.trim()) return;

                const newManualEntry: CouplesLogEntry = {
                  id: `couple-manual-${Date.now()}`,
                  date: new Date().toISOString().split('T')[0],
                  type: logType,
                  title: logTitle.trim(),
                  description: logDescription.trim(),
                  partnerNames: [logPartnerA.trim(), logPartnerB.trim()].filter(Boolean)
                };

                setLogs(prev => [newManualEntry, ...prev]);
                setLogTitle('');
                setLogDescription('');
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Log Type</label>
                <select
                  value={logType}
                  onChange={(e) => setLogType(e.target.value as any)}
                  className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-rose-500 outline-none"
                >
                  <option value="activity">🎯 Shared Practice/Activity</option>
                  <option value="checkin">🗣️ Relationship Check-in</option>
                  <option value="milestone">🏆 Gottman Foundation Milestone</option>
                  <option value="appreciation">💖 Appreciation Action</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Title / Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Scheduled Weekly Connection Date"
                  value={logTitle}
                  onChange={(e) => setLogTitle(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-1 focus:ring-rose-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Partner A</label>
                  <input
                    type="text"
                    placeholder="Alex"
                    value={logPartnerA}
                    onChange={(e) => setLogPartnerA(e.target.value)}
                    className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-rose-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Partner B</label>
                  <input
                    type="text"
                    placeholder="Jamie"
                    value={logPartnerB}
                    onChange={(e) => setLogPartnerB(e.target.value)}
                    className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-rose-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Notes / Reflection</label>
                <textarea
                  rows={3}
                  placeholder="Record what was discussed, discovered, or celebrated..."
                  value={logDescription}
                  onChange={(e) => setLogDescription(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-1 focus:ring-rose-500 outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase rounded-xl shadow-xs transition duration-150 cursor-pointer"
              >
                Save to Sync Engine
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Interactive helper triggers pointing partners to therapeutic tools in App
function ActivityLinks({ text }: { text: string }) {
  const normalized = text.toLowerCase();
  
  if (normalized.includes('breathing') || normalized.includes('breath') || normalized.includes('4-7-8')) {
    return (
      <span className="text-[10px] text-teal-600 font-extrabold flex items-center gap-0.5 mt-1 select-none font-mono tracking-wide uppercase">
        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
        Short-cut: Go to "🧘 BREATHWORK" above for dynamic breathing pacers
      </span>
    );
  }

  if (normalized.includes('cbt') || normalized.includes('distortion') || normalized.includes('thought')) {
    return (
      <span className="text-[10px] text-teal-600 font-extrabold flex items-center gap-0.5 mt-1 select-none font-mono tracking-wide uppercase">
        <Sparkles className="w-3 h-3 text-teal-500" />
        Short-cut: Use "🧠 CBT DIARY" above to process negative thoughts
      </span>
    );
  }

  if (normalized.includes('dbt') || normalized.includes('mammalian') || normalized.includes('cold') || normalized.includes('somatic')) {
    return (
      <span className="text-[10px] text-rose-600 font-extrabold flex items-center gap-0.5 mt-1 select-none font-mono tracking-wide uppercase">
        <Sparkles className="w-3 h-3 text-amber-500" />
        Short-cut: Go to "🚨 DBT RESCUE" for cold shock timers & core exercises
      </span>
    );
  }

  if (normalized.includes('gratitude') || normalized.includes('log')) {
    return (
      <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5 mt-1 select-none font-mono tracking-wide uppercase">
        <Sparkles className="w-3 h-3 text-emerald-500" />
        Short-cut: Write a full entry in "💖 GRATITUDE LOG" above
      </span>
    );
  }

  if (normalized.includes('art') || normalized.includes('paint') || normalized.includes('color')) {
    return (
      <span className="text-[10px] text-purple-600 font-extrabold flex items-center gap-0.5 mt-1 select-none font-mono tracking-wide uppercase">
        <Sparkles className="w-3 h-3 text-purple-500" />
        Short-cut: Switch to Activity Tab's "🎨 Art Therapy Space" to paint together
      </span>
    );
  }

  return null;
}
