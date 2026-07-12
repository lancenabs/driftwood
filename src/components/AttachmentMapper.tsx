import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  HelpCircle, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  GitMerge, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Info,
  User,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: string;
  text: string;
  dimension: 'anxiety' | 'avoidance';
}

const QUIZ_QUESTIONS: Question[] = [
  { id: 'q1', text: "I often worry that my partner will lose interest or stop loving me.", dimension: 'anxiety' },
  { id: 'q2', text: "I feel highly anxious or panicky when my partner doesn't respond quickly.", dimension: 'anxiety' },
  { id: 'q3', text: "I crave extreme closeness but worry that I want more than my partner does.", dimension: 'anxiety' },
  { id: 'q4', text: "I prefer self-reliance and feel uncomfortable depending fully on others.", dimension: 'avoidance' },
  { id: 'q5', text: "When relationship tensions arise, my first reflex is to shut down or withdraw.", dimension: 'avoidance' },
  { id: 'q6', text: "It feels difficult or unsafe to share my deepest vulnerabilities openly.", dimension: 'avoidance' }
];

export default function AttachmentMapper({ onBack }: { onBack?: () => void }) {
  // SCORE STATES (0 to 100)
  // The Mooring Lines persist (driftwood_moorings_v1) — a map this hard-won
  // doesn't evaporate on close.
  const mooringsSaved = (() => {
    try { return JSON.parse(localStorage.getItem('driftwood_moorings_v1') || 'null') || {}; }
    catch { return {}; }
  })();
  const [selfAnxiety, setSelfAnxiety] = useState<number>(mooringsSaved.selfAnxiety ?? 35);
  const [selfAvoidance, setSelfAvoidance] = useState<number>(mooringsSaved.selfAvoidance ?? 30);
  const [partnerAnxiety, setPartnerAnxiety] = useState<number>(mooringsSaved.partnerAnxiety ?? 65);
  const [partnerAvoidance, setPartnerAvoidance] = useState<number>(mooringsSaved.partnerAvoidance ?? 70);

  // VIEW MODE: 'manual' or 'quiz'
  const [mode, setMode] = useState<'manual' | 'quiz'>('manual');
  
  // QUIZ STATE
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizTarget, setQuizTarget] = useState<'self' | 'partner'>('self');

  // SELECTED NODE FOR DETAILS
  const [selectedNode, setSelectedNode] = useState<'self' | 'partner' | 'dance'>('dance');
  // only on REAL change (completion-law key, 2026-07-12; value comparison
  // because StrictMode double-fires effects)
  const mooringsInitial = React.useRef(JSON.stringify([selfAnxiety, selfAvoidance, partnerAnxiety, partnerAvoidance]));
  React.useEffect(() => {
    const sig = JSON.stringify([selfAnxiety, selfAvoidance, partnerAnxiety, partnerAvoidance]);
    if (sig === mooringsInitial.current) return;
    try {
      localStorage.setItem('driftwood_moorings_v1', JSON.stringify({
        selfAnxiety, selfAvoidance, partnerAnxiety, partnerAvoidance, at: new Date().toISOString(),
      }));
    } catch { /* ignore */ }
  }, [selfAnxiety, selfAvoidance, partnerAnxiety, partnerAvoidance]);

  // RESET QUIZ
  const handleStartQuiz = (target: 'self' | 'partner') => {
    setQuizTarget(target);
    setCurrentQuizIndex(0);
    setQuizAnswers({});
    setQuizCompleted(false);
    setMode('quiz');
  };

  // HANDLE QUIZ ANSWER (1 to 5 Likert Scale: Strongly Disagree to Strongly Agree)
  const handleAnswerQuiz = (score: number) => {
    const question = QUIZ_QUESTIONS[currentQuizIndex];
    const updatedAnswers = { ...quizAnswers, [question.id]: score };
    setQuizAnswers(updatedAnswers);

    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      // Calculate final scores based on answers
      let anxietySum = 0;
      let avoidSum = 0;
      let anxietyCount = 0;
      let avoidCount = 0;

      QUIZ_QUESTIONS.forEach(q => {
        const val = updatedAnswers[q.id] || 3; // default to neutral
        // map 1-5 scale to 10-90 score
        const normalizedVal = ((val - 1) / 4) * 100;
        if (q.dimension === 'anxiety') {
          anxietySum += normalizedVal;
          anxietyCount++;
        } else {
          avoidSum += normalizedVal;
          avoidCount++;
        }
      });

      const finalAnxiety = Math.round(anxietySum / anxietyCount);
      const finalAvoidance = Math.round(avoidSum / avoidCount);

      if (quizTarget === 'self') {
        setSelfAnxiety(finalAnxiety);
        setSelfAvoidance(finalAvoidance);
      } else {
        setPartnerAnxiety(finalAnxiety);
        setPartnerAvoidance(finalAvoidance);
      }

      setQuizCompleted(true);
      setTimeout(() => {
        setMode('manual');
        setSelectedNode(quizTarget);
      }, 1500);
    }
  };

  // GET ATTACHMENT STYLE CLASSIFICATION BASED ON ANX & AVOID
  const getStyle = (anx: number, avoid: number) => {
    if (anx >= 50 && avoid >= 50) {
      return {
        name: "Fearful-Avoidant / Disorganized",
        short: "Fearful-Avoidant",
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-200",
        bulletColor: "bg-red-500",
        emoji: "🌪️",
        tagline: "High Anxiety & High Avoidance",
        desc: "Deeply craves intimate connection but fears betrayal or rejection. Oscillates between chasing closeness and pushing away in self-protection when feeling vulnerable."
      };
    } else if (anx >= 50 && avoid < 50) {
      return {
        name: "Anxious-Preoccupied",
        short: "Anxious-Preoccupied",
        color: "text-orange-500",
        bg: "bg-orange-50",
        border: "border-orange-200",
        bulletColor: "bg-orange-500",
        emoji: "🥺",
        tagline: "High Anxiety & Low Avoidance",
        desc: "Hyper-vigilant to signs of distance or abandonment. Craves constant reassurance, frequently using protesting strategies to re-establish proximity and connection."
      };
    } else if (anx < 50 && avoid >= 50) {
      return {
        name: "Dismissive-Avoidant",
        short: "Dismissive-Avoidant",
        color: "text-blue-500",
        bg: "bg-blue-50",
        border: "border-blue-200",
        bulletColor: "bg-blue-500",
        emoji: "🛡️",
        tagline: "Low Anxiety & High Avoidance",
        desc: "Highly values absolute self-reliance, equating vulnerability with weakness. Tends to deactivate feelings or shut down communication when relational pressure climbs."
      };
    } else {
      return {
        name: "Secure Anchor",
        short: "Secure",
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        bulletColor: "bg-emerald-500",
        emoji: "⚓",
        tagline: "Low Anxiety & Low Avoidance",
        desc: "Comfortable with deep vulnerability and healthy autonomy. Capable of communicating needs constructively and providing a stable, reassuring safe haven for others."
      };
    }
  };

  const selfStyle = getStyle(selfAnxiety, selfAvoidance);
  const partnerStyle = getStyle(partnerAnxiety, partnerAvoidance);

  // DETECT DYNAMIC RELATIONSHIP DANCE
  const getAttachmentDance = () => {
    const isSelfAnx = selfAnxiety >= 50 && selfAvoidance < 50;
    const isSelfAvoid = selfAnxiety < 50 && selfAvoidance >= 50;
    const isSelfFear = selfAnxiety >= 50 && selfAvoidance >= 50;
    const isSelfSec = selfAnxiety < 50 && selfAvoidance < 50;

    const isPartAnx = partnerAnxiety >= 50 && partnerAvoidance < 50;
    const isPartAvoid = partnerAnxiety < 50 && partnerAvoidance >= 50;
    const isPartFear = partnerAnxiety >= 50 && partnerAvoidance >= 50;
    const isPartSec = partnerAnxiety < 50 && partnerAvoidance < 50;

    // Cases
    if ((isSelfAnx && isPartAvoid) || (isSelfAvoid && isPartAnx)) {
      return {
        title: "The Pursuer-Distancer Loop (The Classic Dance)",
        emoji: "🔄",
        desc: "One partner protests for closeness, triggering the other's threat alarm to pull away for space. This withdrawal triggers the pursuer's panic, accelerating the chase-and-retreat cycle.",
        somaticSolution: "The pursuer pauses protesting and practices self-soothing breathing; the distancer steps forward 5% to offer a silent validation like 'I am here, and we are safe.'",
        advice: [
          "Pursuer: Notice the physical activation. Instead of demanding, state your vulnerability simply: 'I'm feeling a bit disconnected and scared right now.'",
          "Distancer: Reassure the pursuer before taking quiet time. Say: 'I love you, but my system is overwhelmed. I need 10 minutes, but I promise to return and talk.'"
        ]
      };
    }

    if (isSelfSec && isPartSec) {
      return {
        title: "Secure Co-Regulation Resonance",
        emoji: "⚓✨⚓",
        desc: "Both systems are naturally wired for healthy attachment. High trust allows swift, gentle repairs when minor friction occurs, balancing connection and private self-hood easily.",
        somaticSolution: "Practice celebratory appreciation. Validate each other's actions explicitly once per day to secure the foundation.",
        advice: [
          "Continue checking in. Keep up your morning coffee check-ins and Gottman 6-second kisses.",
          "Guard against passive drift. Secure couples can sometimes slip into comfortable 'co-existence'—keep the spark intentional."
        ]
      };
    }

    if ((isSelfSec && isPartAnx) || (isSelfAnx && isPartSec)) {
      const anxiousPart = isSelfAnx ? 'You' : 'Your partner';
      const securePart = isSelfSec ? 'You' : 'Your partner';
      return {
        title: "The Secure-Anxious Anchorage",
        emoji: "⚓❤️🥺",
        desc: `A highly growth-oriented dynamic. The anxious system (${anxiousPart}) gains a reliable safe haven, while the secure system (${securePart}) acts as a consistent buffer, validating anxiety without activating or taking the protest actions personally.`,
        somaticSolution: "Establish explicit micro-checkpoints. The secure partner initiates pre-emptive validation to satisfy the anxious partner's security cravings.",
        advice: [
          "Anxious Partner: Trust the secure anchor's consistency. When you feel a surge of panic, pause and count to 10 before texting or pursuing.",
          "Secure Partner: Practice pre-emptive connection. A surprise warm text or unexpected hug blocks the anxious protest sequence entirely."
        ]
      };
    }

    if ((isSelfSec && isPartAvoid) || (isSelfAvoid && isPartSec)) {
      const avoidPart = isSelfAvoid ? 'You' : 'Your partner';
      const securePart = isSelfSec ? 'You' : 'Your partner';
      return {
        title: "The Secure-Avoidant Bridge",
        emoji: "⚓❤️🛡️",
        desc: `A gentle learning path. The avoidant system (${avoidPart}) is invited into safe vulnerability without feeling smothered or criticized, supported by the secure partner's (${securePart}) comfortable boundaries and calm patience.`,
        somaticSolution: "Create parallel comfortable activities where no heavy talking is required, gradually practicing casual emotional check-ins.",
        advice: [
          "Avoidant Partner: Practice stepping out of the shell incrementally. Sharing even a 5% sliver of your inner landscape builds safety.",
          "Secure Partner: Avoid pushing for dramatic confessions. Grant generous autonomy while keeping a warm, open posture."
        ]
      };
    }

    if (isSelfAvoid && isPartAvoid) {
      return {
        title: "The Parallel Autonomy Trap (Vigilant Disconnect)",
        emoji: "🛡️🧘🛡️",
        desc: "Both partners value absolute independence above all. Conflict is rare because both deactivate and pull away to handle issues alone, risking slow emotional starvation and cold roommate syndrome.",
        somaticSolution: "Engage in synchronized co-op sensory activities (e.g., sharing a resonant breath, cooking a meal side-by-side with no devices).",
        advice: [
          "Acknowledge the silence. It is easy to interpret lack of fighting as harmony, when it may actually represent mutual emotional check-out.",
          "Set structured checkpoints. Dedicate 15 minutes once a week specifically for emotional transparency to prevent total parallel drift."
        ]
      };
    }

    // Default or Fearful cases
    return {
      title: "The Push-Pull Churning Storm",
      emoji: "🌪️",
      desc: "An intense, high-octane dynamic where fear of abandonment and fear of engulfment collide. Desires for intimacy are rapidly followed by defensive spikes of hyper-criticism or withdrawal.",
      somaticSolution: "Focus strictly on physiological grounding. Stop all complex conversations when heart rates climb, returning only once both systems are co-regulated.",
      advice: [
        "Commit to strict 20-minute physical time-outs when arguments heat up. Use deep belly breathing or cold water splashes.",
        "Recognize that the instinct to push away is a trauma response, not proof of lack of love. Call it out gently: 'I love you, but my system is flooded.'"
      ]
    };
  };

  const dance = getAttachmentDance();

  return (
    <div className="flex flex-col gap-5 text-[#4B4B4B] animate-fade-in" id="attachment-mapper-interactive-widget">
      
      {/* HEADER ROW */}
      <div className="bg-gradient-to-r from-primary via-indigo-600 to-indigo-950 text-white p-5 rounded-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner relative shrink-0">
              <span>🧬</span>
            </div>
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1">
                <GitMerge size={9} /> PSYCHOBIOLOGICAL ATTACHMENT PORTAL
              </span>
              <h3 className="font-display font-black text-sm text-white mt-0.5 leading-tight">
                Attachment Style Dynamic Mapper
              </h3>
              <p className="text-[10px] text-slate-200 font-sans mt-0.5 max-w-[420px] leading-relaxed">
                Map your autonomic attachment signatures in real-time. Unmask the invisible "Somatic Dance" driving connection, pursuit, and retreat.
              </p>
            </div>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-[9px] font-display font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/10 transition cursor-pointer shrink-0 text-white"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* RENDER QUIZ OR MANUAL DECK */}
      {mode === 'quiz' ? (
        <div className="bg-white p-5 rounded-[2.5rem] border-2 border-stone-200 shadow-md flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📝</span>
              <span className="font-display font-black text-[10px] text-stone-800 uppercase tracking-wide">
                Interactive Micro-Assessment: {quizTarget === 'self' ? 'Yourself' : "Your Partner"}
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {currentQuizIndex + 1} / {QUIZ_QUESTIONS.length}
            </span>
          </div>

          {quizCompleted ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-4 animate-scale-in">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-display font-black text-xs text-stone-800 uppercase tracking-wide">Autonomic Profile Calibrated!</h4>
                <p className="font-sans text-[10px] text-stone-500 mt-1 leading-relaxed">
                  Mapping computed scores back into the attachment quadrant plot...
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-fade-in">
              {/* Question card */}
              <div className="bg-slate-50 border border-stone-200 rounded-2xl p-4 min-h-[90px] flex items-center justify-center">
                <p className="font-sans text-[11px] font-bold text-center leading-relaxed text-stone-800">
                  "{QUIZ_QUESTIONS[currentQuizIndex].text}"
                </p>
              </div>

              {/* Likert Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-[8px] font-black uppercase text-stone-400 text-center tracking-wider block mb-1">
                  How accurate is this description?
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { val: 1, label: "Strongly Disagree", color: "hover:bg-red-50 hover:border-red-400" },
                    { val: 2, label: "Disagree", color: "hover:bg-red-50/50 hover:border-red-300" },
                    { val: 3, label: "Neutral", color: "hover:bg-stone-50 hover:border-stone-300" },
                    { val: 4, label: "Agree", color: "hover:bg-emerald-50/50 hover:border-emerald-300" },
                    { val: 5, label: "Strongly Agree", color: "hover:bg-emerald-50 hover:border-emerald-400" }
                  ].map((option) => (
                    <button
                      key={option.val}
                      onClick={() => handleAnswerQuiz(option.val)}
                      className={`py-2 px-1 rounded-xl border-2 border-stone-200 bg-white font-sans text-[8px] font-bold leading-normal transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-stone-600 ${option.color}`}
                    >
                      <span className="text-xs">{option.val}</span>
                      <span className="text-center scale-[0.9] origin-center font-medium leading-none max-w-full truncate">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Bar inside quiz */}
              <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300" 
                  style={{ width: `${((currentQuizIndex) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          
          {/* TWO COLUMN GRID: PLOT + CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* QUADRANT PLOT CANVAS (7 cols) */}
            <div className="md:col-span-7 bg-white p-4 rounded-[2.5rem] border-2 border-stone-200 shadow-sm flex flex-col justify-between">
              
              <div className="flex justify-between items-center border-b border-stone-100 pb-2 mb-2">
                <div>
                  <span className="text-[8px] font-mono text-indigo-500 font-bold uppercase tracking-wider">Attachment Quadrant</span>
                  <h4 className="font-display font-black text-xs text-stone-800 uppercase tracking-tight">Somatic Map Space</h4>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleStartQuiz('self')}
                    className="text-[8.5px] font-black uppercase text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200 transition cursor-pointer"
                  >
                    📝 Quiz Me
                  </button>
                  <button
                    onClick={() => handleStartQuiz('partner')}
                    className="text-[8.5px] font-black uppercase text-pink-600 hover:bg-pink-50 px-2 py-1 rounded-lg border border-pink-200 transition cursor-pointer"
                  >
                    📝 Quiz Partner
                  </button>
                </div>
              </div>

              {/* THE GRID CANVAS PLOT */}
              <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-slate-50 border-2 border-stone-300 rounded-3xl overflow-hidden mt-2 mb-3">
                
                {/* Quadrant backgrounds */}
                {/* Top-Left: Anxious */}
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-orange-50/20 flex items-center justify-center pointer-events-none border-r border-b border-stone-200/50">
                  <span className="absolute top-2 left-2 text-[7.5px] font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">🥺 Anxious Preoccupied</span>
                </div>
                {/* Top-Right: Fearful */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-50/20 flex items-center justify-center pointer-events-none border-b border-stone-200/50">
                  <span className="absolute top-2 right-2 text-[7.5px] font-black text-red-600 uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded border border-red-200">🌪️ Fearful Avoidant</span>
                </div>
                {/* Bottom-Left: Secure */}
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-emerald-50/20 flex items-center justify-center pointer-events-none border-r border-stone-200/50">
                  <span className="absolute bottom-2 left-2 text-[7.5px] font-black text-emerald-600 uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">⚓ Secure Anchor</span>
                </div>
                {/* Bottom-Right: Dismissive */}
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-50/20 flex items-center justify-center pointer-events-none">
                  <span className="absolute bottom-2 right-2 text-[7.5px] font-black text-blue-600 uppercase tracking-wider bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">🛡️ Dismissive Avoidant</span>
                </div>

                {/* AXIS LABELS */}
                {/* Vertical axis: Anxiety */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-stone-300/80 -translate-x-1/2" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[7.5px] font-black uppercase text-stone-400 tracking-widest pointer-events-none">
                  ← LOW ANXIETY • HIGH ANXIETY →
                </div>

                {/* Horizontal axis: Avoidance */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-300/80 -translate-y-1/2" />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[7.5px] font-black uppercase text-stone-400 tracking-widest pointer-events-none">
                  ← LOW AVOIDANCE • HIGH AVOIDANCE →
                </div>

                {/* RELATIONSHIP DANCE CONNECTOR LINE */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <line 
                    x1={`${selfAvoidance}%`} 
                    y1={`${100 - selfAnxiety}%`} 
                    x2={`${partnerAvoidance}%`} 
                    y2={`${100 - partnerAnxiety}%`} 
                    stroke="rgba(99, 102, 241, 0.4)" 
                    strokeWidth="2" 
                    strokeDasharray="4 3" 
                  />
                  {/* Glowing intersection node helper */}
                  <circle 
                    cx={`${(selfAvoidance + partnerAvoidance) / 2}%`} 
                    cy={`${100 - (selfAnxiety + partnerAnxiety) / 2}%`} 
                    r="4" 
                    fill="#6366F1" 
                    opacity="0.7"
                  />
                </svg>

                {/* INTERACTION DOT: SELF */}
                <motion.div 
                  animate={{ x: `${selfAvoidance}%`, y: `${100 - selfAnxiety}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                  onClick={() => setSelectedNode('self')}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white z-20 cursor-pointer hover:scale-110 transition-transform"
                  title="You"
                >
                  <span className="text-[10px] font-black">You</span>
                </motion.div>

                {/* INTERACTION DOT: PARTNER */}
                <motion.div 
                  animate={{ x: `${partnerAvoidance}%`, y: `${100 - partnerAnxiety}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                  onClick={() => setSelectedNode('partner')}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg border-2 border-white z-20 cursor-pointer hover:scale-110 transition-transform"
                  title="Partner"
                >
                  <span className="text-[10px] font-black">Part</span>
                </motion.div>

                {/* Dance mid-anchor float tooltip label */}
                <div 
                  className="absolute p-1 bg-indigo-900/90 text-white border border-white/20 rounded-lg text-[7px] font-black uppercase tracking-wider backdrop-blur-xs z-10 pointer-events-none shadow-sm -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `${(selfAvoidance + partnerAvoidance) / 2}%`, 
                    top: `${100 - (selfAnxiety + partnerAnxiety) / 2 + 6}%` 
                  }}
                >
                  The Dance Core
                </div>

              </div>

              {/* PLOT KEY STATS BAR */}
              <div className="bg-slate-50 border border-stone-200 rounded-2xl p-2.5 flex justify-between gap-2 text-[9px] font-sans">
                <div className="flex flex-col">
                  <span className="font-bold text-indigo-600 flex items-center gap-1">
                    <User size={10} /> Your Style:
                  </span>
                  <span className="font-extrabold text-stone-800">{selfStyle.name} {selfStyle.emoji}</span>
                </div>
                <div className="border-r border-stone-200" />
                <div className="flex flex-col items-end">
                  <span className="font-bold text-pink-500 flex items-center gap-1">
                    Partner's Style: <Users size={10} />
                  </span>
                  <span className="font-extrabold text-stone-800">{partnerStyle.emoji} {partnerStyle.name}</span>
                </div>
              </div>

            </div>

            {/* CONTROLS SLIDERS DECK (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-4">
              
              <div className="bg-white p-4.5 rounded-[2.2rem] border-2 border-stone-200 shadow-sm flex flex-col gap-4">
                <h4 className="font-display font-black text-xs text-stone-800 uppercase tracking-tight flex items-center gap-1.5 border-b border-stone-100 pb-2">
                  <Sliders size={13} className="text-primary" /> Attachment Sizing Deck
                </h4>

                {/* SELF CONTROLS */}
                <div className="flex flex-col gap-2.5 bg-indigo-50/45 p-3 rounded-2xl border border-indigo-100">
                  <span className="text-[9px] font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={10} className="text-indigo-600" /> Your Scores:
                  </span>
                  
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[8px] font-mono text-stone-500 font-bold">
                      <span>ANXIETY: {selfAnxiety}%</span>
                      <span>{selfAnxiety >= 50 ? 'HIGH' : 'LOW'}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={selfAnxiety}
                      onChange={(e) => setSelfAnxiety(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[8px] font-mono text-stone-500 font-bold">
                      <span>AVOIDANCE: {selfAvoidance}%</span>
                      <span>{selfAvoidance >= 50 ? 'HIGH' : 'LOW'}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={selfAvoidance}
                      onChange={(e) => setSelfAvoidance(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>

                {/* PARTNER CONTROLS */}
                <div className="flex flex-col gap-2.5 bg-pink-50/45 p-3 rounded-2xl border border-pink-100">
                  <span className="text-[9px] font-black text-pink-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={10} className="text-pink-600" /> Partner's Scores:
                  </span>
                  
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[8px] font-mono text-stone-500 font-bold">
                      <span>ANXIETY: {partnerAnxiety}%</span>
                      <span>{partnerAnxiety >= 50 ? 'HIGH' : 'LOW'}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={partnerAnxiety}
                      onChange={(e) => setPartnerAnxiety(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[8px] font-mono text-stone-500 font-bold">
                      <span>AVOIDANCE: {partnerAvoidance}%</span>
                      <span>{partnerAvoidance >= 50 ? 'HIGH' : 'LOW'}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={partnerAvoidance}
                      onChange={(e) => setPartnerAvoidance(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* VIEW TAB SELECTORS */}
              <div className="flex bg-stone-100 rounded-2xl p-1 gap-1 border border-stone-200">
                <button
                  onClick={() => setSelectedNode('dance')}
                  className={`flex-1 font-display font-black text-[8px] py-1.5 rounded-xl uppercase tracking-wider text-center transition cursor-pointer ${
                    selectedNode === 'dance' ? 'bg-indigo-600 text-white' : 'text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  🔄 The Dance
                </button>
                <button
                  onClick={() => setSelectedNode('self')}
                  className={`flex-1 font-display font-black text-[8px] py-1.5 rounded-xl uppercase tracking-wider text-center transition cursor-pointer ${
                    selectedNode === 'self' ? 'bg-indigo-600 text-white' : 'text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  👤 You
                </button>
                <button
                  onClick={() => setSelectedNode('partner')}
                  className={`flex-1 font-display font-black text-[8px] py-1.5 rounded-xl uppercase tracking-wider text-center transition cursor-pointer ${
                    selectedNode === 'partner' ? 'bg-indigo-600 text-white' : 'text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  👥 Partner
                </button>
              </div>

            </div>

          </div>

          {/* LOWER ANALYSIS DETAIL BOARD */}
          <AnimatePresence mode="wait">
            {selectedNode === 'dance' && (
              <motion.div
                key="dance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-indigo-50 border-2 border-indigo-100 p-5 rounded-[2.2rem] shadow-sm flex flex-col gap-3"
              >
                <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{dance.emoji}</span>
                    <h4 className="font-display font-black text-xs text-indigo-950 uppercase tracking-wide">
                      {dance.title}
                    </h4>
                  </div>
                  <span className="text-[7.5px] font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full uppercase">Dynamic Active Dance</span>
                </div>

                <p className="font-sans text-[10.5px] leading-relaxed text-indigo-900">
                  {dance.desc}
                </p>

                <div className="bg-white/60 rounded-2xl p-3 border border-indigo-100 flex gap-2 text-[9.5px] leading-relaxed text-stone-700">
                  <span className="text-xs shrink-0">💡</span>
                  <p className="font-sans">
                    <strong>Somatic Co-Regulation Remedy:</strong> {dance.somaticSolution}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[8px] font-black uppercase text-indigo-950 tracking-wider">Clinical Guidance Advice:</span>
                  <div className="flex flex-col gap-1.5">
                    {dance.advice.map((adv, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-[10px] font-sans leading-relaxed text-stone-700">
                        <span className="text-indigo-600 font-bold shrink-0">•</span>
                        <p>{adv}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {selectedNode === 'self' && (
              <motion.div
                key="self"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`${selfStyle.bg} border-2 ${selfStyle.border} p-5 rounded-[2.2rem] shadow-sm flex flex-col gap-3`}
              >
                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{selfStyle.emoji}</span>
                    <h4 className={`font-display font-black text-xs uppercase tracking-wide ${selfStyle.color}`}>
                      Your Style: {selfStyle.name}
                    </h4>
                  </div>
                  <span className="text-[7.5px] font-mono font-bold bg-white/70 text-stone-600 px-2 py-0.5 rounded-full uppercase">{selfStyle.tagline}</span>
                </div>

                <p className="font-sans text-[10.5px] leading-relaxed text-stone-700">
                  {selfStyle.desc}
                </p>

                <div className="bg-white/75 rounded-2xl p-3 border border-stone-200/50 text-[10px] leading-relaxed text-stone-600 font-sans">
                  <strong>Clinical Sub-surface Driver:</strong> Avoidance ({selfAvoidance}%) and Anxiety ({selfAnxiety}%) parameters represent how deeply your neural system associates relational intimacy with loss of self-identity (avoidance) or threat of sudden abandonment (anxiety).
                </div>
              </motion.div>
            )}

            {selectedNode === 'partner' && (
              <motion.div
                key="partner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`${partnerStyle.bg} border-2 ${partnerStyle.border} p-5 rounded-[2.2rem] shadow-sm flex flex-col gap-3`}
              >
                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{partnerStyle.emoji}</span>
                    <h4 className={`font-display font-black text-xs uppercase tracking-wide ${partnerStyle.color}`}>
                      Partner Style: {partnerStyle.name}
                    </h4>
                  </div>
                  <span className="text-[7.5px] font-mono font-bold bg-white/70 text-stone-600 px-2 py-0.5 rounded-full uppercase">{partnerStyle.tagline}</span>
                </div>

                <p className="font-sans text-[10.5px] leading-relaxed text-stone-700">
                  {partnerStyle.desc}
                </p>

                <div className="bg-white/75 rounded-2xl p-3 border border-stone-200/50 text-[10px] leading-relaxed text-stone-600 font-sans">
                  <strong>Relational Perspective:</strong> When your partner's system triggers into defense patterns ({partnerStyle.short}), their physical heart rate and muscle tension rise automatically. Understanding this allows you to see their distance or protests as autonomic protective armor, not personal hostility.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* SECURE TELEMETRY FOOTER */}
      <div className="bg-slate-50 border border-stone-200 p-4 rounded-2xl text-[9px] text-stone-500 font-sans leading-relaxed flex gap-2">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <p>
          <strong>Attachment Mapping Insight:</strong> Attachment styles are not permanent clinical definitions; they are somatic defenses. Regular active de-escalation drills in the co-op practice gym gradually reshape anxious/avoidant alarm pathways, steering both nervous systems towards a resilient Secure Anchor dynamic.
        </p>
      </div>

    </div>
  );
}
