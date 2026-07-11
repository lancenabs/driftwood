import React, { useState } from 'react';
import { 
  Heart, 
  Award, 
  Compass, 
  Smile, 
  HelpCircle, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  BookOpen,
  Waves,
  Hammer,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Question Interface
interface QuizQuestion {
  id: number;
  text: string;
  pillar: 'love_maps' | 'fondness' | 'turning_towards' | 'positive_perspective' | 'manage_conflict' | 'dreams' | 'shared_meaning';
  pillarLabel: string;
  pillarDescription: string;
}

const QUESTIONS: QuizQuestion[] = [
  // 1. Build Love Maps
  { 
    id: 1, 
    text: "I can name my partner's best friends, current stressors, and major life worries.", 
    pillar: 'love_maps',
    pillarLabel: "Build Love Maps",
    pillarDescription: "Your cognitive understanding of your partner's inner world, history, dreams, and worries."
  },
  { 
    id: 2, 
    text: "We regularly ask open-ended questions and check in on each other's inner thoughts.", 
    pillar: 'love_maps',
    pillarLabel: "Build Love Maps",
    pillarDescription: "Your cognitive understanding of your partner's inner world, history, dreams, and worries."
  },
  
  // 2. Share Fondness & Admiration
  { 
    id: 3, 
    text: "I frequently tell my partner what I appreciate about them and explicitly validate their efforts.", 
    pillar: 'fondness',
    pillarLabel: "Fondness & Admiration",
    pillarDescription: "The amount of mutual respect, affection, and active appreciation present in your daily life."
  },
  { 
    id: 4, 
    text: "Even during disagreements, we maintain a baseline of admiration and avoid speaking with contempt.", 
    pillar: 'fondness',
    pillarLabel: "Fondness & Admiration",
    pillarDescription: "The amount of mutual respect, affection, and active appreciation present in your daily life."
  },

  // 3. Turn Towards Instead of Away
  { 
    id: 5, 
    text: "When my partner sighs, makes a joke, or points something out (connection bids), I choose to engage instead of ignoring them.", 
    pillar: 'turning_towards',
    pillarLabel: "Turning Towards",
    pillarDescription: "How often you respond, nod, or converse in response to micro-bids for attention."
  },
  { 
    id: 6, 
    text: "We make eye contact, put down our devices, and acknowledge each other when talking.", 
    pillar: 'turning_towards',
    pillarLabel: "Turning Towards",
    pillarDescription: "How often you respond, nod, or converse in response to micro-bids for attention."
  },

  // 4. The Positive Perspective
  { 
    id: 7, 
    text: "I give my partner the benefit of the doubt and assume neutral or positive intent rather than jumping to conclusions.", 
    pillar: 'positive_perspective',
    pillarLabel: "Positive Perspective",
    pillarDescription: "An overall sense of optimism where you interpret ambiguous situations generously."
  },
  { 
    id: 8, 
    text: "I view our relationship as a supportive alliance, even when we are tired or physically separated.", 
    pillar: 'positive_perspective',
    pillarLabel: "Positive Perspective",
    pillarDescription: "An overall sense of optimism where you interpret ambiguous situations generously."
  },

  // 5. Manage Conflict
  { 
    id: 9, 
    text: "We are able to start sensitive discussions gently (using softened start-ups like 'I feel... about... and need...') instead of accusing.", 
    pillar: 'manage_conflict',
    pillarLabel: "Manage Conflict",
    pillarDescription: "Accepting your partner's influence, de-escalating arguments, and practicing self-soothing when flooded."
  },
  { 
    id: 10, 
    text: "When arguments get too heated, we agree to take a calm, self-soothing break rather than yelling or stonewalling.", 
    pillar: 'manage_conflict',
    pillarLabel: "Manage Conflict",
    pillarDescription: "Accepting your partner's influence, de-escalating arguments, and practicing self-soothing when flooded."
  },

  // 6. Make Life Dreams Come True
  { 
    id: 11, 
    text: "We support each other's individual life goals, career dreams, and personal aspirations.", 
    pillar: 'dreams',
    pillarLabel: "Make Life Dreams Come True",
    pillarDescription: "Creating an atmosphere of encouragement where both partners feel free to pursue dreams."
  },
  { 
    id: 12, 
    text: "We collaborate to overcome financial or family barriers so both partners can pursue meaningful hobbies.", 
    pillar: 'dreams',
    pillarLabel: "Make Life Dreams Come True",
    pillarDescription: "Creating an atmosphere of encouragement where both partners feel free to pursue dreams."
  },

  // 7. Create Shared Meaning
  { 
    id: 13, 
    text: "We have established warm, consistent rituals of connection (e.g. daily morning coffee, weekly date nights, holiday traditions).", 
    pillar: 'shared_meaning',
    pillarLabel: "Create Shared Meaning",
    pillarDescription: "Having a shared legacy, common values, mutual household roles, and collaborative goals."
  },
  { 
    id: 14, 
    text: "We agree on our family values, household responsibilities, and how we want our life legacy to look.", 
    pillar: 'shared_meaning',
    pillarLabel: "Create Shared Meaning",
    pillarDescription: "Having a shared legacy, common values, mutual household roles, and collaborative goals."
  }
];

interface PillarScore {
  score: number; // Max 8, min 2
  pct: number;
  label: string;
  description: string;
  advice: string;
  exercise: string;
}

export default function GottmanQuiz({ onBack }: { onBack?: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  // The Soundings log (driftwood_soundings_v1): every completed reading is a
  // dated entry — trend over time is the whole point of taking soundings.
  React.useEffect(() => {
    if (!isCompleted) return;
    try {
      const log = JSON.parse(localStorage.getItem('driftwood_soundings_v1') || '[]');
      log.push({ at: new Date().toISOString(), answers });
      localStorage.setItem('driftwood_soundings_v1', JSON.stringify(log.slice(-24)));
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted]);

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIdx];

  // Handle choice selection
  const handleSelectChoice = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    
    if (currentIdx < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
      }, 150);
    } else {
      setIsCompleted(true);
    }
  };

  // Back progress
  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  // Reset state
  const handleReset = () => {
    setAnswers({});
    setCurrentIdx(0);
    setIsCompleted(false);
  };

  // Skip / Auto-fill for clinical testing
  const handleQuickFill = (scoreType: 'high' | 'low' | 'mixed') => {
    const filled: Record<number, number> = {};
    QUESTIONS.forEach(q => {
      if (scoreType === 'high') {
        filled[q.id] = 4;
      } else if (scoreType === 'low') {
        filled[q.id] = 1;
      } else {
        // Random mixed
        filled[q.id] = Math.floor(Math.random() * 4) + 1;
      }
    });
    setAnswers(filled);
    setIsCompleted(true);
  };

  // Compute results
  const computePillarScores = (): Record<string, PillarScore> => {
    const results: Record<string, { total: number; count: number; label: string; desc: string }> = {
      love_maps: { total: 0, count: 0, label: "Build Love Maps", desc: "Understanding your partner's inner world, dreams, and worries." },
      fondness: { total: 0, count: 0, label: "Fondness & Admiration", desc: "Mutual appreciation, validation, and respect." },
      turning_towards: { total: 0, count: 0, label: "Turning Towards", desc: "Engaging with and responding to bids for attention." },
      positive_perspective: { total: 0, count: 0, label: "Positive Perspective", desc: "Assuming positive intent and feeling optimistic about the bond." },
      manage_conflict: { total: 0, count: 0, label: "Manage Conflict", desc: "Productive dialogue, softened start-ups, and self-soothing." },
      dreams: { total: 0, count: 0, label: "Make Dreams Come True", desc: "Encouraging and clearing paths for each other's aspirations." },
      shared_meaning: { total: 0, count: 0, label: "Create Shared Meaning", desc: "Rituals, legacy, and shared values in the relationship." }
    };

    QUESTIONS.forEach(q => {
      const val = answers[q.id] || 2; // Default to neutral if missing
      results[q.pillar].total += val;
      results[q.pillar].count += 1;
    });

    const advices: Record<string, { advice: string; exercise: string }> = {
      love_maps: {
        advice: "Your psychological blueprint of each other is fading or outdated. Daily transitions and work stress pull your focus away. Intentionally refresh your knowledge of each other.",
        exercise: "Ask 3 open-ended questions tonight: e.g., 'What is currently your most stressful project?', 'What are you looking forward to this summer?', or 'How can I support you best tomorrow?'"
      },
      fondness: {
        advice: "A low score warns of resentment creep or taking each other for granted. Negativity dominates our brain's defaults unless actively balanced with praise.",
        exercise: "Practice the 3-Step Appreciation challenge. Daily, say to your partner: 'I noticed you [action], I appreciate that about you because [reason], and it makes me feel [feeling].'"
      },
      turning_towards: {
        advice: "Bids for attention are being missed or ignored, creating cumulative attachment loneliness. Intimacy decays when we consistently face away from micro-connection attempts.",
        exercise: "Complete a 'Phone-Down Check-in'. When your spouse speaks to you, turn your torso entirely, make eye contact, and respond with a nod or short sentence for at least 10 minutes."
      },
      positive_perspective: {
        advice: "You may be trapped in 'negative sentiment override,' where even neutral comments are perceived as criticism. Restoring this requires rebuilding the emotional bank account.",
        exercise: "Focus on micro-deposits. Perform 3 small 'Acts of Love' over the next 48 hours without being asked, and without expecting immediate praise."
      },
      manage_conflict: {
        advice: "Arguments may start with harsh startup or quickly escalate into flooded states. Remember, you cannot resolve conflicts intelligently when your heart rate exceeds 100 BPM.",
        exercise: "Establish a '20-Minute Flooding Break' rule. If an argument starts to feel overwhelming, say 'I am feeling too flooded to hear you clearly. I need a 20-minute break to calm down, and then I promise we will finish this discussion.'"
      },
      dreams: {
        advice: "Your relationship might feel functional but dry, lacking shared excitement for individual growth. Support is crucial for personal autonomy.",
        exercise: "Run a 'Dreams & Goals Interview'. Ask each other: 'What is one personal hobby or business dream you have put on hold? How can we align our schedule to support you in doing it?'"
      },
      shared_meaning: {
        advice: "You may lack comforting relationship anchors or reliable rituals. Shared meaning provides security and buffers external family stress.",
        exercise: "Design a new connection covenant. Agree to a simple, weekly 'No-Screen Sunday Morning Ritual' (like coffee on the porch or a shared board game) that you execute unconditionally."
      }
    };

    const formatted: Record<string, PillarScore> = {};
    Object.keys(results).forEach(key => {
      const r = results[key];
      const maxPossible = r.count * 4;
      const pct = Math.round((r.total / maxPossible) * 100);
      formatted[key] = {
        score: r.total,
        pct,
        label: r.label,
        description: r.desc,
        advice: advices[key].advice,
        exercise: advices[key].exercise
      };
    });

    return formatted;
  };

  const scores = isCompleted ? computePillarScores() : {};
  
  // Calculate average percentage of Sound Relationship House
  const overallPct = isCompleted 
    ? Math.round(Object.values(scores).reduce((sum, current) => sum + current.pct, 0) / 7)
    : 0;

  // Formulate general relationship health verdict
  const getOverallVerdict = () => {
    if (overallPct >= 80) return {
      title: "Resilient & Warm Alliance",
      desc: "Your Sound Relationship House has strong foundations! Trust and connection are active. Your focus should be on fine-tuning and preserving these daily rituals.",
      color: "text-green-600"
    };
    if (overallPct >= 50) return {
      title: "Cooperative but Vulnerable",
      desc: "Your foundations are functional, but friction points (such as conflict management or missed bids) are creating a slow emotional leak. Implementing intentional Gottman practices will bolster your walls.",
      color: "text-amber-600"
    };
    return {
      title: "High-Friction or Silent Strain",
      desc: "Your house is experiencing flooding or erosion. Daily appreciation is low, or conflicts escalate rapidly into stonewalling. Rebuilding step-by-step from Love Maps up is urgent to secure your bond.",
      color: "text-red-500"
    };
  };

  const verdict = isCompleted ? getOverallVerdict() : null;

  // Options for answering
  const OPTIONS = [
    { value: 4, text: "Strongly Agree", bg: "hover:bg-green-50 hover:border-green-400 text-green-700" },
    { value: 3, text: "Agree", bg: "hover:bg-emerald-50 hover:border-emerald-300 text-emerald-800" },
    { value: 2, text: "Disagree", bg: "hover:bg-amber-50 hover:border-amber-300 text-amber-700" },
    { value: 1, text: "Strongly Disagree", bg: "hover:bg-red-50 hover:border-red-400 text-red-600" }
  ];

  const pctProgress = Math.round(((currentIdx) / totalQuestions) * 100);

  return (
    <div className="flex flex-col gap-4 text-[#4B4B4B] w-full max-w-md mx-auto">
      
      {!isCompleted ? (
        /* QUIZ ACTIVE VIEW */
        <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4">
          
          {/* Header Progress indicator */}
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-on-surface-variant/80">
            <span>Sound Relationship Assessment</span>
            <span>{currentIdx + 1} / {totalQuestions}</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${pctProgress}%` }}
            />
          </div>

          {/* Clinical Pillar Tag */}
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/10">
              Pillar: {currentQuestion.pillarLabel}
            </span>
            <span className="text-[8px] font-mono text-on-surface-variant font-bold uppercase">
              Gottman Method
            </span>
          </div>

          {/* Question Text */}
          <div className="min-h-[70px] flex flex-col justify-center my-1">
            <p className="font-sans font-black text-[13.5px] text-[#4B4B4B] leading-snug">
              "{currentQuestion.text}"
            </p>
            <p className="font-sans text-[9px] text-on-surface-variant mt-1.5 leading-relaxed italic">
              Evaluating: {currentQuestion.pillarDescription}
            </p>
          </div>

          {/* Choices Options list */}
          <div className="flex flex-col gap-2 pt-2">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelectChoice(opt.value)}
                className={`w-full text-left bg-slate-50 border-2 border-outline-variant px-4 py-3 rounded-xl font-sans font-black text-xs transition-all cursor-pointer ${opt.bg} active:scale-[0.98]`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {/* Bottom Nav actions */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className={`text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border ${currentIdx === 0 ? 'opacity-30 cursor-not-allowed text-slate-400' : 'text-on-surface-variant hover:bg-slate-50 cursor-pointer'}`}
            >
              ← Back
            </button>

            {/* Quick-fill button for testing convenience */}
            <button
              type="button"
              onClick={() => handleQuickFill('mixed')}
              className="text-[8px] font-black uppercase text-slate-400 hover:text-primary transition-colors cursor-pointer"
              title="Skip & Auto-fill Assessment with sample results"
            >
              ⚡ Fast Demo Mode
            </button>
          </div>
        </div>
      ) : (
        /* QUIZ RESULTS REPORT VIEW */
        <div className="flex flex-col gap-4 animate-fade-in">
          
          {/* Main Summary Panel */}
          <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4 text-center">
            
            {/* Visual House Score Icon */}
            <div className="relative inline-block mx-auto mt-2">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/10 flex items-center justify-center text-3xl">
                🏠
              </div>
              <span className="absolute -bottom-2 -right-2 bg-amber-500 border-2 border-white text-white font-mono font-black text-[10px] px-2 py-0.5 rounded-full shadow">
                {overallPct}% Health
              </span>
            </div>

            <div>
              <h3 className="font-display font-black text-sm text-[#4B4B4B] uppercase tracking-wide leading-tight">
                Assessment Outcome
              </h3>
              <h4 className={`font-sans font-black text-md mt-1 ${verdict?.color}`}>
                {verdict?.title}
              </h4>
              <p className="font-sans text-[10.5px] text-on-surface-variant leading-relaxed mt-2.5 px-2">
                {verdict?.desc}
              </p>
            </div>

            {/* Relationship Health Meter */}
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
              <div className="flex justify-between items-center text-[9px] font-black uppercase text-on-surface-variant mb-1">
                <span>Sound Relationship Index</span>
                <span>{overallPct} / 100</span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden relative shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500 rounded-full transition-all duration-1000"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <span className="text-[8px] font-bold text-on-surface-variant/75 block mt-1">
                Measured across all 7 levels of John Gottman's SRH paradigm
              </span>
            </div>
          </div>

          {/* DYNAMIC SOUND RELATIONSHIP HOUSE (Visual Stack) */}
          <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-sm flex flex-col gap-3">
            <div className="text-center border-b border-slate-100 pb-2">
              <h4 className="font-display font-black text-[10px] uppercase tracking-wider text-on-surface-variant flex items-center justify-center gap-1">
                <Layers className="w-4 h-4 text-primary animate-pulse" />
                <span>Your Relationship House Blueprint</span>
              </h4>
              <p className="font-sans text-[8.5px] text-on-surface-variant/75 mt-0.5">Click any floor to view diagnosis and homework exercise</p>
            </div>

            {/* Visual House Slices representing pillars */}
            <div className="flex flex-col gap-1.5 pt-2 max-w-[280px] mx-auto w-full relative">
              
              {/* Roof */}
              <div className="w-0 h-0 border-l-[140px] border-l-transparent border-r-[140px] border-r-transparent border-b-[40px] border-b-slate-700 mx-auto relative mb-1">
                <span className="absolute top-[18px] left-1/2 -translate-x-1/2 font-display font-black text-[8px] text-white tracking-widest uppercase">
                  SHARED MEANING
                </span>
              </div>

              {/* Stacked Pillars */}
              {[
                { key: 'shared_meaning', label: 'Create Shared Meaning', level: 7 },
                { key: 'dreams', label: 'Make Dreams Come True', level: 6 },
                { key: 'manage_conflict', label: 'Manage Conflict', level: 5 },
                { key: 'positive_perspective', label: 'Positive Perspective', level: 4 },
                { key: 'turning_towards', label: 'Turn Towards Bids', level: 3 },
                { key: 'fondness', label: 'Fondness & Admiration', level: 2 },
                { key: 'love_maps', label: 'Build Love Maps', level: 1 }
              ].map((floor) => {
                const s = scores[floor.key];
                if (!s) return null;
                
                // Color mapping based on score percentage
                let colorClass = 'bg-red-500 text-white border-red-600';
                if (s.pct >= 80) colorClass = 'bg-green-500 text-white border-green-600';
                else if (s.pct >= 50) colorClass = 'bg-amber-500 text-white border-amber-600';

                return (
                  <div
                    key={floor.key}
                    className={`border-b-4 text-center py-2.5 rounded-lg cursor-pointer hover:brightness-105 active:scale-98 transition-all font-display font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center justify-between px-3 ${colorClass}`}
                    onClick={() => {
                      // Scroll to specific diagnostic section
                      const el = document.getElementById(`pillar-card-${floor.key}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  >
                    <span>Lvl {floor.level}: {floor.label}</span>
                    <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-[8px]">{s.pct}%</span>
                  </div>
                );
              })}

              {/* Foundations (Trust / Commitment) */}
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                <div className="bg-slate-700 text-white border-b-4 border-slate-900 py-1.5 rounded text-center font-display font-black text-[8px] uppercase tracking-widest shadow-xs">
                  TRUST
                </div>
                <div className="bg-slate-700 text-white border-b-4 border-slate-900 py-1.5 rounded text-center font-display font-black text-[8px] uppercase tracking-widest shadow-xs">
                  COMMITMENT
                </div>
              </div>
            </div>
          </div>

          {/* INDIVIDUAL PILLAR ANALYSES & ACTIONS */}
          <div className="flex flex-col gap-3.5 mt-2">
            <h4 className="font-display font-black text-[10px] uppercase tracking-widest text-on-surface-variant px-1">
              Detailed Diagnostic Breakdown & Exercises
            </h4>

            {Object.keys(scores).map((key) => {
              const s = scores[key];
              
              let badgeColor = 'bg-red-50 border-red-100 text-red-600';
              let statusLabel = 'Critical Rebuild Needed';
              if (s.pct >= 80) {
                badgeColor = 'bg-green-50 border-green-100 text-green-700';
                statusLabel = 'Robust & Thriving';
              } else if (s.pct >= 50) {
                badgeColor = 'bg-amber-50 border-amber-100 text-amber-700';
                statusLabel = 'Vulnerable - Needs Fortification';
              }

              return (
                <div
                  id={`pillar-card-${key}`}
                  key={key}
                  className="bg-white border-2 border-outline-variant p-4.5 rounded-[2rem] shadow-sm flex flex-col gap-3 scroll-mt-6 hover:border-slate-300 transition-all"
                >
                  {/* Title Row */}
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <div>
                      <h4 className="font-display font-black text-xs text-[#4B4B4B]">{s.label}</h4>
                      <p className="font-sans text-[8px] text-on-surface-variant mt-0.5">{s.description}</p>
                    </div>
                    <span className={`text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}>
                      {statusLabel} ({s.pct}%)
                    </span>
                  </div>

                  {/* Diagnosis */}
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[9.5px] leading-relaxed text-[#4B4B4B]">
                    <strong className="text-[7.5px] font-black uppercase tracking-wider text-on-surface-variant block mb-1">Clinical Assessment:</strong>
                    {s.advice}
                  </div>

                  {/* Homework exercise */}
                  <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl text-[10px] leading-relaxed text-[#4B4B4B] flex gap-2.5 items-start">
                    <span className="text-lg mt-0.5">🛠️</span>
                    <div>
                      <strong className="text-[10px] text-primary block uppercase tracking-wider font-display font-black">Active Homework Exercise:</strong>
                      <p className="font-sans mt-0.5 text-on-surface-variant text-[9.5px] leading-relaxed">
                        {s.exercise}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Restart Assessment Button */}
          <div className="flex gap-2 justify-center mt-3 mb-6">
            <button
              onClick={handleReset}
              className="bg-primary text-white font-display font-black py-2.5 px-6 rounded-xl text-[10px] uppercase tracking-wider border-b-[4px] border-primary-dark hover:brightness-105 active:translate-y-[2px] active:border-b-[2px] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Assessment</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
