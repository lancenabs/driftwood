import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Check, ChevronDown, ChevronUp, Sun } from 'lucide-react';

interface PermaPillar {
  id: string;
  label: string;
  emoji: string;
  definition: string;
  rating: number;
  notes: string;
}

interface ExplanatoryStyleSession {
  id: string;
  date: string;
  setback: string;
  personalizationBelief: string;
  personalizationReframe: string;
  pervasivenessBeliefs: string;
  pervasivenessReframe: string;
  permanenceBelief: string;
  permanenceReframe: string;
  permaRatings: { id: string; rating: number; notes: string }[];
  hopefulExplanation: string;
}

const DEFAULT_PERMA: PermaPillar[] = [
  { id: 'positive_emotion', label: 'Positive Emotion', emoji: '😊', definition: 'Joy, gratitude, serenity, interest, hope, pride, amusement, inspiration, awe, love.', rating: 0, notes: '' },
  { id: 'engagement', label: 'Engagement', emoji: '🎯', definition: 'Flow states — deep absorption in activities matching your strengths.', rating: 0, notes: '' },
  { id: 'relationships', label: 'Relationships', emoji: '🤝', definition: 'Authentic, positive connections; being known, cared for, and contributing to others.', rating: 0, notes: '' },
  { id: 'meaning', label: 'Meaning', emoji: '🌠', definition: 'Belonging to and serving something beyond the individual self.', rating: 0, notes: '' },
  { id: 'accomplishment', label: 'Accomplishment', emoji: '🏆', definition: 'Achievement pursued for its own sake — mastery, perseverance, reaching goals.', rating: 0, notes: '' },
];

const THREE_P_LABELS = [
  { key: 'personalization', label: 'Personalization', icon: '👆', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', question: '"It\'s all my fault…"', healthyQ: 'Is this truly 100% my responsibility, or do external factors also play a role?' },
  { key: 'pervasiveness', label: 'Pervasiveness', icon: '🌐', color: '#d97706', bg: '#fffbeb', border: '#fcd34d', question: '"Everything is ruined…"', healthyQ: 'Is this really affecting ALL areas of my life, or just one specific domain?' },
  { key: 'permanence', label: 'Permanence', icon: '⏳', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd', question: '"This will always be this way…"', healthyQ: 'Is this truly permanent, or is it temporary and changeable?' },
];

export default function PositivePsychologyPermGym() {
  const [sessions, setSessions] = useState<ExplanatoryStyleSession[]>(() => {
    try { return JSON.parse(localStorage.getItem('therapy_perma_gym') || '[]'); } catch { return []; }
  });
  const [permaBase, setPermaBase] = useState<PermaPillar[]>(() => {
    try { return JSON.parse(localStorage.getItem('therapy_perma_pillars') || 'null') || DEFAULT_PERMA; } catch { return DEFAULT_PERMA; }
  });
  const [showForm, setShowForm] = useState(false);
  const [showPermaRater, setShowPermaRater] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [setback, setSetback] = useState('');
  const [pPersonBelief, setPPersonBelief] = useState('');
  const [pPersonReframe, setPPersonReframe] = useState('');
  const [pPervBelief, setPPervBelief] = useState('');
  const [pPervReframe, setPPervReframe] = useState('');
  const [pPermBelief, setPPermBelief] = useState('');
  const [pPermReframe, setPPermReframe] = useState('');
  const [sessionPerma, setSessionPerma] = useState(DEFAULT_PERMA.map(p => ({ id: p.id, rating: 5, notes: '' })));
  const [hopefulExplanation, setHopefulExplanation] = useState('');

  useEffect(() => { localStorage.setItem('therapy_perma_gym', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('therapy_perma_pillars', JSON.stringify(permaBase)); }, [permaBase]);

  const resetForm = () => {
    setSetback(''); setPPersonBelief(''); setPPersonReframe(''); setPPervBelief(''); setPPervReframe('');
    setPPermBelief(''); setPPermReframe(''); setHopefulExplanation('');
    setSessionPerma(DEFAULT_PERMA.map(p => ({ id: p.id, rating: 5, notes: '' }))); setSaved(false);
  };

  const handleSave = () => {
    if (!setback.trim()) return;
    const session: ExplanatoryStyleSession = {
      id: Date.now().toString(), date: new Date().toISOString().split('T')[0],
      setback: setback.trim(), personalizationBelief: pPersonBelief.trim(), personalizationReframe: pPersonReframe.trim(),
      pervasivenessBeliefs: pPervBelief.trim(), pervasivenessReframe: pPervReframe.trim(),
      permanenceBelief: pPermBelief.trim(), permanenceReframe: pPermReframe.trim(),
      permaRatings: sessionPerma, hopefulExplanation: hopefulExplanation.trim(),
    };
    setSessions(prev => [session, ...prev]);
    setSaved(true);
    setTimeout(() => { resetForm(); setShowForm(false); }, 1200);
  };

  const inputCls = 'w-full border-2 border-slate-200 focus:border-yellow-500 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none transition bg-white placeholder:text-slate-400 font-medium';
  const textareaCls = `${inputCls} resize-none min-h-[72px]`;

  const overallPerma = Math.round(permaBase.reduce((s, p) => s + p.rating, 0) / permaBase.length * 10);

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #713f12, #ca8a04, #facc15)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">☀️</div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Martin Seligman · Positive Psychology</div>
            <h2 className="text-lg font-black leading-tight">Positive Psychology PERMA Gym</h2>
          </div>
        </div>
        <p className="text-xs text-yellow-100 leading-relaxed font-medium">
          "The good life is using your signature strengths every day to produce authentic happiness and abundant gratification." Seligman's PERMA model and Explanatory Style work together — dismantle pessimistic thinking patterns and build a flourishing life architecture.
        </p>
      </div>

      {/* PERMA Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">PERMA Baseline</div>
            <div className="text-xl font-black text-slate-900">{overallPerma}%</div>
          </div>
          <button onClick={() => setShowPermaRater(!showPermaRater)} className="text-xs font-bold text-yellow-600 hover:text-yellow-800 transition flex items-center gap-1">
            Rate Pillars {showPermaRater ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
        <div className="flex gap-1.5">
          {permaBase.map(p => (
            <div key={p.id} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-base">{p.emoji}</div>
              <div className="w-full bg-slate-100 rounded-full h-12 flex flex-col-reverse overflow-hidden">
                <div className="w-full rounded-full transition-all duration-500" style={{ height: `${p.rating * 10}%`, background: '#ca8a04' }} />
              </div>
              <div className="text-[8px] font-black text-slate-500 text-center leading-tight">{p.label.split(' ')[0]}</div>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {showPermaRater && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4 space-y-3">
              {permaBase.map((pillar, idx) => (
                <div key={pillar.id} className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{pillar.emoji}</span>
                    <div>
                      <div className="text-xs font-black text-yellow-900">{pillar.label}</div>
                      <div className="text-[9px] text-yellow-700 font-medium">{pillar.definition}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="range" min={0} max={10} value={pillar.rating}
                      onChange={e => setPermaBase(prev => prev.map((p, i) => i === idx ? { ...p, rating: Number(e.target.value) } : p))}
                      className="flex-1 h-2 rounded-full outline-none cursor-pointer" style={{ accentColor: '#ca8a04' }} />
                    <span className="text-xs font-black text-yellow-600 w-6 text-right">{pillar.rating}</span>
                  </div>
                  <input className="w-full mt-2 border border-yellow-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-700 font-medium outline-none bg-white placeholder:text-slate-400 focus:border-yellow-400 transition"
                    placeholder="Notes on this pillar…" value={pillar.notes}
                    onChange={e => setPermaBase(prev => prev.map((p, i) => i === idx ? { ...p, notes: e.target.value } : p))} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3P Gym */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white transition active:scale-95" style={{ background: 'linear-gradient(135deg, #ca8a04, #facc15)' }}>
          <Plus className="w-4 h-4" /> New 3P Dismantling Session
        </button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white border-2 border-yellow-200 rounded-2xl p-5 space-y-5">

            {/* Setback */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-yellow-700 mb-2">① The Setback or Adversity</div>
              <textarea className={textareaCls} placeholder="Describe the setback, failure, or difficult situation you want to reframe…" value={setback} onChange={e => setSetback(e.target.value)} />
            </div>

            {/* 3 Ps */}
            {[
              { label: 'Personalization', icon: '👆', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', question: '"It\'s all my fault…"', healthyQ: 'Is this truly 100% my responsibility, or do external factors also play a role?', belief: pPersonBelief, setBelief: setPPersonBelief, reframe: pPersonReframe, setReframe: setPPersonReframe },
              { label: 'Pervasiveness', icon: '🌐', color: '#d97706', bg: '#fffbeb', border: '#fcd34d', question: '"Everything is ruined…"', healthyQ: 'Is this really affecting ALL areas of my life, or just this one domain?', belief: pPervBelief, setBelief: setPPervBelief, reframe: pPervReframe, setReframe: setPPervReframe },
              { label: 'Permanence', icon: '⏳', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd', question: '"This will always be this way…"', healthyQ: 'Is this truly permanent, or is it temporary and likely to change?', belief: pPermBelief, setBelief: setPPermBelief, reframe: pPermReframe, setReframe: setPPermReframe },
            ].map(p => (
              <div key={p.label} className="rounded-xl border-2 p-4 space-y-3" style={{ borderColor: p.border, background: p.bg }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.icon}</span>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide" style={{ color: p.color }}>Dismantling {p.label}</div>
                    <div className="text-[10px] font-medium text-slate-500 italic">{p.question}</div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 mb-1">Pessimistic belief:</div>
                  <textarea className={`${textareaCls} min-h-[56px]`} style={{ borderColor: p.border }} placeholder={`What are you telling yourself about ${p.label.toLowerCase()}?`} value={p.belief} onChange={e => p.setBelief(e.target.value)} />
                </div>
                <div className="bg-white rounded-lg p-2.5 border" style={{ borderColor: p.border }}>
                  <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: p.color }}>Challenge: {p.healthyQ}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 mb-1">Optimistic reframe:</div>
                  <textarea className={`${textareaCls} min-h-[56px]`} style={{ borderColor: p.border }} placeholder="A more accurate, balanced explanation…" value={p.reframe} onChange={e => p.setReframe(e.target.value)} />
                </div>
              </div>
            ))}

            {/* PERMA in context */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-yellow-700 mb-2">② PERMA Snapshot in this Context</div>
              <div className="space-y-2">
                {DEFAULT_PERMA.map((pillar, idx) => (
                  <div key={pillar.id} className="flex items-center gap-3">
                    <span className="text-base w-6 shrink-0">{pillar.emoji}</span>
                    <span className="text-xs font-bold text-slate-700 w-28 shrink-0">{pillar.label}</span>
                    <input type="range" min={0} max={10} value={sessionPerma[idx]?.rating ?? 5}
                      onChange={e => setSessionPerma(prev => prev.map((p, i) => i === idx ? { ...p, rating: Number(e.target.value) } : p))}
                      className="flex-1 h-1.5 rounded-full outline-none cursor-pointer" style={{ accentColor: '#ca8a04' }} />
                    <span className="text-xs font-black text-yellow-600 w-6 text-right">{sessionPerma[idx]?.rating ?? 5}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hopeful Explanation */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-yellow-700 mb-2">③ Hopeful Explanatory Statement</div>
              <p className="text-[11px] text-slate-500 mb-2 font-medium">Write one integrated, realistic, and hopeful explanation of this setback using all three reframes.</p>
              <textarea className={textareaCls} placeholder="'This setback happened because… (specific, external factors included). It affects this particular area, not all of my life. And it is likely to change because…'" value={hopefulExplanation} onChange={e => setHopefulExplanation(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={!setback.trim() || saved}
                className="flex-1 py-3 rounded-xl font-black text-sm text-white transition active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: saved ? '#16a34a' : 'linear-gradient(135deg, #ca8a04, #facc15)' }}>
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Gym Session'}
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
                    <div className="text-xs font-black text-slate-800 line-clamp-1">{session.setback}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{session.date}</div>
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
                        {[
                          { label: 'Personalization Reframe', val: session.personalizationReframe, color: '#dc2626' },
                          { label: 'Pervasiveness Reframe', val: session.pervasivenessReframe, color: '#d97706' },
                          { label: 'Permanence Reframe', val: session.permanenceReframe, color: '#7c3aed' },
                        ].filter(r => r.val).map(r => (
                          <div key={r.label}><div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: r.color }}>{r.label}</div><p className="text-xs text-slate-700 font-medium">{r.val}</p></div>
                        ))}
                        {session.hopefulExplanation && <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200"><div className="text-[9px] font-black uppercase tracking-widest text-yellow-700 mb-1">Hopeful Explanation</div><p className="text-xs text-yellow-900 font-bold">"{session.hopefulExplanation}"</p></div>}
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
          <div className="text-4xl mb-3">☀️</div>
          <p className="text-sm font-semibold">No sessions yet.</p>
          <p className="text-xs font-medium mt-1">Rate your PERMA pillars, then run a 3P dismantling session.</p>
        </div>
      )}
    </div>
  );
}
