import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Check, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface AgencyPlan {
  id: string;
  date: string;
  goal: string;
  masteryWins: string[];
  viciousModels: string[];
  persuasionSelf: string[];
  somaticStrategy: string;
  efficiencyScore: number;
  commitmentStatement: string;
}

const MASTERY_PROMPTS = [
  'A time I succeeded at something similar…',
  'A small win I can start with this week…',
  'Evidence that I have the skills to begin…',
];
const VICARIOUS_PROMPTS = [
  'Someone I know who has done something like this…',
  'A mentor, leader, or peer I can observe…',
  'What specifically about their approach can I model?',
];

export default function BanduraAgencyBuilder() {
  const [plans, setPlans] = useState<AgencyPlan[]>(() => {
    try { return JSON.parse(localStorage.getItem('therapy_bandura_agency') || '[]'); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [goal, setGoal] = useState('');
  const [masteryWins, setMasteryWins] = useState(['']);
  const [viciousModels, setViciousModels] = useState(['']);
  const [persuasionSelf, setPersuasionSelf] = useState(['']);
  const [somaticStrategy, setSomaticStrategy] = useState('');
  const [efficiencyScore, setEfficiencyScore] = useState(5);
  const [commitmentStatement, setCommitmentStatement] = useState('');

  useEffect(() => {
    localStorage.setItem('therapy_bandura_agency', JSON.stringify(plans));
  }, [plans]);

  const resetForm = () => {
    setGoal(''); setMasteryWins(['']); setViciousModels(['']); setPersuasionSelf(['']);
    setSomaticStrategy(''); setEfficiencyScore(5); setCommitmentStatement(''); setSaved(false);
  };

  const handleSave = () => {
    if (!goal.trim()) return;
    const plan: AgencyPlan = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      goal: goal.trim(),
      masteryWins: masteryWins.filter(s => s.trim()),
      viciousModels: viciousModels.filter(s => s.trim()),
      persuasionSelf: persuasionSelf.filter(s => s.trim()),
      somaticStrategy: somaticStrategy.trim(),
      efficiencyScore,
      commitmentStatement: commitmentStatement.trim(),
    };
    setPlans(prev => [plan, ...prev]);
    setSaved(true);
    setTimeout(() => { resetForm(); setShowForm(false); }, 1200);
  };

  const updateList = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number, val: string) => {
    setter(prev => prev.map((s, i) => i === idx ? val : s));
  };
  const addToList = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter(prev => [...prev, '']);
  const removeFromList = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) => setter(prev => prev.filter((_, i) => i !== idx));

  const inputCls = 'w-full border-2 border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none transition bg-white placeholder:text-slate-400 font-medium';
  const textareaCls = `${inputCls} resize-none min-h-[72px]`;

  const efficacyLabel = (v: number) => {
    if (v <= 2) return 'Very low — I doubt I can do this at all';
    if (v <= 4) return 'Low — I have significant doubts';
    if (v <= 6) return 'Moderate — I think I might be able to';
    if (v <= 8) return 'High — I feel reasonably confident';
    return 'Very high — I believe I can do this';
  };

  const SOURCE_CARDS = [
    { icon: '🏆', label: 'Mastery Experiences', sublabel: 'Source 1 — Strongest predictor', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd', desc: 'Past successes build the strongest self-efficacy. Recall evidence that you have succeeded at related challenges.', items: masteryWins, setter: setMasteryWins, prompts: MASTERY_PROMPTS },
    { icon: '👁️', label: 'Vicarious Modeling', sublabel: 'Source 2 — Observational learning', color: '#0891b2', bg: '#ecfeff', border: '#67e8f9', desc: 'Watching similar people succeed raises your belief in your own capacity. Name your models.', items: viciousModels, setter: setViciousModels, prompts: VICARIOUS_PROMPTS },
    { icon: '💬', label: 'Verbal Persuasion', sublabel: 'Source 3 — Positive self-talk', color: '#059669', bg: '#ecfdf5', border: '#6ee7b7', desc: 'The things we tell ourselves matter. Write powerful, credible affirmations specific to THIS goal.', items: persuasionSelf, setter: setPersuasionSelf, prompts: ['I am capable of this because…', 'Others who know me well would say…', 'The evidence that I can handle this is…'] },
  ];

  return (
    <div className="space-y-5 pb-10" style={{ background: '#F9FAFB' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ background: '#1CB0F618' }}>💪</div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#1CB0F6' }}>Mindset Tool</div>
          <h2 className="text-sm font-black leading-none" style={{ color: '#3C3C3C' }}>Confidence Builder</h2>
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: '#FFFFFF', boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Albert Bandura · Social Cognitive Theory</div>
        <p className="text-xs leading-relaxed font-medium" style={{ color: '#6B7280' }}>
          "Whether you think you can or you can't, you're right." Self-efficacy — the belief in one's capacity to execute — is the single greatest predictor of achievement. This lab activates all four sources: Mastery, Modeling, Persuasion, and Physiological State.
        </p>
      </div>

      {/* Four sources */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: '🏆', label: 'Mastery', desc: 'Past wins → confidence' },
          { icon: '👁️', label: 'Modeling', desc: 'Watch others succeed' },
          { icon: '💬', label: 'Persuasion', desc: 'Credible self-talk' },
          { icon: '🧘', label: 'Somatic Calm', desc: 'Regulate body state' },
        ].map(p => (
          <div key={p.label} className="rounded-xl p-3" style={{ background: '#1CB0F614', border: '1px solid #1CB0F630' }}>
            <div className="text-xl mb-1">{p.icon}</div>
            <div className="text-[10px] font-black uppercase tracking-wide" style={{ color: '#0092CC' }}>{p.label}</div>
            <div className="text-[11px] mt-0.5 font-medium" style={{ color: '#0092CC' }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {!showForm && (
        <motion.button whileTap={{ y: 3, boxShadow: 'none' }} onClick={() => setShowForm(true)}
          className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white"
          style={{ background: 'linear-gradient(135deg, #1CB0F6, #58CC02)', boxShadow: '0 5px 0 #0092CC' }}>
          <Plus className="w-4 h-4" /> Build Agency Plan
        </motion.button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white border-2 border-blue-200 rounded-2xl p-5 space-y-5">

            {/* Goal */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-2">① Target Goal or Challenge</div>
              <input className={inputCls} placeholder="What specific action or goal are you building self-efficacy for?" value={goal} onChange={e => setGoal(e.target.value)} />
            </div>

            {/* Current Efficacy */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-2">② Current Self-Efficacy Rating</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500 font-medium">0 — No confidence</span>
                <span className="text-base font-black text-blue-600">{efficiencyScore}/10</span>
                <span className="text-[10px] text-slate-500 font-medium">10 — Full confidence</span>
              </div>
              <input type="range" min={0} max={10} value={efficiencyScore} onChange={e => setEfficiencyScore(Number(e.target.value))}
                className="w-full h-2 rounded-full outline-none cursor-pointer" style={{ accentColor: '#1d4ed8' }} />
              <p className="text-[11px] text-blue-600 font-semibold mt-1 text-center">{efficacyLabel(efficiencyScore)}</p>
            </div>

            {/* Three sources */}
            {SOURCE_CARDS.map(sc => (
              <div key={sc.label}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{sc.icon}</span>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: sc.color }}>{sc.label}</div>
                    <div className="text-[9px] font-bold text-slate-400">{sc.sublabel}</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mb-2 font-medium">{sc.desc}</p>
                <div className="space-y-2">
                  {sc.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        className={`${inputCls} flex-1`}
                        style={{ borderColor: '#e2e8f0' }}
                        placeholder={sc.prompts[idx % sc.prompts.length]}
                        value={item}
                        onChange={e => updateList(sc.setter, idx, e.target.value)}
                      />
                      {idx > 0 && <button onClick={() => removeFromList(sc.setter, idx)} className="p-2 text-slate-400 hover:text-rose-500 transition"><Trash2 className="w-3.5 h-3.5" /></button>}
                    </div>
                  ))}
                  <button onClick={() => addToList(sc.setter)} className="text-[11px] font-bold flex items-center gap-1" style={{ color: sc.color }}>
                    <Plus className="w-3.5 h-3.5" /> Add another
                  </button>
                </div>
              </div>
            ))}

            {/* Somatic Strategy (Source 4) */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🧘</span>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-orange-600">Physiological State</div>
                  <div className="text-[9px] font-bold text-slate-400">Source 4 — Body as signal</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mb-2 font-medium">High arousal can be interpreted as anxiety or excitement. Name your somatic regulation strategy before approaching this goal.</p>
              <textarea className={textareaCls} placeholder="e.g. '4-7-8 breathing before I begin. I will interpret butterflies as excitement, not fear. I will notice tension in my shoulders and relax them deliberately.'" value={somaticStrategy} onChange={e => setSomaticStrategy(e.target.value)} />
            </div>

            {/* Commitment */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-2">③ Agency Commitment Statement</div>
              <input className={inputCls} placeholder="'I commit to taking the first step toward _____ by _____…'" value={commitmentStatement} onChange={e => setCommitmentStatement(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={!goal.trim() || saved}
                className="flex-1 py-3 rounded-xl font-black text-sm text-white transition active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: saved ? '#16a34a' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}>
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Agency Plan'}
              </button>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition active:scale-95">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {plans.length > 0 && (
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Agency Plans</div>
          <div className="space-y-3">
            {plans.map(plan => (
              <div key={plan.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div role="button" tabIndex={0} className="w-full flex items-center justify-between p-4 text-left cursor-pointer" onClick={() => setExpandedId(expandedId === plan.id ? null : plan.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(expandedId === plan.id ? null : plan.id); } }}>
                  <div>
                    <div className="text-xs font-black text-slate-800">{plan.goal}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full"><div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${plan.efficiencyScore * 10}%` }} /></div>
                      <span className="text-[10px] text-slate-400 font-medium">{plan.date} · Efficacy: {plan.efficiencyScore}/10</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setPlans(prev => prev.filter(p => p.id !== plan.id)); }} className="p-1.5 text-slate-300 hover:text-rose-500 transition rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    {expandedId === plan.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedId === plan.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-100">
                      <div className="p-4 space-y-3">
                        {plan.masteryWins.length > 0 && <div><div className="text-[9px] font-black uppercase tracking-widest text-purple-600 mb-1">Mastery Experiences</div>{plan.masteryWins.map((w, i) => <p key={i} className="text-xs text-slate-700 font-medium">• {w}</p>)}</div>}
                        {plan.viciousModels.length > 0 && <div><div className="text-[9px] font-black uppercase tracking-widest text-cyan-600 mb-1">Vicarious Models</div>{plan.viciousModels.map((m, i) => <p key={i} className="text-xs text-slate-700 font-medium">• {m}</p>)}</div>}
                        {plan.persuasionSelf.length > 0 && <div><div className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">Self-Talk Scripts</div>{plan.persuasionSelf.map((p, i) => <p key={i} className="text-xs text-slate-700 font-medium italic">"{p}"</p>)}</div>}
                        {plan.commitmentStatement && <div className="bg-blue-50 rounded-xl p-3 border border-blue-200"><div className="text-[9px] font-black uppercase tracking-widest text-blue-700 mb-1">Commitment</div><p className="text-xs text-blue-900 font-bold">"{plan.commitmentStatement}"</p></div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      {plans.length === 0 && !showForm && (
        <div className="text-center py-10 text-slate-400">
          <div className="text-4xl mb-3">⚡</div>
          <p className="text-sm font-semibold">No agency plans yet.</p>
          <p className="text-xs font-medium mt-1">Name a goal and activate all four efficacy sources.</p>
        </div>
      )}
    </div>
  );
}
