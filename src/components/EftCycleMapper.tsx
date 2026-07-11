import React, { useState } from 'react';
import { 
  Heart, 
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
  ArrowUpRight,
  Info,
  Trash2,
  Plus,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Static Data for EFT Mapper Wizard
const COMMON_TRIGGERS = [
  "My partner is quiet, distant, or checking their phone",
  "A discussion about chores, money, or schedule feels tense",
  "My partner sighs, uses an irritated tone, or rolls their eyes",
  "We are physically separated, and texts are brief or unanswered",
  "My partner criticizes my habits, cooking, or work",
  "I ask for help, and my partner postpones or forgets",
  "We have different preferences for intimacy or social plans"
];

const SECONDARY_BEHAVIORS_PURSUER = [
  { label: "Criticizing / Nagging", desc: "Pointing out what they did wrong or what they failed to do." },
  { label: "Demanding / Pushing", desc: "Insisting on talking right now, raising my voice to be heard." },
  { label: "Sarcasm / Sharp Comments", desc: "Using jokes or jabs to express my deep frustration." },
  { label: "Anxious Protest", desc: "Repeatedly asking 'Are you okay?', 'Why are you silent?'" },
  { label: "Analyzing / Explaining", desc: "Telling them why their behavior is unhealthy or illogical." }
];

const SECONDARY_BEHAVIORS_WITHDRAWER = [
  { label: "Stonewalling / Shutting Down", desc: "Going entirely silent, staring away, or freezing up." },
  { label: "Leaving the Room / Retreating", desc: "Physically exiting the scene to stop the tension." },
  { label: "Defensive Explaining", desc: "Giving logical excuses, citing facts, or saying 'I did nothing wrong.'" },
  { label: "Minimizing / Deflecting", desc: "Saying 'It's not a big deal', 'You are overreacting', or changing the topic." },
  { label: "Numbing / Staying Busy", desc: "Turning to work, video games, or chores to distract myself from the heat." }
];

const PRIMARY_EMOTIONS_PURSUER = [
  { label: "Scared of abandonment", desc: "Feeling like you are slipping away, and I am going to be left entirely alone." },
  { label: "Invisible / Unimportant", desc: "Feeling like I do not matter to you, like my presence has zero weight." },
  { label: "Disconnected / Lonely", desc: "Feeling a cold void, isolated in the same room with you." },
  { label: "Unworthy / Defective", desc: "Feeling that I am too much, or that I am fundamentally unlovable." },
  { label: "Helpless / Powerless", desc: "Feeling that no matter what I say, I cannot reach your heart." }
];

const PRIMARY_EMOTIONS_WITHDRAWER = [
  { label: "Fear of failure / Inadequacy", desc: "Feeling like I am constantly letting you down and will never get it right." },
  { label: "Paralyzed / Overwhelmed", desc: "Feeling flooded by intensity, like my system is shutting down to survive." },
  { label: "Rejected / Defective", desc: "Feeling like you only see my flaws and criticize everything I am." },
  { label: "Scared of disappointing you", desc: "Feeling that if I speak, I will make things worse, so I must stay quiet." },
  { label: "Invisible / Misunderstood", desc: "Feeling that my efforts go unnoticed, and my good intentions are ignored." }
];

const ATTACHMENT_NEEDS_PURSUER = [
  "Reassurance that you are still here with me and that we are okay.",
  "An explicit sign that I am important to you and that my voice matters.",
  "Your physical presence, eye contact, and undivided attention.",
  "Validation of my loneliness and fear, rather than being told I'm too dramatic.",
  "To know that you will fight for our connection and won't just walk away."
];

const ATTACHMENT_NEEDS_WITHDRAWER = [
  "Reassurance that I am not a failure in your eyes, even when I make mistakes.",
  "A safe space to compose my thoughts without being crowded or criticized.",
  "To know that you still love me and appreciate me, even when we disagree.",
  "Your patience while I slow down and try to find the right words to connect.",
  "To feel that I am safe from harsh startups and that my effort is valued."
];

interface EftCycle {
  id: string;
  title: string;
  createdAt: string;
  trigger: string;
  userRole: 'pursuer' | 'withdrawer';
  userSecondary: string;
  userPrimary: string;
  userNeed: string;
  partnerSecondary: string;
  partnerPrimary: string;
}

export default function EftCycleMapper({ onBack }: { onBack?: () => void }) {
  // Current wizard step: 0 (intro/list), 1 (Role Selection), 2 (Trigger), 3 (Secondary Behavior), 4 (Primary Emotion), 5 (Attachment Need), 6 (Partner guessing), 7 (Review & Save)
  const [step, setStep] = useState(0);

  // Active inputs
  const [cycleTitle, setCycleTitle] = useState("Dispute about dinner plans");
  const [userRole, setUserRole] = useState<'pursuer' | 'withdrawer'>('pursuer');
  const [trigger, setTrigger] = useState(COMMON_TRIGGERS[0]);
  const [customTrigger, setCustomTrigger] = useState("");
  const [userSecondary, setUserSecondary] = useState("");
  const [customSecondary, setCustomSecondary] = useState("");
  const [userPrimary, setUserPrimary] = useState("");
  const [customPrimary, setCustomPrimary] = useState("");
  const [userNeed, setUserNeed] = useState("");
  const [customNeed, setCustomNeed] = useState("");

  // Partner estimation states
  const [partnerSecondary, setPartnerSecondary] = useState("");
  const [partnerPrimary, setPartnerPrimary] = useState("");

  // Saved cycles journal
  const [savedCycles, setSavedCycles] = useState<EftCycle[]>([
    {
      id: '1',
      title: "The Weekend Cleaning Dispute",
      createdAt: "July 9, 2026",
      trigger: "My partner postpones chores to play games",
      userRole: 'pursuer',
      userSecondary: "Criticizing / Nagging (Pointing out errors)",
      userPrimary: "Invisible / Unimportant (Feeling my comfort doesn't matter)",
      userNeed: "To know that my partnership comfort is a priority to you.",
      partnerSecondary: "Stonewalling / Shutting Down (Quiet retreat)",
      partnerPrimary: "Fear of failure / Inadequacy (Feeling like a constant disappointment)"
    }
  ]);

  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);

  // Helper selectors
  const activeTrigger = trigger === 'custom' ? customTrigger : trigger;
  const activeSecondary = userSecondary === 'custom' ? customSecondary : userSecondary;
  const activePrimary = userPrimary === 'custom' ? customPrimary : userPrimary;
  const activeNeed = userNeed === 'custom' ? customNeed : userNeed;

  const handleStartNewMapper = () => {
    // Reset state for new mapper
    setCycleTitle("Dynamic dispute");
    setUserRole('pursuer');
    setTrigger(COMMON_TRIGGERS[0]);
    setCustomTrigger("");
    setUserSecondary("");
    setCustomSecondary("");
    setUserPrimary("");
    setCustomPrimary("");
    setUserNeed("");
    setCustomNeed("");
    setPartnerSecondary("");
    setPartnerPrimary("");
    setStep(1);
  };

  const handleSaveCycle = () => {
    const newCycle: EftCycle = {
      id: Date.now().toString(),
      title: cycleTitle.trim() || "Unlabeled Interaction Loop",
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      trigger: activeTrigger || "Ambiguous tension spark",
      userRole,
      userSecondary: activeSecondary || "Silent withdrawal",
      userPrimary: activePrimary || "Feeling unloved or disconnected",
      userNeed: activeNeed || "Safe emotional reconnection",
      partnerSecondary: partnerSecondary || (userRole === 'pursuer' ? "Stonewalling & Avoidance" : "Anxious protest & Criticism"),
      partnerPrimary: partnerPrimary || (userRole === 'pursuer' ? "Fear of failure & shame" : "Scared of abandonment & loneliness")
    };

    setSavedCycles(prev => [newCycle, ...prev]);
    setSelectedCycleId(newCycle.id);
    setStep(0); // Return to dashboard list
  };

  const handleDeleteCycle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedCycles(prev => prev.filter(c => c.id !== id));
    if (selectedCycleId === id) setSelectedCycleId(null);
  };

  const currentViewedCycle = savedCycles.find(c => c.id === selectedCycleId);

  // Common prompts & lists based on selected role
  const secondaryList = userRole === 'pursuer' ? SECONDARY_BEHAVIORS_PURSUER : SECONDARY_BEHAVIORS_WITHDRAWER;
  const primaryList = userRole === 'pursuer' ? PRIMARY_EMOTIONS_PURSUER : PRIMARY_EMOTIONS_WITHDRAWER;
  const needsList = userRole === 'pursuer' ? ATTACHMENT_NEEDS_PURSUER : ATTACHMENT_NEEDS_WITHDRAWER;

  // Partner guessing suggestions
  const partnerSecondaryList = userRole === 'pursuer' ? SECONDARY_BEHAVIORS_WITHDRAWER : SECONDARY_BEHAVIORS_PURSUER;
  const partnerPrimaryList = userRole === 'pursuer' ? PRIMARY_EMOTIONS_WITHDRAWER : PRIMARY_EMOTIONS_PURSUER;

  return (
    <div className="flex flex-col gap-4 text-[#4B4B4B] w-full max-w-md mx-auto">
      
      {step === 0 && (
        /* DASHBOARD / PORTAL VIEW */
        <div className="flex flex-col gap-4 animate-fade-in">
          
          <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-2xl p-2 bg-purple-50 text-purple-600 rounded-2xl select-none">🔄</span>
              <div>
                <h4 className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wider">EFT Interaction Cycle Mapper</h4>
                <p className="font-sans text-[8.5px] text-on-surface-variant uppercase tracking-widest font-black text-[#CE9FFC]">Emotionally Focused Therapy</p>
              </div>
            </div>

            <p className="font-sans text-[11px] leading-relaxed text-on-surface-variant">
              In Emotionally Focused Therapy (EFT), relationship distress is seen as an **interactive dance**. Surface arguments (such as chores, money, or tone) trigger deep **attachment vulnerabilities**. When we lash out (pursue) or stay quiet (withdraw), we accidentally trigger our partner’s core fears, fueling an endless feedback loop.
            </p>

            <button
              type="button"
              onClick={handleStartNewMapper}
              className="w-full bg-gradient-to-r from-[#9B51E0] to-[#3B82F6] hover:brightness-110 text-white font-display font-black py-2.5 rounded-xl border-b-[4px] border-purple-900 active:translate-y-[2px] active:border-b-[2px] transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Map a New Interaction Loop</span>
            </button>
          </div>

          {/* ACTIVE ATTACHMENT LOOP VISUALIZATION CONTAINER */}
          {currentViewedCycle ? (
            <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-sm flex flex-col gap-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[7.5px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    Active Dynamic Visualizer
                  </span>
                  <h4 className="font-display font-black text-xs text-[#4B4B4B] mt-1">{currentViewedCycle.title}</h4>
                </div>
                <button
                  onClick={() => setSelectedCycleId(null)}
                  className="text-[8px] font-black uppercase text-slate-400 hover:text-primary transition-colors cursor-pointer"
                >
                  Close Map ×
                </button>
              </div>

              {/* EFT INFINITY LOOP GRAPHIC */}
              <div className="relative bg-slate-50 border border-slate-100 p-4 rounded-2xl overflow-hidden min-h-[220px] flex flex-col justify-between">
                
                {/* Background Infinity loop trail */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                  <svg className="w-full h-full max-w-[320px]" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M75 112.5C116.421 112.5 150 75 150 75C150 75 183.579 37.5 225 37.5C266.421 37.5 300 75 300 75C300 75 266.421 112.5 225 112.5C183.579 112.5 150 75 150 75C150 75 116.421 37.5 75 37.5C33.5786 37.5 0 75 0 75C0 75 33.5786 112.5 75 112.5Z" stroke="#9B51E0" strokeWidth="8" strokeDasharray="5 5" />
                  </svg>
                </div>

                {/* Left Side: Partner A (User Role) */}
                <div className="flex flex-col gap-1 z-10 max-w-[170px] self-start text-left">
                  <span className="text-[7.5px] font-black tracking-widest text-purple-700 uppercase bg-purple-50 px-1.5 py-0.5 rounded-md border border-purple-100/50 w-max">
                    You ({currentViewedCycle.userRole === 'pursuer' ? 'Pursuer' : 'Withdrawer'})
                  </span>
                  
                  {/* Surface layer */}
                  <div className="bg-white border border-slate-200 p-2 rounded-xl shadow-xs mt-1">
                    <span className="text-[6.5px] font-black uppercase text-amber-600 block">Surface Reaction:</span>
                    <p className="font-sans text-[9px] font-bold text-[#4B4B4B] leading-snug">
                      {currentViewedCycle.userSecondary}
                    </p>
                  </div>

                  {/* Hidden core layer */}
                  <div className="bg-purple-600 text-white p-2 rounded-xl shadow-xs mt-1 border-b-2 border-purple-800">
                    <span className="text-[6.5px] font-black uppercase text-purple-200 block">Attachment Vulnerability:</span>
                    <p className="font-sans text-[9px] font-bold leading-snug">
                      {currentViewedCycle.userPrimary}
                    </p>
                  </div>
                </div>

                {/* Interactive Connection/Trigger Arrows */}
                <div className="flex justify-center items-center gap-1.5 my-2.5">
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono font-black text-slate-400">Triggers →</span>
                    <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
                  </div>
                </div>

                {/* Right Side: Partner B */}
                <div className="flex flex-col gap-1 z-10 max-w-[170px] self-end text-right items-end">
                  <span className="text-[7.5px] font-black tracking-widest text-blue-700 uppercase bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100/50 w-max">
                    Partner ({currentViewedCycle.userRole === 'pursuer' ? 'Withdrawer' : 'Pursuer'})
                  </span>

                  {/* Surface layer */}
                  <div className="bg-white border border-slate-200 p-2 rounded-xl shadow-xs mt-1 text-right">
                    <span className="text-[6.5px] font-black uppercase text-amber-600 block">Surface Reaction:</span>
                    <p className="font-sans text-[9px] font-bold text-[#4B4B4B] leading-snug">
                      {currentViewedCycle.partnerSecondary}
                    </p>
                  </div>

                  {/* Hidden core layer */}
                  <div className="bg-blue-600 text-white p-2 rounded-xl shadow-xs mt-1 border-b-2 border-blue-800 text-right">
                    <span className="text-[6.5px] font-black uppercase text-blue-200 block">Estimated Vulnerability:</span>
                    <p className="font-sans text-[9px] font-bold leading-snug">
                      {currentViewedCycle.partnerPrimary}
                    </p>
                  </div>
                </div>

                {/* Trigger descriptor row at absolute bottom */}
                <div className="w-full text-center mt-3 pt-2 border-t border-slate-100">
                  <span className="text-[7px] font-black uppercase tracking-wider text-slate-400 block">The Dynamic Spark Event</span>
                  <p className="font-sans text-[10px] text-slate-600 italic">
                    "{currentViewedCycle.trigger}"
                  </p>
                </div>
              </div>

              {/* EFT REPAIR COVENANT & ACTION ADVICE */}
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <h5 className="font-display font-black text-[9.5px] uppercase tracking-wider text-primary">Dynamic Repair Formula</h5>
                </div>
                
                <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed">
                  To de-escalate this feedback loop, bypass the reactive armor (nagging, demanding, or retreating/stonewalling) and state the underlying vulnerability directly:
                </p>

                {/* Healing dialogue card */}
                <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-xs">
                  <span className="text-[6.5px] font-black uppercase text-primary tracking-widest block mb-1">Cooperative Script for Connection:</span>
                  <p className="font-sans text-[10px] text-[#4B4B4B] leading-relaxed italic">
                    "When <strong>{currentViewedCycle.trigger}</strong> happens, my protective habit is to <strong>{currentViewedCycle.userSecondary.split(' ')[0]}</strong>, but underneath that, I actually feel <strong>{currentViewedCycle.userPrimary.split(' ')[0]}</strong>. What I genuinely need from you right now is <strong>{currentViewedCycle.userNeed.toLowerCase()}</strong>."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[8.5px] leading-snug text-on-surface-variant/80 mt-1">
                  <div className="bg-white/80 p-2 rounded-lg border border-slate-100">
                    <strong>Pursuer Tip:</strong> Ask for contact gently rather than protesting. Slow down the urgency of your partner’s silence.
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-slate-100">
                    <strong>Withdrawer Tip:</strong> Exit the turtle shell slowly. Validate that their pursuit is actually a call for you, not an indictment of your character.
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-sm text-center py-8">
              <span className="text-3xl block mb-2">🗺️</span>
              <p className="font-sans text-[10.5px] text-on-surface-variant/80 leading-relaxed px-4">
                Select a documented attachment cycle below to view your interactive loop visualizer and healing de-escalation conversation scripts.
              </p>
            </div>
          )}

          {/* LIST OF SAVED ATTACHMENT LOOPS */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black uppercase text-on-surface-variant">Your Saved Cycles Ledger ({savedCycles.length})</span>
              <span className="text-[7.5px] font-black text-slate-400 uppercase">Interactive Log</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {savedCycles.map((cycle) => (
                <div
                  key={cycle.id}
                  onClick={() => setSelectedCycleId(cycle.id)}
                  className={`border-2 p-3.5 rounded-[1.5rem] cursor-pointer transition-all flex justify-between items-start gap-2.5 hover:border-slate-300 ${selectedCycleId === cycle.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-outline-variant shadow-xs'}`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h5 className="font-display font-black text-[10.5px] text-[#4B4B4B]">{cycle.title}</h5>
                      <span className="text-[6.5px] font-mono font-bold bg-slate-100 text-slate-600 px-1 rounded-sm">{cycle.createdAt}</span>
                    </div>
                    <p className="font-sans text-[9px] text-on-surface-variant truncate mt-1 leading-relaxed">
                      🔄 <strong>Spark Trigger:</strong> {cycle.trigger}
                    </p>
                    <p className="font-sans text-[8.5px] text-on-surface-variant/80 mt-0.5">
                      🎭 {cycle.userRole === 'pursuer' ? 'Anxious Pursuer' : 'Avoidant Withdrawer'} vs. {cycle.userRole === 'pursuer' ? 'Withdrawer' : 'Pursuer'}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleDeleteCycle(cycle.id, e)}
                    className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    title="Delete Saved Cycle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* STEP 1: ROLE SELECTION */}
      {step === 1 && (
        <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-[8.5px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
              Step 1 of 6
            </span>
            <span className="text-[10px] font-display font-black uppercase">Role Selection</span>
          </div>

          <div>
            <h4 className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wide">Which role do you typically adopt?</h4>
            <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
              When relationship tensions run high, do you tend to seek closeness through protest (Pursuer) or protect yourself through retreat (Withdrawer)?
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <button
              onClick={() => {
                setUserRole('pursuer');
                setStep(2);
              }}
              className="w-full text-left bg-gradient-to-br from-white to-purple-50/20 border-2 border-outline-variant hover:border-purple-300 p-4 rounded-2xl transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🏃‍♀️</span>
                <h5 className="font-display font-black text-xs text-[#4B4B4B] group-hover:text-purple-700 transition-colors">The Pursuer (Anxious Protest)</h5>
              </div>
              <p className="font-sans text-[9.5px] text-on-surface-variant leading-relaxed">
                "I feel highly anxious when my partner is silent. I complain, question, criticize, or analyze their motives because I am desperately trying to spark a response and feel secure."
              </p>
            </button>

            <button
              onClick={() => {
                setUserRole('withdrawer');
                setStep(2);
              }}
              className="w-full text-left bg-gradient-to-br from-white to-blue-50/20 border-2 border-outline-variant hover:border-blue-300 p-4 rounded-2xl transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🐢</span>
                <h5 className="font-display font-black text-xs text-[#4B4B4B] group-hover:text-blue-700 transition-colors">The Withdrawer / Distancer</h5>
              </div>
              <p className="font-sans text-[9.5px] text-on-surface-variant leading-relaxed">
                "Conflict feels overwhelming and unsafe. I shut down, exit the room, cite logical facts, or stay busy because I feel incompetent or like a disappointment and want to keep the peace."
              </p>
            </button>
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setStep(0)}
              className="text-[9px] font-black uppercase text-slate-400 hover:text-[#4B4B4B] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TRIGGER CHOOSE */}
      {step === 2 && (
        <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-[8.5px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
              Step 2 of 6
            </span>
            <span className="text-[10px] font-display font-black uppercase">Identify Spark Trigger</span>
          </div>

          <div>
            <h4 className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wide">What external spark starts this dynamic?</h4>
            <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
              Select one common relationship trigger or input your own custom scenario.
            </p>
          </div>

          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar pt-1">
            {COMMON_TRIGGERS.map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTrigger(t);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl border-2 font-sans font-black text-[10.5px] transition-all cursor-pointer ${trigger === t ? 'bg-primary/5 border-primary text-[#4B4B4B]' : 'bg-slate-50 border-outline-variant text-slate-600 hover:bg-slate-100/50'}`}
              >
                {t}
              </button>
            ))}
            
            <button
              onClick={() => setTrigger('custom')}
              className={`w-full text-left px-3 py-2.5 rounded-xl border-2 font-sans font-black text-[10.5px] transition-all cursor-pointer ${trigger === 'custom' ? 'bg-primary/5 border-primary text-[#4B4B4B]' : 'bg-slate-50 border-outline-variant text-slate-600 hover:bg-slate-100/50'}`}
            >
              ✏️ Use custom trigger...
            </button>
          </div>

          {trigger === 'custom' && (
            <div className="animate-fade-in mt-1">
              <textarea
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                placeholder="e.g. My partner rolls their eyes when I talk about my budget concerns..."
                className="w-full bg-white text-[11px] p-3 rounded-xl border-2 border-outline-variant h-16 focus:outline-none focus:border-primary font-sans resize-none"
              />
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-[#4B4B4B] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={trigger === 'custom' && !customTrigger.trim()}
              className="bg-primary text-white font-display font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider border-b-2 border-primary-dark hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SECONDARY BEHAVIOR */}
      {step === 3 && (
        <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-[8.5px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
              Step 3 of 6
            </span>
            <span className="text-[10px] font-display font-black uppercase">Surface Reaction</span>
          </div>

          <div>
            <span className="text-[7.5px] font-mono uppercase bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
              Defensive Mask
            </span>
            <h4 className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wide mt-1.5">How do you behave on the surface?</h4>
            <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
              Select your typical defensive strategy when {userRole === 'pursuer' ? 'chasing reassurance' : 'seeking sanctuary'}.
            </p>
          </div>

          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar pt-1">
            {secondaryList.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setUserSecondary(item.label)}
                className={`w-full text-left px-3 py-2 rounded-xl border-2 transition-all cursor-pointer ${userSecondary === item.label ? 'bg-primary/5 border-primary text-[#4B4B4B]' : 'bg-slate-50 border-outline-variant text-slate-600 hover:bg-slate-100/50'}`}
              >
                <div className="font-sans font-black text-[10.5px]">{item.label}</div>
                <p className="font-sans text-[8.5px] text-on-surface-variant/80 font-normal mt-0.5">{item.desc}</p>
              </button>
            ))}
            
            <button
              onClick={() => setUserSecondary('custom')}
              className={`w-full text-left px-3 py-2 rounded-xl border-2 font-sans font-black text-[10.5px] transition-all cursor-pointer ${userSecondary === 'custom' ? 'bg-primary/5 border-primary text-[#4B4B4B]' : 'bg-slate-50 border-outline-variant text-slate-600 hover:bg-slate-100/50'}`}
            >
              ✏️ Use custom behavior...
            </button>
          </div>

          {userSecondary === 'custom' && (
            <div className="animate-fade-in mt-1">
              <input
                type="text"
                value={customSecondary}
                onChange={(e) => setCustomSecondary(e.target.value)}
                placeholder="e.g. Sigh loudly and log onto work early..."
                className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
              />
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-[#4B4B4B] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!userSecondary || (userSecondary === 'custom' && !customSecondary.trim())}
              className="bg-primary text-white font-display font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider border-b-2 border-primary-dark hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PRIMARY VULNERABLE EMOTION */}
      {step === 4 && (
        <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-[8.5px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
              Step 4 of 6
            </span>
            <span className="text-[10px] font-display font-black uppercase">Hidden Vulnerability</span>
          </div>

          <div>
            <span className="text-[7.5px] font-mono uppercase bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
              The Soft Core
            </span>
            <h4 className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wide mt-1.5">What is the raw feeling underneath?</h4>
            <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
              EFT reveals that secondary anger or silence protects fragile, core attachment fears. What is your deep, unstated emotion?
            </p>
          </div>

          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar pt-1">
            {primaryList.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setUserPrimary(item.label)}
                className={`w-full text-left px-3 py-2 rounded-xl border-2 transition-all cursor-pointer ${userPrimary === item.label ? 'bg-primary/5 border-primary text-[#4B4B4B]' : 'bg-slate-50 border-outline-variant text-slate-600 hover:bg-slate-100/50'}`}
              >
                <div className="font-sans font-black text-[10.5px]">{item.label}</div>
                <p className="font-sans text-[8.5px] text-on-surface-variant/80 font-normal mt-0.5">{item.desc}</p>
              </button>
            ))}
            
            <button
              onClick={() => setUserPrimary('custom')}
              className={`w-full text-left px-3 py-2 rounded-xl border-2 font-sans font-black text-[10.5px] transition-all cursor-pointer ${userPrimary === 'custom' ? 'bg-primary/5 border-primary text-[#4B4B4B]' : 'bg-slate-50 border-outline-variant text-slate-600 hover:bg-slate-100/50'}`}
            >
              ✏️ Use custom emotion...
            </button>
          </div>

          {userPrimary === 'custom' && (
            <div className="animate-fade-in mt-1">
              <input
                type="text"
                value={customPrimary}
                onChange={(e) => setCustomPrimary(e.target.value)}
                placeholder="e.g. Scared that my efforts to support us go unnoticed..."
                className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
              />
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-[#4B4B4B] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              disabled={!userPrimary || (userPrimary === 'custom' && !customPrimary.trim())}
              className="bg-primary text-white font-display font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider border-b-2 border-primary-dark hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: ATTACHMENT NEED */}
      {step === 5 && (
        <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-[8.5px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
              Step 5 of 6
            </span>
            <span className="text-[10px] font-display font-black uppercase">Attachment Longing</span>
          </div>

          <div>
            <span className="text-[7.5px] font-mono uppercase bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
              Core Security
            </span>
            <h4 className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wide mt-1.5">What is your true attachment need?</h4>
            <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
              Select the core healing reassurance that would allow your nervous system to calm down and feel connected.
            </p>
          </div>

          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar pt-1">
            {needsList.map((need, idx) => (
              <button
                key={idx}
                onClick={() => setUserNeed(need)}
                className={`w-full text-left px-3 py-2.5 rounded-xl border-2 font-sans font-black text-[10.5px] transition-all cursor-pointer ${userNeed === need ? 'bg-primary/5 border-primary text-[#4B4B4B]' : 'bg-slate-50 border-outline-variant text-slate-600 hover:bg-slate-100/50'}`}
              >
                "{need}"
              </button>
            ))}
            
            <button
              onClick={() => setUserNeed('custom')}
              className={`w-full text-left px-3 py-2.5 rounded-xl border-2 font-sans font-black text-[10.5px] transition-all cursor-pointer ${userNeed === 'custom' ? 'bg-primary/5 border-primary text-[#4B4B4B]' : 'bg-slate-50 border-outline-variant text-slate-600 hover:bg-slate-100/50'}`}
            >
              ✏️ Use custom attachment need...
            </button>
          </div>

          {userNeed === 'custom' && (
            <div className="animate-fade-in mt-1">
              <input
                type="text"
                value={customNeed}
                onChange={(e) => setCustomNeed(e.target.value)}
                placeholder="e.g. To know that even when I make mistakes, you still look forward to seeing me..."
                className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
              />
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setStep(4)}
              className="text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-[#4B4B4B] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(6)}
              disabled={!userNeed || (userNeed === 'custom' && !customNeed.trim())}
              className="bg-primary text-white font-display font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider border-b-2 border-primary-dark hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: PARTNER GUESSTIMATE */}
      {step === 6 && (
        <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-[8.5px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
              Step 6 of 6
            </span>
            <span className="text-[10px] font-display font-black uppercase">Partner's Experience</span>
          </div>

          <div>
            <span className="text-[7.5px] font-mono uppercase bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
              Empathy Hypothesis
            </span>
            <h4 className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wide mt-1.5">What is your partner's side of the dance?</h4>
            <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
              EFT is systemic: your behaviors trigger your partner. Hypothesize their experience to complete the dynamic loop.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <div>
              <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">
                Partner's surface reaction (when you protest/retreat):
              </label>
              <select
                value={partnerSecondary}
                onChange={(e) => setPartnerSecondary(e.target.value)}
                className="w-full bg-white text-[10.5px] font-sans px-2.5 py-2 rounded-xl border-2 border-outline-variant font-bold text-[#4B4B4B]"
              >
                <option value="">-- Choose matching reaction --</option>
                {partnerSecondaryList.map((item, idx) => (
                  <option key={idx} value={item.label}>{item.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">
                Their likely raw/vulnerable emotion under that:
              </label>
              <select
                value={partnerPrimary}
                onChange={(e) => setPartnerPrimary(e.target.value)}
                className="w-full bg-white text-[10.5px] font-sans px-2.5 py-2 rounded-xl border-2 border-outline-variant font-bold text-[#4B4B4B]"
              >
                <option value="">-- Choose matching vulnerability --</option>
                {partnerPrimaryList.map((item, idx) => (
                  <option key={idx} value={item.label}>{item.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Label Title setup before final compile */}
          <div className="border-t border-slate-100 pt-3 mt-1">
            <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">Give this mapped interaction a shorthand name:</label>
            <input
              type="text"
              value={cycleTitle}
              onChange={(e) => setCycleTitle(e.target.value)}
              placeholder="e.g. Clean kitchen disagreement"
              className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
            />
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setStep(5)}
              className="text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-[#4B4B4B] transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSaveCycle}
              disabled={!partnerSecondary || !partnerPrimary}
              className="bg-[#58CC02] text-white font-display font-black px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider border-b-[4px] border-[#46A302] hover:brightness-105 active:translate-y-[2px] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Map & Save Loop</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
