import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, MessageCircle, HelpCircle, CheckCircle, RefreshCw, AlertTriangle, ArrowRight, Play, Heart, Users } from 'lucide-react';

interface TaScenario {
  id: string;
  title: string;
  parentVoice: string;
  childReaction: string;
  adultResolution: string;
}

export default function TransactionalAnalysisBoard() {
  const [scenarios, setScenarios] = useState<TaScenario[]>(() => {
    const saved = localStorage.getItem('therapy_ta_scenarios');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ta-1',
        title: 'Career Performance Pressure',
        parentVoice: 'You must work constantly and perfectly. If you rest, you are lazy and letting everyone down.',
        childReaction: 'I am so exhausted and terrified. No matter what I do, it will never be enough, so why even try?',
        adultResolution: 'I hear the Parent voice attempting to ensure our financial safety, and I hear the exhaustion in the Child. The facts are: we have met our core milestones. I will take a 30-minute restorative walk now, as rest is essential for health.'
      }
    ];
  });

  const [activeScenarioId, setActiveScenarioId] = useState<string | null>('ta-1');
  const [newTitle, setNewTitle] = useState('');
  const [parentInput, setParentInput] = useState('');
  const [childInput, setChildInput] = useState('');
  const [adultInput, setAdultInput] = useState('');
  
  const [selectedScenario, setSelectedScenario] = useState<TaScenario | null>(scenarios[0]);

  // Modal State
  const [createModal, setCreateModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('therapy_ta_scenarios', JSON.stringify(scenarios));
  }, [scenarios]);

  useEffect(() => {
    const cur = scenarios.find(s => s.id === activeScenarioId);
    setSelectedScenario(cur || scenarios[0] || null);
  }, [activeScenarioId, scenarios]);

  const handleCreateScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const next: TaScenario = {
      id: `ta-${Date.now()}`,
      title: newTitle.trim(),
      parentVoice: parentInput.trim() || 'You should know better and do everything perfect.',
      childReaction: childInput.trim() || 'I can\'t do this, it\'s too hard and I\'m completely overwhelmed.',
      adultResolution: adultInput.trim() || 'Focusing on facts: I am doing one small task at a time. It does not need to be perfect to be complete.'
    };

    setScenarios([...scenarios, next]);
    setActiveScenarioId(next.id);
    setCreateModal(false);

    // Reset fields
    setNewTitle('');
    setParentInput('');
    setChildInput('');
    setAdultInput('');
  };

  const handleDeleteScenario = (id: string) => {
    const next = scenarios.filter(s => s.id !== id);
    setScenarios(next);
    if (activeScenarioId === id) {
      setActiveScenarioId(next[0]?.id || null);
    }
  };

  return (
    <div id="transactional-analysis-board" className="max-w-6xl mx-auto space-y-6 text-left">
      
      {/* Intro Header Banner */}
      <div className="rounded-3xl p-6 bg-white relative overflow-hidden" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}>
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ background: '#14B8A618' }}>🎭</div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#0D9488' }}>Eric Berne · Transactional Analysis (TA)</div>
              <h2 className="text-lg font-black leading-tight" style={{ color: '#3C3C3C' }}>Ego State Alignment Board</h2>
            </div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
            In Transactional Analysis we dissect thoughts by separating them into three <strong style={{ color: '#3C3C3C' }}>Ego States — Parent, Adult, Child (the "PAC" model)</strong>: the <strong style={{ color: '#3C3C3C' }}>Parent</strong> (copied rules, judgment, critical warnings), the <strong style={{ color: '#3C3C3C' }}>Child</strong> (adapted somatic fear, playfulness, core wounds), and the <strong style={{ color: '#3C3C3C' }}>Adult</strong> (objective, logical fact-processor in the here-and-now). Resolving conflict means activating the conscious Adult state.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Side: PAC Scenario Navigator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl p-5 bg-white space-y-4" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                PAC Conflict Scenarios
              </h3>
              <motion.button
                whileTap={{ y: 2, boxShadow: 'none' }}
                type="button"
                onClick={() => setCreateModal(true)}
                className="min-h-[40px] py-2 px-3 rounded-xl text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition"
                style={{ background: '#14B8A6', boxShadow: '0 3px 0 #0D9488' }}
              >
                <span>New PAC analysis</span>
              </motion.button>
            </div>

            <div className="space-y-2">
              {scenarios.map((s) => (
                // div[role=button] host: a real <button> cannot contain the delete <button> (invalid HTML)
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveScenarioId(s.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveScenarioId(s.id); } }}
                  className="w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group bg-white cursor-pointer"
                  style={activeScenarioId === s.id
                    ? { background: '#14B8A60F', borderColor: '#14B8A6' }
                    : { borderColor: '#F0F0F0' }}
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-black truncate max-w-[200px] xl:max-w-[250px]" style={{ color: '#3C3C3C' }}>
                      {s.title}
                    </h4>
                    <p className="text-[11px] font-semibold truncate max-w-[210px] xl:max-w-[260px]" style={{ color: '#6B7280' }}>
                      A: {s.adultResolution}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScenario(s.id);
                    }}
                    aria-label={`Delete scenario ${s.title}`}
                    className="w-9 h-9 flex items-center justify-center rounded transition shrink-0"
                    style={{ color: '#9CA3AF' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl text-[11px] font-semibold leading-relaxed" style={{ background: '#F9FAFB', border: '1px solid #F0F0F0', color: '#6B7280' }}>
              <span className="font-black block uppercase mb-1" style={{ color: '#3C3C3C' }}>Ego States Explanation (Parent / Adult / Child):</span>
              • <strong style={{ color: '#DB2777' }}>Parent State (P):</strong> "Should", "Must", critical dialogue or patronizing fear warnings.<br/>
              • <strong style={{ color: '#0092CC' }}>Child State (C):</strong> Fear of failing, helpless, defensive shame, rebellion.<br/>
              • <strong style={{ color: '#0D9488' }}>Adult State (A):</strong> Responds to facts and safe physical boundaries here and now.
            </div>
          </div>
        </div>

        {/* Right Side: PAC Interactive Deconstruction Board (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedScenario ? (
            <div className="rounded-3xl p-6 bg-white space-y-5" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}>

              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-black tracking-tight flex items-baseline gap-2" style={{ color: '#3C3C3C' }}>
                    <span>{selectedScenario.title}</span>
                  </h3>
                  <p className="text-[11px] uppercase font-bold tracking-wider" style={{ color: '#9CA3AF' }}>PAC Dialogue Mapping Breakdown</p>
                </div>
              </div>

              {/* PAC Interactive Flow Diagrams */}
              <div className="space-y-4">

                {/* 1. Parent Voice Node */}
                <div className="p-4 rounded-2xl text-left relative overflow-hidden" style={{ background: '#FDF2F8', border: '1px solid #FBCFE8' }}>
                  <div className="absolute top-2 right-3 px-2 py-1 rounded text-[10px] font-black uppercase" style={{ background: '#FCE7F3', color: '#DB2777' }}>
                    Ego State: Parent (P)
                  </div>
                  <div className="text-3xl absolute bottom-2 right-4 opacity-10">🛡️</div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 mb-1" style={{ color: '#DB2777' }}>
                    <span>🚨 Moralizing or Copied Voice / Threat:</span>
                  </h4>
                  <p className="text-xs font-semibold leading-relaxed" style={{ color: '#831843' }}>
                    "{selectedScenario.parentVoice}"
                  </p>
                </div>

                {/* Arrow Connector Indicator */}
                <div className="flex justify-center my-1 select-none pointer-events-none">
                  <div className="w-[1px] h-6 border-l flex items-center justify-center" style={{ borderColor: '#E5E7EB' }}>
                    <span className="text-[10px] bg-white px-2" style={{ color: '#9CA3AF' }}>Trigger Reaction</span>
                  </div>
                </div>

                {/* 2. Child State Node */}
                <div className="p-4 rounded-2xl text-left relative overflow-hidden" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                  <div className="absolute top-2 right-3 px-2 py-1 rounded text-[10px] font-black uppercase" style={{ background: '#FFEDD5', color: '#CC7A00' }}>
                    Ego State: Child (C)
                  </div>
                  <div className="text-3xl absolute bottom-2 right-4 opacity-10">🥺</div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 mb-1" style={{ color: '#CC7A00' }}>
                    <span>🔥 Reactive Somatic / Emotional Pain:</span>
                  </h4>
                  <p className="text-xs font-semibold leading-relaxed" style={{ color: '#7C2D12' }}>
                    "{selectedScenario.childReaction}"
                  </p>
                </div>

                {/* Arrow Resolution Connector */}
                <div className="flex justify-center my-1 select-none pointer-events-none">
                  <div className="w-[1px] h-6 border-l flex items-center justify-center" style={{ borderColor: '#A7F3D0' }}>
                    <span className="text-[10px] px-2 rounded border" style={{ color: '#0D9488', background: '#F0FDFA', borderColor: '#99F6E4' }}>Adult Logic Intervenes</span>
                  </div>
                </div>

                {/* 3. Conscious Adult Resolution Node */}
                <div className="p-4 rounded-2xl text-left relative overflow-hidden" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <div className="absolute top-2 right-3 px-2 py-1 rounded text-[10px] font-black uppercase text-white" style={{ background: '#0D9488' }}>
                    Ego State: Adult (A) — Resolved
                  </div>
                  <div className="text-3xl absolute bottom-2 right-4 opacity-15">🧠</div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 mb-1" style={{ color: '#0D9488' }}>
                    <span>✨ Reality Check & Boundary Setting Statement:</span>
                  </h4>
                  <p className="text-xs font-bold leading-relaxed" style={{ color: '#064E3B' }}>
                    {selectedScenario.adultResolution}
                  </p>
                </div>

              </div>

              {/* Interactive Fact checker tool */}
              <div className="p-4 rounded-2xl space-y-2.5" style={{ background: '#F9FAFB', border: '1px solid #F0F0F0' }}>
                <span className="text-[11px] uppercase tracking-wider font-extrabold block" style={{ color: '#6B7280' }}>
                  Interactive Adult-State Fact Checker Matrix:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs leading-normal" style={{ color: '#374151' }}>
                  <div className="bg-white p-3 rounded-xl space-y-1" style={{ border: '1px solid #F0F0F0' }}>
                    <strong className="text-[11px] block font-black" style={{ color: '#3C3C3C' }}>1. What are the material, present facts?</strong>
                    <p className="text-[11px] font-semibold italic" style={{ color: '#6B7280' }}>What can be measured physically right now without predictions of catastrophe?</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl space-y-1" style={{ border: '1px solid #F0F0F0' }}>
                    <strong className="text-[11px] block font-black" style={{ color: '#3C3C3C' }}>2. What boundaries are required?</strong>
                    <p className="text-[11px] font-semibold italic" style={{ color: '#6B7280' }}>Where does the Child need safety comforting and the Parent demands boundaries?</p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-[300px] rounded-3xl border border-dashed flex flex-col items-center justify-center text-center p-6 space-y-3" style={{ background: '#F9FAFB', borderColor: '#D1D5DB' }}>
              <Users className="w-12 h-12" style={{ color: '#D1D5DB' }} />
              <div>
                <h3 className="text-sm font-black" style={{ color: '#3C3C3C' }}>No active PAC analysis scenario</h3>
                <p className="text-xs font-semibold max-w-sm mt-0.5" style={{ color: '#9CA3AF' }}>
                  Begin a new Transactional Analysis dissection board to analyze internal moralizing and reactive child conflicts.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal form for New Scenario */}
      {createModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-left"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                <span>🛡️ New PAC Conflict Scenario</span>
              </h3>
              <button
                type="button"
                onClick={() => setCreateModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border text-slate-400 hover:bg-slate-50 hover:text-slate-700 text-sm font-black select-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateScenario} className="space-y-3 px-1 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Scenario Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asking my manager for dynamic leave, Social boundaries block..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl py-2.5 px-3 focus:ring-1 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Parent Voice Statement:</label>
                <textarea
                  required
                  placeholder="What is the critical rule/moral statement? e.g. 'You should never say no to requests otherwise you are selfish.'"
                  value={parentInput}
                  onChange={(e) => setParentInput(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl py-2.5 px-3 focus:ring-1 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Child Reactive Reaction:</label>
                <textarea
                  required
                  placeholder="What is the adapted somatic fear / rebellion? e.g. 'I feel completely guilty and want to hide under my bed.'"
                  value={childInput}
                  onChange={(e) => setChildInput(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl py-2.5 px-3 focus:ring-1 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Adult Reality-checking resolve statement:</label>
                <textarea
                  required
                  placeholder="State objective measurements here: e.g. 'I am contracted for 38 hours. My boundary is valid. Resting preserves my capability.'"
                  value={adultInput}
                  onChange={(e) => setAdultInput(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl py-2.5 px-3 focus:ring-1 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <motion.button
                whileTap={{ y: 2, boxShadow: 'none' }}
                type="submit"
                className="w-full min-h-[44px] py-3 text-white text-[11px] font-black uppercase tracking-wider rounded-xl"
                style={{ background: '#14B8A6', boxShadow: '0 3px 0 #0D9488' }}
              >
                Assemble PAC Matrix Map
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
