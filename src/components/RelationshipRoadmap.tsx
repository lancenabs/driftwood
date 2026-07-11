import React, { useState } from 'react';
import { 
  Compass, 
  Trophy, 
  Flag, 
  ShieldCheck, 
  Activity, 
  Heart, 
  Sparkles, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Clock, 
  Edit3, 
  Save, 
  CheckCircle2, 
  Calendar, 
  Smile, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  framework: 'Gottman' | 'EFT' | 'PACT' | 'NVC';
  phase: number;
  description: string;
  objective: string;
  status: 'locked' | 'in_progress' | 'completed';
  completedDate?: string;
  points: number;
  exercise: {
    title: string;
    description: string;
    prompt: string;
    placeholder: string;
  };
}

const INITIAL_MILESTONES: Milestone[] = [
  // GOTTMAN
  {
    id: 'gottman-1',
    title: 'Love Map Discovery',
    framework: 'Gottman',
    phase: 1,
    description: 'Construct a detailed mental map of your partner\'s history, concerns, favorites, and currently active stressors.',
    objective: 'Fill the emotional bank account with genuine interest and proactive knowledge of your partner\'s internal world.',
    status: 'completed',
    completedDate: '2026-07-01',
    points: 150,
    exercise: {
      title: 'The Love Map Update',
      description: 'Ask your partner about their current biggest professional or personal stressor. Share the answer below.',
      prompt: 'What did you discover about your partner\'s current active worries?',
      placeholder: 'E.g., Jamie is currently feeling overwhelmed by the upcoming client migration next Tuesday...'
    }
  },
  {
    id: 'gottman-2',
    title: 'Shielding the 4 Horsemen',
    framework: 'Gottman',
    phase: 2,
    description: 'Recognize the destructive behaviors of Criticism, Contempt, Defensiveness, and Stonewalling, and replace them with healthy antidotes.',
    objective: 'De-escalate defensive responses by introducing soft start-ups, taking physiological breaks, and validating partner\'s perspective.',
    status: 'in_progress',
    points: 200,
    exercise: {
      title: 'Antidote Practice',
      description: 'Translate a critical complaint into a soft start-up statement (using "I" feel, about what, and what I need).',
      prompt: 'Reframe: "You never help with laundry!" into a soft start-up:',
      placeholder: 'E.g., "I feel overwhelmed with the laundry today. Would you be willing to fold this basket with me?"'
    }
  },
  {
    id: 'gottman-3',
    title: 'Turning Towards Bids',
    framework: 'Gottman',
    phase: 3,
    description: 'Consistently recognize and positively respond to minor bids for emotional connection instead of turning away or against.',
    objective: 'Reach the magic 5:1 positive-to-negative interaction ratio during conflict, and 20:1 during non-conflict time.',
    status: 'locked',
    points: 250,
    exercise: {
      title: 'Daily Bid Registry',
      description: 'Log 3 small micro-bids for connection your partner made today that you consciously turned towards.',
      prompt: 'Describe the bids and how you chose to turn towards them:',
      placeholder: 'E.g., 1. Partner sighed at the desk & I brought water. 2. Partner showed me a funny photo & I sat down to laugh...'
    }
  },

  // EFT
  {
    id: 'eft-1',
    title: 'Cycle Awareness (The Loop)',
    framework: 'EFT',
    phase: 1,
    description: 'Expose the reactive cycle (Pursuer-Distancer, Attack-Attack, or Withdraw-Withdraw) that takes over during tension.',
    objective: 'Separate the partner from the problem by identifying "The Cycle" as the common enemy.',
    status: 'completed',
    completedDate: '2026-07-05',
    points: 150,
    exercise: {
      title: 'The Loop Map',
      description: 'Record the standard sequence of your cycle when a friction point arises.',
      prompt: 'When my partner does X, I feel Y, and my outward reaction is Z...',
      placeholder: 'E.g., When Jamie stays quiet after work, I feel disconnected and push for answers, which makes Jamie withdraw further.'
    }
  },
  {
    id: 'eft-2',
    title: 'Vulnerable Softening',
    framework: 'EFT',
    phase: 2,
    description: 'Step underneath secondary defenses (anger, sarcasm, numbing) to express raw primary attachment fears (grief, loneliness, inadequacy).',
    objective: 'De-escalate mutual blame by presenting a highly vulnerable, undefended version of your experience.',
    status: 'in_progress',
    points: 200,
    exercise: {
      title: 'Vulnerability Framing',
      description: 'Frame a current tension through your primary feelings instead of a blame statement.',
      prompt: 'Underneath my defensive reaction, what vulnerable feeling was actually happening?',
      placeholder: 'E.g., Underneath my irritation, I felt extremely lonely and scared that we were drifting apart.'
    }
  },
  {
    id: 'eft-3',
    title: 'Secure Bonding Enactment',
    framework: 'EFT',
    phase: 3,
    description: 'Reach a point where both partners can safely request comfort and receive immediate emotional responsiveness and secure holding.',
    objective: 'Create long-term secure attachment where both partners are accessible, responsive, and emotionally engaged.',
    status: 'locked',
    points: 300,
    exercise: {
      title: 'Bonds of Solace',
      description: 'Share a tender moment where you successfully co-regulated and felt completely safe.',
      prompt: 'Describe the soothing enactment experience:',
      placeholder: 'E.g., I was able to cry about my childhood stress, and my partner held me without giving logical advice...'
    }
  },

  // PACT
  {
    id: 'pact-1',
    title: 'The Couple Bubble',
    framework: 'PACT',
    phase: 1,
    description: 'Establish absolute safety and security by creating a protective membrane around the relationship.',
    objective: 'Agree that the relationship comes first, protecting each other from outside stressors, family, or work enmeshment.',
    status: 'in_progress',
    points: 180,
    exercise: {
      title: 'Bubble Covenant',
      description: 'Draft one explicit rule to protect your couple bubble from intrusive outside forces (e.g., digital devices, overbearing family).',
      prompt: 'What rule will you both abide by to preserve the bubble?',
      placeholder: 'E.g., No phones in the bedroom after 10:00 PM, and we consult each other first before committing to family plans.'
    }
  },
  {
    id: 'pact-2',
    title: 'Somatic Cue Tracking',
    framework: 'PACT',
    phase: 2,
    description: 'Train your brain to recognize partner\'s micro-expressions, breathing patterns, and posture to detect stress before it escalates.',
    objective: 'Avoid cognitive over-rationalization and leverage physical body/eye signals to guide co-regulation.',
    status: 'locked',
    points: 220,
    exercise: {
      title: 'Physical Cue Log',
      description: 'Note a subtle non-verbal cue you\'ve noticed that signals your partner\'s nervous system is beginning to enter fight/flight.',
      prompt: 'What is your partner\'s somatic tell?',
      placeholder: 'E.g., Jamie\'s shoulders lock upwards and their breathing becomes shallow and quick. That\'s when they are getting flooded.'
    }
  },
  {
    id: 'pact-3',
    title: 'Instant Co-Regulation',
    framework: 'PACT',
    phase: 3,
    description: 'Master the art of rapid somatic de-escalation: using physical touch, eye gaze, and soft voice tone to down-regulate partner\'s distress.',
    objective: 'Act as each other\'s physical medicine, reducing heart rate and blood pressure through direct presence.',
    status: 'locked',
    points: 280,
    exercise: {
      title: 'Co-Regulation Test',
      description: 'Perform a 20-second continuous hug or a 3-minute shared breathing sequence when one partner is stressed.',
      prompt: 'What somatic soothe did you use and what was the outcome?',
      placeholder: 'E.g., Jamie was highly stressed after a meeting; we did a 20-second continuous hug. We both felt our breathing synchronize.'
    }
  },

  // NVC
  {
    id: 'nvc-1',
    title: 'Objective Observation',
    framework: 'NVC',
    phase: 1,
    description: 'Learn to describe triggers using pure clinical facts, completely stripped of moral judgments, generalizations, or evaluations.',
    objective: 'Remove early triggers for defensiveness by separating raw facts from personal interpretations.',
    status: 'completed',
    completedDate: '2026-07-08',
    points: 120,
    exercise: {
      title: 'The Clean Fact Filter',
      description: 'Filter an evaluation statement into a clean observation.',
      prompt: 'Instead of "You are lazy," write a fact-only observation:',
      placeholder: 'E.g., "The kitchen counter has had dishes on it since lunch, and the dishwasher is empty."'
    }
  },
  {
    id: 'nvc-2',
    title: 'Actionable Requests',
    framework: 'NVC',
    phase: 2,
    description: 'Translate vague demands or complaints into clear, positive, actionable requests that your partner can explicitly agree to.',
    objective: 'Provide your partner with a concrete recipe for success, avoiding negative formulations ("stop doing X").',
    status: 'locked',
    points: 180,
    exercise: {
      title: 'Actionable Formulation',
      description: 'Convert a negative complaint into a clear, positive request.',
      prompt: 'Instead of "Stop ignoring me," frame a positive actionable request:',
      placeholder: 'E.g., "Would you be willing to spend 15 minutes talking with me about our day right now without devices?"'
    }
  }
];

export default function RelationshipRoadmap() {
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    // Attempt local storage load or default
    const saved = localStorage.getItem('rehabit_milestones');
    return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
  });

  const [activeTab, setActiveTab] = useState<'roadmap' | 'stats' | 'reflection'>('roadmap');
  const [filterFramework, setFilterFramework] = useState<string>('All');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  
  // Exercise states
  const [exerciseInput, setExerciseInput] = useState('');
  const [exerciseSavedLogs, setExerciseSavedLogs] = useState<Record<string, { answer: string; date: string }>>(() => {
    const saved = localStorage.getItem('rehabit_milestone_exercises');
    return saved ? JSON.parse(saved) : {
      'gottman-1': {
        answer: 'I learned that Jamie feels extremely anxious about the upcoming database migration. The pressure of being primary on-call is making them lose sleep.',
        date: '2026-07-01'
      },
      'eft-1': {
        answer: 'We mapped our cycle. When Jamie becomes quiet to destress, I feel abandoned and push for answers, which makes Jamie withdraw further into isolation.',
        date: '2026-07-05'
      },
      'nvc-1': {
        answer: 'Fact filter: Instead of saying "You are neglecting our budget," I said: "We have not reviewed the credit card statements together this month, and we have spent $400 over the buffer limit."',
        date: '2026-07-08'
      }
    };
  });

  const saveMilestonesState = (newMilestones: Milestone[]) => {
    setMilestones(newMilestones);
    localStorage.setItem('rehabit_milestones', JSON.stringify(newMilestones));
  };

  const handleStatusChange = (id: string, newStatus: 'locked' | 'in_progress' | 'completed') => {
    const updated = milestones.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: newStatus,
          completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return m;
    });
    saveMilestonesState(updated);
  };

  const handleSaveExercise = (milestoneId: string) => {
    if (!exerciseInput.trim()) return;
    const newLogs = {
      ...exerciseSavedLogs,
      [milestoneId]: {
        answer: exerciseInput.trim(),
        date: new Date().toISOString().split('T')[0]
      }
    };
    setExerciseSavedLogs(newLogs);
    localStorage.setItem('rehabit_milestone_exercises', JSON.stringify(newLogs));

    // Auto promote to completed if saved exercise
    const updatedMilestones = milestones.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m,
          status: 'completed' as const,
          completedDate: new Date().toISOString().split('T')[0]
        };
      }
      return m;
    });
    saveMilestonesState(updatedMilestones);
    setExerciseInput('');
  };

  // Calculations
  const totalMilestones = milestones.length;
  const completedCount = milestones.filter(m => m.status === 'completed').count ?? milestones.filter(m => m.status === 'completed').length;
  const inProgressCount = milestones.filter(m => m.status === 'in_progress').length;
  
  const totalPoints = milestones.reduce((sum, m) => sum + (m.status === 'completed' ? m.points : 0), 0);
  const potentialPoints = milestones.reduce((sum, m) => sum + m.points, 0);
  const progressPercent = Math.round((completedCount / totalMilestones) * 100);

  const filteredMilestones = milestones.filter(m => {
    if (filterFramework === 'All') return true;
    return m.framework.toLowerCase() === filterFramework.toLowerCase();
  });

  const activeMilestone = milestones.find(m => m.id === selectedMilestoneId);

  // Secure bond level formula
  const secureBondRating = Math.min(100, Math.round((completedCount * 8.5) + 40));

  return (
    <div className="flex flex-col gap-4 text-[#4B4B4B] animate-fade-in">
      
      {/* Top Progress bar and summary widget */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-5 rounded-[2.2rem] shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#FF6EA7]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute left-1/4 bottom-0 w-24 h-24 bg-[#1CB0F6]/10 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#FF6EA7]">Interactive Relational Journey</span>
            <h4 className="font-display font-black text-base text-white leading-tight mt-0.5">Relationship Roadmap</h4>
            <p className="text-[10px] text-stone-300 font-sans mt-1 leading-relaxed max-w-[280px]">
              Visualize milestones, test clinical boundaries, and complete "do the work" exercises between sessions.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-stone-400">SECURE BOND LEVEL</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-[#58CC02]">{secureBondRating}%</span>
              <span className="text-[9px] text-stone-300">Secure</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[9px] font-mono text-stone-300">
            <span>Overall Roadmap Progress</span>
            <span>{completedCount}/{totalMilestones} Milestones ({progressPercent}%)</span>
          </div>
          <div className="w-full h-3 bg-stone-700/60 rounded-full overflow-hidden p-0.5 border border-stone-600/30">
            <div 
              className="h-full bg-gradient-to-r from-[#FF6EA7] via-[#CE9FFC] to-[#1CB0F6] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Core milestones summary widgets */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-stone-400">COMPLETED</span>
            <span className="text-xs font-black text-white">{completedCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-stone-400">IN PROGRESS</span>
            <span className="text-xs font-black text-[#CE9FFC]">{inProgressCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-stone-400">RECOVERY SCORE</span>
            <span className="text-xs font-black text-[#58CC02]">{totalPoints} <span className="text-[8px] text-stone-400">pts</span></span>
          </div>
        </div>
      </div>

      {/* Internal Navigation tabs */}
      <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex-1 text-center py-2 text-[10.5px] font-black uppercase tracking-wider rounded-xl transition ${
            activeTab === 'roadmap' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          🗺️ Milestones
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 text-center py-2 text-[10.5px] font-black uppercase tracking-wider rounded-xl transition ${
            activeTab === 'stats' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          📊 Framework Progress
        </button>
        <button
          onClick={() => setActiveTab('reflection')}
          className={`flex-1 text-center py-2 text-[10.5px] font-black uppercase tracking-wider rounded-xl transition ${
            activeTab === 'reflection' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          📝 Workout Reflection Log
        </button>
      </div>

      {/* --- TAB CONTENT: ROADMAP --- */}
      {activeTab === 'roadmap' && (
        <div className="flex flex-col gap-4">
          
          {/* Framework filter chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[9px] font-bold uppercase text-stone-400 mr-1">Filter:</span>
            {['All', 'Gottman', 'EFT', 'PACT', 'NVC'].map((fw) => (
              <button
                key={fw}
                onClick={() => setFilterFramework(fw)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                  filterFramework === fw 
                    ? 'bg-stone-900 text-white border-stone-900' 
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Milestones timeline path list */}
            <div className="md:col-span-7 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredMilestones.map((milestone, idx) => {
                const isSelected = selectedMilestoneId === milestone.id;
                const statusColor = 
                  milestone.status === 'completed' ? 'border-[#58CC02] bg-[#58CC02]/5' : 
                  milestone.status === 'in_progress' ? 'border-[#CE9FFC] bg-[#CE9FFC]/5 animate-pulse' : 
                  'border-stone-200 bg-stone-50/50 opacity-70';
                
                const badgeColor = 
                  milestone.framework === 'Gottman' ? 'bg-[#58CC02]/10 text-[#58CC02] border-[#58CC02]/20' :
                  milestone.framework === 'EFT' ? 'bg-[#1CB0F6]/10 text-[#1CB0F6] border-[#1CB0F6]/20' :
                  milestone.framework === 'PACT' ? 'bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/20' :
                  'bg-[#FF6EA7]/10 text-[#FF6EA7] border-[#FF6EA7]/20';

                return (
                  <div key={milestone.id} className="relative flex gap-3 items-start">
                    {/* Visual Connection line */}
                    {idx < filteredMilestones.length - 1 && (
                      <div className="absolute left-[13px] top-7 bottom-0 w-[2px] bg-stone-200 pointer-events-none"></div>
                    )}

                    {/* Progress milestone circle badge */}
                    <button 
                      onClick={() => handleStatusChange(
                        milestone.id, 
                        milestone.status === 'locked' ? 'in_progress' : 
                        milestone.status === 'in_progress' ? 'completed' : 'locked'
                      )}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 z-10 font-bold text-xs transition cursor-pointer hover:scale-110 ${
                        milestone.status === 'completed' ? 'bg-[#58CC02] border-[#58CC02] text-white' :
                        milestone.status === 'in_progress' ? 'bg-white border-[#CE9FFC] text-[#CE9FFC]' :
                        'bg-white border-stone-300 text-stone-400'
                      }`}
                      title="Click to toggle status between Locked -> In Progress -> Completed"
                    >
                      {milestone.status === 'completed' ? <CheckCircle2 size={14} /> : milestone.phase}
                    </button>

                    {/* Milestone Info Card */}
                    <button
                      onClick={() => {
                        setSelectedMilestoneId(milestone.id);
                        if (exerciseSavedLogs[milestone.id]) {
                          setExerciseInput(exerciseSavedLogs[milestone.id].answer);
                        } else {
                          setExerciseInput('');
                        }
                      }}
                      className={`flex-1 text-left p-3.5 rounded-2xl border-2 transition flex justify-between items-start ${
                        isSelected ? 'border-stone-900 bg-white shadow-md' : 'border-outline-variant bg-white hover:border-stone-300 shadow-sm'
                      }`}
                    >
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-display font-black text-xs text-stone-800 leading-tight">
                            {milestone.title}
                          </span>
                          <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded border ${badgeColor}`}>
                            {milestone.framework}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1 leading-relaxed font-sans line-clamp-2">
                          {milestone.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2.5 text-[8.5px] font-mono text-stone-400">
                          <span className="flex items-center gap-1">
                            <Sparkles size={9} className="text-[#FF6EA7]" /> {milestone.points} PTS
                          </span>
                          {milestone.status === 'completed' && (
                            <span className="text-[#58CC02] flex items-center gap-1 font-bold">
                              ✓ Completed {milestone.completedDate ? `(${milestone.completedDate})` : ''}
                            </span>
                          )}
                          {milestone.status === 'in_progress' && (
                            <span className="text-[#CE9FFC] flex items-center gap-1 font-bold animate-pulse">
                              ● ACTIVE TARGET
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={14} className={`text-stone-300 transition ${isSelected ? 'translate-x-1 text-stone-700' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Detailed Milestone Workout Pane */}
            <div className="md:col-span-5">
              {activeMilestone ? (
                <div className="bg-surface-container-lowest p-5 rounded-[2rem] border-2 border-outline-variant shadow-sm flex flex-col gap-4 animate-fade-in">
                  
                  {/* Detailed Title */}
                  <div className="border-b border-outline-variant pb-3">
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#FF6EA7]">{activeMilestone.framework} Suite Phase {activeMilestone.phase}</span>
                    <h5 className="font-display font-black text-sm text-stone-800 leading-tight mt-0.5">{activeMilestone.title}</h5>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-[8.5px] px-2 py-0.5 rounded-full font-bold border ${
                        activeMilestone.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' :
                        activeMilestone.status === 'in_progress' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                        'bg-stone-50 border-stone-200 text-stone-500'
                      }`}>
                        {activeMilestone.status === 'completed' ? 'Completed' : 
                         activeMilestone.status === 'in_progress' ? 'Active Focus' : 'Locked'}
                      </span>
                      <span className="text-[9px] font-mono text-stone-400">{activeMilestone.points} Points Available</span>
                    </div>
                  </div>

                  {/* Core Clinical Target */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8.5px] font-black uppercase tracking-wider text-stone-400">Clinical Objective</span>
                    <p className="text-[10.5px] text-stone-600 leading-relaxed font-sans">{activeMilestone.objective}</p>
                  </div>

                  {/* Practice Exercise ("Do the Work" Action Step) */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/60 flex flex-col gap-2.5">
                    <div className="flex items-center gap-1">
                      <span className="p-1 rounded bg-[#FF6EA7]/10 text-[#FF6EA7]">
                        <Activity size={12} />
                      </span>
                      <span className="font-display font-black text-[11px] text-stone-700">{activeMilestone.exercise.title}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-relaxed font-sans">
                      {activeMilestone.exercise.description}
                    </p>

                    <div className="flex flex-col gap-1 mt-1.5">
                      <label className="text-[8.5px] font-black uppercase text-stone-400">{activeMilestone.exercise.prompt}</label>
                      <textarea
                        value={exerciseInput}
                        onChange={(e) => setExerciseInput(e.target.value)}
                        placeholder={activeMilestone.exercise.placeholder}
                        rows={4}
                        className="bg-white border border-stone-200 text-[10.5px] rounded-lg p-2 font-sans placeholder-stone-400 text-stone-700 focus:outline-none focus:border-stone-400 leading-relaxed"
                      />
                    </div>

                    <button
                      onClick={() => handleSaveExercise(activeMilestone.id)}
                      className="bg-stone-950 text-white text-[9.5px] font-black uppercase tracking-widest py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 border-b-[3px] border-stone-800 transition hover:scale-[1.01]"
                    >
                      <Save size={11} /> Save Exercise & Complete Milestone
                    </button>
                  </div>

                  {/* Status Toggle control */}
                  <div className="flex justify-between items-center bg-stone-50/50 p-2.5 rounded-xl border border-stone-200/40 text-[10px]">
                    <span className="font-bold text-stone-500">Update Milestone Status:</span>
                    <div className="flex gap-1">
                      {['locked', 'in_progress', 'completed'].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(activeMilestone.id, st as any)}
                          className={`px-2 py-1 rounded text-[8.5px] font-bold uppercase ${
                            activeMilestone.status === st 
                              ? 'bg-stone-900 text-white font-black' 
                              : 'bg-white hover:bg-stone-100 border border-stone-200 text-stone-500'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-surface-container-lowest p-8 rounded-[2rem] border-2 border-outline-variant shadow-sm flex flex-col items-center justify-center text-center gap-3 text-stone-400 min-h-[300px]">
                  <Compass size={36} className="text-stone-300" />
                  <div>
                    <h5 className="font-display font-black text-xs text-stone-600 uppercase tracking-wider">Milestone Exercise Desk</h5>
                    <p className="text-[10px] leading-relaxed max-w-[200px] mt-1">
                      Select any milestone on the left to reveal the Clinical Objective, custom exercises, and to submit reflection logs.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- TAB CONTENT: STATS --- */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {/* Detailed analysis of progress by framework */}
          {['Gottman', 'EFT', 'PACT', 'NVC'].map((framework) => {
            const fwMilestones = milestones.filter(m => m.framework === framework);
            const total = fwMilestones.length;
            const completed = fwMilestones.filter(m => m.status === 'completed').length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            let colorTheme = '';
            let textTheme = '';
            let icon = '';
            let summaryDesc = '';
            if (framework === 'Gottman') {
              colorTheme = 'bg-[#58CC02]/10 text-[#58CC02] border-[#58CC02]/20';
              textTheme = 'text-[#58CC02]';
              icon = '❤️';
              summaryDesc = 'Ratios of repair, soft start-ups, and building high-detail Love Maps.';
            } else if (framework === 'EFT') {
              colorTheme = 'bg-[#1CB0F6]/10 text-[#1CB0F6] border-[#1CB0F6]/20';
              textTheme = 'text-[#1CB0F6]';
              icon = '🤝';
              summaryDesc = 'Attachment security, cycle de-escalation, and vulnerable primary feelings.';
            } else if (framework === 'PACT') {
              colorTheme = 'bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/20';
              textTheme = 'text-[#FF8A00]';
              icon = '🧠';
              summaryDesc = 'The Couple Bubble protection, somatic tracking, and quick co-regulation.';
            } else {
              colorTheme = 'bg-[#FF6EA7]/10 text-[#FF6EA7] border-[#FF6EA7]/20';
              textTheme = 'text-[#FF6EA7]';
              icon = '🗣️';
              summaryDesc = 'Objective observations, needs translation, and positive requests.';
            }

            return (
              <div key={framework} className="bg-surface-container-lowest p-4.5 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{icon}</span>
                      <h5 className="font-display font-black text-xs text-stone-800 uppercase tracking-wider">{framework} Progress</h5>
                    </div>
                    <span className={`text-[8.5px] font-mono font-black uppercase px-2 py-0.5 rounded border ${colorTheme}`}>
                      {completed}/{total} Done
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-normal mb-3 font-sans">
                    {summaryDesc}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[9px] font-mono text-stone-400">
                    <span>Alignment level:</span>
                    <span className={`font-bold ${textTheme}`}>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
                    <div 
                      className={`h-full bg-stone-900 rounded-full transition-all duration-700 ease-out`}
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: framework === 'Gottman' ? '#58CC02' : framework === 'EFT' ? '#1CB0F6' : framework === 'PACT' ? '#FF8A00' : '#FF6EA7'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Secure functioning summary card */}
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-5 rounded-[2rem] flex items-start gap-4">
            <span className="p-2.5 rounded-2xl bg-indigo-500 text-white text-xl">🏆</span>
            <div className="flex-1">
              <span className="text-[8.5px] font-black uppercase tracking-wider text-indigo-700">CLINICAL STABILITY AUDIT</span>
              <h5 className="font-display font-black text-xs text-stone-800 uppercase tracking-tight mt-0.5">Secure Relationship Index</h5>
              <p className="text-[10.5px] text-stone-600 leading-relaxed font-sans mt-1">
                Your secure relationship index is compiled at <strong className="text-indigo-800">{secureBondRating}%</strong>. Based on your completed milestones, you have successfully stabilized your defensive cycle awareness (EFT-1) and objective observation channels (NVC-1). 
              </p>
              <div className="mt-2.5 text-[9px] bg-white p-2.5 rounded-xl border border-indigo-100/60 text-indigo-900/80 font-mono flex items-center gap-1.5">
                <AlertCircle size={10} className="text-indigo-600 shrink-0" />
                <span>Next active target: practice **Shielding the 4 Horsemen (Gottman Phase 2)** to de-escalate blame.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: REFLECTIONS --- */}
      {activeTab === 'reflection' && (
        <div className="bg-surface-container-lowest p-5 rounded-[2.2rem] border-2 border-outline-variant shadow-sm flex flex-col gap-4 animate-fade-in">
          <div className="border-b border-outline-variant/60 pb-2.5 flex justify-between items-center">
            <div>
              <span className="text-[8.5px] font-black uppercase tracking-widest text-[#FF6EA7]">Evidence-Based Logbook</span>
              <h5 className="font-display font-black text-sm text-stone-800 leading-tight">Interactive Exercise Submissions</h5>
            </div>
            <span className="text-[8px] bg-stone-100 text-stone-500 font-mono px-2 py-0.5 rounded-full uppercase">
              {Object.keys(exerciseSavedLogs).length} Saved Reflexes
            </span>
          </div>

          <div className="flex flex-col gap-3.5 max-h-[400px] overflow-y-auto pr-1">
            {milestones.filter(m => exerciseSavedLogs[m.id]).map((milestone) => {
              const log = exerciseSavedLogs[milestone.id];
              const badgeColor = 
                milestone.framework === 'Gottman' ? 'bg-[#58CC02]/10 text-[#58CC02] border-[#58CC02]/20' :
                milestone.framework === 'EFT' ? 'bg-[#1CB0F6]/10 text-[#1CB0F6] border-[#1CB0F6]/20' :
                milestone.framework === 'PACT' ? 'bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/20' :
                'bg-[#FF6EA7]/10 text-[#FF6EA7] border-[#FF6EA7]/20';

              return (
                <div key={milestone.id} className="p-3.5 rounded-2xl border border-stone-200/70 bg-stone-50/50 flex flex-col gap-2 text-[10.5px]">
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-display font-black text-stone-800 leading-none">
                        {milestone.title} Exercise
                      </span>
                      <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded border ${badgeColor}`}>
                        {milestone.framework}
                      </span>
                    </div>
                    <span className="text-[8.5px] font-mono text-stone-400 flex items-center gap-1">
                      <Calendar size={10} /> Saved {log.date}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-stone-200/40 text-[10px] leading-relaxed text-stone-700 italic font-serif">
                    "{log.answer}"
                  </div>

                  <div className="flex justify-between items-center text-[8.5px] font-mono text-stone-400">
                    <span>Exercise: {milestone.exercise.title}</span>
                    <button
                      onClick={() => {
                        setSelectedMilestoneId(milestone.id);
                        setExerciseInput(log.answer);
                        setActiveTab('roadmap');
                      }}
                      className="text-[#FF6EA7] hover:underline font-bold"
                    >
                      Edit Submission
                    </button>
                  </div>
                </div>
              );
            })}

            {milestones.filter(m => exerciseSavedLogs[m.id]).length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-10 text-stone-400">
                <Smile size={32} className="text-stone-300 mb-2" />
                <h5 className="font-display font-black text-xs text-stone-600 uppercase tracking-wider">No Submissions Yet</h5>
                <p className="text-[10px] leading-relaxed max-w-[180px] mt-1">
                  Start exercises in the roadmap milestones, write your thoughts, and save them to build your reflection library!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
