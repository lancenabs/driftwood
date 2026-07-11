import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Compass, 
  ArrowRight, 
  Brain, 
  Eye, 
  Activity, 
  AlertCircle, 
  Flame, 
  User, 
  PenTool, 
  CheckCircle2, 
  RotateCw,
  Heart,
  Shield,
  Briefcase
} from 'lucide-react';
import { MoodLog, ActivityLog } from '../types';

interface JungianReflectionProps {
  moodLogs: MoodLog[];
  activityLogs: ActivityLog[];
  userName: string;
  onNavigateToTab?: (tab: string, subtab?: string) => void;
  onOpenTherapeuticChat?: (message: string) => void;
}

// Defining our archetype blueprints
interface ArchetypeDetails {
  id: string;
  name: string;
  motto: string;
  description: string;
  expression: string;
  shadowAspect: string;
  remedyAction: string;
  practicalApp: {
    tab: string;
    subtab: string;
    label: string;
  };
  colorTheme: {
    bg: string;
    text: string;
    border: string;
    accent: string;
    lightAccent: string;
  };
}

const ARCHETYPES: Record<string, ArchetypeDetails> = {
  sage: {
    id: 'sage',
    name: 'The Sage (The Seeker of Truth)',
    motto: 'The truth will set you free.',
    description: 'Driven by the desire to understand the world, using analytical clarity, objective facts, and self-knowledge.',
    expression: 'Active and robust when filing thoughtful CBT thought records, analyzing cognitive distortions, or exploring learning literature.',
    shadowAspect: 'Can become overly critical, detached in intellectualization, or paralyzed by overthinking rather than feeling.',
    remedyAction: 'Ground abstract thoughts into felt physical safety using somatic maps.',
    practicalApp: {
      tab: 'practice',
      subtab: 'cbt',
      label: 'Open CBT Reframer Gym'
    },
    colorTheme: {
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
      accent: 'bg-indigo-600',
      lightAccent: 'bg-indigo-100/60'
    }
  },
  warrior: {
    id: 'warrior',
    name: 'The Hero / Warrior (The Protector)',
    motto: 'Where there is a will, there is a way.',
    description: 'Powered by discipline, overcoming obstacles, achieving habit streaks, and asserting healthy personal boundaries.',
    expression: 'Strong when completing daily habits, maintaining self-care regimes, and actively overcoming physical blockages.',
    shadowAspect: 'Prone to burning out, treating the self too harshly, or viewing every emotion as a battle to be won.',
    remedyAction: 'Engage in soft vagal downregulation breathing exercises to restore emotional softness.',
    practicalApp: {
      tab: 'practice',
      subtab: 'goals',
      label: 'Review SMART Goals'
    },
    colorTheme: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      text: 'text-rose-800',
      border: 'border-rose-200',
      accent: 'bg-rose-600',
      lightAccent: 'bg-rose-100/60'
    }
  },
  caregiver: {
    id: 'caregiver',
    name: 'The Caregiver (The Altruist)',
    motto: 'Love your neighbor as yourself.',
    description: 'Characterized by compassion, holding space for difficult emotions, and supporting others (and the self) with gentle kindness.',
    expression: 'Nourished when writing in the Gratitude journal, engaging with emotional summaries, and setting soft somatic boundaries.',
    shadowAspect: 'Self-sacrificing behavior, ignoring personal boundaries, or slipping into co-dependence and self-neglect.',
    remedyAction: 'Create personal self-care goals and claim space to observe, rather than fix, issues.',
    practicalApp: {
      tab: 'checkin',
      subtab: 'gratitude',
      label: 'Record in Gratitude File'
    },
    colorTheme: {
      bg: 'bg-teal-50 border-teal-200 text-teal-900',
      text: 'text-teal-800',
      border: 'border-teal-200',
      accent: 'bg-teal-600',
      lightAccent: 'bg-teal-100/60'
    }
  },
  shadow: {
    id: 'shadow',
    name: 'The Shadow / Orphan (The Disowned Self)',
    motto: 'I am all of me, even the parts that hurt.',
    description: 'Represents the repressed, disowned, or guarded feelings (like anger, envy, high anxiety) that we hide behind our social mask.',
    expression: 'Triggers when feeling low, down, or highly anxious. It surfaces through projection or severe negative self-talk.',
    shadowAspect: 'If left unconscious, it acts out as destructive passive-aggression, chronic imposter syndrome, or sudden panic reactions.',
    remedyAction: 'Use Shadow Integration writing to bring these emotions into conscious, safe awareness.',
    practicalApp: {
      tab: 'learning',
      subtab: 'library', // This will open the learning tab where our shadow article lives!
      label: 'Read Shadow Work Guide'
    },
    colorTheme: {
      bg: 'bg-slate-50 border-slate-300 text-slate-900',
      text: 'text-slate-800',
      border: 'border-slate-200',
      accent: 'bg-slate-800',
      lightAccent: 'bg-slate-100'
    }
  },
  explorer: {
    id: 'explorer',
    name: 'The Explorer (The Seeker of Freedom)',
    motto: 'Don\'t fence me in.',
    description: 'Desires the freedom to discover true identity through introspection, dream documentation, and experiencing different perspectives.',
    expression: 'Engaged when using the Sleep and Dream Tracker, recording strange dreams, or setting out on personalized mental explorations.',
    shadowAspect: 'Prone to restlessness, inability to commit to a routine, or fleeing from actual problem-solving into virtual distractions.',
    remedyAction: 'Anchor exploratory insights into physical reality using daily structured habits.',
    practicalApp: {
      tab: 'checkin',
      subtab: 'sleep',
      label: 'Explore Dream Analytics'
    },
    colorTheme: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      text: 'text-amber-800',
      border: 'border-amber-200',
      accent: 'bg-amber-600',
      lightAccent: 'bg-amber-100/60'
    }
  }
};

export default function JungianReflection({ 
  moodLogs, 
  activityLogs, 
  userName,
  onNavigateToTab,
  onOpenTherapeuticChat 
}: JungianReflectionProps) {
  
  const [selectedArchetype, setSelectedArchetype] = useState<string>('sage');
  const [reflectionAnswer, setReflectionAnswer] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);

  // Dynamic analysis based on real logs!
  const archetypeScores = useMemo(() => {
    let sagePoints = 15; // default base starting values
    let warriorPoints = 15;
    let caregiverPoints = 15;
    let shadowPoints = 15;
    let explorerPoints = 15;

    // 1. Analyze Mood Logs
    moodLogs.forEach(log => {
      const score = log.score;
      const note = (log.note || '').toLowerCase();

      // Lower mood scores represent the unconscious or guarded emotions (Shadow activation)
      if (score <= 2) {
        shadowPoints += 12;
        sagePoints += 2;
      } else if (score === 3) {
        explorerPoints += 10;
        caregiverPoints += 5;
      } else if (score >= 4) {
        caregiverPoints += 8;
        warriorPoints += 5;
        sagePoints += 8;
      }

      // Keyword scanning for deeper clinical relevance
      if (note.includes('analyze') || note.includes('think') || note.includes('know') || note.includes('understand') || note.includes('cbt') || note.includes('refram')) {
        sagePoints += 15;
      }
      if (note.includes('run') || note.includes('workout') || note.includes('worked') || note.includes('task') || note.includes('achieve') || note.includes('habit')) {
        warriorPoints += 15;
      }
      if (note.includes('thankful') || note.includes('grateful') || note.includes('help') || note.includes('kind') || note.includes('love') || note.includes('peace')) {
        caregiverPoints += 15;
      }
      if (note.includes('sad') || note.includes('mad') || note.includes('angry') || note.includes('scared') || note.includes('fear') || note.includes('worry') || note.includes('stress')) {
        shadowPoints += 15;
      }
      if (note.includes('dream') || note.includes('sleep') || note.includes('wonder') || note.includes('explore') || note.includes('future') || note.includes('journey')) {
        explorerPoints += 15;
      }
    });

    // 2. Analyze Activity Logs for Warrior/Caregiver traits
    activityLogs.forEach(act => {
      if (act.exercise) warriorPoints += 10;
      if (act.social) caregiverPoints += 8;
      if (act.mealsCompleted >= 2) caregiverPoints += 5; // Self-nourishment
    });

    // Total points normalization to 100%
    const total = sagePoints + warriorPoints + caregiverPoints + shadowPoints + explorerPoints;
    
    return {
      sage: Math.round((sagePoints / total) * 100),
      warrior: Math.round((warriorPoints / total) * 100),
      caregiver: Math.round((caregiverPoints / total) * 100),
      shadow: Math.round((shadowPoints / total) * 100),
      explorer: Math.round((explorerPoints / total) * 100)
    };
  }, [moodLogs, activityLogs]);

  // Determine dominant archetype
  const dominantArchetypeId = useMemo(() => {
    let maxScore = -1;
    let maxId = 'sage';
    (Object.entries(archetypeScores) as [string, number][]).forEach(([id, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxId = id;
      }
    });
    return maxId;
  }, [archetypeScores]);

  // Interactive self-reflection prompts based on selected archetype
  const PROMPTS: Record<string, string[]> = {
    sage: [
      'What absolute truth are you searching for in your life right now? Where are you afraid to look closely?',
      'In what ways are you over-analyzing a current challenge rather than allowing yourself to feel it somatically?',
    ],
    warrior: [
      'In what area of your life do you need to assert a firm, courageous boundary? Where have you been too receptive?',
      'Is your current drive for perfection leading to inner exhaustion? How can the Warrior practice strategic retreat?',
    ],
    caregiver: [
      'Write down three boundaries you need to establish with yourself to secure your energy from pouring outward.',
      'How can you offer yourself the same unconditional, gentle holding space you would offer a loved one in distress?',
    ],
    shadow: [
      'Think of a quality in someone else that recently triggered intense frustration in you. What unowned aspect of yourself might that display?',
      'If your chronic anxiety or sadness had a voice, what is it trying to protect you from? What hidden need is it announcing?',
    ],
    explorer: [
      'If you could change one major structural detail of your daily routine with zero fear of consequences, what would it be?',
      'What symbols, recurring settings, or characters from your recent dreams do you feel hold keys to your current waking path?',
    ]
  };

  const handleNextPrompt = () => {
    const totalPrompts = PROMPTS[selectedArchetype]?.length || 1;
    setSelectedPromptIndex((prev) => (prev + 1) % totalPrompts);
    setReflectionAnswer('');
    setIsSaved(false);
  };

  const handleSaveReflection = () => {
    if (!reflectionAnswer.trim()) return;
    setIsSaved(true);
    
    // Store saved reflection in localStorage under historical reflections
    const rawReflections = localStorage.getItem('therapy_jungian_reflections') || '[]';
    let reflectionsList = [];
    try {
      reflectionsList = JSON.parse(rawReflections);
    } catch (e) {
      reflectionsList = [];
    }
    
    const newRef = {
      id: String(Date.now()),
      date: new Date().toISOString().split('T')[0],
      archetype: ARCHETYPES[selectedArchetype].name,
      prompt: PROMPTS[selectedArchetype][selectedPromptIndex],
      answer: reflectionAnswer
    };
    
    reflectionsList.unshift(newRef);
    localStorage.setItem('therapy_jungian_reflections', JSON.stringify(reflectionsList));
  };

  const handleDiscussWithAI = () => {
    if (!reflectionAnswer.trim() || !onOpenTherapeuticChat) return;
    const promptText = `I am researching my Jungian Archetypal balance. On "${ARCHETYPES[selectedArchetype].name}", I reflected on this prompt: "${PROMPTS[selectedArchetype][selectedPromptIndex]}". 
My thoughts: "${reflectionAnswer}". 

Can you provide a deep analytical feedback loop from a Jungian psychological perspective, and connect this to how I can safely integrate my shadow patterns?`;
    onOpenTherapeuticChat(promptText);
  };

  return (
    <div
      id="jung-self-reflection-module"
      className="bg-white border border-[#F0F0F0] rounded-3xl p-5 md:p-6 space-y-6 text-left"
      style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
    >

      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-teal-700">
            <Brain className="w-4 h-4 text-teal-600 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-extrabold font-sans">Jungian Psychoanalysis Suite</span>
          </div>
          <h3 className="font-display text-base font-bold text-slate-900 tracking-tight">Archetype & Recurring Pattern Synthesis</h3>
          <p className="text-[11.5px] text-slate-500 font-medium leading-relaxed">
            Carl Jung postulated that the psyche holds collective symbols and disowned shadows. We scan your behavioral check-ins to map your current archetypal coordinates.
          </p>
          <p className="text-[11.5px] text-slate-500 font-medium leading-relaxed">
            In plain terms: "shadow" work just means getting curious about the feelings and reactions you usually push aside — like anger, envy, or fear — so they stop running the show without your permission.
          </p>
        </div>

        {/* Dynamic dominant tag */}
        <div className="flex items-center gap-1 bg-teal-50 border border-teal-200 rounded-full px-3 py-1.5 self-start">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 fill-teal-100 animate-pulse shrink-0" />
          <span className="text-[10px] font-extrabold text-teal-800 uppercase tracking-wider">
            Active: {ARCHETYPES[dominantArchetypeId]?.name.split(' (')[0] || 'The Sage'}
          </span>
        </div>
      </div>

      {/* BENZO/GRID AREA: Archetypal Energy Matrix and Active Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COLUMN: Real-time scan indicators (lg:span-5) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest block font-sans mb-3">
              DYNAMIC ARCHETYPAL ALIGNMENT SCAN (%)
            </span>

            <div className="space-y-3">
              {(Object.entries(archetypeScores) as [string, number][]).map(([id, percentage]) => {
                const info = ARCHETYPES[id];
                if (!info) return null;
                const isDominant = id === dominantArchetypeId;
                const highlightBg = isDominant ? info.colorTheme.accent : 'bg-slate-300';

                return (
                  <div
                    key={id}
                    onClick={() => {
                      setSelectedArchetype(id);
                      setSelectedPromptIndex(0);
                      setReflectionAnswer('');
                      setIsSaved(false);
                    }}
                    className={`min-h-[40px] p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-center gap-1.5 ${
                      selectedArchetype === id
                        ? `${info.colorTheme.bg} border-current shadow-sm`
                        : 'border-transparent hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-bold uppercase tracking-tight ${selectedArchetype === id ? '' : 'text-slate-700'}`}>
                        {info.name.split(' (')[0]}
                      </span>
                      <span className="font-mono font-extrabold text-[11px]">
                        {percentage}%
                      </span>
                    </div>
                    {/* Visual Bar Track */}
                    <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${highlightBg}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[10px] font-semibold text-slate-400 border-t border-slate-200/50 pt-2.5 flex items-center justify-between">
            <span>Scan Source: {moodLogs.length} Mood Files, {activityLogs.length} Self-Care Logs</span>
            <span className="text-emerald-500 font-bold flex items-center gap-0.5">● Dynamic State</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Archetype Deep Dive & Synthesis (lg:span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-between items-stretch">
          
          {/* Main Card Information */}
          <div className={`p-4 rounded-2xl border ${ARCHETYPES[selectedArchetype].colorTheme.bg} space-y-3 h-full`}>
            <div className="space-y-1">
              <span className="text-[9.5px] font-mono font-extrabold tracking-widest uppercase opacity-80 block">
                SELECTED psyche segment
              </span>
              <h4 className="text-base font-black tracking-tight flex items-center gap-1.5">
                {ARCHETYPES[selectedArchetype].name}
              </h4>
            </div>

            <p className="text-[11.5px] italic font-semibold border-l-2 border-current pl-3 leading-relaxed opacity-90">
              "{ARCHETYPES[selectedArchetype].motto}"
            </p>

            <p className="text-xs leading-relaxed font-medium text-slate-700">
              {ARCHETYPES[selectedArchetype].description}
            </p>

            {/* Expression description */}
            <div className="space-y-1 pt-1 text-slate-700">
              <span className="text-[10px] font-extrabold uppercase tracking-wide block font-sans text-slate-600">Active Expression:</span>
              <p className="text-xs leading-relaxed font-medium">
                {ARCHETYPES[selectedArchetype].expression}
              </p>
            </div>

            {/* Shadow trap */}
            <div className={`p-3 rounded-xl ${ARCHETYPES[selectedArchetype].colorTheme.lightAccent} border border-black/5 space-y-1`}>
              <span className="text-[9.5px] font-extrabold tracking-widest uppercase text-rose-700 font-sans block">
                The Shadow Aspect (The Trap)
              </span>
              <p className="text-[11.5px] leading-relaxed font-semibold text-slate-800">
                {ARCHETYPES[selectedArchetype].shadowAspect}
              </p>
              <p className="text-[11px] leading-relaxed text-slate-600 pt-1 border-t border-black/[0.04]">
                <strong className="text-slate-900">Remedy Action:</strong> {ARCHETYPES[selectedArchetype].remedyAction}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REACTION & APPLICATION EXERCISE WORKSPACE */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-200/50 pb-3">
          <div className="flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-black text-slate-800">Direct Archetypal Writing Prompt</span>
          </div>
          <button
            type="button"
            onClick={handleNextPrompt}
            className="min-h-[40px] px-3 -mr-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Try Another Prompt</span>
          </button>
        </div>

        {/* Selected Prompt Question Text */}
        <div className="space-y-1.5">
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-700 font-sans">INTEGRATIVE QUESTION:</span>
          <p className="text-xs text-slate-900 font-black leading-relaxed italic bg-indigo-50/50 p-3 rounded-xl border border-indigo-200/40">
            "{PROMPTS[selectedArchetype][selectedPromptIndex]}"
          </p>
        </div>

        {/* Input response field */}
        <div className="space-y-2.5 relative">
          <textarea
            value={reflectionAnswer}
            onChange={(e) => {
              setReflectionAnswer(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Explore your patterns. Unmask reservations, automatic behaviors, and secret projections here honestly and without self-criticism..."
            className="w-full h-24 p-3 bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/10 text-xs font-semibold resize-none shadow-inner leading-relaxed"
          />

          {isSaved && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-semibold"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Reflection saved successfully in your local clinical telemetry file.</span>
            </motion.div>
          )}

          <div className="flex items-center gap-2 pt-1 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleSaveReflection}
              disabled={!reflectionAnswer.trim()}
              className="min-h-[44px] flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 duration-200 cursor-pointer disabled:opacity-50"
            >
              Save Reflection File
            </button>
            <button
              type="button"
              onClick={handleDiscussWithAI}
              disabled={!reflectionAnswer.trim()}
              className="min-h-[44px] flex-1 py-2.5 px-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-bold shadow-sm transition active:scale-95 duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Discuss via AI Therapist</span>
            </button>
          </div>
        </div>

        {/* Practical alignment bridging learn-then-practice constraint */}
        {onNavigateToTab && (
          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[10px] text-slate-500 font-semibold">
              Ready to apply this archetype to real-world self-care?
            </span>
            <button
              onClick={() => {
                const app = ARCHETYPES[selectedArchetype].practicalApp;
                onNavigateToTab(app.tab, app.subtab);
              }}
              className="min-h-[40px] px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full font-bold text-[10px] border border-indigo-100/80 transition-all active:scale-95 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>{ARCHETYPES[selectedArchetype].practicalApp.label}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
