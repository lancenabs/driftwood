import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Compass, RotateCcw, Plus, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface MeaningEntry {
  id: string;
  date: string;
  situation: string;
  attitudeChoice: string;
  canControl: string[];
  mustAccept: string;
  paradoxIntent: string;
  paradoxReframe: string;
}

const ATTITUDE_PROMPTS = [
  'I cannot change this situation, but I choose to respond with…',
  'The suffering here holds meaning because…',
  'Even in this, I still have the freedom to choose…',
  'This challenge is calling me toward…',
];

const PARADOX_TEMPLATES = [
  'Instead of trying NOT to {anxiety}, I will intentionally and dramatically {anxiety} for 5 minutes…',
  'I will schedule {worry} as my official 10-minute "worry appointment" at {time}…',
  'Rather than avoid the fear, I will lean into it by…',
];

export default function ExistentialMeaningSpace() {
  const [entries, setEntries] = useState<MeaningEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('therapy_existential_logs') || '[]'); } catch { return []; }
  });
  const [activeEntry, setActiveEntry] = useState<MeaningEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [situation, setSituation] = useState('');
  const [attitudeChoice, setAttitudeChoice] = useState('');
  const [controlItems, setControlItems] = useState<string[]>(['']);
  const [mustAccept, setMustAccept] = useState('');
  const [anxiety, setAnxiety] = useState('');
  const [paradoxReframe, setParadoxReframe] = useState('');
  const [attitudePromptIdx, setAttitudePromptIdx] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('therapy_existential_logs', JSON.stringify(entries));
  }, [entries]);

  const resetForm = () => {
    setSituation('');
    setAttitudeChoice('');
    setControlItems(['']);
    setMustAccept('');
    setAnxiety('');
    setParadoxReframe('');
    setSaved(false);
  };

  const handleSave = () => {
    if (!situation.trim() || !attitudeChoice.trim()) return;
    const entry: MeaningEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      situation: situation.trim(),
      attitudeChoice: attitudeChoice.trim(),
      canControl: controlItems.filter(c => c.trim()),
      mustAccept: mustAccept.trim(),
      paradoxIntent: anxiety.trim(),
      paradoxReframe: paradoxReframe.trim(),
    };
    setEntries(prev => [entry, ...prev]);
    setSaved(true);
    setTimeout(() => { resetForm(); setShowForm(false); }, 1200);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const inputCls = 'w-full border-2 border-slate-200 focus:border-amber-500 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none transition bg-white placeholder:text-slate-400 font-medium';
  const textareaCls = `${inputCls} resize-none min-h-[80px]`;

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #78350f, #b45309, #d97706)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🕯️</div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Viktor Frankl · Logotherapy</div>
            <h2 className="text-lg font-black leading-tight">Existential Meaning Space</h2>
          </div>
        </div>
        <p className="text-xs text-amber-100 leading-relaxed font-medium">
          "Between stimulus and response there is a space. In that space is our power to choose our response." Logotherapy holds that meaning — not pleasure or power — is humanity's primary drive. Use this space to locate yours.
        </p>
      </div>

      {/* Three pillars */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🔥', label: 'Will to Meaning', desc: 'Finding purpose in suffering' },
          { icon: '🪟', label: 'Freedom of Attitude', desc: 'Choose your response always' },
          { icon: '🔄', label: 'Paradoxical Intent', desc: 'Defuse anticipatory anxiety' },
        ].map(p => (
          <div key={p.label} className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <div className="text-xl mb-1">{p.icon}</div>
            <div className="text-[10px] font-black text-amber-900 uppercase tracking-wide">{p.label}</div>
            <div className="text-[9px] text-amber-700 mt-0.5 font-medium">{p.desc}</div>
          </div>
        ))}
      </div>

      {/* New Entry Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white transition active:scale-95"
          style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}
        >
          <Plus className="w-4 h-4" /> New Meaning Analysis
        </button>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border-2 border-amber-200 rounded-2xl p-5 space-y-5"
          >
            {/* Block 1: Situation */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">① The Situation You Cannot Change</div>
              <textarea
                className={textareaCls}
                placeholder="Describe the difficult situation or suffering you're facing that you cannot change or escape..."
                value={situation}
                onChange={e => setSituation(e.target.value)}
              />
            </div>

            {/* Block 2: Attitude Choice */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">② Freedom of Attitude</div>
              <div className="flex gap-2 mb-2 flex-wrap">
                {ATTITUDE_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => { setAttitudePromptIdx(i); setAttitudeChoice(p); }}
                    className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition ${attitudePromptIdx === i ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-50 text-amber-700 border-amber-200'}`}
                  >
                    Prompt {i + 1}
                  </button>
                ))}
              </div>
              <textarea
                className={textareaCls}
                placeholder={ATTITUDE_PROMPTS[attitudePromptIdx]}
                value={attitudeChoice}
                onChange={e => setAttitudeChoice(e.target.value)}
              />
            </div>

            {/* Block 3: Sphere of Freedom */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">③ Sphere of Freedom — What Can I Still Control?</div>
              <div className="space-y-2">
                {controlItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className={`${inputCls} flex-1`}
                      placeholder={`Controllable action ${idx + 1}…`}
                      value={item}
                      onChange={e => {
                        const updated = [...controlItems];
                        updated[idx] = e.target.value;
                        setControlItems(updated);
                      }}
                    />
                    {idx > 0 && (
                      <button onClick={() => setControlItems(prev => prev.filter((_, i) => i !== idx))} className="p-2 text-slate-400 hover:text-rose-500 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => setControlItems(p => [...p, ''])} className="text-[11px] font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add another
                </button>
              </div>
              <div className="mt-3">
                <div className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">What must I accept / cannot control?</div>
                <input className={inputCls} placeholder="The part I must surrender to…" value={mustAccept} onChange={e => setMustAccept(e.target.value)} />
              </div>
            </div>

            {/* Block 4: Paradoxical Intention */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">④ Paradoxical Intention — Defuse Anticipatory Anxiety</div>
              <p className="text-[11px] text-slate-500 mb-2 font-medium">Name the anxiety you're trying NOT to have, then intentionally exaggerate it to defuse its power.</p>
              <input
                className={`${inputCls} mb-2`}
                placeholder="I'm afraid that I will… (e.g., 'embarrass myself', 'panic again')"
                value={anxiety}
                onChange={e => setAnxiety(e.target.value)}
              />
              <textarea
                className={textareaCls}
                placeholder="My paradoxical intention plan: 'I WILL try to embarrass myself as dramatically as possible by...' (humor + exaggeration breaks the anxiety loop)"
                value={paradoxReframe}
                onChange={e => setParadoxReframe(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!situation.trim() || !attitudeChoice.trim() || saved}
                className="flex-1 py-3 rounded-xl font-black text-sm text-white transition active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: saved ? '#16a34a' : 'linear-gradient(135deg, #b45309, #d97706)' }}
              >
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Analysis'}
              </button>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition active:scale-95">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Past entries */}
      {entries.length > 0 && (
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Previous Analyses</div>
          <div className="space-y-3">
            {entries.map(entry => (
              <div key={entry.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div
                  role="button"
                  tabIndex={0}
                  className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(expandedId === entry.id ? null : entry.id); } }}
                >
                  <div>
                    <div className="text-xs font-black text-slate-800 line-clamp-1">{entry.situation}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{entry.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }} aria-label="Delete entry" className="p-1.5 text-slate-300 hover:text-rose-500 transition rounded-lg">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {expandedId === entry.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedId === entry.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="p-4 space-y-3">
                        <div><div className="text-[9px] font-black uppercase tracking-widest text-amber-600 mb-1">Attitude Choice</div><p className="text-xs text-slate-700 font-medium">{entry.attitudeChoice}</p></div>
                        {entry.canControl.length > 0 && <div><div className="text-[9px] font-black uppercase tracking-widest text-amber-600 mb-1">Within My Control</div><ul className="space-y-1">{entry.canControl.map((c, i) => <li key={i} className="text-xs text-slate-700 font-medium flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-500 shrink-0" />{c}</li>)}</ul></div>}
                        {entry.mustAccept && <div><div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Must Accept</div><p className="text-xs text-slate-600 italic font-medium">{entry.mustAccept}</p></div>}
                        {entry.paradoxReframe && <div><div className="text-[9px] font-black uppercase tracking-widest text-amber-600 mb-1">Paradoxical Intention</div><p className="text-xs text-slate-700 font-medium">{entry.paradoxReframe}</p></div>}
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
          <div className="text-4xl mb-3">🕯️</div>
          <p className="text-sm font-semibold">No analyses yet.</p>
          <p className="text-xs font-medium mt-1">Start by identifying a situation you're struggling to accept.</p>
        </div>
      )}
    </div>
  );
}
