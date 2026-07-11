import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Check, ChevronDown, ChevronUp, ArrowLeftRight } from 'lucide-react';

interface DialogLine {
  speaker: 'topdog' | 'underdog' | 'empty_chair';
  text: string;
}

interface ChairSession {
  id: string;
  date: string;
  chairTarget: string;
  chairTargetType: 'person' | 'part_of_self' | 'situation' | 'feeling';
  topdogLabel: string;
  underdogLabel: string;
  dialog: DialogLine[];
  somaticObservation: string;
  unfinishedBusiness: string;
  integration: string;
  actionStep: string;
}

const CHAIR_TARGET_TYPES = [
  { id: 'person', label: 'Another Person', desc: 'An important figure you need to speak to', emoji: '🧑' },
  { id: 'part_of_self', label: 'Part of Self', desc: 'Inner critic, wounded child, protector…', emoji: '🔀' },
  { id: 'situation', label: 'A Situation', desc: 'A loss, transition, or unresolved event', emoji: '📍' },
  { id: 'feeling', label: 'A Feeling', desc: 'Anger, grief, shame, fear made tangible', emoji: '💭' },
];

const TOPDOG_LABELS = ['Inner Critic', 'Perfectionist', 'Controlling Part', 'Angry Self', 'Rule-Maker', 'Harsh Judge'];
const UNDERDOG_LABELS = ['Wounded Child', 'Helpless Part', 'Resistant Self', 'Avoidant Part', 'Shamed Self', 'Fearful Part'];

const SPEAKER_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  topdog: { label: 'Topdog', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  underdog: { label: 'Underdog', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  empty_chair: { label: 'Empty Chair', color: '#6d28d9', bg: '#f5f3ff', border: '#c4b5fd' },
};

export default function GestaltChairIntegration() {
  const [sessions, setSessions] = useState<ChairSession[]>(() => {
    try { return JSON.parse(localStorage.getItem('therapy_gestalt_chair') || '[]'); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'topdog' | 'underdog' | 'empty_chair'>('topdog');

  const [chairTarget, setChairTarget] = useState('');
  const [chairTargetType, setChairTargetType] = useState<ChairSession['chairTargetType']>('part_of_self');
  const [topdogLabel, setTopdogLabel] = useState('Inner Critic');
  const [underdogLabel, setUnderdogLabel] = useState('Wounded Child');
  const [dialog, setDialog] = useState<DialogLine[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [somaticObservation, setSomaticObservation] = useState('');
  const [unfinishedBusiness, setUnfinishedBusiness] = useState('');
  const [integration, setIntegration] = useState('');
  const [actionStep, setActionStep] = useState('');

  useEffect(() => { localStorage.setItem('therapy_gestalt_chair', JSON.stringify(sessions)); }, [sessions]);

  const addLine = () => {
    if (!currentLine.trim()) return;
    setDialog(prev => [...prev, { speaker: activeSpeaker, text: currentLine.trim() }]);
    setCurrentLine('');
    if (activeSpeaker === 'topdog') setActiveSpeaker('underdog');
    else if (activeSpeaker === 'underdog') setActiveSpeaker('topdog');
  };

  const removeLine = (idx: number) => setDialog(prev => prev.filter((_, i) => i !== idx));

  const resetForm = () => {
    setChairTarget(''); setChairTargetType('part_of_self'); setTopdogLabel('Inner Critic');
    setUnderdogLabel('Wounded Child'); setDialog([]); setCurrentLine('');
    setSomaticObservation(''); setUnfinishedBusiness(''); setIntegration(''); setActionStep(''); setSaved(false);
    setActiveSpeaker('topdog');
  };

  const handleSave = () => {
    if (!chairTarget.trim() || dialog.length === 0) return;
    const session: ChairSession = {
      id: Date.now().toString(), date: new Date().toISOString().split('T')[0],
      chairTarget: chairTarget.trim(), chairTargetType, topdogLabel, underdogLabel,
      dialog: [...dialog], somaticObservation: somaticObservation.trim(),
      unfinishedBusiness: unfinishedBusiness.trim(), integration: integration.trim(), actionStep: actionStep.trim(),
    };
    setSessions(prev => [session, ...prev]);
    setSaved(true);
    setTimeout(() => { resetForm(); setShowForm(false); }, 1200);
  };

  const inputCls = 'w-full border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none transition bg-white placeholder:text-slate-400 font-medium';
  const textareaCls = `${inputCls} resize-none min-h-[72px]`;

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ background: '#8B5CF618' }}>🪑</div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#7C3AED' }}>Fritz Perls · Gestalt Therapy</div>
            <h2 className="text-lg font-black leading-tight" style={{ color: '#3C3C3C' }}>Gestalt Chair Integration</h2>
          </div>
        </div>
        <p className="text-xs leading-relaxed font-medium" style={{ color: '#6B7280' }}>
          "Lose your mind and come to your senses." Gestalt therapy works with unfinished business, present-moment awareness, and polarization. The two-chair technique externalizes inner conflict — giving voice to both the Topdog (the critical, controlling part) and Underdog (the resistant, helpless part) — toward integration.
        </p>
      </div>

      {/* Concepts */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🔴', label: 'Topdog', desc: 'Critic, controller, demander' },
          { icon: '🔵', label: 'Underdog', desc: 'Resistant, helpless, avoidant' },
          { icon: '🪑', label: 'Empty Chair', desc: 'Speak to the other / self-part' },
        ].map(p => (
          <div key={p.label} className="rounded-2xl p-3 text-center bg-white" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #EDE4FF' }}>
            <div className="text-xl mb-1">{p.icon}</div>
            <div className="text-[10px] font-black uppercase tracking-wide" style={{ color: '#3C3C3C' }}>{p.label}</div>
            <div className="text-[10px] mt-0.5 font-medium" style={{ color: '#6B7280' }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {!showForm && (
        <motion.button whileTap={{ y: 3, boxShadow: 'none' }} onClick={() => setShowForm(true)} className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white" style={{ background: 'linear-gradient(135deg, #8B5CF6, #CE82FF)', boxShadow: '0 5px 0 #7C3AED' }}>
          <Plus className="w-4 h-4" /> Start Chair Dialog
        </motion.button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white border-2 border-purple-200 rounded-2xl p-5 space-y-5">

            {/* Chair target */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-purple-700 mb-2">① Who or What is in the Empty Chair?</div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {CHAIR_TARGET_TYPES.map(t => (
                  <button key={t.id} onClick={() => setChairTargetType(t.id as ChairSession['chairTargetType'])}
                    className={`p-2.5 rounded-xl border-2 text-left transition ${chairTargetType === t.id ? 'bg-purple-100 border-purple-400' : 'bg-white border-slate-200'}`}>
                    <div className="text-base mb-0.5">{t.emoji}</div>
                    <div className="text-[10px] font-black text-slate-800">{t.label}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{t.desc}</div>
                  </button>
                ))}
              </div>
              <input className={inputCls} placeholder="Name who / what is in the empty chair (e.g. 'My father', 'My inner critic', 'My grief')" value={chairTarget} onChange={e => setChairTarget(e.target.value)} />
            </div>

            {/* Label the parts */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">🔴 Topdog Label</div>
                <div className="flex flex-wrap gap-1.5">
                  {TOPDOG_LABELS.map(l => (
                    <button key={l} onClick={() => setTopdogLabel(l)}
                      className={`text-[10px] font-bold px-2.5 py-2 rounded-lg border transition ${topdogLabel === l ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 text-red-700 border-red-200'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">🔵 Underdog Label</div>
                <div className="flex flex-wrap gap-1.5">
                  {UNDERDOG_LABELS.map(l => (
                    <button key={l} onClick={() => setUnderdogLabel(l)}
                      className={`text-[10px] font-bold px-2.5 py-2 rounded-lg border transition ${underdogLabel === l ? 'bg-blue-500 text-white border-blue-500' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{l}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dialog interface */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-purple-700 mb-1">② The Dialog</div>
              <p className="text-[11px] font-medium mb-3" style={{ color: '#9CA3AF' }}>Take turns speaking as the Topdog (critical, controlling voice) and Underdog (resistant, helpless voice) to externalize the inner conflict.</p>

              {/* Speaker selector */}
              <div className="flex gap-2 mb-3">
                {(['topdog', 'underdog', 'empty_chair'] as const).map(s => {
                  const st = SPEAKER_STYLES[s];
                  return (
                    <button key={s} onClick={() => setActiveSpeaker(s)}
                      className="flex-1 py-2.5 min-h-[40px] rounded-xl text-[10px] font-black border-2 transition"
                      style={{ borderColor: activeSpeaker === s ? st.color : '#e2e8f0', background: activeSpeaker === s ? st.bg : 'white', color: activeSpeaker === s ? st.color : '#94a3b8' }}>
                      {s === 'topdog' ? topdogLabel : s === 'underdog' ? underdogLabel : 'Empty Chair'}
                    </button>
                  );
                })}
              </div>

              {/* Current line input */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-2.5 text-[10px] font-black uppercase tracking-widest" style={{ color: SPEAKER_STYLES[activeSpeaker].color }}>
                    {activeSpeaker === 'topdog' ? topdogLabel : activeSpeaker === 'underdog' ? underdogLabel : 'Empty Chair'} says:
                  </div>
                  <input
                    className="w-full border-2 rounded-xl px-3 pt-7 pb-2.5 text-sm text-slate-800 outline-none transition bg-white placeholder:text-slate-400 font-medium"
                    style={{ borderColor: SPEAKER_STYLES[activeSpeaker].border }}
                    placeholder="Speak from this position…"
                    value={currentLine}
                    onChange={e => setCurrentLine(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addLine()}
                  />
                </div>
                <button onClick={addLine} disabled={!currentLine.trim()} className="w-11 min-h-[40px] rounded-xl text-white font-bold text-sm transition active:scale-95 disabled:opacity-40 flex items-center justify-center shrink-0" style={{ background: SPEAKER_STYLES[activeSpeaker].color }}>
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dialog transcript */}
              {dialog.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {dialog.map((line, idx) => {
                    const st = SPEAKER_STYLES[line.speaker];
                    const isLeft = line.speaker === 'topdog';
                    const isRight = line.speaker === 'underdog';
                    return (
                      <div key={idx} className={`flex gap-2 ${isRight ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex-1 px-3 py-2 rounded-xl border text-xs font-medium ${isRight ? 'text-right' : ''}`} style={{ background: st.bg, borderColor: st.border, color: '#1e293b' }}>
                          <div className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: st.color }}>
                            {line.speaker === 'topdog' ? topdogLabel : line.speaker === 'underdog' ? underdogLabel : 'Empty Chair'}
                          </div>
                          "{line.text}"
                        </div>
                        <button onClick={() => removeLine(idx)} className="self-start w-9 h-9 flex items-center justify-center text-slate-300 hover:text-rose-500 transition shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Somatic observation */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-purple-700 mb-2">③ Somatic Awareness (Now)</div>
              <p className="text-[11px] text-slate-500 mb-2 font-medium">Gestalt is body-centered. What physical sensations are present as you do this work?</p>
              <textarea className={textareaCls} placeholder="I notice tension in… heat in my chest… constriction around… a pulling sensation at…" value={somaticObservation} onChange={e => setSomaticObservation(e.target.value)} />
            </div>

            {/* Unfinished business */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-purple-700 mb-2">④ Unfinished Business</div>
              <textarea className={textareaCls} placeholder="What has been left unsaid, unexpressed, or unresolved? What still needs to be acknowledged?" value={unfinishedBusiness} onChange={e => setUnfinishedBusiness(e.target.value)} />
            </div>

            {/* Integration */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-purple-700 mb-2">⑤ Integration — What does the Healthy Self say?</div>
              <textarea className={textareaCls} placeholder="Now speaking from the Integrated/Healthy adult self — holding BOTH the Topdog and Underdog with awareness — what is true?" value={integration} onChange={e => setIntegration(e.target.value)} />
            </div>

            {/* Action step */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-purple-700 mb-2">⑥ Concrete Action Step</div>
              <input className={inputCls} placeholder="One specific action emerging from this integration…" value={actionStep} onChange={e => setActionStep(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={!chairTarget.trim() || dialog.length === 0 || saved}
                className="flex-1 py-3 rounded-xl font-black text-sm text-white transition active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: saved ? '#16a34a' : 'linear-gradient(135deg, #6d28d9, #a855f7)' }}>
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Dialog Session'}
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
                    <div className="text-xs font-black text-slate-800">Chair: "{session.chairTarget}"</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{session.date} · {session.dialog.length} exchanges · {session.topdogLabel} vs {session.underdogLabel}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setSessions(prev => prev.filter(s => s.id !== session.id)); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 transition rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    {expandedId === session.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedId === session.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-100">
                      <div className="p-4 space-y-3">
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {session.dialog.map((line, i) => {
                            const st = SPEAKER_STYLES[line.speaker];
                            return <div key={i} className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg" style={{ background: st.bg, color: st.color }}><span className="font-black">{line.speaker === 'topdog' ? session.topdogLabel : line.speaker === 'underdog' ? session.underdogLabel : 'Empty Chair'}:</span> "{line.text}"</div>;
                          })}
                        </div>
                        {session.integration && <div className="bg-purple-50 rounded-xl p-3 border border-purple-200"><div className="text-[10px] font-black uppercase tracking-widest text-purple-700 mb-1">Integration</div><p className="text-xs text-purple-900 font-medium">{session.integration}</p></div>}
                        {session.actionStep && <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200"><div className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">Action Step</div><p className="text-xs text-emerald-900 font-bold">"{session.actionStep}"</p></div>}
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
          <div className="text-4xl mb-3">🪑</div>
          <p className="text-sm font-semibold">No chair sessions yet.</p>
          <p className="text-xs font-medium mt-1">Place someone or a part of yourself in the empty chair to begin.</p>
        </div>
      )}
    </div>
  );
}
