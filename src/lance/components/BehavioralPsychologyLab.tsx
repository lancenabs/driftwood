import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, Shuffle, Sliders, Play, Plus, Trash2, BookOpen, Clock, 
  HelpCircle, Compass, Smile, Flame, ShieldAlert, Award, Star, Activity, Sparkles, Check
} from 'lucide-react';

interface BehaviourPlan {
  id: string;
  name: string;
  positiveReinforcement: string;
  negativeReinforcement: string;
  positivePunishment: string;
  negativePunishment: string;
  schedule: 'FR' | 'VR' | 'FI' | 'VI';
  scheduleValue: number;
  recordedTrials: number;
}

interface StageConflict {
  id: string;
  title: string;
  stageIndex: number; // 0 to 7 (Stage 1 to 8)
  conflictDescription: string;
  tensionLevel: number; // 0-100
  stagnationScale: number; // 0-100
  virtueAlignment: number; // 0-100
  resolvedDate: string;
  virtualSynthesis: string;
  targetVirtue: string;
}

const ERIKSON_STAGES = [
  {
    number: 1,
    name: "Trust vs. Mistrust",
    years: "0 – 1.5 yrs (Infancy)",
    existentialQuestion: "Can I trust the world around me?",
    virtue: "Hope",
    description: "Developing safe dependence. Success fosters belief that relationships are safe and reliable.",
    stagnationDanger: "Chronic insecurity, deep relational withdrawal, paranoia, and existential mistrust.",
    pathway: "Consistent, predictable physical care. Re-programming this stage requires practicing vulnerable asking and receiving in secure adult spaces."
  },
  {
    number: 2,
    name: "Autonomy vs. Shame & Doubt",
    years: "1.5 – 3 yrs (Early Childhood)",
    existentialQuestion: "Is it okay to be independent?",
    virtue: "Will",
    description: "Forming muscular control, boundary setting, and personal will. Over-criticism leads to self-doubt.",
    stagnationDanger: "Overwhelming self-reproach, obsessive low self-esteem, fear of taking any independent action.",
    pathway: "Developing healthy physical assertion and boundaries. Log achievements of active personal choices without guilt."
  },
  {
    number: 3,
    name: "Initiative vs. Guilt",
    years: "3 – 5 yrs (Preschool)",
    existentialQuestion: "Is it okay for me to act, move, and plan?",
    virtue: "Purpose",
    description: "Asserting power and leadership through imaginative play and proactive creation, rather than passive safety.",
    stagnationDanger: "Paralyzing social guilt, severe moral perfectionism, stagnation, and passive dependency.",
    pathway: "Designing creative, values-driven initiatives with deliberate positive reinforcers. Re-asserting play and unstructured arts."
  },
  {
    number: 4,
    name: "Industry vs. Inferiority",
    years: "5 – 12 yrs (School Age)",
    existentialQuestion: "Can I make it in the world of skills and things?",
    virtue: "Competence",
    description: "Sustaining efforts to master complex social and academic challenges, building pride and confidence.",
    stagnationDanger: "Perceiving oneself as structurally inadequate compared to peers; giving up on mastery.",
    pathway: "Tracking structured progress in a concrete skill. Applying variable ratio reinforcers on effort milestones rather than raw outcomes."
  },
  {
    number: 5,
    name: "Identity vs. Role Confusion",
    years: "12 – 18 yrs (Adolescence)",
    existentialQuestion: "Who am I and what can I be?",
    virtue: "Fidelity",
    description: "Establishing unique occupational and ideological selfhood separate from parents and peer expectations.",
    stagnationDanger: "Fragmented identity, constant chameleonic people-pleasing, drifting aimlessly without core values.",
    pathway: "Clarifying personal political, relational, and vocational core values. Committing to self-definition despite social barriers."
  },
  {
    number: 6,
    name: "Intimacy vs. Isolation",
    years: "18 – 40 yrs (Young Adulthood)",
    existentialQuestion: "Can I love and be loved deeply?",
    virtue: "Love",
    description: "Fusing identity with friends/partners without losing selfhood. Requires self-disclosure and emotional integration.",
    stagnationDanger: "Severe loneliness, keeping relationships strictly superficial, defensive self-reliance, and avoidance.",
    pathway: "Practicing deliberate mutual somatic sharing, scheduling relational check-ins, and managing social battery coordinates."
  },
  {
    number: 7,
    name: "Middle Adulthood: Generativity vs. Stagnation",
    years: "40 – 65 yrs (Adulthood)",
    existentialQuestion: "Can I make my life, work, and efforts count?",
    virtue: "Care",
    description: "Nurturing the next generation, mentoring, creating legacy work, and contributing to the global community.",
    stagnationDanger: "Existential stagnation, self-absorption, feeling completely useless, and repetitive routine voids.",
    pathway: "Engaging in altruistic pursuits, transferring functional knowledge, and designing legacy spaces for collaborative sharing."
  },
  {
    number: 8,
    name: "Maturity: Ego Integrity vs. Despair",
    years: "65+ yrs (Late Adulthood)",
    existentialQuestion: "Is it okay to have been me?",
    virtue: "Wisdom",
    description: "Reflecting on life’s full panorama with acceptance, integrating triumphs along with heavy losses.",
    stagnationDanger: "Severe bitterness, terror of death, and overwhelming regret for skipped possibilities.",
    pathway: "Subcortical review of memories, expressive art logs to weave scattered historical pieces into a beautiful, coherent lifework."
  }
];

export default function BehavioralPsychologyLab() {
  const [activeSegment, setActiveSegment] = useState<'conditioning' | 'erikson'>('conditioning');

  // --- Segment 1: Conditioning states ---
  const [behaviorPlans, setBehaviorPlans] = useState<BehaviourPlan[]>(() => {
    const saved = localStorage.getItem('psych_behavior_plans');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'plan-1',
        name: 'Initiating Morning Cardiovascular Routine',
        positiveReinforcement: 'Enjoy a premium warm matcha latte and earn 5 habit garden nutrients immediately after completion.',
        negativeReinforcement: 'Muting the persistent warning sound of the morning calendar alarm clock.',
        positivePunishment: 'Write a detailed 3-line cognitive analysis of the delay excuses, increasing physical friction.',
        negativePunishment: 'Revoking 25 minutes of bedtime entertainment/newsfeed scrolling that same evening.',
        schedule: 'VR',
        scheduleValue: 3,
        recordedTrials: 8
      },
      {
        id: 'plan-2',
        name: 'Extinguishing Impulsive Shopping & Screen Cravings',
        positiveReinforcement: 'Redistribute the unspent money into the "Leisure & Travel" high-yield savings category monthly.',
        negativeReinforcement: 'Immediate removal of high-pressure social promotional emails from the inbox.',
        positivePunishment: 'Enforcing a strict 72-hour delay queue before checking out any dynamic retail item.',
        negativePunishment: 'Pausing the primary audio music player during periods of unaligned shopping distraction.',
        schedule: 'FR',
        scheduleValue: 1,
        recordedTrials: 2
      }
    ];
  });

  const [activePlanId, setActivePlanId] = useState<string>('plan-1');
  const [newPlanName, setNewPlanName] = useState('');
  const [newPositiveRe, setNewPositiveRe] = useState('');
  const [newNegativeRe, setNewNegativeRe] = useState('');
  const [newPositivePun, setNewPositivePun] = useState('');
  const [newNegativePun, setNewNegativePun] = useState('');
  const [newSchedule, setNewSchedule] = useState<'FR' | 'VR' | 'FI' | 'VI'>('VR');
  const [newScheduleValue, setNewScheduleValue] = useState<number>(3);

  // Synapse Simulation States
  const [synapticDensity, setSynapticDensity] = useState<number>(45); // 0-100
  const [myelinThickness, setMyelinThickness] = useState<number>(0.12); // in micrometers
  const [extinctionResistance, setExtinctionResistance] = useState<number>(65); // 0-100
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [trialLogs, setTrialLogs] = useState<string[]>([
    "Initial neural trace established.",
    "First habit loop mapped inside prefrontal cortex."
  ]);
  const [simulationStage, setSimulationStage] = useState<'idle' | 'cue' | 'craving' | 'response' | 'reward'>('idle');

  // --- Segment 2: Erikson states ---
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(4); // Stage 5 default
  const [conflictInput, setConflictInput] = useState<string>('');
  const [tensionLevel, setTensionLevel] = useState<number>(60);
  const [stagnationScale, setStagnationScale] = useState<number>(45);
  const [virtueAlignment, setVirtueAlignment] = useState<number>(40);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [savedConflicts, setSavedConflicts] = useState<StageConflict[]>(() => {
    const saved = localStorage.getItem('psych_stage_conflicts');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'con-1',
        title: 'Career Shift Uncertainty',
        stageIndex: 4, // Identity vs Role Confusion
        conflictDescription: 'Transitioning from finance into medical psych. Struggling with a sense of lost identity and peer comparison.',
        tensionLevel: 75,
        stagnationScale: 60,
        virtueAlignment: 55,
        resolvedDate: '2026-06-15',
        virtualSynthesis: 'Acknowledged the transition from external status (Persona) to intrinsic clinical competence. Integrated peer judgment by evaluating current action against a value structure rather than approval.',
        targetVirtue: 'Fidelity'
      },
      {
        id: 'con-2',
        title: 'Re-establishing Vulnerable Sharing',
        stageIndex: 5, // Intimacy vs Isolation
        conflictDescription: 'Hesitant to share clinical burnout with my relational partner due to a fear of feeling dependent or weak.',
        tensionLevel: 50,
        stagnationScale: 30,
        virtueAlignment: 75,
        resolvedDate: '2026-06-10',
        virtualSynthesis: 'Successfully triggered vulnerability. Found that somatic safety improves partnership co-regulation. Leveraged explicit communication regarding rest needs to avoid withdrawing.',
        targetVirtue: 'Love'
      }
    ];
  });

  // Safe Web Audio API play feedback
  const playBeep = (freq: number, type: 'sine' | 'triangle' | 'sawtooth' | 'square', duration: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Simulated audio feedback failed:', e);
    }
  };

  const savePlans = (updated: BehaviourPlan[]) => {
    setBehaviorPlans(updated);
    localStorage.setItem('psych_behavior_plans', JSON.stringify(updated));
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName) return;
    const plan: BehaviourPlan = {
      id: `plan-${Date.now()}`,
      name: newPlanName,
      positiveReinforcement: newPositiveRe || 'Acknowledge completion with positive self-regard.',
      negativeReinforcement: newNegativeRe || 'None configured.',
      positivePunishment: newPositivePun || 'None configured.',
      negativePunishment: newNegativePun || 'None configured.',
      schedule: newSchedule,
      scheduleValue: newScheduleValue,
      recordedTrials: 0
    };
    const updated = [...behaviorPlans, plan];
    savePlans(updated);
    setActivePlanId(plan.id);
    
    // reset inputs
    setNewPlanName('');
    setNewPositiveRe('');
    setNewNegativeRe('');
    setNewPositivePun('');
    setNewNegativePun('');
    playBeep(650, 'sine', 0.15);
  };

  const handleDeletePlan = (id: string) => {
    const updated = behaviorPlans.filter(p => p.id !== id);
    savePlans(updated);
    if (activePlanId === id && updated.length > 0) {
      setActivePlanId(updated[0].id);
    }
    playBeep(300, 'sawtooth', 0.1);
  };

  // Run a full behavioral conditioning training trial
  const triggerTrainingTrial = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStage('cue');
    playBeep(440, 'triangle', 0.15);
    
    const activePlan = behaviorPlans.find(p => p.id === activePlanId);
    if (!activePlan) return;

    // Progression loop
    setTimeout(() => {
      setSimulationStage('craving');
      playBeep(520, 'triangle', 0.15);
      
      setTimeout(() => {
        setSimulationStage('response');
        playBeep(580, 'sine', 0.12);
        
        setTimeout(() => {
          setSimulationStage('reward');
          
          // Compute learning impact based on reinforcement variables
          // Schedules:
          // Fixed ratio reinforces on step. Constant gains.
          // Variable ratio triggers random larger updates - simulates intermittent reward! High extinction resistance.
          const isVariable = activePlan.schedule === 'VR' || activePlan.schedule === 'VI';
          const randBonus = isVariable ? Math.floor(Math.random() * 8) + 4 : 4;
          
          let densityGain = isVariable ? randBonus : 5;
          let resistanceGain = isVariable ? 8 : 2; // Variable schedules provide highest extinction resistance!
          let myelinGain = isVariable ? 0.02 : 0.01;

          setSynapticDensity(prev => Math.min(100, prev + densityGain));
          setMyelinThickness(prev => parseFloat(Math.min(1.5, prev + myelinGain).toFixed(3)));
          setExtinctionResistance(prev => Math.min(100, prev + resistanceGain));

          // Increment recorded trials
          const planUpdated = behaviorPlans.map(p => {
            if (p.id === activePlanId) {
              return { ...p, recordedTrials: p.recordedTrials + 1 };
            }
            return p;
          });
          savePlans(planUpdated);

          // Audio output celebration!
          playBeep(580, 'sine', 0.1);
          setTimeout(() => playBeep(880, 'sine', 0.25), 100);

          let scheduleDesc = '';
          if (activePlan.schedule === 'VR') scheduleDesc = `Variable Ratio [1:${activePlan.scheduleValue}] average reinforcement. Strong neural dopamine burst!`;
          else if (activePlan.schedule === 'FR') scheduleDesc = `Fixed Ratio [1:${activePlan.scheduleValue}] precise reinforcement. High immediate repetition pace.`;
          else if (activePlan.schedule === 'FI') scheduleDesc = `Fixed Interval [${activePlan.scheduleValue} days/hr] scheduled safety limit reinforcement.`;
          else if (activePlan.schedule === 'VI') scheduleDesc = `Variable Interval predictable average intervals. Steady, robust rate of target retention.`;

          const explanation = `Trial #${activePlan.recordedTrials + 1} completed under ${scheduleDesc}. Synaptic density rose by +${densityGain}%, extinction resistance +${resistanceGain}%!`;
          setTrialLogs(prev => [explanation, ...prev]);

          setTimeout(() => {
            setSimulationStage('idle');
            setIsSimulating(false);
          }, 600);

        }, 1000);
      }, 1000);
    }, 1000);
  };

  const resetNeuralTracing = () => {
    setSynapticDensity(20);
    setMyelinThickness(0.04);
    setExtinctionResistance(25);
    setTrialLogs(["Neural pathways reset to baseline thresholds. Exciting operant repetitions to initiate synaptogenesis."]);
    playBeep(200, 'sawtooth', 0.3);
  };

  // --- Segment 2: Erikson Synthesis mechanics ---
  const handleSynthesizeConflict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conflictInput || isSynthesizing) return;
    
    setIsSynthesizing(true);
    playBeep(550, 'sine', 0.15);
    setTimeout(() => {
      playBeep(660, 'sine', 0.12);
      setTimeout(() => playBeep(880, 'sine', 0.2), 120);
    }, 150);

    // Synthesis generation based on Erikson stage guidelines
    const stage = ERIKSON_STAGES[selectedStageIndex];
    
    setTimeout(() => {
      // Create high-level behavioral synthesis
      const words = conflictInput.trim();
      const firstPart = `Resolved current conflict utilizing Eriksonian "${stage.virtue}" Framework. `;
      const coreInstruction = `1. Mitigate immediate psychosocial tension (${tensionLevel}%) by setting an operant routine. ` +
        `2. Build competence towards the existential query ("${stage.existentialQuestion}"). ` +
        `3. Execute conscious behavior mapping: focus actively on the clinical pathway to avoid ${stagnationScale}% danger of role stagnation.`;
      
      const synthesisResult = `${firstPart}${coreInstruction}`;

      const newConflict: StageConflict = {
        id: `con-${Date.now()}`,
        title: words.substring(0, 30) + (words.length > 30 ? '...' : ''),
        stageIndex: selectedStageIndex,
        conflictDescription: conflictInput,
        tensionLevel,
        stagnationScale,
        virtueAlignment,
        resolvedDate: new Date().toISOString().split('T')[0],
        virtualSynthesis: synthesisResult,
        targetVirtue: stage.virtue
      };

      const revisedConflicts = [newConflict, ...savedConflicts];
      setSavedConflicts(revisedConflicts);
      localStorage.setItem('psych_stage_conflicts', JSON.stringify(revisedConflicts));
      
      // reset input only
      setConflictInput('');
      setIsSynthesizing(false);
    }, 2800);
  };

  const handleDeleteConflict = (id: string) => {
    const updated = savedConflicts.filter(c => c.id !== id);
    setSavedConflicts(updated);
    localStorage.setItem('psych_stage_conflicts', JSON.stringify(updated));
    playBeep(290, 'sawtooth', 0.08);
  };

  const activePlan = behaviorPlans.find(p => p.id === activePlanId) || behaviorPlans[0];

  return (
    <div id="behavioral-psychology-lab-root" className="bg-[#f8fafc] text-slate-800 p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-xl space-y-6 select-none max-w-4xl mx-auto">
      
      {/* Sleek App Header with Gradient Accent */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
            <Brain className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div className="text-left">
            <h2 className="font-display text-lg font-black text-slate-900 tracking-tight">Clinical Behavioral &amp; Developmental Lab</h2>
            <p className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wide">
              Neuroplastic Conditioning, Operant Schedules, &amp; Erikson’s 8 Crisis Stages
            </p>
          </div>
        </div>

        {/* Workspace Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 self-start sm:self-center">
          <button
            type="button"
            onClick={() => {
              setActiveSegment('conditioning');
              playBeep(520, 'sine', 0.08);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              activeSegment === 'conditioning'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/20'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Conditioning &amp; Neuroplasticity</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSegment('erikson');
              playBeep(520, 'sine', 0.08);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              activeSegment === 'erikson'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/20'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Erikson Development Stages</span>
          </button>
        </div>
      </div>

      {activeSegment === 'conditioning' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 5 COLUMNS: Behavioral Setup & Plan Editor */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Active Plan Selector */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-3xs text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Select Target Habit Plan</label>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto mb-3 pr-1">
                {behaviorPlans.map((plan) => (
                  // div[role=button] host: a real <button> cannot contain the delete <button> (invalid HTML)
                  <div
                    key={plan.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setActivePlanId(plan.id);
                      playBeep(480, 'sine', 0.08);
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActivePlanId(plan.id); playBeep(480, 'sine', 0.08); } }}
                    className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                      activePlanId === plan.id
                        ? 'border-indigo-200 bg-indigo-50/50 text-indigo-900 font-bold'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs truncate leading-snug">{plan.name}</p>
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 block mt-0.5 font-semibold">
                        Schedule: {plan.schedule} (1:{plan.scheduleValue}) • {plan.recordedTrials} trials logged
                      </span>
                    </div>
                    {behaviorPlans.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(plan.id);
                        }}
                        aria-label={`Delete plan ${plan.name}`}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Operant Conditioning Form Builder */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs text-left">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <Plus className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Create New Operant Protocol</h3>
              </div>

              <form onSubmit={handleAddPlan} className="space-y-3.5">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Target Behavior Description</label>
                  <input
                    type="text"
                    required
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    placeholder="e.g., Establishing 15 minutes CBT journaling daily"
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8.5px] font-black text-emerald-700 uppercase tracking-wider block mb-1">🟢 Positive Reinforcement</label>
                    <textarea
                      value={newPositiveRe}
                      onChange={(e) => setNewPositiveRe(e.target.value)}
                      placeholder="Added stimulus to increase habit (reward)"
                      className="w-full text-[10px] p-2.5 bg-slate-50 rounded-xl border border-emerald-100 text-slate-700 placeholder-slate-400 focus:outline-none h-16 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] font-black text-teal-700 uppercase tracking-wider block mb-1">🔵 Negative Reinforcement</label>
                    <textarea
                      value={newNegativeRe}
                      onChange={(e) => setNewNegativeRe(e.target.value)}
                      placeholder="Removed aversive stimulus (escape alarm/stress)"
                      className="w-full text-[10px] p-2.5 bg-slate-50 rounded-xl border border-teal-100 text-slate-700 placeholder-slate-400 focus:outline-none h-16 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8.5px] font-black text-amber-700 uppercase tracking-wider block mb-1">🟠 Positive Punishment</label>
                    <textarea
                      value={newPositivePun}
                      onChange={(e) => setNewPositivePun(e.target.value)}
                      placeholder="Added barrier to reduce distraction (reflection)"
                      className="w-full text-[10px] p-2.5 bg-slate-50 rounded-xl border border-amber-100 text-slate-700 placeholder-slate-400 focus:outline-none h-16 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] font-black text-rose-700 uppercase tracking-wider block mb-1">🔴 Negative Punishment</label>
                    <textarea
                      value={newNegativePun}
                      onChange={(e) => setNewNegativePun(e.target.value)}
                      placeholder="Removed positive stimulus on distraction (penalty)"
                      className="w-full text-[10px] p-2.5 bg-slate-50 rounded-xl border border-rose-100 text-slate-700 placeholder-slate-400 focus:outline-none h-16 resize-none"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100/60 pt-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Reinforcement Variables / Schedule</label>
                    <span className="text-[8.5px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">
                      {newSchedule === 'VR' && 'Variable Ratio (Hardest Extinction)'}
                      {newSchedule === 'FR' && 'Fixed Ratio (Fast Action)'}
                      {newSchedule === 'FI' && 'Fixed Interval (Scheduled)'}
                      {newSchedule === 'VI' && 'Variable Interval (Unpredictable Timer)'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 bg-slate-100 rounded-xl p-1 text-center font-mono gap-1 text-[9px] font-extrabold mb-2.5">
                    {(['FR', 'VR', 'FI', 'VI'] as const).map((sch) => (
                      <button
                        key={sch}
                        type="button"
                        onClick={() => {
                          setNewSchedule(sch);
                          playBeep(450, 'sine', 0.05);
                        }}
                        className={`py-1.5 rounded-lg transition uppercase cursor-pointer ${
                          newSchedule === sch
                            ? 'bg-white text-slate-950 shadow-3xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {sch}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[9px] text-slate-600 font-semibold">Schedule Threshold Ratio / Iteration (x):</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setNewScheduleValue(prev => Math.max(1, prev - 1));
                          playBeep(400, 'sine', 0.04);
                        }}
                        className="w-6 h-6 bg-white border border-slate-200 hover:bg-slate-100 active:scale-90 transition rounded-md font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-black min-w-[20px] text-center">{newScheduleValue}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setNewScheduleValue(prev => Math.min(10, prev + 1));
                          playBeep(410, 'sine', 0.04);
                        }}
                        className="w-6 h-6 bg-white border border-slate-200 hover:bg-slate-100 active:scale-90 transition rounded-md font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 active:scale-97 transition cursor-pointer text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xs"
                >
                  Save Operant Protocol
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT 7 COLUMNS: Synapse Simulator & Conditioning Playground */}
          {activePlan && (
            <div className="lg:col-span-7 space-y-5">
              
              {/* Educational Summary of current Operant Protocol */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-3xs text-left relative overflow-hidden">
                <div className="absolute right-0 top-0 bg-indigo-50 text-indigo-700 font-mono text-[9px] px-3.5 py-1.5 rounded-bl-2xl font-black">
                  SCHEDULE: {activePlan.schedule} (1:{activePlan.scheduleValue})
                </div>
                <h3 className="text-xs font-black text-slate-700 leading-tight mb-3">Active Behavior Protocol Schema</h3>
                
                <div className="space-y-2 border-l-2 border-indigo-200 pl-3">
                  <p className="text-xs font-bold text-slate-900 leading-snug">{activePlan.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3.5 mt-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-emerald-800 block">🟢 POSITIVE REINFORCER</span>
                    <p className="text-[10px] text-slate-600 leading-relaxed font-semibold italic">{activePlan.positiveReinforcement}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-teal-800 block">🔵 NEGATIVE REINFORCER</span>
                    <p className="text-[10px] text-slate-600 leading-relaxed font-semibold italic">{activePlan.negativeReinforcement}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 mt-3 pt-3 border-t border-slate-100/60">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-amber-800 block">🟠 POSITIVE PUNISHMENT (Effort Barrier)</span>
                    <p className="text-[10px] text-slate-600 leading-relaxed font-semibold italic">{activePlan.positivePunishment}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-rose-800 block">🔴 NEGATIVE PUNISHMENT (Penalty)</span>
                    <p className="text-[10px] text-slate-600 leading-relaxed font-semibold italic">{activePlan.negativePunishment}</p>
                  </div>
                </div>
              </div>

              {/* Neuroplasticity Axon-Synapse Interactive Visualizer */}
              <div className="bg-slate-900 border border-slate-950 p-5 rounded-3xl shadow-xl space-y-4 text-left relative overflow-hidden">
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                  <span className="text-[8.5px] font-mono font-bold text-indigo-300">LIVE COGNITIVE SYNAPTOGENESIS</span>
                </div>

                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest block">Neural Synaptogenesis Simulator</h4>

                {/* Inline SVG rendering neuron connection */}
                <div className="bg-slate-950 rounded-2xl p-4 h-48 border border-slate-800 flex items-center justify-center relative overflow-hidden">
                  
                  {/* Grid background backing */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-35" />

                  {/* SVG Canvas drawing Axon and Synapse */}
                  <svg className="w-full h-full min-h-[160px] relative z-10" viewBox="0 0 400 160">
                    <defs>
                      <linearGradient id="axon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Pre-synaptic Dendrites / Soma */}
                    <circle cx="30" cy="80" r="14" fill="#312e81" stroke="#4f46e5" strokeWidth="2.5" />
                    <line x1="30" y1="80" x2="10" y2="60" stroke="#312e81" strokeWidth="2" />
                    <line x1="30" y1="80" x2="10" y2="100" stroke="#312e81" strokeWidth="2" />
                    <line x1="30" y1="80" x2="5" y2="80" stroke="#312e81" strokeWidth="2" />

                    {/* Axon Trunk */}
                    <path d="M 30,80 Q 120,50 210,80" fill="none" stroke="url(#axon-grad)" strokeWidth="3" />

                    {/* Myelin Sheath wraps - scaled by myelinThickness state */}
                    <rect x="55" y="58" width="35" height="18" rx="6" fill="#1e1b4b" stroke="#0ea5e9" strokeWidth="1.5" opacity={myelinThickness > 0.1 ? 0.95 : 0.4} />
                    <rect x="105" y="54" width="35" height="18" rx="6" fill="#1e1b4b" stroke="#0ea5e9" strokeWidth="1.5" opacity={myelinThickness > 0.4 ? 0.95 : 0.4} />
                    <rect x="155" y="58" width="35" height="18" rx="6" fill="#1e1b4b" stroke="#0ea5e9" strokeWidth="1.5" opacity={myelinThickness > 0.8 ? 0.95 : 0.4} />

                    <text x="55" y="94" fill="#38bdf8" fontSize="6.5" fontStyle="italic" fontWeight="bold">Myelin Core</text>

                    {/* Pre-synaptic terminal bulb */}
                    <circle cx="210" cy="80" r="6.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />

                    {/* Synaptic Cleft (Space between terminals) */}
                    {/* Pulsing neuro-transmitters based on simulationStage state */}
                    {simulationStage === 'reward' && (
                      <g>
                        <circle cx="222" cy="74" r="2" fill="#22c55e" className="animate-ping" />
                        <circle cx="226" cy="82" r="1.5" fill="#22c55e" />
                        <circle cx="220" cy="85" r="2.5" fill="#22c55e" />
                        <circle cx="230" cy="77" r="2" fill="#22c55e" />
                      </g>
                    )}
                    {simulationStage === 'cue' && (
                      <circle cx="225" cy="80" r="6" fill="#a855f7" stroke="#dc2626" strokeWidth="1.5" filter="url(#glow)" />
                    )}

                    {/* Post-synaptic membrane with Receptor Terminals */}
                    <path d="M 238,50 Q 248,80 238,110" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="238" y1="65" x2="248" y2="65" stroke="#f43f5e" strokeWidth="2" />
                    <line x1="238" y1="80" x2="248" y2="80" stroke="#f43f5e" strokeWidth="2" />
                    <line x1="238" y1="95" x2="248" y2="95" stroke="#f43f5e" strokeWidth="2" />

                    {/* Glowing Synaptic Connection line reflecting synapticDensity value */}
                    <line 
                      x1="210" y1="80" 
                      x2="238" y2="80" 
                      stroke="#fbbf24" 
                      strokeWidth={1 + (synapticDensity / 15)} 
                      opacity={0.3 + (synapticDensity / 150)}
                      filter="url(#glow)" 
                    />

                    {/* Simulated pulse particle */}
                    {isSimulating && (
                      <circle cx={simulationStage === 'cue' ? 30 : simulationStage === 'craving' ? 100 : simulationStage === 'response' ? 170 : 225} cy="75" r="4" fill="#a855f7" className="transition-all duration-1000" />
                    )}
                  </svg>

                  {/* Stage-indicator tooltip */}
                  <div className="absolute bottom-3 left-4 bg-slate-900 border border-slate-700 px-3 py-1 rounded-xl">
                    <span className="text-[8px] font-mono text-slate-400 font-extrabold uppercase block leading-none">TRANSMITTER PHASE</span>
                    <span className="text-[10px] font-black text-indigo-300">
                      {simulationStage === 'idle' && '💤 Axon Idle State'}
                      {simulationStage === 'cue' && '⚡ Cue Trigger (Input stimulus detected)'}
                      {simulationStage === 'craving' && '🌀 Action Craving (Prefrontal desire cascade)'}
                      {simulationStage === 'response' && '⚙️ Operant Response (Action executed)'}
                      {simulationStage === 'reward' && '🍀 Synaptic Reward (Dopamine synaptogenesis)'}
                    </span>
                  </div>
                </div>

                {/* Biometric progress numbers */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-left">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[8px] text-indigo-400 font-black uppercase">Synaptic Density</span>
                      <span className="text-[7.5px] text-emerald-400 font-black">+{synapticDensity > 60 ? 'HIGH' : 'GROWING'}</span>
                    </div>
                    <p className="text-sm font-black text-white font-mono">{synapticDensity}%</p>
                    <div className="w-full bg-[#1e293b] rounded-full h-1 mt-1">
                      <div className="bg-indigo-500 h-1 rounded-full transition-all duration-300" style={{ width: `${synapticDensity}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-left">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[8px] text-sky-400 font-black uppercase">Myelin Sheath</span>
                      <span className="text-[7.5px] text-sky-300 font-mono italic">Lipid core</span>
                    </div>
                    <p className="text-sm font-black text-white font-mono">{myelinThickness} µm</p>
                    <div className="w-full bg-[#1e293b] rounded-full h-1 mt-1">
                      <div className="bg-sky-400 h-1 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (myelinThickness / 1.5) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-left">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[8px] text-amber-400 font-black uppercase">Extinction Resist</span>
                      <span className="text-[7.5px] text-amber-500 font-black">{extinctionResistance > 70 ? 'STABLE' : 'VULNERABLE'}</span>
                    </div>
                    <p className="text-sm font-black text-white font-mono">{extinctionResistance}%</p>
                    <div className="w-full bg-[#1e293b] rounded-full h-1 mt-1">
                      <div className="bg-amber-400 h-1 rounded-full transition-all duration-300" style={{ width: `${extinctionResistance}%` }} />
                    </div>
                  </div>
                </div>

                {/* Control Action row */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={triggerTrainingTrial}
                    disabled={isSimulating}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 select-none text-white text-[10px] uppercase tracking-widest font-black rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-97 transition shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isSimulating ? 'Simulating Conditioning Trial...' : 'Simulate Conditioning Trial'}</span>
                  </button>

                  <button
                    onClick={resetNeuralTracing}
                    disabled={isSimulating}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] font-black uppercase tracking-wider rounded-2xl cursor-pointer active:scale-95 transition"
                  >
                    Reset Pathway
                  </button>
                </div>
              </div>

              {/* Training logs and operational commentary */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-3xs text-left">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">Neural Conditioning Logs</span>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl max-h-[120px] overflow-y-auto space-y-2 text-[10px] font-mono text-slate-600 leading-relaxed font-semibold">
                  {trialLogs.map((log, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <span className="text-teal-600 font-extrabold select-none">▶</span>
                      <p>{log}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      ) : (
        /* --- ERIKSON DEV STAGES workspace --- */
        <div className="space-y-6">
          
          {/* List of Erikson stages with horizontal visual cards */}
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase font-black tracking-wider">Erik Erikson Lifespan Framework</span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">Stages of Psychosocial Development</h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Every life phase introduces a core conflict crisis between relational alignment and emotional stagnation. Complete resolved virtue logs above to monitor identity growth.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-left">
            {ERIKSON_STAGES.map((st, idx) => (
              <button
                key={st.number}
                onClick={() => {
                  setSelectedStageIndex(idx);
                  playBeep(520 + (idx * 30), 'sine', 0.08);
                }}
                className={`p-2.5 rounded-2xl border transition text-left relative flex flex-col justify-between h-[80px] cursor-pointer ${
                  selectedStageIndex === idx
                    ? 'border-indigo-500 bg-indigo-500 text-white shadow-md font-extrabold scale-102 ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className={`text-[8.5px] font-extrabold font-mono ${selectedStageIndex === idx ? 'text-indigo-200' : 'text-slate-400'}`}>
                    STAGE {st.number}
                  </span>
                  {selectedStageIndex === idx && <Check className="w-3 h-3 text-white stroke-[3.5]" />}
                </div>
                <div>
                  <h4 className="text-[10px] line-clamp-1 leading-tight font-black">{st.name.split(':')[0]}</h4>
                  <span className={`text-[8px] font-mono block mt-0.5 ${selectedStageIndex === idx ? 'text-indigo-100' : 'text-slate-400 font-bold'}`}>
                    Virtue: <strong className="font-extrabold uppercase">{st.virtue}</strong>
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Core Selected Stage Information Card */}
          {(() => {
            const currentStage = ERIKSON_STAGES[selectedStageIndex];
            return (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
                
                {/* 5 COLUMNS: Stage overview details */}
                <div className="md:col-span-5 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-3xs space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-black font-mono">
                      {currentStage.years}
                    </span>
                    <h3 className="font-display text-base font-black text-slate-900 mt-1.5">{currentStage.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono italic font-extrabold"> existential Question: "{currentStage.existentialQuestion}"</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-2.5">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase text-indigo-700 tracking-wider">🌟 Target Virtue To Unlock</span>
                      <p className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>{currentStage.virtue} / Creative Integration</span>
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Description of Psychosocial Crisis</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">{currentStage.description}</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase text-rose-800 tracking-wider block">Stagnation Warning Risk</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">{currentStage.stagnationDanger}</p>
                    </div>

                    <div className="space-y-0.5 bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100">
                      <span className="text-[9px] font-black uppercase text-indigo-800 tracking-wider block mb-0.5">Clinical Repatterning Strategy</span>
                      <p className="text-[10.5px] text-indigo-950 font-semibold leading-relaxed">{currentStage.pathway}</p>
                    </div>
                  </div>
                </div>

                {/* 7 COLUMNS: Interactive Stage Conflict Counselor Tracker */}
                <div className="md:col-span-7 space-y-4">
                  
                  {/* Active journaling worksheet of this developmental stage */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-3xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Interactive Lifespan Conflict Journal</h4>
                    </div>

                    <form onSubmit={handleSynthesizeConflict} className="space-y-3.5">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                          Log Your Current Developmental Conflict or Memory:
                        </label>
                        <textarea
                          required
                          value={conflictInput}
                          onChange={(e) => setConflictInput(e.target.value)}
                          placeholder={`Identify a struggle related to "${currentStage.name}". e.g., Unsure of my identity split, feeling disconnected from my peer group...`}
                          className="w-full text-xs p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 h-24 resize-none leading-relaxed"
                        />
                      </div>

                      {/* Interactive slide adjustments */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Psychosocial Tension</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={tensionLevel}
                              onChange={(e) => setTensionLevel(Number(e.target.value))}
                              className="w-full accent-indigo-500 cursor-pointer"
                            />
                            <span className="text-[9px] font-mono font-bold text-slate-500 w-6 text-right shrink-0">{tensionLevel}%</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Stagnation Scale</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={stagnationScale}
                              onChange={(e) => setStagnationScale(Number(e.target.value))}
                              className="w-full accent-rose-500 cursor-pointer"
                            />
                            <span className="text-[9px] font-mono font-bold text-slate-500 w-6 text-right shrink-0">{stagnationScale}%</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Virtue Connection</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={virtueAlignment}
                              onChange={(e) => setVirtueAlignment(Number(e.target.value))}
                              className="w-full accent-emerald-500 cursor-pointer"
                            />
                            <span className="text-[9px] font-mono font-bold text-slate-500 w-6 text-right shrink-0">{virtueAlignment}%</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSynthesizing || !conflictInput}
                        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 disabled:opacity-40 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-97"
                      >
                        {isSynthesizing ? (
                          <>
                            <span className="animate-spin text-xs">🌀</span>
                            <span>Reframing Conflict Coordinates...</span>
                          </>
                        ) : (
                          <>
                            <Smile className="w-3.5 h-3.5" />
                            <span>Synthesize &amp; Unlock Developmental Virtue</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* List of previously logged conflicts */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-3xs space-y-3">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider block">Active Developmental Logs ({savedConflicts.length})</span>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {savedConflicts.length === 0 ? (
                        <p className="text-[10px] text-slate-400 italic text-center py-6 font-semibold">No developmental conflict records found. Build records above to observe maturation progress.</p>
                      ) : (
                        savedConflicts.map((con) => (
                          <div key={con.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl relative text-left text-xs">
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-[8.5px] text-slate-400 block font-bold leading-none uppercase">
                                Stage {con.stageIndex + 1}: {ERIKSON_STAGES[con.stageIndex].name}
                              </span>
                              <button
                                onClick={() => handleDeleteConflict(con.id)}
                                className="p-1 text-slate-300 hover:text-rose-600 rounded-lg transition"
                                title="Delete log entry"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <h4 className="font-bold text-slate-900 mt-1 text-[11px] leading-tight shrink-0">{con.title}</h4>
                            <p className="text-[10px] text-slate-600 leading-relaxed font-semibold italic mt-1 bg-white/60 p-2 rounded-xl border border-slate-100">
                              "{con.conflictDescription}"
                            </p>
                            
                            {/* Synthesis output */}
                            <div className="mt-2.5 pt-2 border-t border-slate-200/50 space-y-1.5">
                              <div className="flex justify-between items-center text-[8px] font-mono font-bold uppercase text-indigo-700 bg-indigo-50 border border-indigo-100/60 p-1 px-2.5 rounded-lg">
                                <span>Virtue: {con.targetVirtue}</span>
                                <span>Date: {con.resolvedDate}</span>
                              </div>
                              <p className="text-[9.5px] font-bold text-slate-700 leading-relaxed text-left bg-indigo-50/20 p-2 rounded-xl border border-indigo-100/30">
                                🧠 {con.virtualSynthesis}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>
            );
          })()}

        </div>
      )}

      {/* Embedded scientific definitions block containing all psychology guidelines */}
      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-left text-xs mt-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-indigo-700" />
          <h4 className="text-[10.5px] font-black text-slate-800 uppercase tracking-widest font-mono">Behavioral Learning &amp; Life stages Curriculum</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[10px] font-semibold text-slate-500 leading-relaxed">
          <div className="space-y-1">
            <h5 className="font-bold text-slate-800 font-mono text-[9.5px]">OPERANT CONDITIONING INFLUENCERS</h5>
            <p>
              <strong>Reinforcers</strong> increase the frequency of a behavior. Positive adds a desirable stimulus (praise, tokens); negative takes away an aversive stimulus (escaping pain or removing visual clutter).
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-slate-800 font-mono text-[9.5px]">CONSTRAINTS &amp; VARIABLE SCHEDULES</h5>
            <p>
              <strong>Ratio</strong> schedules trigger rewards based on quantity. <strong>Variable Ratio</strong> (VR) scales trigger intermittent bursts, resisting habit extinction longer than fixed intervals.
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-slate-800 font-mono text-[9.5px]">DEVELOPMENTAL LIFESPAN CONFLICTS</h5>
            <p>
              Erikson's stages establish that adult behavior is deeply shaped by resolved historical crises. Engaging shadow stages releases psychological stagnation and builds targeted character virtues.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
