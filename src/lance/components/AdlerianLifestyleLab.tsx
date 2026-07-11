import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Check, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface DomainAnalysis {
  domain: string;
  emoji: string;
  inferiorityRating: number;
  inferiorityBelief: string;
  compensationStyle: string;
  socialInterestAction: string;
}

interface LabSession {
  id: string;
  date: string;
  earlyMemory: string;
  birthOrder: string;
  familyConstellation: string;
  coreLifeGoal: string;
  domains: DomainAnalysis[];
  gemeinschaftsgefuhl: string;
}

const BIRTH_ORDERS = ['First-born', 'Middle child', 'Youngest', 'Only child', 'Twin', 'Other'];
const COMPENSATION_STYLES = [
  'Overachievement / Striving',
  'Withdrawal / Avoidance',
  'Aggression / Dominance',
  'Helplessness / Dependency',
  'Perfectionism',
  'Humor / Deflection',
  'Social superiority',
  'Creative detour',
];

const DOMAINS: Omit<DomainAnalysis, 'inferiorityRating' | 'inferiorityBelief' | 'compensationStyle' | 'socialInterestAction'>[] = [
  { domain: 'Work & Achievement', emoji: '💼' },
  { domain: 'Friendship & Community', emoji: '🤝' },
  { domain: 'Love & Intimacy', emoji: '❤️' },
];

const SOCIAL_INTEREST_PROMPTS: Record<string, string> = {
  'Work & Achievement': 'How can my work serve others, not just prove my worth?',
  'Friendship & Community': 'How can I contribute to this community without needing to be superior or invisible?',
  'Love & Intimacy': 'How can I show up as an equal partner rather than striving to dominate or escape?',
};

export default function AdlerianLifestyleLab() {
  const [sessions, setSessions] = useState<LabSession[]>(() => {
    try { return JSON.parse(localStorage.getItem('therapy_adlerian_lab') || '[]'); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedDomain, setExpandedDomain] = useState<number | null>(0);
  const [saved, setSaved] = useState(false);

  // Form
  const [earlyMemory, setEarlyMemory] = useState('');
  const [birthOrder, setBirthOrder] = useState('');
  const [familyConstellation, setFamilyConstellation] = useState('');
  const [coreLifeGoal, setCoreLifeGoal] = useState('');
  const [domains, setDomains] = useState<DomainAnalysis[]>(DOMAINS.map(d => ({ ...d, inferiorityRating: 5, inferiorityBelief: '', compensationStyle: '', socialInterestAction: '' })));
  const [gemeinschaftsgefuhl, setGemeinschaftsgefuhl] = useState('');

  useEffect(() => {
    localStorage.setItem('therapy_adlerian_lab', JSON.stringify(sessions));
  }, [sessions]);

  const updateDomain = (idx: number, field: keyof DomainAnalysis, value: any) => {
    setDomains(prev => prev.map((d, i) => i === idx ? { ...d, [field]: value } : d));
  };

  const resetForm = () => {
    setEarlyMemory(''); setBirthOrder(''); setFamilyConstellation(''); setCoreLifeGoal('');
    setDomains(DOMAINS.map(d => ({ ...d, inferiorityRating: 5, inferiorityBelief: '', compensationStyle: '', socialInterestAction: '' })));
    setGemeinschaftsgefuhl(''); setSaved(false);
  };

  const handleSave = () => {
    if (!earlyMemory.trim() || !coreLifeGoal.trim()) return;
    const session: LabSession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      earlyMemory: earlyMemory.trim(), birthOrder, familyConstellation: familyConstellation.trim(),
      coreLifeGoal: coreLifeGoal.trim(), domains: [...domains], gemeinschaftsgefuhl: gemeinschaftsgefuhl.trim(),
    };
    setSessions(prev => [session, ...prev]);
    setSaved(true);
    setTimeout(() => { resetForm(); setShowForm(false); }, 1200);
  };

  const inputCls = 'w-full border-2 border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none transition bg-white placeholder:text-slate-400 font-medium';
  const textareaCls = `${inputCls} resize-none min-h-[72px]`;

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #064e3b, #059669, #34d399)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🌿</div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Alfred Adler · Individual Psychology</div>
            <h2 className="text-lg font-black leading-tight">Adlerian Lifestyle Lab</h2>
          </div>
        </div>
        <p className="text-xs text-emerald-100 leading-relaxed font-medium">
          "The only normal people are the ones you don't know very well." Adler taught that we all carry inferiority feelings — and that health lies in redirecting that energy into Gemeinschaftsgefühl (Social Interest): contributing to community rather than compensating in isolation.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '⬇️', label: 'Inferiority Complex', desc: 'Overcompensated insecurity' },
          { icon: '🔄', label: 'Compensation', desc: 'Striving for superiority' },
          { icon: '🤝', label: 'Gemeinschaftsgefühl', desc: 'Social interest & belonging' },
        ].map(p => (
          <div key={p.label} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <div className="text-xl mb-1">{p.icon}</div>
            <div className="text-[10px] font-black text-emerald-900 uppercase tracking-wide break-words leading-tight">{p.label}</div>
            <div className="text-[9px] text-emerald-700 mt-0.5 font-medium">{p.desc}</div>
          </div>
        ))}
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white transition active:scale-95" style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
          <Plus className="w-4 h-4" /> New Lifestyle Analysis
        </button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white border-2 border-emerald-200 rounded-2xl p-5 space-y-5">

            {/* Early Memory */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-2">① Earliest Memory</div>
              <p className="text-[11px] text-slate-500 mb-2 font-medium">Adler viewed earliest memories as a window into core life themes and the self-created "lifestyle." What is your earliest clear memory?</p>
              <textarea className={textareaCls} placeholder="Describe your earliest memory — what happened, who was there, how you felt…" value={earlyMemory} onChange={e => setEarlyMemory(e.target.value)} />
            </div>

            {/* Birth Order */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-2">② Birth Order</div>
              <div className="flex flex-wrap gap-2">
                {BIRTH_ORDERS.map(b => (
                  <button key={b} onClick={() => setBirthOrder(b)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border-2 transition ${birthOrder === b ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{b}</button>
                ))}
              </div>
            </div>

            {/* Family Constellation */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-2">③ Family Constellation</div>
              <textarea className={textareaCls} placeholder="Describe your family dynamic — sibling relationships, parental expectations, who held what role…" value={familyConstellation} onChange={e => setFamilyConstellation(e.target.value)} />
            </div>

            {/* Core Life Goal */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-2">④ Core Life Goal (Fictional Finalism)</div>
              <p className="text-[11px] text-slate-500 mb-2 font-medium">Adler said we all move toward a "fictional final goal" — an idealized vision of completion. What is yours?</p>
              <input className={inputCls} placeholder="e.g. 'To be seen as highly competent so no one can criticize me…'" value={coreLifeGoal} onChange={e => setCoreLifeGoal(e.target.value)} />
            </div>

            {/* Three Life Tasks */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-3">⑤ Three Life Task Analysis</div>
              {domains.map((d, idx) => (
                <div key={d.domain} className="mb-3 border border-emerald-100 rounded-xl overflow-hidden">
                  <button className="w-full flex items-center gap-3 p-3 bg-emerald-50 text-left" onClick={() => setExpandedDomain(expandedDomain === idx ? null : idx)}>
                    <span className="text-lg">{d.emoji}</span>
                    <div className="flex-1">
                      <div className="text-xs font-black text-emerald-800">{d.domain}</div>
                      <div className="text-[10px] text-emerald-600 font-medium">Inferiority: {d.inferiorityRating}/10</div>
                    </div>
                    {expandedDomain === idx ? <ChevronUp className="w-4 h-4 text-emerald-500" /> : <ChevronDown className="w-4 h-4 text-emerald-500" />}
                  </button>
                  <AnimatePresence>
                    {expandedDomain === idx && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-4 space-y-3">
                          <div>
                            <div className="text-[10px] font-bold text-slate-500 mb-1">Inferiority Feeling Intensity</div>
                            <input type="range" min={1} max={10} value={d.inferiorityRating}
                              onChange={e => updateDomain(idx, 'inferiorityRating', Number(e.target.value))}
                              className="w-full h-2 rounded-full outline-none cursor-pointer" style={{ accentColor: '#059669' }} />
                            <div className="flex justify-between"><span className="text-[9px] text-slate-400">1 — Mild</span><span className="text-[9px] text-slate-400">10 — Crushing</span></div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-500 mb-1">Core Inferiority Belief in this domain</div>
                            <input className={inputCls} placeholder="e.g. 'I am fundamentally less capable than others at work…'" value={d.inferiorityBelief} onChange={e => updateDomain(idx, 'inferiorityBelief', e.target.value)} />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-500 mb-1">Compensation Style</div>
                            <div className="flex flex-wrap gap-1.5">
                              {COMPENSATION_STYLES.map(cs => (
                                <button key={cs} onClick={() => updateDomain(idx, 'compensationStyle', cs)}
                                  className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition ${d.compensationStyle === cs ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-emerald-700 border-emerald-200'}`}>{cs}</button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-emerald-700 mb-1">→ Social Interest Conversion</div>
                            <p className="text-[10px] text-slate-500 italic mb-1">{SOCIAL_INTEREST_PROMPTS[d.domain]}</p>
                            <textarea className={`${textareaCls} min-h-[60px]`} placeholder="How can I redirect this energy into genuine contribution?" value={d.socialInterestAction} onChange={e => updateDomain(idx, 'socialInterestAction', e.target.value)} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Gemeinschaftsgefühl */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-2">⑥ Gemeinschaftsgefühl — Your Social Interest Commitment</div>
              <p className="text-[11px] text-slate-500 mb-2 font-medium">Write one concrete commitment to contributing to others beyond personal gain.</p>
              <textarea className={textareaCls} placeholder="This week, I will genuinely contribute to community by…" value={gemeinschaftsgefuhl} onChange={e => setGemeinschaftsgefuhl(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={!earlyMemory.trim() || !coreLifeGoal.trim() || saved}
                className="flex-1 py-3 rounded-xl font-black text-sm text-white transition active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: saved ? '#16a34a' : 'linear-gradient(135deg, #059669, #34d399)' }}>
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Analysis'}
              </button>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition active:scale-95">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {sessions.length > 0 && (
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Previous Sessions</div>
          <div className="space-y-3">
            {sessions.map(session => (
              <div key={session.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div role="button" tabIndex={0} className="w-full flex items-center justify-between p-4 text-left cursor-pointer" onClick={() => setExpandedId(expandedId === session.id ? null : session.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(expandedId === session.id ? null : session.id); } }}>
                  <div>
                    <div className="text-xs font-black text-slate-800 line-clamp-1">{session.coreLifeGoal}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{session.date} · {session.birthOrder}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setSessions(prev => prev.filter(s => s.id !== session.id)); }} className="p-1.5 text-slate-300 hover:text-rose-500 transition rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    {expandedId === session.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedId === session.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-100">
                      <div className="p-4 space-y-3">
                        <div><div className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">Earliest Memory</div><p className="text-xs text-slate-700 font-medium">{session.earlyMemory}</p></div>
                        <div className="grid grid-cols-3 gap-2">
                          {session.domains.map(d => (
                            <div key={d.domain} className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                              <div className="text-base mb-1">{d.emoji}</div>
                              <div className="text-[9px] font-black text-emerald-800">{d.domain}</div>
                              <div className="text-[9px] text-emerald-600 font-bold mt-0.5">Inf: {d.inferiorityRating}/10</div>
                              {d.socialInterestAction && <div className="text-[9px] text-slate-600 font-medium mt-1 line-clamp-2">{d.socialInterestAction}</div>}
                            </div>
                          ))}
                        </div>
                        {session.gemeinschaftsgefuhl && <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200"><div className="text-[9px] font-black uppercase tracking-widest text-emerald-700 mb-1">Social Interest Commitment</div><p className="text-xs text-emerald-900 font-bold">"{session.gemeinschaftsgefuhl}"</p></div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && !showForm && (
        <div className="text-center py-10 text-slate-400">
          <div className="text-4xl mb-3">🌿</div>
          <p className="text-sm font-semibold">No lifestyle analyses yet.</p>
          <p className="text-xs font-medium mt-1">Begin with your earliest memory to uncover your core lifestyle.</p>
        </div>
      )}
    </div>
  );
}
