import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from './LANCEGame/LANCEGameContext';
import { 
  User, Users, Edit3, ShieldAlert, CheckCircle2, Heart, Shield, 
  ArrowRight, Share2, Printer, Smile, Info, BookOpen, Activity, 
  Plus, Trash2, HeartHandshake, Eye, Compass, RefreshCw
} from 'lucide-react';

// Interfaces matching TST ER Guide worksheet structure
interface PhaseData {
  id: 'regulated' | 'revving' | 'reexperiencing' | 'reconstituting';
  title: string;
  subtitle: string;
  desc: string;
  color: string;
  glowColor: string;
  bgColor: string;
  borderColor: string;
  // Step 1: Understanding Emotions
  affect: string; // What you feel, face shows, body feels like
  awareness: string; // What you are thinking, paying attention to, spaced out?
  action: string; // What you are doing, saying, feel like doing
  // Step 2: Guide to Managing
  thingsICanDo: string[];
  thingsOthersCanHelp: string[];
}

interface ErGuideData {
  customTitle: string;
  authorBy: string;
  recipientFor: string;
  lastUpdated: string;
  phases: Record<string, PhaseData>;
}

const DEFAULT_PHASES: Record<string, PhaseData> = {
  regulated: {
    id: 'regulated',
    title: 'Regulated',
    subtitle: 'Being in Control',
    desc: 'Feeling OK, calm, connected, and in stable psychological charge.',
    color: 'text-emerald-700',
    glowColor: 'bg-emerald-500',
    bgColor: 'bg-emerald-50/50',
    borderColor: 'border-emerald-200',
    affect: 'I feel warm, my breathing is deep and slow, my chest is relaxed, and my face shows a soft, approachable expression.',
    awareness: 'My thoughts are clear, structured, and focused in the present. I can easily pay attention to others and make logical decisions.',
    action: 'I am speaking in a calm, steady tone. I am sitting or standing comfortably, following my routines, and resting properly.',
     thingsICanDo: [
      'Practice 4-7-8 breathing to sustain vagal safety',
      'Log my positive experiences in the Gratitude Journal',
      'Set clear SMART goals for my day',
      'Do a brief morning clarity walk'
    ],
    thingsOthersCanHelp: [
      'Remind me that they appreciate my balance and presence',
      'Engage in meaningful conversations with me',
      'Collaborate on structured daily tasks together'
    ]
  },
  revving: {
    id: 'revving',
    title: 'Revving',
    subtitle: 'Getting Upset',
    desc: 'The beginning of irritation, stress, physical tightness, or agitation.',
    color: 'text-amber-700',
    glowColor: 'bg-amber-500',
    bgColor: 'bg-amber-50/50',
    borderColor: 'border-amber-200',
    affect: 'My heart rate is beginning to accelerate. My jaw is clenching, shoulders feel tight, and chest breathing feels slightly shallow.',
    awareness: 'I feel distracted. My mind keeps circling back to the stressor. I am becoming highly vigilant and impatient.',
    action: 'My speech is getting faster and sharper. I am tapping my feet, running my hands through my hair, or pacing agitatedly.',
    thingsICanDo: [
      'Stop what I am doing and do a 4-second box-breathing exercise',
      'Use the CBT Reframer Gym to identify cognitive distortions',
      'Initiate a somatic posture reset stretching loop',
      'Change my immediate physical room or sensory environment'
    ],
    thingsOthersCanHelp: [
      'Gently say: "I see you are feeling tight. Let\'s pause for a moment."',
      'Offer me a glass of refreshing cold water',
      'Help me step away from high-stimulation triggers'
    ]
  },
  reexperiencing: {
    id: 'reexperiencing',
    title: 'Re-experiencing',
    subtitle: 'Losing Control',
    desc: 'Severe distress, panic state, feeling triggered, trauma memories, or high anger.',
    color: 'text-rose-700',
    glowColor: 'bg-rose-500',
    bgColor: 'bg-rose-50/50',
    borderColor: 'border-rose-200',
    affect: 'I feel intense physiological panic, a racing heart, sweating, shaking, hot flashes, or cold numbed extremities.',
    awareness: 'My mind is completely overwhelmed by danger signals or flashbacks. I am highly spaced out, dissociated, or catastrophizing.',
    action: 'I am screaming, crying, retreating into isolation, or yelling. I feel a strong primitive impulse to flee, hide, or strike out.',
    thingsICanDo: [
      'Squeeze my stomach core in a muscle shield and release',
      'Hold ice-cold water or cold compress on my eyes to trigger the mammalian dive reflex',
      'Apply the 5-4-3-2-1 sensory grounding exercise immediately',
      'Paint raw colors onto the Art Therapy canvas to externalize the wordless overload'
    ],
    thingsOthersCanHelp: [
      'Stand at a safe, non-threatening distance and stay incredibly quiet and calm',
      'Repeat slowly: "You are safe here. This is 2026. The past is not happening right now."',
      'Hold a cold pack or damp towel ready for me'
    ]
  },
  reconstituting: {
    id: 'reconstituting',
    title: 'Reconstituting',
    subtitle: 'Getting It Back Together',
    desc: 'Autonomic systems settling down, recovering emotional safety, and reflecting.',
    color: 'text-indigo-700',
    glowColor: 'bg-indigo-500',
    bgColor: 'bg-indigo-50/50',
    borderColor: 'border-indigo-200',
    affect: 'My heartbeat is finally slowing, though my body feels exhausted, heavy, or slightly sore. My muscles are releasing.',
    awareness: 'I am beginning to recall where I am. A sense of fatigue or exhaustion sets in, paired with mild confusion or guilt.',
    action: 'I am sitting quietly, taking deep sighing breaths, wrapping myself in a blanket, or speaking in a soft whisper.',
    thingsICanDo: [
      'Create a soothing, low-stimulation Sand Tray to find peaceful containment',
      'Listen to the Forest Soundscape tracking with deep breathing',
      'Write down what triggered me in a soft, non-judgmental diary log',
      'Drink a warm cup of herbal chamomile tea'
    ],
    thingsOthersCanHelp: [
      'Reassure me with kind, non-demanding phrases like: "You did great. It\'s over now. Take all the time you need."',
      'Provide me with comfortable blankets or pillows in a quiet space',
      'Refrain from asking analytical "Why did you do that?" questions immediately'
    ]
  }
};

const SUGGESTIONS = {
  affect: [
    'Heavy shallow breaths, fast heart rate',
    'Tight clensing jaw and frozen posture',
    'Warm relaxation, slow rhythmic pulse',
    'Crying, trembling hands, tight chest cavity',
    'Feel spaced out, numb, or separate from the body'
  ],
  awareness: [
    'Catastrophizing, thinking everything is ruined',
    'Clear logical thoughts, presence, feeling secure',
    'Tunnel vision focus on the source of irritation',
    'Scattered focus, foggy thoughts, feeling lost',
    'Mind feels empty, suspended, or deeply exhausted'
  ],
  action: [
    'Pacing, tapping feet, speaking fast and loud',
    'Moving slowly, resting beneath a heavy blanket',
    'Screaming, throwing things, or isolating immediately',
    'Speaking calmly, keeping friendly eye contact',
    'Writing things out, drawing shapes organically'
  ]
};

export default function ErGuideSpace() {
  const { userName } = useGame();
  const defaultAuthor = `${userName || 'Me'} & Therapist`;
  const defaultRecipient = `${userName || 'Me'}, Parent, & Clinical Team`;

  const [guide, setGuide] = useState<ErGuideData>(() => {
    const saved = localStorage.getItem('therapy_er_guide_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.phases && parsed.phases.regulated) {
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing ER Guide data", e);
      }
    }
    return {
      customTitle: "My Personal Emotion Regulation Plan",
      authorBy: defaultAuthor,
      recipientFor: defaultRecipient,
      lastUpdated: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
      phases: { ...DEFAULT_PHASES }
    };
  });

  const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'summary'>('step1');
  const [selectedPhaseId, setSelectedPhaseId] = useState<keyof typeof DEFAULT_PHASES>('regulated');
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [metaTitle, setMetaTitle] = useState(guide.customTitle);
  const [metaAuthor, setMetaAuthor] = useState(guide.authorBy);
  const [metaRecipient, setMetaRecipient] = useState(guide.recipientFor);
  const [newSelfAction, setNewSelfAction] = useState('');
  const [newPeerAction, setNewPeerAction] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('therapy_er_guide_data', JSON.stringify(guide));
  }, [guide]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleUpdatePhaseText = (field: 'affect' | 'awareness' | 'action', value: string) => {
    setGuide(prev => {
      const updatedPhase = { ...prev.phases[selectedPhaseId], [field]: value };
      return {
        ...prev,
        lastUpdated: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
        phases: {
          ...prev.phases,
          [selectedPhaseId]: updatedPhase
        }
      };
    });
  };

  const handleAddSuggestedText = (field: 'affect' | 'awareness' | 'action', suggestion: string) => {
    const currentText = guide.phases[selectedPhaseId][field];
    const newText = currentText 
      ? `${currentText.trim()} ${suggestion}`
      : suggestion;
    handleUpdatePhaseText(field, newText);
    triggerToast(`Added to ${field}!`);
  };

  const handleAddSelfAction = () => {
    if (!newSelfAction.trim()) return;
    setGuide(prev => {
      const p = prev.phases[selectedPhaseId];
      const updated = {
        ...p,
        thingsICanDo: [...p.thingsICanDo, newSelfAction.trim()]
      };
      return {
        ...prev,
        lastUpdated: new Date().toLocaleDateString(),
        phases: { ...prev.phases, [selectedPhaseId]: updated }
      };
    });
    setNewSelfAction('');
    triggerToast("Coping mechanism added!");
  };

  const handleAddPeerAction = () => {
    if (!newPeerAction.trim()) return;
    setGuide(prev => {
      const p = prev.phases[selectedPhaseId];
      const updated = {
        ...p,
        thingsOthersCanHelp: [...p.thingsOthersCanHelp, newPeerAction.trim()]
      };
      return {
        ...prev,
        lastUpdated: new Date().toLocaleDateString(),
        phases: { ...prev.phases, [selectedPhaseId]: updated }
      };
    });
    setNewPeerAction('');
    triggerToast("Support strategy added!");
  };

  const handleDeleteSelfAction = (index: number) => {
    setGuide(prev => {
      const p = prev.phases[selectedPhaseId];
      const updated = {
        ...p,
        thingsICanDo: p.thingsICanDo.filter((_, i) => i !== index)
      };
      return {
        ...prev,
        phases: { ...prev.phases, [selectedPhaseId]: updated }
      };
    });
    triggerToast("Item removed");
  };

  const handleDeletePeerAction = (index: number) => {
    setGuide(prev => {
      const p = prev.phases[selectedPhaseId];
      const updated = {
        ...p,
        thingsOthersCanHelp: p.thingsOthersCanHelp.filter((_, i) => i !== index)
      };
      return {
        ...prev,
        phases: { ...prev.phases, [selectedPhaseId]: updated }
      };
    });
    triggerToast("Item removed");
  };

  const handleSaveMetadata = () => {
    setGuide(prev => ({
      ...prev,
      customTitle: metaTitle || "My Personal Emotion Regulation Plan",
      authorBy: metaAuthor || defaultAuthor,
      recipientFor: metaRecipient || defaultRecipient,
      lastUpdated: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    }));
    setIsEditingMetadata(false);
    triggerToast("Guide credentials updated!");
  };

  const handleResetToDefault = () => {
    if (window.confirm("Are you sure you want to restore the therapist pre-filled template entries? This will override your current changes.")) {
      setGuide({
        customTitle: "My Personal Emotion Regulation Plan",
        authorBy: defaultAuthor,
        recipientFor: defaultRecipient,
        lastUpdated: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
        phases: { ...DEFAULT_PHASES }
      });
      setMetaTitle("My Personal Emotion Regulation Plan");
      setMetaAuthor(defaultAuthor);
      setMetaRecipient(defaultRecipient);
      triggerToast("Template restored successfully!");
    }
  };

  const activePhase = guide.phases[selectedPhaseId];

  // Printable layout trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left" id="tst-er-guide-container">
      {/* Toast Notification element */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-teal-900 text-white border border-teal-700 font-bold text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 pointer-events-none"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[3px]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro Description & Header block */}
      <div className="bg-white rounded-3xl border border-teal-600/10 p-6 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full opacity-60 -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <span className="text-[10px] bg-teal-50 border border-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
              Autonomic Regulation Suite
            </span>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600 block shrink-0" />
              <h2 className="font-display text-2xl font-black text-gray-900 tracking-tight leading-tight">
                Trauma Systems Therapy ER Guide
              </h2>
            </div>
            <p className="text-gray-500 text-xs font-medium leading-relaxed">
              Based on the clinical TST Emotion Regulation framework, this interactive workbook maps how your physical state transitions from <strong>Regulated</strong> down to <strong>Re-experiencing</strong>, and allows you to compile personalized, direct coping interventions.
            </p>
          </div>

          <div className="flex gap-2 shrink-0 self-start">
            <button
              onClick={handleResetToDefault}
              className="px-3 py-1.5 border border-slate-200 text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
              title="Reset matrix to clinical template values"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Template</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#3d627f] hover:bg-[#3d627f]/90 text-white rounded-xl text-[10px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export/Print</span>
            </button>
          </div>
        </div>

        {/* Dynamic metadata setup */}
        <div className="bg-slate-50/75 rounded-2xl border border-slate-100 p-4 relative">
          {isEditingMetadata ? (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-1.5">
                <span className="text-[10px] font-black uppercase text-slate-500 font-mono">EDITING WORKBOOK CREDENTIALS</span>
                <span className="text-[10px] text-slate-400 font-semibold italic">Draft Changes</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase font-bold text-slate-400">PLAN TITLE / NAME</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="e.g. My Custom Safety Guide"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase font-bold text-slate-400">PREPARED BY (AUTHOR)</label>
                  <input
                    type="text"
                    value={metaAuthor}
                    onChange={(e) => setMetaAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="e.g. Alex & Counselor"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase font-bold text-slate-400">FOR (AUDIENCE / RECIPIENTS)</label>
                  <input
                    type="text"
                    value={metaRecipient}
                    onChange={(e) => setMetaRecipient(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="e.g. Alex, Therapist, Parent"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-1.5">
                <button
                  onClick={() => setIsEditingMetadata(false)}
                  className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMetadata}
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-xs text-slate-800 uppercase tracking-tight">{guide.customTitle}</span>
                  <button 
                    onClick={() => {
                      setMetaTitle(guide.customTitle);
                      setMetaAuthor(guide.authorBy);
                      setMetaRecipient(guide.recipientFor);
                      setIsEditingMetadata(true);
                    }}
                    className="p-1 hover:bg-slate-200 text-slate-400 rounded-lg transition"
                    title="Edit Workbook metadata properties"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400 shrink-0" />
                    Authored by: <strong className="text-slate-700">{guide.authorBy}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400 shrink-0" />
                    Shared with: <strong className="text-slate-700">{guide.recipientFor}</strong>
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 bg-white border border-slate-100 px-2.5 py-1 rounded-lg shrink-0 font-mono text-left font-bold sm:text-right">
                LAST REVISED: {guide.lastUpdated}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation subtab control bar matching the Quicksand style */}
      <div className="flex justify-center p-1 bg-white border border-slate-100 rounded-2xl w-full max-w-sm mx-auto shadow-xs">
        {[
          { id: 'step1' as const, label: 'Step 1: Understand' },
          { id: 'step2' as const, label: 'Step 2: Manage' },
          { id: 'summary' as const, label: '📊 Safety Summary' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all cursor-pointer text-center ${
              activeTab === tab.id
                ? 'bg-black text-white shadow-xs'
                : 'text-slate-400 hover:text-black font-semibold'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TST Autonomic Curve Selector - Animated and highly visually pleasing */}
      {activeTab !== 'summary' && (
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm text-center space-y-3.5 relative overflow-hidden">
          <div className="text-[10px] text-slate-400 font-extrabold font-mono tracking-widest uppercase">
            TST AUTONOMIC EXCITABILITY & BIO-STATE PROFILE
          </div>

          {/* Autonomic slope graph (SVG) with stick figures on it */}
          <div className="relative w-full h-[130px] bg-slate-50/50 rounded-2xl border border-slate-100 overflow-visible flex items-center justify-center">
            <svg viewBox="0 0 400 120" className="w-full h-full p-2 overflow-visible select-none">
              {/* Grid guide lines */}
              <line x1="20" y1="20" x2="380" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="60" x2="380" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="100" x2="380" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Dynamic Path matching the TST slide down -> climb up */}
              <path 
                d="M 40,30 Q 140,40 180,95 T 320,50" 
                fill="none" 
                stroke="#cbd5e1" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />

              {/* Colorful progress overlay indicator */}
              <path 
                d={
                  selectedPhaseId === 'regulated' ? "M 40,30 Z" :
                  selectedPhaseId === 'revving' ? "M 40,30 Q 140,40 150,55" :
                  selectedPhaseId === 'reexperiencing' ? "M 40,30 Q 140,40 180,95" :
                  "M 40,30 Q 140,40 180,95 T 320,50"
                }
                fill="none" 
                stroke={
                  selectedPhaseId === 'regulated' ? '#10b981' :
                  selectedPhaseId === 'revving' ? '#f59e0b' :
                  selectedPhaseId === 'reexperiencing' ? '#f43f5e' : '#6366f1'
                }
                strokeWidth="4" 
                strokeLinecap="round"
                className="transition-all duration-700"
              />

              {/* State Nodes */}
              {[
                { id: 'regulated', cx: 40, cy: 30, color: '#10b981', label: 'Regulated' },
                { id: 'revving', cx: 120, cy: 45, color: '#f59e0b', label: 'Revving' },
                { id: 'reexperiencing', cx: 180, cy: 95, color: '#f43f5e', label: 'Losing Control' },
                { id: 'reconstituting', cx: 320, cy: 50, color: '#6366f1', label: 'Reconstitution' }
              ].map((node) => {
                const isSelected = selectedPhaseId === node.id;
                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer group"
                    onClick={() => setSelectedPhaseId(node.id as any)}
                  >
                    {/* Ring highlight */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={isSelected ? 10 : 6} 
                      fill="white" 
                      stroke={node.color}
                      strokeWidth={isSelected ? 4 : 2}
                      className="transition-all duration-300 shadow-sm"
                    />
                    {/* Outer hover halo */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={15} 
                      fill={node.color}
                      opacity={isSelected ? 0.15 : 0}
                      className="group-hover:opacity-10 transition-all"
                    />
                    
                    {/* Stick figures illustrations on the slope */}
                    {node.id === 'regulated' && (
                      <g transform={`translate(${node.cx - 5}, ${node.cy - 22}) scale(0.6)`}>
                        <circle cx="8" cy="4" r="3" fill="none" stroke={node.color} strokeWidth="1.5" />
                        <line x1="8" y1="7" x2="8" y2="15" stroke={node.color} strokeWidth="1.5" />
                        <line x1="3" y1="10" x2="13" y2="10" stroke={node.color} strokeWidth="1.5" />
                        <line x1="8" y1="15" x2="5" y2="23" stroke={node.color} strokeWidth="1.5" />
                        <line x1="8" y1="15" x2="11" y2="23" stroke={node.color} strokeWidth="1.5" />
                      </g>
                    )}
                    {node.id === 'revving' && (
                      <g transform={`translate(${node.cx - 6}, ${node.cy - 24}) scale(0.6)`}>
                        <circle cx="8" cy="4" r="3" fill="none" stroke={node.color} strokeWidth="1.5" />
                        <line x1="8" y1="7" x2="8" y2="15" stroke={node.color} strokeWidth="1.5" />
                        <line x1="4" y1="12" x2="12" y2="8" stroke={node.color} strokeWidth="1.5" />
                        <line x1="8" y1="15" x2="4" y2="23" stroke={node.color} strokeWidth="1.5" />
                        <line x1="8" y1="15" x2="10" y2="23" stroke={node.color} strokeWidth="1.5" />
                      </g>
                    )}
                    {node.id === 'reexperiencing' && (
                      <g transform={`translate(${node.cx - 8}, ${node.cy - 23}) scale(0.6)`}>
                        <circle cx="8" cy="4" r="3" fill="none" stroke={node.color} strokeWidth="1.5" />
                        <line x1="8" y1="7" x2="10" y2="13" stroke={node.color} strokeWidth="1.5" />
                        <line x1="4" y1="4" x2="14" y2="4" stroke={node.color} strokeWidth="1.5" />
                        <line x1="10" y1="13" x2="4" y2="20" stroke={node.color} strokeWidth="1.5" />
                        <line x1="10" y1="13" x2="14" y2="21" stroke={node.color} strokeWidth="1.5" />
                      </g>
                    )}
                    {node.id === 'reconstituting' && (
                      <g transform={`translate(${node.cx - 5}, ${node.cy - 23}) scale(0.6)`}>
                        <circle cx="8" cy="4" r="3" fill="none" stroke={node.color} strokeWidth="1.5" />
                        <line x1="8" y1="7" x2="8" y2="15" stroke={node.color} strokeWidth="1.5" />
                        <line x1="4" y1="12" x2="12" y2="12" stroke={node.color} strokeWidth="1.5" />
                        <line x1="8" y1="15" x2="5" y2="23" stroke={node.color} strokeWidth="1.5" />
                        <line x1="8" y1="15" x2="11" y2="23" stroke={node.color} strokeWidth="1.5" />
                      </g>
                    )}

                    <text 
                      x={node.cx} 
                      y={node.cy + (node.id === 'reexperiencing' ? -15 : 22)} 
                      textAnchor="middle" 
                      fill={isSelected ? '#0f172a' : '#94a3b8'} 
                      fontSize="9" 
                      fontWeight={isSelected ? '900' : 'bold'}
                      className="transition-all tracking-tight"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Tab buttons below graph */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-50 border border-slate-100 rounded-2xl">
            {(Object.keys(guide.phases) as Array<keyof typeof DEFAULT_PHASES>).map(key => {
              const phase = guide.phases[key];
              const isSelected = selectedPhaseId === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPhaseId(key)}
                  className={`py-2 px-1 text-center rounded-xl transition duration-150 cursor-pointer flex flex-col justify-center items-center gap-0.5 border ${
                    isSelected 
                      ? 'bg-neutral-800 border-neutral-700 text-white shadow-xs' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <span className={`text-[10px] font-black leading-none ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {phase.title}
                  </span>
                  <span className="text-[7.5px] uppercase font-bold text-slate-400 leading-none font-mono">
                    {phase.subtitle.replace('Being in', '').trim()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: UNDERSTANDING YOUR EMOTIONS VIEW */}
      {activeTab === 'step1' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide font-mono">
              <span className={`w-2 h-2 rounded-full ${activePhase.glowColor}`} />
              Clinical Attributes: {activePhase.title} ({activePhase.subtitle})
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold">{activePhase.desc}</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-5">
            {/* 1. AFFECT ROW */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-[11.5px] font-black text-slate-900 uppercase tracking-wider font-mono">AFFECT</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">What you feel inside, what your face displays, what your body feels like.</p>
                </div>
                <SuggestionBadge field="affect" list={SUGGESTIONS.affect} onAdd={handleAddSuggestedText} />
              </div>
              <textarea
                value={activePhase.affect}
                onChange={(e) => handleUpdatePhaseText('affect', e.target.value)}
                className="w-full h-20 p-3 text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-teal-500 rounded-xl focus:outline-none transition-all leading-relaxed font-semibold text-slate-700"
                placeholder="Describe physiological sensations here..."
              />
            </div>

            {/* 2. AWARENESS ROW */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-[11.5px] font-black text-slate-900 uppercase tracking-wider font-mono">AWARENESS</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">What you are thinking, what you are paying attention to, are you zoned out?</p>
                </div>
                <SuggestionBadge field="awareness" list={SUGGESTIONS.awareness} onAdd={handleAddSuggestedText} />
              </div>
              <textarea
                value={activePhase.awareness}
                onChange={(e) => handleUpdatePhaseText('awareness', e.target.value)}
                className="w-full h-20 p-3 text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-teal-500 rounded-xl focus:outline-none transition-all leading-relaxed font-semibold text-slate-700"
                placeholder="Describe mental status, focus, or cognitive thoughts here..."
              />
            </div>

            {/* 3. ACTION ROW */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-[11.5px] font-black text-slate-900 uppercase tracking-wider font-mono">ACTION</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">What you are physically doing, saying, or what you feel strongly driven to do.</p>
                </div>
                <SuggestionBadge field="action" list={SUGGESTIONS.action} onAdd={handleAddSuggestedText} />
              </div>
              <textarea
                value={activePhase.action}
                onChange={(e) => handleUpdatePhaseText('action', e.target.value)}
                className="w-full h-20 p-3 text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-teal-500 rounded-xl focus:outline-none transition-all leading-relaxed font-semibold text-slate-700"
                placeholder="Describe outward behavior, speech patterns, or motor triggers here..."
              />
            </div>
          </div>

          {/* Educational callout */}
          <div className="p-4 bg-teal-50/60 border border-teal-100/50 rounded-2xl flex items-start gap-2 text-left">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p className="text-[10.5px] text-slate-600 font-medium leading-relaxed">
              <strong>TST Workbook Tip:</strong> Understanding your state parameters <em>before</em> escalation occurs makes it significantly easier to practice healthy secondary action steps. Try writing details exactly as they feel during typical days!
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: GUIDE TO MANAGING YOUR EMOTIONS VIEW */}
      {activeTab === 'step2' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide font-mono">
              <span className={`w-2 h-2 rounded-full ${activePhase.glowColor}`} />
              Crisis Management: {activePhase.title} Stage
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold">Define exactly what you can do individually, and what other people can do to support you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* SELF COPING ACTIONS ("Things You Can Do") */}
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="space-y-1 flex items-center gap-2">
                <div className="p-1.5 bg-teal-50 text-teal-700 rounded-lg shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11.5px] font-black text-slate-900 uppercase tracking-wider font-mono">My Coping Tools</h4>
                  <p className="text-[9.5px] text-slate-400 font-extrabold tracking-tight">THINGS I CAN INDEPENDENTLY DO TO REMAIN SAFE</p>
                </div>
              </div>

              {/* Item input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSelfAction}
                  onChange={(e) => setNewSelfAction(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSelfAction()}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none placeholder-slate-400 font-semibold text-slate-700"
                  placeholder="e.g. Stop and take 5 deep chest resets"
                />
                <button
                  type="button"
                  onClick={handleAddSelfAction}
                  className="px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Existing Self-Coping List with Action Shortcuts inside! */}
              <div className="space-y-1.5">
                {activePhase.thingsICanDo.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">No coping tools specified yet. Add one above!</p>
                ) : (
                  activePhase.thingsICanDo.map((item, idx) => (
                    <div 
                      key={idx}
                      className="group p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-start justify-between gap-3 text-left transition"
                    >
                      <div className="space-y-1 flex-1">
                        <p className="text-xs font-bold text-gray-50 *0 leading-tight">{item}</p>
                        {/* Interactive trigger links to other sections which matches the "lived-in" premium feel */}
                        <ActivityLinks text={item} />
                      </div>
                      <button
                        onClick={() => handleDeleteSelfAction(idx)}
                        className="text-slate-300 hover:text-red-500 p-0.5 rounded transition opacity-60 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* PEER & SOCIAL SUPPORT ("Things an Adult or Friend Can Assist with") */}
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="space-y-1 flex items-center gap-2">
                <div className="p-1.5 bg-rose-50 text-rose-700 rounded-lg shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11.5px] font-black text-slate-900 uppercase tracking-wider font-mono">Co-Regulation Support</h4>
                  <p className="text-[9.5px] text-slate-400 font-extrabold tracking-tight">HOW FRIENDS, PARENTS, OR PROVIDERS CAN DIRECTLY HELP</p>
                </div>
              </div>

              {/* Item input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPeerAction}
                  onChange={(e) => setNewPeerAction(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPeerAction()}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-rose-500 focus:outline-none placeholder-slate-400 font-semibold text-slate-700"
                  placeholder="e.g. Remind me of my physical target values"
                />
                <button
                  type="button"
                  onClick={handleAddPeerAction}
                  className="px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Existing Peer list */}
              <div className="space-y-1.5">
                {activePhase.thingsOthersCanHelp.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">No support mechanisms specified yet. Add one above!</p>
                ) : (
                  activePhase.thingsOthersCanHelp.map((item, idx) => (
                    <div 
                      key={idx}
                      className="group p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-start justify-between gap-3 text-left transition"
                    >
                      <p className="text-xs font-bold text-gray-700 leading-tight flex-1">{item}</p>
                      <button
                        onClick={() => handleDeletePeerAction(idx)}
                        className="text-slate-300 hover:text-red-500 p-0.5 rounded transition opacity-60 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SUMMARY OVERVIEW VIEW (PRINT-FRIENDLY & CLINICALLY ELEGANT) */}
      {activeTab === 'summary' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-left relative overflow-hidden space-y-6 max-w-4xl mx-auto printable-workbook">
          {/* Aesthetic border */}
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-teal-600" />

          {/* Clinician's letterhead block */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-4 border-b border-gray-100 gap-4">
            <div className="space-y-1">
              <h3 className="font-display font-black text-lg text-[#3d627f] tracking-tight uppercase">
                TST EMOTION REGULATION GUIDE
              </h3>
              <p className="text-[10.5px] font-bold text-slate-500">
                A trauma-informed collaborative security and coping plan.
              </p>
            </div>
            <div className="text-slate-400 text-[10px] font-mono text-left sm:text-right font-medium leading-relaxed">
              <div>PLAN NAME: <strong>{guide.customTitle}</strong></div>
              <div>AUTHORED BY: <strong>{guide.authorBy}</strong></div>
              <div>REVISION DATE: {guide.lastUpdated}</div>
            </div>
          </div>

          {/* Main 4 row grid breakdown summary */}
          <div className="space-y-6">
            {(Object.keys(guide.phases) as Array<keyof typeof DEFAULT_PHASES>).map(key => {
              const phase = guide.phases[key];
              let phaseTitleColor = 'text-emerald-700';
              let phaseBadgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-100';
              
              if (phase.id === 'revving') {
                phaseTitleColor = 'text-amber-700';
                phaseBadgeColor = 'bg-amber-50 text-amber-800 border-amber-100';
              } else if (phase.id === 'reexperiencing') {
                phaseTitleColor = 'text-rose-700';
                phaseBadgeColor = 'bg-rose-50 text-rose-800 border-rose-100';
              } else if (phase.id === 'reconstituting') {
                phaseTitleColor = 'text-indigo-700';
                phaseBadgeColor = 'bg-indigo-50 text-indigo-800 border-indigo-100';
              }

              return (
                <div 
                  key={phase.id}
                  className="p-5 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-4 text-left"
                >
                  {/* Title banner */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[9.5px] font-extrabold uppercase tracking-wider font-mono ${phaseBadgeColor}`}>
                        {phase.title}
                      </span>
                      <span className="text-xs text-slate-400 font-bold italic">({phase.subtitle})</span>
                    </div>
                    <span className="text-[10.5px] font-semibold text-slate-500">{phase.desc}</span>
                  </div>

                  {/* S1 & S2 Grid elements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* S1: Physical awareness */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">1. UNDERSTANDING STATE STATE</h5>
                      <div className="space-y-1.5 text-[11px] font-semibold text-slate-700 leading-relaxed">
                        <div>
                          <span className="text-[9.5px] font-black uppercase text-slate-400 block font-mono">AFFECT:</span>
                          <p>{phase.affect || 'None cataloged.'}</p>
                        </div>
                        <div>
                          <span className="text-[9.5px] font-black uppercase text-slate-400 block font-mono">AWARENESS:</span>
                          <p>{phase.awareness || 'None cataloged.'}</p>
                        </div>
                        <div>
                          <span className="text-[9.5px] font-black uppercase text-slate-400 block font-mono">ACTION DETECTORS:</span>
                          <p>{phase.action || 'None cataloged.'}</p>
                        </div>
                      </div>
                    </div>

                    {/* S2: Coping tools */}
                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                      <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">2. ACTIONABLE COPING & SUPPORT</h5>
                      
                      <div className="space-y-2.5">
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-heavy text-teal-800 uppercase tracking-wider font-mono block">THINGS I CAN DO (SELF):</span>
                          {phase.thingsICanDo.length === 0 ? (
                            <p className="text-[10.5px] italic text-slate-400 font-medium">No coping items added.</p>
                          ) : (
                            <ul className="list-disc pl-4 text-[11px] font-semibold text-slate-600 space-y-0.5">
                              {phase.thingsICanDo.map((item, idx) => <li key={idx}>{item}</li>)}
                            </ul>
                          )}
                        </div>

                        <div className="space-y-1 border-t border-slate-100 pt-1.5">
                          <span className="text-[9.5px] font-heavy text-rose-800 uppercase tracking-wider font-mono block">THINGS OTHERS CAN DO (PEERS):</span>
                          {phase.thingsOthersCanHelp.length === 0 ? (
                            <p className="text-[10.5px] italic text-slate-400 font-medium">No co-regulation support added.</p>
                          ) : (
                            <ul className="list-disc pl-4 text-[11px] font-semibold text-slate-600 space-y-0.5">
                              {phase.thingsOthersCanHelp.map((item, idx) => <li key={idx}>{item}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Safe closure signature line */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="italic font-normal">Created collaboratively inside the Autonomic Mindspace Workspace.</span>
            <div className="flex gap-4">
              <span className="border-b border-gray-300 w-36 py-1 block text-left">Client Signature:</span>
              <span className="border-b border-gray-300 w-36 py-1 block text-left">Witness / Clinician:</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers Suggestion Button Badge List
function SuggestionBadge({ 
  field, 
  list, 
  onAdd 
}: { 
  field: 'affect' | 'awareness' | 'action', 
  list: string[], 
  onAdd: (field: 'affect' | 'awareness' | 'action', sug: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[9.5px] rounded-lg font-black uppercase tracking-wide transition flex items-center gap-1 cursor-pointer"
      >
        <span>+ Suggested Markers</span>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 bg-white border border-slate-200 shadow-lg rounded-xl p-2 w-52 text-left z-35 space-y-1 animate-slide-up">
            <span className="text-[8.5px] uppercase font-bold text-slate-400 block tracking-tight px-1 pb-1">Click to instantly insert:</span>
            {list.map((sug, i) => (
              <button
                key={i}
                onClick={() => {
                  onAdd(field, sug);
                  setIsOpen(false);
                }}
                className="w-full text-left px-2 py-1.5 text-[10px] text-slate-700 hover:bg-slate-50 rounded-lg font-semibold whitespace-normal leading-normal transition-colors cursor-pointer block border border-transparent hover:border-slate-100"
              >
                {sug}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Active triggers logic shortcuts. Detects keywords and provides deep linking
function ActivityLinks({ text }: { text: string }) {
  const lowercase = text.toLowerCase();
  
  const handleJumpToSection = (targetTab: string, subTab?: string) => {
    // We can dispatch a global event or click the DOM navbar trigger elements
    const elementId = `nav-tab-${targetTab}`;
    const el = document.getElementById(elementId);
    if (el) {
      (el as HTMLButtonElement).click();
      
      // If we have subtabs, let's wait a moment and click the subtab button
      if (subTab) {
        setTimeout(() => {
          // Find buttons with target id or text content
          const subEl = document.querySelector(`button[id*="${subTab}"], button[onClick*="${subTab}"]`) as HTMLButtonElement;
          if (subEl) {
            subEl.click();
          } else {
            // Backup selector for general subtabs matching text or simple clickers
            const buttons = Array.from(document.querySelectorAll('button'));
            const matchingBtn = buttons.find(b => 
              b.textContent?.toLowerCase().includes(subTab) ||
              b.textContent?.toLowerCase().includes(subTab.replace('_', ' '))
            );
            if (matchingBtn) {
              (matchingBtn as HTMLButtonElement).click();
            }
          }
        }, 120);
      }
    }
  };

  const isBreathing = lowercase.includes('breath') || lowercase.includes('inhale');
  const isCbt = lowercase.includes('cbt') || lowercase.includes('reframe') || lowercase.includes('thought');
  const isDbt = lowercase.includes('dbt') || lowercase.includes('skills') || lowercase.includes('mammalian') || lowercase.includes('cold');
  const isGratitude = lowercase.includes('gratitude') || lowercase.includes('thankful') || lowercase.includes('journal');
  const isArt = lowercase.includes('art') || lowercase.includes('paint') || lowercase.includes('drawing') || lowercase.includes('canvas');
  const isSand = lowercase.includes('sand') || lowercase.includes('tray');

  if (isBreathing) {
    return (
      <button 
        onClick={() => handleJumpToSection('practice', 'breathing')}
        className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 hover:underline bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100 cursor-pointer"
      >
        <span className="text-[9px]">🧘</span> Launch Breathwork Guide
      </button>
    );
  }
  if (isCbt) {
    return (
      <button 
        onClick={() => handleJumpToSection('practice', 'cbt')}
        className="inline-flex items-center gap-1 text-[10px] font-black text-teal-700 hover:underline bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100 cursor-pointer"
      >
        <span className="text-[9px]">🧠</span> Open CBT Thought Record
      </button>
    );
  }
  if (isDbt) {
    return (
      <button 
        onClick={() => handleJumpToSection('practice', 'dbt')}
        className="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 hover:underline bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 cursor-pointer"
      >
        <span className="text-[9px]">🚨</span> Go to DBT Rescue Plan
      </button>
    );
  }
  if (isGratitude) {
    return (
      <button 
        onClick={() => handleJumpToSection('practice', 'gratitude')}
        className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 hover:underline bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100 cursor-pointer"
      >
        <span className="text-[9px]">💖</span> Write a Gratitude Post
      </button>
    );
  }
  if (isArt) {
    return (
      <button 
        onClick={() => handleJumpToSection('activity', 'art')}
        className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-700 hover:underline bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 cursor-pointer"
      >
        <span className="text-[9px]">🎨</span> Open Art Studio Canvas
      </button>
    );
  }
  if (isSand) {
    return (
      <button 
        onClick={() => handleJumpToSection('activity', 'sandtray')}
        className="inline-flex items-center gap-1 text-[10px] font-black text-sky-700 hover:underline bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100 cursor-pointer"
      >
        <span className="text-[9px]">🏜️</span> Open Sand Tray Universe
      </button>
    );
  }

  return null;
}
