import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Check, RotateCcw, ArrowRight, Brain, Heart, ShieldAlert, Plus, Trash2, 
  BookOpen, FileText, Compass, PieChart, ArrowDown, Scale, MessageSquare, Users, 
  Flame, Calendar, Layers, CheckSquare, Dumbbell, AlertOctagon, HelpCircle
} from 'lucide-react';

interface CbtDbtExplorationProps {
  onTriggerInteractionAlert?: (title: string, body: string) => void;
}

// Full-featured data structures for the lists
interface StrategyDefinition {
  id: string;
  type: 'cbt' | 'dbt';
  category: string;
  name: string;
  acronym?: string;
  subtitle: string;
  desc?: string;
  clinicalTheory: string;
  steps: string[];
}

const SCIENTIFIC_STRATEGIES: StrategyDefinition[] = [
  // --- CBT ---
  {
    id: 'cbt-behavioral-activation',
    type: 'cbt',
    category: 'Behavioral Physics',
    name: 'Behavioral Activation (BA)',
    subtitle: 'Overcome isolation lethargy by scheduling meaningful, value-aligned activities.',
    clinicalTheory: 'Depression thrives on task withdrawal and isolation, which removes positive reinforcement channels. Behavioral Activation systematically bypasses feelings, initiating active movement to generate momentum.',
    steps: [
      'Choose a core life value (e.g., Connection, Creativity, Physical Health).',
      'Identify a micro-activity aligned with this value that takes less than 15 minutes.',
      'Schedule a specific, non-negotiable time slot today to perform it.',
      'Rate your mood pre-activity and post-activity to document neurological rewards.'
    ]
  },
  {
    id: 'cbt-downward-arrow',
    type: 'cbt',
    category: 'Core Schemas',
    name: 'Downward Arrow Discovery',
    subtitle: 'Drill down from shallow surface thoughts to discover deep core schemas.',
    clinicalTheory: 'Surface-level negative automatic thoughts are driven by rigid core assumptions (schemas) about the self, world, or others. Accessing the core schema allows for systemic, broad cognitive therapeutic restructuring.',
    steps: [
      'Write down a prominent negative automatic thought (e.g., "I messed up this email.").',
      'Ask: "If this thought were completely true, what would it mean about me or my life?"',
      'Write the deeper answer (e.g., "It means I am incompetent at my job.").',
      'Repeat the question on the new answer until you hit a universal core belief (e.g., "I am unlovable" or "I am helpless").'
    ]
  },
  {
    id: 'cbt-responsibility-pie',
    type: 'cbt',
    category: 'Cognitive Biases',
    name: 'Responsibility Pie Charting',
    subtitle: 'Re-distribute self-blaming personalization among all realistic external factors.',
    clinicalTheory: 'Highly anxious or depressed individuals possess a cognitive personalization bias, assuming 100% of the guilt for adverse events, failing to see complex external, environmental, or situational contributions.',
    steps: [
      'Clearly define the negative outcome (e.g., "The team presentation was awkward.").',
      'Honestly list every single factor involved (e.g., My contributions, colleague fatigue, audio malfunction, short preparation times, bad luck).',
      'Assign an objective percentage of responsibility to each external factor.',
      'Acknowledge that your personal portion occupies only a modest slice of the reality pie.'
    ]
  },
  {
    id: 'cbt-behavioral-experiment',
    type: 'cbt',
    category: 'Fact Testing',
    name: 'Behavioral Hypothesis Testing',
    subtitle: 'Test catastrophic negative predictions directly in physical reality.',
    clinicalTheory: 'Anxiety holds predictions of negative events as solid pre-recorded facts. Designing structured experiments treats thoughts as testable hypotheses, gathers actual data, and physically rewrites anxiety thresholds.',
    steps: [
      'Formulate your exact negative forecast (e.g., "If I ask a question, everyone will laugh and ignore me.").',
      'Rate your belief level in this catastrophe from 0% to 100%.',
      'Design a structured, low-risk experiment (e.g., "I will ask a simple question in the next team sync.").',
      'Execute the test, record objective observations, and compare findings with your prediction.'
    ]
  },
  {
    id: 'cbt-socratic-courtroom',
    type: 'cbt',
    category: 'Cognitive Restructuring',
    name: 'Socratic Cognitive Courtroom',
    subtitle: 'Cross-examine automatic thoughts with objective courtroom evidence.',
    clinicalTheory: 'Anxiety acts as a prosecutor, presenting biased claims. Entering a mental courtroom forces the cognitive process to review concrete admissible evidence for and against the thought, leading to an impartial jury verdict.',
    steps: [
      'Write down the emotional automatic charge (e.g., "I am failing at everything in life.").',
      'Identify concrete, verifiable courtroom-admissible evidence supporting the charge.',
      'Compile concrete, verifiable courtroom-admissible evidence that contradicts the charge (prior accomplishments, efforts, positive events).',
      'Draft an objective, balanced jury statement reflecting the absolute facts of the situation.'
    ]
  },
  {
    id: 'cbt-double-standard',
    type: 'cbt',
    category: 'Self-Compassion',
    name: 'Double-Standard Reframed',
    subtitle: 'Apply the same supportive and gentle standards to yourself as you do to a dear friend.',
    clinicalTheory: 'Highly self-critical individuals enforce rigid, punitive rules on themselves that they would never project onto others. Verbalizing advice as if talking to a friend triggers innate compassion networks and reduces self-harming perfectionism.',
    steps: [
      'Formulate your current harsh self-indictment (e.g., "I was awkward; I should be ashamed of my social anxiety.").',
      'Imagine a beloved companion or family member made the exact same mistake and felt identical shame.',
      'Write down the precise, warm, validating words you would say to comfort them.',
      'Read those words out loud to yourself, accepting the exact same criteria of human grace.'
    ]
  },

  // --- DBT ---
  {
    id: 'dbt-dear-man',
    type: 'dbt',
    category: 'Interpersonal Effectiveness',
    name: 'DEAR MAN Protocol',
    subtitle: 'Express your needs, request changes, or decline demands assertively.',
    clinicalTheory: 'Assertive communication ensures that relationships remain healthy while respecting boundaries. The structured DEAR MAN format minimizes emotional escalation, keeps discussions focused on facts, and maximizes negotiation success.',
    steps: [
      'Describe: State the objective facts clearly. No emotional hyperbole or pre-judgments.',
      'Express: State your feelings and thoughts using "I" statements ("I feel overwhelmed when...").',
      'Assert: Ask clearly for what you need, or say no with clarity and firmness.',
      'Reinforce: Explain the mutual benefits or positive outcomes of meeting this request.',
      'Mindful: Remain focused on the main goal. Don\'t get distracted or dragged into side arguments.',
      'Appear Confident: Maintain an upright posture, direct eye contact, and select steady tones.',
      'Negotiate: Be willing to offer alternative options or compromises without compromising core self-respect.'
    ]
  },
  {
    id: 'dbt-give-relationship',
    type: 'dbt',
    category: 'Interpersonal Effectiveness',
    name: 'GIVE Skill',
    subtitle: 'Keep relationships strong and reduce friction when interacting with others.',
    clinicalTheory: 'The GIVE skill acts as a lubricant in human communication, ensuring the external interactive climate remains warm, non-hostile, and validated, reducing the chance of defensive closure.',
    steps: [
      'Gentle: Maintain a soft tone of voice. Avoid threats, dynamic physical sarcasm, or verbal guilt-trips.',
      'Interested: Listen carefully. Don\'t interrupt, look at your phone, or roll your eyes.',
      'Validate: Verbally acknowledge their feelings, perspectives, or current difficulties ("I understand this is tough...").',
      'Easy Manner: Keep things light, comfortable, and warm. Smile when appropriate, or use mild, respectful humor.'
    ]
  },
  {
    id: 'dbt-fast-self-respect',
    type: 'dbt',
    category: 'Self-Respect',
    name: 'FAST Skill',
    subtitle: 'Preserve your dignity and personal core values during tough negotiations.',
    clinicalTheory: 'People often compromise their self-respect to keep relationships peaceful. FAST prevents excessive people-pleasing, toxic self-deprecation, and compromise of core ethical standards.',
    steps: [
      'Fair: Be fair to both yourself and the other party. Neither over-accuse nor over-submit.',
      'Apologies-Free: Do not apologize for breathing, expressing your core opinions, or having human needs.',
      'Stick to Values: Do not discard your deep moral values or boundaries just to win social approval.',
      'Truthful: Speak direct, unvarnished truth. Do not exaggerate, lie, or play the helpless victim to navigate confrontation.'
    ]
  },
  {
    id: 'dbt-please-vulnerability',
    type: 'dbt',
    category: 'Emotion Regulation',
    name: 'PLEASE Bio-Buffer',
    subtitle: 'Assess and stabilize physical biological factors to build a sturdy mental fortress.',
    clinicalTheory: 'The mind and body are fundamentally interlinked. A compromised physical state (exhaustion, hunger, physical illness) dramatically lowers the threshold of the amygdala, making you highly susceptible to intense, chaotic emotional triggers.',
    steps: [
      'Treat Physical Illness: Address physical pain, medical concerns, and health needs promptly.',
      'Balanced Eating: Maintain stable blood glucose levels; avoid skipping essential meals.',
      'Avoid Mood-Altering Substances: Avoid self-medicating with alcohol, caffeine rushes, or street components.',
      'Balanced Sleep: Target consistent circadian resting periods (7-9 hours) to renew frontal pathways.',
      'Exercise Daily: ENGAGE in 15+ minutes of physical circulation to process stress hormones.'
    ]
  },
  {
    id: 'dbt-radical-acceptance',
    type: 'dbt',
    category: 'Distress Tolerance',
    name: 'Radical Acceptance',
    subtitle: 'Acknowledge present reality exactly as it is, without fighting or fighting it.',
    clinicalTheory: 'Pain is inevitable in human life, but suffering is created by fighting reality. Radical Acceptance doesn\'t mean agreeing with pain; it means stopping futile, draining fights with events that have already occurred, reclaiming your power for active choice.',
    steps: [
      'Notice when you are fighting reality (thinking "This shouldn\'t be happening!" or holding intense anger).',
      'Remind yourself that the present moment cannot be changed; past pathways cannot be rewritten.',
      'Validate that the current situation is the result of a million independent prior causes.',
      'Directly consent to things being exactly as they are right now, freeing up mental energy to decide "What do I do now?"'
    ]
  },
  {
    id: 'dbt-improve-moment',
    type: 'dbt',
    category: 'Distress Tolerance',
    name: 'IMPROVE the Moment',
    subtitle: 'Soothe acute distress with structured, comforting cognitive/sensory substitutes.',
    clinicalTheory: 'When in high emotional distress, the brain struggles to plan long-term. IMPROVE provides a toolkit of rapid-access sensory, imaginary, and comforting mental exercises to bring high emotional peaks safely down.',
    steps: [
      'Imagery: Visualize a safe spiritual sanctuary, an ocean breeze, or a protective field.',
      'Meaning: Connect the current trial to personal learning, resilience, or philosophical growth.',
      'Prayer: Let go of intense struggles by opening up to a higher wisdom, nature, or values.',
      'Relaxation: Massage your neck, listen to a binaural wave, or take warm tea.',
      'One Thing at a Time: Stop sorting out your whole life; focus entirely on the single next breath.',
      'Vacation: Take a temporary mental retreat (close screen for 10 minutes, rest in darkness).',
      'Encouragement: Be your own clinical coach ("I am getting through this moment, breathe out...").'
    ]
  }
];

export default function CbtDbtExploration({ onTriggerInteractionAlert }: CbtDbtExplorationProps) {
  const [activeType, setActiveType] = useState<'all' | 'cbt' | 'dbt'>('all');
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('cbt-behavioral-activation');
  
  // Interactive states for live strategy worksheets
  const [baLog, setBaLog] = useState({ value: 'Health', action: '', preMood: 50, postMood: 50, saved: false });
  const [schemaLog, setSchemaLog] = useState({ thoughts: ['', '', '', ''], activeStep: 0, saved: false });
  const [pieLog, setPieLog] = useState({ self: 100, others: 0, situation: 0, badLuck: 0, saved: false });
  const [dearManLog, setDearManLog] = useState({ describe: '', express: '', assert: '', reinforce: '', saved: false });
  const [pleaseLog, setPleaseLog] = useState({ physical: false, eating: false, substance: false, sleep: false, exercise: false });
  const [radicalLog, setRadicalLog] = useState({ fightStatement: '', acceptStatement: '', saved: false });

  // Custom logging to local storage
  const handleLogToLocalStorage = (strategyName: string, workoutDetails: any) => {
    try {
      const existing = localStorage.getItem('therapy_cbt_dbt_explorer_history') || '[]';
      const parsed = JSON.parse(existing);
      const newEntry = {
        id: `explorer-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        strategy: strategyName,
        details: workoutDetails
      };
      parsed.unshift(newEntry);
      localStorage.setItem('therapy_cbt_dbt_explorer_history', JSON.stringify(parsed));
      
      if (onTriggerInteractionAlert) {
        onTriggerInteractionAlert(
          `📝 ${strategyName} Workout Logged`,
          `Your active workbook response has been successfully written to local memory. Accessing and writing behavioral data physically trains cognitive neural pathways over time!`
        );
      }
    } catch (e) {
      console.error("Local storage log failed:", e);
    }
  };

  const filteredStrategies = SCIENTIFIC_STRATEGIES.filter(s => {
    if (activeType === 'all') return true;
    return s.type === activeType;
  });

  const activeStrategy = SCIENTIFIC_STRATEGIES.find(s => s.id === selectedStrategyId) || SCIENTIFIC_STRATEGIES[0];

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-5 md:p-6 shadow-sm space-y-6 text-left" id="cbt-dbt-explorer-card">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[9px] font-black uppercase tracking-widest font-mono">
              Clinical Encyclopedia
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-widest font-mono">
              Workbooks
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-neutral-800 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>CBT & DBT Coping Compass</span>
          </h2>
          <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
            Directly explore advanced Cognitive Behavioral Therapy exercises alongside Dialectical Behavior Distress Tolerance tools. Complete active digital workbooks below to record clinical neural sessions.
          </p>
        </div>

        {/* Global tab selector */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-100 self-start shrink-0">
          {[
            { id: 'all', label: 'All Protocols' },
            { id: 'cbt', label: 'CBT Restructuring' },
            { id: 'dbt', label: 'DBT Distress Tolerors' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveType(tab.id as any);
                // Auto reset selection if not in filtered list
                const match = SCIENTIFIC_STRATEGIES.find(s => s.type === tab.id || tab.id === 'all');
                if (match) setSelectedStrategyId(match.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-[10.5px] font-bold cursor-pointer transition-all ${
                activeType === tab.id 
                  ? 'bg-white text-indigo-600 shadow-2xs font-extrabold' 
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Grid Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Navigator (4 cols on large screens) */}
        <div className="lg:col-span-4 flex flex-col space-y-2.5 max-h-[520px] overflow-y-auto pr-1 select-none custom-scrollbar">
          <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block pl-1 font-mono">Select Strategy ({filteredStrategies.length})</span>
          {filteredStrategies.map((item) => {
            const isSelected = item.id === selectedStrategyId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedStrategyId(item.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'border-indigo-600/30 bg-indigo-50/50 shadow-2xs' 
                    : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/70 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className={`text-[12px] font-extrabold tracking-tight ${isSelected ? 'text-indigo-800 font-black' : 'text-neutral-800'}`}>
                    {item.name}
                  </span>
                  <span className={`text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded-md font-mono ${
                    item.type === 'cbt' ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {item.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-semibold mt-1 leading-relaxed line-clamp-2">
                  {item.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Active Workspace Panel (8 cols) */}
        <div className="lg:col-span-8 bg-slate-50/40 p-5 rounded-3xl border border-slate-100 flex flex-col justify-between space-y-6">
          
          {/* Theory and Steps */}
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[9px] font-extrabold uppercase tracking-widest font-mono">
                {activeStrategy.category}
              </span>
              <BookOpen className="w-4 h-4 text-indigo-500" />
            </div>

            <div>
              <h3 className="text-base font-black text-neutral-800 tracking-tight leading-none">{activeStrategy.name}</h3>
              <p className="text-xs text-neutral-400 font-bold leading-normal mt-1">{activeStrategy.subtitle}</p>
            </div>

            {/* Scientific explanation */}
            <div className="p-3.5 bg-white border border-slate-100/40 rounded-2xl space-y-1">
              <span className="text-[9.5px] font-black text-indigo-500 uppercase tracking-widest block font-mono">Clinical Neuroscience Reason</span>
              <p className="text-[11px] text-neutral-600 font-semibold leading-relaxed">
                {activeStrategy.clinicalTheory}
              </p>
            </div>

            {/* Interactive Steps List */}
            <div className="space-y-2">
              <span className="text-[9.5px] font-black text-neutral-400 uppercase tracking-widest block pl-1 font-mono">Guideline Protocol</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activeStrategy.steps.map((st, idx) => (
                  <div key={idx} className="flex gap-2 p-2 bg-white rounded-xl border border-slate-100/20 text-left">
                    <span className="w-5 h-5 bg-indigo-50 text-indigo-700 font-black rounded-lg text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-[11px] text-neutral-700 font-semibold leading-normal pt-0.5">
                      {st}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Active Skill Simulator / Workbook Entry Arena */}
          <div className="border-t border-slate-200/60 pt-5 space-y-4">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span>ACTIVE CLINICAL DIGITAL WORKBOOK</span>
            </span>

            {/* --- WORKBOOK: Behavioral Activation --- */}
            {activeStrategy.id === 'cbt-behavioral-activation' && (
              <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-black text-neutral-600">Step 1: Choose Wholesome Value</label>
                    <select 
                      value={baLog.value}
                      onChange={(e) => setBaLog(prev => ({ ...prev, value: e.target.value }))}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                    >
                      <option value="Health">Physical Health / Vitality</option>
                      <option value="Connection">Social Connection / Family</option>
                      <option value="Art">Creative Expression / Art</option>
                      <option value="Intellectual">Intellectual Growth / Reading</option>
                      <option value="Order">Order / Cleaning / Environment</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10.5px] font-black text-neutral-600">Step 2: Define Micro-Task (15m limit)</label>
                    <input 
                      type="text"
                      value={baLog.action}
                      onChange={(e) => setBaLog(prev => ({ ...prev, action: e.target.value }))}
                      placeholder="e.g., Do 10 bodyweights, text active friend, tidy desk"
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1.5 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500">
                      <span>Predicted Mood Pre-Task:</span>
                      <span className="font-mono text-indigo-600">{baLog.preMood}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={baLog.preMood}
                      onChange={(e) => setBaLog(prev => ({ ...prev, preMood: Number(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500">
                      <span>Realistic Mood Post-Task prediction:</span>
                      <span className="font-mono text-emerald-600">{baLog.postMood}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={baLog.postMood}
                      onChange={(e) => setBaLog(prev => ({ ...prev, postMood: Number(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!baLog.action.trim()}
                  onClick={() => {
                    setBaLog(prev => ({ ...prev, saved: true }));
                    handleLogToLocalStorage('Behavioral Activation', baLog);
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-45 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Log Activation Schedule Entry</span>
                </button>
              </div>
            )}

            {/* --- WORKBOOK: Downward Arrow --- */}
            {activeStrategy.id === 'cbt-downward-arrow' && (
              <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-4 text-left">
                <div className="space-y-3 relative pl-4 border-l-2 border-indigo-200">
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-bold text-indigo-500 block">Level 1: Surface Automatic Negative Thought</span>
                    <input 
                      type="text"
                      value={schemaLog.thoughts[0]}
                      onChange={(e) => {
                        const copy = [...schemaLog.thoughts];
                        copy[0] = e.target.value;
                        setSchemaLog(prev => ({ ...prev, thoughts: copy }));
                      }}
                      placeholder="e.g., I stumbled twice while explaining my idea today."
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9.5px] font-bold text-indigo-500 block flex items-center gap-1">
                      <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Level 2: "If that is true, what bad thing does it mean about me?"</span>
                    </span>
                    <input 
                      type="text"
                      disabled={!schemaLog.thoughts[0]}
                      value={schemaLog.thoughts[1]}
                      onChange={(e) => {
                        const copy = [...schemaLog.thoughts];
                        copy[1] = e.target.value;
                        setSchemaLog(prev => ({ ...prev, thoughts: copy }));
                      }}
                      placeholder="e.g., It means they think my work is weak and unprepared."
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-indigo-400 disabled:opacity-40"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9.5px] font-bold text-indigo-500 block flex items-center gap-1">
                      <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Level 3: "And if they believe that, what does it make me?"</span>
                    </span>
                    <input 
                      type="text"
                      disabled={!schemaLog.thoughts[1]}
                      value={schemaLog.thoughts[2]}
                      onChange={(e) => {
                        const copy = [...schemaLog.thoughts];
                        copy[2] = e.target.value;
                        setSchemaLog(prev => ({ ...prev, thoughts: copy }));
                      }}
                      placeholder="e.g., It means I am incompetent at engineering."
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-indigo-400 disabled:opacity-40"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9.5px] font-bold text-indigo-500 block flex items-center gap-1">
                      <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Level 4: Hidden Rigid Core Assumption (Core Schema)</span>
                    </span>
                    <input 
                      type="text"
                      disabled={!schemaLog.thoughts[2]}
                      value={schemaLog.thoughts[3]}
                      onChange={(e) => {
                        const copy = [...schemaLog.thoughts];
                        copy[3] = e.target.value;
                        setSchemaLog(prev => ({ ...prev, thoughts: copy }));
                      }}
                      placeholder="e.g., I am totally defective and bound to fail."
                      className="w-full text-xs font-bold p-2 bg-indigo-50/40 border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-400 disabled:opacity-40 text-indigo-900"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!schemaLog.thoughts[3].trim()}
                  onClick={() => {
                    setSchemaLog(prev => ({ ...prev, saved: true }));
                    handleLogToLocalStorage('Downward Arrow Restructuring', schemaLog);
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Map & Defuse Core Schema</span>
                </button>
              </div>
            )}

            {/* --- WORKBOOK: Responsibility Pie Chart --- */}
            {activeStrategy.id === 'cbt-responsibility-pie' && (
              <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-4 text-left">
                <div className="space-y-3.5">
                  <div className="p-3 bg-indigo-500/5 text-indigo-950 text-xs font-semibold border border-indigo-200/30 rounded-xl leading-relaxed">
                    Personalization biases lock your belief self-gauge at 100%. Adjust the sliders below to distribute real-world causation slices appropriately among contributors.
                  </div>

                  <div className="space-y-3">
                    {/* Slide 1 */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span>👩‍💻 Slice A: Real Self-responsibility (Action limit/effort)</span>
                        <span className="font-mono text-indigo-700">{pieLog.self}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={pieLog.self}
                        onChange={(e) => setPieLog(prev => ({ ...prev, self: Number(e.target.value) }))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>

                    {/* Slide 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span>👥 Slice B: Others (Their fatigue, actions, contributions)</span>
                        <span className="font-mono text-slate-700">{pieLog.others}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={pieLog.others}
                        onChange={(e) => setPieLog(prev => ({ ...prev, others: Number(e.target.value) }))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-600"
                      />
                    </div>

                    {/* Slide 3 */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span>🎙️ Slice C: Situation / Environment (App, setup, noise)</span>
                        <span className="font-mono text-slate-700">{pieLog.situation}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={pieLog.situation}
                        onChange={(e) => setPieLog(prev => ({ ...prev, situation: Number(e.target.value) }))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-600"
                      />
                    </div>

                    {/* Slide 4 */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span>🎲 Slice D: General Chaos / Bad Luck</span>
                        <span className="font-mono text-slate-700">{pieLog.badLuck}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={pieLog.badLuck}
                        onChange={(e) => setPieLog(prev => ({ ...prev, badLuck: Number(e.target.value) }))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-600"
                      />
                    </div>
                  </div>

                  {/* Calculated pie meter */}
                  {(() => {
                    const total = pieLog.self + pieLog.others + pieLog.situation + pieLog.badLuck;
                    const tooHigh = total !== 100;

                    return (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-400">Total Causation Breakdown Meter (Must aggregate to exactly 100%):</span>
                          <span className={`font-mono font-extrabold ${tooHigh ? 'text-rose-500' : 'text-emerald-600'}`}>{total}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                          <div className="h-full bg-indigo-500" style={{ width: `${total > 0 ? (pieLog.self / total) * 100 : 0}%` }} />
                          <div className="h-full bg-sky-500" style={{ width: `${total > 0 ? (pieLog.others / total) * 100 : 0}%` }} />
                          <div className="h-full bg-amber-500" style={{ width: `${total > 0 ? (pieLog.situation / total) * 100 : 0}%` }} />
                          <div className="h-full bg-teal-500" style={{ width: `${total > 0 ? (pieLog.badLuck / total) * 100 : 0}%` }} />
                        </div>
                        
                        <div className="flex items-center justify-between gap-4 pt-1">
                          {tooHigh ? (
                            <span className="text-[10px] font-bold text-rose-500 block flex items-center gap-1">
                              <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                              <span>Current sum is {total}%. Tweak slide points to match exactly 100%.</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-600 block flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>Balanced 100% physics distribution! Rationalized load locked.</span>
                            </span>
                          )}

                          <button
                            type="button"
                            disabled={tooHigh}
                            onClick={() => {
                              setPieLog(prev => ({ ...prev, saved: true }));
                              handleLogToLocalStorage('Causation Pie Charting', pieLog);
                            }}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-800 disabled:opacity-45 text-white text-[11px] font-black rounded-lg cursor-pointer flex items-center gap-1 whitespace-nowrap"
                          >
                            <span>Lock Slice Data</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* --- WORKBOOK: DEAR MAN Script Builder --- */}
            {activeStrategy.id === 'dbt-dear-man' && (
              <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-neutral-500 block font-mono">D - DESCRIBE the pure objective facts</span>
                    <textarea 
                      rows={2}
                      value={dearManLog.describe}
                      onChange={(e) => setDearManLog(prev => ({ ...prev, describe: e.target.value }))}
                      placeholder="e.g., We agreed to call at 8 PM, but I did not receive a call or text."
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-neutral-500 block font-mono font-mono">E - EXPRESS your internal emotional reality</span>
                    <textarea 
                      rows={2}
                      value={dearManLog.express}
                      onChange={(e) => setDearManLog(prev => ({ ...prev, express: e.target.value }))}
                      placeholder="e.g., I feel unvalued and worried that our arrangement is not respected."
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-neutral-500 block font-mono">A - ASSERT your direct, specific boundary/need</span>
                    <textarea 
                      rows={2}
                      value={dearManLog.assert}
                      onChange={(e) => setDearManLog(prev => ({ ...prev, assert: e.target.value }))}
                      placeholder="e.g., I need a heads-up message 30 minutes prior if we must shift schedules."
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-neutral-500 block font-mono">R - REINFORCE the value / mutual benefit</span>
                    <textarea 
                      rows={2}
                      value={dearManLog.reinforce}
                      onChange={(e) => setDearManLog(prev => ({ ...prev, reinforce: e.target.value }))}
                      placeholder="e.g., That way we both feel respected, relaxed, and secure."
                      className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Unified Script Output Preview */}
                <div className="p-3 bg-teal-50/45 border border-teal-200/50 rounded-xl space-y-1.5">
                  <span className="text-[9px] font-black text-teal-600 block uppercase tracking-wide font-mono">Integrated Assertiveness Script Preview</span>
                  <p className="text-[11.5px] text-teal-950 font-bold leading-relaxed italic">
                    "{dearManLog.describe || '[Describe]'} {dearManLog.express || '[Express]'}. {dearManLog.assert || '[Assert]'}, {dearManLog.reinforce || '[Reinforce]'}."
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!dearManLog.assert.trim()}
                  onClick={() => {
                    setDearManLog(prev => ({ ...prev, saved: true }));
                    handleLogToLocalStorage('DEAR MAN Communication Standard', dearManLog);
                  }}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap focus:outline-none"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Log DEAR MAN Script Configuration</span>
                </button>
              </div>
            )}

            {/* --- WORKBOOK: PLEASE Bio-Buffer --- */}
            {activeStrategy.id === 'dbt-please-vulnerability' && (
              <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-4 text-left">
                <div className="p-3.5 bg-tea-50/5 text-slate-800 text-xs font-semibold border border-slate-200/20 rounded-xl leading-relaxed">
                  Vulnerability factors dramatically reduce emotional resilience. Complete the instant somatic checklist below to view your current system vulnerability score.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { id: 'physical', label: '🩹 P - Cleared physical pain/illness details check?' },
                    { id: 'eating', label: '🥗 L & E - Enjoyed regular nutritious meals today?' },
                    { id: 'substance', label: '☕ A - Clean of high caffeine rushes or medication drops?' },
                    { id: 'sleep', label: '🌙 S - Secured 7+ hours of circadian continuous sleep?' },
                    { id: 'exercise', label: '🏃‍♀️ E - Complete 15m somatic blood circulation/moving?' }
                  ].map((chk) => (
                    <label 
                      key={chk.id}
                      className="p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-100/50 flex items-center justify-between cursor-pointer select-none"
                    >
                      <span className="text-xs font-bold text-slate-700">{chk.label}</span>
                      <input 
                        type="checkbox"
                        checked={(pleaseLog as any)[chk.id]}
                        onChange={(e) => {
                          const updated = { ...pleaseLog, [chk.id]: e.target.checked };
                          setPleaseLog(updated);
                        }}
                        className="w-4 h-4 text-teal-600 accent-teal-600 rounded cursor-pointer"
                      />
                    </label>
                  ))}
                </div>

                {/* Score calculation bar */}
                {(() => {
                  const checkCount = Object.values(pleaseLog).filter(Boolean).length;
                  const ratio = (checkCount / 5) * 100;
                  const warning = ratio < 60;

                  return (
                    <div className="pt-2 border-t border-slate-100 space-y-2.5">
                      <div className="flex justify-between items-center text-[10.5px] font-black">
                        <span className="text-slate-400">Biological Buffer Level:</span>
                        <span className={`font-mono ${warning ? 'text-rose-600' : 'text-emerald-600'}`}>{ratio}% Stable</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 rounded-full ${warning ? 'bg-amber-500' : 'bg-teal-500'}`} 
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                      <p className="text-[10.5px] text-slate-400 leading-normal font-semibold">
                        {warning 
                          ? "⚠️ High Susceptibility Notice: Your biology is currently sensitive. Give yourself extra grace, postpone highly difficult interpersonal negotiations, and prioritize sleep or nutrients."
                          : "🎉 Excellent Buffer Shield! Your cortical tissue has a sturdy biochemical barrier against emotional waves today."}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* --- WORKBOOK: Radical Acceptance Dialog --- */}
            {activeStrategy.id === 'dbt-radical-acceptance' && (
              <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pane A: Combatting Reality */}
                  <div className="space-y-1.5 p-3.5 bg-rose-50/20 border border-rose-100/50 rounded-2xl">
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block font-mono">Resisting Reality (Suffering state)</span>
                    <textarea 
                      rows={2.5}
                      value={radicalLog.fightStatement}
                      onChange={(e) => setRadicalLog(prev => ({ ...prev, fightStatement: e.target.value }))}
                      placeholder="e.g., It shouldn't be raining today! This always happens, it completely ruins my planned run and makes me furious."
                      className="w-full text-xs font-semibold p-2.5 bg-white border border-rose-200/50 focus:border-rose-400 focus:outline-none rounded-xl"
                    />
                  </div>

                  {/* Pane B: Adopting radical acceptance */}
                  <div className="space-y-1.5 p-3.5 bg-emerald-50/10 border border-emerald-100/50 rounded-2xl">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block font-mono">Consenting to Reality (Radical Acceptance)</span>
                    <textarea 
                      rows={2.5}
                      disabled={!radicalLog.fightStatement}
                      value={radicalLog.acceptStatement}
                      onChange={(e) => setRadicalLog(prev => ({ ...prev, acceptStatement: e.target.value }))}
                      placeholder="e.g., The fact is that it is raining. I cannot stop the sky. Resenting the rain won't dry the pavement. I will do an indoor bodyweight routine instead."
                      className="w-full text-xs font-semibold p-2.5 bg-white border border-emerald-200/50 focus:border-emerald-400 focus:outline-none rounded-xl disabled:opacity-45"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!radicalLog.acceptStatement.trim()}
                  onClick={() => {
                    setRadicalLog(prev => ({ ...prev, saved: true }));
                    handleLogToLocalStorage('Radical Acceptance Commitment', radicalLog);
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Log Acceptance Commitment Statement</span>
                </button>
              </div>
            )}

            {/* --- WORKBOOK FOR DEFAULTS --- */}
            {!['cbt-behavioral-activation', 'cbt-downward-arrow', 'cbt-responsibility-pie', 'dbt-dear-man', 'dbt-please-vulnerability', 'dbt-radical-acceptance'].includes(activeStrategy.id) && (
              <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center space-y-3">
                <Compass className="w-10 h-10 text-indigo-400 mx-auto animate-spin-slow" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Coping protocol checklist unlocked</h4>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed max-w-sm mx-auto mt-1">
                    Complete the physical practices outlined in the "{activeStrategy.name}" description guide above. Tap below when complete to log your self-regulated mastery point!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleLogToLocalStorage(activeStrategy.name, { completed: true, timestamp: Date.now() });
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition cursor-pointer"
                >
                  Confirm Implementation & Log Effort
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
