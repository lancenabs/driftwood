import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, ChevronDown, ChevronUp, Check, Heart } from 'lucide-react';

interface MirrorEntry {
  id: string;
  date: string;
  realSelf: string;
  idealSelf: string;
  congruence: number;
  gapNarrative: string;
  regardReframe: string;
  acceptanceVow: string;
}

const REGARD_PROMPTS = [
  'Even with this gap, I am fundamentally worthy of care because…',
  'If my best friend had this same discrepancy, I would tell them…',
  'The part of me that already IS enough right now is…',
  'I can hold this imperfection with compassion by recognizing…',
];

const CONGRUENCE_COLORS = (v: number) => {
  if (v >= 75) return '#16a34a';
  if (v >= 50) return '#0891b2';
  if (v >= 30) return '#d97706';
  return '#dc2626';
};

const CONGRUENCE_LABELS = (v: number) => {
  if (v >= 80) return 'High Integration — Real and Ideal selves are well aligned.';
  if (v >= 60) return 'Moderate Alignment — Some growth edges, but core health is present.';
  if (v >= 40) return 'Notable Gap — Important growth work available here.';
  if (v >= 20) return 'Significant Incongruence — Compassionate inquiry needed.';
  return 'Deep Split — Unconditional positive regard is the foundation right now.';
};

export default function RogerianCongruenceMirror() {
  const [entries, setEntries] = useState<MirrorEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('therapy_rogerian_mirror') || '[]'); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [promptIdx, setPromptIdx] = useState(0);

  const [realSelf, setRealSelf] = useState('');
  const [idealSelf, setIdealSelf] = useState('');
  const [congruence, setCongruence] = useState(50);
  const [gapNarrative, setGapNarrative] = useState('');
  const [regardReframe, setRegardReframe] = useState('');
  const [acceptanceVow, setAcceptanceVow] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('therapy_rogerian_mirror', JSON.stringify(entries));
  }, [entries]);

  const resetForm = () => {
    setRealSelf(''); setIdealSelf(''); setCongruence(50);
    setGapNarrative(''); setRegardReframe(''); setAcceptanceVow(''); setSaved(false);
  };

  const handleSave = () => {
    if (!realSelf.trim() || !idealSelf.trim()) return;
    const entry: MirrorEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      realSelf: realSelf.trim(), idealSelf: idealSelf.trim(),
      congruence, gapNarrative: gapNarrative.trim(),
      regardReframe: regardReframe.trim(), acceptanceVow: acceptanceVow.trim(),
    };
    setEntries(prev => [entry, ...prev]);
    setSaved(true);
    setTimeout(() => { resetForm(); setShowForm(false); }, 1200);
  };

  const inputCls = 'w-full border-2 border-slate-200 focus:border-sky-400 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none transition bg-white placeholder:text-slate-400 font-medium';
  const textareaCls = `${inputCls} resize-none min-h-[80px]`;
  const color = CONGRUENCE_COLORS(congruence);

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ background: '#1CB0F618' }}>🪞</div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#0092CC' }}>Carl Rogers · Person-Centered Therapy</div>
            <h2 className="text-lg font-black leading-tight" style={{ color: '#3C3C3C' }}>Rogerian Congruence Mirror</h2>
          </div>
        </div>
        <p className="text-xs leading-relaxed font-medium" style={{ color: '#6B7280' }}>
          "The curious paradox is that when I accept myself just as I am, then I can change." Rogers held that psychological health emerges when our Real Self and Ideal Self are congruent — and that Unconditional Positive Regard (accepting yourself with no strings attached) is the healing agent.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🪞', label: 'Congruence', desc: 'Real ≈ Ideal Self overlap' },
          { icon: '💙', label: 'Unconditional Regard', desc: 'Worth without conditions' },
          { icon: '🌱', label: 'Actualizing Tendency', desc: 'Innate drive toward growth' },
        ].map(p => (
          <div key={p.label} className="rounded-2xl p-3 text-center bg-white" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #DFF3FF' }}>
            <div className="text-xl mb-1">{p.icon}</div>
            <div className="text-[10px] font-black uppercase tracking-wide" style={{ color: '#3C3C3C' }}>{p.label}</div>
            <div className="text-[11px] mt-0.5 font-medium" style={{ color: '#6B7280' }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {!showForm && (
        <motion.button whileTap={{ y: 3, boxShadow: 'none' }} onClick={() => setShowForm(true)} className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white" style={{ background: 'linear-gradient(135deg, #1CB0F6, #38bdf8)', boxShadow: '0 5px 0 #0092CC' }}>
          <Plus className="w-4 h-4" /> New Congruence Assessment
        </motion.button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white border-2 border-sky-200 rounded-2xl p-5 space-y-5">

            {/* Real Self */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-sky-700 mb-2">① Real Self — Who am I actually right now?</div>
              <textarea className={textareaCls} placeholder="Describe yourself honestly as you are today — traits, patterns, behaviors, emotional tendencies…" value={realSelf} onChange={e => setRealSelf(e.target.value)} />
            </div>

            {/* Ideal Self */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-sky-700 mb-2">② Ideal Self — Who do I believe I should be?</div>
              <textarea className={textareaCls} placeholder="Describe your idealized self — the version you strive toward, believe you ought to be, or feel pressured to become…" value={idealSelf} onChange={e => setIdealSelf(e.target.value)} />
            </div>

            {/* Congruence Slider */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-sky-700 mb-3">③ Congruence Calibration</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500">Real Self</span>
                <span className="text-lg font-black" style={{ color }}>{congruence}%</span>
                <span className="text-[10px] font-bold text-slate-500">Ideal Self</span>
              </div>

              {/* Visual overlap */}
              <div className="relative h-12 mb-3">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-sky-300 bg-sky-100 opacity-80 z-10" />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-emerald-400 bg-emerald-100 opacity-80 z-10 transition-all duration-300"
                  style={{ left: `${(1 - congruence / 100) * 60}%` }}
                />
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
              </div>

              <input type="range" min={0} max={100} value={congruence} onChange={e => setCongruence(Number(e.target.value))}
                className="w-full h-2 rounded-full outline-none cursor-pointer" style={{ accentColor: color }} />
              <p className="text-[11px] font-semibold mt-2 text-center" style={{ color }}>{CONGRUENCE_LABELS(congruence)}</p>
            </div>

            {/* Gap Narrative */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-sky-700 mb-2">④ The Gap — What's in between?</div>
              <textarea className={textareaCls} placeholder="What conditions, introjects (messages from others), or internal demands are creating the gap between who you are and who you believe you must be?" value={gapNarrative} onChange={e => setGapNarrative(e.target.value)} />
            </div>

            {/* UPR Reframe */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-sky-700 mb-2">⑤ Unconditional Positive Regard — Reframe</div>
              <div className="flex gap-2 mb-2 flex-wrap">
                {REGARD_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => { setPromptIdx(i); setRegardReframe(p); }}
                    className={`text-[10px] font-bold px-2.5 py-2 rounded-lg border transition ${promptIdx === i ? 'bg-sky-500 text-white border-sky-500' : 'bg-sky-50 text-sky-700 border-sky-200'}`}>
                    Prompt {i + 1}
                  </button>
                ))}
              </div>
              <textarea className={textareaCls} placeholder={REGARD_PROMPTS[promptIdx]} value={regardReframe} onChange={e => setRegardReframe(e.target.value)} />
            </div>

            {/* Acceptance Vow */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-sky-700 mb-2">⑥ Acceptance Vow</div>
              <input className={inputCls} placeholder="One sentence of unconditional self-acceptance you can carry with you today…" value={acceptanceVow} onChange={e => setAcceptanceVow(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={!realSelf.trim() || !idealSelf.trim() || saved}
                className="flex-1 py-3 rounded-xl font-black text-sm text-white transition active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: saved ? '#16a34a' : 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Mirror Session'}
              </button>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition active:scale-95">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length > 0 && (
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Previous Sessions</div>
          <div className="space-y-3">
            {entries.map(entry => (
              <div key={entry.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div role="button" tabIndex={0} className="w-full flex items-center justify-between p-4 text-left cursor-pointer" onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(expandedId === entry.id ? null : entry.id); } }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: CONGRUENCE_COLORS(entry.congruence) }} />
                      <div className="text-xs font-black text-slate-800">{entry.congruence}% Congruence</div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{entry.date} · Real: "{entry.realSelf.slice(0, 40)}…"</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setEntries(prev => prev.filter(e2 => e2.id !== entry.id)); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 transition rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    {expandedId === entry.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedId === entry.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-100">
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div><div className="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-1">Real Self</div><p className="text-xs text-slate-700 font-medium">{entry.realSelf}</p></div>
                          <div><div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Ideal Self</div><p className="text-xs text-slate-700 font-medium">{entry.idealSelf}</p></div>
                        </div>
                        {entry.regardReframe && <div><div className="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-1">Unconditional Positive Regard</div><p className="text-xs text-slate-700 font-medium italic">{entry.regardReframe}</p></div>}
                        {entry.acceptanceVow && <div className="bg-sky-50 rounded-xl p-3 border border-sky-200"><div className="text-[10px] font-black uppercase tracking-widest text-sky-700 mb-1">Acceptance Vow</div><p className="text-xs text-sky-900 font-bold">"{entry.acceptanceVow}"</p></div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && !showForm && (
        <div className="text-center py-10 text-slate-400">
          <div className="text-4xl mb-3">🪞</div>
          <p className="text-sm font-semibold">No sessions yet.</p>
          <p className="text-xs font-medium mt-1">Begin by describing your Real Self honestly.</p>
        </div>
      )}
    </div>
  );
}
