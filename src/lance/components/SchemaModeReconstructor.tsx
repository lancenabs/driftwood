import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Check, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

type SchemaMode =
  | 'vulnerable_child'
  | 'angry_child'
  | 'impulsive_child'
  | 'punitive_parent'
  | 'demanding_parent'
  | 'detached_protector'
  | 'compliant_surrenderer'
  | 'healthy_adult';

interface ModeProfile {
  id: SchemaMode;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  description: string;
  signals: string[];
  healthyAdultResponse: string;
}

const MODE_PROFILES: ModeProfile[] = [
  {
    id: 'vulnerable_child', label: 'Vulnerable Child', emoji: '😢', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe',
    description: 'Feels lonely, frightened, unloved, sad, abandoned, rejected — the core wound.',
    signals: ['Feels worthless or defective', 'Clings desperately to others', 'Feels unlovable', 'Overwhelmed by emotion'],
    healthyAdultResponse: 'Acknowledge the wound with compassion. "I see you are hurting. You were not defective — you were hurt by circumstances beyond your control. I am here now."',
  },
  {
    id: 'angry_child', label: 'Angry Child', emoji: '😤', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5',
    description: 'Rages, feels fury at unmet needs. Often activated by perceived injustice or abandonment.',
    signals: ['Explosive anger', 'Feels rage and resentment', 'Lashes out impulsively', 'Feels deeply wronged'],
    healthyAdultResponse: 'Validate the anger\'s source without enacting it. "Your anger makes sense. Your needs mattered. Let\'s find a constructive channel for this energy."',
  },
  {
    id: 'impulsive_child', label: 'Impulsive Child', emoji: '🎲', color: '#d97706', bg: '#fffbeb', border: '#fcd34d',
    description: 'Acts on immediate urges and feelings without considering consequences. Wants instant gratification.',
    signals: ['Cannot delay gratification', 'Acts without thinking', 'Difficulty tolerating frustration', 'Seeks immediate pleasure'],
    healthyAdultResponse: 'Pause and create space. "I understand this urge. Let\'s wait 10 minutes and see what we truly need here."',
  },
  {
    id: 'punitive_parent', label: 'Punitive Parent', emoji: '⚖️', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd',
    description: 'Attacks, punishes, and shames the self or others. Internalizes abusive or critical parental voices.',
    signals: ['Harsh self-criticism', 'Self-punishment', 'Shame and contempt', 'Rigid "you should" thinking'],
    healthyAdultResponse: 'Challenge the punitive voice directly. "This voice is not truth — it\'s an internalized wound. You do not deserve punishment. You deserve understanding."',
  },
  {
    id: 'demanding_parent', label: 'Demanding Parent', emoji: '📋', color: '#0891b2', bg: '#ecfeff', border: '#67e8f9',
    description: 'Sets impossibly high standards. Drives relentlessly; allows no rest or self-compassion.',
    signals: ['Perfectionism', 'Never enough thinking', 'Relentless striving', 'Cannot accept "good enough"'],
    healthyAdultResponse: 'Renegotiate the standard. "High standards serve me — but perfectionism harms me. What is genuinely good enough here?"',
  },
  {
    id: 'detached_protector', label: 'Detached Protector', emoji: '🛡️', color: '#475569', bg: '#f8fafc', border: '#cbd5e1',
    description: 'Emotionally numbs, distances from feelings and people to avoid pain. Feels disconnected.',
    signals: ['Emotional numbness', 'Detachment from others', 'Avoidance of vulnerability', 'Intellectualizes feelings'],
    healthyAdultResponse: 'Gently invite re-entry. "I notice we are withdrawn. The protection served a purpose once. Can we slowly allow feeling again, in safety?"',
  },
  {
    id: 'compliant_surrenderer', label: 'Compliant Surrenderer', emoji: '🤐', color: '#059669', bg: '#ecfdf5', border: '#6ee7b7',
    description: 'Submits to others to avoid conflict or loss. Gives up own needs to please.',
    signals: ['People-pleasing', 'Difficulty saying no', 'Suppressing own needs', 'Fear of rejection if assertive'],
    healthyAdultResponse: 'Restore agency. "My needs are valid. Yielding to keep the peace has costs. I can assert myself and still maintain connection."',
  },
  {
    id: 'healthy_adult', label: 'Healthy Adult', emoji: '🌳', color: '#16a34a', bg: '#f0fdf4', border: '#86efac',
    description: 'Balances emotion with reason, meets own needs while considering others, protects and reparents the child modes.',
    signals: ['Emotionally regulated', 'Sets healthy limits', 'Self-compassionate', 'Flexible, growth-oriented'],
    healthyAdultResponse: 'This IS the therapeutic goal. Strengthen and exercise the Healthy Adult through intentional practice, self-compassion, and reparenting work.',
  },
];

interface ReconstructionSession {
  id: string;
  date: string;
  trigger: string;
  activeModes: { id: SchemaMode; intensity: number; observations: string }[];
  coreSchema: string;
  healthyAdultScript: string;
  reparentingAction: string;
}

export default function SchemaModeReconstructor() {
  const [sessions, setSessions] = useState<ReconstructionSession[]>(() => {
    try { return JSON.parse(localStorage.getItem('therapy_schema_modes') || '[]'); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedMode, setExpandedMode] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [trigger, setTrigger] = useState('');
  const [activeModes, setActiveModes] = useState<{ id: SchemaMode; intensity: number; observations: string }[]>([]);
  const [coreSchema, setCoreSchema] = useState('');
  const [healthyAdultScript, setHealthyAdultScript] = useState('');
  const [reparentingAction, setReparentingAction] = useState('');

  useEffect(() => { localStorage.setItem('therapy_schema_modes', JSON.stringify(sessions)); }, [sessions]);

  const toggleMode = (id: SchemaMode) => {
    if (activeModes.find(m => m.id === id)) {
      setActiveModes(prev => prev.filter(m => m.id !== id));
    } else {
      setActiveModes(prev => [...prev, { id, intensity: 5, observations: '' }]);
    }
  };

  const updateActiveMode = (id: SchemaMode, field: 'intensity' | 'observations', value: any) => {
    setActiveModes(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const resetForm = () => {
    setTrigger(''); setActiveModes([]); setCoreSchema('');
    setHealthyAdultScript(''); setReparentingAction(''); setSaved(false);
  };

  const handleSave = () => {
    if (!trigger.trim() || activeModes.length === 0) return;
    const session: ReconstructionSession = {
      id: Date.now().toString(), date: new Date().toISOString().split('T')[0],
      trigger: trigger.trim(), activeModes: [...activeModes],
      coreSchema: coreSchema.trim(), healthyAdultScript: healthyAdultScript.trim(),
      reparentingAction: reparentingAction.trim(),
    };
    setSessions(prev => [session, ...prev]);
    setSaved(true);
    setTimeout(() => { resetForm(); setShowForm(false); }, 1200);
  };

  const inputCls = 'w-full border-2 border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none transition bg-white placeholder:text-slate-400 font-medium';
  const textareaCls = `${inputCls} resize-none min-h-[72px]`;

  const getProfile = (id: SchemaMode) => MODE_PROFILES.find(m => m.id === id)!;

  const MALADAPTIVE_MODES = MODE_PROFILES.filter(m => m.id !== 'healthy_adult');

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #134e4a, #0f766e, #2dd4bf)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🔧</div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Jeffrey Young · Schema Therapy</div>
            <h2 className="text-lg font-black leading-tight">Schema Mode Reconstructor</h2>
          </div>
        </div>
        <p className="text-xs text-teal-100 leading-relaxed font-medium">
          Schema therapy identifies maladaptive coping modes — emotional states and responses rooted in early unmet needs. The goal is Healthy Adult governance: recognizing activated modes, providing reparenting, and restructuring defensive responses with compassionate awareness.
        </p>
      </div>

      {/* Mode guide button */}
      <button onClick={() => setShowGuide(!showGuide)} className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-teal-700 transition active:scale-95 bg-teal-50 border-2 border-teal-200">
        {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {showGuide ? 'Hide' : 'View'} Mode Reference Guide
      </button>

      <AnimatePresence>
        {showGuide && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-2">
              {MODE_PROFILES.map(profile => (
                <div key={profile.id} className="rounded-xl border-2 overflow-hidden" style={{ borderColor: profile.border, background: profile.bg }}>
                  <button className="w-full flex items-center gap-3 p-3 text-left" onClick={() => setExpandedMode(expandedMode === profile.id ? null : profile.id)}>
                    <span className="text-xl">{profile.emoji}</span>
                    <div className="flex-1"><div className="text-xs font-black" style={{ color: profile.color }}>{profile.label}</div><div className="text-[10px] text-slate-600 font-medium line-clamp-1">{profile.description}</div></div>
                    {expandedMode === profile.id ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {expandedMode === profile.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t-2" style={{ borderColor: profile.border }}>
                        <div className="p-3 space-y-2">
                          <div>
                            <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: profile.color }}>Activation Signals</div>
                            <div className="flex flex-wrap gap-1">{profile.signals.map(s => <span key={s} className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'white', color: profile.color, border: `1px solid ${profile.border}` }}>{s}</span>)}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-black uppercase tracking-widest mb-1 text-emerald-600">Healthy Adult Response</div>
                            <p className="text-[10px] text-slate-700 font-medium italic">"{profile.healthyAdultResponse}"</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white transition active:scale-95" style={{ background: 'linear-gradient(135deg, #0f766e, #2dd4bf)' }}>
          <Plus className="w-4 h-4" /> New Mode Reconstruction
        </button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white border-2 border-teal-200 rounded-2xl p-5 space-y-5">

            {/* Trigger */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-teal-700 mb-2">① Emotional Trigger</div>
              <textarea className={textareaCls} placeholder="What happened? What triggered this emotional state? Describe the situation, interaction, or thought that activated a schema mode…" value={trigger} onChange={e => setTrigger(e.target.value)} />
            </div>

            {/* Mode detection */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-teal-700 mb-2">② Identify Active Modes</div>
              <p className="text-[11px] text-slate-500 mb-3 font-medium">Select all modes you notice activated. You can have multiple active at once.</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {MALADAPTIVE_MODES.map(profile => {
                  const isActive = !!activeModes.find(m => m.id === profile.id);
                  return (
                    <button key={profile.id} onClick={() => toggleMode(profile.id)}
                      className="p-2.5 rounded-xl border-2 text-left transition active:scale-95"
                      style={{ borderColor: isActive ? profile.color : '#e2e8f0', background: isActive ? profile.bg : 'white' }}>
                      <div className="text-base mb-0.5">{profile.emoji}</div>
                      <div className="text-[10px] font-black" style={{ color: isActive ? profile.color : '#94a3b8' }}>{profile.label}</div>
                    </button>
                  );
                })}
              </div>

              {/* Active mode details */}
              {activeModes.map(am => {
                const profile = getProfile(am.id);
                return (
                  <div key={am.id} className="mb-3 rounded-xl border-2 p-3 space-y-2" style={{ borderColor: profile.border, background: profile.bg }}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{profile.emoji}</span>
                      <div className="text-xs font-black" style={{ color: profile.color }}>{profile.label}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-slate-500 mb-1">Intensity</div>
                      <input type="range" min={1} max={10} value={am.intensity}
                        onChange={e => updateActiveMode(am.id, 'intensity', Number(e.target.value))}
                        className="w-full h-2 rounded-full outline-none cursor-pointer" style={{ accentColor: profile.color }} />
                      <div className="flex justify-between"><span className="text-[9px] text-slate-400">1 — Mild</span><span className="text-[9px] font-black" style={{ color: profile.color }}>{am.intensity}/10</span><span className="text-[9px] text-slate-400">10 — Overwhelming</span></div>
                    </div>
                    <textarea
                      className="w-full border rounded-xl px-3 py-2 text-[11px] text-slate-800 outline-none transition bg-white placeholder:text-slate-400 font-medium resize-none min-h-[56px] focus:border-teal-400"
                      style={{ borderColor: profile.border }}
                      placeholder="What thoughts, feelings, or behaviors are showing up in this mode?"
                      value={am.observations}
                      onChange={e => updateActiveMode(am.id, 'observations', e.target.value)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Core Schema */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-teal-700 mb-2">③ Underlying Schema</div>
              <p className="text-[11px] text-slate-500 mb-2 font-medium">What early maladaptive belief about yourself or the world is driving these modes?</p>
              <input className={inputCls} placeholder="e.g. 'I am fundamentally unlovable', 'The world is dangerous', 'I must achieve to have worth'…" value={coreSchema} onChange={e => setCoreSchema(e.target.value)} />
            </div>

            {/* Healthy Adult Script */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-teal-700 mb-2">④ Healthy Adult Response Script</div>
              <p className="text-[11px] text-slate-500 mb-2 font-medium">Write what your Healthy Adult says to the activated modes. Validate, reparent, and set limits where needed.</p>
              <textarea className={textareaCls} placeholder="'I see that you (Vulnerable Child) are feeling abandoned right now. That fear makes sense given your early experiences. But you are safe now. Let me show you the evidence…'" value={healthyAdultScript} onChange={e => setHealthyAdultScript(e.target.value)} />
            </div>

            {/* Reparenting Action */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-teal-700 mb-2">⑤ Reparenting Action This Week</div>
              <input className={inputCls} placeholder="One specific act of self-care, comfort, or boundary-setting that reparents the activated mode…" value={reparentingAction} onChange={e => setReparentingAction(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={!trigger.trim() || activeModes.length === 0 || saved}
                className="flex-1 py-3 rounded-xl font-black text-sm text-white transition active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: saved ? '#16a34a' : 'linear-gradient(135deg, #0f766e, #2dd4bf)' }}>
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Reconstruction'}
              </button>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition active:scale-95">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {sessions.length > 0 && (
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Previous Reconstructions</div>
          <div className="space-y-3">
            {sessions.map(session => (
              <div key={session.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div role="button" tabIndex={0} className="w-full flex items-center justify-between p-4 text-left cursor-pointer" onClick={() => setExpandedId(expandedId === session.id ? null : session.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(expandedId === session.id ? null : session.id); } }}>
                  <div>
                    <div className="text-xs font-black text-slate-800 line-clamp-1">{session.trigger}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {session.activeModes.slice(0, 3).map(am => <span key={am.id}>{getProfile(am.id).emoji}</span>)}
                      <span className="text-[10px] text-slate-400 font-medium">{session.date}</span>
                    </div>
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
                        <div className="flex flex-wrap gap-2">
                          {session.activeModes.map(am => {
                            const p = getProfile(am.id);
                            return <div key={am.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: p.bg, border: `1px solid ${p.border}` }}>
                              <span className="text-sm">{p.emoji}</span>
                              <span className="text-[10px] font-black" style={{ color: p.color }}>{p.label}</span>
                              <span className="text-[9px] font-bold text-slate-400">{am.intensity}/10</span>
                            </div>;
                          })}
                        </div>
                        {session.coreSchema && <div><div className="text-[9px] font-black uppercase tracking-widest text-teal-600 mb-1">Core Schema</div><p className="text-xs text-slate-700 font-medium italic">"{session.coreSchema}"</p></div>}
                        {session.healthyAdultScript && <div className="bg-teal-50 rounded-xl p-3 border border-teal-200"><div className="text-[9px] font-black uppercase tracking-widest text-teal-700 mb-1">Healthy Adult Script</div><p className="text-xs text-teal-900 font-medium">{session.healthyAdultScript}</p></div>}
                        {session.reparentingAction && <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200"><div className="text-[9px] font-black uppercase tracking-widest text-emerald-700 mb-1">Reparenting Action</div><p className="text-xs text-emerald-900 font-bold">"{session.reparentingAction}"</p></div>}
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
          <div className="text-4xl mb-3">🔧</div>
          <p className="text-sm font-semibold">No reconstructions yet.</p>
          <p className="text-xs font-medium mt-1">Start by naming an emotional trigger to identify active schema modes.</p>
        </div>
      )}
    </div>
  );
}
